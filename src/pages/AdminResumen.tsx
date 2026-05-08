import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { RefreshCw, ExternalLink, Bot, Users, UserPlus, CreditCard, DollarSign } from "lucide-react";

// Mexico City UTC-6
function mexicoToday(): string {
  const now = new Date();
  const mx = new Date(now.getTime() - 6 * 60 * 60 * 1000);
  return mx.toISOString().split("T")[0];
}

function last7Days(): string[] {
  const today = mexicoToday();
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split("T")[0];
  });
}

// Cost calculation
// 70% DeepSeek V4-Flash, 30% Claude Haiku
// ~500 tokens input / 800 output per query
// DeepSeek: $0.27/$1.10 per 1M tokens
// Claude Haiku: $0.25/$1.25 per 1M tokens
// MXN/USD: $17.50
function calcCostUSD(queries: number): number {
  const inputTokens = queries * 500;
  const outputTokens = queries * 800;
  const deepseekFraction = 0.7;
  const haikuFraction = 0.3;

  const deepseekCost =
    (inputTokens * deepseekFraction * 0.27 + outputTokens * deepseekFraction * 1.10) / 1_000_000;
  const haikuCost =
    (inputTokens * haikuFraction * 0.25 + outputTokens * haikuFraction * 1.25) / 1_000_000;

  return deepseekCost + haikuCost;
}

const MXN_RATE = 17.5;

function fmtUSD(usd: number) {
  return `$${usd.toFixed(3)} USD`;
}
function fmtMXN(usd: number) {
  return `$${(usd * MXN_RATE).toFixed(2)} MXN`;
}

interface Stats {
  todayQueries: number;
  weekQueries: number;
  activeToday: number;
  newToday: number;
  premiumToday: number;
}

const EXTERNAL = [
  {
    title: "Tráfico",
    subtitle: "Vercel Analytics",
    desc: "Ver datos en tiempo real de visitantes, pageviews y países",
    icon: "📊",
    color: "from-blue-600 to-blue-500",
    border: "border-blue-500/20",
    url: "https://vercel.com/cyberedu-mx-s-projects/cyberedu-mx/analytics",
  },
  {
    title: "Comportamiento",
    subtitle: "Microsoft Clarity",
    desc: "Mapas de calor y grabaciones de sesiones reales de usuarios",
    icon: "🎯",
    color: "from-blue-500 to-cyan-500",
    border: "border-cyan-500/20",
    url: "https://clarity.microsoft.com",
  },
  {
    title: "Analíticas",
    subtitle: "Google Analytics",
    desc: "Sesiones, fuentes de tráfico y comportamiento de usuarios",
    icon: "📈",
    color: "from-orange-600 to-orange-500",
    border: "border-orange-500/20",
    url: "https://analytics.google.com",
  },
  {
    title: "Email",
    subtitle: "Resend",
    desc: "Deliverability 100% · Lote A enviado (21 emails) · Lote B pendiente (20 emails)",
    icon: "📧",
    color: "from-violet-600 to-violet-500",
    border: "border-violet-500/20",
    url: "https://resend.com/metrics",
  },
];

export default function AdminResumen() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const fetchStats = useCallback(async () => {
    const todayStr = mexicoToday();
    const days = last7Days();
    const todayUTC = new Date(todayStr + "T00:00:00.000Z").toISOString();

    try {
      const [todayUsageRaw, weekUsageRaw, newTodayRaw, premiumTodayRaw, activeRaw] =
        await Promise.all([
          supabase.from("daily_usage").select("count").eq("date", todayStr),
          supabase.from("daily_usage").select("count,user_id").in("date", days),
          supabase.from("profiles").select("id", { count: "exact", head: true }).gte("created_at", todayUTC),
          supabase
            .from("profiles")
            .select("id", { count: "exact", head: true })
            .gte("updated_at", todayUTC)
            .or("is_premium.eq.true,subscription_status.eq.active"),
          supabase.from("daily_usage").select("user_id").eq("date", todayStr),
        ]);

      const todayQueries = (todayUsageRaw.data || []).reduce(
        (s: number, r: any) => s + (r.count || 0), 0
      );
      const weekQueries = (weekUsageRaw.data || []).reduce(
        (s: number, r: any) => s + (r.count || 0), 0
      );
      const activeToday = new Set<string>(
        (activeRaw.data || []).map((r: any) => r.user_id)
      ).size;

      setStats({
        todayQueries,
        weekQueries,
        activeToday,
        newToday: newTodayRaw.count ?? 0,
        premiumToday: premiumTodayRaw.count ?? 0,
      });
      setLastRefresh(new Date());
    } catch (err) {
      console.error("[AdminResumen]", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
    const id = setInterval(fetchStats, 60_000);
    return () => clearInterval(id);
  }, [fetchStats]);

  const todayCostUSD = stats ? calcCostUSD(stats.todayQueries) : 0;
  const weekCostUSD = stats ? calcCostUSD(stats.weekQueries) : 0;
  // Monthly projection: week average × 30 days
  const monthlyProjectionUSD = stats ? calcCostUSD((stats.weekQueries / 7) * 30) : 0;

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white">
      {/* Header */}
      <div className="border-b border-white/5 bg-white/[0.02]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 text-sm">
            <Link to="/" className="text-slate-400 hover:text-white transition-colors">← Inicio</Link>
            <span className="text-slate-600">/</span>
            <Link to="/admin" className="text-slate-400 hover:text-white transition-colors">Admin</Link>
            <span className="text-slate-600">/</span>
            <span className="text-white font-semibold">Resumen Ejecutivo</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-slate-500 text-xs">{lastRefresh.toLocaleTimeString("es-MX")}</span>
            <button
              onClick={fetchStats}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white transition-all"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-5">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-violet-500 border-t-transparent" />
          </div>
        ) : (
          <>
            {/* Sección 1 — CyberEdu MX */}
            <section className="rounded-2xl bg-white/[0.03] border border-white/10 p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-white font-bold text-base">🎓 CyberEdu MX</h2>
                  <p className="text-slate-500 text-xs mt-0.5">Supabase · actualiza cada 60s</p>
                </div>
                <Link
                  to="/admin"
                  className="flex items-center gap-1.5 text-xs text-violet-400 hover:text-violet-300 bg-violet-500/10 border border-violet-500/20 px-3 py-1.5 rounded-lg transition-colors"
                >
                  Ver más <ExternalLink className="h-3 w-3" />
                </Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { icon: <Users className="h-4 w-4 text-emerald-400" />, label: "Activos hoy", value: stats?.activeToday ?? 0, color: "text-emerald-400" },
                  { icon: <Bot className="h-4 w-4 text-cyan-400" />, label: "Queries Tutor", value: stats?.todayQueries ?? 0, color: "text-cyan-400" },
                  { icon: <UserPlus className="h-4 w-4 text-violet-400" />, label: "Registros hoy", value: stats?.newToday ?? 0, color: "text-violet-400" },
                  { icon: <CreditCard className="h-4 w-4 text-amber-400" />, label: "Premium hoy", value: stats?.premiumToday ?? 0, color: "text-amber-400" },
                ].map((s) => (
                  <div key={s.label} className="rounded-xl bg-white/[0.04] border border-white/5 p-3">
                    <div className="flex items-center gap-1.5 mb-2">{s.icon}<span className="text-xs text-slate-500">{s.label}</span></div>
                    <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Sección 4 — Costos API (primero para visibilidad) */}
            <section className="rounded-2xl bg-white/[0.03] border border-white/10 p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-white font-bold text-base">💸 Costos estimados API</h2>
                  <p className="text-slate-500 text-xs mt-0.5">70% DeepSeek V4-Flash · 30% Claude Haiku · ~500 input / 800 output tokens/query</p>
                </div>
                <div className="flex gap-2">
                  <a href="https://console.anthropic.com/settings/usage" target="_blank" rel="noopener noreferrer"
                    className="text-xs text-amber-400 hover:text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition-colors">
                    🤖 Anthropic <ExternalLink className="h-3 w-3" />
                  </a>
                  <a href="https://platform.deepseek.com/usage" target="_blank" rel="noopener noreferrer"
                    className="text-xs text-cyan-400 hover:text-cyan-300 bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition-colors">
                    ⚡ DeepSeek <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { label: "Hoy", queries: stats?.todayQueries ?? 0, usd: todayCostUSD, icon: "📅" },
                  { label: "Últimos 7 días", queries: stats?.weekQueries ?? 0, usd: weekCostUSD, icon: "📆" },
                  { label: "Proyección mensual", queries: Math.round((stats?.weekQueries ?? 0) / 7 * 30), usd: monthlyProjectionUSD, icon: "🗓️" },
                ].map((row) => (
                  <div key={row.label} className="rounded-xl bg-white/[0.04] border border-white/5 p-4">
                    <p className="text-xs text-slate-500 mb-1">{row.icon} {row.label}</p>
                    <p className="text-slate-400 text-xs mb-2">{row.queries.toLocaleString()} queries</p>
                    <p className="text-lg font-black text-white">{fmtUSD(row.usd)}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{fmtMXN(row.usd)}</p>
                  </div>
                ))}
              </div>
              <p className="text-xs text-slate-600 mt-3">
                Tarifas: DeepSeek $0.27/$1.10 · Haiku $0.25/$1.25 por 1M tokens · TC $17.50 MXN/USD
              </p>
            </section>

            {/* Secciones externas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {EXTERNAL.map((s) => (
                <section key={s.title} className={`rounded-2xl bg-white/[0.03] border ${s.border} p-5`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xl">{s.icon}</span>
                        <div>
                          <h2 className="text-white font-bold text-sm leading-tight">{s.title}</h2>
                          <p className="text-slate-500 text-xs">{s.subtitle}</p>
                        </div>
                      </div>
                      <p className="text-slate-400 text-sm mt-2 leading-relaxed">{s.desc}</p>
                    </div>
                  </div>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`mt-4 w-full flex items-center justify-center gap-2 bg-gradient-to-r ${s.color} text-white text-xs font-semibold py-2 px-4 rounded-xl hover:opacity-90 transition-opacity`}
                  >
                    Ver más <ExternalLink className="h-3 w-3" />
                  </a>
                </section>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
