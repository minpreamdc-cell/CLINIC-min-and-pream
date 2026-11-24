import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    const body = await req.json();
    const { payments, paymentDate, notes } = body;

    if (!payments || !Array.isArray(payments) || payments.length === 0) {
      return NextResponse.json({ error: 'กรุณาระบุรายการชำระเงิน' }, { status: 400 });
    }

    const payDate = paymentDate ? new Date(paymentDate) : new Date();

    const invoice = await prisma.invoice.findUnique({
      where: { id: params.id },
      include: {
        patient: true,
        visit: true,
        treatmentItems: true,
      },
    });

    if (!invoice) {
      return NextResponse.json({ error: 'ไม่พบใบแจ้งค่ารักษา' }, { status: 404 });
    }

    if (invoice.status === 'PAID') {
      return NextResponse.json({ error: 'ใบแจ้งค่ารักษานี้ชำระครบถ้วนแล้ว ไม่สามารถรับชำระซ้ำได้' }, { status: 400 });
    }

    // Calculate total this batch
    const totalBatchPaid = payments.reduce((sum, p) => sum + Number(p.amount || 0), 0);
    if (totalBatchPaid <= 0) {
      return NextResponse.json({ error: 'ยอดชำระต้องมากกว่า 0 บาท' }, { status: 400 });
    }

    // Check if deposit usage exceeds available deposit balance
    const depositPayment = payments.find((p) => p.method === 'DEPOSIT_USE');
    if (depositPayment) {
      const depositAmount = Number(depositPayment.amount);
      if (invoice.patient.depositBalance < depositAmount) {
        return NextResponse.json(
          {
            error: `ยอดเงินมัดจำของคนไข้ไม่เพียงพอ (คงเหลือ ${invoice.patient.depositBalance.toFixed(2)} บาท, ต้องการใช้ ${depositAmount.toFixed(2)} บาท)`,
          },
          { status: 400 }
        );
      }
    }

    // Prevent paying more than balanceDue
    if (totalBatchPaid > invoice.balanceDue + 0.01) {
      return NextResponse.json(
        {
          error: `ยอดชำระ (${totalBatchPaid.toFixed(2)} บาท) เกินยอดค้างชำระ (${invoice.balanceDue.toFixed(2)} บาท)`,
        },
        { status: 400 }
      );
    }

    // Atomic transaction for payment, deposit deduction, receipt number generation
    const result = await prisma.$transaction(async (tx) => {
      // 1. Process each payment method
      const createdPayments = [];
      const methodSummaries: string[] = [];

      for (const p of payments) {
        const amt = Number(p.amount);
        if (amt <= 0) continue;

        const isDeposit = p.method === 'DEPOSIT_USE';

        const paymentRecord = await tx.payment.create({
          data: {
            invoiceId: invoice.id,
            paymentDate: payDate,
            amount: amt,
            paymentMethod: p.method,
            methodDetails: p.details || null,
            isDepositUse: isDeposit,
            receivedBy: user?.fullName || 'เจ้าหน้าที่การเงิน',
            notes: notes || null,
          },
        });

        createdPayments.push(paymentRecord);

        let methodNameThai = p.method;
        if (p.method === 'CASH') methodNameThai = 'เงินสด';
        else if (p.method === 'TRANSFER') methodNameThai = `โอนเงิน ${p.details ? `(${p.details})` : ''}`;
        else if (p.method === 'CREDIT_CARD') methodNameThai = `บัตรเครดิต ${p.details ? `(${p.details})` : ''}`;
        else if (p.method === 'QR') methodNameThai = 'PromptPay QR';
        else if (p.method === 'DEPOSIT_USE') methodNameThai = 'หักเงินมัดจำ';
        else if (p.method === 'INSURANCE_CLAIM') methodNameThai = 'เบิกสิทธิ/ลูกหนี้';

        methodSummaries.push(`${methodNameThai} ${amt.toLocaleString('th-TH', { minimumFractionDigits: 2 })} บาท`);

        // If deposit used, decrease patient deposit balance and record Deposit entry
        if (isDeposit) {
          const newBal = invoice.patient.depositBalance - amt;
          await tx.patient.update({
            where: { id: invoice.patientId },
            data: { depositBalance: newBal },
          });

          await tx.deposit.create({
            data: {
              patientId: invoice.patientId,
              date: payDate,
              type: 'USE',
              amount: amt,
              balanceAfter: newBal,
              relatedInvoiceId: invoice.id,
              paymentMethod: 'DEPOSIT_USE',
              notes: `นำเงินมัดจำมาหักชำระบิล ${invoice.invoiceNo}`,
              processedBy: user?.fullName || 'เจ้าหน้าที่การเงิน',
            },
          });
        }
      }

      // 2. Update Invoice totals
      const newPaidAmount = invoice.paidAmount + totalBatchPaid;
      const newBalanceDue = Math.max(0, invoice.netAmount - newPaidAmount);
      const newStatus = newBalanceDue <= 0.01 ? 'PAID' : 'PARTIALLY_PAID';

      const updatedInvoice = await tx.invoice.update({
        where: { id: invoice.id },
        data: {
          paidAmount: newPaidAmount,
          balanceDue: newBalanceDue,
          status: newStatus,
        },
      });

      // 3. Generate Sequential Receipt Number
      const currentYear = payDate.getFullYear();
      const setting = await tx.clinicSetting.findUnique({ where: { id: 'default' } });
      const nextRecNum = setting?.nextReceiptNumber || 1001;
      const receiptNo = `REC-${currentYear}-${String(nextRecNum).padStart(4, '0')}`;

      await tx.clinicSetting.update({
        where: { id: 'default' },
        data: { nextReceiptNumber: nextRecNum + 1 },
      });

      // 4. Create Receipt Record
      const receipt = await tx.receipt.create({
        data: {
          receiptNo,
          invoiceId: invoice.id,
          patientId: invoice.patientId,
          receiptDate: payDate,
          totalAmount: invoice.totalAmount,
          totalDiscount: invoice.totalDiscount,
          netAmount: invoice.netAmount,
          paidAmount: totalBatchPaid,
          paymentMethodSummary: methodSummaries.join(', '),
          createdBy: user?.fullName || 'เจ้าหน้าที่การเงิน',
        },
      });

      // 5. If fully paid, complete the visit
      if (newStatus === 'PAID') {
        await tx.visit.update({
          where: { id: invoice.visitId },
          data: { status: 'COMPLETED' },
        });
      }

      return { updatedInvoice, receipt };
    });

    return NextResponse.json({
      success: true,
      invoice: result.updatedInvoice,
      receipt: result.receipt,
      message: `ออกใบเสร็จเลขที่ ${result.receipt.receiptNo} เรียบร้อยแล้ว`,
    });
  } catch (error: any) {
    console.error('Payment error:', error);
    return NextResponse.json({ error: error.message || 'Payment processing failed' }, { status: 500 });
  }
}
