'use client'
import useFetch from "@/lib/apiClient";
import { AppContext } from "@/providers/AppContext";
import { List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import { UUID } from "node:crypto";
import { useContext, useEffect } from "react";
import ChannelIcon from "../icons/channel-icon";
import { useQuery } from "@tanstack/react-query";
import { ChannelObj } from "@/lib/definitions";
import { useSignals } from "@preact/signals-react/runtime";


export default function ChannelList() {
    console.debug("ChannelList refresh")
    const app = useContext(AppContext)
    const Channels = app.Channels
    const Token = app.Token;
    useSignals()

    const { data: ApiChannels } = useQuery<ChannelObj[]>({ queryKey: ["channels"], queryFn: () => useFetch('/channel/GetChannels', "GET", {}, Token) })
    useEffect(() => {
        Channels.value = ApiChannels ?? Channels.value
    }, [ApiChannels])

    const setActiveChannel = (id: UUID) => {
        app.CurrentChannel.value = id;
    }

    return (<List>
        {
            Channels.value && Channels.value.map((channel, index) => (
                <ListItem key={index} disablePadding sx={{ display: 'block' }}>
                    <ListItemButton disableGutters onClick={() => setActiveChannel(channel.id)}>
                        <ChannelIcon currentChannel={app.CurrentChannel.value === channel.id} alt={`Channel ${index + 1}`} text={`${index + 1}`} />
                        <ListItemText primary={channel.name} sx={{ marginLeft: 2 }} />
                    </ListItemButton>
                </ListItem>))
        }
    </List>
    )
}
