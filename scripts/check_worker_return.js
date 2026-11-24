const fs = require('fs');
const src = fs.readFileSync('cloudflare/worker.js', 'utf8');

const retIdx = src.lastIndexOf('return new Response(HTML_PAGE');
console.log('Return index:', retIdx);
console.log(src.slice(retIdx, retIdx + 200));

const match = src.match(/const HTML_PAGE = ([\s\S]*?);\s*export default/);
const html = JSON.parse(match[1]);
console.log('HTML in worker has ?????????????????:', html.includes('?????????????????'));
