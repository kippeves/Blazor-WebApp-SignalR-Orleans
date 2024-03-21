import React from "react";
import { AppBar, Avatar, Box, Container, Drawer, IconButton, Toolbar, Tooltip } from "@mui/material";
import ResponsiveAppBar from "@/components/UI/Navbar";
import Channels from "@/components/UI/Sidebars/Channels";
import { DoorBack } from "@mui/icons-material";
import ChatClient from "@/components/ChatClient";
import Members from "@/components/UI/Sidebars/Members";
import { signOut } from "@/auth";

export default async function Page() {
    return (
        <>

            <Channels />
            <Container component={"main"} sx={{ display: 'flex', flexDirection: 'column', height: '100dvh' }} >
                <ChatClient />
            </Container>
            <Members />

        </>
    );
}