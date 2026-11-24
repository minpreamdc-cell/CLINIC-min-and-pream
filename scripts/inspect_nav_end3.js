const fs = require('fs');
const src = fs.readFileSync('cloudflare/worker.js', 'utf8');
const match = src.match(/const HTML_PAGE = ([\s\S]*?);\s*export default/);
const html = JSON.parse(match[1]);

const bIdx = html.indexOf('{ key: "backup"');
console.log(html.slice(bIdx, bIdx + 200));
