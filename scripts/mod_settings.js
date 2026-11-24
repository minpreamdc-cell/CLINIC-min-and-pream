const settingsViewCode = `
      // 12. SETTINGS & SYSTEM CONFIGURATION (DentCloud Gaps 3, 4, 5)
      if (tab === "settings" || tab === "backup") {
        const sTab = STATE.settingsTab || "procedures";
        const sTabs = [
          { key: "procedures", label: "1. ???????????????? & DF" },
          { key: "diagnoses", label: "2. ?????????????????????? ICD-10" },
          { key: "apptypes", label: "3. ?????????????" },
          { key: "discounts", label: "4. ???????????? & ????????????" },
          { key: "system", label: "5. ??????????? Cloudflare D1" }
        ];

        let setContent = "";

        // SUB-TAB 1: PROCEDURES & DF CONFIG (DentCloud Gaps 3, 4)
        if (sTab === "procedures") {
          setContent = '<div class="space-y-6">' +
            '<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">' +
              '<div><h3 class="font-bold text-sm text-slate-900">???????????????? & ???????????? DF ????? (Procedure Catalog & Doctor Fee)</h3><p class="text-xs text-slate-500">????????? ??????????? ??????????? DF ?????????????????????????? (%) ??????????? (THB)</p></div>' +
              '<button type="button" onclick="STATE.newProcedureModal=true; renderModals();" class="px-3.5 py-2 bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 text-white font-bold text-xs rounded-xl shadow-sm">+ ????????????????</button>' +
            '</div>' +
            '<div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">' +
              '<div class="overflow-x-auto">' +
                '<table class="w-full text-xs text-left">' +
                  '<thead class="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">' +
                    '<tr>' +
                      '<th class="px-4 py-3">????</th>' +
                      '<th class="px-4 py-3">???????????????????</th>' +
                      '<th class="px-4 py-3">????????</th>' +
                      '<th class="px-4 py-3 text-right">???????????</th>' +
                      '<th class="px-4 py-3 text-center">??????????? (DF)</th>' +
                      '<th class="px-4 py-3 text-center">???????? (????)</th>' +
                      '<th class="px-4 py-3 text-center">?????</th>' +
                      '<th class="px-4 py-3 text-center">?????</th>' +
                    '</tr>' +
                  '</thead>' +
                  '<tbody class="divide-y divide-slate-100 font-medium">' +
                    STATE.procedures.map(proc => {
                      const dfDisplay = proc.dfType === "FIXED" ? (formatCurrency(proc.dfValue) + " (?????)") : (proc.dfValue + "%");
                      return '<tr class="hover:bg-slate-50">' +
                        '<td class="px-4 py-3 font-mono font-bold text-sky-800">' + proc.code + '</td>' +
                        '<td class="px-4 py-3 font-bold text-slate-900">' + proc.nameTh + '</td>' +
                        '<td class="px-4 py-3"><span class="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px]">' + (proc.category || "GENERAL") + '</span></td>' +
                        '<td class="px-4 py-3 text-right font-mono font-bold text-slate-800">' + formatCurrency(proc.standardPrice) + '</td>' +
                        '<td class="px-4 py-3 text-center"><span class="px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 font-bold text-[10px]">' + dfDisplay + '</span></td>' +
                        '<td class="px-4 py-3 text-center text-slate-600">' + (proc.durationMinutes || 30) + ' ????</td>' +
                        '<td class="px-4 py-3 text-center">' +
                          (proc.isActive ? '<span class="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">??????????</span>' :
                          '<span class="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px]">???</span>') +
                        '</td>' +
                        '<td class="px-4 py-3 text-center">' +
                          '<button type="button" onclick="STATE.newProcedureModal=' + JSON.stringify(proc).replace(/"/g, '&quot;') + '; renderModals();" class="text-sky-600 hover:text-sky-800 font-bold text-xs">?? ?????</button>' +
                        '</td>' +
                      '</tr>';
                    }).join("") +
                  '</tbody>' +
                '</table>' +
              '</div>' +
            '</div>' +
          '</div>';
        }

        // SUB-TAB 2: ICD-10 DIAGNOSES (DentCloud Gap 3)
        else if (sTab === "diagnoses") {
          setContent = '<div class="space-y-6">' +
            '<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">' +
              '<div><h3 class="font-bold text-sm text-slate-900">????????????????????????????? ICD-10 (Dental Diagnosis Catalog)</h3><p class="text-xs text-slate-500">??????????????????????????????????????????????????? EMR ????????????????</p></div>' +
              '<button type="button" onclick="showToast(\\'????????????????????????????????????\\', \\'info\\')" class="px-3.5 py-2 bg-gradient-to-r from-sky-600 to-teal-600 text-white font-bold text-xs rounded-xl shadow-sm">+ ?????????????????</button>' +
            '</div>' +
            '<div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">' +
              '<div class="overflow-x-auto">' +
                '<table class="w-full text-xs text-left">' +
                  '<thead class="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">' +
                    '<tr>' +
                      '<th class="px-4 py-3">???? ICD-10</th>' +
                      '<th class="px-4 py-3">????????????????????????????</th>' +
                      '<th class="px-4 py-3">???????????</th>' +
                      '<th class="px-4 py-3 text-center">?????</th>' +
                    '</tr>' +
                  '</thead>' +
                  '<tbody class="divide-y divide-slate-100 font-medium">' +
                    STATE.diagnoses.map(diag => {
                      return '<tr class="hover:bg-slate-50">' +
                        '<td class="px-4 py-3 font-mono font-bold text-sky-800">' + diag.code + '</td>' +
                        '<td class="px-4 py-3 font-bold text-slate-900">' + diag.nameTh + '</td>' +
                        '<td class="px-4 py-3"><span class="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px]">' + diag.category + '</span></td>' +
                        '<td class="px-4 py-3 text-center"><span class="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">???????? EMR</span></td>' +
                      '</tr>';
                    }).join("") +
                  '</tbody>' +
                '</table>' +
              '</div>' +
            '</div>' +
          '</div>';
        }

        // SUB-TAB 3: APPOINTMENT TYPES (DentCloud Gap 3)
        else if (sTab === "apptypes") {
          setContent = '<div class="space-y-6">' +
            '<div class="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">' +
              '<div><h3 class="font-bold text-sm text-slate-900">???????????????? & ?????????????????? (Appointment Types)</h3><p class="text-xs text-slate-500">??????????????????????????????????????????????????????????????????</p></div>' +
            '</div>' +
            '<div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">' +
              '<div class="divide-y divide-slate-100">' +
                STATE.appointmentTypes.map(t => {
                  return '<div class="p-4 hover:bg-slate-50 flex items-center justify-between text-xs">' +
                    '<div class="space-y-1">' +
                      '<div class="font-bold text-slate-900 text-sm flex items-center gap-2"><span class="w-2.5 h-2.5 rounded-full bg-teal-500"></span>' + t.name + '</div>' +
                      '<div class="text-slate-500">???????????????????: <span class="font-bold text-slate-800">' + t.defaultDurationMinutes + ' ????</span>' + (t.defaultFollowUpDays ? ' • ?????????????? ~' + t.defaultFollowUpDays + ' ???' : '') + '</div>' +
                    '</div>' +
                    '<span class="px-3 py-1 bg-slate-100 text-slate-700 font-bold rounded-xl text-xs">??????????</span>' +
                  '</div>';
                }).join("") +
              '</div>' +
            '</div>' +
          '</div>';
        }

        // SUB-TAB 4: DISCOUNTS & PATIENT GROUPS (DentCloud Gap 5)
        else if (sTab === "discounts") {
          setContent = '<div class="space-y-8">' +
            // Section 1: Discount Campaigns
            '<div class="space-y-4">' +
              '<div class="flex items-center justify-between">' +
                '<div><h3 class="font-bold text-sm text-slate-900">1. ??????????????????????????????? (Promotion Campaigns)</h3><p class="text-xs text-slate-500">????????????????????????????? ????????????? ???????????????????????</p></div>' +
                '<button type="button" onclick="showToast(\\'????????????????????????????\\', \\'info\\')" class="px-3.5 py-1.5 bg-sky-600 text-white rounded-xl text-xs font-bold shadow-sm">+ ???????????</button>' +
              '</div>' +
              '<div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">' +
                '<div class="overflow-x-auto">' +
                  '<table class="w-full text-xs text-left">' +
                    '<thead class="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">' +
                      '<tr>' +
                        '<th class="px-4 py-3">????????????????</th>' +
                        '<th class="px-4 py-3">????????????????????</th>' +
                        '<th class="px-4 py-3 text-center">????????????</th>' +
                        '<th class="px-4 py-3 text-right">????????????</th>' +
                        '<th class="px-4 py-3 text-center">??????????????</th>' +
                        '<th class="px-4 py-3 text-center">?????</th>' +
                      '</tr>' +
                    '</thead>' +
                    '<tbody class="divide-y divide-slate-100 font-medium">' +
                      STATE.discounts.map(disc => {
                        return '<tr class="hover:bg-slate-50">' +
                          '<td class="px-4 py-3 font-bold text-slate-900">' + disc.name + '</td>' +
                          '<td class="px-4 py-3 text-slate-600">' + disc.procCode + '</td>' +
                          '<td class="px-4 py-3 text-center"><span class="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px]">' + (disc.type === "PERCENT" ? "??????????? (%)" : "??????????????") + '</span></td>' +
                          '<td class="px-4 py-3 text-right font-mono font-bold text-rose-600">' + (disc.type === "PERCENT" ? disc.value + "%" : formatCurrency(disc.value)) + '</td>' +
                          '<td class="px-4 py-3 text-center text-slate-500 font-mono text-[11px]">' + disc.startDate + ' ??? ' + disc.endDate + '</td>' +
                          '<td class="px-4 py-3 text-center"><span class="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">ACTIVE</span></td>' +
                        '</tr>';
                      }).join("") +
                    '</tbody>' +
                  '</table>' +
                '</div>' +
              '</div>' +
            '</div>' +

            // Section 2: Patient Groups
            '<div class="space-y-4">' +
              '<div class="flex items-center justify-between">' +
                '<div><h3 class="font-bold text-sm text-slate-900">2. ????????????????????????? (Patient Groups & Tier Benefits)</h3><p class="text-xs text-slate-500">????????????????????????????????????????????????? ???? ?????? VIP ??????????????????</p></div>' +
                '<button type="button" onclick="showToast(\\'??????????????????????????????\\', \\'info\\')" class="px-3.5 py-1.5 bg-teal-600 text-white rounded-xl text-xs font-bold shadow-sm">+ ???????????????</button>' +
              '</div>' +
              '<div class="grid grid-cols-1 md:grid-cols-2 gap-4">' +
                STATE.patientGroups.map(grp => {
                  return '<div class="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">' +
                    '<div class="space-y-1">' +
                      '<div class="font-bold text-slate-900 text-sm">' + grp.name + '</div>' +
                      '<div class="text-xs text-slate-500">' + grp.desc + '</div>' +
                    '</div>' +
                    '<div class="text-right">' +
                      '<span class="text-xl font-black ' + (grp.discountPercent > 0 ? 'text-teal-700' : 'text-slate-400') + '">' + (grp.discountPercent > 0 ? '?? ' + grp.discountPercent + '%' : '???????????') + '</span>' +
                    '</div>' +
                  '</div>';
                }).join("") +
              '</div>' +
            '</div>' +
          '</div>';
        }

        // SUB-TAB 5: SYSTEM & BACKUP (Cloudflare D1 Snapshot)
        else {
          setContent = '<div class="space-y-6">' +
            '<div class="p-5 bg-gradient-to-r from-sky-50 to-teal-50 rounded-2xl border border-sky-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">' +
              '<div class="space-y-1">' +
                '<h3 class="font-black text-sm text-sky-950">?????????????? Cloudflare D1 Serverless Database (Automated Backup)</h3>' +
                '<p class="text-xs text-sky-800">????????? D1 APAC-SIN ???????? Multi-Region ???????????????? ??? ??????? ??????? ????????????????????????????</p>' +
              '</div>' +
              '<button type="button" onclick="triggerCloudBackup()" class="px-4 py-2 bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 text-white font-bold text-xs rounded-xl shadow-sm whitespace-nowrap">?? ??????????? D1 ?????</button>' +
            '</div>' +
            '<div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">' +
              '<div class="px-5 py-4 border-b border-slate-200 flex items-center justify-between"><h4 class="font-bold text-xs text-slate-800">????????????????????? (Cloud Backup Snapshots)</h4><span class="text-xs text-slate-400">Cloudflare D1 Database</span></div>' +
              '<div class="divide-y divide-slate-100">' +
                STATE.snapshots.map(s => {
                  return '<div class="p-4 hover:bg-slate-50 flex items-center justify-between text-xs">' +
                    '<div class="space-y-1">' +
                      '<div class="font-bold text-slate-900 font-mono">' + s.id + ' • ' + (s.backupLabel || "?????????????????") + '</div>' +
                      '<div class="text-slate-400 text-[11px]">' + formatThaiDateTime(s.createdAt) + ' • ??? ' + (s.createdBy || "?????????????") + '</div>' +
                    '</div>' +
                    '<div class="flex items-center gap-3">' +
                      '<span class="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">???????????? D1</span>' +
                    '</div>' +
                  '</div>';
                }).join("") +
              '</div>' +
            '</div>' +
          '</div>';
        }

        container.innerHTML = '<div class="space-y-6">' +
          '<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">' +
            '<div>' +
              '<h2 class="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">' +
                '<span class="w-8 h-8 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center font-bold text-sm">??</span>' +
                '????????????????? (Clinic System Master Settings)' +
              '</h2>' +
              '<p class="text-xs text-slate-500 mt-1">?????????????????????? ???? ICD-10 ????? DF ????? ??????????? ?????????????? Cloudflare D1</p>' +
            '</div>' +
          '</div>' +
          '<div class="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-xl">' +
            sTabs.map(t => {
              const active = sTab === t.key;
              return '<button type="button" onclick="STATE.settingsTab=\\'' + t.key + '\\'; renderView();" class="px-3 py-1.5 rounded-lg text-xs font-bold transition-all ' + (active ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900') + '">' + t.label + '</button>';
            }).join("") +
          '</div>' +
          setContent +
        '</div>';
        if (window.lucide) window.lucide.createIcons();
        return;
      }
`;
module.exports = { settingsViewCode };
