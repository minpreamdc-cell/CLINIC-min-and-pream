const modalsCode = `
      // DENTCLOUD MODAL POPUPS
      if (STATE.newDepositModal) {
        root.innerHTML = '<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">' +
          '<div class="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 space-y-4 border border-slate-100 animate-in fade-in zoom-in-95 duration-150">' +
            '<div class="flex items-center justify-between border-b border-slate-100 pb-3">' +
              '<h3 class="font-bold text-base text-slate-900 flex items-center gap-2"><span>??</span><span>???????????????????????</span></h3>' +
              '<button type="button" onclick="STATE.newDepositModal=false; renderModals();" class="text-slate-400 hover:text-slate-600 text-lg">?</button>' +
            '</div>' +
            '<div class="space-y-3 text-xs">' +
              '<div>' +
                '<label class="block text-slate-600 font-bold mb-1">??????????:</label>' +
                '<select id="dep-pat" class="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-sky-500">' +
                  STATE.patients.map(p => '<option value="' + p.id + '">' + p.firstNameTh + ' ' + p.lastNameTh + ' (' + p.dn + ')</option>').join("") +
                '</select>' +
              '</div>' +
              '<div>' +
                '<label class="block text-slate-600 font-bold mb-1">?????????????? (???):</label>' +
                '<input type="number" id="dep-amt" value="3000" min="100" step="100" class="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-bold font-mono outline-none focus:ring-2 focus:ring-sky-500" />' +
              '</div>' +
              '<div>' +
                '<label class="block text-slate-600 font-bold mb-1">???????????????:</label>' +
                '<select id="dep-method" class="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none">' +
                  '<option value="PROMPTPAY">PromptPay QR Code</option>' +
                  '<option value="TRANSFER">??????????????????????</option>' +
                  '<option value="CASH">??????</option>' +
                  '<option value="CARD">?????????? / ?????</option>' +
                '</select>' +
              '</div>' +
              '<div>' +
                '<label class="block text-slate-600 font-bold mb-1">???????? / ????????????:</label>' +
                '<input type="text" id="dep-note" value="?????????????? / ?????????????" class="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none" />' +
              '</div>' +
            '</div>' +
            '<div class="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">' +
              '<button type="button" onclick="STATE.newDepositModal=false; renderModals();" class="px-4 py-2 text-slate-600 font-bold text-xs hover:bg-slate-100 rounded-xl">??????</button>' +
              '<button type="button" onclick="submitNewDeposit()" class="px-4 py-2 bg-gradient-to-r from-sky-600 to-teal-600 text-white font-bold text-xs rounded-xl shadow-sm">? ??????????????????</button>' +
            '</div>' +
          '</div>' +
        '</div>';
        return;
      }

      if (STATE.voidReceiptModal) {
        const recId = STATE.voidReceiptModal;
        const rec = STATE.receipts.find(r => r.id === recId) || { receiptNo: "REC-26001", netAmount: 1200 };
        root.innerHTML = '<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">' +
          '<div class="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 space-y-4 border border-rose-100 animate-in fade-in zoom-in-95 duration-150">' +
            '<div class="flex items-center justify-between border-b border-rose-100 pb-3">' +
              '<h3 class="font-bold text-base text-rose-700 flex items-center gap-2"><span>??</span><span>?????????????????????? (Void Receipt)</span></h3>' +
              '<button type="button" onclick="STATE.voidReceiptModal=null; renderModals();" class="text-slate-400 hover:text-slate-600 text-lg">?</button>' +
            '</div>' +
            '<div class="space-y-3 text-xs">' +
              '<div class="p-3 bg-rose-50 rounded-xl text-rose-800 space-y-1">' +
                '<div class="font-bold">?????????????: <span class="font-mono text-sm">' + (rec.receiptNo || recId) + '</span></div>' +
                '<div>????????????: <span class="font-mono font-bold">' + formatCurrency(rec.netAmount || 0) + '</span></div>' +
                '<p class="text-[11px] text-rose-600">?????????????????????????????????????????? (Audit Trail) ???????????????????</p>' +
              '</div>' +
              '<div>' +
                '<label class="block text-slate-700 font-bold mb-1">?????????????????:</label>' +
                '<select id="void-reason-select" class="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none mb-2" onchange="if(this.value!==\\'?????\\') document.getElementById(\\'void-reason-custom\\').value=this.value;">' +
                  '<option value="?????????????????????">?????????????????????</option>' +
                  '<option value="??????????????????????????">??????????????????????????</option>' +
                  '<option value="?????????????????????????">?????????????????????????</option>' +
                  '<option value="??????????">??????????</option>' +
                  '<option value="?????">????? (????????????)</option>' +
                '</select>' +
                '<input type="text" id="void-reason-custom" value="?????????????????????" class="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none" placeholder="??????????????????????..." />' +
              '</div>' +
              '<div>' +
                '<label class="block text-slate-700 font-bold mb-1">?????????????????:</label>' +
                '<select id="void-approver" class="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none">' +
                  '<option value="??. ?????? (??????????????????????)">??. ?????? (??????????????????????)</option>' +
                  '<option value="??. ???? (?????????)">??. ???? (?????????)</option>' +
                '</select>' +
              '</div>' +
            '</div>' +
            '<div class="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">' +
              '<button type="button" onclick="STATE.voidReceiptModal=null; renderModals();" class="px-4 py-2 text-slate-600 font-bold text-xs hover:bg-slate-100 rounded-xl">??????</button>' +
              '<button type="button" onclick="voidReceiptAction(\\'' + recId + '\\', document.getElementById(\\'void-reason-custom\\').value)" class="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-sm">? ??????????????? (Void)</button>' +
            '</div>' +
          '</div>' +
        '</div>';
        return;
      }

      if (STATE.dfAdjustModal) {
        const item = STATE.dfAdjustModal;
        root.innerHTML = '<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">' +
          '<div class="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 space-y-4 border border-slate-100 animate-in fade-in zoom-in-95 duration-150">' +
            '<div class="flex items-center justify-between border-b border-slate-100 pb-3">' +
              '<h3 class="font-bold text-base text-slate-900 flex items-center gap-2"><span>??</span><span>?????????????????????????????? (Retroactive DF)</span></h3>' +
              '<button type="button" onclick="STATE.dfAdjustModal=null; renderModals();" class="text-slate-400 hover:text-slate-600 text-lg">?</button>' +
            '</div>' +
            '<div class="space-y-3 text-xs">' +
              '<div class="p-3 bg-sky-50 rounded-xl text-sky-900 space-y-1">' +
                '<div class="font-bold">' + (item.patientName || "?????") + '</div>' +
                '<div>???????: ' + (item.procName || "???????") + '</div>' +
                '<div>????????? DF ????: <span class="font-mono font-bold text-slate-900">' + formatCurrency(item.calculatedDf || 600) + '</span></div>' +
              '</div>' +
              '<div>' +
                '<label class="block text-slate-700 font-bold mb-1">??????????????????????????????? (???):</label>' +
                '<input type="number" id="df-new-amt" value="' + (item.calculatedDf || 600) + '" step="50" class="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-bold font-mono outline-none focus:ring-2 focus:ring-sky-500" />' +
              '</div>' +
              '<div>' +
                '<label class="block text-slate-700 font-bold mb-1">???????????????????:</label>' +
                '<input type="text" id="df-reason" value="??????????? ??????????????????" class="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none" />' +
              '</div>' +
            '</div>' +
            '<div class="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">' +
              '<button type="button" onclick="STATE.dfAdjustModal=null; renderModals();" class="px-4 py-2 text-slate-600 font-bold text-xs hover:bg-slate-100 rounded-xl">??????</button>' +
              '<button type="button" onclick="adjustDfAction(\\'' + item.caseId + '\\', Number(document.getElementById(\\'df-new-amt\\').value), document.getElementById(\\'df-reason\\').value)" class="px-4 py-2 bg-gradient-to-r from-sky-600 to-teal-600 text-white font-bold text-xs rounded-xl shadow-sm">? ?????????????? DF</button>' +
            '</div>' +
          '</div>' +
        '</div>';
        return;
      }

      if (STATE.newProcedureModal) {
        const proc = typeof STATE.newProcedureModal === "object" ? STATE.newProcedureModal : { code: "D", nameTh: "", category: "GENERAL", standardPrice: 1000, dfType: "PERCENT", dfValue: 50, durationMinutes: 30, isActive: 1 };
        root.innerHTML = '<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">' +
          '<div class="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 space-y-4 border border-slate-100 animate-in fade-in zoom-in-95 duration-150">' +
            '<div class="flex items-center justify-between border-b border-slate-100 pb-3">' +
              '<h3 class="font-bold text-base text-slate-900 flex items-center gap-2"><span>??</span><span>' + (proc.nameTh ? "???????????? " + proc.code : "????????????????????????") + '</span></h3>' +
              '<button type="button" onclick="STATE.newProcedureModal=false; renderModals();" class="text-slate-400 hover:text-slate-600 text-lg">?</button>' +
            '</div>' +
            '<div class="grid grid-cols-2 gap-3 text-xs">' +
              '<div>' +
                '<label class="block text-slate-700 font-bold mb-1">???????????:</label>' +
                '<input type="text" id="proc-code" value="' + (proc.code || "D80") + '" class="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono font-bold uppercase outline-none focus:ring-2 focus:ring-sky-500" />' +
              '</div>' +
              '<div>' +
                '<label class="block text-slate-700 font-bold mb-1">????????:</label>' +
                '<select id="proc-cat" class="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none">' +
                  '<option value="GENERAL"' + (proc.category === "GENERAL" ? " selected" : "") + '>?????? (General)</option>' +
                  '<option value="PREVENTIVE"' + (proc.category === "PREVENTIVE" ? " selected" : "") + '>??????? / ?????????</option>' +
                  '<option value="OPERATIVE"' + (proc.category === "OPERATIVE" ? " selected" : "") + '>????????????? / ??????</option>' +
                  '<option value="SURGERY"' + (proc.category === "SURGERY" ? " selected" : "") + '>?????????? / ?????? / ?????????</option>' +
                  '<option value="ENDO"' + (proc.category === "ENDO" ? " selected" : "") + '>???????????</option>' +
                  '<option value="ORTHO"' + (proc.category === "ORTHO" ? " selected" : "") + '>??????</option>' +
                  '<option value="ESTHETIC"' + (proc.category === "ESTHETIC" ? " selected" : "") + '>????????????????????</option>' +
                '</select>' +
              '</div>' +
              '<div class="col-span-2">' +
                '<label class="block text-slate-700 font-bold mb-1">??????????? (???):</label>' +
                '<input type="text" id="proc-name" value="' + (proc.nameTh || "") + '" placeholder="???? ????????????????? Sealant" class="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-sky-500" />' +
              '</div>' +
              '<div>' +
                '<label class="block text-slate-700 font-bold mb-1">??????????? (???):</label>' +
                '<input type="number" id="proc-price" value="' + (proc.standardPrice || 1000) + '" class="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono font-bold outline-none" />' +
              '</div>' +
              '<div>' +
                '<label class="block text-slate-700 font-bold mb-1">?????????????? (????):</label>' +
                '<input type="number" id="proc-duration" value="' + (proc.durationMinutes || 30) + '" class="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none" />' +
              '</div>' +
              '<div>' +
                '<label class="block text-slate-700 font-bold mb-1">?????????????? DF:</label>' +
                '<select id="proc-df-type" class="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none">' +
                  '<option value="PERCENT"' + (proc.dfType === "PERCENT" ? " selected" : "") + '>??????????? (%)</option>' +
                  '<option value="FIXED"' + (proc.dfType === "FIXED" ? " selected" : "") + '>???????? (THB Fixed)</option>' +
                '</select>' +
              '</div>' +
              '<div>' +
                '<label class="block text-slate-700 font-bold mb-1">??? DF (% ???? ???):</label>' +
                '<input type="number" id="proc-df-val" value="' + (proc.dfValue || 50) + '" class="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono font-bold outline-none" />' +
              '</div>' +
            '</div>' +
            '<div class="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">' +
              '<button type="button" onclick="STATE.newProcedureModal=false; renderModals();" class="px-4 py-2 text-slate-600 font-bold text-xs hover:bg-slate-100 rounded-xl">??????</button>' +
              '<button type="button" onclick="saveProcedureCatalogAction({ code: document.getElementById(\\'proc-code\\').value, nameTh: document.getElementById(\\'proc-name\\').value, category: document.getElementById(\\'proc-cat\\').value, standardPrice: Number(document.getElementById(\\'proc-price\\').value), dfType: document.getElementById(\\'proc-df-type\\').value, dfValue: Number(document.getElementById(\\'proc-df-val\\').value), durationMinutes: Number(document.getElementById(\\'proc-duration\\').value), isActive: 1 })" class="px-4 py-2 bg-gradient-to-r from-sky-600 to-teal-600 text-white font-bold text-xs rounded-xl shadow-sm">? ?????????????</button>' +
            '</div>' +
          '</div>' +
        '</div>';
        return;
      }

      if (STATE.previewDocModal) {
        const doc = STATE.previewDocModal;
        const p = STATE.patients.find(x => x.id === doc.patientId) || pat0;
        root.innerHTML = '<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md">' +
          '<div class="bg-white rounded-3xl shadow-2xl max-w-3xl w-full p-6 space-y-4 border border-slate-100 animate-in fade-in zoom-in-95 duration-150">' +
            '<div class="flex items-center justify-between border-b border-slate-100 pb-3">' +
              '<div>' +
                '<h3 class="font-bold text-base text-slate-900">' + doc.title + '</h3>' +
                '<p class="text-xs text-slate-400">?????: ' + p.firstNameTh + ' ' + p.lastNameTh + ' (' + p.dn + ') • ????????: ' + doc.documentType + '</p>' +
              '</div>' +
              '<button type="button" onclick="STATE.previewDocModal=null; renderModals();" class="text-slate-400 hover:text-slate-600 text-xl font-bold">?</button>' +
            '</div>' +
            '<div class="max-h-[65vh] overflow-auto rounded-2xl bg-slate-950 flex items-center justify-center p-2">' +
              '<img src="' + doc.fileUrl + '" alt="' + doc.title + '" class="max-w-full max-h-[60vh] object-contain rounded-xl" />' +
            '</div>' +
            '<div class="flex items-center justify-between text-xs pt-1 border-t border-slate-100">' +
              '<span class="text-slate-500">????????????: ' + formatThaiDateTime(doc.uploadedAt) + ' ??? ' + (doc.uploadedBy || "???????????") + '</span>' +
              '<div class="flex items-center gap-2">' +
                '<a href="' + doc.fileUrl + '" target="_blank" download class="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl shadow-sm">?? ?????????????</a>' +
                '<button type="button" onclick="STATE.previewDocModal=null; renderModals();" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl">???</button>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>';
        return;
      }

      if (STATE.uploadDocModal) {
        root.innerHTML = '<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">' +
          '<div class="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 space-y-4 border border-slate-100 animate-in fade-in zoom-in-95 duration-150">' +
            '<div class="flex items-center justify-between border-b border-slate-100 pb-3">' +
              '<h3 class="font-bold text-base text-slate-900 flex items-center gap-2"><span>??</span><span>????????????????????????????</span></h3>' +
              '<button type="button" onclick="STATE.uploadDocModal=false; renderModals();" class="text-slate-400 hover:text-slate-600 text-lg">?</button>' +
            '</div>' +
            '<div class="space-y-3 text-xs">' +
              '<div>' +
                '<label class="block text-slate-700 font-bold mb-1">??????????:</label>' +
                '<select id="up-pat" class="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-sky-500">' +
                  STATE.patients.map(p => '<option value="' + p.id + '">' + p.firstNameTh + ' ' + p.lastNameTh + ' (' + p.dn + ')</option>').join("") +
                '</select>' +
              '</div>' +
              '<div>' +
                '<label class="block text-slate-700 font-bold mb-1">????????????:</label>' +
                '<select id="up-type" class="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none">' +
                  '<option value="XRAY">??????????????? (X-Ray OPG / Film)</option>' +
                  '<option value="INTRAORAL">?????????????? (Intraoral Photo)</option>' +
                  '<option value="OPD">?????????????? (OPD Card Scan)</option>' +
                  '<option value="CONSENT">??????????????????? (Consent Form)</option>' +
                  '<option value="LAB">???????????? (Lab Slip)</option>' +
                '</select>' +
              '</div>' +
              '<div>' +
                '<label class="block text-slate-700 font-bold mb-1">???????? / ????????:</label>' +
                '<input type="text" id="up-title" value="????????????? Panoramic ??????" class="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-sky-500" />' +
              '</div>' +
              '<div>' +
                '<label class="block text-slate-700 font-bold mb-1">URL ?????? / ????????????:</label>' +
                '<input type="text" id="up-url" value="https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=600&q=80" class="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono text-[11px] outline-none" />' +
              '</div>' +
            '</div>' +
            '<div class="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">' +
              '<button type="button" onclick="STATE.uploadDocModal=false; renderModals();" class="px-4 py-2 text-slate-600 font-bold text-xs hover:bg-slate-100 rounded-xl">??????</button>' +
              '<button type="button" onclick="uploadNewDocAction({ id: \\'doc-\\' + Date.now(), patientId: document.getElementById(\\'up-pat\\').value, documentType: document.getElementById(\\'up-type\\').value, title: document.getElementById(\\'up-title\\').value, fileUrl: document.getElementById(\\'up-url\\').value, fileSize: 2500000, uploadedAt: new Date().toISOString(), uploadedBy: \\'???????? (??????????)\\' })" class="px-4 py-2 bg-gradient-to-r from-sky-600 to-teal-600 text-white font-bold text-xs rounded-xl shadow-sm">? ??????????</button>' +
            '</div>' +
          '</div>' +
        '</div>';
        return;
      }
`;
module.exports = { modalsCode };
