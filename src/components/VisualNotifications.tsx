import React, { useEffect, useState } from 'react';
import type { GameNotification } from '../engine/types';
import '../index.css';

interface VisualNotificationsProps {
    notifications: GameNotification[];
    currentTurn: number;
}

export const VisualNotifications: React.FC<VisualNotificationsProps> = ({ notifications, currentTurn }) => {
    const [activeAlerts, setActiveAlerts] = useState<GameNotification[]>([]);

    useEffect(() => {
        // Show notifications generated in the *previous* turn
        const recent = notifications.filter(n => n.turn === currentTurn - 1);
        setActiveAlerts(recent);

        // Auto-dismiss after 3 seconds
        const timer = setTimeout(() => {
            setActiveAlerts([]);
        }, 3000);
        return () => clearTimeout(timer);
    }, [notifications, currentTurn]);

    if (activeAlerts.length === 0) return null;

    return (
        <div className="notifications-overlay" style={{
            position: 'absolute',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            pointerEvents: 'none',
            zIndex: 100,
            display: 'flex',
            flexDirection: 'column',
            gap: '5px',
            alignItems: 'center',
            width: '90%',
            maxWidth: '400px'
        }}>
            {activeAlerts.map(note => (
                <div key={note.id} className={`notification-card ${note.type.toLowerCase()}`} style={{
                    background: 'rgba(0, 10, 20, 0.95)',
                    borderLeft: `3px solid ${getBorderColor(note.type)}`,
                    borderTop: '1px solid #333',
                    borderRight: '1px solid #333',
                    borderBottom: '1px solid #333',
                    padding: '8px 12px',
                    borderRadius: '2px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.5)',
                    pointerEvents: 'auto',
                    animation: 'slideDown 0.3s ease-out, fadeOut 0.5s ease-in 2.5s forwards',
                    width: '100%',
                    backdropFilter: 'blur(4px)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h4 style={{ margin: 0, color: getBorderColor(note.type), textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.5px' }}>
                            {note.title}
                        </h4>
                    </div>
                    <p style={{ margin: '2px 0 0 0', fontSize: '0.75rem', color: '#ccc', lineHeight: '1.2' }}>
                        {note.message}
                    </p>
                </div>
            ))}
        </div>
    );
};

function getBorderColor(type: string): string {
    switch (type) {
        case 'RESEARCH_COMPLETE': return 'var(--color-primary)'; // Sky Blue
        case 'ATTACK': return 'var(--color-accent)'; // Red
        case 'VICTORY': return 'var(--color-secondary)'; // Purple
        case 'DEFEAT': return '#666';
        default: return '#fff';
    }
}


