const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Resetting and seeding clean clinic database...');

  // Clean in reverse dependency order
  await prisma.auditLog.deleteMany();
  await prisma.doctorFeePayment.deleteMany();
  await prisma.receipt.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.insuranceClaim.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.treatmentItem.deleteMany();
  await prisma.prescriptionItem.deleteMany();
  await prisma.medicalRecord.deleteMany();
  await prisma.orthoAdjustmentLog.deleteMany();
  await prisma.orthoInstallment.deleteMany();
  await prisma.patientOrthoPackage.deleteMany();
  await prisma.orthoPackage.deleteMany();
  await prisma.labOrder.deleteMany();
  await prisma.procedureStockLink.deleteMany();
  await prisma.inventoryMovement.deleteMany();
  await prisma.inventoryStock.deleteMany();
  await prisma.inventoryItem.deleteMany();
  await prisma.toothCondition.deleteMany();
  await prisma.treatmentPlan.deleteMany();
  await prisma.deposit.deleteMany();
  await prisma.visit.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.blockedSlot.deleteMany();
  await prisma.dailyClose.deleteMany();
  await prisma.patientDocument.deleteMany();
  await prisma.patient.deleteMany();
  await prisma.doctorSchedule.deleteMany();
  await prisma.doctor.deleteMany();
  await prisma.room.deleteMany();
  await prisma.user.deleteMany();
  await prisma.branch.deleteMany();
  await prisma.appointmentType.deleteMany();
  await prisma.procedureCatalog.deleteMany();
  await prisma.diagnosisCatalog.deleteMany();

  // 1. Branch
  const branch = await prisma.branch.create({
    data: {
      code: 'HQ',
      nameTh: 'สาขาหลัก (สุขุมวิท)',
      nameEn: 'Main Branch (Sukhumvit)',
      address: '123/45 ถนนสุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพมหานคร 10110',
      phone: '02-123-4567, 089-999-8888',
      isDefault: true,
    },
  });

  // 2. Clinic Setting
  await prisma.clinicSetting.upsert({
    where: { id: 'default' },
    update: {
      clinicNameTh: 'คลินิกทันตกรรมหมอมิน หมอพรีม',
      clinicNameEn: 'Min & Preem Dental Clinic',
      primaryColor: '#0284c7',
      secondaryColor: '#0d9488',
      taxId: '0105567012345',
      address: '123/45 ถนนสุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพมหานคร 10110',
      phone: '02-123-4567, 089-999-8888',
      email: 'contact@minpreemdental.com',
      lineId: '@minpreemclinic',
      receiptHeader: 'ใบเสร็จรับเงิน / ใบรับรองค่ารักษาพยาบาล',
      receiptFooter: 'ขอบพระคุณที่ไว้วางใจให้คลินิกทันตกรรมหมอมิน หมอพรีม ดูแลรอยยิ้มของคุณ',
      receiptFormat: 'A4',
      defaultDfDeductLab: true,
      defaultDfBaseNet: true,
      nextDnNumber: 1005,
      nextInvoiceNumber: 1005,
      nextReceiptNumber: 1005,
      nextLabOrderNumber: 1003,
      aiAnalyticsEnabled: true,
    },
    create: {
      id: 'default',
      clinicNameTh: 'คลินิกทันตกรรมหมอมิน หมอพรีม',
      clinicNameEn: 'Min & Preem Dental Clinic',
      logoUrl: '/logo.png',
      primaryColor: '#0284c7',
      secondaryColor: '#0d9488',
      taxId: '0105567012345',
      address: '123/45 ถนนสุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพมหานคร 10110',
      phone: '02-123-4567, 089-999-8888',
      email: 'contact@minpreemdental.com',
      lineId: '@minpreemclinic',
      receiptHeader: 'ใบเสร็จรับเงิน / ใบรับรองค่ารักษาพยาบาล',
      receiptFooter: 'ขอบพระคุณที่ไว้วางใจให้คลินิกทันตกรรมหมอมิน หมอพรีม ดูแลรอยยิ้มของคุณ',
      receiptFormat: 'A4',
      defaultDfDeductLab: true,
      defaultDfBaseNet: true,
      nextDnNumber: 1005,
      nextInvoiceNumber: 1005,
      nextReceiptNumber: 1005,
      nextLabOrderNumber: 1003,
      aiAnalyticsEnabled: true,
    },
  });

  // 3. Rooms
  const room1 = await prisma.room.create({
    data: {
      branchId: branch.id,
      name: 'ห้องตรวจ 1 (ทันตกรรมจัดฟัน & ทั่วไป)',
      chairNumber: 'ยูนิตทำฟัน 1 (A-Sky Blue)',
      colorCode: '#0284c7',
      isActive: true,
    },
  });

  const room2 = await prisma.room.create({
    data: {
      branchId: branch.id,
      name: 'ห้องตรวจ 2 (รักษาราก & เพื่อความงาม)',
      chairNumber: 'ยูนิตทำฟัน 2 (B-Mint Green)',
      colorCode: '#0d9488',
      isActive: true,
    },
  });

  const room3 = await prisma.room.create({
    data: {
      branchId: branch.id,
      name: 'ห้องเอกซเรย์ดิจิทัล',
      chairNumber: 'CT & Panoramic Room',
      colorCode: '#8b5cf6',
      isActive: true,
    },
  });

  // 4. Users & Doctors
  const defaultPassword = await bcrypt.hash('password123', 10);

  // Admin
  await prisma.user.create({
    data: {
      username: 'admin',
      passwordHash: defaultPassword,
      fullName: 'ทพ. มินตรา (เจ้าของคลินิก/ผู้ดูแล)',
      role: 'ADMIN',
      email: 'admin@minpreemdental.com',
      phone: '089-999-8888',
      branchId: branch.id,
    },
  });

  // Counter
  await prisma.user.create({
    data: {
      username: 'counter',
      passwordHash: defaultPassword,
      fullName: 'คุณสมศรี บริการใจดี (เคาน์เตอร์)',
      role: 'COUNTER',
      phone: '081-111-2222',
      branchId: branch.id,
    },
  });

  // Dentist 1: หมอมิน
  const doctorMinUser = await prisma.user.create({
    data: {
      username: 'doctormin',
      passwordHash: defaultPassword,
      fullName: 'ทพ. มินตรา รัตนเวชกุล',
      role: 'DENTIST',
      email: 'min@minpreemdental.com',
      branchId: branch.id,
    },
  });

  const doctorMin = await prisma.doctor.create({
    data: {
      userId: doctorMinUser.id,
      licenseNo: 'ท.บ. 14258',
      title: 'ทพ.',
      fullName: 'ทพ. มินตรา รัตนเวชกุล',
      nickname: 'หมอมิน',
      specialty: 'ทันตกรรมจัดฟันและทันตกรรมทั่วไป',
      colorCode: '#0284c7',
      defaultRoomId: room1.id,
      defaultDfRate: 50.0,
      isActive: true,
    },
  });

  // Dentist 2: หมอพรีม
  const doctorPreemUser = await prisma.user.create({
    data: {
      username: 'doctorpreem',
      passwordHash: defaultPassword,
      fullName: 'ทพญ. พรีมญา สิริวัชราภรณ์',
      role: 'DENTIST',
      email: 'preem@minpreemdental.com',
      branchId: branch.id,
    },
  });

  const doctorPreem = await prisma.doctor.create({
    data: {
      userId: doctorPreemUser.id,
      licenseNo: 'ท.บ. 15890',
      title: 'ทพญ.',
      fullName: 'ทพญ. พรีมญา สิริวัชราภรณ์',
      nickname: 'หมอพรีม',
      specialty: 'ทันตกรรมรักษารากฟันและเพื่อความงาม',
      colorCode: '#0d9488',
      defaultRoomId: room2.id,
      defaultDfRate: 55.0,
      isActive: true,
    },
  });

  // Assistant
  await prisma.user.create({
    data: {
      username: 'assistant',
      passwordHash: defaultPassword,
      fullName: 'คุณน้ำหวาน ผู้ช่วยทันตแพทย์',
      role: 'ASSISTANT',
      phone: '082-333-4444',
      branchId: branch.id,
    },
  });

  // Finance
  await prisma.user.create({
    data: {
      username: 'finance',
      passwordHash: defaultPassword,
      fullName: 'คุณบัญชา ฝ่ายการเงิน',
      role: 'FINANCE',
      phone: '083-555-6666',
      branchId: branch.id,
    },
  });

  // 5. Doctor Schedules
  for (let day = 1; day <= 6; day++) {
    await prisma.doctorSchedule.create({
      data: {
        doctorId: doctorMin.id,
        roomId: room1.id,
        dayOfWeek: day,
        startTime: '09:00',
        endTime: '18:00',
      },
    });
    await prisma.doctorSchedule.create({
      data: {
        doctorId: doctorPreem.id,
        roomId: room2.id,
        dayOfWeek: day,
        startTime: '10:00',
        endTime: '19:00',
      },
    });
  }

  // 6. Appointment Types
  const typeScaling = await prisma.appointmentType.create({
    data: { name: 'ขูดหินปูนและขัดฟัน', defaultDurationMinutes: 30, defaultFollowUpDays: 180, colorCode: '#0284c7' },
  });
  const typeFilling = await prisma.appointmentType.create({
    data: { name: 'อุดฟันคอมโพสิต', defaultDurationMinutes: 45, defaultFollowUpDays: 180, colorCode: '#0d9488' },
  });
  const typeOrthoConsult = await prisma.appointmentType.create({
    data: { name: 'ตรวจปรึกษาจัดฟัน', defaultDurationMinutes: 45, defaultFollowUpDays: 30, colorCode: '#8b5cf6' },
  });
  const typeOrthoAdjust = await prisma.appointmentType.create({
    data: { name: 'ปรับเครื่องมือจัดฟัน', defaultDurationMinutes: 30, defaultFollowUpDays: 30, colorCode: '#a855f7' },
  });
  const typeRootCanal = await prisma.appointmentType.create({
    data: { name: 'รักษารากฟัน', defaultDurationMinutes: 60, defaultFollowUpDays: 14, colorCode: '#ef4444' },
  });
  const typeCrown = await prisma.appointmentType.create({
    data: { name: 'พิมพ์ปาก/ใส่ครอบฟัน', defaultDurationMinutes: 45, defaultFollowUpDays: 14, colorCode: '#6366f1' },
  });

  // 7. Standard Procedure Catalog
  const procedures = [
    { code: 'D01', nameTh: 'ตรวจสุขภาพช่องปากและให้คำปรึกษา', category: 'ตรวจวินิจฉัย', defaultPrice: 300, defaultDfType: 'PERCENT', defaultDfRate: 50, defaultDurationMinutes: 20 },
    { code: 'D02', nameTh: 'ถ่ายภาพรังสีดิจิทัล (Periapical Film)', category: 'ตรวจวินิจฉัย', defaultPrice: 200, defaultDfType: 'PERCENT', defaultDfRate: 30, defaultDurationMinutes: 10 },
    { code: 'D03', nameTh: 'ถ่ายภาพรังสีพาโนรามิก (Panoramic X-Ray)', category: 'ตรวจวินิจฉัย', defaultPrice: 600, defaultDfType: 'PERCENT', defaultDfRate: 40, defaultDurationMinutes: 15 },
    { code: 'D10', nameTh: 'ขูดหินปูนทั้งปากพร้อมขัดฟัน (Full Scaling)', category: 'ทันตกรรมป้องกัน', defaultPrice: 1200, defaultDfType: 'PERCENT', defaultDfRate: 50, defaultDurationMinutes: 30 },
    { code: 'D20', nameTh: 'อุดฟันคอมโพสิตเรซิน 1 ด้าน', category: 'ทันตกรรมบูรณะ', defaultPrice: 900, defaultDfType: 'PERCENT', defaultDfRate: 50, defaultDurationMinutes: 30 },
    { code: 'D21', nameTh: 'อุดฟันคอมโพสิตเรซิน 2 ด้าน', category: 'ทันตกรรมบูรณะ', defaultPrice: 1400, defaultDfType: 'PERCENT', defaultDfRate: 50, defaultDurationMinutes: 45 },
    { code: 'D30', nameTh: 'ถอนฟันแท้ทั่วไป', category: 'ศัลยศาสตร์ช่องปาก', defaultPrice: 1000, defaultDfType: 'PERCENT', defaultDfRate: 50, defaultDurationMinutes: 30 },
    { code: 'D31', nameTh: 'ผ่าฟันคุดระดับปานกลาง', category: 'ศัลยศาสตร์ช่องปาก', defaultPrice: 3500, defaultDfType: 'PERCENT', defaultDfRate: 55, defaultDurationMinutes: 45 },
    { code: 'D40', nameTh: 'รักษารากฟันหน้า (Incisor RCT)', category: 'รักษารากฟัน', defaultPrice: 4500, defaultDfType: 'PERCENT', defaultDfRate: 60, defaultDurationMinutes: 60 },
    { code: 'D41', nameTh: 'รักษารากฟันกราม (Molar RCT)', category: 'รักษารากฟัน', defaultPrice: 7500, defaultDfType: 'PERCENT', defaultDfRate: 60, defaultDurationMinutes: 60 },
    { code: 'D50', nameTh: 'ครอบฟัน Zirconia All-Ceramic', category: 'ทันตกรรมประดิษฐ์', defaultPrice: 12000, defaultDfType: 'PERCENT', defaultDfRate: 50, defaultDurationMinutes: 45 },
    { code: 'D60', nameTh: 'ฟอกสีฟัน Cool Light ในคลินิก', category: 'ทันตกรรมเพื่อความงาม', defaultPrice: 5500, defaultDfType: 'PERCENT', defaultDfRate: 45, defaultDurationMinutes: 60 },
    { code: 'D70', nameTh: 'ปรับเครื่องมือจัดฟันประจำเดือน', category: 'ทันตกรรมจัดฟัน', defaultPrice: 1500, defaultDfType: 'PERCENT', defaultDfRate: 50, defaultDurationMinutes: 30 },
    { code: 'D71', nameTh: 'รีเทนเนอร์แบบใส (Clear Retainer) ต่อชิ้น', category: 'ทันตกรรมจัดฟัน', defaultPrice: 2000, defaultDfType: 'PERCENT', defaultDfRate: 40, defaultDurationMinutes: 20 },
  ];

  for (const p of procedures) {
    await prisma.procedureCatalog.create({ data: p });
  }

  // 8. Standard Diagnosis Catalog
  const diagnoses = [
    { code: 'K02.1', nameTh: 'โรคฟันผุถึงชั้นเนื้อฟัน (Dental caries of dentine)', category: 'ฟันผุ' },
    { code: 'K05.0', nameTh: 'เหงือกอักเสบเฉียบพลัน (Acute gingivitis)', category: 'ปริทันต์' },
    { code: 'K05.1', nameTh: 'เหงือกอักเสบเรื้อรังและหินปูน (Chronic gingivitis)', category: 'ปริทันต์' },
    { code: 'K04.0', nameTh: 'โพรงประสาทฟันอักเสบ (Pulpitis)', category: 'รักษารากฟัน' },
    { code: 'K07.2', nameTh: 'ฟันซ้อนเก / การสบฟันผิดปกติ (Malocclusion)', category: 'จัดฟัน' },
    { code: 'K01.1', nameTh: 'ฟันกรามคุด (Impacted teeth)', category: 'ศัลยกรรม' },
  ];

  for (const d of diagnoses) {
    await prisma.diagnosisCatalog.create({ data: d });
  }

  // 9. Ortho Packages
  const pkgOrthoMetal = await prisma.orthoPackage.create({
    data: {
      name: 'จัดฟันโลหะ Mini Diamond',
      totalAmount: 45000,
      downPayment: 5000,
      installmentCount: 24,
      installmentAmount: 1500,
      description: 'จัดฟันโลหะขนาดเล็ก ประสิทธิภาพสูง พร้อมฟรีเอกซเรย์ พิมพ์ปาก และรีเทนเนอร์ 1 คู่',
      isActive: true,
    },
  });

  const pkgOrthoClear = await prisma.orthoPackage.create({
    data: {
      name: 'จัดฟันเซรามิกใส Clear Braces',
      totalAmount: 55000,
      downPayment: 7000,
      installmentCount: 24,
      installmentAmount: 2000,
      description: 'แบร็กเก็ตเซรามิกสีเหมือนฟัน สวยงามเป็นธรรมชาติ',
      isActive: true,
    },
  });

  // 10. Inventory Items
  const invAmox = await prisma.inventoryItem.create({
    data: {
      code: 'MED-001',
      name: 'Amoxicillin 500mg',
      category: 'DRUG',
      unit: 'แผง (10 เม็ด)',
      minStockAlert: 20,
      currentStock: 100,
      costPrice: 35.0,
      salePrice: 90.0,
    },
  });

  const invIbu = await prisma.inventoryItem.create({
    data: {
      code: 'MED-002',
      name: 'Ibuprofen 400mg',
      category: 'DRUG',
      unit: 'แผง (10 เม็ด)',
      minStockAlert: 15,
      currentStock: 80,
      costPrice: 28.0,
      salePrice: 80.0,
    },
  });

  const invPara = await prisma.inventoryItem.create({
    data: {
      code: 'MED-003',
      name: 'Paracetamol 500mg',
      category: 'DRUG',
      unit: 'แผง (10 เม็ด)',
      minStockAlert: 30,
      currentStock: 150,
      costPrice: 12.0,
      salePrice: 40.0,
    },
  });

  const invCompA2 = await prisma.inventoryItem.create({
    data: {
      code: 'MAT-001',
      name: 'Composite Resin A2 (3M Filtek Z250)',
      category: 'DENTAL_SUPPLY',
      unit: 'หลอด (4g)',
      minStockAlert: 5,
      currentStock: 15,
      costPrice: 1100.0,
      salePrice: 0.0,
    },
  });

  const invGloves = await prisma.inventoryItem.create({
    data: {
      code: 'MAT-005',
      name: 'ถุงมือยางตรวจโรค Nitrile ไซส์ M (กล่อง 100 ชิ้น)',
      category: 'CONSUMABLE',
      unit: 'กล่อง',
      minStockAlert: 10,
      currentStock: 30,
      costPrice: 180.0,
      salePrice: 0.0,
    },
  });

  await prisma.procedureStockLink.create({
    data: {
      procedureCode: 'D20',
      inventoryItemId: invCompA2.id,
      requiredQty: 1,
      autoDeductOn: 'PROCEDURE_DONE',
    },
  });

  // 11. Sample Patients
  const todayStr = new Date().toISOString().split('T')[0];

  const p1 = await prisma.patient.create({
    data: {
      dn: 'DN-260001',
      title: 'นาย',
      firstNameTh: 'สมชาย',
      lastNameTh: 'ใจดี',
      firstNameEn: 'Somchai',
      lastNameEn: 'Jaidee',
      gender: 'MALE',
      birthDate: '1988-05-14',
      phone: '081-234-5678',
      email: 'somchai.j@example.com',
      address: '45/12 ซอยทองหล่อ 10 แขวงคลองตันเหนือ เขตวัฒนา กรุงเทพฯ',
      emergencyContactName: 'นางสมศรี ใจดี (ภรรยา)',
      emergencyContactPhone: '081-876-5432',
      emergencyRelation: 'ภรรยา',
      rights: 'จ่ายเอง',
      attendingDoctorId: doctorMin.id,
      drugAllergies: 'แพ้ยา Penicillin และกลุ่ม Beta-lactam (ผื่นคัน แน่นหน้าอก)',
      chronicDiseases: 'ความดันโลหิตสูง (ทานยาควบคุมสม่ำเสมอ)',
      currentMedications: 'Amlodipine 5mg วันละ 1 เม็ด',
      marketingSource: 'Facebook',
      depositBalance: 500.0,
      notes: 'คนไข้กังวลเรื่องการกรอฟัน นุ่มนวลเป็นพิเศษ',
    },
  });

  const p2 = await prisma.patient.create({
    data: {
      dn: 'DN-260002',
      title: 'นางสาว',
      firstNameTh: 'พิมพ์ชนก',
      lastNameTh: 'สดใส',
      firstNameEn: 'Pimchanok',
      lastNameEn: 'Sodsai',
      gender: 'FEMALE',
      birthDate: '2001-09-22',
      phone: '089-876-5432',
      email: 'pim.sod@example.com',
      address: '88/4 อาคารลุมพินี ถนนสุขุมวิท เขตคลองเตย กรุงเทพฯ',
      emergencyContactName: 'นายประสิทธิ์ สดใส (บิดา)',
      emergencyContactPhone: '089-111-9999',
      emergencyRelation: 'บิดา',
      rights: 'จ่ายเอง',
      attendingDoctorId: doctorMin.id,
      drugAllergies: 'ไม่มีประวัติแพ้ยา',
      chronicDiseases: 'ไม่มี',
      marketingSource: 'TikTok',
      depositBalance: 0.0,
      notes: 'เคสจัดฟันโลหะ Mini Diamond',
    },
  });

  const p3 = await prisma.patient.create({
    data: {
      dn: 'DN-260003',
      title: 'นาย',
      firstNameTh: 'อนันต์',
      lastNameTh: 'วรรณกิจ',
      firstNameEn: 'Anan',
      lastNameEn: 'Wannakit',
      gender: 'MALE',
      birthDate: '1975-11-03',
      phone: '086-555-1234',
      address: '102 หมู่บ้านเสรีภาพ อ่อนนุช กรุงเทพฯ',
      rights: 'ประกันสังคม (สปส.)',
      attendingDoctorId: doctorPreem.id,
      drugAllergies: 'ไม่มีประวัติแพ้ยา',
      chronicDiseases: 'เบาหวานชนิดที่ 2 (HbA1c = 6.8)',
      marketingSource: 'คนไข้เก่าแนะนำ',
      depositBalance: 0.0,
    },
  });

  const p4 = await prisma.patient.create({
    data: {
      dn: 'DN-260004',
      title: 'นางสาว',
      firstNameTh: 'กัญญา',
      lastNameTh: 'รักษ์ดี',
      firstNameEn: 'Kanya',
      lastNameEn: 'Rakdee',
      gender: 'FEMALE',
      birthDate: '1995-02-18',
      phone: '090-444-7777',
      rights: 'จ่ายเอง',
      attendingDoctorId: doctorPreem.id,
      drugAllergies: 'แพ้ยา Sulfa',
      chronicDiseases: 'ไม่มี',
      marketingSource: 'Walk-in',
      depositBalance: 0.0,
    },
  });

  // Assign Ortho Package to Patient 2 (Pimchanok)
  const patientPkg = await prisma.patientOrthoPackage.create({
    data: {
      patientId: p2.id,
      packageId: pkgOrthoMetal.id,
      packageName: pkgOrthoMetal.name,
      totalAmount: pkgOrthoMetal.totalAmount,
      downPayment: pkgOrthoMetal.downPayment,
      paidAmount: 8000.0,
      balanceDue: 37000.0,
      status: 'ACTIVE',
      notes: 'เริ่มติดเครื่องมือเมื่อ 2 เดือนก่อน ฟันล่างซ้อนเก',
    },
  });

  for (let i = 1; i <= 24; i++) {
    await prisma.orthoInstallment.create({
      data: {
        patientOrthoPackageId: patientPkg.id,
        installmentNo: i,
        plannedAmount: 1500,
        paidAmount: i <= 2 ? 1500 : 0,
        status: i <= 2 ? 'PAID' : 'PENDING',
        paidDate: i <= 2 ? new Date() : null,
      },
    });
  }

  // Tooth conditions for Patient 1 (Somchai)
  await prisma.toothCondition.create({
    data: {
      patientId: p1.id,
      toothNumber: '16',
      conditionType: 'FILLING',
      surfaces: 'MO',
      notes: 'อุดคอมโพสิตเดิม ขอบยังแนบสนิทดี',
      recordedByName: 'ทพ. มินตรา',
    },
  });
  await prisma.toothCondition.create({
    data: {
      patientId: p1.id,
      toothNumber: '36',
      conditionType: 'CARIES',
      surfaces: 'O',
      notes: 'ผุระยะเนื้อฟัน แนะนำอุดคอมโพสิต',
      recordedByName: 'ทพ. มินตรา',
    },
  });

  // Lab order for Patient 4 (Kanya)
  await prisma.labOrder.create({
    data: {
      orderNo: 'LAB-2026-0001',
      patientId: p4.id,
      doctorId: doctorPreem.id,
      toothNumber: '21',
      workType: 'CROWN',
      labCompanyName: 'โมเดิร์น เดนทัล แลป (กรุงเทพฯ)',
      dueDate: new Date(Date.now() + 7 * 86400000),
      status: 'IN_PROGRESS',
      cost: 3200.0,
      invoiceNo: 'MDL-8891',
      deductionType: 'DOCTOR',
      shadeGuide: 'A2 (ตามรูปถ่ายคู่เทียบ)',
      instructions: 'ครอบฟัน Zirconia All-Ceramic ซี่ 21 ขอบ Gingival Margin ละเอียดตามตัวอย่างพิมพ์ปาก',
    },
  });

  // 12. Today Appointments & Visits
  const app1 = await prisma.appointment.create({
    data: {
      branchId: branch.id,
      patientId: p1.id,
      doctorId: doctorMin.id,
      roomId: room1.id,
      date: todayStr,
      startTime: '09:30',
      endTime: '10:00',
      durationMinutes: 30,
      typeId: typeScaling.id,
      typeName: typeScaling.name,
      status: 'CONFIRMED',
      notes: 'คนไข้โทรคอนเฟิร์มเมื่อวาน',
      bookedBy: 'สมศรี เคาน์เตอร์',
    },
  });

  const visit1 = await prisma.visit.create({
    data: {
      visitNumber: `VN-${todayStr.replace(/-/g, '')}-001`,
      appointmentId: app1.id,
      patientId: p1.id,
      doctorId: doctorMin.id,
      roomId: room1.id,
      branchId: branch.id,
      visitDate: todayStr,
      queueNumber: 1,
      status: 'WAITING_EXAM',
      checkInBy: 'สมศรี เคาน์เตอร์',
      notes: 'มาตรงเวลา ตรวจวัดความดัน 128/82 mmHg',
    },
  });

  await prisma.appointment.create({
    data: {
      branchId: branch.id,
      patientId: p2.id,
      doctorId: doctorMin.id,
      roomId: room1.id,
      date: todayStr,
      startTime: '10:30',
      endTime: '11:00',
      durationMinutes: 30,
      typeId: typeOrthoAdjust.id,
      typeName: typeOrthoAdjust.name,
      status: 'CONFIRMED',
      notes: 'นัดปรับลวด งวดที่ 3',
      bookedBy: 'สมศรี เคาน์เตอร์',
    },
  });

  await prisma.appointment.create({
    data: {
      branchId: branch.id,
      patientId: p3.id,
      doctorId: doctorPreem.id,
      roomId: room2.id,
      date: todayStr,
      startTime: '13:30',
      endTime: '14:30',
      durationMinutes: 60,
      typeId: typeRootCanal.id,
      typeName: typeRootCanal.name,
      status: 'BOOKED',
      notes: 'รักษารากฟันกราม ครั้งที่ 2',
      bookedBy: 'สมศรี เคาน์เตอร์',
    },
  });

  // Deposit record for Patient 1
  await prisma.deposit.create({
    data: {
      patientId: p1.id,
      amount: 500.0,
      balanceAfter: 500.0,
      type: 'RECEIVE',
      paymentMethod: 'TRANSFER',
      notes: 'วางเงินมัดจำค่าจองคิวขูดหินปูนและอุดฟันล่วงหน้า',
      processedBy: 'สมศรี เคาน์เตอร์',
    },
  });

  // Audit log
  await prisma.auditLog.create({
    data: {
      branchId: branch.id,
      userId: doctorMinUser.id,
      userName: 'ทพ. มินตรา (เจ้าของคลินิก)',
      action: 'SYSTEM_INITIALIZATION',
      entityType: 'System',
      entityId: 'default',
      details: 'เริ่มต้นระบบคลินิกทันตกรรมหมอมิน หมอพรีม สำเร็จเรียบร้อย',
    },
  });

  console.log('Clean seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
