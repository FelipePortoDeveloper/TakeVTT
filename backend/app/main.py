from fastapi import FastAPI
from core.database import engine
from models.models import Base

from sqlalchemy import inspect

app = FastAPI(title="TakeVTT", version="0.1")
Base.metadata.create_all(bind=engine)

@app.get("/")
def read_root():
    inspector = inspect(engine)
    tabelas = inspector.get_table_names()
    return {"status": "Banco conectado com sucesso!", "tabelas": tabelas}