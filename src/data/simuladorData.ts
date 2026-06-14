export interface Question {
    id: string;
    text: string;
    options: string[];
    correctIndex: number;
    explanation: string;
    area: string;
    imageUrl?: string;
    source?: string;
}

export type ExamMode = 'full' | 'practice';
export type BankSelection = 'bank1' | 'bank2' | 'bank3' | 'bank4' | 'bank6' | 'bank7' | 'bank8' | 'bank9' | 'bank10' | 'bank11' | 'bank12' | 'bank13' | 'mixed' | 'mixto' | 'infinito';

// These are now loaded dynamically from /public/data/questions.json
// to reduce the initial bundle size.
export const simuladoECOEMS: Question[] = [];
