import { Container } from "@mui/material";

export default function CenterGrid(props: { children: React.ReactNode, bgUrl?: string }) {

    const bg = props.bgUrl === undefined ? "" : `url(${props.bgUrl})`
    return (
        <Container sx={{ backgroundImage: bg }} maxWidth={false}>
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