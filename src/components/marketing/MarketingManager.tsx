import React, { useState, useEffect } from "react";
import { logger } from "@/lib/logger";
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

    // Campaign editor state
    const [campaignSubject, setCampaignSubject] = useState("⚠️ URGENTE: Requisito Llave MX - ECOEMS 2026");
    const [campaignMessage, setCampaignMessage] = useState(
        "La Llave MX es indispensable para tu registro ECOEMS 2026. Sin ella, no podrás participar en el proceso de asignación.\n\nSigue estos pasos:\n1. Crea tu cuenta en llave.gob.mx\n2. Valida tu CURP y datos personales\n3. Activa tu cuenta con el código recibido"
    );

    const buildEmailHtml = (subject: string, message: string) => {
        const paragraphs = message
            .split("\n")
            .map(line => line.trim())
            .filter(Boolean)
            .map(line =>
                /^\d+\./.test(line)
                    ? `<li style="margin-bottom:8px;color:#94a3b8;font-size:13px;">${line.replace(/^\d+\.\s*/, "")}</li>`
                    : `<p style="color:#cbd5e1;line-height:1.7;margin:0 0 12px 0;">${line}</p>`
            );

        const hasListItems = paragraphs.some(p => p.startsWith("<li"));
        const bodyContent = hasListItems
            ? paragraphs.map(p =>
                p.startsWith("<li")
                    ? p
                    : p
              ).join("")
            : paragraphs.join("");

        const listWrap = hasListItems
            ? `<ol style="margin:0;padding-left:20px;">${paragraphs.filter(p => p.startsWith("<li")).join("")}</ol>`
            : "";
        const textParagraphs = paragraphs.filter(p => !p.startsWith("<li")).join("");

        return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0f172a;">
  <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:600px;margin:40px auto;background:#020617;border-radius:24px;overflow:hidden;border:1px solid rgba(245,158,11,0.2);">
    <!-- Header -->
    <div style="background:linear-gradient(135deg,#7c3aed,#4f46e5);padding:40px 32px;text-align:center;">
      <div style="display:inline-block;background:rgba(255,255,255,0.15);border-radius:16px;padding:8px 20px;margin-bottom:16px;">
        <span style="color:#fff;font-size:11px;font-weight:900;text-transform:uppercase;letter-spacing:3px;">CyberEdu MX</span>
      </div>
      <h1 style="margin:0;color:#fff;font-size:22px;font-weight:900;text-transform:uppercase;letter-spacing:1px;line-height:1.3;">${subject}</h1>
    </div>
    <!-- Body -->
    <div style="padding:40px 32px;">
      <p style="color:#94a3b8;font-size:14px;margin:0 0 24px 0;">Hola, Aspirante 👋</p>
      ${textParagraphs}
      ${listWrap ? `<div style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:16px;padding:20px;margin:24px 0;">${listWrap}</div>` : ""}
    </div>
    <!-- Footer -->
    <div style="padding:24px 32px;border-top:1px solid rgba(255,255,255,0.05);text-align:center;">
      <p style="color:#475569;font-size:11px;margin:0;">
        CyberEdu MX · Simulador ECOEMS 2026 ·
        <a href="https://cyberedumx.com" style="color:#7c3aed;text-decoration:none;">cyberedumx.com</a>
      </p>
    </div>
  </div>
</body>
</html>`;
    };

    const handleEmailBlast = async (bulkMode: boolean = false) => {
        if (!campaignSubject.trim() || !campaignMessage.trim()) {
            toast.error("Campos requeridos", { description: "Completa el asunto y el mensaje antes de enviar." });
            return;
        }
        if (!bulkMode && !user?.email) {
            toast.error("Error de sesión", {
                description: "No se encontró un correo electrónico asociado a tu cuenta.",
            });
            return;
        }

        setIsBlasting(true);
        try {
            const emailHtml = buildEmailHtml(campaignSubject, campaignMessage);

            const payload: Record<string, unknown> = {
                subject: campaignSubject,
                html: emailHtml,
            };

            if (bulkMode) {
                payload.bulk = true;
            } else {
                payload.to = user!.email;
            }

            const { data: { session } } = await supabase.auth.getSession();

            if (!session?.access_token) throw new Error("No hay sesión activa. Inicia sesión e intenta de nuevo.");

            const response = await fetch(
                "https://lruwnuldlltwktdfrwho.supabase.co/functions/v1/send-marketing-email",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${session.access_token}`,
                    },
                    body: JSON.stringify(payload),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data?.error ?? `Error ${response.status} — sent:${data?.sent ?? 0} failed:${data?.failed ?? 0}`);
            }

            if (bulkMode) {
                toast.success("Campaña masiva enviada", {
                    description: `Enviados: ${data.sent} · Fallidos: ${data.failed} · Total: ${data.total}`,
                });
            } else {
                if ((data.sent ?? 0) > 0) {
                    toast.success("Correo enviado", {
                        description: `Prueba enviada a ${user!.email}`,
                    });
                } else {
                    throw new Error(`Resend no procesó el envío (sent=${data.sent}, failed=${data.failed}). Revisa los logs de la Edge Function.`);
                }
            }
        } catch (err: any) {
            console.error("[marketing] catch:", err?.message, err);
            toast.error("Fallo de envío", {
                description: err?.message ?? "No se pudo conectar con el servicio de correo.",
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
            logger.error("Error al guardar preferencias:", err);
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
                    <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-foreground">
                        Canales de <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500 dark:from-indigo-400 dark:to-purple-400 italic">Marketing</span>
                    </h2>
                    <p className="text-muted-foreground text-sm max-w-lg">
                        Gestiona cómo quieres recibir las actualizaciones, retos semanales y noticias oficiales de ECOEMS 2026.
                    </p>
                </div>
                <div className="p-4 bg-primary/10 rounded-3xl border border-primary/20 backdrop-blur-xl flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.3)] text-primary-foreground">
                        <ShieldCheck className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-xs font-black text-foreground uppercase tracking-widest">Estado GDPR</p>
                        <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-tight">Cumplimiento Verificado</p>
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
                            <CardTitle className="text-xl font-black uppercase tracking-tighter group-hover:text-primary transition-colors">Suscripciones</CardTitle>
                        </div>
                        <CardDescription className="text-[11px] font-medium text-muted-foreground uppercase tracking-widest">Gestiona tus notificaciones por correo</CardDescription>
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
                                    <div className={`mt-1 p-2 rounded-lg bg-muted border border-border ${item.color}`}>
                                        <item.icon className="h-4 w-4" />
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <Label htmlFor={item.id} className="text-sm font-black text-foreground cursor-pointer">{item.label}</Label>
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <button className="p-1 text-muted-foreground hover:text-foreground transition-colors">
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
                            <div className="h-10 w-10 shrink-0 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                                <Sparkles className="h-5 w-5" />
                            </div>
                            <p className="text-[11px] text-muted-foreground leading-relaxed">
                                <span className="font-black text-foreground uppercase tracking-tighter">Estudio Inteligente:</span> Al seleccionar tus áreas críticas, nuestro motor de campañas te avisará primero cuando se agreguen noticias o recursos de esos temas.
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
                    {/* Editor de campaña */}
                    <div className="space-y-4 p-6 bg-white/5 rounded-3xl border border-white/5">
                        <p className="text-[10px] font-black text-amber-500 uppercase tracking-[0.2em]">Redactar Campaña</p>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-white/30 tracking-widest ml-1">Asunto</label>
                            <input
                                type="text"
                                value={campaignSubject}
                                onChange={e => setCampaignSubject(e.target.value)}
                                placeholder="Ej: ⚠️ Novedad importante para tu examen"
                                className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-sm font-medium text-white placeholder:text-white/20 focus:outline-none focus:border-amber-500/50 transition-all"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-white/30 tracking-widest ml-1">Mensaje</label>
                            <textarea
                                value={campaignMessage}
                                onChange={e => setCampaignMessage(e.target.value)}
                                placeholder={"Escribe el cuerpo del correo...\n\nUsa líneas numeradas (1. 2. 3.) para listas automáticas."}
                                rows={6}
                                className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-sm text-white/80 placeholder:text-white/20 focus:outline-none focus:border-amber-500/50 transition-all resize-none leading-relaxed"
                            />
                            <p className="text-[10px] text-white/20 ml-1">Líneas con "1. 2. 3." se convierten en lista. Cada línea en blanco separa párrafos.</p>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 pt-1">
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant="outline" size="sm" className="h-9 rounded-xl border-white/10 hover:bg-white/5 text-[10px] font-black uppercase tracking-widest">
                                        <Eye className="mr-2 h-3.5 w-3.5" />
                                        Previsualizar Email
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-slate-950 border border-white/10 rounded-3xl p-0">
                                    <div className="p-4">
                                        <p className="text-[10px] font-black uppercase text-white/30 tracking-widest mb-3 px-2">Vista previa — {campaignSubject || "Sin asunto"}</p>
                                        <div
                                            className="rounded-2xl overflow-hidden"
                                            dangerouslySetInnerHTML={{ __html: buildEmailHtml(campaignSubject || "Sin asunto", campaignMessage || "Sin mensaje.") }}
                                        />
                                    </div>
                                </DialogContent>
                            </Dialog>

                            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-xl border border-white/5">
                                <Mail className="h-3.5 w-3.5 text-slate-500" />
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-tight">Usuarios con opt-in</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row items-center gap-6 p-6 bg-white/5 rounded-3xl border border-white/5">
                        <div className="flex-1">
                            <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">Listo para enviar</p>
                            <p className="text-sm font-bold text-white truncate">{campaignSubject || <span className="text-white/30 italic">Sin asunto</span>}</p>
                        </div>

                        <div className="shrink-0 w-full md:w-auto flex flex-col gap-3">
                            <Button
                                onClick={() => handleEmailBlast(true)}
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
                                        <Send className="h-6 w-6" />
                                        <span>ENVIAR A TODOS</span>
                                    </div>
                                )}
                            </Button>
                            <Button
                                onClick={() => handleEmailBlast(false)}
                                disabled={isBlasting}
                                variant="outline"
                                className="h-10 w-full md:w-56 rounded-xl border-white/10 hover:bg-white/5 text-[10px] font-black uppercase tracking-widest"
                            >
                                <Mail className="mr-2 h-3.5 w-3.5" />
                                Prueba a mi correo
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default MarketingManager;
