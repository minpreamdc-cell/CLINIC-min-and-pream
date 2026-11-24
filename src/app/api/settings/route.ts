import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkRolePermission } from '@/lib/auth';

export async function GET() {
  try {
    const [setting, branches, rooms, doctors, users] = await Promise.all([
      prisma.clinicSetting.findUnique({ where: { id: 'default' } }),
      prisma.branch.findMany(),
      prisma.room.findMany(),
      prisma.doctor.findMany({ include: { defaultRoom: true } }),
      prisma.user.findMany({ select: { id: true, username: true, fullName: true, role: true, email: true, phone: true, isActive: true } }),
    ]);

    return NextResponse.json({
      setting,
      branches,
      rooms,
      doctors,
      users,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { authorized } = await checkRolePermission(['ADMIN']);
    if (!authorized) {
      return NextResponse.json({ error: 'คุณไม่มีสิทธิ์แก้ไขการตั้งค่าระบบ' }, { status: 403 });
    }

    const body = await req.json();
    const updated = await prisma.clinicSetting.upsert({
      where: { id: 'default' },
      update: body,
      create: {
        id: 'default',
        ...body,
      },
    });

    return NextResponse.json({ success: true, setting: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update settings' }, { status: 500 });
  }
}
