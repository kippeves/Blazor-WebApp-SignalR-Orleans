import { MessageObj } from "@/lib/definitions";
import * as signalR from "@microsoft/signalr";
import { UUID } from "node:crypto";
import { useEffect } from "react";
const URL = process.env.HUB_ADDRESS ?? "https://192.168.2.124:7084/hubs/chathub"; //or whatever your backend port is
export class Connector {
    private connection: signalR.HubConnection;
    public state: signalR.HubConnectionState;
    public events: (onMessageReceived: (msg: MessageObj) => void) => void;
    static instance: Connector;

    constructor(token: string) {
        this.connection = new signalR.HubConnectionBuilder()
            .withUrl(URL, { accessTokenFactory: () => token })
            .build();
        this.connection.start().catch(err => document.write(err));
        this.events = (onMessageReceived) =>
            this.connection.on("ReceiveMessage", (message: MessageObj) => {
                onMessageReceived(message);
            });

        this.state = this.connection.state
    }


    public newMessage = (message: MessageRequest) => {
        this.connection.send("Message", message)
    }
    public joinChannel = (id: UUID) => {
        this.connection.send("JoinChannel", id)
    }
    public static getInstance(token: string): Connector {
        if (!Connector.instance)
            Connector.instance = new Connector(token);
        return Connector.instance;
    }
}
export default Connector.getInstance;

export type MessageRequest = {
    id: UUID,
    message: string
}

export type MessageResponse = {
    channel: string,
    message: ChatMsg
}

export type ChatUser = {
    id: UUID,
    name: string
}

export type ChatMsg = {
    id: UUID,
    user: ChatUser,
    message: string,
    created: string
}