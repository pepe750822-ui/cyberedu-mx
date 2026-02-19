import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Maximize2, Zap, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";

const SimuladorExternal = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const type = searchParams.get("type");

    const [simulator, setSimulator] = useState({
        url: "",
        title: "",
        description: "",
        color: "primary"
    });

    useEffect(() => {
        if (type === "completo") {
            setSimulator({
                url: "/studio/simulador_completo.php",
                title: "SIMULADOR ECOEMS COMPLETO",
                description: "Versión integral de 128 reactivos con cronómetro oficial",
                color: "indigo-500"
            });
        } else if (type === "politecnico") {
            setSimulator({
                url: "/studio/simulador_politecnico.php",
                title: "SIMULADOR POLITÉCNICO (IPN)",
                description: "Entrenamiento especializado nivel superior estilo Anime",
                color: "rose-500"
            });
        } else {
            // Default or redirect
            setSimulator({
                url: "/studio/nguia.html",
                title: "CONSOLA ESTUDIO MAESTRA",
                description: "Base de datos completa de 630 reactivos",
                color: "amber-500"
            });
        }
    }, [type]);

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col">
            {/* Mini Navigation Bar for Simulator */}
            <div className="bg-slate-900 border-b border-white/5 py-4 px-6 flex items-center justify-between sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate("/")}
                        className="text-slate-400 hover:text-white hover:bg-white/5 gap-2"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        <span className="hidden sm:inline">Regresar al Dashboard</span>
                    </Button>
                    <div className="h-6 w-px bg-white/10 hidden sm:block" />
                    <div className="flex flex-col">
                        <h1 className="text-white text-sm font-black uppercase tracking-tight flex items-center gap-2">
                            <Zap className={`h-3 w-3 text-${simulator.color}`} />
                            {simulator.title}
                        </h1>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest hidden md:block">
                            {simulator.description}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                        <ShieldCheck className="h-3 w-3 text-emerald-500" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500">Sesión Protegida</span>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-9 bg-white/5 border-white/10 text-slate-300 hover:bg-white/10"
                        onClick={() => window.open(simulator.url, "_blank")}
                    >
                        <Maximize2 className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Main Simulator Area */}
            <div className="flex-1 w-full bg-white relative overflow-hidden">
                {simulator.url && (
                    <iframe
                        src={simulator.url}
                        className="w-full h-full border-none"
                        title={simulator.title}
                        loading="lazy"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                )}
            </div>
        </div>
    );
};

export default SimuladorExternal;
