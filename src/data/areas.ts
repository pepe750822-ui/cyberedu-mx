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
      { id: "hv-0", title: "Introducción BioReto Academy - Estrategia Inteligente ECOEMS 2026", description: "Video introductorio con la estrategia para el examen", videoUrl: embedUrl("KM6df1FB1zM"), duration: "5:00" },
      { id: "hv-1", title: "Habilidad Verbal - Comprensión Lectora (Parte 1)", description: "Comprensión de lectura. (Temario 1.1-1.10)", videoUrl: embedUrl("oYErXuJtZQA"), duration: "5:00" },
      { id: "hv-2", title: "Habilidad Verbal - Comprensión Lectora (Parte 2)", description: "Comprensión de lectura parte 2. (Temario 1.1-1.10)", videoUrl: embedUrl("unnsdgKbGTg"), duration: "5:00" },
      { id: "hv-3", title: "Habilidad Verbal - Manejo de Vocabulario (Parte 1)", description: "Manejo de vocabulario. (Temario 2.1)", videoUrl: embedUrl("hPMZ-LP2V6g"), duration: "5:00" },
      { id: "hv-4", title: "Habilidad Verbal - Manejo de Vocabulario (Parte 2)", description: "Vocabulario parte 2. (Temario 2.2-2.3)", videoUrl: embedUrl("_Bdi2HpCC5Y"), duration: "5:00" },
      { id: "hv-5", title: "Habilidad Verbal - Integración Total y Aplicación Master", description: "Integración de todos los temas de habilidad verbal. (Temario 2.4)", videoUrl: embedUrl("21ckQUi85BU"), duration: "5:00" },
      { id: "hm-1", title: "Habilidad Matemática - Series Numéricas", description: "Sucesiones numéricas. (Temario 1)", videoUrl: embedUrl("1zhBl3O2xi4"), duration: "5:00" },
      { id: "hm-2", title: "Series Espaciales", description: "Series espaciales. (Temario 2)", videoUrl: embedUrl("7YaFtSciRLA"), duration: "5:00" },
      { id: "hm-3", title: "Imaginación Espacial - Visualización 3D", description: "Imaginación espacial. (Temario 3)", videoUrl: embedUrl("wJ05bGztCmo"), duration: "5:00" },
      { id: "hm-4", title: "Problemas de Razonamiento - Lógica Aplicada", description: "Problemas de razonamiento. (Temario 4)", videoUrl: embedUrl("2q4x6XUe8WU"), duration: "5:00" },
      { id: "hm-5", title: "Integración Total - Habilidad Matemática", description: "Repaso integral de razonamiento. (Temario 5)", videoUrl: embedUrl("K7D1XU8_3uA"), duration: "5:00" },
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
      { id: "bio-1", title: "Bases de la Biología - Características de los Seres Vivos", description: "El valor de la biodiversidad. (Temario 1.1-1.6)", videoUrl: embedUrl("PNShc_2dnYY"), duration: "5:00" },
      { id: "bio-2", title: "Biodiversidad Mexicana - Conservación y Desarrollo Sustentable", description: "Biodiversidad mexicana. (Temario 1.4-1.6)", videoUrl: embedUrl("c7HKPeYonC0"), duration: "5:00" },
      { id: "bio-3", title: "Tecnología y Metabolismo - Fotosíntesis y Respiración Celular", description: "Fotosíntesis y respiración celular. (Temario 3.1-3.5)", videoUrl: embedUrl("1LxS-uhrojU"), duration: "5:00" },
      { id: "bio-4", title: "Ciclos y Nutrición - Ciclo del Carbono y Alimentación", description: "Ciclo del carbono y nutrición. (Temario 3.4-4.1)", videoUrl: embedUrl("-wd-aZRR2bw"), duration: "5:00" },
      { id: "bio-5", title: "Salud y Reproducción - Contaminación, Mitosis y Meiosis", description: "Contaminación, mitosis y meiosis. (Temario 4.3-5.4)", videoUrl: embedUrl("WvH5mItNjtk"), duration: "5:00" },
      { id: "bio-6", title: "Genética y Biotecnología - ADN y Manipulación Genética", description: "Genética y biotecnología. (Temario 6.1-6.2)", videoUrl: embedUrl("7DE4s-S4B-Q"), duration: "5:00" },
      { id: "bio-7", title: "Integración Total Biología", description: "Dominio completo Biología. (Temario 7.1)", videoUrl: embedUrl("hmBcAtn345U"), duration: "5:00" },
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
      { id: "fis-1", title: "Introducción a Física - Movimiento, Rapidez y Gráficas", description: "Movimiento y rapidez. (Temario 6.1)", videoUrl: embedUrl("jjDeYQfSDQQ"), duration: "5:00" },
      { id: "fis-2", title: "Fuerzas y Leyes de Newton - Primera y Segunda Ley", description: "Leyes de Newton. (Temario 6.1)", videoUrl: embedUrl("6Mtmn6oeCWs"), duration: "5:00" },
      { id: "fis-3", title: "Tercera Ley y Fuerzas Especiales", description: "Fuerzas especiales. (Temario 6.1)", videoUrl: embedUrl("5jdwdpAteYc"), duration: "5:00" },
      { id: "fis-4", title: "Energía y Trabajo - Conservación de Energía Mecánica", description: "Energía y trabajo. (Temario 6.1)", videoUrl: embedUrl("ZzZ9PA9wObU"), duration: "5:00" },
      { id: "fis-5", title: "Electricidad y Magnetismo", description: "Electricidad y Magnetismo. (Temario 6.2)", videoUrl: embedUrl("sPwjVE0f9Ic"), duration: "5:00" },
      { id: "fis-6", title: "Ondas y Luz - Espectro Electromagnético", description: "Ondas y luz. (Temario 6.2)", videoUrl: embedUrl("QHCMxDidmmE"), duration: "5:00" },
      { id: "fis-7", title: "Física Moderna - Estructura de la Materia y Energía", description: "Estructura de la materia. (Temario 6.3)", videoUrl: embedUrl("VffgSWI-1rg"), duration: "5:00" },
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
      { id: "qui-1", title: "Introducción a Química - Materia y Propiedades", description: "Materia y propiedades. (Temario 7.1)", videoUrl: embedUrl("-2vahWbrugo"), duration: "5:00" },
      { id: "qui-2", title: "Estructura Atómica", description: "Estructura Atómica. (Temario 7.1)", videoUrl: embedUrl("7tGsjbjJSG8"), duration: "5:00" },
      { id: "qui-3", title: "Tabla Periódica y Estructura de Lewis", description: "Tabla Periódica. (Temario 7.2)", videoUrl: embedUrl("x-xAtdB8Lm8"), duration: "5:00" },
      { id: "qui-4", title: "Enlaces Químicos", description: "Enlaces Químicos. (Temario 7.2)", videoUrl: embedUrl("YkHJcAaxJzE"), duration: "5:00" },
      { id: "qui-5", title: "Reacciones Químicas - Ecuaciones y Balanceo", description: "Reacciones Químicas. (Temario 7.2)", videoUrl: embedUrl("KHGmJzQ8R5Q"), duration: "5:00" },
      { id: "qui-6", title: "Ácidos, Bases y Reacciones Redox", description: "Redox y Ácidos. (Temario 7.2)", videoUrl: embedUrl("JHIN2On3bdA"), duration: "5:00" },
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
      { id: "mat-1", title: "Números Enteros y Operaciones", description: "Números Enteros y Operaciones. (Temario 4.1)", videoUrl: embedUrl("qC1rqGgkwWQ"), duration: "5:00" },
      { id: "mat-2", title: "Números Fraccionarios y Decimales", description: "Números Fraccionarios y Decimales. (Temario 4.1)", videoUrl: embedUrl("FBKR5z2bUzk"), duration: "5:00" },
      { id: "mat-3", title: "Introducción al Álgebra", description: "Introducción al Álgebra. (Temario 4.2)", videoUrl: embedUrl("E7TUTIMwuT8"), duration: "5:00" },
      { id: "mat-4", title: "Ecuaciones de Primer Grado", description: "Ecuaciones de Primer Grado. (Temario 4.2)", videoUrl: embedUrl("hd1oUkZMyr8"), duration: "5:00" },
      { id: "mat-5", title: "Sistemas de Ecuaciones", description: "Sistemas de Ecuaciones. (Temario 4.2)", videoUrl: embedUrl("nogbTAffFdQ"), duration: "5:00" },
      { id: "mat-6", title: "Ecuaciones Cuadráticas", description: "Ecuaciones Cuadráticas. (Temario 4.2)", videoUrl: embedUrl("Z0Y8CJGo3SE"), duration: "5:00" },
      { id: "mat-7", title: "Proporcionalidad", description: "Proporcionalidad. (Temario 4.2)", videoUrl: embedUrl("kEQg9h0hHGo"), duration: "5:00" },
      { id: "mat-8", title: "Estadística Descriptiva", description: "Estadística. (Temario 4.5)", videoUrl: embedUrl("uy7CVfmrCCQ"), duration: "5:00" },
      { id: "mat-9", title: "Probabilidad Básica", description: "Probabilidad. (Temario 4.5)", videoUrl: embedUrl("rgKK-p_jkaY"), duration: "5:00" },
      { id: "mat-10", title: "Elementos Básicos de Geometría", description: "Geometría Básica. (Temario 4.3)", videoUrl: embedUrl("aOPS5KjNQFA"), duration: "5:00" },
      { id: "mat-11", title: "Semejanza y Teorema de Pitágoras", description: "Pitágoras y Semejanza. (Temario 4.3)", videoUrl: embedUrl("YwUdkAoCg2w"), duration: "5:00" },
      { id: "mat-12", title: "Razones Trigonométricas", description: "Razones trigonométricas. (Temario 4.4)", videoUrl: embedUrl("H3ccNEXQWrI"), duration: "5:00" },
      { id: "mat-13", title: "Perímetros y Áreas", description: "Perímetros y áreas. (Temario 4.3)", videoUrl: embedUrl("l6RQc8z24Ok"), duration: "5:00" },
      { id: "mat-14", title: "Volúmenes", description: "Volúmenes. (Temario 4.3)", videoUrl: embedUrl("0bhlwTC1zd4"), duration: "5:00" },
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
      { id: "hu-1", title: "Renacimiento y Descubrimientos", description: "Renacimiento y Descubrimientos. (Temario 1.1-1.3)", videoUrl: embedUrl("fBJxRhLBEbw"), duration: "5:00" },
      { id: "hu-2", title: "Ilustración y Revoluciones Políticas", description: "Ilustración y Revoluciones. (Temario 2.1-2.6)", videoUrl: embedUrl("3dXHHGukAKA"), duration: "5:00" },
      { id: "hu-3", title: "Revolución Industrial", description: "Revolución Industrial. (Temario 2.6)", videoUrl: embedUrl("VpHA5cRhqnE"), duration: "5:00" },
      { id: "hu-4", title: "Imperialismo y Primera Guerra Mundial", description: "Imperialismo y Primera Guerra Mundial. (Temario 3.1-3.5)", videoUrl: embedUrl("EjGVNmmy07c"), duration: "5:00" },
      { id: "hu-5", title: "Período de Entreguerras", description: "Período de Entreguerras. (Temario 4.1-4.5)", videoUrl: embedUrl("ZJ219sADVP4"), duration: "5:00" },
      { id: "hu-6", title: "Segunda Guerra Mundial", description: "Segunda Guerra Mundial. (Temario 4.3-4.5)", videoUrl: embedUrl("TAx2__R7S3E"), duration: "5:00" },
      { id: "hu-7", title: "Guerra Fría y Globalización", description: "Guerra Fría y Globalización. (Temario 5.1-5.5)", videoUrl: embedUrl("nFpU-4HubIQ"), duration: "5:00" },
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
      { id: "hm-mx-1", title: "Culturas Prehispánicas", description: "Culturas Prehispánicas. (Temario 8.2)", videoUrl: embedUrl("i624x_P0nFE"), duration: "5:00" },
      { id: "hm-mx-2", title: "Conquista de México", description: "Conquista de México. (Temario 8.2)", videoUrl: embedUrl("gYaNWsMePSI"), duration: "5:00" },
      { id: "hm-mx-3", title: "Virreinato de Nueva España", description: "Virreinato. (Temario 8.2)", videoUrl: embedUrl("HRTQQ-Bw1SU"), duration: "5:00" },
      { id: "hm-mx-4", title: "Independencia de México", description: "Independencia. (Temario 8.2)", videoUrl: embedUrl("T2Dx4S9oHis"), duration: "5:00" },
      { id: "hm-mx-5", title: "México Siglo XIX", description: "Siglo XIX. (Temario 8.2)", videoUrl: embedUrl("JtwPBC9fM4U"), duration: "5:00" },
      { id: "hm-mx-6", title: "Revolución Mexicana", description: "Revolución Mexicana. (Temario 8.2)", videoUrl: embedUrl("puhli0gtaK0"), duration: "5:00" },
      { id: "hm-mx-7", title: "México Contemporáneo", description: "México Contemporáneo. (Temario 8.2)", videoUrl: embedUrl("FzUlr0NAfXc"), duration: "5:00" },
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
       { id: "esp-1", title: "Fundamentos - Fichas Bibliográficas y Organización", description: "Fichas bibliográficas. (Temario 1.1)", videoUrl: embedUrl("7ACfZZHdGuY"), duration: "5:00" },
      { id: "esp-2", title: "Coherencia y Cohesión I - Los Nexos", description: "Nexos y coherencia. (Temario 3.1-3.2)", videoUrl: embedUrl("s4DR_-Xjgkw"), duration: "5:00" },
      { id: "esp-3", title: "Coherencia y Cohesión II - Gramática y Puntuación", description: "Gramática y puntuación. (Temario 3.3-3.5)", videoUrl: embedUrl("ZAXHMuKrl-0"), duration: "5:00" },
      { id: "esp-4", title: "Análisis de Textos Informativos", description: "Textos informativos. (Temario 2.1-2.3)", videoUrl: embedUrl("5PszNNXWS-4"), duration: "5:00" },
      { id: "esp-5", title: "Análisis de Textos Publicitarios", description: "Textos publicitarios. (Temario 4.1)", videoUrl: embedUrl("oh-l3pM6IFY"), duration: "5:00" },
      { id: "esp-6", title: "Textos Literarios I: Narrativa", description: "Género dramático y narrativo. (Temario 3.2)", videoUrl: embedUrl("iP3kDIbLCEQ"), duration: "5:00" },
      { id: "esp-7", title: "Textos Literarios II: Lírica y Dramática", description: "Poesía y teatro. (Temario 3.2)", videoUrl: embedUrl("FdmaCoplNtM"), duration: "5:00" },
      { id: "esp-8", title: "Ortografía Estratégica", description: "Reglas ortográficas ECOEMS. (Temario 3.3)", videoUrl: embedUrl("kAezmJqlwhk"), duration: "5:00" },
      { id: "esp-9", title: "Redacción Efectiva", description: "Gramática y redacción. (Temario 3.3)", videoUrl: embedUrl("B6Xn0Z0fyog"), duration: "5:00" },
      { id: "esp-10", title: "Integración Total Español", description: "Organización de información. (Temario 3.4)", videoUrl: embedUrl("kGH71ofIxHo"), duration: "5:00" },
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
      { id: "fce-1", title: "Fundamentos Personales e Interculturalidad", description: "Fundamentos personales. (Temario 1.1-1.6)", videoUrl: embedUrl("gPxrb-2wdvE"), duration: "5:00" },
      { id: "fce-2", title: "Adolescencia y Sociedad", description: "Adolescencia y sociedad. (Temario 4.1-4.7)", videoUrl: embedUrl("aP7lIQwUHC8"), duration: "5:00" },
      { id: "fce-3", title: "El Estado Mexicano", description: "El Estado mexicano. (Temario 6.1-6.3)", videoUrl: embedUrl("7wP0HgI-qNU"), duration: "5:00" },
      { id: "fce-4", title: "Democracia y Derechos Humanos", description: "Democracia y derechos humanos. (Temario 5.1-5.3)", videoUrl: embedUrl("WNdLZdYbWTE"), duration: "5:00" },
      { id: "fce-5", title: "Sistema de Partidos y Elecciones", description: "Sistema de partidos. (Temario 6.4-6.7)", videoUrl: embedUrl("QZfSMvenfY8"), duration: "5:00" },
      { id: "fce-6", title: "Organizaciones de la Sociedad Civil", description: "Organizaciones civiles. (Temario 8.1)", videoUrl: embedUrl("4FblgME3GgU"), duration: "5:00" },
      { id: "fce-7", title: "Medios de Comunicación y Opinión Pública", description: "Medios de comunicación. (Temario 7.1)", videoUrl: embedUrl("1AC6fWb3CQU"), duration: "5:00" },
      { id: "fce-8", title: "Corrupción y Transparencia", description: "Corrupción y transparencia. (Temario 10.8)", videoUrl: embedUrl("mP2kyiaA8W0"), duration: "5:00" },
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
      { id: "geo-1", title: "El Espacio Geográfico y los Mapas", description: "El espacio geográfico y mapas. (Temario 1.1-1.7)", videoUrl: embedUrl("px5h6XUA8WU"), duration: "5:00" },
      { id: "geo-2", title: "Recursos Naturales y Preservación (Parte 1)", description: "Recursos naturales parte 1. (Temario 2.1-2.5)", videoUrl: embedUrl("sipi5K6KS70"), duration: "5:00" },
      { id: "geo-3", title: "Biosfera y Biodiversidad", description: "Biosfera y biodiversidad. (Temario 2.6-2.8)", videoUrl: embedUrl("H32qpwBURCQ"), duration: "5:00" },
      { id: "geo-4", title: "Desarrollo Sustentable y Políticas Ambientales", description: "Desarrollo sustentable. (Temario 2.9-2.10)", videoUrl: embedUrl("pC__ISdmNeI"), duration: "5:00" },
      { id: "geo-5", title: "Población y Migración", description: "Población y migración. (Temario 3.1-3.5)", videoUrl: embedUrl("fK6LqcZVLlE"), duration: "5:00" },
      { id: "geo-6", title: "Vulnerabilidad y Resiliencia", description: "Vulnerabilidad y resiliencia. (Temario 3.4-3.5)", videoUrl: embedUrl("qwVePjEM7U4"), duration: "5:00" },
      { id: "geo-7", title: "Economía Global: Producción y Comercio", description: "Economía global. (Temario 4.1-4.7)", videoUrl: embedUrl("l6X8_PQwOeU"), duration: "5:00" },
      { id: "geo-8", title: "El Mundo Desigual: IDH y Ciudades Globales", description: "IDH y ciudades globales. (Temario 4.7)", videoUrl: embedUrl("iKLqy3qtyQM"), duration: "5:00" },
      { id: "geo-9", title: "Cultura, Identidad y Fronteras", description: "Cultura e identidad. (Temario 5.1-5.7)", videoUrl: embedUrl("oXKMuvw-RsQ"), duration: "5:00" },
      { id: "geo-10", title: "Patrimonio y Soberanía", description: "Patrimonio y soberanía. (Temario 5.6-5.7)", videoUrl: embedUrl("akYP7VgIgcs"), duration: "5:00" },
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
      { id: "rep-1", title: "Repaso Estratégico I - Ciencias y Matemáticas", description: "Repaso integrado de ciencias y matemáticas", videoUrl: embedUrl("LtqhmqTaTsA"), duration: "5:00" },
      { id: "rep-2", title: "Repaso Estratégico II - Historia y Ciencias Sociales", description: "Repaso integrado de historia y ciencias sociales", videoUrl: embedUrl("0OemrN0HDPY"), duration: "5:00" },
      { id: "rep-3", title: "Estrategias Finales - Examen en Línea ECOEMS", description: "Estrategias para el examen en línea", videoUrl: embedUrl("WzFt5YptF7U"), duration: "5:00" },
      { id: "rep-4", title: "Cierre Total - Tu Puente Hacia el Bachillerato", description: "Video final de cierre", videoUrl: embedUrl("ihwKfgVyigc"), duration: "5:00" },
    ],
  },
];
