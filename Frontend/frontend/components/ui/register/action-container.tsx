'use client'
import { useState } from "react";
import LoginForm from "./login-form";
import { Box, Button, Card, CardContent, CardHeader } from "@mui/material";
import RegisterForm from "./register-form";

export default function LoginAndRegister() {
    const [logIn, setLogin] = useState(true);
    const setTitle = () => logIn ? "Log In" : "Register a new account";

    const flipLogin = () => setLogin(!logIn);

    return (
        <Card sx={{ px: 1, py: 2, borderRadius: 2, display: "flex", flexDirection: "column", alignItems: "stretch" }} elevation={3}>
            <CardHeader title={setTitle()} />
            <CardContent>
                <Box display={"flex"} flexDirection={"column"} gap={3}>
                    {logIn ? <LoginForm /> : <RegisterForm />}
                    <Button variant="contained" color="success" onClick={flipLogin} fullWidth>{logIn ? "Do you want to register?" : "Did you mean to log in?"}</Button>
                </Box>
            </CardContent>
        </Card>
    );
}