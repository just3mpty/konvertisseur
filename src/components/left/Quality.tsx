import React from "react";

type QualityProps = {
    quality: number;
    onQualityChange: (quality: number) => void;
};

const Quality: React.FC<QualityProps> = ({ quality, onQualityChange }) => {
    const getQualityDescription = (q: number): string => {
        if (q <= 30) return "Compression élevée - Taille réduite";
        if (q <= 70) return "Compression moyenne - Bon équilibre";
        return "Compression faible - Qualité élevée";
    };

    const getQualityColor = (q: number): string => {
        if (q <= 30) return "#ff3b3b";
        if (q <= 70) return "#00A6A6";
        return "#7cfc00";
    };

    return (
        <div className="quality">
            <h2>Qualité de compression</h2>
            <div className="quality__controls">
                <div className="slider-container">
                    <input
                        type="range"
                        min="1"
                        max="100"
                        value={quality}
                        onChange={(e) =>
                            onQualityChange(parseInt(e.target.value))
                        }
                        className="quality-slider"
                    />
                </div>
                <div className="quality-display">
                    <span
                        className="quality-value"
                        style={{ color: getQualityColor(quality) }}>
                        {quality}%
                    </span>
                </div>
            </div>
            <div
                className="quality-description"
                style={{ color: getQualityColor(quality) }}>
                {getQualityDescription(quality)}
            </div>
        </div>
    );
};

export default Quality;
