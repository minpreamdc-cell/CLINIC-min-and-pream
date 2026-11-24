import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const itemId = searchParams.get('itemId');
    const where: any = {};
    if (itemId) where.itemId = itemId;

    const movements = await prisma.inventoryMovement.findMany({
      where,
      include: { item: true },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    return NextResponse.json({ movements });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch inventory movements' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    const body = await req.json();
    const { itemId, movementType, qty, reason } = body;

    if (!itemId || !movementType || qty === undefined) {
      return NextResponse.json({ error: 'itemId, movementType and qty are required' }, { status: 400 });
    }

    const item = await prisma.inventoryItem.findUnique({ where: { id: itemId } });
    if (!item) {
      return NextResponse.json({ error: 'ไม่พบรายการสินค้า' }, { status: 404 });
    }

    const numericQty = Number(qty);
    let delta = 0;
    let newBalance = item.currentStock;

    if (movementType === 'RECEIVE' || movementType === 'RETURN') {
      delta = Math.abs(numericQty);
      newBalance = item.currentStock + delta;
    } else if (movementType === 'DISPENSE') {
      delta = -Math.abs(numericQty);
      if (item.currentStock < Math.abs(numericQty)) {
        return NextResponse.json(
          { error: `สต๊อกคงเหลือไม่พอเบิก (คงเหลือ ${item.currentStock} ${item.unit})` },
          { status: 400 }
        );
      }
      newBalance = item.currentStock + delta;
    } else if (movementType === 'ADJUST' || movementType === 'COUNT') {
      // Direct adjustment or physical count
      newBalance = Math.max(0, numericQty);
      delta = newBalance - item.currentStock;
    }

    const result = await prisma.$transaction(async (tx) => {
      const updatedItem = await tx.inventoryItem.update({
        where: { id: itemId },
        data: { currentStock: newBalance },
      });

      const movement = await tx.inventoryMovement.create({
        data: {
          itemId,
          movementType,
          qty: delta,
          balanceAfter: newBalance,
          reason: reason || `ทำรายการ ${movementType}`,
          performedBy: user?.fullName || 'เจ้าหน้าที่คลัง',
        },
      });

      return { updatedItem, movement };
    });

    return NextResponse.json({ success: true, ...result });
  } catch (error: any) {
    console.error('Inventory movement error:', error);
    return NextResponse.json({ error: error.message || 'Movement failed' }, { status: 500 });
  }
}
