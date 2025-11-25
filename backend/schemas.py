from pydantic import BaseModel, ConfigDict, Field
from typing import List, Optional

# --- Game Schemas ---
class GameBase(BaseModel):
    pgn_moves: str

class GameCreate(GameBase):
    pass # No extra fields needed for creation initially

class Game(GameBase):
    id: int
    user_id: int

    model_config = ConfigDict(from_attributes=True) # Enable ORM mode

# --- User Schemas ---
class UserBase(BaseModel):
    username: str

class UserCreate(UserBase):
    username: str
    password: str = Field(..., min_length=8, max_length=72) # Plain password received during registration

class User(UserBase):
    id: int
    games: List[Game] = [] # A list to hold the user's games

    model_config = ConfigDict(from_attributes=True) # Enable ORM mode

# schemas.py
# ... other schemas ...
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel): # Optional: For decoding token later
    username: Optional[str] = None

# --- Analysis Schema ---
class AnalysisResult(BaseModel):
    """
    Defines the structure for the analysis report.
    """
    total_games: int
    aggressive_score: int
    defensive_score: int
    opening_preference: Optional[str] = None
    personality_type: str
    celebrity_match: str

    model_config = ConfigDict(from_attributes=True) # Enable ORM mode