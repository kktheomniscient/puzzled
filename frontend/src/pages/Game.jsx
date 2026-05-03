import { useState, useEffect } from 'react';
import { ChessBoard } from 'react-chessboard-ui';
import 'react-chessboard-ui/dist/index.css';
import { useGameStore } from '../store/useGameStore';

export const Game = () => {
    const { fen, setFen, resetGame } = useGameStore();
    const [squareSize, setSquareSize] = useState(40); // default mobile size

    useEffect(() => {
        const handleResize = () => {
            // max width of 500px, but shrinks on mobile (subtracting 32px for page padding)
            const availableWidth = Math.min(window.innerWidth - 32, 500);
            setSquareSize(Math.floor(availableWidth / 8));
        };
        
        handleResize(); // initial calculation
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
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
                <h2 className="text-2xl font-bold text-tertiary">Play Chess</h2>
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
                    config={{ squareSize }}
                />
            </div>
        </div>
    );
};