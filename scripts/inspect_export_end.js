const fs = require('fs');
const src = fs.readFileSync('cloudflare/worker.js', 'utf8');

const exportIdx = src.indexOf('export default {');
console.log('--- END OF WORKER (last 1000 chars) ---');
console.log(src.slice(src.length - 1000));
