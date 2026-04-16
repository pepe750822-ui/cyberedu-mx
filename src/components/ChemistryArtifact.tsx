import React, { useState } from "react";
import { Beaker, Atom, Thermometer, Weight, Info, Grid, X, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChemistryProps {
  element: {
    name: string;
    symbol: string;
    atomic_number: number;
    atomic_mass: number;
    category: string;
    properties: {
      density: string;
      melting_point: string;
      boiling_point: string;
      electron_config: string;
    };
    description: string;
  };
}

// ── Tabla Periódica Completa (118 elementos) ──────────────────────────────
// Cada entrada: { s: símbolo, n: número atómico, name: nombre, mass: masa,
//                r: fila (periodo), c: columna (grupo), cat: categoría }
const PT_FULL = [
  // Periodo 1
  { s:"H",  n:1,   name:"Hidrógeno",    mass:1.008,   r:1, c:1,  cat:"No metales" },
  { s:"He", n:2,   name:"Helio",        mass:4.003,   r:1, c:18, cat:"Gases nobles" },
  // Periodo 2
  { s:"Li", n:3,   name:"Litio",        mass:6.941,   r:2, c:1,  cat:"Alcalinos" },
  { s:"Be", n:4,   name:"Berilio",      mass:9.012,   r:2, c:2,  cat:"Metales Alcalinotérreos" },
  { s:"B",  n:5,   name:"Boro",         mass:10.811,  r:2, c:13, cat:"Metaloides" },
  { s:"C",  n:6,   name:"Carbono",      mass:12.011,  r:2, c:14, cat:"No metales" },
  { s:"N",  n:7,   name:"Nitrógeno",    mass:14.007,  r:2, c:15, cat:"No metales" },
  { s:"O",  n:8,   name:"Oxígeno",      mass:15.999,  r:2, c:16, cat:"No metales" },
  { s:"F",  n:9,   name:"Flúor",        mass:18.998,  r:2, c:17, cat:"Halógenos" },
  { s:"Ne", n:10,  name:"Neón",         mass:20.180,  r:2, c:18, cat:"Gases nobles" },
  // Periodo 3
  { s:"Na", n:11,  name:"Sodio",        mass:22.990,  r:3, c:1,  cat:"Alcalinos" },
  { s:"Mg", n:12,  name:"Magnesio",     mass:24.305,  r:3, c:2,  cat:"Metales Alcalinotérreos" },
  { s:"Al", n:13,  name:"Aluminio",     mass:26.982,  r:3, c:13, cat:"Otros metales" },
  { s:"Si", n:14,  name:"Silicio",      mass:28.086,  r:3, c:14, cat:"Metaloides" },
  { s:"P",  n:15,  name:"Fósforo",      mass:30.974,  r:3, c:15, cat:"No metales" },
  { s:"S",  n:16,  name:"Azufre",       mass:32.060,  r:3, c:16, cat:"No metales" },
  { s:"Cl", n:17,  name:"Cloro",        mass:35.450,  r:3, c:17, cat:"Halógenos" },
  { s:"Ar", n:18,  name:"Argón",        mass:39.948,  r:3, c:18, cat:"Gases nobles" },
  // Periodo 4
  { s:"K",  n:19,  name:"Potasio",      mass:39.098,  r:4, c:1,  cat:"Alcalinos" },
  { s:"Ca", n:20,  name:"Calcio",       mass:40.078,  r:4, c:2,  cat:"Metales Alcalinotérreos" },
  { s:"Sc", n:21,  name:"Escandio",     mass:44.956,  r:4, c:3,  cat:"Metales de transición" },
  { s:"Ti", n:22,  name:"Titanio",      mass:47.867,  r:4, c:4,  cat:"Metales de transición" },
  { s:"V",  n:23,  name:"Vanadio",      mass:50.942,  r:4, c:5,  cat:"Metales de transición" },
  { s:"Cr", n:24,  name:"Cromo",        mass:51.996,  r:4, c:6,  cat:"Metales de transición" },
  { s:"Mn", n:25,  name:"Manganeso",    mass:54.938,  r:4, c:7,  cat:"Metales de transición" },
  { s:"Fe", n:26,  name:"Hierro",       mass:55.845,  r:4, c:8,  cat:"Metales de transición" },
  { s:"Co", n:27,  name:"Cobalto",      mass:58.933,  r:4, c:9,  cat:"Metales de transición" },
  { s:"Ni", n:28,  name:"Níquel",       mass:58.693,  r:4, c:10, cat:"Metales de transición" },
  { s:"Cu", n:29,  name:"Cobre",        mass:63.546,  r:4, c:11, cat:"Metales de transición" },
  { s:"Zn", n:30,  name:"Zinc",         mass:65.380,  r:4, c:12, cat:"Metales de transición" },
  { s:"Ga", n:31,  name:"Galio",        mass:69.723,  r:4, c:13, cat:"Otros metales" },
  { s:"Ge", n:32,  name:"Germanio",     mass:72.630,  r:4, c:14, cat:"Metaloides" },
  { s:"As", n:33,  name:"Arsénico",     mass:74.922,  r:4, c:15, cat:"Metaloides" },
  { s:"Se", n:34,  name:"Selenio",      mass:78.971,  r:4, c:16, cat:"No metales" },
  { s:"Br", n:35,  name:"Bromo",        mass:79.904,  r:4, c:17, cat:"Halógenos" },
  { s:"Kr", n:36,  name:"Kriptón",      mass:83.798,  r:4, c:18, cat:"Gases nobles" },
  // Periodo 5
  { s:"Rb", n:37,  name:"Rubidio",      mass:85.468,  r:5, c:1,  cat:"Alcalinos" },
  { s:"Sr", n:38,  name:"Estroncio",    mass:87.620,  r:5, c:2,  cat:"Metales Alcalinotérreos" },
  { s:"Y",  n:39,  name:"Ytrio",        mass:88.906,  r:5, c:3,  cat:"Metales de transición" },
  { s:"Zr", n:40,  name:"Circonio",     mass:91.224,  r:5, c:4,  cat:"Metales de transición" },
  { s:"Nb", n:41,  name:"Niobio",       mass:92.906,  r:5, c:5,  cat:"Metales de transición" },
  { s:"Mo", n:42,  name:"Molibdeno",    mass:95.960,  r:5, c:6,  cat:"Metales de transición" },
  { s:"Tc", n:43,  name:"Tecnecio",     mass:98.000,  r:5, c:7,  cat:"Metales de transición" },
  { s:"Ru", n:44,  name:"Rutenio",      mass:101.07,  r:5, c:8,  cat:"Metales de transición" },
  { s:"Rh", n:45,  name:"Rodio",        mass:102.906, r:5, c:9,  cat:"Metales de transición" },
  { s:"Pd", n:46,  name:"Paladio",      mass:106.42,  r:5, c:10, cat:"Metales de transición" },
  { s:"Ag", n:47,  name:"Plata",        mass:107.868, r:5, c:11, cat:"Metales de transición" },
  { s:"Cd", n:48,  name:"Cadmio",       mass:112.411, r:5, c:12, cat:"Metales de transición" },
  { s:"In", n:49,  name:"Indio",        mass:114.818, r:5, c:13, cat:"Otros metales" },
  { s:"Sn", n:50,  name:"Estaño",       mass:118.710, r:5, c:14, cat:"Otros metales" },
  { s:"Sb", n:51,  name:"Antimonio",    mass:121.760, r:5, c:15, cat:"Metaloides" },
  { s:"Te", n:52,  name:"Telurio",      mass:127.600, r:5, c:16, cat:"Metaloides" },
  { s:"I",  n:53,  name:"Yodo",         mass:126.904, r:5, c:17, cat:"Halógenos" },
  { s:"Xe", n:54,  name:"Xenón",        mass:131.293, r:5, c:18, cat:"Gases nobles" },
  // Periodo 6
  { s:"Cs", n:55,  name:"Cesio",        mass:132.905, r:6, c:1,  cat:"Alcalinos" },
  { s:"Ba", n:56,  name:"Bario",        mass:137.327, r:6, c:2,  cat:"Metales Alcalinotérreos" },
  { s:"La", n:57,  name:"Lantano",      mass:138.905, r:8, c:3,  cat:"Lantánidos" },
  { s:"Ce", n:58,  name:"Cerio",        mass:140.116, r:8, c:4,  cat:"Lantánidos" },
  { s:"Pr", n:59,  name:"Praseodimio",  mass:140.908, r:8, c:5,  cat:"Lantánidos" },
  { s:"Nd", n:60,  name:"Neodimio",     mass:144.242, r:8, c:6,  cat:"Lantánidos" },
  { s:"Pm", n:61,  name:"Prometio",     mass:145.000, r:8, c:7,  cat:"Lantánidos" },
  { s:"Sm", n:62,  name:"Samario",      mass:150.360, r:8, c:8,  cat:"Lantánidos" },
  { s:"Eu", n:63,  name:"Europio",      mass:151.964, r:8, c:9,  cat:"Lantánidos" },
  { s:"Gd", n:64,  name:"Gadolinio",    mass:157.250, r:8, c:10, cat:"Lantánidos" },
  { s:"Tb", n:65,  name:"Terbio",       mass:158.925, r:8, c:11, cat:"Lantánidos" },
  { s:"Dy", n:66,  name:"Disprosio",    mass:162.500, r:8, c:12, cat:"Lantánidos" },
  { s:"Ho", n:67,  name:"Holmio",       mass:164.930, r:8, c:13, cat:"Lantánidos" },
  { s:"Er", n:68,  name:"Erbio",        mass:167.259, r:8, c:14, cat:"Lantánidos" },
  { s:"Tm", n:69,  name:"Tulio",        mass:168.934, r:8, c:15, cat:"Lantánidos" },
  { s:"Yb", n:70,  name:"Iterbio",      mass:173.045, r:8, c:16, cat:"Lantánidos" },
  { s:"Lu", n:71,  name:"Lutecio",      mass:174.967, r:8, c:17, cat:"Lantánidos" },
  { s:"Hf", n:72,  name:"Hafnio",       mass:178.490, r:6, c:4,  cat:"Metales de transición" },
  { s:"Ta", n:73,  name:"Tántalo",      mass:180.948, r:6, c:5,  cat:"Metales de transición" },
  { s:"W",  n:74,  name:"Wolframio",    mass:183.840, r:6, c:6,  cat:"Metales de transición" },
  { s:"Re", n:75,  name:"Renio",        mass:186.207, r:6, c:7,  cat:"Metales de transición" },
  { s:"Os", n:76,  name:"Osmio",        mass:190.230, r:6, c:8,  cat:"Metales de transición" },
  { s:"Ir", n:77,  name:"Iridio",       mass:192.217, r:6, c:9,  cat:"Metales de transición" },
  { s:"Pt", n:78,  name:"Platino",      mass:195.084, r:6, c:10, cat:"Metales de transición" },
  { s:"Au", n:79,  name:"Oro",          mass:196.967, r:6, c:11, cat:"Metales de transición" },
  { s:"Hg", n:80,  name:"Mercurio",     mass:200.592, r:6, c:12, cat:"Metales de transición" },
  { s:"Tl", n:81,  name:"Talio",        mass:204.383, r:6, c:13, cat:"Otros metales" },
  { s:"Pb", n:82,  name:"Plomo",        mass:207.200, r:6, c:14, cat:"Otros metales" },
  { s:"Bi", n:83,  name:"Bismuto",      mass:208.980, r:6, c:15, cat:"Otros metales" },
  { s:"Po", n:84,  name:"Polonio",      mass:209.000, r:6, c:16, cat:"Metaloides" },
  { s:"At", n:85,  name:"Astato",       mass:210.000, r:6, c:17, cat:"Halógenos" },
  { s:"Rn", n:86,  name:"Radón",        mass:222.000, r:6, c:18, cat:"Gases nobles" },
  // Periodo 7
  { s:"Fr", n:87,  name:"Francio",      mass:223.000, r:7, c:1,  cat:"Alcalinos" },
  { s:"Ra", n:88,  name:"Radio",        mass:226.000, r:7, c:2,  cat:"Metales Alcalinotérreos" },
  { s:"Ac", n:89,  name:"Actinio",      mass:227.000, r:9, c:3,  cat:"Actínidos" },
  { s:"Th", n:90,  name:"Torio",        mass:232.038, r:9, c:4,  cat:"Actínidos" },
  { s:"Pa", n:91,  name:"Protactinio",  mass:231.036, r:9, c:5,  cat:"Actínidos" },
  { s:"U",  n:92,  name:"Uranio",       mass:238.029, r:9, c:6,  cat:"Actínidos" },
  { s:"Np", n:93,  name:"Neptunio",     mass:237.000, r:9, c:7,  cat:"Actínidos" },
  { s:"Pu", n:94,  name:"Plutonio",     mass:244.000, r:9, c:8,  cat:"Actínidos" },
  { s:"Am", n:95,  name:"Americio",     mass:243.000, r:9, c:9,  cat:"Actínidos" },
  { s:"Cm", n:96,  name:"Curio",        mass:247.000, r:9, c:10, cat:"Actínidos" },
  { s:"Bk", n:97,  name:"Berkelio",     mass:247.000, r:9, c:11, cat:"Actínidos" },
  { s:"Cf", n:98,  name:"Californio",   mass:251.000, r:9, c:12, cat:"Actínidos" },
  { s:"Es", n:99,  name:"Einstenio",    mass:252.000, r:9, c:13, cat:"Actínidos" },
  { s:"Fm", n:100, name:"Fermio",       mass:257.000, r:9, c:14, cat:"Actínidos" },
  { s:"Md", n:101, name:"Mendelevio",   mass:258.000, r:9, c:15, cat:"Actínidos" },
  { s:"No", n:102, name:"Nobelio",      mass:259.000, r:9, c:16, cat:"Actínidos" },
  { s:"Lr", n:103, name:"Lawrencio",    mass:266.000, r:9, c:17, cat:"Actínidos" },
  { s:"Rf", n:104, name:"Rutherfordio", mass:267.000, r:7, c:4,  cat:"Metales de transición" },
  { s:"Db", n:105, name:"Dubnio",       mass:268.000, r:7, c:5,  cat:"Metales de transición" },
  { s:"Sg", n:106, name:"Seaborgio",    mass:269.000, r:7, c:6,  cat:"Metales de transición" },
  { s:"Bh", n:107, name:"Bohrio",       mass:270.000, r:7, c:7,  cat:"Metales de transición" },
  { s:"Hs", n:108, name:"Hasio",        mass:270.000, r:7, c:8,  cat:"Metales de transición" },
  { s:"Mt", n:109, name:"Meitnerio",    mass:278.000, r:7, c:9,  cat:"Metales de transición" },
  { s:"Ds", n:110, name:"Darmstadtio",  mass:281.000, r:7, c:10, cat:"Metales de transición" },
  { s:"Rg", n:111, name:"Roentgenio",   mass:282.000, r:7, c:11, cat:"Metales de transición" },
  { s:"Cn", n:112, name:"Copernicio",   mass:285.000, r:7, c:12, cat:"Metales de transición" },
  { s:"Nh", n:113, name:"Nihonio",      mass:286.000, r:7, c:13, cat:"Otros metales" },
  { s:"Fl", n:114, name:"Flerovio",     mass:289.000, r:7, c:14, cat:"Otros metales" },
  { s:"Mc", n:115, name:"Moscovio",     mass:290.000, r:7, c:15, cat:"Otros metales" },
  { s:"Lv", n:116, name:"Livermorio",   mass:293.000, r:7, c:16, cat:"Otros metales" },
  { s:"Ts", n:117, name:"Teneso",       mass:294.000, r:7, c:17, cat:"Halógenos" },
  { s:"Og", n:118, name:"Oganesón",     mass:294.000, r:7, c:18, cat:"Gases nobles" },
];

// Añadir marcadores de lantánidos/actínidos vacíos en la tabla principal
const PT_PLACEHOLDERS = [
  { s:"La-Lu", n:0, name:"Lantánidos", mass:0, r:6, c:3, cat:"Lantánidos" },
  { s:"Ac-Lr", n:0, name:"Actínidos",  mass:0, r:7, c:3, cat:"Actínidos" },
];

// ── Utilidades ────────────────────────────────────────────────────────────
const getPeriod = (row: number) => row <= 7 ? row : row === 8 ? 6 : 7;

export const ChemistryArtifact: React.FC<ChemistryProps> = ({ element }) => {
  const [showTable, setShowTable] = useState(false);
  const [selectedInModal, setSelectedInModal] = useState<any>(null);

  if (!element || !element.symbol) return null;

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case "Metales de transición":      return "bg-amber-500/20 text-amber-400 border-amber-500/30 hover:bg-amber-500/40";
      case "Gases nobles":               return "bg-indigo-500/20 text-indigo-400 border-indigo-500/30 hover:bg-indigo-500/40";
      case "No metales":                 return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/40";
      case "Alcalinos":                  return "bg-rose-500/20 text-rose-400 border-rose-500/30 hover:bg-rose-500/40";
      case "Metales Alcalinotérreos":    return "bg-pink-500/20 text-pink-400 border-pink-500/30 hover:bg-pink-500/40";
      case "Halógenos":                  return "bg-cyan-500/20 text-cyan-400 border-cyan-500/30 hover:bg-cyan-500/40";
      case "Metaloides":                 return "bg-orange-500/20 text-orange-400 border-orange-500/30 hover:bg-orange-500/40";
      case "Otros metales":              return "bg-teal-500/20 text-teal-400 border-teal-500/30 hover:bg-teal-500/40";
      case "Lantánidos":                 return "bg-violet-500/20 text-violet-400 border-violet-500/30 hover:bg-violet-500/40";
      case "Actínidos":                  return "bg-fuchsia-500/20 text-fuchsia-400 border-fuchsia-500/30 hover:bg-fuchsia-500/40";
      default:                           return "bg-primary/20 text-primary border-primary/30 hover:bg-primary/40";
    }
  };

  const colorStyle = getCategoryColor(element.category);

  // Cuáles categorías mostrar en la leyenda
  const LEGEND_CATS = [
    "Alcalinos", "Metales Alcalinotérreos", "Metales de transición", "Otros metales",
    "Metaloides", "No metales", "Halógenos", "Gases nobles", "Lantánidos", "Actínidos"
  ];

  return (
    <>
      {/* ── Tarjeta del elemento ── */}
      <div className="my-6 rounded-3xl border border-white/10 bg-slate-900/50 backdrop-blur-xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-500 max-w-sm mx-auto">
        {/* Header */}
        <div className={cn("p-5 border-b border-white/10 flex items-center justify-between gap-3", colorStyle.split(' hover:')[0])}>
          <div className="flex items-center gap-4 min-w-0">
            <div
              className="h-[72px] w-[72px] shrink-0 rounded-2xl bg-black/30 border border-white/10 flex items-center justify-center relative shadow-inner hover:scale-105 transition-transform cursor-pointer"
              onClick={() => setShowTable(true)}
              title="Ver en Tabla Periódica completa"
            >
              <span className="text-3xl font-black tracking-tight">{element.symbol}</span>
              <span className="absolute top-1.5 right-2 text-[11px] font-bold opacity-60">{element.atomic_number}</span>
              <span className="absolute bottom-1.5 left-0 right-0 text-center text-[9px] font-bold opacity-50">{element.atomic_mass}</span>
            </div>
            <div className="min-w-0">
              <h3 className="text-xl font-black uppercase tracking-tight leading-none text-white">{element.name}</h3>
              <p className="text-xs font-bold uppercase tracking-widest mt-1.5 opacity-75">{element.category}</p>
            </div>
          </div>
          <button
            onClick={() => setShowTable(!showTable)}
            className="p-2.5 shrink-0 rounded-xl bg-black/20 hover:bg-black/40 border border-white/10 hover:border-white/30 transition-all"
            title="Ver Tabla Periódica Completa"
          >
            <Grid className="h-5 w-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/5 rounded-2xl p-3 border border-white/5 flex flex-col items-center">
              <Weight className="h-4 w-4 text-slate-500 mb-1" />
              <p className="text-xs font-black text-slate-200">{element.atomic_mass || "–"} u</p>
              <p className="text-[9px] text-slate-500 uppercase font-black">Masa Atómica</p>
            </div>
            <div className="bg-white/5 rounded-2xl p-3 border border-white/5 flex flex-col items-center">
              <Atom className="h-4 w-4 text-slate-500 mb-1" />
              <p className="text-xs font-black text-slate-200">{element.atomic_number || "–"}</p>
              <p className="text-[9px] text-slate-500 uppercase font-black">Protones</p>
            </div>
          </div>

          {/* Properties */}
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 rounded-xl bg-white/[0.02] border border-white/5">
              <div className="flex items-center gap-2">
                <Thermometer className="h-3.5 w-3.5 text-amber-400" />
                <span className="text-xs text-slate-400 font-bold">Punto de Fusión</span>
              </div>
              <span className="text-xs font-black text-white">{element.properties?.melting_point || "ND"}</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-xl bg-white/[0.02] border border-white/5">
              <div className="flex items-center gap-2">
                <Thermometer className="h-3.5 w-3.5 text-cyan-400" />
                <span className="text-xs text-slate-400 font-bold">Punto de Ebullición</span>
              </div>
              <span className="text-xs font-black text-white">{element.properties?.boiling_point || "ND"}</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-xl bg-white/[0.02] border border-white/5">
              <div className="flex items-center gap-2">
                <Beaker className="h-3.5 w-3.5 text-violet-400" />
                <span className="text-xs text-slate-400 font-bold">Config. Electrónica</span>
              </div>
              <span className="text-[10px] font-mono font-bold text-white">{element.properties?.electron_config || "ND"}</span>
            </div>
            {element.properties?.density && (
              <div className="flex items-center justify-between p-2 rounded-xl bg-white/[0.02] border border-white/5">
                <div className="flex items-center gap-2">
                  <Weight className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-xs text-slate-400 font-bold">Densidad</span>
                </div>
                <span className="text-xs font-black text-white">{element.properties.density}</span>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10">
            <div className="flex items-center gap-2 mb-2">
              <Info className="h-3.5 w-3.5 text-primary" />
              <p className="text-[10px] font-black text-primary uppercase tracking-widest">Dato del Tutor</p>
            </div>
            <p className="text-xs text-slate-300 italic leading-relaxed">
              {element.description || "Información en análisis..."}
            </p>
          </div>
        </div>

        <div className="px-5 py-3 bg-white/[0.02] border-t border-white/5 flex justify-center">
          <button onClick={() => setShowTable(true)} className="text-[9px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1 hover:text-slate-300 transition-colors">
            <Grid className="h-3 w-3" /> Ver tabla periódica completa (118 elementos)
          </button>
        </div>
      </div>

      {/* ── Modal Tabla Periódica Completa ── */}
      {showTable && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-2 md:p-6 overflow-hidden">
          {/* Backdrop animado con Desenfoque Dinámico */}
          <div 
            className="absolute inset-0 bg-slate-950/40 backdrop-blur-[20px] animate-in fade-in duration-700"
            onClick={() => { setShowTable(false); setSelectedInModal(null); }}
          />
          
          <div className="relative w-full max-w-7xl bg-slate-900/80 border border-white/10 rounded-[32px] shadow-[0_32px_120px_-20px_rgba(0,0,0,0.8)] overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-10 duration-500 ease-out flex flex-col max-h-[94vh] backdrop-saturate-150">
            
            {/* Modal Header con Efecto de Cristal */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/[0.02] backdrop-blur-md shrink-0">
              <div className="flex items-center gap-4">
                <div className="h-11 w-11 bg-indigo-500/20 border border-indigo-500/30 rounded-2xl flex items-center justify-center shadow-inner">
                  <Grid className="h-5 w-5 text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white uppercase tracking-tighter leading-tight italic">Tabla Periódica Interactiva</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                    <p className="text-[10px] font-black text-indigo-400/80 uppercase tracking-[0.2em]">118 Elementos — IUPAC Master V1.2</p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => { setShowTable(false); setSelectedInModal(null); }}
                className="group relative p-3 bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 rounded-2xl transition-all duration-300 active:scale-90"
              >
                <X className="h-6 w-6" />
                <div className="absolute inset-0 rounded-2xl border border-white/0 group-hover:border-rose-500/30 transition-all" />
              </button>
            </div>

            {/* Leyenda Inteligente */}
            <div className="px-6 pt-4 pb-2 flex flex-wrap gap-2 shrink-0 bg-slate-900/50">
              {LEGEND_CATS.map(cat => (
                <span key={cat} className={cn(
                  "px-3 py-1 rounded-full text-[9px] font-black uppercase border transition-all hover:scale-105 cursor-default",
                  getCategoryColor(cat).split(' hover:')[0].replace('/20', '/10')
                )}>
                  {cat}
                </span>
              ))}
            </div>

            {/* Tabla con Scroll Custom Ultra-Smooth */}
            <div className="p-4 md:p-8 overflow-auto flex-1 custom-scrollbar bg-gradient-to-b from-transparent to-black/20">
              <div
                className="grid gap-1 md:gap-2 mx-auto"
                style={{ 
                  gridTemplateColumns: 'repeat(18, minmax(0, 1fr))', 
                  minWidth: '850px',
                  maxWidth: '1200px'
                }}
              >
                {/* Elementos principales (filas 1-7) */}
                {PT_FULL.filter(el => el.r <= 7).map(el => {
                  const isHighlighted = el.s === element.symbol;
                  return (
                    <button
                      key={el.n}
                      onClick={() => setSelectedInModal(el)}
                      style={{ gridRow: el.r, gridColumn: el.c }}
                      className={cn(
                        "relative flex flex-col justify-between items-center rounded-xl border transition-all cursor-pointer p-1 md:p-2 overflow-hidden group hover:z-20",
                        "w-full aspect-square shadow-lg",
                        getCategoryColor(el.cat),
                        isHighlighted 
                          ? "ring-4 ring-white/30 scale-110 shadow-[0_0_30px_rgba(255,255,255,0.3)] z-10 bg-white/20 select-none" 
                          : "hover:scale-110 hover:shadow-2xl"
                      )}
                      title={`${el.name} (${el.s}) — Z=${el.n}, ${el.mass} u`}
                    >
                      <span className="text-[6px] md:text-[10px] font-black opacity-40 self-start leading-none">{el.n}</span>
                      <span className="text-xs md:text-xl font-black leading-none group-hover:scale-110 transition-transform">{el.s}</span>
                      <div className="hidden md:flex flex-col items-center w-full">
                        <span className="text-[7px] font-bold opacity-60 leading-none truncate w-full text-center uppercase tracking-tighter">{el.name}</span>
                        <span className="text-[6px] opacity-40 leading-none mt-1 font-mono">{el.mass.toFixed(2)}</span>
                      </div>
                      
                      {/* Indicador de Seleccionado */}
                      {isHighlighted && <div className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_8px_white]" />}
                    </button>
                  );
                })}

                {/* Placeholders La-Lu y Ac-Lr */}
                {PT_PLACEHOLDERS.map(ph => (
                  <div
                    key={ph.s}
                    style={{ gridRow: ph.r, gridColumn: ph.c }}
                    className={cn(
                      "flex items-center justify-center rounded-xl border text-[8px] md:text-[10px] font-black opacity-30 aspect-square bg-white/5",
                      getCategoryColor(ph.cat).split(' hover:')[0]
                    )}
                  >
                    {ph.s}
                  </div>
                ))}

                {/* Separador visual para lantánidos/actínidos */}
                <div style={{ gridRow: 7, gridColumn: '1 / span 3' }} className="flex items-end justify-end pr-3 pb-2">
                  <span className="text-[9px] text-slate-700 font-black italic tracking-widest hidden md:block">RANK 57-71 ↳</span>
                </div>

                {/* Lantánidos (fila 8) */}
                {PT_FULL.filter(el => el.r === 8).map(el => {
                  const col = el.c + 1;
                  return (
                    <button
                      key={el.n}
                      onClick={() => setSelectedInModal(el)}
                      style={{ gridRow: 8, gridColumn: col }}
                      className={cn(
                        "relative flex flex-col justify-between items-center rounded-xl border transition-all cursor-pointer p-1 md:p-2 overflow-hidden group hover:scale-110 hover:z-20 hover:shadow-2xl",
                        "w-full aspect-square",
                        getCategoryColor(el.cat)
                      )}
                    >
                      <span className="text-[6px] md:text-[10px] font-black opacity-40 self-start leading-none">{el.n}</span>
                      <span className="text-xs md:text-xl font-black leading-none">{el.s}</span>
                      <span className="hidden md:block text-[7px] font-bold opacity-60 leading-none truncate w-full text-center uppercase tracking-tighter">{el.name}</span>
                    </button>
                  );
                })}

                {/* Actínidos (fila 9) */}
                {PT_FULL.filter(el => el.r === 9).map(el => {
                  const col = el.c + 1;
                  return (
                    <button
                      key={el.n}
                      onClick={() => setSelectedInModal(el)}
                      style={{ gridRow: 9, gridColumn: col }}
                      className={cn(
                        "relative flex flex-col justify-between items-center rounded-xl border transition-all cursor-pointer p-1 md:p-2 overflow-hidden group hover:scale-110 hover:z-20 hover:shadow-2xl",
                        "w-full aspect-square",
                        getCategoryColor(el.cat)
                      )}
                    >
                      <span className="text-[6px] md:text-[10px] font-black opacity-40 self-start leading-none">{el.n}</span>
                      <span className="text-xs md:text-xl font-black leading-none">{el.s}</span>
                      <span className="hidden md:block text-[7px] font-bold opacity-60 leading-none truncate w-full text-center uppercase tracking-tighter">{el.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Panel de Detalle Inferior: Floating Glass Card */}
            <div className="p-4 md:p-6 bg-slate-950/40 border-t border-white/5 shrink-0 flex items-center justify-center">
              {selectedInModal ? (
                <div className={cn(
                  "w-full max-w-2xl px-6 py-4 rounded-[24px] border border-white/10 animate-in slide-in-from-bottom-4 duration-500 shadow-2xl flex flex-col md:flex-row gap-6 relative overflow-hidden",
                  getCategoryColor(selectedInModal.cat).split(' hover:')[0]
                )}>
                  <div className="absolute inset-0 bg-black/40 -z-10" />
                  
                  <div className="h-20 w-20 md:h-24 md:w-24 bg-black/40 rounded-[20px] border border-white/10 flex flex-col items-center justify-center shrink-0 shadow-inner group">
                    <span className="text-xs font-bold opacity-60 group-hover:scale-110 transition-transform">{selectedInModal.n}</span>
                    <span className="text-3xl md:text-4xl font-black leading-none tracking-tighter shadow-white">{selectedInModal.s}</span>
                    <span className="text-[10px] font-black opacity-40 mt-1 uppercase">{selectedInModal.mass?.toFixed?.(2) ?? selectedInModal.mass}</span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <h4 className="text-2xl font-black text-white uppercase tracking-tighter">{selectedInModal.name}</h4>
                      <CheckCircle2 className="h-5 w-5 text-emerald-400 opacity-60" />
                    </div>
                    <p className="text-sm font-bold text-indigo-400/80 uppercase tracking-widest mt-1">{selectedInModal.cat}</p>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                      <div className="bg-white/5 rounded-xl p-2 border border-white/5">
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Masa</p>
                        <p className="text-sm font-black text-white">{selectedInModal.mass} u</p>
                      </div>
                      <div className="bg-white/5 rounded-xl p-2 border border-white/5">
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Atómico</p>
                        <p className="text-sm font-black text-white">{selectedInModal.n}</p>
                      </div>
                      <div className="bg-white/5 rounded-xl p-2 border border-white/5">
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Periodo</p>
                        <p className="text-sm font-black text-white">{getPeriod(selectedInModal.r)}</p>
                      </div>
                      <div className="bg-white/5 rounded-xl p-2 border border-white/5">
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Grupo</p>
                        <p className="text-sm font-black text-white">{selectedInModal.c <= 18 && selectedInModal.r <= 7 ? selectedInModal.c : '—'}</p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedInModal(null)}
                    className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-xl transition-colors"
                  >
                    <X className="h-5 w-5 text-slate-500" />
                  </button>
                </div>
              ) : (
                <div className="py-2 px-8 rounded-full bg-white/5 border border-white/5 backdrop-blur-md">
                  <p className="text-[10px] md:text-xs text-slate-400 font-bold uppercase tracking-[0.3em] flex items-center gap-3">
                    <span className="animate-pulse h-1.5 w-1.5 rounded-full bg-indigo-500" />
                    Selecciona un elemento para analizar sus propiedades cuánticas
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChemistryArtifact;
