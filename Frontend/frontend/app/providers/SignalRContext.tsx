'use client'
import React, { useMemo } from "react";
import { createSignalRContext } from "react-signalr";
import { Context, Hub } from "react-signalr/src/signalr/types";

export type SignalRContextType = {
    Hub: Context<Hub<string, string>>,
};

const SignalRContext = React.createContext<SignalRContextType | null>(null);
const SignalRContextProvider: React.FC<{ children: React.ReactNode, Token: string }> = ({ children, Token }: { children: React.ReactNode, Token: string }) => {

    console.debug(process.env.API_URL)
    console.debug(process.env.REACT_APP_API_URL)

    const SERVER_URL = "https://192.168.2.124:7084";

    const SignalR = useMemo(() => {
        return createSignalRContext()
    }, [Token]);

    return (
        <SignalR.Provider
            connectEnabled={!!Token}
            accessTokenFactory={() => Token}
            dependencies={[Token]} //remove previous connection and create a new connection if changed
            url={`${SERVER_URL}/hubs/chathub`}>
            <SignalRContext.Provider value={{ Hub: SignalR }}>
                {children}
            </SignalRContext.Provider>
        </SignalR.Provider>
    );

}
export { SignalRContext, SignalRContextProvider }

