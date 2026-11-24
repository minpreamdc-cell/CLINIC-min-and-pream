const reportsViewCode = `
      // 11. REPORTS & DOCTOR DF (Enhanced with Deposits & Insurance Reconciliation)
      if (tab === "reports") {
        const repTab = STATE.reportsTab || "dashboard";
        const repTabs = [
          { key: "dashboard", label: "?????????????? (Overview)" },
          { key: "deposits", label: "1. ????????????????????" },
          { key: "insurance", label: "2. ???????????? / ??????????? 900? & ????." },
          { key: "doctor-fees", label: "3. ??????????? & ??? DF" },
          { key: "daily-close", label: "4. ??????????????" },
          { key: "treatments", label: "5. ???????????" },
          { key: "voided-receipts", label: "6. ?????????????" },
          { key: "outstanding", label: "7. ??????????? (AR)" }
        ];

        let repContent = "";

        // SUB-TAB: DASHBOARD
        if (repTab === "dashboard") {
          const totalBilled = STATE.invoices.reduce((s, i) => s + Number(i.netAmount || 0), 0);
          const totalCash = STATE.invoices.reduce((s, i) => s + Number(i.paidAmount || 0), 0);
          const totalOut = STATE.invoices.reduce((s, i) => s + Number(i.balanceDue || 0), 0);
          const hours = ["09","10","11","12","13","14","15","16","17","18","19","20","21"];

          repContent = '<div class="space-y-6">' +
            '<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">' +
              '<div class="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-1"><span class="text-slate-400 text-xs font-semibold block">?????????????????</span><span class="text-2xl font-black text-slate-900">' + STATE.visits.length + ' ????</span><span class="text-[10px] text-slate-400 block">????????????????????</span></div>' +
              '<div class="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-1"><span class="text-slate-400 text-xs font-semibold block">???????????</span><span class="text-2xl font-black text-sky-700">' + STATE.appointments.length + ' ???</span><span class="text-[10px] text-slate-400 block">??????????????????</span></div>' +
              '<div class="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-1"><span class="text-slate-400 text-xs font-semibold block">???????????? (Billed)</span><span class="text-2xl font-black text-slate-900 font-mono">' + formatCurrency(totalBilled) + '</span><span class="text-[10px] text-slate-400 block">????????????????????????</span></div>' +
              '<div class="p-4 bg-white rounded-2xl border border-emerald-200 bg-emerald-50/30 shadow-sm space-y-1"><span class="text-emerald-700 text-xs font-bold block">?????????????? (Cash Collected)</span><span class="text-2xl font-black text-emerald-800 font-mono">' + formatCurrency(totalCash) + '</span><span class="text-[10px] text-emerald-600 block">?????????/???????</span></div>' +
              '<div class="p-4 bg-white rounded-2xl border border-amber-200 shadow-sm space-y-1"><span class="text-amber-700 text-xs font-bold block">??????????? (Outstanding)</span><span class="text-2xl font-black text-amber-800 font-mono">' + formatCurrency(totalOut) + '</span><span class="text-[10px] text-amber-600 block">???????????????????????</span></div>' +
            '</div>' +
            '<div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 space-y-3">' +
              '<div class="flex items-center justify-between"><h3 class="text-sm font-bold text-slate-800">?????????????????????????????? (Peak Hours Traffic Analysis)</h3><span class="text-[11px] text-slate-400">???????????????????????</span></div>' +
              '<div class="grid grid-cols-6 sm:grid-cols-13 gap-2 pt-2">' +
                hours.map(h => {
                  const cnt = STATE.appointments.filter(a => (a.startTime || "").startsWith(h)).length;
                  return '<div class="p-2.5 rounded-xl text-center ' + (cnt > 0 ? 'bg-sky-50 border border-sky-200 text-sky-900 font-bold' : 'bg-slate-50 text-slate-400') + '"><span class="text-[10px] block font-mono">' + h + ':00</span><span class="text-base font-black">' + cnt + '</span><span class="text-[9px] block text-slate-400">???</span></div>';
                }).join("") +
              '</div>' +
            '</div>' +
          '</div>';
        }

        // SUB-TAB: DEPOSITS (DentCloud Gap 1)
        else if (repTab === "deposits") {
          const depRec = STATE.deposits.filter(d => d.type === "RECEIVE").reduce((s, d) => s + Number(d.amount || 0), 0);
          const depUse = STATE.deposits.filter(d => d.type === "USE").reduce((s, d) => s + Number(d.amount || 0), 0);
          const depRef = STATE.deposits.filter(d => d.type === "REFUND").reduce((s, d) => s + Number(d.amount || 0), 0);
          const depBal = depRec - depUse - depRef;

          repContent = '<div class="space-y-6">' +
            '<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">' +
              '<div class="p-4 bg-white rounded-2xl border border-sky-200 bg-sky-50/20 shadow-sm space-y-1"><span class="text-sky-700 text-xs font-bold block">1. ??????????????????</span><span class="text-2xl font-black text-sky-900 font-mono">' + formatCurrency(depRec) + '</span><span class="text-[10px] text-sky-600 block">??????????????????????</span></div>' +
              '<div class="p-4 bg-white rounded-2xl border border-amber-200 bg-amber-50/20 shadow-sm space-y-1"><span class="text-amber-700 text-xs font-bold block">2. ?????????????????</span><span class="text-2xl font-black text-amber-900 font-mono">' + formatCurrency(depUse) + '</span><span class="text-[10px] text-amber-600 block">?????????????????????</span></div>' +
              '<div class="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-1"><span class="text-slate-500 text-xs font-bold block">3. ???????????????</span><span class="text-2xl font-black text-slate-700 font-mono">' + formatCurrency(depRef) + '</span><span class="text-[10px] text-slate-400 block">???????????????????</span></div>' +
              '<div class="p-4 bg-white rounded-2xl border-2 border-emerald-300 bg-emerald-50/40 shadow-sm space-y-1"><span class="text-emerald-800 text-xs font-black block">4. ????????????????????</span><span class="text-2xl font-black text-emerald-900 font-mono">' + formatCurrency(depBal) + '</span><span class="text-[10px] text-emerald-700 block">??????????????????????</span></div>' +
            '</div>' +

            '<div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">' +
              '<div class="px-5 py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">' +
                '<div><h3 class="font-bold text-sm text-slate-900">??????????????????????? (Patient Deposit Ledger)</h3><p class="text-xs text-slate-500">??????????????????? ?????? ??????????????? ???????????????????????</p></div>' +
                '<button type="button" onclick="STATE.newDepositModal=true; renderModals();" class="px-3.5 py-2 bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 text-white font-bold text-xs rounded-xl shadow-sm">+ ??????????????????????</button>' +
              '</div>' +
              '<div class="overflow-x-auto">' +
                '<table class="w-full text-xs text-left">' +
                  '<thead class="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">' +
                    '<tr>' +
                      '<th class="px-4 py-3">???????</th>' +
                      '<th class="px-4 py-3">????? (DN & ????)</th>' +
                      '<th class="px-4 py-3 text-center">????????????</th>' +
                      '<th class="px-4 py-3 text-right">?????????</th>' +
                      '<th class="px-4 py-3 text-right">??????????</th>' +
                      '<th class="px-4 py-3 text-center">???????</th>' +
                      '<th class="px-4 py-3">????????</th>' +
                      '<th class="px-4 py-3">?????????</th>' +
                    '</tr>' +
                  '</thead>' +
                  '<tbody class="divide-y divide-slate-100 font-medium">' +
                    (STATE.deposits.length === 0 ? '<tr><td colspan="8" class="px-4 py-8 text-center text-slate-400">???????????????????????</td></tr>' :
                      STATE.deposits.map(d => {
                        const p = STATE.patients.find(x => x.id === d.patientId) || pat0;
                        const typeBadge = d.type === "RECEIVE" ? '<span class="px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 font-bold text-[10px]">????????</span>' :
                          (d.type === "USE" ? '<span class="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px]">??????</span>' :
                          '<span class="px-2 py-0.5 rounded-full bg-slate-100 text-slate-800 font-bold text-[10px]">???????</span>');
                        return '<tr class="hover:bg-slate-50">' +
                          '<td class="px-4 py-3 text-slate-500">' + formatThaiDateTime(d.date) + '</td>' +
                          '<td class="px-4 py-3"><span class="font-bold text-slate-900 block">' + p.firstNameTh + ' ' + p.lastNameTh + '</span><span class="text-[10px] text-slate-400">' + p.dn + '</span></td>' +
                          '<td class="px-4 py-3 text-center">' + typeBadge + '</td>' +
                          '<td class="px-4 py-3 text-right font-mono font-bold ' + (d.type === "RECEIVE" ? 'text-sky-700' : 'text-amber-700') + '">' + (d.type === "RECEIVE" ? "+" : "-") + formatCurrency(d.amount) + '</td>' +
                          '<td class="px-4 py-3 text-right font-mono font-bold text-emerald-800">' + formatCurrency(d.balanceAfter || d.amount) + '</td>' +
                          '<td class="px-4 py-3 text-center"><span class="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px]">' + (d.paymentMethod || "PromptPay") + '</span></td>' +
                          '<td class="px-4 py-3 text-slate-600 max-w-[200px] truncate">' + (d.notes || "-") + '</td>' +
                          '<td class="px-4 py-3 text-slate-500">' + (d.processedBy || "???????????") + '</td>' +
                        '</tr>';
                      }).join("")
                    ) +
                  '</tbody>' +
                '</table>' +
              '</div>' +
            '</div>' +
          '</div>';
        }

        // SUB-TAB: INSURANCE & SOCIAL SECURITY (DentCloud Gap 1)
        else if (repTab === "insurance") {
          const ssoClaims = STATE.insuranceClaims.filter(c => c.insuranceType === "SSO");
          const ucClaims = STATE.insuranceClaims.filter(c => c.insuranceType === "UC");
          const totalClaimed = STATE.insuranceClaims.reduce((s, c) => s + Number(c.claimAmount || 0), 0);
          const totalApproved = STATE.insuranceClaims.filter(c => c.status === "APPROVED").reduce((s, c) => s + Number(c.receivedAmount || 0), 0);
          const totalPending = STATE.insuranceClaims.filter(c => c.status === "PENDING").reduce((s, c) => s + Number(c.differenceAmount || c.claimAmount || 0), 0);

          repContent = '<div class="space-y-6">' +
            '<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">' +
              '<div class="p-4 bg-white rounded-2xl border border-indigo-200 bg-indigo-50/20 shadow-sm space-y-1"><span class="text-indigo-700 text-xs font-bold block">1. ???????????????? (SSO 900?/??)</span><span class="text-2xl font-black text-indigo-900 font-mono">' + formatCurrency(ssoClaims.reduce((s, c) => s + c.claimAmount, 0)) + '</span><span class="text-[10px] text-indigo-600 block">' + ssoClaims.length + ' ?????????????</span></div>' +
              '<div class="p-4 bg-white rounded-2xl border border-teal-200 bg-teal-50/20 shadow-sm space-y-1"><span class="text-teal-700 text-xs font-bold block">2. ????? ????. (???????)</span><span class="text-2xl font-black text-teal-900 font-mono">' + formatCurrency(ucClaims.reduce((s, c) => s + c.claimAmount, 0)) + '</span><span class="text-[10px] text-teal-600 block">' + ucClaims.length + ' ???????????</span></div>' +
              '<div class="p-4 bg-white rounded-2xl border border-emerald-200 bg-emerald-50/20 shadow-sm space-y-1"><span class="text-emerald-700 text-xs font-bold block">3. ????????????????</span><span class="text-2xl font-black text-emerald-800 font-mono">' + formatCurrency(totalApproved) + '</span><span class="text-[10px] text-emerald-600 block">????????????????????????????</span></div>' +
              '<div class="p-4 bg-white rounded-2xl border border-amber-200 bg-amber-50/20 shadow-sm space-y-1"><span class="text-amber-700 text-xs font-bold block">4. ?????????? (Pending AR)</span><span class="text-2xl font-black text-amber-800 font-mono">' + formatCurrency(totalPending) + '</span><span class="text-[10px] text-amber-600 block">??????????????????????????</span></div>' +
            '</div>' +

            '<div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">' +
              '<div class="px-5 py-4 border-b border-slate-200 flex items-center justify-between">' +
                '<div><h3 class="font-bold text-sm text-slate-900">????????????????????????????????? (Insurance Reconciliation)</h3><p class="text-xs text-slate-500">??????????????????????????????? ????????????????????????????????</p></div>' +
                '<span class="text-xs text-slate-400">?????????? e-Claim ??????</span>' +
              '</div>' +
              '<div class="overflow-x-auto">' +
                '<table class="w-full text-xs text-left">' +
                  '<thead class="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">' +
                    '<tr>' +
                      '<th class="px-4 py-3">?????????????</th>' +
                      '<th class="px-4 py-3">????????</th>' +
                      '<th class="px-4 py-3">????? (DN & ????)</th>' +
                      '<th class="px-4 py-3">????????????</th>' +
                      '<th class="px-4 py-3">???????</th>' +
                      '<th class="px-4 py-3 text-right">?????????</th>' +
                      '<th class="px-4 py-3 text-right">????????????</th>' +
                      '<th class="px-4 py-3 text-right">????????</th>' +
                      '<th class="px-4 py-3 text-center">?????</th>' +
                      '<th class="px-4 py-3 text-center">?????????</th>' +
                    '</tr>' +
                  '</thead>' +
                  '<tbody class="divide-y divide-slate-100 font-medium">' +
                    (STATE.insuranceClaims.length === 0 ? '<tr><td colspan="10" class="px-4 py-8 text-center text-slate-400">???????????????????????</td></tr>' :
                      STATE.insuranceClaims.map(c => {
                        const p = STATE.patients.find(x => x.id === c.patientId) || pat0;
                        const isAppr = c.status === "APPROVED";
                        return '<tr class="hover:bg-slate-50">' +
                          '<td class="px-4 py-3 text-slate-500">' + (c.claimDate || "2026-11-24") + '</td>' +
                          '<td class="px-4 py-3 font-mono font-bold text-slate-800">' + c.id + '</td>' +
                          '<td class="px-4 py-3"><span class="font-bold text-slate-900 block">' + p.firstNameTh + ' ' + p.lastNameTh + '</span><span class="text-[10px] text-slate-400">' + p.dn + '</span></td>' +
                          '<td class="px-4 py-3"><span class="px-2 py-0.5 rounded-full ' + (c.insuranceType === "SSO" ? "bg-indigo-100 text-indigo-800" : "bg-teal-100 text-teal-800") + ' text-[10px] font-bold">' + (c.insuranceType === "SSO" ? "??????????? 900?" : "????. ???????") + '</span></td>' +
                          '<td class="px-4 py-3 text-slate-700">' + (c.procedureName || c.procedureCode) + '</td>' +
                          '<td class="px-4 py-3 text-right font-mono text-slate-700">' + formatCurrency(c.claimAmount) + '</td>' +
                          '<td class="px-4 py-3 text-right font-mono font-bold ' + (isAppr ? 'text-emerald-700' : 'text-slate-400') + '">' + (isAppr ? formatCurrency(c.receivedAmount) : '-') + '</td>' +
                          '<td class="px-4 py-3 text-right font-mono ' + (c.differenceAmount > 0 ? 'text-rose-600 font-bold' : 'text-slate-400') + '">' + (c.differenceAmount ? formatCurrency(c.differenceAmount) : '0') + '</td>' +
                          '<td class="px-4 py-3 text-center">' +
                            (isAppr ? '<span class="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">???????????</span>' :
                            '<span class="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px]">???????</span>') +
                          '</td>' +
                          '<td class="px-4 py-3 text-center">' +
                            (!isAppr ? '<button type="button" onclick="reconcileClaimAction(\\'' + c.id + '\\')" class="px-3 py-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-lg text-[11px] font-bold shadow-sm">? ???????????????</button>' :
                            '<span class="text-[10px] text-slate-400">?????????</span>') +
                          '</td>' +
                        '</tr>';
                      }).join("")
                    ) +
                  '</tbody>' +
                '</table>' +
              '</div>' +
            '</div>' +
          '</div>';
        }

        // SUB-TAB: DOCTOR FEES & RETROACTIVE DF ADJUSTMENT (DentCloud Gap 4)
        else if (repTab === "doctor-fees") {
          const sampleCases = [
            { caseId: "case-1", date: "2026-11-24", patientName: "???????? ???? (DN-260001)", procName: "???????????????? (D10)", doctorName: "??. ??????", billedAmount: 1200, dfRate: "50%", calculatedDf: 600 },
            { caseId: "case-2", date: "2026-11-24", patientName: "??????????? ????? (DN-260002)", procName: "?????????????? 2 ???? (D22)", doctorName: "??. ????", billedAmount: 1500, dfRate: "50%", calculatedDf: 750 },
            { caseId: "case-3", date: "2026-11-23", patientName: "?????????????? ??????? (DN-260003)", procName: "???????????? (D35)", doctorName: "??. ??????", billedAmount: 4500, dfRate: "60%", calculatedDf: 2700 }
          ];

          repContent = '<div class="space-y-6">' +
            '<div class="flex items-center justify-between no-print">' +
              '<div><h3 class="text-sm font-bold text-slate-800">????????????????????? (Doctor Fee / DF Payroll Statement)</h3><p class="text-xs text-slate-500">????????????? DF ????? ????????????????? ??????????????? ? ??????? 3% ??????????????????</p></div>' +
              '<button type="button" onclick="window.print()" class="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-sm">??? ???????????????????? (DF Slip)</button>' +
            '</div>' +
            '<div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">' +
              '<div class="p-5 bg-white rounded-2xl border-2 border-sky-200 shadow-sm space-y-3">' +
                '<div class="flex justify-between items-center border-b border-slate-200 pb-2.5">' +
                  '<div><span class="text-[10px] font-bold text-sky-600 uppercase tracking-wider block">DOCTOR FEE STATEMENT</span><h4 class="font-black text-base text-slate-900">??. ?????? ?????????? (??????)</h4></div>' +
                  '<span class="px-3 py-1 rounded-full bg-sky-100 text-sky-800 font-bold">DF 50%</span>' +
                '</div>' +
                '<div class="space-y-2 font-mono text-slate-600">' +
                  '<div class="flex justify-between"><span>1. ????????????????:</span><span class="font-bold text-slate-900">5,700.00 ???</span></div>' +
                  '<div class="flex justify-between"><span>2. ?????????????? DF:</span><span class="font-bold text-sky-700">3,300.00 ???</span></div>' +
                  '<div class="flex justify-between text-rose-600"><span>3. ????????? (50%):</span><span>-0.00 ???</span></div>' +
                  '<div class="flex justify-between text-amber-700"><span>4. ??????? ? ??????? 3%:</span><span>-99.00 ???</span></div>' +
                  '<div class="flex justify-between text-sm font-black text-slate-900 border-t border-slate-200 pt-2 font-sans"><span>???????????? (Net Payable):</span><span class="text-sky-800 font-mono text-base">3,201.00 ???</span></div>' +
                '</div>' +
              '</div>' +
              '<div class="p-5 bg-white rounded-2xl border-2 border-teal-200 shadow-sm space-y-3">' +
                '<div class="flex justify-between items-center border-b border-slate-200 pb-2.5">' +
                  '<div><span class="text-[10px] font-bold text-teal-600 uppercase tracking-wider block">DOCTOR FEE STATEMENT</span><h4 class="font-black text-base text-slate-900">??. ???? ??????? (???????)</h4></div>' +
                  '<span class="px-3 py-1 rounded-full bg-teal-100 text-teal-800 font-bold">DF 50%</span>' +
                '</div>' +
                '<div class="space-y-2 font-mono text-slate-600">' +
                  '<div class="flex justify-between"><span>1. ????????????????:</span><span class="font-bold text-slate-900">1,500.00 ???</span></div>' +
                  '<div class="flex justify-between"><span>2. ?????????????? DF:</span><span class="font-bold text-teal-700">750.00 ???</span></div>' +
                  '<div class="flex justify-between text-rose-600"><span>3. ?????????:</span><span>-0.00 ???</span></div>' +
                  '<div class="flex justify-between text-amber-700"><span>4. ??????? ? ??????? 3%:</span><span>-22.50 ???</span></div>' +
                  '<div class="flex justify-between text-sm font-black text-slate-900 border-t border-slate-200 pt-2 font-sans"><span>???????????? (Net Payable):</span><span class="text-teal-800 font-mono text-base">727.50 ???</span></div>' +
                '</div>' +
              '</div>' +
            '</div>' +

            // Case breakdown with Retroactive DF Adjustment Button
            '<div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">' +
              '<div class="px-5 py-4 border-b border-slate-200 flex items-center justify-between">' +
                '<div><h3 class="font-bold text-sm text-slate-900">??????????????????????????? DF (Case Breakdown & Retroactive Adjustment)</h3><p class="text-xs text-slate-500">???????????? ???????? DF ???????? ?????????????????????????????????????</p></div>' +
              '</div>' +
              '<div class="overflow-x-auto">' +
                '<table class="w-full text-xs text-left">' +
                  '<thead class="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">' +
                    '<tr>' +
                      '<th class="px-4 py-3">??????</th>' +
                      '<th class="px-4 py-3">?????</th>' +
                      '<th class="px-4 py-3">???????</th>' +
                      '<th class="px-4 py-3">?????????</th>' +
                      '<th class="px-4 py-3 text-right">???????? (???)</th>' +
                      '<th class="px-4 py-3 text-center">????? DF</th>' +
                      '<th class="px-4 py-3 text-right">?????????????????</th>' +
                      '<th class="px-4 py-3 text-center">?????????</th>' +
                    '</tr>' +
                  '</thead>' +
                  '<tbody class="divide-y divide-slate-100 font-medium">' +
                    sampleCases.map(c => {
                      return '<tr class="hover:bg-slate-50">' +
                        '<td class="px-4 py-3 text-slate-500">' + c.date + '</td>' +
                        '<td class="px-4 py-3 font-bold text-slate-900">' + c.patientName + '</td>' +
                        '<td class="px-4 py-3 text-slate-700">' + c.procName + '</td>' +
                        '<td class="px-4 py-3"><span class="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px]">' + c.doctorName + '</span></td>' +
                        '<td class="px-4 py-3 text-right font-mono">' + formatCurrency(c.billedAmount) + '</td>' +
                        '<td class="px-4 py-3 text-center font-bold text-slate-600">' + c.dfRate + '</td>' +
                        '<td class="px-4 py-3 text-right font-mono font-bold text-sky-800">' + formatCurrency(c.calculatedDf) + '</td>' +
                        '<td class="px-4 py-3 text-center">' +
                          '<button type="button" onclick="STATE.dfAdjustModal=' + JSON.stringify(c).replace(/"/g, '&quot;') + '; renderModals();" class="px-2.5 py-1 bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 rounded-lg text-[11px] font-bold">?? ???????? DF ????????</button>' +
                        '</td>' +
                      '</tr>';
                    }).join("") +
                  '</tbody>' +
                '</table>' +
              '</div>' +
            '</div>' +
          '</div>';
        }

        // OTHER SUB-TABS
        else {
          repContent = '<div class="p-8 bg-white rounded-2xl border border-slate-200 shadow-sm text-center space-y-2">' +
            '<div class="text-3xl">??</div>' +
            '<h4 class="font-bold text-sm text-slate-800">??????' + (repTabs.find(t => t.key === repTab)?.label || repTab) + '</h4>' +
            '<p class="text-xs text-slate-500">????????????????????????????????? Excel / CSV ?????????????????????</p>' +
            '<button type="button" onclick="exportReportCsv()" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl mt-3">?? ???????????? CSV</button>' +
          '</div>';
        }

        container.innerHTML = '<div class="space-y-6">' +
          '<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">' +
            '<div>' +
              '<h2 class="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">' +
                '<span class="w-8 h-8 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-sm">??</span>' +
                '??????????? & ??????????? (Reports & Doctor DF Analytics)' +
              '</h2>' +
              '<p class="text-xs text-slate-500 mt-1">??????????????? ????????????????????????/????. ?????? DF ??????????????????????</p>' +
            '</div>' +
            '<div class="flex items-center gap-2">' +
              '<button type="button" onclick="exportReportCsv()" class="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl">?? ?????? CSV</button>' +
              '<button type="button" onclick="window.print()" class="px-3.5 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-sm">??? ???????????</button>' +
            '</div>' +
          '</div>' +
          '<div class="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-xl">' +
            repTabs.map(t => {
              const active = repTab === t.key;
              return '<button type="button" onclick="STATE.reportsTab=\\'' + t.key + '\\'; renderView();" class="px-3 py-1.5 rounded-lg text-xs font-bold transition-all ' + (active ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900') + '">' + t.label + '</button>';
            }).join("") +
          '</div>' +
          repContent +
        '</div>';
        if (window.lucide) window.lucide.createIcons();
        return;
      }
`;
module.exports = { reportsViewCode };
