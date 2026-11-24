import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const lowStock = searchParams.get('lowStock') === 'true';
    const search = searchParams.get('search');

    const where: any = { isActive: true };
    if (category && category !== 'all') where.category = category;
    if (search) {
      where.OR = [
        { code: { contains: search } },
        { name: { contains: search } },
      ];
    }

    let items = await prisma.inventoryItem.findMany({
      where,
      include: {
        stocks: true,
        _count: { select: { movements: true } },
      },
      orderBy: { name: 'asc' },
    });

    if (lowStock) {
      items = items.filter((item) => item.currentStock <= item.minStockAlert);
    }

    return NextResponse.json({ items });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch inventory items' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { code, name, category = 'DRUG', unit, minStockAlert = 10, currentStock = 0, costPrice = 0, salePrice = 0 } = body;

    if (!code || !name || !unit) {
      return NextResponse.json({ error: 'กรุณากรอกรหัส ชื่อ และหน่วยนับ' }, { status: 400 });
    }

    const item = await prisma.inventoryItem.create({
      data: {
        code,
        name,
        category,
        unit,
        minStockAlert: Number(minStockAlert),
        currentStock: Number(currentStock),
        costPrice: Number(costPrice),
        salePrice: Number(salePrice),
        isActive: true,
      },
    });

    return NextResponse.json({ success: true, item });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create inventory item' }, { status: 500 });
  }
}
