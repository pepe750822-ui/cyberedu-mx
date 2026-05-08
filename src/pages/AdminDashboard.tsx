import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { Users, Bot, UserPlus, CreditCard, RefreshCw, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

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

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "justo ahora";
  if (m < 60) return `hace ${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `hace ${h}h`;
  return `hace ${Math.floor(h / 24)}d`;
}

interface TodayStats {
  activeUsers: number;
  newRegistrations: number;
  totalQueries: number;
  premiumUpdatedToday: number;
}

interface ChartPoint {
  date: string;
  activeUsers: number;
  queries: number;
  newUsers: number;
}

interface RecentEvent {
  user: string;
  action: string;
  time: string;
}

interface ConversionStats {
  totalUsers: number;
  tutorUsers: number;
  premiumUsers: number;
}

const REFRESH_INTERVAL = 30_000;

export default function AdminDashboard() {
  const [today, setToday] = useState<TodayStats | null>(null);
  const [chart, setChart] = useState<ChartPoint[]>([]);
  const [events, setEvents] = useState<RecentEvent[]>([]);
  const [conversion, setConversion] = useState<ConversionStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const fetchAll = useCallback(async () => {
    const todayStr = mexicoToday();
    const days = last7Days();
    const sevenDaysAgoISO = new Date(days[0] + "T00:00:00.000Z").toISOString();
    // Start of today in UTC (used for profiles created_at range)
    const todayUTC = new Date(todayStr + "T00:00:00.000Z").toISOString();

    try {
      const [
        activeRaw,
        newUsersRaw,
        queriesTodayRaw,
        premiumTodayRaw,
        weekUsageRaw,
        weekProfilesRaw,
        recentProfilesRaw,
        totalUsersRaw,
        allUsageRaw,
        premiumUsersRaw,
      ] = await Promise.all([
        // Active users today (distinct user_ids)
        supabase.from("daily_usage").select("user_id").eq("date", todayStr),
        // New registrations today
        supabase.from("profiles").select("id", { count: "exact", head: true }).gte("created_at", todayUTC),
        // Queries today
        supabase.from("daily_usage").select("count").eq("date", todayStr),
        // Premium updated today (proxy for purchases)
        supabase.from("profiles").select("id", { count: "exact", head: true })
          .gte("updated_at", todayUTC)
          .or("is_premium.eq.true,subscription_status.eq.active"),
        // Last 7 days usage
        supabase.from("daily_usage").select("date,user_id,count").in("date", days),
        // Last 7 days new profiles
        supabase.from("profiles").select("created_at").gte("created_at", sevenDaysAgoISO),
        // Recent registrations (events table)
        supabase.from("profiles").select("name,email,created_at").order("created_at", { ascending: false }).limit(10),
        // Total users
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        // All usage (for tutor users conversion)
        supabase.from("daily_usage").select("user_id"),
        // Premium users
        supabase.from("profiles").select("id", { count: "exact", head: true })
          .or("is_premium.eq.true,subscription_status.eq.active,tokens.gt.0"),
      ]);

      // --- Today stats ---
      const activeSet = new Set<string>(
        (activeRaw.data || []).map((r: any) => r.user_id)
      );
      const totalQueriesCount = (queriesTodayRaw.data || []).reduce(
        (s: number, r: any) => s + (r.count || 0), 0
      );
      setToday({
        activeUsers: activeSet.size,
        newRegistrations: newUsersRaw.count ?? 0,
        totalQueries: totalQueriesCount,
        premiumUpdatedToday: premiumTodayRaw.count ?? 0,
      });

      // --- 7-day chart ---
      const usageByDay: Record<string, { users: Set<string>; queries: number }> = {};
      for (const d of days) usageByDay[d] = { users: new Set(), queries: 0 };
      for (const row of weekUsageRaw.data || []) {
        if (!usageByDay[row.date]) continue;
        usageByDay[row.date].users.add(row.user_id);
        usageByDay[row.date].queries += row.count || 0;
      }
      const profilesByDay: Record<string, number> = {};
      for (const d of days) profilesByDay[d] = 0;
      for (const row of weekProfilesRaw.data || []) {
        const day = new Date(row.created_at).toISOString().split("T")[0];
        if (day in profilesByDay) profilesByDay[day]++;
      }
      setChart(
        days.map((d) => ({
          date: d.slice(5), // MM-DD
          activeUsers: usageByDay[d].users.size,
          queries: usageByDay[d].queries,
          newUsers: profilesByDay[d],
        }))
      );

      // --- Recent events ---
      const evts: RecentEvent[] = (recentProfilesRaw.data || []).map((p: any) => ({
        user: p.name || p.email || "Anónimo",
        action: "Nuevo registro",
        time: timeAgo(p.created_at),
      }));
      setEvents(evts);

      // --- Conversion ---
      const uniqueTutorUsers = new Set<string>(
        (allUsageRaw.data || []).map((r: any) => r.user_id)
      ).size;
      setConversion({
        totalUsers: totalUsersRaw.count ?? 0,
        tutorUsers: uniqueTutorUsers,
        premiumUsers: premiumUsersRaw.count ?? 0,
      });

      setLastRefresh(new Date());
    } catch (err) {
      console.error("[AdminDashboard] Error fetching:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
    const id = setInterval(fetchAll, REFRESH_INTERVAL);
    return () => clearInterval(id);
  }, [fetchAll]);

  const pct = (a: number, b: number) =>
    b === 0 ? "0%" : `${Math.round((a / b) * 100)}%`;

  const statCards = today
    ? [
        {
          icon: <Users className="h-5 w-5 text-emerald-400" />,
          label: "Activos hoy",
          value: today.activeUsers,
          color: "text-emerald-400",
          bg: "from-emerald-500/10 to-emerald-500/5",
          border: "border-emerald-500/20",
        },
        {
          icon: <UserPlus className="h-5 w-5 text-violet-400" />,
          label: "Registros hoy",
          value: today.newRegistrations,
          color: "text-violet-400",
          bg: "from-violet-500/10 to-violet-500/5",
          border: "border-violet-500/20",
        },
        {
          icon: <Bot className="h-5 w-5 text-cyan-400" />,
          label: "Queries Tutor hoy",
          value: today.totalQueries,
          color: "text-cyan-400",
          bg: "from-cyan-500/10 to-cyan-500/5",
          border: "border-cyan-500/20",
        },
        {
          icon: <CreditCard className="h-5 w-5 text-amber-400" />,
          label: "Premium activos hoy",
          value: today.premiumUpdatedToday,
          color: "text-amber-400",
          bg: "from-amber-500/10 to-amber-500/5",
          border: "border-amber-500/20",
        },
      ]
    : [];

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white">
      {/* Header */}
      <div className="border-b border-white/5 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="text-slate-400 hover:text-white transition-colors text-sm">
              ← Inicio
            </Link>
            <span className="text-slate-600">/</span>
            <h1 className="text-white font-bold text-lg">Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/admin/resumen"
              className="flex items-center gap-1.5 text-xs text-violet-400 hover:text-violet-300 bg-violet-500/10 border border-violet-500/20 px-3 py-1.5 rounded-lg transition-colors"
            >
              📋 Ver Resumen Ejecutivo →
            </Link>
            <span className="text-slate-500 text-xs">
              Actualizado: {lastRefresh.toLocaleTimeString("es-MX")}
            </span>
            <button
              onClick={fetchAll}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white transition-all"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-violet-500 border-t-transparent" />
          </div>
        ) : (
          <>
            {/* Fila 1 — Tarjetas */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {statCards.map((card) => (
                <div
                  key={card.label}
                  className={`rounded-2xl bg-gradient-to-br ${card.bg} border ${card.border} p-5`}
                >
                  <div className="flex items-center gap-2 mb-3">
                    {card.icon}
                    <span className="text-xs text-slate-400 font-medium">{card.label}</span>
                  </div>
                  <p className={`text-3xl font-black ${card.color}`}>{card.value}</p>
                </div>
              ))}
            </div>

            {/* Fila 2 — Gráfica 7 días */}
            <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-5">
              <h2 className="text-sm font-semibold text-slate-300 mb-4 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-violet-400" />
                Últimos 7 días
              </h2>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={chart} margin={{ top: 4, right: 16, bottom: 0, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
                  <XAxis dataKey="date" tick={{ fill: "#64748b", fontSize: 11 }} />
                  <YAxis tick={{ fill: "#64748b", fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      background: "#1e293b",
                      border: "1px solid #334155",
                      borderRadius: 8,
                      color: "#e2e8f0",
                      fontSize: 12,
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: 12, color: "#94a3b8" }} />
                  <Line
                    type="monotone"
                    dataKey="activeUsers"
                    name="Usuarios activos"
                    stroke="#34d399"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="queries"
                    name="Queries Tutor"
                    stroke="#818cf8"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="newUsers"
                    name="Registros nuevos"
                    stroke="#f472b6"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Fila 3 — Eventos recientes */}
            <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-5">
              <h2 className="text-sm font-semibold text-slate-300 mb-4">
                Últimos registros
                <span className="ml-2 text-xs text-slate-500 font-normal">auto-refresh 30s</span>
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-slate-500 text-xs border-b border-white/5">
                      <th className="pb-2 font-medium">Usuario</th>
                      <th className="pb-2 font-medium">Acción</th>
                      <th className="pb-2 font-medium text-right">Cuándo</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {events.map((ev, i) => (
                      <tr key={i} className="text-slate-300 hover:bg-white/[0.02] transition-colors">
                        <td className="py-2.5 pr-4 max-w-[180px] truncate font-medium">{ev.user}</td>
                        <td className="py-2.5 pr-4">
                          <span className="px-2 py-0.5 rounded-full bg-violet-500/15 text-violet-300 text-xs border border-violet-500/20">
                            {ev.action}
                          </span>
                        </td>
                        <td className="py-2.5 text-right text-slate-500 text-xs">{ev.time}</td>
                      </tr>
                    ))}
                    {events.length === 0 && (
                      <tr>
                        <td colSpan={3} className="py-6 text-center text-slate-600 text-sm">
                          Sin eventos recientes
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Herramientas externas */}
            <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-5">
              <h2 className="text-sm font-semibold text-slate-300 mb-4">Herramientas externas</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    label: "Vercel Analytics",
                    icon: "📊",
                    url: "https://vercel.com/cyberedu-mx-s-projects/cyberedu-mx/analytics",
                    color: "from-blue-600 to-blue-500",
                  },
                  {
                    label: "Google Analytics",
                    icon: "📈",
                    url: "https://analytics.google.com",
                    color: "from-orange-600 to-orange-500",
                  },
                  {
                    label: "Resend Métricas",
                    icon: "📧",
                    url: "https://resend.com/metrics",
                    color: "from-violet-600 to-violet-500",
                  },
                  {
                    label: "Microsoft Clarity",
                    icon: "🎯",
                    url: "https://clarity.microsoft.com",
                    color: "from-blue-500 to-cyan-500",
                  },
                  {
                    label: "Anthropic Console",
                    icon: "🤖",
                    url: "https://console.anthropic.com/settings/usage",
                    color: "from-amber-600 to-orange-500",
                  },
                  {
                    label: "DeepSeek Platform",
                    icon: "⚡",
                    url: "https://platform.deepseek.com/usage",
                    color: "from-cyan-600 to-blue-500",
                  },
                ].map((tool) => (
                  <a
                    key={tool.label}
                    href={tool.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r ${tool.color} hover:opacity-90 transition-opacity`}
                  >
                    <span className="text-2xl">{tool.icon}</span>
                    <span className="text-white font-semibold text-sm">{tool.label} ↗</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Fila 4 — Conversión */}
            {conversion && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-5">
                  <p className="text-xs text-slate-500 mb-1">Usaron el Tutor IA</p>
                  <div className="flex items-end gap-2 mb-2">
                    <span className="text-2xl font-black text-violet-400">{conversion.tutorUsers}</span>
                    <span className="text-slate-500 text-sm mb-0.5">
                      / {conversion.totalUsers} usuarios ({pct(conversion.tutorUsers, conversion.totalUsers)})
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-violet-600 to-indigo-500 rounded-full transition-all duration-700"
                      style={{ width: pct(conversion.tutorUsers, conversion.totalUsers) }}
                    />
                  </div>
                </div>

                <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-5">
                  <p className="text-xs text-slate-500 mb-1">Compraron tokens / Premium</p>
                  <div className="flex items-end gap-2 mb-2">
                    <span className="text-2xl font-black text-amber-400">{conversion.premiumUsers}</span>
                    <span className="text-slate-500 text-sm mb-0.5">
                      / {conversion.totalUsers} usuarios ({pct(conversion.premiumUsers, conversion.totalUsers)})
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-700"
                      style={{ width: pct(conversion.premiumUsers, conversion.totalUsers) }}
                    />
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
