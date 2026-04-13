<?php
include 'config.php';

$materia_nombre = $_GET['materia'] ?? 'Matemáticas';

// Obtener ID de la materia
$stmt_mid = $pdo->prepare("SELECT id FROM materias_politecnico WHERE nombre = ?");
$stmt_mid->execute([$materia_nombre]);
$mid = $stmt_mid->fetchColumn();

if (!$mid) {
    die("Error: Materia no encontrada.");
}

// Obtener las preguntas en orden
$sql = "SELECT * FROM preguntas_politecnico 
        WHERE guia_year = 2025 AND materia_id = ? 
        ORDER BY numero_pregunta ASC";
$stmt = $pdo->prepare($sql);
$stmt->execute([$mid]);
$preguntas = $stmt->fetchAll();

echo "<!DOCTYPE html>
<html lang='es'>
<head>
    <meta charset='UTF-8'>
    <title>Verificación: $materia_nombre 2025</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f0f2f5; padding: 20px; }
        .container { max-width: 1000px; margin: 0 auto; background: white; padding: 30px; border-radius: 15px; box-shadow: 0 5px 15px rgba(0,0,0,0.1); }
        h1 { color: #1a237e; border-bottom: 3px solid #d50000; padding-bottom: 10px; display: flex; justify-content: space-between; align-items: center; }
        .nav-tabs { margin-bottom: 20px; }
        .nav-tabs a { text-decoration: none; padding: 10px 20px; background: #e0e0e0; color: #333; border-radius: 5px 5px 0 0; margin-right: 5px; }
        .nav-tabs a.active { background: #1a237e; color: white; }
        .pregunta-card { border: 1px solid #e0e0e0; border-radius: 10px; margin-bottom: 25px; padding: 20px; background: #fafafa; }
        .numero { background: #d50000; color: white; padding: 5px 12px; border-radius: 20px; font-weight: bold; margin-right: 10px; }
        .tema { color: #5c6bc0; font-weight: bold; font-size: 0.9em; text-transform: uppercase; }
        .texto { font-size: 1.2em; margin: 15px 0; color: #333; }
        .opciones { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 15px; }
        .opcion { padding: 10px; border: 1px solid #ddd; border-radius: 5px; background: white; }
        .opcion.correcta { background: #e8f5e9; border-color: #2e7d32; }
        .explicacion { background: #e3f2fd; padding: 15px; border-radius: 8px; border-left: 5px solid #1a237e; font-style: italic; }
        .btn-link { display: inline-block; background: #1a237e; color: white; padding: 15px 25px; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 20px; }
    </style>
</head>
<body>
<div class='container'>
    <div class='nav-tabs'>
        <a href='?materia=Matemáticas' class='" . ($materia_nombre == 'Matemáticas' ? 'active' : '') . "'>🧮 Matemáticas</a>
        <a href='?materia=Física' class='" . ($materia_nombre == 'Física' ? 'active' : '') . "'>⚡ Física</a>
        <a href='?materia=Biología' class='" . ($materia_nombre == 'Biología' ? 'active' : '') . "'>🌿 Biología</a>
        <a href='?materia=Química' class='" . ($materia_nombre == 'Química' ? 'active' : '') . "'>🧪 Química</a>
    </div>
    <h1>🛡️ Verificación: $materia_nombre Oficial 2025</h1>
    <p>Revisa que el contenido sea el correcto. Hay <strong>" . count($preguntas) . "</strong> preguntas en esta materia.</p>";

foreach ($preguntas as $p) {
    $exp = $p['explicacion'] ?? $p['explicación'] ?? 'Sin explicación';

    echo "<div class='pregunta-card'>
        <span class='numero'>#{$p['numero_pregunta']}</span>
        <span class='tema'>{$p['tema']}</span>
        <div class='texto'>" . nl2br(htmlspecialchars($p['pregunta_texto'])) . "</div>
        <div class='opciones'>
            <div class='opcion " . ($p['respuesta_correcta'] == 'A' ? 'correcta' : '') . "'><strong>A)</strong> " . htmlspecialchars($p['opcion_a']) . "</div>
            <div class='opcion " . ($p['respuesta_correcta'] == 'B' ? 'correcta' : '') . "'><strong>B)</strong> " . htmlspecialchars($p['opcion_b']) . "</div>
            <div class='opcion " . ($p['respuesta_correcta'] == 'C' ? 'correcta' : '') . "'><strong>C)</strong> " . htmlspecialchars($p['opcion_c']) . "</div>
            <div class='opcion " . ($p['respuesta_correcta'] == 'D' ? 'correcta' : '') . "'><strong>D)</strong> " . htmlspecialchars($p['opcion_d']) . "</div>
        </div>
        <div class='explicacion'>
            <strong>Explicación:</strong><br>{$exp}
        </div>
    </div>";
}

echo "<div style='text-align: center;'>
    <a href='simulador_politecnico.php?materias[]=$materia_nombre&guia_years[]=2025&limit=30&modo=estudio&orden=secuencial' class='btn-link'>🚀 Probar en el Simulador</a>
</div>
</div>
</body>
</html>";
?>