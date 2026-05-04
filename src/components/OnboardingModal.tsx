import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { X, Bot, Zap, Trophy, ChevronRight } from "lucide-react";

const STORAGE_KEY = "cyberedu_onboarding_done";

const markDone = async (userId: string) => {
  localStorage.setItem(STORAGE_KEY, "1");
  await supabase
    .from("profiles")
    .update({ onboarding_completed: true } as any)
    .eq("id", userId);
};

const steps = [
  {
    emoji: "🎯",
    title: "¡Bienvenido a CyberEdu MX!",
    subtitle: "Tu preparación para el ECOEMS y COMIPEMS empieza aquí",
    body: (
      <div className="grid grid-cols-3 gap-3 mt-4">
        {[
          { icon: <Zap className="h-5 w-5 text-amber-400" />, label: "Simuladores inteligentes" },
          { icon: <Bot className="h-5 w-5 text-violet-400" />, label: "Tutor IA 24/7" },
          { icon: <Trophy className="h-5 w-5 text-emerald-400" />, label: "Seguimiento de progreso" },
        ].map(({ icon, label }) => (
          <div key={label} className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white/5 border border-white/10">
            {icon}
            <span className="text-xs text-slate-300 text-center leading-tight">{label}</span>
          </div>
        ))}
      </div>
    ),
    cta: "Siguiente →",
  },
  {
    emoji: "🤖",
    title: "Conoce a tu Tutor IA",
    subtitle: "CyberAgent explica cualquier tema del examen en segundos",
    body: (
      <div className="mt-4 space-y-2">
        <div className="flex items-start gap-2">
          <div className="h-7 w-7 rounded-lg bg-violet-600 flex items-center justify-center shrink-0">
            <span className="text-xs">Tú</span>
          </div>
          <div className="bg-white/10 rounded-xl rounded-tl-none px-3 py-2 text-sm text-slate-200 max-w-[80%]">
            No entiendo la Ley de Boyle, ¿me la explicas?
          </div>
        </div>
        <div className="flex items-start gap-2 flex-row-reverse">
          <div className="h-7 w-7 rounded-lg bg-violet-500/30 border border-violet-500/50 flex items-center justify-center shrink-0">
            <Bot className="h-4 w-4 text-violet-300" />
          </div>
          <div className="bg-violet-600/20 border border-violet-500/30 rounded-xl rounded-tr-none px-3 py-2 text-sm text-violet-100 max-w-[80%]">
            ¡Claro! La Ley de Boyle dice que a temperatura constante, la presión y el volumen de un gas son inversamente proporcionales: <strong>P·V = cte</strong>. Si comprimes el gas a la mitad, la presión se duplica. 🔬
          </div>
        </div>
        <p className="text-xs text-slate-500 text-center pt-1">Responde en segundos · Gratuito · Sin límites de temas</p>
      </div>
    ),
    cta: "Siguiente →",
  },
  {
    emoji: "🚀",
    title: "¡Estás listo para empezar!",
    subtitle: "Haz tu primera pregunta al Tutor IA ahora mismo",
    body: (
      <div className="mt-4 p-4 rounded-xl bg-gradient-to-br from-violet-600/20 to-indigo-600/20 border border-violet-500/30 text-center">
        <p className="text-slate-300 text-sm">Puedes preguntar cualquier cosa:</p>
        <ul className="mt-2 space-y-1 text-sm text-violet-200">
          <li>• Explicaciones de temas del examen</li>
          <li>• Resolver ejercicios paso a paso</li>
          <li>• Entender por qué fallaste en el simulador</li>
        </ul>
      </div>
    ),
    cta: "Hacer mi primera pregunta al Tutor →",
  },
];

export default function OnboardingModal() {
  const { user, refreshProfile } = useAuth();
  const [step, setStep] = useState(0);
  const [closing, setClosing] = useState(false);

  if (!user) return null;

  const current = steps[step];
  const isLast = step === steps.length - 1;

  const close = async (openChat = false) => {
    setClosing(true);
    await markDone(user.id);
    await refreshProfile();
    if (openChat) {
      setTimeout(() => {
        window.dispatchEvent(
          new CustomEvent("cyberedu:open-chat", {
            detail: { message: "Hola, acabo de registrarme. ¿Qué temas cubre el examen ECOEMS?" },
          })
        );
      }, 300);
    }
  };

  const handleCta = () => {
    if (isLast) {
      close(true);
    } else {
      setStep((s) => s + 1);
    }
  };

  return (
    <div
      className={`fixed inset-0 z-[200] flex items-center justify-center p-4 transition-opacity duration-300 ${
        closing ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => close(false)} />

      {/* Modal */}
      <div
        className={`relative w-full max-w-sm bg-[#0f1629]/95 border border-white/10 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 ${
          closing ? "scale-95 opacity-0" : "scale-100 opacity-100"
        }`}
      >
        {/* Gradient top bar */}
        <div className="h-1 w-full bg-gradient-to-r from-violet-600 via-indigo-500 to-cyan-500" />

        {/* Skip button */}
        <button
          onClick={() => close(false)}
          className="absolute top-3 right-3 p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-all"
          aria-label="Saltar"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Content */}
        <div className="p-6 pt-5">
          {/* Step dots */}
          <div className="flex gap-1.5 mb-4">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`h-1 rounded-full transition-all duration-300 ${
                  i === step ? "w-6 bg-violet-500" : i < step ? "w-3 bg-violet-700" : "w-3 bg-white/10"
                }`}
              />
            ))}
          </div>

          <div className="text-3xl mb-3">{current.emoji}</div>
          <h2 className="text-white font-bold text-xl leading-tight">{current.title}</h2>
          <p className="text-slate-400 text-sm mt-1">{current.subtitle}</p>

          {current.body}

          {/* Actions */}
          <div className="mt-6 flex flex-col gap-2">
            <button
              onClick={handleCta}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold py-3 px-4 rounded-xl transition-all text-sm"
            >
              {current.cta}
              {!isLast && <ChevronRight className="h-4 w-4" />}
            </button>
            <button
              onClick={() => close(false)}
              className="w-full text-slate-500 hover:text-slate-300 text-xs py-1.5 transition-colors"
            >
              Saltar introducción
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
