import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. EXTRAER DATOS DEL TEMARIO
const temarioPath = path.join(__dirname, '../src/data/temarioData.ts');
const temarioContent = fs.readFileSync(temarioPath, 'utf8');

const match = temarioContent.match(/export const areas: Area\[\] = (\[.*\]);/s);
if (!match) {
  console.error("No se pudo extraer la estructura de areas.");
  process.exit(1);
}

const arrayStr = match[1].replace(/\/\*[\s\S]*?\*\//g, '');
const getAreas = new Function('return ' + arrayStr);
const areas = getAreas();

function createSlug(text) {
  return text.toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const apiKey = process.argv[2];
if (!apiKey) {
  console.error("\n[ERROR] Debes proporcionar tu API Key como argumento.");
  console.log("Ejemplo: node scripts/generar_segundo_bloque.js \"sk-tu-api-key-aqui\"\n");
  process.exit(1);
}

// 2. FUNCIÓN PARA OBTENER PREGUNTAS COMPLEMENTARIAS
async function fetchQuestionsComplement(subindice, tema, materia, existingQuestions) {
  const existingQuestionsList = existingQuestions.map((q, i) => `${i + 1}. ${q.question}`).join('\n');
  const prompt = `Eres experto en el examen ECOEMS de México nivel secundaria.
Genera exactamente 5 preguntas de opción múltiple ADICIONALES y DIFERENTES a las que ya existen sobre: 
${subindice} del tema ${tema} de la materia ${materia}.

Requisitos:
- Nivel de dificultad real del ECOEMS
- 4 opciones (A, B, C, D)
- Una sola respuesta correcta
- Explicación breve máximo 2 oraciones nivel secundaria
- Sin emojis
- IMPORTANTE: Deben ser preguntas diferentes de las siguientes preguntas ya existentes para evitar repeticiones:
${existingQuestionsList}

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

// 3. PROCESAR
async function main() {
  const dataDir = path.join(__dirname, '../src/data/practica');

  console.log(`Iniciando generación del SEGUNDO bloque de 5 preguntas por subíndice...`);

  for (const area of areas) {
    const materiaSlug = createSlug(area.nombre);
    const filePath = path.join(dataDir, `${materiaSlug}.json`);
    
    if (!fs.existsSync(filePath)) {
      console.log(`[ADVERTENCIA] No existe el archivo base ${filePath}. Ejecuta primero el generador inicial.`);
      continue;
    }

    console.log(`\n============================`);
    console.log(`Procesando materia: ${area.nombre}`);
    
    // Cargar data existente
    let materiaData = {};
    try {
      materiaData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (err) {
      console.error(`Error al leer ${filePath}:`, err);
      continue;
    }

    const tareas = [];

    for (const subtema of area.subtemas) {
      for (const concepto of subtema.contenido) {
        const conceptoLimpio = concepto.split(':')[0];
        const slug = createSlug(conceptoLimpio);

        const subData = materiaData[slug];
        if (!subData || !subData.questions) {
          console.log(`  -> ${conceptoLimpio}: No tiene primer bloque, omitiendo.`);
          continue;
        }

        // Si ya tiene 10 o más preguntas, no generamos más
        if (subData.questions.length >= 10) {
          console.log(`  -> ${conceptoLimpio}: Ya tiene ${subData.questions.length} preguntas.`);
          continue;
        }

        tareas.push(async () => {
          console.log(`  -> Generando bloque 2 para: ${conceptoLimpio}`);
          let intentos = 0;
          while (intentos < 3) {
            try {
              const res = await fetchQuestionsComplement(concepto, subtema.titulo, area.nombre, subData.questions);
              if (res.questions && res.questions.length === 5) {
                // Agregar las nuevas preguntas
                subData.questions = subData.questions.concat(res.questions);
                console.log(`  [OK] ${conceptoLimpio} (Ahora tiene ${subData.questions.length} preguntas)`);
                return;
              } else {
                throw new Error("Formato incorrecto o cantidad incorrecta de preguntas");
              }
            } catch (err) {
              intentos++;
              console.log(`  [ERROR] ${conceptoLimpio} (Intento ${intentos}/3) - ${err.message}`);
              await new Promise(r => setTimeout(r, 2000));
            }
          }
          console.log(`  [FALLÓ DEFINITIVO] No se pudo generar bloque 2: ${conceptoLimpio}`);
        });
      }
    }

    // Ejecutar en lotes para no saturar la API
    const CONCURRENCIA = 5; 
    for (let i = 0; i < tareas.length; i += CONCURRENCIA) {
      const lote = tareas.slice(i, i + CONCURRENCIA);
      await Promise.all(lote.map(fn => fn()));
    }

    // Guardar actualizaciones de esta materia
    fs.writeFileSync(filePath, JSON.stringify(materiaData, null, 2), 'utf8');
    console.log(`[GUARDADO Y ACTUALIZADO] ${filePath}`);
  }

  console.log("\n¡GENERACIÓN DEL SEGUNDO BLOQUE COMPLETADA EXITOSAMENTE!");
}

main().catch(console.error);
