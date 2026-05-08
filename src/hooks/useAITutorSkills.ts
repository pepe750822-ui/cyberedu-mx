import { useState, useEffect, useMemo, useCallback } from 'react';
import { areas } from '../data/areas';
import { Question } from '../data/simuladorData';
import { QuestionService } from '../services/QuestionService';
import { useVideoProgress } from './useVideoProgress';

export interface ProgressAnalysis {
  totalProgress: number;
  viewedVideos: number;
  totalVideos: number;
  streak: number;
  areaProgress: { name: string; id: string; percent: number; viewed: number; total: number }[];
  weakAreas: { name: string; id: string; percent: number }[];
  strongAreas: { name: string; id: string; percent: number }[];
  recommendations: string[];
  estimatedReadiness: number;
}

export interface PersonalizedQuiz {
  title: string;
  focusArea: string;
  questions: Question[];
  difficulty: string;
}

export interface ContentRecommendation {
  type: 'video' | 'area' | 'simulador';
  title: string;
  reason: string;
  areaId?: string;
  videoId?: string;
  priority: 'alta' | 'media' | 'baja';
}

export const useAITutorSkills = () => {
  const { isViewed, getEstadisticas } = useVideoProgress();
  const [questions, setQuestions] = useState<Question[]>([]);

  useEffect(() => {
    QuestionService.getBank1().then(setQuestions);
  }, []);

  // Skill 1: Deep progress analysis
  const analyzeUserProgress = useCallback((): ProgressAnalysis => {
    const stats = getEstadisticas();
    const areaProgress = areas.map(area => {
      const viewed = area.videos.filter(v => isViewed(v.id)).length;
      const percent = area.videos.length > 0 ? Math.round((viewed / area.videos.length) * 100) : 0;
      return { name: area.name, id: area.id, percent, viewed, total: area.videos.length };
    });

    const weakAreas = areaProgress
      .filter(a => a.percent < 50)
      .sort((a, b) => a.percent - b.percent);

    const strongAreas = areaProgress
      .filter(a => a.percent >= 80)
      .sort((a, b) => b.percent - a.percent);

    const totalProgress = Math.round((stats.completos / stats.total) * 100) || 0;
    const streak = parseInt(localStorage.getItem('study_streak_count') || '0');

    // Generate smart recommendations
    const recommendations: string[] = [];
    if (weakAreas.length > 0) {
      recommendations.push(`Enfócate en ${weakAreas[0].name} (${weakAreas[0].percent}% completado) — es tu área más débil.`);
    }
    if (streak === 0) {
      recommendations.push('¡Inicia una racha de estudio! La constancia es clave para el ECOEMS.');
    } else if (streak >= 7) {
      recommendations.push(`¡Increíble racha de ${streak} días! Mantén el ritmo.`);
    }
    if (totalProgress < 30) {
      recommendations.push('Estás en fase inicial. Dedica al menos 30 min diarios para avanzar.');
    } else if (totalProgress >= 80) {
      recommendations.push('¡Casi listo! Enfócate en simulacros para reforzar áreas débiles.');
    }
    if (strongAreas.length > 0) {
      recommendations.push(`Tu punto fuerte es ${strongAreas[0].name}. ¡Aprovéchalo en el examen!`);
    }

    // Estimated readiness based on progress + streak bonus
    const streakBonus = Math.min(streak * 2, 15);
    const estimatedReadiness = Math.min(Math.round(totalProgress * 0.8 + streakBonus + strongAreas.length * 3), 100);

    return {
      totalProgress,
      viewedVideos: stats.vistos,
      totalVideos: stats.total,
      streak,
      areaProgress,
      weakAreas: weakAreas.slice(0, 3),
      strongAreas: strongAreas.slice(0, 3),
      recommendations,
      estimatedReadiness,
    };
  }, [isViewed, getEstadisticas]);

  // Skill 2: Generate personalized quiz from weak areas
  const generatePersonalizedQuiz = useCallback((areaName?: string, count: number = 5): PersonalizedQuiz | null => {
    const analysis = analyzeUserProgress();
    const targetArea = areaName || (analysis.weakAreas.length > 0 ? analysis.weakAreas[0].name : null);

    if (!targetArea) return null;

    // Find matching questions
    let pool = questions.filter(q =>
      q.area.toLowerCase().includes(targetArea.toLowerCase()) ||
      targetArea.toLowerCase().includes(q.area.toLowerCase())
    );

    // Fallback to all questions if no match
    if (pool.length === 0) pool = questions;

    // Shuffle and pick
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    const questions = shuffled.slice(0, Math.min(count, shuffled.length));

    const areaData = analysis.areaProgress.find(a =>
      a.name.toLowerCase().includes(targetArea.toLowerCase())
    );
    const difficulty = areaData && areaData.percent < 30 ? 'básico' : areaData && areaData.percent < 60 ? 'intermedio' : 'avanzado';

    return {
      title: `Quiz personalizado: ${targetArea}`,
      focusArea: targetArea,
      questions,
      difficulty,
    };
  }, [analyzeUserProgress]);

  // Skill 3: Content recommendations
  const getRecommendations = useCallback((): ContentRecommendation[] => {
    const analysis = analyzeUserProgress();
    const recs: ContentRecommendation[] = [];

    // Recommend unwatched videos from weak areas
    for (const weak of analysis.weakAreas) {
      const area = areas.find(a => a.id === weak.id);
      if (area) {
        const unwatched = area.videos.filter(v => !isViewed(v.id));
        if (unwatched.length > 0) {
          recs.push({
            type: 'video',
            title: unwatched[0].title,
            reason: `Tu área más débil: ${weak.name} (${weak.percent}%)`,
            areaId: area.id,
            videoId: unwatched[0].id,
            priority: 'alta',
          });
        }
      }
    }

    // Recommend simulador if progress > 50%
    if (analysis.totalProgress >= 50) {
      recs.push({
        type: 'simulador',
        title: 'Simulador ECOEMS Pro',
        reason: 'Ya llevas más del 50% — practica con reactivos reales.',
        priority: 'media',
      });
    }

    // Recommend areas not started
    const notStarted = analysis.areaProgress.filter(a => a.percent === 0);
    for (const ns of notStarted.slice(0, 2)) {
      recs.push({
        type: 'area',
        title: ns.name,
        reason: 'Aún no has comenzado esta área.',
        areaId: ns.id,
        priority: 'media',
      });
    }

    return recs.slice(0, 5);
  }, [analyzeUserProgress, isViewed]);

  // Skill 4: Search knowledge base
  const searchKnowledgeBase = useCallback((query: string) => {
    const q = query.toLowerCase();
    const results: any[] = [];

    areas.forEach(area => {
      area.videos.forEach(video => {
        if (video.title.toLowerCase().includes(q) || area.name.toLowerCase().includes(q)) {
          results.push({ type: 'video', title: video.title, area: area.name, id: video.id });
        }
      });
    });

    const matchedQuestions = questions.filter(qst =>
      qst.text.toLowerCase().includes(q) ||
      qst.area.toLowerCase().includes(q)
    );
    results.push(...matchedQuestions.map(mq => ({ type: 'simulador', ...mq })));

    return results.slice(0, 5);
  }, []);

  // Skill 5: Generate explanation context for AI
  const getExplanationContext = useCallback((topic: string): string => {
    const q = topic.toLowerCase();
    const matchingArea = areas.find(a => q.includes(a.name.toLowerCase()) || a.name.toLowerCase().includes(q));
    const matchingQuestions = questions.filter(qst => qst.area.toLowerCase().includes(q) || q.includes(qst.area.toLowerCase())).slice(0, 3);

    let context = '';
    if (matchingArea) {
      context += `Área: ${matchingArea.name}\nVideos disponibles: ${matchingArea.videos.map(v => v.title).join(', ')}\n`;
    }
    if (matchingQuestions.length > 0) {
      context += `Reactivos de ejemplo:\n`;
      matchingQuestions.forEach(q => {
        context += `- ${q.text} → Respuesta: ${q.options[q.correctIndex]} (${q.explanation})\n`;
      });
    }
    return context;
  }, []);

  return {
    analyzeUserProgress,
    generatePersonalizedQuiz,
    getRecommendations,
    searchKnowledgeBase,
    getExplanationContext,
  };
};
