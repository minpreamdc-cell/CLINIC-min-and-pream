const fs = require('fs');
const { settingsViewCode } = require('./mod_settings.js');

let workerSrc = fs.readFileSync('cloudflare/worker.js', 'utf8');
const match = workerSrc.match(/const HTML_PAGE = ([\s\S]*?);\s*export default/);
let html = JSON.parse(match[1]);

const sIdx = html.indexOf('// 12. SETTINGS');
const eIdx = html.indexOf('if (tab === "emr")', sIdx);

if (sIdx !== -1 && eIdx !== -1) {
  html = html.slice(0, sIdx) + settingsViewCode.trim() + '\n\n      // 13. CLINICAL EXAM EMR PAGE (src/app/emr/[visitId]/page.tsx)\n      ' + html.slice(eIdx);
  console.log("? Settings View successfully replaced!");
} else {
  console.error("Markers not found");
  process.exit(1);
}

workerSrc = workerSrc.replace(/const HTML_PAGE = ([\s\S]*?);\s*export default/, 'const HTML_PAGE = ' + JSON.stringify(html) + ';\n\nexport default');
fs.writeFileSync('cloudflare/worker.js', workerSrc, 'utf8');
console.log("? Updated cloudflare/worker.js");
