const backendEndpointsCode = `
    if (url.pathname === "/api/deposits" && request.method === "POST") {
      const b = await request.json();
      await env.DB.prepare('INSERT INTO "Deposit" ("id", "patientId", "date", "type", "amount", "balanceAfter", "paymentMethod", "notes", "processedBy", "createdAt") VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)')
        .bind(b.id || ("dep-" + Date.now()), b.patientId, b.date || new Date().toISOString(), b.type || "RECEIVE", b.amount || 0, b.balanceAfter || b.amount || 0, b.paymentMethod || "PROMPTPAY", b.notes || "", b.processedBy || "???????????")
        .run();
      await env.DB.prepare('UPDATE "Patient" SET "depositBalance" = "depositBalance" + ? WHERE "id" = ?')
        .bind(b.type === "RECEIVE" ? b.amount : -b.amount, b.patientId)
        .run();
      return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, "Content-Type": "application/json; charset=utf-8" } });
    }

    if (url.pathname === "/api/receipts-void" && request.method === "POST") {
      const b = await request.json();
      await env.DB.prepare('UPDATE "Receipt" SET "isVoided" = 1, "voidReason" = ?, "voidedBy" = ?, "voidedAt" = CURRENT_TIMESTAMP WHERE "id" = ?')
        .bind(b.reason || "?????????????", "??. ??????", b.id)
        .run();
      return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, "Content-Type": "application/json; charset=utf-8" } });
    }

    if (url.pathname === "/api/claims-reconcile" && request.method === "POST") {
      const b = await request.json();
      await env.DB.prepare('UPDATE "InsuranceClaim" SET "status" = \\'APPROVED\\', "receivedAmount" = "claimAmount", "differenceAmount" = 0, "reconciledAt" = CURRENT_TIMESTAMP, "reconciledBy" = ? WHERE "id" = ?')
        .bind("???????? (???????)", b.id)
        .run();
      return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, "Content-Type": "application/json; charset=utf-8" } });
    }

    if (url.pathname === "/api/procedures" && request.method === "POST") {
      const b = await request.json();
      const id = "proc-" + (b.code || Date.now());
      await env.DB.prepare('INSERT INTO "ProcedureCatalog" ("id", "code", "nameTh", "category", "standardPrice", "dfType", "dfValue", "durationMinutes", "isActive", "createdAt", "updatedAt") VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) ON CONFLICT("code") DO UPDATE SET "nameTh" = excluded."nameTh", "category" = excluded."category", "standardPrice" = excluded."standardPrice", "dfType" = excluded."dfType", "dfValue" = excluded."dfValue", "durationMinutes" = excluded."durationMinutes", "updatedAt" = CURRENT_TIMESTAMP')
        .bind(id, b.code, b.nameTh, b.category || "GENERAL", b.standardPrice || 0, b.dfType || "PERCENT", b.dfValue || 50, b.durationMinutes || 30, b.isActive !== undefined ? b.isActive : 1)
        .run();
      return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, "Content-Type": "application/json; charset=utf-8" } });
    }

    if (url.pathname === "/api/documents" && request.method === "POST") {
      const b = await request.json();
      await env.DB.prepare('INSERT INTO "PatientDocument" ("id", "patientId", "documentType", "title", "fileUrl", "fileSize", "uploadedAt", "uploadedBy", "createdAt") VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)')
        .bind(b.id || ("doc-" + Date.now()), b.patientId, b.documentType || "OTHER", b.title, b.fileUrl || "", b.fileSize || 0, b.uploadedAt || new Date().toISOString(), b.uploadedBy || "???????????")
        .run();
      return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, "Content-Type": "application/json; charset=utf-8" } });
    }
`;

module.exports = { backendEndpointsCode };
