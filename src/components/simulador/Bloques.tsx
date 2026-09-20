import type { ReactNode } from "react";
import { iconoDeBloque, type Bloque } from "./bloques-utils";

/**
 * Componentes de presentación del simulador: menú de bloques (tarjetas),
 * tarjeta individual y navegación entre reactivos.
 *
 * Son puramente visuales: no leen Supabase ni guardan estado propio, para que
 * el contenedor (SimuladorPrepa) siga siendo el único dueño de la lógica.
 */

// ─────────────────────────────────────────────────────────────
// TarjetaBloque
// ─────────────────────────────────────────────────────────────

interface TarjetaBloqueProps {
  bloque: Bloque;
  textoBoton?: string;
  onAbrir: (nombre: string) => void;
}

export function TarjetaBloque({ bloque, textoBoton = "Abrir módulo", onAbrir }: TarjetaBloqueProps) {
  const icono = bloque.icono ?? iconoDeBloque(bloque.nombre);

  const marco = bloque.destacado
    ? "border-emerald-500/40 bg-emerald-600/5 hover:border-emerald-400"
    : "border-slate-700 bg-slate-900 hover:border-violet-500/60";

  const boton = bloque.destacado
    ? "bg-emerald-600 hover:bg-emerald-500"
    : "bg-violet-600 hover:bg-violet-500";

  return (
    <div className={`flex flex-col rounded-2xl border p-5 transition-colors duration-200 ${marco}`}>
      <div className="text-3xl mb-3" aria-hidden="true">
        {icono}
      </div>

      <h3 className="text-white font-semibold text-base leading-snug mb-1">
        {bloque.etiqueta ?? bloque.nombre}
      </h3>

      <p className="text-slate-400 text-xs mb-5">
        {bloque.cantidad} {bloque.cantidad === 1 ? "reactivo" : "reactivos"}
      </p>

      <button
        type="button"
        onClick={() => onAbrir(bloque.nombre)}
        className={`mt-auto w-full text-white font-semibold text-sm py-2.5 rounded-xl active:scale-[0.98] transition-all duration-200 ${boton}`}
      >
        {textoBoton}
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// MenuBloques
// ─────────────────────────────────────────────────────────────

interface MenuBloquesProps {
  titulo: string;
  subtitulo: string;
  icono: ReactNode;
  pregunta: string;
  bloques: Bloque[];
  textoBoton?: string;
  textoVacio?: string;
  onAbrir: (nombre: string) => void;
  /** Si se pasa, se muestra el botón de regreso arriba. */
  onRegresar?: () => void;
  textoRegresar?: string;
}

export function MenuBloques({
  titulo,
  subtitulo,
  icono,
  pregunta,
  bloques,
  textoBoton = "Abrir módulo",
  textoVacio = "Todavía no hay bloques disponibles.",
  onAbrir,
  onRegresar,
  textoRegresar = "Regresar",
}: MenuBloquesProps) {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {onRegresar && (
          <button
            type="button"
            onClick={onRegresar}
            className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-xl border border-slate-700 bg-slate-900 hover:bg-slate-800 hover:border-slate-500 text-slate-300 text-sm font-medium active:scale-[0.98] transition-all duration-200"
          >
            <span aria-hidden="true">←</span> {textoRegresar}
          </button>
        )}

        <header className="mb-8">
          <div className="text-4xl mb-2" aria-hidden="true">
            {icono}
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">{titulo}</h1>
          <p className="text-slate-400 text-sm">{subtitulo}</p>
        </header>

        <p className="text-slate-300 text-sm font-medium mb-4">{pregunta}</p>

        {bloques.length === 0 ? (
          <p className="text-slate-400 text-sm">{textoVacio}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {bloques.map((bloque) => (
              <TarjetaBloque
                key={bloque.nombre}
                bloque={bloque}
                textoBoton={textoBoton}
                onAbrir={onAbrir}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// NavegacionReactivo
// ─────────────────────────────────────────────────────────────

interface NavegacionReactivoProps {
  indice: number;
  total: number;
  onAnterior: () => void;
  onSiguiente: () => void;
}

export function NavegacionReactivo({
  indice,
  total,
  onAnterior,
  onSiguiente,
}: NavegacionReactivoProps) {
  const enPrimero = indice <= 0;
  const enUltimo = indice >= total - 1;

  const base =
    "px-4 py-2 rounded-xl border text-sm font-medium active:scale-[0.98] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100";

  return (
    <div className="flex items-center justify-between gap-3">
      <button
        type="button"
        onClick={onAnterior}
        disabled={enPrimero}
        className={`${base} border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300`}
      >
        <span aria-hidden="true">←</span> Anterior
      </button>

      <span className="text-slate-400 text-xs font-medium tabular-nums shrink-0">
        Reactivo {indice + 1} de {total}
      </span>

      <button
        type="button"
        onClick={onSiguiente}
        disabled={enUltimo}
        className={`${base} border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300`}
      >
        Siguiente <span aria-hidden="true">→</span>
      </button>
    </div>
  );
}
