import React from 'react';

interface GameOverScreenProps {
    daysSurvived: number;
    reason: string;
    onRestart: () => void;
}

export const GameOverScreen: React.FC<GameOverScreenProps> = ({ daysSurvived, reason, onRestart }) => {
    return (
        <div className="game-over-screen">
            <h1 className="defeat-title">FALLEN</h1>
            <div className="skull-icon">☠</div>
            <p className="defeat-reason">{reason}</p>
            <div className="stats-box">
                <div className="stat-row">
                    <span>Days Survived:</span>
                    <span className="value">{daysSurvived}</span>
                </div>
            </div>
            <button className="restart-btn" onClick={onRestart}>
                TRY AGAIN
            </button>
        </div>
    );
};
