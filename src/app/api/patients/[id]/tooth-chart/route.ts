import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const conditions = await prisma.toothCondition.findMany({
      where: { patientId: params.id },
      orderBy: { recordedAt: 'desc' },
    });
    return NextResponse.json({ conditions });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch tooth chart' }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    const body = await req.json();
    const { toothNumber, conditionType, surfaces, notes } = body;

    if (!toothNumber || !conditionType) {
      return NextResponse.json({ error: 'กรุณาระบุซี่ฟันและสถานะ' }, { status: 400 });
    }

    const recorded = await prisma.toothCondition.create({
      data: {
        patientId: params.id,
        toothNumber: String(toothNumber),
        conditionType,
        surfaces: surfaces || null,
        notes: notes || null,
        recordedByDoctorId: user?.doctorId || null,
        recordedByName: user?.fullName || 'ทันตแพทย์',
      },
    });

    return NextResponse.json({ success: true, condition: recorded });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to save tooth condition' }, { status: 500 });
  }
}
