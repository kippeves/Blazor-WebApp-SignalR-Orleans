import { Container } from "@mui/material";

export default function CenterGrid(props: { children: React.ReactNode }) {

    return (
        <Container sx={{ backgroundImage: "url(_next/image/wp.avif)" }} maxWidth={false}>
            <Container
                maxWidth={"xs"}
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: '100vh',
                    flexWrap: 1
                }}>
                {props.children}
            </Container>
        </Container>
    )
}