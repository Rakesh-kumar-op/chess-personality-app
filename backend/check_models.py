import google.generativeai as genai
import os
from dotenv import load_dotenv

# Load the environment variables
load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    print("Error: No API Key found in .env")
    exit()

print(f"Using API Key: {api_key[:5]}... (hidden)")

try:
    genai.configure(api_key=api_key)
    print("\n--- Available Models for your Key ---")
    # List all models that support generating content
    for m in genai.list_models():
        if 'generateContent' in m.supported_generation_methods:
            print(f"- {m.name}")
            
except Exception as e:
    print(f"\nError connecting to Google: {e}")