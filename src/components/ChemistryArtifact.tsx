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
        <div className={cn("p-4 border-b border-white/10 flex items-center justify-between", colorStyle.split(' hover:')[0])}>
          <div className="flex items-center gap-3">
            <div
              className="h-14 w-14 rounded-2xl bg-black/30 border border-white/10 flex items-center justify-center relative shadow-inner hover:scale-105 transition-transform cursor-pointer"
              onClick={() => setShowTable(true)}
              title="Ver en Tabla Periódica completa"
            >
              <span className="text-2xl font-black">{element.symbol}</span>
              <span className="absolute top-1 right-1.5 text-[10px] font-bold opacity-60">{element.atomic_number}</span>
              <span className="absolute bottom-1 left-0 right-0 text-center text-[8px] font-bold opacity-50">{element.atomic_mass}</span>
            </div>
            <div>
              <h3 className="text-lg font-black uppercase tracking-tight leading-none text-white">{element.name}</h3>
              <p className="text-[10px] font-bold uppercase tracking-widest mt-1 opacity-70">{element.category}</p>
            </div>
          </div>
          <button
            onClick={() => setShowTable(!showTable)}
            className="p-2.5 rounded-xl bg-black/20 hover:bg-black/40 border border-white/10 hover:border-white/30 transition-all ml-2"
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
        <div className="fixed inset-0 z-[9999] bg-slate-950/95 backdrop-blur-xl flex items-center justify-center p-2 md:p-4">
          <div className="relative w-full max-w-[98vw] bg-slate-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[96vh]">

            {/* Modal Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-slate-800/50 shrink-0">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 bg-indigo-500/20 border border-indigo-500/30 rounded-xl flex items-center justify-center">
                  <Grid className="h-4 w-4 text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white uppercase tracking-tight">Tabla Periódica</h3>
                  <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">118 Elementos — IUPAC 2021</p>
                </div>
              </div>
              <button
                onClick={() => { setShowTable(false); setSelectedInModal(null); }}
                className="p-2 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-xl transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Leyenda */}
            <div className="px-4 pt-2 pb-1 flex flex-wrap gap-1.5 shrink-0">
              {LEGEND_CATS.map(cat => (
                <span key={cat} className={cn("px-2 py-0.5 rounded-full text-[8px] md:text-[9px] font-black uppercase border", getCategoryColor(cat).split(' hover:')[0])}>
                  {cat}
                </span>
              ))}
            </div>

            {/* Tabla */}
            <div className="p-2 md:p-4 overflow-auto flex-1 custom-scrollbar">
              <div
                className="grid gap-[2px] md:gap-1 mx-auto"
                style={{ gridTemplateColumns: 'repeat(18, minmax(0, 1fr))', minWidth: '600px' }}
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
                        "relative flex flex-col justify-between items-center rounded-md border transition-all cursor-pointer p-[2px] md:p-1 overflow-hidden group",
                        "w-full aspect-square",
                        getCategoryColor(el.cat),
                        isHighlighted && "ring-2 ring-white scale-110 shadow-[0_0_12px_rgba(255,255,255,0.4)] z-10"
                      )}
                      title={`${el.name} (${el.s}) — Z=${el.n}, ${el.mass} u`}
                    >
                      <span className="text-[5px] md:text-[8px] font-black opacity-60 self-start leading-none">{el.n}</span>
                      <span className="text-[8px] md:text-xs font-black leading-none">{el.s}</span>
                      <span className="hidden md:block text-[6px] opacity-50 leading-none truncate w-full text-center">{el.name.length > 7 ? el.name.slice(0,6)+'.' : el.name}</span>
                      <span className="hidden md:block text-[5px] opacity-40 leading-none">{el.mass.toFixed(1)}</span>
                      {isHighlighted && <div className="absolute inset-0 border-2 border-white rounded-md opacity-60" />}
                    </button>
                  );
                })}

                {/* Placeholders La-Lu y Ac-Lr */}
                {PT_PLACEHOLDERS.map(ph => (
                  <div
                    key={ph.s}
                    style={{ gridRow: ph.r, gridColumn: ph.c }}
                    className={cn(
                      "flex items-center justify-center rounded-md border text-[5px] md:text-[7px] font-black opacity-60 aspect-square",
                      getCategoryColor(ph.cat).split(' hover:')[0]
                    )}
                    title={ph.name}
                  >
                    {ph.s}
                  </div>
                ))}

                {/* Separador visual para lantánidos/actínidos */}
                <div style={{ gridRow: 7, gridColumn: '1 / span 3' }} className="flex items-end justify-end pr-1">
                  <span className="text-[6px] text-slate-600 font-bold hidden md:block">57-71 ↓</span>
                </div>

                {/* Lantánidos (fila 8) */}
                {PT_FULL.filter(el => el.r === 8).map(el => {
                  const isHighlighted = el.s === element.symbol;
                  const col = el.c + 1; // offset +1 para separación visual
                  return (
                    <button
                      key={el.n}
                      onClick={() => setSelectedInModal(el)}
                      style={{ gridRow: 8, gridColumn: col }}
                      className={cn(
                        "relative flex flex-col justify-between items-center rounded-md border transition-all cursor-pointer p-[2px] md:p-1 overflow-hidden",
                        "w-full aspect-square",
                        getCategoryColor(el.cat),
                        isHighlighted && "ring-2 ring-white scale-110 shadow-[0_0_12px_rgba(255,255,255,0.4)] z-10"
                      )}
                      title={`${el.name} (${el.s}) — Z=${el.n}`}
                    >
                      <span className="text-[5px] md:text-[8px] font-black opacity-60 self-start leading-none">{el.n}</span>
                      <span className="text-[8px] md:text-xs font-black leading-none">{el.s}</span>
                      <span className="hidden md:block text-[6px] opacity-50 leading-none truncate w-full text-center">{el.name.length > 7 ? el.name.slice(0,6)+'.' : el.name}</span>
                      {isHighlighted && <div className="absolute inset-0 border-2 border-white rounded-md opacity-60" />}
                    </button>
                  );
                })}

                {/* Actínidos (fila 9) */}
                {PT_FULL.filter(el => el.r === 9).map(el => {
                  const isHighlighted = el.s === element.symbol;
                  const col = el.c + 1;
                  return (
                    <button
                      key={el.n}
                      onClick={() => setSelectedInModal(el)}
                      style={{ gridRow: 9, gridColumn: col }}
                      className={cn(
                        "relative flex flex-col justify-between items-center rounded-md border transition-all cursor-pointer p-[2px] md:p-1 overflow-hidden",
                        "w-full aspect-square",
                        getCategoryColor(el.cat),
                        isHighlighted && "ring-2 ring-white scale-110 shadow-[0_0_12px_rgba(255,255,255,0.4)] z-10"
                      )}
                      title={`${el.name} (${el.s}) — Z=${el.n}`}
                    >
                      <span className="text-[5px] md:text-[8px] font-black opacity-60 self-start leading-none">{el.n}</span>
                      <span className="text-[8px] md:text-xs font-black leading-none">{el.s}</span>
                      <span className="hidden md:block text-[6px] opacity-50 leading-none truncate w-full text-center">{el.name.length > 7 ? el.name.slice(0,6)+'.' : el.name}</span>
                      {isHighlighted && <div className="absolute inset-0 border-2 border-white rounded-md opacity-60" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Panel inferior: detalle del elemento seleccionado */}
            {selectedInModal ? (
              <div className={cn(
                "px-4 py-3 border-t border-white/5 animate-in slide-in-from-bottom-2 duration-200 shrink-0",
                getCategoryColor(selectedInModal.cat).split(' hover:')[0]
              )}>
                <div className="flex gap-4 items-center">
                  <div className="h-14 w-14 bg-black/20 rounded-xl flex flex-col items-center justify-center shrink-0 border border-white/10">
                    <span className="text-[9px] font-bold opacity-60">{selectedInModal.n}</span>
                    <span className="text-xl font-black leading-none">{selectedInModal.s}</span>
                    <span className="text-[8px] font-bold opacity-50">{selectedInModal.mass?.toFixed?.(2) ?? selectedInModal.mass}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-black text-white leading-none">{selectedInModal.name}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{selectedInModal.cat}</p>
                    <div className="flex gap-3 mt-1.5 flex-wrap">
                      <span className="text-[10px] text-slate-400"><span className="font-black text-white">Z=</span>{selectedInModal.n}</span>
                      <span className="text-[10px] text-slate-400"><span className="font-black text-white">Masa=</span>{selectedInModal.mass} u</span>
                      <span className="text-[10px] text-slate-400"><span className="font-black text-white">Periodo=</span>{getPeriod(selectedInModal.r)}</span>
                      <span className="text-[10px] text-slate-400"><span className="font-black text-white">Grupo=</span>{selectedInModal.c <= 18 && selectedInModal.r <= 7 ? selectedInModal.c : '—'}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedInModal(null)}
                    className="p-1.5 hover:bg-black/20 rounded-lg text-slate-400 transition-colors shrink-0"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="px-4 py-3 border-t border-white/5 text-center bg-slate-800/30 shrink-0">
                <p className="text-xs text-slate-400 font-medium">Toca cualquier elemento para ver sus datos completos.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ChemistryArtifact;
