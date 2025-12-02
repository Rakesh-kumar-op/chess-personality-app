from fastapi.middleware.cors import CORSMiddleware
import os
from fastapi import FastAPI, Depends, HTTPException, status, Form
from datetime import timedelta
from sqlalchemy import create_engine, text # Import 'text' for raw SQL
from sqlalchemy.orm import sessionmaker, Session
from dotenv import load_dotenv
import models
import schemas 
import crud 
import security 
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer

from typing import Optional
from jose import JWTError, jwt
import schemas

from typing import List

# Load environment variables from .env file
load_dotenv()

# Get the database URL from the environment variable
DATABASE_URL = os.getenv("DATABASE_URL")

# --- Database Setup ---
if DATABASE_URL is None:
    print("Error: DATABASE_URL environment variable not set.")
    # Handle the error appropriately, maybe exit or raise an exception
    exit(1) # Exit if database URL is not found

# Create the SQLAlchemy engine
# The engine is the starting point for any SQLAlchemy application.
# It's the home base for the actual database and its DBAPI.
engine = create_engine(DATABASE_URL)

# Create a SessionLocal class
# This class will serve as a factory for new Session objects.
# A Session manages persistence operations for ORM-mapped objects.
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# --- Added this ---

# Create the database tables
# This checks if the tables exist and creates them if they don't
models.Base.metadata.create_all(bind=engine)

# --- FastAPI App ---
app = FastAPI()

# --- Add CORS Middleware ---
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
# --- Dependency ---
def get_db():
    """
    Dependency function to get a database session.
    This will be called for each request that needs a database connection.
    It ensures the session is properly closed after the request.
    """
    db = SessionLocal()
    try:
        yield db # Provide the session to the path operation function
    finally:
        db.close() # Close the session after the request is finished

##########

async def get_current_user(
    token: str = Depends(oauth2_scheme), 
    db: Session = Depends(get_db)
):
    """
    Dependency to get the current user from a JWT token.
    1. Gets token string from the request (via oauth2_scheme).
    2. Decodes and verifies the token.
    3. Fetches the user from the database.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        # Decode the JWT token
        payload = jwt.decode(
            token, security.SECRET_KEY, algorithms=[security.ALGORITHM]
        )
        # The "sub" (subject) of our token is the username
        username: Optional[str] = payload.get("sub")
        if username is None:
            raise credentials_exception
        # Find the user in the database
        user = crud.get_user_by_username(db, username=username)
        if user is None:
            raise credentials_exception
        # Return the user object
        return user
    except JWTError:
        # If token is invalid (expired, wrong signature, etc.)
        raise credentials_exception

# --- API Endpoints ---
@app.get("/")
def read_root():
    """
    Root endpoint.
    """
    return {"message": "Welcome to the Chess App API!"}

@app.get("/db-check")
def check_db_connection(db: Session = Depends(get_db)):
    """
    Endpoint to check if the database connection is working.
    It uses the get_db dependency to get a session.
    """
    try:
        # Execute a simple query to check the connection
        # Using text() is important for executing raw SQL safely with SQLAlchemy >= 2.0
        db.execute(text("SELECT 1"))
        return {"status": "Database connection successful!"}
    except Exception as e:
        # If there's an error, raise an HTTPException
        raise HTTPException(status_code=500, detail=f"Database connection error: {e}")

@app.post("/users/", response_model=schemas.User, status_code=status.HTTP_201_CREATED)
def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    """
    Registers a new user.
    """
    # Check if user already exists
    db_user = crud.get_user_by_username(db, username=user.username)
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    # Create the new user
    created_user = crud.create_user(db=db, user=user)
    return created_user


@app.post("/token", response_model=schemas.Token)
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    """
    Handles user login and returns a JWT token.
    Uses OAuth2PasswordRequestForm for standard form data input (username/password).
    """
    user = crud.authenticate_user(db, username=form_data.username, password=form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    # Create the access token
    access_token_expires = timedelta(minutes=security.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = security.create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    # Return the token
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/users/me", response_model=schemas.User)
async def read_users_me(current_user: models.User = Depends(get_current_user)):
    """
    Fetches the profile of the currently logged-in user.
    This endpoint is protected; it requires a valid JWT token.
    """
    # Because of `Depends(get_current_user)`, this code will
    # only run if the token is valid.
    # The `current_user` variable will be the user object
    # from the database.
    return current_user

@app.post("/games/", response_model=schemas.Game, status_code=status.HTTP_201_CREATED)
async def create_game_for_user(
    game: schemas.GameCreate, 
    current_user: models.User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    """
    Saves a new game for the currently logged-in user.
    """
    # The user's ID is taken from the token (via get_current_user)
    return crud.create_user_game(db=db, game=game, user_id=current_user.id)

@app.get("/games/", response_model=List[schemas.Game])
async def read_user_games(
    current_user: models.User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    """
    Fetches all saved games for the currently logged-in user.
    """
    games = crud.get_user_games(db=db, user_id=current_user.id)
    return games

@app.get("/users/me/analysis", response_model=schemas.AnalysisResult)
async def read_user_analysis(
    current_user: models.User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    """
    Gets the chess personality analysis for the currently logged-in user.
    """
    analysis = crud.analyze_user_games(db=db, user_id=current_user.id)
    return analysis