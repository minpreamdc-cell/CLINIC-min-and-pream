const filesViewCode = `
      // 4C. CENTRAL CLINIC FILE & X-RAY MANAGER (DentCloud Parity Gap 6)
      if (tab === "files") {
        const cat = STATE.filesCategory || "ALL";
        const fq = (STATE.filesSearch || "").toLowerCase().trim();

        const categories = [
          { key: "ALL", label: "???????", icon: "folder" },
          { key: "XRAY", label: "??????????? (X-Ray / OPG)", icon: "film" },
          { key: "INTRAORAL", label: "?????????????? (Intraoral)", icon: "camera" },
          { key: "OPD", label: "?????????? (OPD Card Scan)", icon: "file-text" },
          { key: "CONSENT", label: "???????????????? (Consent Form)", icon: "check-square" },
          { key: "TRASH", label: "??? ???????????? (Trash)", icon: "trash-2" }
        ];

        let docsToShow = [];
        if (cat === "TRASH") {
          docsToShow = STATE.trashDocuments;
        } else {
          docsToShow = STATE.documents.filter(d => {
            if (cat !== "ALL" && d.documentType !== cat) return false;
            return true;
          });
        }

        if (fq) {
          docsToShow = docsToShow.filter(d => {
            const p = STATE.patients.find(x => x.id === d.patientId) || pat0;
            const hay = ((d.title || "") + " " + (p.firstNameTh || "") + " " + (p.lastNameTh || "") + " " + (p.dn || "")).toLowerCase();
            return hay.includes(fq);
          });
        }

        container.innerHTML = '<div class="space-y-6">' +
          '<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">' +
            '<div>' +
              '<h2 class="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">' +
                '<span class="w-8 h-8 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-sm">??</span>' +
                '?????????????? & ????????????????? (Central Document & X-Ray Manager)' +
              '</h2>' +
              '<p class="text-xs text-slate-500 mt-1">???????????? X-Ray (OPG, Film), ??????????????, ?????????????? OPD Card ??????????? ?????????????????????</p>' +
            '</div>' +
            '<div class="flex items-center gap-2">' +
              '<button type="button" onclick="STATE.uploadDocModal=true; renderModals();" class="px-4 py-2 bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-1.5">' +
                '<span>+ ?????????????????????</span>' +
              '</button>' +
            '</div>' +
          '</div>' +

          // Category Pills & Search Bar
          '<div class="flex flex-col md:flex-row md:items-center justify-between gap-3">' +
            '<div class="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-xl">' +
              categories.map(c => {
                const count = c.key === "TRASH" ? STATE.trashDocuments.length : (c.key === "ALL" ? STATE.documents.length : STATE.documents.filter(d => d.documentType === c.key).length);
                const active = cat === c.key;
                return '<button type="button" onclick="STATE.filesCategory=\\'' + c.key + '\\'; renderView();" class="px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ' + (active ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900') + '">' +
                  '<span>' + c.label + '</span>' +
                  '<span class="px-1.5 py-0.2 rounded-full text-[10px] ' + (active ? 'bg-sky-100 text-sky-800' : 'bg-slate-200 text-slate-600') + '">' + count + '</span>' +
                '</button>';
              }).join("") +
            '</div>' +
            '<div class="relative min-w-[260px]">' +
              '<input type="text" value="' + (STATE.filesSearch || "") + '" oninput="STATE.filesSearch=this.value; renderView();" placeholder="????????????????, DN, ?????????..." class="w-full px-3.5 py-2 pl-9 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-sky-500 outline-none" />' +
              '<span class="absolute left-3 top-2.5 text-slate-400 text-xs">??</span>' +
            '</div>' +
          '</div>' +

          // Trash Notice (if in trash)
          (cat === "TRASH" ? (
            '<div class="p-3.5 bg-amber-50 rounded-xl border border-amber-200 flex items-center justify-between text-xs text-amber-800">' +
              '<div class="flex items-center gap-2"><span>??</span><span>???????????????????????????????????????? ?????????????????????????????????? ????????? ?????? ???????????????????????</span></div>' +
              '<span class="font-bold">' + STATE.trashDocuments.length + ' ????????????</span>' +
            '</div>'
          ) : "") +

          // Document Grid
          (docsToShow.length === 0 ? (
            '<div class="py-16 text-center bg-white rounded-2xl border border-slate-200 shadow-sm">' +
              '<div class="text-3xl mb-2">' + (cat === "TRASH" ? "???" : "??") + '</div>' +
              '<p class="text-xs text-slate-500">' + (cat === "TRASH" ? "?????????????????" : "????????????????????????????") + '</p>' +
            '</div>'
          ) : (
            '<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">' +
              docsToShow.map(doc => {
                const p = STATE.patients.find(x => x.id === doc.patientId) || pat0;
                const isImage = (doc.fileUrl || "").match(/\\.(jpeg|jpg|png|gif|webp)|unsplash/i);
                const typeLabels = { XRAY: "X-Ray Film", INTRAORAL: "??????????", OPD: "??????????", CONSENT: "????????", LAB: "???" };
                const typeColors = { XRAY: "bg-indigo-100 text-indigo-800", INTRAORAL: "bg-pink-100 text-pink-800", OPD: "bg-amber-100 text-amber-800", CONSENT: "bg-emerald-100 text-emerald-800", LAB: "bg-purple-100 text-purple-800" };
                return '<div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:border-slate-300 transition-all flex flex-col justify-between">' +
                  '<div>' +
                    '<div class="relative h-44 bg-slate-900 overflow-hidden flex items-center justify-center cursor-pointer" onclick="STATE.previewDocModal=' + JSON.stringify(doc).replace(/"/g, '&quot;') + '; renderModals();">' +
                      (isImage ? '<img src="' + doc.fileUrl + '" alt="' + doc.title + '" class="w-full h-full object-cover hover:scale-105 transition-transform duration-300 opacity-90 hover:opacity-100" />' :
                        '<div class="text-slate-400 text-center space-y-1"><span class="text-4xl block">??</span><span class="text-xs font-semibold uppercase font-mono">' + (doc.documentType || "DOC") + '</span></div>') +
                      '<span class="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full text-[10px] font-black shadow-sm ' + (typeColors[doc.documentType] || 'bg-slate-100 text-slate-800') + '">' + (typeLabels[doc.documentType] || doc.documentType) + '</span>' +
                    '</div>' +
                    '<div class="p-4 space-y-2">' +
                      '<div class="flex items-center gap-1.5"><span class="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-mono font-bold text-[10px]">' + p.dn + '</span><span class="font-bold text-slate-900 text-xs truncate">' + p.firstNameTh + ' ' + p.lastNameTh + '</span></div>' +
                      '<h4 class="font-bold text-xs text-slate-800 line-clamp-1" title="' + doc.title + '">' + doc.title + '</h4>' +
                      '<div class="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-100">' +
                        '<span>' + formatThaiDateTime(doc.uploadedAt) + '</span>' +
                        '<span>' + (doc.fileSize ? (doc.fileSize / 1024 / 1024).toFixed(1) + ' MB' : '1.5 MB') + '</span>' +
                      '</div>' +
                    '</div>' +
                  '</div>' +
                  '<div class="px-4 pb-4 pt-1 flex items-center justify-between border-t border-slate-50 gap-2">' +
                    (cat === "TRASH" ? (
                      '<div class="flex items-center justify-between w-full gap-2">' +
                        '<button type="button" onclick="restoreDocFromTrash(\\'' + doc.id + '\\')" class="flex-1 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold transition-all">?? ??????????</button>' +
                        '<button type="button" onclick="permanentDeleteDoc(\\'' + doc.id + '\\')" class="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-xl text-xs font-bold transition-all">? ??????</button>' +
                      '</div>'
                    ) : (
                      '<div class="flex items-center justify-between w-full gap-2">' +
                        '<button type="button" onclick="STATE.previewDocModal=' + JSON.stringify(doc).replace(/"/g, '&quot;') + '; renderModals();" class="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-all">?? ??????????</button>' +
                        '<a href="' + doc.fileUrl + '" target="_blank" download class="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl text-xs font-bold border border-slate-200">??</a>' +
                        '<button type="button" onclick="moveDocToTrash(\\'' + doc.id + '\\')" title="????????????" class="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl text-xs font-bold border border-rose-200">???</button>' +
                      '</div>'
                    )) +
                  '</div>' +
                '</div>';
              }).join("") +
            '</div>'
          )) +
        '</div>';
        if (window.lucide) window.lucide.createIcons();
        return;
      }
`;
module.exports = { filesViewCode };
