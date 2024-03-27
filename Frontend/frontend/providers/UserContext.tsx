'use client'
import { User } from "@/lib/definitions";
import React from "react";

export type UserContextType = {
    User: User,
};

export const UserContext = React.createContext<UserContextType | null>(null);


export const UserContextProvider: React.FC<{ children: React.ReactNode, User: User }> = (props: { children: React.ReactNode, User: User }) => {
    return (
        <UserContext.Provider value={{ User: props.User }}>
            {props.children}
        </UserContext.Provider>
    );
}