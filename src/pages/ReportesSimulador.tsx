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
          {historial.map((r, i) => (
            <div key={r.id}
              className="bg-[#12121a] border border-[#1e1e2e]
              rounded-xl p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-white font-bold">
                    {new Date(r.created_at).toLocaleDateString(
                      'es-MX', { 
                        weekday: 'short',
                        day: '2-digit', 
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      }
                    )}
                  </p>
                  <p className="text-slate-400 text-sm mt-1">
                    {r.total_preguntas} preguntas · {' '}
                    {Math.floor((r.tiempo_segundos||0)/60)} min
                  </p>
                </div>
                <div className="text-right">
                  <p className={`font-bebas text-2xl ${
                    r.porcentaje >= 70 ? 'text-green-400' :
                    r.porcentaje >= 50 ? 'text-orange-400' :
                    'text-red-400'
                  }`}>
                    {r.porcentaje}%
                  </p>
                  <p className="text-xs text-slate-500">
                    {r.respuestas_correctas}/{r.total_preguntas}
                  </p>
                </div>
              </div>
            </div>
          ))}
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
