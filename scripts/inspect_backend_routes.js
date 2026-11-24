const fs = require('fs');
const src = fs.readFileSync('cloudflare/worker.js', 'utf8');

const exportIdx = src.indexOf('export default {');
const backendSrc = src.slice(exportIdx);
const routes = [...backendSrc.matchAll(/url\.pathname === "([^"]+)"/g)].map(m => m[1]);
console.log('Backend routes:', routes);
