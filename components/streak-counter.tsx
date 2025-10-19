import { Flame, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

interface StreakCounterProps {
  currentStreak: number;
  bestStreak: number;
}

export function StreakCounter({ currentStreak, bestStreak }: StreakCounterProps) {
  const isNewRecord = currentStreak > 0 && currentStreak === bestStreak;

  return (
    <div className="flex items-center gap-2">
      {/* Current Streak */}
      <div className="flex items-center gap-2 px-3 py-1 bg-gradient-to-br from-orange-50 to-red-50 rounded-full border border-orange-200 transition-all duration-300 hover:border-orange-300 hover:shadow-md hover:shadow-orange-100">
        <div
          className={cn(
            "flex items-center justify-center w-5 h-5 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br transition-all duration-500",
            currentStreak > 0
              ? "from-orange-500 to-red-500 shadow-md shadow-orange-200"
              : "from-slate-200 to-slate-300"
          )}
        >
          <Flame
            className={cn(
              "w-3 h-3 sm:w-4 sm:h-4 transition-all duration-500",
              currentStreak > 0 ? "text-white" : "text-slate-400"
            )}
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:block">
            <p className="text-xs text-slate-700 leading-none font-medium">Streak</p>
            {isNewRecord && (
              <p className="text-[10px] text-orange-600 font-bold leading-none mt-0.5 animate-pulse">
                New!
              </p>
            )}
          </div>
          <div
            className={cn(
              "sm:text-2xl font-bold transition-all duration-500",
              currentStreak > 0
                ? "bg-gradient-to-br from-orange-600 to-red-600 bg-clip-text text-transparent"
                : "text-slate-300"
            )}
          >
            {currentStreak}
          </div>
        </div>
      </div>

      {/* Best Streak */}
      <div className="flex items-center gap-2 px-3 py-1 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-full border border-amber-200 transition-all duration-300 hover:border-amber-300 hover:shadow-md hover:shadow-amber-100">
        <div
          className={cn(
            "flex items-center justify-center w-5 h-5 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br transition-all duration-500",
            bestStreak > 0
              ? "from-amber-500 to-yellow-500 shadow-md shadow-amber-200"
              : "from-slate-200 to-slate-300"
          )}
        >
          <Trophy
            className={cn(
              "w-3 h-3 sm:w-4 sm:h-4 transition-all duration-500",
              bestStreak > 0 ? "text-white" : "text-slate-400"
            )}
          />
        </div>

        <div className="flex items-center gap-2">
          <p className="text-xs text-slate-600 font-medium hidden sm:block">Best</p>
          <div
            className={cn(
              "sm:text-2xl font-bold transition-all duration-500",
              bestStreak > 0
                ? "bg-gradient-to-br from-amber-600 to-yellow-600 bg-clip-text text-transparent"
                : "text-slate-300"
            )}
          >
            {bestStreak}
          </div>
        </div>
      </div>
    </div>
  );
}
