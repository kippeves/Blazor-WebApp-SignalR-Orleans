'use client'
import { List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import { UUID } from "node:crypto";
import ChannelIcon from "../icons/channel-icon";
import { ChannelObj } from "@/lib/definitions";
import { useAppSignal } from "@/lib/hooks/useChat";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";



export default function ChannelList() {
    const { CurrentChannel } = useAppSignal();
    const { data: Channels } = useSWR<ChannelObj[]>('api/chat/channels', fetcher)

    const JoinChannel = (id: UUID) => {
        CurrentChannel.value = id;
    }

    return (
        <List>
            {
                Channels && Channels.map((channel, index) => (
                    <ListItem key={index} disablePadding sx={{ display: 'block' }}>
                        <ListItemButton disableGutters onClick={() => JoinChannel(channel.id)}>
                            <ChannelIcon currentChannel={CurrentChannel.value === channel.id} alt={`Channel ${index + 1}`} text={`${index + 1}`} />
                            <ListItemText primary={channel.name} sx={{ marginLeft: 2 }} />
                        </ListItemButton>
                    </ListItem>))
            }
        </List>
    )
}
