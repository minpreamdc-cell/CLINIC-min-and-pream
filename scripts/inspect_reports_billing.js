const fs = require('fs');
const src = fs.readFileSync('cloudflare/worker.js', 'utf8');
const match = src.match(/const HTML_PAGE = ([\s\S]*?);\s*export default/);
const html = JSON.parse(match[1]);

const rIdx = html.indexOf('tab === "reports"');
console.log('--- REPORTS TAB (800 chars) ---');
console.log(html.slice(rIdx, rIdx + 800));

const bIdx = html.indexOf('tab === "billing"');
console.log('--- BILLING TAB (800 chars) ---');
console.log(html.slice(bIdx, bIdx + 800));
