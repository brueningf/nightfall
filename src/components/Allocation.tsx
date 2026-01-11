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
    <div className="allocation-row">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <span className="role-label" style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' }}>{label}</span>
            <span style={{ fontSize: '0.75rem', color: '#888' }}>{details}</span>
        </div>
        <div className="control-group">
            <button
                className="adjust-btn minus"
                onClick={() => onAdjust(role, -5)}
                disabled={isProcessing || percentage <= 0}
            >-</button>

            <div className="role-readout">
                <span className="role-pct">{percentage}%</span>
            </div>

            <button
                className="adjust-btn plus"
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
            const totalPop = state.population.total || 1;
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
        <div className="allocation-panel">
            <div className="allocation-header">
                <h3>CREW ASSIGNMENTS</h3>
                {/* Visual Bar of Distribution */}
                <div style={{ height: '6px', width: '100%', background: '#222', display: 'flex', marginTop: '5px', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: `${allocation.farmers}%`, background: 'var(--color-success)' }} title="Farmers"></div>
                    <div style={{ width: `${allocation.miners}%`, background: 'var(--color-secondary)' }} title="Miners"></div>
                    <div style={{ width: `${allocation.soldiers}%`, background: 'var(--color-danger)' }} title="Soldiers"></div>
                    <div style={{ width: `${scientistPercentage}%`, background: 'var(--color-primary)' }} title="Scientists"></div>
                </div>
            </div>

            <div className="allocation-grid">
                <ControlRow
                    label={<><Icon icon="game-icons:techno-heart" color="#e69024" /> HYDROPONICS</>} role="farmers"
                    percentage={allocation.farmers}
                    onAdjust={handleChange} isProcessing={isProcessing} canIncrease={totalAllocated < 100}
                    details={getEstimate('farmers', allocation.farmers)}
                />
                <ControlRow
                    label={<><Icon icon="game-icons:drill" color="#aaa" /> EXTRACTORS</>} role="miners"
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
                <div className="allocation-row passive">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <span className="role-label" style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' }}><Icon icon="game-icons:microscope" /> RESEARCH</span>
                        <span style={{ fontSize: '0.75rem', color: '#888' }}>{getEstimate('scientists', scientistPercentage)}</span>
                    </div>
                    <div className="control-group">
                        <div className="role-readout">
                            <span className="role-pct" style={{ color: 'var(--color-primary)' }}>{scientistPercentage}%</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
