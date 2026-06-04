-- Tabla de testimonios de usuarios
-- Ejecutar manualmente en Supabase SQL Editor

CREATE TABLE IF NOT EXISTS testimonios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  texto TEXT NOT NULL,
  nombre TEXT,
  simuladores_completados INTEGER,
  total_preguntas INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  aprobado BOOLEAN DEFAULT false
);

ALTER TABLE testimonios ENABLE ROW LEVEL SECURITY;

CREATE POLICY "usuario_crea_testimonio"
ON testimonios FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "todos_ven_testimonios_aprobados"
ON testimonios FOR SELECT
USING (aprobado = true OR auth.uid() = user_id);
