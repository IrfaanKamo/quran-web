import { QuranProgress } from "@/types/gameplay";
import { QuranProgressStorage } from "@/types/storage";

export class LocalStorage implements QuranProgressStorage {
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
}
