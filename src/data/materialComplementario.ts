export interface MaterialVideo {
  videoId: string;
  quiz?: { url: string };
  infografia?: { url: string; descripcion: string };
  pdf?: { url: string; titulo: string };
  podcast?: { url: string; duracion?: string };
}

export const materiales: Record<string, MaterialVideo> = {
  // ============================================
  // HV-0 - Presentación (sin quiz)
  // ============================================
  "hv-0": {
    videoId: "hv-0",
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
  },

  // ============================================
  // HV-1 a HV-90 - Todos con quiz
  // ============================================
  "hv-1": {
    videoId: "hv-1",
    quiz: { url: "/quiz/video-01-quiz.html" },
    infografia: { url: "/videos/video1/infografia.png", descripcion: "Infografía: Habilidad Verbal 1" },
    pdf: { url: "/videos/video1/presentacion.pdf", titulo: "Guía: Habilidad Verbal 1" },
    podcast: { url: "/videos/video1/podcast.mp3", duracion: "8:30" }
  },
  "hv-2": {
    videoId: "hv-2",
    quiz: { url: "/quiz/video-02-quiz.html" },
    infografia: { url: "/videos/video2/infografia.png", descripcion: "Infografía: Habilidad Verbal 2" },
    pdf: { url: "/videos/video2/presentacion.pdf", titulo: "Guía: Habilidad Verbal 2" },
    podcast: { url: "/videos/video2/podcast.mp3", duracion: "8:30" }
  },
  "hv-3": {
    videoId: "hv-3",
    quiz: { url: "/quiz/video-03-quiz.html" },
    infografia: { url: "/videos/video3/infografia.png", descripcion: "Infografía: Habilidad Verbal 3" },
    pdf: { url: "/videos/video3/presentacion.pdf", titulo: "Guía: Habilidad Verbal 3" },
    podcast: { url: "/videos/video3/podcast.mp3", duracion: "8:30" }
  },
  "hv-4": {
    videoId: "hv-4",
    quiz: { url: "/quiz/video-04-quiz.html" },
    infografia: { url: "/videos/video4/infografia.png", descripcion: "Infografía: Habilidad Verbal 4" },
    pdf: { url: "/videos/video4/presentacion.pdf", titulo: "Guía: Habilidad Verbal 4" },
    podcast: { url: "/videos/video4/podcast.mp3", duracion: "8:30" }
  },
  "hv-5": {
    videoId: "hv-5",
    quiz: { url: "/quiz/video-05-quiz.html" },
    infografia: { url: "/videos/video5/infografia.png", descripcion: "Infografía: Habilidad Matemática 1" },
    pdf: { url: "/videos/video5/presentacion.pdf", titulo: "Guía: Habilidad Matemática 1" },
    podcast: { url: "/videos/video5/podcast.mp3", duracion: "8:30" }
  },
  "hv-6": {
    videoId: "hv-6",
    quiz: { url: "/quiz/video-06-quiz.html" },
    infografia: { url: "/videos/video6/infografia.png", descripcion: "Infografía: Habilidad Matemática 2" },
    pdf: { url: "/videos/video6/presentacion.pdf", titulo: "Guía: Habilidad Matemática 2" },
    podcast: { url: "/videos/video6/podcast.mp3", duracion: "8:30" }
  },
  "hv-7": {
    videoId: "hv-7",
    quiz: { url: "/quiz/video-07-quiz.html" },
    infografia: { url: "/videos/video7/infografia.png", descripcion: "Infografía: Habilidad Matemática 3" },
    pdf: { url: "/videos/video7/presentacion.pdf", titulo: "Guía: Habilidad Matemática 3" },
    podcast: { url: "/videos/video7/podcast.mp3", duracion: "8:30" }
  },
  "hv-8": {
    videoId: "hv-8",
    quiz: { url: "/quiz/video-08-quiz.html" },
    infografia: { url: "/videos/video8/infografia.png", descripcion: "Infografía: Habilidad Matemática 4" },
    pdf: { url: "/videos/video8/presentacion.pdf", titulo: "Guía: Habilidad Matemática 4" },
    podcast: { url: "/videos/video8/podcast.mp3", duracion: "8:30" }
  },
  "hv-9": {
    videoId: "hv-9",
    quiz: { url: "/quiz/video-09-quiz.html" },
    infografia: { url: "/videos/video9/infografia.png", descripcion: "Infografía: Habilidad Matemática 5" },
    pdf: { url: "/videos/video9/presentacion.pdf", titulo: "Guía: Habilidad Matemática 5" },
    podcast: { url: "/videos/video9/podcast.mp3", duracion: "8:30" }
  },
  "hv-10": {
    videoId: "hv-10",
    quiz: { url: "/quiz/video-10-quiz.html" },
    infografia: { url: "/videos/video10/infografia.png", descripcion: "Infografía: Biología 1" },
    pdf: { url: "/videos/video10/presentacion.pdf", titulo: "Guía: Biología 1" },
    podcast: { url: "/videos/video10/podcast.mp3", duracion: "8:30" }
  },
  "hv-11": {
    videoId: "hv-11",
    quiz: { url: "/quiz/video-11-quiz.html" },
    infografia: { url: "/videos/video11/infografia.png", descripcion: "Infografía: Biología 2" },
    pdf: { url: "/videos/video11/presentacion.pdf", titulo: "Guía: Biología 2" },
    podcast: { url: "/videos/video11/podcast.mp3", duracion: "8:30" }
  },
  "hv-12": {
    videoId: "hv-12",
    quiz: { url: "/quiz/video-12-quiz.html" },
    infografia: { url: "/videos/video12/infografia.png", descripcion: "Infografía: Biología 3" },
    pdf: { url: "/videos/video12/presentacion.pdf", titulo: "Guía: Biología 3" },
    podcast: { url: "/videos/video12/podcast.mp3", duracion: "8:30" }
  },
  "hv-13": {
    videoId: "hv-13",
    quiz: { url: "/quiz/video-13-quiz.html" },
    infografia: { url: "/videos/video13/infografia.png", descripcion: "Infografía: Biología 4" },
    pdf: { url: "/videos/video13/presentacion.pdf", titulo: "Guía: Biología 4" },
    podcast: { url: "/videos/video13/podcast.mp3", duracion: "8:30" }
  },
  "hv-14": {
    videoId: "hv-14",
    quiz: { url: "/quiz/video-14-quiz.html" },
    infografia: { url: "/videos/video14/infografia.png", descripcion: "Infografía: Biología 5" },
    pdf: { url: "/videos/video14/presentacion.pdf", titulo: "Guía: Biología 5" },
    podcast: { url: "/videos/video14/podcast.mp3", duracion: "8:30" }
  },
  "hv-15": {
    videoId: "hv-15",
    quiz: { url: "/quiz/video-15-quiz.html" },
    infografia: { url: "/videos/video15/infografia.png", descripcion: "Infografía: Biología 6" },
    pdf: { url: "/videos/video15/presentacion.pdf", titulo: "Guía: Biología 6" },
    podcast: { url: "/videos/video15/podcast.mp3", duracion: "8:30" }
  },
  "hv-16": {
    videoId: "hv-16",
    quiz: { url: "/quiz/video-16-quiz.html" },
    infografia: { url: "/videos/video16/infografia.png", descripcion: "Infografía: Biología 7" },
    pdf: { url: "/videos/video16/presentacion.pdf", titulo: "Guía: Biología 7" },
    podcast: { url: "/videos/video16/podcast.mp3", duracion: "8:30" }
  },
  "hv-17": {
    videoId: "hv-17",
    quiz: { url: "/quiz/video-17-quiz.html" },
    infografia: { url: "/videos/video17/infografia.png", descripcion: "Infografía: Física 1" },
    pdf: { url: "/videos/video17/presentacion.pdf", titulo: "Guía: Física 1" },
    podcast: { url: "/videos/video17/podcast.mp3", duracion: "8:30" }
  },
  "hv-18": {
    videoId: "hv-18",
    quiz: { url: "/quiz/video-18-quiz.html" },
    infografia: { url: "/videos/video18/infografia.png", descripcion: "Infografía: Física 2" },
    pdf: { url: "/videos/video18/presentacion.pdf", titulo: "Guía: Física 2" },
    podcast: { url: "/videos/video18/podcast.mp3", duracion: "8:30" }
  },
  "hv-19": {
    videoId: "hv-19",
    quiz: { url: "/quiz/video-19-quiz.html" },
    infografia: { url: "/videos/video19/infografia.png", descripcion: "Infografía: Física 3" },
    pdf: { url: "/videos/video19/presentacion.pdf", titulo: "Guía: Física 3" },
    podcast: { url: "/videos/video19/podcast.mp3", duracion: "8:30" }
  },
  "hv-20": {
    videoId: "hv-20",
    quiz: { url: "/quiz/video-20-quiz.html" },
    infografia: { url: "/videos/video20/infografia.png", descripcion: "Infografía: Física 4" },
    pdf: { url: "/videos/video20/presentacion.pdf", titulo: "Guía: Física 4" },
    podcast: { url: "/videos/video20/podcast.mp3", duracion: "8:30" }
  },
  "hv-21": {
    videoId: "hv-21",
    quiz: { url: "/quiz/video-21-quiz.html" },
    infografia: { url: "/videos/video21/infografia.png", descripcion: "Infografía: Física 5" },
    pdf: { url: "/videos/video21/presentacion.pdf", titulo: "Guía: Física 5" },
    podcast: { url: "/videos/video21/podcast.mp3", duracion: "8:30" }
  },
  "hv-22": {
    videoId: "hv-22",
    quiz: { url: "/quiz/video-22-quiz.html" },
    infografia: { url: "/videos/video22/infografia.png", descripcion: "Infografía: Física 6" },
    pdf: { url: "/videos/video22/presentacion.pdf", titulo: "Guía: Física 6" },
    podcast: { url: "/videos/video22/podcast.mp3", duracion: "8:30" }
  },
  "hv-23": {
    videoId: "hv-23",
    quiz: { url: "/quiz/video-23-quiz.html" },
    infografia: { url: "/videos/video23/infografia.png", descripcion: "Infografía: Física 7" },
    pdf: { url: "/videos/video23/presentacion.pdf", titulo: "Guía: Física 7" },
    podcast: { url: "/videos/video23/podcast.mp3", duracion: "8:30" }
  },
  "hv-24": {
    videoId: "hv-24",
    quiz: { url: "/quiz/video-24-quiz.html" },
    infografia: { url: "/videos/video24/infografia.png", descripcion: "Infografía: Química 1" },
    pdf: { url: "/videos/video24/presentacion.pdf", titulo: "Guía: Química 1" },
    podcast: { url: "/videos/video24/podcast.mp3", duracion: "8:30" }
  },
  "hv-25": {
    videoId: "hv-25",
    quiz: { url: "/quiz/video-25-quiz.html" },
    infografia: { url: "/videos/video25/infografia.png", descripcion: "Infografía: Química 2" },
    pdf: { url: "/videos/video25/presentacion.pdf", titulo: "Guía: Química 2" },
    podcast: { url: "/videos/video25/podcast.mp3", duracion: "8:30" }
  },
  "hv-26": {
    videoId: "hv-26",
    quiz: { url: "/quiz/video-26-quiz.html" },
    infografia: { url: "/videos/video26/infografia.png", descripcion: "Infografía: Química 3" },
    pdf: { url: "/videos/video26/presentacion.pdf", titulo: "Guía: Química 3" },
    podcast: { url: "/videos/video26/podcast.mp3", duracion: "8:30" }
  },
  "hv-27": {
    videoId: "hv-27",
    quiz: { url: "/quiz/video-27-quiz.html" },
    infografia: { url: "/videos/video27/infografia.png", descripcion: "Infografía: Química 4" },
    pdf: { url: "/videos/video27/presentacion.pdf", titulo: "Guía: Química 4" },
    podcast: { url: "/videos/video27/podcast.mp3", duracion: "8:30" }
  },
  "hv-28": {
    videoId: "hv-28",
    quiz: { url: "/quiz/video-28-quiz.html" },
    infografia: { url: "/videos/video28/infografia.png", descripcion: "Infografía: Química 5" },
    pdf: { url: "/videos/video28/presentacion.pdf", titulo: "Guía: Química 5" },
    podcast: { url: "/videos/video28/podcast.mp3", duracion: "8:30" }
  },
  "hv-29": {
    videoId: "hv-29",
    quiz: { url: "/quiz/video-29-quiz.html" },
    infografia: { url: "/videos/video29/infografia.png", descripcion: "Infografía: Química 6" },
    pdf: { url: "/videos/video29/presentacion.pdf", titulo: "Guía: Química 6" },
    podcast: { url: "/videos/video29/podcast.mp3", duracion: "8:30" }
  },
  "hv-30": {
    videoId: "hv-30",
    quiz: { url: "/quiz/video-30-quiz.html" },
    infografia: { url: "/videos/video30/infografia.png", descripcion: "Infografía: Química 7" },
    pdf: { url: "/videos/video30/presentacion.pdf", titulo: "Guía: Química 7" },
    podcast: { url: "/videos/video30/podcast.mp3", duracion: "8:30" }
  },
  "hv-31": {
    videoId: "hv-31",
    quiz: { url: "/quiz/video-31-quiz.html" },
    infografia: { url: "/videos/video31/infografia.png", descripcion: "Infografía: Matemáticas 1" },
    pdf: { url: "/videos/video31/presentacion.pdf", titulo: "Guía: Matemáticas 1" },
    podcast: { url: "/videos/video31/podcast.mp3", duracion: "8:30" }
  },
  "hv-32": {
    videoId: "hv-32",
    quiz: { url: "/quiz/video-32-quiz.html" },
    infografia: { url: "/videos/video32/infografia.png", descripcion: "Infografía: Matemáticas 2" },
    pdf: { url: "/videos/video32/presentacion.pdf", titulo: "Guía: Matemáticas 2" },
    podcast: { url: "/videos/video32/podcast.mp3", duracion: "8:30" }
  },
  "hv-33": {
    videoId: "hv-33",
    quiz: { url: "/quiz/video-33-quiz.html" },
    infografia: { url: "/videos/video33/infografia.png", descripcion: "Infografía: Matemáticas 3" },
    pdf: { url: "/videos/video33/presentacion.pdf", titulo: "Guía: Matemáticas 3" },
    podcast: { url: "/videos/video33/podcast.mp3", duracion: "8:30" }
  },
  "hv-34": {
    videoId: "hv-34",
    quiz: { url: "/quiz/video-34-quiz.html" },
    infografia: { url: "/videos/video34/infografia.png", descripcion: "Infografía: Matemáticas 4" },
    pdf: { url: "/videos/video34/presentacion.pdf", titulo: "Guía: Matemáticas 4" },
    podcast: { url: "/videos/video34/podcast.mp3", duracion: "8:30" }
  },
  "hv-35": {
    videoId: "hv-35",
    quiz: { url: "/quiz/video-35-quiz.html" },
    infografia: { url: "/videos/video35/infografia.png", descripcion: "Infografía: Matemáticas 5" },
    pdf: { url: "/videos/video35/presentacion.pdf", titulo: "Guía: Matemáticas 5" },
    podcast: { url: "/videos/video35/podcast.mp3", duracion: "8:30" }
  },
  "hv-36": {
    videoId: "hv-36",
    quiz: { url: "/quiz/video-36-quiz.html" },
    infografia: { url: "/videos/video36/infografia.png", descripcion: "Infografía: Matemáticas 6" },
    pdf: { url: "/videos/video36/presentacion.pdf", titulo: "Guía: Matemáticas 6" },
    podcast: { url: "/videos/video36/podcast.mp3", duracion: "8:30" }
  },
  "hv-37": {
    videoId: "hv-37",
    quiz: { url: "/quiz/video-37-quiz.html" },
    infografia: { url: "/videos/video37/infografia.png", descripcion: "Infografía: Matemáticas 7" },
    pdf: { url: "/videos/video37/presentacion.pdf", titulo: "Guía: Matemáticas 7" },
    podcast: { url: "/videos/video37/podcast.mp3", duracion: "8:30" }
  },
  "hv-38": {
    videoId: "hv-38",
    quiz: { url: "/quiz/video-38-quiz.html" },
    infografia: { url: "/videos/video38/infografia.png", descripcion: "Infografía: Matemáticas 8" },
    pdf: { url: "/videos/video38/presentacion.pdf", titulo: "Guía: Matemáticas 8" },
    podcast: { url: "/videos/video38/podcast.mp3", duracion: "8:30" }
  },
  "hv-39": {
    videoId: "hv-39",
    quiz: { url: "/quiz/video-39-quiz.html" },
    infografia: { url: "/videos/video39/infografia.png", descripcion: "Infografía: Matemáticas 9" },
    pdf: { url: "/videos/video39/presentacion.pdf", titulo: "Guía: Matemáticas 9" },
    podcast: { url: "/videos/video39/podcast.mp3", duracion: "8:30" }
  },
  "hv-40": {
    videoId: "hv-40",
    quiz: { url: "/quiz/video-40-quiz.html" },
    infografia: { url: "/videos/video40/infografia.png", descripcion: "Infografía: Matemáticas 10" },
    pdf: { url: "/videos/video40/presentacion.pdf", titulo: "Guía: Matemáticas 10" },
    podcast: { url: "/videos/video40/podcast.mp3", duracion: "8:30" }
  },
  "hv-41": {
    videoId: "hv-41",
    quiz: { url: "/quiz/video-41-quiz.html" },
    infografia: { url: "/videos/video41/infografia.png", descripcion: "Infografía: Matemáticas 11" },
    pdf: { url: "/videos/video41/presentacion.pdf", titulo: "Guía: Matemáticas 11" },
    podcast: { url: "/videos/video41/podcast.mp3", duracion: "8:30" }
  },
  "hv-42": {
    videoId: "hv-42",
    quiz: { url: "/quiz/video-42-quiz.html" },
    infografia: { url: "/videos/video42/infografia.png", descripcion: "Infografía: Matemáticas 12" },
    pdf: { url: "/videos/video42/presentacion.pdf", titulo: "Guía: Matemáticas 12" },
    podcast: { url: "/videos/video42/podcast.mp3", duracion: "8:30" }
  },
  "hv-43": {
    videoId: "hv-43",
    quiz: { url: "/quiz/video-43-quiz.html" },
    infografia: { url: "/videos/video43/infografia.png", descripcion: "Infografía: Matemáticas 13" },
    pdf: { url: "/videos/video43/presentacion.pdf", titulo: "Guía: Matemáticas 13" },
    podcast: { url: "/videos/video43/podcast.mp3", duracion: "8:30" }
  },
  "hv-44": {
    videoId: "hv-44",
    quiz: { url: "/quiz/video-44-quiz.html" },
    infografia: { url: "/videos/video44/infografia.png", descripcion: "Infografía: Matemáticas 14" },
    pdf: { url: "/videos/video44/presentacion.pdf", titulo: "Guía: Matemáticas 14" },
    podcast: { url: "/videos/video44/podcast.mp3", duracion: "8:30" }
  },
  "hv-45": {
    videoId: "hv-45",
    quiz: { url: "/quiz/video-45-quiz.html" },
    infografia: { url: "/videos/video45/infografia.png", descripcion: "Infografía: Historia 1" },
    pdf: { url: "/videos/video45/presentacion.pdf", titulo: "Guía: Historia 1" },
    podcast: { url: "/videos/video45/podcast.mp3", duracion: "8:30" }
  },
  "hv-46": {
    videoId: "hv-46",
    quiz: { url: "/quiz/video-46-quiz.html" },
    infografia: { url: "/videos/video46/infografia.png", descripcion: "Infografía: Historia 2" },
    pdf: { url: "/videos/video46/presentacion.pdf", titulo: "Guía: Historia 2" },
    podcast: { url: "/videos/video46/podcast.mp3", duracion: "8:30" }
  },
  "hv-47": {
    videoId: "hv-47",
    quiz: { url: "/quiz/video-47-quiz.html" },
    infografia: { url: "/videos/video47/infografia.png", descripcion: "Infografía: Historia 3" },
    pdf: { url: "/videos/video47/presentacion.pdf", titulo: "Guía: Historia 3" },
    podcast: { url: "/videos/video47/podcast.mp3", duracion: "8:30" }
  },
  "hv-48": {
    videoId: "hv-48",
    quiz: { url: "/quiz/video-48-quiz.html" },
    infografia: { url: "/videos/video48/infografia.png", descripcion: "Infografía: Historia 4" },
    pdf: { url: "/videos/video48/presentacion.pdf", titulo: "Guía: Historia 4" },
    podcast: { url: "/videos/video48/podcast.mp3", duracion: "8:30" }
  },
  "hv-49": {
    videoId: "hv-49",
    quiz: { url: "/quiz/video-49-quiz.html" },
    infografia: { url: "/videos/video49/infografia.png", descripcion: "Infografía: Historia 5" },
    pdf: { url: "/videos/video49/presentacion.pdf", titulo: "Guía: Historia 5" },
    podcast: { url: "/videos/video49/podcast.mp3", duracion: "8:30" }
  },
  "hv-50": {
    videoId: "hv-50",
    quiz: { url: "/quiz/video-50-quiz.html" },
    infografia: { url: "/videos/video50/infografia.png", descripcion: "Infografía: Historia 6" },
    pdf: { url: "/videos/video50/presentacion.pdf", titulo: "Guía: Historia 6" },
    podcast: { url: "/videos/video50/podcast.mp3", duracion: "8:30" }
  },
  "hv-51": {
    videoId: "hv-51",
    quiz: { url: "/quiz/video-51-quiz.html" },
    infografia: { url: "/videos/video51/infografia.png", descripcion: "Infografía: Historia 7" },
    pdf: { url: "/videos/video51/presentacion.pdf", titulo: "Guía: Historia 7" },
    podcast: { url: "/videos/video51/podcast.mp3", duracion: "8:30" }
  },
  "hv-52": {
    videoId: "hv-52",
    quiz: { url: "/quiz/video-52-quiz.html" },
    infografia: { url: "/videos/video52/infografia.png", descripcion: "Infografía: Historia 8" },
    pdf: { url: "/videos/video52/presentacion.pdf", titulo: "Guía: Historia 8" },
    podcast: { url: "/videos/video52/podcast.mp3", duracion: "8:30" }
  },
  "hv-53": {
    videoId: "hv-53",
    quiz: { url: "/quiz/video-53-quiz.html" },
    infografia: { url: "/videos/video53/infografia.png", descripcion: "Infografía: Historia 9" },
    pdf: { url: "/videos/video53/presentacion.pdf", titulo: "Guía: Historia 9" },
    podcast: { url: "/videos/video53/podcast.mp3", duracion: "8:30" }
  },
  "hv-54": {
    videoId: "hv-54",
    quiz: { url: "/quiz/video-54-quiz.html" },
    infografia: { url: "/videos/video54/infografia.png", descripcion: "Infografía: Historia 10" },
    pdf: { url: "/videos/video54/presentacion.pdf", titulo: "Guía: Historia 10" },
    podcast: { url: "/videos/video54/podcast.mp3", duracion: "8:30" }
  },
  "hv-55": {
    videoId: "hv-55",
    quiz: { url: "/quiz/video-55-quiz.html" },
    infografia: { url: "/videos/video55/infografia.png", descripcion: "Infografía: Historia 11" },
    pdf: { url: "/videos/video55/presentacion.pdf", titulo: "Guía: Historia 11" },
    podcast: { url: "/videos/video55/podcast.mp3", duracion: "8:30" }
  },
  "hv-56": {
    videoId: "hv-56",
    quiz: { url: "/quiz/video-56-quiz.html" },
    infografia: { url: "/videos/video56/infografia.png", descripcion: "Infografía: Historia 12" },
    pdf: { url: "/videos/video56/presentacion.pdf", titulo: "Guía: Historia 12" },
    podcast: { url: "/videos/video56/podcast.mp3", duracion: "8:30" }
  },
  "hv-57": {
    videoId: "hv-57",
    quiz: { url: "/quiz/video-57-quiz.html" },
    infografia: { url: "/videos/video57/infografia.png", descripcion: "Infografía: Historia 13" },
    pdf: { url: "/videos/video57/presentacion.pdf", titulo: "Guía: Historia 13" },
    podcast: { url: "/videos/video57/podcast.mp3", duracion: "8:30" }
  },
  "hv-58": {
    videoId: "hv-58",
    quiz: { url: "/quiz/video-58-quiz.html" },
    infografia: { url: "/videos/video58/infografia.png", descripcion: "Infografía: Historia 14" },
    pdf: { url: "/videos/video58/presentacion.pdf", titulo: "Guía: Historia 14" },
    podcast: { url: "/videos/video58/podcast.mp3", duracion: "8:30" }
  },
  "hv-59": {
    videoId: "hv-59",
    quiz: { url: "/quiz/video-59-quiz.html" },
    infografia: { url: "/videos/video59/infografia.png", descripcion: "Infografía: Español 1" },
    pdf: { url: "/videos/video59/presentacion.pdf", titulo: "Guía: Español 1" },
    podcast: { url: "/videos/video59/podcast.mp3", duracion: "8:30" }
  },
  "hv-60": {
    videoId: "hv-60",
    quiz: { url: "/quiz/video-60-quiz.html" },
    infografia: { url: "/videos/video60/infografia.png", descripcion: "Infografía: Español 2" },
    pdf: { url: "/videos/video60/presentacion.pdf", titulo: "Guía: Español 2" },
    podcast: { url: "/videos/video60/podcast.mp3", duracion: "8:30" }
  },
  "hv-61": {
    videoId: "hv-61",
    quiz: { url: "/quiz/video-61-quiz.html" },
    infografia: { url: "/videos/video61/infografia.png", descripcion: "Infografía: Español 3" },
    pdf: { url: "/videos/video61/presentacion.pdf", titulo: "Guía: Español 3" },
    podcast: { url: "/videos/video61/podcast.mp3", duracion: "8:30" }
  },
  "hv-62": {
    videoId: "hv-62",
    quiz: { url: "/quiz/video-62-quiz.html" },
    infografia: { url: "/videos/video62/infografia.png", descripcion: "Infografía: Español 4" },
    pdf: { url: "/videos/video62/presentacion.pdf", titulo: "Guía: Español 4" },
    podcast: { url: "/videos/video62/podcast.mp3", duracion: "8:30" }
  },
  "hv-63": {
    videoId: "hv-63",
    quiz: { url: "/quiz/video-63-quiz.html" },
    infografia: { url: "/videos/video63/infografia.png", descripcion: "Infografía: Repaso 1" },
    pdf: { url: "/videos/video63/presentacion.pdf", titulo: "Guía: Repaso 1" },
    podcast: { url: "/videos/video63/podcast.mp3", duracion: "8:30" }
  },
  "hv-64": {
    videoId: "hv-64",
    quiz: { url: "/quiz/video-64-quiz.html" },
    infografia: { url: "/videos/video64/infografia.png", descripcion: "Infografía: Repaso 2" },
    pdf: { url: "/videos/video64/presentacion.pdf", titulo: "Guía: Repaso 2" },
    podcast: { url: "/videos/video64/podcast.mp3", duracion: "8:30" }
  },
  "hv-65": {
    videoId: "hv-65",
    quiz: { url: "/quiz/video-65-quiz.html" },
    infografia: { url: "/videos/video65/infografia.png", descripcion: "Infografía: Repaso 3" },
    pdf: { url: "/videos/video65/presentacion.pdf", titulo: "Guía: Repaso 3" },
    podcast: { url: "/videos/video65/podcast.mp3", duracion: "8:30" }
  },
  "hv-66": {
    videoId: "hv-66",
    quiz: { url: "/quiz/video-66-quiz.html" },
    infografia: { url: "/videos/video66/infografia.png", descripcion: "Infografía: Repaso 4" },
    pdf: { url: "/videos/video66/presentacion.pdf", titulo: "Guía: Repaso 4" },
    podcast: { url: "/videos/video66/podcast.mp3", duracion: "8:30" }
  },
  "hv-67": {
    videoId: "hv-67",
    quiz: { url: "/quiz/video-67-quiz.html" },
    infografia: { url: "/videos/video67/infografia.png", descripcion: "Infografía: Repaso 5" },
    pdf: { url: "/videos/video67/presentacion.pdf", titulo: "Guía: Repaso 5" },
    podcast: { url: "/videos/video67/podcast.mp3", duracion: "8:30" }
  },
  "hv-68": {
    videoId: "hv-68",
    quiz: { url: "/quiz/video-68-quiz.html" },
    infografia: { url: "/videos/video68/infografia.png", descripcion: "Infografía: Repaso 6" },
    pdf: { url: "/videos/video68/presentacion.pdf", titulo: "Guía: Repaso 6" },
    podcast: { url: "/videos/video68/podcast.mp3", duracion: "8:30" }
  },
  "hv-69": {
    videoId: "hv-69",
    quiz: { url: "/quiz/video-69-quiz.html" },
    infografia: { url: "/videos/video69/infografia.png", descripcion: "Infografía: Repaso 7" },
    pdf: { url: "/videos/video69/presentacion.pdf", titulo: "Guía: Repaso 7" },
    podcast: { url: "/videos/video69/podcast.mp3", duracion: "8:30" }
  },
  "hv-70": {
    videoId: "hv-70",
    quiz: { url: "/quiz/video-70-quiz.html" },
    infografia: { url: "/videos/video70/infografia.png", descripcion: "Infografía: Repaso 8" },
    pdf: { url: "/videos/video70/presentacion.pdf", titulo: "Guía: Repaso 8" },
    podcast: { url: "/videos/video70/podcast.mp3", duracion: "8:30" }
  },
  "hv-71": {
    videoId: "hv-71",
    quiz: { url: "/quiz/video-71-quiz.html" },
    infografia: { url: "/videos/video71/infografia.png", descripcion: "Infografía: Repaso 9" },
    pdf: { url: "/videos/video71/presentacion.pdf", titulo: "Guía: Repaso 9" },
    podcast: { url: "/videos/video71/podcast.mp3", duracion: "8:30" }
  },
  "hv-72": {
    videoId: "hv-72",
    quiz: { url: "/quiz/video-72-quiz.html" },
    infografia: { url: "/videos/video72/infografia.png", descripcion: "Infografía: Repaso 10" },
    pdf: { url: "/videos/video72/presentacion.pdf", titulo: "Guía: Repaso 10" },
    podcast: { url: "/videos/video72/podcast.mp3", duracion: "8:30" }
  },
  "hv-73": {
    videoId: "hv-73",
    quiz: { url: "/quiz/video-73-quiz.html" },
    infografia: { url: "/videos/video73/infografia.png", descripcion: "Infografía: Simulador 1" },
    pdf: { url: "/videos/video73/presentacion.pdf", titulo: "Guía: Simulador 1" },
    podcast: { url: "/videos/video73/podcast.mp3", duracion: "8:30" }
  },
  "hv-74": {
    videoId: "hv-74",
    quiz: { url: "/quiz/video-74-quiz.html" },
    infografia: { url: "/videos/video74/infografia.png", descripcion: "Infografía: Simulador 2" },
    pdf: { url: "/videos/video74/presentacion.pdf", titulo: "Guía: Simulador 2" },
    podcast: { url: "/videos/video74/podcast.mp3", duracion: "8:30" }
  },
  "hv-75": {
    videoId: "hv-75",
    quiz: { url: "/quiz/video-75-quiz.html" },
    infografia: { url: "/videos/video75/infografia.png", descripcion: "Infografía: Simulador 3" },
    pdf: { url: "/videos/video75/presentacion.pdf", titulo: "Guía: Simulador 3" },
    podcast: { url: "/videos/video75/podcast.mp3", duracion: "8:30" }
  },
  "hv-76": {
    videoId: "hv-76",
    quiz: { url: "/quiz/video-76-quiz.html" },
    infografia: { url: "/videos/video76/infografia.png", descripcion: "Infografía: Simulador 4" },
    pdf: { url: "/videos/video76/presentacion.pdf", titulo: "Guía: Simulador 4" },
    podcast: { url: "/videos/video76/podcast.mp3", duracion: "8:30" }
  },
  "hv-77": {
    videoId: "hv-77",
    quiz: { url: "/quiz/video-77-quiz.html" },
    infografia: { url: "/videos/video77/infografia.png", descripcion: "Infografía: Simulador 5" },
    pdf: { url: "/videos/video77/presentacion.pdf", titulo: "Guía: Simulador 5" },
    podcast: { url: "/videos/video77/podcast.mp3", duracion: "8:30" }
  },
  "hv-78": {
    videoId: "hv-78",
    quiz: { url: "/quiz/video-78-quiz.html" },
    infografia: { url: "/videos/video78/infografia.png", descripcion: "Infografía: Simulador 6" },
    pdf: { url: "/videos/video78/presentacion.pdf", titulo: "Guía: Simulador 6" },
    podcast: { url: "/videos/video78/podcast.mp3", duracion: "8:30" }
  },
  "hv-79": {
    videoId: "hv-79",
    quiz: { url: "/quiz/video-79-quiz.html" },
    infografia: { url: "/videos/video79/infografia.png", descripcion: "Infografía: Simulador 7" },
    pdf: { url: "/videos/video79/presentacion.pdf", titulo: "Guía: Simulador 7" },
    podcast: { url: "/videos/video79/podcast.mp3", duracion: "8:30" }
  },
  "hv-80": {
    videoId: "hv-80",
    quiz: { url: "/quiz/video-80-quiz.html" },
    infografia: { url: "/videos/video80/infografia.png", descripcion: "Infografía: Simulador 8" },
    pdf: { url: "/videos/video80/presentacion.pdf", titulo: "Guía: Simulador 8" },
    podcast: { url: "/videos/video80/podcast.mp3", duracion: "8:30" }
  },
  "hv-81": {
    videoId: "hv-81",
    quiz: { url: "/quiz/video-81-quiz.html" },
    infografia: { url: "/videos/video81/infografia.png", descripcion: "Infografía: Simulador 9" },
    pdf: { url: "/videos/video81/presentacion.pdf", titulo: "Guía: Simulador 9" },
    podcast: { url: "/videos/video81/podcast.mp3", duracion: "8:30" }
  },
  "hv-82": {
    videoId: "hv-82",
    quiz: { url: "/quiz/video-82-quiz.html" },
    infografia: { url: "/videos/video82/infografia.png", descripcion: "Infografía: Simulador 10" },
    pdf: { url: "/videos/video82/presentacion.pdf", titulo: "Guía: Simulador 10" },
    podcast: { url: "/videos/video82/podcast.mp3", duracion: "8:30" }
  },
  "hv-83": {
    videoId: "hv-83",
    quiz: { url: "/quiz/video-83-quiz.html" },
    infografia: { url: "/videos/video83/infografia.png", descripcion: "Infografía: Estrategias 1" },
    pdf: { url: "/videos/video83/presentacion.pdf", titulo: "Guía: Estrategias 1" },
    podcast: { url: "/videos/video83/podcast.mp3", duracion: "8:30" }
  },
  "hv-84": {
    videoId: "hv-84",
    quiz: { url: "/quiz/video-84-quiz.html" },
    infografia: { url: "/videos/video84/infografia.png", descripcion: "Infografía: Estrategias 2" },
    pdf: { url: "/videos/video84/presentacion.pdf", titulo: "Guía: Estrategias 2" },
    podcast: { url: "/videos/video84/podcast.mp3", duracion: "8:30" }
  },
  "hv-85": {
    videoId: "hv-85",
    quiz: { url: "/quiz/video-85-quiz.html" },
    infografia: { url: "/videos/video85/infografia.png", descripcion: "Infografía: Estrategias 3" },
    pdf: { url: "/videos/video85/presentacion.pdf", titulo: "Guía: Estrategias 3" },
    podcast: { url: "/videos/video85/podcast.mp3", duracion: "8:30" }
  },
  "hv-86": {
    videoId: "hv-86",
    quiz: { url: "/quiz/video-86-quiz.html" },
    infografia: { url: "/videos/video86/infografia.png", descripcion: "Infografía: Estrategias 4" },
    pdf: { url: "/videos/video86/presentacion.pdf", titulo: "Guía: Estrategias 4" },
    podcast: { url: "/videos/video86/podcast.mp3", duracion: "8:30" }
  },
  "hv-87": {
    videoId: "hv-87",
    quiz: { url: "/quiz/video-87-quiz.html" },
    infografia: { url: "/videos/video87/infografia.png", descripcion: "Infografía: Estrategias 5" },
    pdf: { url: "/videos/video87/presentacion.pdf", titulo: "Guía: Estrategias 5" },
    podcast: { url: "/videos/video87/podcast.mp3", duracion: "8:30" }
  },
  "hv-88": {
    videoId: "hv-88",
    quiz: { url: "/quiz/video-88-quiz.html" },
    infografia: { url: "/videos/video88/infografia.png", descripcion: "Infografía: Estrategias 6" },
    pdf: { url: "/videos/video88/presentacion.pdf", titulo: "Guía: Estrategias 6" },
    podcast: { url: "/videos/video88/podcast.mp3", duracion: "8:30" }
  },
  "hv-89": {
    videoId: "hv-89",
    quiz: { url: "/quiz/video-89-quiz.html" },
    infografia: { url: "/videos/video89/infografia.png", descripcion: "Infografía: Estrategias 7" },
    pdf: { url: "/videos/video89/presentacion.pdf", titulo: "Guía: Estrategias 7" },
    podcast: { url: "/videos/video89/podcast.mp3", duracion: "8:30" }
  },
  "hv-90": {
    videoId: "hv-90",
    quiz: { url: "/quiz/video-90-quiz.html" },
    infografia: { url: "/videos/video90/infografia.png", descripcion: "Infografía: Repaso Final" },
    pdf: { url: "/videos/video90/presentacion.pdf", titulo: "Guía: Repaso Final" },
    podcast: { url: "/videos/video90/podcast.mp3", duracion: "8:30" }
  }
};
