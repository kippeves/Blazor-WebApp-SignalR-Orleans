import { useCallback, useMemo } from "react";
import { MessageObj } from "../definitions";
import { useAppSignal } from "./useChat";
import { useMessageList } from "./useMessageList";


export const useSignalR = () => {
    const { SignalR } = useAppSignal();
    const { newMessage, joinChannel, events } = SignalR.value;
    return { newMessage, joinChannel, events };
};

export const useSignalREvents = () => {
    const { events } = useSignalR();
    const { AddMessage } = useMessageList();
    const onMessageReceived = (m: MessageObj) => {
        AddMessage(m)
    }

    useMemo(() => events(onMessageReceived), [])
}



