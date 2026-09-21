-- ============================================================
-- Catálogo de materias y unidades para el simulador de prepa
-- Fecha: 2026-09-19
-- ============================================================
--
-- ESTRATEGIA: Opción A (mínimo riesgo), con una decisión de diseño.
--
--   * Se crean las tablas de catálogo `materias` y `unidades`.
--   * `preguntas_prepa` NO SE TOCA. Sus columnas de texto `materia` y
--     `unidad` siguen siendo el vínculo, comparadas por nombre normalizado.
--     Así los 63 reactivos actuales no se modifican, no se mueven y no se
--     pueden perder.
--   * `unidades.nombre` ES el nombre del bloque que se muestra como tarjeta
--     y que debe coincidir con `preguntas_prepa.unidad`. No se renombra nada.
--   * `unidades.unidad_curricular` guarda la referencia al programa oficial
--     de la ENP. Es informativa: no afecta a la interfaz.
--
-- ¿Por qué no la Opción B (FK `unidad_id`)?
--   Requeriría reescribir las 63 filas, añadir la columna, rellenarla,
--   marcarla NOT NULL y borrar las de texto. Más pasos destructivos y sin
--   ganancia funcional hoy, porque la interfaz ya filtra por nombre
--   normalizado (ignora acentos, mayúsculas y espacios). Se puede migrar a
--   FK más adelante, cuando las 12 materias estén pobladas, sin prisa.
--
-- Este script es IDEMPOTENTE: se puede ejecutar varias veces sin duplicar.
-- ============================================================

create extension if not exists pgcrypto;

-- ─────────────────────────────────────────────────────────────
-- 1. Tabla `materias`
-- ─────────────────────────────────────────────────────────────
create table if not exists public.materias (
  id          uuid primary key default gen_random_uuid(),
  nombre      text not null unique,
  clave       text,
  icono       text,
  orden       integer not null default 0,
  activa      boolean not null default true,
  created_at  timestamptz not null default now()
);

comment on table public.materias is
  'Catálogo de materias del simulador. `nombre` debe coincidir con preguntas_prepa.materia.';

-- ─────────────────────────────────────────────────────────────
-- 2. Tabla `unidades`
-- ─────────────────────────────────────────────────────────────
create table if not exists public.unidades (
  id                uuid primary key default gen_random_uuid(),
  materia_id        uuid not null references public.materias(id) on delete cascade,
  nombre            text not null,
  orden             integer not null default 0,
  unidad_curricular text,
  created_at        timestamptz not null default now(),
  unique (materia_id, nombre)
);

comment on table public.unidades is
  'Bloques (unidades) por materia. `nombre` debe coincidir con preguntas_prepa.unidad.';

create index if not exists unidades_materia_id_idx on public.unidades (materia_id);
create index if not exists unidades_orden_idx      on public.unidades (materia_id, orden);

-- ─────────────────────────────────────────────────────────────
-- 3. Seguridad: lectura pública, escritura sólo por service_role
-- ─────────────────────────────────────────────────────────────
alter table public.materias enable row level security;
alter table public.unidades enable row level security;

drop policy if exists "materias_select_public" on public.materias;
create policy "materias_select_public"
  on public.materias for select using (true);

drop policy if exists "unidades_select_public" on public.unidades;
create policy "unidades_select_public"
  on public.unidades for select using (true);

grant select on public.materias to anon, authenticated;
grant select on public.unidades to anon, authenticated;

-- ─────────────────────────────────────────────────────────────
-- 4. Las 12 materias de 4º año
-- ─────────────────────────────────────────────────────────────
insert into public.materias (nombre, clave, icono, orden) values
  ('Matemáticas IV',                    'M4',   '📐',   1),
  ('Física III',                        'F3',   '⚛️',   2),
  ('Lengua Española',                   'LE',   '📖',   3),
  ('Historia Universal III',            'HU3',  '🏛️',   4),
  ('Lógica',                            'LOG',  '🧠',   5),
  ('Geografía',                         'GEO',  '🌎',   6),
  ('Dibujo II',                         'DIB2', '✏️',   7),
  ('Lengua Extranjera IV',              'LE4',  '🗣️',   8),
  ('Informática',                       'INF',  '💻',   9),
  ('Educación Física IV',               'EF4',  '🏃',  10),
  ('Educación Estética y Artística IV', 'EA4',  '🎨',  11),
  ('Orientación Educativa IV',          'OE4',  '🧭',  12)
on conflict (nombre) do nothing;

-- ─────────────────────────────────────────────────────────────
-- 5. Unidades de Matemáticas IV
-- ─────────────────────────────────────────────────────────────
-- Los 4 primeros nombres son EXACTAMENTE los que ya usan los 63 reactivos.
-- Si se cambian aquí, los reactivos dejan de aparecer: no renombrar.
-- Los 4 últimos son los bloques del programa oficial aún sin reactivos; se
-- crean vacíos a propósito para que sirvan de lista de pendientes.
insert into public.unidades (materia_id, nombre, orden, unidad_curricular)
select m.id, u.nombre, u.orden, u.unidad_curricular
from public.materias m
cross join (values
  ('Números Naturales',                    1, 'Unidad 1. Los números reales para contar, comparar y medir'),
  ('Números Enteros',                      2, 'Unidad 1. Los números reales para contar, comparar y medir'),
  ('Números Racionales',                   3, 'Unidad 1. Los números reales para contar, comparar y medir'),
  ('Números Reales',                       4, 'Unidad 1. Los números reales para contar, comparar y medir'),
  ('Expresiones Algebraicas',              5, 'Unidad 2. Expresiones algebraicas para describir y generalizar'),
  ('Ecuaciones de Primer y Segundo Grado', 6, 'Unidad 3. Ecuaciones de primer y segundo grado para modelar condiciones específicas en una función'),
  ('Sistemas de Ecuaciones',               7, 'Unidad 4. Sistemas de ecuaciones para modelar condiciones simultáneas'),
  ('Inecuaciones',                         8, 'Unidad 5. Inecuaciones para modelar restricciones')
) as u (nombre, orden, unidad_curricular)
where m.nombre = 'Matemáticas IV'
on conflict (materia_id, nombre) do nothing;

-- ─────────────────────────────────────────────────────────────
-- 6. VERIFICACIÓN (ejecutar por separado y revisar la salida)
-- ─────────────────────────────────────────────────────────────

-- 6.1 Deben aparecer 12 materias, con 8 unidades sólo en Matemáticas IV.
-- select m.nombre, m.icono, count(u.id) as unidades
-- from public.materias m
-- left join public.unidades u on u.materia_id = m.id
-- group by m.nombre, m.icono, m.orden
-- order by m.orden;

-- 6.2 CRÍTICO: reactivos cuyo bloque NO existe en el catálogo.
--     DEBE DEVOLVER 0 FILAS. Si devuelve algo, esos reactivos no se verán.
-- select p.materia, p.unidad, count(*) as reactivos
-- from public.preguntas_prepa p
-- left join public.materias m
--        on lower(trim(p.materia)) = lower(trim(m.nombre))
-- left join public.unidades u
--        on u.materia_id = m.id
--       and lower(trim(u.nombre)) = lower(trim(p.unidad))
-- where u.id is null
-- group by p.materia, p.unidad;

-- 6.3 Conteo por bloque del catálogo, incluyendo los que están en cero.
-- select m.nombre as materia, u.nombre as bloque, u.orden,
--        count(p.id) as reactivos
-- from public.unidades u
-- join public.materias m on m.id = u.materia_id
-- left join public.preguntas_prepa p
--        on lower(trim(p.materia)) = lower(trim(m.nombre))
--       and lower(trim(p.unidad))  = lower(trim(u.nombre))
-- group by m.nombre, m.orden, u.nombre, u.orden
-- order by m.orden, u.orden;

-- ─────────────────────────────────────────────────────────────
-- 7. ROLLBACK (sólo si hiciera falta)
-- ─────────────────────────────────────────────────────────────
-- drop table if exists public.unidades;
-- drop table if exists public.materias;
-- preguntas_prepa queda intacta: este script nunca la modifica.
