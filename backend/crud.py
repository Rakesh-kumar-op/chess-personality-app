from sqlalchemy.orm import Session
import models
import schemas
import security # Import the security utilities
import chess.pgn
import io
import ai_agent



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
    
    # --- HANDLE NO GAMES CASE ---
    if not games:
        return schemas.AnalysisResult(
            total_games=0,
            aggressive_score=0,
            defensive_score=0,
            opening_preference="None",
            personality_type="Not Enough Data",
            celebrity_match="Play a few games to find out!",
            ai_report="Play some games to generate a psychological profile!"
        )

    # 2. Initialize analysis variables
    total_games = len(games)
    aggressive_score = 0
    defensive_score = 0
    opening_moves = []

    # 3. Loop through each game and analyze
    for game in games:
        pgn = io.StringIO(game.pgn_moves)
        
        try:
            game_data = chess.pgn.read_game(pgn)
            
            if game_data:
                # FIX: Create a board object to track the state
                board = game_data.board() 
                all_moves = list(game_data.mainline_moves())

                if all_moves:
                    # Store first move for opening preference
                    first_move = board.san(all_moves[0])
                    opening_moves.append(first_move)
                
                    for move in all_moves:
                        # --- Analyze BEFORE pushing the move ---
                        
                        # Check for captures
                        if board.is_capture(move):
                            aggressive_score += 0.5
                        
                        # Check for castling (defensive)
                        if board.is_castling(move):
                            defensive_score += 1

                        # --- Make the move on our board ---
                        board.push(move)

                        # --- Analyze AFTER pushing the move ---
                        
                        # Did this move put the opponent in check?
                        if board.is_check():
                            aggressive_score += 1
                            
        except Exception as e:
            print(f"Error parsing PGN: {e}") 
            continue

    # 4. Determine personality based on scores
    personality_type = "Balanced"
    celebrity_match = "Magnus Carlsen"

    if aggressive_score > (defensive_score * 1.5):
        personality_type = "Aggressive Attacker"
        celebrity_match = "Mikhail Tal"
    elif defensive_score > (aggressive_score * 1.5):
        personality_type = "Solid Defender"
        celebrity_match = "Tigran Petrosian"

    opening_preference = "Varies"
    if opening_moves:
        opening_preference = max(set(opening_moves), key=opening_moves.count)

    # 5. CALL THE AI AGENT
    pgn_samples = [g.pgn_moves for g in games[:5]]
    current_stats = {
        "aggressive_score": aggressive_score,
        "defensive_score": defensive_score
    }
    
    ai_text = ai_agent.generate_psychological_profile(pgn_samples, current_stats)

    return schemas.AnalysisResult(
        total_games=total_games,
        aggressive_score=int(aggressive_score),
        defensive_score=int(defensive_score),
        opening_preference=opening_preference,
        personality_type=personality_type,
        celebrity_match=celebrity_match,
        ai_report=ai_text 
    )