'use client'
import { Box, Container } from "@mui/material";
import ChannelSideBar from "./sidebars/channel-sidebar";
import Messages from "./messages/messages";
import { useStorageForCurrentChannel } from "@/lib/hooks/useLoadChannel";
import MessagesPlaceholder from "./messages/placeholder";
import { useSignalR } from "@/lib/hooks/useSignalR";
import { useAppSignal } from "@/lib/hooks/useChat";
import CenterGrid from "@/components/layout/centerGrid";
import { useSignals } from "@preact/signals-react/runtime";
import { effect } from "@preact/signals-react";

export default function ChatClient() {
    const { Channel } = useStorageForCurrentChannel();
    useSignalR()
    useSignals()
    const { ConnectionSignal: Connection, IsConnected } = useAppSignal();
    effect(() => Connection)
    //    preload('api/chat/channels', fetcher)
    return (
        <>
            <ChannelSideBar />
            <Container sx={{ display: "flex", flexDirection: 'column', width: '100%', height: '100dvh' }} maxWidth={false}>
                {Channel !== undefined ? <Messages /> : <MessagesPlaceholder />}
            </Container>
        </>
    );
    //
}

