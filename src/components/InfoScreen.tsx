import React, { useState } from 'react';

interface InfoScreenProps {
    onBack: () => void;
}

export const InfoScreen: React.FC<InfoScreenProps> = ({ onBack }) => {
    const [tab, setTab] = useState<'STORY' | 'RULES'>('STORY');

    return (
        <div className="info-screen">
            <header className="info-header">
                <h2>ARCHIVES</h2>
                <button className="close-btn" onClick={onBack}>✖</button>
            </header>

            <div className="info-tabs">
                <button className={`tab-btn ${tab === 'STORY' ? 'active' : ''}`} onClick={() => setTab('STORY')}>LORE</button>
                <button className={`tab-btn ${tab === 'RULES' ? 'active' : ''}`} onClick={() => setTab('RULES')}>GUIDE</button>
            </div>

            <div className="info-content">
                {tab === 'STORY' ? (
                    <div className="story-text">
                        <img src="/scene_intro.png" alt="Shattered Sun" style={{ width: '100%', borderRadius: '4px', marginBottom: '20px', border: '1px solid #333' }} />
                        <h3>Year 60,057: The Shattered Sun</h3>
                        <p>We survived the climate collapses. We tamed the storms. We thought we were safe.</p>
                        <p>Then, the Sun shattered.</p>
                        <p>A cosmic entity—a Demon of the Void—drank our star’s fire, plunging us into eternal night. Now, five years later, the only illumination comes from "Shard Light," a technology born of desperation, fueled by crystals harvested from the very cracks where the demons rise.</p>
                        <p>The great cities have fallen. Only our subterranean fortress remains.</p>
                        <p>Our Shard stockpiles are depleting. The demons hunger for our light. But there is a whisper of hope. Our scientists speak of "Incendium"—an ancient power that might finally push back the darkness.</p>
                    </div>
                ) : (
                    <div className="rules-text">
                        <h3>Fortress Command Guide</h3>
                        <ul>
                            <li><strong>Food:</strong> Farmers use Shard Light to grow crops. Starvation kills.</li>
                            <li><strong>Defense:</strong> Soldiers defend the gates. Walls take damage first.</li>
                            <li><strong>Miners:</strong> Maintain fortress integrity (Repair) and harvest <strong>Shards</strong>.</li>
                            <li><strong>Scientists:</strong> Generate Knowledge to research technologies.</li>
                            <li><strong>Shards:</strong> Stockpile these to <strong>BANISH</strong> demons or allow Scholars to study them.</li>
                            <li><strong>Stances:</strong>
                                <ul>
                                    <li><em>Standard:</em> Balanced approach.</li>
                                    <li><em>Man the Walls:</em> +50% Defense, -50% Repair.</li>
                                    <li><em>Sally Forth:</em> High Defense/Damage, High Risk of Death.</li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};
