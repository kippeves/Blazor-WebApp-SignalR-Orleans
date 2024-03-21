'use client'
import { Box, Button, Container, Grid, TextField, Toolbar } from "@mui/material";
import MessageRow from "./UI/MessageRow";
import { SignalRContext } from "@/app/providers/SignalRContext";
import { FormEvent, useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "@/app/providers/UserContext";
import { HubConnectionState } from "@microsoft/signalr";
import { ChannelState } from "@/app/lib/definitions";

export default function ChatClient() {
    const { activeChannel, Messages, AddMessage, setChannelState, channelState, SetConnected } = useContext(UserContext);
    const { Hub } = useContext(SignalRContext);
    const [message, setMessage] = useState("");
    const Connection = Hub.connection;
    const SendMessage = (e: FormEvent) => {
        e.preventDefault();
        Connection
            .send("SendMessage", message)
            .then(_ => setMessage(""));
    };

    useEffect(() => {
        setChannelState(ChannelState.Switching);
        if (Connection.state === HubConnectionState.Connected)
            Connection.send("SwitchChannel", activeChannel);

    }, [activeChannel])

    const messagesEndRef = useRef(null)
    Hub.useSignalREffect("ReceiveMessage", AddMessage, []);
    Hub.useSignalREffect("JoinedChannel", setChannelState, []);
    const scrollToBottom = () => messagesEndRef.current?.scrollIntoView();

    useEffect(() => {
        scrollToBottom();
    }, [Messages])

    useEffect(() => {
        SetConnected();
    }, [])

    return (<>
        <Toolbar sx={{ marginBottom: 2 }} />
        <Grid flexGrow={3} mb={2} display={'flex'} flexDirection={'column'} justifyContent={'flex-end'}>
            {
                Messages && Messages.map((obj, index) => <MessageRow key={index} Data={obj} Even={index % 2 == 0} />)
            }
        </Grid>
        <Box component={'form'} onSubmit={e => SendMessage(e)} pb={1} display={"flex"}>
            <TextField ref={messagesEndRef} id="messageArea" value={message} onChange={e => setMessage(e.target.value)} fullWidth label="Enter your message" variant="standard" />
            <Button type="submit">Send</Button>
        </Box>
    </>
    )
}
