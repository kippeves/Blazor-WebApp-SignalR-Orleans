import { auth, signOut } from "@/auth";
import { AppBar, Avatar, Box, Container, IconButton, Toolbar, Tooltip } from "@mui/material";
import Providers from "../providers";
import ResponsiveAppBar from "@/components/ui/chat/sidebars/navbar";
import { DoorBack } from "@mui/icons-material";
import { SessionProvider } from "next-auth/react";


export default async function Layout(props: { children: React.ReactNode }) {
    const authState = await auth();
    return (
        <Providers>
            <SessionProvider session={authState}>
                <Box sx={{ display: 'flex', flexDirection: 'row', height: '100%' }}>
                    <AppBar position="fixed" sx={{ zIndex: 9999, color: 'info' }}>
                        <Container maxWidth="xl" disableGutters>
                            <Toolbar>
                                <ResponsiveAppBar />
                                <Box component={'form'} sx={{ flexGrow: 0 }} action={async () => {
                                    'use server';
                                    await signOut();
                                }}>
                                    <Tooltip title="Log Out">
                                        <IconButton sx={{ p: 0 }} type="submit">
                                            <Avatar sx={{ border: '2px solid white', bgcolor: 'primary.light' }} alt={""}>{<DoorBack />}</Avatar>
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                            </Toolbar>
                        </Container>
                    </AppBar>
                    {props.children}
                </Box>
            </SessionProvider>
        </Providers >
    );
}