-- Fase 1 Analytics — CyberEdu MX
-- Ejecutar en Supabase SQL Editor antes del deploy

CREATE TABLE IF NOT EXISTS simulador_resultados (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  banco TEXT NOT NULL,
  total_preguntas INTEGER NOT NULL,
  aciertos INTEGER NOT NULL,
  errores INTEGER NOT NULL,
  tiempo_segundos INTEGER,
  materia TEXT,
  porcentaje NUMERIC(5,2) GENERATED ALWAYS AS
    (ROUND((aciertos::NUMERIC / total_preguntas) * 100, 2)) STORED
);

CREATE INDEX IF NOT EXISTS idx_simulador_resultados_user
  ON simulador_resultados(user_id);
CREATE INDEX IF NOT EXISTS idx_simulador_resultados_fecha
  ON simulador_resultados(created_at);

-- Tabla de eventos internos
CREATE TABLE IF NOT EXISTS eventos_plataforma (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  evento TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'
);

CREATE INDEX IF NOT EXISTS idx_eventos_user
  ON eventos_plataforma(user_id);
CREATE INDEX IF NOT EXISTS idx_eventos_tipo
  ON eventos_plataforma(evento);
