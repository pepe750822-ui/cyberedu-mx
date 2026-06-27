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

export const areas: Area[] = [
  {
    nombre: "Pensamiento científico", icono: "\uD83D\uDD2C", color: "emerald",
    subtemas: [
      { titulo: "Biología — Célula y biodiversidad", contenido: [
        "Teoría celular: todos los seres vivos están formados por células",
        "Célula procariota: sin núcleo definido (bacterias)",
        "Célula eucariota: con núcleo (animales, plantas, hongos)",
        "Organelos: mitocondria (energía), ribosomas (proteínas), aparato de Golgi (empaque)",
        "Biodiversidad en México: uno de los países megadiversos",
        "Adaptación: características que mejoran la supervivencia en un ambiente",
      ]},
      { titulo: "Física — Movimiento y energía", contenido: [
        "Velocidad: cambio de posición en el tiempo (v = d/t)",
        "Aceleración: cambio de velocidad en el tiempo",
        "1ra Ley de Newton (inercia): un objeto en reposo permanece en reposo",
        "2da Ley de Newton: F = ma (fuerza = masa × aceleración)",
        "3ra Ley de Newton: acción y reacción",
        "Energía cinética: energía del movimiento",
        "Energía potencial: energía almacenada por posición",
      ]},
      { titulo: "Química — Materia y reacciones", contenido: [
        "Estados de agregación: sólido, líquido, gaseoso, plasma",
        "Modelos atómicos: Dalton, Thomson, Rutherford, Bohr",
        "Enlace iónico: transferencia de electrones (metal + no metal)",
        "Enlace covalente: compartición de electrones (no metal + no metal)",
        "Reacción química: reactivos → productos",
        "pH: ácido (0-6), neutro (7), básico (8-14)",
        "Métodos de separación: filtración, decantación, destilación",
      ]},
    ],
  },
  {
    nombre: "Redacción indirecta", icono: "\u270D\uFE0F", color: "yellow",
    subtemas: [
      { titulo: "Gramática y ortografía", contenido: [
        "Acentuación: agudas (última sílaba), graves (penúltima), esdrújulas (antepenúltima)",
        "Palabras graves terminadas en n, s o vocal: NO llevan tilde (examen, imagen)",
        "Uso de la diéresis: güe, güi (antigüedad, vergüenza)",
        "Uso de la coma: enumeración, vocativo, aposiciones",
        "Punto y coma: separa oraciones largas relacionadas",
        "Dos puntos: enumeración, cita textual, explicación",
        "Mayúsculas: inicio de oración, nombres propios",
      ]},
      { titulo: "Sintaxis y concordancia", contenido: [
        "Sujeto: quien realiza la acción",
        "Predicado: la acción que realiza el sujeto",
        "Concordancia nominal: género y número (niños contentos)",
        "Concordancia verbal: persona y número (él corre, ellos corren)",
        "Voz activa: el sujeto realiza la acción",
        "Voz pasiva: el sujeto recibe la acción",
        "Conectores: causales (porque), adversativos (pero), temporales (luego)",
      ]},
    ],
  },
  {
    nombre: "Comprensión lectora", icono: "\uD83D\uDCD6", color: "violet",
    subtemas: [
      { titulo: "Tipos de texto", contenido: [
        "Texto informativo: presenta hechos objetivos (noticia, reportaje)",
        "Texto argumentativo: defiende una tesis (artículo de opinión, ensayo)",
        "Texto literario: función estética (cuento, poesía, novela)",
        "Texto científico: informa sobre investigación (artículo, monografía)",
        "Convocatoria: documento que anuncia requisitos y plazos",
      ]},
      { titulo: "Estrategias de lectura", contenido: [
        "Idea principal: de qué trata el texto (puede estar implícita o explícita)",
        "Ideas secundarias: apoyan o ejemplifican la idea principal",
        "Inferencia: conclusión no dicha explícitamente en el texto",
        "Paráfrasis: expresar una idea con otras palabras",
        "Síntesis: resumen breve de lo más importante",
        "Cita textual: reproducción literal de un fragmento entre comillas",
        "Hecho vs opinión: el hecho es verificable; la opinión es subjetiva",
      ]},
    ],
  },
  {
    nombre: "Pensamiento matemático", icono: "\uD83D\uDD22", color: "blue",
    subtemas: [
      { titulo: "Álgebra", contenido: [
        "Expresiones algebraicas: combinación de números y variables",
        "Productos notables: (a+b)², (a-b)², (a+b)(a-b)",
        "Factorización: expresar como producto de factores",
        "Ecuación lineal: ax + b = 0",
        "Sistema de ecuaciones: dos o más ecuaciones con dos o más incógnitas",
      ]},
      { titulo: "Geometría", contenido: [
        "Área del rectángulo: base × altura",
        "Área del círculo: πr²",
        "Área del triángulo: (base × altura) / 2",
        "Teorema de Pitágoras: c² = a² + b²",
        "Volumen del cubo: lado³",
        "Ángulos: agudo (<90°), recto (90°), obtuso (>90°), llano (180°)",
      ]},
      { titulo: "Estadística y probabilidad", contenido: [
        "Media: suma de datos ÷ número de datos",
        "Mediana: valor central de datos ordenados",
        "Moda: valor que más se repite",
        "Probabilidad: casos favorables / casos totales",
        "Mínimo común múltiplo (mcm): múltiplo más pequeño compartido",
        "Máximo común divisor (MCD): divisor más grande compartido",
      ]},
      { titulo: "Aritmética", contenido: [
        "Números enteros: positivos, negativos y cero",
        "Fracciones: numerador / denominador",
        "Decimales: décimas, centésimas, milésimas",
        "Porcentaje: parte de 100 (20% = 20/100 = 0.20)",
        "Regla de tres: proporcionalidad directa",
        "Razones: comparación de dos cantidades",
      ]},
    ],
  },
  {
    nombre: "Inglés", icono: "\uD83C\uDDFA\uD83C\uDDF8", color: "sky",
    subtemas: [
      { titulo: "Vocabulario básico", contenido: [
        "Saludos: hello, goodbye, good morning",
        "Números: one, two, three, four, five",
        "Colores: red, blue, green, yellow, white, black",
        "Días de la semana: Monday, Tuesday, Wednesday, Thursday, Friday",
        "Meses: January, February, March, April, May, June",
      ]},
      { titulo: "Gramática esencial", contenido: [
        "Verbo to be: am, is, are",
        "Presente simple: I walk, he walks",
        "Pasado simple: I walked, I went",
        "Adjetivos: big, small, beautiful, fast",
        "Preposiciones: in, on, at, under, behind",
        "Artículos: a, an, the",
        "Plurales: -s, -es, irregulares (child → children)",
      ]},
    ],
  },
];

export const colorMap: Record<string, { header: string; dot: string; tag: string; btn: string; ring: string }> = {
  emerald: { header: "bg-emerald-600", dot: "bg-emerald-400", tag: "bg-emerald-900/40 text-emerald-300", btn: "bg-emerald-600 hover:bg-emerald-500", ring: "ring-emerald-500/30 border-emerald-500/30" },
  yellow:  { header: "bg-yellow-500",  dot: "bg-yellow-400",  tag: "bg-yellow-900/40 text-yellow-200",  btn: "bg-yellow-600 hover:bg-yellow-500",  ring: "ring-yellow-500/30 border-yellow-500/30" },
  violet:  { header: "bg-violet-600",  dot: "bg-violet-400",  tag: "bg-violet-900/40 text-violet-300",  btn: "bg-violet-600 hover:bg-violet-500",  ring: "ring-violet-500/30 border-violet-500/30" },
  blue:    { header: "bg-blue-600",    dot: "bg-blue-400",    tag: "bg-blue-900/40 text-blue-300",    btn: "bg-blue-600 hover:bg-blue-500",    ring: "ring-blue-500/30 border-blue-500/30" },
  sky:     { header: "bg-sky-600",     dot: "bg-sky-400",     tag: "bg-sky-900/40 text-sky-300",      btn: "bg-sky-600 hover:bg-sky-500",      ring: "ring-sky-500/30 border-sky-500/30" },
};
