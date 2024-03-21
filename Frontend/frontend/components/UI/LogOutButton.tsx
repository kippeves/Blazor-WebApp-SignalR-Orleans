'use server'
import { signOut } from "@/auth";
import { MenuItem, Typography } from "@mui/material";

export default function LogOutButton() {
    return (<form
        action={async () => {
            await signOut();
        }}
    >
        <MenuItem key={'logout'}>
            <Typography textAlign="center">Log Out</Typography>
        </MenuItem>
    </form>
    );
}