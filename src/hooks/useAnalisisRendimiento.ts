
import { useState, useEffect, useCallback, useMemo } from 'react';
import { areas, Area, Video } from '@/data/areas';
import { startOfWeek, endOfWeek, isWithinInterval, subDays, format } from 'date-fns';

export interface RendimientoStats {
  areaId: string;
  areaName: string;
  totalQuestions: number;
  correctAnswers: number;
  attempts: number;
  averageScore: number;
  lastScore: number;
}

export interface QuizResult {
  id: string;
  quizId: string;
  videoId?: string;
  areaId: string;
  areaName: string;
  score: number;
  total: number;
  timestamp: number;
  incorrectQuestions: string[];
}

export interface RecomendacionRendimiento {
  type: 'video' | 'quiz' | 'simulador';
  id: string;
  title: string;
  reason: string;
}

const STORAGE_KEY = 'cyberedu_rendimiento_v1';

export const useAnalisisRendimiento = () => {
  const [history, setHistory] = useState<QuizResult[]>([]);

  // Load history on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Error loading performance history:", e);
      }
    }
  }, []);

  // Save history helper
  const saveHistory = (newHistory: QuizResult[]) => {
    setHistory(newHistory);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
  };

  const getAreaByVideoId = useCallback((videoId: string): Area | null => {
    for (const area of areas) {
      if (area.videos.some(v => v.id === videoId)) return area;
    }
    return null;
  }, []);

  const trackQuizResult = useCallback((result: Omit<QuizResult, 'id' | 'timestamp' | 'areaId' | 'areaName'>) => {
    let areaId = 'general';
    let areaName = 'General';

    if (result.videoId) {
      const area = getAreaByVideoId(result.videoId);
      if (area) {
        areaId = area.id;
        areaName = area.name;
      }
    }

    const fullResult: QuizResult = {
      ...result,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      areaId,
      areaName
    };

    const newHistory = [...history, fullResult];
    saveHistory(newHistory);
    return fullResult;
  }, [history, getAreaByVideoId]);

  const statsByArea = useMemo(() => {
    const stats: Record<string, RendimientoStats> = {};

    history.forEach(res => {
      if (!stats[res.areaId]) {
        stats[res.areaId] = {
          areaId: res.areaId,
          areaName: res.areaName,
          totalQuestions: 0,
          correctAnswers: 0,
          attempts: 0,
          averageScore: 0,
          lastScore: 0
        };
      }

      const s = stats[res.areaId];
      s.totalQuestions += res.total;
      s.correctAnswers += res.score;
      s.attempts += 1;
      s.lastScore = (res.score / res.total) * 100;
      s.averageScore = (s.correctAnswers / s.totalQuestions) * 100;
    });

    return Object.values(stats);
  }, [history]);

  const weakAreas = useMemo(() => {
    return statsByArea
      .filter(s => s.averageScore < 70 && s.attempts > 0)
      .sort((a, b) => a.averageScore - b.averageScore);
  }, [statsByArea]);

  const getRecomendacionesDiarias = useCallback(() => {
    const recs: RecomendacionRendimiento[] = [];

    // 1. Critical areas (Risk)
    weakAreas.slice(0, 2).forEach(area => {
      const areaData = areas.find(a => a.id === area.areaId);
      if (areaData) {
        recs.push({
          type: 'video',
          id: areaData.videos[0].id,
          title: areaData.videos[0].title,
          reason: `Tu promedio en ${area.areaName} es bajo (${Math.round(area.averageScore)}%). Refuerza con este video.`
        });
      }
    });

    // 2. Areas not attempted
    const attemptedIds = new Set(statsByArea.map(s => s.areaId));
    const notAttempted = areas.filter(a => !attemptedIds.has(a.id) && a.id !== 'repaso-final');
    
    notAttempted.slice(0, 1).forEach(area => {
      recs.push({
        type: 'quiz',
        id: area.id,
        title: `Quiz de ${area.name}`,
        reason: `Aún no has medido tu nivel en ${area.name}. ¡Pruébate!`
      });
    });

    return recs;
  }, [weakAreas, statsByArea]);

  const getWeeklyReport = useCallback(() => {
    const start = startOfWeek(new Date(), { weekStartsOn: 1 });
    const end = endOfWeek(new Date(), { weekStartsOn: 1 });

    const currentWeekResults = history.filter(h => isWithinInterval(h.timestamp, { start, end }));
    
    const approvedQuizzes = currentWeekResults.filter(r => (r.score / r.total) >= 0.7).length;
    const totalQuestions = currentWeekResults.reduce((acc, r) => acc + r.total, 0);
    const correctQuestions = currentWeekResults.reduce((acc, r) => acc + r.score, 0);
    
    // Areas reinforced this week
    const areasCount: Record<string, number> = {};
    currentWeekResults.forEach(r => {
      areasCount[r.areaName] = (areasCount[r.areaName] || 0) + 1;
    });

    const topArea = Object.entries(areasCount).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Ninguna';

    return {
      quizzesAprobados: approvedQuizzes,
      totalQuizzes: currentWeekResults.length,
      precision: totalQuestions > 0 ? (correctQuestions / totalQuestions) * 100 : 0,
      areaMasEstudiada: topArea,
      metaSemanal: approvedQuizzes < 5 ? "Aprobar 5 quizzes" : "Mantener racha de aprobación",
      timestamp: Date.now()
    };
  }, [history]);

  const getAlertasRiesgo = useCallback(() => {
    return weakAreas
      .filter(a => a.attempts >= 2 && a.averageScore < 60)
      .map(a => ({
        areaId: a.areaId,
        areaName: a.areaName,
        message: `¡Alerta de riesgo! Has fallado consistentemente en ${a.areaName}. Te recomendamos un repaso intensivo.`,
        score: a.averageScore
      }));
  }, [weakAreas]);

  return {
    history,
    statsByArea,
    weakAreas,
    trackQuizResult,
    getRecomendacionesDiarias,
    getWeeklyReport,
    getAlertasRiesgo
  };
};
