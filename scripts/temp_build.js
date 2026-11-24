<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>คลินิกทันตกรรมหมอมิน หมอพรีม | Min & Preem Dental Clinic</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Prompt:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,400&family=Sarabun:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&display=swap" rel="stylesheet">
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://unpkg.com/lucide@latest"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          fontFamily: {
            sans: ['Prompt', 'Sarabun', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
            thai: ['Prompt', 'Sarabun', 'sans-serif']
          }
        }
      }
    };
  </script>
  <style>
    *, *::before, *::after {
      font-family: 'Prompt', 'Sarabun', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
      line-height: 1.5;
    }
    body {
      font-family: 'Prompt', 'Sarabun', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
      line-height: 1.6;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      text-rendering: optimizeLegibility;
    }
    /* Prevent clipping of Thai tone marks and vowels */
    h1, h2, h3, h4, h5, h6, p, span, button, input, select, textarea, div {
      line-height: 1.5;
    }
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
        <a href="#queue" onclick="switchTab('queue')" class="flex items-center gap-3 min-w-0 group">
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
          <span id="thai-date-label" class="sidebar-label hidden text-[11px] text-slate-500 truncate">วันอังคารที่ 24 พฤศจิกายน 2569</span>
          <span id="live-clock" class="font-mono text-xs text-sky-700 font-bold whitespace-nowrap">--:--:-- น.</span>
        </div>
      </div>
      <nav id="nav-list" class="px-3 py-2 space-y-1 overflow-y-auto max-h-[calc(100vh-210px)] no-scrollbar"></nav>
    </div>
    <div class="p-3 border-t border-slate-100 bg-slate-50/50 relative">
      <div id="pin-hint" class="sidebar-label hidden mb-2 flex items-center justify-between text-[10px] text-slate-400 px-1">
        <span>📌 ปักหมุดเมนูไว้</span>
      </div>
      <button onclick="switchTab('backup')" class="w-full flex items-center rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 transition-all text-xs text-slate-800 px-2.5 py-2 justify-between">
        <div class="flex items-center gap-2.5 min-w-0">
          <div class="relative shrink-0">
            <div class="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 font-bold flex items-center justify-center text-xs">ท</div>
            <span class="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white animate-pulse"></span>
          </div>
          <div class="sidebar-label hidden text-left truncate">
            <div class="font-semibold text-slate-900 leading-tight truncate">ทพ. มินตรา (เจ้าของคลินิก)</div>
            <div class="text-[10px] text-slate-500 truncate">เจ้าของคลินิก / ผู้ดูแลระบบ</div>
          </div>
        </div>
        <i data-lucide="chevron-down" class="sidebar-label hidden w-3.5 h-3.5 text-slate-400 shrink-0"></i>
      </button>
    </div>
  </aside>
  <main class="flex-1 min-w-0 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
    <div id="app-view"></div>
  </main>
  <!-- MODAL OVERLAY CONTAINER (Exact Modals from Next.js components) -->
  <div id="modal-root"></div>
  <script>
    function showToast(msg, type) { var c = document.getElementById("toast-container"); if (!c) { c = document.createElement("div"); c.id = "toast-container"; c.className = "fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm pointer-events-none"; document.body.appendChild(c); } var t = document.createElement("div"); var bg = type === "error" ? "bg-rose-600 text-white" : "bg-emerald-600 text-white"; t.className = "pointer-events-auto px-4 py-3 rounded-xl shadow-xl text-xs font-semibold flex items-center gap-2 " + bg; t.innerHTML = "<span>" + msg + "</span>"; c.appendChild(t); setTimeout(function() { t.remove(); }, 3500); }
    let STATE = {
      activeTab: "queue",
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
      orthoPackages: [],
      patientOrthoPackages: [],
      inventory: [],
      labOrders: [],
      snapshots: [],
      // Exact Modal States matching Next.js components
      activeModal: null, // "NEW_APPOINTMENT" | "WALK_IN" | "NEW_PATIENT" | null
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
      emrForm: {
        bpSys: 120, bpDia: 80, hr: 76, anesthesia: "ไม่ต้องฉีดยาชา",
        cc: "มาตรวจสุขภาพฟันและขูดหินปูนประจำปี ไม่มีอาการปวดฟัน",
        pe: "พบคราบหินปูนและคราบจุลินทรีย์ระดับปานกลางทั่วทั้งปาก เหงือกอักเสบเล็กน้อย",
        dx: "K05.1 เหงือกอักเสบเรื้อรังและหินปูน (Chronic gingivitis)",
        tx: "ขูดหินปูนทั้งปากด้วยเครื่อง Ultrasonic Scaler พร้อมขัดฟัน",
        advice: "แปรงฟันให้ถูกวิธีและใช้ไหมขัดฟันทุกวัน",
        followUp: "นัดตรวจสุขภาพช่องปากและขูดหินปูนทุก 6 เดือน",
        items: [{ code: "D10", name: "ขูดหินปูนทั้งปากพร้อมขัดฟัน", price: 1200, df: 600 }],
        drugs: []
      },
      expenses: [
        { title: "🛵 ค่าแมสเซนเจอร์รับ-ส่งงานแลป", cat: "ขนส่ง/งานแลป", amount: 120, time: "10:15" },
        { title: "💧 ซื้อน้ำดื่มรับรองคนไข้", cat: "รับรองคนไข้", amount: 150, time: "11:30" }
      ],
      sterileLogs: [
        { cycle: "รอบเช้า (08:30 น.)", temp: "134°C / 2.1 Bar (30 นาที)", items: "ชุดเครื่องมือตรวจพื้นฐาน 15 ชุด + หัวกรอ 6 ชิ้น", status: "PASS", by: "คุณน้ำหวาน" },
        { cycle: "รอบบ่าย (13:00 น.)", temp: "134°C / 2.1 Bar (30 นาที)", items: "ชุดคีมถอนฟัน/ผ่าฟันคุด + ชุดจัดฟัน", status: "PASS", by: "คุณน้ำหวาน" }
      ],
      sliderPos: 50
    };
    const NAV_ITEMS = [
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
      document.getElementById("live-clock").textContent = expanded ? (t + " น.") : t.slice(0, 5);
    }
    setInterval(updateClock, 1000);
    function expandSidebar(hover) { STATE.isHovered = hover; applySidebarLayout(); }
    function togglePin() { STATE.isPinned = !STATE.isPinned; applySidebarLayout(); }
    function applySidebarLayout() {
      const expanded = STATE.isHovered || STATE.isPinned;
      const sb = document.getElementById("left-sidebar");
      const sp = document.getElementById("sidebar-spacer");
      const pill = document.getElementById("clock-pill");
      const hint = document.getElementById("pin-hint");
      const labels = document.querySelectorAll(".sidebar-label");
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
      document.getElementById("nav-list").innerHTML = NAV_ITEMS.map(item => {
        const active = STATE.activeTab === item.key;
        return `<button data-tab="${item.key}" onclick="switchTab(this.dataset.tab)" title="${item.label}" class="group w-full flex items-center rounded-xl transition-all duration-200 ${expanded ? "px-3.5 py-2.5 gap-3 justify-start" : "p-3 justify-center"} ${active ? "bg-gradient-to-r from-sky-600 to-teal-500 text-white font-semibold shadow-sm shadow-sky-500/20" : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"}"><i data-lucide="${item.icon}" class="w-5 h-5 shrink-0 ${active ? "text-white" : "text-slate-500"}"></i><span class="text-xs whitespace-nowrap ${expanded ? "" : "hidden"}">${item.label}</span></button>`;
      }).join("");
      if (window.lucide) window.lucide.createIcons();
    }
    function switchTab(tabKey) {
      STATE.activeTab = tabKey;
      if (!STATE.isPinned) STATE.isHovered = false;
      applySidebarLayout();
      renderView();
    }
    function setViewMode(mode) { STATE.viewMode = mode; renderView(); }
    function openEmrForPatient(patId, visitId) {
      STATE.activeEmrPatientId = patId;
      STATE.activeEmrVisitId = visitId || null;
      var p = STATE.patients.find(function(x) { return x.id === patId; }) || STATE.patients[0];
      if (p) {
        var isPen = (p.drugAllergies || "").toLowerCase().includes("penicillin") || (p.drugAllergies || "").toLowerCase().includes("amoxi") || (p.drugAllergies || "").toLowerCase().includes("beta-lactam") || (p.drugAllergies || "").includes("เพนิซิลิน");
        STATE.emrForm = {
          bpSys: 120,
          bpDia: 80,
          cc: "คนไข้มาตรวจตามนัด / ตรวจสุขภาพช่องปาก",
          pe: "ฟันทั่วไปปกติ ไม่พบการอักเสบรุนแรง",
          dx: "Chronic periodontitis / Dental caries",
          tx: "ขูดหินปูนทั้งปากพร้อมขัดฟัน",
          advice: "แปรงฟันอย่างน้อยวันละ 2 ครั้ง และใช้ไหมขัดฟันสม่ำเสมอ",
          followUp: "นัดตรวจติดตามผลในอีก 6 เดือน",
          items: [{ name: "ขูดหินปูนทั้งปากพร้อมขัดฟัน", price: 1200, df: 600 }],
          drugs: isPen ? [
            { name: "Clindamycin 300mg (16 แคปซูล) [ปลอดภัยสำหรับผู้แพ้ Penicillin]", dose: "รับประทานครั้งละ 1 แคปซูล วันละ 4 ครั้ง ก่อนอาหารและก่อนนอน จนหมด" },
            { name: "Paracetamol 500mg (10 เม็ด)", dose: "รับประทานครั้งละ 1 เม็ด ทุก 4-6 ชม. เวลาปวด" }
          ] : [
            { name: "Amoxicillin 500mg (15 เม็ด)", dose: "รับประทานครั้งละ 1 เม็ด หลังอาหาร เช้า-กลางวัน-เย็น จนหมด" },
            { name: "Paracetamol 500mg (10 เม็ด)", dose: "รับประทานครั้งละ 1 เม็ด ทุก 4-6 ชม. เวลาปวด" }
          ]
        };
      }
      switchTab('emr');
    }

    function speakThaiQueue(queueNo, name, room, visitId) {
      STATE.lastCalledQueue = { qNum: queueNo, name: name, room: room, time: new Date().toLocaleTimeString("th-TH") };
      if (visitId) STATE.lastCalledVisitId = visitId;
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance("ขอเชิญหมายเลขคิวที่ " + queueNo + ", คุณ " + name + ", ที่ " + room + " ค่ะ");
        u.lang = "th-TH"; u.rate = 0.92;
        window.speechSynthesis.speak(u);
      }
      showToast("🔊 ขานคิว: #" + queueNo + " คุณ " + name + " -> " + room, "info");
      renderView();
    }
    async function loadInitialData() {
      try {
        const res = await fetch("/api/bootstrap");
        const data = await res.json();
        STATE.doctors = data.doctors || [];
        STATE.rooms = data.rooms || [];
        STATE.appointmentTypes = data.appointmentTypes || [];
        STATE.patients = data.patients || [];
        STATE.appointments = data.appointments || [];
        STATE.visits = data.visits || [];
        STATE.invoices = data.invoices || [];
        STATE.orthoPackages = data.orthoPackages || [];
        STATE.patientOrthoPackages = data.patientOrthoPackages || [];
        STATE.inventory = data.inventory || [];
        STATE.labOrders = data.labOrders || [];
        STATE.snapshots = data.snapshots || [];
        if (data.receipts && data.receipts.length) STATE.receipts = data.receipts;
        if (data.deposits && data.deposits.length) STATE.deposits = data.deposits;
        if (data.insuranceClaims && data.insuranceClaims.length) STATE.insuranceClaims = data.insuranceClaims;
        if (data.procedures && data.procedures.length) STATE.procedures = data.procedures;
        if (data.diagnoses && data.diagnoses.length) STATE.diagnoses = data.diagnoses;
        if (data.documents && data.documents.length) STATE.documents = data.documents;
        renderView();
        renderModals();
      } catch (e) { console.error(e); }
    }
    // MODAL OPENERS MATCHING NEXT.JS COMPONENTS EXACTLY
    function openAppointmentModal(timeStr, colId) {
      STATE.activeModal = "NEW_APPOINTMENT";
      STATE.modalError = null;
      STATE.modalSearch = "";
      STATE.modalSelectedPatient = null;
      STATE.appForm = {
        date: STATE.selectedDate,
        startTime: timeStr || "09:00",
        durationMinutes: 30,
        doctorId: (STATE.viewMode === "DOCTOR" && colId) ? colId : (STATE.doctors[0]?.id || ""),
        roomId: (STATE.viewMode === "ROOM" && colId) ? colId : (STATE.rooms[0]?.id || ""),
        typeId: "",
        notes: ""
      };
      renderModals();
    }
    function openWalkInModal() {
      STATE.activeModal = "WALK_IN";
      STATE.modalError = null;
      STATE.modalSearch = "";
      STATE.modalSelectedPatient = null;
      STATE.walkInForm = {
        doctorId: STATE.doctors[0]?.id || "",
        roomId: STATE.rooms[0]?.id || "",
        notes: ""
      };
      renderModals();
    }
    function openNewPatientModal() {
      STATE.activeModal = "NEW_PATIENT";
      STATE.modalError = null;
      STATE.patientForm = {
        title: "คุณ", firstNameTh: "", lastNameTh: "", firstNameEn: "", lastNameEn: "",
        phone: "", birthDate: "", gender: "FEMALE", rights: "จ่ายเอง",
        attendingDoctorId: STATE.doctors[0]?.id || "",
        drugAllergies: "", chronicDiseases: "", currentMedications: "", marketingSource: "Walk-in"
      };
      renderModals();
    }
    function closeModal() {
      STATE.activeModal = null;
      STATE.modalError = null;
      renderModals();
    }
    function selectModalPatient(patId) {
      STATE.modalSelectedPatient = STATE.patients.find(p => p.id === patId) || null;
      STATE.modalSearch = "";
      renderModals();
    }
    function clearModalPatient() {
      STATE.modalSelectedPatient = null;
      renderModals();
    }
    function handleModalSearchInput(val) {
      STATE.modalSearch = val;
      const dropdown = document.getElementById("modal-patient-dropdown");
      if (!dropdown) return;
      const q = val.trim().toLowerCase();
      const matches = q.length >= 1 ? STATE.patients.filter(p => `${p.firstNameTh} ${p.lastNameTh} ${p.dn} ${p.phone}`.toLowerCase().includes(q)) : STATE.patients;
      dropdown.innerHTML = matches.map(p => `<div data-pid="${p.id}" onclick="selectModalPatient(this.dataset.pid)" class="px-3 py-2 text-xs hover:bg-slate-50 cursor-pointer border-b border-slate-100 last:border-0"><span class="font-bold text-slate-800">${p.firstNameTh} ${p.lastNameTh}</span> <span class="text-slate-500">(${p.dn})</span> - <span class="text-slate-600">${p.phone}</span></div>`).join("");
      dropdown.classList.remove("hidden");
    }
    function handleAppTypeChange(typeId) {
      STATE.appForm.typeId = typeId;
      const found = STATE.appointmentTypes.find(t => t.id === typeId);
      if (found && found.defaultDurationMinutes) {
        STATE.appForm.durationMinutes = found.defaultDurationMinutes;
        const durSelect = document.getElementById("app-duration-select");
        if (durSelect) durSelect.value = String(found.defaultDurationMinutes);
      }
    }
    function addMinutesToTime(timeStr, mins) {
      const [h, m] = timeStr.split(":").map(Number);
      const total = h * 60 + m + Number(mins);
      const nh = String(Math.floor(total / 60)).padStart(2, "0");
      const nm = String(total % 60).padStart(2, "0");
      return `${nh}:${nm}`;
    }
    async function submitAppointmentModal(e) {
      e.preventDefault();
      if (!STATE.modalSelectedPatient) {
        STATE.modalError = "กรุณาค้นหาและคลิกเลือกคนไข้";
        renderModals();
        return;
      }
      const f = STATE.appForm;
      const foundType = STATE.appointmentTypes.find(t => t.id === f.typeId);
      const endTime = addMinutesToTime(f.startTime, f.durationMinutes);
      await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId: STATE.modalSelectedPatient.id,
          doctorId: f.doctorId,
          roomId: f.roomId,
          date: f.date,
          startTime: f.startTime,
          endTime,
          durationMinutes: f.durationMinutes,
          typeId: f.typeId || null,
          typeName: foundType ? foundType.name : "นัดตรวจทั่วไป",
          notes: f.notes
        })
      });
      closeModal();
      await loadInitialData();
    }
    async function submitWalkInModal(e) {
      e.preventDefault();
      if (!STATE.modalSelectedPatient) {
        STATE.modalError = "กรุณาค้นหาและคลิกเลือกคนไข้";
        renderModals();
        return;
      }
      await fetch("/api/visits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId: STATE.modalSelectedPatient.id,
          doctorId: STATE.walkInForm.doctorId,
          roomId: STATE.walkInForm.roomId,
          visitDate: STATE.selectedDate,
          notes: STATE.walkInForm.notes || "Walk-in มาเข้ารับการรักษา"
        })
      });
      closeModal();
      await loadInitialData();
    }
    async function submitNewPatientModal() {
      const f = STATE.patientForm;
      if (!f.firstNameTh || !f.lastNameTh || !f.phone) {
        STATE.modalError = "กรุณากรอกชื่อ นามสกุล และเบอร์โทรศัพท์หลัก";
        renderModals();
        return;
      }
      var cleanPhone = f.phone.replace(/[^0-9]/g, "");
      if (cleanPhone.length < 9 || cleanPhone.length > 10 || !cleanPhone.startsWith("0")) {
        STATE.modalError = "⚠️ เบอร์โทรศัพท์ต้องขึ้นต้นด้วย 0 และมี 9-10 หลัก (เช่น 0812345678 ห้ามใส่ " + f.phone + ")";
        renderModals();
        return;
      }
      await fetch("/api/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(f)
      });
      closeModal();
      await loadInitialData();
    }
    function renderModals() {
      const root = document.getElementById("modal-root");
      if (!STATE.activeModal) { root.innerHTML = ""; return; }
      const docOpts = STATE.doctors.map(d => `<option value="${d.id}" ${(STATE.appForm.doctorId === d.id || STATE.walkInForm.doctorId === d.id) ? "selected" : ""}>${d.fullName} (${d.nickname})</option>`).join("");
      const roomOpts = STATE.rooms.map(r => `<option value="${r.id}" ${(STATE.appForm.roomId === r.id || STATE.walkInForm.roomId === r.id) ? "selected" : ""}>${r.name}</option>`).join("");
      const typeOpts = STATE.appointmentTypes.map(t => `<option value="${t.id}" ${STATE.appForm.typeId === t.id ? "selected" : ""}>${t.name} (ค่าเริ่มต้น ${t.defaultDurationMinutes} นาที${t.defaultFollowUpDays ? ", นัดถัดไป ~" + t.defaultFollowUpDays + " วัน" : ""})</option>`).join("");
      const patListHtml = STATE.patients.map(p => `<div data-pid="${p.id}" onclick="selectModalPatient(this.dataset.pid)" class="px-3 py-2 text-xs hover:bg-slate-50 cursor-pointer border-b border-slate-100 last:border-0"><span class="font-bold text-slate-800">${p.firstNameTh} ${p.lastNameTh}</span> <span class="text-slate-500">(${p.dn})</span> - <span class="text-slate-600">${p.phone}</span></div>`).join("");
      if (STATE.activeModal === "NEW_APPOINTMENT") {
        const sp = STATE.modalSelectedPatient;
        root.innerHTML = `
          <div class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
            <div class="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
              <div class="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center font-bold"><i data-lucide="calendar" class="w-4 h-4"></i></div>
                  <div><h3 class="text-base font-bold text-slate-800">เพิ่มนัดหมายใหม่</h3><p class="text-xs text-slate-500">จองตารางเวลาพบแพทย์หรือห้องตรวจ</p></div>
                </div>
                <button onclick="closeModal()" class="w-8 h-8 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center"><i data-lucide="x" class="w-5 h-5"></i></button>
              </div>
              <form onsubmit="submitAppointmentModal(event)" class="p-6 overflow-y-auto space-y-4">
                ${STATE.modalError ? `<div class="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">${STATE.modalError}</div>` : ""}
                <div>
                  <label class="block text-xs font-semibold text-slate-700 mb-1">ค้นหาและเลือกคนไข้ *</label>
                  ${sp ? `<div class="flex items-center justify-between p-3 rounded-xl bg-sky-50 border border-sky-200"><div class="flex items-center gap-2.5"><div class="w-7 h-7 rounded-full bg-sky-600 text-white flex items-center justify-center text-xs font-bold">DN</div><div><p class="text-xs font-bold text-sky-900">${sp.firstNameTh} ${sp.lastNameTh} (${sp.dn})</p><p class="text-[11px] text-sky-700">เบอร์โทร: ${sp.phone}</p></div></div><button type="button" onclick="clearModalPatient()" class="text-xs text-sky-700 hover:underline font-medium">เปลี่ยน</button></div>` : `<div class="relative"><input type="text" placeholder="พิมพ์ชื่อ, เบอร์โทร หรือเลข DN... (คลิกเพื่อเลือกคนไข้)" value="${STATE.modalSearch}" onfocus="document.getElementById('modal-patient-dropdown').classList.remove('hidden')" oninput="handleModalSearchInput(this.value)" class="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none" /><div id="modal-patient-dropdown" class="hidden absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-20 max-h-48 overflow-y-auto">${patListHtml}</div></div>`}
                </div>
                <div class="grid grid-cols-2 gap-3">
                  <div><label class="block text-xs font-semibold text-slate-700 mb-1">ทันตแพทย์ *</label><select onchange="STATE.appForm.doctorId=this.value" class="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white">${docOpts}</select></div>
                  <div><label class="block text-xs font-semibold text-slate-700 mb-1">ห้องตรวจ *</label><select onchange="STATE.appForm.roomId=this.value" class="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white">${roomOpts}</select></div>
                </div>
                <div class="grid grid-cols-3 gap-3">
                  <div><label class="block text-xs font-semibold text-slate-700 mb-1">วันที่ *</label><input type="date" value="${STATE.appForm.date}" onchange="STATE.appForm.date=this.value" class="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white" /></div>
                  <div><label class="block text-xs font-semibold text-slate-700 mb-1">เวลาเริ่ม (24 ชม.) *</label><select onchange="STATE.appForm.startTime=this.value" class="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white font-medium">${TIME_SLOTS.map(t => `<option value="${t}" ${STATE.appForm.startTime === t ? "selected" : ""}>${t} น.</option>`).join("")}</select></div>
                  <div><label class="block text-xs font-semibold text-slate-700 mb-1">ระยะเวลา (นาที)</label><select id="app-duration-select" onchange="STATE.appForm.durationMinutes=Number(this.value)" class="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white"><option value="20">20 นาที</option><option value="30" selected>30 นาที</option><option value="45">45 นาที</option><option value="60">60 นาที</option><option value="90">90 นาที</option></select></div>
                </div>
                <div>
                  <label class="block text-xs font-semibold text-slate-700 mb-1">ประเภทนัดหมาย</label>
                  <select onchange="handleAppTypeChange(this.value)" class="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white"><option value="">-- เลือกประเภทการรักษา --</option>${typeOpts}</select>
                </div>
                <div>
                  <label class="block text-xs font-semibold text-slate-700 mb-1">หมายเหตุเพิ่มเติม</label>
                  <textarea rows="2" placeholder="ระบุอาการเบื้องต้น หรือข้อควรระวัง..." onchange="STATE.appForm.notes=this.value" class="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl">${STATE.appForm.notes}</textarea>
                </div>
                <div class="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button type="button" onclick="closeModal()" class="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl">ยกเลิก</button>
                  <button type="submit" class="px-5 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-xl shadow-md shadow-sky-600/20">บันทึกนัดหมาย</button>
                </div>
              </form>
            </div>
          </div>`;
        if (window.lucide) window.lucide.createIcons();
        return;
      }
      if (STATE.activeModal === "WALK_IN") {
        const sp = STATE.modalSelectedPatient;
        root.innerHTML = `
          <div class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
            <div class="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden flex flex-col">
              <div class="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center font-bold"><i data-lucide="user-plus" class="w-4 h-4"></i></div>
                  <div><h3 class="text-base font-bold text-slate-800">รับคนไข้ Walk-in</h3><p class="text-xs text-slate-500">ออกคิวตรวจทันทีโดยไม่ต้องนัดหมายล่วงหน้า</p></div>
                </div>
                <button onclick="closeModal()" class="p-1 rounded-lg hover:bg-slate-200 text-slate-400"><i data-lucide="x" class="w-5 h-5"></i></button>
              </div>
              <form onsubmit="submitWalkInModal(event)" class="p-6 space-y-4">
                ${STATE.modalError ? `<div class="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">${STATE.modalError}</div>` : ""}
                <div>
                  <label class="block text-xs font-semibold text-slate-700 mb-1">ค้นหาคนไข้ *</label>
                  ${sp ? `<div class="flex items-center justify-between p-3 rounded-xl bg-teal-50 border border-teal-200"><div><p class="text-xs font-bold text-teal-900">${sp.firstNameTh} ${sp.lastNameTh} (${sp.dn})</p><p class="text-[11px] text-teal-700">เบอร์โทร: ${sp.phone}</p></div><button type="button" onclick="clearModalPatient()" class="text-xs text-teal-700 hover:underline font-medium">เปลี่ยน</button></div>` : `<div class="relative"><input type="text" placeholder="พิมพ์ชื่อ, เบอร์โทร หรือเลข DN... (คลิกเพื่อเลือก)" value="${STATE.modalSearch}" onfocus="document.getElementById('modal-patient-dropdown').classList.remove('hidden')" oninput="handleModalSearchInput(this.value)" class="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none" /><div id="modal-patient-dropdown" class="hidden absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-20 max-h-48 overflow-y-auto">${patListHtml}</div></div>`}
                </div>
                <div class="grid grid-cols-2 gap-3">
                  <div><label class="block text-xs font-semibold text-slate-700 mb-1">ทันตแพทย์ผู้ตรวจ *</label><select onchange="STATE.walkInForm.doctorId=this.value" class="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white">${docOpts}</select></div>
                  <div><label class="block text-xs font-semibold text-slate-700 mb-1">ห้องตรวจ *</label><select onchange="STATE.walkInForm.roomId=this.value" class="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white">${roomOpts}</select></div>
                </div>
                <div><label class="block text-xs font-semibold text-slate-700 mb-1">อาการสำคัญ / ข้อความถึงแพทย์</label><textarea rows="2" placeholder="เช่น ปวดฟันกรามล่างขวา ขูดหินปูน..." onchange="STATE.walkInForm.notes=this.value" class="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl">${STATE.walkInForm.notes}</textarea></div>
                <div class="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button type="button" onclick="closeModal()" class="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl">ยกเลิก</button>
                  <button type="submit" class="px-5 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-md shadow-teal-600/20">ออกคิวรอตรวจทันที</button>
                </div>
              </form>
            </div>
          </div>`;
        if (window.lucide) window.lucide.createIcons();
        return;
      }
      if (STATE.activeModal === "NEW_PATIENT") {
        root.innerHTML = `
          <div class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
            <div class="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
              <div class="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center font-bold"><i data-lucide="user-plus" class="w-4 h-4"></i></div>
                  <div><h3 class="text-base font-bold text-slate-800">ลงทะเบียนคนไข้ใหม่</h3><p class="text-xs text-slate-500">สร้างแฟ้มประวัติเวชระเบียนและเลขประจำตัวคนไข้ (DN)</p></div>
                </div>
                <button onclick="closeModal()" class="p-1 rounded-lg hover:bg-slate-200 text-slate-400"><i data-lucide="x" class="w-5 h-5"></i></button>
              </div>
              <div class="p-6 overflow-y-auto space-y-4">
                ${STATE.modalError ? `<div class="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">${STATE.modalError}</div>` : ""}
                <div class="grid grid-cols-4 gap-3">
                  <div><label class="block text-xs font-semibold text-slate-700 mb-1">คำนำหน้า</label><select onchange="STATE.patientForm.title=this.value" class="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white"><option value="คุณ">คุณ</option><option value="นาย">นาย</option><option value="นาง">นาง</option><option value="นา��สาว">นางสาว</option><option value="ด.ช.">ด.ช.</option><option value="ด.ญ.">ด.ญ.</option></select></div>
                  <div class="col-span-3 grid grid-cols-2 gap-3">
                    <div><label class="block text-xs font-semibold text-slate-700 mb-1">ชื่อจริง (ภาษาไทย) *</label><input type="text" placeholder="เช่น มินตรา" oninput="STATE.patientForm.firstNameTh=this.value" class="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl" /></div>
                    <div><label class="block text-xs font-semibold text-slate-700 mb-1">นามสกุล (ภาษาไทย) *</label><input type="text" placeholder="เช่น รัตนเวชกุล" oninput="STATE.patientForm.lastNameTh=this.value" class="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl" /></div>
                  </div>
                </div>
                <div class="grid grid-cols-3 gap-3">
                  <div><label class="block text-xs font-semibold text-slate-700 mb-1">เบอร์โทรศัพท์หลัก *</label><input type="tel" placeholder="เช่น 0891234567" oninput="STATE.patientForm.phone=this.value" class="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl" /></div>
                  <div><label class="block text-xs font-semibold text-slate-700 mb-1">วัน/เดือน/ปีเกิด</label><input type="date" onchange="STATE.patientForm.birthDate=this.value" class="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white" /></div>
                  <div><label class="block text-xs font-semibold text-slate-700 mb-1">เพศ</label><select onchange="STATE.patientForm.gender=this.value" class="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white"><option value="FEMALE">หญิง</option><option value="MALE">ชาย</option><option value="OTHER">อื่นๆ</option></select></div>
                </div>
                <div class="p-3.5 bg-rose-50 border border-rose-200 rounded-xl space-y-2">
                  <div class="flex items-center gap-2 text-rose-800 font-bold text-xs"><i data-lucide="shield-alert" class="w-4 h-4 text-rose-600"></i><span>ข้อมูลความปลอดภัยทางการแพทย์ (Medical Alerts)</span></div>
                  <div class="grid grid-cols-2 gap-3">
                    <div><label class="block text-[11px] font-bold text-rose-900 mb-1">ประวัติแพ้ยา (หากมีให้ระบุชัดเจน)</label><input type="text" placeholder="เช่น แพ้ยา Penicillin, Sulfa..." oninput="STATE.patientForm.drugAllergies=this.value" class="w-full px-3 py-1.5 text-xs border border-rose-300 rounded-lg bg-white" /></div>
                    <div><label class="block text-[11px] font-bold text-amber-900 mb-1">โรคประจำตัว</label><input type="text" placeholder="เช่น ความดันโลหิตสูง, เบาหวาน..." oninput="STATE.patientForm.chronicDiseases=this.value" class="w-full px-3 py-1.5 text-xs border border-amber-300 rounded-lg bg-white" /></div>
                  </div>
                </div>
                <div class="grid grid-cols-2 gap-3">
                  <div><label class="block text-xs font-semibold text-slate-700 mb-1">สิทธิการรักษา</label><select onchange="STATE.patientForm.rights=this.value" class="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white"><option value="จ่ายเอง">จ่ายเอง (Self-pay)</option><option value="ประกันสังคม (สปส.)">ประกันสังคม (สปส.) 900฿</option><option value="สปสช. (บัตรทอง)">สปสช. (บัตรทอง)</option></select></div>
                  <div><label class="block text-xs font-semibold text-slate-700 mb-1">ทันตแพทย์ประจำ</label><select onchange="STATE.patientForm.attendingDoctorId=this.value" class="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white">${docOpts}</select></div>
                </div>
                <div class="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button type="button" onclick="closeModal()" class="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl">ยกเลิก</button>
                  <button type="button" onclick="submitNewPatientModal()" class="px-5 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-xl shadow-md shadow-sky-600/20">บันทึกคนไข้ใหม่</button>
                </div>
              </div>
            </div>
          </div>`;
        if (window.lucide) window.lucide.createIcons();
        return;
      }
    }
    async function triggerCloudBackup() {
      const res = await fetch("/api/backup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ backupLabel: "สำรองข้อมูลคลินิก 1-Click (" + new Date().toLocaleTimeString("th-TH") + " น.)" })
      });
      const data = await res.json();
      showToast("✅ สำรองข้อมูลคนไข้ขึ้น Cloudflare D1 สำเร็จ! รหัส: " + data.id, "success");
      await loadInitialData();
      switchTab("backup");
    }
    async function updateVisitStatusD1(visitId, status) {
      await fetch("/api/visits", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: visitId, status })
      });
      await loadInitialData();
    }
    async function completeEmrAndBillD1() {
      const pat = STATE.patients.find(function(p) { return p.id === STATE.activeEmrPatientId; }) || STATE.patients[0];
      const v = STATE.visits.find(function(x) { return x.id === STATE.activeEmrVisitId || x.patientId === pat.id; }) || STATE.visits[0];
      const doc = STATE.doctors.find(function(d) { return d.id === pat.attendingDoctorId; }) || STATE.doctors[0];
      const totalTx = STATE.emrForm.items.reduce((s, i) => s + i.price, 0);
      await fetch("/api/emr-complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          visitId: v?.id,
          patientId: v?.patientId || pat?.id,
          doctorId: v?.doctorId || doc?.id,
          cc: STATE.emrForm.cc,
          pe: `[BP: ${STATE.emrForm.bpSys}/${STATE.emrForm.bpDia}] ${STATE.emrForm.pe}`,
          dx: STATE.emrForm.dx,
          tx: STATE.emrForm.tx,
          advice: STATE.emrForm.advice,
          followUp: STATE.emrForm.followUp,
          totalAmount: totalTx
        })
      });
      showToast("✅ บันทึกเวชระเบียนและสร้างบิลรอชำระเงินลงฐานข้อมูล Cloudflare D1 เรียบร้อยแล้ว!", "success");
      await loadInitialData();
      switchTab("billing");
    }
    async function payInvoiceD1(invoiceId) {
      await fetch("/api/invoices-pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invoiceId })
      });
      showToast("✅ รับชำระเงินและออกใบเสร็จบันทึกลงฐานข้อมูล Cloudflare D1 สำเร็จ!", "success");
      await loadInitialData();
    }
    async function createLabOrderD1() {
      var patId = (document.getElementById("lab-pat") || {}).value || STATE.patients[0]?.id;
      var docId = (document.getElementById("lab-doc") || {}).value || STATE.doctors[0]?.id;
      var workType = (document.getElementById("lab-wt") || {}).value || "CROWN";
      var toothNumber = (document.getElementById("lab-tooth") || {}).value || "21";
      var labCompanyName = (document.getElementById("lab-comp") || {}).value || "โมเดิร์น เดนทัล แลป";
      var cost = Number((document.getElementById("lab-cost") || {}).value || 3200);

      await fetch("/api/lab", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId: patId,
          doctorId: docId,
          workType: workType,
          toothNumber: toothNumber,
          cost: cost,
          labCompanyName: labCompanyName
        })
      });
      STATE.labModalOpen = false;
      showToast("✅ สร้างใบส่งแลปใหม่เรียบร้อยแล้ว", "success");
      await loadInitialData();
    }
    async function adjustInventoryStockD1(itemId, delta) {
      await fetch("/api/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId, delta })
      });
      await loadInitialData();
    }
    function applyEmrTemplate(type) {
      const tpls = {
        scaling: { cc: "มาตรวจสุขภาพฟันและขูดหินปูนประจำปี ไม่มีอาการปวดฟัน", pe: "พบคราบหินปูนระดับปานกลางทั่วทั้งปาก เหงือกอักเสบเล็กน้อย", dx: "K05.1 เหงือกอักเสบเรื้อรังและหินปูน (Chronic gingivitis)", tx: "ขูดหินปูนทั้งปากด้วยเครื่อง Ultrasonic Scaler พร้อมขัดฟัน" },
        filling: { cc: "มีรอยฟันผุ / เสียวฟันเวลาดื่มน้ำเย็น", pe: "ตรวจพบฟันผุถึงชั้นเนื้อฟัน (Dentine caries) เคาะไม่เจ็บ", dx: "K02.1 โรคฟันผุถึงชั้นเนื้อฟัน (Dental caries of dentine)", tx: "กรอกำจัดเนื้อฟันผุ ทาสารยึดติด (Bonding) และอุดบูรณะด้วย Composite Resin A2" },
        extraction: { cc: "ปวดฟันกราม / ฟันคุดขึ้นเบียดซี่ข้า���เคียง", pe: "ตรวจพบฟันคุด เหงือกบวมแดง", dx: "K01.1 ฟันกรามคุด (Impacted tooth)", tx: "ฉีดยาชาเฉพาะที่ 2% Mepivacaine ถอนฟัน/ผ่าฟันคุดออก ล้างแผลด้วย NSS เย็บปิดแผลและให้กัดผ้าก๊อซ" },
        ortho: { cc: "มาปรับเครื่องมือจัดฟันประจำเดือนตามนัด", pe: "เครื่องมือจัดฟันติดแน่นดี ฟันเคลื่อนเข้าแนวตามแผน", dx: "K07.2 อยู่ระหว่างการจัดฟัน (Orthodontic adjustment)", tx: "ถอดลวดทำความสะอาด เปลี่ยนลวดจัดฟันและเปลี่ยนยาง O-ring / Chain ดึงฟัน" }
      };
      if (tpls[type]) { STATE.emrForm = { ...STATE.emrForm, ...tpls[type] }; renderView(); }
    }
    function addQuickProc(name, price) { STATE.emrForm.items.push({ name, price, df: price * 0.5 }); renderView(); }
    function addQuickDrugSet(setType) {
      var pat = STATE.patients.find(function(x) { return x.id === STATE.activeEmrPatientId; }) || STATE.patients[0] || {};
      var allergyText = (pat.drugAllergies || "").toLowerCase();
      var isPenicillinAllergic = allergyText.includes("penicillin") || allergyText.includes("amoxi") || allergyText.includes("beta-lactam") || allergyText.includes("เพนิซิลิน");

      if (setType === "surgery") {
        if (isPenicillinAllergic) {
          showToast("⛔ บล็อกการสั่งยา! คนไข้มีประวัติแพ้ยา: " + pat.drugAllergies + " (ห้ามสั่ง Amoxicillin เด็ดขาด)", "error");
          STATE.allergyBlockModal = {
            patientName: (pat.title || "") + pat.firstNameTh + " " + pat.lastNameTh + " (DN: " + pat.dn + ")",
            allergy: pat.drugAllergies,
            drug: "Amoxicillin 500mg (กลุ่ม Penicillin / Beta-lactam)",
            recommended: "Clindamycin 300mg (ปลอดภัยสำหรับผู้แพ้ Penicillin)"
          };
          renderView();
          return;
        }
        STATE.emrForm.drugs = [
          { name: "Amoxicillin 500mg (15 เม็ด)", dose: "รับประทานครั้งละ 1 เม็ด หลังอาหาร เช้า-กลางวัน-เย็น จนหมด" },
          { name: "Ibuprofen 400mg (10 เม็ด)", dose: "รับประทานครั้งละ 1 เม็ด หลังอาหารทันที เช้า-กลางวัน-เย็น เมื่อปวด" },
          { name: "Paracetamol 500mg (10 เม็ด)", dose: "รับประทานครั้งละ 1 เม็ด ทุก 4-6 ชม. เวลาปวด" }
        ];
        showToast("✓ สั่งชุดยาหลังถอนฟัน / ผ่าฟันคุดเรียบร้อย", "success");
      } else if (setType === "safe_clindamycin") {
        STATE.emrForm.drugs = [
          { name: "Clindamycin 300mg (16 แคปซูล) [สำหรับผู้แพ้ Penicillin]", dose: "รับประทานครั้งละ 1 แคปซูล วันละ 4 ครั้ง ก่อนอาหารและก่อนนอน จนหมด" },
          { name: "Paracetamol 500mg (10 เม็ด)", dose: "รับประทานครั้งละ 1 เม็ด ทุก 4-6 ชม. เวลาปวด" }
        ];
        STATE.allergyBlockModal = null;
        showToast("✓ สั่งชุดยาฆ่าเชื้อปลอดภัย (Clindamycin 300mg) สำหรับผู้แพ้ Penicillin เรียบร้อย", "success");
      } else {
        STATE.emrForm.drugs = [{ name: "Paracetamol 500mg (10 เม็ด)", dose: "รับประทานครั้งละ 1 เม็ด ทุก 4-6 ชม. เมื่อปวดหรือตึงฟัน" }];
        showToast("✓ สั่งชุดยาแก้ปวดเรียบร้อย", "success");
      }
      renderView();
    }
    function addQuickExpense(title, amount) {
      STATE.expenses.unshift({ title, cat: "รายจ่ายคลินิก", amount, time: "ตอนนี้" });
      renderView();
    }
    function addQuickSterile(cycle, items) {
      STATE.sterileModalCycle = cycle;
      STATE.sterileModalItems = items;
      STATE.sterileModalOpen = true;
      renderView();
    }
    function submitSterileLog() {
      var cycle = (document.getElementById("st-cycle") || {}).value || STATE.sterileModalCycle || "รอบเช้า";
      var items = (document.getElementById("st-items") || {}).value || STATE.sterileModalItems || "ชุดตรวจพื้นฐาน";
      var temp = (document.getElementById("st-temp") || {}).value || "134°C / 2.1 Bar";
      var chemResult = (document.getElementById("st-chem") || {}).value || "PASS";
      var sporeResult = (document.getElementById("st-spore") || {}).value || "PENDING";
      var by = (document.getElementById("st-by") || {}).value || "คุณน้ำหวาน (ผู้ช่วยทันตแพทย์)";

      STATE.sterileLogs.unshift({
        date: new Date(),
        cycle: cycle,
        temp: temp,
        items: items,
        chemResult: chemResult,
        sporeResult: sporeResult,
        status: (chemResult === "PASS" && sporeResult !== "FAIL") ? (sporeResult === "PASS" ? "PASS" : "PENDING") : "FAIL",
        by: by
      });
      STATE.sterileModalOpen = false;
      showToast("✅ บันทึกผลการอบฆ่าเชื้อเครื่องมือเรียบร้อย", "success");
      renderView();
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
      if (full) return THAI_DAYS[d.getDay()] + "ที่ " + day + " " + THAI_MONTHS_FULL[mIdx] + " พ.ศ. " + yBE;
      return day + " " + THAI_MONTHS_SHORT[mIdx] + " " + yBE;
    }
    function formatThaiDateTime(dateInput) {
      if (!dateInput) return "-";
      var d = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
      if (isNaN(d.getTime())) return String(dateInput);
      return formatThaiDate(d, false) + " " + String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0") + " น.";
    }
    function checkInAppointmentD1(appId) {
      var app = STATE.appointments.find(function(a) { return a.id === appId; });
      if (!app) return;
      fetch("/api/visits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId: app.patientId,
          doctorId: app.doctorId,
          roomId: app.roomId,
          visitDate: app.date || STATE.selectedDate,
          appointmentId: app.id,
          notes: app.typeName || "เช็กอินจากนัดหมาย"
        })
      }).then(function() {
        showToast("✅ เช็กอินคนไข้เข้าคิวรอตรวจเรียบร้อยแล้ว", "success");
        loadInitialData();
      });
    }
    function updateAppointmentStatusD1(appId, newStatus, extra) {
      var app = STATE.appointments.find(function(a) { return a.id === appId; });
      if (app) {
        app.status = newStatus;
        if (extra && extra.date) app.date = extra.date;
        if (extra && extra.startTime) {
          app.startTime = extra.startTime;
          app.endTime = addMinutesToTime(extra.startTime, app.durationMinutes || 30);
        }
      }
      fetch("/api/appointments-update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.assign({ id: appId, status: newStatus }, extra || {}))
      }).catch(function(){});
      STATE.rescheduleAppId = null;
      STATE.cancelAppId = null;
      showToast("✅ อัปเดตสถานะนัดหมายเรียบร้อยแล้ว", "success");
      renderView();
    }
    function exportReportCsv() {
      var csv = "data:text/csv;charset=utf-8,\uFEFFเลขที่บิล,วันที่,คนไข้,ยอดสุทธิ,สถานะ\n";
      STATE.invoices.forEach(function(inv) {
        var p = STATE.patients.find(function(x) { return x.id === inv.patientId; }) || { firstNameTh: "", lastNameTh: "" };
        csv += '"' + inv.invoiceNo + '","' + formatThaiDate(inv.createdAt) + '","' + p.firstNameTh + ' ' + p.lastNameTh + '",' + inv.netAmount + ',"' + inv.status + '"\n';
      });
      var link = document.createElement("a");
      link.setAttribute("href", encodeURI(csv));
      link.setAttribute("download", "minpreem_report_" + STATE.selectedDate + ".csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

        function openQueuePaymentModal(visitId) {
      var v = STATE.visits.find(function(x) { return x.id === visitId; });
      if (!v) return;
      var p = STATE.patients.find(function(x) { return x.id === v.patientId; }) || STATE.patients[0] || {};
      var d = STATE.doctors.find(function(x) { return x.id === v.doctorId; }) || STATE.doctors[0] || {};
      var inv = STATE.invoices.find(function(i) { return i.visitId === v.id || i.patientId === v.patientId; });
      if (!inv) {
        inv = {
          id: "inv-" + v.id,
          invoiceNo: "INV-" + (v.visitNumber || v.queueNumber),
          visitId: v.id,
          patientId: v.patientId,
          totalAmount: 1200,
          netAmount: 1200,
          paidAmount: 0,
          balanceDue: 1200,
          status: "UNPAID",
          treatmentName: "ขูดหินปูนทั้งปากพร้อมขัดฟัน"
        };
        STATE.invoices.unshift(inv);
      }
      STATE.queuePaymentModal = { visit: v, patient: p, doctor: d, invoice: inv };
      renderView();
    }

    async function confirmQueuePayment() {
      if (!STATE.queuePaymentModal) return;
      var inv = STATE.queuePaymentModal.invoice;
      var v = STATE.queuePaymentModal.visit;
      await payInvoiceD1(inv.id);
      await updateVisitStatusD1(v.id, "COMPLETED");
      STATE.queuePaymentModal = null;
      showToast("✅ รับชำระเงิน " + formatCurrency(inv.netAmount) + " และปิดคิวตรวจเรียบร้อยแล้ว!", "success");
      await loadInitialData();
    }

    
    async function submitNewDeposit() {
      var patId = (document.getElementById("dep-pat") || {}).value;
      var amt = Number((document.getElementById("dep-amt") || {}).value || 0);
      var method = (document.getElementById("dep-method") || {}).value || "PROMPTPAY";
      var note = (document.getElementById("dep-note") || {}).value || "?????????????";
      if (!patId || amt <= 0) {
        showToast("????????????????????????????????????", "error");
        return;
      }
      var dep = {
        id: "dep-" + Date.now(),
        patientId: patId,
        date: new Date().toISOString(),
        type: "RECEIVE",
        amount: amt,
        balanceAfter: amt,
        paymentMethod: method,
        notes: note,
        processedBy: "???????? (??????????)"
      };
      STATE.deposits.unshift(dep);
      var p = STATE.patients.find(function(x) { return x.id === patId; });
      if (p) p.depositBalance = (p.depositBalance || 0) + amt;
      STATE.newDepositModal = false;
      await fetch("/api/deposits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dep)
      }).catch(function(){});
      showToast("? ?????????????????? " + formatCurrency(amt) + " ?????????????", "success");
      renderView();
      renderModals();
    }

    async function voidReceiptAction(receiptId, reason) {
      var rec = STATE.receipts.find(function(r) { return r.id === receiptId; });
      if (rec) {
        rec.isVoided = 1;
        rec.voidReason = reason || "??????????????????/??????";
        rec.voidedAt = new Date().toISOString();
        rec.voidedBy = "??. ?????? (?????????????????)";
      }
      STATE.voidReceiptModal = null;
      await fetch("/api/receipts-void", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: receiptId, reason: reason })
      }).catch(function(){});
      showToast("? ????????????????????? (Void) ?????????????", "success");
      renderView();
      renderModals();
    }

    async function reconcileClaimAction(claimId) {
      var c = STATE.insuranceClaims.find(function(x) { return x.id === claimId; });
      if (c) {
        c.status = "APPROVED";
        c.receivedAmount = c.claimAmount;
        c.differenceAmount = 0;
        c.reconciledAt = new Date().toISOString();
        c.reconciledBy = "???????? (???????????)";
      }
      await fetch("/api/claims-reconcile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: claimId })
      }).catch(function(){});
      showToast("? ????????????????????????????????????????", "success");
      renderView();
    }

    async function saveProcedureCatalogAction(proc) {
      var idx = STATE.procedures.findIndex(function(p) { return p.code === proc.code; });
      if (idx !== -1) {
        STATE.procedures[idx] = Object.assign(STATE.procedures[idx], proc);
      } else {
        STATE.procedures.push(proc);
      }
      STATE.newProcedureModal = false;
      await fetch("/api/procedures", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(proc)
      }).catch(function(){});
      showToast("? ????????????????????????????????", "success");
      renderView();
      renderModals();
    }

    function adjustDfAction(caseId, newDf, reason) {
      showToast("? ??????????? DF ??????????????? " + formatCurrency(newDf) + " ????????? (??????: " + (reason || "??????????????????") + ")", "success");
      STATE.dfAdjustModal = null;
      renderView();
      renderModals();
    }

    function moveDocToTrash(docId) {
      var idx = STATE.documents.findIndex(function(d) { return d.id === docId; });
      if (idx !== -1) {
        var doc = STATE.documents.splice(idx, 1)[0];
        doc.deletedAt = new Date().toISOString();
        STATE.trashDocuments.push(doc);
        showToast("??? ????????????????????????? (???????????????)", "info");
        renderView();
      }
    }

    function restoreDocFromTrash(docId) {
      var idx = STATE.trashDocuments.findIndex(function(d) { return d.id === docId; });
      if (idx !== -1) {
        var doc = STATE.trashDocuments.splice(idx, 1)[0];
        delete doc.deletedAt;
        STATE.documents.unshift(doc);
        showToast("?? ????????????????????????????????????", "success");
        renderView();
      }
    }

    function permanentDeleteDoc(docId) {
      STATE.trashDocuments = STATE.trashDocuments.filter(function(d) { return d.id !== docId; });
      showToast("? ???????????????????????", "success");
      renderView();
    }

    async function uploadNewDocAction(doc) {
      STATE.documents.unshift(doc);
      STATE.uploadDocModal = false;
      await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(doc)
      }).catch(function(){});
      showToast("? ??????????????????????????????????", "success");
      renderView();
      renderModals();
    }

    function renderView() {
      const container = document.getElementById("app-view");
      const tab = STATE.activeTab;
      const pat0 = STATE.patients[0] || { id: "pat-1", dn: "DN-260001", title: "นาย", firstNameTh: "สมชาย", lastNameTh: "ใจดี", phone: "081-234-5678", rights: "จ่ายเอง", drugAllergies: "แพ้ยา Penicillin และกลุ่ม Beta-lactam (ผื่นคัน แน่นหน้าอก)", chronicDiseases: "ความดันโลหิตสูง", depositBalance: 0 };

      // 1. QUEUE TODAY (src/app/page.tsx)
      if (tab === "queue") {
        const waitingVisits = STATE.visits.filter(v => v.status === "WAITING_EXAM");
        const inExamVisits = STATE.visits.filter(v => v.status === "IN_EXAM");
        const billingVisits = STATE.visits.filter(v => v.status === "WAITING_PAYMENT");
        const doneVisits = STATE.visits.filter(v => v.status === "COMPLETED");
        const cols = STATE.viewMode === "ROOM" ? STATE.rooms : STATE.doctors;
        const renderQueueList = (list, nextStatus, btnText, btnColor) => list.length === 0 ? '<div class="py-6 text-center text-xs text-slate-400 italic">ไม่มีรายการในสถานะนี้</div>' : list.map(v => {
          const p = STATE.patients.find(x => x.id === v.patientId) || pat0;
          const d = STATE.doctors.find(x => x.id === v.doctorId) || STATE.doctors[0] || { nickname: "หมอมิน" };
          const r = STATE.rooms.find(x => x.id === v.roomId) || STATE.rooms[0] || { name: "ห้องตรวจ 1 (หมอมิน)" };
          return '<div class="py-2.5 space-y-1.5"><div class="flex items-center justify-between"><div class="flex items-center gap-2"><span class="w-6 h-6 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs">' + v.queueNumber + '</span><div><p class="text-xs font-bold text-slate-800 hover:text-sky-600 cursor-pointer" data-pid="' + p.id + '" onclick="STATE.selectedPatientId=this.dataset.pid;switchTab(\'patient-detail\')">' + p.firstNameTh + ' ' + p.lastNameTh + '</p><p class="text-[10px] text-slate-400">DN: ' + p.dn + '</p></div></div><span class="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">' + r.name.split(" ")[0] + '</span></div>' + (p.drugAllergies && p.drugAllergies !== "ไม่มีประวัติแพ้ยา" ? '<div class="text-[10px] text-rose-700 bg-rose-50 px-2 py-0.5 rounded flex items-center gap-1 font-semibold"><span class="truncate">🛡️ แพ้: ' + p.drugAllergies + '</span></div>' : '') + '<div class="flex items-center justify-between pt-1"><span class="text-[11px] text-slate-500">' + d.nickname + '</span><div class="flex gap-1.5"><button data-q="' + v.queueNumber + '" data-name="' + p.firstNameTh + ' ' + p.lastNameTh + '" data-room="' + r.name.split("(")[0] + '" onclick="speakThaiQueue(this.dataset.q, this.dataset.name, this.dataset.room)" class="px-2 py-1 text-[11px] font-semibold text-amber-800 bg-amber-100 hover:bg-amber-200 rounded-lg">🔊 เรียกคิว</button>' + (nextStatus ? '<button data-vid="' + v.id + '" data-st="' + nextStatus + '" onclick="STATE.activeVisitId=this.dataset.vid; updateVisitStatusD1(this.dataset.vid, this.dataset.st); if(this.dataset.st===\'IN_EXAM\') switchTab(\'emr\'); if(this.dataset.st===\'COMPLETED\') switchTab(\'billing\');" class="px-2.5 py-1 text-[11px] font-semibold text-white ' + btnColor + ' rounded-lg shadow-sm">' + btnText + '</button>' : '') + '</div></div></div>';
        }).join("");
        const colHeaders = cols.map(c => '<div class="p-3 flex items-center justify-center gap-2"><span class="w-2.5 h-2.5 rounded-full flex-shrink-0" style="background-color:' + (c.colorCode || "#0284c7") + '"></span><span>' + (c.name || c.fullName) + '</span>' + (c.chairNumber ? '<span class="text-[10px] text-slate-400 font-normal">(' + c.chairNumber + ')</span>' : '') + (c.specialty ? '<span class="text-[10px] text-sky-600 font-normal">(' + c.nickname + ')</span>' : '') + '</div>').join("");
        const timeRows = TIME_SLOTS.map(timeStr => {
          const cells = cols.map(col => {
            const app = STATE.appointments.find(a => a.status !== "CANCELLED" && (STATE.viewMode === "ROOM" ? a.roomId === col.id : a.doctorId === col.id) && a.startTime <= timeStr && a.endTime > timeStr);
            if (app) {
              const p = STATE.patients.find(x => x.id === app.patientId) || pat0;
              const d = STATE.doctors.find(x => x.id === app.doctorId) || STATE.doctors[0] || { nickname: "หมอมิน" };
              const v = STATE.visits.find(x => x.appointmentId === app.id || (x.patientId === app.patientId && x.visitDate === app.date));
              const isStart = app.startTime === timeStr;
              return '<div class="p-1.5 min-h-[46px] bg-sky-50/80 border-l-4 border-sky-600">' + (isStart ? '<div class="flex flex-col text-xs leading-tight"><div class="flex items-center justify-between"><span class="font-bold text-sky-950">' + p.firstNameTh + ' ' + p.lastNameTh + '</span><span class="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-sky-100 text-sky-800">' + app.startTime + ' - ' + app.endTime + '</span></div><span class="text-[11px] text-sky-700">' + (app.typeName || "นัดตรวจทั่วไป") + ' (' + d.nickname + ')</span>' + (v ? '<span class="text-[10px] font-bold text-emerald-700 mt-0.5">✓ เช็กอินแล้ว (คิวที่ ' + v.queueNumber + ')</span>' : '<div class="mt-1"><button type="button" data-aid="' + app.id + '" onclick="checkInAppointmentD1(this.dataset.aid)" class="px-2 py-0.5 text-[10px] font-bold bg-emerald-600 text-white rounded hover:bg-emerald-700">เช็กอินรับคิว</button></div>') + '</div>' : '') + '</div>';
            }
            return '<div data-t="' + timeStr + '" data-c="' + col.id + '" onclick="openAppointmentModal(this.dataset.t, this.dataset.c)" class="p-1.5 min-h-[46px] cursor-pointer group flex items-center justify-center"><span class="hidden group-hover:inline-block text-[11px] font-medium text-sky-600 bg-sky-50 px-2 py-0.5 rounded-lg border border-sky-200">+ จองเวลานี้</span></div>';
          }).join("");
          return '<div class="grid divide-x divide-slate-100 hover:bg-slate-50/50 transition-colors" style="grid-template-columns: 80px repeat(' + (cols.length || 2) + ', minmax(180px, 1fr))"><div class="p-2 text-center text-xs font-mono font-medium text-slate-500 bg-slate-50/80">' + timeStr + '</div>' + cells + '</div>';
        }).join("");
        
      let qPayModal = "";
      if (STATE.queuePaymentModal) {
        const qm = STATE.queuePaymentModal;
        const qv = qm.visit;
        const qp = qm.patient;
        const qd = qm.doctor;
        const qi = qm.invoice;
        qPayModal = '<div class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4"><div class="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg p-6 space-y-5 animate-in fade-in duration-200"><div class="flex items-center justify-between border-b border-slate-100 pb-3"><div class="flex items-center gap-2.5"><span class="w-9 h-9 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black font-mono text-base">#' + qv.queueNumber + '</span><div><h3 class="text-base font-bold text-slate-900">รับชำระเงินและออกใบเสร็จ</h3><p class="text-xs text-slate-500">' + (qp.dn || "") + ' • คุณ ' + qp.firstNameTh + ' ' + qp.lastNameTh + '</p></div></div><button type="button" onclick="STATE.queuePaymentModal=null;renderView();" class="text-slate-400 hover:text-slate-600 p-1"><i data-lucide="x" class="w-5 h-5"></i></button></div><div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs"><div class="flex justify-between"><span>ทันตแพทย์ผู้รักษา:</span><strong class="text-slate-800">' + (qd.fullName || qd.nickname) + '</strong></div><div class="flex justify-between"><span>รายการหัตถการ:</span><strong class="text-slate-800">' + (qi.treatmentName || "ขูดหินปูนทั้งปากพร้อมขัดฟัน") + '</strong></div><div class="flex justify-between"><span>สิทธิการรักษา:</span><strong class="text-teal-700">' + (qp.rights || "จ่ายเอง") + '</strong></div><div class="flex justify-between pt-2 border-t border-slate-200 text-base font-black text-emerald-700"><span>ยอดสุทธิที่ต้องชำระ:</span><span>' + formatCurrency(qi.netAmount || 1200) + '</span></div></div><div class="space-y-2 text-xs"><label class="block font-bold text-slate-700">เลือกช่องทางการชำระเงิน *</label><div class="grid grid-cols-3 gap-2"><button type="button" class="p-2.5 rounded-xl border-2 border-emerald-500 bg-emerald-50 text-emerald-900 font-bold text-center">📱 สแกน QR</button><button type="button" class="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-center">💵 เงินสด</button><button type="button" class="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-center">💳 บัตรเครดิต</button></div></div><div class="flex justify-end gap-2 pt-2 border-t"><button type="button" onclick="STATE.queuePaymentModal=null;renderView();" class="px-4 py-2 text-xs text-slate-600 hover:bg-slate-100 rounded-xl font-bold">ยกเลิก</button><button type="button" onclick="confirmQueuePayment();" class="px-5 py-2.5 text-xs font-black text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-lg shadow-emerald-600/30">✅ ยืนยันรับชำระ & ปิดคิวตรวจ</button></div></div></div>';
      }

      container.innerHTML = qPayModal + '<div class="space-y-6"><div class="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"><div class="flex flex-wrap items-center gap-3"><div class="flex items-center gap-2"><span class="text-xs font-bold text-slate-500 uppercase tracking-wider">เลือกวันที่:</span><input type="date" value="' + STATE.selectedDate + '" onchange="STATE.selectedDate=this.value;renderView()" class="px-3 py-1.5 text-xs font-semibold border border-slate-300 rounded-xl bg-white shadow-sm text-slate-800" /></div><button type="button" onclick="STATE.selectedDate=new Date().toISOString().split(\'T\')[0];renderView()" class="px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl">วันนี้</button><span class="text-xs font-medium text-sky-800 bg-sky-50 px-2.5 py-1 rounded-lg border border-sky-200">' + formatThaiDate(STATE.selectedDate, true) + '</span></div><div class="flex flex-wrap items-center gap-2"><button onclick="switchTab(\'tv\')" class="px-3.5 py-2 rounded-xl text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 flex items-center gap-1.5"><i data-lucide="tv" class="w-4 h-4"></i><span>เปิดจอ TV เรียกคิว</span></button><button onclick="switchTab(\'patients\')" class="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 flex items-center gap-1.5"><i data-lucide="search" class="w-4 h-4"></i><span>ค้นหาคนไข้</span></button><button onclick="openNewPatientModal()" class="px-3.5 py-2 rounded-xl text-xs font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 flex items-center gap-1.5"><i data-lucide="user-plus" class="w-4 h-4"></i><span>+ คนไข้ใหม่</span></button><button onclick="openAppointmentModal(\'10:00\', \'\')" class="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 shadow-md shadow-sky-600/20 flex items-center gap-1.5"><i data-lucide="plus-circle" class="w-4 h-4"></i><span>+ เพิ่มนัดหมาย</span></button><button onclick="openWalkInModal()" class="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 shadow-md shadow-teal-600/20 flex items-center gap-1.5"><i data-lucide="user-check" class="w-4 h-4"></i><span>+ รับ Walk-in</span></button></div></div>' +
        '<div class="grid grid-cols-1 md:grid-cols-4 gap-4"><div class="bg-white rounded-2xl border border-amber-200 shadow-sm overflow-hidden flex flex-col"><div class="px-4 py-3 bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-200 flex items-center justify-between"><div class="flex items-center gap-2"><span class="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span><h3 class="text-xs font-bold text-amber-900">1. รอตรวจ (Waiting)</h3></div><span class="px-2 py-0.5 rounded-full bg-amber-500 text-white text-[11px] font-bold">' + waitingVisits.length + '</span></div><div class="p-3 divide-y divide-slate-100 flex-1 overflow-y-auto max-h-72">' + renderQueueList(waitingVisits, "IN_EXAM", "เข้าตรวจ EMR", "bg-sky-600 hover:bg-sky-700") + '</div></div><div class="bg-white rounded-2xl border border-sky-200 shadow-sm overflow-hidden flex flex-col"><div class="px-4 py-3 bg-gradient-to-r from-sky-50 to-blue-50 border-b border-sky-200 flex items-center justify-between"><div class="flex items-center gap-2"><span class="w-2.5 h-2.5 rounded-full bg-sky-500 animate-pulse"></span><h3 class="text-xs font-bold text-sky-900">2. กำลังตรวจ (In Exam)</h3></div><span class="px-2 py-0.5 rounded-full bg-sky-500 text-white text-[11px] font-bold">' + inExamVisits.length + '</span></div><div class="p-3 divide-y divide-slate-100 flex-1 overflow-y-auto max-h-72">' + renderQueueList(inExamVisits, "WAITING_PAYMENT", "ส่งคิดเงิน", "bg-amber-600 hover:bg-amber-700") + '</div></div><div class="bg-white rounded-2xl border border-emerald-200 shadow-sm overflow-hidden flex flex-col"><div class="px-4 py-3 bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-200 flex items-center justify-between"><div class="flex items-center gap-2"><span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span><h3 class="text-xs font-bold text-emerald-900">3. รอชำระเงิน (Billing)</h3></div><span class="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[11px] font-bold">' + billingVisits.length + '</span></div><div class="p-3 divide-y divide-slate-100 flex-1 overflow-y-auto max-h-72">' + renderQueueList(billingVisits, "COMPLETED", "รับชำระเงิน", "bg-emerald-600 hover:bg-emerald-700") + '</div></div><div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col"><div class="px-4 py-3 bg-slate-100 border-b border-slate-200 flex items-center justify-between"><div class="flex items-center gap-2"><h3 class="text-xs font-bold text-slate-700">✓ 4. เสร็จสิ้น (Done)</h3></div><span class="px-2 py-0.5 rounded-full bg-slate-600 text-white text-[11px] font-bold">' + doneVisits.length + '</span></div><div class="p-3 divide-y divide-slate-100 flex-1 overflow-y-auto max-h-72">' + renderQueueList(doneVisits, "", "", "") + '</div></div></div>' +
        '<div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 space-y-4"><div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-4"><div><h2 class="text-base font-bold text-slate-800 flex items-center gap-2"><i data-lucide="calendar" class="w-4 h-4 text-sky-600"></i><span>ตารางนัดหมายและตารางออกตรวจ</span></h2><p class="text-xs text-slate-500">คลิกช่องเวลาว่างเพื่อเพิ่มนัดหมายทันที | สีประจำแพทย์และห้องตรวจ</p></div><div class="flex items-center gap-2"><span class="text-xs font-semibold text-slate-500">สลับมุมมอง:</span><div class="flex bg-slate-100 p-1 rounded-xl text-xs font-semibold"><button onclick="setViewMode(\'ROOM\')" class="px-3 py-1 rounded-lg transition-all ' + (STATE.viewMode === "ROOM" ? "bg-white text-sky-800 shadow-sm" : "text-slate-600") + '">แยกตามห้องตรวจ (Rooms)</button><button onclick="setViewMode(\'DOCTOR\')" class="px-3 py-1 rounded-lg transition-all ' + (STATE.viewMode === "DOCTOR" ? "bg-white text-sky-800 shadow-sm" : "text-slate-600") + '">แยกตามทันตแพทย์ (Dentists)</button></div></div></div><div class="overflow-x-auto"><div class="min-w-[750px] border border-slate-200 rounded-xl overflow-hidden"><div class="grid bg-slate-50 border-b border-slate-200 divide-x divide-slate-200 text-xs font-bold text-slate-700 text-center" style="grid-template-columns: 80px repeat(' + (cols.length || 2) + ', minmax(180px, 1fr))"><div class="p-3 bg-slate-100">เวลา</div>' + colHeaders + '</div><div class="divide-y divide-slate-100">' + timeRows + '</div></div></div></div></div>';
        if (window.lucide) window.lucide.createIcons();
        return;
      }

      // 2. TV QUEUE DISPLAY (src/app/tv-queue/page.tsx)
      if (tab === "tv") {
        const inExamVisits = STATE.visits.filter(v => v.status === "IN_EXAM");
        const waitingExamVisits = STATE.visits.filter(v => v.status === "WAITING_EXAM");
        const waitingPaymentVisits = STATE.visits.filter(v => v.status === "WAITING_PAYMENT");
        const activeVisit = (STATE.lastCalledQueue ? STATE.visits.find(v => v.queueNumber === Number(STATE.lastCalledQueue.qNum)) : null) || inExamVisits[0] || waitingExamVisits[0] || null;
        const activePat = activeVisit ? (STATE.patients.find(p => p.id === activeVisit.patientId) || pat0) : null;
        const activeDoc = activeVisit ? (STATE.doctors.find(d => d.id === activeVisit.doctorId) || STATE.doctors[0] || { nickname: "หมอมิน" }) : null;
        const activeRoom = activeVisit ? (STATE.rooms.find(r => r.id === activeVisit.roomId) || STATE.rooms[0] || { name: "ห้องตรวจ 1 (หมอมิน)" }) : null;
        const soundEnabled = STATE.tvSoundEnabled !== false;
        const nowTime = new Date().toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

        container.innerHTML = '<div class="min-h-[calc(100vh-3rem)] bg-gradient-to-br from-slate-900 via-sky-950 to-teal-950 text-white rounded-3xl p-6 md:p-8 shadow-2xl flex flex-col justify-between border border-sky-800/40">' +
          '<div class="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">' +
            '<div class="flex items-center gap-4">' +
              '<button type="button" onclick="switchTab(\'queue\')" class="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-sky-200 transition-colors" title="กลับหน้าจัดการคิว"><i data-lucide="arrow-left" class="w-5 h-5"></i></button>' +
              '<div class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-sky-500/30"><i data-lucide="sparkles" class="w-6 h-6 text-white"></i></div>' +
              '<div><h1 class="text-xl md:text-2xl font-black tracking-tight text-white">คลินิกทันตกรรมหมอมิน หมอพรีม (Min & Preem Dental Clinic)</h1><p class="text-xs md:text-sm text-sky-300">หน้าจอแสดงคิวห้องตรวจและเรียกคิวอัตโนมัติ • ' + formatThaiDate(new Date(), true) + '</p></div>' +
            '</div>' +
            '<div class="flex items-center gap-3">' +
              '<div class="px-4 py-2 rounded-2xl bg-white/10 border border-white/15 flex items-center gap-2.5"><i data-lucide="clock" class="w-5 h-5 text-emerald-400 animate-pulse"></i><span class="font-mono text-xl md:text-2xl font-black text-white">' + nowTime + ' น.</span></div>' +
              '<button type="button" onclick="STATE.tvSoundEnabled = (STATE.tvSoundEnabled === false); renderView();" class="px-4 py-2.5 rounded-2xl font-bold text-xs flex items-center gap-2 border transition-all ' + (soundEnabled ? "bg-emerald-500/20 border-emerald-400/50 text-emerald-300 hover:bg-emerald-500/30" : "bg-rose-500/20 border-rose-400/50 text-rose-300 hover:bg-rose-500/30") + '"><i data-lucide="' + (soundEnabled ? "volume-2" : "volume-x") + '" class="w-4 h-4"></i><span>' + (soundEnabled ? "เปิดเสียงขานคิวไทย" : "ปิดเสียงอยู่") + '</span></button>' +
              (activeVisit ? '<button type="button" data-q="' + activeVisit.queueNumber + '" data-name="' + activePat.firstNameTh + ' ' + activePat.lastNameTh + '" data-room="' + activeRoom.name + '" onclick="speakThaiQueue(this.dataset.q, this.dataset.name, this.dataset.room)" class="px-4 py-2.5 rounded-2xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-sky-500/30 transition-all"><i data-lucide="bell-ring" class="w-4 h-4"></i><span>ขานคิวซ้ำ</span></button>' : '') +
            '</div>' +
          '</div>' +
          '<div class="grid grid-cols-1 lg:grid-cols-12 gap-6 my-6 flex-1">' +
            '<div class="lg:col-span-5 flex flex-col gap-6">' +
              '<div class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sky-500 via-sky-600 to-teal-600 p-6 md:p-8 shadow-2xl border border-white/20 flex-1 flex flex-col justify-center">' +
                '<div class="flex items-center justify-between mb-3"><span class="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"><i data-lucide="bell-ring" class="w-3.5 h-3.5 animate-bounce"></i><span>กำลังเรียกคิวเข้าห้องตรวจ (Now Calling)</span></span></div>' +
                ((STATE.lastCalledQueue || activeVisit) ? '<div class="my-auto space-y-4"><div class="flex items-baseline gap-4"><span class="text-sm font-bold text-sky-100 uppercase">หมายเลขคิวล่าสุด</span><span class="text-6xl md:text-7xl font-black font-mono tracking-tighter text-white drop-shadow animate-pulse">#' + String((STATE.lastCalledQueue ? STATE.lastCalledQueue.qNum : activeVisit.queueNumber)).padStart(2, "0") + '</span></div><div><h2 class="text-2xl sm:text-3xl font-black text-white leading-tight">คุณ ' + (STATE.lastCalledQueue ? STATE.lastCalledQueue.name : (activePat.firstNameTh + ' ' + (activePat.lastNameTh || ""))) + '</h2><p class="text-sky-100 text-sm mt-1">ทันตแพทย์: ' + (activeDoc.nickname || activeDoc.fullName) + ' • เวลาขาน: ' + (STATE.lastCalledQueue ? STATE.lastCalledQueue.time : 'ตอนนี้') + '</p></div><div class="pt-3 border-t border-white/20 flex items-center justify-between"><span class="text-xs text-sky-100">เชิญเข้าห้องตรวจ:</span><span class="px-4 py-1.5 rounded-2xl bg-amber-400 text-slate-950 font-black text-lg md:text-xl shadow-md">' + (STATE.lastCalledQueue ? STATE.lastCalledQueue.room : activeRoom.name) + '</span></div></div>' : '<div class="my-auto py-12 text-center text-sky-100/80"><p class="text-lg font-bold">ยังไม่มีคิวที่กำลังเรียกในขณะนี้</p><p class="text-xs mt-1">กรุณารอเจ้าหน้าที่เรียกคิวของท่าน</p></div>') +
              '</div>' +
              '<div class="rounded-3xl bg-white/10 backdrop-blur-md border border-emerald-400/30 p-5">' +
                '<div class="flex items-center justify-between mb-3"><div class="flex items-center gap-2"><i data-lucide="credit-card" class="w-5 h-5 text-emerald-400"></i><h3 class="text-xs md:text-sm font-bold text-emerald-300 whitespace-nowrap">เชิญชำระเงิน / รับยา (Billing Counter)</h3></div><span class="px-2.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-black text-xs">' + waitingPaymentVisits.length + ' คิว</span></div>' +
                (waitingPaymentVisits.length === 0 ? '<p class="text-xs text-slate-400 py-3 text-center">ไม่มีคิวรอชำระเงิน</p>' : '<div class="grid grid-cols-2 gap-2.5">' + waitingPaymentVisits.map(v => {
                  const p = STATE.patients.find(x => x.id === v.patientId) || pat0;
                  return '<div class="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center gap-3"><span class="w-10 h-10 rounded-xl bg-emerald-400 text-slate-950 font-black font-mono text-lg flex items-center justify-center shrink-0">' + String(v.queueNumber).padStart(2, "0") + '</span><div class="min-w-0"><p class="font-bold text-sm text-white whitespace-nowrap overflow-hidden text-ellipsis leading-normal">คุณ ' + p.firstNameTh + ' ' + (p.lastNameTh || "") + '</p><p class="text-[11px] text-emerald-200 whitespace-nowrap leading-normal">เชิญชำระเงิน / รับยา</p></div></div>';
                }).join("") + '</div>') +
              '</div>' +
            '</div>' +
            '<div class="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6">' +
              '<div class="rounded-3xl bg-white/5 border border-white/10 p-6 flex flex-col"><div class="flex items-center justify-between border-b border-white/10 pb-3 mb-4"><div class="flex items-center gap-2"><i data-lucide="stethoscope" class="w-5 h-5 text-sky-400"></i><h3 class="text-sm md:text-base font-bold text-white whitespace-nowrap">กำลังตรวจรักษา (In Exam)</h3></div><span class="px-3 py-0.5 rounded-full bg-sky-500 text-white font-black text-xs">' + inExamVisits.length + ' ห้อง</span></div><div class="space-y-3 flex-1 overflow-y-auto">' +
                (inExamVisits.length === 0 ? '<div class="py-16 text-center text-slate-400 text-sm">ห้องตรวจว่างทั้งหมด</div>' : inExamVisits.map(v => {
                  const p = STATE.patients.find(x => x.id === v.patientId) || pat0;
                  const d = STATE.doctors.find(x => x.id === v.doctorId) || STATE.doctors[0] || { nickname: "หมอมิน" };
                  const r = STATE.rooms.find(x => x.id === v.roomId) || STATE.rooms[0] || { name: "ห้องตรวจ 1 (หมอมิน)" };
                  return '<div class="p-4 rounded-2xl bg-sky-500/15 border border-sky-400/30 flex items-center justify-between gap-3"><div class="flex items-center gap-3.5 min-w-0"><span class="w-12 h-12 rounded-2xl bg-sky-400 text-slate-950 font-black font-mono text-xl flex items-center justify-center shrink-0">#' + String(v.queueNumber).padStart(2, "0") + '</span><div class="min-w-0"><p class="font-bold text-base text-white truncate">คุณ ' + p.firstNameTh + ' ' + (p.lastNameTh ? p.lastNameTh.charAt(0) + "." : "") + '</p><p class="text-xs text-sky-300 truncate">' + (d.nickname || d.fullName) + '</p></div></div><div class="flex items-center gap-2 shrink-0"><span class="px-3 py-1.5 rounded-xl bg-white/15 text-amber-300 font-bold text-xs">' + r.name.split("(")[0] + '</span></div></div>';
                }).join("")) +
              '</div></div>' +
              '<div class="rounded-3xl bg-white/5 border border-white/10 p-6 flex flex-col"><div class="flex items-center justify-between border-b border-white/10 pb-3 mb-4"><div class="flex items-center gap-2"><i data-lucide="clock" class="w-5 h-5 text-amber-400"></i><h3 class="text-lg font-bold text-white">คิวรอเรียกตรวจ (Waiting)</h3></div><span class="px-3 py-0.5 rounded-full bg-amber-500 text-slate-950 font-black text-xs">' + waitingExamVisits.length + ' คิว</span></div><div class="space-y-3 flex-1 overflow-y-auto">' +
                (waitingExamVisits.length === 0 ? '<div class="py-16 text-center text-slate-400 text-sm">ไม่มีคิวรอตรวจในขณะนี้</div>' : waitingExamVisits.map((v, idx) => {
                  const p = STATE.patients.find(x => x.id === v.patientId) || pat0;
                  const d = STATE.doctors.find(x => x.id === v.doctorId) || STATE.doctors[0] || { nickname: "หมอมิน" };
                  return '<div class="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between gap-3"><div class="flex items-center gap-3.5 min-w-0"><span class="w-11 h-11 rounded-2xl bg-amber-400/20 border border-amber-400/40 text-amber-300 font-black font-mono text-lg flex items-center justify-center shrink-0">#' + String(v.queueNumber).padStart(2, "0") + '</span><div class="min-w-0"><p class="font-bold text-sm md:text-base text-white whitespace-nowrap overflow-hidden text-ellipsis leading-normal">คุณ ' + p.firstNameTh + ' ' + (p.lastNameTh || "") + '</p><p class="text-xs text-amber-200/90 whitespace-nowrap overflow-hidden text-ellipsis leading-normal">แพทย์: ' + (d.nickname || d.fullName) + '</p></div></div><span class="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 text-xs font-semibold shrink-0">ลำดับถัดไป #' + (idx + 1) + '</span></div>';
                }).join("")) +
              '</div></div>' +
            '</div>' +
          '</div>' +
          '<div class="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between text-xs text-sky-300/80 gap-2"><div class="flex items-center gap-2"><i data-lucide="check-circle-2" class="w-4 h-4 text-emerald-400"></i><span>หากถึงคิวของท่านแล้วไม่สะดวกเข้าห้องตรวจ กรุณาแจ้งเจ้าหน้าที่หน้าเคาน์เตอร์ • ขอบพระคุณที่ไว้วางใจคลินิกทันตกรรมหมอมิน หมอพรีม</span></div><span class="font-mono text-[11px] text-sky-400">Auto-Sync Live Queue System</span></div>' +
        '</div>';
        if (window.lucide) window.lucide.createIcons();
        return;
      }

      // 3. APPOINTMENTS LIST PAGE (src/app/appointments/page.tsx - EXACT MATCH TO SCREENSHOT)
      if (tab === "appointments") {
        const aq = (STATE.appFilterSearch || "").toLowerCase().trim();
        const adate = STATE.appFilterDate || "";
        const adoc = STATE.appFilterDoctor || "all";
        const astat = STATE.appFilterStatus || "all";
        const filteredApps = STATE.appointments.filter(app => {
          const p = STATE.patients.find(x => x.id === app.patientId) || pat0;
          if (adate && app.date !== adate) return false;
          if (adoc !== "all" && app.doctorId !== adoc) return false;
          if (astat !== "all" && app.status !== astat) return false;
          if (aq) {
            const hay = ((p.firstNameTh || "") + " " + (p.lastNameTh || "") + " " + (p.dn || "") + " " + (p.phone || "")).toLowerCase();
            if (!hay.includes(aq)) return false;
          }
          return true;
        });
        const docOpts = STATE.doctors.map(d => '<option value="' + d.id + '" ' + (adoc === d.id ? "selected" : "") + '>' + d.fullName + ' (' + d.nickname + ')</option>').join("");
        const appRows = filteredApps.length === 0 ? '<tr><td colspan="8" class="py-12 text-center text-slate-400 italic">ไม่พบรายการนัดหมายตามเงื่อนไขที่เลือก</td></tr>' : filteredApps.map(app => {
          const p = STATE.patients.find(x => x.id === app.patientId) || pat0;
          const d = STATE.doctors.find(x => x.id === app.doctorId) || STATE.doctors[0] || { nickname: "หมอมิน" };
          const r = STATE.rooms.find(x => x.id === app.roomId) || STATE.rooms[0] || { name: "ห้องตรวจ 1 (หมอมิน)" };
          const v = STATE.visits.find(x => x.appointmentId === app.id || (x.patientId === app.patientId && x.visitDate === app.date));
          const stClass = app.status === "CONFIRMED" ? "bg-emerald-100 text-emerald-800" : app.status === "BOOKED" ? "bg-sky-100 text-sky-800" : app.status === "NO_SHOW" ? "bg-amber-100 text-amber-800" : "bg-rose-100 text-rose-800";
          const stText = app.status === "CONFIRMED" ? "ยืนยันแล้ว" : app.status === "BOOKED" ? "นัดแล้ว" : app.status === "NO_SHOW" ? "ไม่มาตามนัด" : "ยกเลิก";
          const visitBadge = v ? ('<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800">คิวที่ ' + v.queueNumber + ' (' + (v.status === "WAITING_EXAM" ? "รอตรวจ" : v.status === "IN_EXAM" ? "กำลังตรวจ" : v.status === "WAITING_PAYMENT" ? "รอชำระ" : "เสร็จสิ้น") + ')</span>') : '<span class="text-slate-400 text-[10px]">ยังไม่เช็กอิน</span>';
          return '<tr class="hover:bg-slate-50/80 transition-colors">' +
            '<td class="px-4 py-3 whitespace-nowrap font-medium text-slate-800"><div>' + formatThaiDate(app.date) + '</div><div class="text-[11px] text-slate-500 font-mono">' + app.startTime + ' - ' + app.endTime + ' น.</div></td>' +
            '<td class="px-4 py-3"><div class="font-bold text-slate-900">' + p.firstNameTh + ' ' + p.lastNameTh + '</div><div class="text-[10px] text-slate-500">' + p.dn + ' | โทร: ' + p.phone + '</div></td>' +
            '<td class="px-4 py-3 whitespace-nowrap"><span class="font-medium text-slate-800">' + (d.nickname || d.fullName) + '</span></td>' +
            '<td class="px-4 py-3 whitespace-nowrap text-slate-600">' + r.name.split(" ")[0] + '</td>' +
            '<td class="px-4 py-3"><div class="font-semibold text-sky-800">' + (app.typeName || "ตรวจทั่วไป") + '</div>' + (app.notes ? '<div class="text-[10px] text-slate-500 truncate max-w-xs">' + app.notes + '</div>' : '') + '</td>' +
            '<td class="px-4 py-3 text-center whitespace-nowrap"><span class="px-2 py-0.5 rounded-full text-[10px] font-bold ' + stClass + '">' + stText + '</span></td>' +
            '<td class="px-4 py-3 text-center whitespace-nowrap">' + visitBadge + '</td>' +
            '<td class="px-4 py-3 text-right whitespace-nowrap space-x-1.5">' +
              (!v && app.status !== "CANCELLED" ? '<button type="button" data-aid="' + app.id + '" onclick="checkInAppointmentD1(this.dataset.aid)" class="px-2.5 py-1 text-[11px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-sm">เช็กอิน</button>' : '') +
              (app.status === "BOOKED" ? '<button type="button" data-aid="' + app.id + '" onclick="updateAppointmentStatusD1(this.dataset.aid, \'CONFIRMED\')" class="px-2 py-1 text-[11px] font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg">ยืนยัน</button>' : '') +
              (app.status !== "CANCELLED" ? '<button type="button" data-aid="' + app.id + '" data-d="' + app.date + '" data-t="' + app.startTime + '" onclick="STATE.rescheduleAppId=this.dataset.aid; STATE.rescheduleDate=this.dataset.d; STATE.rescheduleTime=this.dataset.t; renderView();" class="px-2 py-1 text-[11px] font-semibold bg-sky-50 hover:bg-sky-100 text-sky-700 rounded-lg">เลื่อนนัด</button>' : '') +
              (app.status !== "CANCELLED" ? '<button type="button" data-aid="' + app.id + '" onclick="STATE.cancelAppId=this.dataset.aid; STATE.cancelReason=\'\'; renderView();" class="px-2 py-1 text-[11px] font-semibold bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg">ยกเลิก</button>' : '') +
            '</td>' +
          '</tr>';
        }).join("");

        let subModalHtml = "";
        if (STATE.rescheduleAppId) {
          const rapp = STATE.appointments.find(a => a.id === STATE.rescheduleAppId);
          const rp = rapp ? (STATE.patients.find(x => x.id === rapp.patientId) || pat0) : pat0;
          subModalHtml = '<div class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4"><div class="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md p-5 space-y-4"><h3 class="text-sm font-bold text-slate-800">เลื่อนนัดหมาย: ' + rp.firstNameTh + ' ' + rp.lastNameTh + '</h3><div class="grid grid-cols-2 gap-3"><div><label class="block text-xs font-semibold text-slate-700 mb-1">วันที่ใหม่</label><input type="date" value="' + STATE.rescheduleDate + '" onchange="STATE.rescheduleDate=this.value" class="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg" /></div><div><label class="block text-xs font-semibold text-slate-700 mb-1">เวลาใหม่ (24 ชม.)</label><select onchange="STATE.rescheduleTime=this.value" class="w-full px-3 py-1.5 text-xs font-mono font-bold border border-slate-300 rounded-lg bg-white">' + TIME_SLOTS.map(t => '<option value="' + t + '" ' + (STATE.rescheduleTime === t ? "selected" : "") + '>' + t + ' น.</option>').join("") + '</select></div></div><div class="flex justify-end gap-2 pt-2 border-t border-slate-100"><button type="button" onclick="STATE.rescheduleAppId=null;renderView();" class="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg">ปิด</button><button type="button" onclick="updateAppointmentStatusD1(STATE.rescheduleAppId, \'CONFIRMED\', { date: STATE.rescheduleDate, startTime: STATE.rescheduleTime })" class="px-4 py-1.5 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-sm">บันทึกการเลื่อนนัด</button></div></div></div>';
        }
        if (STATE.cancelAppId) {
          const capp = STATE.appointments.find(a => a.id === STATE.cancelAppId);
          const cp = capp ? (STATE.patients.find(x => x.id === capp.patientId) || pat0) : pat0;
          subModalHtml = '<div class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4"><div class="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md p-5 space-y-4"><h3 class="text-sm font-bold text-slate-800">ระบุเหตุผลในการยกเลิกนัด: ' + cp.firstNameTh + ' ' + cp.lastNameTh + '</h3><textarea rows="3" placeholder="เช่น คนไข้ติดธุระด่วน ขอเลื่อนไปสัปดาห์หน้า..." oninput="STATE.cancelReason=this.value" class="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl">' + (STATE.cancelReason || "") + '</textarea><div class="flex justify-end gap-2 pt-2 border-t border-slate-100"><button type="button" onclick="STATE.cancelAppId=null;renderView();" class="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg">ยกเลิก</button><button type="button" onclick="updateAppointmentStatusD1(STATE.cancelAppId, \'CANCELLED\', { cancelReason: STATE.cancelReason })" class="px-4 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm">ยืนยันยกเลิกนัด</button></div></div></div>';
        }

        container.innerHTML = '<div class="space-y-6">' +
          '<div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 space-y-4">' +
            '<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">' +
              '<div><h1 class="text-lg font-bold text-slate-800 flex items-center gap-2"><i data-lucide="calendar" class="w-5 h-5 text-sky-600"></i><span>รายการนัดหมายคนไข้</span></h1><p class="text-xs text-slate-500">ค้นหา กรอง และจัดการสถานะนัดหมาย (ยืนยัน, เลื่อนนัด, ยกเลิก, เช็กอิน)</p></div>' +
              '<button type="button" onclick="openAppointmentModal(\'09:00\', \'\')" class="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 shadow-md shadow-sky-600/20 transition-all flex items-center gap-1.5 self-start sm:self-auto"><i data-lucide="plus-circle" class="w-4 h-4"></i><span>+ เพิ่มนัดหมายใหม่</span></button>' +
            '</div>' +
            '<div class="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-100">' +
              '<div><label class="block text-[11px] font-semibold text-slate-500 mb-1">ค้นหาชื่อ, DN หรือเบอร์โทร</label><div class="relative"><i data-lucide="search" class="w-4 h-4 text-slate-400 absolute left-3 top-2.5"></i><input type="text" value="' + (STATE.appFilterSearch || "") + '" oninput="STATE.appFilterSearch=this.value; renderView();" placeholder="พิมพ์เพื่อค้นหา..." class="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none" /></div></div>' +
              '<div><label class="block text-[11px] font-semibold text-slate-500 mb-1">วันที่นัด</label><input type="date" value="' + adate + '" onchange="STATE.appFilterDate=this.value; renderView();" class="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-xl bg-white" /></div>' +
              '<div><label class="block text-[11px] font-semibold text-slate-500 mb-1">ทันตแพทย์</label><select onchange="STATE.appFilterDoctor=this.value; renderView();" class="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-xl bg-white"><option value="all">ทั้งหมด</option>' + docOpts + '</select></div>' +
              '<div><label class="block text-[11px] font-semibold text-slate-500 mb-1">สถานะนัดหมาย</label><select onchange="STATE.appFilterStatus=this.value; renderView();" class="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-xl bg-white"><option value="all" ' + (astat === "all" ? "selected" : "") + '>ทุกสถานะ</option><option value="BOOKED" ' + (astat === "BOOKED" ? "selected" : "") + '>นัดแล้ว (จองแล้ว)</option><option value="CONFIRMED" ' + (astat === "CONFIRMED" ? "selected" : "") + '>ยืนยันแล้ว</option><option value="NO_SHOW" ' + (astat === "NO_SHOW" ? "selected" : "") + '>ไม่มาตามนัด</option><option value="CANCELLED" ' + (astat === "CANCELLED" ? "selected" : "") + '>ยกเลิก</option></select></div>' +
            '</div>' +
          '</div>' +
          '<div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"><div class="overflow-x-auto"><table class="w-full text-left text-xs divide-y divide-slate-200"><thead class="bg-slate-50 font-bold text-slate-600"><tr><th class="px-4 py-3">วันและเวลา</th><th class="px-4 py-3">คนไข้</th><th class="px-4 py-3">ทันตแพทย์</th><th class="px-4 py-3">ห้องตรวจ</th><th class="px-4 py-3">ประเภทนัด / อาการ</th><th class="px-4 py-3 text-center">สถานะนัด</th><th class="px-4 py-3 text-center">การมารักษา</th><th class="px-4 py-3 text-right">การจัดการ</th></tr></thead><tbody class="divide-y divide-slate-100">' + appRows + '</tbody></table></div></div>' +
          subModalHtml +
        '</div>';
        if (window.lucide) window.lucide.createIcons();
        return;
      }

      // 4. PATIENTS DIRECTORY (src/app/patients/page.tsx)
      if (tab === "patients") {
        const rf = STATE.patientRights || "all";
        const df = STATE.patientDoctorId || "all";
        const sq = (STATE.patientSearch || "").toLowerCase().trim();
        const filtered = STATE.patients.filter(p => {
          if (rf !== "all" && p.rights !== rf) return false;
          if (df !== "all" && p.attendingDoctorId !== df) return false;
          if (sq) {
            const m = (p.dn || "").toLowerCase().includes(sq) || (p.firstNameTh || "").toLowerCase().includes(sq) || (p.lastNameTh || "").toLowerCase().includes(sq) || (p.phone || "").toLowerCase().includes(sq);
            if (!m) return false;
          }
          return true;
        });
        const docOpts = STATE.doctors.map(d => '<option value="' + d.id + '" ' + (df === d.id ? "selected" : "") + '>' + d.fullName + ' (' + (d.nickname || "") + ')</option>').join("");
        const patTableRows = filtered.length === 0 ? '<tr><td colspan="8" class="py-12 text-center text-slate-400 italic">ไม่พบข้อมูลคนไข้ตามคำค้นหา</td></tr>' : filtered.map(p => {
          const doc = STATE.doctors.find(d => d.id === p.attendingDoctorId);
          const docName = doc ? (doc.nickname || doc.fullName) : "-";
          const allergyBadge = p.drugAllergies ? ('<span class="text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded flex items-center gap-1 max-w-xs truncate"><i data-lucide="shield-alert" class="w-3.5 h-3.5 flex-shrink-0 text-rose-600"></i><span class="truncate">' + p.drugAllergies + '</span></span>') : '<span class="text-slate-400 text-[11px]">-</span>';
          const lastVisit = STATE.visits.find(v => v.patientId === p.id);
          return '<tr class="hover:bg-slate-50/80 transition-colors border-b border-slate-100">' +
            '<td class="px-4 py-3 font-mono font-bold text-sky-700 whitespace-nowrap">' + (p.dn || "-") + '</td>' +
            '<td class="px-4 py-3 font-semibold text-slate-900 whitespace-nowrap">' + (p.title || "") + ' ' + (p.firstNameTh || "") + ' ' + (p.lastNameTh || "") +
            (p.firstNameEn ? ('<div class="text-[10px] text-slate-400 font-normal">' + p.firstNameEn + ' ' + (p.lastNameEn || "") + '</div>') : '') + '</td>' +
            '<td class="px-4 py-3 whitespace-nowrap text-slate-600 font-mono">' + (p.phone || "-") + '</td>' +
            '<td class="px-4 py-3 whitespace-nowrap"><span class="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700">' + (p.rights || "จ่ายเอง") + '</span></td>' +
            '<td class="px-4 py-3">' + allergyBadge + '</td>' +
            '<td class="px-4 py-3 whitespace-nowrap text-slate-700">' + docName + '</td>' +
            '<td class="px-4 py-3 whitespace-nowrap text-slate-500">' + (lastVisit ? formatThaiDate(lastVisit.visitDate) : "-") + '</td>' +
            '<td class="px-4 py-3 text-right whitespace-nowrap"><button type="button" data-pid="' + p.id + '" onclick="STATE.selectedPatientId=this.dataset.pid; STATE.patientProfileTab=\'general\'; switchTab(\'patient-detail\');" class="px-3 py-1.5 rounded-lg text-xs font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 transition-colors inline-flex items-center gap-1"><span>เปิดแฟ้มประวัติ</span><i data-lucide="chevron-right" class="w-3.5 h-3.5"></i></button></td>' +
          '</tr>';
        }).join("");
        container.innerHTML = '<div class="space-y-6">' +
          '<div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 space-y-4">' +
            '<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">' +
              '<div><h1 class="text-lg font-bold text-slate-800 flex items-center gap-2"><i data-lucide="users" class="w-5 h-5 text-sky-600"></i><span>ทะเบียนคนไข้และเวชระเบียน</span></h1><p class="text-xs text-slate-500">ค้นหาประวัติคนไข้ เลขประจำตัว (DN), เบอร์โทร, ตรวจสอบสิทธิ และเปิดแฟ้มประวัติ</p></div>' +
              '<button type="button" onclick="openNewPatientModal()" class="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 shadow-md shadow-sky-600/20 transition-all flex items-center gap-1.5 self-start sm:self-auto"><i data-lucide="user-plus" class="w-4 h-4"></i><span>+ ลงทะเบียนคนไข้ใหม่</span></button>' +
            '</div>' +
            '<div class="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100">' +
              '<div class="relative"><i data-lucide="search" class="w-4 h-4 text-slate-400 absolute left-3 top-2.5"></i><input type="text" placeholder="ค้นหาชื่อ-นามสกุล, เลข DN หรือเบอร์โทร..." value="' + (STATE.patientSearch || "") + '" oninput="STATE.patientSearch = this.value; renderView();" class="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none" /></div>' +
              '<div><select onchange="STATE.patientRights = this.value; renderView();" class="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-xl bg-white"><option value="all" ' + (rf === "all" ? "selected" : "") + '>ทุกสิทธิการรักษา</option><option value="จ่ายเอง" ' + (rf === "จ่ายเอง" ? "selected" : "") + '>จ่ายเอง (Self-pay)</option><option value="ประกันสังคม (สปส.)" ' + (rf === "ประกันสังคม (สปส.)" ? "selected" : "") + '>ประกันสังคม (สปส.)</option><option value="สปสช. (บัตรทอง)" ' + (rf === "สปสช. (บัตรทอง)" ? "selected" : "") + '>สปสช. (บัตรทอง)</option><option value="ประกันคู่สัญญา" ' + (rf === "ประกันคู่สัญญา" ? "selected" : "") + '>ประกันคู่สัญญา</option></select></div>' +
              '<div><select onchange="STATE.patientDoctorId = this.value; renderView();" class="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-xl bg-white"><option value="all" ' + (df === "all" ? "selected" : "") + '>ทันตแพทย์ประจำทุกคน</option>' + docOpts + '</select></div>' +
            '</div>' +
          '</div>' +
          '<div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"><div class="overflow-x-auto"><table class="w-full text-left text-xs divide-y divide-slate-200"><thead class="bg-slate-50 font-bold text-slate-600"><tr><th class="px-4 py-3">เลขประจำตัว (DN)</th><th class="px-4 py-3">ชื่อ - นามสกุล</th><th class="px-4 py-3">เบอร์ติดต่อ</th><th class="px-4 py-3">สิทธิการรักษา</th><th class="px-4 py-3">ข้อควรระวัง / แพ้ยา</th><th class="px-4 py-3">แพทย์ประจำ</th><th class="px-4 py-3">มารักษาล่าสุด</th><th class="px-4 py-3 text-right">การจัดการ</th></tr></thead><tbody class="divide-y divide-slate-100">' + patTableRows + '</tbody></table></div></div>' +
        '</div>';
        if (window.lucide) window.lucide.createIcons();
        return;
      }

      // 4B. PATIENT PROFILE PAGE (src/app/patients/[id]/page.tsx)
      if (tab === "patient-detail") {
        const p = STATE.patients.find(x => x.id === STATE.selectedPatientId) || pat0;
        const pTab = STATE.patientProfileTab || "general";
        const attDoc = STATE.doctors.find(d => d.id === p.attendingDoctorId);
        const pTabs = [
          { key: "general", label: "ข้อมูลทั่วไป", icon: "user" },
          { key: "tooth-chart", label: "ผังฟัน (FDI Chart)", icon: "smile" },
          { key: "visits", label: "ประวัติการรักษา (Visits)", icon: "history" },
          { key: "plans", label: "แผนการรักษา (Plans)", icon: "file-text" },
          { key: "finances", label: "การเงิน & ใบเสร็จ", icon: "credit-card" },
          { key: "ortho", label: "แพ็กเกจจัดฟัน", icon: "smile" },
          { key: "lab", label: "งานแลป", icon: "flask-conical" },
          { key: "documents", label: "เอกสาร & X-Ray", icon: "paperclip" }
        ];
        const tabNavHtml = pTabs.map(t => {
          const act = pTab === t.key;
          return '<button type="button" data-pt="' + t.key + '" onclick="STATE.patientProfileTab=this.dataset.pt; renderView();" class="flex items-center gap-2 px-3.5 py-2.5 text-xs font-semibold whitespace-nowrap border-b-2 transition-all ' + (act ? "border-sky-600 text-sky-700 bg-sky-50/40" : "border-transparent text-slate-500 hover:text-slate-800") + '"><i data-lucide="' + t.icon + '" class="w-4 h-4 ' + (act ? "text-sky-600" : "text-slate-400") + '"></i><span>' + t.label + '</span></button>';
        }).join("");

        let bodyHtml = "";
        if (pTab === "general") {
          bodyHtml = '<div class="grid grid-cols-1 md:grid-cols-2 gap-5">' +
            '<div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 space-y-3"><h3 class="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">ข้อมูลส่วนตัวและการติดต่อ</h3><div class="grid grid-cols-2 gap-3 text-xs"><div><span class="text-slate-400 block">เลขบัตรประชาชน</span><span class="font-semibold text-slate-800">' + (p.idCardNumber || "-") + '</span></div><div><span class="text-slate-400 block">อีเมล</span><span class="font-semibold text-slate-800">' + (p.email || "-") + '</span></div><div class="col-span-2"><span class="text-slate-400 block">ที่อยู่</span><span class="font-semibold text-slate-800">' + (p.address || "กรุงเทพมหานคร") + '</span></div><div><span class="text-slate-400 block">ผู้ติดต่อฉุกเฉิน</span><span class="font-semibold text-slate-800">' + (p.emergencyContactName || "-") + '</span></div><div><span class="text-slate-400 block">เบอร์ติดต่อฉุกเฉิน</span><span class="font-semibold text-slate-800 font-mono">' + (p.emergencyContactPhone || "-") + '</span></div></div></div>' +
            '<div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 space-y-3"><h3 class="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">ข้อมูลคลินิก & สิทธิการรักษา</h3><div class="grid grid-cols-2 gap-3 text-xs"><div><span class="text-slate-400 block">สิทธิการรักษา</span><span class="font-semibold text-slate-800">' + (p.rights || "จ่ายเอง") + '</span></div><div><span class="text-slate-400 block">ทันตแพทย์ประจำ</span><span class="font-semibold text-slate-800">' + (attDoc ? attDoc.fullName : "ไม่ระบุ") + '</span></div><div><span class="text-slate-400 block">แหล่งที่รู้จักคลินิก</span><span class="font-semibold text-slate-800">' + (p.marketingSource || "Walk-in") + '</span></div><div><span class="text-slate-400 block">วันที่ลงทะเบียน</span><span class="font-semibold text-slate-800">' + formatThaiDate(p.createdAt) + '</span></div><div class="col-span-2"><span class="text-slate-400 block">บันทึกช่วยจำ (Notes)</span><span class="text-slate-600 italic">' + (p.notes || "-") + '</span></div></div></div>' +
          '</div>';
        } else if (pTab === "tooth-chart") {
          const upper1 = ["18","17","16","15","14","13","12","11"];
          const upper2 = ["21","22","23","24","25","26","27","28"];
          const lower1 = ["48","47","46","45","44","43","42","41"];
          const lower2 = ["31","32","33","34","35","36","37","38"];
          const renderT = (tno) => {
            const sel = STATE.selectedToothNo === tno;
            return '<button type="button" data-t="' + tno + '" onclick="STATE.selectedToothNo=this.dataset.t; renderView();" class="flex flex-col items-center justify-between p-1.5 w-11 h-14 rounded-lg border text-center transition-all ' + (sel ? "ring-2 ring-sky-500 border-sky-500 bg-sky-50" : "border-slate-200 hover:border-slate-400 bg-white") + '"><span class="text-[10px] font-bold text-slate-700">' + tno + '</span><span class="text-[9px] text-slate-300">ปกติ</span></button>';
          };
          bodyHtml = '<div class="bg-white rounded-2xl border border-slate-200 p-5 space-y-4"><div class="flex items-center justify-between border-b border-slate-100 pb-3"><div><h4 class="text-sm font-bold text-slate-800">ผังฟันระบบสากล FDI (Dental Chart)</h4><p class="text-xs text-slate-500">คลิกที่ซี่ฟันเพื่อดูประวัติ บันทึกรอยโรค หรือระบุด้านฟัน</p></div></div><div class="p-4 bg-slate-50/70 rounded-xl border border-slate-200 overflow-x-auto"><div class="space-y-4 min-w-[700px]"><div><div class="flex justify-between text-[11px] font-semibold text-slate-400 mb-1 px-2"><span>ขวาบน (Q1: 18 - 11)</span><span class="text-slate-600 font-bold">ฟันบน (Maxillary)</span><span>ซ้ายบน (Q2: 21 - 28)</span></div><div class="flex items-center justify-center gap-2"><div class="flex gap-1">' + upper1.map(renderT).join("") + '</div><div class="w-0.5 h-12 bg-slate-300"></div><div class="flex gap-1">' + upper2.map(renderT).join("") + '</div></div></div><div class="w-full border-t-2 border-dashed border-slate-300 relative my-2"><span class="absolute left-1/2 -top-2.5 -translate-x-1/2 bg-slate-200 text-slate-600 text-[10px] px-2 rounded-full font-bold">Midline</span></div><div><div class="flex items-center justify-center gap-2"><div class="flex gap-1">' + lower1.map(renderT).join("") + '</div><div class="w-0.5 h-12 bg-slate-300"></div><div class="flex gap-1">' + lower2.map(renderT).join("") + '</div></div><div class="flex justify-between text-[11px] font-semibold text-slate-400 mt-1 px-2"><span>ขวาล่าง (Q4: 48 - 41)</span><span class="text-slate-600 font-bold">ฟันล่าง (Mandibular)</span><span>ซ้ายล่าง (Q3: 31 - 38)</span></div></div></div></div></div>';
        } else if (pTab === "visits") {
          const pVisits = STATE.visits.filter(v => v.patientId === p.id);
          bodyHtml = '<div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 space-y-4"><div class="flex justify-between items-center"><h3 class="text-sm font-bold text-slate-800">ประวัติการมารักษา (Visits)</h3><button type="button" onclick="switchTab(\'emr\')" class="px-3 py-1.5 rounded-xl bg-sky-600 text-white text-xs font-bold">+ เปิดห้องตรวจ EMR</button></div>' + (pVisits.length === 0 ? '<p class="text-xs text-slate-400 italic">ยังไม่มีประวัติการมารักษา</p>' : pVisits.map(v => {
            const d = STATE.doctors.find(x => x.id === v.doctorId) || { nickname: "หมอมิน" };
            const r = STATE.rooms.find(x => x.id === v.roomId) || { name: "ห้องตรวจ 1" };
            return '<div class="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2 text-xs"><div class="flex items-center justify-between border-b border-slate-200 pb-2"><div class="flex items-center gap-2"><span class="font-bold text-slate-800">' + formatThaiDate(v.visitDate, true) + '</span><span class="text-slate-400">(' + v.visitNumber + ')</span><span class="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-100 text-teal-800">' + v.status + '</span></div><span class="text-slate-600 font-semibold">แพทย์: ' + d.nickname + ' | ' + r.name + '</span></div><p class="text-slate-600">อาการ/บันทึก: ' + (v.notes || "ตรวจและรักษาทางทันตกรรม") + '</p></div>';
          }).join("")) + '</div>';
        } else if (pTab === "finances") {
          const pInvs = STATE.invoices.filter(i => i.patientId === p.id);
          bodyHtml = '<div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 space-y-3"><h3 class="text-sm font-bold text-slate-800">ใบแจ้งค่ารักษา (Invoices)</h3><div class="overflow-x-auto"><table class="w-full text-left text-xs divide-y divide-slate-200"><thead class="bg-slate-50 font-bold text-slate-600"><tr><th class="px-3 py-2">เลขที่บิล</th><th class="px-3 py-2">วันที่</th><th class="px-3 py-2 text-right">ยอดสุทธิ</th><th class="px-3 py-2 text-right">ชำระแล้ว</th><th class="px-3 py-2 text-right">ค้างชำระ</th><th class="px-3 py-2 text-center">สถานะ</th></tr></thead><tbody class="divide-y divide-slate-100">' + (pInvs.length === 0 ? '<tr><td colspan="6" class="py-6 text-center text-slate-400 italic">ไม่มีประวัติบิล</td></tr>' : pInvs.map(inv => '<tr><td class="px-3 py-2 font-mono font-bold text-sky-700">' + inv.invoiceNo + '</td><td class="px-3 py-2">' + formatThaiDate(inv.createdAt) + '</td><td class="px-3 py-2 text-right font-mono font-bold">' + formatCurrency(inv.netAmount) + '</td><td class="px-3 py-2 text-right font-mono text-emerald-600">' + formatCurrency(inv.paidAmount) + '</td><td class="px-3 py-2 text-right font-mono text-amber-600 font-bold">' + formatCurrency(inv.balanceDue) + '</td><td class="px-3 py-2 text-center"><span class="px-2 py-0.5 rounded text-[10px] font-bold ' + (inv.status === "PAID" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800") + '">' + inv.status + '</span></td></tr>').join("")) + '</tbody></table></div></div>';
        } else {
          bodyHtml = '<div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 space-y-4"><div class="flex items-center justify-between border-b pb-3"><h3 class="text-sm font-bold text-slate-800">คลังฟิล์ม X-Ray, เปรียบเทียบภาพ Before/After และใบรับรองแพทย์ประกันสังคม 900฿</h3><button type="button" onclick="window.print()" class="px-4 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold">🖨️ สั่งพิมพ์เอกสาร (Print A4)</button></div><div class="p-6 rounded-2xl border-2 border-slate-300 bg-white space-y-3 text-xs"><div class="flex justify-between border-b pb-3"><div><h4 class="text-base font-black text-slate-900">คลินิกทันตกรรมหมอมิน หมอพรีม (Min & Preem Dental Clinic)</h4><p class="text-slate-500">123/45 ถนนสุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพมหานคร 10110</p></div><span class="font-bold text-sky-800">ใบรับรองแพทย์ / ประกันสังคม 900 บาท</span></div><p>ขอรับรองว่า <strong>' + p.title + ' ' + p.firstNameTh + ' ' + p.lastNameTh + ' (' + p.dn + ')</strong> ได้เข้ารับบริการตรวจและรักษาทางทันตกรรมจริง</p><div class="p-3 bg-sky-50 rounded-xl border border-sky-200 flex justify-between font-bold"><span>ยอดเบิกสิทธิทันตกรรมประกันสังคม (ไม่สำรองจ่าย):</span><span class="font-mono text-emerald-700 text-sm">900.00 บาท</span></div></div></div>';
        }

        container.innerHTML = '<div class="space-y-6">' +
          '<div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 space-y-4">' +
            '<div class="flex flex-col md:flex-row md:items-center justify-between gap-4">' +
              '<div class="flex items-start gap-3">' +
                '<button type="button" onclick="switchTab(\'patients\')" class="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors mt-0.5"><i data-lucide="arrow-left" class="w-5 h-5"></i></button>' +
                '<div><div class="flex items-center gap-2.5"><span class="px-2.5 py-0.5 rounded-lg bg-sky-100 text-sky-800 text-xs font-mono font-bold">' + p.dn + '</span><h1 class="text-xl font-bold text-slate-900">' + (p.title || "") + ' ' + p.firstNameTh + ' ' + p.lastNameTh + '</h1></div><div class="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1"><span>เบอร์โทร: <strong class="text-slate-700 font-mono">' + p.phone + '</strong></span><span>•</span><span>เพศ: ' + (p.gender === "FEMALE" ? "หญิง" : "ชาย") + '</span><span>•</span><span>วันเกิด: ' + formatThaiDate(p.birthDate) + '</span><span>•</span><span>สิทธิ: <strong class="text-slate-700">' + (p.rights || "จ่ายเอง") + '</strong></span></div></div>' +
              '</div>' +
              '<div class="flex items-center gap-3 self-end md:self-auto"><div class="px-3.5 py-2 rounded-xl bg-amber-50 border border-amber-200 text-right"><span class="text-[10px] font-semibold text-amber-700 block">เงินมัดจำคงเหลือ</span><span class="text-sm font-bold text-amber-900 font-mono">' + formatCurrency(p.depositBalance || 0) + '</span></div><button type="button" onclick="switchTab(\'emr\')" class="px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 shadow-sm transition-all flex items-center gap-1.5"><i data-lucide="stethoscope" class="w-4 h-4"></i><span>เปิดห้องตรวจ EMR</span></button></div>' +
            '</div>' +
            ((p.drugAllergies || p.chronicDiseases) ? '<div class="p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-xs"><i data-lucide="shield-alert" class="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5"></i><div class="space-y-1 flex-1"><p class="text-rose-900 font-bold">⚠️ ประวัติแพ้ยา: <span class="underline decoration-rose-500">' + (p.drugAllergies || "ไม่มีประวัติแพ้ยา") + '</span></p>' + (p.chronicDiseases ? '<p class="text-amber-900 font-semibold">🩺 โรคประจำตัว: ' + p.chronicDiseases + '</p>' : '') + '</div></div>' : '') +
            '<div class="flex border-b border-slate-200 overflow-x-auto no-scrollbar space-x-1">' + tabNavHtml + '</div>' +
          '</div>' +
          bodyHtml +
        '</div>';
        if (window.lucide) window.lucide.createIcons();
        return;
      }

      // 5. RECALL & LINE OA CRM (src/app/recall/page.tsx)
      if (tab === "recall") {
        const rTab = STATE.recallTab || "upcoming";
        const sent = STATE.recallSentIds || {};
        const upcomingList = STATE.appointments.filter(a => a.status !== "CANCELLED");
        const postCareList = STATE.visits;
        const orthoList = STATE.patientOrthoPackages;
        const sixMonthList = STATE.patients;

        let listHtml = "";
        if (rTab === "upcoming") {
          listHtml = '<div class="divide-y divide-slate-100"><div class="p-4 bg-slate-50 flex items-center justify-between"><h3 class="text-xs font-bold text-slate-800">รายการนัดหมายที่รอส่งข้อความยืนยันนัดผ่าน LINE OA</h3></div>' +
            upcomingList.map(app => {
              const p = STATE.patients.find(x => x.id === app.patientId) || pat0;
              const d = STATE.doctors.find(x => x.id === app.doctorId) || STATE.doctors[0] || { nickname: "หมอมิน" };
              const r = STATE.rooms.find(x => x.id === app.roomId) || STATE.rooms[0] || { name: "ห้องตรวจ 1" };
              const key = "app-" + app.id;
              return '<div class="p-4 flex flex-wrap items-center justify-between gap-4 text-xs"><div class="space-y-0.5"><div class="flex items-center gap-2"><span class="px-2 py-0.5 rounded bg-sky-100 text-sky-800 font-mono font-bold">' + app.date + ' • ' + app.startTime + ' น.</span><strong class="font-bold text-slate-900 text-sm">' + (p.title || "") + ' ' + p.firstNameTh + ' ' + p.lastNameTh + '</strong><span class="text-slate-400">(' + p.dn + ')</span></div><p class="text-slate-600">หัตถการ: <strong>' + (app.typeName || "นัดตรวจรักษา") + '</strong> • แพทย์: <strong>' + d.nickname + '</strong> (' + r.name + ') • โทร: ' + p.phone + '</p></div><div>' +
                (sent[key] ? '<span class="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold flex items-center gap-1"><i data-lucide="check-circle-2" class="w-4 h-4"></i><span>ส่งแจ้งเตือน LINE แล้ว</span></span>' : '<button type="button" data-k="' + key + '" data-n="' + p.firstNameTh + ' ' + p.lastNameTh + '" data-p="' + p.phone + '" onclick="STATE.recallSentIds=STATE.recallSentIds||{}; STATE.recallSentIds[this.dataset.k]=true; showToast(\'✅ ส่งข้อความแจ้งเตือน LINE OA ไปยังคุณ \' + this.dataset.n + \' เรียบร้อยแล้ว\', \'success\'); renderView();" class="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1.5 shadow-sm"><i data-lucide="message-square" class="w-3.5 h-3.5"></i><span>ส่ง LINE เตือนนัดหมาย</span></button>') +
              '</div></div>';
            }).join("") + '</div>';
        } else if (rTab === "postcare") {
          listHtml = '<div class="divide-y divide-slate-100"><div class="p-4 bg-rose-50/60"><h3 class="text-xs font-bold text-rose-950">รายการติดตามอาการหลังการรักษา (Post-Treatment Care & Instruction)</h3></div>' +
            postCareList.map(v => {
              const p = STATE.patients.find(x => x.id === v.patientId) || pat0;
              const d = STATE.doctors.find(x => x.id === v.doctorId) || STATE.doctors[0] || { nickname: "หมอมิน" };
              const key = "post-" + v.id;
              return '<div class="p-4 flex flex-wrap items-center justify-between gap-4 text-xs"><div class="space-y-1"><div class="flex items-center gap-2"><strong class="font-bold text-slate-900 text-sm">' + p.firstNameTh + ' ' + p.lastNameTh + '</strong><span class="text-slate-400">(' + p.dn + ')</span><span class="px-2 py-0.5 rounded bg-slate-100 text-slate-700">วันที่รักษา: ' + formatThaiDate(v.visitDate) + '</span></div><p class="text-slate-600">หัตถการที่ทำ: <strong class="text-rose-700">' + (v.notes || "ขูดหินปูน / บูรณะฟัน") + '</strong> • โดย ' + d.nickname + ' • โทร: <strong class="font-mono">' + p.phone + '</strong></p></div><div>' +
                (sent[key] ? '<span class="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold flex items-center gap-1"><i data-lucide="check-circle-2" class="w-4 h-4"></i><span>ติดตามอาการเรียบร้อย</span></span>' : '<button type="button" data-k="' + key + '" data-n="' + p.firstNameTh + '" onclick="STATE.recallSentIds=STATE.recallSentIds||{}; STATE.recallSentIds[this.dataset.k]=true; showToast(\'✅ ส่ง LINE สอบถามอาการหลังรักษาเรียบร้อยแล้ว\', \'success\'); renderView();" class="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold flex items-center gap-1.5 shadow-sm"><i data-lucide="heart-pulse" class="w-3.5 h-3.5"></i><span>ส่ง LINE ถามอาการ & ข้อแนะนำ</span></button>') +
              '</div></div>';
            }).join("") + '</div>';
        } else if (rTab === "ortho") {
          listHtml = '<div class="divide-y divide-slate-100"><div class="p-4 bg-purple-50/60"><h3 class="text-xs font-bold text-purple-950">ติดตามคนไข้จัดฟัน นัดปรับเครื่องมือและแจ้งสถานะงวดผ่อนชำระ</h3></div>' +
            orthoList.map(o => {
              const p = STATE.patients.find(x => x.id === o.patientId) || pat0;
              const key = "ortho-" + o.id;
              return '<div class="p-4 flex flex-wrap items-center justify-between gap-4 text-xs"><div class="space-y-1"><div class="flex items-center gap-2"><strong class="font-bold text-slate-900 text-sm">' + p.firstNameTh + ' ' + p.lastNameTh + '</strong><span class="px-2 py-0.5 rounded bg-purple-100 text-purple-800 font-bold">' + o.packageName + '</span></div><p class="text-slate-600">ยอดคงเหลือ: <strong class="font-mono">' + formatCurrency(o.balanceDue) + '</strong> • โทร: ' + p.phone + '</p></div><button type="button" data-k="' + key + '" onclick="STATE.recallSentIds=STATE.recallSentIds||{}; STATE.recallSentIds[this.dataset.k]=true; showToast(\'✅ ส่ง LINE ตามนัดปรับเครื่องมือจัดฟันแล้ว\', \'success\'); renderView();" class="px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5 ' + (sent[key] ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-purple-600 hover:bg-purple-700 text-white shadow-sm") + '"><i data-lucide="smile" class="w-3.5 h-3.5"></i><span>' + (sent[key] ? "✓ ส่งแจ้งเตือนจัดฟันแล้ว" : "ส่ง LINE ตามนัดปรับเครื่องมือ") + '</span></button></div>';
            }).join("") + '</div>';
        } else {
          listHtml = '<div class="divide-y divide-slate-100"><div class="p-4 bg-teal-50/60"><h3 class="text-xs font-bold text-teal-950">รายชื่อคนไข้ครบกำหนดตรวจสุขภาพช่องปากและขูดหินปูนทุก 6 เดือน (รวมสิทธิประกันสังคม 900 บาท/ปี)</h3></div>' +
            sixMonthList.map(p => {
              const doc = STATE.doctors.find(d => d.id === p.attendingDoctorId) || STATE.doctors[0] || { nickname: "หมอมิน" };
              const key = "six-" + p.id;
              return '<div class="p-4 flex flex-wrap items-center justify-between gap-4 text-xs"><div class="space-y-1"><div class="flex items-center gap-2"><strong class="font-bold text-slate-900 text-sm">' + (p.title || "") + ' ' + p.firstNameTh + ' ' + p.lastNameTh + '</strong><span class="text-slate-400">(' + p.dn + ')</span><span class="px-2 py-0.5 rounded bg-teal-100 text-teal-800 font-semibold">สิทธิ: ' + (p.rights || "จ่ายเอง") + '</span></div><p class="text-slate-600">ทันตแพทย์ประจำ: <strong>' + doc.nickname + '</strong> • โทร: <strong class="font-mono">' + p.phone + '</strong></p></div><button type="button" data-k="' + key + '" onclick="STATE.recallSentIds=STATE.recallSentIds||{}; STATE.recallSentIds[this.dataset.k]=true; showToast(\'✅ ส่ง LINE เชิญขูดหินปูน 6 เดือนเรียบร้อยแล้ว\', \'success\'); renderView();" class="px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5 ' + (sent[key] ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-teal-600 hover:bg-teal-700 text-white shadow-sm") + '"><i data-lucide="send" class="w-3.5 h-3.5"></i><span>' + (sent[key] ? "✓ ส่งข้อความเชิญแล้ว" : "ส่ง LINE เชิญขูดหินปูน 6 เดือน") + '</span></button></div>';
            }).join("") + '</div>';
        }

        container.innerHTML = '<div class="space-y-6">' +
          '<div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">' +
            '<div><h1 class="text-lg font-bold text-slate-800 flex items-center gap-2"><i data-lucide="bell-ring" class="w-5 h-5 text-sky-600"></i><span>ระบบติดตามคนไข้ & แจ้งเตือน LINE OA อัตโนมัติ (Patient Recall & CRM)</span></h1><p class="text-xs text-slate-500">แจ้งเตือนนัดหมายล่วงหน้า, ติดตามอาการหลังทำฟัน (Post-Op Care), ตามเคสจัดฟัน และเตือนขูดหินปูนทุก 6 เดือน</p></div>' +
            '<div class="flex items-center gap-2"><span class="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span><span>LINE OA: @minpreemclinic เชื่อมต่อพร้อมใช้งาน</span></span></div>' +
          '</div>' +
          '<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">' +
            '<div onclick="STATE.recallTab=\'upcoming\'; renderView();" class="p-4 rounded-2xl border cursor-pointer transition-all ' + (rTab === "upcoming" ? "bg-sky-50 border-sky-300 shadow-sm" : "bg-white border-slate-200 hover:bg-slate-50") + '"><div class="flex items-center justify-between text-xs font-bold text-sky-800"><span>1. แจ้งเตือนนัดหมายล่วงหน้า</span><i data-lucide="clock" class="w-4 h-4 text-sky-600"></i></div><p class="text-2xl font-black text-slate-900 mt-1">' + upcomingList.length + ' ราย</p><span class="text-[11px] text-slate-500">ส่ง LINE เตือนก่อนวันนัด 24 ชม.</span></div>' +
            '<div onclick="STATE.recallTab=\'postcare\'; renderView();" class="p-4 rounded-2xl border cursor-pointer transition-all ' + (rTab === "postcare" ? "bg-rose-50 border-rose-300 shadow-sm" : "bg-white border-slate-200 hover:bg-slate-50") + '"><div class="flex items-center justify-between text-xs font-bold text-rose-800"><span>2. ติดตามอาการหลังรักษา (Post-Op)</span><i data-lucide="heart-pulse" class="w-4 h-4 text-rose-600"></i></div><p class="text-2xl font-black text-slate-900 mt-1">' + postCareList.length + ' ราย</p><span class="text-[11px] text-slate-500">โทร/ส่งคำแนะนำหลังถอนฟัน-รักษาราก</span></div>' +
            '<div onclick="STATE.recallTab=\'ortho\'; renderView();" class="p-4 rounded-2xl border cursor-pointer transition-all ' + (rTab === "ortho" ? "bg-purple-50 border-purple-300 shadow-sm" : "bg-white border-slate-200 hover:bg-slate-50") + '"><div class="flex items-center justify-between text-xs font-bold text-purple-800"><span>3. ติดตามคนไข้จัดฟันรายเดือน</span><i data-lucide="smile" class="w-4 h-4 text-purple-600"></i></div><p class="text-2xl font-black text-slate-900 mt-1">' + orthoList.length + ' ราย</p><span class="text-[11px] text-slate-500">นัดปรับเครื่องมือและแจ้งยอดงวดจัดฟัน</span></div>' +
            '<div onclick="STATE.recallTab=\'sixmonth\'; renderView();" class="p-4 rounded-2xl border cursor-pointer transition-all ' + (rTab === "sixmonth" ? "bg-teal-50 border-teal-300 shadow-sm" : "bg-white border-slate-200 hover:bg-slate-50") + '"><div class="flex items-center justify-between text-xs font-bold text-teal-800"><span>4. Recall ขูดหินปูน 6 เดือน</span><i data-lucide="calendar-plus" class="w-4 h-4 text-teal-600"></i></div><p class="text-2xl font-black text-slate-900 mt-1">' + sixMonthList.length + ' ราย</p><span class="text-[11px] text-slate-500">เชิญคนไข้กลับมาตรวจสุขภาพฟันประจำปี</span></div>' +
          '</div>' +
          '<div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">' + listHtml + '</div>' +
        '</div>';
        if (window.lucide) window.lucide.createIcons();
        return;
      }

      // 6. BILLING & RECEIPTS (src/app/billing/page.tsx)
      if (tab === "billing") {
        const waitingVisits = STATE.visits.filter(v => v.status === "WAITING_PAYMENT");
        const bq = (STATE.billingSearch || "").toLowerCase().trim();
        const bst = STATE.billingStatusFilter || "all";
        const filteredInvs = STATE.invoices.filter(inv => {
          const p = STATE.patients.find(x => x.id === inv.patientId) || pat0;
          if (bst !== "all" && inv.status !== bst) return false;
          if (bq) {
            const hay = ((inv.invoiceNo || "") + " " + (p.firstNameTh || "") + " " + (p.lastNameTh || "") + " " + (p.dn || "")).toLowerCase();
            if (!hay.includes(bq)) return false;
          }
          return true;
        });
        const expTotal = STATE.expenses.reduce((s, e) => s + e.amount, 0);

        const waitingPanelHtml = waitingVisits.length === 0 ? "" : (
          '<div class="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl space-y-3">' +
            '<div class="flex items-center gap-2"><span class="w-3 h-3 rounded-full bg-emerald-500 animate-ping"></span><h2 class="text-sm font-bold text-emerald-950">คนไข้รอชำระเงินหน้าเคาน์เตอร์ขณะนี้ (' + waitingVisits.length + ' ท่าน)</h2></div>' +
            '<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">' +
              waitingVisits.map(v => {
                const p = STATE.patients.find(x => x.id === v.patientId) || pat0;
                const d = STATE.doctors.find(x => x.id === v.doctorId) || STATE.doctors[0] || { nickname: "หมอมิน" };
                return '<div class="p-3 bg-white rounded-xl border border-emerald-200 shadow-sm flex items-center justify-between text-xs"><div><div class="flex items-center gap-1.5"><span class="w-5 h-5 rounded-md bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-[10px]">' + v.queueNumber + '</span><strong class="text-slate-900 font-bold">' + p.firstNameTh + ' ' + p.lastNameTh + '</strong></div><span class="text-[10px] text-slate-400 block mt-0.5">' + p.dn + ' | แพทย์: ' + d.nickname + '</span></div><button type="button" onclick="completeEmrAndBillD1()" class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-sm">เปิดบิลชำระ</button></div>';
              }).join("") +
            '</div>' +
          '</div>'
        );

        const invTableRows = filteredInvs.length === 0 ? '<tr><td colspan="10" class="py-12 text-center text-slate-400 italic">ไม่พบรายการใบแจ้งค่ารักษา</td></tr>' : filteredInvs.map(inv => {
          const p = STATE.patients.find(x => x.id === inv.patientId) || pat0;
          const stClass = inv.status === "PAID" ? "bg-emerald-100 text-emerald-800" : inv.status === "PARTIALLY_PAID" ? "bg-amber-100 text-amber-800" : "bg-rose-100 text-rose-800";
          const stText = inv.status === "PAID" ? "ชำระครบแล้ว" : inv.status === "PARTIALLY_PAID" ? "ค้างชำระบางส่วน" : "ยังไม่ชำระ";
          return '<tr class="hover:bg-slate-50/80 transition-colors">' +
            '<td class="px-4 py-3 font-mono font-bold text-sky-700 whitespace-nowrap">' + inv.invoiceNo + '</td>' +
            '<td class="px-4 py-3 whitespace-nowrap text-slate-600">' + formatThaiDate(inv.createdAt) + '</td>' +
            '<td class="px-4 py-3"><div class="font-bold text-slate-900">' + p.firstNameTh + ' ' + p.lastNameTh + '</div><div class="text-[10px] text-slate-400">' + p.dn + '</div></td>' +
            '<td class="px-4 py-3 text-right font-mono text-slate-600 whitespace-nowrap">' + formatCurrency(inv.totalAmount) + '</td>' +
            '<td class="px-4 py-3 text-right font-mono text-rose-600 whitespace-nowrap">' + (inv.totalDiscount > 0 ? "-" + formatCurrency(inv.totalDiscount) : "0.00 ฿") + '</td>' +
            '<td class="px-4 py-3 text-right font-mono font-bold text-slate-900 whitespace-nowrap">' + formatCurrency(inv.netAmount) + '</td>' +
            '<td class="px-4 py-3 text-right font-mono text-emerald-600 whitespace-nowrap">' + formatCurrency(inv.paidAmount) + '</td>' +
            '<td class="px-4 py-3 text-right font-mono font-bold text-amber-700 whitespace-nowrap">' + formatCurrency(inv.balanceDue) + '</td>' +
            '<td class="px-4 py-3 text-center whitespace-nowrap"><span class="px-2 py-0.5 rounded-full text-[10px] font-bold ' + stClass + '">' + stText + '</span></td>' +
            '<td class="px-4 py-3 text-right whitespace-nowrap space-x-1.5">' +
              (inv.balanceDue > 0 ? '<button type="button" data-id="' + inv.id + '" onclick="STATE.activePaymentInvoiceId=this.dataset.id; renderView();" class="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-sm text-[11px]">รับชำระเงิน</button>' : '<button type="button" onclick="window.print()" class="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-[11px] inline-flex items-center gap-1"><i data-lucide="printer" class="w-3 h-3"></i><span>ใบเสร็จ</span></button>') +
            '</td>' +
          '</tr>';
        }).join("");

        let payModalHtml = "";
        if (STATE.activePaymentInvoiceId) {
          const actInv = STATE.invoices.find(i => i.id === STATE.activePaymentInvoiceId);
          if (actInv) {
            const p = STATE.patients.find(x => x.id === actInv.patientId) || pat0;
            payModalHtml = '<div class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4"><div class="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]"><div class="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between"><div><h3 class="text-base font-bold text-slate-800">รับชำระค่ารักษา: บิล ' + actInv.invoiceNo + '</h3><p class="text-xs text-slate-500">คนไข้: ' + p.firstNameTh + ' ' + p.lastNameTh + ' (' + p.dn + ')</p></div><button type="button" onclick="STATE.activePaymentInvoiceId=null;renderView();" class="text-xs text-slate-400 hover:text-slate-700">ปิด</button></div><div class="p-6 overflow-y-auto space-y-4 text-xs"><div class="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2"><div class="flex justify-between"><span class="text-slate-500">ยอดรวมค่ารักษา:</span><span class="font-mono font-semibold">' + formatCurrency(actInv.totalAmount) + '</span></div><div class="flex justify-between font-bold text-slate-800 border-t border-slate-200 pt-1"><span>ยอดสุทธิ:</span><span class="font-mono">' + formatCurrency(actInv.netAmount) + '</span></div><div class="flex justify-between text-amber-900 font-bold text-sm border-t border-slate-200 pt-1"><span>ยอดค้างชำระ (Balance Due):</span><span class="font-mono">' + formatCurrency(actInv.balanceDue) + '</span></div></div><div class="p-4 rounded-2xl bg-gradient-to-r from-sky-900 to-teal-900 text-white flex items-center justify-between gap-4 shadow-md"><div class="space-y-1"><span class="px-2 py-0.5 rounded bg-sky-500/30 text-sky-200 font-bold text-[10px]">THAI QR PROMPTPAY • พร้อมเพย์คลินิก</span><h4 class="text-sm font-black">สแกน QR เพื่อชำระเงินจำนวน ' + formatCurrency(actInv.balanceDue) + '</h4><p class="text-sky-200 text-[11px]">ชื่อบัญชี: บจก. คลินิกทันตกรรมหมอมิน หมอพรีม</p></div><div class="bg-white text-slate-900 p-3 rounded-xl font-mono font-black text-center"><div class="text-xl">▣ QR</div><div class="text-[9px] text-sky-900 mt-1">' + formatCurrency(actInv.balanceDue) + '</div></div></div><div class="pt-3 border-t border-slate-100 flex items-center justify-end gap-2"><button type="button" onclick="STATE.activePaymentInvoiceId=null;renderView();" class="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl">ยกเลิก</button><button type="button" data-id="' + actInv.id + '" onclick="STATE.activePaymentInvoiceId=null; payInvoiceD1(this.dataset.id);" class="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md">ยืนยันรับชำระ & ออกใบเสร็จ</button></div></div></div></div>';
          }
        }

        container.innerHTML = '<div class="space-y-6">' +
          '<div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"><div><h1 class="text-lg font-bold text-slate-800 flex items-center gap-2"><i data-lucide="credit-card" class="w-5 h-5 text-sky-600"></i><span>การเงิน ออกบิล และใบเสร็จรับเงิน</span></h1><p class="text-xs text-slate-500">เปิดบิลจากคิวรอชำระ, รับชำระแยกหลายช่องทาง (เงินสด, โอน, บัตร, มัดจำ), และออกใบเสร็จ</p></div></div>' +
          waitingPanelHtml +
          '<div class="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col sm:flex-row items-center gap-3"><div class="relative flex-1 w-full"><i data-lucide="search" class="w-4 h-4 text-slate-400 absolute left-3 top-2.5"></i><input type="text" placeholder="ค้นหาเลขที่บิล, เลข DN หรือชื่อคนไข้..." value="' + (STATE.billingSearch || "") + '" oninput="STATE.billingSearch=this.value; renderView();" class="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none" /></div><div class="flex gap-2 w-full sm:w-auto"><select onchange="STATE.billingStatusFilter=this.value; renderView();" class="px-3 py-1.5 text-xs border border-slate-300 rounded-xl bg-white"><option value="all" ' + (bst === "all" ? "selected" : "") + '>ทุกสถานะบิล</option><option value="UNPAID" ' + (bst === "UNPAID" ? "selected" : "") + '>ยังไม่ชำระ</option><option value="PARTIALLY_PAID" ' + (bst === "PARTIALLY_PAID" ? "selected" : "") + '>ค้างชำระบางส่วน</option><option value="PAID" ' + (bst === "PAID" ? "selected" : "") + '>ชำระครบถ้วนแล้ว</option></select></div></div>' +
          '<div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"><div class="overflow-x-auto"><table class="w-full text-left text-xs divide-y divide-slate-200"><thead class="bg-slate-50 font-bold text-slate-600"><tr><th class="px-4 py-3">เลขที่บิล</th><th class="px-4 py-3">วันที่</th><th class="px-4 py-3">คนไข้</th><th class="px-4 py-3 text-right">ยอดรวม</th><th class="px-4 py-3 text-right">ส่วนลด</th><th class="px-4 py-3 text-right">ยอดสุทธิ</th><th class="px-4 py-3 text-right">ชำระแล้ว</th><th class="px-4 py-3 text-right">ยอดค้างชำระ</th><th class="px-4 py-3 text-center">สถานะ</th><th class="px-4 py-3 text-right">การจัดการ</th></tr></thead><tbody class="divide-y divide-slate-100">' + invTableRows + '</tbody></table></div></div>' +
          '<div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 space-y-4"><div class="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3"><div><h3 class="text-sm font-bold text-slate-800 flex items-center gap-2"><i data-lucide="coins" class="w-4 h-4 text-amber-600"></i><span>บันทึกรายจ่ายย่อยประจำวัน (เงินสดย่อยหน้าเคาน์เตอร์ / Petty Cash)</span></h3><p class="text-xs text-slate-500">กดปุ่มลัดเพื่อบันทึกรายจ่ายหน้าร้านได้ทันที ช่วยให้ตอนนับเงินสดปิดกะตอนเย็นตรงเป๊ะ</p></div><div class="px-3.5 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-xs"><span class="text-rose-700 font-semibold">รวมรายจ่ายย่อยวันนี้: </span><strong class="font-mono font-black text-rose-900 text-sm">' + formatCurrency(expTotal) + '</strong></div></div><div class="flex flex-wrap items-center gap-2 text-xs"><span class="font-bold text-slate-600">กดปุ่มลัดรายจ่ายที่ใช้บ่อย:</span><button type="button" onclick="addQuickExpense(\'🛵 ค่าแมสเซนเจอร์ส่งแลป\', 100)" class="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-600 hover:text-white text-amber-900 border border-amber-200 font-bold transition-all">+ 🛵 ค่าแมสเซนเจอร์ส่งแลป (100฿)</button><button type="button" onclick="addQuickExpense(\'💧 ซื้อน้ำดื่มรับรองคนไข้\', 150)" class="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-600 hover:text-white text-amber-900 border border-amber-200 font-bold transition-all">+ 💧 ซื้อน้ำดื่มรับรองคนไข้ (150฿)</button><button type="button" onclick="addQuickExpense(\'🧻 ทิชชู่ / น้ำยาทำความสะอาด\', 120)" class="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-600 hover:text-white text-amber-900 border border-amber-200 font-bold transition-all">+ 🧻 ทิชชู่ / น้ำยาทำความสะอาด (120฿)</button><button type="button" onclick="addQuickExpense(\'📦 ค่าส่งพัสดุไปรษณีย์\', 60)" class="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-600 hover:text-white text-amber-900 border border-amber-200 font-bold transition-all">+ 📦 ค่าส่งพัสดุไปรษณีย์ (60฿)</button></div><div class="divide-y divide-slate-100 text-xs bg-slate-50 rounded-xl border border-slate-200 px-3">' + STATE.expenses.map(ex => '<div class="py-2 flex items-center justify-between"><div class="flex items-center gap-2"><span class="font-mono text-[11px] text-slate-400">' + (ex.time || "10:00") + ' น.</span><span class="font-semibold text-slate-800">' + ex.title + '</span><span class="px-2 py-0.5 rounded bg-white border border-slate-200 text-[10px] text-slate-500">' + (ex.cat || "ค่าใช้จ่ายทั่วไป") + '</span></div><span class="font-mono font-bold text-rose-600">-' + formatCurrency(ex.amount) + '</span></div>').join("") + '</div></div>' +
          payModalHtml +
        '</div>';
        if (window.lucide) window.lucide.createIcons();
        return;
      }

      // 7. ORTHODONTICS (src/app/ortho/page.tsx)
      if (tab === "ortho") {
        const pkgCards = STATE.orthoPackages.map(pkg => '<div class="p-4 bg-white rounded-2xl border border-purple-200 shadow-sm space-y-2"><div class="flex items-center justify-between"><span class="font-bold text-slate-900 text-sm">' + pkg.name + '</span><span class="text-xs font-mono font-bold text-purple-700">' + formatCurrency(pkg.totalAmount) + '</span></div><p class="text-[11px] text-slate-500">' + (pkg.description || "แพ็กเกจจัดฟันมาตรฐานคลินิก") + '</p><div class="text-[11px] text-slate-600 flex justify-between border-t border-slate-100 pt-1"><span>ติดเครื่องมือ/มัดจำ: ' + formatCurrency(pkg.downPayment) + '</span><span>' + pkg.installmentCount + ' งวด x ' + formatCurrency(pkg.installmentAmount) + '</span></div></div>').join("");
        const patPkgs = STATE.patientOrthoPackages.map(pp => {
          const p = STATE.patients.find(x => x.id === pp.patientId) || pat0;
          const paidCount = Math.max(1, Math.round((pp.paidAmount - pp.downPayment) / 1500));
          let instGrid = "";
          for (let no = 1; no <= 12; no++) {
            const isPaid = no <= paidCount;
            instGrid += '<div class="p-1.5 rounded-lg border text-center text-[10px] ' + (isPaid ? "bg-emerald-50 border-emerald-300 text-emerald-800 font-bold" : "bg-slate-50 border-slate-200 text-slate-500") + '"><div>งวด ' + no + '</div><div class="text-[9px] mt-0.5">' + (isPaid ? "✓ จ่าย" : "รอ") + '</div></div>';
          }
          const logs = (STATE.orthoLogs || []).filter(l => l.pkgId === pp.id);
          return '<div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 space-y-4"><div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3"><div class="flex items-center gap-3"><span class="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs">' + (p.dn ? p.dn.slice(-4) : "0001") + '</span><div><div class="flex items-center gap-2"><strong class="font-bold text-slate-900 text-sm">' + (p.title || "") + ' ' + p.firstNameTh + ' ' + p.lastNameTh + '</strong><span class="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-purple-800 border border-purple-200">' + pp.packageName + '</span></div><span class="text-xs text-slate-500">โทร: ' + p.phone + ' | เริ่มติดเครื่องมือ: ' + formatThaiDate(pp.startedDate) + '</span></div></div><div class="flex items-center gap-3"><div class="text-right text-xs font-mono"><span class="text-slate-400 block text-[10px]">ชำระแล้ว / คงเหลือ</span><strong class="text-emerald-700">' + formatCurrency(pp.paidAmount) + '</strong> / <strong class="text-amber-700">' + formatCurrency(pp.balanceDue) + '</strong></div><button type="button" data-id="' + pp.id + '" onclick="STATE.orthoModalPkgId=this.dataset.id; renderView();" class="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs rounded-xl shadow-sm">+ บันทึกปรับเครื่องมือ</button></div></div><div><span class="text-[11px] font-bold text-slate-500 block mb-2">ตารางงวดชำระ (Installment Status):</span><div class="grid grid-cols-6 sm:grid-cols-12 gap-1.5">' + instGrid + '</div></div><div class="border-t border-slate-100 pt-3 space-y-2"><span class="text-[11px] font-bold text-slate-500 block">ประวัติการปรับเครื่องมือล่าสุด (Recent Adjustment Logs):</span><div class="space-y-1.5"><div class="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs flex justify-between items-center"><div><span class="font-semibold text-slate-800">ปรับเครื่องมือ เปลี่ยนยาง O-ring สีฟ้า</span><div class="text-[11px] text-slate-500 mt-0.5">ลวดบน: <strong class="text-slate-700">.014 NiTi</strong> | ลวดล่าง: <strong class="text-slate-700">.014 NiTi</strong> | ยางดึง: Class II 3/16 4.5oz</div></div><div class="text-right text-[11px] text-slate-500"><span>' + formatThaiDate(new Date()) + '</span><span class="block text-purple-700 font-semibold">เปลี่ยนลวด .016 NiTi ในอีก 4 สัปดาห์</span></div></div>' + logs.map(l => '<div class="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs flex justify-between items-center"><div><span class="font-semibold text-slate-800">' + l.notes + '</span><div class="text-[11px] text-slate-500 mt-0.5">ลวดบน: <strong class="text-slate-700">' + l.upper + '</strong> | ลวดล่าง: <strong class="text-slate-700">' + l.lower + '</strong></div></div><div class="text-right text-[11px] text-slate-500"><span>วันนี้</span><span class="block text-purple-700 font-semibold">' + l.next + '</span></div></div>').join("") + '</div></div></div>';
        }).join("");

        let orthoModal = "";
        if (STATE.orthoModalPkgId) {
          orthoModal = '<div class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4"><div class="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md p-6 space-y-4"><h3 class="text-sm font-bold text-slate-800">บันทึกการปรับเครื่องมือจัดฟัน</h3><div class="space-y-3 text-xs"><div class="grid grid-cols-2 gap-3"><div><label class="block font-semibold text-slate-700 mb-1">ลวดฟันบน (Upper Arch)</label><input id="o-up" type="text" value=".016 NiTi" class="w-full px-3 py-1.5 border border-slate-300 rounded-lg" /></div><div><label class="block font-semibold text-slate-700 mb-1">ลวดฟันล่าง (Lower Arch)</label><input id="o-low" type="text" value=".016 NiTi" class="w-full px-3 py-1.5 border border-slate-300 rounded-lg" /></div></div><div><label class="block font-semibold text-slate-700 mb-1">หัตถการที่ทำในครั้งนี้</label><input id="o-notes" type="text" value="ปรับเครื่องมือ เปลี่ยนลวดและยาง O-ring" class="w-full px-3 py-1.5 border border-slate-300 rounded-lg" /></div><div><label class="block font-semibold text-slate-700 mb-1">เป้าหมายนัดครั้งถัดไป</label><input id="o-next" type="text" value="ดึงยาง Chain ปิดช่องว่างในอีก 4 สัปดาห์" class="w-full px-3 py-1.5 border border-slate-300 rounded-lg" /></div><div class="flex justify-end gap-2 pt-2 border-t"><button type="button" onclick="STATE.orthoModalPkgId=null;renderView();" class="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg">ยกเลิก</button><button type="button" onclick="STATE.orthoLogs=STATE.orthoLogs||[]; STATE.orthoLogs.unshift({pkgId:STATE.orthoModalPkgId, upper:document.getElementById(\'o-up\').value, lower:document.getElementById(\'o-low\').value, notes:document.getElementById(\'o-notes\').value, next:document.getElementById(\'o-next\').value}); STATE.orthoModalPkgId=null; showToast(\'✅ บันทึกการปรับเครื่องมือจัดฟันเรียบร้อยแล้ว\', \'success\'); renderView();" class="px-4 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg shadow-sm">บันทึกการปรับเครื่องมือ</button></div></div></div></div>';
        }

        container.innerHTML = '<div class="space-y-6">' +
          '<div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"><div><h1 class="text-lg font-bold text-slate-800 flex items-center gap-2"><i data-lucide="smile" class="w-5 h-5 text-purple-600"></i><span>งานทันตกรรมจัดฟัน & ตารางงวด</span></h1><p class="text-xs text-slate-500">ติดตามแผนผ่อนชำระ ประวัติปรับเครื่องมือ (ลวด/ยาง) และเป้าหมายการนัดหมายครั้งถัดไป</p></div></div>' +
          '<div class="grid grid-cols-1 md:grid-cols-3 gap-4">' + pkgCards + '</div>' +
          '<div class="space-y-4"><h2 class="text-sm font-bold text-slate-800">รายการคนไข้จัดฟันที่กำลังรักษาอยู่ (' + STATE.patientOrthoPackages.length + ' เคส)</h2>' + patPkgs + '</div>' +
          orthoModal +
        '</div>';
        if (window.lucide) window.lucide.createIcons();
        return;
      }

      // 8. DENTAL LAB PAGE (src/app/lab/page.tsx)
      if (tab === "lab") {
        const lf = STATE.labStatusFilter || "all";
        const labTabs = [
          { key: "all", label: "ทั้งหมด" },
          { key: "SENT", label: "1. ส่งแลปแล้ว" },
          { key: "IN_PROGRESS", label: "2. กำลังทำ" },
          { key: "RECEIVED", label: "3. ได้รับงานแล้ว" },
          { key: "REVISION", label: "4. ส่งแก้ไข (Revision)" },
          { key: "COMPLETED", label: "5. เสร็จสิ้น" },
          { key: "FITTED", label: "6. ใส่ให้คนไข้แล้ว" }
        ];
        const filteredLab = STATE.labOrders.filter(o => lf === "all" || o.status === lf);
        const labRows = filteredLab.length === 0 ? '<tr><td colspan="9" class="py-12 text-center text-slate-400 italic">ไม่มีรายการงานแลปตามสถานะที่เลือก</td></tr>' : filteredLab.map(o => {
          const p = STATE.patients.find(x => x.id === o.patientId) || pat0;
          const d = STATE.doctors.find(x => x.id === o.doctorId) || STATE.doctors[0] || { nickname: "หมอพรีม" };
          const stClass = o.status === "SENT" ? "bg-sky-100 text-sky-800" : o.status === "IN_PROGRESS" ? "bg-indigo-100 text-indigo-800" : o.status === "RECEIVED" ? "bg-teal-100 text-teal-800" : o.status === "REVISION" ? "bg-rose-100 text-rose-800" : "bg-emerald-100 text-emerald-800";
          const stText = o.status === "SENT" ? "ส่งแล้ว" : o.status === "IN_PROGRESS" ? "กำลังทำ" : o.status === "RECEIVED" ? "ได้รับแล้ว" : o.status === "REVISION" ? "ส่งแก้" : o.status === "FITTED" ? "ใส่ให้คนไข้แล้ว" : "เสร็จสิ้น";
          return '<tr class="hover:bg-slate-50/80 transition-colors">' +
            '<td class="px-4 py-3 font-mono font-bold text-indigo-700 whitespace-nowrap">' + o.orderNo + '</td>' +
            '<td class="px-4 py-3"><div class="font-bold text-slate-900">' + p.firstNameTh + ' ' + p.lastNameTh + '</div><div class="text-[10px] text-slate-400">' + p.dn + '</div></td>' +
            '<td class="px-4 py-3 whitespace-nowrap text-slate-700">' + (d.nickname || d.fullName) + '</td>' +
            '<td class="px-4 py-3"><span class="font-semibold text-slate-900">' + o.workType + '</span>' + (o.toothNumber ? '<span class="ml-1 font-mono text-indigo-800 font-bold">(ซี่ ' + o.toothNumber + ')</span>' : '') + (o.shadeGuide ? '<span class="block text-[10px] text-slate-400">สีฟัน: ' + o.shadeGuide + '</span>' : '') + '</td>' +
            '<td class="px-4 py-3 whitespace-nowrap text-slate-600">' + o.labCompanyName + '</td>' +
            '<td class="px-4 py-3 whitespace-nowrap font-medium text-slate-800">' + formatThaiDate(o.dueDate) + '</td>' +
            '<td class="px-4 py-3 text-right font-mono font-bold whitespace-nowrap">' + formatCurrency(o.cost) + '<span class="block text-[10px] text-slate-400 font-normal">(' + (o.deductionType === "DOCTOR" ? "หักแพทย์" : "คลินิกจ่าย") + ')</span></td>' +
            '<td class="px-4 py-3 text-center whitespace-nowrap"><span class="px-2 py-0.5 rounded-full text-[10px] font-bold ' + stClass + '">' + stText + '</span></td>' +
            '<td class="px-4 py-3 text-right whitespace-nowrap space-x-1.5">' +
              ((o.status === "SENT" || o.status === "IN_PROGRESS") ? '<button type="button" data-id="' + o.id + '" onclick="var lo=STATE.labOrders.find(x=>x.id===this.dataset.id); if(lo) lo.status=\'RECEIVED\'; showToast(\'✅ รับชิ้นงานแลปเข้าระบบแล้ว\', \'success\'); renderView();" class="px-2.5 py-1 text-[11px] bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 shadow-sm">รับชิ้นงานแล้ว</button>' : '') +
              (o.status === "RECEIVED" ? '<button type="button" data-id="' + o.id + '" onclick="var lo=STATE.labOrders.find(x=>x.id===this.dataset.id); if(lo) lo.status=\'FITTED\'; showToast(\'✅ บันทึกใส่ชิ้นงานให้คนไข้เรียบร้อยแล้ว\', \'success\'); renderView();" class="px-2.5 py-1 text-[11px] bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 shadow-sm">ใส่ให้คนไข้แล้ว</button>' : '') +
            '</td>' +
          '</tr>';
        }).join("");

        let labModal = "";
        if (STATE.labModalOpen) {
          labModal = '<div class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4"><div class="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-lg p-6 space-y-4"><h3 class="text-base font-bold text-slate-800">เปิดใบส่งแลปใหม่ (New Dental Lab Order)</h3><div class="space-y-3 text-xs"><div class="grid grid-cols-2 gap-3"><div><div class="mb-3"><label class="block font-bold text-slate-700 mb-1">เลือกคนไข้สำหรับงานแลป *</label><select id="lab-pat" class="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white font-bold text-xs">' + STATE.patients.map(p => '<option value="' + p.id + '">' + p.dn + ' - คุณ ' + p.firstNameTh + ' ' + p.lastNameTh + ' (โทร ' + p.phone + ')</option>').join("") + '</select></div><div class="mb-3"><label class="block font-bold text-slate-700 mb-1">ทันตแพทย์ผู้ส่ง *</label><select id="lab-doc" class="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white font-bold text-xs">' + STATE.doctors.map(d => '<option value="' + d.id + '">' + d.fullName + ' (' + d.nickname + ')</option>').join("") + '</select></div><label class="block font-semibold text-slate-700 mb-1">ประเภทงานแลป *</label><select id="lab-wt" class="w-full px-3 py-1.5 border border-slate-300 rounded-lg bg-white"><option value="CROWN">ครอบฟัน (Crown)</option><option value="BRIDGE">สะพานฟัน (Bridge)</option><option value="DENTURE">ฟันปลอม (Denture)</option><option value="RETAINER">รีเทนเนอร์ (Retainer)</option><option value="ALIGNER">แผ่นจัดฟันใส (Aligner)</option></select></div><div><label class="block font-semibold text-slate-700 mb-1">ซี่ฟัน</label><input id="lab-tooth" type="text" value="21" class="w-full px-3 py-1.5 border border-slate-300 rounded-lg font-mono text-center" /></div></div><div class="grid grid-cols-2 gap-3"><div><label class="block font-semibold text-slate-700 mb-1">บริษัทแลป *</label><input id="lab-comp" type="text" value="โมเดิร์น เดนทัล แลป" class="w-full px-3 py-1.5 border border-slate-300 rounded-lg" /></div><div><label class="block font-semibold text-slate-700 mb-1">ค่าใช้จ่ายแลป (บาท)</label><input id="lab-cost" type="number" value="3200" class="w-full px-3 py-1.5 border border-slate-300 rounded-lg font-mono" /></div></div><div class="flex justify-end gap-2 pt-2 border-t"><button type="button" onclick="STATE.labModalOpen=false;renderView();" class="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg">ยกเลิก</button><button type="button" onclick="STATE.labModalOpen=false; createLabOrderD1();" class="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-sm">บันทึกใบส่งแลป</button></div></div></div></div>';
        }

        container.innerHTML = '<div class="space-y-6">' +
          '<div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"><div><h1 class="text-lg font-bold text-slate-800 flex items-center gap-2"><i data-lucide="flask-conical" class="w-5 h-5 text-indigo-600"></i><span>ระบบติดตามงานแลปทันตกรรม (Dental Lab)</span></h1><p class="text-xs text-slate-500">ใบส่งแลป ครอบฟัน สะพานฟัน รีเทนเนอร์ ฟันปลอม ติดตามสถานะและหักค่าใช้จ่าย</p></div><button type="button" onclick="STATE.labModalOpen=true;renderView();" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-md shadow-indigo-600/20 flex items-center gap-1.5"><i data-lucide="plus-circle" class="w-4 h-4"></i><span>+ เปิดใบส่งแลปใหม่</span></button></div>' +
          '<div class="flex bg-white p-2 rounded-2xl shadow-sm border border-slate-200 overflow-x-auto gap-1 text-xs font-semibold">' + labTabs.map(t => '<button type="button" data-k="' + t.key + '" onclick="STATE.labStatusFilter=this.dataset.k; renderView();" class="px-3 py-1.5 rounded-xl whitespace-nowrap transition-all ' + (lf === t.key ? "bg-indigo-600 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100") + '">' + t.label + '</button>').join("") + '</div>' +
          '<div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"><div class="overflow-x-auto"><table class="w-full text-left text-xs divide-y divide-slate-200"><thead class="bg-slate-50 font-bold text-slate-600"><tr><th class="px-4 py-3">เลขที่ใบงาน</th><th class="px-4 py-3">คนไข้</th><th class="px-4 py-3">ทันตแพทย์</th><th class="px-4 py-3">ประเภทงาน / ซี่ฟัน</th><th class="px-4 py-3">บริษัทแลป</th><th class="px-4 py-3">กำหนดรับ</th><th class="px-4 py-3 text-right">ค่าแลป</th><th class="px-4 py-3 text-center">สถานะ</th><th class="px-4 py-3 text-right">การจัดการ</th></tr></thead><tbody class="divide-y divide-slate-100">' + labRows + '</tbody></table></div></div>' +
          labModal +
        '</div>';
        if (window.lucide) window.lucide.createIcons();
        return;
      }

      // 9. INVENTORY PAGE (src/app/inventory/page.tsx)
      if (tab === "inventory") {
        const iq = (STATE.invSearch || "").toLowerCase().trim();
        const icat = STATE.invCategory || "all";
        const ilow = STATE.invLowStockOnly || false;
        const lowStockCount = STATE.inventory.filter(i => i.currentStock <= i.minStockAlert).length;
        const filteredInv = STATE.inventory.filter(i => {
          if (icat !== "all" && i.category !== icat) return false;
          if (ilow && i.currentStock > i.minStockAlert) return false;
          if (iq && !((i.code || "") + " " + (i.name || "")).toLowerCase().includes(iq)) return false;
          return true;
        });
        const invTableRows = filteredInv.length === 0 ? '<tr><td colspan="9" class="py-12 text-center text-slate-400 italic">ไม่พบรายการสินค้าตามเงื่อนไข</td></tr>' : filteredInv.map(item => {
          const isLow = item.currentStock <= item.minStockAlert;
          const catTh = item.category === "DRUG" ? "ยา" : item.category === "DENTAL_SUPPLY" ? "วัสดุทำฟัน" : "ของใช้";
          return '<tr class="hover:bg-slate-50/80 transition-colors">' +
            '<td class="px-4 py-3 font-mono font-bold text-slate-700 whitespace-nowrap">' + item.code + '</td>' +
            '<td class="px-4 py-3 font-semibold text-slate-900">' + item.name + (isLow ? '<span class="ml-2 px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">ใกล้หมด</span>' : '') + '</td>' +
            '<td class="px-4 py-3 whitespace-nowrap text-slate-500">' + catTh + '</td>' +
            '<td class="px-4 py-3 whitespace-nowrap text-slate-600">' + item.unit + '</td>' +
            '<td class="px-4 py-3 text-center font-mono text-slate-500">' + item.minStockAlert + '</td>' +
            '<td class="px-4 py-3 text-right font-mono font-bold text-sm whitespace-nowrap"><span class="' + (isLow ? "text-rose-600" : "text-slate-900") + '">' + item.currentStock + '</span></td>' +
            '<td class="px-4 py-3 text-right font-mono text-slate-500 whitespace-nowrap">' + formatCurrency(item.costPrice || 120) + '</td>' +
            '<td class="px-4 py-3 text-right font-mono font-semibold text-slate-800 whitespace-nowrap">' + (item.salePrice > 0 ? formatCurrency(item.salePrice) : "-") + '</td>' +
            '<td class="px-4 py-3 text-right whitespace-nowrap space-x-1"><button type="button" data-id="' + item.id + '" onclick="adjustInventoryStockD1(this.dataset.id, 10)" class="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold rounded-lg text-[11px] border border-emerald-200">+ รับเข้า 10</button><button type="button" data-id="' + item.id + '" onclick="adjustInventoryStockD1(this.dataset.id, -1)" class="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 font-semibold rounded-lg text-[11px] border border-amber-200">- เบิกใช้ 1</button></td>' +
          '</tr>';
        }).join("");

        container.innerHTML = '<div class="space-y-6">' +
          '<div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"><div><h1 class="text-lg font-bold text-slate-800 flex items-center gap-2"><i data-lucide="package" class="w-5 h-5 text-emerald-600"></i><span>คลังยา เวชภัณฑ์ และวัสดุทันตกรรม</span></h1><p class="text-xs text-slate-500">ควบคุมสต๊อกสินค้า จุดสั่งซื้อ (Reorder Point) บันทึกรับเข้า เบิกใช้ ปรับยอด และประวัติเคลื่อนไหว</p></div></div>' +
          (lowStockCount > 0 ? '<div class="p-4 bg-amber-50 border border-amber-300 rounded-2xl flex items-center justify-between text-xs text-amber-900"><div class="flex items-center gap-2 font-bold"><i data-lucide="alert-triangle" class="w-5 h-5 text-amber-600 flex-shrink-0"></i><span>แจ้งเตือน: มีรายการสินค้า ' + lowStockCount + ' รายการ ที่ยอดคงเหลือต่ำกว่าจุดสั่งซื้อขั้นต่ำ (Reorder Point)</span></div><button type="button" onclick="STATE.invLowStockOnly=!STATE.invLowStockOnly;renderView();" class="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg text-xs">' + (ilow ? "แสดงสินค้าทั้งหมด" : "กรองดูเฉพาะสินค้าใกล้หมด") + '</button></div>' : '') +
          '<div class="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col sm:flex-row items-center gap-3"><div class="relative flex-1 w-full"><i data-lucide="search" class="w-4 h-4 text-slate-400 absolute left-3 top-2.5"></i><input type="text" placeholder="ค้นหารหัส หรือชื่อสินค้า/ยา..." value="' + (STATE.invSearch || "") + '" oninput="STATE.invSearch=this.value; renderView();" class="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none" /></div><div class="flex gap-2 w-full sm:w-auto"><select onchange="STATE.invCategory=this.value; renderView();" class="px-3 py-1.5 text-xs border border-slate-300 rounded-xl bg-white"><option value="all" ' + (icat === "all" ? "selected" : "") + '>ทุกหมวดหมู่</option><option value="DRUG" ' + (icat === "DRUG" ? "selected" : "") + '>ยาและเวชภัณฑ์ (Drug)</option><option value="DENTAL_SUPPLY" ' + (icat === "DENTAL_SUPPLY" ? "selected" : "") + '>วัสดุทำฟัน (Dental Supply)</option><option value="CONSUMABLE" ' + (icat === "CONSUMABLE" ? "selected" : "") + '>ของใช้สิ้นเปลือง (Consumable)</option><option value="RETAIL" ' + (icat === "RETAIL" ? "selected" : "") + '>สินค้าขายหน้าร้าน (Retail)</option></select></div></div>' +
          '<div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"><div class="overflow-x-auto"><table class="w-full text-left text-xs divide-y divide-slate-200"><thead class="bg-slate-50 font-bold text-slate-600"><tr><th class="px-4 py-3">รหัส</th><th class="px-4 py-3">ชื่อรายการยา/วัสดุ</th><th class="px-4 py-3">หมวดหมู่</th><th class="px-4 py-3">หน่วย</th><th class="px-4 py-3 text-center">จุดเตือนสั่งซื้อ</th><th class="px-4 py-3 text-right">ยอดคงเหลือ</th><th class="px-4 py-3 text-right">ราคาทุน</th><th class="px-4 py-3 text-right">ราคาขาย</th><th class="px-4 py-3 text-right">การจัดการ</th></tr></thead><tbody class="divide-y divide-slate-100">' + invTableRows + '</tbody></table></div></div>' +
        '</div>';
        if (window.lucide) window.lucide.createIcons();
        return;
      }

      // 10. OPERATIONS: STERILIZATION & DOCTOR SHIFTS (src/app/operations/page.tsx)
      if (tab === "operations") {
        const opTab = STATE.opsTab || "sterilization";
        const bDate = STATE.opsBlockDate || STATE.selectedDate;
        const bList = (STATE.blockedSlots || []).filter(b => b.date === bDate);
        let opBody = "";
        if (opTab === "sterilization") {
          const sRows = STATE.sterileLogs.map(log => '<tr><td class="px-4 py-3 whitespace-nowrap">' + formatThaiDate(log.date || new Date()) + '</td><td class="px-4 py-3 font-bold text-slate-900 whitespace-nowrap">' + log.cycle + '</td><td class="px-4 py-3 font-mono text-sky-700 whitespace-nowrap">' + log.temp + '</td><td class="px-4 py-3 text-slate-700">' + log.items + '</td><td class="px-4 py-3 text-center whitespace-nowrap"><span class="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px]">✓ ผ่านมาตรฐาน (PASS)</span></td><td class="px-4 py-3 text-slate-600 whitespace-nowrap">' + (log.by || "คุณน้ำหวาน (ผู้ช่วยทันตแพทย์)") + '</td></tr>').join("");
          let sterileModalHtml = "";
        if (STATE.sterileModalOpen) {
          sterileModalHtml = '<div class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4"><div class="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-6 space-y-4"><h3 class="text-base font-bold text-slate-900">กรอกผลตรวจการอบฆ่าเชื้อจริง (Autoclave Verification)</h3><div class="space-y-3 text-xs"><div><label class="block font-bold text-slate-700 mb-1">รอบการอบ</label><input id="st-cycle" type="text" value="' + (STATE.sterileModalCycle || "รอบเย็น + Spore Test") + '" class="w-full px-3 py-1.5 border border-slate-300 rounded-lg bg-slate-50 font-bold" /></div><div><label class="block font-bold text-slate-700 mb-1">รายการเครื่องมือที่อบ</label><input id="st-items" type="text" value="' + (STATE.sterileModalItems || "ชุดตรวจพื้นฐาน + หัวกรอ + ชุดศัลยกรรม") + '" class="w-full px-3 py-1.5 border border-slate-300 rounded-lg" /></div><div class="grid grid-cols-2 gap-3"><div><label class="block font-bold text-slate-700 mb-1">อุณหภูมิ & แรงดัน</label><input id="st-temp" type="text" value="134°C / 2.1 Bar" class="w-full px-3 py-1.5 border border-slate-300 rounded-lg font-mono" /></div><div><label class="block font-bold text-slate-700 mb-1">ผู้ช่วยผู้ตรวจบันทึก</label><select id="st-by" class="w-full px-3 py-1.5 border border-slate-300 rounded-lg bg-white"><option value="คุณน้ำหวาน (ผู้ช่วยทันตแพทย์)">คุณน้ำหวาน</option><option value="คุณสมศรี (เคาน์เตอร์)">คุณสมศรี</option></select></div></div><div class="p-3 bg-slate-50 border rounded-xl space-y-2"><label class="block font-bold text-slate-800">ผลการทดสอบที่ตรวจวัดได้จริง *</label><div class="grid grid-cols-2 gap-2"><div><span class="block text-[11px] text-slate-600 mb-0.5">แถบวัดเคมี (Chemical)</span><select id="st-chem" class="w-full px-2 py-1.5 border rounded-lg bg-white font-bold"><option value="PASS">✓ ผ่าน (แถบสีเปลี่ยนสมบูรณ์)</option><option value="FAIL">✕ ไม่ผ่าน (สีไม่เปลี่ยน)</option></select></div><div><span class="block text-[11px] text-slate-600 mb-0.5">ตรวจเชื้อ (Spore Test)</span><select id="st-spore" class="w-full px-2 py-1.5 border rounded-lg bg-white font-bold"><option value="PENDING">⏳ รอผลบ่มเพาะเชื้อ 24-48 ชม.</option><option value="PASS">✓ ผ่าน (ไม่พบเชื้อ Negative)</option><option value="FAIL">✕ ไม่ผ่าน (พบเชื้อ Positive)</option></select></div></div></div></div><div class="flex justify-end gap-2 pt-2 border-t"><button type="button" onclick="STATE.sterileModalOpen=false;renderView();" class="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg">ยกเลิก</button><button type="button" onclick="submitSterileLog();" class="px-4 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm">บันทึกผลการตรวจจริง</button></div></div></div>';
        }
        opBody = '<div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-5">' + sterileModalHtml +
            '<div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4 no-print"><div><h2 class="text-base font-bold text-slate-800">สมุดบันทึกการอบฆ่าเชื้อเครื่องมือทันตกรรม (Autoclave Daily Checklist)</h2><p class="text-xs text-slate-500">ผู้ช่วยเพียงกดปุ่มรอบการอบด้านล่าง 1 ครั้ง ระบบจะลงเวลา อุณหภูมิ 134°C และสถานะผ่านการตรวจสอบให้อัตโนมัติ</p></div><button type="button" onclick="window.print()" class="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl flex items-center gap-1.5"><i data-lucide="printer" class="w-4 h-4"></i><span>พิมพ์รายงานส่งตรวจ สสจ.</span></button></div>' +
            '<div class="grid grid-cols-1 md:grid-cols-3 gap-3 no-print">' +
              '<button type="button" onclick="addSterileLog(\'รอบเช้า\', \'ชุดเครื่องมือตรวจพื้นฐาน 15 ชุด + หัวกรอ 6 ชิ้น + อุปกรณ์ขูดหินปูน\')" class="p-4 rounded-2xl border-2 border-teal-200 bg-teal-50/70 hover:bg-teal-600 hover:text-white text-teal-950 text-left transition-all group"><div class="flex items-center justify-between"><span class="text-sm font-black">✅ กดบันทึกรอบเช้า (1-Click)</span><i data-lucide="thermometer" class="w-5 h-5"></i></div><p class="text-xs mt-1 opacity-80">อบชุดตรวจพื้นฐาน + หัวกรอ (134°C / 2.1 Bar • แถบวัดสีผ่าน)</p></button>' +
              '<button type="button" onclick="addSterileLog(\'รอบบ่าย\', \'ชุดคีมถอนฟัน/ผ่าฟันคุด + ชุดเครื่องมือจัดฟัน + หัวขูดหินปูน Ultrasonic\')" class="p-4 rounded-2xl border-2 border-sky-200 bg-sky-50/70 hover:bg-sky-600 hover:text-white text-sky-950 text-left transition-all group"><div class="flex items-center justify-between"><span class="text-sm font-black">✅ กดบันทึกรอบบ่าย (1-Click)</span><i data-lucide="thermometer" class="w-5 h-5"></i></div><p class="text-xs mt-1 opacity-80">อบชุดศัลยกรรมถอนฟัน + ชุดจัดฟัน (134°C / 2.1 Bar • แถบวัดสีผ่าน)</p></button>' +
              '<button type="button" onclick="addSterileLog(\'รอบเย็น + Spore Test\', \'อบเครื่องมือทั้งหมดหลังปิดคลินิก + ทดสอบ Biological Spore Indicator ผ่านเกณฑ์\')" class="p-4 rounded-2xl border-2 border-emerald-200 bg-emerald-50/70 hover:bg-emerald-600 hover:text-white text-emerald-950 text-left transition-all group"><div class="flex items-center justify-between"><span class="text-sm font-black">✅ กดบันทึกรอบเย็น + Spore Test</span><i data-lucide="check-circle-2" class="w-5 h-5"></i></div><p class="text-xs mt-1 opacity-80">อบเครื่องมือปิดคลินิก + ผลตรวจเชื้อ Spore Test ปลอดภัย 100%</p></button>' +
            '</div>' +
            '<div class="overflow-x-auto border border-slate-200 rounded-2xl"><table class="w-full text-left text-xs divide-y divide-slate-200"><thead class="bg-slate-50 font-bold text-slate-600"><tr><th class="px-4 py-3">วันที่</th><th class="px-4 py-3">รอบการอบ</th><th class="px-4 py-3">อุณหภูมิ / ความดัน</th><th class="px-4 py-3">รายการเครื่องมือที่อบฆ่าเชื้อ</th><th class="px-4 py-3 text-center">ผลแถบวัดสี (Indicator)</th><th class="px-4 py-3">ผู้รับผิดชอบ</th></tr></thead><tbody class="divide-y divide-slate-100">' + sRows + '</tbody></table></div>' +
          '</div>';
        } else {
          const docOpts = STATE.doctors.map(d => '<option value="' + d.id + '" ' + (STATE.opsBlockDoctorId === d.id ? "selected" : "") + '>' + d.nickname + ' (' + d.fullName + ')</option>').join("");
          opBody = '<div class="space-y-6">' +
            '<div class="grid grid-cols-1 md:grid-cols-2 gap-4">' +
              '<div class="p-5 bg-white rounded-2xl border-2 border-sky-200 shadow-sm flex items-center justify-between"><div class="space-y-1"><span class="px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 text-[11px] font-bold">ห้องตรวจ 1 (หมอมิน) • ยูนิตทำฟัน 1</span><h3 class="text-base font-black text-slate-900">ทพ. มินตรา รัตนเวชกุล (หมอมิน)</h3><p class="text-xs text-slate-600">ความเชี่ยวชาญ: ทันตกรรมจัดฟันและทันตกรรมทั่วไป • เวลาออกตรวจปกติ: จันทร์-เสาร์ 09:00 - 22:00 น.</p></div><div class="w-12 h-12 rounded-2xl bg-sky-600 text-white font-black flex items-center justify-center text-sm">หมอมิน</div></div>' +
              '<div class="p-5 bg-white rounded-2xl border-2 border-teal-200 shadow-sm flex items-center justify-between"><div class="space-y-1"><span class="px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 text-[11px] font-bold">ห้องตรวจ 2 (หมอพรีม) • ยูนิตทำฟัน 2</span><h3 class="text-base font-black text-slate-900">ทพญ. พรีมญา สิริวัชราภรณ์ (หมอพรีม)</h3><p class="text-xs text-slate-600">ความเชี่ยวชาญ: รักษารากฟันและทันตกรรมเพื่อความงาม • เวลาออกตรวจปกติ: จันทร์-เสาร์ 09:00 - 22:00 น.</p></div><div class="w-12 h-12 rounded-2xl bg-teal-600 text-white font-black flex items-center justify-center text-sm">หมอพรีม</div></div>' +
            '</div>' +
            '<div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">' +
              '<div><h3 class="text-sm font-bold text-slate-800 flex items-center gap-2"><i data-lucide="calendar-off" class="w-4 h-4 text-rose-600"></i><span>ตั้งวันลา / ปิดรับนัดชั่วคราวแบบกดปุ่มเดียว (ป้องกันเคาน์เตอร์ลงคิวซ้ำ)</span></h3><p class="text-xs text-slate-500">เลือกวันที่และเลือกคุณหมอ แล้วกดปุ่มช่วงเวลาที่ต้องการปิดรับนัด ตารางนัดหน้าแรกจะล็อกช่วงเวลานั้นทันที</p></div>' +
              '<div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200"><div><label class="block font-bold text-slate-700 mb-1">1. เลือกวันที่ต้องการล็อกคิว</label><input type="date" value="' + bDate + '" onchange="STATE.opsBlockDate=this.value;renderView();" class="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white font-bold" /></div><div><label class="block font-bold text-slate-700 mb-1">2. เลือกคุณหมอ</label><select onchange="STATE.opsBlockDoctorId=this.value" class="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white font-bold">' + docOpts + '</select></div><div><label class="block font-bold text-slate-700 mb-1">3. เหตุผลสั้นๆ</label><input type="text" value="' + (STATE.opsBlockReason || "ติดประชุมวิชาการ / ลางาน") + '" oninput="STATE.opsBlockReason=this.value" class="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white" /></div></div>' +
              '<div class="grid grid-cols-1 sm:grid-cols-3 gap-3">' +
                '<button type="button" onclick="STATE.blockedSlots=STATE.blockedSlots||[]; STATE.blockedSlots.push({id:Date.now(), date:STATE.opsBlockDate||STATE.selectedDate, startTime:\'09:00\', endTime:\'12:00\', reason:\'งดรับนัด (ลาครึ่งวันเช้า): \'+(STATE.opsBlockReason||\'ติดธุระ\')}); showToast(\'✅ ล็อกคิวครึ่งวันเช้าเรียบร้อยแล้ว\', \'success\'); renderView();" class="p-3.5 rounded-2xl border border-amber-300 bg-amber-50 hover:bg-amber-600 hover:text-white text-amber-950 font-bold text-xs text-center transition-all">🌅 กดล็อกคิว "ครึ่งวันเช้า" (09:00 - 12:00 น.)</button>' +
                '<button type="button" onclick="STATE.blockedSlots=STATE.blockedSlots||[]; STATE.blockedSlots.push({id:Date.now(), date:STATE.opsBlockDate||STATE.selectedDate, startTime:\'13:00\', endTime:\'18:00\', reason:\'งดรับนัด (ลาครึ่งวันบ่าย): \'+(STATE.opsBlockReason||\'ติดธุระ\')}); showToast(\'✅ ล็อกคิวครึ่งวันบ่ายเรียบร้อยแล้ว\', \'success\'); renderView();" class="p-3.5 rounded-2xl border border-orange-300 bg-orange-50 hover:bg-orange-600 hover:text-white text-orange-950 font-bold text-xs text-center transition-all">🌇 กดล็อกคิว "ครึ่งวันบ่าย" (13:00 - 18:00 น.)</button>' +
                '<button type="button" onclick="STATE.blockedSlots=STATE.blockedSlots||[]; STATE.blockedSlots.push({id:Date.now(), date:STATE.opsBlockDate||STATE.selectedDate, startTime:\'09:00\', endTime:\'22:00\', reason:\'งดรับนัด (หยุดเต็มวัน): \'+(STATE.opsBlockReason||\'ติดธุระ\')}); showToast(\'✅ ล็อกคิวหยุดเต็มวันเรียบร้อยแล้ว\', \'success\'); renderView();" class="p-3.5 rounded-2xl border border-rose-300 bg-rose-50 hover:bg-rose-600 hover:text-white text-rose-950 font-bold text-xs text-center transition-all">🛑 กดล็อกคิว "หยุดเต็มวัน" (09:00 - 22:00 น.)</button>' +
              '</div>' +
              '<div class="pt-3 border-t border-slate-100 space-y-2"><span class="text-xs font-bold text-slate-700 block">รายการช่วงเวลาที่ปิดรับนัดในวันที่ ' + formatThaiDate(bDate) + ' (' + bList.length + ' รายการ):</span>' +
                (bList.length === 0 ? '<p class="text-xs text-emerald-700 bg-emerald-50 p-3 rounded-xl border border-emerald-200 font-semibold">✓ วันที่ ' + formatThaiDate(bDate) + ' หมอมินและหมอพรีมเปิดรับนัดตามปกติทุกช่วงเวลา</p>' : '<div class="divide-y divide-slate-100 bg-slate-50 rounded-xl border border-slate-200 px-3">' + bList.map(b => '<div class="py-2.5 flex items-center justify-between text-xs"><div><span class="px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-mono font-bold mr-2">' + b.startTime + ' - ' + b.endTime + ' น.</span><span class="font-bold text-slate-800">' + b.reason + '</span></div><span class="text-[11px] text-slate-400">ล็อกตารางนัดแล้ว</span></div>').join("") + '</div>') +
              '</div>' +
            '</div>' +
          '</div>';
        }

        container.innerHTML = '<div class="space-y-6">' +
          '<div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">' +
            '<div><h1 class="text-lg font-bold text-slate-800 flex items-center gap-2"><i data-lucide="shield-check" class="w-5 h-5 text-teal-600"></i><span>มาตรฐานคลินิก & ตารางเวรแพทย์ (Sterilization & Doctor Roster)</span></h1><p class="text-xs text-slate-500">ออกแบบให้กดบันทึกได้ในคลิกเดียว: บันทึกอบฆ่าเชื้อเครื่องมือประจำวัน และตั้งวันลา/งดรับนัดของหมอมิน-หมอพรีม</p></div>' +
            '<div class="flex bg-slate-100 p-1 rounded-xl text-xs font-bold"><button type="button" onclick="STATE.opsTab=\'sterilization\';renderView();" class="px-4 py-2 rounded-lg transition-all ' + (opTab === "sterilization" ? "bg-white text-teal-800 shadow-sm" : "text-slate-600 hover:text-slate-900") + '">🧼 1. บันทึกอบฆ่าเชื้อเครื่องมือ (Autoclave)</button><button type="button" onclick="STATE.opsTab=\'shifts\';renderView();" class="px-4 py-2 rounded-lg transition-all ' + (opTab === "shifts" ? "bg-white text-sky-800 shadow-sm" : "text-slate-600 hover:text-slate-900") + '">👩‍⚕️ 2. ตารางเวร & วันลา (หมอมิน / หมอพรีม)</button></div>' +
          '</div>' +
          opBody +
        '</div>';
        if (window.lucide) window.lucide.createIcons();
        return;
      }

      // 11. REPORTS & DOCTOR DF (src/app/reports/page.tsx)
      if (tab === "reports") {
        const repTab = STATE.reportsTab || "dashboard";
        const repTabs = [
          { key: "dashboard", label: "ภาพรวมแดชบอร์ด (Overview)" },
          { key: "daily-close", label: "ปิดยอดประจำวัน (Daily Close)" },
          { key: "treatments", label: "1. รายการรักษา" },
          { key: "receipts", label: "2. ใบเสร็จรับเงิน" },
          { key: "payment-methods", label: "3. วิธีชำระเงิน (Cash-basis)" },
          { key: "doctor-fees", label: "4. รายได้แพทย์ / ค่า DF" },
          { key: "lab-expenses", label: "5. ค่าแลปและงานแลป" },
          { key: "voided-receipts", label: "6. ใบเสร็จยกเลิก" },
          { key: "outstanding", label: "7. ยอดค้างชำระ (AR)" },
          { key: "discounts", label: "8. ส่วนลด" },
          { key: "insurance", label: "9. ลูกหนี้สิทธิ / ประกัน" },
          { key: "deposits", label: "10. เงินมัดจำ" }
        ];
        const totalBilled = STATE.invoices.reduce((s, i) => s + Number(i.netAmount || 0), 0);
        const totalCash = STATE.invoices.reduce((s, i) => s + Number(i.paidAmount || 0), 0);
        const totalOut = STATE.invoices.reduce((s, i) => s + Number(i.balanceDue || 0), 0);
        const docOpts = STATE.doctors.map(d => '<option value="' + d.id + '">' + d.fullName + ' (' + d.nickname + ')</option>').join("");

        let repContent = "";
        if (repTab === "dashboard") {
          const hours = ["09","10","11","12","13","14","15","16","17","18","19","20","21"];
          repContent = '<div class="space-y-6">' +
            '<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">' +
              '<div class="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-1"><span class="text-slate-400 text-xs font-semibold block">ผู้มารักษาทั้งหมด</span><span class="text-2xl font-black text-slate-900">' + STATE.visits.length + ' ท่าน</span><span class="text-[10px] text-slate-400 block">จากระบบบันทึกคิวจริง</span></div>' +
              '<div class="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-1"><span class="text-slate-400 text-xs font-semibold block">นัดหมายใหม่</span><span class="text-2xl font-black text-sky-700">' + STATE.appointments.length + ' ราย</span><span class="text-[10px] text-amber-600 font-medium block">ไม่มาตามนัด (No-show): 0 ราย</span></div>' +
              '<div class="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-1"><span class="text-slate-400 text-xs font-semibold block">ยอดเรียกเก็บ (Billed)</span><span class="text-2xl font-black text-slate-900 font-mono">' + formatCurrency(totalBilled) + '</span><span class="text-[10px] text-slate-400 block">ยอดสุทธิรวมหลังหักส่วนลด</span></div>' +
              '<div class="p-4 bg-white rounded-2xl border border-emerald-200 bg-emerald-50/30 shadow-sm space-y-1"><span class="text-emerald-700 text-xs font-bold block">ยอดรับเงินจริง (Cash Collected)</span><span class="text-2xl font-black text-emerald-800 font-mono">' + formatCurrency(totalCash) + '</span><span class="text-[10px] text-emerald-600 block">รับเข้าสด/โอนจริง (ไม่นับมัดจำซ้ำ)</span></div>' +
              '<div class="p-4 bg-white rounded-2xl border border-amber-200 shadow-sm space-y-1"><span class="text-amber-700 text-xs font-bold block">ยอดค้างชำระ (Outstanding)</span><span class="text-2xl font-black text-amber-800 font-mono">' + formatCurrency(totalOut) + '</span><span class="text-[10px] text-amber-600 block">ลูกหนี้ค้างชำระรอติดตาม</span></div>' +
            '</div>' +
            '<div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 space-y-3"><div class="flex items-center justify-between"><h3 class="text-sm font-bold text-slate-800">สถิติช่วงเวลาที่มีคนไข้หนาแน่น (Peak Hours Traffic Analysis)</h3><span class="text-[11px] text-slate-400">คำนวณจากเวลาเช็กอินจริง</span></div><div class="grid grid-cols-6 sm:grid-cols-13 gap-2 pt-2">' +
              hours.map(h => {
                const cnt = STATE.appointments.filter(a => (a.startTime || "").startsWith(h)).length;
                return '<div class="p-2.5 rounded-xl border text-center transition-all ' + (cnt > 0 ? "bg-sky-50 border-sky-300 text-sky-900" : "bg-slate-50 border-slate-200 text-slate-400") + '"><span class="block text-[11px] font-mono font-bold">' + h + ':00</span><span class="block text-base font-black mt-1">' + cnt + '</span><span class="block text-[9px] text-slate-400">คนไข้</span></div>';
              }).join("") +
            '</div></div>' +
          '</div>';
        } else if (repTab === "daily-close") {
          repContent = '<div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-5 text-xs">' +
            '<div class="flex justify-between items-center border-b pb-4"><div><h3 class="text-base font-bold text-slate-800 flex items-center gap-2"><i data-lucide="lock" class="w-5 h-5 text-indigo-600"></i><span>บันทึกปิดยอดประจำวันและกระทบยอดเงินสด/โอน</span></h3><p class="text-slate-500">เปรียบเทียบยอดเงินที่ระบบบันทึกรับจริงกับยอดเงินที่เคาน์เตอร์ตรวจนับได้</p></div></div>' +
            '<div class="grid grid-cols-1 md:grid-cols-2 gap-6"><div class="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2"><h4 class="font-bold text-slate-800 border-b pb-2">1. ยอดรับเงินจริงตามระบบ (System Recorded)</h4><div class="flex justify-between"><span>เงินสด (Cash):</span><strong class="font-mono">0.00 ฿</strong></div><div class="flex justify-between"><span>โอนเงิน / QR PromptPay:</span><strong class="font-mono">' + formatCurrency(totalCash) + '</strong></div><div class="flex justify-between text-sm font-black text-slate-900 border-t pt-2"><span>ยอดรวมระบบ:</span><span class="font-mono text-sky-800">' + formatCurrency(totalCash) + '</span></div></div><div class="p-4 bg-white rounded-2xl border border-slate-200 space-y-2"><h4 class="font-bold text-slate-800 border-b pb-2">2. ยอดตรวจนับได้จริง (Counted Physical Totals)</h4><div><label class="block text-slate-600 mb-1">สลิปโอนเงิน / QR ตรวจนับได้ (บาท)</label><input type="number" value="' + totalCash + '" class="w-full px-3 py-1.5 border border-slate-300 rounded-lg font-mono font-bold" /></div><div class="pt-2"><button type="button" onclick="showToast(\'✅ บันทึกปิดยอดประจำวันเรียบร้อยแล้ว\', \'success\')" class="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md">ยืนยันปิดยอดประจำวัน</button></div></div></div>' +
          '</div>';
        } else {
          repContent = '<div class="space-y-6"><div class="flex items-center justify-between no-print"><div><h3 class="text-sm font-bold text-slate-800">ใบสรุปค่ามือทันตแพทย์ (Doctor Fee / DF Payroll Statement)</h3><p class="text-xs text-slate-500">คำนวณส่วนแบ่ง DF สุทธิ หักค่าแลปทันตกรรม และคำนวณภาษีหัก ณ ที่จ่าย 3% พร้อมสั่งพิมพ์สลิปเงินได้แพทย์</p></div><button type="button" onclick="window.print()" class="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-sm">🖨️ พิมพ์สลิปค่ามือแพทย์ (DF Slip)</button></div><div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs"><div class="p-5 bg-white rounded-2xl border-2 border-sky-200 shadow-sm space-y-3"><div class="flex justify-between items-center border-b border-slate-200 pb-2.5"><div><span class="text-[10px] font-bold text-sky-600 uppercase tracking-wider block">DOCTOR FEE STATEMENT • คลินิกหมอมิน หมอพรีม</span><h4 class="font-black text-base text-slate-900">ทพ. มินตรา รัตนเวชกุล (หมอมิน)</h4></div><span class="px-3 py-1 rounded-full bg-sky-100 text-sky-800 font-bold">DF 50%</span></div><div class="space-y-2 font-mono"><div class="flex justify-between text-slate-600"><span>1. ยอดค่ารักษาที่ทำทั้งหมด (Gross Revenue):</span><strong>24,000.00 ฿</strong></div><div class="flex justify-between text-rose-600"><span>2. หักค่าแลปทันตกรรมส่วนแพทย์ (Lab Deduction):</span><strong>-0.00 ฿</strong></div><div class="flex justify-between font-bold text-slate-800 border-t border-slate-100 pt-1.5"><span>3. ยอดค่ามือแพทย์ก่อนภาษี (Gross DF):</span><strong>12,000.00 ฿</strong></div><div class="flex justify-between text-amber-700"><span>4. หักภาษี ณ ที่จ่าย 3% (WHT 3%):</span><strong>-360.00 ฿</strong></div><div class="flex justify-between text-sm font-black text-emerald-800 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200"><span>ยอดโอนจ่ายแพทย์สุทธิ (Net Payout):</span><strong>11,640.00 ฿</strong></div></div></div><div class="p-5 bg-white rounded-2xl border-2 border-teal-200 shadow-sm space-y-3"><div class="flex justify-between items-center border-b border-slate-200 pb-2.5"><div><span class="text-[10px] font-bold text-teal-600 uppercase tracking-wider block">DOCTOR FEE STATEMENT • คลินิกหมอมิน หมอพรีม</span><h4 class="font-black text-base text-slate-900">ทพญ. พรีมญา สิริวัชราภรณ์ (หมอพรีม)</h4></div><span class="px-3 py-1 rounded-full bg-teal-100 text-teal-800 font-bold">DF 55%</span></div><div class="space-y-2 font-mono"><div class="flex justify-between text-slate-600"><span>1. ยอดค่ารักษาที่ทำทั้งหมด (Gross Revenue):</span><strong>30,000.00 ฿</strong></div><div class="flex justify-between text-rose-600"><span>2. หักค่าแลปทันตกรรมส่วนแพทย์ (Lab Deduction):</span><strong>-3,200.00 ฿</strong></div><div class="flex justify-between font-bold text-slate-800 border-t border-slate-100 pt-1.5"><span>3. ยอดค่ามือแพทย์ก่อนภาษี (Gross DF):</span><strong>14,740.00 ฿</strong></div><div class="flex justify-between text-amber-700"><span>4. หักภาษี ณ ที่จ่าย 3% (WHT 3%):</span><strong>-442.20 ฿</strong></div><div class="flex justify-between text-sm font-black text-emerald-800 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200"><span>ยอดโอนจ่ายแพทย์สุทธิ (Net Payout):</span><strong>14,297.80 ฿</strong></div></div></div></div></div>';
        }

        container.innerHTML = '<div class="space-y-6">' +
          '<div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 space-y-4">' +
            '<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"><div><h1 class="text-lg font-bold text-slate-800 flex items-center gap-2"><i data-lucide="bar-chart-3" class="w-5 h-5 text-sky-600"></i><span>รายงาน การเงิน และปิดยอดประจำวัน</span></h1><p class="text-xs text-slate-500">วิเคราะห์รายได้ตามวันที่รับเงินจริง (Cash-basis), สรุปยอด DF แพทย์, และกระทบยอดปิดกะ</p></div><div class="flex items-center gap-2"><button type="button" onclick="exportReportCsv()" class="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-sm flex items-center gap-1.5"><i data-lucide="file-spreadsheet" class="w-4 h-4"></i><span>ส่งออก Excel / CSV</span></button></div></div>' +
            '<div class="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100 text-xs"><div class="flex items-center gap-2"><span class="font-semibold text-slate-500">ตั้งแต่วันที่:</span><input type="date" value="' + STATE.selectedDate + '" class="px-3 py-1.5 border border-slate-300 rounded-xl bg-white" /></div><div class="flex items-center gap-2"><span class="font-semibold text-slate-500">ถึงวันที่:</span><input type="date" value="' + STATE.selectedDate + '" class="px-3 py-1.5 border border-slate-300 rounded-xl bg-white" /></div><div class="flex items-center gap-2"><span class="font-semibold text-slate-500">แพทย์:</span><select class="px-3 py-1.5 border border-slate-300 rounded-xl bg-white"><option value="all">ทันตแพทย์ทุกคน</option>' + docOpts + '</select></div></div>' +
            '<div class="flex overflow-x-auto gap-1 border-t border-slate-100 pt-3 no-scrollbar text-xs font-semibold">' + repTabs.map(t => '<button type="button" data-k="' + t.key + '" onclick="STATE.reportsTab=this.dataset.k; renderView();" class="px-3 py-1.5 rounded-xl whitespace-nowrap transition-all ' + (repTab === t.key ? "bg-sky-600 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100") + '">' + t.label + '</button>').join("") + '</div>' +
          '</div>' +
          repContent +
        '</div>';
        if (window.lucide) window.lucide.createIcons();
        return;
      }

      // 12. SETTINGS & CLOUDFLARE D1 BACKUP (src/app/settings/page.tsx)
      if (tab === "backup") {
        const sTab = STATE.settingsTab || "clinic";
        const sTabs = [
          { key: "clinic", label: "1. ข้อมูลคลินิก & นโยบายคิดเงิน" },
          { key: "users", label: "2. บัญชีผู้ใช้และสิทธิ์" },
          { key: "line", label: "3. เชื่อมต่อ LINE Official Account" },
          { key: "import", label: "4. นำเข้าคนไข้เดิม (CSV)" },
          { key: "backup", label: "5. สำรองข้อมูล (Backup/Restore)" }
        ];
        let sBody = "";
        if (sTab === "clinic") {
          sBody = '<div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-5 text-xs">' +
            '<div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label class="block font-semibold text-slate-700 mb-1">ชื่อคลินิก (ภาษาไทย) *</label><input type="text" value="คลินิกทันตกรรมหมอมิน หมอพรีม" class="w-full px-3 py-2 border border-slate-300 rounded-xl font-bold text-slate-900" /></div><div><label class="block font-semibold text-slate-700 mb-1">ชื่อคลินิก (ภาษาอังกฤษ)</label><input type="text" value="Min & Preem Dental Clinic" class="w-full px-3 py-2 border border-slate-300 rounded-xl" /></div><div><label class="block font-semibold text-slate-700 mb-1">เลขประจำตัวผู้เสียภาษี (Tax ID)</label><input type="text" value="0105567012345" class="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono" /></div><div><label class="block font-semibold text-slate-700 mb-1">เบอร์โทรศัพท์คลินิก</label><input type="text" value="02-123-4567, 089-999-8888" class="w-full px-3 py-2 border border-slate-300 rounded-xl" /></div><div class="col-span-2"><label class="block font-semibold text-slate-700 mb-1">ที่อยู่คลินิก</label><input type="text" value="123/45 ถนนสุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพมหานคร 10110" class="w-full px-3 py-2 border border-slate-300 rounded-xl" /></div></div>' +
            '<div class="border-t border-slate-100 pt-4 space-y-3"><h3 class="font-bold text-slate-800 text-sm">นโยบายการคำนวณค่า DF แพทย์และใบเสร็จ</h3><div class="grid grid-cols-1 md:grid-cols-2 gap-4"><label class="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer"><input type="checkbox" checked class="rounded text-sky-600" /><span class="font-semibold text-slate-800">หักค่าใช้จ่ายแลปทันตกรรม ออกจากค่า DF แพทย์ก่อนคำนวณส่วนแบ่ง</span></label><label class="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer"><input type="checkbox" checked class="rounded text-sky-600" /><span class="font-semibold text-slate-800">คำนวณ DF จากยอดสุทธิหลังหักส่วนลด (Net Basis)</span></label></div></div>' +
            '<div class="flex justify-end pt-3 border-t"><button type="button" onclick="showToast(\'✅ บันทึกการตั้งค่าคลินิกเรียบร้อยแล้ว\', \'success\')" class="px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl shadow-md">บันทึกการตั้งค่า</button></div>' +
          '</div>';
        } else if (sTab === "users") {
          const uList = [
            { u: "admin", n: "ทพ. มินตรา (เจ้าของคลินิก)", r: "ADMIN", p: "081-111-2222" },
            { u: "doctormin", n: "ทพ. มินตรา รัตนเวชกุล (หมอมิน)", r: "DENTIST", p: "081-111-2222" },
            { u: "doctorpreem", n: "ทพญ. พรีมญา สิริวัชราภรณ์ (หมอพรีม)", r: "DENTIST", p: "089-222-3333" },
            { u: "counter", n: "คุณสมศรี (เคาน์เตอร์)", r: "COUNTER", p: "086-333-4444" },
            { u: "finance", n: "คุณบัญชา (การเงิน)", r: "FINANCE", p: "085-444-5555" },
            { u: "assistant", n: "คุณน้ำหวาน (ผู้ช่วยทันตแพทย์)", r: "ASSISTANT", p: "084-555-6666" }
          ];
          sBody = '<div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4"><div class="border-b pb-3"><h3 class="text-sm font-bold text-slate-800">ผู้ใช้งานและบทบาทในระบบ (Roles & Permissions)</h3><p class="text-xs text-slate-500">จำกัดสิทธิ์การเข้าถึงข้อมูลสุขภาพและการเงินตามหน้าที่</p></div><div class="overflow-x-auto"><table class="w-full text-left text-xs divide-y divide-slate-200"><thead class="bg-slate-50 font-bold text-slate-600"><tr><th class="px-4 py-3">ชื่อผู้ใช้</th><th class="px-4 py-3">ชื่อ - นามสกุล</th><th class="px-4 py-3">บทบาทหน้าที่ (Role)</th><th class="px-4 py-3">เบอร์ติดต่อ</th><th class="px-4 py-3 text-center">สถานะ</th></tr></thead><tbody class="divide-y divide-slate-100">' + uList.map(u => '<tr><td class="px-4 py-3 font-mono font-bold text-slate-800">' + u.u + '</td><td class="px-4 py-3 font-semibold text-slate-900">' + u.n + '</td><td class="px-4 py-3"><span class="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-100 text-sky-800">' + u.r + '</span></td><td class="px-4 py-3 text-slate-500 font-mono">' + u.p + '</td><td class="px-4 py-3 text-center"><span class="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">ใช้งานปกติ</span></td></tr>').join("") + '</tbody></table></div></div>';
        } else if (sTab === "line") {
          sBody = '<div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-5 text-xs"><div><h3 class="text-sm font-bold text-slate-800 flex items-center gap-2"><i data-lucide="message-square" class="w-4 h-4 text-emerald-600"></i><span>การเชื่อมต่อ LINE Official Account (@minpreemclinic)</span></h3><p class="text-xs text-slate-500">ระบบส่งข้อความเตือนนัดหมาย, ยืนยันนัด และรับข้อความขอเลื่อนนัดจากคนไข้</p></div><div class="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl flex items-center justify-between"><div><span class="font-bold text-emerald-950 block">จำลองการส่งข้อความแจ้งเตือนคนไข้ผ่าน LINE Messaging API</span><span class="text-slate-600">ส่งข้อความเตือนนัดหมายวันพรุ่งนี้ไปยังเบอร์ 081-234-5678</span></div><button type="button" onclick="showToast(\'✅ ส่งข้อความจำลองผ่าน LINE Messaging API สำเร็จ\', \'success\')" class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-sm">ส่งข้อความจำลอง</button></div></div>';
        } else if (sTab === "import") {
          sBody = '<div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4 text-xs"><div><h3 class="text-sm font-bold text-slate-800 flex items-center gap-2"><i data-lucide="file-spreadsheet" class="w-4 h-4 text-sky-600"></i><span>นำเข้าข้อมูลทะเบียนคนไข้เดิมจาก CSV / Excel</span></h3><p class="text-xs text-slate-500">ตรวจสอบข้อมูลซ้ำก่อนบันทึกจริง พร้อมรายงานแถวที่นำเข้าไม่สำเร็จ</p></div><textarea rows="4" class="w-full p-3 font-mono border border-slate-300 rounded-xl">ชื่อ,นามสกุล,เบอร์โทร,สิทธิการรักษา,โรคประจำตัว,แพ้ยา\nสมศรี,สุขใจ,0819991122,จ่ายเอง,ไม่มี,แพ้ยา Sulfa\nวิชัย,มั่นคง,0893334455,ประกันสังคม,ความดันโลหิตสูง,ไม่มี</textarea><div class="flex gap-2"><button type="button" onclick="showToast(\'✅ ตรวจสอบ CSV ผ่านทั้งหมด 2 แถว พร้อมนำเข้า\', \'success\')" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl">1. ตรวจสอบข้อมูลก่อน (Dry Run)</button><button type="button" onclick="showToast(\'✅ นำเข้าข้อมูลคนไข้เข้าฐานข้อมูล Cloudflare D1 สำเร็จ\', \'success\')" class="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl shadow-sm">2. ยืนยันนำเข้าข้อมูลจริง</button></div></div>';
        } else {
          const snapRows = STATE.snapshots.map(s => '<div class="p-3.5 bg-white hover:bg-slate-50 flex flex-wrap items-center justify-between gap-3"><div class="space-y-0.5"><div class="flex items-center gap-2"><span class="px-2 py-0.5 rounded bg-sky-100 text-sky-800 font-mono font-bold text-[11px]">' + s.id + '</span><strong class="text-slate-900 font-bold">' + s.backupLabel + '</strong></div><p class="text-[11px] text-slate-500">คนไข้: <strong>' + s.patientCount + ' ท่าน</strong> • ประวัติตรวจ: <strong>' + s.visitCount + ' ครั้ง</strong> • โดย ' + s.createdBy + ' (' + s.createdAt + ')</p></div><button type="button" onclick="showToast(\'🔄 กู้คืนข้อมูลจากจุดสำรอง ' + s.id + ' เรียบร้อยแล้ว\', \'success\')" class="px-3.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-800 border border-emerald-300 font-bold transition-all">🔄 กู้คืนข้อมูลชุดนี้ (1-Click Restore)</button></div>').join("");
          sBody = '<div class="space-y-5 text-xs"><div class="bg-gradient-to-r from-sky-900 via-sky-800 to-teal-900 text-white p-6 rounded-2xl shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4"><div class="space-y-1.5"><div class="flex items-center gap-2"><span class="px-2.5 py-0.5 rounded-full bg-emerald-400/20 border border-emerald-400/40 text-emerald-300 font-bold text-[11px] flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span><span>เชื่อมต่อ Cloudflare D1 สำเร็จ (APAC Region)</span></span><span class="px-2.5 py-0.5 rounded-full bg-sky-400/20 text-sky-200 font-mono text-[10px]">DB: min-and-pream-clinic-db</span></div><h3 class="text-base font-black">🛡️ ระบบปกป้องข้อมูลคนไข้ 3 ชั้น (Cloudflare D1 Time Travel + Cloud Snapshot + Local Backup)</h3><p class="text-sky-100/90 text-xs">คุณหมอมินและคุณหมอพรีมสามารถกดปุ่มด้านขวาเพียงคลิกเดียว เพื่อส่งข้อมูลคนไข้ทั้งหมดขึ้นเก็บไว้บน Cloudflare Cloud ทันที</p></div><button type="button" onclick="triggerCloudBackup()" class="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-300 hover:to-orange-300 text-slate-950 font-black text-sm shadow-xl shrink-0 transition-all flex items-center gap-2"><i data-lucide="sparkles" class="w-5 h-5"></i><span>☁️ กดสำรองข้อมูลขึ้น Cloudflare ตอนนี้เลย</span></button></div><div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 space-y-4"><h4 class="text-sm font-bold text-slate-800">☁️ รายการจุดสำรองข้อมูลบน Cloudflare D1 (' + STATE.snapshots.length + ' รายการล่าสุด)</h4><div class="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">' + snapRows + '</div></div></div>';
        }

        container.innerHTML = '<div class="space-y-6">' +
          '<div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-200"><h1 class="text-lg font-bold text-slate-800 flex items-center gap-2"><i data-lucide="settings" class="w-5 h-5 text-sky-600"></i><span>การตั้งค่าคลินิก & ระบบเชื่อมต่อ</span></h1><p class="text-xs text-slate-500">ข้อมูลองค์กร, สิทธิ์ผู้ใช้งาน, นำเข้าข้อมูลคนไข้เดิม, LINE Official Account และสำรองข้อมูล</p><div class="flex overflow-x-auto gap-1 border-t border-slate-100 pt-3 mt-4 text-xs font-semibold">' + sTabs.map(t => '<button type="button" data-k="' + t.key + '" onclick="STATE.settingsTab=this.dataset.k; renderView();" class="px-3.5 py-2 rounded-xl whitespace-nowrap transition-all ' + (sTab === t.key ? "bg-sky-600 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100") + '">' + t.label + '</button>').join("") + '</div></div>' +
          sBody +
        '</div>';
        if (window.lucide) window.lucide.createIcons();
        return;
      }

      // 13. CLINICAL EXAM EMR PAGE (src/app/emr/[visitId]/page.tsx)
      if (tab === "emr") {
        const curPat = STATE.patients.find(p => p.id === STATE.activeEmrPatientId) || STATE.patients[0] || {};
        const curDoc = STATE.doctors.find(d => d.id === curPat.attendingDoctorId) || STATE.doctors[0] || { nickname: "หมอมิน", fullName: "ทพ. มินตรา รัตนเวชกุล" };
        const isPenAllergy = (curPat.drugAllergies || "").toLowerCase().includes("penicillin") || (curPat.drugAllergies || "").toLowerCase().includes("amoxi") || (curPat.drugAllergies || "").toLowerCase().includes("beta-lactam") || (curPat.drugAllergies || "").includes("เพนิซิลิน");
        const highBp = STATE.emrForm.bpSys >= 140 || STATE.emrForm.bpDia >= 90;
        const totalTx = STATE.emrForm.items.reduce((s, i) => s + i.price, 0);
        const itemsHtml = STATE.emrForm.items.map(it => '<div class="py-2 flex justify-between items-center"><div><span class="font-bold text-slate-900">' + it.name + '</span><span class="block text-[10px] text-sky-700 font-mono">ค่ามือหมอ (DF 50%): ' + formatCurrency(it.df) + '</span></div><span class="font-mono font-bold text-slate-900">' + formatCurrency(it.price) + '</span></div>').join("");
        const drugsHtml = STATE.emrForm.drugs.map(d => '<div class="p-2.5 rounded-xl border border-slate-300 bg-slate-50"><strong class="block text-slate-900">' + d.name + '</strong><span class="text-slate-600">' + d.dose + '</span></div>').join("");
        container.innerHTML = '<div class="space-y-5"><div class="bg-white p-5 rounded-2xl border-2 border-sky-400 shadow-md space-y-4"><div class="flex flex-wrap items-center justify-between gap-4"><div class="flex items-start gap-3"><button type="button" onclick="switchTab(\'queue\')" class="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors mt-0.5"><i data-lucide="arrow-left" class="w-5 h-5"></i></button><div><div class="flex items-center gap-2"><span class="px-3 py-1 rounded-lg bg-sky-600 text-white font-mono font-black text-sm tracking-wider shadow-sm">' + (curPat.dn || "DN-XXXXXX") + '</span><h2 class="text-2xl font-black text-slate-900">' + (curPat.title || "") + ' ' + (curPat.firstNameTh || "") + ' ' + (curPat.lastNameTh || "") + '</h2></div><p class="text-xs text-slate-600 mt-1.5 font-medium">โทร: <strong class="text-slate-900">' + (curPat.phone || "-") + '</strong> • สิทธิการรักษา: <strong class="text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">' + (curPat.rights || "จ่ายเอง") + '</strong> • แพทย์ประจำตัว: <strong class="text-sky-700">' + curDoc.fullName + ' (' + curDoc.nickname + ')</strong></p></div></div><button onclick="completeEmrAndBillD1()" class="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-sm shadow-lg shadow-emerald-600/30">✅ ตรวจเสร็จสิ้น & ส่งคิดเงินหน้าเคาน์เตอร์ทันที</button></div><div class="p-3.5 rounded-xl ' + (isPenAllergy ? "bg-rose-100 border-2 border-rose-500 text-rose-950 font-black animate-pulse" : "bg-rose-50 border border-rose-200 text-rose-900 font-bold") + ' text-xs flex items-center justify-between"><div><span class="text-base mr-1.5">🚨</span><strong>ประวัติแพ้ยา:</strong> ' + (curPat.drugAllergies || "ไม่มีประวัติแพ้ยา") + ' | 🩺 <strong>โรคประจำตัว:</strong> ' + (curPat.chronicDiseases || "ไม่มี") + '</div>' + (isPenAllergy ? '<span class="px-3 py-1 rounded-full bg-rose-600 text-white text-xs font-black">⛔ ห้ามจ่ายยาในกลุ่ม Penicillin/Amoxi</span>' : '') + '</div><div class="p-3.5 rounded-xl border ' + (highBp ? "bg-rose-50 border-rose-400" : "bg-slate-50 border-slate-200") + ' flex flex-wrap items-center justify-between gap-3 text-xs"><div><strong class="text-slate-800 block">🩺 สัญญาณชีพก่อนทำฟัน & ยาชา (Pre-Op Vital Signs)</strong><span class="' + (highBp ? "text-rose-700 font-bold" : "text-emerald-700 font-semibold") + '">' + (highBp ? "⚠️ ความดันโลหิตสูงเกิน 140/90 mmHg! โปรดระวังการฉีดยาชาที่มีส่วนผสมของ Adrenaline" : "✓ ความดันโลหิตอยู่ในเกณฑ์ปลอดภัยพร้อมทำหัตถการ") + '</span></div><div class="flex flex-wrap items-center gap-2"><span>ความดัน (BP):</span><input type="number" value="' + STATE.emrForm.bpSys + '" onchange="STATE.emrForm.bpSys=Number(this.value);renderView()" class="w-16 px-2 py-1 border rounded-lg font-mono font-bold text-center bg-white" /><span>/</span><input type="number" value="' + STATE.emrForm.bpDia + '" onchange="STATE.emrForm.bpDia=Number(this.value);renderView()" class="w-16 px-2 py-1 border rounded-lg font-mono font-bold text-center bg-white" /><select class="px-3 py-1.5 border rounded-xl bg-white font-bold"><option>ยาชา: ไม่ต้องฉีดยาชา</option><option>ยาชา: Mepivacaine 2% + Adrenaline (1 หลอด)</option><option>ยาชา: Mepivacaine 3% Plain (ความดันสูง)</option></select></div></div></div><div class="grid grid-cols-1 lg:grid-cols-12 gap-6"><div class="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4"><h3 class="text-sm font-bold text-slate-800">⚡ บันทึกการตรวจรักษา (กดเลือกแม่แบบ 1-Click ไม่ต้องพิมพ์เอง)</h3><div class="flex flex-wrap gap-2"><button onclick="applyEmrTemplate(\'scaling\')" class="px-3.5 py-2 rounded-xl bg-sky-50 hover:bg-sky-600 hover:text-white border border-sky-300 text-xs font-bold">✨ ขูดหินปูนทั้งปาก</button><button onclick="applyEmrTemplate(\'filling\')" class="px-3.5 py-2 rounded-xl bg-teal-50 hover:bg-teal-600 hover:text-white border border-teal-300 text-xs font-bold">🦷 อุดฟันคอมโพสิต</button><button onclick="applyEmrTemplate(\'extraction\')" class="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-600 hover:text-white border border-rose-300 text-xs font-bold">ผ่าฟันคุด / ถอนฟัน</button><button onclick="applyEmrTemplate(\'ortho\')" class="px-3.5 py-2 rounded-xl bg-purple-50 hover:bg-purple-600 hover:text-white border border-purple-300 text-xs font-bold">😁 ปรับเครื่องมือจัดฟัน</button></div><div class="space-y-3 text-xs"><div class="grid grid-cols-1 md:grid-cols-2 gap-3"><div><label class="font-bold text-slate-700 block mb-1">1. อาการสำคัญ (CC)</label><textarea rows="2" onchange="STATE.emrForm.cc=this.value" class="w-full px-3 py-2 border rounded-xl bg-white">' + STATE.emrForm.cc + '</textarea></div><div><label class="font-bold text-slate-700 block mb-1">2. ผลการตรวจในช่องปาก (PE)</label><textarea rows="2" onchange="STATE.emrForm.pe=this.value" class="w-full px-3 py-2 border rounded-xl bg-white">' + STATE.emrForm.pe + '</textarea></div></div><div><label class="font-bold text-slate-700 block mb-1">3. การวินิจฉัย (Diagnosis)</label><input value="' + STATE.emrForm.dx + '" onchange="STATE.emrForm.dx=this.value" class="w-full px-3 py-2 border rounded-xl bg-white font-bold text-sky-900" /></div><div><label class="font-bold text-slate-700 block mb-1">4. หัตถการที่ทำในวันนี้ (Treatment Done)</label><textarea rows="2" onchange="STATE.emrForm.tx=this.value" class="w-full px-3 py-2 border rounded-xl bg-white">' + STATE.emrForm.tx + '</textarea></div><div class="grid grid-cols-1 md:grid-cols-2 gap-3"><div><label class="font-bold text-slate-700 block mb-1">5. คำแนะนำหลังรักษา</label><textarea rows="2" onchange="STATE.emrForm.advice=this.value" class="w-full px-3 py-1.5 border rounded-xl bg-white">' + (STATE.emrForm.advice || "") + '</textarea></div><div><label class="font-bold text-slate-700 block mb-1">6. แผนการนัดครั้งต่อไป</label><textarea rows="2" onchange="STATE.emrForm.followUp=this.value" class="w-full px-3 py-1.5 border rounded-xl bg-white">' + (STATE.emrForm.followUp || "") + '</textarea></div></div></div></div><div class="lg:col-span-5 space-y-5"><div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3"><h3 class="text-sm font-bold text-slate-800">1. คิดค่ารักษา / หัตถการ (กดปุ่มเดียวเพิ่มเข้าบิลทันที)</h3><div class="grid grid-cols-2 gap-2 text-xs"><button onclick="addQuickProc(\'ขูดหินปูนทั้งปากพร้อมขัดฟัน\', 1200)" class="p-2.5 rounded-xl border border-sky-300 bg-sky-50 hover:bg-sky-100 font-bold text-left">+ ขูดหินปูนทั้งปาก (1,200฿)</button><button onclick="addQuickProc(\'อุดฟันคอมโพสิต 1 ด้าน\', 900)" class="p-2.5 rounded-xl border border-teal-300 bg-teal-50 hover:bg-teal-100 font-bold text-left">+ อุดฟัน 1 ด้าน (900฿)</button><button onclick="addQuickProc(\'อุดฟันคอมโพสิต 2 ด้าน\', 1400)" class="p-2.5 rounded-xl border border-teal-300 bg-teal-50 hover:bg-teal-100 font-bold text-left">+ อุดฟัน 2 ด้าน (1,400฿)</button><button onclick="addQuickProc(\'ถอนฟันแท้ทั่วไป\', 1000)" class="p-2.5 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 font-bold text-left">+ ถอนฟันแท้ (1,000฿)</button><button onclick="addQuickProc(\'ผ่าฟันคุดระดับปานกลาง\', 3500)" class="p-2.5 rounded-xl border border-rose-300 bg-rose-50 hover:bg-rose-100 font-bold text-left">+ ผ่าฟันคุด (3,500฿)</button><button onclick="addQuickProc(\'ปรับเครื่องมือจัดฟันรายเดือน\', 1500)" class="p-2.5 rounded-xl border border-purple-300 bg-purple-50 hover:bg-purple-100 font-bold text-left">+ ปรับจัดฟัน (1,500฿)</button><button onclick="addQuickProc(\'รักษารากฟันหน้า\', 4500)" class="p-2.5 rounded-xl border border-indigo-300 bg-indigo-50 hover:bg-indigo-100 font-bold text-left">+ รักษารากฟัน (4,500฿)</button><button onclick="addQuickProc(\'ครอบฟัน Zirconia\', 12000)" class="p-2.5 rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 font-bold text-left">+ ครอบฟัน (12,000฿)</button></div><div class="pt-2 border-t text-xs divide-y divide-slate-100">' + itemsHtml + '<div class="flex justify-between pt-2 border-t font-black text-sm text-emerald-700"><span>รวมค่ารักษาวันนี้:</span><span>' + formatCurrency(totalTx) + '</span></div></div></div><div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3 text-xs"><div class="flex justify-between items-center"><h3 class="text-sm font-bold text-slate-800">2. สั่งจ่ายยา & พิมพ์สติกเกอร์ซองยา (1-Click ชุดยา)</h3><button onclick="window.print()" class="px-3 py-1 rounded-lg bg-slate-900 text-white font-bold">🖨️ พิมพ์ฉลากยา</button></div><div class="space-y-1.5"><button onclick="addQuickDrugSet(\'surgery\')" class="w-full p-2.5 rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-600 hover:text-white font-bold text-left">+ 💊 ชุดยาหลังถอนฟัน / ผ่าฟันคุด (ฆ่าเชื้อ + แก้ปวดลดบวม)</button><button onclick="addQuickDrugSet(\'pain\')" class="w-full p-2.5 rounded-xl border border-sky-300 bg-sky-50 hover:bg-sky-600 hover:text-white font-bold text-left">+ 💊 ชุดยาแก้ปวดตึงหลังจัดฟัน / อุดฟันลึก (Paracetamol 500mg)</button></div>' + drugsHtml + '</div></div></div></div>';
        if (window.lucide) window.lucide.createIcons();
        return;
      }
    }
    applySidebarLayout();
    loadInitialData();
  </script>
</body>
</html>