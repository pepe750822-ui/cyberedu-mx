import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface Subtema {
  titulo: string;
  contenido: string[];
}

interface Area {
  nombre: string;
  icono: string;
  color: string;
  subtemas: Subtema[];
}

const areas: Area[] = [
  {
    nombre: "Español", icono: "📝", color: "yellow",
    subtemas: [
      { titulo: "Fichas bibliográficas", contenido: ["Propósitos y características", "Autor, título, editorial, año, lugar"] },
      { titulo: "Componentes gráficos del texto", contenido: ["Títulos, subtítulos, índices, ilustraciones", "Tema, subtema, orden cronológico", "Ejemplificaciones, repeticiones, paráfrasis"] },
      { titulo: "Gramática y nexos", contenido: ["Concordancia sujeto-predicado", "Nexos: además, por ejemplo, finalmente", "Nexos temporales: luego, después, primero", "Nexos adversativos: pero, aunque, sin embargo", "Signos: coma, punto, dos puntos, comillas"] },
      { titulo: "Tipos de textos", contenido: ["Textos informativos, legales, administrativos", "Textos periodísticos: noticia, reportaje, opinión", "Textos publicitarios: función e impacto", "Hechos vs opiniones: creo que, en mi opinión"] },
    ],
  },
  {
    nombre: "Habilidad Verbal", icono: "🔤", color: "purple",
    subtemas: [
      { titulo: "Comprensión lectora", contenido: ["Información explícita e inferida", "Ideas principal y secundarias", "Relaciones: causa-consecuencia, oposición, analogía", "Hechos vs opiniones", "Secuencia de acontecimientos"] },
      { titulo: "Vocabulario", contenido: ["Analogías entre palabras", "Sinónimos y antónimos", "Significado por contexto"] },
    ],
  },
  {
    nombre: "Matemáticas", icono: "🔢", color: "blue",
    subtemas: [
      { titulo: "Números", contenido: ["Operaciones con enteros", "Fracciones y decimales", "Porcentajes: %=parte/total×100", "Potencias y raíces", "Proporcionalidad"] },
      { titulo: "Álgebra", contenido: ["Ecuaciones 1er grado: ax+b=c", "Sistemas de ecuaciones", "Productos notables", "Ecuaciones 2do grado: ax²+bx+c=0", "Fórmula general: x=(-b±√(b²-4ac))/2a"] },
      { titulo: "Estadística", contenido: ["Media: suma/n", "Mediana: valor central", "Moda: valor más frecuente", "Gráficas de barras y circulares", "Probabilidad: casos favorables/total"] },
      { titulo: "Geometría", contenido: ["Ángulos y rectas", "Pitágoras: a²+b²=c²", "Semejanza de triángulos", "Perímetros, áreas y volúmenes", "Razones trigonométricas: sen, cos, tan"] },
    ],
  },
  {
    nombre: "Habilidad Matemática", icono: "🧩", color: "indigo",
    subtemas: [
      { titulo: "Sucesiones numéricas", contenido: ["Calcula diferencias entre términos", "Aritmética: diferencia constante", "Geométrica: razón constante", "Cuadrática: diferencias de segundo orden"] },
      { titulo: "Series espaciales", contenido: ["Identifica rotaciones y traslaciones", "Cambios de forma, tamaño o posición", "Figuras que siguen un patrón"] },
      { titulo: "Imaginación espacial", contenido: ["Rotaciones 90°, 180°, 270°", "Desarrollo plano de figuras 3D", "Cubos y sus vistas"] },
      { titulo: "Razonamiento lógico", contenido: ["Regla de tres simple y compuesta", "Problemas de edades", "Problemas de trabajo y tiempo"] },
    ],
  },
  {
    nombre: "Biología", icono: "🧬", color: "emerald",
    subtemas: [
      { titulo: "Biodiversidad", contenido: ["Características seres vivos: NMRICRE", "Selección natural de Darwin", "Adaptación y evolución", "Biodiversidad en México y desarrollo sustentable"] },
      { titulo: "Transformación de energía", contenido: ["Fotosíntesis: 6CO₂+6H₂O→C₆H₁₂O₆+6O₂", "Respiración celular: aerobia y anaerobia", "Autótrofos vs heterótrofos", "Ciclo del carbono"] },
      { titulo: "Salud y nutrición", contenido: ["Dieta equilibrada, completa e higiénica", "Enfermedades por mala nutrición", "Contaminación y calentamiento global"] },
      { titulo: "Reproducción y genética", contenido: ["Mitosis (crecimiento) vs meiosis (reproducción)", "Reproducción sexual y asexual", "Genotipo, fenotipo, genes, cromosomas", "Cuadro de Punnett", "Manipulación genética"] },
    ],
  },
  {
    nombre: "Física", icono: "⚡", color: "cyan",
    subtemas: [
      { titulo: "Movimiento", contenido: ["Velocidad=distancia/tiempo", "Rapidez (escalar) vs velocidad (vector)", "Aceleración=Δv/t", "MRU y MRUV", "Caída libre: g=9.8 m/s²"] },
      { titulo: "Fuerzas y Newton", contenido: ["1ª Ley: inercia", "2ª Ley: F=ma", "3ª Ley: acción-reacción", "Gravitación: F=Gm₁m₂/r²", "Peso=masa×g"] },
      { titulo: "Energía", contenido: ["Ec=½mv²", "Ep=mgh", "Conservación: Ec+Ep=cte", "Trabajo=F×d×cos θ"] },
      { titulo: "Electricidad y ondas", contenido: ["Cargas: + atrae -, iguales se repelen", "Electrización: frotamiento, contacto, inducción", "Imanes y campo magnético", "Ondas: longitud, frecuencia, amplitud"] },
    ],
  },
  {
    nombre: "Química", icono: "🧪", color: "orange",
    subtemas: [
      { titulo: "Materia y propiedades", contenido: ["Propiedades físicas: color, densidad, punto de fusión", "Cambios físicos vs químicos", "Métodos de separación: filtración, destilación"] },
      { titulo: "Estructura atómica", contenido: ["Protones(+), neutrones(neutro), electrones(-)", "Número atómico=protones", "Número de masa=protones+neutrones", "Tabla periódica: orden por número atómico", "Enlace iónico, covalente, metálico"] },
      { titulo: "Reacciones químicas", contenido: ["Ley de conservación de la masa", "Ecuaciones químicas balanceadas", "Ácidos (H⁺) y bases (OH⁻)", "pH<7 ácido, pH=7 neutro, pH>7 básico", "Reacciones redox: oxidación y reducción"] },
    ],
  },
  {
    nombre: "Historia", icono: "📜", color: "red",
    subtemas: [
      { titulo: "Siglos XVI-XVII", contenido: ["Nuevas rutas: turcos bloquean Constantinopla 1453", "Humanismo y Renacimiento", "Conquista de América"] },
      { titulo: "Siglos XVIII-XIX", contenido: ["Ilustración y Enciclopedia", "Independencia EE.UU. 1776", "Revolución Francesa 1789: libertad, igualdad, fraternidad", "Revolución Industrial"] },
      { titulo: "1850-1920", contenido: ["Nacionalismo e imperialismo", "1ª Guerra Mundial 1914-1918", "Paz de Versalles y consecuencias"] },
      { titulo: "1920-1960", contenido: ["Fascismo italiano: desintegración del parlamento", "Nazismo: raza aria, antisemitismo", "2ª Guerra Mundial 1939-1945", "Guerra Fría: capitalismo vs socialismo"] },
      { titulo: "Historia de México", contenido: ["Mesoamérica y Virreinato", "Independencia 1821", "Reforma liberal y Constitución 1857", "Porfiriato y Revolución 1910", "Constitución 1917: Art.3, 27, 123"] },
    ],
  },
  {
    nombre: "Geografía", icono: "🌍", color: "teal",
    subtemas: [
      { titulo: "Espacio geográfico", contenido: ["Componentes: naturales, sociales, económicos", "Coordenadas: latitud (paralelos), longitud (meridianos)", "Husos horarios", "Tipos de mapas: temáticos, políticos, físicos"] },
      { titulo: "Recursos y ambiente", contenido: ["Placas tectónicas: sismos y volcanes", "Ciclo hidrológico e infiltración", "Climas del mundo", "Biodiversidad y desarrollo sustentable", "Calentamiento global"] },
      { titulo: "Población", contenido: ["Crecimiento y distribución", "Migración: tipos y efectos", "Riesgos: sismos, huracanes, inundaciones"] },
      { titulo: "Economía y comercio", contenido: ["Sectores: primario, secundario, terciario", "Recursos de México: petróleo, plata, turismo", "Globalización y organismos: FMI, ONU, BM", "Transporte: marítimo, terrestre, aéreo"] },
      { titulo: "Cultura y política", contenido: ["Patrimonio cultural de México", "Zonas arqueológicas UNESCO", "Soberanía: mar territorial 12 millas", "Fronteras y espacios internacionales"] },
    ],
  },
  {
    nombre: "Formación Cívica y Ética", icono: "⚖️", color: "pink",
    subtemas: [
      { titulo: "Ética personal", contenido: ["Autonomía moral y libertad", "Empatía y diálogo", "Tipos de normas: morales, jurídicas, sociales", "Valores: económicos, estéticos, morales"] },
      { titulo: "Identidad y adolescencia", contenido: ["Identidad: grupos, tradiciones, historia", "Derechos y responsabilidades", "Tipos de violencia: física, psicológica, económica", "Respuesta asertiva ante riesgos"] },
      { titulo: "Democracia y ciudadanía", contenido: ["Derechos humanos: dignidad, libertad, justicia", "Principio de mayoría en democracia", "Estado mexicano: población, territorio, gobierno", "División de poderes: ejecutivo, legislativo, judicial"] },
      { titulo: "Constitución y participación", contenido: ["Art. 3: educación laica, gratuita", "Art. 27: propiedad de la nación", "Art. 123: derechos laborales", "Partidos políticos y representación", "Medios de comunicación: función social", "Negociación y resolución de conflictos"] },
    ],
  },
];

const colorMap: Record<string, { header: string; dot: string; tag: string; aiBtn: string }> = {
  blue:    { header: "bg-blue-600",    dot: "bg-blue-400",    tag: "bg-blue-900/40 text-blue-300",    aiBtn: "bg-blue-700 hover:bg-blue-600" },
  purple:  { header: "bg-purple-600",  dot: "bg-purple-400",  tag: "bg-purple-900/40 text-purple-300",  aiBtn: "bg-purple-700 hover:bg-purple-600" },
  green:   { header: "bg-green-600",   dot: "bg-green-400",   tag: "bg-green-900/40 text-green-300",   aiBtn: "bg-green-700 hover:bg-green-600" },
  yellow:  { header: "bg-yellow-500",  dot: "bg-yellow-400",  tag: "bg-yellow-900/40 text-yellow-200",  aiBtn: "bg-yellow-600 hover:bg-yellow-500" },
  emerald: { header: "bg-emerald-600", dot: "bg-emerald-400", tag: "bg-emerald-900/40 text-emerald-300", aiBtn: "bg-emerald-700 hover:bg-emerald-600" },
  orange:  { header: "bg-orange-500",  dot: "bg-orange-400",  tag: "bg-orange-900/40 text-orange-300",  aiBtn: "bg-orange-600 hover:bg-orange-500" },
  cyan:    { header: "bg-cyan-600",    dot: "bg-cyan-400",    tag: "bg-cyan-900/40 text-cyan-300",    aiBtn: "bg-cyan-700 hover:bg-cyan-600" },
  red:     { header: "bg-red-600",     dot: "bg-red-400",     tag: "bg-red-900/40 text-red-300",     aiBtn: "bg-red-700 hover:bg-red-600" },
  teal:    { header: "bg-teal-600",    dot: "bg-teal-400",    tag: "bg-teal-900/40 text-teal-300",    aiBtn: "bg-teal-700 hover:bg-teal-600" },
  pink:    { header: "bg-pink-600",    dot: "bg-pink-400",    tag: "bg-pink-900/40 text-pink-300",    aiBtn: "bg-pink-700 hover:bg-pink-600" },
  indigo:  { header: "bg-indigo-600",  dot: "bg-indigo-400",  tag: "bg-indigo-900/40 text-indigo-300",  aiBtn: "bg-indigo-700 hover:bg-indigo-600" },
};

export default function Acordeon() {
  const { session, user } = useAuth();
  const navigate = useNavigate();
  const [openAreas, setOpenAreas] = useState<number[]>([]);
  const [openSubtemas, setOpenSubtemas] = useState<Record<string, boolean>>({});
  const [aiLoading, setAiLoading] = useState<number | null>(null);
  const [aiContent, setAiContent] = useState<Record<number, string>>({});

  const cleanTipsText = (text: string) =>
    text
      .replace(/<recommendation>[\s\S]*?<\/recommendation>/g, "")
      .replace(/```mermaid[\s\S]*?```/g, "")
      .replace(/```[\s\S]*?```/g, "")
      .replace(/\[.*?\]\(citation:\/\/.*?\)/g, "")
      .replace(/<quiz>[\s\S]*?<\/quiz>/g, "")
      .replace(/<[a-z_]+>[\s\S]*?<\/[a-z_]+>/g, "")
      .trim();

  const toggleArea = (i: number) =>
    setOpenAreas((prev) => prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]);

  const toggleSubtema = (key: string) =>
    setOpenSubtemas((prev) => ({ ...prev, [key]: !prev[key] }));

  const expandAll = () => {
    setOpenAreas(areas.map((_, i) => i));
    const all: Record<string, boolean> = {};
    areas.forEach((a, i) => a.subtemas.forEach((_, j) => { all[`${i}-${j}`] = true; }));
    setOpenSubtemas(all);
  };

  const collapseAll = () => {
    setOpenAreas([]);
    setOpenSubtemas({});
  };

  const generarAcordeonIA = async (idx: number, nombre: string) => {
    if (!session?.access_token) {
      setAiContent((prev) => ({ ...prev, [idx]: "⚠️ Inicia sesión para usar el tutor IA." }));
      return;
    }
    setAiLoading(idx);
    setAiContent((prev) => ({ ...prev, [idx]: "" }));
    try {
      const res = await fetch("/api/ai-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          messages: [{
            role: "user",
            content: `Dame 3 tips de memorización rápida para el examen ECOEMS sobre ${nombre}. Sé muy breve, máximo 4 puntos cortos con emojis. Sin quiz.`,
          }],
          context: { type: "acordeon", materia: nombre },
        }),
      });

      if (!res.ok || !res.body) {
        setAiContent((prev) => ({ ...prev, [idx]: "Error al conectar con el tutor IA." }));
        setAiLoading(null);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        let newline: number;
        while ((newline = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, newline);
          buffer = buffer.slice(newline + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const json = line.slice(6).trim();
          if (json === "[DONE]") break;
          try {
            const parsed = JSON.parse(json);
            const chunk: string =
              parsed.content ??
              parsed.choices?.[0]?.delta?.content ??
              (parsed.type === "content_block_delta" ? parsed.delta?.text : undefined) ??
              "";
            if (chunk) {
              accumulated += chunk;
              setAiContent((prev) => ({ ...prev, [idx]: cleanTipsText(accumulated) }));
            }
          } catch { /* ignore malformed SSE line */ }
        }
      }

      if (!accumulated) setAiContent((prev) => ({ ...prev, [idx]: "Sin respuesta del tutor." }));
    } catch {
      setAiContent((prev) => ({ ...prev, [idx]: "No se pudo conectar con el tutor IA." }));
    }
    setAiLoading(null);
  };

  const handlePrint = () => {
    expandAll();
    setTimeout(() => window.print(), 400);
  };

  const handleProtectedAction = (action: () => void) => {
    if (!user) { navigate("/auth"); return; }
    action();
  };

  return (
    <>
    {/* ── Print-only layout: dense newspaper-style grid ───────────── */}
    <div className="acordeon-print-layout hidden">
      <h1 className="acordeon-titulo">📋 Acordeón ECOEMS 2026 — cyberedumx.com</h1>
      <div className="acordeon-print-grid">
        {areas.map((area) => (
          <div key={area.nombre} className="acordeon-print-card">
            <div className="acordeon-print-header">{area.icono} {area.nombre}</div>
            <div className="acordeon-print-body">
              {area.subtemas.map((sub) => (
                <div key={sub.titulo}>
                  <strong>{sub.titulo}:</strong>
                  <ul>
                    {sub.contenido.map((item, k) => (
                      <li key={k}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* ── Screen layout ────────────────────────────────────────────── */}
    <div className="acordeon-screen-only min-h-screen bg-gray-950 text-white">
      {/* Topbar */}
      <div className="no-print sticky top-0 z-10 bg-gray-900 border-b border-gray-800 px-4 py-3 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <Link to="/" className="text-gray-400 hover:text-white text-sm">← Inicio</Link>
          <span className="text-gray-600">|</span>
          <h1 className="text-lg font-bold">📋 Acordeón ECOEMS 2026</h1>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => handleProtectedAction(expandAll)}
            className={`text-xs px-3 py-1.5 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors${!user ? " opacity-50" : ""}`}
            title={!user ? "🔒 Regístrate gratis para usar esta función" : undefined}
          >
            📂 Expandir todo{!user && " 🔒"}
          </button>
          <button
            onClick={() => handleProtectedAction(collapseAll)}
            className={`text-xs px-3 py-1.5 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors${!user ? " opacity-50" : ""}`}
            title={!user ? "🔒 Regístrate gratis para usar esta función" : undefined}
          >
            📁 Colapsar todo{!user && " 🔒"}
          </button>
          <button
            onClick={() => handleProtectedAction(handlePrint)}
            className={`text-xs px-4 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 transition-colors font-bold flex items-center gap-1${!user ? " opacity-50" : ""}`}
            title={!user ? "🔒 Regístrate gratis para imprimir" : undefined}
          >
            🖨️ Imprimir PDF{!user && " 🔒"}
          </button>
        </div>
      </div>

      {/* Print title */}
      <div className="print-only hidden text-center py-4">
        <h1 className="acordeon-titulo text-2xl font-bold">Acordeón ECOEMS 2026</h1>
        <p className="text-sm text-gray-500">cyberedumx.com</p>
      </div>

      {/* Areas */}
      <div className="acordeon-grid max-w-3xl mx-auto px-4 py-6 space-y-3">
        {areas.map((area, i) => {
          const isOpen = openAreas.includes(i);
          const colors = colorMap[area.color];
          return (
            <div key={i} className="acordeon-section acordeon-materia rounded-xl overflow-hidden border border-gray-800 print:border-gray-300">
              {/* Area header */}
              <button
                onClick={() => toggleArea(i)}
                className={`w-full flex items-center justify-between px-4 py-3 text-left font-bold text-white ${colors.header} print:bg-gray-200 print:text-black hover:opacity-90 transition-opacity`}
              >
                <span className="acordeon-materia-titulo flex items-center gap-2">
                  <span>{area.icono}</span>
                  <span>{area.nombre}</span>
                  <span className="text-xs font-normal opacity-75">{area.subtemas.length} temas</span>
                </span>
                <span className="text-base no-print">{isOpen ? "▲" : "▼"}</span>
              </button>

              {isOpen && (
                <div className="acordeon-contenido bg-gray-900 print:bg-white">
                  {/* Subtemas */}
                  <div className="divide-y divide-gray-800 print:divide-gray-200">
                    {area.subtemas.map((sub, j) => {
                      const key = `${i}-${j}`;
                      const subOpen = openSubtemas[key] ?? false;
                      return (
                        <div key={j}>
                          <button
                            onClick={() => user ? toggleSubtema(key) : navigate("/auth")}
                            className="w-full flex items-center justify-between px-4 py-2.5 text-left hover:bg-gray-800 print:hover:bg-transparent transition-colors"
                          >
                            <span className="acordeon-subtema-titulo flex items-center gap-2 text-sm font-semibold text-gray-100 print:text-black">
                              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${colors.dot}`} />
                              {sub.titulo}
                            </span>
                            <span className="text-xs text-gray-500 no-print">{subOpen ? "▲" : "▼"}</span>
                          </button>

                          {subOpen && (
                            <ul className="px-6 pb-3 space-y-1.5 print:px-4">
                              {sub.contenido.map((linea, k) => (
                                <li key={k} className={`text-xs rounded px-2 py-1 ${colors.tag} print:bg-transparent print:text-black print:px-0`}>
                                  {linea}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* AI expand button */}
                  <div className="no-print px-4 py-3 border-t border-gray-800">
                    {aiContent[i] ? (
                      <div className="text-xs text-gray-300 bg-gray-800 rounded-lg p-3 whitespace-pre-wrap">
                        {aiContent[i]}
                        <button
                          onClick={() => setAiContent((prev) => { const n = { ...prev }; delete n[i]; return n; })}
                          className="block mt-2 text-gray-500 hover:text-gray-300 text-xs"
                        >
                          ✕ Cerrar
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => generarAcordeonIA(i, area.nombre)}
                        disabled={aiLoading === i}
                        title={!session?.access_token ? "Inicia sesión para usar el tutor IA" : undefined}
                        className={`text-xs px-3 py-1.5 rounded-lg text-white font-medium transition-colors flex items-center gap-1.5 ${colors.aiBtn} disabled:opacity-60`}
                      >
                        {aiLoading === i ? (
                          <><span className="animate-spin">⏳</span> Generando...</>
                        ) : session?.access_token ? (
                          <>🧠 Tips IA para {area.nombre}</>
                        ) : (
                          <>🔒 Tips IA (requiere sesión)</>
                        )}
                      </button>
                    )}
                  </div>
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
    </>
  );
}
