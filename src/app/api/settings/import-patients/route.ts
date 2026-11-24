import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkRolePermission } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { authorized } = await checkRolePermission(['ADMIN', 'COUNTER']);
    if (!authorized) {
      return NextResponse.json({ error: 'ไม่มีสิทธิ์นำเข้าข้อมูล' }, { status: 403 });
    }

    const body = await req.json();
    const { rows, dryRun = false } = body;

    if (!rows || !Array.isArray(rows) || rows.length === 0) {
      return NextResponse.json({ error: 'ไม่พบรายการข้อมูลที่จะนำเข้า' }, { status: 400 });
    }

    const successRows: any[] = [];
    const failedRows: any[] = [];

    for (let index = 0; index < rows.length; index++) {
      const row = rows[index];
      const rowNum = index + 1;

      if (!row.firstNameTh || !row.lastNameTh || !row.phone) {
        failedRows.push({
          rowNumber: rowNum,
          data: row,
          reason: 'ขาดข้อมูลจำเป็น (ชื่อ, นามสกุล หรือ เบอร์โทรศัพท์)',
        });
        continue;
      }

      // Check if DN or phone already exists
      let dn = row.dn?.trim();
      if (dn) {
        const existingDn = await prisma.patient.findUnique({ where: { dn } });
        if (existingDn) {
          failedRows.push({
            rowNumber: rowNum,
            data: row,
            reason: `เลข DN ซ้ำในระบบ (${dn})`,
          });
          continue;
        }
      }

      const existingPhone = await prisma.patient.findFirst({ where: { phone: row.phone } });
      if (existingPhone) {
        failedRows.push({
          rowNumber: rowNum,
          data: row,
          reason: `เบอร์โทรศัพท์ซ้ำกับคนไข้ ${existingPhone.firstNameTh} ${existingPhone.lastNameTh} (${existingPhone.dn})`,
        });
        continue;
      }

      if (!dryRun) {
        if (!dn) {
          const year = new Date().getFullYear().toString().slice(-2);
          const setting = await prisma.clinicSetting.findUnique({ where: { id: 'default' } });
          const nextNum = setting?.nextDnNumber || 1001;
          dn = `DN-${year}${String(nextNum).padStart(4, '0')}`;
          await prisma.clinicSetting.update({
            where: { id: 'default' },
            data: { nextDnNumber: nextNum + 1 },
          });
        }

        const patient = await prisma.patient.create({
          data: {
            dn,
            title: row.title || 'คุณ',
            firstNameTh: row.firstNameTh,
            lastNameTh: row.lastNameTh,
            firstNameEn: row.firstNameEn || null,
            lastNameEn: row.lastNameEn || null,
            phone: row.phone,
            birthDate: row.birthDate || null,
            gender: row.gender || 'UNKNOWN',
            address: row.address || null,
            rights: row.rights || 'จ่ายเอง',
            drugAllergies: row.drugAllergies || null,
            chronicDiseases: row.chronicDiseases || null,
            marketingSource: row.marketingSource || 'นำเข้าจากระบบเดิม',
            notes: row.notes || null,
          },
        });
        successRows.push(patient);
      } else {
        successRows.push({ ...row, validated: true });
      }
    }

    return NextResponse.json({
      success: true,
      dryRun,
      totalCount: rows.length,
      successCount: successRows.length,
      failedCount: failedRows.length,
      successRows,
      failedRows,
    });
  } catch (error: any) {
    console.error('Import error:', error);
    return NextResponse.json({ error: error.message || 'Import failed' }, { status: 500 });
  }
}
