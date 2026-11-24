'use client';

import React, { useState, useEffect } from 'react';
import { Package, PlusCircle, AlertTriangle, ArrowUpDown, History, Search } from 'lucide-react';
import { formatThaiDateTime, formatCurrency } from '@/lib/utils';

export default function InventoryPage() {
  const [items, setItems] = useState<any[]>([]);
  const [movements, setMovements] = useState<any[]>([]);
  const [category, setCategory] = useState('all');
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // New Item Modal
  const [isNewItemModalOpen, setIsNewItemModalOpen] = useState(false);
  const [newCode, setNewCode] = useState('');
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState('DRUG');
  const [newUnit, setNewUnit] = useState('แผง');
  const [newMinStock, setNewMinStock] = useState('10');
  const [newInitialStock, setNewInitialStock] = useState('50');
  const [newCost, setNewCost] = useState('0');
  const [newPrice, setNewPrice] = useState('0');

  // Stock Movement Modal
  const [activeItemForMove, setActiveItemForMove] = useState<any | null>(null);
  const [movementType, setMovementType] = useState('RECEIVE');
  const [moveQty, setMoveQty] = useState('');
  const [moveReason, setMoveReason] = useState('');
  const [moveLoading, setMoveLoading] = useState(false);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const q = new URLSearchParams();
      if (category !== 'all') q.set('category', category);
      if (lowStockOnly) q.set('lowStock', 'true');
      if (search) q.set('search', search);

      const [iRes, mRes] = await Promise.all([
        fetch(`/api/inventory/items?${q.toString()}`),
        fetch('/api/inventory/movements'),
      ]);

      const iData = await iRes.json();
      const mData = await mRes.json();

      setItems(iData.items || []);
      setMovements(mData.movements || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, [category, lowStockOnly, search]);

  const handleCreateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode || !newName || !newUnit) return;
    try {
      const res = await fetch('/api/inventory/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: newCode,
          name: newName,
          category: newCategory,
          unit: newUnit,
          minStockAlert: Number(newMinStock),
          currentStock: Number(newInitialStock),
          costPrice: Number(newCost),
          salePrice: Number(newPrice),
        }),
      });
      if (res.ok) {
        setIsNewItemModalOpen(false);
        setNewCode('');
        setNewName('');
        fetchInventory();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleProcessMovement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeItemForMove || !moveQty) return;
    setMoveLoading(true);
    try {
      const res = await fetch('/api/inventory/movements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemId: activeItemForMove.id,
          movementType,
          qty: Number(moveQty),
          reason: moveReason,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setActiveItemForMove(null);
      setMoveQty('');
      setMoveReason('');
      fetchInventory();
    } catch (err: any) {
      alert(err.message || 'Movement failed');
    } finally {
      setMoveLoading(false);
    }
  };

  const lowStockCount = items.filter((i) => i.currentStock <= i.minStockAlert).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Package className="w-5 h-5 text-emerald-600" />
            <span>คลังยา เวชภัณฑ์ และวัสดุทันตกรรม</span>
          </h1>
          <p className="text-xs text-slate-500">
            ควบคุมสต๊อกสินค้า จุดสั่งซื้อ (Reorder Point) บันทึกรับเข้า เบิกใช้ ปรับยอด และประวัติเคลื่อนไหว
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsNewItemModalOpen(true)}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-md shadow-emerald-600/20 flex items-center gap-1.5"
        >
          <PlusCircle className="w-4 h-4" />
          <span>+ เพิ่มรายการใหม่</span>
        </button>
      </div>

      {/* Low Stock Alert Banner */}
      {lowStockCount > 0 && (
        <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl flex items-center justify-between text-xs text-amber-900">
          <div className="flex items-center gap-2 font-bold">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <span>แจ้งเตือน: มีรายการสินค้า {lowStockCount} รายการ ที่ยอดคงเหลือต่ำกว่าจุดสั่งซื้อขั้นต่ำ (Reorder Point)</span>
          </div>
          <button
            type="button"
            onClick={() => setLowStockOnly(!lowStockOnly)}
            className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg text-xs"
          >
            {lowStockOnly ? 'แสดงสินค้าทั้งหมด' : 'กรองดูเฉพาะสินค้าใกล้หมด'}
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="ค้นหารหัส หรือชื่อสินค้า/ยา..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-3 py-1.5 text-xs border border-slate-300 rounded-xl bg-white"
          >
            <option value="all">ทุกหมวดหมู่</option>
            <option value="DRUG">ยาและเวชภัณฑ์ (Drug)</option>
            <option value="DENTAL_SUPPLY">วัสดุทำฟัน (Dental Supply)</option>
            <option value="CONSUMABLE">ของใช้สิ้นเปลือง (Consumable)</option>
            <option value="RETAIL">สินค้าขายหน้าร้าน (Retail)</option>
          </select>
        </div>
      </div>

      {/* Items Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs divide-y divide-slate-200">
            <thead className="bg-slate-50 font-bold text-slate-600">
              <tr>
                <th className="px-4 py-3">รหัส</th>
                <th className="px-4 py-3">ชื่อรายการยา/วัสดุ</th>
                <th className="px-4 py-3">หมวดหมู่</th>
                <th className="px-4 py-3">หน่วย</th>
                <th className="px-4 py-3 text-center">จุดเตือนสั่งซื้อ</th>
                <th className="px-4 py-3 text-right">ยอดคงเหลือ</th>
                <th className="px-4 py-3 text-right">ราคาทุน</th>
                <th className="px-4 py-3 text-right">ราคาขาย</th>
                <th className="px-4 py-3 text-right">การจัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    กำลังโหลดคลังเวชภัณฑ์...
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400 italic">
                    ไม่พบรายการสินค้าตามเงื่อนไข
                  </td>
                </tr>
              ) : (
                items.map((item) => {
                  const isLow = item.currentStock <= item.minStockAlert;
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3 font-mono font-bold text-slate-700 whitespace-nowrap">
                        {item.code}
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-900">
                        {item.name}
                        {isLow && (
                          <span className="ml-2 px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                            ใกล้หมด
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-slate-500">
                        {item.category === 'DRUG' ? 'ยา' : item.category === 'DENTAL_SUPPLY' ? 'วัสดุทำฟัน' : 'ของใช้'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-slate-600">
                        {item.unit}
                      </td>
                      <td className="px-4 py-3 text-center font-mono text-slate-500">
                        {item.minStockAlert}
                      </td>
                      <td className="px-4 py-3 text-right font-mono font-bold text-sm whitespace-nowrap">
                        <span className={isLow ? 'text-rose-600' : 'text-slate-900'}>
                          {item.currentStock}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-slate-500 whitespace-nowrap">
                        {formatCurrency(item.costPrice)}
                      </td>
                      <td className="px-4 py-3 text-right font-mono font-semibold text-slate-800 whitespace-nowrap">
                        {item.salePrice > 0 ? formatCurrency(item.salePrice) : '-'}
                      </td>
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => {
                            setActiveItemForMove(item);
                            setMovementType('RECEIVE');
                          }}
                          className="px-3 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold rounded-lg text-[11px] border border-emerald-200 inline-flex items-center gap-1"
                        >
                          <ArrowUpDown className="w-3 h-3" />
                          <span>รับ/เบิก/ปรับยอด</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Movement History */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 space-y-3">
        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
          <History className="w-4 h-4 text-slate-500" />
          <span>ประวัติความเคลื่อนไหวสต๊อกล่าสุด (Recent Stock Movements)</span>
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs divide-y divide-slate-200">
            <thead className="bg-slate-50 font-bold text-slate-600">
              <tr>
                <th className="px-3 py-2">วันและเวลา</th>
                <th className="px-3 py-2">สินค้า</th>
                <th className="px-3 py-2 text-center">ประเภทรายการ</th>
                <th className="px-3 py-2 text-right">จำนวน</th>
                <th className="px-3 py-2 text-right">คงเหลือหลังทำ</th>
                <th className="px-3 py-2">เหตุผล / การอ้างอิง</th>
                <th className="px-3 py-2 text-right">ผู้ทำรายการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {movements.slice(0, 10).map((m) => (
                <tr key={m.id}>
                  <td className="px-3 py-2 text-slate-500 whitespace-nowrap">{formatThaiDateTime(m.createdAt)}</td>
                  <td className="px-3 py-2 font-semibold text-slate-800">{m.item?.name}</td>
                  <td className="px-3 py-2 text-center whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      m.movementType === 'RECEIVE' ? 'bg-emerald-100 text-emerald-800' :
                      m.movementType === 'PROCEDURE_USE' ? 'bg-sky-100 text-sky-800' :
                      m.movementType === 'DISPENSE' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {m.movementType === 'RECEIVE' ? 'รับเข้า' : m.movementType === 'PROCEDURE_USE' ? 'ตัดใช้ตามหัตถการ' : m.movementType === 'DISPENSE' ? 'เบิกใช้' : m.movementType}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-right font-mono font-bold">
                    <span className={m.qty > 0 ? 'text-emerald-700' : 'text-rose-700'}>
                      {m.qty > 0 ? `+${m.qty}` : m.qty}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-right font-mono font-bold text-slate-800">{m.balanceAfter}</td>
                  <td className="px-3 py-2 text-slate-600 max-w-xs truncate">{m.reason}</td>
                  <td className="px-3 py-2 text-right text-slate-500 whitespace-nowrap">{m.performedBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stock Movement Modal */}
      {activeItemForMove && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-800">
              บันทึกความเคลื่อนไหวสต๊อก: {activeItemForMove.name}
            </h3>
            <p className="text-xs text-slate-500">
              ยอดคงเหลือปัจจุบัน: <strong>{activeItemForMove.currentStock} {activeItemForMove.unit}</strong>
            </p>

            <form onSubmit={handleProcessMovement} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">ประเภทการทำรายการ</label>
                <select
                  value={movementType}
                  onChange={(e) => setMovementType(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white"
                >
                  <option value="RECEIVE">+ รับเข้าคลัง (Receive)</option>
                  <option value="DISPENSE">- เบิกจ่ายใช้งาน (Dispense)</option>
                  <option value="RETURN">+ คืนของเข้าสต๊อก (Return)</option>
                  <option value="ADJUST">ปรับยอดให้ตรงกับความเป็นจริง (Adjust)</option>
                  <option value="COUNT">ตรวจนับสต๊อกจริง (Physical Count)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {movementType === 'ADJUST' || movementType === 'COUNT' ? 'ยอดตรวจนับได้จริง (ใหม่)' : 'จำนวน (ชิ้น/หน่วย)'} *
                </label>
                <input
                  type="number"
                  placeholder="ระบุจำนวน..."
                  value={moveQty}
                  onChange={(e) => setMoveQty(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono text-base font-bold text-slate-900"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">เหตุผลในการทำรายการ</label>
                <input
                  type="text"
                  placeholder="เช่น ซื้อเพิ่มจากบริษัทผู้แทน, เบิกใช้ห้องตรวจ 1..."
                  value={moveReason}
                  onChange={(e) => setMoveReason(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setActiveItemForMove(null)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={moveLoading}
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-sm"
                >
                  {moveLoading ? 'กำลังบันทึก...' : 'บันทึกความเคลื่อนไหว'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Item Modal */}
      {isNewItemModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-lg p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-800">เพิ่มรายการสินค้า / ยาใหม่เข้าคลัง</h3>
            <form onSubmit={handleCreateItem} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">รหัสสินค้า (Item Code) *</label>
                  <input
                    type="text"
                    placeholder="เช่น MED-004, MAT-006"
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">หมวดหมู่</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="DRUG">ยาและเวชภัณฑ์ (Drug)</option>
                    <option value="DENTAL_SUPPLY">วัสดุทำฟัน (Dental Supply)</option>
                    <option value="CONSUMABLE">ของใช้สิ้นเปลือง (Consumable)</option>
                    <option value="RETAIL">สินค้าขายหน้าร้าน (Retail)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">ชื่อรายการ *</label>
                <input
                  type="text"
                  placeholder="เช่น Amoxicillin 500mg, Composite A3..."
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">หน่วยนับ *</label>
                  <input
                    type="text"
                    placeholder="เช่น แผง, กล่อง, หลอด"
                    value={newUnit}
                    onChange={(e) => setNewUnit(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-center"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">จุดเตือนสั่งซื้อ (Min)</label>
                  <input
                    type="number"
                    value={newMinStock}
                    onChange={(e) => setNewMinStock(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-center font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">ยอดเริ่มต้น</label>
                  <input
                    type="number"
                    value={newInitialStock}
                    onChange={(e) => setNewInitialStock(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-center font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">ราคาทุน (บาท)</label>
                  <input
                    type="number"
                    value={newCost}
                    onChange={(e) => setNewCost(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">ราคาขาย (บาท)</label>
                  <input
                    type="number"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setIsNewItemModalOpen(false)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-sm"
                >
                  บันทึกสินค้าใหม่
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
