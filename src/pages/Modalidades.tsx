import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  GraduationCap,
  ClipboardList,
  BookOpen,
  Layers,
  CheckCircle2,
  AlertCircle,
  CalendarDays,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Info,
  Star,
  Zap,
  Shield,
  KeyRound,
  Camera,
  FileText,
  Users,
  MapPin,
  Clock,
  Trophy,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/* ──────────────────────────────────────────────────────── */
/*  DATOS OFICIALES — INSTRUCTIVO 2026                      */
/* ──────────────────────────────────────────────────────── */

const ESCUELAS_SIN_EXAMEN = [
  "COLBACH",
  "CONALEP",
  "DGB",
  "DGETAyCM",
  "DGETI",
  "IEMS",
  "SECTI",
  "UAEMéx",
];

/* --------------- ETAPAS OFICIALES DEL PROCESO ----------- */
const etapas = [
  {
    num: "I",
    title: "Publicación de la Convocatoria",
    date: "13 de febrero de 2026",
    icon: FileText,
    color: "text-sky-400",
    bg: "bg-sky-500/10",
    desc: "La Convocatoria oficial estableció las bases, procedimientos y fechas para participar. Disponible en https://miderechomilugar.gob.mx/ y https://gob.mx/sep.",
  },
  {
    num: "II",
    title: "Documentos Informativos",
    date: "A partir del 17 de marzo de 2026",
    icon: BookOpen,
    color: "text-violet-400",
    bg: "bg-violet-500/10",
    desc: "Se publican: la Convocatoria, este Instructivo, los catálogos de opciones educativas (con y sin examen) y los requisitos de cada institución.",
  },
  {
    num: "III",
    title: "Elección de Modalidad y Opciones",
    date: "Antes del registro",
    icon: Layers,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    desc: "Debes decidir: (1) la modalidad de participación y (2) las opciones educativas ordenadas de mayor a menor preferencia. Decídelo con tu madre, padre o tutor.",
  },
  {
    num: "IV",
    title: "Registro de Aspirantes",
    date: "17 de marzo al 14 de abril de 2026",
    icon: ClipboardList,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    desc: "Registro vía internet en https://miderechomilugar.gob.mx/ — Requiere LLAVE MX (llave.gob.mx). Incluye: datos personales, encuesta, elección de modalidad y opciones educativas.",
    highlight: true,
  },
  {
    num: "V",
    title: "Conclusión del Registro (Modalidades 2 y 3)",
    date: "18 al 22 de mayo de 2026",
    icon: Camera,
    color: "text-rose-400",
    bg: "bg-rose-500/10",
    desc: "Solo para quienes eligen el examen del IPN o UNAM. Deben ingresar al portal para conocer procedimientos y asistir a la toma de fotografía en la fecha y lugar indicados.",
  },
  {
    num: "VI",
    title: "Presentación del Examen (Modalidades 2 y 3)",
    date: "Fechas según IPN/UNAM",
    icon: Trophy,
    color: "text-orange-400",
    bg: "bg-orange-500/10",
    desc: "El IPN y la UNAM informarán los trámites previos, características y reglas del examen. Quienes no lo presenten NO podrán ser considerados para asignación en estas instituciones.",
  },
  {
    num: "VII",
    title: "Publicación de Resultados e Inscripciones",
    date: "18 de agosto de 2026",
    icon: Star,
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
    desc: "Los resultados se publican en https://miderechomilugar.gob.mx/ — Gaceta Electrónica de Resultados (documento oficial). También consulta vía EDUCATEL.",
  },
  {
    num: "VIII",
    title: "Atención de Aspirantes Extemporáneos",
    date: "19 al 26 de agosto de 2026",
    icon: Clock,
    color: "text-slate-400",
    bg: "bg-slate-500/10",
    desc: "Para quienes no se registraron en el periodo oficial. Solo pueden solicitar opciones de acceso directo (sin examen) con lugares disponibles.",
  },
];

/* --------------- MODALIDADES ----------------------------- */
const modalidades = [
  {
    id: 1,
    title: "Solo Escuelas Sin Examen",
    subtitle: "Modalidad 1",
    icon: ClipboardList,
    color: "text-emerald-400",
    borderColor: "border-emerald-500/30",
    bgAccent: "bg-emerald-500/10",
    gradientFrom: "from-emerald-500",
    gradientTo: "to-teal-600",
    badgeColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    idealFor:
      "Quieres ingresar a planteles de acceso directo y prefieres un proceso sin examen de admisión.",
    description:
      "Participas únicamente para las instituciones de acceso directo. No presentarás ningún examen.",
    details: [
      {
        icon: Shield,
        label: "Sin examen",
        text: "No se requiere examen de admisión. El acceso es directo.",
      },
      {
        icon: BookOpen,
        label: "Instituciones disponibles",
        text: ESCUELAS_SIN_EXAMEN.join(" · "),
      },
      {
        icon: Layers,
        label: "Número de opciones",
        text: "Mínimo 5 y máximo 10 opciones educativas (planteles + especialidad/carrera).",
      },
      {
        icon: Star,
        label: "Orden de preferencia",
        text: "Ordena tus opciones de mayor a menor preferencia. El sistema asigna el lugar en la opción más alta con cupo disponible. Puedes combinar o intercalar opciones.",
      },
    ],
  },
  {
    id: 2,
    title: "Solo IPN y UNAM (Con Examen)",
    subtitle: "Modalidad 2",
    icon: GraduationCap,
    color: "text-violet-400",
    borderColor: "border-violet-500/30",
    bgAccent: "bg-violet-500/10",
    gradientFrom: "from-violet-600",
    gradientTo: "to-indigo-600",
    badgeColor: "bg-violet-500/20 text-violet-400 border-violet-500/30",
    idealFor:
      "Tu meta es ingresar al IPN o la UNAM y estás dispuesto a presentar su examen de admisión.",
    description:
      "Participas exclusivamente para el IPN y/o la UNAM aplicando examen de ingreso.",
    details: [
      {
        icon: AlertCircle,
        label: "Examen obligatorio",
        text: "Debes presentar el examen que diseña, aplica y califica el IPN y/o la UNAM. Sin examen, no hay asignación.",
      },
      {
        icon: Layers,
        label: "Número de opciones",
        text: "Hasta 5 opciones del IPN + hasta 5 opciones de la UNAM (máximo 10 en total).",
      },
      {
        icon: Star,
        label: "Orden de preferencia",
        text: "Puedes combinar e intercalar opciones del IPN y de la UNAM según tu preferencia.",
      },
      {
        icon: Camera,
        label: "Trámite adicional (18–22 mayo)",
        text: "Del 18 al 22 de mayo debes ingresar al portal para conocer procedimientos y la cita para fotografía.",
      },
    ],
  },
  {
    id: 3,
    title: "Combinada: Sin Examen + IPN + UNAM",
    subtitle: "Modalidad 3",
    icon: Layers,
    color: "text-amber-400",
    borderColor: "border-amber-500/30",
    bgAccent: "bg-amber-500/10",
    gradientFrom: "from-amber-500",
    gradientTo: "to-orange-600",
    badgeColor: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    idealFor:
      "Quieres maximizar tus opciones: aspirar al IPN/UNAM Y tener escuelas sin examen como respaldo.",
    description:
      "Combinas ambas modalidades. Elaboras dos listados que se unen en un único orden de preferencia.",
    details: [
      {
        icon: CheckCircle2,
        label: "Listado 1 — Acceso directo (sin examen)",
        text: `Mínimo 5 y máximo 10 opciones de: ${ESCUELAS_SIN_EXAMEN.join(", ")}.`,
      },
      {
        icon: CheckCircle2,
        label: "Listado 2 — Con examen",
        text: "Hasta 5 opciones del IPN y hasta 5 de la UNAM.",
      },
      {
        icon: Star,
        label: "Un solo orden unificado",
        text: "Los dos listados se combinan o intercalan en un solo orden de preferencia. Ejemplo: 1°UNAM, 2°CONALEP, 3°IPN… El sistema respeta ese orden al asignarte.",
      },
      {
        icon: AlertCircle,
        label: "Examen requerido para IPN/UNAM",
        text: "Estás obligado a presentar el examen para ser considerado en las opciones que lo requieren. Si no lo presentas, solo se tomarán en cuenta tus opciones de acceso directo.",
      },
    ],
  },
];

/* --------------- PUNTOS CLAVE / FAQ ---------------------- */
const faqData = [
  {
    q: "¿Cuándo es el registro y dónde?",
    a: "Del 17 de marzo al 14 de abril de 2026, vía internet en https://miderechomilugar.gob.mx/ — ¡Hoy es el primer día!",
    icon: CalendarDays,
  },
  {
    q: "¿Qué necesito para registrarme?",
    a: "Primero genera tu LLAVE MX en https://llave.gob.mx/ — Si eres mexicano solo necesitas tu CURP, número de celular y correo electrónico. Si eres extranjero sin CURP, necesitas datos personales y una identificación oficial (jpg, png o pdf).",
    icon: KeyRound,
  },
  {
    q: "¿Qué es la LLAVE MX?",
    a: "Es el sistema de identidad digital del gobierno mexicano. Es obligatoria para iniciar tu registro en miderechomilugar.gob.mx. Créala en https://llave.gob.mx/ antes de intentar registrarte.",
    icon: Shield,
  },
  {
    q: "¿Cuántas opciones educativas hay en total?",
    a: "El proceso ofrece 1,070 opciones educativas en 545 planteles de la Zona Metropolitana del Valle de México.",
    icon: MapPin,
  },
  {
    q: "¿Cuándo salen los resultados?",
    a: "Los resultados se publican el 18 de agosto de 2026 en https://miderechomilugar.gob.mx/ — La Gaceta Electrónica de Resultados es el único documento oficial.",
    icon: Trophy,
  },
  {
    q: "¿Qué pasa si no me asignan en ninguna opción?",
    a: "Si no fuiste asignado, hay una etapa de aspirantes extemporáneos del 19 al 26 de agosto de 2026, donde puedes solicitar ingreso en opciones de acceso directo que tengan lugares disponibles.",
    icon: Info,
  },
  {
    q: "¿Puedo cambiar mis opciones después de registrarme?",
    a: "No. Una vez que aceptas y generas tu comprobante de registro, las opciones educativas quedan definidas con las que participarás. Revisa bien antes de concluir.",
    icon: AlertCircle,
  },
  {
    q: "¿Cómo elijo mis opciones educativas?",
    a: "Consulta el catálogo de opciones en el portal. Usa el 'Buscador de opciones educativas' para ver la ubicación geográfica de cada plantel. Ordena solo las opciones donde estés dispuesto a inscribirte.",
    icon: BookOpen,
  },
];

/* ──────────────────────────────────────────────────────── */
/*  SUB-COMPONENTES                                         */
/* ──────────────────────────────────────────────────────── */

const ModalidadCard = ({
  mod,
  isOpen,
  onToggle,
}: {
  mod: (typeof modalidades)[0];
  isOpen: boolean;
  onToggle: () => void;
}) => {
  const Icon = mod.icon;
  return (
    <div
      className={cn(
        "relative bg-card border rounded-[2rem] overflow-hidden shadow-xl transition-all duration-500",
        mod.borderColor,
        isOpen ? "shadow-2xl" : ""
      )}
    >
      {/* Gradient top stripe */}
      <div
        className={cn(
          "absolute top-0 left-0 right-0 h-1 bg-gradient-to-r",
          mod.gradientFrom,
          mod.gradientTo
        )}
      />

      {/* Header button */}
      <button
        onClick={onToggle}
        className="w-full text-left p-6 md:p-8 flex items-start gap-5 group"
        aria-expanded={isOpen}
      >
        <div
          className={cn(
            "p-3 rounded-2xl shrink-0 mt-0.5 transition-transform group-hover:scale-110",
            mod.bgAccent
          )}
        >
          <Icon className={cn("h-6 w-6", mod.color)} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span
              className={cn(
                "text-[9px] font-black uppercase tracking-[0.25em] px-2 py-1 rounded-full border",
                mod.badgeColor
              )}
            >
              {mod.subtitle}
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-black uppercase tracking-tighter text-foreground leading-tight">
            {mod.title}
          </h2>
          <p className="text-sm text-muted-foreground mt-1 font-medium leading-relaxed">
            {mod.description}
          </p>
        </div>
        <div
          className={cn(
            "shrink-0 p-2 rounded-xl transition-all duration-300",
            mod.bgAccent,
            isOpen ? "rotate-180" : ""
          )}
        >
          <ChevronDown className={cn("h-5 w-5", mod.color)} />
        </div>
      </button>

      {/* Expandable content */}
      <div
        className={cn(
          "overflow-hidden transition-all duration-500",
          isOpen ? "max-h-[900px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="px-6 md:px-8 pb-8 space-y-4">
          {/* Ideal for */}
          <div
            className={cn(
              "flex items-start gap-3 p-4 rounded-2xl border",
              mod.bgAccent,
              mod.borderColor
            )}
          >
            <Zap className={cn("h-4 w-4 shrink-0 mt-0.5", mod.color)} />
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-0.5">
                Ideal si…
              </p>
              <p className="text-sm font-medium text-foreground leading-relaxed">
                {mod.idealFor}
              </p>
            </div>
          </div>

          {/* Detail cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {mod.details.map((detail, i) => {
              const DIcon = detail.icon;
              return (
                <div
                  key={i}
                  className="bg-muted/30 border border-border/50 rounded-2xl p-4 hover:border-border transition-colors"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <DIcon className={cn("h-4 w-4 shrink-0", mod.color)} />
                    <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                      {detail.label}
                    </p>
                  </div>
                  <p className="text-xs font-medium text-foreground leading-relaxed">
                    {detail.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ──────────────────────────────────────────────────────── */
/*  PAGE                                                    */
/* ──────────────────────────────────────────────────────── */

const Modalidades = () => {
  const navigate = useNavigate();
  const [openId, setOpenId] = useState<number | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [openEtapa, setOpenEtapa] = useState<number | null>(null);

  const toggle = (id: number) => setOpenId((p) => (p === id ? null : id));
  const toggleFaq = (i: number) => setOpenFaq((p) => (p === i ? null : i));
  const toggleEtapa = (i: number) => setOpenEtapa((p) => (p === i ? null : i));

  useEffect(() => {
    document.title = "Modalidades ECOEMS 2026 - Guía Oficial de Registro | CyberEdu MX";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", "Conoce las 3 modalidades del proceso de asignación ECOEMS 2026. Fechas oficiales, requisitos, LLAVE MX y cómo elegir entre IPN, UNAM o escuelas sin examen.");
    }

    // Structured Data for FAQ
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "¿Cuándo es el registro ECOEMS 2026?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "El registro es del 17 de marzo al 14 de abril de 2026 vía internet."
          }
        },
        {
          "@type": "Question",
          "name": "¿Qué es la LLAVE MX?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Es el sistema de identidad digital obligatorio para iniciar el registro en miderechomilugar.gob.mx."
          }
        }
      ]
    };

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.innerHTML = JSON.stringify(faqSchema);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* ── HERO ── */}
      <section className="relative overflow-hidden border-b border-primary/20">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-violet-600/10 blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

        <div className="relative container mx-auto px-4 py-16 md:py-24 text-center">
          {/* Urgency badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/15 border border-red-500/30 text-red-400 text-xs font-black uppercase tracking-widest mb-6 animate-bounce">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
            </span>
            ¡HOY INICIA EL REGISTRO! — 17 Mar al 14 Abr 2026
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter text-foreground mb-4 leading-tight">
            Proceso de{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-indigo-400 to-sky-400">
              Asignación EMS
            </span>{" "}
            2026
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-4 font-medium leading-relaxed">
            Zona Metropolitana del Valle de México —{" "}
            <strong className="text-foreground">ECOEMS 2026</strong>. Hay{" "}
            <span className="text-amber-400 font-black">3 modalidades</span>,{" "}
            <span className="text-emerald-400 font-black">
              1,070 opciones educativas
            </span>{" "}
            en{" "}
            <span className="text-sky-400 font-black">545 planteles</span>.
          </p>
          <p className="text-sm text-muted-foreground mb-8 font-medium">
            Fuente oficial:{" "}
            <span className="text-primary font-bold">
              Instructivo del Proceso de Asignación 2026 · ECOEMS
            </span>
          </p>

          {/* Quick stats */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {[
              { label: "Modalidades", value: "3", color: "text-violet-400" },
              {
                label: "Opciones Educativas",
                value: "1,070",
                color: "text-emerald-400",
              },
              { label: "Planteles", value: "545", color: "text-sky-400" },
              {
                label: "Días para Registrarte",
                value: "28",
                color: "text-amber-400",
              },
            ].map((s, i) => (
              <div
                key={i}
                className="bg-card border border-border rounded-2xl px-5 py-3 text-center"
              >
                <p className={cn("text-2xl md:text-3xl font-black", s.color)}>
                  {s.value}
                </p>
                <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground mt-1">
                  {s.label}
                </p>
              </div>
            ))}
          </div>

          <a
            href="https://miderechomilugar.gob.mx/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button className="h-14 px-8 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-sm font-black uppercase tracking-widest shadow-[0_10px_40px_rgba(124,58,237,0.35)] hover:scale-105 transition-all">
              <ExternalLink className="mr-2 h-4 w-4" />
              Registrarme Ahora — Portal Oficial
            </Button>
          </a>
        </div>
      </section>

      {/* ── LLAVE MX ALERT ── */}
      <section className="container mx-auto px-4 pt-12 max-w-4xl">
        <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-rose-500/10 border border-amber-500/30 rounded-[2rem] p-6 md:p-8 flex flex-col sm:flex-row items-start gap-5">
          <div className="p-3 bg-amber-500/20 rounded-2xl shrink-0">
            <KeyRound className="h-6 w-6 text-amber-400" />
          </div>
          <div className="flex-1">
            <p className="text-[9px] font-black uppercase tracking-widest text-amber-400 mb-1">
              Paso Previo Obligatorio
            </p>
            <h3 className="text-lg font-black text-foreground mb-2 uppercase tracking-tight">
              Genera tu LLAVE MX antes de registrarte
            </h3>
            <p className="text-sm text-muted-foreground font-medium leading-relaxed mb-3">
              Para acceder al sistema de registro en{" "}
              <span className="text-primary">miderechomilugar.gob.mx</span>{" "}
              necesitas una <strong className="text-foreground">LLAVE MX</strong>.
              Si eres mexicano solo necesitas tu <strong>CURP</strong>, número
              de celular y correo electrónico. Créala en{" "}
              <span className="text-amber-400 font-bold">llave.gob.mx</span>{" "}
              antes de intentar registrarte.
            </p>
            <a
              href="https://www.llave.gob.mx/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                variant="outline"
                size="sm"
                className="h-9 rounded-xl font-black uppercase tracking-widest text-[10px] border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
              >
                <KeyRound className="mr-2 h-3 w-3" />
                Obtener LLAVE MX
                <ExternalLink className="ml-2 h-3 w-3" />
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* ── LAS 3 MODALIDADES ── */}
      <section className="container mx-auto px-4 py-14 space-y-5 max-w-4xl">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-foreground mb-3">
            Las 3 Modalidades
          </h2>
          <p className="text-muted-foreground text-sm font-medium max-w-xl mx-auto">
            Elige la modalidad en conjunto con tu madre, padre o tutor. Esta
            decisión define en qué instituciones puedes solicitar ingreso.
          </p>
        </div>

        {modalidades.map((mod) => (
          <ModalidadCard
            key={mod.id}
            mod={mod}
            isOpen={openId === mod.id}
            onToggle={() => toggle(mod.id)}
          />
        ))}
      </section>

      {/* ── TABLA COMPARATIVA ── */}
      <section className="container mx-auto px-4 pb-14 max-w-4xl">
        <div className="bg-card border border-border rounded-[2rem] overflow-hidden shadow-xl">
          <div className="p-6 md:p-8 border-b border-border">
            <h2 className="text-2xl font-black uppercase tracking-tighter text-foreground mb-1">
              Comparación Rápida
            </h2>
            <p className="text-muted-foreground text-sm font-medium">
              Datos tomados directamente del Instructivo ECOEMS 2026.
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left px-6 py-4 text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                    Característica
                  </th>
                  <th className="px-4 py-4 text-center text-emerald-400 text-[9px] font-black uppercase tracking-widest">
                    Modalidad 1
                  </th>
                  <th className="px-4 py-4 text-center text-violet-400 text-[9px] font-black uppercase tracking-widest">
                    Modalidad 2
                  </th>
                  <th className="px-4 py-4 text-center text-amber-400 text-[9px] font-black uppercase tracking-widest">
                    Modalidad 3
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[
                  {
                    feature: "Presentas examen de admisión",
                    m1: "No",
                    m2: "Sí",
                    m3: "Sí (para IPN/UNAM)",
                  },
                  {
                    feature: "Acceso a COLBACH, DGB, CONALEP…",
                    m1: "Sí",
                    m2: "No",
                    m3: "Sí",
                  },
                  {
                    feature: "Acceso a IPN",
                    m1: "No",
                    m2: "Sí",
                    m3: "Sí",
                  },
                  {
                    feature: "Acceso a UNAM",
                    m1: "No",
                    m2: "Sí",
                    m3: "Sí",
                  },
                  {
                    feature: "Opciones sin examen",
                    m1: "5–10",
                    m2: "—",
                    m3: "5–10",
                  },
                  {
                    feature: "Opciones IPN (máx.)",
                    m1: "—",
                    m2: "5",
                    m3: "5",
                  },
                  {
                    feature: "Opciones UNAM (máx.)",
                    m1: "—",
                    m2: "5",
                    m3: "5",
                  },
                  {
                    feature: "Trámite adicional (18–22 mayo)",
                    m1: "No",
                    m2: "Sí (cita + foto)",
                    m3: "Sí (cita + foto)",
                  },
                  {
                    feature: "Opciones intercalables",
                    m1: "Sí",
                    m2: "Sí",
                    m3: "Sí (ambos listados)",
                  },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-muted/20 transition-colors">
                    <td className="px-6 py-4 font-semibold text-foreground text-xs">
                      {row.feature}
                    </td>
                    {[row.m1, row.m2, row.m3].map((val, j) => (
                      <td key={j} className="px-4 py-4 text-center">
                        {val === "Sí" || val === "No" ? (
                          <span
                            className={cn(
                              "inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-black",
                              val === "Sí"
                                ? "bg-emerald-500/15 text-emerald-400"
                                : "bg-red-500/10 text-red-400"
                            )}
                          >
                            {val === "Sí" ? "✓" : "✗"}
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-muted-foreground whitespace-nowrap">
                            {val}
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── ETAPAS DEL PROCESO ── */}
      <section className="container mx-auto px-4 pb-14 max-w-4xl">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-foreground mb-3">
            Las 8 Etapas del Proceso
          </h2>
          <p className="text-muted-foreground text-sm font-medium max-w-xl mx-auto">
            Conoce todo el calendario oficial. Datos del Instructivo ECOEMS 2026.
          </p>
        </div>

        <div className="space-y-3">
          {etapas.map((etapa, i) => {
            const EIcon = etapa.icon;
            return (
              <div
                key={i}
                className={cn(
                  "bg-card border rounded-2xl overflow-hidden transition-all",
                  etapa.highlight
                    ? "border-emerald-500/40 shadow-lg shadow-emerald-500/10"
                    : "border-border hover:border-primary/20"
                )}
              >
                <button
                  onClick={() => toggleEtapa(i)}
                  className="w-full flex items-center gap-4 px-5 py-4 text-left group"
                >
                  <div
                    className={cn(
                      "flex items-center justify-center w-8 h-8 rounded-xl shrink-0 text-[10px] font-black",
                      etapa.bg,
                      etapa.color
                    )}
                  >
                    {etapa.num}
                  </div>
                  <div
                    className={cn(
                      "p-2 rounded-xl shrink-0",
                      etapa.bg
                    )}
                  >
                    <EIcon className={cn("h-4 w-4", etapa.color)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-foreground text-sm truncate">
                        {etapa.title}
                      </span>
                      {etapa.highlight && (
                        <span className="text-[8px] bg-red-500 text-white font-black px-1.5 py-0.5 rounded-full uppercase tracking-wider animate-pulse shrink-0">
                          Activo Hoy
                        </span>
                      )}
                    </div>
                    <p className={cn("text-[10px] font-black uppercase tracking-wider mt-0.5", etapa.color)}>
                      {etapa.date}
                    </p>
                  </div>
                  <ChevronRight
                    className={cn(
                      "h-4 w-4 text-muted-foreground transition-transform duration-300 shrink-0",
                      openEtapa === i ? "rotate-90" : ""
                    )}
                  />
                </button>
                <div
                  className={cn(
                    "overflow-hidden transition-all duration-300",
                    openEtapa === i ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                  )}
                >
                  <div className="px-5 pb-5 pl-[4.5rem]">
                    <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                      {etapa.desc}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── PREGUNTAS FRECUENTES ── */}
      <section className="container mx-auto px-4 pb-20 max-w-4xl">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-foreground mb-3">
            Preguntas Frecuentes
          </h2>
          <p className="text-muted-foreground text-sm font-medium max-w-xl mx-auto">
            Respuestas basadas en el Instructivo Oficial ECOEMS 2026.
          </p>
        </div>
        <div className="space-y-3">
          {faqData.map((item, i) => {
            const FIcon = item.icon;
            return (
              <div
                key={i}
                className="bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/30 transition-colors"
              >
                <button
                  onClick={() => toggleFaq(i)}
                  className="w-full flex items-center gap-4 px-6 py-5 text-left"
                >
                  <div className="p-2 bg-primary/10 rounded-xl shrink-0">
                    <FIcon className="h-4 w-4 text-primary" />
                  </div>
                  <span className="flex-1 font-bold text-foreground text-sm">
                    {item.q}
                  </span>
                  <ChevronRight
                    className={cn(
                      "h-4 w-4 text-muted-foreground transition-transform duration-300 shrink-0",
                      openFaq === i ? "rotate-90" : ""
                    )}
                  />
                </button>
                <div
                  className={cn(
                    "overflow-hidden transition-all duration-300",
                    openFaq === i
                      ? "max-h-48 opacity-100"
                      : "max-h-0 opacity-0"
                  )}
                >
                  <div className="px-6 pb-5 pl-16">
                    <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                      {item.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section className="container mx-auto px-4 pb-24 max-w-4xl">
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 via-indigo-600 to-sky-500 rounded-[2.5rem] blur opacity-25 group-hover:opacity-50 transition duration-1000" />
          <div className="relative bg-card border border-violet-500/20 rounded-[2.5rem] p-8 md:p-12 text-center overflow-hidden">
            <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none">
              <GraduationCap className="h-48 w-48 text-violet-400" />
            </div>
            <div className="relative z-10 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-black uppercase tracking-widest">
                <Zap className="h-3 w-3 animate-bounce" />
                Registro Abierto HOY — Primer Día
              </div>
              <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-foreground">
                ¡Regístrate{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-sky-400 italic">
                  hoy mismo!
                </span>
              </h2>
              <p className="text-muted-foreground text-base font-medium max-w-xl mx-auto leading-relaxed">
                <strong className="text-foreground">17 de marzo de 2026</strong>{" "}
                — Primer día del registro oficial. Platica con tu familia, elige tu
                modalidad y completa tu trámite en el portal antes del 14 de
                abril. ¡No lo dejes para después!
              </p>

              {/* Mini calendar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-xl mx-auto text-left">
                {[
                  { label: "Registro", date: "17 Mar – 14 Abr", color: "text-emerald-400" },
                  { label: "Foto IPN/UNAM", date: "18–22 Mayo", color: "text-rose-400" },
                  { label: "Resultados", date: "18 Agosto", color: "text-yellow-400" },
                  { label: "Extemporáneos", date: "19–26 Agosto", color: "text-slate-400" },
                ].map((c, i) => (
                  <div key={i} className="bg-muted/30 border border-border/50 rounded-2xl p-3">
                    <p className={cn("text-[8px] font-black uppercase tracking-widest mb-1", c.color)}>
                      {c.label}
                    </p>
                    <p className="text-xs font-bold text-foreground">{c.date}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="https://miderechomilugar.gob.mx/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="h-14 px-10 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-sm font-black uppercase tracking-widest shadow-[0_10px_40px_rgba(124,58,237,0.35)] hover:scale-105 transition-all w-full sm:w-auto">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Ir al Portal Oficial
                  </Button>
                </a>
                <a
                  href="https://www.llave.gob.mx/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    variant="outline"
                    className="h-14 px-8 rounded-2xl font-black uppercase tracking-widest text-xs border-amber-500/30 text-amber-400 hover:bg-amber-500/10 transition-all w-full sm:w-auto"
                  >
                    <KeyRound className="mr-2 h-4 w-4" />
                    Generar LLAVE MX
                  </Button>
                </a>
                <Button
                  variant="outline"
                  onClick={() => navigate("/")}
                  className="h-14 px-8 rounded-2xl font-black uppercase tracking-widest text-xs border-border hover:border-primary/40 transition-all w-full sm:w-auto"
                >
                  <GraduationCap className="mr-2 h-4 w-4" />
                  Seguir Estudiando
                </Button>
              </div>
              <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                Fuente:{" "}
                <span className="text-primary">
                  Instructivo del Proceso de Asignación EMS 2026 · ECOEMS
                </span>
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Modalidades;
