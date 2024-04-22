import { UUID } from "crypto";
import { useEffect } from "react";
import { useAppSignal } from "./useChat";

export const useStorageForCurrentChannel = () => {
    const { CurrentChannel: Channel } = useAppSignal();

    useEffect(() => {
        if (Channel.value === undefined) return;
        var sessionValue = sessionStorage.getItem('lastChannel')
        if (sessionValue === Channel.value) return;
        sessionStorage.setItem('lastChannel', Channel.value)
    }, [Channel.value])

    useEffect(() => {
        var channel = sessionStorage.getItem('lastChannel') as UUID
        if (channel !== null) {
            Channel.value = channel;
        }
    })
    return { Channel }
}


