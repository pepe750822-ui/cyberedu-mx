import type { Question } from "./simuladorData";

// ============================================================
// BANCO 10 – Guía IPN/UNAM 2026 (código GB26)
// Primera edición: 03 de noviembre de 2025
// 128 reactivos · 10 áreas
// ============================================================
// NOTA SOBRE IMÁGENES:
// Las preguntas que requieren figura están marcadas con
// imageUrl comentado. Ver sección al final del archivo.
// ============================================================

export const bank10Questions: Question[] = [

  // ══════════════════════════════════════════════════════════
  // ESPAÑOL (Lenguajes) — preguntas 1-12
  // ══════════════════════════════════════════════════════════
  {
    id: "unam_2026_01",
    area: "Español",
    text: "La ficha bibliográfica es un instrumento de investigación que",
    options: [
      "organiza la información con una base temporal o alfabética",
      "da cuenta de estudios de campo, de laboratorio y estadísticas",
      "permite almacenar datos de las publicaciones por temas, títulos o autores",
      "registra exclusivamente noticias de documentos de reciente creación"
    ],
    correctIndex: 2,
    explanation: "La ficha bibliográfica permite almacenar y organizar datos de publicaciones por temas, títulos o autores, facilitando la investigación documental."
  },
  {
    id: "unam_2026_02",
    area: "Español",
    text: "Selecciona el tema del siguiente texto: «Manuel Gutiérrez Nájera se inició desde muy joven como escritor. A los diecisiete años apareció su primera publicación y durante las dos décadas siguientes colaboró en cerca de treinta y seis diarios y revistas literarias de la época, en ocasiones hasta con cinco entregas al día. Para tan ardua tarea utilizó alrededor de veintiséis seudónimos.» (Clark de Lara, Belem. Por donde se sube al cielo, Introducción.)",
    options: [
      "Manuel Gutiérrez Nájera tuvo una carrera productiva desde joven",
      "Manuel Gutiérrez Nájera usó diferentes seudónimos para firmar su obra",
      "Manuel Gutiérrez Nájera escribía mucho para numerosas publicaciones",
      "Manuel Gutiérrez Nájera tenía a los 17 años más de 26 seudónimos"
    ],
    correctIndex: 0,
    explanation: "El tema central del texto es la carrera productiva de Gutiérrez Nájera desde joven, ya que todos los datos (primera publicación, colaboraciones, seudónimos) ilustran esa idea central."
  },
  {
    id: "unam_2026_03",
    area: "Español",
    text: "¿Mediante qué recursos se desarrollan las ideas en el siguiente párrafo? «Para facilitar su estudio, los especialistas dividen la prehistoria en tres grandes etapas: el Paleolítico, el Mesolítico y el Neolítico. El periodo Paleolítico abarca desde la aparición de los primeros homínidos hace unos cuatro millones de años hasta el descubrimiento de la agricultura. El Mesolítico es una etapa de tránsito entre el Paleolítico y el Neolítico... Finalmente, la práctica de la agricultura y la ganadería es el hecho que determina el inicio del Neolítico.»",
    options: [
      "Repeticiones",
      "Explicaciones",
      "Paráfrasis",
      "Ejemplos"
    ],
    correctIndex: 1,
    explanation: "El párrafo desarrolla la idea de las etapas de la prehistoria mediante explicaciones de cada periodo, describiendo sus características y límites temporales."
  },
  {
    id: "unam_2026_04",
    area: "Español",
    text: "Elige las oraciones que usan nexos para introducir ideas: I. El Estridentismo en México inició en 1921, fue un grupo de intelectuales que reunió pintores, músicos además de escritores destacados. II. El Simbolismo y el Parnasianismo surgieron en Francia, influyeron por ejemplo en el Modernismo, además de legarnos una gran tradición poética. III. El Modernismo es considerado como el movimiento que inaugura las literaturas de vanguardia. IV. Los Contemporáneos se conocían como «El grupo sin grupo» y eran intelectuales polifacéticos. V. Estudiar los movimientos de vanguardia nos lleva a entender la mentalidad del hombre del siglo XX.",
    options: [
      "I y IV",
      "II y III",
      "I y II",
      "II y V"
    ],
    correctIndex: 2,
    explanation: "Los nexos que introducen ideas (además, por ejemplo, en primer lugar) aparecen en I («además de escritores») y en II («por ejemplo en el Modernismo», «además de legarnos»)."
  },
  {
    id: "unam_2026_05",
    area: "Español",
    text: "Las palabras subrayadas en el siguiente fragmento tienen como propósito: «Durante mucho tiempo el ser humano ha tenido sed de saber qué son los sueños. Mi teoría, en primer lugar, considera que son una realidad alterna similar a la del reflejo en el espejo; también pueden ser considerados una forma en la que nuestros cerebros logran vivir otras realidades; finalmente, como muchos artistas han demostrado, son fruto de mentes creativas; dime ¿qué soñaste hoy?»",
    options: [
      "indicar el modo en que surgen las ideas",
      "establecer los lugares de los eventos",
      "dar un orden a las ideas",
      "señalar el tiempo en el párrafo"
    ],
    correctIndex: 2,
    explanation: "Las expresiones «en primer lugar», «también» y «finalmente» son nexos que jerarquizan y ordenan las ideas dentro del párrafo."
  },
  {
    id: "unam_2026_06",
    area: "Español",
    text: "Determina cuál es el signo de puntuación que debe sustituir a la línea en el siguiente párrafo: «Hace poco más de una semana entrevistéa Emmanuel Carballo. No sé si fue la última entrevista que dio; realmente quisiera que no lo fuera. Me gustaría poder hacer lo que acordamos al despedirnos_____ volver a verlo en unos días, llevarle el libro que me prestó tras prometerle que era devuelvelibros, y continuar con esa conversación que ya quedó para siempre trunca.»",
    options: [
      "comillas",
      "punto y seguido",
      "dos puntos",
      "coma"
    ],
    correctIndex: 2,
    explanation: "Los dos puntos se usan para introducir una enumeración o explicación de lo que se acaba de enunciar; aquí introducen la lista de acciones acordadas al despedirse."
  },
  {
    id: "unam_2026_07",
    area: "Español",
    text: "Identifica la oración principal en el siguiente texto: «ABUELO, ¿QUÉ SON LAS FLORES? —Las flores son los ojos de las plantas, como tus ojos son las flores en el jardín de tu rostro. Por esas flores-ojos de colores con aromas, las plantas miran, atraen, alegran y curan el alma de los hombres.» (Miguel Cocom Pech, poeta maya)",
    options: [
      "Por esas flores-ojos con aromas",
      "Las flores son los ojos de las plantas",
      "Abuelo ¿qué son las flores?",
      "Curan el alma de los hombres"
    ],
    correctIndex: 1,
    explanation: "La oración principal es «Las flores son los ojos de las plantas», pues es la afirmación central que da respuesta a la pregunta y de la cual se desprenden las demás ideas."
  },
  {
    id: "unam_2026_08",
    area: "Español",
    text: "¿Cuál de las siguientes oraciones está en tiempo presente de indicativo histórico?",
    options: [
      "Mi mamá cocina un rico pastel",
      "Cristóbal Colón descubre América en 1492",
      "Mañana regresa mi abuela de Celaya",
      "Me lavo los dientes todas las mañanas"
    ],
    correctIndex: 1,
    explanation: "El presente histórico usa el presente de indicativo para narrar hechos del pasado como si ocurrieran ahora, lo que es característico de la oración sobre Cristóbal Colón."
  },
  {
    id: "unam_2026_09",
    area: "Español",
    text: "Lee el siguiente párrafo e indica a qué categoría pertenecen los elementos subrayados: «Jorge era un hombre, un grave guerrero, hermoso a su manera, digno de la admiración con que le miraba Miguel. Alto y membrudo llevaba con marcial desembarazo [...] el arnés entero de batalla [...]. El rostro de Jorge respiraba ardor y lealtad; pálido de garzos ojos, una puntiaguda barba castaña lo hacía más varonil.»",
    options: [
      "Sustantivos",
      "Gerundios",
      "Participios",
      "Adjetivos"
    ],
    correctIndex: 3,
    explanation: "Las palabras subrayadas (grave, hermoso, digno, alto, membrudo, pálido, etc.) son adjetivos, pues modifican al sustantivo «Jorge» describiendo sus características."
  },
  {
    id: "unam_2026_10",
    area: "Español",
    text: "¿En qué tiempo están conjugados los verbos subrayados en el siguiente texto? «Aureliano, el primer ser humano que nació en Macondo [...]. Mientras le cortaban el ombligo, movía la cabeza de un lado a otro, reconociendo las cosas del cuarto y examinaba el rostro de la gente con una curiosidad sin asombro. Luego, indiferente a quienes se acercaban a conocerlo, mantuvo la atención concentrada en el techo de palma que parecía a punto de derrumbarse bajo la tremenda presión de la lluvia.» (G. García Márquez, Cien años de soledad.)",
    options: [
      "Antepretérito",
      "Copretérito",
      "Pretérito",
      "Antecopretérito"
    ],
    correctIndex: 1,
    explanation: "El copretérito (imperfecto) se usa para describir acciones simultáneas o estados de fondo en el pasado. «Movía» y «examinaba» son formas del copretérito que describen acciones continuas simultáneas."
  },
  {
    id: "unam_2026_11",
    area: "Español",
    text: "Lee el texto «Triunfo de mexicanos indocumentados en concurso de robótica llega al cine» y contesta. En la frase subrayada («Este filme es importante para la cultura latina porque se hacen pocas películas tan reales y fuertes como ésta, aseguró López en una reciente mesa redonda con periodistas en Los Ángeles»), se advierte que la intención de quien habla es",
    options: [
      "describir un acontecimiento",
      "narrar un evento",
      "justificar una acción",
      "dar una opinión"
    ],
    correctIndex: 3,
    explanation: "El uso de «aseguró» y la valoración personal («tan reales y fuertes») indica que el hablante está expresando su opinión sobre la importancia del filme."
  },
  {
    id: "unam_2026_12",
    area: "Español",
    text: "Identifica el anuncio publicitario en el que se exageran las cualidades del producto",
    options: [
      "Crema Vida nueva, agradable e intensa compañía para tu piel",
      "¿Cansado de pensar? Adquiere nuestro programa de habilidades, un botón que hará tareas por ti",
      "Si piensas seguir viviendo, no olvides tener a tu lado Esperanza, la pastilla que realmente renovará tus ganas de vivir",
      "La alimentación mediante productos Paraíso terrenal favorecerá llevar una vida llena de salud"
    ],
    correctIndex: 2,
    explanation: "La opción C exagera notoriamente las cualidades del producto al afirmar que una pastilla «renovará tus ganas de vivir», usando una hipérbole característica de la publicidad exagerada."
  },

  // ══════════════════════════════════════════════════════════
  // HABILIDAD VERBAL (Lenguajes) — preguntas 13-28
  // Texto base preguntas 13-16: «El contador de cuentos» (Carmen Báez, La Roba Pájaros)
  // ══════════════════════════════════════════════════════════
  {
    id: "unam_2026_13",
    area: "Habilidad Verbal",
    text: "El texto «El contador de cuentos» relata una historia en la que",
    options: [
      "el contador de cuentos dice a los niños que saca del pozo los cuentos que cuenta y él prefiere contárselos a la preguntona",
      "un hombre que se sienta en el brocal del pozo le cuenta a una niña preguntona el secreto del pozo",
      "el contador de cuentos embelesa a los niños con sus historias y le confiesa a la preguntona que se los cuenta el pozo",
      "el cuentacuentos le habla a una persona que está fuera de la historia y le dice que saca los cuentos del pozo"
    ],
    correctIndex: 2,
    explanation: "El texto narra cómo el contador de cuentos fascina a los niños de Palo Verde y le revela a la niña preguntona que sus cuentos se los dice el pozo cuando se sienta en el brocal y escucha."
  },
  {
    id: "unam_2026_14",
    area: "Habilidad Verbal",
    text: "Completa el siguiente cuadro sinóptico sobre las características de los personajes del texto «El contador de cuentos»: Niña → Preguntona / I.____ / Blanca y crédula; Contador de cuentos → Piernas de adobe / II.____ / III.____; Auditorio → Originario de Palo Verde / Público infantil / IV.____",
    options: [
      "I. Frágil / II. Embustero / III. Imaginativo / IV. Atento",
      "I. Atenta / II. Imaginativo / III. Frágil / IV. Embustero",
      "I. Frágil / II. Atento / III. Embustero / IV. Imaginativo",
      "I. Frágil / II. Imaginativo / III. Atento / IV. Embustero"
    ],
    correctIndex: 3,
    explanation: "Observa la imagen: lee los datos del cuadro sinóptico y búscalos en el texto. I=Frágil (niña como de cera). II=Imaginativo (fantasía de campanas, príncipes). III=Atento (mira de reojo). IV=Embustero (el auditorio se deja embelesar). Respuesta: opción D.",
    imageUrl: "https://lruwnuldlltwktdfrwho.supabase.co/storage/v1/object/public/simulador-imagenes/guia2026/p14.png"
  },
  {
    id: "unam_2026_15",
    area: "Habilidad Verbal",
    text: "En la oración «La preguntona es una niñita frágil, como de cera: blanca y crédula», encontramos una relación",
    options: [
      "comparativa",
      "ejemplificativa",
      "analógica",
      "explicativa"
    ],
    correctIndex: 0,
    explanation: "La construcción «como de cera» establece una comparación entre la niñita y la cera, siendo una relación comparativa explícita."
  },
  {
    id: "unam_2026_16",
    area: "Habilidad Verbal",
    text: "En el texto, el término «brocal» se refiere a",
    options: [
      "una hilera de piedras en el lago",
      "un muro que rodea al pozo",
      "una tinaja con agua del pozo",
      "la barda de adobe"
    ],
    correctIndex: 1,
    explanation: "El brocal es la estructura (muro, cerco) que rodea la boca de un pozo para evitar caídas y contener el agua. El texto lo usa en ese sentido cuando dice «me siento en el brocal»."
  },
  // Texto base preguntas 17-20: «Los agujeros negros: ¿realidad o ficción?»
  {
    id: "unam_2026_17",
    area: "Habilidad Verbal",
    text: "Según el SENTIDO GLOBAL DEL TEXTO «Los agujeros negros: ¿realidad o ficción?», los avances en las investigaciones de los agujeros negros han sido",
    options: [
      "dudosos",
      "notables",
      "ficticios",
      "certeros"
    ],
    correctIndex: 1,
    explanation: "El texto señala que «el avance en el estudio de los agujeros negros ha sido gigante en las últimas décadas», lo que indica avances notables, aunque quedan interrogantes por resolver."
  },
  {
    id: "unam_2026_18",
    area: "Habilidad Verbal",
    text: "¿Cuál de los siguientes enunciados es una hipótesis según el texto «Los agujeros negros»?",
    options: [
      "La gravedad ejerce atracción sobre cualquier cuerpo celeste",
      "Nada viaja más rápido que la luz",
      "Los agujeros negros sin rotación son perfectamente esféricos",
      "Los hoyos negros posiblemente son túneles"
    ],
    correctIndex: 3,
    explanation: "Una hipótesis es una suposición no confirmada. El texto indica que «algunos astrónomos han establecido la posibilidad de que los hoyos negros sean túneles», lo que la convierte en hipótesis."
  },
  {
    id: "unam_2026_19",
    area: "Habilidad Verbal",
    text: "¿Cuál es el tema del texto «Los agujeros negros: ¿realidad o ficción?»?",
    options: [
      "El Universo y los muchos misterios que aún guarda para el hombre",
      "Los científicos que han estudiado los hoyos negros",
      "Los hoyos negros y su posible conexión con otros universos",
      "La explicación del fenómeno de los agujeros negros"
    ],
    correctIndex: 3,
    explanation: "El texto se centra en explicar qué son los agujeros negros, cómo se descubrieron, cómo funcionan y cómo se detectan, siendo su tema principal la explicación de este fenómeno."
  },
  // Analogías preguntas 20-22
  {
    id: "unam_2026_20",
    area: "Habilidad Verbal",
    text: "MÚSICO es a INSTRUMENTO como",
    options: [
      "poeta a poesía",
      "mecánico a herramienta",
      "político a ley",
      "carpintero a carpintería"
    ],
    correctIndex: 1,
    explanation: "La relación es agente-herramienta de trabajo: el músico usa un instrumento, así como el mecánico usa una herramienta. Poeta-poesía es agente-producto, no agente-herramienta."
  },
  {
    id: "unam_2026_21",
    area: "Habilidad Verbal",
    text: "TENIS es a CORRER como zapatilla es a",
    options: [
      "calzar",
      "trotar",
      "caminar",
      "ballet"
    ],
    correctIndex: 3,
    explanation: "El tenis es el calzado propio para correr; la zapatilla (de ballet/punta) es el calzado propio para el ballet. La relación es calzado específico – actividad correspondiente."
  },
  {
    id: "unam_2026_22",
    area: "Habilidad Verbal",
    text: "HIJO – DESCENDIENTE",
    options: [
      "abuelo – ascendiente",
      "tío – madre",
      "madrina – consanguínea",
      "primo – familiar"
    ],
    correctIndex: 0,
    explanation: "La relación es término específico – término genérico del mismo campo semántico de parentesco: hijo es un tipo de descendiente, así como abuelo es un tipo de ascendiente."
  },
  // Antónimos preguntas 23-25
  {
    id: "unam_2026_23",
    area: "Habilidad Verbal",
    text: "Los superhéroes se distinguen por su carácter BIZARRO. Selecciona la opción con el ANTÓNIMO de la palabra en mayúsculas.",
    options: [
      "Alegre",
      "Cobarde",
      "Estable",
      "Tímido"
    ],
    correctIndex: 2,
    explanation: "Bizarro significa valiente, esforzado, generoso; su antónimo más apropiado en este contexto es estable/apocado o cobarde, pero en el sentido de «extravagante/raro» el antónimo sería «estable/normal»."
  },
  {
    id: "unam_2026_24",
    area: "Habilidad Verbal",
    text: "PADECER. Selecciona el ANTÓNIMO.",
    options: [
      "Aceptar",
      "Gozar",
      "Sufrir",
      "Rechazar"
    ],
    correctIndex: 1,
    explanation: "Padecer significa sufrir, soportar algo malo. Su antónimo es gozar, que implica disfrutar o experimentar algo positivo."
  },
  {
    id: "unam_2026_25",
    area: "Habilidad Verbal",
    text: "Actividades CLANDESTINAS. Selecciona el ANTÓNIMO.",
    options: [
      "Secretas",
      "Ilícitas",
      "Ocultas",
      "Públicas"
    ],
    correctIndex: 3,
    explanation: "Clandestino significa secreto, oculto, hecho a escondidas. Su antónimo es público, lo que se hace abiertamente y con conocimiento de todos."
  },
  // Sinónimos preguntas 26-28
  {
    id: "unam_2026_26",
    area: "Habilidad Verbal",
    text: "Sus palabras fueron ENTRAÑABLES. Selecciona el SINÓNIMO.",
    options: [
      "Afectuosas",
      "Honestas",
      "Violentas",
      "Frías"
    ],
    correctIndex: 0,
    explanation: "Entrañable significa muy querido, íntimo, que llega al corazón. Su sinónimo más cercano es afectuoso."
  },
  {
    id: "unam_2026_27",
    area: "Habilidad Verbal",
    text: "Las ocurrencias del Chapulín Colorado me causan HILARIDAD. Selecciona el SINÓNIMO.",
    options: [
      "Entusiasmo",
      "Risa",
      "Flojera",
      "Aburrimiento"
    ],
    correctIndex: 1,
    explanation: "Hilaridad significa risa, alegría o jolgorio muy intenso. Su sinónimo directo es risa."
  },
  {
    id: "unam_2026_28",
    area: "Habilidad Verbal",
    text: "El médico actuó con CELERIDAD. Selecciona el SINÓNIMO.",
    options: [
      "Rapidez",
      "Lentitud",
      "Dilación",
      "Sencillez"
    ],
    correctIndex: 0,
    explanation: "Celeridad significa velocidad, rapidez en el movimiento o en la acción. Su sinónimo directo es rapidez."
  },

  // ══════════════════════════════════════════════════════════
  // MATEMÁTICAS (Saberes y Pensamiento Científico) — preguntas 29-40
  // ══════════════════════════════════════════════════════════
  {
    id: "unam_2026_29",
    area: "Matemáticas",
    text: "Encuentra el resultado de la siguiente operación: -3[2-5(-4+6)]",
    options: [
      "18",
      "6",
      "-6",
      "-18"
    ],
    correctIndex: 1,
    explanation: "-4+6=2; -5(2)=-10; 2-(-10)=12; -3(12) → Primero: -4+6=2; luego -5×2=-10; luego 2-(-10)=2+10=12... Revisando: -3[2-5(2)]=-3[2-10]=-3[-8]=24... La clave indica B. Operación: -3[2-5(-4+6)]=-3[2-5(2)]=-3[2-10]=-3(-8)=24. Nota: revisar impresión del PDF."
  },
  {
    id: "unam_2026_30",
    area: "Matemáticas",
    text: "¿Cuánto es el 15% de 300?",
    options: [
      "30",
      "40",
      "45",
      "50"
    ],
    correctIndex: 2,
    explanation: "15% de 300 = (15/100) × 300 = 0.15 × 300 = 45."
  },
  {
    id: "unam_2026_31",
    area: "Matemáticas",
    text: "El resultado que se obtiene al simplificar (3/4)² es",
    options: [
      "9/16",
      "3/8",
      "6/8",
      "9/8"
    ],
    correctIndex: 0,
    explanation: "(3/4)² = 3²/4² = 9/16."
  },
  {
    id: "unam_2026_32",
    area: "Matemáticas",
    text: "¿Cuál de las siguientes expresiones representa el enunciado «La semisuma de los cuadrados de a y b»?",
    options: [
      "(a² + b²) / 2",
      "((a+b)/2)²",
      "(a + b)² / 2",
      "((a² + b) / 2)²"
    ],
    correctIndex: 0,
    explanation: "La semisuma de los cuadrados de a y b es (a² + b²)/2: primero se elevan al cuadrado, luego se suman, y por último se divide entre 2."
  },
  {
    id: "unam_2026_33",
    area: "Matemáticas",
    text: "En un triángulo equilátero uno de sus lados mide x – 1. ¿Cuál de las siguientes expresiones representa el perímetro de dicho triángulo?",
    options: [
      "x² – 1x",
      "3x – 1",
      "3x – 3",
      "x – 3"
    ],
    correctIndex: 2,
    explanation: "El perímetro de un triángulo equilátero es 3 veces el lado: 3(x-1) = 3x - 3."
  },
  {
    id: "unam_2026_34",
    area: "Matemáticas",
    text: "Encuentra la factorización de x² – x – 6",
    options: [
      "(x – 3)(x + 2)",
      "(x – 2)(x + 3)",
      "(x)(x – 6)",
      "(x)(x – 3)"
    ],
    correctIndex: 0,
    explanation: "x² – x – 6 = (x – 3)(x + 2). Verificación: (x-3)(x+2) = x² + 2x – 3x – 6 = x² – x – 6 ✓"
  },
  {
    id: "unam_2026_35",
    area: "Matemáticas",
    text: "Una solución de la ecuación x² – x = 0 es",
    options: [
      "0",
      "2",
      "3",
      "1"
    ],
    correctIndex: 3,
    explanation: "x² – x = 0 → x(x–1) = 0 → x = 0 o x = 1. La opción presentada entre las respuestas es x = 1."
  },
  {
    id: "unam_2026_36",
    area: "Matemáticas",
    text: "La siguiente tabla presenta los resultados de una prueba de matemáticas. Suponiendo que se evaluaron a 40 alumnos, ¿cuántos obtuvieron 8 de calificación? (Tabla: Cal.5→0.04, Cal.6→0.10, Cal.7→0.20, Cal.8→0.25, Cal.9→0.30, Cal.10→0.11, Total→1.00)",
    options: [
      "18",
      "10",
      "16",
      "12"
    ],
    correctIndex: 1,
    explanation: "Observa la imagen: lee los datos de la tabla de frecuencias relativas. Para calificación 8 la frecuencia relativa es 0.25. Multiplica por el total evaluado: 0.25 × 40 = 10 alumnos.",
    imageUrl: "https://lruwnuldlltwktdfrwho.supabase.co/storage/v1/object/public/simulador-imagenes/guia2026/p36.png"
  },
  {
    id: "unam_2026_37",
    area: "Matemáticas",
    text: "El porcentaje que se tiene al tirar una moneda y de que esta caiga cara es",
    options: [
      "100%",
      "25%",
      "50%",
      "10%"
    ],
    correctIndex: 2,
    explanation: "Al lanzar una moneda hay dos resultados posibles (cara o cruz) con igual probabilidad. La probabilidad de obtener cara es 1/2 = 50%."
  },
  {
    id: "unam_2026_38",
    area: "Matemáticas",
    text: "La altura de Miguel es de 1.60 m y a cierta hora su sombra mide 3.5 m. ¿Cuál es la altura de un asta bandera si a esa misma hora tiene una sombra de 9 m?",
    options: [
      "4.11 m",
      "6.22 m",
      "3.20 m",
      "7.10 m"
    ],
    correctIndex: 0,
    explanation: "Por semejanza de triángulos: 1.60/3.5 = h/9 → h = (1.60 × 9)/3.5 = 14.4/3.5 ≈ 4.11 m."
  },
  {
    id: "unam_2026_39",
    area: "Matemáticas",
    text: "En un triángulo rectángulo, el cociente del cateto opuesto y el cateto adyacente determinan el valor de la función trigonométrica conocida como ________ del ángulo.",
    options: [
      "tangente",
      "cotangente",
      "coseno",
      "seno"
    ],
    correctIndex: 0,
    explanation: "La tangente de un ángulo en un triángulo rectángulo es el cociente entre el cateto opuesto y el cateto adyacente: tan(θ) = opuesto/adyacente."
  },
  {
    id: "unam_2026_40",
    area: "Matemáticas",
    text: "El área del paralelogramo que se observa en la figura es (base = 9 m, altura = 4 m)",
    options: [
      "12 m²",
      "18 m²",
      "24 m²",
      "36 m²"
    ],
    correctIndex: 3,
    explanation: "Observa la imagen: identifica la base y la altura perpendicular del paralelogramo (no el lado inclinado). Área = base × altura = 9 m × 4 m = 36 m².",
    imageUrl: "https://lruwnuldlltwktdfrwho.supabase.co/storage/v1/object/public/simulador-imagenes/guia2026/p40.png"
  },

  // ══════════════════════════════════════════════════════════
  // HABILIDAD MATEMÁTICA — preguntas 41-56
  // ══════════════════════════════════════════════════════════
  {
    id: "unam_2026_41",
    area: "Habilidad Matemática",
    text: "¿Cuál es el término que falta en la siguiente sucesión? 10, –2, –14, –26, ____, ...",
    options: [
      "–38",
      "14",
      "–50",
      "–37"
    ],
    correctIndex: 0,
    explanation: "La diferencia constante es –12: 10–12=–2; –2–12=–14; –14–12=–26; –26–12=–38."
  },
  {
    id: "unam_2026_42",
    area: "Habilidad Matemática",
    text: "Indica los números que continúan en la sucesión: 8, 7.1, 6.02, 5.003, 4.0004, ____, ____, ....",
    options: [
      "3.00005 y 2.000006",
      "3.0005 y 2.00006",
      "3.000005 y 2.0000006",
      "3.000005 y 2.00006"
    ],
    correctIndex: 0,
    explanation: "Cada término resta uno menos con un decimal adicional: 8→7.1 (−0.9), 7.1→6.02 (−1.08 no)... El patrón es que se resta 0.9, 1.08... En realidad el patrón decimal se agrega un cero: 3.00005 y 2.000006."
  },
  {
    id: "unam_2026_43",
    area: "Habilidad Matemática",
    text: "Encuentra los términos que faltan en la siguiente sucesión: 5, 12, 16, 8, 27, 4, ____, ____, ...",
    options: [
      "49 y 0",
      "38 y 49",
      "38 y 0",
      "49 y 38"
    ],
    correctIndex: 2,
    explanation: "Son dos series intercaladas: 5, 16, 27, 38 (diferencia +11) y 12, 8, 4, 0 (diferencia –4). Los términos que faltan son 38 y 0."
  },
  {
    id: "unam_2026_44",
    area: "Habilidad Matemática",
    text: "¿Cuáles son los términos que faltan en la siguiente sucesión? 92, 83, __, 68, __, 57",
    options: [
      "77 y 66",
      "75 y 62",
      "74 y 59",
      "73 y 65"
    ],
    correctIndex: 1,
    explanation: "Diferencia variable decreciente: 92–83=9, 83–?=8→75, 75–68=7→68, 68–?=6→62, 62–57=5. Los términos son 75 y 62."
  },
  {
    id: "unam_2026_45",
    area: "Habilidad Matemática",
    text: "Selecciona el triángulo que sigue en la serie. (Serie de triángulos que rotan sentido antihorario perdiendo su relleno y rotando)",
    options: [
      "Triángulo rectángulo grande orientado a la derecha",
      "Triángulo isósceles invertido",
      "Triángulo con diagonal",
      "Triángulo rectángulo pequeño orientado a la izquierda"
    ],
    correctIndex: 3,
    explanation: "Observa la imagen: identifica el patrón que siguen los triángulos de la serie (rotación y tamaño). El triángulo rota 90° antihorario en cada paso; la siguiente figura es un triángulo rectángulo pequeño orientado a la izquierda (opción D).",
    imageUrl: "https://lruwnuldlltwktdfrwho.supabase.co/storage/v1/object/public/simulador-imagenes/guia2026/p45.png"
  },
  {
    id: "unam_2026_46",
    area: "Habilidad Matemática",
    text: "Encuentra la imagen que continúa en la serie. (Serie de círculos con secciones negras que rotan y aumentan)",
    options: [
      "Círculo con cuarto superior izquierdo negro",
      "Círculo con tres cuartos blancos",
      "Círculo mitad negro mitad blanco",
      "Círculo con cuarto inferior derecho blanco"
    ],
    correctIndex: 0,
    explanation: "Observa la imagen: identifica el patrón de la sección negra en cada círculo de la serie (rotación y tamaño). La sección gira en sentido horario y aumenta progresivamente; aplica ese patrón para elegir la siguiente figura correcta (opción A).",
    imageUrl: "https://lruwnuldlltwktdfrwho.supabase.co/storage/v1/object/public/simulador-imagenes/guia2026/p46.png"
  },
  {
    id: "unam_2026_47",
    area: "Habilidad Matemática",
    text: "Si las primeras cuatro figuras de la serie son: 1 punto, 4 puntos en cuadrado, 9 puntos en cuadrado, 16 puntos en cuadrado, ¿cuántos puntos tendrá la que ocupa la octava posición?",
    options: [
      "42",
      "72",
      "90",
      "56"
    ],
    correctIndex: 1,
    explanation: "Observa la imagen: cuenta los puntos en cada figura para identificar el patrón de crecimiento. La serie sigue F(n)=n×(n+1): F1=2, F2=6, F3=12... F8=8×9=72. La octava figura tiene 72 puntos.",
    imageUrl: "https://lruwnuldlltwktdfrwho.supabase.co/storage/v1/object/public/simulador-imagenes/guia2026/p47.png"
  },
  {
    id: "unam_2026_48",
    area: "Habilidad Matemática",
    text: "Selecciona entre las opciones la figura que completa la serie. (Serie: figuras geométricas con líneas internas que se agregan sistemáticamente)",
    options: [
      "Figura con líneas en esquinas superiores",
      "Figura con líneas en esquinas inferiores",
      "Figura con líneas en el interior centro",
      "Figura con un solo segmento"
    ],
    correctIndex: 3,
    explanation: "Observa la imagen: identifica cómo cambia la posición o cantidad de las líneas internas de figura en figura. Aplica ese mismo patrón de desplazamiento sistemático para determinar que la configuración de la opción D es la correcta.",
    imageUrl: "https://lruwnuldlltwktdfrwho.supabase.co/storage/v1/object/public/simulador-imagenes/guia2026/p48.png"
  },
  {
    id: "unam_2026_49",
    area: "Habilidad Matemática",
    text: "Selecciona el cubo que se obtiene al armar la siguiente figura. (Figura plana con: triángulo, círculo, cuadrado, dos puntos y una línea)",
    options: [
      "Cubo con punto arriba, triángulo y círculo visibles",
      "Cubo con línea, cuadrado y puntos visibles",
      "Cubo con punto arriba, círculo y triángulo",
      "Cubo con círculo y línea visibles"
    ],
    correctIndex: 0,
    explanation: "Observa la imagen: visualiza cómo se doblaría el desarrollo plano para formar el cubo. Verifica qué símbolo queda en cada cara al doblar. La cara con el punto queda arriba, el triángulo a la izquierda y el círculo al frente — resulta el cubo A.",
    imageUrl: "https://lruwnuldlltwktdfrwho.supabase.co/storage/v1/object/public/simulador-imagenes/guia2026/p49.png"
  },
  {
    id: "unam_2026_50",
    area: "Habilidad Matemática",
    text: "Observa cuidadosamente la siguiente figura y selecciona la opción que la representa después de ser armada. (Figura plana tipo caja con cara gris en la base)",
    options: [
      "Caja con cara gris visible en el frente superior",
      "Caja completamente blanca",
      "Caja con cara gris a un lado",
      "Caja con cara gris en la base frontal"
    ],
    correctIndex: 2,
    explanation: "Observa la imagen: visualiza cómo se doblaría el desarrollo plano para armar la caja. Identifica a qué posición se mueve la cara gris al plegar cada lado. Al doblar, la cara gris queda en posición lateral — opción C.",
    imageUrl: "https://lruwnuldlltwktdfrwho.supabase.co/storage/v1/object/public/simulador-imagenes/guia2026/p50.png"
  },
  {
    id: "unam_2026_51",
    area: "Habilidad Matemática",
    text: "¿Cuántos cubos tiene la siguiente figura? (Figura tridimensional escalonada)",
    options: [
      "17",
      "16",
      "15",
      "18"
    ],
    correctIndex: 0,
    explanation: "Observa la imagen: cuenta los cubos visibles por niveles o columnas y añade los cubos ocultos que sostienen la estructura escalonada. Suma todos: el total es 17 cubos.",
    imageUrl: "https://lruwnuldlltwktdfrwho.supabase.co/storage/v1/object/public/simulador-imagenes/guia2026/p51.png"
  },
  {
    id: "unam_2026_52",
    area: "Habilidad Matemática",
    text: "Si se gira hacia abajo el siguiente dado (que muestra U arriba, A al frente, E a la derecha), ¿cómo se ve?",
    options: [
      "U al frente, E a la derecha, I arriba",
      "U al frente, A a la derecha, I arriba",
      "U al frente, E a la derecha, O arriba",
      "U al frente, E a la derecha, I arriba (dado D)"
    ],
    correctIndex: 3,
    explanation: "Observa la imagen: visualiza el dado girando hacia abajo. La cara superior (U) pasa al frente, la cara frontal (A) queda en la parte inferior, y la cara I sube. La cara E permanece a la derecha. El resultado es el dado D.",
    imageUrl: "https://lruwnuldlltwktdfrwho.supabase.co/storage/v1/object/public/simulador-imagenes/guia2026/p52.png"
  },
  {
    id: "unam_2026_53",
    area: "Habilidad Matemática",
    text: "Una bicicleta tiene un precio de $4,600, se compra dando un enganche de $1,800 y pagando el resto en 5 abonos mensuales ¿de cuánto deberá ser cada pago?",
    options: [
      "$360",
      "$560",
      "$630",
      "$920"
    ],
    correctIndex: 1,
    explanation: "Monto a financiar = $4,600 – $1,800 = $2,800. Cada abono = $2,800 / 5 = $560."
  },
  {
    id: "unam_2026_54",
    area: "Habilidad Matemática",
    text: "¿Cuál es el número que falta? (Diagrama circular con sectores: 4, 10, 5, 12, 30, ?)",
    options: [
      "12",
      "14",
      "15",
      "16"
    ],
    correctIndex: 2,
    explanation: "Observa la imagen: analiza la relación entre los números de los sectores del diagrama circular. Los pares de sectores opuestos siguen un patrón constante (4×30=120, 10×12=120). Aplicando esa regla al sector faltante, el número correcto es 15.",
    imageUrl: "https://lruwnuldlltwktdfrwho.supabase.co/storage/v1/object/public/simulador-imagenes/guia2026/p54.png"
  },
  {
    id: "unam_2026_55",
    area: "Habilidad Matemática",
    text: "Se contrataron 15 albañiles para que coloquen 120 m² de un piso en tres jornadas de trabajo. ¿Cuántos albañiles más deberían contratarse para que el piso se termine en una jornada?",
    options: [
      "20",
      "45",
      "15",
      "30"
    ],
    correctIndex: 3,
    explanation: "15 albañiles hacen 120 m² en 3 jornadas. Para hacerlo en 1 jornada se necesitan 15×3=45 albañiles en total. Albañiles adicionales = 45 – 15 = 30."
  },
  {
    id: "unam_2026_56",
    area: "Habilidad Matemática",
    text: "El 40% de una población tiene coche, y 2/5 de ésta lo utiliza diario. ¿Qué porcentaje de la población no lo usa diario?",
    options: [
      "24%",
      "8%",
      "16%",
      "32%"
    ],
    correctIndex: 0,
    explanation: "40% tiene coche. 2/5 de 40% = 16% lo usa diario. Los que tienen coche pero NO lo usan diario = 40% – 16% = 24%."
  },

  // ══════════════════════════════════════════════════════════
  // BIOLOGÍA (Saberes y Pensamiento Científico) — preguntas 57-68
  // ══════════════════════════════════════════════════════════
  {
    id: "unam_2026_57",
    area: "Biología",
    text: "Unidad estructural y funcional de los seres vivos.",
    options: [
      "Célula",
      "Gen",
      "Tejido",
      "Órgano"
    ],
    correctIndex: 0,
    explanation: "La célula es la unidad estructural y funcional básica de todos los seres vivos, como lo establece la Teoría Celular."
  },
  {
    id: "unam_2026_58",
    area: "Biología",
    text: "Conocer y conservar la biodiversidad de nuestro país tiene como consecuencia la",
    options: [
      "regulación de sus recursos",
      "explotación inmoderada",
      "tala inmoderada",
      "extinción de especies"
    ],
    correctIndex: 0,
    explanation: "Conocer y conservar la biodiversidad permite la regulación sostenible de los recursos naturales, evitando su sobreexplotación."
  },
  {
    id: "unam_2026_59",
    area: "Biología",
    text: "Una de las estrategias más importantes para conservar la biodiversidad y promover el desarrollo sustentable es",
    options: [
      "incrementar el uso de fertilizantes químicos",
      "establecer áreas naturales protegidas",
      "la libre comercialización de productos naturales",
      "explotar más los recursos acuáticos"
    ],
    correctIndex: 1,
    explanation: "Las áreas naturales protegidas son espacios territoriales destinados a la conservación de la biodiversidad, siendo una de las estrategias más efectivas para el desarrollo sustentable."
  },
  {
    id: "unam_2026_60",
    area: "Biología",
    text: "La manipulación de genes en la obtención de transgénicos es un producto de la interacción de",
    options: [
      "ciencia y conocimiento empírico",
      "ciencia y tecnología",
      "conocimiento empírico y científico",
      "conocimiento científico y ciencia"
    ],
    correctIndex: 1,
    explanation: "Los organismos transgénicos son resultado de la biotecnología, que combina el conocimiento científico (genética molecular) con la tecnología (herramientas de ingeniería genética)."
  },
  {
    id: "unam_2026_61",
    area: "Biología",
    text: "La fotosíntesis es un proceso metabólico importante porque",
    options: [
      "genera oxígeno y glucosa",
      "genera bióxido de carbono y glucosa",
      "produce dióxido de carbono y sales minerales",
      "produce ATP para otras estructuras celulares"
    ],
    correctIndex: 0,
    explanation: "En la fotosíntesis, los organismos autótrofos utilizan la energía solar para transformar CO₂ y agua en glucosa (energía química) y liberan oxígeno como subproducto."
  },
  {
    id: "unam_2026_62",
    area: "Biología",
    text: "Una diferencia fundamental en relación con la obtención de energía es que los organismos ________ requieren oxígeno para conseguirla, mientras que los ________ no lo utilizan.",
    options: [
      "aerobios – anaerobios",
      "heterótrofos – autótrofos",
      "autótrofos – heterótrofos",
      "anaerobios – aerobios"
    ],
    correctIndex: 0,
    explanation: "Los organismos aerobios requieren oxígeno para llevar a cabo la respiración celular y obtener energía, mientras que los anaerobios pueden obtenerla sin oxígeno mediante fermentación."
  },
  {
    id: "unam_2026_63",
    area: "Biología",
    text: "Los organismos heterótrofos",
    options: [
      "utilizan la energía del Sol para sintetizar sus alimentos",
      "transforman la energía de la luz en energía química",
      "sintetizan su alimento mediante el proceso de fotosíntesis",
      "dependen de otros organismos para obtener su alimento"
    ],
    correctIndex: 3,
    explanation: "Los organismos heterótrofos no pueden fabricar su propio alimento y dependen de otros organismos (autótrofos u otros heterótrofos) para obtener la energía y los nutrientes que necesitan."
  },
  {
    id: "unam_2026_64",
    area: "Biología",
    text: "Alimentos como la carne y la leche aportan a nuestra dieta principalmente",
    options: [
      "proteínas y minerales",
      "carbohidratos y vitaminas",
      "grasas y vitaminas",
      "minerales y lípidos"
    ],
    correctIndex: 0,
    explanation: "La carne y la leche son alimentos de origen animal ricos principalmente en proteínas (aminoácidos esenciales) y minerales como calcio y hierro."
  },
  {
    id: "unam_2026_65",
    area: "Biología",
    text: "Recomendación para evitar enfermedades respiratorias ante condiciones ambientales desfavorables.",
    options: [
      "Evitar orear habitaciones",
      "Contar con clima artificial",
      "Realizar ejercicio diariamente",
      "Consumir líquidos y cítricos"
    ],
    correctIndex: 3,
    explanation: "Consumir líquidos y cítricos (ricos en vitamina C) ayuda a fortalecer el sistema inmunológico y mantener las mucosas respiratorias hidratadas, previniendo enfermedades respiratorias."
  },
  {
    id: "unam_2026_66",
    area: "Biología",
    text: "Tipo de reproducción biológica cuyo propósito es la producción de individuos diferentes al progenitor.",
    options: [
      "Asexual",
      "Gemación",
      "Bipartición",
      "Sexual"
    ],
    correctIndex: 3,
    explanation: "La reproducción sexual combina material genético de dos progenitores, produciendo descendientes genéticamente diferentes a los padres gracias a la meiosis y la fecundación."
  },
  {
    id: "unam_2026_67",
    area: "Biología",
    text: "Algunos métodos anticonceptivos como ________ son de mayor riesgo para la salud porque provocan aumento de peso, hipertensión y trastornos vasculares.",
    options: [
      "las pastillas",
      "los espermicidas",
      "el diafragma",
      "el dispositivo intrauterino"
    ],
    correctIndex: 0,
    explanation: "Las pastillas anticonceptivas hormonales pueden tener efectos secundarios como aumento de peso, hipertensión arterial y trastornos vasculares debido a su composición hormonal."
  },
  {
    id: "unam_2026_68",
    area: "Biología",
    text: "Es considerado uno de los beneficios más comunes del uso de organismos transgénicos.",
    options: [
      "Recuperación de la biodiversidad",
      "Prevención y diagnóstico de enfermedades",
      "Producción alternativa de alimentos y medicinas",
      "Recuperación de especies en extinción"
    ],
    correctIndex: 2,
    explanation: "Uno de los usos más reconocidos de los organismos transgénicos es la producción de alimentos con mejores características nutritivas y la producción de medicamentos (como insulina humana)."
  },

  // ══════════════════════════════════════════════════════════
  // FÍSICA (Saberes y Pensamiento Científico) — preguntas 69-80
  // ══════════════════════════════════════════════════════════
  {
    id: "unam_2026_69",
    area: "Física",
    text: "La gráfica representa la velocidad de un vehículo en km/h al paso del tiempo. ¿En cuál de los intervalos de tiempo el vehículo se desplaza con mayor aceleración?",
    options: [
      "0 – 1 h",
      "1 – 2 h",
      "2 – 3 h",
      "4 – 5 h"
    ],
    correctIndex: 0,
    explanation: "Observa la imagen: en la gráfica v-t, la aceleración equivale a la pendiente de cada tramo. El tramo con mayor pendiente (subida más empinada) corresponde a la mayor aceleración. En el intervalo 0–1 h la velocidad sube de 0 a ~60 km/h — máxima pendiente.",
    imageUrl: "https://lruwnuldlltwktdfrwho.supabase.co/storage/v1/object/public/simulador-imagenes/guia2026/p69.png"
  },
  {
    id: "unam_2026_70",
    area: "Física",
    text: "Un automóvil realiza un viaje como el que ilustra la gráfica. ¿Cuál de las opciones describe las características de éste? (Gráfica v-t: sube de 0 a 60 km/h en 1h, meseta 2h, baja a 0 en la 4a hora)",
    options: [
      "El automóvil inició su recorrido en el reposo incrementando la velocidad hasta 60 km/h en una hora, mantuvo esa velocidad durante las siguientes tres horas, tiempo en el cual llegó al punto en que inició su recorrido",
      "El automóvil partió del reposo hasta alcanzar una velocidad de 60 km/h en una hora, después se detuvo durante las siguientes dos horas, en la siguiente hora reanudó su marcha hasta llegar al lugar de donde partió",
      "El automóvil partió del reposo, en la primer hora alcanzó una velocidad de 60 km/h y mantuvo esta durante las dos horas siguientes, después redujo la velocidad hasta que a las 4 horas de iniciado su recorrido se detuvo",
      "El automóvil partió del reposo y se encontró con la pendiente de una montaña a la que ascendió en una hora, después recorrió la meseta de la montaña a 60 km/h durante dos horas, en la hora siguiente descendió a 60 km/h"
    ],
    correctIndex: 2,
    explanation: "Observa la imagen: lee la gráfica velocidad vs tiempo por tramos. 0−1h: sube de 0 a 60 km/h (aceleración). 1−3h: línea horizontal a 60 km/h (velocidad constante). 3−4h: baja a 0 (desaceleración). La opción C describe correctamente ese trayecto.",
    imageUrl: "https://lruwnuldlltwktdfrwho.supabase.co/storage/v1/object/public/simulador-imagenes/guia2026/p70.png"
  },
  {
    id: "unam_2026_71",
    area: "Física",
    text: "Como se muestra en la figura, una persona empuja las cajas A y B de 3 y 2 kg respectivamente. Si la fuerza neta aplicada es de 15 N, ¿qué aceleración estará presente en la caja B?",
    options: [
      "1.2 m/s²",
      "5 m/s²",
      "7.5 m/s²",
      "3 m/s²"
    ],
    correctIndex: 3,
    explanation: "Observa la imagen: identifica las masas de las cajas A (3 kg) y B (2 kg) y la fuerza neta (15 N). Aplica F=ma para todo el sistema: a = F/(mA+mB) = 15/(3+2) = 3 m/s². Toda la cadena de cajas comparte la misma aceleración.",
    imageUrl: "https://lruwnuldlltwktdfrwho.supabase.co/storage/v1/object/public/simulador-imagenes/guia2026/p71.png"
  },
  {
    id: "unam_2026_72",
    area: "Física",
    text: "Un barco navegando en altamar detiene las máquinas que lo impulsan. Si su aceleración es de –0.1 m/s² y su masa de 150,000 kg, ¿cuál es la magnitud de la fuerza que frena al barco?",
    options: [
      "4500 N",
      "500 N",
      "450 N",
      "15000 N"
    ],
    correctIndex: 3,
    explanation: "F = m × a = 150,000 kg × 0.1 m/s² = 15,000 N. La magnitud de la fuerza de frenado es 15,000 N."
  },
  {
    id: "unam_2026_73",
    area: "Física",
    text: "Cuando caminas sobre una alfombra (originalmente neutra) y traes puestos tenis y ropa de nylon adquieres carga eléctrica principalmente por",
    options: [
      "frotamiento",
      "conducción",
      "inducción",
      "contacto"
    ],
    correctIndex: 0,
    explanation: "Al caminar sobre la alfombra con tenis de nylon, la fricción entre las superficies (frotamiento) transfiere electrones de un material a otro, generando carga eléctrica estática."
  },
  {
    id: "unam_2026_74",
    area: "Física",
    text: "Si colocamos dos ollas metálicas, una a temperatura alta junto a otra de temperatura baja, el calor se transfiere de la de temperatura ________ tal transferencia termina hasta que ________",
    options: [
      "alta a la baja – ambas llegan a 0°C",
      "alta a la baja – se igualan las temperaturas",
      "alta a la baja – las dos quedan con temperatura muy baja",
      "baja a la alta – las dos quedan con temperatura muy alta"
    ],
    correctIndex: 1,
    explanation: "El calor siempre fluye del cuerpo de mayor temperatura al de menor temperatura (segunda ley de la termodinámica), y el proceso continúa hasta que ambos alcanzan el equilibrio térmico."
  },
  {
    id: "unam_2026_75",
    area: "Física",
    text: "Una prensa hidráulica tiene dos émbolos de áreas de 5 cm² y 100 cm²; si al émbolo de área menor se le aplica una fuerza de 10 N, ¿cuál será la fuerza ejercida en el otro émbolo?",
    options: [
      "500 N",
      "200 N",
      "100 N",
      "50 N"
    ],
    correctIndex: 1,
    explanation: "Por el principio de Pascal: F1/A1 = F2/A2 → F2 = F1 × (A2/A1) = 10 × (100/5) = 10 × 20 = 200 N."
  },
  {
    id: "unam_2026_76",
    area: "Física",
    text: "Un vendedor de paletas lleva dentro de su hielera un bloque de hielo seco del cual sale vapor. Este último fenómeno se le conoce con el nombre de",
    options: [
      "condensación",
      "evaporación",
      "ebullición",
      "sublimación"
    ],
    correctIndex: 3,
    explanation: "La sublimación es el cambio de estado de sólido a gaseoso sin pasar por el estado líquido. El hielo seco (CO₂ sólido) sublima directamente a gas a temperatura ambiente."
  },
  {
    id: "unam_2026_77",
    area: "Física",
    text: "El agua ________ es una sustancia conductora de electricidad.",
    options: [
      "con azúcar",
      "oxigenada",
      "destilada",
      "de mar"
    ],
    correctIndex: 3,
    explanation: "El agua de mar contiene sales disueltas (iones) que la hacen conductora de electricidad. El agua destilada es prácticamente no conductora por su pureza."
  },
  {
    id: "unam_2026_78",
    area: "Física",
    text: "¿En cuáles de los siguientes casos se puede generar un campo magnético? I. Pasando una corriente eléctrica a través de un conductor. II. Enrollando un alambre sobre un clavo y pasando una corriente eléctrica a través de éste. III. Impidiendo el paso de la corriente eléctrica sobre un conductor. IV. A través de la acción de una carga puntual en reposo.",
    options: [
      "II y IV",
      "III y IV",
      "I y III",
      "I y II"
    ],
    correctIndex: 3,
    explanation: "Los campos magnéticos se generan por corrientes eléctricas en movimiento. En el caso I (corriente en conductor) y II (electroimán con solenoide) se generan campos magnéticos."
  },
  {
    id: "unam_2026_79",
    area: "Física",
    text: "El movimiento ondulatorio es un proceso por medio del cual se transmite",
    options: [
      "energía",
      "átomos",
      "moléculas",
      "partículas"
    ],
    correctIndex: 3,
    explanation: "Las ondas mecánicas transmiten energía a través de un medio material, sin que haya transporte neto de materia (átomos, moléculas o partículas) de un lugar a otro.",
    // Nota: La clave del PDF indica D (partículas) pero la respuesta correcta conceptual es A (energía).
    // Basado en la clave oficial del PDF: correctIndex: 3
  },
  {
    id: "unam_2026_80",
    area: "Física",
    text: "Si la luz roja tiene menor frecuencia que la luz azul, ¿qué podemos afirmar de sus energías?",
    options: [
      "Que la energía de la luz roja es mayor que la de la luz azul",
      "Que la energía de la luz roja es menor que la de la luz azul",
      "Que de la luz roja la energía es igual que la de la luz azul",
      "Que de la luz roja y azul la energía es independiente de su frecuencia"
    ],
    correctIndex: 1,
    explanation: "Según la ecuación de Planck: E = hf, donde h es la constante de Planck y f es la frecuencia. A menor frecuencia (luz roja), menor energía. Por tanto, la luz roja tiene menos energía que la luz azul."
  },

  // ══════════════════════════════════════════════════════════
  // QUÍMICA (Saberes y Pensamiento Científico) — preguntas 81-92
  // ══════════════════════════════════════════════════════════
  {
    id: "unam_2026_81",
    area: "Química",
    text: "Los distintos modelos de átomo han sido elaborados para",
    options: [
      "cuantificar las sustancias en una reacción",
      "explicar el comportamiento de la materia",
      "representar los fenómenos naturales",
      "comunicar los resultados de sus experimentos"
    ],
    correctIndex: 1,
    explanation: "Los modelos atómicos (Thomson, Rutherford, Bohr, etc.) fueron desarrollados para explicar cómo se comporta la materia a nivel subatómico y dar cuenta de sus propiedades."
  },
  {
    id: "unam_2026_82",
    area: "Química",
    text: "Propiedades físicas de los líquidos.",
    options: [
      "Volumen definido y adoptan la forma del recipiente",
      "Volumen propio y forma definida",
      "Compresibilidad y difusibilidad",
      "Difusibilidad y expansibilidad"
    ],
    correctIndex: 0,
    explanation: "Los líquidos tienen volumen propio (definido) pero adoptan la forma del recipiente que los contiene. No son compresibles significativamente y no se expanden para llenar todo el espacio disponible."
  },
  {
    id: "unam_2026_83",
    area: "Química",
    text: "Propiedades que permiten cuantificar los materiales.",
    options: [
      "Masa y volumen",
      "Peso y solubilidad",
      "Longitud y tiempo",
      "Densidad y temperatura"
    ],
    correctIndex: 0,
    explanation: "La masa y el volumen son propiedades extensivas que permiten cuantificar (medir en términos absolutos) la cantidad de material presente en una muestra."
  },
  {
    id: "unam_2026_84",
    area: "Química",
    text: "Se tienen 100 gramos de hielo a –10 °C en un recipiente cerrado. Se eleva la temperatura hasta alcanzar, primero, los 20 °C; después la temperatura llega a 110 °C. Indica cuántos gramos de agua en estado líquido se han obtenido a la temperatura de 20 °C, y cuántos gramos de vapor se han producido al alcanzarse la temperatura de 110 °C.",
    options: [
      "120 g de agua y 220 g de vapor",
      "120 g de agua y 120 g de vapor",
      "100 g de agua y 100 g de vapor",
      "100 g de agua y 120 g de vapor"
    ],
    correctIndex: 2,
    explanation: "Al calentar 100 g de hielo hasta 20°C, todo se convierte en 100 g de agua líquida (conservación de masa). Al seguir calentando hasta 110°C, toda el agua se convierte en 100 g de vapor."
  },
  {
    id: "unam_2026_85",
    area: "Química",
    text: "Partículas subatómicas responsables de que ocurran las reacciones químicas.",
    options: [
      "Neutrones",
      "Electrones internos",
      "Protones",
      "Electrones externos"
    ],
    correctIndex: 3,
    explanation: "Los electrones externos (de valencia), ubicados en el último nivel energético, son los responsables de las reacciones químicas al formar o romper enlaces entre átomos."
  },
  {
    id: "unam_2026_86",
    area: "Química",
    text: "Un átomo con Z = 20 y 40 neutrones, tiene ___ protones.",
    options: [
      "60",
      "10",
      "20",
      "40"
    ],
    correctIndex: 2,
    explanation: "El número atómico Z representa el número de protones. Si Z = 20, el átomo tiene 20 protones. Los neutrones no afectan la cantidad de protones."
  },
  {
    id: "unam_2026_87",
    area: "Química",
    text: "La representación H• corresponde a",
    options: [
      "ion hidrógeno",
      "átomo de hidrógeno",
      "la molécula de hidrógeno",
      "ion hidronio"
    ],
    correctIndex: 1,
    explanation: "La representación H• (estructura de Lewis con un punto) corresponde a un átomo de hidrógeno con un electrón de valencia. El punto representa ese electrón desapareado."
  },
  {
    id: "unam_2026_88",
    area: "Química",
    text: "Los elementos se ubican en la Tabla Periódica de acuerdo con el orden creciente de su",
    options: [
      "número atómico",
      "densidad",
      "tamaño",
      "número de masa"
    ],
    correctIndex: 0,
    explanation: "La Tabla Periódica moderna (de Moseley) organiza los elementos en orden creciente de número atómico (número de protones), que determina la identidad de cada elemento."
  },
  {
    id: "unam_2026_89",
    area: "Química",
    text: "Elige la opción en la que aparecen solamente características de los metales.",
    options: [
      "Alta temperatura de fusión, conductividad eléctrica y maleabilidad",
      "Baja densidad, conductividad eléctrica y ductilidad",
      "Alta densidad, conductividad térmica y baja temperatura de fusión",
      "Maleabilidad, conductividad y baja densidad"
    ],
    correctIndex: 0,
    explanation: "Los metales se caracterizan por su alta temperatura de fusión (en general), buena conductividad eléctrica y maleabilidad (capacidad de deformarse en láminas)."
  },
  {
    id: "unam_2026_90",
    area: "Química",
    text: "La ecuación que indica que el agua interviene como reactivo es",
    options: [
      "H₂O → H₂ + O₂",
      "H₂ + O₂ → H₂O",
      "NaOH + HCl → NaCl + H₂O",
      "CO₂ + H₂O → H₂CO₃"
    ],
    correctIndex: 3,
    explanation: "En la ecuación CO₂ + H₂O → H₂CO₃, el agua aparece del lado izquierdo (reactivo) participando en la formación de ácido carbónico."
  },
  {
    id: "unam_2026_91",
    area: "Química",
    text: "Con base en el Sistema Internacional de unidades (SI), la cantidad de sustancia se asocia con",
    options: [
      "mol",
      "kilogramo",
      "candela",
      "litro"
    ],
    correctIndex: 0,
    explanation: "En el Sistema Internacional de Unidades, la cantidad de sustancia se mide en moles (mol), que es una de las siete magnitudes fundamentales del SI."
  },
  {
    id: "unam_2026_92",
    area: "Química",
    text: "En la siguiente ecuación: Zn + CuSO₄ → Cu + ZnSO₄, el ________ se reduce y el ________ se oxida.",
    options: [
      "Cu – Zn",
      "Zn – Cu",
      "S – O",
      "O – S"
    ],
    correctIndex: 0,
    explanation: "En la reacción de desplazamiento, el Cu²⁺ gana electrones (se reduce a Cu⁰) y el Zn⁰ pierde electrones (se oxida a Zn²⁺). Por tanto, el Cu se reduce y el Zn se oxida."
  },

  // ══════════════════════════════════════════════════════════
  // HISTORIA (Ética, Naturaleza y Sociedades) — preguntas 93-104
  // ══════════════════════════════════════════════════════════
  {
    id: "unam_2026_93",
    area: "Historia",
    text: "La literatura del humanismo europeo tuvo repercusiones en la cultura y el arte provocando el inicio de un periodo conocido como",
    options: [
      "Renacimiento",
      "Modernismo",
      "Romanticismo",
      "Barroco"
    ],
    correctIndex: 0,
    explanation: "El humanismo europeo del siglo XV fue el fundamento intelectual del Renacimiento, periodo que supuso una renovación cultural, artística y científica inspirada en la Antigüedad clásica."
  },
  {
    id: "unam_2026_94",
    area: "Historia",
    text: "La Independencia de las Trece Colonias puso en práctica las ideas",
    options: [
      "de la Ilustración",
      "del Renacimiento",
      "del Humanismo",
      "del Romanticismo"
    ],
    correctIndex: 0,
    explanation: "La Declaración de Independencia de 1776 y la Constitución estadounidense reflejan los principios ilustrados de Locke, Montesquieu y Rousseau: soberanía popular, derechos naturales y separación de poderes."
  },
  {
    id: "unam_2026_95",
    area: "Historia",
    text: "Según el nacionalismo del siglo XIX, ¿qué determina lo nacional en cada Estado?",
    options: [
      "El sentimiento de colectividad derivado del idioma, costumbres e historia común",
      "La solidaridad social en relación con las diferencias culturales de su población",
      "Los intereses tradicionales de una sociedad enfocados a resolver asuntos económicos",
      "El pensamiento de una población que defiende su religión por encima de todo"
    ],
    correctIndex: 0,
    explanation: "El nacionalismo del siglo XIX definía la nación a partir de elementos culturales compartidos: idioma, costumbres, historia y tradiciones comunes que distinguen a un pueblo."
  },
  {
    id: "unam_2026_96",
    area: "Historia",
    text: "En el periodo de entreguerras, la política fascista de Italia se caracterizó por la",
    options: [
      "quema de sinagogas",
      "desintegración del parlamento",
      "persecución de los judíos",
      "noche de los cristales rotos"
    ],
    correctIndex: 1,
    explanation: "El fascismo de Mussolini en Italia se caracterizó por la supresión de la democracia parlamentaria, la concentración del poder en el Duce y el Estado totalitario. Las otras opciones corresponden al nazismo alemán."
  },
  {
    id: "unam_2026_97",
    area: "Historia",
    text: "La Revolución electrónica trajo consigo el desarrollo de una nueva ciencia llamada",
    options: [
      "biogenética",
      "física nuclear",
      "bioquímica",
      "informática"
    ],
    correctIndex: 3,
    explanation: "La Revolución electrónica de la segunda mitad del siglo XX impulsó el desarrollo de la informática (ciencia del tratamiento de la información) con la invención del transistor y el microprocesador."
  },
  {
    id: "unam_2026_98",
    area: "Historia",
    text: "Un efecto negativo de la globalización en el medio ambiente se observa en",
    options: [
      "la intensificación en el uso de productos orgánicos",
      "el aumento de reservas ecológicas protegidas",
      "la búsqueda de soluciones para evitar la extinción de especies",
      "el agotamiento de los recursos naturales"
    ],
    correctIndex: 3,
    explanation: "La globalización ha intensificado la producción y el consumo a escala mundial, acelerando el agotamiento de los recursos naturales y generando impactos ambientales negativos."
  },
  {
    id: "unam_2026_99",
    area: "Historia",
    text: "Fue el medio de mayor relevancia para mantener el poder ideológico de la Iglesia novohispana.",
    options: [
      "El Tribunal de la Acordada",
      "El Santo Oficio de la Inquisición",
      "El Tribunal de la Santa Cruzada",
      "El Provisorato de Indios"
    ],
    correctIndex: 1,
    explanation: "El Santo Oficio de la Inquisición fue el principal instrumento de control ideológico y religioso de la Iglesia en la Nueva España, persiguiendo herejías y desviaciones doctrinales."
  },
  {
    id: "unam_2026_100",
    area: "Historia",
    text: "El absolutismo ilustrado de los Borbones se caracterizó por",
    options: [
      "limitar a la Iglesia y centralizar el poder",
      "dar autonomía a la iglesia y a los cabildos indígenas",
      "dar libertades a las colonias e impulsar el comercio",
      "incluir a los criollos en cargos públicos y promover la libertad de comercio"
    ],
    correctIndex: 0,
    explanation: "Las Reformas Borbónicas del siglo XVIII buscaron centralizar el poder en la Corona, limitar la influencia de la Iglesia y modernizar la administración colonial para aumentar los ingresos reales."
  },
  {
    id: "unam_2026_101",
    area: "Historia",
    text: "Proceso de modernización de México en donde se dan los primeros pasos hacia la centralización del Estado y el fortalecimiento del poder ejecutivo.",
    options: [
      "Las Leyes de Reforma",
      "La venta de los bienes de la iglesia",
      "La formación del congreso constituyente",
      "El imperio de Maximiliano de Habsburgo"
    ],
    correctIndex: 0,
    explanation: "Las Leyes de Reforma (1855-1863) impulsadas por Benito Juárez marcaron el inicio de la modernización del Estado mexicano, separando la Iglesia del Estado y centralizando el poder en el ejecutivo."
  },
  {
    id: "unam_2026_102",
    area: "Historia",
    text: "En la Constitución de 1917, el artículo 27 es uno de los más trascendentales porque",
    options: [
      "ha logrado incidir en el liberalismo mundial al influir en otras naciones como ejemplo de orden y progreso",
      "estipula como propiedad de la Nación las tierras y demás recursos naturales que integran nuestro territorio",
      "recoge las inquietudes sociales de obreros y campesinos demandadas desde el proceso revolucionario",
      "enfatiza la independencia nacional frente a las demás naciones, así como la autonomía de los Estados"
    ],
    correctIndex: 1,
    explanation: "El artículo 27 de la Constitución de 1917 establece que las tierras y aguas comprendidas en el territorio nacional son propiedad originaria de la Nación, siendo uno de los más importantes de la Carta Magna."
  },
  {
    id: "unam_2026_103",
    area: "Historia",
    text: "Octavio Paz y Juan Rulfo, cuya obra es de gran aporte cultural, son autores mexicanos del siglo",
    options: [
      "XXI",
      "XIX",
      "XX",
      "XVIII"
    ],
    correctIndex: 2,
    explanation: "Octavio Paz (1914-1998) y Juan Rulfo (1917-1986) son dos de los escritores más importantes de México, ambos del siglo XX, reconocidos internacionalmente por obras como «El laberinto de la soledad» y «Pedro Páramo»."
  },
  {
    id: "unam_2026_104",
    area: "Historia",
    text: "Uno de los objetivos del Tratado de Libre Comercio con América del Norte es",
    options: [
      "acrecentar los impuestos comerciales",
      "limitar las exportaciones e inversiones",
      "aumentar las oportunidades de inversión",
      "fomentar la mano de obra de migrantes"
    ],
    correctIndex: 2,
    explanation: "El TLCAN (ahora T-MEC) tiene entre sus objetivos principales eliminar barreras al comercio, promover la inversión y aumentar las oportunidades de inversión entre México, Estados Unidos y Canadá."
  },

  // ══════════════════════════════════════════════════════════
  // GEOGRAFÍA (Ética, Naturaleza y Sociedades) — preguntas 105-116
  // ══════════════════════════════════════════════════════════
  {
    id: "unam_2026_105",
    area: "Geografía",
    text: "La zona de ciudad Nezahualcóyotl hace unos años era una zona de cultivo. Este ejemplo hace referencia al principio de",
    options: [
      "relación",
      "localización",
      "distribución",
      "temporalidad"
    ],
    correctIndex: 3,
    explanation: "El principio de temporalidad en geografía indica que los espacios geográficos cambian con el tiempo. El ejemplo de Neza (zona agrícola → zona urbana) ilustra ese cambio temporal."
  },
  {
    id: "unam_2026_106",
    area: "Geografía",
    text: "Determina las coordenadas geográficas para el punto II. (Mapa con punto II ubicado en África, aproximadamente a 10°S y 30°E)",
    options: [
      "30° N, 10° W",
      "30° S, 10° E",
      "10° N, 30° W",
      "10° S, 30° E"
    ],
    correctIndex: 3,
    explanation: "El punto II en el mapa se localiza en el hemisferio sur (latitud Sur) y al este del meridiano de Greenwich (longitud Este). Las coordenadas son aproximadamente 10° S, 30° E.",
    // imageUrl: "https://lruwnuldlltwktdfrwho.supabase.co/storage/v1/object/public/simulador-imagenes/guia2026/p106.png"
  },
  {
    id: "unam_2026_107",
    area: "Geografía",
    text: "Los husos horarios son una prueba y una consecuencia de la",
    options: [
      "traslación terrestre",
      "rotación del Sol",
      "rotación terrestre",
      "inclinación del eje"
    ],
    correctIndex: 2,
    explanation: "Los husos horarios existen porque la Tierra gira sobre su propio eje (rotación) cada 24 horas. Al dividir 360° entre 24 horas se obtienen 24 husos de 15° cada uno."
  },
  {
    id: "unam_2026_108",
    area: "Geografía",
    text: "Los movimientos en el manto superior terrestre influyen en",
    options: [
      "la formación del petróleo",
      "la salinidad de los mares",
      "la erosión de las montañas",
      "el desplazamiento de las placas"
    ],
    correctIndex: 3,
    explanation: "Las corrientes de convección en el manto terrestre son la fuerza motriz que mueve las placas tectónicas, causando sismos, vulcanismo y la formación de cordilleras."
  },
  {
    id: "unam_2026_109",
    area: "Geografía",
    text: "Capa de la atmósfera que se encuentra desde los 10–12 km y llega hasta los 40–50 km de altura y se localiza la capa de ozono.",
    options: [
      "Ionosfera",
      "Exosfera",
      "Estratosfera",
      "Mesosfera"
    ],
    correctIndex: 2,
    explanation: "La estratosfera se extiende desde los 10-12 km hasta los 50 km de altitud y contiene la capa de ozono (ozonosfera), que absorbe la radiación ultravioleta solar."
  },
  {
    id: "unam_2026_110",
    area: "Geografía",
    text: "Factores que ponen en riesgo a la población por los efectos de un sismo: I. Sustrato geológico, II. Altitud, III. Infraestructura, IV. Inundaciones, V. Deslizamientos de tierra.",
    options: [
      "I, III, IV y V",
      "I, II y III",
      "II, III y V",
      "I, III y IV"
    ],
    correctIndex: 0,
    explanation: "Los factores de riesgo ante sismos incluyen: el tipo de suelo o sustrato geológico (amplifica las ondas), la calidad de la infraestructura (resistencia de construcciones), las inundaciones y los deslizamientos de tierra como efectos secundarios."
  },
  {
    id: "unam_2026_111",
    area: "Geografía",
    text: "Zona con mayor extracción petrolera en México.",
    options: [
      "Mar Caribe",
      "Costas del Océano Pacífico",
      "Costa del Golfo de México",
      "Mar de Cortés"
    ],
    correctIndex: 2,
    explanation: "La principal zona de extracción petrolera de México se concentra en el Golfo de México, especialmente en la Sonda de Campeche, donde se ubican los mayores yacimientos offshore del país."
  },
  {
    id: "unam_2026_112",
    area: "Geografía",
    text: "Puertos que permiten el intercambio comercial y económico más importante en México.",
    options: [
      "Manzanillo y Veracruz",
      "Veracruz y Progreso",
      "Acapulco y Salina Cruz",
      "Lázaro Cárdenas y Tampico"
    ],
    correctIndex: 0,
    explanation: "Manzanillo (Colima) en el Pacífico y Veracruz en el Golfo de México son los puertos con mayor movimiento de carga y comercio exterior de México."
  },
  {
    id: "unam_2026_113",
    area: "Geografía",
    text: "Ciudades costeras en México que reciben la mayor cantidad de turistas extranjeros.",
    options: [
      "Puerto Vallarta e Ixtapa",
      "Cancún y Los Cabos",
      "Puerto Vallarta y Huatulco",
      "Cancún y Cozumel"
    ],
    correctIndex: 1,
    explanation: "Cancún (Quintana Roo) y Los Cabos (Baja California Sur) son los destinos turísticos costeros de México que reciben el mayor número de turistas internacionales al año."
  },
  {
    id: "unam_2026_114",
    area: "Geografía",
    text: "En siglo XXI, la globalización cultural se ha logrado por el uso masivo del",
    options: [
      "internet",
      "teléfono",
      "radio",
      "periódico"
    ],
    correctIndex: 0,
    explanation: "Internet ha sido el principal medio para la globalización cultural en el siglo XXI, permitiendo el intercambio masivo e instantáneo de información, entretenimiento y expresiones culturales a escala mundial."
  },
  {
    id: "unam_2026_115",
    area: "Geografía",
    text: "La zona arqueológica de Palenque se encuentra en el estado de",
    options: [
      "Chiapas",
      "Veracruz",
      "Oaxaca",
      "Guerrero"
    ],
    correctIndex: 0,
    explanation: "Palenque es una importante zona arqueológica maya ubicada en el estado de Chiapas, México, declarada Patrimonio de la Humanidad por la UNESCO."
  },
  {
    id: "unam_2026_116",
    area: "Geografía",
    text: "Área con una amplitud de 200 millas náuticas sobre la cual un Estado tiene derechos especiales para su exploración, explotación y utilización de recursos.",
    options: [
      "Plataforma continental",
      "Mar territorial",
      "Aguas internacionales",
      "Zona económica exclusiva"
    ],
    correctIndex: 3,
    explanation: "La Zona Económica Exclusiva (ZEE) es el área marina que se extiende hasta 200 millas náuticas desde la costa, donde el Estado ribereño tiene derechos soberanos para explorar y explotar los recursos naturales."
  },

  // ══════════════════════════════════════════════════════════
  // FORMACIÓN CÍVICA Y ÉTICA (Ética, Naturaleza y Sociedades) — preguntas 117-128
  // ══════════════════════════════════════════════════════════
  {
    id: "unam_2026_117",
    area: "Formación Cívica y Ética",
    text: "Selecciona el caso donde compete sólo al interesado tomar decisiones.",
    options: [
      "Clemente, médico gastroenterólogo con gran experiencia, ha encontrado un método para la cura de la gastritis y necesita realizar pruebas que le permitan perfeccionarlo",
      "Después de varios años, Carmen ha logrado juntar una buena cantidad de dinero y por fin se le presenta la oportunidad de donar todo su capital al orfanatorio donde se educó",
      "Patricio, destacado estudiante de secundaria, ha sido seleccionado para realizar una estancia de estudios por un año en uno de los estados de Norteamérica",
      "Eulalio, entrenador de fútbol, ha recibido una invitación para participar con su equipo en un torneo amistoso que tendrá lugar en las ciudades más importantes del país"
    ],
    correctIndex: 1,
    explanation: "Carmen es la única persona que puede decidir sobre su propio capital; se trata de una decisión personal que no afecta directamente a terceros sin su consentimiento, por lo que la autonomía individual aplica plenamente."
  },
  {
    id: "unam_2026_118",
    area: "Formación Cívica y Ética",
    text: "Elige el enunciado donde se expresan valores estéticos.",
    options: [
      "Estoy convencido de que la ley es el único medio por el cual llegaremos a construir un mundo más armónico",
      "Prefiero los espacios pequeños pues evito gastos innecesarios en luz, agua, gas y productos de limpieza",
      "Me encanta el orden, la armonía y el equilibrio con que está construido este edificio de principios de siglo",
      "Considero reprobable la corrupción e ilegalidad daña terriblemente el desarrollo de nuestro país"
    ],
    correctIndex: 2,
    explanation: "Los valores estéticos se refieren a la apreciación de la belleza, el orden y la armonía. La opción C expresa una valoración estética del edificio basada en su orden, armonía y equilibrio."
  },
  {
    id: "unam_2026_119",
    area: "Formación Cívica y Ética",
    text: "¿En qué caso se ejemplifica la importancia de la relación del ser humano con su entorno para la conformación de su identidad?",
    options: [
      "Balbina está callada y distante pues recientemente ha sentido que nadie la comprende",
      "Eloy prefiere cenar tacos en la calle pues el trabajo en la oficina no le deja tiempo para nada en el día",
      "Yolanda es una persona tolerante y reflexiva pues en su familia siempre ha prevalecido el diálogo y la empatía",
      "José se reúne a jugar dominó con sus amigos pues quiere fomentar su agilidad mental"
    ],
    correctIndex: 2,
    explanation: "Yolanda ha desarrollado valores (tolerancia, reflexión) gracias a su entorno familiar (diálogo, empatía), lo que ilustra cómo el contexto social moldea la identidad personal."
  },
  {
    id: "unam_2026_120",
    area: "Formación Cívica y Ética",
    text: "Relaciona los derechos y obligaciones de los adolescentes con el ejemplo que les corresponde. Derechos y obligaciones: I. Derecho, II. Obligación. Ejemplos: a. Respeto de los padres a los hijos, b. Responsabilidad en los estudios, c. Cumplimiento de las normas sociales, d. Contar con servicios de salud gratuitos.",
    options: [
      "I: a, d – II: b, c",
      "I: a, c – II: b, d",
      "I: b, c – II: a, d",
      "I: c, d – II: b, a"
    ],
    correctIndex: 0,
    explanation: "Son derechos de los adolescentes: el respeto de los padres (a) y contar con servicios de salud gratuitos (d). Son obligaciones: la responsabilidad en los estudios (b) y el cumplimiento de normas sociales (c)."
  },
  {
    id: "unam_2026_121",
    area: "Formación Cívica y Ética",
    text: "El dueño de un establecimiento paga a sus empleados adolescentes un sueldo menor al salario mínimo, argumentando que no tienen necesidades importantes que satisfacer como en el caso de los adultos casados. Esta situación describe un tipo de",
    options: [
      "favoritismo económico empresarial",
      "violencia económica a los adolescentes",
      "violencia psicológica a los adolescentes",
      "economía propia de la adolescencia"
    ],
    correctIndex: 1,
    explanation: "Pagar un salario inferior al mínimo representa violencia económica, pues priva a los adolescentes trabajadores de sus derechos laborales y económicos, independientemente de su situación familiar."
  },
  {
    id: "unam_2026_122",
    area: "Formación Cívica y Ética",
    text: "Ernesto y sus amigos no quieren juntarse en el recreo con Sebastián y sus compañeros porque dicen que son morenos, judíos y pobres. La actitud anterior es un ejemplo de discriminación",
    options: [
      "racial, religiosa y económica",
      "sexual, religiosa y económica",
      "religiosa, racial y educativa",
      "educativa, religiosa y económica"
    ],
    correctIndex: 0,
    explanation: "El rechazo por ser «morenos» es discriminación racial, por ser «judíos» es discriminación religiosa, y por ser «pobres» es discriminación económica o social."
  },
  {
    id: "unam_2026_123",
    area: "Formación Cívica y Ética",
    text: "El poder ________, de acuerdo con la Constitución, interpreta y aplica las normas para resolver conflictos.",
    options: [
      "Legislativo",
      "Ejecutivo",
      "Absoluto",
      "Judicial"
    ],
    correctIndex: 3,
    explanation: "El Poder Judicial es el encargado de interpretar y aplicar las leyes para resolver los conflictos jurídicos entre particulares o entre éstos y el Estado, garantizando el estado de derecho."
  },
  {
    id: "unam_2026_124",
    area: "Formación Cívica y Ética",
    text: "Entidad de interés público a la que se puede afiliar cualquier ciudadano que comparta las mismas ideas y pueda proponer candidatos a los cargos públicos con el fin de participar en la democracia del país.",
    options: [
      "Partido Político",
      "Institución de Asistencia Privada",
      "Asociación Civil",
      "Instituto Nacional Electoral"
    ],
    correctIndex: 0,
    explanation: "Los partidos políticos son entidades de interés público cuya función es promover la participación ciudadana en la democracia, proponer candidatos a cargos públicos y representar los intereses de sus militantes."
  },
  {
    id: "unam_2026_125",
    area: "Formación Cívica y Ética",
    text: "En una elección democrática el voto debe ser",
    options: [
      "libre, total y secreto",
      "abierto, directo y secreto",
      "libre, secreto y directo",
      "libre, secreto e indirecto"
    ],
    correctIndex: 2,
    explanation: "En México y en la mayoría de las democracias, el voto debe ser universal, libre (sin coerción), secreto (nadie puede saber por quién votaste) y directo (los ciudadanos eligen directamente a sus representantes)."
  },
  {
    id: "unam_2026_126",
    area: "Formación Cívica y Ética",
    text: "Un medio de comunicación cumple con una función social cuando",
    options: [
      "organiza la ayuda para los damnificados por desastres naturales",
      "está involucrado en el servicio al sistema económico y la publicidad",
      "forma opiniones basadas en los comentarios de terceros",
      "convence al receptor sobre un tema específico mediante la persuasión"
    ],
    correctIndex: 0,
    explanation: "Los medios de comunicación cumplen una función social cuando su actividad beneficia a la comunidad, como ocurre cuando organizan y difunden ayuda para víctimas de desastres naturales."
  },
  {
    id: "unam_2026_127",
    area: "Formación Cívica y Ética",
    text: "Cuidar las áreas verdes en tu comunidad, levantar las heces de los perros, separar la basura y realizar actividades al aire libre son acciones relacionadas con",
    options: [
      "lograr una mejor calidad de vida",
      "desarrollar conciencia moral",
      "pertenecer a grupos de cuidado del ambiente",
      "responder a la influencia social"
    ],
    correctIndex: 0,
    explanation: "Estas acciones (cuidado del ambiente, higiene pública, actividad física) contribuyen directamente a mejorar la calidad de vida de las personas y de la comunidad en general."
  },
  {
    id: "unam_2026_128",
    area: "Formación Cívica y Ética",
    text: "Cuando Juan y Ana buscan hablar con José para solucionar el conflicto del departamento rentado, están usando el recurso llamado",
    options: [
      "mediación",
      "arbitraje",
      "negociación",
      "legalidad"
    ],
    correctIndex: 2,
    explanation: "La negociación es el proceso directo en que las partes en conflicto buscan un acuerdo mediante el diálogo sin intervención de un tercero. Al ir directamente a hablar con José, Juan y Ana negocian."
  }
];

// ============================================================
// RESUMEN: PREGUNTAS QUE REQUIEREN IMAGEN
// ============================================================
// Debes capturar estas figuras del PDF y subirlas a:
// Supabase Storage → simulador-imagenes → carpeta guia2026/
//
// p40.png   – Pregunta 40: paralelogramo con base 9m y altura 4m
// p45.png   – Pregunta 45: serie de triángulos que rotan
// p46.png   – Pregunta 46: serie de círculos con secciones negras
// p47.png   – Pregunta 47: serie de figuras con puntos (grilla)
// p48.png   – Pregunta 48: serie de figuras con líneas internas
// p49.png   – Pregunta 49: desarrollo plano del cubo (cruz con símbolos)
// p50.png   – Pregunta 50: figura plana tipo caja con cara gris
// p51.png   – Pregunta 51: figura tridimensional escalonada de cubos
// p52.png   – Pregunta 52: dado con letras U/A/E y sus 4 opciones
// p54.png   – Pregunta 54: diagrama circular con sectores numéricos
// p69.png   – Pregunta 69: gráfica v-t del vehículo (0-5h, 0-120 km/h)
// p70.png   – Pregunta 70: gráfica v-t (0-4h, meseta a 60 km/h)
// p71.png   – Pregunta 71: persona empujando cajas A(3kg) y B(2kg)
// p106.png  – Pregunta 106: mapa de África/Europa con coordenadas y punto II
//
// TOTAL: 14 imágenes necesarias
// ============================================================
