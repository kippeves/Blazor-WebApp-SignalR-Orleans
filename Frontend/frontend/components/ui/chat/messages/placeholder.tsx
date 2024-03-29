'use client'
import CenterGrid from "@/components/layout/centerGrid";
import { Box } from "@mui/material";

export default function MessagesPlaceholder() {
    return (
        <CenterGrid>
            <span>
                You&apos;re currently not connected to a channel.
            </span>
        </CenterGrid>
    )
}