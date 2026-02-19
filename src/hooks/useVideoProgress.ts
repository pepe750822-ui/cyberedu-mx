import { useState, useEffect, useCallback } from "react";
import { notebookLinks } from "@/data/notebooks";
import { materiales } from "@/data/materialComplementario";
import { areas } from "@/data/areas";

const STORAGE_PREFIX = "video-";
const PROGRESS_PREFIX = "progreso-";
const LAST_VIDEO_KEY = "ultimo-video-visto";
const TOTAL_VIDEOS = notebookLinks.length; // 90

export interface VideoStats {
  total: number;
  vistos: number;
  quizzesAprobados: number;
  completos: number;
  tiempoInvertido: string;
}

export interface ProgressiveVideoData {
  videoId: string;
  seconds: number;
  duration: number;
  completed: boolean;
  lastUpdate: number;
}

function getAllProgress(): Record<string, boolean> {
  const progress: Record<string, boolean> = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(STORAGE_PREFIX)) {
      progress[key] = localStorage.getItem(key) === "true";
    }
  }
  return progress;
}

export function useVideoProgress() {
  const [progress, setProgress] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setProgress(getAllProgress());
  }, []);

  const markAsViewed = useCallback((videoKey: string) => {
    localStorage.setItem(videoKey, "true");
    setProgress((prev) => ({ ...prev, [videoKey]: true }));
  }, []);

  const isViewed = useCallback(
    (videoKey: string) => {
      // Check both keys (with and without prefix) for compatibility
      const rawKey = videoKey.startsWith(STORAGE_PREFIX) ? videoKey : `${STORAGE_PREFIX}${videoKey}`;
      return !!progress[rawKey] || !!progress[videoKey];
    },
    [progress]
  );

  const guardarProgresoVideo = useCallback((data: Omit<ProgressiveVideoData, 'lastUpdate'>) => {
    const fullData: ProgressiveVideoData = {
      ...data,
      lastUpdate: Date.now()
    };

    // Save specific progress
    localStorage.setItem(`${PROGRESS_PREFIX}${data.videoId}`, JSON.stringify(fullData));

    // Set as last video seen
    localStorage.setItem(LAST_VIDEO_KEY, data.videoId);

    // If completed (90%), mark as viewed in the old system too
    if (data.completed) {
      markAsViewed(`video-${data.videoId}`);
    }
  }, [markAsViewed]);

  const obtenerProgresoVideo = useCallback((videoId: string): ProgressiveVideoData | null => {
    const data = localStorage.getItem(`${PROGRESS_PREFIX}${videoId}`);
    if (!data) return null;
    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  }, []);

  const obtenerUltimoVideo = useCallback((): ProgressiveVideoData | null => {
    const lastId = localStorage.getItem(LAST_VIDEO_KEY);
    if (!lastId) return null;
    return obtenerProgresoVideo(lastId);
  }, [obtenerProgresoVideo]);

  const isVideoCompleto = useCallback((videoId: string): boolean => {
    const visto = isViewed(videoId);
    const tieneQuiz = !!materiales[videoId]?.quiz;
    const quizAprobado = localStorage.getItem(`quiz_aprobado_${videoId}`) === 'true';

    if (!tieneQuiz) return visto;
    return visto && quizAprobado;
  }, [isViewed]);

  const getEstadisticas = useCallback((): VideoStats => {
    let vistos = 0;
    let quizzesAprobados = 0;
    let completos = 0;
    let totalSecs = 0;

    // We iterate over areas data to be precise
    areas.forEach(area => {
      area.videos.forEach(v => {
        const visto = isViewed(v.id);
        const quizAprobado = localStorage.getItem(`quiz_aprobado_${v.id}`) === 'true';
        const tieneQuiz = !!materiales[v.id]?.quiz;

        if (visto) vistos++;
        if (quizAprobado) quizzesAprobados++;
        if (tieneQuiz) {
          if (visto && quizAprobado) completos++;
        } else {
          if (visto) completos++;
        }

        if (visto) {
          const [m, s] = v.duration.split(":").map(Number);
          totalSecs += (m || 0) * 60 + (s || 0);
        }
      });
    });

    const h = Math.floor(totalSecs / 3600);
    const m = Math.floor((totalSecs % 3600) / 60);
    const tiempo = h > 0 ? `${h}h ${m}m` : `${m}m`;

    return {
      total: TOTAL_VIDEOS,
      vistos,
      quizzesAprobados,
      completos,
      tiempoInvertido: tiempo
    };
  }, [isViewed]);

  const resetProgress = useCallback(() => {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(STORAGE_PREFIX) || key?.startsWith(PROGRESS_PREFIX) || key === LAST_VIDEO_KEY) {
        keysToRemove.push(key!);
      }
    }
    keysToRemove.forEach((key) => localStorage.removeItem(key));
    setProgress({});
  }, []);

  return {
    progress,
    markAsViewed,
    isViewed,
    isVideoCompleto,
    guardarProgresoVideo,
    obtenerProgresoVideo,
    obtenerUltimoVideo,
    getEstadisticas,
    viewedCount: Object.values(progress).filter(Boolean).length,
    totalVideos: TOTAL_VIDEOS,
    resetProgress
  };
}
