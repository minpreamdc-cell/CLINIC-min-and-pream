'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Clock,
  Calendar,
  UserPlus,
  PlusCircle,
  Search,
  UserCheck,
  CheckCircle,
  Stethoscope,
  CreditCard,
  AlertCircle,
  Filter,
  ChevronRight,
  ShieldAlert,
  Volume2,
  Tv,
} from 'lucide-react';
import { formatThaiDate, formatCurrency } from '@/lib/utils';
import NewAppointmentModal from '@/components/NewAppointmentModal';
import WalkInModal from '@/components/WalkInModal';
import NewPatientModal from '@/components/NewPatientModal';

export default function TodayQueueCalendarPage() {
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [viewMode, setViewMode] = useState<'ROOM' | 'DOCTOR'>('ROOM');
  const [loading, setLoading] = useState(true);

  const [appointments, setAppointments] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [appointmentTypes, setAppointmentTypes] = useState<any[]>([]);
  const [blockedSlots, setBlockedSlots] = useState<any[]>([]);

  const [queueVisits, setQueueVisits] = useState<any[]>([]);
  const [queueStats, setQueueStats] = useState<any>({
    total: 0,
    waitingExam: 0,
    inExam: 0,
    waitingPayment: 0,
    completed: 0,
  });

  // Modals state
  const [isAppModalOpen, setIsAppModalOpen] = useState(false);
  const [isWalkInModalOpen, setIsWalkInModalOpen] = useState(false);
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);

  // Selected slot for pre-filling appointment modal
  const [modalPreFill, setModalPreFill] = useState<{
    date?: string;
    time?: string;
    doctorId?: string;
    roomId?: string;
  }>({});

  const fetchData = async () => {
    setLoading(true);
    try {
      const [appRes, queueRes] = await Promise.all([
        fetch(`/api/appointments?date=${selectedDate}`),
        fetch(`/api/queue?date=${selectedDate}`),
      ]);

      const appData = await appRes.json();
      const queueData = await queueRes.json();

      setAppointments(appData.appointments || []);
      setDoctors(appData.doctors || []);
      setRooms(appData.rooms || []);
      setAppointmentTypes(appData.appointmentTypes || []);
      setBlockedSlots(appData.blockedSlots || []);

      setQueueVisits(queueData.visits || []);
      if (queueData.stats) setQueueStats(queueData.stats);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 15000); // 15s live sync
    return () => clearInterval(interval);
  }, [selectedDate]);

  const handleSlotClick = (timeStr: string, columnId: string) => {
    setModalPreFill({
      date: selectedDate,
      time: timeStr,
      roomId: viewMode === 'ROOM' ? columnId : undefined,
      doctorId: viewMode === 'DOCTOR' ? columnId : undefined,
    });
    setIsAppModalOpen(true);
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
      fetchData();
    } catch (err: any) {
      alert(err.message || 'Check-in failed');
    }
  };

  const handleUpdateVisitStatus = async (visitId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/queue/${visitId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  // Trigger Thai voice call & broadcast to TV Queue Screen
  const handleCallQueueVoice = (v: any) => {
    const patientName = `${v.patient.firstNameTh} ${v.patient.lastNameTh}`;
    const roomName = v.room.name.split('(')[0].trim();
    const doctorName = v.doctor.nickname || v.doctor.fullName;

    try {
      localStorage.setItem(
        'clinic_tv_queue_call',
        JSON.stringify({
          queueNumber: v.queueNumber,
          patientName,
          roomName,
          doctorName,
          timestamp: Date.now(),
        })
      );
    } catch {}

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(
          `ขอเชิญหมายเลขคิวที่ ${v.queueNumber}, คุณ ${patientName}, ที่ ${roomName} ค่ะ`
        );
        utterance.lang = 'th-TH';
        utterance.rate = 0.92;
        window.speechSynthesis.speak(utterance);
      } catch {}
    }
  };

  // Generate 30-min time slots from 09:00 to 18:30
  const timeSlots: string[] = [];
  for (let hour = 9; hour <= 18; hour++) {
    timeSlots.push(`${String(hour).padStart(2, '0')}:00`);
    timeSlots.push(`${String(hour).padStart(2, '0')}:30`);
  }

  const columns = viewMode === 'ROOM' ? rooms : doctors;

  return (
    <div className="space-y-6">
      {/* Top Banner: Date Selector & Quick Action Buttons */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">เลือกวันที่:</span>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-1.5 text-xs font-semibold border border-slate-300 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-sky-500 focus:outline-none text-slate-800"
            />
          </div>
          <button
            type="button"
            onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
            className="px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors"
          >
            วันนี้
          </button>
          <span className="text-xs font-medium text-sky-800 bg-sky-50 px-2.5 py-1 rounded-lg border border-sky-200">
            {formatThaiDate(selectedDate, true)}
          </span>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/tv-queue"
            target="_blank"
            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition-colors flex items-center gap-1.5"
          >
            <Tv className="w-4 h-4 text-indigo-600" />
            <span>เปิดจอ TV เรียกคิว</span>
          </Link>
          <Link
            href="/patients"
            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center gap-1.5"
          >
            <Search className="w-4 h-4 text-slate-500" />
            <span>ค้นหาคนไข้</span>
          </Link>
          <button
            type="button"
            onClick={() => setIsPatientModalOpen(true)}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 transition-colors flex items-center gap-1.5"
          >
            <UserPlus className="w-4 h-4 text-sky-600" />
            <span>+ คนไข้ใหม่</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setModalPreFill({ date: selectedDate, time: '10:00' });
              setIsAppModalOpen(true);
            }}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 shadow-md shadow-sky-600/20 transition-all flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ เพิ่มนัดหมาย</span>
          </button>
          <button
            type="button"
            onClick={() => setIsWalkInModalOpen(true)}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 shadow-md shadow-teal-600/20 transition-all flex items-center gap-1.5"
          >
            <UserCheck className="w-4 h-4" />
            <span>+ รับ Walk-in</span>
          </button>
        </div>
      </div>

      {/* Real-time Queue Board: 4 Stage Panels */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* 1. Waiting for Exam (รอตรวจ) */}
        <div className="bg-white rounded-2xl border border-amber-200 shadow-sm overflow-hidden flex flex-col">
          <div className="px-4 py-3 bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
              <h3 className="text-xs font-bold text-amber-900">1. รอตรวจ (Waiting)</h3>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-amber-500 text-white text-[11px] font-bold">
              {queueStats.waitingExam}
            </span>
          </div>
          <div className="p-3 divide-y divide-slate-100 flex-1 overflow-y-auto max-h-72">
            {queueVisits.filter((v) => v.status === 'WAITING_EXAM').length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-400 italic">
                ไม่มีคนไข้รอตรวจ
              </div>
            ) : (
              queueVisits
                .filter((v) => v.status === 'WAITING_EXAM')
                .map((v) => (
                  <div key={v.id} className="py-2.5 first:pt-0 last:pb-0 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs">
                          {v.queueNumber}
                        </span>
                        <div>
                          <p className="text-xs font-bold text-slate-800">
                            {v.patient.firstNameTh} {v.patient.lastNameTh}
                          </p>
                          <p className="text-[10px] text-slate-400">DN: {v.patient.dn}</p>
                        </div>
                      </div>
                      <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                        {v.room.name.split(' ')[0]}
                      </span>
                    </div>

                    {v.patient.drugAllergies && (
                      <div className="text-[10px] text-rose-700 bg-rose-50 px-2 py-0.5 rounded flex items-center gap-1 font-semibold">
                        <ShieldAlert className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">แพ้: {v.patient.drugAllergies}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[11px] text-slate-500">
                        {v.doctor.nickname || v.doctor.fullName}
                      </span>
                      <div className="flex gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleCallQueueVoice(v)}
                          title="กดเรียกเสียงขานคิวและแสดงบนจอ TV"
                          className="px-2 py-1 text-[11px] font-semibold text-amber-800 bg-amber-100 hover:bg-amber-200 rounded-lg transition-all flex items-center gap-1"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>เรียกคิว</span>
                        </button>
                        <Link
                          href={`/emr/${v.id}`}
                          onClick={() => {
                            handleCallQueueVoice(v);
                            handleUpdateVisitStatus(v.id, 'IN_EXAM');
                          }}
                          className="px-2.5 py-1 text-[11px] font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-sm transition-all"
                        >
                          เข้าตรวจ EMR
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>

        {/* 2. In Exam (กำลังตรวจ) */}
        <div className="bg-white rounded-2xl border border-sky-200 shadow-sm overflow-hidden flex flex-col">
          <div className="px-4 py-3 bg-gradient-to-r from-sky-50 to-blue-50 border-b border-sky-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500 animate-pulse"></span>
              <h3 className="text-xs font-bold text-sky-900">2. กำลังตรวจ (In Exam)</h3>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-sky-500 text-white text-[11px] font-bold">
              {queueStats.inExam}
            </span>
          </div>
          <div className="p-3 divide-y divide-slate-100 flex-1 overflow-y-auto max-h-72">
            {queueVisits.filter((v) => v.status === 'IN_EXAM').length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-400 italic">
                ไม่มีคนไข้อยู่ในห้องตรวจ
              </div>
            ) : (
              queueVisits
                .filter((v) => v.status === 'IN_EXAM')
                .map((v) => (
                  <div key={v.id} className="py-2.5 first:pt-0 last:pb-0 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-sky-100 text-sky-800 flex items-center justify-center font-bold text-xs">
                          {v.queueNumber}
                        </span>
                        <div>
                          <p className="text-xs font-bold text-slate-800">
                            {v.patient.firstNameTh} {v.patient.lastNameTh}
                          </p>
                          <p className="text-[10px] text-slate-400">ห้อง: {v.room.name}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[11px] text-slate-500">
                        {v.doctor.nickname || v.doctor.fullName}
                      </span>
                      <div className="flex gap-1.5">
                        <Link
                          href={`/emr/${v.id}`}
                          className="px-2.5 py-1 text-[11px] font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-lg"
                        >
                          ดูเวชระเบียน
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleUpdateVisitStatus(v.id, 'WAITING_PAYMENT')}
                          className="px-2.5 py-1 text-[11px] font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-sm"
                        >
                          ส่งคิดเงิน
                        </button>
                      </div>
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>

        {/* 3. Waiting for Payment (รอชำระเงิน) */}
        <div className="bg-white rounded-2xl border border-emerald-200 shadow-sm overflow-hidden flex flex-col">
          <div className="px-4 py-3 bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <h3 className="text-xs font-bold text-emerald-900">3. รอชำระเงิน (Billing)</h3>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[11px] font-bold">
              {queueStats.waitingPayment}
            </span>
          </div>
          <div className="p-3 divide-y divide-slate-100 flex-1 overflow-y-auto max-h-72">
            {queueVisits.filter((v) => v.status === 'WAITING_PAYMENT').length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-400 italic">
                ไม่มีคนไข้รอชำระเงิน
              </div>
            ) : (
              queueVisits
                .filter((v) => v.status === 'WAITING_PAYMENT')
                .map((v) => {
                  const invoice = v.invoices && v.invoices[0];
                  return (
                    <div key={v.id} className="py-2.5 first:pt-0 last:pb-0 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                            {v.queueNumber}
                          </span>
                          <div>
                            <p className="text-xs font-bold text-slate-800">
                              {v.patient.firstNameTh} {v.patient.lastNameTh}
                            </p>
                            <p className="text-[10px] text-slate-400">
                              {invoice ? `บิล: ${invoice.invoiceNo}` : 'รายการรักษาพร้อมคิดเงิน'}
                            </p>
                          </div>
                        </div>
                        {invoice && (
                          <span className="text-xs font-bold text-emerald-700">
                            {formatCurrency(invoice.balanceDue)}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-end pt-1">
                        <Link
                          href={`/billing?visitId=${v.id}`}
                          className="px-3 py-1 text-[11px] font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm flex items-center gap-1"
                        >
                          <CreditCard className="w-3.5 h-3.5" />
                          <span>เปิดบิล / รับชำระ</span>
                        </Link>
                      </div>
                    </div>
                  );
                })
            )}
          </div>
        </div>

        {/* 4. Completed (เสร็จสิ้น) */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="px-4 py-3 bg-slate-100 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-3.5 h-3.5 text-slate-500" />
              <h3 className="text-xs font-bold text-slate-700">4. เสร็จสิ้น (Done)</h3>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-slate-600 text-white text-[11px] font-bold">
              {queueStats.completed}
            </span>
          </div>
          <div className="p-3 divide-y divide-slate-100 flex-1 overflow-y-auto max-h-72">
            {queueVisits.filter((v) => v.status === 'COMPLETED').length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-400 italic">
                ยังไม่มีรายการเสร็จสิ้นวันนี้
              </div>
            ) : (
              queueVisits
                .filter((v) => v.status === 'COMPLETED')
                .map((v) => (
                  <div key={v.id} className="py-2 first:pt-0 last:pb-0 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-semibold text-slate-800">
                        {v.patient.firstNameTh} {v.patient.lastNameTh}
                      </p>
                      <p className="text-[10px] text-slate-400">คิวที่ {v.queueNumber}</p>
                    </div>
                    <Link
                      href={`/patients/${v.patientId}`}
                      className="text-[11px] text-sky-600 hover:underline"
                    >
                      ดูแฟ้มประวัติ
                    </Link>
                  </div>
                ))
            )}
          </div>
        </div>
      </div>

      {/* Main Calendar View: Switch columns between Room & Doctor */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-sky-600" />
              <span>ตารางนัดหมายและตารางออกตรวจ</span>
            </h2>
            <p className="text-xs text-slate-500">
              คลิกช่องเวลาว่างเพื่อเพิ่มนัดหมายทันที | สีประจำแพทย์และห้องตรวจ
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">สลับมุมมอง:</span>
            <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => setViewMode('ROOM')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  viewMode === 'ROOM'
                    ? 'bg-white text-sky-800 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                แยกตามห้องตรวจ (Rooms)
              </button>
              <button
                type="button"
                onClick={() => setViewMode('DOCTOR')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  viewMode === 'DOCTOR'
                    ? 'bg-white text-sky-800 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                แยกตามทันตแพทย์ (Dentists)
              </button>
            </div>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="overflow-x-auto">
          <div className="min-w-[750px] border border-slate-200 rounded-xl overflow-hidden">
            {/* Header Columns */}
            <div
              className="grid bg-slate-50 border-b border-slate-200 divide-x divide-slate-200 text-xs font-bold text-slate-700 text-center"
              style={{
                gridTemplateColumns: `80px repeat(${columns.length}, minmax(180px, 1fr))`,
              }}
            >
              <div className="p-3 bg-slate-100">เวลา</div>
              {columns.map((col: any) => (
                <div key={col.id} className="p-3 flex items-center justify-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: col.colorCode || '#0284c7' }}
                  ></span>
                  <span>{col.name || col.fullName}</span>
                  {col.chairNumber && (
                    <span className="text-[10px] text-slate-400 font-normal">
                      ({col.chairNumber})
                    </span>
                  )}
                  {col.specialty && (
                    <span className="text-[10px] text-sky-600 font-normal">
                      ({col.nickname})
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Time Slot Rows */}
            <div className="divide-y divide-slate-100">
              {timeSlots.map((timeStr) => (
                <div
                  key={timeStr}
                  className="grid divide-x divide-slate-100 hover:bg-slate-50/50 transition-colors"
                  style={{
                    gridTemplateColumns: `80px repeat(${columns.length}, minmax(180px, 1fr))`,
                  }}
                >
                  {/* Time label */}
                  <div className="p-2 text-center text-xs font-mono font-medium text-slate-500 bg-slate-50/80">
                    {timeStr}
                  </div>

                  {/* Columns for this time slot */}
                  {columns.map((col: any) => {
                    // Find active appointment matching this column and time slot
                    const app = appointments.find((a) => {
                      const matchesCol =
                        viewMode === 'ROOM' ? a.roomId === col.id : a.doctorId === col.id;
                      return matchesCol && a.startTime <= timeStr && a.endTime > timeStr;
                    });

                    // Check if slot is blocked
                    const isBlocked = blockedSlots.find((b) => {
                      const matchesCol =
                        viewMode === 'ROOM' ? b.roomId === col.id : b.doctorId === col.id;
                      return matchesCol && b.startTime <= timeStr && b.endTime > timeStr;
                    });

                    if (app) {
                      const isStartOfApp = app.startTime === timeStr;
                      return (
                        <div
                          key={col.id}
                          className="p-1.5 min-h-[46px] bg-sky-50/80 border-l-4 border-sky-600"
                        >
                          {isStartOfApp && (
                            <div className="flex flex-col text-xs leading-tight">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-sky-950">
                                  {app.patient.firstNameTh} {app.patient.lastNameTh}
                                </span>
                                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-sky-100 text-sky-800">
                                  {app.startTime} - {app.endTime}
                                </span>
                              </div>
                              <span className="text-[11px] text-sky-700">
                                {app.typeName || 'นัดตรวจทั่วไป'} ({app.doctor.nickname})
                              </span>
                              {app.status === 'BOOKED' && !app.visit && (
                                <div className="mt-1">
                                  <button
                                    type="button"
                                    onClick={() => handleCheckIn(app.id)}
                                    className="px-2 py-0.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[10px] font-bold"
                                  >
                                    เช็กอินคิว
                                  </button>
                                </div>
                              )}
                              {app.visit && (
                                <span className="text-[10px] font-bold text-emerald-700 mt-0.5">
                                  ✓ เช็กอินแล้ว (คิวที่ {app.visit.queueNumber})
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    }

                    if (isBlocked) {
                      return (
                        <div
                          key={col.id}
                          className="p-1.5 min-h-[46px] bg-slate-100 text-slate-400 text-xs flex items-center justify-center italic"
                        >
                          ปิดรับนัด: {isBlocked.reason}
                        </div>
                      );
                    }

                    // Empty slot -> clickable
                    return (
                      <div
                        key={col.id}
                        onClick={() => handleSlotClick(timeStr, col.id)}
                        className="p-1.5 min-h-[46px] cursor-pointer group flex items-center justify-center"
                      >
                        <span className="hidden group-hover:inline-block text-[11px] font-medium text-sky-600 bg-sky-50 px-2 py-0.5 rounded-lg border border-sky-200">
                          + จองเวลานี้
                        </span>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <NewAppointmentModal
        isOpen={isAppModalOpen}
        onClose={() => setIsAppModalOpen(false)}
        onSuccess={fetchData}
        initialDate={modalPreFill.date}
        initialTime={modalPreFill.time}
        initialDoctorId={modalPreFill.doctorId}
        initialRoomId={modalPreFill.roomId}
        doctors={doctors}
        rooms={rooms}
        appointmentTypes={appointmentTypes}
      />

      <WalkInModal
        isOpen={isWalkInModalOpen}
        onClose={() => setIsWalkInModalOpen(false)}
        onSuccess={fetchData}
        doctors={doctors}
        rooms={rooms}
      />

      <NewPatientModal
        isOpen={isPatientModalOpen}
        onClose={() => setIsPatientModalOpen(false)}
        onSuccess={() => {
          fetchData();
        }}
        doctors={doctors}
      />
    </div>
  );
}
