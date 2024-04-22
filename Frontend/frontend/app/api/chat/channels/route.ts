import { auth } from "@/auth";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest, props) {
    var session = await auth();
    if (!session) return new Response(null, { status: 401 });

    try {
        const url = `https://192.168.2.124:7084/backend/channel/GetChannels`
        const response = await fetch(url,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${session.user.token}`,
                    "Content-Type": "application/json"
                },
            }
        ).then(res => res.json())
        return new Response(JSON.stringify(response), { status: 200 });
    } catch (e) {
        return new Response(e, { status: 500 })
    }
}