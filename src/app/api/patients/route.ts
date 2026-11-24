import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search');
    const doctorId = searchParams.get('doctorId');
    const rights = searchParams.get('rights');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.OR = [
        { firstNameTh: { contains: search } },
        { lastNameTh: { contains: search } },
        { firstNameEn: { contains: search } },
        { lastNameEn: { contains: search } },
        { dn: { contains: search } },
        { phone: { contains: search } },
        { idCardNumber: { contains: search } },
      ];
    }

    if (doctorId && doctorId !== 'all') {
      where.attendingDoctorId = doctorId;
    }

    if (rights && rights !== 'all') {
      where.rights = rights;
    }

    const [patients, total] = await Promise.all([
      prisma.patient.findMany({
        where,
        include: {
          attendingDoctor: true,
          visits: {
            orderBy: { checkInTime: 'desc' },
            take: 1,
          },
          appointments: {
            where: { status: { in: ['BOOKED', 'CONFIRMED'] } },
            orderBy: { date: 'asc' },
            take: 1,
          },
        },
        orderBy: [{ createdAt: 'desc' }],
        skip,
        take: limit,
      }),
      prisma.patient.count({ where }),
    ]);

    return NextResponse.json({
      patients,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('GET patients error:', error);
    return NextResponse.json({ error: 'Failed to fetch patients' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    const body = await req.json();
    const {
      dn,
      title = 'คุณ',
      firstNameTh,
      lastNameTh,
      firstNameEn,
      lastNameEn,
      gender = 'UNKNOWN',
      birthDate,
      idCardNumber,
      phone,
      secondaryPhone,
      email,
      address,
      emergencyContactName,
      emergencyContactPhone,
      emergencyRelation,
      rights = 'จ่ายเอง',
      attendingDoctorId,
      drugAllergies,
      chronicDiseases,
      currentMedications,
      marketingSource,
      notes,
      checkDuplicateOnly = false,
      force = false,
    } = body;

    if (!firstNameTh || !lastNameTh || !phone) {
      return NextResponse.json(
        { error: 'กรุณากรอกชื่อ นามสกุล และเบอร์โทรศัพท์' },
        { status: 400 }
      );
    }

    // Duplicate check: Check by phone or matching first and last name
    const potentialDuplicates = await prisma.patient.findMany({
      where: {
        OR: [
          { phone },
          {
            AND: [
              { firstNameTh: { equals: firstNameTh } },
              { lastNameTh: { equals: lastNameTh } },
            ],
          },
        ],
      },
      select: {
        id: true,
        dn: true,
        firstNameTh: true,
        lastNameTh: true,
        phone: true,
        birthDate: true,
      },
    });

    if (checkDuplicateOnly) {
      return NextResponse.json({
        hasDuplicates: potentialDuplicates.length > 0,
        duplicates: potentialDuplicates,
      });
    }

    if (potentialDuplicates.length > 0 && !force) {
      return NextResponse.json(
        {
          error: 'พบข้อมูลคนไข้ที่ใกล้เคียงกันในระบบ (เบอร์โทรหรือชื่อตรงกัน)',
          isWarning: true,
          duplicates: potentialDuplicates,
        },
        { status: 409 }
      );
    }

    // Determine unique DN
    let finalDn = dn?.trim();
    if (!finalDn) {
      // Generate next DN: e.g. DN-260005
      const currentYear = new Date().getFullYear().toString().slice(-2); // e.g. "26"
      const setting = await prisma.clinicSetting.findUnique({ where: { id: 'default' } });
      const nextNum = setting?.nextDnNumber || 1001;
      finalDn = `DN-${currentYear}${String(nextNum).padStart(4, '0')}`;

      // Update setting counter
      await prisma.clinicSetting.update({
        where: { id: 'default' },
        data: { nextDnNumber: nextNum + 1 },
      });
    } else {
      // Check if provided custom DN already exists
      const existingDn = await prisma.patient.findUnique({ where: { dn: finalDn } });
      if (existingDn) {
        return NextResponse.json({ error: `รหัสคนไข้ ${finalDn} นี้มีอยู่ในระบบแล้ว` }, { status: 400 });
      }
    }

    const patient = await prisma.patient.create({
      data: {
        dn: finalDn,
        title,
        firstNameTh,
        lastNameTh,
        firstNameEn: firstNameEn || null,
        lastNameEn: lastNameEn || null,
        gender,
        birthDate: birthDate || null,
        idCardNumber: idCardNumber || null,
        phone,
        secondaryPhone: secondaryPhone || null,
        email: email || null,
        address: address || null,
        emergencyContactName: emergencyContactName || null,
        emergencyContactPhone: emergencyContactPhone || null,
        emergencyRelation: emergencyRelation || null,
        rights,
        attendingDoctorId: attendingDoctorId || null,
        drugAllergies: drugAllergies || null,
        chronicDiseases: chronicDiseases || null,
        currentMedications: currentMedications || null,
        marketingSource: marketingSource || null,
        notes: notes || null,
      },
      include: {
        attendingDoctor: true,
      },
    });

    return NextResponse.json({ success: true, patient });
  } catch (error: any) {
    console.error('Create patient error:', error);
    return NextResponse.json({ error: error.message || 'Failed to create patient' }, { status: 500 });
  }
}
