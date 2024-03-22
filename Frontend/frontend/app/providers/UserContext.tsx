'use client'
import { UUID } from "crypto";
import { AppSettings, ChatChannel, ChatMember, ChatMessage, ChannelState, User } from "../lib/definitions";
import React, { useContext, useEffect, useState } from "react";
import { ApiContext } from "./ApiContext";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { TokenContext } from "./TokenContext";

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
};

const UserContext = React.createContext<UserContextType | null>(null);


const UserContextProvider: React.FC<{ children: React.ReactNode, Settings: AppSettings, User: User }> = (props: { children: React.ReactNode, Settings: AppSettings, User: User }) => {
    const queryClient = useQueryClient();
    const [channelState, setChannelState] = useState<ChannelState>(ChannelState.NotConnected);
    const User = props.User;
    const [activeChannel, setActiveChannel] = useState<UUID | undefined>(props.Settings.activeChannel)
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const { Token } = useContext(TokenContext)
    const { API } = useContext(ApiContext)

    const GetMembers = async () => await API<ChatMember[]>('/channel/GetMembers', "GET", {});

    const GetChannels = async () => await API<ChatChannel[]>('/Channel/GetChannels', "GET", {});
    const GetMessages = async (id: UUID) => await API<ChatMessage[]>('/Channel/GetMessages', "POST", { id: id, amount: '50' });

    const MessageQuery = useQuery({ queryKey: ['messages', activeChannel], queryFn: async () => await GetMessages(activeChannel), enabled: channelState === ChannelState.Joined });
    const MemberQuery = useQuery({ queryKey: ['members'], queryFn: GetMembers });
    const ChannelQuery = useQuery({ queryKey: ['channels'], queryFn: GetChannels });

    const messageMutation = useMutation((Message: ChatMessage) => Promise.resolve(Message), { onMutate: async (Message: ChatMessage) => queryClient.setQueryData<ChatMessage[]>(['messages', activeChannel], (old) => [...old, Message]) });
    const AddMessage = (Message: ChatMessage) => messageMutation.mutate(Message)

    const Messages = MessageQuery.isSuccess ? MessageQuery.data : [];
    const Members = MemberQuery.isSuccess ? MemberQuery.data : [];
    const Channels = ChannelQuery.isSuccess ? ChannelQuery.data : [];

    return (
        //        <UserContext.Provider value={{ activeChannel, [Messages], AddMessage, Channels, User, Members, isMenuOpen, channelState, setIsMenuOpen, setChannelState, setActiveChannel }}>
        <UserContext.Provider value={{ activeChannel, Messages, AddMessage, Channels, User, Members, isMenuOpen, channelState, setIsMenuOpen, setChannelState, setActiveChannel }}>
            {props.children}
        </UserContext.Provider>
    );

}
export { UserContext, UserContextProvider }