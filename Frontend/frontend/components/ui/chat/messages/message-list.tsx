'use client'
import useFetch from "@/lib/apiClient";
import { MessageObj } from "@/lib/definitions";
import { AppContext } from "@/providers/AppContext";
import { Box, Toolbar, Grid, TextField, Button, Chip } from "@mui/material";
import { grey } from "@mui/material/colors";
import { useSignals } from "@preact/signals-react/runtime";
import { useQuery } from "@tanstack/react-query";
import { FormEvent, useContext, useEffect, useRef, useState } from "react";

export default function MessageList() {
    const app = useContext(AppContext)
    const Messages = app.Messages;
    const CurrentChannelId = app.CurrentChannel
    const [message, setMessage] = useState("")
    useSignals()
    const Token = app.Token;

    const { data: ApiMessages } = useQuery<MessageObj[]>({ queryKey: ["messages", CurrentChannelId.value], queryFn: () => useFetch('/channel/GetMessages', "POST", { id: CurrentChannelId.value, amount: '50' }, Token) })

    useEffect(() => {
        Messages.value = ApiMessages ?? Messages.value
    }, [ApiMessages])


    const SendMessage = (e: FormEvent) => {
        e.preventDefault();
        /*        Connection
                    .send("SendMessage", message)
                    .then(_ => setMessage(""));*/
    };
    const messagesEndRef = useRef(null)



    return (
        <Box display={"flex"} flexDirection={"column"}>
            <Toolbar sx={{ marginBottom: 2 }} />
            <Grid flexGrow={3} mb={2} display={'flex'} flexDirection={'column'} justifyContent={'flex-end'}>
                {
                    Messages.value && Messages.value.map((obj, index) => <MessageRow key={index} Data={obj} Even={index % 2 == 0} />)
                }
            </Grid>
            <Box component={'form'} onSubmit={e => SendMessage(e)} pb={1} display={"flex"}>
                <TextField ref={messagesEndRef} id="messageArea" value={message} onChange={e => setMessage(e.target.value)} fullWidth label="Enter your message" variant="standard" />
                <Button type="submit">Send</Button>
            </Box>
        </Box>
    )
}




function MessageRow({ Data, Even }: { Data: MessageObj, Even: boolean }) {
    var date = Date.parse(Data.created)
    const msgDate = new Date(date);

    const shortDate = new Intl.DateTimeFormat('sv-SE', { dateStyle: 'short' }).format(msgDate);
    const shortTime = new Intl.DateTimeFormat('sv-SE', { timeStyle: 'short' }).format(msgDate);
    const TimeString = shortDate + " " + shortTime;
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