const fs = require('fs');
const src = fs.readFileSync('cloudflare/worker.js', 'utf8');
const match = src.match(/const HTML_PAGE = ([\s\S]*?);\s*export default/);
const html = JSON.parse(match[1]);

const mIdx = html.indexOf('function renderModals()');
console.log('--- renderModals snippet ---');
console.log(html.slice(mIdx, mIdx + 1200));
