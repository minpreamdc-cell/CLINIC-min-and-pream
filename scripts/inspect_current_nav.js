const fs = require('fs');
const src = fs.readFileSync('cloudflare/worker.js', 'utf8');
const match = src.match(/const HTML_PAGE = ([\s\S]*?);\s*export default/);
const html = JSON.parse(match[1]);

const navIdx = html.indexOf('const NAV_ITEMS');
console.log(html.slice(navIdx, navIdx + 800));
