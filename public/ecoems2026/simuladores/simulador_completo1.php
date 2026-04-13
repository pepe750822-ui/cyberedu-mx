<?php
// simulador_multi_guia.php - CON EXPLICACIONES REALES
include 'config.php';
session_start();

// Inicializar estadísticas de sesión si no existen
if (!isset($_SESSION['estadisticas_usuario'])) {
    $_SESSION['estadisticas_usuario'] = [
        'total_preguntas' => 0,
        'correctas' => 0,
        'incorrectas' => 0,
        'mejor_porcentaje' => 0,
        'sesiones_completadas' => 0
    ];
}

// Obtener todas las guías disponibles
try {
    $guias_sql = "SELECT id, year, nombre, activa, es_proxima FROM guias ORDER BY year DESC";
    $guias_stmt = $pdo->query($guias_sql);
    $guias = $guias_stmt->fetchAll();
} catch (PDOException $e) {
    $guias = [
        ['id' => 1, 'year' => 2025, 'nombre' => 'Ecoems 2025', 'activa' => 1, 'es_proxima' => 0],
        ['id' => 2, 'year' => 2024, 'nombre' => 'UNAM 2024', 'activa' => 1, 'es_proxima' => 0],
        ['id' => 3, 'year' => 2023, 'nombre' => 'UNAM 2023', 'activa' => 1, 'es_proxima' => 0],
        ['id' => 4, 'year' => 2022, 'nombre' => 'UNAM 2022', 'activa' => 1, 'es_proxima' => 0],
        ['id' => 5, 'year' => 2021, 'nombre' => 'UNAM 2021', 'activa' => 1, 'es_proxima' => 0]
    ];
}

// Filtrar para excluir guías del 2020
$guias = array_filter($guias, function($guia) {
    return $guia['year'] != 2020;
});

// Lista completa de materias UNAM (basado en Ecoems)
$todas_materias = [
    'Habilidad Matemática',
    'Ciencias I (Biología)',
    'Español',
    'Ciencias III (Química)',
    'Historia',
    'Matemáticas',
    'Habilidad verbal',
    'Geografía',
    'Ciencias II (Física)',
    'Formación cívica y ética'
];

// Parámetros con valores por defecto
$materias_seleccionadas = $_GET['materias'] ?? $todas_materias; // Ahora es un array
$guia_years = $_GET['guia_years'] ?? [2025];
$limit = $_GET['limit'] ?? 10;
$modo = $_GET['modo'] ?? 'estudio';
$tipo_simulacion = $_GET['tipo_simulacion'] ?? 'personalizada'; // Nueva opción

// Convertir a array si es un solo valor
if (!is_array($guia_years)) {
    $guia_years = [$guia_years];
}

// Convertir materias a array si viene como string
if (!is_array($materias_seleccionadas)) {
    $materias_seleccionadas = explode(',', $materias_seleccionadas);
}

// Si no hay materias seleccionadas (primera carga), seleccionar todas
if (empty($materias_seleccionadas) || (count($materias_seleccionadas) === 1 && $materias_seleccionadas[0] === '')) {
    $materias_seleccionadas = $todas_materias;
}

// Si es simulación completa Ecoems (128 preguntas), ajustar límite
if ($tipo_simulacion == 'completa_ecoems') {
    $limit = 128;
    $modo = 'examen'; // Forzar modo examen para la simulación completa
}

// Obtener estadísticas del banco
try {
    $stats_sql = "SELECT COUNT(*) as total_preguntas FROM preguntas";
    $stats_stmt = $pdo->query($stats_sql);
    $estadisticas = $stats_stmt->fetch();
} catch (PDOException $e) {
    $estadisticas = ['total_preguntas' => '1200+'];
}

// Obtener preguntas según los parámetros - CONSULTA ACTUALIZADA
$preguntas = [];
$error_message = '';

if (!empty($guia_years) && !empty($materias_seleccionadas)) {
    try {
        // CONSULTA ACTUALIZADA - Incluir campo explicacion y filtrar por múltiples materias
        $sql = "SELECT p.*, m.nombre as materia_nombre, p.guia_year as guia_year,
                       p.explicacion as explicacion
                FROM preguntas p 
                JOIN materias m ON p.materia_id = m.id 
                WHERE p.guia_year IN (" . implode(',', array_fill(0, count($guia_years), '?')) . ")";
        
        $params = $guia_years;
        
        if (!empty($materias_seleccionadas)) {
            // Construir condiciones para cada materia seleccionada
            $materias_conditions = [];
            foreach ($materias_seleccionadas as $materia) {
                if ($materia == 'Historia') {
                    $materias_conditions[] = "(m.nombre LIKE 'Historia%' OR m.nombre = 'Historia')";
                } else {
                    $materias_conditions[] = "m.nombre = ?";
                    $params[] = $materia;
                }
            }
            
            if (!empty($materias_conditions)) {
                $sql .= " AND (" . implode(' OR ', $materias_conditions) . ")";
            }
        }
        
        $sql .= " ORDER BY RAND() LIMIT ?";
        $params[] = (int)$limit;
        
        $stmt = $pdo->prepare($sql);
        
        foreach ($params as $key => $value) {
            if ($key === count($params) - 1) {
                $stmt->bindValue($key + 1, $value, PDO::PARAM_INT);
            } else {
                $stmt->bindValue($key + 1, $value);
            }
        }
        
        $stmt->execute();
        $preguntas = $stmt->fetchAll();
        
    } catch (PDOException $e) {
        $error_message = "Error en la consulta: " . $e->getMessage();
    }
}

// Array de guías disponibles para descarga
$guias_descarga = [
    ['year' => 2021, 'nombre' => 'UNAM 2021', 'archivo' => 'unam2021.pdf', 'disponible' => true],
    ['year' => 2022, 'nombre' => 'UNAM 2022', 'archivo' => 'unam2022.pdf', 'disponible' => true],
    ['year' => 2023, 'nombre' => 'UNAM 2023', 'archivo' => 'unam2023.pdf', 'disponible' => true],
    ['year' => 2024, 'nombre' => 'UNAM 2024', 'archivo' => 'unam2024.pdf', 'disponible' => true],
    ['year' => 2025, 'nombre' => 'Ecoems 2025', 'archivo' => 'ecoems2025.pdf', 'disponible' => true],
    ['year' => 2026, 'nombre' => 'Ecoems 2026', 'archivo' => 'ecoems2026.pdf', 'disponible' => false],
];

// Calcular tiempo para modo examen (128 preguntas = 3 horas = 180 minutos)
$tiempo_por_pregunta = 180 / 128; // minutos por pregunta
$tiempo_examen_minutos = ceil(count($preguntas) * $tiempo_por_pregunta);
$tiempo_examen_segundos = $tiempo_examen_minutos * 60;
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CyberEdu MX - Simulador Multi-Guía UNAM</title>
    <style>
        /* ESTILOS BASE - MANTENIDOS */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            overflow: hidden;
        }

        .header {
            background: linear-gradient(135deg, #8e44ad, #9b59b6);
            color: white;
            padding: 40px 30px;
            text-align: center;
            position: relative;
        }

        .cyberedu-badge {
            position: absolute;
            top: 20px;
            left: 30px;
            background: rgba(255,255,255,0.2);
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 0.9em;
            font-weight: bold;
            backdrop-filter: blur(10px);
        }

        .btn-volver {
            position: absolute;
            top: 20px;
            right: 30px;
            background: rgba(255,255,255,0.2);
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            text-decoration: none;
            font-size: 0.9em;
            font-weight: bold;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255,255,255,0.3);
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .btn-volver:hover {
            background: rgba(255,255,255,0.3);
            transform: translateY(-2px);
        }

        .header h1 {
            font-size: 2.2em;
            margin-bottom: 10px;
            font-weight: 700;
        }

        .header p {
            font-size: 1.1em;
            opacity: 0.9;
        }

        .year-badge {
            background: rgba(255,255,255,0.3);
            padding: 4px 12px;
            border-radius: 15px;
            font-size: 0.7em;
            margin-left: 10px;
        }

        /* SELECTOR DE TIPO DE SIMULACIÓN */
        .selector-simulacion {
            background: #f8f9fa;
            padding: 25px 30px;
            border-bottom: 1px solid #e9ecef;
        }

        .selector-simulacion h3 {
            color: #2c3e50;
            margin-bottom: 20px;
            font-size: 1.3em;
            text-align: center;
        }

        .simulacion-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin-top: 20px;
        }

        .simulacion-card {
            background: white;
            padding: 25px;
            border-radius: 15px;
            text-align: center;
            box-shadow: 0 5px 15px rgba(0,0,0,0.08);
            border: 3px solid transparent;
            transition: all 0.3s ease;
            cursor: pointer;
            position: relative;
        }

        .simulacion-card:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 25px rgba(0,0,0,0.12);
        }

        .simulacion-card.activo {
            border-color: #8e44ad;
            background: linear-gradient(135deg, #f8f9fa, #e9ecef);
        }

        .simulacion-icon {
            font-size: 2.5em;
            margin-bottom: 15px;
        }

        .simulacion-titulo {
            font-size: 1.2em;
            font-weight: bold;
            color: #2c3e50;
            margin-bottom: 10px;
        }

        .simulacion-descripcion {
            color: #7f8c8d;
            margin-bottom: 15px;
            line-height: 1.5;
            font-size: 0.9em;
        }

        .simulacion-badge {
            display: inline-block;
            padding: 4px 10px;
            background: #8e44ad;
            color: white;
            border-radius: 12px;
            font-size: 0.75em;
            font-weight: bold;
        }

        .ecoems-badge {
            position: absolute;
            top: -10px;
            right: -10px;
            background: #e74c3c;
            color: white;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 0.7em;
            font-weight: bold;
            transform: rotate(5deg);
        }

        /* SELECTOR DE MODO */
        .selector-modo {
            background: #f8f9fa;
            padding: 25px 30px;
            border-bottom: 1px solid #e9ecef;
        }

        .selector-modo h3 {
            color: #2c3e50;
            margin-bottom: 20px;
            font-size: 1.3em;
            text-align: center;
        }

        .modos-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 20px;
            margin-top: 20px;
        }

        .modo-card {
            background: white;
            padding: 25px;
            border-radius: 15px;
            text-align: center;
            box-shadow: 0 5px 15px rgba(0,0,0,0.08);
            border: 3px solid transparent;
            transition: all 0.3s ease;
            cursor: pointer;
        }

        .modo-card:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 25px rgba(0,0,0,0.12);
        }

        .modo-card.activo {
            border-color: #8e44ad;
            background: linear-gradient(135deg, #f8f9fa, #e9ecef);
        }

        .modo-icon {
            font-size: 2.5em;
            margin-bottom: 15px;
        }

        .modo-titulo {
            font-size: 1.2em;
            font-weight: bold;
            color: #2c3e50;
            margin-bottom: 10px;
        }

        .modo-descripcion {
            color: #7f8c8d;
            margin-bottom: 15px;
            line-height: 1.5;
            font-size: 0.9em;
        }

        .modo-badge {
            display: inline-block;
            padding: 4px 10px;
            background: #8e44ad;
            color: white;
            border-radius: 12px;
            font-size: 0.75em;
            font-weight: bold;
        }

        /* TIMER PARA MODO EXAMEN - MEJORADO */
        .timer-container {
            background: #e74c3c;
            color: white;
            padding: 15px 30px;
            text-align: center;
            font-size: 1.1em;
            font-weight: bold;
            display: none;
        }

        .timer-info {
            font-size: 0.9em;
            opacity: 0.9;
            margin-top: 5px;
        }

        .timer {
            font-size: 1.4em;
            font-weight: bold;
            background: rgba(255,255,255,0.2);
            padding: 8px 16px;
            border-radius: 8px;
            display: inline-block;
        }

        .timer.urgente {
            animation: pulse 1s infinite;
            background: #c0392b;
        }

        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }

        /* ESTADÍSTICAS EN TIEMPO REAL - OCULTAS EN MODO EXAMEN */
        .estadisticas-vivo {
            background: linear-gradient(135deg, #8e44ad, #9b59b6);
            color: white;
            padding: 20px 30px;
            border-bottom: 1px solid #e9ecef;
        }

        .estadisticas-vivo h3 {
            margin-bottom: 15px;
            font-size: 1.2em;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .stats-vivo-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
            gap: 12px;
            margin-bottom: 15px;
        }

        .stat-vivo-card {
            background: rgba(255,255,255,0.15);
            padding: 15px;
            border-radius: 12px;
            text-align: center;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255,255,255,0.2);
            transition: all 0.3s ease;
        }

        .stat-vivo-card:hover {
            transform: translateY(-2px);
            background: rgba(255,255,255,0.2);
        }

        .stat-vivo-number {
            font-size: 1.8em;
            font-weight: bold;
            margin-bottom: 5px;
        }

        .stat-vivo-label {
            font-size: 0.85em;
            opacity: 0.9;
        }

        .stat-correcta { color: #2ecc71; }
        .stat-incorrecta { color: #e74c3c; }
        .stat-sin-responder { color: #f39c12; }
        .stat-porcentaje { color: #3498db; }

        .progress-bar {
            width: 100%;
            height: 8px;
            background: rgba(255,255,255,0.3);
            border-radius: 8px;
            margin: 12px 0;
            overflow: hidden;
        }

        .progress-fill {
            height: 100%;
            background: linear-gradient(135deg, #2ecc71, #27ae60);
            border-radius: 8px;
            transition: width 0.5s ease;
            width: 0%;
        }

        .materia-stats {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-top: 12px;
            justify-content: center;
        }

        .materia-stat-mini {
            background: rgba(255,255,255,0.15);
            padding: 6px 12px;
            border-radius: 15px;
            font-size: 0.75em;
            display: flex;
            align-items: center;
            gap: 6px;
            border: 1px solid rgba(255,255,255,0.2);
        }

        .materia-stat-correcta { color: #2ecc71; }
        .materia-stat-incorrecta { color: #e74c3c; }

        /* SELECTOR DE GUÍA */
        .guia-selector {
            background: white;
            padding: 25px 30px;
            border-bottom: 1px solid #e9ecef;
        }

        .guia-selector h3 {
            color: #2c3e50;
            margin-bottom: 20px;
            font-size: 1.3em;
            text-align: center;
        }

        .filtros-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            align-items: start;
        }

        .form-group {
            display: flex;
            flex-direction: column;
        }

        .form-group label {
            font-weight: 600;
            color: #2c3e50;
            margin-bottom: 8px;
            font-size: 0.9em;
        }

        .guias-checkbox-group {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 12px;
            border: 2px solid #e9ecef;
            max-height: 300px;
            overflow-y: auto;
        }

        .materias-checkbox-group {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 12px;
            border: 2px solid #e9ecef;
            max-height: 300px;
            overflow-y: auto;
        }

        .guia-checkbox-item, .materia-checkbox-item {
            display: flex;
            align-items: center;
            margin-bottom: 10px;
            padding: 8px;
            border-radius: 8px;
            transition: all 0.3s ease;
            cursor: pointer;
        }

        .guia-checkbox-item:hover, .materia-checkbox-item:hover {
            background: rgba(142, 68, 173, 0.1);
        }

        .guia-checkbox-item input[type="checkbox"], 
        .materia-checkbox-item input[type="checkbox"] {
            margin-right: 10px;
            transform: scale(1.1);
            accent-color: #8e44ad;
        }

        .guia-checkbox-label, .materia-checkbox-label {
            flex: 1;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .guia-year {
            font-weight: bold;
            color: #2c3e50;
            font-size: 0.9em;
        }

        .guia-name, .materia-name {
            color: #7f8c8d;
            font-size: 0.85em;
        }

        .guia-option {
            font-size: 0.7em;
            padding: 2px 6px;
            border-radius: 6px;
            margin-left: 6px;
        }

        .guia-proxima {
            background: #e74c3c;
            color: white;
        }

        .guia-inactiva {
            background: #95a5a6;
            color: white;
        }

        .guia-disponible {
            background: #27ae60;
            color: white;
        }

        .checkbox-actions {
            display: flex;
            gap: 10px;
            margin-top: 10px;
        }

        .btn-seleccionar-todo, .btn-deseleccionar-todo {
            background: #3498db;
            color: white;
            padding: 6px 12px;
            border-radius: 6px;
            font-size: 0.8em;
            border: none;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .btn-seleccionar-todo:hover {
            background: #2980b9;
        }

        .btn-deseleccionar-todo {
            background: #e74c3c;
        }

        .btn-deseleccionar-todo:hover {
            background: #c0392b;
        }

        select, button {
            padding: 10px 14px;
            border: 2px solid #e9ecef;
            border-radius: 8px;
            font-size: 0.9em;
            transition: all 0.3s ease;
        }

        select {
            background: white;
            cursor: pointer;
        }

        select:focus {
            outline: none;
            border-color: #8e44ad;
            box-shadow: 0 0 0 3px rgba(142, 68, 173, 0.1);
        }

        button {
            background: linear-gradient(135deg, #8e44ad, #9b59b6);
            color: white;
            border: none;
            font-weight: 600;
            cursor: pointer;
            height: 42px;
        }

        button:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(142, 68, 173, 0.4);
        }

        /* PREGUNTAS */
        .estadisticas-sesion {
            background: #f8f9fa;
            padding: 20px 30px;
            border-bottom: 1px solid #e9ecef;
        }

        .estadisticas-sesion h3 {
            color: #2c3e50;
            margin-bottom: 8px;
            font-size: 1.2em;
        }

        .guias-seleccionadas {
            background: #e8f5e8;
            padding: 10px 15px;
            border-radius: 8px;
            margin-top: 10px;
            font-size: 0.85em;
            color: #2e7d32;
            border-left: 4px solid #4caf50;
        }

        .simulacion-info {
            background: #e3f2fd;
            padding: 10px 15px;
            border-radius: 8px;
            margin-top: 10px;
            font-size: 0.85em;
            color: #1565c0;
            border-left: 4px solid #2196f3;
        }

        .pregunta {
            background: white;
            margin: 15px 30px;
            padding: 20px;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.08);
            border-left: 4px solid #8e44ad;
            transition: all 0.3s ease;
        }

        .pregunta:hover {
            box-shadow: 0 6px 20px rgba(0,0,0,0.12);
        }

        .pregunta-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 15px;
            flex-wrap: wrap;
            gap: 12px;
        }

        .pregunta-header h3 {
            color: #2c3e50;
            font-size: 1.1em;
        }

        .guia-badge {
            background: #8e44ad;
            color: white;
            padding: 3px 10px;
            border-radius: 10px;
            font-size: 0.75em;
            margin-left: 8px;
        }

        .materia-tag, .tema-tag {
            background: #ecf0f1;
            padding: 5px 10px;
            border-radius: 12px;
            font-size: 0.8em;
            color: #2c3e50;
        }

        .pregunta-texto {
            font-size: 1em;
            line-height: 1.5;
            color: #2c3e50;
            margin-bottom: 20px;
            padding: 12px;
            background: #f8f9fa;
            border-radius: 8px;
            border-left: 4px solid #3498db;
        }

        .opciones-grid {
            display: grid;
            gap: 10px;
        }

        .opcion {
            padding: 12px 16px;
            border: 2px solid #e9ecef;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s ease;
            background: white;
        }

        .opcion:hover {
            border-color: #8e44ad;
            background: #f8f9fa;
            transform: translateX(3px);
        }

        .opcion.seleccionada {
            background: #f8f9fa;
            border-color: #8e44ad;
        }

        .opcion strong {
            color: #8e44ad;
            margin-right: 6px;
        }

        .resultado {
            margin-top: 12px;
            padding: 12px;
            border-radius: 8px;
            font-weight: 600;
            font-size: 0.9em;
        }

        .resultado-correcta {
            background: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }

        .resultado-incorrecta {
            background: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }

        /* EXPLICACIONES REALES */
        .explicacion {
            background: #e3f2fd;
            padding: 15px;
            border-radius: 8px;
            margin-top: 12px;
            border-left: 4px solid #2196f3;
            display: none;
        }

        .explicacion h4 {
            color: #1976d2;
            margin-bottom: 8px;
            font-size: 0.95em;
            display: flex;
            align-items: center;
            gap: 6px;
        }

        /* BOTÓN ENVIAR EXAMEN */
        .btn-enviar-examen {
            background: linear-gradient(135deg, #27ae60, #2ecc71);
            color: white;
            padding: 12px 25px;
            border: none;
            border-radius: 8px;
            font-size: 1em;
            font-weight: bold;
            cursor: pointer;
            margin: 15px auto;
            display: block;
            transition: all 0.3s ease;
        }

        .btn-enviar-examen:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(39, 174, 96, 0.4);
        }

        /* RESULTADOS FINALES - MEJORADO */
        .resultados-finales {
            background: #f8f9fa;
            padding: 25px;
            border-radius: 12px;
            margin: 15px 30px;
            text-align: center;
            display: none;
        }

        .puntuacion-final {
            font-size: 2.5em;
            font-weight: bold;
            color: #8e44ad;
            margin-bottom: 15px;
        }

        .detalles-resultado {
            background: white;
            padding: 20px;
            border-radius: 8px;
            margin: 15px 0;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .resumen-preguntas {
            margin-top: 20px;
            text-align: left;
        }

        .pregunta-resumen {
            background: white;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 15px;
            border-left: 4px solid #3498db;
        }

        .pregunta-resumen.correcta {
            border-left-color: #27ae60;
            background: #f8fff9;
        }

        .pregunta-resumen.incorrecta {
            border-left-color: #e74c3c;
            background: #fff8f8;
        }

        .pregunta-resumen.sin-responder {
            border-left-color: #f39c12;
            background: #fffbf0;
        }

        .respuesta-completa {
            margin: 8px 0;
            padding: 8px;
            background: #f8f9fa;
            border-radius: 6px;
            border-left: 3px solid #6c757d;
        }

        .respuesta-usuario {
            border-left-color: #007bff;
        }

        .respuesta-correcta {
            border-left-color: #28a745;
        }

        /* SECCIÓN DESCARGAS */
        .descargas-guias {
            background: #f8f9fa;
            padding: 25px 30px;
            border-bottom: 1px solid #e9ecef;
        }

        .descargas-guias h3 {
            color: #2c3e50;
            margin-bottom: 20px;
            font-size: 1.3em;
            text-align: center;
        }

        .guias-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 15px;
        }

        .guia-descarga-card {
            background: white;
            padding: 20px;
            border-radius: 12px;
            text-align: center;
            box-shadow: 0 4px 12px rgba(0,0,0,0.08);
            border-left: 4px solid #8e44ad;
            transition: all 0.3s ease;
        }

        .guia-descarga-card:hover {
            transform: translateY(-3px);
            box-shadow: 0 6px 20px rgba(0,0,0,0.12);
        }

        .guia-descarga-year {
            font-size: 1.5em;
            font-weight: bold;
            color: #8e44ad;
            margin-bottom: 6px;
        }

        .guia-descarga-name {
            color: #2c3e50;
            font-size: 1em;
            margin-bottom: 12px;
            font-weight: 600;
        }

        .btn-descarga {
            display: inline-block;
            padding: 10px 20px;
            background: linear-gradient(135deg, #8e44ad, #9b59b6);
            color: white;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            transition: all 0.3s ease;
            border: none;
            cursor: pointer;
            font-size: 0.9em;
        }

        .btn-descarga:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(142, 68, 173, 0.4);
        }

        .btn-descarga:disabled {
            background: #95a5a6;
            cursor: not-allowed;
            transform: none;
            box-shadow: none;
        }

        .proximamente-badge {
            background: #e74c3c;
            color: white;
            padding: 6px 12px;
            border-radius: 15px;
            font-size: 0.75em;
            font-weight: bold;
            margin-top: 8px;
        }

        /* FOOTER */
        .footer {
            background: #2c3e50;
            color: white;
            padding: 20px 30px;
            text-align: center;
        }

        .footer p {
            margin-bottom: 8px;
            opacity: 0.8;
            font-size: 0.9em;
        }

        .deepseek-badge {
            background: rgba(255,255,255,0.1);
            padding: 6px 12px;
            border-radius: 12px;
            font-size: 0.8em;
            display: inline-block;
        }

        /* RESPONSIVE */
        @media (max-width: 768px) {
            .header h1 {
                font-size: 1.8em;
            }
            
            .btn-volver {
                position: relative;
                top: auto;
                right: auto;
                margin: 10px auto;
                display: inline-flex;
            }
            
            .simulacion-grid, .modos-grid {
                grid-template-columns: 1fr;
            }
            
            .filtros-grid {
                grid-template-columns: 1fr;
            }
            
            .pregunta-header {
                flex-direction: column;
            }
            
            .pregunta {
                margin: 10px 15px;
                padding: 15px;
            }
            
            .guias-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- HEADER -->
        <div class="header">
            <div class="cyberedu-badge">CyberEdu MX</div>
            <a href="../index.php" class="btn-volver">
                ← Volver al Inicio
            </a>
            <h1>🏫 Simulador Multi-Guía UNAM 
                <span class="year-badge" id="badge-modo">
                    <?= $tipo_simulacion == 'completa_ecoems' ? 'Simulación Completa Ecoems' : 'Modo ' . ucfirst($modo) ?>
                </span>
            </h1>
            <p id="subtitulo-modo">
                <?= $tipo_simulacion == 'completa_ecoems' ? 
                    '128 preguntas en 3 horas - Simulación completa del examen real' : 
                    ($modo == 'estudio' ? 
                        'Aprende con explicaciones detalladas' : 
                        'Simulación real con tiempo limitado') 
                ?>
            </p>
        </div>

        <!-- SELECTOR DE TIPO DE SIMULACIÓN -->
        <div class="selector-simulacion">
            <h3>🎯 Selecciona el Tipo de Simulación</h3>
            <div class="simulacion-grid">
                <div class="simulacion-card <?= $tipo_simulacion == 'personalizada' ? 'activo' : '' ?>" 
                     onclick="cambiarTipoSimulacion('personalizada')">
                    <div class="simulacion-icon">🎛️</div>
                    <div class="simulacion-titulo">Simulación Personalizada</div>
                    <div class="simulacion-descripcion">
                        Configura a tu gusto: número de preguntas, materias y tiempo. Ideal para práctica específica.
                    </div>
                    <div class="simulacion-badge">Flexible</div>
                </div>
                
                <div class="simulacion-card <?= $tipo_simulacion == 'completa_ecoems' ? 'activo' : '' ?>" 
                     onclick="cambiarTipoSimulacion('completa_ecoems')">
                    <div class="ecoems-badge">ECOEMS</div>
                    <div class="simulacion-icon">🏆</div>
                    <div class="simulacion-titulo">Simulación Completa Ecoems</div>
                    <div class="simulacion-descripcion">
                        128 preguntas en 3 horas exactas. Réplica del examen real UNAM con todas las materias.
                    </div>
                    <div class="simulacion-badge">Completa</div>
                </div>
            </div>
        </div>

        <!-- SELECTOR DE MODO (solo para simulación personalizada) -->
        <?php if ($tipo_simulacion == 'personalizada'): ?>
        <div class="selector-modo">
            <h3>📚 Selecciona tu Modo de Práctica</h3>
            <div class="modos-grid">
                <div class="modo-card <?= $modo == 'estudio' ? 'activo' : '' ?>" 
                     onclick="cambiarModo('estudio')">
                    <div class="modo-icon">📚</div>
                    <div class="modo-titulo">Modo Estudio</div>
                    <div class="modo-descripcion">
                        Aprende a tu ritmo con explicaciones detalladas y retroalimentación inmediata.
                    </div>
                    <div class="modo-badge">Recomendado para aprender</div>
                </div>
                
                <div class="modo-card <?= $modo == 'examen' ? 'activo' : '' ?>" 
                     onclick="cambiarModo('examen')">
                    <div class="modo-icon">⏱️</div>
                    <div class="modo-titulo">Modo Examen</div>
                    <div class="modo-descripcion">
                        Simulación real con tiempo limitado. Ideal para evaluar tu preparación.
                    </div>
                    <div class="modo-badge">Para evaluar conocimientos</div>
                </div>
            </div>
        </div>
        <?php endif; ?>

        <!-- TIMER (solo se muestra cuando hay preguntas en modo examen o simulación completa) -->
        <?php if (!empty($preguntas) && ($modo == 'examen' || $tipo_simulacion == 'completa_ecoems')): ?>
        <div class="timer-container" id="timer-container">
            <div class="timer" id="timer">
                <?php if ($tipo_simulacion == 'completa_ecoems'): ?>
                    03:00:00
                <?php else: ?>
                    <?= floor($tiempo_examen_minutos) ?>:00
                <?php endif; ?>
            </div>
            <div class="timer-info">
                <?php if ($tipo_simulacion == 'completa_ecoems'): ?>
                    ⏰ <strong>Simulación Completa Ecoems:</strong> 128 preguntas en 3 horas (180 minutos)
                <?php else: ?>
                    ⏰ Tiempo calculado: <?= $tiempo_examen_minutos ?> minutos para <?= count($preguntas) ?> preguntas
                    (<?= number_format($tiempo_por_pregunta, 2) ?> min/pregunta)
                <?php endif; ?>
            </div>
        </div>
        <?php endif; ?>

        <!-- ESTADÍSTICAS EN TIEMPO REAL (solo se muestran en modo estudio y simulación personalizada) -->
        <?php if (!empty($preguntas) && $modo == 'estudio' && $tipo_simulacion == 'personalizada'): ?>
        <div class="estadisticas-vivo">
            <h3>📈 Progreso en Tiempo Real</h3>
            <div class="stats-vivo-grid">
                <div class="stat-vivo-card">
                    <div class="stat-vivo-number stat-correcta" id="contador-correctas">0</div>
                    <div class="stat-vivo-label">✅ Correctas</div>
                </div>
                <div class="stat-vivo-card">
                    <div class="stat-vivo-number stat-incorrecta" id="contador-incorrectas">0</div>
                    <div class="stat-vivo-label">❌ Incorrectas</div>
                </div>
                <div class="stat-vivo-card">
                    <div class="stat-vivo-number stat-sin-responder" id="contador-pendientes"><?= count($preguntas) ?></div>
                    <div class="stat-vivo-label">⏳ Pendientes</div>
                </div>
                <div class="stat-vivo-card">
                    <div class="stat-vivo-number stat-porcentaje" id="porcentaje-acierto">0%</div>
                    <div class="stat-vivo-label">🎯 Porcentaje</div>
                </div>
            </div>
            
            <div class="progress-bar">
                <div class="progress-fill" id="barra-progreso"></div>
            </div>
            
            <div class="materia-stats" id="estadisticas-materias"></div>
        </div>
        <?php endif; ?>

        <!-- SELECTOR DE GUÍA Y MATERIAS -->
        <div class="guia-selector" id="configuracion-avanzada" style="<?= $tipo_simulacion == 'completa_ecoems' ? 'display: none;' : '' ?>">
            <h3>🎯 Configura tu sesión de estudio</h3>
            <form method="GET" id="config-form" class="filtros-grid">
                <input type="hidden" name="modo" id="input-modo" value="<?= $modo ?>">
                <input type="hidden" name="tipo_simulacion" id="input-tipo-simulacion" value="<?= $tipo_simulacion ?>">
                
                <div class="form-group">
                    <label for="guia_years">📅 Selecciona las Guías:</label>
                    <div class="guias-checkbox-group">
                        <?php foreach ($guias as $guia): ?>
                            <div class="guia-checkbox-item">
                                <input type="checkbox" 
                                       name="guia_years[]" 
                                       value="<?= $guia['year'] ?>" 
                                       id="guia_<?= $guia['year'] ?>"
                                       <?= in_array($guia['year'], $guia_years) ? 'checked' : '' ?>
                                       <?= !$guia['activa'] ? 'disabled' : '' ?>>
                                <label for="guia_<?= $guia['year'] ?>" class="guia-checkbox-label">
                                    <div>
                                        <span class="guia-year"><?= $guia['year'] ?></span>
                                        <span class="guia-name"> - <?= $guia['nombre'] ?></span>
                                    </div>
                                    <?php if ($guia['es_proxima']): ?>
                                        <span class="guia-option guia-proxima">PRÓXIMA</span>
                                    <?php elseif (!$guia['activa']): ?>
                                        <span class="guia-option guia-inactiva">EN PREPARACIÓN</span>
                                    <?php else: ?>
                                        <span class="guia-option guia-disponible">DISPONIBLE</span>
                                    <?php endif; ?>
                                </label>
                            </div>
                        <?php endforeach; ?>
                        <div class="checkbox-actions">
                            <button type="button" class="btn-seleccionar-todo" onclick="seleccionarTodasGuias(true)">✓ Seleccionar Todas</button>
                            <button type="button" class="btn-deseleccionar-todo" onclick="seleccionarTodasGuias(false)">✗ Deseleccionar Todas</button>
                        </div>
                    </div>
                </div>

                <div class="form-group">
                    <label for="materias">📖 Selecciona las Materias:</label>
                    <div class="materias-checkbox-group">
                        <?php foreach ($todas_materias as $materia): ?>
                            <div class="materia-checkbox-item">
                                <input type="checkbox" 
                                       name="materias[]" 
                                       value="<?= htmlspecialchars($materia) ?>" 
                                       id="materia_<?= preg_replace('/[^a-z0-9]/i', '_', strtolower($materia)) ?>"
                                       <?= in_array($materia, $materias_seleccionadas) ? 'checked' : '' ?>>
                                <label for="materia_<?= preg_replace('/[^a-z0-9]/i', '_', strtolower($materia)) ?>" class="materia-checkbox-label">
                                    <div>
                                        <span class="materia-name">
                                            <?php 
                                                $iconos_materias = [
                                                    'Habilidad Matemática' => '🧮',
                                                    'Ciencias I (Biología)' => '🔬',
                                                    'Español' => '📚',
                                                    'Ciencias III (Química)' => '⚗️',
                                                    'Historia' => '📜',
                                                    'Matemáticas' => '➗',
                                                    'Habilidad verbal' => '💬',
                                                    'Geografía' => '🌍',
                                                    'Ciencias II (Física)' => '⚡',
                                                    'Formación cívica y ética' => '⚖️'
                                                ];
                                                echo ($iconos_materias[$materia] ?? '📖') . ' ' . htmlspecialchars($materia);
                                            ?>
                                        </span>
                                    </div>
                                </label>
                            </div>
                        <?php endforeach; ?>
                        <div class="checkbox-actions">
                            <button type="button" class="btn-seleccionar-todo" onclick="seleccionarTodasMaterias(true)">✓ Todas las Materias</button>
                            <button type="button" class="btn-deseleccionar-todo" onclick="seleccionarTodasMaterias(false)">✗ Ninguna Materia</button>
                        </div>
                    </div>
                </div>

                <div class="form-group">
                    <label for="limit">📊 Número de Preguntas:</label>
                    <select name="limit" id="limit">
                        <option value="5" <?= $limit == 5 ? 'selected' : '' ?>>⚡ 5 preguntas</option>
                        <option value="10" <?= $limit == 10 ? 'selected' : '' ?>>🎯 10 preguntas</option>
                        <option value="20" <?= $limit == 20 ? 'selected' : '' ?>>📚 20 preguntas</option>
                        <option value="50" <?= $limit == 50 ? 'selected' : '' ?>>🏆 50 preguntas</option>
                        <option value="128" <?= $limit == 128 ? 'selected' : '' ?>>🏅 128 preguntas (Simulación completa)</option>
                    </select>
                </div>

                <div class="form-group">
                    <button type="submit">🚀 Iniciar Simulación</button>
                </div>
            </form>
        </div>

        <!-- CONTENIDO DE PREGUNTAS -->
        <?php if (!empty($preguntas)): ?>
            <div class="estadisticas-sesion">
                <h3>📊 Sesión Activa - 
                    <?php if ($tipo_simulacion == 'completa_ecoems'): ?>
                        Simulación Completa Ecoems
                    <?php else: ?>
                        <?= $modo == 'estudio' ? 'Modo Estudio' : 'Modo Examen' ?>
                    <?php endif; ?>
                </h3>
                <p>Mostrando <strong><?= count($preguntas) ?></strong> preguntas 
                   <?= (!empty($materias_seleccionadas) && count($materias_seleccionadas) < count($todas_materias)) ? 
                       'de ' . count($materias_seleccionadas) . ' materias seleccionadas' : 
                       'de todas las materias' ?>
                </p>
                
                <?php if ($tipo_simulacion == 'completa_ecoems'): ?>
                <div class="simulacion-info">
                    🏆 <strong>Simulación Completa Ecoems UNAM:</strong> 128 preguntas en 3 horas exactas.
                    Réplica del examen real con todas las materias del temario oficial.
                </div>
                <?php endif; ?>
                
                <div class="guias-seleccionadas">
                    🎯 <strong>Guías seleccionadas:</strong> 
                    <?= implode(', ', array_map(function($year) use ($guias) {
                        $guia = array_filter($guias, function($g) use ($year) { return $g['year'] == $year; });
                        return $year . ' (' . reset($guia)['nombre'] . ')';
                    }, $guia_years)) ?>
                </div>
            </div>
            
            <?php foreach ($preguntas as $index => $pregunta): ?>
            <div class="pregunta" id="pregunta-<?= $pregunta['id'] ?>" 
                 data-pregunta-id="<?= $pregunta['id'] ?>" 
                 data-materia="<?= htmlspecialchars($pregunta['materia_nombre']) ?>"
                 data-opciones='<?= json_encode([
                     'A' => $pregunta['opcion_a'],
                     'B' => $pregunta['opcion_b'], 
                     'C' => $pregunta['opcion_c'],
                     'D' => $pregunta['opcion_d']
                 ]) ?>'>
                <div class="pregunta-header">
                    <div>
                        <h3>📝 Pregunta <?= $pregunta['numero_pregunta'] ?> 
                            <span class="guia-badge">Guía <?= $pregunta['guia_year'] ?></span>
                        </h3>
                        <p style="color: #666; font-size: 0.85em; margin-top: 5px;">
                            <?php if ($tipo_simulacion == 'completa_ecoems'): ?>
                                🏆 Ecoems: <?= $index + 1 ?> de <?= count($preguntas) ?>
                            <?php else: ?>
                                🎯 <?= $modo == 'estudio' ? 'Estudio' : 'Examen' ?>: <?= $index + 1 ?> de <?= count($preguntas) ?>
                            <?php endif; ?>
                        </p>
                    </div>
                    <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                        <span class="materia-tag">📖 <?= htmlspecialchars($pregunta['materia_nombre']) ?></span>
                        <?php if (!empty($pregunta['tema'])): ?>
                            <span class="tema-tag">🏷️ <?= htmlspecialchars($pregunta['tema']) ?></span>
                        <?php endif; ?>
                    </div>
                </div>
                
                <div class="pregunta-texto">
                    <?= nl2br(htmlspecialchars($pregunta['pregunta_texto'])) ?>
                </div>
                
                <div class="opciones-grid">
                    <?php foreach (['A', 'B', 'C', 'D'] as $letra): ?>
                        <div class="opcion" 
                             onclick="seleccionarRespuesta(<?= $pregunta['id'] ?>, '<?= $letra ?>', '<?= htmlspecialchars($pregunta['materia_nombre']) ?>')"
                             data-opcion="<?= $letra ?>">
                            <strong><?= $letra ?>)</strong> 
                            <?= htmlspecialchars($pregunta['opcion_' . strtolower($letra)]) ?>
                        </div>
                    <?php endforeach; ?>
                </div>
                
                <!-- Explicación REAL (solo visible en modo estudio después de responder) -->
                <?php if ($modo == 'estudio' && $tipo_simulacion == 'personalizada'): ?>
                <div class="explicacion" id="explicacion-<?= $pregunta['id'] ?>">
                    <h4>💡 Explicación</h4>
                    <div id="contenido-explicacion-<?= $pregunta['id'] ?>">
                        <!-- El contenido se llenará con JavaScript desde la base de datos -->
                    </div>
                </div>
                <?php endif; ?>
                
                <div id="resultado-<?= $pregunta['id'] ?>" class="resultado"></div>
            </div>
            <?php endforeach; ?>

            <!-- Botón para enviar examen (solo en modo examen o simulación completa) -->
            <?php if ($modo == 'examen' || $tipo_simulacion == 'completa_ecoems'): ?>
                <button class="btn-enviar-examen" id="btn-enviar-examen" onclick="finalizarExamen()">
                    <?php if ($tipo_simulacion == 'completa_ecoems'): ?>
                        🏁 Finalizar Simulación Ecoems y Ver Resultados
                    <?php else: ?>
                        🏁 Finalizar Examen y Ver Resultados
                    <?php endif; ?>
                </button>
            <?php endif; ?>

            <!-- Resultados finales -->
            <div class="resultados-finales" id="resultados-finales">
                <h2>📊 Resultados Finales del <?= $tipo_simulacion == 'completa_ecoems' ? 'Simulación Ecoems' : 'Examen' ?></h2>
                <div class="puntuacion-final" id="puntuacion-final">0%</div>
                
                <div class="detalles-resultado">
                    <h4>📈 Detalles de tu desempeño</h4>
                    <div id="detalles-resultado">
                        <!-- Se llenará con JavaScript -->
                    </div>
                </div>

                <div class="resumen-preguntas" id="resumen-preguntas">
                    <h4>📝 Resumen de Preguntas</h4>
                    <!-- Se llenará con JavaScript -->
                </div>
                
                <div style="margin: 15px 0;">
                    <p id="mensaje-resultado"></p>
                </div>
                
                <button class="btn-descarga" onclick="location.reload()" style="margin-top: 15px;">
                    🔄 Intentar Otra Vez
                </button>
            </div>

        <?php elseif (!empty($error_message)): ?>
            <div class="estadisticas-sesion">
                <h3>❌ Error en la consulta</h3>
                <p><?= $error_message ?></p>
            </div>
        <?php else: ?>
            <div class="estadisticas-sesion">
                <h3>📝 Configura tu simulación</h3>
                <p><?php if ($tipo_simulacion == 'completa_ecoems'): ?>
                        Para iniciar la Simulación Completa Ecoems (128 preguntas en 3 horas), simplemente haz clic en "Iniciar Simulación".
                   <?php else: ?>
                        Selecciona al menos una guía y una materia, luego haz clic en "Iniciar Simulación" para comenzar.
                   <?php endif; ?></p>
            </div>
        <?php endif; ?>

        <!-- SECCIÓN DESCARGAS -->
        <div class="descargas-guias">
            <h3>📥 Descarga las Guías de Estudio</h3>
            <div class="guias-grid">
                <?php foreach ($guias_descarga as $guia): ?>
                <div class="guia-descarga-card">
                    <div>
                        <div class="guia-descarga-year"><?= $guia['year'] ?></div>
                        <div class="guia-descarga-name"><?= $guia['nombre'] ?></div>
                    </div>
                    <div>
                        <?php if ($guia['disponible']): ?>
                            <a href="guias/<?= $guia['archivo'] ?>" class="btn-descarga" download>
                                📄 Descargar PDF
                            </a>
                        <?php else: ?>
                            <div class="proximamente-badge">Próximamente</div>
                            <button class="btn-descarga" disabled>
                                ⏳ No Disponible
                            </button>
                        <?php endif; ?>
                    </div>
                </div>
                <?php endforeach; ?>
            </div>
        </div>

        <!-- FOOTER -->
        <div class="footer">
            <p>© 2025 CyberEdu MX - Simulador Multi-Guía UNAM</p>
            <div class="deepseek-badge">🚀 Desarrollado con tecnología DeepSeek</div>
        </div>
    </div>

    <script>
    // Variables globales
    let estadisticas = {
        totalPreguntas: <?= count($preguntas) ?>,
        correctas: 0,
        incorrectas: 0,
        respondidas: 0,
        porMateria: {},
        modo: '<?= $modo ?>',
        tipoSimulacion: '<?= $tipo_simulacion ?>',
        respuestasSeleccionadas: {}, // Para guardar respuestas en modo examen
        resultadosPreguntas: {}, // Para guardar resultados de cada pregunta
        tiempoExamen: <?= $tipo_simulacion == 'completa_ecoems' ? 180 * 60 : $tiempo_examen_segundos ?>, // Tiempo en segundos
        tiempoPorPregunta: <?= $tiempo_por_pregunta ?>, // Minutos por pregunta
        examenIniciado: <?= (!empty($preguntas) && ($modo == 'examen' || $tipo_simulacion == 'completa_ecoems')) ? 'true' : 'false' ?>
    };

    let timer;
    let tiempoRestante = estadisticas.tiempoExamen;
    let examenEnCurso = false;

    // Inicializar según el modo
    function inicializarModo() {
        if ((estadisticas.modo === 'examen' || estadisticas.tipoSimulacion === 'completa_ecoems') && estadisticas.totalPreguntas > 0) {
            // Mostrar timer e iniciarlo automáticamente
            document.getElementById('timer-container').style.display = 'block';
            iniciarTimer();
            examenEnCurso = true;
            
            // Ocultar estadísticas en tiempo real en modo examen
            const estadisticasVivo = document.querySelector('.estadisticas-vivo');
            if (estadisticasVivo) {
                estadisticasVivo.style.display = 'none';
            }
        }
        
        if (estadisticas.totalPreguntas > 0 && estadisticas.modo === 'estudio' && estadisticas.tipoSimulacion === 'personalizada') {
            inicializarEstadisticasMaterias();
            actualizarEstadisticas();
        }
    }

    // Timer para modo examen - SE INICIA AUTOMÁTICAMENTE AL CARGAR LAS PREGUNTAS
    function iniciarTimer() {
        // Reiniciar tiempo si ya existe un timer
        if (timer) {
            clearInterval(timer);
        }
        
        tiempoRestante = estadisticas.tiempoExamen;
        
        timer = setInterval(() => {
            tiempoRestante--;
            
            let horas = 0, minutos = 0, segundos = 0;
            
            if (estadisticas.tipoSimulacion === 'completa_ecoems') {
                horas = Math.floor(tiempoRestante / 3600);
                minutos = Math.floor((tiempoRestante % 3600) / 60);
                segundos = tiempoRestante % 60;
                document.getElementById('timer').textContent = 
                    `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
            } else {
                minutos = Math.floor(tiempoRestante / 60);
                segundos = tiempoRestante % 60;
                document.getElementById('timer').textContent = 
                    `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
            }
            
            // Cambiar color cuando quede el 20% del tiempo
            const tiempoTotal = estadisticas.tiempoExamen;
            if (tiempoRestante <= tiempoTotal * 0.2) {
                document.getElementById('timer').classList.add('urgente');
            }
            
            // Finalizar automáticamente cuando se acabe el tiempo
            if (tiempoRestante <= 0) {
                finalizarExamen();
            }
        }, 1000);
    }

    // Cambiar entre tipos de simulación
    function cambiarTipoSimulacion(tipo) {
        document.getElementById('input-tipo-simulacion').value = tipo;
        
        if (tipo === 'completa_ecoems') {
            // Forzar modo examen y ocultar configuración avanzada
            document.getElementById('input-modo').value = 'examen';
            document.getElementById('configuracion-avanzada').style.display = 'none';
            
            // Seleccionar todas las guías activas y todas las materias
            document.querySelectorAll('input[name="guia_years[]"]').forEach(checkbox => {
                if (!checkbox.disabled) checkbox.checked = true;
            });
            document.querySelectorAll('input[name="materias[]"]').forEach(checkbox => {
                checkbox.checked = true;
            });
        } else {
            // Mostrar configuración avanzada
            document.getElementById('configuracion-avanzada').style.display = 'block';
        }
        
        document.getElementById('config-form').submit();
    }

    // Cambiar entre modos (solo para simulación personalizada)
    function cambiarModo(nuevoModo) {
        document.getElementById('input-modo').value = nuevoModo;
        document.getElementById('config-form').submit();
    }

    // Funciones para seleccionar/deseleccionar todas las guías
    function seleccionarTodasGuias(seleccionar) {
        document.querySelectorAll('input[name="guia_years[]"]').forEach(checkbox => {
            if (!checkbox.disabled) {
                checkbox.checked = seleccionar;
            }
        });
    }

    // Funciones para seleccionar/deseleccionar todas las materias
    function seleccionarTodasMaterias(seleccionar) {
        document.querySelectorAll('input[name="materias[]"]').forEach(checkbox => {
            checkbox.checked = seleccionar;
        });
    }

    // Función principal para seleccionar respuestas - ACTUALIZADA PARA EXPLICACIONES REALES
    async function seleccionarRespuesta(preguntaId, respuesta, materia) {
        const opciones = document.querySelectorAll(`#pregunta-${preguntaId} .opcion`);
        const resultadoDiv = document.getElementById(`resultado-${preguntaId}`);
        
        // Guardar la respuesta seleccionada
        estadisticas.respuestasSeleccionadas[preguntaId] = respuesta;

        // En modo examen o simulación completa, solo marcar la opción seleccionada
        if (estadisticas.modo === 'examen' || estadisticas.tipoSimulacion === 'completa_ecoems') {
            // Quitar selección anterior
            opciones.forEach(opcion => {
                opcion.classList.remove('seleccionada');
                opcion.style.background = 'white';
                opcion.style.borderColor = '#e9ecef';
            });
            
            // Marcar nueva selección
            opciones.forEach(opcion => {
                if (opcion.dataset.opcion === respuesta) {
                    opcion.classList.add('seleccionada');
                    opcion.style.background = '#f8f9fa';
                    opcion.style.borderColor = '#8e44ad';
                }
            });
            
            // Actualizar estadísticas
            estadisticas.respondidas++;
            return;
        }

        // Modo estudio: verificar respuesta y mostrar explicación REAL
        try {
            const response = await fetch('verificar_respuesta.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    pregunta_id: preguntaId, 
                    respuesta_usuario: respuesta 
                })
            });

            const resultado = await response.json();
            
            // Guardar resultado para mostrar después
            estadisticas.resultadosPreguntas[preguntaId] = resultado;
            
            // MOSTRAR EXPLICACIÓN REAL (tanto si es correcta como incorrecta)
            const explicacionDiv = document.getElementById(`explicacion-${preguntaId}`);
            const contenidoExplicacion = document.getElementById(`contenido-explicacion-${preguntaId}`);
            
            if (resultado.es_correcta) {
                estadisticas.correctas++;
                estadisticas.porMateria[materia].correctas++;
                resultadoDiv.innerHTML = '<div class="resultado resultado-correcta">✅ <strong>¡Correcto!</strong> Has seleccionado la respuesta correcta.</div>';
            } else {
                estadisticas.incorrectas++;
                estadisticas.porMateria[materia].incorrectas++;
                resultadoDiv.innerHTML = `<div class="resultado resultado-incorrecta">❌ <strong>Incorrecto.</strong> La respuesta correcta es: <strong>${resultado.respuesta_correcta}</strong></div>`;
            }
            
            // MOSTRAR EXPLICACIÓN REAL DE LA BASE DE DATOS
            contenidoExplicacion.innerHTML = `
                <div style="margin-bottom: 10px;">
                    <strong>Análisis:</strong> ${resultado.explicacion}
                </div>
            `;
            
            // Agregar consejos específicos según si fue correcta o incorrecta
            if (resultado.es_correcta) {
                contenidoExplicacion.innerHTML += `
                    <div style="background: #d4edda; padding: 8px; border-radius: 4px; margin-top: 8px;">
                        <strong>💡 Buen trabajo:</strong> Sigue practicando para mantener tu conocimiento fresco.
                    </div>
                `;
            } else {
                contenidoExplicacion.innerHTML += `
                    <div style="background: #fff3cd; padding: 8px; border-radius: 4px; margin-top: 8px;">
                        <strong>📚 Para mejorar:</strong> Te recomendamos repasar los conceptos relacionados con esta pregunta.
                    </div>
                `;
            }
            
            // MOSTRAR SIEMPRE LA EXPLICACIÓN EN MODO ESTUDIO
            if (explicacionDiv) {
                explicacionDiv.style.display = 'block';
            }
            
            estadisticas.respondidas++;
            actualizarEstadisticas();

            // Colorear opciones
            opciones.forEach(opcion => {
                opcion.style.pointerEvents = 'none'; // Deshabilitar después de responder
                opcion.style.background = 'white';
                
                if (opcion.textContent.includes(respuesta)) {
                    if (resultado.es_correcta) {
                        opcion.style.background = 'linear-gradient(135deg, #d4edda, #c3e6cb)';
                        opcion.style.borderColor = '#27ae60';
                    } else {
                        opcion.style.background = 'linear-gradient(135deg, #f8d7da, #f5c6cb)';
                        opcion.style.borderColor = '#e74c3c';
                    }
                }
                
                if (opcion.textContent.includes(resultado.respuesta_correcta)) {
                    opcion.style.background = 'linear-gradient(135deg, #d4edda, #c3e6cb)';
                    opcion.style.borderColor = '#27ae60';
                }
            });

        } catch (error) {
            console.error('Error:', error);
            resultadoDiv.innerHTML = '<div class="resultado resultado-incorrecta">⚠️ Error al verificar la respuesta</div>';
        }
    }

    // Finalizar examen y mostrar resultados
    async function finalizarExamen() {
        if (timer) {
            clearInterval(timer);
        }
        
        examenEnCurso = false;
        
        // Verificar todas las respuestas
        const preguntas = document.querySelectorAll('.pregunta');
        let correctas = 0;
        let totalRespondidas = 0;
        
        for (const pregunta of preguntas) {
            const preguntaId = pregunta.dataset.preguntaId;
            const respuestaSeleccionada = estadisticas.respuestasSeleccionadas[preguntaId];
            
            if (respuestaSeleccionada) {
                totalRespondidas++;
                
                try {
                    const response = await fetch('verificar_respuesta.php', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ 
                            pregunta_id: preguntaId, 
                            respuesta_usuario: respuestaSeleccionada 
                        })
                    });
                    
                    const resultado = await response.json();
                    estadisticas.resultadosPreguntas[preguntaId] = resultado;
                    
                    if (resultado.es_correcta) {
                        correctas++;
                    }
                    
                    // Mostrar resultado en cada pregunta
                    const resultadoDiv = document.getElementById(`resultado-${preguntaId}`);
                    const opciones = pregunta.querySelectorAll('.opcion');
                    
                    if (resultado.es_correcta) {
                        resultadoDiv.innerHTML = '<div class="resultado resultado-correcta">✅ Correcta</div>';
                    } else {
                        resultadoDiv.innerHTML = `<div class="resultado resultado-incorrecta">❌ Correcta: ${resultado.respuesta_correcta}</div>`;
                    }
                    
                    // Colorear opciones
                    opciones.forEach(opcion => {
                        if (opcion.textContent.includes(respuestaSeleccionada)) {
                            if (resultado.es_correcta) {
                                opcion.style.background = 'linear-gradient(135deg, #d4edda, #c3e6cb)';
                                opcion.style.borderColor = '#27ae60';
                            } else {
                                opcion.style.background = 'linear-gradient(135deg, #f8d7da, #f5c6cb)';
                                opcion.style.borderColor = '#e74c3c';
                            }
                        }
                        
                        if (opcion.textContent.includes(resultado.respuesta_correcta)) {
                            opcion.style.background = 'linear-gradient(135deg, #d4edda, #c3e6cb)';
                            opcion.style.borderColor = '#27ae60';
                        }
                    });
                    
                } catch (error) {
                    console.error('Error:', error);
                }
            }
        }
        
        // Calcular puntuación
        const puntuacion = Math.round((correctas / preguntas.length) * 100);
        
        // Mostrar resultados finales
        mostrarResultadosFinales(puntuacion, correctas, totalRespondidas, preguntas.length);
    }

    // Mostrar resultados finales con resumen de preguntas
    function mostrarResultadosFinales(puntuacion, correctas, totalRespondidas, totalPreguntas) {
        document.getElementById('puntuacion-final').textContent = puntuacion + '%';
        
        // Mostrar detalles del resultado
        const detallesDiv = document.getElementById('detalles-resultado');
        detallesDiv.innerHTML = `
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; text-align: left;">
                <div>
                    <strong>Total de preguntas:</strong> ${totalPreguntas}
                </div>
                <div>
                    <strong>Respondidas:</strong> ${totalRespondidas}
                </div>
                <div>
                    <strong>Correctas:</strong> ${correctas}
                </div>
                <div>
                    <strong>Incorrectas:</strong> ${totalRespondidas - correctas}
                </div>
                <div>
                    <strong>Sin responder:</strong> ${totalPreguntas - totalRespondidas}
                </div>
                <div>
                    <strong>Puntuación:</strong> ${puntuacion}%
                </div>
            </div>
        `;
        
        // Mostrar resumen de preguntas
        mostrarResumenPreguntas();
        
        // Mostrar mensaje personalizado según puntuación
        const mensajeResultado = document.getElementById('mensaje-resultado');
        if (estadisticas.tipoSimulacion === 'completa_ecoems') {
            if (puntuacion >= 90) {
                mensajeResultado.innerHTML = '🎉 <strong>¡Excelente trabajo!</strong> Estás listo para el examen real Ecoems UNAM.';
            } else if (puntuacion >= 70) {
                mensajeResultado.innerHTML = '👍 <strong>¡Buen trabajo!</strong> Tienes un buen nivel para el examen Ecoems.';
            } else if (puntuacion >= 50) {
                mensajeResultado.innerHTML = '📚 <strong>Vas por buen camino.</strong> Sigue practicando para mejorar tu puntuación en el Ecoems.';
            } else {
                mensajeResultado.innerHTML = '💪 <strong>No te rindas.</strong> Revisa las guías y sigue practicando para el Ecoems UNAM.';
            }
        } else {
            if (puntuacion >= 90) {
                mensajeResultado.innerHTML = '🎉 <strong>¡Excelente trabajo!</strong> Dominas completamente los temas.';
            } else if (puntuacion >= 70) {
                mensajeResultado.innerHTML = '👍 <strong>¡Buen trabajo!</strong> Tienes un buen dominio de los temas.';
            } else if (puntuacion >= 50) {
                mensajeResultado.innerHTML = '📚 <strong>Vas por buen camino.</strong> Sigue practicando para mejorar.';
            } else {
                mensajeResultado.innerHTML = '💪 <strong>No te rindas.</strong> Revisa las guías y sigue practicando.';
            }
        }
        
        document.getElementById('resultados-finales').style.display = 'block';
        
        // Scroll to results
        document.getElementById('resultados-finales').scrollIntoView({ behavior: 'smooth' });
    }

    // Mostrar resumen de todas las preguntas con texto completo de opciones
    function mostrarResumenPreguntas() {
        const resumenDiv = document.getElementById('resumen-preguntas');
        let html = '';
        
        const preguntas = document.querySelectorAll('.pregunta');
        preguntas.forEach((pregunta, index) => {
            const preguntaId = pregunta.dataset.preguntaId;
            const opcionesData = JSON.parse(pregunta.dataset.opciones);
            const resultado = estadisticas.resultadosPreguntas[preguntaId];
            const respuestaSeleccionada = estadisticas.respuestasSeleccionadas[preguntaId];
            
            let estado = 'sin-responder';
            let textoEstado = '⏳ Sin responder';
            
            if (respuestaSeleccionada) {
                if (resultado && resultado.es_correcta) {
                    estado = 'correcta';
                    textoEstado = '✅ Correcta';
                } else {
                    estado = 'incorrecta';
                    textoEstado = '❌ Incorrecta';
                }
            }
            
            html += `
                <div class="pregunta-resumen ${estado}">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 15px; flex-wrap: wrap; gap: 10px;">
                        <h5 style="margin: 0; flex: 1;">📝 Pregunta ${index + 1}</h5>
                        <span style="font-size: 0.9em; font-weight: bold; padding: 4px 8px; border-radius: 6px; 
                              ${estado === 'correcta' ? 'background: #d4edda; color: #155724;' : 
                                estado === 'incorrecta' ? 'background: #f8d7da; color: #721c24;' : 
                                'background: #fff3cd; color: #856404;'}">
                            ${textoEstado}
                        </span>
                    </div>
                    
                    <div style="font-size: 0.95em; margin-bottom: 12px; padding: 10px; background: #f8f9fa; border-radius: 6px;">
                        <strong>Pregunta:</strong> ${pregunta.querySelector('.pregunta-texto').textContent.trim()}
                    </div>
                    
                    <div style="margin-bottom: 12px;">
                        <strong style="font-size: 0.9em;">Opciones:</strong>
                        <div style="margin-top: 8px;">
            `;
            
            // Mostrar todas las opciones con su texto completo
            for (const [letra, texto] of Object.entries(opcionesData)) {
                let estiloOpcion = 'padding: 6px 10px; margin: 4px 0; border-radius: 4px; font-size: 0.9em;';
                
                if (respuestaSeleccionada === letra) {
                    if (resultado && resultado.es_correcta) {
                        estiloOpcion += 'background: #d4edda; border-left: 3px solid #28a745;';
                    } else {
                        estiloOpcion += 'background: #f8d7da; border-left: 3px solid #dc3545;';
                    }
                } else if (resultado && resultado.respuesta_correcta === letra) {
                    estiloOpcion += 'background: #d4edda; border-left: 3px solid #28a745;';
                } else {
                    estiloOpcion += 'background: #f8f9fa; border-left: 3px solid #6c757d;';
                }
                
                html += `<div style="${estiloOpcion}">
                    <strong>${letra})</strong> ${texto}
                </div>`;
            }
            
            html += `</div></div>`;
            
            // Mostrar respuestas del usuario y correctas
            if (respuestaSeleccionada) {
                html += `
                    <div class="respuesta-completa respuesta-usuario">
                        <strong>Tu respuesta:</strong> ${respuestaSeleccionada}) ${opcionesData[respuestaSeleccionada]}
                    </div>
                `;
            }
            
            if (resultado && !resultado.es_correcta) {
                html += `
                    <div class="respuesta-completa respuesta-correcta">
                        <strong>Respuesta correcta:</strong> ${resultado.respuesta_correcta}) ${opcionesData[resultado.respuesta_correcta]}
                    </div>
                `;
            }
            
            html += `</div>`;
        });
        
        resumenDiv.innerHTML += html;
    }

    // Funciones de estadísticas (solo para modo estudio y simulación personalizada)
    function inicializarEstadisticasMaterias() {
        if (estadisticas.modo === 'estudio' && estadisticas.tipoSimulacion === 'personalizada') {
            const materias = document.querySelectorAll('.pregunta');
            materias.forEach(pregunta => {
                const materia = pregunta.dataset.materia;
                if (!estadisticas.porMateria[materia]) {
                    estadisticas.porMateria[materia] = {
                        correctas: 0,
                        incorrectas: 0,
                        total: 0
                    };
                }
                estadisticas.porMateria[materia].total++;
            });
            actualizarEstadisticasMaterias();
        }
    }

    function actualizarEstadisticas() {
        if (estadisticas.modo === 'estudio' && estadisticas.tipoSimulacion === 'personalizada') {
            const total = estadisticas.totalPreguntas;
            const correctas = estadisticas.correctas;
            const incorrectas = estadisticas.incorrectas;
            const pendientes = total - (correctas + incorrectas);
            const porcentaje = total > 0 ? Math.round((correctas / total) * 100) : 0;
            const progreso = total > 0 ? Math.round(((correctas + incorrectas) / total) * 100) : 0;

            document.getElementById('contador-correctas').textContent = correctas;
            document.getElementById('contador-incorrectas').textContent = incorrectas;
            document.getElementById('contador-pendientes').textContent = pendientes;
            document.getElementById('porcentaje-acierto').textContent = porcentaje + '%';
            document.getElementById('barra-progreso').style.width = progreso + '%';
            
            const barra = document.getElementById('barra-progreso');
            if (porcentaje >= 80) {
                barra.style.background = 'linear-gradient(135deg, #2ecc71, #27ae60)';
            } else if (porcentaje >= 60) {
                barra.style.background = 'linear-gradient(135deg, #f39c12, #e67e22)';
            } else {
                barra.style.background = 'linear-gradient(135deg, #e74c3c, #c0392b)';
            }
            
            actualizarEstadisticasMaterias();
        }
    }

    function actualizarEstadisticasMaterias() {
        if (estadisticas.modo === 'estudio' && estadisticas.tipoSimulacion === 'personalizada') {
            const container = document.getElementById('estadisticas-materias');
            container.innerHTML = '';
            
            for (const [materia, datos] of Object.entries(estadisticas.porMateria)) {
                if (datos.total > 0) {
                    const porcentajeMateria = datos.total > 0 ? Math.round((datos.correctas / datos.total) * 100) : 0;
                    const statElement = document.createElement('div');
                    statElement.className = 'materia-stat-mini';
                    statElement.innerHTML = `
                        <span>${materia}:</span>
                        <span class="materia-stat-correcta">${datos.correctas}✅</span>
                        <span class="materia-stat-incorrecta">${datos.incorrectas}❌</span>
                        <span>(${porcentajeMateria}%)</span>
                    `;
                    container.appendChild(statElement);
                }
            }
        }
    }

    // Inicializar al cargar la página
    document.addEventListener('DOMContentLoaded', function() {
        inicializarModo();
        
        const form = document.querySelector('form');
        form.addEventListener('submit', function(e) {
            const checkboxesGuias = document.querySelectorAll('input[name="guia_years[]"]:checked');
            const checkboxesMaterias = document.querySelectorAll('input[name="materias[]"]:checked');
            
            if (estadisticas.tipoSimulacion === 'completa_ecoems') {
                // Para simulación completa, se seleccionan todas automáticamente
                return true;
            }
            
            if (checkboxesGuias.length === 0) {
                e.preventDefault();
                alert('⚠️ Por favor selecciona al menos una guía');
                return false;
            }
            
            if (checkboxesMaterias.length === 0) {
                e.preventDefault();
                alert('⚠️ Por favor selecciona al menos una materia');
                return false;
            }
        });
    });
    </script>
</body>
</html>