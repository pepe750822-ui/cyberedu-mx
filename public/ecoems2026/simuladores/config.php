<?php
// config.php CORREGIDO para Hostinger
error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);

// Configuración de la base de datos
define('DB_HOST', 'localhost');
define('DB_USER', 'u149467987_ecoemuser');
define('DB_PASS', 'Gopl750822#');
define('DB_NAME', 'u149467987_ecoems2026');

// Intentar conexión
try {
    $pdo = new PDO("mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4", DB_USER, DB_PASS);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    // Mostrar error detallado para diagnóstico
    die("Error de conexión a la base de datos: " . $e->getMessage());
}

// Función para convertir color HEX a RGB
if (!function_exists('hex2rgb')) {
    function hex2rgb($hex)
    {
        $hex = str_replace("#", "", $hex);
        if (strlen($hex) == 3) {
            $r = hexdec(substr($hex, 0, 1) . substr($hex, 0, 1));
            $g = hexdec(substr($hex, 1, 1) . substr($hex, 1, 1));
            $b = hexdec(substr($hex, 2, 1) . substr($hex, 2, 1));
        } else {
            $r = hexdec(substr($hex, 0, 2));
            $g = hexdec(substr($hex, 2, 2));
            $b = hexdec(substr($hex, 4, 2));
        }
        return "$r, $g, $b";
    }
}
?>