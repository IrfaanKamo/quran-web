"use client";

import { useState, useEffect } from "react";
import { Verse, VerseViewMode } from "@/types/quran";
import { NavigationControls } from "./navigation-controls";
import { VerseCompletionGame } from "./verse-completion-game";
import { SurahCompletion } from "./surah-completion";
import Loading from "../common/loading";
import { LocalStorage } from "@/storage/localStorage";
import { useGameplayStore } from "@/store/useGameplayStore";
import { StreakCounter } from "../widgets/streak-counter";
import { useQuranProgressStore } from "@/store/useQuranProgressStore";
import { SurahProgress, VerseProgress } from "@/types/gameplay";
import { QuranProgressStorage } from "@/types/storage";

interface MemorizationInterfaceProps {
  verses: Verse[];
  surahId: number;
  surahName: string;
}

export function MemorizationInterface({
  verses,
  surahId,
  surahName,
}: MemorizationInterfaceProps) {
  const [currentVerseIndex, setCurrentVerseIndex] = useState(0);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [viewMode, setViewMode] = useState<VerseViewMode>("memorizing");
  const [storageService, setStorageService] = useState<QuranProgressStorage | null>(null);

  const { streak, reset } = useGameplayStore((state) => state);
  const {
    surahProgresses,
    syncQuranProgress,
    updateVerseProgress,
    initialiseSurahProgress,
    markVerseCompleted,
    moveToNextVerse,
  } = useQuranProgressStore((state) => state);

  // Load progress from storage
  useEffect(() => {
    let storage: QuranProgressStorage | null = storageService;
    if (!storageService) {
      const userLoggedIn = false;
      storage = userLoggedIn ? null : new LocalStorage();
      setStorageService(storage);
    }

    const initProgress = async () => {
      const savedProgress = await storage?.loadQuranProgress();
      if (savedProgress) {
        syncQuranProgress(savedProgress);

        if (!savedProgress.surahProgresses[surahId]) {
          initialiseSurahProgress(surahId);
        }

        setCurrentVerseIndex(
          savedProgress.surahProgresses[surahId]?.currentVerseIndex || 0
        );
      } else {
        initialiseSurahProgress(surahId);
      }
    };

    initProgress();
  }, [surahId]);

  // Save progress to storage
  useEffect(() => {
    const saveProgress = async () => {
      await storageService?.saveQuranProgress({ surahProgresses });
    };
    saveProgress();
  }, [surahProgresses]);

  // Surah Loader
  const surahProgress: SurahProgress = surahProgresses[surahId];
  if (!surahProgress) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loading title={`Surah ${surahName}`} />
      </div>
    );
  }

  const currentVerse = verses[currentVerseIndex];
  const totalVerses = verses.length;

  const handleWordComplete = () => {
    const verse = verses[currentVerseIndex];
    const nextWordIndex = currentWordIndex + 1;

    // Update verse progress
    const verseProgress: VerseProgress = {
      isCompleted: nextWordIndex >= verse.words.length,
      currentWordIndex: nextWordIndex,
    };

    updateVerseProgress(surahId, currentVerseIndex, verseProgress);

    if (nextWordIndex >= verse.words.length) {
      // Verse completed
      markVerseCompleted(surahId, currentVerseIndex);
      setViewMode("completed");
    } else {
      setCurrentWordIndex(nextWordIndex);
    }
  };

  const handlePrevious = () => {
    if (currentVerseIndex > 0) {
      setCurrentVerseIndex(currentVerseIndex - 1);
      setCurrentWordIndex(0);
      setViewMode("review");
    }
  };

  const handleNext = () => {
    if (currentVerseIndex < totalVerses - 1) {
      setCurrentVerseIndex(currentVerseIndex + 1);

      const isCompleted = surahProgress.completedVerses.includes(currentVerseIndex + 1);
      if (isCompleted) {
        setViewMode("review");
        setCurrentWordIndex(0);
      } else {
        setViewMode("memorizing");
        setCurrentWordIndex(
          surahProgress.verseProgresses[currentVerseIndex + 1]?.currentWordIndex || 0
        );
      }

      moveToNextVerse(surahId);
    }
  };

  const handleReset = async() => {
    if (confirm("Are you sure you want to reset all progress for this Surah? You will lose your current streak.")) {
      initialiseSurahProgress(surahId);
      setCurrentVerseIndex(0);
      setCurrentWordIndex(0);
      setViewMode("memorizing");
      reset();
      await storageService?.saveQuranProgress({ surahProgresses });
    }
  };

  const isVerseCompleted = surahProgress.completedVerses.includes(currentVerseIndex);
  const isSurahCompleted = surahProgress.completedVerses.length === totalVerses;

  // Show completion screen if Surah is completed
  if (isSurahCompleted) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <SurahCompletion
          surahName={surahName}
          surahNumber={surahId}
          totalAyahs={totalVerses}
          onPlayAgain={handleReset}
        />
      </div>
    );
  }

  // Show memorization interface
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="flex justify-between max-w-4xl mx-auto p-4">
          <h1 className="text-2xl font-bold text-gray-900">{`Surah ${surahName}`}</h1>
          <StreakCounter currentStreak={streak.current} bestStreak={streak.best} />
        </div>
      </div>

      {/* Main Content */}
      <div className="py-8">
        <VerseCompletionGame
          currentVerse={currentVerse}
          isVerseCompleted={isVerseCompleted}
          currentWordIndex={currentWordIndex}
          viewMode={viewMode}
          onWordComplete={handleWordComplete}
          onNext={handleNext}
        />
      </div>

      {/* Navigation */}
      <NavigationControls
        currentVerseIndex={currentVerseIndex}
        totalVerses={totalVerses}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onReset={handleReset}
        canGoPrevious={currentVerseIndex > 0}
        canGoNext={isVerseCompleted && currentVerseIndex < totalVerses - 1}
      />
    </div>
  );
}
