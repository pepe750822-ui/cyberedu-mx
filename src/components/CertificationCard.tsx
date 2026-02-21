import React, { useRef } from "react";
import {
    Award,
    Download,
    Share2,
    ShieldCheck,
    Star,
    Calendar,
    Trophy,
    User,
    CheckCircle2,
    QrCode
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface CertificationProps {
    userName: string;
    courseName: string;
    score: number;
    totalQuestions: number;
    date: string;
    certificateId: string;
    type?: "gold" | "silver" | "blue" | "platinum";
}

const CertificationCard: React.FC<CertificationProps> = ({
    userName,
    courseName,
    score,
    totalQuestions,
    date,
    certificateId,
    type = "gold"
}) => {
    const percentage = Math.round((score / totalQuestions) * 100);
    const cardRef = useRef<HTMLDivElement>(null);

    const typeStyles = {
        gold: {
            border: "border-amber-500/50",
            bg: "from-amber-900/40 to-slate-950",
            accent: "text-amber-400",
            iconBg: "bg-amber-500/20",
            badge: "bg-amber-500/20 text-amber-500 border-amber-500/30",
            glow: "shadow-[0_0_50px_rgba(245,158,11,0.15)]",
            ribbon: "bg-amber-500"
        },
        silver: {
            border: "border-slate-400/50",
            bg: "from-slate-800/40 to-slate-950",
            accent: "text-slate-300",
            iconBg: "bg-slate-400/20",
            badge: "bg-slate-400/20 text-slate-400 border-slate-400/30",
            glow: "shadow-[0_0_50px_rgba(148,163,184,0.15)]",
            ribbon: "bg-slate-400"
        },
        blue: {
            border: "border-indigo-500/50",
            bg: "from-indigo-900/40 to-slate-950",
            accent: "text-indigo-400",
            iconBg: "bg-indigo-500/20",
            badge: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
            glow: "shadow-[0_0_50px_rgba(99,102,241,0.15)]",
            ribbon: "bg-indigo-500"
        },
        platinum: {
            border: "border-emerald-500/50",
            bg: "from-emerald-900/40 to-slate-950",
            accent: "text-emerald-400",
            iconBg: "bg-emerald-500/20",
            badge: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
            glow: "shadow-[0_0_50px_rgba(16,185,129,0.15)]",
            ribbon: "bg-emerald-500"
        }
    };

    const styles = typeStyles[type];

    const handleDownload = () => {
        // In a real app we'd use html2canvas, but for now we'll suggest screenshot or print
        window.print();
    };

    return (
        <div className="flex flex-col items-center gap-8 w-full max-w-4xl mx-auto p-4 md:p-12 animate-in fade-in zoom-in duration-700">
            <Card
                ref={cardRef}
                className={cn(
                    "w-full aspect-[1.414/1] relative overflow-hidden bg-gradient-to-br border-2 rounded-[2.5rem] p-1 shadow-2xl transition-all hover:scale-[1.01]",
                    styles.bg,
                    styles.border,
                    styles.glow
                )}
            >
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/[0.02] rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/[0.02] rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl pointer-events-none" />

                {/* Top Banner Ribbon */}
                <div className={cn("absolute top-0 left-12 w-16 h-28 clip-path-ribbon shadow-lg flex items-end justify-center pb-4", styles.ribbon)}>
                    <Award className="h-8 w-8 text-black" />
                </div>

                <CardContent className="h-full flex flex-col items-center justify-between p-12 relative z-10 text-center">
                    {/* Header */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-center gap-3">
                            <Badge variant="outline" className={cn("px-4 py-1 text-[10px] font-black tracking-[0.3em] uppercase", styles.badge)}>
                                Certificado Oficial
                            </Badge>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white uppercase italic">
                            Diploma de <span className={styles.accent}>Excelencia</span>
                        </h1>
                        <div className="h-1 w-24 bg-gradient-to-r from-transparent via-white/20 to-transparent mx-auto" />
                    </div>

                    {/* Recipient */}
                    <div className="space-y-6 py-8">
                        <p className="text-slate-400 text-sm font-medium uppercase tracking-[0.2em]">Se otorga el presente reconocimiento a:</p>
                        <h2 className="text-3xl md:text-5xl font-serif text-white italic capitalize">
                            {userName}
                        </h2>
                        <div className="flex items-center justify-center gap-4 text-slate-500">
                            <div className="h-px w-12 bg-slate-800" />
                            <Star className={cn("h-4 w-4", styles.accent)} />
                            <div className="h-px w-12 bg-slate-800" />
                        </div>
                        <p className="text-slate-300 max-w-lg mx-auto leading-relaxed">
                            Por haber completado exitosamente el curso de capacitación especializada en
                            <br />
                            <span className="text-white font-bold uppercase tracking-tight text-xl mt-2 block">
                                {courseName}
                            </span>
                            <span className="text-xs text-slate-500 block mt-2 tracking-widest uppercase">
                                Preparación integral para el examen ECOEMS 2026
                            </span>
                        </p>
                    </div>

                    {/* Stats & Footer */}
                    <div className="w-full grid grid-cols-3 items-end gap-8 border-t border-white/5 pt-8">
                        <div className="text-left space-y-2">
                            <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                <Trophy className="h-3 w-3" /> Puntaje
                            </div>
                            <p className="text-2xl font-black text-white italic">{score} <span className="text-xs text-slate-500 not-italic">/ {totalQuestions}</span></p>
                            <p className={cn("text-xs font-bold", styles.accent)}>{percentage}% de efectividad</p>
                        </div>

                        <div className="flex flex-col items-center gap-4">
                            <div className="p-3 bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-2xl">
                                <QrCode className="h-12 w-12 text-white opacity-40" />
                            </div>
                            <p className="text-[10px] font-mono text-slate-600 uppercase tracking-tighter select-all">
                                ID: {certificateId}
                            </p>
                        </div>

                        <div className="text-right space-y-2">
                            <div className="flex items-center justify-end gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                <Calendar className="h-3 w-3" /> Fecha
                            </div>
                            <p className="text-lg font-bold text-white uppercase">{date}</p>
                            <div className="flex items-center justify-end gap-2 mt-2">
                                <div className="p-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                                    <ShieldCheck className="h-3 w-3 text-emerald-500" />
                                </div>
                                <span className="text-[9px] font-black text-emerald-500/80 uppercase tracking-widest">Auténtico</span>
                            </div>
                        </div>
                    </div>
                </CardContent>

                {/* Secure Hologram Effect */}
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white shadow-[0_0_100px_rgba(255,255,255,0.05)] rounded-full rotate-45 opacity-10 pointer-events-none" />
            </Card>

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-center gap-4 no-print">
                <Button
                    onClick={handleDownload}
                    className="h-12 px-8 bg-white text-black hover:bg-slate-200 font-black uppercase tracking-widest text-xs rounded-2xl group shadow-lg"
                >
                    <Download className="mr-2 h-4 w-4 group-hover:-translate-y-0.5 transition-transform" />
                    Descargar PDF
                </Button>
                <Button
                    variant="outline"
                    className="h-12 px-8 border-white/10 bg-white/5 hover:bg-white/10 text-white font-black uppercase tracking-widest text-xs rounded-2xl group"
                >
                    <Share2 className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                    Compartir en LinkedIn
                </Button>
            </div>

            <style>{`
                @media print {
                    .no-print { display: none !important; }
                    body { background: white !important; }
                    .Card { border: 1px solid #ccc !important; box-shadow: none !important; }
                }
                .clip-path-ribbon {
                    clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 50% 85%, 0% 100%);
                }
            `}</style>
        </div>
    );
};

export default CertificationCard;
