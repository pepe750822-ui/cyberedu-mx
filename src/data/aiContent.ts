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
            { title: "Manual de Lectura Crítica UNAM", url: "https://programas.cuaed.unam.mx/repositorio/moodle/pluginfile.php/166/mod_resource/content/1/lectura-critica/index.html", type: "article" },
            { title: "Ejercicios de Analogías Verbales", url: "https://pruebat.org/Inicio/ConoceMas/RazonamientoVerbal", type: "book" }
        ]
    },
    "hm-1": {
        videoId: "hm-1",
        summary: "Revisión completa de series numéricas. Identificamos patrones aritméticos (suma/resta), geométricos (multiplicación/división) y combinados. La clave es encontrar la 'razón' entre el primer y segundo término.",
        deepExplanation: "Cuando una serie numérica parece aleatoria, intenta buscar una segunda capa de diferencias. A veces la diferencia entre los números forma su propia serie (series de segundo orden). También revisa los números primos y cuadrados perfectos, son clásicos de IPN y UNAM.",
        extraMaterials: [
            { title: "Calculadora de Series y Patrones", url: "https://es.symbolab.com/solver/sequence-calculator", type: "article" },
            { title: "Razonamiento Matemático (Khan Academy)", url: "https://es.khanacademy.org/math", type: "video" }
        ]
    },
    "bio-1": {
        videoId: "bio-1",
        summary: "Introducción a la biología celular. Estudiamos los organelos principales: Núcleo (ADN), Mitocondria (Energía), Ribosomas (Proteínas) y la Membrana Plasmática.",
        deepExplanation: "El concepto más difícil suele ser la respiración celular en la mitocondria. Recuerda que el Ciclo de Krebs sucede en la matriz mitocondrial. La diferencia clave entre procariotas (bacterias) y eucariotas (animales/plantas) es la presencia de un núcleo definido y organelos membranosos.",
        extraMaterials: [
            { title: "Modelos de Células Interactivos 3D", url: "https://www.cellsalive.com/cells/3dcell.htm", type: "article" },
            { title: "Resumen Biología Celular y Molecular", url: "https://es.khanacademy.org/science/biology/structure-of-a-cell", type: "book" }
        ]
    },
    "fis-1": {
        videoId: "fis-1",
        summary: "Repaso de magnitudes físicas: escalares (solo número) vs vectoriales (número + dirección). Introducción a la cinemática básica.",
        deepExplanation: "Un error común es confundir Distancia con Desplazamiento. El desplazamiento es el vector desde el punto A al B, mientras que la distancia es todo lo recorrido. En el examen, si un corredor da una vuelta completa a una pista y llega al mismo lugar, su desplazamiento es CERO, pero su distancia es el perímetro.",
        extraMaterials: [
            { title: "Simulador de Adición de Vectores, PhET", url: "https://phet.colorado.edu/es/simulations/vector-addition", type: "video" },
            { title: "Física Universitaria (OpenStax)", url: "https://openstax.org/details/books/f%C3%ADsica-universitaria-volumen-1", type: "book" }
        ]
    }
};
