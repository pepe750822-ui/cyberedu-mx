<?php
/**
 * CARGADOR AUTOMÁTICO DE PREGUNTAS DE FÍSICA - POLITÉCNICO 2025
 * Versión: 2.0 (Física)
 * Objetivo: Reparar esquema de base de datos e insertar 30 preguntas oficiales.
 */

header('Content-Type: text/html; charset=utf-8');
include 'config.php';

echo "<h1>🚀 Cargador Automático Física Politécnico 2025 (v2.0)</h1>";

// --- PASO 1: VERIFICACIÓN Y REPARACIÓN DEL ESQUEMA ---
echo "<h2>🔍 Paso 1: Verificación de Base de Datos y Codificación</h2>";

try {
    // 1.1 Verificar/Agregar columnas necesarias
    $columnas_necesarias = [
        'guia_year' => "INT DEFAULT 2025",
        'numero_pregunta' => "INT DEFAULT 0",
        'nivel_dificultad' => "VARCHAR(20) DEFAULT 'Media'",
        'activa' => "TINYINT(1) DEFAULT 1",
        'tema' => "VARCHAR(100) DEFAULT ''"
    ];

    foreach ($columnas_necesarias as $col => $def) {
        $check = $pdo->query("SHOW COLUMNS FROM preguntas_politecnico LIKE '$col'")->fetch();
        if (!$check) {
            $pdo->exec("ALTER TABLE preguntas_politecnico ADD COLUMN $col $def");
            echo "✅ Columna '$col' añadida.<br>";
        }
    }

    // 1.2 Detectar nombre real de la columna de explicación (por acentos)
    $stmt = $pdo->query("SHOW COLUMNS FROM preguntas_politecnico");
    $columnas = $stmt->fetchAll(PDO::FETCH_COLUMN);
    $col_explicacion = 'explicacion'; // default
    foreach ($columnas as $c) {
        if (strpos($c, 'explicaci') !== false) {
            $col_explicacion = $c;
            break;
        }
    }
    echo "ℹ️ Columna de explicación detectada como: <strong>$col_explicacion</strong><br>";

} catch (Exception $e) {
    die("<h3 style='color:red'>❌ Error en la verificación de esquema: " . $e->getMessage() . "</h3>");
}

// --- PASO 2: LIMPIEZA E INSERCIÓN DE DATOS ---
echo "<h2>📥 Paso 2: Limpieza e Inserción Masiva (30 Preguntas)</h2>";

try {
    // Obtener ID de la materia Física
    $mid_stmt = $pdo->query("SELECT id FROM materias_politecnico WHERE nombre = 'Física'");
    $mid = $mid_stmt->fetchColumn();
    if (!$mid) {
        // Si no existe, la creamos
        $pdo->exec("INSERT INTO materias_politecnico (nombre) VALUES ('Física')");
        $mid = $pdo->lastInsertId();
    }

    // Limpiar datos previos de Física 2025 para evitar duplicados
    $pdo->prepare("DELETE FROM preguntas_politecnico WHERE guia_year = 2025 AND materia_id = ?")->execute([$mid]);
    echo "ℹ️ Registros antiguos de Física 2025 limpiados.<br>";

    // DATA OFICIAL
    $preguntas = [
        [
            'guia_year' => 2025,
            'numero_pregunta' => 31,
            'materia_id' => $mid,
            'pregunta_texto' => '¿Cuál es el principio en el que se basa el funcionamiento del gato hidráulico?',
            'opcion_a' => 'Bernoulli',
            'opcion_b' => 'Torricelli',
            'opcion_c' => 'Arquímedes',
            'opcion_d' => 'Pascal',
            'respuesta_correcta' => 'D',
            'explicacion' => 'Una aplicación del Principio de Pascal es la prensa hidráulica y su funcionamiento se basa en multiplicar la fuerza aplicada. Dicho principio dice que: "Al modificar la presión en una parte del fluido, el cambio se transmite a todo el fluido con igual intensidad en todos los puntos".',
            'tema' => 'Hidrostática'
        ],
        [
            'guia_year' => 2025,
            'numero_pregunta' => 32,
            'materia_id' => $mid,
            'pregunta_texto' => 'El proceso por el que se transfiere la energía térmica mediante colisiones de moléculas adyacentes a lo largo de un medio material. Siempre de la más alta a la más baja temperatura, es...',
            'opcion_a' => 'convección',
            'opcion_b' => 'conducción',
            'opcion_c' => 'radiación',
            'opcion_d' => 'reflexión',
            'respuesta_correcta' => 'B',
            'explicacion' => 'Cuando dos partes de un material se mantienen a temperaturas diferentes, la energía se transfiere por colisiones moleculares de la más alta a la más baja temperatura. Este proceso de conducción es favorecido también por el movimiento de los electrones libres en el interior de la sustancia.',
            'tema' => 'Termodinámica'
        ],
        [
            'guia_year' => 2025,
            'numero_pregunta' => 33,
            'materia_id' => $mid,
            'pregunta_texto' => 'El resultado de convertir 12 m/s a km/h es...',
            'opcion_a' => '3.33 km/h',
            'opcion_b' => '43.2 km/h',
            'opcion_c' => '48.2 km/h',
            'opcion_d' => '50.0 km/h',
            'respuesta_correcta' => 'B',
            'explicacion' => '12 m/s * (3600 s / 1 h) * (1 km / 1000 m) = 43.2 km/h',
            'tema' => 'Conversión de Unidades'
        ],
        [
            'guia_year' => 2025,
            'numero_pregunta' => 34,
            'materia_id' => $mid,
            'pregunta_texto' => 'Un ciclista se mueve con una rapidez constante de 80 km/h y recorre 360 km en un tiempo de...',
            'opcion_a' => '0.2 h',
            'opcion_b' => '0.5 h',
            'opcion_c' => '4.5 h',
            'opcion_d' => '6.5 h',
            'respuesta_correcta' => 'C',
            'explicacion' => 't = d/V = 360km / 80km/h = 4.5 h',
            'tema' => 'MRU'
        ],
        [
            'guia_year' => 2025,
            'numero_pregunta' => 35,
            'materia_id' => $mid,
            'pregunta_texto' => 'Ordena el proceso de cuatro tiempos de compresión del ciclo Otto. 1. Carrera de expansión. 2. Carrera de admisión. 3. Carrera de compresión. 4. Carrera de expulsión.',
            'opcion_a' => '1, 3, 2, 4',
            'opcion_b' => '1, 2, 3, 4',
            'opcion_c' => '2, 3, 1, 4',
            'opcion_d' => '2, 1, 3, 4',
            'respuesta_correcta' => 'C',
            'explicacion' => 'El orden es: Admisión, Compresión, Expansión, Expulsión.',
            'tema' => 'Máquinas Térmicas'
        ],
        [
            'guia_year' => 2025,
            'numero_pregunta' => 36,
            'materia_id' => $mid,
            'pregunta_texto' => 'En el movimiento rectilíneo uniforme, la velocidad es ______ y ______ la aceleración.',
            'opcion_a' => 'constante - cero',
            'opcion_b' => 'cero - constante',
            'opcion_c' => 'constante - constante',
            'opcion_d' => 'cero - cero',
            'respuesta_correcta' => 'A',
            'explicacion' => 'En el MRU la velocidad no cambia (constante), por lo tanto la aceleración es nula (cero).',
            'tema' => 'MRU'
        ],
        [
            'guia_year' => 2025,
            'numero_pregunta' => 37,
            'materia_id' => $mid,
            'pregunta_texto' => 'Relaciona las formas de propagación del calor con ejemplos de la vida cotidiana. Forma de propagación: 1. Conducción, 2. Convección, 3. Radiación. Ejemplo: a) Calentar la cuchara de la comida, b) Soplar para enfriar el café, c) Calentar la comida en el horno de microondas, d) Frotar el cabello con el peine.',
            'opcion_a' => '1a, 2b, 3c',
            'opcion_b' => '1a, 2c, 3d',
            'opcion_c' => '1b, 2c, 3d',
            'opcion_d' => '1a, 2b, 3d',
            'respuesta_correcta' => 'A',
            'explicacion' => 'Conducción: cuchara (contacto). Convección: soplar (aire). Radiación: microondas (ondas).',
            'tema' => 'Termodinámica'
        ],
        [
            'guia_year' => 2025,
            'numero_pregunta' => 38,
            'materia_id' => $mid,
            'pregunta_texto' => 'Selecciona los elementos que componen a un vector. 1. Flecha, 2. Origen, 3. Magnitud, 4. Sentido, 5. Dirección.',
            'opcion_a' => '1, 2, 3',
            'opcion_b' => '1, 4, 5',
            'opcion_c' => '2, 3, 5',
            'opcion_d' => '3, 4, 5',
            'respuesta_correcta' => 'D',
            'explicacion' => 'Un vector se define por magnitud, dirección y sentido.',
            'tema' => 'Vectores'
        ],
        [
            'guia_year' => 2025,
            'numero_pregunta' => 39,
            'materia_id' => $mid,
            'pregunta_texto' => 'Selecciona las características que tiene una onda mecánica. 1. Masa, 2. Longitud, 3. Inercia, 4. Frecuencia, 5. Amplitud.',
            'opcion_a' => '1, 3, 4',
            'opcion_b' => '1, 2, 3',
            'opcion_c' => '2, 3, 4',
            'opcion_d' => '2, 4, 5',
            'respuesta_correcta' => 'D',
            'explicacion' => 'Las ondas mecánicas tienen amplitud, longitud y frecuencia.',
            'tema' => 'Ondas'
        ],
        [
            'guia_year' => 2025,
            'numero_pregunta' => 40,
            'materia_id' => $mid,
            'pregunta_texto' => 'En 8 segundos un automóvil cambia de 10m/s a 50m/s ¿Cuál es su aceleración?',
            'opcion_a' => '2 m/s²',
            'opcion_b' => '4 m/s²',
            'opcion_c' => '5 m/s²',
            'opcion_d' => '8 m/s²',
            'respuesta_correcta' => 'C',
            'explicacion' => 'a = (v2 - v1) / t = (50 - 10) / 8 = 40 / 8 = 5 m/s²',
            'tema' => 'MRUA'
        ],
        [
            'guia_year' => 2025,
            'numero_pregunta' => 41,
            'materia_id' => $mid,
            'pregunta_texto' => 'Es el lugar en donde un tinaco debe colocarse para tener mayor energía potencial.',
            'opcion_a' => 'Debajo del suelo',
            'opcion_b' => 'A nivel del suelo',
            'opcion_c' => 'Sobre la azotea',
            'opcion_d' => 'Por arriba de la azotea',
            'respuesta_correcta' => 'D',
            'explicacion' => 'Ep = mgh. A mayor altura h, mayor energía potencial.',
            'tema' => 'Energía'
        ],
        [
            'guia_year' => 2025,
            'numero_pregunta' => 42,
            'materia_id' => $mid,
            'pregunta_texto' => 'El científico que propone el modelo atómico llamado "budín de pasas" es:',
            'opcion_a' => 'Rutherford',
            'opcion_b' => 'Bohr',
            'opcion_c' => 'Thomson',
            'opcion_d' => 'Dalton',
            'respuesta_correcta' => 'C',
            'explicacion' => 'J.J. Thomson propuso el modelo de budín de pasas con electrones en una esfera positiva.',
            'tema' => 'Estructura Atómica'
        ],
        [
            'guia_year' => 2025,
            'numero_pregunta' => 43,
            'materia_id' => $mid,
            'pregunta_texto' => 'La potencia es la rapidez de realizar un...',
            'opcion_a' => 'esfuerzo',
            'opcion_b' => 'torque',
            'opcion_c' => 'trabajo',
            'opcion_d' => 'empuje',
            'respuesta_correcta' => 'C',
            'explicacion' => 'Potencia = Trabajo / Tiempo.',
            'tema' => 'Potencia'
        ],
        [
            'guia_year' => 2025,
            'numero_pregunta' => 44,
            'materia_id' => $mid,
            'pregunta_texto' => 'Ordena los prefijos en forma descendente. 1. Hecto, 2. Kilo, 3. Deca, 4. Mega, 5. Tera, 6. Giga.',
            'opcion_a' => '1, 2, 3, 4, 5, 6',
            'opcion_b' => '2, 3, 5, 1, 4, 6',
            'opcion_c' => '4, 6, 3, 1, 2, 5',
            'opcion_d' => '5, 6, 4, 2, 1, 3',
            'respuesta_correcta' => 'D',
            'explicacion' => 'Tera(12), Giga(9), Mega(6), Kilo(3), Hecto(2), Deca(1).',
            'tema' => 'Prefijos'
        ],
        [
            'guia_year' => 2025,
            'numero_pregunta' => 45,
            'materia_id' => $mid,
            'pregunta_texto' => 'La tensión superficial se debe a la ______ que hay entre las moléculas en ______ de un líquido.',
            'opcion_a' => 'atracción - la superficie',
            'opcion_b' => 'atracción - el fondo',
            'opcion_c' => 'repulsión - la superficie',
            'opcion_d' => 'repulsión - el fondo',
            'respuesta_correcta' => 'A',
            'explicacion' => 'Las fuerzas cohesivas atraen las moléculas de la superficie hacia el interior.',
            'tema' => 'Propiedades de los Líquidos'
        ],
        [
            'guia_year' => 2025,
            'numero_pregunta' => 46,
            'materia_id' => $mid,
            'pregunta_texto' => 'Relaciona el concepto con su modelo matemático. Concepto: 5. Rapidez, 6. Distancia, 7. Tiempo. Modelo matemático: a) d/v, b) v · t, c) (v1 + v2)/2, d) d/t.',
            'opcion_a' => '1d, 2b, 3a',
            'opcion_b' => '1a, 2b, 3c',
            'opcion_c' => '1b, 2c, 3d',
            'opcion_d' => '1c, 2b, 3d',
            'respuesta_correcta' => 'A',
            'explicacion' => 'v=d/t, d=vt, t=d/v.',
            'tema' => 'MRU'
        ],
        [
            'guia_year' => 2025,
            'numero_pregunta' => 47,
            'materia_id' => $mid,
            'pregunta_texto' => 'Selecciona los elementos que son conductores de la electricidad. 1. Oro, 2. Aluminio, 3. Plata, 4. Porcelana, 5. Vidrio, 6. Cobre.',
            'opcion_a' => '1, 2, 3, 6',
            'opcion_b' => '1, 2, 3, 4',
            'opcion_c' => '3, 4, 5, 6',
            'opcion_d' => '2, 4, 5, 6',
            'respuesta_correcta' => 'A',
            'explicacion' => 'Los metales son buenos conductores de electricidad.',
            'tema' => 'Electricidad'
        ],
        [
            'guia_year' => 2025,
            'numero_pregunta' => 48,
            'materia_id' => $mid,
            'pregunta_texto' => '¿Qué sistema de fuerzas se está aplicando en la figura que se muestra?',
            'opcion_a' => 'Libres',
            'opcion_b' => 'Concurrentes',
            'opcion_c' => 'Coplanares',
            'opcion_d' => 'Paralelas',
            'respuesta_correcta' => 'B',
            'explicacion' => 'Las fuerzas concurren en un mismo punto.',
            'tema' => 'Estática'
        ],
        [
            'guia_year' => 2025,
            'numero_pregunta' => 49,
            'materia_id' => $mid,
            'pregunta_texto' => 'Los contaminantes atmosféricos de origen primarios son:',
            'opcion_a' => 'Formados por fenómenos del subsuelo',
            'opcion_b' => 'Emitidos directamente a la atmósfera',
            'opcion_c' => 'Generados por las actividades humanas',
            'opcion_d' => 'Formados en la atmósfera por reacciones químicas',
            'respuesta_correcta' => 'B',
            'explicacion' => 'Primarios: emitidos directamente. Secundarios: formados en la atmósfera.',
            'tema' => 'Medio Ambiente'
        ],
        [
            'guia_year' => 2025,
            'numero_pregunta' => 50,
            'materia_id' => $mid,
            'pregunta_texto' => 'Es una fuente de energía renovable, que se deriva de materia orgánica en estado de descomposición.',
            'opcion_a' => 'Biomasa',
            'opcion_b' => 'Solar',
            'opcion_c' => 'Eólica',
            'opcion_d' => 'Geotérmica',
            'respuesta_correcta' => 'A',
            'explicacion' => 'La biomasa proviene de materia orgánica.',
            'tema' => 'Energía'
        ],
        [
            'guia_year' => 2025,
            'numero_pregunta' => 51,
            'materia_id' => $mid,
            'pregunta_texto' => 'En la ley de Coulomb el valor de la constante es...',
            'opcion_a' => '9.0 × 10⁹ N·m²/C²',
            'opcion_b' => '3.0 × 10⁹ N·m²/C²',
            'opcion_c' => '1.0 × 10⁹ N·m²/C²',
            'opcion_d' => '6.6 × 10⁻¹¹ N·m²/C²',
            'respuesta_correcta' => 'A',
            'explicacion' => 'La constante k en el vacío es aprox. 9x10⁹.',
            'tema' => 'Ley de Coulomb'
        ],
        [
            'guia_year' => 2025,
            'numero_pregunta' => 52,
            'materia_id' => $mid,
            'pregunta_texto' => 'Ordena de mayor a menor la presión hidrostática en el punto indicado.',
            'opcion_a' => '1, 3, 2, 4',
            'opcion_b' => '2, 4, 1, 3',
            'opcion_c' => '3, 4, 1, 2',
            'opcion_d' => '4, 2, 3, 1',
            'respuesta_correcta' => 'D',
            'explicacion' => 'P = dgh. A mayor profundidad h, mayor presión.',
            'tema' => 'Hidrostática'
        ],
        [
            'guia_year' => 2025,
            'numero_pregunta' => 53,
            'materia_id' => $mid,
            'pregunta_texto' => 'La sublimación es el cambio que ocurre cuando una sustancia gana calor aumentando su temperatura y pasa directamente del estado ______ al estado ______, sin pasar por el estado líquido.',
            'opcion_a' => 'sólido-gaseoso',
            'opcion_b' => 'gaseoso-solido',
            'opcion_c' => 'sólido-plasma',
            'opcion_d' => 'plasma-solido',
            'respuesta_correcta' => 'A',
            'explicacion' => 'Sólido a gas directo se llama sublimación.',
            'tema' => 'Estados de la Materia'
        ],
        [
            'guia_year' => 2025,
            'numero_pregunta' => 54,
            'materia_id' => $mid,
            'pregunta_texto' => 'Relaciona las leyes de Newton, con su definición. Ley: 1. Primera, 2. Segunda, 3. Tercera, 4. Gravitación Universal. Definición: a) Todo cuerpo permanece en estado de reposo, b) Todo cuerpo sumergido experimenta empuje, c) Aceleración proporcional a fuerza, d) Fuerza proporcional a producto de masas, e) Acción y reacción.',
            'opcion_a' => '1a, 2b, 3c, 4d',
            'opcion_b' => '1a, 2c, 3e, 4d',
            'opcion_c' => '1b, 2c, 3d, 4e',
            'opcion_d' => '1c, 2e, 3d, 4a',
            'respuesta_correcta' => 'B',
            'explicacion' => '1: Inercia, 2: F=ma, 3: Acción/Reacción, 4: Gravitación.',
            'tema' => 'Leyes de Newton'
        ],
        [
            'guia_year' => 2025,
            'numero_pregunta' => 55,
            'materia_id' => $mid,
            'pregunta_texto' => 'Selecciona los colores de la refracción de la luz blanca. 1. Cafe, 2. Rojo, 3. Amarillo, 4. Gris, 5. Naranja.',
            'opcion_a' => '1, 3, 4',
            'opcion_b' => '1, 2, 5',
            'opcion_c' => '2, 3, 5',
            'opcion_d' => '3, 4, 5',
            'respuesta_correcta' => 'C',
            'explicacion' => 'Espectro visible: Rojo, Naranja, Amarillo, Verde, Azul, Añil, Violeta.',
            'tema' => 'Óptica'
        ],
        [
            'guia_year' => 2025,
            'numero_pregunta' => 56,
            'materia_id' => $mid,
            'pregunta_texto' => 'Relaciona la rapidez de km/h con su equivalencia en m/s. km/h: 1. 40, 2. 55, 3. 70, 4. 95.',
            'opcion_a' => '1a, 2d, 3b, 4c',
            'opcion_b' => '1b, 2e, 3a, 4c',
            'opcion_c' => '1c, 2a, 3b, 4e',
            'opcion_d' => '1e, 2d, 3b, 4a',
            'respuesta_correcta' => 'D',
            'explicacion' => 'Dividir entre 3.6 para pasar de km/h a m/s.',
            'tema' => 'Conversión de Unidades'
        ],
        [
            'guia_year' => 2025,
            'numero_pregunta' => 57,
            'materia_id' => $mid,
            'pregunta_texto' => 'Ordena las siguientes imágenes de menor a mayor presión.',
            'opcion_a' => '1, 6, 5, 4, 3, 2',
            'opcion_b' => '1, 3, 4, 5, 2, 6',
            'opcion_c' => '2, 1, 4, 3, 6, 5',
            'opcion_d' => '6, 4, 3, 2, 1, 5',
            'respuesta_correcta' => 'D',
            'explicacion' => 'P = F/A. A mayor área, menor presión.',
            'tema' => 'Presión'
        ],
        [
            'guia_year' => 2025,
            'numero_pregunta' => 58,
            'materia_id' => $mid,
            'pregunta_texto' => 'En los segmentos de recta __ y __, el movimiento es acelerado.',
            'opcion_a' => 'a - b',
            'opcion_b' => 'a - c',
            'opcion_c' => 'b - c',
            'opcion_d' => 'b - e',
            'respuesta_correcta' => 'B',
            'explicacion' => 'Segmentos con pendiente != 0 indican aceleración en la gráfica v-t.',
            'tema' => 'Cinemática'
        ],
        [
            'guia_year' => 2025,
            'numero_pregunta' => 59,
            'materia_id' => $mid,
            'pregunta_texto' => '¿Cuál es la distancia recorrida en metros, por el móvil, en el segmento b?',
            'opcion_a' => '16',
            'opcion_b' => '32',
            'opcion_c' => '48',
            'opcion_d' => '96',
            'respuesta_correcta' => 'D',
            'explicacion' => 'd = v * t = 16 m/s * 6 s = 96 m.',
            'tema' => 'Cinemática'
        ],
        [
            'guia_year' => 2025,
            'numero_pregunta' => 60,
            'materia_id' => $mid,
            'pregunta_texto' => 'Selecciona los segmentos de la gráfica que presentan aceleración.',
            'opcion_a' => 'a, b, c',
            'opcion_b' => 'a, c, d',
            'opcion_c' => 'b, a, d',
            'opcion_d' => 'b, c, e',
            'respuesta_correcta' => 'B',
            'explicacion' => 'Aceleración existe donde hay cambio de velocidad.',
            'tema' => 'Cinemática'
        ]
    ];

    $sql = "INSERT INTO preguntas_politecnico 
            (guia_year, numero_pregunta, materia_id, pregunta_texto, opcion_a, opcion_b, opcion_c, opcion_d, respuesta_correcta, $col_explicacion, tema) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    $stmt = $pdo->prepare($sql);

    foreach ($preguntas as $p) {
        $stmt->execute([
            $p['guia_year'],
            $p['numero_pregunta'],
            $p['materia_id'],
            $p['pregunta_texto'],
            $p['opcion_a'],
            $p['opcion_b'],
            $p['opcion_c'],
            $p['opcion_d'],
            $p['respuesta_correcta'],
            $p['explicacion'],
            $p['tema']
        ]);
    }

    echo "✅ ¡Inserción completada! 30 preguntas de Física añadidas con éxito.<br>";

} catch (Exception $e) {
    echo "<h3 style='color:red'>❌ Error en la inserción: " . $e->getMessage() . "</h3>";
}

echo "<br><div style='padding:20px; background:#e3f2fd; border-radius:10px;'>";
echo "🎉 <strong>¡Proceso Terminado!</strong><br>";
echo "Las preguntas oficiales de Física están ahora en tu base de datos.<br><br>";
echo "<a href='verificar_preguntas_oficiales.php?materia=Física' 
      style='display:inline-block; padding:12px 20px; background:#1a237e; color:white; text-decoration:none; border-radius:5px; font-weight:bold;'>
      🛡️ Verificar Preguntas de Física
      </a>";
echo "</div>";
?>