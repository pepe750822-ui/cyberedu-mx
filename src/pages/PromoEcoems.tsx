import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GraduationCap, ArrowRight, Brain, Target, ShieldCheck, CheckCircle2, PlayCircle, Star, Sparkles, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

const PromoEcoems = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Preparación ECOEMS 2026 - CyberEdu MX";
    // Scroll to top on load
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 selection:bg-emerald-500/30 selection:text-emerald-200 text-slate-200">
      
      {/* Top Banner */}
      <div className="bg-emerald-500 text-slate-950 py-2 px-4 text-center text-xs md:text-sm font-black uppercase tracking-widest animate-pulse">
        🔥 OFERTA ESPECIAL: OBTÉN ACCESO DE POR VIDA AL CURSO PREMIUM HOY 🔥
      </div>

      {/* Navigation (Simplified for Landing Page) */}
      <nav className="container mx-auto px-4 h-20 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-xl">
            <GraduationCap className="h-6 w-6 text-slate-950" />
          </div>
          <span className="text-xl font-black text-white tracking-tight">CyberEdu MX</span>
        </div>
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/auth")}
            className="hidden md:flex text-slate-400 hover:text-white font-bold uppercase tracking-wider text-xs"
          >
            Ya soy alumno
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-emerald-500/20 blur-[120px] rounded-[100%] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-teal-600/10 blur-[100px] rounded-[100%] pointer-events-none" />
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-8 mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Star className="h-4 w-4 fill-emerald-400" />
            <span className="text-xs font-black uppercase tracking-[0.2em]">Más de 5,000 alumnos preparados</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-8 leading-[1.1] animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-150 max-w-5xl mx-auto text-balance">
            ASEGURA TU LUGAR EN EL <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400">
              EXAMEN DE INGRESO 2026
            </span>
          </h1>

          <p className="text-lg md:text-2xl text-slate-400 mb-12 max-w-3xl mx-auto leading-relaxed font-medium animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-300">
            El único curso que combina <span className="text-emerald-400 font-bold">128 Reactivos Oficiales</span> resueltos paso a paso y un tutor de <span className="text-cyan-400 font-bold">Inteligencia Artificial</span> para resolver todas tus dudas 24/7.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500">
            <a 
              href="https://www.udemy.com/course/ecoems2026conia/?referralCode=B2F05026985A2564FAAC"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-lg uppercase tracking-[0.15em] shadow-[0_10px_40px_rgba(16,185,129,0.3)] hover:shadow-[0_15px_60px_rgba(16,185,129,0.5)] hover:-translate-y-1 transition-all"
            >
              <Target className="h-6 w-6" />
              INSCRIBIRME AHORA
            </a>
            <Button 
              variant="outline"
              onClick={() => navigate("/auth")}
              className="w-full sm:w-auto h-[68px] px-8 rounded-2xl bg-white/5 border-white/10 hover:bg-white/10 text-white font-bold uppercase tracking-widest transition-all"
            >
              PROBAR GRATIS
            </Button>
          </div>

          {/* Social Proof */}
          <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-slate-500 font-bold uppercase tracking-widest text-xs animate-in fade-in duration-1000 delay-700">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-500" />
              <span>Garantía de Satisfacción</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-teal-500" />
              <span>Alta tasa de Aprobación</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-slate-900 border-t border-white/5 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter mb-4">
              ¿Por qué somos diferentes?
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">No somos solo guías en PDF. Somos una plataforma interactiva diseñada para que entiendas, no solo memorices.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Feature 1 */}
            <div className="bg-slate-950 border border-white/10 p-8 rounded-[2rem] hover:border-emerald-500/30 transition-colors">
              <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-6">
                <Target className="h-7 w-7 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">128 Reactivos Reales</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Practica con preguntas del mismo nivel de dificultad que el examen real. Explicadas en video, paso a paso, para que no quede ninguna duda.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-slate-950 border border-white/10 p-8 rounded-[2rem] hover:border-teal-500/30 transition-colors">
              <div className="h-14 w-14 rounded-2xl bg-teal-500/10 flex items-center justify-center mb-6">
                <Brain className="h-7 w-7 text-teal-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Tutor con IA (NotebookLM)</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                El único curso que integra Inteligencia Artificial para explicarte los temas más difíciles como si tuvieras un profesor particular 24/7 a tu lado.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-slate-950 border border-white/10 p-8 rounded-[2rem] hover:border-cyan-500/30 transition-colors">
              <div className="h-14 w-14 rounded-2xl bg-cyan-500/10 flex items-center justify-center mb-6">
                <PlayCircle className="h-7 w-7 text-cyan-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Simulador Interactivo</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Mide tu progreso. La plataforma analiza tus respuestas y te dice exactamente en qué temas debes enfocarte para asegurar tu lugar.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Inside Platform Preview */}
      <section className="py-24 bg-slate-950">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-br from-emerald-900/40 to-slate-900 border border-emerald-500/20 rounded-[3rem] p-8 md:p-16 max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 space-y-8">
              <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter leading-tight">
                Estudia <span className="text-emerald-400">cuando quieras</span> y donde quieras.
              </h2>
              
              <ul className="space-y-4">
                {[
                  "Acceso desde Computadora, Tablet o Celular.",
                  "Actualizaciones gratuitas de por vida.",
                  "Certificado de finalización oficial.",
                  "Garantía de reembolso de 30 días."
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-300 font-medium">
                    <CheckCircle2 className="h-6 w-6 text-emerald-500 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-4">
                <a 
                  href="https://www.udemy.com/course/ecoems2026conia/?referralCode=B2F05026985A2564FAAC"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm uppercase tracking-[0.1em] transition-all"
                >
                  Ver el temario completo
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>
            
            <div className="flex-1 w-full">
              {/* Dummy UI Representation */}
              <div className="relative aspect-video rounded-2xl bg-slate-900 border-2 border-slate-800 shadow-2xl overflow-hidden flex items-center justify-center group">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1000')] bg-cover bg-center opacity-40 mix-blend-overlay group-hover:scale-105 transition-transform duration-700" />
                <div className="relative z-10 h-20 w-20 rounded-full bg-emerald-500/20 backdrop-blur-md flex items-center justify-center border border-emerald-500/50 cursor-pointer group-hover:scale-110 transition-transform">
                  <PlayCircle className="h-10 w-10 text-emerald-400 ml-1" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Minimal */}
      <footer className="py-8 border-t border-white/5 text-center text-slate-600 text-xs font-bold uppercase tracking-widest">
        <p>© {new Date().getFullYear()} CyberEdu MX. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
};

export default PromoEcoems;
