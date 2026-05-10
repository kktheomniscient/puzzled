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
            # ran = random.randint(0,100)
            ran = 1
            row = await connection.fetchrow('SELECT fen,moves FROM puzzles where id = $1',ran)
            # print(fen)
            # Transmit the initial game FEN upon successful connection
            await websocket.send_json({
                "type": "init", 
                "fen": row["fen"],
                "move" : row["moves"].split(' ')[0],
                "room_id": room_id
            })
        
        while True:
            data = await websocket.receive_text()
            print(data)
            pass
            
    except WebSocketDisconnect:
        print(f"Client disconnected from room {room_id}")
