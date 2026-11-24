const fs = require('fs');
const src = fs.readFileSync('cloudflare/worker.js', 'utf8');
const match = src.match(/const HTML_PAGE = ([\s\S]*?);\s*export default/);
const html = JSON.parse(match[1]);

const rStart = html.indexOf('if (tab === "reports")');
const rEnd = html.indexOf('if (tab === "backup")');
console.log("reports from", rStart, "to", rEnd, "len:", rEnd - rStart);
console.log(html.slice(rEnd - 200, rEnd));
