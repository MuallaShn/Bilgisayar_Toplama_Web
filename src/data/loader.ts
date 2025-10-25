import {
    Anakart,
    Islemci,
    Ram,
    Gpu,
    Psu,
    Kasa,
    Depolama as Disk,        // ✅ Disk yerine Depolama'yı kullanıyoruz
    Monitor,
    Klavye,
    Fare,
    Sogutucu as CpuSogutucu, // ✅ CpuSogutucu yerine Sogutucu kullanıyoruz
} from "@/types/parts";

// ---------------------------------------------------------
// DataSet arayüzü: tüm donanım tiplerini içeren yapı
// ---------------------------------------------------------
export interface DataSet {
    anakartlar: Anakart[];
    islemciler: Islemci[];
    ramlar: Ram[];
    gpular: Gpu[];
    psular: Psu[];
    kasalar: Kasa[];
    diskler: Disk[];
    monitorler: Monitor[];
    klavyeler: Klavye[];
    fareler: Fare[];
    sogutuculer: CpuSogutucu[];
}

// ---------------------------------------------------------
// JSON dosyalarını public/data klasöründen yükleyen fonksiyon
// ---------------------------------------------------------
export const loadData = async (): Promise<DataSet> => {
    // Her JSON için fetch işlemini tanımlıyoruz
    const anakartPromise = fetch("/data/anakart.json").then((res) => res.json());
    const islemciPromise = fetch("/data/islemci.json").then((res) => res.json());
    const ramPromise = fetch("/data/ram.json").then((res) => res.json());
    const gpuPromise = fetch("/data/ekran_karti.json").then((res) => res.json());
    const psuPromise = fetch("/data/psu.json").then((res) => res.json());
    const kasaPromise = fetch("/data/kasa.json").then((res) => res.json());
    const diskPromise = fetch("/data/depolama.json").then((res) => res.json());
    const monitorPromise = fetch("/data/monitor.json").then((res) => res.json());
    const klavyePromise = fetch("/data/klavye.json").then((res) => res.json());
    const farePromise = fetch("/data/fare.json").then((res) => res.json());
    const sogutucuPromise = fetch("/data/islemci_sogutucu.json").then((res) => res.json());

    // Tüm fetch işlemlerini paralel yürütüp sonuçları alıyoruz
    const [
        anakartlar,
        islemciler,
        ramlar,
        gpular,
        psular,
        kasalar,
        diskler,
        monitorler,
        klavyeler,
        fareler,
        sogutuculer,
    ] = await Promise.all([
        anakartPromise,
        islemciPromise,
        ramPromise,
        gpuPromise,
        psuPromise,
        kasaPromise,
        diskPromise,
        monitorPromise,
        klavyePromise,
        farePromise,
        sogutucuPromise,
    ]);

    // Sonuçları DataSet tipine uygun şekilde döndürüyoruz
    return {
        anakartlar,
        islemciler,
        ramlar,
        gpular,
        psular,
        kasalar,
        diskler,
        monitorler,
        klavyeler,
        fareler,
        sogutuculer,
    };
};
