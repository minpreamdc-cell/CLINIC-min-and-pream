import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const items = await prisma.treatmentItem.findMany({
      where: { visitId: params.id },
      include: { doctor: true },
      orderBy: { createdAt: 'asc' },
    });
    return NextResponse.json({ items });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch treatment items' }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    const body = await req.json();
    const {
      toothNumber,
      procedureCode,
      procedureName,
      category = 'GENERAL',
      qty = 1,
      unitPrice,
      discountAmount = 0,
      customDfRate,
      labCostDeducted = 0,
    } = body;

    const visit = await prisma.visit.findUnique({
      where: { id: params.id },
      include: { doctor: true, patient: true },
    });

    if (!visit) {
      return NextResponse.json({ error: 'ไม่พบข้อมูลการมารักษา' }, { status: 404 });
    }

    const clinicSetting = await prisma.clinicSetting.findUnique({ where: { id: 'default' } });
    const deductLabFirst = clinicSetting?.defaultDfDeductLab ?? true;
    const baseOnNet = clinicSetting?.defaultDfBaseNet ?? true;

    // Fetch procedure catalog for default pricing and DF rate
    const procCatalog = await prisma.procedureCatalog.findUnique({
      where: { code: procedureCode },
    });

    const finalUnitPrice = unitPrice !== undefined ? Number(unitPrice) : (procCatalog?.defaultPrice || 0);
    const finalQty = Number(qty);
    const finalDiscount = Number(discountAmount);
    const grossAmount = finalUnitPrice * finalQty;
    const netAmount = Math.max(0, grossAmount - finalDiscount);

    // Calculate DF Rate snapshot
    let dfType = procCatalog?.defaultDfType || 'PERCENT';
    let dfRate = customDfRate !== undefined ? Number(customDfRate) : (procCatalog?.defaultDfRate || visit.doctor.defaultDfRate || 50.0);

    // Base for DF calculation
    const baseAmountForDf = baseOnNet ? netAmount : grossAmount;
    let dfCalculated = 0;
    if (dfType === 'PERCENT') {
      dfCalculated = (baseAmountForDf * dfRate) / 100;
    } else {
      dfCalculated = dfRate * finalQty;
    }

    // Apply lab cost deduction if applicable
    const labDeduction = deductLabFirst ? Number(labCostDeducted) : 0;
    const dfFinal = Math.max(0, dfCalculated - labDeduction);

    // Run in transaction to insert treatment item and execute auto stock deduction
    const result = await prisma.$transaction(async (tx) => {
      const treatmentItem = await tx.treatmentItem.create({
        data: {
          visitId: visit.id,
          patientId: visit.patientId,
          doctorId: visit.doctorId,
          toothNumber: toothNumber ? String(toothNumber) : null,
          procedureCode,
          procedureName: procedureName || procCatalog?.nameTh || procedureCode,
          category,
          qty: finalQty,
          unitPrice: finalUnitPrice,
          discountAmount: finalDiscount,
          netAmount,
          dfType,
          dfRate,
          dfCalculated,
          labCostDeducted: labDeduction,
          dfFinal,
          stockDeducted: true,
          status: 'PENDING',
        },
      });

      // Stock deduction linked to procedure
      const stockLinks = await tx.procedureStockLink.findMany({
        where: { procedureCode },
        include: { inventoryItem: true },
      });

      for (const link of stockLinks) {
        const deductQty = link.requiredQty * finalQty;
        // Decrease stock
        const updatedItem = await tx.inventoryItem.update({
          where: { id: link.inventoryItemId },
          data: {
            currentStock: { decrement: deductQty },
          },
        });

        // Record stock movement
        await tx.inventoryMovement.create({
          data: {
            itemId: link.inventoryItemId,
            movementType: 'PROCEDURE_USE',
            qty: -deductQty,
            balanceAfter: updatedItem.currentStock,
            referenceType: 'VISIT',
            referenceId: visit.id,
            reason: `ตัดใช้วัสดุอัตโนมัติตามหัตถการ ${treatmentItem.procedureName} (ซี่ ${toothNumber || '-'})`,
            performedBy: user?.fullName || 'ระบบอัตโนมัติ',
          },
        });
      }

      return treatmentItem;
    });

    return NextResponse.json({ success: true, treatmentItem: result });
  } catch (error: any) {
    console.error('Create treatment item error:', error);
    return NextResponse.json({ error: error.message || 'Failed to add treatment item' }, { status: 500 });
  }
}
