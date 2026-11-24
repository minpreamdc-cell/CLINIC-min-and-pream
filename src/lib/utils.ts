export function formatCurrency(amount: number | null | undefined): string {
  if (amount === null || amount === undefined || isNaN(amount)) return '0.00 ฿';
  return new Intl.NumberFormat('th-TH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount) + ' ฿';
}

export function formatNumber(amount: number | null | undefined): string {
  if (amount === null || amount === undefined || isNaN(amount)) return '0';
  return new Intl.NumberFormat('th-TH').format(amount);
}

const THAI_MONTHS_SHORT = [
  'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
  'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.',
];

const THAI_MONTHS_FULL = [
  'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
  'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม',
];

const THAI_DAYS = [
  'วันอาทิตย์', 'วันจันทร์', 'วันอังคาร', 'วันพุธ', 'วันพฤหัสบดี', 'วันศุกร์', 'วันเสาร์',
];

export function getTodayThaiDateString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatThaiDate(dateInput: string | Date | null | undefined, full: boolean = false): string {
  if (!dateInput) return '-';
  const d = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (isNaN(d.getTime())) return '-';

  const day = d.getDate();
  const monthIdx = d.getMonth();
  const yearBE = d.getFullYear() + 543;

  if (full) {
    const dayName = THAI_DAYS[d.getDay()];
    const monthName = THAI_MONTHS_FULL[monthIdx];
    return `${dayName}ที่ ${day} ${monthName} พ.ศ. ${yearBE}`;
  }

  const monthName = THAI_MONTHS_SHORT[monthIdx];
  return `${day} ${monthName} ${yearBE}`;
}

export function formatThaiDateTime(dateInput: string | Date | null | undefined): string {
  if (!dateInput) return '-';
  const d = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (isNaN(d.getTime())) return '-';

  const dateStr = formatThaiDate(d, false);
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${dateStr} ${hours}:${minutes} น.`;
}

// FDI Dental Tooth Chart Helpers
// Permanent teeth: Quadrant 1 (18-11), Q2 (21-28), Q3 (31-38), Q4 (41-48)
// Primary (Deciduous) teeth: Q5 (55-51), Q6 (61-65), Q7 (71-75), Q8 (81-85)

export const PERMANENT_TEETH_UPPER = [
  ['18', '17', '16', '15', '14', '13', '12', '11'],
  ['21', '22', '23', '24', '25', '26', '27', '28'],
];

export const PERMANENT_TEETH_LOWER = [
  ['48', '47', '46', '45', '44', '43', '42', '41'],
  ['31', '32', '33', '34', '35', '36', '37', '38'],
];

export const PRIMARY_TEETH_UPPER = [
  ['55', '54', '53', '52', '51'],
  ['61', '62', '63', '64', '65'],
];

export const PRIMARY_TEETH_LOWER = [
  ['85', '84', '83', '82', '81'],
  ['71', '72', '73', '74', '75'],
];

export const TOOTH_CONDITIONS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  NORMAL: { label: 'ปกติ', color: '#16a34a', bg: '#dcfce7' },
  CARIES: { label: 'ฟันผุ (Caries)', color: '#dc2626', bg: '#fee2e2' },
  FILLING: { label: 'อุดฟันแล้ว (Filling)', color: '#2563eb', bg: '#dbeafe' },
  CROWN: { label: 'ครอบฟัน (Crown)', color: '#9333ea', bg: '#f3e8ff' },
  MISSING: { label: 'ฟันหลุด/ถอนแล้ว (Missing)', color: '#64748b', bg: '#f1f5f9' },
  EXTRACTION_NEEDED: { label: 'ต้องถอน/ผ่าคุด (Extraction)', color: '#ea580c', bg: '#ffedd5' },
  ROOT_CANAL: { label: 'รักษารากฟัน (RCT)', color: '#b91c1c', bg: '#ffe4e6' },
  IMPLANT: { label: 'รากฟันเทียม (Implant)', color: '#0891b2', bg: '#cffafe' },
  VENEER: { label: 'วีเนียร์ (Veneer)', color: '#059669', bg: '#ecfdf5' },
};
