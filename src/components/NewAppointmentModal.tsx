'use client';

import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, User, AlertCircle, CheckCircle2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialDate?: string;
  initialTime?: string;
  initialDoctorId?: string;
  initialRoomId?: string;
  doctors: any[];
  rooms: any[];
  appointmentTypes: any[];
}

export default function NewAppointmentModal({
  isOpen,
  onClose,
  onSuccess,
  initialDate,
  initialTime,
  initialDoctorId,
  initialRoomId,
  doctors,
  rooms,
  appointmentTypes,
}: Props) {
  const [patients, setPatients] = useState<any[]>([]);
  const [patientSearch, setPatientSearch] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<any | null>(null);

  const [date, setDate] = useState(initialDate || new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState(initialTime || '09:30');
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [doctorId, setDoctorId] = useState(initialDoctorId || (doctors[0]?.id || ''));
  const [roomId, setRoomId] = useState(initialRoomId || (rooms[0]?.id || ''));
  const [typeId, setTypeId] = useState('');
  const [notes, setNotes] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (initialDate) setDate(initialDate);
    if (initialTime) setStartTime(initialTime);
    if (initialDoctorId) setDoctorId(initialDoctorId);
    if (initialRoomId) setRoomId(initialRoomId);
  }, [initialDate, initialTime, initialDoctorId, initialRoomId]);

  useEffect(() => {
    if (patientSearch.length >= 2) {
      fetch(`/api/patients?search=${encodeURIComponent(patientSearch)}&limit=5`)
        .then((res) => res.json())
        .then((data) => setPatients(data.patients || []))
        .catch(() => {});
    } else {
      setPatients([]);
    }
  }, [patientSearch]);

  const handleTypeChange = (selectedTypeId: string) => {
    setTypeId(selectedTypeId);
    const foundType = appointmentTypes.find((t) => t.id === selectedTypeId);
    if (foundType?.defaultDurationMinutes) {
      setDurationMinutes(foundType.defaultDurationMinutes);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) {
      setErrorMsg('กรุณาเลือกคนไข้');
      return;
    }
    if (!doctorId || !roomId || !date || !startTime) {
      setErrorMsg('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId: selectedPatient.id,
          doctorId,
          roomId,
          date,
          startTime,
          durationMinutes,
          typeId: typeId || null,
          notes,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'เกิดข้อผิดพลาดในการบันทึกนัดหมาย');
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">เพิ่มนัดหมายใหม่</h3>
              <p className="text-xs text-slate-500">จองตารางเวลาพบแพทย์หรือห้องตรวจ</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5 animate-shake">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-rose-600" />
              <div>
                <p className="font-semibold">ไม่สามารถจองเวลานี้ได้</p>
                <p>{errorMsg}</p>
              </div>
            </div>
          )}

          {/* Patient Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              ค้นหาและเลือกคนไข้ *
            </label>
            {selectedPatient ? (
              <div className="flex items-center justify-between p-3 rounded-xl bg-sky-50 border border-sky-200">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-sky-600 text-white flex items-center justify-center text-xs font-bold">
                    DN
                  </div>
                  <div>
                    <p className="text-xs font-bold text-sky-900">
                      {selectedPatient.firstNameTh} {selectedPatient.lastNameTh} ({selectedPatient.dn})
                    </p>
                    <p className="text-[11px] text-sky-700">เบอร์โทร: {selectedPatient.phone}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedPatient(null)}
                  className="text-xs text-sky-700 hover:underline font-medium"
                >
                  เปลี่ยน
                </button>
              </div>
            ) : (
              <div className="relative">
                <input
                  type="text"
                  placeholder="พิมพ์ชื่อ, เบอร์โทร หรือเลข DN..."
                  value={patientSearch}
                  onChange={(e) => setPatientSearch(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
                {patients.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-20 max-h-48 overflow-y-auto">
                    {patients.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => {
                          setSelectedPatient(p);
                          setPatientSearch('');
                          setPatients([]);
                        }}
                        className="px-3 py-2 text-xs hover:bg-slate-50 cursor-pointer border-b border-slate-100 last:border-0"
                      >
                        <span className="font-bold text-slate-800">
                          {p.firstNameTh} {p.lastNameTh}
                        </span>{' '}
                        <span className="text-slate-500">({p.dn})</span> -{' '}
                        <span className="text-slate-600">{p.phone}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Doctor & Room */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">ทันตแพทย์ *</label>
              <select
                value={doctorId}
                onChange={(e) => setDoctorId(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none bg-white"
              >
                {doctors.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.fullName} ({d.nickname})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">ห้องตรวจ *</label>
              <select
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none bg-white"
              >
                {rooms.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">วันที่ *</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">เวลาเริ่ม *</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">ระยะเวลา (นาที)</label>
              <select
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none bg-white"
              >
                <option value={20}>20 นาที</option>
                <option value={30}>30 นาที</option>
                <option value={45}>45 นาที</option>
                <option value={60}>60 นาที</option>
                <option value={90}>90 นาที</option>
              </select>
            </div>
          </div>

          {/* Appointment Type */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">ประเภทนัดหมาย</label>
            <select
              value={typeId}
              onChange={(e) => handleTypeChange(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none bg-white"
            >
              <option value="">-- เลือกประเภทการรักษา --</option>
              {appointmentTypes.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} (ค่าเริ่มต้น {t.defaultDurationMinutes} นาที
                  {t.defaultFollowUpDays ? `, นัดถัดไป ~${t.defaultFollowUpDays} วัน` : ''})
                </option>
              ))}
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">หมายเหตุเพิ่มเติม</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="ระบุอาการเบื้องต้น หรือข้อควรระวัง..."
              className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
            />
          </div>

          {/* Submit Buttons */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-xl shadow-md shadow-sky-600/20 transition-all disabled:opacity-50"
            >
              {loading ? 'กำลังบันทึก...' : 'บันทึกนัดหมาย'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
