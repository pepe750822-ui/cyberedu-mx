
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, RotateCcw, Brain, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Flashcard } from '@/hooks/useNotebookLMContent';
import { cn } from '@/lib/utils';

interface Props {
    flashcards: Flashcard[];
}

export const FlashcardViewer: React.FC<Props> = ({ flashcards }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [studiedCount, setStudiedCount] = useState(0);

    if (flashcards.length === 0) return (
        <div className="flex flex-col items-center justify-center p-12 bg-slate-900/50 rounded-[2.5rem] border border-white/5">
            <Brain className="h-12 w-12 text-slate-700 mb-4" />
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">No hay flashcards disponibles aún</p>
        </div>
    );

    const current = flashcards[currentIndex];

    const handleNext = () => {
        setIsFlipped(false);
        if (currentIndex < flashcards.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            setCurrentIndex(0); // Loop
        }
    };

    const handlePrev = () => {
        setIsFlipped(false);
        setCurrentIndex(prev => (prev > 0 ? prev - 1 : flashcards.length - 1));
    };

    return (
        <div className="w-full max-w-2xl mx-auto space-y-8">
            {/* Header & Stats */}
            <div className="flex items-center justify-between px-2">
                <div className="space-y-1">
                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Flashcards IA</h3>
                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Powered by NotebookLM</p>
                </div>
                <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-2xl flex items-center gap-3">
                    <span className="text-xs font-black text-white">{currentIndex + 1} / {flashcards.length}</span>
                    <div className="h-1.5 w-24 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-indigo-500"
                            initial={{ width: 0 }}
                            animate={{ width: `${((currentIndex + 1) / flashcards.length) * 100}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Card Container */}
            <div className="relative h-[350px] w-full perspective-1000">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="w-full h-full cursor-pointer group"
                        onClick={() => setIsFlipped(!isFlipped)}
                    >
                        <motion.div
                            animate={{ rotateY: isFlipped ? 180 : 0 }}
                            transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
                            className="w-full h-full relative preserve-3d"
                        >
                            {/* Front */}
                            <div className="absolute inset-0 backface-hidden bg-slate-900 border-2 border-white/5 rounded-[2.5rem] p-12 flex flex-col items-center justify-center text-center shadow-2xl group-hover:border-indigo-500/30 transition-colors">
                                <div className="absolute top-8 left-8 p-3 rounded-2xl bg-indigo-500/10 text-indigo-400">
                                    <Brain className="h-5 w-5" />
                                </div>
                                <h4 className="text-2xl md:text-3xl font-black text-white leading-tight uppercase tracking-tighter">
                                    {current.front}
                                </h4>
                                <p className="mt-8 text-[10px] font-black text-slate-500 uppercase tracking-widest animate-pulse">
                                    Haz clic para ver respuesta
                                </p>
                            </div>

                            {/* Back */}
                            <div
                                className="absolute inset-0 backface-hidden bg-indigo-600 border-2 border-white/20 rounded-[2.5rem] p-12 flex flex-col items-center justify-center text-center shadow-2xl"
                                style={{ transform: 'rotateY(180deg)' }}
                            >
                                <div className="absolute top-8 left-8 p-3 rounded-2xl bg-white/20 text-white">
                                    <CheckCircle2 className="h-5 w-5" />
                                </div>
                                <p className="text-xl md:text-2xl font-bold text-white leading-relaxed">
                                    {current.back}
                                </p>
                                {current.tags && (
                                    <div className="mt-8 flex flex-wrap justify-center gap-2">
                                        {current.tags.map((tag, i) => (
                                            <span key={i} className="text-[9px] font-black uppercase bg-black/20 text-white/80 px-3 py-1 rounded-full">
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4">
                <Button
                    variant="outline"
                    onClick={handlePrev}
                    className="h-14 w-14 rounded-2xl border-white/5 bg-slate-900/50 hover:bg-white/5 text-white"
                >
                    <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button
                    variant="outline"
                    onClick={() => setIsFlipped(!isFlipped)}
                    className="h-14 px-8 rounded-2xl border-indigo-500/20 bg-indigo-500/10 text-indigo-400 font-black uppercase tracking-widest text-[10px]"
                >
                    <RotateCcw className="mr-2 h-4 w-4" /> Voltear
                </Button>
                <Button
                    variant="outline"
                    onClick={handleNext}
                    className="h-14 w-14 rounded-2xl border-white/5 bg-slate-900/50 hover:bg-white/5 text-white"
                >
                    <ChevronRight className="h-6 w-6" />
                </Button>
            </div>
        </div>
    );
};
