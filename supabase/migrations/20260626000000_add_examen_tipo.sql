-- Add examen_tipo column to simulador_results for EXANI-I support
ALTER TABLE simulador_results ADD COLUMN IF NOT EXISTS examen_tipo text DEFAULT 'ecoems';

-- Add examen_tipo column to daily_usage for separate EXANI-I tracking
ALTER TABLE daily_usage ADD COLUMN IF NOT EXISTS examen_tipo text DEFAULT 'ecoems';

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_simulador_results_examen_tipo ON simulador_results(examen_tipo);
CREATE INDEX IF NOT EXISTS idx_daily_usage_examen_tipo ON daily_usage(examen_tipo);
