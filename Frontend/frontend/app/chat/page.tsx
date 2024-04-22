'use client'
import ChatClient from "@/components/ui/chat/chat-client";
import { AppContextProvider } from "@/providers/AppContext";
import { useSession } from "next-auth/react";
import React from "react";

export default function Page() {
    const session = useSession();
    const token = session.data.user.token;
    return (
        <AppContextProvider token={token}>
            <ChatClient />
        </AppContextProvider>
    )
}