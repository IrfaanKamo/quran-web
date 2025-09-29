"use client";

import { useState, useEffect } from "react";
import { Verse, SurahProgress, VerseProgress, VerseViewMode } from "@/types/quran";
import { NavigationControls } from "./navigation-controls";
import { LoadingSpinner } from "./ui/loading-spinner";
import { VerseCompletionGame } from "./verse-completion-game";

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
  const [progress, setProgress] = useState<SurahProgress>({
    surahId,
    currentVerseIndex: 0,
    completedVerses: [],
    verseProgresses: {},
  });

  // Load progress from localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem(`surah_${surahId}_progress`);
    if (savedProgress) {
      const parsed = JSON.parse(savedProgress);
      setProgress(parsed);
      setCurrentVerseIndex(parsed.currentVerseIndex || 0);
    }
  }, [surahId]);

  // Save progress to localStorage
  useEffect(() => {
    localStorage.setItem(`surah_${surahId}_progress`, JSON.stringify(progress));
  }, [progress, surahId]);

  const currentVerse = verses[currentVerseIndex];
  const totalVerses = verses.length;

  const handleWordComplete = () => {
    const verse = verses[currentVerseIndex];
    const nextWordIndex = currentWordIndex + 1;

    // Update verse progress
    const verseProgress: VerseProgress = {
      verseNumber: verse.verse_number,
      isCompleted: nextWordIndex >= verse.words.length,
      currentWordIndex: nextWordIndex,
      totalWords: verse.words.length,
    };

    setProgress((prev) => ({
      ...prev,
      verseProgresses: {
        ...prev.verseProgresses,
        [currentVerseIndex]: verseProgress,
      },
    }));

    if (nextWordIndex >= verse.words.length) {
      // Verse completed
      setProgress((prev) => ({
        ...prev,
        completedVerses: [
          ...prev.completedVerses.filter((v) => v !== currentVerseIndex),
          currentVerseIndex,
        ],
      }));
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

      const isCompleted = progress.completedVerses.includes(currentVerseIndex + 1);
      if (isCompleted) {
        setViewMode("review");
        setCurrentWordIndex(0);
      } else {
        setViewMode("memorizing");
        setCurrentWordIndex(
          progress.verseProgresses[currentVerseIndex + 1]?.currentWordIndex || 0
        );
      }

      setProgress((prev) => ({
        ...prev,
        currentVerseIndex: currentVerseIndex + 1,
      }));
    }
  };

  const handleReset = () => {
    if (confirm("Are you sure you want to reset all progress for this Surah?")) {
      setProgress({
        surahId,
        currentVerseIndex: 0,
        completedVerses: [],
        verseProgresses: {},
      });
      setCurrentVerseIndex(0);
      setCurrentWordIndex(0);
      setViewMode("memorizing");
      localStorage.removeItem(`surah_${surahId}_progress`);
    }
  };

  if (!currentVerse) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size={32} />
      </div>
    );
  }

  const isVerseCompleted = progress.completedVerses.includes(currentVerseIndex);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto p-4">
          <h1 className="text-2xl font-bold text-gray-900">{`Surah ${surahName}`}</h1>
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
