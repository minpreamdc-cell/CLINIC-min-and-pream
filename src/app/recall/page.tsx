'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BellRing,
  MessageSquare,
  PhoneCall,
  CalendarPlus,
  Smile,
  HeartPulse,
  CheckCircle2,
  Send,
  Sparkles,
  Clock,
  UserCheck,
} from 'lucide-react';
import { formatThaiDate, formatCurrency } from '@/lib/utils';

export default function PatientRecallCrmPage() {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'postcare' | 'ortho' | 'sixmonth'>('upcoming');
  const [sentIds, setSentIds] = useState<Record<string, boolean>>({});
  const [previewLineModal, setPreviewLineModal] = useState<{
    patientName: string;
    phone: string;
    message: string;
    key: string;
  } | null>(null);

  useEffect(() => {
    fetch('/api/recall')
      .then((res) => res.json())
      .then((d) => setData(d))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const triggerLineMessage = (key: string, patientName: string, phone: string, message: string) => {
    setPreviewLineModal({ key, patientName, phone, message });
  };

  const confirmSendLine = () => {
    if (!previewLineModal) return;
    setSentIds((prev) => ({ ...prev, [previewLineModal.key]: true }));
    setPreviewLineModal(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <BellRing className="w-5 h-5 text-sky-600" />
            <span>ระบบติดตามคนไข้ & แจ้งเตือน LINE OA อัตโนมัติ (Patient Recall & CRM)</span>
          </h1>
          <p className="text-xs text-slate-500">
            แจ้งเตือนนัดหมายล่วงหน้า, ติดตามอาการหลังทำฟัน (Post-Op Care), ตามเคสจัดฟัน และเตือนขูดหินปูนทุก 6 เดือน
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>LINE OA: @minpreemclinic เชื่อมต่อพร้อมใช้งาน</span>
          </span>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => setActiveTab('upcoming')}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
            activeTab === 'upcoming'
              ? 'bg-sky-50 border-sky-300 shadow-sm'
              : 'bg-white border-slate-200 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-bold text-sky-800">
            <span>1. แจ้งเตือนนัดหมายล่วงหน้า</span>
            <Clock className="w-4 h-4 text-sky-600" />
          </div>
          <p className="text-2xl font-black text-slate-900 mt-1">
            {data?.upcomingAppointments?.length || 0} ราย
          </p>
          <span className="text-[11px] text-slate-500">ส่ง LINE เตือนก่อนวันนัด 24 ชม.</span>
        </div>

        <div
          onClick={() => setActiveTab('postcare')}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
            activeTab === 'postcare'
              ? 'bg-rose-50 border-rose-300 shadow-sm'
              : 'bg-white border-slate-200 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-bold text-rose-800">
            <span>2. ติดตามอาการหลังรักษา (Post-Op)</span>
            <HeartPulse className="w-4 h-4 text-rose-600" />
          </div>
          <p className="text-2xl font-black text-slate-900 mt-1">
            {data?.postCareList?.length || 0} ราย
          </p>
          <span className="text-[11px] text-slate-500">โทร/ส่งคำแนะนำหลังถอนฟัน-รักษาราก</span>
        </div>

        <div
          onClick={() => setActiveTab('ortho')}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
            activeTab === 'ortho'
              ? 'bg-purple-50 border-purple-300 shadow-sm'
              : 'bg-white border-slate-200 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-bold text-purple-800">
            <span>3. ติดตามคนไข้จัดฟันรายเดือน</span>
            <Smile className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl font-black text-slate-900 mt-1">
            {data?.orthoRecalls?.length || 0} ราย
          </p>
          <span className="text-[11px] text-slate-500">นัดปรับเครื่องมือและแจ้งยอดงวดจัดฟัน</span>
        </div>

        <div
          onClick={() => setActiveTab('sixmonth')}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
            activeTab === 'sixmonth'
              ? 'bg-teal-50 border-teal-300 shadow-sm'
              : 'bg-white border-slate-200 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-bold text-teal-800">
            <span>4. Recall ขูดหินปูน 6 เดือน</span>
            <CalendarPlus className="w-4 h-4 text-teal-600" />
          </div>
          <p className="text-2xl font-black text-slate-900 mt-1">
            {data?.sixMonthRecalls?.length || 0} ราย
          </p>
          <span className="text-[11px] text-slate-500">เชิญคนไข้กลับมาตรวจสุขภาพฟันประจำปี</span>
        </div>
      </div>

      {/* Main Content Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-xs text-slate-400">กำลังโหลดข้อมูลติดตามคนไข้...</div>
        ) : (
          <>
            {/* 1. UPCOMING APPOINTMENTS REMINDER */}
            {activeTab === 'upcoming' && (
              <div className="divide-y divide-slate-100">
                <div className="p-4 bg-slate-50 flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-800">
                    รายการนัดหมายที่รอส่งข้อความยืนยันนัดผ่าน LINE OA
                  </h3>
                </div>
                {data?.upcomingAppointments?.map((app: any) => {
                  const key = `app-${app.id}`;
                  const isSent = sentIds[key];
                  return (
                    <div key={app.id} className="p-4 flex flex-wrap items-center justify-between gap-4 text-xs">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-sky-100 text-sky-800 font-mono font-bold">
                            {app.date} • {app.startTime} น.
                          </span>
                          <Link
                            href={`/patients/${app.patientId}`}
                            className="font-bold text-slate-900 hover:text-sky-600 text-sm"
                          >
                            {app.patient.title} {app.patient.firstNameTh} {app.patient.lastNameTh}
                          </Link>
                          <span className="text-slate-400">({app.patient.dn})</span>
                        </div>
                        <p className="text-slate-600">
                          หัตถการ: <strong>{app.typeName || 'นัดตรวจรักษา'}</strong> • แพทย์:{' '}
                          <strong>{app.doctor.nickname}</strong> ({app.room.name}) • โทร: {app.patient.phone}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        {isSent ? (
                          <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>ส่งแจ้งเตือน LINE แล้ว</span>
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() =>
                              triggerLineMessage(
                                key,
                                `${app.patient.firstNameTh} ${app.patient.lastNameTh}`,
                                app.patient.phone,
                                `สวัสดีค่ะคุณ ${app.patient.firstNameTh} 🦷 คลินิกทันตกรรมหมอมิน หมอพรีม ขอยืนยันนัดหมาย "${
                                  app.typeName || 'ตรวจฟัน'
                                }" กับ ${app.doctor.nickname} ในวันที่ ${formatThaiDate(app.date)} เวลา ${
                                  app.startTime
                                } น. หากต้องการเลื่อนนัดสามารถตอบกลับข้อความนี้ได้เลยนะคะ`
                              )
                            }
                            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1.5 shadow-sm"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>ส่ง LINE เตือนนัดหมาย</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* 2. POST-OP CARE */}
            {activeTab === 'postcare' && (
              <div className="divide-y divide-slate-100">
                <div className="p-4 bg-rose-50/60 flex items-center justify-between">
                  <h3 className="text-xs font-bold text-rose-950">
                    รายการติดตามอาการหลังการรักษา (Post-Treatment Care & Instruction)
                  </h3>
                </div>
                {data?.postCareList?.map((item: any) => {
                  const key = `post-${item.visitId}`;
                  const isSent = sentIds[key];
                  return (
                    <div key={item.visitId} className="p-4 flex flex-wrap items-center justify-between gap-4 text-xs">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/patients/${item.patientId}`}
                            className="font-bold text-slate-900 hover:text-sky-600 text-sm"
                          >
                            {item.patientName}
                          </Link>
                          <span className="text-slate-400">({item.dn})</span>
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                            วันที่รักษา: {formatThaiDate(item.visitDate)}
                          </span>
                        </div>
                        <p className="text-slate-600">
                          หัตถการที่ทำ: <strong className="text-rose-700">{item.procedureSummary}</strong> • โดย{' '}
                          {item.doctorName} • โทร: <strong className="font-mono">{item.phone}</strong>
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        {isSent ? (
                          <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>ติดตามอาการเรียบร้อย</span>
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() =>
                              triggerLineMessage(
                                key,
                                item.patientName,
                                item.phone,
                                `สวัสดีค่ะคุณ ${item.patientName} 💕 คลินิกทันตกรรมหมอมิน หมอพรีม ขอสอบถามอาการหลังจาก "${item.procedureSummary}" ค่ะ ตอนนี้อาการปวดหรือบวมลดลงไหมคะ? หากมีข้อสงสัยหรืออาการผิดปกติ สามารถทักแจ้งคุณหมอได้ตลอดเลยนะคะ`
                              )
                            }
                            className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold flex items-center gap-1.5 shadow-sm"
                          >
                            <HeartPulse className="w-3.5 h-3.5" />
                            <span>ส่ง LINE ถามอาการ & ข้อแนะนำ</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* 3. ORTHO MONTHLY FOLLOW-UP */}
            {activeTab === 'ortho' && (
              <div className="divide-y divide-slate-100">
                <div className="p-4 bg-purple-50/60">
                  <h3 className="text-xs font-bold text-purple-950">
                    ติดตามคนไข้จัดฟัน นัดปรับเครื่องมือและแจ้งสถานะงวดผ่อนชำระ
                  </h3>
                </div>
                {data?.orthoRecalls?.map((o: any) => {
                  const key = `ortho-${o.id}`;
                  const isSent = sentIds[key];
                  return (
                    <div key={o.id} className="p-4 flex flex-wrap items-center justify-between gap-4 text-xs">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/patients/${o.patientId}`}
                            className="font-bold text-slate-900 hover:text-purple-700 text-sm"
                          >
                            {o.patientName}
                          </Link>
                          <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-800 font-bold">
                            {o.packageName}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                            {o.progress}
                          </span>
                        </div>
                        <p className="text-slate-600">
                          แผนถัดไป: <strong>{o.nextTarget}</strong> • ยอดคงเหลือ:{' '}
                          <strong className="font-mono">{formatCurrency(o.balanceDue)}</strong> • โทร: {o.phone}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          triggerLineMessage(
                            key,
                            o.patientName,
                            o.phone,
                            `สวัสดีค่ะคุณ ${o.patientName} 😁 ถึงกำหนดนัดปรับเครื่องมือจัดฟันประจำเดือน (${o.packageName} - ${o.progress}) แล้วนะคะ แผนการักษารอบนี้คือ "${o.nextTarget}" สะดวกจองคิววันและเวลาไหนแจ้งแอดมินได้เลยนะคะ`
                          )
                        }
                        className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5 ${
                          isSent
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-purple-600 hover:bg-purple-700 text-white shadow-sm'
                        }`}
                      >
                        <Smile className="w-3.5 h-3.5" />
                        <span>{isSent ? '✓ ส่งแจ้งเตือนจัดฟันแล้ว' : 'ส่ง LINE ตามนัดปรับเครื่องมือ'}</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* 4. 6-MONTH SCALING RECALL */}
            {activeTab === 'sixmonth' && (
              <div className="divide-y divide-slate-100">
                <div className="p-4 bg-teal-50/60">
                  <h3 className="text-xs font-bold text-teal-950">
                    รายชื่อคนไข้ครบกำหนดตรวจสุขภาพช่องปากและขูดหินปูนทุก 6 เดือน (รวมสิทธิประกันสังคม 900 บาท/ปี)
                  </h3>
                </div>
                {data?.sixMonthRecalls?.map((r: any) => {
                  const key = `six-${r.id}`;
                  const isSent = sentIds[key];
                  return (
                    <div key={r.id} className="p-4 flex flex-wrap items-center justify-between gap-4 text-xs">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/patients/${r.id}`}
                            className="font-bold text-slate-900 hover:text-teal-700 text-sm"
                          >
                            {r.patientName}
                          </Link>
                          <span className="text-slate-400">({r.dn})</span>
                          <span className="px-2 py-0.5 rounded bg-teal-100 text-teal-800 font-semibold">
                            มาล่าสุด: {formatThaiDate(r.lastVisitDate)}
                          </span>
                        </div>
                        <p className="text-slate-600">
                          หัตถการล่าสุด: {r.lastProcedure} • ทันตแพทย์ประจำ: <strong>{r.doctorName}</strong> • โทร:{' '}
                          <strong className="font-mono">{r.phone}</strong>
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          triggerLineMessage(
                            key,
                            r.patientName,
                            r.phone,
                            `สวัสดีค่ะคุณ ${r.patientName} ✨ คลินิกทันตกรรมหมอมิน หมอพรีม ขอแจ้งเตือนว่าครบกำหนด 6 เดือนสำหรับการตรวจสุขภาพช่องปากและขูดหินปูนแล้วนะคะ (สามารถใช้สิทธิประกันสังคม 900 บาท/ปี โดยไม่ต้องสำรองจ่ายได้ค่ะ) สนใจนัดหมายวันไหนแจ้งได้เลยนะคะ`
                          )
                        }
                        className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5 ${
                          isSent
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-teal-600 hover:bg-teal-700 text-white shadow-sm'
                        }`}
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>{isSent ? '✓ ส่งข้อความเชิญแล้ว' : 'ส่ง LINE เชิญขูดหินปูน 6 เดือน'}</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>

      {/* LINE OA Message Preview & Send Confirmation Modal */}
      {previewLineModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-black text-xs">
                  LINE
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">ส่งข้อความแจ้งเตือนผ่าน LINE OA</h3>
                  <p className="text-[11px] text-slate-500">
                    ผู้รับ: {previewLineModal.patientName} ({previewLineModal.phone})
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                ข้อความที่จะส่ง (สามารถปรับแก้ข้อความก่อนส่งได้)
              </label>
              <textarea
                rows={4}
                value={previewLineModal.message}
                onChange={(e) =>
                  setPreviewLineModal({ ...previewLineModal, message: e.target.value })
                }
                className="w-full p-3 text-xs border border-slate-300 rounded-xl bg-emerald-50/40 text-slate-800 leading-relaxed"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setPreviewLineModal(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={confirmSendLine}
                className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>ยืนยันส่งข้อความทันที</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
