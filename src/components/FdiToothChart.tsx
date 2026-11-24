'use client';

import React, { useState } from 'react';
import {
  PERMANENT_TEETH_UPPER,
  PERMANENT_TEETH_LOWER,
  PRIMARY_TEETH_UPPER,
  PRIMARY_TEETH_LOWER,
  TOOTH_CONDITIONS_CONFIG,
  formatThaiDateTime,
} from '@/lib/utils';
import { Plus, History, Check } from 'lucide-react';

interface Props {
  patientId: string;
  toothConditions: any[];
  onConditionAdded?: () => void;
  readOnly?: boolean;
}

export default function FdiToothChart({
  patientId,
  toothConditions = [],
  onConditionAdded,
  readOnly = false,
}: Props) {
  const [activeTab, setActiveTab] = useState<'PERMANENT' | 'PRIMARY'>('PERMANENT');
  const [selectedTooth, setSelectedTooth] = useState<string | null>(null);
  const [selectedCondition, setSelectedCondition] = useState<string>('CARIES');
  const [selectedSurfaces, setSelectedSurfaces] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  // Group latest condition by tooth number
  const latestByTooth: Record<string, any> = {};
  for (const tc of toothConditions) {
    if (!latestByTooth[tc.toothNumber]) {
      latestByTooth[tc.toothNumber] = tc;
    }
  }

  const toggleSurface = (surf: string) => {
    if (selectedSurfaces.includes(surf)) {
      setSelectedSurfaces(selectedSurfaces.filter((s) => s !== surf));
    } else {
      setSelectedSurfaces([...selectedSurfaces, surf]);
    }
  };

  const handleSaveCondition = async () => {
    if (!selectedTooth) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/patients/${patientId}/tooth-chart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toothNumber: selectedTooth,
          conditionType: selectedCondition,
          surfaces: selectedSurfaces.join(''),
          notes,
        }),
      });
      if (res.ok) {
        setNotes('');
        setSelectedSurfaces([]);
        if (onConditionAdded) onConditionAdded();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const renderToothBox = (toothNo: string) => {
    const latest = latestByTooth[toothNo];
    const isSelected = selectedTooth === toothNo;
    const config = latest ? TOOTH_CONDITIONS_CONFIG[latest.conditionType] : null;

    return (
      <button
        key={toothNo}
        type="button"
        onClick={() => setSelectedTooth(toothNo)}
        className={`flex flex-col items-center justify-between p-1.5 w-11 h-14 rounded-lg border text-center transition-all ${
          isSelected
            ? 'ring-2 ring-sky-500 border-sky-500 bg-sky-50'
            : latest
            ? 'border-slate-300'
            : 'border-slate-200 hover:border-slate-400 bg-white'
        }`}
        style={latest ? { backgroundColor: config?.bg, borderColor: config?.color } : {}}
      >
        <span className="text-[10px] font-bold text-slate-700">{toothNo}</span>
        {latest ? (
          <div className="w-full flex flex-col items-center">
            <span
              className="text-[9px] font-bold px-1 rounded leading-none"
              style={{ color: config?.color }}
            >
              {latest.conditionType === 'CARIES'
                ? 'ผุ'
                : latest.conditionType === 'FILLING'
                ? 'อุด'
                : latest.conditionType === 'CROWN'
                ? 'ครอบ'
                : latest.conditionType === 'MISSING'
                ? 'ถอน'
                : latest.conditionType === 'ROOT_CANAL'
                ? 'ราก'
                : latest.conditionType.slice(0, 3)}
            </span>
            {latest.surfaces && (
              <span className="text-[8px] text-slate-600 font-mono mt-0.5">
                {latest.surfaces}
              </span>
            )}
          </div>
        ) : (
          <span className="text-[9px] text-slate-300">ปกติ</span>
        )}
      </button>
    );
  };

  // Selected tooth history
  const selectedToothHistory = selectedTooth
    ? toothConditions.filter((tc) => tc.toothNumber === selectedTooth)
    : [];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
      {/* Header & Tabs */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <h4 className="text-sm font-bold text-slate-800">
            ผังฟันระบบสากล FDI (Dental Chart)
          </h4>
          <p className="text-xs text-slate-500">
            คลิกที่ซี่ฟันเพื่อดูประวัติ บันทึกรอยโรค หรือระบุด้านฟัน
          </p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('PERMANENT')}
            className={`px-3 py-1 rounded-lg transition-all ${
              activeTab === 'PERMANENT'
                ? 'bg-white text-sky-800 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ฟันแท้ (Permanent 32 ซี่)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('PRIMARY')}
            className={`px-3 py-1 rounded-lg transition-all ${
              activeTab === 'PRIMARY'
                ? 'bg-white text-sky-800 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ฟันน้ำนม (Primary 20 ซี่)
          </button>
        </div>
      </div>

      {/* Teeth Grid */}
      <div className="p-4 bg-slate-50/70 rounded-xl border border-slate-200 overflow-x-auto">
        {activeTab === 'PERMANENT' ? (
          <div className="space-y-4 min-w-[700px]">
            {/* Upper Jaw (Q1 & Q2) */}
            <div>
              <div className="flex justify-between text-[11px] font-semibold text-slate-400 mb-1 px-2">
                <span>ขวาบน (Q1: 18 - 11)</span>
                <span className="text-slate-600 font-bold">ฟันบน (Maxillary)</span>
                <span>ซ้ายบน (Q2: 21 - 28)</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <div className="flex gap-1">
                  {PERMANENT_TEETH_UPPER[0].map(renderToothBox)}
                </div>
                <div className="w-0.5 h-12 bg-slate-300"></div>
                <div className="flex gap-1">
                  {PERMANENT_TEETH_UPPER[1].map(renderToothBox)}
                </div>
              </div>
            </div>

            {/* Midline horizontal separator */}
            <div className="w-full border-t-2 border-dashed border-slate-300 relative my-2">
              <span className="absolute left-1/2 -top-2.5 -translate-x-1/2 bg-slate-200 text-slate-600 text-[10px] px-2 rounded-full font-bold">
                Midline
              </span>
            </div>

            {/* Lower Jaw (Q4 & Q3) */}
            <div>
              <div className="flex items-center justify-center gap-2">
                <div className="flex gap-1">
                  {PERMANENT_TEETH_LOWER[0].map(renderToothBox)}
                </div>
                <div className="w-0.5 h-12 bg-slate-300"></div>
                <div className="flex gap-1">
                  {PERMANENT_TEETH_LOWER[1].map(renderToothBox)}
                </div>
              </div>
              <div className="flex justify-between text-[11px] font-semibold text-slate-400 mt-1 px-2">
                <span>ขวาล่าง (Q4: 48 - 41)</span>
                <span className="text-slate-600 font-bold">ฟันล่าง (Mandibular)</span>
                <span>ซ้ายล่าง (Q3: 31 - 38)</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4 min-w-[500px]">
            {/* Primary Upper */}
            <div>
              <div className="flex justify-between text-[11px] font-semibold text-slate-400 mb-1 px-2">
                <span>ขวาบน (Q5: 55 - 51)</span>
                <span className="text-slate-600 font-bold">ฟันน้ำนมบน</span>
                <span>ซ้ายบน (Q6: 61 - 65)</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <div className="flex gap-1">
                  {PRIMARY_TEETH_UPPER[0].map(renderToothBox)}
                </div>
                <div className="w-0.5 h-12 bg-slate-300"></div>
                <div className="flex gap-1">
                  {PRIMARY_TEETH_UPPER[1].map(renderToothBox)}
                </div>
              </div>
            </div>

            <div className="w-full border-t-2 border-dashed border-slate-300 relative my-2"></div>

            {/* Primary Lower */}
            <div>
              <div className="flex items-center justify-center gap-2">
                <div className="flex gap-1">
                  {PRIMARY_TEETH_LOWER[0].map(renderToothBox)}
                </div>
                <div className="w-0.5 h-12 bg-slate-300"></div>
                <div className="flex gap-1">
                  {PRIMARY_TEETH_LOWER[1].map(renderToothBox)}
                </div>
              </div>
              <div className="flex justify-between text-[11px] font-semibold text-slate-400 mt-1 px-2">
                <span>ขวาล่าง (Q8: 85 - 81)</span>
                <span className="text-slate-600 font-bold">ฟันน้ำนมล่าง</span>
                <span>ซ้ายล่าง (Q7: 71 - 75)</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-600 pt-2 border-t border-slate-100">
        <span className="font-semibold text-slate-700">สัญลักษณ์:</span>
        {Object.entries(TOOTH_CONDITIONS_CONFIG).map(([key, cfg]) => (
          <div key={key} className="flex items-center gap-1.5 px-2 py-0.5 rounded-full border" style={{ borderColor: cfg.color, backgroundColor: cfg.bg }}>
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cfg.color }}></span>
            <span className="font-medium" style={{ color: cfg.color }}>{cfg.label}</span>
          </div>
        ))}
      </div>

      {/* Interactive Selected Tooth Panel */}
      {selectedTooth && (
        <div className="p-4 bg-sky-50/50 rounded-xl border border-sky-200 mt-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-sky-600 text-white flex items-center justify-center font-bold text-xs">
                {selectedTooth}
              </span>
              <h5 className="text-xs font-bold text-sky-950">
                รายละเอียดฟันซี่ {selectedTooth}
              </h5>
            </div>
            <button
              type="button"
              onClick={() => setSelectedTooth(null)}
              className="text-xs text-slate-500 hover:text-slate-800"
            >
              ปิดแผง
            </button>
          </div>

          {!readOnly && (
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Condition Selector */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    สภาวะ / รอยโรค (Condition)
                  </label>
                  <select
                    value={selectedCondition}
                    onChange={(e) => setSelectedCondition(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                  >
                    {Object.entries(TOOTH_CONDITIONS_CONFIG).map(([key, cfg]) => (
                      <option key={key} value={key}>
                        {cfg.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Surface Selector Buttons */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    ด้านฟันที่เกี่ยวข้อง (Surfaces)
                  </label>
                  <div className="flex gap-1.5">
                    {[
                      { key: 'M', label: 'M (Mesial)' },
                      { key: 'O', label: 'O (Occlusal)' },
                      { key: 'D', label: 'D (Distal)' },
                      { key: 'B', label: 'B (Buccal)' },
                      { key: 'L', label: 'L (Lingual)' },
                    ].map((surf) => {
                      const isSel = selectedSurfaces.includes(surf.key);
                      return (
                        <button
                          key={surf.key}
                          type="button"
                          onClick={() => toggleSurface(surf.key)}
                          className={`px-2 py-1 text-[11px] font-bold rounded-lg border transition-all ${
                            isSel
                              ? 'bg-sky-600 text-white border-sky-600 shadow-sm'
                              : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          {surf.key}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div>
                <input
                  type="text"
                  placeholder="บันทึกรายละเอียดเพิ่มเติมสำหรับซี่นี้..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveCondition}
                  disabled={saving}
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-sm flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{saving ? 'กำลังบันทึก...' : 'บันทึกประวัติซี่ฟันนี้'}</span>
                </button>
              </div>
            </div>
          )}

          {/* History of this tooth */}
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-2">
              <History className="w-3.5 h-3.5 text-slate-400" />
              <span>ประวัติการตรวจและรักษาของฟันซี่ {selectedTooth}</span>
            </div>
            {selectedToothHistory.length === 0 ? (
              <p className="text-xs text-slate-400 italic">ยังไม่มีประวัติบันทึกสำหรับซี่นี้</p>
            ) : (
              <div className="space-y-1.5">
                {selectedToothHistory.map((hist) => {
                  const cfg = TOOTH_CONDITIONS_CONFIG[hist.conditionType];
                  return (
                    <div
                      key={hist.id}
                      className="p-2.5 rounded-lg bg-white border border-slate-200 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="px-2 py-0.5 rounded text-[11px] font-bold"
                          style={{ backgroundColor: cfg?.bg, color: cfg?.color }}
                        >
                          {cfg?.label || hist.conditionType}
                        </span>
                        {hist.surfaces && (
                          <span className="font-mono text-slate-600 font-bold">
                            ด้าน: {hist.surfaces}
                          </span>
                        )}
                        {hist.notes && <span className="text-slate-500">- {hist.notes}</span>}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {formatThaiDateTime(hist.recordedAt)} ({hist.recordedByName || 'ทันตแพทย์'})
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
