import React from 'react';
import type { GameState, TechId } from '../engine/types';

interface TechModalProps {
    state: GameState;
    onClose: () => void;
    onResearch: (techId: TechId) => void;
    onIgnite: () => void;
}

export const TechModal: React.FC<TechModalProps> = ({ state, onClose, onResearch, onIgnite }) => {
    // Calculate daily research output for estimates
    const scientistCount = state.population.scientists;
    // Base yield is 5 (Plan: "Research" output is high from scientists)
    // Need to match engine constant. Engine says 5.
    const multiplier = state.techs['ARCANE_STUDIES'].unlocked ? 1.25 : 1.0;
    const dailyOutput = scientistCount * 5 * multiplier;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content tech-modal" onClick={e => e.stopPropagation()} style={{
                backgroundImage: `linear-gradient(rgba(15, 15, 21, 0.95), rgba(15, 15, 21, 0.95)), url(/scene_hydroponics.png)`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}>
                <div className="modal-header">
                    <h2>RESEARCH NEXUS</h2>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>

                <div className="modal-body">
                    <div className="intel-display">
                        <div>
                            <strong>Active Project Status</strong>
                            {state.activeResearchId ? (
                                <span style={{ marginLeft: '10px', color: '#4d94ff' }}>
                                    WORKING ON: {state.techs[state.activeResearchId].name}
                                </span>
                            ) : (
                                <span style={{ marginLeft: '10px', color: '#888' }}>IDLE - Select a Project</span>
                            )}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#888' }}>
                            Daily Knowledge Output: ~{dailyOutput.toFixed(1)} / day
                        </div>
                    </div>

                    <div className="tech-list">
                        {Object.values(state.techs).map((tech) => {
                            const isActive = state.activeResearchId === tech.id;
                            const progress = state.researchProgress[tech.id] || 0;
                            const percent = Math.min(100, (progress / tech.cost) * 100);
                            const remaining = tech.cost - progress;
                            const daysLeft = dailyOutput > 0 ? Math.ceil(remaining / dailyOutput) : '∞';

                            return (
                                <div key={tech.id} className={`tech-card ${tech.unlocked ? 'unlocked' : ''} ${isActive ? 'active-research' : ''}`}>
                                    <div className="tech-info">
                                        <h3>{tech.name} {isActive && <span style={{ fontSize: '0.7rem', color: '#4d94ff' }}>(ACTIVE)</span>}</h3>
                                        <p>{tech.description}</p>
                                        {!tech.unlocked && isActive && (
                                            <div style={{ width: '100%', height: '4px', background: '#333', marginTop: '5px' }}>
                                                <div style={{ width: `${percent}%`, height: '100%', background: '#4d94ff' }}></div>
                                            </div>
                                        )}
                                        {!tech.unlocked && !isActive && progress > 0 && (
                                            <div style={{ fontSize: '0.7rem', color: '#666' }}>Progress: {progress} / {tech.cost}</div>
                                        )}
                                    </div>
                                    <div className="tech-action">
                                        {tech.id === 'CORE_STABILIZATION' && tech.unlocked ? (
                                            <button
                                                className="research-btn"
                                                style={{ background: '#ffd700', color: 'black', fontWeight: 'bold', border: '1px solid #fff' }}
                                                onClick={onIgnite}
                                            >
                                                IGNITE (2000 💠)
                                            </button>
                                        ) : tech.unlocked ? (
                                            <span className="status-badge">DONE</span>
                                        ) : isActive ? (
                                            <button className="research-btn active" disabled>
                                                {daysLeft} Days
                                            </button>
                                        ) : (
                                            <button
                                                className="research-btn"
                                                onClick={() => onResearch(tech.id)}
                                            >
                                                Start ({tech.cost})
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};
