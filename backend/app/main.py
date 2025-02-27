from fastapi import FastAPI
from app.routes import router

app = FastAPI()

# Добавляем префикс /api ко всем маршрутам
app.include_router(router, prefix="/api")

