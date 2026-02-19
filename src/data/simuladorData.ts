export interface Question {
    id: string;
    area: string;
    text: string;
    options: string[];
    correctIndex: number;
    explanation: string;
}

export const simuladoECOEMS: Question[] = [
    {
        id: "q1",
        area: "Pensamiento Matemático",
        text: "¿Cuál es el valor de 'x' en la ecuación 3x - 5 = 16?",
        options: ["x = 5", "x = 7", "x = 9", "x = 6"],
        correctIndex: 1,
        explanation: "Sumamos 5 a ambos lados: 3x = 21. Luego dividimos entre 3: x = 7. Es un tema fundamental de álgebra de primer grado."
    },
    {
        id: "q2",
        area: "Pensamiento Matemático",
        text: "¿Qué número sigue en la serie: 2, 6, 12, 20, ...?",
        options: ["28", "30", "32", "34"],
        correctIndex: 1,
        explanation: "La diferencia entre los términos es: +4, +6, +8. Por lo tanto, el siguiente incremento debe ser +10. 20 + 10 = 30."
    },
    {
        id: "q3",
        area: "Estructura de la Lengua",
        text: "Identifica el antónimo de la palabra 'Efímero':",
        options: ["Pasajero", "Breve", "Perpetuo", "Fugaz"],
        correctIndex: 2,
        explanation: "Efímero significa que dura poco tiempo. Su antónimo es Perpetuo, que dura para siempre."
    },
    {
        id: "q4",
        area: "Comprensión Lectora",
        text: "En un texto argumentativo, ¿cuál es la función de los nexos 'por el contrario' y 'sin embargo'?",
        options: ["Causalidad", "Oposición", "Consecuencia", "Adición"],
        correctIndex: 1,
        explanation: "Son conectores adversativos o de oposición, sirven para contrastar dos ideas."
    },
    {
        id: "q5",
        area: "Física",
        text: "Según la Segunda Ley de Newton, si la masa de un objeto permanece constante y la fuerza aplicada aumenta al doble, ¿qué sucede con la aceleración?",
        options: ["Se reduce a la mitad", "Permanece igual", "Aumenta al doble", "Aumenta al cuádruple"],
        correctIndex: 2,
        explanation: "F = m*a. Si F aumenta al doble y m es constante, la aceleración 'a' también debe aumentar al doble (proporcionalidad directa)."
    }
];
