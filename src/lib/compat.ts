
/* eslint-disable @typescript-eslint/no-explicit-any */

type AnyPart = Record<string, any>;
type Check = { ok: true } | { ok: false; reason: string };

const ok = (): Check => ({ ok: true });
const no = (reason: string): Check => ({ ok: false, reason });

/* 3.1 Anakart ↔ CPU */
export function checkCPUwithMB(cpu: AnyPart, mb: AnyPart | undefined): Check {
    if (!mb) return ok();
    const cu = mb?.cpu_uyumluluk;
    if (cu?.vendor && cpu?.vendor && cu.vendor !== cpu.vendor)
        return no("CPU vendor anakartla uyumsuz");
    if (cu?.socket && cpu?.soket && cu.socket !== cpu.soket)
        return no("CPU soketi anakartla uyumsuz");
    if (Array.isArray(cu?.nesiller) && cpu?.nesil && !cu.nesiller.includes(cpu.nesil))
        return no("CPU nesli anakart listesinde yok");
    return ok();
}

/* 3.2 Anakart ↔ RAM */
export function checkRAMwithMB(ram: AnyPart, mb: AnyPart | undefined): Check {
    if (!mb) return ok();
    const b = mb?.bellek;
    if (ram?.tip && b?.tip && ram.tip !== b.tip)
        return no("RAM tipi (DDR) anakartla uyumsuz");
    const maxHz = Array.isArray(b?.hiz_mhz) ? Math.max(...b.hiz_mhz) : b?.hiz_mhz;
    if (ram?.hiz_mhz && maxHz && ram.hiz_mhz > maxHz)
        return no("RAM frekansı anakart maksimumunu aşıyor");
    if (ram?.modul_sayisi && b?.yuva_sayisi && ram.modul_sayisi > b.yuva_sayisi)
        return no("RAM modül sayısı yuva sayısını aşıyor");
    return ok();
}

/* 3.3 Anakart ↔ GPU */
export function checkGPUwithMB(gpu: AnyPart, mb: AnyPart | undefined): Check {
    if (!mb) return ok();
    if (mb?.genisleme?.pcie_x16 !== undefined && mb.genisleme.pcie_x16 < 1)
        return no("Anakartta x16 PCIe yuvası yok");
    return ok(); // sürüm uyarısı yalnızca bilgilendirme amaçlı
}

/* 3.4 Kasa ↔ Anakart */
export function checkCaseWithMB(kasa: AnyPart, mb: AnyPart | undefined): Check {
    if (!mb) return ok();
    if (kasa?.mobo_destek && mb?.form_factor && !kasa.mobo_destek.includes(mb.form_factor))
        return no("Kasa, anakart form factorünü desteklemiyor");
    return ok();
}

/* 3.5 Kasa ↔ GPU */
export function checkCaseWithGPU(kasa: AnyPart, gpu: AnyPart | undefined): Check {
    if (!gpu) return ok();
    if (kasa?.gpu_uzunluk_max_mm && gpu?.boyut?.uzunluk_mm && gpu.boyut.uzunluk_mm > kasa.gpu_uzunluk_max_mm)
        return no("GPU kasaya sığmıyor (uzunluk)");
    return ok();
}

/* 3.6 PSU ↔ GPU (+ Sistem) */
export function checkPSU(psu: AnyPart, cpu: AnyPart | undefined, gpu: AnyPart | undefined): Check {
    if (!psu) return ok();
    if (!cpu && !gpu) return ok();

    const cpuTdp = cpu?.tdp_w ?? 120;
    const gpuTgp = gpu?.guc?.tgp_w ?? gpu?.tgp ?? gpu?.guc_w ?? 300;

    const totalLoad = cpuTdp + gpuTgp + 100; // sistem payı
    const psuPower = psu?.guc_w ?? 0;

    if (psuPower < totalLoad * 1.05)
        return no(`PSU yetersiz (~${Math.round(totalLoad)}W gerek)`);

    const maxTgp = psu?.uyumluluk?.onerilen_gpu_tgp_max_w;
    if (maxTgp && gpuTgp > maxTgp + 50)
        return no(`Bu PSU en fazla ${maxTgp}W GPU için öneriliyor`);

    const gpuHas12V = gpu?.guc?.ek_guc_konnektoru?.includes("12VHPWR");
    const psuHas12V = psu?.baglantilar?.pcie_12vhpwr_adet > 0;
    if (gpuHas12V && !psuHas12V)
        return no("Bu GPU 12VHPWR konnektörü gerektiriyor, PSU'da yok");

    return ok();
}


/* 3.7 PSU ↔ Kasa */
export function checkPSUwithCase(psu: AnyPart, kasa: AnyPart | undefined): Check {
    if (!kasa) return ok();
    if (kasa?.psu_tumlesik)
        return no("Bu kasada dahili PSU var (harici seçilemez)");
    if (kasa?.psu_destek && psu?.form_factor && !kasa.psu_destek.includes(psu.form_factor))
        return no("Kasa, PSU form factorünü desteklemiyor");
    return ok();
}

/* 3.8 Soğutucu ↔ CPU ↔ Kasa */
export function checkCooler(cooler: AnyPart, cpu: AnyPart | undefined, kasa: AnyPart | undefined): Check {
    if (cpu?.soket && Array.isArray(cooler?.desteklenen_soketler) && !cooler.desteklenen_soketler.includes(cpu.soket))
        return no("Soğutucu, CPU soketini desteklemiyor");
    if (cpu?.tdp_w && cooler?.max_tdp_w && cpu.tdp_w > cooler.max_tdp_w)
        return no("Soğutucu TDP yetersiz");
    if (kasa?.cpu_sogutucu_yukseklik_max_mm && cooler?.yukseklik_mm &&
        cooler.yukseklik_mm > kasa.cpu_sogutucu_yukseklik_max_mm)
        return no("Soğutucu kasa yüksekliğini aşıyor");
    return ok();
}

/* 3.9 Depolama ↔ Anakart */
export function checkStorage(disk: AnyPart, mb: AnyPart | undefined): Check {
    if (!mb) return ok();
    const tip = disk?.tip;
    if (typeof tip === "string") {
        if (tip.startsWith("SATA") && (mb?.depolama?.sata ?? 0) < 1)
            return no("Anakartta SATA portu yok");
        if (tip.includes("M.2")) {
            if ((mb?.depolama?.m2 ?? 0) < 1)
                return no("Anakartta M.2 yuvası yok");
            if (tip.includes("NVMe")) {
                const gpuGen = disk?.arayuz?.pcie_gen ?? disk?.pcie_gen;
                const mbGen = mb?.depolama?.m2_pci_gen;
                if (gpuGen && mbGen && gpuGen > mbGen)
                    return no("M.2 sürücü daha yeni (hız anakart gen ile sınırlanır)");
            }
        }
    }
    return ok();
}

/* 3.10 Stok kontrolü */
export function checkStock(item: AnyPart): Check {
    const s =
        item?.stok?.durum ??
        (typeof item?.stok === "number"
            ? item.stok > 0
                ? "in_stock"
                : "out_of_stock"
            : undefined);
    return s === "out_of_stock" ? no("Stok dışı") : ok();
}
