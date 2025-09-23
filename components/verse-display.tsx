'use client';

import { Verse } from '@/types/quran';
import { CheckCircle, Play } from 'lucide-react';

interface VerseDisplayProps {
  verse: Verse;
  isCompleted?: boolean;
  showTranslation?: boolean;
  onContinue?: () => void;
}

export function VerseDisplay({ 
  verse, 
  isCompleted = false, 
  showTranslation = true,
  onContinue 
}: VerseDisplayProps) {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        {/* Verse Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-800">
            Verse {verse.verse_number}
          </h3>
          {isCompleted && (
            <div className="flex items-center text-green-600">
              <CheckCircle size={20} className="mr-1" />
              <span className="text-sm font-medium">Completed</span>
            </div>
          )}
        </div>

        {/* Arabic Text */}
        <div className="mb-8">
          <div className="text-right text-2xl md:text-3xl leading-relaxed font-arabic text-gray-800 p-6 bg-gray-50 rounded-lg">
            {verse.text_uthmani}
          </div>
        </div>

        {/* Translation */}
        {showTranslation && verse.translations && verse.translations.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-600 mb-2">Translation:</h4>
            <div className="text-gray-700 leading-relaxed p-4 bg-blue-50 rounded-lg">
              {verse.translations[0].text}
            </div>
          </div>
        )}

        {/* Words Grid */}
        {verse.words && verse.words.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-600 mb-3">Word by Word:</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {verse.words.map((word, index) => (
                <div 
                  key={word.id}
                  className="p-3 bg-gray-50 rounded-lg text-center border"
                >
                  <div className="text-lg font-arabic text-gray-800 mb-1">
                    {word.text_uthmani}
                  </div>
                  <div className="text-xs text-gray-500">
                    Word {word.position}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Button */}
        {onContinue && (
          <div className="text-center pt-4">
            <button
              onClick={onContinue}
              className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
            >
              {isCompleted ? 'Continue to Next Verse' : 'Start Memorizing'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}