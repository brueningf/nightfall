import React from 'react';
import type { AllocationPolicy, GameState } from '../engine/types';
import { Icon } from '@iconify/react';

interface AllocationProps {
    state: GameState;
    allocation: AllocationPolicy;
    onAllocate: (newPolicy: AllocationPolicy) => void;
    isProcessing: boolean;
}

interface ControlRowProps {
    label: React.ReactNode;
    role: keyof AllocationPolicy;
    percentage: number;
    onAdjust: (role: keyof AllocationPolicy, change: number) => void;
    isProcessing: boolean;
    canIncrease: boolean;
    stat: string; // New prop for the compact stat
    statColor?: string;
}

const ControlRow = ({ label, role, percentage, onAdjust, isProcessing, canIncrease, stat, statColor = "text-[#888]" }: ControlRowProps) => (
    <div className="bg-panel p-1.5 border border-[#2a2a35] rounded-sm h-full flex flex-col justify-between" title={stat}>
        <div className="flex justify-between items-center mb-1">
            <span className="text-[0.65rem] text-[#e0e0e0] font-bold flex items-center gap-1.5 whitespace-nowrap">{label}</span>
            <span className={`text-[0.6rem] font-mono ${statColor}`}>{stat}</span>
        </div>
        <div className="flex items-center gap-1 justify-between bg-black/20 rounded p-0.5">
            <button
                className="bg-[#2a0e0e] border border-[#5a2d2d] w-5 h-5 flex justify-center items-center cursor-pointer font-bold text-danger hover:border-danger hover:bg-[#4a1a1a] disabled:opacity-30 disabled:cursor-not-allowed text-xs rounded-sm"
                onClick={() => onAdjust(role, -5)}
                disabled={isProcessing || percentage <= 0}
            >-</button>

            <div className="font-mono text-white min-w-[28px] text-center text-sm font-bold">
                {percentage}%
            </div>

            <button
                className="bg-[#0e2a1a] border border-[#2d5a45] w-5 h-5 flex justify-center items-center cursor-pointer font-bold text-success hover:border-success hover:bg-[#1a4a2a] disabled:opacity-30 disabled:cursor-not-allowed text-xs rounded-sm"
                onClick={() => onAdjust(role, 5)}
                disabled={isProcessing || !canIncrease}
            >+</button>
        </div>
    </div>
);

export const Allocation: React.FC<AllocationProps> = ({ state, allocation, onAllocate, isProcessing }) => {

    const totalAllocated = allocation.farmers + allocation.miners + allocation.soldiers;
    const scientistPercentage = 100 - totalAllocated;

    // --- Stat Calculation Logic (Replicated/Simplified from Engine) ---
    const getCompactStat = (role: 'farmers' | 'miners' | 'soldiers' | 'scientists', pct: number) => {
        const count = Math.floor(state.population.total * (pct / 100));

        if (role === 'farmers') {
            // Growth Calculation
            // Production
            let yieldPer = 5;
            if (state.techs['CROP_ROTATION'].unlocked) yieldPer *= 1.25;
            if (state.techs['HEAVY_PLOW'].unlocked) yieldPer *= 1.25;
            const production = count * yieldPer;

            // Consumption & Surplus
            const consumption = state.population.total * 1; // 1 food per person
            const surplus = production - consumption;

            // Growth Formula roughly: 
            // Natality = 0.15 + (SurplusPerCapita * 0.05)
            // Growth = (Surplus * Natality) - (Pop * 0.05)

            const surplusPerCapita = surplus / (state.population.total || 1);
            const natality = 0.15 + (Math.max(0, surplusPerCapita) * 0.05);
            const mortality = 0.05;

            let growth = (surplus * natality) - (state.population.total * mortality);
            if (state.resources.food <= 0 && growth > 0) growth = -state.population.total * 0.1; // Starvation fallback check visually

            return growth > 0 ? `+${growth.toFixed(1)}/d` : `${growth.toFixed(1)}/d`;
        }
        if (role === 'miners') {
            // Shards
            const shards = Math.floor(count * 0.5);
            return `+${shards}`;
        }
        if (role === 'soldiers') {
            // Defense Power
            let power = count * 2;
            if (state.techs['STEEL_WEAPONS'].unlocked) power *= 1.25;
            if (state.techs['IRON_ARMOR'].unlocked) power *= 1.20;
            // Note: Stance modifier not applied here to show "Base Strength", or should we? 
            // Let's show base to avoid confusion when switching tabs, or applied? 
            // User asked for "Strength". Let's show current effective strength? 
            // Actually, usually easier to allocate if you see the raw power of the allocation. 
            // Let's stick to raw soldier power for allocation purposes.
            return `${Math.floor(power)}`;
        }
        if (role === 'scientists') {
            // Knowledge
            let knowledge = count * 5;
            if (state.techs['ARCANE_STUDIES'].unlocked) knowledge *= 1.25;
            return `+${Math.floor(knowledge)}`;
        }
        return '';
    };

    const handleChange = (role: keyof AllocationPolicy, change: number) => {
        const current = allocation[role];
        const next = current + change;

        // Bounds check
        if (next < 0) return;
        if (totalAllocated + change > 100) return; // Cannot exceed 100% total

        onAllocate({ ...allocation, [role]: next });
    };

    return (
        <div className="bg-[#101015] p-2 border border-[#333]">
            <div className="flex flex-col items-start gap-1 pb-1 border-b border-[#333] mb-2">
                <h3 className="text-[0.6rem] m-0 text-[#888] tracking-widest uppercase">CREW ASSIGNMENTS</h3>
                {/* Visual Bar of Distribution */}
                <div className="h-1 w-full bg-[#222] flex rounded-none overflow-hidden mt-0.5">
                    <div style={{ width: `${allocation.farmers}%` }} className="bg-success" title="Farmers"></div>
                    <div style={{ width: `${allocation.miners}%` }} className="bg-secondary" title="Miners"></div>
                    <div style={{ width: `${allocation.soldiers}%` }} className="bg-danger" title="Soldiers"></div>
                    <div style={{ width: `${scientistPercentage}%` }} className="bg-primary" title="Scientists"></div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-1.5">
                <ControlRow
                    label={<><Icon icon="game-icons:wheat" color="#2ecc71" /> FOOD</>} role="farmers"
                    percentage={allocation.farmers}
                    onAdjust={handleChange} isProcessing={isProcessing} canIncrease={totalAllocated < 100}
                    stat={getCompactStat('farmers', allocation.farmers)}
                    statColor="text-success"
                />
                <ControlRow
                    label={<><Icon icon="game-icons:drill" color="#3498db" /> SHARDS</>} role="miners"
                    percentage={allocation.miners}
                    onAdjust={handleChange} isProcessing={isProcessing} canIncrease={totalAllocated < 100}
                    stat={getCompactStat('miners', allocation.miners)}
                    statColor="text-secondary"
                />
                <ControlRow
                    label={<><Icon icon="game-icons:police-badge" color="#00ccff" /> GUARD</>} role="soldiers"
                    percentage={allocation.soldiers}
                    onAdjust={handleChange} isProcessing={isProcessing} canIncrease={totalAllocated < 100}
                    stat={getCompactStat('soldiers', allocation.soldiers)}
                    statColor="text-danger"
                />

                {/* Scientists are passive/free */}
                <div className="bg-[rgba(0,204,255,0.05)] p-1.5 border border-primary rounded-sm h-full flex flex-col justify-between">
                    <div className="flex justify-between items-center mb-0.5">
                        <span className="text-[0.65rem] text-[#e0e0e0] font-bold flex items-center gap-1.5 whitespace-nowrap"><Icon icon="game-icons:microscope" /> TECH</span>
                        <span className="text-[0.6rem] font-mono text-primary">{getCompactStat('scientists', scientistPercentage)}</span>
                    </div>
                    <div className="flex items-center gap-2 justify-end mt-auto">
                        <div className="font-mono text-primary text-center text-sm">
                            <span className="text-primary">{scientistPercentage}%</span>
                        </div>
                    </div>
                </div>
            </div>
            {/* Summary Footer for Details (Optional, or just tooltip?) - Let's keep it simple for now */}
        </div>
    );
};
