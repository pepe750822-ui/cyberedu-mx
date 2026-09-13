import { useEffect, useState } from "react";
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

const OPCIONES = ["a", "b", "c", "d", "e"] as const;

const etiqueta = (letra: string) => letra.toUpperCase();

function opcionTexto(pregunta: Pregunta, letra: string): string | null {
  return pregunta[`opcion_${letra}` as keyof Pregunta] as string | null;
}

async function pedirExplicacion(pregunta: string, respuesta: string): Promise<string> {
  const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY;
  if (!apiKey) throw new Error("VITE_DEEPSEEK_API_KEY no configurada");

  const prompt = `Eres un profesor de Matemáticas IV de la ENP UNAM. Explica paso a paso cómo resolver este ejercicio para un estudiante de preparatoria: ${pregunta} La respuesta correcta es: ${respuesta} Incluye: 1. Concepto teórico 2. Procedimiento paso a paso 3. Por qué las otras opciones están mal Responde en español, claro y conciso.`;

  const res = await fetch("https://api.deepseek.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 800,
      temperature: 0.3,
    }),
  });

  if (!res.ok) throw new Error(`DeepSeek error: ${res.status}`);
  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? "Sin explicación disponible.";
}

export default function SimuladorPrepa() {
  const [preguntas, setPreguntas] = useState<Pregunta[]>([]);
  const [indice, setIndice] = useState(0);
  const [cargando, setCargando] = useState(true);
  const [seleccion, setSeleccion] = useState<string | null>(null);
  const [explicacion, setExplicacion] = useState<string | null>(null);
  const [cargandoExplicacion, setCargandoExplicacion] = useState(false);
  const [correctas, setCorrectas] = useState(0);
  const [terminado, setTerminado] = useState(false);

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

  const preguntaActual = preguntas[indice];

  const handleSeleccion = async (letra: string) => {
    if (seleccion !== null) return;
    setSeleccion(letra);

    const esCorrecta = letra === preguntaActual.respuesta_correcta;
    if (esCorrecta) setCorrectas((c) => c + 1);

    setCargandoExplicacion(true);
    try {
      const texto = opcionTexto(preguntaActual, preguntaActual.respuesta_correcta) ?? preguntaActual.respuesta_correcta;
      const exp = await pedirExplicacion(preguntaActual.pregunta, texto);
      setExplicacion(exp);
    } catch {
      setExplicacion("No se pudo obtener la explicación. Intenta de nuevo.");
    } finally {
      setCargandoExplicacion(false);
    }
  };

  const handleSiguiente = () => {
    if (indice + 1 >= preguntas.length) {
      setTerminado(true);
      return;
    }
    setIndice((i) => i + 1);
    setSeleccion(null);
    setExplicacion(null);
  };

  const handleReiniciar = () => {
    setIndice(0);
    setSeleccion(null);
    setExplicacion(null);
    setCorrectas(0);
    setTerminado(false);
  };

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

  if (terminado) {
    const total = preguntas.length;
    const pct = Math.round((correctas / total) * 100);
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
        <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">{pct >= 70 ? "🎉" : "📚"}</div>
          <h2 className="text-2xl font-bold text-white mb-2">Simulacro terminado</h2>
          <p className="text-slate-400 mb-6">Matemáticas IV — ENP UNAM</p>
          <div className="bg-slate-800 rounded-xl p-6 mb-6">
            <div className="text-5xl font-bold text-emerald-400 mb-1">{pct}%</div>
            <div className="text-slate-400 text-sm">{correctas} de {total} correctas</div>
          </div>
          <button
            onClick={handleReiniciar}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 rounded-xl transition-colors"
          >
            Reintentar
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
            <div className="text-xl font-bold text-white">{indice + 1} / {preguntas.length}</div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-2 bg-slate-800 rounded-full mb-8">
          <div
            className="h-2 bg-emerald-500 rounded-full transition-all duration-500"
            style={{ width: `${((indice + 1) / preguntas.length) * 100}%` }}
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
            const esCorrecta = letra === preguntaActual.respuesta_correcta;
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
            <div className={`rounded-xl p-4 border ${seleccion === preguntaActual.respuesta_correcta ? "bg-emerald-900/30 border-emerald-500/50" : "bg-red-900/30 border-red-500/50"}`}>
              <p className="font-semibold text-sm">
                {seleccion === preguntaActual.respuesta_correcta
                  ? "✅ ¡Correcto!"
                  : `❌ Incorrecto. La respuesta correcta es la opción ${etiqueta(preguntaActual.respuesta_correcta)}: ${opcionTexto(preguntaActual, preguntaActual.respuesta_correcta)}`}
              </p>
            </div>

            {/* Explicación DeepSeek */}
            <div className="bg-slate-900 border border-violet-500/40 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">🤖</span>
                <span className="text-violet-400 font-semibold text-sm">Explicación del profesor IA</span>
              </div>
              {cargandoExplicacion ? (
                <div className="flex items-center gap-3 text-slate-400 text-sm">
                  <div className="w-5 h-5 border-2 border-violet-500 border-t-transparent rounded-full animate-spin shrink-0" />
                  Generando explicación paso a paso...
                </div>
              ) : (
                <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">{explicacion}</p>
              )}
            </div>

            {/* Siguiente */}
            {!cargandoExplicacion && (
              <button
                onClick={handleSiguiente}
                className="w-full bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-semibold py-4 rounded-xl transition-all duration-200 text-sm"
              >
                {indice + 1 >= preguntas.length ? "Ver resultados" : "Siguiente pregunta →"}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
