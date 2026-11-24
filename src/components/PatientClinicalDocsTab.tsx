'use client';

import React, { useState, useRef } from 'react';
import {
  Camera,
  FileCheck2,
  Printer,
  Upload,
  SlidersHorizontal,
  PenTool,
  Trash2,
  Award,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  Eraser,
} from 'lucide-react';
import { formatThaiDate } from '@/lib/utils';

interface PatientClinicalDocsTabProps {
  patient: any;
  onRefresh: () => void;
}

// Built-in dental SVG illustrations for instant demo X-Ray / Before-After comparison
const SAMPLE_BEFORE_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 340" width="600" height="340">
  <rect width="600" height="340" fill="#1e293b"/>
  <text x="24" y="38" fill="#fbbf24" font-family="sans-serif" font-size="18" font-weight="bold">BEFORE TREATMENT (ก่อนจัดฟัน / บูรณะฟัน)</text>
  <rect x="60" y="75" width="480" height="210" rx="90" fill="#fb7185" opacity="0.25" stroke="#f43f5e" stroke-width="3"/>
  <!-- Crowded / stained teeth representation -->
  <g fill="#fef08a" stroke="#ca8a04" stroke-width="3">
    <rect x="130" y="115" width="45" height="65" rx="10" transform="rotate(-8 130 115)"/>
    <rect x="182" y="105" width="48" height="72" rx="10" transform="rotate(6 182 105)"/>
    <rect x="235" y="112" width="54" height="75" rx="12" transform="rotate(-5 235 112)"/>
    <rect x="302" y="110" width="54" height="75" rx="12" transform="rotate(7 302 110)"/>
    <rect x="362" y="118" width="48" height="70" rx="10" transform="rotate(-6 362 118)"/>
    <rect x="415" y="112" width="45" height="65" rx="10" transform="rotate(9 415 112)"/>
  </g>
  <text x="300" y="265" text-anchor="middle" fill="#cbd5e1" font-family="sans-serif" font-size="14">ฟันซ้อนเก มีคราบหินปูนและช่องว่างระหว่างซี่ฟันคู่หน้า</text>
</svg>
`)}`;

const SAMPLE_AFTER_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 340" width="600" height="340">
  <rect width="600" height="340" fill="#0f172a"/>
  <text x="24" y="38" fill="#34d399" font-family="sans-serif" font-size="18" font-weight="bold">AFTER TREATMENT (หลังการรักษา / จัดเรียงสวยงาม)</text>
  <rect x="60" y="75" width="480" height="210" rx="90" fill="#38bdf8" opacity="0.2" stroke="#0ea5e9" stroke-width="3"/>
  <!-- Aligned bright white teeth -->
  <g fill="#ffffff" stroke="#38bdf8" stroke-width="2.5">
    <rect x="132" y="112" width="46" height="68" rx="10"/>
    <rect x="182" y="110" width="50" height="72" rx="10"/>
    <rect x="236" y="108" width="60" height="78" rx="12"/>
    <rect x="300" y="108" width="60" height="78" rx="12"/>
    <rect x="364" y="110" width="50" height="72" rx="10"/>
    <rect x="418" y="112" width="46" height="68" rx="10"/>
  </g>
  <text x="300" y="265" text-anchor="middle" fill="#6ee7b7" font-family="sans-serif" font-size="14">ฟันเรียงตัวสวยงามสมมาตร สีฟันขาวสะอาดตามแผนการรักษา</text>
</svg>
`)}`;

const SAMPLE_XRAY_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 340" width="600" height="340">
  <rect width="600" height="340" fill="#020617"/>
  <text x="24" y="36" fill="#38bdf8" font-family="monospace" font-size="16" font-weight="bold">PANORAMIC DIGITAL X-RAY • MIN & PREEM DENTAL</text>
  <ellipse cx="300" cy="180" rx="230" ry="105" fill="none" stroke="#334155" stroke-width="18" opacity="0.5"/>
  <g fill="#e2e8f0" opacity="0.85">
    <rect x="150" y="125" width="24" height="48" rx="6"/>
    <rect x="182" y="125" width="24" height="50" rx="6"/>
    <rect x="214" y="125" width="26" height="52" rx="6"/>
    <rect x="248" y="125" width="28" height="54" rx="6"/>
    <rect x="284" y="125" width="28" height="54" rx="6"/>
    <rect x="320" y="125" width="28" height="54" rx="6"/>
    <rect x="356" y="125" width="26" height="52" rx="6"/>
    <rect x="390" y="125" width="24" height="50" rx="6"/>
    <rect x="422" y="125" width="24" height="48" rx="6"/>
  </g>
  <circle cx="434" cy="148" r="18" fill="none" stroke="#f43f5e" stroke-width="3" stroke-dasharray="4 2"/>
  <text x="300" y="315" text-anchor="middle" fill="#94a3b8" font-family="monospace" font-size="13">FDI #28 / #38 Impaction Check • Low-Dose Digital Sensor</text>
</svg>
`)}`;

export default function PatientClinicalDocsTab({
  patient,
  onRefresh,
}: PatientClinicalDocsTabProps) {
  const [subTab, setSubTab] = useState<'gallery' | 'compare' | 'consent' | 'certificate'>('gallery');

  // Upload state
  const [docTitle, setDocTitle] = useState('');
  const [docCategory, setDocCategory] = useState('XRAY');
  const [uploading, setUploading] = useState(false);

  // Before / After Slider state
  const [sliderPos, setSliderPos] = useState(50);
  const [beforeImg, setBeforeImg] = useState<string>(SAMPLE_BEFORE_SVG);
  const [afterImg, setAfterImg] = useState<string>(SAMPLE_AFTER_SVG);

  // E-Consent Signature Canvas state
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [consentProcedure, setConsentProcedure] = useState('การผ่าตัดฟันคุด / ถอนฟันคุด (Surgical Tooth Extraction)');
  const [consentDoctor, setConsentDoctor] = useState('ทพ. มินตรา รัตนโชติ (หมอมิน)');
  const [consentSaving, setConsentSaving] = useState(false);

  // Medical Certificate / SSO 900B Form state
  const [certType, setCertType] = useState<'MEDICAL_CERT' | 'SSO_900' | 'REFERRAL'>('MEDICAL_CERT');
  const [certDiagnosis, setCertDiagnosis] = useState('โรคฟันผุและเหงือกอักเสบ (Dental Caries & Gingivitis)');
  const [certTreatment, setCertTreatment] = useState('ขูดหินปูนทั้งปาก และอุดฟันคอมโพสิตเรซิน');
  const [certRestDays, setCertRestDays] = useState('1');
  const [certAmount, setCertAmount] = useState('900');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      setUploading(true);
      try {
        await fetch(`/api/patients/${patient.id}/documents`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            category: docCategory,
            title: docTitle || file.name,
            fileUrl: dataUrl,
            fileType: file.type,
            fileSize: file.size,
          }),
        });
        setDocTitle('');
        onRefresh();
      } catch (err) {
        console.error(err);
      } finally {
        setUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddSampleXray = async () => {
    setUploading(true);
    try {
      await fetch(`/api/patients/${patient.id}/documents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: 'XRAY',
          title: `ฟิล์ม Panoramic X-Ray (${formatThaiDate(new Date())})`,
          fileUrl: SAMPLE_XRAY_SVG,
          fileType: 'image/svg+xml',
        }),
      });
      onRefresh();
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteDoc = async (docId: string) => {
    await fetch(`/api/patients/${patient.id}/documents?docId=${docId}`, {
      method: 'DELETE',
    });
    onRefresh();
  };

  // Signature Pad Handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const saveSignedConsent = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    setConsentSaving(true);
    try {
      await fetch(`/api/patients/${patient.id}/documents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: 'CONSENT_FORM',
          title: `ใบยินยอม: ${consentProcedure.split('(')[0]} (${formatThaiDate(new Date())})`,
          fileUrl: dataUrl,
          fileType: 'image/png',
        }),
      });
      clearSignature();
      onRefresh();
      setSubTab('gallery');
    } finally {
      setConsentSaving(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Sub-navigation Bar */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => setSubTab('gallery')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              subTab === 'gallery'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>1. คลังฟิล์ม X-Ray & เอกสารแนบ ({patient.documents?.length || 0})</span>
          </button>

          <button
            type="button"
            onClick={() => setSubTab('compare')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              subTab === 'compare'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>2. เปรียบเทียบภาพ Before / After</span>
          </button>

          <button
            type="button"
            onClick={() => setSubTab('consent')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              subTab === 'consent'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <PenTool className="w-4 h-4" />
            <span>3. เซ็นใบยินยอมดิจิทัล (E-Consent)</span>
          </button>

          <button
            type="button"
            onClick={() => setSubTab('certificate')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              subTab === 'certificate'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>4. พิมพ์ใบรับรองแพทย์ / ประกันสังคม 900฿</span>
          </button>
        </div>
      </div>

      {/* 1. X-RAY & DOCUMENT GALLERY */}
      {subTab === 'gallery' && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800">
                คลังภาพถ่ายช่องปาก ฟิล์ม X-Ray และเอกสารที่ลงนามแล้ว
              </h3>
              <p className="text-xs text-slate-500">
                รองรับการอัปโหลดภาพฟิล์ม Periapical, Panoramic, Cephalometric และรูปถ่ายช่องปาก
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs">
              <select
                value={docCategory}
                onChange={(e) => setDocCategory(e.target.value)}
                className="px-3 py-1.5 border border-slate-300 rounded-xl bg-white"
              >
                <option value="XRAY">ฟิล์ม X-Ray</option>
                <option value="INTRAORAL">ภาพถ่ายในช่องปาก (Intraoral)</option>
                <option value="CONSENT_FORM">ใบยินยอมรับการรักษา</option>
                <option value="OPD_CARD">OPD Card / เอกสารทั่วไป</option>
              </select>

              <input
                type="text"
                placeholder="ตั้งชื่อภาพ/ฟิล์ม..."
                value={docTitle}
                onChange={(e) => setDocTitle(e.target.value)}
                className="px-3 py-1.5 border border-slate-300 rounded-xl"
              />

              <label className="px-3.5 py-1.5 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-xl cursor-pointer flex items-center gap-1.5 shadow-sm">
                <Upload className="w-3.5 h-3.5" />
                <span>{uploading ? 'กำลังอัปโหลด...' : 'อัปโหลดไฟล์ภาพ'}</span>
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </label>

              <button
                type="button"
                onClick={handleAddSampleXray}
                disabled={uploading}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl"
              >
                + เพิ่มฟิล์ม X-Ray ตัวอย่าง
              </button>
            </div>
          </div>

          {(!patient.documents || patient.documents.length === 0) ? (
            <div className="py-12 text-center text-xs text-slate-400 italic">
              ยังไม่มีฟิล์ม X-Ray หรือเอกสารแนบ สามารถกดปุ่ม &ldquo;+ เพิ่มฟิล์ม X-Ray ตัวอย่าง&rdquo; หรืออัปโหลดรูปภาพได้ทันที
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {patient.documents.map((doc: any) => (
                <div
                  key={doc.id}
                  className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-50 flex flex-col justify-between group shadow-2xs"
                >
                  <div className="h-44 bg-slate-900 flex items-center justify-center overflow-hidden relative">
                    {doc.fileUrl ? (
                      <img
                        src={doc.fileUrl}
                        alt={doc.title}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <span className="text-xs text-slate-400">ไม่มีตัวอย่างภาพ</span>
                    )}
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-slate-900/80 text-sky-300 text-[10px] font-bold">
                      {doc.category}
                    </span>
                  </div>
                  <div className="p-3 flex items-center justify-between text-xs bg-white">
                    <div className="min-w-0">
                      <p className="font-bold text-slate-800 truncate">{doc.title}</p>
                      <p className="text-[10px] text-slate-400">
                        {formatThaiDate(doc.createdAt)} • โดย {doc.uploadedBy || 'คลินิก'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteDoc(doc.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                      title="ลบไฟล์"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 2. BEFORE / AFTER INTERACTIVE SLIDER */}
      {subTab === 'compare' && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-800">
                เปรียบเทียบภาพก่อนและหลังการรักษา (Before & After Smile Comparison)
              </h3>
              <p className="text-xs text-slate-500">
                เลื่อนแถบสไลด์ซ้าย-ขวาเพื่อเปรียบเทียบความเปลี่ยนแปลงของรอยยิ้ม จัดฟัน วีเนียร์ หรือฟอกสีฟัน
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <label className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl cursor-pointer">
                <span>เปลี่ยนภาพ Before</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) {
                      const r = new FileReader();
                      r.onload = () => setBeforeImg(r.result as string);
                      r.readAsDataURL(f);
                    }
                  }}
                />
              </label>
              <label className="px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 font-semibold rounded-xl cursor-pointer">
                <span>เปลี่ยนภาพ After</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) {
                      const r = new FileReader();
                      r.onload = () => setAfterImg(r.result as string);
                      r.readAsDataURL(f);
                    }
                  }}
                />
              </label>
            </div>
          </div>

          {/* Interactive Comparison Frame */}
          <div className="max-w-2xl mx-auto space-y-3">
            <div className="relative w-full h-80 rounded-2xl overflow-hidden border border-slate-300 shadow-inner select-none bg-slate-900">
              {/* After Image (Full layer underneath) */}
              <img
                src={afterImg}
                alt="After treatment"
                className="absolute inset-0 w-full h-full object-cover"
              />

              {/* Before Image (Clipped by slider percentage) */}
              <div
                className="absolute inset-y-0 left-0 overflow-hidden"
                style={{ width: `${sliderPos}%` }}
              >
                <img
                  src={beforeImg}
                  alt="Before treatment"
                  className="w-full h-full object-cover"
                  style={{ width: '672px', maxWidth: 'none' }}
                />
              </div>

              {/* Divider Line */}
              <div
                className="absolute inset-y-0 w-1 bg-white shadow-lg cursor-ew-resize flex items-center justify-center"
                style={{ left: `${sliderPos}%` }}
              >
                <div className="w-8 h-8 rounded-full bg-white text-slate-900 shadow-lg flex items-center justify-center font-bold text-xs border-2 border-sky-500">
                  ⇄
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 px-2">
              <span className="text-xs font-bold text-amber-700">ภาพก่อนทำ (Before)</span>
              <input
                type="range"
                min={5}
                max={95}
                value={sliderPos}
                onChange={(e) => setSliderPos(Number(e.target.value))}
                className="flex-1 accent-sky-600 cursor-pointer"
              />
              <span className="text-xs font-bold text-emerald-700">ภาพหลังทำ (After)</span>
            </div>
          </div>
        </div>
      )}

      {/* 3. E-CONSENT FORM & DIGITAL SIGNATURE PAD */}
      {subTab === 'consent' && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-5">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                <span>หนังสือให้ความยินยอมรับการรักษาทางทันตกรรม (Digital E-Consent)</span>
              </h3>
              <p className="text-xs text-slate-500">
                ให้คนไข้ตรวจสอบรายละเอียดและลงลายมือชื่อบนหน้าจอแท็บเล็ตหรือเมาส์เพื่อจัดเก็บเข้าเวชระเบียน
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">ประเภทหัตถการที่ขอความยินยอม</label>
              <select
                value={consentProcedure}
                onChange={(e) => setConsentProcedure(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white"
              >
                <option value="การผ่าตัดฟันคุด / ถอนฟันคุด (Surgical Tooth Extraction)">
                  1. การผ่าตัดฟันคุด / ถอนฟัน (Surgical Extraction)
                </option>
                <option value="การรักษาคลองรากฟัน (Endodontic Root Canal Treatment)">
                  2. การรักษาคลองรากฟัน (Root Canal Treatment)
                </option>
                <option value="การจัดฟันและติดเครื่องมือจัดฟัน (Orthodontic Treatment Agreement)">
                  3. ข้อตกลงและแผนการรักษาจัดฟัน (Orthodontic Agreement)
                </option>
                <option value="การฝังรากฟันเทียมและทันตกรรมประดิษฐ์ (Dental Implant & Prosthodontics)">
                  4. การฝังรากฟันเทียมและครอบฟัน (Dental Implant)
                </option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">ทันตแพทย์ผู้ให้คำอธิบาย</label>
              <input
                type="text"
                value={consentDoctor}
                onChange={(e) => setConsentDoctor(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl"
              />
            </div>
          </div>

          {/* Consent Legal Text Box */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-2 leading-relaxed">
            <p className="font-bold text-slate-900">
              ข้าพเจ้า {patient.title} {patient.firstNameTh} {patient.lastNameTh} (รหัสคนไข้: {patient.dn})
            </p>
            <p>
              ได้รับฟังคำอธิบายจาก <strong>{consentDoctor}</strong> เกี่ยวกับขั้นตอนการรักษา{' '}
              <strong className="text-indigo-700">{consentProcedure}</strong>{' '}
              รวมถึงทางเลือกในการรักษา ภาวะแทรกซ้อนที่อาจเกิดขึ้นได้ และข้อปฏิบัติตนหลังการรักษาอย่างชัดเจนแล้ว
            </p>
            <p>
              ข้าพเจ้าได้แจ้งประวัติการแพ้ยา ({patient.drugAllergies || 'ไม่มีประวัติแพ้ยา'}) และโรคประจำตัว (
              {patient.chronicDiseases || 'ไม่มี'}) ตามความเป็นจริงทุกประการ และยินยอมให้ทันตแพทย์ทำการรักษาตามมาตรฐานวิชาชีพ
            </p>
          </div>

          {/* Canvas Signature Area */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800">
                ✍️ ลงลายมือชื่อคนไข้ / ผู้ปกครองด้านล่าง (วาดลายเซ็นด้วยเมาส์หรือปากกาแท็บเล็ต)
              </span>
              <button
                type="button"
                onClick={clearSignature}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center gap-1"
              >
                <Eraser className="w-3.5 h-3.5" />
                <span>ล้างลายเซ็น</span>
              </button>
            </div>

            <div className="border-2 border-dashed border-indigo-300 rounded-2xl bg-indigo-50/30 p-2 flex flex-col items-center">
              <canvas
                ref={canvasRef}
                width={520}
                height={150}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                className="bg-white rounded-xl border border-slate-200 cursor-crosshair shadow-inner w-full max-w-[520px]"
              />
              <span className="text-[11px] text-slate-400 mt-1.5">
                ลงชื่อ ({patient.title} {patient.firstNameTh} {patient.lastNameTh}) • วันที่ {formatThaiDate(new Date(), true)}
              </span>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={saveSignedConsent}
              disabled={consentSaving}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5"
            >
              <FileCheck2 className="w-4 h-4" />
              <span>{consentSaving ? 'กำลังบันทึก...' : 'ยืนยันลงนามและแนบเข้าแฟ้มประวัติ'}</span>
            </button>
          </div>
        </div>
      )}

      {/* 4. 1-CLICK MEDICAL CERTIFICATE & SOCIAL SECURITY (ประกันสังคม 900 บาท) */}
      {subTab === 'certificate' && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4 no-print">
            <div className="flex gap-2 text-xs font-bold">
              <button
                type="button"
                onClick={() => setCertType('MEDICAL_CERT')}
                className={`px-3.5 py-1.5 rounded-xl border ${
                  certType === 'MEDICAL_CERT'
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                    : 'border-slate-200 text-slate-600'
                }`}
              >
                ใบรับรองแพทย์ (Medical Certificate)
              </button>
              <button
                type="button"
                onClick={() => setCertType('SSO_900')}
                className={`px-3.5 py-1.5 rounded-xl border ${
                  certType === 'SSO_900'
                    ? 'bg-sky-50 border-sky-300 text-sky-800'
                    : 'border-slate-200 text-slate-600'
                }`}
              >
                ใบเบิกทันตกรรมประกันสังคม (900 บาท/ปี)
              </button>
            </div>

            <button
              type="button"
              onClick={() => window.print()}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4" />
              <span>สั่งพิมพ์เอกสาร (Print A4)</span>
            </button>
          </div>

          {/* Form Controls (hidden on print) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200 no-print">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">การวินิจฉัยโรค (Diagnosis)</label>
              <input
                type="text"
                value={certDiagnosis}
                onChange={(e) => setCertDiagnosis(e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg bg-white"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">หัตถการที่ทำ (Treatment)</label>
              <input
                type="text"
                value={certTreatment}
                onChange={(e) => setCertTreatment(e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg bg-white"
              />
            </div>
            {certType === 'MEDICAL_CERT' ? (
              <div>
                <label className="block font-semibold text-slate-700 mb-1">จำนวนวันลาพักรักษาตัว (วัน)</label>
                <input
                  type="number"
                  value={certRestDays}
                  onChange={(e) => setCertRestDays(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg bg-white"
                />
              </div>
            ) : (
              <div>
                <label className="block font-semibold text-slate-700 mb-1">ยอดเบิกสิทธิประกันสังคม (บาท)</label>
                <input
                  type="number"
                  value={certAmount}
                  onChange={(e) => setCertAmount(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg bg-white font-mono font-bold"
                />
              </div>
            )}
          </div>

          {/* Printable Official Certificate Preview */}
          <div className="max-w-2xl mx-auto p-8 rounded-2xl border-2 border-slate-300 bg-white text-slate-900 space-y-6 shadow-sm">
            <div className="flex items-start justify-between border-b-2 border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-sky-600 text-white flex items-center justify-center font-bold">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-base font-black text-slate-900">
                    คลินิกทันตกรรมหมอมิน หมอพรีม (Min & Preem Dental Clinic)
                  </h2>
                  <p className="text-[11px] text-slate-600">
                    123/45 ถนนสุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพมหานคร 10110 • โทร 02-123-4567
                  </p>
                </div>
              </div>
              <div className="text-right text-xs">
                <span className="font-bold block text-sky-800">
                  {certType === 'MEDICAL_CERT'
                    ? 'ใบรับรองแพทย์ (Medical Certificate)'
                    : 'หนังสือรับรองการรับบริการทันตกรรม (ประกันสังคม)'}
                </span>
                <span className="text-[11px] text-slate-500">วันที่: {formatThaiDate(new Date(), true)}</span>
              </div>
            </div>

            <div className="space-y-3 text-xs leading-relaxed">
              <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-500">ชื่อ-นามสกุลผู้ป่วย: </span>
                  <strong>{patient.title} {patient.firstNameTh} {patient.lastNameTh}</strong>
                </div>
                <div>
                  <span className="text-slate-500">รหัสประจำตัว (DN): </span>
                  <strong className="font-mono">{patient.dn}</strong>
                </div>
                <div>
                  <span className="text-slate-500">เลขประจำตัวประชาชน: </span>
                  <strong className="font-mono">{patient.idCardNumber || '1-1005-01234-56-7'}</strong>
                </div>
                <div>
                  <span className="text-slate-500">สิทธิการรักษา: </span>
                  <strong>{certType === 'SSO_900' ? 'ประกันสังคม (มาตรา 33 / 39)' : patient.rights}</strong>
                </div>
              </div>

              <p>
                ขอรับรองว่าผู้ป่วยดังกล่าวได้มารับการตรวจและรักษาทางทันตกรรมที่{' '}
                <strong>คลินิกทันตกรรมหมอมิน หมอพรีม</strong> เมื่อวันที่{' '}
                <strong>{formatThaiDate(new Date(), true)}</strong> จริง โดยมีรายละเอียดดังนี้:
              </p>

              <div className="p-3.5 rounded-xl border border-slate-300 space-y-2">
                <div>
                  <span className="font-bold text-slate-700">ผลการวินิจฉัย (Diagnosis): </span>
                  <span>{certDiagnosis}</span>
                </div>
                <div>
                  <span className="font-bold text-slate-700">การรักษาที่ได้รับ (Treatment Performed): </span>
                  <span>{certTreatment}</span>
                </div>
                {certType === 'MEDICAL_CERT' ? (
                  <div>
                    <span className="font-bold text-slate-700">ความเห็นแพทย์ (Recommendation): </span>
                    <span>เห็นสมควรให้หยุดพักรักษาตัวเป็นเวลา <strong>{certRestDays} วัน</strong></span>
                  </div>
                ) : (
                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                    <span className="font-bold text-sky-900">
                      ยอดเบิกสิทธิทันตกรรมประกันสังคม (ขูด อุด ถอน ผ่าฟันคุด ไม่เกิน 900 บาท/ปี):
                    </span>
                    <span className="text-base font-black font-mono text-emerald-700">
                      {Number(certAmount).toLocaleString()} บาท
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-8 flex justify-between items-end text-xs">
              <div className="text-center space-y-1">
                <div className="w-44 border-b border-slate-400 pb-1"></div>
                <p className="text-slate-600">ลายมือชื่อผู้รับบริการ</p>
              </div>
              <div className="text-center space-y-1">
                <div className="w-52 border-b border-slate-400 pb-1"></div>
                <p className="font-bold text-slate-800">
                  ({patient.attendingDoctor?.fullName || 'ทพ. มินตรา รัตนโชติ'})
                </p>
                <p className="text-slate-500">
                  ทันตแพทย์ผู้ตรวจรักษา • เลขใบอนุญาต {patient.attendingDoctor?.licenseNo || 'ท.12458'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
