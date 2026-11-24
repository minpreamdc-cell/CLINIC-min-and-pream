fetch("https://minpream-dental-clinic.minpream-dental.workers.dev/?v=" + Date.now(), { headers: { "Cache-Control": "no-cache" } })
  .then(r => r.text())
  .then(html => {
    console.log("HTML Length:", html.length);
    console.log("Has files key in NAV_ITEMS:", html.includes('key: "files"'));
    console.log("Has settings key in NAV_ITEMS:", html.includes('key: "settings"'));
    console.log("Has deposits in STATE:", html.includes("deposits: ["));
    console.log("Has insuranceClaims in STATE:", html.includes("insuranceClaims: ["));
    console.log("Has voidReceiptModal in STATE:", html.includes("voidReceiptModal:"));
    console.log("Has ProcedureCatalog in HTML:", html.includes("Procedure Catalog"));
  })
  .catch(e => console.error(e));
