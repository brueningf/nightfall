import React, { useEffect, useState } from 'react';
import type { GameNotification } from '../engine/types';
import { Icon } from '@iconify/react';
import '../index.css';

interface VisualNotificationsProps {
    notifications: GameNotification[];
    currentTurn: number;
}

export const VisualNotifications: React.FC<VisualNotificationsProps> = ({ notifications, currentTurn }) => {
    const [activeAlerts, setActiveAlerts] = useState<GameNotification[]>([]);

    useEffect(() => {
        // Show notifications generated in the *previous* turn (since turn auto-increments after processing)
        // effectively, these are the events that just happened.
        const recent = notifications.filter(n => n.turn === currentTurn - 1);
        setActiveAlerts(recent);

        // Auto-dismiss logic for minor alerts could go here, 
        // but for now we let them persist until the next turn (or user dismisses).
        const timer = setTimeout(() => {
            // setActiveAlerts([]); // Optional: Clean up after 5 seconds?
            // Actually, let's keep them on screen until user clicks next turn, 
            // OR just show them for a few seconds. The "Next Turn" clears them by virtue of changing the turn index.
        }, 5000);
        return () => clearTimeout(timer);
    }, [notifications, currentTurn]);

    if (activeAlerts.length === 0) return null;

    return (
        <div className="notifications-overlay" style={{
            position: 'absolute',
            top: '50px',
            left: '50%',
            transform: 'translateX(-50%)',
            pointerEvents: 'none', // Allow clicks through, unless hitting the card
            zIndex: 100,
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            alignItems: 'center',
            width: '80%',
            maxWidth: '400px'
        }}>
            {activeAlerts.map(note => (
                <div key={note.id} className={`notification-card ${note.type.toLowerCase()}`} style={{
                    background: 'rgba(0, 20, 40, 0.95)',
                    border: `1px solid ${getBorderColor(note.type)}`,
                    padding: '15px 20px',
                    borderRadius: '4px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
                    pointerEvents: 'auto',
                    animation: 'slideDown 0.3s ease-out',
                    width: '100%',
                    backdropFilter: 'blur(4px)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '15px'
                }}>
                    <div style={{ fontSize: '2rem', color: getBorderColor(note.type) }}>
                        <Icon icon={getIcon(note.type)} />
                    </div>
                    <div>
                        <h4 style={{ margin: '0 0 5px 0', color: getBorderColor(note.type), textTransform: 'uppercase', fontSize: '0.9rem', letterSpacing: '1px' }}>
                            {note.title}
                        </h4>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: '#ddd', lineHeight: '1.3' }}>
                            {note.message}
                        </p>
                    </div>
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

function getIcon(type: string): string {
    switch (type) {
        case 'RESEARCH_COMPLETE': return 'game-icons:test-tubes';
        case 'ATTACK': return 'game-icons:broken-shield';
        case 'VICTORY': return 'game-icons:trophy';
        case 'DEFEAT': return 'game-icons:skull-crossed-bones';
        default: return 'game-icons:info-circle';
    }
}
