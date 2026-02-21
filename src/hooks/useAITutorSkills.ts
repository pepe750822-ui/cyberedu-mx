
import { useMemo } from 'react';
import { areas } from '../data/areas';
import { simuladoECOEMS, Question } from '../data/simuladorData';
import { useVideoProgress } from './useVideoProgress';

export const useAITutorSkills = () => {
    const { isViewed, getEstadisticas } = useVideoProgress();

    // Skill 1: Buscador de conocimiento
    const searchKnowledgeBase = (query: string, areaId?: string, type?: "video" | "quiz" | "simulador") => {
        const q = query.toLowerCase();
        let results: any[] = [];

        // Search in Areas/Videos
        if (!type || type === "video") {
            areas.forEach(area => {
                if (!areaId || area.id === areaId) {
                    area.videos.forEach(video => {
                        if (video.title.toLowerCase().includes(q) || area.name.toLowerCase().includes(q)) {
                            results.push({ type: 'video', title: video.title, area: area.name, id: video.id });
                        }
                    });
                }
            });
        }

        // Search in Simulator Questions
        if (!type || type === "simulador") {
            const matchedQuestions = simuladoECOEMS.filter(qst =>
                qst.text.toLowerCase().includes(q) ||
                qst.area.toLowerCase().includes(q) ||
                qst.explanation.toLowerCase().includes(q)
            );
            results = [...results, ...matchedQuestions.map(mq => ({ type: 'simulador', ...mq }))];
        }

        return results.slice(0, 5); // Limit to top 5
    };

    // Skill 2: Analizador de progreso
    const analyzeUserProgress = () => {
        const stats = getEstadisticas();
        const areaProgress = areas.map(area => {
            const viewed = area.videos.filter(v => isViewed(v.id)).length;
            const percent = (viewed / area.videos.length) * 100;
            return { name: area.name, percent, id: area.id };
        });

        const weakAreas = areaProgress
            .filter(a => a.percent < 80)
            .sort((a, b) => a.percent - b.percent);

        return {
            totalProgress: Math.round((stats.completos / stats.total) * 100) || 0,
            viewedVideos: stats.vistos,
            weakAreas: weakAreas.slice(0, 3),
            streak: parseInt(localStorage.getItem('study_streak_count') || '0')
        };
    };

    // Skill 3: Generador de explicaciones
    const generateExplanation = (questionOrConcept: string | Question, level: "básico" | "intermedio" | "avanzado" = "intermedio") => {
        if (typeof questionOrConcept === 'string') {
            // Generic concept explanation logic
            return {
                concept: questionOrConcept,
                steps: [
                    "Identifica los elementos clave mencionados.",
                    "Relaciona con el temario oficial de ECOEMS.",
                    "Aplica la regla o principio correspondiente."
                ],
                example: `Si te preguntan sobre ${questionOrConcept}, recuerda que se aplica en casos donde...`,
                trick: "Usa mnemotecnias para los términos clave."
            };
        } else {
            // Specific Question explanation
            return {
                concept: questionOrConcept.text,
                steps: [
                    "Lee cuidadosamente la premisa.",
                    "Analiza las opciones y descarta las obviamente incorrectas.",
                    `En este caso, la respuesta es la opción ${questionOrConcept.correctIndex + 1} (${questionOrConcept.options[questionOrConcept.correctIndex]}).`,
                    questionOrConcept.explanation
                ],
                example: "Un reactivo similar podría cambiar los valores pero mantiene la misma lógica de resolución.",
                trick: "Para este tipo de preguntas, fíjate siempre en las palabras clave del enunciado."
            };
        }
    };

    return {
        searchKnowledgeBase,
        analyzeUserProgress,
        generateExplanation
    };
};
