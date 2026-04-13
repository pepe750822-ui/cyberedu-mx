<?php
// verificar_respuesta.php - CON EXPLICACIONES REALES
include 'config.php';
header('Content-Type: application/json');

// Verificar que sea una solicitud POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    
    // Obtener los datos JSON de la solicitud
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    
    // Verificar que los datos necesarios estén presentes
    if (!isset($data['pregunta_id']) || !isset($data['respuesta_usuario'])) {
        echo json_encode(['error' => 'Datos incompletos']);
        exit;
    }
    
    $pregunta_id = $data['pregunta_id'];
    $respuesta_usuario = strtoupper(trim($data['respuesta_usuario'])); // Asegurar mayúsculas
    
    try {
        // Obtener la pregunta con su explicación REAL de la base de datos
        $sql = "SELECT respuesta_correcta, explicacion, pregunta_texto 
                FROM preguntas 
                WHERE id = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$pregunta_id]);
        $pregunta = $stmt->fetch();
        
        if ($pregunta) {
            // Verificar si la respuesta es correcta
            $respuesta_correcta = strtoupper(trim($pregunta['respuesta_correcta']));
            $es_correcta = ($respuesta_usuario === $respuesta_correcta);
            
            // USAR LA EXPLICACIÓN REAL DE LA BASE DE DATOS
            // Si no hay explicación en la BD, generar una contextual
            if (empty($pregunta['explicacion']) || trim($pregunta['explicacion']) === '') {
                if ($es_correcta) {
                    $explicacion = "¡Excelente! Has seleccionado la respuesta correcta ({$respuesta_usuario}). Tu comprensión del tema es adecuada. Continúa practicando para reforzar tu conocimiento.";
                } else {
                    $explicacion = "La respuesta correcta es {$respuesta_correcta}. Compara tu selección ({$respuesta_usuario}) con la respuesta correcta para identificar áreas de mejora. Te recomendamos repasar los conceptos relacionados con esta pregunta.";
                }
            } else {
                // USAR EXPLICACIÓN REAL DE LA BASE DE DATOS
                $explicacion = $pregunta['explicacion'];
                
                // Si la respuesta es incorrecta, personalizar un poco la explicación
                if (!$es_correcta) {
                    $explicacion = "Has seleccionado la opción {$respuesta_usuario}, pero la respuesta correcta es {$respuesta_correcta}. " . $explicacion;
                }
            }
            
            // Preparar y enviar la respuesta
            $respuesta = [
                'es_correcta' => $es_correcta,
                'respuesta_correcta' => $respuesta_correcta,
                'explicacion' => $explicacion,
                'pregunta_id' => $pregunta_id
            ];
            
            echo json_encode($respuesta);
            
        } else {
            // Pregunta no encontrada
            echo json_encode([
                'error' => 'Pregunta no encontrada en la base de datos',
                'pregunta_id' => $pregunta_id
            ]);
        }
        
    } catch (PDOException $e) {
        // Error de base de datos
        error_log("Error en verificar_respuesta.php: " . $e->getMessage());
        echo json_encode([
            'error' => 'Error en el servidor al verificar la respuesta',
            'detalles' => 'Por favor, intenta nuevamente'
        ]);
    }
    
} else {
    // Método no permitido
    http_response_code(405);
    echo json_encode(['error' => 'Método no permitido. Use POST.']);
}
?>