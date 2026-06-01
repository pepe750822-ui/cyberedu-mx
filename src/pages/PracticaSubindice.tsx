import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ChevronDown,
  ChevronRight,
  Zap,
  Crown,
  Lock,
  Check,
  X,
  CheckCircle2,
  XSquare,
  Ticket,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { areas, colorMap } from "@/data/temarioData";

interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

type QuizPhase =
  | { phase: "idle" }
  | { phase: "loading"; subindice: string }
  | {
      phase: "quiz";
      subindice: string;
      questions: QuizQuestion[];
      currentIdx: number;
      answers: (number | null)[];
      feedbackIdx: number | null;
    }
  | { phase: "results"; subindice: string; questions: QuizQuestion[]; answers: number[] };

const TOKEN_COST = 10;

export default function PracticaSubindice() {
  const { user, profile, session, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [openAreas, setOpenAreas] = useState<number[]>([]);
  const [quiz, setQuiz] = useState<QuizPhase>({ phase: "idle" });

  const isFree =
    (profile as any)?.paquete_completo === true ||
    (profile as any)?.subscription_status === "active" ||
    (profile as any)?.is_premium === true;
  const tokens = profile?.tokens ?? 0;
  const canPractice = isFree || tokens >= TOKEN_COST;

  const toggleArea = (i: number) =>
    setOpenAreas((prev) =>
      prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]
    );

  const handlePractice = async (subindice: string) => {
    if (!user) {
      navigate("/auth?ref=practica-subindice");
      return;
    }
    if (!canPractice) {
      toast.error(`Necesitas ${TOKEN_COST} tokens. Tienes ${tokens}.`);
      return;
    }

    setQuiz({ phase: "loading", subindice });

    try {
      const resp = await fetch("/api/practica-subindice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({ subindice }),
      });

      const data = await resp.json();

      if (!resp.ok) {
        if (data.code === "insufficient_tokens") {
          toast.error(`Necesitas ${TOKEN_COST} tokens. Tienes ${data.currentTokens ?? tokens}.`);
          setQuiz({ phase: "idle" });
          return;
        }
        throw new Error(data.error || "Error al cargar preguntas");
      }

      if (!Array.isArray(data.questions) || data.questions.length === 0) {
        throw new Error("No se recibieron preguntas");
      }

      if (data.tokensDeducted > 0) refreshProfile();

      setQuiz({
        phase: "quiz",
        subindice,
        questions: data.questions as QuizQuestion[],
        currentIdx: 0,
        answers: new Array(data.questions.length).fill(null),
        feedbackIdx: null,
      });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      toast.error(msg);
      setQuiz({ phase: "idle" });
    }
  };

  // Called when user taps an option — immediately lock in and show feedback
  const handleSelectOption = (aIdx: number) => {
    if (quiz.phase !== "quiz" || quiz.feedbackIdx !== null) return;
    setQuiz({ ...quiz, feedbackIdx: aIdx });
  };

  // Advance to next question or show results
  const handleNext = () => {
    if (quiz.phase !== "quiz" || quiz.feedbackIdx === null) return;
    const newAnswers = [...quiz.answers];
    newAnswers[quiz.currentIdx] = quiz.feedbackIdx;

    if (quiz.currentIdx === quiz.questions.length - 1) {
      setQuiz({
        phase: "results",
        subindice: quiz.subindice,
        questions: quiz.questions,
        answers: newAnswers as number[],
      });
    } else {
      setQuiz({
        ...quiz,
        currentIdx: quiz.currentIdx + 1,
        answers: newAnswers,
        feedbackIdx: null,
      });
    }
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
            5 preguntas generadas por IA para cada tema del temario oficial.
            Practica exactamente donde más lo necesitas.
          </p>
        </div>

        {/* ── TOKEN / ACCESS BANNER ── */}
        {user ? (
          <div className={`flex items-center justify-between gap-4 px-5 py-3 rounded-2xl border ${
            isFree
              ? "bg-emerald-500/10 border-emerald-500/30"
              : canPractice
              ? "bg-primary/10 border-primary/30"
              : "bg-amber-500/10 border-amber-500/30"
          }`}>
            <div className="flex items-center gap-3">
              {isFree ? (
                <>
                  <Crown className="h-5 w-5 text-emerald-400 shrink-0" />
                  <span className="text-sm font-bold text-emerald-300">
                    Acceso ilimitado — Paquete Completo activo
                  </span>
                </>
              ) : (
                <>
                  <Ticket className="h-5 w-5 text-primary shrink-0" />
                  <span className="text-sm font-bold text-white">
                    {tokens} tokens · {TOKEN_COST} por sesión
                  </span>
                </>
              )}
            </div>
            {!isFree && !canPractice && (
              <button
                onClick={() => navigate("/tokens#comprar")}
                className="text-xs font-black uppercase tracking-widest text-amber-400 hover:text-amber-300 underline underline-offset-2 shrink-0"
              >
                Comprar tokens →
              </button>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-between gap-4 px-5 py-3 rounded-2xl border bg-white/5 border-white/10">
            <div className="flex items-center gap-3">
              <Lock className="h-5 w-5 text-slate-400 shrink-0" />
              <span className="text-sm font-bold text-slate-300">
                Inicia sesión para practicar · {TOKEN_COST} tokens por subíndice
              </span>
            </div>
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
                        {area.subtemas.map((subtema, sIdx) => {
                          const isLoading =
                            quiz.phase === "loading" &&
                            quiz.subindice === subtema.titulo;
                          return (
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

                              <PracticeButton
                                user={user}
                                isFree={isFree}
                                canPractice={canPractice}
                                isLoading={isLoading}
                                colorBtn={colors.btn}
                                onClick={() => handlePractice(subtema.titulo)}
                              />
                            </div>
                          );
                        })}
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
                  disabled={quiz.phase === "loading"}
                >
                  <ArrowLeft className="h-5 w-5 text-slate-400" />
                </button>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                    Práctica por Subíndice
                  </p>
                  <h2 className="text-lg font-black text-white leading-tight truncate">
                    {quiz.phase !== "idle" && (quiz as any).subindice}
                  </h2>
                </div>
                {quiz.phase === "quiz" && (
                  <span className="shrink-0 text-xs font-black text-slate-500 tabular-nums">
                    {quiz.currentIdx + 1} / {quiz.questions.length}
                  </span>
                )}
              </div>

              {/* Progress bar */}
              {quiz.phase === "quiz" && (
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-300"
                    style={{ width: `${((quiz.currentIdx + (quiz.feedbackIdx !== null ? 1 : 0)) / quiz.questions.length) * 100}%` }}
                  />
                </div>
              )}

              {/* Loading */}
              {quiz.phase === "loading" && (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <Loader2 className="h-10 w-10 text-primary animate-spin" />
                  <p className="text-slate-400 font-medium text-sm">
                    Generando 5 preguntas con IA…
                  </p>
                  <p className="text-slate-600 text-xs">Esto puede tardar 5-10 segundos</p>
                </div>
              )}

              {/* Quiz — one question at a time */}
              {quiz.phase === "quiz" && (() => {
                const q = quiz.questions[quiz.currentIdx];
                const feedbackIdx = quiz.feedbackIdx;
                const isCorrect = feedbackIdx !== null && feedbackIdx === q.correct;

                const optionClass = (idx: number) => {
                  if (feedbackIdx === null) {
                    return "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:border-white/20";
                  }
                  if (idx === q.correct) return "bg-green-500/20 border-green-500/60 text-white";
                  if (idx === feedbackIdx) return "bg-red-500/20 border-red-500/60 text-white";
                  return "bg-white/5 border-white/5 text-slate-500 opacity-40";
                };

                const badgeClass = (idx: number) => {
                  if (feedbackIdx === null) return "bg-white/10 text-slate-400";
                  if (idx === q.correct) return "bg-green-500 text-white";
                  if (idx === feedbackIdx) return "bg-red-500 text-white";
                  return "bg-white/5 text-slate-500";
                };

                return (
                  <div className="space-y-4">
                    {!isFree && quiz.currentIdx === 0 && (
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-600 text-right">
                        −{TOKEN_COST} tokens deducidos
                      </p>
                    )}

                    {/* Question */}
                    <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-5 space-y-4">
                      <p className="text-sm md:text-base font-semibold text-white leading-snug">
                        <span className="text-primary font-black mr-2">{quiz.currentIdx + 1}.</span>
                        {q.question}
                      </p>

                      {/* Options */}
                      <div className="space-y-3">
                        {q.options.map((opt, oIdx) => (
                          <button
                            key={oIdx}
                            onClick={() => handleSelectOption(oIdx)}
                            disabled={feedbackIdx !== null}
                            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 border flex items-center gap-3 disabled:cursor-default ${optionClass(oIdx)}`}
                          >
                            <span className={`h-7 w-7 rounded-lg flex items-center justify-center font-black text-xs shrink-0 transition-colors ${badgeClass(oIdx)}`}>
                              {String.fromCharCode(65 + oIdx)}
                            </span>
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Immediate feedback panel — appears after selecting */}
                    <AnimatePresence>
                      {feedbackIdx !== null && (
                        <motion.div
                          key="feedback"
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className={`rounded-2xl p-5 border ${
                            isCorrect
                              ? "bg-green-500/15 border-green-500/40"
                              : "bg-red-500/15 border-red-500/40"
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            {isCorrect
                              ? <CheckCircle2 className="h-5 w-5 text-green-400 shrink-0" />
                              : <XSquare className="h-5 w-5 text-red-400 shrink-0" />
                            }
                            <p className={`font-black text-base ${isCorrect ? "text-green-300" : "text-red-300"}`}>
                              {isCorrect
                                ? "¡Correcto!"
                                : `Incorrecto. La respuesta correcta es: ${q.options[q.correct]}`
                              }
                            </p>
                          </div>
                          <p className="text-slate-300 text-sm leading-relaxed">
                            {q.explanation}
                          </p>

                          {/* Next / Finish button */}
                          <button
                            onClick={handleNext}
                            className="mt-4 w-full bg-violet-600 hover:bg-violet-500 active:scale-95 text-white font-black text-[11px] uppercase tracking-widest px-6 py-3 rounded-xl transition-all"
                          >
                            {quiz.currentIdx === quiz.questions.length - 1
                              ? "Ver resultados finales"
                              : "Siguiente pregunta →"}
                          </button>

                          {/* Ask Tutor — only on wrong answers, exact SimuladorPro pattern */}
                          {!isCorrect && (
                            <button
                              onClick={() => askTutor(q.question, q.options[q.correct], q.explanation)}
                              className="mt-2 w-full bg-gradient-to-r from-violet-500/20 to-purple-500/20 border border-violet-500/40 hover:border-violet-400/60 text-violet-300 hover:text-violet-200 font-bold text-[11px] py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-95"
                            >
                              🧠 Preguntar al Tutor IA
                            </button>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })()}

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

// ── Sub-components ──────────────────────────────────────────────────

interface PracticeButtonProps {
  user: unknown;
  isFree: boolean;
  canPractice: boolean;
  isLoading: boolean;
  colorBtn: string;
  onClick: () => void;
}

function PracticeButton({ user, isFree, canPractice, isLoading, colorBtn, onClick }: PracticeButtonProps) {
  if (isLoading) {
    return (
      <div className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/5 text-slate-500 text-xs font-bold shrink-0">
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
        Generando…
      </div>
    );
  }

  if (!user) {
    return (
      <button
        onClick={onClick}
        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white text-xs font-bold shrink-0 transition-colors border border-white/10"
      >
        <Lock className="h-3 w-3" />
        Iniciar sesión
      </button>
    );
  }

  if (!canPractice) {
    return (
      <button
        onClick={onClick}
        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500/10 text-amber-400 text-xs font-bold shrink-0 border border-amber-500/20 cursor-not-allowed opacity-60"
        disabled
      >
        <Lock className="h-3 w-3" />
        Sin tokens
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-white text-xs font-black uppercase tracking-wide shrink-0 transition-all hover:scale-105 active:scale-95 shadow-sm ${colorBtn}`}
    >
      <Zap className="h-3 w-3" />
      {isFree ? "Practicar" : `Practicar · 10 🪙`}
    </button>
  );
}
