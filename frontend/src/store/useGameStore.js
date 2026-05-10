import { create } from 'zustand';

// Valid standard starting FEN, because react-chessboard-ui doesn't accept the word 'start'
const STANDARD_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

export const useGameStore = create((set, get) => ({
    fen: STANDARD_FEN,
    
    setFen: (newFen) => {
        set({ fen: newFen });
    },

    resetGame: () => {
        set({ fen: STANDARD_FEN });
    }
}));

export const useSockeStore = create((set, get) => ({
    ws: null,
    data: null,
    
    connectWebSocket: (roomId) => {
        if (get().ws) return;

        if (!roomId) return;

        const socket = new WebSocket(`ws://localhost:8000/ws/game/${roomId}`);

        socket.onopen = () => {
            console.log(`Connected to room: ${roomId}`);
        };

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            set({ data: data.fen });
        };

        socket.onclose = () => {
            console.log('Disconnected from game server');
            set({ ws: null });
        };

        set({ ws: socket });
    },

    disconnectWebSocket: () => {
        const ws = get().ws;
        if (ws) {
            if (ws.readyState === WebSocket.OPEN) {
                ws.close();
            }
            set({ ws: null });
        }
    }
}));