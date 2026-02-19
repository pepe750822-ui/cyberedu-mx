export interface MaterialVideo {
  videoId: string;
  quiz?: { url: string };
  infografia?: { url: string; descripcion: string };
  pdf?: { url: string; titulo: string };
  podcast?: { url: string; duracion?: string };
}

export const materiales: Record<string, MaterialVideo> = {
  // ============================================
  // VIDEO 0 - PRESENTACIÓN (hv-0)
  // ============================================
  "hv-0": {
    videoId: "hv-0",
    infografia: {
      url: "/videos/video0/infografia.png",
      descripcion: "Infografía: Introducción BioReto Academy - Estrategia Inteligente ECOEMS 2026"
    },
    pdf: {
      url: "/videos/video0/presentacion.pdf",
      titulo: "Guía: Introducción BioReto Academy"
    },
    podcast: {
      url: "/videos/video0/podcast.m4a",
      duracion: "3:00"
    }
  },

  // ============================================
  // HABILIDAD VERBAL (hv-1 a hv-5) - VIDEOS 1-5
  // ============================================
  "hv-1": {
    videoId: "hv-1",
    quiz: { url: "/quiz/video-01-quiz.html" },
    infografia: { url: "/videos/video1/infografia.png", descripcion: "Comprensión Lectora Parte 1" },
    pdf: { url: "/videos/video1/presentacion.pdf", titulo: "Guía: Comprensión Lectora 1" },
    podcast: { url: "/videos/video1/podcast.m4a", duracion: "3:00" }
  },
  "hv-2": {
    videoId: "hv-2",
    quiz: { url: "/quiz/video-02-quiz.html" },
    infografia: { url: "/videos/video2/infografia.png", descripcion: "Comprensión Lectora Parte 2" },
    pdf: { url: "/videos/video2/presentacion.pdf", titulo: "Guía: Comprensión Lectora 2" },
    podcast: { url: "/videos/video2/podcast.m4a", duracion: "3:00" }
  },
  "hv-3": {
    videoId: "hv-3",
    quiz: { url: "/quiz/video-03-quiz.html" },
    infografia: { url: "/videos/video3/infografia.png", descripcion: "Vocabulario Parte 1" },
    pdf: { url: "/videos/video3/presentacion.pdf", titulo: "Guía: Vocabulario 1" },
    podcast: { url: "/videos/video3/podcast.m4a", duracion: "3:00" }
  },
  "hv-4": {
    videoId: "hv-4",
    quiz: { url: "/quiz/video-04-quiz.html" },
    infografia: { url: "/videos/video4/infografia.png", descripcion: "Vocabulario Parte 2" },
    pdf: { url: "/videos/video4/presentacion.pdf", titulo: "Guía: Vocabulario 2" },
    podcast: { url: "/videos/video4/podcast.m4a", duracion: "3:00" }
  },
  "hv-5": {
    videoId: "hv-5",
    quiz: { url: "/quiz/video-05-quiz.html" },
    infografia: { url: "/videos/video5/infografia.png", descripcion: "Integración Habilidad Verbal" },
    pdf: { url: "/videos/video5/presentacion.pdf", titulo: "Guía: Integración HV" },
    podcast: { url: "/videos/video5/podcast.m4a", duracion: "3:00" }
  },

  // ============================================
  // HABILIDAD MATEMÁTICA (hm-1 a hm-5) - VIDEOS 6-10
  // ============================================
  "hm-1": {
    videoId: "hm-1",
    quiz: { url: "/quiz/video-06-quiz.html" },
    infografia: { url: "/videos/video6/infografia.png", descripcion: "Series Numéricas" },
    pdf: { url: "/videos/video6/presentacion.pdf", titulo: "Guía: Series Numéricas" },
    podcast: { url: "/videos/video6/podcast.m4a", duracion: "3:00" }
  },
  "hm-2": {
    videoId: "hm-2",
    infografia: { url: "/videos/video7/infografia.png", descripcion: "Series Espaciales" },
    pdf: { url: "/videos/video7/presentacion.pdf", titulo: "Guía: Series Espaciales" },
    podcast: { url: "/videos/video7/podcast.m4a", duracion: "3:00" }
  },
  "hm-3": {
    videoId: "hm-3",
    infografia: { url: "/videos/video8/infografia.png", descripcion: "Imaginación Espacial" },
    pdf: { url: "/videos/video8/presentacion.pdf", titulo: "Guía: Imaginación Espacial" },
    podcast: { url: "/videos/video8/podcast.m4a", duracion: "3:00" }
  },
  "hm-4": {
    videoId: "hm-4",
    infografia: { url: "/videos/video9/infografia.png", descripcion: "Razonamiento Lógico" },
    pdf: { url: "/videos/video9/presentacion.pdf", titulo: "Guía: Razonamiento" },
    podcast: { url: "/videos/video9/podcast.m4a", duracion: "3:00" }
  },
  "hm-5": {
    videoId: "hm-5",
    infografia: { url: "/videos/video10/infografia.png", descripcion: "Integración HM" },
    pdf: { url: "/videos/video10/presentacion.pdf", titulo: "Guía: Integración HM" },
    podcast: { url: "/videos/video10/podcast.m4a", duracion: "3:00" }
  },

  // ============================================
  // BIOLOGÍA (bio-1 a bio-7) - VIDEOS 11-17
  // ============================================
  "bio-1": {
    videoId: "bio-1",
    infografia: { url: "/videos/video11/infografia.png", descripcion: "Bases de Biología" },
    pdf: { url: "/videos/video11/presentacion.pdf", titulo: "Guía: Biología 1" },
    podcast: { url: "/videos/video11/podcast.m4a", duracion: "3:00" }
  },
  "bio-2": {
    videoId: "bio-2",
    infografia: { url: "/videos/video12/infografia.png", descripcion: "Biodiversidad" },
    pdf: { url: "/videos/video12/presentacion.pdf", titulo: "Guía: Biodiversidad" },
    podcast: { url: "/videos/video12/podcast.m4a", duracion: "3:00" }
  },
  "bio-3": {
    videoId: "bio-3",
    infografia: { url: "/videos/video13/infografia.png", descripcion: "Metabolismo" },
    pdf: { url: "/videos/video13/presentacion.pdf", titulo: "Guía: Metabolismo" },
    podcast: { url: "/videos/video13/podcast.m4a", duracion: "3:00" }
  },
  "bio-4": {
    videoId: "bio-4",
    infografia: { url: "/videos/video14/infografia.png", descripcion: "Ciclos y Nutrición" },
    pdf: { url: "/videos/video14/presentacion.pdf", titulo: "Guía: Ciclos" },
    podcast: { url: "/videos/video14/podcast.m4a", duracion: "3:00" }
  },
  "bio-5": {
    videoId: "bio-5",
    infografia: { url: "/videos/video15/infografia.png", descripcion: "Salud y Reproducción" },
    pdf: { url: "/videos/video15/presentacion.pdf", titulo: "Guía: Salud" },
    podcast: { url: "/videos/video15/podcast.m4a", duracion: "3:00" }
  },
  "bio-6": {
    videoId: "bio-6",
    infografia: { url: "/videos/video16/infografia.png", descripcion: "Genética" },
    pdf: { url: "/videos/video16/presentacion.pdf", titulo: "Guía: Genética" },
    podcast: { url: "/videos/video16/podcast.m4a", duracion: "3:00" }
  },
  "bio-7": {
    videoId: "bio-7",
    infografia: { url: "/videos/video17/infografia.png", descripcion: "Integración Biología" },
    pdf: { url: "/videos/video17/presentacion.pdf", titulo: "Guía: Biología Integral" },
    podcast: { url: "/videos/video17/podcast.m4a", duracion: "3:00" }
  },

  // ============================================
  // FÍSICA (fis-1 a fis-7) - VIDEOS 18-24
  // ============================================
  "fis-1": {
    videoId: "fis-1",
    infografia: { url: "/videos/video18/infografia.png", descripcion: "Introducción a Física" },
    pdf: { url: "/videos/video18/presentacion.pdf", titulo: "Guía: Física 1" },
    podcast: { url: "/videos/video18/podcast.m4a", duracion: "3:00" }
  },
  "fis-2": {
    videoId: "fis-2",
    infografia: { url: "/videos/video19/infografia.png", descripcion: "Leyes de Newton" },
    pdf: { url: "/videos/video19/presentacion.pdf", titulo: "Guía: Leyes de Newton" },
    podcast: { url: "/videos/video19/podcast.m4a", duracion: "3:00" }
  },
  "fis-3": {
    videoId: "fis-3",
    infografia: { url: "/videos/video20/infografia.png", descripcion: "Tercera Ley" },
    pdf: { url: "/videos/video20/presentacion.pdf", titulo: "Guía: Fuerzas" },
    podcast: { url: "/videos/video20/podcast.m4a", duracion: "3:00" }
  },
  "fis-4": {
    videoId: "fis-4",
    infografia: { url: "/videos/video21/infografia.png", descripcion: "Energía y Trabajo" },
    pdf: { url: "/videos/video21/presentacion.pdf", titulo: "Guía: Energía" },
    podcast: { url: "/videos/video21/podcast.m4a", duracion: "3:00" }
  },
  "fis-5": {
    videoId: "fis-5",
    infografia: { url: "/videos/video22/infografia.png", descripcion: "Electricidad" },
    pdf: { url: "/videos/video22/presentacion.pdf", titulo: "Guía: Electricidad" },
    podcast: { url: "/videos/video22/podcast.m4a", duracion: "3:00" }
  },
  "fis-6": {
    videoId: "fis-6",
    infografia: { url: "/videos/video23/infografia.png", descripcion: "Ondas y Luz" },
    pdf: { url: "/videos/video23/presentacion.pdf", titulo: "Guía: Ondas" },
    podcast: { url: "/videos/video23/podcast.m4a", duracion: "3:00" }
  },
  "fis-7": {
    videoId: "fis-7",
    infografia: { url: "/videos/video24/infografia.png", descripcion: "Física Moderna" },
    pdf: { url: "/videos/video24/presentacion.pdf", titulo: "Guía: Física Moderna" },
    podcast: { url: "/videos/video24/podcast.m4a", duracion: "3:00" }
  },

  // ============================================
  // QUÍMICA (qui-1 a qui-6) - VIDEOS 25-30
  // ============================================
  "qui-1": {
    videoId: "qui-1",
    infografia: { url: "/videos/video25/infografia.png", descripcion: "Introducción a Química" },
    pdf: { url: "/videos/video25/presentacion.pdf", titulo: "Guía: Química 1" },
    podcast: { url: "/videos/video25/podcast.m4a", duracion: "3:00" }
  },
  "qui-2": {
    videoId: "qui-2",
    infografia: { url: "/videos/video26/infografia.png", descripcion: "Estructura Atómica" },
    pdf: { url: "/videos/video26/presentacion.pdf", titulo: "Guía: Átomos" },
    podcast: { url: "/videos/video26/podcast.m4a", duracion: "3:00" }
  },
  "qui-3": {
    videoId: "qui-3",
    infografia: { url: "/videos/video27/infografia.png", descripcion: "Tabla Periódica" },
    pdf: { url: "/videos/video27/presentacion.pdf", titulo: "Guía: Tabla Periódica" },
    podcast: { url: "/videos/video27/podcast.m4a", duracion: "3:00" }
  },
  "qui-4": {
    videoId: "qui-4",
    infografia: { url: "/videos/video28/infografia.png", descripcion: "Enlaces Químicos" },
    pdf: { url: "/videos/video28/presentacion.pdf", titulo: "Guía: Enlaces" },
    podcast: { url: "/videos/video28/podcast.m4a", duracion: "3:00" }
  },
  "qui-5": {
    videoId: "qui-5",
    infografia: { url: "/videos/video29/infografia.png", descripcion: "Reacciones Químicas" },
    pdf: { url: "/videos/video29/presentacion.pdf", titulo: "Guía: Reacciones" },
    podcast: { url: "/videos/video29/podcast.mp4", duracion: "3:00" }
  },
  "qui-6": {
    videoId: "qui-6",
    infografia: { url: "/videos/video30/infografia.png", descripcion: "Ácidos y Redox" },
    pdf: { url: "/videos/video30/presentacion.pdf", titulo: "Guía: Ácidos" },
    podcast: { url: "/videos/video30/podcast.mp4", duracion: "3:00" }
  },

  // ============================================
  // MATEMÁTICAS (mat-1 a mat-14) - VIDEOS 31-44
  // ============================================
  "mat-1": {
    videoId: "mat-1",
    infografia: { url: "/videos/video31/infografia.png", descripcion: "Números Enteros" },
    pdf: { url: "/videos/video31/presentacion.pdf", titulo: "Guía: Enteros" },
    podcast: { url: "/videos/video31/podcast.m4a", duracion: "3:00" }
  },
  "mat-2": {
    videoId: "mat-2",
    infografia: { url: "/videos/video32/infografia.png", descripcion: "Fracciones y Decimales" },
    pdf: { url: "/videos/video32/presentacion.pdf", titulo: "Guía: Fracciones" }
  },
  "mat-3": {
    videoId: "mat-3",
    infografia: { url: "/videos/video33/infografia.png", descripcion: "Introducción al Álgebra" },
    pdf: { url: "/videos/video33/presentacion.pdf", titulo: "Guía: Álgebra" }
  },
  "mat-4": {
    videoId: "mat-4",
    infografia: { url: "/videos/video34/infografia.png", descripcion: "Ecuaciones de Primer Grado" },
    pdf: { url: "/videos/video34/presentacion.pdf", titulo: "Guía: Ecuaciones 1" }
  },
  "mat-5": {
    videoId: "mat-5",
    infografia: { url: "/videos/video35/infografia.png", descripcion: "Sistemas de Ecuaciones" },
    pdf: { url: "/videos/video35/presentacion.pdf", titulo: "Guía: Sistemas" }
  },
  "mat-6": {
    videoId: "mat-6",
    infografia: { url: "/videos/video36/infografia.png", descripcion: "Ecuaciones Cuadráticas" },
    pdf: { url: "/videos/video36/presentacion.pdf", titulo: "Guía: Cuadráticas" }
  },
  "mat-7": {
    videoId: "mat-7",
    infografia: { url: "/videos/video37/infografia.png", descripcion: "Proporcionalidad" },
    pdf: { url: "/videos/video37/presentacion.pdf", titulo: "Guía: Proporcionalidad" }
  },
  "mat-8": {
    videoId: "mat-8",
    infografia: { url: "/videos/video38/infografia.png", descripcion: "Estadística Descriptiva" },
    pdf: { url: "/videos/video38/presentacion.pdf", titulo: "Guía: Estadística" }
  },
  "mat-9": {
    videoId: "mat-9",
    infografia: { url: "/videos/video39/infografia.png", descripcion: "Probabilidad Básica" },
    pdf: { url: "/videos/video39/presentacion.pdf", titulo: "Guía: Probabilidad" }
  },
  "mat-10": {
    videoId: "mat-10",
    infografia: { url: "/videos/video40/infografia.png", descripcion: "Elementos de Geometría" },
    pdf: { url: "/videos/video40/presentacion.pdf", titulo: "Guía: Geometría 1" }
  },
  "mat-11": {
    videoId: "mat-11",
    infografia: { url: "/videos/video41/infografia.png", descripcion: "Semejanza y Pitágoras" },
    pdf: { url: "/videos/video41/presentacion.pdf", titulo: "Guía: Pitágoras" }
  },
  "mat-12": {
    videoId: "mat-12",
    infografia: { url: "/videos/video42/infografia.png", descripcion: "Razones Trigonométricas" },
    pdf: { url: "/videos/video42/presentacion.pdf", titulo: "Guía: Trigonometría" }
  },
  "mat-13": {
    videoId: "mat-13",
    infografia: { url: "/videos/video43/infografia.png", descripcion: "Perímetros y Áreas" },
    pdf: { url: "/videos/video43/presentacion.pdf", titulo: "Guía: Perímetros" }
  },
  "mat-14": {
    videoId: "mat-14",
    infografia: { url: "/videos/video44/infografia.png", descripcion: "Volúmenes" },
    pdf: { url: "/videos/video44/presentacion.pdf", titulo: "Guía: Volúmenes" }
  },

  // ============================================
  // HISTORIA UNIVERSAL (hu-1 a hu-7) - VIDEOS 45-51
  // ============================================
  "hu-1": {
    videoId: "hu-1",
    infografia: { url: "/videos/video45/infografia.png", descripcion: "Renacimiento" },
    pdf: { url: "/videos/video45/presentacion.pdf", titulo: "Guía: Renacimiento" }
  },
  "hu-2": {
    videoId: "hu-2",
    infografia: { url: "/videos/video46/infografia.png", descripcion: "Ilustración" },
    pdf: { url: "/videos/video46/presentacion.pdf", titulo: "Guía: Ilustración" }
  },
  "hu-3": {
    videoId: "hu-3",
    infografia: { url: "/videos/video47/infografia.png", descripcion: "Revolución Industrial" },
    pdf: { url: "/videos/video47/presentacion.pdf", titulo: "Guía: Revolución Industrial" }
  },
  "hu-4": {
    videoId: "hu-4",
    infografia: { url: "/videos/video48/infografia.png", descripcion: "Imperialismo y 1GM" },
    pdf: { url: "/videos/video48/presentacion.pdf", titulo: "Guía: Imperialismo" }
  },
  "hu-5": {
    videoId: "hu-5",
    infografia: { url: "/videos/video49/infografia.png", descripcion: "Entreguerras" },
    pdf: { url: "/videos/video49/presentacion.pdf", titulo: "Guía: Entreguerras" }
  },
  "hu-6": {
    videoId: "hu-6",
    infografia: { url: "/videos/video50/infografia.png", descripcion: "Segunda Guerra Mundial" },
    pdf: { url: "/videos/video50/presentacion.pdf", titulo: "Guía: 2GM" }
  },
  "hu-7": {
    videoId: "hu-7",
    infografia: { url: "/videos/video51/infografia.png", descripcion: "Guerra Fría" },
    pdf: { url: "/videos/video51/presentacion.pdf", titulo: "Guía: Guerra Fría" }
  },

  // ============================================
  // HISTORIA DE MÉXICO (hm-mx-1 a hm-mx-7) - VIDEOS 52-58
  // ============================================
  "hm-mx-1": {
    videoId: "hm-mx-1",
    infografia: { url: "/videos/video52/infografia.png", descripcion: "Culturas Prehispánicas" },
    pdf: { url: "/videos/video52/presentacion.pdf", titulo: "Guía: Prehispánico" }
  },
  "hm-mx-2": {
    videoId: "hm-mx-2",
    infografia: { url: "/videos/video53/infografia.png", descripcion: "Conquista de México" },
    pdf: { url: "/videos/video53/presentacion.pdf", titulo: "Guía: Conquista" }
  },
  "hm-mx-3": {
    videoId: "hm-mx-3",
    infografia: { url: "/videos/video54/infografia.png", descripcion: "Virreinato" },
    pdf: { url: "/videos/video54/presentacion.pdf", titulo: "Guía: Virreinato" }
  },
  "hm-mx-4": {
    videoId: "hm-mx-4",
    infografia: { url: "/videos/video55/infografia.png", descripcion: "Independencia" },
    pdf: { url: "/videos/video55/presentacion.pdf", titulo: "Guía: Independencia" }
  },
  "hm-mx-5": {
    videoId: "hm-mx-5",
    infografia: { url: "/videos/video56/infografia.png", descripcion: "México Siglo XIX" },
    pdf: { url: "/videos/video56/presentacion.pdf", titulo: "Guía: Siglo XIX" }
  },
  "hm-mx-6": {
    videoId: "hm-mx-6",
    infografia: { url: "/videos/video57/infografia.png", descripcion: "Revolución Mexicana" },
    pdf: { url: "/videos/video57/presentacion.pdf", titulo: "Guía: Revolución" }
  },
  "hm-mx-7": {
    videoId: "hm-mx-7",
    infografia: { url: "/videos/video58/infografia.png", descripcion: "México Contemporáneo" },
    pdf: { url: "/videos/video58/presentacion.pdf", titulo: "Guía: Contemporáneo" }
  },

  // ============================================
  // ESPAÑOL (esp-1 a esp-10) - VIDEOS 59-68
  // ============================================
  "esp-1": {
    videoId: "esp-1",
    infografia: { url: "/videos/video59/infografia.png", descripcion: "Fichas Bibliográficas" },
    pdf: { url: "/videos/video59/presentacion.pdf", titulo: "Guía: Fichas" },
    podcast: { url: "/videos/video59/podcast.m4a", duracion: "3:00" }
  },
  "esp-2": {
    videoId: "esp-2",
    infografia: { url: "/videos/video60/infografia.png", descripcion: "Coherencia y Cohesión I" },
    pdf: { url: "/videos/video60/presentacion.pdf", titulo: "Guía: Coherencia 1" }
  },
  "esp-3": {
    videoId: "esp-3",
    infografia: { url: "/videos/video61/infografia.png", descripcion: "Coherencia y Cohesión II" },
    pdf: { url: "/videos/video61/presentacion.pdf", titulo: "Guía: Coherencia 2" }
  },
  "esp-4": {
    videoId: "esp-4",
    infografia: { url: "/videos/video62/infografia.png", descripcion: "Textos Informativos" },
    pdf: { url: "/videos/video62/presentacion.pdf", titulo: "Guía: Informativos" },
    podcast: { url: "/videos/video62/podcast.m4a", duracion: "3:00" }
  },
  "esp-5": {
    videoId: "esp-5",
    infografia: { url: "/videos/video63/infografia.png", descripcion: "Textos Publicitarios" },
    pdf: { url: "/videos/video63/presentacion.pdf", titulo: "Guía: Publicitarios" }
  },
  "esp-6": {
    videoId: "esp-6",
    infografia: { url: "/videos/video64/infografia.png", descripcion: "Textos Literarios I - Narrativa" },
    pdf: { url: "/videos/video64/presentacion.pdf", titulo: "Guía: Narrativa" }
  },
  "esp-7": {
    videoId: "esp-7",
    infografia: { url: "/videos/video65/infografia.png", descripcion: "Textos Literarios II - Lírica" },
    pdf: { url: "/videos/video65/presentacion.pdf", titulo: "Guía: Lírica" }
  },
  "esp-8": {
    videoId: "esp-8",
    infografia: { url: "/videos/video66/infografia.png", descripcion: "Ortografía Estratégica" },
    pdf: { url: "/videos/video66/presentacion.pdf", titulo: "Guía: Ortografía" }
  },
  "esp-9": {
    videoId: "esp-9",
    infografia: { url: "/videos/video67/infografia.png", descripcion: "Redacción Efectiva" },
    pdf: { url: "/videos/video67/presentacion.pdf", titulo: "Guía: Redacción" }
  },
  "esp-10": {
    videoId: "esp-10",
    infografia: { url: "/videos/video68/infografia.png", descripcion: "Integración Total Español" },
    pdf: { url: "/videos/video68/presentacion.pdf", titulo: "Guía: Integración Español" }
  },

  // ============================================
  // FORMACIÓN CÍVICA Y ÉTICA (fce-1 a fce-8) - VIDEOS 69-76
  // ============================================
  "fce-1": {
    videoId: "fce-1",
    infografia: { url: "/videos/video69/infografia.png", descripcion: "Fundamentos Personales" },
    pdf: { url: "/videos/video69/presentacion.pdf", titulo: "Guía: Fundamentos" }
  },
  "fce-2": {
    videoId: "fce-2",
    infografia: { url: "/videos/video70/infografia.png", descripcion: "Adolescencia y Sociedad" },
    pdf: { url: "/videos/video70/presentacion.pdf", titulo: "Guía: Adolescencia" }
  },
  "fce-3": {
    videoId: "fce-3",
    infografia: { url: "/videos/video71/infografia.png", descripcion: "El Estado Mexicano" },
    pdf: { url: "/videos/video71/presentacion.pdf", titulo: "Guía: Estado" }
  },
  "fce-4": {
    videoId: "fce-4",
    infografia: { url: "/videos/video72/infografia.png", descripcion: "Democracia y Derechos Humanos" },
    pdf: { url: "/videos/video72/presentacion.pdf", titulo: "Guía: Democracia" }
  },
  "fce-5": {
    videoId: "fce-5",
    infografia: { url: "/videos/video73/infografia.png", descripcion: "Sistema de Partidos" },
    pdf: { url: "/videos/video73/presentacion.pdf", titulo: "Guía: Partidos" }
  },
  "fce-6": {
    videoId: "fce-6",
    infografia: { url: "/videos/video74/infografia.png", descripcion: "Organizaciones de la Sociedad Civil" },
    pdf: { url: "/videos/video74/presentacion.pdf", titulo: "Guía: Sociedad Civil" }
  },
  "fce-7": {
    videoId: "fce-7",
    infografia: { url: "/videos/video75/infografia.png", descripcion: "Medios de Comunicación" },
    pdf: { url: "/videos/video75/presentacion.pdf", titulo: "Guía: Medios" }
  },
  "fce-8": {
    videoId: "fce-8",
    infografia: { url: "/videos/video76/infografia.png", descripcion: "Corrupción y Transparencia" },
    pdf: { url: "/videos/video76/presentacion.pdf", titulo: "Guía: Corrupción" }
  },

  // ============================================
  // GEOGRAFÍA (geo-1 a geo-10) - VIDEOS 77-86
  // ============================================
  "geo-1": {
    videoId: "geo-1",
    infografia: { url: "/videos/video77/infografia.png", descripcion: "Espacio Geográfico" },
    pdf: { url: "/videos/video77/presentacion.pdf", titulo: "Guía: Geografía 1" }
  },
  "geo-2": {
    videoId: "geo-2",
    infografia: { url: "/videos/video78/infografia.png", descripcion: "Recursos Naturales" },
    pdf: { url: "/videos/video78/presentacion.pdf", titulo: "Guía: Recursos" }
  },
  "geo-3": {
    videoId: "geo-3",
    infografia: { url: "/videos/video79/infografia.png", descripcion: "Biosfera y Biodiversidad" },
    pdf: { url: "/videos/video79/presentacion.pdf", titulo: "Guía: Biosfera" }
  },
  "geo-4": {
    videoId: "geo-4",
    infografia: { url: "/videos/video80/infografia.png", descripcion: "Desarrollo Sustentable" },
    pdf: { url: "/videos/video80/presentacion.pdf", titulo: "Guía: Sustentable" }
  },
  "geo-5": {
    videoId: "geo-5",
    infografia: { url: "/videos/video81/infografia.png", descripcion: "Población y Migración" },
    pdf: { url: "/videos/video81/presentacion.pdf", titulo: "Guía: Población" }
  },
  "geo-6": {
    videoId: "geo-6",
    infografia: { url: "/videos/video82/infografia.png", descripcion: "Vulnerabilidad y Resiliencia" },
    pdf: { url: "/videos/video82/presentacion.pdf", titulo: "Guía: Resiliencia" }
  },
  "geo-7": {
    videoId: "geo-7",
    infografia: { url: "/videos/video83/infografia.png", descripcion: "Economía Global" },
    pdf: { url: "/videos/video83/presentacion.pdf", titulo: "Guía: Economía" }
  },
  "geo-8": {
    videoId: "geo-8",
    infografia: { url: "/videos/video84/infografia.png", descripcion: "El Mundo Desigual" },
    pdf: { url: "/videos/video84/presentacion.pdf", titulo: "Guía: Desigualdad" }
  },
  "geo-9": {
    videoId: "geo-9",
    infografia: { url: "/videos/video85/infografia.png", descripcion: "Cultura e Identidad" },
    pdf: { url: "/videos/video85/presentacion.pdf", titulo: "Guía: Cultura" }
  },
  "geo-10": {
    videoId: "geo-10",
    infografia: { url: "/videos/video86/infografia.png", descripcion: "Patrimonio y Soberanía" },
    pdf: { url: "/videos/video86/presentacion.pdf", titulo: "Guía: Patrimonio" }
  },

  // ============================================
  // REPASO FINAL Y ESTRATEGIAS (rep-1 a rep-4) - VIDEOS 87-90
  // ============================================
  "rep-1": {
    videoId: "rep-1",
    infografia: { url: "/videos/video87/infografia.png", descripcion: "Repaso Ciencias y Matemáticas" },
    pdf: { url: "/videos/video87/presentacion.pdf", titulo: "Guía: Repaso Ciencias" }
  },
  "rep-2": {
    videoId: "rep-2",
    infografia: { url: "/videos/video88/infografia.png", descripcion: "Repaso Historia y Sociales" },
    pdf: { url: "/videos/video88/presentacion.pdf", titulo: "Guía: Repaso Historia" }
  },
  "rep-3": {
    videoId: "rep-3",
    infografia: { url: "/videos/video89/infografia.png", descripcion: "Estrategias Examen en Línea" },
    pdf: { url: "/videos/video89/presentacion.pdf", titulo: "Guía: Estrategias" }
  },
  "rep-4": {
    videoId: "rep-4",
    infografia: { url: "/videos/video90/infografia.png", descripcion: "Cierre Total" },
    pdf: { url: "/videos/video90/presentacion.pdf", titulo: "Guía: Cierre" }
  }
};
