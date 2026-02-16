import React, { useState } from 'react';
import SnapARFilter from '../components/SnapARFilter';

const LENSES = [
    {
        id: 'natural',
        name: 'Natural',
        lensId: import.meta.env.VITE_SNAP_LENS_NATURAL,
        description: 'Soft, natural lashes'
    },
    {
        id: 'cateye',
        name: 'Cat Eye',
        lensId: import.meta.env.VITE_SNAP_LENS_CATEYE,
        description: 'Winged, dramatic look'
    },
    {
        id: 'dramatic',
        name: 'Dramatic',
        lensId: import.meta.env.VITE_SNAP_LENS_DRAMATIC,
        description: 'Bold, voluminous lashes'
    }
];

const TryOn = () => {
    const [currentLens, setCurrentLens] = useState(LENSES[0].lensId);

    // Cycle through lenses for "Lash Map" button
    const handleLashMapClick = () => {
        const currentIndex = LENSES.findIndex(l => l.lensId === currentLens);
        const nextIndex = (currentIndex + 1) % LENSES.length;
        setCurrentLens(LENSES[nextIndex].lensId);
    };

    const currentLensObj = LENSES.find(l => l.lensId === currentLens) || LENSES[0];

    return (
        <div className="try-on-page">
            <div className="try-on-container">
                {/* Text Overlay - Top Left */}
                <div className="overlay-text top-left">
                    <div className="lengths-label">Lengths Included</div>
                    <div className="lengths-value">10-10-12-12-14-12mm</div>
                </div>

                {/* Snap AR Filter */}
                <div className="ar-wrapper">
                    <SnapARFilter lensId={currentLens} />
                </div>

                {/* Floating Controls - Bottom */}
                <div className="floating-controls">
                    {/* Left: Lash Map (Style Switcher) */}
                    <div className="control-group left">
                        <div className="style-name">{currentLensObj.name}</div>
                        <button className="control-btn glass-circle" onClick={handleLashMapClick}>
                            <span className="icon">👁️</span>
                            <span className="label">Lash Map</span>
                        </button>
                    </div>

                    {/* Center: Color (Placeholder) */}
                    <div className="control-group center">
                        <div className="control-label">Color</div>
                        <button className="control-btn glass-pill active">
                            <span className="color-dot black"></span>
                            <span>Black</span>
                        </button>
                    </div>

                    {/* Right: Length (Placeholder) */}
                    <div className="control-group right">
                        <div className="control-label">Length</div>
                        <button className="control-btn glass-pill">
                            <span>+ Medium</span>
                        </button>
                    </div>
                </div>

                {/* Powered By */}
                <div className="powered-by">
                    <small>Powered by Snap AR</small>
                </div>
            </div>

            {/* Debug Toggle - Discrete */}


            <style>{`
                .try-on-page {
                    min-height: 100vh;
                    background: #000;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 20px;
                }

                .try-on-container {
                    position: relative;
                    width: 100%;
                    max-width: 800px;
                    aspect-ratio: 9/16; /* Mobile portrait aspect ratio preference, or 16/9 if landscape */
                    /* Use max-height to fit screen */
                    max-height: 90vh;
                    margin: 0 auto;
                    border-radius: 20px;
                    overflow: hidden;
                    box-shadow: 0 0 50px rgba(0,0,0,0.5);
                }

                @media (min-width: 768px) {
                    .try-on-container {
                        aspect-ratio: 16/9; /* Desktop landscape */
                    }
                }

                .ar-wrapper {
                    width: 100%;
                    height: 100%;
                }

                /* Overlays */
                .overlay-text {
                    position: absolute;
                    z-index: 10;
                    color: rgba(255, 255, 255, 0.9);
                    text-shadow: 0 2px 4px rgba(0,0,0,0.8);
                    pointer-events: none;
                }

                .top-left {
                    top: 20px;
                    left: 20px;
                    text-align: left;
                }

                .lengths-label {
                    font-size: 0.85rem;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    opacity: 0.8;
                    margin-bottom: 4px;
                }

                .lengths-value {
                    font-size: 1.1rem;
                    font-weight: 600;
                }

                /* Floating Controls */
                .floating-controls {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    padding: 20px 30px 40px;
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-end;
                    z-index: 20;
                    background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
                }

                .control-group {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 8px;
                }

                .control-label, .style-name {
                    color: white;
                    text-shadow: 0 1px 3px rgba(0,0,0,0.8);
                    font-size: 0.9rem;
                    font-weight: 500;
                }

                .style-name {
                    color: var(--color-gold);
                    font-weight: 600;
                    letter-spacing: 0.5px;
                }

                .control-btn {
                    background: rgba(255, 255, 255, 0.15);
                    backdrop-filter: blur(10px);
                    -webkit-backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.3);
                    color: white;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }

                .control-btn:hover {
                    background: rgba(255, 255, 255, 0.25);
                    transform: translateY(-2px);
                }

                .control-btn:active {
                    transform: translateY(0);
                }

                .glass-circle {
                    width: 70px;
                    height: 70px;
                    border-radius: 50%;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 4px;
                }

                .glass-circle .icon {
                    font-size: 1.5rem;
                }

                .glass-circle .label {
                    font-size: 0.65rem;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .glass-pill {
                    padding: 10px 20px;
                    border-radius: 30px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    min-width: 100px;
                    justify-content: center;
                    font-size: 0.9rem;
                }

                .glass-pill.active {
                    background: rgba(255, 255, 255, 0.9);
                    color: black;
                    border-color: white;
                }

                .color-dot {
                    width: 12px;
                    height: 12px;
                    border-radius: 50%;
                    border: 1px solid rgba(0,0,0,0.2);
                }

                .color-dot.black { background: #000; }

                .powered-by {
                    position: absolute;
                    bottom: 10px;
                    left: 20px;
                    color: rgba(255,255,255,0.4);
                    font-size: 0.7rem;
                    z-index: 10;
                }

                .debug-toggle-container {
                    margin-top: 1rem;
                }

                .debug-btn {
                    background: transparent;
                    border: 1px solid #333;
                    color: #555;
                    padding: 5px 10px;
                    border-radius: 4px;
                    cursor: pointer;
                }
            `}</style>
        </div>
    );
};

export default TryOn;


