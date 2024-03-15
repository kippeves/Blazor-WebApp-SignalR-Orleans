import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, RawAxiosRequestHeaders } from "axios";
import React from "react";
import { createContext } from "react";

export type ApiContextType = {
    ChangeChannel: (id: string) => void;
};

const Client = (Token: string) => axios.create({
    baseURL: 'http://localhost:5144/api',
    headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + Token
    } as RawAxiosRequestHeaders,
});

const ApiContext = React.createContext<ApiContextType | null>(null);

const ApiContextProvider: React.FC<{ children: React.ReactNode, Token: string }> = ({ children, Token }: { children: React.ReactNode, Token: string }) => {

    const ApiClient = Client(Token)
    console.log(Token)
    const ChangeChannel = (id: string) => {
        console.log(id)
        ApiClient.post("/User/ChangeChannel", {
            id: id
        })
    }

    return (
        <ApiContext.Provider value={{ ChangeChannel }}>
            {children}
        </ApiContext.Provider>
    );

}
export { ApiContext, ApiContextProvider }