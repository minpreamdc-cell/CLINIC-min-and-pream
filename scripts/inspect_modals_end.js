const fs = require('fs');
const src = fs.readFileSync('cloudflare/worker.js', 'utf8');
const match = src.match(/const HTML_PAGE = ([\s\S]*?);\s*export default/);
const html = JSON.parse(match[1]);

const mIdx = html.indexOf('function renderModals()');
const nextFn = html.indexOf('async function triggerCloudBackup()', mIdx);
console.log('renderModals from', mIdx, 'to', nextFn);
console.log(html.slice(nextFn - 200, nextFn));
