const fs = require('fs');
const vm = require('vm');

const { billingViewCode } = require('./mod_billing.js');
const { filesViewCode } = require('./mod_files.js');
const { reportsViewCode } = require('./mod_reports.js');
const { settingsViewCode } = require('./mod_settings.js');
const { modalsCode } = require('./mod_modals.js');
const { backendEndpointsCode } = require('./mod_backend.js');

console.log("Reading worker.js...");
let workerSrc = fs.readFileSync('cloudflare/worker.js', 'utf8');

// 1. EXTRACT HTML_PAGE
const match = workerSrc.match(/const HTML_PAGE = ([\s\S]*?);\s*export default/);
if (!match) {
  console.error("HTML_PAGE not found");
  process.exit(1);
}
let html = JSON.parse(match[1]);
console.log("Original HTML length:", html.length);

// 2. NAV_ITEMS
const navStart = html.indexOf('const NAV_ITEMS = [');
const navEnd = html.indexOf('];', navStart) + 2;
const newNav = `const NAV_ITEMS = [
      { key: "queue", label: "?????????", icon: "clock" },
      { key: "tv", label: "?? TV ????????", icon: "tv" },
      { key: "appointments", label: "?????????????", icon: "calendar" },
      { key: "patients", label: "????? & ??????????", icon: "users" },
      { key: "files", label: "?????????????????", icon: "folder" },
      { key: "recall", label: "??????????? & LINE", icon: "bell-ring" },
      { key: "billing", label: "??????? & ???????", icon: "credit-card" },
      { key: "ortho", label: "??????", icon: "smile" },
      { key: "lab", label: "??????", icon: "flask-conical" },
      { key: "inventory", label: "????????????", icon: "package" },
      { key: "operations", label: "???????????? & ????????", icon: "shield-check" },
      { key: "reports", label: "?????? & DF ?????", icon: "bar-chart-3" },
      { key: "settings", label: "?????????????????", icon: "settings" }
    ];`;
html = html.slice(0, navStart) + newNav + html.slice(navEnd);
console.log("? 1. NAV_ITEMS updated");

// 3. STATE
if (!html.includes('insuranceClaims: [')) {
  const stateMarker = 'const STATE = {';
  const stateAdditions = `const STATE = {
      receipts: [
        { id: "rec-1", receiptNo: "REC-26001", patientId: "pat-1", receiptDate: "2026-11-24T10:30:00Z", totalAmount: 1200, totalDiscount: 0, netAmount: 1200, paidAmount: 1200, paymentMethodSummary: "PromptPay QR", isVoided: 0, treatments: "???????????????? (D10)" },
        { id: "rec-2", receiptNo: "REC-26002", patientId: "pat-2", receiptDate: "2026-11-24T11:15:00Z", totalAmount: 2500, totalDiscount: 200, netAmount: 2300, paidAmount: 2300, paymentMethodSummary: "??????", isVoided: 0, treatments: "?????????????? 2 ???? (D22)" },
        { id: "rec-3", receiptNo: "REC-26003", patientId: "pat-3", receiptDate: "2026-11-23T14:00:00Z", totalAmount: 4500, totalDiscount: 0, netAmount: 4500, paidAmount: 4500, paymentMethodSummary: "??????????", isVoided: 1, voidReason: "?????????????????????????????????????????????", voidedBy: "??. ??????", voidedAt: "2026-11-23T15:00:00Z", treatments: "???????????? (D35)" }
      ],
      deposits: [
        { id: "dep-1", patientId: "pat-1", date: "2026-11-24T09:00:00Z", type: "RECEIVE", amount: 5000, balanceAfter: 5000, paymentMethod: "PROMPTPAY", notes: "???????????????????????????", processedBy: "???????? (??????????)" },
        { id: "dep-2", patientId: "pat-1", date: "2026-11-24T11:30:00Z", type: "USE", amount: 1500, balanceAfter: 3500, paymentMethod: "DEPOSIT_DEDUCT", notes: "???????????????????????? X-Ray", processedBy: "???????? (??????????)" },
        { id: "dep-3", patientId: "pat-2", date: "2026-11-23T15:00:00Z", type: "RECEIVE", amount: 3000, balanceAfter: 3000, paymentMethod: "TRANSFER", notes: "?????????????????? Zirconia", processedBy: "??????? (???????)" }
      ],
      insuranceClaims: [
        { id: "claim-1", patientId: "pat-1", claimDate: "2026-11-24", insuranceType: "SSO", procedureCode: "D10", procedureName: "????????????????", claimAmount: 900, receivedAmount: 900, differenceAmount: 0, status: "APPROVED", reconciledAt: "2026-11-24T12:00:00Z", reconciledBy: "???????? (???????)" },
        { id: "claim-2", patientId: "pat-2", claimDate: "2026-11-24", insuranceType: "SSO", procedureCode: "D21", procedureName: "??????????????", claimAmount: 900, receivedAmount: 0, differenceAmount: 900, status: "PENDING", reconciledAt: null, reconciledBy: null },
        { id: "claim-3", patientId: "pat-3", claimDate: "2026-11-23", insuranceType: "UC", procedureCode: "D30", procedureName: "?????????", claimAmount: 450, receivedAmount: 450, differenceAmount: 0, status: "APPROVED", reconciledAt: "2026-11-23T16:00:00Z", reconciledBy: "???????? (???????)" }
      ],
      procedures: [
        { code: "D01", nameTh: "???????????????????????????????", category: "GENERAL", standardPrice: 300, dfType: "PERCENT", dfValue: 50, durationMinutes: 30, isActive: 1 },
        { code: "D10", nameTh: "?????????????????????????", category: "PREVENTIVE", standardPrice: 1200, dfType: "PERCENT", dfValue: 50, durationMinutes: 45, isActive: 1 },
        { code: "D21", nameTh: "????????????????????????? 1 ????", category: "OPERATIVE", standardPrice: 900, dfType: "PERCENT", dfValue: 50, durationMinutes: 30, isActive: 1 },
        { code: "D22", nameTh: "????????????????????????? 2 ????", category: "OPERATIVE", standardPrice: 1500, dfType: "PERCENT", dfValue: 50, durationMinutes: 45, isActive: 1 },
        { code: "D30", nameTh: "?????????????", category: "SURGERY", standardPrice: 1000, dfType: "FIXED", dfValue: 500, durationMinutes: 30, isActive: 1 },
        { code: "D35", nameTh: "????????????????????????", category: "SURGERY", standardPrice: 4500, dfType: "PERCENT", dfValue: 60, durationMinutes: 60, isActive: 1 },
        { code: "D40", nameTh: "??????????????? (??????)", category: "ENDO", standardPrice: 5500, dfType: "PERCENT", dfValue: 55, durationMinutes: 60, isActive: 1 },
        { code: "D71", nameTh: "???????? Cool Light ????????", category: "ESTHETIC", standardPrice: 6500, dfType: "FIXED", dfValue: 3000, durationMinutes: 90, isActive: 1 }
      ],
      diagnoses: [
        { code: "K02.1", nameTh: "???????????????? (Dental caries of dentine)", category: "CARIES" },
        { code: "K05.1", nameTh: "???????????????????? (Chronic gingivitis)", category: "PERIODONTAL" },
        { code: "K05.0", nameTh: "????????????????????? (Acute gingivitis)", category: "PERIODONTAL" },
        { code: "K04.0", nameTh: "?????????????????????? (Pulpitis)", category: "ENDO" },
        { code: "K07.2", nameTh: "???????????? (Dentofacial anomalies)", category: "ORTHO" },
        { code: "K01.1", nameTh: "????????????? (Impacted teeth)", category: "SURGERY" }
      ],
      documents: [
        { id: "doc-1", patientId: "pat-1", documentType: "XRAY", title: "?????????????????????? (Panoramic OPG Film)", fileUrl: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=600&q=80", fileSize: 4325400, uploadedAt: "2026-11-24T10:00:00Z", uploadedBy: "??. ??????" },
        { id: "doc-2", patientId: "pat-1", documentType: "INTRAORAL", title: "???????????????????????? (Intraoral Pre-op)", fileUrl: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=600&q=80", fileSize: 2154000, uploadedAt: "2026-11-24T10:15:00Z", uploadedBy: "???????????" },
        { id: "doc-3", patientId: "pat-1", documentType: "CONSENT", title: "????????????????????????? (Informed Consent Form)", fileUrl: "https://images.unsplash.com/photo-1568667256549-094345857637?auto=format&fit=crop&w=600&q=80", fileSize: 845200, uploadedAt: "2026-11-24T09:30:00Z", uploadedBy: "???????? (??????????)" },
        { id: "doc-4", patientId: "pat-2", documentType: "OPD", title: "????????????????????????????????????? (OPD Card Scan)", fileUrl: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80", fileSize: 1850000, uploadedAt: "2026-11-23T14:30:00Z", uploadedBy: "???????? (??????????)" },
        { id: "doc-5", patientId: "pat-2", documentType: "XRAY", title: "????????????????????? Periapical Film #16", fileUrl: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=600&q=80", fileSize: 1250000, uploadedAt: "2026-11-23T14:45:00Z", uploadedBy: "??. ????" }
      ],
      trashDocuments: [],
      discounts: [
        { id: "disc-1", name: "???????????????????????? ??????????? 10%", type: "PERCENT", value: 10, startDate: "2026-11-01", endDate: "2026-11-30", procCode: "D10", status: "ACTIVE" },
        { id: "disc-2", name: "???????????????????????? 3,000 ???", type: "FIXED", value: 3000, startDate: "2026-11-01", endDate: "2026-12-31", procCode: "ORTHO", status: "ACTIVE" }
      ],
      patientGroups: [
        { id: "grp-1", name: "??????????? (Standard)", discountPercent: 0, desc: "??????????????????????????" },
        { id: "grp-2", name: "?????? VIP ?????? (VIP Member)", discountPercent: 10, desc: "??????????????????????? 10%" },
        { id: "grp-3", name: "???????? / ???????? (Student)", discountPercent: 10, desc: "?? 10% ????????? ????????????????" },
        { id: "grp-4", name: "????????????????????? (Corporate)", discountPercent: 5, desc: "?? 5% ?????????????????????????" }
      ],
      settingsTab: "procedures",
      billingTab: "invoices",
      billingSearchReceipt: "",
      billingDateFilter: "",
      filesCategory: "ALL",
      filesSearch: "",
      previewDocModal: null,
      uploadDocModal: false,
      dfAdjustModal: null,
      voidReceiptModal: null,
      newDepositModal: false,
      newProcedureModal: false,
      newDiscountModal: false,`;
  html = html.replace(stateMarker, stateAdditions);
  console.log("? 2. STATE expanded");
}

// 4. LOAD INITIAL DATA
if (!html.includes('if (data.receipts && data.receipts.length) STATE.receipts = data.receipts;')) {
  const oldLoadInit = `STATE.snapshots = data.snapshots || [];`;
  const newLoadInit = `STATE.snapshots = data.snapshots || [];
        if (data.receipts && data.receipts.length) STATE.receipts = data.receipts;
        if (data.deposits && data.deposits.length) STATE.deposits = data.deposits;
        if (data.insuranceClaims && data.insuranceClaims.length) STATE.insuranceClaims = data.insuranceClaims;
        if (data.procedures && data.procedures.length) STATE.procedures = data.procedures;
        if (data.diagnoses && data.diagnoses.length) STATE.diagnoses = data.diagnoses;
        if (data.documents && data.documents.length) STATE.documents = data.documents;`;
  html = html.replace(oldLoadInit, newLoadInit);
  console.log("? 3. loadInitialData updated");
}

// 5. INJECT MODALS
const modalMarker = 'function renderModals() {\n      const root = document.getElementById("modal-root");';
if (html.includes(modalMarker) && !html.includes('if (STATE.newDepositModal) {')) {
  html = html.replace(modalMarker, modalMarker + '\n' + modalsCode);
  console.log("? 4. Modals injected into renderModals");
}

// 6. REPLACE BILLING VIEW
const bStart = html.indexOf('if (tab === "billing")');
const bEnd = html.indexOf('if (tab === "ortho")');
if (bStart !== -1 && bEnd !== -1) {
  html = html.slice(0, bStart) + billingViewCode.trim() + '\n\n      // 7. ORTHODONTICS (src/app/ortho/page.tsx)\n      ' + html.slice(bEnd + 'if (tab === "ortho")'.length);
  console.log("? 5. Billing View updated with search, history, void");
}

// 7. INJECT FILES VIEW
const recallMarker = '// 5. RECALL & LINE OA CRM (src/app/recall/page.tsx)';
if (!html.includes('if (tab === "files")')) {
  html = html.replace(recallMarker, filesViewCode.trim() + '\n\n      ' + recallMarker);
  console.log("? 6. Central Files View injected");
}

// 8. REPLACE REPORTS VIEW
const rStart = html.indexOf('if (tab === "reports")');
const rEnd = html.indexOf('if (tab === "backup")');
if (rStart !== -1 && rEnd !== -1) {
  html = html.slice(0, rStart) + reportsViewCode.trim() + '\n\n      // 12. SETTINGS & CLOUDFLARE D1 BACKUP (src/app/settings/page.tsx)\n      ' + html.slice(rEnd + 'if (tab === "backup")'.length);
  console.log("? 7. Reports View updated with deposits & insurance");
}

// 9. REPLACE SETTINGS / BACKUP VIEW
const sStart = html.indexOf('if (tab === "backup")');
const sEnd = html.indexOf('if (tab === "emr")');
if (sStart !== -1 && sEnd !== -1) {
  html = html.slice(0, sStart) + settingsViewCode.trim() + '\n\n      // 13. CLINICAL EXAM EMR PAGE (src/app/emr/[visitId]/page.tsx)\n      ' + html.slice(sEnd + 'if (tab === "emr")'.length);
  console.log("? 8. Settings View updated with procedures, ICD-10, discounts");
}

// 10. REPACK HTML INTO WORKER
workerSrc = workerSrc.replace(/const HTML_PAGE = ([\s\S]*?);\s*export default/, 'const HTML_PAGE = ' + JSON.stringify(html) + ';\n\nexport default');
console.log("? 9. HTML_PAGE re-serialized into worker.js");

// 11. EXPAND BACKEND BOOTSTRAP
const bootstrapOldQueries = `env.DB.prepare('SELECT id, backupLabel, patientCount, visitCount, receiptCount, createdBy, createdAt FROM "CloudBackupSnapshot" ORDER BY createdAt DESC LIMIT 15').all()`;
const bootstrapNewQueries = `env.DB.prepare('SELECT id, backupLabel, patientCount, visitCount, receiptCount, createdBy, createdAt FROM "CloudBackupSnapshot" ORDER BY createdAt DESC LIMIT 15').all(),
        env.DB.prepare('SELECT * FROM "Receipt" ORDER BY createdAt DESC LIMIT 50').all().catch(() => ({ results: [] })),
        env.DB.prepare('SELECT * FROM "Deposit" ORDER BY date DESC LIMIT 50').all().catch(() => ({ results: [] })),
        env.DB.prepare('SELECT * FROM "InsuranceClaim" ORDER BY claimDate DESC LIMIT 50').all().catch(() => ({ results: [] })),
        env.DB.prepare('SELECT * FROM "ProcedureCatalog" ORDER BY code ASC').all().catch(() => ({ results: [] })),
        env.DB.prepare('SELECT * FROM "DiagnosisCatalog" ORDER BY code ASC').all().catch(() => ({ results: [] })),
        env.DB.prepare('SELECT * FROM "PatientDocument" ORDER BY uploadedAt DESC LIMIT 50').all().catch(() => ({ results: [] }))`;

const bootstrapOldDestruct = `const [doctors, rooms, appointmentTypes, patients, appointments, visits, invoices, orthoPackages, patientOrthoPackages, inventory, labOrders, snapshots] = await Promise.all([`;
const bootstrapNewDestruct = `const [doctors, rooms, appointmentTypes, patients, appointments, visits, invoices, orthoPackages, patientOrthoPackages, inventory, labOrders, snapshots, receipts, deposits, insuranceClaims, procedures, diagnoses, documents] = await Promise.all([`;

const bootstrapOldJson = `snapshots: snapshots.results || []\n      }),`;
const bootstrapNewJson = `snapshots: snapshots.results || [],
        receipts: receipts?.results || [],
        deposits: deposits?.results || [],
        insuranceClaims: insuranceClaims?.results || [],
        procedures: procedures?.results || [],
        diagnoses: diagnoses?.results || [],
        documents: documents?.results || []
      }),`;

if (workerSrc.includes(bootstrapOldQueries) && !workerSrc.includes('receipts?.results')) {
  workerSrc = workerSrc.replace(bootstrapOldDestruct, bootstrapNewDestruct);
  workerSrc = workerSrc.replace(bootstrapOldQueries, bootstrapNewQueries);
  workerSrc = workerSrc.replace(bootstrapOldJson, bootstrapNewJson);
  console.log("? 10. Backend bootstrap expanded with D1 tables");
}

// 12. INJECT BACKEND ENDPOINTS
if (!workerSrc.includes('/api/deposits')) {
  const returnHtmlMarker = 'return new Response(HTML_PAGE, { headers: { "Content-Type": "text/html; charset=utf-8" } });';
  workerSrc = workerSrc.replace(returnHtmlMarker, backendEndpointsCode.trim() + '\n\n    ' + returnHtmlMarker);
  console.log("? 11. Backend endpoints (/api/deposits, receipts-void, claims-reconcile, procedures, documents) injected");
}

// 13. WRITE TO WORKER.JS
fs.writeFileSync('cloudflare/worker.js', workerSrc, 'utf8');
console.log("? 12. Written successfully to cloudflare/worker.js! Length:", workerSrc.length);

// 14. SYNTAX VALIDATION
try {
  new vm.Script(workerSrc);
  console.log("? SYNTAX VALIDATION PASSED! Ready to deploy.");
} catch (e) {
  console.error("? Syntax error:", e.message);
  process.exit(1);
}
