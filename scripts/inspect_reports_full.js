const fs = require('fs');
const src = fs.readFileSync('cloudflare/worker.js', 'utf8');
const match = src.match(/const HTML_PAGE = ([\s\S]*?);\s*export default/);
const html = JSON.parse(match[1]);

const rIdx = html.indexOf('tab === "reports"');
const nextTabIdx = html.indexOf('else if (tab === "backup")', rIdx);
console.log('--- REPORTS TAB CODE (length ' + (nextTabIdx - rIdx) + ') ---');
console.log(html.slice(rIdx, rIdx + 2000));
console.log('... MIDDLE ...');
console.log(html.slice(rIdx + 2000, rIdx + 4000));
