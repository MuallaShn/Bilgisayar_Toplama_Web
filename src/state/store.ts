import { Anakart, Islemci, Ram, Gpu, Psu, Kasa, Depolama, Monitor, Klavye, Fare, Sogutucu } from "../types/parts";

export interface SelectedParts {
    anakart: Anakart | null;
    cpu: Islemci | null;
    ram: Ram[] | null;
    gpu: Gpu | null;
    psu: Psu | null;
    kasa: Kasa | null;
    depolama: Depolama[] | null;
    monitor: Monitor | null;
    klavye: Klavye | null;
    fare: Fare | null;
    cpuSogutucu: Sogutucu | null;
}

export interface AppState {
    selectedParts: SelectedParts;
    totalPrice: number;
}
