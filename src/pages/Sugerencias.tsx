import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  MessageSquarePlus,
  Send,
  CheckCircle,
  ChevronLeft,
  Lightbulb,
  Bug,
  Star,
  Megaphone,
} from "lucide-react";

const CATEGORIES = [
  { id: "mejora", label: "Mejora", icon: Lightbulb, color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/30" },
  { id: "bug", label: "Error / Bug", icon: Bug, color: "text-rose-400", bg: "bg-rose-500/10 border-rose-500/30" },
  { id: "contenido", label: "Contenido", icon: Star, color: "text-indigo-400", bg: "bg-indigo-500/10 border-indigo-500/30" },
  { id: "otro", label: "Otro", icon: Megaphone, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/30" },
];

const RECIPIENT_EMAIL = "pepe750822@gmail.com";

const Sugerencias = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre: "",
    email: user?.email || "",
    category: "mejora",
    subject: "",
    message: "",
  });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  // Auto-fill email when user loads
  useEffect(() => {
    if (user?.email) {
      setForm((f) => ({ ...f, email: user.email! }));
    }
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.message.trim() || !form.subject.trim()) {
      setError("Por favor completa el asunto y el mensaje.");
      return;
    }
    setError("");
    setSending(true);

    try {
      // Use FormSubmit.co — free, no backend needed
      const formData = new FormData();
      formData.append("_to", RECIPIENT_EMAIL);
      formData.append("_subject", `[CyberEdu MX] ${form.category.toUpperCase()}: ${form.subject}`);
      formData.append("_captcha", "false");
      formData.append("_template", "table");
      formData.append("Nombre", form.nombre || "Anónimo");
      formData.append("Correo del usuario", form.email);
      formData.append("Categoría", form.category);
      formData.append("Asunto", form.subject);
      formData.append("Mensaje", form.message);

      const res = await fetch(`https://formsubmit.co/ajax/${RECIPIENT_EMAIL}`, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: formData,
      });

      if (!res.ok) throw new Error("Error en el envío");

      setSent(true);
    } catch (err) {
      setError("Hubo un problema al enviar. Intenta de nuevo.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-12 max-w-2xl">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-white mb-8 transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          Regresar
        </button>

        {sent ? (
          /* ── Success State ── */
          <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in zoom-in-95 duration-500">
            <div className="h-20 w-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(16,185,129,0.2)]">
              <CheckCircle className="h-10 w-10 text-emerald-400" />
            </div>
            <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">
              ¡Sugerencia enviada!
            </h2>
            <p className="text-slate-400 text-sm max-w-sm mb-8 leading-relaxed">
              Gracias por tomarte el tiempo de escribirnos. Tu opinión nos ayuda
              a mejorar CyberEdu MX para todos. 🙌
            </p>
            <div className="flex gap-3">
              <Button onClick={() => navigate("/")} className="rounded-xl font-black uppercase tracking-widest text-xs">
                Ir al inicio
              </Button>
              <Button
                variant="outline"
                onClick={() => { setSent(false); setForm(f => ({ ...f, subject: "", message: "" })); }}
                className="rounded-xl font-black uppercase tracking-widest text-xs"
              >
                Enviar otra
              </Button>
            </div>
          </div>
        ) : (
          /* ── Form ── */
          <>
            {/* Header */}
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center">
                  <MessageSquarePlus className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-2xl font-black text-white uppercase tracking-tighter">
                    Sugerencias
                  </h1>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">
                    CyberEdu MX · Tu opinión importa
                  </p>
                </div>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                ¿Encontraste un error? ¿Tienes una idea para mejorar la plataforma?
                Cuéntanos. Todas las sugerencias son leídas personalmente.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Category selector */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3">
                  Categoría
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {CATEGORIES.map((cat) => {
                    const Icon = cat.icon;
                    const selected = form.category === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setForm((f) => ({ ...f, category: cat.id }))}
                        className={`flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all duration-200 text-center ${
                          selected
                            ? `${cat.bg} ${cat.color} border-current scale-[1.03] shadow-lg`
                            : "border-white/5 bg-white/[0.03] text-slate-500 hover:border-white/10 hover:bg-white/5"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest leading-tight">
                          {cat.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Name + Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">
                    Tu nombre (opcional)
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={form.nombre}
                    onChange={handleChange}
                    placeholder="Ej: María López"
                    className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-primary/50 focus:bg-primary/5 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">
                    Tu correo
                    {user?.email && (
                      <span className="ml-2 text-emerald-500 normal-case font-semibold tracking-normal">
                        · cargado automáticamente ✓
                      </span>
                    )}
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="tu@correo.com"
                    required
                    className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-primary/50 focus:bg-primary/5 transition-all disabled:opacity-60"
                  />
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">
                  Asunto *
                </label>
                <input
                  type="text"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  placeholder="Ej: El quiz de Historia no guarda mis respuestas"
                  required
                  maxLength={120}
                  className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-primary/50 focus:bg-primary/5 transition-all"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">
                  Mensaje *
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Describe tu sugerencia o problema con el mayor detalle posible..."
                  required
                  rows={6}
                  maxLength={2000}
                  className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-primary/50 focus:bg-primary/5 transition-all resize-none"
                />
                <p className="text-[10px] text-slate-600 mt-1 text-right font-bold">
                  {form.message.length}/2000
                </p>
              </div>

              {/* Error */}
              {error && (
                <p className="text-rose-400 text-xs font-bold bg-rose-500/10 border border-rose-500/20 rounded-xl px-4 py-3">
                  ⚠️ {error}
                </p>
              )}

              {/* Submit */}
              <Button
                type="submit"
                disabled={sending}
                className="w-full h-14 rounded-2xl text-sm font-black uppercase tracking-[0.2em] shadow-[0_8px_30px_rgba(var(--primary),0.3)] transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {sending ? (
                  <>
                    <span className="animate-spin mr-2 inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Enviar sugerencia
                  </>
                )}
              </Button>

              <p className="text-center text-[10px] text-slate-600 font-bold uppercase tracking-widest">
                Tu mensaje llegará a: {RECIPIENT_EMAIL}
              </p>
            </form>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Sugerencias;
