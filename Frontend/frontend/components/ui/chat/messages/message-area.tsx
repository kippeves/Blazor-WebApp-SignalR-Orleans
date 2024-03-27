'use client'
import { Suspense, useContext } from "react";
import { AppContext } from "@/providers/AppContext";
import MessageList from "./message-list";
import MessageListPlaceholder from "./message-placeholder";
import { useSignals } from "@preact/signals-react/runtime";
import { UUID } from "node:crypto";

export default function MessageArea() {
    const app = useContext(AppContext)
    return (
        <Suspense>
            {app.CurrentChannel.value !== undefined ? <MessageList /> : <MessageListPlaceholder />}
        </Suspense>
    )
}