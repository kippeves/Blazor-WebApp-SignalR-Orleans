'use client'
import { Avatar, ListItemIcon, SxProps, Theme } from "@mui/material";
import { CSSProperties, useState } from "react";


export default function ChannelIcon({ text, alt, currentChannel }: { text: string, alt: string, currentChannel: boolean }) {
    const [hover, setHover] = useState(false);

    const onMouseOver = () => setHover(true);
    const onMouseOut = () => setHover(false);
    const cssProps = {
        fontWeight: hover ? 'bold' : 'normal',
        backgroundBlendMode: 'darken',
    } as CSSProperties

    const avatarProps = {
        bgcolor: currentChannel ? 'primary.light' : 'primary.dark'
    } as SxProps<Theme>


    return (
        <ListItemIcon onMouseOver={onMouseOver} onMouseOut={onMouseOut} sx={{ margin: 1, justifyContent: 'center' }}>
            <Avatar style={cssProps} sx={avatarProps} alt={alt}>{text}</Avatar>
        </ListItemIcon>
    );
}
