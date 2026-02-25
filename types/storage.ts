import { GameState, QuranProgress } from "./gameplay";

export interface QuranProgressStorage {
  loadQuranProgress: () => Promise<QuranProgress | null>;
  saveQuranProgress: (progress: QuranProgress) => Promise<void>;
  clearQuranProgress: () => Promise<void>;
}

export interface GameProgressStorage {
  loadGameProgress: () => Promise<GameState | null>;
  saveGameProgress: (progress: GameState) => Promise<void>;
  clearGameProgress: () => Promise<void>;
}
