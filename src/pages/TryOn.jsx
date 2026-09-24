import React, { useState, useEffect } from 'react';
import SnapARFilter from '../components/SnapARFilter';
import ARFilter from '../components/ARFilter';

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

    // UI States
    const [arMode, setArMode] = useState(() => localStorage.getItem('vylash_ar_mode') || 'mediapipe');
    const [lashColor, setLashColor] = useState('black');
    const [lashLength, setLashLength] = useState('medium');

    // Cycle through lenses for "Lash Map" button
    const handleLashMapClick = () => {
        const currentIndex = LENSES.findIndex(l => l.lensId === currentLens);
        const nextIndex = (currentIndex + 1) % LENSES.length;
        setCurrentLens(LENSES[nextIndex].lensId);
    };

    const currentLensObj = LENSES.find(l => l.lensId === currentLens) || LENSES[0];

    const handleModeChange = (mode) => {
        setArMode(mode);
    };

    return (
        <div className="try-on-page">
            <div className="try-on-container">
                {/* Text Overlay - Top Left */}
                <div className="overlay-text top-left">
                    <div className="lengths-label">Lengths Included</div>
                    <div className="lengths-value">{lashLength === 'short' ? '8-8-10-10-12-10mm' : lashLength === 'medium' ? '10-10-12-12-14-12mm' : '12-12-14-14-16-14mm'}</div>
                </div>

                {/* AR Filter Area */}
                <div className="ar-wrapper">
                    {arMode === 'snap' ? (
                        <SnapARFilter lensId={currentLens} />
                    ) : (
                        <ARFilter currentStyle={currentLensObj.id} />
                    )}
                </div>

                {/* Mode Switcher - Top Right or integrated nicely */}
                <div style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 30 }}>
                    {/* Simplified switcher just for toggle, or we can use the full component below if preferred. 
                         Let's put the full component momentarily visible or just small toggles? 
                         Actually, the user might want it more accessible. Let's put it above controls? 
                         For now, let's keep it simple. */}
                    <button
                        onClick={() => handleModeChange(arMode === 'snap' ? 'mediapipe' : 'snap')}
                        className="glass-pill"
                        style={{ background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.3)', color: 'white' }}
                    >
                        {arMode === 'snap' ? '👻 Snap AR' : '✨ Custom AR'}
                    </button>
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

                    {/* Center: Color */}
                    <div className="control-group center">
                        <div className="control-label">Color</div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                                className={`control-btn glass-pill ${lashColor === 'black' ? 'active' : ''}`}
                                onClick={() => setLashColor('black')}
                                style={{ minWidth: 'auto', padding: '8px 16px' }}
                            >
                                <span className="color-dot black"></span>
                            </button>
                            <button
                                className={`control-btn glass-pill ${lashColor === 'brown' ? 'active' : ''}`}
                                onClick={() => setLashColor('brown')}
                                style={{ minWidth: 'auto', padding: '8px 16px' }}
                            >
                                <span className="color-dot brown" style={{ background: '#5D4037' }}></span>
                            </button>
                        </div>
                    </div>

                    {/* Right: Length */}
                    <div className="control-group right">
                        <div className="control-label">Length</div>
                        <button
                            className="control-btn glass-pill"
                            onClick={() => setLashLength(prev => prev === 'short' ? 'medium' : prev === 'medium' ? 'long' : 'short')}
                        >
                            <span>{lashLength === 'short' ? 'S' : lashLength === 'medium' ? 'M' : 'L'}</span>
                        </button>
                    </div>
                </div>

                {/* Powered By */}
                <div className="powered-by">
                    <small>Powered by {arMode === 'snap' ? 'Snap AR' : 'MediaPipe'}</small>
                </div>
            </div>

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
                    background: #111; /* Placeholder bg */
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
                    background: linear-gradient(to top, rgba(0,0,0,0.9), transparent);
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
                    min-width: 60px;
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
            `}</style>
        </div>
    );
};

export default TryOn;


