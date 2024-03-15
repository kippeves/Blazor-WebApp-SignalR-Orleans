'use client'
import { Toolbar, ListItemIcon, ListItemButton, List, ListItem, ListItemText, CSSObject, Theme, styled, Avatar } from "@mui/material";
import MuiDrawer from '@mui/material/Drawer';
import React, { useContext, useState } from "react";
import { ChatChannel } from "@/app/lib/definitions";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { ApiContext } from "../app/Contexts/ApiContext";


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

export default function SideMenu({ Channels }: { Channels: ChatChannel[] }) {
    const { ChangeChannel } = useContext(ApiContext);
    const [menuOpen, setMenuState] = useState(false);
    const [currentChannel, setCurrentChannel] = useState("")
    //ApiClient.post()
    function setMenu(event: React.MouseEvent<HTMLDivElement, MouseEvent>): void {
        event.preventDefault();
        setMenuState(!menuOpen);
    }

    const switchChannel = (id: string) => {
        console.log(currentChannel);
        setCurrentChannel(id)
        ChangeChannel(id);
    }

    const flipMenu = () => setMenuState(!menuOpen);

    const joinChannel = () => {

    }
    return (
        <Drawer open={menuOpen} variant="permanent">
            <Toolbar />
            <List >
                <ListItem disablePadding sx={{ display: 'block' }} >
                    <ListItemButton disableGutters onClick={flipMenu}>
                        <ListItemIcon sx={{ margin: 1, justifyContent: 'center' }}>{menuOpen ? <ChevronLeft /> : <ChevronRight />}</ListItemIcon>
                        <ListItemText primary={menuOpen ? "Close" : "Open"} sx={{ marginLeft: 2 }} />
                    </ListItemButton>
                </ListItem>
                {Channels && Channels.map((channel, index) => (
                    <ListItem key={index} disablePadding sx={{ display: 'block' }}>
                        <ListItemButton disableGutters onClick={() => switchChannel(channel.id)}>
                            <ListItemIcon sx={{ margin: 1, justifyContent: 'center' }}>
                                <Avatar sx={{ bgcolor: (channel.id == currentChannel) ? 'primary.light' : 'success.light' }} alt={"Channel" + (index + 1)}>{index + 1}</Avatar>
                            </ListItemIcon>
                            <ListItemText primary={channel.name} sx={{ marginLeft: 2 }} />
                        </ListItemButton>
                    </ListItem>
                ))}
                <ListItem disablePadding sx={{ display: 'block' }} onClick={joinChannel}>
                    <ListItemButton disableGutters>
                        <ListItemIcon sx={{ margin: 1, justifyContent: 'center' }}><Avatar sx={{ bgcolor: 'info.light' }}>+</Avatar></ListItemIcon>
                        <ListItemText primary="Join" sx={{ marginLeft: 2 }} />
                    </ListItemButton>
                </ListItem>
            </List>
        </Drawer >
    )
}