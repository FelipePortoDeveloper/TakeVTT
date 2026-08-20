from fastapi import websockets
from typing import List, Dict

from starlette.websockets import WebSocket


class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []
        self.game_state: Dict[str, dict] = {}

    async def connect(self, websocket:WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

        await websocket.send_json({"type": "INIT_STATE", "state": self.game_state})

    def disconnect(self, websocket:WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def send_personal_message(self, message: str, websocket: WebSocket):
        for connection in self.active_connections:
            await connection.send_text(message)

    async def broadcast(self, message: dict):
        for connection in self.active_connections:
            await connection.send_json(message)

manager = ConnectionManager()