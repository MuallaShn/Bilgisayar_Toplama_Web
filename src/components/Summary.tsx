"use client";
import React, { useMemo } from "react";
import { usePc } from "../context/PcContext";
import { tl } from "../lib/format";

export default function Summary() {
    const { state, dispatch } = usePc();

    const entries = useMemo(
        () => Object.entries(state).filter(([, v]) => Boolean(v)) as [string, any][],
        [state]
    );

    const total = useMemo(
        () => entries.reduce((sum, [, p]) => sum + (p?.fiyat_try ?? 0), 0),
        [entries]
    );

    return (
        <aside
            style={{
                position: "sticky",
                top: 12,
                background: "#181818",
                padding: 12,
                border: "1px solid #333",
                borderRadius: 6,
            }}
        >
            <h3>🧾 Özet</h3>
            <ul style={{ paddingLeft: 16 }}>
                {entries.map(([key, part]) => (
                    <li key={key}>
                        {key}: {part.ad} — {tl(part.fiyat_try)}
                    </li>
                ))}
            </ul>
            <hr />
            <div style={{ fontWeight: "bold", margin: "8px 0" }}>Toplam: {tl(total)}</div>
            <button
                onClick={() => dispatch({ type: "RESET" })}
                style={{ background: "#333", color: "#fff", border: "1px solid #555", padding: "6px 12px", cursor: "pointer" }}
            >
                Sıfırla
            </button>
        </aside>
    );
}
