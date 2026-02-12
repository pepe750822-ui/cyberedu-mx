import { BookOpen, Calculator, Microscope, FlaskConical, Atom, Globe2, MapPin, Landmark, Scale, Brain, GraduationCap } from "lucide-react";

export interface Video {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  duration: string;
}

export interface Area {
  id: string;
  name: string;
  description: string;
  icon: typeof BookOpen;
  gradientClass: string;
  videoCount: number;
  videos: Video[];
}

function cleanTitle(title: string): string {
  return title
    .replace(/[\u{1F600}-\u{1F9FF}\u{2600}-\u{2B55}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2702}-\u{27B0}\u{FE00}-\u{FE0F}\u{200D}\u{20E3}\u{E0020}-\u{E007F}]|🚀|🧠|🎯|🎬|🏭|🌍|📉|💀|🌐|🏛️|⚔️|🔔|💥|🔥|🏙️|📚/gu, "")
    .replace(/\*\*/g, "")
    .replace(/^\s*/, "")
    .trim();
}

function embedUrl(videoId: string): string {
  return `https://www.youtube.com/embed/${videoId}`;
}

export const areas: Area[] = [
  {
    id: "habilidades",
    name: "Habilidad Verbal y Matemática",
    description: "Comprensión lectora, vocabulario, series numéricas, espaciales y razonamiento lógico",
    icon: Brain,
    gradientClass: "area-gradient-1",
    videoCount: 11,
    videos: [
      { id: "hv-0", title: "Introducción BioReto Academy - Estrategia Inteligente ECOEMS 2026", description: "Video introductorio con la estrategia para el examen", videoUrl: embedUrl("KM6df1FB1zM"), duration: "15:00" },
      { id: "hv-1", title: "Habilidad Verbal - Comprensión Lectora (Parte 1)", description: "5 subíndices clave de comprensión lectora", videoUrl: embedUrl("oYErXuJtZQA"), duration: "15:00" },
      { id: "hv-2", title: "Habilidad Verbal - Comprensión Lectora (Parte 2)", description: "5 subíndices avanzados de comprensión lectora", videoUrl: embedUrl("unnsdgKbGTg"), duration: "15:00" },
      { id: "hv-3", title: "Habilidad Verbal - Manejo de Vocabulario (Parte 1)", description: "Analogías, antónimos y sinónimos", videoUrl: embedUrl("hPMZ-LP2V6g"), duration: "15:00" },
      { id: "hv-4", title: "Habilidad Verbal - Manejo de Vocabulario (Parte 2)", description: "Contexto, múltiples significados y expresiones idiomáticas", videoUrl: embedUrl("_Bdi2HpCC5Y"), duration: "15:00" },
      { id: "hv-5", title: "Habilidad Verbal - Integración Total y Aplicación Master", description: "Integración de todos los temas de habilidad verbal", videoUrl: embedUrl("21ckQUi85BU"), duration: "15:00" },
      { id: "hm-1", title: "Habilidad Matemática - Series Numéricas", description: "Series numéricas para ECOEMS", videoUrl: embedUrl("1zhBl3O2xi4"), duration: "15:00" },
      { id: "hm-2", title: "Series Espaciales", description: "Series espaciales IPN/UNAM 2026", videoUrl: embedUrl("7YaFtSciRLA"), duration: "15:00" },
      { id: "hm-3", title: "Imaginación Espacial - Visualización 3D", description: "Visualización 3D para IPN/UNAM", videoUrl: embedUrl("wJ05bGztCmo"), duration: "15:00" },
      { id: "hm-4", title: "Problemas de Razonamiento - Lógica Aplicada", description: "Razonamiento lógico aplicado", videoUrl: embedUrl("WWSIHQYwO3I"), duration: "15:00" },
      { id: "hm-5", title: "Integración Total - Habilidad Matemática", description: "Dominio completo de habilidad matemática", videoUrl: embedUrl("NaHxdPXs9XM"), duration: "15:00" },
    ],
  },
  {
    id: "biologia",
    name: "Biología",
    description: "Seres vivos, biodiversidad, metabolismo, genética y biotecnología",
    icon: Microscope,
    gradientClass: "area-gradient-2",
    videoCount: 7,
    videos: [
      { id: "bio-1", title: "Bases de la Biología - Características de los Seres Vivos", description: "Darwin, adaptación y características de seres vivos", videoUrl: embedUrl("PNShc_2dnYY"), duration: "16:00" },
      { id: "bio-2", title: "Biodiversidad Mexicana - Conservación y Desarrollo Sustentable", description: "Conservación y desarrollo sustentable en México", videoUrl: embedUrl("c7HKPeYonC0"), duration: "16:00" },
      { id: "bio-3", title: "Tecnología y Metabolismo - Fotosíntesis y Respiración Celular", description: "Fotosíntesis y respiración celular", videoUrl: embedUrl("1LxS-uhrojU"), duration: "16:00" },
      { id: "bio-4", title: "Ciclos y Nutrición - Ciclo del Carbono y Alimentación", description: "Ciclo del carbono y alimentación saludable", videoUrl: embedUrl("-wd-aZRR2bw"), duration: "16:00" },
      { id: "bio-5", title: "Salud y Reproducción - Contaminación, Mitosis y Meiosis", description: "Contaminación, mitosis y meiosis", videoUrl: embedUrl("WvH5mItNjtk"), duration: "16:00" },
      { id: "bio-6", title: "Genética y Biotecnología - ADN y Manipulación Genética", description: "ADN, salud reproductiva y manipulación genética", videoUrl: embedUrl("7DE4s-S4B-Q"), duration: "16:00" },
      { id: "bio-7", title: "Integración Total Biología", description: "Dominio completo - 9.4% del examen", videoUrl: embedUrl("hmBcAtn345U"), duration: "16:00" },
    ],
  },
  {
    id: "fisica",
    name: "Física",
    description: "Movimiento, fuerzas, energía, electricidad, ondas y física moderna",
    icon: Atom,
    gradientClass: "area-gradient-3",
    videoCount: 7,
    videos: [
      { id: "fis-1", title: "Introducción a Física - Movimiento, Rapidez y Gráficas", description: "Movimiento, rapidez y gráficas", videoUrl: embedUrl("jjDeYQfSDQQ"), duration: "17:00" },
      { id: "fis-2", title: "Fuerzas y Leyes de Newton - Primera y Segunda Ley", description: "Primera y segunda ley de Newton", videoUrl: embedUrl("6Mtmn6oeCWs"), duration: "17:00" },
      { id: "fis-3", title: "Tercera Ley y Fuerzas Especiales", description: "Acción-reacción, fricción, peso vs masa", videoUrl: embedUrl("5jdwdpAteYc"), duration: "17:00" },
      { id: "fis-4", title: "Energía y Trabajo - Conservación de Energía Mecánica", description: "Conservación de energía mecánica", videoUrl: embedUrl("ZzZ9PA9wObU"), duration: "17:00" },
      { id: "fis-5", title: "Electricidad y Magnetismo", description: "Cargas, imanes e inducción", videoUrl: embedUrl("sPwjVE0f9Ic"), duration: "17:00" },
      { id: "fis-6", title: "Ondas y Luz - Espectro Electromagnético", description: "Espectro electromagnético y comportamiento de la luz", videoUrl: embedUrl("QHCMxDidmmE"), duration: "17:00" },
      { id: "fis-7", title: "Física Moderna - Estructura de la Materia y Energía", description: "Estructura de la materia y energía - video final", videoUrl: embedUrl("VffgSWI-1rg"), duration: "17:00" },
    ],
  },
  {
    id: "quimica",
    name: "Química",
    description: "Materia, estructura atómica, tabla periódica, enlaces y reacciones",
    icon: FlaskConical,
    gradientClass: "area-gradient-4",
    videoCount: 6,
    videos: [
      { id: "qui-1", title: "Introducción a Química - Materia y Propiedades", description: "Materia y propiedades", videoUrl: embedUrl("-2vahWbrugo"), duration: "14:00" },
      { id: "qui-2", title: "Estructura Atómica", description: "Protones, neutrones y electrones", videoUrl: embedUrl("7tGsjbjJSG8"), duration: "14:00" },
      { id: "qui-3", title: "Tabla Periódica y Estructura de Lewis", description: "Organización de elementos", videoUrl: embedUrl("x-xAtdB8Lm8"), duration: "14:00" },
      { id: "qui-4", title: "Enlaces Químicos", description: "Iónico, covalente y metálico", videoUrl: embedUrl("YkHJcAaxJzE"), duration: "14:00" },
      { id: "qui-5", title: "Reacciones Químicas - Ecuaciones y Balanceo", description: "Ecuaciones, balanceo y el mol", videoUrl: embedUrl("KHGmJzQ8R5Q"), duration: "14:00" },
      { id: "qui-6", title: "Ácidos, Bases y Reacciones Redox", description: "Química completa - video final", videoUrl: embedUrl("JHIN2On3bdA"), duration: "14:00" },
    ],
  },
  {
    id: "matematicas",
    name: "Matemáticas",
    description: "Aritmética, álgebra, ecuaciones, estadística, probabilidad y geometría",
    icon: Calculator,
    gradientClass: "area-gradient-5",
    videoCount: 14,
    videos: [
      { id: "mat-1", title: "Números Enteros y Operaciones", description: "Introducción a matemáticas", videoUrl: embedUrl("qC1rqGgkwWQ"), duration: "18:00" },
      { id: "mat-2", title: "Números Fraccionarios y Decimales", description: "Proporciones y porcentajes", videoUrl: embedUrl("FBKR5z2bUzk"), duration: "18:00" },
      { id: "mat-3", title: "Introducción al Álgebra", description: "Variables y expresiones", videoUrl: embedUrl("E7TUTIMwuT8"), duration: "18:00" },
      { id: "mat-4", title: "Ecuaciones de Primer Grado", description: "Resolución y aplicaciones", videoUrl: embedUrl("hd1oUkZMyr8"), duration: "18:00" },
      { id: "mat-5", title: "Sistemas de Ecuaciones", description: "Temas 2.6-2.7", videoUrl: embedUrl("nogbTAffFdQ"), duration: "18:00" },
      { id: "mat-6", title: "Ecuaciones Cuadráticas", description: "Temas 2.8-2.9", videoUrl: embedUrl("Z0Y8CJGo3SE"), duration: "18:00" },
      { id: "mat-7", title: "Proporcionalidad", description: "Temas 2.10-2.11", videoUrl: embedUrl("kEQg9h0hHGo"), duration: "18:00" },
      { id: "mat-8", title: "Estadística Descriptiva", description: "Temas 3.1-3.4", videoUrl: embedUrl("uy7CVfmrCCQ"), duration: "18:00" },
      { id: "mat-9", title: "Probabilidad Básica", description: "Tema 3.5", videoUrl: embedUrl("rgKK-p_jkaY"), duration: "18:00" },
      { id: "mat-10", title: "Elementos Básicos de Geometría", description: "Temas 4.1-4.2", videoUrl: embedUrl("aOPS5KjNQFA"), duration: "18:00" },
      { id: "mat-11", title: "Semejanza y Teorema de Pitágoras", description: "Temas 4.3-4.4", videoUrl: embedUrl("YwUdkAoCg2w"), duration: "18:00" },
      { id: "mat-12", title: "Razones Trigonométricas", description: "Tema 4.5", videoUrl: embedUrl("H3ccNEXQWrI"), duration: "18:00" },
      { id: "mat-13", title: "Perímetros y Áreas", description: "Temas 4.6-4.7", videoUrl: embedUrl("l6RQc8z24Ok"), duration: "18:00" },
      { id: "mat-14", title: "Volúmenes", description: "Tema 4.8", videoUrl: embedUrl("0bhlwTC1zd4"), duration: "18:00" },
    ],
  },
  {
    id: "historia-universal",
    name: "Historia Universal",
    description: "Renacimiento, revoluciones, guerras mundiales y globalización",
    icon: Globe2,
    gradientClass: "area-gradient-6",
    videoCount: 7,
    videos: [
      { id: "hu-1", title: "Renacimiento y Descubrimientos", description: "Historia Universal 1", videoUrl: embedUrl("fBJxRhLBEbw"), duration: "20:00" },
      { id: "hu-2", title: "Ilustración y Revoluciones Políticas", description: "La chispa que cambió al mundo", videoUrl: embedUrl("3dXHHGukAKA"), duration: "20:00" },
      { id: "hu-3", title: "Revolución Industrial", description: "La fábrica que inventó el mundo moderno", videoUrl: embedUrl("VpHA5cRhqnE"), duration: "20:00" },
      { id: "hu-4", title: "Imperialismo y Primera Guerra Mundial", description: "El reparto del mundo y la guerra que lo destruyó", videoUrl: embedUrl("EjGVNmmy07c"), duration: "20:00" },
      { id: "hu-5", title: "Período de Entreguerras", description: "Crisis, dictaduras y el camino a la 2GM", videoUrl: embedUrl("ZJ219sADVP4"), duration: "20:00" },
      { id: "hu-6", title: "Segunda Guerra Mundial", description: "Holocausto, bombas atómicas y el nuevo orden", videoUrl: embedUrl("TAx2__R7S3E"), duration: "20:00" },
      { id: "hu-7", title: "Guerra Fría y Globalización", description: "Del miedo nuclear al mundo conectado", videoUrl: embedUrl("nFpU-4HubIQ"), duration: "20:00" },
    ],
  },
  {
    id: "historia-mexico",
    name: "Historia de México",
    description: "Época prehispánica, conquista, independencia, revolución y México contemporáneo",
    icon: Landmark,
    gradientClass: "area-gradient-7",
    videoCount: 7,
    videos: [
      { id: "hm-mx-1", title: "Culturas Prehispánicas", description: "El México que ya era grande", videoUrl: embedUrl("i624x_P0nFE"), duration: "19:00" },
      { id: "hm-mx-2", title: "Conquista de México", description: "El encuentro que nos dio rostro", videoUrl: embedUrl("gYaNWsMePSI"), duration: "19:00" },
      { id: "hm-mx-3", title: "Virreinato de Nueva España", description: "Los 300 años que moldearon a México", videoUrl: embedUrl("HRTQQ-Bw1SU"), duration: "19:00" },
      { id: "hm-mx-4", title: "Independencia de México", description: "Del Grito de Dolores al Imperio de Iturbide", videoUrl: embedUrl("T2Dx4S9oHis"), duration: "19:00" },
      { id: "hm-mx-5", title: "México Siglo XIX", description: "Caudillos, guerras y la pérdida del territorio", videoUrl: embedUrl("JtwPBC9fM4U"), duration: "19:00" },
      { id: "hm-mx-6", title: "Revolución Mexicana", description: "Tierra, libertad y la Constitución de 1917", videoUrl: embedUrl("puhli0gtaK0"), duration: "19:00" },
      { id: "hm-mx-7", title: "México Contemporáneo", description: "Del PRI al Siglo XXI - último video", videoUrl: embedUrl("FzUlr0NAfXc"), duration: "19:00" },
    ],
  },
  {
    id: "espanol",
    name: "Español",
    description: "Fichas bibliográficas, coherencia, textos informativos, literarios y redacción",
    icon: BookOpen,
    gradientClass: "area-gradient-8",
    videoCount: 10,
    videos: [
      { id: "esp-1", title: "Fundamentos - Fichas Bibliográficas y Organización", description: "Fichas bibliográficas y organización de textos", videoUrl: embedUrl("7ACfZZHdGuY"), duration: "15:00" },
      { id: "esp-2", title: "Coherencia y Cohesión I - Los Nexos", description: "Los nexos que unen las ideas", videoUrl: embedUrl("s4DR_-Xjgkw"), duration: "15:00" },
      { id: "esp-3", title: "Coherencia y Cohesión II - Gramática y Puntuación", description: "Gramática y puntuación", videoUrl: embedUrl("ZAXHMuKrl-0"), duration: "15:00" },
      { id: "esp-4", title: "Análisis de Textos Informativos", description: "Textos informativos", videoUrl: embedUrl("5PszNNXWS-4"), duration: "15:00" },
      { id: "esp-5", title: "Análisis de Textos Publicitarios", description: "Textos publicitarios", videoUrl: embedUrl("oh-l3pM6IFY"), duration: "15:00" },
      { id: "esp-6", title: "Textos Literarios I: Narrativa", description: "Análisis de narrativa", videoUrl: embedUrl("iP3kDIbLCEQ"), duration: "15:00" },
      { id: "esp-7", title: "Textos Literarios II: Lírica y Dramática", description: "Lírica y dramática", videoUrl: embedUrl("FdmaCoplNtM"), duration: "15:00" },
      { id: "esp-8", title: "Ortografía Estratégica", description: "Ortografía para el examen", videoUrl: embedUrl("kAezmJqlwhk"), duration: "15:00" },
      { id: "esp-9", title: "Redacción Efectiva", description: "Técnicas de redacción", videoUrl: embedUrl("B6Xn0Z0fyog"), duration: "15:00" },
      { id: "esp-10", title: "Integración Total Español", description: "Repaso integral de español", videoUrl: embedUrl("kGH71ofIxHo"), duration: "15:00" },
    ],
  },
  {
    id: "formacion-civica",
    name: "Formación Cívica y Ética",
    description: "Interculturalidad, adolescencia, estado mexicano, democracia y derechos humanos",
    icon: Scale,
    gradientClass: "area-gradient-9",
    videoCount: 8,
    videos: [
      { id: "fce-1", title: "Fundamentos Personales e Interculturalidad", description: "Fundamentos personales e interculturalidad", videoUrl: embedUrl("gPxrb-2wdvE"), duration: "13:00" },
      { id: "fce-2", title: "Adolescencia y Sociedad", description: "Adolescencia y sociedad", videoUrl: embedUrl("aP7lIQwUHC8"), duration: "13:00" },
      { id: "fce-3", title: "El Estado Mexicano", description: "Estructura del estado mexicano", videoUrl: embedUrl("7wP0HgI-qNU"), duration: "13:00" },
      { id: "fce-4", title: "Democracia y Derechos Humanos", description: "Democracia y derechos humanos", videoUrl: embedUrl("WNdLZdYbWTE"), duration: "13:00" },
      { id: "fce-5", title: "Sistema de Partidos y Elecciones", description: "Sistema de partidos y elecciones", videoUrl: embedUrl("QZfSMvenfY8"), duration: "13:00" },
      { id: "fce-6", title: "Organizaciones de la Sociedad Civil", description: "Organizaciones de la sociedad civil", videoUrl: embedUrl("4FblgME3GgU"), duration: "13:00" },
      { id: "fce-7", title: "Medios de Comunicación y Opinión Pública", description: "Medios de comunicación y opinión pública", videoUrl: embedUrl("1AC6fWb3CQU"), duration: "13:00" },
      { id: "fce-8", title: "Corrupción y Transparencia", description: "Corrupción y transparencia", videoUrl: embedUrl("mP2kyiaA8W0"), duration: "13:00" },
    ],
  },
  {
    id: "geografia",
    name: "Geografía",
    description: "Espacio geográfico, recursos naturales, población, economía y cultura",
    icon: MapPin,
    gradientClass: "area-gradient-10",
    videoCount: 10,
    videos: [
      { id: "geo-1", title: "El Espacio Geográfico y los Mapas", description: "Espacio geográfico y mapas", videoUrl: embedUrl("px5h6XUA8WU"), duration: "15:00" },
      { id: "geo-2", title: "Recursos Naturales y Preservación (Parte 1)", description: "Recursos naturales y preservación", videoUrl: embedUrl("sipi5K6KS70"), duration: "15:00" },
      { id: "geo-3", title: "Biosfera y Biodiversidad", description: "Biosfera y biodiversidad", videoUrl: embedUrl("H32qpwBURCQ"), duration: "15:00" },
      { id: "geo-4", title: "Desarrollo Sustentable y Políticas Ambientales", description: "Desarrollo sustentable y políticas ambientales", videoUrl: embedUrl("pC__ISdmNeI"), duration: "15:00" },
      { id: "geo-5", title: "Población y Migración", description: "La humanidad en movimiento", videoUrl: embedUrl("fK6LqcZVLlE"), duration: "15:00" },
      { id: "geo-6", title: "Vulnerabilidad y Resiliencia", description: "Vivir en zona de riesgo", videoUrl: embedUrl("qwVePjEM7U4"), duration: "15:00" },
      { id: "geo-7", title: "Economía Global: Producción y Comercio", description: "Producción, comercio y desigualdad", videoUrl: embedUrl("l6X8_PQwOeU"), duration: "15:00" },
      { id: "geo-8", title: "El Mundo Desigual: IDH y Ciudades Globales", description: "IDH, regiones y ciudades globales", videoUrl: embedUrl("iKLqy3qtyQM"), duration: "15:00" },
      { id: "geo-9", title: "Cultura, Identidad y Fronteras", description: "Cultura, identidad y fronteras en un mundo global", videoUrl: embedUrl("oXKMuvw-RsQ"), duration: "15:00" },
      { id: "geo-10", title: "Patrimonio y Soberanía", description: "Lo que nos une como nación", videoUrl: embedUrl("akYP7VgIgcs"), duration: "15:00" },
    ],
  },
  {
    id: "repaso-final",
    name: "Repaso Final y Estrategias",
    description: "Repasos estratégicos integrales y preparación final para el examen",
    icon: GraduationCap,
    gradientClass: "area-gradient-1",
    videoCount: 4,
    videos: [
      { id: "rep-1", title: "Repaso Estratégico I - Ciencias y Matemáticas", description: "Repaso integrado de ciencias y matemáticas", videoUrl: embedUrl("LtqhmqTaTsA"), duration: "20:00" },
      { id: "rep-2", title: "Repaso Estratégico II - Historia y Ciencias Sociales", description: "Repaso integrado de historia y ciencias sociales", videoUrl: embedUrl("0OemrN0HDPY"), duration: "20:00" },
      { id: "rep-3", title: "Estrategias Finales - Examen en Línea ECOEMS", description: "Estrategias para el examen en línea", videoUrl: embedUrl("WzFt5YptF7U"), duration: "20:00" },
      { id: "rep-4", title: "Cierre Total - Tu Puente Hacia el Bachillerato", description: "Video final de cierre", videoUrl: embedUrl("ihwKfgVyigc"), duration: "20:00" },
    ],
  },
];
