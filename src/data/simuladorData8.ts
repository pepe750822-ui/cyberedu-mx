import type { Question } from "./simuladorData";

export const bank8Questions: Question[] = [
  // ─── HABILIDAD MATEMÁTICA (1-16) ───────────────────────────────────────────
  {
    id: "unam_2023_01",
    area: "Habilidad Matemática",
    text: "¿Qué números continúan en la siguiente sucesión?\n\n50, 13, 40, 11, 30, 9, __, __, ...",
    options: ["20, 6", "20, 7", "20, 8", "10, 6"],
    correctIndex: 1,
    explanation: "La sucesión alterna dos series: 50, 40, 30, 20 (resta 10) y 13, 11, 9, 7 (resta 2). Los siguientes términos son 20 y 7."
  },
  {
    id: "unam_2023_02",
    area: "Habilidad Matemática",
    text: "El número que sigue en la sucesión\n\n1, 3, 9, 11, 33, 35, __ es",
    options: ["105", "46", "44", "38"],
    correctIndex: 0,
    explanation: "El patrón alterna ×3 y +2: 1×3=3, 3+2=5 (NO); revisando: 1, ×3→3, +2→5... El patrón real es ×3, +2, ×3, +2: 1→3(×3), 3→9(×3), 9→11(+2), 11→33(×3), 33→35(+2), 35→105(×3). Respuesta: 105."
  },
  {
    id: "unam_2023_03",
    area: "Habilidad Matemática",
    text: "Encuentra los términos que continúan la sucesión.\n\n2, 11, 12, 14, 72, 17, __, __, ...",
    options: ["432, 20", "430, 21", "360, 19", "432, 23"],
    correctIndex: 0,
    explanation: "La sucesión alterna dos series: (2, 12, 72, 432) con patrón ×6, y (11, 14, 17, 20) con patrón +3. Siguientes: 72×6=432 y 17+3=20."
  },
  {
    id: "unam_2023_04",
    area: "Habilidad Matemática",
    text: "¿Qué números completan la secuencia de la cadena?\n\n20 | 15 | 19 | 18 | 17 | 24 | 14 | ? | ?",
    options: ["30, 10", "33, 10", "33, 12", "36, 13"],
    correctIndex: 1,
    explanation: "Observa la imagen: la cadena tiene dos grupos de números alternados. Primer grupo (20, 19, 17, 14, ?): resta 1, 2, 3, 4 → falta 10. Segundo grupo (15, 18, 24, 33, ?): suma 3, 6, 9 → falta 33.",
    imageUrl: "https://lruwnuldlltwktdfrwho.supabase.co/storage/v1/object/public/simulador-imagenes/guia2023/p04.png"
  },
  {
    id: "unam_2023_05",
    area: "Habilidad Matemática",
    text: "¿Cuál es la figura que continúa en la siguiente serie?\n\n(Observa la imagen: cada figura tiene la mitad izquierda con cuadrícula densa y el resto en blanco; el patrón rota el área rayada)",
    options: [
      "Cuadrado con líneas horizontales en mitad superior izquierda",
      "Cuadrado con líneas verticales en mitad izquierda",
      "Cuadrado con líneas diagonales en esquina superior izquierda",
      "Cuadrado con cuadrícula densa en esquina inferior derecha"
    ],
    correctIndex: 3,
    explanation: "Observa la imagen: identifica el patrón que siguen las figuras (rotación del área cuadriculada). El área rayada rota 90° en sentido horario en cada paso: mitad izquierda → mitad inferior → dispersa → esquina inferior derecha (opción D).",
    imageUrl: "https://lruwnuldlltwktdfrwho.supabase.co/storage/v1/object/public/simulador-imagenes/guia2023/p05.png"
  },
  {
    id: "unam_2023_06",
    area: "Habilidad Matemática",
    text: "¿Cuál es la figura que continúa en la siguiente serie?\n\n(La serie alterna: rectángulo negro | figura con X grande | rectángulo negro | figura con X mediana — observa la imagen)",
    options: [
      "Cuadrado dividido: bloque negro arriba-izquierda y blanco abajo-derecha",
      "Cuadrado con X grande en negro sobre fondo blanco",
      "Cuadrado con X mediana negra inclinada",
      "Dos rectángulos negros apilados horizontalmente (negro|blanco / blanco|negro)"
    ],
    correctIndex: 3,
    explanation: "Observa la imagen: identifica el patrón que siguen las figuras (tipo de relleno y disposición). La serie alterna: rectángulo negro → X grande → rectángulo negro → X mediana → rectángulo negro (opción D con disposición de bloques negros).",
    imageUrl: "https://lruwnuldlltwktdfrwho.supabase.co/storage/v1/object/public/simulador-imagenes/guia2023/p06.png"
  },
  {
    id: "unam_2023_07",
    area: "Habilidad Matemática",
    text: "El número de cubos que tendrá la octava figura de la siguiente sucesión es\n\n(Figura 1: 1 cubo solo; Figura 2: fila de 3 cubos en L; Figura 3: pirámide de 6 cubos — observa la imagen)",
    options: ["28", "35", "36", "45"],
    correctIndex: 2,
    explanation: "Observa la imagen: cuenta los cubos en cada figura de la sucesión (F1=1, F2=3, F3=6...). Sigue la fórmula de números triangulares F(n)=n(n+1)/2. Para la octava figura: F8 = 8×9/2 = 36 cubos.",
    imageUrl: "https://lruwnuldlltwktdfrwho.supabase.co/storage/v1/object/public/simulador-imagenes/guia2023/p07.png"
  },
  {
    id: "unam_2023_08",
    area: "Habilidad Matemática",
    text: "¿Cuál es la figura que sigue para completar la secuencia?\n\n(La secuencia tiene 4 círculos: 1°=sombreado con X inscrita dividiendo en 4, 2°=mitad izquierda sombreada, 3°=sin sombra, 4°=cuarto inferior derecho sombreado — observa la imagen)",
    options: [
      "Círculo inscrito en cuadrado sin sombra interior",
      "Círculo con mitad izquierda sombreada",
      "Círculo con cuarto superior derecho sombreado e inscripción",
      "Círculo con cuarto inferior izquierdo sombreado"
    ],
    correctIndex: 3,
    explanation: "Observa la imagen: identifica el patrón de la zona sombreada en cada figura (posición y tamaño). La sombra rota 90° antihorario en cada paso: completa → mitad izq → sin sombra → cuarto inf-der → cuarto inf-izq (opción D).",
    imageUrl: "https://lruwnuldlltwktdfrwho.supabase.co/storage/v1/object/public/simulador-imagenes/guia2023/p08.png"
  },
  {
    id: "unam_2023_09",
    area: "Habilidad Matemática",
    text: "¿Cuántos hexágonos hay en la figura siguiente?\n\n(Figura con patrón de rombos blancos y negros que forman hexágonos)",
    options: ["7", "6", "10", "3"],
    correctIndex: 3,
    explanation: "Observa la imagen: identifica los rombos blancos sobre el fondo negro. Tres rombos blancos adyacentes forman un hexágono. Cuenta únicamente los grupos completos de 3 rombos (los del borde no completan hexágono): hay 3 hexágonos completos.",
    imageUrl: "https://lruwnuldlltwktdfrwho.supabase.co/storage/v1/object/public/simulador-imagenes/guia2023/p09.png"
  },
  {
    id: "unam_2023_10",
    area: "Habilidad Matemática",
    text: "¿Cuántos cuadrados hay en la siguiente figura?\n\n(Figura de 2×2 cuadrados pequeños)",
    options: ["4", "5", "7", "8"],
    correctIndex: 1,
    explanation: "Observa la imagen: cuenta todos los cuadrados posibles, no solo los más pequeños. En una cuadrícula 2×2: 4 cuadrados individuales (1×1) + 1 cuadrado grande que los contiene todos (2×2) = 5 cuadrados en total.",
    imageUrl: "https://lruwnuldlltwktdfrwho.supabase.co/storage/v1/object/public/simulador-imagenes/guia2023/p10.png"
  },
  {
    id: "unam_2023_11",
    area: "Habilidad Matemática",
    text: "Observa la figura y selecciona la opción que la representa después de ser girada 90° en el sentido de las manecillas del reloj.\n\n(La figura original es una forma en L de cubos 3D con la extensión hacia arriba-izquierda — observa la imagen)",
    options: [
      "Forma en L con extensión hacia abajo-izquierda",
      "Forma en L con extensión hacia arriba-derecha (plana)",
      "Forma en L con extensión hacia la derecha (rotación 90° horaria correcta)",
      "Forma en L con extensión hacia abajo-derecha"
    ],
    correctIndex: 2,
    explanation: "Observa la imagen: al girar 90° en sentido horario, lo que apunta hacia arriba pasa a apuntar a la derecha. Aplica esa regla a cada parte de la figura en L. El brazo superior-izquierdo queda apuntando a la derecha — opción C.",
    imageUrl: "https://lruwnuldlltwktdfrwho.supabase.co/storage/v1/object/public/simulador-imagenes/guia2023/p11.png"
  },
  {
    id: "unam_2023_12",
    area: "Habilidad Matemática",
    text: "Selecciona la posición de la siguiente figura cuando se rota 180°.\n\n(La figura original es una constelación de cubos 3D dispersos — observa la imagen)",
    options: [
      "Constelación de cubos con agrupación densa en zona superior",
      "Constelación de cubos con filas ordenadas horizontalmente",
      "Constelación de cubos invertida 180° respecto al original",
      "Constelación de cubos con distribución espejo vertical"
    ],
    correctIndex: 2,
    explanation: "Observa la imagen: visualiza mentalmente la figura girada 180°. Lo que estaba arriba queda abajo y lo que estaba a la izquierda queda a la derecha (volteo completo). La opción C muestra la posición correcta.",
    imageUrl: "https://lruwnuldlltwktdfrwho.supabase.co/storage/v1/object/public/simulador-imagenes/guia2023/p12.png"
  },
  {
    id: "unam_2023_13",
    area: "Habilidad Matemática",
    text: "¿Cuál es el número que falta en el último triángulo?\n\nTriángulo 1: vértice 1, lados 4 y 3, base 1\nTriángulo 2: vértice 2, lados 12 y 5, base 2\nTriángulo 3: vértice 3, lados ? y 7, base 3",
    options: ["13", "23", "24", "31"],
    correctIndex: 2,
    explanation: "Observa la imagen: analiza los números dentro de cada triángulo para encontrar el patrón. T1: 4 = 1×3+1; T2: 12 = 2×5+2; T3: ? = 3×7+3 = 21+3 = 24.",
    imageUrl: "https://lruwnuldlltwktdfrwho.supabase.co/storage/v1/object/public/simulador-imagenes/guia2023/p13.png"
  },
  {
    id: "unam_2023_14",
    area: "Habilidad Matemática",
    text: "¿Cuál es el número que falta en el siguiente cuadro?\n\n| 20 |  4 | 16 |\n| 28 |  8 | 20 |\n| 40 |  ? | 30 |",
    options: ["10", "12", "16", "18"],
    correctIndex: 0,
    explanation: "Observa la imagen: lee los datos de la tabla por columna. Col1 (20,28,40): +8,+12. Col3 (16,20,30): +4,+10. Col2 = Col1−Col3: 20−16=4, 28−20=8, 40−30=10. El número faltante es 10.",
    imageUrl: "https://lruwnuldlltwktdfrwho.supabase.co/storage/v1/object/public/simulador-imagenes/guia2023/p14.png"
  },
  {
    id: "unam_2023_15",
    area: "Habilidad Matemática",
    text: "La suma de un número con el triple de otro es 18; y la diferencia del primero con el doble del segundo es 8. ¿Cuáles son esos números?",
    options: ["24 y –2", "24 y 2", "12 y 2", "12 y –2"],
    correctIndex: 2,
    explanation: "Sistema: x + 3y = 18 y x – 2y = 8. Restando: 5y = 10 → y = 2. Sustituyendo: x + 6 = 18 → x = 12. Los números son 12 y 2."
  },
  {
    id: "unam_2023_16",
    area: "Habilidad Matemática",
    text: "Una máquina llena 150 botellas en 20 minutos. A esta misma razón, ¿cuántos minutos tardará el llenado de 60 botellas?",
    options: ["4", "6", "8", "10"],
    correctIndex: 2,
    explanation: "Razón: 150 botellas / 20 min = 7.5 botellas/min. Para 60 botellas: 60 ÷ 7.5 = 8 minutos."
  },

  // ─── BIOLOGÍA (17-28) ──────────────────────────────────────────────────────
  {
    id: "unam_2023_17",
    area: "Biología",
    text: "La ________ es la característica de los seres vivos donde el organismo responde a estímulos.",
    options: ["alimentación", "irritabilidad", "nutrición", "reproducción"],
    correctIndex: 1,
    explanation: "La irritabilidad (o excitabilidad) es la capacidad de los seres vivos para percibir y responder a estímulos del ambiente interno y externo."
  },
  {
    id: "unam_2023_18",
    area: "Biología",
    text: "Promueve el cambio de las especies, según la teoría de la evolución propuesta por Darwin.",
    options: ["Necesidad interna al cambio.", "Ausencia de mutaciones.", "Selección natural.", "Herencia de caracteres adquiridos."],
    correctIndex: 2,
    explanation: "Darwin propuso la selección natural como el mecanismo principal del cambio evolutivo: los individuos mejor adaptados sobreviven y se reproducen más."
  },
  {
    id: "unam_2023_19",
    area: "Biología",
    text: "En México, uno de los factores más importantes que dañan la biodiversidad es ________ de especies en peligro de extinción.",
    options: ["la crianza de animales", "la venta clandestina", "la exhibición en zoológicos", "el cultivo masivo"],
    correctIndex: 1,
    explanation: "El tráfico y venta clandestina de especies silvestres es uno de los principales factores que amenazan la biodiversidad en México."
  },
  {
    id: "unam_2023_20",
    area: "Biología",
    text: "Conciliar el crecimiento económico de la población con la renovabilidad y permanencia de los recursos naturales, tanto en la actualidad como a futuro, es una medida del",
    options: ["crecimiento político.", "desarrollo sustentable.", "desarrollo industrial.", "equilibrio urbano."],
    correctIndex: 1,
    explanation: "El desarrollo sustentable busca satisfacer las necesidades del presente sin comprometer la capacidad de las generaciones futuras para satisfacer las suyas."
  },
  {
    id: "unam_2023_21",
    area: "Biología",
    text: "La manipulación de genes en la obtención de transgénicos es un producto de la interacción de",
    options: ["ciencia y conocimiento empírico.", "ciencia y tecnología.", "conocimiento empírico y científico.", "conocimiento científico y ciencia."],
    correctIndex: 1,
    explanation: "Los organismos transgénicos resultan de la biotecnología, que combina el conocimiento científico (genética molecular) con la tecnología (herramientas de ingeniería genética)."
  },
  {
    id: "unam_2023_22",
    area: "Biología",
    text: "Los helechos convierten la energía lumínica del sol en energía química de las moléculas de azúcar, a través de la",
    options: ["fermentación.", "respiración.", "fotosíntesis.", "excreción."],
    correctIndex: 2,
    explanation: "La fotosíntesis es el proceso mediante el cual los organismos fotosintéticos (como los helechos) transforman la energía solar en energía química almacenada en moléculas de glucosa."
  },
  {
    id: "unam_2023_23",
    area: "Biología",
    text: "Los organismos heterótrofos",
    options: [
      "utilizan la energía del Sol para sintetizar sus alimentos.",
      "transforman la energía de la luz en energía química.",
      "sintetizan su alimento mediante el proceso de fotosíntesis.",
      "dependen de otros organismos para obtener su alimento."
    ],
    correctIndex: 3,
    explanation: "Los heterótrofos no pueden sintetizar su propio alimento y deben consumir otros organismos (animales, hongos, la mayoría de bacterias) para obtener energía y nutrientes."
  },
  {
    id: "unam_2023_24",
    area: "Biología",
    text: "¿Cuál de los siguientes alimentos es rico en almidón?",
    options: ["Mantequilla.", "Papa.", "Queso.", "Piña."],
    correctIndex: 1,
    explanation: "La papa es un tubérculo con alto contenido de almidón (polisacárido de almacenamiento de energía). La mantequilla y el queso son ricos en grasas y proteínas."
  },
  {
    id: "unam_2023_25",
    area: "Biología",
    text: "Recomendación para evitar enfermedades respiratorias ante condiciones ambientales desfavorables.",
    options: [
      "Evitar orear habitaciones.",
      "Contar con clima artificial.",
      "Realizar ejercicio diariamente.",
      "Consumir líquidos y cítricos."
    ],
    correctIndex: 3,
    explanation: "Consumir abundantes líquidos mantiene las mucosas hidratadas, y los cítricos (vitamina C) fortalecen el sistema inmune, ayudando a prevenir enfermedades respiratorias."
  },
  {
    id: "unam_2023_26",
    area: "Biología",
    text: "Tipo de reproducción biológica cuyo propósito es la producción de individuos diferentes al progenitor.",
    options: ["Asexual.", "Gemación.", "Bipartición.", "Sexual."],
    correctIndex: 3,
    explanation: "La reproducción sexual combina material genético de dos progenitores, generando descendencia genéticamente diferente a ambos padres, favoreciendo la variabilidad."
  },
  {
    id: "unam_2023_27",
    area: "Biología",
    text: "Los anticonceptivos _______ presentan mayor porcentaje de eficacia que los _______.",
    options: [
      "físicos – hormonales",
      "naturales – hormonales",
      "químicos – naturales",
      "naturales – mecánicos"
    ],
    correctIndex: 2,
    explanation: "Los métodos anticonceptivos químicos (espermicidas combinados) tienen mayor eficacia que los métodos naturales (ritmo, Billings), que dependen de la disciplina del usuario."
  },
  {
    id: "unam_2023_28",
    area: "Biología",
    text: "Una de las características de la manipulación genética es",
    options: [
      "la selección de genes específicos de un organismo para incorporarlos en otro y darle a éste características que no tenía.",
      "el intercambio de genes únicamente en organismos animales para modificar sus características.",
      "la combinación de organismos de reproducción asexual para mejorar sus características.",
      "el intercambio de genes únicamente en organismos vegetales para modificar sus características."
    ],
    correctIndex: 0,
    explanation: "La ingeniería genética permite transferir genes de un organismo a otro (de cualquier especie), otorgando características nuevas al organismo receptor (transgénicos)."
  },

  // ─── ESPAÑOL (29-40) ───────────────────────────────────────────────────────
  {
    id: "unam_2023_29",
    area: "Español",
    text: "La ficha ________ tiene la función de ayudarnos a conservar los datos de una obra.",
    options: ["mesográfica", "de cita textual", "de trabajo", "bibliográfica"],
    correctIndex: 3,
    explanation: "La ficha bibliográfica registra los datos de identificación de una obra (autor, título, editorial, año, lugar), permitiendo localizarla y citarla correctamente."
  },
  {
    id: "unam_2023_30",
    area: "Español",
    text: "Ordena cronológicamente los siguientes párrafos del texto 'De las crónicas de la ciudad' de Jairo Aníbal Niño:\n\nI. Entonces la muchedumbre se abalanzó contra el ladrón...\nII. Saltó con agilidad un pequeño charco... De pronto, se dio cuenta que su finísimo reloj de oro había desaparecido.\nIII. El señor presidente... se paseaba por el mercado público...\nIV. Se empinó en la punta de sus zapatos de charol... ¡Al ladrón!",
    options: ["II, I, III y IV", "I, IV, II y III", "III, II, IV y I", "III, IV, II y I"],
    correctIndex: 2,
    explanation: "El orden lógico-cronológico es: III (el presidente pasea por el mercado), II (el robo del reloj), IV (grita '¡Al ladrón!'), I (la muchedumbre atrapa al ladrón)."
  },
  {
    id: "unam_2023_31",
    area: "Español",
    text: "En el siguiente párrafo, ¿qué recurso se ha empleado predominantemente para desarrollar el tema?\n\n'Hay quienes son adictos a una persona... Tengo una amiga que siempre se queja... Otra más siente que siempre tiene que estar enamorada...' (Karla Covarrubias, Las nuevas adicciones)",
    options: ["Paráfrasis.", "Explicación.", "Ejemplificación.", "Reiteración."],
    correctIndex: 2,
    explanation: "El texto desarrolla el tema de las adicciones emocionales mediante ejemplificación: presenta casos concretos ('una amiga', 'otra más') para ilustrar el concepto."
  },
  {
    id: "unam_2023_32",
    area: "Español",
    text: "En el siguiente texto, la frase subrayada sirve para:\n\n'En un medio transparente se puede comprobar claramente el fenómeno de la refracción. Por ejemplo, cuando introducimos lentamente un popote en un vaso de agua...' (Daniel Martín Reyna)",
    options: ["presentar una causa.", "encadenar argumentos.", "introducir una idea.", "indicar simultaneidad."],
    correctIndex: 2,
    explanation: "'Por ejemplo' es un nexo que sirve para introducir una ilustración o ejemplo que aclara la idea expuesta anteriormente sobre la refracción."
  },
  {
    id: "unam_2023_33",
    area: "Español",
    text: "Lee el siguiente texto de Juan Manuel de Prada ('El hombre que quiso conocer a la luna'):\n\n'Al instante... Ganumi comenzó a recoger la cuerda... Después de eso el hombre invitó a los demás... Primero la gente no quiso tomarlos... luego todo el mundo tomó un poco...'\n\nLas palabras subrayadas son nexos que",
    options: [
      "tienen un significado concesivo.",
      "introducen ideas y argumentos.",
      "relacionan temporalmente los enunciados.",
      "tienen un significado causal."
    ],
    correctIndex: 2,
    explanation: "'Al instante', 'Después de eso', 'Primero' y 'luego' son nexos temporales que ordenan cronológicamente los eventos narrados."
  },
  {
    id: "unam_2023_34",
    area: "Español",
    text: "Lee el texto de Carlos Tello Díaz ('Los gordos'):\n\n'Los problemas de sobrepeso y obesidad son problemas de todos los mexicanos, pero fundamentalmente de los hombres y mujeres pobres que viven en las ciudades (en el campo, entre los pobres, son más bajos los índices de sobrepeso, aunque también resultan alarmantes)...'\n\nLas palabras subrayadas son nexos que",
    options: ["encadenan argumentos.", "jerarquizan información.", "presentan una causa.", "introducen una consecuencia."],
    correctIndex: 0,
    explanation: "'Pero' y 'aunque' son nexos adversativos/concesivos que encadenan argumentos contraponiendo ideas, estableciendo matices dentro del razonamiento."
  },
  {
    id: "unam_2023_35",
    area: "Español",
    text: "Las oraciones que conforman el siguiente texto deben estar separadas por:\n\n'En 1810 había muchas fábricas de chocolate porque nuestros abuelos desayunaban con chocolate__ tomaban chocolate a la hora de la siesta__ bebían chocolate en la merienda y cenaban chocolate.'",
    options: ["punto y coma.", "comas.", "punto y aparte.", "punto y seguido."],
    correctIndex: 1,
    explanation: "Las oraciones de la serie (desayunaban, tomaban, bebían) son elementos enumerativos paralelos que se separan con comas, ya que forman parte de la misma oración principal."
  },
  {
    id: "unam_2023_36",
    area: "Español",
    text: "Se utiliza para introducir una definición o concepto, antes de escribir una cita textual, después del vocativo y antes de iniciar una enumeración.",
    options: ["Punto y aparte.", "Punto y coma.", "Dos puntos.", "Coma."],
    correctIndex: 2,
    explanation: "Los dos puntos (:) se usan para introducir definiciones, citas textuales, enumeraciones y después del vocativo en cartas y discursos."
  },
  {
    id: "unam_2023_37",
    area: "Español",
    text: "Lee el siguiente párrafo e indica a qué categoría pertenecen los elementos subrayados:\n\n'Jorge era un hombre, un grave guerrero, hermoso a su manera, digno de la admiración... Alto y membrudo... pálido, de garzos ojos, una puntiaguda barba castaña lo hacía más varonil.'",
    options: ["Sustantivos.", "Gerundios.", "Participios.", "Adjetivos."],
    correctIndex: 3,
    explanation: "Las palabras subrayadas (grave, hermoso, digno, pálido, puntiaguda, varonil) son adjetivos que califican al sustantivo 'Jorge', describiendo sus características."
  },
  {
    id: "unam_2023_38",
    area: "Español",
    text: "El fragmento es una narración porque\n\n'El siglo XX es el siglo del gran error del arte... En 1917 Marcel Duchamp hizo del sentido del humor la nueva filosofía... Al llamar a un urinario Fuente, Duchamp inventó el anti-arte...' (Avelina Lesper)",
    options: [
      "hace uso de tiempos verbales en pasado.",
      "confronta dos visiones del arte.",
      "utiliza adjetivos para describir hechos.",
      "aborda el concepto de arte."
    ],
    correctIndex: 0,
    explanation: "El texto narra eventos históricos usando tiempos verbales en pasado ('hizo', 'inventó', 'fue', 'instauraron'), lo que lo caracteriza como narración."
  },
  {
    id: "unam_2023_39",
    area: "Español",
    text: "Señala el eslogan que pretende lograr un cambio de conducta en el consumidor.",
    options: [
      "La marca Nike distingue.",
      "\"Coca–cola\" la chispa de la vida.",
      "Mezclar alcohol y gasolina mata.",
      "El agua más sana \"Sol y Nieve\""
    ],
    correctIndex: 2,
    explanation: "'Mezclar alcohol y gasolina mata' es una campaña de concientización que busca cambiar la conducta del consumidor, disuadiéndolo de conducir bajo los efectos del alcohol."
  },
  {
    id: "unam_2023_40",
    area: "Español",
    text: "Selecciona el ejemplo de texto publicitario donde se exageran las cualidades de un producto.",
    options: [
      "\"Yo sin Bic, no puedo vivir\".",
      "\"Mejor, mejora, Mejoral\".",
      "\"Por su rico sabor casero, Tía Rosa\".",
      "\"Con el cariño de siempre, Bimbo\"."
    ],
    correctIndex: 0,
    explanation: "'Yo sin Bic, no puedo vivir' usa hipérbole (exageración) al afirmar que un bolígrafo es indispensable para vivir, recurso común en publicidad para enfatizar la utilidad del producto."
  },

  // ─── QUÍMICA (41-52) ───────────────────────────────────────────────────────
  {
    id: "unam_2023_41",
    area: "Química",
    text: "Son dos propiedades físicas de los gases.",
    options: [
      "Difusibilidad y volumen propio.",
      "Volumen definido y maleabilidad.",
      "Volumen y forma indefinida.",
      "Forma indefinida y maleabilidad."
    ],
    correctIndex: 2,
    explanation: "Los gases no tienen volumen ni forma propios; adoptan el volumen y la forma del recipiente que los contiene. Estas son sus propiedades físicas características."
  },
  {
    id: "unam_2023_42",
    area: "Química",
    text: "Propiedades físicas de las sustancias que permiten medir la cantidad de ellas.",
    options: [
      "Temperatura de ebullición y solubilidad.",
      "Temperatura de fusión y densidad.",
      "Presión y densidad.",
      "Masa y volumen."
    ],
    correctIndex: 3,
    explanation: "La masa (kg, g) y el volumen (L, mL, m³) son las propiedades extensivas que permiten cuantificar (medir la cantidad) de cualquier sustancia."
  },
  {
    id: "unam_2023_43",
    area: "Química",
    text: "Si cierta cantidad de agua pasa del estado sólido al estado líquido, permanece constante su",
    options: ["densidad.", "masa.", "solubilidad.", "volumen."],
    correctIndex: 1,
    explanation: "En un cambio de estado físico (fusión del hielo), la masa se conserva porque no se crean ni destruyen átomos. El volumen y la densidad cambian durante este proceso."
  },
  {
    id: "unam_2023_44",
    area: "Química",
    text: "A partir de los siguientes modelos X, Q y Z se puede afirmar que X es ________, Q ________ y Z ________.\n\n(X: mezcla de distintos átomos con diferente tamaño; Q: pares de átomos iguales enlazados; Z: átomos iguales separados)",
    options: [
      "compuesto – mezcla – elemento",
      "mezcla – compuesto – elemento",
      "elemento – compuesto – mezcla",
      "mezcla – elemento – compuesto"
    ],
    correctIndex: 1,
    explanation: "Observa la imagen: analiza cada modelo molecular. X muestra partículas distintas sin unir = mezcla; Q muestra átomos distintos enlazados = compuesto; Z muestra un solo tipo de átomo = elemento. Respuesta: mezcla – compuesto – elemento.",
    imageUrl: "https://lruwnuldlltwktdfrwho.supabase.co/storage/v1/object/public/simulador-imagenes/guia2023/p44.png"
  },
  {
    id: "unam_2023_45",
    area: "Química",
    text: "Los ________ tienen carga ________ y se ubican dentro del núcleo del átomo.",
    options: [
      "electrones – negativa",
      "neutrones – negativa",
      "protones – positiva",
      "neutrinos – positiva"
    ],
    correctIndex: 2,
    explanation: "Los protones tienen carga positiva (+1) y se localizan en el núcleo atómico junto con los neutrones (sin carga). Los electrones (carga negativa) orbitan en la corteza."
  },
  {
    id: "unam_2023_46",
    area: "Química",
    text: "El número de masa de un elemento que tiene 34 protones y 45 neutrones es",
    options: ["34", "11", "79", "45"],
    correctIndex: 2,
    explanation: "Número de masa (A) = protones + neutrones = 34 + 45 = 79. El número atómico Z = 34 (Selenio, Se)."
  },
  {
    id: "unam_2023_47",
    area: "Química",
    text: "En la fórmula del H₂O existen 2 ________ de hidrógeno y 1 ________ de oxígeno.",
    options: ["moléculas – átomo", "átomos – átomo", "moléculas – molécula", "átomos – molécula"],
    correctIndex: 1,
    explanation: "La fórmula H₂O indica que cada molécula de agua contiene 2 átomos de hidrógeno y 1 átomo de oxígeno. El subíndice indica número de átomos."
  },
  {
    id: "unam_2023_48",
    area: "Química",
    text: "En la tabla periódica los elementos se clasifican en orden",
    options: [
      "creciente de masa atómica.",
      "decreciente de número de masa.",
      "creciente de número atómico.",
      "decreciente de número atómico."
    ],
    correctIndex: 2,
    explanation: "La tabla periódica moderna organiza los elementos en orden creciente de número atómico (Z), que representa el número de protones en el núcleo."
  },
  {
    id: "unam_2023_49",
    area: "Química",
    text: "Los enlaces químicos están formados por fuerzas _________ que mantienen unidos a los átomos.",
    options: ["eléctricas", "gravitacionales", "químicas", "magnéticas"],
    correctIndex: 0,
    explanation: "Los enlaces químicos (covalentes e iónicos) se forman por fuerzas eléctricas de atracción entre cargas opuestas (electrones y núcleos)."
  },
  {
    id: "unam_2023_50",
    area: "Química",
    text: "¿Cuál de los siguientes ejemplos es un fenómeno químico?",
    options: [
      "Evaporación del agua.",
      "Diluir un refresco.",
      "Combustión de carbón.",
      "Sublimación del yodo."
    ],
    correctIndex: 2,
    explanation: "La combustión del carbón (C + O₂ → CO₂) es un cambio químico: produce nuevas sustancias. Evaporación, disolución y sublimación son cambios físicos."
  },
  {
    id: "unam_2023_51",
    area: "Química",
    text: "Interpreta la información de la siguiente ecuación química.\n\n2SO₂ (g) + O₂ (g) → 2SO₃ (g)",
    options: [
      "2 mol de dióxido de azufre más 2 mol de oxígeno forman 3 mol de trióxido de azufre.",
      "4 mol de dióxido de azufre más 2 mol de oxígeno forman 3 mol de trióxido de azufre.",
      "4 mol de dióxido de azufre más 2 mol de oxígeno forman 6 mol de trióxido de azufre.",
      "2 mol de dióxido de azufre más 1 mol de oxígeno forman 2 mol de trióxido de azufre."
    ],
    correctIndex: 3,
    explanation: "Los coeficientes estequiométricos indican moles: 2 mol SO₂ + 1 mol O₂ → 2 mol SO₃. El O₂ no tiene coeficiente, por lo que es 1 mol."
  },
  {
    id: "unam_2023_52",
    area: "Química",
    text: "Son procesos de óxido–reducción.",
    options: [
      "La evaporación del agua, el empañamiento de la plata y quemar un papel.",
      "La oxidación de la manzana, la corrosión de un clavo y la combustión de una vela.",
      "El empañamiento de la plata, la oxidación de la manzana y romper un huevo.",
      "La combustión de una vela, quemar un papel y evaporación del agua."
    ],
    correctIndex: 1,
    explanation: "La oxidación de la manzana (reacción con O₂), la corrosión de un clavo (formación de Fe₂O₃) y la combustión de una vela implican transferencia de electrones (redox)."
  },

  // ─── HISTORIA (53-64) ──────────────────────────────────────────────────────
  {
    id: "unam_2023_53",
    area: "Historia",
    text: "Razón por la que, a principios del siglo XVI, los europeos se vieron en la necesidad de abrir nuevas rutas comerciales.",
    options: [
      "Lucha de las potencias marítimas por el control del Atlántico.",
      "Toma de Constantinopla por parte de los turcos.",
      "Avance de los pueblos árabes al sur de Europa.",
      "Necesidad de adquirir nuevas colonias en África."
    ],
    correctIndex: 1,
    explanation: "En 1453 los turcos otomanos tomaron Constantinopla, bloqueando las rutas comerciales terrestres hacia Asia. Esto obligó a europeos a buscar nuevas rutas marítimas."
  },
  {
    id: "unam_2023_54",
    area: "Historia",
    text: "País que se independizó en el siglo XIX y se inspiró en la Revolución Francesa.",
    options: ["India", "Argelia", "México", "Cuba"],
    correctIndex: 2,
    explanation: "México se independizó en 1821. Los ideales de la Revolución Francesa (libertad, igualdad, fraternidad) inspiraron a los criollos ilustrados que impulsaron la independencia."
  },
  {
    id: "unam_2023_55",
    area: "Historia",
    text: "La primera Guerra Mundial se desarrolló en varias etapas, una de ellas fue la guerra",
    options: ["bacteriológica.", "relámpago.", "de las trincheras.", "de los seis días."],
    correctIndex: 2,
    explanation: "La guerra de trincheras fue característica de la Primera Guerra Mundial (1914-1918), donde los ejércitos excavaron sistemas de trincheras en el frente occidental."
  },
  {
    id: "unam_2023_56",
    area: "Historia",
    text: "Uno de los resultados de la Primera Guerra Mundial fue",
    options: [
      "la consolidación del Imperio Austro–húngaro.",
      "la independencia de Austria y Hungría.",
      "la desintegración de Checoslovaquia.",
      "la desintegración de Rusia."
    ],
    correctIndex: 1,
    explanation: "El Imperio Austro-Húngaro se desintegró tras la Primera Guerra Mundial. Austria y Hungría se convirtieron en estados independientes separados por los Tratados de paz."
  },
  {
    id: "unam_2023_57",
    area: "Historia",
    text: "La ________ hace referencia a las hostilidades no frontales entre el bloque socialista encabezado por la Unión Soviética y las potencias capitalistas representadas por Estados Unidos de América después de la Segunda Guerra Mundial.",
    options: ["crisis de los misiles", "guerra pacifica", "cortina de hierro", "guerra fría"],
    correctIndex: 3,
    explanation: "La Guerra Fría (1947-1991) fue el período de tensión ideológica, política y militar entre EUA y la URSS sin enfrentamiento directo armado entre las superpotencias."
  },
  {
    id: "unam_2023_58",
    area: "Historia",
    text: "La Guerra del Golfo Pérsico entre Iraq y una coalición internacional liderada por Estados Unidos surgió del interés por controlar ________ de esa zona del planeta.",
    options: ["el grafito", "el petróleo", "la plata", "el oro"],
    correctIndex: 1,
    explanation: "La Guerra del Golfo Pérsico (1990-1991) fue motivada principalmente por el control del petróleo. Iraq invadió Kuwait, una de las mayores reservas petrolíferas del mundo."
  },
  {
    id: "unam_2023_59",
    area: "Historia",
    text: "Fue el medio de mayor relevancia para mantener el poder ideológico de la Iglesia novohispana.",
    options: [
      "El Tribunal de la Acordada.",
      "El Santo Oficio de la Inquisición.",
      "El Tribunal de la Santa Cruzada.",
      "El Provisorato de Indios."
    ],
    correctIndex: 1,
    explanation: "El Santo Oficio de la Inquisición fue el principal instrumento de control ideológico de la Iglesia en Nueva España, persiguiendo herejías y desviaciones doctrinales."
  },
  {
    id: "unam_2023_60",
    area: "Historia",
    text: "La producción de ________ fue determinante para la economía de la Nueva España.",
    options: ["artesanías", "metales", "henequén", "maíz"],
    correctIndex: 1,
    explanation: "La minería de metales preciosos (plata principalmente) fue el motor económico de la Nueva España. La plata novohispana financió a la Corona española y articuló el comercio global."
  },
  {
    id: "unam_2023_61",
    area: "Historia",
    text: "Fueron factores que provocaron la guerra contra los Estados Unidos de América de 1846 a 1847.",
    options: [
      "La separación de Texas y la separación de Yucatán.",
      "La política federalista de México y la carencia de armas para la defensa del territorio.",
      "El debilitamiento de México tras la guerra contra Francia y el gobierno centralista de México.",
      "El expansionismo anglosajón y la anexión de Texas."
    ],
    correctIndex: 3,
    explanation: "La doctrina del 'Destino Manifiesto' (expansionismo de EUA) y la anexión de Texas (1845) por EUA fueron las causas directas de la guerra México-EUA de 1846-1848."
  },
  {
    id: "unam_2023_62",
    area: "Historia",
    text: "En la Constitución de 1917, el artículo 27 es uno de los más trascendentales porque",
    options: [
      "ha logrado incidir en el liberalismo mundial, al influir en otras naciones como ejemplo de orden y progreso.",
      "estipula como propiedad de la Nación las tierras y demás recursos naturales que integran nuestro territorio.",
      "recoge las inquietudes sociales de obreros y campesinos demandadas desde el proceso revolucionario.",
      "enfatiza la independencia nacional frente a las demás naciones, así como la autonomía de los Estados."
    ],
    correctIndex: 1,
    explanation: "El Artículo 27 establece que la propiedad de tierras y aguas nacionales corresponde originariamente a la Nación, base del ejido y el reparto agrario posrevolucionario."
  },
  {
    id: "unam_2023_63",
    area: "Historia",
    text: "Autor representativo del Modernismo literario en México.",
    options: [
      "Joaquín Fernández de Lizardi.",
      "Manuel Payno.",
      "Manuel Gutiérrez Nájera.",
      "Guillermo Prieto."
    ],
    correctIndex: 2,
    explanation: "Manuel Gutiérrez Nájera (1859-1895) fue el principal iniciador del Modernismo en México, fundador de la Revista Azul y precursor de Rubén Darío."
  },
  {
    id: "unam_2023_64",
    area: "Historia",
    text: "Institución que se crea para recobrar la legitimidad del régimen perdida en los comicios de 1988.",
    options: [
      "Tribunal de lo Contencioso Electoral.",
      "Partido de la Revolución Democrática.",
      "Instituto Federal Electoral.",
      "Comités ciudadanos."
    ],
    correctIndex: 2,
    explanation: "El IFE (Instituto Federal Electoral) se creó en 1990 para organizar elecciones con mayor autonomía y transparencia, tras la crisis de legitimidad de las elecciones de 1988."
  },

  // ─── MATEMÁTICAS (65-76) ───────────────────────────────────────────────────
  {
    id: "unam_2023_65",
    area: "Matemáticas",
    text: "Resultado de realizar la siguiente operación.\n\n(–25)(2)(–3)(0)(–9)(7)",
    options: ["–9450", "–163", "0", "9550"],
    correctIndex: 2,
    explanation: "Cualquier producto que incluya el factor cero es igual a cero. Como uno de los factores es 0, el resultado de toda la operación es 0."
  },
  {
    id: "unam_2023_66",
    area: "Matemáticas",
    text: "Agrega paréntesis para indicar el orden correcto de las operaciones en la expresión:\n\n2.5 ÷ 2 + 9 – 1.5 × 3.5",
    options: [
      "(2.5 ÷ 2) + 9 – (1.5 × 3.5)",
      "2.5 ÷ (2 + 9 – 1.5) × 3.5",
      "(2.5 ÷ 2 + 9 – 1.5) × 3.5",
      "(2.5 ÷ 2) + (9 – 1.5) × 3.5"
    ],
    correctIndex: 2,
    explanation: "Según la jerarquía de operaciones, primero se resuelven multiplicaciones y divisiones: (2.5÷2) y (1.5×3.5), luego sumas y restas. La opción C agrupa correctamente."
  },
  {
    id: "unam_2023_67",
    area: "Matemáticas",
    text: "Un pueblo sufre una plaga de 10,000 ratones que encuentran condiciones de reproducción al inicio de la temporada de cosecha, por lo que se espera un incremento de 120% de su población. ¿Cuál es el total de ratas al final de temporada?",
    options: ["12,000", "22,000", "120,000", "220,000"],
    correctIndex: 1,
    explanation: "Incremento del 120%: 10,000 × 1.20 = 12,000 ratones adicionales. Total = 10,000 + 12,000 = 22,000 ratones. (120% de incremento, no población final del 120%)"
  },
  {
    id: "unam_2023_68",
    area: "Matemáticas",
    text: "Si Juan tiene 'x' años de edad, Luis la tercera parte de Juan, Isaac el doble de Luis y Pedro el cuádruple de Juan ¿cuánto suman las edades de los cuatro?",
    options: ["7x/3", "6x", "5x", "8x/3"],
    correctIndex: 1,
    explanation: "Juan=x, Luis=x/3, Isaac=2(x/3)=2x/3, Pedro=4x. Suma: x + x/3 + 2x/3 + 4x = x + x + 4x = 6x. (x/3 + 2x/3 = 3x/3 = x)"
  },
  {
    id: "unam_2023_69",
    area: "Matemáticas",
    text: "En la ecuación x – 3 = 6 el valor de x es",
    options: ["x = –3", "x = 2", "x = 3", "x = 9"],
    correctIndex: 3,
    explanation: "Despejando x: x = 6 + 3 = 9. Verificación: 9 – 3 = 6 ✓"
  },
  {
    id: "unam_2023_70",
    area: "Matemáticas",
    text: "Resuelve el siguiente sistema de ecuaciones.\n\n4x + 5y = 48\n3x – y = –2",
    options: ["x = 8, y = 2", "x = 2, y = –8", "x = 2, y = 8", "x = –2, y = –8"],
    correctIndex: 2,
    explanation: "De la 2ª ecuación: y = 3x + 2. Sustituyendo en la 1ª: 4x + 5(3x+2) = 48 → 4x+15x+10 = 48 → 19x = 38 → x = 2. Entonces y = 3(2)+2 = 8."
  },
  {
    id: "unam_2023_71",
    area: "Matemáticas",
    text: "Selecciona los valores de x que satisfacen la ecuación\n\n3x² – 7x – 6 = 0",
    options: [
      "x₁ = –6, x₂ = 1/3",
      "x₁ = 6, x₂ = –1/3",
      "x₁ = 3, x₂ = –2/3",
      "x₁ = –3, x₂ = 2/3"
    ],
    correctIndex: 2,
    explanation: "Factorizando: (3x + 2)(x – 3) = 0. Entonces x = 3 o x = –2/3. Verificación: 3(9)–7(3)–6 = 27–21–6 = 0 ✓"
  },
  {
    id: "unam_2023_72",
    area: "Matemáticas",
    text: "La siguiente tabla muestra el Índice de Explosividad Volcánica (IEV):\n\nParoxismal: Más de 25 km | Violenta: De 3 a 15 km\n\nCon base en los datos, la altura de la fumarola en una erupción paroxismal es más",
    options: [
      "pequeña que todas las producidas en las otras clasificaciones.",
      "grande que la emanada en una erupción violenta.",
      "grande que todas las producidas en las otras clasificaciones.",
      "pequeña que la emanada en una erupción moderada."
    ],
    correctIndex: 1,
    explanation: "Observa la imagen: lee los datos de la tabla del IEV. Paroxismal: >25 km. Violenta: 3−15 km. La fumarola paroxismal es mayor que la violenta (máx 15 km), pero no que todas (Colosal/Supercolosal también superan 25 km).",
    imageUrl: "https://lruwnuldlltwktdfrwho.supabase.co/storage/v1/object/public/simulador-imagenes/guia2023/p72.png"
  },
  {
    id: "unam_2023_73",
    area: "Matemáticas",
    text: "Las calificaciones finales de Roberto son: Matemáticas 6, Física 7, Español 9, Biología 7, Historia 9, Civismo 9 e Inglés 9. La media es",
    options: ["4", "7", "9", "8"],
    correctIndex: 3,
    explanation: "Media = (6+7+9+7+9+9+9) ÷ 7 = 56 ÷ 7 = 8."
  },
  {
    id: "unam_2023_74",
    area: "Matemáticas",
    text: "Dada la figura, identifica un par de ángulos alternos internos.",
    options: ["4 y 6", "6 y 5", "7 y 3", "1 y 4"],
    correctIndex: 0,
    explanation: "Observa la imagen: identifica las dos líneas paralelas y la transversal. Los ángulos alternos internos se forman entre las paralelas, en lados opuestos de la transversal. En la figura, los ángulos 4 y 6 cumplen esa condición.",
    imageUrl: "https://lruwnuldlltwktdfrwho.supabase.co/storage/v1/object/public/simulador-imagenes/guia2023/p74.png"
  },
  {
    id: "unam_2023_75",
    area: "Matemáticas",
    text: "Determina el área de un rectángulo que mide 15.8 cm de largo y 7.3 cm de ancho.",
    options: ["115.34 cm²", "111 cm²", "57.67 cm²", "46.20 cm²"],
    correctIndex: 0,
    explanation: "Área = largo × ancho = 15.8 cm × 7.3 cm = 115.34 cm²."
  },
  {
    id: "unam_2023_76",
    area: "Matemáticas",
    text: "¿Cuál es el volumen de un cubo de 10 cm de lado?",
    options: ["10 cm³", "50 cm³", "100 cm³", "1000 cm³"],
    correctIndex: 3,
    explanation: "Volumen del cubo = lado³ = 10³ = 10 × 10 × 10 = 1000 cm³."
  },

  // ─── HABILIDAD VERBAL (77-92) ───────────────────────────────────────────────
  {
    id: "unam_2023_77",
    area: "Habilidad Verbal",
    text: "Según EL SENTIDO GLOBAL DEL TEXTO ('Los agujeros negros, realidad o ficción'), los avances en las investigaciones de los agujeros negros han sido",
    options: ["dudosos.", "notables.", "ficticios", "certeros."],
    correctIndex: 1,
    explanation: "El texto menciona que 'el avance en el estudio de los agujeros negros ha sido gigante en las últimas décadas', indicando que los avances han sido notables (significativos)."
  },
  {
    id: "unam_2023_78",
    area: "Habilidad Verbal",
    text: "El universo todavía guarda múltiples misterios para el hombre debido a",
    options: [
      "a las inconsistencias de las investigaciones científicas.",
      "a la falta de imágenes de los cuerpos muy lejanos.",
      "a las limitaciones de la tecnología actual.",
      "al campo gravitatorio de las estrellas en su fase final."
    ],
    correctIndex: 2,
    explanation: "El texto concluye que sabremos la verdad 'cuando nuestro avance tecnológico nos permita estudiar más directa y cercanamente las hendiduras espaciales', señalando las limitaciones tecnológicas."
  },
  {
    id: "unam_2023_79",
    area: "Habilidad Verbal",
    text: "¿Cuál de los siguientes enunciados es una hipótesis?",
    options: [
      "La gravedad ejerce atracción sobre cualquier cuerpo celeste.",
      "Nada viaja más rápido que la luz.",
      "Los agujeros negros sin rotación son perfectamente esféricos.",
      "Los hoyos negros posiblemente son túneles."
    ],
    correctIndex: 3,
    explanation: "Una hipótesis es una suposición no comprobada. El texto dice 'algunos astrónomos han establecido la posibilidad de que los hoyos negros sean túneles', usando el adverbio 'posiblemente'."
  },
  {
    id: "unam_2023_80",
    area: "Habilidad Verbal",
    text: "¿Cuál es el tema del texto ('Los agujeros negros, realidad o ficción')?",
    options: [
      "El Universo y los muchos misterios que aún guarda para el hombre.",
      "Los científicos que han estudiado los hoyos negros.",
      "Los hoyos negros y su posible conexión con otros universos.",
      "La explicación del fenómeno de los agujeros negros."
    ],
    correctIndex: 3,
    explanation: "El texto aborda integralmente el fenómeno de los agujeros negros: qué son, cómo se forman, sus propiedades y cómo se estudian. El tema central es la explicación de este fenómeno."
  },
  {
    id: "unam_2023_81",
    area: "Habilidad Verbal",
    text: "En la narración 'El hombre y la víbora', el hombre muere debido a",
    options: [
      "al calor que le da a la víbora.",
      "a la mordida que le da la víbora.",
      "a que no se percató de la maldad que hay en otros.",
      "a que no esperaba la ingratitud del reptil."
    ],
    correctIndex: 1,
    explanation: "El texto dice explícitamente: 'el reptil, tan pronto se sintió reanimado, lo mordió y le causó la muerte.' La causa directa de su muerte es la mordida de la víbora."
  },
  {
    id: "unam_2023_82",
    area: "Habilidad Verbal",
    text: "En el texto los animales hablan debido a que es una",
    options: [
      "historia que no tiene que ver con la realidad.",
      "narración que tiene la mitad de verdad y la mitad de maravilloso.",
      "fábula y en ella se dota a los animales de características humanas.",
      "descripción del animal que mejor encarna la maldad y la ingratitud."
    ],
    correctIndex: 2,
    explanation: "La fábula es un género literario cuyos personajes principales son animales con características humanas (hablan, razonan), con el propósito de transmitir una moraleja."
  },
  {
    id: "unam_2023_83",
    area: "Habilidad Verbal",
    text: "El mensaje o moraleja de la fábula 'El hombre y la víbora' es que",
    options: [
      "el agradecimiento es propio de las personas compasivas.",
      "el hombre malvado no muestra compasión.",
      "las víboras son malvadas y no son compasivas.",
      "la ingratitud es propia de los seres malvados."
    ],
    correctIndex: 3,
    explanation: "La moraleja explícita es 'La maldad no reconoce jamás la gratitud', es decir, la ingratitud es característica de los seres malvados, que nunca reconocen los favores recibidos."
  },
  {
    id: "unam_2023_84",
    area: "Habilidad Verbal",
    text: "Selecciona la opción con el par de palabras que muestra una relación ANÁLOGA a:\n\nHONRADEZ – VIRTUD",
    options: ["engaño – hipocresía", "defecto – avaricia", "maldad – mentira", "vanidad – defecto"],
    correctIndex: 3,
    explanation: "La relación es: HONRADEZ es un tipo de VIRTUD (la honradez pertenece a la categoría virtud). De igual modo, la VANIDAD es un tipo de DEFECTO (vanidad pertenece a la categoría defecto)."
  },
  {
    id: "unam_2023_85",
    area: "Habilidad Verbal",
    text: "Selecciona la opción con el par de palabras que muestra una relación ANÁLOGA a:\n\nCANAS – VEJEZ",
    options: ["niño – belleza", "humo – fuego", "nubes – hielo", "adulto – sabiduría"],
    correctIndex: 1,
    explanation: "Las CANAS son un indicador/señal de VEJEZ. De igual modo, el HUMO es un indicador/señal de FUEGO. La relación es: signo visible → fenómeno o causa que lo produce."
  },
  {
    id: "unam_2023_86",
    area: "Habilidad Verbal",
    text: "Selecciona la opción con el par de palabras que muestra una relación ANÁLOGA a:\n\nABEJA – ENJAMBRE",
    options: ["felino – cardumen", "persona – individuo", "parvada – pájaro", "perro – jauría"],
    correctIndex: 3,
    explanation: "ABEJA es el individuo y ENJAMBRE es el colectivo de abejas. Análogamente, PERRO es el individuo y JAURÍA es el colectivo de perros. (Cardumen = peces; parvada = aves)"
  },
  {
    id: "unam_2023_87",
    area: "Habilidad Verbal",
    text: "Selecciona la opción que sustituya con un ANTÓNIMO la palabra en mayúsculas:\n\nIMPLEMENTÓ las nuevas reformas constitucionales.",
    options: ["Abolió", "Instauró", "Reemplazó", "Estableció"],
    correctIndex: 0,
    explanation: "IMPLEMENTÓ significa poner en práctica o establecer. Su antónimo es ABOLIÓ, que significa suprimir, eliminar o dejar sin efecto una ley o norma."
  },
  {
    id: "unam_2023_88",
    area: "Habilidad Verbal",
    text: "Selecciona la opción que sustituya con un ANTÓNIMO la palabra en mayúsculas:\n\nEl tejón es un mamífero carnicero CORRIENTE en Europa.",
    options: ["Exótico", "Común", "Rechazado", "Despreciable"],
    correctIndex: 0,
    explanation: "CORRIENTE en este contexto significa 'común, frecuente, abundante'. Su antónimo es EXÓTICO, que significa 'extraño, poco común, de origen lejano'."
  },
  {
    id: "unam_2023_89",
    area: "Habilidad Verbal",
    text: "Selecciona la opción que sustituya con un ANTÓNIMO la palabra en mayúsculas:\n\nOCIO",
    options: ["Reposo", "Diversión", "Actividad", "Distracción"],
    correctIndex: 2,
    explanation: "OCIO significa tiempo libre, descanso, inactividad. Su antónimo es ACTIVIDAD (o trabajo), que representa el estado opuesto de estar ocupado o activo."
  },
  {
    id: "unam_2023_90",
    area: "Habilidad Verbal",
    text: "Elige la opción que contenga un par de sinónimos.",
    options: ["Súplica – ruego", "Maldad – bondad", "Paupérrimo – triste", "Compañía – soledad"],
    correctIndex: 0,
    explanation: "SÚPLICA y RUEGO son sinónimos: ambas palabras significan petición insistente o humilde. Las demás opciones son antónimos o palabras no relacionadas semánticamente."
  },
  {
    id: "unam_2023_91",
    area: "Habilidad Verbal",
    text: "Selecciona la opción que sustituya con un SINÓNIMO la palabra en mayúsculas:\n\nLos juicios que emitió eran DISPARATADOS.",
    options: ["Engañosos", "Absurdos", "Atrevidos", "Estúpidos"],
    correctIndex: 1,
    explanation: "DISPARATADOS significa contrarios a la razón, sin sentido lógico. El mejor sinónimo es ABSURDOS, que también significa ilógico, irracional, contrario al sentido común."
  },
  {
    id: "unam_2023_92",
    area: "Habilidad Verbal",
    text: "Selecciona la opción que sustituya con un SINÓNIMO la palabra en mayúsculas:\n\nEste hombre se indignó cuando le dijeron que era un ZONZO.",
    options: ["Bromista", "Gracioso", "Torpe", "Impropio"],
    correctIndex: 2,
    explanation: "ZONZO es un coloquialismo mexicano que significa tonto, lento de entendimiento, poco hábil. El sinónimo más adecuado es TORPE, que implica falta de habilidad o destreza mental."
  },

  // ─── GEOGRAFÍA (93-104) ────────────────────────────────────────────────────
  {
    id: "unam_2023_93",
    area: "Geografía",
    text: "Componentes del espacio geográfico que incluyen las actividades que se relacionan con la producción, transporte, comercialización y consumo de bienes y servicios.",
    options: ["Políticos.", "Sociales.", "Económicos.", "Físicos."],
    correctIndex: 2,
    explanation: "Los componentes económicos del espacio geográfico comprenden todas las actividades productivas: agricultura, industria, comercio, servicios y transporte de bienes."
  },
  {
    id: "unam_2023_94",
    area: "Geografía",
    text: "Determina las coordenadas geográficas para el punto II en el mapa.",
    options: ["30° N, 10° W", "30° S, 10° E", "10° N, 30° W", "10° S, 30° E"],
    correctIndex: 3,
    explanation: "Observa la imagen: localiza el punto II en el mapa. Verifica si está al norte o sur del ecuador (latitud) y al este u oeste del meridiano de Greenwich (longitud). El punto II está a 10° al sur y 30° al este: coordenadas 10° S, 30° E.",
    imageUrl: "https://lruwnuldlltwktdfrwho.supabase.co/storage/v1/object/public/simulador-imagenes/guia2023/p94.png"
  },
  {
    id: "unam_2023_95",
    area: "Geografía",
    text: "Las zonas de mayor sismicidad se relacionan con",
    options: [
      "límites convergentes.",
      "grandes planicies.",
      "límites divergentes.",
      "depresiones relativas."
    ],
    correctIndex: 0,
    explanation: "Los límites de placas convergentes (donde una placa subduce bajo otra) generan los terremotos más intensos, como en el Cinturón de Fuego del Pacífico."
  },
  {
    id: "unam_2023_96",
    area: "Geografía",
    text: "Parte del ciclo del agua relacionada directamente con las aguas subterráneas.",
    options: ["Evaporación.", "Precipitación.", "Condensación.", "Infiltración."],
    correctIndex: 3,
    explanation: "La infiltración es el proceso por el cual el agua de lluvia penetra en el suelo y recarga los acuíferos subterráneos, siendo el proceso directamente vinculado a las aguas subterráneas."
  },
  {
    id: "unam_2023_97",
    area: "Geografía",
    text: "Una manera de proteger el medio ambiente es la fabricación de combustibles a partir de",
    options: [
      "recursos hídricos.",
      "derivados del petróleo.",
      "aceites vegetales.",
      "recursos marítimos."
    ],
    correctIndex: 2,
    explanation: "Los biocombustibles fabricados a partir de aceites vegetales (biodiesel, bioetanol) son renovables y emiten menos CO₂ que los combustibles fósiles, protegiendo el medio ambiente."
  },
  {
    id: "unam_2023_98",
    area: "Geografía",
    text: "Principal factor de riesgo para la población que vive en la península de Yucatán.",
    options: ["Tsunamis.", "Huracanes.", "Derrumbes.", "Sismos."],
    correctIndex: 1,
    explanation: "La Península de Yucatán está ubicada en el Golfo de México y el Mar Caribe, zona de alta actividad ciclónica. Los huracanes son el principal riesgo natural para su población."
  },
  {
    id: "unam_2023_99",
    area: "Geografía",
    text: "Principales ciudades de México que destacan por la extracción de hidrocarburos.",
    options: [
      "Coatzacoalcos y Poza Rica.",
      "Salamanca y Tampico.",
      "Puerto Madero y Campeche.",
      "Veracruz y Tuxpan."
    ],
    correctIndex: 0,
    explanation: "Coatzacoalcos (Veracruz) y Poza Rica (Veracruz) son los principales centros de extracción, refinación y petroquímica de hidrocarburos en México."
  },
  {
    id: "unam_2023_100",
    area: "Geografía",
    text: "El transporte _______ se aprovecha para transportar petróleo de Veracruz a Estados Unidos de América.",
    options: ["lacustre", "fluvial", "marítimo", "terrestre"],
    correctIndex: 2,
    explanation: "El transporte marítimo (por mar) es el medio utilizado para el transporte de petróleo a grandes distancias, incluyendo las exportaciones de México hacia EUA por el Golfo de México."
  },
  {
    id: "unam_2023_101",
    area: "Geografía",
    text: "Institución conformada por 184 miembros cuyo objetivo es asegurar la estabilidad financiera mundial a través del comercio internacional, la promoción del empleo y el desarrollo económico sustentable.",
    options: [
      "Fondo Monetario Internacional.",
      "Banco Mundial.",
      "Conferencia de Naciones Unidas.",
      "Organización de Cooperación y Desarrollo Económico."
    ],
    correctIndex: 0,
    explanation: "El Fondo Monetario Internacional (FMI) es la institución multilateral que promueve la estabilidad financiera global, el comercio internacional y el crecimiento económico sostenible."
  },
  {
    id: "unam_2023_102",
    area: "Geografía",
    text: "País que se independizó en julio de 2011 después de una guerra civil, lo que ocasionó que se modificaran las fronteras políticas de África.",
    options: ["Kosovo.", "Sudán del Sur.", "Eritrea.", "Namibia."],
    correctIndex: 1,
    explanation: "Sudán del Sur proclamó su independencia el 9 de julio de 2011 tras un referéndum, convirtiéndose en el país más joven del mundo y modificando el mapa de África."
  },
  {
    id: "unam_2023_103",
    area: "Geografía",
    text: "Relaciona los sitios considerados patrimonio cultural de la humanidad con la entidad:\n\nI. Querétaro — II. Veracruz — III. Oaxaca — IV. Chihuahua\n\na. Zona arqueológica de Paquimé — b. Misiones Franciscanas de la Sierra Gorda — c. Monumentos históricos de Tlacotalpan — d. Sitio arqueológico de Monte Albán",
    options: ["I:d – II:a – III:c – IV:b", "I:a – II:b – III:c – IV:d", "I:b – II:c – III:d – IV:a", "I:b – II:d – III:a – IV:c"],
    correctIndex: 2,
    explanation: "I. Querétaro = b. Misiones Franciscanas Sierra Gorda; II. Veracruz = c. Tlacotalpan; III. Oaxaca = d. Monte Albán; IV. Chihuahua = a. Paquimé."
  },
  {
    id: "unam_2023_104",
    area: "Geografía",
    text: "Franja adyacente a las costas cuya anchura es de 12 millas náuticas y donde el Estado ejerce plena soberanía.",
    options: ["Mar territorial.", "Mar patrimonial.", "Región patrimonial.", "Zona territorial."],
    correctIndex: 0,
    explanation: "El mar territorial es la franja de mar adyacente a la costa de un Estado con una extensión de 12 millas náuticas, sobre la cual el Estado ejerce plena soberanía."
  },

  // ─── FÍSICA (105-116) ──────────────────────────────────────────────────────
  {
    id: "unam_2023_105",
    area: "Física",
    text: "¿Cuál es la diferencia que existe entre la velocidad y la rapidez?",
    options: [
      "La velocidad es un vector y la rapidez es un escalar.",
      "La rapidez mide la relación velocidad–tiempo mientras que la velocidad es la relación entre distancia–tiempo.",
      "La rapidez mide la aceleración mientras que la velocidad es únicamente la relación entre distancia y tiempo.",
      "La velocidad es un escalar y la rapidez es un vector."
    ],
    correctIndex: 0,
    explanation: "La velocidad es una magnitud vectorial (tiene magnitud y dirección), mientras que la rapidez es escalar (solo magnitud). La velocidad indica hacia dónde va el objeto."
  },
  {
    id: "unam_2023_106",
    area: "Física",
    text: "Elige la gráfica que representa la siguiente tabla de datos:\n\nTiempo (s): 0, 1, 2, 3 | Posición (m): 0, 1, 4, 9",
    options: [
      "Gráfica lineal con eje Y en km y X en horas (escala incorrecta)",
      "Gráfica con ejes invertidos (tiempo en Y, posición en X)",
      "Gráfica parabólica posición(m) vs tiempo(s) con puntos (0,0), (1,1), (2,4), (3,9)",
      "Gráfica con curva descendente"
    ],
    correctIndex: 2,
    explanation: "Observa la imagen: los valores (0,0), (1,1), (2,4), (3,9) siguen p=t², una relación cuadrática cuya gráfica es una parábola. Busca la gráfica con eje Y=posición(m), eje X=tiempo(s) y curva parabólica ascendente — opción C.",
    imageUrl: "https://lruwnuldlltwktdfrwho.supabase.co/storage/v1/object/public/simulador-imagenes/guia2023/p106.png"
  },
  {
    id: "unam_2023_107",
    area: "Física",
    text: "Un automóvil realiza un viaje como el que ilustra la gráfica (velocidad vs tiempo). ¿Cuál de las opciones describe las características de éste?",
    options: [
      "El automóvil inició en reposo, aceleró hasta 60 km/h en una hora, mantuvo esa velocidad tres horas llegando al punto de inicio.",
      "El automóvil partió del reposo hasta 60 km/h en una hora, se detuvo dos horas, luego reanudó hasta el destino.",
      "El automóvil partió del reposo, en la primera hora alcanzó 60 km/h y mantuvo esta durante las dos horas siguientes, después redujo la velocidad hasta detenerse a las 4 horas.",
      "El automóvil ascendió una montaña en una hora, recorrió la meseta a 60 km/h durante dos horas y descendió en la siguiente."
    ],
    correctIndex: 2,
    explanation: "Observa la imagen: lee la gráfica velocidad vs tiempo por tramos. 0−1h: sube de 0 a 60 km/h (aceleración). 1−3h: línea horizontal a 60 km/h (velocidad constante). 3−4h: baja a 0 (desaceleración). La opción C describe correctamente ese trayecto.",
    imageUrl: "https://lruwnuldlltwktdfrwho.supabase.co/storage/v1/object/public/simulador-imagenes/guia2023/p107.png"
  },
  {
    id: "unam_2023_108",
    area: "Física",
    text: "Si se aplica una fuerza de 10 Newtons a un balón de 2 kg de masa, originalmente en reposo, su aceleración será de",
    options: ["5 m/s²", "2 m/s²", "1 m/s²", "10 m/s²"],
    correctIndex: 0,
    explanation: "Segunda Ley de Newton: F = ma → a = F/m = 10 N ÷ 2 kg = 5 m/s²."
  },
  {
    id: "unam_2023_109",
    area: "Física",
    text: "La resultante (R) de las fuerzas que actúan sobre una lámpara en equilibrio sostenida por dos cables es",
    options: ["menor a cero.", "igual a cero.", "igual a la aceleración de la lámpara.", "mayor a cero."],
    correctIndex: 1,
    explanation: "Si la lámpara está en equilibrio estático, la suma de todas las fuerzas que actúan sobre ella (peso + tensiones de los cables) es igual a cero (Primera Ley de Newton)."
  },
  {
    id: "unam_2023_110",
    area: "Física",
    text: "Cuando caminas sobre una alfombra (originalmente neutra) y traes puestos tenis y ropa de nylon adquieres carga eléctrica principalmente por",
    options: ["frotamiento.", "conducción.", "inducción.", "contacto."],
    correctIndex: 0,
    explanation: "El frotamiento (o fricción) entre los materiales (zapatos/nylon contra la alfombra) transfiere electrones de un material a otro, generando carga eléctrica estática."
  },
  {
    id: "unam_2023_111",
    area: "Física",
    text: "La aguja de la brújula apunta siempre al norte porque",
    options: [
      "en el polo norte hay mayor fuerza.",
      "en el polo norte hay mayor cantidad de hierro.",
      "en el polo norte el magnetismo es más intenso.",
      "la aguja se alinea en la dirección del campo magnético de la tierra."
    ],
    correctIndex: 3,
    explanation: "La aguja magnetizada de la brújula es un dipolo magnético que se alinea con el campo magnético terrestre, apuntando hacia el polo magnético norte de la Tierra."
  },
  {
    id: "unam_2023_112",
    area: "Física",
    text: "El enunciado que supone que las moléculas de un gas están muy separadas, se mueven en trayectorias rectilíneas, y que al chocar unas con otras o con las paredes del recipiente que las contiene corresponde a la",
    options: [
      "Teoría cinética de los gases.",
      "Ley de Charles.",
      "Ley general del estado gaseoso.",
      "Ley de Gay-Lussac."
    ],
    correctIndex: 0,
    explanation: "La Teoría Cinética de los gases postula que los gases están formados por moléculas en movimiento constante y aleatorio, separadas, que colisionan elásticamente entre sí y con las paredes."
  },
  {
    id: "unam_2023_113",
    area: "Física",
    text: "Elige la opción que define correctamente la diferencia básica entre calor y temperatura, en un nivel macroscópico.",
    options: [
      "La temperatura se refiere a las sensaciones de calor o frío, mientras que el calor es lo que mide el termómetro cuando entran en contacto dos cuerpos con diferente temperatura.",
      "La temperatura es lo que mide el termómetro, mientras que el calor es la energía no-mecánica que se transfiere de un cuerpo de mayor a uno de menor temperatura.",
      "El termómetro mide grados de temperatura, mientras que el calor es la sensación de mayor calor o frío entre dos cuerpos a diferente temperatura.",
      "El calor es lo que mide el termómetro, mientras que la temperatura es energía que se transfiere entre dos cuerpos en contacto a diferentes temperaturas."
    ],
    correctIndex: 1,
    explanation: "Temperatura: medida del grado de agitación molecular (el termómetro la mide). Calor: energía térmica en tránsito que fluye del cuerpo más caliente al más frío."
  },
  {
    id: "unam_2023_114",
    area: "Física",
    text: "¿En cuáles de los siguientes casos se puede generar un campo magnético?\n\nI. Pasando una corriente eléctrica a través de un conductor.\nII. Enrollando un alambre sobre un clavo y pasando una corriente eléctrica.\nIII. Impidiendo el paso de la corriente eléctrica sobre un conductor.\nIV. A través de la acción de una carga puntual en reposo.",
    options: ["II, IV", "III, IV", "I, III", "I, II"],
    correctIndex: 3,
    explanation: "Un campo magnético se genera por cargas en movimiento (corriente eléctrica). I (conductor con corriente) y II (electroimán) generan campo magnético. III y IV no implican cargas en movimiento."
  },
  {
    id: "unam_2023_115",
    area: "Física",
    text: "El movimiento ondulatorio es un proceso por medio del cual se transmite",
    options: ["energía.", "átomos.", "moléculas.", "partículas."],
    correctIndex: 0,
    explanation: "Las ondas transmiten energía sin transferir materia. El medio de propagación oscila pero no se desplaza de forma neta; solo la energía viaja de un punto a otro."
  },
  {
    id: "unam_2023_116",
    area: "Física",
    text: "¿Qué color de la luz visible tiene mayor longitud de onda?",
    options: ["Amarillo.", "Verde.", "Azul.", "Rojo."],
    correctIndex: 3,
    explanation: "En el espectro visible, el rojo tiene la mayor longitud de onda (~700 nm) y el violeta la menor (~400 nm). ROYGBIV: Rojo→mayor λ, Violeta→menor λ."
  },

  // ─── FORMACIÓN CÍVICA Y ÉTICA (117-128) ─────────────────────────────────────
  {
    id: "unam_2023_117",
    area: "Formación Cívica y Ética",
    text: "¿Cuál de los siguientes casos ejemplifica la importancia de la relación del ser humano con su entorno social y natural para su identidad personal?",
    options: [
      "Balbina está callada y distante, pues recientemente ha sentido que nadie la comprende.",
      "Eloy prefiere cenar tacos en la calle, pues el trabajo en la oficina no le deja tiempo para nada en el día.",
      "Yolanda es una persona tolerante y reflexiva, pues en su familia siempre ha prevalecido el diálogo y la empatía.",
      "José se reúne a jugar dominó con sus amigos, pues quiere fomentar su agilidad mental."
    ],
    correctIndex: 2,
    explanation: "Yolanda ejemplifica cómo el entorno social (familia con diálogo y empatía) moldea la identidad personal (ser tolerante y reflexiva), mostrando la influencia del entorno en el desarrollo personal."
  },
  {
    id: "unam_2023_118",
    area: "Formación Cívica y Ética",
    text: "Relaciona los tipos de valores con el concepto que le corresponde:\n\nI. Estético — II. Económico — III. Moral\n\na. Se le asigna a lo material, los bienes y los servicios.\nb. Es la apreciación del arte, la expresión corporal y la belleza.\nc. Se orientan de acuerdo a nuestros ideales, metas y juicios.",
    options: ["I:c – II:a – III:b", "I:b – II:a – III:c", "I:c – II:b – III:a", "I:a – II:c – III:b"],
    correctIndex: 1,
    explanation: "I. Estético = b (apreciación de arte y belleza); II. Económico = a (valor de bienes materiales y servicios); III. Moral = c (orientados a ideales y juicios éticos)."
  },
  {
    id: "unam_2023_119",
    area: "Formación Cívica y Ética",
    text: "Pablo y Laura le pidieron a su abuela que les mostrara sus álbumes fotográficos, les contara el contexto y las anécdotas. A partir de entonces, descubrieron que ________ han intervenido en la conformación de su identidad personal.",
    options: ["las leyes sociales", "los deseos infantiles", "las historias compartidas", "las políticas públicas"],
    correctIndex: 2,
    explanation: "Las historias compartidas (memorias familiares, narrativas generacionales) son parte fundamental de la construcción de la identidad personal y el sentido de pertenencia."
  },
  {
    id: "unam_2023_120",
    area: "Formación Cívica y Ética",
    text: "Relaciona los derechos y obligaciones de los adolescentes:\n\nI. Derecho — II. Obligación\n\na. Respeto de los padres a los hijos\nb. Responsabilidad en los estudios\nc. Cumplimiento de las normas sociales\nd. Contar con servicios de salud gratuitos",
    options: ["I:a,d – II:b,c", "I:a,c – II:b,d", "I:b,c – II:a,d", "I:c,d – II:b,a"],
    correctIndex: 0,
    explanation: "Derechos (lo que se tiene): a. Ser respetado por los padres y d. Acceso a salud gratuita. Obligaciones (lo que se debe hacer): b. Estudiar responsablemente y c. Cumplir normas."
  },
  {
    id: "unam_2023_121",
    area: "Formación Cívica y Ética",
    text: "El dueño de un establecimiento paga a sus empleados adolescentes un sueldo menor al salario mínimo argumentando que no tienen necesidades importantes que satisfacer, como en el caso de los adultos casados. Esta situación describe un tipo de",
    options: [
      "favoritismo económico empresarial.",
      "violencia económica a los adolescentes.",
      "pequeñas y medianas empresas.",
      "economía propia de la adolescencia."
    ],
    correctIndex: 1,
    explanation: "Pagar menos del salario mínimo a adolescentes es violencia económica: vulnera sus derechos laborales y los discrimina por su edad, contraviniendo la ley."
  },
  {
    id: "unam_2023_122",
    area: "Formación Cívica y Ética",
    text: "En una democracia, el método que permite resolver las diferencias, en la toma de decisiones, se fundamenta en el principio de",
    options: ["justicia.", "mayoría.", "utilidad.", "equidad."],
    correctIndex: 1,
    explanation: "El principio de mayoría es el fundamento básico de la toma de decisiones democrática: la opción que obtiene más votos (mayoría) prevalece sobre las demás."
  },
  {
    id: "unam_2023_123",
    area: "Formación Cívica y Ética",
    text: "Espacio físico dentro del cual se ejerce el poder estatal y define los límites de la independencia frente a otros estados.",
    options: ["Territorio.", "Región.", "Nación.", "Lugar."],
    correctIndex: 0,
    explanation: "El territorio es el espacio geográfico (tierra, mar, aire) sobre el cual un Estado ejerce soberanía y jurisdicción exclusiva, delimitando su independencia frente a otros Estados."
  },
  {
    id: "unam_2023_124",
    area: "Formación Cívica y Ética",
    text: "Reto democrático que permite manifestar el reconocimiento de la pluralidad ideológica y política de la sociedad.",
    options: [
      "Participación ciudadana.",
      "Transparencia pública.",
      "Acceso a la información.",
      "Responsabilidad pública."
    ],
    correctIndex: 0,
    explanation: "La participación ciudadana es el mecanismo democrático que permite a los ciudadanos involucrarse en la vida pública, reconociendo y expresando la pluralidad de ideas políticas."
  },
  {
    id: "unam_2023_125",
    area: "Formación Cívica y Ética",
    text: "Ejemplo de soberanía.",
    options: [
      "Los ciudadanos eligen al presidente de la República.",
      "El pueblo celebra ceremonias cívicas importantes.",
      "La sociedad participa en actividades públicas.",
      "Los ciudadanos ejercen la cultura de la legalidad."
    ],
    correctIndex: 0,
    explanation: "La elección del presidente por voto ciudadano es el ejemplo más claro de soberanía popular: el poder emana del pueblo, que lo delega en sus gobernantes mediante el sufragio."
  },
  {
    id: "unam_2023_126",
    area: "Formación Cívica y Ética",
    text: "El 'Teletón' que anualmente organizan diversas televisoras es un ejemplo de que los medios de comunicación pueden cumplir con una",
    options: [
      "responsabilidad política.",
      "función social.",
      "acción altruista.",
      "conciencia ambiental."
    ],
    correctIndex: 1,
    explanation: "El Teletón ejemplifica la función social de los medios de comunicación: usar su alcance e influencia para movilizar a la sociedad en torno a causas de bienestar colectivo."
  },
  {
    id: "unam_2023_127",
    area: "Formación Cívica y Ética",
    text: "En la escuela de María se ha pedido a los alumnos que recolecten envases de plástico para llevarlos a reciclar. Esta es una acción encaminada al cuidado del entorno",
    options: ["natural.", "cultural.", "económico.", "social."],
    correctIndex: 0,
    explanation: "El reciclaje de plásticos es una acción de cuidado del entorno natural, ya que reduce la contaminación ambiental y preserva los ecosistemas y recursos naturales."
  },
  {
    id: "unam_2023_128",
    area: "Formación Cívica y Ética",
    text: "La negociación se caracteriza por ser un proceso en el que dos o más actores",
    options: [
      "tienen problemáticas similares y están dispuestos a resolverlas mediante el diálogo y la discusión.",
      "afrontan un acuerdo de intereses y están dispuestos a ceder y hacer concesiones gracias al diálogo.",
      "enfrentan un conflicto de intereses, pero están dispuestos a dialogar y ceder a cambio de algo.",
      "solucionan problemas comunes dialogando, sin necesidad de ceder algo."
    ],
    correctIndex: 2,
    explanation: "La negociación implica un conflicto de intereses entre partes que, mediante el diálogo, están dispuestas a hacer concesiones mutuas para llegar a un acuerdo beneficioso."
  }
];
