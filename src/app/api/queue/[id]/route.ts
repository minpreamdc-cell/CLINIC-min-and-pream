import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    const body = await req.json();
    const { status, notes, roomId, doctorId } = body;

    const existing = await prisma.visit.findUnique({
      where: { id: params.id },
      include: { patient: true, doctor: true },
    });

    if (!existing) {
      return NextResponse.json({ error: 'ไม่พบข้อมูลการมารักษา' }, { status: 404 });
    }

    const updateData: any = {};
    if (status) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;
    if (roomId) updateData.roomId = roomId;
    if (doctorId) updateData.doctorId = doctorId;

    const updated = await prisma.visit.update({
      where: { id: params.id },
      data: updateData,
      include: {
        patient: true,
        doctor: true,
        room: true,
        treatmentItems: true,
        medicalRecord: true,
        invoices: true,
      },
    });

    return NextResponse.json({ success: true, visit: updated });
  } catch (error: any) {
    console.error('Update queue visit error:', error);
    return NextResponse.json({ error: error.message || 'Update failed' }, { status: 500 });
  }
}
