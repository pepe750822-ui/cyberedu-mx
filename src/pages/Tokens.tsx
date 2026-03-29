import React, { useState, useEffect } from "react";
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
  CheckCircle,
  XCircle,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const tokenPackages = [
  {
    id: "basico",
    name: "Básico",
    tokens: 10,
    price: 10,
    pricePerToken: 1.00,
    badge: "Lanzamiento",
    icon: <Ticket className="h-6 w-6 text-slate-400" />,
    description: "Ideal para dudas rápidas."
  },
  {
    id: "popular",
    name: "Popular",
    tokens: 30,
    price: 60,
    pricePerToken: 2.00,
    highlight: true,
    badge: "Más vendido",
    icon: <Star className="h-6 w-6 text-amber-500" />,
    description: "El balance perfecto para estudiar."
  },
  {
    id: "pro",
    name: "Pro",
    tokens: 100,
    price: 150,
    pricePerToken: 1.50,
    icon: <Rocket className="h-6 w-6 text-primary" />,
    description: "Para estudiantes intensivos."
  }
];

const unlimitedPackage = {
    id: "ilimitado",
    name: "Ilimitado",
    tokens: 1000,
    price: 200,
    pricePerToken: 0.20,
    description: "1,000 tokens al mes · Se renueva automáticamente",
    icon: <Crown className="h-8 w-8 text-amber-500" />
};

const TokensPage = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [loadingPkg, setLoadingPkg] = useState<string | null>(null);
  const [searchParams] = useSearchParams();

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

        {/* Balance Current */}
        <div className="max-w-4xl mx-auto">
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
                  <div className="absolute top-6 right-[-35px] rotate-45 bg-primary text-white text-[10px] font-black uppercase py-1 px-10 shadow-xl z-20">
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

                <CardFooter className="p-8 pt-0">
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
                                <span className="text-5xl font-black text-white">$200</span>
                                <span className="text-slate-500 font-bold uppercase tracking-widest text-xs">MXN / mes</span>
                             </div>
                             <div className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-black uppercase">
                                $0.20 por token
                             </div>
                         </div>
                      </div>

                      <div className="w-full md:w-auto">
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
                      </div>
                   </div>
                </CardContent>
            </Card>
        </motion.div>

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
