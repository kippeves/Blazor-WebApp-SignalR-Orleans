'use client'
import getFetch from "@/lib/apiClient";
import { List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import { UUID } from "node:crypto";
import { useEffect } from "react";
import ChannelIcon from "../icons/channel-icon";
import { useQuery } from "@tanstack/react-query";
import { ChannelObj } from "@/lib/definitions";
import { useAppSignal } from "@/lib/hooks/useChat";
import { useStorageForChannels } from "@/lib/hooks/useStorageForChannels";
import { useSignalR } from "@/lib/hooks/useSignalR";



export default function ChannelList() {
    const { Channel, Token } = useAppSignal();
    const { Channels, updateList } = useStorageForChannels()
    const { data: API, status } = useQuery<ChannelObj[]>({ queryKey: ["channels"], queryFn: () => getFetch('/channel/GetChannels', "GET", {}, Token) })
    const { joinChannel } = useSignalR();
    useEffect(() => {
        if (status === 'success')
            updateList(API)
    }, [API, status, updateList])

    const JoinChannel = (id: UUID) => {
        Channel.value = id;
        joinChannel(id)
    }

    return (
        <List>
            {
                Channels && Channels.map((channel, index) => (
                    <ListItem key={index} disablePadding sx={{ display: 'block' }}>
                        <ListItemButton disableGutters onClick={() => JoinChannel(channel.id)}>
                            <ChannelIcon currentChannel={Channel.value === channel.id} alt={`Channel ${index + 1}`} text={`${index + 1}`} />
                            <ListItemText primary={channel.name} sx={{ marginLeft: 2 }} />
                        </ListItemButton>
                    </ListItem>))
            }
        </List>
    )
}
