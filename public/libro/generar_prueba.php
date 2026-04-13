<?php
// libro/generar_prueba.php

// 1. Configuración de Capítulos
$chapters_config = [
    0 => ['file' => 'capitulo_introduccion.html', 'title' => 'Estrategia y Bienvenida'],
    1 => ['file' => 'capitulo_1.html', 'title' => 'Habilidad Verbal'],
    2 => ['file' => 'capitulo_2.html', 'title' => 'Habilidad Matemática'],
    3 => ['file' => 'capitulo_3.html', 'title' => 'Biología'],
    4 => ['file' => 'capitulo_4.html', 'title' => 'Física'],
    5 => ['file' => 'capitulo_5.html', 'title' => 'Química'],
    6 => ['file' => 'capitulo_6.html', 'title' => 'Matemáticas'],
    7 => ['file' => 'capitulo_7.html', 'title' => 'Historia'],
    8 => ['file' => 'capitulo_8.html', 'title' => 'Español'],
    9 => ['file' => 'capitulo_9.html', 'title' => 'Formación Cívica'],
    10 => ['file' => 'capitulo_10.html', 'title' => 'Geografía'],
    11 => ['file' => 'capitulo_11.html', 'title' => 'Repaso Final'],
];

// 2. Extraer el contenido y estilos
function extractBody($html)
{
    if (preg_match('/<div class="capitulo-section"[^>]*>(.*?)<\/div>/is', $html, $matches)) {
        return $matches[1];
    }
    // Fallback if the above doesn't match
    if (preg_match('/<body[^>]*>(.*?)<\/body>/is', $html, $matches)) {
        return $matches[1];
    }
    return $html;
}

function extractStyles($html)
{
    if (preg_match_all('/<style[^>]*>(.*?)<\/style>/is', $html, $matches)) {
        return implode("\n", $matches[1]);
    }
    return "";
}

$all_bodies = "";
$all_css = "";
$toc_html = "";

// Cargar portada
$portada_html = file_get_contents('portada.html');
$portada_body = extractBody($portada_html);
$portada_css = extractStyles($portada_html);

// Procesar cada capítulo
foreach ($chapters_config as $id => $cap) {
    if (file_exists($cap['file'])) {
        $html = file_get_contents($cap['file']);
        $body = extractBody($html);
        $css = extractStyles($html);

        $anchor = "cap-" . $id;

        // Agregar salto de página antes de cada capítulo
        $all_bodies .= "<div class='page-break'></div>";
        $all_bodies .= "<div class='capitulo-wrapper' id='{$anchor}'>{$body}</div>";

        // Unificar CSS (evitar repeticiones si es posible, pero para prueba está bien)
        if ($id === 0) { // Solo necesitamos el CSS una vez si todos son iguales
            $all_css .= $css;
        }

        // Agregar a la Tabla de Contenidos
        $toc_html .= "<li>
            <a href='#{$anchor}'>
                <span class='toc-chapter'>Capítulo {$id}:</span>
                <span class='toc-name'>{$cap['title']}</span>
            </a>
        </li>";
    }
}

// 3. Crear HTML Maestro
$master_html = '<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Manual ECOEMS 2026 - Estrategia Inteligente</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    
    <style>
        ' . $portada_css . '
        ' . $all_css . '
        
        /* Estilos TOC */
        .toc-section { padding: 2cm; min-height: 29.7cm; box-sizing: border-box; }
        .toc-title { font-family: \'Montserrat\', sans-serif; font-size: 28pt; color: #2c3e50; border-bottom: 3px solid #3498db; padding-bottom: 10px; margin-bottom: 40px; text-align: center; }
        .toc-list { list-style: none; padding: 0; }
        .toc-list li { margin-bottom: 15px; border-bottom: 1px dotted #ccc; padding-bottom: 5px; }
        .toc-list a { text-decoration: none; color: #333; display: flex; justify-content: space-between; align-items: baseline; font-family: \'Montserrat\', sans-serif; font-size: 14pt; }
        .toc-list a:hover { color: #3498db; }
        .toc-chapter { font-weight: bold; color: #2c3e50; margin-right: 10px; }
        .toc-name { flex-grow: 1; }

        @media print {
            body { padding: 0; margin: 0; }
            .page-break { page-break-after: always; display: block; height: 1px; }
        }

        /* LIGHTBOX STYLES */
        #lightbox { display: none; position: fixed; z-index: 9999; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.9); backdrop-filter: blur(5px); justify-content: center; align-items: center; cursor: zoom-out; }
        #lightbox img { max-width: 95%; max-height: 95%; border: 5px solid white; border-radius: 10px; box-shadow: 0 0 30px rgba(255, 255, 255, 0.2); }
        .close-lightbox { position: absolute; top: 20px; right: 30px; color: white; font-size: 40px; font-weight: bold; cursor: pointer; user-select: none; }
    </style>
    
    <script>
        function openLightbox(src) {
            const lb = document.getElementById("lightbox");
            const lbImg = document.getElementById("lightbox-img");
            lbImg.src = src;
            lb.style.display = "flex";
            document.body.style.overflow = "hidden";
        }
        function closeLightbox() {
            const lb = document.getElementById("lightbox");
            lb.style.display = "none";
            document.body.style.overflow = "auto";
        }
    </script>
</head>
<body style="background: #ccc; padding: 20px;">
    <div id="lightbox" onclick="closeLightbox()">
        <span class="close-lightbox">&times;</span>
        <img id="lightbox-img" src="" alt="Infografía Ampliada">
    </div>

    <div class="manual-container" style="background: white; max-width: 21.6cm; margin: 0 auto; box-shadow: 0 0 10px rgba(0,0,0,0.5);">
        <div class="portada-section">' . $portada_body . '</div>
        <div class="page-break"></div>
        <div class="toc-section">
            <h1 class="toc-title">Tabla de Contenidos</h1>
            <ul class="toc-list">' . $toc_html . '</ul>
        </div>
        ' . $all_bodies . '
    </div>
</body>
</html>';

file_put_contents('manual_prueba.html', $master_html);
echo "Archivo generado: libro/manual_prueba.html";
?>