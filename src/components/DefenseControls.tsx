import React from 'react';
import type { DefenseStance, Hero } from '../engine/types';
import { Icon } from '@iconify/react';

interface DefenseControlsProps {
    currentStance: DefenseStance;
    hero: Hero;
    onSetStance: (stance: DefenseStance) => void;
}

export const DefenseControls: React.FC<DefenseControlsProps> = ({ currentStance, hero, onSetStance }) => {
    return (
        <div className="defense-controls-compact">
            <div className="stance-row">
                <button
                    className={`stance-btn ${currentStance === 'STANDARD' ? 'active' : ''}`}
                    onClick={() => onSetStance('STANDARD')}
                    title="Standard Defense"
                    style={{ fontSize: '0.65rem', padding: '4px 8px', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                    <Icon icon="game-icons:shield" style={{ fontSize: '1rem' }} /> DEFEND
                </button>
                <button
                    className={`stance-btn ${currentStance === 'MAN_THE_WALLS' ? 'active' : ''}`}
                    onClick={() => onSetStance('MAN_THE_WALLS')}
                    title="Man the Walls (+Def, -Repair)"
                    style={{ fontSize: '0.65rem', padding: '4px 8px', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                    <Icon icon="game-icons:tower-flag" style={{ fontSize: '1rem' }} /> FORTIFY
                </button>
                <button
                    className={`stance-btn danger ${currentStance === 'SALLY_FORTH' ? 'active' : ''}`}
                    onClick={() => onSetStance('SALLY_FORTH')}
                    title="Sally Forth (2x Dmg, Risk Deaths)"
                    style={{ fontSize: '0.65rem', padding: '4px 8px', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                    <Icon icon="game-icons:crossed-swords" style={{ fontSize: '1rem' }} /> ATTACK
                </button>
            </div>

            <div className="hero-status-compact">
                <span className="hero-lvl">Lvl {hero.level}</span>
                <span className="hero-name">Commander</span>
                <div className="hero-xp-bar">
                    <div className="hero-xp-fill" style={{ width: `${(hero.xp / (hero.level * 100)) * 100}%` }}></div>
                </div>
            </div>
        </div>
    );
};
