'use client'
import { Container } from "@mui/material";
import ChannelSideBar from "./sidebars/channel-sidebar";
import Messages from "./messages/messages";
import { useStorageForCurrentChannel } from "@/lib/hooks/useLoadChannel";
import MessagesPlaceholder from "./messages/placeholder";

export default function ChatClient() {
    const { Channel } = useStorageForCurrentChannel();
    return (
        <>
            <ChannelSideBar />
            <Container sx={{ display: "flex", flexDirection: 'column', width: '100%', height: '100dvh' }} maxWidth={false}>
                {Channel !== undefined ? <Messages /> : <MessagesPlaceholder />}
            </Container>
        </>
    );
}

