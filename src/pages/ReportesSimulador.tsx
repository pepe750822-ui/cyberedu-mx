import { useEffect, useState, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export default function ReportesSimulador() {
  const { user } = useAuth();
  const [historial, setHistorial] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [tutorUso, setTutorUso] = useState<any[]>([]);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  // Cargar historial del usuario logueado
  useEffect(() => {
    if (!user?.id) return;
    const cargar = async () => {
      const { data } = await supabase
        .from('simulador_resultados')
        .select('*')
        .eq('user_id', user.id)
        .eq('banco', 'infinito')
        .order('created_at', { ascending: false })
        .limit(50);
      
      setHistorial(data || []);
      
      // Calcular stats
      if (data && data.length > 0) {
        const total = data.length;
        const promedio = Math.round(
          data.reduce((s, r) => s + r.porcentaje, 0) / total
        );
        const mejor = Math.max(...data.map(r => r.porcentaje));
        const totalPreguntas = data.reduce(
          (s, r) => s + r.total_preguntas, 0
        );
        const totalTiempo = data.reduce(
          (s, r) => s + (r.tiempo_segundos || 0), 0
        );
        
        // Días únicos que estudió
        const dias = new Set(
          data.map(r => new Date(r.created_at)
            .toLocaleDateString('es-MX'))
        ).size;

        setStats({ total, promedio, mejor,
          totalPreguntas, totalTiempo, dias });
      }

      // Tutor uso
      const { data: tutor } = await supabase
        .from('tutor_uso' as any)
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      setTutorUso((tutor as any[]) || []);
    };
    cargar();
  }, [user]);

  // Agrupar tutor_uso por sesion_id
  const tutorBySesion = useMemo(() => {
    const map: Record<string, any[]> = {};
    for (const r of tutorUso) {
      if (!r.sesion_id) continue;
      if (!map[r.sesion_id]) map[r.sesion_id] = [];
      map[r.sesion_id].push(r);
    }
    return map;
  }, [tutorUso]);

  const toggleExpanded = (id: string) =>
    setExpanded(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  return (
    <div className="min-h-screen bg-[#0a0a0a] px-4 py-6">
      <h1 className="font-bebas text-3xl text-orange-500 mb-6">
        📊 MI HISTORIAL — SIMULADOR INFINITO
      </h1>

      {/* Stats generales */}
      {stats && (
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-[#12121a] border border-[#1e1e2e]
          rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-orange-400">
              {stats.total}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Simuladores hechos
            </p>
          </div>
          <div className="bg-[#12121a] border border-[#1e1e2e]
          rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-blue-400">
              {stats.dias}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Días que estudió
            </p>
          </div>
          <div className="bg-[#12121a] border border-[#1e1e2e]
          rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-green-400">
              {stats.promedio}%
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Promedio general
            </p>
          </div>
          <div className="bg-[#12121a] border border-[#1e1e2e]
          rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-purple-400">
              {stats.mejor}%
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Mejor calificación
            </p>
          </div>
          <div className="bg-[#12121a] border border-[#1e1e2e]
          rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-yellow-400">
              {stats.totalPreguntas}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Preguntas respondidas
            </p>
          </div>
          <div className="bg-[#12121a] border border-[#1e1e2e]
          rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-red-400">
              {Math.round(stats.totalTiempo / 60)} min
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Tiempo total estudiado
            </p>
          </div>
        </div>
      )}

      {/* Historial */}
      {historial.length > 0 && (
        <div className="space-y-3">
          <h2 className="font-bebas text-xl text-white">
            HISTORIAL
          </h2>
          {historial.map((r) => {
            const pct = Number(r.porcentaje);
            const colorClass = pct >= 70 ? 'text-green-400' : pct >= 50 ? 'text-orange-400' : 'text-red-400';
            const barClass   = pct >= 70 ? 'bg-green-500'  : pct >= 50 ? 'bg-orange-500'  : 'bg-red-500';
            const sesionTutor = r.sesion_id ? (tutorBySesion[r.sesion_id] ?? []) : [];
            const isExpanded  = expanded.has(r.id);
            return (
              <div key={r.id} className="bg-[#12121a] border border-[#1e1e2e] rounded-xl p-4 mb-3">
                {/* Header */}
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="text-white font-bold text-sm">
                      {new Date(r.created_at).toLocaleDateString('es-MX', {
                        weekday: 'long', day: '2-digit', month: 'short',
                        hour: '2-digit', minute: '2-digit'
                      })}
                    </p>
                    <p className="text-slate-500 text-xs mt-0.5">
                      {r.total_preguntas} preguntas · {Math.floor((r.tiempo_segundos || 0) / 60)} min
                    </p>
                  </div>
                  <div className={`font-bebas text-3xl ${colorClass}`}>
                    {Math.round(pct)}%
                  </div>
                </div>

                {/* Barra de progreso */}
                <div className="w-full bg-[#1e1e2e] rounded-full h-2 mb-3">
                  <div
                    className={`h-2 rounded-full transition-all ${barClass}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-[#0a0a0a] rounded-lg p-2">
                    <p className="text-green-400 font-bold text-lg">{r.aciertos}</p>
                    <p className="text-slate-600 text-xs">Correctas</p>
                  </div>
                  <div className="bg-[#0a0a0a] rounded-lg p-2">
                    <p className="text-red-400 font-bold text-lg">{r.errores}</p>
                    <p className="text-slate-600 text-xs">Incorrectas</p>
                  </div>
                  <div className="bg-[#0a0a0a] rounded-lg p-2">
                    <p className="text-blue-400 font-bold text-lg">{Math.floor((r.tiempo_segundos || 0) / 60)}m</p>
                    <p className="text-slate-600 text-xs">Tiempo</p>
                  </div>
                </div>

                {/* Toggle tutor */}
                {r.sesion_id && (
                  <button
                    onClick={() => toggleExpanded(r.id)}
                    className="mt-3 w-full text-left text-xs flex items-center justify-between px-3 py-2 rounded-lg bg-[#0a0a0a] border border-[#1e1e2e] hover:border-blue-500/30 transition-colors"
                  >
                    <span className="text-slate-400">
                      🤖 Tutor IA
                      {sesionTutor.length > 0
                        ? <span className="ml-1 text-blue-400 font-bold">{sesionTutor.length} consulta{sesionTutor.length !== 1 ? 's' : ''}</span>
                        : <span className="ml-1 text-slate-600">· sin uso</span>}
                    </span>
                    <span className="text-slate-600">{isExpanded ? '▲' : '▼'}</span>
                  </button>
                )}

                {/* Detalle tutor expandido */}
                {isExpanded && sesionTutor.length > 0 && (
                  <div className="mt-2 space-y-1.5 pl-1">
                    {sesionTutor.map((t: any, i: number) => (
                      <div key={i} className="flex items-start gap-2 text-xs">
                        <span className="text-blue-500 mt-0.5 shrink-0">🧠</span>
                        <p className="text-slate-400 leading-relaxed">
                          {(t.pregunta_texto || '').slice(0, 90)}{(t.pregunta_texto || '').length > 90 ? '…' : ''}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
                {isExpanded && sesionTutor.length === 0 && (
                  <p className="mt-2 text-xs text-slate-600 pl-1">No usaste el tutor en esta sesión.</p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {historial.length === 0 && (
        <p className="text-center text-slate-500 py-8">
          Aún no tienes simuladores registrados
        </p>
      )}

      {/* Uso del Tutor IA */}
      <div className="mt-8">
        <h2 className="font-bebas text-xl text-white mb-4">🤖 USO DEL TUTOR IA</h2>
        {tutorUso.length === 0 ? (
          <div className="bg-[#12121a] border border-[#1e1e2e] rounded-xl p-4 text-center">
            <span className="text-xs font-bold bg-slate-700 text-slate-300 px-2 py-1 rounded-full">
              Sin uso del tutor
            </span>
          </div>
        ) : (() => {
          // Agrupar por pregunta_id
          const grouped: Record<string, { texto: string; area: string; count: number; ultima: string }> = {};
          for (const r of tutorUso) {
            if (!grouped[r.pregunta_id]) {
              grouped[r.pregunta_id] = { texto: r.pregunta_texto || '', area: r.area || '', count: 0, ultima: r.created_at };
            }
            grouped[r.pregunta_id].count++;
            if (r.created_at > grouped[r.pregunta_id].ultima) grouped[r.pregunta_id].ultima = r.created_at;
          }
          const porArea: Record<string, typeof grouped[string][]> = {};
          for (const item of Object.values(grouped)) {
            if (!porArea[item.area]) porArea[item.area] = [];
            porArea[item.area].push(item);
          }
          return (
            <div className="space-y-4">
              <p className="text-slate-400 text-sm">
                Total de consultas al tutor: <span className="text-white font-bold">{tutorUso.length}</span>
                {' · '}preguntas únicas: <span className="text-white font-bold">{Object.keys(grouped).length}</span>
              </p>
              {Object.entries(porArea).map(([area, items]) => (
                <div key={area} className="bg-[#12121a] border border-[#1e1e2e] rounded-xl p-4">
                  <p className="text-slate-300 font-bold text-sm mb-3">{area}</p>
                  <div className="space-y-2">
                    {items.sort((a, b) => b.count - a.count).map((item, i) => {
                      const badge = item.count >= 4
                        ? <span className="text-[10px] font-black bg-orange-500/20 text-orange-400 border border-orange-500/30 px-2 py-0.5 rounded-full shrink-0">Estudió con tutor {item.count} veces</span>
                        : item.count >= 1
                        ? <span className="text-[10px] font-black bg-blue-500/20 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded-full shrink-0">Usó tutor {item.count} {item.count === 1 ? 'vez' : 'veces'}</span>
                        : null;
                      return (
                        <div key={i} className="flex items-start gap-2">
                          <p className="text-slate-400 text-xs flex-1 leading-relaxed">
                            {item.texto.slice(0, 80)}{item.texto.length > 80 ? '…' : ''}
                          </p>
                          {badge}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          );
        })()}
      </div>
    </div>
  );
}
