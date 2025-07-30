// components/Logs.tsx
import { useEffect, useRef } from "react";

interface LogsProps {
    logs: string[] | null;
    hasStartedConversion: boolean;
}

const Logs = ({ logs, hasStartedConversion }: LogsProps) => {
    const logsEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [logs]);

    const getLogColor = (log: string): string => {
        const lowerLog = log.toLowerCase();
        if (
            lowerLog.includes("erreur") ||
            lowerLog.includes("error") ||
            lowerLog.includes("fail")
        ) {
            return "#ff3b3b";
        } else if (
            lowerLog.includes("terminé") ||
            lowerLog.includes("succès") ||
            lowerLog.includes("fini")
        ) {
            return "#00A6A6";
        } else if (
            lowerLog.includes("en cours") ||
            lowerLog.includes("processing") ||
            lowerLog.includes("démarrage") ||
            lowerLog.includes("...")
        ) {
            return "#ff9900";
        } else {
            return "#FFFCF2";
        }
    };

    return (
        <div className="logs" style={{ overflowY: "auto" }}>
            {logs && logs.length > 0 ? (
                logs.map((log, index) => (
                    <div key={index} style={{ color: getLogColor(log) }}>
                        {log}
                    </div>
                ))
            ) : (
                <div
                    style={{
                        color: hasStartedConversion ? "#7cfc00" : "#FFFCF2",
                    }}>
                    {hasStartedConversion
                        ? "✅ Toutes les conversions sont terminées."
                        : "📋 Aucune conversion lancée"}
                </div>
            )}
            <div ref={logsEndRef} />
        </div>
    );
};

export default Logs;
