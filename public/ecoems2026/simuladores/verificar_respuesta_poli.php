<?php
include 'config.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $pregunta_id = $data['pregunta_id'];
    $respuesta_usuario = strtoupper($data['respuesta_usuario']);
    
    try {
        // Obtener la pregunta con su respuesta correcta
        $sql = "SELECT p.*, m.nombre as materia_nombre 
                FROM preguntas_politecnico p 
                JOIN materias_politecnico m ON p.materia_id = m.id 
                WHERE p.id = ?";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$pregunta_id]);
        $pregunta = $stmt->fetch();
        
        if ($pregunta) {
            $respuesta_correcta = strtoupper($pregunta['respuesta_correcta']);
            $es_correcta = ($respuesta_usuario == $respuesta_correcta);
            
            // Devolver respuesta en formato JSON
            echo json_encode([
                'es_correcta' => $es_correcta,
                'respuesta_correcta' => $respuesta_correcta,
                'explicacion' => $pregunta['explicacion'] ?? 'Sin explicación disponible.',
                'materia' => $pregunta['materia_nombre'],
                'tema' => $pregunta['tema'] ?? 'Sin tema especificado'
            ]);
        } else {
            echo json_encode([
                'error' => 'Pregunta no encontrada'
            ]);
        }
    } catch (PDOException $e) {
        echo json_encode([
            'error' => 'Error en la consulta: ' . $e->getMessage()
        ]);
    }
}
?>