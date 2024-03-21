import { Container, Grid, Toolbar } from "@mui/material";

export default function Page() {
    return (
        <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justifyContent="center"
            sx={{ minHeight: '100vh' }}
        >
            <Grid item display={"flex"} xs={3} justifyContent='center' alignItems="center">
                Hi
            </Grid>
        </Grid>
    )
}