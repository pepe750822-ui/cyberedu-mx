// ===== BASE DE DATOS Y GENERADORES DE PREGUNTAS =====

const subjectsData = {
    'hab_verb': {
        name: "Habilidad Verbal",
        icon: "fa-comments",
        color: "#00f3ff",
        desc: "Comprensión lectora, vocabulario y razonamiento verbal.",
        subindices: [
            "1.1 Reconocer información explícita",
            "1.2 Inferir hechos",
            "1.3 Identificar el resumen",
            "1.4 Completar cuadro sinóptico",
            "1.5 Identificar la conclusión",
            "1.6 Identificar secuencia de acontecimientos",
            "1.7 Reconocer distintos tipos de relaciones",
            "1.8 Distinguir entre hechos y opiniones",
            "1.9 Identificar idea principal y secundarias",
            "1.10 Reconocer significado contextual",
            "2.1 Establecer analogías entre palabras",
            "2.2 Distinguir palabras opuestas",
            "2.3 Distinguir palabras similares"
        ],
        quiz: [
            // 1.1 Reconocer información explícita
            {
                q: "¿Qué es una paráfrasis?",
                options: ["Una repetición literal de un texto", "Una explicación de un texto con palabras propias", "Un resumen corto de un libro", "Una crítica literaria"],
                correct: 1,
                rationale: "La paráfrasis consiste en expresar los contenidos de un texto con palabras diferentes para facilitar su comprensión, sin perder la idea original."
            },
            {
                q: "En un texto expositivo, ¿cuál es la función principal de las gráficas y cuadros?",
                options: ["Adornar la página", "Sustituir al texto principal", "Complementar y organizar la información", "Confundir al lector"],
                correct: 2,
                rationale: "Las gráficas y cuadros sinópticos sirven para organizar visualmente los datos y complementar la información textual, facilitando la comprensión de conceptos complejos."
            },
            {
                q: "¿Cuál de los siguientes es un ejemplo de dato explícito en un texto?",
                options: ["El sentimiento del autor", "La fecha exacta de un acontecimiento", "La intención oculta del narrador", "Una suposición del lector"],
                correct: 1,
                rationale: "La información explícita es aquella que aparece escrita directamente en el texto, como fechas, nombres o lugares."
            }
        ]
    },

    'hab_mat': {
        name: "Habilidad Matemática",
        icon: "fa-brain",
        color: "#ff00ff",
        desc: "Razonamiento lógico-matemático, series y problemas numéricos.",
        subindices: [
            "1. Sucesiones numéricas",
            "2. Series espaciales",
            "3. Imaginación espacial",
            "4. Problemas de razonamiento"
        ],
        quiz: []
    },

    'matematicas': {
        name: "Matemáticas",
        icon: "fa-calculator",
        color: "#00ff9d",
        desc: "Álgebra, geometría, aritmética y cálculo básico.",
        subindices: [
            "1.1 Significado y uso de números enteros",
            "1.2 Resolución de problemas con enteros",
            "1.3 Relaciones de proporcionalidad",
            "1.4 Operaciones con fracciones y decimales",
            "1.5 Porcentajes",
            "1.6 Potenciación y radicación",
            "1.7 Problemas con fracciones/decimales",
            "3.1 Aritmética básica",
            "3.2 Álgebra elemental",
            "3.3 Geometría plana"
        ],
        quiz: [
            // 1.1 Significado y uso de números enteros
            {
                q: "¿Cuál es el resultado de la operación -5 + (-3) - (-2)?",
                options: ["-10", "-6", "0", "4"],
                correct: 1,
                rationale: "-5 + (-3) es -8. Luego, -8 - (-2) se convierte en -8 + 2, lo cual da como resultado -6."
            },
            {
                q: "Si un buzo se encuentra a -15 metros y desciende otros 10 metros, ¿a qué profundidad se encuentra?",
                options: ["-5 metros", "-25 metros", "5 metros", "25 metros"],
                correct: 1,
                rationale: "Al descender, se resta profundidad. -15 - 10 = -25 metros."
            },
            {
                q: "¿Qué número entero representa una deuda de 500 pesos?",
                options: ["500", "0", "-500", "0.5"],
                correct: 2,
                rationale: "En el contexto de finanzas, las deudas se representan con números negativos, mientras que los ahorros con números positivos."
            }
        ]
    },

    'biologia': {
        name: "Biología",
        icon: "fa-dna",
        color: "#ff9900",
        desc: "Célula, genética, ecología, anatomy y fisiología humana.",
        subindices: [
            "1.1 Características de los seres vivos",
            "1.2 Aportaciones de Darwin",
            "4.1 La célula",
            "4.2 Genética y herencia",
            "4.3 Evolución",
            "4.4 Ecología y ecosistemas",
            "4.5 Sistema digestivo",
            "4.6 Sistema respiratorio",
            "4.7 Sistema circulatorio",
            "4.8 Sistema nervioso"
        ],
        quiz: []
    },

    'fisica': {
        name: "Física",
        icon: "fa-atom",
        color: "#9900ff",
        desc: "Mecánica, energía, electricidad, magnetismo y óptica.",
        subindices: [
            "1.1 Conceptos de velocidad y rapidez",
            "1.2 Tipos de movimientos en gráficas",
            "1.3 Relación entre gráficas y datos",
            "1.4 Velocidad, desplazamiento y tiempo",
            "1.5 Movimiento con velocidad variable",
            "1.6 Movimiento de cuerpos que caen",
            "2.1 Fuerza resultante",
            "2.2 Leyes de Newton",
            "2.3 Pares de fuerzas",
            "2.4 Fuerzas sobre objetos",
            "2.5 Ley de Gravitación Universal",
            "2.6 Energía y transformaciones",
            "2.7 Conservación de energía mecánica",
            "2.8 Cargas eléctricas",
            "2.9 Imanes y magnetismo"
        ],
        quiz: []
    },

    'quimica': {
        name: "Química",
        icon: "fa-flask",
        color: "#ff3366",
        desc: "Materia, elementos, compuestos, reacciones y enlaces químicos.",
        subindices: [
            "6.1 Materia y energía",
            "6.2 Estructura atómica",
            "6.3 Tabla periódica",
            "6.4 Enlaces químicos",
            "6.5 Reacciones químicas",
            "6.6 Estequiometría",
            "6.7 Disoluciones",
            "6.8 Ácidos y bases"
        ],
        quiz: []
    },

    'historia': {
        name: "Historia",
        icon: "fa-landmark",
        color: "#ffcc00",
        desc: "Historia de México y Universal.",
        subindices: [
            "1.1 Contexto mundial siglo XVI",
            "1.2 Renovación cultural (humanismo)",
            "1.3 Expediciones marítimas",
            "2.1 Ilustración y enciclopedia",
            "2.2 Absolutismo europeo",
            "2.3 Independencia 13 colonias",
            "2.4 Causas Revolución Francesa",
            "2.5 Consecuencias en América",
            "2.6 Revolución Industrial",
            "3.1 Nacionalismo",
            "3.2 Imperialismo",
            "3.3 Primera Guerra Mundial",
            "3.4 Paz de Versalles",
            "4.1 Socialismo, nazismo, fascismo",
            "4.2 Pobreza en el mundo"
        ],
        quiz: []
    },

    'geografia': {
        name: "Geografía",
        icon: "fa-globe-americas",
        color: "#00cc99",
        desc: "Geografía física, humana y económica de México y el mundo.",
        subindices: [
            "1.1 Componentes del espacio geográfico",
            "1.2 Categorías de análisis",
            "1.3 Conceptos básicos",
            "1.4 Coordenadas geográficas",
            "1.5 Tipos de representación",
            "1.6 Sistemas de Información",
            "1.7 Mapas temáticos",
            "2.1 Movimientos de la Tierra",
            "2.2 Tectónica de placas",
            "2.3 Ciclo hidrológico",
            "2.4 Capas de la atmósfera",
            "2.5 Clasificación de climas",
            "2.6 Biosfera",
            "2.7 Biodiversidad",
            "2.8 Recursos naturales"
        ],
        quiz: []
    },

    'espanol': {
        name: "Español",
        icon: "fa-language",
        color: "#9966ff",
        desc: "Gramática, ortografía, literatura y comunicación escrita.",
        subindices: [
            "9.1 Sustantivos y adjetivos",
            "9.2 Verbos y conjugación",
            "9.3 Sintaxis básica",
            "9.4 Ortografía",
            "9.5 Acentuación",
            "9.6 Signos de puntuación",
            "9.7 Géneros literarios",
            "9.8 Figuras retóricas"
        ],
        quiz: []
    },

    'civica': {
        name: "Formación Cívica",
        icon: "fa-balance-scale",
        color: "#ff6666",
        desc: "Derechos humanos, gobierno, democracia y valores ciudadanos.",
        subindices: [
            "10.1 Derechos humanos",
            "10.2 Constitución Mexicana",
            "10.3 Poderes de la Unión",
            "10.4 Democracia y participación",
            "10.5 Valores cívicos",
            "10.6 Educación para la paz",
            "10.7 Desarrollo sostenible",
            "10.8 Ciudadanía global"
        ],
        quiz: []
    }
};

// ===== GENERADORES DE CONTENIDO DUMMY (PLACEHOLDERS) =====

function generateAllQuestions() {
    console.log("🧠 Generando banco de preguntas...");
    generateSmartPlaceholders();
}

function generateSmartPlaceholders() {
    for (const subjectKey in subjectsData) {
        const subject = subjectsData[subjectKey];

        // Guardar las preguntas reales que ya existan
        const realQuestions = [...subject.quiz];
        subject.quiz = []; // Limpiar para reconstruir respetando el orden por subíndice

        const questionsPerSubindex = 10;

        subject.subindices.forEach((subindexName, subIdx) => {
            // Ver si ya hay preguntas reales para este subíndice
            // (En este diseño simple, asumimos que las primeras preguntas reales pertenecen al primer subíndice)
            // Una mejor implementación mapearía preguntas a subíndices explícitamente.

            let questionsForThisSubindex = [];

            // Si es el primer subíndice, inyectar las reales que pusimos arriba
            if (subIdx === 0 && realQuestions.length > 0) {
                questionsForThisSubindex = realQuestions;
            }

            // Rellenar hasta tener 10 preguntas por subíndice
            for (let i = questionsForThisSubindex.length; i < questionsPerSubindex; i++) {
                questionsForThisSubindex.push({
                    q: `[PRÁCTICA] Pregunta sobre: ${subindexName} (${i + 1})`,
                    options: generateOptionsForSubject(subjectKey),
                    correct: Math.floor(Math.random() * 4),
                    rationale: `Explicación para el tema: ${subindexName}. Aquí se detalla el concepto evaluado para reforzar el aprendizaje del alumno.`
                });
            }

            // Añadir al quiz general de la materia
            subject.quiz.push(...questionsForThisSubindex);
        });

        console.log(`✅ ${subject.name}: ${subject.quiz.length} preguntas listas.`);
    }
}

function generateOptionsForSubject(subjectKey) {
    const templates = {
        'hab_mat': ["15", "20", "25", "30"],
        'matematicas': ["x = 5", "x = 10", "x = -2", "x = 0"],
        'default': ["Opción A (Incorrecta)", "Opción B (Correcta)", "Opción C (Incorrecta)", "Opción D (Incorrecta)"]
    };

    const base = templates[subjectKey] || templates['default'];
    return [...base].sort(() => Math.random() - 0.5);
}

function randomizeQuestions(questionsArray) {
    return [...questionsArray].sort(() => Math.random() - 0.5);
}

// ===== AUTO-GENERAR PREGUNTAS AL CARGAR =====
console.log("📚 Cargando questions_data.js...");
generateAllQuestions();
console.log("✅ questions_data.js cargado y preguntas generadas");
