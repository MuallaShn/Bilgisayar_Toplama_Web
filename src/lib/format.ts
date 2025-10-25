export const tl = (v: number | undefined) =>
    (v ?? 0).toLocaleString("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: 0 });
