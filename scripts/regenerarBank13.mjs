/**
 * Regenera bank13Questions con distractores plausibles via DeepSeek API.
 * Guarda progreso en scripts/bank13_progress.json para poder reanudar.
 *
 * Uso: DEEPSEEK_API_KEY=sk-... node scripts/regenerarBank13.mjs
 */

import fs from 'fs';

const API_KEY = process.env.DEEPSEEK_API_KEY;
if (!API_KEY) {
  console.error('ERROR: Falta DEEPSEEK_API_KEY en el entorno.');
  console.error('Uso: DEEPSEEK_API_KEY=sk-... node scripts/regenerarBank13.mjs');
  process.exit(1);
}

const TS_FILE       = 'src/data/simuladorData13.ts';
const PROGRESS_FILE = 'scripts/bank13_progress.json';
const LOTE          = 5;   // preguntas en paralelo por batch
const DELAY_MS      = 800; // pausa entre batches (ms)
const MAX_RETRIES   = 3;

// ─── 1. Extraer preguntas del archivo TS ────────────────────────────────────

const fileContent = fs.readFileSync(TS_FILE, 'utf8');

// Extraer el array de preguntas buscando '[' DESPUÉS del '= ['
// (evitar capturar el '[' del tipo 'Question[]')
const ARRAY_MARKER = 'bank13Questions: Question[] = [';
const assignIdx   = fileContent.indexOf(ARRAY_MARKER);
if (assignIdx === -1) throw new Error('No se encontró bank13Questions en el archivo.');
const bracketIdx = fileContent.indexOf('[', assignIdx + ARRAY_MARKER.length - 1);

let depth = 0, endIdx = -1;
for (let i = bracketIdx; i < fileContent.length; i++) {
  if (fileContent[i] === '[') depth++;
  else if (fileContent[i] === ']') { depth--; if (depth === 0) { endIdx = i; break; } }
}
if (endIdx === -1) throw new Error('No se encontró el cierre del array.');
const rawArray = fileContent.slice(bracketIdx, endIdx + 1);

// eval en entorno seguro — el array solo contiene literales JS válidos
let questions;
try {
  questions = eval(rawArray);
} catch (e) {
  console.error('ERROR al parsear el array de preguntas:', e.message);
  process.exit(1);
}
console.log(`📋 Preguntas cargadas: ${questions.length}`);

// ─── 2. Cargar progreso previo ───────────────────────────────────────────────

let progreso = {};
if (fs.existsSync(PROGRESS_FILE)) {
  try {
    progreso = JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf8'));
    const yaHechas = Object.keys(progreso).length;
    console.log(`♻️  Reanudando — ya procesadas: ${yaHechas}/${questions.length}`);
  } catch {
    progreso = {};
  }
}

// ─── 3. Función para mejorar una pregunta ───────────────────────────────────

async function mejorarPregunta(pregunta, intento = 1) {
  const respuestaCorrecta = pregunta.options[pregunta.correctIndex];

  const body = {
    model: 'deepseek-chat',
    max_tokens: 400,
    temperature: 0.7,
    messages: [{
      role: 'user',
      content: `Eres experto en el examen ECOEMS mexicano de bachillerato.
Dada esta pregunta genera 3 opciones incorrectas MUY PLAUSIBLES y una explicación breve.

Pregunta: ${pregunta.text}
Respuesta correcta: ${respuestaCorrecta}
Área: ${pregunta.area}

REGLAS para las opciones incorrectas:
- Mismo tema y formato que la respuesta correcta
- Que suenen creíbles, NO obvias ni ridículas
- Misma longitud aproximada que la respuesta correcta
- Relacionadas con el área (${pregunta.area})
- NUNCA usar "No aplica", "Ninguna de las anteriores", "Todas las anteriores"

REGLAS para la explicación:
- 2-3 líneas explicando por qué la respuesta correcta es correcta
- Menciona brevemente por qué las alternativas son incorrectas
- Didáctica, ayuda a memorizar

Responde SOLO con JSON válido, sin markdown, sin backticks:
{"distractores":["opcion1","opcion2","opcion3"],"explicacion":"texto de 2-3 lineas"}`
    }]
  };

  let response;
  try {
    response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify(body),
    });
  } catch (e) {
    if (intento < MAX_RETRIES) {
      await new Promise(r => setTimeout(r, 2000 * intento));
      return mejorarPregunta(pregunta, intento + 1);
    }
    console.warn(`  ⚠️  Red falla id=${pregunta.id}, manteniendo original`);
    return pregunta;
  }

  if (!response.ok) {
    const txt = await response.text().catch(() => '');
    if (response.status === 429 && intento < MAX_RETRIES) {
      console.warn(`  ⏳ Rate limit id=${pregunta.id}, esperando 5s...`);
      await new Promise(r => setTimeout(r, 5000 * intento));
      return mejorarPregunta(pregunta, intento + 1);
    }
    console.warn(`  ⚠️  API error ${response.status} id=${pregunta.id}: ${txt.slice(0, 80)}`);
    return pregunta;
  }

  let json;
  try {
    json = await response.json();
  } catch {
    console.warn(`  ⚠️  JSON response inválido id=${pregunta.id}`);
    return pregunta;
  }

  const rawText = json?.choices?.[0]?.message?.content?.trim() ?? '';

  // Limpiar posibles bloques markdown
  const cleaned = rawText.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();

  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    if (intento < MAX_RETRIES) {
      await new Promise(r => setTimeout(r, 1000));
      return mejorarPregunta(pregunta, intento + 1);
    }
    console.warn(`  ⚠️  Parse falla id=${pregunta.id}: ${cleaned.slice(0, 60)}`);
    return pregunta;
  }

  if (!Array.isArray(parsed.distractores) || parsed.distractores.length < 3) {
    console.warn(`  ⚠️  Distractores incompletos id=${pregunta.id}`);
    return pregunta;
  }

  // Mezclar correcta + 3 distractores
  const opciones = [parsed.distractores[0], parsed.distractores[1], parsed.distractores[2], respuestaCorrecta];
  for (let i = opciones.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [opciones[i], opciones[j]] = [opciones[j], opciones[i]];
  }
  const nuevoCorrectIndex = opciones.indexOf(respuestaCorrecta);

  return {
    ...pregunta,
    options: opciones,
    correctIndex: nuevoCorrectIndex,
    explanation: (parsed.explicacion || '').trim(),
  };
}

// ─── 4. Procesar en batches ──────────────────────────────────────────────────

const pendientes = questions.filter(q => !progreso[String(q.id)]);
console.log(`🚀 Pendientes por procesar: ${pendientes.length}`);

let procesadas = 0;
for (let i = 0; i < pendientes.length; i += LOTE) {
  const lote = pendientes.slice(i, i + LOTE);
  const desde = i + 1;
  const hasta = Math.min(i + LOTE, pendientes.length);
  process.stdout.write(`  Batch ${desde}-${hasta}/${pendientes.length}... `);

  const resultados = await Promise.all(lote.map(q => mejorarPregunta(q)));

  for (const r of resultados) {
    progreso[String(r.id)] = r;
  }
  procesadas += resultados.length;
  console.log(`✓ (total guardado: ${Object.keys(progreso).length})`);

  // Guardar checkpoint después de cada batch
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify(progreso, null, 2), 'utf8');

  if (i + LOTE < pendientes.length) {
    await new Promise(r => setTimeout(r, DELAY_MS));
  }
}

// ─── 5. Reconstruir el array final con el orden original ────────────────────

console.log('\n📝 Reconstruyendo simuladorData13.ts...');

const mejoradas = questions.map(q => progreso[String(q.id)] ?? q);

// Verificar integridad
const malFormadas = mejoradas.filter(q =>
  !q.options || q.options.length !== 4 ||
  q.correctIndex < 0 || q.correctIndex > 3 ||
  q.options[q.correctIndex] === undefined
);
if (malFormadas.length > 0) {
  console.warn(`⚠️  ${malFormadas.length} preguntas con formato incorrecto — revisar ids: ${malFormadas.map(q => q.id).join(', ')}`);
}

// Serializar cada pregunta como bloque TS
function serializarPregunta(q) {
  const optsStr = q.options.map(o => `    ${JSON.stringify(o)}`).join(',\n');
  return `  {
    id: ${q.id},
    area: ${JSON.stringify(q.area)},
    text: ${JSON.stringify(q.text)},
    options: [
${optsStr}
    ],
    correctIndex: ${q.correctIndex},
    explanation: ${JSON.stringify(q.explanation)},
  }`;
}

const tsOutput = `// Banco 13 — 500 Preguntas ECOEMS (Formulario de Repaso)
// Regenerado con DeepSeek — distractores plausibles y explicaciones didácticas

export interface Question {
  id: number;
  area: string;
  text: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const bank13Questions: Question[] = [
${mejoradas.map(serializarPregunta).join(',\n')}
];

export default bank13Questions;
`;

fs.writeFileSync(TS_FILE, tsOutput, 'utf8');
console.log(`✅ ${TS_FILE} regenerado con ${mejoradas.length} preguntas.`);

// Limpiar checkpoint si todo fue bien
if (Object.keys(progreso).length >= questions.length) {
  fs.unlinkSync(PROGRESS_FILE);
  console.log('🗑️  Checkpoint eliminado.');
}
