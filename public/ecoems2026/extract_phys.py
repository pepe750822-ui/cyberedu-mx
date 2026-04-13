import re
import json

path = r"c:\Users\pp_it\cyberedumx.com\ecoems2026\simuladores\fisica.html"

with open(path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

questions = []
in_question = False
current_q = {}

for line in lines:
    if 'question:' in line:
        # Match question: "..." (handles single or double quotes)
        q_match = re.search(r'question:\s*["\'](.*?)["\']', line)
        if q_match:
            current_q['q'] = q_match.group(1)
    elif 'options:' in line:
        # Match options: ["...", "..."]
        opts_match = re.search(r'options:\s*\[(.*?)\]', line)
        if opts_match:
            opts_str = opts_match.group(1)
            # Split by comma but respect quotes
            current_q['options'] = [o.strip().strip('"').strip("'") for o in re.findall(r'["\'](.*?)["\']', opts_str)]
    elif 'correct:' in line:
        c_match = re.search(r'correct:\s*(\d+)', line)
        if c_match:
            current_q['correct'] = int(c_match.group(1))
    elif 'explanation:' in line:
        ex_match = re.search(r'explanation:\s*["\'](.*?)["\']', line)
        if ex_match:
            current_q['rationale'] = ex_match.group(1)
            # This is usually the last field in the object
            if all(k in current_q for k in ['q', 'options', 'correct', 'rationale']):
                questions.append(current_q.copy())
                current_q = {}

# Deduplicate by question text
unique_questions = []
seen = set()
for q in questions:
    if q['q'] not in seen:
        unique_questions.append(q)
        seen.add(q['q'])

with open('extracted_physics.json', 'w', encoding='utf-8') as f:
    json.dump(unique_questions, f, ensure_ascii=False, indent=4)
print(f"Extracted {len(unique_questions)} unique questions.")
