import { GameState, Streak } from "@/types/gameplay";
import { SurahProgress } from "@/types/quran";

// Surah Progress
export function loadSurahProgress(surahId: number): SurahProgress | null {
  const savedProgress = localStorage.getItem(`surah_${surahId}_progress`);
  return savedProgress ? JSON.parse(savedProgress) : null;
}

export function saveSurahProgress(surahId: number, progress: SurahProgress) {
  localStorage.setItem(`surah_${surahId}_progress`, JSON.stringify(progress));
}

export function clearSurahProgress(surahId: number) {
  localStorage.removeItem(`surah_${surahId}_progress`);
}

// Game State
export function loadGameState(): GameState | null {
  const savedState = localStorage.getItem("game_state");
  return savedState ? JSON.parse(savedState) : null;
}

export function saveGameState(state: GameState) {
  localStorage.setItem("game_state", JSON.stringify(state));
}

export function clearGameState() {
  localStorage.removeItem("game_state");
}
