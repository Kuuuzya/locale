from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import Column, Integer, String, Text, TIMESTAMP
from pydantic import BaseModel
from datetime import timedelta, datetime
from jose import jwt
from fastapi.security import OAuth2PasswordBearer  # Импортируем для обработки токена
from database import Base, engine, get_db
from auth import hash_password, verify_password
from models import User
import sys
import os

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Конфигурация токенов
SECRET_KEY = "supersecretkey"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

Base.metadata.create_all(bind=engine)

app = FastAPI()

# CORS для React
origins = ["https://locale.itzine.ru"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Переменная для извлечения токена
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

# Модели запросов
class RegisterRequest(BaseModel):
    username: str
    email: str
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str

# Функция для получения текущего пользователя
def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        user = db.query(User).filter(User.email == email).first()
        if user is None:
            raise credentials_exception
        return user
    except jwt.JWTError:
        raise credentials_exception

# Эндпоинт для CSRF-токена
@app.get("/api/csrf-token")
def get_csrf_token():
    csrf_token = jwt.encode({"exp": datetime.utcnow() + timedelta(minutes=10)}, SECRET_KEY, algorithm=ALGORITHM)
    return {"csrfToken": csrf_token}

# Эндпоинт для регистрации
@app.post("/api/register")
def register_user(request: RegisterRequest, db: Session = Depends(get_db)):
    # Проверка существования пользователя
    user = db.query(User).filter((User.email == request.email) | (User.username == request.username)).first()
    if user:
        raise HTTPException(status_code=400, detail="User already exists")

    # Хэширование пароля
    password_hash = hash_password(request.password)

    # Создание нового пользователя
    new_user = User(username=request.username, email=request.email, password_hash=password_hash)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": "User registered successfully"}

# Эндпоинт для авторизации
@app.post("/api/login")
def login_user(request: LoginRequest, db: Session = Depends(get_db)):
    # Проверка пользователя
    user = db.query(User).filter(User.email == request.email).first()
    if not user or not verify_password(request.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    # Генерация токена
    access_token = jwt.encode(
        {"sub": user.email, "exp": datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)},
        SECRET_KEY,
        algorithm=ALGORITHM,
    )

    return {"username": user.username, "access_token": access_token, "token_type": "bearer"}

# Эндпоинт для получения данных пользователя
@app.get("/api/user")
def get_user_info(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return {"username": user.username, "email": user.email, "name": user.name}

# Эндпоинт для обновления имени пользователя
@app.put("/api/user")
def update_user_name(name: str, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    user.name = name
    db.commit()
    db.refresh(user)
    return {"message": "Name updated successfully"}
