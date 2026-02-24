
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Flashcard {
    id: string;
    front: string;
    back: string;
    tags: string[];
    difficulty: 'easy' | 'medium' | 'hard';
}

export interface QuizQuestion {
    question: string;
    options: string[];
    correct_index: number;
    explanation: string;
}

export interface Quiz {
    video_id: string;
    title: string;
    questions: QuizQuestion[];
}

export const useNotebookLMContent = (videoId: string) => {
    const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            // Reset states at the start of fetching new video content
            setFlashcards([]);
            setQuiz(null);

            try {
                // Fetch Flashcards
                const { data: fcData, error: fcError } = await supabase
                    .from('flashcards')
                    .select('*')
                    .eq('video_id', videoId);

                if (!fcError) {
                    setFlashcards((fcData as any) || []);
                } else {
                    setFlashcards([]);
                }

                // Fetch Quiz
                const { data: quizData, error: qError } = await supabase
                    .from('quizzes')
                    .select('*')
                    .eq('video_id', videoId)
                    .maybeSingle();

                if (!qError && quizData) {
                    setQuiz({
                        video_id: quizData.video_id,
                        title: quizData.title || '',
                        questions: quizData.questions as any as QuizQuestion[]
                    });
                } else {
                    setQuiz(null);
                }

            } catch (err) {
                console.error("Error fetching NotebookLM content:", err);
                setFlashcards([]);
                setQuiz(null);
            } finally {
                setLoading(false);
            }
        };

        if (videoId) {
            fetchData();
        } else {
            setFlashcards([]);
            setQuiz(null);
            setLoading(false);
        }
    }, [videoId]);

    return { flashcards, quiz, loading };
};
