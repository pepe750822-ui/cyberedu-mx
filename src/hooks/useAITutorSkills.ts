
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

    // Skill 3: Generador de explicaciones enriquecidas
    const generateExplanation = (questionOrConcept: string | Question, level: "básico" | "intermedio" | "avanzado" = "intermedio") => {
        if (typeof questionOrConcept === 'string') {
            const q = questionOrConcept.toLowerCase();
            // Try to find if it corresponds to an area
            const matchingArea = areas.find(a => q.includes(a.name.toLowerCase()));

            return {
                concept: matchingArea ? matchingArea.name : questionOrConcept,
                summary: matchingArea
                    ? `Este es un pilar fundamental del ECOEMS. Comprender ${matchingArea.name} te garantiza éxito en gran parte del examen.`
                    : `Analizando el concepto de ${questionOrConcept} bajo la óptica del temario oficial.`,
                steps: [
                    "Identifica los elementos clave y su jerarquía.",
                    "Relaciona con casos prácticos del simulador.",
                    "Aplica la regla de oro: descarta lo obvio antes de calcular."
                ],
                keyPoints: [
                    "Contexto histórico y teórico.",
                    "Fórmulas o estructuras principales.",
                    "Errores comunes detectados en el simulador."
                ],
                example: `En un reactivo típico de nivel ${level}, se te pediría aplicar esto para resolver un problema de...`,
                trick: "Busca siempre la palabra clave que define la acción en el enunciado.",
                relatedItems: matchingArea ? matchingArea.videos.slice(0, 2).map(v => v.title) : ["Conceptos base", "Aplicaciones avanzadas"]
            };
        } else {
            // Specific Question explanation
            return {
                concept: `Resolución: ${questionOrConcept.area}`,
                summary: `Este reactivo evalúa tu capacidad de ${questionOrConcept.area === 'Matemática' ? 'razonamiento lógico-numérico' : 'análisis y comprensión'} bajo presión.`,
                steps: [
                    "Análisis de Premisa: ¿Qué nos están pidiendo realmente?",
                    "Evaluación de Opciones: Contraste directo entre los datos y las respuestas.",
                    `Ejecución: La lógica dicta que la respuesta es la opción ${questionOrConcept.correctIndex + 1} (${questionOrConcept.options[questionOrConcept.correctIndex]}).`,
                    `Justificación Técnica: ${questionOrConcept.explanation}`
                ],
                keyPoints: [
                    "No confundir términos similares.",
                    "Prestar atención a los conectores lógicos.",
                    "Optimización de tiempo: Este reactivo debe tomarte < 45 segundos."
                ],
                example: "Si cambiamos el sujeto o las cifras, el método de descarte sigue siendo el mismo.",
                trick: "La mayoría de las veces, la respuesta correcta es la que mejor sintetiza la idea principal sin adornos innecesarios.",
                relatedItems: [`Más preguntas de ${questionOrConcept.area}`, `Video: Introducción a ${questionOrConcept.area}`]
            };
        }
    };

    return {
        searchKnowledgeBase,
        analyzeUserProgress,
        generateExplanation
    };
};
