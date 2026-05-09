export interface Question {
    id: string;
    text: string;
    options: string[];
    correctIndex: number;
    explanation: string;
    area: string;
    imageUrl?: string;
}

export type ExamMode = 'full' | 'practice';
export type BankSelection = 'bank1' | 'bank2' | 'bank3' | 'bank4' | 'bank5' | 'mixed';
export { bank5Questions } from './simuladorData5';

// These are now loaded dynamically from /public/data/questions.json
// to reduce the initial bundle size.
export const simuladoECOEMS: Question[] = [];
