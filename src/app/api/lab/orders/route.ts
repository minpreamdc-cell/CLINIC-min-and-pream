import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const doctorId = searchParams.get('doctorId');
    const patientId = searchParams.get('patientId');

    const where: any = {};
    if (status && status !== 'all') where.status = status;
    if (doctorId && doctorId !== 'all') where.doctorId = doctorId;
    if (patientId) where.patientId = patientId;

    const orders = await prisma.labOrder.findMany({
      where,
      include: {
        patient: true,
        doctor: true,
        visit: true,
      },
      orderBy: { dueDate: 'asc' },
    });

    return NextResponse.json({ orders });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch lab orders' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    const body = await req.json();
    const {
      patientId,
      doctorId,
      visitId,
      toothNumber,
      workType = 'CROWN',
      labCompanyName,
      dueDate,
      cost = 0,
      deductionType = 'DOCTOR',
      shadeGuide,
      instructions,
    } = body;

    if (!patientId || !doctorId || !labCompanyName || !dueDate) {
      return NextResponse.json(
        { error: 'กรุณากรอกข้อมูลให้ครบถ้วน (คนไข้, แพทย์, บริษัทแลป และกำหนดรับงาน)' },
        { status: 400 }
      );
    }

    const currentYear = new Date().getFullYear();
    const setting = await prisma.clinicSetting.findUnique({ where: { id: 'default' } });
    const nextLabNum = setting?.nextLabOrderNumber || 1001;
    const orderNo = `LAB-${currentYear}-${String(nextLabNum).padStart(4, '0')}`;

    const order = await prisma.$transaction(async (tx) => {
      await tx.clinicSetting.update({
        where: { id: 'default' },
        data: { nextLabOrderNumber: nextLabNum + 1 },
      });

      return tx.labOrder.create({
        data: {
          orderNo,
          patientId,
          doctorId,
          visitId: visitId || null,
          toothNumber: toothNumber ? String(toothNumber) : null,
          workType,
          labCompanyName,
          dueDate: new Date(dueDate),
          cost: Number(cost),
          deductionType,
          shadeGuide: shadeGuide || null,
          instructions: instructions || null,
          status: 'SENT',
        },
        include: {
          patient: true,
          doctor: true,
        },
      });
    });

    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create lab order' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, status, cost, invoiceNo, isPaid, revisionNotes } = body;

    if (!orderId) {
      return NextResponse.json({ error: 'orderId is required' }, { status: 400 });
    }

    const updateData: any = {};
    if (status) updateData.status = status;
    if (cost !== undefined) updateData.cost = Number(cost);
    if (invoiceNo !== undefined) updateData.invoiceNo = invoiceNo;
    if (isPaid !== undefined) updateData.isPaid = Boolean(isPaid);
    if (revisionNotes !== undefined) updateData.revisionNotes = revisionNotes;

    const updated = await prisma.labOrder.update({
      where: { id: orderId },
      data: updateData,
      include: { patient: true, doctor: true },
    });

    return NextResponse.json({ success: true, order: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update lab order' }, { status: 500 });
  }
}
