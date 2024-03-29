'use client'
import { MessageObj } from "@/lib/definitions";
import { useAppSignal } from "@/lib/hooks/useChat";
import { useLoadMessagesForCurrentChannel } from "@/lib/hooks/useLoadMessagesForCurrentChannel";
import { useSignalR, useSignalREvents } from "@/lib/hooks/useSignalR";
import { Box, Chip, Grid, Toolbar } from "@mui/material";
import { grey } from "@mui/material/colors";
import { useEffect } from "react";
import TextArea from "./textarea";

const scrollToBottom = () => {
    const element = document.getElementById("bottom");
    if (element) element.scrollTop = element.scrollHeight;
    element.scrollIntoView()
}

export default function Messages() {
    const { Messages } = useLoadMessagesForCurrentChannel();
    const { Channel } = useAppSignal();
    const { newMessage } = useSignalR();
    useSignalREvents();
    const SendMessage = (message: string) => {
        newMessage({ id: Channel.value, message: message });
    }

    useEffect(() => {
        scrollToBottom();
    }, [Messages])

    return (
        <Box display={"flex"} flexGrow={1} flexDirection={"column"} >
            <Toolbar sx={{ marginBottom: 2 }} />
            <Grid flexGrow={3} display={'flex'} flexDirection={'column'} justifyContent={'flex-end'}>
                {
                    Messages && Messages.map((obj, index) => <MessageRow key={index} Data={obj} index={index} />)
                }
            </Grid>
            <span id="bottom" />
            <TextArea sendMessage={SendMessage} />
        </Box >
    )
}

const MessageRow = ({ Data, index }: { Data: MessageObj, index: number }) => {
    var date = Date.parse(Data.created)
    const msgDate = new Date(date);

    const shortDate = new Intl.DateTimeFormat('sv-SE', { dateStyle: 'short' }).format(msgDate);
    const shortTime = new Intl.DateTimeFormat('sv-SE', { timeStyle: 'short' }).format(msgDate);
    const TimeString = shortDate + " " + shortTime;
    const Even = index % 2 == 0;
    return (
        <Grid container display={"flex"} sx={{
            bgcolor: Even ? grey[100] : "",
            borderRadius: 1
        }} p={1} alignItems={'center'} >
            <Grid item xs={'auto'} pr={2} display={{ xs: "none", md: "block" }}>
                <Chip label={TimeString} variant="outlined" />
            </Grid>
            <Grid
                item
                xs={true}
                px={1}
                py={1}

            >{Data.user}: {Data.message}</Grid>
        </Grid >)
}
