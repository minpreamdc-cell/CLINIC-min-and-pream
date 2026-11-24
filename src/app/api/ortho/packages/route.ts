import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const packages = await prisma.orthoPackage.findMany({
      where: { isActive: true },
      include: {
        _count: { select: { patientPackages: true } },
      },
      orderBy: { totalAmount: 'asc' },
    });
    return NextResponse.json({ packages });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch ortho packages' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, totalAmount, downPayment, installmentCount, installmentAmount, description } = body;

    const newPkg = await prisma.orthoPackage.create({
      data: {
        name,
        totalAmount: Number(totalAmount),
        downPayment: Number(downPayment),
        installmentCount: Number(installmentCount),
        installmentAmount: Number(installmentAmount),
        description: description || null,
        isActive: true,
      },
    });

    return NextResponse.json({ success: true, package: newPkg });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create package' }, { status: 500 });
  }
}
