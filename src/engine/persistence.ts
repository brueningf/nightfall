import type { GameState } from "./types";

const SAVE_KEY = "nightfall_save_v1";

export function saveGame(state: GameState): void {
    try {
        const serialized = JSON.stringify(state);
        localStorage.setItem(SAVE_KEY, serialized);
    } catch (e) {
        console.error("Failed to save game", e);
    }
}

export function loadGame(): GameState | null {
    try {
        const serialized = localStorage.getItem(SAVE_KEY);
        if (!serialized) return null;
        return JSON.parse(serialized) as GameState;
    } catch (e) {
        console.error("Failed to load game", e);
        return null;
    }
}

export function hasSaveGame(): boolean {
    return !!localStorage.getItem(SAVE_KEY);
}

export function clearSave(): void {
    localStorage.removeItem(SAVE_KEY);
}
