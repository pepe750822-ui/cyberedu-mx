// ─── Banco de Imágenes Educativas ECOEMS ───
// Fuentes: Wikimedia Commons (CC-libre, URLs estables)
// Uso: la IA referencia imágenes con la sintaxis [IMG:clave]

export interface EduImage {
  key: string;
  title: string;
  description: string;
  area: string;
  url: string;
  source?: string;
}

export const educationalImages: EduImage[] = [
  // ─── BIOLOGÍA ───
  {
    key: "celula-animal",
    title: "Célula Animal",
    description: "Estructura completa de la célula animal con organelos etiquetados",
    area: "Biología",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Animal_cell_structure_en.svg/800px-Animal_cell_structure_en.svg.png",
    source: "Wikimedia Commons"
  },
  {
    key: "celula-vegetal",
    title: "Célula Vegetal",
    description: "Estructura de la célula vegetal con pared celular, cloroplastos y vacuola central",
    area: "Biología",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Typical_plant_cell_structure.svg/800px-Typical_plant_cell_structure.svg.png",
    source: "Wikimedia Commons"
  },
  {
    key: "mitosis",
    title: "Fases de la Mitosis",
    description: "Las 4 fases de la mitosis: Profase, Metafase, Anafase y Telofase",
    area: "Biología",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Animal_cell_cycle-es.svg/800px-Animal_cell_cycle-es.svg.png",
    source: "Wikimedia Commons"
  },
  {
    key: "adn-estructura",
    title: "Estructura del ADN",
    description: "Doble hélice del ADN con bases nitrogenadas: Adenina, Timina, Guanina, Citosina",
    area: "Biología",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/DNA_Structure%2BKey%2BLabelled.pn_NoBB.png/600px-DNA_Structure%2BKey%2BLabelled.pn_NoBB.png",
    source: "Wikimedia Commons"
  },
  {
    key: "fotosintesis",
    title: "Proceso de Fotosíntesis",
    description: "Ecuación y proceso de la fotosíntesis en el cloroplasto",
    area: "Biología",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Photosynthesis_en.svg/800px-Photosynthesis_en.svg.png",
    source: "Wikimedia Commons"
  },
  {
    key: "cadena-alimentaria",
    title: "Cadena Alimentaria",
    description: "Niveles tróficos: productores, consumidores primarios, secundarios y descomponedores",
    area: "Biología",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/FoodChain.svg/600px-FoodChain.svg.png",
    source: "Wikimedia Commons"
  },
  {
    key: "meiosis",
    title: "Meiosis vs Mitosis",
    description: "Comparación entre el proceso de meiosis y mitosis celular",
    area: "Biología",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Meiosis_Overview_new.svg/800px-Meiosis_Overview_new.svg.png",
    source: "Wikimedia Commons"
  },

  // ─── FÍSICA ───
  {
    key: "mru-mrua",
    title: "MRU y MRUA",
    description: "Gráficas de posición y velocidad para Movimiento Rectilíneo Uniforme y Uniformemente Acelerado",
    area: "Física",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Constant_velocity_and_acceleration.svg/800px-Constant_velocity_and_acceleration.svg.png",
    source: "Wikimedia Commons"
  },
  {
    key: "leyes-newton",
    title: "Leyes de Newton",
    description: "Diagrama explicativo de las tres leyes de Newton: Inercia, F=ma, Acción y Reacción",
    area: "Física",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Newton%27s_laws_of_motion_%28Simple_English%29.svg/800px-Newton%27s_laws_of_motion_%28Simple_English%29.svg.png",
    source: "Wikimedia Commons"
  },
  {
    key: "espectro-electromagnetico",
    title: "Espectro Electromagnético",
    description: "Clasificación de ondas electromagnéticas por longitud de onda y frecuencia",
    area: "Física",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/EM_spectrum.svg/800px-EM_spectrum.svg.png",
    source: "Wikimedia Commons"
  },
  {
    key: "circuito-electrico",
    title: "Circuito Eléctrico Simple",
    description: "Componentes básicos de un circuito: resistencia, batería, bombilla",
    area: "Física",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Ohm%27s_Law_with_Voltage_source.svg/600px-Ohm%27s_Law_with_Voltage_source.svg.png",
    source: "Wikimedia Commons"
  },
  {
    key: "tiro-parabolico",
    title: "Tiro Parabólico",
    description: "Descomposición de velocidades y trayectoria en el tiro parabólico",
    area: "Física",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Ferde_hajitas2.svg/800px-Ferde_hajitas2.svg.png",
    source: "Wikimedia Commons"
  },

  // ─── QUÍMICA ───
  {
    key: "tabla-periodica",
    title: "Tabla Periódica",
    description: "Tabla periódica de los elementos con grupos y periodos",
    area: "Química",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/PTable.png/800px-PTable.png",
    source: "Wikimedia Commons"
  },
  {
    key: "modelo-bohr",
    title: "Modelo Atómico de Bohr",
    description: "Átomo de Bohr con niveles de energía y órbitas electrónicas",
    area: "Química",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Bohr_atom_model_English.svg/600px-Bohr_atom_model_English.svg.png",
    source: "Wikimedia Commons"
  },
  {
    key: "enlace-covalente",
    title: "Enlace Covalente",
    description: "Formación del enlace covalente simple y doble compartiendo electrones",
    area: "Química",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Covalent_bond_hydrogen.svg/600px-Covalent_bond_hydrogen.svg.png",
    source: "Wikimedia Commons"
  },
  {
    key: "estados-materia",
    title: "Estados de la Materia",
    description: "Sólido, líquido y gaseoso: disposición molecular y cambios de estado",
    area: "Química",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Phase_diagram_of_water.svg/600px-Phase_diagram_of_water.svg.png",
    source: "Wikimedia Commons"
  },
  {
    key: "molecula-agua",
    title: "Molécula de Agua",
    description: "Estructura molecular del agua H₂O con su geometría angular y polaridad",
    area: "Química",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Water_molecule_3D.svg/600px-Water_molecule_3D.svg.png",
    source: "Wikimedia Commons"
  },

  // ─── MATEMÁTICAS ───
  {
    key: "triangulo-pitagoras",
    title: "Teorema de Pitágoras",
    description: "Triángulo rectángulo con a² + b² = c² y sus aplicaciones",
    area: "Matemáticas",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Pythagorean.svg/600px-Pythagorean.svg.png",
    source: "Wikimedia Commons"
  },
  {
    key: "circunferencia",
    title: "Elementos de la Circunferencia",
    description: "Radio, diámetro, cuerda, arco y sector circular",
    area: "Matemáticas",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Circle_slices.svg/600px-Circle_slices.svg.png",
    source: "Wikimedia Commons"
  },
  {
    key: "funciones-trigonometricas",
    title: "Funciones Trigonométricas",
    description: "Seno, coseno y tangente en el círculo unitario",
    area: "Matemáticas",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Unit_circle_angles_color.svg/800px-Unit_circle_angles_color.svg.png",
    source: "Wikimedia Commons"
  },
  {
    key: "grafica-funciones",
    title: "Funciones Lineales y Cuadráticas",
    description: "Representación gráfica de y=mx+b y y=ax²+bx+c en el plano cartesiano",
    area: "Matemáticas",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Parabola2.svg/600px-Parabola2.svg.png",
    source: "Wikimedia Commons"
  },

  // ─── GEOGRAFÍA ───
  {
    key: "capas-tierra",
    title: "Capas de la Tierra",
    description: "Corteza, manto, núcleo externo e interno con sus características",
    area: "Geografía",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Earth_internal_structure.svg/600px-Earth_internal_structure.svg.png",
    source: "Wikimedia Commons"
  },
  {
    key: "climas-mexico",
    title: "Climas de México",
    description: "Distribución de los principales tipos de clima en el territorio mexicano",
    area: "Geografía",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Mexico_Climates_(Spanish).svg/800px-Mexico_Climates_(Spanish).svg.png",
    source: "Wikimedia Commons"
  },
  {
    key: "ciclo-agua",
    title: "Ciclo del Agua",
    description: "Evaporación, condensación, precipitación e infiltración del ciclo hidrológico",
    area: "Geografía",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Water_cycle.png/800px-Water_cycle.png",
    source: "Wikimedia Commons"
  },
  {
    key: "husos-horarios",
    title: "Husos Horarios",
    description: "División del mundo en 24 husos horarios y el meridiano de Greenwich",
    area: "Geografía",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/World_Time_Zones_Map.png/800px-World_Time_Zones_Map.png",
    source: "Wikimedia Commons"
  },

  // ─── HISTORIA ───
  {
    key: "revolucion-mexicana",
    title: "Revolución Mexicana",
    description: "Línea del tiempo de los principales eventos de la Revolución Mexicana 1910-1920",
    area: "Historia de México",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Emiliano_Zapata4.jpg/400px-Emiliano_Zapata4.jpg",
    source: "Wikimedia Commons"
  },
  {
    key: "segunda-guerra-mundial",
    title: "Segunda Guerra Mundial",
    description: "Mapa de los frentes y potencias aliadas vs potencias del eje 1939-1945",
    area: "Historia Universal",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Second_world_war_europe_1941-1942_map_en.svg/800px-Second_world_war_europe_1941-1942_map_en.svg.png",
    source: "Wikimedia Commons"
  },
  {
    key: "revolucion-francesa",
    title: "Revolución Francesa",
    description: "Causas, desarrollo y consecuencias de la Revolución Francesa (1789)",
    area: "Historia Universal",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Prise_de_la_Bastille.jpg/800px-Prise_de_la_Bastille.jpg",
    source: "Wikimedia Commons"
  },
];

// ─── Lookup rápido por clave ───
export const imageByKey: Record<string, EduImage> = Object.fromEntries(
  educationalImages.map((img) => [img.key, img])
);

// ─── Lista de claves disponibles ───
export const availableImageKeys = educationalImages.map((img) => img.key);

// ─── Búsqueda por área ───
export function getImagesByArea(area: string): EduImage[] {
  return educationalImages.filter(
    (img) => img.area.toLowerCase().includes(area.toLowerCase())
  );
}
