import { useEffect, useState } from "react";
import { wsClient } from "../services/websocket";
import { Stage, Layer, Circle, Text, Image, Rect, Group } from "react-konva";

const height = 350;
const width = 500;

interface TokenPosition {
    x: number;
    y: number;
}

interface GameState {
    [tokenId: string]: TokenPosition;
}

const Map = () => {
    const [image, setImage] = useState<HTMLImageElement | null>(null);

    useEffect(() => {
        const img = new window.Image();
        img.crossOrigin = "anonymous";
        img.src = "https://i0.wp.com/2minutetabletop.com/wp-content/uploads/2026/02/Prehistoric-Creek-Natural-Day-44x32-Preview.jpg?resize=500%2C350&ssl=1";
        img.onload = () => setImage(img);
    }, []);

    return <Layer>{image && <Image image={image} width={width} height={height} />}</Layer>;
};

const Grid = () => {
    const gridSize = 35;
    const gridComponents = [];

    for (let x = 0; x < width; x += gridSize) {
        for (let y = 0; y < height; y += gridSize) {
            gridComponents.push(
                <Rect 
                    key={`grid-${x}-${y}`}
                    x={x} 
                    y={y} 
                    width={gridSize} 
                    height={gridSize} 
                    stroke="black" 
                    strokeWidth={0.4}
                />
            );
        }
    }

    return <Layer>{gridComponents}</Layer>;
};

export default function GameTabletop() {
    const [gameState, setGameState] = useState<GameState>({});
    const [isConnected, setIsConnected] = useState(false);
    const [newTokenName, setNewTokenName] = useState("");

    const params = new URLSearchParams(window.location.search);
    const clientId = params.get("id") || "1";
    
    const myTokenId = clientId === "2" ? "mago_2" : "guerreiro_1";

    useEffect(() => {
        wsClient.connect(clientId, (data) => {
            console.log("mensagem recebida do backend:", data); 
            if (data.type === "INIT_STATE" || data.type === "STATE_UPDATE") { 
                setGameState(data.state || {}); 
            }
        });

        setIsConnected(true);

        return () => {
            wsClient.disconnect();
        };
    }, [clientId]);

    const handleAddToken = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTokenName.trim()) return;

        wsClient.send("ADD_TOKEN", {
            token_id: newTokenName.trim(),
            x: 100, 
            y: 100  
        });

        setNewTokenName(""); 
    };

    return (
        <div className="w-screen h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4">
            <div className="mb-2 text-sm flex gap-4">
                <span>Cliente: <b>{clientId}</b></span>
                <span>Controlando: <b className="text-blue-400">{myTokenId}</b></span>
                <span>Status: <span className={isConnected ? "text-green-400" : "text-red-400"}>{isConnected ? "Conectado" : "Desconectado"}</span></span>
            </div>

            <form onSubmit={handleAddToken} className="mb-4 flex gap-2">
                <input 
                    type="text" 
                    placeholder="Nome do personagem (ex: ladino_1)" 
                    value={newTokenName}
                    onChange={(e) => setNewTokenName(e.target.value)}
                    className="px-3 py-1 bg-slate-900 border border-slate-700 rounded text-white text-sm focus:outline-none focus:border-blue-500"
                />
                <button 
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-white text-sm font-bold px-4 py-1 rounded transition"
                >
                    Adicionar Token
                </button>
            </form>

            <Stage width={width} height={height} className="border border-slate-700 shadow-lg">
                <Map />
                <Grid />
                
                <Layer>
                    {Object.entries(gameState).map(([tokenId, pos]) => {
                        const isMyToken = tokenId === myTokenId;
                        const fillColor = tokenId.includes("guerreiro") ? "#3b82f6" : "#ef4444"; 

                        // Fallback seguro para evitar NaN caso o backend envie dados incompletos
                        const posX = typeof pos?.x === "number" ? pos.x : 50;
                        const posY = typeof pos?.y === "number" ? pos.y : 50;

                        return (
                            <Group key={tokenId}>
                                <Circle 
                                    x={posX} 
                                    y={posY} 
                                    radius={15} 
                                    fill={fillColor} 
                                    stroke={isMyToken ? "#fbbf24" : "#ffffff"} 
                                    strokeWidth={isMyToken ? 3 : 2}
                                    draggable={isMyToken} 
                                    onDragEnd={(e) => {
                                        wsClient.send("MOVE_TOKEN", {
                                            token_id: tokenId,
                                            x: e.target.x(),
                                            y: e.target.y()
                                        });
                                    }}
                                />
                                <Text 
                                    x={posX - 25} 
                                    y={posY + 18} 
                                    text={tokenId} 
                                    fill="white" 
                                    fontSize={11}
                                />
                            </Group>
                        );
                    })}
                </Layer>
            </Stage>
        </div>
    );
}