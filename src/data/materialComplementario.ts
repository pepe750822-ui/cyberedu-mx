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
      descripcion: "Infografía: Introducción BioReto Academy"
    },
    pdf: {
      url: "/videos/video0/presentacion.pdf",
      titulo: "Guía: Introducción"
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
    infografia: { url: "/videos/video1/infografia.png", descripcion: "Comprensión Lectora 1" },
    pdf: { url: "/videos/video1/presentacion.pdf", titulo: "Guía 1" },
    podcast: { url: "/videos/video1/podcast.mp3", duracion: "8:30" }
  },
  "hv-2": {
    videoId: "hv-2",
    quiz: { url: "/quiz/video-02-quiz.html" },
    infografia: { url: "/videos/video2/infografia.png", descripcion: "Comprensión Lectora 2" },
    pdf: { url: "/videos/video2/presentacion.pdf", titulo: "Guía 2" },
    podcast: { url: "/videos/video2/podcast.mp3", duracion: "8:30" }
  },
  "hv-3": {
    videoId: "hv-3",
    quiz: { url: "/quiz/video-03-quiz.html" },
    infografia: { url: "/videos/video3/infografia.png", descripcion: "Vocabulario 1" },
    pdf: { url: "/videos/video3/presentacion.pdf", titulo: "Guía 3" },
    podcast: { url: "/videos/video3/podcast.mp3", duracion: "8:30" }
  },
  "hv-4": {
    videoId: "hv-4",
    quiz: { url: "/quiz/video-04-quiz.html" },
    infografia: { url: "/videos/video4/infografia.png", descripcion: "Vocabulario 2" },
    pdf: { url: "/videos/video4/presentacion.pdf", titulo: "Guía 4" },
    podcast: { url: "/videos/video4/podcast.mp3", duracion: "8:30" }
  },
  "hv-5": {
    videoId: "hv-5",
    quiz: { url: "/quiz/video-05-quiz.html" },
    infografia: { url: "/videos/video5/infografia.png", descripcion: "Integración HV" },
    pdf: { url: "/videos/video5/presentacion.pdf", titulo: "Guía 5" },
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
  }
};

// El resto de videos (biología, física, etc.) continuarían aquí con sus IDs correctos
