const fs = require('fs');
const src = fs.readFileSync('cloudflare/worker.js', 'utf8');
const match = src.match(/const HTML_PAGE = ([\s\S]*?);\s*export default/);
const html = JSON.parse(match[1]);

const tabMatches = [...html.matchAll(/tab === "([^"]+)"/g)].map(m => m[1]);
console.log('Tabs handled in renderView:', [...new Set(tabMatches)]);
