'use client'
import { Container } from "@mui/material";
import { Suspense } from "react";
import { AppContextProvider } from "@/providers/AppContext";
import { createSignalRContext } from "react-signalr";
import ChannelSideBar from "./sidebars/channel-sidebar";
import { useSession } from "next-auth/react";
import MessageArea from "./messages/message-area";
import { useSignals } from "@preact/signals-react/runtime";

const SERVER_URL = "https://192.168.2.124:7084";
export default function ChatClient() {
    const session = useSession();
    const Token = session.data.user.token;
    const Hub = createSignalRContext();
    useSignals()

    return (<Hub.Provider
        connectEnabled={!!Token}
        automaticReconnect
        accessTokenFactory={() => Token}
        dependencies={[Token]}
        url={`${SERVER_URL}/hubs/chathub`}>
        <AppContextProvider Hub={Hub}>
            <Suspense>
                <ChannelSideBar />
            </Suspense>
            <Container maxWidth={false}>
                <MessageArea />
            </Container>
        </AppContextProvider>
    </Hub.Provider >
    );
}