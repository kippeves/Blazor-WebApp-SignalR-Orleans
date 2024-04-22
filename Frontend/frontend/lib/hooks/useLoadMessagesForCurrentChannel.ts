import { MessageObj } from "../definitions";
import { useAppSignal } from "./useChat";
import useSWR from "swr";
import { fetcher } from "../fetcher";


export const useLoadMessagesForCurrentChannel = () => {
    const { CurrentChannel: Channel } = useAppSignal();
    const { data: Messages, isLoading, mutate } = useSWR<MessageObj[]>(Channel.value !== undefined ? `/api/chat/messages/${Channel.value}` : null, fetcher);

    return { Messages, isLoading, mutate };
};
