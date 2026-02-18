 export interface MaterialVideo {
  videoId: string;
  quiz?: { url: string };
  infografia?: { url: string; descripcion: string };
  pdf?: { url: string; titulo: string };
  podcast?: { url: string; duracion?: string };
}

export const materiales: Record<string, MaterialVideo> = {
  "video-00": {
    videoId: "video-00",
    infografia: { url: "/videos/video0/infografia.png", descripcion: "Presentación" },
    pdf: { url: "/videos/video0/presentacion.pdf", titulo: "Presentación" },
    podcast: { url: "/videos/video0/podcast.mp3", duracion: "8:30" }
  },
  "video-01": {
    videoId: "video-01",
    quiz: { url: "/quiz/video-01-quiz.html" },
    infografia: { url: "/videos/video1/infografia.png", descripcion: "Comprensión Lectora 1" },
    pdf: { url: "/videos/video1/presentacion.pdf", titulo: "Guía 1" },
    podcast: { url: "/videos/video1/podcast.mp3", duracion: "8:30" }
  },
  "video-02": {
    videoId: "video-02",
    quiz: { url: "/quiz/video-02-quiz.html" },
    infografia: { url: "/videos/video2/infografia.png", descripcion: "Comprensión Lectora 2" },
    pdf: { url: "/videos/video2/presentacion.pdf", titulo: "Guía 2" },
    podcast: { url: "/videos/video2/podcast.mp3", duracion: "8:30" }
  },
  "video-03": {
    videoId: "video-03",
    quiz: { url: "/quiz/video-03-quiz.html" },
    infografia: { url: "/videos/video3/infografia.png", descripcion: "Vocabulario 1" },
    pdf: { url: "/videos/video3/presentacion.pdf", titulo: "Guía 3" },
    podcast: { url: "/videos/video3/podcast.mp3", duracion: "8:30" }
  },
  "video-04": {
    videoId: "video-04",
    quiz: { url: "/quiz/video-04-quiz.html" },
    infografia: { url: "/videos/video4/infografia.png", descripcion: "Vocabulario 2" },
    pdf: { url: "/videos/video4/presentacion.pdf", titulo: "Guía 4" },
    podcast: { url: "/videos/video4/podcast.mp3", duracion: "8:30" }
  },
  "video-05": {
    videoId: "video-05",
    quiz: { url: "/quiz/video-05-quiz.html" },
    infografia: { url: "/videos/video5/infografia.png", descripcion: "Integración HV" },
    pdf: { url: "/videos/video5/presentacion.pdf", titulo: "Guía 5" },
    podcast: { url: "/videos/video5/podcast.mp3", duracion: "8:30" }
  }
};
