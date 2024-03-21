'use client'
import React from "react";

type TokenContextType = {
    Token: string
}
const TokenContext = React.createContext<TokenContextType | null>(null);

const TokenContextProvider: React.FC<{ children: React.ReactNode, Token: string }> = (props: { children: React.ReactNode, Token: string }) => {
    return (
        <TokenContext.Provider value={{ Token: props.Token }}>
            {props.children}
        </TokenContext.Provider>
    );

}
export { TokenContext, TokenContextProvider }
