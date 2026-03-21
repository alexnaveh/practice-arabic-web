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

class CreateGroupRequest(BaseModel):
    name: str
    word_ids: list[int]

class RenameGroupRequest(BaseModel):
    name: str

class AddWordsToGroupRequest(BaseModel):
    word_ids: list[int]

class RemoveWordsFromGroupRequest(BaseModel):
    word_ids: list[int]

# --- Routes ---
@app.get("/")
def read_root():
    return {"message": "Practice Arabic API is running 🚀"}

@app.post("/users/login")
def login(request: LoginRequest, db: Session = Depends(get_db)):
    username = request.username.strip().lower()
    user = db.query(models.User).filter(models.User.username == username).first()

    if not user:
        user = models.User(username=username)
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

# --- Group Routes ---

@app.get("/groups")
def get_groups(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    groups = db.query(models.SubList).filter(models.SubList.user_id == current_user.user_id).all()
    result = []
    for group in groups:
        word_count = db.query(models.SubListWord).filter(models.SubListWord.sublist_id == group.sublist_id).count()
        result.append({
            "sublist_id": group.sublist_id,
            "name": group.name,
            "word_count": word_count
        })
    return result

@app.post("/groups")
def create_group(request: CreateGroupRequest, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    group = models.SubList(user_id=current_user.user_id, name=request.name)
    db.add(group)
    db.commit()
    db.refresh(group)

    for word_id in request.word_ids:
        # Only add words that belong to the current user
        word = db.query(models.Word).filter(models.Word.word_id == word_id, models.Word.user_id == current_user.user_id).first()
        if word:
            db.add(models.SubListWord(sublist_id=group.sublist_id, word_id=word_id))

    db.commit()
    return {"sublist_id": group.sublist_id, "name": group.name, "word_count": len(request.word_ids)}

@app.put("/groups/{sublist_id}")
def rename_group(sublist_id: int, request: RenameGroupRequest, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    group = db.query(models.SubList).filter(models.SubList.sublist_id == sublist_id, models.SubList.user_id == current_user.user_id).first()
    if not group:
        raise HTTPException(status_code=404, detail="Group not found")
    group.name = request.name
    db.commit()
    db.refresh(group)
    return {"sublist_id": group.sublist_id, "name": group.name}

@app.delete("/groups/{sublist_id}")
def delete_group(sublist_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    group = db.query(models.SubList).filter(models.SubList.sublist_id == sublist_id, models.SubList.user_id == current_user.user_id).first()
    if not group:
        raise HTTPException(status_code=404, detail="Group not found")
    # Delete junction rows first, then the group
    db.query(models.SubListWord).filter(models.SubListWord.sublist_id == sublist_id).delete()
    db.delete(group)
    db.commit()
    return {"message": "Group deleted"}

@app.get("/groups/{sublist_id}/words")
def get_group_words(sublist_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    group = db.query(models.SubList).filter(models.SubList.sublist_id == sublist_id, models.SubList.user_id == current_user.user_id).first()
    if not group:
        raise HTTPException(status_code=404, detail="Group not found")

    entries = db.query(models.SubListWord).filter(models.SubListWord.sublist_id == sublist_id).all()
    word_ids = [entry.word_id for entry in entries]
    words = db.query(models.Word).filter(models.Word.word_id.in_(word_ids)).all()

    return [
        {
            "word_id": word.word_id,
            "word_arabic": word.word_arabic,
            "word_hebrew": word.word_hebrew,
            "description": word.description
        }
        for word in words
    ]

@app.post("/groups/{sublist_id}/words")
def add_words_to_group(sublist_id: int, request: AddWordsToGroupRequest, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    group = db.query(models.SubList).filter(models.SubList.sublist_id == sublist_id, models.SubList.user_id == current_user.user_id).first()
    if not group:
        raise HTTPException(status_code=404, detail="Group not found")

    # Get word IDs already in this group to avoid duplicates
    existing = db.query(models.SubListWord).filter(models.SubListWord.sublist_id == sublist_id).all()
    existing_word_ids = {entry.word_id for entry in existing}

    for word_id in request.word_ids:
        if word_id in existing_word_ids:
            continue
        word = db.query(models.Word).filter(models.Word.word_id == word_id, models.Word.user_id == current_user.user_id).first()
        if word:
            db.add(models.SubListWord(sublist_id=sublist_id, word_id=word_id))

    db.commit()
    return {"message": "Words added to group"}

@app.delete("/groups/{sublist_id}/words")
def remove_words_from_group(sublist_id: int, request: RemoveWordsFromGroupRequest, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    group = db.query(models.SubList).filter(models.SubList.sublist_id == sublist_id, models.SubList.user_id == current_user.user_id).first()
    if not group:
        raise HTTPException(status_code=404, detail="Group not found")

    db.query(models.SubListWord).filter(
        models.SubListWord.sublist_id == sublist_id,
        models.SubListWord.word_id.in_(request.word_ids)
    ).delete(synchronize_session=False)

    db.commit()
    return {"message": "Words removed from group"}