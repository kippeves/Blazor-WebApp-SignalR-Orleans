'use client'
import { UserContext } from "@/app/providers/UserContext";
import { Avatar, Box, CSSObject, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Drawer as MuiDrawer, Theme, Toolbar, styled } from "@mui/material";
import { useContext, useEffect } from "react";
const drawerWidth = 250;

export default function Members() {
    const { Members } = useContext(UserContext);
    const openedMixin = (theme: Theme): CSSObject => ({
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
        overflowX: 'hidden',
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
            })
        }),
    );

    return (
        <Drawer open anchor="right" variant="permanent" >
            <Toolbar />
            <Box display={"flex"} flexDirection={"column"} height={'100%'}>
                <List>
                    {
                        Members && Members.map((member, index) => (
                            <ListItem key={index} disablePadding sx={{ display: 'block' }}>
                                <ListItemButton disableGutters>
                                    <ListItemIcon>
                                        <Avatar>{index}</Avatar>
                                    </ListItemIcon>
                                    <ListItemText primary={member.name} sx={{ marginLeft: 2 }} />
                                </ListItemButton>
                            </ListItem>
                        ))
                    }
                </List>
            </Box>
        </Drawer>
    );
}