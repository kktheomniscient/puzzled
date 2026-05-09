from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Request
from fastapi.middleware.cors import CORSMiddleware
import asyncpg
import random
import asyncio
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app : FastAPI):
    app.state.pool = await asyncpg.create_pool(dsn="postgresql://admin:admin@localhost:5432/postgres")
    yield
    await app.state.pool.close()

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

INITIAL_FEN = 'q3k1nr/1pp1nQpp/3p4/1P2p3/4P3/B1PP1b2/B5PP/5K2 b k - 0 17'

@app.websocket("/ws/game/{room_id}")
async def websocket_endpoint(websocket: WebSocket, room_id: str):
    await websocket.accept()
    try:
        async with websocket.app.state.pool.acquire() as connection:
            fen = await connection.fetchrow('SELECT fen FROM puzzles where id = $1',random.randint(0,100))
            print(fen)
            # Transmit the initial game FEN upon successful connection
            await websocket.send_json({
                "type": "init", 
                "fen": fen["fen"],
                "room_id": room_id
            })
        
        while True:
            # Keep connection open. We can handle incoming moves here later.
            data = await websocket.receive_text()
            pass
            
    except WebSocketDisconnect:
        print(f"Client disconnected from room {room_id}")
