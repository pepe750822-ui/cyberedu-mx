<?php
include 'config.php';
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Panel de Administración - Politécnico</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            background: linear-gradient(135deg, #1a237e, #283593);
            color: white;
        }
        .container {
            background: rgba(255, 255, 255, 0.95);
            padding: 30px;
            border-radius: 15px;
            color: #333;
        }
        h1 {
            color: #1a237e;
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 10px;
            border-bottom: 3px solid #d50000;
        }
        .dashboard {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 40px;
        }
        .stat-card {
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            text-align: center;
            border-top: 5px solid #1a237e;
        }
        .stat-number {
            font-size: 2.5em;
            font-weight: bold;
            color: #1a237e;
            margin: 10px 0;
        }
        .stat-label {
            color: #666;
            font-size: 0.9em;
        }
        .admin-links {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin-top: 30px;
        }
        .admin-link {
            background: #1a237e;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 10px;
            text-decoration: none;
            transition: all 0.3s;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 10px;
        }
        .admin-link:hover {
            background: #283593;
            transform: translateY(-5px);
            box-shadow: 0 10px 20px rgba(0,0,0,0.2);
        }
        .admin-icon {
            font-size: 2em;
        }
        .admin-title {
            font-weight: bold;
            font-size: 1.1em;
        }
        .admin-desc {
            font-size: 0.9em;
            opacity: 0.8;
        }
        .btn-primary {
            background: #d50000;
            color: white;
            padding: 12px 25px;
            border: none;
            border-radius: 5px;
            font-size: 16px;
            cursor: pointer;
            display: inline-block;
            text-decoration: none;
            margin-top: 20px;
        }
        .btn-primary:hover {
            background: #ff1744;
        }
        .table-container {
            overflow-x: auto;
            margin-top: 30px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            background: white;
        }
        th {
            background: #1a237e;
            color: white;
            padding: 12px;
            text-align: left;
        }
        td {
            padding: 10px;
            border-bottom: 1px solid #ddd;
        }
        tr:hover {
            background: #f5f5f5;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>⚙️ Panel de Administración - Simulador Politécnico</h1>
        
        <?php
        try {
            // Estadísticas de materias
            $sql_materias = "SELECT COUNT(*) as total FROM materias_politecnico";
            $stmt_materias = $pdo->query($sql_materias);
            $materias_count = $stmt_materias->fetch();
            
            // Estadísticas de preguntas
            $sql_preguntas = "SELECT 
                COUNT(*) as total,
                COUNT(DISTINCT guia_year) as guias,
                COUNT(DISTINCT materia_id) as materias_con_preguntas
                FROM preguntas_politecnico";
            $stmt_preguntas = $pdo->query($sql_preguntas);
            $preguntas_stats = $stmt_preguntas->fetch();
            
            // Últimas preguntas
            $sql_ultimas = "SELECT p.*, m.nombre as materia_nombre 
                           FROM preguntas_politecnico p 
                           JOIN materias_politecnico m ON p.materia_id = m.id 
                           ORDER BY p.id DESC LIMIT 5";
            $stmt_ultimas = $pdo->query($sql_ultimas);
            $ultimas_preguntas = $stmt_ultimas->fetchAll();
        } catch (PDOException $e) {
            $error = $e->getMessage();
        }
        ?>
        
        <div class="dashboard">
            <div class="stat-card">
                <div class="admin-icon">📚</div>
                <div class="stat-number"><?= $materias_count['total'] ?? 0 ?></div>
                <div class="stat-label">Materias Registradas</div>
            </div>
            
            <div class="stat-card">
                <div class="admin-icon">❓</div>
                <div class="stat-number"><?= $preguntas_stats['total'] ?? 0 ?></div>
                <div class="stat-label">Total de Preguntas</div>
            </div>
            
            <div class="stat-card">
                <div class="admin-icon">📅</div>
                <div class="stat-number"><?= $preguntas_stats['guias'] ?? 0 ?></div>
                <div class="stat-label">Guías Disponibles</div>
            </div>
            
            <div class="stat-card">
                <div class="admin-icon">🎯</div>
                <div class="stat-number"><?= $preguntas_stats['materias_con_preguntas'] ?? 0 ?></div>
                <div class="stat-label">Materias con Preguntas</div>
            </div>
        </div>
        
        <div class="admin-links">
            <a href="agregar_pregunta_poli.php" class="admin-link">
                <div class="admin-icon">➕</div>
                <div class="admin-title">Agregar Pregunta</div>
                <div class="admin-desc">Añade una nueva pregunta al banco</div>
            </a>
            
            <a href="insertar_materias_poli.php" class="admin-link">
                <div class="admin-icon">📚</div>
                <div class="admin-title">Gestionar Materias</div>
                <div class="admin-desc">Ver y agregar materias</div>
            </a>
            
            <a href="insertar_preguntas_ejemplo_poli.php" class="admin-link">
                <div class="admin-icon">📝</div>
                <div class="admin-title">Insertar Ejemplos</div>
                <div class="admin-desc">Agrega preguntas de ejemplo</div>
            </a>
            
            <a href="simulador_politecnico.php" class="admin-link">
                <div class="admin-icon">🎓</div>
                <div class="admin-title">Probar Simulador</div>
                <div class="admin-desc">Usa el simulador como estudiante</div>
            </a>
        </div>
        
        <?php if (isset($ultimas_preguntas) && !empty($ultimas_preguntas)): ?>
        <div class="table-container">
            <h3>📋 Últimas Preguntas Agregadas</h3>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Guía</th>
                        <th># Pregunta</th>
                        <th>Materia</th>
                        <th>Tema</th>
                        <th>Pregunta</th>
                        <th>Respuesta</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($ultimas_preguntas as $pregunta): ?>
                    <tr>
                        <td><?= $pregunta['id'] ?></td>
                        <td><?= $pregunta['guia_year'] ?></td>
                        <td><?= $pregunta['numero_pregunta'] ?></td>
                        <td><?= $pregunta['materia_nombre'] ?></td>
                        <td><?= $pregunta['tema'] ?? '---' ?></td>
                        <td><?= substr($pregunta['pregunta_texto'], 0, 50) ?>...</td>
                        <td><strong><?= $pregunta['respuesta_correcta'] ?></strong></td>
                    </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>
        <?php endif; ?>
        
        <div style="text-align: center; margin-top: 40px;">
            <a href="simulador_politecnico.php" class="btn-primary">
                🚀 Ir al Simulador Principal
            </a>
        </div>
    </div>
</body>
</html>