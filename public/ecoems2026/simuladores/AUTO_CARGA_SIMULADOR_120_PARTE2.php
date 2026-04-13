<?php
/**
 * CARGADOR AUTOMÁTICO - SIMULADOR OFICIAL 120 PREGUNTAS (PARTE 2)
 * Objetivo: Cargar reactivos 61-120 asignados al "año 20252".
 */

header('Content-Type: text/html; charset=utf-8');
include_once 'config.php';

echo "<h1>🚀 Cargando Parte 2 (Reactivos 61-120) [Simulador 2025]...</h1>";

try {
    // 1. Detectar columna explicación
    $stmt = $pdo->query("SHOW COLUMNS FROM preguntas_politecnico");
    $columnas = $stmt->fetchAll(PDO::FETCH_COLUMN);
    $col_explicacion = 'explicacion';
    foreach ($columnas as $c) {
        if (strpos($c, 'explicaci') !== false) {
            $col_explicacion = $c;
            break;
        }
    }

    // 2. Función auxiliar para obtener ID de materia (Mismo setup)
    if (!function_exists('getMateriaId')) {
        function getMateriaId($pdo, $nombre)
        {
            $stmt = $pdo->prepare("SELECT id FROM materias_politecnico WHERE nombre = ?");
            $stmt->execute([$nombre]);
            $id = $stmt->fetchColumn();
            return $id;
        }
    }

    // Pre-cargar IDs de materias
    $id_mate = getMateriaId($pdo, 'Matemáticas');
    $id_historia = getMateriaId($pdo, 'Historia');
    $id_geografia = getMateriaId($pdo, 'Geografía');
    $id_civica = getMateriaId($pdo, 'Formación Cívica y Ética');
    $id_hab_mat = getMateriaId($pdo, 'Habilidad Matemática');
    $id_hab_verb = getMateriaId($pdo, 'Habilidad Verbal');
    $id_espanol = getMateriaId($pdo, 'Español');
    // Nota: Fisica y Biologia no se usan en esta parte

    $preguntas = [];

    // --- BLOQUE 61-80: HISTORIA / GEOGRAFÍA / CÍVICA / HAB. MAT ---

    // 61. Emperador (Historia) - Repetido? Sí, parece repetido del 51. Pero user lo puso. Lo pongo.
    $preguntas[] = ['n' => 61, 'm' => $id_historia, 'p' => 'Último emperador de México:', 'a' => 'Iturbide', 'b' => 'Maximiliano', 'c' => 'Juárez', 'd' => 'Díaz', 'r' => 'B', 'e' => 'Maximiliano de Habsburgo.', 't' => 'Historia México'];

    // 62. Plan Iguala (Historia) - Repetido del 52.
    $preguntas[] = ['n' => 62, 'm' => $id_historia, 'p' => 'Plan de Iguala proclamado por:', 'a' => 'Hidalgo', 'b' => 'Morelos', 'c' => 'Iturbide', 'd' => 'Guerrero', 'r' => 'C', 'e' => 'Agustín de Iturbide.', 't' => 'Independencia'];

    // 63. Revolución iniciada (Historia) - Repetido del 53.
    $preguntas[] = ['n' => 63, 'm' => $id_historia, 'p' => 'Revolución Mexicana inició formalmente el:', 'a' => '16 sep 1810', 'b' => '20 nov 1910', 'c' => '24 feb 1821', 'd' => '5 mayo 1862', 'r' => 'B', 'e' => '20 de noviembre de 1910.', 't' => 'Revolución'];

    // 64. Entidades (Historia/Cívica) - Repetido del 54.
    $preguntas[] = ['n' => 64, 'm' => $id_civica, 'p' => 'México tiene actualmente:', 'a' => '31 estados y 1 CDMX', 'b' => '32 estados', 'c' => '30 estados', 'd' => '31 estados', 'r' => 'A', 'e' => '31 estados + CDMX.', 't' => 'División Política'];

    // 65. Sierra Madre Occidental (Geografía) - Repetido del 55.
    $preguntas[] = ['n' => 65, 'm' => $id_geografia, 'p' => 'Sierra Madre Occidental atraviesa principalmente:', 'a' => 'Chihuahua, Sonora...', 'b' => 'Puebla, Veracruz...', 'c' => 'Yucatán...', 'd' => 'Nuevo León...', 'r' => 'A', 'e' => 'Noroeste y Occidente.', 't' => 'Orografía'];

    // 66. Río largo (Geografía) - Repetido del 56.
    $preguntas[] = ['n' => 66, 'm' => $id_geografia, 'p' => 'Río más largo que atraviesa territorio mexicano:', 'a' => 'Bravo', 'b' => 'Lerma', 'c' => 'Grijalva', 'd' => 'Usumacinta', 'r' => 'A', 'e' => 'Río Bravo.', 't' => 'Hidrografía'];

    // 67. Lengua indígena (Geografía) - Repetido del 57.
    $preguntas[] = ['n' => 67, 'm' => $id_geografia, 'p' => 'Lengua indígena con mayor número hablantes:', 'a' => 'Maya', 'b' => 'Náhuatl', 'c' => 'Zapoteco', 'd' => 'Mixteco', 'r' => 'B', 'e' => 'Náhuatl (aprox 1.7 millones).', 't' => 'Demografía'];

    // 68. Voluntariado (Cívica) - Repetido del 58.
    $preguntas[] = ['n' => 68, 'm' => $id_civica, 'p' => 'El voluntariado se caracteriza por:', 'a' => 'Obligación', 'b' => 'Participación voluntaria y altruista', 'c' => 'Remunerado', 'd' => 'Servicio militar', 'r' => 'B', 'e' => 'Acción libre y solidaria.', 't' => 'Sociedad'];

    // 69. Empatía (Cívica) - Repetido del 59.
    $preguntas[] = ['n' => 69, 'm' => $id_civica, 'p' => 'La empatía consiste en:', 'a' => 'Ignorar', 'b' => 'Entender y compartir sentimientos', 'c' => 'Criticar', 'd' => 'Competir', 'r' => 'B', 'e' => 'Ponerse en los zapatos del otro.', 't' => 'Valores'];

    // 70. Art 3 (Cívica) - Repetido del 60.
    $preguntas[] = ['n' => 70, 'm' => $id_civica, 'p' => 'Art 3 Cons. establece educación:', 'a' => 'Privada', 'b' => 'Laica, gratuita, obligatoria', 'c' => 'Solo hombres', 'd' => 'Opcional', 'r' => 'B', 'e' => 'Educación pública laica y gratuita.', 't' => 'Leyes'];

    // 71. No maleficencia (Cívica/Ética)
    $preguntas[] = ['n' => 71, 'm' => $id_civica, 'p' => 'Principio ético de no hacer daño intencionalmente:', 'a' => 'Beneficencia', 'b' => 'No maleficencia', 'c' => 'Autonomía', 'd' => 'Justicia', 'r' => 'B', 'e' => 'Primum non nocere.', 't' => 'Ética'];

    // 72. Corrupción (Cívica)
    $preguntas[] = ['n' => 72, 'm' => $id_civica, 'p' => 'La corrupción se define como:', 'a' => 'Uso legítimo', 'b' => 'Abuso de poder para beneficio personal', 'c' => 'Participación', 'd' => 'Voluntariado', 'r' => 'B', 'e' => 'Uso indebido del poder público.', 't' => 'Problemas Sociales'];

    // 73. Desigualdad (Geografía/Cívica) -> Cívica
    $preguntas[] = ['n' => 73, 'm' => $id_civica, 'p' => 'Principal causa desigualdad económica México (CONEVAL):', 'a' => 'Falta educación y salud', 'b' => 'Exceso recursos', 'c' => 'Sobreproducción', 'd' => 'Inversión extranjera', 'r' => 'A', 'e' => 'Rezago educativo y carencias sociales.', 't' => 'Economía'];

    // 74. Diversidad cultural (Cívica)
    $preguntas[] = ['n' => 74, 'm' => $id_civica, 'p' => 'Diversidad cultural en México incluye:', 'a' => 'Solo español', 'b' => '68 lenguas indígenas y español', 'c' => 'Solo europeas', 'd' => '10 lenguas', 'r' => 'B', 'e' => '68 agrupaciones lingüísticas.', 't' => 'Identidad Nacional'];

    // 75. IDH (Geografía)
    $preguntas[] = ['n' => 75, 'm' => $id_geografia, 'p' => 'Índice Desarrollo Humano (IDH) mide:', 'a' => 'PIB', 'b' => 'Esperanza vida, educación, PIB', 'c' => 'Educación', 'd' => 'Salud', 'r' => 'B', 'e' => 'Indicador compuesto del PNUD.', 't' => 'Indicadores'];

    // 76. Ruralización (Geografía)
    $preguntas[] = ['n' => 76, 'm' => $id_geografia, 'p' => 'La ruralización se refiere a:', 'a' => 'Migración campo-ciudad', 'b' => 'Retorno urbano al campo', 'c' => 'Crecimiento ciudades', 'd' => 'Disminución rural', 'r' => 'B', 'e' => 'Proceso inverso a urbanización.', 't' => 'Población'];

    // 77. Cuenca (Geografía)
    $preguntas[] = ['n' => 77, 'm' => $id_geografia, 'p' => 'Cuenca hidrográfica más importante (centro):', 'a' => 'Bravo', 'b' => 'Lerma-Santiago', 'c' => 'Grijalva', 'd' => 'Balsas', 'r' => 'B', 'e' => 'Lerma-Santiago abastece zonas vitales.', 't' => 'Hidrología'];

    // 78. Población indígena (Geografía)
    $preguntas[] = ['n' => 78, 'm' => $id_geografia, 'p' => 'Región con mayor concentración indígena:', 'a' => 'Norte', 'b' => 'Centro', 'c' => 'Sur y sureste', 'd' => 'Baja California', 'r' => 'C', 'e' => 'Oaxaca, Chiapas, Yucatán, etc.', 't' => 'Demografía'];

    // 79. Voluntariado contribuye (Cívica)
    $preguntas[] = ['n' => 79, 'm' => $id_civica, 'p' => 'El voluntariado contribuye al:', 'a' => 'Bien común y desarrollo social', 'b' => 'Beneficio personal', 'c' => 'Obligación', 'd' => 'Militar', 'r' => 'A', 'e' => 'Fortalece tejido social.', 't' => 'Sociedad'];

    // 80. Tolerancia (Cívica)
    $preguntas[] = ['n' => 80, 'm' => $id_civica, 'p' => 'La tolerancia implica:', 'a' => 'Aceptar diferencias', 'b' => 'Ignorar', 'c' => 'Imponer', 'd' => 'Competir', 'r' => 'A', 'e' => 'Respeto a la diversidad.', 't' => 'Valores'];

    // --- BLOQUE 81-100: GEOGRAFÍA / CÍVICA / HAB. MAT ---

    // 81. Población 2025 (Geografía)
    $preguntas[] = ['n' => 81, 'm' => $id_geografia, 'p' => 'Población absoluta México 2025 aprox:', 'a' => '100 mill', 'b' => '126 mill', 'c' => '130 millones', 'd' => '150 mill', 'r' => 'C', 'e' => 'Proyecciones indican >130 millones.', 't' => 'Demografía'];

    // 82. Densidad (Geografía)
    $preguntas[] = ['n' => 82, 'm' => $id_geografia, 'p' => 'Estado mayor densidad población:', 'a' => 'CDMX', 'b' => 'Edomex', 'c' => 'Morelos', 'd' => 'Tlaxcala', 'r' => 'A', 'e' => 'CDMX con >6000 hab/km2.', 't' => 'Población'];

    // 83. Amenaza biodiversidad (Geografía)
    $preguntas[] = ['n' => 83, 'm' => $id_geografia, 'p' => 'Principal amenaza biodiversidad:', 'a' => 'Cambio climático y deforestación', 'b' => 'Población animal', 'c' => 'Lluvia ácida', 'd' => 'Aire', 'r' => 'A', 'e' => 'Destrucción hábitat y clima.', 't' => 'Ambiente'];

    // 84. Río frontera (Geografía)
    $preguntas[] = ['n' => 84, 'm' => $id_geografia, 'p' => 'Río frontera natural con EEUU:', 'a' => 'Lerma', 'b' => 'Bravo', 'c' => 'Grijalva', 'd' => 'Balsas', 'r' => 'B', 'e' => 'Río Bravo.', 't' => 'Fronteras'];

    // 85. Equidad género (Cívica)
    $preguntas[] = ['n' => 85, 'm' => $id_civica, 'p' => 'Equidad de género busca:', 'a' => 'Más derechos mujeres', 'b' => 'Igualar oportunidades', 'c' => 'Eliminar cultura', 'd' => 'Solo educación', 'r' => 'B', 'e' => 'Igualdad sustantiva.', 't' => 'Derechos Humanos'];

    // 86. Asertividad (Cívica)
    $preguntas[] = ['n' => 86, 'm' => $id_civica, 'p' => 'Asertividad es habilidad de:', 'a' => 'Agredir', 'b' => 'Expresar claro y respetuoso', 'c' => 'Callar', 'd' => 'Imponer', 'r' => 'B', 'e' => 'Comunicación efectiva y respetuosa.', 't' => 'Habilidades Sociales'];

    // 87. Justicia (Cívica)
    $preguntas[] = ['n' => 87, 'm' => $id_civica, 'p' => 'Principio de distribuir equitativamente:', 'a' => 'Autonomía', 'b' => 'Beneficencia', 'c' => 'Maleficencia', 'd' => 'Justicia', 'r' => 'D', 'e' => 'Dar a cada quien lo que corresponde.', 't' => 'Valores'];

    // 88. Bullying (Cívica)
    $preguntas[] = ['n' => 88, 'm' => $id_civica, 'p' => 'El bullying puede ser:', 'a' => 'Solo físico', 'b' => 'Físico, verbal, psicológico, cyber', 'c' => 'Solo verbal', 'd' => 'Psicológico', 'r' => 'B', 'e' => 'Acoso escolar es multifactorial.', 't' => 'Escuela'];

    // 89. Participación (Cívica)
    $preguntas[] = ['n' => 89, 'm' => $id_civica, 'p' => 'Participación ciudadana incluye:', 'a' => 'Solo votar', 'b' => 'Votar, asociarse, manifestarse', 'c' => 'Solo impuestos', 'd' => 'Ignorar', 'r' => 'B', 'e' => 'Implica involucramiento activo.', 't' => 'Democracia'];

    // 90. Tolerancia (Cívica) - Repetido del 80.
    $preguntas[] = ['n' => 90, 'm' => $id_civica, 'p' => 'Tolerancia implica:', 'a' => 'Aceptar diferencias', 'b' => 'Ignorar', 'c' => 'Imponer', 'd' => 'Competir', 'r' => 'A', 'e' => 'Respeto mutuo.', 't' => 'Valores'];

    // 91. Sucesión y=x+d (Hab. Mat)
    $preguntas[] = ['n' => 91, 'm' => $id_hab_mat, 'p' => 'Sucesión: 2, 5, 10, 17, 26, ...', 'a' => '35', 'b' => '37', 'c' => '39', 'd' => '41', 'r' => 'B', 'e' => 'Diferencias: 3, 5, 7, 9... siguiente +11. 26+11=37 (o n^2+1).', 't' => 'Sucesiones Numéricas'];

    // 92. Figura rotación (Hab. Mat)
    $preguntas[] = ['n' => 92, 'm' => $id_hab_mat, 'p' => 'Figura completa sucesión (rotación 90°).', 'a' => 'Fig 1', 'b' => 'Fig 2', 'c' => 'Fig 3', 'd' => 'Fig 4', 'r' => 'C', 'e' => 'Patrón de giro horario.', 't' => 'Series Visuales'];

    // 93. Reloj 4min (Hab. Mat)
    $preguntas[] = ['n' => 93, 'm' => $id_hab_mat, 'p' => 'Reloj atrasa 4 min/h. Sincroniza 8am. Hora real 2pm, reloj marca:', 'a' => '1:32', 'b' => '1:36', 'c' => '1:40', 'd' => '1:44', 'r' => 'B', 'e' => '6 horas * 4 = 24 min atraso. 2:00 - 24 = 1:36.', 't' => 'Razonamiento Lógico'];
    // Corrección lectura: Usuario dice "otro reloj INDICA 2pm" (real). Correcto.

    // 94. Cuadrícula (Hab. Mat)
    $preguntas[] = ['n' => 94, 'm' => $id_hab_mat, 'p' => 'En cuadrícula 4x4 puntos, ¿cuántos cuadrados 1x1?', 'a' => '9', 'b' => '12', 'c' => '16', 'd' => '25', 'r' => 'A', 'e' => '4x4 puntos genera 3x3 espacios = 9 cuadrados.', 't' => 'Conteo Figuras'];

    // 95. Sol-Dia (Hab. Verb)
    $preguntas[] = ['n' => 95, 'm' => $id_hab_verb, 'p' => 'Sol es a día como Luna es a...', 'a' => 'Noche', 'b' => 'Estrella', 'c' => 'Cielo', 'd' => 'Oscuridad', 'r' => 'A', 'e' => 'Astro dominante del periodo.', 't' => 'Analogías'];

    // 96. No pertenece (Hab. Mat)
    $preguntas[] = ['n' => 96, 'm' => $id_hab_mat, 'p' => 'Palabra que no pertenece:', 'a' => 'Triángulo', 'b' => 'Cuadrado', 'c' => 'Círculo', 'd' => 'Rectángulo', 'r' => 'C', 'e' => 'Círculo no tiene lados rectos.', 't' => 'Clasificación'];

    // 97. Gatos (Hab. Mat)
    $preguntas[] = ['n' => 97, 'm' => $id_hab_mat, 'p' => '3 gatos cazan 3 ratones en 3 min. ¿Cuántos gatos cazan 100 ratones en 100 min?', 'a' => '3', 'b' => '100', 'c' => '300', 'd' => '33', 'r' => 'A', 'e' => '1 gato tarde 3 min en cazar 1 ratón. En 100 min, 1 gato caza 33.3. 3 gatos cazan 100 en 100 min.', 't' => 'Proporcionalidad Inversa'];

    // 98. Sucesión ACI (Hab. Mat) -> Sucesión A, C, E... (User puso A, C, I, I, O? No, user dijo "A, C, I, I, O" luego corrigió "A U" en justificación "Patrón vocales"). 
    // Usuario texto: "Secuencia de letras A, C, I, I, O... A) U" Justif: "Patrón de vocales... ajustado a U". 
    // Interpretación: Probablemente era A, E, I, O... o A, C... algo raro. Pondré la versión corregida 'U' y texto 'Secuencia Vocales'.
    $preguntas[] = ['n' => 98, 'm' => $id_hab_verb, 'p' => 'Sucesión de vocales: A, E, I, O, ...', 'a' => 'U', 'b' => 'V', 'c' => 'W', 'd' => 'X', 'r' => 'A', 'e' => 'Sucesión natural de vocales.', 't' => 'Series Verbales'];

    // 99. Triángulos (Hab. Mat)
    $preguntas[] = ['n' => 99, 'm' => $id_hab_mat, 'p' => 'Cuántos triángulos en figura (Grande dividido en 4 pequeños):', 'a' => '4', 'b' => '5', 'c' => '6', 'd' => '8', 'r' => 'D', 'e' => 'Total combinatorio 8.', 't' => 'Conteo'];

    // 100. Días (Hab. Mat)
    $preguntas[] = ['n' => 100, 'm' => $id_hab_mat, 'p' => 'Si hoy es miércoles, día en 100 días:', 'a' => 'Martes', 'b' => 'Miércoles', 'c' => 'Jueves', 'd' => 'Viernes', 'r' => 'D', 'e' => '100 mod 7 = 2. Miércoles + 2 = Viernes. (Nota: Usuario puso A=Martes con justificación fallida pero al final dijo viernes. Pondré Viernes opción D como correcta calculada).', 't' => 'Calendario'];
    // Corrección: El usuario puso respuesta A (Martes) pero en justificación admitió "100 mod 7 = 2, miercoles+2=viernes".
    // Pondré Viernes como correcta (D) para que el simulador sea útil.

    // --- BLOQUE 101-120: HAB. MAT / HAB. VERBAL ---

    // 101. Cuadrados (Hab. Mat)
    $preguntas[] = ['n' => 101, 'm' => $id_hab_mat, 'p' => 'Sucesión: 1, 4, 9, 16, 25, 36...', 'a' => '49, 64', 'b' => '49, 81', 'c' => '64, 81', 'd' => '81, 100', 'r' => 'A', 'e' => 'Cuadrados perfectos.', 't' => 'Sucesiones'];

    // 102. Triángulos 9 (Hab. Mat)
    $preguntas[] = ['n' => 102, 'm' => $id_hab_mat, 'p' => 'Triángulos en figura (Grande dividido en 9 pequeños):', 'a' => '9', 'b' => '13', 'c' => '18', 'd' => '27', 'r' => 'C', 'e' => '1+3+6+ ... Total 18.', 't' => 'Conteo'];

    // 103. Parentesco (Hab. Mat/Verb)
    $preguntas[] = ['n' => 103, 'm' => $id_hab_mat, 'p' => 'A hermano de B, B hermana de C, C hijo de D. A con D:', 'a' => 'Hermano', 'b' => 'Hijo', 'c' => 'Padre', 'd' => 'Tío', 'r' => 'B', 'e' => 'A es hijo de D.', 't' => 'Relaciones'];

    // 104. Secuencia rotación (Hab. Mat)
    $preguntas[] = ['n' => 104, 'm' => $id_hab_mat, 'p' => 'Secuencia figura rotación y color.', 'a' => 'Rotación 90 color inv', 'b' => '180', 'c' => 'Igual', 'd' => 'Espejo', 'r' => 'A', 'e' => 'Patrón combinado.', 't' => 'Series Visuales'];

    // 105. Serie (Hab. Mat)
    $preguntas[] = ['n' => 105, 'm' => $id_hab_mat, 'p' => 'Serie: 7, 10, 16, 25, 37...', 'a' => '49', 'b' => '52', 'c' => '55', 'd' => '58', 'r' => 'B', 'e' => 'Dif: 3, 6, 9, 12... +15. 37+15=52.', 't' => 'Sucesiones'];

    // 106. No pertenece (Hab. Verb)
    $preguntas[] = ['n' => 106, 'm' => $id_hab_verb, 'p' => 'Palabra no pertenece:', 'a' => 'Alegre', 'b' => 'Feliz', 'c' => 'Triste', 'd' => 'Contento', 'r' => 'C', 'e' => 'Triste es antónimo.', 't' => 'Clasificación Semántica'];

    // 107. Pluma (Hab. Verb)
    $preguntas[] = ['n' => 107, 'm' => $id_hab_verb, 'p' => 'Pluma es a escribir como pincel es a:', 'a' => 'Leer', 'b' => 'Pintar', 'c' => 'Comer', 'd' => 'Caminar', 'r' => 'B', 'e' => 'Herramienta-Acción.', 't' => 'Analogías'];

    // 108. Literario (Español)
    $preguntas[] = ['n' => 108, 'm' => $id_espanol, 'p' => 'Recurso: "Viento silbaba entre árboles":', 'a' => 'Metáfora', 'b' => 'Onomatopeya', 'c' => 'Símil', 'd' => 'Personificación', 'r' => 'D', 'e' => 'Cualidad humana a inanimado.', 't' => 'Figuras Literarias'];

    // 109. Función (Español)
    $preguntas[] = ['n' => 109, 'm' => $id_espanol, 'p' => 'Función: "¡Qué bonito día!":', 'a' => 'Informativa', 'b' => 'Expresiva', 'c' => 'Apelativa', 'd' => 'Metalingüística', 'r' => 'B', 'e' => 'Emotiva o expresiva.', 't' => 'Funciones Lengua'];

    // 110. Ortografía (Español)
    $preguntas[] = ['n' => 110, 'm' => $id_espanol, 'p' => 'Error ortográfico:', 'a' => 'El niño jugaba', 'b' => 'La casa esta limpia', 'c' => 'Quiero ir', 'd' => 'Ellos corren', 'r' => 'B', 'e' => 'Esta (demostrativo) vs Está (verbo). Falta tilde.', 't' => 'Ortografía'];

    // 111. Idea principal (Español)
    $preguntas[] = ['n' => 111, 'm' => $id_espanol, 'p' => 'Idea principal párrafo calentamiento global:', 'a' => 'No existe', 'b' => 'Causa efectos graves', 'c' => 'Plantas absorben', 'd' => 'México no afectado', 'r' => 'B', 'e' => 'Consecuencias negativas.', 't' => 'Comprensión'];

    // 112. Paráfrasis (Español)
    $preguntas[] = ['n' => 112, 'm' => $id_espanol, 'p' => 'Paráfrasis "El que mucho abarca poco aprieta":', 'a' => 'Quien intenta mucho no hace bien', 'b' => 'Trabajo duro', 'c' => 'Ahorra', 'd' => 'Tiempo oro', 'r' => 'A', 'e' => 'Interpretación correcta.', 't' => 'Refranes'];

    // 113. Editorial (Español)
    $preguntas[] = ['n' => 113, 'm' => $id_espanol, 'p' => 'Tipo de texto editorial:', 'a' => 'Narrativo', 'b' => 'Descriptivo', 'c' => 'Argumentativo', 'd' => 'Expositivo', 'r' => 'C', 'e' => 'Opinión argumentada.', 't' => 'Géneros Periodísticos'];

    // 114. Serie letras (Hab. Mat/Verb)
    $preguntas[] = ['n' => 114, 'm' => $id_hab_mat, 'p' => 'Serie: A, C, E, G, I...', 'a' => 'J', 'b' => 'K', 'c' => 'L', 'd' => 'M', 'r' => 'B', 'e' => 'Saltando una letra: K.', 't' => 'Series Alfabéticas'];

    // 115. Cuadrados 16 (Hab. Mat)
    $preguntas[] = ['n' => 115, 'm' => $id_hab_mat, 'p' => 'Cuadrados en figura 4x4 (dividido 16 peq):', 'a' => '16', 'b' => '20', 'c' => '30', 'd' => '40', 'r' => 'C', 'e' => '16+9+4+1=30.', 't' => 'Conteo'];

    // 116. Trabajadores (Mate)
    $preguntas[] = ['n' => 116, 'm' => $id_mate, 'p' => '5 trabajadores en 10 días. 10 trabajadores tardan:', 'a' => '5 días', 'b' => '10 días', 'c' => '20 días', 'd' => '15 días', 'r' => 'A', 'e' => 'Inversamente proporcional. Doble trabajadores = Mitad tiempo.', 't' => 'Proporcionalidad'];

    // 117. No pertenece (Hab. Mat)
    $preguntas[] = ['n' => 117, 'm' => $id_hab_mat, 'p' => 'Figura no pertenece:', 'a' => 'Triángulo', 'b' => 'Cuadrado', 'c' => 'Pentágono', 'd' => 'Círculo', 'r' => 'D', 'e' => 'Cuerpo curvo vs polígonos.', 't' => 'Clasificación'];

    // 118. Días (Hab. Mat)
    $preguntas[] = ['n' => 118, 'm' => $id_hab_mat, 'p' => 'Si hoy lunes, en 50 días:', 'a' => 'Martes', 'b' => 'Miércoles', 'c' => 'Jueves', 'd' => 'Viernes', 'r' => 'A', 'e' => '50 = 7*7 + 1. Lunes + 1 = Martes.', 't' => 'Calendario'];

    // 119. Analogía (Hab. Verb)
    $preguntas[] = ['n' => 119, 'm' => $id_hab_verb, 'p' => 'Médico es a hospital como profesor a:', 'a' => 'Libro', 'b' => 'Escuela', 'c' => 'Estudiante', 'd' => 'Pizarrón', 'r' => 'B', 'e' => 'Lugar de trabajo.', 't' => 'Analogías'];

    // 120. Sinónimo (Hab. Verb)
    $preguntas[] = ['n' => 120, 'm' => $id_hab_verb, 'p' => 'Sinónimo de efímero:', 'a' => 'Permanente', 'b' => 'Transitorio', 'c' => 'Eterno', 'd' => 'Duradero', 'r' => 'B', 'e' => 'Pasajero, corta duración.', 't' => 'Sinónimos'];


    $sql = "INSERT INTO preguntas_politecnico 
            (guia_year, numero_pregunta, materia_id, pregunta_texto, opcion_a, opcion_b, opcion_c, opcion_d, respuesta_correcta, $col_explicacion, tema) 
            VALUES (20252, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    $stmt = $pdo->prepare($sql);

    foreach ($preguntas as $p) {
        $stmt->execute([
            $p['n'],
            $p['m'],
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

    echo "✅ Bloque 61-120 insertado correctamente.<br>";
    echo "<br><div style='padding:20px; background:#e8f5e9; border-radius:10px;'>";
    echo "🎉 <strong>¡SIMULADOR COMPLETO CARGADO!</strong><br>";
    echo "Los 120 reactivos del Simulador Oficial 2025 están listos bajo el ID interno 20252.<br><br>";
    echo "</div>";

} catch (Exception $e) {
    echo "<h3 style='color:red'>❌ Error: " . $e->getMessage() . "</h3>";
}
?>