const fs = require('fs');
const src = fs.readFileSync('cloudflare/worker.js', 'utf8');
const match = src.match(/const HTML_PAGE = ([\s\S]*?);\s*export default/);
const html = JSON.parse(match[1]);

console.log('Searching for function declarations:');
const fnMatches = [...html.matchAll(/function\s+([a-zA-Z0-9_]+)\s*\(/g)].map(m => m[1]);
console.log('Functions:', fnMatches.slice(0, 30));

const navIdx = html.indexOf('NAV_ITEMS');
if (navIdx !== -1) {
  console.log('NAV_ITEMS snippet:');
  console.log(html.slice(navIdx, navIdx + 500));
}

const renderViewIdx = html.indexOf('function renderView()');
if (renderViewIdx !== -1) {
  console.log('renderView snippet:');
  console.log(html.slice(renderViewIdx, renderViewIdx + 800));
}
