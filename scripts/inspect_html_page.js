const fs = require('fs');
const src = fs.readFileSync('cloudflare/worker.js', 'utf8');
const match = src.match(/const HTML_PAGE = ([\s\S]*?);\s*export default/);
if (match) {
  console.log('HTML_PAGE starts with:', match[1].slice(0, 100));
  try {
    const parsed = JSON.parse(match[1]);
    console.log('Parsed HTML length:', parsed.length);
    console.log('Has reports in parsed HTML:', parsed.includes('activeTab === "reports"'));
    console.log('Has billing in parsed HTML:', parsed.includes('activeTab === "billing"'));
  } catch (e) {
    console.log('JSON.parse error:', e.message);
  }
}
