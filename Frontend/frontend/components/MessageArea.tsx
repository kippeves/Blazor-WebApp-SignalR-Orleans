import { Box, Button, Container, Grid, TextField, Toolbar } from "@mui/material";
import MessageRow from "./Message";
import { ChatMessage } from "@/app/lib/definitions";

export default function MessageArea({ Messages }: { Messages: ChatMessage[] }) {
    return (<>
        <Container sx={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh' }}>
            <Toolbar sx={{ marginBottom: 3 }} />
            <Grid component={"main"} flexGrow={1} mb={2}>
                {
                    Messages && Messages.map((obj, index) => <MessageRow key={index} Data={obj} Even={index % 2 == 0} />)
                }
            </Grid>
            <Box pb={1} display={"flex"}>
                <TextField id="standard-basic" fullWidth label="Enter your message" variant="standard" />
                <Button>Send</Button>
            </Box>
        </Container>
    </>
    )
}