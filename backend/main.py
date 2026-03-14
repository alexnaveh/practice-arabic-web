from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel

from database import engine, get_db
from auth import create_access_token
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

# --- Request schema ---
class LoginRequest(BaseModel):
    username: str

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