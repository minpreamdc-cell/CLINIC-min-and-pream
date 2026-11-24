const fs = require('fs');
const src = fs.readFileSync('cloudflare/worker.js', 'utf8');
const match = src.match(/const HTML_PAGE = ([\s\S]*?);\s*export default/);
const html = JSON.parse(match[1]);

const m = html.match(/STATE\s*=\s*\{/);
console.log('Match STATE:', m ? m.index : 'none');
if (m) {
  console.log(html.slice(m.index, m.index + 500));
}
