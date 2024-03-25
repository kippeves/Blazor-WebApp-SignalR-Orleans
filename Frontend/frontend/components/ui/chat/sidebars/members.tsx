/*'use client'
import { Avatar, Box, CSSObject, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Drawer as MuiDrawer, Theme, Toolbar, styled } from "@mui/material";
import { useContext, useEffect } from "react";
const drawerWidth = 250;

export default function Members() {
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
                                    <ListItemText primary={member.chatName} sx={{ marginLeft: 2 }} />
                                </ListItemButton>
                            </ListItem>
                        ))
                    }
                </List>
            </Box>
        </Drawer>
    );
}*/