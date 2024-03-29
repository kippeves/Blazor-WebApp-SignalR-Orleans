import { AppContext } from "@/providers/AppContext";
import { useSignals } from "@preact/signals-react/runtime";
import { useContext } from "react";

export const useAppSignal = () => {
    useSignals()
    var app = useContext(AppContext)
    return { Token: app.Token, SignalR: app.SignalR, Channel: app.CurrentChannel }
}

