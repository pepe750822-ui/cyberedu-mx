
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
            try {
                // Fetch Flashcards
                const { data: fcData, error: fcError } = await supabase
                    .from('flashcards')
                    .select('*')
                    .eq('video_id', videoId);

                if (!fcError) setFlashcards(fcData || []);

                // Fetch Quiz
                const { data: quizData, error: qError } = await supabase
                    .from('quizzes')
                    .select('*')
                    .eq('video_id', videoId)
                    .single();

                if (!qError) setQuiz(quizData);

            } catch (err) {
                console.error("Error fetching NotebookLM content:", err);
            } finally {
                setLoading(false);
            }
        };

        if (videoId) fetchData();
    }, [videoId]);

    return { flashcards, quiz, loading };
};
