const fs = require('fs');
const src = fs.readFileSync('cloudflare/worker.js', 'utf8');
const match = src.match(/const HTML_PAGE = ([\s\S]*?);\s*export default/);
const html = JSON.parse(match[1]);

const sIdx = html.indexOf('// 12. SETTINGS');
const eIdx = html.indexOf('if (tab === "emr")', sIdx);
console.log('Settings block from', sIdx, 'to', eIdx, 'len:', eIdx - sIdx);
