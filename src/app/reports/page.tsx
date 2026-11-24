'use client';

import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Calendar,
  Download,
  DollarSign,
  TrendingUp,
  CreditCard,
  Users,
  AlertCircle,
  CheckCircle,
  FileSpreadsheet,
  Lock,
  Unlock,
  Sparkles,
} from 'lucide-react';
import { formatThaiDate, formatThaiDateTime, formatCurrency, formatNumber } from '@/lib/utils';

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [doctorId, setDoctorId] = useState('all');

  const [doctors, setDoctors] = useState<any[]>([]);
  const [reportData, setReportData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // Daily Close State
  const [closeDate, setCloseDate] = useState(new Date().toISOString().split('T')[0]);
  const [dailyCloseData, setDailyCloseData] = useState<any | null>(null);
  const [countedCash, setCountedCash] = useState('');
  const [countedTransfer, setCountedTransfer] = useState('');
  const [countedCard, setCountedCard] = useState('');
  const [countedQr, setCountedQr] = useState('');
  const [closeReason, setCloseReason] = useState('');
  const [closeLoading, setCloseLoading] = useState(false);

  // Re-open daily close state
  const [reopenReason, setReopenReason] = useState('');

  const fetchReports = async () => {
    setLoading(true);
    try {
      const q = new URLSearchParams({
        tab: activeTab,
        startDate,
        endDate,
        doctorId,
      });
      const [rRes, dRes] = await Promise.all([
        fetch(`/api/reports?${q.toString()}`),
        fetch('/api/settings'),
      ]);
      const rData = await rRes.json();
      const dData = await dRes.json();

      setReportData(rData);
      setDoctors(dData.doctors || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchDailyClose = async () => {
    try {
      const res = await fetch(`/api/daily-close?date=${closeDate}`);
      const data = await res.json();
      setDailyCloseData(data);
      if (data.systemTotals) {
        setCountedCash(String(data.systemTotals.systemCash || ''));
        setCountedTransfer(String(data.systemTotals.systemTransfer || ''));
        setCountedCard(String(data.systemTotals.systemCard || ''));
        setCountedQr(String(data.systemTotals.systemQr || ''));
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (activeTab === 'daily-close') {
      fetchDailyClose();
    } else {
      fetchReports();
    }
  }, [activeTab, startDate, endDate, doctorId, closeDate]);

  const handleDailyCloseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dailyCloseData?.systemTotals) return;
    setCloseLoading(true);

    const cCash = parseFloat(countedCash) || 0;
    const cTransfer = parseFloat(countedTransfer) || 0;
    const cCard = parseFloat(countedCard) || 0;
    const cQr = parseFloat(countedQr) || 0;
    const cTotal = cCash + cTransfer + cCard + cQr;

    const diff = cTotal - dailyCloseData.systemTotals.systemTotal;

    try {
      const res = await fetch('/api/daily-close', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: closeDate,
          systemCash: dailyCloseData.systemTotals.systemCash,
          systemTransfer: dailyCloseData.systemTotals.systemTransfer,
          systemCard: dailyCloseData.systemTotals.systemCard,
          systemQr: dailyCloseData.systemTotals.systemQr,
          systemTotal: dailyCloseData.systemTotals.systemTotal,
          countedCash: cCash,
          countedTransfer: cTransfer,
          countedCard: cCard,
          countedQr: cQr,
          countedTotal: cTotal,
          difference: diff,
          reason: closeReason,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      alert('บันทึกปิดยอดประจำวันสำเร็จ');
      fetchDailyClose();
    } catch (err: any) {
      alert(err.message || 'Daily close failed');
    } finally {
      setCloseLoading(false);
    }
  };

  const handleReopenDailyClose = async () => {
    if (!dailyCloseData?.existingClose || !reopenReason) {
      alert('กรุณาระบุเหตุผลการขอเปิดแก้ยอดที่ปิดแล้ว');
      return;
    }
    try {
      const res = await fetch('/api/daily-close', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: dailyCloseData.existingClose.id,
          reopenReason,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      alert('ปลดล็อคยอดที่ปิดแล้วสำเร็จ');
      setReopenReason('');
      fetchDailyClose();
    } catch (err: any) {
      alert(err.message || 'Failed to reopen');
    }
  };

  // CSV Export utility: exports current table data
  const exportToCsv = () => {
    let csvContent = 'data:text/csv;charset=utf-8,\uFEFF';
    if (activeTab === 'treatments' && reportData?.items) {
      csvContent += 'รหัส,รายการรักษา,ซี่ฟัน,แพทย์,คนไข้,ราคา,ส่วนลด,สุทธิ,DFแพทย์,วันที่\n';
      reportData.items.forEach((it: any) => {
        csvContent += `"${it.procedureCode}","${it.procedureName}","${it.toothNumber || ''}","${it.doctor.fullName}","${it.patient.firstNameTh} ${it.patient.lastNameTh}",${it.unitPrice},${it.discountAmount},${it.netAmount},${it.dfFinal},"${formatThaiDate(it.createdAt)}"\n`;
      });
    } else if (activeTab === 'receipts' && reportData?.receipts) {
      csvContent += 'เลขที่ใบเสร็จ,วันที่,คนไข้,ยอดรวม,ส่วนลด,สุทธิ,ยอดรับจริง,ช่องทางชำระ,สถานะ\n';
      reportData.receipts.forEach((r: any) => {
        csvContent += `"${r.receiptNo}","${formatThaiDate(r.receiptDate)}","${r.patient.firstNameTh} ${r.patient.lastNameTh}",${r.totalAmount},${r.totalDiscount},${r.netAmount},${r.paidAmount},"${r.paymentMethodSummary}","${r.isVoided ? 'ยกเลิก' : 'สมบูรณ์'}"\n`;
      });
    } else {
      csvContent += 'รายงาน,วันที่เริ่มต้น,วันที่สิ้นสุด\n';
      csvContent += `"${activeTab}","${startDate}","${endDate}"\n`;
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `minpreem_report_${activeTab}_${startDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const tabs = [
    { key: 'dashboard', label: 'ภาพรวมแดชบอร์ด (Overview)' },
    { key: 'daily-close', label: 'ปิดยอดประจำวัน (Daily Close)' },
    { key: 'treatments', label: '1. รายการรักษา' },
    { key: 'receipts', label: '2. ใบเสร็จรับเงิน' },
    { key: 'payment-methods', label: '3. วิธีชำระเงิน (Cash-basis)' },
    { key: 'doctor-fees', label: '4. รายได้แพทย์ / ค่า DF' },
    { key: 'lab-expenses', label: '5. ค่าแลปและงานแลป' },
    { key: 'voided-receipts', label: '6. ใบเสร็จยกเลิก' },
    { key: 'outstanding', label: '7. ยอดค้างชำระ (AR)' },
    { key: 'discounts', label: '8. ส่วนลด' },
    { key: 'insurance', label: '9. ลูกหนี้สิทธิ / ประกัน' },
    { key: 'deposits', label: '10. เงินมัดจำ' },
  ];

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-sky-600" />
              <span>รายงาน การเงิน และปิดยอดประจำวัน</span>
            </h1>
            <p className="text-xs text-slate-500">
              วิเคราะห์รายได้ตามวันที่รับเงินจริง (Cash-basis), สรุปยอด DF แพทย์, และกระทบยอดปิดกะ
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={exportToCsv}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-sm flex items-center gap-1.5"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>ส่งออก Excel / CSV</span>
            </button>
          </div>
        </div>

        {/* Date Filter Bar */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-500">ตั้งแต่วันที่:</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-3 py-1.5 border border-slate-300 rounded-xl bg-white"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-500">ถึงวันที่:</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-3 py-1.5 border border-slate-300 rounded-xl bg-white"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-500">แพทย์:</span>
            <select
              value={doctorId}
              onChange={(e) => setDoctorId(e.target.value)}
              className="px-3 py-1.5 border border-slate-300 rounded-xl bg-white"
            >
              <option value="all">ทันตแพทย์ทุกคน</option>
              {doctors.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.fullName} ({d.nickname})
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-1 ml-auto">
            <button
              type="button"
              onClick={() => {
                const today = new Date().toISOString().split('T')[0];
                setStartDate(today);
                setEndDate(today);
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
            >
              วันนี้
            </button>
            <button
              type="button"
              onClick={() => {
                const now = new Date();
                const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
                const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
                setStartDate(firstDay);
                setEndDate(lastDay);
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
            >
              เดือนนี้
            </button>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex overflow-x-auto gap-1 border-t border-slate-100 pt-3 no-scrollbar text-xs font-semibold">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all ${
                activeTab === tab.key
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* TAB: DASHBOARD OVERVIEW */}
      {activeTab === 'dashboard' && reportData && (
        <div className="space-y-6">
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-1">
              <span className="text-slate-400 text-xs font-semibold block">ผู้มารักษาทั้งหมด</span>
              <span className="text-2xl font-black text-slate-900">{reportData.totalVisits} ท่าน</span>
              <span className="text-[10px] text-slate-400 block">จากระบบบันทึกคิวจริง</span>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-1">
              <span className="text-slate-400 text-xs font-semibold block">นัดหมายใหม่</span>
              <span className="text-2xl font-black text-sky-700">{reportData.newAppointments} ราย</span>
              <span className="text-[10px] text-amber-600 font-medium block">
                ไม่มาตามนัด (No-show): {reportData.noShows} ราย
              </span>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-1">
              <span className="text-slate-400 text-xs font-semibold block">ยอดเรียกเก็บ (Billed)</span>
              <span className="text-2xl font-black text-slate-900 font-mono">
                {formatCurrency(reportData.totalRevenueBilled)}
              </span>
              <span className="text-[10px] text-slate-400 block">ยอดสุทธิรวมหลังหักส่วนลด</span>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-emerald-200 bg-emerald-50/30 shadow-sm space-y-1">
              <span className="text-emerald-700 text-xs font-bold block">ยอดรับเงินจริง (Cash Collected)</span>
              <span className="text-2xl font-black text-emerald-800 font-mono">
                {formatCurrency(reportData.totalCashCollected)}
              </span>
              <span className="text-[10px] text-emerald-600 block">รับเข้าสด/โอนจริง (ไม่นับมัดจำซ้ำ)</span>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-amber-200 shadow-sm space-y-1">
              <span className="text-amber-700 text-xs font-bold block">ยอดค้างชำระ (Outstanding)</span>
              <span className="text-2xl font-black text-amber-800 font-mono">
                {formatCurrency(reportData.totalOutstanding)}
              </span>
              <span className="text-[10px] text-amber-600 block">ลูกหนี้ค้างชำระรอติดตาม</span>
            </div>
          </div>

          {/* Hourly Patient Distribution (Peak Hours Heatmap) */}
          {reportData.hourlyDistribution && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-800">
                  สถิติช่วงเวลาที่มีคนไข้หนาแน่น (Peak Hours Traffic Analysis)
                </h3>
                <span className="text-[11px] text-slate-400">คำนวณจากเวลาเช็กอินจริง</span>
              </div>
              <div className="grid grid-cols-6 sm:grid-cols-13 gap-2 pt-2">
                {Object.entries(reportData.hourlyDistribution).map(([hour, count]: any) => (
                  <div
                    key={hour}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      count > 0 ? 'bg-sky-50 border-sky-300 text-sky-900' : 'bg-slate-50 border-slate-200 text-slate-400'
                    }`}
                  >
                    <span className="block text-[11px] font-mono font-bold">{hour}:00</span>
                    <span className="block text-base font-black mt-1">{count}</span>
                    <span className="block text-[9px] text-slate-400">คนไข้</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB: DAILY REGISTER CLOSE (ปิดยอดประจำวัน) */}
      {activeTab === 'daily-close' && dailyCloseData && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <Lock className="w-5 h-5 text-indigo-600" />
                  <span>บันทึกปิดยอดประจำวันและกระทบยอดเงินสด/โอน</span>
                </h3>
                <p className="text-xs text-slate-500">
                  เปรียบเทียบยอดเงินที่ระบบบันทึกรับจริงกับยอดเงินที่เคาน์เตอร์ตรวจนับได้
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="font-semibold text-slate-500">วันที่ปิดยอด:</span>
                <input
                  type="date"
                  value={closeDate}
                  onChange={(e) => setCloseDate(e.target.value)}
                  className="px-3 py-1.5 border border-slate-300 rounded-xl bg-white"
                />
              </div>
            </div>

            {/* If Shift Already Closed Notice */}
            {dailyCloseData.existingClose ? (
              <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-emerald-900 text-sm">
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                    <span>ยอดประจำวันที่ {formatThaiDate(closeDate)} ได้รับการปิดยอดเรียบร้อยแล้ว</span>
                  </div>
                  <span className="text-[11px] text-emerald-700">
                    ปิดโดย: <strong>{dailyCloseData.existingClose.closedBy}</strong> เมื่อ {formatThaiDateTime(dailyCloseData.existingClose.closedAt)}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3 p-3 bg-white rounded-xl border border-emerald-200 font-mono">
                  <div>
                    <span className="text-slate-400 block">ยอดตามระบบ</span>
                    <strong className="text-slate-800 text-sm">{formatCurrency(dailyCloseData.existingClose.systemTotal)}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">ยอดตรวจนับได้</span>
                    <strong className="text-emerald-800 text-sm">{formatCurrency(dailyCloseData.existingClose.countedTotal)}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">ส่วนต่าง (Difference)</span>
                    <strong className={dailyCloseData.existingClose.difference === 0 ? 'text-emerald-700 text-sm' : 'text-rose-700 text-sm'}>
                      {formatCurrency(dailyCloseData.existingClose.difference)}
                    </strong>
                  </div>
                </div>

                {dailyCloseData.existingClose.reason && (
                  <p className="text-slate-600">หมายเหตุ: {dailyCloseData.existingClose.reason}</p>
                )}

                {/* Supervisor Re-open request */}
                <div className="pt-2 border-t border-emerald-200 flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-1 max-w-md">
                    <input
                      type="text"
                      placeholder="ระบุเหตุผลขอเปิดแก้ยอดที่ปิดแล้ว..."
                      value={reopenReason}
                      onChange={(e) => setReopenReason(e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
                    />
                    <button
                      type="button"
                      onClick={handleReopenDailyClose}
                      className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg text-xs whitespace-nowrap flex items-center gap-1"
                    >
                      <Unlock className="w-3.5 h-3.5" />
                      <span>ขอปลดล็อคยอด</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* Daily Close Form */
              <form onSubmit={handleDailyCloseSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left: System Totals (Read-only) */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 text-xs">
                    <h4 className="font-bold text-slate-800 border-b pb-2">
                      1. ยอดรับเงินจริงตามระบบ (System Recorded)
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-slate-600">เงินสด (Cash):</span>
                        <strong className="font-mono">{formatCurrency(dailyCloseData.systemTotals?.systemCash)}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">โอนเงิน (Transfer):</span>
                        <strong className="font-mono">{formatCurrency(dailyCloseData.systemTotals?.systemTransfer)}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">บัตรเครดิต (Credit Card):</span>
                        <strong className="font-mono">{formatCurrency(dailyCloseData.systemTotals?.systemCard)}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">QR Code (PromptPay):</span>
                        <strong className="font-mono">{formatCurrency(dailyCloseData.systemTotals?.systemQr)}</strong>
                      </div>
                      <div className="flex justify-between text-sm font-black text-slate-900 border-t pt-2">
                        <span>ยอดรวมระบบ:</span>
                        <span className="font-mono text-sky-800">{formatCurrency(dailyCloseData.systemTotals?.systemTotal)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Physical Counted Totals (Input) */}
                  <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-3 text-xs">
                    <h4 className="font-bold text-slate-800 border-b pb-2">
                      2. ยอดตรวจนับได้จริง (Counted Physical Totals)
                    </h4>
                    <div className="space-y-2">
                      <div>
                        <label className="block text-slate-600 mb-1">เงินสดตรวจนับได้ (บาท)</label>
                        <input
                          type="number"
                          value={countedCash}
                          onChange={(e) => setCountedCash(e.target.value)}
                          className="w-full px-3 py-1.5 border border-slate-300 rounded-lg font-mono font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-600 mb-1">สลิปโอนเงินตรวจนับได้ (บาท)</label>
                        <input
                          type="number"
                          value={countedTransfer}
                          onChange={(e) => setCountedTransfer(e.target.value)}
                          className="w-full px-3 py-1.5 border border-slate-300 rounded-lg font-mono font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-600 mb-1">เซลล์สลิปบัตรเครดิต (บาท)</label>
                        <input
                          type="number"
                          value={countedCard}
                          onChange={(e) => setCountedCard(e.target.value)}
                          className="w-full px-3 py-1.5 border border-slate-300 rounded-lg font-mono font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-600 mb-1">QR Code ตรวจนับได้ (บาท)</label>
                        <input
                          type="number"
                          value={countedQr}
                          onChange={(e) => setCountedQr(e.target.value)}
                          className="w-full px-3 py-1.5 border border-slate-300 rounded-lg font-mono font-bold"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Discrepancy Calculation Box */}
                {(() => {
                  const cTotal = (parseFloat(countedCash) || 0) + (parseFloat(countedTransfer) || 0) + (parseFloat(countedCard) || 0) + (parseFloat(countedQr) || 0);
                  const diff = cTotal - (dailyCloseData.systemTotals?.systemTotal || 0);
                  return (
                    <div className="p-4 rounded-xl border bg-slate-50 flex items-center justify-between text-xs font-bold">
                      <div>
                        <span>ยอดตรวจนับได้รวม: <strong className="font-mono text-sm text-slate-900">{formatCurrency(cTotal)}</strong></span>
                      </div>
                      <div>
                        <span>ส่วนต่าง (Difference): </span>
                        <strong className={`font-mono text-base ${diff === 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                          {diff > 0 ? `+${formatCurrency(diff)}` : formatCurrency(diff)}
                        </strong>
                      </div>
                    </div>
                  );
                })()}

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    เหตุผล / บันทึกเพิ่มเติม (กรณีมีส่วนต่างหรือไม่ตรงกัน)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="เช่น ยอดเงินสดเกิน 20 บาท เป็นเงินทอนที่คนไข้ไม่รับ..."
                    value={closeReason}
                    onChange={(e) => setCloseReason(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={closeLoading}
                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-600/20"
                  >
                    {closeLoading ? 'กำลังบันทึก...' : 'ยืนยันปิดยอดประจำวัน'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* TAB: TREATMENTS REPORT */}
      {activeTab === 'treatments' && reportData?.items && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs divide-y divide-slate-200">
              <thead className="bg-slate-50 font-bold text-slate-600">
                <tr>
                  <th className="px-4 py-3">รหัส</th>
                  <th className="px-4 py-3">รายการรักษา</th>
                  <th className="px-4 py-3 text-center">ซี่ฟัน</th>
                  <th className="px-4 py-3">แพทย์</th>
                  <th className="px-4 py-3">คนไข้</th>
                  <th className="px-4 py-3 text-right">ราคา</th>
                  <th className="px-4 py-3 text-right">ส่วนลด</th>
                  <th className="px-4 py-3 text-right">ยอดสุทธิ</th>
                  <th className="px-4 py-3 text-right">ค่า DF แพทย์</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {reportData.items.map((it: any) => (
                  <tr key={it.id}>
                    <td className="px-4 py-3 font-mono font-bold text-slate-600">{it.procedureCode}</td>
                    <td className="px-4 py-3 font-semibold text-slate-900">{it.procedureName}</td>
                    <td className="px-4 py-3 text-center font-mono">{it.toothNumber || '-'}</td>
                    <td className="px-4 py-3 text-slate-700">{it.doctor.nickname}</td>
                    <td className="px-4 py-3 text-slate-800">{it.patient.firstNameTh} {it.patient.lastNameTh}</td>
                    <td className="px-4 py-3 text-right font-mono">{formatCurrency(it.unitPrice * it.qty)}</td>
                    <td className="px-4 py-3 text-right font-mono text-rose-600">-{formatCurrency(it.discountAmount)}</td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-slate-900">{formatCurrency(it.netAmount)}</td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-sky-700">{formatCurrency(it.dfFinal)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB: DOCTOR FEES / DF REPORT & PAYROLL SLIP */}
      {activeTab === 'doctor-fees' && reportData?.doctorSummary && (
        <div className="space-y-6">
          <div className="flex items-center justify-between no-print">
            <div>
              <h3 className="text-sm font-bold text-slate-800">
                ใบสรุปค่ามือทันตแพทย์ (Doctor Fee / DF Payroll Statement)
              </h3>
              <p className="text-xs text-slate-500">
                คำนวณส่วนแบ่ง DF สุทธิ หักค่าแลปทันตกรรม และคำนวณภาษีหัก ณ ที่จ่าย 3% พร้อมสั่งพิมพ์สลิปเงินได้แพทย์
              </p>
            </div>
            <button
              type="button"
              onClick={() => window.print()}
              className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-sm"
            >
              🖨️ พิมพ์สลิปค่ามือแพทย์ (DF Slip)
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reportData.doctorSummary.map((ds: any, idx: number) => {
              const withholdingTax3Percent = ds.totalDf * 0.03;
              const netPayoutAfterTax = ds.totalDf - withholdingTax3Percent;
              return (
                <div key={idx} className="p-5 bg-white rounded-2xl border-2 border-sky-200 shadow-sm space-y-3 text-xs">
                  <div className="flex justify-between items-center border-b border-slate-200 pb-2.5">
                    <div>
                      <span className="text-[10px] font-bold text-sky-600 uppercase tracking-wider block">
                        DOCTOR FEE STATEMENT • คลินิกหมอมิน หมอพรีม
                      </span>
                      <h4 className="font-black text-base text-slate-900">{ds.doctorName}</h4>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-sky-100 text-sky-800 font-bold">
                      {ds.count} หัตถการ
                    </span>
                  </div>
                  <div className="space-y-2 font-mono">
                    <div className="flex justify-between text-slate-600">
                      <span>1. ยอดค่ารักษาที่ทำทั้งหมด (Gross Revenue):</span>
                      <strong>{formatCurrency(ds.totalRevenue)}</strong>
                    </div>
                    <div className="flex justify-between text-rose-600">
                      <span>2. หักค่าแลปทันตกรรมส่วนแพทย์ (Lab Deduction):</span>
                      <strong>-{formatCurrency(ds.totalLab)}</strong>
                    </div>
                    <div className="flex justify-between font-bold text-slate-800 border-t border-slate-100 pt-1.5">
                      <span>3. ยอดค่ามือแพทย์ก่อนภาษี (Gross DF):</span>
                      <strong>{formatCurrency(ds.totalDf)}</strong>
                    </div>
                    <div className="flex justify-between text-amber-700">
                      <span>4. หักภาษี ณ ที่จ่าย 3% (WHT 3%):</span>
                      <strong>-{formatCurrency(withholdingTax3Percent)}</strong>
                    </div>
                    <div className="flex justify-between text-sm font-black text-emerald-800 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                      <span>ยอดโอนจ่ายแพทย์สุทธิ (Net Payout):</span>
                      <strong>{formatCurrency(netPayoutAfterTax)}</strong>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Detailed Procedure Breakdown for Doctor Payroll */}
          {reportData.items && reportData.items.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 font-bold text-xs text-slate-800">
                รายละเอียดหัตถการประกอบการคิดค่า DF แพทย์ ({reportData.items.length} รายการ)
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs divide-y divide-slate-200">
                  <thead className="bg-slate-50/70 font-bold text-slate-600">
                    <tr>
                      <th className="px-4 py-2.5">วันที่</th>
                      <th className="px-4 py-2.5">ทันตแพทย์</th>
                      <th className="px-4 py-2.5">คนไข้</th>
                      <th className="px-4 py-2.5">หัตถการ (ซี่ฟัน)</th>
                      <th className="px-4 py-2.5 text-right">ค่ารักษาสุทธิ</th>
                      <th className="px-4 py-2.5 text-center">เรท DF</th>
                      <th className="px-4 py-2.5 text-right">ค่า DF ที่ได้รับ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {reportData.items.map((it: any) => (
                      <tr key={it.id}>
                        <td className="px-4 py-2 text-slate-600">{formatThaiDate(it.createdAt)}</td>
                        <td className="px-4 py-2 font-semibold text-slate-800">{it.doctor.nickname}</td>
                        <td className="px-4 py-2">{it.patient.firstNameTh} {it.patient.lastNameTh}</td>
                        <td className="px-4 py-2 font-medium text-slate-900">
                          {it.procedureName} {it.toothNumber ? `(#${it.toothNumber})` : ''}
                        </td>
                        <td className="px-4 py-2 text-right font-mono">{formatCurrency(it.netAmount)}</td>
                        <td className="px-4 py-2 text-center font-mono text-slate-500">{it.dfRate}%</td>
                        <td className="px-4 py-2 text-right font-mono font-bold text-sky-700">
                          {formatCurrency(it.dfFinal)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB: RECEIPT VOIDS REPORT */}
      {activeTab === 'voided-receipts' && reportData?.voided && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left text-xs divide-y divide-slate-200">
            <thead className="bg-slate-50 font-bold text-slate-600">
              <tr>
                <th className="px-4 py-3">เลขที่ใบเสร็จ</th>
                <th className="px-4 py-3">วันที่ยกเลิก</th>
                <th className="px-4 py-3">คนไข้</th>
                <th className="px-4 py-3 text-right">ยอดเงินยกเลิก</th>
                <th className="px-4 py-3">เหตุผลในการยกเลิก</th>
                <th className="px-4 py-3 text-right">ผู้อนุมัติยกเลิก</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {reportData.voided.map((vr: any) => (
                <tr key={vr.id}>
                  <td className="px-4 py-3 font-mono font-bold text-rose-700">{vr.receiptNo}</td>
                  <td className="px-4 py-3 text-slate-600">{formatThaiDateTime(vr.voidedAt)}</td>
                  <td className="px-4 py-3 text-slate-900">{vr.patient.firstNameTh} {vr.patient.lastNameTh}</td>
                  <td className="px-4 py-3 text-right font-mono font-bold text-rose-600">{formatCurrency(vr.paidAmount)}</td>
                  <td className="px-4 py-3 text-slate-700">{vr.voidReason}</td>
                  <td className="px-4 py-3 text-right text-slate-600">{vr.voidedBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
