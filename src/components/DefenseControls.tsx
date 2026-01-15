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
        <div className="flex flex-col gap-1.5 p-2 bg-[#111116] border border-[#333] mt-2">
            <div className="flex gap-1">
                <button
                    className={`flex-1 bg-[#151515] text-[#666] border border-[#333] py-1 px-2 cursor-pointer text-[0.65rem] transition-all uppercase font-bold hover:bg-[#222] hover:text-white hover:border-[#555] flex items-center justify-center gap-1 ${currentStance === 'STANDARD' ? 'bg-primary/10 text-primary border-primary shadow-[0_0_8px_rgba(0,204,255,0.2)] border-b-primary' : ''}`}
                    onClick={() => onSetStance('STANDARD')}
                    title="Standard Defense"
                >
                    <Icon icon="game-icons:shield" className="text-base" /> DEFEND
                </button>
                <button
                    className={`flex-1 bg-[#151515] text-[#666] border border-[#333] py-1 px-2 cursor-pointer text-[0.65rem] transition-all uppercase font-bold hover:bg-[#222] hover:text-white hover:border-[#555] flex items-center justify-center gap-1 ${currentStance === 'MAN_THE_WALLS' ? 'bg-primary/10 text-primary border-primary shadow-[0_0_8px_rgba(0,204,255,0.2)] border-b-primary' : ''}`}
                    onClick={() => onSetStance('MAN_THE_WALLS')}
                    title="Man the Walls (+Def, -Repair)"
                >
                    <Icon icon="game-icons:tower-flag" className="text-base" /> FORTIFY
                </button>
                <button
                    className={`flex-1 bg-[#151515] text-[#666] border border-[#333] py-1 px-2 cursor-pointer text-[0.65rem] transition-all uppercase font-bold hover:bg-[#222] hover:text-white hover:border-[#555] flex items-center justify-center gap-1 ${currentStance === 'SALLY_FORTH' ? 'bg-danger/10 text-danger border-danger shadow-[0_0_8px_rgba(255,51,51,0.2)] border-b-danger' : ''}`}
                    onClick={() => onSetStance('SALLY_FORTH')}
                    title="Sally Forth (2x Dmg, Risk Deaths)"
                >
                    <Icon icon="game-icons:crossed-swords" className="text-base" /> ATTACK
                </button>
            </div>

            <div className="flex items-center gap-2 bg-[rgba(255,204,0,0.05)] border-l-2 border-warning p-1.5 text-[0.7rem]">
                <span className="font-bold text-warning">Lvl {hero.level}</span>
                <span className="text-white">Commander</span>
                <div className="flex-1 h-1 bg-[#222] overflow-hidden">
                    <div className="h-full bg-warning shadow-[0_0_5px_var(--color-warning)]" style={{ width: `${(hero.xp / (hero.level * 100)) * 100}%` }}></div>
                </div>
            </div>
        </div>
    );
};
