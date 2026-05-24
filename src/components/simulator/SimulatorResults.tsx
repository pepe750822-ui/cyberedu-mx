import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
    Trophy, 
    Sparkles, 
    Target, 
    RotateCcw, 
    Zap, 
    LayoutDashboard, 
    BarChart3, 
    CheckCircle2, 
    XSquare,
    Bot
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Question } from "@/data/simuladorData";
import { Escuela } from "@/data/escuelas";

interface SimulatorResultsProps {
    user: any;
    activeQuestions: Question[];
    userAnswers: Record<string, number>;
    markedForReview: Record<string, boolean>;
    examMode: 'full' | 'practice';
    selectedEscuela: Escuela | null;
    onRestartFull: () => void;
    onRestartPractice: () => void;
    onBackToDashboard: () => void;
    children?: React.ReactNode; // For ProgressPanel
}

export const SimulatorResults: React.FC<SimulatorResultsProps> = ({
    user,
    activeQuestions,
    userAnswers,
    markedForReview,
    examMode,
    selectedEscuela,
    onRestartFull,
    onRestartPractice,
    onBackToDashboard,
    children
}) => {
    const navigate = useNavigate();
    const calculateScore = () => {
        let correct = 0;
        activeQuestions.forEach(q => {
            if (userAnswers[q.id] === q.correctIndex) correct++;
        });
        return correct;
    };

    const score = calculateScore();
    const percentage = activeQuestions.length > 0 ? (score / activeQuestions.length) * 100 : 0;

    // Top wrong areas
    const wrongAreaCounts: Record<string, number> = {};
    activeQuestions.forEach(q => {
        if (userAnswers[q.id] !== q.correctIndex) {
            wrongAreaCounts[q.area] = (wrongAreaCounts[q.area] || 0) + 1;
        }
    });
    const topWrongAreas = Object.entries(wrongAreaCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3)
        .map(([area]) => area);

    const myPercentage = Math.round((score / activeQuestions.length) * 100);
    const targetPercentage = selectedEscuela ? Math.round((selectedEscuela.puntaje / 128) * 100) : 0;
    const metaDiff = selectedEscuela ? targetPercentage - myPercentage : 0;
    const metaSuccess = !!selectedEscuela && metaDiff <= 0;
    const metaClose = !!selectedEscuela && metaDiff > 0 && metaDiff <= 10;
    const areasText = topWrongAreas.join(', ') || 'Todas las materias';

    return (
        <div className="min-h-screen bg-slate-950 p-6 md:p-12 overflow-y-auto">
            <div className="max-w-5xl mx-auto space-y-10">
                {/* Header Results */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 bg-slate-900/50 border border-white/10 rounded-[2.5rem] p-10 flex flex-col items-center justify-center text-center space-y-6">
                        <div className="h-20 w-20 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mb-2">
                            <Trophy className="h-10 w-10" />
                        </div>
                        <div className="flex items-center gap-3 flex-wrap justify-center">
                            <h2 className="text-3xl font-black uppercase text-white">Resultado del Examen</h2>
                            <span className={cn(
                                "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                                examMode === 'practice' ? "bg-amber-500/20 text-amber-400" : "bg-primary/20 text-primary"
                            )}>
                                {examMode === 'practice' ? 'Práctica Rápida' : 'Examen Completo'}
                            </span>
                        </div>

                        {!user && (
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-primary/10 border border-primary/20 rounded-3xl p-6 text-center space-y-4 mt-4 w-full"
                            >
                                <div className="flex justify-center">
                                    <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                                        <Sparkles className="h-6 w-6 text-primary" />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-lg font-black text-white uppercase tracking-tight">¡No pierdas tu score!</h3>
                                    <p className="text-slate-400 text-xs max-w-sm mx-auto leading-relaxed">
                                        Regístrate gratis para guardar tus <strong>{score} aciertos</strong> en tu historial y competir en el ranking.
                                    </p>
                                </div>
                                <Button 
                                    onClick={() => window.location.href = '/auth?ref=simulador_result'}
                                    className="rounded-xl px-6 h-10 font-black uppercase tracking-widest text-[10px] w-full sm:w-auto"
                                >
                                    Guardar Score Ahora
                                </Button>
                            </motion.div>
                        )}
                        <div className="flex gap-4 items-end">
                            <span className="text-7xl font-black text-white">{score}</span>
                            <span className="text-2xl font-black text-slate-500 mb-2">/ {activeQuestions.length}</span>
                        </div>
                        <Progress value={percentage} className="h-3 w-full max-w-sm" />
                        <p className="text-slate-400 text-sm">
                            Has superado el <span className="text-emerald-400 font-bold">{percentage.toFixed(0)}%</span> de los reactivos correctamente.
                        </p>
                    </div>

                    <div className="bg-primary/5 border border-primary/20 rounded-[2.5rem] p-10 space-y-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                            <Target className="h-32 w-32" />
                        </div>
                        <h3 className="text-sm font-black uppercase tracking-widest text-primary relative z-10">Análisis y Meta</h3>

                        <div className="space-y-2 relative z-10">
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-slate-400">Probabilidad de Ingreso</span>
                                <span className="text-sm font-black text-white">{percentage > 80 ? "ALTA" : percentage > 60 ? "MEDIA" : "EN MEJORA"}</span>
                            </div>
                            <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-primary transition-all" style={{ width: `${percentage}%` }} />
                            </div>
                        </div>

                        <div className="pt-4 border-t border-white/5 space-y-3 relative z-10">
                            {selectedEscuela ? (
                                <div className={cn(
                                    "p-4 rounded-2xl border",
                                    metaSuccess ? "bg-emerald-500/10 border-emerald-500/30" :
                                    metaClose   ? "bg-amber-500/10 border-amber-500/30" :
                                                  "bg-red-500/10 border-red-500/30"
                                )}>
                                    <div className="flex items-start gap-3">
                                        <span className="text-xl shrink-0">{metaSuccess ? "🎉" : metaClose ? "⚠️" : "❌"}</span>
                                        <div className="space-y-1 min-w-0">
                                            <p className={cn("text-sm font-black leading-snug", metaSuccess ? "text-emerald-400" : metaClose ? "text-amber-400" : "text-red-400")}>
                                                {metaSuccess
                                                    ? `¡Alcanzas ${selectedEscuela.nombre}! Tu rendimiento (${myPercentage}%) supera el mínimo requerido (${targetPercentage}%)`
                                                    : metaClose
                                                    ? `¡Casi! Te faltan ${metaDiff}% para ${selectedEscuela.nombre}.`
                                                    : `Necesitas mejorar ${metaDiff}% para ${selectedEscuela.nombre}.`
                                                }
                                            </p>
                                            {!metaSuccess && (
                                                <p className="text-xs text-slate-400">
                                                    {metaClose ? "Practica estos temas:" : "Enfócate en:"}{' '}
                                                    <span className="font-bold text-white">{areasText}</span>
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-white/5 p-3 rounded-xl border border-white/10 text-center">
                                    <p className="text-xs text-slate-500">Sin escuela meta seleccionada</p>
                                    <p className="text-[10px] text-slate-600 mt-1">Configura tu meta en la pantalla de inicio</p>
                                </div>
                            )}

                            <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-slate-400">Tu Puntaje Final</span>
                                <span className="text-sm font-black text-white">{myPercentage}% <span className="text-slate-500 font-bold">({score}/{activeQuestions.length})</span></span>
                            </div>
                            {selectedEscuela && (
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-bold text-slate-400">Mínimo {selectedEscuela.nombre}</span>
                                    <span className="text-sm font-black text-amber-400">{targetPercentage}% <span className="text-slate-500 font-bold">({selectedEscuela.puntaje}/128)</span></span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {percentage < 70 && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-violet-600/10 border-2 border-violet-600/30 rounded-[2.5rem] p-8 md:p-10 flex flex-col md:flex-row items-center gap-8 shadow-2xl shadow-violet-500/10"
                    >
                        <div className="h-20 w-20 rounded-[2rem] bg-violet-600/20 flex items-center justify-center shrink-0 border border-violet-600/30 animate-pulse">
                            <Bot className="h-10 w-10 text-violet-400" />
                        </div>
                        <div className="flex-1 text-center md:text-left space-y-4">
                            <h3 className="text-2xl font-black text-white uppercase tracking-tighter leading-none">
                                ¡No te rindas! Tu Tutor IA puede salvar tu examen 🚀
                            </h3>
                            <p className="text-slate-300 text-base leading-relaxed">
                                Has obtenido un <span className="text-rose-400 font-black">{percentage.toFixed(0)}%</span>. Los alumnos que analizan sus errores con la IA aumentan su puntaje un <span className="text-emerald-400 font-black">40% en solo 1 semana</span>.
                            </p>
                            <Button 
                                onClick={() => {
                                    const message = `Acabo de sacar ${score} de ${activeQuestions.length} (${percentage.toFixed(0)}%) en el simulador. Necesito un plan de rescate urgente para mejorar mis puntos en las áreas que fallé: ${areasText}. ¿Podemos repasar mis errores?`;
                                    window.dispatchEvent(new CustomEvent('cyberedu:open-chat', { detail: { message } }));
                                }}
                                className="bg-violet-600 hover:bg-violet-500 text-white font-black uppercase tracking-widest text-sm px-10 h-14 rounded-2xl shadow-lg shadow-violet-600/25 hover:scale-105 active:scale-95 transition-all"
                            >
                                🔥 Crear Plan de Rescate Ahora
                            </Button>
                        </div>
                    </motion.div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col md:flex-row gap-4">
                    <Button onClick={onRestartFull} variant="outline" className="flex-1 h-14 rounded-xl border-white/10 hover:bg-white/5 text-xs font-black uppercase tracking-widest">
                        <RotateCcw className="mr-2 h-4 w-4" /> Reintentar Completo
                    </Button>
                    <Button onClick={onRestartPractice} variant="outline" className="flex-1 h-14 rounded-xl border-amber-500/20 text-amber-400 hover:bg-amber-500/10 text-xs font-black uppercase tracking-widest">
                        <Zap className="mr-2 h-4 w-4" /> Nueva Práctica Rápida
                    </Button>
                    <Button onClick={onBackToDashboard} className="flex-1 h-14 rounded-xl bg-primary text-xs font-black uppercase tracking-widest">
                        <LayoutDashboard className="mr-2 h-4 w-4" /> Volver al Dashboard
                    </Button>
                </div>

                {/* Banner Referidos */}
                <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-3 text-center text-sm mt-3">
                    🎁 ¿Tienes amigos preparándose? Invítalos y ambos ganan <strong>50 tokens gratis</strong>
                    <button onClick={() => navigate('/perfil')} className="block text-green-400 font-bold mt-1 mx-auto">
                        Ver mi código →
                    </button>
                </div>

                {/* Progress Panel Slot */}
                {children}

                {/* AITutor CTA */}
                <button
                    onClick={() => {
                        const failedTopics = activeQuestions
                            .filter(q => userAnswers[q.id] !== q.correctIndex)
                            .map(q => q.area)
                            .filter((area, i, arr) => arr.indexOf(area) === i)
                            .slice(0, 3)
                            .join(", ");
                        const message = failedTopics
                            ? `Fallé preguntas sobre: ${failedTopics}. Necesito que hagamos una autopsia de mis errores. ¿Me los explicas?`
                            : "Termino de hacer el simulador. ¿Me ayudas a repasar lo que fallé?";
                        window.dispatchEvent(new CustomEvent('cyberedu:open-chat', { detail: { message } }));
                    }}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold py-4 px-6 rounded-2xl shadow-xl shadow-violet-500/20 transition-all text-sm uppercase tracking-widest"
                >
                    🧠 Hacer Autopsia de Errores con Tutor IA
                    {!user && <span className="text-[10px] opacity-75 ml-1 bg-white/20 px-2 py-0.5 rounded-full">(gratis)</span>}
                </button>

                {/* Performance Map */}
                <div className="bg-slate-900/40 border border-white/5 rounded-[2rem] p-8 space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <h3 className="text-lg font-black uppercase text-white flex items-center gap-2">
                            <BarChart3 className="h-5 w-5 text-indigo-400" /> Mapa de Desempeño
                        </h3>
                        <div className="flex flex-wrap gap-4">
                            <div className="flex items-center gap-2">
                                <div className="h-3 w-3 rounded-full bg-emerald-500" />
                                <span className="text-[10px] font-bold text-slate-400 uppercase">Correctas</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="h-3 w-3 rounded-full bg-red-500" />
                                <span className="text-[10px] font-bold text-slate-400 uppercase">Incorrectas</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="h-3 w-3 rounded-full border-2 border-amber-500" />
                                <span className="text-[10px] font-bold text-slate-400 uppercase">Marcadas</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-8 sm:grid-cols-12 md:grid-cols-16 gap-2 p-2">
                        {activeQuestions.map((q, idx) => {
                            const isCorrect = userAnswers[q.id] === q.correctIndex;
                            const isMarked = markedForReview[q.id];
                            return (
                                <a
                                    key={q.id}
                                    href={`#question-${q.id}`}
                                    className={cn(
                                        "h-8 w-8 rounded-full text-[10px] font-black flex items-center justify-center transition-all hover:scale-110",
                                        isCorrect ? "bg-emerald-500 text-white" : "bg-red-500 text-white",
                                        isMarked && "ring-2 ring-amber-500 ring-offset-2 ring-offset-slate-950"
                                    )}
                                    title={`Pregunta ${idx + 1}: ${isCorrect ? 'Correcta' : 'Incorrecta'}${isMarked ? ' (Marcada para revisión)' : ''}`}
                                >
                                    {idx + 1}
                                </a>
                            );
                        })}
                    </div>
                </div>

                {/* Review Questions List */}
                <div className="space-y-6 pt-10 border-t border-white/5">
                    <h3 className="text-lg font-black uppercase text-white flex items-center gap-2">
                        <Target className="h-5 w-5 text-primary" /> Análisis de Respuestas
                    </h3>
                    <div className="grid gap-4">
                        {activeQuestions.map((q, idx) => {
                            const isCorrect = userAnswers[q.id] === q.correctIndex;
                            return (
                                <div
                                    key={q.id}
                                    id={`question-${q.id}`}
                                    className={cn("p-6 rounded-3xl border transition-all scroll-mt-24", isCorrect ? "bg-emerald-500/5 border-emerald-500/20" : "bg-red-500/5 border-red-500/20")}
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Reactivo {idx + 1} - {q.area}</span>
                                        {isCorrect ? <CheckCircle2 className="text-emerald-500 h-5 w-5" /> : <XSquare className="text-red-500 h-5 w-5" />}
                                    </div>
                                    <p className="text-sm font-bold text-white mb-6">{q.text}</p>

                                    {q.imageUrl && (
                                        <div className="mb-6 rounded-2xl overflow-hidden border border-white/10 bg-black/20">
                                            <img src={q.imageUrl} alt={`Imagen reactivo ${idx + 1}`} className="max-h-64 mx-auto object-contain" loading="lazy" />
                                        </div>
                                    )}

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                                        {q.options.map((opt, i) => (
                                            <div key={i} className={cn(
                                                "p-3 rounded-xl text-xs font-medium border",
                                                i === q.correctIndex ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-100" :
                                                    i === userAnswers[q.id] ? "bg-red-500/20 border-red-500/30 text-red-100" : "bg-white/5 border-white/5 text-slate-400"
                                            )}>
                                                {opt}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                                        <p className="text-[10px] font-black uppercase text-primary mb-2">Explicación Pro</p>
                                        <p className="text-xs text-slate-300 italic">"{q.explanation}"</p>
                                    </div>
                                    {!isCorrect && (
                                        <div className="mt-3 p-3 bg-violet-500/10 border border-violet-500/30 rounded-lg flex items-center justify-between gap-3">
                                            <span className="text-sm text-violet-300">¿No entendiste este tema?</span>
                                            <button
                                                onClick={() => {
                                                    const message = `No entendí esta pregunta del ECOEMS:\n\n"${q.text}"\n\nOpciones:\n${q.options.map((o, i) => `${i + 1}. ${o}`).join('\n')}\n\nLa respuesta correcta es: ${q.options[q.correctIndex]}\n\n¿Me explicas por qué?`;
                                                    window.dispatchEvent(new CustomEvent('cyberedu:open-chat', { detail: { message } }));
                                                }}
                                                className="shrink-0 text-xs bg-violet-600 hover:bg-violet-500 text-white px-3 py-1.5 rounded-lg transition-all font-semibold"
                                            >
                                                Preguntarle al Tutor →
                                            </button>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};
