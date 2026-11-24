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

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get('date');
    const doctorId = searchParams.get('doctorId');
    const roomId = searchParams.get('roomId');
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    const where: any = {};

    if (date) {
      where.date = date;
    }

    if (doctorId && doctorId !== 'all') {
      where.doctorId = doctorId;
    }

    if (roomId && roomId !== 'all') {
      where.roomId = roomId;
    }

    if (status && status !== 'all') {
      where.status = status;
    }

    if (search) {
      where.patient = {
        OR: [
          { firstNameTh: { contains: search } },
          { lastNameTh: { contains: search } },
          { dn: { contains: search } },
          { phone: { contains: search } },
        ],
      };
    }

    const [appointments, doctors, rooms, appointmentTypes, blockedSlots] = await Promise.all([
      prisma.appointment.findMany({
        where,
        include: {
          patient: true,
          doctor: true,
          room: true,
          type: true,
          visit: true,
        },
        orderBy: [{ startTime: 'asc' }],
      }),
      prisma.doctor.findMany({
        where: { isActive: true },
        include: { defaultRoom: true, schedules: true },
        orderBy: { fullName: 'asc' },
      }),
      prisma.room.findMany({
        where: { isActive: true },
        orderBy: { name: 'asc' },
      }),
      prisma.appointmentType.findMany({
        where: { isActive: true },
        orderBy: { name: 'asc' },
      }),
      date
        ? prisma.blockedSlot.findMany({
            where: { date },
          })
        : [],
    ]);

    return NextResponse.json({
      appointments,
      doctors,
      rooms,
      appointmentTypes,
      blockedSlots,
    });
  } catch (error) {
    console.error('GET appointments error:', error);
    return NextResponse.json({ error: 'Failed to fetch appointments' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    const body = await req.json();
    const {
      patientId,
      doctorId,
      roomId,
      date,
      startTime,
      durationMinutes = 30,
      typeId,
      notes,
    } = body;

    if (!patientId || !doctorId || !roomId || !date || !startTime) {
      return NextResponse.json(
        { error: 'กรุณากรอกข้อมูลให้ครบถ้วน (คนไข้, แพทย์, ห้องตรวจ, วันที่ และเวลา)' },
        { status: 400 }
      );
    }

    const startMinutes = timeToMinutes(startTime);
    const endMinutes = startMinutes + Number(durationMinutes);
    const endTime = minutesToTime(endMinutes);

    // Fetch default branch if not passed
    const defaultBranch = await prisma.branch.findFirst({ where: { isDefault: true } });
    const branchId = defaultBranch?.id || (await prisma.branch.findFirst())?.id;
    if (!branchId) {
      return NextResponse.json({ error: 'ไม่พบสาขาของระบบ' }, { status: 500 });
    }

    // SERVER-SIDE CONCURRENCY & CONFLICT PROTECTION:
    // Check doctor conflict & room conflict using atomic transaction to prevent simultaneous double-booking
    const result = await prisma.$transaction(async (tx) => {
      // 1. Check existing overlapping active appointments on this date
      const existingAppointments = await tx.appointment.findMany({
        where: {
          date,
          status: { in: ['BOOKED', 'CONFIRMED'] },
          OR: [{ doctorId }, { roomId }],
        },
        include: { doctor: true, room: true, patient: true },
      });

      for (const app of existingAppointments) {
        const appStart = timeToMinutes(app.startTime);
        const appEnd = timeToMinutes(app.endTime);

        // Check if overlaps: (startMinutes < appEnd && endMinutes > appStart)
        if (startMinutes < appEnd && endMinutes > appStart) {
          if (app.doctorId === doctorId) {
            throw new Error(
              `แพทย์ (${app.doctor.fullName}) มีนัดหมายแล้วในช่วงเวลา ${app.startTime} - ${app.endTime} น. (คนไข้: ${app.patient.firstNameTh} ${app.patient.lastNameTh})`
            );
          }
          if (app.roomId === roomId) {
            throw new Error(
              `ห้องตรวจ (${app.room.name}) มีการใช้งานแล้วในช่วงเวลา ${app.startTime} - ${app.endTime} น.`
            );
          }
        }
      }

      // 2. Check blocked slot conflict
      const blocked = await tx.blockedSlot.findFirst({
        where: {
          date,
          OR: [
            { doctorId },
            { roomId },
            { doctorId: null, roomId: null }, // Branch-wide block
          ],
        },
      });

      if (blocked) {
        const bStart = timeToMinutes(blocked.startTime);
        const bEnd = timeToMinutes(blocked.endTime);
        if (startMinutes < bEnd && endMinutes > bStart) {
          throw new Error(`ช่วงเวลาดังกล่าวถูกปิดรับนัด: ${blocked.reason}`);
        }
      }

      // 3. Resolve appointment type name if typeId provided
      let typeName: string | undefined;
      if (typeId) {
        const appType = await tx.appointmentType.findUnique({ where: { id: typeId } });
        typeName = appType?.name;
      }

      // 4. Create Appointment
      const newAppointment = await tx.appointment.create({
        data: {
          branchId,
          patientId,
          doctorId,
          roomId,
          date,
          startTime,
          endTime,
          durationMinutes: Number(durationMinutes),
          typeId: typeId || null,
          typeName: typeName || null,
          status: 'BOOKED',
          notes: notes || null,
          bookedBy: user?.fullName || 'เจ้าหน้าที่เคาน์เตอร์',
        },
        include: {
          patient: true,
          doctor: true,
          room: true,
          type: true,
        },
      });

      return newAppointment;
    });

    return NextResponse.json({ success: true, appointment: result });
  } catch (error: any) {
    console.error('POST appointment conflict or error:', error.message);
    return NextResponse.json(
      { error: error.message || 'ไม่สามารถบันทึกนัดหมายได้' },
      { status: 409 }
    );
  }
}
