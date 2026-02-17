import { useState, useEffect, useCallback } from "react";
import { notebookLinks } from "@/data/notebooks";
import { materiales } from "@/data/materialComplementario";

const STORAGE_PREFIX = "video-";
const TOTAL_VIDEOS = notebookLinks.length; // 90

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
    (videoKey: string) => !!progress[videoKey],
    [progress]
  );

  const viewedCount = Object.values(progress).filter(Boolean).length;

  const resetProgress = useCallback(() => {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(STORAGE_PREFIX)) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((key) => localStorage.removeItem(key));
    setProgress({});
  }, []);

  const isVideoCompleto = useCallback((videoId: string): boolean => {
    const visto = isViewed(`video-${videoId}`) || isViewed(videoId);
    const tieneQuiz = !!materiales[videoId]?.quiz;
    const quizAprobado = localStorage.getItem(`quiz_aprobado_${videoId}`) === 'true';
    if (!tieneQuiz) return visto;
    return visto && quizAprobado;
  }, [isViewed]);

  return { progress, markAsViewed, isViewed, isVideoCompleto, viewedCount, totalVideos: TOTAL_VIDEOS, resetProgress };
}
