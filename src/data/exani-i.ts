export const EXAMEN_TIPO = 'exani-i';

/* Distribución oficial EXANI-I — 130 reactivos puntuables */
export const DISTRIBUCION_EXANI: Record<string, number> = {
    'Pensamiento científico':    30,
    'Comprensión lectora':       30,
    'Redacción indirecta':       30,
    'Pensamiento matemático':    40,
};

/* Inglés es diagnóstico — 30 reactivos sin peso en puntaje global */
export const DIAGNOSTICO_INGLES = 30;

export const MATERIAS_EXANI = Object.keys(DISTRIBUCION_EXANI);

export const AREA_EMOJI_EXANI: Record<string, string> = {
    'Pensamiento científico':    '\uD83D\uDD2C',
    'Comprensión lectora':       '\uD83D\uDCD6',
    'Redacción indirecta':       '\u270D\uFE0F',
    'Pensamiento matemático':    '\uD83D\uDD22',
    'Inglés':                    '\uD83C\uDDFA\uD83C\uDDF8',
};

export const EXANI_FEATURES = [
    { id: 'simulador',     titulo: 'Simulador',           desc: 'Simulador completo EXANI-I con 130 reactivos en 4h',           icono: '\uD83C\uDFAF',   ruta: '/simulador-pro?examen=exani-i' },
    { id: 'infinito',      titulo: 'Infinito',            desc: 'Práctica ilimitada por área sin límite de preguntas',            icono: '\u267E\uFE0F',   ruta: '/simulador-infinito?examen=exani-i' },
    { id: 'practica',      titulo: 'Práctica por Tema',   desc: 'Ejercicios organizados por tema del EXANI-I',                    icono: '\uD83D\uDCDA',   ruta: '/practica-subindice?examen=exani-i' },
    { id: 'guia',          titulo: 'Guía 2026',           desc: 'Guía de estudio EXANI-I con reactivos oficiales Ceneval',       icono: '\uD83D\uDCD6',   ruta: '/guia2026?examen=exani-i' },
    { id: 'acordeon',      titulo: 'Acordeón',            desc: 'Resúmenes colapsables de todos los temas del EXANI-I',          icono: '\uD83D\uDCCB',   ruta: '/acordeon?examen=exani-i' },
    { id: 'flashcards',    titulo: 'Flashcards',          desc: 'Tarjetas de memoria rápida con conceptos clave del EXANI-I',     icono: '\uD83C\uDCCF',   ruta: '/flashcards?examen=exani-i' },
    { id: 'areas',         titulo: 'Áreas',               desc: 'Explora las 4 áreas del EXANI-I con videos y materiales',       icono: '\uD83D\uDDFA\uFE0F',   ruta: '/exani-i#areas' },
];
