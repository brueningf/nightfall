import React from 'react';
import { Icon } from '@iconify/react';

export const SoldierIcon = ({ count = 1, className = "" }: { count?: number, className?: string }) => {
    return (
        <div className={`soldier-group ${className}`} style={{ display: 'flex', gap: '2px' }}>
            {Array.from({ length: Math.min(count, 5) }).map((_, i) => (
                <Icon
                    key={i}
                    icon="game-icons:space-marine"
                    className="icon-soldier"
                    width="40"
                    height="40"
                    color="#00ccff"
                />
            ))}
        </div>
    );
};

export const FarmerIcon = ({ count = 1, className = "" }: { count?: number, className?: string }) => {
    return (
        <div className={`farmer-group ${className}`} style={{ display: 'flex', gap: '5px' }}>
            {Array.from({ length: Math.min(count, 5) }).map((_, i) => (
                <Icon
                    key={i}
                    icon="game-icons:techno-heart"
                    className="icon-farmer"
                    width="32"
                    height="32"
                    color="#e69024"
                />
            ))}
        </div>
    );
};

export const HeroIcon = ({ level = 1, className = "" }: { level?: number, className?: string }) => (
    <Icon
        icon="game-icons:power-armor"
        className={`icon-hero ${className}`}
        width="64"
        height="64"
        color="#ffd700"
    />
);

// Particle effects can still be CSS, but let's make a simple SVG overlay for snow if needed
// But CSS particles are usually better for snow.
