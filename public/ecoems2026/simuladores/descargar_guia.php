<?php
// descargar_guia.php
// Script para forzar la descarga del PDF y evitar problemas de rutas o visualización en navegador

$archivo_nombre = 'materialapoyo2025ipnmediasuperior.pdf';
$ruta_relativa = '../../guiaspolitecnico/' . $archivo_nombre;
$archivo = realpath(__DIR__ . '/' . $ruta_relativa);

if ($archivo && file_exists($archivo)) {
    // Limpiar buffer de salida para evitar corrupción del PDF
    if (ob_get_level()) {
        ob_end_clean();
    }

    header('Content-Description: File Transfer');
    header('Content-Type: application/pdf');
    header('Content-Disposition: attachment; filename="Guia_IPN_2025_Material_Apoyo.pdf"');
    header('Expires: 0');
    header('Cache-Control: must-revalidate');
    header('Pragma: public');
    header('Content-Length: ' . filesize($archivo));
    readfile($archivo);
    exit;
} else {
    echo "Error: El archivo no se encuentra.<br>";
    echo "Ruta buscada: " . __DIR__ . '/' . $ruta_relativa . "<br>";
    echo "Ruta realpath: " . ($archivo ? $archivo : 'No resuelta');
}
?>