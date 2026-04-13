<?php
// simulador_multi_guia.php - CON ESTILO ANIME ADOLESCENTE
include 'config.php';
session_start();

// Inicializar estadísticas de sesión si no existen
if (!isset($_SESSION['estadisticas_usuario'])) {
    $_SESSION['estadisticas_usuario'] = [
        'total_preguntas' => 0,
        'correctas' => 0,
        'incorrectas' => 0,
        'mejor_porcentaje' => 0,
        'sesiones_completadas' => 0,
        'nivel_estudiante' => 'Novato 🌱',
        'exp_actual' => 0,
        'exp_requerida' => 100
    ];
}

// ===================== CONTROL DE ACCESO (DE PAGO) =====================
$userId = $_GET['u'] ?? $_SESSION['tracking_user_id'] ?? null;
$tiene_acceso = true; // ACCESO GRATUITO PARA TODOS 🚀
$nombre_usuario = "";

// Lógica de retorno inteligente (Hardened)
$returnUrl = $_GET['origin'] ?? $_SESSION['smart_return_url'] ?? $_SERVER['HTTP_REFERER'] ?? "https://cyberedumx.com/";

// Validar y limpiar URL de retorno para evitar bucles o URLs externas peligrosas
if (strpos($returnUrl, 'lovable.app') !== false || strpos($returnUrl, 'vercel.app') !== false || strpos($returnUrl, 'localhost') !== false) {
    $_SESSION['smart_return_url'] = $returnUrl;
} else if (strpos($returnUrl, 'simulador') !== false) {
    // Si el referer es otro simulador, intentar recuperar de la sesión
    $returnUrl = $_SESSION['smart_return_url'] ?? "https://cyberedumx.com/";
}

if ($userId) {
    try {
        $stmt = $pdo->prepare("SELECT nombre, acceso_unam FROM usuarios_seguimiento WHERE id = ?");
        $stmt->execute([$userId]);
        $user_db = $stmt->fetch();
        if ($user_db) {
            $nombre_usuario = $user_db['nombre'];
            $_SESSION['tracking_user_id'] = $userId;
        }
    } catch (Exception $e) {
        // Silencioso
    }
}

$tiene_acceso = true; // ACCESO GRATUITO PARA TODOS 🚀


if (!$tiene_acceso): ?>
    <!DOCTYPE html>
    <html lang="es">

    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Acceso Restringido - Simulador UNAM y ECOEMS</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
        <style>
            body {
                background: #0f172a;
                color: white;
                font-family: 'Inter', sans-serif;
                display: flex;
                align-items: center;
                justify-content: center;
                min-height: 100vh;
                margin: 0;
                padding: 20px;
            }

            .access-card {
                background: rgba(255, 255, 255, 0.05);
                backdrop-filter: blur(10px);
                border: 2px solid #ec4899;
                border-radius: 20px;
                padding: 40px;
                max-width: 500px;
                width: 100%;
                text-align: center;
                box-shadow: 0 15px 35px rgba(0, 0, 0, 0.5);
            }

            .icon-wrapper {
                font-size: 4rem;
                color: #fbbf24;
                margin-bottom: 20px;
                text-shadow: 0 0 20px rgba(251, 191, 36, 0.4);
            }

            .btn-wa {
                background: #25d366;
                color: white;
                border: none;
                padding: 15px 30px;
                border-radius: 50px;
                font-weight: bold;
                text-decoration: none;
                display: inline-flex;
                align-items: center;
                gap: 10px;
                margin-top: 20px;
                transition: 0.3s;
            }

            .btn-wa:hover {
                transform: translateY(-3px);
                background: #128c7e;
                color: white;
                box-shadow: 0 10px 20px rgba(37, 211, 102, 0.3);
            }

            .price-badge {
                background: #fbbf24;
                color: #0f172a;
                padding: 5px 15px;
                border-radius: 50px;
                font-weight: bold;
                font-size: 1.2rem;
                display: inline-block;
                margin: 15px 0;
            }

            /* BANNER BETA CUSTOM */
            #beta-banner {
                background: linear-gradient(90deg, #6a11cb, #2575fc);
                border-bottom: 2px solid #ffde59;
                padding: 10px 0;
                text-align: center;
                font-size: 0.9rem;
                position: fixed;
                top: 0;
                width: 100%;
                z-index: 11000;
            }

            #beta-banner a {
                color: white !important;
                text-decoration: none !important;
                font-weight: 900;
                display: block;
            }

            body.with-beta-banner {
                padding-top: 40px !important;
            }
        </style>

    </head>

    <body class="with-beta-banner">
        <!-- BETA HEADER BANNER -->
        <div id="beta-banner">
            <a href="<?= $returnUrl ?>" class="smart-back-link">
                🚀 VOLVER AL DASHBOARD PRINCIPAL (PLATAFORMA 2026)
            </a>
        </div>

        <div class="access-card">
            <div class="icon-wrapper">🌸</div>
            <h2>¡Hola <?php echo htmlspecialchars($nombre_usuario ?: 'Guerrero'); ?>!</h2>
            <p>Este es el acceso premium al Simulador UNAM y ECOEMS, con más de 1000 preguntas y explicaciones épicas.</p>

            <div class="price-badge">$50.00 MXN</div>

            <p class="mb-4">Tu pago te otorga acceso de por vida y la ventaja exclusiva de recibir la **Guía 2026** sin
                costo adicional cuando sea lanzada.</p>

            <p><strong>¿Cómo obtener acceso?</strong></p>
            <p>Haz clic en el botón de abajo para enviar un mensaje y recibir los datos de pago. ¡Te activaremos en menos de
                5 minutos!</p>

            <a href="https://wa.me/525523269241?text=Hola,%20quiero%20pagar%20mi%20acceso%20al%20Simulador%20UNAM"
                class="btn-wa">
                <i class="fab fa-whatsapp"></i> Solicitar Acceso por WhatsApp
            </a>

            <div class="mt-4">
                <a href="<?= $returnUrl ?>" class="smart-back-link"
                    style="color: #94a3b8; text-decoration: none; font-size: 0.9rem;">
                    <i class="fas fa-arrow-left"></i> Volver al Dashboard Principal
                </a>
            </div>
        </div>

        <script>
            // Persistencia del Dashboard de origen (Hardened)
            const urlParams = new URLSearchParams(window.location.search);
            const originParam = urlParams.get('origin');
            const currentReferer = document.referrer;

            if (originParam) {
                localStorage.setItem('original_dashboard_url', originParam);
            } else if (currentReferer && (currentReferer.includes('lovable.app') || currentReferer.includes('vercel.app') || currentReferer.includes('localhost'))) {
                localStorage.setItem('original_dashboard_url', currentReferer);
            }

            const savedDashboard = localStorage.getItem('original_dashboard_url');
            if (savedDashboard) {
                // Aplicar a todos los botones de regreso
                document.querySelectorAll('.smart-back-link, .btn-volver, .back-to-dashboard').forEach(link => {
                    link.href = savedDashboard;
                });
            }

            // Gestión de sesión tracking
            const storedId = localStorage.getItem('tracking_user_id');
            if (storedId && !urlParams.has('u')) {
                const newUrl = new URL(window.location.href);
                newUrl.searchParams.set('u', storedId);
                if (window.location.search !== newUrl.search) {
                    window.location.href = newUrl.href;
                }
            }
        </script>
    </body>

    </html>
    <?php die(); endif; // ======================================================== ?>
<?php // REAPERTURA DE PHP PARA EL RESTO DEL CÓDIGO 

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
$guias = array_filter($guias, function ($guia) {
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

// Sistema de niveles anime
$niveles_anime = [
    1 => ['nombre' => 'Novato 🌱', 'exp' => 100, 'color' => '#8B4513'],
    2 => ['nombre' => 'Aprendiz 📚', 'exp' => 300, 'color' => '#2E8B57'],
    3 => ['nombre' => 'Estudiante 🎓', 'exp' => 600, 'color' => '#1E90FF'],
    4 => ['nombre' => 'Sabio 🧠', 'exp' => 1000, 'color' => '#9370DB'],
    5 => ['nombre' => 'Maestro 👑', 'exp' => 1500, 'color' => '#FFD700'],
    6 => ['nombre' => 'Leyenda ⚡', 'exp' => 2100, 'color' => '#FF4500']
];

// Verificar y obtener valores con valores por defecto
$nivel_actual = isset($_SESSION['estadisticas_usuario']['nivel_estudiante'])
    ? $_SESSION['estadisticas_usuario']['nivel_estudiante']
    : 'Novato 🌱';

$exp_actual = isset($_SESSION['estadisticas_usuario']['exp_actual'])
    ? $_SESSION['estadisticas_usuario']['exp_actual']
    : 0;

$exp_requerida = isset($_SESSION['estadisticas_usuario']['exp_requerida'])
    ? $_SESSION['estadisticas_usuario']['exp_requerida']
    : 100;

// Evitar división por cero
$porcentaje_nivel = ($exp_requerida > 0)
    ? min(100, ($exp_actual / $exp_requerida) * 100)
    : 0;

// Parámetros con valores por defecto
$materias_seleccionadas = $_GET['materias'] ?? $todas_materias;
$guia_years = $_GET['guia_years'] ?? [2025];
$limit = $_GET['limit'] ?? 10;
$modo = $_GET['modo'] ?? 'estudio';
$tipo_simulacion = $_GET['tipo_simulacion'] ?? 'personalizada';
$busqueda_especifica = $_GET['busqueda_especifica'] ?? '';
$guia_busqueda = $_GET['guia_busqueda'] ?? '';

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
    $modo = 'examen';
}

// Obtener estadísticas del banco
try {
    $stats_sql = "SELECT COUNT(*) as total_preguntas FROM preguntas";
    $stats_stmt = $pdo->query($stats_sql);
    $estadisticas = $stats_stmt->fetch();
} catch (PDOException $e) {
    $estadisticas = ['total_preguntas' => '1200+'];
}

// Obtener preguntas según los parámetros - CON BÚSQUEDA ESPECÍFICA
$preguntas = [];
$error_message = '';

if (!empty($guia_years) && !empty($materias_seleccionadas)) {
    try {
        if (!empty($busqueda_especifica) && !empty($guia_busqueda)) {
            // Búsqueda específica por número de pregunta y guía
            $numeros_busqueda = [];

            if (strpos($busqueda_especifica, '-') !== false) {
                list($inicio, $fin) = explode('-', $busqueda_especifica);
                $numeros_busqueda = range(intval($inicio), intval($fin));
            } elseif (strpos($busqueda_especifica, ',') !== false) {
                $numeros_busqueda = array_map('intval', explode(',', $busqueda_especifica));
            } else {
                $numeros_busqueda = [intval($busqueda_especifica)];
            }

            $sql = "SELECT p.*, m.nombre as materia_nombre, p.guia_year as guia_year,
p.explicacion as explicacion
FROM preguntas p
JOIN materias m ON p.materia_id = m.id
WHERE p.guia_year = ?
AND p.numero_pregunta IN (" . implode(',', array_fill(0, count($numeros_busqueda), '?')) . ")
ORDER BY p.numero_pregunta ASC";

            $params = [$guia_busqueda];
            $params = array_merge($params, $numeros_busqueda);

        } else {
            // Consulta normal aleatoria
            $sql = "SELECT p.*, m.nombre as materia_nombre, p.guia_year as guia_year,
p.explicacion as explicacion
FROM preguntas p
JOIN materias m ON p.materia_id = m.id
WHERE p.guia_year IN (" . implode(',', array_fill(0, count($guia_years), '?')) . ")";

            $params = $guia_years;

            if (!empty($materias_seleccionadas)) {
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
            $params[] = (int) $limit;
        }

        $stmt = $pdo->prepare($sql);

        foreach ($params as $key => $value) {
            if ($key === count($params) - 1 && !empty($busqueda_especifica)) {
                $stmt->bindValue($key + 1, $value, PDO::PARAM_INT);
            } elseif ($key === count($params) - 1) {
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
    ['year' => 2021, 'nombre' => 'UNAM 2021', 'archivo' => 'unam2021.pdf', 'disponible' => true, 'personaje' => '👨‍🎓'],
    ['year' => 2022, 'nombre' => 'UNAM 2022', 'archivo' => 'unam2022.pdf', 'disponible' => true, 'personaje' => '👩‍🔬'],
    ['year' => 2023, 'nombre' => 'UNAM 2023', 'archivo' => 'unam2023.pdf', 'disponible' => true, 'personaje' => '🧙‍♂️'],
    ['year' => 2024, 'nombre' => 'UNAM 2024', 'archivo' => 'unam2024.pdf', 'disponible' => true, 'personaje' => '⚡'],
    ['year' => 2025, 'nombre' => 'Ecoems 2025', 'archivo' => 'ecoems2025.pdf', 'disponible' => true, 'personaje' => '🏆'],
    ['year' => 2026, 'nombre' => 'Ecoems 2026', 'archivo' => 'ecoems2026.pdf', 'disponible' => false, 'personaje' => '🔮'],
];

// Calcular tiempo para modo examen
$tiempo_por_pregunta = 180 / 128;
$tiempo_examen_minutos = ceil(count($preguntas) * $tiempo_por_pregunta);
$tiempo_examen_segundos = $tiempo_examen_minutos * 60;
?>

<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AnimeStudy - Academia UNAM</title>
    <style>
        /* ESTILOS ANIME ADOLESCENTE */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Arial Rounded MT Bold', 'Arial', sans-serif;
            background: linear-gradient(135deg,
                    #ff9a9e 0%,
                    #fad0c4 25%,
                    #fad0c4 50%,
                    #a1c4fd 75%,
                    #c2e9fb 100%);
            min-height: 100vh;
            padding: 20px;
            background-attachment: fixed;
            background-size: 400% 400%;
            animation: gradientBG 15s ease infinite;
        }

        @keyframes gradientBG {
            0% {
                background-position: 0% 50%;
            }

            50% {
                background-position: 100% 50%;
            }

            100% {
                background-position: 0% 50%;
            }
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: rgba(255, 255, 255, 0.95);
            border-radius: 25px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            overflow: hidden;
            border: 8px solid #fff;
            position: relative;
            backdrop-filter: blur(10px);
        }

        /* HEADER ANIME */
        .header {
            background: linear-gradient(135deg,
                    #6a11cb 0%,
                    #2575fc 100%);
            color: white;
            padding: 40px 30px 30px;
            text-align: center;
            position: relative;
            border-bottom: 5px solid #ffde59;
            overflow: hidden;
        }

        .academia-badge {
            position: absolute;
            top: 20px;
            left: 30px;
            background: linear-gradient(135deg, #ff6b6b, #ff8e53);
            padding: 12px 24px;
            border-radius: 50px;
            font-size: 1em;
            font-weight: bold;
            box-shadow: 0 4px 15px rgba(255, 107, 107, 0.4);
            border: 3px solid white;
            transform: rotate(-5deg);
            animation: float 3s ease-in-out infinite;
        }

        @keyframes float {

            0%,
            100% {
                transform: translateY(0) rotate(-5deg);
            }

            50% {
                transform: translateY(-10px) rotate(-5deg);
            }
        }

        .btn-volver {
            position: absolute;
            top: 20px;
            right: 30px;
            background: rgba(255, 255, 255, 0.2);
            color: white;
            padding: 12px 24px;
            border-radius: 50px;
            text-decoration: none;
            font-size: 0.9em;
            font-weight: bold;
            backdrop-filter: blur(10px);
            border: 2px solid rgba(255, 255, 255, 0.3);
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 8px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        }

        .btn-volver:hover {
            background: rgba(255, 255, 255, 0.3);
            transform: translateY(-3px) scale(1.05);
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
        }

        .header h1 {
            font-size: 2.8em;
            margin-bottom: 15px;
            font-weight: 900;
            text-shadow: 3px 3px 0 rgba(0, 0, 0, 0.2);
            background: linear-gradient(45deg, #ffde59, #ff914d);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            position: relative;
            display: inline-block;
        }

        .header p {
            font-size: 1.2em;
            opacity: 0.9;
            max-width: 600px;
            margin: 0 auto;
            background: rgba(0, 0, 0, 0.2);
            padding: 10px 20px;
            border-radius: 15px;
            border-left: 4px solid #ffde59;
        }

        .year-badge {
            background: linear-gradient(135deg, #ffde59, #ff914d);
            padding: 8px 20px;
            border-radius: 30px;
            font-size: 0.8em;
            margin-left: 15px;
            color: #333;
            font-weight: bold;
            box-shadow: 0 4px 10px rgba(255, 222, 89, 0.4);
            border: 2px solid white;
            display: inline-block;
            transform: rotate(2deg);
        }

        /* SECCIÓN DE INSTRUCCIONES */
        .instrucciones {
            background: linear-gradient(135deg, #ffecd2, #fcb69f);
            padding: 30px;
            border-bottom: 3px dashed #ff6b6b;
            margin: 20px 30px;
            border-radius: 20px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }

        .instrucciones h3 {
            color: #333;
            margin-bottom: 20px;
            font-size: 1.8em;
            text-align: center;
            position: relative;
            padding-bottom: 15px;
        }

        .instrucciones h3::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 100px;
            height: 4px;
            background: linear-gradient(90deg, #ff6b6b, #4ecdc4);
            border-radius: 2px;
        }

        .instrucciones-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-top: 20px;
        }

        .instruccion-card {
            background: white;
            padding: 25px;
            border-radius: 15px;
            text-align: center;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
            border: 3px solid transparent;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }

        .instruccion-card:hover {
            transform: translateY(-5px);
            border-color: #6a11cb;
        }

        .instruccion-icon {
            font-size: 3em;
            margin-bottom: 15px;
            display: inline-block;
        }

        .instruccion-titulo {
            font-size: 1.3em;
            font-weight: bold;
            color: #2c3e50;
            margin-bottom: 10px;
        }

        .instruccion-descripcion {
            color: #666;
            font-size: 0.95em;
            line-height: 1.5;
        }

        .instruccion-numero {
            position: absolute;
            top: 10px;
            left: 10px;
            background: #6a11cb;
            color: white;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 0.9em;
        }

        /* SISTEMA DE NIVELES ANIME */
        .sistema-niveles {
            background: linear-gradient(135deg, #667eea, #764ba2);
            padding: 25px;
            border-radius: 20px;
            margin: 20px 30px;
            color: white;
            border: 4px solid #ffde59;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            position: relative;
            overflow: hidden;
        }

        .sistema-niveles::before {
            content: '⚡ LEVEL UP ⚡';
            position: absolute;
            top: -10px;
            right: 20px;
            background: #ffde59;
            color: #333;
            padding: 5px 15px;
            border-radius: 20px;
            font-size: 0.8em;
            font-weight: bold;
            transform: rotate(5deg);
        }

        .nivel-info {
            display: flex;
            align-items: center;
            gap: 20px;
            margin-bottom: 15px;
        }

        .nivel-avatar {
            width: 80px;
            height: 80px;
            background: linear-gradient(135deg, #ff6b6b, #ffa726);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 2.5em;
            border: 4px solid white;
            box-shadow: 0 0 20px rgba(255, 107, 107, 0.5);
        }

        .nivel-datos h3 {
            font-size: 1.8em;
            margin-bottom: 5px;
            color: #ffde59;
            text-shadow: 2px 2px 0 rgba(0, 0, 0, 0.3);
        }

        .nivel-bar {
            height: 20px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 10px;
            overflow: hidden;
            margin: 10px 0;
            border: 2px solid rgba(255, 255, 255, 0.3);
        }

        .nivel-fill {
            height: 100%;
            background: linear-gradient(90deg, #4cd964, #5ac8fa, #007aff);
            border-radius: 10px;
            width:
                <?= $porcentaje_nivel ?>
                %;
            transition: width 1s ease;
            position: relative;
            overflow: hidden;
        }

        /* SELECTOR DE TIPO DE SIMULACIÓN */
        .selector-simulacion {
            background: linear-gradient(135deg, #a8edea, #fed6e3);
            padding: 30px;
            border-bottom: 3px dashed #ff6b6b;
            position: relative;
        }

        .selector-simulacion h3 {
            color: #333;
            margin-bottom: 25px;
            font-size: 1.8em;
            text-align: center;
            position: relative;
            display: inline-block;
            left: 50%;
            transform: translateX(-50%);
            padding: 0 20px;
            background: white;
            border-radius: 20px;
            border: 3px solid #ff6b6b;
            box-shadow: 0 5px 15px rgba(255, 107, 107, 0.3);
        }

        .simulacion-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 25px;
            margin-top: 20px;
        }

        .simulacion-card {
            background: white;
            padding: 30px;
            border-radius: 20px;
            text-align: center;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            border: 4px solid transparent;
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            cursor: pointer;
            position: relative;
            overflow: hidden;
        }

        .simulacion-card:hover {
            transform: translateY(-10px) scale(1.02);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
            border-color: #ff6b6b;
        }

        .simulacion-card.activo {
            border-color: #4ecdc4;
            background: linear-gradient(135deg, #f8f9fa, #e3f2fd);
            animation: cardPulse 2s infinite;
        }

        @keyframes cardPulse {

            0%,
            100% {
                box-shadow: 0 10px 30px rgba(78, 205, 196, 0.3);
            }

            50% {
                box-shadow: 0 15px 40px rgba(78, 205, 196, 0.5);
            }
        }

        .simulacion-icon {
            font-size: 3.5em;
            margin-bottom: 20px;
            display: inline-block;
            animation: bounce 2s infinite;
        }

        @keyframes bounce {

            0%,
            100% {
                transform: translateY(0);
            }

            50% {
                transform: translateY(-10px);
            }
        }

        .simulacion-titulo {
            font-size: 1.5em;
            font-weight: bold;
            color: #2c3e50;
            margin-bottom: 15px;
            position: relative;
            display: inline-block;
        }

        .simulacion-titulo::after {
            content: '';
            position: absolute;
            bottom: -5px;
            left: 25%;
            width: 50%;
            height: 3px;
            background: linear-gradient(90deg, transparent, #ff6b6b, transparent);
        }

        .simulacion-descripcion {
            color: #666;
            margin-bottom: 20px;
            line-height: 1.6;
            font-size: 1em;
        }

        .simulacion-badge {
            display: inline-block;
            padding: 8px 20px;
            background: linear-gradient(135deg, #ff6b6b, #ffa726);
            color: white;
            border-radius: 25px;
            font-size: 0.9em;
            font-weight: bold;
            box-shadow: 0 4px 10px rgba(255, 107, 107, 0.3);
        }

        .ecoems-badge {
            position: absolute;
            top: 15px;
            right: 15px;
            background: linear-gradient(135deg, #ff416c, #ff4b2b);
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 0.8em;
            font-weight: bold;
            transform: rotate(5deg);
            box-shadow: 0 4px 15px rgba(255, 65, 108, 0.4);
            border: 2px solid white;
        }

        /* SELECTOR DE MODO */
        .selector-modo {
            background: linear-gradient(135deg, #ffecd2, #fcb69f);
            padding: 30px;
            border-bottom: 3px dashed #4ecdc4;
        }

        .selector-modo h3 {
            color: #333;
            margin-bottom: 25px;
            font-size: 1.8em;
            text-align: center;
            position: relative;
            display: inline-block;
            left: 50%;
            transform: translateX(-50%);
            padding: 0 20px;
            background: white;
            border-radius: 20px;
            border: 3px solid #4ecdc4;
            box-shadow: 0 5px 15px rgba(78, 205, 196, 0.3);
        }

        .modos-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 25px;
            margin-top: 20px;
        }

        .modo-card {
            background: white;
            padding: 30px;
            border-radius: 20px;
            text-align: center;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            border: 4px solid transparent;
            transition: all 0.4s ease;
            cursor: pointer;
            position: relative;
            overflow: hidden;
        }

        .modo-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
            border-color: #4ecdc4;
        }

        .modo-card.activo {
            border-color: #ff6b6b;
            background: linear-gradient(135deg, #f8f9fa, #fff0f0);
        }

        .modo-icon {
            font-size: 3.5em;
            margin-bottom: 20px;
            display: inline-block;
        }

        .modo-titulo {
            font-size: 1.5em;
            font-weight: bold;
            color: #2c3e50;
            margin-bottom: 15px;
        }

        .modo-descripcion {
            color: #666;
            margin-bottom: 20px;
            line-height: 1.6;
            font-size: 1em;
        }

        .modo-badge {
            display: inline-block;
            padding: 8px 20px;
            background: linear-gradient(135deg, #4ecdc4, #44a08d);
            color: white;
            border-radius: 25px;
            font-size: 0.9em;
            font-weight: bold;
            box-shadow: 0 4px 10px rgba(78, 205, 196, 0.3);
        }

        /* TIMER ANIME */
        .timer-container {
            background: linear-gradient(135deg, #ff416c, #ff4b2b);
            color: white;
            padding: 20px;
            text-align: center;
            font-size: 1.2em;
            font-weight: bold;
            display: none;
            border-bottom: 5px solid #ffde59;
            position: relative;
            overflow: hidden;
        }

        .timer {
            font-size: 2em;
            font-weight: bold;
            background: rgba(255, 255, 255, 0.2);
            padding: 15px 30px;
            border-radius: 15px;
            display: inline-block;
            margin: 10px 0;
            border: 3px solid white;
            box-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
            animation: pulse 2s infinite;
        }

        @keyframes pulse {

            0%,
            100% {
                transform: scale(1);
            }

            50% {
                transform: scale(1.05);
            }
        }

        .timer-info {
            font-size: 1em;
            opacity: 0.9;
            margin-top: 10px;
            background: rgba(255, 255, 255, 0.2);
            padding: 10px;
            border-radius: 10px;
            display: inline-block;
        }

        /* ESTADÍSTICAS EN TIEMPO REAL */
        .estadisticas-vivo {
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            padding: 25px;
            border-bottom: 3px solid #ffde59;
        }

        .estadisticas-vivo h3 {
            margin-bottom: 20px;
            font-size: 1.5em;
            display: flex;
            align-items: center;
            gap: 12px;
            color: #ffde59;
        }

        .stats-vivo-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 15px;
            margin-bottom: 20px;
        }

        .stat-vivo-card {
            background: rgba(255, 255, 255, 0.15);
            padding: 20px;
            border-radius: 15px;
            text-align: center;
            backdrop-filter: blur(10px);
            border: 2px solid rgba(255, 255, 255, 0.2);
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }

        .stat-vivo-number {
            font-size: 2.2em;
            font-weight: bold;
            margin-bottom: 8px;
        }

        .stat-vivo-label {
            font-size: 0.95em;
            opacity: 0.9;
        }

        .stat-correcta {
            color: #2ecc71;
            text-shadow: 0 0 10px rgba(46, 204, 113, 0.5);
        }

        .stat-incorrecta {
            color: #e74c3c;
            text-shadow: 0 0 10px rgba(231, 76, 60, 0.5);
        }

        .stat-sin-responder {
            color: #f39c12;
            text-shadow: 0 0 10px rgba(243, 156, 18, 0.5);
        }

        .stat-porcentaje {
            color: #3498db;
            text-shadow: 0 0 10px rgba(52, 152, 219, 0.5);
        }

        /* SELECTOR DE GUÍA ANIME */
        .guia-selector {
            background: linear-gradient(135deg, #e0c3fc, #8ec5fc);
            padding: 30px;
            border-bottom: 3px solid #9575cd;
        }

        .guia-selector h3 {
            color: #333;
            margin-bottom: 25px;
            font-size: 1.8em;
            text-align: center;
            position: relative;
            padding-bottom: 15px;
        }

        .guia-selector h3::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 100px;
            height: 4px;
            background: linear-gradient(90deg, #ff6b6b, #4ecdc4);
            border-radius: 2px;
        }

        /* BÚSQUEDA ESPECÍFICA */
        .busqueda-especifica {
            background: white;
            padding: 25px;
            border-radius: 20px;
            margin-bottom: 25px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            border: 3px solid #ffde59;
        }

        .busqueda-especifica h4 {
            color: #333;
            margin-bottom: 15px;
            font-size: 1.4em;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .busqueda-form {
            display: grid;
            grid-template-columns: 1fr 1fr auto;
            gap: 15px;
            align-items: end;
        }

        @media (max-width: 768px) {
            .busqueda-form {
                grid-template-columns: 1fr;
            }
        }

        .form-group {
            display: flex;
            flex-direction: column;
        }

        .form-group label {
            font-weight: 600;
            color: #2c3e50;
            margin-bottom: 8px;
            font-size: 0.95em;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        input[type="text"],
        select {
            padding: 14px 18px;
            border: 3px solid #e0e0e0;
            border-radius: 15px;
            font-size: 1em;
            transition: all 0.3s ease;
            background: white;
            font-family: inherit;
        }

        input[type="text"]:focus,
        select:focus {
            outline: none;
            border-color: #6a11cb;
            box-shadow: 0 0 0 3px rgba(106, 17, 203, 0.1);
            transform: translateY(-2px);
        }

        .btn-buscar {
            background: linear-gradient(135deg, #6a11cb, #2575fc);
            color: white;
            padding: 14px 30px;
            border: none;
            border-radius: 15px;
            font-size: 1em;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            height: 52px;
        }

        .btn-buscar:hover {
            transform: translateY(-3px);
            box-shadow: 0 10px 20px rgba(106, 17, 203, 0.3);
        }

        .ejemplos-busqueda {
            margin-top: 15px;
            font-size: 0.9em;
            color: #666;
            background: #f8f9fa;
            padding: 12px;
            border-radius: 10px;
            border-left: 4px solid #6a11cb;
        }

        /* FILTROS GRID */
        .filtros-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 25px;
            align-items: start;
        }

        .guias-checkbox-group,
        .materias-checkbox-group {
            background: white;
            padding: 20px;
            border-radius: 20px;
            border: 3px solid #e0e0e0;
            max-height: 300px;
            overflow-y: auto;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
        }

        .guia-checkbox-item,
        .materia-checkbox-item {
            display: flex;
            align-items: center;
            margin-bottom: 12px;
            padding: 12px;
            border-radius: 12px;
            transition: all 0.3s ease;
            cursor: pointer;
            background: #f8f9fa;
        }

        .guia-checkbox-item:hover,
        .materia-checkbox-item:hover {
            background: linear-gradient(135deg, rgba(106, 17, 203, 0.1), rgba(37, 117, 252, 0.1));
            transform: translateX(5px);
        }

        input[type="checkbox"] {
            width: 20px;
            height: 20px;
            margin-right: 15px;
            cursor: pointer;
            accent-color: #6a11cb;
            transform: scale(1.2);
        }

        .guia-checkbox-label,
        .materia-checkbox-label {
            flex: 1;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .guia-year {
            font-weight: bold;
            color: #2c3e50;
            font-size: 1em;
        }

        .guia-name,
        .materia-name {
            color: #666;
            font-size: 0.9em;
        }

        .guia-option {
            font-size: 0.75em;
            padding: 4px 10px;
            border-radius: 10px;
            margin-left: 8px;
            font-weight: bold;
            border: 2px solid transparent;
        }

        .guia-proxima {
            background: linear-gradient(135deg, #ff416c, #ff4b2b);
            color: white;
        }

        .guia-inactiva {
            background: linear-gradient(135deg, #95a5a6, #7f8c8d);
            color: white;
        }

        .guia-disponible {
            background: linear-gradient(135deg, #27ae60, #2ecc71);
            color: white;
        }

        .checkbox-actions {
            display: flex;
            gap: 10px;
            margin-top: 15px;
            padding-top: 15px;
            border-top: 2px dashed #e0e0e0;
        }

        .btn-seleccionar-todo,
        .btn-deseleccionar-todo {
            flex: 1;
            padding: 12px;
            border-radius: 10px;
            font-size: 0.9em;
            border: none;
            cursor: pointer;
            transition: all 0.3s ease;
            font-weight: bold;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
        }

        .btn-seleccionar-todo {
            background: linear-gradient(135deg, #3498db, #2980b9);
            color: white;
        }

        .btn-deseleccionar-todo {
            background: linear-gradient(135deg, #e74c3c, #c0392b);
            color: white;
        }

        select {
            padding: 14px;
            border: 3px solid #e0e0e0;
            border-radius: 15px;
            font-size: 1em;
            background: white;
            cursor: pointer;
            transition: all 0.3s ease;
            appearance: none;
            background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236a11cb' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
            background-repeat: no-repeat;
            background-position: right 15px center;
            background-size: 20px;
        }

        select:hover {
            border-color: #6a11cb;
            transform: translateY(-2px);
        }

        button[type="submit"] {
            background: linear-gradient(135deg, #6a11cb, #2575fc);
            color: white;
            padding: 16px 40px;
            border: none;
            border-radius: 15px;
            font-size: 1.1em;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            width: 100%;
            margin-top: 10px;
        }

        button[type="submit"]:hover {
            transform: translateY(-3px);
            box-shadow: 0 15px 30px rgba(106, 17, 203, 0.4);
        }

        /* PREGUNTAS ESTILO ANIME - CORREGIDO (SIN EMOJI QUE CUBRE) */
        .estadisticas-sesion {
            background: linear-gradient(135deg, #ffecd2, #fcb69f);
            padding: 25px 30px;
            border-bottom: 3px dashed #ff6b6b;
        }

        .estadisticas-sesion h3 {
            color: #333;
            margin-bottom: 15px;
            font-size: 1.8em;
            position: relative;
            display: inline-block;
            padding-bottom: 10px;
        }

        .estadisticas-sesion h3::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 4px;
            background: linear-gradient(90deg, #ff6b6b, #4ecdc4);
            border-radius: 2px;
        }

        .guias-seleccionadas,
        .simulacion-info {
            background: white;
            padding: 15px 20px;
            border-radius: 15px;
            margin-top: 15px;
            font-size: 1em;
            border-left: 5px solid;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
        }

        .guias-seleccionadas {
            border-left-color: #6a11cb;
            background: linear-gradient(135deg, #f3e5f5, #e8eaf6);
        }

        .simulacion-info {
            border-left-color: #ffde59;
            background: linear-gradient(135deg, #fffde7, #fff3e0);
        }

        .pregunta {
            background: white;
            margin: 25px 30px;
            padding: 30px;
            border-radius: 25px;
            box-shadow: 0 15px 40px rgba(0, 0, 0, 0.1);
            border-left: 8px solid #6a11cb;
            border-right: 3px solid #6a11cb;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }

        /* CORRECCIÓN: Eliminado el pseudo-elemento que mostraba el emoji pensando */
        .pregunta::before {
            content: none;
            /* ELIMINADO: estaba cubriendo parte de la pregunta */
        }

        .pregunta:hover {
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
            transform: translateY(-5px);
        }

        .pregunta-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 25px;
            flex-wrap: wrap;
            gap: 15px;
            position: relative;
        }

        .pregunta-header h3 {
            color: #2c3e50;
            font-size: 1.4em;
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            gap: 10px;
        }

        .guia-badge {
            background: linear-gradient(135deg, #6a11cb, #2575fc);
            color: white;
            padding: 8px 20px;
            border-radius: 20px;
            font-size: 0.9em;
            font-weight: bold;
            box-shadow: 0 4px 15px rgba(106, 17, 203, 0.3);
            border: 2px solid white;
            transform: rotate(-2deg);
            display: inline-block;
        }

        .materia-tag,
        .tema-tag {
            background: linear-gradient(135deg, #ff6b6b, #ffa726);
            padding: 8px 16px;
            border-radius: 15px;
            font-size: 0.9em;
            color: white;
            font-weight: bold;
            box-shadow: 0 3px 10px rgba(255, 107, 107, 0.3);
            border: 2px solid white;
            display: inline-flex;
            align-items: center;
            gap: 8px;
        }

        .tema-tag {
            background: linear-gradient(135deg, #4ecdc4, #44a08d);
        }

        /* CORRECCIÓN: Texto de pregunta limpio, sin emoji que cubre */
        .pregunta-texto {
            font-size: 1.2em;
            line-height: 1.6;
            color: #2c3e50;
            margin-bottom: 30px;
            padding: 20px;
            background: linear-gradient(135deg, #f8f9fa, #e9ecef);
            border-radius: 15px;
            border-left: 6px solid #3498db;
            box-shadow: inset 0 2px 10px rgba(0, 0, 0, 0.05);
            position: relative;
        }

        /* CORRECCIÓN: Eliminado el pseudo-elemento del emoji 💭 */
        .pregunta-texto::before {
            content: none;
            /* ELIMINADO: estaba cubriendo parte del texto */
        }

        .opciones-grid {
            display: grid;
            gap: 15px;
            margin-bottom: 20px;
        }

        .opcion {
            padding: 18px 24px;
            border: 3px solid #e0e0e0;
            border-radius: 15px;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            background: white;
            display: flex;
            align-items: center;
            position: relative;
            overflow: hidden;
        }

        .opcion:hover {
            border-color: #6a11cb;
            background: #f8f9fa;
            transform: translateX(10px) scale(1.02);
            box-shadow: 0 10px 25px rgba(106, 17, 203, 0.1);
        }

        .opcion.seleccionada {
            background: linear-gradient(135deg, #e3f2fd, #bbdefb);
            border-color: #2196f3;
            transform: translateX(10px);
        }

        .opcion strong {
            color: #6a11cb;
            margin-right: 15px;
            font-size: 1.2em;
            min-width: 30px;
            text-align: center;
        }

        .resultado {
            margin-top: 20px;
            padding: 20px;
            border-radius: 15px;
            font-weight: bold;
            font-size: 1.1em;
            border: 3px solid transparent;
            animation: slideIn 0.5s ease;
        }

        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateY(20px);
            }

            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .resultado-correcta {
            background: linear-gradient(135deg, #d4edda, #c3e6cb);
            color: #155724;
            border-color: #28a745;
        }

        .resultado-incorrecta {
            background: linear-gradient(135deg, #f8d7da, #f5c6cb);
            color: #721c24;
            border-color: #dc3545;
        }

        /* EXPLICACIONES ANIME */
        .explicacion {
            background: linear-gradient(135deg, #e3f2fd, #bbdefb);
            padding: 25px;
            border-radius: 20px;
            margin-top: 20px;
            border-left: 6px solid #2196f3;
            border-right: 3px solid #2196f3;
            display: none;
            position: relative;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(33, 150, 243, 0.1);
        }

        .explicacion h4 {
            color: #1976d2;
            margin-bottom: 15px;
            font-size: 1.3em;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        /* BOTÓN ENVIAR EXAMEN */
        .btn-enviar-examen {
            background: linear-gradient(135deg, #27ae60, #2ecc71);
            color: white;
            padding: 20px 40px;
            border: none;
            border-radius: 20px;
            font-size: 1.2em;
            font-weight: bold;
            cursor: pointer;
            margin: 30px auto;
            display: block;
            transition: all 0.3s ease;
            box-shadow: 0 10px 30px rgba(39, 174, 96, 0.3);
            border: 3px solid white;
            position: relative;
            overflow: hidden;
        }

        .btn-enviar-examen:hover {
            transform: translateY(-5px) scale(1.05);
            box-shadow: 0 15px 40px rgba(39, 174, 96, 0.4);
        }

        /* RESULTADOS FINALES ANIME */
        .resultados-finales {
            background: linear-gradient(135deg, #ffecd2, #fcb69f);
            padding: 40px;
            border-radius: 30px;
            margin: 30px;
            text-align: center;
            display: none;
            border: 5px solid #ffde59;
            position: relative;
            overflow: hidden;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
        }

        .puntuacion-final {
            font-size: 4em;
            font-weight: bold;
            margin-bottom: 30px;
            background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            text-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
            animation: scorePulse 2s infinite;
        }

        @keyframes scorePulse {

            0%,
            100% {
                transform: scale(1);
            }

            50% {
                transform: scale(1.1);
            }
        }

        .detalles-resultado {
            background: white;
            padding: 30px;
            border-radius: 20px;
            margin: 30px 0;
            box-shadow: 0 15px 40px rgba(0, 0, 0, 0.1);
            border: 3px solid #6a11cb;
        }

        /* SECCIÓN DESCARGAS ANIME */
        .descargas-guias {
            background: linear-gradient(135deg, #a8edea, #fed6e3);
            padding: 40px 30px;
            border-bottom: 3px dashed #ff6b6b;
        }

        .descargas-guias h3 {
            color: #333;
            margin-bottom: 30px;
            font-size: 2em;
            text-align: center;
            position: relative;
            padding-bottom: 15px;
        }

        .descargas-guias h3::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 150px;
            height: 4px;
            background: linear-gradient(90deg, #ff6b6b, #4ecdc4);
            border-radius: 2px;
        }

        .guias-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 25px;
        }

        .guia-descarga-card {
            background: white;
            padding: 25px;
            border-radius: 20px;
            text-align: center;
            box-shadow: 0 15px 40px rgba(0, 0, 0, 0.1);
            border: 3px solid transparent;
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            position: relative;
            overflow: hidden;
        }

        .guia-descarga-card::before {
            content: attr(data-personaje);
            position: absolute;
            top: -30px;
            right: -30px;
            font-size: 6em;
            opacity: 0.1;
            transform: rotate(15deg);
        }

        .guia-descarga-card:hover {
            transform: translateY(-15px) scale(1.05);
            box-shadow: 0 25px 60px rgba(0, 0, 0, 0.15);
            border-color: #6a11cb;
        }

        .guia-descarga-year {
            font-size: 2em;
            font-weight: bold;
            color: #6a11cb;
            margin-bottom: 10px;
            text-shadow: 2px 2px 0 rgba(106, 17, 203, 0.1);
        }

        .guia-descarga-name {
            color: #2c3e50;
            font-size: 1.2em;
            margin-bottom: 20px;
            font-weight: 600;
        }

        .btn-descarga {
            display: inline-block;
            padding: 15px 30px;
            background: linear-gradient(135deg, #6a11cb, #2575fc);
            color: white;
            text-decoration: none;
            border-radius: 15px;
            font-weight: bold;
            transition: all 0.3s ease;
            border: none;
            cursor: pointer;
            font-size: 1em;
            box-shadow: 0 5px 20px rgba(106, 17, 203, 0.3);
            position: relative;
            overflow: hidden;
        }

        .btn-descarga:hover {
            transform: translateY(-5px) scale(1.05);
            box-shadow: 0 15px 40px rgba(106, 17, 203, 0.4);
        }

        .btn-descarga:disabled {
            background: linear-gradient(135deg, #95a5a6, #7f8c8d);
            cursor: not-allowed;
            transform: none;
            box-shadow: none;
        }

        .proximamente-badge {
            background: linear-gradient(135deg, #ff416c, #ff4b2b);
            color: white;
            padding: 10px 20px;
            border-radius: 20px;
            font-size: 0.9em;
            font-weight: bold;
            margin-top: 15px;
            display: inline-block;
            border: 2px solid white;
            box-shadow: 0 5px 15px rgba(255, 65, 108, 0.3);
        }

        /* FOOTER ANIME */
        .footer {
            background: linear-gradient(135deg, #2c3e50, #34495e);
            color: white;
            padding: 30px;
            text-align: center;
            position: relative;
            overflow: hidden;
        }

        .footer p {
            margin-bottom: 15px;
            opacity: 0.9;
            font-size: 1em;
            position: relative;
            z-index: 1;
        }

        .deepseek-badge {
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1));
            padding: 12px 24px;
            border-radius: 20px;
            font-size: 0.9em;
            display: inline-block;
            border: 2px solid rgba(255, 255, 255, 0.3);
            backdrop-filter: blur(10px);
            position: relative;
            z-index: 1;
        }

        /* RESPONSIVE */
        @media (max-width: 768px) {
            body {
                padding: 10px;
            }

            .header h1 {
                font-size: 2em;
                margin-top: 20px;
            }

            .academia-badge {
                position: relative;
                top: auto;
                left: auto;
                margin: 0 auto 15px;
                display: inline-block;
            }

            .btn-volver {
                position: relative;
                top: auto;
                right: auto;
                margin: 10px auto;
                display: inline-flex;
            }

            .instrucciones-grid {
                grid-template-columns: 1fr;
            }

            .simulacion-grid,
            .modos-grid {
                grid-template-columns: 1fr;
            }

            .filtros-grid {
                grid-template-columns: 1fr;
            }

            .busqueda-form {
                grid-template-columns: 1fr;
            }

            .pregunta-header {
                flex-direction: column;
            }

            .pregunta {
                margin: 15px;
                padding: 20px;
            }

            .guias-grid {
                grid-template-columns: 1fr;
            }

            .resultados-finales {
                margin: 15px;
                padding: 25px;
            }

            .puntuacion-final {
                font-size: 3em;
            }
        }

        /* ANIMACIONES EXTRAS */
        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(20px);
            }

            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .pregunta {
            animation: fadeIn 0.5s ease;
        }

        /* BANNER BETA CUSTOM */
        #beta-banner {
            background: linear-gradient(90deg, #1A1A2E, #9D4EDD);
            border-bottom: 2px solid #4ECDC4;
            padding: 8px 0;
            text-align: center;
            font-size: 0.85rem;
            position: fixed;
            top: 0;
            width: 100%;
            z-index: 11000;
        }

        #beta-banner a {
            color: #4ECDC4;
            text-decoration: underline;
            font-weight: bold;
            margin-left: 10px;
        }

        body.with-beta-banner {
            padding-top: 40px !important;
        }
    </style>

</head>

<body class="with-beta-banner">
    <div id="beta-banner">
        <a href="<?= $returnUrl ?>" class="smart-back-link">
            🚀 VOLVER AL DASHBOARD PRINCIPAL (PLATAFORMA 2026)
        </a>
    </div>
    <script>
        (function () {
            const urlParams = new URLSearchParams(window.location.search);
            const originParam = urlParams.get('origin');
            const currentReferer = document.referrer;
            if (originParam) { localStorage.setItem('original_dashboard_url', originParam); }
            else if (currentReferer && (currentReferer.includes('lovable.app') || currentReferer.includes('vercel.app') || currentReferer.includes('localhost'))) {
                localStorage.setItem('original_dashboard_url', currentReferer);
            }
            const savedDashboard = localStorage.getItem('original_dashboard_url');
            if (savedDashboard) {
                document.querySelectorAll('.smart-back-link, .btn-volver, .back-to-dashboard').forEach(link => { link.href = savedDashboard; });
            }
        })();
    </script>

    <div class="container">
        <!-- HEADER ANIME -->
        <div class="header">
            <div class="academia-badge">🎌 Simulador UNAM</div>
            <a href="<?= $returnUrl ?>" class="btn-volver">
                🏠 Volver al Dashboard
            </a>
            <h1>🌸 Simulador UNAM y ECOEMS
                <span class="year-badge" id="badge-modo">
                    <?= $tipo_simulacion == 'completa_ecoems' ? '🏆 Ecoems Completo' : '📚 ' . ucfirst($modo) ?>
                </span>
            </h1>
            <p id="subtitulo-modo">
                <?= $tipo_simulacion == 'completa_ecoems' ?
                    '⚔️ 128 preguntas en 3 horas - ¡Conviértete en un maestro del examen!' :
                    '📖 Aprende con explicaciones detalladas - Dojo de Estudio'
                    ?>
            </p>
        </div>

        <!-- SECCIÓN DE INSTRUCCIONES -->
        <div class="instrucciones">
            <h3>📚 ¿Cómo funciona el simulador?</h3>
            <div class="instrucciones-grid">
                <div class="instruccion-card">
                    <div class="instruccion-numero">1</div>
                    <div class="instruccion-icon">🎯</div>
                    <div class="instruccion-titulo">Selecciona tu entrenamiento</div>
                    <div class="instruccion-descripcion">
                        Elige entre Simulación Personalizada (configurable) o el Examen Completo Ecoems (128 preguntas
                        en 3 horas).
                    </div>
                </div>

                <div class="instruccion-card">
                    <div class="instruccion-numero">2</div>
                    <div class="instruccion-icon">⚙️</div>
                    <div class="instruccion-titulo">Configura tu sesión</div>
                    <div class="instruccion-descripcion">
                        Selecciona las guías, materias y número de preguntas. También puedes buscar preguntas
                        específicas por número.
                    </div>
                </div>

                <div class="instruccion-card">
                    <div class="instruccion-numero">3</div>
                    <div class="instruccion-icon">📚</div>
                    <div class="instruccion-titulo">Dojo de Estudio</div>
                    <div class="instruccion-descripcion">
                        <strong>Modo Estudio Activado:</strong> Aprende con explicaciones detalladas en cada
                        respuesta.
                    </div>
                </div>

                <div class="instruccion-card">
                    <div class="instruccion-numero">4</div>
                    <div class="instruccion-icon">📊</div>
                    <div class="instruccion-titulo">Sigue tu progreso</div>
                    <div class="instruccion-descripcion">
                        Gana experiencia, sube de nivel y mejora tus estadísticas. ¡Conviértete en un maestro UNAM!
                    </div>
                </div>
            </div>

            <div class="simulacion-info" style="margin-top: 25px;">
                💡 <strong>Consejo rápido:</strong> Para buscar preguntas específicas (ej: pregunta 1-5 de la guía
                2025),
                usa el formulario de búsqueda específica en la sección de configuración.
            </div>
        </div>

        <!-- SISTEMA DE NIVELES ANIME -->
        <div class="sistema-niveles">
            <div class="nivel-info">
                <div class="nivel-avatar">
                    <?php
                    $avatar_emoji = $exp_actual >= 1500 ? '👑' :
                        ($exp_actual >= 1000 ? '🧠' :
                            ($exp_actual >= 600 ? '🎓' :
                                ($exp_actual >= 300 ? '📚' : '🌱')));
                    echo $avatar_emoji;
                    ?>
                </div>
                <div class="nivel-datos">
                    <h3><?= $nivel_actual ?> <?= $exp_actual >= 1500 ? '⚡' : '' ?></h3>
                    <div class="nivel-bar">
                        <div class="nivel-fill" style="width: <?= $porcentaje_nivel ?>%"></div>
                    </div>
                    <p>EXP: <?= $exp_actual ?> / <?= $exp_requerida ?> (<?= round($porcentaje_nivel) ?>%)</p>
                </div>
            </div>

            <div class="nivel-stats">
                <div class="stat-card">
                    <div class="stat-number"><?= $_SESSION['estadisticas_usuario']['sesiones_completadas'] ?></div>
                    <div class="stat-label">🎯 Sesiones Completadas</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number"><?= $_SESSION['estadisticas_usuario']['mejor_porcentaje'] ?>%</div>
                    <div class="stat-label">🏅 Mejor Puntuación</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number"><?= $_SESSION['estadisticas_usuario']['total_preguntas'] ?></div>
                    <div class="stat-label">📝 Preguntas Resueltas</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">
                        <?= $_SESSION['estadisticas_usuario']['total_preguntas'] > 0 ?
                            round(($_SESSION['estadisticas_usuario']['correctas'] / $_SESSION['estadisticas_usuario']['total_preguntas']) * 100) : 0 ?>%
                    </div>
                    <div class="stat-label">📈 Efectividad Total</div>
                </div>
            </div>
        </div>

        <!-- SELECTOR DE TIPO DE SIMULACIÓN -->
        <div class="selector-simulacion">
            <h3>🎯 Elige tu Misión de Estudio</h3>
            <div class="simulacion-grid">
                <div class="simulacion-card <?= $tipo_simulacion == 'personalizada' ? 'activo' : '' ?>"
                    onclick="cambiarTipoSimulacion('personalizada')">
                    <div class="simulacion-icon">⚡</div>
                    <div class="simulacion-titulo">Entrenamiento Personalizado</div>
                    <div class="simulacion-descripcion">
                        Configura a tu gusto: guías, materias, cantidad de preguntas. Perfecto para práctica
                        dirigida.
                    </div>
                    <div class="simulacion-badge">Flexibilidad Total</div>
                </div>

                <div class="simulacion-card <?= $tipo_simulacion == 'completa_ecoems' ? 'activo' : '' ?>"
                    onclick="cambiarTipoSimulacion('completa_ecoems')">
                    <div class="ecoems-badge">🏆 ECOEMS</div>
                    <div class="simulacion-icon">👑</div>
                    <div class="simulacion-titulo">Examen del Maestro</div>
                    <div class="simulacion-descripcion">
                        128 preguntas en 3 horas. Réplica exacta del examen real. ¡El desafío definitivo!
                    </div>
                    <div class="simulacion-badge">Desafío Extremo</div>
                </div>
            </div>
        </div>

        <!-- SELECTOR DE MODO (DESACTIVADO - SOLO MODO ESTUDIO) -->
        <?php /* if ($tipo_simulacion == 'personalizada'): ?>
<div class="selector-modo">
<h3>📖 Selecciona tu Estilo de Aprendizaje</h3>
<div class="modos-grid">
<div class="modo-card <?= $modo == 'estudio' ? 'activo' : '' ?>" 
onclick="cambiarModo('estudio')">
<div class="modo-icon">📚</div>
<div class="modo-titulo">Dojo de Estudio</div>
<div class="modo-descripcion">
Aprende con explicaciones detalladas. Sin presión, solo conocimiento puro. Ideal para repasar conceptos.
</div>
<div class="modo-badge">Para Aprender</div>
</div>

<div class="modo-card <?= $modo == 'examen' ? 'activo' : '' ?>" 
onclick="cambiarModo('examen')">
<div class="modo-icon">⚔️</div>
<div class="modo-titulo">Batalla de Conocimientos</div>
<div class="modo-descripcion">
Tiempo limitado, preguntas aleatorias. Evalúa tu preparación real para el examen.
</div>
<div class="modo-badge">Para Probar tu Poder</div>
</div>
</div>
</div>
<?php endif; */ ?>

        <!-- TIMER -->
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
                        ⏰ <strong>Batalla Épica:</strong> 128 preguntas en 3 horas (180 minutos)
                    <?php else: ?>
                        ⏰ Tiempo asignado: <?= $tiempo_examen_minutos ?> minutos para <?= count($preguntas) ?> preguntas
                    <?php endif; ?>
                </div>
            </div>
        <?php endif; ?>

        <!-- ESTADÍSTICAS EN TIEMPO REAL -->
        <?php if (!empty($preguntas) && $modo == 'estudio' && $tipo_simulacion == 'personalizada'): ?>
            <div class="estadisticas-vivo">
                <h3>📈 Tu Progreso en la Batalla</h3>
                <div class="stats-vivo-grid">
                    <div class="stat-vivo-card">
                        <div class="stat-vivo-number stat-correcta" id="contador-correctas">0</div>
                        <div class="stat-vivo-label">✅ Aciertos</div>
                    </div>
                    <div class="stat-vivo-card">
                        <div class="stat-vivo-number stat-incorrecta" id="contador-incorrectas">0</div>
                        <div class="stat-vivo-label">❌ Errores</div>
                    </div>
                    <div class="stat-vivo-card">
                        <div class="stat-vivo-number stat-sin-responder" id="contador-pendientes">
                            <?= count($preguntas) ?>
                        </div>
                        <div class="stat-vivo-label">⏳ Pendientes</div>
                    </div>
                    <div class="stat-vivo-card">
                        <div class="stat-vivo-number stat-porcentaje" id="porcentaje-acierto">0%</div>
                        <div class="stat-vivo-label">🎯 Precisión</div>
                    </div>
                </div>
            </div>
        <?php endif; ?>

        <!-- SELECTOR DE GUÍA Y MATERIAS -->
        <div class="guia-selector" id="configuracion-avanzada"
            style="<?= $tipo_simulacion == 'completa_ecoems' ? 'display: none;' : '' ?>">
            <h3>🎯 Configura tu Entrenamiento</h3>

            <!-- BÚSQUEDA ESPECÍFICA -->
            <div class="busqueda-especifica">
                <h4>🔍 Buscar Preguntas Específicas</h4>
                <form method="GET" id="busqueda-form" class="busqueda-form">
                    <input type="hidden" name="modo" value="<?= $modo ?>">
                    <input type="hidden" name="tipo_simulacion" value="personalizada">

                    <div class="form-group">
                        <label for="guia_busqueda">📅 Selecciona Guía:</label>
                        <select name="guia_busqueda" id="guia_busqueda" required>
                            <option value="">-- Elige una guía --</option>
                            <?php foreach ($guias as $guia): ?>
                                <?php if ($guia['activa']): ?>
                                    <option value="<?= $guia['year'] ?>" <?= $guia_busqueda == $guia['year'] ? 'selected' : '' ?>>
                                        <?= $guia['year'] ?> - <?= $guia['nombre'] ?>
                                    </option>
                                <?php endif; ?>
                            <?php endforeach; ?>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="busqueda_especifica">🔢 Números de Pregunta:</label>
                        <input type="text" name="busqueda_especifica" id="busqueda_especifica"
                            value="<?= htmlspecialchars($busqueda_especifica) ?>" placeholder="Ej: 1, 1-5, 1,3,5"
                            required>
                    </div>

                    <button type="submit" class="btn-buscar">
                        🔎 Buscar Preguntas Específicas
                    </button>
                </form>

                <div class="ejemplos-busqueda">
                    <strong>💡 Ejemplos de búsqueda:</strong><br>
                    • "1" - Muestra la pregunta 1 de la guía seleccionada<br>
                    • "1-5" - Muestra las preguntas del 1 al 5<br>
                    • "1,3,5,7" - Muestra solo las preguntas 1, 3, 5 y 7<br>
                    • "10-20" - Muestra preguntas del 10 al 20
                </div>
            </div>

            <!-- CONFIGURACIÓN NORMAL -->
            <form method="GET" id="config-form" class="filtros-grid">
                <input type="hidden" name="modo" id="input-modo" value="<?= $modo ?>">
                <input type="hidden" name="tipo_simulacion" id="input-tipo-simulacion" value="<?= $tipo_simulacion ?>">

                <div class="form-group">
                    <label for="guia_years">📅 Selecciona las Guías:</label>
                    <div class="guias-checkbox-group">
                        <?php foreach ($guias as $guia): ?>
                            <div class="guia-checkbox-item">
                                <input type="checkbox" name="guia_years[]" value="<?= $guia['year'] ?>"
                                    id="guia_<?= $guia['year'] ?>" <?= in_array($guia['year'], $guia_years) ? 'checked' : '' ?>     <?= !$guia['activa'] ? 'disabled' : '' ?>>
                                <label for="guia_<?= $guia['year'] ?>" class="guia-checkbox-label">
                                    <div>
                                        <span class="guia-year"><?= $guia['year'] ?></span>
                                        <span class="guia-name"> - <?= $guia['nombre'] ?></span>
                                    </div>
                                    <?php if ($guia['es_proxima']): ?>
                                        <span class="guia-option guia-proxima">PRÓXIMO</span>
                                    <?php elseif (!$guia['activa']): ?>
                                        <span class="guia-option guia-inactiva">EN PREPARACIÓN</span>
                                    <?php else: ?>
                                        <span class="guia-option guia-disponible">DISPONIBLE</span>
                                    <?php endif; ?>
                                </label>
                            </div>
                        <?php endforeach; ?>
                        <div class="checkbox-actions">
                            <button type="button" class="btn-seleccionar-todo" onclick="seleccionarTodasGuias(true)">
                                ✅ Seleccionar Todas
                            </button>
                            <button type="button" class="btn-deseleccionar-todo" onclick="seleccionarTodasGuias(false)">
                                ❌ Deseleccionar Todas
                            </button>
                        </div>
                    </div>
                </div>

                <div class="form-group">
                    <label for="materias">📖 Selecciona las Materias:</label>
                    <div class="materias-checkbox-group">
                        <?php foreach ($todas_materias as $materia): ?>
                            <div class="materia-checkbox-item">
                                <input type="checkbox" name="materias[]" value="<?= htmlspecialchars($materia) ?>"
                                    id="materia_<?= preg_replace('/[^a-z0-9]/i', '_', strtolower($materia)) ?>"
                                    <?= in_array($materia, $materias_seleccionadas) ? 'checked' : '' ?>>
                                <label for="materia_<?= preg_replace('/[^a-z0-9]/i', '_', strtolower($materia)) ?>"
                                    class="materia-checkbox-label">
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
                            <button type="button" class="btn-seleccionar-todo" onclick="seleccionarTodasMaterias(true)">
                                ✅ Todas las Materias
                            </button>
                            <button type="button" class="btn-deseleccionar-todo"
                                onclick="seleccionarTodasMaterias(false)">
                                ❌ Ninguna Materia
                            </button>
                        </div>
                    </div>
                </div>

                <div class="form-group">
                    <label for="limit">📊 Cantidad de Preguntas:</label>
                    <select name="limit" id="limit">
                        <option value="5" <?= $limit == 5 ? 'selected' : '' ?>>⚡ 5 preguntas (Entrenamiento rápido)
                        </option>
                        <option value="10" <?= $limit == 10 ? 'selected' : '' ?>>🎯 10 preguntas (Sesión normal)
                        </option>
                        <option value="20" <?= $limit == 20 ? 'selected' : '' ?>>📚 20 preguntas (Sesión intensa)
                        </option>
                        <option value="50" <?= $limit == 50 ? 'selected' : '' ?>>🏆 50 preguntas (Desafío mayor)
                        </option>
                        <option value="128" <?= $limit == 128 ? 'selected' : '' ?>>👑 128 preguntas (Simulación
                            completa)
                        </option>
                    </select>

                    <button type="submit" style="margin-top: 20px;">
                        🚀 ¡Comenzar Entrenamiento!
                    </button>
                </div>
            </form>
        </div>

        <!-- CONTENIDO DE PREGUNTAS -->
        <?php if (!empty($preguntas)): ?>
            <div class="estadisticas-sesion">
                <h3>
                    <?php if (!empty($busqueda_especifica)): ?>
                        🔍 Resultados de Búsqueda: Preguntas <?= $busqueda_especifica ?> de Guía <?= $guia_busqueda ?>
                    <?php elseif ($tipo_simulacion == 'completa_ecoems'): ?>
                        ⚔️ Batalla Épica: Examen Completo Ecoems
                    <?php else: ?>
                        📖 <?= $modo == 'estudio' ? 'Dojo de Estudio' : 'Batalla de Conocimientos' ?>
                    <?php endif; ?>
                </h3>

                <p>
                    <?php if (!empty($busqueda_especifica)): ?>
                        Mostrando <strong><?= count($preguntas) ?></strong> preguntas específicas de la guía
                        <strong><?= $guia_busqueda ?></strong>
                    <?php else: ?>
                        Mostrando <strong><?= count($preguntas) ?></strong> preguntas
                        <?= (!empty($materias_seleccionadas) && count($materias_seleccionadas) < count($todas_materias)) ?
                            'de ' . count($materias_seleccionadas) . ' materias seleccionadas' :
                            'de todas las materias' ?>
                    <?php endif; ?>
                </p>

                <?php if ($tipo_simulacion == 'completa_ecoems'): ?>
                    <div class="simulacion-info">
                        🏆 <strong>¡Desafío Épico Activado!</strong> Esta es una réplica exacta del examen real Ecoems UNAM.
                        128 preguntas en 3 horas. ¡Demuestra tu valía!
                    </div>
                <?php endif; ?>

                <?php if (empty($busqueda_especifica)): ?>
                    <div class="guias-seleccionadas">
                        📚 <strong>Guías seleccionadas:</strong>
                        <?= implode(', ', array_map(function ($year) use ($guias) {
                            $guia = array_filter($guias, function ($g) use ($year) {
                                return $g['year'] == $year;
                            });
                            $guia = reset($guia);
                            return $guia ? $year . ' (' . $guia['nombre'] . ')' : $year;
                        }, $guia_years)) ?>
                    </div>
                <?php endif; ?>
            </div>

            <?php foreach ($preguntas as $index => $pregunta): ?>
                <div class="pregunta" id="pregunta-<?= $pregunta['id'] ?>" data-pregunta-id="<?= $pregunta['id'] ?>"
                    data-materia="<?= htmlspecialchars($pregunta['materia_nombre']) ?>" data-opciones='<?= json_encode([
                          'A' => $pregunta['opcion_a'],
                          'B' => $pregunta['opcion_b'],
                          'C' => $pregunta['opcion_c'],
                          'D' => $pregunta['opcion_d']
                      ]) ?>'>
                    <div class="pregunta-header">
                        <div>
                            <h3>
                                <?php if (!empty($busqueda_especifica)): ?>
                                    🔍 Pregunta <?= $pregunta['numero_pregunta'] ?>
                                <?php else: ?>
                                    📝 Pregunta <?= $index + 1 ?>
                                <?php endif; ?>
                                <span class="guia-badge">Guía <?= $pregunta['guia_year'] ?></span>
                            </h3>
                            <p style="color: #666; font-size: 0.9em; margin-top: 8px;">
                                <?php if ($tipo_simulacion == 'completa_ecoems'): ?>
                                    ⚔️ Batalla Épica: <?= $index + 1 ?> de <?= count($preguntas) ?>
                                <?php elseif (!empty($busqueda_especifica)): ?>
                                    🔍 Búsqueda específica
                                <?php else: ?>
                                    <?= $modo == 'estudio' ? '📖 Dojo de Estudio' : '⚔️ Batalla' ?>: <?= $index + 1 ?> de
                                    <?= count($preguntas) ?>
                                <?php endif; ?>
                            </p>
                        </div>
                        <div style="display: flex; gap: 12px; flex-wrap: wrap;">
                            <span class="materia-tag">📖 <?= htmlspecialchars($pregunta['materia_nombre']) ?></span>
                            <?php if (!empty($pregunta['tema'])): ?>
                                <span class="tema-tag">🏷️ <?= htmlspecialchars($pregunta['tema']) ?></span>
                            <?php endif; ?>
                        </div>
                    </div>

                    <!-- TEXTO DE PREGUNTA LIMPIO (SIN EMOJI QUE CUBRE) -->
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

                    <!-- Explicación REAL -->
                    <?php if ($modo == 'estudio' && $tipo_simulacion == 'personalizada'): ?>
                        <div class="explicacion" id="explicacion-<?= $pregunta['id'] ?>">
                            <h4>💡 Explicación del Maestro</h4>
                            <div id="contenido-explicacion-<?= $pregunta['id'] ?>">
                                <!-- El contenido se llenará con JavaScript -->
                            </div>
                        </div>
                    <?php endif; ?>

                    <div id="resultado-<?= $pregunta['id'] ?>" class="resultado"></div>
                </div>
            <?php endforeach; ?>

            <!-- Botón para enviar examen -->
            <?php if ($modo == 'examen' || $tipo_simulacion == 'completa_ecoems'): ?>
                <button class="btn-enviar-examen" id="btn-enviar-examen" onclick="finalizarExamen()">
                    <?php if ($tipo_simulacion == 'completa_ecoems'): ?>
                        🏁 ¡Finalizar Batalla y Ver Resultados!
                    <?php else: ?>
                        🏁 ¡Terminar Examen y Ver Puntuación!
                    <?php endif; ?>
                </button>
            <?php endif; ?>

            <!-- Resultados finales -->
            <div class="resultados-finales" id="resultados-finales">
                <h2>🏆 Resultados de tu Batalla</h2>
                <div class="puntuacion-final" id="puntuacion-final">0%</div>

                <div class="detalles-resultado">
                    <h4>📊 Detalles de tu Desempeño</h4>
                    <div id="detalles-resultado">
                        <!-- Se llenará con JavaScript -->
                    </div>
                </div>

                <div class="resumen-preguntas" id="resumen-preguntas">
                    <h4>📝 Resumen de Preguntas</h4>
                    <!-- Se llenará con JavaScript -->
                </div>

                <div style="margin: 25px 0;">
                    <p id="mensaje-resultado"></p>
                </div>

                <div style="display: flex; gap: 15px; justify-content: center;">
                    <button class="btn-descarga" onclick="location.reload()" style="margin-top: 15px;">
                        🔄 ¡Otra Batalla!
                    </button>
                    <button class="btn-descarga" onclick="window.scrollTo(0, 0)"
                        style="background: linear-gradient(135deg, #ff6b6b, #ffa726); margin-top: 15px;">
                        ⬆️ Volver Arriba
                    </button>
                </div>
            </div>

        <?php elseif (!empty($error_message)): ?>
            <div class="estadisticas-sesion">
                <h3>❌ Error en la búsqueda</h3>
                <div class="resultado resultado-incorrecta" style="margin: 20px 0; padding: 20px;">
                    <p><?= htmlspecialchars($error_message) ?></p>
                    <button onclick="location.reload()" class="btn-descarga" style="margin-top: 15px;">
                        🔄 Intentar de Nuevo
                    </button>
                </div>
            </div>
        <?php else: ?>
            <div class="estadisticas-sesion">
                <h3>🎯 Configura tu Entrenamiento</h3>
                <p style="font-size: 1.1em;">
                    <?php if ($tipo_simulacion == 'completa_ecoems'): ?>
                        Para iniciar la <strong>Batalla Épica Ecoems</strong> (128 preguntas en 3 horas), simplemente haz
                        clic
                        en "¡Comenzar Entrenamiento!".
                    <?php elseif (!empty($busqueda_especifica)): ?>
                        Usa el formulario de búsqueda específica para encontrar preguntas exactas por número y guía.
                    <?php else: ?>
                        Selecciona al menos una guía y una materia, luego haz clic en "¡Comenzar Entrenamiento!" para
                        empezar tu
                        viaje de aprendizaje.
                    <?php endif; ?>
                </p>
                <div class="simulacion-info" style="margin-top: 20px;">
                    💡 <strong>Consejo del Maestro:</strong> Comienza con sesiones cortas de 10 preguntas y ve
                    aumentando la
                    dificultad gradualmente.
                    ¡La práctica constante es la clave del éxito!
                </div>
            </div>
        <?php endif; ?>

        <!-- SECCIÓN DESCARGAS -->
        <div class="descargas-guias">
            <h3>📥 Descarga tus Guías de Estudio</h3>
            <div class="guias-grid">
                <?php foreach ($guias_descarga as $guia): ?>
                    <div class="guia-descarga-card" data-personaje="<?= $guia['personaje'] ?>">
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
                                <div class="proximamente-badge">¡Próximamente!</div>
                                <button class="btn-descarga" disabled>
                                    ⏳ En Preparación
                                </button>
                            <?php endif; ?>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>
        </div>

        <!-- FOOTER -->
        <div class="footer">
            <p>© 2025 AnimeStudy Academy - Simulador UNAM con Estilo Anime</p>
            <div class="deepseek-badge">✨ Desarrollado con tecnología DeepSeek</div>
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
            busquedaEspecifica: <?= !empty($busqueda_especifica) ? 'true' : 'false' ?>,
            respuestasSeleccionadas: {},
            resultadosPreguntas: {},
            tiempoExamen: <?= $tipo_simulacion == 'completa_ecoems' ? 180 * 60 : $tiempo_examen_segundos ?>,
            tiempoPorPregunta: <?= $tiempo_por_pregunta ?>,
            examenIniciado: <?= (!empty($preguntas) && ($modo == 'examen' || $tipo_simulacion == 'completa_ecoems')) ? 'true' : 'false' ?>
        };

        let timer;
        let tiempoRestante = estadisticas.tiempoExamen;
        let examenEnCurso = false;

        // Inicializar según el modo
        function inicializarModo() {
            if ((estadisticas.modo === 'examen' || estadisticas.tipoSimulacion === 'completa_ecoems') && estadisticas.totalPreguntas > 0) {
                document.getElementById('timer-container').style.display = 'block';
                iniciarTimer();
                examenEnCurso = true;

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

        // Timer para modo examen
        function iniciarTimer() {
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

                const tiempoTotal = estadisticas.tiempoExamen;
                if (tiempoRestante <= tiempoTotal * 0.2) {
                    document.getElementById('timer').classList.add('urgente');
                }

                if (tiempoRestante <= 0) {
                    finalizarExamen();
                }
            }, 1000);
        }

        // Cambiar entre tipos de simulación
        function cambiarTipoSimulacion(tipo) {
            document.getElementById('input-tipo-simulacion').value = tipo;

            if (tipo === 'completa_ecoems') {
                document.getElementById('input-modo').value = 'examen';
                document.getElementById('configuracion-avanzada').style.display = 'none';

                document.querySelectorAll('input[name="guia_years[]"]').forEach(checkbox => {
                    if (!checkbox.disabled) checkbox.checked = true;
                });
                document.querySelectorAll('input[name="materias[]"]').forEach(checkbox => {
                    checkbox.checked = true;
                });
            } else {
                document.getElementById('configuracion-avanzada').style.display = 'block';
            }

            document.getElementById('config-form').submit();
        }

        // Cambiar entre modos
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

        // Función principal para seleccionar respuestas
        async function seleccionarRespuesta(preguntaId, respuesta, materia) {
            const opciones = document.querySelectorAll(`#pregunta-${preguntaId} .opcion`);
            const resultadoDiv = document.getElementById(`resultado-${preguntaId}`);

            estadisticas.respuestasSeleccionadas[preguntaId] = respuesta;

            // En modo examen o simulación completa
            if (estadisticas.modo === 'examen' || estadisticas.tipoSimulacion === 'completa_ecoems') {
                opciones.forEach(opcion => {
                    opcion.classList.remove('seleccionada');
                    opcion.style.background = 'white';
                    opcion.style.borderColor = '#e0e0e0';
                });

                opciones.forEach(opcion => {
                    if (opcion.dataset.opcion === respuesta) {
                        opcion.classList.add('seleccionada');
                        opcion.style.background = 'linear-gradient(135deg, #e3f2fd, #bbdefb)';
                        opcion.style.borderColor = '#2196f3';
                    }
                });

                estadisticas.respondidas++;
                return;
            }

            // Modo estudio
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
                estadisticas.resultadosPreguntas[preguntaId] = resultado;

                const explicacionDiv = document.getElementById(`explicacion-${preguntaId}`);
                const contenidoExplicacion = document.getElementById(`contenido-explicacion-${preguntaId}`);

                if (resultado.es_correcta) {
                    estadisticas.correctas++;
                    estadisticas.porMateria[materia].correctas++;
                    resultadoDiv.innerHTML = '<div class="resultado resultado-correcta">✅ <strong>¡Correcto!</strong> ¡Buen trabajo, joven aprendiz!</div>';
                } else {
                    estadisticas.incorrectas++;
                    estadisticas.porMateria[materia].incorrectas++;
                    resultadoDiv.innerHTML = `<div class="resultado resultado-incorrecta">❌ <strong>Incorrecto.</strong> La respuesta correcta es: <strong>${resultado.respuesta_correcta}</strong></div>`;
                }

                contenidoExplicacion.innerHTML = `
                <div style="margin-bottom: 15px; font-size: 1.1em;">
                    <strong>🎯 Análisis del Maestro:</strong> ${resultado.explicacion}
                </div>
            `;

                if (resultado.es_correcta) {
                    contenidoExplicacion.innerHTML += `
                    <div style="background: linear-gradient(135deg, #d4edda, #c3e6cb); padding: 15px; border-radius: 10px; margin-top: 15px; border-left: 4px solid #28a745;">
                        <strong>✨ ¡Excelente trabajo!</strong> Tu conocimiento en esta área es sólido. Sigue así, joven maestro.
                    </div>
                `;
                } else {
                    contenidoExplicacion.innerHTML += `
                    <div style="background: linear-gradient(135deg, #fff3cd, #ffeaa7); padding: 15px; border-radius: 10px; margin-top: 15px; border-left: 4px solid #ffc107;">
                        <strong>📚 Para mejorar:</strong> Te recomiendo repasar los conceptos relacionados. ¡No te rindas, todo gran maestro empezó así!
                    </div>
                `;
                }

                if (explicacionDiv) {
                    explicacionDiv.style.display = 'block';
                }

                estadisticas.respondidas++;
                actualizarEstadisticas();

                // Colorear opciones
                opciones.forEach(opcion => {
                    opcion.style.pointerEvents = 'none';
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
                resultadoDiv.innerHTML = '<div class="resultado resultado-incorrecta">⚠️ Error al verificar la respuesta. ¡Inténtalo de nuevo!</div>';
            }
        }

        // Finalizar examen y mostrar resultados
        async function finalizarExamen() {
            if (timer) {
                clearInterval(timer);
            }

            examenEnCurso = false;

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

                        const resultadoDiv = document.getElementById(`resultado-${preguntaId}`);
                        const opciones = pregunta.querySelectorAll('.opcion');

                        if (resultado.es_correcta) {
                            resultadoDiv.innerHTML = '<div class="resultado resultado-correcta">✅ ¡Correcto! ¡Bien hecho!</div>';
                        } else {
                            resultadoDiv.innerHTML = `<div class="resultado resultado-incorrecta">❌ Correcta: ${resultado.respuesta_correcta}</div>`;
                        }

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

            const puntuacion = Math.round((correctas / preguntas.length) * 100);
            mostrarResultadosFinales(puntuacion, correctas, totalRespondidas, preguntas.length);
        }

        // Mostrar resultados finales
        function mostrarResultadosFinales(puntuacion, correctas, totalRespondidas, totalPreguntas) {
            document.getElementById('puntuacion-final').textContent = puntuacion + '%';

            const detallesDiv = document.getElementById('detalles-resultado');
            detallesDiv.innerHTML = `
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; text-align: left;">
                <div style="background: #f8f9fa; padding: 15px; border-radius: 10px; border-left: 4px solid #6a11cb;">
                    <strong>Total de preguntas:</strong><br>
                    <span style="font-size: 1.5em; color: #6a11cb;">${totalPreguntas}</span>
                </div>
                <div style="background: #f8f9fa; padding: 15px; border-radius: 10px; border-left: 4px solid #27ae60;">
                    <strong>Respondidas:</strong><br>
                    <span style="font-size: 1.5em; color: #27ae60;">${totalRespondidas}</span>
                </div>
                <div style="background: #f8f9fa; padding: 15px; border-radius: 10px; border-left: 4px solid #3498db;">
                    <strong>Correctas:</strong><br>
                    <span style="font-size: 1.5em; color: #3498db;">${correctas}</span>
                </div>
                <div style="background: #f8f9fa; padding: 15px; border-radius: 10px; border-left: 4px solid #e74c3c;">
                    <strong>Incorrectas:</strong><br>
                    <span style="font-size: 1.5em; color: #e74c3c;">${totalRespondidas - correctas}</span>
                </div>
                <div style="background: #f8f9fa; padding: 15px; border-radius: 10px; border-left: 4px solid #f39c12;">
                    <strong>Sin responder:</strong><br>
                    <span style="font-size: 1.5em; color: #f39c12;">${totalPreguntas - totalRespondidas}</span>
                </div>
                <div style="background: #f8f9fa; padding: 15px; border-radius: 10px; border-left: 4px solid #9b59b6;">
                    <strong>Puntuación final:</strong><br>
                    <span style="font-size: 1.5em; color: #9b59b6;">${puntuacion}%</span>
                </div>
            </div>
        `;

            mostrarResumenPreguntas();

            const mensajeResultado = document.getElementById('mensaje-resultado');
            if (estadisticas.tipoSimulacion === 'completa_ecoems') {
                if (puntuacion >= 90) {
                    mensajeResultado.innerHTML = '🎉 <strong>¡Leyenda Viva!</strong> Tu puntuación demuestra que estás listo para conquistar el examen real Ecoems UNAM. ¡Eres digno del título de Maestro! ⚔️';
                } else if (puntuacion >= 70) {
                    mensajeResultado.innerHTML = '👍 <strong>¡Gran Guerrero!</strong> Tienes un excelente nivel para el examen Ecoems. Con un poco más de entrenamiento, alcanzarás la perfección. 🛡️';
                } else if (puntuacion >= 50) {
                    mensajeResultado.innerHTML = '📚 <strong>¡Buen Aprendiz!</strong> Vas por buen camino. Sigue entrenando duro para mejorar tu puntuación en el Ecoems. 💪';
                } else {
                    mensajeResultado.innerHTML = '💪 <strong>¡No te rindas, joven aprendiz!</strong> Cada gran maestro comenzó así. Revisa las guías y sigue practicando. ¡El poder del conocimiento está en ti! 🌟';
                }
            } else {
                if (puntuacion >= 90) {
                    mensajeResultado.innerHTML = '🎉 <strong>¡Maestro Supremo!</strong> Dominas completamente los temas. Tu conocimiento es impresionante. ¡Sigue así! 👑';
                } else if (puntuacion >= 70) {
                    mensajeResultado.innerHTML = '👍 <strong>¡Guerrero del Conocimiento!</strong> Tienes un gran dominio de los temas. Con un poco más de práctica, alcanzarás la maestría. ⚔️';
                } else if (puntuacion >= 50) {
                    mensajeResultado.innerHTML = '📚 <strong>¡Aprendiz Prometedor!</strong> Vas por buen camino. Sigue practicando para mejorar tus habilidades. 🌱';
                } else {
                    mensajeResultado.innerHTML = '💪 <strong>¡No te desanimes!</strong> Todo gran viaje comienza con un paso. Sigue entrenando y pronto verás grandes resultados. ✨';
                }
            }

            document.getElementById('resultados-finales').style.display = 'block';
            document.getElementById('resultados-finales').scrollIntoView({ behavior: 'smooth' });
        }

        // Funciones de estadísticas
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
            }
        }

        function actualizarEstadisticas() {
            if (estadisticas.modo === 'estudio' && estadisticas.tipoSimulacion === 'personalizada') {
                const total = estadisticas.totalPreguntas;
                const correctas = estadisticas.correctas;
                const incorrectas = estadisticas.incorrectas;
                const pendientes = total - (correctas + incorrectas);
                const porcentaje = total > 0 ? Math.round((correctas / total) * 100) : 0;

                document.getElementById('contador-correctas').textContent = correctas;
                document.getElementById('contador-incorrectas').textContent = incorrectas;
                document.getElementById('contador-pendientes').textContent = pendientes;
                document.getElementById('porcentaje-acierto').textContent = porcentaje + '%';
            }
        }

        // Inicializar al cargar la página
        document.addEventListener('DOMContentLoaded', function () {
            inicializarModo();

            const form = document.getElementById('config-form');
            if (form) {
                form.addEventListener('submit', function (e) {
                    if (estadisticas.tipoSimulacion === 'completa_ecoems') {
                        return true;
                    }

                    const checkboxesGuias = document.querySelectorAll('input[name="guia_years[]"]:checked');
                    const checkboxesMaterias = document.querySelectorAll('input[name="materias[]"]:checked');

                    if (checkboxesGuias.length === 0) {
                        e.preventDefault();
                        alert('⚠️ ¡Oh, joven aprendiz! Debes seleccionar al menos una guía para comenzar tu entrenamiento.');
                        return false;
                    }

                    if (checkboxesMaterias.length === 0) {
                        e.preventDefault();
                        alert('⚠️ ¡Recuerda, maestro! Debes seleccionar al menos una materia para tu entrenamiento.');
                        return false;
                    }
                });
            }

            // Validar formulario de búsqueda específica
            const busquedaForm = document.getElementById('busqueda-form');
            if (busquedaForm) {
                busquedaForm.addEventListener('submit', function (e) {
                    const guiaBusqueda = document.getElementById('guia_busqueda').value;
                    const busquedaInput = document.getElementById('busqueda_especifica').value;

                    if (!guiaBusqueda) {
                        e.preventDefault();
                        alert('⚠️ Por favor selecciona una guía para buscar preguntas específicas.');
                        return false;
                    }

                    if (!busquedaInput.trim()) {
                        e.preventDefault();
                        alert('⚠️ Por favor ingresa los números de pregunta que deseas buscar.');
                        return false;
                    }

                    // Validar formato de números
                    const regex = /^(\d+(-\d+)?)(,\s*\d+(-\d+)?)*$/;
                    if (!regex.test(busquedaInput)) {
                        e.preventDefault();
                        alert('⚠️ Formato incorrecto. Usa: "1", "1-5", o "1,3,5"');
                        return false;
                    }
                });
            }
        });
    </script>
</body>

</html>