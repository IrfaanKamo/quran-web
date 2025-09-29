"use client";

import { ChevronLeft, ChevronRight, Home, RotateCcw } from "lucide-react";
import Link from "next/link";

interface NavigationControlsProps {
  currentVerseIndex: number;
  totalVerses: number;
  onPrevious: () => void;
  onNext: () => void;
  onReset: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
}

export function NavigationControls({
  currentVerseIndex,
  totalVerses,
  onPrevious,
  onNext,
  onReset,
  canGoPrevious,
  canGoNext,
}: NavigationControlsProps) {
  return (
    <div className="fixed bottom-0 w-full bg-white border-t border-gray-200 p-4">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        {/* Left Controls */}
        <div className="flex items-center space-x-2">
          <Link
            href="/"
            className="p-2 text-gray-600 hover:text-green-500 hover:bg-green-50 rounded-lg transition-colors"
            title="Back to Surah List"
          >
            <Home size={20} />
          </Link>
          <button
            onClick={onReset}
            className="p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
            title="Reset Progress"
          >
            <RotateCcw size={20} />
          </button>
        </div>

        {/* Center Progress */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onPrevious}
            disabled={!canGoPrevious}
            className="p-2 text-gray-600 hover:text-green-500 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Previous Verse"
          >
            <ChevronLeft size={20} />
          </button>

          <div className="text-sm font-medium text-gray-600">
            Ayah {currentVerseIndex + 1} of {totalVerses}
          </div>

          <button
            onClick={onNext}
            disabled={!canGoNext}
            className="p-2 text-gray-600 hover:text-green-500 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Next Verse"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Right Progress Indicator */}
        <div className="text-right">
          <div className="text-xs text-gray-500">Surah Progress</div>
          <div className="text-sm font-medium text-gray-700">
            {Math.round((currentVerseIndex / totalVerses) * 100)}%
          </div>
        </div>
      </div>
    </div>
  );
}
