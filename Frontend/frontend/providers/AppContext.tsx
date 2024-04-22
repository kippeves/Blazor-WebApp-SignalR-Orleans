'use client'
import { ChannelObj, ClientState } from "@/lib/definitions";
import { Signal, computed, effect, signal } from "@preact/signals-react";
import { UUID } from "node:crypto";
import React, { useEffect } from "react";
import { HubConnection, HubConnectionState } from "@microsoft/signalr";
import { ConnectorType } from "./Connectors/signal-r";

const ConnectionStatus = signal(ClientState.NotConnected);
const CurrentChannel = signal<UUID>(undefined);
const Channels = signal<ChannelObj[]>([]);
const SidebarOpen = signal(true)
const ConnectorSignal = signal<ConnectorType>(undefined)
const ConnectionSignal = signal<HubConnection>(undefined)
const IsConnected = signal(false)
const HubState = signal<HubConnectionState>(undefined)

export type AppContextType = {
    Channels: Signal<ChannelObj[]>
    CurrentChannel: Signal<UUID>
    ChannelStatus: Signal<ClientState>
    SidebarOpen: Signal<boolean>,
    IsConnected: Signal<boolean>,
    HubState: Signal<HubConnectionState>,
    ConnectorSignal: Signal<ConnectorType>,
    ConnectionSignal: Signal<HubConnection>
};

const AppContext = React.createContext<AppContextType | null>(null);
const AppContextProvider: React.FC<{ children: React.ReactNode, token: string }> = (props: { children: React.ReactNode, token: string }) => {
    return (
        <AppContext.Provider value={{ Channels, ChannelStatus: ConnectionStatus, CurrentChannel, SidebarOpen, IsConnected, HubState, ConnectorSignal, ConnectionSignal }}>
            {props.children}
        </AppContext.Provider>
    );

}
export { AppContext, AppContextProvider }