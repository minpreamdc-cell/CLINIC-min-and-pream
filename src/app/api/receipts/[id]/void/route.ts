import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkRolePermission, getCurrentUser } from '@/lib/auth';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Only ADMIN or FINANCE can void receipts
    const { authorized, user } = await checkRolePermission(['ADMIN', 'FINANCE']);
    if (!authorized || !user) {
      return NextResponse.json(
        { error: 'คุณไม่มีสิทธิ์ยกเลิกใบเสร็จรับเงิน (สิทธิ์เฉพาะเจ้าของคลินิกหรือฝ่ายการเงิน)' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { voidReason } = body;

    if (!voidReason) {
      return NextResponse.json({ error: 'กรุณาระบุเหตุผลในการยกเลิกใบเสร็จ' }, { status: 400 });
    }

    const receipt = await prisma.receipt.findUnique({
      where: { id: params.id },
      include: {
        invoice: {
          include: { patient: true, payments: true },
        },
      },
    });

    if (!receipt) {
      return NextResponse.json({ error: 'ไม่พบใบเสร็จรับเงิน' }, { status: 404 });
    }

    if (receipt.isVoided) {
      return NextResponse.json({ error: 'ใบเสร็จรับเงินนี้ถูกยกเลิกไปแล้ว' }, { status: 400 });
    }

    // Atomic transaction for voiding and balance reversal
    await prisma.$transaction(async (tx) => {
      // 1. Mark receipt voided
      await tx.receipt.update({
        where: { id: receipt.id },
        data: {
          isVoided: true,
          voidReason,
          voidedBy: user.fullName,
          voidedAt: new Date(),
        },
      });

      // 2. Adjust invoice balances
      const voidedAmount = receipt.paidAmount;
      const newPaidAmount = Math.max(0, receipt.invoice.paidAmount - voidedAmount);
      const newBalanceDue = Math.max(0, receipt.invoice.netAmount - newPaidAmount);
      const newStatus = newPaidAmount === 0 ? 'UNPAID' : 'PARTIALLY_PAID';

      await tx.invoice.update({
        where: { id: receipt.invoiceId },
        data: {
          paidAmount: newPaidAmount,
          balanceDue: newBalanceDue,
          status: newStatus,
        },
      });

      // 3. Re-open visit status if it was completed
      await tx.visit.update({
        where: { id: receipt.invoice.visitId },
        data: { status: 'WAITING_PAYMENT' },
      });

      // 4. Audit Log
      await tx.auditLog.create({
        data: {
          userId: user.id,
          userName: user.fullName,
          action: 'RECEIPT_VOID',
          entityType: 'Receipt',
          entityId: receipt.id,
          details: `ยกเลิกใบเสร็จเลขที่ ${receipt.receiptNo} จำนวนเงิน ${voidedAmount.toLocaleString('th-TH')} บาท เหตุผล: ${voidReason}`,
        },
      });
    });

    return NextResponse.json({
      success: true,
      message: `ยกเลิกใบเสร็จ ${receipt.receiptNo} เรียบร้อยแล้ว พร้อมปรับปรุงยอดคงค้างในระบบ`,
    });
  } catch (error: any) {
    console.error('Void receipt error:', error);
    return NextResponse.json({ error: error.message || 'Failed to void receipt' }, { status: 500 });
  }
}
