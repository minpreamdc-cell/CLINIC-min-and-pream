'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Printer, ArrowLeft, XCircle, AlertTriangle, CheckCircle, Sparkles } from 'lucide-react';
import { formatThaiDate, formatThaiDateTime, formatCurrency } from '@/lib/utils';

export default function ReceiptDetailPage() {
  const params = useParams();
  const router = useRouter();
  const receiptId = params.id as string;

  const [receipt, setReceipt] = useState<any | null>(null);
  const [setting, setSetting] = useState<any | null>(null);
  const [format, setFormat] = useState<'A4' | 'SLIP'>('A4');
  const [loading, setLoading] = useState(true);

  // Void modal
  const [isVoidModalOpen, setIsVoidModalOpen] = useState(false);
  const [voidReason, setVoidReason] = useState('');
  const [voidLoading, setVoidLoading] = useState(false);

  const fetchReceipt = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/receipts/${receiptId}`);
      const data = await res.json();
      if (data.receipt) {
        setReceipt(data.receipt);
        setSetting(data.setting);
        if (data.setting?.receiptFormat) {
          setFormat(data.setting.receiptFormat as any);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (receiptId) fetchReceipt();
  }, [receiptId]);

  const handleVoidSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!voidReason) return;
    setVoidLoading(true);
    try {
      const res = await fetch(`/api/receipts/${receiptId}/void`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ voidReason }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setIsVoidModalOpen(false);
      fetchReceipt();
    } catch (err: any) {
      console.error(err.message || 'Void failed');
    } finally {
      setVoidLoading(false);
    }
  };

  if (loading) {
    return <div className="py-24 text-center text-slate-400">กำลังโหลดใบเสร็จรับเงิน...</div>;
  }

  if (!receipt) {
    return <div className="py-24 text-center text-rose-500">ไม่พบใบเสร็จรับเงิน</div>;
  }

  const patient = receipt.patient;
  const invoice = receipt.invoice;
  const items = invoice?.treatmentItems || [];

  return (
    <div className="space-y-6">
      {/* Action Header (Hidden in print) */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 no-print">
        <div className="flex items-center gap-2">
          <Link
            href="/billing"
            className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-base font-bold text-slate-800">
              ใบเสร็จรับเงิน: {receipt.receiptNo}
            </h1>
            <p className="text-xs text-slate-500">
              {receipt.isVoided ? 'เอกสารถูกยกเลิกแล้ว (Voided)' : `พิมพ์แล้ว ${receipt.printedCount} ครั้ง`}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Format Toggle */}
          <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              type="button"
              onClick={() => setFormat('A4')}
              className={`px-3 py-1 rounded-lg transition-all ${
                format === 'A4' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
              }`}
            >
              ขนาด A4 มาตรฐาน
            </button>
            <button
              type="button"
              onClick={() => setFormat('SLIP')}
              className={`px-3 py-1 rounded-lg transition-all ${
                format === 'SLIP' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
              }`}
            >
              สลิปขนาดเล็ก 80mm
            </button>
          </div>

          <button
            type="button"
            onClick={() => window.print()}
            className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-md shadow-sky-600/20 flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>พิมพ์ / บันทึก PDF</span>
          </button>

          {!receipt.isVoided && (
            <button
              type="button"
              onClick={() => setIsVoidModalOpen(true)}
              className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-semibold text-xs rounded-xl flex items-center gap-1.5"
            >
              <XCircle className="w-4 h-4" />
              <span>ยกเลิกใบเสร็จนี้</span>
            </button>
          )}
        </div>
      </div>

      {/* Void Notice Banner */}
      {receipt.isVoided && (
        <div className="p-4 bg-rose-50 border-2 border-rose-400 rounded-2xl flex items-center gap-3 text-xs text-rose-900">
          <XCircle className="w-6 h-6 text-rose-600 flex-shrink-0" />
          <div>
            <p className="font-bold text-sm">ใบเสร็จรับเงินฉบับนี้ถูกยกเลิกแล้ว (VOIDED)</p>
            <p>
              ผู้ดำเนินการยกเลิก: <strong>{receipt.voidedBy}</strong> เมื่อ {formatThaiDateTime(receipt.voidedAt)}
            </p>
            <p>เหตุผล: {receipt.voidReason}</p>
          </div>
        </div>
      )}

      {/* DOCUMENT PREVIEW CONTAINER */}
      <div className="flex justify-center">
        {format === 'A4' ? (
          /* A4 Format View */
          <div className="bg-white w-full max-w-3xl p-8 sm:p-10 rounded-2xl shadow-md border border-slate-200 text-slate-800 space-y-6">
            {/* Clinic Header */}
            <div className="flex justify-between items-start border-b-2 border-slate-800 pb-5">
              <div>
                <h2 className="text-xl font-black text-slate-900">
                  {setting?.clinicNameTh || 'คลินิกทันตกรรมหมอมิน หมอพรีม'}
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  {setting?.clinicNameEn || 'Min & Preem Dental Clinic'}
                </p>
                <p className="text-xs text-slate-600 mt-1 max-w-md">
                  {setting?.address}
                </p>
                <p className="text-xs text-slate-600">
                  โทร: {setting?.phone} | เลขประจำตัวผู้เสียภาษี: {setting?.taxId}
                </p>
              </div>

              <div className="text-right">
                <span className="text-lg font-bold text-sky-900 block uppercase tracking-wider">
                  ใบเสร็จรับเงิน
                </span>
                <span className="text-xs text-slate-500 block">RECEIPT / INVOICE</span>
                <span className="text-xs font-mono font-bold text-slate-900 block mt-1">
                  เลขที่: {receipt.receiptNo}
                </span>
                <span className="text-xs text-slate-500 block">
                  วันที่: {formatThaiDate(receipt.receiptDate, true)}
                </span>
              </div>
            </div>

            {/* Patient & Billing Details */}
            <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div>
                <span className="text-slate-400 block font-semibold">ข้อมูลคนไข้ / PATIENT:</span>
                <p className="font-bold text-sm text-slate-900 mt-0.5">
                  {patient.title} {patient.firstNameTh} {patient.lastNameTh}
                </p>
                <p className="text-slate-600">เลขประจำตัว (DN): {patient.dn}</p>
                <p className="text-slate-600">เบอร์โทรศัพท์: {patient.phone}</p>
                <p className="text-slate-600">สิทธิการรักษา: {patient.rights}</p>
              </div>
              <div className="text-right">
                <span className="text-slate-400 block font-semibold">อ้างอิงบิล / REFERENCE:</span>
                <p className="font-mono font-bold text-slate-800 mt-0.5">{invoice?.invoiceNo}</p>
                <p className="text-slate-600">ผู้ออกใบเสร็จ: {receipt.createdBy || 'เจ้าหน้าที่การเงิน'}</p>
                <p className="text-slate-600">
                  เวลาที่ทำรายการ: {formatThaiDateTime(receipt.createdAt)}
                </p>
              </div>
            </div>

            {/* Itemized Table */}
            <div>
              <table className="w-full text-left text-xs divide-y divide-slate-200">
                <thead className="bg-slate-100 font-bold text-slate-700">
                  <tr>
                    <th className="px-3 py-2 text-center w-12">ลำดับ</th>
                    <th className="px-3 py-2">รายการรักษา / หัตถการ</th>
                    <th className="px-3 py-2 text-center">ซี่ฟัน</th>
                    <th className="px-3 py-2 text-center">จำนวน</th>
                    <th className="px-3 py-2 text-right">ราคาต่อหน่วย</th>
                    <th className="px-3 py-2 text-right">ส่วนลด</th>
                    <th className="px-3 py-2 text-right">จำนวนเงิน</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {items.map((it: any, index: number) => (
                    <tr key={it.id}>
                      <td className="px-3 py-2.5 text-center text-slate-500">{index + 1}</td>
                      <td className="px-3 py-2.5 font-medium text-slate-900">
                        {it.procedureName}
                      </td>
                      <td className="px-3 py-2.5 text-center font-mono">{it.toothNumber || '-'}</td>
                      <td className="px-3 py-2.5 text-center">{it.qty}</td>
                      <td className="px-3 py-2.5 text-right font-mono">{formatCurrency(it.unitPrice)}</td>
                      <td className="px-3 py-2.5 text-right font-mono text-rose-600">
                        {it.discountAmount > 0 ? `-${formatCurrency(it.discountAmount)}` : '-'}
                      </td>
                      <td className="px-3 py-2.5 text-right font-mono font-bold">
                        {formatCurrency(it.netAmount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Financial Summary Calculation */}
            <div className="border-t-2 border-slate-200 pt-4 flex justify-between items-start text-xs">
              <div className="space-y-1.5 max-w-sm">
                <span className="font-bold text-slate-700 block">ช่องทางการรับชำระเงิน:</span>
                <p className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 font-semibold text-slate-800">
                  {receipt.paymentMethodSummary}
                </p>
                {setting?.receiptFooter && (
                  <p className="text-[11px] text-slate-400 italic pt-2">
                    {setting.receiptFooter}
                  </p>
                )}
              </div>

              <div className="w-64 space-y-1.5 text-right">
                <div className="flex justify-between text-slate-600">
                  <span>ยอดรวม (Total):</span>
                  <span className="font-mono">{formatCurrency(receipt.totalAmount)}</span>
                </div>
                {receipt.totalDiscount > 0 && (
                  <div className="flex justify-between text-rose-600">
                    <span>ส่วนลด (Discount):</span>
                    <span className="font-mono">-{formatCurrency(receipt.totalDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-slate-900 border-t border-slate-200 pt-1">
                  <span>ยอดสุทธิ (Net Amount):</span>
                  <span className="font-mono">{formatCurrency(receipt.netAmount)}</span>
                </div>
                <div className="flex justify-between text-emerald-800 font-black text-sm border-t-2 border-slate-800 pt-1">
                  <span>ยอดรับเงินครั้งนี้ (Paid):</span>
                  <span className="font-mono">{formatCurrency(receipt.paidAmount)}</span>
                </div>
                {invoice && invoice.balanceDue > 0 && (
                  <div className="flex justify-between text-amber-700 font-bold text-xs pt-1">
                    <span>ยอดคงค้าง (Balance Due):</span>
                    <span className="font-mono">{formatCurrency(invoice.balanceDue)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Signatures */}
            <div className="grid grid-cols-2 gap-8 pt-12 text-center text-xs">
              <div>
                <div className="border-b border-slate-400 w-48 mx-auto pb-6"></div>
                <p className="mt-2 text-slate-600 font-semibold">ผู้รับเงิน / Cashier</p>
                <p className="text-[11px] text-slate-400">({receipt.createdBy || 'เจ้าหน้าที่การเงิน'})</p>
              </div>
              <div>
                <div className="border-b border-slate-400 w-48 mx-auto pb-6"></div>
                <p className="mt-2 text-slate-600 font-semibold">ผู้ชำระเงิน / Payer</p>
                <p className="text-[11px] text-slate-400">({patient.firstNameTh} {patient.lastNameTh})</p>
              </div>
            </div>
          </div>
        ) : (
          /* 80mm Slip Format View */
          <div className="bg-white w-80 p-5 rounded-2xl shadow-md border border-slate-200 text-slate-900 space-y-3 font-mono text-[11px]">
            <div className="text-center border-b pb-2">
              <h3 className="font-bold text-sm font-sans">{setting?.clinicNameTh}</h3>
              <p className="text-[10px] text-slate-500 font-sans">{setting?.address}</p>
              <p className="text-[10px] text-slate-500">โทร: {setting?.phone}</p>
              <p className="text-[10px] text-slate-500">Tax ID: {setting?.taxId}</p>
              <p className="font-bold text-xs mt-1">ใบเสร็จรับเงิน (RECEIPT)</p>
            </div>

            <div className="space-y-0.5 text-[10px]">
              <div className="flex justify-between">
                <span>เลขที่: {receipt.receiptNo}</span>
                <span>{invoice?.invoiceNo}</span>
              </div>
              <div>คนไข้: {patient.firstNameTh} {patient.lastNameTh} ({patient.dn})</div>
              <div>วันที่: {formatThaiDateTime(receipt.receiptDate)}</div>
            </div>

            <div className="border-t border-dashed py-2 space-y-1">
              {items.map((it: any) => (
                <div key={it.id} className="flex justify-between">
                  <span className="truncate max-w-[170px]">{it.procedureName} {it.toothNumber ? `#${it.toothNumber}` : ''}</span>
                  <span>{it.netAmount.toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-dashed pt-2 space-y-1">
              <div className="flex justify-between">
                <span>ยอดรวม:</span>
                <span>{receipt.totalAmount.toFixed(2)}</span>
              </div>
              {receipt.totalDiscount > 0 && (
                <div className="flex justify-between text-rose-600">
                  <span>ส่วนลด:</span>
                  <span>-{receipt.totalDiscount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-xs border-t pt-1">
                <span>ยอดชำระ:</span>
                <span>{receipt.paidAmount.toFixed(2)} ฿</span>
              </div>
              {invoice?.balanceDue > 0 && (
                <div className="flex justify-between text-amber-700 font-bold">
                  <span>คงค้าง:</span>
                  <span>{invoice.balanceDue.toFixed(2)} ฿</span>
                </div>
              )}
            </div>

            <div className="border-t border-dashed pt-2 text-[10px]">
              <div>ชำระโดย: {receipt.paymentMethodSummary}</div>
              <div className="text-center text-[9px] text-slate-400 mt-3 font-sans">
                {setting?.receiptFooter}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Void Modal */}
      {isVoidModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md p-5 space-y-4">
            <div className="flex items-center gap-2 text-rose-700">
              <AlertTriangle className="w-5 h-5 flex-shrink-0" />
              <h3 className="text-sm font-bold">ยืนยันยกเลิกใบเสร็จรับเงิน {receipt.receiptNo}</h3>
            </div>
            <p className="text-xs text-slate-600">
              การยกเลิกใบเสร็จจะปรับปรุงยอดค้างชำระในระบบย้อนกลับ และบันทึกประวัติการยกเลิกในระบบ Audit Log
            </p>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                เหตุผลในการยกเลิก *
              </label>
              <textarea
                rows={3}
                placeholder="เช่น ออกบิลผิดรายการ, คนไข้ขอยกเลิกและคืนเงิน..."
                value={voidReason}
                onChange={(e) => setVoidReason(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsVoidModalOpen(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                ปิด
              </button>
              <button
                type="button"
                onClick={handleVoidSubmit}
                disabled={voidLoading}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm"
              >
                {voidLoading ? 'กำลังยกเลิก...' : 'ยืนยันยกเลิกใบเสร็จ'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
