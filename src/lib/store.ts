import { create } from 'zustand'

interface GameState {
  score: number;
  streak: number;
  lives: number;
  highestStreak: number;
  incrementScore: (points: number) => void;
  incrementStreak: () => void;
  resetStreak: () => void;
  loseLife: () => void;
  resetGame: (mode: 'CLASSIC' | 'SURVIVAL' | 'TIMED') => void;
}

export const useGameStore = create<GameState>((set) => ({
  score: 0,
  streak: 0,
  lives: 3,
  highestStreak: 0,
  incrementScore: (points) => set((state) => ({ score: state.score + points })),
  incrementStreak: () => set((state) => {
    const newStreak = state.streak + 1;
    return { 
      streak: newStreak,
      highestStreak: Math.max(state.highestStreak, newStreak)
    };
  }),
  resetStreak: () => set({ streak: 0 }),
  loseLife: () => set((state) => ({ lives: Math.max(0, state.lives - 1) })),
  resetGame: (mode) => set({ score: 0, streak: 0, lives: mode === 'SURVIVAL' ? 3 : 1 }),
}))
