import { useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

const GA_ID = 'G-88JWPSS4QL';

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

function gtag(...args: any[]) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag(...args);
  }
}

export function usePageView() {
  const location = useLocation();
  useEffect(() => {
    gtag('config', GA_ID, {
      page_title: document.title,
      page_location: window.location.href,
      page_path: location.pathname,
    });
  }, [location.pathname]);
}

export function trackEvent(action: string, params?: Record<string, any>) {
  gtag('event', action, params);
}

// Video events
export const trackVideoStart = (videoId: string, videoTitle: string, areaName: string) =>
  trackEvent('video_start', { video_id: videoId, video_title: videoTitle, area_name: areaName });

export const trackVideoProgress = (videoId: string, videoTitle: string, areaName: string, percent: number) =>
  trackEvent('video_progress', { video_id: videoId, video_title: videoTitle, area_name: areaName, percent });

export const trackVideoComplete = (videoId: string, videoTitle: string, areaName: string) =>
  trackEvent('video_complete', { video_id: videoId, video_title: videoTitle, area_name: areaName });

// Quiz events
export const trackQuizStart = (quizId: string, videoId: string) =>
  trackEvent('quiz_start', { quiz_id: quizId, video_id: videoId });

export const trackQuizAnswer = (questionId: string, isCorrect: boolean) =>
  trackEvent('quiz_question_answer', { question_id: questionId, is_correct: isCorrect });

export const trackQuizComplete = (quizId: string, score: number, total: number, passed: boolean) =>
  trackEvent('quiz_complete', { quiz_id: quizId, score, total_questions: total, passed });

// Simulador events
export const trackSimuladorStart = () => trackEvent('simulador_start');
export const trackSimuladorPause = () => trackEvent('simulador_pause');
export const trackSimuladorResume = () => trackEvent('simulador_resume');
export const trackSimuladorComplete = (score: number, totalTime: number, prediccion: string) =>
  trackEvent('simulador_complete', { score, total_time: totalTime, prediccion_ingreso: prediccion });

// Auth events
export const trackLogin = (method: string) => trackEvent('login', { method });
export const trackRegister = (method: string) => trackEvent('sign_up', { method });
export const trackLogout = () => trackEvent('logout');
