'use client';

import React, { useState, useEffect } from 'react';
import { X, UserPlus, AlertCircle } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (visit: any) => void;
  doctors: any[];
  rooms: any[];
}

export default function WalkInModal({ isOpen, onClose, onSuccess, doctors, rooms }: Props) {
  const [patients, setPatients] = useState<any[]>([]);
  const [patientSearch, setPatientSearch] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<any | null>(null);

  const [doctorId, setDoctorId] = useState(doctors[0]?.id || '');
  const [roomId, setRoomId] = useState(rooms[0]?.id || '');
  const [notes, setNotes] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (doctors.length > 0 && !doctorId) setDoctorId(doctors[0].id);
    if (rooms.length > 0 && !roomId) setRoomId(rooms[0].id);
  }, [doctors, rooms, doctorId, roomId]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) {
      setErrorMsg('กรุณาเลือกคนไข้');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/queue/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId: selectedPatient.id,
          doctorId,
          roomId,
          notes: notes || 'Walk-in มาเข้ารับการรักษา',
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'ไม่สามารถรับ Walk-in ได้');
      }

      onSuccess(data.visit);
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
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden flex flex-col">
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">รับคนไข้ Walk-in</h3>
              <p className="text-xs text-slate-500">ออกคิวตรวจทันทีโดยไม่ต้องนัดหมายล่วงหน้า</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-200 text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Patient Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">ค้นหาคนไข้ *</label>
            {selectedPatient ? (
              <div className="flex items-center justify-between p-3 rounded-xl bg-teal-50 border border-teal-200">
                <div>
                  <p className="text-xs font-bold text-teal-900">
                    {selectedPatient.firstNameTh} {selectedPatient.lastNameTh} ({selectedPatient.dn})
                  </p>
                  <p className="text-[11px] text-teal-700">เบอร์โทร: {selectedPatient.phone}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedPatient(null)}
                  className="text-xs text-teal-700 hover:underline font-medium"
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
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
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
                        <span className="text-slate-500">({p.dn})</span>
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
              <label className="block text-xs font-semibold text-slate-700 mb-1">ทันตแพทย์ผู้ตรวจ *</label>
              <select
                value={doctorId}
                onChange={(e) => setDoctorId(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none bg-white"
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
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none bg-white"
              >
                {rooms.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">อาการสำคัญ / ข้อความถึงแพทย์</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="เช่น ปวดฟันกรามล่างขวา ขูดหินปูน..."
              className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-md shadow-teal-600/20"
            >
              {loading ? 'กำลังออกคิว...' : 'ออกคิวรอตรวจทันที'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
