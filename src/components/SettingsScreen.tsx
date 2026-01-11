import React, { useState } from 'react';

interface SettingsScreenProps {
    onBack: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ onBack }) => {
    const [volume, setVolume] = useState(50);
    const [music, setMusic] = useState(true);
    const [sfx, setSfx] = useState(true);

    return (
        <div className="info-screen"> {/* Reusing info screen styles */}
            <header className="info-header">
                <h2>SETTINGS</h2>
                <button className="close-btn" onClick={onBack}>✖</button>
            </header>

            <div className="info-content">
                <div className="settings-row" style={{ marginBottom: '20px' }}>
                    <label>Master Volume: {volume}%</label>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={volume}
                        onChange={(e) => setVolume(parseInt(e.target.value))}
                        style={{ width: '100%', marginTop: '10px' }}
                    />
                </div>

                <div className="settings-row" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                    <input
                        type="checkbox"
                        checked={music}
                        onChange={(e) => setMusic(e.target.checked)}
                        id="check-music"
                    />
                    <label htmlFor="check-music">Music</label>
                </div>

                <div className="settings-row" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input
                        type="checkbox"
                        checked={sfx}
                        onChange={(e) => setSfx(e.target.checked)}
                        id="check-sfx"
                    />
                    <label htmlFor="check-sfx">Sound Effects</label>
                </div>

                <p style={{ marginTop: '40px', color: '#666', fontSize: '0.8rem' }}>
                    Note: Audio engine is currently experimental.
                </p>
            </div>
        </div>
    );
};
