from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from .manager import manager
from .dispatcher import dispatch_action

router = APIRouter()

@router.websocket("/ws/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: int):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_json()

            action_type = data.get("action")
            if action_type:
                await dispatch_action(action_type, data, manager)
    except WebSocketDisconnect:
        manager.disconnect(websocket)
        await manager.broadcast({
            "type": "PLAYER_DISCONNECTED",
            "client_id": client_id,
        })