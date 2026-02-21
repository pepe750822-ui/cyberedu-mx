import React, { useState, useEffect, useRef, useMemo } from "react";
import { useLocation, Link } from "react-router-dom";
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
    ExternalLink,
    ThumbsUp,
    ThumbsDown,
    RefreshCw,
    HelpCircle,
    Target,
    Clock,
    Zap,
    ChevronRight,
    PlayCircle,
    GraduationCap,
    ListChecks,
    Bookmark
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { areas } from "@/data/areas";
import { useAITutorSkills } from "@/hooks/useAITutorSkills";
import { simuladoECOEMS } from "@/data/simuladorData";
import { toast } from "sonner";

interface Message {
    role: "bot" | "user";
    text: string;
    id: string;
    type?: "standard" | "explanation" | "suggestion" | "hint" | "video_ref";
    steps?: string[];
    extra?: any;
    feedback?: "up" | "down";
}

const MEMORY_TTL = 7 * 24 * 60 * 60 * 1000; // 7 days

const AITutor = () => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const location = useLocation();
    const { searchKnowledgeBase, analyzeUserProgress, generateExplanation } = useAITutorSkills();

    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [historyLoaded, setHistoryLoaded] = useState(false);
    const [lastQueries, setLastQueries] = useState<string[]>([]);

    // 1. MEMORIA CONTEXTUAL AVANZADA (Local Storage with TTL)
    const [messages, setMessages] = useState<Message[]>(() => {
        const saved = localStorage.getItem("ai_tutor_history_v2");
        if (saved) {
            const { data, timestamp } = JSON.parse(saved);
            if (Date.now() - timestamp < MEMORY_TTL) {
                return data;
            }
        }
        return [{
            role: "bot",
            text: "¡Hola! Bienvenido de nuevo a CyberEdu. Soy tu consultor académico. He analizado el temario 2026 y estoy listo para ayudarte a dominar cualquier área. ¿Qué te gustaría repasar hoy?",
            id: "initial",
            type: "standard"
        }];
    });

    useEffect(() => {
        localStorage.setItem("ai_tutor_history_v2", JSON.stringify({
            data: messages,
            timestamp: Date.now()
        }));
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    useEffect(() => {
        if (isOpen && !historyLoaded && messages.length > 1) {
            toast.info("Recuperando tu conversación anterior...", { duration: 2000 });
            setHistoryLoaded(true);
        }
    }, [isOpen]);

    // 2. SUGERENCIAS CONTEXTUALES SEGÚN LA PÁGINA
    const contextualSuggestions = useMemo(() => {
        const path = location.pathname;
        if (path === "/simulador-pro") {
            return [
                { text: "¿En qué pregunta vas?", action: "CHECK_SIM" },
                { text: "¿Necesitas una pista?", action: "HINT" },
                { text: "Ver trucos para el examen", action: "TRICKS" }
            ];
        }
        if (path.includes("/area/")) {
            return [
                { text: "Resumen de esta área", action: "SUMMARIZE" },
                { text: "Ver material clave", action: "MATERIAL" },
                { text: "Dame un quiz rápido", action: "FAST_QUIZ" }
            ];
        }
        if (path === "/") {
            return [
                { text: "¿Cómo voy en mi progreso?", action: "ANALYZE" },
                { text: "Recomiéndame qué estudiar", action: "RECOMMEND" },
                { text: "Ver retos de hoy", action: "CHALLENGE" }
            ];
        }
        return [
            { text: "¿Qué es ECOEMS?", action: "ECOEMS_INFO" },
            { text: "Ver simuladores", action: "SIMS" }
        ];
    }, [location.pathname]);

    // Effect to show transition when page changes
    useEffect(() => {
        if (isOpen) {
            const pageName = location.pathname === "/" ? "Dashboard" :
                location.pathname === "/simulador-pro" ? "Simulador" : "Contenido";

            toast.success(`Analizando contexto de ${pageName}...`, {
                icon: <Brain className="h-4 w-4 text-primary" />,
                duration: 1500
            });
        }
    }, [location.pathname, isOpen]);

    const clearHistory = () => {
        localStorage.removeItem("ai_tutor_history_v2");
        setMessages([{
            role: "bot",
            text: "¡Historial reiniciado! Estoy listo para empezar de cero con el temario 2026. ¿Qué quieres aprender?",
            id: Date.now().toString(),
            type: "standard"
        }]);
        toast.info("Conversación reiniciada");
    };

    // Preference tracking for "Area Favorita"
    useEffect(() => {
        if (location.pathname.includes('/area/')) {
            const areaName = location.pathname.split('/').pop();
            localStorage.setItem('ai_tutor_pref_area', areaName || '');
        }
    }, [location.pathname]);

    const handleAction = (action: string, text: string) => {
        setInput(text);
        processQuery(text, action);
    };

    const processQuery = async (query: string, specificAction?: string) => {
        if (!query.trim() && !specificAction) return;

        const userMsg: Message = { role: "user", text: query || specificAction || "", id: Date.now().toString() };
        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setIsTyping(true);

        // Track last queries for context recall
        setLastQueries(prev => [query, ...prev].slice(0, 3));

        // 5. DETECCIÓN DE EMOCIONES
        const frustrationKeywords = ["no entiendo", "difícil", "ayuda", "perdido", "imposible", "error"];
        const enthusiasmKeywords = ["entendido", "genial", "fácil", "sorprendente", "bien", "listo"];

        const isFrustrated = frustrationKeywords.some(k => query.toLowerCase().includes(k));
        const isEnthusiastic = enthusiasmKeywords.some(k => query.toLowerCase().includes(k));

        setTimeout(() => {
            let botResponse: Partial<Message> = { role: "bot", id: (Date.now() + 1).toString(), type: "standard" };
            const q = query.toLowerCase();

            // 0. INTERACCIONES SOCIALES Y SALUDOS
            const greetings = ["hola", "buenos días", "buenas tardes", "hey", "saludos", "que tal"];
            const identity = ["quien eres", "que eres", "tu nombre", "presentate"];
            const thanks = ["gracias", "excelente", "perfecto", "muy bien", "gracias bot"];

            if (greetings.some(k => q === k || q.startsWith(k + " "))) {
                const userName = localStorage.getItem('user_display_name') || "estudiante";
                botResponse.text = `¡Hola, ${userName}! Qué gusto saludarte. Soy tu Consultor AI de CyberEdu. ¿En qué área del temario 2026 nos enfocaremos hoy?`;
                botResponse.type = "suggestion";
            }
            else if (identity.some(k => q.includes(k))) {
                botResponse.text = "Soy el Consultor AI de CyberEdu MX 4.0. Mi propósito es ayudarte a dominar el temario ECOEMS 2026 mediante análisis de tu progreso, pistas en simuladores y explicaciones paso a paso.";
            }
            else if (thanks.some(k => q.includes(k))) {
                botResponse.text = "¡De nada! Es un placer ayudarte en tu camino al éxito académico. Recuerda que la constancia es la clave del puntaje perfecto. ¿Necesitas ayuda con algo más?";
            }
            // 7. MODO TUTOR DE EXAMEN (Solo si pide ayuda o es acción de pista)
            else if ((location.pathname === "/simulador-pro" && (q.includes("ayuda") || q.includes("pista"))) || specificAction === "HINT") {
                const simState = JSON.parse(localStorage.getItem('simulador_estado') || '{}');
                const currentIndex = simState.currentQuestionIndex || 0;
                const currentQuestion = simuladoECOEMS[currentIndex];

                botResponse.text = "¡Claro! En el modo simulador no puedo darte la respuesta directa, pero aquí tienes una guía estratégica:";
                botResponse.type = "hint";
                botResponse.extra = {
                    hints: [
                        `Pista 1: El tema central es **${currentQuestion.area}**.`,
                        `Pista 2: Enfócate en: "${currentQuestion.text.slice(0, 40)}..."`,
                        "¿Quieres que analicemos la lógica del reactivo sin revelarte la opción?"
                    ],
                    questionId: currentQuestion.id
                };
                setMessages(prev => [...prev, botResponse as Message]);
                setIsTyping(false);
                return;
            }

            // 4. MODO EXPLICACIÓN PASO A PASO
            else if (q.includes("explica") || q.includes("paso a paso") || q.includes("como se hace") || specificAction === "SIMPLIFY" || specificAction === "EXAMPLE") {
                const searchRes = searchKnowledgeBase(q);
                const isSimplifying = specificAction === "SIMPLIFY";
                const isExample = specificAction === "EXAMPLE";

                if (searchRes.length > 0 && searchRes[0].type === 'simulador') {
                    const explanation = generateExplanation(searchRes[0]);
                    botResponse.text = isSimplifying
                        ? `¡Claro! Vamos a hacerlo más simple aún. Imagina que este concepto es como...`
                        : isExample
                            ? `Aquí tienes otro escenario para aplicar este concepto de **${searchRes[0].area}**:`
                            : `Excelente pregunta. Vamos a desglosar este concepto de **${searchRes[0].area}** paso a paso:`;
                    botResponse.type = "explanation";
                    botResponse.steps = isSimplifying ? [explanation.steps[0], "En resumen: solo fíjate en la relación directa."] : explanation.steps;
                    botResponse.extra = {
                        summary: explanation.summary,
                        trick: explanation.trick,
                        example: explanation.example,
                        keyPoints: explanation.keyPoints,
                        relatedItems: explanation.relatedItems,
                        canSimplify: !isSimplifying,
                        canExample: !isExample,
                        item: searchRes[0]
                    };
                } else {
                    botResponse.text = "Para explicarte paso a paso, necesito que me indiques el tema o la pregunta específica. Por ejemplo: 'Explícame las sucesiones numéricas'.";
                }
            }
            // 8. ACCIÓN DE BÚSQUEDA TEMÁTICA
            else if (specificAction === "SEARCH") {
                const searchRes = searchKnowledgeBase(query);
                if (searchRes.length > 0) {
                    botResponse.text = `He encontrado información relevante sobre **${query}**. ¿Te gustaría profundizar en algún video o reactivo?`;
                    botResponse.type = "suggestion";
                    botResponse.extra = {
                        recommendation: `Te recomiendo empezar con: "${searchRes[0].title || searchRes[0].text.slice(0, 30)}..."`
                    };
                } else {
                    botResponse.text = `No encontré resultados exactos para "${query}", pero puedo investigar más a fondo en mis bases de datos externas.`;
                }
            }
            // Repeated Query Detection
            else if (lastQueries.includes(q) && messages.length > 3) {
                botResponse.text = `Veo que sigues interesado en este tema. ¿Hay alguna parte específica que te esté costando más trabajo o te gustaría ver un ejemplo práctico diferente?`;
            }
            // 3. ANALIZADOR DE PROGRESO
            else if (q.includes("progreso") || q.includes("como voy") || specificAction === "ANALYZE") {
                const analysis = analyzeUserProgress();
                botResponse.text = `He analizado tu trayectoria académica. Tu progreso global es del **${analysis.totalProgress}%**.`;
                botResponse.extra = {
                    analysis,
                    recommendation: analysis.weakAreas.length > 0
                        ? `Te sugiero reforzar **${analysis.weakAreas[0].name}**, donde tienes el menor nivel.`
                        : "¡Vas excelente! Sigue manteniendo tu racha de estudio."
                };
                botResponse.type = "suggestion";
            }
            // 6. REFERENCIAS VISUALES / VIDEOS
            else if (q.includes("video") || q.includes("clase")) {
                const searchRes = searchKnowledgeBase(q, undefined, "video");
                if (searchRes.length > 0) {
                    botResponse.text = `He encontrado una clase en video ideal para este tema de **${searchRes[0].area}**:`;
                    botResponse.type = "video_ref";
                    botResponse.extra = {
                        videoTitle: searchRes[0].title,
                        videoPath: `/area/${searchRes[0].area.toLowerCase()}`, // Simplified path logic
                        area: searchRes[0].area
                    };
                } else {
                    botResponse.text = "No encontré un video específico con ese nombre, pero puedes explorar las áreas de estudio para encontrar el material completo.";
                }
            }
            // Emotional Adaptation
            else if (isFrustrated) {
                botResponse.text = "Entiendo que este tema puede ser un reto, pero no te preocupes. Vamos a simplificarlo. ¿Te gustaría que te dé una explicación mucho más básica o prefieres ver un video introductorio?";
            }
            else if (isEnthusiastic) {
                botResponse.text = "¡Ese es el espíritu! El éxito en el ECOEMS depende de esa actitud. ¿Quieres intentar un reto de nivel avanzado para poner a prueba tu dominio?";
            }
            // Default intelligence
            else {
                const searchRes = searchKnowledgeBase(q);
                if (searchRes.length > 0) {
                    const item = searchRes[0];
                    if (item.type === 'video') {
                        botResponse.text = `Te recomiendo revisar la clase: **${item.title}**. ¿Deseas que busque el resumen de este tema?`;
                    } else {
                        botResponse.text = `Encontré un reactivo similar: "${item.text.slice(0, 60)}...". ¿Te gustaría ver la explicación de por qué esa es la respuesta correcta?`;
                    }
                } else {
                    botResponse.text = `He analizado tu consulta sobre '${query}'. He activado mi módulo de investigación externa para darte la respuesta más precisa: [Ver en Google Académico](https://www.google.com/search?q=${encodeURIComponent(query + " guia ecoems 2026")})`;
                }
            }

            setMessages(prev => [...prev, botResponse as Message]);
            setIsTyping(false);
        }, 1200);
    };

    const handleFeedback = (id: string, type: "up" | "down") => {
        setMessages(prev => prev.map(m => m.id === id ? { ...m, feedback: type } : m));
        toast.success(type === "up" ? "¡Gracias por tu feedback!" : "Lamento que no fuera útil. Aprenderé de esto.");
    };

    return (
        <>
            {/* Floating Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-2xl z-[100] transition-all duration-500 flex items-center justify-center group",
                    isOpen
                        ? "bg-slate-900 border border-white/10 rotate-90"
                        : "bg-primary hover:scale-110 active:scale-95 shadow-[0_0_30px_rgba(99,102,241,0.5)]"
                )}
            >
                {isOpen ? (
                    <X className="h-6 w-6 text-white" />
                ) : (
                    <div className="relative">
                        <GraduationCap className="h-8 w-8 text-white animate-pulse" />
                        <div className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full border-2 border-primary" />
                    </div>
                )}
            </button>

            {/* Chat Window with Glassmorphism */}
            <div className={cn(
                "fixed bottom-24 right-6 w-[95vw] sm:w-[420px] h-[600px] bg-slate-950/80 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.9)] z-[100] flex flex-col overflow-hidden transition-all duration-500 origin-bottom-right",
                isOpen ? "scale-100 opacity-100 translate-y-0" : "scale-0 opacity-0 translate-y-40 pointer-events-none"
            )}>
                {/* Header with CyberEdu style */}
                <div className="p-6 border-b border-white/5 bg-gradient-to-r from-primary/20 via-slate-900/40 to-indigo-500/20">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-2xl hero-gradient border border-white/20 flex items-center justify-center relative shadow-[0_0_20px_rgba(99,102,241,0.3)]">
                                <GraduationCap className="h-7 w-7 text-white animate-bounce-slow" />
                                <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent rounded-2xl pointer-events-none" />
                                <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-emerald-500 rounded-full border-4 border-slate-950 shadow-lg" />
                            </div>
                            <div>
                                <h4 className="text-sm font-black text-white uppercase tracking-[0.2em]">Consultor AI</h4>
                                <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest flex items-center gap-1">
                                    <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                    Motor 2026 Optimizado
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={clearHistory}
                                title="Reiniciar chat"
                                className="p-2 hover:bg-white/10 rounded-xl text-slate-500 hover:text-white transition-colors"
                            >
                                <RefreshCw className="h-4 w-4" />
                            </button>
                            <div className="hidden sm:flex items-center gap-2">
                                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">En Línea</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Messages area */}
                <div
                    ref={scrollRef}
                    className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar"
                >
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={cn(
                                "flex flex-col gap-2 max-w-[90%] animate-in fade-in slide-in-from-bottom-4 duration-500",
                                msg.role === "user" ? "ml-auto items-end" : "mr-auto items-start"
                            )}
                        >
                            <div className={cn(
                                "flex items-end gap-2",
                                msg.role === "user" ? "flex-row-reverse" : "flex-row"
                            )}>
                                <div className={cn(
                                    "h-8 w-8 rounded-xl flex items-center justify-center shrink-0 border",
                                    msg.role === "user" ? "bg-slate-800 border-white/10" : "bg-primary/20 border-primary/30"
                                )}>
                                    {msg.role === "user" ? <User className="h-4 w-4 text-slate-400" /> : <Bot className="h-4 w-4 text-primary" />}
                                </div>

                                <div className={cn(
                                    "px-4 py-3 text-[13px] font-medium leading-relaxed group relative",
                                    msg.role === "user"
                                        ? "bg-primary rounded-2xl rounded-tr-none text-white shadow-xl shadow-primary/10"
                                        : "bg-white/5 border border-white/5 rounded-2xl rounded-tl-none text-slate-200"
                                )}>
                                    {msg.text}

                                    {/* Explanation rendering */}
                                    {msg.steps && (
                                        <div className="mt-4 space-y-4 pt-4 border-t border-white/10">
                                            {msg.extra?.summary && (
                                                <p className="text-[11px] text-primary font-bold italic leading-relaxed mb-3">
                                                    "{msg.extra.summary}"
                                                </p>
                                            )}

                                            <div className="space-y-3">
                                                {msg.steps.map((step, i) => (
                                                    <div key={i} className="flex gap-3 animate-in slide-in-from-left-2" style={{ animationDelay: `${i * 150}ms` }}>
                                                        <span className="h-5 w-5 rounded-full bg-primary/20 text-primary text-[10px] font-black flex items-center justify-center shrink-0 border border-primary/10">{i + 1}</span>
                                                        <p className="text-[11px] text-slate-300 leading-snug">{step}</p>
                                                    </div>
                                                ))}
                                            </div>

                                            {msg.extra?.keyPoints && (
                                                <div className="grid grid-cols-1 gap-2 mt-4">
                                                    <p className="text-[9px] font-black text-slate-500 uppercase flex items-center gap-1">
                                                        <ListChecks className="h-3 w-3" /> Puntos Clave
                                                    </p>
                                                    {msg.extra.keyPoints.map((point: string, idx: number) => (
                                                        <div key={idx} className="p-2 bg-white/5 border border-white/5 rounded-xl text-[10px] text-slate-400">
                                                            • {point}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {msg.extra?.trick && (
                                                <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl mt-4 relative overflow-hidden group">
                                                    <div className="absolute top-0 right-0 p-1 opacity-20 group-hover:opacity-100 transition-opacity">
                                                        <Zap className="h-4 w-4 text-amber-500" />
                                                    </div>
                                                    <p className="text-[11px] text-amber-500 font-black uppercase mb-1 flex items-center gap-2">
                                                        <Zap className="h-3 w-3" /> Truco Pro de Examen
                                                    </p>
                                                    <p className="text-[11px] italic text-slate-400">{msg.extra.trick}</p>
                                                </div>
                                            )}

                                            {msg.extra?.relatedItems && (
                                                <div className="mt-4">
                                                    <p className="text-[9px] font-black text-slate-500 uppercase mb-2 flex items-center gap-1">
                                                        <Bookmark className="h-3 w-3" /> Temas Relacionados
                                                    </p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {msg.extra.relatedItems.map((item: string, idx: number) => (
                                                            <button
                                                                key={idx}
                                                                onClick={() => handleAction("SEARCH", item)}
                                                                className="px-2 py-1 bg-white/5 hover:bg-white/10 rounded-full text-[9px] text-slate-500 hover:text-white transition-colors border border-white/5"
                                                            >
                                                                {item}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Hint rendering */}
                                    {msg.type === "hint" && msg.extra?.hints && (
                                        <div className="mt-3 space-y-2">
                                            {msg.extra.hints.slice(0, 2).map((hint: string, i: number) => (
                                                <div key={i} className="p-2.5 bg-indigo-500/10 border border-indigo-500/20 rounded-lg flex items-center gap-2">
                                                    <HelpCircle className="h-3 w-3 text-indigo-400" />
                                                    <span className="text-[11px] text-slate-400">{hint}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Video reference rendering */}
                                    {msg.type === "video_ref" && msg.extra && (
                                        <div className="mt-4 p-4 bg-white/5 border border-white/10 rounded-2xl group/video">
                                            <div className="relative h-24 w-full bg-slate-900 rounded-xl overflow-hidden mb-3">
                                                <div className="absolute inset-0 flex items-center justify-center opacity-40 group-hover/video:opacity-100 transition-opacity">
                                                    <PlayCircle className="h-10 w-10 text-white" />
                                                </div>
                                                <div className="absolute bottom-2 right-2 bg-primary/80 px-2 py-0.5 rounded text-[8px] font-black">VIDEO HD</div>
                                            </div>
                                            <h5 className="text-[11px] font-black uppercase tracking-tight mb-1">{msg.extra.videoTitle}</h5>
                                            <Link
                                                to={msg.extra.videoPath}
                                                className="text-[10px] font-black text-primary uppercase flex items-center gap-1 hover:underline"
                                            >
                                                Ver Clase Completa <ExternalLink className="h-3 w-3" />
                                            </Link>
                                        </div>
                                    )}

                                    {/* Action buttons for explanations */}
                                    {msg.type === "explanation" && msg.extra && (
                                        <div className="flex gap-2 mt-4">
                                            {msg.extra.canSimplify && (
                                                <button
                                                    onClick={() => handleAction("SIMPLIFY", "Simplifica más")}
                                                    className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-lg text-[10px] font-black uppercase transition-colors"
                                                >
                                                    Simplifica más
                                                </button>
                                            )}
                                            {msg.extra.canExample && (
                                                <button
                                                    onClick={() => handleAction("EXAMPLE", "Dame otro ejemplo")}
                                                    className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-lg text-[10px] font-black uppercase transition-colors"
                                                >
                                                    Otro ejemplo
                                                </button>
                                            )}
                                        </div>
                                    )}
                                    {/* Analysis rendering */}
                                    {msg.extra?.analysis && (
                                        <div className="mt-4 grid grid-cols-2 gap-2">
                                            <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                                                <p className="text-[9px] font-black uppercase text-slate-500 mb-1">Tu Nivel</p>
                                                <p className="text-lg font-black text-primary">{msg.extra.analysis.totalProgress}%</p>
                                            </div>
                                            <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                                                <p className="text-[9px] font-black uppercase text-slate-500 mb-1">Racha</p>
                                                <p className="text-lg font-black text-amber-500">{msg.extra.analysis.streak} DÍAS</p>
                                            </div>
                                            <div className="col-span-2 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                                                <p className="text-[10px] text-slate-300 font-medium">{msg.extra.recommendation}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Feedback buttons */}
                            {msg.role === "bot" && (
                                <div className="flex items-center gap-3 px-10 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => handleFeedback(msg.id, "up")}
                                        className={cn("p-1.5 rounded-lg transition-colors", msg.feedback === "up" ? "text-emerald-500 bg-emerald-500/10" : "text-slate-600 hover:text-white hover:bg-white/5")}
                                    >
                                        <ThumbsUp className="h-3 w-3" />
                                    </button>
                                    <button
                                        onClick={() => handleFeedback(msg.id, "down")}
                                        className={cn("p-1.5 rounded-lg transition-colors", msg.feedback === "down" ? "text-rose-500 bg-rose-500/10" : "text-slate-600 hover:text-white hover:bg-white/5")}
                                    >
                                        <ThumbsDown className="h-3 w-3" />
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                    {isTyping && (
                        <div className="flex items-center gap-3 bg-white/5 border border-white/5 rounded-2xl p-4 w-fit animate-pulse">
                            <Loader2 className="h-4 w-4 text-primary animate-spin" />
                            <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">IA Procesando...</span>
                        </div>
                    )}
                </div>

                {/* Suggestions Section */}
                {!isTyping && contextualSuggestions.length > 0 && (
                    <div className="px-6 py-2 flex flex-wrap gap-2 animate-in fade-in duration-700">
                        {contextualSuggestions.map((s, i) => (
                            <button
                                key={i}
                                onClick={() => handleAction(s.action, s.text)}
                                className="px-3 py-1.5 bg-slate-800/50 hover:bg-primary/20 border border-white/5 rounded-full text-[10px] font-black text-slate-400 hover:text-white transition-all"
                            >
                                {s.text}
                            </button>
                        ))}
                    </div>
                )}

                {/* Input Area with Glassmorphism */}
                <div className="p-6 bg-slate-900/50 border-t border-white/5">
                    <div className="relative flex items-center gap-3">
                        <div className="flex-1 relative group">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === "Enter" && processQuery(input)}
                                placeholder="Escribe tu consulta académica..."
                                className="w-full bg-slate-800/80 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-primary/50 transition-all focus:ring-4 ring-primary/5"
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-600 uppercase tracking-tighter opacity-0 group-focus-within:opacity-100 transition-opacity">Enter</div>
                        </div>
                        <button
                            onClick={() => processQuery(input)}
                            disabled={!input.trim()}
                            className="h-14 w-14 bg-primary hover:bg-primary/90 text-white rounded-2xl flex items-center justify-center transition-all active:scale-95 shadow-lg shadow-primary/20 disabled:opacity-50 disabled:grayscale"
                        >
                            <Send className="h-6 w-6" />
                        </button>
                    </div>
                    <div className="flex items-center justify-center gap-4 mt-4">
                        <p className="text-[9px] text-slate-600 font-black uppercase tracking-[0.2em] flex items-center gap-1">
                            <Brain className="h-3 w-3" /> CyberEdu Engine v4.0
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AITutor;
