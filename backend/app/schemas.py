from pydantic import BaseModel, EmailStr, constr
from datetime import datetime
from typing import Optional

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: constr(min_length=6)  # Минимальная длина пароля

class UserLogin(BaseModel):
    email: EmailStr
    password: str  # Пароль без ограничений длины (валидацию длины делаем при регистрации)

class UserResponse(BaseModel):
    id: int
    username: str
    email: EmailStr
    created_at: datetime

    class Config:
        from_attributes = True

class CafeBase(BaseModel):
    name: str
    address: Optional[str] = None
    city: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None

class CafeResponse(CafeBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
