from .handlers.movement import handle_move_token
from .handlers.add_token import handle_add_token

ACTION_DISPATCHER = {
    "MOVE_TOKEN": handle_move_token,
    "ADD_TOKEN" : handle_add_token
}

async def dispatch_action(action_type: str, data: dict, manager):
    handler = ACTION_DISPATCHER.get(action_type)
    if handler:
        await handler(data, manager)
    else:
        print(f"Ação desconhecida recebida: {action_type}")