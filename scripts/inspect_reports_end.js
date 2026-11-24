const fs = require('fs');
const src = fs.readFileSync('cloudflare/worker.js', 'utf8');
const match = src.match(/const HTML_PAGE = ([\s\S]*?);\s*export default/);
const html = JSON.parse(match[1]);

const rIdx = html.indexOf('tab === "reports"');
const elseIdx = html.indexOf('else {', rIdx + 1000);
console.log('--- REPORTS ELSE BRANCH ---');
console.log(html.slice(elseIdx, elseIdx + 1200));
