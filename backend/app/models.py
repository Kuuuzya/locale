from sqlalchemy import Column, Integer, String, ForeignKey, Text, DateTime, Numeric
from sqlalchemy.orm import relationship
from app.database import Base
from datetime import datetime

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, nullable=False)
    email = Column(String, unique=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)

class Country(Base):
    __tablename__ = "countries"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    region = Column(String)

class Cafe(Base):
    __tablename__ = "cafes"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    address = Column(Text)
    city = Column(String)
    country_id = Column(Integer, ForeignKey("countries.id"))
    latitude = Column(Numeric(9,6))
    longitude = Column(Numeric(9,6))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)

class CoffeeBean(Base):
    __tablename__ = "coffee_beans"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    origin_country_id = Column(Integer, ForeignKey("countries.id"))
    description = Column(Text)
    roast_level = Column(String)

class DrinkType(Base):
    __tablename__ = "drink_types"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(Text)

class ConsumedDrink(Base):
    __tablename__ = "consumed_drinks"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    cafe_id = Column(Integer, ForeignKey("cafes.id"))
    coffee_bean_id = Column(Integer, ForeignKey("coffee_beans.id"))
    drink_type_id = Column(Integer, ForeignKey("drink_types.id"))
    consumed_at = Column(DateTime, default=datetime.utcnow)
    rating = Column(Integer)
    notes = Column(Text)
    price = Column(Numeric(10,2))
    currency = Column(String)
