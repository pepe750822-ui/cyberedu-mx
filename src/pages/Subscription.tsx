import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Check, 
  Zap, 
  Crown, 
  GraduationCap, 
  Sparkles, 
  ArrowLeft, 
  Rocket, 
  ShieldCheck, 
  Clock, 
  Trophy,
  BrainCircuit,
  Bot
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

declare global {
  interface Window {
    MercadoPago: any;
    mp: any;
  }
}

const plans = [
  {
    id: "mensual",
    name: "Guerrero Mensual",
    price: 50,
    period: "mes",
    description: "Ideal para un empujón final antes del examen.",
    features: [
      "AITutor ilimitado (Claude 3.5 Sonnet)",
      "Análisis de rendimiento avanzado",
      "Simuladores Pro sin límites",
      "Soporte prioritario",
    ],
    highlight: false,
    icon: <Zap className="h-6 w-6 text-blue-400" />
  },
  {
    id: "trimestral",
    name: "Estratega Trimestral",
    price: 120,
    period: "3 meses",
    description: "La mejor relación calidad-precio para tu preparación.",
    features: [
      "Todo lo del plan mensual",
      "Ahorro del 20% vs mensual",
      "Planes de estudio personalizados",
      "Acceso a webinars exclusivos",
    ],
    highlight: true,
    badge: "Más popular",
    icon: <Crown className="h-6 w-6 text-amber-400" />
  },
  {
    id: "anual",
    name: "Maestro Anual",
    price: 399,
    period: "año",
    description: "Dominio total. Acceso completo hasta el 2027.",
    features: [
      "Todo lo del plan trimestral",
      "Ahorro del 33% vs mensual",
      "Certificado de finalización CyberEdu",
      "Acceso a todas las futuras materias",
    ],
    highlight: false,
    icon: <Rocket className="h-6 w-6 text-primary" />
  }
];

const Subscription = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [preferenceId, setPreferenceId] = useState<string | null>(null);

  useEffect(() => {
    // Cargar SDK de Mercado Pago
    const script = document.createElement("script");
    script.src = "https://sdk.mercadopago.com/js/v2";
    script.async = true;
    script.onload = () => {
      if (window.MercadoPago) {
        window.mp = new window.MercadoPago(import.meta.env.VITE_MP_PUBLIC_KEY, {
          locale: 'es-MX'
        });
      }
    };
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleCheckout = async (planId: string) => {
    if (!user) {
      toast.error("Debes iniciar sesión para suscribirte");
      navigate("/auth");
      return;
    }

    setLoadingPlan(planId);
    try {
      const response = await fetch("/api/create-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId,
          userId: user.id,
          userEmail: user.email
        })
      });

      const data = await response.json();
      if (data.id) {
        renderCheckoutButton(data.id);
        setSelectedPlan(planId);
      } else {
        throw new Error(data.error || "No se pudo crear la preferencia de pago");
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoadingPlan(null);
    }
  };

  const renderCheckoutButton = (prefId: string) => {
    const container = document.getElementById("walletBrick_container");
    if (container) container.innerHTML = ""; // Limpiar previo

    if (window.mp) {
      const bricksBuilder = window.mp.bricks();
      bricksBuilder.create("wallet", "walletBrick_container", {
        initialization: {
          preferenceId: prefId,
          redirectMode: "modal"
        },
        customization: {
          texts: {
            valueProp: 'smart_option',
          },
        },
      });
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col p-4 md:p-8 cyber-grid">
      {/* Decorative Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto w-full z-10 space-y-12">
        {/* Header */}
        <div className="flex flex-col items-center text-center space-y-4 animate-in fade-in slide-in-from-top-4 duration-700">
          <Button 
            variant="ghost" 
            size="sm" 
            className="self-start text-slate-400 hover:text-white"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Volver al Inicio
          </Button>
          
          <div className="p-3 rounded-2xl bg-primary/20 border border-primary/30 card-shadow">
            <Bot className="h-10 w-10 text-primary" />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white">
              Suscripción <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Premium</span>
            </h1>
            <p className="text-xl text-slate-400 font-medium max-w-2xl mx-auto">
              Libera el poder total del <span className="text-white font-bold">AITutor</span> y acelera tu aprendizaje para el ECOEMS 2026.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 mt-4">
            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 px-3 py-1">
              <Check className="h-3 w-3 mr-1" /> Videos gratis
            </Badge>
            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 px-3 py-1">
              <Check className="h-3 w-3 mr-1" /> Quizzes ilimitados
            </Badge>
            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 px-3 py-1">
              <Check className="h-3 w-3 mr-1" /> Guías descargables
            </Badge>
          </div>
        </div>

        {/* Info Box */}
        <div className="glass-card-premium p-6 rounded-2xl border-amber-500/20 bg-amber-500/5 animate-in fade-in duration-1000 delay-200">
          <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
            <div className="p-3 rounded-full bg-amber-500/20">
              <Clock className="h-6 w-6 text-amber-500" />
            </div>
            <div>
              <p className="text-amber-200 font-bold uppercase tracking-wider text-sm">Tu periodo de prueba</p>
              <p className="text-slate-400 text-sm">
                Recuerda que tienes <span className="text-white font-bold">7 días de acceso completo</span> gratis al registrarte. 
                Suscríbete ahora para no perder el progreso con el Mentor IA.
              </p>
            </div>
          </div>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, idx) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * (idx + 3) }}
            >
              <Card className={cn(
                "relative h-full flex flex-col overflow-hidden transition-all duration-500 hover:scale-[1.02]",
                "glass-card-premium rounded-[2rem] border-white/10",
                plan.highlight && "border-primary/40 card-shadow pulse-subtle bg-primary/5"
              )}>
                {plan.badge && (
                  <div className="absolute top-6 right-[-35px] rotate-45 bg-primary text-white text-[10px] font-black uppercase py-1 px-10 shadow-xl z-20">
                    {plan.badge}
                  </div>
                )}

                <CardHeader className="p-8 pb-4">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                      {plan.icon}
                    </div>
                  </div>
                  <CardTitle className="text-2xl font-black uppercase tracking-tight text-white">{plan.name}</CardTitle>
                  <CardDescription className="text-slate-400 text-sm min-h-[40px]">{plan.description}</CardDescription>
                </CardHeader>

                <CardContent className="p-8 pt-0 flex-grow space-y-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-black text-white">${plan.price}</span>
                    <span className="text-slate-500 font-bold">/ {plan.period}</span>
                  </div>

                  <div className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="text-slate-300 text-sm font-medium leading-tight">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>

                <CardFooter className="p-8 pt-0">
                  <Button 
                    className={cn(
                      "w-full h-14 rounded-2xl font-black uppercase tracking-widest text-xs transition-all",
                      plan.highlight ? "bg-primary hover:bg-primary/80" : "bg-white/10 hover:bg-white/20 border-white/10"
                    )}
                    onClick={() => handleCheckout(plan.id)}
                    disabled={loadingPlan === plan.id}
                  >
                    {loadingPlan === plan.id ? (
                      <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      "Elegir plan"
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Mercado Pago Container */}
        <AnimatePresence>
          {selectedPlan && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            >
              <div className="glass-card-premium p-8 rounded-[2rem] max-w-md w-full border-primary/30 relative">
                <button 
                  onClick={() => setSelectedPlan(null)}
                  className="absolute top-6 right-6 text-slate-500 hover:text-white"
                >
                  <Clock className="h-6 w-6 rotate-45" />
                </button>
                
                <div className="text-center space-y-6">
                  <div className="mx-auto w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center">
                    <ShieldCheck className="h-8 w-8 text-emerald-400" />
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-white uppercase tracking-tight">Finalizar Suscripción</h3>
                    <p className="text-slate-400 text-sm">
                      Estás seleccionando el <span className="text-primary font-bold">{plans.find(p => p.id === selectedPlan)?.name}</span>. 
                      Pago procesado de forma segura por Mercado Pago.
                    </p>
                  </div>

                  <div id="walletBrick_container" className="min-h-[60px] flex items-center justify-center">
                    {/* Mercado Pago Wallet Brick will render here */}
                    <div className="flex flex-col items-center gap-2">
                      <div className="h-8 w-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
                      <p className="text-xs text-slate-500 animate-pulse uppercase tracking-widest font-black">Cargando pasarela...</p>
                    </div>
                  </div>
                  
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                    Seguridad SSL 256-bit integrada
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Trust Footer */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-white/5 opacity-60">
          <div className="flex flex-col items-center gap-2 text-center">
             <Trophy className="h-5 w-5 text-amber-500" />
             <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Líderes en ingreso</span>
          </div>
          <div className="flex flex-col items-center gap-2 text-center">
             <BrainCircuit className="h-5 w-5 text-blue-500" />
             <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Modelos GPT-4.5/Claude</span>
          </div>
          <div className="flex flex-col items-center gap-2 text-center">
             <ShieldCheck className="h-5 w-5 text-emerald-500" />
             <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Pago 100% Protegido</span>
          </div>
          <div className="flex flex-col items-center gap-2 text-center">
             <Rocket className="h-5 w-5 text-primary" />
             <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Acceso Inmediato</span>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .pulse-subtle {
          animation: border-pulse 4s infinite ease-in-out;
        }
        @keyframes border-pulse {
          0%, 100% { border-color: rgba(var(--primary), 0.2); box-shadow: 0 0 20px rgba(var(--primary), 0); }
          50% { border-color: rgba(var(--primary), 0.5); box-shadow: 0 0 40px rgba(var(--primary), 0.15); }
        }
        .cyber-grid {
          background-image: 
            radial-gradient(circle at 2px 2px, rgba(255,255,255,0.02) 1px, transparent 0);
          background-size: 40px 40px;
        }
      `}} />
    </div>
  );
};

export default Subscription;

// Helper to use cn without importing many things if utils is available
function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
