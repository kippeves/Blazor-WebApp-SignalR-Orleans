import { AppContext } from "@/providers/AppContext";
import { useSignals } from "@preact/signals-react/runtime";
import { useContext } from "react";

export const useAppSignal = () => {
    useSignals()
    return useContext(AppContext)
}

