
export type AchievementType = 'gold' | 'silver' | 'platinum' | 'blue';

export interface Achievement {
    id: string;
    title: string;
    description: string;
    type: AchievementType;
    icon: string;
    targetValue: number;
    currentValue: number;
    isUnlocked: boolean;
    unlockedAt?: string;
    category: 'study' | 'quiz' | 'simulator' | 'social';
}

export const ACHIEVEMENTS_DATA: Achievement[] = [
    {
        id: 'master-class',
        title: 'Master Class',
        description: 'Completar todas las áreas de estudio',
        type: 'platinum',
        icon: 'GraduationCap',
        targetValue: 10, // Assuming 10 areas based on areas.ts
        currentValue: 0,
        isUnlocked: false,
        category: 'study'
    },
    {
        id: 'velocista',
        title: 'Velocista',
        description: 'Terminar el simulador con +2 horas de anticipación',
        type: 'gold',
        icon: 'Zap',
        targetValue: 1,
        currentValue: 0,
        isUnlocked: false,
        category: 'simulator'
    },
    {
        id: 'persistente',
        title: 'Persistente',
        description: 'Mantener una racha de estudio de 30 días',
        type: 'platinum',
        icon: 'Calendar',
        targetValue: 30,
        currentValue: 0,
        isUnlocked: false,
        category: 'study'
    },
    {
        id: 'enciclopedista',
        title: 'Enciclopedista',
        description: 'Ver los 91 videos de la plataforma',
        type: 'gold',
        icon: 'Library',
        targetValue: 91,
        currentValue: 0,
        isUnlocked: false,
        category: 'study'
    },
    {
        id: 'perfect-score',
        title: 'Perfect Score',
        description: 'Obtener 100% en cualquier quiz o simulador',
        type: 'gold',
        icon: 'Target',
        targetValue: 1,
        currentValue: 0,
        isUnlocked: false,
        category: 'quiz'
    }
];
