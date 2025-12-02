import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

# Configure the API with your key
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    print("Warning: GEMINI_API_KEY not found in .env")

genai.configure(api_key=api_key)

def generate_psychological_profile(pgn_list: list, stats: dict) -> str:
    """
    Sends chess data to Gemini and returns a text-based psychological profile.
    """
    if not pgn_list:
        return "Not enough games to generate a profile."

    # 1. Initialize the Model
    model = genai.GenerativeModel('gemini-flash-latest')

    # 2. Construct the Prompt (The "System Persona")
    # We give the AI a role and the data.
    prompt = f"""
    You are an expert behavioral psychologist and a Chess Grandmaster. 
    You analyze how people play chess to determine their real-life personality traits.

    Here is the data for a player:
    - Calculated Aggression Score: {stats.get('aggressive_score')} (High means aggressive)
    - Calculated Defensive Score: {stats.get('defensive_score')}
    - Sample Game Moves (PGN):
    {pgn_list[:3]} 

    Based *strictly* on this data, write a 3-sentence psychological profile about this person.
    1. First sentence: Describe their decision-making style under pressure.
    2. Second sentence: Describe their likely approach to risk in real life (e.g., career or business).
    3. Third sentence: Compare them to a famous historical figure (not necessarily a chess player) who thinks like them.

    Keep it professional, insightful, and slightly dramatic. Do not mention "PGN" or technical terms.
    """

    try:
        # 3. Call the API
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        print(f"AI Error: {e}")
        return "Could not generate profile at this time. (AI Connection Error)"