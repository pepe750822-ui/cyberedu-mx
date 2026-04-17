import React, { useState } from 'react';
import { Heart, Info } from 'lucide-react';

interface BodySystem {
  id: string;
  name: string;
  color: string;
  mainFunction: string;
  keyOrgans: string;
  ecoems: string;
}

const SYSTEMS: BodySystem[] = [
  {
    id: 'nervous',
    name: 'Nervioso',
    color: '#8b5cf6',
    mainFunction: 'Coordina y controla todas las funciones del cuerpo mediante señales eléctricas y químicas.',
    keyOrgans: 'Encéfalo, médula espinal, nervios periféricos, neuronas, sinapsis',
    ecoems: 'La neurona es la unidad básica del sistema nervioso. Las sinapsis transmiten impulsos entre neuronas. El cerebro contiene ~86 mil millones de neuronas.',
  },
  {
    id: 'circulatory',
    name: 'Circulatorio',
    color: '#ef4444',
    mainFunction: 'Transporta O₂, nutrientes y hormonas a todas las células del cuerpo.',
    keyOrgans: 'Corazón, arterias, venas, capilares, eritrocitos, leucocitos, plaquetas',
    ecoems: 'Circulación mayor (cuerpo) y menor (pulmones). El corazón late ~70 veces/min. Eritrocitos transportan O₂ mediante hemoglobina.',
  },
  {
    id: 'respiratory',
    name: 'Respiratorio',
    color: '#0ea5e9',
    mainFunction: 'Intercambia gases: capta O₂ del aire y elimina CO₂ del organismo.',
    keyOrgans: 'Pulmones, tráquea, bronquios, bronquiolos, alvéolos, diafragma',
    ecoems: 'Intercambio gaseoso en alvéolos por difusión. ~300 millones de alvéolos en ambos pulmones. Respiración celular: glucosa + O₂ → ATP + CO₂ + H₂O.',
  },
  {
    id: 'digestive',
    name: 'Digestivo',
    color: '#22c55e',
    mainFunction: 'Descompone alimentos en nutrientes absorbibles para el metabolismo celular.',
    keyOrgans: 'Boca, esófago, estómago, intestino delgado, intestino grueso, hígado, páncreas',
    ecoems: 'Digestión mecánica (masticación) + química (enzimas). Amilasa salival digiere almidón. Absorción de nutrientes ocurre en el intestino delgado.',
  },
  {
    id: 'endocrine',
    name: 'Endócrino',
    color: '#f59e0b',
    mainFunction: 'Regula metabolismo, crecimiento y homeostasis mediante hormonas en sangre.',
    keyOrgans: 'Hipófisis, tiroides, páncreas (islotes de Langerhans), suprarrenales, gónadas, hipotálamo',
    ecoems: 'Insulina (páncreas) regula glucosa en sangre. Adrenalina activa respuesta de estrés. Hormonas son mensajeros químicos. Retroalimentación negativa mantiene el equilibrio.',
  },
  {
    id: 'reproductive',
    name: 'Reproductor',
    color: '#ec4899',
    mainFunction: 'Produce gametos y permite la reproducción sexual para perpetuar la especie.',
    keyOrgans: 'Masculino: testículos, epidídimo, próstata. Femenino: ovarios, trompas de Falopio, útero',
    ecoems: 'Meiosis produce gametos con n=23 cromosomas. Fecundación: óvulo + espermatozoide → cigoto (2n=46). Implantación en el endometrio uterino.',
  },
];

type ZoneShape =
  | { type: 'ellipse'; cx: number; cy: number; rx: number; ry: number }
  | { type: 'circle'; cx: number; cy: number; r: number }
  | { type: 'rect'; x: number; y: number; w: number; h: number; rx?: number };

const ZONE_SHAPES: Record<string, ZoneShape[]> = {
  nervous: [
    { type: 'ellipse', cx: 100, cy: 36, rx: 22, ry: 24 },      // cerebro
    { type: 'rect', x: 97, y: 62, w: 6, h: 138, rx: 3 },       // columna
  ],
  respiratory: [
    { type: 'ellipse', cx: 76, cy: 116, rx: 15, ry: 29 },      // pulmón izq
    { type: 'ellipse', cx: 122, cy: 116, rx: 15, ry: 29 },     // pulmón der
  ],
  circulatory: [
    { type: 'ellipse', cx: 88, cy: 127, rx: 17, ry: 19 },      // corazón
  ],
  digestive: [
    { type: 'ellipse', cx: 100, cy: 178, rx: 28, ry: 27 },     // estómago + intestinos
  ],
  endocrine: [
    { type: 'ellipse', cx: 100, cy: 73, rx: 13, ry: 7 },       // tiroides
    { type: 'circle', cx: 80, cy: 155, r: 7 },                  // suprarrenal izq
    { type: 'circle', cx: 120, cy: 155, r: 7 },                 // suprarrenal der
    { type: 'circle', cx: 100, cy: 163, r: 7 },                 // páncreas
  ],
  reproductive: [
    { type: 'ellipse', cx: 100, cy: 215, rx: 26, ry: 14 },     // pelvis
  ],
};

const renderShape = (shape: ZoneShape, fill: string, opacity: number, key: number) => {
  if (shape.type === 'ellipse')
    return <ellipse key={key} cx={shape.cx} cy={shape.cy} rx={shape.rx} ry={shape.ry} fill={fill} fillOpacity={opacity} />;
  if (shape.type === 'circle')
    return <circle key={key} cx={shape.cx} cy={shape.cy} r={shape.r} fill={fill} fillOpacity={opacity} />;
  return <rect key={key} x={shape.x} y={shape.y} width={shape.w} height={shape.h} rx={shape.rx ?? 0} fill={fill} fillOpacity={opacity} />;
};

const DataRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex flex-col gap-0.5">
    <span className="text-[9px] font-black uppercase tracking-widest text-white/30">{label}</span>
    <span className="text-[11px] font-bold text-white leading-snug">{value}</span>
  </div>
);

const HumanBodyArtifact: React.FC<{ topic?: string }> = ({ topic }) => {
  const [selectedSystem, setSelectedSystem] = useState<string | null>(null);
  const [hoveredSystem, setHoveredSystem] = useState<string | null>(null);

  const activeId = hoveredSystem ?? selectedSystem;
  const activeSys = activeId ? SYSTEMS.find(s => s.id === activeId) ?? null : null;

  const getOpacity = (id: string): number => {
    if (hoveredSystem === id || selectedSystem === id) return 0.72;
    if (hoveredSystem || selectedSystem) return 0.18;
    return 0.42;
  };

  const handleClick = (id: string) =>
    setSelectedSystem(prev => (prev === id ? null : id));

  // Render order: respiratory first (back), then digestive, circulatory, endocrine, reproductive, nervous (front)
  const RENDER_ORDER = ['respiratory', 'digestive', 'circulatory', 'endocrine', 'reproductive', 'nervous'];

  return (
    <div className="bg-slate-900 rounded-3xl border border-white/10 overflow-hidden shadow-2xl my-4">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10 bg-black/40">
        <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
          <Heart className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-black text-white text-sm uppercase tracking-tighter">Sistemas del Cuerpo Humano</h3>
          <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">
            {topic || 'Biología — ECOEMS'}
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row min-h-[360px]">
        {/* SVG Body */}
        <div className="flex items-center justify-center p-4 md:w-[210px] flex-shrink-0">
          <svg
            viewBox="0 0 200 390"
            className="w-full max-w-[190px] select-none"
            style={{ cursor: 'default' }}
          >
            {/* ── Silhouette ── */}
            <g fill="#1e293b" stroke="#334155" strokeWidth="1.5">
              {/* Cabeza */}
              <ellipse cx="100" cy="36" rx="28" ry="30" />
              {/* Cuello */}
              <rect x="88" y="64" width="24" height="22" />
              {/* Torso */}
              <path d="M56,84 C40,88 38,112 38,148 L40,228 C40,234 44,238 50,240 L76,242 L80,205 L120,205 L124,242 L150,240 C156,238 160,234 160,228 L162,148 C162,112 160,88 144,84 Z" />
              {/* Brazo izq */}
              <path d="M56,86 C40,92 28,128 26,172 L44,175 C47,140 56,110 66,102 Z" />
              {/* Brazo der */}
              <path d="M144,86 C160,92 172,128 174,172 L156,175 C153,140 144,110 134,102 Z" />
              {/* Pierna izq */}
              <path d="M76,242 L70,355 L92,357 L94,207 L80,205 Z" />
              {/* Pierna der */}
              <path d="M120,205 L106,207 L108,357 L130,355 L124,242 Z" />
            </g>

            {/* ── System zones ── */}
            {RENDER_ORDER.map(id => {
              const sys = SYSTEMS.find(s => s.id === id)!;
              const shapes = ZONE_SHAPES[id];
              const opacity = getOpacity(id);
              return (
                <g
                  key={id}
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleClick(id)}
                  onMouseEnter={() => setHoveredSystem(id)}
                  onMouseLeave={() => setHoveredSystem(null)}
                >
                  {shapes.map((shape, i) => renderShape(shape, sys.color, opacity, i))}
                  {/* selection / hover stroke */}
                  {(hoveredSystem === id || selectedSystem === id) &&
                    shapes.slice(0, 1).map((shape, i) => {
                      if (shape.type === 'ellipse')
                        return <ellipse key={`s${i}`} cx={shape.cx} cy={shape.cy} rx={shape.rx + 3} ry={shape.ry + 3} fill="none" stroke={sys.color} strokeWidth="1.5" strokeOpacity="0.6" />;
                      if (shape.type === 'circle')
                        return <circle key={`s${i}`} cx={shape.cx} cy={shape.cy} r={shape.r + 3} fill="none" stroke={sys.color} strokeWidth="1.5" strokeOpacity="0.6" />;
                      return null;
                    })
                  }
                </g>
              );
            })}

            {/* Hover label */}
            {hoveredSystem && (() => {
              const s = SYSTEMS.find(x => x.id === hoveredSystem)!;
              return (
                <text x="100" y="380" textAnchor="middle" fill={s.color} fontSize="9.5" fontWeight="bold" fontFamily="Inter, sans-serif">
                  {s.name}
                </text>
              );
            })()}
          </svg>
        </div>

        {/* Right panel */}
        <div className="flex-1 flex flex-col min-w-0 border-t md:border-t-0 md:border-l border-white/10">
          {/* System selector buttons */}
          <div className="grid grid-cols-3 gap-1.5 p-3 border-b border-white/10">
            {SYSTEMS.map(sys => (
              <button
                key={sys.id}
                onClick={() => handleClick(sys.id)}
                onMouseEnter={() => setHoveredSystem(sys.id)}
                onMouseLeave={() => setHoveredSystem(null)}
                className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg border transition-all text-left"
                style={{
                  borderColor: (selectedSystem === sys.id || hoveredSystem === sys.id) ? sys.color + '80' : 'rgba(255,255,255,0.08)',
                  backgroundColor: (selectedSystem === sys.id) ? sys.color + '18' : hoveredSystem === sys.id ? sys.color + '0d' : 'transparent',
                }}
              >
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: sys.color }} />
                <span className="text-[10px] font-black text-white/70 uppercase tracking-tight leading-none">{sys.name}</span>
              </button>
            ))}
          </div>

          {/* Info section */}
          {activeSys ? (
            <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: activeSys.color }} />
                  <h4 className="font-black text-white text-sm">Sistema {activeSys.name}</h4>
                </div>
                {selectedSystem === activeSys.id && (
                  <button
                    onClick={() => setSelectedSystem(null)}
                    className="text-white/20 hover:text-white text-[10px] font-black uppercase tracking-widest transition-colors"
                  >
                    ✕
                  </button>
                )}
              </div>

              <p className="text-white/50 text-[11px] leading-relaxed">{activeSys.mainFunction}</p>

              <div className="grid grid-cols-1 gap-2 border-t border-white/5 pt-3">
                <DataRow label="Órganos clave" value={activeSys.keyOrgans} />
                <DataRow label="Dato ECOEMS" value={activeSys.ecoems} />
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center gap-2 p-4 text-center">
              <Info className="h-6 w-6 text-white/10" />
              <p className="text-white/20 text-[10px] font-bold uppercase tracking-widest leading-relaxed">
                Haz clic en una zona del cuerpo<br />o en un sistema para ver sus datos
              </p>
              <p className="text-white/10 text-[9px]">6 sistemas · ECOEMS Biología</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HumanBodyArtifact;
