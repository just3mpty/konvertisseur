import { useEffect } from "react";
import { listen } from "@tauri-apps/api/event";

type Props = {
    addLog: (message: string) => void;
};

const LogListener = ({ addLog }: Props) => {
    useEffect(() => {
        const unlisten = listen<string>("log", (event) => {
            addLog(event.payload);
        });

        return () => {
            unlisten.then((fn) => fn());
        };
    }, [addLog]);

    return null;
};

export default LogListener;
