from fastapi import FastAPI, Depends, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional

from database import engine, get_db
from auth import create_access_token, decode_access_token
import models

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# --- CORS ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Helper: get current user from token ---
def get_current_user(authorization: str = Header(...), db: Session = Depends(get_db)):
    token = authorization.replace("Bearer ", "")
    user_id = decode_access_token(token)
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    user = db.query(models.User).filter(models.User.user_id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

# --- Request schemas ---
class LoginRequest(BaseModel):
    username: str

class AddWordRequest(BaseModel):
    word_arabic: str
    word_hebrew: str
    description: Optional[str] = None

# --- Routes ---
@app.get("/")
def read_root():
    return {"message": "Practice Arabic API is running 🚀"}

@app.post("/users/login")
def login(request: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.username == request.username).first()

    if not user:
        user = models.User(username=request.username)
        db.add(user)
        db.commit()
        db.refresh(user)

    token = create_access_token(int(user.user_id))
    return {"access_token": token, "token_type": "bearer"}

@app.post("/words")
def add_word(request: AddWordRequest, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    word = models.Word(
        user_id=current_user.user_id,
        word_arabic=request.word_arabic,
        word_hebrew=request.word_hebrew,
        description=request.description
    )
    db.add(word)
    db.commit()
    db.refresh(word)
    return {"word_id": word.word_id, "word_arabic": word.word_arabic, "word_hebrew": word.word_hebrew, "description": word.description}

@app.get("/words")
def get_words(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    words = db.query(models.Word).filter(models.Word.user_id == current_user.user_id).all()
    return [
        {
            "word_id": word.word_id,
            "word_arabic": word.word_arabic,
            "word_hebrew": word.word_hebrew,
            "description": word.description
        }
        for word in words
    ]

@app.put("/words/{word_id}")
def edit_word(word_id: int, request: AddWordRequest, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    word = db.query(models.Word).filter(models.Word.word_id == word_id, models.Word.user_id == current_user.user_id).first()
    if not word:
        raise HTTPException(status_code=404, detail="Word not found")
    word.word_arabic = request.word_arabic
    word.word_hebrew = request.word_hebrew
    word.description = request.description
    db.commit()
    db.refresh(word)
    return {"word_id": word.word_id, "word_arabic": word.word_arabic, "word_hebrew": word.word_hebrew, "description": word.description}

@app.delete("/words/{word_id}")
def delete_word(word_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    word = db.query(models.Word).filter(models.Word.word_id == word_id, models.Word.user_id == current_user.user_id).first()
    if not word:
        raise HTTPException(status_code=404, detail="Word not found")
    db.delete(word)
    db.commit()
    return {"message": "Word deleted"}