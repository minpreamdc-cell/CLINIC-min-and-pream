const fs = require('fs');
const src = fs.readFileSync('cloudflare/worker.js', 'utf8');

const exportIdx = src.indexOf('export default {');
console.log(src.slice(exportIdx + 1200, exportIdx + 3500));
