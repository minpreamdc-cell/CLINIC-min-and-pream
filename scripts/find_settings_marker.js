const fs = require('fs');
const src = fs.readFileSync('cloudflare/worker.js', 'utf8');
const match = src.match(/const HTML_PAGE = ([\s\S]*?);\s*export default/);
const html = JSON.parse(match[1]);

const idx = html.indexOf('// 12. SETTINGS');
console.log('Index of // 12. SETTINGS:', idx);
if (idx !== -1) {
  console.log(html.slice(idx, idx + 500));
}
