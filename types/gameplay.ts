export interface Streak {
  current: number;
  best: number;
}

export interface StreakActions {
  increment: () => void;
  reset: () => void;
  initialise: (current: number, best: number) => void;
}

export interface GameState {
  streak: Streak;
}
