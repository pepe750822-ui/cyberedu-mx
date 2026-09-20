import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Pregunta {
  id: string;
  materia: string;
  unidad: string;
  pregunta: string;
  opcion_a: string | null;
  opcion_b: string | null;
  opcion_c: string | null;
  opcion_d: string | null;
  opcion_e: string | null;
  respuesta_correcta: string;
  orden: number | null;
}

interface EjercicioGenerado {
  pregunta: string;
  opcion_a: string;
  opcion_b: string;
  opcion_c: string;
  opcion_d: string;
  /** a/b/c/d — null cuando el modelo no indicó cuál es la correcta. */
  respuesta_correcta: string | null;
  /** Desarrollo paso a paso generado junto con el ejercicio. Puede venir vacío. */
  desarrollo?: string;
}

/** Opciones realmente presentes (soporta 2, 3 o 4 opciones). */
function opcionesDe(ejercicio: EjercicioGenerado): { letra: string; texto: string }[] {
  return (
    [
      ["a", ejercicio.opcion_a],
      ["b", ejercicio.opcion_b],
      ["c", ejercicio.opcion_c],
      ["d", ejercicio.opcion_d],
    ] as const
  )
    .filter(([, texto]) => Boolean(texto && texto.trim()))
    .map(([letra, texto]) => ({ letra, texto }));
}

// Parser tolerante de respaldo: se usa solo si el servidor devuelve texto plano
// (formato antiguo) en lugar del arreglo estructurado.
const OPCION_TEXTO_RE = /^\s*(?:\(([A-Da-d])\)|([A-Da-d])\s*[.):-])\s*(.+?)\s*$/;
const RESPUESTA_TEXTO_RE =
  /^\s*(?:la\s+)?(?:respuesta\s+correcta|respuesta|correcta|clave|inciso|opci[oó]n)\s*(?::|-|—|es\b|=\s*)\s*(?:(?:opci[oó]n|inciso|letra)\s+)?\(?\s*([A-Da-d])\b/i;

function parseEjerciciosTexto(texto: string): EjercicioGenerado[] {
  const limpio = texto.replace(/\r\n?/g, "\n").replace(/\*\*|__/g, "");
  const ejercicios: EjercicioGenerado[] = [];
  let pregunta: string[] = [];
  let opciones = new Map<string, string>();
  let respuesta: string | null = null;

  const cerrar = () => {
    const textoPregunta = pregunta
      .join(" ")
      .replace(/^\s*\d{1,2}\s*[.)-]\s*/, "")
      .replace(/\s+/g, " ")
      .trim();
    if (textoPregunta && opciones.size >= 2) {
      ejercicios.push({
        pregunta: textoPregunta,
        opcion_a: opciones.get("a") ?? "",
        opcion_b: opciones.get("b") ?? "",
        opcion_c: opciones.get("c") ?? "",
        opcion_d: opciones.get("d") ?? "",
        respuesta_correcta: respuesta,
      });
    }
    pregunta = [];
    opciones = new Map<string, string>();
    respuesta = null;
  };

  for (const linea of limpio.split("\n")) {
    const t = linea.trim();
    if (!t) continue;

    const numerada = t.match(/^\s*\d{1,2}\s*[.)-]\s+(.*)$/);
    if (numerada) {
      cerrar();
      pregunta = [numerada[1]];
      continue;
    }

    if (RESPUESTA_TEXTO_RE.test(t)) {
      const m = t.match(RESPUESTA_TEXTO_RE);
      if (m) respuesta = m[1].toLowerCase();
      continue;
    }

    const m = t.match(OPCION_TEXTO_RE);
    if (m) {
      const letra = (m[1] ?? m[2]).toLowerCase();
      const valor = (m[3] ?? "").trim();
      if (letra === "a" && opciones.has("a")) cerrar();
      if (valor) opciones.set(letra, valor);
      continue;
    }

    if (opciones.size > 0) {
      cerrar();
      pregunta = [t];
    } else {
      pregunta.push(t);
    }
  }
  cerrar();
  return ejercicios;
}

async function pedirExplicacionEjercicio(ejercicio: EjercicioGenerado, materia: string): Promise<string> {
  const res = await fetch("/api/video-content", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      titulo: ejercicio.pregunta,
      materia: materia || "Matemáticas IV ENP UNAM",
      tipo: "ejercicio",
      modo: "desarrollo"
    }),
  });
  if (!res.ok) throw new Error(`Error del servidor: ${res.status}`);
  const data = await res.json();
  return data.content ?? "Sin explicación disponible.";
}

const OPCIONES = ["a", "b", "c", "d", "e"] as const;

const etiqueta = (letra: string) => letra.toUpperCase();

function opcionTexto(pregunta: Pregunta, letra: string): string | null {
  return pregunta[`opcion_${letra.toLowerCase()}` as keyof Pregunta] as string | null;
}

async function pedirExplicacion(pregunta: Pregunta): Promise<string> {
  const res = await fetch("/api/video-content", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      titulo: pregunta.pregunta,
      materia: pregunta.materia || "Matemáticas IV ENP UNAM",
      modo: "desarrollo",
    }),
  });
  if (!res.ok) throw new Error(`Error del servidor: ${res.status}`);
  const data = await res.json();
  return data.content ?? "Sin explicación disponible.";
}

interface RespuestaEjercicios {
  ok?: boolean;
  ejercicios?: EjercicioGenerado[] | string;
  raw?: string;
  error?: string;
  detail?: string;
  stage?: string;
}

async function fetchEjerciciosDesdeAPI(pregunta: Pregunta): Promise<EjercicioGenerado[]> {
  const res = await fetch("/api/generar-ejercicios", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pregunta: pregunta.pregunta }),
  });

  let data: RespuestaEjercicios | null = null;
  try {
    data = (await res.json()) as RespuestaEjercicios;
  } catch {
    data = null;
  }

  // El servidor ahora devuelve siempre el motivo real del fallo.
  if (!res.ok || data?.ok === false) {
    const partes = [data?.error, data?.detail].filter(Boolean) as string[];
    console.error("[Practica más] El endpoint devolvió un error", {
      status: res.status,
      stage: data?.stage,
      error: data?.error,
      detail: data?.detail,
    });
    throw new Error(partes.length ? partes.join(" — ") : `Error del servidor: ${res.status}`);
  }

  // Formato nuevo: arreglo ya estructurado por el servidor.
  if (Array.isArray(data?.ejercicios)) {
    return data.ejercicios.filter((e) => Boolean(e && e.pregunta));
  }

  // Compatibilidad con el formato anterior: texto plano que hay que parsear.
  const texto = typeof data?.ejercicios === "string" ? data.ejercicios : data?.raw ?? "";
  if (!texto.trim()) {
    throw new Error("El servidor devolvió una respuesta vacía al generar los ejercicios");
  }
  return parseEjerciciosTexto(texto);
}

/** Unidades del simulador, en el orden en que se muestran en el selector. */
const UNIDADES_BASE = [
  "Números Naturales",
  "Números Enteros",
  "Números Racionales",
  "Números Reales",
];

/** Valor centinela de la opción "Todos los temas (aleatorio)". */
const TODAS_LAS_UNIDADES = "__todas__";

/** Compara unidades ignorando acentos, mayúsculas y espacios sobrantes. */
function normalizarUnidad(valor: string): string {
  return valor
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

/** Mezcla aleatoria (Fisher-Yates) sin mutar el arreglo recibido. */
function mezclar<T>(items: T[]): T[] {
  const copia = [...items];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

export default function SimuladorPrepa() {
  const [preguntas, setPreguntas] = useState<Pregunta[]>([]);
  const [indice, setIndice] = useState(0);
  const [cargando, setCargando] = useState(true);
  const [seleccion, setSeleccion] = useState<string | null>(null);
  const [explicacion, setExplicacion] = useState<string | null>(null);
  const [cargandoExplicacion, setCargandoExplicacion] = useState(false);
  const [ejercicios, setEjercicios] = useState<EjercicioGenerado[] | null>(null);
  const [cargandoEjercicios, setCargandoEjercicios] = useState(false);
  const [errorEjercicios, setErrorEjercicios] = useState<string | null>(null);
  // State for each generated exercise (max 2)
  const [seleccionEjercicio, setSeleccionEjercicio] = useState<(string | null)[]>([null, null]);
  const [explicacionEjercicio, setExplicacionEjercicio] = useState<(string | null)[]>([null, null]);
  const [cargandoExplicacionEjercicio, setCargandoExplicacionEjercicio] = useState<boolean[]>([false, false]);
  const [correctas, setCorrectas] = useState(0);
  const [terminado, setTerminado] = useState(false);
  /** Unidad elegida en el selector. `null` = todavía no se ha empezado. */
  const [unidadFiltro, setUnidadFiltro] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("preguntas_prepa")
        .select("*")
        .order("orden", { ascending: true });

      if (error) {
        toast.error("Error al cargar las preguntas");
        setCargando(false);
        return;
      }
      if (!data || data.length === 0) {
        toast.error("No hay preguntas disponibles aún");
        setCargando(false);
        return;
      }
      setPreguntas(data as Pregunta[]);
      setCargando(false);
    })();
  }, []);

  // Unidades ofrecidas: las de UNIDADES_BASE que tengan preguntas y, si algún
  // día se agrega otra unidad a la tabla, también aparece en vez de quedar
  // inaccesible desde el selector.
  const unidadesDisponibles = useMemo(() => {
    const presentes = new Set(
      preguntas.map((p) => normalizarUnidad(p.unidad ?? "")).filter(Boolean),
    );
    const extra = [
      ...new Set(
        preguntas
          .map((p) => (p.unidad ?? "").trim())
          .filter(
            (u) =>
              u &&
              !UNIDADES_BASE.some((base) => normalizarUnidad(base) === normalizarUnidad(u)),
          ),
      ),
    ];
    return [...UNIDADES_BASE, ...extra].filter((u) =>
      presentes.has(normalizarUnidad(u)),
    );
  }, [preguntas]);

  const conteoPorUnidad = useMemo(() => {
    const mapa = new Map<string, number>();
    for (const p of preguntas) {
      const clave = normalizarUnidad(p.unidad ?? "");
      if (clave) mapa.set(clave, (mapa.get(clave) ?? 0) + 1);
    }
    return mapa;
  }, [preguntas]);

  // Preguntas de la sesión actual. En "Todos los temas" se mezclan una sola vez
  // por sesión (el memo solo se recalcula al cambiar de unidad o al recargar).
  const preguntasSesion = useMemo(() => {
    if (unidadFiltro === null) return [] as Pregunta[];
    if (unidadFiltro === TODAS_LAS_UNIDADES) return mezclar(preguntas);
    const objetivo = normalizarUnidad(unidadFiltro);
    return preguntas.filter((p) => normalizarUnidad(p.unidad ?? "") === objetivo);
  }, [preguntas, unidadFiltro]);

  const preguntaActual = preguntasSesion[indice];

  const generarEjercicios = async (pregunta: Pregunta) => {
    setErrorEjercicios(null);
    setEjercicios(null);
    setCargandoEjercicios(true);
    try {
      const parsed = await fetchEjerciciosDesdeAPI(pregunta);
      if (parsed.length === 0) {
        throw new Error("El servidor no devolvió ejercicios con el formato esperado");
      }
      setEjercicios(parsed);
    } catch (error) {
      const mensaje = error instanceof Error ? error.message : String(error);
      console.error("[Practica más] Error al generar ejercicios:", error);
      setErrorEjercicios(mensaje);
      setEjercicios(null);
    } finally {
      setCargandoEjercicios(false);
    }
  };

  const handleSeleccion = async (letra: string) => {
    if (seleccion !== null) return;
    setSeleccion(letra);

    const esCorrecta = letra.toUpperCase() === preguntaActual.respuesta_correcta.trim().toUpperCase();
    if (esCorrecta) setCorrectas((c) => c + 1);

    setCargandoExplicacion(true);
    try {
      const exp = await pedirExplicacion(preguntaActual);
      setExplicacion(exp);
    } catch {
      setExplicacion("No se pudo obtener la explicación. Intenta de nuevo.");
    } finally {
      setCargandoExplicacion(false);
    }

    // Generar 2 ejercicios similares con el mismo tema
    await generarEjercicios(preguntaActual);
  };

  /** Arranca una sesión nueva. Con `unidad = null` vuelve al selector. */
  const iniciarSesion = (unidad: string | null) => {
    setUnidadFiltro(unidad);
    setIndice(0);
    setSeleccion(null);
    setExplicacion(null);
    setEjercicios(null);
    setErrorEjercicios(null);
    setSeleccionEjercicio([null, null]);
    setExplicacionEjercicio([null, null]);
    setCargandoExplicacionEjercicio([false, false]);
    setCorrectas(0);
    setTerminado(false);
  };

  const handleSiguiente = () => {
    if (indice + 1 >= preguntasSesion.length) {
      setTerminado(true);
      return;
    }
    setIndice((i) => i + 1);
    setSeleccion(null);
    setExplicacion(null);
    setEjercicios(null);
    setErrorEjercicios(null);
    setSeleccionEjercicio([null, null]);
    setExplicacionEjercicio([null, null]);
    setCargandoExplicacionEjercicio([false, false]);
  };

  /** Vuelve al selector para poder elegir otra unidad. */
  const handleReiniciar = () => iniciarSesion(null);

  if (cargando) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Cargando preguntas...</p>
        </div>
      </div>
    );
  }

  if (preguntas.length === 0) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <p className="text-slate-400 text-center px-6">
          No hay preguntas disponibles. Agrega preguntas a la tabla <code className="text-emerald-400">preguntas_prepa</code> en Supabase.
        </p>
      </div>
    );
  }

  // ── Selector de unidad ────────────────────────────────────────
  if (unidadFiltro === null) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
        <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 max-w-md w-full">
          <div className="text-center mb-6">
            <div className="text-5xl mb-3">📐</div>
            <h1 className="text-2xl font-bold text-white mb-1">Simulador Prepa</h1>
            <p className="text-slate-400 text-sm">Matemáticas IV — ENP UNAM</p>
          </div>

          <p className="text-slate-300 text-sm font-medium mb-3">Elige una unidad:</p>

          <div className="space-y-3">
            <button
              onClick={() => iniciarSesion(TODAS_LAS_UNIDADES)}
              className="w-full text-left px-4 py-3 rounded-xl border border-emerald-500/40 bg-emerald-600/10 hover:bg-emerald-600/20 hover:border-emerald-500 active:scale-[0.98] transition-all duration-200 flex items-center gap-3"
            >
              <span className="shrink-0">🎲</span>
              <span className="flex-1 text-emerald-300 font-semibold text-sm">
                Todos los temas (aleatorio)
              </span>
              <span className="shrink-0 text-emerald-400/70 text-xs font-medium">
                {preguntas.length}
              </span>
            </button>

            {unidadesDisponibles.map((unidad) => (
              <button
                key={unidad}
                onClick={() => iniciarSesion(unidad)}
                className="w-full text-left px-4 py-3 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 hover:border-slate-500 active:scale-[0.98] transition-all duration-200 flex items-center gap-3"
              >
                <span className="flex-1 text-slate-100 font-medium text-sm">{unidad}</span>
                <span className="shrink-0 text-slate-400 text-xs font-medium">
                  {conteoPorUnidad.get(normalizarUnidad(unidad)) ?? 0}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Unidad sin preguntas: no debería ocurrir, pero evita una pantalla en blanco.
  if (preguntasSesion.length === 0) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
        <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 max-w-md w-full text-center">
          <div className="text-5xl mb-4">📭</div>
          <p className="text-slate-300 mb-6">
            Todavía no hay preguntas de{" "}
            <span className="text-emerald-400 font-semibold">
              {unidadFiltro === TODAS_LAS_UNIDADES ? "este simulador" : unidadFiltro}
            </span>
            .
          </p>
          <button
            onClick={handleReiniciar}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 rounded-xl transition-colors"
          >
            Elegir otra unidad
          </button>
        </div>
      </div>
    );
  }

  if (terminado) {
    const total = preguntasSesion.length;
    const pct = Math.round((correctas / total) * 100);
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
        <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">{pct >= 70 ? "🎉" : "📚"}</div>
          <h2 className="text-2xl font-bold text-white mb-2">Simulacro terminado</h2>
          <p className="text-slate-400 mb-1">Matemáticas IV — ENP UNAM</p>
          <p className="text-emerald-400 text-sm mb-6">
            {unidadFiltro === TODAS_LAS_UNIDADES ? "🎲 Todos los temas" : unidadFiltro}
          </p>
          <div className="bg-slate-800 rounded-xl p-6 mb-6">
            <div className="text-5xl font-bold text-emerald-400 mb-1">{pct}%</div>
            <div className="text-slate-400 text-sm">{correctas} de {total} correctas</div>
          </div>
          <button
            onClick={handleReiniciar}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 rounded-xl transition-colors"
          >
            🔄 Elegir otra unidad
          </button>
        </div>
      </div>
    );
  }

  const opciones = OPCIONES.filter((l) => opcionTexto(preguntaActual, l) !== null);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-lg font-bold text-emerald-400">🏫 Matemáticas IV</h1>
            <p className="text-xs text-slate-500">ENP UNAM — Preparatoria</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-slate-400">Pregunta</div>
            <div className="text-xl font-bold text-white">{indice + 1} / {preguntasSesion.length}</div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-2 bg-slate-800 rounded-full mb-8">
          <div
            className="h-2 bg-emerald-500 rounded-full transition-all duration-500"
            style={{ width: `${((indice + 1) / preguntasSesion.length) * 100}%` }}
          />
        </div>

        {/* Unidad/materia */}
        {preguntaActual.unidad && (
          <div className="text-xs text-slate-500 uppercase tracking-wider mb-3">
            {preguntaActual.materia} — {preguntaActual.unidad}
          </div>
        )}

        {/* Pregunta */}
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 mb-6">
          <p className="text-white text-base leading-relaxed">{preguntaActual.pregunta}</p>
        </div>

        {/* Opciones */}
        <div className="space-y-3 mb-6">
          {opciones.map((letra) => {
            const texto = opcionTexto(preguntaActual, letra)!;
            const esCorrecta = letra.toUpperCase() === preguntaActual.respuesta_correcta.trim().toUpperCase();
            const esSeleccionada = seleccion === letra;

            let clases =
              "w-full text-left px-5 py-4 rounded-xl border text-sm font-medium transition-all duration-200 flex items-start gap-3";

            if (seleccion === null) {
              clases += " bg-slate-800 border-slate-700 hover:border-emerald-500 hover:bg-slate-700 cursor-pointer";
            } else if (esCorrecta) {
              clases += " bg-emerald-900/40 border-emerald-500 text-emerald-300";
            } else if (esSeleccionada) {
              clases += " bg-red-900/40 border-red-500 text-red-300";
            } else {
              clases += " bg-slate-800/50 border-slate-700/50 text-slate-500 cursor-default";
            }

            return (
              <button
                key={letra}
                className={clases}
                onClick={() => handleSeleccion(letra)}
                disabled={seleccion !== null}
              >
                <span className="shrink-0 w-7 h-7 rounded-full border-2 border-current flex items-center justify-center text-xs font-bold">
                  {etiqueta(letra)}
                </span>
                <span className="flex-1">{texto}</span>
                {seleccion !== null && esCorrecta && <span className="text-xl shrink-0">✅</span>}
                {seleccion !== null && esSeleccionada && !esCorrecta && <span className="text-xl shrink-0">❌</span>}
              </button>
            );
          })}
        </div>

        {/* Resultado + Explicación */}
        {seleccion !== null && (
          <div className="space-y-4">
            {/* Veredicto */}
            <div className={`rounded-xl p-4 border ${seleccion !== null && seleccion.toUpperCase() === preguntaActual.respuesta_correcta.trim().toUpperCase() ? "bg-emerald-900/30 border-emerald-500/50" : "bg-red-900/30 border-red-500/50"}`}>
              <p className="font-semibold text-sm">
                {seleccion !== null && seleccion.toUpperCase() === preguntaActual.respuesta_correcta.trim().toUpperCase()
                  ? "✅ ¡Correcto!"
                  : `❌ Incorrecto. La respuesta correcta es: ${opcionTexto(preguntaActual, preguntaActual.respuesta_correcta)}`}
              </p>
            </div>

            {/* Explicación DeepSeek */}
            <div className="bg-slate-900 border border-violet-500/40 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">📐</span>
                <span className="text-violet-400 font-semibold text-sm">Desarrollo paso a paso</span>
              </div>
              {cargandoExplicacion ? (
                <div className="flex items-center gap-3 text-slate-400 text-sm">
                  <div className="w-5 h-5 border-2 border-violet-500 border-t-transparent rounded-full animate-spin shrink-0" />
                  Generando desarrollo paso a paso...
                </div>
              ) : (
                <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">{explicacion}</p>
              )}
            </div>

            {/* Ejercicios similares generados por DeepSeek */}
            {!cargandoExplicacion && (
              <div className="bg-slate-900 border border-amber-500/30 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">📝</span>
                  <span className="text-amber-400 font-semibold text-sm">
                    📝 Practica más
                  </span>
                </div>
                {cargandoEjercicios ? (
                  <div className="flex items-center gap-3 text-slate-400 text-sm">
                    <div className="w-5 h-5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin shrink-0" />
                    Generando ejercicios similares...
                  </div>
                ) : errorEjercicios ? (
                  <div className="space-y-3">
                    <p className="text-red-300 text-sm">
                      No se pudieron generar ejercicios de práctica.
                    </p>
                    <p className="text-slate-400 text-xs break-words font-mono bg-slate-950/60 border border-slate-800 rounded-lg p-3">
                      {errorEjercicios}
                    </p>
                    <button
                      onClick={() => generarEjercicios(preguntaActual)}
                      className="bg-amber-600 hover:bg-amber-500 active:scale-95 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all duration-200"
                    >
                      🔄 Reintentar
                    </button>
                  </div>
                ) : ejercicios && ejercicios.length > 0 ? (
                  <div className="space-y-4">
                    {ejercicios.slice(0, 2).map((ej, index) => {
                      const seleccionIndex = seleccionEjercicio[index];
                      const explicacionIndex = explicacionEjercicio[index];
                      const cargandoExplicacionIndex = cargandoExplicacionEjercicio[index];

                      return (
                        <div key={index} className="border border-slate-700 rounded-lg p-4 bg-slate-950/50">
                          <p className="text-white font-semibold mb-3">{ej.pregunta}</p>
                          <div className="grid grid-cols-2 gap-3">
                            {opcionesDe(ej).map(({ letra, texto }) => {
                              const esCorrecta =
                                ej.respuesta_correcta !== null && letra === ej.respuesta_correcta;
                              const esSeleccionada = seleccionIndex === letra;

                              let clases =
                                "w-full text-left px-4 py-3 rounded-lg border text-sm font-medium transition-all duration-200 flex items-center gap-3";

                              if (seleccionIndex !== null) {
                                clases += " cursor-default";
                                if (esCorrecta) {
                                  clases += " bg-emerald-900/40 border-emerald-500 text-emerald-300";
                                } else if (esSeleccionada) {
                                  clases += " bg-red-900/40 border-red-500 text-red-300";
                                } else {
                                  clases += " bg-slate-800/50 border-slate-700/50 text-slate-500";
                                }
                              } else {
                                clases += " bg-slate-800 border-slate-700 hover:border-amber-500 hover:bg-slate-700 cursor-pointer";
                              }

                              return (
                                <button
                                  key={letra}
                                  className={clases}
                                  onClick={async () => {
                                    if (seleccionIndex !== null) return;
                                    setSeleccionEjercicio(prev => {
                                      const nuevo = [...prev];
                                      nuevo[index] = letra;
                                      return nuevo;
                                    });

                                    // El desarrollo ya viene generado junto con el
                                    // ejercicio: es corto (máx. 5 líneas) y no cuesta
                                    // otra llamada a la IA.
                                    const desarrollo = ej.desarrollo?.trim();
                                    if (desarrollo) {
                                      setExplicacionEjercicio(prev => {
                                        const nuevo = [...prev];
                                        nuevo[index] = desarrollo;
                                        return nuevo;
                                      });
                                      return;
                                    }

                                    // Respaldo: si el modelo no dio desarrollo, se pide
                                    // la explicación como antes.
                                    setCargandoExplicacionEjercicio(prev => {
                                      const nuevo = [...prev];
                                      nuevo[index] = true;
                                      return nuevo;
                                    });

                                    try {
                                      const exp = await pedirExplicacionEjercicio(ej, preguntaActual.materia);
                                      setExplicacionEjercicio(prev => {
                                        const nuevo = [...prev];
                                        nuevo[index] = exp;
                                        return nuevo;
                                      });
                                    } catch {
                                      setExplicacionEjercicio(prev => {
                                        const nuevo = [...prev];
                                        nuevo[index] = "No se pudo obtener la explicación del ejercicio.";
                                        return nuevo;
                                      });
                                    } finally {
                                      setCargandoExplicacionEjercicio(prev => {
                                        const nuevo = [...prev];
                                        nuevo[index] = false;
                                        return nuevo;
                                      });
                                    }
                                  }}
                                  disabled={seleccionIndex !== null}
                                >
                                  <span className="shrink-0 w-6 h-6 rounded-full border-2 border-current flex items-center justify-center text-xs font-bold">
                                    {letra.toUpperCase()}
                                  </span>
                                  <span className="flex-1">{texto}</span>
                                  {seleccionIndex !== null && ej.respuesta_correcta !== null && esCorrecta && <span className="text-emerald-400 shrink-0">✅</span>}
                                  {seleccionIndex !== null && ej.respuesta_correcta !== null && esSeleccionada && !esCorrecta && <span className="text-red-400 shrink-0">❌</span>}
                                </button>
                              );
                            })}
                          </div>

                          {seleccionIndex !== null && explicacionIndex && (
                            <div className="mt-4 bg-slate-950 border border-violet-500/30 rounded-lg p-4">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-sm">{ej.desarrollo?.trim() ? "📐" : "🤖"}</span>
                                <span className="text-violet-400 font-semibold text-xs">
                                  {ej.desarrollo?.trim() ? "Desarrollo paso a paso" : "Explicación del profesor IA"}
                                </span>
                              </div>
                              {cargandoExplicacionIndex ? (
                                <div className="flex items-center gap-2 text-slate-400 text-xs">
                                  <div className="w-4 h-4 border-2 border-violet-500 border-t-transparent rounded-full animate-spin shrink-0" />
                                  Generando explicación...
                                </div>
                              ) : (
                                <p className="text-slate-300 text-xs leading-relaxed whitespace-pre-wrap">
                                  {explicacionIndex}
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-slate-400 text-sm">No se pudieron generar ejercicios de práctica.</p>
                )}
              </div>
            )}

            {/* ¿Deseas seguir practicando? */}
            {!cargandoExplicacion && (
              <div className="space-y-3">
                <p className="text-center text-slate-400 text-sm font-medium">
                  ¿Deseas seguir practicando?
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={handleSiguiente}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-semibold py-4 rounded-xl transition-all duration-200 text-sm"
                  >
                    ✅ Sí, siguiente pregunta
                  </button>
                  <button
                    onClick={() => setTerminado(true)}
                    className="flex-1 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-300 font-semibold py-4 rounded-xl transition-all duration-200 text-sm border border-slate-700"
                  >
                    📊 Ver resumen
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
