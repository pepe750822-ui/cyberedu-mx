import { MenuBloques } from "./Bloques";
import { iconoDeMateria, type Bloque } from "./bloques-utils";

/**
 * Pantalla 1 del simulador: selección de materia (tarjetas).
 *
 * Es una capa fina sobre `MenuBloques`; la cuadrícula, las tarjetas y los
 * estilos viven en un solo sitio para que ambas pantallas de selección se vean
 * idénticas.
 */

interface SelectorMateriasProps {
  materias: string[];
  /** Reactivos disponibles por materia (0 si aún no hay ninguno). */
  conteoPorMateria: (materia: string) => number;
  onElegir: (materia: string) => void;
}

export function SelectorMaterias({
  materias,
  conteoPorMateria,
  onElegir,
}: SelectorMateriasProps) {
  const bloques: Bloque[] = materias.map((materia) => ({
    nombre: materia,
    cantidad: conteoPorMateria(materia),
    icono: iconoDeMateria(materia),
  }));

  return (
    <MenuBloques
      titulo="Simulador Prepa"
      subtitulo="4º año — ENP UNAM"
      icono="🎓"
      pregunta="Elige una materia:"
      textoBoton="Elegir materia"
      textoVacio="Todavía no hay materias en el catálogo."
      bloques={bloques}
      onAbrir={onElegir}
    />
  );
}
