import { create } from 'zustand'

interface GameState {
  score: number;
  streak: number;
  lives: number;
  highestStreak: number;
  username: string;
  soundEnabled: boolean;
  musicEnabled: boolean;
  setUsername: (username: string) => void;
  toggleSound: () => void;
  toggleMusic: () => void;
  incrementScore: (points: number) => void;
  incrementStreak: () => void;
  resetStreak: () => void;
  loseLife: () => void;
  resetGame: (mode: 'CLASSIC' | 'SURVIVAL' | 'TIMED') => void;
  playSound: (type: 'CORRECT' | 'WRONG' | 'GAMEOVER') => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  score: 0,
  streak: 0,
  lives: 3,
  highestStreak: 0,
  username: typeof window !== 'undefined' ? localStorage.getItem('username') || '' : '',
  soundEnabled: typeof window !== 'undefined' ? localStorage.getItem('soundEnabled') !== 'false' : true,
  musicEnabled: typeof window !== 'undefined' ? localStorage.getItem('musicEnabled') !== 'false' : true,
  
  setUsername: (username) => {
    if (typeof window !== 'undefined') localStorage.setItem('username', username);
    set({ username });
  },

  toggleSound: () => {
    const newState = !get().soundEnabled;
    if (typeof window !== 'undefined') localStorage.setItem('soundEnabled', String(newState));
    set({ soundEnabled: newState });
  },

  toggleMusic: () => {
    const newState = !get().musicEnabled;
    if (typeof window !== 'undefined') localStorage.setItem('musicEnabled', String(newState));
    set({ musicEnabled: newState });
    
    // Manage BGM play/pause
    const bgm = document.getElementById('bgm-audio') as HTMLAudioElement;
    if (bgm) {
      if (newState) {
        bgm.play().catch(e => console.log("Audio autoplay prevented", e));
      } else {
        bgm.pause();
      }
    }
  },

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

  playSound: (type) => {
    if (!get().soundEnabled) return;
    
    let audioSrc = '';
    switch (type) {
      case 'CORRECT': audioSrc = '/sounds/correct.mp3'; break;
      case 'WRONG': audioSrc = '/sounds/wrong.mp3'; break;
      case 'GAMEOVER': audioSrc = '/sounds/gameover.mp3'; break;
    }

    if (audioSrc) {
      const audio = new Audio(audioSrc);
      audio.volume = 0.5;
      audio.play().catch(e => console.log("Audio play prevented", e));
    }
  }
}))
