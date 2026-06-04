import { cargarPreguntasSubindices } from './adaptadorPreguntas';
import type { Question } from '@/data/simuladorData';

const DISTRIBUCION_OFICIAL: Record<string, number> = {
    'Habilidad Matemática': 16,
    'Matemáticas': 16,
    'Habilidad Verbal': 16,
    'Español': 16,
    'Biología': 12,
    'Física': 12,
    'Química': 12,
    'Historia': 24,
    'Geografía': 12,
    'Formación Cívica y Ética': 12,
};

const shuffle = <T>(arr: T[]): T[] => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
};

export const generarSimuladorInfinito = async (
    bancosPreguntas: Question[] = []
): Promise<Question[]> => {
    const todasLasPreguntas: Question[] = [...bancosPreguntas];

    // Fuente 2 — JSON de subíndices de práctica
    const subindices = await cargarPreguntasSubindices();
    todasLasPreguntas.push(...subindices);

    // Agrupar por área
    const porArea: Record<string, Question[]> = {};
    todasLasPreguntas.forEach(p => {
        const area = p.area || 'Sin área';
        if (!porArea[area]) porArea[area] = [];
        porArea[area].push(p);
    });

    // Aplicar distribución oficial ECOEMS (128 preguntas)
    const simulador: Question[] = [];
    for (const [area, cantidad] of Object.entries(DISTRIBUCION_OFICIAL)) {
        const disponibles = shuffle(porArea[area] || []);
        simulador.push(...disponibles.slice(0, cantidad));
    }

    // Completar si faltan preguntas (pool insuficiente)
    const faltantes = 128 - simulador.length;
    if (faltantes > 0) {
        const usadas = new Set(simulador.map(p => p.id));
        const extras = shuffle(
            todasLasPreguntas.filter(p => !usadas.has(p.id))
        );
        simulador.push(...extras.slice(0, faltantes));
    }

    return shuffle(simulador);
};
