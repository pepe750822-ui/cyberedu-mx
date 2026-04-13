<?php
/**
 * CARGADOR AUTOMÁTICO DE PREGUNTAS DE ESPAÑOL - POLITÉCNICO 2025
 * Versión: 1.0 (Español)
 * Objetivo: Insertar 30 preguntas oficiales con justificaciones detalladas.
 */

header('Content-Type: text/html; charset=utf-8');
include 'config.php';

echo "<h1>🚀 Cargador Automático Español Politécnico 2025 (v1.0)</h1>";

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

    // Obtener ID de Español
    $mid_stmt = $pdo->query("SELECT id FROM materias_politecnico WHERE nombre = 'Español'");
    $mid = $mid_stmt->fetchColumn();
    if (!$mid) {
        $pdo->exec("INSERT INTO materias_politecnico (nombre) VALUES ('Español')");
        $mid = $pdo->lastInsertId();
    }

    // Limpiar datos previos de Español 2025
    $pdo->prepare("DELETE FROM preguntas_politecnico WHERE guia_year = 2025 AND materia_id = ?")->execute([$mid]);
    echo "ℹ️ Registros antiguos de Español 2025 limpiados.<br>";

    // DATA OFICIAL (Reactivos 121-150)
    $preguntas = [
        [
            'n' => 121,
            'p' => 'Los artículos de opinión son textos ______ breves que tratan un tema actual y controvertido.',
            'a' => 'descriptivos',
            'b' => 'expositivos',
            'c' => 'comparativos',
            'd' => 'argumentativos',
            'r' => 'D',
            'e' => 'Los artículos de opinión son textos argumentativos que requieren que el autor sustente de forma válida su punto de vista.',
            't' => 'Artículos de Opinión'
        ],
        [
            'n' => 122,
            'p' => 'Selecciona algunas de las características que debe contener una biografía. 1. Narra sucesos enmarcados en un contexto histórico real 2. Utiliza formato de columnas dividido por la relevancia de los sucesos 3. Relata el contenido en tercera persona del singular o del plural 4. Resume la vida de un sujeto en una sola página 5. Incluye una línea del tiempo como parte de la conclusión del texto 6. Presenta solo los sucesos relevantes de la vida del sujeto',
            'a' => '1, 4, 5',
            'b' => '1, 3, 6',
            'c' => '2, 3, 5',
            'd' => '2, 4, 6',
            'r' => 'B',
            'e' => 'Las biografías son textos informativos de extensión variable, los cuales presentan de manera clara, detallada, fehaciente y concreta los sucesos más relevantes en la vida de un sujeto en particular.',
            't' => 'La Biografía'
        ],
        [
            'n' => 123,
            'p' => 'Selecciona las partes de una carta informal o personal. 1. Saludo 2. Firma 3. Poderante 4. Despedida 5. Apoderado 6. Cuerpo',
            'a' => '1, 2, 4, 6',
            'b' => '1, 2, 3, 4',
            'c' => '2, 3, 4, 5',
            'd' => '3, 4, 5, 6',
            'r' => 'A',
            'e' => 'Partes de una carta informal o personal son cinco: saludo o vocativo, cuerpo, despedida, firma y posdata.',
            't' => 'La Carta Informal'
        ],
        [
            'n' => 124,
            'p' => 'Es el lenguaje que se emplea de manera lógica, fluida, siempre con información bien estructurada y con oraciones e ideas completas.',
            'a' => 'Informal',
            'b' => 'Figurado',
            'c' => 'Formal',
            'd' => 'Literario',
            'r' => 'C',
            'e' => 'El lenguaje formal se utiliza en conversaciones con personas con las cuales no se tiene una relación estrecha; se emplea de manera lógica, fluida, siempre con información bien estructurada y con oraciones e ideas completas.',
            't' => 'Tipos de Lenguaje'
        ],
        [
            'n' => 125,
            'p' => 'Los elementos que estructuran una biografía son:',
            'a' => 'nudo, desarrollo, conclusión',
            'b' => 'nudo, introducción, desarrollo',
            'c' => 'desarrollo, desenlace, conclusión',
            'd' => 'introducción, desarrollo, conclusión',
            'r' => 'D',
            'e' => 'La biografía se caracteriza por tener al menos tres elementos en los que se plasma la información de un personaje. En la introducción se presenta; en el desarrollo se narra lo más trascendente de su vida y al final, en la conclusión se plasma la manera de pensar o sentir del individuo con relación al personaje.',
            't' => 'Estructura de la Biografía'
        ],
        [
            'n' => 126,
            'p' => 'Relaciona los tipos de textos con su propósito. 1. Narrativo, 2. Expositivo, 3. Descriptivo, 4. Argumentativo, 5. Conversacional. a) Describe acciones, hechos reales o imaginarios, b) Trasmite información adecuada, coherente y objetiva, c) Indica características o cualidades de personas, animales, paisajes, d) Incita, convence o rebate opiniones e ideas con argumentos, e) Intercambia información en un diálogo.',
            'a' => '1a, 2b, 3c, 4d, 5e',
            'b' => '1e, 2d, 3c, 4b, 5a',
            'c' => '1c, 2b, 3a, 4e, 5d',
            'd' => '1d, 2c, 3e, 4a, 5b',
            'r' => 'B',
            'e' => 'Narrativo: hechos reales/imaginarios. Expositivo: información objetiva. Descriptivo: características. Argumentativo: convence/rebate. Conversacional: diálogo.',
            't' => 'Tipos de Textos'
        ],
        [
            'n' => 127,
            'p' => 'Un texto publicitario tiene una redacción que atrapa al posible comprador desde el inicio haciendo uso del humor; mismo que se manifiesta en la forma en la que descalifica a los productos rivales. Pueden hacer uso de cualquier modo y persona.',
            'a' => 'Verdadero',
            'b' => 'Falso',
            'c' => 'Parcialmente verdadero',
            'd' => 'Parcialmente falso',
            'r' => 'A',
            'e' => 'Un texto publicitario tiene una redacción que atrapa al posible comprador desde el inicio haciendo uso del humor; mismo que se manifiesta en la forma en la que descalifica a los productos rivales.',
            't' => 'Texto Publicitario'
        ],
        [
            'n' => 128,
            'p' => 'Un refrán es un dicho o una frase que expresa una enseñanza, un pensamiento o una moraleja. Se caracteriza por ser de origen popular y por transmitirse de forma oral, de generación en generación. Como los refranes provienen del conocimiento popular, son anónimos.',
            'a' => 'Verdadero',
            'b' => 'Falso',
            'c' => 'Parcialmente verdadero',
            'd' => 'Parcialmente falso',
            'r' => 'C',
            'e' => 'El refrán expresa enseñanza o moraleja, es de origen popular, oral, generacional y anónimo.',
            't' => 'El Refrán'
        ],
        [
            'n' => 129,
            'p' => 'Una novela es una ficción, narrada de manera organizada y escrita en prosa, que cuenta una historia, inventada o basada en hechos reales.',
            'a' => 'Verdadero',
            'b' => 'Falso',
            'c' => 'Parcialmente verdadero',
            'd' => 'Parcialmente falso',
            'r' => 'D',
            'e' => 'La novela es una narración extensa en prosa de sucesos imaginarios o reales.',
            't' => 'La Novela'
        ],
        [
            'n' => 130,
            'p' => 'Un tropo es el uso deliberado de las palabras con un sentido distinto al normal, aunque guarda con este una conexión o una semejanza. Ejemplos: Hipérbole, Metáfora, Paradoja.',
            'a' => 'Verdadero',
            'b' => 'Falso',
            'c' => 'Parcialmente verdadero',
            'd' => 'Parcialmente falso',
            'r' => 'A',
            'e' => 'El tropo emplea palabras con sentido distinto al habitual. Ejemplos: Hipérbole (exageración), Metáfora (sustitución), Paradoja (contradicción).',
            't' => 'Figuras Retóricas'
        ],
        [
            'n' => 131,
            'p' => 'La descripción de la atmósfera y los escenarios en la narrativa es esencial porque determinan el trasfondo de la historia; son los elementos que transmiten el sentimiento y el contexto de la obra al lector.',
            'a' => 'Verdadero',
            'b' => 'Falso',
            'c' => 'Parcialmente verdadero',
            'd' => 'Parcialmente falso',
            'r' => 'A',
            'e' => 'Atmósfera y escenarios determinan sentimiento y contexto en la narrativa.',
            't' => 'Narrativa'
        ],
        [
            'n' => 132,
            'p' => 'Los textos expositivos son objetivos y apegados a la realidad ya que la investigan o la presentan a un público que tiene un interés por los hechos ocurridos, se clasifican en: Texto universitario, Artículos científicos, Artículos informativos, Reseña bibliográfica.',
            'a' => 'Verdadero',
            'b' => 'Falso',
            'c' => 'Parcialmente verdadero',
            'd' => 'Parcialmente falso',
            'r' => 'C',
            'e' => 'Textos expositivos: objetivos y apegados a realidad. Clasificación: universitarios, científicos, informativos, reseñas.',
            't' => 'Textos Expositivos'
        ],
        [
            'n' => 133,
            'p' => 'Elaborar ensayos desarrolla habilidades para interpretar textos y formular opiniones con sustento argumentativo, basado en referencias especializadas.',
            'a' => 'Verdadero',
            'b' => 'Falso',
            'c' => 'Parcialmente verdadero',
            'd' => 'Parcialmente falso',
            'r' => 'B',
            'e' => 'El ensayo fomenta interpretación y argumentación sustentada en referencias.',
            't' => 'El Ensayo'
        ],
        [
            'n' => 134,
            'p' => 'Una entrevista es un intercambio de ideas u opiniones mediante una conversación que se da entre dos o más personas. Las técnicas de investigación son el conjunto de herramientas, procedimientos e instrumentos utilizados para obtener información y conocimiento, una de ellas es la Encuesta.',
            'a' => 'Verdadero',
            'b' => 'Falso',
            'c' => 'Parcialmente verdadero',
            'd' => 'Parcialmente falso',
            'r' => 'D',
            'e' => 'La entrevista intercambia opiniones. La encuesta es otra técnica de investigación independiente.',
            't' => 'Técnicas de Investigación'
        ],
        [
            'n' => 135,
            'p' => 'Para organizar un debate efectivo se deben seguir algunas reglas para crear un ambiente de respeto y tolerancia. Las fases del debate son: Planeación, Organización, Definición de roles, Inicio, Ejecución, Sesión de preguntas y respuestas, Conclusión.',
            'a' => 'Verdadero',
            'b' => 'Falso',
            'c' => 'Parcialmente verdadero',
            'd' => 'Parcialmente falso',
            'r' => 'B',
            'e' => 'Fases del debate: Planeación, Organización, Definición de roles, Inicio, Ejecución, Sesión de preguntas y respuestas, Conclusión.',
            't' => 'El Debate'
        ],
        [
            'n' => 136,
            'p' => 'Los elementos de la comunicación son: Emisor, Receptor, Mensaje, Código, Canal, Contexto, Ruido.',
            'a' => 'Verdadero',
            'b' => 'Falso',
            'c' => 'Parcialmente verdadero',
            'd' => 'Parcialmente falso',
            'r' => 'A',
            'e' => 'Elementos: Emisor, Receptor, Mensaje, Código, Canal, Contexto y Ruido.',
            't' => 'Elementos de la Comunicación'
        ],
        [
            'n' => 137,
            'p' => 'México cuenta con 68 lenguas indígenas y el español, se encuentra entre las primeras 10 naciones con más lenguas originarias y ocupa el 2º lugar con esta característica en América Latina, después de Brasil.',
            'a' => 'Verdadero',
            'b' => 'Falso',
            'c' => 'Parcialmente verdadero',
            'd' => 'Parcialmente falso',
            'r' => 'D',
            'e' => 'México tiene 68 lenguas indígenas + español. Diversidad lingüística notable en AL.',
            't' => 'Diversidad Lingüística'
        ],
        [
            'n' => 138,
            'p' => 'La historieta es un texto narrado a partir de una secuencia de pictogramas o signos visuales que representan una historia. Tipos: cómica, policíaca, aventuras, terror, ciencia ficción y manga.',
            'a' => 'Verdadero',
            'b' => 'Falso',
            'c' => 'Parcialmente verdadero',
            'd' => 'Parcialmente falso',
            'r' => 'B',
            'e' => 'Historieta: pictogramas secuenciales. Tipos: cómica, policíaca, aventuras, terror, ciencia ficción, manga.',
            't' => 'La Historieta'
        ],
        [
            'n' => 139,
            'p' => 'Los podcasts son una serie de episodios grabados en audio y transmitidos online, son grabados en diferentes formatos (entrevistas, grabaciones individuales).',
            'a' => 'Verdadero',
            'b' => 'Falso',
            'c' => 'Parcialmente verdadero',
            'd' => 'Parcialmente falso',
            'r' => 'C',
            'e' => 'Podcasts: audio online, diversos formatos (entrevistas, soliloquios).',
            't' => 'Medios Digitales'
        ],
        [
            'n' => 140,
            'p' => 'En la creación literaria, el subgénero de más reciente creación es el de Ciencia Ficción, ligado a la ciencia y a la tecnología; autores: Isaac Asimov, Ray Bradbury o Arthur C. Clarke.',
            'a' => 'Verdadero',
            'b' => 'Falso',
            'c' => 'Parcialmente verdadero',
            'd' => 'Parcialmente falso',
            'r' => 'D',
            'e' => 'Ciencia Ficción: subgénero reciente ligado a tecnología. Autores: Asimov, Bradbury, Clarke.',
            't' => 'Ciencia Ficción'
        ],
        [
            'n' => 141,
            'p' => 'La lectura es un proceso cognitivo que permite obtener conocimientos e información. Momentos: pre lectura, lectura y pos lectura.',
            'a' => 'Verdadero',
            'b' => 'Falso',
            'c' => 'Parcialmente verdadero',
            'd' => 'Parcialmente falso',
            'r' => 'B',
            'e' => 'La lectura es proceso cognitivo. Momentos principales: pre-lectura, lectura propiamente dicha y pos-lectura.',
            't' => 'Comprensión Lectora'
        ],
        [
            'n' => 142,
            'p' => 'Un artículo académico es un documento escrito por expertos para presentar investigaciones originales. Estructura: Título, Resumen, Palabras clave, Introducción, Desarrollo, Conclusiones, Referencias.',
            'a' => 'Verdadero',
            'b' => 'Falso',
            'c' => 'Parcialmente verdadero',
            'd' => 'Parcialmente falso',
            'r' => 'C',
            'e' => 'Artículo académico por expertos. Estructura rígida: Título, Resumen, Keywords, Intro, Desarrollo, Conclusiones y Referencias.',
            't' => 'Textos Académicos'
        ],
        [
            'n' => 143,
            'p' => 'Conocimiento científico es el conjunto de hechos verificables y sustentados en evidencia. Características: fáctico, sistemático, comprobable y comunicable.',
            'a' => 'Verdadero',
            'b' => 'Falso',
            'c' => 'Parcialmente verdadero',
            'd' => 'Parcialmente falso',
            'r' => 'A',
            'e' => 'Conocimiento científico: hechos verificables, método científico. Características: fáctico, sistemático, comprobable y comunicable.',
            't' => 'Conocimiento Científico'
        ],
        [
            'n' => 144,
            'p' => 'Asertividad se define como la habilidad que permite a las personas expresar de manera adecuada, sin hostilidad ni agresividad, sus emociones frente a otra persona.',
            'a' => 'Verdadero',
            'b' => 'Falso',
            'c' => 'Parcialmente verdadero',
            'd' => 'Parcialmente falso',
            'r' => 'D',
            'e' => 'Asertividad: expresión directa y honesta sin hostilidad.',
            't' => 'Asertividad'
        ],
        [
            'n' => 145,
            'p' => 'Dentro de los textos periodísticos se encuentran la noticia, la crónica, el artículo de opinión.',
            'a' => 'Verdadero',
            'b' => 'Falso',
            'c' => 'Parcialmente verdadero',
            'd' => 'Parcialmente falso',
            'r' => 'B',
            'e' => 'Textos periodísticos: noticia (objetiva), crónica (relato temporal), artículo de opinión (subjetivo).',
            't' => 'Textos Periodísticos'
        ],
        [
            'n' => 146,
            'p' => 'Las onomatopeyas son palabras con las que se reproducen sonidos diferentes como los de la naturaleza (ring-ring, miau, etc.).',
            'a' => 'Verdadero',
            'b' => 'Falso',
            'c' => 'Parcialmente verdadero',
            'd' => 'Parcialmente falso',
            'r' => 'A',
            'e' => 'Onomatopeyas: imitación lingüística de sonidos.',
            't' => 'Recursos Lingüísticos'
        ],
        [
            'n' => 147,
            'p' => 'En las caricaturas periodísticas, los mensajes pueden ser explícitos o implícitos. Los explícitos se expresan directamente; los implícitos se comprenden por contexto social/cultural.',
            'a' => 'Verdadero',
            'b' => 'Falso',
            'c' => 'Parcialmente verdadero',
            'd' => 'Parcialmente falso',
            'r' => 'C',
            'e' => 'Caricatura: mensajes explícitos (lo que se ve/dice) e implícitos (lo que se infiere).',
            't' => 'Caricatura Periodística'
        ],
        [
            'n' => 148,
            'p' => 'En la escritura de los reportajes, se pueden utilizar tonos distintos: formales, humorísticos, coloquiales, dramáticos.',
            'a' => 'Verdadero',
            'b' => 'Falso',
            'c' => 'Parcialmente verdadero',
            'd' => 'Parcialmente falso',
            'r' => 'C',
            'e' => 'Reportaje: admite tonos variados según tema y público (formal, humorístico, coloquial, dramático).',
            't' => 'El Reportaje'
        ],
        [
            'n' => 149,
            'p' => 'Relaciona: Cartel (informativo, textos breves), Folleto (díptico/tríptico, más información), Monografía (documento extenso, estructura formal).',
            'a' => 'Verdadero',
            'b' => 'Falso',
            'c' => 'Parcialmente verdadero',
            'd' => 'Parcialmente falso',
            'r' => 'B',
            'e' => 'Cartel (póster visual); Folleto (plegable detallado); Monografía (estudio profundo).',
            't' => 'Medios Informativos'
        ],
        [
            'n' => 150,
            'p' => 'Las partes de una carta comercial son: Encabezado (lugar, fecha, destinatario, saludo), Cuerpo (contenido) y Parte final (despedida, firma, remitente).',
            'a' => 'Verdadero',
            'b' => 'Falso',
            'c' => 'Parcialmente verdadero',
            'd' => 'Parcialmente falso',
            'r' => 'A',
            'e' => 'Carta comercial: Encabezado (fecha, destinatario), Cuerpo (mensaje central) y Parte final (despedida, firma).',
            't' => 'La Carta Comercial'
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

    echo "✅ ¡Inserción completada! 30 preguntas de Español añadidas con éxito.<br>";

} catch (Exception $e) {
    echo "<h3 style='color:red'>❌ Error: " . $e->getMessage() . "</h3>";
}

echo "<br><div style='padding:20px; background:#e3f2fd; border-radius:10px;'>";
echo "📚 <strong>¡Proceso Terminado!</strong><br>";
echo "Las preguntas oficiales de Español están listas.<br><br>";
echo "<a href='verificar_preguntas_oficiales.php?materia=Español' 
      style='display:inline-block; padding:12px 20px; background:#1976d2; color:white; text-decoration:none; border-radius:5px; font-weight:bold;'>
      🛡️ Verificar Preguntas de Español
      </a>";
echo "</div>";
?>