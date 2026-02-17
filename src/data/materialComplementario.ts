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
  "hv-0": {
    videoId: "hv-0",
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
  "hv-1": {
    videoId: "hv-1",
   
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
  "hv-2": {
    videoId: "hv-2",
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
  "hv-3": {
    videoId: "hv-3",
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
  "hv-4": {
    videoId: "hv-4",
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
  "hv-5": {
    videoId: "hv-5",
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
  "hv-6": {
    videoId: "hv-6",
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
  "hv-7": {
    videoId: "hv-7",
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
  "hv-8": {
    videoId: "hv-8",
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
  "hv-9": {
    videoId: "hv-9",
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
