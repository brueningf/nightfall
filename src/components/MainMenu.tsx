import React, { useState, useEffect } from 'react';
import { hasSaveGame } from '../engine/persistence';
import type { Difficulty } from '../engine/types';
import { Icon } from '@iconify/react';
import { audioController } from '../engine/audio';

interface MainMenuProps {
    onNewGame: (difficulty: Difficulty) => void;
    onContinue: () => void;
    onOpenInfo: () => void;
    onOpenSettings: () => void;
    onOpenScores: () => void;
}


export const MainMenu: React.FC<MainMenuProps> = ({ onNewGame, onContinue, onOpenInfo, onOpenSettings, onOpenScores }) => {
    const canContinue = hasSaveGame();
    const [selectedDiff, setSelectedDiff] = useState<Difficulty>('VETERAN');
    const [installPrompt, setInstallPrompt] = useState<any>(null);

    useEffect(() => {
        const handler = (e: any) => {
            e.preventDefault();
            setInstallPrompt(e);
        };
        window.addEventListener('beforeinstallprompt', handler);
        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleInstall = () => {
        if (!installPrompt) return;
        installPrompt.prompt();
        installPrompt.userChoice.then((choiceResult: any) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the install prompt');
            }
            setInstallPrompt(null);
        });
    };

    return (
        <div className="flex flex-col justify-center items-center h-full w-full text-center overflow-y-auto bg-cover bg-center p-5 text-shadow-sm"
            style={{ backgroundImage: `url(/scene_intro.png)`, textShadow: '0 2px 4px black' }}>

            <div className="absolute inset-0 w-full h-full bg-black/60 z-0 pointer-events-none"></div>

            <div className="relative z-10 mb-5">
                <h1 className="text-[clamp(2rem,10vw,3rem)] text-white mb-1 tracking-[0.2em] font-main"
                    style={{ textShadow: '0 0 10px rgba(255, 255, 255, 0.5)' }}>
                    NIGHTFALL
                </h1>
                <p className="text-gray-400 italic font-serif mb-10">The Darkness Comes For All</p>

                {installPrompt && (
                    <button onClick={handleInstall}
                        className="mt-2 bg-transparent border border-primary text-primary py-2 px-4 rounded-full cursor-pointer text-xs font-bold flex items-center gap-1 mx-auto hover:bg-primary hover:text-black transition-colors">
                        <Icon icon="game-icons:download" /> INSTALL APP
                    </button>
                )}
            </div>

            <div className="relative z-20 flex flex-col space-y-8 w-full max-w-[320px] items-center">
                {canContinue && (
                    <button className="bg-[#1a1a1a] border border-[#444] text-[#ccc] py-5 px-6 text-sm uppercase cursor-pointer transition-all duration-200 flex items-center justify-center gap-4 w-full hover:bg-[#333] hover:border-[#666] hover:text-white hover:translate-x-1"
                        onClick={() => {
                            audioController.playClick();
                            onContinue();
                        }}>
                        <span><Icon icon="game-icons:play-button" /></span> CONTINUE
                    </button>
                )}

                <div className="w-full bg-black/50 p-5 rounded-lg border border-[#333]">
                    <div className="text-gray-500 text-xs mb-3 uppercase tracking-wider">Difficulty Level</div>
                    <div className="flex gap-2">
                        {['RECRUIT', 'VETERAN', 'COMMANDER', 'LEGEND'].map(diff => (
                            <button
                                key={diff}
                                className={`flex-1 py-2 px-1 text-[0.6rem] border cursor-pointer transition-colors ${selectedDiff === diff
                                    ? 'bg-primary text-black border-primary font-bold'
                                    : 'bg-[#222] text-[#888] border-[#444] hover:bg-[#333]'}`}
                                onClick={() => setSelectedDiff(diff as Difficulty)}
                            >
                                {diff}
                            </button>
                        ))}
                    </div>
                </div>

                <button className="bg-[#1a332a] border border-[#2d5a45] text-[#4cd964] py-5 px-6 text-sm uppercase cursor-pointer transition-all duration-200 flex items-center justify-center gap-4 w-full hover:bg-[#2d5a45] hover:text-white hover:translate-x-1 font-bold"
                    onClick={() => {
                        audioController.playClick();
                        onNewGame(selectedDiff);
                    }}>
                    <span><Icon icon="game-icons:rocket" /></span> NEW GAME
                </button>

                <button className="bg-[#1a1a1a] border border-[#444] text-[#ccc] py-5 px-6 text-sm uppercase cursor-pointer transition-all duration-200 flex items-center justify-center gap-4 w-full hover:bg-[#333] hover:border-[#666] hover:text-white hover:translate-x-1"
                    onClick={() => { audioController.playClick(); onOpenInfo(); }}>
                    <span><Icon icon="game-icons:info" /></span> DATA ARCHIVES
                </button>

                <button className="bg-[#1a1a1a] border border-[#444] text-[#ccc] py-5 px-6 text-sm uppercase cursor-pointer transition-all duration-200 flex items-center justify-center gap-4 w-full hover:bg-[#333] hover:border-[#666] hover:text-white hover:translate-x-1"
                    onClick={() => { audioController.playClick(); onOpenScores(); }}>
                    <span><Icon icon="game-icons:trophy" /></span> HALL OF FAME
                </button>

                <button className="bg-[#1a1a1a] border border-[#444] text-[#ccc] py-5 px-6 text-sm uppercase cursor-pointer transition-all duration-200 flex items-center justify-center gap-4 w-full hover:bg-[#333] hover:border-[#666] hover:text-white hover:translate-x-1"
                    onClick={() => { audioController.playClick(); onOpenSettings(); }}>
                    <span><Icon icon="game-icons:gears" /></span> SETTINGS
                </button>
            </div>

            <div className="absolute bottom-2 right-2 text-[#444] text-xs">v0.5 Alpha</div>
        </div>
    );
};
