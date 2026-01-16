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
                {Object.values(state.techs).map((tech) => {
                    const isActive = state.activeResearchId === tech.id;
                    const progress = state.researchProgress[tech.id] || 0;
                    const percent = Math.min(100, (progress / tech.cost) * 100);
                    const remaining = tech.cost - progress;
                    const daysLeft = dailyOutput > 0 ? Math.ceil(remaining / dailyOutput) : '∞';

                    const isIgnition = tech.id === 'CORE_STABILIZATION';

                    let cardBg = 'bg-[#121218]';
                    let cardBorder = 'border-[#333]';
                    let opacity = 'opacity-100';

                    if (tech.unlocked) {
                        cardBg = 'bg-[rgba(0,204,255,0.08)]';
                        opacity = 'opacity-70';
                    } else if (isActive) {
                        cardBg = 'bg-[rgba(0,204,255,0.05)]';
                        cardBorder = 'border-primary';
                    }

                    return (
                        <div key={tech.id} className={`shrink-0 ${cardBg} border ${cardBorder} rounded p-1.5 flex gap-2 items-center relative overflow-hidden transition-all ${opacity} min-h-[50px]`}>
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
                                    <div className="text-[0.65rem] text-success border border-success px-1 py-0.5 rounded font-bold uppercase tracking-wide">ACQUIRED</div>
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
                    );
                })}
            </div>
        </div>
    );
};
