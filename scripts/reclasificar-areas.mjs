import { readFileSync, writeFileSync } from 'fs';

const PHYSICS_KW = [
  'newton', 'joule', 'fuerza', 'velocidad', 'aceleración', 'masa',
  'calor', 'reflexión', 'conductor', 'litro', 'kilogramo', 'magnitud',
  'escalar', 'vectorial', 'potencia',
];

function getArea(originalId, questionText) {
  const t = (questionText || '').toLowerCase();
  if (originalId >= 1 && originalId <= 48) {
    return PHYSICS_KW.some(kw => t.includes(kw)) ? 'Física' : 'Química';
  }
  if (originalId >= 49  && originalId <= 55)  return 'Español';
  if (originalId >= 56  && originalId <= 89)  return 'Matemáticas';
  if (originalId >= 90  && originalId <= 200) return 'Biología';
  if (originalId >= 201 && originalId <= 206) return 'Historia';
  if (originalId >= 207 && originalId <= 300) return 'Geografía';
  if (originalId >= 301 && originalId <= 355) return 'Química';
  if (originalId >= 356 && originalId <= 403) return 'Español';
  if (originalId >= 404 && originalId <= 425) return 'Matemáticas';
  if (originalId >= 426 && originalId <= 458) return 'Formación Cívica y Ética';
  if (originalId >= 459 && originalId <= 500) return 'Historia';
  return 'Química';
}

// ─── flashcardsData.ts ───────────────────────────────────────────────────────
// Each entry is one line: { id: N, area: "X", pregunta: "Y", respuesta: "Z" },
{
  const src = 'src/data/flashcardsData.ts';
  let content = readFileSync(src, 'utf8');
  let changed = 0;

  content = content.replace(
    /\{ id: (\d+), area: "([^"]*)", pregunta: "([^"]*)", respuesta: "([^"]*)" \}/g,
    (match, idStr, _oldArea, pregunta, respuesta) => {
      const id = parseInt(idStr, 10);
      const area = getArea(id, pregunta);
      changed++;
      return `{ id: ${id}, area: "${area}", pregunta: "${pregunta}", respuesta: "${respuesta}" }`;
    }
  );

  writeFileSync(src, content, 'utf8');
  console.log(`flashcardsData.ts: ${changed} entradas reclasificadas`);
}

// ─── simuladorData13.ts ──────────────────────────────────────────────────────
// Each entry is multi-line; id is 1001-1500 (originalId = id - 1000).
// We capture blocks and replace the area field.
{
  const src = 'src/data/simuladorData13.ts';
  let content = readFileSync(src, 'utf8');
  let changed = 0;

  // Capture each object block from { to },
  content = content.replace(
    /(\{\s*\n\s*id:\s*(\d+),\s*\n\s*area:\s*"[^"]*",\s*\n\s*text:\s*"([^"]*)",)/g,
    (match, prefix, idStr, textStr) => {
      const originalId = parseInt(idStr, 10) - 1000;
      const area = getArea(originalId, textStr);
      changed++;
      // Rebuild the matched portion with the new area
      return match.replace(/area:\s*"[^"]*"/, `area: "${area}"`);
    }
  );

  writeFileSync(src, content, 'utf8');
  console.log(`simuladorData13.ts: ${changed} entradas reclasificadas`);
}
