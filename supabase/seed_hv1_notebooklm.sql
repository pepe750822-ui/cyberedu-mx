
-- Limpiar datos previos si existen (opcional, pero útil para evitar duplicados en pruebas)
DELETE FROM public.flashcards WHERE video_id = 'hv-1';
DELETE FROM public.quizzes WHERE video_id = 'hv-1';

-- Insertar Flashcards para Video 1 (hv-1)
INSERT INTO public.flashcards (video_id, front, back, tags, difficulty)
VALUES 
('hv-1', '¿Qué es la Información Explícita?', 'Son los datos, hechos o ideas que están escritos de manera directa y literal en el texto.', ARRAY['Habilidad Verbal', 'Comprensión Lectora'], 'easy'),
('hv-1', '¿Qué implica la habilidad de Inferir?', 'Deducir o concluir información que no está escrita directamente, sino sugerida por el texto a través de pistas y contexto.', ARRAY['Habilidad Verbal', 'Comprensión Lectora'], 'medium'),
('hv-1', '¿Qué es la Idea Principal?', 'Es el mensaje central, el argumento más importante o el propósito fundamental que el autor quiere comunicar.', ARRAY['Habilidad Verbal', 'Comprensión Lectora'], 'easy'),
('hv-1', '¿En qué consiste la estrategia para el reactivo #77?', 'Consiste en buscar información EXPLÍCITA (datos, hechos o ideas literales).', ARRAY['Estrategias', 'Examen'], 'medium'),
('hv-1', '¿Cuál es la meta final del Video 1 de ECOEMS 2025?', 'Dominar las estrategias para asegurar los primeros CUATRO ACIERTOS (#77 al #80) en la sección de Habilidad Verbal.', ARRAY['Meta', 'Examen'], 'hard');

-- Insertar Quiz para Video 1 (hv-1)
INSERT INTO public.quizzes (video_id, title, questions)
VALUES (
    'hv-1', 
    'Desafío NotebookLM: Estrategias de Comprensión Lectora',
    '[
        {
            "question": "¿Cuál es el enfoque temático central del Video 1 de la serie ECOEMS 2025?",
            "options": ["Matemáticas Básicas", "Habilidad Verbal - Comprensión Lectora", "Historia de México", "Geografía Universal"],
            "correct_index": 1,
            "explanation": "El video 1 inicia la serie con la materia de Habilidad Verbal, específicamente el tema de Comprensión Lectora."
        },
        {
            "question": "¿Cuántos videos componen la serie completa de preparación y qué nivel de cobertura prometen?",
            "options": ["12 videos - Repaso rápido", "40 videos - Temas principales", "82 videos - Cobertura Total", "128 videos - Ejercicios extra"],
            "correct_index": 2,
            "explanation": "La serie consta de 82 videos diseñados para cubrir la totalidad del temario oficial."
        },
        {
            "question": "Según la estrategia presentada, ¿qué debe buscar un estudiante para responder el reactivo #77?",
            "options": ["Sentimientos ocultos del autor", "Información EXPLÍCITA (datos literales)", "Resumen de todos los párrafos", "Crítica literaria externa"],
            "correct_index": 1,
            "explanation": "El reactivo #77 se resuelve localizando información que aparece escrita de manera directa en el texto."
        },
        {
            "question": "¿Qué habilidad clave es necesaria para resolver con éxito las preguntas #78 y #79?",
            "options": ["Cálculo estadístico", "Memorización de fechas", "INFERENCIA (deducir lo sugerido)", "Identificación de rimas"],
            "correct_index": 2,
            "explanation": "Estas preguntas requieren que el alumno deduzca información basándose en las pistas del autor."
        },
        {
            "question": "¿Cuál es el resultado esperado al aplicar correctamente las estrategias de este video?",
            "options": ["Leer un libro por semana", "Obtener cuatro aciertos SEGUROS", "Aprender vocabulario nuevo", "Pasar a la siguiente materia"],
            "correct_index": 1,
            "explanation": "El dominio de estas técnicas asegura 4 respuestas correctas en la sección de Habilidad Verbal del examen."
        }
    ]'::jsonb
);
