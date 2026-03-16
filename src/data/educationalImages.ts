// ─── Banco de Imágenes Educativas ECOEMS ───
// Fuentes: Wikimedia Commons (CC-libre, URLs estables - se usan SVGs originales)
// Uso: la IA referencia imágenes con la sintaxis [IMG:clave]
// NOTA: Se usan URLs de SVG originales (no /thumb/) para máxima estabilidad.
//       El componente EduImageViewer aplica proxy wsrv.nl automáticamente.

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
    url: "https://upload.wikimedia.org/wikipedia/commons/4/48/Animal_cell_structure_en.svg",
    source: "Wikimedia Commons"
  },
  {
    key: "celula-vegetal",
    title: "Célula Vegetal",
    description: "Estructura de la célula vegetal con pared celular, cloroplastos y vacuola central",
    area: "Biología",
    url: "https://upload.wikimedia.org/wikipedia/commons/d/d8/Plant_cell_structure-en.svg",
    source: "Wikimedia Commons"
  },
  {
    key: "mitosis",
    title: "Fases de la Mitosis",
    description: "Las 4 fases de la mitosis: Profase, Metafase, Anafase y Telofase",
    area: "Biología",
    url: "https://upload.wikimedia.org/wikipedia/commons/e/e0/Major_events_in_mitosis.svg",
    source: "Wikimedia Commons"
  },
  {
    key: "adn-estructura",
    title: "Estructura del ADN",
    description: "Doble hélice del ADN con bases nitrogenadas: Adenina, Timina, Guanina, Citosina",
    area: "Biología",
    url: "https://upload.wikimedia.org/wikipedia/commons/e/e4/DNA_chemical_structure.svg",
    source: "Wikimedia Commons"
  },
  {
    key: "fotosintesis",
    title: "Proceso de Fotosíntesis",
    description: "Ecuación y proceso de la fotosíntesis en el cloroplasto",
    area: "Biología",
    url: "https://upload.wikimedia.org/wikipedia/commons/5/55/Photosynthesis_en.svg",
    source: "Wikimedia Commons"
  },
  {
    key: "cadena-alimentaria",
    title: "Cadena Alimentaria",
    description: "Niveles tróficos: productores, consumidores primarios, secundarios y descomponedores",
    area: "Biología",
    url: "https://upload.wikimedia.org/wikipedia/commons/b/b3/FoodWeb.svg",
    source: "Wikimedia Commons"
  },
  {
    key: "meiosis",
    title: "Meiosis vs Mitosis",
    description: "Comparación entre el proceso de meiosis y mitosis celular",
    area: "Biología",
    url: "https://upload.wikimedia.org/wikipedia/commons/7/7e/Meiosis_Overview_new.svg",
    source: "Wikimedia Commons"
  },
  {
    key: "aparato-digestivo",
    title: "Aparato Digestivo",
    description: "Órganos del sistema digestivo humano y el proceso de digestión",
    area: "Biología",
    url: "https://upload.wikimedia.org/wikipedia/commons/c/c5/Digestive_system_diagram_es.svg",
    source: "Wikimedia Commons"
  },
  {
    key: "sistema-respiratorio",
    title: "Sistema Respiratorio",
    description: "Vías nasales, tráquea, pulmones y alvéolos en el intercambio de gases",
    area: "Biología",
    url: "https://upload.wikimedia.org/wikipedia/commons/4/41/Respiratory_system_complete_en.svg",
    source: "Wikimedia Commons"
  },
  {
    key: "sistema-circulatorio",
    title: "Sistema Circulatorio",
    description: "Corazón, venas, arterias y el recorrido de la sangre en el cuerpo humano",
    area: "Biología",
    url: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Circulatory_System_en.svg",
    source: "Wikimedia Commons"
  },
  {
    key: "neurona",
    title: "La Neurona",
    description: "Estructura de la neurona: dendritas, soma, axón y mielina",
    area: "Biología",
    url: "https://upload.wikimedia.org/wikipedia/commons/b/b5/Neuron_Hand-tuned.svg",
    source: "Wikimedia Commons"
  },
  {
    key: "sistema-oseo",
    title: "Sistema Óseo Humano",
    description: "Esqueleto humano completo con principales huesos (cráneo, fémur, costillas)",
    area: "Biología",
    url: "https://upload.wikimedia.org/wikipedia/commons/b/b0/Human_skeleton_front_es.svg",
    source: "Wikimedia Commons"
  },
  {
    key: "sistema-nervioso",
    title: "Sistema Nervioso Central y Periférico",
    description: "Encéfalo, médula espinal y nervios del cuerpo humano",
    area: "Biología",
    url: "https://upload.wikimedia.org/wikipedia/commons/b/b2/TE-Nervous_system_diagram.svg",
    source: "Wikimedia Commons"
  },
  {
    key: "sistema-muscular",
    title: "Sistema Muscular",
    description: "Principales grupos musculares del cuerpo humano",
    area: "Biología",
    url: "https://upload.wikimedia.org/wikipedia/commons/e/e5/Muscles_anterior_labeled.png",
    source: "Wikimedia Commons"
  },
  {
    key: "ciclo-carbono",
    title: "Ciclo del Carbono",
    description: "Intercambio de carbono entre la biósfera, litósfera, hidrósfera y la atmósfera",
    area: "Biología",
    url: "https://upload.wikimedia.org/wikipedia/commons/d/d5/Carbon_cycle.svg",
    source: "Wikimedia Commons"
  },

  // ─── FÍSICA ───
  {
    key: "mru-mrua",
    title: "MRU y MRUA",
    description: "Gráficas de posición y velocidad para Movimiento Rectilíneo Uniforme y Uniformemente Acelerado",
    area: "Física",
    url: "https://upload.wikimedia.org/wikipedia/commons/3/3e/Velocity_vs_time_graph.svg",
    source: "Wikimedia Commons"
  },
  {
    key: "leyes-newton",
    title: "Leyes de Newton",
    description: "Diagrama explicativo de las tres leyes de Newton: Inercia, F=ma, Acción y Reacción",
    area: "Física",
    url: "https://upload.wikimedia.org/wikipedia/commons/4/4b/Free_body_diagram2.svg",
    source: "Wikimedia Commons"
  },
  {
    key: "espectro-electromagnetico",
    title: "Espectro Electromagnético",
    description: "Clasificación de ondas electromagnéticas por longitud de onda y frecuencia",
    area: "Física",
    url: "https://upload.wikimedia.org/wikipedia/commons/f/f1/EM_spectrum.svg",
    source: "Wikimedia Commons"
  },
  {
    key: "circuito-electrico",
    title: "Circuito Eléctrico Simple",
    description: "Componentes básicos de un circuito: resistencia, batería, bombilla",
    area: "Física",
    url: "https://upload.wikimedia.org/wikipedia/commons/c/cc/Ohms_law_voltage_source.svg",
    source: "Wikimedia Commons"
  },
  {
    key: "tiro-parabolico",
    title: "Tiro Parabólico",
    description: "Descomposición de velocidades y trayectoria en el tiro parabólico",
    area: "Física",
    url: "https://upload.wikimedia.org/wikipedia/commons/1/11/Ferde_hajitas2.svg",
    source: "Wikimedia Commons"
  },
  {
    key: "palancas",
    title: "Tipos de Palancas",
    description: "Palancas de primer, segundo y tercer grado con fulcro, potencia y resistencia",
    area: "Física",
    url: "https://upload.wikimedia.org/wikipedia/commons/6/6a/Lever_Principle_3D.png",
    source: "Wikimedia Commons"
  },
  {
    key: "transferencia-calor",
    title: "Transferencia de Calor",
    description: "Mecanismos de conducción, convección y radiación térmica",
    area: "Física",
    url: "https://upload.wikimedia.org/wikipedia/commons/8/8e/Heat-transmittance-means2.jpg",
    source: "Wikimedia Commons"
  },
  {
    key: "partes-onda",
    title: "Partes de una Onda",
    description: "Longitud de onda, cresta, valle y amplitud",
    area: "Física",
    url: "https://upload.wikimedia.org/wikipedia/commons/8/84/Sine_wave_amplitude.svg",
    source: "Wikimedia Commons"
  },
  {
    key: "circuitos-serie-paralelo",
    title: "Circuitos en Serie y Paralelo",
    description: "Diferencia de configuración entre circuito en serie y circuito en paralelo",
    area: "Física",
    url: "https://upload.wikimedia.org/wikipedia/commons/6/64/Resistors_in_series_and_parallel.svg",
    source: "Wikimedia Commons"
  },
  {
    key: "espectro-visible",
    title: "Espectro Visible / Dispersión de la Luz",
    description: "Prisma separando la luz blanca en los colores del arcoíris",
    area: "Física",
    url: "https://upload.wikimedia.org/wikipedia/commons/1/1f/Prism_rainbow_schema.png",
    source: "Wikimedia Commons"
  },

  // ─── QUÍMICA ───
  {
    key: "tabla-periodica",
    title: "Tabla Periódica",
    description: "Tabla periódica de los elementos con grupos y periodos",
    area: "Química",
    url: "https://upload.wikimedia.org/wikipedia/commons/9/98/Periodic_table_%28polyatomic%29.svg",
    source: "Wikimedia Commons"
  },
  {
    key: "modelo-bohr",
    title: "Modelo Atómico de Bohr",
    description: "Átomo de Bohr con niveles de energía y órbitas electrónicas",
    area: "Química",
    url: "https://upload.wikimedia.org/wikipedia/commons/9/93/Bohr_atom_model.svg",
    source: "Wikimedia Commons"
  },
  {
    key: "enlace-covalente",
    title: "Enlace Covalente",
    description: "Formación del enlace covalente simple y doble compartiendo electrones",
    area: "Química",
    url: "https://upload.wikimedia.org/wikipedia/commons/1/19/Covalent.svg",
    source: "Wikimedia Commons"
  },
  {
    key: "estados-materia",
    title: "Estados de la Materia",
    description: "Sólido, líquido y gaseoso: disposición molecular y cambios de estado",
    area: "Química",
    url: "https://upload.wikimedia.org/wikipedia/commons/e/e4/Phase-diag2.svg",
    source: "Wikimedia Commons"
  },
  {
    key: "molecula-agua",
    title: "Molécula de Agua",
    description: "Estructura molecular del agua H₂O con su geometría angular y polaridad",
    area: "Química",
    url: "https://upload.wikimedia.org/wikipedia/commons/1/18/Water_molecule_dimensions.svg",
    source: "Wikimedia Commons"
  },
  {
    key: "escala-ph",
    title: "Escala de pH",
    description: "Escala de acidez y alcalinidad (0 al 14) con ejemplos comunes",
    area: "Química",
    url: "https://upload.wikimedia.org/wikipedia/commons/a/a6/PH_scale.png",
    source: "Wikimedia Commons"
  },
  {
    key: "destilacion",
    title: "Proceso de Destilación",
    description: "Método de separación por puntos de ebullición",
    area: "Química",
    url: "https://upload.wikimedia.org/wikipedia/commons/e/ea/Fractional_distillation_lab_apparatus.svg",
    source: "Wikimedia Commons"
  },
  {
    key: "filtracion",
    title: "Filtración",
    description: "Separación de mezclas heterogéneas sólido-líquido",
    area: "Química",
    url: "https://upload.wikimedia.org/wikipedia/commons/f/fc/Filtration.svg",
    source: "Wikimedia Commons"
  },
  {
    key: "modelos-atomicos",
    title: "Modelos Atómicos Históricos",
    description: "Evolución histórica de los modelos atómicos: Dalton, Thomson, Rutherford, Bohr",
    area: "Química",
    url: "https://upload.wikimedia.org/wikipedia/commons/7/7d/Atom_diagram.png",
    source: "Wikimedia Commons"
  },
  {
    key: "configuracion-electronica",
    title: "Configuración Electrónica",
    description: "Diagrama de Moeller o regla de las diagonales",
    area: "Química",
    url: "https://upload.wikimedia.org/wikipedia/commons/4/44/Madelung_rule.svg",
    source: "Wikimedia Commons"
  },

  // ─── MATEMÁTICAS ───
  {
    key: "triangulo-pitagoras",
    title: "Teorema de Pitágoras",
    description: "Triángulo rectángulo con a² + b² = c² y sus aplicaciones",
    area: "Matemáticas",
    url: "https://upload.wikimedia.org/wikipedia/commons/d/d2/Pythagorean.svg",
    source: "Wikimedia Commons"
  },
  {
    key: "circunferencia",
    title: "Elementos de la Circunferencia",
    description: "Radio, diámetro, cuerda, arco y sector circular",
    area: "Matemáticas",
    url: "https://upload.wikimedia.org/wikipedia/commons/0/03/Circle-withsegments.svg",
    source: "Wikimedia Commons"
  },
  {
    key: "funciones-trigonometricas",
    title: "Funciones Trigonométricas",
    description: "Seno, coseno y tangente en el círculo unitario",
    area: "Matemáticas",
    url: "https://upload.wikimedia.org/wikipedia/commons/7/72/Sinus_und_Kosinus_am_Einheitskreis_1.svg",
    source: "Wikimedia Commons"
  },
  {
    key: "grafica-funciones",
    title: "Funciones Lineales y Cuadráticas",
    description: "Representación gráfica de y=mx+b y y=ax²+bx+c en el plano cartesiano",
    area: "Matemáticas",
    url: "https://upload.wikimedia.org/wikipedia/commons/f/f4/Polynomialdeg2.svg",
    source: "Wikimedia Commons"
  },
  {
    key: "plano-cartesiano",
    title: "Plano Cartesiano",
    description: "Ejes X e Y, cuadrantes y localización de coordenadas",
    area: "Matemáticas",
    url: "https://upload.wikimedia.org/wikipedia/commons/0/0e/Cartesian-coordinate-system.svg",
    source: "Wikimedia Commons"
  },
  {
    key: "poligonos-regulares",
    title: "Polígonos Regulares",
    description: "Figuras geométricas según su número de lados (triángulo, cuadrado, pentágono, etc.)",
    area: "Matemáticas",
    url: "https://upload.wikimedia.org/wikipedia/commons/b/ba/Regular_polygon_3_annotated.svg",
    source: "Wikimedia Commons"
  },
  {
    key: "angulos-tipos",
    title: "Tipos de Ángulos",
    description: "Agudo, recto, obtuso, llano, cóncavo y completo",
    area: "Matemáticas",
    url: "https://upload.wikimedia.org/wikipedia/commons/a/a0/Complementary_angles.svg",
    source: "Wikimedia Commons"
  },
  {
    key: "cuerpos-geometricos",
    title: "Cuerpos Geométricos",
    description: "Prismas, pirámides, cilindros, conos y esferas con sus partes",
    area: "Matemáticas",
    url: "https://upload.wikimedia.org/wikipedia/commons/3/37/Euler_diagram_of_triangle_types.svg",
    source: "Wikimedia Commons"
  },
  {
    key: "fracciones",
    title: "Representación de Fracciones",
    description: "Numerador y denominador representados gráficamente",
    area: "Matemáticas",
    url: "https://upload.wikimedia.org/wikipedia/commons/d/d7/Cake_quarters.svg",
    source: "Wikimedia Commons"
  },

  // ─── GEOGRAFÍA ───
  {
    key: "capas-tierra",
    title: "Capas de la Tierra",
    description: "Corteza, manto, núcleo externo e interno con sus características",
    area: "Geografía",
    url: "https://upload.wikimedia.org/wikipedia/commons/0/07/Earth_poster.svg",
    source: "Wikimedia Commons"
  },
  {
    key: "climas-mexico",
    title: "Climas de México",
    description: "Distribución de los principales tipos de clima en el territorio mexicano",
    area: "Geografía",
    url: "https://upload.wikimedia.org/wikipedia/commons/0/0f/Mexico_map_of_K%C3%B6ppen_climate_classification.svg",
    source: "Wikimedia Commons"
  },
  {
    key: "ciclo-agua",
    title: "Ciclo del Agua",
    description: "Evaporación, condensación, precipitación e infiltración del ciclo hidrológico",
    area: "Geografía",
    url: "https://upload.wikimedia.org/wikipedia/commons/9/94/Water_cycle.png",
    source: "Wikimedia Commons"
  },
  {
    key: "husos-horarios",
    title: "Husos Horarios",
    description: "División del mundo en 24 husos horarios y el meridiano de Greenwich",
    area: "Geografía",
    url: "https://upload.wikimedia.org/wikipedia/commons/8/88/World_Time_Zones_Map.png",
    source: "Wikimedia Commons"
  },
  {
    key: "placas-tectonicas",
    title: "Placas Tectónicas",
    description: "Mapa mundial de las principales placas tectónicas y sus límites",
    area: "Geografía",
    url: "https://upload.wikimedia.org/wikipedia/commons/8/8a/Plates_tect2_en.svg",
    source: "Wikimedia Commons"
  },
  {
    key: "capas-atmosfera",
    title: "Capas de la Atmósfera",
    description: "Troposfera, estratosfera, mesosfera, termosfera y exosfera",
    area: "Geografía",
    url: "https://upload.wikimedia.org/wikipedia/commons/8/8c/Earth%27s_atmosphere.svg",
    source: "Wikimedia Commons"
  },
  {
    key: "mapamundi-oceanos",
    title: "Océanos y Continentes",
    description: "Ubicación de los continentes y los 5 océanos del mundo",
    area: "Geografía",
    url: "https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg",
    source: "Wikimedia Commons"
  },
  {
    key: "pangea",
    title: "Pangea y Deriva Continental",
    description: "El supercontinente originario de la Tierra y la fragmentación continental",
    area: "Geografía",
    url: "https://upload.wikimedia.org/wikipedia/commons/c/cb/Pangaea_continents.svg",
    source: "Wikimedia Commons"
  },

  // ─── HISTORIA ───
  {
    key: "revolucion-mexicana",
    title: "Revolución Mexicana",
    description: "Líderes de la Revolución Mexicana 1910-1920: Zapata, Villa, Madero, Carranza",
    area: "Historia de México",
    url: "https://upload.wikimedia.org/wikipedia/commons/9/99/Emiliano_Zapata4.jpg",
    source: "Wikimedia Commons"
  },
  {
    key: "segunda-guerra-mundial",
    title: "Segunda Guerra Mundial",
    description: "Mapa de los frentes y potencias aliadas vs potencias del eje 1939-1945",
    area: "Historia Universal",
    url: "https://upload.wikimedia.org/wikipedia/commons/1/14/Second_world_war_europe_animation_small.gif",
    source: "Wikimedia Commons"
  },
  {
    key: "revolucion-francesa",
    title: "Revolución Francesa",
    description: "Causas, desarrollo y consecuencias de la Revolución Francesa (1789)",
    area: "Historia Universal",
    url: "https://upload.wikimedia.org/wikipedia/commons/5/5d/Prise_de_la_Bastille.jpg",
    source: "Wikimedia Commons"
  },
  {
    key: "primera-guerra-mundial",
    title: "Primera Guerra Mundial",
    description: "Alianzas y mapa europeo durante la Primera Guerra Mundial (1914-1918)",
    area: "Historia Universal",
    url: "https://upload.wikimedia.org/wikipedia/commons/2/26/Map_Europe_alliances_1914-en.svg",
    source: "Wikimedia Commons"
  },
  {
    key: "guerra-fria",
    title: "Guerra Fría",
    description: "El mundo bipolar: Bloque Capitalista (OTAN) vs Bloque Comunista (Pacto de Varsovia)",
    area: "Historia Universal",
    url: "https://upload.wikimedia.org/wikipedia/commons/2/2a/Cold_war_europe_military_alliances_map_en.png",
    source: "Wikimedia Commons"
  },
  {
    key: "independencia-mexico",
    title: "Independencia de México",
    description: "Miguel Hidalgo y la ruta de la Independencia de México",
    area: "Historia de México",
    url: "https://upload.wikimedia.org/wikipedia/commons/2/20/Miguel_Hidalgo.png",
    source: "Wikimedia Commons"
  },
  {
    key: "mesoamerica",
    title: "Culturas de Mesoamérica",
    description: "Mapa de las áreas culturales y principales civilizaciones mesoamericanas",
    area: "Historia de México",
    url: "https://upload.wikimedia.org/wikipedia/commons/e/ec/Mesoam%C3%A9rica.png",
    source: "Wikimedia Commons"
  },
  {
    key: "areas-culturales-mexico",
    title: "Áreas Culturales de México Antiguo",
    description: "División geográfica de Mesoamérica, Aridoamérica y Oasisamérica",
    area: "Historia de México",
    url: "https://upload.wikimedia.org/wikipedia/commons/a/a3/Mesoamerica_topographic_map-blank.svg",
    source: "Wikimedia Commons"
  },
  {
    key: "castas-nueva-espana",
    title: "Sistema de Castas (Virreinato)",
    description: "Mestizaje en la Nueva España: españoles, indígenas, mestizos, criollos, etc.",
    area: "Historia de México",
    url: "https://upload.wikimedia.org/wikipedia/commons/e/e1/Casta_painting_all.jpg",
    source: "Wikimedia Commons"
  },
  {
    key: "porfiriato",
    title: "El Porfiriato",
    description: "Porfirio Díaz (1876-1911): Desarrollo ferrocarrilero, industrialización y desigualdad social",
    area: "Historia de México",
    url: "https://upload.wikimedia.org/wikipedia/commons/f/f5/Porfirio_Diaz.jpg",
    source: "Archivos Históricos"
  },

  // ─── ESPAÑOL ───
  {
    key: "ficha-bibliografica",
    title: "Ficha Bibliográfica",
    description: "Estructura y datos necesarios en una ficha bibliográfica: Autor, Título, Editorial, etc.",
    area: "Español",
    url: "https://upload.wikimedia.org/wikipedia/commons/3/3c/Card_catalog.jpg",
    source: "Wikimedia Commons"
  },
  {
    key: "partes-oracion",
    title: "Partes de la Oración",
    description: "Sujeto, predicado, verbos, sustantivos, adjetivos y adverbios",
    area: "Español",
    url: "https://upload.wikimedia.org/wikipedia/commons/7/70/Syntax_tree.svg",
    source: "Wikimedia Commons"
  },
  {
    key: "generos-literarios",
    title: "Géneros Literarios Clásicos",
    description: "Clasificación de la literatura en Épico, Lírico y Dramático",
    area: "Español",
    url: "https://upload.wikimedia.org/wikipedia/commons/3/3a/Comedy_and_tragedy_masks_without_background.svg",
    source: "Wikimedia Commons"
  },

  // ─── FORMACIÓN CÍVICA Y ÉTICA ───
  {
    key: "division-poderes",
    title: "División de Poderes en México",
    description: "Poder Ejecutivo, Legislativo y Judicial: funciones y representantes",
    area: "Formación Cívica",
    url: "https://upload.wikimedia.org/wikipedia/commons/5/51/Separation_of_powers.png",
    source: "Wikimedia Commons"
  },
  {
    key: "derechos-humanos",
    title: "Derechos Humanos",
    description: "Principios de universalidad, interdependencia, indivisibilidad y progresividad",
    area: "Formación Cívica",
    url: "https://upload.wikimedia.org/wikipedia/commons/2/2d/Eleanor_Roosevelt_UDHR.jpg",
    source: "Wikimedia Commons"
  }
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
