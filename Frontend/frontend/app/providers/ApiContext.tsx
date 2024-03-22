'use client'
import axios, { AxiosInstance, RawAxiosRequestHeaders } from "axios";
import React, { useContext, useMemo, useState } from "react";
import { ChatChannel, ChatMessage, PrefetchData, User } from "../lib/definitions";
import { TokenContext } from "./TokenContext";

const API_URL = "https://192.168.2.124:7084/backend"
type ApiContextType = {
    API<Type>(AppendURL: string, Method: "POST" | "GET", data: Record<string, string> | undefined): Promise<Type>;
};

const ApiContext = React.createContext<ApiContextType | null>(null);

const ApiContextProvider: React.FC<{ children: React.ReactNode }> = (props: { children: React.ReactNode }) => {
    const Token = useContext(TokenContext);

    async function API<Type>(AppendURL: string, Method: "POST" | "GET", data: Record<string, string> | undefined) {
        let queryString = "";
        if (data !== undefined && Method === "GET") {
            queryString = "?" + new URLSearchParams(data)
        }
        let reqInit = {
            method: Method,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${Token.Token}`
            }
        } as RequestInit;

        if (Method === "POST" && data != undefined)
            reqInit.body = JSON.stringify(data)

        console.error(`${API_URL}${AppendURL}${queryString}`)
        var query = await fetch(`${API_URL}${AppendURL}${queryString}`, reqInit);
        if (!query.ok) {
            throw new Error(query.statusText)
        }
        return query.json() as Type
    }

    return (
        <ApiContext.Provider value={{ API }}>
            {props.children}
        </ApiContext.Provider>
    );

}
export { ApiContext, ApiContextProvider }
