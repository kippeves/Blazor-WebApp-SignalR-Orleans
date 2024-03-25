import { auth } from "@/auth";
import { getSession } from "next-auth/react";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    var session = auth();
    if (!session) return new Response("Kiosk", { status: 401 }) // User is not authenticated
}

export async function GET(req: NextRequest) {
    var session = await auth();

    if (!session) return new Response(null, { status: 401 });
    return new Response(JSON.stringify((await session).user), { status: 200 });
}