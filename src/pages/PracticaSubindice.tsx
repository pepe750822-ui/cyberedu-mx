import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ChevronDown,
  Zap,
  Crown,
  Check,
  X,
  CheckCircle2,
  XSquare,
  ArrowLeft,
  Lock,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { areas, colorMap } from "@/data/temarioData";

import españolData from "@/data/practica/espanol.json";
import habilidadVerbalData from "@/data/practica/habilidad-verbal.json";
import matematicasData from "@/data/practica/matematicas.json";
import habilidadMateData from "@/data/practica/habilidad-matematica.json";
import biologiaData from "@/data/practica/biologia.json";
import fisicaData from "@/data/practica/fisica.json";
import quimicaData from "@/data/practica/quimica.json";
import historiaData from "@/data/practica/historia.json";
import geografiaData from "@/data/practica/geografia.json";
import civicaData from "@/data/practica/formacion-civica-y-etica.json";

interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

// Genera slug igual que el script generador
function createSlug(text: string): string {
  return text.toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Build lookup: slug → questions[]
const staticBank: Record<string, QuizQuestion[]> = {};
for (const bank of [
  españolData, habilidadVerbalData, matematicasData, habilidadMateData,
  biologiaData, fisicaData, quimicaData, historiaData, geografiaData, civicaData,
] as Record<string, { questions: QuizQuestion[] }>[]) {
  for (const [slug, data] of Object.entries(bank)) {
    if (data?.questions) staticBank[slug] = data.questions;
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
  const { user, profile, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [openArea, setOpenArea] = useState<number | null>(null);
  const [quiz, setQuiz] = useState<QuizPhase>({ phase: "idle" });

  const isFree =
    (profile as any)?.paquete_completo === true ||
    (profile as any)?.subscription_status === "active" ||
    (profile as any)?.is_premium === true;

  const hasUnlimitedAccess =
    (profile as any)?.practica_ilimitada === true ||
    (profile as any)?.paquete_completo === true ||
    (profile as any)?.subscription_status === "active" ||
    (profile as any)?.is_premium === true;

  const [lockModal, setLockModal] = useState(false);
  const [unlocking, setUnlocking] = useState(false);

  // Pre-compute unlock status per [areaIdx][subIdx][contenidoIdx]
  const unlockMap = useMemo(() =>
    areas.map(area => {
      let n = 0;
      return area.subtemas.map(sub =>
        sub.contenido.map(() => {
          const idx = n++;
          if (!user) return false;
          if (hasUnlimitedAccess) return true;
          return idx < 10;
        })
      );
    }),
    [user, hasUnlimitedAccess]
  );

  const handleUnlock = async () => {
    if (!user || !profile) { navigate("/auth?ref=practica-subindice"); return; }
    const balance = profile.tokens ?? 0;
    if (balance < 100) { navigate("/tokens"); return; }
    setUnlocking(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ practica_ilimitada: true, tokens: balance - 100, updated_at: new Date().toISOString() })
        .eq("id", user.id);
      if (error) throw error;
      await refreshProfile();
      setLockModal(false);
      toast.success("¡Desbloqueado! Acceso ilimitado a los 371 subíndices. 🎉");
    } catch {
      toast.error("Error al desbloquear. Intenta de nuevo.");
    } finally {
      setUnlocking(false);
    }
  };

  const toggleArea = (i: number) =>
    setOpenArea((prev) => (prev === i ? null : i));

  const handlePractice = (concepto: string) => {
    const slug = createSlug(concepto.split(":")[0]);
    const questions = staticBank[slug];
    if (!questions || questions.length === 0) return;

    const randomizedQuestions = shuffleArray(questions).map(shuffleQuizQuestion);

    setQuiz({
      phase: "quiz",
      subindice: concepto.split(":")[0],
      questions: randomizedQuestions,
      answers: new Array(randomizedQuestions.length).fill(null),
    });
  };

  const handleSelectOption = (qIdx: number, aIdx: number) => {
    if (quiz.phase !== "quiz") return;
    if (quiz.answers[qIdx] !== null) return;
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
        {/* ── BACK TO HOME ── */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-1.5 text-sm font-bold text-slate-400 hover:text-white transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
          Inicio
        </button>

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
        {!user ? (
          <div className="flex items-center justify-between gap-4 px-5 py-4 rounded-2xl border bg-violet-500/10 border-violet-500/30">
            <div className="flex items-center gap-3">
              <Lock className="h-5 w-5 text-violet-400 shrink-0" />
              <div>
                <p className="text-sm font-black text-white">Crea tu cuenta gratis para practicar</p>
                <p className="text-xs text-slate-400 mt-0.5">Los primeros 10 subíndices de cada materia son gratuitos</p>
              </div>
            </div>
            <button
              onClick={() => navigate("/auth?ref=practica-subindice")}
              className="text-xs font-black uppercase tracking-widest px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white shrink-0 transition-colors"
            >
              Registrarse →
            </button>
          </div>
        ) : hasUnlimitedAccess ? (
          <div className="flex items-center gap-3 px-5 py-3 rounded-2xl border bg-emerald-500/10 border-emerald-500/30">
            <Crown className="h-5 w-5 text-emerald-400 shrink-0" />
            <span className="text-sm font-bold text-emerald-300">
              Acceso ilimitado activo — 371 subíndices desbloqueados
            </span>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-4 px-5 py-3 rounded-2xl border bg-amber-500/10 border-amber-500/30">
            <div className="flex items-center gap-3">
              <Lock className="h-4 w-4 text-amber-400 shrink-0" />
              <span className="text-sm font-bold text-amber-300">
                10 subíndices gratis por materia — desbloquea los 371 completos
              </span>
            </div>
            <button
              onClick={() => setLockModal(true)}
              className="text-xs font-black uppercase tracking-widest text-amber-300 hover:text-amber-200 underline underline-offset-2 shrink-0 transition-colors"
            >
              100 tokens →
            </button>
          </div>
        )}

        {/* ── TEMARIO ── */}
        <div className="space-y-3">
          {areas.map((area, aIdx) => {
            const colors = colorMap[area.color] ?? colorMap.blue;
            const isOpen = openArea === aIdx;
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
                      ({area.subtemas.reduce((acc, s) => acc + s.contenido.length, 0)} subíndices)
                    </span>
                  </span>
                  <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center"
                  >
                    <ChevronDown className="h-4 w-4 opacity-80" />
                  </motion.span>
                </button>

                {/* Subtemas + Subíndices individuales */}
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
                      {area.subtemas.map((subtema, sIdx) => (
                        <div key={sIdx}>
                          {/* Encabezado del subtema */}
                          <div className="px-5 py-2 bg-white/3 border-t border-white/5">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                              {subtema.titulo}
                            </p>
                          </div>
                          {/* Cada concepto clave */}
                          <div className="divide-y divide-white/5">
                            {subtema.contenido.map((concepto, cIdx) => {
                              const slug = createSlug(concepto.split(":")[0]);
                              const hasQuestions = !!staticBank[slug];
                              const label = concepto.split(":")[0];
                              const unlocked = unlockMap[aIdx]?.[sIdx]?.[cIdx] ?? false;

                              if (!user) {
                                return (
                                  <div
                                    key={cIdx}
                                    className="flex items-center justify-between px-5 py-3 gap-4 opacity-60"
                                  >
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium text-white leading-snug">{label}</p>
                                    </div>
                                    <button
                                      onClick={() => navigate("/auth?ref=practica-subindice")}
                                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 text-slate-400 text-xs font-black uppercase tracking-wide shrink-0 hover:bg-white/15 transition-all"
                                    >
                                      <Lock className="h-3 w-3" />
                                      Entrar
                                    </button>
                                  </div>
                                );
                              }

                              if (!unlocked) {
                                return (
                                  <div
                                    key={cIdx}
                                    className="flex items-center justify-between px-5 py-3 gap-4 opacity-50 hover:opacity-70 transition-opacity cursor-pointer"
                                    onClick={() => setLockModal(true)}
                                  >
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium text-white leading-snug">{label}</p>
                                      {concepto.includes(":") && (
                                        <p className="text-[11px] text-slate-500 mt-0.5 leading-snug line-clamp-1">
                                          {concepto.split(":").slice(1).join(":").trim()}
                                        </p>
                                      )}
                                    </div>
                                    <span className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-500 text-xs font-black uppercase tracking-wide shrink-0">
                                      <Lock className="h-3 w-3" />
                                      Bloqueado
                                    </span>
                                  </div>
                                );
                              }

                              return (
                                <div
                                  key={cIdx}
                                  className="flex items-center justify-between px-5 py-3 gap-4 hover:bg-white/3 transition-colors"
                                >
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-white leading-snug">
                                      {label}
                                    </p>
                                    {concepto.includes(":") && (
                                      <p className="text-[11px] text-slate-500 mt-0.5 leading-snug line-clamp-1">
                                        {concepto.split(":").slice(1).join(":").trim()}
                                      </p>
                                    )}
                                  </div>

                                  <button
                                    onClick={() => handlePractice(concepto)}
                                    disabled={!hasQuestions}
                                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-white text-xs font-black uppercase tracking-wide shrink-0 transition-all hover:scale-105 active:scale-95 shadow-sm disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100 ${colors.btn}`}
                                  >
                                    <Zap className="h-3 w-3" />
                                    Practicar
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
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
              <div className="space-y-2">
                <button
                  onClick={() => setQuiz({ phase: "idle" })}
                  className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors group"
                >
                  <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" />
                  Volver a Práctica por Tema
                </button>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                    Práctica por Subíndice
                  </p>
                  <h2 className="text-lg font-black text-white leading-tight">
                    {(quiz as any).subindice}
                  </h2>
                </div>
              </div>

              {/* Progress bar and Quiz — all questions at once */}
              {quiz.phase === "quiz" && (
                <div className="space-y-8">
                  {quiz.questions.map((q, qIdx) => {
                    const selectedIdx = quiz.answers[qIdx];
                    const answered = selectedIdx !== null;
                    const isCorrect = answered && selectedIdx === q.correct;

                    return (
                      <div key={qIdx} className="bg-slate-900/80 border border-white/10 rounded-2xl p-5 space-y-4">
                        <p className="text-sm md:text-base font-semibold text-white leading-snug">
                          <span className="text-primary font-black mr-2">{qIdx + 1}.</span>
                          {q.question}
                        </p>

                        {/* Options */}
                        <div className="space-y-3">
                          {q.options.map((opt, oIdx) => {
                            let optionClass: string;
                            let badgeClass: string;
                            if (!answered) {
                              optionClass = "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:border-white/20";
                              badgeClass = "bg-white/10 text-slate-400";
                            } else if (oIdx === q.correct) {
                              optionClass = "bg-green-500/20 border-green-500/60 text-white";
                              badgeClass = "bg-green-500 text-white";
                            } else if (oIdx === selectedIdx) {
                              optionClass = "bg-red-500/20 border-red-500/60 text-white";
                              badgeClass = "bg-red-500 text-white";
                            } else {
                              optionClass = "bg-white/5 border-white/5 text-slate-500 opacity-40";
                              badgeClass = "bg-white/5 text-slate-500";
                            }

                            return (
                              <button
                                key={oIdx}
                                onClick={() => handleSelectOption(qIdx, oIdx)}
                                disabled={answered}
                                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 border flex items-center gap-3 disabled:cursor-default ${optionClass}`}
                              >
                                <span className={`h-7 w-7 rounded-lg flex items-center justify-center font-black text-xs shrink-0 transition-colors ${badgeClass}`}>
                                  {String.fromCharCode(65 + oIdx)}
                                </span>
                                {opt}
                              </button>
                            );
                          })}
                        </div>

                        {/* Inline feedback + always-visible tutor button */}
                        {answered && (
                          <div className={`rounded-xl p-4 border ${isCorrect ? "bg-green-500/15 border-green-500/40" : "bg-red-500/15 border-red-500/40"}`}>
                            <div className="flex items-center gap-2 mb-2">
                              {isCorrect
                                ? <CheckCircle2 className="h-4 w-4 text-green-400 shrink-0" />
                                : <XSquare className="h-4 w-4 text-red-400 shrink-0" />
                              }
                              <p className={`font-black text-sm ${isCorrect ? "text-green-300" : "text-red-300"}`}>
                                {isCorrect ? "¡Correcto!" : `Incorrecto — correcta: ${q.options[q.correct]}`}
                              </p>
                            </div>
                            <p className="text-slate-300 text-xs leading-relaxed">{q.explanation}</p>
                            <button
                              onClick={() => askTutor(q.question, q.options[q.correct], q.explanation)}
                              className="mt-3 w-full bg-gradient-to-r from-violet-500/20 to-purple-500/20 border border-violet-500/40 hover:border-violet-400/60 text-violet-300 hover:text-violet-200 font-bold text-[11px] py-2 rounded-xl flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-95"
                            >
                              🧠 Preguntar al Tutor IA
                            </button>
                          </div>
                        )}
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

                        <div className="pl-9">
                          <button
                            onClick={() => askTutor(q.question, q.options[q.correct], q.explanation)}
                            className="w-full bg-gradient-to-r from-violet-500/20 to-purple-500/20 border border-violet-500/40 hover:border-violet-400/60 text-violet-300 hover:text-violet-200 font-bold text-[11px] py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-95"
                          >
                            🧠 Preguntar al Tutor IA
                          </button>
                        </div>
                      </div>
                    );
                  })}

                  {/* Actions */}
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <button
                        onClick={() => setQuiz({ phase: "idle" })}
                        className="flex-1 h-12 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-sm transition-colors flex items-center justify-center gap-2"
                      >
                        <ArrowLeft className="h-4 w-4" />
                        Volver a Práctica por Tema
                      </button>
                      <button
                        onClick={() => setQuiz({ phase: "idle" })}
                        className="flex-1 h-12 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-sm transition-colors"
                      >
                        Practicar otro tema
                      </button>
                    </div>
                    <button
                      onClick={() => { const slug = createSlug((quiz as any).subindice); const qs = staticBank[slug]; if (qs) setQuiz({ phase: "quiz", subindice: (quiz as any).subindice, questions: shuffleArray(qs).map(shuffleQuizQuestion), answers: new Array(qs.length).fill(null) }); }}
                      className="w-full h-12 rounded-xl bg-primary hover:bg-primary/80 text-white font-black uppercase tracking-wide text-xs transition-colors shadow-lg shadow-primary/20"
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

      {/* ── LOCK MODAL ── */}
      <AnimatePresence>
        {lockModal && (
          <motion.div
            key="lock-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-slate-950/90 backdrop-blur-sm flex items-center justify-center px-4"
            onClick={() => setLockModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-sm bg-slate-900 border border-white/10 rounded-3xl p-6 space-y-5 shadow-2xl"
            >
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-amber-500/20 border border-amber-500/30">
                  <Lock className="h-6 w-6 text-amber-400" />
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">Acceso bloqueado</p>
                  <h3 className="text-lg font-black text-white leading-tight">Práctica Ilimitada por Tema</h3>
                </div>
              </div>

              <div className="space-y-2">
                {["371 subíndices del temario oficial ECOEMS", "1,855 preguntas de opción múltiple", "Preguntas y opciones aleatorizadas", "Acceso permanente — pago único"].map(f => (
                  <div key={f} className="flex items-center gap-2 text-xs text-slate-300">
                    <Check className="h-3 w-3 text-amber-400 shrink-0" />
                    {f}
                  </div>
                ))}
              </div>

              <div className="bg-white/5 rounded-2xl px-4 py-3 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-semibold">Tu balance actual</span>
                <span className="text-sm font-black text-white">{profile?.tokens ?? 0} tokens</span>
              </div>

              <div className="space-y-2">
                {(profile?.tokens ?? 0) >= 100 ? (
                  <button
                    onClick={handleUnlock}
                    disabled={unlocking}
                    className="w-full h-12 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:opacity-90 text-white font-black uppercase text-xs tracking-widest shadow-lg shadow-amber-500/20 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {unlocking
                      ? <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      : <>🔓 Desbloquear — 100 tokens</>
                    }
                  </button>
                ) : (
                  <button
                    onClick={() => { setLockModal(false); navigate("/tokens"); }}
                    className="w-full h-12 rounded-2xl bg-violet-600 hover:bg-violet-500 text-white font-black uppercase text-xs tracking-widest transition-all flex items-center justify-center gap-2"
                  >
                    Obtener tokens →
                  </button>
                )}
                <button
                  onClick={() => setLockModal(false)}
                  className="w-full h-10 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 font-bold text-sm transition-colors"
                >
                  Ahora no
                </button>
              </div>
            </motion.div>
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
