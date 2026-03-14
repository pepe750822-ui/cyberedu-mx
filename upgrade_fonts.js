import fs from 'fs';
import path from 'path';

const file = 'c:\\Users\\pp_it\\cyberedumx.com\\cyberedu-mx\\src\\components\\AITutor.tsx';
let content = fs.readFileSync(file, 'utf-8');

// Replace mapping
content = content
    .replace(/text-\[8px\]/g, 'text-[10px]')
    .replace(/text-\[9px\]/g, 'text-[11px]')
    .replace(/text-\[10px\]/g, 'text-xs')
    .replace(/text-\[11px\]/g, 'text-sm')
    .replace(/text-\[12px\]/g, 'text-sm font-semibold')
    .replace(/text-\[13px\]/g, 'text-base font-semibold');

fs.writeFileSync(file, content, 'utf-8');
console.log('Font scaling complete.');
