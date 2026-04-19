import React, { useState, useEffect, useRef } from 'react';
import { Atom, Search, ChevronDown } from 'lucide-react';

interface Element {
  symbol: string; name: string; z: number; mass: number;
  neutrons: number; group: string; color: string;
  config: string; fact: string;
}

const ELEMENTS: Element[] = [
  { symbol:'H',  name:'Hidrógeno',    z:1,   mass:1.008,   neutrons:0,  group:'No metal',          color:'#60a5fa', config:'1s¹',                   fact:'Gas más abundante del universo; componente del agua.' },
  { symbol:'He', name:'Helio',        z:2,   mass:4.003,   neutrons:2,  group:'Gas noble',         color:'#34d399', config:'1s²',                   fact:'Segundo elemento más abundante; usado en globos y cohetes.' },
  { symbol:'Li', name:'Litio',        z:3,   mass:6.941,   neutrons:4,  group:'Metal alcalino',    color:'#f59e0b', config:'[He] 2s¹',              fact:'Metal más ligero; usado en baterías de ion-litio.' },
  { symbol:'C',  name:'Carbono',      z:6,   mass:12.011,  neutrons:6,  group:'No metal',          color:'#94a3b8', config:'[He] 2s² 2p²',          fact:'Base de toda la vida orgánica; existe como diamante y grafito.' },
  { symbol:'N',  name:'Nitrógeno',    z:7,   mass:14.007,  neutrons:7,  group:'No metal',          color:'#60a5fa', config:'[He] 2s² 2p³',          fact:'Forma el 78% de la atmósfera terrestre.' },
  { symbol:'O',  name:'Oxígeno',      z:8,   mass:15.999,  neutrons:8,  group:'No metal',          color:'#f87171', config:'[He] 2s² 2p⁴',          fact:'Elemento más abundante en la corteza terrestre y en el cuerpo humano.' },
  { symbol:'Na', name:'Sodio',        z:11,  mass:22.99,   neutrons:12, group:'Metal alcalino',    color:'#f59e0b', config:'[Ne] 3s¹',              fact:'Componente principal de la sal de mesa (NaCl).' },
  { symbol:'Mg', name:'Magnesio',     z:12,  mass:24.305,  neutrons:12, group:'Metal alcalino',    color:'#a78bfa', config:'[Ne] 3s²',              fact:'Esencial en la clorofila; necesario para la fotosíntesis.' },
  { symbol:'Al', name:'Aluminio',     z:13,  mass:26.982,  neutrons:14, group:'Metal',             color:'#94a3b8', config:'[Ne] 3s² 3p¹',          fact:'Metal más abundante en la corteza terrestre; muy ligero.' },
  { symbol:'Si', name:'Silicio',      z:14,  mass:28.085,  neutrons:14, group:'Metaloide',         color:'#6366f1', config:'[Ne] 3s² 3p²',          fact:'Base de los semiconductores y chips electrónicos.' },
  { symbol:'P',  name:'Fósforo',      z:15,  mass:30.974,  neutrons:16, group:'No metal',          color:'#fb923c', config:'[Ne] 3s² 3p³',          fact:'Esencial en el ADN; componente de los huesos (fosfato de calcio).' },
  { symbol:'S',  name:'Azufre',       z:16,  mass:32.06,   neutrons:16, group:'No metal',          color:'#fbbf24', config:'[Ne] 3s² 3p⁴',          fact:'Huele a huevo podrido (H₂S); usado en vulcanización del hule.' },
  { symbol:'Cl', name:'Cloro',        z:17,  mass:35.45,   neutrons:18, group:'Halógeno',          color:'#4ade80', config:'[Ne] 3s² 3p⁵',          fact:'Gas amarillo-verdoso; desinfectante del agua potable.' },
  { symbol:'K',  name:'Potasio',      z:19,  mass:39.098,  neutrons:20, group:'Metal alcalino',    color:'#f59e0b', config:'[Ar] 4s¹',              fact:'Esencial para el funcionamiento del corazón y los músculos.' },
  { symbol:'Ca', name:'Calcio',       z:20,  mass:40.078,  neutrons:20, group:'Metal alcalino',    color:'#e2e8f0', config:'[Ar] 4s²',              fact:'Principal mineral de los huesos y dientes; el más abundante en el cuerpo.' },
  { symbol:'Fe', name:'Hierro',       z:26,  mass:55.845,  neutrons:30, group:'Metal transición',  color:'#fb923c', config:'[Ar] 3d⁶ 4s²',          fact:'Metal más usado por la humanidad; forma el núcleo de la Tierra.' },
  { symbol:'Cu', name:'Cobre',        z:29,  mass:63.546,  neutrons:35, group:'Metal transición',  color:'#f97316', config:'[Ar] 3d¹⁰ 4s¹',         fact:'Excelente conductor eléctrico; el más usado en cables.' },
  { symbol:'Zn', name:'Zinc',         z:30,  mass:65.38,   neutrons:35, group:'Metal transición',  color:'#94a3b8', config:'[Ar] 3d¹⁰ 4s²',         fact:'Protege el acero de la oxidación (galvanizado).' },
  { symbol:'Ag', name:'Plata',        z:47,  mass:107.868, neutrons:61, group:'Metal transición',  color:'#e2e8f0', config:'[Kr] 4d¹⁰ 5s¹',         fact:'Mejor conductor eléctrico y térmico de todos los metales.' },
  { symbol:'Au', name:'Oro',          z:79,  mass:196.967, neutrons:118,group:'Metal transición',  color:'#fbbf24', config:'[Xe] 4f¹⁴ 5d¹⁰ 6s¹',    fact:'Metal noble que no se oxida ni corroe; símbolo de riqueza universal.' },
  { symbol:'Pb', name:'Plomo',        z:82,  mass:207.2,   neutrons:125,group:'Metal',             color:'#64748b', config:'[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p²', fact:'Metal muy denso y tóxico; fue usado siglos en plomería y pintura.' },
  { symbol:'U',  name:'Uranio',       z:92,  mass:238.029, neutrons:146,group:'Actínido',          color:'#4ade80', config:'[Rn] 5f³ 6d¹ 7s²',      fact:'Elemento radiactivo usado en centrales nucleares y armamento atómico.' },
];

function getOrbitalConfig(z: number): number[] {
  // Returns electrons per orbital shell
  const shells: number[] = [];
  let remaining = z;
  const maxPerShell = [2, 8, 18, 32, 18, 8, 2];
  for (const cap of maxPerShell) {
    if (remaining <= 0) break;
    const n = Math.min(remaining, cap);
    shells.push(n);
    remaining -= n;
  }
  return shells;
}

interface OrbitingElectron {
  shell: number; angle: number; speed: number;
}

export default function AtomArtifact({ element: initEl = '' }: { element?: string }) {
  const [query, setQuery] = useState('');
  const [el, setEl] = useState<Element>(() => {
    const found = ELEMENTS.find(e =>
      e.symbol.toLowerCase() === initEl.toLowerCase() ||
      e.name.toLowerCase().includes(initEl.toLowerCase())
    );
    return found ?? ELEMENTS[5]; // default: Oxígeno
  });
  const [angles, setAngles] = useState<number[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const animRef = useRef<number>();
  const anglesRef = useRef<number[]>([]);

  const shells = getOrbitalConfig(el.z);

  // One electron per position in each shell, but cap visual electrons per shell at 8
  const visualElectrons: { shell: number; baseAngle: number; speed: number }[] = [];
  shells.forEach((count, shellIdx) => {
    const shown = Math.min(count, 8);
    for (let i = 0; i < shown; i++) {
      visualElectrons.push({
        shell: shellIdx,
        baseAngle: (360 / shown) * i,
        speed: 0.4 / (shellIdx + 1),
      });
    }
  });

  useEffect(() => {
    anglesRef.current = visualElectrons.map(e => e.baseAngle);
    setAngles([...anglesRef.current]);

    const animate = () => {
      anglesRef.current = anglesRef.current.map((a, i) => (a + visualElectrons[i].speed) % 360);
      setAngles([...anglesRef.current]);
      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [el.z]);

  const filtered = ELEMENTS.filter(e =>
    e.name.toLowerCase().includes(query.toLowerCase()) ||
    e.symbol.toLowerCase().includes(query.toLowerCase())
  );

  const cx = 120, cy = 120;
  const baseR = 28;
  const shellGap = 22;

  const toRad = (deg: number) => (deg * Math.PI) / 180;

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/80 overflow-hidden">
      <div className="px-4 py-3 border-b border-white/10 flex items-center gap-2">
        <Atom className="h-4 w-4 text-sky-400" />
        <span className="text-sm font-black uppercase tracking-widest text-white">Modelo Atómico Interactivo</span>
      </div>

      <div className="flex flex-col md:flex-row gap-0">
        {/* SVG Atom */}
        <div className="flex items-center justify-center p-4 md:w-64">
          <div className="relative" style={{ width: 240, height: 240 }}>
            <svg width={240} height={240}>
              {/* Orbital rings */}
              {shells.map((_, si) => (
                <circle
                  key={`ring-${si}`}
                  cx={cx} cy={cy}
                  r={baseR + (si + 1) * shellGap}
                  fill="none"
                  stroke={el.color + '30'}
                  strokeWidth={1}
                  strokeDasharray="3,3"
                />
              ))}

              {/* Electrons */}
              {visualElectrons.map((e, i) => {
                const r = baseR + (e.shell + 1) * shellGap;
                const angle = angles[i] ?? e.baseAngle;
                const x = cx + r * Math.cos(toRad(angle));
                const y = cy + r * Math.sin(toRad(angle));
                return (
                  <g key={`e-${i}`}>
                    <circle cx={x} cy={y} r={4} fill={el.color} opacity={0.9} />
                    <circle cx={x} cy={y} r={6} fill={el.color} opacity={0.15} />
                  </g>
                );
              })}

              {/* Nucleus */}
              <circle cx={cx} cy={cy} r={baseR} fill={el.color + '20'} stroke={el.color} strokeWidth={1.5} />
              <text x={cx} y={cy - 5} textAnchor="middle" dominantBaseline="middle"
                fontSize={16} fontWeight="900" fill={el.color}>{el.symbol}</text>
              <text x={cx} y={cy + 11} textAnchor="middle" dominantBaseline="middle"
                fontSize={9} fontWeight="700" fill={el.color + 'aa'}>{el.z}</text>
            </svg>
          </div>
        </div>

        {/* Info panel */}
        <div className="flex-1 p-4 border-t md:border-t-0 md:border-l border-white/10 flex flex-col gap-3">
          {/* Search */}
          <div className="relative">
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2">
              <Search className="h-3.5 w-3.5 text-slate-400" />
              <input
                className="bg-transparent flex-1 text-sm text-white outline-none placeholder-slate-500 font-bold"
                placeholder="Buscar elemento..."
                value={query}
                onChange={e => { setQuery(e.target.value); setShowDropdown(true); }}
                onFocus={() => setShowDropdown(true)}
              />
              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            </div>
            {showDropdown && query && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-slate-800 border border-white/10 rounded-xl z-20 max-h-44 overflow-y-auto shadow-xl">
                {filtered.slice(0, 10).map(e => (
                  <button
                    key={e.symbol}
                    className="w-full flex items-center gap-3 px-3 py-2 hover:bg-white/5 text-left transition-colors"
                    onClick={() => { setEl(e); setQuery(''); setShowDropdown(false); }}
                  >
                    <span className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black"
                      style={{ background: e.color + '20', color: e.color }}>{e.symbol}</span>
                    <div>
                      <p className="text-xs font-bold text-white">{e.name}</p>
                      <p className="text-[9px] text-slate-400 font-bold">Z={e.z} · {e.group}</p>
                    </div>
                  </button>
                ))}
                {filtered.length === 0 && (
                  <p className="text-xs text-slate-500 p-3 text-center">Sin resultados</p>
                )}
              </div>
            )}
          </div>

          {/* Element name & group */}
          <div>
            <h3 className="text-lg font-black text-white">{el.name}</h3>
            <span className="inline-block text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full mt-0.5"
              style={{ background: el.color + '20', color: el.color }}>{el.group}</span>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            {[
              { label: 'Número atómico (Z)', value: el.z },
              { label: 'Masa atómica',        value: el.mass + ' u' },
              { label: 'Protones',             value: el.z },
              { label: 'Neutrones',            value: el.neutrons },
              { label: 'Electrones',           value: el.z },
              { label: 'Capas electrónicas',   value: shells.length },
            ].map(({ label, value }) => (
              <div key={label} className="bg-white/5 rounded-xl px-3 py-2 border border-white/5">
                <p className="text-slate-500 font-bold text-[9px] uppercase tracking-widest">{label}</p>
                <p className="text-white font-black mt-0.5">{value}</p>
              </div>
            ))}
          </div>

          {/* Config */}
          <div className="bg-white/5 border border-white/5 rounded-xl px-3 py-2">
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Configuración electrónica</p>
            <p className="text-sm font-black" style={{ color: el.color }}>{el.config}</p>
          </div>

          {/* Fact */}
          <div className="bg-white/5 border border-white/5 rounded-xl px-3 py-2">
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-0.5">💡 Dato clave ECOEMS</p>
            <p className="text-[11px] text-slate-300 leading-relaxed">{el.fact}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
