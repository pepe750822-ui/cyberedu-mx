import React, { useState, useEffect, useRef } from "react";
import {
    MessageSquare,
    X,
    Send,
    Bot,
    User,
    Loader2,
    Sparkles,
    Brain,
    Search,
    BookOpen,
    ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { areas } from "@/data/areas";

interface Message {
    role: "bot" | "user";
    text: string;
    id: string;
}

const AITutor = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<Message[]>([
        {
            role: "bot",
            text: "Bienvenido al Centro de Soporte Académico de CyberEdu Mx. Soy tu Consultor de Estrategia Educativa. ¿En qué área específica de tu preparación para el ingreso 2026 puedo asistirte hoy?",
            id: "initial"
        }
    ]);
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg: Message = { role: "user", text: input, id: Date.now().toString() };
        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setIsTyping(true);

        // AI thinking simulation
        setTimeout(() => {
            let botResponse = "";
            const query = input.toLowerCase();

            // Professional Knowledge Base Matching
            if (query.includes("examen") || query.includes("convocatoria") || query.includes("ecoems")) {
                botResponse = "Es fundamental entender que el proceso ECOEMS 2026 sustituye formalmente al COMIPEMS. El registro oficial inicia el 17 de marzo en el portal miderechomilugar.gob.mx. ¿Deseas que revisemos el calendario de fechas clave o los requisitos específicos para la UNAM?";
            } else if (query.includes("curp")) {
                botResponse = "Tu CURP es el documento de identidad principal para el registro en marzo. Te recomiendo tenerlo validado previamente en el portal de RENAPO. He dejado un enlace directo en nuestra sección de noticias para facilitarte el trámite.";
            } else if (query.includes("mate") || query.includes("matematicas") || query.includes("ecuacion")) {
                botResponse = "El dominio del Razonamiento Matemático es el pilar de un alto puntaje. Para el examen digital, las ecuaciones de primer grado y sistemas 2x2 son temas recurrentes. Te sugiero completar el QUIZ de la lección 34 para medir tu nivel actual.";
            } else if (query.includes("fisica") || query.includes("newton") || query.includes("fuerza")) {
                botResponse = "En el área de Física, el análisis de las Leyes de Newton es imperativo. No olvides que la unificación de exámenes para IPN requiere un dominio claro de vectores y cinemática. ¿Te gustaría que analicemos la Segunda Ley de Newton con un ejemplo práctico?";
            } else if (query.includes("biologia") || query.includes("celula") || query.includes("adn")) {
                botResponse = "La Biología en ECOEMS enfoca gran parte de su reactivo en genética y metabolismo celular. Asegúrate de distinguir con precisión los organelos de la célula animal y vegetal. El material complementario del video 11 contiene una infografía comparativa que te será de gran ayuda.";
            } else if (query.includes("consejo") || query.includes("ayuda") || query.includes("estudiar")) {
                botResponse = "Nuestra plataforma está diseñada bajo un modelo de aprendizaje progresivo. Mi recomendación estratégica es seguir tu 'Plan de Estudio Diario' y no dejar pasar más de 48 horas sin resolver un quiz para cimentar la retención a largo plazo. ¿Qué tema te parece más complejo de abordar hoy?";
            } else if (query.includes("google") || query.includes("buscar") || query.includes("investigar")) {
                botResponse = "He activado mi módulo de consulta externa. He preparado una búsqueda especializada en Google para profundizar en tu duda. Puedes acceder a los resultados en tiempo real aquí: [Ver resultados en Google](https://www.google.com/search?q=" + encodeURIComponent(input) + ")";
            } else if (query.includes("hola") || query.includes("buenos") || query.includes("quien eres")) {
                botResponse = "Hola. Soy el Consultor Digital de CyberEdu Mx. Mi objetivo es optimizar tu rendimiento académico para asegurar tu lugar en tu primera opción de bachillerato. ¿Tienes alguna duda sobre el calendario oficial o algún tema del temario?";
            } else {
                botResponse = "He analizado tu consulta sobre '" + input + "'. Para darte la información más actualizada del 2026, he generado una búsqueda asistida que complementa mi base de datos. Haz clic aquí para ver detalles externos: [Consultar en Google](https://www.google.com/search?q=" + encodeURIComponent(input + " ecoems 2026") + "). ¿Te gustaría que también busque ejercicios prácticos de este tema?";
            }

            setMessages(prev => [...prev, {
                role: "bot",
                text: botResponse,
                id: (Date.now() + 1).toString()
            }]);
            setIsTyping(false);
        }, 1500);
    };

    return (
        <>
            {/* Floating Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-2xl z-[100] transition-all duration-500 flex items-center justify-center group",
                    isOpen
                        ? "bg-slate-900 border border-white/10 rotate-90"
                        : "bg-primary hover:scale-110 animate-bounce active:scale-90"
                )}
            >
                {isOpen ? (
                    <X className="h-6 w-6 text-white" />
                ) : (
                    <div className="relative">
                        <Bot className="h-6 w-6 text-white" />
                        <div className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full border-2 border-primary animate-ping" />
                    </div>
                )}
            </button>

            {/* Chat Window */}
            <div className={cn(
                "fixed bottom-24 right-6 w-[90vw] md:w-[400px] h-[500px] bg-slate-950/95 backdrop-blur-2xl border border-white/10 rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.8)] z-[100] flex flex-col overflow-hidden transition-all duration-500 origin-bottom-right",
                isOpen ? "scale-100 opacity-100 translate-y-0" : "scale-0 opacity-0 translate-y-20 pointer-events-none"
            )}>
                {/* Header */}
                <div className="p-5 border-b border-white/10 bg-gradient-to-r from-primary/10 to-indigo-500/10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center relative">
                            <Bot className="h-6 w-6 text-primary" />
                            <div className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-emerald-500 rounded-full border-2 border-slate-950" />
                        </div>
                        <div>
                            <h4 className="text-sm font-black text-white uppercase tracking-widest">Tutor AI</h4>
                            <p className="text-[10px] text-emerald-400 font-bold uppercase">Online Now</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-amber-500 animate-pulse" />
                    </div>
                </div>

                {/* Messages area */}
                <div
                    ref={scrollRef}
                    className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar"
                >
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={cn(
                                "flex items-end gap-2 max-w-[85%] animate-in fade-in slide-in-from-bottom-2 duration-300",
                                msg.role === "user" ? "ml-auto flex-row-reverse" : "flex-row"
                            )}
                        >
                            <div className={cn(
                                "h-7 w-7 rounded-sm flex items-center justify-center shrink-0",
                                msg.role === "user" ? "bg-white/5" : "bg-primary/20"
                            )}>
                                {msg.role === "user" ? <User className="h-4 w-4 text-white/40" /> : <Bot className="h-4 w-4 text-primary" />}
                            </div>
                            <div className={cn(
                                "px-4 py-2.5 text-xs font-medium leading-relaxed",
                                msg.role === "user"
                                    ? "bg-primary rounded-2xl rounded-tr-none text-white shadow-lg"
                                    : "bg-white/5 border border-white/5 rounded-2xl rounded-tl-none text-slate-200"
                            )}>
                                {msg.text.split(/(\[.*?\]\(.*?\))/g).map((part, i) => {
                                    const match = part.match(/\[(.*?)\]\((.*?)\)/);
                                    if (match) {
                                        return (
                                            <a
                                                key={i}
                                                href={match[2]}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-primary hover:underline font-black inline-flex items-center gap-1 mx-1"
                                            >
                                                {match[1]}
                                                <ExternalLink className="h-3 w-3" />
                                            </a>
                                        );
                                    }
                                    return <span key={i}>{part}</span>;
                                })}
                            </div>
                        </div>
                    ))}
                    {isTyping && (
                        <div className="flex items-center gap-2 bg-white/5 border border-white/5 rounded-2xl p-3 w-fit">
                            <Loader2 className="h-3 w-3 text-primary animate-spin" />
                            <span className="text-[10px] font-bold text-muted-foreground uppercase">Tutor pensando...</span>
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <div className="p-4 bg-slate-900/50 border-t border-white/10">
                    <div className="relative flex items-center gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === "Enter" && handleSend()}
                            placeholder="Escribe tu duda escolar aquí..."
                            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-primary/50 transition-colors"
                        />
                        <button
                            onClick={handleSend}
                            className="h-10 w-10 bg-primary hover:bg-primary/90 text-white rounded-lg flex items-center justify-center transition-all active:scale-95"
                        >
                            <Send className="h-4 w-4" />
                        </button>
                    </div>
                    <p className="text-[8px] text-center text-slate-600 mt-3 font-bold uppercase tracking-widest">
                        Alimentado por la base de conocimientos de CyberEdu Mx
                    </p>
                </div>
            </div>
        </>
    );
};

export default AITutor;
