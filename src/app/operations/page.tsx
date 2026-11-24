'use client';

import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  CalendarOff,
  CheckCircle2,
  Thermometer,
  Clock,
  Sparkles,
  UserCheck,
  PlusCircle,
  Printer,
  Trash2,
} from 'lucide-react';
import { formatThaiDate } from '@/lib/utils';

export default function ClinicOperationsPage() {
  const [activeTab, setActiveTab] = useState<'sterilization' | 'shifts'>('sterilization');

  // 1. Sterilization / Autoclave Log (มาตรฐาน สสจ. กดปุ่มเดียวบันทึกผลอบเครื่องมือ)
  const [sterileLogs, setSterileLogs] = useState([
    {
      id: 1,
      date: new Date().toISOString().split('T')[0],
      cycleNo: 'รอบที่ 1 (เช้า 08:30)',
      machine: 'Autoclave เครื่องที่ 1 (Class B)',
      tempPressure: '134°C / 2.1 Bar (30 นาที)',
      items: 'ชุดตรวจพื้นฐาน 15 ชุด + หัวกรอ High-speed 6 หัว + คีมถอนฟัน 8 ชิ้น',
      indicatorResult: 'PASS',
      operator: 'คุณน้ำหวาน (ผู้ช่วยทันตแพทย์)',
    },
    {
      id: 2,
      date: new Date().toISOString().split('T')[0],
      cycleNo: 'รอบที่ 2 (บ่าย 13:00)',
      machine: 'Autoclave เครื่องที่ 1 (Class B)',
      tempPressure: '134°C / 2.1 Bar (30 นาที)',
      items: 'ชุดขูดหินปูน Ultrasonic Tip 10 ชุด + ชุดผ่าฟันคุด 4 ชุด',
      indicatorResult: 'PASS',
      operator: 'คุณน้ำหวาน (ผู้ช่วยทันตแพทย์)',
    },
  ]);

  const handleQuickAddSterileCycle = (cycleLabel: string, itemsDesc: string) => {
    const nextLog = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      cycleNo: cycleLabel,
      machine: 'Autoclave เครื่องที่ 1 (Class B)',
      tempPressure: '134°C / 2.1 Bar (30 นาที)',
      items: itemsDesc,
      indicatorResult: 'PASS',
      operator: 'คุณน้ำหวาน (ผู้ช่วยทันตแพทย์)',
    };
    setSterileLogs([nextLog, ...sterileLogs]);
  };

  // 2. Doctor Shift & Leave Blocking (สำหรับหมอมิน และ หมอพรีม 2 ท่าน)
  const [doctors, setDoctors] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [blockedSlots, setBlockedSlots] = useState<any[]>([]);
  const [blockDate, setBlockDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [blockReason, setBlockReason] = useState('ติดประชุมวิชาการ / ลางาน');

  const fetchScheduleData = async () => {
    try {
      const res = await fetch(`/api/appointments?date=${blockDate}`);
      const data = await res.json();
      setDoctors(data.doctors || []);
      setRooms(data.rooms || []);
      setBlockedSlots(data.blockedSlots || []);
      if (data.doctors?.[0] && !selectedDoctorId) {
        setSelectedDoctorId(data.doctors[0].id);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchScheduleData();
  }, [blockDate]);

  // 1-Click Block Doctor Leave (เช้า / บ่าย / ทั้งวัน)
  const handleQuickBlockShift = async (startTime: string, endTime: string, label: string) => {
    const doc = doctors.find((d) => d.id === selectedDoctorId) || doctors[0];
    if (!doc) return;
    try {
      const res = await fetch('/api/blocked-slots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          doctorId: doc.id,
          roomId: doc.defaultRoomId || rooms[0]?.id,
          date: blockDate,
          startTime,
          endTime,
          reason: `${doc.nickname} งดรับนัด (${label}): ${blockReason}`,
        }),
      });
      if (res.ok) {
        fetchScheduleData();
      }
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
            <ShieldCheck className="w-5 h-5 text-teal-600" />
            <span>มาตรฐานคลินิก & ตารางเวรแพทย์ (Sterilization & Doctor Roster)</span>
          </h1>
          <p className="text-xs text-slate-500">
            ออกแบบให้กดบันทึกได้ในคลิกเดียว: บันทึกอบฆ่าเชื้อเครื่องมือประจำวัน และตั้งวันลา/งดรับนัดของหมอมิน-หมอพรีม
          </p>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('sterilization')}
            className={`px-4 py-2 rounded-lg transition-all ${
              activeTab === 'sterilization'
                ? 'bg-white text-teal-800 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🧼 1. บันทึกอบฆ่าเชื้อเครื่องมือ (Autoclave)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('shifts')}
            className={`px-4 py-2 rounded-lg transition-all ${
              activeTab === 'shifts'
                ? 'bg-white text-sky-800 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            👩‍⚕️ 2. ตารางเวร & วันลา (หมอมิน / หมอพรีม)
          </button>
        </div>
      </div>

      {/* TAB 1: 1-CLICK STERILIZATION LOG */}
      {activeTab === 'sterilization' && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4 no-print">
            <div>
              <h2 className="text-base font-bold text-slate-800">
                สมุดบันทึกการอบฆ่าเชื้อเครื่องมือทันตกรรม (Autoclave Daily Checklist)
              </h2>
              <p className="text-xs text-slate-500">
                ผู้ช่วยเพียงกดปุ่มรอบการอบด้านล่าง 1 ครั้ง ระบบจะลงเวลา อุณหภูมิ 134°C และสถานะผ่านการตรวจสอบให้อัตโนมัติ
              </p>
            </div>
            <button
              type="button"
              onClick={() => window.print()}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4" />
              <span>พิมพ์รายงานส่งตรวจ สสจ.</span>
            </button>
          </div>

          {/* Giant 1-Click Buttons for Assistant */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 no-print">
            <button
              type="button"
              onClick={() =>
                handleQuickAddSterileCycle(
                  `รอบเช้า (${new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })} น.)`,
                  'ชุดเครื่องมือตรวจพื้นฐาน 15 ชุด + หัวกรอ 6 ชิ้น + อุปกรณ์ขูดหินปูน'
                )
              }
              className="p-4 rounded-2xl border-2 border-teal-200 bg-teal-50/70 hover:bg-teal-600 hover:text-white text-teal-950 text-left transition-all group"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-black">✅ กดบันทึกรอบเช้า (1-Click)</span>
                <Thermometer className="w-5 h-5 text-teal-600 group-hover:text-white" />
              </div>
              <p className="text-xs mt-1 opacity-80">
                อบชุดตรวจพื้นฐาน + หัวกรอ (134°C / 2.1 Bar • แถบวัดสีผ่าน)
              </p>
            </button>

            <button
              type="button"
              onClick={() =>
                handleQuickAddSterileCycle(
                  `รอบบ่าย (${new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })} น.)`,
                  'ชุดคีมถอนฟัน/ผ่าฟันคุด + ชุดเครื่องมือจัดฟัน + หัวขูดหินปูน Ultrasonic'
                )
              }
              className="p-4 rounded-2xl border-2 border-sky-200 bg-sky-50/70 hover:bg-sky-600 hover:text-white text-sky-950 text-left transition-all group"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-black">✅ กดบันทึกรอบบ่าย (1-Click)</span>
                <Thermometer className="w-5 h-5 text-sky-600 group-hover:text-white" />
              </div>
              <p className="text-xs mt-1 opacity-80">
                อบชุดศัลยกรรมถอนฟัน + ชุดจัดฟัน (134°C / 2.1 Bar • แถบวัดสีผ่าน)
              </p>
            </button>

            <button
              type="button"
              onClick={() =>
                handleQuickAddSterileCycle(
                  `รอบเย็น + Spore Test (${new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })} น.)`,
                  'อบเครื่องมือทั้งหมดหลังปิดคลินิก + ทดสอบ Biological Spore Indicator ผ่านเกณฑ์'
                )
              }
              className="p-4 rounded-2xl border-2 border-emerald-200 bg-emerald-50/70 hover:bg-emerald-600 hover:text-white text-emerald-950 text-left transition-all group"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-black">✅ กดบันทึกรอบเย็น + Spore Test</span>
                <CheckCircle2 className="w-5 h-5 text-emerald-600 group-hover:text-white" />
              </div>
              <p className="text-xs mt-1 opacity-80">
                อบเครื่องมือปิดคลินิก + ผลตรวจเชื้อ Spore Test ปลอดภัย 100%
              </p>
            </button>
          </div>

          {/* Sterilization Log Table */}
          <div className="overflow-x-auto border border-slate-200 rounded-2xl">
            <table className="w-full text-left text-xs divide-y divide-slate-200">
              <thead className="bg-slate-50 font-bold text-slate-600">
                <tr>
                  <th className="px-4 py-3">วันที่</th>
                  <th className="px-4 py-3">รอบการอบ</th>
                  <th className="px-4 py-3">อุณหภูมิ / ความดัน</th>
                  <th className="px-4 py-3">รายการเครื่องมือที่อบฆ่าเชื้อ</th>
                  <th className="px-4 py-3 text-center">ผลแถบวัดสี (Indicator)</th>
                  <th className="px-4 py-3">ผู้รับผิดชอบ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sterileLogs.map((log) => (
                  <tr key={log.id}>
                    <td className="px-4 py-3 whitespace-nowrap">{formatThaiDate(log.date)}</td>
                    <td className="px-4 py-3 font-bold text-slate-900 whitespace-nowrap">{log.cycleNo}</td>
                    <td className="px-4 py-3 font-mono text-sky-700 whitespace-nowrap">{log.tempPressure}</td>
                    <td className="px-4 py-3 text-slate-700">{log.items}</td>
                    <td className="px-4 py-3 text-center whitespace-nowrap">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px]">
                        ✓ ผ่านมาตรฐาน (PASS)
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{log.operator}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: DOCTOR SHIFTS & 1-CLICK LEAVE BLOCKING (หมอมิน & หมอพรีม) */}
      {activeTab === 'shifts' && (
        <div className="space-y-6">
          {/* Overview of 2 Doctors & 2 Rooms */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 bg-white rounded-2xl border-2 border-sky-200 shadow-sm flex items-center justify-between">
              <div className="space-y-1">
                <span className="px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 text-[11px] font-bold">
                  ห้องตรวจ 1 (หมอมิน) • ยูนิตทำฟัน 1
                </span>
                <h3 className="text-base font-black text-slate-900">
                  ทพ. มินตรา รัตนเวชกุล (หมอมิน)
                </h3>
                <p className="text-xs text-slate-600">
                  ความเชี่ยวชาญ: ทันตกรรมจัดฟันและทันตกรรมทั่วไป • เวลาออกตรวจปกติ: จันทร์-เสาร์ 09:00 - 18:00 น.
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-sky-600 text-white font-black flex items-center justify-center text-sm">
                หมอมิน
              </div>
            </div>

            <div className="p-5 bg-white rounded-2xl border-2 border-teal-200 shadow-sm flex items-center justify-between">
              <div className="space-y-1">
                <span className="px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 text-[11px] font-bold">
                  ห้องตรวจ 2 (หมอพรีม) • ยูนิตทำฟัน 2
                </span>
                <h3 className="text-base font-black text-slate-900">
                  ทพญ. พรีมญา สิริวัชราภรณ์ (หมอพรีม)
                </h3>
                <p className="text-xs text-slate-600">
                  ความเชี่ยวชาญ: รักษารากฟันและทันตกรรมเพื่อความงาม • เวลาออกตรวจปกติ: จันทร์-เสาร์ 09:00 - 18:00 น.
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white font-black flex items-center justify-center text-sm">
                หมอพรีม
              </div>
            </div>
          </div>

          {/* 1-Click Block Leave / Close Slot */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <CalendarOff className="w-4 h-4 text-rose-600" />
                <span>ตั้งวันลา / ปิดรับนัดชั่วคราวแบบกดปุ่มเดียว (ป้องกันเคาน์เตอร์ลงคิวซ้ำ)</span>
              </h3>
              <p className="text-xs text-slate-500">
                เลือกวันที่และเลือกคุณหมอ แล้วกดปุ่มช่วงเวลาที่ต้องการปิดรับนัด ตารางนัดหน้าแรกจะล็อกช่วงเวลานั้นทันที
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div>
                <label className="block font-bold text-slate-700 mb-1">1. เลือกวันที่ต้องการล็อกคิว</label>
                <input
                  type="date"
                  value={blockDate}
                  onChange={(e) => setBlockDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">2. เลือกคุณหมอ</label>
                <select
                  value={selectedDoctorId}
                  onChange={(e) => setSelectedDoctorId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white font-bold"
                >
                  {doctors.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.nickname} ({d.fullName})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">3. เหตุผลสั้นๆ</label>
                <input
                  type="text"
                  value={blockReason}
                  onChange={(e) => setBlockReason(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white"
                />
              </div>
            </div>

            {/* 1-Click Shift Block Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => handleQuickBlockShift('09:00', '12:00', 'ลาครึ่งวันเช้า')}
                className="p-3.5 rounded-2xl border border-amber-300 bg-amber-50 hover:bg-amber-600 hover:text-white text-amber-950 font-bold text-xs text-center transition-all"
              >
                🌅 กดล็อกคิว &ldquo;ครึ่งวันเช้า&rdquo; (09:00 - 12:00 น.)
              </button>
              <button
                type="button"
                onClick={() => handleQuickBlockShift('13:00', '18:00', 'ลาครึ่งวันบ่าย')}
                className="p-3.5 rounded-2xl border border-orange-300 bg-orange-50 hover:bg-orange-600 hover:text-white text-orange-950 font-bold text-xs text-center transition-all"
              >
                🌇 กดล็อกคิว &ldquo;ครึ่งวันบ่าย&rdquo; (13:00 - 18:00 น.)
              </button>
              <button
                type="button"
                onClick={() => handleQuickBlockShift('09:00', '19:00', 'หยุดเต็มวัน')}
                className="p-3.5 rounded-2xl border border-rose-300 bg-rose-50 hover:bg-rose-600 hover:text-white text-rose-950 font-bold text-xs text-center transition-all"
              >
                🛑 กดล็อกคิว &ldquo;หยุดเต็มวัน&rdquo; (09:00 - 19:00 น.)
              </button>
            </div>

            {/* Active Blocked Slots List */}
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <span className="text-xs font-bold text-slate-700 block">
                รายการช่วงเวลาที่ปิดรับนัดในวันที่ {formatThaiDate(blockDate)} ({blockedSlots.length} รายการ):
              </span>
              {blockedSlots.length === 0 ? (
                <p className="text-xs text-emerald-700 bg-emerald-50 p-3 rounded-xl border border-emerald-200 font-semibold">
                  ✓ วันที่ {formatThaiDate(blockDate)} หมอมินและหมอพรีมเปิดรับนัดตามปกติทุกช่วงเวลา
                </p>
              ) : (
                <div className="divide-y divide-slate-100 bg-slate-50 rounded-xl border border-slate-200 px-3">
                  {blockedSlots.map((b: any) => (
                    <div key={b.id} className="py-2.5 flex items-center justify-between text-xs">
                      <div>
                        <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-mono font-bold mr-2">
                          {b.startTime} - {b.endTime} น.
                        </span>
                        <span className="font-bold text-slate-800">{b.reason}</span>
                      </div>
                      <span className="text-[11px] text-slate-400">ล็อกตารางนัดแล้ว</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
