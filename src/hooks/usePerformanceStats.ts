
import { useMemo } from 'react';
import { useVideoProgress } from './useVideoProgress';
import { areas } from '@/data/areas';
import { getNotebookKey } from '@/data/notebookMap';
import { addDays, format, startOfWeek, eachDayOfInterval } from 'date-fns';

export const usePerformanceStats = () => {
    const { isViewed, getEstadisticas } = useVideoProgress();
    const stats = getEstadisticas();

    // 1. Weekly intervals
    const weeklyData = useMemo(() => {
        const start = startOfWeek(new Date());
        const days = eachDayOfInterval({
            start,
            end: addDays(start, 6)
        });

        // Mocking historical data based on current progress
        // In a real app, this would come from a 'study_logs' table
        return days.map(day => {
            const isToday = format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
            return {
                day: format(day, 'EEE'),
                hours: isToday ? Math.random() * 2 + 0.5 : Math.random() * 2,
                avg: 1.2 // Peer average
            };
        });
    }, []);

    // 2. Peer comparison data
    const comparisonData = useMemo(() => [
        { category: 'Teoría', user: 78, avg: 65 },
        { category: 'Práctica', user: 45, avg: 52 },
        { category: 'Velocidad', user: 90, avg: 70 },
        { category: 'Retención', user: 62, avg: 58 },
    ], []);

    // 3. Predicted Completion Date
    const predictedCompletion = useMemo(() => {
        const totalVideos = 91;
        const viewed = stats.vistos;
        const remaining = totalVideos - viewed;

        if (viewed === 0) return 'Pendiente de inicio';

        // Calculate average videos per day (mocking based on current streak if available)
        const streak = parseInt(localStorage.getItem('study_streak_count') || '1');
        const videosPerDay = Math.max(viewed / Math.max(streak, 1), 1);
        const daysToFinish = Math.ceil(remaining / videosPerDay);

        return format(addDays(new Date(), daysToFinish), 'dd MMM yyyy');
    }, [stats.vistos]);

    // 4. Personalized Recommendations
    const recommendations = useMemo(() => {
        const lowProgressAreas = areas
            .map(area => {
                const viewed = area.videos.filter(v => isViewed(getNotebookKey(v.id) || '')).length;
                return { ...area, percent: (viewed / area.videos.length) * 100 };
            })
            .filter(a => a.percent < 100)
            .sort((a, b) => a.percent - b.percent)
            .slice(0, 3);

        return lowProgressAreas.map(area => ({
            title: `Reforzar ${area.name}`,
            desc: `Estás al ${Math.round(area.percent)}%. Te recomendamos ver "${area.videos[0].title}".`,
            areaId: area.id
        }));
    }, [isViewed]);

    return {
        weeklyData,
        comparisonData,
        predictedCompletion,
        recommendations
    };
};
