import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const Home = () => {
    const [roomCode, setRoomCode] = useState('');
    const navigate = useNavigate();

    const createRoom = () => {
        // Generate a random 6-character room code
        const code = Math.random().toString(36).substring(2, 8).toUpperCase();
        navigate(`/game/${code}`);
    };

    const joinRoom = (e) => {
        e.preventDefault();
        if (roomCode.trim()) {
            navigate(`/game/${roomCode.trim().toUpperCase()}`);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] w-full p-4">
            <div className="bg-primary/10 p-8 rounded-lg shadow-2xl border-4 border-tertiary max-w-[400px] w-full text-center">
                <h1 className="text-4xl font-bold mb-6 text-tertiary">Puzzled</h1>
                
                <div className="space-y-6">
                    <div>
                        <button 
                            onClick={createRoom}
                            className="w-full py-3 px-4 bg-accent text-secondary font-bold rounded-md shadow-md hover:opacity-90 transition-opacity"
                        >
                            Create New Room
                        </button>
                    </div>

                    <div className="relative flex py-2 items-center">
                        <div className="flex-grow border-t border-tertiary/30"></div>
                        <span className="flex-shrink-0 mx-4 text-tertiary/70 font-semibold">OR</span>
                        <div className="flex-grow border-t border-tertiary/30"></div>
                    </div>

                    <form onSubmit={joinRoom} className="space-y-3">
                        <input 
                            type="text" 
                            placeholder="Enter Room Code" 
                            value={roomCode}
                            onChange={(e) => setRoomCode(e.target.value)}
                            className="w-full py-3 px-4 bg-primary text-secondary border-2 border-tertiary rounded-md focus:outline-none focus:border-accent uppercase text-center font-bold placeholder:text-secondary/50 placeholder:font-normal"
                            maxLength={6}
                        />
                        <button 
                            type="submit"
                            disabled={!roomCode.trim()}
                            className="w-full py-3 px-4 bg-tertiary text-primary font-bold rounded-md shadow-md hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Join Room
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};
