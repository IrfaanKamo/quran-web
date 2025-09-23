'use client';

import { useState, useEffect } from 'react';
import { Word, WordGuessState } from '@/types/quran';
import { generateWordOptions } from '@/lib/quran-api';
import { CheckCircle, XCircle } from 'lucide-react';

interface WordGuessGameProps {
  words: Word[];
  currentWordIndex: number;
  onWordComplete: (isCorrect: boolean) => void;
  onAllWordsComplete: () => void;
}

export function WordGuessGame({ 
  words, 
  currentWordIndex, 
  onWordComplete, 
  onAllWordsComplete 
}: WordGuessGameProps) {
  const [guessState, setGuessState] = useState<WordGuessState | null>(null);

  useEffect(() => {
    if (currentWordIndex < words.length) {
      const correctWord = words[currentWordIndex];
      const options = generateWordOptions(correctWord, words);
      
      setGuessState({
        currentWordIndex,
        selectedOption: null,
        isCorrect: null,
        showResult: false,
        options,
        correctWord
      });
    } else {
      onAllWordsComplete();
    }
  }, [currentWordIndex, words, onAllWordsComplete]);

  const handleOptionClick = (optionIndex: number) => {
    if (!guessState || guessState.showResult) return;

    const selectedWord = guessState.options[optionIndex];
    const isCorrect = selectedWord.id === guessState.correctWord.id;

    setGuessState(prev => ({
      ...prev!,
      selectedOption: optionIndex,
      isCorrect,
      showResult: true
    }));

    // Auto-advance after showing result
    setTimeout(() => {
      onWordComplete(isCorrect);
    }, 1500);
  };

  if (!guessState || currentWordIndex >= words.length) {
    return null;
  }

  const progress = ((currentWordIndex) / words.length) * 100;

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Word {currentWordIndex + 1} of {words.length}</span>
          <span>{Math.round(progress)}% complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-green-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="text-center mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Select the correct word:</h2>
        <div className="text-3xl font-arabic text-green-500 p-4 bg-white rounded-lg">
          {guessState.correctWord.text_uthmani}
        </div>
      </div>

      {/* Options */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {guessState.options.map((option, index) => {
          const isSelected = guessState.selectedOption === index;
          const isCorrectOption = option.id === guessState.correctWord.id;
          
          let buttonClass = 'p-4 text-lg font-arabic border-2 rounded-lg transition-all duration-200 ';
          
          if (!guessState.showResult) {
            buttonClass += isSelected 
              ? 'border-blue-600 bg-blue-50 text-blue-800'
              : 'border-gray-300 bg-white hover:border-blue-300 hover:bg-blue-50';
          } else {
            if (isCorrectOption) {
              buttonClass += 'border-green-500 bg-green-50 text-green-800';
            } else if (isSelected && !isCorrectOption) {
              buttonClass += 'border-red-500 bg-red-50 text-red-800';
            } else {
              buttonClass += 'border-gray-300 bg-gray-50 text-gray-600';
            }
          }

          return (
            <button
              key={option.id}
              onClick={() => handleOptionClick(index)}
              disabled={guessState.showResult}
              className={buttonClass}
            >
              <div className="flex items-center justify-center">
                {guessState.showResult && (
                  <div className="mr-2">
                    {isCorrectOption ? (
                      <CheckCircle className="text-green-500 ml-2" size={20} />
                    ) : isSelected ? (
                      <XCircle className="text-red-500 ml-2" size={20} />
                    ) : null}
                  </div>
                )}
                <span>{option.text_uthmani}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Result Message */}
      {guessState.showResult && (
        <div className="text-center">
          {guessState.isCorrect ? (
            <div className="text-green-600 font-semibold">
              <CheckCircle className="inline mr-2" size={24} />
              Correct! Well done!
            </div>
          ) : (
            <div className="text-red-600 font-semibold">
              <XCircle className="inline mr-2" size={24} />
              Incorrect. The correct word was highlighted.
            </div>
          )}
        </div>
      )}
    </div>
  );
}