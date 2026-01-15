import React from 'react';
import type { GameState } from '../engine/types';
import { SoldierIcon, FarmerIcon, HeroIcon } from './GameIcons';

// Import images
// fortressBase removed, using public/fortress_window.png directly
import fireOverlay from '../assets/overlay_fire.png';

import { VisualNotifications } from './VisualNotifications';

interface VisualFortressProps {
    state: GameState;
}

export const VisualFortress: React.FC<VisualFortressProps> = ({ state }) => {
    // No seasons in Eternal Night.
    const hasFarmers = state.population.farmers > 0;
    const hasSoldiers = state.population.soldiers > 0;
    const isDamageHigh = state.wallHealth < state.maxWallHealth * 0.5;
    const isSallyForth = state.stance === 'SALLY_FORTH';

    // Calculate fire opacity based on damage
    const fireOpacity = isDamageHigh ? 1 - (state.wallHealth / (state.maxWallHealth * 0.5)) : 0;

    return (
        <div className="relative w-full h-[200px] overflow-hidden bg-black border border-[#333] shrink-0 shadow-[inset_0_0_50px_rgba(0,0,0,0.8)]">
            {/* Notifications Overlay */}
            <VisualNotifications notifications={state.notifications} currentTurn={state.turn} />

            {/* Base Layer */}
            <img src="/fortress_window.jpg" className="absolute inset-0 w-full h-full object-cover pointer-events-none transition-all duration-500 opacity-100 [image-rendering:pixelated] z-[1]" alt="Fortress" />

            {/* Economy Layer (SVG) */}
            <div className={`absolute inset-0 w-full h-full pointer-events-none transition-all duration-500 z-[2] flex items-end origin-bottom-left scale-90 bottom-0 left-[10px] ${hasFarmers ? 'opacity-100' : 'opacity-0'}`}>
                <FarmerIcon count={Math.min(state.population.farmers, 5)} />
            </div>

            {/* Army Layer (SVG) */}
            <div className={`absolute inset-0 w-full h-full pointer-events-none transition-all duration-500 z-[3] flex justify-center ${isSallyForth
                ? 'top-auto bottom-[5px] left-[60%] translate-x-0 scale-90'
                : 'top-[45%] left-1/2 -translate-x-1/2 scale-60'} ${hasSoldiers ? 'opacity-100' : 'opacity-0'}`}>
                <SoldierIcon count={Math.min(state.population.soldiers, 5)} />
            </div>

            {/* Hero Layer (SVG) */}
            {state.hero.status === 'READY' && (
                <div className={`absolute inset-0 w-full h-full pointer-events-none transition-all duration-500 z-[4] block ${isSallyForth
                    ? 'top-auto bottom-[5px] left-[80%] scale-80'
                    : 'top-[35%] left-[48%] scale-60'}`}>
                    <HeroIcon level={state.hero.level} />
                </div>
            )}

            {/* Atmosphere Layer - Void Mist? (Reusing snow overlay for now as distinct layer if needed, or removing) */}
            {/* Removed Winter Snow Logic */}

            {/* Damage Layer */}
            <img
                src={fireOverlay}
                className="absolute inset-0 w-full h-full object-cover pointer-events-none transition-all duration-500 z-[6] mix-blend-hard-light"
                style={{ opacity: fireOpacity }}
                alt="Fire"
            />
        </div>
    );
};
