'use client';

import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  UserCheck,
  AlertCircle,
  Repeat,
  PlusCircle,
} from 'lucide-react';
import { formatThaiDate } from '@/lib/utils';
import NewAppointmentModal from '@/components/NewAppointmentModal';

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [appointmentTypes, setAppointmentTypes] = useState<any[]>([]);

  const [date, setDate] = useState<string>('');
  const [doctorId, setDoctorId] = useState<string>('all');
  const [status, setStatus] = useState<string>('all');
  const [search, setSearch] = useState<string>('');
  const [loading, setLoading] = useState(true);

  const [isNewModalOpen, setIsNewModalOpen] = useState(false);

  // Reschedule state
  const [rescheduleTarget, setRescheduleTarget] = useState<any | null>(null);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [rescheduleError, setRescheduleError] = useState<string | null>(null);

  // Cancel state
  const [cancelTarget, setCancelTarget] = useState<any | null>(null);
  const [cancelReason, setCancelReason] = useState('');

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (date) query.set('date', date);
      if (doctorId && doctorId !== 'all') query.set('doctorId', doctorId);
      if (status && status !== 'all') query.set('status', status);
      if (search) query.set('search', search);

      const res = await fetch(`/api/appointments?${query.toString()}`);
      const data = await res.json();
      setAppointments(data.appointments || []);
      setDoctors(data.doctors || []);
      setRooms(data.rooms || []);
      setAppointmentTypes(data.appointmentTypes || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [date, doctorId, status, search]);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) fetchAppointments();
    } catch (e) {
      console.error(e);
    }
  };

  const handleCancelSubmit = async () => {
    if (!cancelTarget || !cancelReason) return;
    try {
      const res = await fetch(`/api/appointments/${cancelTarget.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'CANCELLED',
          cancelReason,
        }),
      });
      if (res.ok) {
        setCancelTarget(null);
        setCancelReason('');
        fetchAppointments();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleRescheduleSubmit = async () => {
    if (!rescheduleTarget || !newDate || !newTime) return;
    setRescheduleError(null);
    try {
      const res = await fetch(`/api/appointments/${rescheduleTarget.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'RESCHEDULE',
          date: newDate,
          startTime: newTime,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'ไม่สามารถเลื่อนนัดได้');
      }
      setRescheduleTarget(null);
      fetchAppointments();
    } catch (err: any) {
      setRescheduleError(err.message);
    }
  };

  const handleCheckIn = async (appointmentId: string) => {
    try {
      const res = await fetch('/api/queue/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appointmentId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      fetchAppointments();
    } catch (err: any) {
      console.error(err.message || 'Check-in failed');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Filter Controls */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-sky-600" />
              <span>รายการนัดหมายคนไข้</span>
            </h1>
            <p className="text-xs text-slate-500">
              ค้นหา กรอง และจัดการสถานะนัดหมาย (ยืนยัน, เลื่อนนัด, ยกเลิก, เช็กอิน)
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsNewModalOpen(true)}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 shadow-md shadow-sky-600/20 transition-all flex items-center gap-1.5 self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ เพิ่มนัดหมายใหม่</span>
          </button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-100">
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              ค้นหาชื่อ, DN หรือเบอร์โทร
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="พิมพ์เพื่อค้นหา..."
                className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">วันที่นัด</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-xl bg-white"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">ทันตแพทย์</label>
            <select
              value={doctorId}
              onChange={(e) => setDoctorId(e.target.value)}
              className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-xl bg-white"
            >
              <option value="all">ทั้งหมด</option>
              {doctors.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.fullName} ({d.nickname})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">สถานะนัดหมาย</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-xl bg-white"
            >
              <option value="all">ทุกสถานะ</option>
              <option value="BOOKED">นัดแล้ว (จองแล้ว)</option>
              <option value="CONFIRMED">ยืนยันแล้ว</option>
              <option value="NO_SHOW">ไม่มาตามนัด</option>
              <option value="CANCELLED">ยกเลิก</option>
            </select>
          </div>
        </div>
      </div>

      {/* Appointments Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs divide-y divide-slate-200">
            <thead className="bg-slate-50 font-bold text-slate-600">
              <tr>
                <th className="px-4 py-3">วันและเวลา</th>
                <th className="px-4 py-3">คนไข้</th>
                <th className="px-4 py-3">ทันตแพทย์</th>
                <th className="px-4 py-3">ห้องตรวจ</th>
                <th className="px-4 py-3">ประเภทนัด / อาการ</th>
                <th className="px-4 py-3 text-center">สถานะนัด</th>
                <th className="px-4 py-3 text-center">การมารักษา</th>
                <th className="px-4 py-3 text-right">การจัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    กำลังโหลดข้อมูลนัดหมาย...
                  </td>
                </tr>
              ) : appointments.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400 italic">
                    ไม่พบรายการนัดหมายตามเงื่อนไขที่เลือก
                  </td>
                </tr>
              ) : (
                appointments.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap font-medium text-slate-800">
                      <div>{formatThaiDate(app.date)}</div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        {app.startTime} - {app.endTime} น.
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-bold text-slate-900">
                        {app.patient.firstNameTh} {app.patient.lastNameTh}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {app.patient.dn} | โทร: {app.patient.phone}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="font-medium text-slate-800">
                        {app.doctor.nickname || app.doctor.fullName}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-slate-600">
                      {app.room.name.split(' ')[0]}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-sky-800">
                        {app.typeName || 'ตรวจทั่วไป'}
                      </div>
                      {app.notes && (
                        <div className="text-[10px] text-slate-500 truncate max-w-xs">
                          {app.notes}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          app.status === 'CONFIRMED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : app.status === 'BOOKED'
                            ? 'bg-sky-100 text-sky-800'
                            : app.status === 'NO_SHOW'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {app.status === 'CONFIRMED'
                          ? 'ยืนยันแล้ว'
                          : app.status === 'BOOKED'
                          ? 'นัดแล้ว'
                          : app.status === 'NO_SHOW'
                          ? 'ไม่มาตามนัด'
                          : 'ยกเลิก'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center whitespace-nowrap">
                      {app.visit ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800">
                          คิวที่ {app.visit.queueNumber} ({app.visit.status === 'WAITING_EXAM' ? 'รอตรวจ' : app.visit.status === 'IN_EXAM' ? 'กำลังตรวจ' : app.visit.status === 'WAITING_PAYMENT' ? 'รอชำระ' : 'เสร็จสิ้น'})
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[10px]">ยังไม่เช็กอิน</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap space-x-1.5">
                      {!app.visit && app.status !== 'CANCELLED' && (
                        <button
                          type="button"
                          onClick={() => handleCheckIn(app.id)}
                          className="px-2.5 py-1 text-[11px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-sm"
                        >
                          เช็กอิน
                        </button>
                      )}
                      {app.status === 'BOOKED' && (
                        <button
                          type="button"
                          onClick={() => handleStatusChange(app.id, 'CONFIRMED')}
                          className="px-2 py-1 text-[11px] font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg"
                        >
                          ยืนยัน
                        </button>
                      )}
                      {app.status !== 'CANCELLED' && (
                        <button
                          type="button"
                          onClick={() => {
                            setRescheduleTarget(app);
                            setNewDate(app.date);
                            setNewTime(app.startTime);
                          }}
                          className="px-2 py-1 text-[11px] font-semibold bg-sky-50 hover:bg-sky-100 text-sky-700 rounded-lg"
                        >
                          เลื่อนนัด
                        </button>
                      )}
                      {app.status !== 'CANCELLED' && (
                        <button
                          type="button"
                          onClick={() => setCancelTarget(app)}
                          className="px-2 py-1 text-[11px] font-semibold bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg"
                        >
                          ยกเลิก
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reschedule Modal */}
      {rescheduleTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md p-5 space-y-4">
            <h3 className="text-sm font-bold text-slate-800">
              เลื่อนนัดหมาย: {rescheduleTarget.patient.firstNameTh} {rescheduleTarget.patient.lastNameTh}
            </h3>

            {rescheduleError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{rescheduleError}</span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">วันที่ใหม่</label>
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">เวลาใหม่ (24 ชม.)</label>
                <select
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs font-mono font-bold border border-slate-300 rounded-lg bg-white"
                >
                  {[
                    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
                    '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
                    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
                    '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00',
                  ].map((t) => (
                    <option key={t} value={t}>
                      {t} น.
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setRescheduleTarget(null)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                ปิด
              </button>
              <button
                type="button"
                onClick={handleRescheduleSubmit}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-sm"
              >
                บันทึกการเลื่อนนัด
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Modal */}
      {cancelTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md p-5 space-y-4">
            <h3 className="text-sm font-bold text-slate-800">
              ระบุเหตุผลในการยกเลิกนัด: {cancelTarget.patient.firstNameTh} {cancelTarget.patient.lastNameTh}
            </h3>
            <textarea
              rows={3}
              placeholder="เช่น คนไข้ติดธุระด่วน ขอเลื่อนไปสัปดาห์หน้า..."
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
            />
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setCancelTarget(null)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={handleCancelSubmit}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm"
              >
                ยืนยันยกเลิกนัด
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Appointment Modal */}
      <NewAppointmentModal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        onSuccess={fetchAppointments}
        doctors={doctors}
        rooms={rooms}
        appointmentTypes={appointmentTypes}
      />
    </div>
  );
}
