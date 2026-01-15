import React from 'react';

interface EventLogProps {
    logs: string[];
}

export const EventLog: React.FC<EventLogProps> = ({ logs }) => {
    return (
        <div className="flex-1 min-h-0 bg-[#0a0a0e] border border-[#333] p-2.5 overflow-y-auto font-mono text-[0.8rem] text-[#aaa]">
            <h3 className="text-[0.9rem] mb-1.5 text-[#666] border-b border-[#222] pb-1 sticky top-0 bg-[#111] z-10 uppercase tracking-widest">Journal</h3>
            <ul className="list-none">
                {logs.map((log, index) => (
                    <li key={index} className="mb-1 border-b border-[#222] pb-0.5 break-words">{log}</li>
                ))}
            </ul>
        </div>
    );
};
