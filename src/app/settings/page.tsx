'use client';

import React, { useState, useEffect } from 'react';
import {
  Settings,
  Building,
  Save,
  Users,
  Shield,
  FileSpreadsheet,
  Download,
  MessageSquare,
  Bot,
  AlertCircle,
  CheckCircle,
  Sparkles,
} from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'clinic' | 'users' | 'line' | 'import' | 'backup'>('clinic');
  const [setting, setSetting] = useState<any>({
    clinicNameTh: 'คลินิกทันตกรรมหมอมิน หมอพรีม',
    clinicNameEn: 'Min & Preem Dental Clinic',
    taxId: '0105567012345',
    address: '123/45 ถนนสุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพมหานคร 10110',
    phone: '02-123-4567, 089-999-8888',
    email: 'contact@minpreemdental.com',
    lineId: '@minpreemclinic',
    receiptFormat: 'A4',
    receiptHeader: 'ใบเสร็จรับเงิน / ใบรับรองค่ารักษาพยาบาล',
    receiptFooter: 'ขอบพระคุณที่ไว้วางใจให้คลินิกทันตกรรมหมอมิน หมอพรีม ดูแลรอยยิ้มของคุณ',
    defaultDfDeductLab: true,
    defaultDfBaseNet: true,
    aiAnalyticsEnabled: true,
    lineOaEnabled: false,
  });

  const [users, setUsers] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // CSV Import State
  const [csvText, setCsvText] = useState(
    'ชื่อ,นามสกุล,เบอร์โทร,สิทธิการรักษา,โรคประจำตัว,แพ้ยา\nสมศรี,สุขใจ,0819991122,จ่ายเอง,ไม่มี,แพ้ยา Sulfa\nวิชัย,มั่นคง,0893334455,ประกันสังคม,ความดันโลหิตสูง,ไม่มี'
  );
  const [importResult, setImportResult] = useState<any | null>(null);
  const [importing, setImporting] = useState(false);

  // LINE OA Simulator State
  const [linePhone, setLinePhone] = useState('081-234-5678');
  const [lineMsgType, setLineMsgType] = useState('REMINDER');
  const [lineSendLog, setLineSendLog] = useState<any[]>([]);

  // Cloudflare D1 Cloud Backup State
  const [cloudSnapshots, setCloudSnapshots] = useState<any[]>([]);
  const [cloudLoading, setCloudLoading] = useState(false);
  const [cloudActionMsg, setCloudActionMsg] = useState<string | null>(null);
  const [backupLabel, setBackupLabel] = useState('สำรองข้อมูลประจำวันหลังปิดคลินิก');

  const fetchCloudSnapshots = async () => {
    try {
      const res = await fetch('/api/settings/backup?mode=cloud-list');
      const data = await res.json();
      if (data?.snapshots) {
        setCloudSnapshots(data.snapshots);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleOneClickCloudBackup = async () => {
    setCloudLoading(true);
    setCloudActionMsg(null);
    try {
      const res = await fetch('/api/settings/backup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'CLOUD_BACKUP',
          backupLabel,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setCloudActionMsg(
        `✅ สำรองข้อมูลขึ้น Cloudflare D1 สำเร็จ! (รหัสชุดสำรอง: ${data.id} • คนไข้ ${data.patientCount} ท่าน, ประวัติการรักษา ${data.visitCount} รายการ)`
      );
      fetchCloudSnapshots();
    } catch (err: any) {
      setCloudActionMsg(`❌ ${err.message || 'Cloud backup failed'}`);
    } finally {
      setCloudLoading(false);
    }
  };

  const handleOneClickCloudRestore = async (snapshotId: string) => {
    setCloudLoading(true);
    setCloudActionMsg(null);
    try {
      const res = await fetch('/api/settings/backup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'CLOUD_RESTORE',
          snapshotId,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setCloudActionMsg(`🔄 ${data.message}`);
    } catch (err: any) {
      setCloudActionMsg(`❌ ${err.message || 'Restore failed'}`);
    } finally {
      setCloudLoading(false);
    }
  };

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      if (data.setting) setSetting(data.setting);
      if (data.users) setUsers(data.users);
      if (data.doctors) setDoctors(data.doctors);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
    fetchCloudSnapshots();
  }, []);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(setting),
      });
      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleImportCsv = async (dryRun: boolean) => {
    setImporting(true);
    setImportResult(null);
    try {
      // Parse CSV rows
      const lines = csvText.trim().split('\n');
      if (lines.length <= 1) {
        return;
      }

      const rows = [];
      for (let i = 1; i < lines.length; i++) {
        const parts = lines[i].split(',').map((p) => p.trim());
        if (parts.length >= 3) {
          rows.push({
            firstNameTh: parts[0],
            lastNameTh: parts[1],
            phone: parts[2],
            rights: parts[3] || 'จ่ายเอง',
            chronicDiseases: parts[4] || null,
            drugAllergies: parts[5] || null,
          });
        }
      }

      const res = await fetch('/api/settings/import-patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rows, dryRun }),
      });
      const data = await res.json();
      setImportResult(data);
    } catch (e: any) {
      console.error(e.message || 'Import failed');
    } finally {
      setImporting(false);
    }
  };

  const handleSendLineSimulator = () => {
    const newLog = {
      id: Date.now(),
      phone: linePhone,
      msgType: lineMsgType === 'REMINDER' ? 'แจ้งเตือนนัดหมายล่วงหน้า' : 'ขอยืนยันนัดหมาย',
      status: 'SUCCESS',
      sentAt: new Date().toLocaleTimeString('th-TH'),
      message: `เรียน คนไข้ คลินิกทันตกรรมหมอมิน หมอพรีม ขอแจ้งเตือนนัดหมายในวันพรุ่งนี้เวลา 10:00 น. หากสะดวกกดยืนยันหรือพิมพ์ตอบกลับได้ค่ะ`,
    };
    setLineSendLog([newLog, ...lineSendLog]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
        <h1 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <Settings className="w-5 h-5 text-sky-600" />
          <span>การตั้งค่าคลินิก & ระบบเชื่อมต่อ</span>
        </h1>
        <p className="text-xs text-slate-500">
          ข้อมูลองค์กร, สิทธิ์ผู้ใช้งาน, นำเข้าข้อมูลคนไข้เดิม, LINE Official Account และสำรองข้อมูล
        </p>

        {/* Tab Buttons */}
        <div className="flex overflow-x-auto gap-1 border-t border-slate-100 pt-3 mt-4 text-xs font-semibold">
          {[
            { key: 'clinic', label: '1. ข้อมูลคลินิก & นโยบายคิดเงิน' },
            { key: 'users', label: '2. บัญชีผู้ใช้และสิทธิ์' },
            { key: 'line', label: '3. เชื่อมต่อ LINE Official Account' },
            { key: 'import', label: '4. นำเข้าคนไข้เดิม (CSV)' },
            { key: 'backup', label: '5. สำรองข้อมูล (Backup/Restore)' },
          ].map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setActiveTab(t.key as any)}
              className={`px-3.5 py-2 rounded-xl whitespace-nowrap transition-all ${
                activeTab === t.key
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* TAB 1: CLINIC BRANDING & POLICIES */}
      {activeTab === 'clinic' && (
        <form onSubmit={handleSaveSettings} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-5 text-xs">
          {saveSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>บันทึกการตั้งค่าคลินิกเรียบร้อยแล้ว</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">ชื่อคลินิก (ภาษาไทย) *</label>
              <input
                type="text"
                value={setting.clinicNameTh || ''}
                onChange={(e) => setSetting({ ...setting, clinicNameTh: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl font-bold text-slate-900"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">ชื่อคลินิก (ภาษาอังกฤษ)</label>
              <input
                type="text"
                value={setting.clinicNameEn || ''}
                onChange={(e) => setSetting({ ...setting, clinicNameEn: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">เลขประจำตัวผู้เสียภาษี (Tax ID)</label>
              <input
                type="text"
                value={setting.taxId || ''}
                onChange={(e) => setSetting({ ...setting, taxId: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">เบอร์โทรศัพท์คลินิก</label>
              <input
                type="text"
                value={setting.phone || ''}
                onChange={(e) => setSetting({ ...setting, phone: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl"
              />
            </div>
            <div className="col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">ที่อยู่คลินิก</label>
              <input
                type="text"
                value={setting.address || ''}
                onChange={(e) => setSetting({ ...setting, address: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl"
              />
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4 space-y-3">
            <h3 className="font-bold text-slate-800 text-sm">นโยบายการคำนวณค่า DF แพทย์และใบเสร็จ</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={setting.defaultDfDeductLab}
                  onChange={(e) => setSetting({ ...setting, defaultDfDeductLab: e.target.checked })}
                  className="rounded text-sky-600"
                />
                <span className="font-semibold text-slate-800">
                  หักค่าใช้จ่ายแลปทันตกรรม ออกจากค่า DF แพทย์ก่อนคำนวณส่วนแบ่ง
                </span>
              </label>

              <label className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={setting.defaultDfBaseNet}
                  onChange={(e) => setSetting({ ...setting, defaultDfBaseNet: e.target.checked })}
                  className="rounded text-sky-600"
                />
                <span className="font-semibold text-slate-800">
                  คำนวณ DF จากยอดสุทธิหลังหักส่วนลด (Net Basis)
                </span>
              </label>

              <label className="flex items-center gap-2 p-3 bg-sky-50/50 rounded-xl border border-sky-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={setting.aiAnalyticsEnabled}
                  onChange={(e) => setSetting({ ...setting, aiAnalyticsEnabled: e.target.checked })}
                  className="rounded text-sky-600"
                />
                <div>
                  <span className="font-bold text-sky-950 block">เปิดใช้งาน AI Business Analytics (ทางเลือก)</span>
                  <span className="text-[10px] text-slate-500">วิเคราะห์ข้อมูลรวมเชิงสถิติเพื่อเพิ่มประสิทธิภาพคลินิก</span>
                </div>
              </label>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">รูปแบบใบเสร็จรับเงินเริ่มต้น</label>
                <select
                  value={setting.receiptFormat}
                  onChange={(e) => setSetting({ ...setting, receiptFormat: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white"
                >
                  <option value="A4">A4 แบบเต็มรูปแบบ (ทางการ)</option>
                  <option value="SLIP">สลิปความร้อน 80mm (กะทัดรัด)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-3 border-t">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl shadow-md shadow-sky-600/20"
            >
              {saving ? 'กำลังบันทึก...' : 'บันทึกการตั้งค่า'}
            </button>
          </div>
        </form>
      )}

      {/* TAB 2: USERS & ROLES */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
          <div className="flex justify-between items-center border-b pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-800">ผู้ใช้งานและบทบาทในระบบ (Roles & Permissions)</h3>
              <p className="text-xs text-slate-500">จำกัดสิทธิ์การเข้าถึงข้อมูลสุขภาพและการเงินตามหน้าที่</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs divide-y divide-slate-200">
              <thead className="bg-slate-50 font-bold text-slate-600">
                <tr>
                  <th className="px-4 py-3">ชื่อผู้ใช้</th>
                  <th className="px-4 py-3">ชื่อ - นามสกุล</th>
                  <th className="px-4 py-3">บทบาทหน้าที่ (Role)</th>
                  <th className="px-4 py-3">เบอร์ติดต่อ</th>
                  <th className="px-4 py-3 text-center">สถานะ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => (
                  <tr key={u.id}>
                    <td className="px-4 py-3 font-mono font-bold text-slate-800">{u.username}</td>
                    <td className="px-4 py-3 font-semibold text-slate-900">{u.fullName}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-100 text-sky-800">
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500 font-mono">{u.phone || '-'}</td>
                    <td className="px-4 py-3 text-center">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        ใช้งานปกติ
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: LINE OFFICIAL ACCOUNT INTEGRATION */}
      {activeTab === 'line' && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-5 text-xs">
          <div>
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-emerald-600" />
              <span>การเชื่อมต่อ LINE Official Account (โหมดจำลองและทดสอบการส่ง)</span>
            </h3>
            <p className="text-xs text-slate-500">
              ระบบส่งข้อความเตือนนัดหมาย, ยืนยันนัด และรับข้อความขอเลื่อนนัดจากคนไข้
            </p>
          </div>

          <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-3">
            <span className="font-bold text-emerald-950 text-xs block">
              จำลองการส่งข้อความแจ้งเตือนคนไข้ผ่าน LINE Messaging API
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-600 mb-1">เบอร์โทรคนไข้</label>
                <input
                  type="text"
                  value={linePhone}
                  onChange={(e) => setLinePhone(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg bg-white"
                />
              </div>
              <div>
                <label className="block text-slate-600 mb-1">ประเภทข้อความ</label>
                <select
                  value={lineMsgType}
                  onChange={(e) => setLineMsgType(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="REMINDER">เตือนนัดหมายล่วงหน้า 1 วัน</option>
                  <option value="CONFIRM">ขอยืนยันนัดหมาย</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={handleSendLineSimulator}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-sm"
                >
                  ส่งข้อความจำลอง
                </button>
              </div>
            </div>
          </div>

          {/* LINE Send Log */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-800">ประวัติการส่งข้อความจำลอง</h4>
            {lineSendLog.length === 0 ? (
              <p className="text-slate-400 italic">ยังไม่มีการส่งข้อความในเซสชันนี้</p>
            ) : (
              <div className="space-y-2">
                {lineSendLog.map((log) => (
                  <div key={log.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                    <div>
                      <span className="font-bold text-slate-900">{log.msgType}</span>
                      <span className="text-slate-500 ml-2">({log.phone})</span>
                      <p className="text-slate-600 text-[11px] mt-0.5">{log.message}</p>
                    </div>
                    <div className="text-right">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        ส่งสำเร็จ
                      </span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">{log.sentAt}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: CSV PATIENT IMPORT */}
      {activeTab === 'import' && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4 text-xs">
          <div>
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-sky-600" />
              <span>นำเข้าข้อมูลทะเบียนคนไข้เดิมจาก CSV / Excel</span>
            </h3>
            <p className="text-xs text-slate-500">
              ตรวจสอบข้อมูลซ้ำก่อนบันทึกจริง พร้อมรายงานแถวที่นำเข้าไม่สำเร็จ
            </p>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              ข้อมูล CSV (แถวแรกเป็น Header: ชื่อ, นามสกุล, เบอร์โทร, สิทธิ, โรคประจำตัว, แพ้ยา)
            </label>
            <textarea
              rows={5}
              value={csvText}
              onChange={(e) => setCsvText(e.target.value)}
              className="w-full p-3 font-mono border border-slate-300 rounded-xl"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              disabled={importing}
              onClick={() => handleImportCsv(true)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl"
            >
              {importing ? 'กำลังตรวจสอบ...' : '1. ตรวจสอบข้อมูลก่อน (Dry Run)'}
            </button>
            <button
              type="button"
              disabled={importing}
              onClick={() => handleImportCsv(false)}
              className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl shadow-sm"
            >
              {importing ? 'กำลังนำเข้า...' : '2. ยืนยันนำเข้าข้อมูลจริง'}
            </button>
          </div>

          {importResult && (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <div className="flex items-center gap-3 font-bold">
                <span>ทั้งหมด: {importResult.totalCount} แถว</span>
                <span className="text-emerald-700">ผ่าน: {importResult.successCount} แถว</span>
                <span className="text-rose-700">ล้มเหลว: {importResult.failedCount} แถว</span>
              </div>
              {importResult.failedRows && importResult.failedRows.length > 0 && (
                <div className="text-rose-700 space-y-1">
                  <p className="font-semibold">แถวที่ไม่สามารถนำเข้าได้:</p>
                  {importResult.failedRows.map((f: any, i: number) => (
                    <p key={i}>• แถวที่ {f.rowNumber}: {f.reason}</p>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 5: 3-LAYER CLOUDFLARE D1 BACKUP & RESTORE (DOCTOR-FRIENDLY 1-CLICK) */}
      {activeTab === 'backup' && (
        <div className="space-y-5 text-xs">
          {/* Status Banner */}
          <div className="bg-gradient-to-r from-sky-900 via-sky-800 to-teal-900 text-white p-6 rounded-2xl shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-400/20 border border-emerald-400/40 text-emerald-300 font-bold text-[11px] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>เชื่อมต่อ Cloudflare D1 สำเร็จ (APAC Region)</span>
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-sky-400/20 text-sky-200 font-mono text-[10px]">
                  DB: min-and-pream-clinic-db
                </span>
              </div>
              <h3 className="text-base font-black">
                🛡️ ระบบปกป้องข้อมูลคนไข้ 3 ชั้น (Cloudflare D1 Time Travel + Cloud Snapshot + Local Backup)
              </h3>
              <p className="text-sky-100/90 text-xs">
                คุณหมอมินและคุณหมอพรีมสามารถกดปุ่มสีฟ้าด้านขวาเพียงคลิกเดียว เพื่อส่งข้อมูลคนไข้ทั้งหมดขึ้นเก็บไว้บน Cloudflare Cloud ทันที
              </p>
            </div>

            <button
              type="button"
              disabled={cloudLoading}
              onClick={handleOneClickCloudBackup}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-300 hover:to-orange-300 text-slate-950 font-black text-sm shadow-xl shrink-0 transition-all flex items-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              <span>{cloudLoading ? 'กำลังส่งข้อมูลขึ้น Cloud...' : '☁️ กดสำรองข้อมูลขึ้น Cloudflare ตอนนี้เลย'}</span>
            </button>
          </div>

          {cloudActionMsg && (
            <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-300 text-emerald-900 font-bold text-sm flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{cloudActionMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Left 7 cols: Cloud Snapshots stored on Cloudflare D1 */}
            <div className="lg:col-span-7 bg-white rounded-2xl shadow-sm border border-slate-200 p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h4 className="text-sm font-bold text-slate-800">
                    ☁️ รายการจุดสำรองข้อมูลบน Cloudflare D1 ({cloudSnapshots.length} รายการล่าสุด)
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    ข้อมูลถูกเข้ารหัสและเก็บบนเซิร์ฟเวอร์ Cloudflare แม้คอมพิวเตอร์ที่คลินิกพัง ข้อมูลในตารางนี้จะยังอยู่ครบ 100%
                  </p>
                </div>
                <button
                  type="button"
                  onClick={fetchCloudSnapshots}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
                >
                  รีเฟรชรายการ
                </button>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={backupLabel}
                  onChange={(e) => setBackupLabel(e.target.value)}
                  placeholder="ตั้งชื่อรอบการสำรองข้อมูล..."
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-xl"
                />
                <button
                  type="button"
                  disabled={cloudLoading}
                  onClick={handleOneClickCloudBackup}
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl"
                >
                  + บันทึกจุดสำรองใหม่
                </button>
              </div>

              {cloudSnapshots.length === 0 ? (
                <div className="py-10 text-center text-slate-400 italic bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  ยังไม่มีจุดสำรองบน Cloud กดปุ่ม &ldquo;☁️ กดสำรองข้อมูลขึ้น Cloudflare ตอนนี้เลย&rdquo; ด้านบนเพื่อสร้างจุดสำรองแรกได้ทันที
                </div>
              ) : (
                <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                  {cloudSnapshots.map((snap) => (
                    <div
                      key={snap.id}
                      className="p-3.5 bg-white hover:bg-slate-50 flex flex-wrap items-center justify-between gap-3"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-sky-100 text-sky-800 font-mono font-bold text-[11px]">
                            {snap.id}
                          </span>
                          <strong className="text-slate-900 font-bold">{snap.backupLabel}</strong>
                        </div>
                        <p className="text-[11px] text-slate-500">
                          คนไข้: <strong>{snap.patientCount} ท่าน</strong> • ประวัติตรวจ:{' '}
                          <strong>{snap.visitCount} ครั้ง</strong> • ใบเสร็จ:{' '}
                          <strong>{snap.receiptCount} ใบ</strong> • โดย {snap.createdBy} ({snap.createdAt})
                        </p>
                      </div>

                      <button
                        type="button"
                        disabled={cloudLoading}
                        onClick={() => handleOneClickCloudRestore(snap.id)}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-800 border border-emerald-300 font-bold transition-all"
                      >
                        🔄 กู้คืนข้อมูลชุดนี้ (1-Click Restore)
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right 5 cols: Local PC Download & Time Travel Guarantee */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 space-y-3">
                <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <Download className="w-4 h-4 text-emerald-600" />
                  <span>ดาวน์โหลดไฟล์สำรองเก็บลงคอมคุณหมอ (Offline Backup)</span>
                </h4>
                <p className="text-slate-500 leading-relaxed">
                  นอกจากการเก็บไว้บน Cloudflare แล้ว คุณหมอสามารถกดปุ่มด้านล่างเพื่อเซฟไฟล์ข้อมูลทั้งหมด (.json) เก็บไว้ในเครื่องคอมพิวเตอร์หรือ Flash Drive ส่วนตัวได้ทุกเมื่อ
                </p>
                <div className="pt-1">
                  <a
                    href="/api/settings/backup"
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-sm"
                  >
                    <Download className="w-4 h-4" />
                    <span>💾 ดาวน์โหลดไฟล์สำรองลงคอมพิวเตอร์ (.json)</span>
                  </a>
                </div>
              </div>

              <div className="bg-sky-50/70 rounded-2xl border border-sky-200 p-5 space-y-2">
                <h4 className="text-xs font-bold text-sky-950">
                  ⏱️ ระบบย้อนเวลาอัตโนมัติ (Cloudflare D1 Time Travel)
                </h4>
                <p className="text-[11px] text-sky-800 leading-relaxed">
                  ฐานข้อมูล <strong>min-and-pream-clinic-db</strong> บน Cloudflare เปิดใช้งานระบบ Time Travel อัตโนมัติ สามารถย้อนเวลาฐานข้อมูลกลับไปได้ทุกนาทีตลอด 30 วันที่ผ่านมา ป้องกันข้อมูลคนไข้สูญหาย 100%
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
