from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import random
import json

app = FastAPI()

# Allow the frontend to talk to this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Data models
class IdeaCreate(BaseModel):
    title: str
    description: str

# Fake database (just a list in memory for now)
fake_database = []

@app.post("/ideas")
def create_idea(idea: IdeaCreate):
    # FAKE AI RESPONSE (So you don't need a key)
    fake_analysis = {
        "problem": "This is a dummy problem statement for validation.",
        "customer": "Target audience is tech-savvy users.",
        "market": "The market is growing at 10% YoY.",
        "competitor": ["Competitor A", "Competitor B", "Competitor C"],
        "tech_stack": "React, Python, SQLite, Docker",
        "risk_level": random.choice(["Low", "Medium", "High"]),
        "profitability_score": random.randint(50, 95),
        "justification": "This idea shows promise based on initial metrics."
    }
    
    # Save to our fake list
    new_entry = {
        "id": len(fake_database) + 1,
        "title": idea.title,
        "description": idea.description,
        "analysis": fake_analysis,
        "score": fake_analysis["profitability_score"]
    }
    fake_database.append(new_entry)
    
    return {"message": "Success", "id": new_entry["id"]}

@app.get("/ideas")
def get_ideas():
    # Return a simplified list for the dashboard
    return [
        {
            "id": item["id"],
            "title": item["title"],
            "description": item["description"],
            "score": item["score"]
        } 
        for item in fake_database
    ]

@app.get("/ideas/{idea_id}")
def get_idea_detail(idea_id: int):
    # Find the specific idea
    for item in fake_database:
        if item["id"] == idea_id:
            return item
    return {"error": "Not found"}