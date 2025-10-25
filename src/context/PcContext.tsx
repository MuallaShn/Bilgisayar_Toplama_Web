"use client";
import React, { createContext, useContext, useEffect, useReducer } from "react";
/* eslint-disable @typescript-eslint/no-explicit-any */


export interface PcState {
    anakart?: any;
    islemci?: any;
    ram?: any;
    ekran_karti?: any;
    psu?: any;
    kasa?: any;
    depolama?: any;
    monitor?: any;
    klavye?: any;
    fare?: any;
    sogutucu?: any;
}

type Action = { type: "SET"; key: keyof PcState; value: any } | { type: "RESET" };

function reducer(state: PcState, a: Action): PcState {
    switch (a.type) {
        case "SET":   return { ...state, [a.key]: a.value };
        case "RESET": return {};
        default:      return state;
    }
}

const Ctx = createContext<{ state: PcState; dispatch: React.Dispatch<Action> }>({ state: {}, dispatch: () => {} });

export const PcProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, {}, () => {
        if (typeof window === "undefined") return {};
        try { return JSON.parse(localStorage.getItem("pc-build") || "{}"); } catch { return {}; }
    });

    useEffect(() => {
        localStorage.setItem("pc-build", JSON.stringify(state));
    }, [state]);

    return <Ctx.Provider value={{ state, dispatch }}>{children}</Ctx.Provider>;
};

export const usePc = () => useContext(Ctx);
