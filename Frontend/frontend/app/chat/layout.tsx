import { auth, signOut } from "@/auth";
import { AppBar, Avatar, Box, Container, IconButton, Toolbar, Tooltip } from "@mui/material";
import axios, { RawAxiosRequestHeaders } from "axios";
import { User } from "../lib/definitions";
import { AppSettings } from "../lib/definitions";
import { ApiContextProvider } from "../providers/ApiContext";
import { SignalRContextProvider } from "../providers/SignalRContext";
import { TokenContextProvider } from "../providers/TokenContext";
import { UserContextProvider } from "../providers/UserContext";
import Providers from "../providers";
import ResponsiveAppBar from "@/components/UI/Navbar";
import { DoorBack } from "@mui/icons-material";


export default async function Layout(props: { children: React.ReactNode }) {
    const authState = await auth();
    const User = authState.user as User;
    const API_URL = process.env.API_URL;
    const Client = axios.create({
        baseURL: API_URL,
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + User.token
        } as RawAxiosRequestHeaders,
    });

    var Settings = await Client.get<AppSettings>('/User/Prefetch/Settings').then(res => res.data);
    const isEnabled = false;
    return (
        <Providers>
            <SignalRContextProvider Token={User.token}>
                <TokenContextProvider Token={User.token}>
                    <ApiContextProvider>
                        <UserContextProvider Settings={Settings} User={User}>
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
                        </UserContextProvider>
                    </ApiContextProvider>
                </TokenContextProvider>
            </SignalRContextProvider>
        </Providers >
    );
}