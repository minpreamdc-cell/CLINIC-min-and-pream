const { PrismaClient } = require('@prisma/client');
const { execSync } = require('child_process');

const prisma = new PrismaClient();

async function syncPull() {
  console.log('🔄 Pulling latest live data from Cloudflare D1 to Local SQLite (clinic.db)...');

  function queryD1(sql) {
    const escaped = sql.replace(/"/g, '\\"');
    const out = execSync(`npx wrangler d1 execute min-and-pream-clinic-db --remote --json --command "${escaped}"`, {
      encoding: 'utf8'
    });
    const parsed = JSON.parse(out);
    return (parsed[0] && parsed[0].results) ? parsed[0].results : [];
  }

  // 1. Sync Patients
  const d1Patients = queryD1('SELECT * FROM "Patient"');
  console.log(`Found ${d1Patients.length} patients in Cloudflare D1.`);
  for (const p of d1Patients) {
    await prisma.patient.upsert({
      where: { dn: p.dn },
      update: {
        title: p.title,
        firstNameTh: p.firstNameTh,
        lastNameTh: p.lastNameTh,
        phone: p.phone,
        rights: p.rights,
        drugAllergies: p.drugAllergies,
        chronicDiseases: p.chronicDiseases,
        depositBalance: p.depositBalance || 0
      },
      create: {
        id: p.id,
        dn: p.dn,
        title: p.title || 'คุณ',
        firstNameTh: p.firstNameTh,
        lastNameTh: p.lastNameTh || '',
        phone: p.phone || '',
        gender: p.gender || 'FEMALE',
        rights: p.rights || 'จ่ายเอง',
        drugAllergies: p.drugAllergies || 'ไม่มีประวัติแพ้ยา',
        chronicDiseases: p.chronicDiseases || 'ไม่มี',
        depositBalance: p.depositBalance || 0
      }
    });
  }

  // 2. Sync Inventory
  const d1Inventory = queryD1('SELECT * FROM "InventoryItem"');
  console.log(`Found ${d1Inventory.length} inventory items in Cloudflare D1.`);
  for (const item of d1Inventory) {
    await prisma.inventoryItem.updateMany({
      where: { code: item.code },
      data: { currentStock: item.currentStock }
    });
  }

  console.log('✅ Local SQLite (clinic.db) is now fully synchronized with Cloudflare D1!');
}

syncPull()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
