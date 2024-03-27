'use server'
import { AppBar, Box, Container, MenuItem, Toolbar, Typography } from "@mui/material";
import Providers from "../providers";
import ResponsiveAppBar from "@/components/ui/chat/sidebars/navbar";

import { createSignalRContext } from "react-signalr";
import { SessionProvider, useSession } from "next-auth/react";
import { AppContextProvider } from "@/providers/AppContext";
import { LogOut } from "@/lib/actions";
import { Context, Hub } from "react-signalr/lib/signalr/types";
import { createSign } from "crypto";
import { Suspense } from "react";
import { Signal, signal } from "@preact/signals-react";
import { auth } from "@/auth";


export default async function Layout(props: { children: React.ReactNode }) {
    const session = await auth();
    return (
        <Providers>
            <Box sx={{ display: 'flex', flexDirection: 'row', height: '100%' }}>
                <AppBar position="fixed" sx={{ zIndex: 9999, color: 'info' }}>
                    <Container maxWidth="xl" disableGutters>
                        <Toolbar>
                            <ResponsiveAppBar />
                        </Toolbar>
                    </Container>
                </AppBar>
                <SessionProvider session={session}>
                    <AppContextProvider Token={session.user.token}>
                        {props.children}
                    </AppContextProvider>
                </SessionProvider>
            </Box>
        </Providers >
    );
}