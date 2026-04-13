<?php
/**
 * CARGADOR AUTOMÁTICO DE PREGUNTAS DE FORMACIÓN CÍVICA Y ÉTICA - POLITÉCNICO 2025
 * Versión: 1.0 (Civismo)
 * Objetivo: Insertar 30 preguntas oficiales con justificaciones detalladas.
 */

header('Content-Type: text/html; charset=utf-8');
include 'config.php';

echo "<h1>🚀 Cargador Automático Formación Cívica y Ética Politécnico 2025 (v1.0)</h1>";

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

    // Obtener ID de Formación Cívica y Ética
    $materia_nombre = 'Formación Cívica y Ética';
    $mid_stmt = $pdo->prepare("SELECT id FROM materias_politecnico WHERE nombre = ?");
    $mid_stmt->execute([$materia_nombre]);
    $mid = $mid_stmt->fetchColumn();
    if (!$mid) {
        $pdo->prepare("INSERT INTO materias_politecnico (nombre) VALUES (?)")->execute([$materia_nombre]);
        $mid = $pdo->lastInsertId();
    }

    // Limpiar datos previos de Formación Cívica y Ética 2025
    $pdo->prepare("DELETE FROM preguntas_politecnico WHERE guia_year = 2025 AND materia_id = ?")->execute([$mid]);
    echo "ℹ️ Registros antiguos de Formación Cívica y Ética 2025 limpiados.<br>";

    // DATA OFICIAL (Reactivos 211-240)
    $preguntas = [
        [
            'n' => 211,
            'p' => 'La formación cívica y ética es el proceso de formación de valores, principios y normas de convivencia, que permiten a los individuos actuar con responsabilidad en la sociedad.',
            'a' => 'Verdadero',
            'b' => 'Falso',
            'c' => 'Parcialmente verdadero',
            'd' => 'Parcialmente falso',
            'r' => 'A',
            'e' => 'La formación cívica y ética es el proceso de formación de valores, principios y normas de convivencia, que permiten a los individuos actuar con responsabilidad en la sociedad.',
            't' => 'Conceptos Básicos'
        ],
        [
            'n' => 212,
            'p' => 'Selecciona las características de los derechos humanos. 1. Universales 2. Irrenunciables 3. Limitados 4. Interdependientes 5. Progresivos 6. Absolutos',
            'a' => '1, 2, 4, 5',
            'b' => '1, 3, 5, 6',
            'c' => '2, 3, 4, 6',
            'd' => '1, 2, 4, 6',
            'r' => 'A',
            'e' => 'Los derechos humanos son universales, irrenunciables, interdependientes y progresivos; inherentes a todas las personas.',
            't' => 'Derechos Humanos'
        ],
        [
            'n' => 213,
            'p' => 'Relaciona los valores éticos con sus ejemplos. 1. Respeto 2. Responsabilidad 3. Honestidad 4. Justicia. Ejemplos: a) Verdad y transparencia, b) Obligaciones, c) Dignidad, d) Dar lo que corresponde.',
            'a' => '1c, 2b, 3a, 4d',
            'b' => '1a, 2c, 3d, 4b',
            'c' => '1d, 2a, 3b, 4c',
            'd' => '1b, 2d, 3c, 4a',
            'r' => 'A',
            'e' => 'Respeto (Dignidad), Responsabilidad (Obligaciones), Honestidad (Verdad), Justicia (Equidad).',
            't' => 'Valores'
        ],
        [
            'n' => 214,
            'p' => 'El bullying es una forma de violencia que se presenta en el ámbito escolar y puede ser físico, verbal o psicológico.',
            'a' => 'Verdadero',
            'b' => 'Falso',
            'c' => 'Parcialmente verdadero',
            'd' => 'Parcialmente falso',
            'r' => 'A',
            'e' => 'El bullying es violencia intencional y repetida en la escuela (física, verbal o psicológica).',
            't' => 'Violencia Escolar'
        ],
        [
            'n' => 215,
            'p' => 'Ordena las etapas del proceso de toma de decisiones éticas. 1. Identificar el problema 2. Evaluar alternativas 3. Tomar la decisión 4. Reflexionar sobre las consecuencias',
            'a' => '1, 2, 3, 4',
            'b' => '2, 1, 4, 3',
            'c' => '3, 2, 1, 4',
            'd' => '4, 3, 2, 1',
            'r' => 'A',
            'e' => 'Proceso: Identificación -> Evaluación -> Acción -> Reflexión.',
            't' => 'Toma de Decisiones'
        ],
        [
            'n' => 216,
            'p' => 'La democracia es un sistema de gobierno donde el poder reside en el pueblo, ejercido directamente o a través de representantes.',
            'a' => 'Verdadero',
            'b' => 'Falso',
            'c' => 'Parcialmente verdadero',
            'd' => 'Parcialmente falso',
            'r' => 'A',
            'e' => 'En la democracia la soberanía reside en el pueblo y se ejerce directa o representativamente.',
            't' => 'Democracia'
        ],
        [
            'n' => 217,
            'p' => 'Selecciona los principios de la ciudadanía responsable. 1. Participación activa 2. Respeto a la ley 3. Indiferencia social 4. Solidaridad 5. Egoísmo 6. Tolerancia',
            'a' => '1, 2, 4, 6',
            'b' => '1, 3, 5, 6',
            'c' => '2, 3, 4, 5',
            'd' => '3, 4, 5, 6',
            'r' => 'A',
            'e' => 'Ciudadanía responsable: Participa, respeta la ley, es solidaria y tolerante.',
            't' => 'Ciudadanía'
        ],
        [
            'n' => 218,
            'p' => 'El respeto a la diversidad cultural implica valorar y promover las diferencias culturales en la sociedad.',
            'a' => 'Verdadero',
            'b' => 'Falso',
            'c' => 'Parcialmente verdadero',
            'd' => 'Parcialmente falso',
            'r' => 'A',
            'e' => 'La diversidad cultural es un valor que debe protegerse y promoverse socialmente.',
            't' => 'Diversidad'
        ],
        [
            'n' => 219,
            'p' => 'Relaciona los tipos de violencia: 1. Física, 2. Psicológica, 3. Económica, 4. Sexual. Ejemplos: a) Control dinero, b) Insultos, c) Golpes, d) Abuso no consentido.',
            'a' => '1c, 2b, 3a, 4d',
            'b' => '1a, 2c, 3d, 4b',
            'c' => '1d, 2a, 3b, 4c',
            'd' => '1b, 2d, 3c, 4a',
            'r' => 'A',
            'e' => 'Violencia: Física (golpes), Psicológica (daño emocional), Económica (recursos), Sexual (integridad).',
            't' => 'Tipos de Violencia'
        ],
        [
            'n' => 220,
            'p' => 'La equidad de género busca igualar oportunidades entre hombres y mujeres en todos los ámbitos.',
            'a' => 'Verdadero',
            'b' => 'Falso',
            'c' => 'Parcialmente verdadero',
            'd' => 'Parcialmente falso',
            'r' => 'A',
            'e' => 'Equidad de género: Igualdad de oportunidades en educación, trabajo y vida social.',
            't' => 'Equidad de Género'
        ],
        [
            'n' => 221,
            'p' => 'Ordena los niveles de gobierno en México. 1. Municipal 2. Federal 3. Estatal',
            'a' => '1, 3, 2',
            'b' => '2, 3, 1',
            'c' => '3, 1, 2',
            'd' => '2, 1, 3',
            'r' => 'B',
            'e' => 'Niveles: Federal (país), Estatal (estado), Municipal (municipio).',
            't' => 'Gobierno'
        ],
        [
            'n' => 222,
            'p' => 'El civismo es el conjunto de valores y conductas que promueven la convivencia pacífica en sociedad.',
            'a' => 'Verdadero',
            'b' => 'Falso',
            'c' => 'Parcialmente verdadero',
            'd' => 'Parcialmente falso',
            'r' => 'A',
            'e' => 'Civismo: Valores, respeto y compromiso con la convivencia social pacífica.',
            't' => 'Civismo'
        ],
        [
            'n' => 223,
            'p' => 'Selecciona los derechos de los niños. 1. Educación 2. Salud 3. Trabajo infantil 4. Protección 5. Discriminación 6. Participación',
            'a' => '1, 2, 4, 6',
            'b' => '1, 3, 5, 6',
            'c' => '2, 3, 4, 5',
            'd' => '3, 4, 5, 6',
            'r' => 'A',
            'e' => 'Derechos infancia: Salud, Educación, Protección y participación política/social.',
            't' => 'Derechos Niñez'
        ],
        [
            'n' => 224,
            'p' => 'La ética profesional implica actuar con integridad y responsabilidad en el ámbito laboral.',
            'a' => 'Verdadero',
            'b' => 'Falso',
            'c' => 'Parcialmente verdadero',
            'd' => 'Parcialmente falso',
            'r' => 'A',
            'e' => 'Ética profesional: Integridad, honor y responsabilidad en el trabajo.',
            't' => 'Ética Profesional'
        ],
        [
            'n' => 225,
            'p' => 'Relaciona principios éticos: 1. Autonomía, 2. Beneficencia, 3. No maleficencia, 4. Justicia. Descripciones: a) Hacer bien, b) No daño, c) Libertad, d) Equidad.',
            'a' => '1c, 2a, 3b, 4d',
            'b' => '1a, 2c, 3d, 4b',
            'c' => '1d, 2a, 3b, 4c',
            'd' => '1b, 2d, 3c, 4a',
            'r' => 'A',
            'e' => 'Autonomía (Libertad), Beneficencia (Bien), No maleficencia (Evitar daño), Justicia (Reparto equitativo).',
            't' => 'Principios Éticos'
        ],
        [
            'n' => 226,
            'p' => 'La corrupción es el abuso de poder para obtener beneficios personales a costa del bien común.',
            'a' => 'Verdadero',
            'b' => 'Falso',
            'c' => 'Parcialmente verdadero',
            'd' => 'Parcialmente falso',
            'r' => 'A',
            'e' => 'La corrupción socava el bien común mediante el abuso ilegítimo de funciones.',
            't' => 'Corrupción'
        ],
        [
            'n' => 227,
            'p' => 'Ordena las etapas de resolución de conflictos. 1. Identificar el conflicto 2. Dialogar 3. Buscar soluciones 4. Acordar y evaluar',
            'a' => '1, 2, 3, 4',
            'b' => '2, 1, 4, 3',
            'c' => '3, 2, 1, 4',
            'd' => '4, 3, 2, 1',
            'r' => 'A',
            'e' => 'Conflicto: Identificación -> Diálogo -> Soluciones -> Acuerdo.',
            't' => 'Resolución de Conflictos'
        ],
        [
            'n' => 228,
            'p' => 'El voluntariado es una forma de participación ciudadana que contribuye al bien común.',
            'a' => 'Verdadero',
            'b' => 'Falso',
            'c' => 'Parcialmente verdadero',
            'd' => 'Parcialmente falso',
            'r' => 'A',
            'e' => 'Voluntariado: Acto altruista para mejorar el entorno social sin lucro.',
            't' => 'Participación'
        ],
        [
            'n' => 229,
            'p' => 'Selecciona los elementos de la identidad nacional mexicana. 1. Historia 2. Lengua 3. Tradiciones 4. Territorio 5. Economía global 6. Símbolos patrios',
            'a' => '1, 2, 3, 4, 6',
            'b' => '1, 3, 5, 6',
            'c' => '2, 4, 5, 6',
            'd' => '3, 4, 5, 6',
            'r' => 'A',
            'e' => 'Identidad: Pasado común, idioma, cultura, tierra y símbolos representativos.',
            't' => 'Identidad Nacional'
        ],
        [
            'n' => 230,
            'p' => 'La tolerancia es aceptar las diferencias sin juzgar ni discriminar.',
            'a' => 'Verdadero',
            'b' => 'Falso',
            'c' => 'Parcialmente verdadero',
            'd' => 'Parcialmente falso',
            'r' => 'A',
            'e' => 'Tolerancia: Respeto y aceptación de la diversidad humana.',
            't' => 'Tolerancia'
        ],
        [
            'n' => 231,
            'p' => 'Relaciona tipos de familia: 1. Nuclear, 2. Extensa, 3. Monoparental, 4. Reconstituida. Descripción: a) Padres/hijos, b) Con abuelos, c) Un progenitor, d) Con hijos previos.',
            'a' => '1a, 2b, 3c, 4d',
            'b' => '1b, 2a, 3d, 4c',
            'c' => '1c, 2d, 3a, 4b',
            'd' => '1d, 2c, 3b, 4a',
            'r' => 'A',
            'e' => 'Familia: Nuclear (directa), Extensa (multigeneracional), Monoparental (soltero/a), Reconstituida (nuevas uniones).',
            't' => 'Familia'
        ],
        [
            'n' => 232,
            'p' => 'La empatía es la capacidad de entender y compartir los sentimientos de los demás.',
            'a' => 'Verdadero',
            'b' => 'Falso',
            'c' => 'Parcialmente verdadero',
            'd' => 'Parcialmente falso',
            'r' => 'A',
            'e' => 'Empatía: Ponerse en el lugar del otro emocionalmente.',
            't' => 'Empatía'
        ],
        [
            'n' => 233,
            'p' => 'Ordena los poderes del Estado mexicano. 1. Ejecutivo 2. Legislativo 3. Judicial',
            'a' => '1, 2, 3',
            'b' => '2, 1, 3',
            'c' => '3, 2, 1',
            'd' => '1, 3, 2',
            'r' => 'A',
            'e' => 'Poderes de la Unión: Ejecutivo (Presidente), Legislativo (Diputados/Senadores), Judicial (Jueces/Corte).',
            't' => 'Poderes Públicos'
        ],
        [
            'n' => 234,
            'p' => 'El medio ambiente debe ser protegido para garantizar la sostenibilidad para generaciones futuras.',
            'a' => 'Verdadero',
            'b' => 'Falso',
            'c' => 'Parcialmente verdadero',
            'd' => 'Parcialmente falso',
            'r' => 'A',
            'e' => 'Cuidado ambiental: Responsabilidad ética con el futuro planetario.',
            't' => 'Ecología y Ética'
        ],
        [
            'n' => 235,
            'p' => 'Selecciona las responsabilidades cívicas. 1. Votar 2. Pagar impuestos 3. Respetar leyes 4. Evadir 5. Participar 6. Ignorar',
            'a' => '1, 2, 3, 5',
            'b' => '1, 3, 4, 6',
            'c' => '2, 4, 5, 6',
            'd' => '3, 4, 5, 6',
            'r' => 'A',
            'e' => 'Deberes ciudadanos: Voto, contribución fiscal, legalidad y participación comunitaria.',
            't' => 'Responsabilidades'
        ],
        [
            'n' => 236,
            'p' => 'La libertad de expresión es un derecho fundamental que permite opinar sin censura.',
            'a' => 'Verdadero',
            'b' => 'Falso',
            'c' => 'Parcialmente verdadero',
            'd' => 'Parcialmente falso',
            'r' => 'A',
            'e' => 'Libertad de expresión: Derecho a difundir ideas libremente con responsabilidad social.',
            't' => 'Libertades'
        ],
        [
            'n' => 237,
            'p' => 'Relaciona conceptos: 1. Moral, 2. Ética, 3. Valores, 4. Normas. Definiciones: a) Principios, b) Reglas sociales, c) Estudio moral, d) Código personal.',
            'a' => '1d, 2c, 3a, 4b',
            'b' => '1a, 2d, 3b, 4c',
            'c' => '1b, 2a, 3c, 4d',
            'd' => '1c, 2b, 3d, 4a',
            'r' => 'A',
            'e' => 'Moral (personal), Ética (teórica), Valores (guías), Normas (sociales).',
            't' => 'Conceptos Éticos'
        ],
        [
            'n' => 238,
            'p' => 'La inclusión social busca integrar a todos los grupos vulnerables en la sociedad.',
            'a' => 'Verdadero',
            'b' => 'Falso',
            'c' => 'Parcialmente verdadero',
            'd' => 'Parcialmente falso',
            'r' => 'A',
            'e' => 'Inclusión: Acción de integrar activamente a minorías o grupos desfavorecidos.',
            't' => 'Inclusión'
        ],
        [
            'n' => 239,
            'p' => 'Ordena los pasos para una convivencia pacífica. 1. Dialogo 2. Respeto 3. Tolerancia 4. Empatía',
            'a' => '1, 2, 3, 4',
            'b' => '2, 1, 4, 3',
            'c' => '3, 2, 1, 4',
            'd' => '4, 3, 2, 1',
            'r' => 'B',
            'e' => 'Convivencia: Respeto -> Diálogo -> Empatía -> Tolerancia.',
            't' => 'Convivencia'
        ],
        [
            'n' => 240,
            'p' => 'La educación cívica fomenta el respeto a los símbolos patrios y la participación democrática.',
            'a' => 'Verdadero',
            'b' => 'Falso',
            'c' => 'Parcialmente verdadero',
            'd' => 'Parcialmente falso',
            'r' => 'A',
            'e' => 'Educación cívica: Formación en valores patrios y democráticos.',
            't' => 'Educación Cívica'
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

    echo "✅ ¡Inserción completada! 30 preguntas de Formación Cívica y Ética añadidas con éxito.<br>";

} catch (Exception $e) {
    echo "<h3 style='color:red'>❌ Error: " . $e->getMessage() . "</h3>";
}

echo "<br><div style='padding:20px; background:#f3e5f5; border-radius:10px;'>";
echo "⚖️ <strong>¡Proceso Terminado!</strong><br>";
echo "Las preguntas oficiales de Formación Cívica y Ética están listas.<br><br>";
echo "<a href='verificar_preguntas_oficiales.php?materia=Formación Cívica y Ética' 
      style='display:inline-block; padding:12px 20px; background:#7b1fa2; color:white; text-decoration:none; border-radius:5px; font-weight:bold;'>
      🛡️ Verificar Preguntas de Civismo
      </a>";
echo "</div>";
?>