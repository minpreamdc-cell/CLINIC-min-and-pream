'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Volume2,
  VolumeX,
  Maximize2,
  Sparkles,
  Clock,
  ArrowLeft,
  BellRing,
  CheckCircle2,
  Stethoscope,
  CreditCard,
} from 'lucide-react';
import { formatThaiDate } from '@/lib/utils';

export default function TvQueueDisplayPage() {
  const [visits, setVisits] = useState<any[]>([]);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [lastAnnouncedCall, setLastAnnouncedCall] = useState<{
    queueNumber: number;
    patientName: string;
    roomName: string;
    doctorName: string;
    timestamp: number;
  } | null>(null);

  const lastTimestampRef = useRef<number>(0);

  // Thai speech announcement helper
  const announceQueueInThai = (
    queueNumber: number,
    patientName: string,
    roomName: string
  ) => {
    if (!soundEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const text = `ขอเชิญหมายเลขคิวที่ ${queueNumber}, คุณ ${patientName}, ที่ ${roomName} ค่ะ`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'th-TH';
      utterance.rate = 0.92;
      utterance.pitch = 1.05;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.error('Speech synthesis error:', e);
    }
  };

  const fetchTodayQueue = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const res = await fetch(`/api/queue?date=${today}`);
      const data = await res.json();
      setVisits(data.visits || []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchTodayQueue();
    const interval = setInterval(fetchTodayQueue, 4000);

    // Clock ticker
    const updateClock = () => {
      setCurrentTime(
        new Date().toLocaleTimeString('th-TH', {
          timeZone: 'Asia/Bangkok',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    };
    updateClock();
    const clockTimer = setInterval(updateClock, 1000);

    // Check localStorage for instant queue call triggers across tabs
    const checkCallTrigger = () => {
      try {
        const raw = localStorage.getItem('clinic_tv_queue_call');
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed.timestamp && parsed.timestamp > lastTimestampRef.current) {
            lastTimestampRef.current = parsed.timestamp;
            setLastAnnouncedCall(parsed);
            announceQueueInThai(parsed.queueNumber, parsed.patientName, parsed.roomName);
          }
        }
      } catch {}
    };

    checkCallTrigger();
    const callPoll = setInterval(checkCallTrigger, 1500);
    window.addEventListener('storage', checkCallTrigger);

    return () => {
      clearInterval(interval);
      clearInterval(clockTimer);
      clearInterval(callPoll);
      window.removeEventListener('storage', checkCallTrigger);
    };
  }, [soundEnabled]);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const inExamVisits = visits.filter((v) => v.status === 'IN_EXAM');
  const waitingExamVisits = visits.filter((v) => v.status === 'WAITING_EXAM');
  const waitingPaymentVisits = visits.filter((v) => v.status === 'WAITING_PAYMENT');

  // Highlighted active call (either triggered via button or latest IN_EXAM)
  const activeCall =
    lastAnnouncedCall ||
    (inExamVisits.length > 0
      ? {
          queueNumber: inExamVisits[0].queueNumber,
          patientName: `${inExamVisits[0].patient.firstNameTh} ${inExamVisits[0].patient.lastNameTh}`,
          roomName: inExamVisits[0].room.name,
          doctorName: inExamVisits[0].doctor.nickname || inExamVisits[0].doctor.fullName,
          timestamp: Date.now(),
        }
      : null);

  return (
    <div className="min-h-[calc(100vh-3rem)] bg-gradient-to-br from-slate-900 via-sky-950 to-teal-950 text-white rounded-3xl p-6 md:p-8 shadow-2xl flex flex-col justify-between border border-sky-800/40">
      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-sky-200 transition-colors"
            title="กลับหน้าจัดการคิว"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-sky-500/30">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black tracking-tight text-white">
              คลินิกทันตกรรมหมอมิน หมอพรีม (Min & Preem Dental Clinic)
            </h1>
            <p className="text-xs md:text-sm text-sky-300">
              หน้าจอแสดงคิวห้องตรวจและเรียกคิวอัตโนมัติ • {formatThaiDate(new Date(), true)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Clock */}
          <div className="px-4 py-2 rounded-2xl bg-white/10 border border-white/15 flex items-center gap-2.5">
            <Clock className="w-5 h-5 text-emerald-400 animate-pulse" />
            <span className="font-mono text-xl md:text-2xl font-black text-white">
              {currentTime || '--:--:--'} น.
            </span>
          </div>

          {/* Sound Toggle */}
          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`px-4 py-2.5 rounded-2xl font-bold text-xs flex items-center gap-2 border transition-all ${
              soundEnabled
                ? 'bg-emerald-500/20 border-emerald-400/50 text-emerald-300 hover:bg-emerald-500/30'
                : 'bg-rose-500/20 border-rose-400/50 text-rose-300 hover:bg-rose-500/30'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span>{soundEnabled ? 'เปิดเสียงขานคิวไทย' : 'ปิดเสียงอยู่'}</span>
          </button>

          {/* Test Voice Button */}
          {activeCall && (
            <button
              type="button"
              onClick={() =>
                announceQueueInThai(
                  activeCall.queueNumber,
                  activeCall.patientName,
                  activeCall.roomName
                )
              }
              className="px-4 py-2.5 rounded-2xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-sky-500/30 transition-all"
            >
              <BellRing className="w-4 h-4" />
              <span>ขานคิวซ้ำ</span>
            </button>
          )}

          {/* Fullscreen Button */}
          <button
            type="button"
            onClick={toggleFullScreen}
            className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-colors"
            title="ขยายเต็มจอทีวี"
          >
            <Maximize2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Content Grid: Clean 2-Column Layout (No Cramped Sub-Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 my-6 flex-1">
        {/* Left 6 cols: Now Calling Spotlight + Billing Counter */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          {/* Spotlight Card */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sky-500 via-sky-600 to-teal-600 p-6 md:p-8 shadow-2xl border border-white/20 flex-1 flex flex-col justify-between min-h-[260px]">
            <div className="flex items-center justify-between gap-3">
              <span className="px-3.5 py-1.5 rounded-full bg-white/20 text-white text-xs font-bold tracking-wide flex items-center gap-2 whitespace-nowrap">
                <BellRing className="w-4 h-4 animate-bounce shrink-0" />
                <span>กำลังเรียกคิวเข้าห้องตรวจ</span>
              </span>
              {activeCall && (
                <span className="px-3 py-1 rounded-full bg-amber-400/20 border border-amber-300/40 text-amber-200 text-xs font-bold whitespace-nowrap">
                  เชิญเข้าห้องตรวจทันที
                </span>
              )}
            </div>

            {activeCall ? (
              <div className="my-4 space-y-5">
                <div className="flex items-center justify-between gap-4 bg-black/15 rounded-2xl p-4 border border-white/10">
                  <div>
                    <span className="text-xs font-bold text-sky-100 block mb-1">หมายเลขคิว</span>
                    <span className="text-5xl md:text-6xl font-black font-mono tracking-tight text-white drop-shadow">
                      #{String(activeCall.queueNumber).padStart(2, '0')}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-sky-100 block mb-1.5">ห้องตรวจ</span>
                    <span className="inline-block px-4 py-2 rounded-xl bg-amber-400 text-slate-950 font-black text-base md:text-lg shadow-md whitespace-nowrap">
                      {activeCall.roomName}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-baseline justify-between gap-2 px-1">
                  <h2 className="text-2xl md:text-3xl font-black text-white">
                    คุณ {activeCall.patientName}
                  </h2>
                  <p className="text-sky-100 text-sm font-medium whitespace-nowrap">
                    ทันตแพทย์: {activeCall.doctorName}
                  </p>
                </div>
              </div>
            ) : (
              <div className="my-auto py-10 text-center text-sky-100/90">
                <p className="text-xl font-bold">ยังไม่มีคิวที่กำลังเรียกในขณะนี้</p>
                <p className="text-xs mt-1.5 text-sky-200/80">กรุณารอเจ้าหน้าที่เรียกคิวของท่าน</p>
              </div>
            )}
          </div>

          {/* Waiting for Payment Counter Box */}
          <div className="rounded-3xl bg-white/10 backdrop-blur-md border border-emerald-400/30 p-6">
            <div className="flex items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-2.5 min-w-0">
                <CreditCard className="w-5 h-5 text-emerald-400 shrink-0" />
                <h3 className="text-base md:text-lg font-bold text-emerald-300 truncate">
                  เชิญติดต่อช่องชำระเงิน / รับยา
                </h3>
              </div>
              <span className="px-3.5 py-1 rounded-full bg-emerald-500 text-slate-950 font-black text-xs whitespace-nowrap shrink-0">
                {waitingPaymentVisits.length} คิว
              </span>
            </div>
            {waitingPaymentVisits.length === 0 ? (
              <p className="text-sm text-slate-400 py-4 text-center bg-white/5 rounded-2xl border border-white/5">
                ไม่มีคิวรอชำระเงินในขณะนี้
              </p>
            ) : (
              <div className="space-y-2.5">
                {waitingPaymentVisits.map((v) => (
                  <div
                    key={v.id}
                    className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <span className="w-11 h-11 rounded-xl bg-emerald-400 text-slate-950 font-black font-mono text-lg flex items-center justify-center shrink-0">
                        #{String(v.queueNumber).padStart(2, '0')}
                      </span>
                      <p className="font-bold text-base text-white truncate">
                        คุณ {v.patient.firstNameTh} {v.patient.lastNameTh}
                      </p>
                    </div>
                    <span className="px-3 py-1 rounded-lg bg-emerald-400/20 text-emerald-200 text-xs font-bold whitespace-nowrap shrink-0">
                      เคาน์เตอร์การเงิน
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right 6 cols: Stacked Full-Width Cards (Waiting Queue on Top, In Exam on Bottom) */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          {/* Card 1: Waiting Queue (Full Width so names never wrap vertically) */}
          <div className="rounded-3xl bg-white/5 border border-white/10 p-6 flex flex-col flex-1">
            <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-3.5 mb-4">
              <div className="flex items-center gap-2.5">
                <Clock className="w-5 h-5 text-amber-400 shrink-0" />
                <h3 className="text-lg font-bold text-white">คิวรอเรียกตรวจ</h3>
              </div>
              <span className="px-3.5 py-1 rounded-full bg-amber-500 text-slate-950 font-black text-xs whitespace-nowrap shrink-0">
                {waitingExamVisits.length} คิว
              </span>
            </div>

            <div className="space-y-3 flex-1 overflow-y-auto">
              {waitingExamVisits.length === 0 ? (
                <div className="py-10 text-center text-slate-400 text-sm bg-white/5 rounded-2xl border border-white/5">
                  ไม่มีคิวรอตรวจในขณะนี้
                </div>
              ) : (
                waitingExamVisits.map((v, idx) => (
                  <div
                    key={v.id}
                    className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-between gap-4 transition-colors"
                  >
                    <div className="flex items-center gap-4 min-w-0 flex-1">
                      <span className="w-12 h-12 rounded-2xl bg-amber-400/20 border border-amber-400/40 text-amber-300 font-black font-mono text-lg flex items-center justify-center shrink-0">
                        #{String(v.queueNumber).padStart(2, '0')}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-base md:text-lg text-white truncate">
                          คุณ {v.patient.firstNameTh} {v.patient.lastNameTh}
                        </p>
                        <p className="text-xs text-slate-300 mt-0.5 truncate">
                          นัดกับ: {v.doctor.nickname || v.doctor.fullName}
                        </p>
                      </div>
                    </div>
                    <span className="px-3.5 py-1.5 rounded-xl bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-bold whitespace-nowrap shrink-0">
                      ลำดับถัดไป #{idx + 1}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Card 2: Currently in Exam Rooms (Full Width) */}
          <div className="rounded-3xl bg-white/5 border border-white/10 p-6 flex flex-col flex-1">
            <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-3.5 mb-4">
              <div className="flex items-center gap-2.5">
                <Stethoscope className="w-5 h-5 text-sky-400 shrink-0" />
                <h3 className="text-lg font-bold text-white">กำลังตรวจรักษา</h3>
              </div>
              <span className="px-3.5 py-1 rounded-full bg-sky-500 text-white font-black text-xs whitespace-nowrap shrink-0">
                {inExamVisits.length} ห้อง
              </span>
            </div>

            <div className="space-y-3 flex-1 overflow-y-auto">
              {inExamVisits.length === 0 ? (
                <div className="py-10 text-center text-slate-400 text-sm bg-white/5 rounded-2xl border border-white/5">
                  ห้องตรวจว่างทั้งหมด
                </div>
              ) : (
                inExamVisits.map((v) => (
                  <div
                    key={v.id}
                    className="p-4 rounded-2xl bg-sky-500/15 border border-sky-400/30 flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4 min-w-0 flex-1">
                      <span className="w-12 h-12 rounded-2xl bg-sky-400 text-slate-950 font-black font-mono text-lg flex items-center justify-center shrink-0">
                        #{String(v.queueNumber).padStart(2, '0')}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-base md:text-lg text-white truncate">
                          คุณ {v.patient.firstNameTh} {v.patient.lastNameTh}
                        </p>
                        <p className="text-xs text-sky-300 mt-0.5 truncate">
                          ทันตแพทย์: {v.doctor.nickname || v.doctor.fullName}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5 shrink-0">
                      <span className="px-3.5 py-1.5 rounded-xl bg-white/15 text-amber-300 font-bold text-xs whitespace-nowrap">
                        {v.room.name.split('(')[0]}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const payload = {
                            queueNumber: v.queueNumber,
                            patientName: `${v.patient.firstNameTh} ${v.patient.lastNameTh}`,
                            roomName: v.room.name.split('(')[0],
                            doctorName: v.doctor.nickname || v.doctor.fullName,
                            timestamp: Date.now(),
                          };
                          setLastAnnouncedCall(payload);
                          announceQueueInThai(
                            payload.queueNumber,
                            payload.patientName,
                            payload.roomName
                          );
                        }}
                        className="p-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white transition-colors"
                        title="กดเรียกเสียงขานคิว"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Ticker */}
      <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between text-xs text-sky-300/80 gap-2">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>
            หากถึงคิวของท่านแล้วไม่สะดวกเข้าห้องตรวจ กรุณาแจ้งเจ้าหน้าที่หน้าเคาน์เตอร์ • ขอบพระคุณที่ไว้วางใจคลินิกทันตกรรมหมอมิน หมอพรีม
          </span>
        </div>
        <span className="font-mono text-[11px] text-sky-400">
          Auto-Sync Live Queue System
        </span>
      </div>
    </div>
  );
}
