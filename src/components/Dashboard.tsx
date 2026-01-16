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

const NavButton: React.FC<{ active: boolean; onClick: () => void; icon: string; label: string }> = ({ active, onClick, icon, label }) => (
    <button
        className={`flex-1 bg-transparent border-none py-2 px-1 cursor-pointer font-bold uppercase text-[0.7rem] tracking-wider transition-all whitespace-nowrap flex justify-center items-center ${active ? 'bg-white/5 text-primary border-b-2 border-primary [text-shadow:0_0_8px_var(--color-primary)]' : 'text-[#666] hover:text-[#888]'}`}
        onClick={onClick}
    >
        <Icon icon={icon} className="mr-2 align-middle text-lg" />
        {label}
    </button>
);
export const Dashboard: React.FC<DashboardProps> = ({ state, onAllocate, onNextTurn, onSetStance, onResearch, onIgnite, onBanish, onMenu }) => {
    const [activeTab, setActiveTab] = useState<'GAME' | 'MAP' | 'LOG' | 'TECH'>('GAME');

    return (
        <div className="flex flex-col gap-2.5 flex-1 p-2.5 bg-[radial-gradient(circle_at_center,_#1a1a20_0%,_#000_100%)] min-h-0">
            <header className="flex justify-between bg-panel/90 text-[0.8rem] border-y border-[#333] shrink-0 items-center h-8 px-2">
                <div className="flex items-center gap-3">
                    <div className="font-bold">SOL {state.turn}</div>
                    <div className="w-px h-3 bg-[#333]"></div>
                    <div className="text-success flex items-center gap-1.5">
                        <Icon icon="game-icons:electric" /> {Math.floor(state.resources.food)}
                    </div>
                    <div className="text-secondary flex items-center gap-1.5">
                        <Icon icon="game-icons:crystal-shrine" /> {Math.floor(state.resources.shards)}
                    </div>
                    <div className="text-[#aaa] flex items-center gap-1.5">
                        <Icon icon="game-icons:person" /> {Math.floor(state.population.total)}
                    </div>
                </div>
                <div className="flex gap-2">
                    <button onClick={onMenu} className="bg-[#333] px-2 py-0.5 text-[0.65rem] text-primary border border-primary font-bold uppercase cursor-pointer hover:bg-primary hover:text-black transition-colors shadow-[0_0_5px_rgba(0,204,255,0.3)]">
                        <Icon icon="game-icons:exit-door" className="align-middle" />
                    </button>
                </div>
            </header>

            <nav className="flex gap-0.5 mb-0.5 bg-black/50 p-0.5 border border-[#333] shrink-0">
                <NavButton
                    active={activeTab === 'GAME'}
                    onClick={() => setActiveTab('GAME')}
                    icon="game-icons:castle"
                    label="FORT"
                />
                <NavButton
                    active={activeTab === 'MAP'}
                    onClick={() => setActiveTab('MAP')}
                    icon="game-icons:radar-sweep"
                    label="SCAN"
                />
                <NavButton
                    active={activeTab === 'LOG'}
                    onClick={() => setActiveTab('LOG')}
                    icon="game-icons:notebook"
                    label="LOGS"
                />
                <NavButton
                    active={activeTab === 'TECH'}
                    onClick={() => setActiveTab('TECH')}
                    icon="game-icons:bookshelf"
                    label="TECH"
                />
            </nav>

            <div className="flex-1 flex flex-col overflow-hidden min-h-0">
                {activeTab === 'GAME' && (
                    <div className="overflow-y-auto pb-5 scrollbar-hidden">
                        <VisualFortress state={state} />

                        <div className="relative z-10 p-1.5 bg-black/80 border-t border-[#333] backdrop-blur-sm">
                            <div className="mb-1 text-[0.7rem] text-white z-10 font-mono">
                                HULL INTEGRITY: {Math.floor(state.wallHealth)} / {state.maxWallHealth}
                                <div className="w-full h-1.5 bg-[#222] overflow-hidden mt-0.5 border border-[#444]">
                                    <div
                                        className="h-full bg-primary transition-[width] duration-300 shadow-[0_0_5px_var(--color-primary)]"
                                        style={{ width: `${(state.wallHealth / state.maxWallHealth) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                            <div className="text-xs text-danger flex items-center justify-between mt-1 pt-1 border-t border-[#222]">
                                {/* Left: Action */}
                                <button
                                    className="w-auto px-4 py-2 bg-primary text-black border-none text-[0.85rem] font-bold cursor-pointer uppercase transition-all tracking-[1px] m-0 shrink-0 shadow-[0_0_10px_rgba(0,204,255,0.3)] hover:bg-[#33d6ff] hover:shadow-[0_0_15px_rgba(0,204,255,0.5)] hover:-translate-y-px disabled:bg-[#333] disabled:text-[#666] disabled:cursor-not-allowed disabled:shadow-none"
                                    onClick={onNextTurn}
                                    disabled={state.gameOver}
                                >
                                    {state.gameOver ? "SIGNAL LOST" : "NEXT TURN"}
                                </button>

                                {/* Right: Info & Purge */}
                                <div className="text-right flex flex-col items-end">
                                    <div>
                                        <span className="font-bold text-danger uppercase text-[0.7rem]">VOID THREAT:</span> {state.demonStrength.toFixed(1)}
                                    </div>
                                    <div className="italic text-[#888] text-[0.65rem] mb-0.5">{state.scoutReport}</div>

                                    <button
                                        onClick={onBanish}
                                        disabled={state.resources.shards < 100}
                                        className="bg-[rgba(204,51,255,0.2)] border border-secondary text-secondary px-2 py-0.5 text-[0.65rem] cursor-pointer font-bold uppercase disabled:opacity-50 hover:bg-secondary hover:text-black transition-colors"
                                        title="Cost: 100 Shards"
                                    >
                                        In. PURGE (-2)
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Defense Controls (Compact) */}
                        <div className="mt-1">
                            <DefenseControls
                                currentStance={state.stance}
                                hero={state.hero}
                                onSetStance={onSetStance}
                            />
                        </div>

                        {/* Allocation Controls (Percentage Based) */}
                        <div className="mt-1">
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
