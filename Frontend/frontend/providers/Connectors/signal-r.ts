import { MessageRequest, MessageResponse } from "@/lib/definitions";
import * as signalR from "@microsoft/signalr";
import { UUID } from "node:crypto";
import { useEffect } from "react";
const URL = process.env.HUB_ADDRESS ?? "https://192.168.2.124:7084/hubs/chathub"; //or whatever your backend port is

export type ConnectorType = {
    events: (onMessageReceived: (response: MessageResponse) => void) => void,
    newMessage: (message: MessageRequest) => void,
    joinChannel: (id: UUID) => void,
    connection: signalR.HubConnection
}

export class Connector implements ConnectorType {
    public connection: signalR.HubConnection;
    public events: (onMessageReceived: (response: MessageResponse) => void) => void;
    static instance: Connector;
    static token: string;

    constructor() {
        this.connection = new signalR.HubConnectionBuilder()
            .withUrl(URL, { accessTokenFactory: () => Connector.token })
            .build();
        this.connection.start().catch(err => console.error(err));
        this.events = (onMessageReceived) =>
            this.connection.on("ReceiveMessage", (response: MessageResponse) => {
                onMessageReceived(response);
            });
    }


    public newMessage = (message: MessageRequest) => {
        this.connection.send("Message", message)
    }
    public joinChannel = (id: UUID) => {
        this.connection.send("JoinChannel", id)
    }
    public static getInstance(token?: string): Connector {
        if (token !== undefined && Connector.token !== '') Connector.token = token;

        if (!Connector.instance)
            Connector.instance = new Connector();

        return Connector.instance;
    }
}
export default Connector.getInstance;
