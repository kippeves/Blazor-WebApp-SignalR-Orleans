'use client'
import { Toolbar, ListItemIcon, ListItemButton, List, ListItem, ListItemText, CSSObject, Theme, styled, Avatar, Icon, Divider, ListItemAvatar, Box } from "@mui/material";
import MuiDrawer from '@mui/material/Drawer';
import React, { memo, useContext, useState } from "react";
import { ChannelState, ChatChannel } from "@/app/lib/definitions";
import { ChevronLeft, ChevronRight, DoorBack, FireExtinguisher, Person } from "@mui/icons-material";
import { SignalRContext } from "@/app/providers/SignalRContext";
import ChannelIcon from "../ChannelIcon";
import ImageIcon from '@mui/icons-material/Image';

import { UserContext } from "@/app/providers/UserContext";
import { UUID } from "crypto";


const drawerWidth = 200;

const openedMixin = (theme: Theme): CSSObject => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(9)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(9)} + 1px)`,
    },
});

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        ...(open && {
            ...openedMixin(theme),
            '& .MuiDrawer-paper': openedMixin(theme),
        }),
        ...(!open && {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': closedMixin(theme),
        }),
    }),
);

export default function Channels() {
    const { Channels, activeChannel, setActiveChannel } = useContext(UserContext)
    const { Hub } = useContext(SignalRContext);
    const [menuOpen, setMenuState] = useState(false);
    const Connection = Hub.connection;


    const flipMenu = () => setMenuState(!menuOpen);

    const CachedComponents = memo((props: { Channels: ChatChannel[] }) => {
        return (
            props.Channels && props.Channels.map((channel, index) => (
                <ListItem key={index} disablePadding sx={{ display: 'block' }}>
                    <ListItemButton disableGutters onClick={() => setActiveChannel(channel.id)}>
                        <ChannelIcon currentChannel={channel.id === activeChannel} alt={`Channel ${index + 1}`} text={`${index + 1}`} />
                        <ListItemText primary={channel.name} sx={{ marginLeft: 2 }} />
                    </ListItemButton>
                </ListItem>
            ))
        )
    })



    return (
        <Drawer open={menuOpen} variant="permanent">
            <Toolbar />
            <Box display={"flex"} flexDirection={"column"} height={'100%'}>
                <List>
                    {Channels && <CachedComponents Channels={Channels} />}
                </List>
            </Box>
            <Divider />
            <List>
                <ListItem disablePadding sx={{ display: 'block' }} >
                    <ListItemButton disableGutters onClick={flipMenu}>
                        <ListItemIcon sx={{ margin: 1, justifyContent: 'center' }}>{menuOpen ? <ChevronLeft /> : <ChevronRight />}</ListItemIcon>
                        <ListItemText primary={menuOpen ? "Close" : "Open"} sx={{ marginLeft: 2 }} />
                    </ListItemButton>
                </ListItem>
            </List>
        </Drawer >
    )
}