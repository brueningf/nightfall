import React from 'react';

interface GameOverScreenProps {
    daysSurvived: number;
    reason: string;
    onRestart: () => void;
}

export const GameOverScreen: React.FC<GameOverScreenProps> = ({ daysSurvived, reason, onRestart }) => {
    return (
        <div className="h-full w-full flex flex-col justify-center items-center bg-black text-[#a00] overflow-y-auto">
            <h1 className="text-5xl mb-2 tracking-[5px] uppercase font-bold">FALLEN</h1>
            <div className="text-6xl my-5">☠</div>
            <p className="text-[#888] mb-8 italic">{reason}</p>
            <div className="bg-[#111] border border-[#333] p-5 w-[80%] max-w-[300px] mb-8">
                <div className="flex justify-between text-[#ccc]">
                    <span>Days Survived:</span>
                    <span className="font-bold">{daysSurvived}</span>
                </div>
            </div>
            <button className="bg-[#a00] text-white border-none py-4 px-10 text-xl uppercase cursor-pointer transition-all hover:bg-[#f00] hover:shadow-[0_0_20px_#800]" onClick={onRestart}>
                TRY AGAIN
            </button>
        </div>
    );
};
