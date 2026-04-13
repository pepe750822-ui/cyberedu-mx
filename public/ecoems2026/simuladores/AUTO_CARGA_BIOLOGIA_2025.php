<?php
/**
 * CARGADOR AUTOMÁTICO DE PREGUNTAS DE BIOLOGÍA - POLITÉCNICO 2025
 * Versión: 1.1 (Biología - Justificaciones Oficiales)
 * Objetivo: Insertar 30 preguntas oficiales con textos corregidos.
 */

header('Content-Type: text/html; charset=utf-8');
include 'config.php';

echo "<h1>🚀 Cargador Automático Biología Politécnico 2025 (v1.1)</h1>";

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

    // Obtener ID de Biología
    $mid_stmt = $pdo->query("SELECT id FROM materias_politecnico WHERE nombre = 'Biología'");
    $mid = $mid_stmt->fetchColumn();
    if (!$mid) {
        $pdo->exec("INSERT INTO materias_politecnico (nombre) VALUES ('Biología')");
        $mid = $pdo->lastInsertId();
    }

    // Limpiar datos previos
    $pdo->prepare("DELETE FROM preguntas_politecnico WHERE guia_year = 2025 AND materia_id = ?")->execute([$mid]);

    // DATA OFICIAL (Reactivos 61-90)
    $preguntas = [
        [
            'n' => 61,
            'p' => 'Nombre que recibe la variedad de seres vivos y las relaciones que establecen entre sí y con el medio que los rodea.',
            'a' => 'Diversidad',
            'b' => 'Ecosistema',
            'c' => 'Biodiversidad',
            'd' => 'Ambiente',
            'r' => 'C',
            'e' => 'La biodiversidad es la variedad de seres vivos que existen en el planeta y las relaciones que establecen entre sí y con el medio que los rodea. Es el resultado de millones de años de evolución.',
            't' => 'Biodiversidad'
        ],
        [
            'n' => 62,
            'p' => 'México cuenta principalmente con 2 zonas climáticas; con un clima ______ al sur y ______ al norte.',
            'a' => 'tropical - templada',
            'b' => 'cálido - tropical',
            'c' => 'templado - frío',
            'd' => 'boscoso - tropical',
            'r' => 'A',
            'e' => 'Gracias a su localización geográfica, México cuenta con una diversidad de climas: secos, fríos, templados y tropicales. Al sur del país, los climas son tropicales y al norte templados.',
            't' => 'Climas de México'
        ],
        [
            'n' => 63,
            'p' => 'Selecciona los principales gases del efecto invernadero. 1. CO₂ 2. RCN 3. N₂O 4. CL₂ 5. CH₄ 6. SO₂ 7. CFC 8. H₂O',
            'a' => '1,2,4,5,6',
            'b' => '1,3,5,7,8',
            'c' => '2,4,6,7,8',
            'd' => '2,4,5,6,7',
            'r' => 'B',
            'e' => 'Los principales gases del efecto invernadero son: el dióxido de carbono (CO₂), el óxido nitroso (N₂O), el metano (CH₄), los clorofluorocarbonos (CFC) y el vapor de agua (H₂O).',
            't' => 'Efecto Invernadero'
        ],
        [
            'n' => 64,
            'p' => 'La circulación de elementos químicos entre los seres vivos y el ambiente que los rodea, mediante procesos como el transporte, la producción y la descomposición reciben el nombre de ciclos...',
            'a' => 'químicos',
            'b' => 'físicoquímicos',
            'c' => 'agroquímicos',
            'd' => 'biogeoquímicos',
            'r' => 'D',
            'e' => 'Los ciclos biogeoquímicos son la circulación de elementos químicos entre los seres vivos y el ambiente que los rodea, mediante procesos como el transporte, la producción y la descomposición. Los principales son: ciclo del agua, oxígeno, carbono, nitrógeno, fósforo, azufre, potasio y calcio.',
            't' => 'Ciclos Biogeoquímicos'
        ],
        [
            'n' => 65,
            'p' => '¿Qué elementos intervienen en los procesos biológicos de los que dependen todos los seres vivos?',
            'a' => 'Carbono y Nitrógeno',
            'b' => 'Azufre y Carbono',
            'c' => 'Nitrógeno y Bromo',
            'd' => 'Carbono y Potasio',
            'r' => 'A',
            'e' => 'El carbono y el nitrógeno son dos elementos indispensables para la vida, ya que de forma directa e indirecta intervienen en los procesos biológicos de los que dependen todos los seres vivos.',
            't' => 'Bioelementos'
        ],
        [
            'n' => 66,
            'p' => 'Relaciona los tipos de nutrición de los seres vivos con sus descripciones. 1. Autótrofos 2. Heterótrofos. a) Consumidores y descomponedores, b) Producen sus propios nutrientes, c) Herbívoros, carnívoros y omnívoros, d) Productores, e) Plantas, algunas bacterias y algas, f) También formado por organismos descomponedores.',
            'a' => '1a d f, 2b e g',
            'b' => '1b e, 2a d f',
            'c' => '1a f g, 2d c b',
            'd' => '1b d e, 2a c f',
            'r' => 'D',
            'e' => 'Autótrofos: producen sus propios nutrimentos mediante la fotosíntesis (productores). Heterótrofos: organismos consumidores y descomponedores.',
            't' => 'Nutrición'
        ],
        [
            'n' => 67,
            'p' => 'Proceso biológico que permite la generación de nuevos individuos, para preservar las especies.',
            'a' => 'Adaptación',
            'b' => 'Supervivencia',
            'c' => 'Reproducción',
            'd' => 'Sexualidad',
            'r' => 'C',
            'e' => 'La reproducción es un proceso biológico sexual o asexual que permite la formación de nuevos individuos... con el propósito de preservar las especies.',
            't' => 'Reproducción'
        ],
        [
            'n' => 68,
            'p' => 'Un ecosistema está formado por factores:',
            'a' => 'terrestres y ambientales',
            'b' => 'bióticos y abióticos',
            'c' => 'ambientales y dinámicos',
            'd' => 'abióticos y simbióticos',
            'r' => 'B',
            'e' => 'Un ecosistema es un sistema formado por un conjunto de organismos, el medio ambiente físico (hábitat) y las relaciones tanto bióticas como abióticas.',
            't' => 'Ecosistemas'
        ],
        [
            'n' => 69,
            'p' => 'Ordena las fases del ciclo del agua, partiendo de la fase de evaporación. 1. Precipitación 2. Escurrimiento 3. Condensación 4. Circulación subterránea',
            'a' => '1,3,4,2',
            'b' => '2,4,3,1',
            'c' => '3,1,2,4',
            'd' => '4,2,1,3',
            'r' => 'C',
            'e' => 'El ciclo del agua consta de las siguientes fases: evaporación → condensación → precipitación → escurrimiento / circulación subterránea.',
            't' => 'Ciclo del Agua'
        ],
        [
            'n' => 70,
            'p' => 'Son enfermedades de propensión genética.',
            'a' => 'diabetes y obesidad',
            'b' => 'depresión y asma',
            'c' => 'hipotiroidismo y diabetes',
            'd' => 'diabetes y gastroenteritis',
            'r' => 'A',
            'e' => 'La diabetes y la obesidad son dos ejemplos de enfermedades no transmisibles de propensión genética.',
            't' => 'Enfermedades'
        ],
        [
            'n' => 71,
            'p' => 'Relaciona los tipos de interdependencia: 1. Mutualismo 2. Comensalismo 3. Parasitismo. a) Perjudica, b) Ambos benefician, c) Uno beneficia y el otro neutral.',
            'a' => '1a,2c,3b',
            'b' => '1b,2a,3c',
            'c' => '1a,2b,3c',
            'd' => '1b,2c,3a',
            'r' => 'D',
            'e' => 'Mutualismo: ambos benefician. Comensalismo: uno beneficia, otro no se afecta. Parasitismo: uno vive a costa de otro perjudicándolo.',
            't' => 'Ecosistemas'
        ],
        [
            'n' => 72,
            'p' => 'La enfermedad crónica degenerativa que causa daño en varios órganos y sistemas del cuerpo humano, se conoce como...',
            'a' => 'hipertensión',
            'b' => 'diabetes',
            'c' => 'obesidad',
            'd' => 'trastorno',
            'r' => 'B',
            'e' => 'La diabetes es una enfermedad crónica degenerativa, incurable que causa daño en varios órganos y sistemas del cuerpo humano.',
            't' => 'Salud'
        ],
        [
            'n' => 73,
            'p' => 'Selecciona las funciones fundamentales de las células. 1. Secreción, 2. Soporte estructural, 3. Transporte nutrientes, 4. Reacción a estímulos, 5. Reacciones químicas energía, 6. Síntesis proteínas.',
            'a' => '1,4,5',
            'b' => '1,3,5',
            'c' => '2,4,6',
            'd' => '2,3,4',
            'r' => 'D',
            'e' => 'Las funciones incluyen: estructurales (soporte), metabólicas, de interacción (reacción a estímulos) y transporte.',
            't' => 'La Célula'
        ],
        [
            'n' => 74,
            'p' => 'La división celular por ______ genera ______ células hijas ______ genéticamente.',
            'a' => 'mitosis - dos - idénticas',
            'b' => 'meiosis - dos - diferentes',
            'c' => 'mitosis - cuatro - idénticas',
            'd' => 'meiosis - cuatro - diferentes',
            'r' => 'A',
            'e' => 'La mitosis es un proceso de reproducción celular por el cual se generan dos células hijas idénticas genéticamente.',
            't' => 'División Celular'
        ],
        [
            'n' => 75,
            'p' => '¿Cuál es una infección de transmisión sexual?',
            'a' => 'Rubeola',
            'b' => 'Sífilis',
            'c' => 'Influenza',
            'd' => 'Migraña',
            'r' => 'B',
            'e' => 'La sífilis es una infección causada por la bacteria Treponema pallidum y se transmite sexualmente.',
            't' => 'Salud Sexual'
        ],
        [
            'n' => 76,
            'p' => 'Los métodos anticonceptivos hormonales son:',
            'a' => 'tabletas, parches, condón',
            'b' => 'inyecciones, anillos, DIU',
            'c' => 'implantes, parches, inyecciones',
            'd' => 'espermicidas, tabletas, calendario',
            'r' => 'C',
            'e' => 'Los métodos hormonales desprenden sustancias químicas que impiden la fecundación (implantes, inyecciones, parches, etc.).',
            't' => 'Anticoncepción'
        ],
        [
            'n' => 77,
            'p' => 'Relaciona: 1. Hormonal 2. De barrera 3. Permanentes. a) Obstáculo físico, c) Hormonas previenen ovulación, d) Cirugías.',
            'a' => '1a,2c,3b',
            'b' => '1d,2a,3c',
            'c' => '1b,2d,3a',
            'd' => '1c,2a,3d',
            'r' => 'D',
            'e' => 'Hormonal: impide ovulación. Barrera: obstáculo físico. Permanentes: cirugías.',
            't' => 'Anticoncepción'
        ],
        [
            'n' => 78,
            'p' => 'De acuerdo a la OMS, el concepto: "El estado de bienestar físico, mental y social en todos los aspectos relacionados con la sexualidad" refiere a la...',
            'a' => 'salud sexual',
            'b' => 'persona sana',
            'c' => 'salud reproductiva',
            'd' => 'persona insana',
            'r' => 'A',
            'e' => 'La OMS define la salud sexual como el estado de bienestar físico, mental y social en todos los aspectos relacionados con la sexualidad.',
            't' => 'Salud Sexual'
        ],
        [
            'n' => 79,
            'p' => 'Selecciona las partes que conforman al microscopio. 1. Base 2. Oreja 3. Platina 4. Oculares 5. Botón 6. Brazo 7. Reactivo',
            'a' => '1,2,4,7',
            'b' => '1,3,4,6',
            'c' => '2,3,5,6',
            'd' => '2,4,6,7',
            'r' => 'B',
            'e' => 'Un microscopio está compuesto por base, platina, oculares y brazo, entre otros componentes.',
            't' => 'Microscopio'
        ],
        [
            'n' => 80,
            'p' => 'Es la unidad morfológica y funcional de todo ser vivo.',
            'a' => 'Microbio',
            'b' => 'Óvulo',
            'c' => 'Átomo',
            'd' => 'Célula',
            'r' => 'D',
            'e' => 'La célula es la unidad morfológica y funcional de todo ser vivo; es el elemento de menor tamaño que puede considerarse vivo.',
            't' => 'La Célula'
        ],
        [
            'n' => 81,
            'p' => 'Ordena del más simple al más complejo, los niveles de organización de los seres vivos. 1. Células 2. Órganos 3. Sistemas 4. Individuo 5. Átomos 6. Tejidos',
            'a' => '4,3,2,1,6,5',
            'b' => '5,1,2,6,3,4',
            'c' => '5,4,3,2,1,6',
            'd' => '4,1,3,2,5,6',
            'r' => 'B',
            'e' => 'Los niveles son: Átomos → moléculas → células → tejidos → órganos → sistemas → individuo.',
            't' => 'Niveles de Organización'
        ],
        [
            'n' => 82,
            'p' => 'La medicina tradicional o ______ usa raíces, ramas, hojas, flores o semillas de plantas, para ______ la salud y ______ enfermedades.',
            'a' => 'herbolaria - mejorar - prevenir',
            'b' => 'arbolaría - reestablecer - provocar',
            'c' => 'moderna - mejorar - reestablecer',
            'd' => 'complementaria - provocar - prevenir',
            'r' => 'A',
            'e' => 'La medicina tradicional o herbolaria usa partes de plantas para mejorar la salud, prevenir y tratar enfermedades.',
            't' => 'Herbolaria'
        ],
        [
            'n' => 83,
            'p' => '¿Qué nombre reciben las comunidades indígenas descendientes de las culturas precolombinas que han mantenido sus características culturales y sociales?',
            'a' => 'Pueblos andinos',
            'b' => 'Comunidades autóctonas',
            'c' => 'Pueblos originarios',
            'd' => 'Tribus autóctonas',
            'r' => 'C',
            'e' => 'Se denomina pueblos originarios a las comunidades indígenas descendientes de culturas precolombinas que mantienen su identidad.',
            't' => 'Cultura'
        ],
        [
            'n' => 84,
            'p' => 'Los procesos sociales, económicos y culturales que promueven el desarrollo de las sociedades humanas y la preservación de la naturaleza son conocidos como...',
            'a' => 'preservación',
            'b' => 'insostenibilidad',
            'c' => 'conservación',
            'd' => 'sostenibilidad',
            'r' => 'D',
            'e' => 'La sostenibilidad promueve el desarrollo de las sociedades humanas y la preservación de la naturaleza a la vez.',
            't' => 'Sostenibilidad'
        ],
        [
            'n' => 85,
            'p' => 'Relaciona los estados de agregación de la materia con sus características. 1. Sólido 2. Líquido 3. Gaseoso 4. Plasma. a) Forma definida, b) Energía cinética, c) Volumen no definido, d) Cohesión elevada, f) Cohesión menor, g) Gas ionizado.',
            'a' => '1bh,2ag,3ef,4dc',
            'b' => '1ad,2bf,3ce,4gh',
            'c' => '1ac,2h,3bg,4de',
            'd' => '1be,2ch,3ad,4fg',
            'r' => 'B',
            'e' => 'Sólido: forma definida y cohesión elevada. Líquido: cohesión menor. Gaseoso: expansión y volumen no definido. Plasma: gas ionizado.',
            't' => 'Materia'
        ],
        [
            'n' => 86,
            'p' => 'Las formas de la materia son:',
            'a' => 'viva, simbiótica y abiótica',
            'b' => 'inerte, biótica y muerta',
            'c' => 'viva, biótica y sintética',
            'd' => 'inerte o abiótica y viva',
            'r' => 'D',
            'e' => 'La materia se presenta como inerte o abiótica (no viva) y viva (biótica, organizada en células).',
            't' => 'Materia'
        ],
        [
            'n' => 87,
            'p' => 'Selecciona las funciones del sistema nervioso humano. 1. Central/periférico, 4. Regula funciones cuerpo, 6. Compuesto por neuronas.',
            'a' => '1,3,5',
            'b' => '1,4,6',
            'c' => '2,3,5',
            'd' => '3,5,6',
            'r' => 'B',
            'e' => 'El sistema nervioso dirige, regula y coordina funciones del cuerpo; se divide en central y periférico; está compuesto por neuronas.',
            't' => 'Sistema Nervioso'
        ],
        [
            'n' => 88,
            'p' => '¿Qué representa la imagen (variedad de seres vivos)?',
            'a' => 'Biodiversidad',
            'b' => 'Adaptación',
            'c' => 'Universalidad',
            'd' => 'Variabilidad',
            'r' => 'A',
            'e' => 'Representa la biodiversidad: variedad de seres vivos y sus relaciones con el medio.',
            't' => 'Biodiversidad'
        ],
        [
            'n' => 89,
            'p' => 'La Biodiversidad es la variedad de seres ______ que existen en el planeta y las ______ que establecen entre sí y con el ______ que los rodea.',
            'a' => 'tróficos - igualdades - lugar',
            'b' => 'endémicos - afinidades - entorno',
            'c' => 'vivos - relaciones - medio',
            'd' => 'endémicos - igualdades - lugar',
            'r' => 'C',
            'e' => 'La biodiversidad es la variedad de seres vivos que existen en el planeta y las relaciones con el medio ambiente.',
            't' => 'Biodiversidad'
        ],
        [
            'n' => 90,
            'p' => 'Se considera a México un país megadiverso por...',
            'a' => 'ser un país muy poblado',
            'b' => 'tener un gobierno democrático',
            'c' => 'la variedad de seres vivos que lo habitan',
            'd' => 'contar con 38 grupos étnicos',
            'r' => 'C',
            'e' => 'México es megadiverso por la gran variedad de especies y ecosistemas que lo habitan.',
            't' => 'Biodiversidad'
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

    echo "✅ ¡Actualización completada! 30 preguntas de Biología con justificaciones oficiales insertadas.";

} catch (Exception $e) {
    echo "<h3 style='color:red'>❌ Error: " . $e->getMessage() . "</h3>";
}
?>