from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from app.supabase_client import supabase
from app.services.auth import hash_password, verify_password, create_access_token, decode_token
from app.services.nutrition import calculate_target_calories

router = APIRouter(prefix="/auth", tags=["auth"])
bearer = HTTPBearer()


class RegisterRequest(BaseModel):
    email:     str
    name:      str
    password:  str
    age:       int
    weight_kg: float
    height_cm: float
    gender:    str
    goal:      str


class LoginRequest(BaseModel):
    email:    str
    password: str


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer)
):
    payload = decode_token(credentials.credentials)
    if not payload:
        raise HTTPException(status_code=401, detail="Token tidak valid")
    try:
        user_id = int(payload.get("sub"))
    except (TypeError, ValueError):
        raise HTTPException(status_code=401, detail="Token tidak valid")

    result = supabase.table("users").select("*").eq("id", user_id).execute()
    if not result.data:
        raise HTTPException(status_code=401, detail="User tidak ditemukan")
    return result.data[0]


@router.post("/register")
def register(data: RegisterRequest):
    existing = supabase.table("users").select("id").eq("email", data.email).execute()
    if existing.data:
        raise HTTPException(status_code=400, detail="Email sudah terdaftar")

    target_cal = calculate_target_calories(
        data.weight_kg, data.height_cm, data.age, data.gender, data.goal
    )
    result = supabase.table("users").insert({
        "email":      data.email,
        "name":       data.name,
        "password":   hash_password(data.password),
        "age":        data.age,
        "weight_kg":  data.weight_kg,
        "height_cm":  data.height_cm,
        "gender":     data.gender,
        "goal":       data.goal,
        "target_cal": target_cal,
    }).execute()

    user = result.data[0]
    token = create_access_token({"sub": user["id"]})
    return {"access_token": token, "target_calories": target_cal, "name": user["name"]}


@router.post("/login")
def login(data: LoginRequest):
    result = supabase.table("users").select("*").eq("email", data.email).execute()
    if not result.data:
        raise HTTPException(status_code=401, detail="Email atau password salah")
    user = result.data[0]
    if not verify_password(data.password, user["password"]):
        raise HTTPException(status_code=401, detail="Email atau password salah")
    token = create_access_token({"sub": user["id"]})
    return {"access_token": token, "name": user["name"], "target_calories": user["target_cal"]}


@router.get("/me")
def get_me(current_user=Depends(get_current_user)):
    return {
        "id":              current_user["id"],
        "name":            current_user["name"],
        "email":           current_user["email"],
        "target_calories": current_user["target_cal"],
        "goal":            current_user["goal"],
    }