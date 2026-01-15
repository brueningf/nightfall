import { useState, useEffect } from 'react';
import './index.css';
import { Dashboard } from './components/Dashboard';
import { MainMenu } from './components/MainMenu';
import { InfoScreen } from './components/InfoScreen';
import { GameOverScreen } from './components/GameOverScreen';
import { VictoryScreen } from './components/VictoryScreen';
import { INITIAL_STATE } from './engine/types';
import type { GameState, TechId } from './engine/types';
import { processTurn, startResearch, banishDemons, igniteCore } from './engine/engine';
import { audioController } from './engine/audio';
import { saveGame, loadGame, clearSave } from './engine/persistence';

import { SettingsScreen } from './components/SettingsScreen';
import { ScoresScreen } from './components/ScoresScreen';

type Screen = 'MENU' | 'GAME' | 'INFO' | 'GAMEOVER' | 'VICTORY' | 'SETTINGS' | 'RESEARCH' | 'SCORES';

function App() {
    const [screen, setScreen] = useState<Screen>('MENU');
    const [gameState, setGameState] = useState<GameState>(INITIAL_STATE);
    const [isShaking, setIsShaking] = useState(false);

    // Audio State Management
    useState(() => {
        // Run once on mount? No, cleaner to use useEffect dependency on screen
    });

    // We use a useEffect inside the component (need to import useEffect)
    // to trigger music changes. 
    // Wait, create separate useEffect below.


    // Initial load check? No, we do it on "Continue" click.

    const handleNewGame = (difficulty: any) => {
        // Create custom initial state with selected difficulty
        const startState = { ...INITIAL_STATE, difficulty: difficulty };
        setGameState(startState);
        saveGame(startState); // Ensure clean state is saved
        setScreen('GAME');
        audioController.playStart();
    };

    const handleContinue = () => {
        const saved = loadGame();
        if (saved && saved.allocation) {
            setGameState(saved);
            setScreen('GAME');
            audioController.playStart();
        } else {
            // Fallback if save is old/broken
            console.warn("Save incompatible, starting new.");
            handleNewGame('VETERAN');
        }
    };

    const handleResearch = (techId: TechId) => {
        setGameState(prev => {
            const next = startResearch(prev, techId);
            saveGame(next);
            return next;
        });
        // Audio for "Project Started"
    };

    const handleBanish = () => {
        setGameState(prev => {
            const next = banishDemons(prev);
            saveGame(next);
            return next;
        });
        audioController.playResearch(); // Use research sound for now
    };

    const handleIgnite = () => {
        setGameState(prev => {
            const next = igniteCore(prev);
            saveGame(next); // Save the Final Stand state
            return next;
        });
        audioController.playStart(); // Epic sound?
        setScreen('GAME'); // Close modal to show the event log
    };

    const handleTurn = () => {
        audioController.playTurnEnd();
        setGameState(prev => {
            const next = processTurn(prev, undefined, prev.stance);

            // Check for Game Over
            if (next.victory) {
                audioController.playStart(); // Victory Sound?
                clearSave();
                setTimeout(() => setScreen('VICTORY'), 2000);
            } else if (next.gameOver) {
                audioController.playDefeat();
                clearSave();
                setTimeout(() => setScreen('GAMEOVER'), 2000); // Delay for effect
            } else {
                saveGame(next); // Auto-save
            }

            // Simple check for damage to play sound and shake
            if (next.wallHealth < prev.wallHealth) {
                setTimeout(() => {
                    audioController.playAttack();
                    setIsShaking(true);
                    setTimeout(() => setIsShaking(false), 500);
                }, 500);
            }
            return next;
        });
    };

    const handleAllocate = (newPolicy: any) => {
        setGameState(prev => ({ ...prev, allocation: newPolicy }));
    };



    const handleStance = (stance: any) => {
        setGameState(prev => ({ ...prev, stance: stance }));
    };

    useEffect(() => {
        switch (screen) {
            case 'MENU':
            case 'SETTINGS':
            case 'SCORES':
            case 'INFO':
                audioController.startMusic('MENU');
                break;
            case 'GAME':
                audioController.startMusic('GAME');
                break;
            case 'VICTORY':
                audioController.startMusic('VICTORY');
                break;
            case 'GAMEOVER':
                audioController.startMusic('DEFEAT');
                break;
        }
    }, [screen]);

    return (
        <div className={`flex flex-col h-full w-full bg-bg relative overflow-hidden md:max-w-[480px] md:mx-auto md:shadow-[0_0_40px_rgba(0,0,0,0.8)] md:border-x md:border-[#222] ${isShaking ? 'shake' : ''}`}>
            {screen === 'MENU' && (
                <MainMenu
                    onNewGame={handleNewGame}
                    onContinue={handleContinue}
                    onOpenInfo={() => setScreen('INFO')}
                    onOpenSettings={() => setScreen('SETTINGS')}
                    onOpenScores={() => setScreen('SCORES')}
                />
            )}

            {screen === 'INFO' && (
                <InfoScreen onBack={() => setScreen('MENU')} />
            )}

            {screen === 'SETTINGS' && (
                <SettingsScreen onBack={() => setScreen('MENU')} />
            )}

            {screen === 'SCORES' && (
                <ScoresScreen onBack={() => setScreen('MENU')} />
            )}

            {screen === 'GAMEOVER' && (
                <GameOverScreen
                    daysSurvived={gameState.turn}
                    reason={gameState.wallHealth <= 0 ? "The Walls Have Fallen" : "The Last Soul Has Faded"}
                    onRestart={() => setScreen('MENU')}
                />
            )}

            {screen === 'VICTORY' && (
                <VictoryScreen
                    daysSurvived={gameState.turn}
                    onRestart={() => setScreen('MENU')}
                />
            )}

            {screen === 'GAME' && (
                <>
                    <Dashboard
                        state={gameState}
                        onAllocate={handleAllocate}
                        onNextTurn={handleTurn}
                        onSetStance={handleStance}
                        onResearch={handleResearch}
                        onIgnite={handleIgnite}
                        onBanish={handleBanish}
                        onMenu={() => setScreen('MENU')}
                    />
                </>
            )}


        </div>
    );
}

export default App;
