function cleanChart(input) {
  let cleaned = input.trim();
  const lines = cleaned.split('\n');
  const fixedLines = lines.map(line => {
    let fixed = line;

    // Fix dots in node IDs before arrow operators (A.1 --> B.2)
    fixed = fixed.replace(
      /\b([a-zA-Z][a-zA-Z0-9_]*)\.([a-zA-Z0-9_]+)\b/g,
      '$1_$2'
    );

    // Quote unquoted square-bracket labels: id[label] -> id["label"]
    // Uses \] as the only valid closer (avoids cross-bracket bugs)
    fixed = fixed.replace(
      /([a-zA-Z][a-zA-Z0-9_]*)\[([^"\]\n][^\]\n]*)\]/g,
      (_, id, label) => {
        const safe = label.trim().replace(/"/g, "'");
        return `${id}["${safe}"]`;
      }
    );

    // Quote unquoted diamond labels: id{label} -> id{"label"}
    fixed = fixed.replace(
      /([a-zA-Z][a-zA-Z0-9_]*)\{([^"{}\n][^{}\n]*)\}/g,
      (_, id, label) => {
        const safe = label.trim().replace(/"/g, "'");
        return `${id}{"${safe}"}`;
      }
    );

    // Quote unquoted double-paren (circle) labels: id((label)) -> id(("label"))
    fixed = fixed.replace(
      /([a-zA-Z][a-zA-Z0-9_]*)\(\(([^"()\n][^()\n]*)\)\)/g,
      (_, id, label) => {
        const safe = label.trim().replace(/"/g, "'");
        return `${id}(("${safe}"))`;
      }
    );

    // Quote unquoted round-bracket labels: id(label) -> id("label")
    // Do this AFTER double-paren so we don't double-process
    fixed = fixed.replace(
      /([a-zA-Z][a-zA-Z0-9_]*)\(([^"()\n][^()\n]*)\)/g,
      (_, id, label) => {
        const safe = label.trim().replace(/"/g, "'");
        return `${id}("${safe}")`;
      }
    );

    // Quote unquoted arrow labels: -->|label| -> -->|"label"|
    fixed = fixed.replace(
      /\|([^"'|\n][^|\n]*)\|/g,
      (_, label) => `|"${label.trim().replace(/"/g, "'")}"|`
    );

    // Quote unquoted subgraph titles
    fixed = fixed.replace(
      /^(\s*subgraph\s+)([^"\n][^\n]*)$/,
      (_, prefix, title) => `${prefix}"${title.trim().replace(/"/g, "'")}"`
    );

    return fixed;
  });
  return fixedLines.join('\n');
}

const test1 = `id[partial string `;
const test2 = `flowchart TD\n  id((   ))`;
const test3 = `   subgraph something`;

console.log("Test 1:", cleanChart(test1));
console.log("Test 2:", cleanChart(test2));
console.log("Test 3:", cleanChart(test3));

console.log("SUCCESS");
