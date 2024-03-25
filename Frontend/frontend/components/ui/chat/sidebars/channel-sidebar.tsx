'use client'
import { Toolbar, ListItemIcon, ListItemButton, List, ListItem, ListItemText, Divider, Box } from "@mui/material";
import React, { Suspense, memo, useContext, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { AppContext } from "@/providers/AppContext";
import { SlideDrawer } from "@/lib/graphics/styles";
import { ChannelObj } from "@/lib/definitions";
import { useSignals } from "@preact/signals-react/runtime";
import ChannelList from "./channel-list";
import useFetch from "@/lib/apiClient";

const CHANNELS_LOCALS_KEY = "CHANNELS";
const getCachedChannels = (): ChannelObj[] => {
    if (typeof window !== 'undefined') {
        const value = localStorage.getItem(CHANNELS_LOCALS_KEY);
        if (value == 'undefined') return []
        return JSON.parse(value)
    } else return []
}


export default function ChannelSideBar() {
    const app = useContext(AppContext)
    const SidebarOpen = app.SidebarOpen;
    const flipMenu = () => {
        SidebarOpen.value = !SidebarOpen.value
    }

    useSignals()

    return (
        <SlideDrawer open={SidebarOpen.value} variant="permanent">
            <Toolbar />
            <Box display={"flex"} flexDirection={"column"} height={'100%'}>
                <ChannelList />
            </Box>
            <Divider />
            <List>
                <ListItem disablePadding sx={{ display: 'block' }} >
                    <ListItemButton disableGutters onClick={flipMenu}>
                        <ListItemIcon sx={{ margin: 1, justifyContent: 'center' }}>{SidebarOpen.value ? <ChevronLeft /> : <ChevronRight />}</ListItemIcon>
                        <ListItemText primary={SidebarOpen.value ? "Close" : "Open"} sx={{ marginLeft: 2 }} />
                    </ListItemButton>
                </ListItem>
            </List>
        </SlideDrawer >
    )
}
