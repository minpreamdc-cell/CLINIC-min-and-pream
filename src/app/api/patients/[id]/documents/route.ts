import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const documents = await prisma.patientDocument.findMany({
      where: { patientId: params.id },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ documents });
  } catch (error) {
    console.error('GET documents error:', error);
    return NextResponse.json({ error: 'Failed to load documents' }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    const body = await req.json();

    const doc = await prisma.patientDocument.create({
      data: {
        patientId: params.id,
        category: body.category || 'XRAY',
        title: body.title || 'เอกสารแนบ',
        fileUrl: body.fileUrl || '',
        fileType: body.fileType || 'image/png',
        fileSize: body.fileSize || 0,
        uploadedBy: user?.fullName || 'เจ้าหน้าที่คลินิก',
      },
    });

    return NextResponse.json({ success: true, document: doc });
  } catch (error: any) {
    console.error('POST document error:', error);
    return NextResponse.json({ error: error.message || 'Upload failed' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(req.url);
    const docId = searchParams.get('docId');
    if (!docId) {
      return NextResponse.json({ error: 'Missing docId' }, { status: 400 });
    }
    await prisma.patientDocument.delete({
      where: { id: docId },
    });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Delete failed' }, { status: 500 });
  }
}
