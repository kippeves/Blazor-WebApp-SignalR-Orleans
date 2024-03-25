'use client'
import { useEffect, useState } from "react";

const API_URL = "https://192.168.2.124:7084/backend";
/*function useFetch(url: string, method?: "GET" | "POST", params?: Record<string, string>, token?: string, apiKey?: string): any {
    const [data, setData] = useState(null);
    try {
        useEffect(() => {
            const fetchController = new AbortController();
            async function fetchData() {
                try {
                    const queryString = (params !== undefined && method === "GET") ? "?" + new URLSearchParams(data) : ""
                    const req = {
                        signal: fetchController.signal,
                        headers: {}
                    } as RequestInit;
                    if (token !== undefined) {
                        req.headers["Authorization"] = `Bearer ${token}`;
                    }
                    if (apiKey !== undefined) {
                        req.headers["X-API-KEY"] = apiKey;
                    }

                    const response = await fetch(`${API_URL}${url}${queryString}`, req);
                    if (!response.ok) {
                        throw new Error(
                            `HTTP Response ${response.status}: ${response.statusText}`
                        );
                    }
                    const json_obj = await response.json();
                    // Good ol' fashion race condition
                    if (!fetchController.signal.aborted) {
                        setData(json_obj);
                    }
                } catch (error: any) {
                    throw new Error(error)
                }
            }
            fetchData();
            return () => {
                fetchController.abort();
            };
        }, [url]);
        return { data };
    } catch (e) {
        console.debug(e)
    }
}*/

async function useFetch<T>(url: string, method?: "GET" | "POST", params?: Record<string, string>, token?: string, apiKey?: string): Promise<T> {
    try {
        const queryString = (params !== undefined && method === "GET") ? "?" + new URLSearchParams(params) : ""
        const req = {
            method: method,
            headers: {
                "Content-Type": "application/json"
            },
        } as RequestInit;

        if (params !== undefined && method === 'POST')
            req.body = JSON.stringify(params)

        if (token !== undefined) {
            req.headers["Authorization"] = `Bearer ${token}`;
        }
        if (apiKey !== undefined) {
            req.headers["X-API-KEY"] = apiKey;
        }

        const response = await fetch(`${API_URL}${url}${queryString}`, req);
        if (!response.ok) {
            throw new Error(
                `HTTP Response ${response.status}: ${response.statusText}`
            );
        }
        return await response.json();
        // Good ol' fashion race condition
    } catch (error: any) {
        throw new Error(error)
    }
}

export default useFetch;