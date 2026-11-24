const fs = require('fs');
const src = fs.readFileSync('cloudflare/worker.js', 'utf8');
const match = src.match(/const HTML_PAGE = ([\s\S]*?);\s*export default/);
const html = JSON.parse(match[1]);

const matches = [...html.matchAll(/((\/\/[^\n]*\n\s*)?(\} else )?if \([^\)]*tab === [^\)]*\))/g)];
for (const m of matches) {
  console.log(m[0]);
}
