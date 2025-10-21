import { QuranProgress, QuranProgressActions, VerseProgress } from "@/types/gameplay";
import { stat } from "fs";
import { create } from "zustand";

type QuranProgressStore = QuranProgress & QuranProgressActions;

export const useQuranProgressStore = create<QuranProgressStore>((set) => ({
  surahProgresses: {},

  syncQuranProgress: (progress: QuranProgress) =>
    set(() => ({
      surahProgresses: progress.surahProgresses,
    })),

  initialiseSurahProgress: (surahId: number) =>
    set((state) => ({
      surahProgresses: {
        ...state.surahProgresses,
        [surahId]: {
          surahId,
          currentVerseIndex: 0,
          completedVerses: [],
          verseProgresses: {},
        },
      },
    })),

  updateVerseProgress: (
    surahId: number,
    currentVerseIndex: number,
    verseProgress: VerseProgress
  ) =>
    set((state) => ({
      surahProgresses: {
        ...state.surahProgresses,
        [surahId]: {
          ...state.surahProgresses[surahId],
          verseProgresses: {
            ...state.surahProgresses[surahId]?.verseProgresses,
            [currentVerseIndex]: verseProgress,
          },
        },
      },
    })),

  markVerseCompleted: (surahId: number, currentVerseIndex: number) =>
    set((state) => ({
      surahProgresses: {
        ...state.surahProgresses,
        [surahId]: {
          ...state.surahProgresses[surahId],
          completedVerses: [
            ...state.surahProgresses[surahId]?.completedVerses.filter(
              (v) => v !== currentVerseIndex
            ),
            currentVerseIndex,
          ],
        },
      },
    })),

  moveToNextVerse: (surahId: number) =>
    set((state) => ({
      surahProgresses: {
        ...state.surahProgresses,
        [surahId]: {
          ...state.surahProgresses[surahId],
          currentVerseIndex: (state.surahProgresses[surahId]?.currentVerseIndex || 0) + 1,
        },
      },
    })),
}));
