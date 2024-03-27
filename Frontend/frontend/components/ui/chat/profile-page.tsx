"use client"

import { Box, Button, Input } from "@mui/material"
import { useSession } from "next-auth/react"
import { useState } from "react"

export const UpdateForm = () => {
    const { data: session, update } = useSession()
    const [name, setName] = useState(`${session?.user?.name}` ?? "")

    if (!session?.user) return null

    const Update = async () => {
        if (session) {
            event.preventDefault();
            const newSession = await update({
                user: { name }
            })
            setName(newSession.user.name)
        }
    }

    return (
        <Box display={"flex"} flexDirection={"column"}>
            <h2 className="text-xl font-bold">Updating the session</h2>
            <form
                onSubmit={Update}
                className="flex items-center space-x-2 w-full max-w-sm"
            >
                <Input
                    type="text"
                    placeholder="New name"
                    value={name}
                    onChange={(e) => {
                        setName(e.target.value)
                    }}
                />
                <Button type="submit">Update</Button>
            </form>
        </Box>
    )
}
