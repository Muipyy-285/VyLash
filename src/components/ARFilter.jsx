import React, { useEffect, useRef, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import { FaceMesh } from '@mediapipe/face_mesh';
import { Camera } from '@mediapipe/camera_utils';
import { drawLashes, drawLandmarks } from '../utils/arUtils';

// Import all styles
import lashNatural from '../assets/eyelash_natural.png';
import lashCatEye from '../assets/eyelash_cateye_v2.png';
import lashDramatic from '../assets/eyelash_dramatic.png';
import lashCustom from '../assets/eyelash_custom.png';

const stylesMap = {
    'natural': lashNatural,
    'cateye': lashCatEye,
    'dramatic': lashDramatic,
    'custom': lashCustom
};

const ARFilter = ({ currentStyle = 'natural', showDebug = false }) => {
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);
    const [isArReady, setIsArReady] = useState(false);
    const [cameraError, setCameraError] = useState(null);
    const faceMeshRef = useRef(null);
    const cameraRef = useRef(null);
    const [lashImage, setLashImage] = useState(null);

    // Load Image Asset when style changes
    useEffect(() => {
        const img = new Image();
        // Add timestamp to force cache refresh - Bumped for Single Image Fix
        const src = stylesMap[currentStyle] || stylesMap['natural'];
        img.src = `${src}?v=${Date.now() + 1}`;
        img.onload = () => setLashImage(img);
        img.onerror = () => console.error("Failed to load eyelash texture");
    }, [currentStyle]);

    // Use a ref for the image to access in the callback independently of the closure
    const lashImageRef = useRef(null);
    const settingsRef = useRef({ showDebug });

    useEffect(() => {
        lashImageRef.current = lashImage;
    }, [lashImage]);

    useEffect(() => {
        settingsRef.current = { showDebug };
    }, [showDebug]);

    const handleResults = useCallback((results) => {
        if (!webcamRef.current || !webcamRef.current.video || !canvasRef.current) return;

        const videoWidth = webcamRef.current.video.videoWidth;
        const videoHeight = webcamRef.current.video.videoHeight;

        // Prevent layout thrashing if size hasn't changed
        if (canvasRef.current.width !== videoWidth || canvasRef.current.height !== videoHeight) {
            canvasRef.current.width = videoWidth;
            canvasRef.current.height = videoHeight;
        }

        const ctx = canvasRef.current.getContext("2d");
        ctx.save();
        ctx.clearRect(0, 0, videoWidth, videoHeight);

        try {
            if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
                // AR is working if we have results
                if (!isArReady) setIsArReady(true);

                if (lashImageRef.current) {
                    for (const landmarks of results.multiFaceLandmarks) {
                        drawLashes(ctx, landmarks, lashImageRef.current);
                        if (settingsRef.current.showDebug) {
                            drawLandmarks(ctx, landmarks);
                        }
                    }
                }
            } else {
                // Even if no face detected, we received a frame, so AR pipeline is arguably "ready" or at least running.
                // But maybe we want to wait for first face? Let's say we are ready once we get ANY result back.
                if (!isArReady) setIsArReady(true);
            }
        } catch (error) {
            console.error("Error drawing lashes:", error);
        }

        ctx.restore();
    }, [isArReady]);

    // Initialize FaceMesh
    useEffect(() => {
        const faceMesh = new FaceMesh({
            locateFile: (file) => {
                return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
            }
        });

        faceMesh.setOptions({
            maxNumFaces: 1,
            refineLandmarks: true,
            minDetectionConfidence: 0.65,
            minTrackingConfidence: 0.65
        });

        // We assign the callback ONCE. The callback itself uses refs to stay fresh.
        // However, handleResults depends on isArReady state to avoid setting it repeatedly.
        // But FaceMesh.onResults doesn't support changing listeners easily without re-init often?
        // Actually, it's just a method call. We can update it.
        faceMesh.onResults(handleResults);
        faceMeshRef.current = faceMesh;

        return () => {
            // Cleanup if needed
            faceMeshRef.current = null;
        };
    }, [handleResults]); // Re-bind if handleResults changes



    const onUserMedia = () => {
        console.log("Webcam started, initializing AR...");

        if (webcamRef.current && webcamRef.current.video && faceMeshRef.current) {
            const camera = new Camera(webcamRef.current.video, {
                onFrame: async () => {
                    if (webcamRef.current && webcamRef.current.video) {
                        await faceMeshRef.current.send({ image: webcamRef.current.video });
                    }
                },
                width: 1280,
                height: 720
            });
            camera.start();
            cameraRef.current = camera;
        }
    };

    return (
        <div className="ar-container">
            {!isArReady && <div className="loading-overlay">
                {cameraError ? `Error: ${cameraError}` : "Initializing AR..."}
            </div>}

            <Webcam
                ref={webcamRef}
                className="ar-webcam"
                mirrored={true}
                onUserMedia={onUserMedia}
                onUserMediaError={(err) => setCameraError(err.message || "Camera access denied")}
                style={{
                    width: "100%",
                    height: "auto",
                    position: "absolute",
                    left: 0,
                    top: 0
                }}
            />

            <canvas
                ref={canvasRef}
                className="ar-canvas"
                style={{
                    width: "100%",
                    height: "auto",
                    position: "absolute",
                    left: 0,
                    top: 0,
                    transform: "scaleX(-1)", // Mirror canvas to match mirrored webcam
                    mixBlendMode: "multiply", // Makes white background transparent
                    filter: "contrast(1.2) brightness(1.1)" // Clean up off-white artifacts
                }}
            />

            <style>{`
        .ar-container {
            position: relative;
            width: 100%;
            max-width: 800px;
            margin: 0 auto;
            border-radius: var(--radius-md);
            overflow: hidden;
            aspect-ratio: 16/9;
            background: #000;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        }
        .loading-overlay {
            position: absolute;
            inset: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(0,0,0,0.8);
            color: var(--color-gold);
            z-index: 10;
        }
      `}</style>
        </div>
    );
};

export default ARFilter;
