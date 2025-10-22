// Streak Types
export interface Streak {
  current: number;
  best: number;
}

export interface StreakActions {
  incrementStreak: () => void;
  resetStreak: () => void;
  syncGameProgress: (gameProgress: GameState) => void;
}

export interface GameState {
  streak: Streak;
}

// Quran Progress Types
export interface VerseProgress {
  isCompleted: boolean;
  currentWordIndex: number;
}

export interface SurahProgress {
  surahId: number;
  currentVerseIndex: number;
  completedVerses: number[];
  verseProgresses: { [key: number]: VerseProgress };
}

export interface QuranProgress {
  surahProgresses:  { [key: number]: SurahProgress };
}

export interface QuranProgressActions {
  syncQuranProgress: (progress: QuranProgress) => void;
  initialiseSurahProgress: (surahId: number) => void;
  updateVerseProgress: (
    surahId: number,
    currentVerseIndex: number,
    verseProgress: VerseProgress
  ) => void;
  markVerseCompleted: (surahId: number, currentVerseIndex: number) => void;
  moveToNextVerse: (surahId: number) => void;
}