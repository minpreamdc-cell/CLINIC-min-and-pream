export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

const CLOUDFLARE_BACKUP_WORKER_URL =
  process.env.CLOUDFLARE_BACKUP_WORKER_URL ||
  'https://min-and-pream-cloud-backup.minpream-dental.workers.dev';

async function buildFullClinicBackupPayload(backupLabel?: string, createdBy?: string) {
  const [
    branches,
    users,
    doctors,
    rooms,
    setting,
    patients,
    appointments,
    visits,
    medicalRecords,
    toothConditions,
    treatmentPlans,
    prescriptionItems,
    treatmentItems,
    invoices,
    payments,
    receipts,
    deposits,
    orthoPackages,
    patientOrthoPackages,
    labOrders,
    inventoryItems,
    dailyCloses,
    patientDocuments,
  ] = await Promise.all([
    prisma.branch.findMany(),
    prisma.user.findMany({
      select: { id: true, username: true, fullName: true, role: true, email: true, phone: true },
    }),
    prisma.doctor.findMany(),
    prisma.room.findMany(),
    prisma.clinicSetting.findMany(),
    prisma.patient.findMany(),
    prisma.appointment.findMany(),
    prisma.visit.findMany(),
    prisma.medicalRecord.findMany(),
    prisma.toothCondition.findMany(),
    prisma.treatmentPlan.findMany(),
    prisma.prescriptionItem.findMany(),
    prisma.treatmentItem.findMany(),
    prisma.invoice.findMany(),
    prisma.payment.findMany(),
    prisma.receipt.findMany(),
    prisma.deposit.findMany(),
    prisma.orthoPackage.findMany(),
    prisma.patientOrthoPackage.findMany(),
    prisma.labOrder.findMany(),
    prisma.inventoryItem.findMany(),
    prisma.dailyClose.findMany(),
    prisma.patientDocument.findMany(),
  ]);

  return {
    clinic: 'คลินิกทันตกรรมหมอมิน หมอพรีม (Min & Preem Dental Clinic)',
    backupLabel: backupLabel || 'สำรองข้อมูลคลินิกเต็มรูปแบบ',
    createdBy: createdBy || 'ทพ. มินตรา (หมอมิน)',
    exportedAt: new Date().toISOString(),
    version: '2.0.0-cloudflare-d1',
    data: {
      branches,
      users,
      doctors,
      rooms,
      setting,
      patients,
      appointments,
      visits,
      medicalRecords,
      toothConditions,
      treatmentPlans,
      prescriptionItems,
      treatmentItems,
      invoices,
      payments,
      receipts,
      deposits,
      orthoPackages,
      patientOrthoPackages,
      labOrders,
      inventoryItems,
      dailyCloses,
      patientDocuments,
    },
  };
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const mode = searchParams.get('mode');

    // Mode 1: List cloud snapshots from Cloudflare D1 Worker
    if (mode === 'cloud-list') {
      const cfRes = await fetch(`${CLOUDFLARE_BACKUP_WORKER_URL}/snapshots`, {
        cache: 'no-store',
      });
      const cfData = await cfRes.json();
      return NextResponse.json({
        ...cfData,
        workerUrl: CLOUDFLARE_BACKUP_WORKER_URL,
      });
    }

    // Mode 2: Direct file download (.json) to Doctor's computer
    const user = await getCurrentUser();
    const backupData = await buildFullClinicBackupPayload(
      'ดาวน์โหลดเก็บลงเครื่องคอมพิวเตอร์คุณหมอ',
      user?.fullName || 'ทพ. มินตรา (หมอมิน)'
    );

    return new NextResponse(JSON.stringify(backupData, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="minpreem_clinic_backup_${
          new Date().toISOString().split('T')[0]
        }.json"`,
      },
    });
  } catch (error: any) {
    console.error('Backup GET error:', error);
    return NextResponse.json({ error: error.message || 'Failed to create backup' }, { status: 500 });
  }
}

// POST: 1-Click Push Backup to Cloudflare D1 OR Restore Patient Data
export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    const body = await req.json().catch(() => ({}));
    const action = body.action || 'CLOUD_BACKUP';

    if (action === 'CLOUD_BACKUP') {
      const payload = await buildFullClinicBackupPayload(
        body.backupLabel || `สำรองข้อมูลคลินิก (${new Date().toLocaleTimeString('th-TH')} น.)`,
        user?.fullName || 'ทพ. มินตรา (หมอมิน)'
      );

      const cfRes = await fetch(`${CLOUDFLARE_BACKUP_WORKER_URL}/backup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const cfData = await cfRes.json();
      if (!cfRes.ok) {
        throw new Error(cfData.error || 'Cloudflare D1 backup failed');
      }

      await prisma.auditLog.create({
        data: {
          userId: user?.id,
          userName: user?.fullName || 'ทพ. มินตรา',
          action: 'CLOUDFLARE_D1_BACKUP',
          entityType: 'CloudBackupSnapshot',
          entityId: cfData.id,
          details: `สำรองข้อมูลขึ้น Cloudflare D1 สำเร็จ (คนไข้ ${cfData.patientCount} ราย, การรักษา ${cfData.visitCount} ครั้ง)`,
        },
      });

      return NextResponse.json({
        success: true,
        ...cfData,
      });
    }

    // Action: RESTORE from Cloud Snapshot ID
    if (action === 'CLOUD_RESTORE' && body.snapshotId) {
      const cfRes = await fetch(`${CLOUDFLARE_BACKUP_WORKER_URL}/snapshots/${body.snapshotId}`, {
        cache: 'no-store',
      });
      const cfData = await cfRes.json();
      if (!cfRes.ok || !cfData.snapshot?.payloadJson) {
        throw new Error('ไม่พบข้อมูลจุดสำรองบน Cloudflare D1');
      }

      const parsed = JSON.parse(cfData.snapshot.payloadJson);
      const patients = parsed?.data?.patients || [];

      let restoredPatients = 0;
      for (const p of patients) {
        await prisma.patient.upsert({
          where: { id: p.id },
          update: {
            dn: p.dn,
            title: p.title,
            firstNameTh: p.firstNameTh,
            lastNameTh: p.lastNameTh,
            phone: p.phone,
            rights: p.rights,
            drugAllergies: p.drugAllergies,
            chronicDiseases: p.chronicDiseases,
            depositBalance: p.depositBalance || 0,
          },
          create: {
            id: p.id,
            dn: p.dn,
            title: p.title || 'คุณ',
            firstNameTh: p.firstNameTh,
            lastNameTh: p.lastNameTh,
            phone: p.phone || '',
            rights: p.rights || 'จ่ายเอง',
            drugAllergies: p.drugAllergies,
            chronicDiseases: p.chronicDiseases,
            depositBalance: p.depositBalance || 0,
          },
        });
        restoredPatients++;
      }

      return NextResponse.json({
        success: true,
        message: `กู้คืนข้อมูลคนไข้จำนวน ${restoredPatients} ท่าน จาก Cloudflare D1 กลับเข้าสู่ระบบเรียบร้อยแล้ว`,
      });
    }

    return NextResponse.json({ error: 'Invalid backup action' }, { status: 400 });
  } catch (error: any) {
    console.error('Backup POST error:', error);
    return NextResponse.json({ error: error.message || 'Cloud backup operation failed' }, { status: 500 });
  }
}
