import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const patientId = searchParams.get('patientId');
    const where: any = {};
    if (patientId) where.patientId = patientId;

    const packages = await prisma.patientOrthoPackage.findMany({
      where,
      include: {
        patient: true,
        package: true,
        installments: {
          orderBy: { installmentNo: 'asc' },
        },
        adjustmentLogs: {
          orderBy: { date: 'desc' },
        },
      },
      orderBy: { startedDate: 'desc' },
    });

    return NextResponse.json({ patientPackages: packages });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch patient ortho packages' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    const body = await req.json();
    const { action, patientId, packageId, notes, patientOrthoPackageId, upperArchWire, lowerArchWire, elasticNotes, procedureNotes, nextVisitTarget } = body;

    // 1. Record Adjustment Log
    if (action === 'ADJUSTMENT_LOG') {
      if (!patientOrthoPackageId) {
        return NextResponse.json({ error: 'patientOrthoPackageId is required' }, { status: 400 });
      }

      const log = await prisma.orthoAdjustmentLog.create({
        data: {
          patientOrthoPackageId,
          upperArchWire: upperArchWire || null,
          lowerArchWire: lowerArchWire || null,
          elasticNotes: elasticNotes || null,
          procedureNotes: procedureNotes || 'ปรับเครื่องมือจัดฟันประจำเดือน',
          doctorId: user?.doctorId || null,
          nextVisitTarget: nextVisitTarget || null,
        },
      });

      return NextResponse.json({ success: true, log });
    }

    // 2. Assign package to patient
    if (!patientId || !packageId) {
      return NextResponse.json({ error: 'patientId and packageId are required' }, { status: 400 });
    }

    const masterPkg = await prisma.orthoPackage.findUnique({ where: { id: packageId } });
    if (!masterPkg) {
      return NextResponse.json({ error: 'ไม่พบแพ็กเกจจัดฟัน' }, { status: 404 });
    }

    const result = await prisma.$transaction(async (tx) => {
      // Create snapshot package
      const patientPkg = await tx.patientOrthoPackage.create({
        data: {
          patientId,
          packageId: masterPkg.id,
          packageName: masterPkg.name,
          totalAmount: masterPkg.totalAmount,
          downPayment: masterPkg.downPayment,
          paidAmount: 0,
          balanceDue: masterPkg.totalAmount,
          status: 'ACTIVE',
          notes: notes || null,
        },
      });

      // Generate planned installment entries
      for (let i = 1; i <= masterPkg.installmentCount; i++) {
        await tx.orthoInstallment.create({
          data: {
            patientOrthoPackageId: patientPkg.id,
            installmentNo: i,
            plannedAmount: masterPkg.installmentAmount,
            paidAmount: 0,
            status: 'PENDING',
          },
        });
      }

      return patientPkg;
    });

    return NextResponse.json({ success: true, patientPackage: result });
  } catch (error: any) {
    console.error('Assign ortho package error:', error);
    return NextResponse.json({ error: error.message || 'Failed' }, { status: 500 });
  }
}
