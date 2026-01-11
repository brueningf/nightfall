import React from 'react';

interface EventLogProps {
    logs: string[];
}

export const EventLog: React.FC<EventLogProps> = ({ logs }) => {
    return (
        <div className="event-log">
            <h3>Journal</h3>
            <ul>
                {logs.map((log, index) => (
                    <li key={index} className="log-entry">{log}</li>
                ))}
            </ul>
        </div>
    );
};
