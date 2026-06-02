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

// 2. FUNCIÓN PARA LLAMAR A LA API Y OBTENER PREGUNTAS COMPLEMENTARIAS
async function fetchMissingQuestions(subindice, tema, materia, existingQuestions, neededCount) {
  const existingQuestionsList = existingQuestions.map((q, i) => `${i + 1}. ${q.question}`).join('\n');
  const prompt = `Eres experto en el examen ECOEMS de México nivel secundaria.
Genera exactamente ${neededCount} preguntas de opción múltiple ADICIONALES y DIFERENTES a las que ya existen sobre: 
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

// Helper para normalizar texto de preguntas para detectar duplicados
function normalizeText(text) {
  return text.toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()¿?¡!"']/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

// 3. PROCESAR Y REVISAR
async function main() {
  const dataDir = path.join(__dirname, '../src/data/practica');
  let totalSubindicesCon10 = 0;
  let totalSubindicesCorregidos = 0;
  let totalPreguntasBanco = 0;
  let totalArchivosRevisados = 0;

  console.log("INICIANDO AUDITORÍA Y CORRECCIÓN DEL BANCO DE PREGUNTAS...\n");

  for (const area of areas) {
    const materiaSlug = createSlug(area.nombre);
    const filePath = path.join(dataDir, `${materiaSlug}.json`);
    
    if (!fs.existsSync(filePath)) {
      console.log(`❌ ${materiaSlug}.json — No existe el archivo base.`);
      continue;
    }

    totalArchivosRevisados++;
    let materiaData = {};
    try {
      materiaData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (err) {
      console.log(`❌ ${materiaSlug}.json — Error al leer o parsear el archivo JSON.`);
      continue;
    }

    let fileOk = true;
    let fileReportDetails = [];
    let fileModified = false;
    let materiaSubindicesCount = 0;

    for (const subtema of area.subtemas) {
      for (const concepto of subtema.contenido) {
        materiaSubindicesCount++;
        const conceptoLimpio = concepto.split(':')[0];
        const slug = createSlug(conceptoLimpio);

        let subData = materiaData[slug];
        if (!subData) {
          subData = { questions: [] };
          materiaData[slug] = subData;
          fileModified = true;
        }

        if (!subData.questions) {
          subData.questions = [];
          fileModified = true;
        }

        // VALIDACIÓN DE PREGUNTAS
        const validQuestions = [];
        const seenQuestions = new Set();
        let hasMissingFields = false;
        let hasDuplicates = false;

        for (const q of subData.questions) {
          // Verificar campos faltantes
          if (!q.question || !q.options || !Array.isArray(q.options) || q.options.length !== 4 || q.correct === undefined || !q.explanation) {
            hasMissingFields = true;
            continue;
          }

          // Verificar duplicados
          const normQ = normalizeText(q.question);
          if (seenQuestions.has(normQ)) {
            hasDuplicates = true;
            continue;
          }

          seenQuestions.add(normQ);
          validQuestions.push(q);
        }

        // Si se limpiaron duplicados o campos faltantes, actualizamos temporalmente
        if (validQuestions.length !== subData.questions.length) {
          subData.questions = validQuestions;
          fileModified = true;
        }

        const count = subData.questions.length;

        if (count < 10 || hasMissingFields || hasDuplicates) {
          fileOk = false;
          let issueText = `subíndice "${conceptoLimpio}" tiene ${count} preguntas`;
          if (hasDuplicates) issueText += " [preguntas duplicadas detectadas]";
          if (hasMissingFields) issueText += " [campos faltantes detectados]";
          fileReportDetails.push(issueText);

          // REGENERACIÓN DE PREGUNTAS FALTANTES SI TENEMOS API KEY
          if (apiKey && count < 10) {
            const neededCount = 10 - count;
            console.log(`  🔧 Reparando "${conceptoLimpio}" en ${materiaSlug}.json: Generando ${neededCount} preguntas faltantes...`);
            let intentos = 0;
            let reparado = false;
            while (intentos < 3 && !reparado) {
              try {
                const res = await fetchMissingQuestions(concepto, subtema.titulo, area.nombre, subData.questions, neededCount);
                if (res.questions && res.questions.length === neededCount) {
                  // Agregar las nuevas preguntas
                  subData.questions = subData.questions.concat(res.questions);
                  console.log(`    [OK] Nuevas preguntas añadidas. Total: ${subData.questions.length}`);
                  fileModified = true;
                  reparado = true;
                  totalSubindicesCorregidos++;
                } else {
                  throw new Error("Cantidad de preguntas generadas incorrecta.");
                }
              } catch (err) {
                intentos++;
                console.log(`    [ERROR] Intento ${intentos}/3 falló: ${err.message}`);
                await new Promise(r => setTimeout(r, 2000));
              }
            }
            if (!reparado) {
              console.log(`    [FALTO] No se pudo reparar automáticamente el subíndice "${conceptoLimpio}".`);
            }
          }
        }

        // Sumar al contador global si quedó completo
        if (subData.questions.length === 10) {
          totalSubindicesCon10++;
        }
        totalPreguntasBanco += subData.questions.length;
      }
    }

    // Si hubo cambios, guardamos el archivo
    if (fileModified) {
      fs.writeFileSync(filePath, JSON.stringify(materiaData, null, 2), 'utf8');
    }

    // Mostrar el reporte de este archivo
    if (fileOk) {
      console.log(`✅ ${materiaSlug}.json — ${materiaSubindicesCount} subíndices, todos con 10 preguntas`);
    } else {
      console.log(`❌ ${materiaSlug}.json — Errores detectados en los siguientes subíndices:`);
      fileReportDetails.forEach(detail => console.log(`   - ${detail}`));
    }
  }

  // 4. REPORTE FINAL
  console.log("\n==========================================");
  console.log("             REPORTE FINAL");
  console.log("==========================================");
  console.log(`- Total de archivos revisados: ${totalArchivosRevisados}`);
  console.log(`- Total de subíndices con 10 preguntas completas: ${totalSubindicesCon10} / 371`);
  console.log(`- Total de subíndices corregidos/reparados en esta ejecución: ${totalSubindicesCorregidos}`);
  console.log(`- Total de preguntas en todo el banco: ${totalPreguntasBanco} preguntas`);
  console.log("==========================================\n");
}

main().catch(console.error);
