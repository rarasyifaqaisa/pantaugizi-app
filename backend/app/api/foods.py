from fastapi import APIRouter, Query
import json, os

router = APIRouter(prefix="/foods", tags=["foods"])

# Load database makanan saat startup
DATA_PATH = os.path.join(os.path.dirname(__file__), "../../data/indonesian_foods.json")
with open(DATA_PATH, encoding="utf-8") as f:
    FOOD_DB = json.load(f)

@router.get("/search")
def search_food(q: str = Query(..., min_length=2)):
    """Cari makanan Indonesia berdasarkan nama."""
    q_lower = q.lower()
    results = [
        food for food in FOOD_DB
        if q_lower in food["name"].lower()
        or any(q_lower in kw for kw in food.get("keywords", []))
    ]
    return results[:10]  # max 10 hasil

@router.get("/all")
def get_all_foods():
    return FOOD_DB