'use client'
import { Container } from "@mui/material";
import { Suspense, useContext, useEffect, useState } from "react";
import { AppContext } from "@/providers/AppContext";
import ChannelSideBar from "./sidebars/channel-sidebar";
import MessageArea from "./messages/message-area";
import { useSignals } from "@preact/signals-react/runtime";
import { Connector } from "@/providers/Connectors/signal-r";
import { UUID } from "node:crypto";
import { effect } from "@preact/signals-react";
import MessageList from "./messages/message-list";
import MessageListPlaceholder from "./messages/message-placeholder";

export default function ChatClient() {
    const app = useContext(AppContext)

    useSignals()

    if (app.SignalR.value === undefined)
        app.SignalR.value = new Connector(app.Token)

    useEffect(() => {
        if (app.CurrentChannel.value === undefined) return;
        var sessionValue = sessionStorage.getItem('lastChannel')
        if (sessionValue === app.CurrentChannel.value) return;
        sessionStorage.setItem('lastChannel', app.CurrentChannel.value)
    }, [app.CurrentChannel.value])

    useEffect(() => {
        var channel = sessionStorage.getItem('lastChannel') as UUID
        if (channel !== null) {
            app.CurrentChannel.value = channel;
        }
    }, [])

    return (
        <>
            <ChannelSideBar />
            <Container maxWidth={false}>
                <MessageArea />
            </Container>
        </>
    );
}