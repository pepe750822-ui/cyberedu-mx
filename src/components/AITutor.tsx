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
    const scrollRef = useRef<HTMLDivElement>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState("");

    // Load messages from sessionStorage for memory within the session
    const [messages, setMessages] = useState<Message[]>(() => {
        const saved = sessionStorage.getItem("ai_tutor_messages");
        return saved ? JSON.parse(saved) : [{
            role: "bot",
            text: "Bienvenido al Centro de Soporte Académico de CyberEdu Mx. Soy tu Consultor de Estrategia Educativa. ¿En qué área específica de tu preparación para el ingreso 2026 puedo asistirte hoy?",
            id: "initial"
        }];
    });
    const [isTyping, setIsTyping] = useState(false);

    useEffect(() => {
        sessionStorage.setItem("ai_tutor_messages", JSON.stringify(messages));
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

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
                botResponse = "Es fundamental entender que el proceso ECOEMS 2026 sustituye formalmente al COMIPEMS. El registro oficial inicia el 24 de marzo en el portal miderechomilugar.gob.mx. ¿Te gustaría que analicemos juntos el cronograma de fechas críticas o los requisitos específicos para la UNAM?";
            } else if (query.includes("ayuda") || query.includes("error") || query.includes("urgente")) {
                botResponse = "¡Entendido! He activado el **Modo de Soporte Prioritario**. ¿Tienes dudas técnicas con la plataforma o necesitas ayuda pedagógica con un tema específico del simulador? Estoy aquí para asegurar que nada detenga tu estudio.";
            } else if (query.includes("mate") || query.includes("matematicas") || query.includes("ecuacion")) {
                botResponse = "El Razonamiento Matemático es el pilar de un alto puntaje (aprox. 32 reactivos). Para el examen digital, las ecuaciones de primer grado y sistemas 2x2 son temas recurrentes. He visto que muchos aspirantes fallan en los despejes. ¿Quieres que realicemos un ejercicio guiado paso a paso?";
            } else if (query.includes("fisica") || query.includes("newton") || query.includes("fuerza")) {
                botResponse = "En Física, el análisis de las Leyes de Newton es imperativo. Recuerda que F=ma es la base. ¿Te gustaría que revisemos cómo se aplica esto en un plano inclinado, que es una pregunta clásica del examen IPN?";
            } else if (query.includes("biologia") || query.includes("celula") || query.includes("adn")) {
                botResponse = "La Biología en ECOEMS enfoca gran parte de su reactivo en genética y metabolismo celular. Asegúrate de distinguir con precisión los organelos. ¿Sabías que el transporte a través de la membrana es una pregunta recurrente? ¿Te explico la diferencia entre activo y pasivo?";
            } else if (query.includes("simulador") || query.includes("examen") || query.includes("prueba")) {
                botResponse = "¡Tu iniciativa es excelente! He optimizado tu acceso al **[Simulador Pro](/simulador-pro)**. Recuerda que terminarlo con éxito desbloquea el logro 'Velocista'. ¿Quieres consejos sobre cómo gestionar los 3 minutos por reactivo o prefieres empezar ya?";
            } else if (query.includes("google") || query.includes("buscar") || query.includes("investigar")) {
                botResponse = "Módulo de consulta externa activado. He preparado una búsqueda especializada en Google para profundizar. Resultados aquí: [Consultar en tiempo real](https://www.google.com/search?q=" + encodeURIComponent(input + " guia oficial ecoems 2026") + ")";
            } else if (query.includes("hola") || query.includes("buenos") || query.includes("quien eres")) {
                botResponse = "Hola. Soy tu Consultor Estratégico de CyberEdu Mx. Mi misión es que obtengas más de 100 aciertos para asegurar tu primera opción. ¿Qué tema del temario oficial te gustaría dominar hoy?";
            } else {
                botResponse = "He analizado tu consulta sobre '" + input + "'. Para darte la información más precisa del 2026, he generado una búsqueda asistida. [Ver detalles externos](https://www.google.com/search?q=" + encodeURIComponent(input + " ecoems 2026") + "). ¿Deseas que profundice en algún subtema específico de esta área?";
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
