'use client';

import { Verse, VerseViewMode, Word } from "@/types/quran";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { StepForward } from "lucide-react";

interface WordGuessProps {
    currentVerse: Verse;
    isVerseCompleted: boolean;
    currentWordIndex: number;
    viewMode: VerseViewMode;
    onWordComplete: (isCorrect: boolean) => void;
    onNext: () => void;
};

export function WordGuess({ currentVerse, isVerseCompleted, currentWordIndex, viewMode, onWordComplete, onNext }: WordGuessProps) {
    const words: Word[] = currentVerse.words;
    const verseProgress = ((currentWordIndex) / words.length) * 100;
    const completedWords = words.slice(0, currentWordIndex);

    return (
        <div className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="space-y-6">
                {/* Verse Display */}
                <Card className="border-0 shadow-lg">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">
                                Ayah {currentVerse.verse_number}
                            </CardTitle>
                            <div className="flex items-center space-x-2">
                                <Badge variant="secondary">
                                    {currentWordIndex} / {words.length}
                                </Badge>
                            </div>
                        </div>
                        <Progress value={verseProgress} className="h-2" />
                    </CardHeader>
                    <CardContent className="space-y-8">
                        {/* Arabic Text */}
                        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8">
                            <div className="text-center">
                                <div className="font-arabic text-4xl md:text-5xl text-gray-800 mb-6 min-h-[80px] flex items-center justify-center">
                                    {
                                        isVerseCompleted ? (
                                            <div className="space-x-4 rtl:space-x-reverse text-green-700">
                                                {currentVerse.text_uthmani}
                                            </div>
                                        ) : (
                                            <div className="space-x-4 rtl:space-x-reverse">
                                                {completedWords.map((word, index) => (
                                                    <span
                                                        key={index}
                                                        className="inline-block px-3 py-2 text-green-700 bg-green-100 rounded-lg mx-1 transition-all duration-300"
                                                    >
                                                        {word.text_uthmani}
                                                    </span>
                                                ))}
                                                {completedWords.length < words.length && (
                                                    <span className="inline-block w-4 h-1 bg-gray-400 animate-pulse mx-2 mt-8"></span>
                                                )}
                                            </div>
                                        )
                                    }

                                </div>

                                {/* Transliteration */}
                                <div className="text-base text-gray-400 mb-4">
                                    {completedWords.map((word) => {
                                        return word.transliteration?.text || '';
                                    }).join(' ')}
                                </div>

                                {/* Translation */}
                                <p className="text-lg text-gray-700">
                                    {currentVerse.translations![0].text}
                                </p>
                            </div>
                        </div>

                        {/* Memory Test - Word Selection */}
                        {viewMode === 'memorizing' && (
                            <Card className="border-0 shadow-lg">
                                <CardHeader>
                                    <CardTitle className="text-center">
                                        Select the next word in the ayah
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        {[...words].sort(() => Math.random() - 0.5).map((word, index) => (
                                            <Button
                                                key={index}
                                                variant={completedWords.includes(word) ? "default" : "outline"}
                                                className="font-arabic text-2xl h-14"
                                                onClick={() => onWordComplete(false)}
                                                disabled={completedWords.includes(word)}
                                            >
                                                {word.text_uthmani}
                                            </Button>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Success Message */}
                        {viewMode === 'completed' && (
                            <>
                                <div className="text-center p-6 bg-green-50 rounded-2xl border-2 border-green-200">
                                    <div className="text-2xl mb-2">🎉</div>
                                    <h3 className="text-lg font-semibold text-green-800 mb-2">
                                        Excellent! Verse completed correctly!
                                    </h3>
                                    <p className="text-green-600">
                                        You can now play the audio and move to the next verse.
                                    </p>
                                </div>
                                {/* Controls */}
                                <div className="flex flex-wrap justify-center items-center gap-4">
                                    <Button
                                        onClick={onNext}
                                        className="bg-green-600 hover:bg-green-700"
                                    >
                                        Continue
                                        <StepForward className="h-4 w-4 ml-1" />
                                    </Button>

                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>);
}