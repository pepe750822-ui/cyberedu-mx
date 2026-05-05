import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Ticket,
  Check,
  ShieldCheck,
  Rocket,
  Zap,
  Crown,
  Star,
  Info,
  Send,
  Chrome,
  Lock,
  Bell
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { usePushNotifications } from "@/hooks/usePushNotifications";

const tokenPackages = [
  {
    id: "basico",
    name: "Básico",
    tokens: 20,
    price: 20,
    pricePerToken: 1.00,
    badge: "Lanzamiento",
    badgeColor: "bg-primary",
    icon: <Ticket className="h-6 w-6 text-slate-400" />,
    description: "Ideal para dudas rápidas.",
    urgency: "Ideal para empezar hoy",
  },
  {
    id: "popular",
    name: "Popular",
    tokens: 60,
    price: 50,
    pricePerToken: 0.83,
    highlight: true,
    badge: "MÁS POPULAR",
    badgeColor: "bg-violet-600",
    icon: <Star className="h-6 w-6 text-amber-500" />,
    description: "El balance perfecto para estudiar.",
    urgency: "El preferido de quienes aprueban",
  },
  {
    id: "pro",
    name: "Pro",
    tokens: 160,
    price: 120,
    pricePerToken: 0.75,
    icon: <Rocket className="h-6 w-6 text-primary" />,
    description: "Para estudiantes intensivos.",
    urgency: "Para los que van en serio",
  }
];

const unlimitedPackage = {
    id: "ilimitado",
    name: "Ilimitado",
    tokens: 1000,
    price: 250,
    pricePerToken: 0.25,
    description: "1,000 tokens al mes · Se renueva automáticamente",
    icon: <Crown className="h-8 w-8 text-amber-500" />
};

const EXAM_DATE = new Date("2026-06-20T08:00:00");

const TokensPage = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [loadingPkg, setLoadingPkg] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const [pendingQuestionMsg, setPendingQuestionMsg] = useState<string | null>(null);
  const [linkingCode, setLinkingCode] = useState("");
  const [isLinking, setIsLinking] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [subscribing, setSubscribing] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const { subscribe } = usePushNotifications();

  const examDays = useMemo(() => {
    const diff = EXAM_DATE.getTime() - Date.now();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }, []);

  useEffect(() => {
    const raw = localStorage.getItem('cyberedu_pending_question');
    if (raw) {
      try {
        const { timestamp } = JSON.parse(raw);
        if (Date.now() - timestamp < 1800000) {
          setPendingQuestionMsg("Tu pregunta está guardada. En cuanto tengas tokens la respondemos automáticamente.");
        }
      } catch { /* ignore */ }
    }
  }, []);

  // Mostrar feedback cuando el usuario regresa de Mercado Pago
  useEffect(() => {
    const status = searchParams.get('status');
    if (status === 'success') {
      toast.success('¡Pago exitoso! Tus tokens se acreditarán en breve. 🎉', { duration: 6000 });
    } else if (status === 'failure') {
      toast.error('El pago no fue procesado. Intenta nuevamente.', { duration: 5000 });
    } else if (status === 'pending') {
      toast.info('Tu pago está pendiente de acreditación. Te notificaremos cuando se confirme.', { duration: 6000 });
    }
  }, [searchParams]);


  const handleGoogleLogin = async () => {
    try {
      setIsLoggingIn(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/tokens`,
          queryParams: {
            prompt: 'select_account',
            access_type: 'offline',
          }
        },
      });
      if (error) throw error;
    } catch (error: any) {
      toast.error("Error con Google: " + error.message);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLinkTelegram = async () => {
    if (!user) {
      toast.error("Debes iniciar sesión para vincular Telegram");
      return;
    }
    if (!linkingCode || linkingCode.length < 5) {
      toast.error("Por favor ingresa un código válido");
      return;
    }

    setIsLinking(true);
    try {
      const resp = await fetch("/api/telegram-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          linkingCode: linkingCode.trim().toUpperCase()
        }),
      });

      const data = await resp.json();
      if (data.success) {
        toast.success("¡Bot de Telegram vinculado con éxito! 🎉");
        setLinkingCode("");
      } else {
        toast.error(data.error || "Código inválido");
      }
    } catch (error: any) {
      toast.error("Error al vincular: " + error.message);
    } finally {
      setIsLinking(false);
    }
  };

  const handleSubscribePush = async () => {
    if (!user) {
      toast.error("Debes iniciar sesión para activar recordatorios");
      return;
    }
    setSubscribing(true);
    try {
      const ok = await subscribe(user.id);
      if (ok) {
        setSubscribed(true);
        toast.success("¡Recordatorios del ECOEMS activados! 🔔");
      } else {
        toast.error("No se pudo activar las notificaciones. Verifica los permisos del navegador.");
      }
    } finally {
      setSubscribing(false);
    }
  };

  const handleBuy = async (packageId: string) => {
    if (!user) {
        toast.error("Debes iniciar sesión para comprar tokens");
        return;
    }

    setLoadingPkg(packageId);
    try {
      const resp = await fetch("/api/tokens/buy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          packageId,
          userId: user.id,
          userEmail: user.email
        }),
      });

      const data = await resp.json();
      if (data.init_point) {
        window.location.href = data.init_point;
      } else {
        throw new Error(data.error || "Error al crear la preferencia de pago");
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoadingPkg(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-primary/30 cyber-grid pb-20">
      {/* Background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/20 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-6xl mx-auto px-6 pt-24 space-y-12 relative">
        {pendingQuestionMsg && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 bg-primary/20 border border-primary/50 text-white px-4 py-3 rounded-2xl shadow-lg -mb-6"
          >
            <Info className="h-5 w-5 text-primary shrink-0" />
            <p className="text-sm font-bold tracking-wide">{pendingQuestionMsg}</p>
          </motion.div>
        )}

        {/* Header */}
        <div className="flex flex-col items-center text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-4"
          >
            <Ticket className="h-4 w-4 text-primary" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">Sistema de Tokens CyberEdu</span>
          </motion.div>
          
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none italic">
            🎟️ COMPRA <span className="text-primary not-italic">TOKENS</span>
          </h1>
          
          <div className="max-w-2xl space-y-4">
            <p className="text-lg md:text-xl text-slate-400 font-medium leading-relaxed">
              Desbloquea el poder total del <span className="text-white font-bold">CyberAgent IA</span>. 
              Sin suscripciones forzosas, solo paga por lo que usas.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 pt-4">
               <Badge className="bg-white/5 text-slate-300 border-white/10 px-3 py-1.5 flex items-center gap-2">
                 <Zap className="h-3 w-3 text-amber-500" />
                 1 Pregunta = 1 Token
               </Badge>
               <Badge className="bg-white/5 text-slate-300 border-white/10 px-3 py-1.5 flex items-center gap-2">
                 <ShieldCheck className="h-3 w-3 text-emerald-500" />
                 Pago seguro con Mercado Pago
               </Badge>
            </div>
          </div>
        </div>

        {/* Balance Current & Telegram Link */}
        <div className="max-w-4xl mx-auto space-y-4">
            <div className="glass-card-premium p-6 rounded-3xl border-primary/20 bg-primary/5 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                    <div className="w-16 h-16 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center">
                        <Ticket className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Tu balance actual</p>
                        <p className="text-3xl font-black text-white">{profile?.tokens || 0} TOKENS</p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <Button variant="ghost" onClick={() => navigate("/")} className="rounded-xl border border-white/5 hover:bg-white/5 text-slate-400 font-bold">
                        Panel de estudio
                    </Button>
                </div>
            </div>

            {/* Telegram Linking Card */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card-premium p-6 rounded-3xl border-sky-500/20 bg-sky-500/5 flex flex-col md:flex-row items-center justify-between gap-6"
            >
                <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-xl bg-sky-500/20 border border-sky-500/30 flex items-center justify-center">
                        <Send className="h-6 w-6 text-sky-400" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Ecosistema Telegram</p>
                        <h3 className="text-lg font-bold text-white">Vincular con @CyberEduMXBot</h3>
                        <p className="text-xs text-slate-400">Usa tus tokens directamente en el chat de Telegram.</p>
                    </div>
                </div>
                
                <div className="flex w-full md:w-auto gap-2">
                    <Input 
                      placeholder="Código (ej: YGG65K)" 
                      value={linkingCode}
                      onChange={(e) => setLinkingCode(e.target.value)}
                      className="bg-white/5 border-white/10 rounded-xl h-11 text-center font-black tracking-widest uppercase"
                    />
                    <Button 
                      onClick={handleLinkTelegram}
                      disabled={isLinking || !linkingCode}
                      className="bg-sky-500 hover:bg-sky-400 text-black font-black uppercase tracking-widest text-[10px] px-6 rounded-xl h-11 shrink-0"
                    >
                        {isLinking ? "..." : "Vincular"}
                    </Button>
                </div>
            </motion.div>
        </div>

        {/* Explanatory Section */}
        <div className="max-w-4xl mx-auto space-y-6 pt-4 pb-8">
          <h2 className="text-xl md:text-2xl font-black uppercase tracking-widest text-center text-slate-300">¿Cómo funciona el acceso al AITutor?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/5 flex flex-col gap-2 transition-transform hover:-translate-y-1">
              <div className="text-4xl mb-2">🎁</div>
              <h3 className="font-bold text-lg text-white">Gratis</h3>
              <p className="text-sm text-slate-400 font-medium">15 preguntas gratis sin registro, y 15 preguntas diarias al registrarte.</p>
            </div>
            <div className="bg-primary/10 p-6 rounded-2xl border border-primary/20 flex flex-col gap-2 transition-transform hover:-translate-y-1 shadow-[0_0_30px_rgba(var(--primary),0.05)]">
              <div className="text-4xl mb-2">🎟️</div>
              <h3 className="font-bold text-lg text-primary">Tokens</h3>
              <p className="text-sm text-slate-300 font-medium">Sin límite diario, 1 token por pregunta, no expiran.</p>
            </div>
            <div className="bg-amber-500/10 p-6 rounded-2xl border border-amber-500/20 flex flex-col gap-2 transition-transform hover:-translate-y-1">
              <div className="text-4xl mb-2">👑</div>
              <h3 className="font-bold text-lg text-amber-500">Maestro Ilimitado</h3>
              <p className="text-sm text-amber-100/70 font-medium">Preguntas ilimitadas por $250/mes.</p>
            </div>
          </div>
        </div>

        {/* Conditional Rendering: Auth Guard vs. Packages */}
        {!user ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-4xl mx-auto"
          >
            <Card className="glass-card-premium rounded-[3rem] border-primary/20 bg-primary/5 p-8 md:p-16 text-center space-y-8 overflow-hidden relative group">
              {/* Background Glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/10 rounded-full blur-[80px] group-hover:scale-150 transition-transform duration-1000" />
              
              <div className="relative z-10 space-y-6">
                <div className="flex justify-center">
                  <div className="w-20 h-20 rounded-3xl bg-primary/20 border border-primary/30 flex items-center justify-center animate-bounce shadow-2xl shadow-primary/20">
                    <Lock className="h-10 w-10 text-primary" />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-tight text-white">
                    Para comprar tokens <br />
                    <span className="text-primary italic">primero crea tu cuenta</span>
                  </h2>
                  <p className="text-slate-400 font-medium text-lg max-w-xl mx-auto">
                    Solo toma 10 segundos con Google. Tus tokens se acreditarán automáticamente a tu perfil para que nunca los pierdas.
                  </p>
                </div>

                <div className="pt-4">
                  <Button 
                    onClick={handleGoogleLogin}
                    disabled={isLoggingIn}
                    className="h-16 px-10 rounded-2xl bg-white text-black hover:bg-slate-200 transition-all font-black uppercase tracking-widest text-xs flex items-center gap-3 mx-auto shadow-xl shadow-white/10"
                  >
                    {isLoggingIn ? (
                      <div className="h-5 w-5 border-3 border-black/30 border-t-black rounded-full animate-spin" />
                    ) : (
                      <>
                        <Chrome className="h-5 w-5 text-red-500" />
                        Registrarse con Google
                      </>
                    )}
                  </Button>
                </div>
                
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">
                  Protocolo de seguridad SSL/AES activado
                </p>
              </div>
            </Card>
          </motion.div>
        ) : (
          <>
            {/* Urgency countdown */}
            {examDays > 0 && (
              <div className="text-center p-5 bg-red-500/10 border border-red-500/30 rounded-2xl">
                <p className="text-red-400 font-bold text-lg">⚠️ El ECOEMS es el 20 de junio</p>
                <p className="text-4xl font-black text-white mt-1">{examDays} días para prepararte</p>
                <p className="text-slate-400 text-sm mt-1">Cada día sin practicar es ventaja para los demás</p>
              </div>
            )}

            {/* Push notifications CTA */}
            <div className="flex justify-center">
              <button
                onClick={handleSubscribePush}
                disabled={subscribing || subscribed}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-500/10 border border-violet-500/30 text-violet-300 hover:bg-violet-500/20 transition-colors text-sm font-semibold disabled:opacity-60"
              >
                <Bell className="h-4 w-4" />
                {subscribed ? "✓ Recordatorios activados" : subscribing ? "Activando..." : "🔔 Activar recordatorios del ECOEMS"}
              </button>
            </div>

            {/* Packages Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {tokenPackages.map((pkg, idx) => (
                <motion.div
                  key={pkg.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * idx }}
                >
                  <Card className={`relative h-full flex flex-col overflow-hidden transition-all duration-500 hover:scale-[1.02] glass-card-premium rounded-[2.5rem] border-white/10 ${pkg.highlight ? "border-primary/40 ring-1 ring-primary/20" : ""}`}>
                    {pkg.badge && (
                      <div className={`absolute top-6 right-[-35px] rotate-45 ${(pkg as any).badgeColor ?? 'bg-primary'} text-white text-[10px] font-black uppercase py-1 px-10 shadow-xl z-20`}>
                        {pkg.badge}
                      </div>
                    )}

                    <CardHeader className="p-8 pb-4">
                      <div className="mb-4 flex items-center justify-between">
                        <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                          {pkg.icon}
                        </div>
                      </div>
                      <CardTitle className="text-3xl font-black uppercase tracking-tight text-white">{pkg.name}</CardTitle>
                      <CardDescription className="text-slate-500 font-medium">{pkg.description}</CardDescription>
                    </CardHeader>

                    <CardContent className="p-8 pt-4 flex-grow space-y-6">
                      <div className="space-y-1">
                        <div className="flex items-baseline gap-2">
                            <span className="text-5xl font-black text-white">{pkg.tokens}</span>
                            <span className="text-slate-400 font-bold uppercase tracking-widest text-sm">Tokens</span>
                        </div>
                        <p className="text-primary font-black text-2xl">${pkg.price} MXN</p>
                        <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest">${pkg.pricePerToken.toFixed(2)} por token</p>
                      </div>

                      <div className="pt-4 border-t border-white/5 space-y-3">
                        <div className="flex items-center gap-2 text-sm text-slate-300">
                            <Check className="h-4 w-4 text-emerald-500" />
                            Acceso ilimitado al Tutor
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-300">
                            <Check className="h-4 w-4 text-emerald-500" />
                            Prioridad de respuesta
                        </div>
                      </div>
                    </CardContent>

                    <CardFooter className="p-8 pt-0 flex flex-col gap-2">
                      <Button
                        className={`w-full h-14 rounded-2xl font-black uppercase tracking-widest text-xs transition-all ${pkg.highlight ? "bg-primary hover:bg-primary/80 shadow-lg shadow-primary/20" : "bg-white/10 hover:bg-white/20 border border-white/10"}`}
                        onClick={() => handleBuy(pkg.id)}
                        disabled={loadingPkg === pkg.id}
                      >
                        {loadingPkg === pkg.id ? (
                          <div className="h-5 w-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          "Comprar ahora"
                        )}
                      </Button>
                      {(pkg as any).urgency && (
                        <p className="text-xs text-center text-slate-500 font-medium">{(pkg as any).urgency}</p>
                      )}
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Unlimited Plan */}
            <motion.div
               initial={{ opacity: 0, y: 30 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.4 }}
               className="max-w-4xl mx-auto"
            >
                <Card className="glass-card-premium rounded-[3rem] border-amber-500/20 bg-amber-500/5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12 group-hover:rotate-0 transition-transform duration-1000">
                        <Crown className="h-48 w-48 text-amber-500" />
                    </div>
                    
                    <CardContent className="p-8 md:p-12">
                       <div className="flex flex-col md:flex-row gap-10 items-center">
                          <div className="w-24 h-24 rounded-full bg-amber-500/20 border-2 border-amber-500/30 flex items-center justify-center shrink-0 shadow-2xl shadow-amber-500/20">
                             {unlimitedPackage.icon}
                          </div>
                          
                          <div className="flex-1 space-y-4 text-center md:text-left">
                             <Badge className="bg-amber-500 text-black font-black uppercase px-3 py-1 mb-2">Plan Maestro</Badge>
                             <h3 className="text-4xl font-black uppercase tracking-tighter text-white">👑 {unlimitedPackage.name}</h3>
                             <p className="text-slate-400 font-medium text-lg max-w-xl">
                                {unlimitedPackage.description}. Ideal para quienes quieren asistencia total en su preparación ECOEMS.
                             </p>
                             <div className="flex flex-wrap items-end justify-center md:justify-start gap-4 pt-4">
                                 <div className="flex items-baseline gap-1">
                                    <span className="text-5xl font-black text-white">$250</span>
                                    <span className="text-slate-500 font-bold uppercase tracking-widest text-xs">MXN / mes</span>
                                 </div>
                                 <div className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-black uppercase">
                                    $0.25 por token
                                 </div>
                             </div>
                          </div>

                          <div className="w-full md:w-auto flex flex-col items-center gap-2">
                            <Button
                                className="w-full md:w-56 h-16 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-black uppercase tracking-widest text-xs shadow-xl shadow-amber-500/20"
                                onClick={() => handleBuy(unlimitedPackage.id)}
                                disabled={loadingPkg === unlimitedPackage.id}
                            >
                                {loadingPkg === unlimitedPackage.id ? (
                                    <div className="h-5 w-5 border-3 border-black/30 border-t-black rounded-full animate-spin" />
                                ) : (
                                    "Activar ilimitado"
                                )}
                            </Button>
                            <p className="text-xs text-slate-500 font-medium text-center">Acceso ilimitado hasta el examen</p>
                          </div>
                       </div>
                    </CardContent>
                </Card>
            </motion.div>
          </>
        )}

        {/* Info Footer */}
        <div className="max-w-2xl mx-auto text-center space-y-4 text-slate-500 pt-8 border-t border-white/5">
            <div className="flex items-center justify-center gap-2">
                <Info className="h-4 w-4" />
                <p className="text-xs font-bold uppercase tracking-widest">Preguntas frecuentes</p>
            </div>
            <p className="text-[10px] font-medium leading-relaxed">
                Los tokens no expiran para los paquetes Básico, Popular y Pro. 
                El Plan Ilimitado otorga 1,000 tokens cada mes y se cobra de forma recurrente. 
                Cada interacción con la IA consume 1 token del balance disponible. 
                <span className="text-primary font-bold"> IMPORTANTE:</span> El acceso a videos, guías y simuladores básicos sigue siendo **absolutamente gratis** para todos.
            </p>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .cyber-grid {
          background-image: 
            radial-gradient(circle at 2px 2px, rgba(255,255,255,0.03) 1px, transparent 0);
          background-size: 40px 40px;
        }
      `}} />
    </div>
  );
};

export default TokensPage;
