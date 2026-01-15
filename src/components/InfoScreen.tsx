import React, { useState } from 'react';

interface InfoScreenProps {
    onBack: () => void;
}

export const InfoScreen: React.FC<InfoScreenProps> = ({ onBack }) => {
    const [tab, setTab] = useState<'STORY' | 'RULES'>('STORY');

    return (
        <div className="h-full w-full bg-[#111] flex flex-col">
            <header className="bg-[#222] p-4 flex justify-between items-center border-b border-[#333] shrink-0">
                <h2 className="text-white m-0 text-xl tracking-widest font-bold">ARCHIVES</h2>
                <button className="bg-none border-none text-[#666] text-2xl cursor-pointer hover:text-white transition-colors p-1" onClick={onBack}>✖</button>
            </header>

            <div className="flex border-b border-[#333] shrink-0">
                <button className={`flex-1 py-3 bg-transparent border-none font-bold cursor-pointer transition-colors uppercase tracking-wider ${tab === 'STORY' ? 'bg-[#222] text-primary border-b-2 border-primary' : 'text-[#666] hover:bg-[#1a1a1a] hover:text-[#bbb]'}`} onClick={() => setTab('STORY')}>LORE</button>
                <button className={`flex-1 py-3 bg-transparent border-none font-bold cursor-pointer transition-colors uppercase tracking-wider ${tab === 'RULES' ? 'bg-[#222] text-primary border-b-2 border-primary' : 'text-[#666] hover:bg-[#1a1a1a] hover:text-[#bbb]'}`} onClick={() => setTab('RULES')}>GUIDE</button>
            </div>

            <div className="p-5 overflow-y-auto leading-relaxed text-[#ccc] text-sm flex-1">
                {tab === 'STORY' ? (
                    <div className="flex flex-col gap-4">
                        <img src="/scene_intro.png" alt="Shattered Sun" className="w-full rounded mb-1 border border-[#333]" />
                        <h3 className="text-lg text-white font-bold mb-1">Year 60,057: The Shattered Sun</h3>
                        <p>We survived the climate collapses. We tamed the storms. We thought we were safe.</p>
                        <p>Then, the Sun shattered.</p>
                        <p>A cosmic entity—a Demon of the Void—drank our star’s fire, plunging us into eternal night. Now, five years later, the only illumination comes from "Shard Light," a technology born of desperation, fueled by crystals harvested from the very cracks where the demons rise.</p>
                        <p>The great cities have fallen. Only our subterranean fortress remains.</p>
                        <p>Our Shard stockpiles are depleting. The demons hunger for our light. But there is a whisper of hope. Our scientists speak of "Incendium"—an ancient power that might finally push back the darkness.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <h3 className="text-lg text-white font-bold mb-2">Fortress Command Guide</h3>
                        <ul className="list-disc pl-5 space-y-2 text-[#ccc]">
                            <li><strong className="text-white">Food:</strong> Farmers use Shard Light to grow crops. Starvation kills.</li>
                            <li><strong className="text-white">Defense:</strong> Soldiers defend the gates. Walls take damage first.</li>
                            <li><strong className="text-white">Miners:</strong> Maintain fortress integrity (Repair) and harvest <strong className="text-secondary">Shards</strong>.</li>
                            <li><strong className="text-white">Scientists:</strong> Generate Knowledge to research technologies.</li>
                            <li><strong className="text-secondary">Shards:</strong> Stockpile these to <strong className="text-secondary">BANISH</strong> demons or allow Scholars to study them.</li>
                            <li><strong className="text-white">Stances:</strong>
                                <ul className="list-circle pl-5 mt-1 space-y-1 text-[#aaa]">
                                    <li><em className="text-white">Standard:</em> Balanced approach.</li>
                                    <li><em className="text-primary">Man the Walls:</em> +50% Defense, -50% Repair.</li>
                                    <li><em className="text-danger">Sally Forth:</em> High Defense/Damage, High Risk of Death.</li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};
