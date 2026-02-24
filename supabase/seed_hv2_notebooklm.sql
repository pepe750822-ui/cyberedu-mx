
-- ==========================================================
-- ACTIVACIÓN DE CONTENIDO NOTEBOOKLM - VIDEO 2 (hv-2)
-- ==========================================================

-- 1. Limpiar datos previos
DELETE FROM public.flashcards WHERE video_id = 'hv-2';
DELETE FROM public.quizzes WHERE video_id = 'hv-2';

-- 2. Insertar Flashcards Estratégicas
INSERT INTO public.flashcards (video_id, front, back, tags, difficulty)
VALUES 
('hv-2', '¿Qué es la Secuencia de Acontecimientos?', 'Es la habilidad de ordenar eventos según su desarrollo temporal (primero, después, conclusión).', ARRAY['Habilidad Verbal', 'Análisis Textual'], 'easy'),
('hv-2', '¿Qué son las Relaciones Textuales?', 'Conexiones lógicas entre ideas (causa-consecuencia, oposición, problema-solución) identificadas por conectores.', ARRAY['Habilidad Verbal', 'Análisis Textual'], 'medium'),
('hv-2', 'Diferencia entre Hecho y Opinión', 'Los hechos son verificables y objetivos; las opiniones son subjetivas y expresan juicios o sentimientos.', ARRAY['Habilidad Verbal', 'Pensamiento Crítico'], 'easy'),
('hv-2', 'Analogía del Árbol (Idea Principal/Secundaria)', 'La idea principal es el tronco (esencial) y las ideas secundarias son las ramas (complementarias).', ARRAY['Habilidad Verbal', 'Estructura'], 'medium'),
('hv-2', 'Significado por Contexto', 'Deducir el sentido de palabras desconocidas usando las pistas que ofrece el texto circundante.', ARRAY['Habilidad Verbal', 'Vocabulario'], 'hard');

-- 3. Insertar Quiz Dinámico (Desafío IA)
INSERT INTO public.quizzes (video_id, title, questions)
VALUES (
    'hv-2', 
    'Desafío NotebookLM: Análisis Textual Profundo',
    '[
        {
            "question": "¿Qué herramienta del lenguaje ayuda a identificar las relaciones textuales según el Video 2?",
            "options": ["Adjetivos calificativos", "Conectores lógicos (p.ej. porque, sin embargo)", "Signos de exclamación", "Metáforas complejas"],
            "correct_index": 1,
            "explanation": "Los conectores actúan como pistas que revelan cómo se relacionan las ideas entre sí."
        },
        {
            "question": "Si un texto dice ''Es hermoso ver amanecer'', ¿qué tipo de enunciado es?",
            "options": ["Un hecho objetivo", "Una opinión subjetiva", "Una secuencia temporal", "Un dato técnico"],
            "correct_index": 1,
            "explanation": "Es una opinión porque expresa un juicio personal y estético que no es verificable universalmente."
        },
        {
            "question": "En la analogía jerárquica del texto, ¿qué representan las ''ramas'' del árbol?",
            "options": ["El título del texto", "La idea principal", "Las ideas secundarias", "La conclusión final"],
            "correct_index": 2,
            "explanation": "Las ramas representan las ideas secundarias que se desprenden y complementan al tronco (idea principal)."
        },
        {
            "question": "¿Cuál es la utilidad de identificar la ''Secuencia de Acontecimientos''?",
            "options": ["Contar el número de palabras", "Comprender el desarrollo temporal y la progresión lógica", "Memorizar los nombres de los personajes", "Corregir la ortografía"],
            "correct_index": 1,
            "explanation": "Permite entender el orden de los sucesos y cómo uno lleva al siguiente."
        },
        {
            "question": "¿Qué tema se abordará en el Video 3 de la serie BioReto Academy?",
            "options": ["Física Cuántica", "Geografía de México", "Manejo de Vocabulario (Analogías)", "Cálculo Integral"],
            "correct_index": 2,
            "explanation": "El Video 3 se centrará en el vocabulario, abordando analogías y relaciones semánticas."
        }
    ]'::jsonb
);
