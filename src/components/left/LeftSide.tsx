import { useState } from "react";
import FolderSelection from "./FolderSelection";
import FormatSelection from "./FormatSelection";
import Quality from "./Quality";
import ConvertButton from "./ConvertButton";
import LogListener from "../right/LogListener";

const LeftSide = ({ addLog }: { addLog: (message: string) => void }) => {
    const [selectedFormat, setSelectedFormat] = useState<string>("");
    const [sourceFolder, setSourceFolder] = useState<string>("");
    const [destinationFolder, setDestinationFolder] = useState<string>("");
    const [quality, setQuality] = useState<number>(80);

    return (
        <section className="leftSide">
            <FolderSelection
                label="Dossier source"
                onSelect={setSourceFolder}
            />
            <FolderSelection
                label="Dossier destination"
                onSelect={setDestinationFolder}
            />
            <FormatSelection
                selectedFormat={selectedFormat}
                onFormatChange={setSelectedFormat}
            />
            <Quality quality={quality} onQualityChange={setQuality} />
            <ConvertButton
                sourceFolder={sourceFolder}
                destinationFolder={destinationFolder}
                format={selectedFormat}
                quality={quality}
                addLog={addLog}
            />
            <LogListener addLog={addLog} />
        </section>
    );
};

export default LeftSide;
