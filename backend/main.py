from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv

load_dotenv()

from app.database import Base, engine
from app.api import auth, foods, logs, ai

Base.metadata.create_all(bind=engine)

app = FastAPI(title="PantauGizi API", version="0.1.0")

ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    os.getenv("FRONTEND_URL", "http://192.168.1.10:5173"),
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],      
    allow_credentials=False,  
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(foods.router)
app.include_router(logs.router)
app.include_router(ai.router)

@app.get("/")
def root():
    return {"message": "PantauGizi API 🥗", "docs": "/docs"}