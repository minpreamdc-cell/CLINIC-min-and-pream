'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  CreditCard,
  Search,
  Plus,
  Coins,
  CheckCircle,
  Clock,
  Printer,
  AlertCircle,
  FileText,
  DollarSign,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { formatThaiDate, formatCurrency } from '@/lib/utils';

function BillingContent() {
  const searchParams = useSearchParams();
  const preSelectedVisitId = searchParams.get('visitId');

  const [invoices, setInvoices] = useState<any[]>([]);
  const [waitingVisits, setWaitingVisits] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  // Active payment modal state
  const [activeInvoice, setActiveInvoice] = useState<any | null>(null);
  const [splitPayments, setSplitPayments] = useState<any[]>([
    { method: 'TRANSFER', amount: '', details: 'PromptPay / KBank' },
  ]);
  const [paymentDate, setPaymentDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [payLoading, setPayLoading] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);

  // Easy Petty Cash / Daily Clinic Expenses state
  const [expenses, setExpenses] = useState<
    { id: number; title: string; category: string; amount: number; time: string }[]
  >([
    { id: 1, title: 'ค่าแมสเซนเจอร์รับ-ส่งงานแลปครอบฟัน', category: 'ขนส่ง/งานแลป', amount: 120, time: '10:15' },
    { id: 2, title: 'ค่าน้ำดื่มรับรองคนไข้ 3 แพ็ก', category: 'วัสดุสิ้นเปลือง', amount: 150, time: '11:30' },
  ]);
  const [expTitle, setExpTitle] = useState('');
  const [expAmount, setExpAmount] = useState('');
  const [expCategory, setExpCategory] = useState('ขนส่ง/งานแลป');

  const handleQuickAddExpense = (title: string, category: string, amount: number) => {
    const nowTime = new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
    setExpenses([{ id: Date.now(), title, category, amount, time: nowTime }, ...expenses]);
  };

  const handleManualAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expTitle || !expAmount) return;
    handleQuickAddExpense(expTitle, expCategory, Number(expAmount));
    setExpTitle('');
    setExpAmount('');
  };

  const fetchBillingData = async () => {
    setLoading(true);
    try {
      const [invRes, queueRes] = await Promise.all([
        fetch('/api/invoices'),
        fetch('/api/queue?status=WAITING_PAYMENT'),
      ]);

      const invData = await invRes.json();
      const queueData = await queueRes.json();

      setInvoices(invData.invoices || []);
      setWaitingVisits(queueData.visits || []);

      // If visitId query param passed, check if invoice exists or create it
      if (preSelectedVisitId) {
        const found = invData.invoices?.find((i: any) => i.visitId === preSelectedVisitId);
        if (found) {
          openPaymentModal(found);
        } else {
          // Trigger create invoice for visit
          const createRes = await fetch('/api/invoices', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ visitId: preSelectedVisitId }),
          });
          const createData = await createRes.json();
          if (createData.invoice) {
            openPaymentModal(createData.invoice);
            // Refresh invoices
            fetchBillingData();
          }
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBillingData();
  }, []);

  const openPaymentModal = (invoice: any) => {
    setActiveInvoice(invoice);
    setPayError(null);
    setPaymentDate(new Date().toISOString().split('T')[0]);
    // Pre-fill full remaining balance on first row
    setSplitPayments([
      {
        method: 'TRANSFER',
        amount: invoice.balanceDue > 0 ? String(invoice.balanceDue) : '',
        details: 'PromptPay QR',
      },
    ]);
  };

  const handleAddSplitRow = () => {
    setSplitPayments([
      ...splitPayments,
      { method: 'CASH', amount: '', details: '' },
    ]);
  };

  const handleRemoveSplitRow = (index: number) => {
    setSplitPayments(splitPayments.filter((_, i) => i !== index));
  };

  const handleSplitRowChange = (index: number, field: string, val: string) => {
    const updated = [...splitPayments];
    updated[index][field] = val;
    setSplitPayments(updated);
  };

  const totalBeingPaid = splitPayments.reduce(
    (sum, p) => sum + (parseFloat(p.amount) || 0),
    0
  );

  const remainingAfterThisPay = activeInvoice
    ? Math.max(0, activeInvoice.balanceDue - totalBeingPaid)
    : 0;

  const handleProcessPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeInvoice) return;

    if (totalBeingPaid <= 0) {
      setPayError('กรุณากรอกยอดชำระที่ถูกต้อง (มากกว่า 0 บาท)');
      return;
    }

    if (totalBeingPaid > activeInvoice.balanceDue + 0.01) {
      setPayError(
        `ยอดชำระรวม (${totalBeingPaid.toFixed(2)} บาท) เกินยอดค้างชำระ (${activeInvoice.balanceDue.toFixed(2)} บาท)`
      );
      return;
    }

    // Check deposit balance if DEPOSIT_USE is in split payments
    const depositRow = splitPayments.find((p) => p.method === 'DEPOSIT_USE');
    if (depositRow) {
      const depAmt = parseFloat(depositRow.amount) || 0;
      if (activeInvoice.patient.depositBalance < depAmt) {
        setPayError(
          `เงินมัดจำคนไข้ไม่เพียงพอ (มีคงเหลือ ${activeInvoice.patient.depositBalance.toFixed(2)} บาท, ต้องการหัก ${depAmt.toFixed(2)} บาท)`
        );
        return;
      }
    }

    setPayLoading(true);
    setPayError(null);

    try {
      const res = await fetch(`/api/invoices/${activeInvoice.id}/pay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          payments: splitPayments,
          paymentDate: new Date(`${paymentDate}T12:00:00Z`).toISOString(),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      alert(data.message);
      setActiveInvoice(null);
      fetchBillingData();
    } catch (err: any) {
      setPayError(err.message || 'Payment processing failed');
    } finally {
      setPayLoading(false);
    }
  };

  // Filter invoices
  const filteredInvoices = invoices.filter((inv) => {
    if (statusFilter !== 'all' && inv.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      const matchNo = inv.invoiceNo.toLowerCase().includes(q);
      const matchName = `${inv.patient.firstNameTh} ${inv.patient.lastNameTh}`.toLowerCase().includes(q);
      const matchDn = inv.patient.dn.toLowerCase().includes(q);
      return matchNo || matchName || matchDn;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-sky-600" />
            <span>การเงิน ออกบิล และใบเสร็จรับเงิน</span>
          </h1>
          <p className="text-xs text-slate-500">
            เปิดบิลจากคิวรอชำระ, รับชำระแยกหลายช่องทาง (เงินสด, โอน, บัตร, มัดจำ), และออกใบเสร็จ
          </p>
        </div>
      </div>

      {/* Waiting for Billing Queue Panel */}
      {waitingVisits.length > 0 && (
        <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping"></span>
              <h2 className="text-sm font-bold text-emerald-950">
                คนไข้รอชำระเงินหน้าเคาน์เตอร์ขณะนี้ ({waitingVisits.length} ท่าน)
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {waitingVisits.map((v) => (
              <div
                key={v.id}
                className="p-3 bg-white rounded-xl border border-emerald-200 shadow-sm flex items-center justify-between text-xs"
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-md bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-[10px]">
                      {v.queueNumber}
                    </span>
                    <strong className="text-slate-900 font-bold">
                      {v.patient.firstNameTh} {v.patient.lastNameTh}
                    </strong>
                  </div>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    {v.patient.dn} | แพทย์: {v.doctor.nickname}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={async () => {
                    // Create invoice if not yet created, then open modal
                    const res = await fetch('/api/invoices', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ visitId: v.id }),
                    });
                    const data = await res.json();
                    if (data.invoice) openPaymentModal(data.invoice);
                  }}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-sm"
                >
                  เปิดบิลชำระ
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="ค้นหาเลขที่บิล, เลข DN หรือชื่อคนไข้..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
          />
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 text-xs border border-slate-300 rounded-xl bg-white"
          >
            <option value="all">ทุกสถานะบิล</option>
            <option value="UNPAID">ยังไม่ชำระ</option>
            <option value="PARTIALLY_PAID">ค้างชำระบางส่วน</option>
            <option value="PAID">ชำระครบถ้วนแล้ว</option>
          </select>
        </div>
      </div>

      {/* Invoices List Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs divide-y divide-slate-200">
            <thead className="bg-slate-50 font-bold text-slate-600">
              <tr>
                <th className="px-4 py-3">เลขที่บิล</th>
                <th className="px-4 py-3">วันที่</th>
                <th className="px-4 py-3">คนไข้</th>
                <th className="px-4 py-3 text-right">ยอดรวม</th>
                <th className="px-4 py-3 text-right">ส่วนลด</th>
                <th className="px-4 py-3 text-right">ยอดสุทธิ</th>
                <th className="px-4 py-3 text-right">ชำระแล้ว</th>
                <th className="px-4 py-3 text-right">ยอดค้างชำระ</th>
                <th className="px-4 py-3 text-center">สถานะ</th>
                <th className="px-4 py-3 text-right">การจัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-400">
                    กำลังโหลดข้อมูลบิล...
                  </td>
                </tr>
              ) : filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-400 italic">
                    ไม่พบรายการใบแจ้งค่ารักษา
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-sky-700 whitespace-nowrap">
                      {inv.invoiceNo}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-slate-600">
                      {formatThaiDate(inv.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-bold text-slate-900">
                        {inv.patient.firstNameTh} {inv.patient.lastNameTh}
                      </div>
                      <div className="text-[10px] text-slate-400">{inv.patient.dn}</div>
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-slate-600 whitespace-nowrap">
                      {formatCurrency(inv.totalAmount)}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-rose-600 whitespace-nowrap">
                      {inv.totalDiscount > 0 ? `-${formatCurrency(inv.totalDiscount)}` : '0.00 ฿'}
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-slate-900 whitespace-nowrap">
                      {formatCurrency(inv.netAmount)}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-emerald-600 whitespace-nowrap">
                      {formatCurrency(inv.paidAmount)}
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-amber-700 whitespace-nowrap">
                      {formatCurrency(inv.balanceDue)}
                    </td>
                    <td className="px-4 py-3 text-center whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          inv.status === 'PAID'
                            ? 'bg-emerald-100 text-emerald-800'
                            : inv.status === 'PARTIALLY_PAID'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {inv.status === 'PAID'
                          ? 'ชำระครบแล้ว'
                          : inv.status === 'PARTIALLY_PAID'
                          ? 'ค้างชำระบางส่วน'
                          : 'ยังไม่ชำระ'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap space-x-1.5">
                      {inv.balanceDue > 0 && (
                        <button
                          type="button"
                          onClick={() => openPaymentModal(inv)}
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-sm text-[11px]"
                        >
                          รับชำระเงิน
                        </button>
                      )}
                      {inv.receipts && inv.receipts.length > 0 && (
                        <Link
                          href={`/billing/receipts/${inv.receipts[0].id}`}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-[11px] inline-flex items-center gap-1"
                        >
                          <Printer className="w-3 h-3" />
                          <span>ใบเสร็จ</span>
                        </Link>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Easy 1-Click Petty Cash & Daily Clinic Expense Box */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Coins className="w-4 h-4 text-amber-600" />
              <span>บันทึกรายจ่ายย่อยประจำวัน (เงินสดย่อยหน้าเคาน์เตอร์ / Petty Cash)</span>
            </h3>
            <p className="text-xs text-slate-500">
              กดปุ่มลัดเพื่อบันทึกรายจ่ายหน้าร้านได้ทันที ช่วยให้ตอนนับเงินสดปิดกะตอนเย็นตรงเป๊ะ
            </p>
          </div>
          <div className="px-3.5 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-xs">
            <span className="text-rose-700 font-semibold">รวมรายจ่ายย่อยวันนี้: </span>
            <strong className="font-mono font-black text-rose-900 text-sm">
              {formatCurrency(expenses.reduce((s, e) => s + e.amount, 0))}
            </strong>
          </div>
        </div>

        {/* 1-Click Expense Buttons */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="font-bold text-slate-600">กดปุ่มลัดรายจ่ายที่ใช้บ่อย:</span>
          {[
            { title: '🛵 ค่าแมสเซนเจอร์ส่งแลป', cat: 'ขนส่ง/งานแลป', amt: 100 },
            { title: '💧 ซื้อน้ำดื่มรับรองคนไข้', cat: 'รับรองคนไข้', amt: 150 },
            { title: '🧻 ทิชชู่ / น้ำยาทำความสะอาด', cat: 'ของใช้คลินิก', amt: 120 },
            { title: '📦 ค่าส่งพัสดุไปรษณีย์', cat: 'ขนส่ง/งานแลป', amt: 60 },
          ].map((q, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleQuickAddExpense(q.title, q.cat, q.amt)}
              className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-600 hover:text-white text-amber-900 border border-amber-200 font-bold transition-all"
            >
              + {q.title} ({q.amt}฿)
            </button>
          ))}
        </div>

        <form onSubmit={handleManualAddExpense} className="flex flex-wrap items-center gap-2 text-xs">
          <input
            type="text"
            placeholder="ระบุรายการจ่ายอื่นๆ เช่น ค่าซ่อมหลอดไฟ..."
            value={expTitle}
            onChange={(e) => setExpTitle(e.target.value)}
            className="flex-1 min-w-[200px] px-3 py-1.5 border border-slate-300 rounded-xl"
          />
          <input
            type="number"
            placeholder="จำนวนเงิน (บาท)"
            value={expAmount}
            onChange={(e) => setExpAmount(e.target.value)}
            className="w-36 px-3 py-1.5 border border-slate-300 rounded-xl font-mono font-bold"
          />
          <button
            type="submit"
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl"
          >
            + บันทึกรายจ่าย
          </button>
        </form>

        <div className="divide-y divide-slate-100 text-xs bg-slate-50 rounded-xl border border-slate-200 px-3">
          {expenses.map((ex) => (
            <div key={ex.id} className="py-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] text-slate-400">{ex.time} น.</span>
                <span className="font-semibold text-slate-800">{ex.title}</span>
                <span className="px-2 py-0.5 rounded bg-white border border-slate-200 text-[10px] text-slate-500">
                  {ex.category}
                </span>
              </div>
              <span className="font-mono font-bold text-rose-600">-{formatCurrency(ex.amount)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Multi-Channel Payment Modal */}
      {activeInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-800">
                  รับชำระค่ารักษา: บิล {activeInvoice.invoiceNo}
                </h3>
                <p className="text-xs text-slate-500">
                  คนไข้: {activeInvoice.patient.firstNameTh} {activeInvoice.patient.lastNameTh} ({activeInvoice.patient.dn})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveInvoice(null)}
                className="text-xs text-slate-400 hover:text-slate-700"
              >
                ปิด
              </button>
            </div>

            <form onSubmit={handleProcessPayment} className="p-6 overflow-y-auto space-y-4">
              {payError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{payError}</span>
                </div>
              )}

              {/* Invoice Summary Box */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">ยอดรวมค่ารักษา:</span>
                  <span className="font-mono font-semibold">{formatCurrency(activeInvoice.totalAmount)}</span>
                </div>
                <div className="flex justify-between text-rose-600">
                  <span>ส่วนลด:</span>
                  <span className="font-mono font-semibold">-{formatCurrency(activeInvoice.totalDiscount)}</span>
                </div>
                <div className="flex justify-between font-bold text-slate-800 border-t border-slate-200 pt-1">
                  <span>ยอดสุทธิ:</span>
                  <span className="font-mono">{formatCurrency(activeInvoice.netAmount)}</span>
                </div>
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>ชำระแล้วก่อนหน้านี้:</span>
                  <span className="font-mono">{formatCurrency(activeInvoice.paidAmount)}</span>
                </div>
                <div className="flex justify-between text-amber-900 font-bold text-sm border-t border-slate-200 pt-1">
                  <span>ยอดค้างชำระ (Balance Due):</span>
                  <span className="font-mono">{formatCurrency(activeInvoice.balanceDue)}</span>
                </div>
              </div>

              {/* Available Deposit Alert */}
              {activeInvoice.patient.depositBalance > 0 && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs flex items-center justify-between text-amber-900">
                  <div className="flex items-center gap-2">
                    <Coins className="w-4 h-4 text-amber-600" />
                    <span>คนไข้มีเงินมัดจำคงเหลือในระบบ: <strong>{formatCurrency(activeInvoice.patient.depositBalance)}</strong></span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const maxUse = Math.min(activeInvoice.patient.depositBalance, activeInvoice.balanceDue);
                      setSplitPayments([
                        ...splitPayments,
                        { method: 'DEPOSIT_USE', amount: String(maxUse), details: 'หักเงินมัดจำ' },
                      ]);
                    }}
                    className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-[11px] font-semibold"
                  >
                    + ใช้มัดจำนี้
                  </button>
                </div>
              )}

              {/* Date of Payment (Cash-basis actual date) */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  วันที่รับเงินจริง (Cash-Basis Receipt Date)
                </label>
                <input
                  type="date"
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-xl bg-white"
                />
              </div>

              {/* Quick SSO 900 Baht Split-Billing Shortcut */}
              {activeInvoice.balanceDue > 0 && (
                <div className="p-3 bg-indigo-50/70 border border-indigo-200 rounded-xl text-xs flex flex-wrap items-center justify-between gap-2 text-indigo-950">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span>
                      ใช้สิทธิ <strong>ประกันสังคม (ขูด/อุด/ถอน 900฿/ปี)</strong> แยกบิลอัตโนมัติ:
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const ssoClaim = Math.min(900, activeInvoice.balanceDue);
                      const patientPay = Math.max(0, activeInvoice.balanceDue - ssoClaim);
                      const rows: any[] = [
                        {
                          method: 'INSURANCE_CLAIM',
                          amount: String(ssoClaim),
                          details: 'เบิกประกันสังคม ทันตกรรม 900฿',
                        },
                      ];
                      if (patientPay > 0) {
                        rows.push({
                          method: 'TRANSFER',
                          amount: String(patientPay),
                          details: 'คนไข้ชำระส่วนต่าง PromptPay',
                        });
                      }
                      setSplitPayments(rows);
                    }}
                    className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[11px] font-bold shadow-2xs"
                  >
                    ⚡ แยกยอดประกันสังคม 900฿ + ส่วนต่าง
                  </button>
                </div>
              )}

              {/* Split Payment Channels */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800">
                    ช่องทางการชำระเงิน (สามารถแยกหลายช่องทางในบิลเดียว)
                  </label>
                  <button
                    type="button"
                    onClick={handleAddSplitRow}
                    className="text-xs text-sky-600 hover:underline font-semibold flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>เพิ่มช่องทาง</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {splitPayments.map((p, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200">
                      <select
                        value={p.method}
                        onChange={(e) => handleSplitRowChange(idx, 'method', e.target.value)}
                        className="w-36 px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                      >
                        <option value="TRANSFER">โอนเงิน / QR</option>
                        <option value="CASH">เงินสด (Cash)</option>
                        <option value="CREDIT_CARD">บัตรเครดิต</option>
                        <option value="DEPOSIT_USE">หักเงินมัดจำ</option>
                        <option value="INSURANCE_CLAIM">เบิกสิทธิ/ลูกหนี้</option>
                      </select>

                      <input
                        type="number"
                        placeholder="จำนวนเงิน (บาท)..."
                        value={p.amount}
                        onChange={(e) => handleSplitRowChange(idx, 'amount', e.target.value)}
                        className="flex-1 px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg font-mono font-bold"
                      />

                      <input
                        type="text"
                        placeholder="รายละเอียด เช่น KBank..."
                        value={p.details}
                        onChange={(e) => handleSplitRowChange(idx, 'details', e.target.value)}
                        className="w-28 px-2 py-1.5 text-xs border border-slate-300 rounded-lg"
                      />

                      {splitPayments.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveSplitRow(idx)}
                          className="text-rose-500 hover:text-rose-700 text-xs px-1"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Dynamic Thai PromptPay QR Display whenever TRANSFER / QR is selected */}
              {(() => {
                const qrRow = splitPayments.find(
                  (p) => p.method === 'TRANSFER' && parseFloat(p.amount) > 0
                );
                if (!qrRow) return null;
                const qrAmt = parseFloat(qrRow.amount) || 0;
                return (
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-sky-900 to-teal-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
                    <div className="space-y-1 text-xs">
                      <span className="px-2 py-0.5 rounded bg-sky-500/30 text-sky-200 font-bold text-[10px]">
                        THAI QR PROMPTPAY • พร้อมเพย์คลินิก
                      </span>
                      <h4 className="text-sm font-black">
                        สแกน QR เพื่อชำระเงินจำนวน {formatCurrency(qrAmt)}
                      </h4>
                      <p className="text-sky-200 text-[11px]">
                        ชื่อบัญชี: บจก. คลินิกทันตกรรมหมอมิน หมอพรีม (PromptPay ID: 0105567012345)
                      </p>
                      <p className="text-emerald-300 text-[10px] font-semibold">
                        ✓ ยอดเงินระบุใน QR อัตโนมัติ ไม่ต้องกรอกตัวเลขซ้ำ
                      </p>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl shadow-md shrink-0 flex flex-col items-center">
                      {/* Crisp SVG QR Code representation */}
                      <svg
                        viewBox="0 0 100 100"
                        className="w-24 h-24 text-slate-900"
                        fill="currentColor"
                      >
                        <path d="M5,5 h28 v28 h-28 z M10,10 v18 h18 v-18 z M14,14 h10 v10 h-10 z" />
                        <path d="M67,5 h28 v28 h-28 z M72,10 v18 h18 v-18 z M76,14 h10 v10 h-10 z" />
                        <path d="M5,67 h28 v28 h-28 z M10,72 v18 h18 v-18 z M14,76 h10 v10 h-10 z" />
                        <rect x="38" y="8" width="6" height="6" />
                        <rect x="50" y="8" width="10" height="6" />
                        <rect x="38" y="20" width="12" height="6" />
                        <rect x="54" y="20" width="6" height="12" />
                        <rect x="8" y="40" width="12" height="6" />
                        <rect x="26" y="40" width="8" height="14" />
                        <rect x="40" y="38" width="20" height="20" rx="3" fill="#0284c7" />
                        <rect x="66" y="40" width="10" height="8" />
                        <rect x="82" y="40" width="12" height="12" />
                        <rect x="38" y="64" width="8" height="12" />
                        <rect x="52" y="64" width="14" height="8" />
                        <rect x="72" y="66" width="10" height="10" />
                        <rect x="86" y="68" width="8" height="18" />
                        <rect x="40" y="82" width="16" height="10" />
                        <rect x="62" y="80" width="18" height="12" />
                      </svg>
                      <span className="text-[9px] font-mono font-bold text-sky-900 mt-1">
                        {formatCurrency(qrAmt)}
                      </span>
                    </div>
                  </div>
                );
              })()}

              {/* Total & Remaining calculation */}
              <div className="p-3 bg-sky-50/70 border border-sky-200 rounded-xl space-y-1 text-xs">
                <div className="flex justify-between font-bold text-sky-950">
                  <span>ยอดที่จะรับชำระในครั้งนี้:</span>
                  <span className="font-mono text-sm">{formatCurrency(totalBeingPaid)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>ยอดค้างชำระคงเหลือหลังชำระ:</span>
                  <span className="font-mono font-bold text-amber-800">{formatCurrency(remainingAfterThisPay)}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActiveInvoice(null)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={payLoading}
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md shadow-emerald-600/20"
                >
                  {payLoading ? 'กำลังบันทึก...' : 'ยืนยันรับชำระ & ออกใบเสร็จ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function BillingPage() {
  return (
    <Suspense fallback={<div className="py-24 text-center text-slate-400">กำลังโหลดข้อมูลการเงิน...</div>}>
      <BillingContent />
    </Suspense>
  );
}
