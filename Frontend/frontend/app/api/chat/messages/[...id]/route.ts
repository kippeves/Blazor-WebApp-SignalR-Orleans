'use server'
import { auth } from "@/auth";
import { STATUS_CODES } from "http";
import { isString } from "lodash";
import { NextRequest } from "next/server";

const baseAdress = process.env.API_URL

export async function GET(req: NextRequest, { params: { id } }) {
    var session = await auth();
    if (!session) return new Response(null, { status: 401 });
    let query = `?id=${id[0]}`

    if (id.length > 1) query += `&post=${id[1]}`

    try {
        const response = await fetch(baseAdress + `/channel/GetMessages` + query,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${session.user.token}`,
                    "Content-Type": "application/json"
                },
            }
        ).then(res => res.json())
        return new Response(JSON.stringify(response), { status: 200 })
    } catch (e) {
        return new Response(e, { status: 500 });
    }

}