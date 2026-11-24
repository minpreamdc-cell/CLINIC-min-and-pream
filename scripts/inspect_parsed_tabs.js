const fs = require('fs');
const src = fs.readFileSync('cloudflare/worker.js', 'utf8');
const match = src.match(/const HTML_PAGE = ([\s\S]*?);\s*export default/);
const html = JSON.parse(match[1]);

console.log('Searching for tab switching:');
const matches = [...html.matchAll(/case\s+"([^"]+)":/g)].map(m => m[1]);
console.log('Switch cases:', matches);

const ifTabs = [...html.matchAll(/STATE\.activeTab\s*===?\s*"([^"]+)"/g)].map(m => m[1]);
console.log('STATE.activeTab comparisons:', ifTabs);
