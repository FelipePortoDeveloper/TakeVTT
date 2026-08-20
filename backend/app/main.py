from fastapi import FastAPI
from core.database import engine
from models.models import Base
from sqlalchemy import inspect
from game_ws.router import router as ws_router
from fastapi.middleware.cors import CORSMiddleware
from api import auth

app = FastAPI(title="TakeVTT", version="0.1")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)
app.include_router(ws_router)
app.include_router(auth.router)

@app.get("/")
def read_root():
    inspector = inspect(engine)
    tabelas = inspector.get_table_names()
    return {"status": "Banco conectado com sucesso!", "tabelas": tabelas}