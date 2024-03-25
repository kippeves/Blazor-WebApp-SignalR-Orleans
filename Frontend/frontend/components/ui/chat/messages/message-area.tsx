'use client'
import { useContext } from "react";
import { MessageObj } from "@/lib/definitions";
import { AppContext } from "@/providers/AppContext";
import MessageList from "./message-list";
import { Box } from "@mui/material";
import { brown } from "@mui/material/colors";
import MessageListPlaceholder from "./message-placeholder";

export default function MessageArea() {
    const app = useContext(AppContext)
    const currentChannelSignal = app.CurrentChannel
    const currentChannel = currentChannelSignal.value
    return (
        currentChannel === undefined ? <MessageListPlaceholder /> : <MessageList />
    )
}