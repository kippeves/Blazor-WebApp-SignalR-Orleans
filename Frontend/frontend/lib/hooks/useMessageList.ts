import { UUID } from "crypto";
import { useState } from "react";
import { useAppSignal } from "./useChat";
import { MessageObj } from "../definitions";
import { useMutation, useQueryClient } from "@tanstack/react-query";



export const useMessageList = () => {
    const queryClient = useQueryClient();
    const { Channel } = useAppSignal();
    const mutation = useMutation({
        mutationFn: (msg) => Promise.resolve(msg),
        // When mutate is called:
        onMutate: async (msg: MessageObj) => {
            const previousData = queryClient.getQueryData<MessageObj[]>(["messages", Channel]);
            // Optimistically update to the new value
            queryClient.setQueryData<MessageObj[]>(['messages', Channel], (old) => [...old, msg]);

            // Return a context object with the snapshotted value
            return { previousTodos: previousData };
        }
    });

    const AddMessage = mutation.mutate;

    return { AddMessage };
};
