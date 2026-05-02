from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from datetime import date
from app.supabase_client import supabase
from app.api.auth import get_current_user
from app.services.nutrition import calculate_nutrition_for_portion
from collections import defaultdict
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
def add_log(data: LogRequest, current_user=Depends(get_current_user)):
    food = FOOD_DB.get(data.food_id)
    if not food:
        raise HTTPException(status_code=404, detail="Makanan tidak ditemukan")

    nutrition = calculate_nutrition_for_portion(food, data.portion_g)
    result = supabase.table("food_logs").insert({
        "user_id":   current_user["id"],
        "food_name": food["name"],
        "portion_g": data.portion_g,
        "meal_type": data.meal_type,
        **nutrition
    }).execute()
    return result.data[0]


@router.get("/today")
def get_today_logs(current_user=Depends(get_current_user)):
    today = date.today().isoformat()
    result = supabase.table("food_logs") \
        .select("*") \
        .eq("user_id", current_user["id"]) \
        .gte("logged_at", f"{today}T00:00:00") \
        .lte("logged_at", f"{today}T23:59:59") \
        .execute()

    logs = result.data
    total_cal     = sum(l["calories"]  for l in logs)
    total_protein = sum(l["protein_g"] for l in logs)
    total_carbs   = sum(l["carbs_g"]   for l in logs)
    total_fat     = sum(l["fat_g"]     for l in logs)

    return {
        "logs": logs,
        "summary": {
            "total_calories":  round(total_cal, 1),
            "total_protein":   round(total_protein, 1),
            "total_carbs":     round(total_carbs, 1),
            "total_fat":       round(total_fat, 1),
            "target_calories": current_user["target_cal"],
            "remaining":       round(current_user["target_cal"] - total_cal, 1),
        }
    }


@router.get("/weekly")
def get_weekly_summary(current_user=Depends(get_current_user)):
    result = supabase.table("food_logs") \
        .select("logged_at, calories, protein_g") \
        .eq("user_id", current_user["id"]) \
        .order("logged_at") \
        .execute()

    daily = defaultdict(lambda: {"calories": 0, "protein": 0})
    for log in result.data:
        day = log["logged_at"][:10]
        daily[day]["calories"] += log["calories"]
        daily[day]["protein"]  += log["protein_g"]

    return [
        {"date": day, "calories": round(v["calories"], 1), "protein": round(v["protein"], 1)}
        for day, v in sorted(daily.items())
    ][-7:]