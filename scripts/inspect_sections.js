const fs = require('fs');
const src = fs.readFileSync('cloudflare/worker.js', 'utf8');

// Check backend bootstrap
const bIdx = src.indexOf('/api/bootstrap');
console.log('--- BOOTSTRAP BACKEND ---');
console.log(src.slice(bIdx, bIdx + 600));

// Check where reports view is rendered
const rIdx = src.indexOf('function renderReportsView()');
if (rIdx !== -1) {
  console.log('--- renderReportsView ---');
  console.log(src.slice(rIdx, rIdx + 800));
} else {
  const r2 = src.indexOf('activeTab === "reports"');
  console.log('--- reports tab in renderView ---');
  console.log(src.slice(r2, r2 + 600));
}

// Check where billing view is rendered
const billIdx = src.indexOf('activeTab === "billing"');
console.log('--- billing tab in renderView ---');
console.log(src.slice(billIdx, billIdx + 600));
