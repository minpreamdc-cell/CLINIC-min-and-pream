export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkRolePermission } from '@/lib/auth';

export async function GET() {
  try {
    const { authorized } = await checkRolePermission(['ADMIN']);
    if (!authorized) {
      return NextResponse.json({ error: 'คุณไม่มีสิทธิ์ดาวน์โหลดไฟล์สำรองข้อมูล' }, { status: 403 });
    }

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
      treatmentItems,
      invoices,
      payments,
      receipts,
      deposits,
      orthoPackages,
      labOrders,
      inventoryItems,
      dailyCloses,
    ] = await Promise.all([
      prisma.branch.findMany(),
      prisma.user.findMany({ select: { id: true, username: true, fullName: true, role: true, email: true, phone: true } }),
      prisma.doctor.findMany(),
      prisma.room.findMany(),
      prisma.clinicSetting.findMany(),
      prisma.patient.findMany(),
      prisma.appointment.findMany(),
      prisma.visit.findMany(),
      prisma.medicalRecord.findMany(),
      prisma.treatmentItem.findMany(),
      prisma.invoice.findMany(),
      prisma.payment.findMany(),
      prisma.receipt.findMany(),
      prisma.deposit.findMany(),
      prisma.orthoPackage.findMany(),
      prisma.labOrder.findMany(),
      prisma.inventoryItem.findMany(),
      prisma.dailyClose.findMany(),
    ]);

    const backupData = {
      clinic: 'คลินิกทันตกรรมหมอมิน หมอพรีม',
      exportedAt: new Date().toISOString(),
      version: '1.0.0',
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
        treatmentItems,
        invoices,
        payments,
        receipts,
        deposits,
        orthoPackages,
        labOrders,
        inventoryItems,
        dailyCloses,
      },
    };

    return new NextResponse(JSON.stringify(backupData, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="minpreem_clinic_backup_${new Date().toISOString().split('T')[0]}.json"`,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create backup' }, { status: 500 });
  }
}
