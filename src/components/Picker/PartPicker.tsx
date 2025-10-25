"use client";
import React, { useMemo, useState } from "react";
import { tl } from "../../lib/format";
import { checkStock } from "../../lib/compat";
import { usePc } from "../../context/PcContext";
import type { PcState } from "../../context/PcContext";
import type { TumParcalar } from "../../types/parts";

type CheckFn = (item: TumParcalar, all: PcState) => { ok: boolean; reason?: string };

interface Props {
    title: string;
    data: TumParcalar[];
    stateKey: keyof PcState;
    checks?: CheckFn[];
    searchableFields?: string[];
    brandField?: string;
    disabled?: boolean;
}

export default function PartPicker({
                                       title,
                                       data,
                                       stateKey,
                                       checks = [],
                                       searchableFields = ["ad"],
                                       brandField = "marka",
                                       disabled = false,
                                   }: Props) {
    const { state, dispatch } = usePc();
    const [q, setQ] = useState("");
    const [brand, setBrand] = useState<string>("");

    const filtered = useMemo(() => {
        const text = q.toLocaleLowerCase("tr-TR");
        return (data || [])
            .filter((x) => {
                if (brand && (x as any)?.[brandField] !== brand) return false;
                if (!text) return true;
                return searchableFields.some((f) =>
                    String((x as any)?.[f] ?? "")
                        .toLocaleLowerCase("tr-TR")
                        .includes(text)
                );
            })
            .map((x) => {
                const stock = checkStock(x as any);
                const fails = [stock, ...checks.map((fn) => fn(x, state))].find((r) => r.ok === false);
                return {
                    item: x as any,
                    disabled: Boolean(fails),
                    reason: fails && "reason" in fails ? (fails as any).reason : "",
                };
            });
    }, [data, q, brand, checks, state, brandField, searchableFields]);

    const brands = useMemo(() => {
        return Array.from(new Set((data || []).map((x: any) => x?.[brandField]).filter(Boolean)));
    }, [data, brandField]);

    const selected: any = (state as any)[stateKey];

    return (
        <section
            style={{
                borderBottom: "1px solid #333",
                paddingBottom: 14,
                marginBottom: 12,
                opacity: disabled ? 0.5 : 1,
                pointerEvents: disabled ? "none" : "auto",
            }}
        >
            <h3 style={{ margin: "8px 0" }}>{title}</h3>

            <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                <input
                    placeholder="Ara…"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    style={{ flex: 1, padding: 6, background: "#222", color: "#fff", border: "1px solid #444" }}
                    disabled={disabled}
                />
                <select
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    style={{ padding: 6, background: "#222", color: "#fff", border: "1px solid #444" }}
                    disabled={disabled}
                >
                    <option value="">Marka</option>
                    {brands.map((b: string) => (
                        <option key={b} value={b}>
                            {b}
                        </option>
                    ))}
                </select>
            </div>

            <select
                value={selected?.id ?? ""}
                onChange={(e) => {
                    const picked = (data as any[]).find((d) => d.id === e.target.value);
                    dispatch({ type: "SET", key: stateKey, value: picked || undefined });
                }}
                style={{ width: "100%", padding: 8, background: "#222", color: "#fff", border: "1px solid #444" }}
                disabled={disabled}
            >
                <option value="">Seçiniz</option>
                {filtered.map(({ item, disabled: dis, reason }) => (
                    <option
                        key={item.id}
                        value={item.id}
                        disabled={dis}
                        title={dis ? reason : ""}
                        style={{ color: dis ? "#777" : "#fff" }}
                    >
                        {item.ad} — {tl(item.fiyat_try)} {dis ? "(uyumsuz)" : ""}
                    </option>
                ))}
            </select>
        </section>
    );
}
