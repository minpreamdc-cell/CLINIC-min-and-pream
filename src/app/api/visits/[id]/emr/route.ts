import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkRolePermission, getCurrentUser } from '@/lib/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // SECURITY: Non-authorized roles cannot view EMR
    const { authorized, user } = await checkRolePermission(['ADMIN', 'DENTIST', 'ASSISTANT']);
    if (!authorized || !user) {
      return NextResponse.json(
        { error: 'คุณไม่มีสิทธิ์เข้าถึงเวชระเบียน (สิทธิ์เฉพาะทันตแพทย์และผู้ช่วย)' },
        { status: 403 }
      );
    }

    const visit = await prisma.visit.findUnique({
      where: { id: params.id },
      include: {
        patient: true,
        doctor: true,
        room: true,
        medicalRecord: true,
        treatmentItems: true,
        prescriptionItems: true,
      },
    });

    if (!visit) {
      return NextResponse.json({ error: 'ไม่พบข้อมูลการมารักษา' }, { status: 404 });
    }

    return NextResponse.json({ visit, medicalRecord: visit.medicalRecord });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch EMR' }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Only DENTIST and ADMIN can write / sign EMR
    const { authorized, user } = await checkRolePermission(['ADMIN', 'DENTIST']);
    if (!authorized || !user) {
      return NextResponse.json(
        { error: 'คุณไม่มีสิทธิ์บันทึกหรือลงนามเวชระเบียน' },
        { status: 403 }
      );
    }

    const visit = await prisma.visit.findUnique({
      where: { id: params.id },
      include: { medicalRecord: true },
    });

    if (!visit) {
      return NextResponse.json({ error: 'ไม่พบข้อมูลการมารักษา' }, { status: 404 });
    }

    const body = await req.json();
    const {
      chiefComplaint,
      physicalExam,
      diagnosis,
      treatmentDescription,
      advice,
      followUpPlan,
      signNow = false,
      editReason,
    } = body;

    const existingRecord = visit.medicalRecord;

    // If existing record was already signed, editing requires an editReason!
    if (existingRecord && existingRecord.isSigned && !editReason) {
      return NextResponse.json(
        { error: 'เวชระเบียนนี้ได้รับการลงนามแล้ว การแก้ไขจำเป็นต้องระบุเหตุผลในการแก้ไข' },
        { status: 400 }
      );
    }

    let previousVersionJson: string | null = null;
    if (existingRecord && existingRecord.isSigned) {
      previousVersionJson = JSON.stringify({
        chiefComplaint: existingRecord.chiefComplaint,
        physicalExam: existingRecord.physicalExam,
        diagnosis: existingRecord.diagnosis,
        treatmentDescription: existingRecord.treatmentDescription,
        advice: existingRecord.advice,
        followUpPlan: existingRecord.followUpPlan,
        signedAt: existingRecord.signedAt,
        signedByDoctorId: existingRecord.signedByDoctorId,
      });

      // Audit Log
      await prisma.auditLog.create({
        data: {
          userId: user.id,
          userName: user.fullName,
          action: 'EMR_UPDATE_POST_SIGNING',
          entityType: 'MedicalRecord',
          entityId: existingRecord.id,
          details: `แก้ไขเวชระเบียนหลังลงนาม เหตุผล: ${editReason}`,
        },
      });
    }

    const recordData = {
      chiefComplaint: chiefComplaint || null,
      physicalExam: physicalExam || null,
      diagnosis: diagnosis || null,
      treatmentDescription: treatmentDescription || null,
      advice: advice || null,
      followUpPlan: followUpPlan || null,
      isDraft: !signNow,
      isSigned: signNow || (existingRecord ? existingRecord.isSigned : false),
      signedAt: signNow ? new Date() : existingRecord?.signedAt,
      signedByDoctorId: signNow ? (user.doctorId || user.id) : existingRecord?.signedByDoctorId,
      previousVersionJson: previousVersionJson || existingRecord?.previousVersionJson || null,
      editReason: editReason || existingRecord?.editReason || null,
    };

    let medicalRecord;
    if (existingRecord) {
      medicalRecord = await prisma.medicalRecord.update({
        where: { id: existingRecord.id },
        data: recordData,
      });
    } else {
      medicalRecord = await prisma.medicalRecord.create({
        data: {
          visitId: visit.id,
          patientId: visit.patientId,
          doctorId: visit.doctorId,
          ...recordData,
        },
      });
    }

    return NextResponse.json({
      success: true,
      medicalRecord,
      message: signNow ? 'ลงนามรับรองเวชระเบียนเรียบร้อย' : 'บันทึกฉบับร่างเรียบร้อย',
    });
  } catch (error: any) {
    console.error('Save EMR error:', error);
    return NextResponse.json({ error: error.message || 'Failed to save EMR' }, { status: 500 });
  }
}
