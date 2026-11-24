const fs = require('fs');
const vm = require('vm');
const zlib = require('zlib');

// Read current_spa.html up to renderView()
const currentHtml = fs.readFileSync('current_spa.html', 'utf8');

// Let's build the complete, 100% faithful HTML_PAGE matching every src/app/**/page.tsx
const html = `<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>คลินิกทันตกรรมหมอมิน หมอพรีม | Min & Preem Dental Clinic</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://unpkg.com/lucide@latest"></script>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; }
    @media print { .no-print { display: none !important; } body { background: white !important; } }
    .no-scrollbar::-webkit-scrollbar { display: none; }
    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-track { background: #f1f5f9; }
    ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }
  </style>
</head>
<body class="min-h-screen flex flex-col md:flex-row bg-slate-50 text-slate-900 antialiased">
  <div id="sidebar-spacer" class="hidden md:block shrink-0 w-20 transition-all duration-300 ease-in-out no-print"></div>
  <aside id="left-sidebar"
    onmouseenter="expandSidebar(true)"
    onmouseleave="expandSidebar(false)"
    class="fixed top-0 left-0 bottom-0 z-50 bg-white border-r border-slate-200 flex flex-col justify-between transition-all duration-300 ease-in-out w-20 shadow-sm no-print">
    <div>
      <div class="h-16 px-3.5 flex items-center justify-between border-b border-slate-100">
        <a href="#queue" onclick="switchTab('queue'); return false;" class="flex items-center gap-3 min-w-0 group">
          <div class="w-11 h-11 shrink-0 rounded-xl bg-gradient-to-tr from-sky-600 via-teal-500 to-emerald-400 flex items-center justify-center text-white shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform">
            <i data-lucide="sparkles" class="w-5 h-5"></i>
          </div>
          <div class="sidebar-label hidden overflow-hidden transition-all duration-300">
            <div class="flex items-center gap-1.5">
              <span class="font-bold text-sm text-slate-800 tracking-tight whitespace-nowrap">คลินิกหมอมิน หมอพรีม</span>
            </div>
            <div class="flex items-center gap-1.5 mt-0.5">
              <span class="text-[10px] font-semibold px-1.5 py-0.2 rounded-full bg-sky-50 text-sky-700 border border-sky-200 whitespace-nowrap">Min & Preem Dental</span>
            </div>
          </div>
        </a>
        <button id="pin-btn" onclick="togglePin()" title="ปักหมุดแถบเมนูค้างไว้" class="sidebar-label hidden p-1.5 rounded-lg border bg-sky-50 border-sky-200 text-sky-600 hover:bg-sky-100 transition-colors">
          <i data-lucide="pin" class="w-3.5 h-3.5"></i>
        </button>
      </div>
      <div class="px-3 pt-3 pb-1">
        <div id="clock-pill" class="bg-slate-50 border border-slate-200/80 rounded-xl transition-all duration-300 flex items-center p-2 flex-col justify-center gap-0.5">
          <span id="thai-date-label" class="sidebar-label hidden text-[11px] text-slate-500 truncate">วันอังคารที่ 24 พฤศจิกายน พ.ศ. 2569</span>
          <span id="live-clock" class="font-mono text-xs text-sky-700 font-bold whitespace-nowrap">--:--:-- น.</span>
        </div>
      </div>
      <nav id="nav-list" class="px-3 py-2 space-y-1 overflow-y-auto max-h-[calc(100vh-210px)] no-scrollbar"></nav>
    </div>
    <div class="p-3 border-t border-slate-100 bg-slate-50/50 relative">
      <div id="pin-hint" class="sidebar-label hidden mb-2 flex items-center justify-between text-[10px] text-slate-400 px-1">
        <span>📌 ปักหมุดเมนูไว้</span>
      </div>
      <button onclick="toggleRoleDropdown()" title="สลับบทบาทผู้ใช้งาน" class="w-full flex items-center rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 transition-all text-xs text-slate-800 px-2.5 py-2 justify-between">
        <div class="flex items-center gap-2.5 min-w-0">
          <div class="relative shrink-0">
            <div id="user-avatar" class="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 font-bold flex items-center justify-center text-xs">ท</div>
            <span class="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white animate-pulse"></span>
          </div>
          <div class="sidebar-label hidden text-left truncate">
            <div id="user-fullname" class="font-semibold text-slate-900 leading-tight truncate">ทพ. มินตรา (เจ้าของคลินิก)</div>
            <div id="user-rolename" class="text-[10px] text-slate-500 truncate">เจ้าของคลินิก / ผู้ดูแลระบบ</div>
          </div>
        </div>
        <i data-lucide="chevron-down" class="sidebar-label hidden w-3.5 h-3.5 text-slate-400 shrink-0"></i>
      </button>
      <div id="role-dropdown" class="hidden absolute bottom-16 left-3 w-64 bg-white rounded-xl shadow-2xl border border-slate-200 py-2 z-50"></div>
    </div>
  </aside>
  <main class="flex-1 min-w-0 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
    <div id="app-view"></div>
  </main>
  <div id="modal-root"></div>
  <script>
    function showToast(msg, type) {
      var c = document.getElementById("toast-container");
      if (!c) {
        c = document.createElement("div");
        c.id = "toast-container";
        c.className = "fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm pointer-events-none";
        document.body.appendChild(c);
      }
      var t = document.createElement("div");
      var bg = type === "error" ? "bg-rose-600 text-white" : "bg-emerald-600 text-white";
      t.className = "pointer-events-auto px-4 py-3 rounded-xl shadow-xl text-xs font-semibold flex items-center gap-2 " + bg;
      t.innerHTML = "<span>" + msg + "</span>";
      c.appendChild(t);
      setTimeout(function() { t.remove(); }, 3500);
    }

    const THAI_MONTHS_SHORT = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
    const THAI_MONTHS_FULL = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];
    const THAI_DAYS = ["วันอาทิตย์", "วันจันทร์", "วันอังคาร", "วันพุธ", "วันพฤหัสบดี", "วันศุกร์", "วันเสาร์"];

    function formatCurrency(amount) {
      var n = Number(amount);
      if (amount === null || amount === undefined || isNaN(n)) return "0.00 ฿";
      return n.toLocaleString("th-TH", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " ฿";
    }

    function formatThaiDate(dateInput, full) {
      if (!dateInput) return "-";
      var d = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
      if (isNaN(d.getTime())) return String(dateInput);
      var day = d.getDate();
      var mIdx = d.getMonth();
      var yBE = d.getFullYear() + 543;
      if (full) {
        return THAI_DAYS[d.getDay()] + "ที่ " + day + " " + THAI_MONTHS_FULL[mIdx] + " พ.ศ. " + yBE;
      }
      return day + " " + THAI_MONTHS_SHORT[mIdx] + " " + yBE;
    }

    function formatThaiDateTime(dateInput) {
      if (!dateInput) return "-";
      var d = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
      if (isNaN(d.getTime())) return String(dateInput);
      var ds = formatThaiDate(d, false);
      var hh = String(d.getHours()).padStart(2, "0");
      var mm = String(d.getMinutes()).padStart(2, "0");
      return ds + " " + hh + ":" + mm + " น.";
    }

    const PERMANENT_TEETH_UPPER = [["18","17","16","15","14","13","12","11"],["21","22","23","24","25","26","27","28"]];
    const PERMANENT_TEETH_LOWER = [["48","47","46","45","44","43","42","41"],["31","32","33","34","35","36","37","38"]];
    const PRIMARY_TEETH_UPPER = [["55","54","53","52","51"],["61","62","63","64","65"]];
    const PRIMARY_TEETH_LOWER = [["85","84","83","82","81"],["71","72","73","74","75"]];
    const TOOTH_CONDITIONS_CONFIG = {
      NORMAL: { label: "ปกติ", short: "ปกติ", color: "#16a34a", bg: "#dcfce7" },
      CARIES: { label: "ฟันผุ (Caries)", short: "ผุ", color: "#dc2626", bg: "#fee2e2" },
      FILLING: { label: "อุดฟันแล้ว (Filling)", short: "อุด", color: "#2563eb", bg: "#dbeafe" },
      CROWN: { label: "ครอบฟัน (Crown)", short: "ครอบ", color: "#9333ea", bg: "#f3e8ff" },
      MISSING: { label: "ฟันหลุด/ถอนแล้ว (Missing)", short: "ถอน", color: "#64748b", bg: "#f1f5f9" },
      EXTRACTION_NEEDED: { label: "ต้องถอน/ผ่าคุด (Extraction)", short: "รอถอน", color: "#ea580c", bg: "#ffedd5" },
      ROOT_CANAL: { label: "รักษารากฟัน (RCT)", short: "ราก", color: "#b91c1c", bg: "#ffe4e6" },
      IMPLANT: { label: "รากฟันเทียม (Implant)", short: "Implant", color: "#0891b2", bg: "#cffafe" },
      VENEER: { label: "วีเนียร์ (Veneer)", short: "Veneer", color: "#059669", bg: "#ecfdf5" }
    };

    const AVAILABLE_USERS = [
      { username: "counter", fullName: "คุณสมศรี (เคาน์เตอร์)", role: "COUNTER", roleTh: "พนักงานหน้าเคาน์เตอร์", color: "bg-emerald-500" },
      { username: "doctormin", fullName: "ทพ. มินตรา (หมอมิน)", role: "DENTIST", roleTh: "ทันตแพทย์", color: "bg-sky-500" },
      { username: "doctorpreem", fullName: "ทพญ. พรีมญา (หมอพรีม)", role: "DENTIST", roleTh: "ทันตแพทย์", color: "bg-teal-500" },
      { username: "admin", fullName: "ทพ. มินตรา (เจ้าของคลินิก)", role: "ADMIN", roleTh: "เจ้าของคลินิก / ผู้ดูแลระบบ", color: "bg-indigo-600" },
      { username: "finance", fullName: "คุณบัญชา (การเงิน)", role: "FINANCE", roleTh: "ฝ่ายการเงิน / แคชเชียร์", color: "bg-amber-500" },
      { username: "assistant", fullName: "คุณน้ำหวาน (ผู้ช่วย)", role: "ASSISTANT", roleTh: "ผู้ช่วยทันตแพทย์", color: "bg-purple-500" }
    ];

    let STATE = {
      activeTab: "queue",
      currentUser: AVAILABLE_USERS[3],
      roleDropdownOpen: false,
      selectedDate: new Date().toISOString().split("T")[0],
      viewMode: "ROOM",
      isPinned: true,
      isHovered: false,
      doctors: [],
      rooms: [],
      appointmentTypes: [],
      patients: [],
      appointments: [],
      visits: [],
      invoices: [],
      receipts: [],
      orthoPackages: [],
      patientOrthoPackages: [],
      orthoInstallments: [],
      orthoLogs: [],
      inventory: [],
      inventoryMovements: [],
      labOrders: [],
      blockedSlots: [],
      treatmentItems: [],
      toothConditions: [],
      treatmentPlans: [],
      patientDocuments: [],
      snapshots: [],
      // Sub-tab & Filter states matching local pages
      tvSoundEnabled: true,
      appFilterSearch: "",
      appFilterDate: "",
      appFilterDoctor: "all",
      appFilterStatus: "all",
      rescheduleTargetId: null,
      rescheduleDate: "",
      rescheduleTime: "09:00",
      cancelTargetId: null,
      cancelReason: "",
      patientSearch: "",
      patientRights: "all",
      patientDoctorId: "all",
      selectedPatientId: null,
      patientProfileTab: "general",
      toothChartTab: "PERMANENT",
      selectedToothNo: null,
      toothCondType: "CARIES",
      toothSurfaces: [],
      toothNotes: "",
      docSubTab: "gallery",
      sliderPos: 50,
      certType: "MEDICAL_CERT",
      certDiagnosis: "โรคฟันผุและเหงือกอักเสบ (Dental Caries & Gingivitis)",
      certTreatment: "ขูดหินปูนทั้งปาก และอุดฟันคอมโพสิตเรซิน",
      certRestDays: 1,
      certAmount: 900,
      depositModalOpen: false,
      depositType: "RECEIVE",
      depositAmount: "",
      depositMethod: "TRANSFER",
      depositNotes: "",
      newPlanCode: "D10",
      newPlanName: "ขูดหินปูนทั้งปากพร้อมขัดฟัน",
      newPlanTooth: "",
      newPlanPrice: 1200,
      recallTab: "upcoming",
      recallSentIds: {},
      previewLineModal: null,
      billingSearch: "",
      billingStatusFilter: "all",
      activePaymentInvoiceId: null,
      splitPayments: [{ method: "TRANSFER", amount: "", details: "PromptPay QR" }],
      paymentDate: new Date().toISOString().split("T")[0],
      selectedReceiptId: null,
      receiptFormat: "A4",
      voidReceiptModalOpen: false,
      voidReceiptReason: "",
      orthoModalPkgId: null,
      orthoUpperWire: ".014 NiTi",
      orthoLowerWire: ".014 NiTi",
      orthoElastics: "Class II 3/16 4.5oz",
      orthoProcNotes: "ปรับเครื่องมือ เปลี่ยนยาง O-ring สีฟ้า",
      orthoNextTarget: "เปลี่ยนลวด .016 NiTi ในอีก 4 สัปดาห์",
      labStatusFilter: "all",
      labModalOpen: false,
      labForm: { patientId: "", doctorId: "", workType: "CROWN", toothNumber: "21", shadeGuide: "A2", dueDate: new Date(Date.now() + 7*86400000).toISOString().split("T")[0], labCompanyName: "โมเดิร์น เดนทัล แลป", cost: 3200, deductionType: "DOCTOR", instructions: "" },
      labRevisionOrderId: null,
      labRevisionNotes: "",
      invSearch: "",
      invCategory: "all",
      invLowStockOnly: false,
      invMoveItemId: null,
      invMoveType: "RECEIVE",
      invMoveQty: "",
      invMoveReason: "",
      invNewModalOpen: false,
      invNewForm: { code: "", category: "DRUG", name: "", unit: "แผง", minStockAlert: 10, currentStock: 50, costPrice: 0, salePrice: 0 },
      opsTab: "sterilization",
      opsBlockDate: new Date().toISOString().split("T")[0],
      opsBlockDoctorId: "",
      opsBlockReason: "ติดประชุมวิชาการ / ลางาน",
      reportsTab: "dashboard",
      reportStartDate: new Date().toISOString().split("T")[0],
      reportEndDate: new Date().toISOString().split("T")[0],
      reportDoctorId: "all",
      dailyCloseDate: new Date().toISOString().split("T")[0],
      dailyCloseDone: false,
      countedCash: "",
      countedTransfer: "",
      countedCard: "",
      countedQr: "",
      closeReason: "",
      settingsTab: "clinic",
      clinicSetting: {
        clinicNameTh: "คลินิกทันตกรรมหมอมิน หมอพรีม",
        clinicNameEn: "Min & Preem Dental Clinic",
        taxId: "0105567012345",
        phone: "02-123-4567, 089-999-8888",
        address: "123/45 ถนนสุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพมหานคร 10110",
        defaultDfDeductLab: true,
        defaultDfBaseNet: true,
        aiAnalyticsEnabled: true,
        receiptFormat: "A4"
      },
      linePhone: "081-234-5678",
      lineMsgType: "REMINDER",
      lineSendLog: [],
      csvText: "ชื่อ,นามสกุล,เบอร์โทร,สิทธิการรักษา,โรคประจำตัว,แพ้ยา\\nสมศรี,สุขใจ,0819991122,จ่ายเอง,ไม่มี,แพ้ยา Sulfa\\nวิชัย,มั่นคง,0893334455,ประกันสังคม,ความดันโลหิตสูง,ไม่มี",
      importResult: null,
      backupLabel: "สำรองข้อมูลประจำวันหลังปิดคลินิก",
      // Global Modals
      activeModal: null,
      modalSearch: "",
      modalSelectedPatient: null,
      modalError: null,
      appForm: { date: "", startTime: "09:00", durationMinutes: 30, doctorId: "", roomId: "", typeId: "", notes: "" },
      walkInForm: { doctorId: "", roomId: "", notes: "" },
      patientForm: {
        title: "คุณ", firstNameTh: "", lastNameTh: "", firstNameEn: "", lastNameEn: "",
        phone: "", birthDate: "", gender: "FEMALE", rights: "จ่ายเอง", attendingDoctorId: "",
        drugAllergies: "", chronicDiseases: "", currentMedications: "", marketingSource: "Walk-in"
      },
      activeVisitId: null,
      emrForm: {
        bpSys: 120, bpDia: 80, hr: 76, anesthesia: "ไม่ต้องฉีดยาชา",
        cc: "มาตรวจสุขภาพฟันและขูดหินปูนประจำปี ไม่มีอาการปวดฟัน",
        pe: "พบคราบหินปูนและคราบจุลินทรีย์ระดับปานกลางทั่วทั้งปาก เหงือกอักเสบเล็กน้อย",
        dx: "K05.1 เหงือกอักเสบเรื้อรังและหินปูน (Chronic gingivitis)",
        tx: "ขูดหินปูนทั้งปากด้วยเครื่อง Ultrasonic Scaler พร้อมขัดฟันด้วยแปรงและผงขัดฟัน",
        advice: "แปรงฟันให้ถูกวิธีและใช้ไหมขัดฟันทุกวัน หากมีอาการเสียวฟันจะค่อยๆ ดีขึ้นใน 3-5 วัน",
        followUp: "นัดตรวจสุขภาพช่องปากและขูดหินปูนทุก 6 เดือน",
        isSigned: false,
        toothNo: "",
        customProcName: "ขูดหินปูนทั้งปากพร้อมขัดฟัน",
        customProcPrice: 1200,
        customProcDiscount: 0,
        items: [{ code: "D10", name: "ขูดหินปูนทั้งปากพร้อมขัดฟัน", toothNumber: "", price: 1200, discount: 0, dfRate: 50, df: 600 }],
        drugs: [
          { id: "dr-1", name: "Paracetamol 500mg", qty: 10, unit: "เม็ด", dose: "รับประทานครั้งละ 1 เม็ด ทุก 4-6 ชั่วโมง เมื่อมีอาการปวด" }
        ],
        singleDrugName: "Amoxicillin 500mg",
        singleDrugQty: 10,
        singleDrugDose: "รับประทานครั้งละ 1 เม็ด หลังอาหาร เช้า-กลางวัน-เย็น (ทานติดต่อกันจนหมด)",
        printStickerDrug: null,
        printAllStickers: false
      },
      expenses: [
        { id: 1, title: "ค่าแมสเซนเจอร์รับ-ส่งงานแลปครอบฟัน", cat: "ขนส่ง/งานแลป", amount: 120, time: "10:15" },
        { id: 2, title: "ค่าน้ำดื่มรับรองคนไข้ 3 แพ็ก", cat: "วัสดุสิ้นเปลือง", amount: 150, time: "11:30" }
      ],
      expTitle: "",
      expAmount: "",
      sterileLogs: [
        { id: 1, date: new Date().toISOString().split("T")[0], cycle: "รอบที่ 1 (เช้า 08:30)", temp: "134°C / 2.1 Bar (30 นาที)", items: "ชุดตรวจพื้นฐาน 15 ชุด + หัวกรอ High-speed 6 หัว + คีมถอนฟัน 8 ชิ้น", status: "PASS", by: "คุณน้ำหวาน (ผู้ช่วยทันตแพทย์)" },
        { id: 2, date: new Date().toISOString().split("T")[0], cycle: "รอบที่ 2 (บ่าย 13:00)", temp: "134°C / 2.1 Bar (30 นาที)", items: "ชุดขูดหินปูน Ultrasonic Tip 10 ชุด + ชุดผ่าฟันคุด 4 ชุด", status: "PASS", by: "คุณน้ำหวาน (ผู้ช่วยทันตแพทย์)" }
      ]
    };

    const NAV_ITEMS = [
      { key: "queue", label: "คิววันนี้", icon: "clock" },
      { key: "tv", label: "จอ TV เรียกคิว", icon: "tv" },
      { key: "appointments", label: "รายการนัดหมาย", icon: "calendar" },
      { key: "patients", label: "คนไข้ & X-Ray", icon: "users" },
      { key: "recall", label: "ติดตามคนไข้ & LINE", icon: "bell-ring" },
      { key: "billing", label: "การเงิน & ใบเสร็จ", icon: "credit-card" },
      { key: "ortho", label: "จัดฟัน", icon: "smile" },
      { key: "lab", label: "งานแลป", icon: "flask-conical" },
      { key: "inventory", label: "คลังเวชภัณฑ์", icon: "package" },
      { key: "operations", label: "อบเครื่องมือ & ตารางหมอ", icon: "shield-check" },
      { key: "reports", label: "รายงาน & DF แพทย์", icon: "bar-chart-3" },
      { key: "backup", label: "ตั้งค่า", icon: "settings" }
    ];

    const TIME_SLOTS = [];
    for (let h = 9; h <= 21; h++) {
      TIME_SLOTS.push(String(h).padStart(2, "0") + ":00");
      TIME_SLOTS.push(String(h).padStart(2, "0") + ":30");
    }
    TIME_SLOTS.push("22:00");

    function updateClock() {
      const t = new Date().toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
      const expanded = STATE.isHovered || STATE.isPinned;
      const el = document.getElementById("live-clock");
      if (el) el.textContent = expanded ? (t + " น.") : t.slice(0, 5);
      const tvClock = document.getElementById("tv-live-clock");
      if (tvClock) tvClock.textContent = t + " น.";
    }
    setInterval(updateClock, 1000);

    function toggleRoleDropdown() {
      STATE.roleDropdownOpen = !STATE.roleDropdownOpen;
      renderRoleDropdown();
    }
    function selectUserRole(username) {
      const u = AVAILABLE_USERS.find(x => x.username === username);
      if (u) {
        STATE.currentUser = u;
        document.getElementById("user-avatar").textContent = u.fullName.charAt(0);
        document.getElementById("user-fullname").textContent = u.fullName;
        document.getElementById("user-rolename").textContent = u.roleTh;
      }
      STATE.roleDropdownOpen = false;
      renderRoleDropdown();
    }
    function renderRoleDropdown() {
      const el = document.getElementById("role-dropdown");
      if (!el) return;
      if (!STATE.roleDropdownOpen) { el.classList.add("hidden"); return; }
      el.classList.remove("hidden");
      el.innerHTML = '<div class="px-3 py-1.5 border-b border-slate-100"><p class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">สลับบทบาทจำลองเพื่อทดสอบระบบ</p></div><div class="py-1 max-h-64 overflow-y-auto">' +
        AVAILABLE_USERS.map(u => {
          const active = STATE.currentUser.username === u.username;
          return '<button type="button" data-u="' + u.username + '" onclick="selectUserRole(this.dataset.u)" class="w-full px-3 py-2 text-left text-xs flex items-center justify-between hover:bg-slate-50 transition-colors ' + (active ? "bg-sky-50/70 text-sky-900 font-semibold" : "text-slate-700") + '"><div class="flex items-center gap-2 truncate"><span class="w-2 h-2 rounded-full shrink-0 ' + u.color + '"></span><span class="truncate">' + u.fullName + '</span></div><span class="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 shrink-0">' + u.role + '</span></button>';
        }).join("") + '</div>';
    }

    function expandSidebar(hover) { STATE.isHovered = hover; if (!hover && !STATE.isPinned) { STATE.roleDropdownOpen = false; renderRoleDropdown(); } applySidebarLayout(); }
    function togglePin() { STATE.isPinned = !STATE.isPinned; applySidebarLayout(); }
    function applySidebarLayout() {
      const expanded = STATE.isHovered || STATE.isPinned;
      const sb = document.getElementById("left-sidebar");
      const sp = document.getElementById("sidebar-spacer");
      const pill = document.getElementById("clock-pill");
      const hint = document.getElementById("pin-hint");
      const labels = document.querySelectorAll(".sidebar-label");
      const dl = document.getElementById("thai-date-label");
      if (dl) dl.textContent = formatThaiDate(new Date(), true);
      if (expanded) {
        sb.classList.remove("w-20"); sb.classList.add("w-64", "shadow-2xl", "shadow-slate-900/10");
        pill.className = "bg-slate-50 border border-slate-200/80 rounded-xl transition-all duration-300 flex items-center px-3 py-2 justify-between";
        labels.forEach(el => el.classList.remove("hidden"));
      } else {
        sb.classList.remove("w-64", "shadow-2xl", "shadow-slate-900/10"); sb.classList.add("w-20");
        pill.className = "bg-slate-50 border border-slate-200/80 rounded-xl transition-all duration-300 flex items-center p-2 flex-col justify-center gap-0.5";
        labels.forEach(el => el.classList.add("hidden"));
      }
      hint.innerHTML = STATE.isPinned ? "<span>📌 ปักหมุดเมนูไว้</span>" : "<span>✨ พับเก็บอัตโนมัติเมื่อเลื่อนเมาส์ออก</span>";
      sp.className = "hidden md:block shrink-0 transition-all duration-300 ease-in-out no-print " + (STATE.isPinned ? "w-64" : "w-20");
      updateClock();
      renderNav();
    }
    function renderNav() {
      const expanded = STATE.isHovered || STATE.isPinned;
      const currentKey = (STATE.activeTab === "patient-detail") ? "patients" : (STATE.activeTab === "receipt-detail") ? "billing" : STATE.activeTab;
      document.getElementById("nav-list").innerHTML = NAV_ITEMS.map(item => {
        const active = currentKey === item.key;
        return '<button data-tab="' + item.key + '" onclick="switchTab(this.dataset.tab)" title="' + item.label + '" class="group w-full flex items-center rounded-xl transition-all duration-200 ' + (expanded ? "px-3.5 py-2.5 gap-3 justify-start" : "p-3 justify-center") + ' ' + (active ? "bg-gradient-to-r from-sky-600 to-teal-500 text-white font-semibold shadow-sm shadow-sky-500/20" : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900") + '"><i data-lucide="' + item.icon + '" class="w-5 h-5 shrink-0 ' + (active ? "text-white" : "text-slate-500") + '"></i><span class="text-xs whitespace-nowrap ' + (expanded ? "" : "hidden") + '">' + item.label + '</span></button>';
      }).join("");
      if (window.lucide) window.lucide.createIcons();
    }
    function switchTab(tabKey) {
      STATE.activeTab = tabKey;
      if (!STATE.isPinned) STATE.isHovered = false;
      applySidebarLayout();
      renderView();
    }
    function openPatientProfile(patId) {
      STATE.selectedPatientId = patId;
      STATE.patientProfileTab = "general";
      switchTab("patient-detail");
    }
    function openEmrForVisit(visitId) {
      STATE.activeVisitId = visitId;
      switchTab("emr");
    }
    function setViewMode(mode) { STATE.viewMode = mode; renderView(); }
    function speakThaiQueue(queueNo, name, room) {
      if (!STATE.tvSoundEnabled) return;
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance("ขอเชิญหมายเลขคิวที่ " + queueNo + ", คุณ " + name + ", ที่ " + room + " ค่ะ");
        u.lang = "th-TH"; u.rate = 0.92;
        window.speechSynthesis.speak(u);
      }
    }
    function toggleFullScreen() {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(function(){});
      } else {
        document.exitFullscreen().catch(function(){});
      }
    }
`;

console.log('Part 1 length:', html.length);
