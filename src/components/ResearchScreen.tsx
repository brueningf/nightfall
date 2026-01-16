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
        <div className={`flex flex-col text-[#eee] bg-cover bg-center overflow-hidden min-h-0 ${embedded ? 'flex-1 w-full bg-transparent' : 'h-screen bg-[#0a0a10]'}`}
            style={{
                backgroundImage: embedded ? 'none' : `linear-gradient(rgba(10, 10, 16, 0.95), rgba(10, 10, 16, 0.95)), url(/gscene_research.jpg)`
            }}>
            {/* Header */}
            <header className={`flex justify-between items-center shrink-0 border-b border-[#333] ${embedded ? 'bg-transparent p-1.5 px-2.5' : 'bg-[#14141e]/90 p-2.5 px-4'}`}>
                <div className="flex items-center gap-2.5">
                    <Icon icon="game-icons:archive-research" className={`text-primary ${embedded ? 'text-xl' : 'text-2xl'}`} />
                    <h2 className="text-[1rem] m-0 text-primary tracking-[2px] font-bold">TECHNOLOGY</h2>
                </div>
                {!embedded && (
                    <button className="text-xl p-1.5 text-[#666] bg-transparent border-none cursor-pointer hover:text-white transition-colors" onClick={onBack}>
                        <Icon icon="game-icons:exit-door" />
                    </button>
                )}
            </header>

            {/* Stats Bar */}
            <div className="flex justify-between items-center shrink-0 bg-black/60 p-2 px-4 text-[0.8rem] border-b border-[#333]">
                <div className="flex items-center gap-1.5 text-[#888]">
                    <Icon icon="game-icons:test-tubes" />
                    <span>OUTPUT:</span>
                    <strong className="text-primary">{dailyOutput.toFixed(1)} / day</strong>
                </div>

                {state.activeResearchId && (
                    <div className="flex items-center gap-1.5 text-primary">
                        <Icon icon="game-icons:cog" className="animate-spin-slow" />
                        <span>ACTIVE: {state.techs[state.activeResearchId].name}</span>
                    </div>
                )}
            </div>

            {/* Scrollable List */}
            <div className="flex-1 overflow-y-auto p-2.5 flex flex-col gap-2 custom-scrollbar relative">
                {/* Tech Chains */}
                {(() => {
                    const chains: TechId[][] = [
                        ['CROP_ROTATION', 'HEAVY_PLOW'],
                        ['MASONRY', 'OBSIDIAN_WALLS'],
                        ['STEEL_WEAPONS', 'IRON_ARMOR'],
                        ['ARCANE_STUDIES'],
                        ['CORE_STABILIZATION']
                    ];

                    return chains.map((chain, index) => {
                        // Find the current active tech in the chain (first not unlocked)
                        // Or the last one if all are unlocked
                        let activeTechId = chain.find(id => !state.techs[id].unlocked);
                        let isFullyUpgraded = false;

                        if (!activeTechId) {
                            activeTechId = chain[chain.length - 1];
                            isFullyUpgraded = true;
                        }

                        const tech = state.techs[activeTechId];
                        const isActive = state.activeResearchId === tech.id;
                        const progress = state.researchProgress[tech.id] || 0;
                        const percent = Math.min(100, (progress / tech.cost) * 100);
                        const remaining = tech.cost - progress;
                        const daysLeft = dailyOutput > 0 ? Math.ceil(remaining / dailyOutput) : '∞';

                        const isIgnition = tech.id === 'CORE_STABILIZATION';

                        let cardBg = 'bg-[#121218]';
                        let cardBorder = 'border-[#333]';
                        let opacity = 'opacity-100';

                        if (isFullyUpgraded) {
                            cardBg = 'bg-[rgba(0,204,255,0.08)]';
                            opacity = 'opacity-70';
                        } else if (isActive) {
                            cardBg = 'bg-[rgba(0,204,255,0.05)]';
                            cardBorder = 'border-primary';
                        }

                        // Collect History
                        const history = chain.filter(id => state.techs[id].unlocked && id !== activeTechId);
                        // If fully upgraded, the activeTechId is also "history" effectively, but we render it as the main card body
                        // actually if fully upgraded, we might want to just show the "History" of everything?
                        // Let's stick to the plan: Main card is the current state.

                        return (
                            <div key={index} className={`shrink-0 ${cardBg} border ${cardBorder} rounded p-2 flex flex-col gap-2 relative overflow-hidden transition-all ${opacity}`}>

                                {/* History Section (Previous Tiers) */}
                                {history.length > 0 && (
                                    <div className="flex flex-col gap-1 pb-2 border-b border-white/10 mb-1">
                                        {history.map(histId => {
                                            const histTech = state.techs[histId];
                                            return (
                                                <div key={histId} className="flex gap-2 items-center opacity-60">
                                                    <Icon icon="game-icons:check-mark" className="text-success text-xs shrink-0" />
                                                    <div className="text-[0.65rem] text-[#aaa]">
                                                        <span className="text-success font-bold mr-1">{histTech.name}:</span>
                                                        {histTech.description}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}

                                {/* Active Tier Section */}
                                <div className="flex gap-2 items-center min-h-[50px]">
                                    {/* Icon Column */}
                                    <div className={`text-xl flex items-center justify-center w-[40px] shrink-0 ${tech.unlocked ? 'text-success' : isActive ? 'text-primary' : 'text-[#555]'}`}>
                                        <Icon icon={getIconForTech(tech.id)} />
                                    </div>

                                    {/* Info Column */}
                                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                                        <div className="flex justify-between items-center mb-0.5">
                                            <h3 className={`m-0 text-[0.8rem] font-bold uppercase leading-tight ${tech.unlocked ? 'text-success' : isActive ? 'text-primary' : 'text-[#ddd]'}`}>
                                                {tech.name}
                                            </h3>
                                            {tech.unlocked && <Icon icon="game-icons:check-mark" className="text-success text-xs" />}
                                        </div>
                                        <p className="m-0 text-[0.65rem] text-[#888] leading-[1.1] pr-1">{tech.description}</p>

                                        {/* Progress Bar for Active/In-Progress */}
                                        {!tech.unlocked && (
                                            <div className="mt-1 text-[0.65rem] text-[#666] flex items-center gap-2">
                                                <div className="flex-1 h-1 bg-[#222] rounded overflow-hidden">
                                                    <div style={{ width: `${percent}%` }} className={`h-full ${isActive ? 'bg-primary' : 'bg-[#444]'}`}></div>
                                                </div>
                                                <span className="font-mono">{Math.floor(percent)}%</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Action Column */}
                                    <div className="shrink-0 w-[80px] flex justify-end items-center">
                                        {isIgnition && tech.unlocked ? (
                                            <button
                                                onClick={onIgnite}
                                                className="bg-[#ffd700] text-black border-none font-bold px-2 py-1.5 cursor-pointer text-[0.7rem] rounded flex flex-col items-center leading-none hover:brightness-110 shadow-[0_0_10px_rgba(255,215,0,0.5)]"
                                            >
                                                <span>IGNITE</span>
                                                <span className="text-[0.6rem]">2000 💠</span>
                                            </button>
                                        ) : tech.unlocked ? (
                                            <div className="text-[0.65rem] text-success border border-success px-1 py-0.5 rounded font-bold uppercase tracking-wide">MAX TIER</div>
                                        ) : isActive ? (
                                            <div className="text-center text-primary text-[0.7rem] leading-tight">
                                                <div className="font-bold">{daysLeft} Days</div>
                                                <div className="text-[0.6rem] opacity-80">Running</div>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => onResearch(tech.id)}
                                                className="bg-transparent text-primary border border-primary px-2 py-1 text-[0.7rem] cursor-pointer uppercase transition-colors hover:bg-primary hover:text-black font-bold"
                                            >
                                                Start ({tech.cost})
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    });
                })()}

                {/* Fallback for anything not in a chain? (Strictly mapped above for now) */}
            </div>
        </div>
    );
};
