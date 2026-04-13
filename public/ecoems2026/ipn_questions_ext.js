const ipnQuestions = {
    'matematicas': [
        {
            q: "Una persona caminó durante media hora y luego consiguió un aventón que duró la tercera parte de una hora. ¿Qué parte de una hora duró el viaje completo?",
            options: ["3/2", "5/6", "4/3", "8/6"],
            correct: 1,
            rationale: "Se puede llegar al resultado mediante una suma de fracciones: 1/2 + 1/3 = (3+2)/6 = 5/6. Si media hora son 30 minutos y un tercio de hora son 20, la suma nos da 50 minutos y la hora tiene 60. Comparando ambas cantidades tenemos que 50/60 = 5/6."
        },
        {
            q: "Es el polígono que se forma por la intersección de tres segmentos y la suma de sus ángulos interiores es de 180º.",
            options: ["Cuadrilátero", "Pentágono", "Heptágono", "Triángulo"],
            correct: 3,
            rationale: "El triángulo es el polígono que se forma por la intersección de tres segmentos y la suma de sus ángulos interiores es de 180º."
        },
        {
            q: "Es el teorema que enuncia: El cuadrado de la hipotenusa es igual a la suma de los cuadrados de los catetos.",
            options: ["Arquímedes", "Euclides", "Pitágoras", "Tales"],
            correct: 2,
            rationale: "El teorema de Pitágoras que es para triángulos rectángulos es el que enuncia que 'El cuadrado de la hipotenusa es igual a la suma de los cuadrados de los catetos'."
        }
    ],
    'fisica': [
        {
            q: "¿Cuál es el principio en el que se basa el funcionamiento del gato hidráulico?",
            options: ["Bernoulli", "Torricelli", "Arquímedes", "Pascal"],
            correct: 3,
            rationale: "Una aplicación del Principio de Pascal es la prensa hidráulica y su funcionamiento se basa en multiplicar la fuerza aplicada. Dicho principio dice que: 'Al modificar la presión en una parte del fluido, el cambio se transmite a todo el fluido con igual intensidad en todos los puntos'."
        },
        {
            q: "El proceso por el que se transfiere la energía térmica mediante colisiones de moléculas adyacentes a lo largo de un medio material.",
            options: ["Convección", "Conducción", "Radiación", "Reflexión"],
            correct: 1,
            rationale: "Cuando dos partes de un material se mantienen a temperaturas diferentes, la energía se transfiere por colisiones moleculares... Este proceso de conducción es favorecido también por el movimiento de los electrones libres en el interior de la sustancia."
        }
    ],
    'biologia': [
        {
            q: "Nombre que recibe la variedad de seres vivos y las relaciones que establecen entre sí y con el medio que los rodea.",
            options: ["Diversidad", "Ecosistema", "Biodiversidad", "Ambiente"],
            correct: 2,
            rationale: "La biodiversidad es la diversidad de vida, la variedad de seres vivos que existen en el planeta y las relaciones que establecen entre sí y con el medio que los rodea."
        },
        {
            q: "Proceso biológico que permite la generación de nuevos individuos para preservar las especies.",
            options: ["Adaptación", "Supervivencia", "Reproducción", "Sexualidad"],
            correct: 2,
            rationale: "La reproducción es un proceso biológico sexual o asexual, que permite la formación de nuevos individuos, siendo una propiedad común de todas las formas de vida conocidas, con el propósito de preservar las especies."
        }
    ],
    'espanol': [
        {
            q: "Los artículos de opinión son textos ________ breves que tratan un tema actual y controvertido.",
            options: ["descriptivos", "expositivos", "comparativos", "argumentativos"],
            correct: 3,
            rationale: "Los artículos de opinión son textos argumentativos que requieren que el autor sustente de forma válida su punto de vista."
        },
        {
            q: "Es la explicación de un texto empleando las propias palabras para aclarar las ideas o facilitar su comprensión.",
            options: ["Cita textual", "Índice", "Paráfrasis", "Explicación"],
            correct: 2,
            rationale: "La paráfrasis consiste en decir con palabras propias lo que se ha leído o escuchado, conservando la idea original del autor."
        }
    ]
};

// Merge IPN questions into subjectsData in questions_data.js logic
function injectIpnQuestions() {
    for (const key in ipnQuestions) {
        if (subjectsData[key]) {
            // Prepend real questions to the quiz array
            subjectsData[key].quiz = [...ipnQuestions[key], ...subjectsData[key].quiz];
        }
    }
}
