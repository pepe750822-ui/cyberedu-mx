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
}

export const materiales: Record<string, MaterialVideo> = {
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
      url: "/material/video-01/podcast.mp3",
      duracion: "8:30"
    },
    infografia: {
      url: "/material/video-01/infografia.png",
      descripcion: "Infografía sobre comprensión lectora"
    },
    pdf: {
      url: "/material/video-01/material.pdf",
      titulo: "Guía de comprensión lectora"
    }
  },
};
