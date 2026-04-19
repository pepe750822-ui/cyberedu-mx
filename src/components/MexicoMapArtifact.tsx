import React, { useState } from 'react';
import { MapPin, X, Info } from 'lucide-react';

interface StateInfo {
  id: string; name: string; abbr: string;
  region: 'noroeste' | 'norte' | 'noreste' | 'occidente' | 'centro' | 'sur' | 'sureste';
  capital: string; pop: string; area: string; fact: string;
  points: string; labelX: number; labelY: number;
}

const REGION_COLORS: Record<string, { fill: string; hover: string; text: string; label: string }> = {
  noroeste:  { fill: '#3b82f6', hover: '#60a5fa', text: '#bfdbfe', label: 'Noroeste' },
  norte:     { fill: '#10b981', hover: '#34d399', text: '#a7f3d0', label: 'Norte' },
  noreste:   { fill: '#14b8a6', hover: '#2dd4bf', text: '#99f6e4', label: 'Noreste' },
  occidente: { fill: '#8b5cf6', hover: '#a78bfa', text: '#ddd6fe', label: 'Occidente' },
  centro:    { fill: '#f59e0b', hover: '#fbbf24', text: '#fde68a', label: 'Centro' },
  sur:       { fill: '#ef4444', hover: '#f87171', text: '#fecaca', label: 'Sur' },
  sureste:   { fill: '#ec4899', hover: '#f472b6', text: '#fbcfe8', label: 'Sureste' },
};

const STATES: StateInfo[] = [
  { id:'bc',    name:'Baja California',     abbr:'BC',   region:'noroeste',  capital:'Mexicali',           pop:'3.7 M', area:'70,113 km²',  fact:'Alberga el Valle de Guadalupe, la principal zona vinícola de México.',               points:'30,15 68,12 78,45 62,108 40,155 22,135 22,65',                                                   labelX:46,  labelY:76  },
  { id:'bcs',   name:'Baja California Sur', abbr:'BCS',  region:'noroeste',  capital:'La Paz',             pop:'0.8 M', area:'73,477 km²',  fact:'Isla Espíritu Santo alberga la mayor colonia de lobos marinos de México.',            points:'26,158 54,153 68,168 65,222 48,275 28,258 18,212',                                               labelX:44,  labelY:207 },
  { id:'son',   name:'Sonora',              abbr:'SON',  region:'noroeste',  capital:'Hermosillo',         pop:'2.9 M', area:'179,503 km²', fact:'Segundo estado más grande de México; principal productor de trigo y carne.',          points:'72,12 162,12 170,35 154,95 115,125 78,115 72,55',                                                labelX:118, labelY:64  },
  { id:'chi',   name:'Chihuahua',           abbr:'CHI',  region:'norte',     capital:'Chihuahua',          pop:'3.7 M', area:'247,455 km²', fact:'Estado más grande de México; alberga el Cañón del Cobre (Barrancas del Cobre).',     points:'164,12 292,12 298,45 282,135 198,145 154,99 164,45',                                             labelX:222, labelY:70  },
  { id:'coa',   name:'Coahuila',            abbr:'COA',  region:'norte',     capital:'Saltillo',           pop:'3.1 M', area:'151,571 km²', fact:'Cuatro Ciénegas tiene las dunas de arena más grandes de América del Norte.',          points:'294,12 394,12 400,82 362,122 294,128 280,88',                                                    labelX:337, labelY:74  },
  { id:'nl',    name:'Nuevo León',          abbr:'NL',   region:'noreste',   capital:'Monterrey',          pop:'5.8 M', area:'64,555 km²',  fact:'Monterrey es la segunda ciudad industrial más importante de México.',                points:'396,12 440,12 446,55 424,105 394,110 392,62',                                                    labelX:415, labelY:59  },
  { id:'tam',   name:'Tamaulipas',          abbr:'TAM',  region:'noreste',   capital:'Cd. Victoria',       pop:'3.6 M', area:'79,829 km²',  fact:'El Puerto de Tampico es uno de los más importantes del Golfo de México.',            points:'442,12 500,22 506,80 492,192 446,190 418,108 440,62',                                            labelX:463, labelY:95  },
  { id:'sin',   name:'Sinaloa',             abbr:'SIN',  region:'noroeste',  capital:'Culiacán',           pop:'3.1 M', area:'57,377 km²',  fact:'Principal productor de tomate y hortalizas de México.',                              points:'80,117 120,127 140,145 134,192 108,215 80,195 66,158',                                           labelX:104, labelY:164 },
  { id:'dur',   name:'Durango',             abbr:'DUR',  region:'norte',     capital:'Durango',            pop:'1.9 M', area:'119,648 km²', fact:'La Zona del Silencio es famosa porque no se reciben señales de radio ni TV.',        points:'158,102 198,147 205,190 170,205 134,195 140,150 148,115',                                        labelX:165, labelY:158 },
  { id:'zac',   name:'Zacatecas',           abbr:'ZAC',  region:'norte',     capital:'Zacatecas',          pop:'1.6 M', area:'75,040 km²',  fact:'Fue el mayor productor de plata del mundo durante la época colonial.',               points:'280,130 332,128 344,170 315,215 264,210 250,176 264,150',                                        labelX:293, labelY:168 },
  { id:'slp',   name:'San Luis Potosí',     abbr:'SLP',  region:'norte',     capital:'San Luis Potosí',    pop:'2.8 M', area:'60,983 km²',  fact:'La Huasteca Potosina es famosa por sus cascadas turquesa: Tamul y Micos.',           points:'335,125 398,125 410,155 400,215 345,220 325,182 334,148',                                        labelX:364, labelY:167 },
  { id:'nay',   name:'Nayarit',             abbr:'NAY',  region:'occidente', capital:'Tepic',              pop:'1.2 M', area:'27,815 km²',  fact:'Riviera Nayarit tiene más de 300 km de playas paradisíacas en el Pacífico.',         points:'108,217 140,198 160,210 154,255 128,265 102,250',                                                labelX:132, labelY:233 },
  { id:'jal',   name:'Jalisco',             abbr:'JAL',  region:'occidente', capital:'Guadalajara',        pop:'8.5 M', area:'78,599 km²',  fact:'Cuna del mariachi, el tequila y la charrería — íconos culturales de México.',       points:'140,200 202,192 240,203 254,265 226,315 170,316 133,275 132,238',                                labelX:187, labelY:251 },
  { id:'col',   name:'Colima',              abbr:'COL',  region:'occidente', capital:'Colima',             pop:'0.7 M', area:'5,625 km²',   fact:'Estado más pequeño y menos poblado de México; tiene el Volcán de Fuego activo.',    points:'172,318 200,310 207,336 186,350 164,340',                                                        labelX:186, labelY:331 },
  { id:'ags',   name:'Aguascalientes',      abbr:'AGS',  region:'norte',     capital:'Aguascalientes',     pop:'1.4 M', area:'5,618 km²',   fact:'Su Feria de San Marcos es la feria más grande e importante de México.',             points:'272,205 312,202 316,230 292,236 270,226',                                                        labelX:292, labelY:220 },
  { id:'gto',   name:'Guanajuato',          abbr:'GTO',  region:'centro',    capital:'Guanajuato',         pop:'6.2 M', area:'30,589 km²',  fact:'Guanajuato tiene famosas calles subterráneas y el Callejón del Beso.',              points:'286,232 347,220 367,240 357,282 300,288 274,265',                                                labelX:322, labelY:255 },
  { id:'qro',   name:'Querétaro',           abbr:'QRO',  region:'centro',    capital:'Querétaro',          pop:'2.4 M', area:'11,684 km²',  fact:'En 1848 se firmó el Tratado de Guadalupe-Hidalgo cediendo territorio a EE.UU.',    points:'364,218 408,215 418,250 398,280 360,278 352,253',                                                labelX:383, labelY:249 },
  { id:'hgo',   name:'Hidalgo',             abbr:'HGO',  region:'centro',    capital:'Pachuca',            pop:'3.1 M', area:'20,846 km²',  fact:'El primer partido de futbol en México se jugó en Real del Monte (1900).',           points:'410,215 462,212 468,255 435,285 410,276 400,252',                                                labelX:431, labelY:249 },
  { id:'ver',   name:'Veracruz',            abbr:'VER',  region:'sureste',   capital:'Xalapa',             pop:'8.1 M', area:'71,826 km²',  fact:'Puerto de Veracruz fue el primer puerto fundado por los españoles en América.',     points:'464,182 506,172 525,198 518,260 500,320 470,380 445,360 450,300 460,240 454,195',            labelX:479, labelY:261 },
  { id:'mic',   name:'Michoacán',           abbr:'MIC',  region:'occidente', capital:'Morelia',            pop:'4.7 M', area:'58,643 km²',  fact:'Millones de mariposas monarca migran cada año a los bosques de Michoacán.',         points:'204,287 260,285 300,290 316,320 290,362 244,365 204,340 194,315',                                labelX:252, labelY:321 },
  { id:'mex',   name:'Estado de México',    abbr:'MEX',  region:'centro',    capital:'Toluca',             pop:'16.9 M',area:'22,351 km²',  fact:'Es el estado más poblado de México con más de 16 millones de habitantes.',          points:'354,280 408,275 420,300 410,330 370,340 344,326 347,296',                                        labelX:379, labelY:307 },
  { id:'tla',   name:'Tlaxcala',            abbr:'TLA',  region:'centro',    capital:'Tlaxcala',           pop:'1.4 M', area:'3,991 km²',   fact:'Estado más pequeño en superficie y el único sin litoral de México.',               points:'460,277 484,275 494,300 464,310 450,296',                                                        labelX:470, labelY:292 },
  { id:'pue',   name:'Puebla',              abbr:'PUE',  region:'centro',    capital:'Puebla',             pop:'6.6 M', area:'34,290 km²',  fact:'El mole poblano y el chile en nogada son sus platillos más famosos del mundo.',     points:'460,255 505,255 526,275 524,340 490,376 454,366 434,336 442,300 452,278',                    labelX:476, labelY:309 },
  { id:'cdmx',  name:'Ciudad de México',    abbr:'CDMX', region:'centro',    capital:'Ciudad de México',   pop:'9.2 M', area:'1,495 km²',   fact:'Ciudad más poblada de América del Norte y capital política del país.',             points:'370,342 396,336 403,355 380,370 360,360 360,346',                                                labelX:378, labelY:352 },
  { id:'mor',   name:'Morelos',             abbr:'MOR',  region:'centro',    capital:'Cuernavaca',         pop:'2.0 M', area:'4,893 km²',   fact:'Cuernavaca es la "Ciudad de la Eterna Primavera" por su clima templado.',          points:'360,363 410,360 420,386 394,406 360,396 352,378',                                                labelX:383, labelY:382 },
  { id:'gro',   name:'Guerrero',            abbr:'GRO',  region:'sur',       capital:'Chilpancingo',       pop:'3.6 M', area:'63,621 km²',  fact:'Acapulco fue durante décadas el principal destino turístico internacional de México.',points:'294,360 350,346 384,360 390,406 354,443 304,446 270,416 262,386',                            labelX:326, labelY:395 },
  { id:'oax',   name:'Oaxaca',              abbr:'OAX',  region:'sur',       capital:'Oaxaca de Juárez',   pop:'4.1 M', area:'93,793 km²',  fact:'Mayor diversidad étnica de México: más de 16 grupos indígenas con sus lenguas.',   points:'450,366 516,366 546,383 560,423 534,458 480,463 440,442 424,410 434,386',                    labelX:487, labelY:411 },
  { id:'chis',  name:'Chiapas',             abbr:'CHIS', region:'sur',       capital:'Tuxtla Gutiérrez',   pop:'5.5 M', area:'73,311 km²',  fact:'Alberga las ruinas mayas de Palenque y las cascadas de Agua Azul y Misol-Ha.',    points:'536,458 604,436 648,446 652,493 607,513 550,508 524,482',                                        labelX:589, labelY:477 },
  { id:'tab',   name:'Tabasco',             abbr:'TAB',  region:'sureste',   capital:'Villahermosa',       pop:'2.4 M', area:'24,661 km²',  fact:'Tabasco tiene el 40% del agua superficial de México; mayor caudal del país.',      points:'560,386 628,370 660,386 654,430 604,438 557,416',                                                labelX:611, labelY:404 },
  { id:'cam',   name:'Campeche',            abbr:'CAM',  region:'sureste',   capital:'Campeche',           pop:'0.9 M', area:'57,507 km²',  fact:'Su ciudad amurallada colonial es Patrimonio de la Humanidad por la UNESCO.',       points:'658,388 728,382 750,423 727,486 674,493 650,493 654,433',                                        labelX:692, labelY:443 },
  { id:'yuc',   name:'Yucatán',             abbr:'YUC',  region:'sureste',   capital:'Mérida',             pop:'2.3 M', area:'39,524 km²',  fact:'Chichén Itzá es una de las Siete Maravillas del Mundo Moderno.',                  points:'728,382 820,376 830,413 787,440 734,436 727,420 732,396',                                        labelX:765, labelY:409 },
  { id:'qroo',  name:'Quintana Roo',        abbr:'QROO', region:'sureste',   capital:'Chetumal',           pop:'1.9 M', area:'44,705 km²',  fact:'Cancún y la Riviera Maya reciben más de 20 millones de turistas al año.',          points:'822,376 860,382 880,422 860,496 797,500 764,463 774,422 801,400',                                labelX:820, labelY:433 },
];

export default function MexicoMapArtifact({ state: initState = '' }: { state?: string }) {
  const [selected, setSelected] = useState<StateInfo | null>(() =>
    initState ? STATES.find(s => s.id === initState.toLowerCase() || s.name.toLowerCase().includes(initState.toLowerCase())) ?? null : null
  );
  const [hovered, setHovered] = useState<string | null>(null);
  const [activeRegion, setActiveRegion] = useState<string | null>(null);

  const visible = activeRegion ? STATES.filter(s => s.region === activeRegion) : STATES;
  const visibleIds = new Set(visible.map(s => s.id));

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/80 overflow-hidden select-none">
      <div className="px-4 py-3 border-b border-white/10 flex items-center gap-2">
        <MapPin className="h-4 w-4 text-emerald-400" />
        <span className="text-sm font-black uppercase tracking-widest text-white">Mapa Interactivo — México</span>
        <span className="ml-auto text-[10px] text-slate-500">Haz clic en un estado</span>
      </div>

      {/* Region legend */}
      <div className="flex flex-wrap gap-1.5 px-4 py-2 border-b border-white/5">
        <button
          onClick={() => setActiveRegion(null)}
          className={`text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-full transition-all ${!activeRegion ? 'bg-white/20 text-white' : 'text-slate-500 hover:text-white'}`}
        >
          Todos
        </button>
        {Object.entries(REGION_COLORS).map(([k, v]) => (
          <button
            key={k}
            onClick={() => setActiveRegion(activeRegion === k ? null : k)}
            className={`text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-full transition-all`}
            style={{
              background: activeRegion === k ? v.fill : 'transparent',
              color: activeRegion === k ? '#fff' : v.fill,
              border: `1px solid ${v.fill}40`,
            }}
          >
            {v.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* SVG Map */}
        <div className="flex-1 p-2">
          <svg viewBox="0 0 910 530" className="w-full" style={{ maxHeight: 380 }}>
            {STATES.map(state => {
              const color = REGION_COLORS[state.region];
              const isHovered = hovered === state.id;
              const isSelected = selected?.id === state.id;
              const isDimmed = activeRegion !== null && !visibleIds.has(state.id);
              return (
                <g key={state.id}
                  onClick={() => setSelected(selected?.id === state.id ? null : state)}
                  onMouseEnter={() => setHovered(state.id)}
                  onMouseLeave={() => setHovered(null)}
                  style={{ cursor: 'pointer' }}
                >
                  <polygon
                    points={state.points}
                    fill={isSelected ? '#ffffff' : isDimmed ? '#1e293b' : color.fill}
                    stroke={isSelected ? '#fff' : isDimmed ? '#334155' : color.hover}
                    strokeWidth={isSelected ? 2 : isHovered ? 1.5 : 0.8}
                    opacity={isDimmed ? 0.3 : isHovered ? 1 : 0.85}
                    style={{ transition: 'all 0.15s ease' }}
                  />
                  <text
                    x={state.labelX}
                    y={state.labelY}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize={state.abbr.length > 3 ? 6 : 7}
                    fontWeight="700"
                    fill={isSelected ? '#1e293b' : isDimmed ? '#475569' : '#fff'}
                    pointerEvents="none"
                    style={{ userSelect: 'none', letterSpacing: '0.02em' }}
                  >
                    {state.abbr}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Info panel */}
        {selected ? (
          <div className="lg:w-56 border-t lg:border-t-0 lg:border-l border-white/10 p-4 flex flex-col gap-3">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-white leading-tight">{selected.name}</p>
                <span
                  className="inline-block mt-1 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full"
                  style={{ background: REGION_COLORS[selected.region].fill + '30', color: REGION_COLORS[selected.region].fill }}
                >
                  {REGION_COLORS[selected.region].label}
                </span>
              </div>
              <button onClick={() => setSelected(null)} className="text-slate-500 hover:text-white p-0.5">
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="space-y-2 text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-500 font-bold">Capital</span>
                <span className="text-white font-bold text-right">{selected.capital}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-bold">Población</span>
                <span className="text-white font-bold">{selected.pop}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-bold">Extensión</span>
                <span className="text-white font-bold">{selected.area}</span>
              </div>
            </div>
            <div className="rounded-xl bg-white/5 border border-white/10 p-2.5">
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1 flex items-center gap-1">
                <Info className="h-2.5 w-2.5" /> Dato curioso
              </p>
              <p className="text-[11px] text-slate-300 leading-relaxed">{selected.fact}</p>
            </div>
          </div>
        ) : (
          <div className="lg:w-56 border-t lg:border-t-0 lg:border-l border-white/10 p-4 flex items-center justify-center">
            <div className="text-center space-y-2">
              <MapPin className="h-8 w-8 text-slate-600 mx-auto" />
              <p className="text-[11px] text-slate-500 font-bold">Selecciona un estado<br/>para ver su información</p>
              <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest">32 estados · 7 regiones</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
