import { useEffect, useState } from "react";
import { ChannelObj } from "../definitions";
import isEqual from "react-fast-compare";


export const useStorageForChannels = () => {
    const [channels, setChannels] = useState<ChannelObj[]>();

    const updateList = (newList: ChannelObj[]) => {
        if (isEqual(newList, channels)) return;

        var channelString = JSON.stringify(newList);
        localStorage.setItem('CHANNELS', channelString);
        setChannels(newList);
    };

    useEffect(() => {
        const json = localStorage.getItem('CHANNELS');
        if (json !== 'undefined') {
            const items = JSON.parse(json);
            if (!isEqual(items, channels)) updateList(items);
        }
    });

    return { Channels: channels, updateList };
};
