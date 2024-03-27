'use client'
import useFetch from "@/lib/apiClient";
import { AppContext } from "@/providers/AppContext";
import { List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import { UUID } from "node:crypto";
import { Suspense, useContext, useEffect } from "react";
import ChannelIcon from "../icons/channel-icon";
import { useQuery } from "@tanstack/react-query";
import { ChannelObj } from "@/lib/definitions";
import { useSignals } from "@preact/signals-react/runtime";
import { effect } from "@preact/signals-react";


export default function ChannelList() {
    const app = useContext(AppContext)
    const Channels = app.Channels
    const SignalR = app.SignalR
    useSignals()

    const { data: ApiChannels } = useQuery<ChannelObj[]>({ queryKey: ["channels"], queryFn: () => useFetch('/channel/GetChannels', "GET", {}, app.Token) })

    useEffect(() => {
        Channels.value = ApiChannels ?? Channels.value
    }, [ApiChannels])

    const setActiveChannel = (id: UUID) => {
        if (app.CurrentChannel.value !== id) {
            app.CurrentChannel.value = id;
            SignalR.value.joinChannel(id)
        }
    }

    return (
        <Suspense>
            <List>
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
        </Suspense>
    )
}
