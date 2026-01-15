import React, { useState } from 'react';
import type { GameState, AllocationPolicy, DefenseStance, TechId } from '../engine/types';
import { Allocation } from './Allocation';
import { EventLog } from './EventLog';
import { MapScreen } from './MapScreen';
import { VisualFortress } from './VisualFortress';
import { DefenseControls } from './DefenseControls';
import { ResearchScreen } from './ResearchScreen';
import { Icon } from '@iconify/react';

interface DashboardProps {
    state: GameState;
    onAllocate: (newPolicy: AllocationPolicy) => void;
    onNextTurn: () => void;
    onSetStance: (stance: DefenseStance) => void;
    onResearch: (techId: TechId) => void;
    onIgnite: () => void;
    onBanish: () => void;
    onMenu: () => void;
}


export const Dashboard: React.FC<DashboardProps> = ({ state, onAllocate, onNextTurn, onSetStance, onResearch, onIgnite, onBanish, onMenu }) => {
    const [activeTab, setActiveTab] = useState<'GAME' | 'MAP' | 'LOG' | 'TECH'>('GAME');

    return (
        <div className="dashboard">
            <header className="stats-bar" style={{ padding: '4px 10px', height: '32px', alignItems: 'center' }}>
                <div className="stat-group" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div className="stat" style={{ fontWeight: 'bold' }}>SOL {state.turn}</div>
                    <div className="stat-divider" style={{ width: '1px', height: '14px', background: '#333' }}></div>
                    <div className="stat" style={{ color: 'var(--color-success)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Icon icon="game-icons:electric" /> {Math.floor(state.resources.food)}
                    </div>
                    <div className="stat" style={{ color: 'var(--color-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Icon icon="game-icons:crystal-shrine" /> {Math.floor(state.resources.shards)}
                    </div>
                    <div className="stat" style={{ color: '#aaa', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Icon icon="game-icons:person" /> {Math.floor(state.population.total)}
                    </div>
                </div>
                <div className="stat-group right" style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={onMenu} className="research-trigger-btn" style={{ padding: '2px 8px', fontSize: '0.65rem', background: '#333' }}>
                        <Icon icon="game-icons:exit-door" style={{ verticalAlign: 'middle' }} />
                    </button>
                </div>
            </header>

            <nav className="tab-nav">
                <button
                    className={`tab-btn ${activeTab === 'GAME' ? 'active' : ''}`}
                    onClick={() => setActiveTab('GAME')}
                >
                    <Icon icon="game-icons:castle" style={{ verticalAlign: 'middle', marginRight: '5px' }} />
                    FORT
                </button>
                <button
                    className={`tab-btn ${activeTab === 'MAP' ? 'active' : ''}`}
                    onClick={() => setActiveTab('MAP')}
                >
                    <Icon icon="game-icons:radar-sweep" style={{ verticalAlign: 'middle', marginRight: '5px' }} />
                    SCAN
                </button>
                <button
                    className={`tab-btn ${activeTab === 'LOG' ? 'active' : ''}`}
                    onClick={() => setActiveTab('LOG')}
                >
                    <Icon icon="game-icons:notebook" style={{ verticalAlign: 'middle', marginRight: '5px' }} />
                    LOGS
                </button>
                <button
                    className={`tab-btn ${activeTab === 'TECH' ? 'active' : ''}`}
                    onClick={() => setActiveTab('TECH')}
                >
                    <Icon icon="game-icons:bookshelf" style={{ verticalAlign: 'middle', marginRight: '5px' }} />
                    TECH
                </button>
            </nav>

            <div className="tab-content" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                {activeTab === 'GAME' && (
                    <div className="game-view-container" style={{ overflowY: 'auto', paddingBottom: '20px' }}>
                        <VisualFortress state={state} />

                        <div className="visuals-overlap-stats">
                            <div className="wall-meter">
                                HULL INTEGRITY: {Math.floor(state.wallHealth)} / {state.maxWallHealth}
                                <div className="meter-bg">
                                    <div
                                        className="meter-fill"
                                        style={{ width: `${(state.wallHealth / state.maxWallHealth) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                            <div className="demon-meter" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '5px', paddingTop: '5px', borderTop: '1px solid #222' }}>
                                {/* Left: Action */}
                                <button
                                    className="next-turn-btn"
                                    onClick={onNextTurn}
                                    disabled={state.gameOver}
                                    style={{
                                        margin: 0,
                                        width: 'auto',
                                        padding: '12px 24px',
                                        fontSize: '1rem',
                                        flex: '0 0 auto',
                                        fontWeight: 'bold',
                                        letterSpacing: '1px'
                                    }}
                                >
                                    {state.gameOver ? "SIGNAL LOST" : "NEXT TURN"}
                                </button>

                                {/* Right: Info & Purge */}
                                <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                    <div>
                                        <span className="threat-label">VOID THREAT:</span> {state.demonStrength.toFixed(1)}
                                    </div>
                                    <div className="scout-report" style={{ marginBottom: '4px' }}>{state.scoutReport}</div>

                                    <button
                                        onClick={onBanish}
                                        disabled={state.resources.shards < 100}
                                        className="banish-btn"
                                        style={{
                                            background: 'rgba(204, 51, 255, 0.2)',
                                            border: '1px solid var(--color-secondary)',
                                            color: 'var(--color-secondary)',
                                            padding: '2px 8px', fontSize: '0.7rem', cursor: 'pointer',
                                            opacity: state.resources.shards < 100 ? 0.5 : 1,
                                            fontWeight: 'bold', textTransform: 'uppercase'
                                        }}
                                        title="Cost: 100 Shards"
                                    >
                                        INITIATE PURGE (-2)
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Defense Controls (Compact) */}
                        <DefenseControls
                            currentStance={state.stance}
                            hero={state.hero}
                            onSetStance={onSetStance}
                        />

                        {/* Allocation Controls (Percentage Based) */}
                        <div className="controls-area" style={{ marginTop: '10px' }}>
                            <Allocation
                                state={state}
                                allocation={state.allocation}

                                onAllocate={onAllocate}
                                isProcessing={state.gameOver}
                            />


                        </div>
                    </div>
                )}

                {activeTab === 'MAP' && (
                    <MapScreen state={state} />
                )}

                {activeTab === 'LOG' && (
                    <EventLog logs={state.eventLog} />
                )}

                {activeTab === 'TECH' && (
                    <ResearchScreen
                        state={state}
                        onBack={() => setActiveTab('GAME')}
                        onResearch={onResearch}
                        onIgnite={onIgnite}
                        embedded={true}
                    />
                )}
            </div>
        </div>
    );
};
