import { QuranProgress } from "./gameplay";

export interface QuranProgressStorage {
  loadQuranProgress: () => Promise<QuranProgress | null>;
  saveQuranProgress: (progress: QuranProgress) => Promise<void>;
  clearQuranProgress: () => Promise<void>;
}
