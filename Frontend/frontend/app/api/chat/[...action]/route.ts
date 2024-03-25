'use server'
import { auth } from "@/auth";
import { NextRequest } from "next/server";


export async function GET(req: NextRequest, props) {
    var session = await auth();
    var action = props.action;

    if (!session) return new Response(null, { status: 401 });
    return new Response(JSON.stringify(""), { status: 200 });
}