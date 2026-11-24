import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const patientId = searchParams.get('patientId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const where: any = {};
    if (patientId) where.patientId = patientId;
    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate);
      if (endDate) where.date.lte = new Date(endDate + 'T23:59:59.999Z');
    }

    const deposits = await prisma.deposit.findMany({
      where,
      include: { patient: true },
      orderBy: { date: 'desc' },
    });

    // Summary calculation
    const summary = deposits.reduce(
      (acc, d) => {
        if (d.type === 'RECEIVE') acc.totalReceived += d.amount;
        else if (d.type === 'USE') acc.totalUsed += d.amount;
        else if (d.type === 'REFUND') acc.totalRefunded += d.amount;
        return acc;
      },
      { totalReceived: 0, totalUsed: 0, totalRefunded: 0 }
    );

    const netDepositOutstanding = summary.totalReceived - summary.totalUsed - summary.totalRefunded;

    return NextResponse.json({
      deposits,
      summary: {
        ...summary,
        netDepositOutstanding,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch deposits' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    const body = await req.json();
    const { patientId, amount, type = 'RECEIVE', paymentMethod = 'TRANSFER', notes } = body;

    const patient = await prisma.patient.findUnique({ where: { id: patientId } });
    if (!patient) {
      return NextResponse.json({ error: 'ไม่พบข้อมูลคนไข้' }, { status: 404 });
    }

    const amt = Number(amount);
    if (amt <= 0) {
      return NextResponse.json({ error: 'จำนวนเงินต้องมากกว่า 0' }, { status: 400 });
    }

    if (type === 'REFUND' && patient.depositBalance < amt) {
      return NextResponse.json(
        { error: `ยอดเงินมัดจำคงเหลือไม่พอคืน (คงเหลือ ${patient.depositBalance.toFixed(2)} บาท)` },
        { status: 400 }
      );
    }

    const newBalance =
      type === 'RECEIVE'
        ? patient.depositBalance + amt
        : patient.depositBalance - amt;

    const result = await prisma.$transaction(async (tx) => {
      // Update patient deposit balance
      await tx.patient.update({
        where: { id: patientId },
        data: { depositBalance: newBalance },
      });

      // Create deposit movement
      const deposit = await tx.deposit.create({
        data: {
          patientId,
          type,
          amount: amt,
          balanceAfter: newBalance,
          paymentMethod,
          notes: notes || (type === 'RECEIVE' ? 'รับเงินมัดจำล่วงหน้า' : 'คืนเงินมัดจำให้คนไข้'),
          processedBy: user?.fullName || 'เจ้าหน้าที่การเงิน',
        },
      });

      // Audit Log for refund
      if (type === 'REFUND') {
        await tx.auditLog.create({
          data: {
            userId: user?.id,
            userName: user?.fullName || 'เจ้าหน้าที่',
            action: 'DEPOSIT_REFUND',
            entityType: 'Deposit',
            entityId: deposit.id,
            details: `คืนเงินมัดจำให้คนไข้ ${patient.firstNameTh} ${patient.lastNameTh} จำนวน ${amt.toLocaleString('th-TH')} บาท`,
          },
        });
      }

      return deposit;
    });

    return NextResponse.json({ success: true, deposit: result });
  } catch (error: any) {
    console.error('Deposit error:', error);
    return NextResponse.json({ error: error.message || 'Deposit failed' }, { status: 500 });
  }
}
