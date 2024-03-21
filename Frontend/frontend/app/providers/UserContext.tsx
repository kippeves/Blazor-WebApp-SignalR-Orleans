'use client'
import { UUID } from "crypto";
import { AppSettings, ChatChannel, ChatMember, ChatMessage, ChannelState, User } from "../lib/definitions";
import React, { useContext, useEffect, useState } from "react";
import { ApiContext } from "./ApiContext";
import { useMutation, useQuery, useQueryClient } from "react-query";

export type UserContextType = {
    User: User,
    activeChannel: UUID,
    Messages: ChatMessage[],
    Channels: ChatChannel[],
    Members: ChatMember[],
    isMenuOpen: boolean,
    setActiveChannel: (id: UUID) => void,
    AddMessage: (Message: ChatMessage) => void,
    setIsMenuOpen: (isOpen: boolean) => void,
    channelState: ChannelState,
    setChannelState: (state: ChannelState) => void,
    SetConnected: () => void
};

const UserContext = React.createContext<UserContextType | null>(null);



const UserContextProvider: React.FC<{ children: React.ReactNode, Settings: AppSettings, User: User }> = (props: { children: React.ReactNode, Settings: AppSettings, User: User }) => {
    const queryClient = useQueryClient();
    const [initialJoin, setInitialJoin] = useState(true);
    const [channelState, setChannelState] = useState<ChannelState>(ChannelState.NotConnected);
    const User = props.User;
    const [activeChannel, setActiveChannel] = useState<UUID | undefined>(props.Settings.activeChannel)
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const { API } = useContext(ApiContext);

    const GetChannels = async () => await API<ChatChannel[]>('/channel/GetChannels', "GET", {});
    const GetMessages = async (id: UUID) => await API<ChatMessage[]>('/channel/GetMessages', "POST", { id: id, amount: '50' });
    const GetMembers = async (id: UUID) => await API<ChatMember[]>('/channel/GetMembers', "GET", { id: id });

    const MessageQuery = useQuery({ queryKey: ['messages', activeChannel], queryFn: async () => await GetMessages(activeChannel), enabled: channelState === ChannelState.Joined });
    const MemberQuery = useQuery({ queryKey: ['members', activeChannel], queryFn: async () => await GetMembers(activeChannel), enabled: channelState === ChannelState.Joined });
    const ChannelQuery = useQuery({ queryKey: ['channels'], queryFn: GetChannels });

    const messageMutation = useMutation((Message: ChatMessage) => Promise.resolve(Message), { onMutate: async (Message: ChatMessage) => queryClient.setQueryData<ChatMessage[]>(['messages', activeChannel], (old) => [...old, Message]) });
    const AddMessage = (Message: ChatMessage) => messageMutation.mutate(Message)

    const Messages = MessageQuery.isSuccess ? MessageQuery.data : [];
    const Members = MemberQuery.isSuccess ? MemberQuery.data : [];
    const Channels = ChannelQuery.isSuccess ? ChannelQuery.data : [];

    const SetConnected = () => {
        if (initialJoin && activeChannel !== undefined)
            setChannelState(ChannelState.Joined);
        setInitialJoin(false);
    }

    return (
        <UserContext.Provider value={{ activeChannel, Messages, AddMessage, Channels, User, Members, isMenuOpen, channelState, setIsMenuOpen, setChannelState, setActiveChannel, SetConnected }}>
            {props.children}
        </UserContext.Provider>
    );

}
export { UserContext, UserContextProvider }