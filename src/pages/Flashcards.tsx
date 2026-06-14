import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import PromoBloqueo from "@/components/PromoBloqueo";
import { flashcardsData, flashcardAreas, Flashcard } from "../data/flashcardsData";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function Flashcards() {
  const { user, profile } = useAuth();
  const [areaFiltro, setAreaFiltro] = useState<string>("Todas");
  const [shuffleKey, setShuffleKey] = useState(0);
  const [indice, setIndice] = useState(0);
  const [volteada, setVolteada] = useState(false);
  const [vistas, setVistas] = useState<Set<number>>(new Set());
  const [conocidas, setConocidas] = useState<Set<number>>(new Set());

  if (!user || !(profile as any)?.paquete_completo) {
    return <PromoBloqueo titulo="Flashcards ECOEMS" />;
  }

  const areas = ["Todas", ...flashcardAreas];

  const tarjetas = useMemo(() => {
    const filtradas = areaFiltro === "Todas"
      ? flashcardsData
      : flashcardsData.filter((f) => f.area === areaFiltro);
    return shuffle(filtradas);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [areaFiltro, shuffleKey]);

  const tarjeta = tarjetas[indice] ?? null;
  const progreso = tarjetas.length > 0 ? Math.round((vistas.size / tarjetas.length) * 100) : 0;

  useEffect(() => {
    setIndice(0);
    setVolteada(false);
    setVistas(new Set());
    setConocidas(new Set());
  }, [areaFiltro, shuffleKey]);

  function siguiente() {
    if (!tarjeta) return;
    setVistas((prev) => new Set(prev).add(tarjeta.id));
    setVolteada(false);
    setTimeout(() => setIndice((i) => Math.min(i + 1, tarjetas.length - 1)), 150);
  }

  function anterior() {
    setVolteada(false);
    setTimeout(() => setIndice((i) => Math.max(i - 1, 0)), 150);
  }

  function marcarConocida() {
    if (!tarjeta) return;
    setConocidas((prev) => new Set(prev).add(tarjeta.id));
    siguiente();
  }

  function reiniciar() {
    setShuffleKey((k) => k + 1);
  }

  if (!tarjeta) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">No hay tarjetas para esta área.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-800">🃏 Flashcards ECOEMS</h1>
          <p className="text-gray-500 text-sm mt-1">500 preguntas · Toca la tarjeta para ver la respuesta</p>
        </div>

        {/* Filtro por área */}
        <div className="flex flex-wrap gap-2 mb-4 justify-center">
          {areas.map((a) => (
            <button
              key={a}
              onClick={() => setAreaFiltro(a)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                areaFiltro === a
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-100"
              }`}
            >
              {a}
            </button>
          ))}
        </div>

        {/* Progreso */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Tarjeta {indice + 1} de {tarjetas.length}</span>
            <span>{conocidas.size} conocidas · {progreso}% vistas</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all"
              style={{ width: `${progreso}%` }}
            />
          </div>
        </div>

        {/* Tarjeta con efecto flip */}
        <div
          className="cursor-pointer select-none"
          style={{ perspective: "1000px" }}
          onClick={() => setVolteada((v) => !v)}
        >
          <div
            className="relative w-full transition-transform duration-500"
            style={{
              transformStyle: "preserve-3d",
              transform: volteada ? "rotateY(180deg)" : "rotateY(0deg)",
              minHeight: "220px",
            }}
          >
            {/* Frente — Pregunta */}
            <div
              className="absolute inset-0 bg-white rounded-2xl shadow-lg p-6 flex flex-col justify-between"
              style={{ backfaceVisibility: "hidden" }}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                  {tarjeta.area}
                </span>
                <span className="text-xs text-gray-400">#{tarjeta.id}</span>
              </div>
              <p className="text-gray-800 font-medium text-base leading-relaxed text-center flex-1 flex items-center justify-center">
                {tarjeta.pregunta}
              </p>
              <p className="text-center text-xs text-gray-400 mt-4">Toca para ver la respuesta</p>
            </div>

            {/* Reverso — Respuesta */}
            <div
              className="absolute inset-0 bg-blue-600 rounded-2xl shadow-lg p-6 flex flex-col justify-between"
              style={{
                backfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-blue-100 bg-blue-700 px-2 py-0.5 rounded-full">
                  Respuesta
                </span>
                <span className="text-xs text-blue-200">{tarjeta.area}</span>
              </div>
              <p className="text-white font-semibold text-lg leading-relaxed text-center flex-1 flex items-center justify-center">
                {tarjeta.respuesta}
              </p>
              <p className="text-center text-xs text-blue-200 mt-4">Toca para volver a la pregunta</p>
            </div>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={anterior}
            disabled={indice === 0}
            className="flex-1 py-3 rounded-xl border border-gray-200 bg-white text-gray-600 font-medium disabled:opacity-40 hover:bg-gray-50 transition-colors"
          >
            ← Anterior
          </button>
          <button
            onClick={marcarConocida}
            className="flex-1 py-3 rounded-xl bg-green-500 text-white font-medium hover:bg-green-600 transition-colors"
          >
            ✓ La sé
          </button>
          <button
            onClick={siguiente}
            disabled={indice === tarjetas.length - 1}
            className="flex-1 py-3 rounded-xl bg-blue-600 text-white font-medium disabled:opacity-40 hover:bg-blue-700 transition-colors"
          >
            Siguiente →
          </button>
        </div>

        {/* Reiniciar */}
        <div className="text-center mt-4">
          <button
            onClick={reiniciar}
            className="text-sm text-gray-400 hover:text-gray-600 underline"
          >
            Barajar de nuevo
          </button>
        </div>

        {/* Resumen al terminar */}
        {indice === tarjetas.length - 1 && vistas.size === tarjetas.length && (
          <div className="mt-6 bg-green-50 border border-green-200 rounded-2xl p-5 text-center">
            <p className="text-2xl mb-2">🎉</p>
            <p className="font-bold text-green-800">¡Completaste todas las tarjetas!</p>
            <p className="text-green-600 text-sm mt-1">
              Conocías {conocidas.size} de {tarjetas.length} ({Math.round((conocidas.size/tarjetas.length)*100)}%)
            </p>
            <button
              onClick={reiniciar}
              className="mt-3 px-6 py-2 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors"
            >
              Repetir
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
