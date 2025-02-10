import requests
from dotenv import load_dotenv
import os
import json

load_dotenv()

API_KEY_FIREBASE = os.getenv("API_KEY_FIREBASE")
FIREBASE_BASE_URL = os.getenv("FIREBASE_BASE_URL")

headers = {"x-api-key": API_KEY_FIREBASE}

with open("data/realquestions.json", "r", encoding="utf-8") as f:
    data = json.load(f)

final_data = {
    "questions": data
}

#response = requests.post(FIREBASE_BASE_URL + "/addQuestions", headers=headers, json=final_data)

#print(response)
