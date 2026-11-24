const fs = require('fs');
const src = fs.readFileSync('cloudflare/worker.js', 'utf8');
console.log('Worker total length:', src.length);
console.log('Has D1 binding check:', src.includes('env.DB'));
console.log('Has /api/bootstrap:', src.includes('/api/bootstrap'));
console.log('Has ProcedureCatalog:', src.includes('ProcedureCatalog'));
console.log('Has central files tab:', src.includes('filesCategory'));
console.log('Has deposits in reports:', src.includes('deposits'));
