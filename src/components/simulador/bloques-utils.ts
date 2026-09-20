/**
 * Tipos y utilidades del simulador por bloques.
 *
 * Se mantienen fuera de `Bloques.tsx` para que ese archivo sólo exporte
 * componentes y el Fast Refresh de Vite siga funcionando bien.
 */

export interface Bloque {
  /** Identificador que se devuelve en onAbrir (la unidad o la materia). */
  nombre: string;
  /** Texto visible en la tarjeta. Si se omite se usa `nombre`. */
  etiqueta?: string;
  cantidad: number;
  /** Emoji explícito; si se omite se deduce del nombre. */
  icono?: string;
  /** Resalta la tarjeta (se usa para "Todos los temas"). */
  destacado?: boolean;
}

/** Quita acentos, guiones y espacios sobrantes para comparar nombres. */
export function normalizarNombre(valor: string): string {
  return valor
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

/** Emoji de un bloque a partir de su nombre, con respaldo genérico. */
export function iconoDeBloque(nombre: string): string {
  const n = normalizarNombre(nombre);
  if (n.includes("natural")) return "🔢";
  if (n.includes("entero")) return "➖";
  if (n.includes("racional")) return "½";
  if (n.includes("irracional")) return "π";
  if (n.includes("real")) return "∞";
  return "📘";
}

/** Emoji de una materia a partir de su nombre, con respaldo genérico. */
export function iconoDeMateria(nombre: string): string {
  const n = normalizarNombre(nombre);
  if (n.includes("matematic")) return "📐";
  if (n.includes("fisic")) return "⚛️";
  if (n.includes("quimic")) return "🧪";
  if (n.includes("biolog")) return "🧬";
  return "📚";
}
