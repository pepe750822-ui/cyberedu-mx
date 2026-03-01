
import { useState, useEffect, useCallback } from 'react';
import { logger } from '@/lib/logger';
import confetti from 'canvas-confetti';
import { toast } from 'sonner';
import { ACHIEVEMENTS_DATA, Achievement } from '@/types/achievements';

const ACHIEVEMENTS_STORAGE_KEY = 'cyberedu_achievements';

export const useAchievements = () => {
    const [achievements, setAchievements] = useState<Achievement[]>(ACHIEVEMENTS_DATA);

    // Load from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem(ACHIEVEMENTS_STORAGE_KEY);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                // Merge with ACHIEVEMENTS_DATA to handle new achievements
                const merged = ACHIEVEMENTS_DATA.map(original => {
                    const found = parsed.find((p: Achievement) => p.id === original.id);
                    return found ? { ...original, ...found } : original;
                });
                setAchievements(merged);
            } catch (e) {
                logger.error('Error parsing achievements', e);
            }
        }
    }, []);

    // Save to localStorage whenever achievements change
    useEffect(() => {
        localStorage.setItem(ACHIEVEMENTS_STORAGE_KEY, JSON.stringify(achievements));
    }, [achievements]);

    const playUnlockSound = () => {
        try {
            const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3');
            audio.volume = 0.4;
            audio.play();
        } catch (e) {
            logger.warn('Could not play unlock sound', e);
        }
    };

    const triggerConfetti = () => {
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

        const interval: any = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);
    };

    const unlockAchievement = useCallback((id: string) => {
        setAchievements(prev => {
            const index = prev.findIndex(a => a.id === id);
            if (index === -1 || prev[index].isUnlocked) return prev;

            const updated = [...prev];
            updated[index] = {
                ...updated[index],
                isUnlocked: true,
                unlockedAt: new Date().toISOString(),
                currentValue: updated[index].targetValue
            };

            // Visual and Audio feedback
            triggerConfetti();
            playUnlockSound();
            toast.success(`¡Logro Desbloqueado: ${updated[index].title}!`, {
                description: updated[index].description,
                duration: 5000,
            });

            return updated;
        });
    }, []);

    const updateProgress = useCallback((id: string, value: number) => {
        setAchievements(prev => {
            const index = prev.findIndex(a => a.id === id);
            if (index === -1 || prev[index].isUnlocked) return prev;

            const updated = [...prev];
            const achievement = updated[index];
            const newValue = Math.min(value, achievement.targetValue);

            if (newValue !== achievement.currentValue) {
                updated[index] = { ...achievement, currentValue: newValue };

                if (newValue >= achievement.targetValue) {
                    // Trigger unlock
                    setTimeout(() => unlockAchievement(id), 10);
                }
            }

            return updated;
        });
    }, [unlockAchievement]);

    const getNextAchievement = () => {
        return achievements.find(a => !a.isUnlocked) || null;
    };

    const getUnlockedCount = () => {
        return achievements.filter(a => a.isUnlocked).length;
    };

    return {
        achievements,
        unlockAchievement,
        updateProgress,
        getNextAchievement,
        getUnlockedCount,
        triggerConfetti
    };
};
