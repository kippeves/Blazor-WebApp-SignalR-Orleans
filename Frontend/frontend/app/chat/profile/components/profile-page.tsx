"use client"

import { Button, Input } from "@mui/material"
import { useSession } from "next-auth/react"
import { useState } from "react"

const UpdateForm = () => {
    const { data: session, update } = useSession()
    const [name, setName] = useState(`${session?.user?.name}` ?? "")

    if (!session?.user) return null

    const Update = async () => {
        if (session) {
            event.preventDefault();
            const newSession = await update({
                user: { name }
            })
        }
    }

    return (
        <>
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
        </>
    )
}

export default function ClientExample() {
    const { data: session, status } = useSession()

    return (
        <div className="flex flex-col gap-4">
            <UpdateForm />
        </div>
    )
}