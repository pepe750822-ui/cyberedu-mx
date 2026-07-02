import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { EXANI_FEATURES } from "@/data/exani-i";
import { Button } from "@/components/ui/button";
import { ArrowRight, Target, Sparkles } from "lucide-react";

const particles = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    x: +((i * 9.1 + 7) % 100).toFixed(1),
    y: +((i * 11.3 + 3) % 100).toFixed(1),
    size: (i % 2) + 1,
    dur: (i % 3) + 3,
    delay: +((i % 4) * 0.8).toFixed(1),
}));

// ── Variants ──────────────────────────────────────────────────────────────────

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

const stagger = {
    hidden: {},
    show:   { transition: { staggerChildren: 0.09, delayChildren: 0.15 } },
};

const staggerFast = {
    hidden: {},
    show:   { transition: { staggerChildren: 0.07 } },
};

// ── Counter component ─────────────────────────────────────────────────────────

function Counter({ to, duration = 1.4 }: { to: number; duration?: number }) {
    const ref = useRef<HTMLSpanElement>(null);
    const inView = useInView(ref, { once: true });
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!inView) return;
        const start = Date.now();
        const timer = setInterval(() => {
            const elapsed = (Date.now() - start) / 1000;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(eased * to));
            if (progress >= 1) clearInterval(timer);
        }, 16);
        return () => clearInterval(timer);
    }, [inView, to, duration]);

    return <span ref={ref}>{count}</span>;
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function ExaniI() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [mouseX, setMouseX] = useState(0);
    const [mouseY, setMouseY] = useState(0);

    useEffect(() => {
        const onMove = (e: MouseEvent) => { setMouseX(e.clientX); setMouseY(e.clientY); };
        window.addEventListener('mousemove', onMove);
        return () => window.removeEventListener('mousemove', onMove);
    }, []);

    const areaPills = [
        'Pensamiento científico 30',
        'Comprensión lectora 30',
        'Redacción indirecta 30',
        'Pensamiento matemático 40',
        'Inglés 30*',
    ];

    const stats = [
        { n: 550, suffix: '+', label: 'preguntas' },
        { n: 7,   suffix: '',  label: 'herramientas' },
        { n: 130, suffix: '',  label: 'reactivos examen real' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white overflow-x-hidden">
            {/* Particles */}
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
                {/* Nav */}
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

                {/* ── 1. Hero — fade-in + slide-up ── */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                    className="text-center mb-16"
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

                    {/* ── 2. Area pills — stagger ── */}
                    <motion.div
                        className="flex flex-wrap justify-center gap-3 mb-8"
                        initial="hidden"
                        animate="show"
                        variants={stagger}
                    >
                        {areaPills.map((a) => (
                            <motion.span
                                key={a}
                                variants={fadeUp}
                                className="px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-semibold"
                            >
                                {a}
                            </motion.span>
                        ))}
                        <motion.span variants={fadeUp} className="text-white/20 text-xs self-center ml-1">
                            *diagnóstico
                        </motion.span>
                    </motion.div>

                    {/* CTA buttons */}
                    <div className="flex items-center justify-center gap-3 flex-wrap">
                        {/* ── 5. CTA pulse ── */}
                        <motion.div
                            animate={{ scale: [1, 1.04, 1] }}
                            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut', repeatDelay: 0.8 }}
                        >
                            <Button
                                onClick={() => navigate('/simulador-pro?examen=exani-i')}
                                size="lg"
                                className="bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-white shadow-lg shadow-teal-500/25"
                            >
                                Comenzar Simulador <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </motion.div>
                        <Button
                            onClick={() => navigate('/practica-subindice?examen=exani-i')}
                            size="lg"
                            variant="outline"
                            className="border-teal-500/30 text-teal-400 hover:bg-teal-500/10"
                        >
                            Practicar por Tema
                        </Button>
                    </div>
                </motion.div>

                {/* ── 4. Stats — counter animation al entrar en viewport ── */}
                <motion.div
                    className="grid grid-cols-3 gap-4 mb-16"
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: '-60px' }}
                    variants={staggerFast}
                >
                    {stats.map((s) => (
                        <motion.div
                            key={s.label}
                            variants={fadeUp}
                            className="text-center py-5 rounded-2xl bg-white/[0.03] border border-white/5"
                        >
                            <div className="text-3xl font-bold text-teal-400 font-mono">
                                <Counter to={s.n} />{s.suffix}
                            </div>
                            <div className="text-xs text-white/40 mt-1">{s.label}</div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* ── 2+3. Feature cards — whileInView stagger + hover scale ── */}
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-20"
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: '-80px' }}
                    variants={staggerFast}
                >
                    {EXANI_FEATURES.map((f) => (
                        <motion.div
                            key={f.id}
                            variants={fadeUp}
                            whileHover={{ scale: 1.03, y: -5, transition: { duration: 0.2 } }}
                            onClick={() => navigate(f.ruta)}
                            className="group cursor-pointer relative overflow-hidden rounded-2xl border border-white/5 bg-white/[0.03] hover:bg-white/[0.06] hover:border-teal-500/20 transition-colors p-6"
                            style={{ boxShadow: '0 0 0 rgba(20,184,166,0)' }}
                        >
                            <motion.div
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
                </motion.div>

                {/* Footer */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center py-12 border-t border-white/5"
                >
                    <div className="flex items-center justify-center gap-4 flex-wrap">
                        <Sparkles className="w-5 h-5 text-teal-400" />
                        <span className="text-white/40 text-sm">
                            ¿Prefieres prepararte para ECOEMS?{' '}
                            <Link to="/" className="text-teal-400 hover:text-teal-300 underline underline-offset-2">
                                Volver al inicio
                            </Link>
                        </span>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
