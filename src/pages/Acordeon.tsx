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
  /* ── LENGUAJES ──────────────────────────────────────────────────── */
  {
    nombre: "Español", icono: "📝", color: "yellow",
    subtemas: [
      { titulo: "1. Fichas bibliográficas", contenido: [
        "1.1 Propósitos y características de las fichas bibliográficas",
      ]},
      { titulo: "2. Componentes gráficos y estructura del texto", contenido: [
        "2.1 Componentes: apartados, subapartados, títulos, subtítulos, índices, ilustraciones, gráficas, tablas, subrayado, recuadros",
        "2.2 Tema, subtema, orden cronológico, problema y su solución",
        "2.3 Recursos para desarrollar ideas en párrafos: ejemplificaciones, repeticiones, explicaciones o paráfrasis",
      ]},
      { titulo: "3. Gramática y recursos lingüísticos", contenido: [
        "3.1 Concordancia entre sujeto y predicado",
        "3.2 Nexos que introducen ideas: además, por ejemplo, en primer lugar, finalmente",
        "3.3 Nexos temporales: luego, después, primero, antes",
        "3.4 Nexos que encadenan argumentos: pero, aunque, sin embargo, aún, a pesar de",
        "3.5 Nexos con significado causal, concesivo y condicional",
        "3.6 Expresiones que jerarquizan información: la razón más importante, en primer lugar, finalmente",
        "3.7 Recursos para expresar sucesión y simultaneidad de acciones",
        "3.8 Recursos ortográficos para citar o resaltar: comillas, dos puntos",
        "3.9 Punto y seguido y la coma para separar oraciones en párrafos",
        "3.10 La coma en enumeraciones y construcciones coordinadas",
        "3.11 Signos de puntuación: guiones, dos puntos, puntos suspensivos, paréntesis, interrogación, admiración",
        "3.12 Oraciones principales y secundarias",
        "3.13 Enunciados que introducen información: oraciones temáticas o definiciones",
        "3.14 Enunciados que amplían información: explicaciones y ejemplos",
        "3.15 Funciones del presente simple del indicativo: habitual, histórico, atemporal",
      ]},
      { titulo: "4. Tipos de textos", contenido: [
        "4.1 Modos de plantear, explicar y argumentar en diferentes textos",
        "4.2 Uso de adjetivos, participios y aposiciones en descripción de personajes",
        "4.3 Uso del tiempo pasado para narrar sucesos",
        "4.4 Uso del copretérito para describir situaciones o caracterizar personajes",
        "4.5 Propósitos de los textos informativos",
        "4.6 Propósitos de los textos legales y administrativos",
        "4.7 Uso y función de los verbos: beber, poder, tener y haber que",
        "4.8 Propósitos de noticias, reportajes y artículos de opinión",
        "4.9 Diferencias entre hechos, opiniones, comentarios y valoraciones",
        "4.10 Función e impacto de la publicidad en la sociedad",
        "4.11 Exageración de las cualidades del producto (publicidad)",
      ]},
    ],
  },
  {
    nombre: "Habilidad Verbal", icono: "🔤", color: "purple",
    subtemas: [
      { titulo: "1. Comprensión de lectura", contenido: [
        "1.1 Reconocer información explícita",
        "1.2 Inferir hechos",
        "1.3 Identificar el resumen con las ideas principales",
        "1.4 Completar un cuadro sinóptico con los conceptos principales",
        "1.5 Identificar la conclusión",
        "1.6 Identificar la secuencia de acontecimientos",
        "1.7 Tipos de relaciones: causa-consecuencia, oposición-semejanza, general-particular, ejemplificativas, analógicas, cronológicas",
        "1.8 Distinguir entre hechos y opiniones",
        "1.9 Identificar la idea principal y las ideas secundarias",
        "1.10 Reconocer el significado de palabras por contexto o campo semántico",
      ]},
      { titulo: "2. Manejo de vocabulario", contenido: [
        "2.1 Establecer analogías entre palabras",
        "2.2 Distinguir palabras con significado opuesto (antónimos)",
        "2.3 Distinguir palabras con significado similar (sinónimos)",
      ]},
    ],
  },

  /* ── SABERES Y PENSAMIENTO CIENTÍFICO ────────────────────────────── */
  {
    nombre: "Matemáticas", icono: "🔢", color: "blue",
    subtemas: [
      { titulo: "1. Significado y uso de los números", contenido: [
        "1.1 Operaciones básicas con números enteros",
        "1.2 Resolución de problemas con operaciones básicas",
        "1.3 Relaciones de proporcionalidad",
        "1.4 Operaciones básicas con números fraccionarios y decimales",
        "1.5 Porcentajes",
        "1.6 Potenciación y radicación",
        "1.7 Resolución de problemas con fracciones o decimales",
      ]},
      { titulo: "2. Álgebra", contenido: [
        "2.1 Significado y uso de las literales",
        "2.2 Expresión común de problemas algebraicos de adición y sustracción",
        "2.3 Resolución de problemas con expresiones algebraicas",
        "2.4 Resolución de ecuaciones de primer grado",
        "2.5 Resolución de problemas con ecuaciones de primer grado",
        "2.6 Resolución de sistemas lineales de dos ecuaciones con dos incógnitas",
        "2.7 Resolución de problemas con sistemas de dos ecuaciones lineales",
        "2.8 Productos notables y factorización",
        "2.9 Resolución de ecuaciones de segundo grado",
        "2.10 Relaciones de proporcionalidad directa",
        "2.11 Relaciones de proporcionalidad en el plano cartesiano",
      ]},
      { titulo: "3. Manejo de información estadística", contenido: [
        "3.1 Análisis de información estadística: índices",
        "3.2 Gráficas de barras y circulares",
        "3.3 Tablas de frecuencia absoluta y relativa",
        "3.4 Medidas de tendencia central",
        "3.5 Nociones de probabilidad y muestreo",
      ]},
      { titulo: "4. Formas geométricas", contenido: [
        "4.1 Rectas y ángulos",
        "4.2 Figuras planas",
        "4.3 Semejanza de triángulos",
        "4.4 Teorema de Pitágoras",
        "4.5 Razones trigonométricas",
        "4.6 Cálculo de perímetros",
        "4.7 Cálculo de áreas",
        "4.8 Cálculo de volúmenes",
      ]},
    ],
  },
  {
    nombre: "Habilidad Matemática", icono: "🧩", color: "indigo",
    subtemas: [
      { titulo: "1. Sucesiones numéricas", contenido: [
        "Aritmética: diferencia constante (3,6,9,12 → +3)",
        "Geométrica: razón constante (2,6,18,54 → ×3)",
        "Cuadrática: diferencias de 2do orden crecen de 2 en 2",
        "Fibonacci: suma los dos anteriores (1,1,2,3,5,8,13,21...)",
        "Cuadrados de primos: 4,9,25,49,121... (2²,3²,5²,7²,11²)",
        "Tip: calcula diferencias entre términos consecutivos",
      ]},
      { titulo: "2. Series espaciales", contenido: [
        "Rotación 90° horario: lo que apuntaba arriba apunta a la derecha",
        "Rotación 180°: figura queda invertida",
        "Rotación 270° horario = 90° antihorario",
        "Identifica: giro, reflexión, traslación o cambio de tamaño",
        "Contar figuras compuestas: incluye las que contienen a otras",
      ]},
      { titulo: "3. Imaginación espacial", contenido: [
        "Desarrollo plano de figuras 3D: visualizar qué sólido forma",
        "Cubos y sus vistas: frontal, lateral, superior",
        "Identificar sólido a partir de sus vistas ortogonales",
      ]},
      { titulo: "4. Problemas de razonamiento", contenido: [
        "Regla de tres directa: más→más (150 botellas/20min → 60 botellas=8min)",
        "Regla de tres inversa: más→menos",
        "Problemas de edades: plantea ecuación con variable",
        "MCD: factor común mayor | Ejemplo: MCD(24,36)=12",
        "MCM: múltiplo común menor",
      ]},
    ],
  },
  {
    nombre: "Biología", icono: "🧬", color: "emerald",
    subtemas: [
      { titulo: "1. El valor de la biodiversidad", contenido: [
        "1.1 Características comunes de los seres vivos (NMRICRE)",
        "1.2 Aportaciones de Darwin para explicar la evolución",
        "1.3 Relación entre adaptación y selección natural",
        "1.4 Características y factores de riesgo de la biodiversidad en México",
        "1.5 Importancia de la conservación de los ecosistemas",
        "1.6 Desarrollo sustentable: aprovechamiento presente y futuro de los recursos",
      ]},
      { titulo: "2. Tecnología y sociedad", contenido: [
        "2.1 Ciencia y tecnología en la interacción ser humano-naturaleza",
      ]},
      { titulo: "3. Transformación de materia y energía", contenido: [
        "3.1 La fotosíntesis: 6CO₂+6H₂O+luz → C₆H₁₂O₆+6O₂",
        "3.2 Respiración celular",
        "3.3 Respiración aerobia y anaerobia",
        "3.4 Fotosíntesis y respiración en el ciclo del carbono",
        "3.5 Organismos autótrofos y heterótrofos",
      ]},
      { titulo: "4. Nutrición y respiración para la salud", contenido: [
        "4.1 Alimentación correcta: dieta equilibrada, completa e higiénica",
        "4.2 Prevención de enfermedades relacionadas con la nutrición",
        "4.3 Causas y consecuencias de la contaminación atmosférica y calentamiento global",
        "4.4 Prevención de enfermedades respiratorias",
      ]},
      { titulo: "5. Reproducción y sexualidad", contenido: [
        "5.1 División celular por mitosis y meiosis",
        "5.2 Reproducción sexual y asexual",
        "5.3 Salud reproductiva y anticonceptivos",
        "5.4 Enfermedades de transmisión sexual: causas, síntomas y prevención",
      ]},
      { titulo: "6. Genética, tecnología y sociedad", contenido: [
        "6.1 Fenotipo, genotipo, cromosomas y genes",
        "6.2 Métodos, beneficios y riesgos de la manipulación genética",
      ]},
    ],
  },
  {
    nombre: "Física", icono: "⚡", color: "cyan",
    subtemas: [
      { titulo: "1. El movimiento", contenido: [
        "1.1 Conceptos de velocidad y rapidez",
        "1.2 Tipos de movimientos en gráficas posición-tiempo",
        "1.3 Relación entre gráficas posición-tiempo y un conjunto de datos",
        "1.4 Velocidad, desplazamiento y tiempo",
        "1.5 Movimiento con velocidad variable: la aceleración",
        "1.6 El movimiento de los cuerpos que caen (caída libre)",
      ]},
      { titulo: "2. Las fuerzas y la energía", contenido: [
        "2.1 Fuerza resultante",
        "2.2 Las leyes de Newton en la vida cotidiana",
        "2.3 Pares de fuerzas",
        "2.4 Fuerzas que actúan sobre objetos en reposo o movimiento",
        "2.5 Ley de Gravitación Universal y el peso de los objetos",
        "2.6 La energía y la descripción de las transformaciones",
        "2.7 La conservación de la energía mecánica",
        "2.8 Cargas eléctricas y formas de electrización",
        "2.9 Imanes y magnetismo terrestre",
      ]},
      { titulo: "3. Modelo cinético de partículas", contenido: [
        "3.1 El modelo cinético de partículas",
        "3.2 Calor y temperatura",
        "3.3 El modelo de partículas y la presión",
        "3.4 La ecuación del principio de Pascal",
        "3.5 Principio de conservación de la energía",
      ]},
      { titulo: "4. Estructura interna de la materia y ondas", contenido: [
        "4.1 Estructura interna de la materia",
        "4.2 Capacidad de los materiales para conducir corriente eléctrica",
        "4.3 Campos magnéticos y cargas eléctricas",
        "4.4 Experimentos de inducción electromagnética",
        "4.5 Características del movimiento ondulatorio",
        "4.6 La radiación electromagnética y sus implicaciones tecnológicas",
        "4.7 Los prismas y la descomposición de la luz",
        "4.8 La refracción de la luz blanca",
        "4.9 La luz: longitud de onda, frecuencia y energía",
      ]},
    ],
  },
  {
    nombre: "Química", icono: "🧪", color: "orange",
    subtemas: [
      { titulo: "1. Las características de los materiales", contenido: [
        "1.1 Características del conocimiento científico: el caso de la Química",
        "1.2 Propiedades de los materiales",
        "1.3 Cambios físicos y químicos",
        "1.4 Propiedades físicas y caracterización de las sustancias",
        "1.5 La conservación de la masa en los cambios físicos y químicos",
        "1.6 Diversidad de sustancias y métodos de separación",
      ]},
      { titulo: "2. Estructura y periodicidad de los elementos", contenido: [
        "2.1 Características de los protones, electrones y neutrones",
        "2.2 Número atómico y número de masa",
        "2.3 Iones, moléculas y átomos",
        "2.4 Estructura de Lewis",
        "2.5 Estructura y organización de la tabla periódica",
        "2.6 Enlace químico",
      ]},
      { titulo: "3. La reacción química", contenido: [
        "3.1 El cambio químico",
        "3.2 La ecuación química: su interpretación",
        "3.3 El mol como unidad de medida",
        "3.4 Ácidos y bases importantes en nuestra vida cotidiana",
        "3.5 Las reacciones redox",
      ]},
    ],
  },

  /* ── ÉTICA, NATURALEZA Y SOCIEDADES ──────────────────────────────── */
  {
    nombre: "Historia", icono: "📜", color: "red",
    subtemas: [
      { titulo: "1. Principios s.XVI a principios s.XVIII", contenido: [
        "1.1 Demandas europeas y necesidad de nuevas rutas comerciales",
        "1.2 Humanismo: expresiones filosóficas, literarias y políticas",
        "1.3 Expediciones marítimas y conquistas (África, India, Indonesia y América)",
      ]},
      { titulo: "2. Mediados s.XVIII a mediados s.XIX", contenido: [
        "2.1 La Ilustración y la Enciclopedia",
        "2.2 El absolutismo europeo y reorganización de los imperios",
        "2.3 La independencia de las trece colonias (EE.UU. 1776)",
        "2.4 Causas externas e internas de la Revolución Francesa 1789",
        "2.5 Consecuencias de la Revolución Francesa en América Latina",
        "2.6 Revolución Industrial: ciudades industriales y condiciones laborales",
      ]},
      { titulo: "3. Mediados s.XIX a 1920", contenido: [
        "3.1 Nacionalismo",
        "3.2 El imperialismo y su expansión en el mundo",
        "3.3 La paz armada y la Primera Guerra Mundial 1914-1918",
        "3.4 La paz de Versalles y sus consecuencias",
      ]},
      { titulo: "4. El mundo entre 1920 y 1960", contenido: [
        "4.1 El mundo entre las grandes guerras: socialismo, nacional socialismo y fascismo",
        "4.2 La pobreza en el mundo",
        "4.3 Avances científicos y tecnológicos y su impacto en la sociedad",
        "4.4 La Segunda Guerra Mundial: causas y consecuencias",
        "4.5 Etapas de la Segunda Guerra Mundial",
      ]},
      { titulo: "5. Décadas recientes", contenido: [
        "5.1 Características de los bloques capitalista y socialista (Guerra Fría)",
        "5.2 Contrastes sociales y económicos. Globalización económica",
        "5.3 El conflicto del Golfo Pérsico",
      ]},
      { titulo: "6. Culturas prehispánicas y la Nueva España", contenido: [
        "6.1 Mesoamérica y sus áreas culturales (Aztecas, Mayas, Olmecas, Zapotecas)",
        "6.2 El virreinato y la instauración de las audiencias",
        "6.3 Las instituciones eclesiásticas. La Inquisición como control ideológico",
        "6.4 El criollismo: nacidos en América de padres españoles",
      ]},
      { titulo: "7. Nueva España hasta la independencia", contenido: [
        "7.1 El absolutismo ilustrado",
        "7.2 Crecimiento de Nueva España: minería, agricultura y ganadería",
        "7.3 Desarrollo y consumación de la independencia (1821, Iturbide)",
      ]},
      { titulo: "8. De la Independencia al inicio de la Revolución (1821-1911)", contenido: [
        "8.1 El endeudamiento de México y conflictos con residentes extranjeros",
        "8.2 La guerra con Estados Unidos (1846-47, Texas)",
        "8.3 La intervención francesa y el imperio",
        "8.4 La Reforma liberal: Constitución 1857, Leyes de Reforma",
        "8.5 Los gobiernos de la República Restaurada (positivismo, política anticlerical)",
        "8.6 Movimientos de oposición al gobierno de Juárez",
        "8.7 El Porfiriato: dictadura 1876-1910, paz y características",
        "8.8 Disidencias, huelgas y represión",
      ]},
      { titulo: "9. Instituciones revolucionarias y desarrollo (1911-1979)", contenido: [
        "9.1 La insurrección maderista",
        "9.2 Diversidad regional de los movimientos revolucionarios",
        "9.3 La Constitución de 1917: Art.3 educación, Art.27 tierra, Art.123 trabajo",
        "9.4 Guerra cristera, ejército y organizaciones sociales",
        "9.5 Caudillismo, ejército, partido único",
        "9.6 Reforma agraria",
        "9.7 La Segunda Guerra Mundial y su impacto en la economía nacional",
        "9.8 Clasicismo, romanticismo y modernismo en México",
      ]},
      { titulo: "10. México en la era global (1970-2000)", contenido: [
        "10.1 Instauración del neoliberalismo",
        "10.2 El Tratado de Libre Comercio",
        "10.3 La reforma electoral y la alternancia en el poder",
        "10.4 Movimientos sociales desde los años 60 como promotores de participación ciudadana",
      ]},
    ],
  },
  {
    nombre: "Geografía", icono: "🌍", color: "teal",
    subtemas: [
      { titulo: "1. El espacio geográfico y los mapas", contenido: [
        "1.1 Componentes naturales, sociales y económicos del espacio geográfico",
        "1.2 Categorías: región, paisaje, medio, territorio y lugar",
        "1.3 Conceptos: localización, distribución, temporalidad y relación",
        "1.4 Paralelos, meridianos, polos; coordenadas: latitud, longitud, altitud. Husos horarios",
        "1.5 Representaciones: croquis, planos, mapas, atlas, imágenes de satélite",
        "1.6 Sistemas de Información Geográfica (SIG) y Sistema de Posicionamiento Global (GPS)",
        "1.7 Mapas temáticos: naturales, económicos, sociales, culturales y políticos",
      ]},
      { titulo: "2. Recursos naturales y preservación del ambiente", contenido: [
        "2.1 Movimientos de rotación y traslación de la Tierra",
        "2.2 Tectónica de placas, vulcanismo y sismicidad",
        "2.3 Ciclo hidrológico: distribución de aguas oceánicas y continentales",
        "2.4 Capas de la atmósfera. Elementos y factores del clima",
        "2.5 Distribución y clasificación de los climas en el mundo",
        "2.6 Biosfera: relaciones de litosfera, atmósfera e hidrosfera con vegetación y fauna",
        "2.7 Biodiversidad: especies endémicas y en peligro de extinción",
        "2.8 Recursos naturales del suelo, subsuelo, aire y agua. Desarrollo sustentable",
        "2.9 Ambiente: deterioro y protección",
        "2.10 Políticas y educación ambiental. Ecotecnias y ecoturismo",
      ]},
      { titulo: "3. Dinámica de la población y riesgos", contenido: [
        "3.1 Crecimiento y distribución de la población (absoluta y relativa)",
        "3.2 Ciudades y medio rural: ubicación, rasgos y principales problemas",
        "3.3 Migración: tipos, flujos, efectos económicos, sociales y culturales",
        "3.4 Riesgos y vulnerabilidad de la población",
        "3.5 Zonas de vulnerabilidad para la población",
      ]},
      { titulo: "4. Espacios económicos y desigualdad social", contenido: [
        "4.1 Regiones agrícolas, ganaderas, forestales, pesqueras y mineras",
        "4.2 Espacios industriales de México y del mundo",
        "4.3 Flujos comerciales, redes de transportes y comunicaciones",
        "4.4 Espacios turísticos",
        "4.5 Globalización. Organismos económicos internacionales y empresas transnacionales",
        "4.6 Principales regiones comerciales y ciudades mundiales",
        "4.7 Desigualdad socioeconómica: Índice de Desarrollo Humano (IDH)",
      ]},
      { titulo: "5. Espacios culturales y políticos", contenido: [
        "5.1 Diversidad cultural de México y del mundo: etnias, lenguas, religiones",
        "5.2 Globalización cultural e influencia de los medios de comunicación",
        "5.3 Multiculturalidad e interculturalidad",
        "5.4 Cambios en el mundo por intereses económicos y políticos",
        "5.5 Las fronteras. Zonas de transición y espacios internacionales",
        "5.6 Patrimonio cultural de México: zonas arqueológicas, ciudades coloniales, pueblos típicos",
        "5.7 Soberanía nacional: terrestre, marítima (12 millas), insular y aérea",
      ]},
    ],
  },
  {
    nombre: "Formación Cívica y Ética", icono: "⚖️", color: "pink",
    subtemas: [
      { titulo: "1. FCyE en el desarrollo social y personal", contenido: [
        "1.1 Capacidad para pensar y juzgar las propias acciones",
        "1.2 Libertad para elegir y decidir responsablemente. Condiciones y límites",
        "1.3 Características de la autonomía moral",
        "1.4 Conciencia moral individual",
        "1.5 La empatía y el diálogo para el desarrollo moral",
        "1.6 Tipos de normas en la vida cotidiana: morales, jurídicas, sociales",
      ]},
      { titulo: "2. La dimensión cívica y ética de la convivencia", contenido: [
        "2.1 Tipos de valores: económicos, estéticos y morales",
      ]},
      { titulo: "3. Identidad e interculturalidad", contenido: [
        "3.1 Elementos de la identidad personal: grupos de pertenencia, tradiciones, historias compartidas",
      ]},
      { titulo: "4. Los adolescentes y sus contextos de convivencia", contenido: [
        "4.1 Cambios físicos, sociales y afectivos de la adolescencia",
        "4.2 Derechos de los adolescentes",
        "4.3 Responsabilidades en educación, salud, recreación y participación social",
        "4.4 Situaciones de riesgo: infecciones de transmisión sexual",
        "4.5 Tipos de violencia hacia los adolescentes",
        "4.6 Maltrato, abuso y acoso sexual",
        "4.7 Capacidad para responder asertivamente ante situaciones de riesgo",
      ]},
      { titulo: "5. Principios y valores de la democracia", contenido: [
        "5.1 Los derechos humanos: dignidad, autonomía, libertad, justicia social",
        "5.2 Responsabilidades ciudadanas en la democracia",
        "5.3 Características de la democracia",
      ]},
      { titulo: "6. Participación y ciudadanía democrática", contenido: [
        "6.1 Componentes del Estado mexicano: población, territorio y gobierno",
        "6.2 División de poderes del Estado mexicano",
        "6.3 Derechos fundamentales en la Constitución y su relación con los Derechos Humanos",
        "6.4 Mecanismos de representación ciudadana. Partidos políticos",
        "6.5 Obligaciones gubernamentales en niveles federal, estatal y municipal",
        "6.6 Retos de la democracia en las sociedades contemporáneas",
        "6.7 Participación ciudadana",
      ]},
      { titulo: "7. Ciudadanía informada y participativa", contenido: [
        "7.1 La función social de los medios de comunicación",
      ]},
      { titulo: "8. Compromiso con el entorno natural y social", contenido: [
        "8.1 Importancia de la relación del ser humano con su entorno natural y social",
      ]},
      { titulo: "9. Recursos para la solución de conflictos sin violencia", contenido: [
        "9.1 La negociación en la resolución y manejo de conflictos",
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
