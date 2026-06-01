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
  Bell,
  Unlock,
  Gift
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { clarityEvent } from "@/lib/clarity";

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

const premiumPackages = [
  {
    id: "guia2026",
    name: "Guía 2026",
    tokens: 100,
    price: 90,
    pricePerToken: 0.90,
    badge: "PAQUETE",
    badgeColor: "bg-purple-600",
    icon: <Rocket className="h-6 w-6 text-purple-400" />,
    description: "44 videos + Simulador Guía 2026 sin límite · Pago único",
    urgency: "Todo lo que necesitas para el examen",
    perks: ["44 videos de estudio Guía 2026", "Simulador banco 10 completo", "Tutor IA incluido"],
  },
  {
    id: "paquete_completo",
    name: "Paquete Completo",
    tokens: 200,
    price: 170,
    pricePerToken: 0.85,
    highlight: true,
    badge: "MÁS POPULAR",
    badgeColor: "bg-gradient-to-r from-purple-500 to-pink-500",
    icon: <Crown className="h-6 w-6 text-amber-400" />,
    description: "Todos los bancos + Tutor IA ilimitado + Guía 2026 · Pago único",
    urgency: "La mejor inversión para tu preparación",
    perks: ["Todos los bancos desbloqueados", "Tutor IA sin límite de consultas", "44 videos Guía 2026", "⭐ Badge Todo Incluido"],
  },
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
  const { user, profile, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [loadingPkg, setLoadingPkg] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const [pendingQuestionMsg, setPendingQuestionMsg] = useState<string | null>(null);
  const [linkingCode, setLinkingCode] = useState("");
  const [isLinking, setIsLinking] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [subscribing, setSubscribing] = useState(false);
  const [redeemingPkg, setRedeemingPkg] = useState<string | null>(null);
  const [copiado, setCopiado] = useState(false);

  const referralCode = profile?.referral_code ||
    ((profile?.name || '').replace(/\s+/g, '').toUpperCase().slice(0, 4).padEnd(4, 'X') +
     (profile?.id || '').slice(0, 4).toUpperCase());

  const copiarLinkReferido = async () => {
    const link = `https://cyberedumx.com/auth?ref=${referralCode}`;
    try {
      await navigator.clipboard.writeText(link);
    } catch {
      const el = document.createElement('textarea');
      el.value = link;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };
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
      navigate('/auth?ref=tokens');
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
        clarityEvent('compra_tokens');
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

  // Redención directa con tokens (descuento de saldo + actualización de flags en Supabase)
  const redeemTokens = async (
    pkgId: string,
    cost: number,
    updates: Record<string, boolean | number>
  ) => {
    if (!user || !profile) {
      toast.error("Debes iniciar sesión para canjear tokens");
      return;
    }
    const currentTokens = profile.tokens ?? 0;
    if (currentTokens < cost) {
      toast.error(`Necesitas ${cost} tokens. Tu balance actual es ${currentTokens}.`);
      return;
    }
    setRedeemingPkg(pkgId);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          ...updates,
          tokens: currentTokens - cost,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) throw error;
      await refreshProfile();
      clarityEvent('banco_desbloqueado');
      toast.success(`¡Desbloqueado! Se descontaron ${cost} tokens de tu balance. 🎉`);
    } catch (err: any) {
      toast.error("Error al canjear: " + err.message);
    } finally {
      setRedeemingPkg(null);
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

        {/* ——— HEADER ——— */}
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

        {/* ——— URGENCY COUNTDOWN — siempre visible ——— */}
        {examDays > 0 && (
          <div className="text-center p-5 bg-red-500/10 border border-red-500/30 rounded-2xl max-w-4xl mx-auto">
            <p className="text-red-400 font-bold text-lg">⚠️ El ECOEMS es el 20 de junio</p>
            <p className="text-4xl font-black text-white mt-1">{examDays} días para prepararte</p>
            <p className="text-slate-400 text-sm mt-1">Cada día sin practicar es ventaja para los demás</p>
          </div>
        )}

        {/* ——— PAQUETES DE TOKENS — siempre visible ——— */}
        <div id="comprar" className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
                      `Comprar — $${pkg.price} MXN`
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

        {/* ——— PAQUETES PREMIUM — siempre visible ——— */}
        <div className="space-y-4">
          <p className="text-center text-[10px] font-black uppercase tracking-widest text-slate-500">Paquetes Premium — Pago único</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {premiumPackages.map((pkg, idx) => (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * idx }}
              >
                <Card className={`relative h-full flex flex-col overflow-hidden transition-all duration-500 hover:scale-[1.02] glass-card-premium rounded-[2.5rem] ${pkg.highlight ? "border-purple-500/40 ring-1 ring-purple-500/20" : "border-white/10"}`}>
                  {pkg.badge && (
                    <div className={`absolute top-6 right-[-35px] rotate-45 ${pkg.badgeColor} text-white text-[10px] font-black uppercase py-1 px-10 shadow-xl z-20`}>
                      {pkg.badge}
                    </div>
                  )}
                  <CardHeader className="p-8 pb-4">
                    <div className="mb-4 flex items-center justify-between">
                      <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                        {pkg.icon}
                      </div>
                    </div>
                    <CardTitle className="text-2xl font-black uppercase tracking-tight text-white">{pkg.name}</CardTitle>
                    <CardDescription className="text-slate-400 font-medium text-xs">{pkg.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="p-8 pt-0 flex-grow space-y-4">
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-black text-white">${pkg.price}</span>
                        <span className="text-slate-400 font-bold uppercase tracking-widest text-sm">MXN</span>
                      </div>
                      <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest">Pago único — acceso de por vida</p>
                    </div>
                    <div className="pt-3 border-t border-white/5 space-y-2">
                      {pkg.perks.map(perk => (
                        <div key={perk} className="flex items-center gap-2 text-sm text-slate-300">
                          <Check className="h-4 w-4 text-purple-400 shrink-0" />
                          {perk}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="p-8 pt-0 flex flex-col gap-2">
                    <Button
                      className={`w-full h-14 rounded-2xl font-black uppercase tracking-widest text-xs transition-all ${pkg.highlight ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 shadow-lg shadow-purple-500/20 text-white" : "bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 text-purple-300"}`}
                      onClick={() => handleBuy(pkg.id)}
                      disabled={loadingPkg === pkg.id}
                    >
                      {loadingPkg === pkg.id ? (
                        <div className="h-5 w-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        `Comprar — $${pkg.price} MXN`
                      )}
                    </Button>
                    <p className="text-xs text-center text-slate-500 font-medium">{pkg.urgency}</p>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ——— PLAN ILIMITADO — siempre visible ——— */}
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
                                `Activar — $${unlimitedPackage.price} MXN/mes`
                            )}
                        </Button>
                        <p className="text-xs text-slate-500 font-medium text-center">Acceso ilimitado hasta el examen</p>
                      </div>
                   </div>
                </CardContent>
            </Card>
        </motion.div>

        {/* ——— Nota de registro para usuarios no logueados ——— */}
        {!user && (
          <div className="text-center py-2 max-w-lg mx-auto">
            <p className="text-slate-400 text-sm">
              Al hacer clic en Comprar se te pedirá{" "}
              <button
                onClick={() => navigate('/auth?ref=tokens')}
                className="text-primary font-bold hover:underline"
              >
                crear una cuenta gratis con Google
              </button>
              {" "}— solo 10 segundos.
            </p>
          </div>
        )}

        {/* ——— SECCIÓN: CANJEA TUS TOKENS — solo para usuarios logueados ——— */}
        {user && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6 max-w-4xl mx-auto"
          >
            {/* Encabezado */}
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-2">
                <Gift className="h-5 w-5 text-purple-400" />
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Beneficios con Tokens</p>
              </div>
              <h2 className="text-2xl font-black uppercase tracking-tighter text-white">
                🎁 Canjea tus Tokens por <span className="text-purple-400">Acceso Premium</span>
              </h2>
              <p className="text-slate-400 text-sm">Usa tu saldo de tokens para desbloquear simuladores y material exclusivo sin pagar con tarjeta.</p>
            </div>

            {/* Grid de tarjetas de canje */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">

              {/* ——— COMBO PREMIUM 100 TOKENS ——— */}
              {(() => {
                const isComboUnlocked = (profile as any)?.paquete_completo === true;
                const canAfford = (profile?.tokens ?? 0) >= 100;
                return (
                  <div className={`relative rounded-3xl border p-6 space-y-4 overflow-hidden transition-all ${
                    isComboUnlocked
                      ? "bg-emerald-500/10 border-emerald-500/30"
                      : "bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/30"
                  }`}>
                    {/* Badge MEJOR VALOR */}
                    <div className="absolute top-4 right-[-28px] rotate-45 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-[9px] font-black uppercase py-1 px-8 shadow-lg">
                      MEJOR VALOR
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-2xl bg-purple-500/20 border border-purple-500/30 shrink-0">
                        <Crown className="h-6 w-6 text-purple-400" />
                      </div>
                      <div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">Combo Premium</p>
                        <h3 className="text-lg font-black text-white">Todos los Simuladores + Guía + Práctica</h3>
                        <p className="text-xs text-slate-400 mt-1">Bancos 5, 8, 9, 10 · 44 videos · 371 subíndices de práctica · acceso de por vida</p>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      {["Simulador Banco 5 — Guías UNAM 2024-25", "Simulador Banco 8 — Guía UNAM 2023", "Simulador Banco 9 — Guía UNAM 2024", "🆕 Simulador Banco 10 — Guía IPN/UNAM 2026", "🎬 44 videos Guía de Estudio 2026", "📚 Práctica por Subíndice — 371 temas · 1,855 preguntas"].map(p => (
                        <div key={p} className="flex items-center gap-2 text-xs text-slate-300">
                          <Check className="h-3 w-3 text-purple-400 shrink-0" />
                          {p}
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 space-y-2">
                      {isComboUnlocked ? (
                        <div className="flex items-center gap-2 w-full h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 justify-center">
                          <Check className="h-4 w-4 text-emerald-400" />
                          <span className="text-emerald-300 font-black uppercase text-xs tracking-widest">✅ Ya Desbloqueado</span>
                        </div>
                      ) : canAfford ? (
                        <button
                          onClick={() => redeemTokens('combo_premium', 100, { bank5_unlocked: true, bank8_unlocked: true, bank9_unlocked: true, bank10_unlocked: true, guia2026_unlocked: true, paquete_completo: true, practica_ilimitada: true })}
                          disabled={redeemingPkg === 'combo_premium'}
                          className="flex items-center justify-center gap-2 w-full h-12 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-500 hover:opacity-90 text-white font-black uppercase text-xs tracking-widest shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-60"
                        >
                          {redeemingPkg === 'combo_premium' ? (
                            <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          ) : (
                            <>🔓 Canjear — 100 tokens</>
                          )}
                        </button>
                      ) : (
                        <p className="text-amber-400 text-xs text-center font-semibold">Necesitas 100 tokens (tienes {profile?.tokens ?? 0})</p>
                      )}
                      {/* Botón de compra directa con pesos */}
                      {!isComboUnlocked && (
                        <button
                          onClick={() => handleBuy('guia2026')}
                          disabled={loadingPkg === 'guia2026'}
                          className="flex items-center justify-center gap-2 w-full h-10 rounded-xl border border-purple-500/40 text-purple-300 hover:bg-purple-500/10 font-black uppercase text-[10px] tracking-widest transition-all"
                        >
                          {loadingPkg === 'guia2026' ? (
                            <div className="h-3.5 w-3.5 border-2 border-purple-300/30 border-t-purple-300 rounded-full animate-spin" />
                          ) : (
                            '💳 Comprar con pesos — $90 MXN'
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })()}

              {/* ——— BANCO 10 INDIVIDUAL 50 TOKENS ——— */}
              {(() => {
                const isBank10Unlocked = (profile as any)?.bank10_unlocked === true || (profile as any)?.guia2026_unlocked === true || (profile as any)?.paquete_completo === true;
                const canAfford = (profile?.tokens ?? 0) >= 50;
                return (
                  <div className={`relative rounded-3xl border p-6 space-y-4 transition-all ${
                    isBank10Unlocked
                      ? "bg-emerald-500/10 border-emerald-500/30"
                      : "bg-amber-500/10 border-amber-500/30"
                  }`}>
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-2xl bg-amber-500/20 border border-amber-500/30 shrink-0">
                        <Rocket className="h-6 w-6 text-amber-400" />
                      </div>
                      <div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">Simulador Individual</p>
                        <h3 className="text-lg font-black text-white">🆕 Banco 10 — Guía IPN/UNAM 2026</h3>
                        <p className="text-xs text-slate-400 mt-1">Acceso completo al simulador con preguntas de la guía oficial 2026 · acceso de por vida</p>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      {["128 reactivos oficiales Guía 2026", "Preguntas y opciones aleatorizadas", "Modo examen completo y práctica rápida"].map(p => (
                        <div key={p} className="flex items-center gap-2 text-xs text-slate-300">
                          <Check className="h-3 w-3 text-amber-400 shrink-0" />
                          {p}
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 space-y-2">
                      {isBank10Unlocked ? (
                        <div className="flex items-center gap-2 w-full h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 justify-center">
                          <Check className="h-4 w-4 text-emerald-400" />
                          <span className="text-emerald-300 font-black uppercase text-xs tracking-widest">✅ Ya Desbloqueado</span>
                        </div>
                      ) : canAfford ? (
                        <button
                          onClick={() => redeemTokens('banco10', 50, { bank10_unlocked: true })}
                          disabled={redeemingPkg === 'banco10'}
                          className="flex items-center justify-center gap-2 w-full h-12 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-500 hover:opacity-90 text-white font-black uppercase text-xs tracking-widest shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-60"
                        >
                          {redeemingPkg === 'banco10' ? (
                            <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          ) : (
                            <>🔓 Canjear — 50 tokens</>
                          )}
                        </button>
                      ) : (
                        <p className="text-amber-400 text-xs text-center font-semibold">Necesitas 50 tokens (tienes {profile?.tokens ?? 0})</p>
                      )}
                      {/* Botón de compra directa con pesos */}
                      {!isBank10Unlocked && (
                        <button
                          onClick={() => handleBuy('popular')}
                          disabled={loadingPkg === 'popular'}
                          className="flex items-center justify-center gap-2 w-full h-10 rounded-xl border border-amber-500/40 text-amber-300 hover:bg-amber-500/10 font-black uppercase text-[10px] tracking-widest transition-all"
                        >
                          {loadingPkg === 'popular' ? (
                            <div className="h-3.5 w-3.5 border-2 border-amber-300/30 border-t-amber-300 rounded-full animate-spin" />
                          ) : (
                            '💳 Comprar con pesos — $50 MXN'
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })()}

              {/* ——— BANCOS 5, 8, 9, 11 INDIVIDUALES 50 TOKENS c/u ——— */}
              {[
                { id: 'banco5',  bankKey: 'bank5_unlocked',  label: 'Banco 5 — Guías UNAM 2024-25', perks: ['128 preguntas guías oficiales UNAM 2024-25', 'Modo examen + práctica rápida'] },
                { id: 'banco8',  bankKey: 'bank8_unlocked',  label: 'Banco 8 — Guía UNAM 2023',     perks: ['128 reactivos guía UNAM 2023', 'Preguntas y opciones aleatorizadas'] },
                { id: 'banco9',  bankKey: 'bank9_unlocked',  label: 'Banco 9 — Guía UNAM 2024',     perks: ['128 reactivos guía UNAM 2024', 'Resultados por materia detallados'] },
                { id: 'banco11', bankKey: 'bank11_unlocked', label: 'Banco 11 — 2do Examen Conocimientos Gen.', perks: ['128 reactivos Segundo Examen de Conocimientos Generales', 'Preguntas y opciones aleatorizadas'] },
              ].map(({ id, bankKey, label, perks }) => {
                const isUnlocked = (profile as any)?.[bankKey] === true || (profile as any)?.paquete_completo === true;
                const canAfford = (profile?.tokens ?? 0) >= 50;
                return (
                  <div key={id} className={`relative rounded-3xl border p-5 space-y-3 transition-all ${
                    isUnlocked
                      ? "bg-emerald-500/10 border-emerald-500/30"
                      : "bg-indigo-500/10 border-indigo-500/30"
                  }`}>
                    <div className="flex items-start gap-3">
                      <div className="p-2.5 rounded-xl bg-indigo-500/20 border border-indigo-500/30 shrink-0">
                        <Star className="h-5 w-5 text-indigo-400" />
                      </div>
                      <div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">Simulador Individual</p>
                        <h3 className="text-base font-black text-white">{label}</h3>
                      </div>
                    </div>

                    <div className="space-y-1">
                      {perks.map(p => (
                        <div key={p} className="flex items-center gap-2 text-xs text-slate-300">
                          <Check className="h-3 w-3 text-indigo-400 shrink-0" />
                          {p}
                        </div>
                      ))}
                    </div>

                    {isUnlocked ? (
                      <div className="flex items-center gap-2 w-full h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 justify-center">
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                        <span className="text-emerald-300 font-black uppercase text-[10px] tracking-widest">✅ Desbloqueado</span>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {canAfford ? (
                          <button
                            onClick={() => redeemTokens(id, 50, { [bankKey]: true })}
                            disabled={redeemingPkg === id}
                            className="flex items-center justify-center gap-2 w-full h-10 rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 hover:opacity-90 text-white font-black uppercase text-[10px] tracking-widest transition-all disabled:opacity-60"
                          >
                            {redeemingPkg === id ? (
                              <div className="h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                              <>🔓 Canjear — 50 tokens</>
                            )}
                          </button>
                        ) : (
                          <p className="text-amber-400 text-xs text-center font-semibold">Necesitas 50 tokens (tienes {profile?.tokens ?? 0})</p>
                        )}
                        {/* Botón de compra directa con pesos */}
                        <button
                          onClick={() => handleBuy('popular')}
                          disabled={loadingPkg === 'popular'}
                          className="flex items-center justify-center gap-2 w-full h-9 rounded-xl border border-indigo-500/40 text-indigo-300 hover:bg-indigo-500/10 font-black uppercase text-[10px] tracking-widest transition-all"
                        >
                          {loadingPkg === 'popular' ? (
                            <div className="h-3.5 w-3.5 border-2 border-indigo-300/30 border-t-indigo-300 rounded-full animate-spin" />
                          ) : (
                            '💳 Comprar con pesos — $50 MXN'
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* ——— BALANCE & TELEGRAM — solo para usuarios logueados ——— */}
        {user && (
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
        )}

        {/* ——— EXPLICACIÓN ¿CÓMO FUNCIONA? — siempre visible ——— */}
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

        {/* ——— PUSH NOTIFICATIONS — solo logged ——— */}
        {user && (
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
        )}

        {/* ——— BANNER REFERIDOS — solo logged ——— */}
        {user && (
          <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-4 mb-4">
            <h3 className="text-green-400 font-black text-lg mb-3">🎁 Gana tokens gratis invitando amigos</h3>
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-3 bg-green-500/10 rounded-xl p-3">
                <span className="text-2xl">1️⃣</span>
                <div>
                  <p className="text-white font-bold text-sm">Tu amigo se registra</p>
                  <p className="text-gray-400 text-xs">Ambos reciben 50 tokens al instante</p>
                </div>
                <span className="ml-auto text-green-400 font-black">+50 🪙</span>
              </div>
              <div className="flex items-center gap-3 bg-green-500/10 rounded-xl p-3">
                <span className="text-2xl">2️⃣</span>
                <div>
                  <p className="text-white font-bold text-sm">Tu amigo vuelve a entrar</p>
                  <p className="text-gray-400 text-xs">Recibes 50 tokens cuando regrese — solo una vez</p>
                </div>
                <span className="ml-auto text-green-400 font-black">+50 🪙</span>
              </div>
              <div className="flex items-center gap-3 bg-green-500/10 rounded-xl p-3">
                <span className="text-2xl">3️⃣</span>
                <div>
                  <p className="text-white font-bold text-sm">Tu amigo hace su primera compra</p>
                  <p className="text-gray-400 text-xs">Recibes 50 tokens más — solo una vez</p>
                </div>
                <span className="ml-auto text-green-400 font-black">+50 🪙</span>
              </div>
            </div>
            <div className="bg-green-500/20 rounded-xl p-3 text-center mb-3">
              <p className="text-green-300 font-black">🏆 Máximo 150 tokens por cada amigo que invites</p>
            </div>
            <div className="flex gap-2">
              <input
                value={`https://cyberedumx.com/auth?ref=${referralCode}`}
                readOnly
                className="flex-1 bg-gray-800 text-white rounded-lg px-3 py-2 text-xs border border-green-500/20"
              />
              <button
                onClick={copiarLinkReferido}
                className={`px-4 py-2 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${
                  copiado ? 'bg-green-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {copiado ? '✅ ¡Copiado!' : '📋 Copiar'}
              </button>
            </div>
            <p className="text-gray-500 text-xs mt-2">
              Has referido {profile?.referral_count ?? 0} amigos = {(profile?.referral_count ?? 0) * 50} tokens ganados
            </p>
          </div>
        )}

        {/* ——— INFO FOOTER ——— */}
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
