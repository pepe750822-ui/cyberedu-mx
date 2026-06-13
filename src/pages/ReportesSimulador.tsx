import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export default function ReportesSimulador() {
  const { user } = useAuth();
  const [historial, setHistorial] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);

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
    };
    cargar();
  }, [user]);

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
    </div>
  );
}
