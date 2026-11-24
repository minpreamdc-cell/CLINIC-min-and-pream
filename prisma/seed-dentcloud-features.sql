-- 1. Sample Deposits (มัดจำรับเข้า, ตัดใช้, ยอดคงเหลือ)
INSERT OR REPLACE INTO "Deposit" ("id", "patientId", "date", "type", "amount", "balanceAfter", "paymentMethod", "notes", "processedBy", "createdAt") 
VALUES 
('dep-001', 'cmwucjf4q0029f8u830wq4hv3', '2026-11-20T09:00:00.000Z', 'RECEIVE', 5000.0, 5000.0, 'PROMPTPAY', 'มัดจำจัดฟันเริ่มต้น (Mini Diamond)', 'คุณสมศรี (เคาน์เตอร์)', '2026-11-20T09:00:00.000Z'),
('dep-002', 'cmwucjf4q0029f8u830wq4hv3', '2026-11-24T10:00:00.000Z', 'USE', 1500.0, 3500.0, 'PROMPTPAY', 'ตัดใช้ชำระค่างวดปรับเครื่องมืองวดที่ 1', 'คุณสมศรี (เคาน์เตอร์)', '2026-11-24T10:00:00.000Z'),
('dep-003', 'cmwucjf5d002df8u8w6g55aek', '2026-11-22T14:30:00.000Z', 'RECEIVE', 3000.0, 3000.0, 'CASH', 'มัดจำงานแลปครอบฟัน Zirconia', 'คุณสมศรี (เคาน์เตอร์)', '2026-11-22T14:30:00.000Z');

-- 2. Sample Insurance Claims (ลูกหนี้สิทธิ ประกันสังคม 900 บาท / สปสช.)
INSERT OR REPLACE INTO "InsuranceClaim" ("id", "invoiceId", "patientId", "rightsType", "claimAmount", "submittedDate", "status", "receivedAmount", "differenceAmount", "reconciledAt", "reconciledBy", "notes", "createdAt", "updatedAt")
VALUES
('claim-001', 'cmwucjfcm003wf8u8e364o25l', 'cmwucjf5d002df8u8w6g55aek', 'ประกันสังคม (สปส.)', 900.0, '2026-11-24T08:30:00.000Z', 'APPROVED', 900.0, 0.0, '2026-11-24T12:00:00.000Z', 'คุณบัญชา (ฝ่ายการเงิน)', 'สปส. อนุมัติชดเชยเต็มจำนวน ขูดหินปูน 900 บาท (ไม่สำรองจ่าย)', '2026-11-24T08:30:00.000Z', '2026-11-24T12:00:00.000Z'),
('claim-002', 'inv-sample-02', 'cmwucjf5d002df8u8w6g55aek', 'ประกันสังคม (สปส.)', 900.0, '2026-11-24T14:00:00.000Z', 'SUBMITTED', 0.0, 900.0, NULL, NULL, 'ส่งเบิกอุดฟัน 900 บาท รอ สปส. โอนชดเชยรอบสิ้นเดือน', '2026-11-24T14:00:00.000Z', '2026-11-24T14:00:00.000Z'),
('claim-003', 'inv-sample-03', 'cmwucjf4g0027f8u81kpx0k11', 'สปสช. (บัตรทอง)', 450.0, '2026-11-23T11:00:00.000Z', 'SUBMITTED', 0.0, 450.0, NULL, NULL, 'เคลมค่าถอนฟันบัตรทองโครงการทันตกรรมปฐมภูมิ', '2026-11-23T11:00:00.000Z', '2026-11-23T11:00:00.000Z');

-- 3. Sample Central Documents (X-Ray, OPD Card, Consent Form, Intraoral)
INSERT OR REPLACE INTO "PatientDocument" ("id", "patientId", "category", "title", "fileUrl", "fileType", "fileSize", "uploadedBy", "createdAt")
VALUES
('doc-001', 'cmwucjf4g0027f8u81kpx0k11', 'XRAY', 'ภาพรังสีพานอรามิก (OPG Panoramic Full Mouth)', 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=800&q=80', 'image/jpeg', 2450000, 'ทพ. มินตรา', '2026-11-20T10:15:00.000Z'),
('doc-002', 'cmwucjf4g0027f8u81kpx0k11', 'INTRAORAL', 'ภาพถ่ายรอยยิ้มและแนวสบฟันก่อนจัดฟัน (Pre-Op Smile)', 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=800&q=80', 'image/jpeg', 1820000, 'ทพ. มินตรา', '2026-11-20T10:20:00.000Z'),
('doc-003', 'cmwucjf4q0029f8u830wq4hv3', 'CONSENT_FORM', 'หนังสือยินยอมการรักษาจัดฟันและติดเครื่องมือ (Signed Consent Form)', 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80', 'application/pdf', 950000, 'คุณสมศรี', '2026-11-21T13:40:00.000Z'),
('doc-004', 'cmwucjf5d002df8u8w6g55aek', 'OPD_CARD', 'ประวัติเวชระเบียนสแกนและสิทธิประกันสังคม (OPD Card Scan)', 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80', 'application/pdf', 1200000, 'คุณสมศรี', '2026-11-22T09:10:00.000Z'),
('doc-005', 'cmwucjf5n002ff8u8qa9yonpz', 'XRAY', 'ฟิล์มเอกซเรย์เฉพาะซี่ Periapical Film ซี่ 21', 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80', 'image/jpeg', 1100000, 'ทพญ. พรีมญา', '2026-11-23T15:20:00.000Z');
