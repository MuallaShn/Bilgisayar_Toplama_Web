"use client";
import React, { useEffect, useState } from "react";
import { PcProvider, usePc } from "../context/PcContext";
import { loadData, type DataSet } from "../data/loader";
import PartPicker from "../components/Picker/PartPicker";
import Summary from "../components/Summary";
import {
    checkCPUwithMB,
    checkRAMwithMB,
    checkGPUwithMB,
    checkCaseWithMB,
    checkCaseWithGPU,
    checkPSU,
    checkPSUwithCase,
    checkCooler,
    checkStorage,
} from "../lib/compat";

function BuildPage() {
    const [data, setData] = useState<DataSet | null>(null);
    const { state } = usePc();

    useEffect(() => {
        loadData().then(setData);
    }, []);

    if (!data) return <div style={{ padding: 32 }}>Veriler yükleniyor...</div>;

    return (
        <main
            style={{
                padding: 16,
                display: "grid",
                gridTemplateColumns: "1fr 320px",
                gap: 16,
            }}
        >
            <div>
                <PartPicker title="Anakart" data={data.anakartlar} stateKey="anakart" />

                <PartPicker
                    title="İşlemci"
                    data={data.islemciler}
                    stateKey="islemci"
                    disabled={!state.anakart}
                    checks={[item => checkCPUwithMB(item as any, state.anakart)]}
                />

                <PartPicker
                    title="RAM"
                    data={data.ramlar}
                    stateKey="ram"
                    disabled={!state.islemci}
                    checks={[item => checkRAMwithMB(item as any, state.anakart)]}
                />

                <PartPicker
                    title="Ekran Kartı"
                    data={data.gpular}
                    stateKey="ekran_karti"
                    disabled={!state.ram}
                    checks={[item => checkGPUwithMB(item as any, state.anakart)]}
                />

                <PartPicker
                    title="PSU"
                    data={data.psular}
                    stateKey="psu"
                    disabled={!state.ekran_karti}
                    checks={[
                        item => checkPSU(item as any, state.islemci, state.ekran_karti),
                        item => checkPSUwithCase(item as any, state.kasa),
                    ]}
                />

                <PartPicker
                    title="Kasa"
                    data={data.kasalar}
                    stateKey="kasa"
                    disabled={!state.psu}
                    checks={[
                        item => checkCaseWithMB(item as any, state.anakart),
                        item => checkCaseWithGPU(item as any, state.ekran_karti),
                    ]}
                />

                <PartPicker
                    title="Depolama"
                    data={data.diskler}
                    stateKey="depolama"
                    disabled={!state.kasa}
                    checks={[item => checkStorage(item as any, state.anakart)]}
                />

                <PartPicker title="Monitör" data={data.monitorler} stateKey="monitor" disabled={!state.depolama} />
                <PartPicker title="Klavye" data={data.klavyeler} stateKey="klavye" disabled={!state.monitor} />
                <PartPicker title="Fare" data={data.fareler} stateKey="fare" disabled={!state.klavye} />

                <PartPicker
                    title="CPU Soğutucu"
                    data={data.sogutuculer}
                    stateKey="sogutucu"
                    disabled={!state.fare}
                    checks={[item => checkCooler(item as any, state.islemci, state.kasa)]}
                />
            </div>

            <Summary />
        </main>
    );
}

export default function Page() {
    return (
        <PcProvider>
            <BuildPage />
        </PcProvider>
    );
}
