"use client";

import { useAsyncClick } from "@/hooks/useAsyncClick";
import { ChevronLeft, ChevronRight, Home, RotateCcw } from "lucide-react";
import Link from "next/link";
import { Spinner } from "../ui/spinner";
import { on } from "events";

interface NavigationControlsProps {
  currentVerseIndex: number;
  totalVerses: number;
  onPrevious: () => void;
  onNext: () => Promise<void>;
  onReset: () => Promise<void>;
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
  const { handleClick: handleOnReset, loading: loadingReset } = useAsyncClick(onReset);
  const { handleClick: handleOnNext, loading: loadingNextVerse } = useAsyncClick(onNext);
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
            onClick={handleOnReset}
            disabled={loadingReset}
            className="p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
            title="Reset Progress"
          >
            {loadingReset ? <Spinner className="size-20" /> : <RotateCcw size={20} />}
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

          <div className="text-center text-sm font-medium text-gray-600 flex flex-col sm:flex-row">
            <div className="sm:pr-1">Ayah</div>
            <div>
              {currentVerseIndex + 1} of {totalVerses}
            </div>
          </div>

          <button
            onClick={handleOnNext}
            disabled={!canGoNext || loadingNextVerse}
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
