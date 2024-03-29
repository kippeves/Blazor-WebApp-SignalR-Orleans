'use client'
import getFetch from "@/lib/apiClient";
import { ChannelObj, ClientState, MemberObj, MessageObj, User } from "@/lib/definitions";
import { Signal, computed, effect, signal } from "@preact/signals-react";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { UUID } from "node:crypto";
import React, { useEffect } from "react";
import { createSignalRContext } from "react-signalr";
import { Connector } from "./Connectors/signal-r";

const MESSAGES_LOCALS_KEY = "MESSAGES";

const Messages = signal<MessageObj[]>([]);
const userList = signal<MemberObj[]>([]);
const ConnectionStatus = signal(ClientState.NotConnected);
const CurrentChannel = signal<UUID>(undefined);
const Channels = signal<ChannelObj[]>([]);
const SidebarOpen = signal(true)
const Hub = signal(createSignalRContext())

const SignalR = signal(undefined)
const connectorType = typeof (Connector);
export type AppContextType = {
    Token: string,
    SignalR: Signal<Connector>,
    Channels: Signal<ChannelObj[]>
    CurrentChannel: Signal<UUID>
    ChannelStatus: Signal<ClientState>
    SidebarOpen: Signal<boolean>
};


const AppContext = React.createContext<AppContextType | null>(null);
const AppContextProvider: React.FC<{ children: React.ReactNode, Token: string }> = (props: { children: React.ReactNode, Token: string }) => {
    if (SignalR.value === undefined)
        SignalR.value = new Connector(props.Token)


    return (
        <AppContext.Provider value={{ Token: props.Token, SignalR, Channels, ChannelStatus: ConnectionStatus, CurrentChannel, SidebarOpen }}>
            {props.children}
        </AppContext.Provider>
    );

}
export { AppContext, AppContextProvider }