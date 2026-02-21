import React from "react";
import {
    GraduationCap,
    Zap,
    Trophy,
    Flame,
    Calendar,
    ArrowRight,
    Sparkles,
    Mail,
    Bell,
    BookOpen,
    Target,
    Key
} from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Nota: Estos componentes simulan el diseño visual de los correos electrónicos
 * para ser mostrados dentro de la aplicación como previsualización.
 */

// --- 1. BIENVENIDA ---
export const WelcomeEmailTemplate = ({ name = "Estudiante" }) => (
    <div className="max-w-xl mx-auto bg-slate-950 border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl font-sans">
        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-8 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                <div className="absolute top-[-50px] right-[-50px] w-[200px] h-[200px] bg-white rounded-full blur-[80px]" />
            </div>
            <div className="relative z-10">
                <div className="inline-flex p-3 bg-white/20 backdrop-blur-md rounded-2xl mb-4 border border-white/30">
                    <GraduationCap className="h-8 w-8 text-white" />
                </div>
                <h1 className="text-3xl font-black text-white uppercase tracking-tighter leading-tight">
                    ¡Bienvenido a <br /><span className="text-indigo-200">CyberEdu MX</span>!
                </h1>
            </div>
        </div>
        <div className="p-8 space-y-6">
            <div className="space-y-2">
                <p className="text-slate-400 text-xs font-black uppercase tracking-widest text-indigo-400">Paso 1: Iniciando tu camino</p>
                <h2 className="text-xl font-bold text-white">Hola, {name} 👋</h2>
                <p className="text-slate-300 text-sm leading-relaxed">
                    Estamos emocionados de acompañarte en este viaje hacia el éxito escolar. PrepáraTE es la plataforma definitiva para conquistar el examen **ECOEMS 2026**.
                </p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Próximos pasos recomendados:</p>
                {[
                    { text: "Completa tu primer cuestionario de diagnóstico", icon: Target },
                    { text: "Explora las 128 preguntas resueltas", icon: BookOpen },
                    { text: "Activa tu Llave MX (Requisito Obligatorio)", icon: Zap }
                ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm text-slate-200 group">
                        <div className="p-1.5 bg-indigo-500/10 rounded-lg text-indigo-400">
                            <item.icon className="h-4 w-4" />
                        </div>
                        <span>{item.text}</span>
                    </div>
                ))}
            </div>
            <button className="w-full bg-white text-slate-950 font-black py-4 rounded-xl uppercase tracking-widest text-xs hover:bg-slate-200 transition-colors">
                Acceder a mi Panel
            </button>
        </div>
    </div>
);

// --- 2. RESUMEN SEMANAL ---
export const WeeklyProgressEmailTemplate = ({ stats = { streak: 5, progress: 42, time: "3h 15m" } }) => (
    <div className="max-w-xl mx-auto bg-slate-950 border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl font-sans">
        <div className="p-8 bg-gradient-to-br from-emerald-600 to-teal-800 text-white relative overflow-hidden">
            <div className="relative z-10 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-black uppercase tracking-tighter">Tu Resumen Semanal</h1>
                    <p className="text-emerald-100/70 text-xs font-bold mt-1 uppercase tracking-widest">Semana del 16 - 22 Feb</p>
                </div>
                <div className="p-3 bg-white/20 backdrop-blur-md rounded-full border border-white/30">
                    <Trophy className="h-6 w-6" />
                </div>
            </div>
        </div>
        <div className="p-8 grid grid-cols-2 gap-4">
            <div className="p-5 bg-orange-500/10 border border-orange-500/20 rounded-2xl">
                <div className="flex items-center gap-2 mb-2">
                    <Flame className="h-4 w-4 text-orange-500" />
                    <span className="text-[10px] font-black text-orange-400 uppercase tracking-widest">Racha</span>
                </div>
                <p className="text-3xl font-black text-white">{stats.streak} Días</p>
            </div>
            <div className="p-5 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl">
                <div className="flex items-center gap-2 mb-2">
                    <Zap className="h-4 w-4 text-indigo-500" />
                    <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Avance</span>
                </div>
                <p className="text-3xl font-black text-white">{stats.progress}%</p>
            </div>
        </div>
    </div>
);

// --- 3. NEWSLETTER ---
export const NewsletterEmailTemplate = ({
    category = "MATEMÁTICAS",
    title = "Nuevos recursos para Sucesiones",
    content = "Hemos agregado 15 nuevos reactivos tipo examen para el área de Matemáticas. ¡Pon a prueba tu lógica!",
    badge = "Actualización"
}) => {
    const isMath = category.includes("MATEM");
    return (
        <div className="max-w-xl mx-auto bg-slate-950 border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl font-sans">
            <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <div className="p-1 hero-gradient rounded-md">
                            <GraduationCap className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-[11px] font-black uppercase tracking-widest text-white">CyberEdu News</span>
                    </div>
                </div>
                <div className={cn("p-6 rounded-3xl border mb-6", isMath ? "bg-amber-500/5 border-amber-500/20" : "bg-primary/5 border-primary/20")}>
                    <p className={cn("text-[10px] font-black uppercase tracking-widest mb-2", isMath ? "text-amber-500" : "text-primary")}>
                        Enfoque: {category}
                    </p>
                    <h3 className="text-2xl font-black text-white leading-tight mb-3">{title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed mb-6">{content}</p>
                    <button className={cn("px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest", isMath ? "bg-amber-500 text-slate-950" : "bg-primary text-white")}>
                        Ver detalles
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- 4. LLAVE MX URGENTE ---
export const LlaveMXEmailTemplate = ({ name = "Aspirante" }) => (
    <div className="max-w-xl mx-auto bg-slate-950 border border-amber-500/30 rounded-[2rem] overflow-hidden shadow-2xl font-sans">
        <div className="bg-amber-500 p-8 text-center relative">
            <Key className="h-24 w-24 text-white opacity-20 absolute -top-4 -right-4 rotate-12" />
            <h1 className="text-3xl font-black text-slate-950 uppercase tracking-tighter">Requisito Obligatorio</h1>
        </div>
        <div className="p-8 space-y-6">
            <div className="space-y-3">
                <h2 className="text-xl font-bold text-white">Hola, {name} 👋</h2>
                <p className="text-slate-300 text-sm leading-relaxed">
                    La **Llave MX** es indispensable para tu registro ECOEMS 2026. Sin ella, no podrás participar.
                </p>
            </div>
            <div className="space-y-3 bg-white/5 border border-white/10 rounded-2xl p-5">
                {["Crea tu cuenta en llave.gob.mx", "Valida tu CURP", "Activa el código"].map((s, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm text-slate-300">
                        <span className="h-5 w-5 rounded bg-amber-500/20 text-amber-500 flex items-center justify-center text-[10px] font-black">{i + 1}</span>
                        <span>{s}</span>
                    </div>
                ))}
            </div>
            <button className="w-full bg-amber-500 text-slate-950 font-black py-4 rounded-xl uppercase tracking-widest text-xs">
                Acceder a Llave MX
            </button>
        </div>
    </div>
);
