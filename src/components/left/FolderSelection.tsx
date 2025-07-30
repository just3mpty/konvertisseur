import React, { useState } from "react";
import { open } from "@tauri-apps/plugin-dialog";

type FolderSelectionProps = {
    label: string;
    onSelect: (folderPath: string) => void;
};

const FolderSelection: React.FC<FolderSelectionProps> = ({
    label,
    onSelect,
}) => {
    const [folderPath, setFolderPath] = useState<string>("");

    const handleSelectFolder = async () => {
        try {
            const selected = await open({
                directory: true,
                multiple: false,
                title: `Sélectionner ${label.toLowerCase()}`,
            });

            if (typeof selected === "string") {
                setFolderPath(selected);
                onSelect(selected);
            }
        } catch (error) {
            console.error("Erreur lors de la sélection du dossier :", error);
        }
    };

    return (
        <div className="folderSelection">
            <h2>{label}</h2>
            <div className="folderSelection__content">
                <button onClick={handleSelectFolder}>Choisir un dossier</button>
                <div className="folderSelection__content__path">
                    {folderPath ? (
                        <small>{folderPath}</small>
                    ) : (
                        <small style={{ fontStyle: "italic", color: "#666" }}>
                            Aucun dossier sélectionné
                        </small>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FolderSelection;
