import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  GraduationCap, 
  ArrowRight, 
  Brain, 
  Target, 
  Video, 
  LineChart, 
  Globe, 
  CheckCircle2, 
  Star,
  Quote,
  ShieldCheck,
  Zap,
  Ticket,
  Crown,
  Sparkles,
  Users,
  Bot,
  Layers,
  MessageCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const LandingPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "CyberEdu MX | Preparación ECOEMS con IA";
    window.scrollTo(0, 0);

    // Forzar dark mode en la landing para que los colores sean siempre correctos
    const root = document.documentElement;
    const prevClass = root.className;
    root.classList.add("dark");
    document.body.style.backgroundColor = "#020617"; // slate-950

    return () => {
      root.className = prevClass;
      document.body.style.backgroundColor = "";
    };
  }, []);

  const features = [
    {
      icon: <Brain className="h-6 w-6 text-violet-400" />,
      title: "Tutor IA 24/7",
      description: "Powered by Claude (Anthropic). Resuelve tus dudas paso a paso como si tuvieras un profesor particular siempre disponible."
    },
    {
      icon: <Globe className="h-6 w-6 text-blue-400" />,
      title: "19 Laboratorios Virtuales",
      description: "Explora el cuerpo humano en 3D, el globo terráqueo interactivo, el sistema solar y la línea del tiempo de historia."
    },
    {
      icon: <Target className="h-6 w-6 text-emerald-400" />,
      title: "Simulador 128 Preguntas",
      description: "Mídete con reactivos tipo examen real, organizados por área y dificultad. Obtén retroalimentación predictiva."
    },
    {
      icon: <Video className="h-6 w-6 text-rose-400" />,
      title: "91 Videos Educativos",
      description: "Lecciones claras y concisas en alta definición que cubren exactamente el temario oficial del ECOEMS 2026."
    },
    {
      icon: <LineChart className="h-6 w-6 text-amber-400" />,
      title: "Progreso Automático",
      description: "Visualiza tu avance en un dashboard personalizado. Identifica tus puntos débiles antes del examen."
    }
  ];

  const pricingPlans = [
    {
      name: "Gratis",
      price: "0",
      description: "Para probar la plataforma",
      tokens: "25 preguntas/día",
      features: ["Acceso a todo el contenido", "91 Videos Educativos", "25 preguntas diarias al Tutor IA", "Sin tarjeta de crédito"],
      cta: "Registrarme Gratis",
      action: () => navigate("/auth"),
      highlight: false,
      icon: <Zap className="h-6 w-6 text-slate-400" />
    },
    {
      name: "Básico",
      price: "20",
      description: "Ideal para dudas rápidas",
      tokens: "20 Tokens",
      features: ["Todo lo gratuito", "20 interacciones con IA", "Prioridad de respuesta", "Tokens no expiran"],
      cta: "Comprar Tokens",
      action: () => navigate("/tokens"),
      highlight: false,
      icon: <Ticket className="h-6 w-6 text-emerald-400" />
    },
    {
      name: "Popular",
      price: "50",
      description: "Balance perfecto",
      tokens: "60 Tokens",
      features: ["Todo lo gratuito", "60 interacciones con IA", "Análisis de progreso avanzado", "Tokens no expiran"],
      cta: "Comprar Tokens",
      action: () => navigate("/tokens"),
      highlight: true,
      badge: "Más Vendido",
      icon: <Star className="h-6 w-6 text-amber-400" />
    },
    {
      name: "Pro",
      price: "120",
      description: "Estudiantes intensivos",
      tokens: "160 Tokens",
      features: ["Todo lo gratuito", "160 interacciones con IA", "Explicaciones extendidas", "Tokens no expiran"],
      cta: "Comprar Tokens",
      action: () => navigate("/tokens"),
      highlight: false,
      icon: <ShieldCheck className="h-6 w-6 text-blue-400" />
    },
    {
      name: "Ilimitado",
      price: "250",
      description: "Preparación total (mensual)",
      tokens: "1,000 Tokens/mes",
      features: ["Todo lo gratuito", "1,000 interacciones mensuales", "Tutor IA siempre disponible", "Renovación automática"],
      cta: "Activar Plan",
      action: () => navigate("/tokens"),
      highlight: false,
      badge: "Maestro",
      icon: <Crown className="h-6 w-6 text-rose-400" />
    }
  ];

  const testimonials = [
    {
      name: "María, 17 años",
      location: "Estado de México",
      text: "Pasé de 45 a 89 puntos en el simulador en solo un mes. Entender matemáticas con el tutor IA fue la clave.",
      stars: 5
    },
    {
      name: "Juan Carlos",
      location: "CDMX",
      text: "El Tutor IA me explicó mejor que cualquier profesor que he tenido. Además el globo 3D para geografía está brutal.",
      stars: 5
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-primary/30 font-sans" style={{ backgroundColor: '#020617', color: '#e2e8f0' }}>
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-white/5">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
            <div className="p-1.5 bg-primary/20 rounded-lg border border-primary/30">
              <GraduationCap className="h-5 w-5 text-primary" />
            </div>
            <span className="text-lg font-black text-white tracking-tight">CyberEdu MX</span>
          </div>
          <Button 
            variant="ghost" 
            onClick={() => navigate("/auth")}
            className="text-slate-300 hover:text-white font-bold text-xs uppercase tracking-widest"
          >
            Iniciar Sesión
          </Button>
        </div>
      </nav>

      {/* 1. Hero Section */}
      <section className="relative pt-28 pb-16 md:pt-40 md:pb-24 overflow-hidden px-4">
        {/* Background glows */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-emerald-500/10 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute top-1/2 left-1/4 w-[350px] h-[350px] bg-violet-500/10 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute top-1/2 right-1/4 w-[350px] h-[350px] bg-orange-500/8 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto">

          {/* Live badge */}
          <div className="flex justify-center mb-7 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              <span className="text-[11px] font-black uppercase tracking-widest">ECOEMS 2026 · 20-28 Junio · Prepárate Ya</span>
            </div>
          </div>

          {/* Title */}
          <div className="text-center animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-100">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter leading-[1.05] mb-5">
              Aprueba el ECOEMS{" "}
              <span className="relative inline-block">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400">en 45 Días</span>
                <span className="absolute -bottom-1 left-0 right-0 h-[3px] bg-gradient-to-r from-emerald-400/0 via-emerald-400/70 to-emerald-400/0 rounded-full" />
              </span>
            </h1>

            <p className="text-lg md:text-2xl text-slate-300 max-w-2xl mx-auto font-medium leading-relaxed">
              <span className="text-white font-bold">Tutor IA disponible 24/7</span>
              {" + "}
              <span className="text-cyan-400 font-bold">19 Laboratorios Virtuales</span>
              {" para dominar cada tema del examen."}
            </p>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
            <Button
              onClick={() => navigate("/auth")}
              className="w-full sm:w-auto h-14 px-10 rounded-2xl font-black uppercase tracking-[0.12em] text-sm transition-all hover:scale-105 active:scale-95 text-black"
              style={{
                background: "linear-gradient(135deg, #10b981 0%, #f59e0b 100%)",
                boxShadow: "0 0 40px rgba(16,185,129,0.35), 0 4px 20px rgba(245,158,11,0.2)"
              }}
            >
              Empezar Gratis — 25 Preguntas/Día
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              onClick={() => document.getElementById('precios')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full sm:w-auto h-14 px-8 rounded-2xl bg-white/5 border-white/10 hover:bg-white/10 text-white font-bold uppercase tracking-widest transition-all"
            >
              Ver Precios
            </Button>
          </div>
          <p className="text-center text-[11px] text-slate-500 mt-3 font-medium animate-in fade-in duration-1000 delay-400">
            Sin registro: <span className="text-slate-300 font-bold">15 preguntas gratis al instante</span> · También en{" "}
            <span className="text-cyan-400 font-bold">@CyberEduMXBot</span> en Telegram
          </p>

          {/* Social proof */}
          <div className="flex justify-center mt-6 animate-in fade-in duration-1000 delay-500">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10">
              <div className="flex -space-x-2">
                {(["#8b5cf6","#06b6d4","#10b981","#f59e0b"] as const).map((color, i) => (
                  <div
                    key={i}
                    className="w-7 h-7 rounded-full border-2 border-slate-900 flex items-center justify-center text-[9px] font-black text-white"
                    style={{ backgroundColor: color }}
                  >
                    {["M","J","A","K"][i]}
                  </div>
                ))}
              </div>
              <Users className="h-3.5 w-3.5 text-slate-400" />
              <span className="text-xs font-bold text-slate-300">
                <span className="text-white font-black">47 estudiantes</span> ya están usando CyberEdu
              </span>
            </div>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-6 animate-in fade-in duration-1000 delay-700">
            <div className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-[11px] font-bold text-slate-300 hover:border-violet-500/30 hover:bg-violet-500/5 transition-all">
              <Bot className="h-3.5 w-3.5 text-violet-400" />
              Tutor IA de Anthropic
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-[11px] font-bold text-slate-300 hover:border-cyan-500/30 hover:bg-cyan-500/5 transition-all">
              <Layers className="h-3.5 w-3.5 text-cyan-400" />
              19 Laboratorios Virtuales
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-[11px] font-bold text-slate-300 hover:border-sky-500/30 hover:bg-sky-500/5 transition-all">
              <MessageCircle className="h-3.5 w-3.5 text-sky-400" />
              Bot Telegram 24/7
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-[11px] font-bold text-slate-300 hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              Acceso de Por Vida
            </div>
          </div>

          {/* Hero Visual — AI Tutor mock */}
          <div className="mt-14 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-500">
            <div
              className="relative rounded-3xl border border-white/10 overflow-hidden"
              style={{
                background: "linear-gradient(145deg, rgba(15,23,42,0.97) 0%, rgba(2,6,23,0.99) 100%)",
                boxShadow: "0 0 80px rgba(16,185,129,0.10), 0 0 40px rgba(139,92,246,0.08), 0 32px 64px rgba(0,0,0,0.5)"
              }}
            >
              {/* Window bar */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5" style={{ background: "rgba(255,255,255,0.02)" }}>
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/50" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/50" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/5">
                    <Bot className="h-3 w-3 text-violet-400" />
                    <span className="text-[10px] text-slate-400 font-bold">CyberAgent · Tutor IA</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  </div>
                </div>
              </div>

              {/* Chat messages */}
              <div className="p-5 space-y-4">
                {/* User message */}
                <div className="flex justify-end">
                  <div
                    className="max-w-[75%] px-4 py-2.5 rounded-2xl rounded-tr-sm text-sm font-medium text-white"
                    style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)" }}
                  >
                    ¿Cómo funciona la fotosíntesis para el ECOEMS?
                  </div>
                </div>

                {/* AI response */}
                <div className="flex gap-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1"
                    style={{ background: "linear-gradient(135deg, #10b981, #06b6d4)" }}
                  >
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1 space-y-2.5">
                    <div
                      className="px-4 py-3 rounded-2xl rounded-tl-sm text-sm text-slate-200 leading-relaxed"
                      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                    >
                      La fotosíntesis convierte luz solar en glucosa ☀️<br />
                      <br />
                      <span className="text-emerald-400 font-bold">Fórmula clave [BIO 3.1]:</span>
                      <span
                        className="ml-2 px-2 py-0.5 rounded font-mono text-[11px]"
                        style={{ background: "rgba(16,185,129,0.15)", color: "#34d399" }}
                      >
                        6CO₂ + 6H₂O + luz → C₆H₁₂O₆ + 6O₂
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { label: "🧮 Calculadora IA", color: "#10b981" },
                        { label: "⚡ Lab de Circuitos", color: "#f59e0b" },
                        { label: "⚛️ Estructura de Lewis", color: "#06b6d4" },
                        { label: "🌍 Mapa Interactivo", color: "#6366f1" },
                        { label: "📐 Diagramas de Fuerzas", color: "#8b5cf6" },
                        { label: "🤖 Bot Telegram 24/7", color: "#0ea5e9" },
                        { label: "🎮 Simulador ECOEMS", color: "#ec4899" }
                      ].map((tag) => (
                        <span
                          key={tag.label}
                          className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider cursor-pointer hover:opacity-80 transition-opacity"
                          style={{
                            background: `${tag.color}20`,
                            color: tag.color,
                            border: `1px solid ${tag.color}30`
                          }}
                        >
                          {tag.label}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Input bar */}
              <div className="px-5 pb-5">
                <div
                  className="flex items-center gap-3 px-4 py-3 rounded-2xl"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                >
                  <span className="text-sm text-slate-500 flex-1">Pregunta algo al Tutor IA...</span>
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center"
                    style={{ background: "linear-gradient(135deg, #10b981, #06b6d4)" }}
                  >
                    <ArrowRight className="h-4 w-4 text-white" />
                  </div>
                </div>
              </div>

              {/* Bottom gradient fade */}
              <div className="absolute bottom-0 left-0 right-0 h-6 pointer-events-none" style={{ background: "linear-gradient(to top, #020617, transparent)" }} />
            </div>
          </div>

        </div>
      </section>

      {/* 2. Problem -> Solution Section */}
      <section className="py-24 bg-slate-900 border-y border-white/5">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 text-rose-400 text-xs font-black uppercase tracking-widest bg-rose-500/10 px-3 py-1 rounded-lg">
                <Target className="h-4 w-4" /> El Reto Real
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-white leading-tight">
                Más de 300,000 estudiantes compiten por pocas plazas.
              </h2>
              <p className="text-slate-400 text-lg leading-relaxed">
                Estudiar con guías de papel desactualizadas ya no es suficiente. El nivel de competencia exige herramientas modernas que se adapten a tu ritmo de aprendizaje.
              </p>
            </div>
            
            <div className="glass-card-premium p-8 rounded-3xl border-primary/20 bg-primary/5 space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-10">
                <Brain className="h-32 w-32 text-primary" />
              </div>
              <div className="inline-flex items-center gap-2 text-emerald-400 text-xs font-black uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-lg relative z-10">
                <Zap className="h-4 w-4" /> La Solución
              </div>
              <h3 className="text-2xl font-black text-white relative z-10">
                CyberEdu MX te prepara con Inteligencia Artificial
              </h3>
              <p className="text-slate-300 relative z-10">
                Hemos digitalizado todo el proceso. Te explicamos cada tema al instante, analizamos tus simulacros y creamos un plan de estudio personalizado para garantizar tu éxito.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Features Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
              Todo lo que necesitas para aprobar
            </h2>
            <p className="text-slate-400 font-medium">Herramientas tecnológicas diseñadas específicamente para el ECOEMS.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <div key={idx} className="bg-slate-900 border border-white/5 hover:border-white/20 transition-all duration-300 p-8 rounded-3xl group">
                <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Testimonials Section */}
      <section className="py-24 bg-slate-900 border-y border-white/5 relative overflow-hidden">
         {/* Background Elements */}
         <div className="absolute top-0 right-1/4 w-[300px] h-[300px] bg-amber-500/10 blur-[100px] rounded-full pointer-events-none" />
         
        <div className="container mx-auto px-4 max-w-5xl relative z-10">
          <div className="text-center mb-16">
             <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
               Casos de Éxito
             </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((test, idx) => (
              <div key={idx} className="bg-slate-950 p-8 rounded-3xl border border-white/5 relative">
                <Quote className="absolute top-6 right-6 h-12 w-12 text-white/5" />
                <div className="flex gap-1 mb-6">
                  {[...Array(test.stars)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-lg text-slate-300 font-medium mb-6">
                  "{test.text}"
                </p>
                <div>
                  <h4 className="font-bold text-white">{test.name}</h4>
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">{test.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Pricing Section */}
      <section id="precios" className="py-24 relative">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
         
        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
              Precios Transparentes
            </h2>
            <p className="text-slate-400 font-medium">Elige el plan que mejor se adapte a tu ritmo de estudio.</p>
          </div>

          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4">
            {pricingPlans.map((plan, idx) => (
              <Card 
                key={idx} 
                className={`flex flex-col bg-slate-900 border-white/10 relative overflow-hidden ${
                  plan.highlight ? 'ring-2 ring-amber-500/50 shadow-2xl shadow-amber-500/10 scale-105 z-10' : ''
                }`}
              >
                {plan.badge && (
                  <div className="absolute top-5 right-[-35px] rotate-45 bg-amber-500 text-black text-[10px] font-black uppercase py-1 px-10 shadow-lg">
                    {plan.badge}
                  </div>
                )}
                
                <CardHeader className="p-6">
                  <div className="mb-4">{plan.icon}</div>
                  <CardTitle className="text-xl font-black text-white uppercase tracking-tight">{plan.name}</CardTitle>
                  <CardDescription className="text-slate-400 min-h-[40px]">{plan.description}</CardDescription>
                </CardHeader>
                
                <CardContent className="p-6 pt-0 flex-1 space-y-6">
                  <div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-sm font-bold text-slate-500">$</span>
                      <span className="text-4xl font-black text-white">{plan.price}</span>
                      <span className="text-xs text-slate-500 font-bold uppercase tracking-widest">MXN</span>
                    </div>
                    <p className="text-xs font-black uppercase tracking-widest text-primary mt-2">{plan.tokens}</p>
                  </div>
                  
                  <ul className="space-y-3 pt-4 border-t border-white/5">
                    {plan.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs font-medium text-slate-300">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                
                <CardFooter className="p-6 pt-0">
                  <Button 
                    onClick={plan.action}
                    className={`w-full font-black uppercase tracking-widest text-[10px] h-12 rounded-xl transition-all ${
                      plan.highlight 
                        ? 'bg-amber-500 hover:bg-amber-400 text-black' 
                        : 'bg-white/5 hover:bg-white/10 text-white'
                    }`}
                  >
                    {plan.cta}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Bottom CTA */}
      <section className="py-24 bg-gradient-to-t from-primary/20 to-slate-950 border-t border-white/5">
        <div className="container mx-auto px-4 max-w-4xl text-center space-y-8">
          <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter">
            Tu futuro comienza aquí.
          </h2>
          <p className="text-xl text-slate-400">
            Únete a la nueva generación de estudiantes y asegura tu lugar.
          </p>
          <Button 
            onClick={() => navigate("/auth")}
            className="h-16 px-10 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-[0.2em] shadow-[0_0_50px_rgba(var(--primary),0.4)] hover:scale-105 transition-all text-sm"
          >
            Empezar Gratis Ahora
          </Button>
        </div>
      </section>

      {/* 7. Footer Minimal */}
      <footer className="bg-slate-950 py-12 border-t border-white/5">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-slate-500" />
            <span className="font-black text-slate-500 uppercase tracking-widest text-xs">CyberEdu MX © {new Date().getFullYear()}</span>
          </div>
          <div className="flex gap-6 text-xs font-bold uppercase tracking-widest text-slate-600">
            <a href="/auth" className="hover:text-primary transition-colors">Iniciar Sesión</a>
            <a href="/tokens" className="hover:text-primary transition-colors">Precios</a>
            <a href="/marketing" className="hover:text-primary transition-colors">Contacto</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
