# คลินิกทันตกรรมหมอมิน หมอพรีม (Min & Preem Dental Clinic)
## เว็บแอปพลิเคชันบริหารงานคลินิกทันตกรรมครบวงจร (Dental Clinic Management System)

เว็บแอปพลิเคชันบริหารคลินิกทันตกรรมภาษาไทย ออกแบบตามมาตรฐานเวชปฏิบัติทันตกรรม สำหรับเจ้าของคลินิก พนักงานหน้าเคาน์เตอร์ ทันตแพทย์ ผู้ช่วย และฝ่ายการเงิน เชื่อมต่อทุกขั้นตอนการทำงานตั้งแต่ **ค้นหา/ลงทะเบียนคนไข้ → นัดหมาย/รับ Walk-in → เช็กอินออกคิว → ตรวจและบันทึกเวชระเบียน (EMR + FDI Tooth Chart) → รับชำระเงินหลายช่องทาง → ออกใบเสร็จรับเงิน (A4/80mm) → นัดหมายครั้งถัดไป → ปิดยอดประจำวัน (Daily Close)** บนฐานข้อมูลเดียวกัน ข้อมูลคงอยู่ถาวรหลังรีเฟรช และส่งต่อข้อมูลระหว่างแผนกได้จริง

---

## 🚀 วิธีการติดตั้งและเริ่มใช้งาน (Quick Start)

### ข้อกำหนดระบบ (Prerequisites)
- **Node.js**: v18.17+ หรือ v20+ / v22+ / v24+
- **ระบบปฏิบัติการ**: Windows, macOS หรือ Linux

### ขั้นตอนการเปิดระบบ
1. **ติดตั้ง Dependencies** (หากยังไม่ได้ติดตั้ง):
   ```bash
   npm install
   ```

2. **ซิงค์ฐานข้อมูลและสร้างข้อมูลจำลองเริ่มต้น (Seed Data)**:
   ```bash
   npm run db:push
   npm run db:seed
   ```

3. **เปิดเซิร์ฟเวอร์สำหรับใช้งาน (Development Server)**:
   ```bash
   npm run dev
   ```
   เปิดเบราว์เซอร์ไปที่: **http://localhost:3000**

4. **ทดสอบ Build ในโหมด Production**:
   ```bash
   npm run build
   npm run start
   ```

5. **รันชุดทดสอบเกณฑ์ส่งมอบ 7 ข้อบังคับ (7 Critical Acceptance Tests)**:
   ```bash
   npm run test:critical
   ```

---

## 👥 บัญชีผู้ใช้จำลองและบทบาทในระบบ (Demo Accounts)

ระบบมี **แถบสลับบทบาทจำลอง (Fast Role Switcher)** อยู่ที่มุมขวาบนของทุกหน้า สามารถคลิกสลับบทบาทเพื่อทดสอบสิทธิ์และการมองเห็นได้ทันที:

| บทบาท (Role) | บัญชี (Username) | รหัสผ่าน | หน้าที่และการเข้าถึงหลัก |
| :--- | :--- | :--- | :--- |
| **เจ้าของคลินิก / ผู้ดูแล** | `admin` | `password123` | สิทธิ์สูงสุดทุกหน้า, จัดการตั้งค่าคลินิก, อนุมัติส่วนลด, ปลดล็อคยอดปิดกะ, ดูรายงาน DF และดาวน์โหลดไฟล์สำรองข้อมูล |
| **พนักงานเคาน์เตอร์** | `counter` | `password123` | ปฏิทินนัดหมาย, คิววันนี้, รับ Walk-in, เช็กอินคนไข้, ลงทะเบียนคนไข้ใหม่, เปิดบิลรับชำระเงิน, ออกใบเสร็จ |
| **ทันตแพทย์ (หมอมิน)** | `doctormin` | `password123` | จัดฟันและทันตกรรมทั่วไป, ดูคิวตรวจ, บันทึกเวชระเบียน EMR, ลงผังฟัน FDI, สั่งยา/พิมพ์ฉลาก, ดู DF ตนเอง |
| **ทันตแพทย์ (หมอพรีม)** | `doctorpreem` | `password123` | รักษารากฟันและเพื่อความงาม, ตรวจ EMR, ผังฟัน, ส่งใบสั่งทำแลป, ติดตามงานแลป |
| **ผู้ช่วยทันตแพทย์** | `assistant` | `password123` | คิวตรวจ, ดูผังฟัน, เบิกใช้วัสดุในคลัง, ตรวจรับงานแลปจากบริษัทส่งของ |
| **ฝ่ายการเงิน / แคชเชียร์** | `finance` | `password123` | คิวรอชำระ, รับชำระแยกหลายช่องทาง, ใช้มัดจำ, ออกใบเสร็จ, ยกเลิกใบเสร็จ, ปิดยอดประจำวัน (Daily Close) |

---

## 🦷 โครงสร้างฟังก์ชันการทำงานหลัก (Feature Highlights)

### 1. ปฏิทิน นัดหมาย และคิววันนี้ (Calendar & Queue)
- แสดงปฏิทินวันนี้ทันทีเมื่อเปิดแอป
- สลับคอลัมน์ได้ระหว่าง **แยกตามห้องตรวจ (Rooms)** หรือ **แยกตามทันตแพทย์ (Dentists)**
- ป้องกันการจองแพทย์หรือห้องซ้อนกันที่ฝั่งเซิร์ฟเวอร์ (Server-side Concurrency Protection)
- ฟอร์มนัดหมายเลือกประเภทนัดพร้อมระบุระยะเวลาเริ่มต้น และระยะเวลานัดติดตามผล
- ระบบเช็กอินสร้างคิวตรวจ (VN) พร้อมป้องกันการเช็กอินซ้ำ (Idempotent Check-in)
- ปุ่ม **+ รับ Walk-in** สร้างคิวตรวจเข้าระบบได้ทันทีโดยไม่ต้องนัดล่วงหน้า

### 2. ทะเบียนคนไข้และเวชระเบียน (Patients & EMR)
- สร้างเลขคนไข้ **DN** ไม่ซ้ำกัน (เช่น `DN-260001`) และรองรับเลขเดิม
- ระบบตรวจจับและแจ้งเตือนข้อมูลซ้ำ (Duplicate Warning) ตามชื่อหรือเบอร์โทร
- **Medical Alerts Banner**: แสดงข้อมูลแพ้ยาและโรคประจำตัวด้วยแถบสีแดงเด่นชัดเพื่อความปลอดภัย
- ผังฟันสากล **FDI Tooth Chart**:
  - รองรับทั้งฟันแท้ (Permanent: 11-48 รวม 32 ซี่) และฟันน้ำนม (Primary: 51-85 รวม 20 ซี่)
  - เลือกระบุด้านฟันได้: M (Mesial), O (Occlusal), D (Distal), B (Buccal), L (Lingual)
  - บันทึกรอยโรค: ฟันผุ (Caries), อุดฟัน (Filling), ครอบฟัน (Crown), ถอนแล้ว (Missing), รักษาราก (RCT)
  - เก็บประวัติการตรวจแยกแต่ละซี่พร้อมวันเวลาและชื่อแพทย์ผู้ตรวจ
- **Electronic Signing EMR**: บันทึกฉบับร่าง (Draft) หรือลงนามรับรอง หากแก้ไขหลังลงนามต้องระบุเหตุผลและเก็บประวัติฉบับเดิม
- **ระบบสั่งจ่ายยา & ฉลากยา**: บันทึกรายการยา จำนวน วิธีใช้ พร้อมหน้าจอตรวจสอบก่อนพิมพ์ฉลากยา

### 3. การเงิน ออกบิล ใบเสร็จ และค่าแพทย์ (Billing, Receipts & Doctor Fee)
- ส่งรายการรักษาจากห้องตรวจเข้าคิวรอชำระเงินหน้าเคาน์เตอร์แบบเรียลไทม์
- **รับชำระเงินหลายช่องทางในบิลเดียว (Split Payment)** เช่น บิล 1,000 บาท จ่ายเงินสด 300 บาท + โอน PromptPay 500 บาท แสดงยอดค้าง 200 บาท
- **การเงินตามวันที่รับจริง (Cash-Basis Reporting)**: รับชำระเพิ่มในวันถัดไป เงินจะเข้ารายงานตามวันที่รับเงินจริง
- **ระบบเงินมัดจำ (Deposits)**: รับมัดจำ, นำมัดจำมาหักชำระบิล (ไม่นับเป็นรายรับเงินสดซ้ำ), และคืนเงินมัดจำ
- **ใบเสร็จรับเงินมาตรฐาน**:
  - สลับพิมพ์ได้ทั้งขนาด **A4 เต็มรูปแบบ** และ **สลิปความร้อน 80mm**
  - แสดงข้อมูลคลินิก โลโก้ เลขผู้เสียภาษี รายการรักษา และช่องทางชำระ
  - การยกเลิกใบเสร็จ (Void): ต้องมีสิทธิ์ มีเหตุผล และปรับปรุงยอดค้างชำระย้อนกลับอัตโนมัติ
- **Doctor Fee (DF)**: บันทึกอัตรา DF ณ เวลาทำรายการ (Snapshot) หักค่าแลปตามนโยบายคลินิก

### 4. แพ็กเกจจัดฟัน งานแลป และคลังเวชภัณฑ์ (Ortho, Lab & Inventory)
- **แพ็กเกจจัดฟัน**: ตารางผ่อนชำระ 24 งวด บันทึกประวัติปรับเครื่องมือ (ลวดบน/ล่าง, ยางดึง) และเป้าหมายนัดถัดไป
- **งานแลปทันตกรรม**: ใบส่งแลป ครอบฟัน สะพานฟัน รีเทนเนอร์ ติดตามสถานะ (ส่งแล้ว → กำลังทำ → ได้รับแล้ว → ส่งแก้ Rework → ใส่ให้คนไข้)
- **คลังเวชภัณฑ์**: ยาและวัสดุ แยกหน่วย ยอดคงเหลือ แจ้งเตือนจุดสั่งซื้อขั้นต่ำ (Reorder Point) บันทึกรับเข้า เบิก คืน ปรับยอด และตัดสต๊อกอัตโนมัติตามหัตถการ

### 5. รายงาน แดชบอร์ด และปิดยอดประจำวัน (Reports & Daily Close)
- แดชบอร์ดวิเคราะห์ยอดผู้มารักษา นัดใหม่ ไม่มาตามนัด รายได้ และเงินที่รับจริง
- รายงาน 10 แท็บ: รายการรักษา, ใบเสร็จ, วิธีชำระเงิน, รายได้แพทย์/DF, ค่าแลป, ใบเสร็จยกเลิก, ค้างชำระ, ส่วนลด, ลูกหนี้สิทธิ, เงินมัดจำ
- **ปิดยอดประจำวัน (Daily Close)**: เปรียบเทียบยอดระบบกับยอดเงินสด/สลิปที่ตรวจนับได้ บันทึกส่วนต่างและผู้ปิดกะ การปลดล็อคต้องระบุเหตุผล
- ส่งออกไฟล์ **Excel / CSV** จากข้อมูลชุดเดียวกับบนหน้าจอ
- การวิเคราะห์ช่วงเวลาที่มีคนไข้หนาแน่น (Peak Hours Traffic Analysis)

---

## 🧪 ผลการทดสอบเกณฑ์ส่งมอบ 7 ข้อ (7 Critical Acceptance Tests Results)

รันคำสั่ง `npm run test:critical` หรือ `node tests/critical-tests.js` เพื่อตรวจสอบอัตโนมัติ:

```text
================================================================
🧪 RUNNING VERIFICATION SUITE: 7 CRITICAL ACCEPTANCE TESTS
================================================================

--- TEST CASE 1: End-to-End Patient Flow ---
✓ 1.1 Created patient: ณัฐพล ใจงาม (DN-TEST-4233)
✓ 1.2 Booked appointment: 2026-11-25 10:00 - 10:30 with หมอมิน
✓ 1.3 Checked in visit: VN-20261125-001 Queue #1
✓ 1.4 Recorded treatment: อุดฟันคอมโพสิตเรซิน 1 ด้าน tooth #24 (Net: 900฿, DF: 450฿)
✓ 1.5 Issued receipt: REC-TEST-4326 Amount: 900฿
✓ 1.6 Scheduled next appointment: 2026-12-10 11:00
✅ TEST CASE 1 PASSED: Complete patient journey verified successfully.

--- TEST CASE 2: Server-side Concurrency & Double-Booking Protection ---
✓ 2.1 First booking placed: Doctor Min 2026-11-26 14:00 - 14:30
✓ 2.2 Second simultaneous booking successfully rejected with message: "แพทย์ (ทพ. มินตรา รัตนเวชกุล) มีนัดหมายแล้วในช่วงเวลา 14:00 - 14:30 น."
✅ TEST CASE 2 PASSED: Double booking prevented with clear rejection notification.

--- TEST CASE 3: Multi-channel Split Payment & Cash-Basis Reporting ---
✓ 3.1 Paid 300฿ (transfer) + 500฿ (cash). Outstanding balance correctly shows: 200฿
✓ 3.2 Paid remaining 200฿ on Day 2. Invoice status: PAID
✓ 3.3 Cash-basis report: Day 1 = 800฿, Day 2 = 200฿ strictly matching receipt dates
✅ TEST CASE 3 PASSED: Split payment and cash-basis reporting verified.

--- TEST CASE 4: Idempotency & Duplicate Prevention ---
✓ 4.1 Double check-in handled idempotently: exactly 1 visit record exists (ID: cmwua1w17000qxz2qqz170kjh)
✅ TEST CASE 4 PASSED: Duplicate check-in / double-click protection verified.

--- TEST CASE 5: Deposit Usage (No Double Revenue) & Receipt Voiding ---
✓ 5.1 Deposit payment processed: isDepositUse = true. Fresh cash counted: 0฿ (Correct: No double counting)
✓ 5.2 Receipt REC-VOID-4514 voided: Invoice balance reversed to 500฿ and audit log preserved
✅ TEST CASE 5 PASSED: Deposit non-duplication and receipt voiding verified.

--- TEST CASE 6: Role Security & Server-Side Permission Checks ---
✓ 6.1 Role 'COUNTER' access to EMR: BLOCKED (403 Forbidden)
✓ 6.2 Role 'ASSISTANT' access to Financial Reports: BLOCKED (403 Forbidden)
✓ 6.3 Role 'DENTIST' access to EMR: ALLOWED (Authorized)
✅ TEST CASE 6 PASSED: Role-based authorization matrix enforced.

--- TEST CASE 7: Data Persistence & Multi-Role Status Consistency ---
✓ 7.1 Database Persistence verified:
    - Patients: 5
    - Appointments: 7
    - Visits: 3
    - Invoices: 3
    - Receipts: 2
    - Inventory Items: 5
✅ TEST CASE 7 PASSED: Data persists reliably in SQLite database with coherent multi-role state.

================================================================
🎉 TEST SUMMARY: 7 / 7 TESTS PASSED (ALL CRITERIA VERIFIED)
================================================================
```

---

## 📁 โครงสร้างโปรเจกต์ (Project Architecture)

```
CLINIC-min&pream/
├── prisma/
│   ├── schema.prisma          # โครงสร้างฐานข้อมูลคลินิกครบทุกโมเดล
│   └── seed.js                # สคริปต์สร้างข้อมูลคลินิกและข้อมูลตัวอย่างเริ่มต้น
├── src/
│   ├── app/
│   │   ├── api/               # Server-side API Routes (26 routes ปลอดภัยด้วย RBAC)
│   │   │   ├── appointments/  # จองนัด เลื่อนนัด ยกเลิก พร้อม concurrency check
│   │   │   ├── auth/          # เซสชันและระบบสลับบทบาทจำลอง
│   │   │   ├── daily-close/   # ปิดยอดประจำวันและขอเปิดแก้ยอด
│   │   │   ├── deposits/      # เงินมัดจำ (รับ/ใช้/คืน)
│   │   │   ├── inventory/     # คลังยา วัสดุ และประวัติการเคลื่อนไหว
│   │   │   ├── invoices/      # บิล คิดเงิน และรับชำระเงินหลายช่องทาง
│   │   │   ├── lab/           # ใบส่งแลป ติดตามสถานะ ส่งแก้
│   │   │   ├── ortho/         # แพ็กเกจจัดฟันและงวดผ่อนชำระ
│   │   │   ├── patients/      # ทะเบียนคนไข้ ตรวจซ้ำ ผังฟัน แผนรักษา
│   │   │   ├── queue/         # คิวรอตรวจ กำลังตรวจ รอชำระ และเช็กอิน
│   │   │   ├── receipts/      # ใบเสร็จรับเงินและการยกเลิกใบเสร็จ
│   │   │   ├── reports/       # แดชบอร์ดและรายงานการเงิน 10 หมวด
│   │   │   ├── settings/      # ตั้งค่าคลินิก นำเข้า CSV สำรองข้อมูล
│   │   │   └── visits/        # บันทึก EMR ลงนาม และสั่งยา
│   │   ├── appointments/      # หน้ารายการนัดหมายและการจัดการ
│   │   ├── billing/           # หน้าการเงิน บิล และใบเสร็จรับเงิน (A4/80mm)
│   │   ├── emr/               # หน้าเข้าตรวจทันตกรรม ลงนาม EMR พิมพ์ฉลากยา
│   │   ├── inventory/         # หน้าคลังยา เวชภัณฑ์ และแจ้งเตือนจุดสั่งซื้อ
│   │   ├── lab/               # หน้าติดตามงานแลปทันตกรรม
│   │   ├── ortho/             # หน้าติดตามคนไข้จัดฟันและตารางงวด
│   │   ├── patients/          # หน้ารายชื่อคนไข้และแฟ้มประวัติ 8 แท็บ
│   │   ├── reports/           # หน้ารายงานสรุปยอดและปิดยอดประจำวัน
│   │   ├── settings/          # หน้าตั้งค่าองค์กร LINE OA และนำเข้าข้อมูล
│   │   ├── layout.tsx         # Root Layout พร้อมภาษาไทยและ Navbar
│   │   └── page.tsx           # หน้าหลัก: ปฏิทินและคิววันนี้
│   ├── components/
│   │   ├── Navbar.tsx         # เมนูหลัก นาฬิกาไทย และแถบสลับบทบาทผู้ใช้
│   │   ├── FdiToothChart.tsx  # ผังฟันสากล FDI (Permanent & Deciduous)
│   │   ├── NewAppointmentModal.tsx # หน้าต่างเพิ่มนัดหมายพร้อมตรวจนัดซ้อน
│   │   ├── WalkInModal.tsx    # หน้าต่างรับคนไข้ Walk-in
│   │   └── NewPatientModal.tsx# หน้าต่างลงทะเบียนคนไข้พร้อมเตือนข้อมูลซ้ำ
│   └── lib/
│       ├── auth-types.ts      # กำหนดสิทธิ์และโครงสร้างผู้ใช้ (Client-safe)
│       ├── auth.ts            # การตรวจสอบสิทธิ์เซิร์ฟเวอร์ (Server-side RBAC)
│       ├── prisma.ts          # Prisma Client Singleton
│       └── utils.ts           # แปลงเวลาไทย สกุลเงินบาท และการตั้งค่าผังฟัน
├── tests/
│   └── critical-tests.js      # ชุดทดสอบเกณฑ์ส่งมอบ 7 ข้อ
└── package.json
```

---

## 🔒 ความปลอดภัยและข้อกำหนดทางเทคนิค (Security & Technical Specs)

1. **การคำนวณเงิน**: ใช้ตัวเลขทศนิยมความละเอียดสูง ป้องกันความผิดพลาดจากการปัดเศษ และใช้ธุรกรรมฐานข้อมูล (Prisma Atomic Transactions)
2. **การปกป้องข้อมูลอ่อนไหว**: จำกัดสิทธิ์การเข้าถึงเวชระเบียนสุขภาพและการเงินตามบทบาท (RBAC) ทั้งใน UI และทุกคำขอ API ฝั่งเซิร์ฟเวอร์
3. **Audit Trail**: บันทึกประวัติการแก้ไขเวชระเบียนหลังลงนาม, การยกเลิกใบเสร็จ, การคืนเงินมัดจำ, และการปลดล็อคยอดปิดกะลงในตาราง `AuditLog`
4. **ความคงอยู่ของข้อมูล (Data Persistence)**: ข้อมูลจัดเก็บบนฐานข้อมูล SQLite แบบฝังตัว มีระบบสำรองข้อมูลเป็นไฟล์ JSON เพื่อความปลอดภัยสูงสุด
