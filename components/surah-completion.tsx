import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Trophy,
  Star,
  Sparkles,
  CircleCheck as CheckCircle,
  RotateCcw,
  BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface SurahCompletionProps {
  surahName: string;
  surahNumber: number;
  totalAyahs: number;
  longestStreak?: string;
  accuracy?: number;
  onPlayAgain?: () => void;
}

export function SurahCompletion({
  surahName,
  surahNumber,
  totalAyahs,
  longestStreak = "-",
  accuracy = 100,
  onPlayAgain,
}: SurahCompletionProps) {
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowAnimation(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 90) return "text-green-600";
    if (accuracy >= 80) return "text-yellow-600";
    return "text-orange-600";
  };

  const getAccuracyBadgeColor = (accuracy: number) => {
    if (accuracy >= 90) return "bg-green-100 text-green-800 border-green-200";
    if (accuracy >= 80) return "bg-yellow-100 text-yellow-800 border-yellow-200";
    return "bg-orange-100 text-orange-800 border-orange-200";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-8">
        {/* Header with animation */}
        <div
          className={cn(
            "text-center space-y-4 transform transition-all duration-1000",
            showAnimation ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          )}
        >
          <div className="relative">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <Trophy className="w-20 h-20 text-yellow-500 animate-bounce" />
                <Sparkles className="w-8 h-8 text-yellow-400 absolute -top-2 -right-2 animate-pulse" />
                <Star className="w-6 h-6 text-yellow-400 absolute -bottom-1 -left-2 animate-pulse delay-300" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
              🎉 Surah Completed! 🎉
            </h1>
            <p className="text-xl text-gray-600">
              MashAllah! You have successfully completed
            </p>
          </div>
        </div>

        {/* Main completion card */}
        <Card
          className={cn(
            "transform transition-all duration-1000 delay-300 shadow-2xl border-0 bg-white/90 backdrop-blur-sm",
            showAnimation
              ? "translate-y-0 opacity-100 scale-100"
              : "translate-y-8 opacity-0 scale-95"
          )}
        >
          <CardContent className="p-8 space-y-8">
            {/* Surah info */}
            <div className="text-center space-y-4">
              <Badge
                variant="outline"
                className="px-4 py-2 text-lg bg-green-100 text-green-800 border-green-200"
              >
                Surah {surahNumber}
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
                Surah {surahName}
              </h2>
              <div className="flex items-center justify-center space-x-2 text-gray-600">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-lg">All {totalAyahs} ayahs completed</span>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center space-y-2 p-4 rounded-lg bg-green-50 border border-green-100">
                <div className="text-2xl font-bold text-green-600">{totalAyahs}</div>
                <div className="text-sm text-gray-600">Ayahs Completed</div>
              </div>

              <div className="text-center space-y-2 p-4 rounded-lg bg-blue-50 border border-blue-100">
                <div className="text-2xl font-bold text-blue-600">{longestStreak}</div>
                <div className="text-sm text-gray-600">Longest Streak</div>
              </div>

              <div className="text-center space-y-2 p-4 rounded-lg bg-purple-50 border border-purple-100">
                <div className={cn("text-2xl font-bold", getAccuracyColor(accuracy))}>
                  {accuracy}%
                </div>
                <div className="text-sm text-gray-600">Accuracy</div>
              </div>
            </div>

            {/* Accuracy badge */}
            <div className="text-center">
              <Badge
                className={cn(
                  "px-4 py-2 text-base font-semibold",
                  getAccuracyBadgeColor(accuracy)
                )}
              >
                {accuracy >= 90
                  ? "🌟 Excellent Performance!"
                  : accuracy >= 80
                  ? "👏 Great Job!"
                  : "💪 Keep Improving!"}
              </Badge>
            </div>

            {/* Celebration message */}
            <div className="text-center space-y-3 p-6 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg border border-green-200">
              <div className="text-2xl">🤲</div>
              <p className="text-lg text-green-800 font-medium">
                "And We have certainly made the Qur'an easy for remembrance, so is there
                any who will remember?"
              </p>
              <p className="text-sm text-green-600 italic">- Quran 54:17</p>
            </div>
          </CardContent>
        </Card>

        {/* Action buttons */}
        <div
          className={cn(
            "flex flex-col sm:flex-row justify-center gap-4 transform transition-all duration-1000 delay-500",
            showAnimation ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          )}
        >
          <Link href="/" title="Back to Surah List">
            <Button
              size="lg"
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transform transition-all hover:scale-105 active:scale-95"
            >
              <BookOpen className="w-5 h-5 mr-2" />
              Return to Surah List
            </Button>
          </Link>

          {onPlayAgain && (
            <Button
              onClick={onPlayAgain}
              variant="outline"
              size="lg"
              className="border-2 border-green-600 text-green-600 hover:bg-green-50 px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transform transition-all hover:scale-105 active:scale-95"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Practice Again
            </Button>
          )}
        </div>

        {/* Floating particles effect */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className={cn(
                "absolute w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full animate-pulse",
                showAnimation ? "opacity-30" : "opacity-0"
              )}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
