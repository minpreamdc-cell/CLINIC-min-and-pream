'use client';

import React, { useState, useEffect } from 'react';
import { FlaskConical, PlusCircle, Search, Clock, CheckCircle, RotateCcw, AlertCircle } from 'lucide-react';
import { formatThaiDate, formatCurrency } from '@/lib/utils';

export default function DentalLabPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  // New Lab Order Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [patients, setPatients] = useState<any[]>([]);
  const [patientSearch, setPatientSearch] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<any | null>(null);

  const [doctorId, setDoctorId] = useState('');
  const [toothNumber, setToothNumber] = useState('21');
  const [workType, setWorkType] = useState('CROWN');
  const [labCompanyName, setLabCompanyName] = useState('โมเดิร์น เดนทัล แลป');
  const [dueDate, setDueDate] = useState('');
  const [cost, setCost] = useState('3200');
  const [deductionType, setDeductionType] = useState('DOCTOR');
  const [shadeGuide, setShadeGuide] = useState('A2');
  const [instructions, setInstructions] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Revision modal
  const [revisionOrder, setRevisionOrder] = useState<any | null>(null);
  const [revisionNotes, setRevisionNotes] = useState('');

  const fetchLabData = async () => {
    setLoading(true);
    try {
      const q = statusFilter !== 'all' ? `?status=${statusFilter}` : '';
      const [oRes, dRes] = await Promise.all([
        fetch(`/api/lab/orders${q}`),
        fetch('/api/settings'),
      ]);
      const oData = await oRes.json();
      const dData = await dRes.json();

      setOrders(oData.orders || []);
      setDoctors(dData.doctors || []);
      if (dData.doctors?.length > 0 && !doctorId) {
        setDoctorId(dData.doctors[0].id);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLabData();
  }, [statusFilter]);

  useEffect(() => {
    if (patientSearch.length >= 2) {
      fetch(`/api/patients?search=${encodeURIComponent(patientSearch)}&limit=5`)
        .then((res) => res.json())
        .then((data) => setPatients(data.patients || []));
    }
  }, [patientSearch]);

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient || !doctorId || !dueDate) {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/lab/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId: selectedPatient.id,
          doctorId,
          toothNumber,
          workType,
          labCompanyName,
          dueDate,
          cost: Number(cost),
          deductionType,
          shadeGuide,
          instructions,
        }),
      });
      if (res.ok) {
        setIsModalOpen(false);
        setSelectedPatient(null);
        fetchLabData();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      await fetch('/api/lab/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status: newStatus }),
      });
      fetchLabData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleRevisionSubmit = async () => {
    if (!revisionOrder || !revisionNotes) return;
    try {
      await fetch('/api/lab/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: revisionOrder.id,
          status: 'REVISION',
          revisionNotes,
        }),
      });
      setRevisionOrder(null);
      setRevisionNotes('');
      fetchLabData();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-indigo-600" />
            <span>ระบบติดตามงานแลปทันตกรรม (Dental Lab)</span>
          </h1>
          <p className="text-xs text-slate-500">
            ใบส่งแลป ครอบฟัน สะพานฟัน รีเทนเนอร์ ฟันปลอม ติดตามสถานะและหักค่าใช้จ่าย
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            const nextWeek = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0];
            setDueDate(nextWeek);
            setIsModalOpen(true);
          }}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-md shadow-indigo-600/20 flex items-center gap-1.5"
        >
          <PlusCircle className="w-4 h-4" />
          <span>+ เปิดใบส่งแลปใหม่</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex bg-white p-2 rounded-2xl shadow-sm border border-slate-200 overflow-x-auto gap-1 text-xs font-semibold">
        {[
          { key: 'all', label: 'ทั้งหมด' },
          { key: 'SENT', label: '1. ส่งแลปแล้ว' },
          { key: 'IN_PROGRESS', label: '2. กำลังทำ' },
          { key: 'RECEIVED', label: '3. ได้รับงานแล้ว' },
          { key: 'REVISION', label: '4. ส่งแก้ไข (Revision)' },
          { key: 'COMPLETED', label: '5. เสร็จสิ้น' },
          { key: 'FITTED', label: '6. ใส่ให้คนไข้แล้ว' },
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setStatusFilter(tab.key)}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all ${
              statusFilter === tab.key
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Lab Orders List Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs divide-y divide-slate-200">
            <thead className="bg-slate-50 font-bold text-slate-600">
              <tr>
                <th className="px-4 py-3">เลขที่ใบงาน</th>
                <th className="px-4 py-3">คนไข้</th>
                <th className="px-4 py-3">ทันตแพทย์</th>
                <th className="px-4 py-3">ประเภทงาน / ซี่ฟัน</th>
                <th className="px-4 py-3">บริษัทแลป</th>
                <th className="px-4 py-3">กำหนดรับ</th>
                <th className="px-4 py-3 text-right">ค่าแลป</th>
                <th className="px-4 py-3 text-center">สถานะ</th>
                <th className="px-4 py-3 text-right">การจัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    กำลังโหลดงานแลป...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400 italic">
                    ไม่มีรายการงานแลปตามสถานะที่เลือก
                  </td>
                </tr>
              ) : (
                orders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-indigo-700 whitespace-nowrap">
                      {o.orderNo}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-bold text-slate-900">
                        {o.patient.firstNameTh} {o.patient.lastNameTh}
                      </div>
                      <div className="text-[10px] text-slate-400">{o.patient.dn}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-slate-700">
                      {o.doctor.nickname || o.doctor.fullName}
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-semibold text-slate-900">{o.workType}</span>
                      {o.toothNumber && <span className="ml-1 font-mono text-indigo-800 font-bold">(ซี่ {o.toothNumber})</span>}
                      {o.shadeGuide && <span className="block text-[10px] text-slate-400">สีฟัน: {o.shadeGuide}</span>}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-slate-600">
                      {o.labCompanyName}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap font-medium text-slate-800">
                      {formatThaiDate(o.dueDate)}
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-bold whitespace-nowrap">
                      {formatCurrency(o.cost)}
                      <span className="block text-[10px] text-slate-400 font-normal">
                        ({o.deductionType === 'DOCTOR' ? 'หักแพทย์' : 'คลินิกจ่าย'})
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        o.status === 'SENT' ? 'bg-sky-100 text-sky-800' :
                        o.status === 'IN_PROGRESS' ? 'bg-indigo-100 text-indigo-800' :
                        o.status === 'RECEIVED' ? 'bg-teal-100 text-teal-800' :
                        o.status === 'REVISION' ? 'bg-rose-100 text-rose-800' :
                        'bg-emerald-100 text-emerald-800'
                      }`}>
                        {o.status === 'SENT' ? 'ส่งแล้ว' :
                         o.status === 'IN_PROGRESS' ? 'กำลังทำ' :
                         o.status === 'RECEIVED' ? 'ได้รับแล้ว' :
                         o.status === 'REVISION' ? 'ส่งแก้' :
                         o.status === 'FITTED' ? 'ใส่ให้คนไข้แล้ว' : 'เสร็จสิ้น'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap space-x-1.5">
                      {o.status === 'SENT' && (
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(o.id, 'IN_PROGRESS')}
                          className="px-2.5 py-1 text-[11px] bg-indigo-50 text-indigo-700 font-semibold rounded-lg hover:bg-indigo-100"
                        >
                          รับเข้าระบบ
                        </button>
                      )}
                      {(o.status === 'SENT' || o.status === 'IN_PROGRESS') && (
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(o.id, 'RECEIVED')}
                          className="px-2.5 py-1 text-[11px] bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 shadow-sm"
                        >
                          รับชิ้นงานแล้ว
                        </button>
                      )}
                      {o.status === 'RECEIVED' && (
                        <>
                          <button
                            type="button"
                            onClick={() => setRevisionOrder(o)}
                            className="px-2.5 py-1 text-[11px] bg-rose-50 text-rose-700 border border-rose-200 font-semibold rounded-lg hover:bg-rose-100"
                          >
                            ส่งแก้ (Rework)
                          </button>
                          <button
                            type="button"
                            onClick={() => handleUpdateStatus(o.id, 'FITTED')}
                            className="px-2.5 py-1 text-[11px] bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 shadow-sm"
                          >
                            ใส่ให้คนไข้แล้ว
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Lab Order Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-lg p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold text-slate-800">เปิดใบส่งแลปใหม่ (New Dental Lab Order)</h3>

            <form onSubmit={handleCreateOrder} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">เลือกคนไข้ *</label>
                {selectedPatient ? (
                  <div className="p-2.5 bg-indigo-50 rounded-xl border border-indigo-200 flex justify-between items-center">
                    <div>
                      <strong className="text-indigo-950 font-bold">{selectedPatient.firstNameTh} {selectedPatient.lastNameTh}</strong> ({selectedPatient.dn})
                    </div>
                    <button type="button" onClick={() => setSelectedPatient(null)} className="text-indigo-700 hover:underline">
                      เปลี่ยน
                    </button>
                  </div>
                ) : (
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="พิมพ์ชื่อ หรือเลข DN..."
                      value={patientSearch}
                      onChange={(e) => setPatientSearch(e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg"
                    />
                    {patients.length > 0 && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-20 max-h-40 overflow-y-auto">
                        {patients.map((p) => (
                          <div
                            key={p.id}
                            onClick={() => { setSelectedPatient(p); setPatients([]); }}
                            className="p-2 hover:bg-slate-50 cursor-pointer border-b last:border-0"
                          >
                            {p.firstNameTh} {p.lastNameTh} ({p.dn})
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">ทันตแพทย์ผู้ส่งงาน *</label>
                  <select
                    value={doctorId}
                    onChange={(e) => setDoctorId(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg bg-white"
                  >
                    {doctors.map((d) => (
                      <option key={d.id} value={d.id}>{d.fullName} ({d.nickname})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">ประเภทงานแลป *</label>
                  <select
                    value={workType}
                    onChange={(e) => setWorkType(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="CROWN">ครอบฟัน (Crown)</option>
                    <option value="BRIDGE">สะพานฟัน (Bridge)</option>
                    <option value="DENTURE">ฟันปลอม (Denture)</option>
                    <option value="RETAINER">รีเทนเนอร์ (Retainer)</option>
                    <option value="ALIGNER">แผ่นจัดฟันใส (Aligner)</option>
                    <option value="NIGHT_GUARD">เฝือกสบฟัน (Night Guard)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">ซี่ฟัน</label>
                  <input
                    type="text"
                    value={toothNumber}
                    onChange={(e) => setToothNumber(e.target.value)}
                    placeholder="เช่น 16, 21"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg font-mono text-center"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">เบอร์สีฟัน (Shade)</label>
                  <input
                    type="text"
                    value={shadeGuide}
                    onChange={(e) => setShadeGuide(e.target.value)}
                    placeholder="เช่น A2, A3"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-center"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">กำหนดรับงาน *</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg bg-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">บริษัทแลป *</label>
                  <input
                    type="text"
                    value={labCompanyName}
                    onChange={(e) => setLabCompanyName(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">ค่าใช้จ่ายแลป (บาท)</label>
                  <input
                    type="number"
                    value={cost}
                    onChange={(e) => setCost(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">การหักค่าใช้จ่าย</label>
                <select
                  value={deductionType}
                  onChange={(e) => setDeductionType(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="DOCTOR">หักออกจากค่า DF ของแพทย์ผู้ทำหัตถการ</option>
                  <option value="CLINIC">คลินิกเป็นผู้รับผิดชอบค่าใช้จ่าย</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">คำสั่งหรือรายละเอียดงานเพิ่มเติม</label>
                <textarea
                  rows={2}
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="เช่น ขอบ Gingival Margin ละเอียดตามพิมพ์ปาก..."
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-sm"
                >
                  {submitting ? 'กำลังบันทึก...' : 'บันทึกใบส่งแลป'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Revision Modal */}
      {revisionOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-800">
              ระบุเหตุผลในการส่งแลปแก้ไข: {revisionOrder.orderNo}
            </h3>
            <textarea
              rows={3}
              value={revisionNotes}
              onChange={(e) => setRevisionNotes(e.target.value)}
              placeholder="เช่น ขอบครอบฟันสูงไป สบฟันไม่พอดี ให้ลดขอบด้าน Lingual 0.5mm..."
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
            />
            <div className="flex justify-end gap-2 pt-2 border-t">
              <button
                type="button"
                onClick={() => setRevisionOrder(null)}
                className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg text-xs"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={handleRevisionSubmit}
                className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-lg shadow-sm text-xs"
              >
                ยืนยันส่งแก้ไขงาน
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
