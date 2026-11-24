'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  User,
  Calendar,
  CreditCard,
  FileText,
  Smile,
  FlaskConical,
  Paperclip,
  ShieldAlert,
  ArrowLeft,
  PlusCircle,
  Coins,
  History,
  CheckCircle,
} from 'lucide-react';
import { formatThaiDate, formatThaiDateTime, formatCurrency } from '@/lib/utils';
import FdiToothChart from '@/components/FdiToothChart';

export default function PatientProfilePage() {
  const params = useParams();
  const router = useRouter();
  const patientId = params.id as string;

  const [patient, setPatient] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<string>('general');
  const [loading, setLoading] = useState(true);

  // Deposit modal state
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');
  const [depositType, setDepositType] = useState<'RECEIVE' | 'REFUND'>('RECEIVE');
  const [depositMethod, setDepositMethod] = useState('TRANSFER');
  const [depositNotes, setDepositNotes] = useState('');
  const [depositLoading, setDepositLoading] = useState(false);

  // New treatment plan state
  const [newPlanProcCode, setNewPlanProcCode] = useState('D10');
  const [newPlanProcName, setNewPlanProcName] = useState('ขูดหินปูนทั้งปากพร้อมขัดฟัน');
  const [newPlanTooth, setNewPlanTooth] = useState('');
  const [newPlanPrice, setNewPlanPrice] = useState('1200');

  const fetchPatient = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/patients/${patientId}`);
      const data = await res.json();
      if (data?.patient) {
        setPatient(data.patient);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (patientId) fetchPatient();
  }, [patientId]);

  const handleDepositSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!depositAmount || Number(depositAmount) <= 0) return;
    setDepositLoading(true);
    try {
      const res = await fetch('/api/deposits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId,
          type: depositType,
          amount: Number(depositAmount),
          paymentMethod: depositMethod,
          notes: depositNotes,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setIsDepositModalOpen(false);
      setDepositAmount('');
      setDepositNotes('');
      fetchPatient();
    } catch (err: any) {
      alert(err.message || 'Deposit failed');
    } finally {
      setDepositLoading(false);
    }
  };

  const handleAddPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/patients/${patientId}/treatment-plans`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toothNumber: newPlanTooth || null,
          procedureCode: newPlanProcCode,
          procedureName: newPlanProcName,
          estimatedPrice: Number(newPlanPrice),
          status: 'PROPOSED',
        }),
      });
      if (res.ok) {
        setNewPlanTooth('');
        fetchPatient();
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center text-slate-400">
        กำลังโหลดแฟ้มประวัติคนไข้...
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="py-24 text-center text-rose-500">
        ไม่พบข้อมูลคนไข้ที่ระบุ
      </div>
    );
  }

  const tabs = [
    { key: 'general', label: 'ข้อมูลทั่วไป', icon: User },
    { key: 'tooth-chart', label: 'ผังฟัน (FDI Chart)', icon: Smile },
    { key: 'visits', label: 'ประวัติการรักษา (Visits)', icon: History },
    { key: 'plans', label: 'แผนการรักษา (Plans)', icon: FileText },
    { key: 'finances', label: 'การเงิน & ใบเสร็จ', icon: CreditCard },
    { key: 'ortho', label: 'แพ็กเกจจัดฟัน', icon: Smile },
    { key: 'lab', label: 'งานแลป', icon: FlaskConical },
    { key: 'documents', label: 'เอกสาร & X-Ray', icon: Paperclip },
  ];

  return (
    <div className="space-y-6">
      {/* Back Button & Patient Summary Header */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <Link
              href="/patients"
              className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors mt-0.5"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2.5">
                <span className="px-2.5 py-0.5 rounded-lg bg-sky-100 text-sky-800 text-xs font-mono font-bold">
                  {patient.dn}
                </span>
                <h1 className="text-xl font-bold text-slate-900">
                  {patient.title} {patient.firstNameTh} {patient.lastNameTh}
                </h1>
                {patient.firstNameEn && (
                  <span className="text-xs text-slate-400 font-medium">
                    ({patient.firstNameEn} {patient.lastNameEn})
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                <span>เบอร์โทร: <strong className="text-slate-700 font-mono">{patient.phone}</strong></span>
                <span>•</span>
                <span>เพศ: {patient.gender === 'FEMALE' ? 'หญิง' : patient.gender === 'MALE' ? 'ชาย' : 'อื่นๆ'}</span>
                <span>•</span>
                <span>วันเกิด: {formatThaiDate(patient.birthDate)}</span>
                <span>•</span>
                <span>สิทธิ: <strong className="text-slate-700">{patient.rights}</strong></span>
              </div>
            </div>
          </div>

          {/* Deposit Balance Badge & Action */}
          <div className="flex items-center gap-3 self-end md:self-auto">
            <div className="px-3.5 py-2 rounded-xl bg-amber-50 border border-amber-200 text-right">
              <span className="text-[10px] font-semibold text-amber-700 block">เงินมัดจำคงเหลือ</span>
              <span className="text-sm font-bold text-amber-900 font-mono">
                {formatCurrency(patient.depositBalance)}
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                setDepositType('RECEIVE');
                setIsDepositModalOpen(true);
              }}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 shadow-sm transition-all flex items-center gap-1.5"
            >
              <Coins className="w-4 h-4" />
              <span>รับ/คืนมัดจำ</span>
            </button>
          </div>
        </div>

        {/* CLINICAL SAFETY BANNER: Red alert for allergies & chronic diseases */}
        {(patient.drugAllergies || patient.chronicDiseases) && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-xs">
            <ShieldAlert className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
            <div className="space-y-1 flex-1">
              {patient.drugAllergies && (
                <p className="text-rose-900 font-bold">
                  ⚠️ ประวัติแพ้ยา: <span className="underline decoration-rose-500">{patient.drugAllergies}</span>
                </p>
              )}
              {patient.chronicDiseases && (
                <p className="text-amber-900 font-semibold">
                  🩺 โรคประจำตัว: {patient.chronicDiseases}
                </p>
              )}
              {patient.currentMedications && (
                <p className="text-slate-700">
                  💊 ยาที่รับประทานประจำ: {patient.currentMedications}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Tabs Navigation */}
        <div className="flex border-b border-slate-200 overflow-x-auto no-scrollbar space-x-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-semibold whitespace-nowrap border-b-2 transition-all ${
                  isActive
                    ? 'border-sky-600 text-sky-700 bg-sky-50/40'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-sky-600' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab 1: General Info */}
      {activeTab === 'general' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 space-y-3">
            <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">
              ข้อมูลส่วนตัวและการติดต่อ
            </h3>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block">เลขบัตรประชาชน</span>
                <span className="font-semibold text-slate-800">{patient.idCardNumber || '-'}</span>
              </div>
              <div>
                <span className="text-slate-400 block">อีเมล</span>
                <span className="font-semibold text-slate-800">{patient.email || '-'}</span>
              </div>
              <div className="col-span-2">
                <span className="text-slate-400 block">ที่อยู่</span>
                <span className="font-semibold text-slate-800">{patient.address || '-'}</span>
              </div>
              <div>
                <span className="text-slate-400 block">ผู้ติดต่อฉุกเฉิน</span>
                <span className="font-semibold text-slate-800">
                  {patient.emergencyContactName || '-'} ({patient.emergencyRelation || '-'})
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">เบอร์ติดต่อฉุกเฉิน</span>
                <span className="font-semibold text-slate-800 font-mono">
                  {patient.emergencyContactPhone || '-'}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 space-y-3">
            <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">
              ข้อมูลคลินิก & สิทธิการรักษา
            </h3>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block">สิทธิการรักษา</span>
                <span className="font-semibold text-slate-800">{patient.rights}</span>
              </div>
              <div>
                <span className="text-slate-400 block">ทันตแพทย์ประจำ</span>
                <span className="font-semibold text-slate-800">
                  {patient.attendingDoctor ? patient.attendingDoctor.fullName : 'ไม่ระบุ'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">แหล่งที่รู้จักคลินิก</span>
                <span className="font-semibold text-slate-800">{patient.marketingSource || '-'}</span>
              </div>
              <div>
                <span className="text-slate-400 block">วันที่ลงทะเบียน</span>
                <span className="font-semibold text-slate-800">{formatThaiDate(patient.createdAt)}</span>
              </div>
              <div className="col-span-2">
                <span className="text-slate-400 block">บันทึกช่วยจำ (Notes)</span>
                <span className="text-slate-600 italic">{patient.notes || '-'}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: FDI Tooth Chart */}
      {activeTab === 'tooth-chart' && (
        <FdiToothChart
          patientId={patientId}
          toothConditions={patient.toothConditions || []}
          onConditionAdded={fetchPatient}
        />
      )}

      {/* Tab 3: Visits & Medical Records */}
      {activeTab === 'visits' && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 space-y-4">
          <h3 className="text-sm font-bold text-slate-800">ประวัติการมารักษา (Visits)</h3>
          {patient.visits && patient.visits.length === 0 ? (
            <p className="text-xs text-slate-400 italic">ยังไม่มีประวัติการมารักษา</p>
          ) : (
            <div className="space-y-4">
              {patient.visits.map((v: any) => (
                <div key={v.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3 text-xs">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-800">{formatThaiDate(v.visitDate, true)}</span>
                      <span className="text-slate-400">({v.visitNumber})</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-100 text-teal-800">
                        {v.status === 'COMPLETED' ? 'เสร็จสิ้น' : v.status}
                      </span>
                    </div>
                    <span className="text-slate-600 font-semibold">
                      แพทย์: {v.doctor.nickname || v.doctor.fullName} | {v.room.name}
                    </span>
                  </div>

                  {/* Medical Record Details */}
                  {v.medicalRecord && (
                    <div className="grid grid-cols-2 gap-3 bg-white p-3 rounded-lg border border-slate-200">
                      <div>
                        <span className="font-bold text-slate-700 block">อาการสำคัญ (CC):</span>
                        <p className="text-slate-600">{v.medicalRecord.chiefComplaint || '-'}</p>
                      </div>
                      <div>
                        <span className="font-bold text-slate-700 block">การวินิจฉัย (Dx):</span>
                        <p className="text-slate-600">{v.medicalRecord.diagnosis || '-'}</p>
                      </div>
                      <div className="col-span-2">
                        <span className="font-bold text-slate-700 block">หัตถการ & ผลตรวจ (PE / Tx):</span>
                        <p className="text-slate-600">{v.medicalRecord.treatmentDescription || '-'}</p>
                      </div>
                      {v.medicalRecord.advice && (
                        <div className="col-span-2">
                          <span className="font-bold text-slate-700 block">คำแนะนำ:</span>
                          <p className="text-slate-600">{v.medicalRecord.advice}</p>
                        </div>
                      )}
                      <div className="col-span-2 flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-100">
                        <span>
                          {v.medicalRecord.isSigned
                            ? `✓ ลงนามรับรองแล้วเมื่อ ${formatThaiDateTime(v.medicalRecord.signedAt)}`
                            : 'ฉบับร่าง (ยังไม่ลงนาม)'}
                        </span>
                        {v.medicalRecord.editReason && (
                          <span className="text-amber-700">เหตุผลที่แก้ไข: {v.medicalRecord.editReason}</span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Treatment Items Done */}
                  {v.treatmentItems && v.treatmentItems.length > 0 && (
                    <div>
                      <span className="font-bold text-slate-700 block mb-1">รายการหัตถการที่ทำ:</span>
                      <div className="divide-y divide-slate-100 bg-white rounded-lg border border-slate-200">
                        {v.treatmentItems.map((ti: any) => (
                          <div key={ti.id} className="p-2 flex items-center justify-between">
                            <span>
                              {ti.procedureName} {ti.toothNumber ? `(ซี่ ${ti.toothNumber})` : ''} x {ti.qty}
                            </span>
                            <span className="font-mono font-bold text-slate-800">
                              {formatCurrency(ti.netAmount)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Treatment Plans */}
      {activeTab === 'plans' && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800">แผนการรักษาล่วงหน้า (Treatment Plans)</h3>
          </div>

          {/* Add Plan Form */}
          <form onSubmit={handleAddPlan} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-wrap items-end gap-3 text-xs">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">รหัส/ชื่อหัตถการ</label>
              <select
                value={newPlanProcCode}
                onChange={(e) => {
                  setNewPlanProcCode(e.target.value);
                  if (e.target.value === 'D10') { setNewPlanProcName('ขูดหินปูนทั้งปากพร้อมขัดฟัน'); setNewPlanPrice('1200'); }
                  if (e.target.value === 'D20') { setNewPlanProcName('อุดฟันคอมโพสิตเรซิน 1 ด้าน'); setNewPlanPrice('900'); }
                  if (e.target.value === 'D30') { setNewPlanProcName('ถอนฟันแท้ทั่วไป'); setNewPlanPrice('1000'); }
                  if (e.target.value === 'D50') { setNewPlanProcName('ครอบฟัน Zirconia All-Ceramic'); setNewPlanPrice('12000'); }
                }}
                className="px-3 py-1.5 border border-slate-300 rounded-lg bg-white"
              >
                <option value="D10">D10: ขูดหินปูนทั้งปาก (1,200฿)</option>
                <option value="D20">D20: อุดฟันคอมโพสิต 1 ด้าน (900฿)</option>
                <option value="D30">D30: ถอนฟันแท้ (1,000฿)</option>
                <option value="D50">D50: ครอบฟัน Zirconia (12,000฿)</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">ซี่ฟัน</label>
              <input
                type="text"
                placeholder="เช่น 16, 21"
                value={newPlanTooth}
                onChange={(e) => setNewPlanTooth(e.target.value)}
                className="w-20 px-3 py-1.5 border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">ราคาประมาณ (บาท)</label>
              <input
                type="number"
                value={newPlanPrice}
                onChange={(e) => setNewPlanPrice(e.target.value)}
                className="w-28 px-3 py-1.5 border border-slate-300 rounded-lg"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-1.5 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg shadow-sm"
            >
              + เพิ่มแผนรักษา
            </button>
          </form>

          {/* Plan Items List */}
          <div className="divide-y divide-slate-100">
            {patient.treatmentPlans && patient.treatmentPlans.length === 0 ? (
              <p className="py-6 text-center text-xs text-slate-400 italic">ยังไม่มีแผนการรักษา</p>
            ) : (
              patient.treatmentPlans.map((pl: any) => (
                <div key={pl.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-800">
                      {pl.procedureName} {pl.toothNumber ? `(ซี่ ${pl.toothNumber})` : ''}
                    </span>
                    <span className="ml-2 px-2 py-0.5 rounded text-[10px] font-semibold bg-sky-100 text-sky-800">
                      {pl.status === 'PROPOSED' ? 'เสนอ' : pl.status === 'PLANNED' ? 'วางแผน' : pl.status === 'DONE' ? 'ทำแล้ว' : 'ยกเลิก'}
                    </span>
                  </div>
                  <span className="font-mono font-bold text-slate-900">
                    {formatCurrency(pl.estimatedPrice)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Tab 5: Finances & Receipts */}
      {activeTab === 'finances' && (
        <div className="space-y-5">
          {/* Invoices */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 space-y-3">
            <h3 className="text-sm font-bold text-slate-800">ใบแจ้งค่ารักษา (Invoices)</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs divide-y divide-slate-200">
                <thead className="bg-slate-50 font-bold text-slate-600">
                  <tr>
                    <th className="px-3 py-2">เลขที่บิล</th>
                    <th className="px-3 py-2">วันที่</th>
                    <th className="px-3 py-2 text-right">ยอดรวม</th>
                    <th className="px-3 py-2 text-right">ส่วนลด</th>
                    <th className="px-3 py-2 text-right">ยอดสุทธิ</th>
                    <th className="px-3 py-2 text-right">ชำระแล้ว</th>
                    <th className="px-3 py-2 text-right">ค้างชำระ</th>
                    <th className="px-3 py-2 text-center">สถานะ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {patient.invoices && patient.invoices.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-6 text-center text-slate-400 italic">ไม่มีประวัติบิล</td>
                    </tr>
                  ) : (
                    patient.invoices.map((inv: any) => (
                      <tr key={inv.id}>
                        <td className="px-3 py-2 font-mono font-bold text-sky-700">{inv.invoiceNo}</td>
                        <td className="px-3 py-2">{formatThaiDate(inv.createdAt)}</td>
                        <td className="px-3 py-2 text-right font-mono">{formatCurrency(inv.totalAmount)}</td>
                        <td className="px-3 py-2 text-right font-mono text-rose-600">-{formatCurrency(inv.totalDiscount)}</td>
                        <td className="px-3 py-2 text-right font-mono font-bold">{formatCurrency(inv.netAmount)}</td>
                        <td className="px-3 py-2 text-right font-mono text-emerald-600">{formatCurrency(inv.paidAmount)}</td>
                        <td className="px-3 py-2 text-right font-mono text-amber-600 font-bold">{formatCurrency(inv.balanceDue)}</td>
                        <td className="px-3 py-2 text-center">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            inv.status === 'PAID' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {inv.status === 'PAID' ? 'ชำระครบ' : inv.status === 'PARTIALLY_PAID' ? 'ค้างบางส่วน' : 'ยังไม่ชำระ'}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Receipts */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 space-y-3">
            <h3 className="text-sm font-bold text-slate-800">ใบเสร็จรับเงิน (Receipts)</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs divide-y divide-slate-200">
                <thead className="bg-slate-50 font-bold text-slate-600">
                  <tr>
                    <th className="px-3 py-2">เลขที่ใบเสร็จ</th>
                    <th className="px-3 py-2">วันที่ออก</th>
                    <th className="px-3 py-2">ช่องทางชำระ</th>
                    <th className="px-3 py-2 text-right">ยอดรับเงิน</th>
                    <th className="px-3 py-2 text-center">สถานะ</th>
                    <th className="px-3 py-2 text-right">พิมพ์</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {patient.receipts && patient.receipts.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-6 text-center text-slate-400 italic">ไม่มีใบเสร็จรับเงิน</td>
                    </tr>
                  ) : (
                    patient.receipts.map((rec: any) => (
                      <tr key={rec.id}>
                        <td className="px-3 py-2 font-mono font-bold text-slate-900">{rec.receiptNo}</td>
                        <td className="px-3 py-2">{formatThaiDate(rec.receiptDate)}</td>
                        <td className="px-3 py-2 text-slate-600">{rec.paymentMethodSummary}</td>
                        <td className="px-3 py-2 text-right font-mono font-bold text-emerald-700">
                          {formatCurrency(rec.paidAmount)}
                        </td>
                        <td className="px-3 py-2 text-center">
                          {rec.isVoided ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">
                              ยกเลิกแล้ว
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                              สมบูรณ์
                            </span>
                          )}
                        </td>
                        <td className="px-3 py-2 text-right">
                          <Link
                            href={`/billing/receipts/${rec.id}`}
                            className="px-2.5 py-1 text-[11px] font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 rounded-lg"
                          >
                            ดูใบเสร็จ
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 6: Orthodontics */}
      {activeTab === 'ortho' && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 space-y-4">
          <h3 className="text-sm font-bold text-slate-800">แพ็กเกจจัดฟันและการปรับเครื่องมือ</h3>
          {patient.patientOrthoPackages && patient.patientOrthoPackages.length === 0 ? (
            <p className="text-xs text-slate-400 italic">คนไข้ท่านนี้ยังไม่ได้สมัครแพ็กเกจจัดฟัน</p>
          ) : (
            patient.patientOrthoPackages.map((pkg: any) => (
              <div key={pkg.id} className="space-y-4">
                <div className="p-4 rounded-xl bg-purple-50/70 border border-purple-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div>
                    <h4 className="font-bold text-purple-950 text-sm">{pkg.packageName}</h4>
                    <p className="text-purple-700">เริ่มเมื่อ: {formatThaiDate(pkg.startedDate)}</p>
                  </div>
                  <div className="flex gap-4 font-mono">
                    <div>
                      <span className="text-[10px] text-purple-600 block">ราคาเต็ม</span>
                      <strong className="text-purple-950">{formatCurrency(pkg.totalAmount)}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-emerald-600 block">ชำระแล้ว</span>
                      <strong className="text-emerald-800">{formatCurrency(pkg.paidAmount)}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-amber-600 block">คงเหลือ</span>
                      <strong className="text-amber-900">{formatCurrency(pkg.balanceDue)}</strong>
                    </div>
                  </div>
                </div>

                {/* 24 Installments Grid */}
                <div>
                  <h5 className="text-xs font-bold text-slate-700 mb-2">ตารางงวดการผ่อนชำระ (Installments)</h5>
                  <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                    {pkg.installments && pkg.installments.map((inst: any) => (
                      <div
                        key={inst.id}
                        className={`p-2 rounded-xl border text-center text-xs ${
                          inst.status === 'PAID'
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                            : 'bg-white border-slate-200 text-slate-600'
                        }`}
                      >
                        <span className="block text-[10px] font-bold">งวด {inst.installmentNo}</span>
                        <span className="font-mono font-bold text-[11px]">
                          {formatCurrency(inst.plannedAmount)}
                        </span>
                        <span className="block text-[9px] mt-0.5">
                          {inst.status === 'PAID' ? '✓ จ่ายแล้ว' : 'รอชำระ'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 7: Lab Orders */}
      {activeTab === 'lab' && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 space-y-4">
          <h3 className="text-sm font-bold text-slate-800">ประวัติงานแลปทันตกรรม (Lab Orders)</h3>
          {patient.labOrders && patient.labOrders.length === 0 ? (
            <p className="text-xs text-slate-400 italic">ไม่มีรายการส่งแลปสำหรับคนไข้ท่านนี้</p>
          ) : (
            <div className="divide-y divide-slate-100 text-xs">
              {patient.labOrders.map((lo: any) => (
                <div key={lo.id} className="py-3 flex items-center justify-between">
                  <div>
                    <span className="font-mono font-bold text-sky-700 mr-2">{lo.orderNo}</span>
                    <span className="font-semibold text-slate-800">
                      {lo.workType} (ซี่ {lo.toothNumber || '-'}) - {lo.labCompanyName}
                    </span>
                    <span className="block text-slate-500 text-[11px] mt-0.5">
                      กำหนดรับ: {formatThaiDate(lo.dueDate)} | สีฟัน: {lo.shadeGuide || '-'}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-slate-800 block">
                      {formatCurrency(lo.cost)}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                      {lo.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 8: Documents & X-Rays */}
      {activeTab === 'documents' && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800">เอกสารแนบ ภาพถ่าย และฟิล์ม X-Ray</h3>
          </div>
          {patient.documents && patient.documents.length === 0 ? (
            <p className="text-xs text-slate-400 italic">ยังไม่มีเอกสารหรือภาพถ่ายแนบ</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {patient.documents.map((doc: any) => (
                <div key={doc.id} className="p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs">
                  <span className="font-bold text-slate-800 block truncate">{doc.title}</span>
                  <span className="text-[10px] text-slate-400">{doc.category}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Deposit Modal */}
      {isDepositModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md p-5 space-y-4">
            <h3 className="text-sm font-bold text-slate-800">
              {depositType === 'RECEIVE' ? 'รับเงินมัดจำล่วงหน้า' : 'คืนเงินมัดจำ'} - {patient.firstNameTh} {patient.lastNameTh}
            </h3>

            <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => setDepositType('RECEIVE')}
                className={`flex-1 py-1.5 rounded-lg transition-all ${
                  depositType === 'RECEIVE' ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-600'
                }`}
              >
                + รับมัดจำ
              </button>
              <button
                type="button"
                onClick={() => setDepositType('REFUND')}
                className={`flex-1 py-1.5 rounded-lg transition-all ${
                  depositType === 'REFUND' ? 'bg-white text-rose-800 shadow-sm' : 'text-slate-600'
                }`}
              >
                - คืนมัดจำ
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">จำนวนเงิน (บาท) *</label>
              <input
                type="number"
                placeholder="ระบุจำนวนเงิน..."
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl font-mono text-base font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">ช่องทางชำระ</label>
              <select
                value={depositMethod}
                onChange={(e) => setDepositMethod(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-xl bg-white"
              >
                <option value="TRANSFER">โอนเงิน / PromptPay</option>
                <option value="CASH">เงินสด</option>
                <option value="CREDIT_CARD">บัตรเครดิต</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">หมายเหตุ</label>
              <input
                type="text"
                placeholder="เช่น มัดจำคิวจัดฟัน..."
                value={depositNotes}
                onChange={(e) => setDepositNotes(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-xl"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsDepositModalOpen(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={handleDepositSubmit}
                disabled={depositLoading}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-sm"
              >
                {depositLoading ? 'กำลังบันทึก...' : 'ยืนยันทำรายการ'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
