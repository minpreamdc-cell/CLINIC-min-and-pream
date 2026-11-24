import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    const body = await req.json();
    const { appointmentId, patientId, doctorId, roomId, notes } = body;

    const todayStr = new Date().toISOString().split('T')[0];
    const defaultBranch = await prisma.branch.findFirst({ where: { isDefault: true } });
    const branchId = defaultBranch?.id || (await prisma.branch.findFirst())?.id;
    if (!branchId) {
      return NextResponse.json({ error: 'ไม่พบสาขาในระบบ' }, { status: 500 });
    }

    // Server-side transaction to prevent race conditions
    const result = await prisma.$transaction(async (tx) => {
      // 1. If checking in from an Appointment
      if (appointmentId) {
        // Idempotency: Check if visit already exists for this appointment
        const existingVisit = await tx.visit.findUnique({
          where: { appointmentId },
          include: {
            patient: true,
            doctor: true,
            room: true,
            appointment: true,
          },
        });

        if (existingVisit) {
          return { visit: existingVisit, alreadyCheckedIn: true };
        }

        const appointment = await tx.appointment.findUnique({
          where: { id: appointmentId },
        });

        if (!appointment) {
          throw new Error('ไม่พบนัดหมายที่ต้องการเช็กอิน');
        }

        // Get count of today's visits to assign next queue number
        const countToday = await tx.visit.count({
          where: { visitDate: todayStr },
        });
        const queueNumber = countToday + 1;
        const dateCode = todayStr.replace(/-/g, '');
        const visitNumber = `VN-${dateCode}-${String(queueNumber).padStart(3, '0')}`;

        // Create Visit
        const newVisit = await tx.visit.create({
          data: {
            visitNumber,
            appointmentId: appointment.id,
            patientId: appointment.patientId,
            doctorId: appointment.doctorId,
            roomId: appointment.roomId,
            branchId,
            visitDate: todayStr,
            queueNumber,
            status: 'WAITING_EXAM',
            checkInBy: user?.fullName || 'เจ้าหน้าที่เคาน์เตอร์',
            notes: notes || appointment.notes || null,
          },
          include: {
            patient: true,
            doctor: true,
            room: true,
            appointment: true,
          },
        });

        // Update appointment status to CONFIRMED
        await tx.appointment.update({
          where: { id: appointmentId },
          data: { status: 'CONFIRMED' },
        });

        return { visit: newVisit, alreadyCheckedIn: false };
      }

      // 2. Walk-in Check-in
      if (!patientId || !doctorId || !roomId) {
        throw new Error('สำหรับ Walk-in กรุณาระบุคนไข้ แพทย์ และห้องตรวจ');
      }

      const countToday = await tx.visit.count({
        where: { visitDate: todayStr },
      });
      const queueNumber = countToday + 1;
      const dateCode = todayStr.replace(/-/g, '');
      const visitNumber = `VN-${dateCode}-${String(queueNumber).padStart(3, '0')}`;

      const walkInVisit = await tx.visit.create({
        data: {
          visitNumber,
          patientId,
          doctorId,
          roomId,
          branchId,
          visitDate: todayStr,
          queueNumber,
          status: 'WAITING_EXAM',
          checkInBy: user?.fullName || 'เจ้าหน้าที่เคาน์เตอร์',
          notes: notes || 'Walk-in มารับการรักษา',
        },
        include: {
          patient: true,
          doctor: true,
          room: true,
        },
      });

      return { visit: walkInVisit, alreadyCheckedIn: false };
    });

    return NextResponse.json({
      success: true,
      visit: result.visit,
      alreadyCheckedIn: result.alreadyCheckedIn,
      message: result.alreadyCheckedIn
        ? 'คนไข้เช็กอินแล้วก่อนหน้านี้ (คิวเดิมคงอยู่)'
        : `เช็กอินสำเร็จ ได้คิวที่ ${result.visit.queueNumber}`,
    });
  } catch (error: any) {
    console.error('Check-in error:', error);
    return NextResponse.json({ error: error.message || 'Check-in failed' }, { status: 400 });
  }
}
