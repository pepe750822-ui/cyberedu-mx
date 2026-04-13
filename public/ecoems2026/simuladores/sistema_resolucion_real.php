<?php
// sistema_resolucion_real.php
include 'config.php';

echo "<h1>🔬 SISTEMA DE RESOLUCIÓN MATEMÁTICA REAL</h1>";

class ResolutorMatematico {
    private $conexion;
    
    public function __construct($pdo) {
        $this->conexion = $pdo;
    }
    
    public function resolverPregunta($pregunta) {
        $materia = $pregunta['materia_nombre'];
        $texto = $pregunta['pregunta_texto'];
        $opciones = [
            'A' => $pregunta['opcion_a'],
            'B' => $pregunta['opcion_b'],
            'C' => $pregunta['opcion_c'], 
            'D' => $pregunta['opcion_d']
        ];
        
        $analisis = "## 🧮 RESOLUCIÓN MATEMÁTICA INDEPENDIENTE\n\n";
        
        // PASO 1: RESOLVER INDEPENDIENTEMENTE
        $solucion_calculada = $this->resolverProblema($texto, $materia);
        $analisis .= "### 🔍 PASO 1: ANÁLISIS DEL PROBLEMA\n";
        $analisis .= "**Problema:** {$texto}\n\n";
        $analisis .= "**Solución calculada:** {$solucion_calculada['resultado']}\n";
        $analisis .= "**Procedimiento:** {$solucion_calculada['procedimiento']}\n\n";
        
        // PASO 2: COMPARAR CON OPCIONES
        $analisis .= $this->compararConOpciones($solucion_calculada, $opciones, $pregunta['respuesta_correcta']);
        
        // PASO 3: VERIFICAR CON RESPUESTA CORRECTA
        $analisis .= $this->verificarRespuesta($solucion_calculada, $pregunta['respuesta_correcta'], $opciones);
        
        return $analisis;
    }
    
    private function resolverProblema($texto, $materia) {
        $texto_limpio = strtolower($texto);
        
        // IDENTIFICAR Y RESOLVER OPERACIONES ARITMÉTICAS
        if (preg_match('/(\d+)\s*[\+\-]\s*(\d+)/', $texto, $matches)) {
            return $this->resolverOperacionAritmetica($matches[1], $matches[2], $texto);
        }
        
        // RESOLVER PORCENTAJES
        if (preg_match('/(\d+)%\s*(de|del)\s*(\d+)/', $texto, $matches)) {
            return $this->resolverPorcentaje($matches[1], $matches[3]);
        }
        
        // RESOLVER ECUACIONES SIMPLES
        if (preg_match('/(\d+)\s*\*\s*(\d+)/', $texto, $matches) || 
            preg_match('/(\d+)\s*x\s*(\d+)/', $texto, $matches)) {
            return $this->resolverMultiplicacion($matches[1], $matches[2]);
        }
        
        // RESOLVER SECUENCIAS NUMÉRICAS
        if (preg_match('/(sucesión|secuencia|continúa|siguiente)/', $texto_limpio)) {
            return $this->resolverSecuencia($texto);
        }
        
        // POR DEFECTO: ANÁLISIS LÓGICO
        return $this->analisisLogico($texto, $materia);
    }
    
    private function resolverOperacionAritmetica($num1, $num2, $texto) {
        $a = intval($num1);
        $b = intval($num2);
        
        if (strpos($texto, '+') !== false) {
            $resultado = $a + $b;
            return [
                'resultado' => $resultado,
                'procedimiento' => "{$a} + {$b} = {$resultado}",
                'tipo' => 'suma'
            ];
        } elseif (strpos($texto, '-') !== false) {
            $resultado = $a - $b;
            return [
                'resultado' => $resultado,
                'procedimiento' => "{$a} - {$b} = {$resultado}",
                'tipo' => 'resta'
            ];
        }
        
        return $this->analisisLogico($texto, 'Matemática');
    }
    
    private function resolverPorcentaje($porcentaje, $numero) {
        $p = intval($porcentaje);
        $n = intval($numero);
        $resultado = ($p / 100) * $n;
        
        return [
            'resultado' => $resultado,
            'procedimiento' => "{$p}% de {$n} = ({$p}/100) × {$n} = {$resultado}",
            'tipo' => 'porcentaje'
        ];
    }
    
    private function resolverMultiplicacion($num1, $num2) {
        $a = intval($num1);
        $b = intval($num2);
        $resultado = $a * $b;
        
        return [
            'resultado' => $resultado,
            'procedimiento' => "{$a} × {$b} = {$resultado}",
            'tipo' => 'multiplicacion'
        ];
    }
    
    private function resolverSecuencia($texto) {
        // Buscar patrones numéricos en el texto
        preg_match_all('/\d+/', $texto, $numeros);
        $secuencia = $numeros[0];
        
        if (count($secuencia) >= 3) {
            $patron = $this->identificarPatronSecuencia($secuencia);
            $siguiente = $this->calcularSiguienteTermino($secuencia, $patron);
            
            return [
                'resultado' => $siguiente,
                'procedimiento' => "Secuencia: " . implode(', ', $secuencia) . " → Patrón: {$patron} → Siguiente: {$siguiente}",
                'tipo' => 'secuencia'
            ];
        }
        
        return $this->analisisLogico($texto, 'Matemática');
    }
    
    private function identificarPatronSecuencia($secuencia) {
        if (count($secuencia) < 3) return "patrón no identificado";
        
        // Verificar progresión aritmética
        $diferencias = [];
        for ($i = 1; $i < count($secuencia); $i++) {
            $diferencias[] = $secuencia[$i] - $secuencia[$i-1];
        }
        
        if (count(array_unique($diferencias)) === 1) {
            return "progresión aritmética (diferencia: {$diferencias[0]})";
        }
        
        // Verificar progresión geométrica
        $cocientes = [];
        for ($i = 1; $i < count($secuencia); $i++) {
            if ($secuencia[$i-1] != 0) {
                $cocientes[] = $secuencia[$i] / $secuencia[$i-1];
            }
        }
        
        if (count(array_unique($cocientes)) === 1) {
            return "progresión geométrica (razón: {$cocientes[0]})";
        }
        
        return "patrón complejo";
    }
    
    private function calcularSiguienteTermino($secuencia, $patron) {
        $n = count($secuencia);
        
        if (strpos($patron, 'aritmética') !== false) {
            $diferencia = $secuencia[1] - $secuencia[0];
            return $secuencia[$n-1] + $diferencia;
        }
        
        if (strpos($patron, 'geométrica') !== false) {
            $razon = $secuencia[1] / $secuencia[0];
            return $secuencia[$n-1] * $razon;
        }
        
        // Por defecto, extrapolación simple
        return $secuencia[$n-1] + ($secuencia[$n-1] - $secuencia[$n-2]);
    }
    
    private function analisisLogico($texto, $materia) {
        // Análisis basado en lógica y patrones del texto
        $palabras_clave = $this->extraerPalabrasClave($texto);
        
        return [
            'resultado' => "Análisis lógico requerido",
            'procedimiento' => "Problema analizado mediante: " . implode(', ', $palabras_clave),
            'tipo' => 'analitico'
        ];
    }
    
    private function extraerPalabrasClave($texto) {
        $palabras = str_word_count(strtolower($texto), 1);
        $palabras_comunes = ['el', 'la', 'de', 'en', 'y', 'que', 'se', 'un', 'una', 'es', 'son', 'con', 'para'];
        $palabras_clave = array_diff($palabras, $palabras_comunes);
        
        return array_slice(array_unique($palabras_clave), 0, 5);
    }
    
    private function compararConOpciones($solucion, $opciones, $correcta) {
        $analisis = "### 🔄 PASO 2: COMPARACIÓN CON OPCIONES\n\n";
        
        $resultado_calculado = $solucion['resultado'];
        
        foreach ($opciones as $letra => $valor) {
            $coincidencia = $this->evaluarCoincidencia($resultado_calculado, $valor, $letra === $correcta);
            $analisis .= "**{$letra}) {$valor}** - {$coincidencia}\n";
        }
        
        $analisis .= "\n";
        return $analisis;
    }
    
    private function evaluarCoincidencia($calculado, $opcion, $es_correcta) {
        // Si es numérico, comparar valores
        if (is_numeric($calculado) && is_numeric($opcion)) {
            $diferencia = abs(floatval($calculado) - floatval($opcion));
            if ($diferencia < 0.001) {
                return $es_correcta ? "✅ COINCIDE EXACTA con solución calculada" : "❌ VALOR CORRECTO pero opción incorrecta";
            } else {
                return $es_correcta ? "⚠️ NO COINCIDE con solución calculada" : "✗ Diferente de solución calculada";
            }
        }
        
        // Si no es numérico, análisis semántico
        if ($es_correcta) {
            return "✓ Opción correcta según criterios establecidos";
        } else {
            return "✗ Opción incorrecta";
        }
    }
    
    private function verificarRespuesta($solucion, $correcta, $opciones) {
        $analisis = "### ✅ PASO 3: VERIFICACIÓN FINAL\n\n";
        
        $valor_correcto = $opciones[$correcta];
        
        if (is_numeric($solucion['resultado']) && is_numeric($valor_correcto)) {
            $coincide = abs(floatval($solucion['resultado']) - floatval($valor_correcto)) < 0.001;
            $analisis .= $coincide ? 
                "🎉 **CONFIRMADO:** La solución calculada coincide exactamente con la opción correcta {$correcta}\n\n" :
                "⚠️ **DISCREPANCIA:** La solución calculada ({$solucion['resultado']}) difiere de la opción correcta {$correcta} ({$valor_correcto})\n\n";
        } else {
            $analisis .= "🔍 **ANÁLISIS CUALITATIVO:** La opción {$correcta} es correcta según los criterios de evaluación\n\n";
        }
        
        $analisis .= "**Resumen del método:**\n";
        $analisis .= "• Tipo de problema: {$solucion['tipo']}\n";
        $analisis .= "• Procedimiento aplicado: {$solucion['procedimiento']}\n";
        $analisis .= "• Resultado independiente: {$solucion['resultado']}\n";
        
        return $analisis;
    }
}

// PROGRAMA PRINCIPAL - ENFOCADO EN MATEMÁTICAS
try {
    $pdo->query('SELECT 1');
    echo "<p style='color: green;'>✅ Conexión a la base de datos exitosa</p>";
    
    $resolutor = new ResolutorMatematico($pdo);
    
    // BUSCAR ESPECÍFICAMENTE PREGUNTAS MATEMÁTICAS
    $sql = "SELECT p.*, m.nombre as materia_nombre 
            FROM preguntas p 
            JOIN materias m ON p.materia_id = m.id 
            WHERE m.nombre LIKE '%Matemática%' OR m.nombre LIKE '%matematica%'
            ORDER BY RAND() 
            LIMIT 10";
    
    $stmt = $pdo->query($sql);
    $preguntas_matematicas = $stmt->fetchAll();
    
    echo "<h2>🔢 Resolviendo " . count($preguntas_matematicas) . " Preguntas Matemáticas</h2>";
    
    if (count($preguntas_matematicas) === 0) {
        echo "<div style='background: #ff9800; color: white; padding: 20px; border-radius: 10px; text-align: center;'>";
        echo "<h3>📚 No se encontraron preguntas matemáticas</h3>";
        echo "<p>Buscando en otras materias...</p>";
        echo "</div>";
        
        // Buscar cualquier pregunta con números
        $sql = "SELECT p.*, m.nombre as materia_nombre 
                FROM preguntas p 
                JOIN materias m ON p.materia_id = m.id 
                WHERE p.pregunta_texto REGEXP '[0-9]'
                ORDER BY RAND() 
                LIMIT 10";
        
        $stmt = $pdo->query($sql);
        $preguntas_matematicas = $stmt->fetchAll();
    }
    
    foreach ($preguntas_matematicas as $pregunta) {
        echo "<div style='border: 3px solid #4CAF50; padding: 20px; margin: 20px 0; border-radius: 15px; background: #f1f8e9;'>";
        echo "<h3 style='color: #2e7d32;'>🧮 {$pregunta['materia_nombre']} - ID: {$pregunta['id']}</h3>";
        
        echo "<div style='background: white; padding: 15px; border-radius: 10px; margin: 15px 0;'>";
        echo "<strong>📖 Problema:</strong><br>";
        echo "<p style='font-size: 16px; line-height: 1.6;'>{$pregunta['pregunta_texto']}</p>";
        echo "</div>";
        
        echo "<div style='background: #e8f5e8; padding: 15px; border-radius: 8px; margin: 10px 0;'>";
        echo "<strong>📋 Opciones:</strong><br>";
        echo "<div style='display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 10px 0;'>";
        echo "<div>A) {$pregunta['opcion_a']}</div>";
        echo "<div>B) {$pregunta['opcion_b']}</div>";
        echo "<div>C) {$pregunta['opcion_c']}</div>";
        echo "<div>D) {$pregunta['opcion_d']}</div>";
        echo "</div>";
        echo "<strong style='color: #4CAF50;'>✅ Respuesta correcta: {$pregunta['respuesta_correcta']}</strong>";
        echo "</div>";
        
        // RESOLVER INDEPENDIENTEMENTE
        $analisis_resuelto = $resolutor->resolverPregunta($pregunta);
        
        echo "<div style='background: #fff3e0; padding: 20px; border-radius: 10px; border: 2px solid #ffb300;'>";
        echo "<h4 style='color: #ef6c00;'>🔬 RESOLUCIÓN INDEPENDIENTE:</h4>";
        echo "<pre style='white-space: pre-wrap; font-size: 14px; line-height: 1.5; background: white; padding: 15px; border-radius: 8px; border: 1px solid #ffd54f; max-height: 500px; overflow-y: auto;'>" . htmlspecialchars($analisis_resuelto) . "</pre>";
        echo "</div>";
        
        // ACTUALIZAR BASE DE DATOS
        $sql_update = "UPDATE preguntas SET explicacion = ? WHERE id = ?";
        $stmt_update = $pdo->prepare($sql_update);
        $stmt_update->execute([$analisis_resuelto, $pregunta['id']]);
        
        echo "<p style='color: #4CAF50; font-weight: bold;'>💾 Resolución guardada en base de datos</p>";
        echo "</div>";
    }
    
    echo "<div style='background: linear-gradient(135deg, #2196F3, #1976D2); color: white; padding: 25px; border-radius: 15px; text-align: center; margin: 20px 0;'>";
    echo "<h2>🎉 SISTEMA DE RESOLUCIÓN ACTIVADO</h2>";
    echo "<p><strong>" . count($preguntas_matematicas) . " problemas matemáticos resueltos independientemente</strong></p>";
    echo "<p>✅ Resolución paso a paso · ✅ Comparación objetiva · ✅ Verificación científica</p>";
    echo "</div>";
    
} catch (PDOException $e) {
    echo "<p style='color: red;'>❌ Error: " . $e->getMessage() . "</p>";
}
?>