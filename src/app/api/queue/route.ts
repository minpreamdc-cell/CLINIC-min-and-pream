export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0];
    const doctorId = searchParams.get('doctorId');
    const roomId = searchParams.get('roomId');
    const status = searchParams.get('status');

    const where: any = { visitDate: date };
    if (doctorId && doctorId !== 'all') where.doctorId = doctorId;
    if (roomId && roomId !== 'all') where.roomId = roomId;
    if (status && status !== 'all') where.status = status;

    const visits = await prisma.visit.findMany({
      where,
      include: {
        patient: {
          include: {
            deposits: true,
          },
        },
        doctor: true,
        room: true,
        appointment: {
          include: {
            type: true,
          },
        },
        treatmentItems: true,
        medicalRecord: true,
        invoices: {
          include: {
            payments: true,
            receipts: true,
          },
        },
      },
      orderBy: [{ queueNumber: 'asc' }],
    });

    // Summary counts for today's queue tabs/badges
    const allTodayVisits = await prisma.visit.findMany({
      where: { visitDate: date },
      select: { status: true },
    });

    const stats = {
      total: allTodayVisits.length,
      waitingExam: allTodayVisits.filter((v) => v.status === 'WAITING_EXAM').length,
      inExam: allTodayVisits.filter((v) => v.status === 'IN_EXAM').length,
      waitingPayment: allTodayVisits.filter((v) => v.status === 'WAITING_PAYMENT').length,
      completed: allTodayVisits.filter((v) => v.status === 'COMPLETED').length,
      cancelled: allTodayVisits.filter((v) => v.status === 'CANCELLED').length,
    };

    return NextResponse.json({ visits, stats });
  } catch (error) {
    console.error('GET queue error:', error);
    return NextResponse.json({ error: 'Failed to fetch queue' }, { status: 500 });
  }
}
