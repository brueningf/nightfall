import React from 'react';
import { Icon } from '@iconify/react';

interface VictoryScreenProps {
    daysSurvived: number;
    onRestart: () => void;
}

export const VictoryScreen: React.FC<VictoryScreenProps> = ({ daysSurvived, onRestart }) => {
    return (
        <div className="game-over-screen" style={{
            backgroundImage: `url(/scene_victory.jpg)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            textAlign: 'center',
            height: '100vh',
            width: '100vw'
        }}>
            <div className="overlay" style={{
                position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                background: 'linear-gradient(to bottom, rgba(255, 230, 150, 0.1), rgba(0,0,0,0.8))',
                zIndex: 0
            }}></div>

            <div style={{ position: 'relative', zIndex: 1, padding: '40px', background: 'rgba(0,0,0,0.6)', borderRadius: '12px', border: '1px solid #ffd700' }}>
                <Icon icon="game-icons:sun" width={80} height={80} color="#ffd700" style={{ marginBottom: '20px', filter: 'drop-shadow(0 0 10px #ffd700)' }} />

                <h1 style={{
                    fontFamily: "'Cinzel', serif",
                    fontSize: '3rem',
                    color: '#ffd700',
                    textShadow: '0 0 20px rgba(255, 215, 0, 0.5)',
                    margin: '0 0 10px 0'
                }}>
                    DAWN HAS COME
                </h1>

                <p style={{ fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto 30px auto', lineHeight: '1.5' }}>
                    The Incendium Core is stabilized. Light floods the corridors, burning away the shadows.
                    The demons recoil and flee into the depths. The Long Night is over.
                </p>

                <div className="score-box" style={{ marginBottom: '30px' }}>
                    <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Survived: {daysSurvived} Cycles</p>
                </div>

                <button
                    className="menu-btn start"
                    onClick={onRestart}
                    style={{ fontSize: '1.2rem', padding: '15px 40px', marginTop: '20px' }}
                >
                    RETURN TO MENU
                </button>
            </div>
        </div>
    );
};
