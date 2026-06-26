import { supabase } from '@/integrations/supabase/client';

export type EventoPlataforma =
  | 'simulador_iniciado'
  | 'simulador_completado'
  | 'pregunta_respondida'
  | 'banco_completado'
  | 'tutor_abierto'
  | 'tutor_consulta'
  | 'registro_completado'
  | 'login_realizado'
  | 'compra_iniciada'
  | 'compra_completada'
  | 'token_comprado'
  | 'video_visto'
  | 'resultado_compartido'
  | 'testimonio_enviado'
  | 'nps_respondido';

interface TrackOptions {
  metadata?: Record<string, unknown>;
  userId?: string;
}

const trackGA4 = (evento: string, params?: Record<string, unknown>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', evento, params ?? {});
  }
};

const trackClarity = (evento: string) => {
  if (typeof window !== 'undefined' && window.clarity) {
    window.clarity('event', evento);
  }
};

const trackInternal = async (
  evento: EventoPlataforma,
  userId?: string,
  metadata?: Record<string, unknown>
) => {
  try {
    await supabase.from('eventos_plataforma').insert({
      user_id: userId ?? null,
      evento,
      metadata: metadata ?? {},
    });
  } catch (e) {
    console.warn('Track error:', e);
  }
};

export const useTracking = () => {
  const track = async (
    evento: EventoPlataforma,
    options: TrackOptions = {}
  ) => {
    const { metadata, userId } = options;
    trackGA4(evento, metadata);
    trackClarity(evento);
    await trackInternal(evento, userId, metadata);
  };

  return { track };
};

export const guardarResultadoSimulador = async (data: {
  userId: string;
  banco: string;
  totalPreguntas: number;
  aciertos: number;
  errores: number;
  tiempoSegundos?: number;
  materia?: string;
  sesionId?: string;
  examenTipo?: string;
}) => {
  const { error } = await supabase.from('simulador_resultados').insert({
    user_id: data.userId,
    banco: data.banco,
    total_preguntas: data.totalPreguntas,
    aciertos: data.aciertos,
    errores: data.errores,
    tiempo_segundos: data.tiempoSegundos ?? null,
    materia: data.materia ?? null,
    sesion_id: data.sesionId ?? null,
    examen_tipo: data.examenTipo ?? 'ecoems',
  });
  if (error) console.warn('Error guardando resultado:', error);
};
