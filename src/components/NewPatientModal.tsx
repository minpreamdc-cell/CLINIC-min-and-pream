'use client';

import React, { useState } from 'react';
import { X, UserPlus, AlertTriangle, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (patient: any) => void;
  doctors: any[];
}

export default function NewPatientModal({ isOpen, onClose, onSuccess, doctors }: Props) {
  const [formData, setFormData] = useState({
    title: 'คุณ',
    firstNameTh: '',
    lastNameTh: '',
    firstNameEn: '',
    lastNameEn: '',
    phone: '',
    birthDate: '',
    gender: 'FEMALE',
    idCardNumber: '',
    rights: 'จ่ายเอง',
    attendingDoctorId: doctors[0]?.id || '',
    drugAllergies: '',
    chronicDiseases: '',
    currentMedications: '',
    marketingSource: 'Walk-in',
    notes: '',
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [duplicateWarning, setDuplicateWarning] = useState<any[] | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (duplicateWarning) setDuplicateWarning(null);
  };

  const submitPatient = async (force: boolean = false) => {
    if (!formData.firstNameTh || !formData.lastNameTh || !formData.phone) {
      setErrorMsg('กรุณากรอกชื่อ นามสกุล และเบอร์โทรศัพท์');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          force,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        if (data.isWarning && data.duplicates) {
          setDuplicateWarning(data.duplicates);
          return;
        }
        throw new Error(data.error || 'บันทึกคนไข้ใหม่ไม่สำเร็จ');
      }

      onSuccess(data.patient);
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
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">ลงทะเบียนคนไข้ใหม่</h3>
              <p className="text-xs text-slate-500">สร้างแฟ้มประวัติเวชระเบียนและเลขประจำตัวคนไข้ (DN)</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-200 text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {duplicateWarning && duplicateWarning.length > 0 && (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-2">
              <div className="flex items-center gap-2 font-bold text-amber-800">
                <AlertTriangle className="w-4 h-4" />
                <span>เตือน: พบคนไข้ที่มีชื่อหรือเบอร์โทรตรงกันในระบบ!</span>
              </div>
              <div className="space-y-1">
                {duplicateWarning.map((d) => (
                  <div key={d.id} className="p-2 bg-white/80 rounded-lg border border-amber-200">
                    <span className="font-bold">{d.firstNameTh} {d.lastNameTh}</span> ({d.dn}) - เบอร์โทร {d.phone}
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-amber-700">
                หากคนไข้ท่านนี้เป็นคนละท่านกับข้อมูลข้างต้น ท่านสามารถกดยืนยันเพื่อลงทะเบียนต่อได้
              </p>
              <div className="pt-1 flex gap-2">
                <button
                  type="button"
                  onClick={() => submitPatient(true)}
                  className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs shadow-sm"
                >
                  ยืนยันลงทะเบียนคนไข้ใหม่ (สร้างต่อ)
                </button>
                <button
                  type="button"
                  onClick={() => setDuplicateWarning(null)}
                  className="px-3 py-1.5 rounded-lg bg-white border border-amber-300 text-amber-800 text-xs"
                >
                  ตรวจทานข้อมูลอีกครั้ง
                </button>
              </div>
            </div>
          )}

          {/* Name & Title */}
          <div className="grid grid-cols-4 gap-3">
            <div className="col-span-1">
              <label className="block text-xs font-semibold text-slate-700 mb-1">คำนำหน้า</label>
              <select
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white"
              >
                <option value="คุณ">คุณ</option>
                <option value="นาย">นาย</option>
                <option value="นาง">นาง</option>
                <option value="นางสาว">นางสาว</option>
                <option value="ด.ช.">ด.ช.</option>
                <option value="ด.ญ.">ด.ญ.</option>
              </select>
            </div>
            <div className="col-span-3 grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">ชื่อจริง (ภาษาไทย) *</label>
                <input
                  type="text"
                  name="firstNameTh"
                  value={formData.firstNameTh}
                  onChange={handleChange}
                  placeholder="เช่น มินตรา"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">นามสกุล (ภาษาไทย) *</label>
                <input
                  type="text"
                  name="lastNameTh"
                  value={formData.lastNameTh}
                  onChange={handleChange}
                  placeholder="เช่น รัตนเวชกุล"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                  required
                />
              </div>
            </div>
          </div>

          {/* English Name */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">ชื่อ (อังกฤษ)</label>
              <input
                type="text"
                name="firstNameEn"
                value={formData.firstNameEn}
                onChange={handleChange}
                placeholder="เช่น Mintra"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">นามสกุล (อังกฤษ)</label>
              <input
                type="text"
                name="lastNameEn"
                value={formData.lastNameEn}
                onChange={handleChange}
                placeholder="เช่น Rattanavej"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
              />
            </div>
          </div>

          {/* Contact & Birthday */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">เบอร์โทรศัพท์หลัก *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="เช่น 0891234567"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">วัน/เดือน/ปีเกิด</label>
              <input
                type="date"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">เพศ</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white"
              >
                <option value="FEMALE">หญิง</option>
                <option value="MALE">ชาย</option>
                <option value="OTHER">อื่นๆ</option>
              </select>
            </div>
          </div>

          {/* CLINICAL SAFETY SECTION: Drug allergies in red alert styling */}
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-rose-800 font-bold text-xs">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              <span>ข้อมูลความปลอดภัยทางการแพทย์ (Medical Alerts)</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-rose-900 mb-1">
                  ประวัติแพ้ยา (หากมีให้ระบุชัดเจน)
                </label>
                <input
                  type="text"
                  name="drugAllergies"
                  value={formData.drugAllergies}
                  onChange={handleChange}
                  placeholder="เช่น แพ้ยา Penicillin, Sulfa, แอสไพริน..."
                  className="w-full px-3 py-1.5 text-xs border border-rose-300 rounded-lg focus:ring-2 focus:ring-rose-500 bg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-amber-900 mb-1">
                  โรคประจำตัว
                </label>
                <input
                  type="text"
                  name="chronicDiseases"
                  value={formData.chronicDiseases}
                  onChange={handleChange}
                  placeholder="เช่น ความดันโลหิตสูง, เบาหวาน, โรคหัวใจ..."
                  className="w-full px-3 py-1.5 text-xs border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 bg-white"
                />
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-700 mb-1">
                ยาที่รับประทานประจำในปัจจุบัน
              </label>
              <input
                type="text"
                name="currentMedications"
                value={formData.currentMedications}
                onChange={handleChange}
                placeholder="เช่น ยาละลายลิ่มเลือด Warfarin, ยาลดความดัน..."
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
              />
            </div>
          </div>

          {/* Rights & Attending Doctor */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">สิทธิการรักษา</label>
              <select
                name="rights"
                value={formData.rights}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white"
              >
                <option value="จ่ายเอง">จ่ายเอง (Self-pay)</option>
                <option value="ประกันสังคม (สปส.)">ประกันสังคม (สปส.) 900฿</option>
                <option value="สปสช. (บัตรทอง)">สปสช. (บัตรทอง)</option>
                <option value="ประกันคู่สัญญา">ประกันคู่สัญญา / บริษัท</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">ทันตแพทย์ประจำ</label>
              <select
                name="attendingDoctorId"
                value={formData.attendingDoctorId}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white"
              >
                <option value="">-- ไม่ระบุ --</option>
                {doctors.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.fullName} ({d.nickname})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">แหล่งที่รู้จักคลินิก</label>
              <select
                name="marketingSource"
                value={formData.marketingSource}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white"
              >
                <option value="Walk-in">Walk-in หน้าร้าน</option>
                <option value="เพื่อน/คนรู้จักแนะนำ">เพื่อน/คนรู้จักแนะนำ</option>
                <option value="Facebook">Facebook</option>
                <option value="TikTok">TikTok</option>
                <option value="Google Map / Search">Google Map / Search</option>
                <option value="Instagram">Instagram</option>
              </select>
            </div>
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
              type="button"
              onClick={() => submitPatient(false)}
              disabled={loading}
              className="px-5 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-xl shadow-md shadow-sky-600/20"
            >
              {loading ? 'กำลังบันทึก...' : 'บันทึกคนไข้ใหม่'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
