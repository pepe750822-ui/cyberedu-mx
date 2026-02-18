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
  // HABILIDAD VERBAL (hv-1 a hv-5)
  // ============================================
  "hv-1": {
    videoId: "hv-1",
    quiz: { url: "/quiz/video-01-quiz.html" },
    infografia: {
      url: "/videos/video1/infografia.png",
      descripcion: "Infografía: Comprensión Lectora Parte 1 - 5 Subíndices Clave"
    },
    pdf: {
      url: "/videos/video1/presentacion.pdf",
      titulo: "Guía: Comprensión Lectora Parte 1"
    },
    podcast: {
      url: "/videos/video1/podcast.mp3",
      duracion: "8:30"
    }
  },
  "hv-2": {
    videoId: "hv-2",
    quiz: { url: "/quiz/video-02-quiz.html" },
    infografia: {
      url: "/videos/video2/infografia.png",
      descripcion: "Infografía: Comprensión Lectora Parte 2 - 5 Subíndices Avanzados"
    },
    pdf: {
      url: "/videos/video2/presentacion.pdf",
      titulo: "Guía: Comprensión Lectora Parte 2"
    },
    podcast: {
      url: "/videos/video2/podcast.mp3",
      duracion: "8:30"
    }
  },
  "hv-3": {
    videoId: "hv-3",
    quiz: { url: "/quiz/video-03-quiz.html" },
    infografia: {
      url: "/videos/video3/infografia.png",
      descripcion: "Infografía: Manejo de Vocabulario Parte 1 - Analogías, Antónimos y Sinónimos"
    },
    pdf: {
      url: "/videos/video3/presentacion.pdf",
      titulo: "Guía: Manejo de Vocabulario Parte 1"
    },
    podcast: {
      url: "/videos/video3/podcast.mp3",
      duracion: "8:30"
    }
  },
  "hv-4": {
    videoId: "hv-4",
    quiz: { url: "/quiz/video-04-quiz.html" },
    infografia: {
      url: "/videos/video4/infografia.png",
      descripcion: "Infografía: Manejo de Vocabulario Parte 2 - Contexto y Múltiples Significados"
    },
    pdf: {
      url: "/videos/video4/presentacion.pdf",
      titulo: "Guía: Manejo de Vocabulario Parte 2"
    },
    podcast: {
      url: "/videos/video4/podcast.mp3",
      duracion: "8:30"
    }
  },
  "hv-5": {
    videoId: "hv-5",
    quiz: { url: "/quiz/video-05-quiz.html" },
    infografia: {
      url: "/videos/video5/infografia.png",
      descripcion: "Infografía: Integración Total Habilidad Verbal - Aplicación Master"
    },
    pdf: {
      url: "/videos/video5/presentacion.pdf",
      titulo: "Guía: Integración Total Habilidad Verbal"
    },
    podcast: {
      url: "/videos/video5/podcast.mp3",
      duracion: "8:30"
    }
  },

  // ============================================
  // HABILIDAD MATEMÁTICA (hm-1 a hm-5)
  // ============================================
  "hm-1": {
    videoId: "hm-1",
    quiz: { url: "/quiz/video-06-quiz.html" },
    infografia: {
      url: "/videos/video6/infografia.png",
      descripcion: "Infografía: Sucesiones Numéricas - IPN/UNAM 2026"
    },
    pdf: {
      url: "/videos/video6/presentacion.pdf",
      titulo: "Guía: Sucesiones Numéricas"
    },
    podcast: {
      url: "/videos/video6/podcast.mp3",
      duracion: "8:30"
    }
  },
  "hm-2": {
    videoId: "hm-2",
    quiz: { url: "/quiz/video-07-quiz.html" },
    infografia: {
      url: "/videos/video7/infografia.png",
      descripcion: "Infografía: Series Espaciales - IPN/UNAM 2026"
    },
    pdf: {
      url: "/videos/video7/presentacion.pdf",
      titulo: "Guía: Series Espaciales"
    },
    podcast: {
      url: "/videos/video7/podcast.mp3",
      duracion: "8:30"
    }
  },
  "hm-3": {
    videoId: "hm-3",
    quiz: { url: "/quiz/video-08-quiz.html" },
    infografia: {
      url: "/videos/video8/infografia.png",
      descripcion: "Infografía: Imaginación Espacial - Visualización 3D"
    },
    pdf: {
      url: "/videos/video8/presentacion.pdf",
      titulo: "Guía: Imaginación Espacial"
    },
    podcast: {
      url: "/videos/video8/podcast.mp3",
      duracion: "8:30"
    }
  },
  "hm-4": {
    videoId: "hm-4",
    quiz: { url: "/quiz/video-09-quiz.html" },
    infografia: {
      url: "/videos/video9/infografia.png",
      descripcion: "Infografía: Problemas de Razonamiento - Lógica Aplicada"
    },
    pdf: {
      url: "/videos/video9/presentacion.pdf",
      titulo: "Guía: Problemas de Razonamiento"
    },
    podcast: {
      url: "/videos/video9/podcast.mp3",
      duracion: "8:30"
    }
  },
  "hm-5": {
    videoId: "hm-5",
    quiz: { url: "/quiz/video-10-quiz.html" },
    infografia: {
      url: "/videos/video10/infografia.png",
      descripcion: "Infografía: Integración Total Habilidad Matemática - Dominio Completo"
    },
    pdf: {
      url: "/videos/video10/presentacion.pdf",
      titulo: "Guía: Integración Habilidad Matemática"
    },
    podcast: {
      url: "/videos/video10/podcast.mp3",
      duracion: "8:30"
    }
  },

  // ============================================
  // BIOLOGÍA (bio-1 a bio-7)
  // ============================================
  "bio-1": {
    videoId: "bio-1",
    quiz: { url: "/quiz/video-11-quiz.html" },
    infografia: {
      url: "/videos/video11/infografia.png",
      descripcion: "Infografía: Bases de la Biología - Seres Vivos, Darwin, Adaptación"
    },
    pdf: {
      url: "/videos/video11/presentacion.pdf",
      titulo: "Guía: Bases de la Biología"
    },
    podcast: {
      url: "/videos/video11/podcast.mp3",
      duracion: "8:30"
    }
  },
  "bio-2": {
    videoId: "bio-2",
    quiz: { url: "/quiz/video-12-quiz.html" },
    infografia: {
      url: "/videos/video12/infografia.png",
      descripcion: "Infografía: Biodiversidad Mexicana - Conservación y Desarrollo Sustentable"
    },
    pdf: {
      url: "/videos/video12/presentacion.pdf",
      titulo: "Guía: Biodiversidad Mexicana"
    },
    podcast: {
      url: "/videos/video12/podcast.mp3",
      duracion: "8:30"
    }
  },
  "bio-3": {
    videoId: "bio-3",
    quiz: { url: "/quiz/video-13-quiz.html" },
    infografia: {
      url: "/videos/video13/infografia.png",
      descripcion: "Infografía: Metabolismo - Fotosíntesis y Respiración Celular"
    },
    pdf: {
      url: "/videos/video13/presentacion.pdf",
      titulo: "Guía: Metabolismo"
    },
    podcast: {
      url: "/videos/video13/podcast.mp3",
      duracion: "8:30"
    }
  },
  "bio-4": {
    videoId: "bio-4",
    quiz: { url: "/quiz/video-14-quiz.html" },
    infografia: {
      url: "/videos/video14/infografia.png",
      descripcion: "Infografía: Ciclos y Nutrición - Ciclo del Carbono y Alimentación Saludable"
    },
    pdf: {
      url: "/videos/video14/presentacion.pdf",
      titulo: "Guía: Ciclos y Nutrición"
    },
    podcast: {
      url: "/videos/video14/podcast.mp3",
      duracion: "8:30"
    }
  },
  "bio-5": {
    videoId: "bio-5",
    quiz: { url: "/quiz/video-15-quiz.html" },
    infografia: {
      url: "/videos/video15/infografia.png",
      descripcion: "Infografía: Salud y Reproducción - Contaminación, Mitosis y Meiosis"
    },
    pdf: {
      url: "/videos/video15/presentacion.pdf",
      titulo: "Guía: Salud y Reproducción"
    },
    podcast: {
      url: "/videos/video15/podcast.mp3",
      duracion: "8:30"
    }
  },
  "bio-6": {
    videoId: "bio-6",
    quiz: { url: "/quiz/video-16-quiz.html" },
    infografia: {
      url: "/videos/video16/infografia.png",
      descripcion: "Infografía: Genética y Biotecnología - ADN y Manipulación Genética"
    },
    pdf: {
      url: "/videos/video16/presentacion.pdf",
      titulo: "Guía: Genética y Biotecnología"
    },
    podcast: {
      url: "/videos/video16/podcast.mp3",
      duracion: "8:30"
    }
  },
  "bio-7": {
    videoId: "bio-7",
    quiz: { url: "/quiz/video-17-quiz.html" },
    infografia: {
      url: "/videos/video17/infografia.png",
      descripcion: "Infografía: Integración Total Biología - 9.4% del Examen"
    },
    pdf: {
      url: "/videos/video17/presentacion.pdf",
      titulo: "Guía: Integración Biología"
    },
    podcast: {
      url: "/videos/video17/podcast.mp3",
      duracion: "8:30"
    }
  },

  // ============================================
  // FÍSICA (fis-1 a fis-7)
  // ============================================
  "fis-1": {
    videoId: "fis-1",
    quiz: { url: "/quiz/video-18-quiz.html" },
    infografia: {
      url: "/videos/video18/infografia.png",
      descripcion: "Infografía: Introducción a Física - Movimiento, Rapidez y Gráficas"
    },
    pdf: {
      url: "/videos/video18/presentacion.pdf",
      titulo: "Guía: Introducción a Física"
    },
    podcast: {
      url: "/videos/video18/podcast.mp3",
      duracion: "8:30"
    }
  },
  "fis-2": {
    videoId: "fis-2",
    quiz: { url: "/quiz/video-19-quiz.html" },
    infografia: {
      url: "/videos/video19/infografia.png",
      descripcion: "Infografía: Leyes de Newton - Primera y Segunda Ley"
    },
    pdf: {
      url: "/videos/video19/presentacion.pdf",
      titulo: "Guía: Leyes de Newton"
    },
    podcast: {
      url: "/videos/video19/podcast.mp3",
      duracion: "8:30"
    }
  },
  "fis-3": {
    videoId: "fis-3",
    quiz: { url: "/quiz/video-20-quiz.html" },
    infografia: {
      url: "/videos/video20/infografia.png",
      descripcion: "Infografía: Tercera Ley y Fuerzas Especiales - Acción-Reacción"
    },
    pdf: {
      url: "/videos/video20/presentacion.pdf",
      titulo: "Guía: Tercera Ley"
    },
    podcast: {
      url: "/videos/video20/podcast.mp3",
      duracion: "8:30"
    }
  },
  "fis-4": {
    videoId: "fis-4",
    quiz: { url: "/quiz/video-21-quiz.html" },
    infografia: {
      url: "/videos/video21/infografia.png",
      descripcion: "Infografía: Energía y Trabajo - Conservación de Energía Mecánica"
    },
    pdf: {
      url: "/videos/video21/presentacion.pdf",
      titulo: "Guía: Energía y Trabajo"
    },
    podcast: {
      url: "/videos/video21/podcast.mp3",
      duracion: "8:30"
    }
  },
  "fis-5": {
    videoId: "fis-5",
    quiz: { url: "/quiz/video-22-quiz.html" },
    infografia: {
      url: "/videos/video22/infografia.png",
      descripcion: "Infografía: Electricidad y Magnetismo - Cargas, Imanes e Inducción"
    },
    pdf: {
      url: "/videos/video22/presentacion.pdf",
      titulo: "Guía: Electricidad y Magnetismo"
    },
    podcast: {
      url: "/videos/video22/podcast.mp3",
      duracion: "8:30"
    }
  },
  "fis-6": {
    videoId: "fis-6",
    quiz: { url: "/quiz/video-23-quiz.html" },
    infografia: {
      url: "/videos/video23/infografia.png",
      descripcion: "Infografía: Ondas y Luz - Espectro Electromagnético"
    },
    pdf: {
      url: "/videos/video23/presentacion.pdf",
      titulo: "Guía: Ondas y Luz"
    },
    podcast: {
      url: "/videos/video23/podcast.mp3",
      duracion: "8:30"
    }
  },
  "fis-7": {
    videoId: "fis-7",
    quiz: { url: "/quiz/video-24-quiz.html" },
    infografia: {
      url: "/videos/video24/infografia.png",
      descripcion: "Infografía: Física Moderna - Estructura de la Materia y Energía"
    },
    pdf: {
      url: "/videos/video24/presentacion.pdf",
      titulo: "Guía: Física Moderna"
    },
    podcast: {
      url: "/videos/video24/podcast.mp3",
      duracion: "8:30"
    }
  },

  // ============================================
  // QUÍMICA (qui-1 a qui-6)
  // ============================================
  "qui-1": {
    videoId: "qui-1",
    quiz: { url: "/quiz/video-25-quiz.html" },
    infografia: {
      url: "/videos/video25/infografia.png",
      descripcion: "Infografía: Introducción a Química - Materia y Propiedades"
    },
    pdf: {
      url: "/videos/video25/presentacion.pdf",
      titulo: "Guía: Introducción a Química"
    },
    podcast: {
      url: "/videos/video25/podcast.mp3",
      duracion: "8:30"
    }
  },
  "qui-2": {
    videoId: "qui-2",
    quiz: { url: "/quiz/video-26-quiz.html" },
    infografia: {
      url: "/videos/video26/infografia.png",
      descripcion: "Infografía: Estructura Atómica - Protones, Neutrones, Electrones"
    },
    pdf: {
      url: "/videos/video26/presentacion.pdf",
      titulo: "Guía: Estructura Atómica"
    },
    podcast: {
      url: "/videos/video26/podcast.mp3",
      duracion: "8:30"
    }
  },
  "qui-3": {
    videoId: "qui-3",
    quiz: { url: "/quiz/video-27-quiz.html" },
    infografia: {
      url: "/videos/video27/infografia.png",
      descripcion: "Infografía: Tabla Periódica y Estructura de Lewis"
    },
    pdf: {
      url: "/videos/video27/presentacion.pdf",
      titulo: "Guía: Tabla Periódica"
    },
    podcast: {
      url: "/videos/video27/podcast.mp3",
      duracion: "8:30"
    }
  },
  "qui-4": {
    videoId: "qui-4",
    quiz: { url: "/quiz/video-28-quiz.html" },
    infografia: {
      url: "/videos/video28/infografia.png",
      descripcion: "Infografía: Enlaces Químicos - Iónico, Covalente y Metálico"
    },
    pdf: {
      url: "/videos/video28/presentacion.pdf",
      titulo: "Guía: Enlaces Químicos"
    },
    podcast: {
      url: "/videos/video28/podcast.mp3",
      duracion: "8:30"
    }
  },
  "qui-5": {
    videoId: "qui-5",
    quiz: { url: "/quiz/video-29-quiz.html" },
    infografia: {
      url: "/videos/video29/infografia.png",
      descripcion: "Infografía: Reacciones Químicas - Ecuaciones y Balanceo"
    },
    pdf: {
      url: "/videos/video29/presentacion.pdf",
      titulo: "Guía: Reacciones Químicas"
    },
    podcast: {
      url: "/videos/video29/podcast.mp3",
      duracion: "8:30"
    }
  },
  "qui-6": {
    videoId: "qui-6",
    quiz: { url: "/quiz/video-30-quiz.html" },
    infografia: {
      url: "/videos/video30/infografia.png",
      descripcion: "Infografía: Ácidos, Bases y Reacciones Redox - Química Completa"
    },
    pdf: {
      url: "/videos/video30/presentacion.pdf",
      titulo: "Guía: Ácidos, Bases y Redox"
    },
    podcast: {
      url: "/videos/video30/podcast.mp3",
      duracion: "8:30"
    }
  },

  // ============================================
  // MATEMÁTICAS (mat-1 a mat-14)
  // ============================================
  "mat-1": {
    videoId: "mat-1",
    quiz: { url: "/quiz/video-31-quiz.html" },
    infografia: {
      url: "/videos/video31/infografia.png",
      descripcion: "Infografía: Números Enteros y Operaciones"
    },
    pdf: {
      url: "/videos/video31/presentacion.pdf",
      titulo: "Guía: Números Enteros"
    },
    podcast: {
      url: "/videos/video31/podcast.mp3",
      duracion: "8:30"
    }
  },
  "mat-2": {
    videoId: "mat-2",
    quiz: { url: "/quiz/video-32-quiz.html" },
    infografia: {
      url: "/videos/video32/infografia.png",
      descripcion: "Infografía: Fracciones y Decimales - Proporciones y Porcentajes"
    },
    pdf: {
      url: "/videos/video32/presentacion.pdf",
      titulo: "Guía: Fracciones y Decimales"
    },
    podcast: {
      url: "/videos/video32/podcast.mp3",
      duracion: "8:30"
    }
  },
  "mat-3": {
    videoId: "mat-3",
    quiz: { url: "/quiz/video-33-quiz.html" },
    infografia: {
      url: "/videos/video33/infografia.png",
      descripcion: "Infografía: Introducción al Álgebra - Variables y Expresiones"
    },
    pdf: {
      url: "/videos/video33/presentacion.pdf",
      titulo: "Guía: Introducción al Álgebra"
    },
    podcast: {
      url: "/videos/video33/podcast.mp3",
      duracion: "8:30"
    }
  },
  "mat-4": {
    videoId: "mat-4",
    quiz: { url: "/quiz/video-34-quiz.html" },
    infografia: {
      url: "/videos/video34/infografia.png",
      descripcion: "Infografía: Ecuaciones de Primer Grado - Resolución y Aplicaciones"
    },
    pdf: {
      url: "/videos/video34/presentacion.pdf",
      titulo: "Guía: Ecuaciones de Primer Grado"
    },
    podcast: {
      url: "/videos/video34/podcast.mp3",
      duracion: "8:30"
    }
  },
  "mat-5": {
    videoId: "mat-5",
    quiz: { url: "/quiz/video-35-quiz.html" },
    infografia: {
      url: "/videos/video35/infografia.png",
      descripcion: "Infografía: Sistemas de Ecuaciones - Temas 2.6-2.7"
    },
    pdf: {
      url: "/videos/video35/presentacion.pdf",
      titulo: "Guía: Sistemas de Ecuaciones"
    },
    podcast: {
      url: "/videos/video35/podcast.mp3",
      duracion: "8:30"
    }
  },
  "mat-6": {
    videoId: "mat-6",
    quiz: { url: "/quiz/video-36-quiz.html" },
    infografia: {
      url: "/videos/video36/infografia.png",
      descripcion: "Infografía: Ecuaciones Cuadráticas - Temas 2.8-2.9"
    },
    pdf: {
      url: "/videos/video36/presentacion.pdf",
      titulo: "Guía: Ecuaciones Cuadráticas"
    },
    podcast: {
      url: "/videos/video36/podcast.mp3",
      duracion: "8:30"
    }
  },
  "mat-7": {
    videoId: "mat-7",
    quiz: { url: "/quiz/video-37-quiz.html" },
    infografia: {
      url: "/videos/video37/infografia.png",
      descripcion: "Infografía: Proporcionalidad - Temas 2.10-2.11"
    },
    pdf: {
      url: "/videos/video37/presentacion.pdf",
      titulo: "Guía: Proporcionalidad"
    },
    podcast: {
      url: "/videos/video37/podcast.mp3",
      duracion: "8:30"
    }
  },
  "mat-8": {
    videoId: "mat-8",
    quiz: { url: "/quiz/video-38-quiz.html" },
    infografia: {
      url: "/videos/video38/infografia.png",
      descripcion: "Infografía: Estadística Descriptiva - Temas 3.1-3.4"
    },
    pdf: {
      url: "/videos/video38/presentacion.pdf",
      titulo: "Guía: Estadística Descriptiva"
    },
    podcast: {
      url: "/videos/video38/podcast.mp3",
      duracion: "8:30"
    }
  },
  "mat-9": {
    videoId: "mat-9",
    quiz: { url: "/quiz/video-39-quiz.html" },
    infografia: {
      url: "/videos/video39/infografia.png",
      descripcion: "Infografía: Probabilidad Básica - Tema 3.5"
    },
    pdf: {
      url: "/videos/video39/presentacion.pdf",
      titulo: "Guía: Probabilidad Básica"
    },
    podcast: {
      url: "/videos/video39/podcast.mp3",
      duracion: "8:30"
    }
  },
  "mat-10": {
    videoId: "mat-10",
    quiz: { url: "/quiz/video-40-quiz.html" },
    infografia: {
      url: "/videos/video40/infografia.png",
      descripcion: "Infografía: Elementos Básicos de Geometría - Temas 4.1-4.2"
    },
    pdf: {
      url: "/videos/video40/presentacion.pdf",
      titulo: "Guía: Elementos de Geometría"
    },
    podcast: {
      url: "/videos/video40/podcast.mp3",
      duracion: "8:30"
    }
  },
  "mat-11": {
    videoId: "mat-11",
    quiz: { url: "/quiz/video-41-quiz.html" },
    infografia: {
      url: "/videos/video41/infografia.png",
      descripcion: "Infografía: Semejanza y Teorema de Pitágoras - Temas 4.3-4.4"
    },
    pdf: {
      url: "/videos/video41/presentacion.pdf",
      titulo: "Guía: Semejanza y Pitágoras"
    },
    podcast: {
      url: "/videos/video41/podcast.mp3",
      duracion: "8:30"
    }
  },
  "mat-12": {
    videoId: "mat-12",
    quiz: { url: "/quiz/video-42-quiz.html" },
    infografia: {
      url: "/videos/video42/infografia.png",
      descripcion: "Infografía: Razones Trigonométricas - Tema 4.5"
    },
    pdf: {
      url: "/videos/video42/presentacion.pdf",
      titulo: "Guía: Razones Trigonométricas"
    },
    podcast: {
      url: "/videos/video42/podcast.mp3",
      duracion: "8:30"
    }
  },
  "mat-13": {
    videoId: "mat-13",
    quiz: { url: "/quiz/video-43-quiz.html" },
    infografia: {
      url: "/videos/video43/infografia.png",
      descripcion: "Infografía: Perímetros y Áreas - Temas 4.6-4.7"
    },
    pdf: {
      url: "/videos/video43/presentacion.pdf",
      titulo: "Guía: Perímetros y Áreas"
    },
    podcast: {
      url: "/videos/video43/podcast.mp3",
      duracion: "8:30"
    }
  },
  "mat-14": {
    videoId: "mat-14",
    quiz: { url: "/quiz/video-44-quiz.html" },
    infografia: {
      url: "/videos/video44/infografia.png",
      descripcion: "Infografía: Volúmenes - Tema 4.8"
    },
    pdf: {
      url: "/videos/video44/presentacion.pdf",
      titulo: "Guía: Volúmenes"
    },
    podcast: {
      url: "/videos/video44/podcast.mp3",
      duracion: "8:30"
    }
  },

  // ============================================
  // HISTORIA UNIVERSAL (hu-1 a hu-7)
  // ============================================
  "hu-1": {
    videoId: "hu-1",
    quiz: { url: "/quiz/video-45-quiz.html" },
    infografia: {
      url: "/videos/video45/infografia.png",
      descripcion: "Infografía: Renacimiento y Descubrimientos - Historia Universal 1"
    },
    pdf: {
      url: "/videos/video45/presentacion.pdf",
      titulo: "Guía: Renacimiento"
    },
    podcast: {
      url: "/videos/video45/podcast.mp3",
      duracion: "8:30"
    }
  },
  "hu-2": {
    videoId: "hu-2",
    quiz: { url: "/quiz/video-46-quiz.html" },
    infografia: {
      url: "/videos/video46/infografia.png",
      descripcion: "Infografía: Ilustración y Revoluciones Políticas"
    },
    pdf: {
      url: "/videos/video46/presentacion.pdf",
      titulo: "Guía: Ilustración"
    },
    podcast: {
      url: "/videos/video46/podcast.mp3",
      duracion: "8:30"
    }
  },
  "hu-3": {
    videoId: "hu-3",
    quiz: { url: "/quiz/video-47-quiz.html" },
    infografia: {
      url: "/videos/video47/infografia.png",
      descripcion: "Infografía: Revolución Industrial"
    },
    pdf: {
      url: "/videos/video47/presentacion.pdf",
      titulo: "Guía: Revolución Industrial"
    },
    podcast: {
      url: "/videos/video47/podcast.mp3",
      duracion: "8:30"
    }
  },
  "hu-4": {
    videoId: "hu-4",
    quiz: { url: "/quiz/video-48-quiz.html" },
    infografia: {
      url: "/videos/video48/infografia.png",
      descripcion: "Infografía: Imperialismo y Primera Guerra Mundial"
    },
    pdf: {
      url: "/videos/video48/presentacion.pdf",
      titulo: "Guía: Imperialismo y 1GM"
    },
    podcast: {
      url: "/videos/video48/podcast.mp3",
      duracion: "8:30"
    }
  },
  "hu-5": {
    videoId: "hu-5",
    quiz: { url: "/quiz/video-49-quiz.html" },
    infografia: {
      url: "/videos/video49/infografia.png",
      descripcion: "Infografía: Período de Entreguerras"
    },
    pdf: {
      url: "/videos/video49/presentacion.pdf",
      titulo: "Guía: Entreguerras"
    },
    podcast: {
      url: "/videos/video49/podcast.mp3",
      duracion: "8:30"
    }
  },
  "hu-6": {
    videoId: "hu-6",
    quiz: { url: "/quiz/video-50-quiz.html" },
    infografia: {
      url: "/videos/video50/infografia.png",
      descripcion: "Infografía: Segunda Guerra Mundial"
    },
    pdf: {
      url: "/videos/video50/presentacion.pdf",
      titulo: "Guía: Segunda Guerra Mundial"
    },
    podcast: {
      url: "/videos/video50/podcast.mp3",
      duracion: "8:30"
    }
  },
  "hu-7": {
    videoId: "hu-7",
    quiz: { url: "/quiz/video-51-quiz.html" },
    infografia: {
      url: "/videos/video51/infografia.png",
      descripcion: "Infografía: Guerra Fría y Globalización"
    },
    pdf: {
      url: "/videos/video51/presentacion.pdf",
      titulo: "Guía: Guerra Fría"
    },
    podcast: {
      url: "/videos/video51/podcast.mp3",
      duracion: "8:30"
    }
  },

  // ============================================
  // HISTORIA DE MÉXICO (hm-mx-1 a hm-mx-7)
  // ============================================
  "hm-mx-1": {
    videoId: "hm-mx-1",
    quiz: { url: "/quiz/video-52-quiz.html" },
    infografia: {
      url: "/videos/video52/infografia.png",
      descripcion: "Infografía: Culturas Prehispánicas"
    },
    pdf: {
      url: "/videos/video52/presentacion.pdf",
      titulo: "Guía: Culturas Prehispánicas"
    },
    podcast: {
      url: "/videos/video52/podcast.mp3",
      duracion: "8:30"
    }
  },
  "hm-mx-2": {
    videoId: "hm-mx-2",
    quiz: { url: "/quiz/video-53-quiz.html" },
    infografia: {
      url: "/videos/video53/infografia.png",
      descripcion: "Infografía: Conquista de México"
    },
    pdf: {
      url: "/videos/video53/presentacion.pdf",
      titulo: "Guía: Conquista de México"
    },
    podcast: {
      url: "/videos/video53/podcast.mp3",
      duracion: "8:30"
    }
  },
  "hm-mx-3": {
    videoId: "hm-mx-3",
    quiz: { url: "/quiz/video-54-quiz.html" },
    infografia: {
      url: "/videos/video54/infografia.png",
      descripcion: "Infografía: Virreinato de Nueva España"
    },
    pdf: {
      url: "/videos/video54/presentacion.pdf",
      titulo: "Guía: Virreinato"
    },
    podcast: {
      url: "/videos/video54/podcast.mp3",
      duracion: "8:30"
    }
  },
  "hm-mx-4": {
    videoId: "hm-mx-4",
    quiz: { url: "/quiz/video-55-quiz.html" },
    infografia: {
      url: "/videos/video55/infografia.png",
      descripcion: "Infografía: Independencia de México"
    },
    pdf: {
      url: "/videos/video55/presentacion.pdf",
      titulo: "Guía: Independencia"
    },
    podcast: {
      url: "/videos/video55/podcast.mp3",
      duracion: "8:30"
    }
  },
  "hm-mx-5": {
    videoId: "hm-mx-5",
    quiz: { url: "/quiz/video-56-quiz.html" },
    infografia: {
      url: "/videos/video56/infografia.png",
      descripcion: "Infografía: México Siglo XIX"
    },
    pdf: {
      url: "/videos/video56/presentacion.pdf",
      titulo: "Guía: México Siglo XIX"
    },
    podcast: {
      url: "/videos/video56/podcast.mp3",
      duracion: "8:30"
    }
  },
  "hm-mx-6": {
    videoId: "hm-mx-6",
    quiz: { url: "/quiz/video-57-quiz.html" },
    infografia: {
      url: "/videos/video57/infografia.png",
      descripcion: "Infografía: Revolución Mexicana"
    },
    pdf: {
      url: "/videos/video57/presentacion.pdf",
      titulo: "Guía: Revolución Mexicana"
    },
    podcast: {
      url: "/videos/video57/podcast.mp3",
      duracion: "8:30"
    }
  },
  "hm-mx-7": {
    videoId: "hm-mx-7",
    quiz: { url: "/quiz/video-58-quiz.html" },
    infografia: {
      url: "/videos/video58/infografia.png",
      descripcion: "Infografía: México Contemporáneo"
    },
    pdf: {
      url: "/videos/video58/presentacion.pdf",
      titulo: "Guía: México Contemporáneo"
    },
    podcast: {
      url: "/videos/video58/podcast.mp3",
      duracion: "8:30"
    }
  },

  // ============================================
  // ESPAÑOL (esp-1 a esp-10)
  // ============================================
  "esp-1": {
    videoId: "esp-1",
    quiz: { url: "/quiz/video-59-quiz.html" },
    infografia: {
      url: "/videos/video59/infografia.png",
      descripcion: "Infografía: Fundamentos - Fichas Bibliográficas"
    },
    pdf: {
      url: "/videos/video59/presentacion.pdf",
      titulo: "Guía: Fichas Bibliográficas"
    },
    podcast: {
      url: "/videos/video59/podcast.mp3",
      duracion: "8:30"
    }
  },
  "esp-2": {
    videoId: "esp-2",
    quiz: { url: "/quiz/video-60-quiz.html" },
    infografia: {
      url: "/videos/video60/infografia.png",
      descripcion: "Infografía: Coherencia y Cohesión I - Los Nexos"
    },
    pdf: {
      url: "/videos/video60/presentacion.pdf",
      titulo: "Guía: Coherencia y Cohesión I"
    },
    podcast: {
      url: "/videos/video60/podcast.mp3",
      duracion: "8:30"
    }
  },
  "esp-3": {
    videoId: "esp-3",
    quiz: { url: "/quiz/video-61-quiz.html" },
    infografia: {
      url: "/videos/video61/infografia.png",
      descripcion: "Infografía: Coherencia y Cohesión II - Gramática y Puntuación"
    },
    pdf: {
      url: "/videos/video61/presentacion.pdf",
      titulo: "Guía: Coherencia y Cohesión II"
    },
    podcast: {
      url: "/videos/video61/podcast.mp3",
      duracion: "8:30"
    }
  },
  "esp-4": {
    videoId: "esp-4",
    quiz: { url: "/quiz/video-62-quiz.html" },
    infografia: {
      url: "/videos/video62/infografia.png",
      descripcion: "Infografía: Análisis de Textos Informativos"
    },
    pdf: {
      url: "/videos/video62/presentacion.pdf",
      titulo: "Guía: Textos Informativos"
    },
    podcast: {
      url: "/videos/video62/podcast.mp3",
      duracion: "8:30"
    }
  },
  "esp-5": {
    videoId: "esp-5",
    quiz: { url: "/quiz/video-63-quiz.html" },
    infografia: {
      url: "/videos/video63/infografia.png",
      descripcion: "Infografía: Análisis de Textos Publicitarios"
    },
    pdf: {
      url: "/videos/video63/presentacion.pdf",
      titulo: "Guía: Textos Publicitarios"
    },
    podcast: {
      url: "/videos/video63/podcast.mp3",
      duracion: "8:30"
    }
  },
  "esp-6": {
    videoId: "esp-6",
    quiz: { url: "/quiz/video-64-quiz.html" },
    infografia: {
      url: "/videos/video64/infografia.png",
      descripcion: "Infografía: Textos Literarios I - Narrativa"
    },
    pdf: {
      url: "/videos/video64/presentacion.pdf",
      titulo: "Guía: Narrativa"
    },
    podcast: {
      url: "/videos/video64/podcast.mp3",
      duracion: "8:30"
    }
  },
  "esp-7": {
    videoId: "esp-7",
    quiz: { url: "/quiz/video-65-quiz.html" },
    infografia: {
      url: "/videos/video65/infografia.png",
      descripcion: "Infografía: Textos Literarios II - Lírica y Dramática"
    },
    pdf: {
      url: "/videos/video65/presentacion.pdf",
      titulo: "Guía: Lírica y Dramática"
    },
    podcast: {
      url: "/videos/video65/podcast.mp3",
      duracion: "8:30"
    }
  },
  "esp-8": {
    videoId: "esp-8",
    quiz: { url: "/quiz/video-66-quiz.html" },
    infografia: {
      url: "/videos/video66/infografia.png",
      descripcion: "Infografía: Ortografía Estratégica"
    },
    pdf: {
      url: "/videos/video66/presentacion.pdf",
      titulo: "Guía: Ortografía"
    },
    podcast: {
      url: "/videos/video66/podcast.mp3",
      duracion: "8:30"
    }
  },
  "esp-9": {
    videoId: "esp-9",
    quiz: { url: "/quiz/video-67-quiz.html" },
    infografia: {
      url: "/videos/video67/infografia.png",
      descripcion: "Infografía: Redacción Efectiva"
    },
    pdf: {
      url: "/videos/video67/presentacion.pdf",
      titulo: "Guía: Redacción"
    },
    podcast: {
      url: "/videos/video67/podcast.mp3",
      duracion: "8:30"
    }
  },
  "esp-10": {
    videoId: "esp-10",
    quiz: { url: "/quiz/video-68-quiz.html" },
    infografia: {
      url: "/videos/video68/infografia.png",
      descripcion: "Infografía: Integración Total Español"
    },
    pdf: {
      url: "/videos/video68/presentacion.pdf",
      titulo: "Guía: Integración Español"
    },
    podcast: {
      url: "/videos/video68/podcast.mp3",
      duracion: "8:30"
    }
  },

  // ============================================
  // FORMACIÓN CÍVICA Y ÉTICA (fce-1 a fce-8)
  // ============================================
  "fce-1": {
    videoId: "fce-1",
    quiz: { url: "/quiz/video-69-quiz.html" },
    infografia: {
      url: "/videos/video69/infografia.png",
      descripcion: "Infografía: Fundamentos Personales e Interculturalidad"
    },
    pdf: {
      url: "/videos/video69/presentacion.pdf",
      titulo: "Guía: Fundamentos Personales"
    },
    podcast: {
      url: "/videos/video69/podcast.mp3",
      duracion: "8:30"
    }
  },
  "fce-2": {
    videoId: "fce-2",
    quiz: { url: "/quiz/video-70-quiz.html" },
    infografia: {
      url: "/videos/video70/infografia.png",
      descripcion: "Infografía: Adolescencia y Sociedad"
    },
    pdf: {
      url: "/videos/video70/presentacion.pdf",
      titulo: "Guía: Adolescencia"
    },
    podcast: {
      url: "/videos/video70/podcast.mp3",
      duracion: "8:30"
    }
  },
  "fce-3": {
    videoId: "fce-3",
    quiz: { url: "/quiz/video-71-quiz.html" },
    infografia: {
      url: "/videos/video71/infografia.png",
      descripcion: "Infografía: El Estado Mexicano"
    },
    pdf: {
      url: "/videos/video71/presentacion.pdf",
      titulo: "Guía: Estado Mexicano"
    },
    podcast: {
      url: "/videos/video71/podcast.mp3",
      duracion: "8:30"
    }
  },
  "fce-4": {
    videoId: "fce-4",
    quiz: { url: "/quiz/video-72-quiz.html" },
    infografia: {
      url: "/videos/video72/infografia.png",
      descripcion: "Infografía: Democracia y Derechos Humanos"
    },
    pdf: {
      url: "/videos/video72/presentacion.pdf",
      titulo: "Guía: Democracia"
    },
    podcast: {
      url: "/videos/video72/podcast.mp3",
      duracion: "8:30"
    }
  },
  "fce-5": {
    videoId: "fce-5",
    quiz: { url: "/quiz/video-73-quiz.html" },
    infografia: {
      url: "/videos/video73/infografia.png",
      descripcion: "Infografía: Sistema de Partidos y Elecciones"
    },
    pdf: {
      url: "/videos/video73/presentacion.pdf",
      titulo: "Guía: Sistema de Partidos"
    },
    podcast: {
      url: "/videos/video73/podcast.mp3",
      duracion: "8:30"
    }
  },
  "fce-6": {
    videoId: "fce-6",
    quiz: { url: "/quiz/video-74-quiz.html" },
    infografia: {
      url: "/videos/video74/infografia.png",
      descripcion: "Infografía: Organizaciones de la Sociedad Civil"
    },
    pdf: {
      url: "/videos/video74/presentacion.pdf",
      titulo: "Guía: Sociedad Civil"
    },
    podcast: {
      url: "/videos/video74/podcast.mp3",
      duracion: "8:30"
    }
  },
  "fce-7": {
    videoId: "fce-7",
    quiz: { url: "/quiz/video-75-quiz.html" },
    infografia: {
      url: "/videos/video75/infografia.png",
      descripcion: "Infografía: Medios de Comunicación y Opinión Pública"
    },
    pdf: {
      url: "/videos/video75/presentacion.pdf",
      titulo: "Guía: Medios de Comunicación"
    },
    podcast: {
      url: "/videos/video75/podcast.mp3",
      duracion: "8:30"
    }
  },
  "fce-8": {
    videoId: "fce-8",
    quiz: { url: "/quiz/video-76-quiz.html" },
    infografia: {
      url: "/videos/video76/infografia.png",
      descripcion: "Infografía: Corrupción y Transparencia"
    },
    pdf: {
      url: "/videos/video76/presentacion.pdf",
      titulo: "Guía: Corrupción"
    },
    podcast: {
      url: "/videos/video76/podcast.mp3",
      duracion: "8:30"
    }
  },

  // ============================================
  // GEOGRAFÍA (geo-1 a geo-10)
  // ============================================
  "geo-1": {
    videoId: "geo-1",
    quiz: { url: "/quiz/video-77-quiz.html" },
    infografia: {
      url: "/videos/video77/infografia.png",
      descripcion: "Infografía: El Espacio Geográfico y los Mapas"
    },
    pdf: {
      url: "/videos/video77/presentacion.pdf",
      titulo: "Guía: Espacio Geográfico"
    },
    podcast: {
      url: "/videos/video77/podcast.mp3",
      duracion: "8:30"
    }
  },
  "geo-2": {
    videoId: "geo-2",
    quiz: { url: "/quiz/video-78-quiz.html" },
    infografia: {
      url: "/videos/video78/infografia.png",
      descripcion: "Infografía: Recursos Naturales y Preservación"
    },
    pdf: {
      url: "/videos/video78/presentacion.pdf",
      titulo: "Guía: Recursos Naturales"
    },
    podcast: {
      url: "/videos/video78/podcast.mp3",
      duracion: "8:30"
    }
  },
  "geo-3": {
    videoId: "geo-3",
    quiz: { url: "/quiz/video-79-quiz.html" },
    infografia: {
      url: "/videos/video79/infografia.png",
      descripcion: "Infografía: Biosfera y Biodiversidad"
    },
    pdf: {
      url: "/videos/video79/presentacion.pdf",
      titulo: "Guía: Biosfera"
    },
    podcast: {
      url: "/videos/video79/podcast.mp3",
      duracion: "8:30"
    }
  },
  "geo-4": {
    videoId: "geo-4",
    quiz: { url: "/quiz/video-80-quiz.html" },
    infografia: {
      url: "/videos/video80/infografia.png",
      descripcion: "Infografía: Desarrollo Sustentable"
    },
    pdf: {
      url: "/videos/video80/presentacion.pdf",
      titulo: "Guía: Desarrollo Sustentable"
    },
    podcast: {
      url: "/videos/video80/podcast.mp3",
      duracion: "8:30"
    }
  },
  "geo-5": {
    videoId: "geo-5",
    quiz: { url: "/quiz/video-81-quiz.html" },
    infografia: {
      url: "/videos/video81/infografia.png",
      descripcion: "Infografía: Población y Migración"
    },
    pdf: {
      url: "/videos/video81/presentacion.pdf",
      titulo: "Guía: Población"
    },
    podcast: {
      url: "/videos/video81/podcast.mp3",
      duracion: "8:30"
    }
  },
  "geo-6": {
    videoId: "geo-6",
    quiz: { url: "/quiz/video-82-quiz.html" },
    infografia: {
      url: "/videos/video82/infografia.png",
      descripcion: "Infografía: Vulnerabilidad y Resiliencia"
    },
    pdf: {
      url: "/videos/video82/presentacion.pdf",
      titulo: "Guía: Vulnerabilidad"
    },
    podcast: {
      url: "/videos/video82/podcast.mp3",
      duracion: "8:30"
    }
  },
  "geo-7": {
    videoId: "geo-7",
    quiz: { url: "/quiz/video-83-quiz.html" },
    infografia: {
      url: "/videos/video83/infografia.png",
      descripcion: "Infografía: Economía Global"
    },
    pdf: {
      url: "/videos/video83/presentacion.pdf",
      titulo: "Guía: Economía Global"
    },
    podcast: {
      url: "/videos/video83/podcast.mp3",
      duracion: "8:30"
    }
  },
  "geo-8": {
    videoId: "geo-8",
    quiz: { url: "/quiz/video-84-quiz.html" },
    infografia: {
      url: "/videos/video84/infografia.png",
      descripcion: "Infografía: El Mundo Desigual"
    },
    pdf: {
      url: "/videos/video84/presentacion.pdf",
      titulo: "Guía: Desigualdad Global"
    },
    podcast: {
      url: "/videos/video84/podcast.mp3",
      duracion: "8:30"
    }
  },
  "geo-9": {
    videoId: "geo-9",
    quiz: { url: "/quiz/video-85-quiz.html" },
    infografia: {
      url: "/videos/video85/infografia.png",
      descripcion: "Infografía: Cultura, Identidad y Fronteras"
    },
    pdf: {
      url: "/videos/video85/presentacion.pdf",
      titulo: "Guía: Cultura e Identidad"
    },
    podcast: {
      url: "/videos/video85/podcast.mp3",
      duracion: "8:30"
    }
  },
  "geo-10": {
    videoId: "geo-10",
    quiz: { url: "/quiz/video-86-quiz.html" },
    infografia: {
      url: "/videos/video86/infografia.png",
      descripcion: "Infografía: Patrimonio y Soberanía"
    },
    pdf: {
      url: "/videos/video86/presentacion.pdf",
      titulo: "Guía: Patrimonio"
    },
    podcast: {
      url: "/videos/video86/podcast.mp3",
      duracion: "8:30"
    }
  },

  // ============================================
  // REPASO FINAL Y ESTRATEGIAS (rep-1 a rep-4)
  // ============================================
  "rep-1": {
    videoId: "rep-1",
    quiz: { url: "/quiz/video-87-quiz.html" },
    infografia: {
      url: "/videos/video87/infografia.png",
      descripcion: "Infografía: Repaso Estratégico I - Ciencias y Matemáticas"
    },
    pdf: {
      url: "/videos/video87/presentacion.pdf",
      titulo: "Guía: Repaso Ciencias"
    },
    podcast: {
      url: "/videos/video87/podcast.mp3",
      duracion: "8:30"
    }
  },
  "rep-2": {
    videoId: "rep-2",
    quiz: { url: "/quiz/video-88-quiz.html" },
    infografia: {
      url: "/videos/video88/infografia.png",
      descripcion: "Infografía: Repaso Estratégico II - Historia y Ciencias Sociales"
    },
    pdf: {
      url: "/videos/video88/presentacion.pdf",
      titulo: "Guía: Repaso Historia"
    },
    podcast: {
      url: "/videos/video88/podcast.mp3",
      duracion: "8:30"
    }
  },
  "rep-3": {
    videoId: "rep-3",
    quiz: { url: "/quiz/video-89-quiz.html" },
    infografia: {
      url: "/videos/video89/infografia.png",
      descripcion: "Infografía: Estrategias Finales - Examen en Línea"
    },
    pdf: {
      url: "/videos/video89/presentacion.pdf",
      titulo: "Guía: Estrategias Finales"
    },
    podcast: {
      url: "/videos/video89/podcast.mp3",
      duracion: "8:30"
    }
  },
  "rep-4": {
    videoId: "rep-4",
    quiz: { url: "/quiz/video-90-quiz.html" },
    infografia: {
      url: "/videos/video90/infografia.png",
      descripcion: "Infografía: Cierre Total - Tu Puente Hacia el Bachillerato"
    },
    pdf: {
      url: "/videos/video90/presentacion.pdf",
      titulo: "Guía: Cierre Total"
    },
    podcast: {
      url: "/videos/video90/podcast.mp3",
      duracion: "8:30"
    }
  }
};
