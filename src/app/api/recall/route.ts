export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const [patients, visits, appointments, orthoPackages] = await Promise.all([
      prisma.patient.findMany({
        include: {
          attendingDoctor: true,
          visits: {
            orderBy: { visitDate: 'desc' },
            take: 1,
            include: { treatmentItems: true, doctor: true },
          },
          appointments: {
            orderBy: { date: 'desc' },
            take: 1,
          },
        },
      }),
      prisma.visit.findMany({
        include: {
          patient: true,
          doctor: true,
          treatmentItems: true,
        },
        orderBy: { visitDate: 'desc' },
        take: 30,
      }),
      prisma.appointment.findMany({
        where: { status: { in: ['BOOKED', 'CONFIRMED'] } },
        include: { patient: true, doctor: true, room: true },
        orderBy: { date: 'asc' },
      }),
      prisma.patientOrthoPackage.findMany({
        where: { status: 'ACTIVE' },
        include: {
          patient: true,
          installments: true,
          adjustmentLogs: { orderBy: { date: 'desc' }, take: 1 },
        },
      }),
    ]);

    // 1. 6-Month Dental Scaling & Checkup Recall List
    const sixMonthRecalls = patients.map((p) => {
      const lastVisit = p.visits[0];
      const lastDate = lastVisit?.visitDate || p.createdAt.toISOString().split('T')[0];
      return {
        id: p.id,
        dn: p.dn,
        patientName: `${p.title} ${p.firstNameTh} ${p.lastNameTh}`,
        phone: p.phone,
        lastVisitDate: lastDate,
        lastProcedure: lastVisit?.treatmentItems?.[0]?.procedureName || 'ตรวจสุขภาพช่องปากและขูดหินปูน',
        doctorName: p.attendingDoctor?.nickname || lastVisit?.doctor?.nickname || 'หมอมิน',
        recommendedAction: 'ครบกำหนดตรวจสุขภาพฟันและขูดหินปูนประจำ 6 เดือน',
      };
    });

    // 2. Orthodontic Monthly Adjustment Follow-ups
    const orthoRecalls = orthoPackages.map((pkg) => {
      const paidCount = pkg.installments.filter((i) => i.status === 'PAID').length;
      const totalCount = pkg.installments.length;
      return {
        id: pkg.id,
        patientId: pkg.patientId,
        dn: pkg.patient.dn,
        patientName: `${pkg.patient.title} ${pkg.patient.firstNameTh} ${pkg.patient.lastNameTh}`,
        phone: pkg.patient.phone,
        packageName: pkg.packageName,
        progress: `ผ่อนแล้ว ${paidCount}/${totalCount} งวด`,
        balanceDue: pkg.balanceDue,
        nextTarget: pkg.adjustmentLogs[0]?.nextVisitTarget || 'นัดปรับเครื่องมือและเปลี่ยนยางดึงฟันประจำเดือน',
      };
    });

    // 3. Post-Care Call List (คนไข้หลังทำหัตถการ ถอนฟัน/รักษาราก/ครอบฟัน ที่ต้องโทรหรือส่ง LINE ถามอาการ)
    const postCareList = visits.slice(0, 8).map((v) => ({
      visitId: v.id,
      patientId: v.patientId,
      dn: v.patient.dn,
      patientName: `${v.patient.title} ${v.patient.firstNameTh} ${v.patient.lastNameTh}`,
      phone: v.patient.phone,
      visitDate: v.visitDate,
      doctorName: v.doctor.nickname || v.doctor.fullName,
      procedureSummary:
        v.treatmentItems.map((t) => t.procedureName).join(', ') || 'ตรวจและรักษาทางทันตกรรม',
      allergies: v.patient.drugAllergies,
    }));

    return NextResponse.json({
      sixMonthRecalls,
      orthoRecalls,
      postCareList,
      upcomingAppointments: appointments,
    });
  } catch (error) {
    console.error('Recall API error:', error);
    return NextResponse.json({ error: 'Failed to load recall data' }, { status: 500 });
  }
}
