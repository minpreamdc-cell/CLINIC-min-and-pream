const billingViewCode = `
      // 6. BILLING & RECEIPTS (Enhanced with History, Search & Void Audit)
      if (tab === "billing") {
        const bTab = STATE.billingTab || "invoices";
        const waitingVisits = STATE.visits.filter(v => v.status === "WAITING_PAYMENT");
        const bq = (STATE.billingSearchReceipt || "").toLowerCase().trim();
        const bDate = STATE.billingDateFilter || "";

        const filteredReceipts = STATE.receipts.filter(r => {
          const p = STATE.patients.find(x => x.id === r.patientId) || pat0;
          if (bDate && !(r.receiptDate || "").startsWith(bDate)) return false;
          if (bq) {
            const hay = ((r.receiptNo || "") + " " + (p.firstNameTh || "") + " " + (p.lastNameTh || "") + " " + (p.dn || "")).toLowerCase();
            if (!hay.includes(bq)) return false;
          }
          return true;
        });

        const activeReceipts = STATE.receipts.filter(r => !r.isVoided);
        const voidedReceipts = STATE.receipts.filter(r => r.isVoided);
        const totalNetCollected = activeReceipts.reduce((s, r) => s + Number(r.netAmount || 0), 0);

        container.innerHTML = '<div class="space-y-6">' +
          '<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">' +
            '<div>' +
              '<h2 class="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">' +
                '<span class="w-8 h-8 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-sm">??</span>' +
                '??????? & ????????????? (Billing & Receipts)' +
              '</h2>' +
              '<p class="text-xs text-slate-500 mt-1">????????????????? ???????????????????? ???????????? A4/???? ?????????????????????????? (Void)</p>' +
            '</div>' +
            '<div class="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">' +
              '<button type="button" onclick="STATE.billingTab=\\'invoices\\'; renderView();" class="px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ' + (bTab === 'invoices' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900') + '">????????? (' + waitingVisits.length + ')</button>' +
              '<button type="button" onclick="STATE.billingTab=\\'receipts\\'; renderView();" class="px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ' + (bTab === 'receipts' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900') + '">???????????????????? (' + STATE.receipts.length + ')</button>' +
              '<button type="button" onclick="STATE.billingTab=\\'voided\\'; renderView();" class="px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ' + (bTab === 'voided' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900') + '">???????????????????? (' + voidedReceipts.length + ')</button>' +
            '</div>' +
          '</div>' +

          (bTab === "invoices" ? (
            '<div class="space-y-6">' +
              '<div class="grid grid-cols-1 md:grid-cols-3 gap-4">' +
                '<div class="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-1"><span class="text-slate-400 text-xs font-semibold block">???????????????????</span><span class="text-2xl font-black text-amber-600">' + waitingVisits.length + ' ???</span><span class="text-[10px] text-slate-400 block">???????????????????????????????</span></div>' +
                '<div class="p-4 bg-white rounded-2xl border border-emerald-200 bg-emerald-50/20 shadow-sm space-y-1"><span class="text-emerald-700 text-xs font-bold block">???????????????? (?????)</span><span class="text-2xl font-black text-emerald-800 font-mono">' + formatCurrency(totalNetCollected) + '</span><span class="text-[10px] text-emerald-600 block">?????????????????????</span></div>' +
                '<div class="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-1"><span class="text-slate-400 text-xs font-semibold block">??????????????????? (Void)</span><span class="text-2xl font-black text-rose-600">' + voidedReceipts.length + ' ????</span><span class="text-[10px] text-slate-400 block">??????????????????????????????</span></div>' +
              '</div>' +
              '<div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">' +
                '<div class="px-5 py-4 border-b border-slate-200 flex items-center justify-between"><h3 class="font-bold text-sm text-slate-900">???????????????????</h3><span class="text-xs text-slate-400">?????????????????????????????????????</span></div>' +
                (waitingVisits.length === 0 ? '<div class="py-12 text-center text-slate-400 text-xs">??????????????????????????</div>' :
                  '<div class="divide-y divide-slate-100">' +
                  waitingVisits.map(v => {
                    const p = STATE.patients.find(x => x.id === v.patientId) || pat0;
                    const doc = STATE.doctors.find(d => d.id === v.doctorId);
                    const inv = STATE.invoices.find(i => i.visitId === v.id) || { id: "inv-" + v.id, totalAmount: 1200, discountAmount: 0, netAmount: 1200, paidAmount: 0, balanceDue: 1200, itemsJson: "???????????????? (D10)" };
                    return '<div class="p-4 hover:bg-slate-50 flex items-center justify-between">' +
                      '<div class="space-y-1">' +
                        '<div class="flex items-center gap-2"><span class="px-2 py-0.5 rounded-lg bg-teal-100 text-teal-800 font-black text-xs">??? #' + v.queueNumber + '</span><span class="font-bold text-slate-900 text-sm">' + p.title + p.firstNameTh + ' ' + p.lastNameTh + '</span><span class="text-xs text-slate-400">(' + p.dn + ')</span></div>' +
                        '<div class="text-xs text-slate-500">?????????: ' + (doc?.nickname || "??????") + ' • ???????: ' + (inv.itemsJson || "?????????????") + '</div>' +
                      '</div>' +
                      '<div class="flex items-center gap-4">' +
                        '<div class="text-right font-mono"><span class="text-xs text-slate-400 block">????????</span><span class="text-base font-black text-teal-700">' + formatCurrency(inv.netAmount || 1200) + '</span></div>' +
                        '<button type="button" onclick="payInvoiceD1(\\'' + inv.id + '\\', \\'PROMPTPAY\\')" class="px-4 py-2 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm">?? ??????????? & ??????????</button>' +
                      '</div>' +
                    '</div>';
                  }).join("") +
                  '</div>'
                ) +
              '</div>' +
            '</div>'
          ) : "") +

          (bTab === "receipts" ? (
            '<div class="space-y-6">' +
              '<div class="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3">' +
                '<div class="flex flex-wrap items-center gap-3 flex-1">' +
                  '<div class="relative min-w-[240px] flex-1">' +
                    '<input type="text" value="' + (STATE.billingSearchReceipt || "") + '" oninput="STATE.billingSearchReceipt=this.value; renderView();" placeholder="?????????????????? REC-, DN, ?????????..." class="w-full px-3.5 py-2 pl-9 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-500 outline-none" />' +
                    '<span class="absolute left-3 top-2.5 text-slate-400 text-xs">??</span>' +
                  '</div>' +
                  '<div class="flex items-center gap-2">' +
                    '<span class="text-xs text-slate-500 font-medium">??????:</span>' +
                    '<input type="date" value="' + (STATE.billingDateFilter || "") + '" onchange="STATE.billingDateFilter=this.value; renderView();" class="px-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-700 outline-none" />' +
                  '</div>' +
                  (STATE.billingSearchReceipt || STATE.billingDateFilter ? '<button type="button" onclick="STATE.billingSearchReceipt=\\'\\'; STATE.billingDateFilter=\\'\\'; renderView();" class="text-xs text-rose-600 hover:underline">???????????</button>' : '') +
                '</div>' +
                '<div class="text-xs text-slate-500">????????? <span class="font-bold text-slate-900">' + filteredReceipts.length + '</span> ????</div>' +
              '</div>' +
              '<div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">' +
                '<div class="overflow-x-auto">' +
                  '<table class="w-full text-xs text-left">' +
                    '<thead class="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">' +
                      '<tr>' +
                        '<th class="px-4 py-3">?????????????</th>' +
                        '<th class="px-4 py-3">?????????????</th>' +
                        '<th class="px-4 py-3">????? (DN & ????)</th>' +
                        '<th class="px-4 py-3">???????????</th>' +
                        '<th class="px-4 py-3 text-right">??????</th>' +
                        '<th class="px-4 py-3 text-right">??????</th>' +
                        '<th class="px-4 py-3 text-right">????????</th>' +
                        '<th class="px-4 py-3 text-center">????????</th>' +
                        '<th class="px-4 py-3 text-center">?????</th>' +
                        '<th class="px-4 py-3 text-center">?????????</th>' +
                      '</tr>' +
                    '</thead>' +
                    '<tbody class="divide-y divide-slate-100 font-medium">' +
                      (filteredReceipts.length === 0 ? '<tr><td colspan="10" class="px-4 py-8 text-center text-slate-400">???????????????????????????????</td></tr>' :
                        filteredReceipts.map(r => {
                          const p = STATE.patients.find(x => x.id === r.patientId) || pat0;
                          return '<tr class="hover:bg-slate-50/80 ' + (r.isVoided ? 'bg-rose-50/30 text-slate-400' : '') + '">' +
                            '<td class="px-4 py-3 font-mono font-bold ' + (r.isVoided ? 'line-through text-rose-500' : 'text-slate-900') + '">' + (r.receiptNo || "REC-26001") + '</td>' +
                            '<td class="px-4 py-3 text-slate-500">' + formatThaiDateTime(r.receiptDate || r.createdAt) + '</td>' +
                            '<td class="px-4 py-3"><span class="font-bold text-slate-900 block">' + p.firstNameTh + ' ' + p.lastNameTh + '</span><span class="text-[10px] text-slate-400">' + p.dn + '</span></td>' +
                            '<td class="px-4 py-3 max-w-[200px] truncate text-slate-600">' + (r.treatments || "????????? / ??????") + '</td>' +
                            '<td class="px-4 py-3 text-right font-mono text-slate-600">' + formatCurrency(r.totalAmount || 0) + '</td>' +
                            '<td class="px-4 py-3 text-right font-mono text-rose-600">' + (r.totalDiscount ? '-' + formatCurrency(r.totalDiscount) : '-') + '</td>' +
                            '<td class="px-4 py-3 text-right font-mono font-bold ' + (r.isVoided ? 'line-through text-rose-600' : 'text-emerald-700') + '">' + formatCurrency(r.netAmount || 0) + '</td>' +
                            '<td class="px-4 py-3 text-center"><span class="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-semibold">' + (r.paymentMethodSummary || "PromptPay") + '</span></td>' +
                            '<td class="px-4 py-3 text-center">' +
                              (r.isVoided ? '<span class="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 font-bold text-[10px]">?????? (Voided)</span>' : '<span class="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">????????</span>') +
                            '</td>' +
                            '<td class="px-4 py-3 text-center">' +
                              '<div class="flex items-center justify-center gap-1.5">' +
                                '<button type="button" onclick="window.print()" title="???????????? A4 / ????" class="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-bold">??? ?????</button>' +
                                (!r.isVoided ? '<button type="button" onclick="STATE.voidReceiptModal=\\'' + r.id + '\\'; renderModals();" title="??????????????? (Void)" class="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-lg text-[11px] font-bold">?? ??????</button>' : '<span class="text-[10px] text-slate-400">??????????</span>') +
                              '</div>' +
                            '</td>' +
                          '</tr>';
                        }).join("")
                      ) +
                    '</tbody>' +
                  '</table>' +
                '</div>' +
              '</div>' +
            '</div>'
          ) : "") +

          (bTab === "voided" ? (
            '<div class="space-y-6">' +
              '<div class="p-4 bg-rose-50/50 rounded-2xl border border-rose-200 flex items-center justify-between">' +
                '<div class="space-y-0.5">' +
                  '<h3 class="font-bold text-sm text-rose-900">??????????????????????? (Void Audit Trail)</h3>' +
                  '<p class="text-xs text-rose-700">???????????????????????????????? ????????????????? ?????????? ????????????? ????????????????????????</p>' +
                '</div>' +
                '<span class="px-3 py-1 bg-rose-100 text-rose-800 rounded-xl font-bold text-xs">??? ' + voidedReceipts.length + ' ????</span>' +
              '</div>' +
              '<div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">' +
                '<div class="overflow-x-auto">' +
                  '<table class="w-full text-xs text-left">' +
                    '<thead class="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">' +
                      '<tr>' +
                        '<th class="px-4 py-3">?????????????</th>' +
                        '<th class="px-4 py-3">????????????????</th>' +
                        '<th class="px-4 py-3">????? (DN & ????)</th>' +
                        '<th class="px-4 py-3">?????????????????</th>' +
                        '<th class="px-4 py-3">???????????????????</th>' +
                        '<th class="px-4 py-3 text-right">???????????</th>' +
                        '<th class="px-4 py-3 text-center">?????</th>' +
                      '</tr>' +
                    '</thead>' +
                    '<tbody class="divide-y divide-slate-100 font-medium">' +
                      (voidedReceipts.length === 0 ? '<tr><td colspan="7" class="px-4 py-8 text-center text-slate-400">???????????????????????????????</td></tr>' :
                        voidedReceipts.map(r => {
                          const p = STATE.patients.find(x => x.id === r.patientId) || pat0;
                          return '<tr class="hover:bg-slate-50">' +
                            '<td class="px-4 py-3 font-mono font-bold text-rose-600 line-through">' + (r.receiptNo || "REC-26003") + '</td>' +
                            '<td class="px-4 py-3 text-slate-500">' + formatThaiDateTime(r.voidedAt || r.receiptDate) + '</td>' +
                            '<td class="px-4 py-3"><span class="font-bold text-slate-800">' + p.firstNameTh + ' ' + p.lastNameTh + '</span> <span class="text-slate-400">(' + p.dn + ')</span></td>' +
                            '<td class="px-4 py-3 text-slate-700 font-semibold">' + (r.voidReason || "?????? / ???????????????") + '</td>' +
                            '<td class="px-4 py-3 text-slate-600">' + (r.voidedBy || "??. ??????") + '</td>' +
                            '<td class="px-4 py-3 text-right font-mono font-bold text-slate-900">' + formatCurrency(r.netAmount || 0) + '</td>' +
                            '<td class="px-4 py-3 text-center"><span class="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold text-[10px]">VOIDED</span></td>' +
                          '</tr>';
                        }).join("")
                      ) +
                    '</tbody>' +
                  '</table>' +
                '</div>' +
              '</div>' +
            '</div>'
          ) : "") +
        '</div>';
        if (window.lucide) window.lucide.createIcons();
        return;
      }
`;
module.exports = { billingViewCode };
