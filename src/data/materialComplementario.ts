export interface MaterialVideo {
  videoId: string;
  quiz?: {
    url: string;
  };
  infografia?: {
    url: string;
    descripcion: string;
  };
  pdf?: {
    url: string;
    titulo: string;
  };
  podcast?: {
    url: string;
    duracion?: string;
  };
}

export const materiales: Record<string, MaterialVideo> = {
  // ============================================
  // VIDEO 00 - Presentación (sin quiz)
  // ============================================
  "video-00": {
    videoId: "video-00",
    infografia: {
      url: "/videos/video0/infografia.png",
      descripcion: "Infografía de presentación del curso ECOEMS 2026"
    },
    pdf: {
      url: "/videos/video0/presentacion.pdf",
      titulo: "Presentación del curso ECOEMS 2026"
    },
    podcast: {
      url: "/videos/video0/podcast.mp3",
      duracion: "8:30"
    }
    // Sin quiz - no aparece la pestaña de quiz
  },

  // ============================================
  // VIDEO 01 - Habilidad Verbal (con quiz)
  // ============================================
  "video-01": {
    videoId: "video-01",
    quiz: {
      url: "/quiz/video-01-quiz.html"
    },
    infografia: {
      url: "/videos/video1/infografia.png",
      descripcion: "Infografía: Comprensión Lectora Parte 1"
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

  // ============================================
  // VIDEO 02 - Habilidad Verbal Avanzada (con quiz)
  // ============================================
  "video-02": {
    videoId: "video-02",
    quiz: {
      url: "/quiz/video-02-quiz.html"
    },
    infografia: {
      url: "/videos/video2/infografia.png",
      descripcion: "Infografía: Comprensión Lectora Parte 2"
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

  // ============================================
  // VIDEO 03 - Vocabulario (con quiz)
  // ============================================
  "video-03": {
    videoId: "video-03",
    quiz: {
      url: "/quiz/video-03-quiz.html"
    },
    infografia: {
      url: "/videos/video3/infografia.png",
      descripcion: "Infografía: Analogías y Sinónimos"
    },
    pdf: {
      url: "/videos/video3/presentacion.pdf",
      titulo: "Guía: Analogías y Sinónimos"
    },
    podcast: {
      url: "/videos/video3/podcast.mp3",
      duracion: "8:30"
    }
  },

  // ============================================
  // VIDEO 04 - Vocabulario Avanzado (con quiz)
  // ============================================
  "video-04": {
    videoId: "video-04",
    quiz: {
      url: "/quiz/video-04-quiz.html"
    },
    infografia: {
      url: "/videos/video4/infografia.png",
      descripcion: "Infografía: Contexto y Expresiones"
    },
    pdf: {
      url: "/videos/video4/presentacion.pdf",
      titulo: "Guía: Contexto y Expresiones"
    },
    podcast: {
      url: "/videos/video4/podcast.mp3",
      duracion: "8:30"
    }
  },

  // ============================================
  // VIDEO 05 - Integración HV (con quiz)
  // ============================================
  "video-05": {
    videoId: "video-05",
    quiz: {
      url: "/quiz/video-05-quiz.html"
    },
    infografia: {
      url: "/videos/video5/infografia.png",
      descripcion: "Infografía: Integración Habilidad Verbal"
    },
    pdf: {
      url: "/videos/video5/presentacion.pdf",
      titulo: "Guía: Integración Habilidad Verbal"
    },
    podcast: {
      url: "/videos/video5/podcast.mp3",
      duracion: "8:30"
    }
  },

  // ============================================
  // VIDEO 06 - Sucesiones Numéricas (con quiz)
  // ============================================
  "video-06": {
    videoId: "video-06",
    quiz: {
      url: "/quiz/video-06-quiz.html"
    },
    infografia: {
      url: "/videos/video6/infografia.png",
      descripcion: "Infografía: Sucesiones Numéricas"
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

  // ============================================
  // VIDEO 07 - Series Espaciales (con quiz)
  // ============================================
  "video-07": {
    videoId: "video-07",
    quiz: {
      url: "/quiz/video-07-quiz.html"
    },
    infografia: {
      url: "/videos/video7/infografia.png",
      descripcion: "Infografía: Series Espaciales"
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

  // ============================================
  // VIDEO 08 - Imaginación Espacial (con quiz)
  // ============================================
  "video-08": {
    videoId: "video-08",
    quiz: {
      url: "/quiz/video-08-quiz.html"
    },
    infografia: {
      url: "/videos/video8/infografia.png",
      descripcion: "Infografía: Imaginación Espacial"
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

  // ============================================
  // VIDEO 09 - Problemas de Razonamiento (con quiz)
  // ============================================
  "video-09": {
    videoId: "video-09",
    quiz: {
      url: "/quiz/video-09-quiz.html"
    },
    infografia: {
      url: "/videos/video9/infografia.png",
      descripcion: "Infografía: Problemas de Razonamiento"
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

  // ============================================
  // VIDEO 10 - Integración Matemática (con quiz)
  // ============================================
  "video-10": {
    videoId: "video-10",
    quiz: {
      url: "/quiz/video-10-quiz.html"
    },
    infografia: {
      url: "/videos/video10/infografia.png",
      descripcion: "Infografía: Integración Matemática"
    },
    pdf: {
      url: "/videos/video10/presentacion.pdf",
      titulo: "Guía: Integración Matemática"
    },
    podcast: {
      url: "/videos/video10/podcast.mp3",
      duracion: "8:30"
    }
  },

  // ============================================
  // VIDEO 11 - Bases de Biología (con quiz)
  // ============================================
  "video-11": {
    videoId: "video-11",
    quiz: {
      url: "/quiz/video-11-quiz.html"
    },
    infografia: {
      url: "/videos/video11/infografia.png",
      descripcion: "Infografía: Bases de la Biología"
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

  // ============================================
  // VIDEO 12 - Biodiversidad (con quiz)
  // ============================================
  "video-12": {
    videoId: "video-12",
    quiz: {
      url: "/quiz/video-12-quiz.html"
    },
    infografia: {
      url: "/videos/video12/infografia.png",
      descripcion: "Infografía: Biodiversidad Mexicana"
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

  // ============================================
  // VIDEO 13 - Metabolismo (con quiz)
  // ============================================
  "video-13": {
    videoId: "video-13",
    quiz: {
      url: "/quiz/video-13-quiz.html"
    },
    infografia: {
      url: "/videos/video13/infografia.png",
      descripcion: "Infografía: Metabolismo"
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

  // ============================================
  // VIDEO 14 - Ciclos y Nutrición (con quiz)
  // ============================================
  "video-14": {
    videoId: "video-14",
    quiz: {
      url: "/quiz/video-14-quiz.html"
    },
    infografia: {
      url: "/videos/video14/infografia.png",
      descripcion: "Infografía: Ciclos y Nutrición"
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

  // ============================================
  // VIDEO 15 - Salud y Reproducción (con quiz)
  // ============================================
  "video-15": {
    videoId: "video-15",
    quiz: {
      url: "/quiz/video-15-quiz.html"
    },
    infografia: {
      url: "/videos/video15/infografia.png",
      descripcion: "Infografía: Salud y Reproducción"
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

  // ============================================
  // VIDEO 16 - Genética y Biotecnología (con quiz)
  // ============================================
  "video-16": {
    videoId: "video-16",
    quiz: {
      url: "/quiz/video-16-quiz.html"
    },
    infografia: {
      url: "/videos/video16/infografia.png",
      descripcion: "Infografía: Genética y Biotecnología"
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

  // ============================================
  // VIDEO 17 - Integración Biología (con quiz)
  // ============================================
  "video-17": {
    videoId: "video-17",
    quiz: {
      url: "/quiz/video-17-quiz.html"
    },
    infografia: {
      url: "/videos/video17/infografia.png",
      descripcion: "Infografía: Integración Biología"
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
  // VIDEO 18 - Introducción a Física (con quiz)
  // ============================================
  "video-18": {
    videoId: "video-18",
    quiz: {
      url: "/quiz/video-18-quiz.html"
    },
    infografia: {
      url: "/videos/video18/infografia.png",
      descripcion: "Infografía: Introducción a Física"
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

  // ============================================
  // VIDEO 19 - Leyes de Newton (con quiz)
  // ============================================
  "video-19": {
    videoId: "video-19",
    quiz: {
      url: "/quiz/video-19-quiz.html"
    },
    infografia: {
      url: "/videos/video19/infografia.png",
      descripcion: "Infografía: Leyes de Newton"
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

  // ============================================
  // VIDEO 20 - Energía y Trabajo (con quiz)
  // ============================================
  "video-20": {
    videoId: "video-20",
    quiz: {
      url: "/quiz/video-20-quiz.html"
    },
    infografia: {
      url: "/videos/video20/infografia.png",
      descripcion: "Infografía: Energía y Trabajo"
    },
    pdf: {
      url: "/videos/video20/presentacion.pdf",
      titulo: "Guía: Energía y Trabajo"
    },
    podcast: {
      url: "/videos/video20/podcast.mp3",
      duracion: "8:30"
    }
  },

  // ============================================
  // VIDEO 21 - Electricidad y Magnetismo (con quiz)
  // ============================================
  "video-21": {
    videoId: "video-21",
    quiz: {
      url: "/quiz/video-21-quiz.html"
    },
    infografia: {
      url: "/videos/video21/infografia.png",
      descripcion: "Infografía: Electricidad y Magnetismo"
    },
    pdf: {
      url: "/videos/video21/presentacion.pdf",
      titulo: "Guía: Electricidad y Magnetismo"
    },
    podcast: {
      url: "/videos/video21/podcast.mp3",
      duracion: "8:30"
    }
  },

  // ============================================
  // VIDEO 22 - Ondas y Luz (con quiz)
  // ============================================
  "video-22": {
    videoId: "video-22",
    quiz: {
      url: "/quiz/video-22-quiz.html"
    },
    infografia: {
      url: "/videos/video22/infografia.png",
      descripcion: "Infografía: Ondas y Luz"
    },
    pdf: {
      url: "/videos/video22/presentacion.pdf",
      titulo: "Guía: Ondas y Luz"
    },
    podcast: {
      url: "/videos/video22/podcast.mp3",
      duracion: "8:30"
    }
  },

  // ============================================
  // VIDEO 23 - Física Moderna (con quiz)
  // ============================================
  "video-23": {
    videoId: "video-23",
    quiz: {
      url: "/quiz/video-23-quiz.html"
    },
    infografia: {
      url: "/videos/video23/infografia.png",
      descripcion: "Infografía: Física Moderna"
    },
    pdf: {
      url: "/videos/video23/presentacion.pdf",
      titulo: "Guía: Física Moderna"
    },
    podcast: {
      url: "/videos/video23/podcast.mp3",
      duracion: "8:30"
    }
  },

  // ============================================
  // VIDEO 24 - Integración Física (con quiz)
  // ============================================
  "video-24": {
    videoId: "video-24",
    quiz: {
      url: "/quiz/video-24-quiz.html"
    },
    infografia: {
      url: "/videos/video24/infografia.png",
      descripcion: "Infografía: Integración Física"
    },
    pdf: {
      url: "/videos/video24/presentacion.pdf",
      titulo: "Guía: Integración Física"
    },
    podcast: {
      url: "/videos/video24/podcast.mp3",
      duracion: "8:30"
    }
  },

  // ============================================
  // VIDEO 25 - Introducción a Química (con quiz)
  // ============================================
  "video-25": {
    videoId: "video-25",
    quiz: {
      url: "/quiz/video-25-quiz.html"
    },
    infografia: {
      url: "/videos/video25/infografia.png",
      descripcion: "Infografía: Introducción a Química"
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

  // ============================================
  // VIDEO 26 - Estructura Atómica (con quiz)
  // ============================================
  "video-26": {
    videoId: "video-26",
    quiz: {
      url: "/quiz/video-26-quiz.html"
    },
    infografia: {
      url: "/videos/video26/infografia.png",
      descripcion: "Infografía: Estructura Atómica"
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

  // ============================================
  // VIDEO 27 - Tabla Periódica (con quiz)
  // ============================================
  "video-27": {
    videoId: "video-27",
    quiz: {
      url: "/quiz/video-27-quiz.html"
    },
    infografia: {
      url: "/videos/video27/infografia.png",
      descripcion: "Infografía: Tabla Periódica"
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

  // ============================================
  // VIDEO 28 - Enlaces Químicos (con quiz)
  // ============================================
  "video-28": {
    videoId: "video-28",
    quiz: {
      url: "/quiz/video-28-quiz.html"
    },
    infografia: {
      url: "/videos/video28/infografia.png",
      descripcion: "Infografía: Enlaces Químicos"
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

  // ============================================
  // VIDEO 29 - Reacciones Químicas (con quiz)
  // ============================================
  "video-29": {
    videoId: "video-29",
    quiz: {
      url: "/quiz/video-29-quiz.html"
    },
    infografia: {
      url: "/videos/video29/infografia.png",
      descripcion: "Infografía: Reacciones Químicas"
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

  // ============================================
  // VIDEO 30 - Ácidos y Redox (con quiz)
  // ============================================
  "video-30": {
    videoId: "video-30",
    quiz: {
      url: "/quiz/video-30-quiz.html"
    },
    infografia: {
      url: "/videos/video30/infografia.png",
      descripcion: "Infografía: Ácidos y Redox"
    },
    pdf: {
      url: "/videos/video30/presentacion.pdf",
      titulo: "Guía: Ácidos y Redox"
    },
    podcast: {
      url: "/videos/video30/podcast.mp3",
      duracion: "8:30"
    }
  },

  // ============================================
  // VIDEO 31 - Integración Química (con quiz)
  // ============================================
  "video-31": {
    videoId: "video-31",
    quiz: {
      url: "/quiz/video-31-quiz.html"
    },
    infografia: {
      url: "/videos/video31/infografia.png",
      descripcion: "Infografía: Integración Química"
    },
    pdf: {
      url: "/videos/video31/presentacion.pdf",
      titulo: "Guía: Integración Química"
    },
    podcast: {
      url: "/videos/video31/podcast.mp3",
      duracion: "8:30"
    }
  },

  // ============================================
  // VIDEO 32 - Números Enteros (con quiz)
  // ============================================
  "video-32": {
    videoId: "video-32",
    quiz: {
      url: "/quiz/video-32-quiz.html"
    },
    infografia: {
      url: "/videos/video32/infografia.png",
      descripcion: "Infografía: Números Enteros"
    },
    pdf: {
      url: "/videos/video32/presentacion.pdf",
      titulo: "Guía: Números Enteros"
    },
    podcast: {
      url: "/videos/video32/podcast.mp3",
      duracion: "8:30"
    }
  },

  // ============================================
  // VIDEO 33 - Fracciones y Decimales (con quiz)
  // ============================================
  "video-33": {
    videoId: "video-33",
    quiz: {
      url: "/quiz/video-33-quiz.html"
    },
    infografia: {
      url: "/videos/video33/infografia.png",
      descripcion: "Infografía: Fracciones y Decimales"
    },
    pdf: {
      url: "/videos/video33/presentacion.pdf",
      titulo: "Guía: Fracciones y Decimales"
    },
    podcast: {
      url: "/videos/video33/podcast.mp3",
      duracion: "8:30"
    }
  },

  // ============================================
  // VIDEO 34 - Introducción al Álgebra (con quiz)
  // ============================================
  "video-34": {
    videoId: "video-34",
    quiz: {
      url: "/quiz/video-34-quiz.html"
    },
    infografia: {
      url: "/videos/video34/infografia.png",
      descripcion: "Infografía: Introducción al Álgebra"
    },
    pdf: {
      url: "/videos/video34/presentacion.pdf",
      titulo: "Guía: Introducción al Álgebra"
    },
    podcast: {
      url: "/videos/video34/podcast.mp3",
      duracion: "8:30"
    }
  },

  // ============================================
  // VIDEO 35 - Ecuaciones de Primer Grado (con quiz)
  // ============================================
  "video-35": {
    videoId: "video-35",
    quiz: {
      url: "/quiz/video-35-quiz.html"
    },
    infografia: {
      url: "/videos/video35/infografia.png",
      descripcion: "Infografía: Ecuaciones de Primer Grado"
    },
    pdf: {
      url: "/videos/video35/presentacion.pdf",
      titulo: "Guía: Ecuaciones de Primer Grado"
    },
    podcast: {
      url: "/videos/video35/podcast.mp3",
      duracion: "8:30"
    }
  },

  // ============================================
  // VIDEO 36 - Sistemas de Ecuaciones (con quiz)
  // ============================================
  "video-36": {
    videoId: "video-36",
    quiz: {
      url: "/quiz/video-36-quiz.html"
    },
    infografia: {
      url: "/videos/video36/infografia.png",
      descripcion: "Infografía: Sistemas de Ecuaciones"
    },
    pdf: {
      url: "/videos/video36/presentacion.pdf",
      titulo: "Guía: Sistemas de Ecuaciones"
    },
    podcast: {
      url: "/videos/video36/podcast.mp3",
      duracion: "8:30"
    }
  },

  // ============================================
  // VIDEO 37 - Ecuaciones Cuadráticas (con quiz)
  // ============================================
  "video-37": {
    videoId: "video-37",
    quiz: {
      url: "/quiz/video-37-quiz.html"
    },
    infografia: {
      url: "/videos/video37/infografia.png",
      descripcion: "Infografía: Ecuaciones Cuadráticas"
    },
    pdf: {
      url: "/videos/video37/presentacion.pdf",
      titulo: "Guía: Ecuaciones Cuadráticas"
    },
    podcast: {
      url: "/videos/video37/podcast.mp3",
      duracion: "8:30"
    }
  },

  // ============================================
  // VIDEO 38 - Proporcionalidad (con quiz)
  // ============================================
  "video-38": {
    videoId: "video-38",
    quiz: {
      url: "/quiz/video-38-quiz.html"
    },
    infografia: {
      url: "/videos/video38/infografia.png",
      descripcion: "Infografía: Proporcionalidad"
    },
    pdf: {
      url: "/videos/video38/presentacion.pdf",
      titulo: "Guía: Proporcionalidad"
    },
    podcast: {
      url: "/videos/video38/podcast.mp3",
      duracion: "8:30"
    }
  },

  // ============================================
  // VIDEO 39 - Estadística Descriptiva (con quiz)
  // ============================================
  "video-39": {
    videoId: "video-39",
    quiz: {
      url: "/quiz/video-39-quiz.html"
    },
    infografia: {
      url: "/videos/video39/infografia.png",
      descripcion: "Infografía: Estadística Descriptiva"
    },
    pdf: {
      url: "/videos/video39/presentacion.pdf",
      titulo: "Guía: Estadística Descriptiva"
    },
    podcast: {
      url: "/videos/video39/podcast.mp3",
      duracion: "8:30"
    }
  },

  // ============================================
  // VIDEO 40 - Probabilidad Básica (con quiz)
  // ============================================
  "video-40": {
    videoId: "video-40",
    quiz: {
      url: "/quiz/video-40-quiz.html"
    },
    infografia: {
      url: "/videos/video40/infografia.png",
      descripcion: "Infografía: Probabilidad Básica"
    },
    pdf: {
      url: "/videos/video40/presentacion.pdf",
      titulo: "Guía: Probabilidad Básica"
    },
    podcast: {
      url: "/videos/video40/podcast.mp3",
      duracion: "8:30"
    }
  },

  // ============================================
  // VIDEO 41 - Elementos de Geometría (con quiz)
  // ============================================
  "video-41": {
    videoId: "video-41",
    quiz: {
      url: "/quiz/video-41-quiz.html"
    },
    infografia: {
      url: "/videos/video41/infografia.png",
      descripcion: "Infografía: Elementos de Geometría"
    },
    pdf: {
      url: "/videos/video41/presentacion.pdf",
      titulo: "Guía: Elementos de Geometría"
    },
    podcast: {
      url: "/videos/video41/podcast.mp3",
      duracion: "8:30"
    }
  },

  // ============================================
  // VIDEO 42 - Semejanza y Pitágoras (con quiz)
  // ============================================
  "video-42": {
    videoId: "video-42",
    quiz: {
      url: "/quiz/video-42-quiz.html"
    },
    infografia: {
      url: "/videos/video42/infografia.png",
      descripcion: "Infografía: Semejanza y Pitágoras"
    },
    pdf: {
      url: "/videos/video42/presentacion.pdf",
      titulo: "Guía: Semejanza y Pitágoras"
    },
    podcast: {
      url: "/videos/video42/podcast.mp3",
      duracion: "8:30"
    }
  },

  // ============================================
  // VIDEO 43 - Razones Trigonométricas (con quiz)
  // ============================================
  "video-43": {
    videoId: "video-43",
    quiz: {
      url: "/quiz/video-43-quiz.html"
    },
    infografia: {
      url: "/videos/video43/infografia.png",
      descripcion: "Infografía: Razones Trigonométricas"
    },
    pdf: {
      url: "/videos/video43/presentacion.pdf",
      titulo: "Guía: Razones Trigonométricas"
    },
    podcast: {
      url: "/videos/video43/podcast.mp3",
      duracion: "8:30"
    }
  },

  // ============================================
  // VIDEO 44 - Perímetros y Áreas (con quiz)
  // ============================================
  "video-44": {
    videoId: "video-44",
    quiz: {
      url: "/quiz/video-44-quiz.html"
    },
    infografia: {
      url: "/videos/video44/infografia.png",
      descripcion: "Infografía: Perímetros y Áreas"
    },
    pdf: {
      url: "/videos/video44/presentacion.pdf",
      titulo: "Guía: Perímetros y Áreas"
    },
    podcast: {
      url: "/videos/video44/podcast.mp3",
      duracion: "8:30"
    }
  },

  // ============================================
  // VIDEO 45 - Volúmenes (con quiz)
  // ============================================
  "video-45": {
    videoId: "video-45",
    quiz: {
      url: "/quiz/video-45-quiz.html"
    },
    infografia: {
      url: "/videos/video45/infografia.png",
      descripcion: "Infografía: Volúmenes"
    },
    pdf: {
      url: "/videos/video45/presentacion.pdf",
      titulo: "Guía: Volúmenes"
    },
    podcast: {
      url: "/videos/video45/podcast.mp3",
      duracion: "8:30"
    }
  },

  // ============================================
  // VIDEO 46 - Renacimiento (con quiz)
  // ============================================
  "video-46": {
    videoId: "video-46",
    quiz: {
      url: "/quiz/video-46-quiz.html"
    },
    infografia: {
      url: "/videos/video46/infografia.png",
      descripcion: "Infografía: Renacimiento"
    },
    pdf: {
      url: "/videos/video46/presentacion.pdf",
      titulo: "Guía: Renacimiento"
    },
    podcast: {
      url: "/videos/video46/podcast.mp3",
      duracion: "8:30"
    }
  },

  // ============================================
  // VIDEO 47 - Ilustración (con quiz)
  // ============================================
  "video-47": {
    videoId: "video-47",
    quiz: {
      url: "/quiz/video-47-quiz.html"
    },
    infografia: {
      url: "/videos/video47/infografia.png",
      descripcion: "Infografía: Ilustración"
    },
    pdf: {
      url: "/videos/video47/presentacion.pdf",
      titulo: "Guía: Ilustración"
    },
    podcast: {
      url: "/videos/video47/podcast.mp3",
      duracion: "8:30"
    }
  },

  // ============================================
  // VIDEO 48 - Revolución Industrial (con quiz)
  // ============================================
  "video-48": {
    videoId: "video-48",
    quiz: {
      url: "/quiz/video-48-quiz.html"
    },
    infografia: {
      url: "/videos/video48/infografia.png",
      descripcion: "Infografía: Revolución Industrial"
    },
    pdf: {
      url: "/videos/video48/presentacion.pdf",
      titulo: "Guía: Revolución Industrial"
    },
    podcast: {
      url: "/videos/video48/podcast.mp3",
      duracion: "8:30"
    }
  },

  // ============================================
  // VIDEO 49 - Imperialismo y 1GM (con quiz)
  // ============================================
  "video-49": {
    videoId: "video-49",
    quiz: {
      url: "/quiz/video-49-quiz.html"
    },
    infografia: {
      url: "/videos/video49/infografia.png",
      descripcion: "Infografía: Imperialismo y 1GM"
    },
    pdf: {
      url: "/videos/video49/presentacion.pdf",
      titulo: "Guía: Imperialismo y 1GM"
    },
    podcast: {
      url: "/videos/video49/podcast.mp3",
      duracion: "8:30"
    }
  },

  // ============================================
  // VIDEO 50 - Período de Entreguerras (con quiz)
  // ============================================
  "video-50": {
    videoId: "video-50",
    quiz: {
      url: "/quiz/video-50-quiz.html"
    },
    infografia: {
      url: "/videos/video50/infografia.png",
      descripcion: "Infografía: Período de Entreguerras"
    },
    pdf: {
      url: "/videos/video50/presentacion.pdf",
      titulo: "Guía: Período de Entreguerras"
    },
    podcast: {
      url: "/videos/video50/podcast.mp3",
      duracion: "8:30"
    }
  },

  // ============================================
  // VIDEO 51 - Segunda Guerra Mundial (con quiz)
  // ============================================
  "video-51": {
    videoId: "video-51",
    quiz: {
      url: "/quiz/video-51-quiz.html"
    },
    infografia: {
      url: "/videos/video51/infografia.png",
      descripcion: "Infografía: Segunda Guerra Mundial"
    },
    pdf: {
      url: "/videos/video51/presentacion.pdf",
      titulo: "Guía: Segunda Guerra Mundial"
    },
    podcast: {
      url: "/videos/video51/podcast.mp3",
      duracion: "8:30"
    }
  },

  // ============================================
  // VIDEO 52 - Guerra Fría (con quiz)
  // ============================================
  "video-52": {
    videoId: "video-52",
    quiz: {
      url: "/quiz/video-52-quiz.html"
    },
    infografia: {
      url: "/videos/video52/infografia.png",
      descripcion: "Infografía: Guerra Fría"
    },
    pdf: {
      url: "/videos/video52/presentacion.pdf",
      titulo: "Guía: Guerra Fría"
    },
    podcast: {
      url: "/videos/video52/podcast.mp3",
      duracion: "8:30"
    }
  },

  // ============================================
  // VIDEO 53 - Culturas Prehispánicas (con quiz)
  // ============================================
  "video-53": {
    videoId: "video-53",
    quiz: {
      url: "/quiz/video-53-quiz.html"
    },
    infografia: {
      url: "/videos/video53/infografia.png",
      descripcion: "Infografía: Culturas Prehispánicas"
    },
    pdf: {
      url: "/videos/video53/presentacion.pdf",
      titulo: "Guía: Culturas Prehispánicas"
    },
    podcast: {
      url: "/videos/video53/podcast.mp3",
      duracion: "8:30"
    }
  },

  // ============================================
  // VIDEO 54 - Conquista de México (con quiz)
  // ============================================
  "video-54": {
    videoId: "video-54",
    quiz: {
      url: "/quiz/video-54-quiz.html"
    },
    infografia: {
      url: "/videos/video54/infografia.png",
      descripcion: "Infografía: Conquista de México"
    },
    pdf: {
      url: "/videos/video54/presentacion.pdf",
      titulo: "Guía: Conquista de México"
    },
    podcast: {
      url: "/videos/video54/podcast.mp3",
      duracion: "8:30"
    }
  },

  // ============================================
  // VIDEO 55 - Virreinato (con quiz)
  // ============================================
  "video-55": {
    videoId: "video-55",
    quiz: {
      url: "/quiz/video-55-quiz.html"
    },
    infografia: {
      url: "/videos/video55/infografia.png",
      descripcion: "Infografía: Virreinato"
    },
    pdf: {
      url: "/videos/video55/presentacion.pdf",
      titulo: "Guía: Virreinato"
    },
    podcast: {
      url: "/videos/video55/podcast.mp3",
      duracion: "8:30"
    }
  },

  // ============================================
  // VIDEO 56 - Independencia (con quiz)
  // ============================================
  "video-56": {
    videoId: "video-56",
    quiz: {
      url: "/quiz/video-56-quiz.html"
    },
    infografia: {
      url: "/videos/video56/infografia.png",
      descripcion: "Infografía: Independencia"
    },
    pdf: {
      url: "/videos/video56/presentacion.pdf",
      titulo: "Guía: Independencia"
    },
    podcast: {
      url: "/videos/video56/podcast.mp3",
      duracion: "8:30"
    }
  },

  // ============================================
  // VIDEO 57 - México Siglo XIX (con quiz)
  // ============================================
  "video-57": {
    videoId: "video-57",
    quiz: {
      url: "/quiz/video-57-quiz.html"
    },
    infografia: {
      url: "/videos/video57/infografia.png",
      descripcion: "Infografía: México Siglo XIX"
    },
    pdf: {
      url: "/videos/video57/presentacion.pdf",
      titulo: "Guía: México Siglo XIX"
    },
    podcast: {
      url: "/videos/video57/podcast.mp3",
      duracion: "8:30"
    }
  },

  // ============================================
  // VIDEO 58 - Revolución Mexicana (con quiz)
  // ============================================
  "video-58": {
    videoId: "video-58",
    quiz: {
      url: "/quiz/video-58-quiz.html"
    },
    infografia: {
      url: "/videos/video58/infografia.png",
      descripcion: "Infografía: Revolución Mexicana"
    },
    pdf: {
      url: "/videos/video58/presentacion.pdf",
      titulo: "Guía: Revolución Mexicana"
    },
    podcast: {
      url: "/videos/video58/podcast.mp3",
      duracion: "8:30"
    }
  },

  // ============================================
  // VIDEO 59 - México Contemporáneo (con quiz)
  // ============================================
  "video-59": {
    videoId: "video-59",
    quiz: {
      url: "/quiz/video-59-quiz.html"
    },
    infografia: {
      url: "/videos/video59/infografia.png",
      descripcion: "Infografía: México Contemporáneo"
    },
    pdf: {
      url: "/videos/video59/presentacion.pdf",
      titulo: "Guía: México Contemporáneo"
    },
    podcast: {
      url: "/videos/video59/podcast.mp3",
      duracion: "8:30"
    }
  },

  // ============================================
  // VIDEO 60 - Fichas Bibliográficas (con quiz)
  // ============================================
  "video-60": {
    videoId: "video-60",
    quiz: {
      url: "/quiz/video-60-quiz.html"
    },
    infografia: {
      url: "/videos/video60/infografia.png",
      descripcion: "Infografía: Fichas Bibliográficas"
    },
    pdf: {
      url: "/videos/video60/presentacion.pdf",
      titulo: "Guía: Fichas Bibliográficas"
    },
    podcast: {
      url: "/videos/video60/podcast.mp3",
      duracion: "8:30"
    }
  },

  // ============================================
  // VIDEO 61 - Coherencia y Cohesión I (con quiz)
  // ============================================
  "video-61": {
    videoId: "video-61",
    quiz: {
      url: "/quiz/video-61-quiz.html"
    },
    infografia: {
      url: "/videos/video61/infografia.png",
      descripcion: "Infografía: Coherencia y Cohesión I"
    },
    pdf: {
      url: "/videos/video61/presentacion.pdf",
      titulo: "Guía: Coherencia y Cohesión I"
    },
    podcast: {
      url: "/videos/video61/podcast.mp3",
      duracion: "8:30"
    }
  },

  // ============================================
  // VIDEO 62 - Coherencia y Cohesión II (con quiz)
  // ============================================
  "video-62": {
    videoId: "video-62",
    quiz: {
      url: "/quiz/video-62-quiz.html"
    },
    infografia: {
      url: "/videos/video62/infografia.png",
      descripcion: "Infografía: Coherencia y Cohesión II"
    },
    pdf: {
      url: "/videos/video62/presentacion.pdf",
      titulo: "Guía: Coherencia y Cohesión II"
    },
    podcast: {
      url: "/videos/video62/podcast.mp3",
      duracion: "8:30"
    }
  },

  // ============================================
  // VIDEO 63 - Textos Informativos (con quiz)
  // ============================================
  "video-63": {
    videoId: "video-63",
    quiz: {
      url: "/quiz/video-63-quiz.html"
    },
    infografia: {
      url: "/videos/video63/infografia.png",
      descripcion: "Infografía: Textos Informativos"
    },
    pdf: {
      url: "/videos/video63/presentacion.pdf",
      titulo: "Guía: Textos Informativos"
    },
    podcast: {
      url: "/videos/video63/podcast.mp3",
      duracion: "8:30"
    }
  },

  // ============================================
  // VIDEO 64 - (pendiente de completar)
  // ============================================
  "video-64": {
    videoId: "video-64",
    quiz: {
      url: "/quiz/video-64-quiz.html"
    },
    infografia: {
      url: "/videos/video64/infografia.png",
      descripcion: "Infografía del video 64"
    },
    pdf: {
      url: "/videos/video64/presentacion.pdf",
      titulo: "Guía del video 64"
    },
    podcast: {
      url: "/videos/video64/podcast.mp3",
      duracion: "8:30"
    }
  },

  // ============================================
  // VIDEO 65 - (pendiente de completar)
  // ============================================
  "video-65": {
    videoId: "video-65",
    quiz: {
      url: "/quiz/video-65-quiz.html"
    },
    infografia: {
      url: "/videos/video65/infografia.png",
      descripcion: "Infografía del video 65"
    },
    pdf: {
      url: "/videos/video65/presentacion.pdf",
      titulo: "Guía del video 65"
    },
    podcast: {
      url: "/videos/video65/podcast.mp3",
      duracion: "8:30"
    }
  },

  // ============================================
  // VIDEO 66 - (pendiente de completar)
  // ============================================
  "video-66": {
    videoId: "video-66",
    quiz: {
      url: "/quiz/video-66-quiz.html"
    },
    infografia: {
      url: "/videos/video66/infografia.png",
      descripcion: "Infografía del video 66"
    },
    pdf: {
      url: "/videos/video66/presentacion.pdf",
      titulo: "Guía del video 66"
    },
    podcast: {
      url: "/videos/video66/podcast.mp3",
      duracion: "8:30"
    }
  },

  // ============================================
  // VIDEO 67 - (pendiente de completar)
  // ============================================
  "video-67": {
    videoId: "video-67",
    quiz: {
      url: "/quiz/video-67-quiz.html"
    },
    infografia: {
      url: "/videos/video67/infografia.png",
      descripcion: "Infografía del video 67"
    },
    pdf: {
      url: "/videos/video67/presentacion.pdf",
      titulo: "Guía del video 67"
    },
    podcast: {
      url: "/videos/video67/podcast.mp3",
      duracion: "8:30"
    }
  },

  // ============================================
  // VIDEO 68 - (pendiente de completar)
  // ============================================
  "video-68": {
    videoId: "video-68",
    quiz: {
      url: "/quiz/video-68-quiz.html"
    },
    infografia: {
      url: "/videos/video68/infografia.png",
      descripcion: "Infografía del video 68"
    },
    pdf: {
      url: "/videos/video68/presentacion.pdf",
      titulo: "Guía del video 68"
    },
    podcast: {
      url: "/videos/video68/podcast.mp3",
      duracion: "8:30"
    }
  },

  // ============================================
  // VIDEO 69 - (pendiente de completar)
  // ============================================
  "video-69": {
    videoId: "video-69",
    quiz: {
      url: "/quiz/video-69-quiz.html"
    },
    infografia: {
      url: "/videos/video69/infografia.png",
      descripcion: "Infografía del video 69"
    },
    pdf: {
      url: "/videos/video69/presentacion.pdf",
      titulo: "Guía del video 69"
    },
    podcast: {
      url: "/videos/video69/podcast.mp3",
      duracion: "8:30"
    }
  },

  // ============================================
  // VIDEO 70 - (pendiente de completar)
  // ============================================
  "video-70": {
    videoId: "video-70",
    quiz: {
      url: "/quiz/video-70-quiz.html"
    },
    infografia: {
      url: "/videos/video70/infografia.png",
      descripcion: "Infografía del video 70"
    },
    pdf: {
      url: "/videos/video70/presentacion.pdf",
      titulo: "Guía del video 70"
    },
    podcast: {
      url: "/videos/video70/podcast.mp3",
      duracion: "8:30"
    }
  },

  // ============================================
  // VIDEO 71 - (pendiente de completar)
  // ============================================
  "video-71": {
    videoId: "video-71",
    quiz: {
      url: "/quiz/video-71-quiz.html"
    },
    infografia: {
      url: "/videos/video71/infografia.png",
      descripcion: "Infografía del video 71"
    },
    pdf: {
      url: "/videos/video71/presentacion.pdf",
      titulo: "Guía del video 71"
    },
    podcast: {
      url: "/videos/video71/podcast.mp3",
      duracion: "8:30"
    }
  },

  // ============================================
  // VIDEO 72 - (pendiente de completar)
  // ============================================
  "video-72": {
    videoId: "video-72",
    quiz: {
      url: "/quiz/video-72-quiz.html"
    },
    infografia: {
      url: "/videos/video72/infografia.png",
      descripcion: "Infografía del video 72"
    },
    pdf: {
      url: "/videos/video72/presentacion.pdf",
      titulo: "Guía del video 72"
    },
    podcast: {
      url: "/videos/video72/podcast.mp3",
      duracion: "8:30"
    }
  },

  // ============================================
  // VIDEO 73 - (pendiente de completar)
  // ============================================
  "video-73": {
    videoId: "video-73",
    quiz: {
      url: "/quiz/video-73-quiz.html"
    },
    infografia: {
      url: "/videos/video73/infografia.png",
      descripcion: "Infografía del video 73"
    },
    pdf: {
      url: "/videos/video73/presentacion.pdf",
      titulo: "Guía del video 73"
    },
    podcast: {
      url: "/videos/video73/podcast.mp3",
      duracion: "8:30"
    }
  },

  // ============================================
  // VIDEO 74 - (pendiente de completar)
  // ============================================
  "video-74": {
    videoId: "video-74",
    quiz: {
      url: "/quiz/video-74-quiz.html"
    },
    infografia: {
      url: "/videos/video74/infografia.png",
      descripcion: "Infografía del video 74"
    },
    pdf: {
      url: "/videos/video74/presentacion.pdf",
      titulo: "Guía del video 74"
    },
    podcast: {
      url: "/videos/video74/podcast.mp3",
      duracion: "8:30"
    }
  },

  // ============================================
  // VIDEO 75 - (pendiente de completar)
  // ============================================
  "video-75": {
    videoId: "video-75",
    quiz: {
      url: "/quiz/video-75-quiz.html"
    },
    infografia: {
      url: "/videos/video75/infografia.png",
      descripcion: "Infografía del video 75"
    },
    pdf: {
      url: "/videos/video75/presentacion.pdf",
      titulo: "Guía del video 75"
    },
    podcast: {
      url: "/videos/video75/podcast.mp3",
      duracion: "8:30"
    }
  },

  // ============================================
  // VIDEO 76 - (pendiente de completar)
  // ============================================
  "video-76": {
    videoId: "video-76",
    quiz: {
      url: "/quiz/video-76-quiz.html"
    },
    infografia: {
      url: "/videos/video76/infografia.png",
      descripcion: "Infografía del video 76"
    },
    pdf: {
      url: "/videos/video76/presentacion.pdf",
      titulo: "Guía del video 76"
    },
    podcast: {
      url: "/videos/video76/podcast.mp3",
      duracion: "8:30"
    }
  },

  // ============================================
  // VIDEO 77 - (pendiente de completar)
  // ============================================
  "video-77": {
    videoId: "video-77",
    quiz: {
      url: "/quiz/video-77-quiz.html"
    },
    infografia: {
      url: "/videos/video77/infografia.png",
      descripcion: "Infografía del video 77"
    },
    pdf: {
      url: "/videos/video77/presentacion.pdf",
      titulo: "Guía del video 77"
    },
    podcast: {
      url: "/videos/video77/podcast.mp3",
      duracion: "8:30"
    }
  },

  // ============================================
  // VIDEO 78 - (pendiente de completar)
  // ============================================
  "video-78": {
    videoId: "video-78",
    quiz: {
      url: "/quiz/video-78-quiz.html"
    },
    infografia: {
      url: "/videos/video78/infografia.png",
      descripcion: "Infografía del video 78"
    },
    pdf: {
      url: "/videos/video78/presentacion.pdf",
      titulo: "Guía del video 78"
    },
    podcast: {
      url: "/videos/video78/podcast.mp3",
      duracion: "8:30"
    }
  },

  // ============================================
  // VIDEO 79 - (pendiente de completar)
  // ============================================
  "video-79": {
    videoId: "video-79",
    quiz: {
      url: "/quiz/video-79-quiz.html"
    },
    infografia: {
      url: "/videos/video79/infografia.png",
      descripcion: "Infografía del video 79"
    },
    pdf: {
      url: "/videos/video79/presentacion.pdf",
      titulo: "Guía del video 79"
    },
    podcast: {
      url: "/videos/video79/podcast.mp3",
      duracion: "8:30"
    }
  },

  // ============================================
  // VIDEO 80 - (pendiente de completar)
  // ============================================
  "video-80": {
    videoId: "video-80",
    quiz: {
      url: "/quiz/video-80-quiz.html"
    },
    infografia: {
      url: "/videos/video80/infografia.png",
      descripcion: "Infografía del video 80"
    },
    pdf: {
      url: "/videos/video80/presentacion.pdf",
      titulo: "Guía del video 80"
    },
    podcast: {
      url: "/videos/video80/podcast.mp3",
      duracion: "8:30"
    }
  },

  // ============================================
  // VIDEO 81 - (pendiente de completar)
  // ============================================
  "video-81": {
    videoId: "video-81",
    quiz: {
      url: "/quiz/video-81-quiz.html"
    },
    infografia: {
      url: "/videos/video81/infografia.png",
      descripcion: "Infografía del video 81"
    },
    pdf: {
      url: "/videos/video81/presentacion.pdf",
      titulo: "Guía del video 81"
    },
    podcast: {
      url: "/videos/video81/podcast.mp3",
      duracion: "8:30"
    }
  },

  // ============================================
  // VIDEO 82 - (pendiente de completar)
  // ============================================
  "video-82": {
    videoId: "video-82",
    quiz: {
      url: "/quiz/video-82-quiz.html"
    },
    infografia: {
      url: "/videos/video82/infografia.png",
      descripcion: "Infografía del video 82"
    },
    pdf: {
      url: "/videos/video82/presentacion.pdf",
      titulo: "Guía del video 82"
    },
    podcast: {
      url: "/videos/video82/podcast.mp3",
      duracion: "8:30"
    }
  },

  // ============================================
  // VIDEO 83 - (pendiente de completar)
  // ============================================
  "video-83": {
    videoId: "video-83",
    quiz: {
      url: "/quiz/video-83-quiz.html"
    },
    infografia: {
      url: "/videos/video83/infografia.png",
      descripcion: "Infografía del video 83"
    },
    pdf: {
      url: "/videos/video83/presentacion.pdf",
      titulo: "Guía del video 83"
    },
    podcast: {
      url: "/videos/video83/podcast.mp3",
      duracion: "8:30"
    }
  },

  // ============================================
  // VIDEO 84 - (pendiente de completar)
  // ============================================
  "video-84": {
    videoId: "video-84",
    quiz: {
      url: "/quiz/video-84-quiz.html"
    },
    infografia: {
      url: "/videos/video84/infografia.png",
      descripcion: "Infografía del video 84"
    },
    pdf: {
      url: "/videos/video84/presentacion.pdf",
      titulo: "Guía del video 84"
    },
    podcast: {
      url: "/videos/video84/podcast.mp3",
      duracion: "8:30"
    }
  },

  // ============================================
  // VIDEO 85 - (pendiente de completar)
  // ============================================
  "video-85": {
    videoId: "video-85",
    quiz: {
      url: "/quiz/video-85-quiz.html"
    },
    infografia: {
      url: "/videos/video85/infografia.png",
      descripcion: "Infografía del video 85"
    },
    pdf: {
      url: "/videos/video85/presentacion.pdf",
      titulo: "Guía del video 85"
    },
    podcast: {
      url: "/videos/video85/podcast.mp3",
      duracion: "8:30"
    }
  },

  // ============================================
  // VIDEO 86 - (pendiente de completar)
  // ============================================
  "video-86": {
    videoId: "video-86",
    quiz: {
      url: "/quiz/video-86-quiz.html"
    },
    infografia: {
      url: "/videos/video86/infografia.png",
      descripcion: "Infografía del video 86"
    },
    pdf: {
      url: "/videos/video86/presentacion.pdf",
      titulo: "Guía del video 86"
    },
    podcast: {
      url: "/videos/video86/podcast.mp3",
      duracion: "8:30"
    }
  },

  // ============================================
  // VIDEO 87 - (pendiente de completar)
  // ============================================
  "video-87": {
    videoId: "video-87",
    quiz: {
      url: "/quiz/video-87-quiz.html"
    },
    infografia: {
      url: "/videos/video87/infografia.png",
      descripcion: "Infografía del video 87"
    },
    pdf: {
      url: "/videos/video87/presentacion.pdf",
      titulo: "Guía del video 87"
    },
    podcast: {
      url: "/videos/video87/podcast.mp3",
      duracion: "8:30"
    }
  },

  // ============================================
  // VIDEO 88 - (pendiente de completar)
  // ============================================
  "video-88": {
    videoId: "video-88",
    quiz: {
      url: "/quiz/video-88-quiz.html"
    },
    infografia: {
      url: "/videos/video88/infografia.png",
      descripcion: "Infografía del video 88"
    },
    pdf: {
      url: "/videos/video88/presentacion.pdf",
      titulo: "Guía del video 88"
    },
    podcast: {
      url: "/videos/video88/podcast.mp3",
      duracion: "8:30"
    }
  },

  // ============================================
  // VIDEO 89 - (pendiente de completar)
  // ============================================
  "video-89": {
    videoId: "video-89",
    quiz: {
      url: "/quiz/video-89-quiz.html"
    },
    infografia: {
      url: "/videos/video89/infografia.png",
      descripcion: "Infografía del video 89"
    },
    pdf: {
      url: "/videos/video89/presentacion.pdf",
      titulo: "Guía del video 89"
    },
    podcast: {
      url: "/videos/video89/podcast.mp3",
      duracion: "8:30"
    }
  },

  // ============================================
  // VIDEO 90 - (pendiente de completar)
  // ============================================
  "video-90": {
    videoId: "video-90",
    quiz: {
      url: "/quiz/video-90-quiz.html"
    },
    infografia: {
      url: "/videos/video90/infografia.png",
      descripcion: "Infografía del video 90"
    },
    pdf: {
      url: "/videos/video90/presentacion.pdf",
      titulo: "Guía del video 90"
    },
    podcast: {
      url: "/videos/video90/podcast.mp3",
      duracion: "8:30"
    }
  }
};
