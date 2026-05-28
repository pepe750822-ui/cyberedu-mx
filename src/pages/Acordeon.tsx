import { useState } from "react";
import { Link } from "react-router-dom";

const materias = [
  { nombre: "Habilidad Matemática", color: "blue", temas: [
    "Sucesiones numéricas y figuras", "Razones y proporciones", "Porcentajes",
    "Sistemas de ecuaciones", "Geometría: áreas y volúmenes", "Estadística: media, mediana, moda",
  ]},
  { nombre: "Habilidad Verbal", color: "purple", temas: [
    "Sinónimos y antónimos", "Analogías", "Comprensión lectora",
    "Nexos y conectores", "Ideas principal y secundaria",
  ]},
  { nombre: "Matemáticas", color: "green", temas: [
    "Operaciones con enteros", "Fracciones y decimales", "Potencias y raíces",
    "Álgebra: ecuaciones", "Geometría analítica", "Probabilidad",
  ]},
  { nombre: "Español", color: "yellow", temas: [
    "Funciones del lenguaje", "Recursos literarios", "Tipos de textos",
    "Ortografía y puntuación", "Fichas bibliográficas", "Nexos textuales",
  ]},
  { nombre: "Biología", color: "emerald", temas: [
    "Características de los seres vivos", "Célula y sus funciones", "Genética y herencia",
    "Ecosistemas y biodiversidad", "Evolución y selección natural", "Reproducción",
  ]},
  { nombre: "Química", color: "orange", temas: [
    "Tabla periódica", "Estados de la materia", "Enlace químico",
    "Reacciones químicas", "Ácidos y bases", "Número atómico y de masa",
  ]},
  { nombre: "Física", color: "cyan", temas: [
    "Movimiento y velocidad", "Leyes de Newton", "Energía cinética y potencial",
    "Electricidad y magnetismo", "Ondas y sonido", "Termodinámica",
  ]},
  { nombre: "Historia", color: "red", temas: [
    "Culturas prehispánicas", "Conquista y Colonia", "Independencia de México",
    "Reforma y Porfiriato", "Revolución Mexicana", "Guerras mundiales y período de entreguerras",
  ]},
  { nombre: "Geografía", color: "teal", temas: [
    "Coordenadas geográficas", "Relieve y clima de México", "Sectores económicos",
    "Recursos naturales", "Población y migración", "Organizaciones internacionales",
  ]},
  { nombre: "Formación Cívica y Ética", color: "pink", temas: [
    "Derechos humanos", "Democracia y ciudadanía", "Valores y ética",
    "Constitución mexicana", "Soberanía nacional", "Resolución de conflictos",
  ]},
];

const colorMap: Record<string, { header: string; badge: string; bullet: string }> = {
  blue:    { header: "bg-blue-600",    badge: "bg-blue-100 text-blue-800",    bullet: "bg-blue-500" },
  purple:  { header: "bg-purple-600",  badge: "bg-purple-100 text-purple-800",  bullet: "bg-purple-500" },
  green:   { header: "bg-green-600",   badge: "bg-green-100 text-green-800",   bullet: "bg-green-500" },
  yellow:  { header: "bg-yellow-500",  badge: "bg-yellow-100 text-yellow-800",  bullet: "bg-yellow-500" },
  emerald: { header: "bg-emerald-600", badge: "bg-emerald-100 text-emerald-800", bullet: "bg-emerald-500" },
  orange:  { header: "bg-orange-500",  badge: "bg-orange-100 text-orange-800",  bullet: "bg-orange-500" },
  cyan:    { header: "bg-cyan-600",    badge: "bg-cyan-100 text-cyan-800",    bullet: "bg-cyan-500" },
  red:     { header: "bg-red-600",     badge: "bg-red-100 text-red-800",     bullet: "bg-red-500" },
  teal:    { header: "bg-teal-600",    badge: "bg-teal-100 text-teal-800",    bullet: "bg-teal-500" },
  pink:    { header: "bg-pink-600",    badge: "bg-pink-100 text-pink-800",    bullet: "bg-pink-500" },
};

export default function Acordeon() {
  const [open, setOpen] = useState<number[]>(materias.map((_, i) => i));

  const toggle = (i: number) =>
    setOpen((prev) => prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]);

  const expandAll = () => setOpen(materias.map((_, i) => i));
  const collapseAll = () => setOpen([]);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header — no-print */}
      <div className="no-print sticky top-0 z-10 bg-gray-900 border-b border-gray-800 px-4 py-3 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <Link to="/" className="text-gray-400 hover:text-white text-sm">← Inicio</Link>
          <span className="text-gray-600">|</span>
          <h1 className="text-lg font-bold">📋 Acordeón ECOEMS 2026</h1>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={expandAll}
            className="text-xs px-3 py-1.5 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
          >
            Expandir todo
          </button>
          <button
            onClick={collapseAll}
            className="text-xs px-3 py-1.5 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
          >
            Colapsar todo
          </button>
          <button
            onClick={() => window.print()}
            className="text-xs px-4 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 transition-colors font-bold flex items-center gap-1"
          >
            🖨️ Imprimir PDF
          </button>
        </div>
      </div>

      {/* Print title — only visible when printing */}
      <div className="print-only hidden text-center py-4">
        <h1 className="text-2xl font-bold">Acordeón ECOEMS 2026</h1>
        <p className="text-sm text-gray-500">cyberedumx.com</p>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 py-6 space-y-3">
        {materias.map((materia, i) => {
          const isOpen = open.includes(i);
          const colors = colorMap[materia.color];
          return (
            <div key={i} className="acordeon-section rounded-xl overflow-hidden border border-gray-800 print:border-gray-300">
              <button
                onClick={() => toggle(i)}
                className={`w-full flex items-center justify-between px-4 py-3 text-left font-bold text-white ${colors.header} print:bg-gray-200 print:text-black transition-opacity hover:opacity-90`}
              >
                <span>{materia.nombre}</span>
                <span className="text-lg no-print">{isOpen ? "▲" : "▼"}</span>
              </button>

              {isOpen && (
                <div className="bg-gray-900 print:bg-white px-4 py-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {materia.temas.map((tema, j) => (
                    <div key={j} className="flex items-start gap-2 text-sm text-gray-200 print:text-black">
                      <span className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${colors.bullet} print:bg-gray-500`} />
                      {tema}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="no-print text-center py-8 text-gray-600 text-xs">
        cyberedumx.com — ECOEMS 2026
      </div>
    </div>
  );
}
