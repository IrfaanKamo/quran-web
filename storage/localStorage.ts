import { GameState, QuranProgress } from "@/types/gameplay";
import { GameProgressStorage, QuranProgressStorage } from "@/types/storage";

export class LocalStorage implements QuranProgressStorage, GameProgressStorage {
  async loadQuranProgress(): Promise<QuranProgress | null> {
    const savedProgress = localStorage.getItem(`quran_progress`);
    return savedProgress ? JSON.parse(savedProgress) : null;
  }

  async saveQuranProgress(progress: QuranProgress) {
    localStorage.setItem(`quran_progress`, JSON.stringify(progress));
  }

  async clearQuranProgress() {
    localStorage.removeItem(`quran_progress`);
  }

  async loadGameProgress(): Promise<GameState | null> {
    const savedProgress = localStorage.getItem(`game_progress`);
    return savedProgress ? JSON.parse(savedProgress) : null;
  }

  async saveGameProgress(progress: GameState) {
    localStorage.setItem(`game_progress`, JSON.stringify(progress));
  }

  async clearGameProgress() {
    localStorage.removeItem(`game_progress`);
  }
}
