import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { EXANI_FEATURES } from "@/data/exani-i";
import { Button } from "@/components/ui/button";
import { ArrowRight, GraduationCap, Target, Sparkles } from "lucide-react";

const particles = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    x: +((i * 9.1 + 7) % 100).toFixed(1),
    y: +((i * 11.3 + 3) % 100).toFixed(1),
    size: (i % 2) + 1,
    dur: (i % 3) + 3,
    delay: +((i % 4) * 0.8).toFixed(1),
}));

export default function ExaniI() {
    const navigate = useNavigate();
    const { user, profile } = useAuth();
    const [mouseX, setMouseX] = useState(0);
    const [mouseY, setMouseY] = useState(0);

    useEffect(() => {
        const onMove = (e: MouseEvent) => { setMouseX(e.clientX); setMouseY(e.clientY); };
        window.addEventListener('mousemove', onMove);
        return () => window.removeEventListener('mousemove', onMove);
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white overflow-x-hidden">
            <div className="fixed inset-0 pointer-events-none">
                {particles.map((p) => (
                    <div
                        key={p.id}
                        className="absolute w-1 h-1 bg-teal-400/20 rounded-full"
                        style={{
                            left: `${p.x}%`,
                            top: `${p.y}%`,
                            animation: `pulse ${p.dur}s ease-in-out infinite`,
                            animationDelay: `${p.delay}s`,
                        }}
                    />
                ))}
            </div>

            <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
                <nav className="flex items-center justify-between mb-16">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-lg font-bold shadow-lg shadow-teal-500/20">
                            E
                        </div>
                        <span className="text-lg font-semibold text-white/80">EXANI-I</span>
                    </div>
                    <div className="flex items-center gap-3">
                        {user ? (
                            <Link to="/" className="text-sm text-white/50 hover:text-white/80 transition-colors">
                                ← ECOEMS
                            </Link>
                        ) : (
                            <Button onClick={() => navigate('/auth')} size="sm" variant="outline" className="border-teal-500/30 text-teal-400 hover:bg-teal-500/10">
                                Iniciar Sesión
                            </Button>
                        )}
                    </div>
                </nav>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-20"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-sm mb-6">
                        <Target className="w-4 h-4" />
                        Nueva plataforma de preparación
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-teal-400 via-emerald-300 to-cyan-400 bg-clip-text text-transparent">
                        EXANI-I
                    </h1>
                    <p className="text-xl text-white/60 max-w-2xl mx-auto mb-6">
                        130 reactivos · 4 áreas · 4 horas. Prepárate con simuladores, práctica por tema, guía de estudio y más.
                    </p>
                    <div className="flex flex-wrap justify-center gap-3 mb-8">
                        {['Pensamiento científico 30', 'Comprensión lectora 30', 'Redacción indirecta 30', 'Pensamiento matemático 40', 'Inglés 30*'].map(a => (
                            <span key={a} className="px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-semibold">
                                {a.replace(' ', ' ​')}
                            </span>
                        ))}
                        <span className="text-white/20 text-xs self-center ml-1">*diagnóstico</span>
                    </div>
                    <div className="flex items-center justify-center gap-3 flex-wrap">
                        <Button onClick={() => navigate('/simulador-pro?examen=exani-i')} size="lg" className="bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-white shadow-lg shadow-teal-500/25">
                            Comenzar Simulador <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                        <Button onClick={() => navigate('/practica-subindice?examen=exani-i')} size="lg" variant="outline" className="border-teal-500/30 text-teal-400 hover:bg-teal-500/10">
                            Practicar por Tema
                        </Button>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-20">
                    {EXANI_FEATURES.map((f, i) => (
                        <motion.div
                            key={f.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: i * 0.05 }}
                            onClick={() => navigate(f.ruta)}
                            className="group cursor-pointer relative overflow-hidden rounded-2xl border border-white/5 bg-white/[0.03] hover:bg-white/[0.06] hover:border-teal-500/20 transition-all p-6"
                        >
                            <div
                                className="absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none"
                                style={{
                                    background: `radial-gradient(400px circle at ${mouseX}px ${mouseY}px, rgba(20,184,166,0.06), transparent 40%)`,
                                }}
                            />
                            <div className="relative z-10">
                                <div className="text-3xl mb-4">{f.icono}</div>
                                <h3 className="text-lg font-semibold text-white/90 mb-2">{f.titulo}</h3>
                                <p className="text-sm text-white/40">{f.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="text-center py-12 border-t border-white/5">
                    <div className="flex items-center justify-center gap-4 flex-wrap">
                        <Sparkles className="w-5 h-5 text-teal-400" />
                        <span className="text-white/40 text-sm">
                            ¿Prefieres prepararte para ECOEMS?{' '}
                            <Link to="/" className="text-teal-400 hover:text-teal-300 underline underline-offset-2">
                                Volver al inicio
                            </Link>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
