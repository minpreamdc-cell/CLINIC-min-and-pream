'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Users, Search, UserPlus, Phone, ShieldAlert, ChevronRight, Calendar } from 'lucide-react';
import { formatThaiDate } from '@/lib/utils';
import NewPatientModal from '@/components/NewPatientModal';

export default function PatientsPage() {
  const [patients, setPatients] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [rights, setRights] = useState('all');
  const [doctorId, setDoctorId] = useState('all');
  const [loading, setLoading] = useState(true);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (search) query.set('search', search);
      if (rights !== 'all') query.set('rights', rights);
      if (doctorId !== 'all') query.set('doctorId', doctorId);

      const [pRes, dRes] = await Promise.all([
        fetch(`/api/patients?${query.toString()}`),
        fetch('/api/settings'),
      ]);

      const pData = await pRes.json();
      const dData = await dRes.json();

      setPatients(pData.patients || []);
      setDoctors(dData.doctors || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, [search, rights, doctorId]);

  return (
    <div className="space-y-6">
      {/* Top Header & Search Bar */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Users className="w-5 h-5 text-sky-600" />
              <span>ทะเบียนคนไข้และเวชระเบียน</span>
            </h1>
            <p className="text-xs text-slate-500">
              ค้นหาประวัติคนไข้ เลขประจำตัว (DN), เบอร์โทร, ตรวจสอบสิทธิ และเปิดแฟ้มประวัติ
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsNewModalOpen(true)}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 shadow-md shadow-sky-600/20 transition-all flex items-center gap-1.5 self-start sm:self-auto"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ ลงทะเบียนคนไข้ใหม่</span>
          </button>
        </div>

        {/* Filter Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="ค้นหาชื่อ-นามสกุล, เลข DN หรือเบอร์โทร..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
            />
          </div>

          <div>
            <select
              value={rights}
              onChange={(e) => setRights(e.target.value)}
              className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-xl bg-white"
            >
              <option value="all">ทุกสิทธิการรักษา</option>
              <option value="จ่ายเอง">จ่ายเอง (Self-pay)</option>
              <option value="ประกันสังคม (สปส.)">ประกันสังคม (สปส.)</option>
              <option value="สปสช. (บัตรทอง)">สปสช. (บัตรทอง)</option>
              <option value="ประกันคู่สัญญา">ประกันคู่สัญญา</option>
            </select>
          </div>

          <div>
            <select
              value={doctorId}
              onChange={(e) => setDoctorId(e.target.value)}
              className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-xl bg-white"
            >
              <option value="all">ทันตแพทย์ประจำทุกคน</option>
              {doctors.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.fullName} ({d.nickname})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Patient Directory Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs divide-y divide-slate-200">
            <thead className="bg-slate-50 font-bold text-slate-600">
              <tr>
                <th className="px-4 py-3">เลขประจำตัว (DN)</th>
                <th className="px-4 py-3">ชื่อ - นามสกุล</th>
                <th className="px-4 py-3">เบอร์ติดต่อ</th>
                <th className="px-4 py-3">สิทธิการรักษา</th>
                <th className="px-4 py-3">ข้อควรระวัง / แพ้ยา</th>
                <th className="px-4 py-3">แพทย์ประจำ</th>
                <th className="px-4 py-3">มารักษาล่าสุด</th>
                <th className="px-4 py-3 text-right">การจัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    กำลังโหลดรายชื่อคนไข้...
                  </td>
                </tr>
              ) : patients.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400 italic">
                    ไม่พบข้อมูลคนไข้ตามคำค้นหา
                  </td>
                </tr>
              ) : (
                patients.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-sky-700 whitespace-nowrap">
                      {p.dn}
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-900 whitespace-nowrap">
                      {p.title} {p.firstNameTh} {p.lastNameTh}
                      {p.firstNameEn && (
                        <div className="text-[10px] text-slate-400 font-normal">
                          {p.firstNameEn} {p.lastNameEn}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-slate-600 font-mono">
                      {p.phone}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700">
                        {p.rights}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {p.drugAllergies ? (
                        <span className="text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded flex items-center gap-1 max-w-xs truncate">
                          <ShieldAlert className="w-3.5 h-3.5 flex-shrink-0 text-rose-600" />
                          <span className="truncate">{p.drugAllergies}</span>
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-slate-700">
                      {p.attendingDoctor ? p.attendingDoctor.nickname || p.attendingDoctor.fullName : '-'}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-slate-500">
                      {p.visits && p.visits[0] ? formatThaiDate(p.visits[0].visitDate) : '-'}
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <Link
                        href={`/patients/${p.id}`}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 transition-colors inline-flex items-center gap-1"
                      >
                        <span>เปิดแฟ้มประวัติ</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <NewPatientModal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        onSuccess={fetchPatients}
        doctors={doctors}
      />
    </div>
  );
}
