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

interface EjercicioGenerado {
  pregunta: string;
  opcion_a: string;
  opcion_b: string;
  opcion_c: string;
  opcion_d: string;
  respuesta_correcta: string; // a/b/c/d
}

async function parseEjercicioTexto(texto: string): Promise<EjercicioGenerado | null> {
  try {
    const lines = texto.split('\n').filter(line => line.trim());

    // Find the question line (first line that doesn't start with A/B/C/D)
    const preguntaLine = lines.find(line => !/^[A-D]\.?\s/i.test(line.trim()) && line.trim() && !/^\d+\.?\s/i.test(line.trim()));
    if (!preguntaLine) return null;

    // Find option lines
    const opcionA = lines.find(line => /^A\.?\s/i.test(line.trim()));
    const opcionB = lines.find(line => /^B\.?\s/i.test(line.trim()));
    const opcionC = lines.find(line => /^C\.?\s/i.test(line.trim()));
    const opcionD = lines.find(line => /^D\.?\s/i.test(line.trim()));

    if (!opcionA || !opcionB || !opcionC || !opcionD) return null;

    // Parse correct answer if present
    let respuestaCorrecta = 'a';
    const answerMatch = texto.match(new RegExp(/Respuesta correcta:?\s*([a-dA-D])/, 'i'));
    if (answerMatch) {
      respuestaCorrecta = answerMatch[1].toLowerCase();
    } else {
      // Try to find from the text
      const match = texto.match(new RegExp(/\b([a-dA-D])\b.*?(?=\.|$)/, 'i'));
      if (match) respuestaCorrecta = match[1].toLowerCase();
    }

    return {
      pregunta: preguntaLine.replace(/^[\d\sA-D\.\-]*\s*/, ''),
      opcion_a: opcionA.replace(/^[A-D]\.?\s*/i, ''),
      opcion_b: opcionB.replace(/^[A-D]\.?\s*/i, ''),
      opcion_c: opcionC.replace(/^[A-D]\.?\s*/i, ''),
      opcion_d: opcionD.replace(/^[A-D]\.?\s*/i, ''),
      respuesta_correcta: respuestaCorrecta
    };
  } catch (error) {
    console.error('Error parsing exercise:', error);
    return null;
  }
}

async function pedirExplicacionEjercicio(ejercicio: EjercicioGenerado, materia: string): Promise<string> {
  const res = await fetch("/api/video-content", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      titulo: ejercicio.pregunta,
      materia: materia || "Matemáticas IV ENP UNAM",
      tipo: "ejercicio"
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
    }),
  });
  if (!res.ok) throw new Error(`Error del servidor: ${res.status}`);
  const data = await res.json();
  return data.content ?? "Sin explicación disponible.";
}

async function fetchEjerciciosDesdeAPI(pregunta: Pregunta): Promise<string> {
  const res = await fetch("/api/generar-ejercicios", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pregunta: pregunta.pregunta }),
  });
  if (!res.ok) throw new Error(`Error del servidor: ${res.status}`);
  const data = await res.json();
  return data.ejercicios as string;
}

async function generarYParsearEjercicios(pregunta: Pregunta): Promise<EjercicioGenerado[]> {
  const contenido = await fetchEjerciciosDesdeAPI(pregunta);

  // Split by "1. ", "2. "
  const bloques = contenido.split(/(?=\d\.\s)/).filter(b => b.trim());
  const parsed: EjercicioGenerado[] = [];
  for (const b of bloques) {
    const ej = await parseEjercicioTexto(b);
    if (ej) parsed.push(ej);
  }
  return parsed;
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
  // State for each generated exercise (max 2)
  const [seleccionEjercicio, setSeleccionEjercicio] = useState<(string | null)[]>([null, null]);
  const [explicacionEjercicio, setExplicacionEjercicio] = useState<(string | null)[]>([null, null]);
  const [cargandoExplicacionEjercicio, setCargandoExplicacionEjercicio] = useState<boolean[]>([false, false]);
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
    setCargandoEjercicios(true);
    try {
      const parsed = await generarYParsearEjercicios(preguntaActual);
      setEjercicios(parsed);
    } catch (error) {
      console.error('Error generating exercises:', error);
      setEjercicios(null);
    } finally {
      setCargandoEjercicios(false);
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
    setEjercicios(null);
    setSeleccionEjercicio([null, null]);
    setExplicacionEjercicio([null, null]);
    setCargandoExplicacionEjercicio([false, false]);
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
                            {[
                              { letra: 'a', texto: ej.opcion_a },
                              { letra: 'b', texto: ej.opcion_b },
                              { letra: 'c', texto: ej.opcion_c },
                              { letra: 'd', texto: ej.opcion_d }
                            ].map(({ letra, texto }) => {
                              const esCorrecta = letra === ej.respuesta_correcta;
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
                                    // Generate explanation for this exercise
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
                                  {seleccionIndex !== null && esCorrecta && <span className="text-emerald-400 shrink-0">✅</span>}
                                  {seleccionIndex !== null && esSeleccionada && !esCorrecta && <span className="text-red-400 shrink-0">❌</span>}
                                </button>
                              );
                            })}
                          </div>

                          {seleccionIndex !== null && explicacionIndex && (
                            <div className="mt-4 bg-slate-950 border border-violet-500/30 rounded-lg p-4">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-sm">🤖</span>
                                <span className="text-violet-400 font-semibold text-xs">
                                  Explicación del profesor IA
                                </span>
                              </div>
                              {cargandoExplicacionIndex ? (
                                <div className="flex items-center gap-2 text-slate-400 text-xs">
                                  <div className="w-4 h-4 border-2 border-violet-500 border-t-transparent rounded-full animate-spin shrink-0" />
                                  Generando explicación...
                                </div>
                              ) : (
                                <p className="text-slate-300 text-xs leading-relaxed">
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
