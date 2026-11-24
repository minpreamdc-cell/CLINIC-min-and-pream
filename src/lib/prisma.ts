import { PrismaClient } from '@prisma/client';

const CLOUDFLARE_D1_GATEWAY_URL =
  process.env.CLOUDFLARE_BACKUP_WORKER_URL ||
  'https://min-and-pream-cloud-backup.minpream-dental.workers.dev';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Model name mapping to exact SQLite/D1 table names
const MODEL_TO_TABLE: Record<string, string> = {
  Branch: 'Branch',
  User: 'User',
  Doctor: 'Doctor',
  Room: 'Room',
  DoctorSchedule: 'DoctorSchedule',
  BlockedSlot: 'BlockedSlot',
  ClinicSetting: 'ClinicSetting',
  Patient: 'Patient',
  AppointmentType: 'AppointmentType',
  Appointment: 'Appointment',
  Visit: 'Visit',
  MedicalRecord: 'MedicalRecord',
  ToothCondition: 'ToothCondition',
  TreatmentPlan: 'TreatmentPlan',
  PrescriptionItem: 'PrescriptionItem',
  TreatmentItem: 'TreatmentItem',
  Invoice: 'Invoice',
  Payment: 'Payment',
  Receipt: 'Receipt',
  Deposit: 'Deposit',
  DoctorFeePayment: 'DoctorFeePayment',
  InsuranceClaim: 'InsuranceClaim',
  OrthoPackage: 'OrthoPackage',
  PatientOrthoPackage: 'PatientOrthoPackage',
  OrthoInstallment: 'OrthoInstallment',
  OrthoAdjustmentLog: 'OrthoAdjustmentLog',
  LabOrder: 'LabOrder',
  InventoryItem: 'InventoryItem',
  InventoryStock: 'InventoryStock',
  InventoryMovement: 'InventoryMovement',
  ProcedureStockLink: 'ProcedureStockLink',
  DailyClose: 'DailyClose',
  PatientDocument: 'PatientDocument',
  ProcedureCatalog: 'ProcedureCatalog',
  DiagnosisCatalog: 'DiagnosisCatalog',
  AuditLog: 'AuditLog',
};

// Synchronize any created/updated record directly into Cloudflare D1 in real-time
async function syncRowToCloudflareD1(tableName: string, record: any) {
  if (!record || typeof record !== 'object' || !record.id) return;
  try {
    // Keep only scalar columns (exclude nested relation objects/arrays)
    const keys = Object.keys(record).filter((k) => {
      const v = record[k];
      if (v === null || v === undefined) return true;
      if (v instanceof Date) return true;
      return typeof v !== 'object';
    });

    if (keys.length === 0) return;

    const cols = keys.map((k) => `"${k}"`).join(', ');
    const placeholders = keys.map(() => '?').join(', ');
    const params = keys.map((k) => {
      const v = record[k];
      if (v === null || v === undefined) return null;
      if (typeof v === 'boolean') return v ? 1 : 0;
      if (v instanceof Date) return v.toISOString();
      return v;
    });

    const sql = `INSERT OR REPLACE INTO "${tableName}" (${cols}) VALUES (${placeholders})`;
    await fetch(`${CLOUDFLARE_D1_GATEWAY_URL}/d1/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sql, params }),
    });
  } catch (err) {
    // Non-blocking background sync to Cloudflare D1
    console.warn('Cloudflare D1 real-time sync warning:', err);
  }
}

async function deleteRowFromCloudflareD1(tableName: string, id: string) {
  if (!id) return;
  try {
    await fetch(`${CLOUDFLARE_D1_GATEWAY_URL}/d1/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sql: `DELETE FROM "${tableName}" WHERE "id" = ?`,
        params: [id],
      }),
    });
  } catch {}
}

function createPrismaClient() {
  const client = new PrismaClient({
    log: ['error', 'warn'],
  });

  // Real-time Write-Through Middleware to Cloudflare D1 (min-and-pream-clinic-db)
  client.$use(async (params, next) => {
    const result = await next(params);
    const tableName = params.model ? MODEL_TO_TABLE[params.model] : undefined;

    if (tableName && result) {
      if (
        params.action === 'create' ||
        params.action === 'update' ||
        params.action === 'upsert'
      ) {
        // Fire-and-forget real-time sync to Cloudflare D1
        syncRowToCloudflareD1(tableName, result);
      } else if (params.action === 'delete' && result?.id) {
        deleteRowFromCloudflareD1(tableName, result.id);
      }
    }
    return result;
  });

  return client;
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
