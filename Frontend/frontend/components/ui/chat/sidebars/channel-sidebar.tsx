'use client'
import { Toolbar, ListItemIcon, ListItemButton, List, ListItem, ListItemText, Divider, Box } from "@mui/material";
import React, { useContext } from "react";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { AppContext } from "@/providers/AppContext";
import { SlideDrawer } from "@/lib/graphics/styles";
import { useSignals } from "@preact/signals-react/runtime";
import ChannelList from "./channel-list";


export default function ChannelSideBar() {
    useSignals()
    const app = useContext(AppContext)
    const SidebarOpen = app.SidebarOpen;
    const flipMenu = () => {
        SidebarOpen.value = !SidebarOpen.value
    }

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
