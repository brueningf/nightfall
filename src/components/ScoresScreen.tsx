import React from 'react';

interface ScoresScreenProps {
    onBack: () => void;
}

export const ScoresScreen: React.FC<ScoresScreenProps> = ({ onBack }) => {
    // Mock data for now
    const scores = [
        { name: "Commander A.", days: 12, cause: "Overrun" },
        { name: "Commander B.", days: 8, cause: "Starvation" },
        { name: "Commander C.", days: 5, cause: "Unknown" },
    ];

    return (
        <div className="h-full w-full bg-[#111] flex flex-col">
            <header className="bg-[#222] p-4 flex justify-between items-center border-b border-[#333] shrink-0">
                <h2 className="text-white m-0 text-xl tracking-widest font-bold">HALL OF HEROES</h2>
                <button className="bg-none border-none text-[#666] text-2xl cursor-pointer hover:text-white transition-colors p-1" onClick={onBack}>✖</button>
            </header>

            <div className="p-5 overflow-y-auto flex-1">
                <table className="w-full border-collapse text-[#ccc]">
                    <thead>
                        <tr className="border-b border-[#444] text-left">
                            <th className="p-2.5">Name</th>
                            <th className="p-2.5">Days</th>
                            <th className="p-2.5">Fate</th>
                        </tr>
                    </thead>
                    <tbody>
                        {scores.map((score, i) => (
                            <tr key={i} className="border-b border-[#222]">
                                <td className="p-2.5">{score.name}</td>
                                <td className="p-2.5 text-[#4cd964]">{score.days}</td>
                                <td className="p-2.5 italic text-[#888]">{score.cause}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
