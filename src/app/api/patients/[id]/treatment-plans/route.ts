import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const plans = await prisma.treatmentPlan.findMany({
      where: { patientId: params.id },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ plans });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch treatment plans' }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { toothNumber, procedureCode, procedureName, estimatedPrice, status = 'PROPOSED', notes } = body;

    if (!procedureCode || !procedureName || estimatedPrice === undefined) {
      return NextResponse.json({ error: 'กรุณาระบุรหัสหัตถการ ชื่อ และราคาโดยประมาณ' }, { status: 400 });
    }

    const plan = await prisma.treatmentPlan.create({
      data: {
        patientId: params.id,
        toothNumber: toothNumber ? String(toothNumber) : null,
        procedureCode,
        procedureName,
        estimatedPrice: Number(estimatedPrice),
        status,
        notes: notes || null,
      },
    });

    return NextResponse.json({ success: true, plan });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create plan' }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { planId, status, estimatedPrice, notes } = body;

    const updated = await prisma.treatmentPlan.update({
      where: { id: planId },
      data: {
        status,
        estimatedPrice: estimatedPrice !== undefined ? Number(estimatedPrice) : undefined,
        notes: notes !== undefined ? notes : undefined,
      },
    });

    return NextResponse.json({ success: true, plan: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update plan' }, { status: 500 });
  }
}
