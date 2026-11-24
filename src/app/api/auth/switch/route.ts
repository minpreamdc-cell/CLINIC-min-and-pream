import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { username } = await req.json();
    if (!username) {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { username },
      include: { doctorProfile: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        role: user.role,
        doctorId: user.doctorProfile?.id || null,
        doctorNickname: user.doctorProfile?.nickname || null,
      },
    });

    response.cookies.set('minpreem_clinic_session', JSON.stringify({ username: user.username }), {
      path: '/',
      httpOnly: false, // Accessible to front-end for quick state syncing
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error('Switch user error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
