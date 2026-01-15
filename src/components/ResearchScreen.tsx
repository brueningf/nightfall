import React from 'react';
import type { GameState, TechId } from '../engine/types';
import { Icon } from '@iconify/react';
import '../index.css';

interface ResearchScreenProps {
    state: GameState;
    onBack: () => void;
    onResearch: (techId: TechId) => void;
    onIgnite: () => void;
    embedded?: boolean;
}

export const ResearchScreen: React.FC<ResearchScreenProps> = ({ state, onBack, onResearch, onIgnite, embedded }) => {
    // Calculate daily research output for estimates
    const scientistCount = state.population.scientists;
    const multiplier = state.techs['ARCANE_STUDIES'].unlocked ? 1.25 : 1.0;
    const dailyOutput = scientistCount * 5 * multiplier;

    const getIconForTech = (id: TechId): string => {
        switch (id) {
            case 'CROP_ROTATION': return 'game-icons:sprout';
            case 'MASONRY': return 'game-icons:brick-wall';
            case 'STEEL_WEAPONS': return 'game-icons:laser-blast';
            case 'ARCANE_STUDIES': return 'game-icons:black-book';
            case 'HEAVY_PLOW': return 'game-icons:cloud-download';
            case 'IRON_ARMOR': return 'game-icons:armor-vest';
            case 'OBSIDIAN_WALLS': return 'game-icons:stone-wall';
            case 'CORE_STABILIZATION': return 'game-icons:sun';
            default: return 'game-icons:cog';
        }
    };

    return (
        <div className="info-screen research-screen" style={{
            height: embedded ? '100%' : '100vh',
            background: embedded ? 'transparent' : '#0a0a10',
            display: 'flex',
            flexDirection: 'column',
            color: '#eee',
            backgroundImage: embedded ? 'none' : `linear-gradient(rgba(10, 10, 16, 0.95), rgba(10, 10, 16, 0.95)), url(/gscene_research.jpg)`,
            backgroundSize: 'cover'
        }}>
            {/* Header */}
            <header className="info-header" style={{
                background: embedded ? 'rgba(0,0,0,0)' : 'rgba(20, 20, 30, 0.9)',
                borderBottom: '1px solid #333',
                padding: embedded ? '5px 10px' : '10px 15px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexShrink: 0
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Icon icon="game-icons:archive-research" style={{ fontSize: embedded ? '1.2rem' : '1.5rem', color: 'var(--color-primary)' }} />
                    <h2 style={{ fontSize: '1rem', margin: 0, color: 'var(--color-primary)', letterSpacing: '2px' }}>TECHNOLOGY</h2>
                </div>
                {!embedded && (
                    <button className="close-btn" onClick={onBack} style={{ fontSize: '1.2rem', padding: '5px' }}>
                        <Icon icon="game-icons:exit-door" />
                    </button>
                )}
            </header>

            {/* Stats Bar */}
            <div style={{
                background: 'rgba(0,0,0,0.6)',
                padding: '8px 15px',
                fontSize: '0.8rem',
                borderBottom: '1px solid #333',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexShrink: 0
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#888' }}>
                    <Icon icon="game-icons:test-tubes" />
                    <span>OUTPUT:</span>
                    <strong style={{ color: 'var(--color-primary)' }}>{dailyOutput.toFixed(1)} / day</strong>
                </div>

                {state.activeResearchId && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--color-primary)' }}>
                        <Icon icon="game-icons:cog" className="spin-slow" />
                        <span>ACTIVE: {state.techs[state.activeResearchId].name}</span>
                    </div>
                )}
            </div>

            {/* Scrollable List */}
            <div className="research-list" style={{
                flex: 1,
                overflowY: 'auto',
                padding: '10px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
            }}>
                {Object.values(state.techs).map((tech) => {
                    const isActive = state.activeResearchId === tech.id;
                    const progress = state.researchProgress[tech.id] || 0;
                    const percent = Math.min(100, (progress / tech.cost) * 100);
                    const remaining = tech.cost - progress;
                    const daysLeft = dailyOutput > 0 ? Math.ceil(remaining / dailyOutput) : '∞';

                    const isIgnition = tech.id === 'CORE_STABILIZATION';

                    return (
                        <div key={tech.id} style={{
                            background: tech.unlocked ? 'rgba(0, 204, 255, 0.08)' : isActive ? 'rgba(0, 204, 255, 0.05)' : '#121218',
                            border: isActive ? '1px solid var(--color-primary)' : '1px solid #333',
                            borderRadius: '4px',
                            padding: '10px',
                            display: 'flex',
                            gap: '12px',
                            alignItems: 'center',
                            opacity: tech.unlocked ? 0.7 : 1, // Dim unlocked items slightly
                            position: 'relative',
                            overflow: 'hidden'
                        }}>
                            {/* Icon Column */}
                            <div style={{
                                fontSize: '2rem',
                                color: tech.unlocked ? 'var(--color-success)' : isActive ? 'var(--color-primary)' : '#555',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '50px',
                                flexShrink: 0
                            }}>
                                <Icon icon={getIconForTech(tech.id)} />
                            </div>

                            {/* Info Column */}
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                                    <h3 style={{
                                        margin: 0,
                                        fontSize: '0.9rem',
                                        color: tech.unlocked ? 'var(--color-success)' : isActive ? 'var(--color-primary)' : '#ddd',
                                        textTransform: 'uppercase',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis'
                                    }}>
                                        {tech.name}
                                    </h3>
                                    {tech.unlocked && <Icon icon="game-icons:check-mark" style={{ color: 'var(--color-success)' }} />}
                                </div>
                                <p style={{ margin: 0, fontSize: '0.75rem', color: '#888', lineHeight: '1.2' }}>{tech.description}</p>

                                {/* Progress Bar for Active/In-Progress */}
                                {!tech.unlocked && (
                                    <div style={{ marginTop: '6px', fontSize: '0.7rem', color: '#666', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <div style={{ flex: 1, height: '4px', background: '#222', borderRadius: '2px', overflow: 'hidden' }}>
                                            <div style={{ width: `${percent}%`, height: '100%', background: isActive ? 'var(--color-primary)' : '#444' }}></div>
                                        </div>
                                        <span>{Math.floor(percent)}%</span>
                                    </div>
                                )}
                            </div>

                            {/* Action Column */}
                            <div style={{ flexShrink: 0, width: '90px', display: 'flex', justifyContent: 'flex-end' }}>
                                {isIgnition && tech.unlocked ? (
                                    <button
                                        onClick={onIgnite}
                                        style={{
                                            background: '#ffd700',
                                            color: '#000',
                                            border: 'none',
                                            fontWeight: 'bold',
                                            padding: '8px 10px',
                                            cursor: 'pointer',
                                            fontSize: '0.75rem',
                                            borderRadius: '2px',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            lineHeight: '1'
                                        }}
                                    >
                                        <span>IGNITE</span>
                                        <span style={{ fontSize: '0.65rem' }}>2000 💠</span>
                                    </button>
                                ) : tech.unlocked ? (
                                    <div style={{
                                        fontSize: '0.7rem',
                                        color: 'var(--color-success)',
                                        border: '1px solid var(--color-success)',
                                        padding: '2px 6px',
                                        borderRadius: '2px'
                                    }}>ACQUIRED</div>
                                ) : isActive ? (
                                    <div style={{
                                        textAlign: 'center',
                                        color: 'var(--color-primary)',
                                        fontSize: '0.75rem'
                                    }}>
                                        <div style={{ fontWeight: 'bold' }}>{daysLeft} Days</div>
                                        <div style={{ fontSize: '0.6rem' }}>Researching...</div>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => onResearch(tech.id)}
                                        style={{
                                            background: 'transparent',
                                            color: 'var(--color-primary)',
                                            border: '1px solid var(--color-primary)',
                                            padding: '6px 10px',
                                            fontSize: '0.75rem',
                                            cursor: 'pointer',
                                            textTransform: 'uppercase'
                                        }}
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
    );
};
