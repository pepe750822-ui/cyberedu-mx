import type { Question } from '@/data/simuladorData';

interface PreguntaSubindice {
    question: string;
    options: string[];
    correct: number;
    explanation?: string;
}

export const ARCHIVO_A_AREA: Record<string, string> = {
    'matematicas': 'Matemáticas',
    'habilidad-matematica': 'Habilidad Matemática',
    'espanol': 'Español',
    'habilidad-verbal': 'Habilidad Verbal',
    'biologia': 'Biología',
    'fisica': 'Física',
    'quimica': 'Química',
    'historia': 'Historia',
    'geografia': 'Geografía',
    'formacion-civica-y-etica': 'Formación Cívica y Ética',
};

export const ALL_MATERIAS = Object.values(ARCHIVO_A_AREA);

export const DISTRIBUCION_OFICIAL: Record<string, number> = {
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

export const cargarPreguntasSubindices = async (
    materiasSeleccionadas: string[] = ALL_MATERIAS
): Promise<Question[]> => {
    const archivos = Object.keys(ARCHIVO_A_AREA);
    const todasLasPreguntas: Question[] = [];

    for (const archivo of archivos) {
        const area = ARCHIVO_A_AREA[archivo];
        if (!materiasSeleccionadas.includes(area)) continue;

        try {
            const data = await import(`./practica/${archivo}.json`);
            const json = data.default;
            const subindices = json.subindices || json;

            for (const [subtema, contenido] of Object.entries(subindices)) {
                const preguntas: PreguntaSubindice[] =
                    (contenido as any).questions ||
                    (Array.isArray(contenido) ? contenido : []);

                preguntas.forEach((p, i) => {
                    todasLasPreguntas.push({
                        id: `sub_${archivo}_${subtema.replace(/\s+/g, '_').toLowerCase()}_${i}`,
                        text: p.question,
                        options: p.options,
                        correctIndex: p.correct,
                        explanation: p.explanation || '',
                        area,
                    });
                });
            }
        } catch (e) {
            console.warn(`No se pudo cargar practica/${archivo}.json:`, e);
        }
    }

    return todasLasPreguntas;
};

const PREMIUM_EXPORTS: Record<string, string> = {
    '6': 'bank6Questions',
    '7': 'bank7Questions',
    '8': 'bank8Questions',
    '9': 'bank9Questions',
    '10': 'bank10Questions',
    '11': 'bank11Questions',
    '12': 'bank12Questions',
    '13': 'bank13Questions',
};

// Static import map so Vite can properly analyze and bundle each chunk
const BANCO_IMPORTS: Record<string, () => Promise<Record<string, Question[]>>> = {
    '6':  () => import('./simuladorData6')  as Promise<any>,
    '7':  () => import('./simuladorData7')  as Promise<any>,
    '8':  () => import('./simuladorData8')  as Promise<any>,
    '9':  () => import('./simuladorData9')  as Promise<any>,
    '10': () => import('./simuladorData10') as Promise<any>,
    '11': () => import('./simuladorData11') as Promise<any>,
    '12': () => import('./simuladorData12') as Promise<any>,
    '13': () => import('./simuladorData13') as Promise<any>,
};

export const generarSimuladorPersonalizado = async (config: {
    cantidad: number;
    materias: string[];
    fuente: 'bancos' | 'subindices' | 'ambas';
    bancosDesbloqueados: string[];
    paqueteCompleto?: boolean;
}): Promise<Question[]> => {
    const pool: Question[] = [];

    if (config.fuente !== 'subindices') {
        // Banks 1-4 (free, from public JSON)
        const bankUrls: Record<string, string> = {
            '1': '/data/questions.json',
            '2': '/data/questions2.json',
            '3': '/data/questions3.json',
            '4': '/data/questions4.json',
        };
        for (const url of Object.values(bankUrls)) {
            try {
                const res = await fetch(url);
                const questions: Question[] = await res.json();
                pool.push(...questions.filter(q => config.materias.includes(q.area || '')));
            } catch {}
        }

        // Premium banks (6-12)
        const bancosAPremium = config.paqueteCompleto
            ? Object.keys(PREMIUM_EXPORTS)
            : config.bancosDesbloqueados.filter(b => PREMIUM_EXPORTS[b]);

        for (const banco of bancosAPremium) {
            try {
                const importFn = BANCO_IMPORTS[banco];
                if (!importFn) continue;
                const data = await importFn();
                const exportName = PREMIUM_EXPORTS[banco];
                const questions: Question[] = data[exportName] || [];
                pool.push(...questions.filter(q => config.materias.includes(q.area || '')));
            } catch {}
        }
    }

    if (config.fuente !== 'bancos') {
        const subindices = await cargarPreguntasSubindices(config.materias);
        pool.push(...subindices);
    }

    // Fisher-Yates shuffle + slice
    const shuffled = [...pool];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled.slice(0, config.cantidad);
};
