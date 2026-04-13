<?php
// insertar_explicaciones_ejemplo.php
include 'config.php';

echo "<h1>📝 Insertando Explicaciones de Ejemplo</h1>";

try {
    // Verificar conexión
    $pdo->query('SELECT 1');
    echo "<p style='color: green;'>✅ Conexión a la base de datos exitosa</p>";
    
    // Array de explicaciones de ejemplo organizadas por materias
    $explicaciones_ejemplo = [
        // MATEMÁTICAS
        1 => "La derivada de x² es 2x porque aplicando la regla de la potencia, el exponente (2) se multiplica por el coeficiente (1) y se reduce en uno el exponente (2-1=1). Esto nos da 2x¹, que es igual a 2x. Esta regla es fundamental en cálculo diferencial.",
        
        2 => "El teorema de Pitágoras establece que en un triángulo rectángulo, el cuadrado de la hipotenusa es igual a la suma de los cuadrados de los catetos: a² + b² = c². Esto solo aplica para triángulos rectángulos.",
        
        // HISTORIA
        3 => "La Revolución Mexicana comenzó en 1910 debido al descontento generalizado contra el régimen porfirista que llevaba más de 30 años en el poder. Las causas principales fueron la desigualdad social, concentración de tierras, falta de democracia y los derechos laborales.",
        
        4 => "La Segunda Guerra Mundial terminó en 1945 con la rendición de Alemania en mayo (Día de la Victoria en Europa) y de Japón en septiembre después de los bombardeos atómicos sobre Hiroshima y Nagasaki. Este conflicto redefinió el orden mundial y dio inicio a la Guerra Fría.",
        
        // BIOLOGÍA
        5 => "La mitosis es el proceso de división celular que produce dos células hijas idénticas genéticamente. Es esencial para el crecimiento, desarrollo y reparación de tejidos en organismos multicelulares. Consta de varias fases: profase, metafase, anafase y telofase.",
        
        6 => "La fotosíntesis es el proceso mediante el cual las plantas convierten la energía lumínica en energía química, produciendo glucosa y oxígeno a partir de dióxido de carbono y agua. Este proceso es fundamental para la vida en la Tierra.",
        
        // QUÍMICA
        7 => "El agua hierve a 100°C a nivel del mar porque a esta temperatura la presión de vapor del líquido iguala a la presión atmosférica (1 atm), permitiendo que las moléculas de agua pasen del estado líquido al gaseoso. El punto de ebullición varía con la presión atmosférica.",
        
        8 => "La tabla periódica organiza los elementos según su número atómico y propiedades químicas. Los elementos en la misma columna (grupo) tienen propiedades químicas similares debido a que tienen la misma configuración electrónica en su capa más externa.",
        
        // FÍSICA
        9 => "La segunda ley de Newton establece que F = m × a, meaning la fuerza aplicada sobre un objeto es igual a su masa multiplicada por su aceleración. Esto significa que para cambiar el movimiento de un objeto, se necesita aplicar una fuerza.",
        
        10 => "La ley de la gravitación universal de Newton establece que toda partícula atrae a otra con una fuerza proporcional al producto de sus masas e inversamente proporcional al cuadrado de la distancia que las separa. Esto explica desde la caída de manzanas hasta el movimiento planetario.",
        
        // ESPAÑOL/LITERATURA
        11 => "El modernismo fue un movimiento literario que surgió en Hispanoamérica a finales del siglo XIX, caracterizado por el preciosismo formal, la evasión de la realidad cotidiana y la búsqueda de la belleza. Rubén Darío es considerado su principal exponente.",
        
        12 => "Una metáfora es una figura retórica que consiste en identificar un término real con uno imaginario entre los cuales existe una relación de semejanza. Por ejemplo: 'Tus ojos son dos luceros' significa que los ojos brillan como luceros, no que literalmente sean estrellas.",
        
        // GEOGRAFÍA
        13 => "El cambio climático se refiere a la variación global del clima de la Tierra debido a causas naturales y también a la acción humana. Las principales evidencias incluyen el aumento de la temperatura global, el deshielo de los polos y el aumento del nivel del mar.",
        
        14 => "Los recursos naturales renovables son aquellos que pueden regenerarse naturalmente a una velocidad mayor a la de su consumo, como la energía solar, eólica, y los bosques. Los no renovables, como el petróleo y minerales, existen en cantidades limitadas.",
        
        // FORMACIÓN CÍVICA
        15 => "La división de poderes es un principio fundamental en los sistemas democráticos que establece la separación del poder del Estado en tres ramas: Ejecutivo (gobierna), Legislativo (hace las leyes) y Judicial (aplica la justicia). Esto evita la concentración de poder.",
        
        16 => "Los derechos humanos son inherentes a todos los seres humanos, sin distinción alguna de nacionalidad, sexo, origen étnico, religión o cualquier otra condición. Son universales, inalienables e indivisibles, según la Declaración Universal de los Derechos Humanos."
    ];
    
    // Contadores para estadísticas
    $insertadas = 0;
    $no_encontradas = 0;
    
    echo "<h2>📊 Procesando explicaciones...</h2>";
    
    foreach ($explicaciones_ejemplo as $pregunta_id => $explicacion) {
        // Verificar si la pregunta existe
        $sql_verificar = "SELECT id FROM preguntas WHERE id = ?";
        $stmt_verificar = $pdo->prepare($sql_verificar);
        $stmt_verificar->execute([$pregunta_id]);
        $pregunta_existe = $stmt_verificar->fetch();
        
        if ($pregunta_existe) {
            // Insertar la explicación
            $sql_insertar = "UPDATE preguntas SET explicacion = ? WHERE id = ?";
            $stmt_insertar = $pdo->prepare($sql_insertar);
            $stmt_insertar->execute([$explicacion, $pregunta_id]);
            
            $insertadas++;
            echo "<p style='color: green;'>✅ Explicación insertada para pregunta ID: {$pregunta_id}</p>";
        } else {
            $no_encontradas++;
            echo "<p style='color: orange;'>⚠️ Pregunta ID: {$pregunta_id} no encontrada</p>";
        }
    }
    
    // Mostrar resumen
    echo "<h2>🎯 Resumen de la operación</h2>";
    echo "<p><strong>Explicaciones insertadas:</strong> {$insertadas}</p>";
    echo "<p><strong>Preguntas no encontradas:</strong> {$no_encontradas}</p>";
    echo "<p><strong>Total procesado:</strong> " . count($explicaciones_ejemplo) . "</p>";
    
    // Verificar el resultado final
    echo "<h2>🔍 Verificación final</h2>";
    $sql_final = "SELECT COUNT(*) as total_con_explicacion FROM preguntas WHERE explicacion IS NOT NULL AND explicacion != ''";
    $stmt_final = $pdo->query($sql_final);
    $resultado_final = $stmt_final->fetch();
    
    echo "<p style='color: blue;'><strong>Total de preguntas con explicación después de la inserción: {$resultado_final['total_con_explicacion']}</strong></p>";
    
    // Mostrar algunas explicaciones insertadas
    echo "<h2>📝 Algunas explicaciones insertadas:</h2>";
    $sql_ejemplos = "SELECT id, LEFT(pregunta_texto, 80) as pregunta_corta, LEFT(explicacion, 100) as explicacion_corta 
                     FROM preguntas 
                     WHERE explicacion IS NOT NULL AND explicacion != ''
                     LIMIT 5";
    $stmt_ejemplos = $pdo->query($sql_ejemplos);
    $ejemplos = $stmt_ejemplos->fetchAll();
    
    foreach ($ejemplos as $ejemplo) {
        echo "<div style='border: 1px solid #ccc; padding: 10px; margin: 5px;'>";
        echo "<p><strong>ID {$ejemplo['id']}:</strong> {$ejemplo['pregunta_corta']}...</p>";
        echo "<p><strong>Explicación:</strong> {$ejemplo['explicacion_corta']}...</p>";
        echo "</div>";
    }
    
    echo "<h2>🚀 Próximos pasos</h2>";
    echo "<ol>";
    echo "<li>Ejecuta nuevamente el archivo de prueba: <code>test_explicaciones_completo.php</code></li>";
    echo "<li>Prueba el simulador en <strong>Modo Estudio</strong></li>";
    echo "<li>Las preguntas con ID 1-16 ahora tendrán explicaciones reales</li>";
    echo "</ol>";
    
} catch (PDOException $e) {
    echo "<p style='color: red;'>❌ Error: " . $e->getMessage() . "</p>";
}
?>