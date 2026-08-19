from sqlalchemy import Column, Integer, String, Text, Boolean, ForeignKey, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

Base = declarative_base()

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, autoincrement=True, unique=True, nullable=False)
    username = Column(String, nullable=False, default="Jogador")
    password_hash = Column(String, nullable=True)
    role = Column(String, nullable=False, default="player")

    characters = relationship("Character", back_populates="user")

class Character(Base):
    __tablename__ = "characters"

    id = Column(Integer, primary_key=True, autoincrement=True, unique=True, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String, default="Personagem")
    attributes = Column(JSON, nullable=True, default={})

    user = relationship("User", back_populates="characters")

class CampaignMap(Base):
    __tablename__ = "campaign_maps"

    id = Column(Integer, primary_key=True, autoincrement=True, unique=True, nullable=False)
    name = Column(String, default="mapa")
    grid_height = Column(Integer, nullable=False)
    grid_width = Column(Integer, nullable=False)
    background_url = Column(String, nullable=True)

class CustomPower(Base):
    __tablename__ = "custom_powers"

    id = Column(Integer, primary_key=True, autoincrement=True, unique=True, nullable=False)
    character_id = Column(Integer, ForeignKey("characters.id"), nullable=False)
    power_name = Column(String, nullable=False, default="poder")
    power_code = Column(Text, nullable=False)

    character = relationship("Character", back_populates="powers")

class LoreArticle(Base):
    __tablename__ = "lore_articles"

    id = Column(Integer, primary_key=True, autoincrement=True, unique=True, nullable=False)
    content = Column(JSON, default=[])
    published = Column(Boolean, default=False)

