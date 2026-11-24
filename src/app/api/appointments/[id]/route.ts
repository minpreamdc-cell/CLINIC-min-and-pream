import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

function timeToMinutes(timeStr: string): number {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
}

function minutesToTime(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const appointment = await prisma.appointment.findUnique({
      where: { id: params.id },
      include: {
        patient: true,
        doctor: true,
        room: true,
        type: true,
        visit: true,
      },
    });

    if (!appointment) {
      return NextResponse.json({ error: 'ไม่พบนัดหมาย' }, { status: 404 });
    }

    return NextResponse.json({ appointment });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch appointment' }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    const body = await req.json();
    const { action, status, cancelReason, date, startTime, durationMinutes, doctorId, roomId, notes } = body;

    const existing = await prisma.appointment.findUnique({
      where: { id: params.id },
    });

    if (!existing) {
      return NextResponse.json({ error: 'ไม่พบนัดหมาย' }, { status: 404 });
    }

    // 1. Reschedule action
    if (action === 'RESCHEDULE' || date || startTime) {
      const targetDate = date || existing.date;
      const targetStart = startTime || existing.startTime;
      const targetDuration = durationMinutes ? Number(durationMinutes) : existing.durationMinutes;
      const targetDoctorId = doctorId || existing.doctorId;
      const targetRoomId = roomId || existing.roomId;

      const startMin = timeToMinutes(targetStart);
      const endMin = startMin + targetDuration;
      const targetEnd = minutesToTime(endMin);

      // Check collision
      const collisions = await prisma.appointment.findMany({
        where: {
          id: { not: existing.id },
          date: targetDate,
          status: { in: ['BOOKED', 'CONFIRMED'] },
          OR: [{ doctorId: targetDoctorId }, { roomId: targetRoomId }],
        },
        include: { doctor: true, room: true },
      });

      for (const col of collisions) {
        const colStart = timeToMinutes(col.startTime);
        const colEnd = timeToMinutes(col.endTime);
        if (startMin < colEnd && endMin > colStart) {
          return NextResponse.json(
            {
              error: `ไม่สามารถเลื่อนนัดได้เนื่องจากมีนัดซ้อน: ${
                col.doctorId === targetDoctorId
                  ? `แพทย์มีนัดแล้ว (${col.startTime} - ${col.endTime})`
                  : `ห้องตรวจมีนัดแล้ว (${col.startTime} - ${col.endTime})`
              }`,
            },
            { status: 409 }
          );
        }
      }

      const updated = await prisma.appointment.update({
        where: { id: params.id },
        data: {
          date: targetDate,
          startTime: targetStart,
          endTime: targetEnd,
          durationMinutes: targetDuration,
          doctorId: targetDoctorId,
          roomId: targetRoomId,
          notes: notes !== undefined ? notes : existing.notes,
          updatedBy: user?.fullName || 'เจ้าหน้าที่เคาน์เตอร์',
        },
        include: { patient: true, doctor: true, room: true, type: true },
      });

      return NextResponse.json({ success: true, appointment: updated });
    }

    // 2. Status update (Confirm, Cancel, No-Show)
    const updateData: any = {
      updatedBy: user?.fullName || 'เจ้าหน้าที่เคาน์เตอร์',
    };

    if (status) {
      updateData.status = status;
      if (status === 'CANCELLED' && cancelReason) {
        updateData.cancelReason = cancelReason;
      }
    }

    if (notes !== undefined) {
      updateData.notes = notes;
    }

    const updated = await prisma.appointment.update({
      where: { id: params.id },
      data: updateData,
      include: { patient: true, doctor: true, room: true, type: true },
    });

    return NextResponse.json({ success: true, appointment: updated });
  } catch (error: any) {
    console.error('Update appointment error:', error);
    return NextResponse.json({ error: error.message || 'Failed to update' }, { status: 500 });
  }
}
