"use client";
import { invoke } from "@tauri-apps/api/core";
import { useState } from "react";

interface Props {
    sourceFolder: string;
    destinationFolder: string;
    format: string;
    quality: number;
    addLog: (log: string) => void;
}

const ConvertButton = ({
    sourceFolder,
    destinationFolder,
    format,
    quality,
    addLog,
}: Props) => {
    const [loading, setLoading] = useState(false);

    const handleClick = async () => {
        if (!sourceFolder || !destinationFolder || !format) {
            addLog && addLog("Veuillez remplir tous les champs");
            return;
        }
        setLoading(true);
        addLog("Démarrage de la conversion...");
        addLog("Source: " + sourceFolder);
        addLog("Destination: " + destinationFolder);
        addLog("Format: " + format);
        addLog("Qualité: " + quality + "%");
        try {
            await invoke("convert_images", {
                sourceFolder,
                destinationFolder,
                format,
                quality,
            });
            addLog("🎉 Mission accomplie !");
        } catch (error) {
            const errorMessage =
                error && typeof error === "object" && "message" in error
                    ? (error as Error).message
                    : JSON.stringify(error);

            addLog(`Erreur lors de la conversion: ${errorMessage}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button onClick={handleClick} disabled={loading}>
            {loading ? "Conversion en cours..." : "Convertir"}
        </button>
    );
};

export default ConvertButton;
