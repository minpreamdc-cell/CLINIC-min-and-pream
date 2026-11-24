const fs = require('fs');
const src = fs.readFileSync('cloudflare/worker.js', 'utf8');
const match = src.match(/const HTML_PAGE = ([\s\S]*?);\s*export default/);
const html = JSON.parse(match[1]);

function findRange(startStr, nextStr) {
  const s = html.indexOf(startStr);
  const e = html.indexOf(nextStr, s);
  console.log(startStr, "from", s, "to", e, "len:", e - s);
}

findRange('if (tab === "billing")', 'else if (tab === "ortho")');
findRange('else if (tab === "reports")', 'else if (tab === "backup")');
findRange('else if (tab === "backup")', 'else if (tab === "emr")');
