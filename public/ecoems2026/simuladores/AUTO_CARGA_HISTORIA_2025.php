<?php
/**
 * CARGADOR AUTOMÁTICO DE PREGUNTAS DE HISTORIA - POLITÉCNICO 2025
 * Versión: 1.0 (Historia)
 * Objetivo: Insertar 30 preguntas oficiales con justificaciones detalladas.
 */

header('Content-Type: text/html; charset=utf-8');
include 'config.php';

echo "<h1>🚀 Cargador Automático Historia Politécnico 2025 (v1.0)</h1>";

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

    // Obtener ID de Historia
    // En el simulador se busca como 'Historia', aunque en la DB puede haber 'Historia de México' o 'Historia Universal'
    // Para simplificar y mantener compatibilidad con el LIKE 'Historia%' del simulador, usaremos 'Historia'
    $mid_stmt = $pdo->query("SELECT id FROM materias_politecnico WHERE nombre = 'Historia'");
    $mid = $mid_stmt->fetchColumn();
    if (!$mid) {
        $pdo->exec("INSERT INTO materias_politecnico (nombre) VALUES ('Historia')");
        $mid = $pdo->lastInsertId();
    }

    // Limpiar datos previos de Historia 2025
    $pdo->prepare("DELETE FROM preguntas_politecnico WHERE guia_year = 2025 AND materia_id = ?")->execute([$mid]);
    echo "ℹ️ Registros antiguos de Historia 2025 limpiados.<br>";

    // DATA OFICIAL (Reactivos 151-180)
    $preguntas = [
        [
            'n' => 151,
            'p' => 'Es la teoría del poblamiento del continente americano que sostiene que grupos humanos procedentes de Asia, ingresaron a América por el estrecho de Bering.',
            'a' => 'Redclovis',
            'b' => 'Consenso Clovis',
            'c' => 'Pre-Clovis',
            'd' => 'Insenso Clovis',
            'r' => 'B',
            'e' => 'La teoría del poblamiento tardío o consenso Clovis sostiene que grupos de cazadores-recolectores procedentes de Asia, ingresaron a América hace unos 14000 a 13500 años por el estrecho de Bering.',
            't' => 'Poblamiento de América'
        ],
        [
            'n' => 152,
            'p' => 'Selecciona las culturas que poblaron el continente americano desde Bering hasta la Patagonia. 1. Íberos 2. Valdivia 3. Celtas 4. Chavín 5. Nazca 6. Vučedol',
            'a' => '1, 3, 4',
            'b' => '1, 2, 4',
            'c' => '2, 5, 6',
            'd' => '2, 4, 5',
            'r' => 'D',
            'e' => 'Culturas americanas tempranas: Valdivia, Chavín, Nazca, Moche, Paracas, Inca, entre otras.',
            't' => 'Culturas Prehispánicas'
        ],
        [
            'n' => 153,
            'p' => '¿Qué fue el nomadismo?',
            'a' => 'Primera forma de vida desarrollada por el ser humano',
            'b' => 'Una forma de cazar animales para la subsistencia',
            'c' => 'La primera migración para el poblamiento de Pangea',
            'd' => 'Una forma de asentamiento de la población',
            'r' => 'A',
            'e' => 'El nomadismo fue la primera forma de vida humana; grupos sin lugar fijo que se desplazan según temporadas para subsistir de caza, pesca y recolección.',
            't' => 'Nomadismo'
        ],
        [
            'n' => 154,
            'p' => 'El método ______ analiza dos o más fenómenos, para establecer sus ______ y _____; sacar conclusiones que definan un problema, o establezcan caminos futuros para mejorar el conocimiento de algo.',
            'a' => 'Interpretativo - paradigmas - objetivos',
            'b' => 'apreciativo - objetivos - métodos',
            'c' => 'comparativo - similitudes - diferencias',
            'd' => 'apelativo - diferencias - inferencias',
            'r' => 'C',
            'e' => 'El método comparativo establece similitudes y diferencias entre fenómenos para definir problemas o mejorar el conocimiento.',
            't' => 'Metodología Histórica'
        ],
        [
            'n' => 155,
            'p' => 'Relaciona las fuentes históricas primarias y secundarias con sus ejemplos. Fuentes: 1. Primarias 2. Secundarias. Ejemplos: a) Documento escrito por el autor, b) Libro que refiere hechos, c) Estudio actual de un documento, d) Vestigios pintados en cavernas, e) Herramientas de caza, f) Monumento en homenaje.',
            'a' => '1ad, 2bef',
            'b' => '1bce, 2adf',
            'c' => '1cdf, 2abe',
            'd' => '1ade, 2bcf',
            'r' => 'D',
            'e' => 'Primarias: evidencia de primera mano (pinturas, herramientas, documentos originales). Secundarias: estudios, reseñas o libros sobre los hechos.',
            't' => 'Fuentes Históricas'
        ],
        [
            'n' => 156,
            'p' => 'El texto maya que narra los mitos de la creación y describe las primeras dinastías humanas es el...',
            'a' => 'Popol Vuh',
            'b' => 'Calmecac',
            'c' => 'Telpochcall',
            'd' => 'Calpulli',
            'r' => 'A',
            'e' => 'El Popol Vuh es el libro sagrado maya sobre creación y dinastías, clave para entender su religión e historia.',
            't' => 'Cultura Maya'
        ],
        [
            'n' => 157,
            'p' => '¿En qué fecha se conmemora el Día Internacional de la Mujer?',
            'a' => '8 de marzo',
            'b' => '6 de mayo',
            'c' => '18 de marzo',
            'd' => '15 de mayo',
            'r' => 'A',
            'e' => 'El 8 de marzo conmemora la lucha femenina por la igualdad y su participación social.',
            't' => 'Efemérides'
        ],
        [
            'n' => 158,
            'p' => 'Es el reconocimiento de la población afrodescendiente en México y sus aportes al desarrollo social, cultural y económico del país.',
            'a' => 'Primera Raíz',
            'b' => 'Africanismo',
            'c' => 'Tercera Raíz',
            'd' => 'Afromexicanismo',
            'r' => 'C',
            'e' => 'La Tercera Raíz reconoce la herencia africana en México, oficializada en 1992.',
            't' => 'Afromexicanidad'
        ],
        [
            'n' => 159,
            'p' => 'Selecciona algunos tipos de discriminación. 1. Política 2. Social 3. Psicológica 4. Género 5. Alimenticia 6. Económica 7. Personal',
            'a' => '1, 3, 5, 6',
            'b' => '1, 2, 4, 6',
            'c' => '2, 3, 5, 7',
            'd' => '2, 4, 6, 7',
            'r' => 'B',
            'e' => 'Tipos comunes de discriminación: política, económica, social y de género.',
            't' => 'Problemas Sociales'
        ],
        [
            'n' => 160,
            'p' => 'Relaciona a las pioneras del feminismo con sus aportes. 1. Olimpia de Gouges, 2. Mary Wollstone Craft, 3. Simone de Beauvoir, 4. Rosa Parks. Aportes: a) Derechos civiles afro, b) Bases feminismo liberal, c) Liga derechos mujer, d) Fin segregación racial, e) Educación mujer, f) Construcción social mujer, g) Derechos mujer y ciudadana, h) Igualdad vida pública/privada.',
            'a' => '1ab, 2cd, 3ef, 4gh',
            'b' => '1bc, 2de, 3fg, 4ha',
            'c' => '1de, 2cf, 3ae, 4gh',
            'd' => '1gh, 2be, 3cf, 4ad',
            'r' => 'D',
            'e' => 'Gouges: Derechos Mujer (g,h). Wollstonecraft: Educación (b,e). Beauvoir: Construcción social (c,f). Parks: Derechos civiles (a,d).',
            't' => 'Feminismo'
        ],
        [
            'n' => 161,
            'p' => 'Algunas causas que propiciaron las exploraciones expansionistas fueron:',
            'a' => 'Las guerras entre el reino de Castilla y Aragón y la alianza con los musulmanes',
            'b' => 'Bloqueo a las rutas comerciales Europa - Asia y la alianza matrimonial de los reyes católicos',
            'c' => 'La falta de materias primas para productos básicos y el ansia expansionista',
            'd' => 'Las revoluciones árabes y las alianzas con los ingleses',
            'r' => 'B',
            'e' => 'Causas: Bloqueo otomano a rutas comerciales (1453), alianza de reyes católicos y sed de expansión territorial.',
            't' => 'Exploraciones Marítimas'
        ],
        [
            'n' => 162,
            'p' => '¿Qué conmemora el día de la hispanidad?',
            'a' => 'La llegada de Cristóbal Colón a tierras occidentales',
            'b' => 'La unificación del español como idioma de México',
            'c' => 'La hermandad entre europeos y aztecas',
            'd' => 'La llegada de los Reyes Católicos a occidente',
            'r' => 'A',
            'e' => 'El 12 de octubre conmemora la llegada de Colón a América en 1492 (Descubrimiento de América).',
            't' => 'Descubrimiento de América'
        ],
        [
            'n' => 163,
            'p' => 'Ordena cronológicamente los sucesos. 1. Unión coronas Castilla/Aragón, 2. Bulas Alejandrinas, 3. Bloqueo comercial otomano, 4. Exploraciones ibéricas, 5. Tratado de Tordesillas, 6. Colonización.',
            'a' => '1, 3, 4, 2, 5, 6',
            'b' => '2, 1, 3, 6, 5, 4',
            'c' => '3, 4, 1, 2, 5, 6',
            'd' => '3, 1, 6, 4, 2, 5',
            'r' => 'C',
            'e' => 'Cronología: Bloqueo (1453), Exploraciones, Unión Real (1469), Bulas (1493), Tordesillas (1494), Colonización.',
            't' => 'Expansionismo Europeo'
        ],
        [
            'n' => 164,
            'p' => 'La Caída de Tenochtitlán aconteció el...',
            'a' => '11 de agosto de 1421',
            'b' => '13 de agosto de 1521',
            'c' => '11 de octubre de 1421',
            'd' => '16 de octubre de 1521',
            'r' => 'B',
            'e' => 'Cuauhtémoc se rindió el 13 de agosto de 1521 ante Hernán Cortés, marcando el fin del imperio mexica.',
            't' => 'La Conquista'
        ],
        [
            'n' => 165,
            'p' => 'Es la derrota sufrida por los soldados españoles de Hernán Cortés y sus aliados indígenas tlaxcaltecas, a manos del ejército mexica en las afueras de Tenochtitlán.',
            'a' => 'La noche triste',
            'b' => 'Derrota sufrida',
            'c' => 'La noche oscura',
            'd' => 'Tarde de asedio',
            'r' => 'A',
            'e' => 'La Noche Triste (30 de junio - 1 de julio, 1520) fue la gran derrota española al intentar salir de Tenochtitlán.',
            't' => 'La Conquista'
        ],
        [
            'n' => 166,
            'p' => 'Selecciona las órdenes evangelizadoras de la Nueva España. 1. Moros 2. Franciscanos 3. Evangelizadores 4. Dominicos 5. Agustinos 6. Jesuitas 7. Cristianos',
            'a' => '1, 3, 4, 5',
            'b' => '1, 5, 6, 7',
            'c' => '2, 4, 5, 6',
            'd' => '3, 7, 5, 2',
            'r' => 'C',
            'e' => 'Órdenes religiosas principales: Franciscanos (1524), Dominicos (1526), Agustinos (1533) y Jesuitas (1572).',
            't' => 'Evangelización'
        ],
        [
            'n' => 167,
            'p' => 'La sociedad novohispana estaba conformada por:',
            'a' => 'españoles, castas, asiáticos, belgas',
            'b' => 'peninsulares, criollos, indígenas, castas',
            'c' => 'criollos, africanos, españoles, vascos',
            'd' => 'indígenas, criollos, peninsulares, musulmanes',
            'r' => 'B',
            'e' => 'Castas novohispanas: Peninsulares (españoles), Criollos (hijos en América), Indígenas, Africanos, Asiáticos y sus mezclas.',
            't' => 'Sociedad Novohispana'
        ],
        [
            'n' => 168,
            'p' => 'Relaciona los acontecimientos externos que favorecieron la independencia de México. Acontecimiento: 1. Ilustración, 2. Independencia 13 Colonias, 3. Revolución Francesa, 4. Reformas Borbónicas. Descripción: a) Emancipación Gran Bretaña 1783, b) Cambios administrativos monarquía, c) Pensamiento racional/liberal s.XVII, d) Conflicto social/político Francia.',
            'a' => '1a, 2b, 3d, 4c',
            'b' => '1c, 2a, 3d, 4b',
            'c' => '1b, 2d, 3c, 4a',
            'd' => '1d, 2a, 3b, 4c',
            'r' => 'B',
            'e' => 'Influencias externas: Ilustración (ideas), 13 Colonias (ejemplo exitoso), Rev. Francesa (fin antiguo régimen), Reformas Borbónicas (presión interna).',
            't' => 'Antecedentes Independencia'
        ],
        [
            'n' => 169,
            'p' => 'El movimiento de Independencia, de México, duró de ___ a ___ en este se enfrentaron ___ y ___ por intereses totalmente opuestos.',
            'a' => '1810 - 1821 - insurgentes - realistas',
            'b' => '1809 - 1820 - españoles - criollos',
            'c' => '1810 - 1910 - conservadores - realistas',
            'd' => '1809 - 1909 - insurgentes - criollos',
            'r' => 'A',
            'e' => 'La Guerra duró 11 años (1810-1821) entre Insurgentes (soberanía) y Realistas (leales a la Corona).',
            't' => 'Independencia de México'
        ],
        [
            'n' => 170,
            'p' => 'El periodo de la lucha de Independencia de México se divide en:',
            'a' => 'afronta, medio, clima y consumación',
            'b' => 'principio, medio, intermedio y final',
            'c' => 'inicio, auge, resistencia y consumación',
            'd' => 'afronta, auge, medio y final',
            'r' => 'C',
            'e' => 'Fases: Inicio (Hidalgo), Auge (Morelos), Resistencia (guerrillas) y Consumación (Iturbide/Guerrero).',
            't' => 'Etapas Independencia'
        ],
        [
            'n' => 171,
            'p' => 'Son los manuscritos legales en los que se reconoce la independencia del Imperio mexicano.',
            'a' => 'Tratados del Virrey',
            'b' => 'Acuerdo de la Hispania',
            'c' => 'Tratados de Córdoba',
            'd' => 'Acta de Independencia',
            'r' => 'C',
            'e' => 'Tratados de Córdoba (O’Donojú e Iturbide): documento que reconoce la independencia de México en 1821.',
            't' => 'Consumación Independencia'
        ],
        [
            'n' => 172,
            'p' => 'Al periodo que abarca desde la caída del imperio romano en el año 476 (siglo VI), hasta el descubrimiento de América en 1492 (siglo XV) se le conoce como...',
            'a' => 'Ilustración',
            'b' => 'Edad antigua',
            'c' => 'Imperialismo',
            'd' => 'Edad media',
            'r' => 'D',
            'e' => 'La Edad Media abarca del siglo V (caída de Roma) al XV (descubrimiento de América/caída Constantinopla).',
            't' => 'Historia Universal'
        ],
        [
            'n' => 173,
            'p' => 'Selecciona los enunciados que refieren al Islam. 1. Unificó pueblos rusos/africanos, 2. Surgió s.VII península golfo Pérsico/mar Rojo, 3. Expansión Australia, 4. Mahoma/Corán/Alá, 5. Esplendor s.VII-XI.',
            'a' => '1, 3, 4',
            'b' => '1, 4, 5',
            'c' => '2, 4, 5',
            'd' => '2, 3, 4',
            'r' => 'C',
            'e' => 'Islam: origen en s.VII (Arabia), pilares (Mahoma, Corán, Alá), gran esplendor cultural y científico medieval.',
            't' => 'Historia Universal'
        ],
        [
            'n' => 174,
            'p' => 'Ordena cronológicamente: 1. Jeu de Paume, 2. Derrocamiento Monarquía, 3. Toma Bastilla, 4. Napoleón poder, 5. República, 6. Tribunal Revolucionario, 7. Derechos Hombre.',
            'a' => '1, 2, 5, 6, 4, 7, 3',
            'b' => '1, 3, 7, 2, 5, 6, 4',
            'r' => 'B',
            'c' => '2, 4, 5, 3, 1, 6, 7',
            'd' => '2, 5, 7, 4, 3, 1, 6',
            'e' => 'Cronología Rev. Francesa: Bastilla (julio 1789), Derechos (agosto 1789), República (1792), Napoleón (1799).',
            't' => 'Revolución Francesa'
        ],
        [
            'n' => 175,
            'p' => 'La primera Guerra Mundial o ____, fue un conflicto militar que se inició en ____ a causa del asesinato de ____ archiduque de Austria.',
            'a' => 'guerra anterior - 1912 - Francisco José',
            'b' => 'guerra nacional - 1914 - Pablo Francisco',
            'c' => 'peor guerra - 1912 - Pedro Fernando',
            'd' => 'gran guerra - 1914 - Francisco Fernando',
            'r' => 'D',
            'e' => 'La Gran Guerra (1914-1918) estalló tras el asesinato del archiduque Francisco Fernando en Sarajevo.',
            't' => 'Primera Guerra Mundial'
        ],
        [
            'n' => 176,
            'p' => 'El presidente que mandó al escuadrón 201 a combatir, ante el ataque alemán a un buque petrolero mexicano durante la Segunda Guerra mundial fue...',
            'a' => 'Díaz Ordaz',
            'b' => 'Lázaro Cárdenas del Río',
            'c' => 'Miguel Alemán Valdés',
            'd' => 'Manuel Ávila Camacho',
            'r' => 'D',
            'e' => 'Manuel Ávila Camacho declaró la guerra al Eje en 1942 tras el hundimiento del Potrero del Llano.',
            't' => 'México Contemporáneo'
        ],
        [
            'n' => 177,
            'p' => 'Ordena cronológicamente, los modos de producción que establece Karl Marx en sus estudios económicos. 1. Socialismo 2. Esclavismo 3. Feudalismo 4. Capitalismo',
            'a' => '1, 4, 3, 2',
            'b' => '2, 3, 4, 1',
            'c' => '3, 2, 1, 4',
            'd' => '4, 1, 2, 3',
            'r' => 'B',
            'e' => 'Marxismo: evolución histórica de modos de producción -> esclavismo -> feudalismo -> capitalismo -> socialismo.',
            't' => 'Estructura Socioeconómica'
        ],
        [
            'n' => 178,
            'p' => '¿Qué representa la Imagen? (Secuencia evolutiva de primates a humanos modernos).',
            'a' => 'Adaptación del Hombre',
            'b' => 'Evolución Humana',
            'c' => 'Crecimiento del Hombre',
            'd' => 'Migración Humana',
            'r' => 'B',
            'e' => 'La imagen muestra la evolución biológica del ser humano desde sus ancestros primates.',
            't' => 'Origen del Hombre'
        ],
        [
            'n' => 179,
            'p' => 'El nombre científico de la especie humana es...',
            'a' => 'Homo habilis',
            'b' => 'Australopiteco',
            'c' => 'Humanoide',
            'd' => 'Homo Sapiens',
            'r' => 'D',
            'e' => 'Homo Sapiens ("hombre sabio") es el nombre científico de nuestra especie actual dentro de los homínidos.',
            't' => 'Antropología'
        ],
        [
            'n' => 180,
            'p' => 'En la imagen el Australopithecus y el hombre de neandertal, están representados por los números.',
            'a' => '1 y 4',
            'b' => '1 y 5',
            'c' => '2 y 3',
            'd' => '2 y 5',
            'r' => 'A',
            'e' => 'Australopithecus (ancestro bípede pionero) y Neandertal (pariente más cercano extinto).',
            't' => 'Evolución Humana'
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

    echo "✅ ¡Inserción completada! 30 preguntas de Historia añadidas con éxito.<br>";

} catch (Exception $e) {
    echo "<h3 style='color:red'>❌ Error: " . $e->getMessage() . "</h3>";
}

echo "<br><div style='padding:20px; background:#fff3e0; border-radius:10px;'>";
echo "📜 <strong>¡Proceso Terminado!</strong><br>";
echo "Las preguntas oficiales de Historia están listas.<br><br>";
echo "<a href='verificar_preguntas_oficiales.php?materia=Historia' 
      style='display:inline-block; padding:12px 20px; background:#e65100; color:white; text-decoration:none; border-radius:5px; font-weight:bold;'>
      🛡️ Verificar Preguntas de Historia
      </a>";
echo "</div>";
?>