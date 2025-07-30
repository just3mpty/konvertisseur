import React from "react";

type FormatSelectionProps = {
    selectedFormat: string;
    onFormatChange: (format: string) => void;
};

const FormatSelection: React.FC<FormatSelectionProps> = ({
    selectedFormat,
    onFormatChange,
}) => {
    const formats = ["jpg", "jpeg", "png", "webp", "avif"];

    return (
        <div className="formatSelection">
            <h2>Format de sortie</h2>
            <select
                id="format-select"
                value={selectedFormat}
                onChange={(e) => onFormatChange(e.target.value)}>
                {formats.map((format) => (
                    <option key={format} value={format}>
                        .{format}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default FormatSelection;
