import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const patient = await prisma.patient.findUnique({
      where: { id: params.id },
      include: {
        attendingDoctor: true,
        appointments: {
          include: { doctor: true, room: true, type: true },
          orderBy: { date: 'desc' },
        },
        visits: {
          include: {
            doctor: true,
            room: true,
            medicalRecord: true,
            treatmentItems: true,
            prescriptionItems: true,
            invoices: {
              include: { receipts: true, payments: true },
            },
          },
          orderBy: { visitDate: 'desc' },
        },
        toothConditions: {
          orderBy: { recordedAt: 'desc' },
        },
        treatmentPlans: {
          orderBy: { createdAt: 'desc' },
        },
        deposits: {
          orderBy: { createdAt: 'desc' },
        },
        invoices: {
          include: { payments: true, receipts: true },
          orderBy: { createdAt: 'desc' },
        },
        receipts: {
          orderBy: { receiptDate: 'desc' },
        },
        patientOrthoPackages: {
          include: { installments: true, adjustmentLogs: true },
        },
        labOrders: {
          include: { doctor: true },
          orderBy: { createdAt: 'desc' },
        },
        documents: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!patient) {
      return NextResponse.json({ error: 'ไม่พบข้อมูลคนไข้' }, { status: 404 });
    }

    return NextResponse.json({ patient });
  } catch (error) {
    console.error('GET patient error:', error);
    return NextResponse.json({ error: 'Failed to fetch patient' }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    const body = await req.json();

    const updated = await prisma.patient.update({
      where: { id: params.id },
      data: {
        ...body,
        updatedAt: new Date(),
      },
      include: {
        attendingDoctor: true,
      },
    });

    return NextResponse.json({ success: true, patient: updated });
  } catch (error: any) {
    console.error('PATCH patient error:', error);
    return NextResponse.json({ error: error.message || 'Update failed' }, { status: 500 });
  }
}
