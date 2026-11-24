export type UserRole = 'ADMIN' | 'COUNTER' | 'DENTIST' | 'ASSISTANT' | 'FINANCE';

export interface SessionUser {
  id: string;
  username: string;
  fullName: string;
  role: UserRole;
  email?: string | null;
  phone?: string | null;
  branchId?: string | null;
  doctorId?: string | null;
  doctorNickname?: string | null;
}

export const ROLE_NAMES_TH: Record<UserRole, string> = {
  ADMIN: 'เจ้าของคลินิก / ผู้ดูแลระบบ',
  COUNTER: 'พนักงานหน้าเคาน์เตอร์',
  DENTIST: 'ทันตแพทย์',
  ASSISTANT: 'ผู้ช่วยทันตแพทย์',
  FINANCE: 'ฝ่ายการเงิน / แคชเชียร์',
};

export const MENU_PERMISSIONS: Record<string, UserRole[]> = {
  queue: ['ADMIN', 'COUNTER', 'DENTIST', 'ASSISTANT', 'FINANCE'],
  appointments: ['ADMIN', 'COUNTER', 'DENTIST', 'ASSISTANT'],
  patients: ['ADMIN', 'COUNTER', 'DENTIST', 'ASSISTANT'],
  emr: ['ADMIN', 'DENTIST', 'ASSISTANT'],
  billing: ['ADMIN', 'COUNTER', 'FINANCE'],
  ortho: ['ADMIN', 'COUNTER', 'DENTIST'],
  lab: ['ADMIN', 'DENTIST', 'ASSISTANT', 'COUNTER'],
  inventory: ['ADMIN', 'COUNTER', 'ASSISTANT', 'FINANCE'],
  reports: ['ADMIN', 'FINANCE', 'DENTIST'],
  settings: ['ADMIN', 'COUNTER', 'FINANCE'],
};

export function canAccessMenu(role: UserRole, menuKey: string): boolean {
  const allowed = MENU_PERMISSIONS[menuKey];
  if (!allowed) return true;
  return allowed.includes(role);
}
