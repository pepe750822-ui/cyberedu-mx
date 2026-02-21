
import React, { useEffect, useMemo } from 'react';
import { useAchievements } from '@/hooks/useAchievements';
import { useVideoProgress } from '@/hooks/useVideoProgress';
import { areas } from '@/data/areas';
import { getAreaNotebookKeys } from '@/data/notebookMap';

export const AchievementObserver = () => {
    const { achievements, updateProgress } = useAchievements();
    const { isViewed, getEstadisticas } = useVideoProgress();
    const stats = getEstadisticas();

    // 1. Monitor Master Class (Completed Areas)
    const completedAreas = useMemo(() => {
        return areas.filter((area) => {
            const keys = getAreaNotebookKeys(area.id);
            const viewed = keys.filter((k) => isViewed(k)).length;
            return viewed === keys.length && keys.length > 0;
        }).length;
    }, [isViewed]);

    useEffect(() => {
        updateProgress('master-class', completedAreas);
    }, [completedAreas, updateProgress]);

    // 2. Monitor Enciclopedista (Total Videos)
    useEffect(() => {
        updateProgress('enciclopedista', stats.vistos);
    }, [stats.vistos, updateProgress]);

    // 3. Monitor Persistente (Streak)
    useEffect(() => {
        const streak = parseInt(localStorage.getItem('study_streak_count') || '0');
        updateProgress('persistente', streak);
    }, [updateProgress]); // Streak might change without state trigering, so we might need a better way

    // 4. Listen for simulator/quiz events via storage events
    useEffect(() => {
        const handleStorage = (e: StorageEvent) => {
            if (e.key === 'last_sim_time_left') {
                // Velocista: Ended with > 2 hours (7200 seconds)
                const timeLeft = parseInt(e.newValue || '0');
                if (timeLeft > 7200) {
                    updateProgress('velocista', 1);
                }
            }
            if (e.key?.startsWith('quiz_score_')) {
                const score = parseInt(e.newValue || '0');
                if (score === 100) {
                    updateProgress('perfect-score', 1);
                }
            }
        };

        window.addEventListener('storage', handleStorage);
        return () => window.removeEventListener('storage', handleStorage);
    }, [updateProgress]);

    return null; // Invisible observer
};
