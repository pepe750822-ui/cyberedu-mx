import type { Area } from "./temarioData";

export const videoAreas: Area[] = [
  /* ── LENGUAJES ─────────────────────────────────────────────────── */
  {
    nombre: "Español", icono: "📝", color: "yellow",
    subtemas: [
      {
        titulo: "Obtención de Información",
        contenido: [
          "Propósitos y características de las fichas bibliográficas",
        ],
      },
      {
        titulo: "Organización de información",
        contenido: [
          "Funciones y características de los componentes gráficos del texto: apartados, subapartados, títulos, subtítulos, índices, ilustraciones, gráficas y tablas, subrayado, recuadros",
          "Tema, subtema, orden cronológico, problema y su solución",
          "Recursos que se utilizan para desarrollar las ideas en los párrafos: ejemplificaciones, repeticiones, explicaciones o paráfrasis",
        ],
      },
      {
        titulo: "Elementos que intervienen en la coherencia, la cohesión y la adecuación en los textos",
        contenido: [
          "Concordancia entre sujeto y predicado",
          "Nexos que introducen ideas: además, por ejemplo, en primer lugar, finalmente",
          "Nexos que relacionan temporalmente los enunciados: luego, después, primero, antes",
          "Expresiones y nexos que encadenan argumentos: pero, aunque, sin embargo, aún, a pesar de",
          "Recursos lingüísticos que se utilizan para desarrollar argumentos en los textos: nexos y expresiones con significado causal, concesivo y condicional",
          "Expresiones que jerarquizan la información: la razón más importante, otra razón por la que, por ejemplo, en primer lugar, finalmente, también",
          "Recursos lingüísticos que permiten expresar sucesión y simultaneidad de las acciones",
          "Recursos ortográficos que se usan para citar y/o resaltar información: comillas, dos puntos",
          "Uso del punto y seguido y la coma para separar oraciones en párrafos",
          "Uso de la coma en la organización de enumeraciones y construcciones coordinadas",
          "Uso de los signos de puntuación más frecuentes en los textos temáticos: guiones, dos puntos, puntos suspensivos, paréntesis, signos de interrogación y de admiración",
          "Oraciones principales y secundarias",
          "Enunciados que introducen información: oraciones temáticas o las definiciones",
          "Enunciados que amplían la información: explicaciones y ejemplos",
          "Funciones semánticas del presente simple del indicativo: habitual, histórico, atemporal",
        ],
      },
      {
        titulo: "Tipos de textos",
        contenido: [
          "Modos de plantear, explicar y argumentar las ideas en diferentes textos",
          "Uso de adjetivos, participios y aposiciones en la descripción de personajes",
          "Uso del tiempo pasado para narrar sucesos",
          "Uso del copretérito para describir situaciones del fondo o caracterizar personajes",
          "Propósitos de los textos informativos",
          "Propósito de los textos legales y administrativos",
          "Uso y función de los verbos: beber, poder, tener y haber que",
          "Propósitos de las noticias, reportajes y artículos de opinión",
          "Diferencias entre hechos, opiniones, comentarios y valoraciones: expresiones que distinguen la opinión personal",
          "Función e impacto de la publicidad en la sociedad",
          "Exageración de las cualidades del producto",
        ],
      },
    ],
  },
  {
    nombre: "Habilidad Verbal", icono: "🔤", color: "purple",
    subtemas: [
      {
        titulo: "Comprensión de lectura",
        contenido: [
          "Reconocer información explícita",
          "Inferir hechos",
          "Identificar el resumen que contiene las ideas principales",
          "Completar un cuadro sinóptico con los conceptos principales",
          "Identificar la conclusión",
          "Identificar la secuencia de acontecimientos",
          "Reconocer distintos tipos de relaciones: causa-consecuencia, oposición-semejanza, general-particular, ejemplificativas, explicativas, comparativas, analógicas, cronológicas",
          "Distinguir entre hechos y opiniones",
          "Identificar la idea principal y las ideas secundarias",
          "Reconocer el significado de palabras de acuerdo al contexto o campo semántico",
        ],
      },
      {
        titulo: "Manejo de vocabulario",
        contenido: [
          "Establecer analogías entre palabras",
          "Distinguir palabras y expresiones con significado opuesto",
          "Distinguir palabras y expresiones con significado similar",
        ],
      },
    ],
  },

  /* ── SABERES Y PENSAMIENTO CIENTÍFICO ──────────────────────────── */
  {
    nombre: "Matemáticas", icono: "🔢", color: "blue",
    subtemas: [
      {
        titulo: "Significado y uso de los números",
        contenido: [
          "Significado y uso de las operaciones básicas con números enteros",
          "Resolución de problemas con operaciones básicas",
          "Relaciones de proporcionalidad",
          "Significado y uso de las operaciones básicas con números fraccionarios y decimales",
          "Porcentajes",
          "Potenciación y radicación",
          "Resolución de problemas con números fraccionarios o decimales",
        ],
      },
      {
        titulo: "Álgebra",
        contenido: [
          "Significado y uso de las literales",
          "Expresión común de problemas algebraicos de adición y sustracción",
          "Resolución de problemas con expresiones algebraicas",
          "Resolución de ecuaciones de primer grado",
          "Resolución de problemas con ecuaciones de primer grado",
          "Resolución de sistemas lineales de dos ecuaciones con dos incógnitas",
          "Resolución de problemas con sistemas de dos ecuaciones lineales con dos incógnitas",
          "Productos notables y factorización",
          "Resolución de ecuaciones de segundo grado",
          "Relaciones de proporcionalidad directa",
          "Relaciones de proporcionalidad en el plano cartesiano",
        ],
      },
      {
        titulo: "Manejo de la información estadística",
        contenido: [
          "Análisis de la información estadística: índices",
          "Gráficas de barras y circulares",
          "Tablas de frecuencia absoluta y relativa",
          "Medidas de tendencia central",
          "Nociones de probabilidad y muestreo",
        ],
      },
      {
        titulo: "Formas geométricas",
        contenido: [
          "Rectas y ángulos",
          "Figuras planas",
          "Semejanza de triángulos",
          "Teorema de Pitágoras",
          "Razones trigonométricas",
          "Cálculo de perímetros",
          "Cálculo de áreas",
          "Cálculo de volúmenes",
        ],
      },
    ],
  },
  {
    nombre: "Habilidad Matemática", icono: "🧩", color: "indigo",
    subtemas: [
      {
        titulo: "Habilidad Matemática",
        contenido: [
          "Sucesiones numéricas",
          "Series espaciales",
          "Imaginación espacial",
          "Problemas de razonamiento",
        ],
      },
    ],
  },
  {
    nombre: "Biología", icono: "🧬", color: "emerald",
    subtemas: [
      {
        titulo: "El valor de la biodiversidad",
        contenido: [
          "Características comunes de los seres vivos",
          "Aportaciones de Darwin para explicar la evolución de los seres vivos",
          "Relación entre adaptación y selección natural",
          "Características y factores de riesgo de la biodiversidad en México",
          "Importancia de la conservación de los ecosistemas",
          "Equidad en el aprovechamiento presente y futuro de los recursos: el desarrollo sustentable",
        ],
      },
      {
        titulo: "Tecnología y sociedad",
        contenido: [
          "Ciencia y tecnología en la interacción ser humano-naturaleza",
        ],
      },
      {
        titulo: "Transformación de materia y energía",
        contenido: [
          "La fotosíntesis como proceso de transformación de energía y como base de las cadenas alimenticias",
          "Respiración celular",
          "Respiración aerobia y anaerobia",
          "Fotosíntesis y respiración en el ciclo del carbono",
          "Organismos autótrofos y heterótrofos",
        ],
      },
      {
        titulo: "Nutrición y respiración para el cuidado de la salud",
        contenido: [
          "Importancia de la alimentación correcta en la salud: dieta equilibrada, completa e higiénica",
          "Prevención de enfermedades relacionadas con la nutrición",
          "Principales causas y consecuencias de la contaminación de la atmósfera y del calentamiento global",
          "Prevención de enfermedades respiratorias",
        ],
      },
      {
        titulo: "Reproducción y sexualidad",
        contenido: [
          "Características generales de la división celular por mitosis y meiosis",
          "Reproducción sexual y asexual",
          "Salud reproductiva y anticonceptivos",
          "Enfermedades de transmisión sexual: agentes causales, principales síntomas y medidas de prevención",
        ],
      },
      {
        titulo: "Genética, tecnología y sociedad",
        contenido: [
          "Fenotipo, genotipo, cromosomas y genes",
          "Métodos, beneficios y riesgos de la manipulación genética",
        ],
      },
    ],
  },
  {
    nombre: "Física", icono: "⚡", color: "cyan",
    subtemas: [
      {
        titulo: "El movimiento. La descripción de los cambios en la naturaleza",
        contenido: [
          "Conceptos de velocidad y rapidez",
          "Tipos de movimientos de los objetos en gráficas de posición-tiempo",
          "Relación entre gráficas posición-tiempo y un conjunto de datos",
          "Velocidad, desplazamiento y tiempo",
          "El movimiento con velocidad variable: la aceleración",
          "El movimiento de los cuerpos que caen",
        ],
      },
      {
        titulo: "Las fuerzas. La explicación de los cambios",
        contenido: [
          "Fuerza resultante",
          "Las leyes de Newton en la vida cotidiana",
          "Pares de fuerzas",
          "Las fuerzas que actúan sobre los objetos en reposo o movimiento",
          "Ley de Gravitación Universal y el peso de los objetos",
          "La energía y la descripción de las transformaciones",
          "La conservación de la energía mecánica",
          "Cargas eléctricas y formas de electrización",
          "Imanes y magnetismo terrestre",
        ],
      },
      {
        titulo: "Las interacciones de la materia. Un modelo para describir lo que no percibimos",
        contenido: [
          "El modelo cinético de partículas",
          "Calor y temperatura",
          "El modelo de partículas y la presión",
          "La ecuación del principio de Pascal",
          "Principio de conservación de la energía",
        ],
      },
      {
        titulo: "Manifestaciones de la estructura interna de la materia",
        contenido: [
          "Estructura interna de la materia",
          "Capacidad de los materiales para conducir la corriente eléctrica",
          "Campos magnéticos y cargas eléctricas",
          "Experimentos de inducción electromagnética",
          "Características del movimiento ondulatorio",
          "La radiación electromagnética y sus implicaciones tecnológicas",
          "Los prismas y la descomposición de la luz",
          "La refracción de la luz blanca",
          "La luz. Longitud de onda, frecuencia y energía",
        ],
      },
    ],
  },
  {
    nombre: "Química", icono: "🧪", color: "orange",
    subtemas: [
      {
        titulo: "Las características de los materiales",
        contenido: [
          "Características del conocimiento científico: el caso de la Química",
          "Propiedades de los materiales",
          "Cambios físicos y químicos",
          "Propiedades físicas y caracterización de las sustancias",
          "La conservación de la masa en los cambios físicos y químicos",
          "La diversidad de las sustancias y los métodos de separación",
        ],
      },
      {
        titulo: "Estructura y periodicidad de los elementos",
        contenido: [
          "Características de los protones, electrones y neutrones",
          "Número atómico y número de masa",
          "Iones, moléculas y átomos",
          "Estructura de Lewis",
          "Estructura y organización de los elementos en la tabla periódica",
          "Enlace químico",
        ],
      },
      {
        titulo: "La reacción química",
        contenido: [
          "El cambio químico",
          "La ecuación química: su interpretación",
          "El mol como unidad de medida",
          "Ácidos y bases importantes en nuestra vida cotidiana",
          "Las reacciones redox",
        ],
      },
    ],
  },

  /* ── ÉTICA, NATURALEZA Y SOCIEDAD ──────────────────────────────── */
  {
    nombre: "Historia", icono: "📜", color: "red",
    subtemas: [
      {
        titulo: "De principios del siglo XVI a principios del siglo XVIII",
        contenido: [
          "El contexto mundial: las demandas europeas y la necesidad de abrir nuevas rutas",
          "Renovación cultural y resistencia en Europa: el humanismo y sus expresiones filosóficas, literarias y políticas",
          "Expediciones marítimas y conquistas (costas de África, India, Indonesia y América)",
        ],
      },
      {
        titulo: "De mediados del siglo XVIII a mediados del siglo XIX",
        contenido: [
          "Las nuevas ideas: la ilustración y la enciclopedia",
          "El absolutismo europeo y la reorganización administrativa de los imperios",
          "La independencia de las trece colonias",
          "Causas externas e internas de la Revolución Francesa",
          "Consecuencias de la Revolución Francesa en América Latina y el Caribe",
          "La revolución industrial, ciudades industriales y condiciones laborales y de vida de la clase trabajadora",
        ],
      },
      {
        titulo: "De mediados del siglo XIX a 1920",
        contenido: [
          "Nacionalismo",
          "El imperialismo y su expansión en el mundo",
          "La paz armada y la Primera Guerra Mundial",
          "La paz de Versalles y sus consecuencias",
        ],
      },
      {
        titulo: "El mundo entre 1920 y 1960",
        contenido: [
          "El mundo entre las grandes guerras: socialismo, nacional socialismo y fascismo",
          "La pobreza en el mundo",
          "Avances científicos y tecnológicos y su impacto en la sociedad",
          "La Segunda Guerra Mundial: causas y consecuencias",
          "Etapas de la segunda guerra mundial",
        ],
      },
      {
        titulo: "Décadas recientes",
        contenido: [
          "Características de los bloques capitalista y socialista",
          "Los contrastes sociales y económicos. Globalización económica",
          "El conflicto del Golfo Pérsico",
        ],
      },
      {
        titulo: "Las culturas prehispánicas y la conformación de la Nueva España",
        contenido: [
          "Mesoamérica y sus áreas culturales",
          "El virreinato y la instauración de las audiencias",
          "Las instituciones eclesiásticas. La inquisición",
          "El criollismo",
        ],
      },
      {
        titulo: "Nueva España desde su consolidación hasta la independencia",
        contenido: [
          "El absolutismo ilustrado",
          "El crecimiento de Nueva España: expansión de la minería, la agricultura y ganadería",
          "Desarrollo y consumación de la independencia",
        ],
      },
      {
        titulo: "De la consumación de la Independencia al inicio de la Revolución Mexicana (1821-1911)",
        contenido: [
          "El endeudamiento de México y conflictos con los residentes extranjeros",
          "La guerra con Estados Unidos",
          "La intervención francesa y el imperio",
          "En busca de un sistema político: La Reforma liberal",
          "Los gobiernos de la República Restaurada (positivismo, política anticlerical, incorporación de las leyes de Reforma de 1859 a la Constitución)",
          "Movimientos de oposición al gobierno de Juárez",
          "El Porfiriato. La dictadura como medio para conquistar la paz y sus características",
          "Disidencias, huelgas y represión",
        ],
      },
      {
        titulo: "Instituciones revolucionarias y desarrollo económico (1911-1979)",
        contenido: [
          "La insurrección maderista",
          "Diversidad regional de los movimientos revolucionarios",
          "La Constitución de 1917",
          "Guerra cristera, ejército y organizaciones sociales",
          "Caudillismo, ejército, partido único",
          "Reforma agraria",
          "El contexto internacional: La Segunda Guerra Mundial y su impacto en la economía nacional",
          "Clasicismo, romanticismo y modernismo en México",
        ],
      },
      {
        titulo: "México en la era global (1970-2000)",
        contenido: [
          "Instauración del neoliberalismo",
          "El Tratado de Libre Comercio",
          "La reforma electoral en México y la alternancia en el poder como vía para la democratización",
          "Movimientos sociales desde los años 60 como promotores de la participación ciudadana",
        ],
      },
    ],
  },
  {
    nombre: "Geografía", icono: "🌍", color: "teal",
    subtemas: [
      {
        titulo: "El espacio geográfico y los mapas",
        contenido: [
          "Los componentes naturales, sociales y económicos del espacio geográfico",
          "Categorías de análisis del espacio geográfico: la región, el paisaje, el medio, el territorio y el lugar",
          "Conceptos básicos en el estudio del espacio geográfico (localización, distribución, temporalidad y relación)",
          "Círculos y puntos de la superficie terrestre: paralelos, meridianos y polos; coordenadas geográficas: latitud, longitud y altitud. Husos horarios",
          "Características de los diferentes tipos de representación del espacio geográfico (croquis, planos, mapas, atlas, globo terráqueo, fotografías aéreas, imágenes de satélite y modelos tridimensionales)",
          "Sistemas de Información Geográfica y Sistema de Posicionamiento Global",
          "Los mapas temáticos: naturales, económicos, sociales, culturales y políticos en México",
        ],
      },
      {
        titulo: "Recursos naturales y preservación del ambiente",
        contenido: [
          "Movimientos de rotación y traslación de la Tierra",
          "Tectónica de placas, vulcanismo y sismicidad",
          "Ciclo hidrológico en la distribución de las aguas oceánicas y continentales",
          "Capas de la atmósfera. Elementos y factores del clima",
          "Distribución y clasificación de los climas en el mundo",
          "Biosfera. Relaciones de la litosfera, atmósfera e hidrosfera con la distribución de la vegetación y la fauna",
          "Biodiversidad. Especies endémicas y en peligro de extinción; su preservación",
          "Recursos naturales del suelo, subsuelo, aire y agua. Desarrollo sustentable",
          "Ambiente: deterioro y protección",
          "Políticas y educación ambiental. Ecotecnias y ecoturismo",
        ],
      },
      {
        titulo: "Dinámica de la población y riesgos",
        contenido: [
          "Crecimiento y distribución de la población. Población absoluta, población relativa",
          "Ciudades y medio rural; ubicación, rasgos y principales problemas",
          "Migración de la población: tipos, principales flujos migratorios, efectos económicos, sociales y culturales en los lugares de atracción y expulsión",
          "Riesgos y vulnerabilidad de la población. Factores de riesgo para los asentamientos humanos",
          "Zonas de vulnerabilidad para la población",
        ],
      },
      {
        titulo: "Espacios económicos y desigualdad social",
        contenido: [
          "Regiones agrícolas, ganaderas, forestales, pesqueras y mineras de México y del Mundo",
          "Espacios industriales de México y del Mundo",
          "Flujos comerciales, redes de transportes y comunicaciones de México y del Mundo",
          "Espacios turísticos",
          "Globalización. Organismos económicos internacionales y empresas transnacionales",
          "Principales regiones comerciales y ciudades mundiales",
          "La desigualdad socioeconómica: diferencias en el Índice de Desarrollo Humano de los países centrales, periféricos y semiperiféricos",
        ],
      },
      {
        titulo: "Espacios culturales y políticos",
        contenido: [
          "Diversidad cultural de México y del Mundo: etnias, lenguas, religiones y patrimonio cultural",
          "Globalización cultural. Influencia de la publicidad que trasmiten los medios de comunicación",
          "Multiculturalidad e interculturalidad",
          "Cambios en el mundo por los intereses económicos y políticos",
          "Las fronteras. Zonas de transición y tensión. Espacios internacionales terrestres, aéreos y marítimos",
          "Patrimonio cultural de los mexicanos: zonas arqueológicas, ciudades coloniales, pueblos típicos, monumentos históricos",
          "Espacios de soberanía nacional: terrestre, marítima, insular y aérea",
        ],
      },
    ],
  },
  {
    nombre: "Formación Cívica y Ética", icono: "⚖️", color: "pink",
    subtemas: [
      {
        titulo: "La formación cívica y ética en el desarrollo social y personal",
        contenido: [
          "Características de la naturaleza humana. Capacidad para pensar y juzgar las propias acciones",
          "Libertad para elegir y decidir responsablemente. Condiciones y límites",
          "Características de la autonomía moral. Criterios que justifican acciones y decisiones personales",
          "Conciencia moral individual",
          "La moral se construye con los demás: la empatía y el diálogo para el desarrollo moral",
          "Reglas y tipos de normas en la vida cotidiana. Tipos de normas",
        ],
      },
      {
        titulo: "La dimensión cívica y ética de la convivencia",
        contenido: [
          "Tipos de valores: económicos, estéticos y morales",
        ],
      },
      {
        titulo: "Identidad e interculturalidad para una ciudadanía democrática",
        contenido: [
          "Elementos que intervienen en la conformación de la identidad personal: grupos de pertenencia, tradiciones, costumbres, historias compartidas, instituciones sociales y políticas",
        ],
      },
      {
        titulo: "Los adolescentes y sus contextos de convivencia",
        contenido: [
          "Cambios físicos, sociales y afectivos de la adolescencia",
          "Derechos de los adolescentes",
          "Responsabilidades de los adolescentes en su educación, alimentación, salud, recreación, trabajo y participación social",
          "Situaciones de riesgo para la salud: infecciones de transmisión sexual",
          "Tipos de violencia hacia los adolescentes",
          "Maltrato, abuso y acoso sexual",
          "Capacidad para responder asertivamente ante situaciones de riesgo",
        ],
      },
      {
        titulo: "Principios y valores de la democracia",
        contenido: [
          "Los derechos humanos como fuente de valor: dignidad humana, autonomía, libertad de los individuos, convivencia democrática, respeto a las diferencias culturales y justicia social",
          "Responsabilidades ciudadanas en la democracia",
          "Características de la democracia",
        ],
      },
      {
        titulo: "Participación y ciudadanía democrática",
        contenido: [
          "Componentes del Estado mexicano: población, territorio y gobierno",
          "División de poderes del Estado mexicano",
          "Derechos fundamentales de los ciudadanos en la Constitución Política de los Estados Unidos Mexicanos y su relación con los Derechos Humanos",
          "Mecanismos de representación de los ciudadanos en el gobierno democrático. Partidos políticos",
          "Las obligaciones gubernamentales con los ciudadanos en los niveles federal, estatal y municipal",
          "Retos de la democracia en las sociedades contemporáneas",
          "Participación ciudadana",
        ],
      },
      {
        titulo: "Hacia una ciudadanía informada, comprometida y participativa",
        contenido: [
          "La función social de los medios de comunicación",
        ],
      },
      {
        titulo: "Compromiso con el entorno natural y social",
        contenido: [
          "Importancia de la relación del ser humano con su entorno natural y social",
        ],
      },
      {
        titulo: "Recursos y condiciones para la solución de conflictos sin violencia",
        contenido: [
          "La negociación en la resolución y manejo de conflictos",
        ],
      },
    ],
  },
];
