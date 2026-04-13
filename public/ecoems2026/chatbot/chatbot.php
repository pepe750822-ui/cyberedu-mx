<?php
// chatbot.php - API del Chatbot Anime ECOEMS 2026
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

session_start();

// Cargar configuración
require_once __DIR__ . '/../../config.php';

// Procesar solicitud POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);

    if (isset($input['message'])) {
        // Obtener contexto del usuario
        $contexto_usuario = [
            'watched_videos' => isset($_SESSION['student_progress']['watched']) ? $_SESSION['student_progress']['watched'] : [],
            'total_points' => isset($_SESSION['student_progress']['total_points']) ? $_SESSION['student_progress']['total_points'] : 0,
            'level' => isset($_SESSION['student_progress']['level']) ? $_SESSION['student_progress']['level'] : 1,
            'streak_days' => isset($_SESSION['student_progress']['streak_days']) ? $_SESSION['student_progress']['streak_days'] : 0
        ];

        // Generar respuesta
        $respuesta = obtenerRespuestaChatbot($input['message'], $contexto_usuario);

        // Guardar en historial
        if (!isset($_SESSION['chatbot_history'])) {
            $_SESSION['chatbot_history'] = [];
        }

        $_SESSION['chatbot_history'][] = [
            'timestamp' => time(),
            'user_message' => $input['message'],
            'bot_response' => $respuesta['respuesta'],
            'type' => $respuesta['tipo']
        ];

        // Limitar historial
        if (count($_SESSION['chatbot_history']) > 50) {
            array_shift($_SESSION['chatbot_history']);
        }

        // Enviar respuesta
        echo json_encode([
            'success' => true,
            'response' => $respuesta['respuesta'],
            'type' => $respuesta['tipo'],
            'actions' => $respuesta['acciones'],
            'timestamp' => date('H:i'),
            'student_id' => $input['studentId'] ?? 'unknown'
        ]);

        exit;
    }
}

// Si no es POST, mostrar información
echo json_encode([
    'success' => false,
    'message' => 'ECOEMS 2026 Chatbot API v10.0',
    'endpoints' => [
        'POST /chatbot.php' => 'Procesar mensajes del chatbot'
    ]
]);

// ===================== FUNCIONES DEL CHATBOT =====================

function obtenerRespuestaChatbot($mensaje, $contexto_usuario)
{
    // Cargar base de conocimiento
    $conocimiento_file = __DIR__ . '/conocimiento_ecoems.json';

    if (!file_exists($conocimiento_file)) {
        return [
            'respuesta' => "🎌 ¡Estoy en mantenimiento! Mi base de conocimiento se está actualizando.\n\nMientras tanto, puedes:\n• Ver los videos de la plataforma\n• Practicar en el simulador\n• Contactar a soporte técnico\n\n¡Volveré pronto con más poder anime!",
            'tipo' => 'mantenimiento',
            'acciones' => []
        ];
    }

    $conocimiento = file_get_contents($conocimiento_file);
    $datos = json_decode($conocimiento, true);

    // Procesar mensaje
    $mensaje_min = strtolower(trim($mensaje));

    // Patrones de búsqueda
    $patrones = [
        'saludo' => ['hola', 'buenos días', 'buenas tardes', 'buenas noches', 'qué tal', 'hi', 'hello'],
        'despedida' => ['adiós', 'chao', 'hasta luego', 'nos vemos', 'bye'],
        'ecoems' => ['qué es ecoems', 'qué es el ecoems', 'examen ecoems'],
        'videos' => ['video', 'episodio', 'lección', 'tutorial'],
        'matematicas' => ['matemáticas', 'matematica', 'álgebra', 'geometría'],
        'progreso' => ['progreso', 'avance', 'cuánto llevo', 'puntos'],
        'ayuda' => ['ayuda', 'cómo funciona', 'qué puedo hacer']
    ];

    // Buscar coincidencia
    foreach ($patrones as $tema => $palabras) {
        foreach ($palabras as $palabra) {
            if (strpos($mensaje_min, $palabra) !== false) {
                return generarRespuesta($tema, $datos, $contexto_usuario, $mensaje);
            }
        }
    }

    // Buscar en base de conocimiento
    return buscarEnConocimiento($mensaje_min, $datos, $contexto_usuario);
}

function buscarEnConocimiento($mensaje, $datos, $contexto_usuario)
{
    $mejor_respuesta = null;
    $mensaje_min = strtolower($mensaje);

    // 1. Buscar en Preguntas Comunes
    if (isset($datos['preguntas_comunes'])) {
        foreach ($datos['preguntas_comunes'] as $pregunta => $respuesta) {
            if (stripos($mensaje_min, strtolower($pregunta)) !== false) {
                return [
                    'respuesta' => "🎌 " . $respuesta . "\n\n⚡ ¡Sigue adelante, futuro héroe!",
                    'tipo' => 'pregunta_comune',
                    'acciones' => []
                ];
            }
        }
    }

    // 2. Buscar en Ventas y Promoción Udemy
    if (isset($datos['preguntas_comunes']['udemy_promo'])) {
        if (stripos($mensaje_min, 'udemy') !== false || stripos($mensaje_min, 'promo') !== false || stripos($mensaje_min, 'descuento') !== false || stripos($mensaje_min, '50 pesos') !== false || (stripos($mensaje_min, 'precio') !== false && stripos($mensaje_min, 'curso') !== false)) {
            return [
                'respuesta' => "🎌 " . $datos['preguntas_comunes']['udemy_promo'],
                'tipo' => 'ventas_udemy',
                'acciones' => [['tipo' => 'abrir_whatsapp']]
            ];
        }
    }

    if (isset($datos['ventas'])) {
        if (stripos($mensaje_min, 'pago') !== false || stripos($mensaje_min, 'comprar') !== false || stripos($mensaje_min, 'precio') !== false) {
            $resp = "💰 **Información de Venta:**\n\n" . $datos['ventas']['proceso'] . "\n\n";
            $resp .= "💳 **Métodos de pago:** " . implode(", ", $datos['ventas']['metodos_pago']) . "\n\n";
            $resp .= "✨ **Beneficios:** " . $datos['ventas']['beneficios'];
            return [
                'respuesta' => "🎌 " . $resp,
                'tipo' => 'ventas',
                'acciones' => [['tipo' => 'abrir_whatsapp']]
            ];
        }
    }

    // 3. Buscar en Detalles del Curso
    if (isset($datos['detalles_curso'])) {
        if (stripos($mensaje_min, 'materia') !== false || stripos($mensaje_min, 'temas') !== false || stripos($mensaje_min, 'curso') !== false) {
            $detalles = $datos['detalles_curso'];
            $resp = "📚 **Detalles del Curso " . $detalles['nombre'] . ":**\n\n";
            $resp .= "• Materias: " . $detalles['materias_total'] . "\n";
            $resp .= "• Episodios Anime: " . $detalles['episodios_total'] . "\n";
            $resp .= "• Temas: " . $detalles['temas_subtitulos'] . "\n\n";
            $resp .= "📖 **Materias principales:** " . implode(", ", array_slice($detalles['materias'], 0, 5)) . "... y más.\n\n";
            $resp .= "🎁 **Recursos:** " . implode(", ", $detalles['recursos']);
            return [
                'respuesta' => "🎌 " . $resp,
                'tipo' => 'detalles_curso',
                'acciones' => []
            ];
        }
    }

    // 4. Buscar en Videos (por título o materia)
    if (isset($datos['videos'])) {
        foreach ($datos['videos'] as $video) {
            if (stripos($mensaje_min, strtolower($video['titulo'])) !== false || (isset($video['materia']) && stripos($mensaje_min, strtolower($video['materia'])) !== false)) {
                return [
                    'respuesta' => "🎬 **¡Encontré un video genial para ti!**\n\n**" . $video['titulo'] . "**\n" . $video['descripcion'] . "\n\n¿Te gustaría verlo ahora?",
                    'tipo' => 'video_recomendado',
                    'acciones' => [
                        ['tipo' => 'recomendar_video', 'video_id' => $video['id'], 'titulo' => $video['titulo']]
                    ]
                ];
            }
        }
    }

    return respuestaPorDefecto();
}

function generarRespuesta($tema, $datos, $contexto_usuario, $mensaje_original)
{
    $respuestas = [
        'saludo' => [
            "🎌 ¡Konnichiwa! Soy tu asistente anime del ECOEMS 2026.\n\n¿Listo para conquistar el examen como un verdadero héroe shonen? ¡Puedo ayudarte con videos, ejercicios y mucho más!",
            "🌟 ¡Hola, futuro campeón! Bienvenido a la aventura anime del ECOEMS 2026. ¿En qué puedo ayudarte hoy?"
        ],
        'despedida' => [
            "🎌 ¡Sayonara! Recuerda: ¡Cada día de estudio te acerca más a tu meta!",
            "🌟 ¡Hasta pronto! Sigue entrenando como un héroe anime. ¡Ganbatte!"
        ],
        'ecoems' => [
            "📘 **¿Qué es el ECOEMS?**\n\nEl Examen de Competencia para la Educación Media Superior (ECOEMS) es la prueba que te permite ingresar a preparatoria en México.\n\n**Características:**\n• 128 preguntas\n• 11 áreas de conocimiento\n• Resultados: julio 2026\n• Fecha: 15 de junio 2026\n\n🎯 **Mi misión:** Ayudarte a dominar los 91 temas clave como un héroe anime."
        ],
        'videos' => [
            "🎬 **Mis 91 Episodios Anime:**\n\nTengo 91 videos organizados en 12 misiones:\n\n1. 🎮 Estrategia (1 video)\n2. 💬 Habilidad Verbal (5 videos)\n3. 🧮 Habilidad Matemática (5 videos)\n4. 🧬 Biología (7 videos)\n5. ⚡ Física (7 videos)\n6. 🧪 Química (6 videos)\n7. 📐 Matemáticas (14 videos)\n8. 🏛️ Historia (14 videos)\n9. 📚 Español (10 videos)\n10. 🏛️ Formación Cívica (8 videos)\n11. 🌍 Geografía (10 videos)\n12. 🏆 Repaso (4 videos)\n\n¿Qué tema te interesa más?"
        ],
        'progreso' => [
            "📊 **Tu Progreso Heroico:**\n\n• 🎬 Videos vistos: " . count($contexto_usuario['watched_videos']) . "/91\n• 💪 Puntos: {$contexto_usuario['total_points']}\n• 🏆 Nivel: {$contexto_usuario['level']}\n• 🔥 Racha: {$contexto_usuario['streak_days']} días\n\n" . generarConsejoProgreso($contexto_usuario)
        ],
        'ayuda' => [
            "🎌 **Comandos del Chatbot Anime:**\n\nPuedes preguntarme sobre:\n\n• 📚 **Temas específicos:** matemáticas, biología, física, etc.\n• 🎬 **Videos:** 'recomiéndame un video de matemáticas'\n• 📊 **Progreso:** 'cómo voy', 'mi progreso'\n• 🎯 **Ejercicios:** 'dame un ejercicio de álgebra'\n• 📅 **ECOEMS:** información sobre el examen\n\n¡Pregúntame lo que quieras!"
        ]
    ];

    if (isset($respuestas[$tema])) {
        $respuesta = $respuestas[$tema][array_rand($respuestas[$tema])];

        return [
            'respuesta' => $respuesta,
            'tipo' => $tema,
            'acciones' => generarAcciones($tema, $contexto_usuario)
        ];
    }

    return [
        'respuesta' => "🎌 ¡Interesante pregunta! Déjame consultar mi base de conocimiento anime...",
        'tipo' => 'consulta',
        'acciones' => []
    ];
}

function generarConsejoProgreso($progreso)
{
    $vistos = count($progreso['watched_videos']);
    $porcentaje = round(($vistos / 91) * 100);

    if ($porcentaje == 0) {
        return "🚀 **¡Comienza tu aventura!** Recomiendo empezar por el video 0 (estrategia) para planear tu misión.";
    } elseif ($porcentaje < 25) {
        return "💪 **¡Vas por buen camino!** Sigue así, cada video te hace más fuerte.";
    } elseif ($porcentaje < 50) {
        return "🌟 **¡Excelente progreso!** Ya dominas la mitad del camino.";
    } elseif ($porcentaje < 75) {
        return "🔥 **¡Increíble avance!** Tu poder anime es evidente.";
    } else {
        return "🏆 **¡Eres una leyenda!** Casi completas los 91 episodios.";
    }
}

function generarAcciones($tema, $contexto_usuario)
{
    $acciones = [];

    switch ($tema) {
        case 'videos':
            if (empty($contexto_usuario['watched_videos'])) {
                $acciones[] = [
                    'tipo' => 'recomendar_video',
                    'video_id' => 0,
                    'titulo' => 'Estrategia Anime ECOEMS'
                ];
            } else {
                for ($i = 0; $i <= 90; $i++) {
                    if (!in_array($i, $contexto_usuario['watched_videos'])) {
                        $acciones[] = [
                            'tipo' => 'recomendar_video',
                            'video_id' => $i,
                            'titulo' => "Episodio {$i}"
                        ];
                        break;
                    }
                }
            }
            break;

        case 'matematicas':
            $acciones[] = [
                'tipo' => 'ejercicio',
                'materia' => 'matematicas',
                'dificultad' => $contexto_usuario['level']
            ];
            break;
    }

    return $acciones;
}

function respuestaPorDefecto()
{
    return [
        'respuesta' => "🎌 ¡Konnichiwa! No estoy seguro de entender tu pregunta sobre ECOEMS.\n\nPuedo ayudarte con:\n• 📚 Explicaciones de temas\n• 🎯 Recomendaciones de videos\n• 📊 Tu progreso de estudio\n• 💪 Ejercicios prácticos\n\n¿En qué tema específico necesitas ayuda?",
        'tipo' => 'por_defecto',
        'acciones' => []
    ];
}
?>