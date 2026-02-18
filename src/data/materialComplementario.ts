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
      url: "/videos/video0/podcast.mp3",
      duracion: "8:30"
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
    podcast: { url: "/videos/video1/podcast.mp3", duracion: "8:30" }
  },
  "hv-2": {
    videoId: "hv-2",
    quiz: { url: "/quiz/video-02-quiz.html" },
    infografia: { url: "/videos/video2/infografia.png", descripcion: "Comprensión Lectora Parte 2" },
    pdf: { url: "/videos/video2/presentacion.pdf", titulo: "Guía: Comprensión Lectora 2" },
    podcast: { url: "/videos/video2/podcast.mp3", duracion: "8:30" }
  },
  "hv-3": {
    videoId: "hv-3",
    quiz: { url: "/quiz/video-03-quiz.html" },
    infografia: { url: "/videos/video3/infografia.png", descripcion: "Vocabulario Parte 1" },
    pdf: { url: "/videos/video3/presentacion.pdf", titulo: "Guía: Vocabulario 1" },
    podcast: { url: "/videos/video3/podcast.mp3", duracion: "8:30" }
  },
  "hv-4": {
    videoId: "hv-4",
    quiz: { url: "/quiz/video-04-quiz.html" },
    infografia: { url: "/videos/video4/infografia.png", descripcion: "Vocabulario Parte 2" },
    pdf: { url: "/videos/video4/presentacion.pdf", titulo: "Guía: Vocabulario 2" },
    podcast: { url: "/videos/video4/podcast.mp3", duracion: "8:30" }
  },
  "hv-5": {
    videoId: "hv-5",
    quiz: { url: "/quiz/video-05-quiz.html" },
    infografia: { url: "/videos/video5/infografia.png", descripcion: "Integración Habilidad Verbal" },
    pdf: { url: "/videos/video5/presentacion.pdf", titulo: "Guía: Integración HV" },
    podcast: { url: "/videos/video5/podcast.mp3", duracion: "8:30" }
  },

  // ============================================
  // HABILIDAD MATEMÁTICA (hm-1 a hm-5) - VIDEOS 6-10
  // ============================================
  "hm-1": {
    videoId: "hm-1",
    quiz: { url: "/quiz/video-06-quiz.html" },
    infografia: { url: "/videos/video6/infografia.png", descripcion: "Series Numéricas" },
    pdf: { url: "/videos/video6/presentacion.pdf", titulo: "Guía: Series Numéricas" },
    podcast: { url: "/videos/video6/podcast.mp3", duracion: "8:30" }
  },
  "hm-2": {
    videoId: "hm-2",
    quiz: { url: "/quiz/video-07-quiz.html" },
    infografia: { url: "/videos/video7/infografia.png", descripcion: "Series Espaciales" },
    pdf: { url: "/videos/video7/presentacion.pdf", titulo: "Guía: Series Espaciales" },
    podcast: { url: "/videos/video7/podcast.mp3", duracion: "8:30" }
  },
  "hm-3": {
    videoId: "hm-3",
    quiz: { url: "/quiz/video-08-quiz.html" },
    infografia: { url: "/videos/video8/infografia.png", descripcion: "Imaginación Espacial" },
    pdf: { url: "/videos/video8/presentacion.pdf", titulo: "Guía: Imaginación Espacial" },
    podcast: { url: "/videos/video8/podcast.mp3", duracion: "8:30" }
  },
  "hm-4": {
    videoId: "hm-4",
    quiz: { url: "/quiz/video-09-quiz.html" },
    infografia: { url: "/videos/video9/infografia.png", descripcion: "Razonamiento Lógico" },
    pdf: { url: "/videos/video9/presentacion.pdf", titulo: "Guía: Razonamiento" },
    podcast: { url: "/videos/video9/podcast.mp3", duracion: "8:30" }
  },
  "hm-5": {
    videoId: "hm-5",
    quiz: { url: "/quiz/video-10-quiz.html" },
    infografia: { url: "/videos/video10/infografia.png", descripcion: "Integración HM" },
    pdf: { url: "/videos/video10/presentacion.pdf", titulo: "Guía: Integración HM" },
    podcast: { url: "/videos/video10/podcast.mp3", duracion: "8:30" }
  },

  // ============================================
  // BIOLOGÍA (bio-1 a bio-7) - VIDEOS 11-17
  // ============================================
  "bio-1": {
    videoId: "bio-1",
    quiz: { url: "/quiz/video-11-quiz.html" },
    infografia: { url: "/videos/video11/infografia.png", descripcion: "Bases de Biología" },
    pdf: { url: "/videos/video11/presentacion.pdf", titulo: "Guía: Biología 1" },
    podcast: { url: "/videos/video11/podcast.mp3", duracion: "8:30" }
  },
  "bio-2": {
    videoId: "bio-2",
    quiz: { url: "/quiz/video-12-quiz.html" },
    infografia: { url: "/videos/video12/infografia.png", descripcion: "Biodiversidad" },
    pdf: { url: "/videos/video12/presentacion.pdf", titulo: "Guía: Biodiversidad" },
    podcast: { url: "/videos/video12/podcast.mp3", duracion: "8:30" }
  },
  "bio-3": {
    videoId: "bio-3",
    quiz: { url: "/quiz/video-13-quiz.html" },
    infografia: { url: "/videos/video13/infografia.png", descripcion: "Metabolismo" },
    pdf: { url: "/videos/video13/presentacion.pdf", titulo: "Guía: Metabolismo" },
    podcast: { url: "/videos/video13/podcast.mp3", duracion: "8:30" }
  },
  "bio-4": {
    videoId: "bio-4",
    quiz: { url: "/quiz/video-14-quiz.html" },
    infografia: { url: "/videos/video14/infografia.png", descripcion: "Ciclos y Nutrición" },
    pdf: { url: "/videos/video14/presentacion.pdf", titulo: "Guía: Ciclos" },
    podcast: { url: "/videos/video14/podcast.mp3", duracion: "8:30" }
  },
  "bio-5": {
    videoId: "bio-5",
    quiz: { url: "/quiz/video-15-quiz.html" },
    infografia: { url: "/videos/video15/infografia.png", descripcion: "Salud y Reproducción" },
    pdf: { url: "/videos/video15/presentacion.pdf", titulo: "Guía: Salud" },
    podcast: { url: "/videos/video15/podcast.mp3", duracion: "8:30" }
  },
  "bio-6": {
    videoId: "bio-6",
    quiz: { url: "/quiz/video-16-quiz.html" },
    infografia: { url: "/videos/video16/infografia.png", descripcion: "Genética" },
    pdf: { url: "/videos/video16/presentacion.pdf", titulo: "Guía: Genética" },
    podcast: { url: "/videos/video16/podcast.mp3", duracion: "8:30" }
  },
  "bio-7": {
    videoId: "bio-7",
    quiz: { url: "/quiz/video-17-quiz.html" },
    infografia: { url: "/videos/video17/infografia.png", descripcion: "Integración Biología" },
    pdf: { url: "/videos/video17/presentacion.pdf", titulo: "Guía: Biología Integral" },
    podcast: { url: "/videos/video17/podcast.mp3", duracion: "8:30" }
  },

  // ============================================
  // FÍSICA (fis-1 a fis-7) - VIDEOS 18-24
  // ============================================
  "fis-1": {
    videoId: "fis-1",
    quiz: { url: "/quiz/video-18-quiz.html" },
    infografia: { url: "/videos/video18/infografia.png", descripcion: "Introducción a Física" },
    pdf: { url: "/videos/video18/presentacion.pdf", titulo: "Guía: Física 1" },
    podcast: { url: "/videos/video18/podcast.mp3", duracion: "8:30" }
  },
  "fis-2": {
    videoId: "fis-2",
    quiz: { url: "/quiz/video-19-quiz.html" },
    infografia: { url: "/videos/video19/infografia.png", descripcion: "Leyes de Newton" },
    pdf: { url: "/videos/video19/presentacion.pdf", titulo: "Guía: Leyes de Newton" },
    podcast: { url: "/videos/video19/podcast.mp3", duracion: "8:30" }
  },
  "fis-3": {
    videoId: "fis-3",
    quiz: { url: "/quiz/video-20-quiz.html" },
    infografia: { url: "/videos/video20/infografia.png", descripcion: "Tercera Ley" },
    pdf: { url: "/videos/video20/presentacion.pdf", titulo: "Guía: Fuerzas" },
    podcast: { url: "/videos/video20/podcast.mp3", duracion: "8:30" }
  },
  "fis-4": {
    videoId: "fis-4",
    quiz: { url: "/quiz/video-21-quiz.html" },
    infografia: { url: "/videos/video21/infografia.png", descripcion: "Energía y Trabajo" },
    pdf: { url: "/videos/video21/presentacion.pdf", titulo: "Guía: Energía" },
    podcast: { url: "/videos/video21/podcast.mp3", duracion: "8:30" }
  },
  "fis-5": {
    videoId: "fis-5",
    quiz: { url: "/quiz/video-22-quiz.html" },
    infografia: { url: "/videos/video22/infografia.png", descripcion: "Electricidad" },
    pdf: { url: "/videos/video22/presentacion.pdf", titulo: "Guía: Electricidad" },
    podcast: { url: "/videos/video22/podcast.mp3", duracion: "8:30" }
  },
  "fis-6": {
    videoId: "fis-6",
    quiz: { url: "/quiz/video-23-quiz.html" },
    infografia: { url: "/videos/video23/infografia.png", descripcion: "Ondas y Luz" },
    pdf: { url: "/videos/video23/presentacion.pdf", titulo: "Guía: Ondas" },
    podcast: { url: "/videos/video23/podcast.mp3", duracion: "8:30" }
  },
  "fis-7": {
    videoId: "fis-7",
    quiz: { url: "/quiz/video-24-quiz.html" },
    infografia: { url: "/videos/video24/infografia.png", descripcion: "Física Moderna" },
    pdf: { url: "/videos/video24/presentacion.pdf", titulo: "Guía: Física Moderna" },
    podcast: { url: "/videos/video24/podcast.mp3", duracion: "8:30" }
  },

  // ============================================
  // QUÍMICA (qui-1 a qui-6) - VIDEOS 25-30
  // ============================================
  "qui-1": {
    videoId: "qui-1",
    quiz: { url: "/quiz/video-25-quiz.html" },
    infografia: { url: "/videos/video25/infografia.png", descripcion: "Introducción a Química" },
    pdf: { url: "/videos/video25/presentacion.pdf", titulo: "Guía: Química 1" },
    podcast: { url: "/videos/video25/podcast.mp3", duracion: "8:30" }
  },
  "qui-2": {
    videoId: "qui-2",
    quiz: { url: "/quiz/video-26-quiz.html" },
    infografia: { url: "/videos/video26/infografia.png", descripcion: "Estructura Atómica" },
    pdf: { url: "/videos/video26/presentacion.pdf", titulo: "Guía: Átomos" },
    podcast: { url: "/videos/video26/podcast.mp3", duracion: "8:30" }
  },
  "qui-3": {
    videoId: "qui-3",
    quiz: { url: "/quiz/video-27-quiz.html" },
    infografia: { url: "/videos/video27/infografia.png", descripcion: "Tabla Periódica" },
    pdf: { url: "/videos/video27/presentacion.pdf", titulo: "Guía: Tabla Periódica" },
    podcast: { url: "/videos/video27/podcast.mp3", duracion: "8:30" }
  },
  "qui-4": {
    videoId: "qui-4",
    quiz: { url: "/quiz/video-28-quiz.html" },
    infografia: { url: "/videos/video28/infografia.png", descripcion: "Enlaces Químicos" },
    pdf: { url: "/videos/video28/presentacion.pdf", titulo: "Guía: Enlaces" },
    podcast: { url: "/videos/video28/podcast.mp3", duracion: "8:30" }
  },
  "qui-5": {
    videoId: "qui-5",
    quiz: { url: "/quiz/video-29-quiz.html" },
    infografia: { url: "/videos/video29/infografia.png", descripcion: "Reacciones Químicas" },
    pdf: { url: "/videos/video29/presentacion.pdf", titulo: "Guía: Reacciones" },
    podcast: { url: "/videos/video29/podcast.mp3", duracion: "8:30" }
  },
  "qui-6": {
    videoId: "qui-6",
    quiz: { url: "/quiz/video-30-quiz.html" },
    infografia: { url: "/videos/video30/infografia.png", descripcion: "Ácidos y Redox" },
    pdf: { url: "/videos/video30/presentacion.pdf", titulo: "Guía: Ácidos" },
    podcast: { url: "/videos/video30/podcast.mp3", duracion: "8:30" }
  },

  // ============================================
  // MATEMÁTICAS (mat-1 a mat-14) - VIDEOS 31-44
  // ============================================
  "mat-1": {
    videoId: "mat-1",
    quiz: { url: "/quiz/video-31-quiz.html" },
    infografia: { url: "/videos/video31/infografia.png", descripcion: "Números Enteros" },
    pdf: { url: "/videos/video31/presentacion.pdf", titulo: "Guía: Enteros" },
    podcast: { url: "/videos/video31/podcast.mp3", duracion: "8:30" }
  },
  "mat-2": {
    videoId: "mat-2",
    quiz: { url: "/quiz/video-32-quiz.html" },
    infografia: { url: "/videos/video32/infografia.png", descripcion: "Fracciones y Decimales" },
    pdf: { url: "/videos/video32/presentacion.pdf", titulo: "Guía: Fracciones" },
    podcast: { url: "/videos/video32/podcast.mp3", duracion: "8:30" }
  },
  "mat-3": {
    videoId: "mat-3",
    quiz: { url: "/quiz/video-33-quiz.html" },
    infografia: { url: "/videos/video33/infografia.png", descripcion: "Introducción al Álgebra" },
    pdf: { url: "/videos/video33/presentacion.pdf", titulo: "Guía: Álgebra" },
    podcast: { url: "/videos/video33/podcast.mp3", duracion: "8:30" }
  },
  "mat-4": {
    videoId: "mat-4",
    quiz: { url: "/quiz/video-34-quiz.html" },
    infografia: { url: "/videos/video34/infografia.png", descripcion: "Ecuaciones de Primer Grado" },
    pdf: { url: "/videos/video34/presentacion.pdf", titulo: "Guía: Ecuaciones 1" },
    podcast: { url: "/videos/video34/podcast.mp3", duracion: "8:30" }
  },
  "mat-5": {
    videoId: "mat-5",
    quiz: { url: "/quiz/video-35-quiz.html" },
    infografia: { url: "/videos/video35/infografia.png", descripcion: "Sistemas de Ecuaciones" },
    pdf: { url: "/videos/video35/presentacion.pdf", titulo: "Guía: Sistemas" },
    podcast: { url: "/videos/video35/podcast.mp3", duracion: "8:30" }
  },
  "mat-6": {
    videoId: "mat-6",
    quiz: { url: "/quiz/video-36-quiz.html" },
    infografia: { url: "/videos/video36/infografia.png", descripcion: "Ecuaciones Cuadráticas" },
    pdf: { url: "/videos/video36/presentacion.pdf", titulo: "Guía: Cuadráticas" },
    podcast: { url: "/videos/video36/podcast.mp3", duracion: "8:30" }
  },
  "mat-7": {
    videoId: "mat-7",
    quiz: { url: "/quiz/video-37-quiz.html" },
    infografia: { url: "/videos/video37/infografia.png", descripcion: "Proporcionalidad" },
    pdf: { url: "/videos/video37/presentacion.pdf", titulo: "Guía: Proporcionalidad" },
    podcast: { url: "/videos/video37/podcast.mp3", duracion: "8:30" }
  },
  "mat-8": {
    videoId: "mat-8",
    quiz: { url: "/quiz/video-38-quiz.html" },
    infografia: { url: "/videos/video38/infografia.png", descripcion: "Estadística Descriptiva" },
    pdf: { url: "/videos/video38/presentacion.pdf", titulo: "Guía: Estadística" },
    podcast: { url: "/videos/video38/podcast.mp3", duracion: "8:30" }
  },
  "mat-9": {
    videoId: "mat-9",
    quiz: { url: "/quiz/video-39-quiz.html" },
    infografia: { url: "/videos/video39/infografia.png", descripcion: "Probabilidad Básica" },
    pdf: { url: "/videos/video39/presentacion.pdf", titulo: "Guía: Probabilidad" },
    podcast: { url: "/videos/video39/podcast.mp3", duracion: "8:30" }
  },
  "mat-10": {
    videoId: "mat-10",
    quiz: { url: "/quiz/video-40-quiz.html" },
    infografia: { url: "/videos/video40/infografia.png", descripcion: "Elementos de Geometría" },
    pdf: { url: "/videos/video40/presentacion.pdf", titulo: "Guía: Geometría 1" },
    podcast: { url: "/videos/video40/podcast.mp3", duracion: "8:30" }
  },
  "mat-11": {
    videoId: "mat-11",
    quiz: { url: "/quiz/video-41-quiz.html" },
    infografia: { url: "/videos/video41/infografia.png", descripcion: "Semejanza y Pitágoras" },
    pdf: { url: "/videos/video41/presentacion.pdf", titulo: "Guía: Pitágoras" },
    podcast: { url: "/videos/video41/podcast.mp3", duracion: "8:30" }
  },
  "mat-12": {
    videoId: "mat-12",
    quiz: { url: "/quiz/video-42-quiz.html" },
    infografia: { url: "/videos/video42/infografia.png", descripcion: "Razones Trigonométricas" },
    pdf: { url: "/videos/video42/presentacion.pdf", titulo: "Guía: Trigonometría" },
    podcast: { url: "/videos/video42/podcast.mp3", duracion: "8:30" }
  },
  "mat-13": {
    videoId: "mat-13",
    quiz: { url: "/quiz/video-43-quiz.html" },
    infografia: { url: "/videos/video43/infografia.png", descripcion: "Perímetros y Áreas" },
    pdf: { url: "/videos/video43/presentacion.pdf", titulo: "Guía: Perímetros" },
    podcast: { url: "/videos/video43/podcast.mp3", duracion: "8:30" }
  },
  "mat-14": {
    videoId: "mat-14",
    quiz: { url: "/quiz/video-44-quiz.html" },
    infografia: { url: "/videos/video44/infografia.png", descripcion: "Volúmenes" },
    pdf: { url: "/videos/video44/presentacion.pdf", titulo: "Guía: Volúmenes" },
    podcast: { url: "/videos/video44/podcast.mp3", duracion: "8:30" }
  },

  // ============================================
  // HISTORIA UNIVERSAL (hu-1 a hu-7) - VIDEOS 45-51
  // ============================================
  "hu-1": {
    videoId: "hu-1",
    quiz: { url: "/quiz/video-45-quiz.html" },
    infografia: { url: "/videos/video45/infografia.png", descripcion: "Renacimiento" },
    pdf: { url: "/videos/video45/presentacion.pdf", titulo: "Guía: Renacimiento" },
    podcast: { url: "/videos/video45/podcast.mp3", duracion: "8:30" }
  },
  "hu-2": {
    videoId: "hu-2",
    quiz: { url: "/quiz/video-46-quiz.html" },
    infografia: { url: "/videos/video46/infografia.png", descripcion: "Ilustración" },
    pdf: { url: "/videos/video46/presentacion.pdf", titulo: "Guía: Ilustración" },
    podcast: { url: "/videos/video46/podcast.mp3", duracion: "8:30" }
  },
  "hu-3": {
    videoId: "hu-3",
    quiz: { url: "/quiz/video-47-quiz.html" },
    infografia: { url: "/videos/video47/infografia.png", descripcion: "Revolución Industrial" },
    pdf: { url: "/videos/video47/presentacion.pdf", titulo: "Guía: Revolución Industrial" },
    podcast: { url: "/videos/video47/podcast.mp3", duracion: "8:30" }
  },
  "hu-4": {
    videoId: "hu-4",
    quiz: { url: "/quiz/video-48-quiz.html" },
    infografia: { url: "/videos/video48/infografia.png", descripcion: "Imperialismo y 1GM" },
    pdf: { url: "/videos/video48/presentacion.pdf", titulo: "Guía: Imperialismo" },
    podcast: { url: "/videos/video48/podcast.mp3", duracion: "8:30" }
  },
  "hu-5": {
    videoId: "hu-5",
    quiz: { url: "/quiz/video-49-quiz.html" },
    infografia: { url: "/videos/video49/infografia.png", descripcion: "Entreguerras" },
    pdf: { url: "/videos/video49/presentacion.pdf", titulo: "Guía: Entreguerras" },
    podcast: { url: "/videos/video49/podcast.mp3", duracion: "8:30" }
  },
  "hu-6": {
    videoId: "hu-6",
    quiz: { url: "/quiz/video-50-quiz.html" },
    infografia: { url: "/videos/video50/infografia.png", descripcion: "Segunda Guerra Mundial" },
    pdf: { url: "/videos/video50/presentacion.pdf", titulo: "Guía: 2GM" },
    podcast: { url: "/videos/video50/podcast.mp3", duracion: "8:30" }
  },
  "hu-7": {
    videoId: "hu-7",
    quiz: { url: "/quiz/video-51-quiz.html" },
    infografia: { url: "/videos/video51/infografia.png", descripcion: "Guerra Fría" },
    pdf: { url: "/videos/video51/presentacion.pdf", titulo: "Guía: Guerra Fría" },
    podcast: { url: "/videos/video51/podcast.mp3", duracion: "8:30" }
  },

  // ============================================
  // HISTORIA DE MÉXICO (hm-mx-1 a hm-mx-7) - VIDEOS 52-58
  // ============================================
  "hm-mx-1": {
    videoId: "hm-mx-1",
    quiz: { url: "/quiz/video-52-quiz.html" },
    infografia: { url: "/videos/video52/infografia.png", descripcion: "Culturas Prehispánicas" },
    pdf: { url: "/videos/video52/presentacion.pdf", titulo: "Guía: Prehispánico" },
    podcast: { url: "/videos/video52/podcast.mp3", duracion: "8:30" }
  },
  "hm-mx-2": {
    videoId: "hm-mx-2",
    quiz: { url: "/quiz/video-53-quiz.html" },
    infografia: { url: "/videos/video53/infografia.png", descripcion: "Conquista de México" },
    pdf: { url: "/videos/video53/presentacion.pdf", titulo: "Guía: Conquista" },
    podcast: { url: "/videos/video53/podcast.mp3", duracion: "8:30" }
  },
  "hm-mx-3": {
    videoId: "hm-mx-3",
    quiz: { url: "/quiz/video-54-quiz.html" },
    infografia: { url: "/videos/video54/infografia.png", descripcion: "Virreinato" },
    pdf: { url: "/videos/video54/presentacion.pdf", titulo: "Guía: Virreinato" },
    podcast: { url: "/videos/video54/podcast.mp3", duracion: "8:30" }
  },
  "hm-mx-4": {
    videoId: "hm-mx-4",
    quiz: { url: "/quiz/video-55-quiz.html" },
    infografia: { url: "/videos/video55/infografia.png", descripcion: "Independencia" },
    pdf: { url: "/videos/video55/presentacion.pdf", titulo: "Guía: Independencia" },
    podcast: { url: "/videos/video55/podcast.mp3", duracion: "8:30" }
  },
  "hm-mx-5": {
    videoId: "hm-mx-5",
    quiz: { url: "/quiz/video-56-quiz.html" },
    infografia: { url: "/videos/video56/infografia.png", descripcion: "México Siglo XIX" },
    pdf: { url: "/videos/video56/presentacion.pdf", titulo: "Guía: Siglo XIX" },
    podcast: { url: "/videos/video56/podcast.mp3", duracion: "8:30" }
  },
  "hm-mx-6": {
    videoId: "hm-mx-6",
    quiz: { url: "/quiz/video-57-quiz.html" },
    infografia: { url: "/videos/video57/infografia.png", descripcion: "Revolución Mexicana" },
    pdf: { url: "/videos/video57/presentacion.pdf", titulo: "Guía: Revolución" },
    podcast: { url: "/videos/video57/podcast.mp3", duracion: "8:30" }
  },
  "hm-mx-7": {
    videoId: "hm-mx-7",
    quiz: { url: "/quiz/video-58-quiz.html" },
    infografia: { url: "/videos/video58/infografia.png", descripcion: "México Contemporáneo" },
    pdf: { url: "/videos/video58/presentacion.pdf", titulo: "Guía: Contemporáneo" },
    podcast: { url: "/videos/video58/podcast.mp3", duracion: "8:30" }
  },

  // ============================================
  // ESPAÑOL (esp-1 a esp-10) - VIDEOS 59-68
  // ============================================
  "esp-1": {
    videoId: "esp-1",
    quiz: { url: "/quiz/video-59-quiz.html" },
    infografia: { url: "/videos/video59/infografia.png", descripcion: "Fichas Bibliográficas" },
    pdf: { url: "/videos/video59/presentacion.pdf", titulo: "Guía: Fichas" },
    podcast: { url: "/videos/video59/podcast.mp3", duracion: "8:30" }
  },
  "esp-2": {
    videoId: "esp-2",
    quiz: { url: "/quiz/video-60-quiz.html" },
    infografia: { url: "/videos/video60/infografia.png", descripcion: "Coherencia y Cohesión I" },
    pdf: { url: "/videos/video60/presentacion.pdf", titulo: "Guía: Coherencia 1" },
    podcast: { url: "/videos/video60/podcast.mp3", duracion: "8:30" }
  },
  "esp-3": {
    videoId: "esp-3",
    quiz: { url: "/quiz/video-61-quiz.html" },
    infografia: { url: "/videos/video61/infografia.png", descripcion: "Coherencia y Cohesión II" },
    pdf: { url: "/videos/video61/presentacion.pdf", titulo: "Guía: Coherencia 2" },
    podcast: { url: "/videos/video61/podcast.mp3", duracion: "8:30" }
  },
  "esp-4": {
    videoId: "esp-4",
    quiz: { url: "/quiz/video-62-quiz.html" },
    infografia: { url: "/videos/video62/infografia.png", descripcion: "Textos Informativos" },
    pdf: { url: "/videos/video62/presentacion.pdf", titulo: "Guía: Informativos" },
    podcast: { url: "/videos/video62/podcast.mp3", duracion: "8:30" }
  },
  "esp-5": {
    videoId: "esp-5",
    quiz: { url: "/quiz/video-63-quiz.html" },
    infografia: { url: "/videos/video63/infografia.png", descripcion: "Textos Publicitarios" },
    pdf: { url: "/videos/video63/presentacion.pdf", titulo: "Guía: Publicitarios" },
    podcast: { url: "/videos/video63/podcast.mp3", duracion: "8:30" }
  },
  "esp-6": {
    videoId: "esp-6",
    quiz: { url: "/quiz/video-64-quiz.html" },
    infografia: { url: "/videos/video64/infografia.png", descripcion: "Textos Literarios I - Narrativa" },
    pdf: { url: "/videos/video64/presentacion.pdf", titulo: "Guía: Narrativa" },
    podcast: { url: "/videos/video64/podcast.mp3", duracion: "8:30" }
  },
  "esp-7": {
    videoId: "esp-7",
    quiz: { url: "/quiz/video-65-quiz.html" },
    infografia: { url: "/videos/video65/infografia.png", descripcion: "Textos Literarios II - Lírica" },
    pdf: { url: "/videos/video65/presentacion.pdf", titulo: "Guía: Lírica" },
    podcast: { url: "/videos/video65/podcast.mp3", duracion: "8:30" }
  },
  "esp-8": {
    videoId: "esp-8",
    quiz: { url: "/quiz/video-66-quiz.html" },
    infografia: { url: "/videos/video66/infografia.png", descripcion: "Ortografía Estratégica" },
    pdf: { url: "/videos/video66/presentacion.pdf", titulo: "Guía: Ortografía" },
    podcast: { url: "/videos/video66/podcast.mp3", duracion: "8:30" }
  },
  "esp-9": {
    videoId: "esp-9",
    quiz: { url: "/quiz/video-67-quiz.html" },
    infografia: { url: "/videos/video67/infografia.png", descripcion: "Redacción Efectiva" },
    pdf: { url: "/videos/video67/presentacion.pdf", titulo: "Guía: Redacción" },
    podcast: { url: "/videos/video67/podcast.mp3", duracion: "8:30" }
  },
  "esp-10": {
    videoId: "esp-10",
    quiz: { url: "/quiz/video-68-quiz.html" },
    infografia: { url: "/videos/video68/infografia.png", descripcion: "Integración Total Español" },
    pdf: { url: "/videos/video68/presentacion.pdf", titulo: "Guía: Integración Español" },
    podcast: { url: "/videos/video68/podcast.mp3", duracion: "8:30" }
  },

  // ============================================
  // FORMACIÓN CÍVICA Y ÉTICA (fce-1 a fce-8) - VIDEOS 69-76
  // ============================================
  "fce-1": {
    videoId: "fce-1",
    quiz: { url: "/quiz/video-69-quiz.html" },
    infografia: { url: "/videos/video69/infografia.png", descripcion: "Fundamentos Personales" },
    pdf: { url: "/videos/video69/presentacion.pdf", titulo: "Guía: Fundamentos" },
    podcast: { url: "/videos/video69/podcast.mp3", duracion: "8:30" }
  },
  "fce-2": {
    videoId: "fce-2",
    quiz: { url: "/quiz/video-70-quiz.html" },
    infografia: { url: "/videos/video70/infografia.png", descripcion: "Adolescencia y Sociedad" },
    pdf: { url: "/videos/video70/presentacion.pdf", titulo: "Guía: Adolescencia" },
    podcast: { url: "/videos/video70/podcast.mp3", duracion: "8:30" }
  },
  "fce-3": {
    videoId: "fce-3",
    quiz: { url: "/quiz/video-71-quiz.html" },
    infografia: { url: "/videos/video71/infografia.png", descripcion: "El Estado Mexicano" },
    pdf: { url: "/videos/video71/presentacion.pdf", titulo: "Guía: Estado" },
    podcast: { url: "/videos/video71/podcast.mp3", duracion: "8:30" }
  },
  "fce-4": {
    videoId: "fce-4",
    quiz: { url: "/quiz/video-72-quiz.html" },
    infografia: { url: "/videos/video72/infografia.png", descripcion: "Democracia y Derechos Humanos" },
    pdf: { url: "/videos/video72/presentacion.pdf", titulo: "Guía: Democracia" },
    podcast: { url: "/videos/video72/podcast.mp3", duracion: "8:30" }
  },
  "fce-5": {
    videoId: "fce-5",
    quiz: { url: "/quiz/video-73-quiz.html" },
    infografia: { url: "/videos/video73/infografia.png", descripcion: "Sistema de Partidos" },
    pdf: { url: "/videos/video73/presentacion.pdf", titulo: "Guía: Partidos" },
    podcast: { url: "/videos/video73/podcast.mp3", duracion: "8:30" }
  },
  "fce-6": {
    videoId: "fce-6",
    quiz: { url: "/quiz/video-74-quiz.html" },
    infografia: { url: "/videos/video74/infografia.png", descripcion: "Organizaciones de la Sociedad Civil" },
    pdf: { url: "/videos/video74/presentacion.pdf", titulo: "Guía: Sociedad Civil" },
    podcast: { url: "/videos/video74/podcast.mp3", duracion: "8:30" }
  },
  "fce-7": {
    videoId: "fce-7",
    quiz: { url: "/quiz/video-75-quiz.html" },
    infografia: { url: "/videos/video75/infografia.png", descripcion: "Medios de Comunicación" },
    pdf: { url: "/videos/video75/presentacion.pdf", titulo: "Guía: Medios" },
    podcast: { url: "/videos/video75/podcast.mp3", duracion: "8:30" }
  },
  "fce-8": {
    videoId: "fce-8",
    quiz: { url: "/quiz/video-76-quiz.html" },
    infografia: { url: "/videos/video76/infografia.png", descripcion: "Corrupción y Transparencia" },
    pdf: { url: "/videos/video76/presentacion.pdf", titulo: "Guía: Corrupción" },
    podcast: { url: "/videos/video76/podcast.mp3", duracion: "8:30" }
  },

  // ============================================
  // GEOGRAFÍA (geo-1 a geo-10) - VIDEOS 77-86
  // ============================================
  "geo-1": {
    videoId: "geo-1",
    quiz: { url: "/quiz/video-77-quiz.html" },
    infografia: { url: "/videos/video77/infografia.png", descripcion: "Espacio Geográfico" },
    pdf: { url: "/videos/video77/presentacion.pdf", titulo: "Guía: Geografía 1" },
    podcast: { url: "/videos/video77/podcast.mp3", duracion: "8:30" }
  },
  "geo-2": {
    videoId: "geo-2",
    quiz: { url: "/quiz/video-78-quiz.html" },
    infografia: { url: "/videos/video78/infografia.png", descripcion: "Recursos Naturales" },
    pdf: { url: "/videos/video78/presentacion.pdf", titulo: "Guía: Recursos" },
    podcast: { url: "/videos/video78/podcast.mp3", duracion: "8:30" }
  },
  "geo-3": {
    videoId: "geo-3",
    quiz: { url: "/quiz/video-79-quiz.html" },
    infografia: { url: "/videos/video79/infografia.png", descripcion: "Biosfera y Biodiversidad" },
    pdf: { url: "/videos/video79/presentacion.pdf", titulo: "Guía: Biosfera" },
    podcast: { url: "/videos/video79/podcast.mp3", duracion: "8:30" }
  },
  "geo-4": {
    videoId: "geo-4",
    quiz: { url: "/quiz/video-80-quiz.html" },
    infografia: { url: "/videos/video80/infografia.png", descripcion: "Desarrollo Sustentable" },
    pdf: { url: "/videos/video80/presentacion.pdf", titulo: "Guía: Sustentable" },
    podcast: { url: "/videos/video80/podcast.mp3", duracion: "8:30" }
  },
  "geo-5": {
    videoId: "geo-5",
    quiz: { url: "/quiz/video-81-quiz.html" },
    infografia: { url: "/videos/video81/infografia.png", descripcion: "Población y Migración" },
    pdf: { url: "/videos/video81/presentacion.pdf", titulo: "Guía: Población" },
    podcast: { url: "/videos/video81/podcast.mp3", duracion: "8:30" }
  },
  "geo-6": {
    videoId: "geo-6",
    quiz: { url: "/quiz/video-82-quiz.html" },
    infografia: { url: "/videos/video82/infografia.png", descripcion: "Vulnerabilidad y Resiliencia" },
    pdf: { url: "/videos/video82/presentacion.pdf", titulo: "Guía: Resiliencia" },
    podcast: { url: "/videos/video82/podcast.mp3", duracion: "8:30" }
  },
  "geo-7": {
    videoId: "geo-7",
    quiz: { url: "/quiz/video-83-quiz.html" },
    infografia: { url: "/videos/video83/infografia.png", descripcion: "Economía Global" },
    pdf: { url: "/videos/video83/presentacion.pdf", titulo: "Guía: Economía" },
    podcast: { url: "/videos/video83/podcast.mp3", duracion: "8:30" }
  },
  "geo-8": {
    videoId: "geo-8",
    quiz: { url: "/quiz/video-84-quiz.html" },
    infografia: { url: "/videos/video84/infografia.png", descripcion: "El Mundo Desigual" },
    pdf: { url: "/videos/video84/presentacion.pdf", titulo: "Guía: Desigualdad" },
    podcast: { url: "/videos/video84/podcast.mp3", duracion: "8:30" }
  },
  "geo-9": {
    videoId: "geo-9",
    quiz: { url: "/quiz/video-85-quiz.html" },
    infografia: { url: "/videos/video85/infografia.png", descripcion: "Cultura e Identidad" },
    pdf: { url: "/videos/video85/presentacion.pdf", titulo: "Guía: Cultura" },
    podcast: { url: "/videos/video85/podcast.mp3", duracion: "8:30" }
  },
  "geo-10": {
    videoId: "geo-10",
    quiz: { url: "/quiz/video-86-quiz.html" },
    infografia: { url: "/videos/video86/infografia.png", descripcion: "Patrimonio y Soberanía" },
    pdf: { url: "/videos/video86/presentacion.pdf", titulo: "Guía: Patrimonio" },
    podcast: { url: "/videos/video86/podcast.mp3", duracion: "8:30" }
  },

  // ============================================
  // REPASO FINAL Y ESTRATEGIAS (rep-1 a rep-4) - VIDEOS 87-90
  // ============================================
  "rep-1": {
    videoId: "rep-1",
    quiz: { url: "/quiz/video-87-quiz.html" },
    infografia: { url: "/videos/video87/infografia.png", descripcion: "Repaso Ciencias y Matemáticas" },
    pdf: { url: "/videos/video87/presentacion.pdf", titulo: "Guía: Repaso Ciencias" },
    podcast: { url: "/videos/video87/podcast.mp3", duracion: "8:30" }
  },
  "rep-2": {
    videoId: "rep-2",
    quiz: { url: "/quiz/video-88-quiz.html" },
    infografia: { url: "/videos/video88/infografia.png", descripcion: "Repaso Historia y Sociales" },
    pdf: { url: "/videos/video88/presentacion.pdf", titulo: "Guía: Repaso Historia" },
    podcast: { url: "/videos/video88/podcast.mp3", duracion: "8:30" }
  },
  "rep-3": {
    videoId: "rep-3",
    quiz: { url: "/quiz/video-89-quiz.html" },
    infografia: { url: "/videos/video89/infografia.png", descripcion: "Estrategias Examen en Línea" },
    pdf: { url: "/videos/video89/presentacion.pdf", titulo: "Guía: Estrategias" },
    podcast: { url: "/videos/video89/podcast.mp3", duracion: "8:30" }
  },
  "rep-4": {
    videoId: "rep-4",
    quiz: { url: "/quiz/video-90-quiz.html" },
    infografia: { url: "/videos/video90/infografia.png", descripcion: "Cierre Total" },
    pdf: { url: "/videos/video90/presentacion.pdf", titulo: "Guía: Cierre" },
    podcast: { url: "/videos/video90/podcast.mp3", duracion: "8:30" }
  }
};
