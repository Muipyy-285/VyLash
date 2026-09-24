import React from 'react';

/**
 * ARModeSwitcher Component
 * 
 * UI control for switching between MediaPipe and Snap Camera Kit AR modes.
 * Persists user preference to localStorage.
 */
const ARModeSwitcher = ({ currentMode, onModeChange }) => {
    const modes = [
        {
            id: 'mediapipe',
            name: 'Custom AR',
            icon: '🎨',
            description: 'MediaPipe with custom controls'
        },
        {
            id: 'snap',
            name: 'Snap AR',
            icon: '👻',
            description: 'Powered by Snap Camera Kit'
        }
    ];

    const handleModeChange = (modeId) => {
        onModeChange(modeId);
        // Persist preference
        localStorage.setItem('vylash_ar_mode', modeId);
    };

    return (
        <div className="ar-mode-switcher">
            <p className="switcher-label">AR Mode:</p>
            <div className="mode-buttons">
                {modes.map((mode) => (
                    <button
                        key={mode.id}
                        className={currentMode === mode.id ? 'mode-btn active' : 'mode-btn'}
                        onClick={() => handleModeChange(mode.id)}
                        aria-pressed={currentMode === mode.id}
                    >
                        <span className="mode-icon">{mode.icon}</span>
                        <span className="mode-name">{mode.name}</span>
                        <span className="mode-desc">{mode.description}</span>
                    </button>
                ))}
            </div>

            <style>{`
                .ar-mode-switcher {
                    text-align: center;
                    margin-bottom: 2rem;
                    padding: 1.5rem;
                    background: linear-gradient(135deg, rgba(255, 215, 0, 0.05), rgba(255, 192, 203, 0.05));
                    border-radius: var(--radius-md);
                    border: 1px solid var(--glass-border);
                }

                .switcher-label {
                    font-size: 0.9rem;
                    color: var(--text-muted);
                    margin-bottom: 1rem;
                    font-weight: 500;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }

                .mode-buttons {
                    display: flex;
                    gap: 1rem;
                    justify-content: center;
                    flex-wrap: wrap;
                }

                .mode-btn {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 1.25rem 2rem;
                    background: rgba(255, 255, 255, 0.05);
                    border: 2px solid var(--glass-border);
                    border-radius: var(--radius-md);
                    cursor: pointer;
                    transition: all 0.3s ease;
                    min-width: 180px;
                    position: relative;
                    overflow: hidden;
                }

                .mode-btn::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
                    transition: left 0.5s ease;
                }

                .mode-btn:hover::before {
                    left: 100%;
                }

                .mode-btn:hover {
                    border-color: var(--color-gold);
                    transform: translateY(-2px);
                    box-shadow: 0 5px 20px rgba(255, 215, 0, 0.2);
                }

                .mode-btn.active {
                    background: linear-gradient(135deg, var(--color-gold), var(--color-pink));
                    border-color: var(--color-gold);
                    box-shadow: 0 8px 25px rgba(255, 215, 0, 0.4);
                }

                .mode-btn.active .mode-name,
                .mode-btn.active .mode-desc {
                    color: var(--color-black);
                }

                .mode-icon {
                    font-size: 2rem;
                    line-height: 1;
                }

                .mode-name {
                    font-weight: 600;
                    font-size: 1rem;
                    color: var(--text-main);
                    transition: color 0.3s ease;
                }

                .mode-desc {
                    font-size: 0.75rem;
                    color: var(--text-muted);
                    transition: color 0.3s ease;
                }

                @media (max-width: 600px) {
                    .mode-buttons {
                        flex-direction: column;
                    }

                    .mode-btn {
                        width: 100%;
                        min-width: unset;
                    }
                }
            `}</style>
        </div>
    );
};

export default ARModeSwitcher;
