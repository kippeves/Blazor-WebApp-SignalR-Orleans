'use client'
import * as React from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { AccountCircle } from '@mui/icons-material';
import { useRouter } from 'next/navigation'
import { LogOut } from '@/lib/actions';
import { useSignalR } from '@/lib/hooks/useSignalR';
import { useAppSignal } from '@/lib/hooks/useChat';
import { AppContextProvider } from '@/providers/AppContext';
import { Toolbar } from '@mui/material';

type Setting = {
    name: string,
    action: (() => void) | null,
}

const pages = ['Chat'];

export function AuthToolbar(props: { token: string }) {
    return (
        <AppContextProvider token={props.token}>
            <Toolbar>
                <ResponsiveAppBar />
            </Toolbar>
        </AppContextProvider>
    )
}

function ResponsiveAppBar() {
    const router = useRouter();
    const { IsConnected, HubState } = useAppSignal()
    const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const GoToProfile = async () => {
        router.push("/chat/profile", { scroll: false })
        handleCloseUserMenu();
    }

    const GoToPage = async (page: string) => {
        router.push(`/${page}`, { scroll: false })
        handleCloseUserMenu();
    }

    const LogOutFromChat = async () => {
        LogOut();
        handleCloseUserMenu()
    }


    const settings = [{ name: "Profile", action: GoToProfile }, { name: 'Account', action: handleCloseUserMenu }, { name: 'Dashboard', action: handleCloseUserMenu }, { name: 'Log Out', action: LogOutFromChat }] as Setting[];


    /*    Hub.useSignalREffect("JoinChannel", // Your Event Key
            (event: JoinChannelEvent) => console.debug(event)
            , [])
    */
    console.debug(JSON.stringify(IsConnected))

    return (
        <>
            <Typography
                variant="h6"
                noWrap
                component="a"
                onClick={() => GoToPage("Chat")}
                sx={{
                    mr: 2,
                    display: { xs: 'none', md: 'flex' },
                    fontWeight: 700,
                    color: 'inherit',
                    textDecoration: 'none',
                    cursor: "pointer"
                }}>
                {HubState.value}
            </Typography >
            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleOpenNavMenu}
                    color="inherit"
                >
                    <MenuIcon />
                </IconButton>
                <Menu
                    id="menu-appbar"
                    anchorEl={anchorElNav}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    keepMounted
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}
                    open={Boolean(anchorElNav)}
                    onClose={handleCloseNavMenu}
                    sx={{
                        display: { xs: 'block', md: 'none' },
                    }}
                >
                    {pages.map((page) => (
                        <MenuItem key={page} onClick={() => GoToPage(page)}>
                            <Typography textAlign="center">{page}</Typography>
                        </MenuItem>
                    ))}
                </Menu>
            </Box>
            <Typography
                variant="h5"
                noWrap
                component="a"
                href="#app-bar-with-responsive-menu"
                sx={{
                    mr: 2,
                    display: { xs: 'flex', md: 'none' },
                    flexGrow: 1,
                    fontWeight: 700,
                    color: 'inherit',
                    textDecoration: 'none',
                }}
            >
                {HubState.value}
            </Typography>
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                {pages.map((page) => (
                    <Button
                        key={page}
                        onClick={() => GoToPage(page)}
                        sx={{ my: 2, color: 'white', display: 'block' }}
                    >
                        {page}
                    </Button>
                ))}
            </Box >
            <Box sx={{ flexGrow: 0 }}>
                <Tooltip title="Open settings">
                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                        <Avatar sx={{ border: '2px solid white', bgcolor: 'primary.light' }} alt={""}>{<AccountCircle sx={{ color: 'white' }} />}</Avatar>
                    </IconButton>
                </Tooltip>
                <Menu
                    sx={{ mt: '45px' }}
                    id="menu-appbar"
                    anchorEl={anchorElUser}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                >
                    {settings.map((setting) => (
                        <MenuItem key={setting.name} onClick={setting.action}>
                            <Typography textAlign="center">{setting.name}</Typography>
                        </MenuItem>
                    ))}
                </Menu>
            </Box>
        </>
    );
}
export default ResponsiveAppBar;