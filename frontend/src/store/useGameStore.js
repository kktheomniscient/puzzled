import { create } from 'zustand';

// Valid standard starting FEN, because react-chessboard-ui doesn't accept the word 'start'
const STANDARD_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

export const useGameStore = create((set, get) => ({
    fen: STANDARD_FEN,
    ws: null,
    
    setFen: (newFen) => {
        set({ fen: newFen });
    },

    connectWebSocket: (roomId) => {
        if (get().ws) return; // already connected
        
        if (!roomId) return; // Need a room to connect

        const socket = new WebSocket(`ws://localhost:8000/ws/game/${roomId}`);
        
        socket.onopen = () => {
            console.log(`Connected to room: ${roomId}`);
        };

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'init' || data.type === 'update') {
                set({ fen: data.fen });
            }
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
            // Only close if it's open, to prevent the strict mode warning
            if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
                ws.close();
            }
            set({ ws: null });
        }
    },

    resetGame: () => {
        set({ fen: STANDARD_FEN });
    }
}));
