/**
 * Lectura del catálogo de materias y unidades.
 *
 * Se consulta con `fetch` directo a PostgREST en lugar del cliente tipado
 * porque `materias` y `unidades` todavía no están en los tipos generados de
 * Supabase (`src/integrations/supabase/types.ts`), y añadirlos a mano se
 * perdería en la siguiente regeneración.
 *
 * IMPORTANTE: es tolerante a fallos a propósito. El frontend se despliega
 * automáticamente al hacer push, mientras que el SQL de migración se ejecuta
 * a mano; si las tablas todavía no existen (HTTP 404) o la red falla, se
 * devuelve un catálogo vacío y el simulador sigue funcionando con lo que
 * deduce de los propios reactivos.
 */

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export interface MateriaCatalogo {
  nombre: string;
  icono: string | null;
  orden: number;
}

export interface UnidadCatalogo {
  materia: string;
  nombre: string;
  orden: number;
}

export interface Catalogo {
  materias: MateriaCatalogo[];
  unidades: UnidadCatalogo[];
}

/** GET a PostgREST. Devuelve [] ante cualquier problema, incluido un 404. */
async function consultar<T>(ruta: string): Promise<T[]> {
  if (!SUPABASE_URL || !SUPABASE_KEY) return [];
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${ruta}`, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
    });
    if (!res.ok) return [];
    const data: unknown = await res.json();
    return Array.isArray(data) ? (data as T[]) : [];
  } catch {
    return [];
  }
}

/** Carga el catálogo completo. Nunca lanza: devuelve vacíos si no está listo. */
export async function cargarCatalogo(): Promise<Catalogo> {
  const [materias, unidadesCrudas] = await Promise.all([
    consultar<MateriaCatalogo>("materias?select=nombre,icono,orden&activa=is.true&order=orden"),
    consultar<{ nombre: string; orden: number; materias: { nombre: string } | null }>(
      "unidades?select=nombre,orden,materias(nombre)&order=orden",
    ),
  ]);

  const unidades: UnidadCatalogo[] = unidadesCrudas
    .map((u) => ({
      materia: u.materias?.nombre ?? "",
      nombre: u.nombre,
      orden: u.orden,
    }))
    .filter((u) => Boolean(u.materia && u.nombre));

  return { materias, unidades };
}
