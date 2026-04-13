<?php
include 'config.php';

// Obtener materias disponibles
$materias = [];
try {
    $sql = "SELECT id, nombre FROM materias_politecnico ORDER BY nombre";
    $stmt = $pdo->query($sql);
    $materias = $stmt->fetchAll(PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    die("Error al obtener materias: " . $e->getMessage());
}

// Procesar el formulario
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $guia_year = $_POST['guia_year'];
    $numero_pregunta = $_POST['numero_pregunta'];
    $materia_id = $_POST['materia_id'];
    $pregunta_texto = $_POST['pregunta_texto'];
    $opcion_a = $_POST['opcion_a'];
    $opcion_b = $_POST['opcion_b'];
    $opcion_c = $_POST['opcion_c'];
    $opcion_d = $_POST['opcion_d'];
    $respuesta_correcta = $_POST['respuesta_correcta'];
    $explicacion = $_POST['explicacion'];
    $tema = $_POST['tema'];
    
    try {
        $sql = "INSERT INTO preguntas_politecnico 
                (guia_year, numero_pregunta, materia_id, pregunta_texto, 
                 opcion_a, opcion_b, opcion_c, opcion_d, respuesta_correcta, explicacion, tema) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            $guia_year, $numero_pregunta, $materia_id, $pregunta_texto,
            $opcion_a, $opcion_b, $opcion_c, $opcion_d, 
            $respuesta_correcta, $explicacion, $tema
        ]);
        
        $success = "✅ Pregunta agregada correctamente!";
    } catch (PDOException $e) {
        $error = "❌ Error: " . $e->getMessage();
    }
}
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Agregar Pregunta - Politécnico</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background: #f5f5f5;
        }
        .container {
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        h1 {
            color: #1a237e;
            border-bottom: 2px solid #d50000;
            padding-bottom: 10px;
        }
        .form-group {
            margin-bottom: 20px;
        }
        label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
            color: #333;
        }
        input[type="text"], textarea, select {
            width: 100%;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 5px;
            font-size: 16px;
        }
        textarea {
            height: 100px;
            resize: vertical;
        }
        .radio-group {
            display: flex;
            gap: 20px;
            margin: 10px 0;
        }
        .radio-option {
            display: flex;
            align-items: center;
            gap: 5px;
        }
        .btn {
            background: #1a237e;
            color: white;
            padding: 12px 30px;
            border: none;
            border-radius: 5px;
            font-size: 16px;
            cursor: pointer;
            transition: background 0.3s;
        }
        .btn:hover {
            background: #283593;
        }
        .success {
            background: #d4edda;
            color: #155724;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 20px;
            border-left: 4px solid #28a745;
        }
        .error {
            background: #f8d7da;
            color: #721c24;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 20px;
            border-left: 4px solid #dc3545;
        }
        .nav-links {
            margin-top: 30px;
            display: flex;
            gap: 10px;
        }
        .nav-links a {
            padding: 10px 15px;
            background: #1a237e;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            font-size: 14px;
        }
        .nav-links a:hover {
            background: #283593;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>➕ Agregar Nueva Pregunta - Politécnico</h1>
        
        <?php if (isset($success)): ?>
            <div class="success"><?= $success ?></div>
        <?php endif; ?>
        
        <?php if (isset($error)): ?>
            <div class="error"><?= $error ?></div>
        <?php endif; ?>
        
        <form method="POST" action="">
            <div class="form-group">
                <label for="guia_year">📅 Año de la Guía:</label>
                <select name="guia_year" id="guia_year" required>
                    <option value="2025">2025 - Guía IPN 2025</option>
                    <option value="2026">2026 - Guía IPN 2026</option>
                </select>
            </div>
            
            <div class="form-group">
                <label for="numero_pregunta">🔢 Número de Pregunta:</label>
                <input type="number" name="numero_pregunta" id="numero_pregunta" min="1" required>
            </div>
            
            <div class="form-group">
                <label for="materia_id">📖 Materia:</label>
                <select name="materia_id" id="materia_id" required>
                    <option value="">-- Selecciona una materia --</option>
                    <?php foreach ($materias as $materia): ?>
                        <option value="<?= $materia['id'] ?>"><?= $materia['nombre'] ?></option>
                    <?php endforeach; ?>
                </select>
            </div>
            
            <div class="form-group">
                <label for="tema">🏷️ Tema (opcional):</label>
                <input type="text" name="tema" id="tema" placeholder="Ej: Álgebra, Biología celular, etc.">
            </div>
            
            <div class="form-group">
                <label for="pregunta_texto">❓ Texto de la Pregunta:</label>
                <textarea name="pregunta_texto" id="pregunta_texto" required></textarea>
            </div>
            
            <div class="form-group">
                <label>📝 Opciones:</label>
                <div style="display: grid; grid-template-columns: 1fr; gap: 10px;">
                    <input type="text" name="opcion_a" placeholder="Opción A" required>
                    <input type="text" name="opcion_b" placeholder="Opción B" required>
                    <input type="text" name="opcion_c" placeholder="Opción C" required>
                    <input type="text" name="opcion_d" placeholder="Opción D" required>
                </div>
            </div>
            
            <div class="form-group">
                <label>✅ Respuesta Correcta:</label>
                <div class="radio-group">
                    <div class="radio-option">
                        <input type="radio" name="respuesta_correcta" value="A" id="respuesta_a" required>
                        <label for="respuesta_a">A</label>
                    </div>
                    <div class="radio-option">
                        <input type="radio" name="respuesta_correcta" value="B" id="respuesta_b">
                        <label for="respuesta_b">B</label>
                    </div>
                    <div class="radio-option">
                        <input type="radio" name="respuesta_correcta" value="C" id="respuesta_c">
                        <label for="respuesta_c">C</label>
                    </div>
                    <div class="radio-option">
                        <input type="radio" name="respuesta_correcta" value="D" id="respuesta_d">
                        <label for="respuesta_d">D</label>
                    </div>
                </div>
            </div>
            
            <div class="form-group">
                <label for="explicacion">💡 Explicación (opcional):</label>
                <textarea name="explicacion" id="explicacion" placeholder="Explica por qué esta es la respuesta correcta..."></textarea>
            </div>
            
            <button type="submit" class="btn">💾 Guardar Pregunta</button>
        </form>
        
        <div class="nav-links">
            <a href="simulador_politecnico.php">🎓 Ir al Simulador</a>
            <a href="insertar_materias_poli.php">📚 Insertar Materias</a>
            <a href="insertar_preguntas_ejemplo_poli.php">📝 Insertar Ejemplos</a>
        </div>
    </div>
</body>
</html>