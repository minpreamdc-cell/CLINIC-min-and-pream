import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const visitId = searchParams.get('visitId');
    const patientId = searchParams.get('patientId');
    const status = searchParams.get('status');

    const where: any = {};
    if (visitId) where.visitId = visitId;
    if (patientId) where.patientId = patientId;
    if (status && status !== 'all') where.status = status;

    const invoices = await prisma.invoice.findMany({
      where,
      include: {
        patient: true,
        treatmentItems: {
          include: { doctor: true },
        },
        payments: true,
        receipts: true,
        visit: {
          include: { doctor: true, room: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ invoices });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch invoices' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    const body = await req.json();
    const { visitId, notes } = body;

    if (!visitId) {
      return NextResponse.json({ error: 'visitId is required' }, { status: 400 });
    }

    const visit = await prisma.visit.findUnique({
      where: { id: visitId },
      include: {
        treatmentItems: true,
        invoices: true,
      },
    });

    if (!visit) {
      return NextResponse.json({ error: 'ไม่พบข้อมูลการมารักษา' }, { status: 404 });
    }

    // If an unpaid/active invoice already exists for this visit, return it
    const activeInvoice = visit.invoices.find((inv) => inv.status !== 'CANCELLED');
    if (activeInvoice) {
      const fullInvoice = await prisma.invoice.findUnique({
        where: { id: activeInvoice.id },
        include: {
          patient: true,
          treatmentItems: true,
          payments: true,
          receipts: true,
        },
      });
      return NextResponse.json({ success: true, invoice: fullInvoice });
    }

    // Calculate totals from treatment items
    const items = visit.treatmentItems.filter((i) => i.status !== 'CANCELLED');
    const totalAmount = items.reduce((sum, item) => sum + item.unitPrice * item.qty, 0);
    const totalDiscount = items.reduce((sum, item) => sum + item.discountAmount, 0);
    const netAmount = Math.max(0, totalAmount - totalDiscount);

    // Generate Invoice Number: INV-YYYY-XXXX
    const currentYear = new Date().getFullYear();
    const setting = await prisma.clinicSetting.findUnique({ where: { id: 'default' } });
    const nextInvNum = setting?.nextInvoiceNumber || 1001;
    const invoiceNo = `INV-${currentYear}-${String(nextInvNum).padStart(4, '0')}`;

    const defaultBranch = await prisma.branch.findFirst({ where: { isDefault: true } });
    const branchId = defaultBranch?.id || visit.branchId;

    const result = await prisma.$transaction(async (tx) => {
      // Update setting
      await tx.clinicSetting.update({
        where: { id: 'default' },
        data: { nextInvoiceNumber: nextInvNum + 1 },
      });

      // Create invoice
      const newInvoice = await tx.invoice.create({
        data: {
          invoiceNo,
          visitId: visit.id,
          patientId: visit.patientId,
          branchId,
          totalAmount,
          totalDiscount,
          netAmount,
          paidAmount: 0,
          balanceDue: netAmount,
          status: 'UNPAID',
          notes: notes || null,
          createdBy: user?.fullName || 'เจ้าหน้าที่การเงิน',
        },
      });

      // Link treatment items to this invoice
      for (const it of items) {
        await tx.treatmentItem.update({
          where: { id: it.id },
          data: {
            invoiceId: newInvoice.id,
            status: 'BILLED',
          },
        });
      }

      // Update visit status to WAITING_PAYMENT if still in exam
      if (visit.status === 'IN_EXAM' || visit.status === 'WAITING_EXAM') {
        await tx.visit.update({
          where: { id: visit.id },
          data: { status: 'WAITING_PAYMENT' },
        });
      }

      return newInvoice;
    });

    const fullInvoice = await prisma.invoice.findUnique({
      where: { id: result.id },
      include: {
        patient: true,
        treatmentItems: true,
        payments: true,
        receipts: true,
      },
    });

    return NextResponse.json({ success: true, invoice: fullInvoice });
  } catch (error: any) {
    console.error('Create invoice error:', error);
    return NextResponse.json({ error: error.message || 'Failed to create invoice' }, { status: 500 });
  }
}
