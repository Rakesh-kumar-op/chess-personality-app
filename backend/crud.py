from sqlalchemy.orm import Session
import models
import schemas
import security # Import the security utilities
import chess.pgn
import io


def get_user_by_username(db: Session, username: str):
    """Fetches a user by their username."""
    return db.query(models.User).filter(models.User.username == username).first()

def create_user(db: Session, user: schemas.UserCreate):
    """Creates a new user in the database."""
    # Hash the password before storing it
    hashed_password = security.get_password_hash(user.password)
    # Create a SQLAlchemy User model instance
    db_user = models.User(username=user.username, hashed_password=hashed_password)
    # Add the new user to the session
    db.add(db_user)
    # Commit the changes to the database
    db.commit()
    # Refresh the user instance to get the ID assigned by the database
    db.refresh(db_user)
    return db_user

def authenticate_user(db: Session, username: str, password: str):
    """Authenticates a user."""
    user = get_user_by_username(db, username=username)
    if not user:
        return None # User not found
    if not security.verify_password(password, user.hashed_password):
        return None # Incorrect password
    return user # Authentication successful

def create_user_game(db: Session, game: schemas.GameCreate, user_id: int):
    """Creates a new game for a specific user."""
    # Create a SQLAlchemy Game model instance
    db_game = models.Game(**game.model_dump(), user_id=user_id)
    db.add(db_game)
    db.commit()
    db.refresh(db_game)
    return db_game

def get_user_games(db: Session, user_id: int):
    """Fetches all games for a specific user."""
    return db.query(models.Game).filter(models.Game.user_id == user_id).all()

#-----------------------ANALYZE--------------------------------

def analyze_user_games(db: Session, user_id: int):
    """
    Analyzes all games for a user and returns a personality report.
    """
    # 1. Get all games for the user
    games = get_user_games(db, user_id=user_id)

    if not games:
        # Handle case for no games played
        return schemas.AnalysisResult(
            total_games=0,
            aggressive_score=0,
            defensive_score=0,
            personality_type="Not Enough Data",
            celebrity_match="Play a few games to find out!"
        )

    # 2. Initialize analysis variables
    total_games = len(games)
    aggressive_score = 0
    defensive_score = 0
    opening_moves = []

    # 3. Loop through each game and analyze
    for game in games:
        # Use io.StringIO to treat the PGN string as a file
        pgn = io.StringIO(game.pgn_moves)

        try:
            # Read the game from the PGN
            game_data = chess.pgn.read_game(pgn)

            if game_data:
                # Store the first move
                first_move = game_data.board().san(game_data.mainline_moves()[0])
                opening_moves.append(first_move)

                # Loop through all moves in the game
                for move in game_data.mainline_moves():
                    board = move.board()
                    # Check for aggressive moves (checks)
                    if board.is_check():
                        aggressive_score += 1
                    # Check for defensive moves (castling)
                    if board.is_castling(move):
                        defensive_score += 1
                    # Check for captures
                    if board.is_capture(move):
                        aggressive_score += 0.5 # Give partial credit for captures
        except Exception as e:
            print(f"Error parsing PGN: {e}") # Handle potential bad PGN data
            continue # Skip this game

    # 4. Determine personality based on scores
    personality_type = "Balanced"
    celebrity_match = "Magnus Carlsen"

    if aggressive_score > (defensive_score * 1.5):
        personality_type = "Aggressive Attacker"
        celebrity_match = "Mikhail Tal"
    elif defensive_score > (aggressive_score * 1.5):
        personality_type = "Solid Defender"
        celebrity_match = "Tigran Petrosian"

    # Find most common opening
    opening_preference = "Varies"
    if opening_moves:
        opening_preference = max(set(opening_moves), key=opening_moves.count)

    # 5. Return the result using the Pydantic schema
    return schemas.AnalysisResult(
        total_games=total_games,
        aggressive_score=int(aggressive_score),
        defensive_score=int(defensive_score),
        opening_preference=opening_preference,
        personality_type=personality_type,
        celebrity_match=celebrity_match
    )