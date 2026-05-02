from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from app.database import get_db
from app.models.user import User
from app.services.auth import hash_password, verify_password, create_access_token, decode_token
from app.services.nutrition import calculate_target_calories

router  = APIRouter(prefix="/auth", tags=["auth"])
bearer  = HTTPBearer()

# --- Schemas ---
class RegisterRequest(BaseModel):
    email:     str
    name:      str
    password:  str
    age:       int
    weight_kg: float
    height_cm: float
    gender:    str   # "male" / "female"
    goal:      str   # "lose" / "maintain" / "gain"

class LoginRequest(BaseModel):
    email:    str
    password: str

# --- Helper: ambil user dari token ---
def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer),
    db: Session = Depends(get_db)
):
    payload = decode_token(credentials.credentials)
    if not payload:
        raise HTTPException(status_code=401, detail="Token tidak valid")
    
    try:
        user_id = int(payload.get("sub"))  # ← convert string → int
    except (TypeError, ValueError):
        raise HTTPException(status_code=401, detail="Token tidak valid")
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=401, detail="User tidak ditemukan")
    return user

# --- Endpoints ---
@router.post("/register")
def register(data: RegisterRequest, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == data.email).first():
        raise HTTPException(status_code=400, detail="Email sudah terdaftar")

    target_cal = calculate_target_calories(
        data.weight_kg, data.height_cm, data.age, data.gender, data.goal
    )
    user = User(
        email      = data.email,
        name       = data.name,
        password   = hash_password(data.password),
        age        = data.age,
        weight_kg  = data.weight_kg,
        height_cm  = data.height_cm,
        gender     = data.gender,
        goal       = data.goal,
        target_cal = target_cal,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token({"sub": user.id})
    return {"access_token": token, "target_calories": target_cal, "name": user.name}

@router.post("/login")
def login(data: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()
    if not user or not verify_password(data.password, user.password):
        raise HTTPException(status_code=401, detail="Email atau password salah")
    token = create_access_token({"sub": user.id})
    return {"access_token": token, "name": user.name, "target_calories": user.target_cal}

@router.get("/me")
def get_me(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id, "name": current_user.name,
        "email": current_user.email, "target_calories": current_user.target_cal,
        "goal": current_user.goal,
    }