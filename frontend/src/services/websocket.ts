
export class WSClient {
    socket: WebSocket | null = null;

    connect(clientId: number | string, onMessageCallback: (data: any) => void) {

        const WS_URL = `ws://127.0.0.1:8000/ws/${clientId}`;
        this.socket = new WebSocket(WS_URL);

        this.socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            onMessageCallback(data);
        };

    }

    disconnect() {
        if (this.socket) {
            this.socket.close();
            this.socket = null;
        }
    }

    send(action: string, payload: object) {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify({ action, ...payload }));
        }
    }
}

export const wsClient = new WSClient();