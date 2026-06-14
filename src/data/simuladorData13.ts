// Banco 13 — 500 Preguntas ECOEMS (Formulario de Repaso)
// Regenerado con DeepSeek — distractores plausibles y explicaciones didácticas

export interface Question {
  id: number;
  area: string;
  text: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const bank13Questions: Question[] = [
  {
    id: 1001,
    area: "Química",
    text: "¿Cómo se llama aquella sustancia simple que no puede descomponerse en otras más sencillas?",
    options: [
    "Elemento",
    "Mezcla",
    "Compuesto",
    "Molécula"
    ],
    correctIndex: 0,
    explanation: "Un elemento es una sustancia simple que no puede descomponerse en otras más simples por métodos químicos ordinarios. Los compuestos sí se descomponen en elementos, las mezclas son combinaciones físicas de sustancias y las moléculas pueden contener varios átomos del mismo o diferente elemento.",
  },
  {
    id: 1002,
    area: "Química",
    text: "En las mezclas heterogéneas se observan los componentes que la forman, ejemplo.",
    options: [
    "Aceite y vinagre",
    "Aire atmosférico",
    "Agua y sal disueltos",
    "Hierro y azufre mezclados"
    ],
    correctIndex: 0,
    explanation: "Aceite y vinagre forman una mezcla heterogénea porque sus componentes son visibles a simple vista y no se disuelven entre sí. En cambio, agua con sal es una disolución homogénea, el aire es una mezcla homogénea de gases, y hierro con azufre mezclados forman una mezcla heterogénea, pero el ejemplo clásico solicitado es aceite y vinagre.",
  },
  {
    id: 1003,
    area: "Química",
    text: "¿Cuál es el estado de agregación que no tiene volumen propio y adopta la forma del recipiente que lo contiene?",
    options: [
    "Coloidal",
    "Gaseoso",
    "Líquido",
    "Plasma"
    ],
    correctIndex: 1,
    explanation: "El estado gaseoso no tiene volumen ni forma fijos, ya que sus partículas están muy separadas y se mueven libremente ocupando todo el espacio disponible. El líquido tiene volumen propio, el plasma requiere condiciones extremas y el coloidal es una mezcla, no un estado de agregación puro.",
  },
  {
    id: 1004,
    area: "Química",
    text: "Los electrones se mueven alrededor del núcleo en niveles de energía fija (cuantizada) lo propuso:",
    options: [
    "Dalton",
    "Rutherford",
    "Heisenberg",
    "Bohr"
    ],
    correctIndex: 3,
    explanation: "Bohr propuso el modelo de niveles de energía cuantizados para explicar el espectro del hidrógeno. Rutherford (núcleo) no incluyó cuantización, Dalton (átomo indivisible) no habla de electrones, y Heisenberg (principio de incertidumbre) contradice órbitas fijas.",
  },
  {
    id: 1005,
    area: "Química",
    text: "Los niveles de energía corresponden, en la tabla periódica, a los:",
    options: [
    "Grupos",
    "Orbitales atómicos",
    "Periodos",
    "Números cuánticos"
    ],
    correctIndex: 2,
    explanation: "Los niveles de energía se organizan en periodos (filas horizontales), que indican el número de capas electrónicas. Los grupos son columnas con propiedades similares, los números cuánticos describen orbitales y los orbitales son regiones específicas dentro de un nivel.",
  },
  {
    id: 1006,
    area: "Química",
    text: "Las moléculas que los forman presentan volúmenes definidos, son incompresibles, existen en forma cristalina:",
    options: [
    "Los plasmas",
    "Los líquidos",
    "Los sólidos",
    "Los gases"
    ],
    correctIndex: 2,
    explanation: "Los sólidos tienen volumen definido y son incompresibles debido a que sus partículas están muy juntas y en posiciones fijas, formando estructuras cristalinas. Los líquidos tienen volumen definido pero no forma cristalina, los gases son compresibles y sin volumen fijo, y los plasmas son gases ionizados sin volumen definido.",
  },
  {
    id: 1007,
    area: "Química",
    text: "A la unión química de dos o más átomos se le conoce con el nombre de:",
    options: [
    "Compuesto",
    "Enlace",
    "Molécula",
    "Elemento"
    ],
    correctIndex: 0,
    explanation: "Un compuesto se forma por la unión química de dos o más átomos de diferentes elementos. 'Molécula' es una estructura neutra de átomos unidos, pero puede ser de un solo elemento. 'Elemento' es un tipo de átomo puro. 'Enlace' es la fuerza que mantiene unidos a los átomos, no el resultado de la unión.",
  },
  {
    id: 1008,
    area: "Química",
    text: "A la unión sin combinación química (unión aparente) establecida entre dos o más sustancias se le conoce como:",
    options: [
    "Mezcla",
    "Suspensión",
    "Compuesto",
    "Disolución"
    ],
    correctIndex: 0,
    explanation: "La respuesta correcta es 'Mezcla' porque en una mezcla las sustancias se unen sin formar enlaces químicos, conservando sus propiedades. 'Compuesto' es incorrecto porque implica enlaces químicos fijos; 'Disolución' es un tipo de mezcla homogénea, no el término general; 'Suspensión' es un tipo de mezcla heterogénea, tampoco es el concepto general.",
  },
  {
    id: 1009,
    area: "Física",
    text: "Método de separación de mezclas en el cual la sustancia se hace girar a gran velocidad, separándose los componentes:",
    options: [
    "Destilación",
    "Filtración",
    "Decantación",
    "Centrifugación"
    ],
    correctIndex: 3,
    explanation: "La centrifugación separa componentes por densidad usando fuerza centrífuga al girar a alta velocidad. La destilación separa por puntos de ebullición, la decantación por gravedad y la filtración por tamaño de partícula.",
  },
  {
    id: 1010,
    area: "Química",
    text: "Los compuestos químicos se representan por medio de:",
    options: [
    "Símbolos atómicos",
    "Modelos moleculares",
    "Fórmulas",
    "Ecuaciones químicas"
    ],
    correctIndex: 2,
    explanation: "Las fórmulas químicas representan la composición de los compuestos mediante símbolos y subíndices. Los modelos moleculares son representaciones tridimensionales, las ecuaciones describen reacciones y los símbolos atómicos representan elementos, no compuestos.",
  },
  {
    id: 1011,
    area: "Física",
    text: "Si el número atómico del sodio es 11 y la masa atómica 23, ¿Cuántos neutrones se encuentran en el núcleo del sodio?",
    options: [
    "12",
    "11",
    "23",
    "34"
    ],
    correctIndex: 0,
    explanation: "La respuesta correcta es 12, porque el número de neutrones se calcula restando el número atómico (11) de la masa atómica (23). 11 es el número atómico (protones), no neutrones; 23 es la masa atómica total; y 34 es la suma incorrecta de ambas cantidades.",
  },
  {
    id: 1012,
    area: "Física",
    text: "Si el ácido sulfúrico tiene la fórmula H2SO4, ¿Cuál es su masa molar? (Masa atómica: H=1, S=32, O=16)",
    options: [
    "50",
    "49",
    "64",
    "98"
    ],
    correctIndex: 3,
    explanation: "La masa molar del H2SO4 se calcula sumando: 2(1) + 32 + 4(16) = 2 + 32 + 64 = 98 g/mol. 49 sería la mitad (error al dividir), 50 resulta de confundir el oxígeno (O) con 16 y sumar mal, y 64 corresponde solo a la masa del oxígeno total, ignorando el hidrógeno y azufre.",
  },
  {
    id: 1013,
    area: "Química",
    text: "¿Cuál es el nombre que se le da a la mezcla (por lo general) líquida de varias sustancias?",
    options: [
    "Emulsión",
    "Disolución",
    "Coloide",
    "Suspensión"
    ],
    correctIndex: 1,
    explanation: "La respuesta correcta es 'Disolución' porque se refiere a una mezcla homogénea de dos o más sustancias, donde el soluto se dispersa uniformemente en el disolvente. Las alternativas son incorrectas: 'Suspensión' es una mezcla heterogénea donde las partículas sedimentan; 'Coloide' tiene partículas intermedias que no sedimentan pero dispersan la luz; 'Emulsión' es un tipo de coloide entre líquidos inmiscibles.",
  },
  {
    id: 1014,
    area: "Química",
    text: "Si un elemento tiene 11 protones y 12 neutrones, ¿cuál es su número atómico?",
    options: [
    "23",
    "11",
    "1",
    "12"
    ],
    correctIndex: 1,
    explanation: "El número atómico es igual al número de protones, que en este caso es 11. La opción 23 corresponde a la masa atómica (protones + neutrones), 12 al número de neutrones y 1 sería el número de electrones en un átomo neutro, pero no el número atómico.",
  },
  {
    id: 1015,
    area: "Química",
    text: "Una de las características de los líquidos es:",
    options: [
    "Tienen volumen constante y forma definida",
    "Sus moléculas están en posiciones fijas y ordenadas",
    "Se expanden para ocupar todo el espacio disponible",
    "Adoptan la forma del recipiente que los contiene"
    ],
    correctIndex: 3,
    explanation: "Los líquidos adoptan la forma del recipiente porque sus moléculas tienen suficiente libertad de movimiento para fluir, pero mantienen un volumen constante. Las opciones incorrectas describen propiedades de sólidos (forma definida y posiciones fijas) o de gases (expansión total), no de líquidos.",
  },
  {
    id: 1016,
    area: "Química",
    text: "Una de las características de los gases es:",
    options: [
    "Moléculas muy separadas",
    "Fuerzas intermoleculares intensas",
    "Volumen fijo y definido",
    "Alta densidad molecular"
    ],
    correctIndex: 0,
    explanation: "La respuesta correcta es 'Moléculas muy separadas' porque en los gases las partículas están muy distantes entre sí, lo que explica su baja densidad y alta compresibilidad. Las opciones incorrectas describen propiedades de sólidos o líquidos: fuerzas intensas y volumen fijo son típicos de sólidos, y la alta densidad es característica de líquidos o sólidos.",
  },
  {
    id: 1017,
    area: "Química",
    text: "¿Cuál es el peso molecular del nitrato de plata si su fórmula química es: AgNO3?",
    options: [
    "340 gr",
    "170 gr",
    "107 gr",
    "247 gr"
    ],
    correctIndex: 1,
    explanation: "La masa atómica de Ag es 108, N es 14, y O3 son 48; sumando 108+14+48=170 g/mol. 107 gr corresponde solo a la plata, 247 gr es un error al sumar Ag+NO3+NO3, y 340 gr es el doble del peso molecular correcto.",
  },
  {
    id: 1018,
    area: "Química",
    text: "La reacción química entre un metal y el oxígeno da como producto:",
    options: [
    "Un hidróxido",
    "Un óxido",
    "Una sal",
    "Un peróxido"
    ],
    correctIndex: 1,
    explanation: "La reacción de un metal con oxígeno forma un óxido básico; las sales requieren un ácido, los hidróxidos necesitan agua y los peróxidos se forman con metales muy reactivos en exceso de oxígeno.",
  },
  {
    id: 1019,
    area: "Química",
    text: "La reacción química entre el hidrógeno y un no metal da como producto:",
    options: [
    "Un hidróxido",
    "Un óxido básico",
    "Una sal",
    "Un ácido"
    ],
    correctIndex: 3,
    explanation: "La reacción entre hidrógeno y un no metal produce un hidrácido (ej. HCl, H2S), que es un ácido. Las sales requieren un metal, los óxidos básicos provienen de metales con oxígeno, y los hidróxidos de metales con grupos OH, por lo que no se forman en esta reacción.",
  },
  {
    id: 1020,
    area: "Química",
    text: "La reacción química entre un metal y el radical OH da como producto:",
    options: [
    "Una base",
    "Un ácido",
    "Una sal",
    "Un óxido"
    ],
    correctIndex: 0,
    explanation: "Cuando un metal reacciona con el radical OH (hidróxido), se forma un compuesto iónico que libera iones OH⁻ en disolución, característico de las bases. Las sales provienen de ácido + base, los óxidos de metal + oxígeno, y los ácidos liberan H⁺, no OH⁻.",
  },
  {
    id: 1021,
    area: "Física",
    text: "La cantidad de calor para elevar la temperatura de un gramo de agua 1 grado centígrado es:",
    options: [
    "Joule",
    "Ergio",
    "Caloría",
    "BTU"
    ],
    correctIndex: 2,
    explanation: "La caloría es la unidad de calor definida como la cantidad de energía necesaria para elevar 1 °C la temperatura de 1 gramo de agua. El joule y el ergio son unidades de energía en el SI y cgs, pero no corresponden a esta definición específica; el BTU es una unidad más grande (libra de agua, 1 °F).",
  },
  {
    id: 1022,
    area: "Química",
    text: "El enlace doble entre carbonos es característico de los hidrocarburos conocidos como:",
    options: [
    "Alquinos",
    "Aromáticos",
    "Alquenos",
    "Alcanos"
    ],
    correctIndex: 2,
    explanation: "Los alquenos se caracterizan por tener al menos un enlace doble entre carbonos, a diferencia de los alcanos (enlaces simples), alquinos (enlaces triples) y aromáticos (estructura cíclica con enlaces resonantes).",
  },
  {
    id: 1023,
    area: "Química",
    text: "El enlace triple entre carbonos es característico de los hidrocarburos conocidos como:",
    options: [
    "Alquenos",
    "Alquinos",
    "Alcanos",
    "Cicloalcanos"
    ],
    correctIndex: 1,
    explanation: "Los alquinos son hidrocarburos insaturados que contienen al menos un enlace triple carbono-carbono, a diferencia de los alquenos (enlace doble), alcanos (enlace simple) y cicloalcanos (enlaces simples en anillo).",
  },
  {
    id: 1024,
    area: "Física",
    text: "Si el elemento Fe tiene 26 electrones y su masa atómica es de 56, ¿cuál es su número de neutrones?",
    options: [
    "56",
    "82",
    "30",
    "26"
    ],
    correctIndex: 2,
    explanation: "Los neutrones se calculan restando el número atómico (protones, igual a electrones en un átomo neutro) de la masa atómica: 56 - 26 = 30. Las otras opciones corresponden a los electrones (26), la masa atómica (56) y la suma de electrones y masa (82), que son errores comunes.",
  },
  {
    id: 1025,
    area: "Química",
    text: "La fórmula química HCl, tiene el nombre de:",
    options: [
    "Cloruro de hidrógeno",
    "Ácido clorhídrico",
    "Ácido clórico",
    "Ácido hipocloroso"
    ],
    correctIndex: 1,
    explanation: "La fórmula HCl representa al ácido clorhídrico, un ácido fuerte formado por hidrógeno y cloro. 'Ácido hipocloroso' corresponde a HClO, 'Cloruro de hidrógeno' es el nombre del compuesto en estado gaseoso (no de su disolución ácida), y 'Ácido clórico' es HClO3, por lo que son incorrectos.",
  },
  {
    id: 1026,
    area: "Química",
    text: "La fórmula química NaCl, tiene el nombre de:",
    options: [
    "Cloruro de sódico",
    "Clorato de sodio",
    "Nitruro de sodio",
    "Cloruro de sodio"
    ],
    correctIndex: 3,
    explanation: "El nombre correcto Cloruro de sodio sigue la nomenclatura sistemática donde el metal (sodio) conserva su nombre y el no metal (cloro) termina en -uro. 'Clorato' indica un oxianión (ClO₃⁻), no un cloruro. 'Sódico' es un adjetivo incorrecto para el catión. 'Nitruro de sodio' corresponde a NaN, no a NaCl.",
  },
  {
    id: 1027,
    area: "Química",
    text: "Según la Ley de Gay-Lussac al aumentar la temperatura sobre un gas, su presión:",
    options: [
    "Aumenta",
    "Disminuye",
    "Se mantiene constante",
    "Se vuelve cero"
    ],
    correctIndex: 0,
    explanation: "La Ley de Gay-Lussac establece que, a volumen constante, la presión de un gas es directamente proporcional a su temperatura absoluta (P/T = k). Por lo tanto, al aumentar la temperatura, las moléculas del gas se mueven más rápido y chocan con más fuerza contra las paredes, incrementando la presión. Las opciones incorrectas contradicen esta relación directa: disminuir o mantener constante la presión no ocurre si la temperatura sube, y que se vuelva cero sería imposible a menos que la temperatura llegue al cero absoluto.",
  },
  {
    id: 1028,
    area: "Química",
    text: "De acuerdo con la Ley de Boyle, si a un gas se le aumenta la presión y su temperatura se mantiene constante, su volumen:",
    options: [
    "Se duplica",
    "Permanece igual",
    "Disminuye",
    "Aumenta"
    ],
    correctIndex: 2,
    explanation: "Según la Ley de Boyle, a temperatura constante, la presión y el volumen de un gas son inversamente proporcionales (PV=k). Por lo tanto, si la presión aumenta, el volumen disminuye. Las opciones incorrectas confunden la relación inversa con una directa o constante.",
  },
  {
    id: 1029,
    area: "Química",
    text: "Según la Ley de Charles al disminuir la temperatura de un gas, su volumen:",
    options: [
    "Se duplica",
    "Permanece constante",
    "Aumenta",
    "Disminuye"
    ],
    correctIndex: 3,
    explanation: "La Ley de Charles establece que, a presión constante, el volumen de un gas es directamente proporcional a su temperatura absoluta (V/T = k). Por lo tanto, al disminuir la temperatura, el volumen disminuye. Las opciones incorrectas son plausibles pero falsas: 'Aumenta' contradice la proporcionalidad directa; 'Se duplica' es arbitrario; 'Permanece constante' ignora la relación de variación térmica.",
  },
  {
    id: 1030,
    area: "Química",
    text: "El agua de mar es una solución en la que las sales están disueltas uniformemente, por lo que constituye una mezcla:",
    options: [
    "Heterogénea",
    "Homogénea",
    "Suspensión",
    "Coloidal"
    ],
    correctIndex: 1,
    explanation: "El agua de mar es una mezcla homogénea porque sus componentes (sales y agua) están distribuidos uniformemente a nivel molecular, formando una sola fase. Las opciones heterogénea, coloidal y suspensión son incorrectas porque implican partículas visibles o fases separadas, lo que no ocurre en una disolución verdadera.",
  },
  {
    id: 1031,
    area: "Física",
    text: "De acuerdo con la tercera ley de Newton, a toda acción:",
    options: [
    "Corresponde una reacción de igual magnitud y dirección contraria",
    "Corresponde una reacción de magnitud inversamente proporcional",
    "Corresponde una reacción de igual magnitud y misma dirección",
    "Corresponde una reacción de igual magnitud en la misma línea de acción"
    ],
    correctIndex: 0,
    explanation: "La tercera ley de Newton establece que las fuerzas de acción y reacción son iguales en magnitud y opuestas en dirección, actuando sobre cuerpos diferentes. Las opciones incorrectas fallan al sugerir misma dirección, magnitud inversa, o solo misma línea de acción sin especificar dirección contraria.",
  },
  {
    id: 1032,
    area: "Física",
    text: "En la primera ley de Newton, la inercia se describe como:",
    options: [
    "La inercia es la fuerza que mantiene a los cuerpos en movimiento uniforme o en reposo, y su magnitud depende de la velocidad del objeto",
    "Un cuerpo mantiene su estado de movimiento o de reposo si no hay fuerzas externas que actúen sobre él",
    "Un cuerpo en reposo tiende a permanecer en reposo, pero un cuerpo en movimiento tiende a detenerse por sí mismo debido a la fricción",
    "La inercia se define como la resistencia de un cuerpo a cambiar su velocidad solo cuando actúa una fuerza externa constante sobre él"
    ],
    correctIndex: 1,
    explanation: "La primera ley de Newton (ley de inercia) establece que un cuerpo permanece en reposo o movimiento rectilíneo uniforme a menos que una fuerza externa neta actúe sobre él. Las opciones incorrectas confunden inercia con fuerza, introducen fricción como causa del reposo o condicionan incorrectamente la inercia a fuerzas constantes.",
  },
  {
    id: 1033,
    area: "Física",
    text: "La aceleración es directamente proporcional a la fuerza e inversamente proporcional a la masa del objeto.",
    options: [
    "a = F / m",
    "a = F * m",
    "a = m * F^2",
    "a = m / F"
    ],
    correctIndex: 0,
    explanation: "La segunda ley de Newton establece que la aceleración es directamente proporcional a la fuerza neta e inversamente proporcional a la masa, lo que se expresa como a = F/m. Las opciones incorrectas invierten la relación o multiplican incorrectamente las variables, lo que contradice la proporcionalidad inversa con la masa.",
  },
  {
    id: 1034,
    area: "Química",
    text: "En física, se llama a todo aquello que ocupe un lugar en el espacio:",
    options: [
    "Elemento",
    "Compuesto",
    "Sustancia",
    "Materia"
    ],
    correctIndex: 3,
    explanation: "La respuesta correcta es 'Materia' porque en física se define como todo aquello que tiene masa y ocupa un lugar en el espacio. Las opciones 'Sustancia', 'Elemento' y 'Compuesto' son términos de química que se refieren a tipos específicos de materia, pero no abarcan la definición general de ocupar espacio.",
  },
  {
    id: 1035,
    area: "Química",
    text: "Cuando un objeto se ve en un espejo, la imagen formada se debe al fenómeno de:",
    options: [
    "Dispersión",
    "Difracción",
    "Refracción",
    "Reflexión"
    ],
    correctIndex: 3,
    explanation: "La respuesta correcta es Reflexión, ya que en un espejo la luz rebota en la superficie lisa formando una imagen virtual. La refracción implica cambio de medio, la difracción desviación por bordes y la dispersión separación de colores, fenómenos no involucrados aquí.",
  },
  {
    id: 1036,
    area: "Química",
    text: "Un frasco con tapa apretada se destapa con facilidad haciendo fluir agua caliente sobre ella. ¿Por qué?",
    options: [
    "Se dilata el metal de la tapa",
    "Disminuye la presión interna del frasco",
    "El vapor de agua lubrica la rosca",
    "Aumenta su volumen"
    ],
    correctIndex: 3,
    explanation: "La respuesta correcta es 'Aumenta su volumen' porque el calor provoca la expansión del metal de la tapa (dilatación térmica), aflojándola. Las alternativas son incorrectas: la presión interna no disminuye, el metal se dilata pero no es la causa principal, y el vapor no lubrica, sino que el efecto térmico es el clave.",
  },
  {
    id: 1037,
    area: "Física",
    text: "Cuando un elemento es un mal conductor del calor y la electricidad, se dice que es un:",
    options: [
    "Aislante",
    "Semiconductor",
    "No metal",
    "Conductor térmico"
    ],
    correctIndex: 2,
    explanation: "Los no metales son malos conductores del calor y la electricidad, a diferencia de los metales. Los semiconductores conducen bajo ciertas condiciones, los aislantes son un tipo específico de material no conductor (pero no todos los no metales son aislantes), y un conductor térmico sería un buen conductor, no uno malo.",
  },
  {
    id: 1038,
    area: "Química",
    text: "Una medida de volumen es:",
    options: [
    "El metro",
    "El mol",
    "El gramo",
    "El litro"
    ],
    correctIndex: 3,
    explanation: "El litro es la unidad de medida de volumen en el Sistema Internacional, usada para líquidos y gases. El metro mide longitud, el gramo masa y el mol cantidad de sustancia, por lo que no son unidades de volumen.",
  },
  {
    id: 1039,
    area: "Física",
    text: "Una medida de masa es:",
    options: [
    "El kilogramo",
    "El newton",
    "El segundo",
    "El metro"
    ],
    correctIndex: 0,
    explanation: "El kilogramo es la unidad base de masa en el Sistema Internacional (SI). El metro mide longitud, el segundo mide tiempo, y el newton mide fuerza (que depende de masa y aceleración), por lo que no son medidas de masa.",
  },
  {
    id: 1040,
    area: "Física",
    text: "Una esfera de metal recibe una fuerza de 60 N y alcanza una aceleración de 12 m/seg2. ¿Cuál es la masa de la esfera?",
    options: [
    "48 kg",
    "5 kg",
    "720 kg",
    "0.2 kg"
    ],
    correctIndex: 1,
    explanation: "La segunda ley de Newton establece que F = m * a, por lo que m = F / a = 60 N / 12 m/s² = 5 kg. 720 kg resultaría de multiplicar, 48 kg de sumar, y 0.2 kg de dividir al revés (a/F).",
  },
  {
    id: 1041,
    area: "Física",
    text: "Considerando que la velocidad de un objeto es el cociente de la distancia recorrida entre el tiempo empleado para recorrerla. ¿Cuál es la velocidad de un móvil que recorrió 100 Km en 5 horas?",
    options: [
    "500 km/hr",
    "0.05 km/hr",
    "20 km/min",
    "20 km/hr"
    ],
    correctIndex: 3,
    explanation: "La velocidad se calcula dividiendo distancia entre tiempo: 100 km / 5 h = 20 km/h. '0.05 km/hr' es el inverso (tiempo/distancia); '500 km/hr' resulta de multiplicar en vez de dividir (100×5); '20 km/min' confunde horas con minutos, pues 20 km/min equivaldría a 1200 km/h, un error de unidades común.",
  },
  {
    id: 1042,
    area: "Física",
    text: "Si el trabajo mecánico es el producto de la fuerza aplicada y la distancia recorrida por el móvil, ¿Qué trabajo se obtiene al aplicar una fuerza de 85 Newtons sobre un cuerpo para que éste recorra 22 metros?",
    options: [
    "1870 Newtons",
    "187 Joules",
    "1070 Joules",
    "1870 Joules"
    ],
    correctIndex: 3,
    explanation: "La respuesta correcta se obtiene multiplicando fuerza (85 N) por distancia (22 m), dando 1870 J. Los distractores incluyen errores comunes: 1070 J (restar en vez de multiplicar), 187 J (error de decimal al mover el punto), y 1870 Newtons (confundir la unidad de trabajo con la de fuerza).",
  },
  {
    id: 1043,
    area: "Física",
    text: "Existen dos tipos de magnitudes:",
    options: [
    "Escalar, vectorial",
    "Fundamentales, derivadas",
    "Directas, inversas",
    "Continuas, discretas"
    ],
    correctIndex: 0,
    explanation: "Las magnitudes se clasifican en escalares (solo tienen valor numérico y unidad, como masa o tiempo) y vectoriales (requieren dirección y sentido, como fuerza o velocidad). Las opciones incorrectas se refieren a otras clasificaciones (tipos de unidades, proporcionalidades o naturaleza de datos) que no corresponden a la clasificación principal de magnitudes en física.",
  },
  {
    id: 1044,
    area: "Física",
    text: "En física, la _____ es la razón de cambio de velocidad con respecto al tiempo:",
    options: [
    "Fuerza",
    "Aceleración",
    "Inercia",
    "Velocidad"
    ],
    correctIndex: 1,
    explanation: "La aceleración se define como la variación de la velocidad en un intervalo de tiempo. La velocidad es la razón de cambio de posición, no de velocidad; la inercia es la resistencia al cambio de movimiento; y la fuerza es la causa que puede producir aceleración, pero no es la razón de cambio de velocidad.",
  },
  {
    id: 1045,
    area: "Física",
    text: "En física, potencia es la cantidad de trabajo efectuado por unidad de _____.",
    options: [
    "Tiempo",
    "Masa",
    "Distancia",
    "Fuerza"
    ],
    correctIndex: 0,
    explanation: "La potencia se define como la rapidez con la que se realiza trabajo, es decir, trabajo por unidad de tiempo. Las otras opciones (fuerza, masa, distancia) son magnitudes que intervienen en el cálculo del trabajo, pero no definen la potencia directamente.",
  },
  {
    id: 1046,
    area: "Física",
    text: "La fuerza ejercida sobre un cuerpo se puede medir en:",
    options: [
    "Newtons",
    "Watts",
    "Pascales",
    "Joules"
    ],
    correctIndex: 0,
    explanation: "La fuerza se mide en Newtons en el Sistema Internacional, ya que es la unidad derivada de masa por aceleración (kg·m/s²). Los Joules miden energía o trabajo, los Pascales miden presión y los Watts miden potencia, por lo que son incorrectas para fuerza.",
  },
  {
    id: 1047,
    area: "Química",
    text: "A cuántos ºC equivalen 73 K:",
    options: [
    "200 ºC",
    "346 ºC",
    "-200 ºC",
    "-346 ºC"
    ],
    correctIndex: 2,
    explanation: "Para convertir Kelvin a Celsius se resta 273.15 (aproximadamente 273), por lo que 73 K - 273 = -200 °C. Las opciones incorrectas surgen de sumar en lugar de restar (346 °C), no considerar el signo (200 °C) o sumar con signo equivocado (-346 °C).",
  },
  {
    id: 1048,
    area: "Física",
    text: "Una cantidad física que solo depende de su magnitud es una cantidad:",
    options: [
    "Escalar",
    "Fundamental",
    "Vectorial",
    "Tensorial"
    ],
    correctIndex: 0,
    explanation: "Una cantidad escalar se define únicamente por su magnitud (ej. masa, temperatura), sin dirección. Las opciones vectorial y tensorial requieren dirección y/o más información, mientras que fundamental se refiere a unidades base, no a si depende solo de la magnitud.",
  },
  {
    id: 1049,
    area: "Español",
    text: "Las palabras 'el, la, los, las' son ejemplos de:",
    options: [
    "Artículos",
    "Determinantes",
    "Pronombres",
    "Adjetivos"
    ],
    correctIndex: 0,
    explanation: "La respuesta correcta es 'Artículos' porque 'el, la, los, las' son palabras que acompañan al sustantivo para indicar su género y número, y son específicamente artículos determinados. 'Pronombres' es incorrecto porque los pronombres sustituyen al nombre, no lo acompañan; 'Determinantes' es demasiado amplio, pues incluye también posesivos y demostrativos; y 'Adjetivos' es incorrecto porque los adjetivos califican o describen al sustantivo, no lo determinan.",
  },
  {
    id: 1050,
    area: "Español",
    text: "Las palabras 'dulce, difícil, grande' son ejemplos de:",
    options: [
    "Sustantivos",
    "Adjetivos",
    "Adverbios",
    "Artículos"
    ],
    correctIndex: 1,
    explanation: "Las palabras 'dulce, difícil, grande' son adjetivos porque califican o describen características de un sustantivo. No son sustantivos (nombran cosas), adverbios (modifican verbos, adjetivos u otros adverbios) ni artículos (determinan al sustantivo).",
  },
  {
    id: 1051,
    area: "Español",
    text: "Las palabras 'y, ni, pero, sino' son ejemplos de:",
    options: [
    "Conjunciones",
    "Preposiciones",
    "Artículos",
    "Adverbios"
    ],
    correctIndex: 0,
    explanation: "Las palabras 'y, ni, pero, sino' son conjunciones porque sirven para unir palabras, frases u oraciones. Las preposiciones unen elementos estableciendo relación de dependencia (ej. 'de', 'para'), los adverbios modifican verbos o adjetivos (ej. 'rápido'), y los artículos determinan al sustantivo (ej. 'el', 'una'), por lo que no encajan en la función de enlace coordinante de estos ejemplos.",
  },
  {
    id: 1052,
    area: "Español",
    text: "¿Cuál es la primera persona del plural?",
    options: [
    "Ustedes",
    "Nosotros",
    "Vosotros",
    "Ellos"
    ],
    correctIndex: 1,
    explanation: "La primera persona del plural en español es 'nosotros', que indica el hablante junto con otras personas. 'Ellos' es tercera persona, 'vosotros' es segunda persona del plural (usado en España) y 'ustedes' es segunda persona formal o tercera persona en América.",
  },
  {
    id: 1053,
    area: "Español",
    text: "¿Cuál es la primera persona del singular?",
    options: [
    "Tú",
    "Él",
    "Yo",
    "Nosotros"
    ],
    correctIndex: 2,
    explanation: "La primera persona del singular es 'yo', que se refiere a quien habla. 'Él' es tercera persona del singular, 'tú' es segunda persona del singular y 'nosotros' es primera persona del plural, por lo que todas son incorrectas.",
  },
  {
    id: 1054,
    area: "Español",
    text: "Las palabras 'estudiante' y 'alumno' son ejemplo de:",
    options: [
    "Parónimos",
    "Sinónimos",
    "Antónimos",
    "Homófonos"
    ],
    correctIndex: 1,
    explanation: "Estudiante y alumno son sinónimos porque tienen significado equivalente. Antónimos son opuestos, homófonos suenan igual pero se escriben diferente, y parónimos tienen escritura y sonido parecidos pero distinto significado.",
  },
  {
    id: 1055,
    area: "Español",
    text: "Las palabras 'Asar (cocinar al fuego)' y 'Azahar (flor del naranjo)' son ejemplo de:",
    options: [
    "Homógrafas",
    "Antónimos",
    "Parónimos",
    "Homófonos"
    ],
    correctIndex: 3,
    explanation: "Las palabras 'asar' y 'azahar' suenan igual pero se escriben diferente y tienen distinto significado, por lo que son homófonas. Homógrafas se escriben igual, parónimos suenan parecido pero no igual, y antónimos son opuestos.",
  },
  {
    id: 1056,
    area: "Matemáticas",
    text: "Género narrativo caracterizado por relatar una historia en prosa, en la que se describen acciones fingidas:",
    options: [
    "Tratado matemático",
    "Teorema geométrico",
    "Demostración algebraica",
    "Novela"
    ],
    correctIndex: 3,
    explanation: "La novela es un género narrativo en prosa que relata acciones fingidas. Las opciones incorrectas pertenecen a géneros o formatos propios de las matemáticas, no de la narrativa literaria.",
  },
  {
    id: 1057,
    area: "Matemáticas",
    text: "Género literario al que pertenecen las obras dramáticas compuestas para ser representadas en un escenario:",
    options: [
    "Álgebra",
    "Geometría",
    "Ecuaciones",
    "Teatro"
    ],
    correctIndex: 3,
    explanation: "El teatro es el género literario de las obras dramáticas diseñadas para representación escénica. Las otras opciones son ramas de las matemáticas (área indicada), pero no corresponden a un género literario.",
  },
  {
    id: 1058,
    area: "Matemáticas",
    text: "Arte del lenguaje de expresar o sugerir por medio de la palabra, el ritmo, la armonía y la imagen, opuesta a la prosa:",
    options: [
    "Ecuación",
    "Poesía",
    "Geometría",
    "Función"
    ],
    correctIndex: 1,
    explanation: "La poesía es un género literario que utiliza el ritmo, la armonía y la imagen, oponiéndose a la prosa. Las opciones incorrectas (Ecuación, Geometría, Función) son conceptos matemáticos que no corresponden al arte del lenguaje descrito.",
  },
  {
    id: 1059,
    area: "Matemáticas",
    text: "La diferencia de dos cuadrados está representada por:",
    options: [
    "a² + b²",
    "(a + b)²",
    "a² - b²",
    "(a - b)²"
    ],
    correctIndex: 2,
    explanation: "La diferencia de dos cuadrados es a² - b², que se factoriza como (a + b)(a - b). Las opciones (a + b)² y (a - b)² son binomios al cuadrado (dan a² ± 2ab + b²), mientras que a² + b² es una suma de cuadrados, no factorizable en reales.",
  },
  {
    id: 1060,
    area: "Matemáticas",
    text: "El triple del cuadrado de un número, más el doble de este, menos otro número:",
    options: [
    "3x² + 2x - y",
    "3x² + 2x - y²",
    "3x² - 2x + y",
    "3x² + 2y - x"
    ],
    correctIndex: 0,
    explanation: "La respuesta correcta traduce literalmente: 'triple del cuadrado de un número' = 3x², 'más el doble de este' = +2x, 'menos otro número' = -y. Las opciones incorrectas alteran las variables o los signos: una eleva al cuadrado el segundo número, otra intercambia las variables, y la tercera cambia el signo del doble y suma en lugar de restar.",
  },
  {
    id: 1061,
    area: "Matemáticas",
    text: "¿Cuál es el resultado correcto para la operación: (10x² + 6x - 15) + (-3x² - 16x + 9)?",
    options: [
    "7x² + 22x - 6",
    "7x² - 10x - 6",
    "13x² - 10x + 24",
    "-7x² - 10x - 6"
    ],
    correctIndex: 1,
    explanation: "La respuesta correcta se obtiene sumando términos semejantes: (10x² + (-3x²)) = 7x², (6x + (-16x)) = -10x, (-15 + 9) = -6. Los distractores presentan errores comunes como sumar incorrectamente los coeficientes de x², confundir signos al sumar los términos lineales o al combinar las constantes.",
  },
  {
    id: 1062,
    area: "Matemáticas",
    text: "En la siguiente operación con polinomios (18x³ - 16x² + 20x) - (16x³ + 15x² - 12x):",
    options: [
    "2x³ - 1x² + 32x",
    "2x³ - 29x² + 8x",
    "2x³ - 29x² + 32x",
    "2x³ - 31x² + 8x"
    ],
    correctIndex: 2,
    explanation: "La respuesta correcta se obtiene restando coeficientes término a término: 18x³-16x³=2x³, (-16x²)-(+15x²)=-29x², y 20x-(-12x)=32x. Los distractores fallan al no restar correctamente los signos o los coeficientes, como confundir la resta de términos negativos o sumar en lugar de restar.",
  },
  {
    id: 1063,
    area: "Matemáticas",
    text: "La solución para el producto de (2x + 5)(3x - 8) ¿es?",
    options: [
    "6x² + x - 40",
    "6x² - 16x - 40",
    "6x² - x + 40",
    "6x² - x - 40"
    ],
    correctIndex: 3,
    explanation: "La respuesta correcta se obtiene aplicando la propiedad distributiva: (2x)(3x) = 6x², (2x)(-8) = -16x, (5)(3x) = 15x, y (5)(-8) = -40. Al sumar los términos lineales: -16x + 15x = -x, resultando 6x² - x - 40. Las opciones incorrectas presentan errores comunes como signos equivocados en el término lineal o en el constante.",
  },
  {
    id: 1064,
    area: "Matemáticas",
    text: "Al desarrollar la operación en la expresión (x - 9)² ¿Se obtiene como resultado?",
    options: [
    "x² - 9x + 81",
    "x² + 81",
    "x² - 18x - 81",
    "x² - 18x + 81"
    ],
    correctIndex: 3,
    explanation: "La respuesta correcta se obtiene aplicando el binomio al cuadrado: (a - b)² = a² - 2ab + b². Al sustituir a = x y b = 9, resulta x² - 2(x)(9) + 9² = x² - 18x + 81. Las opciones incorrectas omiten el término cruzado, lo calculan mal o cambian el signo del término independiente.",
  },
  {
    id: 1065,
    area: "Matemáticas",
    text: "Al operar la siguiente expresión (5x + 10)(5x - 10), ¿Se obtiene?",
    options: [
    "25x² + 100",
    "25x² - 20x - 100",
    "5x² - 100",
    "25x² - 100"
    ],
    correctIndex: 3,
    explanation: "La expresión (5x+10)(5x-10) es un producto de binomios conjugados, que da como resultado el cuadrado del primer término menos el cuadrado del segundo: (5x)² - (10)² = 25x² - 100. Las opciones incorrectas confunden la fórmula, ya sea sumando los cuadrados, olvidando elevar el coeficiente 5, o aplicando incorrectamente la multiplicación de binomios con término común.",
  },
  {
    id: 1066,
    area: "Matemáticas",
    text: "¿Cuál es la solución para la expresión algebraica (x - 12)(x - 4)?",
    options: [
    "x² - 8x + 48",
    "x² - 16x + 48",
    "x² - 16x - 48",
    "x² + 16x + 48"
    ],
    correctIndex: 1,
    explanation: "Para resolver (x - 12)(x - 4), se aplica la propiedad distributiva: x·x = x², x·(-4) = -4x, (-12)·x = -12x, (-12)·(-4) = +48. Sumando términos semejantes: -4x - 12x = -16x, resultado: x² - 16x + 48. Las opciones incorrectas alteran signos o coeficientes, como sumar 16x en lugar de restarlo, cambiar el signo del término independiente o usar -8x que proviene de sumar 4+12 en vez de multiplicar.",
  },
  {
    id: 1067,
    area: "Matemáticas",
    text: "La factorización del trinomio x² - 3x - 40 es:",
    options: [
    "(x - 8)(x + 5)",
    "(x - 4)(x + 10)",
    "(x - 5)(x + 8)",
    "(x + 8)(x - 5)"
    ],
    correctIndex: 0,
    explanation: "La respuesta correcta (x - 8)(x + 5) se obtiene buscando dos números que multiplicados den -40 y sumados den -3: -8 y +5. Las opciones incorrectas fallan en la combinación de signos o factores, como (x - 5)(x + 8) que suma +3, o (x - 4)(x + 10) que suma +6, o repiten el error de signos.",
  },
  {
    id: 1068,
    area: "Matemáticas",
    text: "Factorice la expresión x² + 9x + 20:",
    options: [
    "(x + 5)(x + 4)",
    "(x + 10)(x + 2)",
    "(x + 20)(x + 1)",
    "(x - 5)(x - 4)"
    ],
    correctIndex: 0,
    explanation: "La respuesta correcta (x + 5)(x + 4) se obtiene al buscar dos números que sumen 9 y multipliquen 20. Las opciones incorrectas fallan: (x+10)(x+2) suma 12, (x+20)(x+1) suma 21, y (x-5)(x-4) suma -9, por lo que no cumplen con el coeficiente lineal 9.",
  },
  {
    id: 1069,
    area: "Matemáticas",
    text: "Factoriza la expresión x² - 9:",
    options: [
    "(x + 9)(x - 1)",
    "(x + 3)(x + 3)",
    "(x - 3)(x - 3)",
    "(x + 3)(x - 3)"
    ],
    correctIndex: 3,
    explanation: "La expresión x² - 9 es una diferencia de cuadrados, que se factoriza como (x + 3)(x - 3). Las opciones (x - 3)(x - 3) y (x + 3)(x + 3) darían x² - 6x + 9 y x² + 6x + 9 respectivamente, mientras que (x + 9)(x - 1) resulta en x² + 8x - 9, ninguna igual a x² - 9.",
  },
  {
    id: 1070,
    area: "Matemáticas",
    text: "¿Cuánto mide el ángulo complementario de 35°?",
    options: [
    "125°",
    "145°",
    "35°",
    "55°"
    ],
    correctIndex: 3,
    explanation: "El ángulo complementario de 35° es 55° porque la suma de ángulos complementarios es 90° (90-35=55). 145° es el suplementario (180-35), 35° es el mismo ángulo, y 125° es el resultado de restar 35 de 160, un error común.",
  },
  {
    id: 1071,
    area: "Matemáticas",
    text: "¿Cuántos grados debe medir el ángulo suplementario de 48°?",
    options: [
    "90°",
    "132°",
    "312°",
    "48°"
    ],
    correctIndex: 1,
    explanation: "Los ángulos suplementarios suman 180°, por lo que el suplemento de 48° es 180° - 48° = 132°. 48° es el complemento (suma 90°), 312° es el resultado de restar 48° de 360° (ángulo conjugado), y 90° es un ángulo recto, no relacionado con la suma.",
  },
  {
    id: 1072,
    area: "Matemáticas",
    text: "¿Cuándo se dice que dos triángulos son semejantes?",
    options: [
    "Cuando tienen la misma medida en sus lados correspondientes",
    "Cuando tienen el mismo perímetro y área",
    "Cuando tienen ángulos iguales y lados proporcionales",
    "Cuando tienen la misma forma y no necesariamente deben ser iguales"
    ],
    correctIndex: 3,
    explanation: "Dos triángulos son semejantes si tienen la misma forma, es decir, sus ángulos correspondientes son iguales y sus lados están en proporción, sin necesidad de que tengan el mismo tamaño. Las opciones incorrectas confunden semejanza con congruencia (lados iguales) o con igualdad de perímetro y área, que no son condiciones suficientes para la semejanza.",
  },
  {
    id: 1073,
    area: "Matemáticas",
    text: "¿Cuál es el área de un triángulo si su base mide 24 cm y su altura 30 cm?",
    options: [
    "720 cm²",
    "360 cm²",
    "180 cm²",
    "1440 cm²"
    ],
    correctIndex: 1,
    explanation: "El área del triángulo se calcula como (base × altura) / 2, es decir, (24 × 30) / 2 = 720 / 2 = 360 cm². La opción 720 cm² es el producto sin dividir entre 2, 180 cm² es la mitad de la altura por error, y 1440 cm² corresponde a multiplicar base y altura y luego por 2.",
  },
  {
    id: 1074,
    area: "Matemáticas",
    text: "¿Cuánto mide el perímetro de un círculo cuyo diámetro es de 10 cm?",
    options: [
    "62.8 cm",
    "15.7 cm",
    "20 cm",
    "31.4 cm"
    ],
    correctIndex: 3,
    explanation: "La fórmula del perímetro (circunferencia) de un círculo es π × diámetro. Con π ≈ 3.14 y diámetro = 10 cm, el resultado es 31.4 cm. 15.7 cm sería la mitad (radio × π), 20 cm es el doble del radio sin π, y 62.8 cm es el doble del perímetro correcto (confundir con 2πr usando radio = 10 en lugar de 5).",
  },
  {
    id: 1075,
    area: "Matemáticas",
    text: "El resultado de multiplicar (-8a)(-9x) es:",
    options: [
    "72ax",
    "72a²x",
    "-72ax",
    "-72a²x²"
    ],
    correctIndex: 0,
    explanation: "Al multiplicar (-8a)(-9x), se multiplican los coeficientes (-8)(-9)=72 y las literales a·x=ax, dando 72ax. Las opciones incorrectas fallan al no aplicar correctamente la regla de signos (negativo por negativo da positivo) o al elevar exponentes innecesariamente.",
  },
  {
    id: 1076,
    area: "Matemáticas",
    text: "Nombre del eje horizontal en el plano cartesiano:",
    options: [
    "Ordenadas",
    "Abscisas",
    "Coordenadas",
    "Eje X"
    ],
    correctIndex: 1,
    explanation: "El eje horizontal se llama abscisas (o eje X). Las opciones incorrectas son: 'Coordenadas' es el término general para los pares (x,y); 'Ordenadas' es el nombre del eje vertical; 'Eje X' es un sinónimo coloquial pero no el nombre formal solicitado.",
  },
  {
    id: 1077,
    area: "Matemáticas",
    text: "Dividir (m⁴n⁴p) entre (m²np):",
    options: [
    "m⁶n⁴p",
    "m²n³p",
    "m²np³",
    "m²n³"
    ],
    correctIndex: 3,
    explanation: "Al dividir potencias de la misma base se restan los exponentes: para m: 4-2=2, para n: 4-1=3, para p: 1-1=0 (p⁰=1). Las opciones incorrectas confunden la resta de exponentes (como m⁶n⁴p que suma en vez de restar) o incluyen p cuando el resultado no tiene p.",
  },
  {
    id: 1078,
    area: "Matemáticas",
    text: "¿Cuánto suman los tres ángulos interiores en un triángulo?",
    options: [
    "270°",
    "360°",
    "180°",
    "90°"
    ],
    correctIndex: 2,
    explanation: "La suma de los ángulos interiores de cualquier triángulo siempre es 180°, un teorema fundamental de geometría euclidiana. 360° corresponde a un cuadrilátero, 270° a un triángulo rectángulo isósceles mal interpretado, y 90° sería la suma de solo dos ángulos agudos.",
  },
  {
    id: 1079,
    area: "Matemáticas",
    text: "El equivalente de 70400000 es:",
    options: [
    "7.04 x 10⁸",
    "70.4 x 10⁷",
    "7.04 x 10⁶",
    "7.04 x 10⁷"
    ],
    correctIndex: 3,
    explanation: "La respuesta correcta es 7.04 x 10⁷ porque 70400000 = 7.04 x 10,000,000. La primera opción mueve el punto decimal un lugar de menos (10⁶), la segunda no respeta la notación estándar (coeficiente mayor a 10), y la tercera agrega un exponente de más (10⁸).",
  },
  {
    id: 1080,
    area: "Matemáticas",
    text: "La cantidad numérica 0.00045 es igual a:",
    options: [
    "4.5 x 10⁻⁴",
    "4.5 x 10⁴",
    "45 x 10⁻⁵",
    "0.45 x 10⁻³"
    ],
    correctIndex: 0,
    explanation: "Para convertir 0.00045 a notación científica, se recorre el punto decimal 4 lugares a la derecha (por eso el exponente es -4), obteniendo 4.5 x 10⁻⁴. Las opciones incorrectas tienen exponentes o coeficientes erróneos: 4.5 x 10⁴ sería 45000, 45 x 10⁻⁵ es 0.00045 pero no está en forma estándar (el coeficiente debe ser menor que 10), y 0.45 x 10⁻³ es 0.00045 pero el coeficiente no está entre 1 y 10.",
  },
  {
    id: 1081,
    area: "Matemáticas",
    text: "El mínimo común múltiplo para los números 4, 6, 8 ¿es?",
    options: [
    "2",
    "48",
    "24",
    "12"
    ],
    correctIndex: 0,
    explanation: "El mínimo común múltiplo (mcm) de 4, 6 y 8 es 24, no 2, ya que 2 es el máximo común divisor (MCD). 12 y 48 son múltiplos comunes, pero no el mínimo; 24 es el menor número divisible exactamente por los tres.",
  },
  {
    id: 1082,
    area: "Matemáticas",
    text: "El máximo común divisor para los números 48, 60, 36 ¿es?",
    options: [
    "24",
    "4",
    "6",
    "12"
    ],
    correctIndex: 3,
    explanation: "El MCD de 48, 60 y 36 es 12 porque es el mayor número que divide exactamente a los tres (48÷12=4, 60÷12=5, 36÷12=3). 6 es un divisor común pero no el máximo, 24 no divide a 36 ni a 60, y 4 es divisor común pero menor que 12.",
  },
  {
    id: 1083,
    area: "Matemáticas",
    text: "Un empleado tiene un salario de $4,500. Si para el siguiente mes recibe un aumento del 8%, ¿Cuál es su nuevo salario?",
    options: [
    "$4,536",
    "$4,860",
    "$4,860",
    "$4,860"
    ],
    correctIndex: 1,
    explanation: "Para calcular el aumento, multiplica $4,500 por 0.08 (que es 8%) para obtener $360, y luego suma al salario original para obtener $4,860. Las opciones como $4,536 son incorrectas porque restan el 8% o usan 0.08 de forma equivocada, mientras que $4,860 es la única correcta.",
  },
  {
    id: 1084,
    area: "Matemáticas",
    text: "Una persona tiene en el banco $36,000 ahorrados, si de ese dinero retira 4/9, ¿Cuánto dinero le queda?",
    options: [
    "$16,000",
    "$20,000",
    "$12,000",
    "$24,000"
    ],
    correctIndex: 0,
    explanation: "Para calcular cuánto queda, primero se resta la fracción retirada del total: 1 - 4/9 = 5/9. Luego se multiplica 36,000 × 5/9 = (36,000/9)×5 = 4,000×5 = 16,000. Las opciones incorrectas surgen de errores comunes: 20,000 al calcular 4/9 de 36,000 (16,000) y restarlo mal; 24,000 al confundir 4/9 con 1/3; y 12,000 al usar 1/3 del total.",
  },
  {
    id: 1085,
    area: "Matemáticas",
    text: "Margarita compró 48 cajas de lápices y pagó $4,032. Con $5,712, ¿Cuántas cajas de lápices podría comprar?",
    options: [
    "64",
    "80",
    "72",
    "68"
    ],
    correctIndex: 3,
    explanation: "Primero se calcula el costo por caja: $4,032 ÷ 48 = $84. Luego, con $5,712 se pueden comprar $5,712 ÷ $84 = 68 cajas. Las opciones incorrectas surgen de errores comunes, como dividir mal (72), usar un costo por caja incorrecto (64) o multiplicar en lugar de dividir (80).",
  },
  {
    id: 1086,
    area: "Matemáticas",
    text: "¿Cuál es la probabilidad que al lanzar un dado salga un tres?",
    options: [
    "1/3",
    "1/2",
    "1/6",
    "1/4"
    ],
    correctIndex: 2,
    explanation: "La probabilidad de un evento se calcula como casos favorables entre casos totales. Para un dado de 6 caras, solo una cara es el tres, por lo que la probabilidad es 1/6. Las otras opciones no corresponden a la relación correcta entre el número de caras favorables y totales.",
  },
  {
    id: 1087,
    area: "Matemáticas",
    text: "Después de lanzar cuatro volados han caído 4 soles, ¿qué probabilidad hay de que salga un sol al lanzar el quinto volado?",
    options: [
    "1/32",
    "1/2",
    "1/5",
    "1/16"
    ],
    correctIndex: 1,
    explanation: "La probabilidad de obtener sol en un volado es siempre 1/2, independientemente de los resultados anteriores, porque cada lanzamiento es un evento independiente. Las opciones 1/16 y 1/32 confunden la probabilidad de una secuencia específica (4 o 5 soles consecutivos) con la probabilidad de un solo evento, y 1/5 aplica incorrectamente una regla de frecuencias.",
  },
  {
    id: 1088,
    area: "Matemáticas",
    text: "Si tengo 4 canicas azules, 5 canicas blancas y 6 canicas negras, ¿cuál es la probabilidad que saque una blanca?",
    options: [
    "5/11",
    "3/5",
    "2/5",
    "1/3"
    ],
    correctIndex: 3,
    explanation: "La probabilidad de sacar una canica blanca es casos favorables (5 blancas) entre casos totales (4+5+6=15), lo que simplifica a 1/3. 2/5 y 3/5 son fracciones incorrectas porque no representan la relación correcta con el total; 5/11 es un error común al olvidar sumar todas las canicas.",
  },
  {
    id: 1089,
    area: "Matemáticas",
    text: "La fotosíntesis es la transformación de energía luminosa a energía:",
    options: [
    "Eléctrica",
    "Eólica",
    "Química",
    "Térmica"
    ],
    correctIndex: 2,
    explanation: "La fotosíntesis convierte la energía lumínica en energía química almacenada en glucosa. Las otras opciones (eólica, térmica, eléctrica) son formas de energía que no se generan directamente en este proceso biológico.",
  },
  {
    id: 1090,
    area: "Biología",
    text: "La unidad estructural de los seres vivos es:",
    options: [
    "El átomo",
    "La célula",
    "El núcleo",
    "El tejido"
    ],
    correctIndex: 1,
    explanation: "La célula es la unidad estructural y funcional de todos los seres vivos, según la teoría celular. El átomo es unidad de la materia, no específica de lo vivo; el tejido está formado por células, no es la unidad básica; y el núcleo es una parte de la célula, no la unidad completa.",
  },
  {
    id: 1091,
    area: "Biología",
    text: "La molécula que contiene la información genética es:",
    options: [
    "Los ribosomas",
    "El ARN",
    "Las proteínas",
    "El ADN"
    ],
    correctIndex: 3,
    explanation: "El ADN (ácido desoxirribonucleico) es la molécula que almacena y transmite la información genética en todos los seres vivos. El ARN participa en la síntesis de proteínas pero no es el depósito principal de la información genética; las proteínas son productos de la expresión génica, no portadores de la información; y los ribosomas son orgánulos que sintetizan proteínas, sin contener información genética.",
  },
  {
    id: 1092,
    area: "Biología",
    text: "Organelo celular que efectúa la respiración celular:",
    options: [
    "Mitocondria",
    "Cloroplasto",
    "Ribosoma",
    "Lisosoma"
    ],
    correctIndex: 0,
    explanation: "La mitocondria es el organelo encargado de la respiración celular, donde se produce ATP mediante la cadena transportadora de electrones. El cloroplasto realiza fotosíntesis, el ribosoma sintetiza proteínas y el lisosoma se encarga de la digestión celular.",
  },
  {
    id: 1093,
    area: "Biología",
    text: "Una de las formas de reproducción celular es la:",
    options: [
    "Meiosis",
    "Mitosis",
    "Fisión binaria",
    "Gemación"
    ],
    correctIndex: 1,
    explanation: "La mitosis es el proceso de división celular que produce dos células hijas genéticamente idénticas, esencial para el crecimiento y reparación. La meiosis genera células sexuales con la mitad de cromosomas, la fisión binaria es típica de procariotas, y la gemación es una forma de reproducción asexual en levaduras, no la división celular estándar en eucariotas.",
  },
  {
    id: 1094,
    area: "Biología",
    text: "Los cambios estructurales y funcionales de los seres vivos a lo largo de millones de años y descendencias hablan de su:",
    options: [
    "Selección natural",
    "Adaptación",
    "Evolución",
    "Mutación"
    ],
    correctIndex: 2,
    explanation: "La evolución es el proceso de cambios estructurales y funcionales a lo largo de millones de años en las especies por descendencia. 'Adaptación' es un mecanismo evolutivo, no el proceso general; 'Selección natural' es un motor de la evolución, no el cambio mismo; 'Mutación' es la fuente de variación genética, no el resultado acumulativo.",
  },
  {
    id: 1095,
    area: "Biología",
    text: "La Teoría de la Selección Natural fue propuesta por:",
    options: [
    "Charles Darwin",
    "Gregor Mendel",
    "Alfred Russel Wallace",
    "Jean-Baptiste Lamarck"
    ],
    correctIndex: 0,
    explanation: "Charles Darwin propuso la Selección Natural como mecanismo evolutivo en 'El origen de las especies'. Lamarck erró al creer en la herencia de caracteres adquiridos; Wallace co-descubrió el proceso pero no lo formalizó; Mendel estudió herencia genética, no evolución por selección.",
  },
  {
    id: 1096,
    area: "Biología",
    text: "Un ejemplo de célula procarionte es:",
    options: [
    "Una neurona",
    "Una amiba",
    "Una bacteria",
    "Una levadura"
    ],
    correctIndex: 2,
    explanation: "Las células procariontes carecen de núcleo definido y orgánulos membranosos; las bacterias son el ejemplo clásico. Las levaduras son hongos eucariontes, las amibas son protozoarios eucariontes y las neuronas son células animales eucariontes, todas con núcleo verdadero.",
  },
  {
    id: 1097,
    area: "Biología",
    text: "Las bacterias se consideran como:",
    options: [
    "Eucariotas",
    "Unicelulares",
    "Procariotas",
    "Autótrofas"
    ],
    correctIndex: 2,
    explanation: "Las bacterias son procariotas porque carecen de núcleo definido y organelos membranosos. 'Eucariotas' es incorrecto porque estas células sí tienen núcleo. 'Autótrofas' describe un tipo de nutrición, no una clasificación celular. 'Unicelulares' es cierto pero no es la respuesta más específica, ya que muchos organismos son unicelulares.",
  },
  {
    id: 1098,
    area: "Biología",
    text: "¿Qué característica biológica le permitiría a una especie responder a los estímulos del medio exterior?",
    options: [
    "Metabolismo",
    "Reproducción",
    "Irritabilidad",
    "Homeostasis"
    ],
    correctIndex: 2,
    explanation: "La irritabilidad es la capacidad de los seres vivos para detectar cambios en el medio externo o interno y reaccionar ante ellos. La homeostasis regula el equilibrio interno, el metabolismo transforma energía y la reproducción genera descendencia, pero ninguna permite responder directamente a estímulos externos.",
  },
  {
    id: 1099,
    area: "Biología",
    text: "¿Cuáles son organismos autótrofos?",
    options: [
    "Las bacterias",
    "Los hongos",
    "Las plantas",
    "Los animales"
    ],
    correctIndex: 2,
    explanation: "Los organismos autótrofos, como las plantas, producen su propio alimento mediante fotosíntesis o quimiosíntesis. Los hongos y animales son heterótrofos, y aunque algunas bacterias son autótrofas, la mayoría son heterótrofas, por lo que no son la respuesta general.",
  },
  {
    id: 1100,
    area: "Biología",
    text: "Organismos como los hongos o el moho, pertenecen al reino:",
    options: [
    "Protista",
    "Monera",
    "Plantae",
    "Fungi"
    ],
    correctIndex: 3,
    explanation: "Los hongos y mohos pertenecen al reino Fungi, caracterizados por ser eucariotas heterótrofos con pared celular de quitina. Protista incluye organismos unicelulares como amebas, Plantae son autótrofos fotosintéticos y Monera agrupa bacterias procariotas, por lo que estas opciones no comparten las características clave de los hongos.",
  },
  {
    id: 1101,
    area: "Biología",
    text: "Los rasgos hereditarios se transmiten de padres a hijos estableciendo un:",
    options: [
    "ADN y ARN",
    "Alelo dominante y recesivo",
    "Genotipo y Fenotipo",
    "Cromosoma y gen"
    ],
    correctIndex: 2,
    explanation: "La respuesta correcta es Genotipo y Fenotipo porque el genotipo es la constitución genética heredada y el fenotipo es su expresión observable. Las otras opciones son incorrectas porque 'Alelo dominante y recesivo' son tipos de alelos, no el establecimiento de la herencia; 'Cromosoma y gen' son estructuras, no el resultado de la transmisión; y 'ADN y ARN' son moléculas involucradas en el proceso, no el patrón hereditario final.",
  },
  {
    id: 1102,
    area: "Biología",
    text: "¿Cómo se llama a la forma de división celular donde intervienen glándulas sexuales?",
    options: [
    "Mitosis",
    "Fisión binaria",
    "Meiosis",
    "Gemación"
    ],
    correctIndex: 2,
    explanation: "La meiosis es la división celular que ocurre en las glándulas sexuales (gónadas) para producir gametos, reduciendo el número de cromosomas a la mitad. La mitosis es división de células somáticas, la gemación es reproducción asexual en levaduras y la fisión binaria es típica en bacterias, por lo que ninguna corresponde a glándulas sexuales.",
  },
  {
    id: 1103,
    area: "Biología",
    text: "Las reacciones químicas que se efectúan en las células de los organismos constituyen:",
    options: [
    "La homeostasis",
    "La fotosíntesis",
    "La mitosis",
    "El metabolismo"
    ],
    correctIndex: 3,
    explanation: "El metabolismo es el conjunto de reacciones químicas que ocurren en las células para mantener la vida, incluyendo anabolismo y catabolismo. La homeostasis regula el equilibrio interno, no las reacciones químicas; la fotosíntesis es un proceso específico de plantas; la mitosis es división celular, no un conjunto de reacciones químicas generales.",
  },
  {
    id: 1104,
    area: "Biología",
    text: "¿Qué moléculas constituyen la primera fuente de energía para los seres vivos?",
    options: [
    "Proteínas (aminoácidos)",
    "Carbohidratos (azúcares)",
    "Ácidos nucleicos (ADN/ARN)",
    "Lípidos (grasas)"
    ],
    correctIndex: 1,
    explanation: "Los carbohidratos, como la glucosa, son la primera fuente de energía porque se metabolizan rápidamente en la respiración celular. Los lípidos y proteínas se usan como reserva o en emergencias, y los ácidos nucleicos almacenan información genética, no energía.",
  },
  {
    id: 1105,
    area: "Biología",
    text: "¿Cuál es la secuencia en las fases de la mitosis?",
    options: [
    "Interfase, profase, metafase, anafase",
    "Profase, metafase, anafase, telofase",
    "Profase, anafase, metafase, telofase",
    "Metafase, profase, telofase, anafase"
    ],
    correctIndex: 1,
    explanation: "La secuencia correcta de la mitosis es profase, metafase, anafase y telofase. Las opciones incorrectas alteran el orden (como intercambiar anafase y metafase), incluyen la interfase (que no es parte de la mitosis) o invierten la secuencia, lo que no corresponde al proceso real de división celular.",
  },
  {
    id: 1106,
    area: "Biología",
    text: "¿Cuál es el organelo celular que interviene en la actividad fotosintética?",
    options: [
    "Ribosoma",
    "Cloroplasto",
    "Vacuola",
    "Mitocondria"
    ],
    correctIndex: 1,
    explanation: "El cloroplasto es el organelo donde ocurre la fotosíntesis, gracias a su clorofila que capta luz solar. La mitocondria realiza respiración celular, no fotosíntesis; los ribosomas sintetizan proteínas, y las vacuolas almacenan sustancias, sin participar en la fotosíntesis.",
  },
  {
    id: 1107,
    area: "Biología",
    text: "¿Qué orgánulo celular interviene en la síntesis de proteínas?",
    options: [
    "Aparato de Golgi",
    "Retículo endoplasmático rugoso",
    "Lisosoma",
    "Ribosoma"
    ],
    correctIndex: 3,
    explanation: "Los ribosomas son los orgánulos encargados de la síntesis de proteínas al traducir el ARN mensajero. El retículo endoplasmático rugoso tiene ribosomas adheridos, pero no sintetiza directamente; el aparato de Golgi modifica y empaqueta proteínas, y los lisosomas digieren materiales.",
  },
  {
    id: 1108,
    area: "Biología",
    text: "La _____ se realiza sin la intervención de gametos, los descendientes tienen la misma información genética.",
    options: [
    "Reproducción por esporas",
    "Reproducción asexual",
    "Reproducción por fragmentación",
    "Reproducción por gemación"
    ],
    correctIndex: 1,
    explanation: "La reproducción asexual no requiere gametos ni fecundación, y genera descendientes genéticamente idénticos al progenitor. Las otras opciones son tipos específicos de reproducción asexual, pero la pregunta pide el término general que abarca todas ellas, no un caso particular.",
  },
  {
    id: 1109,
    area: "Biología",
    text: "¿Cuál es el tipo de reproducción donde se requiere de la participación de dos individuos con gametos distintos?",
    options: [
    "Gemación",
    "Asexual",
    "Sexual",
    "Fisión binaria"
    ],
    correctIndex: 2,
    explanation: "La reproducción sexual implica la fusión de gametos (células sexuales) de dos progenitores diferentes, generando descendencia genéticamente única. Las opciones incorrectas (asexual, fisión binaria y gemación) son formas de reproducción que solo requieren un individuo, sin intercambio de gametos, por lo que no cumplen con la condición de participación de dos individuos con gametos distintos.",
  },
  {
    id: 1110,
    area: "Biología",
    text: "Proceso mediante el cual algunos organismos aprovechan el CO₂ y el H₂O para sintetizar carbohidratos y liberar oxígeno:",
    options: [
    "Respiración celular",
    "Quimiosíntesis",
    "Fotosíntesis",
    "Fermentación láctica"
    ],
    correctIndex: 2,
    explanation: "La fotosíntesis es el proceso en que las plantas y algas convierten CO₂ y H₂O en carbohidratos y oxígeno usando luz. La quimiosíntesis usa compuestos inorgánicos, no luz; la respiración celular y la fermentación consumen oxígeno o producen energía sin liberarlo.",
  },
  {
    id: 1111,
    area: "Biología",
    text: "La digestión celular es realizada por los:",
    options: [
    "Lisosomas",
    "Aparato de Golgi",
    "Ribosomas",
    "Mitocondrias"
    ],
    correctIndex: 0,
    explanation: "Los lisosomas contienen enzimas hidrolíticas que digieren materiales celulares y desechos. Los ribosomas sintetizan proteínas, las mitocondrias producen energía y el aparato de Golgi modifica y empaqueta sustancias, pero ninguno realiza la digestión celular.",
  },
  {
    id: 1112,
    area: "Biología",
    text: "El pigmento que capta la energía luminosa para el trabajo fotosintético de los cloroplastos es la:",
    options: [
    "Ficocianina",
    "Clorofila",
    "Xantofila",
    "Caroteno"
    ],
    correctIndex: 1,
    explanation: "La clorofila es el pigmento principal en los cloroplastos que absorbe luz roja y azul para la fotosíntesis. Los carotenos y xantofilas son pigmentos accesorios que captan luz de otras longitudes de onda y protegen, pero no realizan la fotosíntesis directamente; la ficocianina es un pigmento de algas, no de cloroplastos de plantas terrestres.",
  },
  {
    id: 1113,
    area: "Biología",
    text: "La reproducción celular que da origen a dos células hijas genéticamente idénticas, se conoce como:",
    options: [
    "Fisión binaria",
    "Gemación",
    "Mitosis",
    "Meiosis"
    ],
    correctIndex: 2,
    explanation: "La mitosis es el proceso de división celular que produce dos células hijas genéticamente idénticas a la célula madre, esencial para el crecimiento y reparación. La meiosis genera células sexuales con la mitad de carga genética, la fisión binaria es propia de procariotas (bacterias) y la gemación produce una yema que se separa, típica en levaduras, no en células eucariotas somáticas.",
  },
  {
    id: 1114,
    area: "Biología",
    text: "Son compuestos que funcionan como anticuerpos y enzimas, se forman a partir de aminoácidos, forman músculo, cabello:",
    options: [
    "Ácidos nucleicos",
    "Lípidos",
    "Proteínas",
    "Carbohidratos"
    ],
    correctIndex: 2,
    explanation: "Las proteínas son compuestos formados por aminoácidos que actúan como anticuerpos y enzimas, además de formar estructuras como músculo y cabello. Los carbohidratos dan energía, los lípidos almacenan energía y forman membranas, y los ácidos nucleicos almacenan información genética, por lo que no cumplen todas esas funciones.",
  },
  {
    id: 1115,
    area: "Biología",
    text: "A las unidades básicas que conforman las proteínas se les llama:",
    options: [
    "Nucleótidos",
    "Aminoácidos",
    "Ácidos grasos",
    "Monosacáridos"
    ],
    correctIndex: 1,
    explanation: "Los aminoácidos son las unidades básicas (monómeros) que forman las proteínas mediante enlaces peptídicos. Los nucleótidos forman ácidos nucleicos, los ácidos grasos son componentes de lípidos y los monosacáridos son la base de los carbohidratos, por lo que ninguna de esas opciones corresponde a las proteínas.",
  },
  {
    id: 1116,
    area: "Biología",
    text: "La teoría de Lamarck:",
    options: [
    "La evolución se debía a mutaciones aleatorias que ocurrían en el ADN y que se heredaban, permitiendo la adaptación gradual de las especies",
    "La evolución se debía a la selección natural de los individuos mejor adaptados al ambiente, transmitiendo sus genes a la siguiente generación",
    "La evolución se debía a la influencia directa del ambiente sobre los organismos, provocando cambios genéticos espontáneos que se fijaban en la población",
    "La evolución se debía a cambios adquiridos, como resultado del uso y desuso de los órganos y que estos caracteres adquiridos se podían heredar de generación en generación"
    ],
    correctIndex: 3,
    explanation: "La respuesta correcta describe la teoría de Lamarck, que postula la herencia de caracteres adquiridos por uso y desuso. Las opciones incorrectas corresponden a la selección natural de Darwin, la teoría sintética de la evolución (mutaciones) y una idea confusa de influencia ambiental directa en el genoma, respectivamente.",
  },
  {
    id: 1117,
    area: "Biología",
    text: "Los rasgos hereditarios se transmiten de padres a hijos de acuerdo con:",
    options: [
    "Las leyes de Mendel",
    "El principio de Hardy-Weinberg",
    "La teoría de la evolución de Darwin",
    "La herencia de caracteres adquiridos de Lamarck"
    ],
    correctIndex: 0,
    explanation: "La respuesta correcta son las leyes de Mendel, ya que describen cómo se transmiten los rasgos hereditarios mediante genes. Darwin explica la evolución por selección natural, no la herencia; Hardy-Weinberg describe frecuencias alélicas en poblaciones; y Lamarck propuso erróneamente la herencia de caracteres adquiridos.",
  },
  {
    id: 1118,
    area: "Biología",
    text: "Las células que tienen el material genético en un núcleo son un ejemplo de células:",
    options: [
    "Eucariontes",
    "Autótrofas",
    "Somáticas",
    "Procariontes"
    ],
    correctIndex: 0,
    explanation: "Las células eucariontes se caracterizan por poseer un núcleo definido que contiene el material genético. Las procariontes carecen de núcleo, las autótrofas se refieren a su nutrición y las somáticas son un tipo de célula corporal, no una clasificación por presencia de núcleo.",
  },
  {
    id: 1119,
    area: "Biología",
    text: "¿Cuáles son organismos unicelulares?",
    options: [
    "Protozoarios",
    "Bacterias",
    "Virus",
    "Hongos"
    ],
    correctIndex: 1,
    explanation: "Las bacterias son organismos unicelulares procariotas. Los hongos suelen ser pluricelulares (excepto levaduras), los protozoarios son unicelulares pero eucariotas (no procariotas como las bacterias), y los virus no se consideran organismos vivos completos, ya que necesitan una célula huésped para replicarse.",
  },
  {
    id: 1120,
    area: "Biología",
    text: "El Sistema Digestivo está conformado por:",
    options: [
    "Faringe, estómago, hígado, vesícula, páncreas",
    "Boca, faringe, esófago, estómago, intestinos",
    "Boca, faringe, laringe, estómago, intestino grueso",
    "Boca, esófago, hígado, páncreas, intestinos"
    ],
    correctIndex: 1,
    explanation: "La respuesta correcta incluye los órganos que forman el tubo digestivo principal (boca, faringe, esófago, estómago, intestinos). Las opciones incorrectas añaden órganos accesorios como hígado, páncreas o vesícula, que no son parte del conducto, o incluyen la laringe, que pertenece al sistema respiratorio.",
  },
  {
    id: 1121,
    area: "Biología",
    text: "El orden correcto de los pasos del método científico es:",
    options: [
    "Observación, experimento, hipótesis y conclusión",
    "Observación, hipótesis, conclusión y experimento",
    "Observación, hipótesis, experimento y conclusión",
    "Hipótesis, observación, experimento y conclusión"
    ],
    correctIndex: 2,
    explanation: "La respuesta correcta es Observación, hipótesis, experimento y conclusión porque el método científico sigue una secuencia lógica: primero se observa un fenómeno, luego se formula una hipótesis, después se experimenta para probarla y finalmente se obtiene una conclusión. Las opciones incorrectas alteran este orden, como poner el experimento antes de la hipótesis o la conclusión antes del experimento, lo que no tiene sentido metodológico.",
  },
  {
    id: 1122,
    area: "Biología",
    text: "Los hidrocarburos están formados por _____ y carbono:",
    options: [
    "Oxígeno",
    "Azufre",
    "Hidrógeno",
    "Nitrógeno"
    ],
    correctIndex: 2,
    explanation: "Los hidrocarburos son compuestos orgánicos formados exclusivamente por carbono e hidrógeno. El oxígeno, nitrógeno y azufre son elementos que pueden aparecer en otros compuestos orgánicos como alcoholes, aminas o tioles, pero no en los hidrocarburos básicos.",
  },
  {
    id: 1123,
    area: "Biología",
    text: "El conocimiento que permite a los niños diferenciar entre frío y caliente es:",
    options: [
    "Hereditario",
    "Innato",
    "Empírico",
    "Científico"
    ],
    correctIndex: 2,
    explanation: "La respuesta correcta es 'Empírico' porque el conocimiento sobre frío y caliente se adquiere a través de la experiencia sensorial directa, no mediante el método científico, ni es innato o hereditario, ya que requiere interacción con el ambiente para desarrollarse.",
  },
  {
    id: 1124,
    area: "Biología",
    text: "¿Cuáles son las variables que intervienen en el fenómeno del calentamiento global?",
    options: [
    "Emisión de gases y captación de radiación",
    "Aumento de la población y consumo de agua",
    "Destrucción de la capa de ozono y lluvia ácida",
    "Reforestación y uso de energías limpias"
    ],
    correctIndex: 0,
    explanation: "La respuesta correcta es 'Emisión de gases y captación de radiación' porque el calentamiento global se debe al incremento de gases de efecto invernadero (como CO2) que atrapan la radiación infrarroja. Las opciones incorrectas confunden el fenómeno con sus causas secundarias o soluciones (reforestación), con otros problemas ambientales (capa de ozono, lluvia ácida), o con factores indirectos no directamente físicos (población, agua).",
  },
  {
    id: 1125,
    area: "Biología",
    text: "Disciplina biológica que se encarga de clasificar a los seres vivos y de darles un nombre científico:",
    options: [
    "Taxonomía",
    "Sistemática",
    "Filogenia",
    "Taxonomía numérica"
    ],
    correctIndex: 0,
    explanation: "La Taxonomía es la disciplina que clasifica y nombra a los seres vivos siguiendo reglas internacionales. La Sistemática estudia las relaciones evolutivas entre organismos, la Filogenia se enfoca en su historia evolutiva, y la Taxonomía numérica usa métodos matemáticos para clasificar, pero no es la encargada principal de asignar nombres científicos.",
  },
  {
    id: 1126,
    area: "Biología",
    text: "¿Qué son los cromosomas?",
    options: [
    "Conjunto de material genético condensado. Formado por genes",
    "Estructuras que almacenan energía en forma de ATP",
    "Orgánulos celulares encargados de la síntesis de proteínas",
    "Filamentos de actina que forman el citoesqueleto"
    ],
    correctIndex: 0,
    explanation: "Los cromosomas son estructuras que contienen ADN condensado y genes, no sintetizan proteínas (función de los ribosomas), no almacenan ATP (función de las mitocondrias) ni forman el citoesqueleto (función de los microfilamentos).",
  },
  {
    id: 1127,
    area: "Biología",
    text: "La manifestación externa de los rasgos hereditarios se conoce como:",
    options: [
    "Genotipo",
    "Fenotipo",
    "Alelo",
    "Cariotipo"
    ],
    correctIndex: 1,
    explanation: "El fenotipo es la manifestación observable de un rasgo hereditario, resultado de la interacción entre el genotipo y el ambiente. Genotipo se refiere a la composición genética, alelo a las variantes de un gen, y cariotipo al conjunto de cromosomas de una célula.",
  },
  {
    id: 1128,
    area: "Biología",
    text: "A las unidades de la herencia biológica se les conoce como:",
    options: [
    "Nucleótidos",
    "Alelos",
    "Cromosomas",
    "Genes"
    ],
    correctIndex: 3,
    explanation: "La respuesta correcta es 'Genes', porque son las unidades funcionales de la herencia que contienen la información genética. 'Cromosomas' son estructuras que contienen muchos genes, 'Alelos' son variantes de un gen específico, y 'Nucleótidos' son las subunidades que forman el ADN, no las unidades hereditarias en sí.",
  },
  {
    id: 1129,
    area: "Biología",
    text: "¿Cuál de las siguientes bases nitrogenadas es exclusiva del ADN?",
    options: [
    "Guanina",
    "Citosina",
    "Uracilo",
    "Timina"
    ],
    correctIndex: 3,
    explanation: "La timina es exclusiva del ADN, mientras que el uracilo reemplaza a la timina en el ARN. Guanina y citosina están presentes tanto en ADN como en ARN, por lo que no son exclusivas del ADN.",
  },
  {
    id: 1130,
    area: "Biología",
    text: "¿Cuál de las siguientes bases nitrogenadas es exclusiva del ARN?",
    options: [
    "Uracilo",
    "Guanina",
    "Timina",
    "Adenina"
    ],
    correctIndex: 0,
    explanation: "El uracilo es exclusivo del ARN, reemplazando a la timina del ADN. La adenina y guanina son bases púricas presentes tanto en ADN como en ARN, por lo que no son exclusivas.",
  },
  {
    id: 1131,
    area: "Biología",
    text: "¿Qué significa Biología?",
    options: [
    "Ciencia que estudia el comportamiento de las especies animales",
    "Ciencia que estudia la evolución de las teorías científicas",
    "Ciencia que estudia la composición química de los organismos",
    "Ciencia que estudia a los seres vivos"
    ],
    correctIndex: 3,
    explanation: "Biología proviene del griego 'bios' (vida) y 'logos' (estudio), por lo que es la ciencia que estudia a los seres vivos. Las opciones incorrectas se refieren a la química (bioquímica), la etología (comportamiento animal) o la filosofía de la ciencia, no al objeto de estudio central de la biología.",
  },
  {
    id: 1132,
    area: "Biología",
    text: "¿Qué es la citología?",
    options: [
    "Rama de la Biología que estudia los tejidos",
    "Rama de la Biología que estudia a las células",
    "Rama de la Biología que estudia los genes",
    "Rama de la Biología que estudia las enfermedades"
    ],
    correctIndex: 1,
    explanation: "La citología se enfoca en el estudio de las células, sus estructuras y funciones. Las opciones incorrectas corresponden a otras ramas: la patología estudia enfermedades, la histología estudia tejidos, y la genética estudia los genes.",
  },
  {
    id: 1133,
    area: "Biología",
    text: "¿Cuáles son los dos ácidos nucleídos?",
    options: [
    "ARN y ATP",
    "ADN y ARN",
    "ARN y proteínas",
    "ADN y ARNm"
    ],
    correctIndex: 1,
    explanation: "Los ácidos nucleicos son el ADN y el ARN, que almacenan y transmiten información genética. El ATP es un nucleótido, no un ácido nucleico; el ARNm es un tipo de ARN, no un ácido nucleico independiente; y las proteínas son polímeros de aminoácidos, no ácidos nucleicos.",
  },
  {
    id: 1134,
    area: "Biología",
    text: "¿Qué es la taxonomía?",
    options: [
    "Rama de la Biología que analiza la distribución geográfica de los organismos",
    "Rama de la Biología que estudia los ecosistemas y sus interacciones",
    "Rama de la Biología que investiga la evolución de las especies a través del tiempo",
    "Rama de la Biología que clasifica a los seres vivos"
    ],
    correctIndex: 3,
    explanation: "La taxonomía se enfoca en nombrar, describir y clasificar a los seres vivos en categorías jerárquicas (como reino, filo, clase), diferenciándose de la ecología, biogeografía o evolución que estudian otros aspectos de la vida.",
  },
  {
    id: 1135,
    area: "Biología",
    text: "Menciona los cinco reinos.",
    options: [
    "Animalia, plantae, fungi, protista, archaea",
    "Monera, protista, fungi, plantae, animalia",
    "Monera, protista, fungi, animalia, chordata",
    "Plantae, animalia, fungi, monera, eubacteria"
    ],
    correctIndex: 1,
    explanation: "Los cinco reinos clásicos son Monera (bacterias), Protista (protozoarios y algas simples), Fungi (hongos), Plantae (plantas) y Animalia (animales). Las opciones incorrectas incluyen grupos como Archaea (antes parte de Monera), Chordata (un filo dentro de Animalia) o Eubacteria (sinónimo de Monera), que no corresponden a la clasificación tradicional de cinco reinos.",
  },
  {
    id: 1136,
    area: "Biología",
    text: "¿Qué es un organismo autótrofo?",
    options: [
    "El que respira oxígeno y libera dióxido de carbono",
    "El que se alimenta de otros organismos vivos",
    "El que produce su propio alimento 'las plantas'",
    "El que descompone materia orgánica muerta"
    ],
    correctIndex: 2,
    explanation: "Los organismos autótrofos (como las plantas) producen su propio alimento mediante fotosíntesis o quimiosíntesis. Los distractores describen a heterótrofos (primer opción), descomponedores (segunda) y un proceso de respiración común a muchos seres vivos, no exclusivo de autótrofos.",
  },
  {
    id: 1137,
    area: "Biología",
    text: "¿Qué es un organismo heterótrofo?",
    options: [
    "El que se alimenta exclusivamente de materia orgánica muerta",
    "El que depende de otros organismos para obtener su alimento",
    "El que produce su propio alimento a partir de sustancias inorgánicas",
    "El que transforma la energía luminosa en energía química"
    ],
    correctIndex: 1,
    explanation: "Los organismos heterótrofos no pueden sintetizar su propio alimento y dependen de otros seres vivos para obtener nutrientes. Las opciones incorrectas describen a los autótrofos (fotosintéticos) o a descomponedores específicos, pero no abarcan la definición general de heterótrofo.",
  },
  {
    id: 1138,
    area: "Biología",
    text: "Explica la teoría del fijismo.",
    options: [
    "Las especies cambian gradualmente por selección natural de los más adaptados",
    "Los seres vivos se transforman a lo largo del tiempo por mutaciones aleatorias",
    "Los organismos permanecían estáticos desde su creación, sin posibilidad de cambios",
    "Los organismos evolucionan por la herencia de caracteres adquiridos durante su vida"
    ],
    correctIndex: 2,
    explanation: "El fijismo sostiene que las especies son inmutables desde su origen, sin evolución. Las opciones incorrectas describen teorías evolutivas (lamarckismo, darwinismo y mutacionismo), que son opuestas al fijismo.",
  },
  {
    id: 1139,
    area: "Biología",
    text: "Explica la teoría del catastrofismo.",
    options: [
    "El catastrofismo propone que la evolución de las especies ocurre por cambios graduales y continuos a lo largo de millones de años.",
    "Los fósiles se forman únicamente cuando un organismo muere en un evento catastrófico repentino como un terremoto o inundación.",
    "Las especies actuales son el resultado de una serie de creaciones divinas sucesivas, cada una precedida por una catástrofe que eliminó a las anteriores.",
    "Al morir un organismo por alguna catástrofe, sus restos le dan origen a otro organismo con características similares"
    ],
    correctIndex: 3,
    explanation: "La teoría del catastrofismo, propuesta por Cuvier, sostiene que los fósiles representan organismos que murieron en catástrofes y fueron reemplazados por nuevas creaciones. La respuesta correcta refleja esa idea de transformación directa de restos en nuevos organismos. Las opciones incorrectas confunden el catastrofismo con creacionismo, fosilización selectiva o gradualismo.",
  },
  {
    id: 1140,
    area: "Biología",
    text: "Explica la teoría del transformismo.",
    options: [
    "Todos los seres vivos vamos evolucionando en base al uso y desuso de estructuras de nuestro cuerpo y estas modificaciones se las heredamos a nuestros descendientes",
    "Los organismos cambian por mutaciones aleatorias que son seleccionadas por el ambiente a lo largo de generaciones",
    "Las especies se transforman por la influencia directa del clima y la geografía en su desarrollo embrionario",
    "Los seres vivos adquieren nuevas características por la mezcla de genes entre especies diferentes"
    ],
    correctIndex: 0,
    explanation: "La respuesta correcta describe la teoría del transformismo de Lamarck, que sostiene que el uso y desuso de órganos causa cambios heredables. Las alternativas incorrectas confunden esta idea con la selección natural darwiniana (opción 1), el lamarckismo malinterpretado (opción 2) o la hibridación (opción 3), que no forman parte del transformismo original.",
  },
  {
    id: 1141,
    area: "Biología",
    text: "¿Qué es selección natural y quien la postuló?",
    options: [
    "Es el proceso por el cual, el medio ambiente selecciona a los organismos mejor adaptados, los cuales sobreviven a las condiciones del ambiente y la postuló Charles Darwin",
    "Es un mecanismo donde las especies eligen conscientemente los rasgos más ventajosos para heredar, postulado por Gregor Mendel",
    "Es el proceso por el cual los organismos más fuertes eliminan a los débiles para mejorar la especie, postulado por Jean-Baptiste Lamarck",
    "Es la capacidad de los organismos de adaptarse voluntariamente a su entorno para sobrevivir, propuesta por Alfred Russel Wallace"
    ],
    correctIndex: 0,
    explanation: "La selección natural es un proceso no dirigido donde el ambiente favorece a los organismos con características que les permiten sobrevivir y reproducirse mejor, postulado por Charles Darwin. Las opciones incorrectas confunden el mecanismo con la ley del más fuerte (Lamarck), la adaptación voluntaria (Wallace solo co-desarrolló la idea) o la herencia de rasgos elegidos (Mendel estudió genética, no selección natural).",
  },
  {
    id: 1142,
    area: "Biología",
    text: "¿Qué es adaptación?",
    options: [
    "Es la capacidad de un organismo para cambiar su apariencia física según el entorno en que se encuentre",
    "Es el mecanismo por el que las especies migran a otros hábitats cuando las condiciones del original se vuelven adversas",
    "Es el proceso por el que una especie se condiciona lenta o rápidamente para lograr sobrevivir",
    "Es el proceso mediante el cual un individuo adquiere nuevas características durante su vida para enfrentar un peligro inmediato"
    ],
    correctIndex: 2,
    explanation: "La adaptación es un proceso evolutivo que ocurre a nivel de población a lo largo de generaciones, no un cambio individual o instantáneo. Las opciones incorrectas confunden adaptación con camuflaje, aclimatación o migración, que son respuestas diferentes y no implican necesariamente un cambio hereditario en la especie.",
  },
  {
    id: 1143,
    area: "Biología",
    text: "Menciona los tres tipos de adaptaciones al medio.",
    options: [
    "Estructurales, funcionales y de comportamiento",
    "Morfológicas, fisiológicas y conductuales",
    "Genéticas, ambientales y reproductivas",
    "Orgánicas, metabólicas y psicológicas"
    ],
    correctIndex: 1,
    explanation: "Las adaptaciones se clasifican en tres tipos: morfológicas (estructura corporal, como el pelaje grueso), fisiológicas (funciones internas, como la hibernación) y conductuales (comportamientos, como la migración). Las opciones incorrectas mezclan términos de otras áreas (como 'psicológicas' o 'genéticas') o no corresponden a la clasificación clásica.",
  },
  {
    id: 1144,
    area: "Biología",
    text: "¿Por qué México es considerado un país megadiverso?",
    options: [
    "Gran extensión territorial y baja densidad de población",
    "Clima tropical uniforme y alta tasa de migración de especies",
    "Alta industrialización y desarrollo urbano sostenible",
    "Ubicación geográfica, orografía y especies endémicas"
    ],
    correctIndex: 3,
    explanation: "México es megadiverso por su ubicación entre dos regiones biogeográficas, su relieve variado y la alta cantidad de especies endémicas. Las opciones incorrectas mencionan factores como extensión territorial, clima uniforme o industrialización, que no son las causas principales de la megadiversidad.",
  },
  {
    id: 1145,
    area: "Biología",
    text: "¿Qué es ecología?",
    options: [
    "Rama de la Biología que estudia la estructura y función de los ecosistemas acuáticos",
    "Rama de la Biología que estudia la herencia genética y la variación de las especies",
    "Rama de la Biología que estudia la interacción de los seres vivos entre sí y con el medio ambiente",
    "Rama de la Biología que estudia la clasificación y nomenclatura de los organismos vivos"
    ],
    correctIndex: 2,
    explanation: "La ecología se enfoca en las interacciones entre organismos y su ambiente, no en la clasificación (taxonomía), solo ecosistemas acuáticos (limnología) o la herencia (genética).",
  },
  {
    id: 1146,
    area: "Biología",
    text: "¿Cuáles son los seres bióticos y los abióticos?",
    options: [
    "Bióticos son los 5 reinos, Abióticos es la parte inerte 'sin vida' del ecosistema",
    "Bióticos son los organismos con células, Abióticos son los factores climáticos como temperatura y humedad",
    "Bióticos son los que se reproducen, Abióticos son los componentes químicos del suelo",
    "Bióticos son los seres del reino animal y vegetal, Abióticos son los minerales y el agua"
    ],
    correctIndex: 0,
    explanation: "La respuesta correcta abarca correctamente a todos los seres vivos (los 5 reinos) como bióticos y a todo lo inerte sin vida como abióticos. Las opciones incorrectas son parciales o confusas: la primera mezcla conceptos (factores climáticos son abióticos, pero no son los únicos); la segunda excluye reinos como hongos o bacterias; la tercera es demasiado restrictiva al basarse solo en la reproducción y en componentes químicos.",
  },
  {
    id: 1147,
    area: "Biología",
    text: "¿Qué es biosfera?",
    options: [
    "Conjunto de todos los ecosistemas del planeta, incluyendo sus interacciones y la materia orgánica que los compone.",
    "Capa externa del planeta formada por la corteza terrestre y los océanos, donde habitan todos los seres vivos conocidos.",
    "Zona de la Tierra donde se concentra la mayor diversidad de especies, limitada a los océanos y bosques tropicales.",
    "Capa del planeta donde se puede desarrollar la vida. La integran la litosfera, hidrósfera y la troposfera"
    ],
    correctIndex: 3,
    explanation: "La biosfera es la capa del planeta donde es posible la vida, integrada por la litosfera (suelo), hidrósfera (agua) y troposfera (atmósfera baja). Las opciones incorrectas son plausibles pero limitan el concepto: la primera confunde biosfera con el término ecosistema global; la segunda la reduce a zonas de alta biodiversidad; la tercera omite la atmósfera como componente esencial.",
  },
  {
    id: 1148,
    area: "Biología",
    text: "¿Qué es mutualismo?",
    options: [
    "Interacción entre dos especies diferentes donde ambas se benefician mutuamente",
    "Interacción entre dos especies donde una se alimenta de la otra sin matarla inmediatamente",
    "Relación entre dos organismos donde uno se beneficia y el otro no resulta afectado",
    "Asociación entre dos organismos de la misma especie que cooperan para obtener alimento"
    ],
    correctIndex: 0,
    explanation: "El mutualismo es una relación simbiótica donde ambas especies obtienen un beneficio, como en los líquenes (alga y hongo). La primera opción describe comensalismo, la segunda parasitismo y la tercera cooperación intraespecífica, no mutualismo.",
  },
  {
    id: 1149,
    area: "Biología",
    text: "¿Qué es comensalismo?",
    options: [
    "Interacción entre dos especies diferentes donde una se beneficia y la otra le es indiferente, es decir, no se beneficia ni se perjudica",
    "Interacción entre dos especies diferentes donde una se beneficia y la otra resulta perjudicada",
    "Interacción entre dos especies diferentes donde una se beneficia y la otra también se beneficia de forma indirecta",
    "Interacción entre dos especies diferentes donde ambas se benefician mutuamente"
    ],
    correctIndex: 0,
    explanation: "El comensalismo es una relación ecológica en la que una especie obtiene un beneficio (como alimento o refugio) sin afectar positiva ni negativamente a la otra. Las opciones incorrectas describen otras relaciones: la primera es parasitismo, la segunda es mutualismo y la tercera también es mutualismo, por lo que no encajan en la definición de comensalismo.",
  },
  {
    id: 1150,
    area: "Biología",
    text: "¿Qué es parasitismo?",
    options: [
    "Relación entre dos especies donde ambas se benefician mutuamente",
    "Interacción entre un organismo y su ambiente físico donde se adapta para sobrevivir",
    "Interacción entre dos especies diferentes donde una se beneficia y la otra se perjudica",
    "Interacción entre dos organismos donde ambos compiten por los mismos recursos"
    ],
    correctIndex: 2,
    explanation: "El parasitismo es una relación interespecífica en la que el parásito obtiene beneficio (nutrientes, refugio) a costa del huésped, que resulta perjudicado. Las otras opciones describen competencia, mutualismo y adaptación al medio, respectivamente, que son conceptos distintos en ecología.",
  },
  {
    id: 1151,
    area: "Biología",
    text: "¿Qué es el calentamiento global?",
    options: [
    "Es el aumento en la emisión de CO₂ y gases contaminantes que suben a la atmósfera y dificultan la salida de los rayos solares que entran al planeta, provocando que la temperatura aumente",
    "Es el incremento de la temperatura en la Tierra debido a la rotación del planeta y la inclinación de su eje, que altera la distribución de la luz solar en las estaciones",
    "Es el aumento de la radiación ultravioleta que llega a la superficie terrestre debido al agujero en la capa de ozono, lo que eleva la temperatura global",
    "Es el proceso natural por el cual la atmósfera retiene parte del calor del Sol, permitiendo que la vida en la Tierra sea posible y manteniendo una temperatura estable"
    ],
    correctIndex: 0,
    explanation: "La respuesta correcta describe el calentamiento global como el aumento de temperatura por la acumulación de CO₂ y gases que atrapan el calor (efecto invernadero intensificado). Las opciones incorrectas confunden el fenómeno con cambios orbitales (rotación e inclinación), con el efecto invernadero natural (que es beneficioso), o con el agotamiento del ozono (que afecta la radiación UV, no la temperatura global de forma directa).",
  },
  {
    id: 1152,
    area: "Biología",
    text: "Fases del ciclo del agua.",
    options: [
    "Infiltración, evaporación y condensación",
    "Ebullición, sublimación y filtración",
    "Evaporación, condensación y precipitación",
    "Transpiración, escorrentía y sedimentación"
    ],
    correctIndex: 2,
    explanation: "La respuesta correcta es Evaporación, condensación y precipitación porque son las tres fases principales que describen el movimiento del agua en la atmósfera y su regreso a la superficie. Las opciones incorrectas incluyen procesos como ebullición (cambio de estado líquido a gas por calentamiento, no necesariamente en el ciclo natural), filtración (separación de sólidos de un líquido), escorrentía (flujo superficial, no fase del ciclo) o sedimentación (depósito de partículas), que no corresponden a las fases atmosféricas del ciclo hidrológico.",
  },
  {
    id: 1153,
    area: "Biología",
    text: "¿Qué es desarrollo sustentable?",
    options: [
    "Es el conjunto de estrategias para maximizar la explotación de los recursos naturales sin detener el crecimiento industrial",
    "Consiste en la conservación absoluta de los ecosistemas, prohibiendo cualquier actividad humana que los modifique",
    "Se refiere al uso de tecnologías avanzadas para eliminar por completo los contaminantes del aire y del agua",
    "Son todas las acciones que se deben llevar a cabo para contribuir a mejorar el medio ambiente y así, elevar nuestra calidad de vida y el de las generaciones futuras"
    ],
    correctIndex: 3,
    explanation: "La respuesta correcta integra el equilibrio entre desarrollo y cuidado ambiental para las generaciones futuras. Las opciones incorrectas se centran en explotación sin límites, conservación extrema sin desarrollo humano, o solo en tecnología, ignorando la sostenibilidad social y económica.",
  },
  {
    id: 1154,
    area: "Biología",
    text: "Menciona las dos fases en que se divide la fotosíntesis.",
    options: [
    "Dependiente e independiente",
    "Luminosa y oscura",
    "Activa y pasiva",
    "Clara y sombra"
    ],
    correctIndex: 1,
    explanation: "La fotosíntesis se divide en fase luminosa (dependiente de la luz) y fase oscura (fijación del CO₂). 'Dependiente e independiente' es una nomenclatura alternativa, pero la pregunta pide las dos fases clásicas; 'clara y sombra' y 'activa y pasiva' son términos confusos no estándar en este contexto.",
  },
  {
    id: 1155,
    area: "Biología",
    text: "Menciona las partes de una planta.",
    options: [
    "Raíz, tallo, hojas y flores",
    "Raíz, tallo, hojas y frutos",
    "Raíz, tallo, hojas y semillas",
    "Raíz, tallo, hojas y pétalos"
    ],
    correctIndex: 0,
    explanation: "La respuesta correcta es raíz, tallo, hojas y flores, ya que estas son las partes fundamentales de una planta vascular. Las opciones incorrectas mencionan frutos, semillas o pétalos, que son estructuras derivadas de las flores o de procesos reproductivos, no partes básicas y constantes en todas las plantas con flor.",
  },
  {
    id: 1156,
    area: "Biología",
    text: "¿Qué es la respiración aerobia?",
    options: [
    "Tipo de respiración que ocurre sin oxígeno, produciendo solo 2 ATP, como en algunas bacterias y levaduras",
    "Proceso en el que las células vegetales utilizan dióxido de carbono para liberar energía, generando 36 ATP",
    "Tipo de respiración que se lleva a cabo con la presencia de oxígeno, produciendo 38 ATP, los animales y el ser humano respiran por este medio",
    "Mecanismo de intercambio gaseoso en los pulmones donde el oxígeno se combina con la hemoglobina para formar oxihemoglobina"
    ],
    correctIndex: 2,
    explanation: "La respiración aerobia requiere oxígeno y produce hasta 38 ATP, siendo el proceso más eficiente para obtener energía en animales y humanos. Las opciones incorrectas describen respiración anaerobia (sin oxígeno y baja producción de ATP), un proceso confundido con la fotosíntesis (uso de CO₂) o el transporte de oxígeno en la sangre, que no es respiración celular.",
  },
  {
    id: 1157,
    area: "Biología",
    text: "¿Qué es la respiración anaerobia?",
    options: [
    "Proceso de obtención de energía a partir de la glucosa en presencia de oxígeno, produciendo alcohol y CO2, realizado por levaduras",
    "Tipo de respiración que se realiza sin oxígeno, pero produce 36-38 ATP, común en animales superiores",
    "Tipo de respiración que utiliza oxígeno para producir energía, generando 36-38 ATP, como en las células humanas",
    "Tipo de respiración que se realiza SIN la presencia de oxígeno, produciendo 2 ATP, las bacterias respiran por este medio"
    ],
    correctIndex: 3,
    explanation: "La respiración anaerobia ocurre sin oxígeno y solo produce 2 ATP, a diferencia de la aerobia que usa oxígeno y genera 36-38 ATP. Las opciones incorrectas confunden la presencia de oxígeno, la cantidad de ATP o el producto final (alcohol es de fermentación, no respiración anaerobia bacteriana típica).",
  },
  {
    id: 1158,
    area: "Biología",
    text: "¿Qué significa ATP?",
    options: [
    "Adenosín difosfato",
    "Adenosín trifosfato",
    "Aminoácido transportador de proteínas",
    "Ácido tricarboxílico pirúvico"
    ],
    correctIndex: 1,
    explanation: "ATP es la abreviatura de Adenosín trifosfato, la principal molécula energética en las células. Las opciones incorrectas confunden con el ciclo de Krebs (ácido tricarboxílico), un precursor energético (ADP) o una función proteica, pero solo el ATP almacena y transfiere energía en sus enlaces de fosfato.",
  },
  {
    id: 1159,
    area: "Biología",
    text: "¿Qué organismos respiran por las branquias?",
    options: [
    "Peces",
    "Crustáceos",
    "Anfibios",
    "Moluscos"
    ],
    correctIndex: 0,
    explanation: "Los peces respiran mediante branquias, órganos especializados para extraer oxígeno del agua. Los anfibios respiran principalmente por pulmones y piel, no por branquias en estado adulto. Los crustáceos y moluscos acuáticos también usan branquias, pero la pregunta se enfoca en peces como grupo principal representativo de la respiración branquial.",
  },
  {
    id: 1160,
    area: "Biología",
    text: "Menciona enfermedades respiratorias.",
    options: [
    "Diabetes, hipertensión, gastritis, hepatitis, varicela, sarampión",
    "Cardiopatía, insuficiencia renal, cirrosis, anemia, leucemia, cáncer de pulmón",
    "Faringitis, laringitis, sinusitis, otitis, conjuntivitis, dermatitis",
    "Gripe, bronquitis, neumonía, tabaquismo, influenza, asma"
    ],
    correctIndex: 3,
    explanation: "La respuesta correcta incluye enfermedades que afectan directamente al sistema respiratorio (gripe, bronquitis, neumonía, influenza, asma) y el tabaquismo como factor de riesgo. Los distractores mezclan enfermedades de otros sistemas (digestivo, circulatorio, renal, dérmico) o son condiciones no respiratorias, lo que los hace incorrectos.",
  },
  {
    id: 1161,
    area: "Biología",
    text: "¿Quién inventó la penicilina y qué función tiene?",
    options: [
    "Gregorio Mendel, es una enzima que descompone la pared celular de las bacterias",
    "Alexander Fleming, es un antibiótico capaz de eliminar a las bacterias que causan infecciones",
    "Louis Pasteur, es un antiséptico que previene infecciones en heridas abiertas",
    "Joseph Lister, es un analgésico que reduce el dolor causado por infecciones bacterianas"
    ],
    correctIndex: 1,
    explanation: "Alexander Fleming descubrió la penicilina en 1928 a partir del hongo Penicillium, y su función es actuar como antibiótico eliminando bacterias. Las otras opciones son incorrectas porque Pasteur trabajó en pasteurización y vacunas, Lister en antisepsia quirúrgica y Mendel en genética, ninguno relacionado con el descubrimiento o función de la penicilina.",
  },
  {
    id: 1162,
    area: "Biología",
    text: "¿Qué función tienen los carbohidratos y menciona dos ejemplos de ellos?",
    options: [
    "Compuestos inorgánicos que almacenan energía a largo plazo, ejemplos almidón, celulosa, glucógeno, quitina",
    "Compuestos orgánicos que actúan como fuente principal de energía, ejemplos glucosa, fructuosa, ribosa, sacarosa, maltosa, lactosa, desoxirribosa",
    "Compuestos inorgánicos que catalizan reacciones metabólicas, ejemplos enzimas, vitaminas, minerales",
    "Compuestos orgánicos que forman parte de la estructura de las membranas celulares, ejemplos colesterol, fosfolípidos, triglicéridos"
    ],
    correctIndex: 1,
    explanation: "Los carbohidratos son compuestos orgánicos cuya función principal es proporcionar energía rápida a las células, como la glucosa y la fructosa. Las opciones incorrectas los confunden con lípidos (almacenamiento a largo plazo y membranas) o con proteínas y cofactores (catalizadores), que pertenecen a otras biomoléculas.",
  },
  {
    id: 1163,
    area: "Biología",
    text: "¿Qué función tienen los lípidos y menciona dos ejemplos de ellos?",
    options: [
    "Moléculas que catalizan reacciones metabólicas, ejemplos enzimas y hormonas",
    "Estructuras que transportan oxígeno en la sangre, ejemplos hemoglobina y mioglobina",
    "Compuestos orgánicos que actúan como fuente de energía de reserva, ejemplos colesterol y triglicéridos",
    "Compuestos inorgánicos que almacenan energía a corto plazo, ejemplos glucosa y fructosa"
    ],
    correctIndex: 2,
    explanation: "La respuesta correcta es correcta porque los lípidos son compuestos orgánicos (no inorgánicos) que fungen como reserva energética a largo plazo, y el colesterol y triglicéridos son ejemplos típicos. Las opciones incorrectas confunden lípidos con carbohidratos (glucosa), proteínas (enzimas) o proteínas transportadoras (hemoglobina), que tienen funciones y naturaleza química distintas.",
  },
  {
    id: 1164,
    area: "Biología",
    text: "¿Qué son las proteínas?",
    options: [
    "Polímeros de nucleótidos que almacenan información genética",
    "Moléculas inorgánicas que almacenan energía en los enlaces fosfato",
    "Compuestos orgánicos formados por aminoácidos",
    "Compuestos lipídicos que forman las membranas celulares"
    ],
    correctIndex: 2,
    explanation: "La respuesta correcta es 'Compuestos orgánicos formados por aminoácidos' porque las proteínas son macromoléculas compuestas por cadenas de aminoácidos unidos por enlaces peptídicos. Las opciones incorrectas confunden proteínas con ATP (almacena energía), lípidos (componentes de membranas) y ácidos nucleicos (almacenan información genética).",
  },
  {
    id: 1165,
    area: "Biología",
    text: "Explica qué es obesidad.",
    options: [
    "Es la acumulación excesiva de glucosa en el torrente sanguíneo, debida a un desequilibrio en la producción de insulina por el páncreas",
    "Es la elevación de los niveles de grasa corporal, ocasionado por consumir más calorías de las que nuestro cuerpo puede utilizar para convertir en energía",
    "Es la disminución de la tasa metabólica basal, que impide la correcta oxidación de los nutrientes y provoca que los lípidos se almacenen en las vísceras",
    "Es el aumento del peso corporal total, provocado principalmente por una retención anormal de líquidos y electrolitos en los tejidos"
    ],
    correctIndex: 1,
    explanation: "La respuesta correcta define obesidad como exceso de grasa corporal por desbalance energético (más calorías consumidas que gastadas). Las opciones incorrectas confunden obesidad con diabetes (glucosa/insulina), edema (retención de líquidos) o hipotiroidismo (metabolismo bajo), que son condiciones distintas.",
  },
  {
    id: 1166,
    area: "Biología",
    text: "¿Qué enfermedades pueden ocasionar la obesidad?",
    options: [
    "Anemia, osteoporosis, asma",
    "Ceguera, sordera, artritis",
    "Caries, gastritis, insomnio",
    "Diabetes, infartos, hipertensión"
    ],
    correctIndex: 3,
    explanation: "La obesidad aumenta el riesgo de diabetes tipo 2, infartos e hipertensión debido a la resistencia a la insulina, inflamación crónica y sobrecarga cardiovascular. Las alternativas mencionan enfermedades no directamente vinculadas a la obesidad, como anemia o caries, que tienen causas distintas.",
  },
  {
    id: 1167,
    area: "Biología",
    text: "¿Qué es la diabetes?",
    options: [
    "Incapacidad del cuerpo para digerir los azúcares en el intestino",
    "Disminución de la producción de insulina por el páncreas",
    "Aumento de los niveles de glucosa en la sangre",
    "Aumento de la presión arterial debido al consumo de azúcar"
    ],
    correctIndex: 2,
    explanation: "La diabetes se define por la hiperglucemia, es decir, niveles elevados de glucosa en sangre, debido a problemas con la insulina. La primera opción describe una causa común (falta de insulina), no la definición; la segunda confunde digestión con metabolismo de la glucosa; la tercera mezcla con hipertensión, que es otra enfermedad.",
  },
  {
    id: 1168,
    area: "Biología",
    text: "¿Qué es la anorexia?",
    options: [
    "Trastorno psicológico caracterizado por episodios de ingesta excesiva de alimentos seguidos de purgas",
    "Enfermedad metabólica que impide la absorción de nutrientes, provocando una pérdida de peso severa",
    "Pérdida del apetito causada por una infección bacteriana en el sistema digestivo",
    "Trastorno de la conducta alimenticia, donde el enfermo se ve gordo aún cuando su peso se encuentra por debajo de lo recomendado"
    ],
    correctIndex: 3,
    explanation: "La anorexia es un trastorno de la conducta alimenticia donde el paciente tiene una percepción distorsionada de su cuerpo y se ve con sobrepeso a pesar de estar por debajo del peso saludable. Las opciones incorrectas confunden el trastorno con enfermedades metabólicas (como la malabsorción), con la bulimia (atracones y purgas) o con causas infecciosas, que no corresponden a la definición psiquiátrica y biológica de la anorexia nerviosa.",
  },
  {
    id: 1169,
    area: "Biología",
    text: "¿Qué es la bulimia?",
    options: [
    "Es un trastorno alimenticio en el que se evita completamente la comida durante días, seguido de atracones nocturnos que provocan un aumento de peso significativo",
    "Es un trastorno donde las personas no pueden dominar los impulsos que los motiva a comer grandes cantidades de alimento, para después provocarse la pérdida de peso",
    "Es un trastorno caracterizado por la ingesta excesiva de alimentos seguida de conductas compensatorias como el vómito autoinducido, pero sin sensación de pérdida de control",
    "Es una enfermedad donde la persona come grandes cantidades de comida en un corto período, sintiendo placer y control durante el episodio, sin culpa posterior"
    ],
    correctIndex: 1,
    explanation: "La respuesta correcta es precisa porque describe el ciclo de atracón y purga típico de la bulimia nerviosa. Las opciones incorrectas fallan al omitir la pérdida de control (opción 1), al afirmar que hay control y placer durante el atracón (opción 2), o al describir un patrón de ayuno y atracones que corresponde más a otro trastorno como el trastorno por atracón (opción 3).",
  },
  {
    id: 1170,
    area: "Biología",
    text: "¿Qué es mitosis?",
    options: [
    "Proceso de división celular que reduce a la mitad el número de cromosomas, produciendo cuatro células hijas genéticamente distintas",
    "Fase del ciclo celular en la que la célula sintetiza proteínas y duplica su ADN antes de dividirse",
    "Tipo de reproducción asexual en organismos unicelulares donde la célula madre se fusiona con otra para generar dos células hijas",
    "Tipo de división celular, de cualquier célula somática, donde al final se producen dos células idénticas a la original"
    ],
    correctIndex: 3,
    explanation: "La mitosis es la división de células somáticas que produce dos células hijas genéticamente idénticas a la madre. Las opciones incorrectas describen procesos diferentes: la meiosis (reducción cromosómica y cuatro células distintas), la conjugación (fusión celular) y la interfase (síntesis y duplicación de ADN, no división).",
  },
  {
    id: 1171,
    area: "Biología",
    text: "¿Qué es meiosis?",
    options: [
    "Mecanismo de replicación del ADN que ocurre durante la interfase del ciclo celular, previo a cualquier tipo de división",
    "Tipo de división celular que ocurre en todas las células del cuerpo para reparar tejidos y crecer, generando células hijas idénticas",
    "Tipo de división celular específica de los gametos o células sexuales, donde al final se producen cuatro células diferentes a la original",
    "Proceso de reproducción asexual en bacterias donde el ADN se duplica y la célula se divide en dos células idénticas"
    ],
    correctIndex: 2,
    explanation: "La meiosis es una división celular exclusiva de células sexuales que produce cuatro células genéticamente distintas (no idénticas), a diferencia de la mitosis (reparación y crecimiento) que genera dos células idénticas, y de la fisión binaria (reproducción bacteriana) o la replicación del ADN que no implican división celular.",
  },
  {
    id: 1172,
    area: "Biología",
    text: "¿Qué es reproducción?",
    options: [
    "Capacidad de los seres vivos de reparar tejidos dañados y regenerar partes perdidas del cuerpo",
    "Mecanismo de intercambio de material genético entre dos células de la misma especie para generar variabilidad",
    "Capacidad de los seres vivos de poder originar organismos semejantes y así perpetuar la especie",
    "Proceso mediante el cual los organismos unicelulares se dividen para formar dos células hijas idénticas"
    ],
    correctIndex: 2,
    explanation: "La reproducción es la capacidad de originar nuevos organismos semejantes para perpetuar la especie, abarcando tanto la reproducción asexual como la sexual. Las opciones incorrectas describen procesos específicos (fisión binaria, conjugación, regeneración) que no representan la definición general y completa de reproducción.",
  },
  {
    id: 1173,
    area: "Biología",
    text: "¿Qué es reproducción asexual?",
    options: [
    "Tipo de reproducción donde participan dos progenitores y hay intercambio de material genético",
    "Tipo de reproducción donde participa un solo progenitor y no hay variabilidad genética",
    "Tipo de reproducción donde el nuevo individuo se forma a partir de una célula haploide",
    "Tipo de reproducción que solo ocurre en organismos unicelulares como bacterias"
    ],
    correctIndex: 1,
    explanation: "La reproducción asexual implica un solo progenitor y no hay combinación de genes, por lo que la descendencia es genéticamente idéntica. Las opciones incorrectas describen reproducción sexual (dos progenitores), un caso particular (bacterias) o confunden con gametos haploides, que no generan nuevos individuos por sí solos en este contexto.",
  },
  {
    id: 1174,
    area: "Biología",
    text: "¿Qué es reproducción sexual?",
    options: [
    "Tipo de reproducción donde se fusionan los dos gametos (óvulo y espermatozoide), y presenta variabilidad genética",
    "Mecanismo de reproducción que ocurre en organismos unicelulares mediante bipartición, sin intercambio de material genético",
    "Tipo de reproducción donde un solo progenitor produce descendencia genéticamente idéntica a él, sin fusión de gametos",
    "Proceso en el que las células somáticas se dividen por mitosis para generar nuevos organismos, manteniendo la misma información genética"
    ],
    correctIndex: 0,
    explanation: "La reproducción sexual implica la fusión de dos gametos (óvulo y espermatozoide), lo que genera descendencia con variabilidad genética. Las opciones incorrectas describen formas de reproducción asexual (como la bipartición o la mitosis), donde no hay fusión de gametos ni variabilidad genética.",
  },
  {
    id: 1175,
    area: "Biología",
    text: "¿Qué es bipartición?",
    options: [
    "Tipo de reproducción asexual donde un organismo se divide en dos células hijas del mismo tamaño",
    "Tipo de reproducción asexual en el que un organismo se fragmenta en varias partes que regeneran individuos completos",
    "Mecanismo de reproducción sexual donde un organismo se fusiona con otro para formar un cigoto",
    "Proceso de división celular en el que una célula madre da origen a cuatro células hijas genéticamente distintas"
    ],
    correctIndex: 0,
    explanation: "La bipartición es un tipo de reproducción asexual en el que un organismo unicelular (como una bacteria o ameba) se divide en dos células hijas del mismo tamaño, cada una con copia del material genético. Las opciones incorrectas describen otros procesos: la primera se refiere a la reproducción sexual (fusión de gametos), la segunda a la meiosis (división en cuatro células) y la tercera a la fragmentación (reproducción en pluricelulares).",
  },
  {
    id: 1176,
    area: "Biología",
    text: "¿Qué es gemación?",
    options: [
    "Proceso de formación de una nueva célula a partir de la división del núcleo de una célula madre en dos núcleos hijos",
    "Mecanismo de reproducción en el que un organismo se divide transversalmente en dos partes iguales, cada una regenerando las estructuras faltantes",
    "Tipo de reproducción asexual donde un organismo se origina a partir de una yema o brote que se forma en el progenitor, donde al separarse crece y forma un nuevo organismo",
    "Tipo de reproducción sexual donde un organismo se desarrolla a partir de un fragmento del progenitor que contiene material genético de ambos padres"
    ],
    correctIndex: 2,
    explanation: "La gemación es un tipo de reproducción asexual en el que una yema o brote se forma en el progenitor y, al separarse, da origen a un nuevo individuo genéticamente idéntico. Las opciones incorrectas describen otros procesos: la primera se refiere a la mitosis, la segunda a la reproducción sexual (por fragmentación con recombinación, que no ocurre así) y la tercera a la fisión binaria, típica de organismos como las bacterias.",
  },
  {
    id: 1177,
    area: "Biología",
    text: "¿Qué es el dimorfismo sexual?",
    options: [
    "Capacidad de un organismo para cambiar de sexo",
    "Variación genética entre individuos de la misma especie",
    "Proceso de diferenciación celular durante la mitosis",
    "Diferencia anatómica entre los dos sexos"
    ],
    correctIndex: 3,
    explanation: "El dimorfismo sexual se refiere específicamente a las diferencias físicas o anatómicas entre machos y hembras de una misma especie. Las opciones incorrectas confunden el término con procesos celulares (mitosis), cambios de sexo (hermafroditismo) o variación genética general, que no implican necesariamente diferencias sexuales anatómicas.",
  },
  {
    id: 1178,
    area: "Biología",
    text: "¿Cuáles son las funciones del sistema reproductor femenino?",
    options: [
    "Producir óvulos, testosterona y estrógenos, facilitar la ovulación y la menstruación, y regular el ciclo menstrual",
    "Producir óvulos, progesterona y estrógenos, y únicamente permitir la fecundación y el parto",
    "Producir espermatozoides, óvulos y hormonas, así como mantener el embarazo y el parto",
    "Producir óvulos, progesterona y estrógenos, permitir la fecundación, implantar el óvulo, mantener la gestación y finalizar el proceso en el trabajo de parto"
    ],
    correctIndex: 3,
    explanation: "La respuesta correcta es correcta porque el sistema reproductor femenino tiene como funciones la producción de óvulos y hormonas (estrógenos y progesterona), además de posibilitar la fecundación, implantación, gestación y parto. Las alternativas son incorrectas porque mencionan testosterona (hormona masculina), espermatozoides (células masculinas) o excluyen procesos clave como la implantación y la gestación.",
  },
  {
    id: 1179,
    area: "Biología",
    text: "Explica la función de los testículos.",
    options: [
    "Estructuras que filtran la sangre y eliminan desechos nitrogenados",
    "Glándulas que secretan hormonas para regular el ciclo menstrual",
    "Órganos que almacenan y maduran los óvulos para la fecundación",
    "Glándulas encargadas de producir y madurar a los espermatozoides"
    ],
    correctIndex: 3,
    explanation: "La respuesta correcta es que los testículos producen y maduran espermatozoides, además de secretar testosterona. Las alternativas son incorrectas porque el ciclo menstrual y los óvulos corresponden al sistema reproductor femenino, y la filtración sanguínea es función de los riñones.",
  },
  {
    id: 1180,
    area: "Biología",
    text: "¿Qué es la sífilis?",
    options: [
    "Parásito que provoca una infección de transmisión sexual",
    "Virus que causa una infección de transmisión sexual",
    "Bacteria que produce una enfermedad de transmisión sexual",
    "Hongos que originan una enfermedad de transmisión sexual"
    ],
    correctIndex: 2,
    explanation: "La sífilis es causada por la bacteria Treponema pallidum, no por virus, hongos ni parásitos. Se transmite principalmente por contacto sexual y puede tratarse con antibióticos, a diferencia de las infecciones virales. Recordar que es bacteriana ayuda a distinguirla de otras ETS como el VIH (viral) o la candidiasis (fúngica).",
  },
  {
    id: 1181,
    area: "Biología",
    text: "¿Qué es el SIDA?",
    options: [
    "Síndrome de inmunidad deficiente adquirida",
    "Infección por virus de linfocitos T humanos",
    "Síndrome de inmunodeficiencia adquirida",
    "Enfermedad de transmisión sexual crónica"
    ],
    correctIndex: 2,
    explanation: "El SIDA es el Síndrome de Inmunodeficiencia Adquirida, causado por el VIH, que destruye linfocitos CD4. Las opciones incorrectas usan términos similares pero incorrectos: 'inmunidad deficiente' cambia el término técnico, 'enfermedad de transmisión sexual crónica' es una descripción vaga y no su nombre oficial, e 'infección por virus de linfocitos T humanos' se refiere al virus HTLV, no al VIH.",
  },
  {
    id: 1182,
    area: "Biología",
    text: "Menciona ejemplos de métodos anticonceptivos.",
    options: [
    "DIU, condón femenino o masculino, inyecciones, pastilla, parche transdérmico",
    "Antibióticos, vacunas, suplementos vitamínicos",
    "Ejercicio regular, dieta balanceada, descanso",
    "Lavado vaginal, jacuzzi, sauna"
    ],
    correctIndex: 0,
    explanation: "La respuesta correcta enumera métodos anticonceptivos físicos, hormonales y de barrera aprobados médicamente. Los distractores son incorrectos: los antibióticos y vitaminas no evitan el embarazo; el ejercicio y dieta son hábitos saludables pero no anticonceptivos; el lavado vaginal y saunas no tienen eficacia anticonceptiva comprobada y son mitos comunes.",
  },
  {
    id: 1183,
    area: "Biología",
    text: "¿Qué es un gen?",
    options: [
    "Cromosoma completo",
    "Segmento de proteína funcional",
    "Molécula de ARN mensajero",
    "Unidad portadora de la herencia"
    ],
    correctIndex: 3,
    explanation: "La respuesta correcta es 'Unidad portadora de la herencia' porque un gen es un segmento de ADN que contiene la información necesaria para transmitir caracteres hereditarios. Las alternativas son incorrectas: el ARNm es una copia del gen para la síntesis de proteínas, no la unidad hereditaria; una proteína es el producto de la expresión génica, no el gen mismo; y un cromosoma contiene muchos genes, no es la unidad individual.",
  },
  {
    id: 1184,
    area: "Biología",
    text: "¿Qué es genotipo?",
    options: [
    "Manifestación física de los genes",
    "Constitución genética de un individuo",
    "Secuencia de ADN que codifica una proteína",
    "Conjunto de cromosomas de una célula"
    ],
    correctIndex: 1,
    explanation: "El genotipo es la constitución genética completa de un individuo, es decir, la información hereditaria contenida en sus genes, no su manifestación física (que es el fenotipo), ni solo los cromosomas o una secuencia específica de ADN.",
  },
  {
    id: 1185,
    area: "Biología",
    text: "¿Cuáles son los gametos en los seres humanos?",
    options: [
    "Célula madre y célula hija",
    "Óvulo y espermatozoide",
    "Célula somática y célula germinal",
    "Cigoto y blastocisto"
    ],
    correctIndex: 1,
    explanation: "La respuesta correcta es óvulo y espermatozoide porque son las células reproductoras haploides (con 23 cromosomas) que se fusionan en la fecundación. Las opciones incorrectas son: célula somática y germinal (las somáticas son diploides y no participan en la reproducción), cigoto y blastocisto (son etapas del desarrollo embrionario, no gametos), y célula madre y célula hija (términos de división celular, no de gametos).",
  },
  {
    id: 1186,
    area: "Biología",
    text: "¿Quién es considerado el padre de la genética?",
    options: [
    "Gregorio Mendel",
    "Charles Darwin",
    "Thomas Hunt Morgan",
    "Aristóteles"
    ],
    correctIndex: 0,
    explanation: "Gregorio Mendel es considerado el padre de la genética por sus experimentos con guisantes que establecieron las leyes de la herencia. Darwin propuso la evolución por selección natural, no las bases de la herencia; Aristóteles especuló sobre la herencia sin experimentos; y Morgan, aunque importante en genética (cromosomas), trabajó después de Mendel.",
  },
  {
    id: 1187,
    area: "Biología",
    text: "¿Qué es población?",
    options: [
    "Total de individuos de todas las especies que viven en una región geográfica",
    "Grupo de seres vivos que comparten un mismo hábitat y se reproducen entre sí",
    "Conjunto de individuos de la misma especie que habitan en un lugar determinado",
    "Conjunto de organismos de diferentes especies que conviven en un ecosistema"
    ],
    correctIndex: 2,
    explanation: "La respuesta correcta define población como individuos de la misma especie en un lugar determinado. Las opciones incorrectas confunden población con comunidad (varias especies), especie (reproducción entre sí) o ecosistema (todas las especies). Recuerda: población = misma especie; comunidad = diferentes especies.",
  },
  {
    id: 1188,
    area: "Biología",
    text: "¿Qué es una comunidad?",
    options: [
    "Conjunto de poblaciones en un área determinada",
    "Organismos que interactúan en un mismo hábitat",
    "Un grupo de organismos de la misma especie en un lugar",
    "Conjunto de factores abióticos en un ecosistema"
    ],
    correctIndex: 0,
    explanation: "La respuesta correcta es 'Conjunto de poblaciones en un área determinada' porque en biología una comunidad incluye todas las poblaciones de diferentes especies que coexisten. La primera opción describe una población, no una comunidad; la segunda se refiere al ambiente físico (factores abióticos); y la tercera es ambigua, ya que 'organismos que interactúan' puede confundirse con el concepto de ecosistema.",
  },
  {
    id: 1189,
    area: "Biología",
    text: "¿Cuáles son los dos productos finales de la fotosíntesis?",
    options: [
    "ATP y NADPH",
    "Glucosa y oxígeno",
    "Glucosa y dióxido de carbono",
    "Agua y oxígeno"
    ],
    correctIndex: 1,
    explanation: "La fotosíntesis convierte dióxido de carbono y agua en glucosa y oxígeno usando energía lumínica. Glucosa y dióxido de carbono es incorrecto porque el CO₂ es un reactivo, no un producto. Agua y oxígeno omite la glucosa y el agua es reactivo. ATP y NADPH son productos intermedios de la fase luminosa, no finales.",
  },
  {
    id: 1190,
    area: "Biología",
    text: "¿En qué partes de la planta se realiza la fotosíntesis?",
    options: [
    "Hojas y raíces",
    "Hojas y tallos",
    "Raíces y frutos",
    "Tallos y flores"
    ],
    correctIndex: 1,
    explanation: "La fotosíntesis ocurre principalmente en las hojas y tallos verdes porque contienen clorofila, necesaria para captar luz solar. Raíces y frutos no realizan fotosíntesis (raíces carecen de clorofila; frutos suelen almacenar nutrientes, no producirlos), y las flores tienen función reproductiva, no fotosintética.",
  },
  {
    id: 1191,
    area: "Biología",
    text: "¿Cuáles son los tres productos finales de la respiración?",
    options: [
    "Ácido láctico, alcohol y 2 ATP",
    "Glucosa, oxígeno y 2 ATP",
    "Dióxido de carbono, agua y 38 ATP",
    "Dióxido de carbono, agua y 2 ATP"
    ],
    correctIndex: 2,
    explanation: "La respiración celular aerobia degrada glucosa con oxígeno para generar dióxido de carbono, agua y un rendimiento neto de 38 ATP. Las opciones incorrectas mencionan productos de la fermentación (ácido láctico, alcohol) o cantidades de ATP propias de la glucólisis (2 ATP), no del proceso completo.",
  },
  {
    id: 1192,
    area: "Biología",
    text: "¿Cuáles son los dos tipos de fermentación?",
    options: [
    "Oxidativa y reductiva",
    "Ácida y alcohólica",
    "Láctica y butírica",
    "Aerobia y anaerobia"
    ],
    correctIndex: 1,
    explanation: "La fermentación es un proceso anaeróbico que produce energía. Los dos tipos principales son la fermentación láctica (que produce ácido láctico, como en los músculos) y la alcohólica (que produce etanol y CO2, como en la levadura). Las opciones incorrectas mezclan tipos de fermentación secundarios (butírica), clasificaciones incorrectas (oxidativa/reductiva no son fermentaciones) o confunden el tipo de respiración (aerobia/anaerobia) con la fermentación misma.",
  },
  {
    id: 1193,
    area: "Biología",
    text: "¿Qué son las estomas?",
    options: [
    "Son conductos internos que transportan savia bruta desde la raíz hasta las hojas",
    "Son pequeños poros por donde respira la planta, ubicados en sus hojas y tallos",
    "Son células especializadas que producen clorofila en las hojas",
    "Son estructuras que almacenan agua para evitar la deshidratación de la planta"
    ],
    correctIndex: 1,
    explanation: "Las estomas son poros microscópicos en la epidermis de hojas y tallos que permiten el intercambio gaseoso (CO2, O2 y vapor de agua). Las opciones incorrectas confunden estomas con estructuras de almacenamiento, producción de clorofila o transporte vascular, que tienen funciones diferentes.",
  },
  {
    id: 1194,
    area: "Biología",
    text: "¿Qué enfermedad nos da, si nos falta vitamina K?",
    options: [
    "Anemia ferropénica",
    "Hemorragias",
    "Problemas de visión nocturna",
    "Debilidad muscular"
    ],
    correctIndex: 1,
    explanation: "La vitamina K es esencial para la síntesis de factores de coagulación en el hígado; su deficiencia impide la correcta coagulación sanguínea, provocando hemorragias. Las otras opciones se asocian con deficiencias de vitamina A, vitamina D y hierro, respectivamente, no con vitamina K.",
  },
  {
    id: 1195,
    area: "Biología",
    text: "¿Qué enfermedad nos da, si nos falta vitamina B12?",
    options: [
    "Anemia",
    "Bocio",
    "Raquitismo",
    "Escorbuto"
    ],
    correctIndex: 0,
    explanation: "La vitamina B12 es esencial para la formación de glóbulos rojos, por lo que su deficiencia causa anemia megaloblástica. El escorbuto se debe a falta de vitamina C, el raquitismo a vitamina D y el bocio a deficiencia de yodo, no de B12.",
  },
  {
    id: 1196,
    area: "Biología",
    text: "¿Cómo se representa el gameto femenino?",
    options: [
    "X",
    "Y",
    "XX",
    "XY"
    ],
    correctIndex: 2,
    explanation: "El gameto femenino (óvulo) siempre porta un cromosoma X, por lo que su representación genética es XX. XY corresponde al varón, X sería un óvulo sin su par (no existe) y Y es exclusivo del espermatozoide masculino.",
  },
  {
    id: 1197,
    area: "Biología",
    text: "¿Cómo se representa el gameto masculino?",
    options: [
    "X",
    "XY",
    "Y",
    "XX"
    ],
    correctIndex: 1,
    explanation: "El gameto masculino humano (espermatozoide) es haploide y puede portar un cromosoma X o Y, por lo que se representa como XY. XX es femenino, y X o Y solos no representan un gameto completo, ya que llevan un solo cromosoma sexual.",
  },
  {
    id: 1198,
    area: "Biología",
    text: "¿Cuántos cromosomas tiene el ser humano?",
    options: [
    "44 cromosomas (22 pares)",
    "46 cromosomas (23 pares)",
    "23 cromosomas (1 par)",
    "48 cromosomas (24 pares)"
    ],
    correctIndex: 1,
    explanation: "La especie humana tiene 46 cromosomas en células somáticas, organizados en 23 pares. La opción de 48 es un número común en simios como chimpancés; la de 44 es típica de algunos roedores; y la de 23 corresponde al número haploide de gametos, no al total celular.",
  },
  {
    id: 1199,
    area: "Biología",
    text: "¿Qué es mutación?",
    options: [
    "Proceso de división celular que produce gametos",
    "Cambio permanente en la estructura del ADN",
    "Mecanismo de reparación del ADN dañado por radiación",
    "Cambio temporal en la expresión de un gen por el ambiente"
    ],
    correctIndex: 1,
    explanation: "La respuesta correcta es 'cambio permanente en la estructura del ADN' porque las mutaciones implican alteraciones estables en la secuencia de nucleótidos. Las otras opciones son incorrectas: la primera describe la meiosis, la segunda se refiere a modificaciones epigenéticas o fenotípicas no heredables, y la tercera es un proceso de corrección, no de cambio permanente.",
  },
  {
    id: 1200,
    area: "Biología",
    text: "¿Qué se produce cuando hay una trisomía en el par 21?",
    options: [
    "Síndrome de Down",
    "Síndrome de Turner",
    "Síndrome de Edwards",
    "Síndrome de Klinefelter"
    ],
    correctIndex: 0,
    explanation: "La trisomía en el par 21 produce el síndrome de Down, caracterizado por discapacidad intelectual y rasgos físicos distintivos. El síndrome de Turner (monosomía X) y Klinefelter (XXY) son anomalías en cromosomas sexuales, no en el par 21. El síndrome de Edwards corresponde a trisomía en el par 18, no en el 21.",
  },
  {
    id: 1201,
    area: "Historia",
    text: "Movimiento político social que inició el 4 de julio de 1776, comandado por George Washington y que enfrentó al ejército inglés.",
    options: [
    "La Guerra de los Siete Años",
    "La Revolución Francesa",
    "La Independencia de México",
    "La Independencia de las trece colonias británicas"
    ],
    correctIndex: 3,
    explanation: "La respuesta correcta es la Independencia de las trece colonias británicas, que inició el 4 de julio de 1776 con la Declaración de Independencia y fue liderada por George Washington contra el ejército inglés. La Revolución Francesa comenzó en 1789, la Guerra de los Siete Años (1756-1763) fue un conflicto previo entre potencias europeas, y la Independencia de México inició en 1810, por lo que ninguna coincide con la fecha ni el líder mencionados.",
  },
  {
    id: 1202,
    area: "Historia",
    text: "¿Cuál es el nombre del documento firmado después de la Batalla de Yorktown en 1783, por medio del cual se reconoce la independencia de los Estados Unidos de América?",
    options: [
    "Tratado de Utrecht",
    "Tratado de París",
    "Tratado de Versalles",
    "Tratado de Gante"
    ],
    correctIndex: 2,
    explanation: "El Tratado de Versalles (1783) puso fin a la Guerra de Independencia de EE.UU. y reconoció su soberanía. El Tratado de París (1763) finalizó la Guerra de los Siete Años, el de Gante (1814) la guerra anglo-estadounidense de 1812, y el de Utrecht (1713) la Guerra de Sucesión Española, todos eventos distintos.",
  },
  {
    id: 1203,
    area: "Historia",
    text: "¿Cuál es el nombre del movimiento iniciado el 14 de julio de 1789 con la toma del castillo de la Bastilla y que tuvo gran repercusión en el pensamiento europeo e hispanoamericano de los siglos XVIII y XIX?",
    options: [
    "La Independencia de Estados Unidos",
    "La Revolución Francesa",
    "La Revolución Industrial",
    "La Ilustración"
    ],
    correctIndex: 1,
    explanation: "La Revolución Francesa inició el 14 de julio de 1789 con la toma de la Bastilla y marcó el fin del Antiguo Régimen, inspirando movimientos liberales en Europa e Hispanoamérica. La Independencia de Estados Unidos ocurrió en 1776, la Ilustración fue un movimiento filosófico previo, y la Revolución Industrial comenzó en Inglaterra a mediados del siglo XVIII, por lo que ninguna corresponde a la fecha y evento señalados.",
  },
  {
    id: 1204,
    area: "Historia",
    text: "Durante la Segunda Guerra Mundial, y habiendo invadido la mayor parte del viejo continente, este personaje afirmó 'Hoy Europa, mañana el mundo':",
    options: [
    "José Stalin",
    "Benito Mussolini",
    "Napoleón Bonaparte",
    "Adolf Hitler"
    ],
    correctIndex: 3,
    explanation: "La frase 'Hoy Europa, mañana el mundo' fue pronunciada por Adolf Hitler en 1941, reflejando su ambición expansionista durante la Segunda Guerra Mundial. Mussolini lideró Italia, pero no llegó a dominar Europa; Stalin gobernó la URSS y Napoleón intentó conquistar Europa en el siglo XIX, siglos antes del conflicto.",
  },
  {
    id: 1205,
    area: "Historia",
    text: "Inmediatamente después de la Edad Media se dio este periodo histórico:",
    options: [
    "Renacimiento",
    "Barroco",
    "Reforma Protestante",
    "Humanismo"
    ],
    correctIndex: 0,
    explanation: "El Renacimiento es el periodo inmediatamente posterior a la Edad Media, iniciado en el siglo XIV, caracterizado por el redescubrimiento de la cultura clásica. La Reforma Protestante surgió después (siglo XVI), el Humanismo es un movimiento intelectual dentro del Renacimiento, y el Barroco es un estilo artístico posterior (siglo XVII).",
  },
  {
    id: 1206,
    area: "Historia",
    text: "Se considera que este hecho marcó el inicio de la Edad Media:",
    options: [
    "La invención de la escritura",
    "La caída del Imperio romano de occidente",
    "El surgimiento del cristianismo",
    "La caída del Imperio romano de oriente"
    ],
    correctIndex: 1,
    explanation: "La caída del Imperio romano de occidente en 476 d.C. marca el inicio de la Edad Media porque rompe la unidad política del Mediterráneo y da paso a los reinos germánicos. La invención de la escritura inicia la Edad Antigua, el surgimiento del cristianismo ocurre durante el Imperio romano, y la caída de oriente es en 1453, que marca el fin de la Edad Media.",
  },
  {
    id: 1207,
    area: "Geografía",
    text: "La máquina de vapor se inventó durante este periodo:",
    options: [
    "Período del Renacimiento",
    "Expansión del Imperio Romano",
    "Revolución Industrial",
    "Era de los Descubrimientos Geográficos"
    ],
    correctIndex: 2,
    explanation: "La máquina de vapor, perfeccionada por James Watt en el siglo XVIII, fue el motor central de la Revolución Industrial, transformando la producción y el transporte. Las otras opciones, aunque importantes en Geografía e Historia, corresponden a épocas anteriores donde no existía esta tecnología.",
  },
  {
    id: 1208,
    area: "Geografía",
    text: "Por su extensión, es el estado más grande del país:",
    options: [
    "Coahuila",
    "Sonora",
    "Durango",
    "Chihuahua"
    ],
    correctIndex: 3,
    explanation: "Chihuahua es el estado más extenso de México con aproximadamente 247,455 km², superando a Sonora (segundo lugar) y a Coahuila y Durango, que también son grandes pero ocupan el tercer y cuarto lugar respectivamente.",
  },
  {
    id: 1209,
    area: "Geografía",
    text: "El viaje en que Cristóbal Colón llegó a tierras americanas fue motivado principalmente por:",
    options: [
    "La búsqueda de nuevas rutas hacia las Indias",
    "El deseo de comprobar la redondez de la Tierra",
    "La expansión del Imperio español hacia el oeste",
    "La necesidad de encontrar metales preciosos en Asia"
    ],
    correctIndex: 0,
    explanation: "La respuesta correcta es la búsqueda de nuevas rutas hacia las Indias, ya que el objetivo principal de Colón era llegar a Asia por una ruta marítima alternativa. Las otras opciones son incorrectas porque, aunque la expansión, la prueba de la redondez y la búsqueda de metales preciosos fueron temas asociados, no fueron la motivación principal del viaje según los acuerdos con los Reyes Católicos.",
  },
  {
    id: 1210,
    area: "Geografía",
    text: "El río Bravo es en su desembocadura un límite fronterizo con:",
    options: [
    "Guatemala",
    "Estados Unidos",
    "Belice",
    "Canadá"
    ],
    correctIndex: 1,
    explanation: "El río Bravo (o río Grande) marca la frontera entre México y Estados Unidos en su desembocadura en el golfo de México. Guatemala y Belice son fronteras mexicanas al sur, pero no con este río; Canadá limita con EE. UU., pero no con México.",
  },
  {
    id: 1211,
    area: "Geografía",
    text: "¿Cuáles fueron los países participantes de la Triple Entente durante la Primera Guerra Mundial?",
    options: [
    "Reino Unido, Francia y España",
    "Alemania, Austria-Hungría e Italia",
    "Reino Unido, Francia y Rusia",
    "Reino Unido, Francia y Estados Unidos"
    ],
    correctIndex: 2,
    explanation: "La Triple Entente original la formaron Reino Unido, Francia y Rusia para contrarrestar a la Triple Alianza. Estados Unidos no participó hasta 1917, Italia luchó del lado de la Entente pero no era miembro fundador, y España se mantuvo neutral durante toda la guerra.",
  },
  {
    id: 1212,
    area: "Geografía",
    text: "La caída de las acciones bursátiles en 1929 provocó una falta de liquidez de los bancos y ésta a su vez provocó:",
    options: [
    "La quiebra del sistema bancario europeo",
    "La Gran Depresión",
    "El aumento del desempleo en México",
    "La crisis del petróleo de 1973"
    ],
    correctIndex: 1,
    explanation: "La caída de la bolsa en 1929 provocó una crisis de liquidez bancaria que desencadenó la Gran Depresión, una recesión económica global. Las otras opciones, aunque son eventos importantes, no están directamente vinculadas como consecuencia inmediata de esa falta de liquidez en 1929: la crisis del petróleo ocurrió décadas después, el desempleo en México fue un efecto regional posterior, y la quiebra bancaria europea no fue la causa principal de la depresión mundial.",
  },
  {
    id: 1213,
    area: "Geografía",
    text: "Año en el que es derrumbado el Muro de Berlín iniciándose no sólo la reunificación alemana, sino también el derrumbe de la hegemonía socialista organizada por la URSS.",
    options: [
    "1985",
    "1991",
    "1987",
    "1989"
    ],
    correctIndex: 3,
    explanation: "El Muro de Berlín cayó el 9 de noviembre de 1989, evento que simbolizó el fin de la Guerra Fría y la desintegración del bloque soviético. 1985 corresponde al inicio de la Perestroika de Gorbachov; 1991 a la disolución oficial de la URSS; 1987 a un año sin hitos equivalentes en el proceso de reunificación alemana.",
  },
  {
    id: 1214,
    area: "Geografía",
    text: "Son los firmantes del Plan de Iguala, por medio del cual se propone la independencia de México en 1821.",
    options: [
    "Juárez y Ocampo",
    "Hidalgo y Allende",
    "Morelos y Matamoros",
    "Iturbide y Guerrero"
    ],
    correctIndex: 3,
    explanation: "El Plan de Iguala fue firmado por Agustín de Iturbide y Vicente Guerrero en 1821, uniendo al ejército realista e insurgente. Hidalgo y Allende iniciaron la Independencia en 1810, Morelos y Matamoros lideraron en 1812-1815, y Juárez y Ocampo pertenecen a la Reforma (1850s), no a la Independencia.",
  },
  {
    id: 1215,
    area: "Geografía",
    text: "Artículo de la Constitución Política Mexicana en que se asienta el derecho de todo mexicano a la educación:",
    options: [
    "Artículo 4°",
    "Artículo 27°",
    "Artículo 3°",
    "Artículo 123°"
    ],
    correctIndex: 2,
    explanation: "El Artículo 3° constitucional establece el derecho a la educación laica, gratuita y obligatoria en México. El Artículo 27° trata sobre propiedad de tierras y recursos, el 4° aborda igualdad y derechos humanos, y el 123° regula el trabajo y previsión social, por lo que ninguno corresponde al ámbito educativo.",
  },
  {
    id: 1216,
    area: "Geografía",
    text: "Durante el mandato de este presidente se promulgó la Constitución que actualmente nos rige:",
    options: [
    "Emiliano Zapata",
    "Francisco I. Madero",
    "Álvaro Obregón",
    "Venustiano Carranza"
    ],
    correctIndex: 3,
    explanation: "Venustiano Carranza promulgó la Constitución de 1917, que sigue vigente. Madero inició la Revolución pero no promulgó la Constitución; Zapata fue líder agrarista y no presidente; Obregón fue presidente después de Carranza, en 1920.",
  },
  {
    id: 1217,
    area: "Geografía",
    text: "El período del maximato en México, caracterizado por gobiernos post-revolucionarios que continuaban bajo las órdenes de un jefe máximo, concluyó durante la presidencia de:",
    options: [
    "Plutarco Elías Calles",
    "Pascual Ortiz Rubio",
    "Lázaro Cárdenas",
    "Emilio Portes Gil"
    ],
    correctIndex: 2,
    explanation: "Lázaro Cárdenas concluyó el maximato al expulsar a Calles del país en 1936, consolidando el poder presidencial. Las otras opciones corresponden a presidentes del período maximato que gobernaron bajo la influencia de Calles, no a quien lo finalizó.",
  },
  {
    id: 1218,
    area: "Geografía",
    text: "Las Leyes de Reforma se promulgaron durante:",
    options: [
    "El gobierno de Benito Juárez",
    "La presidencia de Valentín Gómez Farías",
    "El gobierno de Ignacio Comonfort",
    "La administración de Porfirio Díaz"
    ],
    correctIndex: 0,
    explanation: "Las Leyes de Reforma fueron promulgadas entre 1855 y 1860, principalmente bajo el gobierno de Benito Juárez, como parte del movimiento liberal que separó la Iglesia del Estado. Porfirio Díaz gobernó después, Ignacio Comonfort fue presidente antes de la Guerra de Reforma y Valentín Gómez Farías impulsó reformas previas en 1833, no estas leyes específicas.",
  },
  {
    id: 1219,
    area: "Geografía",
    text: "Durante el siglo XIX, los políticos e intelectuales mexicanos estaban aglutinados en dos grupos, que eran:",
    options: [
    "Monárquicos y Republicanos",
    "Criollos y Peninsulares",
    "Liberales y Conservadores",
    "Federalistas y Centralistas"
    ],
    correctIndex: 2,
    explanation: "La respuesta correcta es Liberales y Conservadores, pues estos dos grupos polarizaron la vida política del México del siglo XIX en torno a reformas, laicidad y centralismo. Federalistas y Centralistas se refieren a un debate sobre la organización territorial, no a la división política principal; Monárquicos y Republicanos fue un conflicto temprano de la independencia; Criollos y Peninsulares es una división social de la época colonial, no del siglo XIX.",
  },
  {
    id: 1220,
    area: "Geografía",
    text: "¿Qué presidente de los Estados Unidos Mexicanos expresó 'Entre los individuos, como entre las naciones, el respeto al derecho ajeno es la paz'?",
    options: [
    "Miguel Hidalgo",
    "Lázaro Cárdenas",
    "Benito Juárez",
    "Porfirio Díaz"
    ],
    correctIndex: 2,
    explanation: "Benito Juárez, presidente de México (1858-1872), pronunció esta frase en un discurso sobre la defensa de la soberanía nacional. Las otras opciones son figuras importantes de la historia de México, pero no se les atribuye esta cita.",
  },
  {
    id: 1221,
    area: "Geografía",
    text: "Este personaje fue el protagonista de la Conquista de México:",
    options: [
    "Francisco Pizarro",
    "Cristóbal Colón",
    "Moctezuma Xocoyotzin",
    "Hernán Cortés"
    ],
    correctIndex: 3,
    explanation: "Hernán Cortés lideró la expedición que culminó en la caída de Tenochtitlan en 1521, siendo el protagonista de la Conquista de México. Colón descubrió América pero no conquistó México; Moctezuma fue el gobernante mexica derrotado; y Pizarro conquistó el Imperio Inca en Sudamérica, no México.",
  },
  {
    id: 1222,
    area: "Geografía",
    text: "Organismo que surge como reacción al establecimiento del bloque socialista; fue firmado en 1948 sobre todo por los países de Europa del Oeste.",
    options: [
    "Comunidad Europea del Carbón y del Acero",
    "OTAN",
    "Plan Marshall",
    "Pacto de Varsovia"
    ],
    correctIndex: 1,
    explanation: "La OTAN (Organización del Tratado del Atlántico Norte) se formó en 1949 como alianza militar defensiva de países occidentales frente al bloque soviético. El Pacto de Varsovia fue la respuesta del bloque socialista, no de Europa del Oeste; la CECA fue un acuerdo económico previo; y el Plan Marshall fue un programa de ayuda económica, no una organización militar.",
  },
  {
    id: 1223,
    area: "Geografía",
    text: "Menciona los tres componentes del espacio geográfico.",
    options: [
    "Urbanos, rurales y naturales",
    "Naturales, sociales y económicos",
    "Locales, regionales y globales",
    "Físicos, biológicos y culturales"
    ],
    correctIndex: 1,
    explanation: "La respuesta correcta es 'Naturales, sociales y económicos' porque el espacio geográfico se integra por elementos del medio natural (relieve, clima), las relaciones sociales (población, cultura) y las actividades económicas (producción, comercio). Las otras opciones son incorrectas: la primera mezcla categorías no estándar, la segunda se refiere a escalas de análisis y la tercera a tipos de paisaje.",
  },
  {
    id: 1224,
    area: "Geografía",
    text: "¿Qué es territorio?",
    options: [
    "Porción de tierra que representa una localidad y tiene límites",
    "Espacio aéreo controlado por un país y sus instituciones",
    "Conjunto de leyes que rigen una nación y su gobierno",
    "Área geográfica con recursos naturales explotables"
    ],
    correctIndex: 0,
    explanation: "Territorio se refiere específicamente a la porción de tierra delimitada que pertenece a una localidad, estado o país. Las opciones incorrectas confunden el concepto con aspectos legales (leyes), físicos (espacio aéreo) o económicos (recursos), que son parte del territorio pero no su definición esencial.",
  },
  {
    id: 1225,
    area: "Geografía",
    text: "Menciona los tres tipos de escalas.",
    options: [
    "Local, nacional y mundial",
    "Continental, regional y local",
    "Político, físico y temático",
    "Pequeña, mediana y grande"
    ],
    correctIndex: 0,
    explanation: "La respuesta correcta es Local, nacional y mundial, que son los tres niveles de análisis espacial en geografía. Las opciones incorrectas se refieren a clasificaciones de regiones (continental, regional, local), tipos de mapas (político, físico, temático) o tamaños de escala gráfica (pequeña, mediana, grande), que no corresponden a los tres tipos de escala geográfica.",
  },
  {
    id: 1226,
    area: "Geografía",
    text: "¿Qué son los paralelos?",
    options: [
    "Círculos imaginarios perpendiculares al eje terrestre, el paralelo que divide a la tierra en dos, por su parte más ancha es el Ecuador",
    "Líneas imaginarias que conectan los polos y miden la longitud de un lugar, siendo el más importante el meridiano de Greenwich.",
    "Líneas curvas que rodean la Tierra de este a oeste y que se utilizan para medir la distancia en grados desde el meridiano de Greenwich.",
    "Círculos imaginarios que dividen la Tierra en husos horarios y determinan la altitud de las regiones, siendo el Ecuador el más extenso."
    ],
    correctIndex: 0,
    explanation: "La respuesta correcta define los paralelos como círculos imaginarios perpendiculares al eje terrestre, con el Ecuador como el principal porque divide la Tierra en hemisferios norte y sur. Las opciones incorrectas confunden los paralelos con meridianos (opción 1), mezclan funciones como husos horarios o altitud (opción 2), o los asocian erróneamente con la medición desde Greenwich, que es propia de los meridianos (opción 3).",
  },
  {
    id: 1227,
    area: "Geografía",
    text: "¿Qué son los meridianos?",
    options: [
    "Son líneas imaginarias que recorren el planeta de un polo a otro, cada 15° del giro del planeta hay uno",
    "Son círculos menores que conectan puntos de igual latitud, usados para medir distancia norte-sur",
    "Son líneas que marcan los husos horarios, cada una representa una hora de diferencia respecto al meridiano de Greenwich",
    "Son líneas imaginarias que dividen la Tierra en hemisferios este y oeste, paralelas al Ecuador"
    ],
    correctIndex: 0,
    explanation: "Los meridianos son semicírculos que van de polo a polo, no paralelos al Ecuador (eso son los paralelos), y su función principal es medir longitud, no latitud ni directamente los husos horarios (aunque se relacionan).",
  },
  {
    id: 1228,
    area: "Geografía",
    text: "¿Qué es latitud?",
    options: [
    "Es la altura sobre el nivel del mar de cualquier punto en la superficie terrestre",
    "Es la distancia en grados desde un punto de la Tierra hasta el meridiano de Greenwich, con un rango de 180°",
    "Es la distancia en grados a la que se encuentra cualquier punto respecto al ecuador en un rango de 90°",
    "Es la distancia angular entre dos puntos cualesquiera medida a lo largo de un meridiano"
    ],
    correctIndex: 2,
    explanation: "La latitud se mide desde el ecuador hacia los polos (0° a 90°), no desde Greenwich (eso es longitud). La altura sobre el nivel del mar es altitud, y la distancia angular entre dos puntos a lo largo de un meridiano depende de ambos puntos, no es una coordenada fija.",
  },
  {
    id: 1229,
    area: "Geografía",
    text: "¿Qué es longitud?",
    options: [
    "Es la línea imaginaria que divide la Tierra en hemisferio norte y sur a 0° de latitud",
    "Es la distancia en grados a la que se encuentra cualquier punto respecto al meridiano de Greenwich de 0° a 180°",
    "Es la distancia en metros desde el nivel del mar hasta la cima de una montaña",
    "Es la distancia en grados desde el ecuador hasta cualquier punto de la Tierra, de 0° a 90°"
    ],
    correctIndex: 1,
    explanation: "La longitud mide la distancia angular al este u oeste del meridiano de Greenwich. Las opciones incorrectas confunden el concepto: una con altitud, otra con el ecuador (latitud 0°) y otra con la definición de latitud.",
  },
  {
    id: 1230,
    area: "Geografía",
    text: "¿Qué son los husos horarios?",
    options: [
    "Son círculos paralelos al ecuador que regulan el cambio de estaciones y la duración del día",
    "Son barras verticales que coinciden con los meridianos y determinan la hora de un lugar",
    "Son líneas imaginarias que dividen la Tierra en franjas de 15 grados de longitud, ajustadas a fronteras políticas",
    "Son zonas horarias establecidas por acuerdos internacionales basadas en la altitud de cada región"
    ],
    correctIndex: 1,
    explanation: "La respuesta correcta define los husos horarios como barras verticales (franjas) que coinciden con los meridianos, estableciendo la hora oficial de cada lugar. Las opciones incorrectas confunden al mencionar paralelos (que son horizontales), estaciones del año o altitud, conceptos no relacionados con la determinación de la hora.",
  },
  {
    id: 1231,
    area: "Geografía",
    text: "¿Qué es un mapa?",
    options: [
    "Son dibujos planos de la superficie terrestre, que representan grandes extensiones de superficie a escala",
    "Representaciones tridimensionales a escala de la superficie terrestre, que incluyen relieve y profundidades oceánicas",
    "Diagramas que muestran únicamente las fronteras políticas y nombres de países o regiones",
    "Fotografías satelitales sin escala que capturan la imagen real de una porción de la Tierra"
    ],
    correctIndex: 0,
    explanation: "La respuesta correcta es precisa porque un mapa es una representación plana, a escala, de la superficie terrestre. Las opciones incorrectas son: la primera describe un globo terráqueo o modelo 3D, no un mapa plano; la segunda se limita a mapas políticos, ignorando otros tipos; la tercera confunde un mapa con una imagen satelital sin escala ni generalización cartográfica.",
  },
  {
    id: 1232,
    area: "Geografía",
    text: "¿Cómo se orienta un mapa?",
    options: [
    "Se emplea un elemento llamado Rosa de los vientos, la cual representa los cuatro puntos cardinales",
    "Se orienta colocando el mapa de modo que el este coincida con la salida del sol",
    "Se identifica primero la latitud y longitud del lugar representado en el mapa",
    "Se utiliza una brújula para alinear el mapa con el norte magnético terrestre"
    ],
    correctIndex: 0,
    explanation: "La rosa de los vientos es el elemento gráfico clásico que indica los puntos cardinales en un mapa, permitiendo orientarlo correctamente. Las opciones incorrectas son verosímiles pero no son el método estándar: usar la brújula es una herramienta de campo, no un elemento del mapa; orientar por el sol es una práctica empírica; y la latitud/longitud son coordenadas, no elementos de orientación visual.",
  },
  {
    id: 1233,
    area: "Geografía",
    text: "¿Qué es simbología?",
    options: [
    "Son las líneas imaginarias que dividen la superficie terrestre en hemisferios",
    "Es la técnica que permite medir distancias reales a partir de un mapa",
    "Son todos los elementos que permiten entender e interpretar el contenido del mapa",
    "Es el conjunto de signos y colores utilizados para representar fenómenos físicos en un plano"
    ],
    correctIndex: 2,
    explanation: "La respuesta correcta define la simbología como los elementos que facilitan la interpretación del mapa (signos, colores, líneas). Los distractores son incorrectos porque: el primero reduce la simbología solo a signos y colores para fenómenos físicos, omitiendo otros elementos; el segundo confunde simbología con líneas imaginarias como paralelos y meridianos; el tercero la asocia erróneamente con la escala, que es una herramienta de medición, no de interpretación.",
  },
  {
    id: 1234,
    area: "Geografía",
    text: "¿Qué es la escala?",
    options: [
    "Es el número de veces que se ha reducido la realidad en el mapa",
    "Es el conjunto de símbolos que explican los elementos del mapa",
    "Es la proporción entre la distancia en el mapa y la distancia real",
    "Es la representación gráfica de la altitud del terreno"
    ],
    correctIndex: 0,
    explanation: "La escala indica cuántas veces se ha reducido la realidad para dibujarla en el mapa (ej. 1:100,000). La primera opción describe la relación pero no que es una reducción, la segunda se refiere a curvas de nivel y la tercera a la leyenda.",
  },
  {
    id: 1235,
    area: "Geografía",
    text: "¿Qué es el sistema de proyecciones?",
    options: [
    "Es la técnica que permite representar la forma real de la Tierra, que es geoide, sobre un mapa sin ninguna deformación",
    "Son los diferentes tipos de escalas numéricas y gráficas que se utilizan para medir distancias reales en un mapa",
    "Es el conjunto de líneas imaginarias como paralelos y meridianos que se trazan sobre un mapa para ubicar puntos geográficos",
    "Son las distintas formas en como se puede representar la superficie terrestre sobre una superficie plana, para disminuir en lo mayor posible la deformación de la imagen"
    ],
    correctIndex: 3,
    explanation: "La respuesta correcta define las proyecciones cartográficas como métodos para representar la superficie curva terrestre en un plano, minimizando deformaciones. Las opciones incorrectas confunden proyecciones con coordenadas geográficas (paralelos/meridianos), escalas (medición de distancias) o afirman erróneamente que evitan toda deformación, lo cual es imposible.",
  },
  {
    id: 1236,
    area: "Geografía",
    text: "Menciona las características del movimiento de rotación.",
    options: [
    "Es el movimiento que realiza la tierra alrededor del sol, tiene una duración de 365 días y su fenómeno más evidente son las estaciones del año",
    "Es el movimiento que realiza la tierra alrededor del sol, tiene una duración de 24 horas y su fenómeno más evidente es el día y la noche",
    "Es el movimiento que realiza la tierra sobre su propio eje, tiene una duración de 24 horas y su fenómeno más evidente es la sucesión de las mareas",
    "Es el movimiento que realiza la tierra, dando una vuelta sobre su propio eje, tiene una duración de 24 horas y su fenómeno más evidente es el día y la noche, así como la forma geoide de la tierra"
    ],
    correctIndex: 3,
    explanation: "La respuesta correcta describe el giro sobre el eje terrestre (24 horas) que causa el día y la noche y la forma geoide. Los distractores confunden rotación con traslación (órbita solar y estaciones), asignan mareas (causadas por la Luna) a la rotación, o mezclan duración del día con órbita solar.",
  },
  {
    id: 1237,
    area: "Geografía",
    text: "Menciona las características del movimiento de traslación.",
    options: [
    "Es el movimiento que realiza la tierra girando sobre su propio eje, tiene una duración de 24 horas y su fenómeno más evidente es la sucesión del día y la noche",
    "Es el movimiento que realiza la tierra alrededor de la luna en órbita circular, tiene una duración de 28 días y su fenómeno más evidente son las fases lunares",
    "Es el movimiento que realiza la tierra alrededor del sol en órbita circular, tiene una duración de 365 días y su fenómeno más evidente es la variación de la duración del día y la noche",
    "Es el movimiento que realiza la tierra dando una vuelta alrededor del sol en orbita elíptica, tiene una duración de 365 días y su fenómeno más evidente es el cambio de las estaciones del año"
    ],
    correctIndex: 3,
    explanation: "La respuesta correcta describe el movimiento de traslación terrestre: órbita elíptica alrededor del sol, duración de 365 días y estaciones del año. Las opciones incorrectas confunden traslación con rotación (eje propio, 24 horas, día/noche), con un ciclo lunar (alrededor de la luna, 28 días) o presentan una órbita circular incorrecta, ya que la traslación es elíptica.",
  },
  {
    id: 1238,
    area: "Geografía",
    text: "Menciona las capas de la tierra.",
    options: [
    "Núcleo interno y externo, manto interno y externo y corteza terrestre o litósfera",
    "Núcleo interno y externo, manto superior e inferior y corteza oceánica y continental",
    "Corteza, manto, núcleo y capa de ozono",
    "Núcleo, astenosfera, litosfera y mesosfera"
    ],
    correctIndex: 0,
    explanation: "La respuesta correcta divide la Tierra en núcleo interno y externo, manto interno y externo, y corteza (litósfera). Las alternativas confunden términos: la primera mezcla corteza oceánica/continental (subcapas) con las principales; la segunda omite la división del núcleo y manto; la tercera incluye la capa de ozono, que es atmosférica, no geosférica.",
  },
  {
    id: 1239,
    area: "Geografía",
    text: "¿Cuál es la placa tectónica más importante para el territorio mexicano?",
    options: [
    "Placa de Cocos",
    "Placa del Caribe",
    "Placa Norteamericana",
    "Placa del Pacífico"
    ],
    correctIndex: 2,
    explanation: "La Placa Norteamericana es la correcta porque la mayor parte del territorio mexicano se asienta sobre ella. Las otras placas (Pacífico, Cocos y Caribe) también influyen en la sismicidad del país, pero solo cubren regiones costeras o peninsulares, no la masa continental principal.",
  },
  {
    id: 1240,
    area: "Geografía",
    text: "¿Qué es una roca?",
    options: [
    "Son masas de minerales que se forman exclusivamente en el interior del planeta por presión y temperatura",
    "Son materiales de la corteza terrestre formadas por varios minerales o por uno solo",
    "Son cuerpos sólidos de origen orgánico o inorgánico que se acumulan en la superficie terrestre",
    "Son fragmentos de la corteza terrestre que se desprenden por erosión o meteorización"
    ],
    correctIndex: 1,
    explanation: "La respuesta correcta define a la roca como material de la corteza terrestre compuesto por uno o varios minerales. Las opciones incorrectas son plausibles pero erróneas porque: la primera solo describe fragmentos erosionados (no toda roca lo es), la segunda excluye rocas formadas en la superficie (como las sedimentarias), y la tercera incluye materiales orgánicos sueltos (como el humus) que no son rocas.",
  },
  {
    id: 1241,
    area: "Geografía",
    text: "¿Qué son las rocas ígneas?",
    options: [
    "Son rocas que se forman exclusivamente en el fondo del océano por procesos químicos",
    "Son rocas de origen volcánico las cuales se enfrían dentro o fuera de la corteza terrestre",
    "Son rocas que se originan por la transformación de otras rocas debido al calor y la presión",
    "Son rocas formadas por la acumulación de sedimentos compactados en capas"
    ],
    correctIndex: 1,
    explanation: "La respuesta correcta es que las rocas ígneas se originan por el enfriamiento del magma, ya sea dentro o fuera de la corteza terrestre. Las opciones incorrectas describen, respectivamente, a las rocas sedimentarias, metamórficas y a un tipo específico de roca sedimentaria química, no a las ígneas.",
  },
  {
    id: 1242,
    area: "Geografía",
    text: "¿Qué son las rocas sedimentarias?",
    options: [
    "Son rocas que se originan por la solidificación del magma volcánico en la superficie terrestre",
    "Son rocas que se formaron por la descomposición de vegetales o animales muertos",
    "Son rocas que se forman por la transformación de otras rocas debido a altas presiones y temperaturas",
    "Son rocas que se formaron por la acumulación y compactación de fragmentos de otras rocas"
    ],
    correctIndex: 1,
    explanation: "Las rocas sedimentarias se forman por la acumulación y compactación de sedimentos, que pueden incluir restos orgánicos de vegetales o animales, como en el carbón o la caliza. Las opciones incorrectas describen rocas clásticas (fragmentos de otras rocas), ígneas (magma) y metamórficas (transformación por presión y temperatura), respectivamente.",
  },
  {
    id: 1243,
    area: "Geografía",
    text: "¿Cuál es la rama de la Geografía que estudia las aguas continentales y oceánicas?",
    options: [
    "Geomorfología",
    "Limnología",
    "Oceanografía",
    "Hidrografía"
    ],
    correctIndex: 3,
    explanation: "La hidrografía es la rama de la geografía que estudia la distribución, propiedades y dinámica de las aguas en la superficie terrestre, tanto continentales (ríos, lagos) como oceánicas. La limnología se enfoca solo en aguas continentales (lagos y ríos), la oceanografía en mares y océanos, y la geomorfología en el relieve terrestre.",
  },
  {
    id: 1244,
    area: "Geografía",
    text: "¿Qué es un río?",
    options: [
    "Son escurrimientos de agua que van desde las montañas hacia el mar",
    "Son masas de agua congelada que fluyen lentamente desde los glaciares",
    "Son corrientes de agua subterránea que emergen en zonas de baja altitud",
    "Son cuerpos de agua estancada que se forman en depresiones del terreno"
    ],
    correctIndex: 0,
    explanation: "La respuesta correcta define un río como un escurrimiento superficial de agua que nace en zonas altas y desemboca en el mar, a diferencia de lagos (agua estancada), manantiales (agua subterránea) o glaciares (agua congelada).",
  },
  {
    id: 1245,
    area: "Geografía",
    text: "Menciona el nombre de los cinco océanos que existen.",
    options: [
    "Pacífico, atlántico, índico, antártico, mediterráneo",
    "Pacífico, atlántico, índico, ártico, caspio",
    "Pacífico, atlántico, índico, ártico, antártico",
    "Pacífico, atlántico, índico, ártico, caribe"
    ],
    correctIndex: 2,
    explanation: "La respuesta correcta es Pacífico, Atlántico, Índico, Ártico y Antártico, que son los cinco océanos reconocidos oficialmente. Los distractores incluyen mares como el Caribe, Mediterráneo o Caspio, que son cuerpos de agua más pequeños y no tienen la categoría de océano.",
  },
  {
    id: 1246,
    area: "Geografía",
    text: "¿Qué es la atmósfera?",
    options: [
    "Es la capa de roca fundida que se encuentra bajo la litosfera y genera el campo magnético",
    "Es la capa sólida de la corteza terrestre donde se asientan los continentes",
    "Es la capa gaseosa que rodea nuestro planeta, permitiendo el desarrollo de la vida",
    "Es la capa líquida de los océanos que cubre la mayor parte de la superficie del planeta"
    ],
    correctIndex: 2,
    explanation: "La atmósfera es la capa gaseosa que envuelve la Tierra, compuesta principalmente por nitrógeno y oxígeno, y es esencial para la vida al proporcionar aire, proteger de la radiación solar y regular la temperatura. Las opciones incorrectas describen, respectivamente, la litosfera, la hidrosfera y el manto o núcleo externo, que son otras capas de la geósfera.",
  },
  {
    id: 1247,
    area: "Geografía",
    text: "Menciona el nombre de las capas de la atmósfera.",
    options: [
    "Troposfera, Estratosfera, Mesosfera, Termosfera, Exosfera",
    "Troposfera, Estratosfera, Ionosfera, Magnetosfera, Heliosfera",
    "Litosfera, Hidrosfera, Biosfera, Atmósfera, Ionosfera",
    "Corteza, Manto, Núcleo externo, Núcleo interno, Astenosfera"
    ],
    correctIndex: 0,
    explanation: "La respuesta correcta enumera las capas de la atmósfera terrestre según su composición y temperatura: Troposfera (más cercana), Estratosfera, Mesosfera, Termosfera y Exosfera. Las opciones incorrectas mezclan capas de otras geósferas (como litosfera o corteza), términos de la estructura interna de la Tierra, o conceptos astronómicos como magnetosfera o heliosfera, que no forman parte de la atmósfera terrestre.",
  },
  {
    id: 1248,
    area: "Geografía",
    text: "¿Qué es presión atmosférica?",
    options: [
    "Es el peso que ejerce la atmósfera sobre la superficie de la tierra",
    "Es la cantidad de oxígeno presente en la atmósfera terrestre",
    "Es la temperatura promedio del aire en la superficie del planeta",
    "Es la fuerza que ejerce el viento al chocar contra las montañas"
    ],
    correctIndex: 0,
    explanation: "La presión atmosférica se define como el peso de la columna de aire sobre un punto, por lo que la respuesta correcta es la que menciona el peso de la atmósfera sobre la superficie. Las opciones incorrectas confunden este concepto con fenómenos eólicos, composición del aire o temperatura, que son temas distintos dentro de la geografía física.",
  },
  {
    id: 1249,
    area: "Geografía",
    text: "¿Qué clima es Aw?",
    options: [
    "Clima seco desértico con lluvias escasas",
    "Clima templado con lluvias todo el año",
    "Clima cálido o tropical con lluvias en verano",
    "Clima frío de alta montaña"
    ],
    correctIndex: 2,
    explanation: "Aw es un clima cálido o tropical con lluvias en verano, según la clasificación de Köppen, donde 'A' indica tropical y 'w' invierno seco. Las opciones incorrectas describen otros tipos climáticos (templado, frío o seco) que no corresponden al código Aw.",
  },
  {
    id: 1250,
    area: "Geografía",
    text: "¿Qué es una región natural?",
    options: [
    "Es una división política de un país, como los estados o provincias, que comparten un mismo gobierno",
    "Es una porción de la superficie terrestre que tiene características propias que la distinguen de otras, como puede ser su clima, su tipo de suelo, flora, fauna, etc.",
    "Es una zona determinada exclusivamente por la altitud sobre el nivel del mar, como las llanuras o montañas",
    "Es un área donde solo existe un tipo de clima y vegetación, sin variaciones internas"
    ],
    correctIndex: 1,
    explanation: "La respuesta correcta define región natural por sus elementos físicos y biológicos homogéneos (clima, suelo, flora, fauna). Las opciones incorrectas confunden región natural con división política, con uniformidad absoluta o con un solo factor geográfico (altitud), omitiendo la interacción de múltiples características.",
  },
  {
    id: 1251,
    area: "Geografía",
    text: "¿Qué son los componentes del espacio geográfico?",
    options: [
    "Son los elementos de la naturaleza, como ríos, minas, bosques, tipos de suelo, climas, flora y fauna, todos estos componentes determinan las actividades económicas de cada región",
    "Son los fenómenos atmosféricos y climáticos que afectan la superficie terrestre, como huracanes, sequías y frentes fríos",
    "Son las divisiones políticas y administrativas que organizan el territorio, como estados, municipios y regiones económicas",
    "Son los patrones de asentamiento humano y las infraestructuras construidas, como ciudades, carreteras y presas"
    ],
    correctIndex: 0,
    explanation: "La respuesta correcta se enfoca en los elementos naturales del espacio geográfico (ríos, bosques, clima, etc.) que influyen directamente en las actividades económicas. Las opciones incorrectas confunden estos componentes con divisiones políticas, fenómenos climáticos extremos o infraestructura humana, que son aspectos derivados o distintos del concepto central.",
  },
  {
    id: 1252,
    area: "Geografía",
    text: "¿Cuáles son los dos tipos de regiones?",
    options: [
    "Climática y vegetal",
    "Urbana y rural",
    "Natural y funcional",
    "Física y política"
    ],
    correctIndex: 2,
    explanation: "Las regiones se clasifican en naturales (definidas por elementos físicos como relieve o clima) y funcionales (organizadas en torno a una actividad humana, como una ciudad). Las opciones incorrectas mezclan otras clasificaciones geográficas: física/política es una división de mapas, urbana/rural es un tipo de asentamiento, y climática/vegetal son subtipos de regiones naturales.",
  },
  {
    id: 1253,
    area: "Geografía",
    text: "¿Cuáles son los puntos cardinales?",
    options: [
    "Norte, sur, este y subeste",
    "Oriente, poniente, norte y sur",
    "Norte, sur, este y oeste",
    "Norte, sur, este y noreste"
    ],
    correctIndex: 2,
    explanation: "Los puntos cardinales son las cuatro direcciones principales de la rosa de los vientos: Norte, Sur, Este y Oeste. El noreste y el subeste son puntos colaterales (intermedios), no cardinales; 'Oriente y poniente' son sinónimos de este y oeste, pero la nomenclatura estándar es la correcta.",
  },
  {
    id: 1254,
    area: "Geografía",
    text: "¿Qué es altitud?",
    options: [
    "Es la distancia vertical entre el nivel del mar y cualquier punto de la superficie terrestre",
    "Es la distancia vertical entre el nivel del mar y el centro de la Tierra",
    "Es la distancia horizontal desde un punto en la superficie hasta el meridiano de Greenwich",
    "Es la inclinación de un terreno respecto al nivel del mar"
    ],
    correctIndex: 0,
    explanation: "La altitud se define como la distancia vertical desde el nivel del mar hasta un punto en la superficie terrestre, siendo clave en geografía para describir relieves. Las opciones incorrectas confunden altitud con profundidad geocéntrica, longitud geográfica o pendiente, conceptos distintos en geografía.",
  },
  {
    id: 1255,
    area: "Geografía",
    text: "¿Cuántos husos horarios existen?",
    options: [
    "48, que dividen cada meridiano en dos husos horarios",
    "36, que incluyen los husos de 10 grados para mayor precisión",
    "24, los cuales coinciden con los meridianos",
    "12, que corresponden a los husos de 30 grados cada uno"
    ],
    correctIndex: 2,
    explanation: "La respuesta correcta es 24 porque la Tierra gira 360 grados en 24 horas, y cada huso horario abarca 15 grados de longitud (360/24). Las opciones incorrectas confunden el número de husos con divisiones de 30, 10 o 7.5 grados, pero el estándar internacional establece 24 husos principales basados en los meridianos.",
  },
  {
    id: 1256,
    area: "Geografía",
    text: "¿Cuáles son los husos horarios donde se encuentra el territorio mexicano?",
    options: [
    "90°, 105° y 120° W (oeste)",
    "75°, 90° y 105° W (oeste)",
    "100°, 110° y 120° W (oeste)",
    "90°, 100° y 110° W (oeste)"
    ],
    correctIndex: 0,
    explanation: "México abarca oficialmente los husos horarios de 90°, 105° y 120° Oeste (UTC-6, UTC-7 y UTC-8). Las opciones incorrectas confunden los meridianos: la primera incluye 75° (que corresponde al este de EE.UU.), la segunda usa 100° (no es huso oficial) y la tercera omite el 120° e incluye 100°.",
  },
  {
    id: 1257,
    area: "Geografía",
    text: "¿Qué es el movimiento galáctico?",
    options: [
    "Es el desplazamiento de las estrellas dentro de una galaxia debido a la rotación diferencial, completando un ciclo cada 200 millones de años",
    "Es el movimiento de traslación de la Tierra alrededor del Sol, que junto con el sistema solar se desplaza hacia la constelación de Hércules a 20 km/s",
    "Es el movimiento que realiza todo nuestro sistema solar, dándole una vuelta a la galaxia, tiene una duración de 250 mil años",
    "Es el movimiento aparente de las galaxias en el universo debido a la expansión cósmica, con una duración estimada de 13.8 mil millones de años"
    ],
    correctIndex: 2,
    explanation: "La respuesta correcta se refiere al movimiento de todo el sistema solar orbitando el centro de la Vía Láctea, que dura aproximadamente 250 mil años. Las opciones incorrectas confunden este concepto con la rotación galáctica general, el movimiento del Sol hacia Hércules (que es el movimiento peculiar solar) o la expansión del universo (Ley de Hubble).",
  },
  {
    id: 1258,
    area: "Geografía",
    text: "¿Cómo se llama nuestra galaxia?",
    options: [
    "Sistema Solar",
    "Cúmulo de Virgo",
    "Vía láctea",
    "Andrómeda"
    ],
    correctIndex: 2,
    explanation: "La Vía Láctea es nuestra galaxia, un conjunto de estrellas, gas y polvo que incluye al Sistema Solar. Andrómeda es otra galaxia vecina, el Cúmulo de Virgo es un grupo de galaxias, y el Sistema Solar es solo nuestro sistema planetario dentro de la galaxia.",
  },
  {
    id: 1259,
    area: "Geografía",
    text: "¿Qué nos dice la teoría de la deriva continental?",
    options: [
    "La deriva continental propone que los continentes se desplazan constantemente sobre un manto de magma líquido en todas direcciones sin un patrón definido",
    "La teoría explica que los continentes se mueven debido a la rotación de la Tierra y la fuerza centrífuga generada en el ecuador",
    "Los continentes estaban integrados en uno solo al que llamaron Pangea, este continente se fue fracturando en los continentes que conocemos actualmente",
    "Según esta teoría, los continentes se formaron por la acumulación de sedimentos en los océanos que emergieron a la superficie terrestre"
    ],
    correctIndex: 2,
    explanation: "La teoría de la deriva continental, propuesta por Wegener, sostiene que los continentes estuvieron unidos en Pangea y se fragmentaron. Las opciones incorrectas confunden el movimiento con procesos sin evidencia (como sedimentos o rotación) o describen un desplazamiento caótico, cuando en realidad la deriva es un proceso lento y con dirección, explicado por la tectónica de placas.",
  },
  {
    id: 1260,
    area: "Geografía",
    text: "Menciona las siete placas tectónicas mayores.",
    options: [
    "Norteamericana, suramericana, Euroasiática, africana, Indo australiana, Pacífico, Antártida",
    "Norteamericana, suramericana, Euroasiática, africana, Arábiga, Indoaustraliana, Pacífico",
    "Norteamericana, suramericana, Euroasiática, africana, Pacífico, Caribe, Antártida",
    "Norteamericana, suramericana, Euroasiática, africana, Indoaustraliana, Pacífico, Nazca"
    ],
    correctIndex: 0,
    explanation: "La respuesta correcta enumera las siete placas mayores reconocidas por la tectónica de placas, que son las que cubren la mayor parte de la superficie terrestre. Las opciones incorrectas incluyen placas secundarias (Caribe, Nazca, Arábiga) que, aunque reales, son de menor tamaño y no forman parte de las siete mayores.",
  },
  {
    id: 1261,
    area: "Geografía",
    text: "¿Qué es una montaña?",
    options: [
    "Son formas del relieve que tienen figura de pico",
    "Son formaciones rocosas que se originan por la erosión del viento",
    "Son las partes más altas de la corteza terrestre con forma de meseta",
    "Son las elevaciones del terreno con cima plana y laderas inclinadas"
    ],
    correctIndex: 0,
    explanation: "La respuesta correcta es correcta porque una montaña se caracteriza por su forma de pico o cumbre puntiaguda. Las opciones incorrectas describen mesetas, formaciones eólicas o mesetas elevadas, que son accidentes geográficos diferentes.",
  },
  {
    id: 1262,
    area: "Geografía",
    text: "¿Qué es un plegamiento?",
    options: [
    "Se producen por el choque de placas, las cuales se van plegando una sobre otra",
    "Ocurre cuando el magma asciende y empuja la corteza terrestre, formando ondulaciones en el relieve",
    "Es el resultado de la erosión diferencial que desgasta las capas superficiales y expone las más resistentes",
    "Es el proceso de deformación de las rocas por la presión de los sedimentos acumulados en las cuencas oceánicas"
    ],
    correctIndex: 0,
    explanation: "La respuesta correcta describe el plegamiento como la deformación de la corteza terrestre por compresión tectónica, donde las placas chocan y pliegan las capas de roca. Las opciones incorrectas confunden el proceso con sedimentación, vulcanismo o erosión, que no generan pliegues por compresión de placas.",
  },
  {
    id: 1263,
    area: "Geografía",
    text: "¿Qué es una falla?",
    options: [
    "Es cuando las placas tectónicas se separan una de otra",
    "Es cuando una placa se hunde debajo de otra",
    "Es cuando dos placas chocan y forman montañas",
    "Es cuando alguna placa se desliza de un lado a otro"
    ],
    correctIndex: 3,
    explanation: "Una falla geológica es una fractura en la corteza terrestre donde los bloques rocosos se deslizan lateralmente entre sí, como en la falla de San Andrés. Las opciones incorrectas describen otros límites de placas: divergente (separación), convergente (subducción o colisión) y convergente (orogénesis), que no corresponden al movimiento de deslizamiento lateral característico de una falla.",
  },
  {
    id: 1264,
    area: "Geografía",
    text: "¿Cómo se llama el sistema montañoso en México formado por volcanes?",
    options: [
    "Eje volcánico transversal",
    "Sierra Madre Oriental",
    "Sistema Volcánico de Norteamérica",
    "Sierra Madre Occidental"
    ],
    correctIndex: 0,
    explanation: "El Eje Volcánico Transversal es la cadena montañosa que cruza el centro de México de oeste a este, formada por volcanes activos e inactivos. La Sierra Madre Occidental y Oriental son sierras plegadas no volcánicas, y 'Sistema Volcánico de Norteamérica' es un nombre genérico que no corresponde a la región mexicana.",
  },
  {
    id: 1265,
    area: "Geografía",
    text: "¿Qué es una cuenca?",
    options: [
    "Es la depresión del terreno donde se almacena agua de lluvia",
    "Es el área de terreno que drena hacia un río o lago",
    "Es la acumulación de agua subterránea en un acuífero",
    "Es el espacio que ocupa un río"
    ],
    correctIndex: 3,
    explanation: "La cuenca es el territorio cuyas aguas fluyen hacia un mismo río, lago o mar; la opción correcta se refiere al espacio que ocupa el río, que es parte de la cuenca. Las otras opciones confunden con acuíferos, drenaje superficial o depresiones, que son conceptos diferentes en geografía.",
  },
  {
    id: 1266,
    area: "Geografía",
    text: "¿Qué es un meandro?",
    options: [
    "Es una corriente de agua subterránea que emerge en la superficie formando un manantial",
    "Es una curvatura en el trayecto del río, que se forma cuando el río es muy largo",
    "Es una elevación del terreno que separa dos cuencas hidrográficas adyacentes",
    "Es un tipo de lago formado por la sedimentación de materiales en la desembocadura de un río"
    ],
    correctIndex: 1,
    explanation: "Un meandro es una curva pronunciada en el cauce de un río, típica de ríos con poca pendiente y largo recorrido. Las opciones incorrectas describen un delta (depósito en desembocadura), un parteaguas (divisoria de cuencas) y un manantial (afloramiento de agua subterránea), conceptos geográficos distintos.",
  },
  {
    id: 1267,
    area: "Geografía",
    text: "¿Qué es la atmósfera?",
    options: [
    "Es la zona de la Tierra donde se concentran todos los seres vivos",
    "Es el conjunto de océanos y mares que cubren la superficie del planeta",
    "Es la capa sólida de la corteza terrestre que sostiene los continentes",
    "Es la capa gaseosa de nuestro planeta, que permite el desarrollo de la vida"
    ],
    correctIndex: 3,
    explanation: "La atmósfera es la capa gaseosa que envuelve la Tierra, esencial para la vida al proporcionar oxígeno y proteger de radiaciones. Las opciones incorrectas se refieren a la litosfera (corteza sólida), la hidrosfera (masas de agua) y la biosfera (zona de vida), que son otras capas o esferas terrestres, no la gaseosa.",
  },
  {
    id: 1268,
    area: "Geografía",
    text: "¿Qué porcentaje de nitrógeno y oxígeno hay en la atmósfera?",
    options: [
    "Nitrógeno 80%, oxígeno 19%",
    "Nitrógeno 70%, oxígeno 29%",
    "Nitrógeno 75%, oxígeno 24%",
    "Nitrógeno 78%, oxígeno 21%"
    ],
    correctIndex: 3,
    explanation: "La respuesta correcta es nitrógeno 78% y oxígeno 21%, proporciones que se mantienen estables en la troposfera. Las alternativas fallan al alterar estos valores: 70/29, 80/19 y 75/24 no coinciden con la composición real, ya que el nitrógeno siempre es cercano al 78% y el oxígeno al 21%.",
  },
  {
    id: 1269,
    area: "Geografía",
    text: "¿Qué son los vientos alisios?",
    options: [
    "Son vientos que se originan en los océanos y provocan huracanes",
    "Son vientos calientes que van del ecuador a los polos",
    "Son vientos fríos que soplan de los polos hacia el ecuador",
    "Son corrientes de aire que se desplazan de este a oeste en latitudes medias"
    ],
    correctIndex: 1,
    explanation: "Los vientos alisios son vientos cálidos y constantes que soplan desde las zonas de alta presión subtropical hacia el ecuador (bajas presiones), moviéndose de este a oeste. Las opciones incorrectas confunden su dirección (no van de polos a ecuador), su temperatura (no son fríos) o su ubicación (no son de latitudes medias ni provocan huracanes directamente).",
  },
  {
    id: 1270,
    area: "Geografía",
    text: "¿Qué son los vientos contralisios?",
    options: [
    "Son vientos estacionales que cambian de dirección según el monzón",
    "Son vientos cálidos que van del ecuador a los polos",
    "Son vientos húmedos que soplan del océano hacia los continentes",
    "Son vientos fríos que van de los polos al ecuador"
    ],
    correctIndex: 3,
    explanation: "Los vientos contralisios son corrientes de aire frío y seco que se desplazan desde las zonas polares hacia el ecuador, completando el ciclo de circulación atmosférica. Las opciones incorrectas describen otros tipos de vientos: la primera se refiere a los vientos alisios (aunque invertidos), la segunda a los monzones, y la tercera a los vientos marítimos o brisas costeras, que no corresponden al patrón global de los contralisios.",
  },
  {
    id: 1271,
    area: "Geografía",
    text: "¿Qué clima es Aw?",
    options: [
    "Clima seco con lluvias escasas",
    "Clima cálido con lluvias en verano",
    "Clima frío con lluvias en invierno",
    "Clima templado con lluvias todo el año"
    ],
    correctIndex: 1,
    explanation: "Aw es la clasificación de Köppen para clima cálido con lluvias en verano, típico de sabanas tropicales. Las opciones incorrectas mezclan otros grupos climáticos: C (templado), D (frío) y B (seco), que no corresponden a la letra A (cálido).",
  },
  {
    id: 1272,
    area: "Geografía",
    text: "Características de la selva.",
    options: [
    "Clima cálido, llueve todo el año, tiene árboles muy altos, hay reptiles, monos, insectos, aves",
    "Clima seco, lluvias escasas, vegetación de matorrales y cactus, hay coyotes, serpientes y lagartijas",
    "Clima templado, llueve en verano, tiene árboles de hoja caduca, hay osos, venados y ardillas",
    "Clima frío, nieve en invierno, árboles de coníferas, hay lobos, alces y linces"
    ],
    correctIndex: 0,
    explanation: "La selva se caracteriza por clima cálido y lluvias constantes durante todo el año, lo que permite árboles muy altos y una gran diversidad de fauna como reptiles, monos, insectos y aves. Las opciones incorrectas describen ecosistemas diferentes: bosque templado, desierto y taiga, respectivamente, que no corresponden a las condiciones de la selva.",
  },
  {
    id: 1273,
    area: "Geografía",
    text: "Características de la sabana.",
    options: [
    "Clima templado con lluvias todo el año, bosques densos de coníferas, osos y lobos",
    "Clima frío con nieve en invierno, matorrales bajos y arbustos, renos y zorros árticos",
    "Clima seco con lluvias escasas todo el año, cactus y matorrales espinosos, serpientes y coyotes",
    "Clima cálido con lluvias todo en verano, pastos altos y árboles dispersos, tigres, leones, elefantes"
    ],
    correctIndex: 3,
    explanation: "La sabana es un ecosistema de clima cálido con estación seca y lluviosa marcada, donde predominan pastos altos y árboles dispersos como las acacias, y alberga grandes herbívoros como elefantes y depredadores como leones. Las otras opciones describen incorrectamente el bioma de bosque templado, tundra y desierto, respectivamente.",
  },
  {
    id: 1274,
    area: "Geografía",
    text: "Características del desierto.",
    options: [
    "Clima templado, lluvias moderadas, bosques de pinos, venados, osos, lagos",
    "Clima tropical, lluvias intensas, selvas densas, jaguares, monos, ríos caudalosos",
    "Clima frío, nieve constante, glaciares, focas, osos polares, musgos",
    "Clima seco, días muy cálidos y noches muy frías, camellos, pumas, coyotes, cactus, oasis"
    ],
    correctIndex: 3,
    explanation: "La respuesta correcta describe el desierto con su clima seco y extremo térmico, así como su flora y fauna adaptadas (cactus, camellos). Las opciones incorrectas corresponden a otros biomas: templado (bosque), frío (tundra/polar) y tropical (selva), que no comparten las características áridas del desierto.",
  },
  {
    id: 1275,
    area: "Geografía",
    text: "¿Qué son los recursos naturales?",
    options: [
    "Son los bienes que se encuentran exclusivamente en el subsuelo mexicano",
    "Son todos los bienes, materiales y servicios que nos proporciona la naturaleza",
    "Son los elementos creados por el hombre para satisfacer sus necesidades básicas",
    "Son aquellos que el ser humano transforma para obtener energía"
    ],
    correctIndex: 1,
    explanation: "La respuesta correcta define los recursos naturales como bienes, materiales y servicios que proporciona la naturaleza sin intervención humana directa. Las opciones incorrectas confunden el concepto al referirse a transformación humana, ubicación geográfica limitada o creación artificial.",
  },
  {
    id: 1276,
    area: "Geografía",
    text: "¿Qué son los recursos renovables?",
    options: [
    "Son aquellos que se pueden reciclar o reutilizar después de su uso, como el vidrio y el plástico",
    "Son aquellos que pueden ser utilizados sin límite, como la energía solar y el viento",
    "Son aquellos que se encuentran en grandes cantidades en la naturaleza y no se agotan",
    "Son aquellos que tienen un tiempo corto para regenerarse, como los bosques, plantas, animales"
    ],
    correctIndex: 3,
    explanation: "La respuesta correcta es correcta porque los recursos renovables se regeneran en un periodo corto (ej. bosques, animales), a diferencia de los no renovables. Las alternativas incorrectas confunden renovabilidad con inagotabilidad (solar), abundancia (minerales) o reciclaje (vidrio), que son conceptos distintos en Geografía.",
  },
  {
    id: 1277,
    area: "Geografía",
    text: "¿Qué son los recursos no renovables?",
    options: [
    "Son aquellos que provienen de la actividad volcánica y se forman en pocos años, como el azufre y las rocas ígneas.",
    "Son aquellos que se regeneran de forma natural en un corto periodo de tiempo, como el agua y el viento.",
    "Son aquellos que se encuentran en la superficie terrestre y pueden ser cultivados por el ser humano, como la madera y los alimentos.",
    "Son aquellos que no se regeneran o tardan mucho en hacerlo, como el petróleo, gas natural"
    ],
    correctIndex: 3,
    explanation: "Los recursos no renovables se agotan con su uso y su formación tarda millones de años, como el petróleo y el gas. Las opciones incorrectas describen recursos renovables (cultivos, agua, viento) o procesos geológicos rápidos que no corresponden a la definición.",
  },
  {
    id: 1278,
    area: "Geografía",
    text: "¿Qué son los recursos biodegradables?",
    options: [
    "Son los materiales que provienen de la corteza terrestre y se descomponen de forma natural sin intervención humana",
    "Son los recursos que pueden ser reciclados mediante procesos industriales para generar nuevos productos útiles",
    "Son aquellos elementos o materiales que tienen la capacidad de asimilarse rápidamente al medio, no contaminan, ni se vuelven basura",
    "Son aquellos que se obtienen de fuentes naturales como plantas y animales, y pueden regenerarse por sí mismos en un tiempo corto"
    ],
    correctIndex: 2,
    explanation: "La respuesta correcta se enfoca en la capacidad de asimilarse rápidamente al medio sin generar contaminación ni basura, clave en Geografía ambiental. Las opciones incorrectas confunden biodegradabilidad con renovabilidad (primera), con procesos geológicos naturales (segunda) o con reciclaje industrial (tercera), que no garantizan descomposición rápida ni ausencia de contaminación.",
  },
  {
    id: 1279,
    area: "Geografía",
    text: "¿Qué son los recursos no biodegradables?",
    options: [
    "Son aquellos materiales que tardan mucho tiempo en asimilarse al medio, generan basura y son contaminantes, ejemplo el plástico, unicel, pilas",
    "Son aquellos que pueden descomponerse naturalmente en un corto periodo de tiempo, como la madera, el papel o los restos de comida",
    "Son materiales que provienen de fuentes naturales y se reciclan fácilmente sin generar contaminación, como el vidrio o el aluminio",
    "Son recursos que se agotan al ser utilizados y no pueden regenerarse a escala humana, como el petróleo o el carbón mineral"
    ],
    correctIndex: 0,
    explanation: "La respuesta correcta define a los recursos no biodegradables como aquellos que tardan mucho en descomponerse y generan contaminación. Las opciones incorrectas describen, respectivamente, a los biodegradables, a los no renovables y a los reciclables, conceptos distintos dentro de la geografía de los recursos.",
  },
  {
    id: 1280,
    area: "Geografía",
    text: "Características de los minerales metálicos:",
    options: [
    "Son maleables, dúctiles y se encuentran en estado líquido a temperatura ambiente (mercurio, galio, cesio)",
    "Brillo propio, son conductores de calor y electricidad (hierro, cobre, aluminio, oro, plata)",
    "Tienen brillo metálico, son malos conductores de electricidad y se usan en aleaciones (tungsteno, titanio, manganeso)",
    "No tienen brillo propio, son opacos y se usan en joyería (piedras preciosas como diamante, rubí, zafiro)"
    ],
    correctIndex: 1,
    explanation: "La respuesta correcta es correcta porque los minerales metálicos poseen brillo propio y alta conductividad térmica y eléctrica, como el hierro o el cobre. Las alternativas fallan al atribuirles opacidad (propiedad de no metales), estado líquido (solo excepciones puntuales) o baja conductividad (contradice su naturaleza metálica).",
  },
  {
    id: 1281,
    area: "Geografía",
    text: "Características de los minerales NO metálicos:",
    options: [
    "Son sólidos cristalinos que se disuelven en agua, forman yacimientos en rocas ígneas",
    "Presentan brillo metálico, son buenos conductores térmicos (hierro, aluminio, oro)",
    "No tienen brillo propio, no conducen calor ni electricidad (azufre, sal, mármol)",
    "Tienen alta densidad y maleabilidad, se usan en aleaciones (cobre, zinc, plomo)"
    ],
    correctIndex: 2,
    explanation: "Los minerales no metálicos carecen de brillo propio y no conducen calor ni electricidad, a diferencia de los metálicos. Las opciones incorrectas describen propiedades típicas de minerales metálicos (brillo, conductividad, maleabilidad) o características no exclusivas de no metálicos.",
  },
  {
    id: 1282,
    area: "Geografía",
    text: "Menciona ejemplos de recursos energéticos fósiles.",
    options: [
    "Biomasa, biodiesel, etanol, biogas",
    "Energía hidroeléctrica, mareomotriz, undimotriz",
    "Petróleo, gas natural, carbón, hulla, turba",
    "Uranio, plutonio, torio, minerales radiactivos"
    ],
    correctIndex: 2,
    explanation: "Los recursos energéticos fósiles provienen de la descomposición de materia orgánica durante millones de años; el petróleo, gas natural, carbón, hulla y turba son ejemplos clásicos. Las opciones incorrectas mencionan combustibles nucleares (uranio, plutonio), energías renovables (hidroeléctrica, mareomotriz) o biocombustibles (biomasa, biodiesel), que no son fósiles.",
  },
  {
    id: 1283,
    area: "Geografía",
    text: "¿Qué país es el mayor productor mundial de petróleo?",
    options: [
    "Irak",
    "Rusia",
    "Arabia Saudita",
    "Estados Unidos"
    ],
    correctIndex: 2,
    explanation: "Arabia Saudita es el mayor productor mundial de petróleo debido a sus vastas reservas y su papel clave en la OPEP. Estados Unidos es el mayor consumidor y un gran productor, pero no supera a Arabia Saudita; Rusia e Irak también son grandes productores, pero ocupan posiciones inferiores en el ranking global.",
  },
  {
    id: 1284,
    area: "Geografía",
    text: "¿Qué significan las siglas OPEP?",
    options: [
    "Organización para la Producción y Exportación de Petróleo",
    "Oficina de Países Exportadores de Productos petrolíferos",
    "Organización de países exportadores de petróleo",
    "Organización de Países Exportadores de Petróleo y Energéticos"
    ],
    correctIndex: 2,
    explanation: "La OPEP es la Organización de Países Exportadores de Petróleo, fundada en 1960 para coordinar políticas petroleras. Las otras opciones son incorrectas porque añaden términos como 'Energéticos' o 'Productos petrolíferos' que no forman parte del nombre oficial, o alteran el orden de las palabras ('Producción y Exportación' en lugar de 'Países Exportadores').",
  },
  {
    id: 1285,
    area: "Geografía",
    text: "¿Cuáles son los usos de los recursos hídricos?",
    options: [
    "Almacenamiento de residuos nucleares, producción de biocombustibles, desalinización, navegación fluvial, turismo",
    "Riego, control de inundaciones, generación de energía solar, pesca deportiva, acuicultura",
    "Riego, plantas hidroeléctricas, navegación, pesca, turismo",
    "Generación de energía eólica, acuicultura, transporte marítimo, recreación, minería"
    ],
    correctIndex: 2,
    explanation: "La respuesta correcta incluye los usos tradicionales y significativos del agua: riego (agricultura), hidroeléctricas (energía), navegación (transporte), pesca (alimento) y turismo (recreación). Las opciones incorrectas mezclan usos reales pero menos prioritarios o no aplicables directamente a recursos hídricos (como energía eólica o solar), o incluyen actividades no típicas (almacenamiento de residuos nucleares).",
  },
  {
    id: 1286,
    area: "Geografía",
    text: "¿Qué es demografía?",
    options: [
    "Rama de la geografía que analiza la distribución y organización de los asentamientos humanos en el territorio",
    "Disciplina que estudia la evolución histórica de las sociedades a través de sus registros censales",
    "Ciencia que se enfoca en el impacto ambiental de las actividades humanas sobre los ecosistemas",
    "Rama de la geografía que estudia las características cuantificables de la población (género, edad, alfabetismo)"
    ],
    correctIndex: 3,
    explanation: "La demografía es correcta porque se centra en características cuantificables de la población como edad, género y alfabetismo. Las opciones incorrectas confunden la demografía con la geografía urbana (asentamientos), la historia (evolución social) o la ecología (impacto ambiental), que son áreas distintas.",
  },
  {
    id: 1287,
    area: "Geografía",
    text: "¿Qué es un censo?",
    options: [
    "Es un sistema de encuestas que el gobierno aplica mensualmente para conocer la economía familiar en las ciudades",
    "Son registros oficiales de conteo, que aplica el gobierno cada cierto período, en México es cada 10 años",
    "Es un registro que llevan los municipios para saber cuántas personas viven en zonas rurales y se actualiza cada 5 años",
    "Es un documento oficial que registra la población y viviendas de un país, se realiza cada año en México"
    ],
    correctIndex: 1,
    explanation: "Un censo es un conteo oficial de población y vivienda que realiza el gobierno cada 10 años en México, no anualmente ni mensualmente, y abarca todo el territorio, no solo zonas rurales o ciudades. Las opciones incorrectas confunden la periodicidad y el alcance geográfico del censo.",
  },
  {
    id: 1288,
    area: "Geografía",
    text: "Explica que es la tasa de natalidad:",
    options: [
    "Es el porcentaje de personas que nacen vivas en un país",
    "Es la cantidad de nacimientos en un período de tiempo",
    "Es la relación entre nacimientos y defunciones en una población",
    "Es la cantidad de hijos que tiene una mujer en edad fértil"
    ],
    correctIndex: 1,
    explanation: "La tasa de natalidad mide específicamente los nacimientos ocurridos en un período, no su relación con defunciones (que sería crecimiento natural), ni el promedio de hijos por mujer (tasa de fecundidad), ni un porcentaje de nacidos vivos (que es la tasa de natalidad bruta).",
  },
  {
    id: 1289,
    area: "Geografía",
    text: "Explica que es la tasa de mortalidad:",
    options: [
    "Es el promedio de años que vive una persona en un país",
    "Es la cantidad de defunciones en un período de tiempo",
    "Es la relación entre población total y superficie territorial",
    "Es el número de nacimientos en una población en un año"
    ],
    correctIndex: 1,
    explanation: "La tasa de mortalidad mide únicamente las defunciones en un periodo, no los nacimientos (tasa de natalidad), la densidad de población (relación habitantes/superficie) ni la esperanza de vida (promedio de años vividos).",
  },
  {
    id: 1290,
    area: "Geografía",
    text: "¿Qué es la esperanza de vida?",
    options: [
    "Es el promedio de años que vive una persona, en México es de 75 años",
    "Es la edad máxima que puede alcanzar un ser humano, en México es de 90 años",
    "Es la cantidad de años que vive una persona con buena salud, en México es de 65 años",
    "Es el promedio de años que vive una persona en un país desarrollado, en México es de 80 años"
    ],
    correctIndex: 0,
    explanation: "La esperanza de vida es un indicador estadístico que calcula el promedio de años que se espera viva una persona al nacer, basado en tasas de mortalidad actuales. En México es de 75 años aproximadamente. Las opciones incorrectas confunden este promedio con la esperanza de vida saludable (65 años), la edad máxima teórica (90 años) o aplican un valor de país desarrollado (80 años) que no corresponde a México.",
  },
  {
    id: 1291,
    area: "Geografía",
    text: "¿Qué es la tasa de mortalidad infantil?",
    options: [
    "Es la proporción de muertes de niños menores de un año por cada 1000 nacidos vivos",
    "Es el número de niños que mueren antes de cumplir los 5 años en un año",
    "Es el número de niños menores de un año que mueren en un período de tiempo",
    "Es el número de muertes de niños menores de un año en una región específica"
    ],
    correctIndex: 2,
    explanation: "La respuesta correcta es el número de niños menores de un año que mueren en un período, porque la tasa de mortalidad infantil se enfoca exclusivamente en el primer año de vida. Las opciones incorrectas confunden el rango de edad (menores de 5 años), añaden un denominador (por cada 1000 nacidos vivos) que es parte de la tasa pero no su definición, o limitan el ámbito geográfico de forma innecesaria.",
  },
  {
    id: 1292,
    area: "Geografía",
    text: "Explica qué es el alfabetismo.",
    options: [
    "Es la proporción de personas que saben leer y escribir en cualquier idioma, sin límite de edad",
    "Es la capacidad de una persona para comprender textos complejos y redactar documentos formales",
    "Es el porcentaje de la población mayor de 15 años que saben leer y escribir",
    "Es el nivel educativo promedio de la población de un país, medido en años de escolaridad"
    ],
    correctIndex: 2,
    explanation: "La respuesta correcta define alfabetismo como el porcentaje de población mayor de 15 años que sabe leer y escribir, un indicador geográfico de desarrollo. Las opciones incorrectas son plausibles pero erróneas: la primera se refiere a alfabetización funcional, la segunda al índice de escolaridad, y la tercera omite el límite de edad estándar (15 años) usado por la ONU y el INEGI.",
  },
  {
    id: 1293,
    area: "Geografía",
    text: "Explica qué es el analfabetismo.",
    options: [
    "Es la falta de acceso a internet y tecnologías digitales en comunidades rurales",
    "Es la incapacidad de comprender mapas y coordenadas geográficas básicas",
    "Es el porcentaje de la población mayor de 15 años que no sabe leer ni escribir",
    "Es el porcentaje de la población que no ha completado la educación secundaria"
    ],
    correctIndex: 2,
    explanation: "El analfabetismo se define como la incapacidad de leer y escribir en personas mayores de 15 años, un indicador clave en geografía humana para medir el desarrollo social. Las opciones incorrectas confunden el concepto con brecha digital, rezago educativo o falta de habilidades cartográficas, que son problemas distintos aunque relacionados.",
  },
  {
    id: 1294,
    area: "Geografía",
    text: "¿Qué características tiene una población rural?",
    options: [
    "Tiene entre 2500 y 15000 habitantes y su economía principal es la ganadería",
    "Tiene menos de 5000 habitantes y su principal actividad es la industria manufacturera",
    "Tiene menos de 2500 habitantes y su principal ocupación es la agricultura",
    "Tiene más de 10000 habitantes y su población se dedica principalmente al comercio"
    ],
    correctIndex: 2,
    explanation: "La respuesta correcta se basa en el criterio demográfico del INEGI (menos de 2500 hab.) y la ocupación primaria (agricultura). Las opciones incorrectas mezclan umbrales poblacionales de localidades rurales-urbanas o actividades secundarias/terciarias, que corresponden a zonas semiurbanas o urbanas.",
  },
  {
    id: 1295,
    area: "Geografía",
    text: "¿Qué características tiene la población urbana?",
    options: [
    "Tiene más de 5000 habitantes y su economía se basa en la ganadería extensiva",
    "Tiene menos de 2500 habitantes y su principal actividad es la agricultura",
    "Tiene entre 1000 y 2000 habitantes y su población se dedica a la pesca artesanal",
    "Tiene más de 2500 habitantes y su principal ocupación es el comercio e industria"
    ],
    correctIndex: 3,
    explanation: "La respuesta correcta define población urbana según el INEGI con más de 2500 habitantes y actividades secundarias/terciarias (comercio e industria). Las opciones incorrectas mezclan umbrales de población rural o asocian actividades primarias como agricultura, ganadería o pesca, que son características de población rural.",
  },
  {
    id: 1296,
    area: "Geografía",
    text: "¿Cuáles son los dos factores que hacen crecer a la población?",
    options: [
    "Natalidad y mortalidad",
    "Fecundidad y tasa de reemplazo",
    "Migración y esperanza de vida",
    "Natalidad y migración (extranjeros)"
    ],
    correctIndex: 3,
    explanation: "La natalidad y la migración (extranjeros) son los dos factores que incrementan directamente el número de habitantes en un territorio. La mortalidad reduce la población, no la aumenta; la esperanza de vida no es un factor de crecimiento por sí misma; y la tasa de reemplazo solo mantiene estable la población, no la hace crecer.",
  },
  {
    id: 1297,
    area: "Geografía",
    text: "¿Qué es el crecimiento natural de la población?",
    options: [
    "Se refiere al aumento de la población por migraciones internacionales",
    "Se calcula sumando los fallecimientos a los nacimientos",
    "Se obtiene a partir de los nacimientos",
    "Es la diferencia entre la población urbana y la rural"
    ],
    correctIndex: 2,
    explanation: "El crecimiento natural es la diferencia entre nacimientos y defunciones en un lugar. Las opciones incorrectas confunden el concepto con migraciones, estructura urbano-rural o suman en lugar de restar las defunciones.",
  },
  {
    id: 1298,
    area: "Geografía",
    text: "¿Qué es el crecimiento social?",
    options: [
    "Es el cambio en la estructura social de la población por la llegada de nuevos grupos culturales",
    "Se obtiene restando el número de emigrantes que salen del territorio y sumando el número de migrantes que entran al territorio",
    "Se calcula sumando el número de inmigrantes y restando el de emigrantes, pero sin considerar el saldo natural",
    "Se refiere al aumento de la población debido al incremento de la natalidad sobre la mortalidad en un territorio"
    ],
    correctIndex: 1,
    explanation: "La respuesta correcta define el crecimiento social como el saldo neto migratorio (inmigrantes menos emigrantes). Las opciones incorrectas confunden el concepto con el crecimiento natural (natalidad-mortalidad), con cambios culturales, o con un cálculo incompleto que omite la resta correcta de emigrantes.",
  },
  {
    id: 1299,
    area: "Geografía",
    text: "¿Qué son vacíos demográficos?",
    options: [
    "Son áreas donde la densidad de población es menor a 10 habitantes por kilómetro cuadrado",
    "Son extensiones de territorio que carecen de cualquier tipo de asentamiento humano o infraestructura",
    "Son regiones con solo uno o ningún habitante por kilómetro cuadrado",
    "Son zonas despobladas debido a condiciones climáticas extremas o falta de recursos naturales"
    ],
    correctIndex: 2,
    explanation: "La respuesta correcta define vacíos demográficos como regiones con 0 o 1 hab/km², basado en el concepto de densidad poblacional extrema. Las opciones incorrectas son plausibles pero erróneas: la primera exige ausencia total de asentamientos (demasiado restrictiva), la segunda usa un umbral de 10 hab/km² (propio de áreas rurales, no vacíos) y la tercera describe causas posibles, no la definición precisa del término.",
  },
  {
    id: 1300,
    area: "Geografía",
    text: "¿Qué es un territorio con población intermedia?",
    options: [
    "Es aquel que tiene de 100 a 500 habitantes por kilómetro cuadrado",
    "Es aquel que tiene de 1 a 50 habitantes por kilómetro cuadrado",
    "Es aquel que tiene de 50 a 100 habitantes por kilómetro cuadrado",
    "Es aquel que tiene menos de 1 habitante por kilómetro cuadrado"
    ],
    correctIndex: 1,
    explanation: "La respuesta correcta se basa en la clasificación de densidad de población en México, donde un territorio con población intermedia oscila entre 1 y 50 hab/km². Las opciones incorrectas corresponden a densidades altas (100-500 y 50-100) o muy bajas (menos de 1), que definen categorías diferentes como urbana o rural.",
  },
  {
    id: 1301,
    area: "Química",
    text: "Explica las características de un país expulsor.",
    options: [
    "Son países que presentan altas concentraciones de contaminantes químicos en el aire y agua, lo que obliga a la población a migrar por razones de salud ambiental",
    "Son países que exportan grandes cantidades de sustancias químicas peligrosas a otras naciones, generando desequilibrios ecológicos que fuerzan la emigración",
    "Son países donde la industria química es predominante y altamente contaminante, lo que reduce la esperanza de vida y motiva el desplazamiento de sus habitantes",
    "Son países que tienen una mala calidad de vida, no hay trabajo suficiente, los sueldos no son buenos, no hay buena salud, buena educación, no hay estabilidad entre sus habitantes, por ello emigran a otro país"
    ],
    correctIndex: 3,
    explanation: "La respuesta correcta define un país expulsor por factores socioeconómicos (falta de empleo, salarios bajos, mala calidad de vida), no por causas químicas o ambientales. Las opciones incorrectas mezclan el concepto con contaminación o industria química, que son características de países emisores de contaminantes, no necesariamente expulsores de población.",
  },
  {
    id: 1302,
    area: "Química",
    text: "¿Qué es un país de tránsito?",
    options: [
    "Es un país que regula el flujo de electrones en reacciones químicas",
    "Es un país que produce químicos para el tránsito de mercancías",
    "Son países de paso obligado entre el punto de origen y el punto de llegada de los migrantes",
    "Es un país donde los migrantes se asientan de manera definitiva"
    ],
    correctIndex: 2,
    explanation: "La respuesta correcta define un país de tránsito como el paso obligado de migrantes entre origen y destino. Las opciones incorrectas confunden el concepto con asentamiento permanente, producción química o flujo de electrones, que no se relacionan con la migración.",
  },
  {
    id: 1303,
    area: "Química",
    text: "¿Qué características tiene un país receptor?",
    options: [
    "Países con mayor producción de compuestos químicos peligrosos, atraen a trabajadores especializados",
    "Países atractivos para los pobladores de distintos países, tienen mejor calidad de vida",
    "Países con alta concentración de industrias petroquímicas, generan migración temporal",
    "Países que exportan materias primas químicas, tienen baja densidad poblacional"
    ],
    correctIndex: 1,
    explanation: "La respuesta correcta se refiere a naciones que ofrecen estabilidad y oportunidades, atrayendo inmigrantes por su calidad de vida. Las opciones incorrectas asocian erróneamente la recepción de población con aspectos específicos de la química industrial, que no definen el concepto migratorio de país receptor.",
  },
  {
    id: 1304,
    area: "Química",
    text: "¿Qué es riesgo?",
    options: [
    "Es la cantidad de una sustancia química que puede causar daño a la salud",
    "Es la posibilidad de pérdida de vidas humanas, de propiedades o de la capacidad productiva",
    "Es la probabilidad de que ocurra un accidente al manipular sustancias corrosivas",
    "Es la consecuencia directa de exponerse a un agente químico tóxico"
    ],
    correctIndex: 1,
    explanation: "La respuesta correcta define riesgo como la posibilidad de pérdida en diversos ámbitos, no solo en química. Los distractores son incorrectos porque confunden riesgo con peligro (opción 1), con probabilidad específica (opción 2) o con consecuencia directa (opción 3), cuando riesgo es la posibilidad de daño, no el daño mismo ni un tipo concreto de accidente.",
  },
  {
    id: 1305,
    area: "Química",
    text: "¿Qué es peligro?",
    options: [
    "Es la evaluación de los riesgos potenciales en una reacción química",
    "Es el conjunto de medidas para prevenir accidentes en un laboratorio",
    "Es la posibilidad de que un área se vea afectada o destruida por factores naturales o provocados por el hombre",
    "Es la probabilidad de sufrir un daño por exposición a una sustancia química"
    ],
    correctIndex: 2,
    explanation: "La respuesta correcta define peligro como la posibilidad de afectación por factores naturales o humanos, en un sentido amplio. Las opciones incorrectas se centran en aspectos específicos de seguridad o probabilidad de daño en química, pero no abarcan la definición general de peligro como posibilidad de destrucción o afectación.",
  },
  {
    id: 1306,
    area: "Química",
    text: "¿Qué es vulnerabilidad?",
    options: [
    "Es la propiedad de los materiales de absorber humedad del ambiente",
    "Indica el grado de riesgo de tiene una persona o una población de ser herido o perder la vida",
    "Es la capacidad de una sustancia de reaccionar violentamente con otra",
    "Indica la tendencia de un compuesto a descomponerse en presencia de luz"
    ],
    correctIndex: 1,
    explanation: "La vulnerabilidad en química se refiere al riesgo de daño a personas o poblaciones, no a propiedades de sustancias. Las opciones incorrectas describen reactividad química, fotodegradación e higroscopicidad, que son conceptos distintos.",
  },
  {
    id: 1307,
    area: "Química",
    text: "Explica qué son los riesgos geológicos.",
    options: [
    "Son las reacciones nucleares en el subsuelo que liberan radiación y causan enfermedades a las personas",
    "Son los cambios climáticos provocados por emisiones de gases industriales que generan lluvia ácida y daños a la salud",
    "Son el vulcanismo y la sismicidad, dañan a las personas que se encuentren cerca de la manifestación de dichos fenómenos",
    "Son la contaminación del agua y del suelo por desechos químicos que afectan a la población cercana"
    ],
    correctIndex: 2,
    explanation: "La respuesta correcta es correcta porque los riesgos geológicos se refieren a procesos naturales de la Tierra como vulcanismo y sismicidad. Las alternativas son incorrectas porque abordan problemas ambientales o químicos inducidos por el hombre (contaminación, cambio climático, radiación), no fenómenos geológicos naturales.",
  },
  {
    id: 1308,
    area: "Química",
    text: "¿Qué son los riesgos geomorfológicos?",
    options: [
    "Son procesos de erosión química de rocas debido a la lluvia ácida o contaminantes",
    "Son deslizamientos de tierra y roca provocados por la naturaleza o por el ser humano",
    "Son cambios en la composición química del suelo por acidificación natural o industrial",
    "Son reacciones de oxidación en minerales que debilitan el terreno y causan derrumbes"
    ],
    correctIndex: 1,
    explanation: "La respuesta correcta se enfoca en el movimiento físico de tierra y roca (deslizamientos), que es el riesgo geomorfológico directo. Las alternativas erróneas mezclan procesos químicos del suelo o rocas con el concepto de riesgo, pero no describen el evento geomorfológico en sí, sino causas químicas secundarias.",
  },
  {
    id: 1309,
    area: "Química",
    text: "¿Qué son los riesgos hidrometeorológicos?",
    options: [
    "Oxidación, corrosión, combustión y explosiones",
    "Huracanes, ciclones, vientos, maremotos, tsunamis",
    "Derrames de ácidos, bases, solventes y metales pesados",
    "Reacciones exotérmicas, endotérmicas y de neutralización"
    ],
    correctIndex: 1,
    explanation: "Los riesgos hidrometeorológicos son fenómenos naturales asociados al agua y la atmósfera, como huracanes, ciclones, vientos, maremotos y tsunamis. Las opciones incorrectas se relacionan con peligros químicos (derrames, reacciones, oxidación), no con eventos meteorológicos o hidrológicos.",
  },
  {
    id: 1310,
    area: "Química",
    text: "¿Qué son los riesgos antrópicos?",
    options: [
    "Se originan por la acción de microorganismos patógenos en el ambiente laboral",
    "Son los derivados de la acumulación de residuos radiactivos naturales en el subsuelo",
    "Se generan por descuido humano (accidentes en fábricas, plantas de gas, derrames de petróleo)",
    "Son aquellos provocados por fenómenos naturales como terremotos, huracanes o inundaciones"
    ],
    correctIndex: 2,
    explanation: "La respuesta correcta se enfoca en el origen humano de estos riesgos, como accidentes industriales o derrames. Las opciones incorrectas se refieren a causas naturales, biológicas o geológicas, que no son resultado directo de actividades humanas, aunque puedan parecer plausibles en química ambiental.",
  },
  {
    id: 1311,
    area: "Química",
    text: "¿Qué es una actividad económica?",
    options: [
    "Es un proceso químico que transforma materias primas en productos mediante reacciones controladas",
    "Es cualquier proceso mediante el cual obtenemos productos, bienes y servicios",
    "Es el conjunto de reacciones químicas que ocurren en los seres vivos para obtener energía",
    "Es la medición de la cantidad de energía liberada o absorbida durante una reacción química"
    ],
    correctIndex: 1,
    explanation: "La respuesta correcta se enfoca en la obtención de bienes y servicios como resultado de cualquier proceso, no solo químico. Las opciones incorrectas limitan la actividad económica a procesos químicos, energéticos o biológicos, cuando en realidad abarca toda producción, distribución y consumo.",
  },
  {
    id: 1312,
    area: "Química",
    text: "¿Cómo se clasifican las actividades económicas?",
    options: [
    "Endotérmicas, exotérmicas y isotérmicas",
    "Primarias, secundarias y terciarias",
    "Sólidas, líquidas y gaseosas",
    "Sustancias, mezclas y compuestos"
    ],
    correctIndex: 1,
    explanation: "La clasificación correcta de las actividades económicas es en primarias, secundarias y terciarias, según su sector de producción (extracción, transformación y servicios). Las opciones incorrectas se relacionan con estados de agregación, tipos de materia y tipos de reacciones químicas, que son conceptos de química pero no corresponden a la clasificación económica.",
  },
  {
    id: 1313,
    area: "Química",
    text: "¿Qué son las actividades primarias?",
    options: [
    "Son aquellas que se dedican a la extracción de materias primas (agricultura, ganadería, pesca)",
    "Son las que estudian la composición y propiedades de la materia (química analítica)",
    "Son las que generan sustancias a partir de reacciones químicas controladas (síntesis de polímeros)",
    "Son las que transforman materias primas en productos elaborados (industria química, farmacéutica)"
    ],
    correctIndex: 0,
    explanation: "La respuesta correcta define las actividades primarias como extracción de recursos naturales (agricultura, ganadería, pesca). Las opciones incorrectas describen actividades secundarias (industria), síntesis química (procesos industriales) o ramas de la química (analítica), que no pertenecen a las actividades primarias.",
  },
  {
    id: 1314,
    area: "Química",
    text: "¿Qué son las actividades secundarias?",
    options: [
    "Son actividades químicas que ocurren en la naturaleza sin intervención humana",
    "Son procesos que separan los componentes de una mezcla sin alterar su composición",
    "Son actividades industriales que transforman la materia prima en un producto elaborado",
    "Son técnicas de laboratorio para medir la concentración de una sustancia en una disolución"
    ],
    correctIndex: 2,
    explanation: "La respuesta correcta se enfoca en la transformación industrial de materias primas en productos elaborados, clave en química aplicada. Las opciones incorrectas confunden con procesos naturales, físicos o analíticos, que no implican la transformación industrial característica del sector secundario.",
  },
  {
    id: 1315,
    area: "Química",
    text: "¿Qué son las actividades terciarias?",
    options: [
    "Son las que transforman materias primas en productos químicos",
    "Son las que satisfacen alguna necesidad y brindan algún servicio",
    "Son las que realizan reacciones de síntesis a nivel industrial",
    "Son las que extraen recursos naturales como minerales y petróleo"
    ],
    correctIndex: 1,
    explanation: "La respuesta correcta define actividades terciarias como servicios (educación, salud, comercio). Las opciones incorrectas describen actividades secundarias (manufactura química), primarias (extracción) o procesos industriales específicos, no servicios.",
  },
  {
    id: 1316,
    area: "Química",
    text: "¿Qué es comercio?",
    options: [
    "Es el proceso químico de intercambio de electrones entre átomos",
    "Es la actividad de compraventa de productos y servicios",
    "Es la transformación de materia prima en productos elaborados mediante reacciones",
    "Es la medición de la cantidad de sustancia en una reacción de neutralización"
    ],
    correctIndex: 1,
    explanation: "La respuesta correcta define comercio como la actividad de compraventa de productos y servicios, un concepto económico. Las opciones incorrectas se relacionan con química: intercambio de electrones (redox), transformación de materia prima (síntesis química) y medición de sustancia (estequiometría), pero no describen el comercio.",
  },
  {
    id: 1317,
    area: "Química",
    text: "¿Qué tipos de comercio existen?",
    options: [
    "Orgánico e inorgánico",
    "Sólido y gaseoso",
    "Ácidos y bases",
    "Interior y exterior"
    ],
    correctIndex: 3,
    explanation: "La respuesta correcta es 'Interior y exterior' porque el comercio se clasifica según su alcance geográfico (nacional o internacional). Las opciones incorrectas se refieren a clasificaciones de la química: tipos de compuestos (ácidos/bases, orgánico/inorgánico) o estados de agregación (sólido/gaseoso), no a tipos de comercio.",
  },
  {
    id: 1318,
    area: "Química",
    text: "¿Cuáles son las características del comercio interior?",
    options: [
    "Se lleva a cabo en el interior del país, utilizando el mismo tipo de cambio",
    "Ocurre exclusivamente en el mercado de valores y utiliza el tipo de cambio fijo",
    "Implica la compraventa de bienes y servicios en el mismo estado de agregación",
    "Se realiza dentro de las fronteras nacionales, pero con moneda extranjera"
    ],
    correctIndex: 0,
    explanation: "La respuesta correcta describe el comercio interior como aquel que se da dentro del país y con la misma moneda (tipo de cambio), lo que lo diferencia del comercio exterior. Las opciones incorrectas confunden conceptos: la primera mezcla moneda extranjera, la segunda usa un término químico (estado de agregación) fuera de contexto, y la tercera restringe el comercio al mercado de valores, que no es característico del comercio interior.",
  },
  {
    id: 1319,
    area: "Química",
    text: "¿Qué es el comercio exterior?",
    options: [
    "El que se realiza entre dos o más países",
    "El que se realiza dentro de las fronteras de un solo país",
    "El que regula los acuerdos internacionales sobre contaminación ambiental",
    "El que involucra la transferencia de tecnología y patentes entre naciones"
    ],
    correctIndex: 0,
    explanation: "El comercio exterior se define como el intercambio de bienes y servicios entre dos o más países, por lo que la respuesta correcta es la primera opción. Las alternativas incorrectas se refieren al comercio interno, a la propiedad intelectual o a acuerdos ambientales, que no son el concepto central de comercio exterior. Recuerda que la clave es la palabra 'exterior', que implica salir del país.",
  },
  {
    id: 1320,
    area: "Química",
    text: "¿Qué son las importaciones?",
    options: [
    "Son todas las mercancías que se compran del exterior",
    "Son los compuestos que se obtienen al importar un ácido",
    "Son los reactivos que se utilizan en una reacción de importación",
    "Son las sustancias que se exportan para ser transformadas"
    ],
    correctIndex: 0,
    explanation: "La respuesta correcta es 'Son todas las mercancías que se compran del exterior', porque las importaciones son bienes adquiridos de otros países. Los distractores son incorrectos porque confunden el término con procesos químicos (como obtener compuestos, exportar o usar reactivos) que no corresponden al concepto económico-comercial de importación.",
  },
  {
    id: 1321,
    area: "Química",
    text: "¿Qué son las exportaciones?",
    options: [
    "Son las sustancias que se obtienen al exportar minerales del subsuelo",
    "Son todas las mercancías que se venden al exterior",
    "Son los compuestos químicos que se desechan al exterior de una reacción",
    "Son los productos que se importan para ser transformados en el país"
    ],
    correctIndex: 1,
    explanation: "La respuesta correcta define exportaciones como mercancías vendidas al exterior, relacionado con comercio. En química, 'exportar' no se refiere a desechos de reacción (opción 1), ni a minerales extraídos específicamente (opción 2), y la opción 3 describe importaciones, no exportaciones.",
  },
  {
    id: 1322,
    area: "Química",
    text: "¿Qué es la globalización?",
    options: [
    "Descomposición acelerada de compuestos orgánicos por radiación solar global",
    "Proceso de unificación de elementos químicos en una sola tabla periódica internacional",
    "Aumento de intercambios comerciales entre países, apertura de capitales extranjeros",
    "Reacción química entre ácidos y bases que produce sales neutras a nivel mundial"
    ],
    correctIndex: 2,
    explanation: "La globalización se refiere al aumento de intercambios comerciales y apertura de capitales entre países, un concepto económico. Las opciones incorrectas son procesos químicos (descomposición por radiación, neutralización ácido-base, unificación de la tabla periódica) que no tienen relación con el comercio internacional.",
  },
  {
    id: 1323,
    area: "Química",
    text: "¿Qué significan las siglas OMC?",
    options: [
    "Oficina de Metales Comerciales",
    "Organización Mundial de Comercio",
    "Organización de Moléculas Complejas",
    "Organización Mundial de Catalizadores"
    ],
    correctIndex: 1,
    explanation: "La OMC es la Organización Mundial de Comercio, un organismo internacional que regula el comercio global. Las opciones incorrectas se relacionan con química (catalizadores, moléculas, metales) pero no corresponden a las siglas reales, que son clave en economía, no en química.",
  },
  {
    id: 1324,
    area: "Química",
    text: "¿Qué significan las siglas PIB?",
    options: [
    "Punto de inflamabilidad bruto y es la temperatura mínima de ignición de una sustancia",
    "Producto interno bruto y es el valor total de la producción de un país",
    "Producto iónico bruto y es la concentración total de iones en una disolución",
    "Potencial iónico de base y es la capacidad de una base para donar iones"
    ],
    correctIndex: 1,
    explanation: "La respuesta correcta es Producto interno bruto (PIB), un indicador económico que mide el valor total de bienes y servicios producidos en un país. Las opciones incorrectas son términos de química (producto iónico, potencial iónico, punto de inflamabilidad) que suenan similares pero no corresponden a la definición económica del PIB.",
  },
  {
    id: 1325,
    area: "Química",
    text: "¿Qué es soberanía?",
    options: [
    "Es la libertad que ejerce el estado en representación de su pueblo para gobernar, decidir en su territorio",
    "Es la propiedad de los átomos de un elemento de mantener su identidad química al formar compuestos",
    "Es la capacidad de una reacción química para ocurrir de forma espontánea sin intervención externa",
    "Es el poder que tiene una sustancia para disolver a otra en un sistema homogéneo"
    ],
    correctIndex: 0,
    explanation: "La soberanía es un concepto político, no químico; se refiere al poder del Estado sobre su territorio y población. Las opciones incorrectas describen conceptos químicos como espontaneidad, identidad atómica y solubilidad, que no son equivalentes a la autoridad estatal.",
  },
  {
    id: 1326,
    area: "Química",
    text: "¿Qué extensión tiene el mar territorial?",
    options: [
    "6 millas náuticas (11.1 km)",
    "12 millas náuticas (22.2 km)",
    "200 millas náuticas (370.4 km)",
    "24 millas náuticas (44.4 km)"
    ],
    correctIndex: 1,
    explanation: "El mar territorial se extiende hasta 12 millas náuticas desde la línea de base, según la Convención del Mar. Las opciones incorrectas confunden esta medida con la zona contigua (24 mn) o la zona económica exclusiva (200 mn), mientras que 6 mn es una medida histórica pero no vigente en el derecho internacional.",
  },
  {
    id: 1327,
    area: "Química",
    text: "¿Hasta dónde se extiende el espacio aéreo?",
    options: [
    "Constituye la capa gaseosa que envuelve al planeta, con una composición homogénea de gases hasta los 100 km de altitud",
    "Es una extensión vertical del territorio de cada país, que se extiende a todas las capas de la atmósfera",
    "Se define como la región de la atmósfera donde la presión del aire es suficiente para sostener la vida, hasta la estratósfera",
    "Es el espacio que ocupa el aire sobre la superficie terrestre, limitado por la tropopausa y compuesto principalmente por nitrógeno y oxígeno"
    ],
    correctIndex: 1,
    explanation: "La respuesta correcta es: 'Es una extensión vertical del territorio de cada país, que se extiende a todas las capas de la atmósfera'. Esto es correcto porque el espacio aéreo no tiene un límite químico o físico fijo, sino que es una delimitación legal que abarca toda la atmósfera. Las opciones incorrectas son plausibles pero erróneas porque confunden el concepto legal con límites atmosféricos específicos (tropopausa, estratósfera) o con la composición química del aire, que no define la extensión del espacio aéreo soberano.",
  },
  {
    id: 1328,
    area: "Química",
    text: "¿Cuál es la extensión de la plataforma continental?",
    options: [
    "Solución",
    "Compuesto",
    "Elemento",
    "Comprende desde la playa hasta una profundidad de 200m"
    ],
    correctIndex: 3,
    explanation: "La respuesta correcta es: Comprende desde la playa hasta una profundidad de 200m",
  },
  {
    id: 1329,
    area: "Química",
    text: "Ejemplos de fenómenos físicos:",
    options: [
    "Formación de compuestos, cambio de color, liberación de gas, electrólisis y neutralización",
    "Reacciones de oxidación, combustión, fotosíntesis, fermentación y precipitación",
    "Cambio de estado de agregación, cambio de posición, formación de un arco iris, solubilidad y la electricidad",
    "Cambio de temperatura, descomposición térmica, evaporación, fusión y ebullición"
    ],
    correctIndex: 2,
    explanation: "La respuesta correcta incluye solo fenómenos físicos, donde la materia cambia de forma o estado sin alterar su composición química. Los distractores mezclan fenómenos químicos (como reacciones, combustión o descomposición) que sí transforman la composición de las sustancias.",
  },
  {
    id: 1330,
    area: "Química",
    text: "Ejemplos de fenómenos químicos:",
    options: [
    "Disolución, filtración, decantación, destilación, cristalización",
    "Oxidación, combustión, fermentación, respiración, fotosíntesis",
    "Fusión, ebullición, sublimación, condensación, solidificación",
    "Conducción, convección, radiación, dilatación, contracción"
    ],
    correctIndex: 1,
    explanation: "Los fenómenos químicos implican transformación de la materia y cambio en su composición, como oxidación, combustión, fermentación, respiración y fotosíntesis. Las opciones incorrectas describen cambios físicos (cambios de estado, métodos de separación y fenómenos térmicos) que no alteran la composición de las sustancias.",
  },
  {
    id: 1331,
    area: "Química",
    text: "¿Es todo lo que ocupa un lugar en el espacio?",
    options: [
    "Materia",
    "Energía",
    "Sustancia",
    "Volumen"
    ],
    correctIndex: 0,
    explanation: "La materia es todo lo que ocupa un lugar en el espacio y tiene masa. La energía no ocupa espacio ni tiene masa; 'sustancia' es un tipo específico de materia con composición definida; y el volumen es una propiedad de la materia, no la materia misma.",
  },
  {
    id: 1332,
    area: "Química",
    text: "Son propiedades generales de la materia:",
    options: [
    "Temperatura, presión, energía interna, entalpía, entropía, energía libre de Gibbs, calor específico",
    "Densidad, punto de fusión, punto de ebullición, conductividad, maleabilidad, ductilidad, dureza, brillo",
    "Reactividad, electronegatividad, afinidad electrónica, energía de ionización, número atómico, masa atómica",
    "Masa, peso, volumen, inercia, impenetrabilidad, divisibilidad, porosidad, elasticidad"
    ],
    correctIndex: 3,
    explanation: "La respuesta correcta enumera propiedades generales o extensivas, que posee toda la materia sin distinción de su composición: masa, peso, volumen, inercia, impenetrabilidad, divisibilidad, porosidad y elasticidad. Las opciones incorrectas mezclan propiedades específicas (densidad, maleabilidad) que varían según la sustancia, propiedades periódicas (reactividad, electronegatividad) propias de los elementos, o propiedades termodinámicas (temperatura, entalpía) que no son características universales de toda la materia.",
  },
  {
    id: 1333,
    area: "Química",
    text: "Son propiedades específicas de la materia:",
    options: [
    "Conductividad térmica, conductividad eléctrica, viscosidad, capilaridad, tensión superficial, calor específico",
    "Masa, volumen, peso, inercia, temperatura, presión, calor, trabajo",
    "Electricidad, magnetismo, óxido-reducción, acidez, basicidad, reactividad, inflamabilidad",
    "Ductilidad, solubilidad, maleabilidad, dureza, tenacidad, densidad, punto de fusión, punto de ebullición"
    ],
    correctIndex: 3,
    explanation: "La respuesta correcta enumera propiedades específicas, que son aquellas que permiten identificar y distinguir una sustancia de otra (ej. densidad, punto de fusión). Las opciones incorrectas incluyen propiedades generales (como masa y volumen) o propiedades químicas (como reactividad), que no son específicas de la materia en el sentido físico que se pide.",
  },
  {
    id: 1334,
    area: "Química",
    text: "Los sólidos:",
    options: [
    "Forma y volumen propio, moléculas ordenadas, gran cohesión, poca energía cinética",
    "Forma variable, volumen fijo, moléculas desordenadas, poca cohesión, energía cinética moderada",
    "Forma fija, volumen variable, moléculas ordenadas, cohesión moderada, energía cinética baja",
    "Forma y volumen propios, moléculas sin orden, cohesión nula, alta energía cinética"
    ],
    correctIndex: 0,
    explanation: "Los sólidos tienen forma y volumen propios debido a que sus moléculas están fuertemente unidas en posiciones fijas (ordenadas), con poca energía cinética, lo que les da gran cohesión. Las opciones incorrectas describen propiedades de líquidos (forma variable, desorden) o gases (cohesión nula, alta energía), o mezclan características incompatibles.",
  },
  {
    id: 1335,
    area: "Química",
    text: "Los líquidos:",
    options: [
    "Forma no definida, volumen no definido, compresible, moléculas en desorden con movimiento de traslación",
    "Forma definida, volumen definido, no compresible, moléculas en posiciones fijas",
    "Forma no definida, volumen definido, no compresible, moléculas en desorden con movimiento rotatorio",
    "Forma definida, volumen no definido, compresible, moléculas ordenadas con movimiento vibratorio"
    ],
    correctIndex: 2,
    explanation: "La respuesta correcta describe los líquidos: no tienen forma propia (toman la del recipiente), su volumen es constante, son prácticamente incompresibles y sus moléculas están en desorden con movimiento rotatorio. Las opciones incorrectas confunden propiedades de sólidos (forma y volumen definidos, moléculas fijas) o gases (sin volumen fijo, compresibles, moléculas en traslación libre), que son estados de agregación distintos.",
  },
  {
    id: 1336,
    area: "Química",
    text: "Los gaseosos:",
    options: [
    "Forma definida pero volumen variable, baja compresibilidad, energía cinética moderada",
    "Forma y volumen definidos, no compresible, baja energía cinética",
    "Forma variable pero volumen definido, compresible, alta energía cinética",
    "Forma y volumen no definido, compresible, gran energía cinética"
    ],
    correctIndex: 3,
    explanation: "Los gases tienen forma y volumen no definidos porque sus moléculas están muy separadas y se mueven libremente, son compresibles debido al espacio entre ellas, y poseen gran energía cinética por su movimiento constante. Las opciones incorrectas describen propiedades de sólidos o líquidos, como forma/volumen definidos o baja compresibilidad, que no corresponden al estado gaseoso.",
  },
  {
    id: 1337,
    area: "Química",
    text: "Sólido a gaseoso =",
    options: [
    "Sublimación inversa",
    "Licuefacción",
    "Vaporización",
    "Sublimación"
    ],
    correctIndex: 3,
    explanation: "La sublimación es el cambio directo de sólido a gas sin pasar por líquido. Vaporización es de líquido a gas, sublimación inversa es de gas a sólido, y licuefacción es de gas a líquido.",
  },
  {
    id: 1338,
    area: "Química",
    text: "Gaseoso a líquido =",
    options: [
    "Sublimación",
    "Fusión",
    "Condensación",
    "Evaporación"
    ],
    correctIndex: 2,
    explanation: "La condensación es el cambio de estado de gas a líquido, que ocurre cuando las partículas gaseosas pierden energía y se agrupan. La sublimación es de sólido a gas, la evaporación de líquido a gas, y la fusión de sólido a líquido, por lo que no corresponden al proceso descrito.",
  },
  {
    id: 1339,
    area: "Química",
    text: "Líquido a sólido =",
    options: [
    "Solidificación",
    "Fusión",
    "Sublimación",
    "Condensación"
    ],
    correctIndex: 0,
    explanation: "La solidificación es el cambio de estado de líquido a sólido, como el agua al congelarse. La condensación es de gas a líquido, la fusión de sólido a líquido y la sublimación de sólido a gas, por lo que no corresponden.",
  },
  {
    id: 1340,
    area: "Química",
    text: "Gaseoso a sólido =",
    options: [
    "Deposición",
    "Condensación",
    "Solidificación",
    "Sublimación"
    ],
    correctIndex: 0,
    explanation: "La deposición es el cambio de estado de gas a sólido sin pasar por líquido (ej: nieve artificial). Sublimación es el proceso inverso (sólido a gas), condensación es gas a líquido, y solidificación es líquido a sólido.",
  },
  {
    id: 1341,
    area: "Química",
    text: "Sólido a líquido =",
    options: [
    "Fusión",
    "Condensación",
    "Sublimación",
    "Evaporación"
    ],
    correctIndex: 0,
    explanation: "La fusión es el cambio de estado de sólido a líquido al aumentar la temperatura. La evaporación es de líquido a gas, la sublimación de sólido a gas y la condensación de gas a líquido, por lo que no corresponden.",
  },
  {
    id: 1342,
    area: "Química",
    text: "Líquido a gaseoso =",
    options: [
    "Fusión",
    "Sublimación",
    "Condensación",
    "Evaporación"
    ],
    correctIndex: 3,
    explanation: "La evaporación es el cambio de estado de líquido a gaseoso. La sublimación es de sólido a gas, la condensación es de gas a líquido, y la fusión es de sólido a líquido.",
  },
  {
    id: 1343,
    area: "Química",
    text: "Materia que tiene una composición química definida en toda su extensión:",
    options: [
    "Mezcla homogénea",
    "Compuesto iónico",
    "Disolución saturada",
    "Sustancia pura"
    ],
    correctIndex: 3,
    explanation: "Una sustancia pura tiene composición química fija e invariable, a diferencia de las mezclas homogéneas o disoluciones saturadas, cuya composición puede variar. Un compuesto iónico es un tipo de sustancia pura, pero no todas las sustancias puras son compuestos iónicos, por lo que la opción más general y correcta es 'sustancia pura'.",
  },
  {
    id: 1344,
    area: "Química",
    text: "Unidad mínima de toda la materia:",
    options: [
    "Molécula",
    "Electrón",
    "Átomo",
    "Protón"
    ],
    correctIndex: 2,
    explanation: "El átomo es la unidad mínima de la materia que conserva las propiedades de un elemento químico. La molécula es una combinación de átomos, no la unidad mínima; el electrón y el protón son partículas subatómicas que forman parte del átomo, pero no son la unidad fundamental de la materia.",
  },
  {
    id: 1345,
    area: "Química",
    text: "Sustancias puras que están constituidas por átomos iguales y no pueden ser descompuestos en otros más simples:",
    options: [
    "Moléculas diatómicas",
    "Elementos",
    "Compuestos",
    "Mezclas homogéneas"
    ],
    correctIndex: 1,
    explanation: "La respuesta correcta es 'Elementos' porque son sustancias puras formadas por un solo tipo de átomo y no se pueden descomponer en sustancias más simples por medios químicos. 'Compuestos' tienen átomos diferentes, 'Mezclas homogéneas' son combinaciones de varias sustancias, y 'Moléculas diatómicas' son un tipo de molécula, no una categoría de sustancia pura simple.",
  },
  {
    id: 1346,
    area: "Química",
    text: "Unión química de 2 o más átomos diferentes los cuales pierden sus propiedades originales y adquieren otras nuevas:",
    options: [
    "Mezclas",
    "Moléculas",
    "Elementos",
    "Compuestos"
    ],
    correctIndex: 3,
    explanation: "La respuesta correcta es 'Compuestos' porque son sustancias formadas por la unión química de dos o más elementos diferentes, donde los átomos pierden sus propiedades originales y adquieren nuevas. Las 'Mezclas' no implican una unión química y los componentes conservan sus propiedades; los 'Elementos' son sustancias puras de un solo tipo de átomo; y las 'Moléculas' pueden ser de un solo elemento (como O2) y no necesariamente pierden sus propiedades originales.",
  },
  {
    id: 1347,
    area: "Química",
    text: "Tipo de mezcla en el que se observa una sola fase:",
    options: [
    "Mezcla heterogénea",
    "Emulsión temporal",
    "Suspensión coloidal",
    "Mezcla homogénea"
    ],
    correctIndex: 3,
    explanation: "La mezcla homogénea tiene una sola fase porque sus componentes se distribuyen uniformemente a nivel molecular. Las otras opciones presentan fases distinguibles o partículas visibles, como en suspensiones, emulsiones o mezclas heterogéneas.",
  },
  {
    id: 1348,
    area: "Química",
    text: "Tipo de mezcla en el que se muestran dos o más fases:",
    options: [
    "Sistemas coloidales",
    "Mezclas homogéneas",
    "Mezclas heterogéneas",
    "Disoluciones saturadas"
    ],
    correctIndex: 2,
    explanation: "Las mezclas heterogéneas presentan dos o más fases visibles a simple vista o con microscopio, a diferencia de las homogéneas (una sola fase), las disoluciones saturadas (homogéneas) y los coloidales (aparentemente homogéneos pero con partículas dispersas).",
  },
  {
    id: 1349,
    area: "Química",
    text: "Mezcla homogénea a nivel molecular o iónico de 2 o más sustancias que no reaccionan entre sí cuyos componentes soluto y solvente se encuentran en proporciones que varían entre cierto límite:",
    options: [
    "Solución",
    "Coloide",
    "Emulsión",
    "Suspensión"
    ],
    correctIndex: 0,
    explanation: "La respuesta correcta es 'Solución' porque es una mezcla homogénea a nivel molecular o iónico, donde las partículas del soluto (menores a 1 nm) se dispersan uniformemente en el solvente. Las opciones incorrectas son mezclas heterogéneas o con partículas de mayor tamaño: la suspensión tiene partículas visibles que sedimentan, el coloide tiene partículas intermedias (1-1000 nm) que no sedimentan pero dispersan la luz, y la emulsión es un tipo de coloide líquido-líquido.",
  },
  {
    id: 1350,
    area: "Química",
    text: "Soluto:",
    options: [
    "Componente en menor cantidad",
    "Componente en mayor cantidad",
    "Mezcla homogénea de dos fases",
    "Sustancia que se disuelve"
    ],
    correctIndex: 0,
    explanation: "En química, el soluto es el componente que se encuentra en menor cantidad en una disolución, mientras que el disolvente está en mayor cantidad. Las opciones incorrectas confunden el soluto con el disolvente (mayor cantidad) o con la disolución misma (mezcla homogénea).",
  },
  {
    id: 1351,
    area: "Química",
    text: "Solvente:",
    options: [
    "Componente en mayor cantidad, generalmente el agua",
    "Sustancia que se disuelve en un líquido",
    "Componente que se encuentra en menor proporción",
    "Mezcla homogénea de dos o más sustancias"
    ],
    correctIndex: 0,
    explanation: "En química, el solvente es el componente que está en mayor cantidad en una disolución, generalmente el agua, y disuelve al soluto. Las opciones incorrectas confunden el solvente con el soluto (sustancia que se disuelve) o con la definición de disolución.",
  },
  {
    id: 1352,
    area: "Química",
    text: "Métodos de separación de una mezcla:",
    options: [
    "Destilación, sublimación, evaporación, filtración, decantación, centrifugación, cromatografía, cristalización, tamizado",
    "Centrifugación, destilación, cromatografía, evaporación, cristalización, decantación, filtración, sublimación, imantación",
    "Filtración, decantación, destilación, cromatografía, centrifugación, evaporación, tamizado, cristalización, imantación",
    "Cromatografía, destilación, evaporación, filtración, decantación, centrifugación, cristalización, sublimación, tamizado"
    ],
    correctIndex: 1,
    explanation: "La respuesta correcta incluye los métodos de separación de mezclas más comunes en química: centrifugación, destilación, cromatografía, evaporación, cristalización, decantación, filtración, sublimación e imantación. Las opciones incorrectas son plausibles porque listan métodos válidos, pero omiten la imantación o incluyen 'tamizado' (que no es un método universalmente aceptado en el mismo nivel que los demás).",
  },
  {
    id: 1353,
    area: "Química",
    text: "Son átomos de un mismo elemento que tienen el mismo número atómico, pero difieren en su número de masa ya que varía el número de neutrones:",
    options: [
    "Isótopos",
    "Isómeros",
    "Isoelectrónicos",
    "Isóbaros"
    ],
    correctIndex: 0,
    explanation: "La respuesta correcta es isótopos porque son átomos del mismo elemento (igual número de protones) con diferente número de neutrones, lo que varía su masa atómica. Los isóbaros tienen igual masa pero distinto número atómico, los isómeros son compuestos con misma fórmula pero diferente estructura, y los isoelectrónicos tienen igual número de electrones pero distinto número atómico.",
  },
  {
    id: 1354,
    area: "Química",
    text: "Unión entre un átomo de carácter metálico y otro no metálico:",
    options: [
    "Enlace iónico",
    "Enlace covalente polar",
    "Puente de hidrógeno",
    "Enlace metálico"
    ],
    correctIndex: 0,
    explanation: "La unión entre un metal y un no metal se caracteriza por la transferencia de electrones, formando iones que se atraen electrostáticamente (enlace iónico). El enlace covalente polar ocurre entre no metales, el metálico entre átomos del mismo metal y el puente de hidrógeno es una interacción intermolecular, no un enlace químico primario.",
  },
  {
    id: 1355,
    area: "Química",
    text: "Enlace que se efectúa entre 2 elementos de carácter no metálico:",
    options: [
    "Enlace covalente",
    "Enlace iónico",
    "Enlace de hidrógeno",
    "Enlace metálico"
    ],
    correctIndex: 0,
    explanation: "La respuesta correcta es enlace covalente porque se forma cuando dos elementos no metálicos comparten electrones. El enlace iónico ocurre entre un metal y un no metal, el metálico entre átomos de un mismo metal, y el de hidrógeno es una interacción intermolecular, no un enlace primario.",
  },
  {
    id: 1356,
    area: "Español",
    text: "Característica de la función referencial de la lengua:",
    options: [
    "Establecer contacto social",
    "Expresar emociones",
    "Transmitir conocimientos",
    "Modificar la conducta del oyente"
    ],
    correctIndex: 2,
    explanation: "La función referencial se centra en el contexto y en transmitir información objetiva sobre la realidad, por lo que su característica principal es transmitir conocimientos. Las opciones incorrectas corresponden a otras funciones del lenguaje: expresar emociones (función emotiva), establecer contacto social (función fática) y modificar la conducta (función apelativa o conativa).",
  },
  {
    id: 1357,
    area: "Español",
    text: "Características de la función apelativa de la lengua:",
    options: [
    "Busca establecer o mantener el contacto comunicativo entre los hablantes",
    "Se enfoca en expresar emociones y estados de ánimo del emisor",
    "Se utiliza para describir objetivamente la realidad o los hechos",
    "Tiene como objetivo convencer o persuadir al interlocutor para que cambie su punto de vista"
    ],
    correctIndex: 3,
    explanation: "La función apelativa (o conativa) busca influir en el receptor para modificar su conducta o pensamiento, como en órdenes o anuncios publicitarios. Las opciones incorrectas corresponden a las funciones expresiva (emisor), fática (canal) y referencial (contexto), respectivamente.",
  },
  {
    id: 1358,
    area: "Español",
    text: "Características de la función fática de la lengua:",
    options: [
    "Se centra en el mensaje mismo y su estructura gramatical",
    "Busca persuadir al receptor para modificar su conducta",
    "Expresa emociones y estados de ánimo del emisor",
    "Establece una comunicación casual, breve o informal"
    ],
    correctIndex: 3,
    explanation: "La función fática se enfoca en mantener o verificar el canal de comunicación, por lo que suele ser breve y casual. Las opciones incorrectas describen, respectivamente, la función metalingüística (centrada en el código), la apelativa (busca influir en el receptor) y la expresiva (manifiesta sentimientos del emisor).",
  },
  {
    id: 1359,
    area: "Español",
    text: "Características de la función poética de la lengua:",
    options: [
    "Expresa los sentimientos del autor, a través de los poemas",
    "Busca informar objetivamente sobre un tema específico",
    "Utiliza un lenguaje coloquial para establecer contacto",
    "Se enfoca en convencer al receptor de una idea"
    ],
    correctIndex: 0,
    explanation: "La función poética se centra en la forma del mensaje para expresar emociones y subjetividad del autor, como en poemas. Las opciones incorrectas describen la función referencial (informativa), apelativa (persuasiva) y fática (contacto), respectivamente.",
  },
  {
    id: 1360,
    area: "Español",
    text: "Características de la función metalingüística de la lengua:",
    options: [
    "Permite corregir errores de pronunciación en los hablantes",
    "Busca verificar la claridad del mensaje emitido",
    "Se enfoca en la estructura gramatical de las oraciones",
    "Tiene como objetivo hablar del lenguaje mismo"
    ],
    correctIndex: 3,
    explanation: "La función metalingüística se usa cuando el lenguaje habla de sí mismo, como al definir una palabra. Las otras opciones se refieren a funciones normativa (gramática), fática (verificar canal) o correctiva, que no son metalingüísticas.",
  },
  {
    id: 1361,
    area: "Español",
    text: "¿Para qué sirve una ficha bibliográfica?",
    options: [
    "Clasifica los libros según su género literario",
    "Organiza los libros en un estante de la biblioteca",
    "Registra los datos que identifican a un libro",
    "Resume el contenido principal de una obra"
    ],
    correctIndex: 2,
    explanation: "La ficha bibliográfica sirve para registrar los datos de identificación de un libro (autor, título, editorial, año), no para organizar físicamente los libros, clasificarlos por género ni resumir su contenido, que son funciones de otros recursos bibliotecarios o de estudio.",
  },
  {
    id: 1362,
    area: "Español",
    text: "¿Qué elementos tiene una ficha bibliográfica?",
    options: [
    "Autor, título, número de páginas, año de publicación, género literario",
    "Autor, fecha de publicación, título, país de origen, ilustrador, índice",
    "Autor, título, editorial, número de edición, ISBN, resumen del contenido",
    "Autor, fecha de publicación, título, edición, lugar de publicación, editorial"
    ],
    correctIndex: 3,
    explanation: "La respuesta correcta incluye los elementos esenciales para identificar una fuente: autor, fecha, título, edición, lugar y editorial. Las opciones incorrectas añaden datos secundarios (como género, ISBN o ilustrador) o cambian elementos clave (como país de origen), que no son parte de la ficha bibliográfica estándar.",
  },
  {
    id: 1363,
    area: "Español",
    text: "¿Qué es una referencia?",
    options: [
    "Es la paráfrasis de las ideas principales de un autor en tus propias palabras",
    "Son datos que identifican el origen de la información que utilizamos para hacer nuestra investigación",
    "Es una lista de todas las fuentes consultadas al final de un trabajo académico",
    "Es una nota al pie que aclara o amplía una idea dentro del texto"
    ],
    correctIndex: 1,
    explanation: "La respuesta correcta define la referencia como los datos que identifican el origen de la información (autor, título, año, etc.), no como la lista final (bibliografía), la nota aclaratoria (nota al pie) ni la paráfrasis (resumen interpretativo).",
  },
  {
    id: 1364,
    area: "Español",
    text: "¿Qué es una síntesis?",
    options: [
    "Son palabras que utiliza el lector para explicar el contenido de algún texto",
    "Es una paráfrasis que reescribe el texto con palabras propias",
    "Es un resumen breve que conserva las ideas principales del autor",
    "Es la interpretación personal que hace el lector sobre el texto"
    ],
    correctIndex: 0,
    explanation: "La síntesis es una elaboración del lector que condensa y explica el contenido con sus propias palabras, no solo conserva ideas del autor (resumen), ni se limita a interpretar (interpretación) o reescribir (paráfrasis).",
  },
  {
    id: 1365,
    area: "Español",
    text: "¿Qué es un resumen?",
    options: [
    "Es una paráfrasis completa del texto original, utilizando sinónimos para evitar el plagio",
    "Es una reducción de algún texto, considerando los datos esenciales, sin modificar las ideas originales",
    "Es una interpretación personal de un texto, donde se destacan las ideas que el lector considera más importantes",
    "Es una copia textual de las partes principales de un documento, manteniendo la estructura original"
    ],
    correctIndex: 1,
    explanation: "La respuesta correcta es acertada porque el resumen debe reducir el texto sin alterar las ideas del autor, solo extrayendo lo esencial. Las opciones incorrectas fallan al introducir interpretación personal (opción 1), copia textual (opción 2) o paráfrasis total sin reducción (opción 3), que no cumplen con la función de síntesis objetiva.",
  },
  {
    id: 1366,
    area: "Español",
    text: "¿Qué es una cita textual?",
    options: [
    "Es la paráfrasis de un texto usando sinónimos y estructura propia",
    "Es cuando se copia una idea de un autor sin mencionar su nombre",
    "Es un fragmento donde se ocupan palabras que dijo otra persona",
    "Es un resumen breve de las ideas principales de un texto leído"
    ],
    correctIndex: 2,
    explanation: "La cita textual reproduce exactamente las palabras de otra persona, entre comillas, dando crédito al autor. Las opciones incorrectas confunden la cita textual con plagio (sin mencionar al autor), paráfrasis (decir lo mismo con otras palabras) o resumen (sintetizar ideas).",
  },
  {
    id: 1367,
    area: "Español",
    text: "¿Qué es la paráfrasis?",
    options: [
    "Es cuando explicamos con nuestras propias palabras algo difícil de entender",
    "Es cuando resumimos un texto eliminando detalles secundarios",
    "Es cuando traducimos un texto de un idioma a otro",
    "Es cuando copiamos textualmente un fragmento de un texto original"
    ],
    correctIndex: 0,
    explanation: "La paráfrasis consiste en expresar con palabras propias una idea ajena para hacerla más comprensible, sin copiar ni traducir literalmente. Las opciones incorrectas confunden este proceso con la cita textual, el resumen o la traducción.",
  },
  {
    id: 1368,
    area: "Español",
    text: "¿Qué es un comentario?",
    options: [
    "Es dar a conocer la opinión que el receptor tiene sobre un tema",
    "Es la acción de resumir las ideas principales de un texto",
    "Es la interpretación literal de un mensaje sin añadir opinión",
    "Es el proceso de analizar la estructura gramatical de una oración"
    ],
    correctIndex: 0,
    explanation: "La respuesta correcta es 'dar a conocer la opinión que el receptor tiene sobre un tema' porque un comentario implica una valoración personal del receptor. Las opciones incorrectas se alejan de esa subjetividad: una es resumir (no opinar), otra es interpretar sin opinión (objetividad), y la tercera es análisis gramatical (técnico, no opinativo).",
  },
  {
    id: 1369,
    area: "Español",
    text: "Función del título en un texto:",
    options: [
    "Indica el género literario al que pertenece la obra",
    "Anticipa la postura del autor sobre el tema tratado",
    "Permite identificar el ámbito al que pertenece un texto",
    "Resume el contenido principal del texto de manera sintética"
    ],
    correctIndex: 2,
    explanation: "La función principal del título es orientar al lector sobre el ámbito o campo de conocimiento del texto (científico, literario, periodístico, etc.). Las opciones incorrectas, aunque plausibles, describen funciones secundarias o posibles, pero no la función esencial y definitoria del título.",
  },
  {
    id: 1370,
    area: "Español",
    text: "Función del tema en un texto:",
    options: [
    "Es la estructura gramatical que organiza los párrafos del texto",
    "Es la idea central de lo que tratará el texto",
    "Es la frase que resume el contenido del primer párrafo",
    "Es el conjunto de oraciones que desarrollan una idea secundaria"
    ],
    correctIndex: 1,
    explanation: "La respuesta correcta es la idea central del texto; los distractores confunden el tema con el desarrollo de ideas secundarias, el resumen del primer párrafo o la estructura gramatical, que son elementos distintos.",
  },
  {
    id: 1371,
    area: "Español",
    text: "Función del índice en un texto:",
    options: [
    "Presenta la síntesis de las ideas principales del texto",
    "Organiza la información del texto en orden alfabético",
    "Indica la fecha de publicación y el autor del texto",
    "Muestra el contenido del texto organizado por número de página"
    ],
    correctIndex: 3,
    explanation: "La función del índice es mostrar el contenido del texto organizado por número de página, facilitando la localización de temas. Las alternativas son incorrectas porque describen respectivamente un resumen, un glosario o una ficha bibliográfica, no la función específica del índice.",
  },
  {
    id: 1372,
    area: "Español",
    text: "¿Qué son los apartados en un texto?",
    options: [
    "Son las partes generales en las que se divide un texto",
    "Son los elementos gráficos como tablas e imágenes que complementan la información",
    "Son los títulos y subtítulos que organizan el contenido",
    "Son los párrafos que desarrollan una idea principal"
    ],
    correctIndex: 0,
    explanation: "La respuesta correcta es 'Son las partes generales en las que se divide un texto' porque los apartados son divisiones estructurales (como introducción, desarrollo, conclusión), no los títulos, párrafos o elementos gráficos, que son componentes más específicos dentro de esas partes.",
  },
  {
    id: 1373,
    area: "Español",
    text: "¿Qué función tienen las ilustraciones en un texto?",
    options: [
    "Sustituyen la lectura del texto principal para ahorrar tiempo",
    "Indican al lector los puntos clave sin necesidad de leer párrafos",
    "Sirven únicamente como decoración estética del documento",
    "Se utilizan para reforzar visualmente el contenido del texto"
    ],
    correctIndex: 3,
    explanation: "La respuesta correcta es que las ilustraciones refuerzan visualmente el contenido, facilitando la comprensión y retención. Las opciones incorrectas son plausibles pero erróneas: ni sustituyen la lectura (son complementarias), ni son solo decorativas (tienen función didáctica), ni eliminan la necesidad de leer (apoyan, no reemplazan).",
  },
  {
    id: 1374,
    area: "Español",
    text: "¿Qué función tienen las gráficas o tablas en un texto?",
    options: [
    "Sustituyen la información textual para que el lector no tenga que leer todo el párrafo",
    "Explican visualmente los datos estadísticos que contiene el texto",
    "Organizan cronológicamente los eventos narrados en el texto",
    "Ilustran el contenido literario del texto mediante metáforas visuales"
    ],
    correctIndex: 1,
    explanation: "La respuesta correcta señala que gráficas y tablas cumplen la función de representar visualmente datos estadísticos, facilitando su comprensión. Las opciones incorrectas confunden esta función con la de resumir, ilustrar metáforas o narrar eventos, que no corresponden al propósito de estos recursos en textos expositivos.",
  },
  {
    id: 1375,
    area: "Español",
    text: "¿Qué función tienen las negritas y las cursivas en un texto?",
    options: [
    "Sirven para señalar citas textuales de otros autores",
    "Se usan para indicar el inicio de un párrafo nuevo",
    "Tienen la finalidad de resaltar los textos",
    "Indican cambios de tono o de voz en la narración"
    ],
    correctIndex: 2,
    explanation: "La respuesta correcta es que las negritas y cursivas resaltan palabras o frases para dar énfasis. Las opciones incorrectas confunden su función con la sangría (inicio de párrafo), el uso de comillas (citas) o los guiones de diálogo (cambios de voz).",
  },
  {
    id: 1376,
    area: "Español",
    text: "¿Qué función tiene el subrayado en un texto?",
    options: [
    "Se utilizan para separar párrafos en un texto",
    "Se emplean para corregir errores ortográficos",
    "Se usan para destacar una idea importante en el texto",
    "Sirven para indicar el final de una oración"
    ],
    correctIndex: 2,
    explanation: "El subrayado resalta información clave para facilitar su localización y estudio. Las otras opciones corresponden a funciones del punto y aparte (separar párrafos), del punto final (terminar oraciones) o del corrector ortográfico, no del subrayado.",
  },
  {
    id: 1377,
    area: "Español",
    text: "¿Qué es una oración temática?",
    options: [
    "Es la oración que contiene el sujeto y el predicado principal de la oración compuesta",
    "Es aquella que resume todo el contenido del texto en una sola frase",
    "Es la primera oración de cada párrafo que introduce el tema a tratar",
    "Es aquella que contiene la idea principal en un párrafo"
    ],
    correctIndex: 3,
    explanation: "La oración temática es la que expresa la idea central de un párrafo, guiando el desarrollo del mismo. Las opciones incorrectas confunden su función: no siempre es la primera oración, no resume todo el texto (eso es el resumen), y no se refiere a la estructura gramatical de una oración compuesta.",
  },
  {
    id: 1378,
    area: "Español",
    text: "¿Qué es una oración?",
    options: [
    "Unidad mínima de significado con autonomía sintáctica",
    "Conjunto de palabras con sentido completo",
    "Estructura gramatical que carece de verbo conjugado",
    "Grupo de palabras que expresa una idea incompleta"
    ],
    correctIndex: 1,
    explanation: "La oración es un conjunto de palabras con sentido completo, autonomía sintáctica y entonación propia. Las opciones incorrectas describen, respectivamente, al morfema (unidad mínima de significado), a la frase o enunciado incompleto, y al sintagma nominal (que puede carecer de verbo), pero ninguna cumple con todos los requisitos de una oración.",
  },
  {
    id: 1379,
    area: "Español",
    text: "¿Qué es el verbo?",
    options: [
    "Es la palabra que sustituye al nombre o sustantivo para evitar su repetición en el texto",
    "Es la palabra que modifica al sustantivo y expresa cualidades o características del mismo",
    "Es la palabra que enlaza o conecta dos elementos dentro de la oración, como sustantivos o proposiciones",
    "Es la palabra más importante de la oración, la cual indica la acción que realiza el sujeto"
    ],
    correctIndex: 3,
    explanation: "La respuesta correcta es la que define al verbo como el núcleo del predicado, indicando acción, estado o proceso. Las opciones incorrectas describen respectivamente al adjetivo (modifica al sustantivo), a la conjunción (enlaza elementos) y al pronombre (sustituye al nombre), que son categorías gramaticales distintas.",
  },
  {
    id: 1380,
    area: "Español",
    text: "¿Qué es el sustantivo?",
    options: [
    "Parte de la oración que expresa una acción o estado",
    "Persona, animal o cosa que realiza la acción del verbo",
    "Conjunto de letras que forman una idea completa",
    "Palabra que modifica al verbo en una oración"
    ],
    correctIndex: 1,
    explanation: "El sustantivo es la palabra que nombra a la persona, animal o cosa que realiza o recibe la acción del verbo (sujeto). Las opciones incorrectas describen al adverbio, al verbo y a la oración, respectivamente.",
  },
  {
    id: 1381,
    area: "Español",
    text: "¿Qué es un nexo?",
    options: [
    "Signos de puntuación que indican pausas (coma, punto, punto y coma)",
    "Palabras que modifican al verbo (rápido, lentamente, bien, mal)",
    "Palabras que reemplazan al sustantivo (él, ella, ellos, ustedes)",
    "Palabras que unen oraciones (además, por ejemplo, finalmente, como, luego, después, antes, pero, aunque)"
    ],
    correctIndex: 3,
    explanation: "La respuesta correcta es 'Palabras que unen oraciones' porque los nexos (como 'y', 'pero', 'aunque') conectan elementos dentro de un texto. Las opciones incorrectas describen signos de puntuación, adverbios y pronombres, que no cumplen esa función de enlace.",
  },
  {
    id: 1382,
    area: "Español",
    text: "¿Qué función tiene la coma?",
    options: [
    "Señalar el inicio de un diálogo en un texto narrativo",
    "Indicar una pausa breve para separar oraciones subordinadas",
    "Sustituir a la conjunción 'y' en una enumeración cerrada",
    "Enumerar un listado de objetos en serie, como sustantivos, adjetivos o verbos"
    ],
    correctIndex: 3,
    explanation: "La coma sirve para separar elementos en una serie (sustantivos, adjetivos o verbos). Las opciones incorrectas confunden su uso: la pausa breve no define su función principal, el diálogo usa guiones o comillas, y la coma no sustituye a 'y' en enumeraciones cerradas.",
  },
  {
    id: 1383,
    area: "Español",
    text: "Función de un guion largo en un texto:",
    options: [
    "Indica una pausa más larga que el punto y seguido en la narración",
    "Sirve para unir dos palabras compuestas de origen extranjero",
    "Sirve para introducir diálogos de personajes en cuentos",
    "Se usa para separar el sujeto del predicado en oraciones complejas"
    ],
    correctIndex: 2,
    explanation: "El guion largo (—) se emplea en diálogos para marcar las intervenciones de los personajes, reemplazando las comillas. Las otras opciones describen usos incorrectos: la separación sujeto-predicado es función de la coma, la pausa larga pertenece al punto, y la unión de palabras compuestas es propia del guion corto (-).",
  },
  {
    id: 1384,
    area: "Español",
    text: "Función del punto y aparte en un texto:",
    options: [
    "Señalar el final de un párrafo",
    "Indicar una pausa breve",
    "Separar oraciones dentro de un párrafo",
    "Separar ideas"
    ],
    correctIndex: 3,
    explanation: "El punto y aparte se usa para separar ideas o párrafos distintos en un texto, no solo para marcar el final (eso lo hace cualquier punto), ni para pausas breves (función de la coma), ni para separar oraciones dentro del mismo párrafo (función del punto y seguido).",
  },
  {
    id: 1385,
    area: "Español",
    text: "Función de los paréntesis en un texto:",
    options: [
    "Se utilizan para separar las oraciones principales de las subordinadas",
    "Sirven para encerrar información, cuyo fin es explicativo",
    "Sirven para introducir citas textuales de otros autores en el texto",
    "Indican el inicio y final de un diálogo entre personajes en una narración"
    ],
    correctIndex: 1,
    explanation: "La respuesta correcta es que los paréntesis encierran información explicativa o aclaratoria dentro de un texto. Las opciones incorrectas confunden su función con la de otros signos: la coma o punto y coma separan oraciones, las comillas indican diálogos o citas textuales, y los guiones largos también pueden introducir citas, pero no es la función principal de los paréntesis.",
  },
  {
    id: 1386,
    area: "Español",
    text: "¿Qué es una noticia?",
    options: [
    "Género narrativo que describe detalladamente las características de un suceso histórico relevante",
    "Género periodístico que informa a la sociedad los acontecimientos más importantes ocurridos en su localidad y en el mundo",
    "Relato literario breve que narra hechos ficticios o reales con la intención de entretener al lector",
    "Texto argumentativo que expresa la opinión personal del autor sobre un tema de actualidad"
    ],
    correctIndex: 1,
    explanation: "La noticia es un género periodístico informativo, no literario ni de opinión. Su propósito es comunicar hechos de manera objetiva y veraz, a diferencia de los distractores que confunden con cuentos, artículos de opinión o crónicas históricas.",
  },
  {
    id: 1387,
    area: "Español",
    text: "¿Nombre que recibe el primer párrafo de una noticia?",
    options: [
    "Encabezado",
    "Entrada",
    "Titular",
    "Sumario"
    ],
    correctIndex: 1,
    explanation: "La entrada es el primer párrafo de una noticia, que resume los datos esenciales (qué, quién, cuándo, dónde, cómo y por qué). El encabezado y el titular se refieren al título, y el sumario es un resumen breve que a veces acompaña al titular, no al primer párrafo.",
  },
  {
    id: 1388,
    area: "Español",
    text: "¿Qué nombre recibe el desarrollo de la noticia?",
    options: [
    "Entrada de la noticia",
    "Cuerpo de la noticia",
    "Cierre de la noticia",
    "Titular de la noticia"
    ],
    correctIndex: 1,
    explanation: "La respuesta correcta es 'Cuerpo de la noticia' porque es la parte donde se desarrolla la información, después del titular y la entrada. Las otras opciones son incorrectas: la 'entrada' resume lo esencial, el 'titular' anuncia el tema, y el 'cierre' concluye o añade datos secundarios.",
  },
  {
    id: 1389,
    area: "Español",
    text: "¿Cómo llamamos al final de la noticia?",
    options: [
    "Conclusión",
    "Cierre",
    "Epílogo",
    "Remate"
    ],
    correctIndex: 3,
    explanation: "El remate es el cierre o desenlace de la noticia, que suele incluir un dato curioso o una reflexión. 'Cierre' es muy general, 'conclusión' se usa más en textos argumentativos y 'epílogo' en obras literarias, no en noticias.",
  },
  {
    id: 1390,
    area: "Español",
    text: "¿Qué es un verso?",
    options: [
    "Son los enunciados que forman un poema",
    "Es cada estrofa que compone un poema",
    "Son las pausas que se hacen al leer un poema",
    "Son las palabras que riman al final de cada línea"
    ],
    correctIndex: 0,
    explanation: "La respuesta correcta es que un verso es cada enunciado o línea que forma un poema. Las opciones incorrectas confunden el verso con la pausa (punto y aparte), con la rima (repetición de sonidos) o con la estrofa (conjunto de versos).",
  },
  {
    id: 1391,
    area: "Español",
    text: "¿Qué es la prosa?",
    options: [
    "Es una técnica de escritura que emplea figuras retóricas para embellecer el lenguaje",
    "Es un tipo de texto que se caracteriza por el uso de rima y métrica",
    "Es la forma natural que adoptamos al hablar",
    "Es un género literario que narra hechos ficticios en forma de cuento o novela"
    ],
    correctIndex: 2,
    explanation: "La prosa es la forma natural del lenguaje, sin sujeción a métrica ni rima, como la usamos al hablar o escribir cotidianamente. Las opciones incorrectas confunden la prosa con géneros narrativos específicos, la poesía o el lenguaje figurado, que son categorías distintas dentro de la literatura.",
  },
  {
    id: 1392,
    area: "Español",
    text: "¿Qué es un diálogo?",
    options: [
    "Monólogo interno donde una persona reflexiona en voz alta sin esperar respuesta",
    "Intercambio de mensajes escritos entre dos personas a través de cartas o correos electrónicos",
    "Conversación entre dos o más personas que exponen sus ideas o comentarios de forma alternativa",
    "Debate formal con reglas estrictas donde solo se permiten argumentos a favor y en contra"
    ],
    correctIndex: 2,
    explanation: "La respuesta correcta define el diálogo como una conversación alternada entre dos o más personas, característica esencial. Las opciones incorrectas son plausibles pero fallan: la primera describe un monólogo, no intercambio; la segunda se limita a escritura, excluyendo la oralidad; la tercera reduce el diálogo a un formato específico de debate, omitiendo su naturaleza abierta y cotidiana.",
  },
  {
    id: 1393,
    area: "Español",
    text: "¿Qué es una estrofa?",
    options: [
    "Unidad mínima de la poesía que expresa una idea completa",
    "Conjunto de versos que se ajustan a una medida y un ritmo",
    "Figura retórica que repite sonidos al final de los versos",
    "Tipo de rima que se da entre versos pares e impares"
    ],
    correctIndex: 1,
    explanation: "La estrofa es un grupo de versos con medida y ritmo fijos, no una unidad mínima (eso es el verso), ni una figura retórica (eso es la rima), ni un tipo de rima (eso es la rima alterna). Memoriza: 'estrofa = conjunto de versos con estructura'.",
  },
  {
    id: 1394,
    area: "Español",
    text: "¿Qué es una novela?",
    options: [
    "Obra de teatro dividida en actos que representa conflictos humanos mediante diálogos",
    "Obra literaria escrita en prosa, que narra una acción fingida en todo o en parte",
    "Composición escrita que combina elementos reales y fantásticos sin una estructura narrativa definida",
    "Género literario que se escribe exclusivamente en verso y relata hazañas heroicas"
    ],
    correctIndex: 1,
    explanation: "La novela es una obra narrativa en prosa, con argumento ficticio total o parcial, a diferencia de las opciones incorrectas que describen el poema épico (verso), la obra teatral (actos y diálogos) o una composición sin estructura narrativa clara.",
  },
  {
    id: 1395,
    area: "Español",
    text: "¿Qué es una obra de teatro?",
    options: [
    "Es una forma literaria, constituida por diálogos entre personajes, representadas por actores en un foro",
    "Es una composición narrativa que describe las acciones de los personajes a través de un narrador, y se representa en un escenario",
    "Es un género literario que se escribe en verso y se recita frente a un público, sin necesidad de actores ni escenografía",
    "Es un texto escrito en prosa que contiene monólogos extensos, y su principal objetivo es ser leído en voz alta por un solo lector"
    ],
    correctIndex: 0,
    explanation: "La respuesta correcta define la obra de teatro como una forma literaria con diálogos y representación actoral, elementos esenciales del género dramático. Las opciones incorrectas confunden el teatro con la poesía recitada, la narrativa con narrador, o el monólogo como formato exclusivo, omitiendo los diálogos y la actuación colectiva.",
  },
  {
    id: 1396,
    area: "Español",
    text: "¿Qué es una autobiografía?",
    options: [
    "Son textos donde el mismo personaje cuenta su historia, organizada por su nacimiento, infancia, adolescencia y adultez, habla de sus recuerdos",
    "Es un texto literario donde un autor escribe sobre la vida de otra persona, resaltando sus logros y fechas importantes",
    "Es un documento histórico que recopila datos verificables de la vida de un personaje famoso, escrito por un biógrafo profesional",
    "Es una narración ficticia en la que el protagonista inventa su pasado para crear una historia emocionante y entretenida"
    ],
    correctIndex: 0,
    explanation: "La autobiografía es un relato de la propia vida escrito por el mismo protagonista, en orden cronológico y con énfasis en recuerdos personales. Las opciones incorrectas confunden el género con la biografía (escrita por otro), la ficción o un documento histórico objetivo.",
  },
  {
    id: 1397,
    area: "Español",
    text: "¿Qué es un sinónimo?",
    options: [
    "Es cuando las palabras tienen significados opuestos y se usan para contrastar ideas",
    "Es cuando dos palabras se escriben igual, pero tienen diferente significado",
    "Es cuando las palabras tienen el mismo significado, pero se escriben y pronuncian diferente",
    "Es cuando las palabras tienen el mismo significado y la misma escritura, pero se pronuncian diferente"
    ],
    correctIndex: 2,
    explanation: "La respuesta correcta define sinónimo como palabras con igual significado, pero distinta escritura y pronunciación. Las opciones incorrectas describen respectivamente homónimos (palabras iguales, significado diferente), homógrafos (misma escritura, diferente significado) y antónimos (significados opuestos).",
  },
  {
    id: 1398,
    area: "Español",
    text: "¿Qué es un antónimo?",
    options: [
    "Es cuando las palabras tienen significado opuesto, pero se escriben igual y se pronuncian igual",
    "Es cuando las palabras tienen significado similar, se escriben y pronuncian diferente",
    "Es cuando las palabras tienen significado opuesto, se escriben y pronuncian diferente",
    "Es cuando las palabras tienen el mismo significado, pero se escriben diferente"
    ],
    correctIndex: 2,
    explanation: "La respuesta correcta define al antónimo como palabras con significado opuesto, escritura y pronunciación distintas. Los distractores confunden con sinónimos (mismo significado), homógrafos (misma escritura y pronunciación con significado opuesto, que no es el caso común) y cuasisinónimos (significado similar, no opuesto).",
  },
  {
    id: 1399,
    area: "Español",
    text: "En matemáticas, ¿Qué es un término semejante?",
    options: [
    "Dos o más términos son semejantes si tienen el mismo significado o raíz léxica en un texto",
    "Dos o más términos son semejantes si comparten la misma función gramatical dentro de una oración",
    "Dos o más términos son semejantes, si tienen la misma parte literal y el mismo exponente",
    "Dos o más términos son semejantes si aparecen en el mismo párrafo y tienen la misma sílaba tónica"
    ],
    correctIndex: 2,
    explanation: "La respuesta correcta es propia de matemáticas: términos semejantes comparten la misma parte literal y exponente. Las opciones incorrectas confunden el concepto con aspectos del área de Español como significado, función gramatical o acentuación, que no aplican en álgebra.",
  },
  {
    id: 1400,
    area: "Español",
    text: "¿Qué es un experimento?",
    options: [
    "Es una reflexión subjetiva sobre un hecho observado",
    "Es la descripción detallada de un fenómeno natural",
    "Es una reproducción controlada de algún fenómeno observado",
    "Es un texto literario que narra un suceso real"
    ],
    correctIndex: 2,
    explanation: "Un experimento es una reproducción controlada de un fenómeno para estudiarlo, no solo una descripción (opción 1), una reflexión subjetiva (opción 2) o un texto literario (opción 3). En español, se distingue por su metodología objetiva y verificable.",
  },
  {
    id: 1401,
    area: "Español",
    text: "¿Qué es un experimento aleatorio?",
    options: [
    "Es un tipo de ensayo que analiza un fenómeno social con datos verificables",
    "Es un evento que puede tener diferentes resultados y no se puede predecir",
    "Es una obra dramática que representa acciones humanas de manera predecible",
    "Es un texto literario que narra hechos ficticios basados en la imaginación del autor"
    ],
    correctIndex: 1,
    explanation: "La respuesta correcta define un experimento aleatorio como un evento con múltiples resultados impredecibles, característico de probabilidad. Las alternativas son incorrectas porque describen géneros literarios (narración, ensayo, drama) que no se relacionan con la incertidumbre de un experimento aleatorio en español.",
  },
  {
    id: 1402,
    area: "Español",
    text: "¿Qué es un experimento determinístico?",
    options: [
    "Es un evento cuyo resultado se conoce previamente y no puede variar",
    "Es un experimento que se repite varias veces para confirmar una hipótesis",
    "Es un experimento en el que el resultado depende del azar y no se puede predecir",
    "Es un tipo de texto que expone hechos objetivos sin opiniones del autor"
    ],
    correctIndex: 0,
    explanation: "La respuesta correcta se refiere a eventos cuyo resultado es conocido de antemano, sin variación. Las opciones incorrectas confunden con textos expositivos (objetivos), con experimentos aleatorios (dependientes del azar) o con procedimientos repetitivos (que no garantizan certeza previa).",
  },
  {
    id: 1403,
    area: "Español",
    text: "¿Cómo se calcula la probabilidad?",
    options: [
    "Sumando todos los resultados posibles de un experimento aleatorio",
    "Dividiendo el número de casos favorables para algún evento entre el total del casos",
    "Multiplicando la frecuencia de un suceso por el número total de observaciones",
    "Restando la probabilidad complementaria del evento de uno"
    ],
    correctIndex: 1,
    explanation: "La probabilidad se calcula mediante la regla de Laplace: casos favorables entre casos totales. Las opciones incorrectas confunden operaciones básicas como sumar, multiplicar o restar, que no corresponden a la definición clásica de probabilidad.",
  },
  {
    id: 1404,
    area: "Matemáticas",
    text: "¿Qué es un ángulo?",
    options: [
    "Es la región del plano comprendida entre dos rectas que se cortan",
    "Es la abertura que se forma, al intersecarse dos rectas en un punto llamado vértice",
    "Es la distancia entre dos puntos de una recta que se cruzan en un vértice",
    "Es la medida de la inclinación entre dos rectas que se intersectan en un punto"
    ],
    correctIndex: 1,
    explanation: "La respuesta correcta define al ángulo como la abertura formada por dos rectas que se intersecan en un vértice. Las opciones incorrectas son plausibles pero erróneas: la primera confunde ángulo con región del plano, la segunda con medida de inclinación (que es una propiedad, no la definición), y la tercera mezcla distancia con intersección de rectas.",
  },
  {
    id: 1405,
    area: "Matemáticas",
    text: "¿Cuántos grados mide un ángulo recto y un ángulo llano?",
    options: [
    "Recto 90°, llano 360°",
    "Recto 60°, llano 120°",
    "Recto 90°, llano 180°",
    "Recto 45°, llano 180°"
    ],
    correctIndex: 2,
    explanation: "Un ángulo recto mide exactamente 90°, formado por dos rectas perpendiculares; un ángulo llano mide 180°, equivalente a media vuelta. Las opciones incorrectas confunden estos valores con ángulos complementarios (45°), completos (360°) o de triángulos equiláteros (60°).",
  },
  {
    id: 1406,
    area: "Matemáticas",
    text: "¿Qué son las rectas paralelas?",
    options: [
    "Son rectas que se acercan progresivamente sin llegar a tocarse",
    "Son rectas que se intersectan en algún punto del plano, sin importar el ángulo",
    "Son rectas que se cruzan en un punto formando un ángulo de 90 grados",
    "Son rectas que nunca se juntan y siempre guardan la misma distancia entre ellas"
    ],
    correctIndex: 3,
    explanation: "Las rectas paralelas son aquellas que, en un mismo plano, nunca se intersectan y mantienen una distancia constante; la primera opción describe rectas perpendiculares, la segunda describe rectas secantes, y la tercera describe asíntotas, no paralelismo.",
  },
  {
    id: 1407,
    area: "Matemáticas",
    text: "¿Qué son las rectas perpendiculares?",
    options: [
    "Son rectas que al intersecarse forman cuatro ángulos rectos",
    "Son rectas que nunca se intersectan y mantienen la misma distancia",
    "Son rectas que se cortan formando un ángulo de 90 grados",
    "Son rectas que al intersecarse forman dos ángulos agudos y dos obtusos"
    ],
    correctIndex: 0,
    explanation: "La respuesta correcta define rectas perpendiculares como aquellas que al cruzarse generan cuatro ángulos rectos de 90°. La primera opción describe correctamente el ángulo pero no menciona los cuatro ángulos; la segunda describe rectas paralelas; la tercera describe cualquier intersección oblicua, no perpendicular.",
  },
  {
    id: 1408,
    area: "Matemáticas",
    text: "¿Cómo se calculan las diagonales desde un solo vértice en un polígono?",
    options: [
    "d = n - 1",
    "d = n - 2",
    "d = n / 2",
    "d = n - 3 (donde n es el número de lados)"
    ],
    correctIndex: 3,
    explanation: "La fórmula correcta d = n - 3 se debe a que desde un vértice no puedes trazar diagonales hacia sí mismo ni hacia los dos vértices adyacentes, por lo que restas 3 del total de lados. Las opciones incorrectas confunden este cálculo con otras propiedades de polígonos, como el número de triángulos en una triangulación (n-2) o aproximaciones sin justificación geométrica.",
  },
  {
    id: 1409,
    area: "Matemáticas",
    text: "¿Cómo se calcula el total de diagonales en un polígono?",
    options: [
    "D = n(n-4)/2",
    "D = n(n-3)",
    "D = n(n-3)/2 (donde n es el número de lados)",
    "D = n(n-1)/2"
    ],
    correctIndex: 2,
    explanation: "La fórmula D = n(n-3)/2 surge de que cada vértice puede trazar diagonales a los otros n-3 vértices (excluyendo sí mismo y sus dos adyacentes), y como cada diagonal se cuenta dos veces, se divide entre 2. Las opciones incorrectas omiten la división o usan valores erróneos como n-1 o n-4.",
  },
  {
    id: 1410,
    area: "Matemáticas",
    text: "¿Cómo se calcula la suma de los ángulos interiores de un polígono?",
    options: [
    "S = 180°(n + 2)",
    "S = 360°(n - 2)",
    "S = 180°(n - 2) (donde n es el número de lados)",
    "S = 180°(n - 1)"
    ],
    correctIndex: 2,
    explanation: "La fórmula correcta S = 180°(n - 2) se obtiene al dividir el polígono en (n - 2) triángulos desde un vértice, cada uno suma 180°. Las opciones incorrectas alteran el factor (n - 2) o la constante, lo que no corresponde con la triangulación del polígono.",
  },
  {
    id: 1411,
    area: "Matemáticas",
    text: "¿Cuántos grados suman los ángulos interiores de un triángulo?",
    options: [
    "180°",
    "270°",
    "90°",
    "360°"
    ],
    correctIndex: 0,
    explanation: "La suma de los ángulos interiores de cualquier triángulo siempre es 180°. Las opciones incorrectas corresponden a la suma de ángulos de un cuadrilátero (360°), o a valores que podrían confundirse con ángulos de triángulos rectángulos o suma parcial.",
  },
  {
    id: 1412,
    area: "Matemáticas",
    text: "¿Cuántos grados suman los ángulos interiores de un cuadrilátero?",
    options: [
    "360°",
    "540°",
    "270°",
    "180°"
    ],
    correctIndex: 0,
    explanation: "La suma de los ángulos interiores de un cuadrilátero es 360° porque puede dividirse en dos triángulos (cada uno suma 180°). Las opciones incorrectas corresponden a sumas de otras figuras: 180° es de un triángulo, 270° no corresponde a ningún polígono convexo común, y 540° es de un pentágono.",
  },
  {
    id: 1413,
    area: "Matemáticas",
    text: "Congruencia de triángulos:",
    options: [
    "Se dice que dos triángulos son congruentes si sus lados correspondientes son proporcionales",
    "Se dice que dos triángulos son congruentes si tienen la misma forma y el mismo tamaño",
    "Se dice que dos triángulos son congruentes si sus ángulos correspondientes son iguales",
    "Se dice que dos triángulos son congruentes si tienen la misma área y el mismo perímetro"
    ],
    correctIndex: 1,
    explanation: "La congruencia exige igualdad total en forma y tamaño, no solo área y perímetro (que pueden coincidir sin ser iguales), ni solo ángulos (caso de semejanza), ni lados proporcionales (también semejanza). La respuesta correcta es la única que garantiza superposición exacta.",
  },
  {
    id: 1414,
    area: "Matemáticas",
    text: "Semejanza de triángulos:",
    options: [
    "Dos triángulos son semejantes si sus lados son proporcionales y sus ángulos suman 180 grados",
    "Dos triángulos son semejantes si tienen la misma forma y el mismo tamaño, pero están rotados",
    "Se dice que dos triángulos son semejantes si tienen la misma forma y diferente tamaño",
    "Dos triángulos son semejantes si tienen al menos dos lados iguales y un ángulo igual"
    ],
    correctIndex: 2,
    explanation: "La respuesta correcta es que los triángulos semejantes comparten la misma forma (ángulos iguales) pero pueden tener diferente tamaño (lados proporcionales). Las opciones incorrectas confunden semejanza con congruencia (mismo tamaño), mezclan propiedades generales de triángulos (suma de ángulos) o describen criterios de congruencia (LAL).",
  },
  {
    id: 1415,
    area: "Matemáticas",
    text: "¿Qué dice el teorema de Pitágoras?",
    options: [
    "En todo triángulo, la suma de los cuadrados de dos lados es igual al cuadrado del tercer lado dividido entre dos",
    "'En todo triángulo rectángulo, el cuadrado de la hipotenusa es igual a la suma de los cuadrados de los catetos' c² = a² + b²",
    "En todo triángulo rectángulo, el cuadrado de un cateto es igual a la suma de los cuadrados de la hipotenusa y el otro cateto",
    "En todo triángulo rectángulo, la hipotenusa es igual a la suma de los catetos elevada al cuadrado"
    ],
    correctIndex: 1,
    explanation: "La respuesta correcta es c² = a² + b², que describe la relación fundamental entre los lados de un triángulo rectángulo. Las opciones incorrectas alteran esta relación: una invierte los términos, otra aplica una división sin fundamento y la tercera suma los catetos antes de elevar al cuadrado, lo cual es algebraicamente diferente.",
  },
  {
    id: 1416,
    area: "Matemáticas",
    text: "¿Cuál es la razón trigonométrica del seno?",
    options: [
    "Seno = hipotenusa/cateto opuesto",
    "Seno = cateto adyacente/hipotenusa",
    "Seno = cateto opuesto/hipotenusa",
    "Seno = cateto opuesto/cateto adyacente"
    ],
    correctIndex: 2,
    explanation: "La razón seno se define como cateto opuesto entre hipotenusa en un triángulo rectángulo. Las opciones incorrectas corresponden a otras razones: coseno, tangente y cosecante respectivamente, lo que es un error común al confundir las definiciones.",
  },
  {
    id: 1417,
    area: "Matemáticas",
    text: "¿Cuál es la razón trigonométrica del coseno?",
    options: [
    "Coseno = hipotenusa/cateto adyacente",
    "Coseno = cateto opuesto/hipotenusa",
    "Coseno = cateto adyacente/hipotenusa",
    "Coseno = cateto adyacente/cateto opuesto"
    ],
    correctIndex: 2,
    explanation: "La respuesta correcta es coseno = cateto adyacente/hipotenusa, que es la definición estándar en un triángulo rectángulo. Las opciones incorrectas confunden el coseno con el seno (cateto opuesto/hipotenusa), con la tangente (cateto adyacente/cateto opuesto) o invierten la razón, lo cual corresponde a la secante.",
  },
  {
    id: 1418,
    area: "Matemáticas",
    text: "¿Cuál es la razón trigonométrica de la tangente?",
    options: [
    "Tangente = cateto adyacente/cateto opuesto",
    "Tangente = cateto opuesto/cateto adyacente",
    "Tangente = cateto opuesto/hipotenusa",
    "Tangente = hipotenusa/cateto adyacente"
    ],
    correctIndex: 1,
    explanation: "La tangente se define como la razón entre el cateto opuesto y el cateto adyacente. Las opciones incorrectas confunden esta razón con otras funciones trigonométricas: la primera es la cotangente, la segunda es el seno, y la tercera es la secante. Memoriza: tangente opuesto/adyacente.",
  },
  {
    id: 1419,
    area: "Matemáticas",
    text: "¿Cuál es la razón trigonométrica de la cosecante?",
    options: [
    "Cosecante = cateto opuesto/hipotenusa",
    "Cosecante = cateto adyacente/hipotenusa",
    "Cosecante = hipotenusa/cateto opuesto",
    "Cosecante = hipotenusa/cateto adyacente"
    ],
    correctIndex: 2,
    explanation: "La cosecante es la razón recíproca del seno, por lo que se define como hipotenusa/cateto opuesto (inverso de seno = cateto opuesto/hipotenusa). Las opciones incorrectas corresponden a otras razones: coseno (adyacente/hipotenusa), seno (opuesto/hipotenusa) y secante (hipotenusa/adyacente).",
  },
  {
    id: 1420,
    area: "Matemáticas",
    text: "¿Cuál es la razón trigonométrica de la secante?",
    options: [
    "Secante = hipotenusa/cateto adyacente",
    "Secante = hipotenusa/cateto opuesto",
    "Secante = cateto opuesto/hipotenusa",
    "Secante = cateto adyacente/hipotenusa"
    ],
    correctIndex: 0,
    explanation: "La secante es la razón recíproca del coseno, por lo que se define como hipotenusa sobre cateto adyacente. Las opciones incorrectas confunden la secante con el seno (cateto opuesto/hipotenusa), la cosecante (hipotenusa/cateto opuesto) y el coseno (cateto adyacente/hipotenusa), respectivamente.",
  },
  {
    id: 1421,
    area: "Matemáticas",
    text: "¿Cuál es la razón trigonométrica de la cotangente?",
    options: [
    "Cotangente = hipotenusa/cateto opuesto",
    "Cotangente = cateto adyacente/hipotenusa",
    "Cotangente = cateto opuesto/cateto adyacente",
    "Cotangente = cateto adyacente/cateto opuesto"
    ],
    correctIndex: 3,
    explanation: "La cotangente es la razón inversa de la tangente, por lo que se define como cateto adyacente entre cateto opuesto. Las opciones incorrectas corresponden a la tangente (cateto opuesto/adyacente), cosecante (hipotenusa/opuesto) y coseno (adyacente/hipotenusa), respectivamente.",
  },
  {
    id: 1422,
    area: "Matemáticas",
    text: "Fórmulas para calcular el área del cuadrado, rectángulo y triángulo:",
    options: [
    "Cuadrado = lxl, rectángulo = bxh, triángulo = bh/2",
    "Cuadrado = l², rectángulo = b²+h², triángulo = b·h",
    "Cuadrado = l/2, rectángulo = b+h/2, triángulo = b·h·2",
    "Cuadrado = 4l, rectángulo = 2(b+h), triángulo = b+h"
    ],
    correctIndex: 0,
    explanation: "La respuesta correcta usa fórmulas directas: lado por lado para el cuadrado, base por altura para el rectángulo, y base por altura entre dos para el triángulo. Los distractores confunden área con perímetro (4l, 2(b+h)), o aplican operaciones incorrectas como sumar o multiplicar sin dividir entre dos.",
  },
  {
    id: 1423,
    area: "Matemáticas",
    text: "Fórmulas para el área del rombo, trapecio, pentágono:",
    options: [
    "Rombo = Dd/2, trapecio = (B + b)h/2, pentágono = pa/2",
    "Rombo = (D x d)/h, trapecio = (B + b)/2, pentágono = (p + a)/2",
    "Rombo = (D+d)/2, trapecio = (B x b)/h, pentágono = (p x a)/3",
    "Rombo = D x d, trapecio = (B - b)h/2, pentágono = p x a"
    ],
    correctIndex: 0,
    explanation: "La respuesta correcta usa las fórmulas estándar: rombo (diagonal mayor por diagonal menor sobre 2), trapecio (base mayor más base menor por altura sobre 2) y pentágono (perímetro por apotema sobre 2). Las alternativas confunden operaciones o dividen por valores incorrectos.",
  },
  {
    id: 1424,
    area: "Matemáticas",
    text: "Fórmulas para calcular el perímetro y el área de un círculo:",
    options: [
    "Perímetro = 2π(radio), área = π(diámetro²)",
    "Perímetro = π(diámetro), área = π(radio²)",
    "Perímetro = π(radio), área = 2π(radio)",
    "Perímetro = π(radio²), área = π(diámetro)"
    ],
    correctIndex: 1,
    explanation: "La respuesta correcta usa π por el diámetro para el perímetro y π por el radio al cuadrado para el área. Las opciones incorrectas intercambian fórmulas o usan unidades incorrectas, como confundir radio con diámetro o elevar al cuadrado la magnitud equivocada.",
  },
  {
    id: 1425,
    area: "Matemáticas",
    text: "Fórmulas para el volumen de prismas, pirámides y esfera:",
    options: [
    "Prisma = (área de la base)(altura)/2, pirámide = (área de la base)(altura)/4, esfera = 4π(radio²)/3",
    "Prisma = (perímetro de la base)(altura), pirámide = (perímetro de la base)(altura)/3, esfera = 4π(radio³)",
    "Prisma = (área de la base)(altura), pirámide = (área de la base)(altura)/3, esfera = 4π(radio³)/3",
    "Prisma = (área de la base)(altura)/3, pirámide = (área de la base)(altura)/2, esfera = 2π(radio³)/3"
    ],
    correctIndex: 2,
    explanation: "La respuesta correcta es la única que usa área de la base para prisma y pirámide (con factor 1/3 para la pirámide) y la fórmula esférica con radio al cubo y 4/3π. Las alternativas confunden área con perímetro, usan factores incorrectos como /2 o /4, o cambian el exponente del radio a cuadrado, lo que altera el volumen real.",
  },
  {
    id: 1426,
    area: "Formación Cívica y Ética",
    text: "¿Qué es la ética?",
    options: [
    "Es el conjunto de leyes jurídicas que regulan el comportamiento de los ciudadanos en un país",
    "Es la disciplina filosófica que estudia la belleza y los principios estéticos que rigen el arte",
    "Es la capacidad innata del ser humano para distinguir entre el bien y el mal sin necesidad de aprendizaje",
    "Son un conjunto de costumbres y normas que dirigen o valoran el comportamiento humano en una comunidad"
    ],
    correctIndex: 3,
    explanation: "La respuesta correcta define la ética como normas y costumbres que guían la conducta en comunidad. Las opciones incorrectas confunden ética con estética (opción 1), con derecho (opción 2) o con una facultad innata no aprendida (opción 3), cuando la ética se construye socialmente.",
  },
  {
    id: 1427,
    area: "Formación Cívica y Ética",
    text: "¿Qué es la moral?",
    options: [
    "Son un conjunto de valores e ideales personales sobre lo que es bueno",
    "Es el conjunto de costumbres y tradiciones compartidas por una comunidad",
    "Son los principios universales dictados por una autoridad religiosa o divina",
    "Son las normas jurídicas impuestas por el Estado para regular la conducta social"
    ],
    correctIndex: 0,
    explanation: "La moral se refiere a valores e ideales personales que guían la conducta individual, no a normas jurídicas (derecho), costumbres sociales (usos sociales) o preceptos religiosos (moral religiosa), aunque pueden influir en ella.",
  },
  {
    id: 1428,
    area: "Formación Cívica y Ética",
    text: "Características de las normas jurídicas:",
    options: [
    "Son autónomas, bilaterales, interiores y coercibles",
    "Son autónomas, unilaterales, interiores e incoercibles",
    "Son heterónomas, unilaterales, exteriores e incoercibles",
    "Son heterónomas, bilaterales, exteriores y coercibles"
    ],
    correctIndex: 3,
    explanation: "La respuesta correcta es 'heterónomas' (impuestas por otro), 'bilaterales' (implican a dos partes), 'exteriores' (regulan actos externos) y 'coercibles' (aplicables por la fuerza). Las opciones incorrectas mezclan características de normas morales (autónomas, interiores) o convencionales (incoercibles), confundiendo su naturaleza jurídica.",
  },
  {
    id: 1429,
    area: "Formación Cívica y Ética",
    text: "Son valores monetarios y dados por el ser humano:",
    options: [
    "Valores sociales",
    "Valores morales",
    "Valores económicos",
    "Valores culturales"
    ],
    correctIndex: 2,
    explanation: "Los valores económicos son aquellos que se les asigna un precio o valor monetario y son creados por el ser humano, como el dinero o los bienes. Los valores morales, culturales y sociales no tienen un valor monetario directo, sino que se refieren a principios, tradiciones o relaciones humanas.",
  },
  {
    id: 1430,
    area: "Formación Cívica y Ética",
    text: "Estos valores son un conjunto de principios y atributos:",
    options: [
    "Normas jurídicas",
    "Valores éticos",
    "Valores morales",
    "Principios constitucionales"
    ],
    correctIndex: 1,
    explanation: "La respuesta correcta es 'Valores éticos' porque los valores éticos son precisamente el conjunto de principios y atributos que guían el comportamiento humano en sociedad. Las normas jurídicas son reglas de conducta obligatorias, no principios; los valores morales son un concepto similar pero más amplio y menos formal que los éticos; y los principios constitucionales son normas fundamentales del orden jurídico, no un conjunto de valores personales.",
  },
  {
    id: 1431,
    area: "Formación Cívica y Ética",
    text: "Son valores que satisfacen nuestras sensibilidades y gustos:",
    options: [
    "Valores afectivos",
    "Valores estéticos",
    "Valores morales",
    "Valores culturales"
    ],
    correctIndex: 1,
    explanation: "Los valores estéticos son aquellos que se relacionan con la belleza, el gusto y la sensibilidad artística, como la armonía o la elegancia. Los valores morales se centran en el bien y el deber, los culturales en tradiciones compartidas y los afectivos en vínculos emocionales, por lo que no satisfacen directamente las sensibilidades y gustos personales.",
  },
  {
    id: 1432,
    area: "Formación Cívica y Ética",
    text: "¿Cuáles son los elementos del Estado?",
    options: [
    "Pueblo, gobierno y constitución",
    "Territorio, población y gobierno",
    "Nación, soberanía y leyes",
    "Territorio, cultura y poder judicial"
    ],
    correctIndex: 1,
    explanation: "La respuesta correcta es territorio, población y gobierno porque son los tres elementos fundamentales e indispensables para la existencia de un Estado. Las opciones incorrectas incluyen conceptos como soberanía o constitución que, aunque relacionados, no son elementos constitutivos básicos del Estado sino atributos o instrumentos del mismo.",
  },
  {
    id: 1433,
    area: "Formación Cívica y Ética",
    text: "¿Qué es el territorio?",
    options: [
    "Es el poder político que ejerce un gobierno sobre su población",
    "Es el conjunto de personas que habitan un lugar determinado",
    "Es la extensión de tierra que pertenece a un estado",
    "Es el espacio aéreo y marítimo que rodea a un país"
    ],
    correctIndex: 2,
    explanation: "El territorio se refiere específicamente a la porción geográfica (suelo, subsuelo, espacio aéreo y marítimo) sobre la cual un Estado ejerce su soberanía. Las otras opciones confunden el concepto con población (primer distractor), solo una parte del territorio (segundo) o con el concepto de soberanía o gobierno (tercero).",
  },
  {
    id: 1434,
    area: "Formación Cívica y Ética",
    text: "¿Qué es la Población?",
    options: [
    "Es el grupo de individuos que comparten una misma nacionalidad y cultura",
    "Es el conjunto de ciudadanos con derecho a votar en un territorio",
    "Es la cantidad de habitantes que residen permanentemente en un país",
    "Es el conjunto de personas que habitan una determinada área geográfica"
    ],
    correctIndex: 3,
    explanation: "La respuesta correcta define Población como el conjunto de personas en un área geográfica, sin importar su nacionalidad, ciudadanía o permanencia. Las opciones incorrectas limitan el concepto a nacionalidad, derecho al voto o residencia permanente, que son características específicas pero no esenciales de la población.",
  },
  {
    id: 1435,
    area: "Formación Cívica y Ética",
    text: "¿Qué es el Gobierno?",
    options: [
    "Conjunto de leyes que regulan la vida social",
    "Sistema de partidos políticos en el poder",
    "Proceso de elección de autoridades públicas",
    "Conjunto de personas y organismos que dirigen"
    ],
    correctIndex: 3,
    explanation: "La respuesta correcta se enfoca en las personas y organismos que ejercen la autoridad y dirección del Estado. Las opciones incorrectas confunden al gobierno con las leyes que este aplica, con los partidos que pueden integrarlo, o con el proceso para formarlo, que son conceptos distintos en Formación Cívica y Ética.",
  },
  {
    id: 1436,
    area: "Formación Cívica y Ética",
    text: "¿Cuáles son los tres poderes de la Nación?",
    options: [
    "Legislativo, judicial y electoral",
    "Ejecutivo, legislativo y judicial",
    "Ejecutivo, federal y municipal",
    "Ejecutivo, legislativo y estatal"
    ],
    correctIndex: 1,
    explanation: "La respuesta correcta es Ejecutivo, legislativo y judicial, según el artículo 49 de la Constitución Mexicana. Las otras opciones son incorrectas porque incluyen niveles de gobierno (federal, municipal, estatal) o el poder electoral, que no son poderes de la Nación sino parte de la organización del Estado.",
  },
  {
    id: 1437,
    area: "Formación Cívica y Ética",
    text: "¿Cuáles son las jerarquías dentro de los poderes?",
    options: [
    "Federal, estatal y municipal",
    "Federal, local y municipal",
    "Ejecutivo, legislativo y judicial",
    "Gobernador, presidente y alcalde"
    ],
    correctIndex: 0,
    explanation: "La respuesta correcta es 'Federal, estatal y municipal' porque se refiere a los niveles territoriales de gobierno en México. Las opciones incorrectas confunden la división de poderes (Ejecutivo, Legislativo y Judicial) o los cargos específicos con las jerarquías territoriales, que son las que realmente organizan al Estado mexicano.",
  },
  {
    id: 1438,
    area: "Formación Cívica y Ética",
    text: "¿Qué es la soberanía?",
    options: [
    "La división de poderes del Estado",
    "La independencia de un país",
    "La facultad de gobernar",
    "El derecho a votar en elecciones"
    ],
    correctIndex: 2,
    explanation: "La soberanía es la facultad de gobernar, es decir, el poder supremo e inalienable del Estado para tomar decisiones sin interferencia externa. La independencia se refiere a la condición de no estar sometido a otro país, el derecho al voto es una expresión de la soberanía popular (no la soberanía en sí), y la división de poderes es un principio de organización del gobierno, no la soberanía misma.",
  },
  {
    id: 1439,
    area: "Formación Cívica y Ética",
    text: "¿Qué es la democracia?",
    options: [
    "Sistema de gobierno en el cual el pueblo elige a sus gobernantes y mantiene la soberanía",
    "Régimen político donde el pueblo delega su soberanía en un líder militar",
    "Sistema donde el poder lo ejerce una sola persona con autoridad absoluta",
    "Forma de gobierno en la que las decisiones las toma un grupo reducido de ciudadanos"
    ],
    correctIndex: 0,
    explanation: "La democracia se define por la participación del pueblo en la elección de gobernantes y la conservación de la soberanía popular. Las opciones incorrectas describen formas de autocracia, oligarquía y cesarismo, respectivamente, donde el poder no reside en el pueblo.",
  },
  {
    id: 1440,
    area: "Formación Cívica y Ética",
    text: "¿Qué conforma la identidad?",
    options: [
    "Mi apariencia, mis gustos y mis amigos",
    "Mi nacionalidad, mi idioma y mi religión",
    "Mi nombre, mi familia y mi escuela",
    "Quien soy, lo que pienso y lo que siento"
    ],
    correctIndex: 3,
    explanation: "La identidad es la conciencia de uno mismo, integrando lo que soy (autoconcepto), lo que pienso (creencias y valores) y lo que siento (emociones). Las otras opciones son elementos externos o sociales que influyen pero no conforman la esencia de la identidad personal.",
  },
  {
    id: 1441,
    area: "Formación Cívica y Ética",
    text: "¿Qué es un partido político?",
    options: [
    "Son grupos temporales de ciudadanos que se reúnen para apoyar a un candidato específico durante una campaña electoral",
    "Son organismos gubernamentales encargados de organizar las elecciones y fiscalizar el voto ciudadano",
    "Son instituciones privadas que buscan obtener el poder político para beneficiar económicamente a sus miembros",
    "Son asociaciones de interés público que representan y transmiten las solicitudes de los ciudadanos"
    ],
    correctIndex: 3,
    explanation: "La respuesta correcta es correcta porque define a los partidos políticos como asociaciones de interés público que canalizan las demandas ciudadanas, según la ley. Las opciones incorrectas lo confunden con organismos electorales (INE), grupos de apoyo temporal o asociaciones con fines de lucro, omitiendo su función de representación social y su carácter de entidades de interés público.",
  },
  {
    id: 1442,
    area: "Formación Cívica y Ética",
    text: "¿Qué constitución nos rige actualmente?",
    options: [
    "La de 1917",
    "La de 1857",
    "La de 1910",
    "La de 1824"
    ],
    correctIndex: 0,
    explanation: "La Constitución de 1917 es la que nos rige actualmente, promulgada el 5 de febrero de ese año. La de 1857 fue anterior y la de 1824 la primera del México independiente, mientras que la de 1910 es una fecha histórica de la Revolución, no una constitución.",
  },
  {
    id: 1443,
    area: "Formación Cívica y Ética",
    text: "¿Qué son los derechos humanos?",
    options: [
    "Los derechos humanos son acuerdos internacionales que solo aplican en países democráticos",
    "Los derechos humanos son valores morales que cada persona elige libremente seguir o no",
    "Los derechos humanos son normas que reconocen la dignidad de todos los seres humanos",
    "Los derechos humanos son privilegios que el Estado otorga a los ciudadanos para mantener el orden social"
    ],
    correctIndex: 2,
    explanation: "La respuesta correcta destaca que los derechos humanos son normas inherentes a la dignidad humana, no concesiones del Estado, ni limitados a ciertos países, ni opcionales como valores personales. Son universales, inalienables y obligatorios para todos.",
  },
  {
    id: 1444,
    area: "Formación Cívica y Ética",
    text: "¿Qué son los cambios físicos en la adolescencia?",
    options: [
    "Son los conflictos familiares y problemas de comunicación que surgen en la adolescencia",
    "Son las transformaciones en la identidad personal y social del adolescente",
    "Son todos los cambios fisiológicos y hormonales",
    "Son las emociones intensas y cambios de humor típicos de esta etapa"
    ],
    correctIndex: 2,
    explanation: "La respuesta correcta se enfoca en los cambios biológicos y hormonales del cuerpo. Las opciones incorrectas describen cambios emocionales, sociales o familiares, que son importantes pero no son cambios físicos.",
  },
  {
    id: 1445,
    area: "Formación Cívica y Ética",
    text: "¿Qué son los cambios sociales en la adolescencia?",
    options: [
    "La adaptación a las nuevas normas sociales del grupo de pares",
    "La búsqueda de la autonomía e independencia",
    "El desarrollo de la identidad sexual y de género",
    "La consolidación de las habilidades cognitivas superiores"
    ],
    correctIndex: 1,
    explanation: "La respuesta correcta es 'La búsqueda de la autonomía e independencia' porque este es el cambio social central en la adolescencia, donde se busca separarse de la familia y tomar decisiones propias. Las otras opciones son incorrectas: la identidad sexual es un cambio psicosocial, las habilidades cognitivas son un cambio intelectual, y la adaptación al grupo de pares es parte del proceso, pero no el cambio social principal.",
  },
  {
    id: 1446,
    area: "Formación Cívica y Ética",
    text: "¿Qué son los cambios afectivos en la adolescencia?",
    options: [
    "Son los cambios que se pueden dar en las emociones y los sentimientos",
    "Son los cambios en la capacidad de razonar y resolver problemas abstractos",
    "Son los cambios en la identidad de género y la orientación sexual",
    "Son los cambios que ocurren en el desarrollo físico y hormonal del cuerpo"
    ],
    correctIndex: 0,
    explanation: "La respuesta correcta es la única que se enfoca exclusivamente en emociones y sentimientos, que es el núcleo de los cambios afectivos. Las opciones incorrectas describen cambios biológicos, cognitivos o de identidad, que son áreas distintas del desarrollo adolescente.",
  },
  {
    id: 1447,
    area: "Formación Cívica y Ética",
    text: "¿Cómo se le llama cuando una empresa utiliza sus recursos para beneficiar a la comunidad?",
    options: [
    "Responsabilidad social",
    "Ética corporativa",
    "Función social",
    "Filantropía empresarial"
    ],
    correctIndex: 2,
    explanation: "La función social se refiere al uso de recursos empresariales para beneficiar directamente a la comunidad, distinguiéndose de la responsabilidad social (que es un concepto más amplio que incluye obligaciones legales y éticas), la filantropía (que suele ser donaciones sin relación directa con la operación) y la ética corporativa (que se enfoca en principios internos de conducta).",
  },
  {
    id: 1448,
    area: "Formación Cívica y Ética",
    text: "¿Qué es un derecho?",
    options: [
    "Un privilegio que otorga el Estado a ciertos ciudadanos",
    "Una petición que los ciudadanos hacen al gobierno para su beneficio",
    "Una obligación que todos debemos cumplir para vivir en paz",
    "Una norma que pretende regular la vida en sociedad"
    ],
    correctIndex: 3,
    explanation: "La respuesta correcta define al derecho como una norma que regula la convivencia social, estableciendo límites y libertades para todos. Las opciones incorrectas lo confunden con un privilegio exclusivo, una obligación (que es un concepto distinto) o una simple petición, cuando en realidad es una norma jurídica universal y exigible.",
  },
  {
    id: 1449,
    area: "Formación Cívica y Ética",
    text: "¿Qué es una obligación?",
    options: [
    "Es un compromiso voluntario que se adquiere por conveniencia personal",
    "Es una exigencia establecida por la moral, la ley o la autoridad",
    "Es una elección libre que se hace para beneficio de otros",
    "Es una acción que se realiza por costumbre o tradición social"
    ],
    correctIndex: 1,
    explanation: "La respuesta correcta es 'exigencia establecida por la moral, la ley o la autoridad' porque una obligación implica un deber impuesto externamente, no una acción voluntaria, costumbre o elección libre, que serían conceptos de compromiso, hábito o altruismo, respectivamente.",
  },
  {
    id: 1450,
    area: "Formación Cívica y Ética",
    text: "¿Qué es el sufragio?",
    options: [
    "Derecho a ser votado",
    "Elección mediante la votación",
    "Proceso de campaña política",
    "Conjunto de leyes electorales"
    ],
    correctIndex: 1,
    explanation: "El sufragio es el derecho y acto de emitir un voto en elecciones, no el derecho a ser candidato (ser votado), ni el conjunto de leyes que lo regulan, ni la campaña previa.",
  },
  {
    id: 1451,
    area: "Formación Cívica y Ética",
    text: "¿Con qué acontecimiento comienza la edad moderna?",
    options: [
    "Con la firma de la Declaración Universal de los Derechos Humanos",
    "Con el inicio de la Revolución Francesa",
    "Con la caída de Constantinopla",
    "Con la publicación de la primera Constitución mexicana"
    ],
    correctIndex: 2,
    explanation: "La Edad Moderna comienza con la caída de Constantinopla en 1453, evento que marcó el fin del Imperio Bizantino y el inicio de cambios políticos, económicos y culturales en Europa. Las otras opciones son hitos posteriores de la historia moderna y contemporánea, no su punto de partida.",
  },
  {
    id: 1452,
    area: "Formación Cívica y Ética",
    text: "¿En qué fecha ocurrió el descubrimiento de América?",
    options: [
    "3 de agosto de 1492",
    "15 de octubre de 1492",
    "12 de octubre de 1492",
    "10 de octubre de 1492"
    ],
    correctIndex: 2,
    explanation: "La respuesta correcta es el 12 de octubre de 1492, fecha en que Cristóbal Colón llegó a América, un hito en la historia que transformó la convivencia entre culturas. El 3 de agosto es la partida de Colón, el 10 y 15 de octubre son fechas cercanas pero no coinciden con el avistamiento oficial registrado en el diario de a bordo.",
  },
  {
    id: 1453,
    area: "Formación Cívica y Ética",
    text: "¿Quién fue el creador de la Iglesia protestante?",
    options: [
    "Martín Lutero",
    "Enrique VIII",
    "Juan Calvino",
    "Ulrico Zwinglio"
    ],
    correctIndex: 0,
    explanation: "Martín Lutero inició la Reforma Protestante en 1517 al publicar sus 95 tesis, lo que llevó a la creación de la Iglesia protestante. Juan Calvino, Enrique VIII y Ulrico Zwinglio fueron figuras clave en la Reforma, pero no fueron los creadores originales del movimiento protestante.",
  },
  {
    id: 1454,
    area: "Formación Cívica y Ética",
    text: "¿Cuándo ocurrió la independencia de las 13 colonias inglesas?",
    options: [
    "4 de Julio de 1775",
    "14 de Julio de 1789",
    "4 de Julio de 1783",
    "4 de Julio de 1776"
    ],
    correctIndex: 3,
    explanation: "La independencia de las 13 colonias fue declarada el 4 de Julio de 1776, fecha en que se firmó la Declaración de Independencia. La opción 14 de Julio de 1789 corresponde a la Toma de la Bastilla en Francia; 4 de Julio de 1775 es el inicio de la guerra, no la independencia; y 4 de Julio de 1783 es la fecha del Tratado de París que reconoció la independencia.",
  },
  {
    id: 1455,
    area: "Formación Cívica y Ética",
    text: "¿Con qué acontecimiento comienza la Revolución Francesa?",
    options: [
    "Con la Declaración de los Derechos del Hombre y del Ciudadano en 1789",
    "Con la ejecución de Luis XVI en la guillotina en 1793",
    "Con la toma de la Bastilla en 1789",
    "Con la convocatoria de los Estados Generales por Luis XVI en 1789"
    ],
    correctIndex: 2,
    explanation: "La Revolución Francesa comienza simbólicamente con la toma de la Bastilla el 14 de julio de 1789, un acto popular contra el absolutismo. Las otras opciones son eventos importantes posteriores (Declaración de Derechos, convocatoria de Estados Generales) o posteriores (ejecución del rey), pero no el inicio del proceso revolucionario.",
  },
  {
    id: 1456,
    area: "Formación Cívica y Ética",
    text: "¿Qué período abarcó la Revolución Industrial?",
    options: [
    "Del siglo XVI al XVII",
    "Del siglo XVII al XVIII",
    "Del siglo XVIII al XIX",
    "Del siglo XIX al XX"
    ],
    correctIndex: 2,
    explanation: "La Revolución Industrial comenzó a mediados del siglo XVIII en Inglaterra y se extendió hasta el siglo XIX, transformando la economía y la sociedad. Las otras opciones son incorrectas porque sitúan el proceso en siglos anteriores o posteriores, cuando aún no se habían desarrollado las innovaciones tecnológicas clave como la máquina de vapor.",
  },
  {
    id: 1457,
    area: "Formación Cívica y Ética",
    text: "¿Cuáles fueron las principales fuentes de energía durante la Revolución Industrial?",
    options: [
    "El gas natural y la tracción animal",
    "El agua y la electricidad",
    "El Carbón y el Vapor",
    "El petróleo y el motor de combustión"
    ],
    correctIndex: 2,
    explanation: "La Revolución Industrial se caracterizó por el uso masivo del carbón para alimentar las máquinas de vapor, que eran la principal fuente de energía mecánica. El agua se usaba antes, la electricidad y el petróleo llegaron después, y el gas natural no fue relevante sino hasta el siglo XX.",
  },
  {
    id: 1458,
    area: "Formación Cívica y Ética",
    text: "¿Cuál fue el detonante de la Primera Guerra Mundial?",
    options: [
    "La firma del Tratado de Versalles en 1919",
    "La invasión de Bélgica por Alemania en 1914",
    "El asesinato del Archiduque Francisco Fernando en 1914",
    "El hundimiento del barco Lusitania en 1915"
    ],
    correctIndex: 2,
    explanation: "La respuesta correcta es el asesinato del Archiduque Francisco Fernando, ya que este evento desencadenó una serie de alianzas y declaraciones de guerra que iniciaron el conflicto. Las alternativas son incorrectas porque el Tratado de Versalles fue el fin de la guerra, el hundimiento del Lusitania fue un evento posterior que influyó en la entrada de EE.UU., y la invasión de Bélgica fue una consecuencia, no el detonante.",
  },
  {
    id: 1459,
    area: "Historia",
    text: "¿De qué otro modo se le conoce a la Primera Guerra Mundial?",
    options: [
    "Guerra de los Imperios",
    "Guerra de Trincheras",
    "Guerra de las Naciones",
    "Gran Guerra Europea"
    ],
    correctIndex: 1,
    explanation: "La Primera Guerra Mundial es conocida como Guerra de Trincheras por el uso masivo de este sistema defensivo en el frente occidental. Las opciones incorrectas son nombres plausibles pero no oficiales: 'Guerra de las Naciones' no se usa históricamente, 'Guerra de los Imperios' es imprecisa porque varios imperios colapsaron, y 'Gran Guerra Europea' es redundante, pues el conflicto fue mundial.",
  },
  {
    id: 1460,
    area: "Historia",
    text: "¿En qué año ocurre la Revolución Rusa?",
    options: [
    "En febrero de 1917",
    "En noviembre de 1918",
    "En diciembre de 1905",
    "En octubre de 1917"
    ],
    correctIndex: 3,
    explanation: "La Revolución Rusa ocurrió en octubre de 1917 (calendario juliano, que corresponde a noviembre en el gregoriano), cuando los bolcheviques tomaron el poder. Febrero de 1917 fue la Revolución de Febrero que derrocó al zar, pero no la revolución bolchevique. Noviembre de 1918 marca el fin de la Primera Guerra Mundial, y diciembre de 1905 fue una revuelta fallida conocida como la Revolución de 1905.",
  },
  {
    id: 1461,
    area: "Historia",
    text: "¿Por qué entra Estados Unidos a la Primera Guerra Mundial?",
    options: [
    "Por la invasión alemana de Bélgica",
    "Por el telegrama Zimmerman",
    "Por el hundimiento del Lusitania",
    "Por el ataque a Pearl Harbor"
    ],
    correctIndex: 1,
    explanation: "La respuesta correcta es el telegrama Zimmerman, un mensaje secreto alemán que proponía una alianza con México contra EE. UU., lo que provocó la declaración de guerra. El hundimiento del Lusitania (1915) generó tensión pero no fue causa directa; la invasión de Bélgica justificó la entrada británica, no la estadounidense; y Pearl Harbor ocurrió en la Segunda Guerra Mundial, no en la Primera.",
  },
  {
    id: 1462,
    area: "Historia",
    text: "¿En qué año terminó la Primera Guerra Mundial?",
    options: [
    "En 1920",
    "En 1918",
    "En 1917",
    "En 1919"
    ],
    correctIndex: 1,
    explanation: "La Primera Guerra Mundial terminó oficialmente el 11 de noviembre de 1918 con la firma del armisticio entre los Aliados y Alemania. Las opciones 1917, 1919 y 1920 son incorrectas porque 1917 fue el año de entrada de Estados Unidos al conflicto, 1919 correspondió a la firma del Tratado de Versalles, y 1920 no tiene relación directa con el fin de la guerra.",
  },
  {
    id: 1463,
    area: "Historia",
    text: "¿Con qué tratado terminó la Primera Guerra Mundial?",
    options: [
    "Con el tratado de París",
    "Con el tratado de Versalles",
    "Con el tratado de Brest-Litovsk",
    "Con el tratado de Trianon"
    ],
    correctIndex: 1,
    explanation: "El Tratado de Versalles (1919) fue el principal acuerdo de paz que puso fin a la Primera Guerra Mundial, imponiendo duras condiciones a Alemania. Brest-Litovsk fue un tratado entre Rusia y las Potencias Centrales en 1918, Trianon con Hungría, y París hace referencia a la Conferencia de Paz, no a un tratado específico.",
  },
  {
    id: 1464,
    area: "Historia",
    text: "¿Con qué acontecimiento comenzó la Segunda Guerra Mundial?",
    options: [
    "Con la invasión a Polonia por parte de Alemania",
    "Con la invasión de Alemania a Francia a través de la Línea Maginot",
    "Con el asesinato del archiduque Francisco Fernando en Sarajevo",
    "Con la firma del Tratado de Versalles que humilló a Alemania"
    ],
    correctIndex: 0,
    explanation: "La Segunda Guerra Mundial comenzó oficialmente el 1 de septiembre de 1939 con la invasión de Alemania a Polonia, lo que provocó la declaración de guerra de Francia y Reino Unido. El asesinato del archiduque inició la Primera Guerra Mundial (1914), la invasión a Francia fue posterior (1940) y el Tratado de Versalles (1919) fue una causa lejana, no el detonante inmediato.",
  },
  {
    id: 1465,
    area: "Historia",
    text: "¿En qué año estalló la SGM?",
    options: [
    "En 1945",
    "En 1937",
    "En 1941",
    "En 1939"
    ],
    correctIndex: 3,
    explanation: "La Segunda Guerra Mundial comenzó oficialmente el 1 de septiembre de 1939 con la invasión de Polonia por parte de Alemania. 1937 se relaciona con el inicio de la guerra sino-japonesa, 1941 con el ataque a Pearl Harbor y la entrada de EE.UU., y 1945 con el fin del conflicto.",
  },
  {
    id: 1466,
    area: "Historia",
    text: "¿Cuál fue la causa de la entrada de Estados Unidos a la SGM?",
    options: [
    "El bombardeo a Pearl Harbor",
    "La declaración de guerra de Alemania a México",
    "El hundimiento del Lusitania",
    "La invasión alemana de Polonia"
    ],
    correctIndex: 0,
    explanation: "La respuesta correcta es el bombardeo a Pearl Harbor (7 dic 1941), que llevó a EE.UU. a declarar la guerra a Japón y entrar al conflicto. El hundimiento del Lusitania (1915) ocurrió en la Primera Guerra Mundial, la declaración alemana a México se relaciona con el Telegrama Zimmermann (1917) y la invasión de Polonia (1939) inició la guerra en Europa, pero no involucró directamente a EE.UU.",
  },
  {
    id: 1467,
    area: "Historia",
    text: "¿Cuáles eran las ideologías totalitarias predominantes durante la SGM?",
    options: [
    "El Comunismo en la URSS y el Anarquismo en España",
    "El Socialismo en Francia y el Republicanismo en España",
    "El Nazismo en Alemania y el Fascismo en Italia",
    "El Nacionalismo en Japón y el Imperialismo en Reino Unido"
    ],
    correctIndex: 2,
    explanation: "La respuesta correcta es Nazismo y Fascismo, pues fueron regímenes totalitarios que dominaron el Eje durante la Segunda Guerra Mundial. Las otras opciones mencionan ideologías que, aunque importantes en la época, no fueron las predominantes totalitarias en ese conflicto: el comunismo soviético era un sistema de partido único pero no aliado del Eje, el nacionalismo japonés era militarista pero no fascista clásico, y el socialismo francés no era totalitario.",
  },
  {
    id: 1468,
    area: "Historia",
    text: "¿Cuál fue la causa de rendición de Japón durante la SGM?",
    options: [
    "El bloqueo naval estadounidense total",
    "Los ataques nucleares a Hiroshima y Nagasaki",
    "El agotamiento de recursos bélicos japoneses",
    "La invasión soviética de Manchuria"
    ],
    correctIndex: 1,
    explanation: "La rendición japonesa fue precipitada por los bombardeos atómicos sobre Hiroshima (6 de agosto) y Nagasaki (9 de agosto), que demostraron un poder destructivo insostenible. Si bien la invasión soviética de Manchuria y el bloqueo naval debilitaron a Japón, no fueron la causa directa de la rendición; el agotamiento de recursos fue un factor gradual, no el detonante final.",
  },
  {
    id: 1469,
    area: "Historia",
    text: "¿En qué año termina la SGM?",
    options: [
    "En 1946",
    "En 1947",
    "En 1945",
    "En 1944"
    ],
    correctIndex: 2,
    explanation: "La Segunda Guerra Mundial terminó en 1945 con la rendición de Alemania en mayo y de Japón en septiembre. 1944 es incorrecto porque aún faltaban eventos clave como el desembarco de Normandía; 1946 y 1947 son años posteriores al fin del conflicto, confundibles con el inicio de la posguerra o la Guerra Fría.",
  },
  {
    id: 1470,
    area: "Historia",
    text: "¿Cuándo inicia y cuando termina la Guerra Fría?",
    options: [
    "Inicia en 1945 y concluye en 1985",
    "Inicia en 1945 y concluye en 1991",
    "Inicia en 1947 y concluye en 1989",
    "Inicia en 1917 y concluye en 1991"
    ],
    correctIndex: 1,
    explanation: "La Guerra Fría inicia en 1945 con el fin de la Segunda Guerra Mundial y el surgimiento de la rivalidad entre Estados Unidos y la URSS, y concluye en 1991 con la disolución de la Unión Soviética. Las alternativas son incorrectas porque 1947 es el año del inicio de la Doctrina Truman (no el inicio del conflicto), 1985 marca el inicio de la Perestroika (no el fin), y 1917 corresponde a la Revolución Rusa, evento previo al periodo.",
  },
  {
    id: 1471,
    area: "Historia",
    text: "¿Qué bloques se enfrentaron durante la Guerra Fría?",
    options: [
    "El bloque Democrático contra el Totalitario",
    "El bloque Socialista contra el Capitalista",
    "El bloque Oriental contra el Occidental",
    "El bloque Comunista contra el Fascista"
    ],
    correctIndex: 1,
    explanation: "La Guerra Fría enfrentó al bloque Socialista (liderado por la URSS) contra el Capitalista (liderado por EE.UU.). Las otras opciones son incorrectas porque el fascismo fue derrotado en la Segunda Guerra Mundial, la democracia y el totalitarismo son conceptos más amplios, y Oriental/Occidental es una denominación geográfica imprecisa para este conflicto ideológico.",
  },
  {
    id: 1472,
    area: "Historia",
    text: "¿En qué año se produce la caída del muro de Berlín?",
    options: [
    "En 1987",
    "En 1991",
    "En 1989",
    "En 1985"
    ],
    correctIndex: 2,
    explanation: "La caída del Muro de Berlín ocurrió el 9 de noviembre de 1989, marcando el fin de la Guerra Fría. 1985 se asocia con la llegada de Gorbachov al poder, 1991 con la disolución de la URSS, y 1987 con el discurso de Reagan en la Puerta de Brandeburgo, pero no con la caída del muro.",
  },
  {
    id: 1473,
    area: "Historia",
    text: "¿En qué año ocurre la desintegración de la URSS?",
    options: [
    "En 1993",
    "En 1991",
    "En 1989",
    "En 1990"
    ],
    correctIndex: 1,
    explanation: "La URSS se disolvió oficialmente el 26 de diciembre de 1991, tras la firma de los Acuerdos de Belavezha y la renuncia de Mijaíl Gorbachov. 1989 es incorrecto porque ese año cayó el Muro de Berlín, pero la URSS aún existía; 1993 corresponde a la crisis constitucional rusa, y 1990 fue el año de la independencia de varias repúblicas bálticas, pero la Unión se mantuvo.",
  },
  {
    id: 1474,
    area: "Historia",
    text: "¿Qué es la Globalización?",
    options: [
    "Es una etapa histórica de expansión cultural europea",
    "Es un acuerdo comercial entre países de América y Europa",
    "Es un fenómeno de integración mundial",
    "Es un proceso de colonización económica de países desarrollados"
    ],
    correctIndex: 2,
    explanation: "La globalización es la creciente interdependencia económica, política y cultural a nivel mundial, no un proceso unilateral de colonización ni una etapa histórica pasada, sino un fenómeno contemporáneo de integración que va más allá de simples acuerdos comerciales regionales.",
  },
  {
    id: 1475,
    area: "Historia",
    text: "¿En qué año estalla la Guerra del Golfo Pérsico entre EUA e Irak?",
    options: [
    "En 1991",
    "En 1989",
    "En 1990",
    "En 1992"
    ],
    correctIndex: 0,
    explanation: "La Guerra del Golfo Pérsico inició en 1991, cuando una coalición liderada por EUA atacó a Irak tras la invasión iraquí de Kuwait en 1990. 1990 es incorrecto porque ese año ocurrió la invasión, no el estallido del conflicto bélico; 1992 y 1989 no corresponden a eventos relacionados con esta guerra.",
  },
  {
    id: 1476,
    area: "Historia",
    text: "¿Cuál es la cultura madre en México?",
    options: [
    "La cultura Teotihuacana",
    "La cultura Azteca",
    "La cultura Maya",
    "La cultura Olmeca"
    ],
    correctIndex: 3,
    explanation: "La cultura Olmeca es considerada la cultura madre de Mesoamérica por ser la primera civilización compleja (1200-400 a.C.), que estableció bases religiosas, artísticas y políticas. Los mayas, teotihuacanos y aztecas son culturas posteriores que, aunque muy importantes, se desarrollaron después y heredaron elementos olmecas.",
  },
  {
    id: 1477,
    area: "Historia",
    text: "¿Cuál era la cultura más importante que floreció en el centro de México?",
    options: [
    "La cultura Mexica",
    "La cultura Tolteca",
    "La cultura Olmeca",
    "La cultura Maya"
    ],
    correctIndex: 0,
    explanation: "La cultura Mexica (o Azteca) fue la más importante en el centro de México, estableciendo su capital Tenochtitlán en el Valle de México. Los toltecas también florecieron en el centro, pero su apogeo fue anterior (siglos X-XII). Los mayas se desarrollaron principalmente en el sureste (Península de Yucatán) y los olmecas en la costa del Golfo, no en el centro.",
  },
  {
    id: 1478,
    area: "Historia",
    text: "Cultura que floreció principalmente en la península de Yucatán y el sureste de México.",
    options: [
    "Cultura Tolteca",
    "Cultura Maya",
    "Cultura Teotihuacana",
    "Cultura Olmeca"
    ],
    correctIndex: 1,
    explanation: "La cultura Maya se desarrolló en la península de Yucatán y el sureste de México, destacando por su escritura jeroglífica y avances astronómicos. Las otras culturas florecieron en regiones diferentes: los olmecas en el Golfo de México, los teotihuacanos en el centro del país y los toltecas en Tula, Hidalgo.",
  },
  {
    id: 1479,
    area: "Historia",
    text: "¿En qué año llegaron los españoles a lo que hoy es México?",
    options: [
    "En 1521",
    "En 1517",
    "En 1519",
    "En 1492"
    ],
    correctIndex: 2,
    explanation: "La llegada de los españoles a lo que hoy es México ocurrió en 1519, cuando Hernán Cortés desembarcó en Veracruz. 1517 corresponde a la expedición de Francisco Hernández de Córdoba que exploró la costa, pero no estableció contacto formal; 1521 es la fecha de la caída de Tenochtitlan, no de la llegada; y 1492 es el año del primer viaje de Colón a América, pero no a México.",
  },
  {
    id: 1480,
    area: "Historia",
    text: "¿En qué año cae Tenochtitlan?",
    options: [
    "En 1519",
    "En 1522",
    "En 1521",
    "En 1520"
    ],
    correctIndex: 2,
    explanation: "La caída de Tenochtitlan ocurrió el 13 de agosto de 1521, tras un sitio de 75 días liderado por Hernán Cortés. 1519 es el año de la llegada de los españoles, 1520 corresponde a la Noche Triste y 1522 es posterior a la conquista.",
  },
  {
    id: 1481,
    area: "Historia",
    text: "¿Quién era la autoridad máxima en la Nueva España?",
    options: [
    "El Gobernador de la Provincia",
    "El Arzobispo de México",
    "El Virrey",
    "El Consejo de Indias"
    ],
    correctIndex: 2,
    explanation: "El Virrey era la máxima autoridad en la Nueva España porque representaba directamente al rey de España en el territorio, gobernando y administrando justicia. El Arzobispo tenía poder religioso, pero no civil; el Consejo de Indias asesoraba al rey desde España; y el Gobernador solo tenía autoridad limitada a una provincia, no sobre todo el virreinato.",
  },
  {
    id: 1482,
    area: "Historia",
    text: "¿Qué es la sociedad de castas?",
    options: [
    "Es una organización social que prioriza la riqueza y la propiedad privada",
    "Es una forma de gobierno donde el poder se hereda por linaje familiar",
    "Es un sistema económico basado en la división del trabajo por oficios",
    "Es una manera de organización en la cual lo más importante es el origen étnico"
    ],
    correctIndex: 3,
    explanation: "La sociedad de castas en la Nueva España clasificaba a las personas según su origen étnico (peninsulares, criollos, mestizos, etc.). Las opciones incorrectas se refieren a otros sistemas: la monarquía hereditaria, los gremios medievales y la estratificación por clase económica, respectivamente.",
  },
  {
    id: 1483,
    area: "Historia",
    text: "Causas de la Independencia de México.",
    options: [
    "El descontento por la conquista española, la caída de Tenochtitlan y la imposición del virreinato",
    "El estallido de la Revolución Francesa, la invasión napoleónica a España y el apoyo de Estados Unidos",
    "La ilustración, la desigualdad, la abdicación del rey Carlos IV y las reformas borbónicas",
    "La intervención francesa, el tratado de Córdoba y la promulgación de la Constitución de 1824"
    ],
    correctIndex: 2,
    explanation: "La respuesta correcta incluye causas estructurales (ilustración, desigualdad, reformas borbónicas) y coyunturales (abdicación de Carlos IV). Los distractores mezclan eventos posteriores o previos, como la conquista o la intervención francesa, que no corresponden al periodo de inicio de la Independencia.",
  },
  {
    id: 1484,
    area: "Historia",
    text: "¿Quién inició el movimiento de independencia en México?",
    options: [
    "Agustín de Iturbide, líder del Ejército Trigarante",
    "Miguel Hidalgo y Costilla, conocido como el Padre de la Patria",
    "Los miembros de la conspiración de Querétaro, Hidalgo y Aldama",
    "José María Morelos y Pavón, organizador del Congreso de Chilpancingo"
    ],
    correctIndex: 2,
    explanation: "La respuesta correcta es 'Los miembros de la conspiración de Querétaro, Hidalgo y Aldama' porque el movimiento independentista inició con la conspiración de Querétaro en 1810, encabezada por Hidalgo y Aldama. Las otras opciones son incorrectas: Hidalgo fue una figura clave pero no el único iniciador; Iturbide consumó la independencia en 1821, no la inició; Morelos continuó la lucha después de Hidalgo, pero no fue el iniciador.",
  },
  {
    id: 1485,
    area: "Historia",
    text: "¿Quién redactó el documento llamado Los Sentimientos de la Nación?",
    options: [
    "José María Morelos",
    "Agustín de Iturbide",
    "Ignacio Allende",
    "Miguel Hidalgo"
    ],
    correctIndex: 0,
    explanation: "José María Morelos redactó 'Los Sentimientos de la Nación' en 1813 durante el Congreso de Chilpancingo, donde expuso ideales de independencia y justicia social. Miguel Hidalgo inició la lucha, Ignacio Allende fue un caudillo militar y Agustín de Iturbide consumó la independencia, pero ninguno escribió ese documento.",
  },
  {
    id: 1486,
    area: "Historia",
    text: "¿Quién promulga la Constitución de Apatzingán?",
    options: [
    "El virrey de la Nueva España",
    "José María Morelos",
    "El Congreso de Cádiz",
    "El Congreso de Chilpancingo"
    ],
    correctIndex: 3,
    explanation: "La Constitución de Apatzingán fue promulgada por el Congreso de Chilpancingo, convocado por José María Morelos en 1813. Aunque Morelos fue su principal impulsor, no fue él quien la promulgó como individuo, sino el congreso. El Congreso de Cádiz era español y el virrey representaba a la autoridad realista, por lo que ambas opciones son incorrectas.",
  },
  {
    id: 1487,
    area: "Historia",
    text: "¿Quiénes se unieron mediante el Plan de Iguala?",
    options: [
    "Benito Juárez y Maximiliano de Habsburgo",
    "Miguel Hidalgo y José María Morelos",
    "Antonio López de Santa Anna y Guadalupe Victoria",
    "Vicente Guerrero y Agustín Iturbide"
    ],
    correctIndex: 3,
    explanation: "El Plan de Iguala, promulgado en 1821, unió a Vicente Guerrero (líder insurgente) y Agustín de Iturbide (comandante realista) para consumar la independencia de México. Las otras opciones son incorrectas porque Hidalgo y Morelos pertenecen a la primera etapa insurgente (1810-1815), Santa Anna y Victoria son figuras posteriores del México independiente, y Juárez y Maximiliano representan el conflicto de la Reforma y el Segundo Imperio.",
  },
  {
    id: 1488,
    area: "Historia",
    text: "¿Con qué tratado España reconoce la independencia de México?",
    options: [
    "Con el Tratado de Córdoba",
    "Con los Tratados de Velasco",
    "Con el Tratado de Guadalupe Hidalgo",
    "Con el Tratado de Adams-Onís"
    ],
    correctIndex: 0,
    explanation: "El Tratado de Córdoba, firmado en 1821, es el documento en el que España reconoció la independencia de México tras el Plan de Iguala. El Tratado de Guadalupe Hidalgo (1848) puso fin a la guerra México-Estados Unidos, los Tratados de Velasco (1836) reconocieron la independencia de Texas, y el Tratado de Adams-Onís (1819) fijó límites entre España y EE. UU., no con México independiente.",
  },
  {
    id: 1489,
    area: "Historia",
    text: "¿Cuándo fue la primera intervención francesa?",
    options: [
    "De 1846 a 1848",
    "De 1821 a 1823",
    "De 1862 a 1867",
    "De 1838 a 1839"
    ],
    correctIndex: 3,
    explanation: "La primera intervención francesa ocurrió de 1838 a 1839, conocida como la Guerra de los Pasteles, por reclamos de daños a comerciantes franceses. La opción 1862-1867 corresponde a la Segunda Intervención Francesa; 1846-1848 a la guerra con Estados Unidos; y 1821-1823 al fin de la independencia y efímero Imperio de Iturbide.",
  },
  {
    id: 1490,
    area: "Historia",
    text: "¿Cuándo fue la intervención estadounidense?",
    options: [
    "De 1848 a 1850",
    "De 1846 a 1848",
    "De 1844 a 1846",
    "De 1840 a 1842"
    ],
    correctIndex: 1,
    explanation: "La intervención estadounidense en México ocurrió de 1846 a 1848, iniciando tras la anexión de Texas y culminando con el Tratado de Guadalupe Hidalgo. Las otras fechas no coinciden con este conflicto: 1840-1842 corresponde a la Guerra de los Pasteles con Francia, 1848-1850 es posterior al tratado, y 1844-1846 es previo al inicio de las hostilidades.",
  },
  {
    id: 1491,
    area: "Historia",
    text: "¿Cuándo fue la segunda intervención francesa?",
    options: [
    "De 1861 a 1866",
    "De 1864 a 1867",
    "De 1858 a 1861",
    "De 1838 a 1839"
    ],
    correctIndex: 0,
    explanation: "La segunda intervención francesa en México ocurrió de 1861 a 1866, tras la suspensión de pagos de la deuda externa por parte de Benito Juárez, culminando con la caída del Segundo Imperio Mexicano. Las opciones incorrectas confunden con la Guerra de los Pasteles (1838-1839), el periodo de la Guerra de Reforma (1858-1861) o fechas que no corresponden al inicio real del conflicto.",
  },
  {
    id: 1492,
    area: "Historia",
    text: "¿Quiénes se enfrentaron en la guerra de Reforma?",
    options: [
    "Liberales contra Conservadores",
    "Criollos contra Peninsulares",
    "Monárquicos contra Republicanos",
    "Federalistas contra Centralistas"
    ],
    correctIndex: 0,
    explanation: "La Guerra de Reforma (1857-1861) enfrentó a liberales, que buscaban separar Iglesia y Estado y aplicar la Constitución de 1857, contra conservadores, que defendían el orden tradicional y los privilegios del clero y el ejército. Federalistas vs. Centralistas fue un conflicto anterior (1835-1846), Criollos vs. Peninsulares corresponde a la Independencia, y Monárquicos vs. Republicanos fue un debate del siglo XIX pero no el bando principal de esta guerra.",
  },
  {
    id: 1493,
    area: "Historia",
    text: "Características del Porfiriato.",
    options: [
    "La reelección, La política conciliadora y Las prácticas represivas",
    "La abolición de la reelección, La apertura democrática y El reparto agrario",
    "El federalismo, La intervención estatal en la economía y La educación laica",
    "La descentralización política, El desarrollo industrial y La libertad de prensa"
    ],
    correctIndex: 0,
    explanation: "La respuesta correcta (reelección, política conciliadora y prácticas represivas) resume el poder continuo de Díaz, su estrategia de pactar con élites y el uso de la fuerza para mantener el control. Las alternativas son incorrectas porque el Porfiriato centralizó el poder, limitó la libertad de prensa, evitó la democracia y no realizó un reparto agrario significativo.",
  },
  {
    id: 1494,
    area: "Historia",
    text: "¿Qué Plan da inicio a la revolución mexicana?",
    options: [
    "El Plan de Guadalupe impulsado por Venustiano Carranza en 1913",
    "El Plan de Ayala proclamado por Emiliano Zapata en 1911",
    "El Plan de San Luis el 20 de noviembre de 1910",
    "El Plan de Agua Prieta lanzado por Álvaro Obregón en 1920"
    ],
    correctIndex: 2,
    explanation: "La respuesta correcta es el Plan de San Luis, redactado por Francisco I. Madero, que llamó a levantarse en armas el 20 de noviembre de 1910 contra la dictadura de Porfirio Díaz. Los otros planes son posteriores: el de Ayala surge durante la revolución, el de Guadalupe contra Huerta y el de Agua Prieta en la etapa final del conflicto.",
  },
  {
    id: 1495,
    area: "Historia",
    text: "¿Cuál es el Plan impulsado por Zapata con el lema 'Tierra y libertad'?",
    options: [
    "El Plan de San Luis",
    "El Plan de Ayala",
    "El Plan de Agua Prieta",
    "El Plan de la Noria"
    ],
    correctIndex: 1,
    explanation: "El Plan de Ayala fue promulgado por Emiliano Zapata en 1911, exigiendo la restitución de tierras a los campesinos bajo el lema 'Tierra y libertad'. El Plan de San Luis fue de Francisco I. Madero, el de Agua Prieta de Obregón y Calles, y el de la Noria de Porfirio Díaz, todos con objetivos distintos al agrarismo zapatista.",
  },
  {
    id: 1496,
    area: "Historia",
    text: "¿Cuáles son los artículos más importantes de la Constitución de 1917?",
    options: [
    "El 4to de la Igualdad de Género, el 130 de la Libertad de Culto",
    "El 1ro de las Garantías Individuales, el 16 de la Inviolabilidad del Hogar",
    "El 5to de la Libertad de Trabajo, el 123 de los Derechos Laborales",
    "El 3ro de la Educación, el 27 de los Recursos"
    ],
    correctIndex: 3,
    explanation: "La respuesta correcta destaca el Artículo 3 (educación laica y gratuita) y el Artículo 27 (propiedad de la nación sobre recursos naturales), pilares de la Constitución de 1917. Las otras opciones mezclan artículos importantes pero no son los más emblemáticos de ese documento histórico.",
  },
  {
    id: 1497,
    area: "Historia",
    text: "¿Qué presidente creó la SEP?",
    options: [
    "José Vasconcelos",
    "Álvaro Obregón",
    "Venustiano Carranza",
    "Plutarco Elías Calles"
    ],
    correctIndex: 1,
    explanation: "Álvaro Obregón creó la SEP en 1921 como parte de su proyecto de reconstrucción nacional, nombrando a José Vasconcelos como primer secretario. Vasconcelos fue el impulsor intelectual pero no el presidente; Carranza murió antes de la creación y Calles sucedió a Obregón.",
  },
  {
    id: 1498,
    area: "Historia",
    text: "¿Quién era el verdadero líder durante el Maximato?",
    options: [
    "Plutarco Elías Calles",
    "Pascual Ortiz Rubio",
    "Emilio Portes Gil",
    "Lázaro Cárdenas del Río"
    ],
    correctIndex: 0,
    explanation: "La respuesta correcta es Plutarco Elías Calles porque, aunque no ocupaba la presidencia, ejerció el poder real durante los gobiernos de Emilio Portes Gil, Pascual Ortiz Rubio y Abelardo L. Rodríguez (1928-1934). Lázaro Cárdenas fue presidente después del Maximato y rompió con Calles, mientras que Portes Gil y Ortiz Rubio fueron presidentes títeres durante ese periodo.",
  },
  {
    id: 1499,
    area: "Historia",
    text: "¿Con qué presidente inicia el Milagro Mexicano?",
    options: [
    "Lázaro Cárdenas",
    "Ávila Camacho",
    "Adolfo Ruiz Cortines",
    "Miguel Alemán"
    ],
    correctIndex: 1,
    explanation: "El Milagro Mexicano inicia con Ávila Camacho (1940-1946), quien impulsó la industrialización y estabilidad económica. Cárdenas gobernó antes (1934-1940) y su sexenio fue de reformas sociales, no de crecimiento industrial sostenido; Alemán aceleró el modelo pero no lo inició; Ruiz Cortines continuó políticas ya establecidas.",
  },
  {
    id: 1500,
    area: "Historia",
    text: "¿Con qué presidente inicia el civilismo?",
    options: [
    "Lázaro Cárdenas del Río",
    "Adolfo Ruiz Cortines",
    "Miguel Alemán Valdez",
    "Manuel Ávila Camacho"
    ],
    correctIndex: 2,
    explanation: "El civilismo inicia con Miguel Alemán Valdez (1946-1952), quien fue el primer presidente civil en el México posrevolucionario, rompiendo con la tradición de presidentes militares. Lázaro Cárdenas y Manuel Ávila Camacho fueron militares y presidentes antes de Alemán, mientras que Adolfo Ruiz Cortines fue su sucesor, no el iniciador del civilismo.",
  }
];

export default bank13Questions;
