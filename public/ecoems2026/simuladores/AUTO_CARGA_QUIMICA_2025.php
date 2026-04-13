<?php
/**
 * CARGADOR AUTOMÁTICO DE PREGUNTAS DE QUÍMICA - POLITÉCNICO 2025
 * Versión: 1.0 (Química)
 * Objetivo: Insertar 30 preguntas oficiales con justificaciones detalladas.
 */

header('Content-Type: text/html; charset=utf-8');
include 'config.php';

echo "<h1>🚀 Cargador Automático Química Politécnico 2025 (v1.0)</h1>";

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

    // Obtener ID de Química
    $mid_stmt = $pdo->query("SELECT id FROM materias_politecnico WHERE nombre = 'Química'");
    $mid = $mid_stmt->fetchColumn();
    if (!$mid) {
        $pdo->exec("INSERT INTO materias_politecnico (nombre) VALUES ('Química')");
        $mid = $pdo->lastInsertId();
    }

    // Limpiar datos previos de Química 2025
    $pdo->prepare("DELETE FROM preguntas_politecnico WHERE guia_year = 2025 AND materia_id = ?")->execute([$mid]);
    echo "ℹ️ Registros antiguos de Química 2025 limpiados.<br>";

    // DATA OFICIAL (Reactivos 91-120)
    $preguntas = [
        [
            'n' => 91,
            'p' => 'Elige los productos que se fabrican con látex. 1. Goma 2. Chicle 3. Sonda 4. Guante 5. Máscara 6. Peluca 7. Impermeabilizante',
            'a' => '1, 3, 4, 5',
            'b' => '2, 4, 6, 7',
            'c' => '2, 3, 4, 6',
            'd' => '3, 4, 5, 7',
            'r' => 'D',
            'e' => 'Los productos fabricados con látex (hule natural) son principalmente condones, pelotas, guantes, sondas tipo penrose, máscaras e impermeabilizantes.',
            't' => 'Materiales y Manufactura'
        ],
        [
            'n' => 92,
            'p' => 'Selecciona los elementos que corresponden a los metales llamados alcalinotérreos. 1. Ag 2. Cs 3. Ra 4. Mg 5. Au 6. Sr 7. Be',
            'a' => '1, 3, 4, 6',
            'b' => '2, 4, 5, 6',
            'c' => '3, 4, 6, 7',
            'd' => '4, 5, 6, 7',
            'r' => 'C',
            'e' => 'Los metales alcalinotérreos (Grupo 2) son: Berilio (Be), Magnesio (Mg), Calcio (Ca), Estroncio (Sr), Bario (Ba) y Radio (Ra).',
            't' => 'Tabla Periódica'
        ],
        [
            'n' => 93,
            'p' => 'Relaciona el cambio químico de acuerdo a su descripción. 1. Luz, 2. Precipitación, 3. Oxidación, 4. Efervescencia. a) burbujeo CO2, b) bioenergía luz, c) sólido reacción acuosa, d) metal humedad/oxígeno.',
            'a' => '1a, 2b, 3c, 4d',
            'b' => '1c, 2d, 3a, 4b',
            'c' => '1b, 2c, 3d, 4a',
            'd' => '1d, 2b, 3c, 4a',
            'r' => 'C',
            'e' => 'Emisión de luz: Bioquímica. Precipitación: Sólido en disolución. Oxidación: Metal intemperie. Efervescencia: Burbujeo CO2.',
            't' => 'Cambios Químicos'
        ],
        [
            'n' => 94,
            'p' => 'La ______ es uno de los compuestos químicos fundamentales de todas las plantas junto con la ____ en el proceso de la fotosíntesis.',
            'a' => 'célula - procariota',
            'b' => 'clorofila - luz solar',
            'c' => 'fermentación - luz de día',
            'd' => 'luminosidad - luz blanca',
            'r' => 'B',
            'e' => 'La clorofila absorbe fotones de luz solar para excitar electrones en la fotosíntesis.',
            't' => 'Fotosíntesis'
        ],
        [
            'n' => 95,
            'p' => 'Ordena subsecuentemente un procedimiento de potabilización del agua. 1. Pulidor 2. Clorimador 3. Sedimentador 4. Filtro',
            'a' => '1, 2, 3, 4',
            'b' => '2, 3, 4, 1',
            'c' => '3, 4, 2, 1',
            'd' => '4, 3, 1, 2',
            'r' => 'C',
            'e' => 'Orden: Sedimentador (gravedad), Filtros (partículas medias), Clorinador (desinfección) y Pulidor (claridad final).',
            't' => 'Tratamiento de Agua'
        ],
        [
            'n' => 96,
            'p' => 'Es la unidad química que mide la cantidad de sustancia...',
            'a' => 'Ion',
            'b' => 'Mol',
            'c' => 'Molécula',
            'd' => 'Partícula',
            'r' => 'B',
            'e' => 'El mol es la unidad que mide la cantidad de materia. Un mol equivale a 6.023 x 10^23 entidades (Número de Avogadro).',
            't' => 'Estequiometría'
        ],
        [
            'n' => 97,
            'p' => 'Son elementos que pertenecen al grupo IIIA:',
            'a' => 'Na, Mg, Al, Si',
            'b' => 'B, Al, Ga, In',
            'c' => 'B, Al, Ga, Ge',
            'd' => 'Ga, In, Pb, Al',
            'r' => 'B',
            'e' => 'La familia del boro (Grupo III A) incluye B, Al, Ga, In y Tl.',
            't' => 'Tabla Periódica'
        ],
        [
            'n' => 98,
            'p' => 'Es el tipo de solución en la que el soluto excede el límite que el solvente puede admitir.',
            'a' => 'Insaturada',
            'b' => 'Sobresaturada',
            'c' => 'Saturada',
            'd' => 'Concentrada',
            'r' => 'B',
            'e' => 'Sobresaturada: disuelve más soluto que el límite teórico de saturación a esa temperatura.',
            't' => 'Disoluciones'
        ],
        [
            'n' => 99,
            'p' => '¿Qué es un enlace químico?',
            'a' => 'Unión entre dos o más sustancias',
            'b' => 'Enlace entre molécula y molécula',
            'c' => 'Unión entre partícula y partícula',
            'd' => 'Fuerza que une dos o más átomos',
            'r' => 'D',
            'e' => 'Un enlace químico es la fuerza de atracción que mantiene unidos a los átomos para formar moléculas.',
            't' => 'Enlaces Químicos'
        ],
        [
            'n' => 100,
            'p' => '¿Cuál es la partícula mínima de la que está constituido un compuesto?',
            'a' => 'Ion',
            'b' => 'Átomo',
            'c' => 'Molécula',
            'd' => 'Micela',
            'r' => 'C',
            'e' => 'Los compuestos están formados por moléculas (unión química de dos o más átomos distintos).',
            't' => 'Materia'
        ],
        [
            'n' => 101,
            'p' => 'La actividad física practicada con regularidad reduce el riesgo de contraer enfermedades...',
            'a' => 'cardiovasculares, diabetes, hipertensión arterial',
            'b' => 'sarampión, varicela, covid',
            'c' => 'estomacales, dentales, oculares',
            'd' => 'torceduras, fracturas, esguinces',
            'r' => 'A',
            'e' => 'Reduce riesgos de enfermedades no transmisibles como diabetes, hipertensión y problemas cardiovasculares.',
            't' => 'Salud'
        ],
        [
            'n' => 102,
            'p' => 'Es la unión de dos sustancias que conservan sus propiedades físicas.',
            'a' => 'Compuesto',
            'b' => 'Elemento',
            'c' => 'Catión',
            'd' => 'Mezcla',
            'r' => 'D',
            'e' => 'En las mezclas las sustancias no reaccionan químicamente, conservando sus propiedades.',
            't' => 'Materia'
        ],
        [
            'n' => 103,
            'p' => 'Una solución que tiene un valor de 8 en la escala de pH se considera una sustancia...',
            'a' => 'ácida',
            'b' => 'alcalina',
            'c' => 'neutra',
            'd' => 'mezcla',
            'r' => 'B',
            'e' => 'Valores pH > 7 son alcalinos (básicos). Valores < 7 son ácidos.',
            't' => 'Ácidos y Bases'
        ],
        [
            'n' => 104,
            'p' => 'Ordena los métodos de separación: agua, aceite, anticongelante, grava y aserrín. 1. Filtración 2. Sedimentación 3. Decantación 4. Destilación',
            'a' => '1, 3, 4, 2',
            'b' => '1, 4, 2, 3',
            'c' => '2, 1, 3, 4',
            'd' => '3, 1, 2, 4',
            'r' => 'C',
            'e' => 'Sedimentación (grava), Filtración (aserrín), Decantación (aceite) y Destilación (agua/anticongelante).',
            't' => 'Métodos de Separación'
        ],
        [
            'n' => 105,
            'p' => 'A la unión física de dos o más sustancias se le llama ______. Cuando se pueden observar solo una fase es ______ y ______ si son dos o más fases.',
            'a' => 'compuesto - elemento - sustancia',
            'b' => 'sustancia - heterogénea - homogénea',
            'c' => 'compuesto - homogénea - heterogénea',
            'd' => 'mezcla - homogénea - heterogénea',
            'r' => 'D',
            'e' => 'Mezcla homogénea: una sola fase. Mezcla heterogénea: dos o más fases visibles.',
            't' => 'Mezclas'
        ],
        [
            'n' => 106,
            'p' => 'Relaciona: 1. Metaloide, 2. Metal, 3. No metal. Materiales: Na, Br, Si, As, Zn.',
            'a' => '1ac, 2ae, 3bf',
            'b' => '1be, 2ad, 3cf',
            'c' => '1de, 2af, 3bc',
            'd' => '1ef, 2bc, 3ad',
            'r' => 'A',
            'e' => 'Metales: Na, Zn. No metales: Br. Metaloides: Si, As.',
            't' => 'Tabla Periódica'
        ],
        [
            'n' => 107,
            'p' => 'Selecciona las sustancias que son mezclas: 1. Bórax 2. Gasolina 3. Glicerina 4. Aguarrás 5. Almidón 6. Perfume 7. Cenizas',
            'a' => '1, 3, 5, 6',
            'b' => '2, 4, 6, 7',
            'c' => '2, 3, 4, 6',
            'd' => '3, 5, 6, 7',
            'r' => 'B',
            'e' => 'Gasolina (hidrocarburos), Aguarrás (resinas/solventes), Perfume (alcoholes/aceites) y Cenizas son mezclas.',
            't' => 'Mezclas y Compuestos'
        ],
        [
            'n' => 108,
            'p' => 'Selecciona las características principales de los desechos peligrosos (CRETIB): 1. Reactivo 2. Corrosivo 3. Emisivo 4. Inflamable 5. Comburente 6. Explosivo 7. Humidificante',
            'a' => '1, 2, 4, 6',
            'b' => '1, 2, 3, 4',
            'c' => '2, 3, 4, 5',
            'd' => '3, 4, 5, 7',
            'r' => 'A',
            'e' => 'CRETIB: Corrosivo, Reactivo, Explosivo, Tóxico, Inflamable y Biológico-infeccioso.',
            't' => 'Desechos Peligrosos'
        ],
        [
            'n' => 109,
            'p' => 'Relaciona: 1. Alcaloide, 2. Carbohidrato, 3. Proteína. Sustancias: Queratina, Tiamina, Nicotina, Celulosa.',
            'a' => '1a, 2b, 3d',
            'b' => '1a, 2c, 3b',
            'c' => '1b, 2a, 3c',
            'd' => '1c, 2d, 3a',
            'r' => 'D',
            'e' => 'Alcaloide: Nicotina. Carbohidrato: Celulosa. Proteína: Queratina.',
            't' => 'Biomoléculas'
        ],
        [
            'n' => 110,
            'p' => 'El enlace tipo ______ ocurre cuando átomos no metálicos comparten electrones y entre ______ de diferentes electronegatividades.',
            'a' => 'iónico - átomos',
            'b' => 'covalente - elementos',
            'c' => 'metálico - no metales',
            'd' => 'covalente - metales',
            'r' => 'B',
            'e' => 'Enlace covalente: intercambio de electrones entre no metales.',
            't' => 'Enlaces Químicos'
        ],
        [
            'n' => 111,
            'p' => 'Ordene de menor a mayor por número de átomos: 1. Ca3(PO4)2 2. Fe(CN)3 3. Mg2SiO4 4. Al2(HCO3)3',
            'a' => '2, 3, 1, 4',
            'b' => '2, 4, 1, 3',
            'c' => '3, 1, 2, 4',
            'd' => '4, 1, 2, 3',
            'r' => 'A',
            'e' => 'Suma de subíndices: Fe(CN)3=7, Mg2SiO4=7, Ca3(PO4)2=13, Al2(HCO3)3=17.',
            't' => 'Moléculas'
        ],
        [
            'n' => 112,
            'p' => '¿Cuál de los siguientes ejemplos de reacciones químicas es falso?',
            'a' => 'Arcoíris',
            'b' => 'Amalgamas',
            'c' => 'Combustión',
            'd' => 'Lluvia ácida',
            'r' => 'A',
            'e' => 'El arcoíris es un fenómeno físico (refracción/difracción), no una reacción química.',
            't' => 'Reacciones Químicas'
        ],
        [
            'n' => 113,
            'p' => 'La imagen representa mezclas de tipo:',
            'a' => 'Sólida',
            'b' => 'Mixta',
            'c' => 'Heterogénea',
            'd' => 'Homogénea',
            'r' => 'C',
            'e' => 'Mezclas heterogéneas: sus componentes se distinguen a simple vista.',
            't' => 'Mezclas'
        ],
        [
            'n' => 114,
            'p' => 'Si se utilizan 36g de HCL para obtener 100g de disolución, ¿Cuál es la concentración % masa/masa?',
            'a' => '38%',
            'b' => '36%',
            'c' => '28%',
            'd' => '42%',
            'r' => 'B',
            'e' => '%m/m = (masa soluto / masa disolución) * 100 = (36/100)*100 = 36%.',
            't' => 'Concentración'
        ],
        [
            'n' => 115,
            'p' => '¿Cuál es la Secretaría responsable de programas de reducción de emisiones contaminantes?',
            'a' => 'SEMARNAT',
            'b' => 'SEGOB',
            'c' => 'BIENESTAR',
            'd' => 'SEP',
            'r' => 'A',
            'e' => 'SEMARNAT se encarga del medio ambiente y recursos naturales en México.',
            't' => 'Medio Ambiente'
        ],
        [
            'n' => 116,
            'p' => 'Relaciona: 1. Covalente polar, 2. Iónico, 3. Covalente no polar. Características: a) no metales iguales, b) conductor eléctrico, c) metal y no metal, f) conductor débil.',
            'a' => '1ad, 2ce, 3bf',
            'b' => '1be, 2ad, 3cf',
            'c' => '1de, 2af, 3bc',
            'd' => '1ef, 2bc, 3ad',
            'r' => 'D',
            'e' => 'Iónico (metal+no metal, conductor); Covalente Polar (no metales distintos, débil); No Polar (iguales, aislante).',
            't' => 'Enlaces Químicos'
        ],
        [
            'n' => 117,
            'p' => 'Ordena descendente por concentración: Etanol 70%, Oxido Calcio 63%, Peróxido 35%, Titanio 30%, Suavizante 5%, Carbono 0.6%, Hipoclorito 0.3%.',
            'a' => '1, 2, 3, 4, 5, 6, 7',
            'b' => '3, 4, 5, 1, 2, 7, 6',
            'c' => '2, 4, 1, 6, 5, 7, 3',
            'd' => '3, 4, 7, 1, 5, 6, 2',
            'r' => 'C',
            'e' => 'Orden: 70%, 63%, 35%, 30%, 5%, 0.6%, 0.3%.',
            't' => 'Concentración'
        ],
        [
            'n' => 118,
            'p' => '¿Qué es la contaminación ambiental?',
            'a' => 'Degradación del medio ambiente por desechos humanos',
            'b' => 'Cálculo de límites de desviación',
            'c' => 'Transferencia de calor',
            'd' => 'Desfogue de presión',
            'r' => 'A',
            'e' => 'Es el deterioro del equilibrio terrestre por emisiones y desechos humanos.',
            't' => 'Medio Ambiente'
        ],
        [
            'n' => 119,
            'p' => 'Selecciona gases de efecto invernadero: 1. O2 2. CO2 3. H2 4. CH4 5. O3 6. NO2',
            'a' => '1, 2, 4, 5',
            'b' => '2, 4, 5, 6',
            'c' => '2, 3, 5, 6',
            'd' => '3, 4, 5, 6',
            'r' => 'B',
            'e' => 'Gases invernadero principales: CO2, CH4, O3 y NOx.',
            't' => 'Efecto Invernadero'
        ],
        [
            'n' => 120,
            'p' => 'El Ing. Mario Molina ganó un premio Nobel por su trabajo en:',
            'a' => 'Componentes gaseosos',
            'b' => 'Química dinámica',
            'c' => 'Capa de ozono y CFC',
            'd' => 'Colorantes orgánicos',
            'r' => 'C',
            'e' => 'Mario Molina alertó sobre el efecto de los clorofluorocarbonos (CFC) en la capa de ozono.',
            't' => 'Científicos Mexicanos'
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

    echo "✅ ¡Inserción completada! 30 preguntas de Química añadidas con éxito.<br>";

} catch (Exception $e) {
    echo "<h3 style='color:red'>❌ Error: " . $e->getMessage() . "</h3>";
}

echo "<br><div style='padding:20px; background:#fff3e0; border-radius:10px;'>";
echo "🧪 <strong>¡Proceso Terminado!</strong><br>";
echo "Las preguntas oficiales de Química están listas.<br><br>";
echo "<a href='verificar_preguntas_oficiales.php?materia=Química' 
      style='display:inline-block; padding:12px 20px; background:#ef6c00; color:white; text-decoration:none; border-radius:5px; font-weight:bold;'>
      🛡️ Verificar Preguntas de Química
      </a>";
echo "</div>";
?>