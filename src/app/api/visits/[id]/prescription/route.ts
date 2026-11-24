import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const prescriptions = await prisma.prescriptionItem.findMany({
      where: { visitId: params.id },
      orderBy: { createdAt: 'asc' },
    });
    return NextResponse.json({ prescriptions });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch prescriptions' }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { drugName, quantity = 1, unit = 'เม็ด', dosageInstructions, notes } = body;

    const visit = await prisma.visit.findUnique({
      where: { id: params.id },
    });

    if (!visit) {
      return NextResponse.json({ error: 'ไม่พบข้อมูลการมารักษา' }, { status: 404 });
    }

    if (!drugName || !dosageInstructions) {
      return NextResponse.json({ error: 'กรุณาระบุชื่อยาและวิธีใช้' }, { status: 400 });
    }

    const prescription = await prisma.prescriptionItem.create({
      data: {
        visitId: visit.id,
        patientId: visit.patientId,
        drugName,
        quantity: Number(quantity),
        unit,
        dosageInstructions,
        notes: notes || null,
        printedLabelAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, prescription });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to order prescription' }, { status: 500 });
  }
}
