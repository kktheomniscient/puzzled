import { create } from 'zustand';

const INITIAL_FEN = 'q3k1nr/1pp1nQpp/3p4/1P2p3/4P3/B1PP1b2/B5PP/5K2 b k - 0 17';

export const useGameStore = create((set) => ({
    fen: INITIAL_FEN,
    
    setFen: (newFen) => {
        set({ fen: newFen });
    },

    resetGame: () => {
        set({ fen: INITIAL_FEN });
    }
}));
