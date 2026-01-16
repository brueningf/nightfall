import React from 'react';
import type { GameState } from '../engine/types';
import { Icon } from '@iconify/react';

interface MapScreenProps {
    state: GameState;
}

export const MapScreen: React.FC<MapScreenProps> = ({ state }) => {
    return (
        <div className="flex-1 w-full bg-[#050510] relative overflow-hidden min-h-0 flex flex-col items-center justify-center border border-[#333] rounded">
            {/* Radar Background Effects */}
            <div className="absolute inset-0 opacity-20 pointer-events-none"
                style={{
                    backgroundImage: `
                        radial-gradient(circle at theme('spacing.1/2') 100%, transparent 69%, #00ccff 70%, transparent 71%),
                        radial-gradient(circle at 50% 100%, transparent 49%, #00ccff 50%, transparent 51%),
                        linear-gradient(rgba(0, 204, 255, 0.1) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(0, 204, 255, 0.1) 1px, transparent 1px)
                    `,
                    backgroundSize: '100% 100%, 100% 100%, 40px 40px, 40px 40px'
                }}>
            </div>

            {/* Header/Status */}
            <div className="absolute top-2 left-2 text-[#00ccff] text-xs font-mono tracking-widest opacity-80 z-10">
                <div>SCANNING SECTOR...</div>
                <div>THREAT LEVEL: {state.demonStrength.toFixed(1)}</div>
            </div>

            {/* Map Area - Constrained Aspect for positioning */}
            <div className="relative w-full h-full max-w-[400px] max-h-[400px]">

                {/* Center / Fortress */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center z-20">
                    <div className="relative">
                        <div className="absolute inset-0 bg-primary blur-[10px] opacity-30 rounded-full animate-pulse"></div>
                        <Icon icon="game-icons:tower-flag" width={48} height={48} className="text-white drop-shadow-[0_0_5px_rgba(0,204,255,0.8)] relative z-10" />
                    </div>
                    <div className="text-[0.6rem] text-primary font-bold mt-1 bg-black/50 px-1 rounded backdrop-blur-sm">BASE ALPHA</div>
                </div>

                {/* Gates / Threats */}
                {state.hellGates.map(gate => {
                    // Convert distance to vertical percentage (closer = lower/nearer 100% from top in standard coords, but we want bottom up)
                    // Let's assume max distance is ~1000km, min is 0.
                    // Visual mapping: 0km = bottom: 15% (above base), 1000km = bottom: 90%.
                    const maxDist = 1000;
                    const normalizedDist = Math.max(0, Math.min(1000, gate.distance));
                    const bottomPos = 15 + ((normalizedDist / maxDist) * 75);

                    // Horizontal position: use ID hash or consistent random spread
                    const idNum = parseInt(gate.id.replace(/\D/g, '') || '0');
                    const leftPos = 20 + ((idNum * 37) % 60); // Keep between 20% and 80%

                    const isActive = gate.status !== 'DORMANT';
                    const color = isActive ? 'text-[#ff3333]' : 'text-[#666]';
                    const shadow = isActive ? 'drop-shadow-[0_0_8px_rgba(255,51,51,0.8)]' : '';

                    return (
                        <div
                            key={gate.id}
                            className={`absolute flex flex-col items-center transition-all duration-1000`}
                            style={{
                                bottom: `${bottomPos}%`,
                                left: `${leftPos}%`,
                                transform: 'translateX(-50%)'
                            }}
                        >
                            <Icon
                                icon="game-icons:portal"
                                width={gate.status === 'ACTIVE' ? 32 : 24}
                                height={gate.status === 'ACTIVE' ? 32 : 24}
                                className={`${color} ${shadow} mb-0.5`}
                            />
                            <div className="flex flex-col items-center bg-black/60 px-1.5 py-0.5 rounded border border-white/10 backdrop-blur-sm">
                                <span className={`text-[0.6rem] font-bold whitespace-nowrap ${color}`}>{gate.name}</span>
                                <span className="text-[0.55rem] text-[#aaa] font-mono leading-none">{gate.distance}km</span>
                                {isActive && <span className="text-[0.55rem] text-danger font-bold animate-pulse">! {gate.activity}% !</span>}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Scanning Line Animation */}
            <div className="absolute inset-0 bg-[linear-gradient(transparent,rgba(0,204,255,0.2),transparent)] h-[20%] w-full animate-[scan_4s_linear_infinite] pointer-events-none border-b border-[#00ccff]/30"></div>

            <style>{`
                @keyframes scan {
                    0% { top: -20%; }
                    100% { top: 120%; }
                }
            `}</style>
        </div>
    );
};
