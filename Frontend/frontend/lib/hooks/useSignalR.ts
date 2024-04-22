'use client'
import { useEffect, useState } from "react";
import { MessageResponse, User } from "../definitions";
import Connector, { ConnectorType } from "@/providers/Connectors/signal-r";
import { useSWRConfig } from "swr";
import { useUser } from "./useUser";
import { useAppSignal } from "./useChat";
import { HubConnection, HubConnectionState } from "@microsoft/signalr";
import { signal } from "@preact/signals-react";


export function useSignalR() {
    const { HubState, ConnectorSignal, ConnectionSignal, IsConnected } = useAppSignal()
    const { data, isLoading } = useUser()
    const [connector, setConnector] = useState<ConnectorType | undefined>(undefined)

    useEffect(() => {
        const CheckUser = async (data: any) => Connector(data.user.token)


        async function UpdateConnection(res: any) {
            let loop = true;
            if (res !== undefined) {
                ConnectorSignal.value = res
                let connection = res.connection
                while (loop) {
                    HubState.value = connection.state;
                    IsConnected.value = connection.state === HubConnectionState.Connected;
                    ConnectionSignal.value = connection;
                    if (IsConnected.value) {
                        loop = false
                    } else await new Promise(r => setTimeout(r, 250));
                }
            }
        }
        if (data !== undefined) {
            CheckUser(data).then(res => UpdateConnection(res))
        }

    }, [data])
};

export const useSignalREvents = () => {
    const { ConnectorSignal: Connector } = useAppSignal()
    const { mutate, cache } = useSWRConfig()
    //    const { AddMessage } = useMessageList();

    useEffect(() => {
        Connector && Connector.value?.events((response: MessageResponse) => {
            const url = `/api/chat/messages/${response.channelId}`;
            mutate(url, response.message, {
                populateCache: (message, data) => [...data, message]
            })
        })
    }, [Connector.value])
}


