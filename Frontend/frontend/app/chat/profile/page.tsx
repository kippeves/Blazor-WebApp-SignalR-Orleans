import { auth } from "@/auth";
import { Grid } from "@mui/material";
import { SessionProvider } from "next-auth/react";
import ProfilePage from "./components/profile-page";

export default async function Page() {
    const session = await auth();

    if (session?.user) {
        session.user = {
            name: session.user.name,
            email: session.user.email,
            image: session.user.image
        }
    }
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
                <SessionProvider basePath={"/api/auth"} session={session} refetchOnWindowFocus={false} >
                    <ProfilePage />
                </SessionProvider>
            </Grid>
        </Grid>
    )
}