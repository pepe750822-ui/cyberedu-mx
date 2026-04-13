const subjectsData = {
    'fisica': {
        name: "Física",
        icon: "fa-atom",
        color: "#9900ff",
        desc: "Mecánica, energía, electricidad, magnetismo y óptica.",
        quiz: [
            {
                q: "¿Cuál es la unidad de fuerza en el Sistema Internacional?",
                options: ["Newton", "Joule", "Pascal", "Watt"],
                correct: 0,
                rationale: "La unidad de fuerza en el Sistema Internacional es el Newton (N), llamado así en honor a Isaac Newton."
            },
            {
                q: "¿Qué ley de Newton establece que a toda acción corresponde una reacción de igual magnitud pero en sentido contrario?",
                options: ["Primera ley", "Segunda ley", "Tercera ley", "Ley de gravitación"],
                correct: 2,
                rationale: "La tercera ley de Newton, también conocida como principio de acción y reacción, establece que las fuerzas siempre ocurren en pares iguales y opuestos."
            },
            {
                q: "Un objeto en movimiento rectilíneo uniforme tiene:",
                options: ["Aceleración constante", "Velocidad constante", "Posición constante", "Aceleración cero"],
                correct: 1,
                rationale: "En el movimiento rectilíneo uniforme (MRU), la velocidad permanece constante, por lo que la aceleración es cero."
            },
            {
                q: "¿Qué representa la pendiente en una gráfica de posición-tiempo?",
                options: ["Aceleración", "Velocidad", "Tiempo", "Distancia"],
                correct: 1,
                rationale: "En una gráfica de posición-tiempo, la pendiente de la curva representa la velocidad del objeto."
            },
            {
                q: "La aceleración de la gravedad en la superficie terrestre es aproximadamente:",
                options: ["9.8 m/s", "9.8 m/s²", "6.67 m/s²", "3×10⁸ m/s"],
                correct: 1,
                rationale: "La aceleración debida a la gravedad en la superficie terrestre es aproximadamente 9.8 m/s² hacia el centro de la Tierra."
            },
            {
                q: "¿Cuál es la fórmula de la segunda ley de Newton?",
                options: ["F = m/a", "F = m·a", "F = m·v", "F = v/t"],
                correct: 1,
                rationale: "La segunda ley de Newton establece que F = m·a, donde F es la fuerza neta, m es la masa y a es la aceleración."
            },
            {
                q: "Un cuerpo en caída libre experimenta:",
                options: ["Movimiento circular", "Movimiento con aceleración constante", "Movimiento con velocidad constante", "Reposo"],
                correct: 1,
                rationale: "En caída libre, los cuerpos experimentan un movimiento con aceleración constante igual a la aceleración de la gravedad (9.8 m/s²)."
            },
            {
                q: "¿Qué tipo de movimiento describe un péndulo simple?",
                options: ["Movimiento rectilíneo uniforme", "Movimiento armónico simple", "Movimiento circular uniforme", "Movimiento parabólico"],
                correct: 1,
                rationale: "Un péndulo simple describe un movimiento armónico simple para pequeñas amplitudes de oscilación."
            },
            {
                q: "La inercia de un cuerpo está relacionada con su:",
                options: ["Velocidad", "Aceleración", "Masa", "Energía"],
                correct: 2,
                rationale: "La inercia es la resistencia de un cuerpo a cambiar su estado de movimiento y está directamente relacionada con su masa."
            },
            {
                q: "¿Qué fuerza mantiene a los planetas en órbita alrededor del Sol?",
                options: ["Fuerza electromagnética", "Fuerza gravitatoria", "Fuerza nuclear fuerte", "Fuerza de fricción"],
                correct: 1,
                rationale: "La fuerza gravitatoria, descrita por la Ley de Gravitación Universal de Newton, es la que mantiene a los planetas en órbita alrededor del Sol."
            },
            {
                q: "¿Cuál es la unidad de energía en el Sistema Internacional?",
                options: ["Newton", "Joule", "Watt", "Pascal"],
                correct: 1,
                rationale: "La unidad de energía en el Sistema Internacional es el Joule (J), llamado así en honor a James Prescott Joule."
            },
            {
                q: "La energía cinética de un objeto depende de:",
                options: ["Su masa y velocidad", "Su masa y altura", "Su volumen y densidad", "Su temperatura y presión"],
                correct: 0,
                rationale: "La energía cinética se calcula como Ec = ½mv², por lo que depende de la masa (m) y la velocidad (v) del objeto."
            },
            {
                q: "¿Qué principio establece que la energía no se crea ni se destruye, solo se transforma?",
                options: ["Principio de Pascal", "Principio de Arquímedes", "Principio de conservación de la energía", "Principio de incertidumbre"],
                correct: 2,
                rationale: "El principio de conservación de la energía establece que la energía total de un sistema aislado permanece constante."
            },
            {
                q: "Un objeto a mayor altura tiene mayor:",
                options: ["Energía cinética", "Energía potencial gravitatoria", "Temperatura", "Velocidad"],
                correct: 1,
                rationale: "La energía potencial gravitatoria se calcula como Ep = mgh, por lo que aumenta con la altura (h)."
            },
            {
                q: "La potencia se define como:",
                options: ["Fuerza por distancia", "Trabajo por tiempo", "Trabajo dividido por tiempo", "Fuerza dividida por área"],
                correct: 2,
                rationale: "La potencia es la rapidez con que se realiza trabajo, por lo que se calcula como P = W/t (trabajo dividido por tiempo)."
            },
            {
                q: "¿En qué unidad se mide la potencia?",
                options: ["Joule", "Newton", "Watt", "Pascal"],
                correct: 2,
                rationale: "La unidad de potencia en el Sistema Internacional es el Watt (W), llamado así en honor a James Watt."
            },
            {
                q: "Cuando se estira un resorte, almacena energía en forma de:",
                options: ["Energía cinética", "Energía potencial elástica", "Energía térmica", "Energía radiante"],
                correct: 1,
                rationale: "Un resorte estirado o comprimido almacena energía potencial elástica, dada por E = ½kx²."
            },
            {
                q: "La eficiencia de una máquina se define como:",
                options: ["Trabajo de entrada / trabajo de salida", "Trabajo de salida / trabajo de entrada", "Potencia de entrada / potencia de salida", "Energía perdida / energía total"],
                correct: 1,
                rationale: "La eficiencia de una máquina es la relación entre el trabajo útil de salida y el trabajo total de entrada."
            },
            {
                q: "¿Qué tipo de energía posee el agua almacenada en una presa?",
                options: ["Energía cinética", "Energía potencial gravitatoria", "Energía térmica", "Energía química"],
                correct: 1,
                rationale: "El agua almacenada en una presa tiene energía potencial gravitatoria debido a su altura sobre el nivel de salida."
            },
            {
                q: "La ley de conservación de la energía mecánica se aplica cuando:",
                options: ["Solo actúan fuerzas conservativas", "Solo actúan fuerzas no conservativas", "Hay fricción", "La aceleración es cero"],
                correct: 0,
                rationale: "La energía mecánica total se conserva solo cuando actúan fuerzas conservativas, como la gravedad o la fuerza elástica."
            },
            {
                q: "¿Qué representa el área bajo la curva en una gráfica de fuerza versus distancia?",
                options: ["Aceleración", "Velocidad", "Trabajo", "Potencia"],
                correct: 2,
                rationale: "El área bajo la curva en una gráfica de fuerza versus distancia representa el trabajo realizado."
            },
            {
                q: "Un objeto que se mueve con velocidad constante tiene energía cinética:",
                options: ["Creciente", "Decreciente", "Constante", "Cero"],
                correct: 2,
                rationale: "Si la velocidad es constante, la energía cinética (Ec = ½mv²) también es constante."
            },
            {
                q: "La energía potencial gravitatoria de un objeto es cero cuando:",
                options: ["Está en reposo", "Tiene velocidad cero", "Está en el punto de referencia", "Tiene masa cero"],
                correct: 2,
                rationale: "La energía potencial gravitatoria se define en relación con un punto de referencia, siendo cero en ese punto."
            },
            {
                q: "¿Cuál es la fórmula del trabajo realizado por una fuerza constante?",
                options: ["W = F·v", "W = F·a", "W = F·d·cosθ", "W = m·a·d"],
                correct: 2,
                rationale: "El trabajo realizado por una fuerza constante es W = F·d·cosθ, donde θ es el ángulo entre la fuerza y el desplazamiento."
            },
            {
                q: "La energía cinética de un objeto se duplica cuando su velocidad:",
                options: ["Se duplica", "Se reduce a la mitad", "Se cuadruplica", "Aumenta en un factor de √2"],
                correct: 3,
                rationale: "Dado que Ec ∝ v², para duplicar la energía cinética, la velocidad debe aumentar en un factor de √2."
            },
            {
                q: "¿Cuál es la unidad de carga eléctrica en el Sistema Internacional?",
                options: ["Voltio", "Amperio", "Culombio", "Ohmio"],
                correct: 2,
                rationale: "La unidad de carga eléctrica en el Sistema Internacional es el Culombio (C), llamado así en honor a Charles-Augustin de Coulomb."
            },
            {
                q: "La ley de Ohm establece que:",
                options: ["V = I/R", "I = V·R", "V = I·R", "R = I/V"],
                correct: 2,
                rationale: "La ley de Ohm establece que el voltaje (V) es igual a la corriente (I) multiplicada por la resistencia (R): V = I·R."
            },
            {
                q: "¿Qué partícula subatómica tiene carga negativa?",
                options: ["Protón", "Neutrón", "Electrón", "Positrón"],
                correct: 2,
                rationale: "El electrón tiene carga eléctrica negativa, mientras que el protón tiene carga positiva y el neutrón no tiene carga."
            },
            {
                q: "Un transformador funciona basándose en:",
                options: ["La ley de Ohm", "La ley de Coulomb", "La inducción electromagnética", "El efecto fotoeléctrico"],
                correct: 2,
                rationale: "Los transformadores funcionan basándose en el principio de inducción electromagnética descubierto por Faraday."
            },
            {
                q: "La velocidad de la luz en el vacío es aproximadamente:",
                options: ["3×10⁶ m/s", "3×10⁸ m/s", "3×10¹⁰ m/s", "3×10¹² m/s"],
                correct: 1,
                rationale: "La velocidad de la luz en el vacío es aproximadamente 3×10⁸ m/s, una constante fundamental en física."
            }
        ]
    },
    'hab_verb': {
        name: "Habilidad Verbal",
        icon: "fa-comments",
        color: "#00f3ff",
        desc: "Comprensión lectora, vocabulario y razonamiento verbal.",
        quiz: [
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
            }
        ]
    },
    'matematicas': {
        name: "Matemáticas",
        icon: "fa-calculator",
        color: "#00ff9d",
        desc: "Álgebra, geometría, aritmética y cálculo básico.",
        quiz: [
            {
                q: "¿Cuál es el resultado de la operación -5 + (-3) - (-2)?",
                options: ["-10", "-6", "0", "4"],
                correct: 1,
                rationale: "-5 + (-3) es -8. Luego, -8 - (-2) se convierte en -8 + 2, lo cual da como resultado -6."
            }
        ]
    }
};
