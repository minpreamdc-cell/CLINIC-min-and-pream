const fs = require('fs');
const src = fs.readFileSync('cloudflare/worker.js', 'utf8');
const match = src.match(/const HTML_PAGE = ([\s\S]*?);\s*export default/);
const html = JSON.parse(match[1]);

console.log('Has settings tab:', html.includes('tab === "settings"'));
console.log('Has backup tab:', html.includes('tab === "backup"'));
console.log('Has files tab:', html.includes('tab === "files"'));
console.log('Has ProcedureCatalog table:', html.includes('???????????????? & ???????????? DF'));
console.log('Has voidReceiptModal:', html.includes('STATE.voidReceiptModal'));
console.log('Has newDepositModal:', html.includes('STATE.newDepositModal'));
console.log('Has dfAdjustModal:', html.includes('STATE.dfAdjustModal'));
console.log('Has insurance reconciliation:', html.includes('reconcileClaimAction'));
