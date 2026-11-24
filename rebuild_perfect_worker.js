const fs = require('fs');
const zlib = require('zlib');
const vm = require('vm');

let html = fs.readFileSync('live_downloaded.html', 'utf8');

const lines = html.split('\n');
let replaced = false;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('selectModalPatient') && lines[i].includes('switchTab')) {
    console.log('Found and fixing line', i + 1);
    lines[i] = "            '<td class=\"px-4 py-3 text-right whitespace-nowrap\"><button type=\"button\" data-pid=\"' + p.id + '\" onclick=\"selectModalPatient(this.dataset.pid); switchTab(\\'emr\\');\" class=\"px-3 py-1.5 rounded-lg text-xs font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 transition-colors inline-flex items-center gap-1\"><span>เปิดแฟ้มประวัติ</span><i data-lucide=\"chevron-right\" class=\"w-3.5 h-3.5\"></i></button></td>' +";
    replaced = true;
  }
}
console.log('Replaced successfully:', replaced);
html = lines.join('\n');

// Verify the script inside html
const s1 = html.indexOf('<script>');
const s2 = html.lastIndexOf('</script>');
const scriptContent = html.slice(s1 + 8, s2);

try {
  new vm.Script(scriptContent);
  console.log('SUCCESS: Script in HTML is 100% syntactically valid!');
} catch (e) {
  console.error('ERROR in HTML script:', e);
  process.exit(1);
}

// Extract clean API handler (lines 816-952 of cloudflare/worker.js)
const fullWorkerSrc = fs.readFileSync('cloudflare/worker.js', 'utf8');
const expIdx = fullWorkerSrc.indexOf('export default {');
const endMarker = 'return new Response(HTML_PAGE, { headers: { "Content-Type": "text/html; charset=utf-8" } });\n  }\n};';
const endIdx = fullWorkerSrc.indexOf(endMarker);
let apiHandler;
if (endIdx !== -1) {
  apiHandler = fullWorkerSrc.slice(expIdx, endIdx + endMarker.length);
} else {
  // Handle CRLF if present
  const endMarkerCRLF = 'return new Response(HTML_PAGE, { headers: { "Content-Type": "text/html; charset=utf-8" } });\r\n  }\r\n};';
  const endIdxCRLF = fullWorkerSrc.indexOf(endMarkerCRLF);
  apiHandler = fullWorkerSrc.slice(expIdx, endIdxCRLF + endMarkerCRLF.length);
}

const completeWorker = 'const HTML_PAGE = ' + JSON.stringify(html) + ';\n\n' + apiHandler + '\n';

try {
  new vm.Script(completeWorker.replace('export default', 'const _mod ='));
  console.log('SUCCESS: Complete worker is 100% syntactically valid! Length:', completeWorker.length);
} catch (e) {
  console.error('ERROR in complete worker:', e);
  process.exit(1);
}

fs.writeFileSync('cloudflare/worker.js', completeWorker, 'utf8');

// Gzip compress
const gz = zlib.gzipSync(Buffer.from(completeWorker, 'utf8'));
const b64 = gz.toString('base64');
console.log('Gzip Base64 length:', b64.length);

const size = 8000;
const chunks = [];
for (let i = 0; i < b64.length; i += size) {
  chunks.push(b64.slice(i, i + size));
}
console.log('Chunks:', chunks.length, chunks.map(c => c.length));
chunks.forEach((c, i) => {
  fs.writeFileSync(`fix_chunk_${i + 1}.txt`, c, 'utf8');
});
console.log('Successfully saved fix_chunk_1..4.txt!');

