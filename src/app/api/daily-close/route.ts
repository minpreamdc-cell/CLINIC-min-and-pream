import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkRolePermission, getCurrentUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0];

    const startDateTime = new Date(`${date}T00:00:00.000Z`);
    const endDateTime = new Date(`${date}T23:59:59.999Z`);

    // Fetch live system totals from payments on this date (Cash-basis)
    const payments = await prisma.payment.findMany({
      where: {
        paymentDate: { gte: startDateTime, lte: endDateTime },
        isDepositUse: false, // Fresh cash only
      },
    });

    let systemCash = 0;
    let systemTransfer = 0;
    let systemCard = 0;
    let systemQr = 0;

    for (const p of payments) {
      if (p.paymentMethod === 'CASH') systemCash += p.amount;
      else if (p.paymentMethod === 'TRANSFER') systemTransfer += p.amount;
      else if (p.paymentMethod === 'CREDIT_CARD') systemCard += p.amount;
      else if (p.paymentMethod === 'QR') systemQr += p.amount;
    }

    const systemTotal = systemCash + systemTransfer + systemCard + systemQr;

    // Check if daily close record already exists
    const existingClose = await prisma.dailyClose.findFirst({
      where: { closeDate: date },
      orderBy: { closedAt: 'desc' },
    });

    return NextResponse.json({
      date,
      systemTotals: {
        systemCash,
        systemTransfer,
        systemCard,
        systemQr,
        systemTotal,
      },
      existingClose,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch daily close' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    const body = await req.json();
    const {
      date,
      shiftName = 'กะประจำวัน',
      systemCash,
      systemTransfer,
      systemCard,
      systemQr,
      systemTotal,
      countedCash,
      countedTransfer,
      countedCard,
      countedQr,
      countedTotal,
      difference,
      reason,
    } = body;

    const defaultBranch = await prisma.branch.findFirst({ where: { isDefault: true } });
    const branchId = defaultBranch?.id || (await prisma.branch.findFirst())?.id;
    if (!branchId) return NextResponse.json({ error: 'ไม่พบสาขา' }, { status: 500 });

    const closeRecord = await prisma.dailyClose.create({
      data: {
        branchId,
        closeDate: date,
        shiftName,
        systemCash: Number(systemCash || 0),
        systemTransfer: Number(systemTransfer || 0),
        systemCard: Number(systemCard || 0),
        systemQr: Number(systemQr || 0),
        systemTotal: Number(systemTotal || 0),
        countedCash: Number(countedCash || 0),
        countedTransfer: Number(countedTransfer || 0),
        countedCard: Number(countedCard || 0),
        countedQr: Number(countedQr || 0),
        countedTotal: Number(countedTotal || 0),
        difference: Number(difference || 0),
        reason: reason || null,
        closedBy: user?.fullName || 'เจ้าหน้าที่ปิดยอด',
      },
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: user?.id,
        userName: user?.fullName || 'เจ้าหน้าที่',
        action: 'DAILY_CLOSE_SUBMIT',
        entityType: 'DailyClose',
        entityId: closeRecord.id,
        details: `บันทึกปิดยอดประจำวัน ${date} ยอดระบบ: ${systemTotal} ยอดนับได้: ${countedTotal} ส่วนต่าง: ${difference}`,
      },
    });

    return NextResponse.json({ success: true, dailyClose: closeRecord });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Daily close failed' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    // Reopen closed shift requires ADMIN or FINANCE permission
    const { authorized, user } = await checkRolePermission(['ADMIN', 'FINANCE']);
    if (!authorized || !user) {
      return NextResponse.json({ error: 'คุณไม่มีสิทธิ์ปลดล็อคยอดที่ปิดแล้ว' }, { status: 403 });
    }

    const body = await req.json();
    const { id, reopenReason } = body;

    if (!reopenReason) {
      return NextResponse.json({ error: 'กรุณาระบุเหตุผลการขอเปิดแก้ยอดที่ปิดแล้ว' }, { status: 400 });
    }

    const updated = await prisma.dailyClose.update({
      where: { id },
      data: {
        isReopened: true,
        reopenReason,
        reopenedBy: user.fullName,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        userName: user.fullName,
        action: 'DAILY_CLOSE_REOPEN',
        entityType: 'DailyClose',
        entityId: id,
        details: `ปลดล็อคยอดปิดประจำวัน เหตุผล: ${reopenReason}`,
      },
    });

    return NextResponse.json({ success: true, dailyClose: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to reopen' }, { status: 500 });
  }
}
