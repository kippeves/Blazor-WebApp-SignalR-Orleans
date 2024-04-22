'use client'
import { MessageObj } from "@/lib/definitions";
import { useAppSignal } from "@/lib/hooks/useChat";
import { useLoadMessagesForCurrentChannel } from "@/lib/hooks/useLoadMessagesForCurrentChannel";
import { useSignalREvents } from "@/lib/hooks/useSignalR";
import { Box, Chip, Grid, Toolbar } from "@mui/material";
import { grey } from "@mui/material/colors";
import { useEffect, useMemo } from "react";
import TextArea from "./textarea";
import { MoonLoader } from "react-spinners";
import CenterGrid from "@/components/layout/centerGrid";
const scrollToBottom = () => {
    const element = document.getElementById("bottom");
    if (element) element.scrollTop = element.scrollHeight;
    element.scrollIntoView()
}

export default function Messages() {
    const { Messages, isLoading } = useLoadMessagesForCurrentChannel();
    const { CurrentChannel, ConnectorSignal: Connector } = useAppSignal();
    useEffect(() => { console.debug("Messages") }, [])
    useSignalREvents()

    const SendMessage = (message: string) => {
        console.debug("SendMessage: {}", new Date().toLocaleString())
        Connector.value.newMessage({ id: CurrentChannel.value, message: message });
    }

    useEffect(() => {
        scrollToBottom();
    }, [Messages])

    return (
        <Box display={"flex"} flexGrow={1} flexDirection={"column"} >
            <Toolbar sx={{ marginBottom: 2 }} />
            <Grid flexGrow={3} display={'flex'} flexDirection={'column'} justifyContent={'flex-end'}>
                {
                    isLoading
                        ? <CenterGrid><MoonLoader /></CenterGrid>
                        : <ul>{Messages && Messages.map((obj, index) => obj && <MessageRow key={index} Data={obj} index={index} />)}</ul>
                }
            </Grid>
            <span id="bottom" />
            <TextArea sendMessage={SendMessage} />
        </Box >
    )
}
//                    : <ul>{Messages && Messages.map((obj, index) => obj && <li key={index}>#{index}. {JSON.stringify(obj)}</li>)}</ul>

//<MessageRow key={index} Data={obj} index={index} />
const MessageRow = ({ Data, index }: { Data: MessageObj, index: number }) => {

    if (Data != undefined) {
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

                >{Data.user.chatName}: {Data.message}</Grid>
            </Grid >)
    }
}
