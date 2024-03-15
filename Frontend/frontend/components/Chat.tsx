'use client'
import { PrefetchData } from "@/app/lib/definitions";
import { createSignalRContext } from "react-signalr/signalr";
import React, { memo, useContext, useState } from "react";
import { Container, CssBaseline } from "@mui/material";
import SideMenu from "./Menu";
import MessageArea from "./MessageArea";
import ResponsiveAppBar from "./Navbar";
import { ApiContext, ApiContextProvider } from "../app/Contexts/ApiContext";

export default function ChatApp({ Data }: { Data: PrefetchData }) {
    const SignalR = createSignalRContext()
    const [user, setUser] = useState(Data.User);
    const [messages, setMessages] = useState(Data.Messages)
    const [channels, setChannels] = useState(Data.Channels)
    const Token = user.token;
    return (
        <SignalR.Provider
            connectEnabled={!!Token}
            accessTokenFactory={() => Token}
            dependencies={[Token]} //remove previous connection and create a new connection if changed
            url={"http://localhost:5144/hubs/chathub"}>
            <ApiContextProvider Token={Token}>
                <ResponsiveAppBar user={user} />
                <SideMenu Channels={channels} />
                <MessageArea Messages={messages} />
            </ApiContextProvider>
        </SignalR.Provider>
    );
}