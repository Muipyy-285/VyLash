import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
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
    const { cartCount } = useCart();

    const currentLensObj = LENSES.find(l => l.lensId === currentLens) || LENSES[0];

    return (
        <div className="try-on-page">
            <div className="try-on-container">
                {/* Text Overlay - Top Left */}
                <div className="overlay-text top-left">
                    <div className="brand-label">VyLash AR</div>
                    <div className="style-name-badge">{currentLensObj.name} Style</div>
                    <div className="style-desc">{currentLensObj.description}</div>
                </div>

                {/* Navigation - Top Right */}
                <div className="top-nav">
                    <Link to="/" className="nav-btn glass-circle-sm" title="Home">
                        <Home size={20} />
                    </Link>
                    <Link to="/cart" className="nav-btn glass-circle-sm" title="Cart">
                        <ShoppingBag size={20} />
                        {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                    </Link>
                </div>

                {/* AR Filter Area */}
                <div className="ar-wrapper">
                    <SnapARFilter lensId={currentLens} />
                </div>

                {/* Floating Controls - Bottom Style Selector */}
                <div className="floating-controls">
                    <div className="style-selector-box">
                        <div className="selector-title">เลือกแบบขนตา (Select Style)</div>
                        <div className="style-buttons-row">
                            {LENSES.map((lens) => (
                                <button
                                    key={lens.id}
                                    className={`control-btn style-btn ${currentLens === lens.lensId ? 'active' : ''}`}
                                    onClick={() => setCurrentLens(lens.lensId)}
                                >
                                    <span className="style-icon">👁️</span>
                                    <span className="style-label">{lens.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="powered-by">
                    <small>Powered by Snap AR</small>
                </div>
            </div>

            <style>{`
                .try-on-page {
                    height: 100vh;
                    width: 100vw;
                    background: #000;
                    display: flex;
                    overflow: hidden;
                }

                .try-on-container {
                    position: relative;
                    width: 100%;
                    height: 100%;
                    background: #000;
                    overflow: hidden;
                }

                .ar-wrapper {
                    width: 100%;
                    height: 100%;
                    background: #111;
                }

                /* Overlays */
                .overlay-text {
                    position: absolute;
                    z-index: 10;
                    color: rgba(255, 255, 255, 0.9);
                    text-shadow: 0 2px 6px rgba(0, 0, 0, 0.8);
                    pointer-events: none;
                }

                .top-left {
                    top: env(safe-area-inset-top, 30px);
                    left: env(safe-area-inset-left, 30px);
                    text-align: left;
                }

                .brand-label {
                    font-size: 0.8rem;
                    text-transform: uppercase;
                    letter-spacing: 1.5px;
                    color: var(--color-gold, #f59e0b);
                    font-weight: 700;
                    margin-bottom: 2px;
                }

                .style-name-badge {
                    font-size: 1.4rem;
                    font-weight: 700;
                    color: white;
                    letter-spacing: 0.5px;
                }

                .style-desc {
                    font-size: 0.85rem;
                    color: rgba(255, 255, 255, 0.7);
                    margin-top: 2px;
                }

                /* Floating Controls - Lash Style Switcher */
                .floating-controls {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    padding: 20px 20px calc(env(safe-area-inset-bottom, 20px) + 25px);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 20;
                    background: linear-gradient(to top, rgba(0, 0, 0, 0.85), transparent);
                }

                .style-selector-box {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 10px;
                    max-width: 500px;
                    width: 100%;
                }

                .selector-title {
                    color: rgba(255, 255, 255, 0.8);
                    font-size: 0.82rem;
                    letter-spacing: 0.5px;
                    text-transform: uppercase;
                    font-weight: 500;
                }

                .style-buttons-row {
                    display: flex;
                    gap: 12px;
                    justify-content: center;
                    flex-wrap: wrap;
                }

                .control-btn {
                    background: rgba(255, 255, 255, 0.15);
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);
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

                .style-btn {
                    padding: 10px 20px;
                    border-radius: 30px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 0.95rem;
                    font-weight: 600;
                }

                .style-btn.active {
                    background: rgba(255, 255, 255, 0.95);
                    color: #000;
                    border-color: #fff;
                    box-shadow: 0 4px 15px rgba(255, 255, 255, 0.35);
                    transform: scale(1.05);
                }

                .style-icon {
                    font-size: 1.1rem;
                }

                .powered-by {
                    position: absolute;
                    bottom: 10px;
                    left: 20px;
                    color: rgba(255, 255, 255, 0.4);
                    font-size: 0.7rem;
                    z-index: 10;
                }

                /* Top Navigation Overlay */
                .top-nav {
                    position: absolute;
                    top: env(safe-area-inset-top, 20px);
                    right: 20px;
                    display: flex;
                    gap: 12px;
                    z-index: 30;
                }

                .glass-circle-sm {
                    width: 45px;
                    height: 45px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: rgba(255, 255, 255, 0.15);
                    backdrop-filter: blur(10px);
                    -webkit-backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.3);
                    color: white;
                    text-decoration: none;
                    position: relative;
                    transition: all 0.2s ease;
                }

                .glass-circle-sm:hover {
                    background: rgba(255, 255, 255, 0.25);
                    transform: scale(1.05);
                }

                .cart-badge {
                    position: absolute;
                    top: -2px;
                    right: -2px;
                    background: var(--color-gold, #f59e0b);
                    color: black;
                    font-size: 0.7rem;
                    width: 16px;
                    height: 16px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 700;
                    border: 1px solid white;
                    line-height: 1;
                }

                @media (max-width: 480px) {
                    .style-btn {
                        padding: 8px 14px;
                        font-size: 0.85rem;
                    }
                }
            `}</style>
        </div>
    );
};

export default TryOn;
