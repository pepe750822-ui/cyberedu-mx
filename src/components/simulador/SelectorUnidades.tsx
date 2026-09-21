import { MenuBloques } from "./Bloques";
import { iconoDeMateria, type Bloque } from "./bloques-utils";

/**
 * Pantalla 2 del simulador: selección de unidad (bloques) de una materia.
 *
 * Comparte la cuadrícula con `SelectorMaterias` a través de `MenuBloques`.
 */

interface SelectorUnidadesProps {
  materia: string;
  /** Bloques de la materia, ya ordenados, incluidos los que aún tienen 0 reactivos. */
  bloques: Bloque[];
  onElegir: (unidad: string) => void;
  /** Sólo se muestra si hay más de una materia a la que volver. */
  onRegresar?: () => void;
}

export function SelectorUnidades({
  materia,
  bloques,
  onElegir,
  onRegresar,
}: SelectorUnidadesProps) {
  return (
    <MenuBloques
      titulo={materia}
      subtitulo="4º año — ENP UNAM"
      icono={iconoDeMateria(materia)}
      pregunta="Elige una unidad:"
      textoVacio="Esta materia todavía no tiene unidades capturadas."
      bloques={bloques}
      onAbrir={onElegir}
      onRegresar={onRegresar}
      textoRegresar="Cambiar de materia"
    />
  );
}
