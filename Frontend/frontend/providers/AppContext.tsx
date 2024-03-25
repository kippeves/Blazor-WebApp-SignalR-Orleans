'use client'
import useFetch from "@/lib/apiClient";
import { ChannelObj, ClientState, MemberObj, MessageObj, User } from "@/lib/definitions";
import { Signal, computed, effect, signal } from "@preact/signals-react";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { UUID } from "node:crypto";
import React from "react";
import { createSignalRContext } from "react-signalr";
import { Context, Hub } from "react-signalr/lib/signalr/types";

const MESSAGES_LOCALS_KEY = "MESSAGES";

const Messages = signal<MessageObj[]>([]);
const userList = signal<MemberObj[]>([]);
const Hub = signal<Context<Hub<string, string>>>(undefined)
const hubConnection = computed(() => Hub.value.connection)
const ConnectionStatus = signal(ClientState.NotConnected);
const CurrentChannel = signal<UUID>(undefined);
const Channels = signal<ChannelObj[]>([]);
const SidebarOpen = signal(true)

export type AppContextType = {
    Token: string,
    Hub: Signal<Context<Hub<string, string>>>
    Channels: Signal<ChannelObj[]>
    Messages: Signal<MessageObj[]>
    CurrentChannel: Signal<UUID>
    ConnectionStatus: Signal<ClientState>
    SidebarOpen: Signal<boolean>
};

const AppContext = React.createContext<AppContextType | null>(null);

const AppContextProvider: React.FC<{ children: React.ReactNode, Hub: Context<Hub<string, string>> }> = (props: { children: React.ReactNode, Hub: Context<Hub<string, string>> }) => {
    console.debug("Context refreshing")
    var user = useSession();
    var Token = user.data.user.token;
    Hub.value = props.Hub;

    return (
        <AppContext.Provider value={{ Token, Hub, Channels, ConnectionStatus, CurrentChannel, Messages, SidebarOpen }}>
            {props.children}
        </AppContext.Provider>
    );

}
export { AppContext, AppContextProvider }