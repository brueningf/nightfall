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
        <div className="info-screen">
            <header className="info-header">
                <h2>HALL OF HEROES</h2>
                <button className="close-btn" onClick={onBack}>✖</button>
            </header>

            <div className="info-content">
                <table style={{ width: '100%', borderCollapse: 'collapse', color: '#ccc' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid #444', textAlign: 'left' }}>
                            <th style={{ padding: '10px' }}>Name</th>
                            <th style={{ padding: '10px' }}>Days</th>
                            <th style={{ padding: '10px' }}>Fate</th>
                        </tr>
                    </thead>
                    <tbody>
                        {scores.map((score, i) => (
                            <tr key={i} style={{ borderBottom: '1px solid #222' }}>
                                <td style={{ padding: '10px' }}>{score.name}</td>
                                <td style={{ padding: '10px', color: '#4cd964' }}>{score.days}</td>
                                <td style={{ padding: '10px', fontStyle: 'italic', color: '#888' }}>{score.cause}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
