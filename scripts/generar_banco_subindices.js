import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. EXTRAER DATOS DEL TEMARIO USANDO REGEX PARA EVITAR PROBLEMAS DE TYPESCRIPT
const temarioPath = path.join(__dirname, '../src/data/temarioData.ts');
const temarioContent = fs.readFileSync(temarioPath, 'utf8');

const match = temarioContent.match(/export const areas: Area\[\] = (\[.*\]);/s);
if (!match) {
  console.error("No se pudo extraer la estructura de areas.");
  process.exit(1);
}

// Limpiar el contenido para poder evaluarlo
const arrayStr = match[1].replace(/\/\*[\s\S]*?\*\//g, ''); // Quitar comentarios multilinea
const getAreas = new Function('return ' + arrayStr);
const areas = getAreas();

// 2. FUNCIÓN PARA GENERAR SLUG
function createSlug(text) {
  return text.toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Quitar acentos
    .replace(/[^a-z0-9]+/g, '-') // Reemplazar no-alfanuméricos por guiones
    .replace(/^-+|-+$/g, ''); // Quitar guiones a los extremos
}

// 3. CONFIGURAR LLAMADA A LA API DE OPENAI
const apiKey = process.argv[2];
if (!apiKey) {
  console.error("\n[ERROR] Debes proporcionar tu API Key como argumento.");
  console.log("Ejemplo: node scripts/generar_banco_subindices.js \"sk-tu-api-key-aqui\"\n");
  process.exit(1);
}

async function fetchQuestions(subindice, tema, materia) {
  const prompt = `Eres experto en el examen ECOEMS de México nivel secundaria.
Genera exactamente 5 preguntas de opción múltiple sobre: 
${subindice} del tema ${tema} de la materia ${materia}.
Requisitos:
- Nivel de dificultad real del ECOEMS
- 4 opciones (A, B, C, D)
- Una sola respuesta correcta
- Explicación breve máximo 2 oraciones nivel secundaria
- Sin emojis
Responde SOLO en JSON válido sin formato markdown alrededor:
{"questions":[{"question":"...","options":["...","...","...","..."],"correct":0,"explanation":"..."}]}`;

  const response = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "deepseek-chat", 
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      response_format: { type: "json_object" }
    })
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`API Error: ${err}`);
  }

  const data = await response.json();
  const jsonText = data.choices[0].message.content;
  return JSON.parse(jsonText);
}

// 4. BUCLE PRINCIPAL (PROCESAMIENTO EN PARALELO)
async function main() {
  const dataDir = path.join(__dirname, '../src/data/practica');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  console.log(`Iniciando generación para ${areas.length} materias...`);

  for (const area of areas) {
    const materiaSlug = createSlug(area.nombre);
    console.log(`\n============================`);
    console.log(`Procesando materia: ${area.nombre}`);
    
    const materiaData = {};
    let subindicesCount = 0;

    // Recopilar todos los subíndices de esta materia
    const tareas = [];

    for (const subtema of area.subtemas) {
      for (const concepto of subtema.contenido) {
        subindicesCount++;
        // El slug se basa en el primer tramo del concepto o su totalidad
        // Ejemplo: "Texto narrativo: usa pretérito..." -> slug de todo el texto
        const conceptoLimpio = concepto.split(':')[0]; // Usar solo lo que está antes de los dos puntos si lo hay
        const slug = createSlug(conceptoLimpio);

        tareas.push(async () => {
          console.log(`  -> Generando: ${conceptoLimpio}`);
          let intentos = 0;
          while (intentos < 3) {
            try {
              const res = await fetchQuestions(concepto, subtema.titulo, area.nombre);
              if (res.questions && res.questions.length === 5) {
                materiaData[slug] = res;
                console.log(`  [OK] ${conceptoLimpio}`);
                return;
              } else {
                throw new Error("Formato incorrecto o cantidad incorrecta de preguntas");
              }
            } catch (err) {
              intentos++;
              console.log(`  [ERROR] ${conceptoLimpio} (Intento ${intentos}/3) - ${err.message}`);
              await new Promise(r => setTimeout(r, 2000)); // Esperar antes de reintentar
            }
          }
          console.log(`  [FALLÓ DEFINITIVO] No se pudo generar: ${conceptoLimpio}`);
        });
      }
    }

    // Ejecutar tareas en paralelo con un límite de concurrencia
    const CONCURRENCIA = 5; 
    for (let i = 0; i < tareas.length; i += CONCURRENCIA) {
      const lote = tareas.slice(i, i + CONCURRENCIA);
      await Promise.all(lote.map(fn => fn()));
    }

    // Guardar el JSON de la materia
    const filePath = path.join(dataDir, `${materiaSlug}.json`);
    fs.writeFileSync(filePath, JSON.stringify(materiaData, null, 2), 'utf8');
    console.log(`[GUARDADO] ${filePath} (${subindicesCount} subíndices)`);
  }

  console.log("\n¡GENERACIÓN COMPLETADA EXITOSAMENTE!");
}

main().catch(console.error);
