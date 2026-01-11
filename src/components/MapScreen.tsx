import React from 'react';
import type { GameState } from '../engine/types';
import { Icon } from '@iconify/react';

interface MapScreenProps {
    state: GameState;
}

export const MapScreen: React.FC<MapScreenProps> = ({ state }) => {
    return (
        <div className="map-screen">
            <div className="map-fortress">
                <div className="icon"><Icon icon="game-icons:tower-flag" width={32} height={32} /></div>
                <div className="label">Base Alpha</div>
            </div>

            {state.hellGates.map(gate => (
                <div
                    key={gate.id}
                    className={`map-gate ${gate.status.toLowerCase()}`}
                    style={{ bottom: `${gate.distance / 2}%`, left: `${(parseInt(gate.id.slice(1)) * 30) % 80 + 10}%` }} // Quick pseudo-random position
                >
                    <div className="icon"><Icon icon="game-icons:portal" width={24} height={24} color={gate.status === 'DORMANT' ? '#666' : '#ff3333'} /></div>
                    <div className="label">{gate.name}</div>
                    <div className="distance">{gate.distance}km</div>
                    <div className="activity">Threat: {gate.activity}%</div>
                </div>
            ))}

            <div className="map-grid-lines"></div>
        </div>
    );
};
