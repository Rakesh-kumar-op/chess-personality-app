from sqlalchemy import Column, Integer, String, Text, ForeignKey
from sqlalchemy.orm import relationship, declarative_base

# Create a base class for our models
# All our table models will inherit from this
Base = declarative_base()

class User(Base):
    __tablename__ = "users" # The actual table name in PostgreSQL

    # Define columns
    id = Column(Integer, primary_key=True, index=True) # Auto-incrementing primary key
    username = Column(String, unique=True, index=True, nullable=False) # Unique username
    hashed_password = Column(String, nullable=False) # Store the hashed password

    # Define the relationship to the Game model
    # 'back_populates' links this relationship to the one in the Game model
    games = relationship("Game", back_populates="player")

class Game(Base):
    __tablename__ = "games" # The actual table name

    # Define columns
    id = Column(Integer, primary_key=True, index=True)
    pgn_moves = Column(Text, nullable=False) # Store the PGN move list (can be long)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False) # Foreign key linking to the users table

    # Define the relationship back to the User model
    player = relationship("User", back_populates="games")