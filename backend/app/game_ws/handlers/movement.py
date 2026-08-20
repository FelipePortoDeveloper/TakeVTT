from game_ws.manager import manager

async def handle_move_token(data: dict, man: manager):
    token_id = data.get("token_id")
    x = data.get("x")
    y = data.get("y")

    man.game_state[token_id] = {"x": x, "y": y}

    await man.broadcast({"type": "STATE_UPDATE", "state": man.game_state})