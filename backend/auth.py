import os
from jose import jwt
from dotenv import load_dotenv
import bcrypt

def hash_password(plain: str) -> str:
    return bcrypt.hashpw(plain.encode(), bcrypt.gensalt()).decode()

def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode(), hashed.encode())

load_dotenv()

_raw_key = os.getenv("SECRET_KEY")
if not _raw_key:
    raise ValueError("SECRET_KEY is not set in .env")

SECRET_KEY: str = _raw_key  # explicitly typed as str
ALGORITHM = "HS256"

def create_access_token(user_id: int) -> str:
    payload = {"sub": str(user_id)}
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

def decode_access_token(token: str) -> int | None:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        sub = payload.get("sub")
        if not sub:
            return None
        return int(sub)
    except Exception:
        return None