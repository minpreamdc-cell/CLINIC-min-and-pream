const fs = require('fs');
const src = fs.readFileSync('cloudflare/worker.js', 'utf8');
const match = src.match(/const HTML_PAGE = ([\s\S]*?);\s*export default/);
const html = JSON.parse(match[1]);

const bStart = html.indexOf('if (tab === "billing")');
const bEnd = html.indexOf('if (tab === "ortho")');
console.log("billing from", bStart, "to", bEnd, "len:", bEnd - bStart);
console.log(html.slice(bEnd - 200, bEnd));
