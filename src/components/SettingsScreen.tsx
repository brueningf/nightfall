import React, { useState } from 'react';
import { audioController } from '../engine/audio';

interface SettingsScreenProps {
    onBack: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ onBack }) => {
    const [volume, setVolume] = useState(audioController.volume);
    const [music, setMusic] = useState(audioController.musicEnabled);
    const [sfx, setSfx] = useState(audioController.sfxEnabled);

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
                        onChange={(e) => {
                            const val = parseInt(e.target.value);
                            setVolume(val);
                            audioController.setVolume(val);
                        }}
                        style={{ width: '100%', marginTop: '10px' }}
                    />
                </div>

                <div className="settings-row" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                    <input
                        type="checkbox"
                        checked={music}
                        onChange={(e) => {
                            setMusic(e.target.checked);
                            audioController.setMusicEnabled(e.target.checked);
                        }}
                        id="check-music"
                    />
                    <label htmlFor="check-music">Music</label>
                </div>

                <div className="settings-row" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input
                        type="checkbox"
                        checked={sfx}
                        onChange={(e) => {
                            setSfx(e.target.checked);
                            audioController.setSfxEnabled(e.target.checked);
                        }}
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
