from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, cast, Date
from pydantic import BaseModel
from datetime import date, datetime, timezone
from app.database import get_db
from app.models.food_log import FoodLog
from app.api.auth import get_current_user
from app.services.nutrition import calculate_nutrition_for_portion
import json, os

router = APIRouter(prefix="/logs", tags=["logs"])

DATA_PATH = os.path.join(os.path.dirname(__file__), "../../data/indonesian_foods.json")
with open(DATA_PATH, encoding="utf-8") as f:
    FOOD_DB = {food["id"]: food for food in json.load(f)}

class LogRequest(BaseModel):
    food_id:   str
    portion_g: float
    meal_type: str = "snack"

@router.post("/")
def add_log(data: LogRequest, db: Session = Depends(get_db),
            current_user=Depends(get_current_user)):
    food = FOOD_DB.get(data.food_id)
    if not food:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Makanan tidak ditemukan")

    nutrition = calculate_nutrition_for_portion(food, data.portion_g)
    log = FoodLog(
        user_id   = current_user.id,
        food_name = food["name"],
        portion_g = data.portion_g,
        meal_type = data.meal_type,
        **nutrition
    )
    db.add(log)
    db.commit()
    db.refresh(log)
    return log

@router.get("/today")
def get_today_logs(db: Session = Depends(get_db),
                   current_user=Depends(get_current_user)):
    today = date.today()
    logs = db.query(FoodLog).filter(
        FoodLog.user_id == current_user.id,
        cast(FoodLog.logged_at, Date) == today
    ).all()

    total_cal     = sum(l.calories for l in logs)
    total_protein = sum(l.protein_g for l in logs)
    total_carbs   = sum(l.carbs_g for l in logs)
    total_fat     = sum(l.fat_g for l in logs)

    return {
        "logs": logs,
        "summary": {
            "total_calories": round(total_cal, 1),
            "total_protein":  round(total_protein, 1),
            "total_carbs":    round(total_carbs, 1),
            "total_fat":      round(total_fat, 1),
            "target_calories": current_user.target_cal,
            "remaining":      round(current_user.target_cal - total_cal, 1),
        }
    }

@router.get("/weekly")
def get_weekly_summary(db: Session = Depends(get_db),
                        current_user=Depends(get_current_user)):
    logs = db.query(
        cast(FoodLog.logged_at, Date).label("day"),
        func.sum(FoodLog.calories).label("total_cal"),
        func.sum(FoodLog.protein_g).label("total_protein"),
    ).filter(
        FoodLog.user_id == current_user.id
    ).group_by("day").order_by("day").limit(7).all()

    return [{"date": str(l.day), "calories": round(l.total_cal, 1),
             "protein": round(l.total_protein, 1)} for l in logs]