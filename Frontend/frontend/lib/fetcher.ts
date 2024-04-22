'use client'
import { useEffect, useState } from "react";

const API_URL = "https://192.168.2.124:7084/backend";

export const fetcher = (url: string | URL | Request) => fetch(url).then(r => r.json())

export const fetchGet = (url: string, token: string) => fetch(`${API_URL}${url}`, {
    method: "GET",
    headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
    }
}).then(res => res.json())

export const fetchPost = (url: string, token: string, params?: Record<string, string>) => fetch(`${API_URL}${url}`, {
    method: "POST",
    headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
    },
    body: JSON.stringify(params) ?? ''
}).then(res => res.json())

export async function getFetch<T>(url: string, method: "GET" | "POST", apiKey: string, params?: Record<string, string>): Promise<T> {
    try {
        const queryString = (params !== undefined && method === "GET") ? "?" + new URLSearchParams(params) : ""
        const req = {
            method: method,
            headers: {
                "X-API-KEY": apiKey,
                "Content-Type": "application/json"
            },
        } as RequestInit;

        if (params !== undefined && method === 'POST')
            req.body = JSON.stringify(params)

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
