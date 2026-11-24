const fs = require('fs');

let workerSrc = fs.readFileSync('cloudflare/worker.js', 'utf8');
const match = workerSrc.match(/const HTML_PAGE = ([\s\S]*?);\s*export default/);
let html = JSON.parse(match[1]);

// 1. Expand STATE
const stateAdditions = `let STATE = {
      receipts: [],
      deposits: [],
      insuranceClaims: [],
      procedures: [],
      diagnoses: [],
      documents: [],
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

if (!html.includes('receipts: [],')) {
  html = html.replace('let STATE = {', stateAdditions);
  console.log("? Injected stateAdditions into let STATE");
}

// 2. Expand loadInitialData
const loadInitSync = `STATE.snapshots = data.snapshots || [];
        if (data.receipts) STATE.receipts = data.receipts;
        if (data.deposits) STATE.deposits = data.deposits;
        if (data.insuranceClaims) STATE.insuranceClaims = data.insuranceClaims;
        if (data.procedures) STATE.procedures = data.procedures;
        if (data.diagnoses) STATE.diagnoses = data.diagnoses;
        if (data.documents) STATE.documents = data.documents;`;

if (!html.includes('if (data.receipts) STATE.receipts = data.receipts;')) {
  html = html.replace('STATE.snapshots = data.snapshots || [];', loadInitSync);
  console.log("? Injected D1 sync into loadInitialData");
}

// 3. Inject Action Functions
const { modalsCode } = require('./mod_modals.js');
const modalMarker = 'function renderModals() {\n      const root = document.getElementById("modal-root");';
if (!html.includes('if (STATE.newDepositModal) {')) {
  html = html.replace(modalMarker, modalMarker + '\n' + modalsCode);
  console.log("? Injected modal dialogs into renderModals");
}

// Re-serialize HTML_PAGE
workerSrc = workerSrc.replace(/const HTML_PAGE = ([\s\S]*?);\s*export default/, 'const HTML_PAGE = ' + JSON.stringify(html) + ';\n\nexport default');
fs.writeFileSync('cloudflare/worker.js', workerSrc, 'utf8');
console.log("? Saved cloudflare/worker.js with all updates!");
