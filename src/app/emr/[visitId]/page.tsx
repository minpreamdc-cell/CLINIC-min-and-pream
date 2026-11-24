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
  History,
  Smile,
  Pill,
} from 'lucide-react';
import { formatThaiDate, formatThaiDateTime, formatCurrency } from '@/lib/utils';
import FdiToothChart from '@/components/FdiToothChart';

export default function ClinicalExamEmrPage() {
  const params = useParams();
  const router = useRouter();
  const visitId = params.visitId as string;

  const [visit, setVisit] = useState<any | null>(null);
  const [medicalRecord, setMedicalRecord] = useState<any | null>(null);
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

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
  const [dosageInstructions, setDosageInstructions] = useState('รับประทานครั้งละ 1 เม็ด หลังอาหาร เช้า-กลางวัน-เย็น');
  const [prescLoading, setPrescLoading] = useState(false);
  const [printableLabel, setPrintableLabel] = useState<any | null>(null);

  const [savingEmr, setSavingEmr] = useState(false);

  const fetchEmrData = async () => {
    setLoading(true);
    try {
      const [emrRes, userRes] = await Promise.all([
        fetch(`/api/visits/${visitId}/emr`),
        fetch('/api/auth/me'),
      ]);

      if (!emrRes.ok) {
        const err = await emrRes.json();
        setAuthError(err.error || 'คุณไม่มีสิทธิ์เข้าถึงเวชระเบียน');
        return;
      }

      const emrData = await emrRes.json();
      const userData = await userRes.json();

      setVisit(emrData.visit);
      setCurrentUser(userData.user);

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

  const handleSaveEmr = async (signNow: boolean = false) => {
    setSavingEmr(true);
    try {
      const res = await fetch(`/api/visits/${visitId}/emr`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chiefComplaint,
          physicalExam,
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

      alert(data.message);
      setEditReason('');
      fetchEmrData();
    } catch (err: any) {
      alert(err.message || 'Failed to save EMR');
    } finally {
      setSavingEmr(false);
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

  const handleSendToBilling = async () => {
    try {
      // 1. Create invoice if not exists
      await fetch('/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visitId }),
      });

      // 2. Set visit status to WAITING_PAYMENT
      await fetch(`/api/queue/${visitId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'WAITING_PAYMENT' }),
      });

      alert('ส่งรายการรักษาไปยังคิวรอชำระเงินหน้าเคาน์เตอร์เรียบร้อยแล้ว');
      router.push('/');
    } catch (err) {
      console.error(err);
    }
  };

  if (authError) {
    return (
      <div className="py-24 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-slate-800">การเข้าถึงถูกจำกัด (403 Forbidden)</h2>
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
        กำลังโหลดเวชระเบียนการตรวจ...
      </div>
    );
  }

  const patient = visit.patient;

  return (
    <div className="space-y-6">
      {/* Top Banner: Patient Info & Medical Alert Banner */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <Link
              href="/"
              className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors mt-0.5"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-lg bg-sky-100 text-sky-800 text-xs font-mono font-bold">
                  {patient.dn}
                </span>
                <span className="px-2 py-0.5 rounded-lg bg-teal-100 text-teal-800 text-xs font-bold">
                  คิวที่ {visit.queueNumber} ({visit.visitNumber})
                </span>
                <h1 className="text-lg font-bold text-slate-900">
                  {patient.title} {patient.firstNameTh} {patient.lastNameTh}
                </h1>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                <span>แพทย์ผู้ตรวจ: <strong className="text-slate-800">{visit.doctor.fullName} ({visit.doctor.nickname})</strong></span>
                <span>•</span>
                <span>ห้อง: <strong className="text-slate-800">{visit.room.name}</strong></span>
                <span>•</span>
                <span>วันที่: {formatThaiDate(visit.visitDate, true)}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSendToBilling}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5"
            >
              <CreditCard className="w-4 h-4" />
              <span>ส่งคิดเงินหน้าเคาน์เตอร์</span>
            </button>
          </div>
        </div>

        {/* CLINICAL SAFETY WARNING: Drug Allergies Banner */}
        {(patient.drugAllergies || patient.chronicDiseases) && (
          <div className="p-3.5 rounded-xl bg-rose-50 border-2 border-rose-300 flex items-start gap-3 text-xs animate-pulse">
            <ShieldAlert className="w-6 h-6 text-rose-600 flex-shrink-0 mt-0.5" />
            <div className="space-y-0.5 flex-1">
              {patient.drugAllergies && (
                <p className="text-rose-950 font-black text-sm">
                  ⚠️ ผู้ป่วยมีประวัติแพ้ยา: {patient.drugAllergies}
                </p>
              )}
              {patient.chronicDiseases && (
                <p className="text-amber-900 font-bold">
                  โรคประจำตัว: {patient.chronicDiseases}
                </p>
              )}
              {patient.currentMedications && (
                <p className="text-slate-700 font-medium">
                  ยาที่รับประทานประจำ: {patient.currentMedications}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Grid: Left Column (EMR Form) | Right Column (Procedures & Prescriptions) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): EMR Notes & Tooth Chart */}
        <div className="lg:col-span-7 space-y-6">
          {/* EMR SOAP Note Box */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-sky-600" />
                <h3 className="text-sm font-bold text-slate-800">บันทึกเวชระเบียนทันตกรรม (EMR)</h3>
              </div>
              <div className="flex items-center gap-2 text-xs">
                {medicalRecord?.isSigned ? (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>ลงนามรับรองแล้ว ({formatThaiDateTime(medicalRecord.signedAt)})</span>
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold">
                    ฉบับร่าง (ยังไม่ลงนาม)
                  </span>
                )}
              </div>
            </div>

            {/* If signed previously and now editing: Edit Reason required */}
            {medicalRecord?.isSigned && (
              <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl space-y-1.5 text-xs text-amber-900">
                <div className="flex items-center gap-1.5 font-bold text-amber-800">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>เวชระเบียนนี้ถูกลงนามแล้ว การแก้ไขต้องระบุเหตุผลเพื่อเก็บบันทึกประวัติ (Audit Trail)</span>
                </div>
                <input
                  type="text"
                  placeholder="ระบุเหตุผลในการแก้ไขเวชระเบียนหลังลงนาม..."
                  value={editReason}
                  onChange={(e) => setEditReason(e.target.value)}
                  className="w-full px-3 py-1.5 border border-amber-300 rounded-lg bg-white"
                />
              </div>
            )}

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  อาการสำคัญที่มารับการรักษา (Chief Complaint - CC)
                </label>
                <textarea
                  rows={2}
                  value={chiefComplaint}
                  onChange={(e) => setChiefComplaint(e.target.value)}
                  placeholder="เช่น ปวดฟันกรามซ้ายล่าง เคี้ยวอาหารแล้วเจ็บ..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  ผลการตรวจช่องปาก (Physical Examination - PE)
                </label>
                <textarea
                  rows={2}
                  value={physicalExam}
                  onChange={(e) => setPhysicalExam(e.target.value)}
                  placeholder="เช่น ตรวจพบฟันผุ Mesio-occlusal ซี่ 36, เหงือกบวมเล็กน้อย..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  การวินิจฉัย (Diagnosis - Dx)
                </label>
                <input
                  type="text"
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  placeholder="เช่น K02.1 Dental caries of dentine #36"
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  รายละเอียดหัตถการที่ทำในครั้งนี้ (Treatment done)
                </label>
                <textarea
                  rows={3}
                  value={treatmentDescription}
                  onChange={(e) => setTreatmentDescription(e.target.value)}
                  placeholder="เช่น กรอเนื้อฟันผุออก อุดฟันด้วย Composite Resin shade A2..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">คำแนะนำหลังการรักษา</label>
                  <textarea
                    rows={2}
                    value={advice}
                    onChange={(e) => setAdvice(e.target.value)}
                    placeholder="เช่น หลีกเลี่ยงเคี้ยวของแข็ง 24 ชม...."
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">แผนการนัดติดตามผล</label>
                  <textarea
                    rows={2}
                    value={followUpPlan}
                    onChange={(e) => setFollowUpPlan(e.target.value)}
                    placeholder="เช่น นัดดูอาการอีก 2 สัปดาห์..."
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
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
              >
                บันทึกฉบับร่าง (Draft)
              </button>
              <button
                type="button"
                onClick={() => handleSaveEmr(true)}
                disabled={savingEmr}
                className="px-5 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-xl shadow-md shadow-sky-600/20 transition-all flex items-center gap-1.5"
              >
                <FileCheck className="w-4 h-4" />
                <span>{medicalRecord?.isSigned ? 'บันทึกการแก้ไข' : 'ลงนามรับรองเวชระเบียน'}</span>
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

        {/* Right Column (5 cols): Treatments & Billing Items, Pharmacy Order */}
        <div className="lg:col-span-5 space-y-6">
          {/* Add Treatment Item Box */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-sm font-bold text-slate-800">บันทึกหัตถการส่งคิดเงิน (Tx Items)</h3>
              <span className="text-[10px] text-slate-500 font-semibold">หักสต๊อก & คิด DF อัตโนมัติ</span>
            </div>

            <form onSubmit={handleAddProcedure} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">เลือกหัตถการ *</label>
                <select
                  value={procedureCode}
                  onChange={(e) => {
                    setProcedureCode(e.target.value);
                    if (e.target.value === 'D10') { setProcedureName('ขูดหินปูนทั้งปากพร้อมขัดฟัน'); setUnitPrice('1200'); }
                    if (e.target.value === 'D20') { setProcedureName('อุดฟันคอมโพสิตเรซิน 1 ด้าน'); setUnitPrice('900'); }
                    if (e.target.value === 'D21') { setProcedureName('อุดฟันคอมโพสิตเรซิน 2 ด้าน'); setUnitPrice('1400'); }
                    if (e.target.value === 'D30') { setProcedureName('ถอนฟันแท้ทั่วไป'); setUnitPrice('1000'); }
                    if (e.target.value === 'D31') { setProcedureName('ผ่าฟันคุดระดับปานกลาง'); setUnitPrice('3500'); }
                    if (e.target.value === 'D40') { setProcedureName('รักษารากฟันหน้า'); setUnitPrice('4500'); }
                    if (e.target.value === 'D50') { setProcedureName('ครอบฟัน Zirconia All-Ceramic'); setUnitPrice('12000'); }
                    if (e.target.value === 'D70') { setProcedureName('ปรับเครื่องมือจัดฟันประจำเดือน'); setUnitPrice('1500'); }
                  }}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white"
                >
                  <option value="D10">D10: ขูดหินปูนทั้งปากพร้อมขัดฟัน (1,200฿)</option>
                  <option value="D20">D20: อุดฟันคอมโพสิต 1 ด้าน (900฿)</option>
                  <option value="D21">D21: อุดฟันคอมโพสิต 2 ด้าน (1,400฿)</option>
                  <option value="D30">D30: ถอนฟันแท้ทั่วไป (1,000฿)</option>
                  <option value="D31">D31: ผ่าฟันคุดระดับปานกลาง (3,500฿)</option>
                  <option value="D40">D40: รักษารากฟันหน้า (4,500฿)</option>
                  <option value="D50">D50: ครอบฟัน Zirconia All-Ceramic (12,000฿)</option>
                  <option value="D70">D70: ปรับเครื่องมือจัดฟันประจำเดือน (1,500฿)</option>
                </select>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">ซี่ฟัน</label>
                  <input
                    type="text"
                    placeholder="เช่น 16, 21"
                    value={toothNumber}
                    onChange={(e) => setToothNumber(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-xl font-mono text-center"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">ราคา (บาท)</label>
                  <input
                    type="number"
                    value={unitPrice}
                    onChange={(e) => setUnitPrice(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">ส่วนลด</label>
                  <input
                    type="number"
                    value={discountAmount}
                    onChange={(e) => setDiscountAmount(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  disabled={procLoading}
                  className="px-4 py-1.5 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-xl shadow-sm flex items-center gap-1.5"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>เพิ่มรายการรักษา</span>
                </button>
              </div>
            </form>

            {/* Treatment Items List */}
            <div className="border-t border-slate-100 pt-3 space-y-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                รายการรักษาที่บันทึกแล้วในครั้งนี้:
              </span>
              {visit.treatmentItems && visit.treatmentItems.length === 0 ? (
                <p className="text-xs text-slate-400 italic py-2">ยังไม่มีรายการรักษา</p>
              ) : (
                <div className="divide-y divide-slate-100">
                  {visit.treatmentItems.map((item: any) => (
                    <div key={item.id} className="py-2 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-slate-800">
                          {item.procedureName} {item.toothNumber ? `(ซี่ ${item.toothNumber})` : ''}
                        </span>
                        <span className="block text-[10px] text-slate-400 font-mono">
                          DF แพทย์ที่คำนวณ: {formatCurrency(item.dfFinal)} ({item.dfRate}%)
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

          {/* Pharmacy Prescription Order & Label Print */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2">
                <Pill className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-800">สั่งจ่ายยา & พิมพ์ฉลากยา</h3>
              </div>
            </div>

            <form onSubmit={handleAddPrescription} className="space-y-3 text-xs">
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">ชื่อยา</label>
                  <select
                    value={drugName}
                    onChange={(e) => {
                      setDrugName(e.target.value);
                      if (e.target.value === 'Amoxicillin 500mg') setDosageInstructions('รับประทานครั้งละ 1 เม็ด หลังอาหาร เช้า-กลางวัน-เย็น (ทานติดต่อกันจนหมด)');
                      if (e.target.value === 'Ibuprofen 400mg') setDosageInstructions('รับประทานครั้งละ 1 เม็ด หลังอาหารทันที เช้า-เย็น เมื่อมีอาการปวด');
                      if (e.target.value === 'Paracetamol 500mg') setDosageInstructions('รับประทานครั้งละ 1-2 เม็ด ทุก 4-6 ชั่วโมง เมื่อมีอาการปวด');
                    }}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-xl bg-white"
                  >
                    <option value="Amoxicillin 500mg">Amoxicillin 500mg</option>
                    <option value="Ibuprofen 400mg">Ibuprofen 400mg</option>
                    <option value="Paracetamol 500mg">Paracetamol 500mg</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">จำนวน (เม็ด)</label>
                  <input
                    type="number"
                    value={drugQty}
                    onChange={(e) => setDrugQty(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-xl font-mono text-center"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">วิธีใช้ยา (คำแนะนำสำหรับฉลาก)</label>
                <input
                  type="text"
                  value={dosageInstructions}
                  onChange={(e) => setDosageInstructions(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  disabled={prescLoading}
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-sm flex items-center gap-1.5"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>เพิ่มรายการสั่งยา</span>
                </button>
              </div>
            </form>

            {/* Prescribed Drugs List with Label Preview Button */}
            <div className="border-t border-slate-100 pt-3 space-y-2">
              {visit.prescriptionItems && visit.prescriptionItems.length > 0 && (
                <div className="divide-y divide-slate-100">
                  {visit.prescriptionItems.map((pi: any) => (
                    <div key={pi.id} className="py-2.5 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-slate-800">{pi.drugName}</span> ({pi.quantity} {pi.unit})
                        <p className="text-[11px] text-slate-500 mt-0.5">{pi.dosageInstructions}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setPrintableLabel(pi)}
                        className="px-2.5 py-1 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-[11px] flex items-center gap-1"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>ตรวจทานฉลากยา</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Printable Prescription Label Modal */}
      {printableLabel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-sm p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <h4 className="text-xs font-bold text-slate-800">ตัวอย่างฉลากยาก่อนพิมพ์ (Label Preview)</h4>
              <button
                type="button"
                onClick={() => setPrintableLabel(null)}
                className="text-xs text-slate-400 hover:text-slate-600"
              >
                ปิด
              </button>
            </div>

            {/* Simulated Dental Drug Label */}
            <div className="p-4 rounded-xl border-2 border-slate-800 bg-white space-y-2 text-xs">
              <div className="text-center border-b pb-1">
                <p className="font-bold text-slate-900">คลินิกทันตกรรมหมอมิน หมอพรีม</p>
                <p className="text-[10px] text-slate-500">โทร. 02-123-4567, 089-999-8888</p>
              </div>
              <div className="flex justify-between text-[11px]">
                <span>ชื่อคนไข้: <strong>{patient.firstNameTh} {patient.lastNameTh}</strong></span>
                <span>{patient.dn}</span>
              </div>
              <div className="py-1">
                <p className="font-bold text-sm text-slate-900">{printableLabel.drugName}</p>
                <p className="text-xs text-slate-700 mt-1 font-semibold">{printableLabel.dosageInstructions}</p>
              </div>
              <div className="border-t pt-1 flex justify-between text-[10px] text-slate-500">
                <span>จำนวน: {printableLabel.quantity} {printableLabel.unit}</span>
                <span>วันที่: {formatThaiDate(new Date())}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>พิมพ์ฉลาก</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
