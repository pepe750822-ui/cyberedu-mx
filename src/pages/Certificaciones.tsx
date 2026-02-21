import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CertificationCard from "@/components/CertificationCard";
import { useAuth } from "@/contexts/AuthContext";
import {
    Award,
    ChevronRight,
    Lock,
    Sparkles,
    Trophy,
    ArrowLeft,
    Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const Certificaciones = () => {
    const { user, profile } = useAuth();
    const navigate = useNavigate();
    const [selectedCert, setSelectedCert] = useState<any>(null);

    // Mock certificates for demonstration
    const availableCerts = [
        {
            id: "CERT-2026-X1",
            courseName: "Simulador Integral ECOEMS 2026",
            score: 112,
            totalQuestions: 128,
            date: "20 FEB 2026",
            type: "gold",
            locked: false
        },
        {
            id: "CERT-2026-M4",
            courseName: "Módulo: Pensamiento Matemático",
            score: 28,
            totalQuestions: 30,
            date: "15 FEB 2026",
            type: "platinum",
            locked: false
        },
        {
            id: "CERT-2026-S7",
            courseName: "Racha de Estudio: 7 Días",
            score: 7,
            totalQuestions: 7,
            date: "19 FEB 2026",
            type: "platinum",
            locked: false
        },
        {
            id: "CERT-2026-L2",
            courseName: "Módulo: Lenguaje y Comunicación",
            score: 0,
            totalQuestions: 30,
            date: "PENDIENTE",
            type: "blue",
            locked: true
        },
        {
            id: "CERT-2026-P100",
            courseName: "Puntaje Perfecto (Módulo Biología)",
            score: 20,
            totalQuestions: 20,
            date: "10 FEB 2026",
            type: "gold",
            locked: false
        },
        {
            id: "CERT-2026-MASTER",
            courseName: "Maestro del Simulador Pro",
            score: 0,
            totalQuestions: 128,
            date: "BLOQUEADO",
            type: "platinum",
            locked: true
        }
    ];

    return (
        <div className="min-h-screen bg-[#020617] text-white">
            <Header />

            <main className="py-12 px-4 md:px-8 max-w-7xl mx-auto">
                {selectedCert ? (
                    <div className="space-y-8">
                        <Button
                            variant="ghost"
                            onClick={() => setSelectedCert(null)}
                            className="text-slate-400 hover:text-white group"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                            Volver a mis certificaciones
                        </Button>
                        <CertificationCard
                            userName={profile?.name || user?.email?.split('@')[0] || "Aspirante"}
                            courseName={selectedCert.courseName}
                            score={selectedCert.score}
                            totalQuestions={selectedCert.totalQuestions}
                            date={selectedCert.date}
                            certificateId={selectedCert.id}
                            type={selectedCert.type}
                        />
                    </div>
                ) : (
                    <div className="space-y-12">
                        {/* Hero Section */}
                        <div className="flex flex-col md:flex-row items-end justify-between gap-8 border-b border-white/5 pb-12">
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-500">Logros Académicos</span>
                                </div>
                                <h1 className="text-4xl md:text-7xl font-black tracking-tighter uppercase italic">
                                    Centro de <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600">Certificación</span>
                                </h1>
                                <p className="text-slate-400 max-w-xl text-lg leading-relaxed">
                                    Valida tus conocimientos y obtén reconocimientos oficiales por cada módulo completado con excelencia. Estos certificados avalan tu preparación para el proceso ECOEMS 2026.
                                </p>
                            </div>

                            <div className="hidden md:flex items-center gap-6 p-6 bg-amber-500/5 rounded-[2.5rem] border border-amber-500/10 backdrop-blur-xl">
                                <div className="h-16 w-16 rounded-3xl bg-amber-500 flex items-center justify-center shadow-[0_0_30px_rgba(245,158,11,0.3)]">
                                    <Award className="h-8 w-8 text-black" />
                                </div>
                                <div>
                                    <p className="text-2xl font-black italic">
                                        {availableCerts.filter(c => !c.locked).length} / {availableCerts.length}
                                    </p>
                                    <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Certificados Obtenidos</p>
                                </div>
                            </div>
                        </div>

                        {/* Certificate Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {availableCerts.map((cert) => (
                                <div
                                    key={cert.id}
                                    className="group relative"
                                >
                                    <div className={cn(
                                        "relative h-72 rounded-[2.5rem] p-8 border-2 transition-all duration-500 overflow-hidden",
                                        cert.locked
                                            ? "bg-slate-900/50 border-white/5 grayscale"
                                            : "bg-slate-900 border-white/10 hover:border-amber-500/50 hover:-translate-y-2 cursor-pointer"
                                    )}
                                        onClick={() => !cert.locked && setSelectedCert(cert)}
                                    >
                                        <div className="relative z-10 flex flex-col h-full justify-between">
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <div className={cn(
                                                        "p-3 rounded-2xl",
                                                        cert.locked ? "bg-slate-800" : "bg-amber-500/20 text-amber-400"
                                                    )}>
                                                        {cert.locked ? <Lock className="h-6 w-6" /> : <Award className="h-6 w-6" />}
                                                    </div>
                                                    {!cert.locked && (
                                                        <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[10px] font-black uppercase">
                                                            Obtenido
                                                        </Badge>
                                                    )}
                                                </div>
                                                <h3 className="text-xl font-black uppercase tracking-tight group-hover:text-amber-400 transition-colors">
                                                    {cert.courseName}
                                                </h3>
                                            </div>

                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-widest">
                                                    <span>Progreso</span>
                                                    <span>{cert.score === 0 ? "0" : Math.round((cert.score / cert.totalQuestions) * 100)}%</span>
                                                </div>
                                                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                                    <div
                                                        className={cn("h-full transition-all duration-1000", cert.locked ? "bg-slate-700" : "bg-amber-500")}
                                                        style={{ width: `${(cert.score / cert.totalQuestions) * 100}%` }}
                                                    />
                                                </div>
                                                {!cert.locked && (
                                                    <Button variant="ghost" className="w-full h-12 rounded-2xl bg-white/5 group-hover:bg-amber-500 group-hover:text-black transition-all font-black uppercase tracking-widest text-[10px]">
                                                        Ver Certificado
                                                        <ChevronRight className="ml-2 h-4 w-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        </div>

                                        {/* Background Decoration */}
                                        <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-[0.03] transition-opacity">
                                            <Shield className="h-48 w-48 text-white rotate-12" />
                                        </div>
                                    </div>

                                    {cert.locked && (
                                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                            <div className="p-4 bg-black/60 backdrop-blur-md rounded-2xl border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <p className="text-[10px] font-black uppercase tracking-widest text-white">Completar simulador para desbloquear</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* CTA Section */}
                        <div className="p-12 bg-gradient-to-br from-indigo-950 to-slate-950 rounded-[3rem] border border-white/5 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-12 opacity-[0.05] group-hover:scale-110 transition-transform duration-700">
                                <Sparkles className="h-64 w-64 text-indigo-400" />
                            </div>

                            <div className="relative z-10 space-y-6 max-w-2xl">
                                <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter">
                                    ¿Listo para el <span className="italic text-indigo-400">siguiente nivel?</span>
                                </h2>
                                <p className="text-slate-400">
                                    Completa el Simulador Completo con un puntaje mayor a 80/128 para obtener el Certificado de Oro y una insignia especial en tu perfil.
                                </p>
                                <Button
                                    onClick={() => navigate("/simulador-pro")}
                                    className="h-14 px-10 bg-indigo-500 hover:bg-indigo-400 text-white font-black uppercase tracking-[0.2em] text-xs rounded-2xl shadow-[0_10px_40px_rgba(99,102,241,0.4)]"
                                >
                                    Ir al Simulador Pro
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default Certificaciones;
