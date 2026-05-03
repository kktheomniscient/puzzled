import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ChessBoard } from 'react-chessboard-ui';
import 'react-chessboard-ui/dist/index.css';
import { useGameStore } from '../store/useGameStore';

export const Game = () => {
    const { roomId } = useParams();
    const { fen, setFen, resetGame, connectWebSocket, disconnectWebSocket } = useGameStore();
    const [squareSize, setSquareSize] = useState(40); // default mobile size

    useEffect(() => {
        // Connect to the WebSocket when the component mounts
        connectWebSocket(roomId);

        // Calculate and set board size based on screen width
        const handleResize = () => {
            // max width of 500px, but shrinks on mobile (subtracting 32px for page padding)
            const availableWidth = Math.min(window.innerWidth - 32, 500);
            setSquareSize(Math.floor(availableWidth / 8));
        };
        
        handleResize(); // initial calculation
        window.addEventListener('resize', handleResize);
        
        return () => {
            window.removeEventListener('resize', handleResize);
            disconnectWebSocket(); // cleanup WebSocket on unmount
        };
    }, []);

    function handleChangePosition(newPosition) {
        if (typeof newPosition === 'string') {
            setFen(newPosition);
        } else if (newPosition && newPosition.fen) {
            setFen(newPosition.fen);
        } else {
            console.log('Position changed:', newPosition);
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] w-full p-4">
            <div className="flex justify-between items-center w-full max-w-[500px] mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-tertiary">Play Chess</h2>
                    <p className="text-sm font-semibold text-tertiary/80 mt-1">Room: <span className="text-accent uppercase tracking-wider">{roomId}</span></p>
                </div>
                <button 
                    onClick={resetGame}
                    className="px-4 py-2 bg-accent text-secondary font-semibold rounded shadow hover:opacity-90 transition-opacity"
                >
                    Reset Game
                </button>
            </div>
            <div className="shadow-2xl rounded-sm overflow-hidden border-4 border-tertiary">
                <ChessBoard 
                    FEN={fen} 
                    onChange={handleChangePosition} 
                    onEndGame={(gameData) => console.log('Game ended:', gameData)}
                    config={{ 
                        squareSize,
                        lightSquareClassName: '!bg-primary',
                        darkSquareClassName: '!bg-tertiary',
                        circleMarkColor: 'var(--color-accent)',
                        arrowColor: 'var(--color-accent)'
                    }}
                />
            </div>
        </div>
    );
};