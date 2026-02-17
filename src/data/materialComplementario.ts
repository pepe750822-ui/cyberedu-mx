export interface Pregunta {
  id: number;
  texto: string;
  opciones: string[];
  respuestaCorrecta: number;
  explicacion: string;
}

export interface MaterialVideo {
  videoId: string;
  cuestionario?: {
    preguntas: Pregunta[];
  };
  podcast?: {
    url: string;
    duracion?: string;
  };
  infografia?: {
    url: string;
    descripcion: string;
  };
  pdf?: {
    url: string;
    titulo: string;
  };
  quiz?: {
    url: string;
  };
}

export const materiales: Record<string, MaterialVideo> = {
  // ============================================
  // VIDEO 0 - Presentación (sin quiz)
  // ============================================
  "video-00": {
    videoId: "video-00",
    podcast: {
      url: "/videos/video0/podcast.mp3",
      duracion: "8:30"
    },
    infografia: {
      url: "/videos/video0/infografia.png",
      descripcion: "Infografía de presentación del curso"
    },
    pdf: {
      url: "/videos/video0/presentacion.pdf",
      titulo: "Presentación del curso ECOEMS 2026"
    }
    // Sin quiz - no aparece la pestaña
  },

  // ============================================
  // VIDEO 1 - Habilidad Verbal (con quiz)
  // ============================================
  "video-01": {
    videoId: "video-01",
    cuestionario: {
      preguntas: [
        {
          id: 1,
          texto: "¿Cuál es la idea principal de la comprensión lectora?",
          opciones: [
            "Memorizar palabras",
            "Interpretar y construir significado",
            "Leer rápidamente",
            "Identificar autores"
          ],
          respuestaCorrecta: 1,
          explicacion: "La comprensión lectora implica interpretar activamente el texto para construir significado, no solo leer rápido o memorizar."
        },
        {
          id: 2,
          texto: "¿Qué estrategia mejora la comprensión de un texto?",
          opciones: [
            "Leer sin pausas",
            "Subrayar todo el texto",
            "Hacer preguntas mientras se lee",
            "Copiar el texto completo"
          ],
          respuestaCorrecta: 2,
          explicacion: "Hacerse preguntas durante la lectura activa el pensamiento crítico y mejora la comprensión."
        },
        {
          id: 3,
          texto: "¿Qué tipo de lectura busca entender el mensaje global?",
          opciones: [
            "Lectura superficial",
            "Lectura crítica",
            "Lectura global",
            "Lectura selectiva"
          ],
          respuestaCorrecta: 2,
          explicacion: "La lectura global se enfoca en captar el mensaje general del texto sin detenerse en cada detalle."
        },
        {
          id: 4,
          texto: "¿Cuál NO es un nivel de comprensión lectora?",
          opciones: [
            "Literal",
            "Inferencial",
            "Mecánico",
            "Crítico"
          ],
          respuestaCorrecta: 2,
          explicacion: "Los niveles de comprensión lectora son: literal, inferencial y crítico. 'Mecánico' no es un nivel reconocido."
        },
        {
          id: 5,
          texto: "¿Qué significa hacer una inferencia en un texto?",
          opciones: [
            "Repetir lo que dice el autor",
            "Deducir información no explícita",
            "Resumir el texto",
            "Buscar palabras en el diccionario"
          ],
          respuestaCorrecta: 1,
          explicacion: "Inferir es deducir información que no está escrita directamente en el texto, usando pistas contextuales."
        }
      ]
    },
    podcast: {
      url: "/videos/video1/podcast.mp3",
      duracion: "8:30"
    },
    infografia: {
      url: "/videos/video1/infografia.png",
      descripcion: "Infografía sobre comprensión lectora"
    },
    pdf: {
      url: "/videos/video1/presentacion.pdf",
      titulo: "Guía de comprensión lectora"
    },
    quiz: {
      url: "/quiz/video-01-quiz.html"
    }
  },

  // ============================================
  // VIDEO 2 - (pendiente de completar)
  // ============================================
  "video-02": {
    videoId: "video-02",
    podcast: {
      url: "/videos/video2/podcast.mp3",
      duracion: "8:30"
    },
    infografia: {
      url: "/videos/video2/infografia.png",
      descripcion: "Infografía del video 2"
    },
    pdf: {
      url: "/videos/video2/presentacion.pdf",
      titulo: "Guía del video 2"
    },
    quiz: {
      url: "/quiz/video-02-quiz.html"
    }
  },

  // ============================================
  // VIDEO 3 - (pendiente de completar)
  // ============================================
  "video-03": {
    videoId: "video-03",
    podcast: {
      url: "/videos/video3/podcast.mp3",
      duracion: "8:30"
    },
    infografia: {
      url: "/videos/video3/infografia.png",
      descripcion: "Infografía del video 3"
    },
    pdf: {
      url: "/videos/video3/presentacion.pdf",
      titulo: "Guía del video 3"
    },
    quiz: {
      url: "/quiz/video-03-quiz.html"
    }
  },

  // ============================================
  // VIDEO 4 - (pendiente de completar)
  // ============================================
  "video-04": {
    videoId: "video-04",
    podcast: {
      url: "/videos/video4/podcast.mp3",
      duracion: "8:30"
    },
    infografia: {
      url: "/videos/video4/infografia.png",
      descripcion: "Infografía del video 4"
    },
    pdf: {
      url: "/videos/video4/presentacion.pdf",
      titulo: "Guía del video 4"
    },
    quiz: {
      url: "/quiz/video-04-quiz.html"
    }
  },

  // ============================================
  // VIDEO 5 - (pendiente de completar)
  // ============================================
  "video-05": {
    videoId: "video-05",
    podcast: {
      url: "/videos/video5/podcast.mp3",
      duracion: "8:30"
    },
    infografia: {
      url: "/videos/video5/infografia.png",
      descripcion: "Infografía del video 5"
    },
    pdf: {
      url: "/videos/video5/presentacion.pdf",
      titulo: "Guía del video 5"
    },
    quiz: {
      url: "/quiz/video-05-quiz.html"
    }
  },

  // ============================================
  // VIDEO 6 - (pendiente de completar)
  // ============================================
  "video-06": {
    videoId: "video-06",
    podcast: {
      url: "/videos/video6/podcast.mp3",
      duracion: "8:30"
    },
    infografia: {
      url: "/videos/video6/infografia.png",
      descripcion: "Infografía del video 6"
    },
    pdf: {
      url: "/videos/video6/presentacion.pdf",
      titulo: "Guía del video 6"
    },
    quiz: {
      url: "/quiz/video-06-quiz.html"
    }
  },

  // ============================================
  // VIDEO 7 - (pendiente de completar)
  // ============================================
  "video-07": {
    videoId: "video-07",
    podcast: {
      url: "/videos/video7/podcast.mp3",
      duracion: "8:30"
    },
    infografia: {
      url: "/videos/video7/infografia.png",
      descripcion: "Infografía del video 7"
    },
    pdf: {
      url: "/videos/video7/presentacion.pdf",
      titulo: "Guía del video 7"
    },
    quiz: {
      url: "/quiz/video-07-quiz.html"
    }
  },

  // ============================================
  // VIDEO 8 - (pendiente de completar)
  // ============================================
  "video-08": {
    videoId: "video-08",
    podcast: {
      url: "/videos/video8/podcast.mp3",
      duracion: "8:30"
    },
    infografia: {
      url: "/videos/video8/infografia.png",
      descripcion: "Infografía del video 8"
    },
    pdf: {
      url: "/videos/video8/presentacion.pdf",
      titulo: "Guía del video 8"
    },
    quiz: {
      url: "/quiz/video-08-quiz.html"
    }
  },

  // ============================================
  // VIDEO 9 - (pendiente de completar)
  // ============================================
  "video-09": {
    videoId: "video-09",
    podcast: {
      url: "/videos/video9/podcast.mp3",
      duracion: "8:30"
    },
    infografia: {
      url: "/videos/video9/infografia.png",
      descripcion: "Infografía del video 9"
    },
    pdf: {
      url: "/videos/video9/presentacion.pdf",
      titulo: "Guía del video 9"
    },
    quiz: {
      url: "/quiz/video-09-quiz.html"
    }
  }
};
