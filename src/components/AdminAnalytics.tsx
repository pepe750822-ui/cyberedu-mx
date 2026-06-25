import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { useChatAnalytics } from '@/hooks/useChatAnalytics';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Download, BarChart, Clock, MessageSquare, Zap,
  CheckCircle2, XCircle, AlertTriangle, RefreshCw,
  Key, ExternalLink, TrendingUp, Activity, AlertCircle, Database, Trash2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from "sonner";
import { Mail, Loader2 } from "lucide-react";

// ─── Types ───────────────────────────────────────────────────
interface ApiStatus {
  status: 'ok' | 'warning' | 'error' | 'loading' | null;
  message: string;
  hasKey: boolean;
  keyPrefix: string | null;
  lastChecked: string | null;
  model?: string;
  modelAvailable?: boolean;
  anthropicStatus?: {
    rateLimitRemaining?: number | null;
    rateLimitTokensRemaining?: number | null;
    rateLimitReset?: string | null;
    availableModels?: string[];
    httpStatus?: number;
  };
}

const STATUS_URL = 'https://cyberedu-mx.vercel.app/api/admin/status';
const HEALTH_URL = 'https://cyberedu-mx.vercel.app/api/health';
const REFRESH_INTERVAL_MS = 5 * 60 * 1000; // 5 minutos

// ─── API Status Banner ────────────────────────────────────────
function ApiStatusBanner({ status, health, onRefresh, loading }: {
  status: ApiStatus;
  health: { redis: string; anthropic: string; supabase: string } | null;
  onRefresh: () => void;
  loading: boolean;
}) {
  const bgColor = {
    ok: 'bg-emerald-950/60 border-emerald-500/30',
    warning: 'bg-amber-950/60 border-amber-500/30',
    error: 'bg-red-950/60 border-red-500/30',
    loading: 'bg-slate-900/60 border-white/10',
    null: 'bg-slate-900/60 border-white/10',
  }[status.status ?? 'null'];

  const icon = {
    ok: <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />,
    warning: <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0 animate-pulse" />,
    error: <XCircle className="h-5 w-5 text-red-400 shrink-0" />,
    loading: <RefreshCw className="h-5 w-5 text-slate-400 animate-spin shrink-0" />,
    null: <Activity className="h-5 w-5 text-slate-400 shrink-0" />,
  }[status.status ?? 'null'];

  const textColor = {
    ok: 'text-emerald-300',
    warning: 'text-amber-300',
    error: 'text-red-300',
    loading: 'text-slate-400',
    null: 'text-slate-400',
  }[status.status ?? 'null'];

  const timeSince = (iso: string | null) => {
    if (!iso) return 'nunca';
    const diff = Math.round((Date.now() - new Date(iso).getTime()) / 1000);
    if (diff < 60) return `hace ${diff}s`;
    if (diff < 3600) return `hace ${Math.round(diff / 60)}min`;
    return `hace ${Math.round(diff / 3600)}h`;
  };

  const getHealthIcon = (s?: string) => {
    if (s === 'ok') return <CheckCircle2 className="h-3 w-3 text-emerald-400" />;
    if (s === 'not_configured' || s === 'warning') return <AlertTriangle className="h-3 w-3 text-amber-400" />;
    return <XCircle className="h-3 w-3 text-red-400" />;
  };

  return (
    <div className={cn('border rounded-2xl p-5 backdrop-blur-md', bgColor)}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Left: status */}
        <div className="flex items-start gap-3 flex-1">
          <div className="mt-0.5">{icon}</div>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={cn('font-black text-sm uppercase tracking-widest', textColor)}>
                Monitor de Salud Global
              </span>
              {status.model && (
                <span className="px-2 py-0.5 rounded-full border border-white/10 text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-white/5">
                  {status.model}
                </span>
              )}
            </div>
            
            <p className="text-sm mt-1 text-white/80 font-medium">{status.message || 'Verificando...'}</p>

            <div className="flex flex-wrap gap-x-5 gap-y-2 mt-3 p-3 rounded-xl bg-black/20 border border-white/5">
                <div className="flex items-center gap-2">
                    {getHealthIcon(health?.anthropic)}
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Anthropic</span>
                </div>
                <div className="flex items-center gap-2">
                    {getHealthIcon(health?.redis)}
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Redis (Upstash)</span>
                </div>
                <div className="flex items-center gap-2">
                    {getHealthIcon(health?.supabase)}
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Supabase</span>
                </div>
            </div>

            <div className="flex flex-wrap gap-3 mt-3">
              {status.keyPrefix && (
                <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-slate-500 bg-white/5 px-2 py-0.5 rounded">
                  <Key className="h-3 w-3" /> {status.keyPrefix}
                </span>
              )}
              {status.lastChecked && (
                <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-slate-600">
                  <Clock className="h-3 w-3" /> {timeSince(status.lastChecked)}
                </span>
              )}
              {status.anthropicStatus?.rateLimitRemaining != null && (
                <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-amber-500/80 bg-amber-500/5 px-2 py-0.5 rounded border border-amber-500/10">
                  <Zap className="h-3 w-3 text-amber-400" />
                  {status.anthropicStatus.rateLimitRemaining} reqs
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right: actions */}
        <div className="flex flex-row md:flex-col items-center md:items-end gap-2 shrink-0">
          <Button
            size="sm"
            variant="outline"
            onClick={onRefresh}
            disabled={loading}
            className="border-white/10 text-white/70 hover:text-white hover:bg-white/10 text-xs gap-1 w-full justify-start md:justify-center"
          >
            <RefreshCw className={cn('h-3 w-3', loading && 'animate-spin')} />
            Actualizar Todo
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => window.open('https://console.anthropic.com/settings/billing', '_blank')}
            className="border-white/10 text-white/70 hover:text-white hover:bg-white/10 text-xs gap-1 w-full justify-start md:justify-center"
          >
            <ExternalLink className="h-3 w-3" />
            Billing Console
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────
export default function AdminAnalytics() {
  const { metrics, errors, aggregateMetrics, exportToCSV } = useChatAnalytics();
  const stats = useMemo(() => aggregateMetrics(), [metrics, aggregateMetrics]);

  const [apiStatus, setApiStatus] = useState<ApiStatus>({
    status: null,
    message: 'Sin verificar',
    hasKey: false,
    keyPrefix: null,
    lastChecked: null,
  });
  const [apiLoading, setApiLoading] = useState(false);
  
  // Cost alert state
  const ALERTS_URL = 'https://cyberedu-mx.vercel.app/api/admin/alerts';
  const [costAlert, setCostAlert] = useState<{
    current_cost: number;
    limit: number;
    is_above_limit: boolean;
    is_approaching: boolean;
    alert_sent: boolean;
  } | null>(null);

  // Cache management state
  const CACHE_URL = 'https://cyberedu-mx.vercel.app/api/admin/cache';
  const [cacheInfo, setCacheInfo] = useState<{ count: number; keys: { key: string; preview: string }[]; upstashConfigured?: boolean; usingMemoryCache?: boolean } | null>(null);
  const [cacheLoading, setCacheLoading] = useState(false);
  const [clearingCache, setClearingCache] = useState(false);

  const fetchCache = useCallback(async () => {
    setCacheLoading(true);
    try {
      const res = await fetch(CACHE_URL);
      const data = await res.json();
      setCacheInfo(data);
    } catch { } finally { setCacheLoading(false); }
  }, [CACHE_URL]);

  const [testingAlert, setTestingAlert] = useState(false);
  const onTestAlert = async () => {
    setTestingAlert(true);
    try {
      const res = await fetch(ALERTS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ test: true })
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(`✅ ${data.msg}`);
      } else {
        toast.error(`❌ Error: ${data.msg || 'No se pudo enviar la alerta'}`);
      }
    } catch (err: any) {
      toast.error(`❌ Error: ${err.message}`);
    } finally {
      setTestingAlert(false);
    }
  };

  const clearCache = useCallback(async () => {
    setClearingCache(true);
    try {
      await fetch(CACHE_URL, { method: 'DELETE' });
      await fetchCache();
    } catch { } finally { setClearingCache(false); }
  }, [CACHE_URL, fetchCache]);

  useEffect(() => { fetchCache(); }, [fetchCache]);

  // Métricas de hoy
  const today = new Date().toISOString().split('T')[0];
  const todayMetrics = metrics.filter(m => m.timestamp.startsWith(today));
  const todayCost = todayMetrics.reduce((s, m) => s + m.cost, 0);
  const todayTokens = {
    input: todayMetrics.reduce((s, m) => s + m.tokensInput, 0),
    output: todayMetrics.reduce((s, m) => s + m.tokensOutput, 0),
    cached: todayMetrics.reduce((s, m) => s + m.tokensCached, 0),
  };

  const cachedMetrics = metrics.filter(m => m.cacheType != null);
  const simpleCacheHits = cachedMetrics.filter(m => m.cacheType === 'simple').length;
  const complexCacheHits = cachedMetrics.filter(m => m.cacheType === 'complex').length;
  const nonCachedMetrics = metrics.filter(m => !m.cacheType);
  const avgCostNonCached = nonCachedMetrics.length > 0 ? nonCachedMetrics.reduce((s, m) => s + m.cost, 0) / nonCachedMetrics.length : 0.01;
  const estimatedSavings = cachedMetrics.length * avgCostNonCached;

  const [healthStatus, setHealthStatus] = useState<{ redis: string; anthropic: string; supabase: string } | null>(null);

  const fetchStatus = useCallback(async () => {
    setApiLoading(true);
    try {
      const [statusRes, healthRes] = await Promise.all([
        fetch(STATUS_URL),
        fetch(HEALTH_URL)
      ]);
      
      const statusData = await statusRes.json();
      const healthData = await healthRes.json();
      
      setApiStatus({ ...statusData });
      setHealthStatus(healthData.results);
    } catch (err: any) {
      setApiStatus({
        status: 'error',
        message: `No se pudo contactar el endpoint de estado: ${err.message}`,
        hasKey: false,
        keyPrefix: null,
        lastChecked: new Date().toISOString(),
      });
    } finally {
      setApiLoading(false);
    }
  }, []);

  const fetchAlerts = useCallback(async () => {
    try {
      const res = await fetch(ALERTS_URL);
      const data = await res.json();
      setCostAlert(data);
    } catch (e) { console.error('Error fetching cost alerts:', e); }
  }, [ALERTS_URL]);

  // Verificar al montar (sin polling para reducir edge requests)
  useEffect(() => {
    fetchStatus();
    fetchAlerts();
  }, [fetchStatus, fetchAlerts]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black text-white flex items-center gap-3">
              <BarChart className="h-8 w-8 text-primary" />
              Panel de Administración
            </h1>
            <p className="text-sm text-slate-400 mt-1">Monitoreo de costos, estado de API y analíticas del chat</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button 
                variant="outline" 
                onClick={onTestAlert} 
                disabled={testingAlert}
                className="flex items-center gap-2 border-primary/30 hover:bg-primary/5 hover:border-primary/50 text-slate-300"
            >
              {testingAlert ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4 text-primary" />}
              Probar alerta
            </Button>
            <Button onClick={() => { fetchStatus(); fetchAlerts(); }} variant="outline" className="flex items-center gap-2 border-emerald-500/30 hover:bg-emerald-500/10 text-emerald-400">
              <RefreshCw className="h-4 w-4" /> Refrescar
            </Button>
            <Button onClick={exportToCSV} className="flex items-center gap-2 shrink-0">
              <Download className="h-4 w-4" /> Exportar CSV
            </Button>
          </div>
        </div>

        {/* API Status Banner */}
        <ApiStatusBanner
          status={apiStatus}
          health={healthStatus}
          onRefresh={fetchStatus}
          loading={apiLoading}
        />

        {/* Cost Alert Banner */}
        {costAlert && (costAlert.is_approaching || costAlert.is_above_limit) && (
          <div className={cn(
            "p-4 rounded-2xl border flex items-center gap-3 animate-in fade-in slide-in-from-top-2",
            costAlert.is_above_limit ? "bg-red-950/60 border-red-500/50" : "bg-amber-950/60 border-amber-500/50"
          )}>
            <AlertTriangle className={cn("h-6 w-6 shrink-0", costAlert.is_above_limit ? "text-red-400" : "text-amber-400")} />
            <div className="flex-1">
              <p className={cn("text-sm font-black uppercase tracking-widest", costAlert.is_above_limit ? "text-red-400" : "text-amber-400")}>
                {costAlert.is_above_limit ? 'Límite de costo excedido' : 'Límite de costo acercándose'}
              </p>
              <p className="text-sm text-white/90">
                El costo diario actual es de <strong>${costAlert.current_cost.toFixed(2)} USD</strong>. 
                El límite configurado es de <strong>${costAlert.limit.toFixed(2)} USD</strong>.
              </p>
            </div>
            {costAlert.alert_sent && (
              <span className="px-2 py-1 rounded-full bg-white/10 text-[10px] font-bold text-white/60 uppercase tracking-widest border border-white/10">
                Email enviado
              </span>
            )}
          </div>
        )}

        {/* Stats de hoy */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              label: 'Consultas hoy',
              value: todayMetrics.length,
              icon: <MessageSquare className="h-5 w-5 text-blue-400" />,
              color: 'text-white',
            },
            {
              label: 'Costo hoy',
              value: `$${todayCost.toFixed(4)} USD`,
              icon: <TrendingUp className="h-5 w-5 text-emerald-400" />,
              color: 'text-emerald-400',
            },
            {
              label: 'Tokens cacheados hoy',
              value: todayTokens.cached.toLocaleString(),
              icon: <Zap className="h-5 w-5 text-amber-400" />,
              color: 'text-amber-400',
            },
            {
              label: 'Costo total acumulado',
              value: `$${stats.totalCost.toFixed(4)} USD`,
              icon: <Activity className="h-5 w-5 text-purple-400" />,
              color: 'text-purple-400',
            },
          ].map(({ label, value, icon, color }) => (
            <Card key={label} className="bg-white/5 border-white/10 text-white">
              <CardHeader className="pb-1 pt-4 px-4">
                <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  {icon} {label}
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <div className={cn('text-2xl font-black', color)}>{value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats generales */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Card className="bg-white/5 border-white/10 text-white">
            <CardHeader className="pb-1 pt-4 px-4">
              <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total consultas (todo)</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="text-2xl font-black">{stats.totalQueries}</div>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10 text-white">
            <CardHeader className="pb-1 pt-4 px-4">
              <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                <Clock className="h-3 w-3" /> Tiempo prom. respuesta
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="text-2xl font-black text-amber-400">{(stats.avgResponseTime / 1000).toFixed(2)}s</div>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10 text-white">
            <CardHeader className="pb-1 pt-4 px-4">
              <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-widest">Temas únicos</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="text-2xl font-black text-blue-400">{Object.keys(stats.topicsFrequency).length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Temas + Historial */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Temas populares */}
          <Card className="bg-white/5 border-white/10 text-white">
            <CardHeader>
              <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-300">Temas más populares</CardTitle>
            </CardHeader>
            <CardContent>
              {Object.keys(stats.topicsFrequency).length === 0 ? (
                <p className="text-sm text-slate-500 italic">Sin datos aún</p>
              ) : (
                <div className="space-y-3">
                  {Object.entries(stats.topicsFrequency)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 10)
                    .map(([topic, count]) => (
                      <div key={topic} className="flex items-center gap-3">
                        <div className="w-28 truncate text-xs font-medium text-slate-300">{topic}</div>
                        <div className="flex-1 bg-white/10 rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(100, (count / stats.totalQueries) * 100)}%` }}
                          />
                        </div>
                        <div className="w-10 text-right text-xs text-slate-500 font-bold">{count}</div>
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Historial reciente */}
          <Card className="bg-white/5 border-white/10 text-white">
            <CardHeader>
              <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-300">Historial reciente</CardTitle>
            </CardHeader>
            <CardContent>
              {metrics.length === 0 ? (
                <p className="text-sm text-slate-500 italic">Sin consultas registradas aún. Inicia el chat para empezar a ver datos.</p>
              ) : (
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                  {[...metrics].reverse().slice(0, 20).map(m => (
                    <div key={m.id} className="text-sm border-b border-white/5 pb-2">
                      <div className="flex justify-between text-xs text-slate-500 mb-1">
                        <span>{new Date(m.timestamp).toLocaleString('es-MX')}</span>
                        <span className="flex items-center gap-1">
                          <Zap className="h-3 w-3" /> {(m.responseTime / 1000).toFixed(1)}s
                        </span>
                      </div>
                      <div className="font-medium text-slate-200 truncate">"{m.question}"</div>
                      <div className="flex gap-2 mt-1 flex-wrap">
                        <span className="text-[10px] bg-white/5 border border-white/10 px-1.5 py-0.5 rounded text-slate-400">{m.questionTopic}</span>
                        <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded">
                          ${m.cost.toFixed(5)} USD
                        </span>
                        {m.hasChart && <span className="text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-1.5 py-0.5 rounded">📊 gráfica</span>}
                        {m.hasMermaid && <span className="text-[10px] bg-purple-500/10 text-purple-400 border border-purple-500/20 px-1.5 py-0.5 rounded">🔀 mermaid</span>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Errores recientes */}
        {errors.length > 0 && (
          <Card className="bg-red-950/30 border-red-500/20 text-white">
            <CardHeader>
              <CardTitle className="text-sm font-black uppercase tracking-widest text-red-300 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" /> Errores recientes del chat
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-[200px] overflow-y-auto">
                {errors.slice(0, 20).map(e => (
                  <div key={e.id} className="flex items-start gap-3 text-xs border-b border-red-500/10 pb-2">
                    <span className="text-red-400 shrink-0">{new Date(e.timestamp).toLocaleString('es-MX')}</span>
                    {e.statusCode && (
                      <span className="bg-red-500/20 text-red-300 px-1.5 py-0.5 rounded font-bold shrink-0">
                        {e.statusCode}
                      </span>
                    )}
                    <span className="text-red-200/80">{e.message}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Cache Manager */}
        <Card className="bg-cyan-950/30 border-cyan-500/20 text-white">
          <CardHeader>
            <CardTitle className="text-sm font-black uppercase tracking-widest text-cyan-300 flex items-center justify-between gap-2 flex-wrap">
              <span className="flex items-center gap-2"><Database className="h-4 w-4" /> Caché de Respuestas</span>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" onClick={fetchCache} disabled={cacheLoading}
                  className="border-white/10 text-white/60 hover:text-white hover:bg-white/10 text-xs gap-1">
                  <RefreshCw className={cn('h-3 w-3', cacheLoading && 'animate-spin')} /> Actualizar
                </Button>
                <Button size="sm" variant="outline" onClick={clearCache}
                  disabled={clearingCache || !cacheInfo || cacheInfo.count === 0}
                  className="border-red-500/20 text-red-300 hover:text-red-200 hover:bg-red-500/10 text-xs gap-1">
                  <Trash2 className="h-3 w-3" /> Limpiar todo
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!cacheInfo ? (
              <p className="text-sm text-slate-500 italic">Cargando info de caché...</p>
            ) : cacheInfo.usingMemoryCache ? (
              <div className="space-y-2">
                <p className="text-xs text-amber-300 bg-amber-500/10 border border-amber-500/20 rounded-xl p-3">
                  ⚠️ <strong>Upstash Redis no configurado.</strong> La caché funciona en memoria (se resetea en cada deploy). Para activar caché persistente, conecta una integración de Redis en{' '}
                  <a href="https://vercel.com/dashboard/integrations" target="_blank" rel="noopener noreferrer" className="underline text-amber-200">Vercel Integrations</a>.
                </p>
                <p className="text-xs text-slate-400">Variables requeridas: <code className="text-cyan-300">KV_REST_API_URL</code> y <code className="text-cyan-300">KV_REST_API_TOKEN</code></p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4">
                  <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                      <span className="text-cyan-400">📦</span> Simple cache
                    </div>
                    <div className="text-xl font-black text-cyan-50">
                      {simpleCacheHits} <span className="text-sm font-medium text-slate-500">hits</span>
                    </div>
                  </div>
                  <div className="bg-fuchsia-950/20 border border-fuchsia-500/20 rounded-xl p-3">
                    <div className="flex items-center gap-1.5 text-xs text-fuchsia-400/80 mb-1">
                      <span>🧠</span> Complex cache
                    </div>
                    <div className="text-xl font-black text-fuchsia-100">
                      {complexCacheHits} <span className="text-sm font-medium text-fuchsia-500/50">hits</span>
                    </div>
                  </div>
                  <div className="bg-emerald-950/20 border border-emerald-500/20 rounded-xl p-3">
                    <div className="flex items-center gap-1.5 text-xs text-emerald-400/80 mb-1">
                      <span>💰</span> Ahorro est.
                    </div>
                    <div className="text-xl font-black text-emerald-100">
                      ${estimatedSavings.toFixed(4)} <span className="text-sm font-medium text-emerald-500/50">USD</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-slate-300 mt-2 border-t border-white/5 pt-3">
                  <p>
                    <strong className="text-cyan-300 text-lg mr-1">{cacheInfo.count}</strong>
                    {cacheInfo.count === 1 ? 'llave activa en DB' : 'llaves activas en DB'}
                  </p>
                  <span className="text-slate-500 text-xs font-medium">TTL: 24h - 7d</span>
                </div>
                {cacheInfo.keys.length > 0 && (
                  <div className="space-y-2 max-h-[160px] overflow-y-auto">
                    {cacheInfo.keys.map((entry, i) => (
                      <div key={i} className="text-xs border-b border-cyan-500/10 pb-2">
                        <div className="font-bold text-cyan-200 truncate">"{entry.key}"</div>
                        <div className="text-slate-500 mt-0.5 line-clamp-2">{entry.preview}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tip de costos */}
        <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 text-sm text-slate-400">
          <p className="font-bold text-primary mb-1">💡 Referencia de precios Haiku 4.5</p>
          <p>Input: $0.80/M tokens · Output: $4.00/M tokens · Cache read: $0.08/M tokens</p>
          <p className="mt-1">El prompt caching reduce hasta un <strong className="text-white">90%</strong> el costo por tokens de entrada. Para ver tu saldo real ve a{' '}
            <a href="https://console.anthropic.com/settings/billing" target="_blank" rel="noopener noreferrer" className="text-primary underline">
              console.anthropic.com
            </a>.
          </p>
        </div>
      </div>
    </div>
  );
}
