import React, { useState } from 'react';
import { hasSaveGame } from '../engine/persistence';
import type { Difficulty } from '../engine/types';
import { Icon } from '@iconify/react';
import { audioController } from '../engine/audio';

interface MainMenuProps {
    onNewGame: (difficulty: Difficulty) => void;
    onContinue: () => void;
    onOpenInfo: () => void;
    onOpenSettings: () => void;
    onOpenScores: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({ onNewGame, onContinue, onOpenInfo, onOpenSettings, onOpenScores }) => {
    const canContinue = hasSaveGame();
    const [selectedDiff, setSelectedDiff] = useState<Difficulty>('VETERAN');

    return (
        <div className="main-menu" style={{
            backgroundImage: `url(/scene_intro.png)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            textShadow: '0 2px 4px black'
        }}>
            <div className="overlay" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.6)', zIndex: 0 }}></div>
            <div className="title-area" style={{ position: 'relative', zIndex: 1 }}>
                <h1 className="game-title">NIGHTFALL</h1>
                <p className="subtitle">The Darkness Comes For All</p>
            </div>

            <div className="menu-options" style={{ position: 'relative', zIndex: 2 }}>
                {canContinue && (
                    <button className="menu-btn continue" onClick={() => {
                        audioController.playClick();
                        onContinue();
                    }}>
                        <span><Icon icon="game-icons:play-button" /></span> RESUME CYCLE
                    </button>
                )}

                <div className="difficulty-selector" style={{ margin: '15px 0', background: 'rgba(0,0,0,0.5)', padding: '10px', borderRadius: '8px' }}>
                    <div style={{ color: '#888', fontSize: '0.8rem', marginBottom: '8px' }}>SELECT PROTOCOL LEVEL</div>
                    <div style={{ display: 'flex', gap: '5px' }}>
                        {['RECRUIT', 'VETERAN', 'COMMANDER', 'LEGEND'].map(diff => (
                            <button
                                key={diff}
                                className={`diff-btn ${selectedDiff === diff ? 'active' : ''}`}
                                onClick={() => setSelectedDiff(diff as Difficulty)}
                                style={{
                                    flex: 1,
                                    padding: '5px',
                                    fontSize: '0.7rem',
                                    background: selectedDiff === diff ? 'var(--color-primary)' : '#222',
                                    color: selectedDiff === diff ? '#000' : '#888',
                                    border: '1px solid #444',
                                    cursor: 'pointer'
                                }}
                            >
                                {diff}
                            </button>
                        ))}
                    </div>
                </div>

                <button className="menu-btn start" onClick={() => {
                    audioController.playClick();
                    onNewGame(selectedDiff);
                }}>
                    <span><Icon icon="game-icons:rocket" /></span> INITIALIZE NEW COLONY
                </button>

                <button className="menu-btn info" onClick={() => { audioController.playClick(); onOpenInfo(); }}>
                    <span><Icon icon="game-icons:info" /></span> DATA ARCHIVES
                </button>

                <button className="menu-btn scores" onClick={() => { audioController.playClick(); onOpenScores(); }}>
                    <span><Icon icon="game-icons:trophy" /></span> HALL OF FAME
                </button>

                <button className="menu-btn settings" onClick={() => { audioController.playClick(); onOpenSettings(); }}>
                    <span><Icon icon="game-icons:gears" /></span> SYSTEM CONFIG
                </button>
            </div>

            <div className="version-tag">v0.5 Alpha</div>
        </div>
    );
};
