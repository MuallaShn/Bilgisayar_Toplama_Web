export interface Anakart {
    id: string;
    ad: string;
    marka: string;
    model: string;
    fiyat_try: number;
    stok: { durum: string; adet: number };
    form_factor: 'ATX' | 'Micro-ATX' | 'Mini-ITX';
    soket: string;
    cpu_uyumluluk: {
        vendor: 'AMD' | 'Intel';
        socket: string;
        nesiller: string[];
    };
    bellek: {
        tip: 'DDR4' | 'DDR5';
        yuva_sayisi: number;
        max_kapasite_gb: number;
        hiz_mhz: number[];
    };
    depolama: { sata: number; m2: number; m2_pci_gen: number };
    genisleme: { pcie_x16: number; pcie_x1: number; pcie_gen: number };
}

export interface Islemci {
    id: string;
    ad: string;
    marka: string;
    model: string;
    fiyat_try: number;
    stok: { durum: string; adet: number };
    vendor: 'AMD' | 'Intel';
    soket: string;
    nesil: string;
    cekirdek_sayi: number;
    izlek_sayi: number;
    tdp_w: number;
    bellek_destek: { tip: 'DDR4' | 'DDR5'; max_mhz: number };
    igpu?: boolean;
}

export interface Ram {
    id: string;
    ad: string;
    marka: string;
    tip: 'DDR4' | 'DDR5';
    hiz_mhz: number;
    modul_sayisi: number;
    kapasite_kit_gb: number;
    profil?: ('XMP' | 'EXPO')[];
    stok: { durum: string; adet: number };
    fiyat_try: number;
}

export interface Gpu {
    id: string;
    ad: string;
    marka: string;
    fiyat_try: number;
    stok: { durum: string; adet: number };
    vram: { boyut_gb: number; tip: string };
    pcie_arayuz: { surum: 'Gen3' | 'Gen4' | 'Gen5'; hat_sayisi: 'x16' | 'x8' | 'x4' };
    guc: { tgp_w: number; ek_guc_konnektoru?: string[]; onerilen_psu_w: number };
    boyut: { uzunluk_mm: number; kalinlik_slot: number };
}

export interface Psu {
    id: string;
    ad: string;
    marka: string;
    model: string;
    fiyat_try: number;
    stok: { durum: string; adet: number };
    guc_w: number;
    verimlilik: string;
    form_factor: string;
    ek_guc_konnektoru?: string[];
}

export interface Kasa {
    id: string;
    ad: string;
    marka: string;
    fiyat_try: number;
    stok: { durum: string; adet: number };
    mobo_destek: string[];
    gpu_uzunluk_max_mm: number;
    psu_destek: string[];
    psu_tumlesik?: boolean;
    psu_dahili?: Psu;
    cpu_sogutucu_yukseklik_max_mm: number;
    radyator_destek: { front: number[]; top: number[]; rear: number[] };
}

export interface Sogutucu {
    id: string;
    ad: string;
    fiyat_try: number;
    stok: { durum: string; adet: number };
    desteklenen_soketler: string[];
    max_tdp_w: number;
    yukseklik_mm: number;
    radyator_mm?: number;
}

export interface Depolama {
    id: string;
    ad: string;
    fiyat_try: number;
    stok: { durum: string; adet: number };
    tip: string; // "SATA 2.5", "M.2 NVMe" vb.
    arayuz?: { pcie_gen?: number };
}

export interface Monitor { id: string; ad: string; fiyat_try: number; marka: string; stok: { durum: string; adet: number }; ozellikler?: any; }
export interface Klavye { id: string; ad: string; fiyat_try: number; marka: string; stok: { durum: string; adet: number }; }
export interface Fare { id: string; ad: string; fiyat_try: number; marka: string; stok: { durum: string; adet: number }; }

export type TumParcalar =
    | Anakart | Islemci | Ram | Gpu | Psu | Kasa | Depolama | Monitor | Klavye | Fare | Sogutucu;
