import { useQuery } from "@tanstack/react-query";
import { UUID } from "crypto";
import getFetch from "../apiClient";
import { MessageObj } from "../definitions";
import { useAppSignal } from "./useChat";


export const useLoadMessagesForCurrentChannel = () => {
    const { Channel, Token } = useAppSignal();
    const { data } = useQuery({ queryKey: ["messages", Channel], queryFn: () => GetPosts() });
    const GetPosts = (fromIndex?: UUID) => {
        let initValues = fromIndex !== undefined ? { fromIndex: fromIndex } : {};
        return getFetch<MessageObj[]>('/channel/GetMessages', "POST", { ...initValues, channelId: Channel.value }, Token);
    };
    return { Messages: data };
};
