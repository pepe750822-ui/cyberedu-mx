import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ChevronDown,
  ChevronRight,
  Zap,
  Crown,
  Check,
  X,
  CheckCircle2,
  XSquare,
  ArrowLeft,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { areas, colorMap } from "@/data/temarioData";

import españolData from "@/data/practica/español.json";
import habilidadVerbalData from "@/data/practica/habilidad-verbal.json";
import matematicasData from "@/data/practica/matematicas.json";
import habilidadMateData from "@/data/practica/habilidad-matematica.json";
import biologiaData from "@/data/practica/biologia.json";
import fisicaData from "@/data/practica/fisica.json";
import quimicaData from "@/data/practica/quimica.json";
import historiaData from "@/data/practica/historia.json";
import geografiaData from "@/data/practica/geografia.json";
import civicaData from "@/data/practica/civica.json";

interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

// Build lookup: subíndice title → questions[]
const staticBank: Record<string, QuizQuestion[]> = {};
for (const bank of [
  españolData, habilidadVerbalData, matematicasData, habilidadMateData,
  biologiaData, fisicaData, quimicaData, historiaData, geografiaData, civicaData,
]) {
  for (const [titulo, preguntas] of Object.entries(bank.subindices)) {
    staticBank[titulo] = preguntas as QuizQuestion[];
  }
}

type QuizPhase =
  | { phase: "idle" }
  | {
      phase: "quiz";
      subindice: string;
      questions: QuizQuestion[];
      answers: (number | null)[];
    }
  | { phase: "results"; subindice: string; questions: QuizQuestion[]; answers: number[] };

// Helper to shuffle an array (Fisher-Yates)
function shuffleArray<T>(array: T[]): T[] {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
}

function shuffleQuizQuestion(q: QuizQuestion): QuizQuestion {
  const optionsWithIndex = q.options.map((opt, i) => ({ text: opt, isCorrect: i === q.correct }));
  const shuffledOptions = shuffleArray(optionsWithIndex);
  const newCorrectIndex = shuffledOptions.findIndex(o => o.isCorrect);
  return {
    ...q,
    options: shuffledOptions.map(o => o.text),
    correct: newCorrectIndex
  };
}

export default function PracticaSubindice() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [openAreas, setOpenAreas] = useState<number[]>([]);
  const [quiz, setQuiz] = useState<QuizPhase>({ phase: "idle" });

  const isFree =
    (profile as any)?.paquete_completo === true ||
    (profile as any)?.subscription_status === "active" ||
    (profile as any)?.is_premium === true;

  const toggleArea = (i: number) =>
    setOpenAreas((prev) =>
      prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]
    );

  const handlePractice = (subindice: string) => {
    const questions = staticBank[subindice];
    if (!questions || questions.length === 0) return;

    const randomizedQuestions = shuffleArray(questions).map(shuffleQuizQuestion);

    setQuiz({
      phase: "quiz",
      subindice,
      questions: randomizedQuestions,
      answers: new Array(randomizedQuestions.length).fill(null),
    });
  };

  const handleSelectOption = (qIdx: number, aIdx: number) => {
    if (quiz.phase !== "quiz") return;
    const newAnswers = [...quiz.answers];
    newAnswers[qIdx] = aIdx;
    setQuiz({ ...quiz, answers: newAnswers });
  };

  const handleShowResults = () => {
    if (quiz.phase !== "quiz") return;
    // Fill unanswered with -1 to allow seeing results even if incomplete
    const completeAnswers = quiz.answers.map(a => a === null ? -1 : a);
    setQuiz({
      phase: "results",
      subindice: quiz.subindice,
      questions: quiz.questions,
      answers: completeAnswers,
    });
  };

  // Open AITutor with question context — same pattern as SimuladorPro
  const askTutor = (question: string, correctOption: string, explanation: string) => {
    const message = `Explícame esta pregunta del ECOEMS:\n"${question}"\n\nLa respuesta correcta es: "${correctOption}"\n\n${explanation}`;
    window.dispatchEvent(new CustomEvent("cyberedu:open-chat", { detail: { message } }));
  };

  const correctCount =
    quiz.phase === "results"
      ? quiz.answers.filter((a, i) => a === quiz.questions[i].correct).length
      : 0;

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-24 cyber-grid">
      {/* Background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-500/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-500/20 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-4xl mx-auto px-4 pt-24 space-y-8 relative">
        {/* ── HEADER ── */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-slate-400">
            <Zap className="h-3 w-3 text-primary" />
            Práctica Dirigida · ECOEMS
          </div>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic leading-none">
            Practica por{" "}
            <span className="text-primary not-italic">Subíndice</span>
          </h1>
          <p className="text-slate-400 text-base max-w-xl mx-auto">
            5 preguntas de opción múltiple para cada tema del temario oficial.
            Practica exactamente donde más lo necesitas.
          </p>
        </div>

        {/* ── ACCESS BANNER ── */}
        {user ? (
          isFree && (
            <div className="flex items-center gap-3 px-5 py-3 rounded-2xl border bg-emerald-500/10 border-emerald-500/30">
              <Crown className="h-5 w-5 text-emerald-400 shrink-0" />
              <span className="text-sm font-bold text-emerald-300">
                Paquete Completo activo — acceso ilimitado
              </span>
            </div>
          )
        ) : (
          <div className="flex items-center justify-between gap-4 px-5 py-3 rounded-2xl border bg-white/5 border-white/10">
            <span className="text-sm font-bold text-slate-300">
              Practica gratis — inicia sesión para guardar tu progreso
            </span>
            <button
              onClick={() => navigate("/auth?ref=practica-subindice")}
              className="text-xs font-black uppercase tracking-widest text-primary hover:text-primary/80 underline underline-offset-2 shrink-0"
            >
              Entrar →
            </button>
          </div>
        )}

        {/* ── TEMARIO ── */}
        <div className="space-y-3">
          {areas.map((area, aIdx) => {
            const colors = colorMap[area.color] ?? colorMap.blue;
            const isOpen = openAreas.includes(aIdx);
            return (
              <div
                key={aIdx}
                className="rounded-2xl border border-white/10 overflow-hidden bg-slate-900/60 backdrop-blur-sm"
              >
                {/* Area header */}
                <button
                  onClick={() => toggleArea(aIdx)}
                  className={`w-full flex items-center justify-between px-5 py-4 ${colors.header} text-white font-black text-sm uppercase tracking-wide hover:opacity-90 transition-opacity`}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-lg">{area.icono}</span>
                    {area.nombre}
                    <span className="text-[10px] font-bold opacity-70 normal-case tracking-normal">
                      ({area.subtemas.length} subíndices)
                    </span>
                  </span>
                  {isOpen ? (
                    <ChevronDown className="h-4 w-4 opacity-80" />
                  ) : (
                    <ChevronRight className="h-4 w-4 opacity-80" />
                  )}
                </button>

                {/* Subtemas */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="subtemas"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="divide-y divide-white/5">
                        {area.subtemas.map((subtema, sIdx) => (
                          <div
                            key={sIdx}
                            className="flex items-center justify-between px-5 py-3 gap-4 hover:bg-white/3 transition-colors"
                          >
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-white truncate">
                                {subtema.titulo}
                              </p>
                              <p className="text-[11px] text-slate-500 mt-0.5">
                                {subtema.contenido.length} conceptos clave
                              </p>
                            </div>

                            <button
                              onClick={() => handlePractice(subtema.titulo)}
                              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-white text-xs font-black uppercase tracking-wide shrink-0 transition-all hover:scale-105 active:scale-95 shadow-sm ${colors.btn}`}
                            >
                              <Zap className="h-3 w-3" />
                              Practicar
                            </button>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── QUIZ MODAL ── */}
      <AnimatePresence>
        {quiz.phase !== "idle" && (
          <motion.div
            key="quiz-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-sm overflow-y-auto"
          >
            <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
              {/* Modal header */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuiz({ phase: "idle" })}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <ArrowLeft className="h-5 w-5 text-slate-400" />
                </button>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                    Práctica por Subíndice
                  </p>
                  <h2 className="text-lg font-black text-white leading-tight truncate">
                    {(quiz as any).subindice}
                  </h2>
                </div>
              </div>

              {/* Progress bar and Quiz — all questions at once */}
              {quiz.phase === "quiz" && (
                <div className="space-y-8">
                  {quiz.questions.map((q, qIdx) => {
                    const selectedIdx = quiz.answers[qIdx];
                    return (
                      <div key={qIdx} className="bg-slate-900/80 border border-white/10 rounded-2xl p-5 space-y-4">
                        <p className="text-sm md:text-base font-semibold text-white leading-snug">
                          <span className="text-primary font-black mr-2">{qIdx + 1}.</span>
                          {q.question}
                        </p>

                        {/* Options */}
                        <div className="space-y-3">
                          {q.options.map((opt, oIdx) => {
                            const isSelected = selectedIdx === oIdx;
                            const optionClass = isSelected
                              ? "bg-indigo-500/20 border-indigo-500/60 text-white"
                              : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:border-white/20";
                            const badgeClass = isSelected
                              ? "bg-indigo-500 text-white"
                              : "bg-white/10 text-slate-400";

                            return (
                              <button
                                key={oIdx}
                                onClick={() => handleSelectOption(qIdx, oIdx)}
                                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 border flex items-center gap-3 ${optionClass}`}
                              >
                                <span className={`h-7 w-7 rounded-lg flex items-center justify-center font-black text-xs shrink-0 transition-colors ${badgeClass}`}>
                                  {String.fromCharCode(65 + oIdx)}
                                </span>
                                {opt}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                  
                  <button
                    onClick={handleShowResults}
                    disabled={quiz.answers.includes(null)}
                    className="w-full bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 text-white font-black text-[11px] uppercase tracking-widest px-6 py-4 rounded-xl transition-all"
                  >
                    Ver resultados finales
                  </button>
                </div>
              )}

              {/* Results */}
              {quiz.phase === "results" && (
                <div className="space-y-6">
                  {/* Score card */}
                  <div className={`text-center p-6 rounded-2xl border ${
                    correctCount >= 4
                      ? "bg-emerald-500/10 border-emerald-500/30"
                      : correctCount >= 3
                      ? "bg-amber-500/10 border-amber-500/30"
                      : "bg-red-500/10 border-red-500/30"
                  }`}>
                    <p className="text-6xl font-black text-white">
                      {correctCount}/{quiz.questions.length}
                    </p>
                    <p className={`text-lg font-bold mt-1 ${
                      correctCount >= 4
                        ? "text-emerald-400"
                        : correctCount >= 3
                        ? "text-amber-400"
                        : "text-red-400"
                    }`}>
                      {correctCount >= 4
                        ? "¡Excelente! Dominas este tema"
                        : correctCount >= 3
                        ? "Bien, pero repasa los errores"
                        : "Necesitas más práctica en este tema"}
                    </p>
                  </div>

                  {/* Per-question review */}
                  {quiz.questions.map((q, qIdx) => {
                    const chosen = quiz.answers[qIdx];
                    const isCorrect = chosen === q.correct;
                    return (
                      <div
                        key={qIdx}
                        className={`rounded-2xl border p-5 space-y-3 ${
                          isCorrect
                            ? "bg-emerald-500/10 border-emerald-500/30"
                            : "bg-red-500/10 border-red-500/30"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-0.5 ${
                            isCorrect ? "bg-emerald-500" : "bg-red-500"
                          }`}>
                            {isCorrect
                              ? <Check className="h-3.5 w-3.5 text-white" />
                              : <X className="h-3.5 w-3.5 text-white" />}
                          </div>
                          <p className="text-sm font-semibold text-white leading-snug">
                            {q.question}
                          </p>
                        </div>

                        <div className="space-y-1.5 pl-9">
                          {q.options.map((opt, oIdx) => (
                            <div
                              key={oIdx}
                              className={`text-xs px-3 py-2 rounded-xl font-medium ${
                                oIdx === q.correct
                                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                                  : oIdx === chosen && !isCorrect
                                  ? "bg-red-500/20 text-red-300 border border-red-500/30"
                                  : "bg-white/5 text-slate-400"
                              }`}
                            >
                              {opt}
                              {oIdx === q.correct && " ✓"}
                            </div>
                          ))}
                        </div>

                        <div className="pl-9 text-xs text-slate-400 leading-relaxed">
                          <span className="font-bold text-slate-300">Explicación: </span>
                          {q.explanation}
                        </div>

                        {/* Ask Tutor — only for wrong answers, SimuladorPro pattern */}
                        {!isCorrect && (
                          <div className="pl-9">
                            <button
                              onClick={() => askTutor(q.question, q.options[q.correct], q.explanation)}
                              className="w-full bg-gradient-to-r from-violet-500/20 to-purple-500/20 border border-violet-500/40 hover:border-violet-400/60 text-violet-300 hover:text-violet-200 font-bold text-[11px] py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-95"
                            >
                              🧠 Preguntar al Tutor IA
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {/* Actions */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => setQuiz({ phase: "idle" })}
                      className="flex-1 h-12 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-sm transition-colors"
                    >
                      Volver al temario
                    </button>
                    <button
                      onClick={() => handlePractice((quiz as any).subindice)}
                      className="flex-1 h-12 rounded-xl bg-primary hover:bg-primary/80 text-white font-black uppercase tracking-wide text-xs transition-colors shadow-lg shadow-primary/20"
                    >
                      Repetir subíndice
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{ __html: `
        .cyber-grid {
          background-image: radial-gradient(circle at 2px 2px, rgba(255,255,255,0.03) 1px, transparent 0);
          background-size: 40px 40px;
        }
      `}} />
    </div>
  );
}
