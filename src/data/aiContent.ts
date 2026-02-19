export interface AIContent {
    videoId: string;
    summary: string;
    deepExplanation: string;
    extraMaterials: { title: string; url: string; type: 'video' | 'article' | 'book' }[];
}

export const aiContent: Record<string, AIContent> = {
    "hv-1": {
        videoId: "hv-1",
        summary: "En este módulo de Comprensión Lectora, exploramos las 5 estrategias fundamentales para identificar ideas principales, analizar el tono del autor y extraer inferencias lógicas. Aprendimos que la lectura crítica no es solo leer palabras, sino entender la intención detrás de ellas.",
        deepExplanation: "La técnica de 'Escaneo vs Skimming' es vital. El skimming te da la idea general (el 'qué'), mientras que el escaneo busca datos específicos (el 'quién, cuándo, dónde'). Para el examen ECOEMS, enfócate en los conectores lógicos como 'sin embargo' o 'por lo tanto', ya que indican un cambio en la dirección del argumento.",
        extraMaterials: [
            { title: "Manual de Lectura Crítica UNAM", url: "https://www.unam.mx", type: "article" },
            { title: "Ejercicios de Analogías Avanzadas", url: "#", type: "book" }
        ]
    },
    "hm-1": {
        videoId: "hm-1",
        summary: "Revisión completa de series numéricas. Identificamos patrones aritméticos (suma/resta), geométricos (multiplicación/división) y combinados. La clave es encontrar la 'razón' entre el primer y segundo término.",
        deepExplanation: "Cuando una serie numérica parece aleatoria, intenta buscar una segunda capa de diferencias. A veces la diferencia entre los números forma su propia serie (series de segundo orden). También revisa los números primos y cuadrados perfectos, son clásicos de IPN y UNAM.",
        extraMaterials: [
            { title: "Calculadora de Patrones Lógicos", url: "#", type: "article" },
            { title: "Razonamiento Matemático Masterclass", url: "#", type: "video" }
        ]
    },
    "bio-1": {
        videoId: "bio-1",
        summary: "Introducción a la biología celular. Estudiamos los organelos principales: Núcleo (ADN), Mitocondria (Energía), Ribosomas (Proteínas) y la Membrana Plasmática.",
        deepExplanation: "El concepto más difícil suele ser la respiración celular en la mitocondria. Recuerda que el Ciclo de Krebs sucede en la matriz mitocondrial. La diferencia clave entre procariotas (bacterias) y eucariotas (animales/plantas) es la presencia de un núcleo definido y organelos membranosos.",
        extraMaterials: [
            { title: "Atlas de Células 3D", url: "#", type: "article" },
            { title: "Biología de Curtis (Resumen)", url: "#", type: "book" }
        ]
    },
    "fis-1": {
        videoId: "fis-1",
        summary: "Repaso de magnitudes físicas: escalares (solo número) vs vectoriales (número + dirección). Introducción a la cinemática básica.",
        deepExplanation: "Un error común es confundir Distancia con Desplazamiento. El desplazamiento es el vector desde el punto A al B, mientras que la distancia es todo lo recorrido. En el examen, si un corredor da una vuelta completa a una pista y llega al mismo lugar, su desplazamiento es CERO, pero su distancia es el perímetro.",
        extraMaterials: [
            { title: "Simulador de Vectores", url: "#", type: "video" },
            { title: "Física Universitaria Sears", url: "#", type: "book" }
        ]
    }
};
