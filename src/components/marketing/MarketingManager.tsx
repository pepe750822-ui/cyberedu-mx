import React, { useState, useEffect } from "react";
import {
    Mail,
    Bell,
    ShieldCheck,
    Zap,
    Settings2,
    Eye,
    CheckCircle2,
    ChevronRight,
    Target,
    BookOpen,
    Send,
    Flame,
    Sparkles,
    Trophy
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogDescription
} from "@/components/ui/dialog";
import { WelcomeEmailTemplate, WeeklyProgressEmailTemplate, NewsletterEmailTemplate, LlaveMXEmailTemplate } from "./EmailTemplates";
import { toast } from "sonner";
import { areas } from "@/data/areas";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const MarketingManager = () => {
    const [preferences, setPreferences] = useState({
        welcome: true,
        weekly: true,
        newsletter: false,
        campaigns: true,
    });

    const { user, profile } = useAuth();
    const [isBlasting, setIsBlasting] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [selectedAreas, setSelectedAreas] = useState<string[]>([]);

    const handleEmailBlast = async () => {
        if (!user?.email) {
            toast.error("Error de sesión", {
                description: "No se encontró un correo electrónico asociado a tu cuenta.",
            });
            return;
        }

        setIsBlasting(true);
        try {
            const { data, error } = await supabase.functions.invoke("send-marketing-email", {
                body: {
                    to: user.email,
                    subject: "⚠️ URGENTE: Requisito Llave MX - ECOEMS 2026",
                    html: `
                        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background-color: #020617; color: #f8fafc; border-radius: 32px; overflow: hidden; border: 1px solid #f59e0b33;">
                            <div style="background-color: #f59e0b; padding: 40px; text-align: center;">
                                <h1 style="margin: 0; color: #020617; text-transform: uppercase; font-weight: 900; font-size: 24px;">Requisito Obligatorio</h1>
                            </div>
                            <div style="padding: 40px;">
                                <h2 style="color: #fff; font-size: 20px;">Hola, Aspirante 👋</h2>
                                <p style="color: #cbd5e1; line-height: 1.6;">La <b>Llave MX</b> es indispensable para tu registro ECOEMS 2026. Sin ella, no podrás participar en el proceso de asignación.</p>
                                <div style="background-color: #ffffff0d; border: 1px solid #ffffff1a; border-radius: 16px; padding: 20px; margin: 24px 0;">
                                    <p style="margin: 0 0 12px 0; font-size: 14px; color: #e2e8f0;">Sigue estos pasos:</p>
                                    <ol style="margin: 0; padding-left: 20px; color: #94a3b8; font-size: 13px;">
                                        <li style="margin-bottom: 8px;">Crea tu cuenta en <b>llave.gob.mx</b></li>
                                        <li style="margin-bottom: 8px;">Valida tu CURP y datos personales</li>
                                        <li>Activa tu cuenta con el código recibido</li>
                                    </ol>
                                </div>
                                <a href="https://llave.gob.mx" style="display: block; background-color: #f59e0b; color: #020617; text-align: center; padding: 16px; border-radius: 12px; text-decoration: none; font-weight: 900; text-transform: uppercase; font-size: 12px; letter-spacing: 1px;">Acceder a Llave MX</a>
                                <p style="text-align: center; margin-top: 24px;">
                                    <a href="https://cyberedumx.com" style="color: #6366f1; font-size: 11px; text-decoration: underline;">Volver a PrepáraTE</a>
                                </p>
                            </div>
                            <div style="background-color: #020617; padding: 24px; text-align: center; border-top: 1px solid #ffffff0d;">
                                <p style="margin: 0; font-size: 9px; color: #475569; text-transform: uppercase; letter-spacing: 1px;">CyberEdu MX • 2026</p>
                            </div>
                        </div>
                    `
                },
            });

            if (error) {
                console.error("Detalle del error de la Edge Function:", error);
                throw new Error(`Error de la función: ${error.message || JSON.stringify(error)}`);
            }

            toast.success("Campaña enviada con éxito", {
                description: `Se ha enviado un correo de prueba a ${user.email}`,
            });
        } catch (err: any) {
            console.error("Error completo atrapado:", err);
            toast.error("Fallo de envío", {
                description: err.message || "La Edge Function no respondió correctamente. ¿Está desplegada?",
            });
        } finally {
            setIsBlasting(false);
        }
    };

    const toggleArea = (id: string) => {
        setSelectedAreas(prev =>
            prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
        );
    };

    useEffect(() => {
        if (profile) {
            setPreferences({
                welcome: profile.marketing_opt_in ?? true,
                weekly: profile.weekly_reminders ?? true,
                newsletter: profile.newsletter_opt_in ?? false,
                campaigns: (profile.area_of_interest?.length ?? 0) > 0,
            });
            if (profile.area_of_interest) {
                setSelectedAreas(profile.area_of_interest);
            }
        }
    }, [profile]);

    const handleSave = async () => {
        if (!user) return;

        setIsSaving(true);
        try {
            const { error } = await supabase
                .from("profiles")
                .update({
                    marketing_opt_in: preferences.welcome,
                    weekly_reminders: preferences.weekly,
                    newsletter_opt_in: preferences.newsletter,
                    area_of_interest: selectedAreas,
                    updated_at: new Date().toISOString(),
                })
                .eq("id", user.id);

            if (error) throw error;

            toast.success("Preferencias guardadas", {
                description: "Tus ajustes de comunicación han sido actualizados en la base de datos.",
            });
        } catch (err: any) {
            console.error("Error al guardar preferencias:", err);
            toast.error("Error al guardar", {
                description: "No se pudieron guardar los cambios. Asegúrate de que las columnas existan en Supabase.",
            });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-8 max-w-4xl mx-auto p-4 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Sistema de Comunicación</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-white">
                        Canales de <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 italic">Marketing</span>
                    </h2>
                    <p className="text-slate-400 text-sm max-w-lg">
                        Gestiona cómo quieres recibir las actualizaciones, retos semanales y noticias oficiales de ECOEMS 2026.
                    </p>
                </div>
                <div className="p-4 bg-primary/10 rounded-3xl border border-primary/20 backdrop-blur-xl flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.3)]">
                        <ShieldCheck className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <p className="text-xs font-black text-white uppercase tracking-widest">Estado GDPR</p>
                        <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-tight">Cumplimiento Verificado</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 1. Preferencias de Email */}
                <Card className="bg-card/40 backdrop-blur-md border-border/50 rounded-[2rem] overflow-hidden group">
                    <CardHeader className="pb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-indigo-500/20 rounded-xl text-indigo-400">
                                <Mail className="h-5 w-5" />
                            </div>
                            <CardTitle className="text-xl font-black uppercase tracking-tighter group-hover:text-indigo-400 transition-colors">Suscripciones</CardTitle>
                        </div>
                        <CardDescription className="text-[11px] font-medium text-slate-500 uppercase tracking-widest">Gestiona tus notificaciones por correo</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {[
                            {
                                id: "welcome",
                                label: "Email de Bienvenida",
                                desc: "Confirmación de registro y guía inicial.",
                                icon: Send,
                                color: "text-blue-400",
                                template: <WelcomeEmailTemplate />
                            },
                            {
                                id: "weekly",
                                label: "Progreso Semanal",
                                desc: "Resumen de tus avances y racha de estudio.",
                                icon: Trophy,
                                color: "text-emerald-400",
                                template: <WeeklyProgressEmailTemplate />
                            },
                            {
                                id: "newsletter",
                                label: "Newsletter Mensual",
                                desc: "Lo mejor de CyberEdu y noticias ECOEMS.",
                                icon: BookOpen,
                                color: "text-amber-400",
                                template: <NewsletterEmailTemplate category="GENERAL" title="Preparación Integral 2026" content="Consulta las últimas actualizaciones del calendario oficial y nuevos simuladores." />
                            },
                            {
                                id: "campaigns",
                                label: "Campañas Segmentadas",
                                desc: "Contenido específico según tus áreas de interés.",
                                icon: Target,
                                color: "text-rose-400",
                                template: <NewsletterEmailTemplate category="MATEMÁTICAS" title="Reto de Sucesiones" content="Se han agregado nuevos reactivos de razonamiento matemático. ¡Entra ahora!" badge="Campaña" />
                            },
                        ].map((item) => (
                            <div key={item.id} className="flex items-start justify-between gap-4 p-4 rounded-2xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5 group/item">
                                <div className="flex gap-4">
                                    <div className={`mt-1 p-2 rounded-lg bg-slate-900 border border-white/5 ${item.color}`}>
                                        <item.icon className="h-4 w-4" />
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <Label htmlFor={item.id} className="text-sm font-black text-white cursor-pointer">{item.label}</Label>
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <button className="p-1 text-slate-500 hover:text-white transition-colors">
                                                        <Eye className="h-3 w-3" />
                                                    </button>
                                                </DialogTrigger>
                                                <DialogContent className="max-w-2xl bg-transparent border-none p-0 outline-none">
                                                    <div className="animate-in zoom-in-95 duration-300">
                                                        {item.template}
                                                    </div>
                                                </DialogContent>
                                            </Dialog>
                                        </div>
                                        <p className="text-xs text-slate-500 line-clamp-1">{item.desc}</p>
                                    </div>
                                </div>
                                <Switch
                                    id={item.id}
                                    checked={preferences[item.id as keyof typeof preferences]}
                                    onCheckedChange={(val) => setPreferences(prev => ({ ...prev, [item.id]: val }))}
                                    className="data-[state=checked]:bg-indigo-500"
                                />
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* 2. Segmentación por Interés */}
                <Card className="bg-card/40 backdrop-blur-md border-border/50 rounded-[2rem] overflow-hidden">
                    <CardHeader className="pb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-emerald-500/20 rounded-xl text-emerald-400">
                                <Target className="h-5 w-5" />
                            </div>
                            <CardTitle className="text-xl font-black uppercase tracking-tighter">Segmentación</CardTitle>
                        </div>
                        <CardDescription className="text-[11px] font-medium text-slate-500 uppercase tracking-widest">Personaliza tus campañas por área</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="p-5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-4 mb-4">
                            <div className="h-10 w-10 shrink-0 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                                <Sparkles className="h-5 w-5" />
                            </div>
                            <p className="text-[11px] text-slate-300 leading-relaxed">
                                <span className="font-black text-white uppercase tracking-tighter">Estudio Inteligente:</span> Al seleccionar tus áreas críticas, nuestro motor de campañas te avisará primero cuando se agreguen noticias o recursos de esos temas.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            {areas.map((area) => (
                                <button
                                    key={area.id}
                                    onClick={() => toggleArea(area.id)}
                                    className={cn(
                                        "p-3 rounded-xl border text-[10px] font-black uppercase tracking-widest text-left transition-all relative overflow-hidden group",
                                        selectedAreas.includes(area.id)
                                            ? "bg-indigo-500 border-indigo-400 text-white shadow-lg shadow-indigo-500/20"
                                            : "bg-white/5 border-white/10 text-slate-500 hover:bg-white/10 hover:text-slate-300"
                                    )}
                                >
                                    <span className="relative z-10">{area.name}</span>
                                    {selectedAreas.includes(area.id) && (
                                        <div className="absolute right-2 top-1/2 -translate-y-1/2">
                                            <CheckCircle2 className="h-3.5 w-3.5 text-white animate-in zoom-in duration-300" />
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>

                        <div className="pt-4 border-t border-white/5">
                            <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-4">Resumen de Selección</p>
                            <div className="flex flex-wrap gap-2">
                                {selectedAreas.length === 0 ? (
                                    <p className="text-[10px] text-slate-500 italic">No has seleccionado áreas de interés.</p>
                                ) : (
                                    selectedAreas.map(id => {
                                        const area = areas.find(a => a.id === id);
                                        return (
                                            <Badge key={id} variant="secondary" className="bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[8px] font-black uppercase py-0.5 px-2">
                                                {area?.name}
                                            </Badge>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="h-14 flex-1 bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest text-xs rounded-2xl shadow-[0_10px_30px_rgba(99,102,241,0.3)] group"
                >
                    {isSaving ? (
                        <span className="flex items-center gap-2">
                            <Sparkles className="h-4 w-4 animate-spin text-indigo-200" />
                            Guardando...
                        </span>
                    ) : (
                        <>
                            Guardar Configuración
                            <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </>
                    )}
                </Button>
                <div className="flex-1 p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-3">
                    <div className="p-2 bg-amber-500/20 rounded-lg text-amber-500">
                        <Flame className="h-4 w-4" />
                    </div>
                    <p className="text-[10px] text-slate-500 font-medium">
                        Tu racha de estudio de <span className="text-white font-bold">5 días</span> influye en la frecuencia de recordatorios oportunos.
                    </p>
                </div>
            </div>

            {/* 3. Campañas de Envío Masivo (Test) */}
            <Card className="bg-gradient-to-br from-slate-900 to-slate-950 border-amber-500/20 rounded-[2rem] overflow-hidden shadow-2xl relative group">
                <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity">
                    <Send className="h-40 w-40 text-amber-500 -rotate-12" />
                </div>

                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-amber-500/20 rounded-xl text-amber-500">
                                <Send className="h-5 w-5" />
                            </div>
                            <div>
                                <CardTitle className="text-xl font-black uppercase tracking-tighter text-white">Lanzador de Campañas</CardTitle>
                                <CardDescription className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">Enviar noticias relevantes por correo</CardDescription>
                            </div>
                        </div>
                        <Badge variant="outline" className="border-emerald-500/30 text-emerald-500 uppercase text-[9px] font-black tracking-widest px-3">
                            Motor de Envío Listo
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6 relative z-10">
                    <div className="flex flex-col md:flex-row items-center gap-8 p-6 bg-white/5 rounded-3xl border border-white/5">
                        <div className="flex-1 space-y-4">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <span className="h-2 w-2 rounded-full bg-amber-500 animate-ping" />
                                    <span className="text-[10px] font-black text-amber-500 uppercase tracking-[0.2em]">Última Noticia Detectada</span>
                                </div>
                                <h4 className="text-lg font-black text-white uppercase tracking-tight">Llave MX: Requisito Obligatorio 2026</h4>
                                <p className="text-xs text-slate-400 leading-relaxed">
                                    Esta campaña invitará a todos los usuarios registrados a completar su registro de Llave MX y volver a la plataforma para continuar con su simulador.
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-4 pt-2">
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant="outline" size="sm" className="h-10 rounded-xl border-white/10 hover:bg-white/5 text-[10px] font-black uppercase tracking-widest group">
                                            <Eye className="mr-2 h-4 w-4" />
                                            Previsualizar Email
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-2xl bg-transparent border-none p-0 outline-none shadow-none">
                                        <LlaveMXEmailTemplate />
                                    </DialogContent>
                                </Dialog>

                                <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-xl border border-white/5">
                                    <Mail className="h-3.5 w-3.5 text-slate-500" />
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-tight">1,542 Destinatarios</span>
                                </div>
                            </div>
                        </div>

                        <div className="shrink-0 w-full md:w-auto">
                            <Button
                                onClick={handleEmailBlast}
                                disabled={isBlasting}
                                className={cn(
                                    "h-24 w-full md:w-56 rounded-3xl font-black uppercase tracking-[0.2em] text-lg transition-all shadow-2xl",
                                    isBlasting
                                        ? "bg-slate-800 text-slate-500"
                                        : "bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-amber-500/20"
                                )}
                            >
                                {isBlasting ? (
                                    <div className="flex flex-col items-center gap-2">
                                        <Sparkles className="h-5 w-5 animate-spin" />
                                        <span className="text-[10px]">Enviando...</span>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center gap-2">
                                        <Send className="h-6 w-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                        <span>ENVIAR BLAST</span>
                                    </div>
                                )}
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default MarketingManager;
