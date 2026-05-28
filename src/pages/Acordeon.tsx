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
    nombre: "Matemáticas", icono: "🔢", color: "blue",
    subtemas: [
      { titulo: "Operaciones con enteros", contenido: [
        "Suma/resta: igual signo → suma y conserva signo", "Diferente signo → resta y toma el mayor",
        "Multiplicación: (+)(+)=+ | (-)(-)==+ | (+)(-)=-",
        "Cualquier número × 0 = 0", "Ejemplo: (-5)(2)(-3)(0) = 0",
      ]},
      { titulo: "Fracciones y porcentajes", contenido: [
        "Suma fracciones: mismo denominador → suma numeradores",
        "Distinto denominador → mínimo común múltiplo",
        "Porcentaje: %=parte/total×100",
        "Incremento 120%: total=original+original×1.20",
        "Ejemplo: 10,000 ratones +120% = 10,000+12,000 = 22,000",
      ]},
      { titulo: "Potencias y raíces", contenido: [
        "a^m × a^n = a^(m+n) — misma base suma exponentes",
        "a^m ÷ a^n = a^(m-n)",
        "(a^m)^n = a^(m×n)",
        "Ejemplo: 2^3 × 2^2 = 2^5 = 32",
        "Raíz cuadrada: √(a×b) = √a × √b",
      ]},
      { titulo: "Ecuaciones 1er grado", contenido: [
        "Forma: ax + b = c → x = (c-b)/a",
        "Despeja la incógnita pasando términos al otro lado",
        "Ejemplo: x - 3 = 6 → x = 9",
        "Sistema 2 ecuaciones: sustitución o eliminación",
        "Ejemplo: 4x+5y=48, 3x-y=-2 → x=2, y=8",
      ]},
      { titulo: "Ecuaciones 2do grado", contenido: [
        "Forma: ax²+bx+c=0",
        "Fórmula general: x=(-b±√(b²-4ac))/2a",
        "Discriminante: b²-4ac>0 dos soluciones, =0 una, <0 sin solución real",
        "Factorización: busca dos números que multipliquen ac y sumen b",
      ]},
      { titulo: "Estadística", contenido: [
        "Media: suma de datos / cantidad de datos",
        "Mediana: valor central (ordenar primero)",
        "Moda: valor que más se repite",
        "Ejemplo: 6,7,9,7,9,9,9 → Media=8, Moda=9",
        "Probabilidad: casos favorables / casos totales",
      ]},
      { titulo: "Geometría", contenido: [
        "Pitágoras: a²+b²=c² (solo triángulos rectángulos)",
        "Área triángulo: base×altura/2",
        "Área círculo: π×r²  | Perímetro: 2πr",
        "Volumen cubo: lado³ | Ejemplo: lado=10 → V=1000cm³",
        "Ángulos internos triángulo suman 180°",
        "Pendiente: m=(y2-y1)/(x2-x1)",
      ]},
    ],
  },
  {
    nombre: "Física", icono: "⚡", color: "cyan",
    subtemas: [
      { titulo: "Movimiento", contenido: [
        "Velocidad=distancia/tiempo (vector — tiene dirección)",
        "Rapidez=distancia/tiempo (escalar — solo magnitud)",
        "Aceleración=cambio de velocidad/tiempo",
        "MRU: velocidad constante, aceleración=0",
        "Caída libre: g=9.8 m/s² (aprox 10)",
      ]},
      { titulo: "Leyes de Newton", contenido: [
        "1ª Ley (Inercia): objeto en reposo sigue en reposo si no hay fuerza",
        "2ª Ley: F=m×a | Ejemplo: F=10N, m=2kg → a=5m/s²",
        "3ª Ley: toda acción tiene reacción igual y contraria",
        "Peso=masa×g | Ejemplo: 5kg×10=50N",
        "Equilibrio: resultante de fuerzas = 0",
      ]},
      { titulo: "Energía", contenido: [
        "Energía cinética: Ec=½mv²",
        "Energía potencial: Ep=m×g×h",
        "Ejemplo: 5kg a 20m → Ep=5×10×20=1000J",
        "Conservación: Ec+Ep=constante",
        "Trabajo: W=F×d×cos θ",
      ]},
      { titulo: "Electricidad y magnetismo", contenido: [
        "Cargas iguales se repelen, opuestas se atraen",
        "Electrización: frotamiento, conducción, inducción",
        "Campo magnético: se genera con corriente eléctrica",
        "Brújula: apunta al norte por campo magnético terrestre",
        "Inducción electromagnética: movimiento genera corriente",
      ]},
      { titulo: "Ondas y luz", contenido: [
        "Onda: transmite energía sin transportar materia",
        "Longitud de onda: rojo=mayor, violeta=menor",
        "Frecuencia inversa a longitud de onda",
        "Teoría cinética: moléculas en movimiento constante",
        "Calor: energía que se transfiere | Temperatura: medida del calor",
      ]},
    ],
  },
  {
    nombre: "Química", icono: "🧪", color: "orange",
    subtemas: [
      { titulo: "Propiedades de la materia", contenido: [
        "Propiedades físicas: color, densidad, punto de fusión/ebullición",
        "Propiedades químicas: combustión, oxidación, corrosión",
        "Cambio físico: no cambia composición (hielo→agua)",
        "Cambio químico: nueva sustancia (combustión, oxidación)",
        "Masa se conserva en cambios de estado",
      ]},
      { titulo: "Átomo y tabla periódica", contenido: [
        "Protones(+) y neutrones en el núcleo, electrones(-) en corteza",
        "Número atómico = protones (define el elemento)",
        "Número de masa = protones + neutrones",
        "Tabla periódica ordenada por número atómico creciente",
        "Ejemplo: 34 protones + 45 neutrones → número de masa=79",
      ]},
      { titulo: "Enlace y fórmulas", contenido: [
        "Enlace iónico: metal + no metal (cede/recibe electrones)",
        "Enlace covalente: no metal + no metal (comparte electrones)",
        "H₂O: 2 átomos de H + 1 átomo de O",
        "Mezcla: partículas sin unión química",
        "Compuesto: átomos unidos químicamente",
        "Elemento: un solo tipo de átomo",
      ]},
      { titulo: "Reacciones químicas", contenido: [
        "Ecuación balanceada: mismos átomos en reactivos y productos",
        "Ácidos: pH<7, dan H⁺ | Bases: pH>7, dan OH⁻",
        "pH=7 neutro (agua pura)",
        "Oxidación: pierde electrones | Reducción: gana electrones",
        "Fenómeno químico: combustión, oxidación manzana, corrosión",
      ]},
    ],
  },
  {
    nombre: "Biología", icono: "🧬", color: "emerald",
    subtemas: [
      { titulo: "Características seres vivos", contenido: [
        "NMRICRE: Nutrición, Movimiento, Reproducción, Irritabilidad, Crecimiento, Relación, Excreción",
        "Irritabilidad: capacidad de responder a estímulos",
        "Autótrofos: producen su alimento (fotosíntesis)",
        "Heterótrofos: dependen de otros para alimentarse",
        "Almidón en: papa, maíz, trigo (no mantequilla ni queso)",
      ]},
      { titulo: "Evolución y biodiversidad", contenido: [
        "Darwin: selección natural — sobrevive el más adaptado",
        "Adaptación: cambios que mejoran supervivencia",
        "Biodiversidad en México: megadiverso (Oaxaca, Chiapas)",
        "Desarrollo sustentable: crecimiento económico + preservación",
        "Factor daño biodiversidad México: venta clandestina especies",
      ]},
      { titulo: "Fotosíntesis y respiración", contenido: [
        "Fotosíntesis: 6CO₂+6H₂O+luz → C₆H₁₂O₆+6O₂",
        "Respiración aerobia: usa O₂, produce CO₂+H₂O+energía",
        "Respiración anaerobia: sin O₂ (fermentación)",
        "Ciclo carbono: fotosíntesis absorbe CO₂, respiración libera CO₂",
        "Helechos y plantas: fotosíntesis (autótrofos)",
      ]},
      { titulo: "Reproducción y genética", contenido: [
        "Mitosis: división para crecer (células hijas idénticas)",
        "Meiosis: división para reproducción (4 células con ½ cromosomas)",
        "Reproducción sexual: individuos DIFERENTES al progenitor",
        "Reproducción asexual: idénticos al progenitor",
        "Genotipo: genes que tiene | Fenotipo: cómo se expresa",
        "Anticonceptivos naturales < eficacia que mecánicos",
      ]},
    ],
  },
  {
    nombre: "Español", icono: "📝", color: "yellow",
    subtemas: [
      { titulo: "Fichas y componentes del texto", contenido: [
        "Ficha bibliográfica: guarda datos de una obra (autor, título, editorial, año)",
        "Ficha de trabajo: contiene información extraída",
        "Componentes: títulos, subtítulos, índices, ilustraciones, gráficas",
        "Paráfrasis: reescribir con otras palabras",
        "Tema: de qué trata | Subtema: parte específica",
      ]},
      { titulo: "Nexos y conectores", contenido: [
        "Nexos temporales: primero, luego, después, finalmente",
        "Nexos adversativos: pero, aunque, sin embargo, a pesar de",
        "Nexos causales: porque, ya que, debido a",
        "Nexos consecuentes: por lo tanto, así que, en consecuencia",
        "Nexos ejemplificativos: por ejemplo, es decir, esto es",
      ]},
      { titulo: "Signos de puntuación", contenido: [
        "Dos puntos: antes de enumeración, cita textual, vocativo",
        "Punto y coma: separar oraciones relacionadas largas",
        "Coma: enumerar, vocativo, oraciones coordinadas",
        "Comillas: citas textuales, títulos de obras cortas",
        "Paréntesis: información aclaratoria secundaria",
      ]},
      { titulo: "Recursos literarios y funciones del lenguaje", contenido: [
        "Metáfora: identifica dos términos SIN usar 'como' (tiempo es oro)",
        "Símil/comparación: usa 'como' (rápido COMO el viento)",
        "Hipérbole: exageración (te lo dije mil veces)",
        "Personificación: atribuye cualidades humanas a objetos",
        "Función expresiva: centrada en el emisor/sentimientos",
        "Función apelativa: influir en el receptor (imperativo)",
        "Función referencial: informar objetivamente",
      ]},
      { titulo: "Textos periodísticos y publicitarios", contenido: [
        "Noticia: informa hechos recientes objetivamente",
        "Reportaje: investiga un tema con profundidad",
        "Artículo de opinión: expresa punto de vista del autor",
        "Eslogan: frases que cambian conducta del consumidor",
        "Hipérbole publicitaria: exagera cualidades del producto",
      ]},
    ],
  },
  {
    nombre: "Habilidad Verbal", icono: "🔤", color: "purple",
    subtemas: [
      { titulo: "Comprensión lectora", contenido: [
        "Idea principal: de qué trata TODO el texto",
        "Ideas secundarias: apoyan o ejemplifican la principal",
        "Hipótesis: afirmación no comprobada (usa 'posiblemente', 'quizás')",
        "Hecho: información comprobable y objetiva",
        "Opinión: punto de vista subjetivo ('creo que', 'en mi opinión')",
      ]},
      { titulo: "Relaciones entre ideas", contenido: [
        "Causa-consecuencia: A provoca B",
        "Oposición: contraste entre ideas",
        "Analogía: relación de semejanza entre conceptos",
        "General-particular: de lo amplio a lo específico",
        "Cronológica: orden temporal de eventos",
      ]},
      { titulo: "Vocabulario y analogías", contenido: [
        "Sinónimo: misma significado (súplica=ruego, absurdo=disparatado)",
        "Antónimo: significado opuesto (implementar≠abolir, ocio≠actividad)",
        "Analogía tipo-categoría: honradez:virtud = vanidad:defecto",
        "Analogía causa-efecto: canas:vejez = humo:fuego",
        "Analogía individuo-grupo: abeja:enjambre = perro:jauría",
      ]},
    ],
  },
  {
    nombre: "Habilidad Matemática", icono: "🧩", color: "indigo",
    subtemas: [
      { titulo: "Sucesiones numéricas", contenido: [
        "Aritmética: diferencia constante (3,6,9,12 → +3)",
        "Geométrica: razón constante (2,6,18,54 → ×3)",
        "Cuadrática: diferencias de segundo orden crecen de 2 en 2",
        "Fibonacci: suma los dos anteriores (1,1,2,3,5,8,13,21...)",
        "Cuadrados de primos: 4,9,25,49,121,169... (2²,3²,5²,7²,11²,13²)",
        "Tip: calcula diferencias entre términos consecutivos",
      ]},
      { titulo: "Series espaciales y rotaciones", contenido: [
        "Rotación 90° horario: lo que apuntaba arriba apunta a la derecha",
        "Rotación 180°: figura queda invertida",
        "Rotación 270° horario = 90° antihorario",
        "Identifica: giro, reflexión, traslación o cambio de tamaño",
        "Contar hexágonos/cuadrados: incluye los compuestos",
      ]},
      { titulo: "Razonamiento lógico", contenido: [
        "Regla de tres directa: más→más (150 botellas/20min → 60 botellas = 8min)",
        "Regla de tres inversa: más→menos",
        "Problemas de edades: plantea ecuación con variable",
        "MCD: factor común mayor | Ejemplo: MCD(24,36)=12",
        "MCM: múltiplo común menor",
      ]},
    ],
  },
  {
    nombre: "Historia", icono: "📜", color: "red",
    subtemas: [
      { titulo: "Historia Universal s.XVI-XIX", contenido: [
        "1453: turcos toman Constantinopla → Europa busca nuevas rutas",
        "Humanismo y Renacimiento: el hombre centro del universo",
        "Revolución Francesa 1789: libertad, igualdad, fraternidad",
        "Independencia EE.UU. 1776: primer país moderno democrático",
        "Revolución Industrial: máquina de vapor, trabajo asalariado",
      ]},
      { titulo: "Guerras mundiales y entreguerras", contenido: [
        "1ª GM 1914-1918: guerra de trincheras, Paz de Versalles",
        "Fascismo italiano: desintegración del parlamento (Mussolini)",
        "Nazismo alemán: persecución racial, antisemitismo (Hitler)",
        "Diferencia: fascismo=Estado totalitario | nazismo=raza aria",
        "2ª GM 1939-1945: causas en Versalles, Holocausto, bomba atómica",
      ]},
      { titulo: "Guerra Fría y mundo actual", contenido: [
        "Guerra Fría: EE.UU. (capitalismo) vs URSS (socialismo) 1947-1991",
        "Sin confrontación directa: guerra de influencias",
        "Guerra del Golfo: EE.UU. vs Iraq por control del petróleo",
        "Globalización: interdependencia económica mundial",
        "Sudán del Sur: independencia julio 2011 (país más joven)",
      ]},
      { titulo: "Historia de México colonial", contenido: [
        "Mesoamérica: Aztecas, Mayas, Olmecas, Zapotecas",
        "Conquista: Hernán Cortés 1519-1521",
        "Nueva España: Virreinato, Inquisición como control ideológico",
        "Economía novohispana: minería de plata y metales",
        "Criollismo: nacidos en América de padres españoles",
      ]},
      { titulo: "México independiente y moderno", contenido: [
        "Independencia consumada 1821: Agustín de Iturbide",
        "Guerra México-EE.UU. 1846-47: expansionismo anglosajón + Texas",
        "Reforma liberal: Constitución 1857, Leyes de Reforma",
        "Porfiriato: dictadura 1876-1910, paz y progreso",
        "Revolución 1910 | Constitución 1917: Art.3 educación, Art.27 tierra, Art.123 trabajo",
        "IFE creado 1990: legitimidad perdida en 1988",
      ]},
    ],
  },
  {
    nombre: "Geografía", icono: "🌍", color: "teal",
    subtemas: [
      { titulo: "Espacio geográfico y mapas", contenido: [
        "Componentes económicos: producción, transporte, comercio, consumo",
        "Latitud: paralelos (norte-sur) | Longitud: meridianos (este-oeste)",
        "Coordenadas: latitud S + longitud E → hemisferio sur/este",
        "Husos horarios: 24 zonas de 15° cada una",
        "SIG: Sistemas de Información Geográfica",
      ]},
      { titulo: "Relieve, clima y recursos", contenido: [
        "Placas tectónicas convergentes: mayor sismicidad",
        "Infiltración del agua: recarga mantos freáticos (aguas subterráneas)",
        "Huracanes: principal riesgo en Yucatán",
        "Biocombustibles (aceites vegetales): protegen el medio ambiente",
        "Coatzacoalcos y Poza Rica: extracción de hidrocarburos",
      ]},
      { titulo: "Población y riesgos", contenido: [
        "Migración: efectos económicos, sociales y culturales",
        "Zonas sísmicas: límites convergentes de placas",
        "Riesgos por región: Yucatán=huracanes, CDMX=sismos",
        "Crecimiento poblacional: natalidad - mortalidad + migración",
      ]},
      { titulo: "Economía y comercio", contenido: [
        "Sector primario: agricultura, pesca, minería (extrae)",
        "Sector secundario: industria, manufactura (transforma)",
        "Sector terciario: comercio, turismo, servicios (presta)",
        "Transporte marítimo: petróleo Veracruz→EE.UU.",
        "FMI: 190 miembros, estabilidad financiera mundial",
        "Patrimonio UNESCO México: Querétaro=Misiones, Veracruz=Tlacotalpan, Oaxaca=Monte Albán, Chihuahua=Paquimé",
      ]},
      { titulo: "Cultura y soberanía", contenido: [
        "Mar territorial: 12 millas náuticas, soberanía plena",
        "Zona económica exclusiva: 200 millas",
        "Diversidad cultural: etnias, lenguas, religiones",
        "Patrimonio natural y cultural UNESCO en México",
        "Fronteras: terrestres con EE.UU. y Guatemala/Belice",
      ]},
    ],
  },
  {
    nombre: "Formación Cívica y Ética", icono: "⚖️", color: "pink",
    subtemas: [
      { titulo: "Ética y valores", contenido: [
        "Autonomía moral: tomar decisiones propias con criterio",
        "Valores estéticos: apreciación del arte y la belleza",
        "Valores económicos: asignados a bienes y servicios",
        "Valores morales: orientados por ideales y juicios éticos",
        "Empatía: ponerse en lugar del otro para el desarrollo moral",
      ]},
      { titulo: "Identidad y adolescencia", contenido: [
        "Identidad personal: grupos, tradiciones, historias compartidas",
        "Derechos adolescentes: salud, educación, recreación",
        "Obligaciones: estudios, cumplir normas sociales",
        "Violencia económica: pagar menos del salario mínimo",
        "Respuesta asertiva: enfrentar situaciones de riesgo",
      ]},
      { titulo: "Democracia y ciudadanía", contenido: [
        "Democracia: principio de mayoría para tomar decisiones",
        "Soberanía: ciudadanos eligen al presidente (voto)",
        "Territorio: espacio donde el Estado ejerce poder",
        "División de poderes: ejecutivo, legislativo, judicial",
        "Participación ciudadana: reconoce pluralidad ideológica",
      ]},
      { titulo: "Constitución y derechos", contenido: [
        "Art. 3: educación laica, gratuita y obligatoria",
        "Art. 27: tierras y recursos naturales propiedad de la Nación",
        "Art. 123: derechos laborales de trabajadores",
        "Derechos humanos: dignidad, autonomía, libertad, justicia",
        "Negociación: conflicto de intereses + diálogo + ceder mutuamente",
        "Medios de comunicación: función social (ej. Teletón)",
      ]},
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
