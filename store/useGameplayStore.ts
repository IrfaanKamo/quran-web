import { GameState, StreakActions } from '@/types/gameplay';
import { create } from 'zustand';

type GameplayStore = GameState & StreakActions;

export const useGameplayStore = create<GameplayStore>((set) => ({
    //Streak State
    streak: {
        current: 0,
        best: 0, 
    },
    //Streak Actions
    incrementStreak: () => set((state) => {
        const newCurrent = state.streak.current + 1;
        const newBest = Math.max(newCurrent, state.streak.best);
        return {
            streak: {
                current: newCurrent,
                best: newBest,
            },
        };
    }),
    resetStreak: () => set(() => ({
        streak: {
            current: 0,
            best: useGameplayStore.getState().streak.best,
        },
    })),
    syncGameProgress: (gameProgress: GameState) => set(() => ({
        ...gameProgress
    })),
}));