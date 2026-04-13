<?php
/**
 * CARGADOR AUTOMÁTICO DE PREGUNTAS DE HABILIDAD VERBAL - POLITÉCNICO 2025
 * Versión: 1.0 (Habilidad Verbal)
 * Objetivo: Insertar 30 preguntas oficiales con justificaciones y lectura base.
 */

header('Content-Type: text/html; charset=utf-8');
include 'config.php';

echo "<h1>🚀 Cargador Automático Habilidad Verbal Politécnico 2025 (v1.0)</h1>";

try {
    // Detectar nombre real de la columna de explicación
    $stmt = $pdo->query("SHOW COLUMNS FROM preguntas_politecnico");
    $columnas = $stmt->fetchAll(PDO::FETCH_COLUMN);
    $col_explicacion = 'explicacion';
    foreach ($columnas as $c) {
        if (strpos($c, 'explicaci') !== false) {
            $col_explicacion = $c;
            break;
        }
    }

    // Obtener ID de Habilidad Verbal
    $materia_nombre = 'Habilidad Verbal';
    $mid_stmt = $pdo->prepare("SELECT id FROM materias_politecnico WHERE nombre = ?");
    $mid_stmt->execute([$materia_nombre]);
    $mid = $mid_stmt->fetchColumn();
    if (!$mid) {
        $pdo->prepare("INSERT INTO materias_politecnico (nombre) VALUES (?)")->execute([$materia_nombre]);
        $mid = $pdo->lastInsertId();
    }

    // Limpiar datos previos de Habilidad Verbal 2025
    $pdo->prepare("DELETE FROM preguntas_politecnico WHERE guia_year = 2025 AND materia_id = ?")->execute([$mid]);
    echo "ℹ️ Registros antiguos de Habilidad Verbal 2025 limpiados.<br>";

    // DATA OFICIAL (Reactivos 271-300)
    // Nota: Las preguntas con lectura incluyen el texto en el campo de pregunta para el simulador.
    $lectura_animales = "LECTURA: LOS ANIMALES PREHISTÓRICOS DE MÉXICO\n\nHace aproximadamente 50,000 años, la Tierra albergaba una diversa megafauna, incluyendo grandes mamíferos herbívoros y carnívoros. Sin embargo, este periodo presenció una extinción masiva que eliminó dos tercios de los géneros de grandes mamíferos terrestres en casi todos los continentes.\n\nLas principales causas debatidas de esta extinción fueron probablemente el cambio climático inducido por la transición del último periodo de glaciación, Y, por otro lado, la expansión humana, que cazaba estos animales para sustento y abrigo.\n\nLa megafauna, definida como animales con un peso superior a 46 kilogramos o incluso una tonelada, habitó desde el Pleistoceno antiguo hasta la actualidad. La extinción afectó especialmente a América, comenzando en Norteamérica y extendiéndose hacia el sur.\n\nEn México, se han descubierto restos fósiles de más de 80 especies de mamíferos terrestres extintos, concentrándose en el sur y centro del país, especialmente en Oaxaca, Puebla y el Estado de México. Notablemente, la región de Santa Lucía ha proporcionado nuevos fósiles, arrojando luz sobre la fauna prehistórica.\n\nLa megafauna mexicana incluía imponentes carnívoros como: los tigres dientes de sable (Smilodon fatalis), leones americanos (Panthera leo atrox), el oso cara corta (Arctodus simus).\n\nEntre los muchos herbívoros cazados por nuestros ancestros se encontraban: Los mamuts y mastodontes (Mammut americanum) y (Mammuthus columbi), caballo mexicano (Equus mexicanus), camello americano (Camelops hesternus), bisonte gigante (Bison latifrons).\n\nLa llegada de los humanos a América hace unos 20,000 años marcó el inicio de la interacción con estas especies gigantes.\n\nTanto el cambio climático como la caza desmedida contribuyeron al declive de la megafauna mexicana en los últimos miles de años. A pesar de la desaparición de estas especies, los fósiles descubiertos ofrecen una visión fascinante de la diversidad de la vida en el México prehistórico y permiten imaginar un paisaje muy diferente al actual.\n\n--------\n\n";

    $preguntas = [
        [
            'n' => 271,
            'p' => $lectura_animales . "¿A qué tipo de texto corresponde la lectura?",
            'a' => 'Cuento',
            'b' => 'Artículo',
            'c' => 'Ensayo',
            'd' => 'Novela',
            'r' => 'B',
            'e' => 'Corresponde a un artículo: texto que presenta la postura de autores sobre un tema de interés general o histórico.',
            't' => 'Comprensión Lectora'
        ],
        [
            'n' => 272,
            'p' => $lectura_animales . "La finalidad del artículo es...",
            'a' => 'divulgar la ciencia prehistórica',
            'b' => 'saber en donde hay fósiles',
            'c' => 'conocer los restos fósiles hallados en México',
            'd' => 'causas de la extinción de los animales',
            'r' => 'C',
            'e' => 'La finalidad primordial es dar a conocer los restos fósiles hallados en territorio mexicano.',
            't' => 'Comprensión Lectora'
        ],
        [
            'n' => 273,
            'p' => $lectura_animales . "Las razones de la desaparición de los animales prehistóricos fueron:",
            'a' => 'la extinción masiva y su gran tamaño',
            'b' => 'el peso y falta de alimentos',
            'c' => 'la lucha entre ellos y su muerte',
            'd' => 'el cambio climático y la caza desmedida',
            'r' => 'D',
            'e' => 'El texto menciona explícitamente el cambio climático y la expansión/caza humana como causas principales.',
            't' => 'Comprensión Lectora'
        ],
        [
            'n' => 274,
            'p' => $lectura_animales . "Relaciona alimentación: 1.Carnívoro, 2.Herbívoro. Animales: a)Leones, b)Mamuts, c)Camello, d)Tigres, e)Bisonte, f)Oso.",
            'a' => '1adf, 2bce',
            'b' => '1acd, 2bef',
            'c' => '1bce, 2adf',
            'd' => '1bef, 2acd',
            'r' => 'A',
            'e' => 'Carnívoros: Tigres, Leones, Oso. Herbívoros: Mamuts, Camello, Bisonte.',
            't' => 'Comprensión Lectora'
        ],
        [
            'n' => 275,
            'p' => 'Es la frase que corresponde a una metáfora.',
            'a' => 'Candil de la calle, oscuridad de su casa',
            'b' => 'El que a buen árbol se arrima, buena sombra le cobija',
            'c' => 'El muerto al pozo y el vivo al gozo',
            'd' => 'El que parte y comparte se queda con la mejor parte',
            'r' => 'A',
            'e' => 'La metáfora compara dos realidades no relacionadas trasladando cualidades; en este caso la luz y la sombra social/familiar.',
            't' => 'Figuras Retóricas'
        ],
        [
            'n' => 276,
            'p' => 'Ordena los pasos para elaborar un resumen: 1.Ideas primarias/secundarias, 2.Subrayado, 3.Reescribir con nexos, 4.Leer de corrido, 5.Lectura ligera.',
            'a' => '1, 2, 3, 4, 5',
            'b' => '5, 1, 2, 4, 3',
            'c' => '2, 1, 4, 3, 5',
            'd' => '4, 3, 1, 5, 2',
            'r' => 'B',
            'e' => 'El proceso lógico es: Lectura (5) -> Identificación (1) -> Subrayado (2) -> Verificación (4) -> Redacción final (3).',
            't' => 'Resumen'
        ],
        [
            'n' => 277,
            'p' => 'La idea ______ contiene la información ______ de un texto, la idea ______ amplia y enriquece el tema central.',
            'a' => 'principal - complementaria - secundaria',
            'b' => 'secundaria - esencial - principal',
            'c' => 'secundaria - complementaria - principal',
            'd' => 'principal - esencial - secundaria',
            'r' => 'D',
            'e' => 'Idea principal = Esencial. Idea secundaria = Amplía/Enriquece.',
            't' => 'Estructura Textual'
        ],
        [
            'n' => 278,
            'p' => 'Selecciona hechos (no opiniones) sobre COVID: 1.Transmisión reconocida, 2.Creían forma contagio, 3.Parecía no infección, 4.Transmite objetos, 5.Higiene manos.',
            'a' => '1, 2, 4',
            'b' => '1, 4, 5',
            'c' => '2, 3, 4',
            'd' => '3, 4, 5',
            'r' => 'B',
            'e' => 'Los puntos 1, 4 y 5 son factuales y objetivos. Los otros usan verbos de creencia o percepción.',
            't' => 'Hechos vs Opiniones'
        ],
        [
            'n' => 279,
            'p' => '¿Qué técnica de reducción textual respeta las ideas esenciales del autor?',
            'a' => 'Cita textual',
            'b' => 'Resumen',
            'c' => 'Análisis',
            'd' => 'Argumento',
            'r' => 'B',
            'e' => 'El resumen es la técnica que condensa de forma concisa y fiel los puntos más importantes.',
            't' => 'Técnicas de Estudio'
        ],
        [
            'n' => 280,
            'p' => 'Isla es a archipiélago como...',
            'a' => 'bueno a excelente',
            'b' => 'diseñador a creatividad',
            'c' => 'hueso a esqueleto',
            'd' => 'camino a destino',
            'r' => 'C',
            'e' => 'Relación de Elemento a Conjunto. Una isla forma un archipiélago así como un hueso forma un esqueleto.',
            't' => 'Analogías'
        ],
        [
            'n' => 281,
            'p' => 'Relaciona analogía: 1.Causa-efecto, 2.Oposición, 3.Parte-todo. Ejemplos: a)Playera-tienda, b)Nutritivo-saludable, c)Soliloquio-coloquio.',
            'a' => '1c, 2a, 3b',
            'b' => '1b, 2c, 3a',
            'c' => '1a, 2b, 3c',
            'd' => '1b, 2a, 3c',
            'r' => 'B',
            'e' => '1b (Nutritivo causa salud), 2c (Opuestos), 3a (Elemento en conjunto).',
            't' => 'Analogías'
        ],
        [
            'n' => 282,
            'p' => 'Las palabras que pueden considerarse como sinónimos son:',
            'a' => 'espléndido y generoso',
            'b' => 'garantizado e incierto',
            'c' => 'votar y botar',
            'd' => 'cobrar y pagar',
            'r' => 'A',
            'e' => 'Espléndido y generoso comparten un significado de desprendimiento y abundancia.',
            't' => 'Sinónimos'
        ],
        [
            'n' => 283,
            'p' => 'Resumen que reúne las ideas principales de un texto sin explicarlo de manera detallada.',
            'a' => 'Indicativo',
            'b' => 'Referencial',
            'c' => 'Explicativo',
            'd' => 'Interferencial',
            'r' => 'A',
            'e' => 'El resumen indicativo expone ideas sin entrar en detalles, sirviendo como guía rápida de lectura.',
            't' => 'Tipos de Resumen'
        ],
        [
            'n' => 284,
            'p' => 'Ordena pasos cuadro sinóptico: 1.Ordenar ideas, 2.Leer, 3.Tema central, 4.Representar, 5.Palabras clave.',
            'a' => '1, 2, 3, 4, 5',
            'b' => '2, 3, 4, 5, 1',
            'c' => '2, 5, 3, 1, 4',
            'd' => '4, 3, 1, 5, 2',
            'r' => 'C',
            'e' => 'Flujo: Leer (2) -> Palabras clave (5) -> Título/Tema (3) -> Orden (1) -> Representación visual (4).',
            't' => 'Organizadores Gráficos'
        ],
        [
            'n' => 285,
            'p' => 'Los signos de puntuación se utilizan para hacer ____, separar ideas, ____ el discurso y evitar ____.',
            'a' => 'repeticiones - aumentar - conflictos',
            'b' => 'aclaraciones - contextualizar - unidades',
            'c' => 'énfasis - aclarar - conflictos',
            'd' => 'pausas - organizar - ambigüedades',
            'r' => 'D',
            'e' => 'Sirven para dar pausas lógicas, organizar la estructura y eliminar interpretaciones dobles o ambiguas.',
            't' => 'Signos de Puntuación'
        ],
        [
            'n' => 286,
            'p' => 'Selecciona los nexos de tipo condicional: 1.Si/sólo si, 2.Una vez que, 3.Dado que, 4.Siempre que, 5.Aun cuando, 6.A causa de.',
            'a' => '1, 2, 4',
            'b' => '1, 2, 6',
            'c' => '2, 3, 5',
            'd' => '2, 5, 6',
            'r' => 'A',
            'e' => '1, 2 y 4 establecen requisitos necesarios para que se cumpla una acción.',
            't' => 'Nexos y Conectores'
        ],
        [
            'n' => 287,
            'p' => 'La expresión: ¡Haz la tarea! ¿Qué función comunicativa expresa?',
            'a' => 'Emotiva',
            'b' => 'Apelativa',
            'c' => 'Expresiva',
            'd' => 'Metalingüística',
            'r' => 'B',
            'e' => 'La función apelativa busca influir u ordenar algo al receptor.',
            't' => 'Funciones de la Lengua'
        ],
        [
            'n' => 288,
            'p' => 'Relaciona puntos: 1.Comma (,), 2.Colón (:), 3.Puntos suspensivos (...). Función: a)Fin oración, b)Incompleto, c)Pausa mayor coma, d)Fin gramatical no lógico.',
            'a' => '1a, 2c, 3d',
            'b' => '1b, 2c, 3a',
            'c' => '1c, 2d, 3b',
            'd' => '1d, 2a, 3c',
            'r' => 'C',
            'e' => 'Punto y coma (c), Dos puntos (d), Suspensivos (b). Nota: Enunciado de relación un poco adaptado para coherencia.',
            't' => 'Signos de Puntuación'
        ],
        [
            'n' => 289,
            'p' => 'Consiste en transmitir una oración o párrafo tal cual aparece en la información original...',
            'a' => 'paráfrasis',
            'b' => 'cita textual',
            'c' => 'resumen',
            'd' => 'figura retórica',
            'r' => 'B',
            'e' => 'La cita textual es la reproducción exacta y fiel de un fragmento de texto ajeno.',
            't' => 'Fuentes de Información'
        ],
        [
            'n' => 290,
            'p' => 'La claridad, la objetividad y la precisión, son características fundamentales del texto:',
            'a' => 'Literario',
            'b' => 'Expositivo',
            'c' => 'Periodístico',
            'd' => 'Argumentativo',
            'r' => 'B',
            'e' => 'El texto expositivo prioriza la información factual de manera clara y sin subjetividad.',
            't' => 'Tipos de Textos'
        ],
        [
            'n' => 291,
            'p' => 'Elementos a considerar al exponer de forma oral:',
            'a' => 'postura, puntuación, valoración',
            'b' => 'volumen, postura, rapidez',
            'c' => 'entonación, volumen, postura',
            'd' => 'rapidez, operatividad, dicción',
            'r' => 'C',
            'e' => 'Entonación, Volumen y Postura son pilares de la comunicación oral efectiva.',
            't' => 'Comunicación Oral'
        ],
        [
            'n' => 292,
            'p' => 'Relaciona comunicación: 1.Directa, 2.Bilateral, 3.Indirecta, 4.Unilateral. Características: a)Frente a frente, b)Recíproca, c)Separados tiempo/espacio, d)Una sola dirección.',
            'a' => '1a, 2b, 3c, 4d',
            'b' => '1b, 2a, 3c, 4d',
            'c' => '1c, 2d, 3a, 4b',
            'd' => '1d, 2c, 3b, 4a',
            'r' => 'A',
            'e' => 'Clasificación estándar de flujos y medios de comunicación.',
            't' => 'Tipos de Comunicación'
        ],
        [
            'n' => 293,
            'p' => '¿Qué es la comprensión lectora?',
            'a' => 'Analizar la composición estructural del texto',
            'b' => 'Colocar los signos de puntuación de acuerdo a la gramática',
            'c' => 'Leer de manera correcta, haciendo las pausas oportunas',
            'd' => 'Capacidad de entender e interpretar el significado de un texto',
            'r' => 'D',
            'e' => 'Es el proceso cognitivo de decodificar y dar sentido profundo a lo leído.',
            't' => 'Habilidad Lectora'
        ],
        [
            'n' => 294,
            'p' => 'Los recursos gráficos se usan para interpretar de manera rápida y sencilla:',
            'a' => 'datos, tendencias, complementos',
            'b' => 'datos, comparaciones, tendencias',
            'c' => 'recuperaciones, datos, comparaciones',
            'd' => 'comparaciones, tendencias, recuperaciones',
            'r' => 'B',
            'e' => 'Grafican datos para visualizar rápidamente diferencias y proyecciones.',
            't' => 'Análisis de Información'
        ],
        [
            'n' => 295,
            'p' => 'Relaciona abreviaturas: 1.Dom, 2.Col, 3.Cd, 4.Tel, 5.Int, 6.Del. Significados: a)Colonia, b)Teléfono, c)Cerrada, d)Domicilio, e)Interior, f)Delegación, g)Ciudad.',
            'a' => '1d, 2a, 3g, 4b, 5e, 6f',
            'b' => '2g, 3b, 4a, 5c, 6e, 1a',
            'c' => '3d, 6e, 5c, 6b, 2a, 4f',
            'd' => '6a, 2e, 3b, 5f, 4c, 6d',
            'r' => 'A',
            'e' => 'Abreviaturas comunes en correspondencia y formularios.',
            't' => 'Escritura'
        ],
        [
            'n' => 296,
            'p' => 'Relaciona: 1.Inefable, 2.Efímero, 3.Melifluo, 4.Serendipia. Significado: a)Inexplicable, b)Inesperado, c)Original, d)Corto, e)Suave.',
            'a' => '1a, 2d, 3e, 4b',
            'b' => '1b, 2a, 3c, 4d',
            'c' => '1d, 2e, 3a, 4c',
            'd' => '1e, 2d, 3b, 4a',
            'r' => 'A',
            'e' => '1a (No se puede decir), 2d (Breve), 3e (Dulce), 4b (Hallazgo por suerte).',
            't' => 'Vocabulario'
        ],
        [
            'n' => 297,
            'p' => 'Escoge los sinónimos de la palabra comunicar.',
            'a' => 'Informar, repartir, especificar',
            'b' => 'Propagar, expandir, redimir',
            'c' => 'Hablar, expresar, sentir',
            'd' => 'Difundir, anunciar, propagar',
            'r' => 'D',
            'e' => 'Comunicar implica la difusión y anuncio de mensajes al exterior.',
            't' => 'Sinónimos'
        ],
        [
            'n' => 298,
            'p' => 'La función de un mapa conceptual es ______ la lectura al relacionar ______ con ______ previos.',
            'a' => 'graficar - análisis - datos',
            'b' => 'organizar - hechos - conceptos',
            'c' => 'analizar - gráficos - acontecimientos',
            'd' => 'comprender - conceptos - conocimientos',
            'r' => 'D',
            'e' => 'Mejora la comprensión mediante el anclaje de conceptos nuevos a conocimientos ya existentes.',
            't' => 'Organizadores'
        ],
        [
            'n' => 299,
            'p' => '¿En qué parte del artículo se invita a la reflexión al lector?',
            'a' => 'Inicio',
            'b' => 'Título',
            'c' => 'Cierre',
            'd' => 'Desarrollo',
            'r' => 'C',
            'e' => 'La conclusión o cierre es donde se sintetiza y se lanza la invitación final a reflexionar.',
            't' => 'Géneros Periodísticos'
        ],
        [
            'n' => 300,
            'p' => '¿Cuáles enunciados son ejemplos de "slogans"? 1.Hacer crecer futuro, 2.Al pan pan, 3.De tal palo, 4.Donde estrella es usted, 5.Agua pasa, 6.Único cuenta.',
            'a' => '1, 3, 2',
            'b' => '1, 4, 6',
            'c' => '2, 5, 6',
            'd' => '4, 5, 6',
            'r' => 'B',
            'e' => 'Los slogans son frases comerciales pegajosas (1, 4, 6). Las otras son refranes o adivinanzas populares.',
            't' => 'Publicidad'
        ]
    ];

    $sql = "INSERT INTO preguntas_politecnico 
            (guia_year, numero_pregunta, materia_id, pregunta_texto, opcion_a, opcion_b, opcion_c, opcion_d, respuesta_correcta, $col_explicacion, tema) 
            VALUES (2025, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    $stmt = $pdo->prepare($sql);

    foreach ($preguntas as $p) {
        $stmt->execute([
            $p['n'],
            $mid,
            $p['p'],
            $p['a'],
            $p['b'],
            $p['c'],
            $p['d'],
            $p['r'],
            $p['e'],
            $p['t']
        ]);
    }

    echo "✅ ¡Inserción completada! 30 preguntas de Habilidad Verbal añadidas con éxito.<br>";

} catch (Exception $e) {
    echo "<h3 style='color:red'>❌ Error: " . $e->getMessage() . "</h3>";
}

echo "<br><div style='padding:20px; background:#fff3e0; border-radius:10px;'>";
echo "✍️ <strong>¡Proceso Terminado!</strong><br>";
echo "Las preguntas oficiales de Habilidad Verbal están listas.<br><br>";
echo "<a href='verificar_preguntas_oficiales.php?materia=Habilidad Verbal' 
      style='display:inline-block; padding:12px 20px; background:#e65100; color:white; text-decoration:none; border-radius:5px; font-weight:bold;'>
      🛡️ Verificar Habilidad Verbal
      </a>";
echo "</div>";
?>