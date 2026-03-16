import React, { useState } from "react";
import {
    Bell,
    Calendar,
    Info,
    ExternalLink,
    AlertCircle,
    FileText,
    Clock,
    Sparkles,
    ArrowRight,
    Trophy,
    GraduationCap,
    TrendingUp,
    ChevronDown,
    ChevronUp,
    School,
    Target,
    Key,
    MapPin
} from "lucide-react";
import { cn } from "@/lib/utils";

type ScoreCategory = "enp" | "cch" | "cecyt";

interface SchoolScore {
    name: string;
    code?: string;
    min: number;
    difficulty: "extreme" | "high" | "medium" | "accessible";
}

const scoreData: Record<ScoreCategory, { title: string; subtitle: string; color: string; borderColor: string; bgColor: string; icon: React.ElementType; schools: SchoolScore[] }> = {
    enp: {
        title: "Prepas UNAM (ENP) — 9 Planteles",
        subtitle: "Rango: 94-111 aciertos",
        color: "text-blue-400",
        borderColor: "border-blue-500/30",
        bgColor: "bg-blue-500/10",
        icon: GraduationCap,
        schools: [
            { name: "ENP 6 — \"Antonio Caso\"", code: "U603000", min: 111, difficulty: "extreme" },
            { name: "ENP 9 — \"Pedro de Alba\"", min: 108, difficulty: "extreme" },
            { name: "ENP 2 — \"Erasmo C. de Romo\"", min: 105, difficulty: "extreme" },
            { name: "ENP 5 — \"José Vasconcelos\"", min: 103, difficulty: "high" },
            { name: "ENP 1 — \"Gabino Barreda\"", min: 101, difficulty: "high" },
            { name: "ENP 7 — \"Ezequiel A. Chávez\"", min: 100, difficulty: "high" },
            { name: "ENP 3 — \"Justo Sierra\"", min: 98, difficulty: "medium" },
            { name: "ENP 8 — \"Miguel E. Schulz\"", min: 96, difficulty: "medium" },
            { name: "ENP 4 — \"Vidal Castañeda\"", min: 94, difficulty: "medium" },
        ]
    },
    cch: {
        title: "CCH UNAM — 5 Planteles",
        subtitle: "Rango: 84-94 aciertos",
        color: "text-amber-400",
        borderColor: "border-amber-500/30",
        bgColor: "bg-amber-500/10",
        icon: School,
        schools: [
            { name: "CCH Sur", min: 94, difficulty: "high" },
            { name: "CCH Oriente", min: 93, difficulty: "high" },
            { name: "CCH Vallejo", min: 90, difficulty: "medium" },
            { name: "CCH Azcapotzalco", min: 89, difficulty: "medium" },
            { name: "CCH Naucalpan", min: 84, difficulty: "accessible" },
        ]
    },
    cecyt: {
        title: "CECyT (Vocacionales) IPN — 15 Planteles",
        subtitle: "Rango: 80-104 aciertos",
        color: "text-rose-400",
        borderColor: "border-rose-500/30",
        bgColor: "bg-rose-500/10",
        icon: Target,
        schools: [
            { name: "CECyT 9 — \"Juan de Dios Bátiz\"", min: 104, difficulty: "extreme" },
            { name: "CECyT 7 — \"Cuauhtémoc\"", min: 98, difficulty: "high" },
            { name: "CECyT 6 — \"Miguel Othón de M.\"", min: 95, difficulty: "high" },
            { name: "CECyT 1 — \"Gonzalo V. López\"", min: 92, difficulty: "medium" },
            { name: "CECyT 2 — \"Miguel Bernard\"", min: 90, difficulty: "medium" },
            { name: "CECyT 3 — \"Estanislao Ramírez\"", min: 88, difficulty: "medium" },
            { name: "CECyT 4 — \"Lázaro Cárdenas\"", min: 86, difficulty: "accessible" },
            { name: "CECyT 10 — \"Carlos Vallejo\"", min: 85, difficulty: "accessible" },
            { name: "CECyT 11 — \"Wilfrido Massieu\"", min: 84, difficulty: "accessible" },
            { name: "CECyT 12 — \"José Ma. Morelos\"", min: 82, difficulty: "accessible" },
            { name: "CECyT 14 — \"Luis Enrique Erro\"", min: 81, difficulty: "accessible" },
            { name: "CECyT 15 — \"Diódoro A. Guzmán\"", min: 80, difficulty: "accessible" },
        ]
    }
};

const difficultyConfig = {
    extreme: { label: "MUY ALTA", color: "text-red-400 bg-red-500/20 border-red-500/30" },
    high: { label: "ALTA", color: "text-orange-400 bg-orange-500/20 border-orange-500/30" },
    medium: { label: "MEDIA", color: "text-amber-400 bg-amber-500/20 border-amber-500/30" },
    accessible: { label: "ACCESIBLE", color: "text-emerald-400 bg-emerald-500/20 border-emerald-500/30" },
};

const alcaldiasData = [
    {
        name: "Gustavo A. Madero",
        unam: ["ENP 3", "ENP 9", "CCH Vallejo"],
        ipn: ["CECyT 1", "CECyT 10"],
        otras: ["CETIS", "Colbach", "CONALEP"]
    },
    {
        name: "Coyoacán",
        unam: ["ENP 6", "CCH Sur"],
        ipn: ["CECyT 13"],
        otras: ["CETIS 2", "Colbach 4"]
    },
    {
        name: "Miguel Hidalgo",
        unam: ["ENP 4"],
        ipn: ["CECyT 2", "CECyT 9", "CECyT 11"],
        otras: ["CONALEP", "CETIS"]
    },
    {
        name: "Azcapotzalco",
        unam: ["CCH Azcapotzalco"],
        ipn: ["CECyT 6", "CECyT 8"],
        otras: ["Colbach 1", "CONALEP"]
    },
    {
        name: "Iztapalapa",
        unam: ["CCH Oriente"],
        ipn: ["CECyT 7"],
        otras: ["Colbach 6 y 7", "CETIS"]
    },
    {
        name: "Álvaro Obregón",
        unam: ["ENP 8"],
        ipn: ["CECyT 4"],
        otras: ["CETIS 10", "Colbach"]
    },
    {
        name: "Venustiano Carranza",
        unam: ["ENP 7"],
        ipn: ["CECyT 14"],
        otras: ["Colbach 3", "CETIS"]
    },
    {
        name: "Iztacalco",
        unam: ["ENP 2"],
        ipn: [],
        otras: ["Colbach 10", "CETIS 31"]
    },
    {
        name: "Tlalpan",
        unam: ["ENP 5"],
        ipn: [],
        otras: ["Colbach 15", "CONALEP"]
    },
    {
        name: "Xochimilco",
        unam: ["ENP 1"],
        ipn: [],
        otras: ["Colbach 13", "CONALEP"]
    },
    {
        name: "Cuauhtémoc",
        unam: [],
        ipn: ["CECyT 5", "CECyT 12"],
        otras: ["CETIS 11", "Colbach"]
    },
    {
        name: "Milpa Alta",
        unam: [],
        ipn: ["CECyT 15"],
        otras: ["CETIS", "CONALEP"]
    },
    {
        name: "Estado de México",
        unam: ["CCH Naucalpan"],
        ipn: ["CECyT 3 (Ecatepec)"],
        otras: ["COBAEM", "CONALEP"]
    }
];

const NewsECOEMS = () => {
    const [activeTab, setActiveTab] = useState<ScoreCategory>("enp");
    const [showScores, setShowScores] = useState(false);
    const [showAlcaldias, setShowAlcaldias] = useState(false);

    const dates = [
        { event: "Publicación de Convocatoria", date: "13 Feb 2026", status: "completed" },
        { event: "Registro de Aspirantes", date: "17 Mar - 14 Abr", status: "upcoming" },
        { event: "Conclusión de Registro (UNAM/IPN)", date: "18 - 22 May", status: "upcoming" },
        { event: "Aplicación Examen Digital", date: "20, 21, 27, 28 Jun", status: "upcoming" },
        { event: "Publicación de Resultados", date: "18 Ago 2026", status: "upcoming" }
    ];

    const active = scoreData[activeTab];

    return (
        <div className="bg-card/40 backdrop-blur-xl border border-border/50 rounded-[2.5rem] p-8 md:p-10 relative overflow-hidden group">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <Bell className="h-40 w-40 text-primary -rotate-12" />
            </div>

            <div className="relative z-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                            </span>
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500">Noticias de Última Hora</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-white">
                            Convocatoria <span className="text-primary italic">ECOEMS 2026</span>
                        </h2>
                    </div>
                    <a
                        href="https://miderechomilugar.gob.mx"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 px-6 py-3 rounded-2xl transition-all group/btn"
                    >
                        <span className="text-sm font-black uppercase tracking-widest">Portal Oficial</span>
                        <ExternalLink className="h-4 w-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                    </a>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-7 space-y-6">
                        <div className="p-6 rounded-3xl bg-primary/5 border border-primary/20 space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary/20 rounded-xl text-primary">
                                    <AlertCircle className="h-5 w-5" />
                                </div>
                                <h3 className="text-lg font-black uppercase tracking-tight text-white">¡Adiós COMIPEMS!</h3>
                            </div>
                            <p className="text-sm text-slate-300 leading-relaxed">
                                El nuevo proceso **ECOEMS** sustituye definitivamente al COMIPEMS. Ahora el registro y seguimiento se centraliza en la plataforma **"Mi Derecho Mi Lugar"**.
                                Es vital que actualices tus datos y descargues la nueva guía oficial.
                            </p>
                        </div>

                        {/* Recordatorio de Inscripción */}
                        <div className="p-6 rounded-3xl bg-blue-500/10 border border-blue-500/20 space-y-4 relative overflow-hidden group/date">
                            <div className="absolute -right-4 -top-4 opacity-10 group-hover/date:opacity-20 transition-all group-hover/date:scale-110">
                                <Calendar className="h-24 w-24 text-blue-500" />
                            </div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="p-2 bg-blue-500/20 rounded-xl text-blue-500 flex items-center justify-center">
                                        <AlertCircle className="h-5 w-5 animate-pulse" />
                                    </div>
                                    <h3 className="text-lg font-black uppercase tracking-tight text-white">¡No olvides tu inscripción!</h3>
                                </div>
                                <p className="text-sm text-slate-300 leading-relaxed">
                                    El <strong className="text-white">Registro de Aspirantes</strong> estará habilitado del <span className="text-blue-400 font-black">17 de Marzo al 14 de Abril de 2026</span>. Te sugerimos tener todos tus documentos a la mano.
                                </p>
                            </div>
                        </div>

                        {/* Nueva sección Llave MX */}
                        <div className="p-6 rounded-3xl bg-amber-500/10 border border-amber-500/20 space-y-4 relative overflow-hidden group/llave">
                            <div className="absolute -right-4 -top-4 opacity-10 group-hover/llave:opacity-20 transition-all group-hover/llave:scale-110 group-hover/llave:rotate-12">
                                <Key className="h-24 w-24 text-amber-500" />
                            </div>

                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="p-2 bg-amber-500/20 rounded-xl text-amber-500">
                                        <Key className="h-5 w-5" />
                                    </div>
                                    <h3 className="text-lg font-black uppercase tracking-tight text-white">Llave MX: Requisito Obligatorio</h3>
                                </div>
                                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                                    Identidad digital única para validar tu identidad y completar tu registro en la plataforma **Mi Derecho Mi Lugar**. Es fundamental tenerla activa antes del pre-registro.
                                </p>

                                <div className="space-y-2.5">
                                    {[
                                        "Ingresa al portal oficial llave.gob.mx",
                                        "Valida tus datos (CURP, domicilio, tel y correo)",
                                        "Verifica tu cuenta mediante el código enviado"
                                    ].map((step, i) => (
                                        <div key={i} className="flex items-center gap-3 text-[11px] text-slate-400 group/step">
                                            <span className="h-6 w-6 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-[10px] font-black text-amber-500 shrink-0 group-hover/step:bg-amber-500 group-hover/step:text-slate-900 transition-colors">
                                                {i + 1}
                                            </span>
                                            <span className="group-hover/step:text-slate-200 transition-colors">{step}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-5 flex items-center gap-4">
                                    <a
                                        href="https://llave.gob.mx"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 bg-amber-500 text-slate-900 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-amber-400 transition-colors"
                                    >
                                        Crear mi Llave MX
                                        <ExternalLink className="h-3.5 w-3.5" />
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/30 transition-colors group/item">
                                <div className="flex items-center gap-3 mb-2">
                                    <Sparkles className="h-4 w-4 text-amber-500" />
                                    <h4 className="text-xs font-black uppercase tracking-widest text-white">Examen Digital</h4>
                                </div>
                                <p className="text-[11px] text-slate-400 leading-relaxed italic">
                                    UNAM e IPN aplicarán su propio examen bajo este nuevo esquema coordinado.
                                </p>
                            </div>
                            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-500/30 transition-colors group/item">
                                <div className="flex items-center gap-3 mb-2">
                                    <Info className="h-4 w-4 text-emerald-500" />
                                    <h4 className="text-xs font-black uppercase tracking-widest text-white">Opciones Sin Examen</h4>
                                </div>
                                <p className="text-[11px] text-slate-400 leading-relaxed italic">
                                    Se mantiene el acceso directo a otras instituciones bajo el principio de "Mi Derecho".
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Calendar Sidebar */}
                    <div className="lg:col-span-5 space-y-6">
                        <div className="bg-slate-900/50 p-6 rounded-3xl border border-white/10">
                            <div className="flex items-center gap-3 mb-6">
                                <Calendar className="h-5 w-5 text-primary" />
                                <h3 className="text-sm font-black uppercase tracking-widest text-white">Calendario de Fechas</h3>
                            </div>
                            <div className="space-y-4">
                                {dates.map((item, idx) => (
                                    <div key={idx} className="flex items-start gap-4 relative">
                                        {idx !== dates.length - 1 && (
                                            <div className="absolute left-[9px] top-6 w-[2px] h-8 bg-white/10" />
                                        )}
                                        <div className={cn(
                                            "h-[20px] w-[20px] rounded-full border-2 mt-1 shrink-0",
                                            item.status === 'completed' ? "bg-primary border-primary" : "border-white/20"
                                        )} />
                                        <div className="flex-1 pb-1">
                                            <p className={cn(
                                                "text-[10px] font-black uppercase tracking-tight",
                                                item.status === 'completed' ? "text-primary" : "text-slate-500"
                                            )}>
                                                {item.date}
                                            </p>
                                            <h4 className="text-xs font-bold text-slate-200">{item.event}</h4>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Puntajes Mínimos Referenciales ── */}
                <div className="mt-10 pt-8 border-t border-white/5">
                    <button
                        onClick={() => setShowScores(!showScores)}
                        className="w-full flex items-center justify-between group/toggle"
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gradient-to-br from-amber-500/20 to-rose-500/20 rounded-xl border border-amber-500/20">
                                <Trophy className="h-5 w-5 text-amber-400" />
                            </div>
                            <div className="text-left">
                                <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight text-white">
                                    Puntajes Mínimos <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-rose-400 italic">Referenciales</span>
                                </h3>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mt-1">
                                    COMIPEMS / ECOEMS 2025-2026 • Total: 128 aciertos
                                </p>
                            </div>
                        </div>
                        <div className="p-2 bg-white/5 rounded-xl border border-white/10 group-hover/toggle:bg-white/10 transition-colors">
                            {showScores ? <ChevronUp className="h-5 w-5 text-slate-400" /> : <ChevronDown className="h-5 w-5 text-slate-400" />}
                        </div>
                    </button>

                    {showScores && (
                        <div className="mt-6 space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
                            {/* Requirement Banner */}
                            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-500/20 flex items-center gap-3">
                                <div className="p-2 bg-emerald-500/20 rounded-lg shrink-0">
                                    <AlertCircle className="h-4 w-4 text-emerald-400" />
                                </div>
                                <p className="text-[11px] text-slate-300 leading-relaxed">
                                    <span className="font-black text-emerald-400">Requisito indispensable:</span> Promedio mínimo de <span className="font-black text-white">7.0</span> en la secundaria.
                                    Los puntajes definitivos se establecen con base en la demanda de cada año.
                                </p>
                            </div>

                            {/* Category Tabs */}
                            <div className="flex flex-wrap gap-2">
                                {(Object.keys(scoreData) as ScoreCategory[]).map((key) => {
                                    const cat = scoreData[key];
                                    const Icon = cat.icon;
                                    return (
                                        <button
                                            key={key}
                                            onClick={() => setActiveTab(key)}
                                            className={cn(
                                                "flex items-center gap-2 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all",
                                                activeTab === key
                                                    ? `${cat.bgColor} ${cat.borderColor} ${cat.color}`
                                                    : "bg-white/5 border-white/10 text-slate-500 hover:bg-white/10 hover:text-slate-300"
                                            )}
                                        >
                                            <Icon className="h-3.5 w-3.5" />
                                            {cat.title}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Score Table */}
                            <div className={cn("rounded-2xl border overflow-hidden", active.borderColor)}>
                                <div className={cn("px-5 py-4 flex items-center justify-between", active.bgColor)}>
                                    <div className="flex items-center gap-3">
                                        <active.icon className={cn("h-5 w-5", active.color)} />
                                        <div>
                                            <h4 className={cn("text-sm font-black uppercase tracking-tight", active.color)}>{active.title}</h4>
                                            <p className="text-[10px] text-slate-500 font-bold">{active.subtitle}</p>
                                        </div>
                                    </div>
                                    <TrendingUp className={cn("h-4 w-4", active.color)} />
                                </div>

                                <div className="divide-y divide-white/5">
                                    {active.schools.map((school, idx) => {
                                        const diff = difficultyConfig[school.difficulty];
                                        const barWidth = Math.round((school.min / 128) * 100);
                                        return (
                                            <div key={idx} className="px-5 py-3 flex items-center gap-4 hover:bg-white/[0.02] transition-colors">
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs font-bold text-slate-200 truncate">
                                                        {school.name}
                                                        {school.code && (
                                                            <span className="ml-2 text-[10px] text-slate-500 font-normal py-0.5 px-1.5 rounded bg-white/5 border border-white/10">
                                                                Clave: {school.code}
                                                            </span>
                                                        )}
                                                    </p>
                                                    <div className="mt-1.5 h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                                        <div
                                                            className={cn(
                                                                "h-full rounded-full transition-all duration-500",
                                                                school.difficulty === "extreme" ? "bg-red-500" :
                                                                    school.difficulty === "high" ? "bg-orange-500" :
                                                                        school.difficulty === "medium" ? "bg-amber-500" :
                                                                            "bg-emerald-500"
                                                            )}
                                                            style={{ width: `${barWidth}%` }}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="text-right shrink-0 flex items-center gap-3">
                                                    <span className={cn(
                                                        "text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-lg border",
                                                        diff.color
                                                    )}>
                                                        {diff.label}
                                                    </span>
                                                    <span className="text-lg font-black text-white tabular-nums w-10 text-right">
                                                        {school.min}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Legend */}
                            <div className="flex flex-wrap items-center gap-3 px-2">
                                <span className="text-[9px] font-black uppercase tracking-widest text-slate-600">Demanda:</span>
                                {Object.entries(difficultyConfig).map(([key, val]) => (
                                    <span key={key} className={cn("text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded border", val.color)}>
                                        {val.label}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* ── Ubicación por Alcaldía ── */}
                <div className="mt-8 pt-8 border-t border-white/5">
                    <button
                        onClick={() => setShowAlcaldias(!showAlcaldias)}
                        className="w-full flex items-center justify-between group/toggle"
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-xl border border-indigo-500/20">
                                <MapPin className="h-5 w-5 text-indigo-400" />
                            </div>
                            <div className="text-left">
                                <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight text-white">
                                    Escuelas por <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 italic">Alcaldía</span>
                                </h3>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mt-1">
                                    Encuentra opciones (UNAM, IPN y otras) cerca de ti
                                </p>
                            </div>
                        </div>
                        <div className="p-2 bg-white/5 rounded-xl border border-white/10 group-hover/toggle:bg-white/10 transition-colors">
                            {showAlcaldias ? <ChevronUp className="h-5 w-5 text-slate-400" /> : <ChevronDown className="h-5 w-5 text-slate-400" />}
                        </div>
                    </button>

                    {showAlcaldias && (
                        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                            {alcaldiasData.map((alc, idx) => (
                                <div key={idx} className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-indigo-500/30 transition-colors">
                                    <h4 className="text-sm font-black text-indigo-400 mb-3">{alc.name}</h4>
                                    <div className="space-y-2 text-xs">
                                        {alc.unam.length > 0 && (
                                            <div className="flex gap-2">
                                                <span className="font-bold text-blue-400 w-12 shrink-0">UNAM:</span>
                                                <span className="text-slate-300">{alc.unam.join(", ")}</span>
                                            </div>
                                        )}
                                        {alc.ipn.length > 0 && (
                                            <div className="flex gap-2">
                                                <span className="font-bold text-rose-400 w-12 shrink-0">IPN:</span>
                                                <span className="text-slate-300">{alc.ipn.join(", ")}</span>
                                            </div>
                                        )}
                                        {alc.otras.length > 0 && (
                                            <div className="flex gap-2">
                                                <span className="font-bold text-emerald-400 w-12 shrink-0">Otras:</span>
                                                <span className="text-slate-300">{alc.otras.join(", ")}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="mt-8 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="flex -space-x-3">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-8 w-8 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-[10px] font-black italic">
                                    {i === 1 ? 'U' : i === 2 ? 'I' : 'M'}
                                </div>
                            ))}
                        </div>
                        <p className="text-[11px] font-bold text-slate-400">
                            +1,500 aspirantes están revisando la convocatoria hoy
                        </p>
                    </div>
                    <a
                        href="https://www.gob.mx/curp/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary hover:text-white transition-colors group/final"
                    >
                        ¿TIENES LISTA TU CURP? CONSÚLTALA AQUÍ
                        <ArrowRight className="h-4 w-4 group-hover/final:translate-x-2 transition-transform" />
                    </a>
                </div>
            </div>
        </div>
    );
};

export default NewsECOEMS;
