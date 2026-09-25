import React, { useEffect, useRef, useState } from 'react';
import { bootstrapCameraKit, createMediaStreamSource } from '@snap/camera-kit';
import snapConfig from '../utils/snapConfig';

/**
 * SnapARFilter Component
 * 
 * Integrates Snap Camera Kit for professional AR effects.
 * Uses Snap's Lens Studio lenses for eyelash try-on.
 * Supports real-time lens switching.
 */
const SnapARFilter = ({ lensId, showDebug = false }) => {
    const canvasRef = useRef(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isArReady, setIsArReady] = useState(false);
    const sessionRef = useRef(null);
    const cameraKitRef = useRef(null);

    useEffect(() => {
        let mounted = true;
        let mediaStream = null;

        const initializeSnapAR = async () => {
            try {
                // Validate configuration
                if (!snapConfig.isConfigured()) {
                    const errors = snapConfig.getConfigErrors();
                    throw new Error(`Snap Camera Kit not configured:\n${errors.join('\n')}`);
                }

                setIsLoading(true);
                setError(null);

                // 1. Bootstrap Camera Kit
                const cameraKit = await bootstrapCameraKit({
                    apiToken: snapConfig.apiToken
                });

                if (!mounted) return;
                cameraKitRef.current = cameraKit;

                // 2. Initialize canvas dimensions to fill full screen
                const updateCanvasDimensions = () => {
                    if (!canvasRef.current) return { width: 800, height: 600 };
                    const w = window.innerWidth || document.documentElement.clientWidth || 800;
                    const h = window.innerHeight || document.documentElement.clientHeight || 600;
                    canvasRef.current.width = w;
                    canvasRef.current.height = h;
                    return { width: w, height: h };
                };

                const initialDims = updateCanvasDimensions();

                // 3. Create AR Session
                const session = await cameraKit.createSession({
                    liveRenderTarget: canvasRef.current
                });

                if (!mounted) return;
                sessionRef.current = session;

                // 4. Get camera access with portrait/landscape awareness
                const isPortrait = window.innerHeight > window.innerWidth;
                mediaStream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        facingMode: 'user',
                        width: { ideal: isPortrait ? 1080 : 1920 },
                        height: { ideal: isPortrait ? 1920 : 1080 }
                    }
                });

                if (!mounted) {
                    mediaStream.getTracks().forEach(track => track.stop());
                    return;
                }

                // 5. Attach video source
                const source = createMediaStreamSource(mediaStream, {
                    cameraType: 'front'
                });

                await session.setSource(source);

                // 6. Start rendering with exact full screen dimensions
                await source.setRenderSize(initialDims.width, initialDims.height);
                await session.play();

                // Handle window resize dynamically
                const handleResize = async () => {
                    if (!sessionRef.current || !source || !canvasRef.current) return;
                    const newDims = updateCanvasDimensions();
                    try {
                        await source.setRenderSize(newDims.width, newDims.height);
                    } catch (e) {
                        console.warn('Resize render size update failed:', e);
                    }
                };

                window.addEventListener('resize', handleResize);

                // 7. Load and apply initial lens
                if (lensId) {
                    const lens = await cameraKit.lensRepository.loadLens(
                        lensId,
                        snapConfig.groupId
                    );

                    if (!mounted) return;

                    await session.applyLens(lens);
                }

                if (!mounted) return;

                setIsArReady(true);
                setIsLoading(false);

                if (showDebug) {
                    console.log('✅ Snap Camera Kit initialized successfully');
                    console.log('Initial Lens ID:', lensId);
                }

            } catch (err) {
                console.error('Snap Camera Kit Error:', err);
                if (mounted) {
                    setError(err.message || 'Failed to initialize Snap AR');
                    setIsLoading(false);
                }
            }
        };

        initializeSnapAR();

        // Cleanup
        return () => {
            mounted = false;

            if (mediaStream) {
                mediaStream.getTracks().forEach(track => track.stop());
            }

            if (sessionRef.current) {
                sessionRef.current.pause();
                sessionRef.current = null;
            }

            cameraKitRef.current = null;
        };
    }, [showDebug]);

    // NEW: Watch for lens changes and switch lens in real-time
    useEffect(() => {
        if (!sessionRef.current || !cameraKitRef.current || !lensId) return;

        const switchLens = async () => {
            try {
                if (showDebug) {
                    console.log('🔄 Switching to lens:', lensId);
                }

                const lens = await cameraKitRef.current.lensRepository.loadLens(
                    lensId,
                    snapConfig.groupId
                );
                await sessionRef.current.applyLens(lens);

                if (showDebug) {
                    console.log('✅ Lens switched successfully');
                }
            } catch (err) {
                console.error('❌ Failed to switch lens:', err);
                setError(`Failed to load lens: ${err.message}`);
            }
        };

        switchLens();
    }, [lensId, showDebug]); // Re-run when lensId changes

    return (
        <div className="ar-container">
            {/* Loading Overlay */}
            {isLoading && (
                <div className="loading-overlay">
                    <div className="loading-content">
                        <div className="spinner"></div>
                        <p>Initializing Snap AR...</p>
                    </div>
                </div>
            )}

            {/* Error Display */}
            {error && (
                <div className="error-overlay">
                    <div className="error-content">
                        <h3>⚠️ Snap AR Error</h3>
                        <p>{error}</p>
                        <div className="error-help">
                            <p>Please check:</p>
                            <ul>
                                <li>Your API token is set in <code>.env</code></li>
                                <li>Your Lens ID is correct</li>
                                <li>You have camera permissions</li>
                                <li>You have internet connection</li>
                            </ul>
                            <p style={{ marginTop: '1rem', fontSize: '0.9rem', opacity: 0.8 }}>
                                See <code>snap-setup.md</code> for setup instructions
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* AR Canvas */}
            <canvas
                ref={canvasRef}
                className="snap-ar-canvas"
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: error ? 'none' : 'block',
                    opacity: isArReady ? 1 : 0.5,
                    transition: 'opacity 0.3s ease'
                }}
            />

            {/* Debug Info */}
            {showDebug && isArReady && (
                <div className="debug-info">
                    <p>✅ Snap AR Active</p>
                    <p>Lens: {snapConfig.lensId.substring(0, 8)}...</p>
                </div>
            )}

            <style>{`
                .ar-container {
                    position: absolute;
                    inset: 0;
                    width: 100%;
                    height: 100%;
                    background: #000;
                    overflow: hidden;
                }

                .snap-ar-canvas {
                    position: absolute;
                    inset: 0;
                    width: 100% !important;
                    height: 100% !important;
                    object-fit: cover;
                    transform: scaleX(-1); /* Mirror for selfie view */
                }

                .loading-overlay,
                .error-overlay {
                    position: absolute;
                    inset: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: rgba(0,0,0,0.9);
                    z-index: 10;
                    padding: 2rem;
                }

                .loading-content,
                .error-content {
                    text-align: center;
                    color: var(--color-gold);
                }

                .spinner {
                    width: 40px;
                    height: 40px;
                    margin: 0 auto 1rem;
                    border: 3px solid rgba(255, 215, 0, 0.3);
                    border-top-color: var(--color-gold);
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }

                @keyframes spin {
                    to { transform: rotate(360deg); }
                }

                .error-content h3 {
                    color: #ff6b6b;
                    margin-bottom: 1rem;
                }

                .error-content p {
                    margin-bottom: 1rem;
                    color: #fff;
                }

                .error-help {
                    background: rgba(255, 255, 255, 0.05);
                    padding: 1rem;
                    border-radius: 8px;
                    text-align: left;
                    margin-top: 1rem;
                }

                .error-help ul {
                    margin: 0.5rem 0;
                    padding-left: 1.5rem;
                    color: #aaa;
                }

                .error-help li {
                    margin: 0.3rem 0;
                }

                .error-help code {
                    background: rgba(255, 255, 255, 0.1);
                    padding: 0.2rem 0.4rem;
                    border-radius: 4px;
                    font-family: monospace;
                    color: var(--color-gold);
                }

                .debug-info {
                    position: absolute;
                    top: 10px;
                    left: 10px;
                    background: rgba(0, 0, 0, 0.7);
                    color: #0f0;
                    padding: 0.5rem;
                    border-radius: 4px;
                    font-size: 0.8rem;
                    font-family: monospace;
                }

                .debug-info p {
                    margin: 0.2rem 0;
                }
            `}</style>
        </div>
    );
};

export default SnapARFilter;
