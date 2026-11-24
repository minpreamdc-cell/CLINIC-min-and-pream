'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  Stethoscope,
  ShieldAlert,
  ArrowLeft,
  CheckCircle,
  FileCheck,
  PlusCircle,
  Printer,
  CreditCard,
  AlertTriangle,
  Pill,
  HeartPulse,
  Sparkles,
  Zap,
  CheckCircle2,
} from 'lucide-react';
import { formatThaiDate, formatThaiDateTime, formatCurrency } from '@/lib/utils';
import FdiToothChart from '@/components/FdiToothChart';

// 1-Click SOAP Note Templates for Non-Tech Friendly Doctor Experience
const QUICK_EMR_TEMPLATES = [
  {
    label: '✨ ขูดหินปูนทั้งปาก',
    cc: 'มาตรวจสุขภาพฟันและขูดหินปูนประจำปี ไม่มีอาการปวดฟัน',
    pe: 'พบคราบหินปูนและคราบจุลินทรีย์ระดับปานกลางทั่วทั้งปาก เหงือกอักเสบเล็กน้อย',
    dx: 'K05.1 เหงือกอักเสบเรื้อรังและหินปูน (Chronic gingivitis)',
    tx: 'ขูดหินปูนทั้งปากด้วยเครื่อง Ultrasonic Scaler พร้อมขัดฟันด้วยแปรงและผงขัดฟัน',
    advice: 'แปรงฟันให้ถูกวิธีและใช้ไหมขัดฟันทุกวัน หากมีอาการเสียวฟันจะค่อยๆ ดีขึ้นใน 3-5 วัน',
    followUp: 'นัดตรวจสุขภาพช่องปากและขูดหินปูนทุก 6 เดือน',
  },
  {
    label: '🦷 อุดฟันคอมโพสิต',
    cc: 'มีรอยฟันผุ / เสียวฟันเวลาดื่มน้ำเย็นหรือทานของหวาน',
    pe: 'ตรวจพบฟันผุถึงชั้นเนื้อฟัน (Dentine caries) เคาะไม่เจ็บ ขอบเหงือกปกติ',
    dx: 'K02.1 โรคฟันผุถึงชั้นเนื้อฟัน (Dental caries of dentine)',
    tx: 'กรอกำจัดเนื้อฟันผุออก ทาสารยึดติด (Bonding) และอุดบูรณะด้วย Composite Resin สีเหมือนฟัน ขัดแต่งเช็กจุดสบฟันเรียบร้อย',
    advice: 'หลีกเลี่ยงการเคี้ยวอาหารแข็งบริเวณซี่ที่อุด 24 ชั่วโมง หากเคี้ยวแล้วรู้สึกสูงหรือปวดให้กลับมาปรับแต่งได้',
    followUp: 'นัดตรวจติดตามทุก 6 เดือน',
  },
  {
    label: '钳 ถอนฟัน / ผ่าฟันคุด',
    cc: 'ปวดฟัน / ฟันคุดขึ้นเบียดซี่ข้างเคียง ต้องการถอนออก',
    pe: 'ตรวจพบฟันผุทะลุโพรงประสาทฟัน / ฟันกรามคุด เหงือกโดยรอบบวมแดงเล็กน้อย',
    dx: 'K01.1 ฟันกรามคุด / ฟันผุไม่สามารถบูรณะได้',
    tx: 'ทำความสะอาดช่องปาก ฉีดยาชาเฉพาะที่ (2% Mepivacaine with Adrenaline) ถอนฟัน/ผ่าฟันคุดออกอย่างนุ่มนวล ล้างแผลด้วย NSS เย็บปิดแผลและให้กัดผ้าก๊อซ',
    advice: 'กัดผ้าก๊อซแน่นๆ 1-2 ชม. กลืนน้ำลายตามปกติ ห้ามบ้วนน้ำหรือบ้วนเลือดวันแรก ประคบเย็นด้านนอกแก้ม ทานยาตามแพทย์สั่งให้ครบ',
    followUp: 'นัดตัดไหมและตรวจแผลอีก 7 วัน',
  },
  {
    label: '😁 ปรับเครื่องมือจัดฟัน',
    cc: 'มาปรับเครื่องมือจัดฟันประจำเดือนตามนัด',
    pe: 'เครื่องมือจัดฟันยึดติดแน่นดี สุขอนามัยช่องปากดี ฟันเคลื่อนเข้าแนวตามแผน',
    dx: 'K07.2 ฟันซ้อนเก / อยู่ระหว่างการจัดฟัน (Orthodontic adjustment)',
    tx: 'ถอดลวดทำความสะอาด เปลี่ยนลวดจัดฟันและเปลี่ยนยาง O-ring / Chain ดึงฟันตามแผนการรักษา',
    advice: 'อาจมีอาการตึงหรือระบมฟัน 2-3 วันแรก แนะนำทานอาหารอ่อนๆ และแปรงฟันรอบแบร็กเก็ตให้สะอาด',
    followUp: 'นัดปรับเครื่องมือจัดฟันครั้งถัดไปอีก 1 เดือน',
  },
  {
    label: '🔬 รักษารากฟัน',
    cc: 'ปวดฟันตุบๆ ปวดขึ้นมาเองโดยเฉพาะเวลากลางคืน เคี้ยวอาหารแล้วเจ็บ',
    pe: 'ตรวจพบฟันผุลึกทะลุโพรงประสาทฟัน เคาะเจ็บเล็กน้อย (Tender to percussion)',
    dx: 'K04.0 โพรงประสาทฟันอักเสบ (Irreversible Pulpitis)',
    tx: 'ฉีดยาชาเฉพาะที่ เปิดโพรงประสาทฟัน (Access opening) ขยายและล้างคลองรากฟันด้วย NaOCl ใส่ยาฆ่าเชื้อ Ca(OH)2 ในคลองรากฟัน และอุดชั่วคราวด้วย Cavit',
    advice: 'หลีกเลี่ยงการใช้ฟันซี่ที่รักษารากเคี้ยวของแข็ง เพราะฟันอาจแตกหักได้ หากวัสดุอุดชั่วคราวหลุดให้รีบกลับมาพบแพทย์',
    followUp: 'นัดล้างคลองรากฟันต่อ / อุดคลองรากฟันในอีก 7-14 วัน',
  },
];

// 1-Click Popular Procedures
const QUICK_PROCEDURES = [
  { code: 'D10', name: 'ขูดหินปูนทั้งปากพร้อมขัดฟัน', price: 1200, color: 'bg-sky-50 border-sky-300 text-sky-900 hover:bg-sky-100' },
  { code: 'D20', name: 'อุดฟันคอมโพสิต 1 ด้าน', price: 900, color: 'bg-teal-50 border-teal-300 text-teal-900 hover:bg-teal-100' },
  { code: 'D21', name: 'อุดฟันคอมโพสิต 2 ด้าน', price: 1400, color: 'bg-teal-50 border-teal-300 text-teal-900 hover:bg-teal-100' },
  { code: 'D30', name: 'ถอนฟันแท้ทั่วไป', price: 1000, color: 'bg-amber-50 border-amber-300 text-amber-900 hover:bg-amber-100' },
  { code: 'D31', name: 'ผ่าฟันคุดระดับปานกลาง', price: 3500, color: 'bg-rose-50 border-rose-300 text-rose-900 hover:bg-rose-100' },
  { code: 'D70', name: 'ปรับเครื่องมือจัดฟันรายเดือน', price: 1500, color: 'bg-purple-50 border-purple-300 text-purple-900 hover:bg-purple-100' },
  { code: 'D40', name: 'รักษารากฟันหน้า', price: 4500, color: 'bg-indigo-50 border-indigo-300 text-indigo-900 hover:bg-indigo-100' },
  { code: 'D50', name: 'ครอบฟัน Zirconia', price: 12000, color: 'bg-emerald-50 border-emerald-300 text-emerald-900 hover:bg-emerald-100' },
];

// 1-Click Prescription Sets
const QUICK_DRUG_SETS = [
  {
    title: '💊 ชุดยาหลังถอนฟัน / ผ่าฟันคุด (ฆ่าเชื้อ + แก้ปวดลดบวม)',
    items: [
      {
        drugName: 'Amoxicillin 500mg',
        quantity: 15,
        dosageInstructions: 'รับประทานครั้งละ 1 เม็ด หลังอาหาร เช้า-กลางวัน-เย็น (ทานติดต่อกันจนหมด)',
      },
      {
        drugName: 'Ibuprofen 400mg',
        quantity: 10,
        dosageInstructions: 'รับประทานครั้งละ 1 เม็ด หลังอาหารทันที เช้า-กลางวัน-เย็น เมื่อปวดหรือบวม',
      },
      {
        drugName: 'Paracetamol 500mg',
        quantity: 10,
        dosageInstructions: 'รับประทานครั้งละ 1 เม็ด ทุก 4-6 ชั่วโมง เมื่อมีอาการปวด',
      },
    ],
  },
  {
    title: '💊 ชุดยาแก้ปวดตึงหลังจัดฟัน / อุดฟันลึก',
    items: [
      {
        drugName: 'Paracetamol 500mg',
        quantity: 10,
        dosageInstructions: 'รับประทานครั้งละ 1 เม็ด ทุก 4-6 ชั่วโมง เมื่อมีอาการปวดหรือตึงฟัน',
      },
    ],
  },
  {
    title: '💊 ชุดยากลุ่มแพ้ Penicillin (Clindamycin + แก้ปวด)',
    items: [
      {
        drugName: 'Clindamycin 300mg (สำหรับผู้แพ้ Penicillin)',
        quantity: 15,
        dosageInstructions: 'รับประทานครั้งละ 1 เม็ด หลังอาหาร เช้า-กลางวัน-เย็น (ดื่มน้ำตามมากๆ ทานจนหมด)',
      },
      {
        drugName: 'Paracetamol 500mg',
        quantity: 10,
        dosageInstructions: 'รับประทานครั้งละ 1 เม็ด ทุก 4-6 ชั่วโมง เมื่อมีอาการปวด',
      },
    ],
  },
];

export default function ClinicalExamEmrPage() {
  const params = useParams();
  const router = useRouter();
  const visitId = params.visitId as string;

  const [visit, setVisit] = useState<any | null>(null);
  const [medicalRecord, setMedicalRecord] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  // Vital Signs State (Pre-Op Safety Check)
  const [bpSystolic, setBpSystolic] = useState<string>('120');
  const [bpDiastolic, setBpDiastolic] = useState<string>('80');
  const [heartRate, setHeartRate] = useState<string>('76');
  const [anesthesiaNote, setAnesthesiaNote] = useState<string>('ไม่ต้องฉีดยาชา');

  // EMR Form fields
  const [chiefComplaint, setChiefComplaint] = useState('');
  const [physicalExam, setPhysicalExam] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [treatmentDescription, setTreatmentDescription] = useState('');
  const [advice, setAdvice] = useState('');
  const [followUpPlan, setFollowUpPlan] = useState('');
  const [editReason, setEditReason] = useState('');

  // Procedure Entry
  const [procedureCode, setProcedureCode] = useState('D10');
  const [procedureName, setProcedureName] = useState('ขูดหินปูนทั้งปากพร้อมขัดฟัน');
  const [toothNumber, setToothNumber] = useState('');
  const [unitPrice, setUnitPrice] = useState('1200');
  const [discountAmount, setDiscountAmount] = useState('0');
  const [procLoading, setProcLoading] = useState(false);

  // Prescription Entry
  const [drugName, setDrugName] = useState('Amoxicillin 500mg');
  const [drugQty, setDrugQty] = useState('10');
  const [dosageInstructions, setDosageInstructions] = useState(
    'รับประทานครั้งละ 1 เม็ด หลังอาหาร เช้า-กลางวัน-เย็น (ทานติดต่อกันจนหมด)'
  );
  const [prescLoading, setPrescLoading] = useState(false);
  const [printableLabel, setPrintableLabel] = useState<any | null>(null);
  const [printAllLabelsModal, setPrintAllLabelsModal] = useState(false);

  const [savingEmr, setSavingEmr] = useState(false);

  const fetchEmrData = async () => {
    setLoading(true);
    try {
      const emrRes = await fetch(`/api/visits/${visitId}/emr`);

      if (!emrRes.ok) {
        const err = await emrRes.json();
        setAuthError(err.error || 'คุณไม่มีสิทธิ์เข้าถึงเวชระเบียน');
        return;
      }

      const emrData = await emrRes.json();
      setVisit(emrData.visit);

      if (emrData.medicalRecord) {
        setMedicalRecord(emrData.medicalRecord);
        setChiefComplaint(emrData.medicalRecord.chiefComplaint || '');
        setPhysicalExam(emrData.medicalRecord.physicalExam || '');
        setDiagnosis(emrData.medicalRecord.diagnosis || '');
        setTreatmentDescription(emrData.medicalRecord.treatmentDescription || '');
        setAdvice(emrData.medicalRecord.advice || '');
        setFollowUpPlan(emrData.medicalRecord.followUpPlan || '');
      }
    } catch (e: any) {
      setAuthError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (visitId) fetchEmrData();
  }, [visitId]);

  const applyQuickTemplate = (tpl: (typeof QUICK_EMR_TEMPLATES)[0]) => {
    const vitalsPrefix = `[ความดันโลหิต: ${bpSystolic}/${bpDiastolic} mmHg | ชีพจร: ${heartRate} bpm | ยาชา: ${anesthesiaNote}] `;
    setChiefComplaint(tpl.cc);
    setPhysicalExam(vitalsPrefix + tpl.pe);
    setDiagnosis(tpl.dx);
    setTreatmentDescription(tpl.tx);
    setAdvice(tpl.advice);
    setFollowUpPlan(tpl.followUp);
  };

  const handleSaveEmr = async (signNow: boolean = false) => {
    setSavingEmr(true);
    try {
      const vitalsTag = `[BP: ${bpSystolic}/${bpDiastolic} mmHg, HR: ${heartRate} bpm, ยาชา: ${anesthesiaNote}]`;
      const finalPe = physicalExam.includes('mmHg')
        ? physicalExam
        : `${vitalsTag} ${physicalExam}`.trim();

      const res = await fetch(`/api/visits/${visitId}/emr`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chiefComplaint,
          physicalExam: finalPe,
          diagnosis,
          treatmentDescription,
          advice,
          followUpPlan,
          signNow,
          editReason: medicalRecord?.isSigned ? editReason : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setEditReason('');
      await fetchEmrData();
    } catch (err: any) {
      alert(err.message || 'Failed to save EMR');
    } finally {
      setSavingEmr(false);
    }
  };

  // Instant 1-Click Procedure Add
  const handleQuickAddProcedure = async (code: string, name: string, price: number) => {
    setProcLoading(true);
    try {
      const res = await fetch(`/api/visits/${visitId}/treatment-items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          procedureCode: code,
          procedureName: name,
          toothNumber: toothNumber || null,
          unitPrice: price,
          discountAmount: 0,
          qty: 1,
        }),
      });
      if (res.ok) {
        setToothNumber('');
        fetchEmrData();
      }
    } finally {
      setProcLoading(false);
    }
  };

  const handleAddProcedure = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcLoading(true);
    try {
      const res = await fetch(`/api/visits/${visitId}/treatment-items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          procedureCode,
          procedureName,
          toothNumber: toothNumber || null,
          unitPrice: Number(unitPrice),
          discountAmount: Number(discountAmount),
          qty: 1,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setToothNumber('');
      fetchEmrData();
    } catch (err: any) {
      alert(err.message || 'Failed to add procedure');
    } finally {
      setProcLoading(false);
    }
  };

  // 1-Click Prescription Set Add
  const handleApplyDrugSet = async (items: { drugName: string; quantity: number; dosageInstructions: string }[]) => {
    setPrescLoading(true);
    try {
      for (const item of items) {
        await fetch(`/api/visits/${visitId}/prescription`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item),
        });
      }
      fetchEmrData();
    } finally {
      setPrescLoading(false);
    }
  };

  const handleAddPrescription = async (e: React.FormEvent) => {
    e.preventDefault();
    setPrescLoading(true);
    try {
      const res = await fetch(`/api/visits/${visitId}/prescription`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          drugName,
          quantity: Number(drugQty),
          dosageInstructions,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      fetchEmrData();
    } catch (err: any) {
      alert(err.message || 'Failed to add prescription');
    } finally {
      setPrescLoading(false);
    }
  };

  // 1-Click Finish Exam & Send to Counter Billing
  const handleCompleteAndSendToBilling = async () => {
    setSavingEmr(true);
    try {
      // 1. Auto-save & sign EMR if not yet signed
      if (!medicalRecord?.isSigned) {
        const vitalsTag = `[BP: ${bpSystolic}/${bpDiastolic} mmHg, HR: ${heartRate} bpm, ยาชา: ${anesthesiaNote}]`;
        const finalPe = physicalExam.includes('mmHg')
          ? physicalExam
          : `${vitalsTag} ${physicalExam}`.trim();

        await fetch(`/api/visits/${visitId}/emr`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chiefComplaint: chiefComplaint || 'ตรวจและรักษาทางทันตกรรม',
            physicalExam: finalPe,
            diagnosis: diagnosis || 'ตรวจรักษาตามอาการ',
            treatmentDescription: treatmentDescription || 'ให้การรักษาทางทันตกรรมเรียบร้อย',
            advice,
            followUpPlan,
            signNow: true,
          }),
        });
      }

      // 2. Create invoice if not exists
      await fetch('/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visitId }),
      });

      // 3. Set visit status to WAITING_PAYMENT
      await fetch(`/api/queue/${visitId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'WAITING_PAYMENT' }),
      });

      router.push('/');
    } catch (err) {
      console.error(err);
    } finally {
      setSavingEmr(false);
    }
  };

  if (authError) {
    return (
      <div className="py-24 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-slate-800">การเข้าถึงถูกจำกัด (เฉพาะคุณหมอและผู้ช่วย)</h2>
        <p className="text-xs text-slate-500 max-w-md mx-auto">{authError}</p>
        <Link href="/" className="inline-block px-4 py-2 bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl">
          กลับสู่หน้าหลัก
        </Link>
      </div>
    );
  }

  if (loading || !visit) {
    return (
      <div className="py-24 text-center text-slate-400">
        กำลังโหลดหน้าห้องตรวจของคุณหมอ...
      </div>
    );
  }

  const patient = visit.patient;
  const isHighBp = Number(bpSystolic) >= 140 || Number(bpDiastolic) >= 90;

  return (
    <div className="space-y-5">
      {/* Top Banner: Patient Info & 1-Click Finish Button */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <Link
              href="/"
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors mt-0.5"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-lg bg-sky-100 text-sky-800 text-xs font-mono font-bold">
                  {patient.dn}
                </span>
                <span className="px-2.5 py-0.5 rounded-lg bg-teal-100 text-teal-800 text-xs font-bold">
                  คิวที่ #{visit.queueNumber}
                </span>
                <h1 className="text-xl font-black text-slate-900">
                  {patient.title} {patient.firstNameTh} {patient.lastNameTh}
                </h1>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 mt-1">
                <span>
                  แพทย์ผู้ตรวจ: <strong className="text-sky-700">{visit.doctor.nickname} ({visit.doctor.fullName})</strong>
                </span>
                <span>•</span>
                <span>
                  ห้องตรวจ: <strong className="text-teal-700">{visit.room.name}</strong>
                </span>
                <span>•</span>
                <span>สิทธิ: <strong>{patient.rights}</strong></span>
              </div>
            </div>
          </div>

          {/* Giant 1-Click Complete Button for Doctor */}
          <button
            type="button"
            onClick={handleCompleteAndSendToBilling}
            disabled={savingEmr}
            className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-sm rounded-2xl shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>✅ ตรวจเสร็จสิ้น & ส่งคิดเงินหน้าเคาน์เตอร์ทันที</span>
          </button>
        </div>

        {/* CLINICAL SAFETY WARNING: Drug Allergies Banner */}
        {(patient.drugAllergies || patient.chronicDiseases) && (
          <div className="p-4 rounded-xl bg-rose-50 border-2 border-rose-400 flex items-start gap-3 text-xs">
            <ShieldAlert className="w-6 h-6 text-rose-600 flex-shrink-0 mt-0.5" />
            <div className="space-y-1 flex-1">
              {patient.drugAllergies && (
                <p className="text-rose-950 font-black text-sm">
                  ⚠️ ระวังแพ้ยา: {patient.drugAllergies}
                </p>
              )}
              {patient.chronicDiseases && (
                <p className="text-amber-900 font-bold text-xs">
                  🩺 โรคประจำตัว: {patient.chronicDiseases}
                </p>
              )}
              {patient.currentMedications && (
                <p className="text-slate-700 font-medium">
                  💊 ยาประจำตัว: {patient.currentMedications}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Pre-Op Vital Signs & Anesthesia Safety Bar (Easy Touch Inputs) */}
        <div
          className={`p-3.5 rounded-2xl border flex flex-wrap items-center justify-between gap-4 text-xs transition-colors ${
            isHighBp ? 'bg-rose-50 border-rose-300' : 'bg-slate-50 border-slate-200'
          }`}
        >
          <div className="flex items-center gap-2">
            <HeartPulse className={`w-5 h-5 ${isHighBp ? 'text-rose-600 animate-bounce' : 'text-sky-600'}`} />
            <div>
              <span className="font-bold text-slate-800 block">
                สัญญาณชีพก่อนทำฟัน & ยาชา (Pre-Op Vital Signs)
              </span>
              {isHighBp ? (
                <span className="text-rose-700 font-bold">
                  ⚠️ ความดันโลหิตสูงเกิน 140/90 mmHg! โปรดระวังการฉีดยาชาที่มีส่วนผสมของ Adrenaline หรือการถอนฟัน
                </span>
              ) : (
                <span className="text-emerald-700 font-semibold">
                  ✓ ความดันโลหิตอยู่ในเกณฑ์ปลอดภัยพร้อมทำหัตถการ
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-slate-300">
              <span className="text-slate-500 font-semibold">ความดัน (BP):</span>
              <input
                type="number"
                value={bpSystolic}
                onChange={(e) => setBpSystolic(e.target.value)}
                className="w-12 text-center font-mono font-bold text-slate-900 border-b border-slate-300 focus:outline-none"
              />
              <span>/</span>
              <input
                type="number"
                value={bpDiastolic}
                onChange={(e) => setBpDiastolic(e.target.value)}
                className="w-12 text-center font-mono font-bold text-slate-900 border-b border-slate-300 focus:outline-none"
              />
              <span className="text-[10px] text-slate-400">mmHg</span>
            </div>

            <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-slate-300">
              <span className="text-slate-500 font-semibold">ชีพจร:</span>
              <input
                type="number"
                value={heartRate}
                onChange={(e) => setHeartRate(e.target.value)}
                className="w-10 text-center font-mono font-bold text-slate-900 border-b border-slate-300 focus:outline-none"
              />
              <span className="text-[10px] text-slate-400">bpm</span>
            </div>

            <select
              value={anesthesiaNote}
              onChange={(e) => setAnesthesiaNote(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-300 bg-white font-semibold text-slate-800"
            >
              <option value="ไม่ต้องฉีดยาชา">ยาชา: ไม่ต้องฉีดยาชา</option>
              <option value="Mepivacaine 2% with Adrenaline (1 หลอด)">ยาชา: Mepivacaine 2% + Adrenaline (1 หลอด)</option>
              <option value="Mepivacaine 2% with Adrenaline (2 หลอด)">ยาชา: Mepivacaine 2% + Adrenaline (2 หลอด)</option>
              <option value="Mepivacaine 3% Plain ไม่ผสม Adrenaline (สำหรับคนไข้ความดันสูง)">
                ยาชา: Mepivacaine 3% Plain (ไร้ Adrenaline - ความดันสูง)
              </option>
              <option value="ทายาชาเฉพาะที่ (Topical Gel)">ยาชา: ทายาชาเฉพาะที่ (Topical Gel)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): 1-Click SOAP Note Templates & Tooth Chart */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-sky-600" />
                <div>
                  <h3 className="text-sm font-bold text-slate-800">
                    บันทึกการตรวจรักษา (กดเลือกแม่แบบ 1-Click ไม่ต้องพิมพ์เอง)
                  </h3>
                </div>
              </div>
              {medicalRecord?.isSigned ? (
                <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>ลงนามแล้ว</span>
                </span>
              ) : (
                <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">
                  กำลังบันทึก
                </span>
              )}
            </div>

            {/* 1-CLICK TEMPLATE BUTTONS FOR DOCTOR */}
            <div className="p-3 bg-sky-50/70 border border-sky-200 rounded-2xl space-y-2">
              <span className="text-xs font-bold text-sky-900 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-sky-600" />
                <span>กดปุ่มด้านล่างเพื่อเติมข้อความเวชระเบียนอัตโนมัติ (1-Click Auto-Fill):</span>
              </span>
              <div className="flex flex-wrap gap-2">
                {QUICK_EMR_TEMPLATES.map((tpl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => applyQuickTemplate(tpl)}
                    className="px-3.5 py-2 rounded-xl bg-white hover:bg-sky-600 hover:text-white text-slate-800 border border-sky-300 font-bold text-xs shadow-2xs transition-all"
                  >
                    {tpl.label}
                  </button>
                ))}
              </div>
            </div>

            {/* If signed previously and now editing: Edit Reason required */}
            {medicalRecord?.isSigned && (
              <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl space-y-1.5 text-xs text-amber-900">
                <div className="flex items-center gap-1.5 font-bold text-amber-800">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>เวชระเบียนนี้ลงนามแล้ว หากต้องการแก้ไขเพิ่มเติม กรุณาระบุเหตุผลสั้นๆ:</span>
                </div>
                <input
                  type="text"
                  placeholder="เช่น เพิ่มรายละเอียดซี่ฟัน..."
                  value={editReason}
                  onChange={(e) => setEditReason(e.target.value)}
                  className="w-full px-3 py-1.5 border border-amber-300 rounded-lg bg-white"
                />
              </div>
            )}

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">1. อาการสำคัญ (CC)</label>
                  <textarea
                    rows={2}
                    value={chiefComplaint}
                    onChange={(e) => setChiefComplaint(e.target.value)}
                    placeholder="กดปุ่มแม่แบบด้านบน หรือพิมพ์สั้นๆ..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">2. ผลการตรวจในช่องปาก (PE)</label>
                  <textarea
                    rows={2}
                    value={physicalExam}
                    onChange={(e) => setPhysicalExam(e.target.value)}
                    placeholder="ผลตรวจช่องปาก..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">3. การวินิจฉัย (Diagnosis)</label>
                <input
                  type="text"
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  placeholder="การวินิจฉัยโรค..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">4. หัตถการที่ทำในวันนี้ (Treatment Done)</label>
                <textarea
                  rows={2}
                  value={treatmentDescription}
                  onChange={(e) => setTreatmentDescription(e.target.value)}
                  placeholder="รายละเอียดการรักษา..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">5. คำแนะนำหลังรักษา</label>
                  <textarea
                    rows={2}
                    value={advice}
                    onChange={(e) => setAdvice(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">6. แผนการนัดครั้งต่อไป</label>
                  <textarea
                    rows={2}
                    value={followUpPlan}
                    onChange={(e) => setFollowUpPlan(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => handleSaveEmr(false)}
                disabled={savingEmr}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl"
              >
                พักบันทึกชั่วคราว
              </button>
              <button
                type="button"
                onClick={() => handleSaveEmr(true)}
                disabled={savingEmr}
                className="px-5 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-xl shadow-sm flex items-center gap-1.5"
              >
                <FileCheck className="w-4 h-4" />
                <span>บันทึกและลงนามเวชระเบียน</span>
              </button>
            </div>
          </div>

          {/* FDI Tooth Chart Component */}
          <FdiToothChart
            patientId={patient.id}
            toothConditions={patient.toothConditions || []}
            onConditionAdded={fetchEmrData}
          />
        </div>

        {/* Right Column (5 cols): 1-Click Procedures & 1-Click Prescription Sets */}
        <div className="lg:col-span-5 space-y-6">
          {/* 1-CLICK TREATMENT ITEMS */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-sm font-bold text-slate-800">
                1. คิดค่ารักษา / หัตถการ (กดปุ่มเดียวเพิ่มเข้าบิลทันที)
              </h3>
            </div>

            {/* Optional Tooth Number Input before clicking a procedure button */}
            <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs">
              <span className="font-bold text-slate-700">ระบุซี่ฟัน (ถ้ามี):</span>
              <input
                type="text"
                placeholder="เช่น 16, 36, 48"
                value={toothNumber}
                onChange={(e) => setToothNumber(e.target.value)}
                className="w-28 px-2.5 py-1 border border-slate-300 rounded-lg bg-white font-mono font-bold text-center"
              />
              <span className="text-[11px] text-slate-400">แล้วกดปุ่มหัตถการด้านล่างได้เลย</span>
            </div>

            {/* 1-Click Big Procedure Buttons */}
            <div className="grid grid-cols-2 gap-2">
              {QUICK_PROCEDURES.map((proc) => (
                <button
                  key={proc.code}
                  type="button"
                  disabled={procLoading}
                  onClick={() => handleQuickAddProcedure(proc.code, proc.name, proc.price)}
                  className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between ${proc.color}`}
                >
                  <span className="text-xs font-bold leading-snug">+ {proc.name}</span>
                  <span className="text-[11px] font-mono font-black mt-1">
                    {proc.price.toLocaleString()} บาท
                  </span>
                </button>
              ))}
            </div>

            {/* Custom Price / Discount Expandable Form */}
            <details className="text-xs bg-slate-50 rounded-xl p-2.5 border border-slate-200">
              <summary className="font-semibold text-slate-600 cursor-pointer">
                ⚙️ ปรับราคาเองหรือให้ส่วนลดพิเศษ (คลิกเพื่อเปิด)
              </summary>
              <form onSubmit={handleAddProcedure} className="space-y-2.5 pt-3">
                <input
                  type="text"
                  value={procedureName}
                  onChange={(e) => setProcedureName(e.target.value)}
                  placeholder="ชื่อหัตถการ..."
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg bg-white"
                />
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] text-slate-500">ราคา (บาท)</label>
                    <input
                      type="number"
                      value={unitPrice}
                      onChange={(e) => setUnitPrice(e.target.value)}
                      className="w-full px-2.5 py-1 border border-slate-300 rounded-lg bg-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500">ส่วนลด (บาท)</label>
                    <input
                      type="number"
                      value={discountAmount}
                      onChange={(e) => setDiscountAmount(e.target.value)}
                      className="w-full px-2.5 py-1 border border-slate-300 rounded-lg bg-white font-mono"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={procLoading}
                  className="w-full py-1.5 bg-sky-600 text-white font-bold rounded-lg"
                >
                  + บันทึกรายการที่กำหนดเอง
                </button>
              </form>
            </details>

            {/* Treatment Items List */}
            <div className="border-t border-slate-100 pt-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">
                  รายการหัตถการที่ทำในวันนี้ ({visit.treatmentItems?.length || 0} รายการ):
                </span>
                <span className="text-sm font-black font-mono text-emerald-700">
                  รวม{' '}
                  {formatCurrency(
                    (visit.treatmentItems || []).reduce((s: number, i: any) => s + i.netAmount, 0)
                  )}
                </span>
              </div>
              {visit.treatmentItems && visit.treatmentItems.length === 0 ? (
                <p className="text-xs text-slate-400 italic py-2">
                  ยังไม่มีรายการ (กดปุ่มหัตถการสีๆ ด้านบนเพื่อเพิ่มได้เลย)
                </p>
              ) : (
                <div className="divide-y divide-slate-100 bg-slate-50 rounded-xl border border-slate-200 px-3">
                  {visit.treatmentItems.map((item: any) => (
                    <div key={item.id} className="py-2.5 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-slate-900">
                          {item.procedureName} {item.toothNumber ? `(ซี่ #${item.toothNumber})` : ''}
                        </span>
                        <span className="block text-[10px] text-sky-700 font-mono">
                          ค่ามือหมอ (DF {item.dfRate}%): {formatCurrency(item.dfFinal)}
                        </span>
                      </div>
                      <span className="font-mono font-bold text-slate-900">
                        {formatCurrency(item.netAmount)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 1-CLICK PRESCRIPTION SETS & DRUG STICKER LABELS */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2">
                <Pill className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-800">
                  2. สั่งจ่ายยา & พิมพ์สติกเกอร์ซองยา (1-Click ชุดยา)
                </h3>
              </div>
              {visit.prescriptionItems && visit.prescriptionItems.length > 0 && (
                <button
                  type="button"
                  onClick={() => setPrintAllLabelsModal(true)}
                  className="px-3 py-1 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>พิมพ์ฉลากยาทั้งหมด ({visit.prescriptionItems.length})</span>
                </button>
              )}
            </div>

            {/* 1-Click Drug Set Buttons */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-emerald-900 block">
                กดเลือกชุดยาสำเร็จรูป (เพิ่มยาครบชุดในคลิกเดียว):
              </span>
              {QUICK_DRUG_SETS.map((set, idx) => (
                <button
                  key={idx}
                  type="button"
                  disabled={prescLoading}
                  onClick={() => handleApplyDrugSet(set.items)}
                  className="w-full p-2.5 rounded-xl border border-emerald-300 bg-emerald-50/70 hover:bg-emerald-600 hover:text-white text-emerald-950 text-left transition-all text-xs font-bold flex items-center justify-between"
                >
                  <span>{set.title}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-white/80 text-emerald-900 shrink-0">
                    + สั่งชุดนี้
                  </span>
                </button>
              ))}
            </div>

            {/* Single Drug Manual Addition */}
            <details className="text-xs bg-slate-50 rounded-xl p-2.5 border border-slate-200">
              <summary className="font-semibold text-slate-600 cursor-pointer">
                + สั่งยารายตัวเพิ่มเติม (คลิกเพื่อเปิด)
              </summary>
              <form onSubmit={handleAddPrescription} className="space-y-2.5 pt-3">
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2">
                    <select
                      value={drugName}
                      onChange={(e) => {
                        setDrugName(e.target.value);
                        if (e.target.value === 'Amoxicillin 500mg')
                          setDosageInstructions('รับประทานครั้งละ 1 เม็ด หลังอาหาร เช้า-กลางวัน-เย็น (ทานติดต่อกันจนหมด)');
                        if (e.target.value === 'Ibuprofen 400mg')
                          setDosageInstructions('รับประทานครั้งละ 1 เม็ด หลังอาหารทันที เช้า-เย็น เมื่อมีอาการปวด');
                        if (e.target.value === 'Paracetamol 500mg')
                          setDosageInstructions('รับประทานครั้งละ 1-2 เม็ด ทุก 4-6 ชั่วโมง เมื่อมีอาการปวด');
                      }}
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white"
                    >
                      <option value="Amoxicillin 500mg">Amoxicillin 500mg</option>
                      <option value="Ibuprofen 400mg">Ibuprofen 400mg</option>
                      <option value="Paracetamol 500mg">Paracetamol 500mg</option>
                    </select>
                  </div>
                  <div>
                    <input
                      type="number"
                      value={drugQty}
                      onChange={(e) => setDrugQty(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white text-center font-mono"
                    />
                  </div>
                </div>
                <input
                  type="text"
                  value={dosageInstructions}
                  onChange={(e) => setDosageInstructions(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white"
                />
                <button
                  type="submit"
                  disabled={prescLoading}
                  className="w-full py-1.5 bg-emerald-600 text-white font-bold rounded-lg"
                >
                  + เพิ่มยา
                </button>
              </form>
            </details>

            {/* Prescribed Drugs List */}
            <div className="border-t border-slate-100 pt-2 space-y-2">
              {visit.prescriptionItems && visit.prescriptionItems.length > 0 ? (
                <div className="divide-y divide-slate-100">
                  {visit.prescriptionItems.map((pi: any) => (
                    <div key={pi.id} className="py-2 flex items-center justify-between text-xs gap-2">
                      <div>
                        <span className="font-bold text-slate-800">{pi.drugName}</span>{' '}
                        <span className="text-emerald-700 font-bold">({pi.quantity} {pi.unit})</span>
                        <p className="text-[11px] text-slate-500">{pi.dosageInstructions}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setPrintableLabel(pi)}
                        className="px-2.5 py-1 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-[11px] shrink-0 flex items-center gap-1"
                      >
                        <Printer className="w-3 h-3" />
                        <span>ฉลาก</span>
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">ยังไม่มีรายการสั่งยาในรอบนี้</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Single Drug Sticker Modal */}
      {printableLabel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-sm p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-2 no-print">
              <h4 className="text-xs font-bold text-slate-800">สติกเกอร์ติดซองยา (Drug Sticker Label)</h4>
              <button
                type="button"
                onClick={() => setPrintableLabel(null)}
                className="text-xs text-slate-400 hover:text-slate-600"
              >
                ปิด
              </button>
            </div>

            <div className="p-4 rounded-xl border-2 border-slate-800 bg-white space-y-2 text-xs">
              <div className="text-center border-b pb-1">
                <p className="font-bold text-slate-900">คลินิกทันตกรรมหมอมิน หมอพรีม</p>
                <p className="text-[10px] text-slate-500">โทร. 02-123-4567, 089-999-8888</p>
              </div>
              <div className="flex justify-between text-[11px]">
                <span>ชื่อ: <strong>{patient.title} {patient.firstNameTh} {patient.lastNameTh}</strong></span>
                <span className="font-mono">{patient.dn}</span>
              </div>
              <div className="py-1">
                <p className="font-black text-sm text-slate-900">{printableLabel.drugName}</p>
                <p className="text-xs text-slate-800 mt-1 font-semibold">{printableLabel.dosageInstructions}</p>
              </div>
              <div className="border-t pt-1 flex justify-between text-[10px] text-slate-500">
                <span>จำนวน: {printableLabel.quantity} {printableLabel.unit}</span>
                <span>วันที่: {formatThaiDate(new Date())}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t no-print">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>สั่งพิมพ์สติกเกอร์</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Batch Print All Drug Stickers Modal */}
      {printAllLabelsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-2 no-print">
              <h4 className="text-sm font-bold text-slate-800">
                พิมพ์สติกเกอร์ซองยาทั้งหมด ({visit.prescriptionItems?.length || 0} ซอง)
              </h4>
              <button
                type="button"
                onClick={() => setPrintAllLabelsModal(false)}
                className="text-xs text-slate-500 hover:text-slate-800"
              >
                ปิดหน้าต่าง
              </button>
            </div>

            <div className="space-y-3">
              {visit.prescriptionItems?.map((pi: any) => (
                <div key={pi.id} className="p-4 rounded-xl border-2 border-slate-800 bg-white space-y-1.5 text-xs">
                  <div className="flex justify-between items-center border-b pb-1">
                    <span className="font-bold text-slate-900">คลินิกทันตกรรมหมอมิน หมอพรีม</span>
                    <span className="text-[10px] text-slate-500">วันที่ {formatThaiDate(new Date())}</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span>ผู้ป่วย: <strong>{patient.title} {patient.firstNameTh} {patient.lastNameTh}</strong></span>
                    <span className="font-mono font-bold">จำนวน: {pi.quantity} {pi.unit}</span>
                  </div>
                  <p className="font-black text-sm text-sky-900 pt-1">{pi.drugName}</p>
                  <p className="text-xs font-semibold text-slate-800">{pi.dosageInstructions}</p>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t no-print">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl flex items-center gap-1.5 shadow-md"
              >
                <Printer className="w-4 h-4" />
                <span>พิมพ์สติกเกอร์ทั้งหมดทันที</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
