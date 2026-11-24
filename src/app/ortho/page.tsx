'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Smile, Plus, User, Clock, CheckCircle, Search, Calendar, AlertCircle } from 'lucide-react';
import { formatThaiDate, formatCurrency } from '@/lib/utils';

export default function OrthodonticsPage() {
  const [patientPackages, setPatientPackages] = useState<any[]>([]);
  const [masterPackages, setMasterPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal for new adjustment log
  const [selectedPkg, setSelectedPkg] = useState<any | null>(null);
  const [upperWire, setUpperWire] = useState('.014 NiTi');
  const [lowerWire, setLowerWire] = useState('.014 NiTi');
  const [elastics, setElastics] = useState('Class II 3/16 4.5oz');
  const [procNotes, setProcNotes] = useState('ปรับเครื่องมือ เปลี่ยนยาง O-ring สีฟ้า');
  const [nextTarget, setNextTarget] = useState('เปลี่ยนลวด .016 NiTi ในอีก 4 สัปดาห์');
  const [submittingLog, setSubmittingLog] = useState(false);

  const fetchOrthoData = async () => {
    setLoading(true);
    try {
      const [ppRes, mpRes] = await Promise.all([
        fetch('/api/ortho/patient-packages'),
        fetch('/api/ortho/packages'),
      ]);
      const ppData = await ppRes.json();
      const mpData = await mpRes.json();
      setPatientPackages(ppData.patientPackages || []);
      setMasterPackages(mpData.packages || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrthoData();
  }, []);

  const handleSaveAdjustmentLog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPkg) return;
    setSubmittingLog(true);
    try {
      const res = await fetch('/api/ortho/patient-packages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'ADJUSTMENT_LOG',
          patientOrthoPackageId: selectedPkg.id,
          upperArchWire: upperWire,
          lowerArchWire: lowerWire,
          elasticNotes: elastics,
          procedureNotes: procNotes,
          nextVisitTarget: nextTarget,
        }),
      });
      if (res.ok) {
        setSelectedPkg(null);
        fetchOrthoData();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmittingLog(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Smile className="w-5 h-5 text-purple-600" />
            <span>งานทันตกรรมจัดฟัน & ตารางงวด</span>
          </h1>
          <p className="text-xs text-slate-500">
            ติดตามแผนผ่อนชำระ ประวัติปรับเครื่องมือ (ลวด/ยาง) และเป้าหมายการนัดหมายครั้งถัดไป
          </p>
        </div>
      </div>

      {/* Master Packages Card Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {masterPackages.map((pkg) => (
          <div key={pkg.id} className="p-4 bg-white rounded-2xl border border-purple-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 text-sm">{pkg.name}</span>
              <span className="text-xs font-mono font-bold text-purple-700">{formatCurrency(pkg.totalAmount)}</span>
            </div>
            <p className="text-[11px] text-slate-500">{pkg.description || 'แพ็กเกจจัดฟันมาตรฐานคลินิก'}</p>
            <div className="text-[11px] text-slate-600 flex justify-between border-t border-slate-100 pt-1">
              <span>ติดเครื่องมือ/มัดจำ: {formatCurrency(pkg.downPayment)}</span>
              <span>{pkg.installmentCount} งวด x {formatCurrency(pkg.installmentAmount)}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Active Patients with Ortho Package */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-slate-800">
          รายการคนไข้จัดฟันที่กำลังรักษาอยู่ ({patientPackages.length} เคส)
        </h2>

        {patientPackages.map((pp) => (
          <div key={pp.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs">
                  {pp.patient.dn.slice(-4)}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/patients/${pp.patientId}`}
                      className="font-bold text-slate-900 hover:text-sky-600 text-sm"
                    >
                      {pp.patient.title} {pp.patient.firstNameTh} {pp.patient.lastNameTh}
                    </Link>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-purple-800 border border-purple-200">
                      {pp.packageName}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500">
                    โทร: {pp.patient.phone} | เริ่มติดเครื่องมือ: {formatThaiDate(pp.startedDate)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right text-xs font-mono">
                  <span className="text-slate-400 block text-[10px]">ชำระแล้ว / คงเหลือ</span>
                  <strong className="text-emerald-700">{formatCurrency(pp.paidAmount)}</strong> /{' '}
                  <strong className="text-amber-700">{formatCurrency(pp.balanceDue)}</strong>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedPkg(pp)}
                  className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs rounded-xl shadow-sm"
                >
                  + บันทึกปรับเครื่องมือ
                </button>
              </div>
            </div>

            {/* Installments Progress Bar & Summary */}
            <div>
              <span className="text-[11px] font-bold text-slate-500 block mb-2">ตารางงวดชำระ (Installment Status):</span>
              <div className="grid grid-cols-6 sm:grid-cols-12 gap-1.5">
                {pp.installments && pp.installments.map((inst: any) => (
                  <div
                    key={inst.id}
                    className={`p-1.5 rounded-lg border text-center text-[10px] ${
                      inst.status === 'PAID'
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-bold'
                        : 'bg-slate-50 border-slate-200 text-slate-500'
                    }`}
                  >
                    <div>งวด {inst.installmentNo}</div>
                    <div className="text-[9px] mt-0.5">{inst.status === 'PAID' ? '✓ จ่าย' : 'รอ'}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Adjustment Logs */}
            {pp.adjustmentLogs && pp.adjustmentLogs.length > 0 && (
              <div className="border-t border-slate-100 pt-3 space-y-2">
                <span className="text-[11px] font-bold text-slate-500 block">
                  ประวัติการปรับเครื่องมือล่าสุด (Recent Adjustment Logs):
                </span>
                <div className="space-y-1.5">
                  {pp.adjustmentLogs.slice(0, 3).map((log: any) => (
                    <div key={log.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs flex justify-between items-center">
                      <div>
                        <span className="font-semibold text-slate-800">{log.procedureNotes}</span>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          ลวดบน: <strong className="text-slate-700">{log.upperArchWire || '-'}</strong> | ลวดล่าง: <strong className="text-slate-700">{log.lowerArchWire || '-'}</strong> | ยางดึง: {log.elasticNotes || '-'}
                        </div>
                      </div>
                      <div className="text-right text-[11px] text-slate-500">
                        <span>{formatThaiDate(log.date)}</span>
                        {log.nextVisitTarget && (
                          <span className="block text-purple-700 font-semibold">{log.nextVisitTarget}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Adjustment Log Modal */}
      {selectedPkg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-800">
              บันทึกการปรับเครื่องมือจัดฟัน: {selectedPkg.patient.firstNameTh} {selectedPkg.patient.lastNameTh}
            </h3>

            <form onSubmit={handleSaveAdjustmentLog} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">ลวดฟันบน (Upper Arch)</label>
                  <input
                    type="text"
                    value={upperWire}
                    onChange={(e) => setUpperWire(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">ลวดฟันล่าง (Lower Arch)</label>
                  <input
                    type="text"
                    value={lowerWire}
                    onChange={(e) => setLowerWire(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">รายละเอียดยางดึง (Elastics)</label>
                <input
                  type="text"
                  value={elastics}
                  onChange={(e) => setElastics(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">หัตถการที่ทำในครั้งนี้</label>
                <input
                  type="text"
                  value={procNotes}
                  onChange={(e) => setProcNotes(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">เป้าหมายนัดครั้งถัดไป</label>
                <input
                  type="text"
                  value={nextTarget}
                  onChange={(e) => setNextTarget(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setSelectedPkg(null)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={submittingLog}
                  className="px-4 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg shadow-sm"
                >
                  {submittingLog ? 'กำลังบันทึก...' : 'บันทึกการปรับเครื่องมือ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
