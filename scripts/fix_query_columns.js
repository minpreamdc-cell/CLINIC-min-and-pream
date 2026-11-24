const fs = require('fs');

let src = fs.readFileSync('cloudflare/worker.js', 'utf8');

// Fix InsuranceClaim query
src = src.replace(
  `env.DB.prepare('SELECT * FROM "InsuranceClaim" ORDER BY claimDate DESC LIMIT 50').all()`,
  `env.DB.prepare('SELECT id, invoiceId, patientId, rightsType as insuranceType, claimAmount, submittedDate as claimDate, status, receivedAmount, differenceAmount, reconciledAt, reconciledBy, notes, createdAt FROM "InsuranceClaim" ORDER BY createdAt DESC LIMIT 50').all()`
);

// Fix PatientDocument query
src = src.replace(
  `env.DB.prepare('SELECT * FROM "PatientDocument" ORDER BY uploadedAt DESC LIMIT 50').all()`,
  `env.DB.prepare('SELECT id, patientId, category as documentType, title, fileUrl, fileSize, createdAt as uploadedAt, uploadedBy FROM "PatientDocument" ORDER BY createdAt DESC LIMIT 50').all()`
);

// Fix PatientDocument insert
src = src.replace(
  `INSERT INTO "PatientDocument" ("id", "patientId", "documentType", "title", "fileUrl", "fileSize", "uploadedAt", "uploadedBy", "createdAt") VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
  `INSERT INTO "PatientDocument" ("id", "patientId", "category", "title", "fileUrl", "fileSize", "uploadedBy", "createdAt") VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`
);
src = src.replace(
  `.bind(b.id || ("doc-" + Date.now()), b.patientId, b.documentType || "OTHER", b.title, b.fileUrl || "", b.fileSize || 0, b.uploadedAt || new Date().toISOString(), b.uploadedBy || "???????????")`,
  `.bind(b.id || ("doc-" + Date.now()), b.patientId, b.documentType || "OTHER", b.title, b.fileUrl || "", b.fileSize || 0, b.uploadedBy || "???????????")`
);

fs.writeFileSync('cloudflare/worker.js', src, 'utf8');
console.log("? Fixed column names for InsuranceClaim & PatientDocument");
