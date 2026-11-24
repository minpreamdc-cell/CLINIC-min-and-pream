const fs = require('fs');
const src = fs.readFileSync('cloudflare/worker.js', 'utf8');

const exportIdx = src.indexOf('export default {');
console.log('--- BACKEND EXPORT (1500 chars) ---');
console.log(src.slice(exportIdx, exportIdx + 1500));
