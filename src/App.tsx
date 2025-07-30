import { useState } from "react";
import "./App.css";
import LeftSide from "./components/left/LeftSide";
import RightSide from "./components/right/RightSide";

function App() {
    const [logs, setLogs] = useState<string[]>([]);
    const [hasStartedConversion, setHasStartedConversion] = useState(false);

    const addLog = (message: string) => {
        setLogs((prevLogs) => [...prevLogs, message]);
        if (!hasStartedConversion) {
            setHasStartedConversion(true);
        }
    };

    return (
        <main className="container">
            <LeftSide addLog={addLog} />
            <div className="separator"></div>
            <RightSide
                logs={logs}
                hasStartedConversion={hasStartedConversion}
            />
        </main>
    );
}

export default App;
