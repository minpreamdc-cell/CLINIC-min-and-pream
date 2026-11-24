export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkRolePermission } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tab = searchParams.get('tab') || 'dashboard';
    const startDate = searchParams.get('startDate') || new Date().toISOString().split('T')[0];
    const endDate = searchParams.get('endDate') || startDate;
    const doctorId = searchParams.get('doctorId');

    // Role check: Only ADMIN, FINANCE, and DENTIST can access reports
    const { authorized } = await checkRolePermission(['ADMIN', 'FINANCE', 'DENTIST']);
    if (!authorized) {
      return NextResponse.json({ error: 'คุณไม่มีสิทธิ์เข้าถึงรายงาน' }, { status: 403 });
    }

    const startDateTime = new Date(`${startDate}T00:00:00.000Z`);
    const endDateTime = new Date(`${endDate}T23:59:59.999Z`);

    // 1. Dashboard summary stats
    if (tab === 'dashboard') {
      const [visits, appointments, payments, receipts, invoices] = await Promise.all([
        prisma.visit.findMany({
          where: { visitDate: { gte: startDate, lte: endDate } },
        }),
        prisma.appointment.findMany({
          where: { date: { gte: startDate, lte: endDate } },
        }),
        prisma.payment.findMany({
          where: {
            paymentDate: { gte: startDateTime, lte: endDateTime },
            isDepositUse: false, // Cash-basis actual collected money
          },
        }),
        prisma.receipt.findMany({
          where: {
            receiptDate: { gte: startDateTime, lte: endDateTime },
            isVoided: false,
          },
        }),
        prisma.invoice.findMany({
          where: {
            createdAt: { gte: startDateTime, lte: endDateTime },
            status: { not: 'CANCELLED' },
          },
        }),
      ]);

      const totalVisits = visits.length;
      const newAppointments = appointments.filter((a) => a.status === 'BOOKED' || a.status === 'CONFIRMED').length;
      const noShows = appointments.filter((a) => a.status === 'NO_SHOW').length;
      const totalRevenueBilled = invoices.reduce((s, i) => s + i.netAmount, 0);
      const totalCashCollected = payments.reduce((s, p) => s + p.amount, 0);
      const totalOutstanding = invoices.reduce((s, i) => s + i.balanceDue, 0);

      // Hourly patient distribution for peak hours analytics
      const hourlyDistribution: Record<number, number> = {};
      for (let h = 8; h <= 20; h++) hourlyDistribution[h] = 0;
      for (const v of visits) {
        const hour = new Date(v.checkInTime).getHours();
        if (hourlyDistribution[hour] !== undefined) hourlyDistribution[hour]++;
      }

      return NextResponse.json({
        totalVisits,
        newAppointments,
        noShows,
        totalRevenueBilled,
        totalCashCollected,
        totalOutstanding,
        hourlyDistribution,
      });
    }

    // 2. Treatments breakdown (รายการรักษา)
    if (tab === 'treatments') {
      const treatmentWhere: any = {
        createdAt: { gte: startDateTime, lte: endDateTime },
      };
      if (doctorId && doctorId !== 'all') treatmentWhere.doctorId = doctorId;

      const items = await prisma.treatmentItem.findMany({
        where: treatmentWhere,
        include: { doctor: true, patient: true, invoice: true },
        orderBy: { createdAt: 'desc' },
      });
      return NextResponse.json({ items });
    }

    // 3. Receipts report (ใบเสร็จรับเงิน)
    if (tab === 'receipts') {
      const receipts = await prisma.receipt.findMany({
        where: {
          receiptDate: { gte: startDateTime, lte: endDateTime },
        },
        include: { patient: true, invoice: true },
        orderBy: { receiptDate: 'desc' },
      });
      return NextResponse.json({ receipts });
    }

    // 4. Payment methods breakdown (วิธีชำระเงิน - Cash basis)
    if (tab === 'payment-methods') {
      const payments = await prisma.payment.findMany({
        where: {
          paymentDate: { gte: startDateTime, lte: endDateTime },
        },
        include: {
          invoice: {
            include: { patient: true },
          },
        },
        orderBy: { paymentDate: 'desc' },
      });

      const summaryByMethod: Record<string, { count: number; total: number }> = {
        CASH: { count: 0, total: 0 },
        TRANSFER: { count: 0, total: 0 },
        CREDIT_CARD: { count: 0, total: 0 },
        QR: { count: 0, total: 0 },
        DEPOSIT_USE: { count: 0, total: 0 },
      };

      for (const p of payments) {
        const m = p.paymentMethod;
        if (!summaryByMethod[m]) summaryByMethod[m] = { count: 0, total: 0 };
        summaryByMethod[m].count++;
        summaryByMethod[m].total += p.amount;
      }

      return NextResponse.json({ payments, summaryByMethod });
    }

    // 5. Doctor Fee (DF) summary & details (รายได้แพทย์)
    if (tab === 'doctor-fees') {
      const treatmentWhere: any = {
        createdAt: { gte: startDateTime, lte: endDateTime },
        status: { in: ['BILLED', 'PENDING'] },
      };
      if (doctorId && doctorId !== 'all') treatmentWhere.doctorId = doctorId;

      const items = await prisma.treatmentItem.findMany({
        where: treatmentWhere,
        include: { doctor: true, patient: true },
        orderBy: { createdAt: 'desc' },
      });

      // Group by doctor
      const doctorSummary: Record<string, { doctorName: string; totalRevenue: number; totalDf: number; totalLab: number; count: number }> = {};
      for (const it of items) {
        const dId = it.doctorId;
        if (!doctorSummary[dId]) {
          doctorSummary[dId] = {
            doctorName: it.doctor.fullName,
            totalRevenue: 0,
            totalDf: 0,
            totalLab: 0,
            count: 0,
          };
        }
        doctorSummary[dId].totalRevenue += it.netAmount;
        doctorSummary[dId].totalDf += it.dfFinal;
        doctorSummary[dId].totalLab += it.labCostDeducted;
        doctorSummary[dId].count++;
      }

      return NextResponse.json({ items, doctorSummary: Object.values(doctorSummary) });
    }

    // 6. Lab expenses (ค่าแลปและงานแลป)
    if (tab === 'lab-expenses') {
      const labWhere: any = {
        dueDate: { gte: startDateTime, lte: endDateTime },
      };
      if (doctorId && doctorId !== 'all') labWhere.doctorId = doctorId;

      const orders = await prisma.labOrder.findMany({
        where: labWhere,
        include: { doctor: true, patient: true },
        orderBy: { dueDate: 'desc' },
      });

      const totalCost = orders.reduce((s, o) => s + o.cost, 0);
      const doctorDeducted = orders.filter((o) => o.deductionType === 'DOCTOR').reduce((s, o) => s + o.cost, 0);
      const clinicExpense = orders.filter((o) => o.deductionType === 'CLINIC').reduce((s, o) => s + o.cost, 0);

      return NextResponse.json({ orders, totalCost, doctorDeducted, clinicExpense });
    }

    // 7. Voided receipts (ใบเสร็จยกเลิก)
    if (tab === 'voided-receipts') {
      const voided = await prisma.receipt.findMany({
        where: {
          isVoided: true,
          voidedAt: { gte: startDateTime, lte: endDateTime },
        },
        include: { patient: true, invoice: true },
        orderBy: { voidedAt: 'desc' },
      });
      return NextResponse.json({ voided });
    }

    // 8. Accounts receivable / Outstanding balance (ยอดค้างชำระ)
    if (tab === 'outstanding') {
      const invoices = await prisma.invoice.findMany({
        where: {
          balanceDue: { gt: 0 },
          status: { in: ['UNPAID', 'PARTIALLY_PAID'] },
        },
        include: {
          patient: true,
          payments: true,
          visit: { include: { doctor: true } },
        },
        orderBy: { createdAt: 'desc' },
      });
      const totalOutstanding = invoices.reduce((s, i) => s + i.balanceDue, 0);
      return NextResponse.json({ invoices, totalOutstanding });
    }

    // 9. Discounts given (ส่วนลด)
    if (tab === 'discounts') {
      const invoicesWithDiscount = await prisma.invoice.findMany({
        where: {
          totalDiscount: { gt: 0 },
          createdAt: { gte: startDateTime, lte: endDateTime },
        },
        include: { patient: true, treatmentItems: true },
        orderBy: { createdAt: 'desc' },
      });
      const totalDiscounts = invoicesWithDiscount.reduce((s, i) => s + i.totalDiscount, 0);
      return NextResponse.json({ invoices: invoicesWithDiscount, totalDiscounts });
    }

    // 10. Insurance Claims (ลูกหนี้สิทธิ)
    if (tab === 'insurance') {
      const claims = await prisma.insuranceClaim.findMany({
        where: {
          submittedDate: { gte: startDateTime, lte: endDateTime },
        },
        include: {
          invoice: { include: { patient: true } },
        },
        orderBy: { submittedDate: 'desc' },
      });
      return NextResponse.json({ claims });
    }

    return NextResponse.json({ error: 'Unknown tab' }, { status: 400 });
  } catch (error) {
    console.error('Reports API error:', error);
    return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 });
  }
}
