export type Stok = { durum: "in_stock" | "limited" | "out_of_stock"; adet?: number } | number | undefined;

export function stokDurumu(stok: Stok): "in" | "limited" | "out" | "unknown" {
    if (typeof stok === "number") return stok > 0 ? "in" : "out";
    if (!stok) return "unknown";
    if (stok.durum === "out_of_stock") return "out";
    if (stok.durum === "limited") return "limited";
    return "in";
}
