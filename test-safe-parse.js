const str = '{"title": "Calculadora: Ley de Ohm", "formula": "I = V / R", "variables": [{"name": "V", "label": "Voltaje", "unit": "V"}, {"name": "R", "label": "Resistencia", "unit": "Ω"}], "result_unit": "A", "explanation": "Calcula la corriente dividiendo el voltaje entre la resistencia. Ejemplo: I = 12V / 4Ω = 3A"}';
let cleaned = str.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
const matchJsonObj = cleaned.match(/({[\s\S]*})/);
if (matchJsonObj) cleaned = matchJsonObj[0];
cleaned = cleaned.replace(/,\s*([\]}])/g, "$1");
cleaned = cleaned.replace(/":\s*"(.*?)"(\s*[,}])/g, (match, p1, p2) => {
  const escaped = p1.replace(/"/g, '\\"');
  return `": "${escaped}"${p2}`;
});
console.log('CLEANED:', cleaned);
try {
  JSON.parse(cleaned);
  console.log('SUCCESS');
} catch(e) {
  console.log('ERROR:', e.message);
}
