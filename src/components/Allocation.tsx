import React from 'react';
import type { AllocationPolicy, GameState } from '../engine/types';
import { Icon } from '@iconify/react';

interface AllocationProps {
    state: GameState;
    allocation: AllocationPolicy;
    onAllocate: (newPolicy: AllocationPolicy) => void;
    isProcessing: boolean;
}

const ControlRow = ({ label, role, percentage, onAdjust, isProcessing, canIncrease, details }: {
    label: React.ReactNode,
    role: keyof AllocationPolicy,
    percentage: number,
    onAdjust: (role: keyof AllocationPolicy, change: number) => void,
    isProcessing: boolean,
    canIncrease: boolean,
    details: string
}) => (
    <div className="bg-panel p-2 border border-[#2a2a35] rounded-sm">
        <div className="flex justify-between items-center mb-1">
            <span className="text-[0.8rem] text-[#e0e0e0] font-bold flex items-center gap-1.5">{label}</span>
            <span className="text-xs text-[#888]">{details}</span>
        </div>
        <div className="flex items-center gap-2 justify-end">
            <button
                className="bg-transparent border border-[#5a2d2d] w-6 h-6 flex justify-center items-center cursor-pointer font-bold text-danger hover:border-danger hover:bg-[#222] disabled:opacity-20 disabled:cursor-not-allowed disabled:border-[#333]"
                onClick={() => onAdjust(role, -5)}
                disabled={isProcessing || percentage <= 0}
            >-</button>

            <div className="font-mono text-white min-w-[35px] text-center">
                <span className="text-white">{percentage}%</span>
            </div>

            <button
                className="bg-transparent border border-[#2d5a45] w-6 h-6 flex justify-center items-center cursor-pointer font-bold text-success hover:border-success hover:bg-[#222] disabled:opacity-20 disabled:cursor-not-allowed disabled:border-[#333]"
                onClick={() => onAdjust(role, 5)}
                disabled={isProcessing || !canIncrease}
            >+</button>
        </div>
    </div>
);

export const Allocation: React.FC<AllocationProps> = ({ state, allocation, onAllocate, isProcessing }) => {

    const totalAllocated = allocation.farmers + allocation.miners + allocation.soldiers;
    const scientistPercentage = 100 - totalAllocated;

    // Helper to estimate yield based on percentage
    const getEstimate = (role: 'farmers' | 'miners' | 'soldiers' | 'scientists', pct: number) => {
        const count = Math.floor(state.population.total * (pct / 100));

        if (role === 'farmers') {
            let yieldPer = 5; // Base
            if (state.techs['CROP_ROTATION'].unlocked) yieldPer *= 1.25;
            if (state.techs['HEAVY_PLOW'].unlocked) yieldPer *= 1.25;
            // Season ignored for simple preview, or could include? Let's genericize.
            // Growth calc preview
            // Growth calc preview
            // const totalPop = state.population.total || 1;
            const production = count * yieldPer;
            // Let's just say "Supports +X Pop/Day"
            return `~${Math.floor(production)} Food/day (${Math.floor(production / 1)} fed)`;
        }
        if (role === 'miners') {
            const shards = Math.floor(count * 0.5);
            let repair = count * 5;
            if (state.techs['MASONRY'].unlocked) repair *= 1.25;
            if (state.techs['OBSIDIAN_WALLS'].unlocked) repair *= 1.50;
            return `+${shards} Shards, +${Math.floor(repair)} Repair`;
        }
        if (role === 'soldiers') {
            let power = count * 2;
            if (state.techs['STEEL_WEAPONS'].unlocked) power *= 1.25;
            if (state.techs['IRON_ARMOR'].unlocked) power *= 1.20;
            return `Power: ${Math.floor(power)} (vs ${state.demonStrength.toFixed(0)})`;
        }
        if (role === 'scientists') {
            let knowledge = count * 5;
            if (state.techs['ARCANE_STUDIES'].unlocked) knowledge *= 1.25;
            return `+${Math.floor(knowledge)} Knowledge/day`;
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
        <div className="bg-[#101015] p-3 border border-[#333]">
            <div className="flex flex-col items-start gap-1 pb-2 border-b border-[#333] mb-3">
                <h3 className="text-[0.65rem] m-0 text-[#888] tracking-widest uppercase">CREW ASSIGNMENTS</h3>
                {/* Visual Bar of Distribution */}
                <div className="h-1.5 w-full bg-[#222] flex rounded-none overflow-hidden mt-1">
                    <div style={{ width: `${allocation.farmers}%` }} className="bg-success" title="Farmers"></div>
                    <div style={{ width: `${allocation.miners}%` }} className="bg-secondary" title="Miners"></div>
                    <div style={{ width: `${allocation.soldiers}%` }} className="bg-danger" title="Soldiers"></div>
                    <div style={{ width: `${scientistPercentage}%` }} className="bg-primary" title="Scientists"></div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-2">
                <ControlRow
                    label={<><Icon icon="game-icons:wheat" color="#2ecc71" /> HYDROPONICS</>} role="farmers"
                    percentage={allocation.farmers}
                    onAdjust={handleChange} isProcessing={isProcessing} canIncrease={totalAllocated < 100}
                    details={getEstimate('farmers', allocation.farmers)}
                />
                <ControlRow
                    label={<><Icon icon="game-icons:drill" color="#3498db" /> EXTRACTORS</>} role="miners"
                    percentage={allocation.miners}
                    onAdjust={handleChange} isProcessing={isProcessing} canIncrease={totalAllocated < 100}
                    details={getEstimate('miners', allocation.miners)}
                />
                <ControlRow
                    label={<><Icon icon="game-icons:police-badge" color="#00ccff" /> SECURITY</>} role="soldiers"
                    percentage={allocation.soldiers}
                    onAdjust={handleChange} isProcessing={isProcessing} canIncrease={totalAllocated < 100}
                    details={getEstimate('soldiers', allocation.soldiers)}
                />

                {/* Scientists are passive/free */}
                <div className="bg-[rgba(0,204,255,0.05)] p-2 border border-primary rounded-sm">
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-[0.8rem] text-[#e0e0e0] font-bold flex items-center gap-1.5"><Icon icon="game-icons:microscope" /> RESEARCH</span>
                        <span className="text-xs text-[#888]">{getEstimate('scientists', scientistPercentage)}</span>
                    </div>
                    <div className="flex items-center gap-2 justify-end">
                        <div className="font-mono text-primary text-center">
                            <span className="text-primary">{scientistPercentage}%</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
