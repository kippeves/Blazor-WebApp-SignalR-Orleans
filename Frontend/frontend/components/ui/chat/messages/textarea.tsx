'use client'
import { Box, TextField, Button } from "@mui/material";
import { FormEvent, forwardRef, useRef, useState } from "react";

interface TextAreaProps {
    sendMessage(arg: string): void;
}

export default function TextArea({ sendMessage }: TextAreaProps) {

    const [message, setMessage] = useState("")
    const Message = (e: FormEvent) => {
        event.preventDefault();
        e.preventDefault()
        if (message.length > 0) {
            sendMessage(message)
            setMessage("")
        }
    }

    return (
        <Box component={"form"} position={"sticky"} bgcolor={"white"} bottom={0} paddingBottom={"5px"} right={0} display={"flex"} flexDirection={"row"} marginBottom={0} onSubmit={Message} >
            <TextField id="messageArea" value={message} onChange={e => setMessage(e.target.value)} fullWidth label="Enter your message" variant="standard" />
            <Button type="submit" >Send</Button>
        </Box>
    )
}