export interface StudioSimulator {
    name: string;
    path: string;
    description: string;
}

export const studioMapping: Record<string, StudioSimulator[]> = {
    "habilidades": [
        { name: "Simulador Verbal", path: "/studio/hverbal.html", description: "Práctica de comprensión y analogías" },
        { name: "Simulador Matemático", path: "/studio/habmat.html", description: "Series y razonamiento lógico" }
    ],
    "biologia": [
        { name: "Simulador Biología", path: "/studio/biologia.html", description: "Célula, genética y biodiversidad" }
    ],
    "fisica": [
        { name: "Simulador Física", path: "/studio/fisica.html", description: "Leyes de Newton, energía y ondas" }
    ],
    "quimica": [
        { name: "Simulador Química", path: "/studio/quimica.html", description: "Tabla periódica, enlaces y redox" }
    ],
    "matematicas": [
        { name: "Simulador Matemáticas", path: "/studio/habmat.html", description: "Álgebra, geometría y estadística" }
    ],
    "historia-universal": [
        { name: "Simulador Historia Univ.", path: "/studio/historia.html", description: "Revoluciones y guerras mundiales" }
    ],
    "historia-mexico": [
        { name: "Simulador Historia de México", path: "/studio/hmex.html", description: "Desde la conquista hasta la actualidad" },
        { name: "Reto Histórico (Juego)", path: "/studio/juegohistoriamex.html", description: "Actividad interactiva de memoria" }
    ],
    "espanol": [
        { name: "Simulador Español", path: "/studio/espanol.html", description: "Gramática, ortografía y textos" }
    ],
    "formacion-civica": [
        { name: "Simulador Cívica y Ética", path: "/studio/formacion.html", description: "Derechos, democracia y sociedad" }
    ],
    "geografia": [
        { name: "Simulador Geografía", path: "/studio/geografia.html", description: "Espacio geográfico y economía global" }
    ]
};
