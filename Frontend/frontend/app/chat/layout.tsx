'use server'
import { AppBar, Box, Container, Toolbar } from "@mui/material";
import ResponsiveAppBar, { AuthToolbar } from "@/components/ui/chat/sidebars/navbar";

import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";

export default async function Layout(props: { children: React.ReactNode }) {
    const session = await auth();
    return (
        <SessionProvider session={session}>
            <Box sx={{ display: 'flex', flexDirection: 'row', height: '100%' }}>
                <AppBar position="fixed" sx={{ zIndex: 9999, color: 'info' }}>
                    <Container maxWidth="xl" disableGutters>
                        <AuthToolbar token={session.user.token} />
                    </Container>
                </AppBar>
                {props.children}
            </Box>
        </SessionProvider>
    );
}