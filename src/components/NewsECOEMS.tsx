import React from "react";
import {
    Bell,
    Calendar,
    Info,
    ExternalLink,
    AlertCircle,
    FileText,
    Clock,
    Sparkles,
    ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";

const NewsECOEMS = () => {
    const dates = [
        { event: "Publicación de Convocatoria", date: "13 Feb 2026", status: "completed" },
        { event: "Registro de Aspirantes", date: "17 Mar - 14 Abr", status: "upcoming" },
        { event: "Conclusión de Registro (UNAM/IPN)", date: "18 - 22 May", status: "upcoming" },
        { event: "Aplicación Examen Digital", date: "20, 21, 27, 28 Jun", status: "upcoming" },
        { event: "Publicación de Resultados", date: "18 Ago 2026", status: "upcoming" }
    ];

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
                    <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary hover:text-white transition-colors group/final">
                        ¿TIENES LISTA TU CURP? COMIENZA AQUÍ
                        <ArrowRight className="h-4 w-4 group-hover/final:translate-x-2 transition-transform" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NewsECOEMS;
