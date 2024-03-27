'use client'
import CenterGrid from "@/components/layout/centerGrid";
import { Box } from "@mui/material";

export default function MessageListPlaceholder() {
    return (
        <CenterGrid>
            <span>
                You're currently not connected to a channel.
            </span>
        </CenterGrid>
    )
}