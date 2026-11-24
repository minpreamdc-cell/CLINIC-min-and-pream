import { cookies } from 'next/headers';
import { prisma } from './prisma';
import { SessionUser, UserRole } from './auth-types';

export * from './auth-types';

const SESSION_COOKIE_NAME = 'minpreem_clinic_session';

export async function getCurrentUser(): Promise<SessionUser | null> {
  try {
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    let username = 'counter'; // Default to counter staff for instant readiness
    if (sessionCookie) {
      try {
        const parsed = JSON.parse(sessionCookie);
        if (parsed?.username) {
          username = parsed.username;
        }
      } catch {
        username = sessionCookie;
      }
    }

    const user = await prisma.user.findUnique({
      where: { username },
      include: {
        doctorProfile: true,
      },
    });

    if (!user || !user.isActive) return null;

    return {
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      role: user.role as UserRole,
      email: user.email,
      phone: user.phone,
      branchId: user.branchId,
      doctorId: user.doctorProfile?.id || null,
      doctorNickname: user.doctorProfile?.nickname || null,
    };
  } catch (error) {
    console.error('getCurrentUser error:', error);
    return null;
  }
}

export async function checkRolePermission(allowedRoles: UserRole[]): Promise<{ authorized: boolean; user: SessionUser | null }> {
  const user = await getCurrentUser();
  if (!user) {
    return { authorized: false, user: null };
  }
  if (!allowedRoles.includes(user.role)) {
    return { authorized: false, user };
  }
  return { authorized: true, user };
}
