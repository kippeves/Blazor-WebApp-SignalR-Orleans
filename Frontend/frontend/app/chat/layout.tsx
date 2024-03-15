import { Container, CssBaseline } from "@mui/material";

export default function Layout(props: { children: React.ReactNode }) {
    return (
        <Container sx={{ display: 'flex' }}>
            <CssBaseline />
            {props.children}
        </Container>
    );
}