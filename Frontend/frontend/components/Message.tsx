
import { ChatMessage } from "@/app/lib/definitions";
import { Chip, Grid } from "@mui/material";
import { grey } from "@mui/material/colors";

export default function MessageRow({ Data, Even }: { Data: ChatMessage, Even: boolean }) {
    const msgDate = new Date(Date.parse(Data.Time));
    const shortDate = new Intl.DateTimeFormat('sv-SE', { dateStyle: 'short' }).format(msgDate);
    const shortTime = new Intl.DateTimeFormat('sv-SE', { timeStyle: 'short' }).format(msgDate);
    const TimeString = shortDate + " " + shortTime;

    return (<Grid container display={"flex"} sx={{
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
        >{Data.User}: {Data.Message}</Grid>
    </Grid >)
}