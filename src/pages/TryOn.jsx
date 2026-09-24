import React, { useState, useEffect } from 'react';
import SnapARFilter from '../components/SnapARFilter';
import ARFilter from '../components/ARFilter';

const LENSES = [
    {
        id: 'natural',
        name: 'Natural',
        lensId: import.meta.env.VITE_SNAP_LENS_NATURAL || 'default-natural-id',
        description: 'Soft, natural lashes'
    },
    {
        id: 'cateye',
        name: 'Cat Eye',
        lensId: import.meta.env.VITE_SNAP_LENS_CATEYE || 'default-cateye-id',
        description: 'Winged, dramatic look'
    },
    {
        id: 'dramatic',
        name: 'Dramatic',
        lensId: import.meta.env.VITE_SNAP_LENS_DRAMATIC || 'default-dramatic-id',
        description: 'Bold, voluminous lashes'
    }
];

const TryOn = () => {
    const [currentLens, setCurrentLens] = useState(LENSES[0].lensId);

    // UI States - Default to mediapipe if storage is empty to prevent crashes
    const [arMode, setArMode] = useState(() => localStorage.getItem('vylash_ar_mode') || 'mediapipe');

    // Cycle through lenses for "Lash Map" button
    const handleLashMapClick = () => {
        const currentIndex = LENSES.findIndex(l => l.lensId === currentLens);
        const nextIndex = (currentIndex + 1) % LENSES.length;
        setCurrentLens(LENSES[nextIndex].lensId);
    };

    const currentLensObj = LENSES.find(l => l.lensId === currentLens) || LENSES[0];

    const handleModeChange = (mode) => {
        setArMode(mode);
        localStorage.setItem('vylash_ar_mode', mode);
    };

    return (
        <div className="try-on-page">
            <div className="try-on-container">
                {/* AR Filter Area */}
                <div className="ar-wrapper">
                    {arMode === 'snap' ? (
                        <SnapARFilter lensId={currentLens} />
                    ) : (
                        <ARFilter currentStyle={currentLensObj.id} />
                    )}
                </div>

                {/* Mode Switcher - Top Right */}
                <div style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 30 }}>
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
                    <div className="control-group left" style={{ margin: '0 auto' }}>
                        <div className="style-name">{currentLensObj.name}</div>
                        <button className="control-btn glass-circle" onClick={handleLashMapClick}>
                            <span className="icon">👁️</span>
                            <span className="label">Lash Map</span>
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
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    background: #000;
                    overflow: hidden;
                    margin: 0;
                    padding: 0;
                    z-index: 1000;
                }

                .try-on-container {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    margin: 0;
                    border-radius: 0;
                    overflow: hidden;
                    box-shadow: none;
                }

                .ar-wrapper {
                    width: 100%;
                    height: 100%;
                    background: #111;
                    position: absolute;
                    top: 0;
                    left: 0;
                }

                .ar-wrapper video,
                .ar-wrapper canvas {
                    width: 100% !important;
                    height: 100% !important;
                    object-fit: cover !important;
                }

                /* Floating Controls */
                .floating-controls {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    padding: 20px 30px 40px;
                    display: flex;
                    justify-content: center;
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

                .style-name {
                    color: #d4af37;
                    text-shadow: 0 1px 3px rgba(0,0,0,0.8);
                    font-size: 1rem;
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
