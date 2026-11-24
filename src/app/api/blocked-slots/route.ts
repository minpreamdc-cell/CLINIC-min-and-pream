import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get('date');
    const where: any = {};
    if (date) where.date = date;

    const blockedSlots = await prisma.blockedSlot.findMany({
      where,
      orderBy: { startTime: 'asc' },
    });
    return NextResponse.json({ blockedSlots });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch blocked slots' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    const body = await req.json();
    const { date, startTime, endTime, reason, doctorId, roomId } = body;

    if (!date || !startTime || !endTime || !reason) {
      return NextResponse.json({ error: 'กรุณาระบุข้อมูลวันที่ เวลา และเหตุผล' }, { status: 400 });
    }

    const blocked = await prisma.blockedSlot.create({
      data: {
        date,
        startTime,
        endTime,
        reason,
        doctorId: doctorId || null,
        roomId: roomId || null,
        createdBy: user?.fullName || 'เจ้าหน้าที่',
      },
    });

    return NextResponse.json({ success: true, blocked });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create blocked slot' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

    await prisma.blockedSlot.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
