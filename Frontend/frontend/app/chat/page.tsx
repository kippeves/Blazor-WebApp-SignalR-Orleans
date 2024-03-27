'use client'
import { auth } from "@/auth";
import ChatClient from "@/components/ui/chat/chat-client";
import { AppContextProvider } from "@/providers/AppContext";
import { SessionProvider } from "next-auth/react";
import React, { Suspense } from "react";

export default function Page() {
    return (
        <ChatClient />
    );
}