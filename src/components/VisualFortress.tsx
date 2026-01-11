import React from 'react';
import type { GameState } from '../engine/types';
import { SoldierIcon, FarmerIcon, HeroIcon } from './GameIcons';

// Import images
// fortressBase removed, using public/fortress_window.png directly
import snowOverlay from '../assets/overlay_snow.png';
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
        <div className="visual-fortress-container">
            {/* Notifications Overlay */}
            <VisualNotifications notifications={state.notifications} currentTurn={state.turn} />

            {/* Base Layer */}
            <img src="/fortress_window.jpg" className="layer base" alt="Fortress" />

            {/* Economy Layer (SVG) */}
            <div className={`layer farmers-container ${hasFarmers ? 'visible' : ''}`}>
                <FarmerIcon count={Math.min(state.population.farmers, 5)} />
            </div>

            {/* Army Layer (SVG) */}
            <div className={`layer soldiers-container ${hasSoldiers ? 'visible' : ''} ${isSallyForth ? 'sally-forth' : ''}`}>
                <SoldierIcon count={Math.min(state.population.soldiers, 5)} />
            </div>

            {/* Hero Layer (SVG) */}
            {state.hero.status === 'READY' && (
                <div className={`layer hero-container ${isSallyForth ? 'hero-charge' : ''}`}>
                    <HeroIcon level={state.hero.level} />
                </div>
            )}

            {/* Atmosphere Layer - Void Mist? (Reusing snow overlay for now as distinct layer if needed, or removing) */}
            {/* Removed Winter Snow Logic */}

            {/* Damage Layer */}
            <img
                src={fireOverlay}
                className="layer damage"
                style={{ opacity: fireOpacity }}
                alt="Fire"
            />
        </div>
    );
};
