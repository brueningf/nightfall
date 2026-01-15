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
        <div className="h-full w-full bg-[#111] flex flex-col">
            <header className="bg-[#222] p-4 flex justify-between items-center border-b border-[#333] shrink-0">
                <h2 className="text-white m-0 text-xl tracking-widest font-bold">SETTINGS</h2>
                <button className="bg-none border-none text-[#666] text-2xl cursor-pointer hover:text-white transition-colors p-1" onClick={onBack}>✖</button>
            </header>

            <div className="p-5 text-[#ccc] text-sm flex-1">
                <div className="mb-6">
                    <label className="block mb-2 font-bold text-white">Master Volume: {volume}%</label>
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
                        className="w-full accent-primary cursor-pointer"
                    />
                </div>

                <div className="flex items-center gap-3 mb-4">
                    <input
                        type="checkbox"
                        checked={music}
                        onChange={(e) => {
                            setMusic(e.target.checked);
                            audioController.setMusicEnabled(e.target.checked);
                        }}
                        id="check-music"
                        className="accent-primary w-5 h-5 cursor-pointer"
                    />
                    <label htmlFor="check-music" className="cursor-pointer select-none">Music</label>
                </div>

                <div className="flex items-center gap-3 mb-4">
                    <input
                        type="checkbox"
                        checked={sfx}
                        onChange={(e) => {
                            setSfx(e.target.checked);
                            audioController.setSfxEnabled(e.target.checked);
                        }}
                        id="check-sfx"
                        className="accent-primary w-5 h-5 cursor-pointer"
                    />
                    <label htmlFor="check-sfx" className="cursor-pointer select-none">Sound Effects</label>
                </div>

                <p className="mt-10 text-[#666] text-xs italic">
                    Note: Audio engine is currently experimental.
                </p>
            </div>
        </div>
    );
};
