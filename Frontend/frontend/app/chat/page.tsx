'use server'
import { auth } from "@/auth";
import ChatApp from "@/components/Chat";
import { AppSettings, ChatChannel, PrefetchData } from "../lib/definitions";
import React, { useRef } from "react";

const API = async (token: string, url: string) => await fetch(url, {
    headers: { Authorization: "Bearer " + token }
}).then(res => res.json());

export default async function Page() {
    const authState = await auth();
    const user = authState?.user;
    const prefetch = async () => await API(user?.token, 'http://localhost:5144/api/User/Prefetch') as AppSettings;
    const listChannels = async () => await API(user?.token, 'http://localhost:5144/api/Channel/GetChannels') as ChatChannel[];
    const settings = await prefetch();
    const channels = await listChannels();
    const prefetchData = { User: user!, Messages: [], Settings: settings, Channels: channels } as PrefetchData;
    return (
        prefetchData && <ChatApp Data={prefetchData} />
    );
}