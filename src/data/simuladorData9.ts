import type { Question } from "./simuladorData";

export const bank9Questions: Question[] = [
  // ─── HABILIDAD MATEMÁTICA (1-16) ───────────────────────────────────────────
  {
    id: "unam_2024_01",
    area: "Habilidad Matemática",
    text: "¿Cuál es el término que falta en la siguiente sucesión?\n\n10, –2, –14, –26, ____, ...",
    options: ["–38", "14", "–50", "–37"],
    correctIndex: 0,
    explanation: "La diferencia entre términos es constante: –2–10=–12, –14–(–2)=–12, –26–(–14)=–12. El siguiente término es –26–12=–38."
  },
  {
    id: "unam_2024_02",
    area: "Habilidad Matemática",
    text: "Indica los números que continúan en la sucesión\n\n8, 7.1, 6.02, 5.003, 4.0004, ___, ___, ....",
    options: ["3.00005 y 2.000006", "3.0005 y 2.00006", "3.000005 y 2.0000006", "3.000005 y 2.00006"],
    correctIndex: 0,
    explanation: "Cada término resta ~0.9 pero agrega un decimal adicional de 5: 8→7.1 (–0.9), 7.1→6.02 (–1.08... no). Patrón real: la parte entera decrece en 1 y los decimales aumentan en un 5 más: 4.0004→3.00005→2.000006."
  },
  {
    id: "unam_2024_03",
    area: "Habilidad Matemática",
    text: "Identifica el número que complete la sucesión.\n\n5, 1, 4, 7, 2, 6, 10, 3, ____,",
    options: ["4", "6", "7", "8"],
    correctIndex: 3,
    explanation: "La sucesión alterna tres series: (5,4,2,3) no regular... Revisando: Serie A: 5,4,2,3 y Serie B: 1,7,6,? Patrón B: 1,7,6 → diferencias +6,–1 → 6+6=12 no. Serie entrelazada: pos 1,4,7 → 5,7,3; pos 2,5,8 → 1,2,3; pos 3,6,9 → 4,6,? (+2 cada vez) → 8."
  },
  {
    id: "unam_2024_04",
    area: "Habilidad Matemática",
    text: "Encuentra los términos que faltan en la siguiente sucesión.\n\n5, 12, 16, 8, 27, 4, ___, ___, ...",
    options: ["49, 0", "38, 49", "38, 0", "49, 38"],
    correctIndex: 2,
    explanation: "Hay dos series intercaladas: Serie A (pos impares): 5, 16, 27, 38 (+11 cada vez) → siguiente: 38. Serie B (pos pares): 12, 8, 4, 0 (–4 cada vez) → siguiente: 0. Faltan 38 y 0."
  },
  {
    id: "unam_2024_05",
    area: "Habilidad Matemática",
    text: "Si las primeras cuatro figuras de la serie son:\n\n(Figura 1: 1 punto; Figura 2: retícula de 2×3=6 puntos; Figura 3: retícula de 3×4=12 puntos; Figura 4: retícula de 4×5=20 puntos — observa la imagen)\n\n¿Cuántos puntos tendrá la que ocupa la octava posición?",
    options: ["42", "72", "90", "56"],
    correctIndex: 1,
    explanation: "Observa la imagen: cuenta los puntos en cada figura para encontrar el patrón. Las retículas crecen como F(n)=n×(n+1): F1=2, F2=6, F3=12, F4=20... F8=8×9=72 puntos.",
    imageUrl: "/guia2024/p05.png"
  },
  {
    id: "unam_2024_06",
    area: "Habilidad Matemática",
    text: "¿Qué figura continúa la serie?\n\n(La serie muestra una cruz donde el punto negro se desplaza: arriba-izquierda → arriba → derecha → arriba-derecha; y el círculo vacío rota en sentido contrario — observa la imagen)",
    options: [
      "Cruz con punto negro arriba del brazo izquierdo y círculo vacío abajo-derecha",
      "Cruz con punto negro en el brazo izquierdo horizontal y círculo abajo",
      "Cruz con punto negro arriba y círculo vacío abajo-derecha",
      "Cruz con punto negro arriba-izquierda y círculo vacío abajo"
    ],
    correctIndex: 0,
    explanation: "Observa la imagen: identifica cómo se mueve el punto negro y el círculo vacío en cada figura de la serie. Aplica el mismo patrón de desplazamiento: la siguiente figura tiene punto en brazo superior-izquierdo y círculo en inferior-derecha (opción A).",
    imageUrl: "/guia2024/p06.png"
  },
  {
    id: "unam_2024_07",
    area: "Habilidad Matemática",
    text: "Identifica el tercer reloj de la siguiente serie.\n\n(La serie muestra 5 relojes analógicos — el 3° está en blanco. Cada reloj avanza ~1h45min respecto al anterior. Reloj 1≈10:10, Reloj 2≈11:55, Reloj 3=?, Reloj 4≈1:40, Reloj 5≈3:25 — observa la imagen)",
    options: [
      "Reloj con manecilla grande en ~8 y pequeña entre 1 y 2 (~1:40)",
      "Reloj con manecilla grande en 12 y pequeña en 12 (~12:00)",
      "Reloj con manecilla grande en 9 y pequeña en 12 (~12:45)",
      "Reloj con manecilla grande en 6 y pequeña en 12 (~12:30)"
    ],
    correctIndex: 0,
    explanation: "Observa la imagen: analiza el avance de las manecillas entre cada reloj de la serie para identificar el patrón de tiempo. El intervalo es ~1h45min: R1≈10:10, R2≈11:55, R3≈1:40, R4≈3:25. El tercer reloj es la opción A.",
    imageUrl: "/guia2024/p07.png"
  },
  {
    id: "unam_2024_08",
    area: "Habilidad Matemática",
    text: "¿Que figura sigue en la serie?\n\n(La serie muestra figuras concéntricas: Fig1=CÍRCULO exterior con octógono+cuadrado+círculo inscritos; Fig2=OCTÓGONO exterior con cuadrado+octógono+cuadrado inscritos; Fig3=ROMBO exterior con octógono+cuadrado+rombo inscritos — observa la imagen)",
    options: [
      "Cuadrado exterior con hexágono y círculo inscritos",
      "Cuadrado exterior con octógono y círculo inscritos",
      "Círculo exterior con octógono y cuadrado inscritos (sin marco)",
      "Círculo exterior con cuadrado y octógono inscritos (vuelve al inicio)"
    ],
    correctIndex: 3,
    explanation: "Observa la imagen: identifica la figura exterior de cada elemento de la serie (Círculo → Octógono → Rombo → ...) y el patrón de figuras inscritas. La serie cicla de regreso al inicio: la opción D (círculo exterior) completa el ciclo.",
    imageUrl: "/guia2024/p08.png"
  },
  {
    id: "unam_2024_09",
    area: "Habilidad Matemática",
    text: "Observa la siguiente figura en perspectiva.\n\n(Figura 3D hecha de cubos: masa principal horizontal en la base con una torre en el extremo izquierdo-superior. Al girarla 180°, la torre pasa al extremo derecho-inferior — observa la imagen)\n\n¿Cómo se ve si se gira 180°?",
    options: [
      "Figura con masa central y torres en ambos extremos superiores",
      "Figura con masa horizontal y torre en el extremo derecho-inferior (rotación 180° correcta)",
      "Figura con masa a la izquierda y torre arriba-derecha",
      "Figura con cubos adicionales distribuidos asimétricamente"
    ],
    correctIndex: 1,
    explanation: "Observa la imagen: visualiza mentalmente la figura girada 180°. Lo que está arriba-izquierda pasa a abajo-derecha y viceversa. La opción B muestra correctamente la figura invertida con la torre en el extremo opuesto.",
    imageUrl: "/guia2024/p09.png"
  },
  {
    id: "unam_2024_10",
    area: "Habilidad Matemática",
    text: "Observa cuidadosamente el siguiente patrón y selecciona la figura que puede formarse a partir de él.\n\n(El patrón es una cruz plana: parte central blanca grande + franja gris en la parte inferior + rectángulo blanco arriba — al doblarse forma una caja rectangular — observa la imagen)",
    options: [
      "Caja rectangular con cara superior gris y frente blanco",
      "Caja rectangular con cara inferior gris visible y parte superior blanca (correcta)",
      "Caja rectangular con frente gris y parte superior blanca",
      "Caja rectangular completamente gris"
    ],
    correctIndex: 1,
    explanation: "Observa la imagen: visualiza cómo se doblaría el desarrollo plano para formar la caja. Identifica qué cara queda en cada posición al doblar. La franja gris inferior se convierte en la cara frontal inferior; la opción B es la correcta.",
    imageUrl: "/guia2024/p10.png"
  },
  {
    id: "unam_2024_11",
    area: "Habilidad Matemática",
    text: "Si se permite cualquier tipo de giro, ¿con cuál figura se completa un cuadrado?\n\n(La figura base es una pieza de 7 cuadros en forma de escalera/L irregular que ocupa la esquina superior-derecha de un cuadrado de 4×4 — observa la imagen)",
    options: [
      "Pieza en forma de L grande de 9 cuadros (complemento exacto de la pieza base para formar un cuadrado 4×4)",
      "Pieza en escalera de 7 cuadros (no es el complemento correcto)",
      "Pieza en escalera de 5 cuadros",
      "Pieza en L de 6 cuadros"
    ],
    correctIndex: 0,
    explanation: "Observa la imagen: identifica la forma de la pieza base y los espacios vacíos que quedan en el cuadrado 4×4 (16 cuadros). La pieza complementaria debe tener 9 cuadros. Al girar la opción A encaja perfectamente con la figura base.",
    imageUrl: "/guia2024/p11.png"
  },
  {
    id: "unam_2024_12",
    area: "Habilidad Matemática",
    text: "Si el eje de simetría de la siguiente imagen es la línea punteada, ¿qué imagen se proyecta al otro lado de ese eje?\n\n(La figura original es una silueta irregular dentada/espinosa. El eje punteado es horizontal. Se pregunta qué aparece DEBAJO del eje — observa la imagen)",
    options: [
      "Figura combinada: original arriba + reflejo abajo (juntas)",
      "Figura rotada 90° en sentido horario",
      "Figura rotada 180° (volteo completo)",
      "Reflejo invertido verticalmente de la figura original (la figura 'boca abajo')"
    ],
    correctIndex: 3,
    explanation: "Observa la imagen: el eje punteado es horizontal. Una reflexión respecto a ese eje produce la imagen espejo vertical (la figura aparece invertida arriba-abajo). La opción D muestra correctamente la proyección al otro lado del eje.",
    imageUrl: "/guia2024/p12.png"
  },
  {
    id: "unam_2024_13",
    area: "Habilidad Matemática",
    text: "¿Cuántos cubos tiene la siguiente figura?\n\n(Figura 3D en forma de cruz/más hecha de cubos unitarios)",
    options: ["19", "17", "18", "24"],
    correctIndex: 0,
    explanation: "Observa la imagen: cuenta los cubos por segmentos de la cruz. Brazos (izq+der+sup+inf): 3+3+3+3=12. Centro de la cruz: 7 cubos (4 de intersección + 3 de la elevación central). Total: 12+7=19 cubos.",
    imageUrl: "/guia2024/p13.png"
  },
  {
    id: "unam_2024_14",
    area: "Habilidad Matemática",
    text: "¿Cuál es el número que falta?\n\n(Círculo dividido en 6 sectores con los números: ?, 4, 10, 5, 12, 30)",
    options: ["12", "14", "15", "16"],
    correctIndex: 2,
    explanation: "Observa la imagen: analiza la relación entre los números de los sectores del círculo. Los sectores opuestos siguen un patrón (multiplicación o suma constante). Aplicando la regla correcta, el número faltante es 15.",
    imageUrl: "/guia2024/p14.png"
  },
  {
    id: "unam_2024_15",
    area: "Habilidad Matemática",
    text: "Un jardinero tiene que podar un campo de futbol. Si lo hace a razón de 2/3 por día, ¿en cuántos días terminará?",
    options: ["2", "2.5", "3", "1.5"],
    correctIndex: 3,
    explanation: "Si poda 2/3 del campo por día, tardará 1 ÷ (2/3) = 3/2 = 1.5 días en terminar el campo completo."
  },
  {
    id: "unam_2024_16",
    area: "Habilidad Matemática",
    text: "Cinco personas ganaron un premio de $6,300.00 y se les repartió de la siguiente manera: al primer ganador se le otorgó el triple de dinero que a los otros cuatro, quienes recibieron cantidades iguales. ¿Cuánto le tocó al primer ganador?",
    options: ["$900.00", "$1,260.00", "$2,700.00", "$3,780.00"],
    correctIndex: 2,
    explanation: "Sea x la cantidad de cada uno de los 4 ganadores. El primero recibe 3x. Total: 3x + 4x = 7x = $6,300 → x = $900. El primer ganador recibe 3×$900 = $2,700."
  },

  // ─── BIOLOGÍA (17-28) ──────────────────────────────────────────────────────
  {
    id: "unam_2024_17",
    area: "Biología",
    text: "Carlos Darwin establece que la selección natural se produce cuando",
    options: [
      "los individuos están mejor adaptados al medio.",
      "las características se mantienen a lo largo de la vida de los organismos.",
      "el medio influye para el cambio de estructuras de los seres vivos.",
      "los organismos se encuentran en un medio agradable para ellos."
    ],
    correctIndex: 0,
    explanation: "Darwin planteó que la selección natural ocurre cuando los individuos mejor adaptados a su entorno sobreviven y se reproducen más, transmitiendo sus características ventajosas."
  },
  {
    id: "unam_2024_18",
    area: "Biología",
    text: "Conocer y conservar la biodiversidad de nuestro país tiene como consecuencia la",
    options: [
      "regulación de sus recursos.",
      "explotación inmoderada.",
      "tala inmoderada.",
      "extinción de especies."
    ],
    correctIndex: 0,
    explanation: "Conocer y conservar la biodiversidad permite regular el uso sostenible de los recursos naturales, garantizando su disponibilidad para generaciones futuras."
  },
  {
    id: "unam_2024_19",
    area: "Biología",
    text: "La principal razón para preservar el ambiente es",
    options: [
      "generar ciclos biogeoquímicos controlados.",
      "prevenir desastres naturales.",
      "conservar el flujo de materia y energía en los ecosistemas.",
      "generar redes tróficas controladas y bancos de germoplasmas."
    ],
    correctIndex: 2,
    explanation: "La razón principal para preservar el ambiente es conservar el flujo de materia y energía en los ecosistemas, garantizando el equilibrio ecológico del que depende toda la vida."
  },
  {
    id: "unam_2024_20",
    area: "Biología",
    text: "El estudio de los microorganismos y el uso de vacunas que nos permiten mejorar nuestra calidad de vida son ejemplos de",
    options: [
      "conocimiento empírico y tecnológico.",
      "ciencias duras y análisis.",
      "conocimiento científico y tecnológico.",
      "ciencia pura y observación."
    ],
    correctIndex: 2,
    explanation: "El estudio de microorganismos (microbiología) es conocimiento científico, y el desarrollo de vacunas es la aplicación tecnológica de ese conocimiento para mejorar la salud humana."
  },
  {
    id: "unam_2024_21",
    area: "Biología",
    text: "Los helechos convierten la energía lumínica del sol en energía química de las moléculas de azúcar, a través de la",
    options: ["fermentación.", "respiración.", "fotosíntesis.", "excreción."],
    correctIndex: 2,
    explanation: "La fotosíntesis es el proceso por el cual los organismos con clorofila (como los helechos) convierten la energía solar en glucosa, usando CO₂ y agua."
  },
  {
    id: "unam_2024_22",
    area: "Biología",
    text: "La importancia biológica de la respiración celular radica en que en ella se",
    options: [
      "sintetizan moléculas de ATP.",
      "degradan nucleótidos.",
      "polimerizan polipéptidos.",
      "liberan enzimas."
    ],
    correctIndex: 0,
    explanation: "La respiración celular es el proceso que produce ATP (adenosín trifosfato), la molécula energética universal que usa la célula para llevar a cabo todos sus procesos vitales."
  },
  {
    id: "unam_2024_23",
    area: "Biología",
    text: "Las bacterias que habitan en aguas termales por su tipo de nutrición se consideran",
    options: ["hematófagas.", "autótrofas.", "heterótrofas.", "saprófagas."],
    correctIndex: 1,
    explanation: "Las bacterias termófilas de aguas termales son quimiolitoautótrofas: obtienen energía de compuestos inorgánicos (H₂S, hierro) sin depender de luz solar ni de otros organismos."
  },
  {
    id: "unam_2024_24",
    area: "Biología",
    text: "Resultado de la excesiva acumulación de dióxido de carbono en la troposfera.",
    options: [
      "Rompimiento de la capa de ozono.",
      "Inversión térmica.",
      "Efecto invernadero.",
      "Lluvia ácida."
    ],
    correctIndex: 2,
    explanation: "El CO₂ es un gas de efecto invernadero; su acumulación en la troposfera atrapa el calor solar, elevando la temperatura global (efecto invernadero)."
  },
  {
    id: "unam_2024_25",
    area: "Biología",
    text: "Medidas que ayudan a evitar contraer enfermedades respiratorias producidas por bacterias y virus suspendidos en el aire.\n\nI. Protegerse de los cambios de temperatura.\nII. Cubrirse la boca al toser y estornudar.\nIII. Lavarse las manos después de ir al baño.\nIV. Evitar ingerir alimentos sin antes desinfectarlos.\nV. Evitar lugares contaminados con polvo.",
    options: ["II, III y IV", "II, IV y V", "I, II y IV", "I, II y V"],
    correctIndex: 3,
    explanation: "Para prevenir infecciones respiratorias por vía aérea: D) I (protegerse del frío), II (cubrir boca al toser) y V (evitar lugares con polvo) son medidas directamente relacionadas con la transmisión aérea."
  },
  {
    id: "unam_2024_26",
    area: "Biología",
    text: "Nombre del proceso biológico que permite a los organismos pluricelulares incrementar su biomasa a través del tiempo.",
    options: ["Cariocinesis.", "Mitosis.", "Meiosis.", "Citocinesis."],
    correctIndex: 1,
    explanation: "La mitosis es el proceso de división celular que produce células hijas idénticas, permitiendo el crecimiento y la renovación de tejidos en organismos pluricelulares."
  },
  {
    id: "unam_2024_27",
    area: "Biología",
    text: "Algunos métodos anticonceptivos como ________ son de mayor riesgo para la salud porque provocan aumento de peso, hipertensión y trastornos vasculares.",
    options: [
      "las pastillas",
      "los espermicidas",
      "el diafragma",
      "el dispositivo intrauterino"
    ],
    correctIndex: 0,
    explanation: "Los anticonceptivos hormonales orales (pastillas) pueden causar efectos secundarios como aumento de peso, hipertensión arterial y riesgo de trombosis vascular."
  },
  {
    id: "unam_2024_28",
    area: "Biología",
    text: "Es la estructura subcelular responsable de la transmisión de la información genética.",
    options: ["Cromosoma.", "Ribosoma.", "Nucléolo.", "Núcleo."],
    correctIndex: 0,
    explanation: "El cromosoma es la estructura que contiene el ADN organizado y empaquetado, siendo el vehículo de transmisión de la información genética durante la división y reproducción celular."
  },

  // ─── ESPAÑOL (29-40) ───────────────────────────────────────────────────────
  {
    id: "unam_2024_29",
    area: "Español",
    text: "¿Cuál es la finalidad de las fichas bibliográficas?",
    options: [
      "Identificar una fuente consultada.",
      "Resumir el contenido de un artículo.",
      "Enumerar las ideas secundarias de un texto.",
      "Organizar las ideas principales de un documento."
    ],
    correctIndex: 0,
    explanation: "La ficha bibliográfica tiene como finalidad identificar y registrar los datos de una fuente consultada (autor, título, editorial, año, páginas) para poder localizarla y citarla."
  },
  {
    id: "unam_2024_30",
    area: "Español",
    text: "Observa la siguiente tabla y selecciona la afirmación verdadera.\n\nSustancia | Átomos por entidad | Color | Olor | Reactividad\nOxígeno | 2 | Incoloro | Inodoro | Oxidante\nOzono | 3 | Azul pálido | Acre | Muy oxidante",
    options: [
      "El ozono tiene dos átomos por unidad.",
      "El ozono es de color azul pálido e inodoro.",
      "El oxígeno es muy oxidante.",
      "El oxígeno es incoloro e inodoro."
    ],
    correctIndex: 3,
    explanation: "Según la tabla, el oxígeno es incoloro e inodoro. El ozono tiene 3 átomos (no 2), el ozono huele acre (no inodoro), y el oxígeno es oxidante (no 'muy oxidante', eso es el ozono)."
  },
  {
    id: "unam_2024_31",
    area: "Español",
    text: "¿Mediante qué recurso se desarrollan las ideas en el siguiente párrafo?\n\n'Para facilitar su estudio, los especialistas dividen la prehistoria en tres grandes etapas: el Paleolítico, el Mesolítico y el Neolítico. El periodo Paleolítico abarca desde la aparición de los primeros homínidos... El Mesolítico es una etapa de tránsito... Finalmente, la práctica de la agricultura y la ganadería es el hecho que determina el inicio del Neolítico.' (Rosario Rico et al., Historia universal.)",
    options: ["Repeticiones.", "Explicaciones.", "Paráfrasis.", "Ejemplos."],
    correctIndex: 1,
    explanation: "El párrafo desarrolla el tema mediante explicaciones: define y explica qué es cada etapa de la prehistoria (Paleolítico, Mesolítico, Neolítico) describiendo sus características."
  },
  {
    id: "unam_2024_32",
    area: "Español",
    text: "Selecciona el enunciado donde hay concordancia entre sujeto y predicado.",
    options: [
      "Los funcionarios Probkin y Svistkov, besó cada uno a su mujer.",
      "Las esposas de Probkin y de Svistkov se colocó al otro lado del cordón de guardias.",
      "Las esposas de Probkin y de Svistkov atravesaron el cordón formado por los guardias.",
      "La esposa de Probkin se ruborizaron por la amabilidad del guardia."
    ],
    correctIndex: 2,
    explanation: "Solo la opción C tiene concordancia: sujeto plural 'Las esposas de Probkin y de Svistkov' + verbo plural 'atravesaron'. Las otras mezclan singular/plural incorrectamente."
  },
  {
    id: "unam_2024_33",
    area: "Español",
    text: "Los nexos luego, después, primero, antes, hacen referencia a",
    options: ["tiempo.", "lugar.", "importancia.", "perspectiva."],
    correctIndex: 0,
    explanation: "Los nexos 'luego', 'después', 'primero' y 'antes' son conectores temporales que ordenan cronológicamente los eventos o ideas dentro de un texto."
  },
  {
    id: "unam_2024_34",
    area: "Español",
    text: "Lee el siguiente texto de Carlos Tello Díaz ('Los gordos'):\n\n'Los problemas de sobrepeso y obesidad son problemas de todos los mexicanos, pero fundamentalmente de los hombres y mujeres pobres que viven en las ciudades (en el campo, entre los pobres, son más bajos los índices de sobrepeso, aunque también resultan alarmantes)...'\n\nLas palabras subrayadas (pero, aunque) son nexos que",
    options: [
      "encadenan argumentos.",
      "jerarquizan información.",
      "presentan una causa.",
      "introducen una consecuencia."
    ],
    correctIndex: 0,
    explanation: "'Pero' y 'aunque' son nexos adversativos/concesivos que encadenan argumentos al contraponer o matizar ideas previamente expresadas."
  },
  {
    id: "unam_2024_35",
    area: "Español",
    text: "Las palabras subrayadas en el siguiente fragmento tienen como propósito:\n\n'Durante mucho tiempo el ser humano ha tenido sed de saber qué son los sueños. Mi teoría, en primer lugar, considera que son una realidad alterna...; también pueden ser considerados una forma...; finalmente, como muchos artistas han demostrado, son fruto de mentes creativas...'",
    options: [
      "indicar el modo en que surgen las ideas.",
      "establecer los lugares de los eventos.",
      "dar un orden a las ideas.",
      "señalar el tiempo en el párrafo."
    ],
    correctIndex: 2,
    explanation: "'En primer lugar', 'también' y 'finalmente' son nexos de organización que dan un orden lógico y jerárquico a las ideas presentadas en el párrafo."
  },
  {
    id: "unam_2024_36",
    area: "Español",
    text: "Elige la opción en la que se usan adecuadamente las comas y el punto y seguido.",
    options: [
      "Él tenía, en su poca experiencia, un mundo por conocer, le gustaba quitar a los ricos. Para dar a los pobres que no podían ni comer, un pan.",
      "La muchacha era huérfana pero, tenía dos hermanastras terribles sus nombres eran Anastasia y Griselda. Ellas eran mandonas, caprichosas y muy flojas.",
      "Su nombre era Bella y había sido, condenada, a vivir con una maldición que le impedía acercarse a cualquier rueca. A riesgo de quedarse en un largo sueño.",
      "Ella, la más querida, tenía catorce años. Su nombre era Blanca Nieves y amaba a las criaturas del bosque: conejos, ciervos, venados y aves."
    ],
    correctIndex: 3,
    explanation: "La opción D usa correctamente: coma para inciso explicativo ('la más querida'), punto y seguido para separar oraciones completas, y dos puntos antes de enumeración."
  },
  {
    id: "unam_2024_37",
    area: "Español",
    text: "Elige el párrafo que se ha escrito con lenguaje periodístico.",
    options: [
      "Próximos al 10 de mayo, las autoridades han emitido un comunicado para advertir a dueños de florerías, establecidos y ambulantes, que se impondrán sanciones para aquellos comerciantes que decidan aumentar el precio de las flores...",
      "Mientras contemplo tu delicado rostro, resulta inevitable recordar una rosa: de ella posees su belleza, su aroma, sus colores y su suavidad...",
      "La composición de una flor es la siguiente: gineceo o pistilo, androceo o estambres; el primer elemento es la parte femenina...",
      "Durante el mes de mayo, su florería favorita, Perfume de Gardenias, en honor a las mamás mexicanas, ofrecerá un 30% de descuento..."
    ],
    correctIndex: 0,
    explanation: "El lenguaje periodístico informa hechos actuales de manera directa y objetiva. La opción A tiene las características típicas: noticia actual, datos precisos (fecha, sujetos, consecuencias)."
  },
  {
    id: "unam_2024_38",
    area: "Español",
    text: "Lee el siguiente texto periodístico sobre el libro 'Infierno' de Dan Brown (www.jornada.unam.mx).\n\nElije cuál es el propósito del texto anterior.",
    options: [
      "Comunicar fecha y horario de la presentación del libro.",
      "Hacer un historial literario de Dan Brown.",
      "Informar acerca de una novedad editorial.",
      "Analizar la evolución literaria de Dan Brown."
    ],
    correctIndex: 2,
    explanation: "El texto informa al lector sobre la próxima publicación del libro 'Infierno' de Dan Brown, describiendo su contenido y contexto. Su propósito es informar sobre una novedad editorial."
  },
  {
    id: "unam_2024_39",
    area: "Español",
    text: "Lee el texto sobre la película 'Spare Parts' (La vida robot).\n\nEn la frase subrayada '\"Este filme es importante para la cultura latina porque se hacen pocas películas tan reales y fuertes como ésta\"', la intención de quien habla es",
    options: [
      "describir un acontecimiento.",
      "narrar un evento.",
      "justificar una acción.",
      "dar una opinión."
    ],
    correctIndex: 3,
    explanation: "La frase subrayada expresa el juicio valorativo del actor sobre la película. Dar una opinión implica emitir un juicio personal sobre algo, que es exactamente lo que hace el actor."
  },
  {
    id: "unam_2024_40",
    area: "Español",
    text: "Observa el anuncio publicitario del labial 'Super Stay 24 horas'.\n\nLa estrategia del publicista se centra en ________ las cualidades del producto.",
    options: ["exponer", "testimoniar objetivamente", "presentar puntualmente", "exagerar"],
    correctIndex: 3,
    explanation: "Observa la imagen: lee el texto del anuncio publicitario con atención. Identifica si presenta hechos objetivos, testimonios, o usa lenguaje exagerado. Frases como 'el primero que permanece 24 horas' y 'nunca ningún otro resistió tanto' son hipérboles que exageran las cualidades del producto.",
    imageUrl: "/guia2024/p40.png"
  },

  // ─── QUÍMICA (41-52) ───────────────────────────────────────────────────────
  {
    id: "unam_2024_41",
    area: "Química",
    text: "Si representamos a la molécula de agua (H₂O) mediante esferas de plastilina unidas por palillos, esta representación es",
    options: [
      "un modelo científico.",
      "una interpretación objetiva.",
      "la formulación de una teoría.",
      "una relación hipotética."
    ],
    correctIndex: 0,
    explanation: "Una representación física o visual de una entidad que no puede verse directamente (como una molécula) constituye un modelo científico, que ayuda a comprender su estructura."
  },
  {
    id: "unam_2024_42",
    area: "Química",
    text: "Propiedades que permiten cuantificar los materiales.",
    options: [
      "Masa y volumen.",
      "Peso y solubilidad.",
      "Longitud y tiempo.",
      "Densidad y temperatura."
    ],
    correctIndex: 0,
    explanation: "La masa y el volumen son propiedades extensivas que permiten cuantificar (medir la cantidad) de cualquier material. Son las únicas en la lista que expresan directamente cantidad de materia."
  },
  {
    id: "unam_2024_43",
    area: "Química",
    text: "En la síntesis del agua 2H₂(g) + O₂(g) → 2H₂O(l) si se hacen reaccionar 4 g de hidrógeno y 32 g de oxígeno, ¿cuántos g de agua se obtendrán?",
    options: ["36", "32", "20", "18"],
    correctIndex: 0,
    explanation: "Según la ecuación: 2 mol H₂ (4g) + 1 mol O₂ (32g) → 2 mol H₂O (36g). Se usan los 4g de H₂ y los 32g de O₂ completamente, produciendo 36g de agua."
  },
  {
    id: "unam_2024_44",
    area: "Química",
    text: "Se le llama ________ al material formado, con una distribución uniforme que conserva sus propiedades originales.",
    options: ["compuesto", "elemento", "mezcla homogénea", "mezcla heterogénea"],
    correctIndex: 2,
    explanation: "Una mezcla homogénea (solución) tiene distribución uniforme de sus componentes y conserva las propiedades originales de los materiales mezclados en toda su extensión."
  },
  {
    id: "unam_2024_45",
    area: "Química",
    text: "Partículas subatómicas responsables de que ocurran las reacciones químicas.",
    options: ["Neutrones.", "Electrones internos.", "Protones.", "Electrones externos."],
    correctIndex: 3,
    explanation: "Los electrones externos (de valencia) son los responsables de las reacciones químicas, ya que son los que se comparten o transfieren durante la formación y ruptura de enlaces."
  },
  {
    id: "unam_2024_46",
    area: "Química",
    text: "Si un átomo tiene 20 electrones y 40 neutrones, significa que tiene ___ protones.",
    options: ["60", "10", "20", "40"],
    correctIndex: 2,
    explanation: "En un átomo neutro, el número de electrones es igual al número de protones. Si tiene 20 electrones, entonces tiene 20 protones (Z=20, que corresponde al Calcio)."
  },
  {
    id: "unam_2024_47",
    area: "Química",
    text: "En la fórmula del H₂O existen 2 ________ de hidrógeno y 1 ________ de oxígeno.",
    options: ["moléculas – átomo", "átomos – átomo", "moléculas – molécula", "átomos – molécula"],
    correctIndex: 1,
    explanation: "El subíndice 2 en H₂O indica 2 átomos de hidrógeno, y la ausencia de subíndice en O indica 1 átomo de oxígeno. Los subíndices en fórmulas moleculares indican número de átomos."
  },
  {
    id: "unam_2024_48",
    area: "Química",
    text: "Los elementos que tienden a perder electrones, son dúctiles y maleables se consideran",
    options: ["metálicos.", "semimetales.", "halógenos.", "no metales."],
    correctIndex: 0,
    explanation: "Los metales se caracterizan por tender a perder electrones (para formar cationes), ser dúctiles (alambres) y maleables (láminas). Son las propiedades físicas y químicas típicas de los metales."
  },
  {
    id: "unam_2024_49",
    area: "Química",
    text: "Un compuesto iónico se caracteriza por las siguientes propiedades.",
    options: [
      "Alta temperatura de fusión y maleable.",
      "Sólido a temperatura ambiente y dúctil.",
      "Baja temperatura de fusión y en estado sólido aislante eléctrico.",
      "Alta temperatura de fusión y en estado líquido conductor de la corriente eléctrica."
    ],
    correctIndex: 3,
    explanation: "Los compuestos iónicos tienen alta temperatura de fusión (fuerte atracción electrostática entre iones) y en estado líquido (fundido) conducen la electricidad porque los iones se mueven libremente."
  },
  {
    id: "unam_2024_50",
    area: "Química",
    text: "En la ecuación química NaOH(ac) + HNO₃(ac) → NaNO₃(ac) + H₂O(l)\nlos reactivos son",
    options: [
      "NaNO₃ y H₂O",
      "HNO₃ y NaNO₃",
      "NaOH y NaNO₃",
      "NaOH y HNO₃"
    ],
    correctIndex: 3,
    explanation: "En una ecuación química, los reactivos están al lado izquierdo de la flecha. En NaOH + HNO₃ → NaNO₃ + H₂O, los reactivos son NaOH (hidróxido de sodio) y HNO₃ (ácido nítrico)."
  },
  {
    id: "unam_2024_51",
    area: "Química",
    text: "Con base en el Sistema Internacional de unidades (SI), la cantidad de sustancia se asocia con el",
    options: ["mol.", "kilogramo.", "gramo.", "litro."],
    correctIndex: 0,
    explanation: "En el Sistema Internacional de Unidades (SI), la unidad base para la cantidad de sustancia es el mol (símbolo: mol), definido como 6.022×10²³ entidades elementales."
  },
  {
    id: "unam_2024_52",
    area: "Química",
    text: "En la siguiente ecuación química Fe + H₂SO₄ → FeSO₄ + H₂\nse oxida el ________ y se reduce el ________.",
    options: [
      "oxígeno – hidrógeno",
      "hidrógeno – azufre",
      "hierro – hidrógeno",
      "oxígeno – hierro"
    ],
    correctIndex: 2,
    explanation: "El Fe pasa de estado 0 a +2 (pierde electrones = se oxida). El H pasa de +1 en H₂SO₄ a 0 en H₂ (gana electrones = se reduce). Por tanto, se oxida el hierro y se reduce el hidrógeno."
  },

  // ─── HISTORIA (53-64) ──────────────────────────────────────────────────────
  {
    id: "unam_2024_53",
    area: "Historia",
    text: "Indica la letra que señala el lugar al que arribó Cristóbal Colón en su primer viaje a América.\n\n(Mapa de América con puntos I, II, III, IV marcados)\nI = sur de EUA/México norte\nII = Caribe/Antillas\nIII = Venezuela/norte de Sudamérica\nIV = sur de Sudamérica",
    options: ["I", "II", "III", "IV"],
    correctIndex: 1,
    explanation: "Observa la imagen: localiza los puntos marcados en el mapa de América. En su primer viaje (1492), Colón llegó a las Islas del Caribe (isla Guanahaní, hoy Bahamas). El punto II corresponde a la región del Caribe.",
    imageUrl: "/guia2024/p53.png"
  },
  {
    id: "unam_2024_54",
    area: "Historia",
    text: "La guerra de los siete años en el siglo XVIII entre Francia e Inglaterra se considera como causa externa de la Independencia",
    options: [
      "de la Nueva España.",
      "del Virreinato de Río de la Plata.",
      "de las Indias.",
      "de las Trece Colonias."
    ],
    correctIndex: 3,
    explanation: "La Guerra de los Siete Años (1756-1763) entre Francia e Inglaterra terminó con la supremacía inglesa. Las deudas de guerra llevaron a Gran Bretaña a aumentar impuestos a sus colonias americanas, provocando la independencia de las Trece Colonias."
  },
  {
    id: "unam_2024_55",
    area: "Historia",
    text: "La Primera Guerra Mundial se desarrolló en tres fases. Relaciona el suceso con la fase a la que pertenece.\n\nFase I: Guerra de Movimientos (1914)\nFase II: Guerra de Posiciones (1915-1916)\nFase III: Final de la Guerra (1917-1918)\n\na. Ejecución del Plan Schlieffen\nb. Batallas de Verdún y el Somme\nc. Desarrollo de la guerra de Trincheras\nd. Entrada de EUA a la confrontación\ne. Batalla del Marne y paralización del avance alemán",
    options: ["I:b – II:d – III:e", "I:a – II:e – III:c", "I:c – II:a – III:b", "I:a – II:c – III:d"],
    correctIndex: 3,
    explanation: "Fase I (1914): a. Plan Schlieffen (ofensiva inicial alemana). Fase II (1915-1916): c. Guerra de Trincheras (batalla de posiciones). Fase III (1917-1918): d. Entrada de EUA que inclinó la balanza."
  },
  {
    id: "unam_2024_56",
    area: "Historia",
    text: "Inventos de la segunda mitad del siglo XX que contribuyeron al desarrollo de la humanidad y esperanza de vida.",
    options: [
      "Automóvil eléctrico, plásticos, vacuna contra la rabia y lavadora.",
      "Computadoras, aspirina, acceso a Internet y satélites artificiales.",
      "Penicilina, trasplantes de órganos, refrigerador y píldora anticonceptiva.",
      "Inyecciones de insulina, televisión a color, rayos láser y ondas de radio."
    ],
    correctIndex: 2,
    explanation: "La penicilina (1940s masificación), trasplantes de órganos (1950s-60s), refrigerador doméstico (1950s) y píldora anticonceptiva (1960) son inventos de la segunda mitad del siglo XX que mejoraron la salud y calidad de vida."
  },
  {
    id: "unam_2024_57",
    area: "Historia",
    text: "La flota estadounidense en Pearl Harbor fue atacada por los",
    options: ["japoneses.", "chinos.", "coreanos.", "rusos."],
    correctIndex: 0,
    explanation: "El 7 de diciembre de 1941, Japón atacó sorpresivamente la base naval estadounidense de Pearl Harbor (Hawái), lo que provocó la entrada de Estados Unidos en la Segunda Guerra Mundial."
  },
  {
    id: "unam_2024_58",
    area: "Historia",
    text: "Manera en que ha impactado la globalización en el mundo.",
    options: [
      "Cumplimiento del Protocolo de Kioto.",
      "Aumento de los gases contaminantes.",
      "Reducción de la tala de árboles.",
      "Producción masiva de autos eléctricos."
    ],
    correctIndex: 1,
    explanation: "La globalización ha incrementado la actividad industrial y el transporte mundial, resultando en un aumento significativo de gases contaminantes y emisiones de CO₂."
  },
  {
    id: "unam_2024_59",
    area: "Historia",
    text: "Ordena de mayor a menor importancia los cargos políticos que integraban la estructura del gobierno virreinal durante el siglo XVIII.\n\nI. Rey. II. Cabildo. III. Virrey. IV. Autoridad indígena.",
    options: ["I, III, II y IV", "I, II, III y IV", "II, III, IV y I", "III, I, IV y II"],
    correctIndex: 0,
    explanation: "En el gobierno virreinal: 1° Rey (máxima autoridad en España), 2° Virrey (representante del Rey en América), 3° Cabildo (gobierno local), 4° Autoridad indígena (nivel más local). Orden: I, III, II, IV."
  },
  {
    id: "unam_2024_60",
    area: "Historia",
    text: "Una de las características del Absolutismo Ilustrado de los borbones consistía en que el poder",
    options: [
      "lo disponía el pueblo.",
      "recaía en el rey.",
      "era propio de la nobleza.",
      "lo detentaba el clero."
    ],
    correctIndex: 1,
    explanation: "El Absolutismo Ilustrado (despotismo ilustrado) de los Borbones se caracterizó por la concentración del poder en el rey, quien gobernaba de manera absoluta pero con reformas inspiradas en la Ilustración."
  },
  {
    id: "unam_2024_61",
    area: "Historia",
    text: "Proceso de modernización de México en donde se dan los primeros pasos hacia la centralización del Estado y el fortalecimiento del poder ejecutivo.",
    options: [
      "Las Leyes de Reforma.",
      "La venta de los bienes de la iglesia.",
      "La formación del congreso constituyente.",
      "El imperio de Maximiliano de Habsburgo."
    ],
    correctIndex: 0,
    explanation: "Las Leyes de Reforma (1855-1863) bajo Benito Juárez marcaron el inicio de la modernización del Estado mexicano: separación Iglesia-Estado, registros civiles, y centralización del poder ejecutivo."
  },
  {
    id: "unam_2024_62",
    area: "Historia",
    text: "Las afirmaciones siguientes:\n\nI. Aplicó el plan sexenal como presidente de México.\nII. Nacionalizó ferrocarriles y petróleos.\nIII. Unificó al movimiento campesino en la CNC.\n\ncorresponden a medidas adoptadas por",
    options: [
      "Abelardo L. Rodríguez.",
      "Plutarco Elías Calles.",
      "Lázaro Cárdenas.",
      "Miguel Alemán."
    ],
    correctIndex: 2,
    explanation: "Lázaro Cárdenas (1934-1940): aplicó el Plan Sexenal, nationalizó el petróleo (1938) y los ferrocarriles, y fundó la CNC (Confederación Nacional Campesina) para organizar al campesinado."
  },
  {
    id: "unam_2024_63",
    area: "Historia",
    text: "Octavio Paz y Juan Rulfo, cuya obra es de gran aporte cultural, son autores mexicanos del siglo",
    options: ["XXI.", "XIX.", "XX.", "XVIII."],
    correctIndex: 2,
    explanation: "Octavio Paz (1914-1998) y Juan Rulfo (1917-1986) son escritores mexicanos del siglo XX. Paz recibió el Nobel de Literatura en 1990 y Rulfo escribió Pedro Páramo (1955)."
  },
  {
    id: "unam_2024_64",
    area: "Historia",
    text: "Uno de los objetivos del Tratado de Libre Comercio con América del Norte es",
    options: [
      "acrecentar los impuestos comerciales.",
      "limitar las exportaciones e inversiones.",
      "aumentar las oportunidades de inversión.",
      "fomentar la mano de obra de migrantes."
    ],
    correctIndex: 2,
    explanation: "El TLCAN (ahora T-MEC) tiene como objetivos eliminar barreras arancelarias, promover el comercio y aumentar las oportunidades de inversión entre México, EUA y Canadá."
  },

  // ─── MATEMÁTICAS (65-76) ───────────────────────────────────────────────────
  {
    id: "unam_2024_65",
    area: "Matemáticas",
    text: "120 es el 75% de",
    options: ["200", "180", "160", "140"],
    correctIndex: 2,
    explanation: "Si 120 = 75% de x, entonces x = 120 ÷ 0.75 = 160."
  },
  {
    id: "unam_2024_66",
    area: "Matemáticas",
    text: "La raíz cuadrada de 3.61 es",
    options: ["1.805", "1.9", "7.22", "13.0321"],
    correctIndex: 1,
    explanation: "√3.61 = 1.9, ya que 1.9² = 1.9 × 1.9 = 3.61. Verificación: 1.9 × 1.9 = 3.61 ✓"
  },
  {
    id: "unam_2024_67",
    area: "Matemáticas",
    text: "Karla compró kilo y medio de carne el domingo. Ese día utilizó la tercera parte, y el lunes la cuarta porción de lo que sobró. ¿Qué cantidad de carne tendrá el martes?",
    options: ["1/2 kg", "5/4 kg", "1/4 kg", "3/4 kg"],
    correctIndex: 3,
    explanation: "Domingo: 1.5 kg = 3/2 kg. Usó 1/3 de 3/2 = 1/2 kg. Sobró: 3/2 – 1/2 = 1 kg. Lunes: usó 1/4 de 1 kg = 1/4 kg. Le quedan: 1 – 1/4 = 3/4 kg el martes."
  },
  {
    id: "unam_2024_68",
    area: "Matemáticas",
    text: "El cuádruplo de un número disminuido en dos unidades es equivalente al triple del mismo número aumentado en una unidad. Si x representa ese número, ¿cuál de las siguientes ecuaciones permite conocer su valor?",
    options: ["4x–2 = 3x+1", "4(x–2) = 3(x + 1)", "4(x – 2) = 3x+1", "4x–2 = 3(x+1)"],
    correctIndex: 0,
    explanation: "Cuádruplo de x disminuido en 2 = 4x – 2. Triple de x aumentado en 1 = 3x + 1. La ecuación es: 4x – 2 = 3x + 1 (opción A). Solución: x = 3."
  },
  {
    id: "unam_2024_69",
    area: "Matemáticas",
    text: "En un triángulo equilátero, uno de sus lados mide 3x – 9, ¿cuál de las siguientes expresiones representa el perímetro de dicho triángulo?",
    options: ["9x² – 54x+81", "9x – 27", "9x – 9", "9x² – 81"],
    correctIndex: 1,
    explanation: "En un triángulo equilátero los 3 lados son iguales. Perímetro = 3 × lado = 3(3x – 9) = 9x – 27."
  },
  {
    id: "unam_2024_70",
    area: "Matemáticas",
    text: "Dulce tiene el doble de la edad de Silvia. Si en 6 años Dulce sumará 12 años más que Silvia, ¿cuál es la edad actual de Silvia?",
    options: ["18 años.", "12 años.", "24 años.", "30 años."],
    correctIndex: 1,
    explanation: "Sea S = edad de Silvia y D = 2S. En 6 años: D+6 = (S+6)+12 → 2S+6 = S+18 → S = 12 años. Silvia tiene 12 años y Dulce 24."
  },
  {
    id: "unam_2024_71",
    area: "Matemáticas",
    text: "La solución del sistema de ecuaciones\n\n2x – 3y = 3\n–x + 2y = –6\n\nes",
    options: ["x=12, y=–9", "x=–12, y=9", "x=12, y=9", "x=–12, y=–9"],
    correctIndex: 3,
    explanation: "De la 2ª ecuación: x = 2y + 6. Sustituyendo: 2(2y+6) – 3y = 3 → 4y+12–3y = 3 → y = –9. Entonces x = 2(–9)+6 = –12. Solución: x=–12, y=–9."
  },
  {
    id: "unam_2024_72",
    area: "Matemáticas",
    text: "La siguiente tabla presenta los resultados de una prueba de matemáticas. Suponiendo que se evaluaron a 40 alumnos, ¿cuántos obtuvieron 8 de calificación?\n\nCalificación | Frecuencia relativa\n5 | 0.04\n6 | 0.10\n7 | 0.20\n8 | 0.25\n9 | 0.30\n10 | 0.11\nTotal | 1.00",
    options: ["18", "10", "16", "12"],
    correctIndex: 1,
    explanation: "Observa la imagen: lee los datos de la tabla de frecuencias relativas. Para calificación 8, la frecuencia relativa es 0.25. Multiplica por el total: 0.25 × 40 = 10 alumnos.",
    imageUrl: "/guia2024/p72.png"
  },
  {
    id: "unam_2024_73",
    area: "Matemáticas",
    text: "Las estaturas de los integrantes de un equipo de fútbol fueron: 1.82 m, 1.78 m, 1.74 m, 1.76m, 1.76 m, 1.81 m, 1.77 m, 1.68 m, 1.74 m, 1.69 m y 1.65 m.\n\n¿Cuál fue la mediana de las estaturas ordenadas?",
    options: ["1.74 m", "1.76 m", "1.78 m", "1.81 m"],
    correctIndex: 1,
    explanation: "Ordenando los 11 datos: 1.65, 1.68, 1.69, 1.74, 1.74, 1.76, 1.76, 1.77, 1.78, 1.81, 1.82. El valor central (posición 6) es 1.76 m."
  },
  {
    id: "unam_2024_74",
    area: "Matemáticas",
    text: "Dada la figura donde las rectas que pasan por AB y CD son paralelas, el ángulo ABC y el ángulo BCD son iguales por ser",
    options: [
      "alternos internos.",
      "alternos externos.",
      "suplementarios.",
      "complementarios."
    ],
    correctIndex: 0,
    explanation: "Observa la imagen: identifica las dos rectas paralelas y la transversal. Los ángulos alternos internos se forman entre las paralelas, en lados opuestos de la transversal, y son iguales. Los ángulos ABC y BCD cumplen esa condición.",
    imageUrl: "/guia2024/p74.png"
  },
  {
    id: "unam_2024_75",
    area: "Matemáticas",
    text: "En un triángulo rectángulo, el cociente del cateto opuesto y el cateto adyacente determinan el valor de la función trigonométrica conocida como ________ del ángulo.",
    options: ["tangente", "cotangente", "coseno", "seno"],
    correctIndex: 0,
    explanation: "tan(θ) = cateto opuesto / cateto adyacente. Esta es la definición de la función trigonométrica tangente. (sen=opuesto/hipotenusa; cos=adyacente/hipotenusa)"
  },
  {
    id: "unam_2024_76",
    area: "Matemáticas",
    text: "El área del paralelogramo que se observa en la figura es\n\n(Paralelogramo con base 9 m y altura 4 m)",
    options: ["12 m²", "18 m²", "24 m²", "36 m²"],
    correctIndex: 3,
    explanation: "Observa la imagen: identifica la base y la altura perpendicular del paralelogramo (no el lado inclinado). Área = base × altura = 9 m × 4 m = 36 m².",
    imageUrl: "/guia2024/p76.png"
  },

  // ─── HABILIDAD VERBAL (77-92) ───────────────────────────────────────────────
  {
    id: "unam_2024_77",
    area: "Habilidad Verbal",
    text: "Lee el texto 'El contador de cuentos' de Carmen Báez.\n\nEl texto relata una historia en la que",
    options: [
      "el contador de cuentos dice a los niños que saca del pozo los cuentos que cuenta y él prefiere contárselos a la preguntona.",
      "un hombre que se sienta en el brocal del pozo le cuenta a una niña preguntona el secreto del pozo.",
      "el contador de cuentos embelesa a los niños con sus historias, le confiesa a la preguntona que se los cuenta el pozo.",
      "el cuentacuentos le habla a una persona que está fuera de la historia y le dice que saca los cuentos del pozo."
    ],
    correctIndex: 2,
    explanation: "El texto narra cómo el contador de cuentos embelesa a los niños con sus historias, y al ser cuestionado por 'la preguntona', le revela que los cuentos se los dice el pozo."
  },
  {
    id: "unam_2024_78",
    area: "Habilidad Verbal",
    text: "Lee el texto 'El contador de cuentos' de Carmen Báez.\n\nSelecciona el inciso que contiene el resumen correcto del texto.",
    options: [
      "Una niñita frágil es quien provoca que el contador revele su secreto, con relación al lugar de donde éste obtiene sus cuentos.",
      "El contador de cuentos es un personaje que al atardecer cuenta historias fantásticas a los niños de Palo Verde, relatos que por las noches, en días de luna, le dice el pozo.",
      "Los cuentos más bonitos que relata el contador los saca del pozo, los días de luna llena. Para escucharlos se sienta en el brocal.",
      "Ante la pregunta de una niña, el contador reconoce que sus cuentos los obtiene del pozo, en donde están revueltos con el agua y las ranas, pero hay que saber sacarlos."
    ],
    correctIndex: 1,
    explanation: "El resumen B captura los elementos esenciales: el personaje (contador), el contexto (atardecer, Palo Verde), la acción (cuenta historias a niños) y el origen de los cuentos (el pozo, en noches de luna)."
  },
  {
    id: "unam_2024_79",
    area: "Habilidad Verbal",
    text: "Lee el texto 'El contador de cuentos' de Carmen Báez.\n\nCompleta el siguiente cuadro sinóptico:\n\nNiña: Preguntona / I._____ / Blanca y crédula\nContador de cuentos: Piernas de barro / II._____ / III._____\nAuditorio: Originario de Palo Verde / Público infantil / IV._____",
    options: [
      "I.Frágil / II.Embustero / III.Imaginativo / IV.Atento",
      "I.Atenta / II.Imaginativo / III.Frágil / IV.Embustero",
      "I.Frágil / II.Atento / III.Embustero / IV.Imaginativo",
      "I.Frágil / II.Imaginativo / III.Atento / IV.Embustero"
    ],
    correctIndex: 0,
    explanation: "Observa la imagen: lee los datos del cuadro sinóptico. I=Frágil (niña 'como de cera'). II=Embustero (el contador cuyos embustes le dan importancia). III=Imaginativo (plagado de fantasía). IV=Atento (el auditorio contiene la respiración).",
    imageUrl: "/guia2024/p79.png"
  },
  {
    id: "unam_2024_80",
    area: "Habilidad Verbal",
    text: "Lee el texto 'Las tortugas marinas y nuestro tiempo' de René Márquez M.\n\nOrdena las siguientes ideas de acuerdo con su aparición en el texto:\n\nI. La explotación inadecuada de la tortuga.\nII. El lento crecimiento de la tortuga marina.\nIII. El valor comercial de la tortuga se ha disparado.\nIV. La gran depredación de algunas especies.\nV. El saqueo de nidos y de tortugas adultas.",
    options: ["I, III, II, IV y V", "II, I, IV, III y V", "II, I, IV, V y III", "II, IV, I, III y V"],
    correctIndex: 1,
    explanation: "En el texto aparecen en este orden: II (lento crecimiento), I (explotación inadecuada), IV (depredación), III (valor comercial disparado), V (saqueo de nidos). Orden: B) II, I, IV, III y V."
  },
  {
    id: "unam_2024_81",
    area: "Habilidad Verbal",
    text: "Lee el texto 'Las tortugas marinas y nuestro tiempo'.\n\nSelecciona la opción en donde hay una relación causa – consecuencia.",
    options: [
      "Debido a las restricciones administrativas el valor comercial de la tortuga se ha disparado.",
      "Durante las actividades de las pesquerías las tortugas pueden ser atrapadas incidentalmente.",
      "La explotación de la tortuga debe estar vinculada a programas de investigación para evitar una gran mortandad.",
      "Estas especies todavía tienen gran valor y aceptación comercial y son objeto de una gran depredación."
    ],
    correctIndex: 0,
    explanation: "La opción A establece una relación causa-consecuencia clara: CAUSA: restricciones administrativas → CONSECUENCIA: aumento del valor comercial. Las demás opciones son afirmaciones sin relación causal explícita."
  },
  {
    id: "unam_2024_82",
    area: "Habilidad Verbal",
    text: "Lee el texto 'Las tortugas marinas y nuestro tiempo'.\n\nSeñala cuál de las oraciones siguientes es un hecho.",
    options: [
      "Se agotaron varias poblaciones de algunas especies de tortugas marinas.",
      "Deben estar vinculadas a programas de investigación.",
      "Es necesario desarrollar una intensa campaña educativa.",
      "Las actividades clandestinas deben ser prohibidas."
    ],
    correctIndex: 0,
    explanation: "Un hecho es algo verificable que ocurrió. 'Se agotaron varias poblaciones de algunas especies de tortugas marinas' es un hecho histórico documentado (entre 1969 y 1972 según el texto). Las demás son opiniones o recomendaciones."
  },
  {
    id: "unam_2024_83",
    area: "Habilidad Verbal",
    text: "Lee el siguiente enunciado del texto 'Las tortugas marinas':\n\n'Un pequeño esfuerzo del pescador le reditúa una ganancia económica muy alta.'\n\nDe acuerdo con el contexto, la palabra subrayada 'reditúa' significa",
    options: ["producir.", "repercutir.", "representar.", "reflejar."],
    correctIndex: 0,
    explanation: "'Reditúar' significa producir o rendir utilidad o ganancia. En el contexto, el esfuerzo del pescador le produce/genera una ganancia económica alta."
  },
  {
    id: "unam_2024_84",
    area: "Habilidad Verbal",
    text: "Selecciona la opción con el par de palabras que muestra una relación ANÁLOGA a:\n\nMÚSICO es a INSTRUMENTO como",
    options: ["poeta a poesía.", "mecánico a herramienta.", "político a ley.", "carpintero a carpintería."],
    correctIndex: 1,
    explanation: "MÚSICO usa un INSTRUMENTO para su trabajo. De igual modo, un MECÁNICO usa una HERRAMIENTA para su trabajo. La relación es: profesional → herramienta de su oficio."
  },
  {
    id: "unam_2024_85",
    area: "Habilidad Verbal",
    text: "Selecciona la opción con el par de palabras que muestra una relación ANÁLOGA a:\n\nPALABRA – CONVENCER",
    options: ["lectura – dormir", "teatro – oír", "imán – atraer", "audiencia – aceptar"],
    correctIndex: 2,
    explanation: "La PALABRA se usa para CONVENCER (es el instrumento y su función). De igual modo, el IMÁN se usa para ATRAER. La relación es: instrumento → función o acción que realiza."
  },
  {
    id: "unam_2024_86",
    area: "Habilidad Verbal",
    text: "Selecciona la opción con el par de palabras que muestra una relación ANÁLOGA a:\n\nABEJA – ENJAMBRE",
    options: ["felino – cardumen", "persona – individuo", "parvada – pájaro", "perro – jauría"],
    correctIndex: 3,
    explanation: "ABEJA es el individuo y ENJAMBRE es su colectivo. Análogamente, PERRO es el individuo y JAURÍA es su colectivo. (Cardumen = grupo de peces; parvada = grupo de aves)"
  },
  {
    id: "unam_2024_87",
    area: "Habilidad Verbal",
    text: "Selecciona la opción que sustituya con un ANTÓNIMO la palabra en mayúsculas:\n\nActividades CLANDESTINAS.",
    options: ["Secretas.", "Ilícitas.", "Ocultas.", "Públicas."],
    correctIndex: 3,
    explanation: "CLANDESTINAS significa secretas, ocultas, que se hacen sin autorización. Su antónimo es PÚBLICAS: abiertas, conocidas por todos, con autorización oficial."
  },
  {
    id: "unam_2024_88",
    area: "Habilidad Verbal",
    text: "Selecciona la opción que sustituya con un ANTÓNIMO la palabra en mayúsculas:\n\nEl tejón es un mamífero carnicero CORRIENTE en Europa.",
    options: ["Exótico.", "Común.", "Rechazado.", "Despreciable."],
    correctIndex: 0,
    explanation: "CORRIENTE en este contexto significa 'común, frecuente'. Su antónimo es EXÓTICO, que significa 'extraño, raro, poco frecuente, de origen foráneo'."
  },
  {
    id: "unam_2024_89",
    area: "Habilidad Verbal",
    text: "Selecciona la opción que sustituya con un ANTÓNIMO la palabra en mayúsculas:\n\nEn algunos países se concentra la mayor parte de la DIVERSIDAD biológica del planeta.",
    options: ["Multiplicidad.", "Pluralidad.", "Variedad.", "Homogeneidad."],
    correctIndex: 3,
    explanation: "DIVERSIDAD significa variedad, multiplicidad de formas. Su antónimo es HOMOGENEIDAD: uniformidad, igualdad, ausencia de variación."
  },
  {
    id: "unam_2024_90",
    area: "Habilidad Verbal",
    text: "Selecciona la opción que sustituya con un SINÓNIMO la palabra en mayúsculas:\n\nGuy, con sus ojos dulces, como de conejo MOSTRÓ el morral vacío.",
    options: ["Reveló.", "Enseñó.", "Ocultó.", "Exhibió."],
    correctIndex: 1,
    explanation: "MOSTRÓ en este contexto significa presentar algo a la vista. El sinónimo más preciso es ENSEÑÓ, que también significa presentar algo para que sea visto. 'Reveló' implica descubrir algo oculto."
  },
  {
    id: "unam_2024_91",
    area: "Habilidad Verbal",
    text: "Selecciona la opción que sustituya con un SINÓNIMO la palabra en mayúsculas:\n\nEl médico actuó con CELERIDAD.",
    options: ["Rapidez.", "Lentitud.", "Dilación.", "Sencillez."],
    correctIndex: 0,
    explanation: "CELERIDAD significa velocidad, prontitud en el actuar. El sinónimo correcto es RAPIDEZ, que también expresa velocidad en la acción."
  },
  {
    id: "unam_2024_92",
    area: "Habilidad Verbal",
    text: "Selecciona la opción que sustituya con un SINÓNIMO la palabra en mayúsculas:\n\nLa convención nombró un presidente INTERINO.",
    options: ["Inamovible.", "Transitorio.", "Permanente.", "Intransigente."],
    correctIndex: 1,
    explanation: "INTERINO significa provisional, temporal, que ocupa un cargo temporalmente. El sinónimo es TRANSITORIO, que también significa temporal, pasajero."
  },

  // ─── GEOGRAFÍA (93-104) ────────────────────────────────────────────────────
  {
    id: "unam_2024_93",
    area: "Geografía",
    text: "Componentes del espacio geográfico que incluyen las actividades que se relacionan con la producción, transporte, comercialización y consumo de bienes y servicios.",
    options: ["Políticos.", "Sociales.", "Económicos.", "Físicos."],
    correctIndex: 2,
    explanation: "Los componentes económicos del espacio geográfico comprenden producción, distribución, intercambio y consumo de bienes y servicios."
  },
  {
    id: "unam_2024_94",
    area: "Geografía",
    text: "Con el Sistema de ________ se pueden elaborar mapas que identifiquen zonas de riesgo asociadas con el relieve.",
    options: [
      "información geográfica",
      "posicionamiento global",
      "imágenes de satélites",
      "localización"
    ],
    correctIndex: 0,
    explanation: "Los Sistemas de Información Geográfica (SIG) integran datos espaciales y permiten elaborar mapas temáticos, incluyendo mapas de riesgo relacionados con el relieve y fenómenos naturales."
  },
  {
    id: "unam_2024_95",
    area: "Geografía",
    text: "Los husos horarios son una prueba y una consecuencia de la",
    options: [
      "traslación terrestre.",
      "rotación del sol.",
      "rotación terrestre.",
      "inclinación del eje."
    ],
    correctIndex: 2,
    explanation: "La rotación de la Tierra sobre su propio eje (de oeste a este) hace que diferentes meridianos reciban la luz solar en distintos momentos, lo que da origen a los husos horarios (24 husos, uno por cada hora)."
  },
  {
    id: "unam_2024_96",
    area: "Geografía",
    text: "La preservación de los arrecifes de corales favorece el equilibrio del clima planetario porque",
    options: [
      "controlan la densidad del agua oceánica.",
      "reducen los residuos sólidos del mar y ríos.",
      "mantienen controlado el crecimiento de plancton.",
      "contribuyen en la disminución de dióxido de carbono."
    ],
    correctIndex: 3,
    explanation: "Los arrecifes de coral albergan organismos fotosintéticos que absorben CO₂ del agua marina, contribuyendo a reducir el dióxido de carbono y regulando el clima planetario."
  },
  {
    id: "unam_2024_97",
    area: "Geografía",
    text: "Son acciones para el cuidado del medio ambiente.\n\nI. Deforestación.\nII. Uso de la bicicleta.\nIII. Reciclar.\nIV. Reforestar.\nV. Uso de aerosoles.",
    options: ["I, II y III", "II, III y IV", "III, IV y V", "II, III y V"],
    correctIndex: 1,
    explanation: "Las acciones favorables al medio ambiente son: II (bicicleta = transporte limpio), III (reciclar = reduce residuos), IV (reforestar = recupera bosques). I (deforestar) y V (aerosoles) son dañinas."
  },
  {
    id: "unam_2024_98",
    area: "Geografía",
    text: "Los países con un gran tránsito migratorio son",
    options: [
      "Egipto, Alemania y Estados Unidos.",
      "Canadá, Francia y Japón.",
      "Brasil, España e India.",
      "Turquía, Marruecos y México."
    ],
    correctIndex: 3,
    explanation: "Turquía (paso entre Asia y Europa), Marruecos (paso entre África y Europa) y México (paso hacia EUA) son países de tránsito migratorio, donde los migrantes pasan sin establecerse permanentemente."
  },
  {
    id: "unam_2024_99",
    area: "Geografía",
    text: "Entidades mexicanas ubicadas en la Región Pesquera IV.",
    options: [
      "Coahuila y Chihuahua.",
      "Oaxaca y Guerrero.",
      "Sonora y Nayarit.",
      "Yucatán y Campeche."
    ],
    correctIndex: 3,
    explanation: "La Región Pesquera IV corresponde al Golfo de México y Mar Caribe, donde se ubican Yucatán y Campeche, estados con importante actividad pesquera en esa zona."
  },
  {
    id: "unam_2024_100",
    area: "Geografía",
    text: "Zona con mayor extracción petrolera en México.",
    options: [
      "Mar Caribe.",
      "Costas del Océano Pacífico.",
      "Costa del golfo de México.",
      "Mar de Cortés."
    ],
    correctIndex: 2,
    explanation: "La costa del Golfo de México, especialmente la Sonda de Campeche y los estados de Tabasco y Veracruz, concentra la mayor producción petrolera de México (Cantarell, Ku-Maloob-Zaap)."
  },
  {
    id: "unam_2024_101",
    area: "Geografía",
    text: "Son características de los países centrales.\n\nI. Controlan el desarrollo tecnológico.\nII. Exportan materias primas.\nIII. Carecen de servicios.\nIV. Controlan los mercados y capitales.\nV. Desarrollan industria manufacturera.",
    options: ["I, III y V", "III, IV y V", "II, III y IV", "I, IV, y V"],
    correctIndex: 3,
    explanation: "Los países centrales (desarrollados) se caracterizan por: I (controlan tecnología), IV (dominan mercados y capitales) y V (producen manufactura de alto valor). Los países periféricos exportan materias primas (II) y carecen de servicios (III)."
  },
  {
    id: "unam_2024_102",
    area: "Geografía",
    text: "Se establecen con el propósito de evitar conflictos y determinar hasta dónde un estado ejerce su soberanía.",
    options: ["Regiones.", "Territorios.", "Fronteras.", "Entidades."],
    correctIndex: 2,
    explanation: "Las fronteras son los límites geográficos y políticos que delimitan el territorio de un Estado, definiendo hasta dónde se ejerce su soberanía y separándolo de otros estados."
  },
  {
    id: "unam_2024_103",
    area: "Geografía",
    text: "La zona arqueológica de Palenque se encuentra en el estado de",
    options: ["Chiapas.", "Veracruz.", "Oaxaca.", "Guerrero."],
    correctIndex: 0,
    explanation: "La zona arqueológica de Palenque, importante sitio de la civilización maya, se localiza en el estado de Chiapas, México, y es Patrimonio de la Humanidad de la UNESCO."
  },
  {
    id: "unam_2024_104",
    area: "Geografía",
    text: "Está considerada como área del territorio nacional de 12 millas náuticas (22.2 km mar adentro).",
    options: [
      "Mar Territorial.",
      "Zona insular.",
      "Mar Patrimonial.",
      "Zona Económica Exclusiva."
    ],
    correctIndex: 0,
    explanation: "El Mar Territorial es la franja marina de 12 millas náuticas (22.2 km) adyacente a las costas, sobre la cual el Estado ejerce plena soberanía, según el Derecho Internacional del Mar."
  },

  // ─── FÍSICA (105-116) ──────────────────────────────────────────────────────
  {
    id: "unam_2024_105",
    area: "Física",
    text: "Si se dice que un automóvil se desplaza a 60 km/h sobre la avenida Insurgentes, de norte a sur, se está hablando de la ________ del automóvil.",
    options: ["velocidad", "aceleración", "rapidez", "fuerza"],
    correctIndex: 0,
    explanation: "La velocidad es una magnitud vectorial que incluye tanto la magnitud (60 km/h) como la dirección y sentido (de norte a sur). Cuando se especifica la dirección, es velocidad, no rapidez."
  },
  {
    id: "unam_2024_106",
    area: "Física",
    text: "Relaciona cada enunciado con el tipo de movimiento que le corresponde.\n\nI. Soltar un objeto desde lo alto de un edificio.\nII. Movimiento de la Luna respecto a la Tierra.\n\na. Movimiento Circular Uniforme.\nb. Movimiento Rectilíneo Uniformemente Acelerado.\nc. Movimiento Rectilíneo Uniformemente Variado.",
    options: ["I:c – II:b", "I:a – II:c", "I:b – II:a", "I:a – II:b"],
    correctIndex: 2,
    explanation: "I. Soltar un objeto = caída libre = MRUA (Movimiento Rectilíneo Uniformemente Acelerado, por la gravedad constante). II. La Luna orbita la Tierra = MCU (Movimiento Circular Uniforme)."
  },
  {
    id: "unam_2024_107",
    area: "Física",
    text: "Como se muestra en la figura, una persona empuja las cajas A y B, de 3 y 2 kg, respectivamente. Si la fuerza neta aplicada es de 15 N, ¿qué aceleración estará presente en la caja B?",
    options: ["1.2 m/s²", "5 m/s²", "7.5 m/s²", "3 m/s²"],
    correctIndex: 3,
    explanation: "Observa la imagen: identifica las masas de las cajas A (3 kg) y B (2 kg) y la fuerza neta (15 N). Aplica F=ma para todo el sistema: a = F/(mA+mB) = 15/(3+2) = 3 m/s². Ambas cajas tienen la misma aceleración.",
    imageUrl: "/guia2024/p107.png"
  },
  {
    id: "unam_2024_108",
    area: "Física",
    text: "A un carrito de supermercado cuya masa es m, le aplicamos una fuerza F, produciéndole una aceleración a. Si duplicamos la masa de la mercancía que contiene el carrito y mantenemos la misma fuerza ¿Cuál será el valor de la aceleración?",
    options: [
      "El doble de su valor inicial.",
      "Un cuarto de su valor inicial.",
      "Mantiene su valor inicial.",
      "La mitad de su valor inicial."
    ],
    correctIndex: 3,
    explanation: "Segunda Ley de Newton: F = ma → a = F/m. Si la masa se duplica (2m) con la misma F: a' = F/(2m) = a/2. La aceleración será la mitad del valor inicial."
  },
  {
    id: "unam_2024_109",
    area: "Física",
    text: "La magnitud de la aceleración gravitacional que se produce en la superficie de la Luna es una sexta parte de la que se produce en la superficie de la Tierra. Si se lleva un objeto hacia la luna, ¿qué le pasa a su peso con respecto al que tenía en la Tierra?",
    options: [
      "Aumenta 6 veces.",
      "Disminuye 6 veces.",
      "Disminuye 3 veces.",
      "Presenta un valor cero."
    ],
    correctIndex: 1,
    explanation: "Peso = masa × gravedad (P = mg). Si g_Luna = g_Tierra/6, entonces P_Luna = m × (g_Tierra/6) = P_Tierra/6. El peso disminuye 6 veces en la Luna."
  },
  {
    id: "unam_2024_110",
    area: "Física",
    text: "Si colocamos dos ollas metálicas, una a temperatura alta junto a otra de temperatura baja, el calor se transfiere de la de temperatura ________; tal transferencia termina hasta que ________.",
    options: [
      "alta a la baja – ambas llegan a 0 °C",
      "alta a la baja – se igualan las temperaturas",
      "alta a la baja – las dos quedan con temperatura muy baja",
      "baja a la alta – las dos quedan con temperatura muy alta"
    ],
    correctIndex: 1,
    explanation: "El calor siempre fluye del cuerpo de mayor temperatura al de menor temperatura (alta → baja). El proceso continúa hasta que ambos cuerpos alcanzan el equilibrio térmico (misma temperatura)."
  },
  {
    id: "unam_2024_111",
    area: "Física",
    text: "El choque de las partículas de un gas con las paredes del recipiente que lo contiene da lugar a la",
    options: [
      "presión del gas.",
      "temperatura del gas.",
      "energía potencial del gas.",
      "densidad del gas."
    ],
    correctIndex: 0,
    explanation: "Según la Teoría Cinética de los Gases, la presión de un gas es resultado de las colisiones de sus partículas con las paredes del recipiente. Mayor número de choques = mayor presión."
  },
  {
    id: "unam_2024_112",
    area: "Física",
    text: "En todo proceso en el que se da un cambio en el estado de agregación en la materia ocurre una ________ de energía.",
    options: ["pérdida", "ganancia", "transferencia", "creación"],
    correctIndex: 2,
    explanation: "Los cambios de estado (fusión, solidificación, evaporación, condensación) implican transferencia de energía entre el sistema y su entorno. No se crea ni destruye energía (Ley de Conservación)."
  },
  {
    id: "unam_2024_113",
    area: "Física",
    text: "La masa de un átomo está determinada por sus",
    options: [
      "electrones y neutrones.",
      "electrones.",
      "neutrones y protones.",
      "neutrones."
    ],
    correctIndex: 2,
    explanation: "La masa atómica está determinada fundamentalmente por neutrones y protones (localizados en el núcleo). Los electrones tienen masa despreciable (~1/1836 de la del protón)."
  },
  {
    id: "unam_2024_114",
    area: "Física",
    text: "El agua ________ es una sustancia conductora de electricidad.",
    options: ["con azúcar", "oxigenada", "destilada", "de mar"],
    correctIndex: 3,
    explanation: "El agua de mar contiene iones disueltos (Na⁺, Cl⁻, etc.) que permiten el paso de la corriente eléctrica. El agua destilada, pura, es muy mala conductora por carecer de iones libres."
  },
  {
    id: "unam_2024_115",
    area: "Física",
    text: "El funcionamiento de un horno de microondas se basa principalmente en el fenómeno de",
    options: [
      "ondas de ultrafrecuencia.",
      "disociación electrolítica.",
      "desintegración atómica.",
      "radiación electromagnética."
    ],
    correctIndex: 3,
    explanation: "Los hornos de microondas funcionan mediante radiación electromagnética (microondas, ~2.45 GHz) que hace vibrar las moléculas de agua de los alimentos, generando calor por fricción molecular."
  },
  {
    id: "unam_2024_116",
    area: "Física",
    text: "Cuando la luz blanca atraviesa un prisma, se presenta el fenómeno de dispersión refractiva, el cual consiste en",
    options: [
      "que, al atravesar el prisma, la luz no se altera.",
      "la descomposición de los colores que la conforman.",
      "que la luz se refracta uniformemente al pasar por el prisma.",
      "la descomposición de los colores primarios en pigmento."
    ],
    correctIndex: 1,
    explanation: "La dispersión refractiva ocurre cuando la luz blanca pasa por un prisma y se descompone en sus colores constituyentes (espectro visible: rojo, naranja, amarillo, verde, azul, añil, violeta), porque cada color se refracta a diferente ángulo."
  },

  // ─── FORMACIÓN CÍVICA Y ÉTICA (117-128) ─────────────────────────────────────
  {
    id: "unam_2024_117",
    area: "Formación Cívica y Ética",
    text: "Selecciona el caso donde compete sólo al interesado tomar decisiones.",
    options: [
      "Clemente, médico gastroenterólogo con gran experiencia, ha encontrado un método para la cura de la gastritis y necesita realizar pruebas que le permitan perfeccionarlo.",
      "Después de varios años, Carmen ha logrado juntar una buena cantidad de dinero y por fin se le presenta la oportunidad de donar todo su capital al orfanatorio donde se educó.",
      "Patricio, destacado estudiante de secundaria, ha sido seleccionado para realizar una estancia de estudios por un año en uno de los estados de Norteamérica.",
      "Eulalio, entrenador de fútbol, ha recibido una invitación para participar con su equipo en un torneo amistoso que tendrá lugar en las ciudades más importantes del país."
    ],
    correctIndex: 1,
    explanation: "Carmen decide donar su propio dinero (decisión que solo le afecta a ella como titular del capital). Las otras situaciones involucran terceros: pacientes, estudiantes, equipo."
  },
  {
    id: "unam_2024_118",
    area: "Formación Cívica y Ética",
    text: "Un ejemplo de valor moral deseable en los estudiantes es que",
    options: [
      "sean honestos en los exámenes.",
      "hagan sus tareas con limpieza.",
      "sean creativos al hacer sus trabajos.",
      "coman frutas y verduras."
    ],
    correctIndex: 0,
    explanation: "La honestidad en los exámenes es un valor moral (implica integridad, respeto a las reglas y a los demás). Las otras opciones describen hábitos o habilidades, no valores morales."
  },
  {
    id: "unam_2024_119",
    area: "Formación Cívica y Ética",
    text: "La identidad personal se forma gracias a",
    options: [
      "la familia, las costumbres y las instituciones.",
      "la familia, la memoria y los amigos.",
      "las emociones, los grupos sociales y el gobierno.",
      "la religión, los amigos y el colegio."
    ],
    correctIndex: 0,
    explanation: "La identidad personal se construye a través de la familia (primer entorno de socialización), las costumbres (cultura y tradiciones) y las instituciones (escuela, sociedad, Estado)."
  },
  {
    id: "unam_2024_120",
    area: "Formación Cívica y Ética",
    text: "El dueño de un establecimiento paga a sus empleados adolescentes un sueldo menor al salario mínimo argumentando que no tienen necesidades importantes que satisfacer. Esta situación describe un tipo de",
    options: [
      "favoritismo económico empresarial.",
      "violencia económica a los adolescentes.",
      "violencia psicológica a los adolescentes.",
      "economía propia de la adolescencia."
    ],
    correctIndex: 1,
    explanation: "Pagar menos del salario mínimo constituye violencia económica: vulnera los derechos laborales de los adolescentes y los discrimina por su edad, lo cual es ilegal."
  },
  {
    id: "unam_2024_121",
    area: "Formación Cívica y Ética",
    text: "Esta forma de agresión se establece entre dos o más personas y se manifiesta mediante insultos, ofensas verbales y faltas de respeto.",
    options: ["Abuso sexual.", "Negligencia.", "Violencia económica.", "Maltrato."],
    correctIndex: 3,
    explanation: "El maltrato (verbal/psicológico) se manifiesta a través de insultos, ofensas y faltas de respeto entre personas. Es diferente al abuso sexual (violación de integridad física), negligencia (abandono) o violencia económica."
  },
  {
    id: "unam_2024_122",
    area: "Formación Cívica y Ética",
    text: "Es el valor que consiste en la facultad que tienen los seres humanos para actuar según su propio parecer, en un sentido u otro, por lo que son responsables de los actos que realizan",
    options: ["libertad.", "tolerancia.", "reciprocidad.", "integridad."],
    correctIndex: 0,
    explanation: "La libertad es la facultad de actuar según el propio albedrío y ser responsable de las consecuencias de los propios actos. Implica autonomía y responsabilidad personal."
  },
  {
    id: "unam_2024_123",
    area: "Formación Cívica y Ética",
    text: "El poder ________, de acuerdo con la Constitución, interpreta y aplica las normas para resolver conflictos.",
    options: ["legislativo", "ejecutivo", "absoluto", "judicial"],
    correctIndex: 3,
    explanation: "El poder judicial es el encargado de interpretar y aplicar las leyes para resolver conflictos entre particulares o entre éstos y el Estado, garantizando el Estado de Derecho."
  },
  {
    id: "unam_2024_124",
    area: "Formación Cívica y Ética",
    text: "Asociaciones de ciudadanos que se forman para obtener puestos de elección popular.",
    options: [
      "Las mesas electorales.",
      "Los institutos electorales.",
      "Los tribunales electorales.",
      "Los partidos políticos."
    ],
    correctIndex: 3,
    explanation: "Los partidos políticos son organizaciones de ciudadanos que se agrupan para participar en la vida democrática, postular candidatos y obtener puestos de elección popular."
  },
  {
    id: "unam_2024_125",
    area: "Formación Cívica y Ética",
    text: "Son obligaciones del gobierno para con los ciudadanos el proporcionar los servicios de",
    options: [
      "trabajo, alimentación y salud.",
      "salud, educación y seguridad.",
      "alimentación, salud y educación.",
      "educación, alimentación y trabajo."
    ],
    correctIndex: 1,
    explanation: "Las obligaciones básicas del Estado hacia los ciudadanos incluyen garantizar salud (servicios médicos), educación (escuelas públicas) y seguridad (orden público y protección)."
  },
  {
    id: "unam_2024_126",
    area: "Formación Cívica y Ética",
    text: "Un medio de comunicación cumple con una función social cuando",
    options: [
      "organiza la ayuda para los damnificados por desastres naturales.",
      "está involucrado en el servicio al sistema económico y la publicidad.",
      "forma opiniones basadas en los comentarios de terceros.",
      "convence al receptor sobre un tema específico mediante la persuasión."
    ],
    correctIndex: 0,
    explanation: "Un medio de comunicación cumple función social cuando su actividad beneficia directamente a la comunidad, como organizar ayuda para damnificados por desastres naturales."
  },
  {
    id: "unam_2024_127",
    area: "Formación Cívica y Ética",
    text: "Es importante cuidar el ambiente natural con el fin de",
    options: [
      "lograr el pleno desarrollo de las sociedades.",
      "cambiar los patrones de consumo actuales.",
      "seguir con acciones que explotan los recursos del medio.",
      "satisfacer las necesidades del ser humano."
    ],
    correctIndex: 0,
    explanation: "Cuidar el ambiente natural es fundamental para el pleno desarrollo de las sociedades, ya que los recursos naturales son la base del bienestar humano, la economía y la calidad de vida."
  },
  {
    id: "unam_2024_128",
    area: "Formación Cívica y Ética",
    text: "Juan y Ana acaban de rentar un departamento con descomposturas. Deciden ir con José (el dueño) a pedirle las reparaciones, a lo que José se niega. Juan y Ana solicitan la intervención de las autoridades.\n\nCuando Juan y Ana buscan hablar con José para solucionar el conflicto están usando el recurso llamado",
    options: ["mediación.", "arbitraje.", "negociación.", "legalidad."],
    correctIndex: 2,
    explanation: "La negociación es el proceso en el que las partes involucradas en un conflicto dialogan directamente entre sí para llegar a un acuerdo. Juan y Ana van directamente con José a dialogar."
  }
];
