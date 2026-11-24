import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const receipt = await prisma.receipt.findUnique({
      where: { id: params.id },
      include: {
        patient: true,
        invoice: {
          include: {
            treatmentItems: {
              include: { doctor: true },
            },
            payments: true,
            branch: true,
          },
        },
      },
    });

    if (!receipt) {
      return NextResponse.json({ error: 'ไม่พบใบเสร็จรับเงิน' }, { status: 404 });
    }

    const setting = await prisma.clinicSetting.findUnique({ where: { id: 'default' } });

    // Update printed count
    await prisma.receipt.update({
      where: { id: params.id },
      data: { printedCount: { increment: 1 } },
    });

    return NextResponse.json({ receipt, setting });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch receipt' }, { status: 500 });
  }
}
