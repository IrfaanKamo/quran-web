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
    increment: () => set((state) => {
        const newCurrent = state.streak.current + 1;
        const newBest = Math.max(newCurrent, state.streak.best);
        return {
            streak: {
                current: newCurrent,
                best: newBest,
            },
        };
    }),
    reset: () => set(() => ({
        streak: {
            current: 0,
            best: useGameplayStore.getState().streak.best,
        },
    })),
    initialise: (current: number, best: number) => set(() => ({
        streak: {
            current,
            best,
        },
    })),
}));