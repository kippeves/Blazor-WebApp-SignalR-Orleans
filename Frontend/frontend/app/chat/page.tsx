'use client'
import ChatClient from "@/components/ui/chat/chat-client";
import { AppContextProvider } from "@/providers/AppContext";
import React from "react";

export default async function Page() {
    return (
        <ChatClient />
    );
}