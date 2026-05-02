import requests, base64, json, os
from dotenv import load_dotenv

load_dotenv()

API_KEY    = os.getenv("IMAGGA_API_KEY")
API_SECRET = os.getenv("IMAGGA_API_SECRET")
IMAGGA_URL = "https://api.imagga.com/v2/tags"

# Load food database
DATA_PATH = os.path.join(os.path.dirname(__file__), "../../data/indonesian_foods.json")
with open(DATA_PATH, encoding="utf-8") as f:
    FOOD_DB = json.load(f)


def _match_foods(tags: list[str]) -> list[dict]:
    """Cocokkan tags dari Imagga dengan food database kita."""
    labels_lower = [t.lower() for t in tags]
    results = []

    for food in FOOD_DB:
        keywords = [kw.lower() for kw in food.get("keywords", [])]
        matched  = [kw for kw in keywords
                    if any(kw in label for label in labels_lower)]

        if matched:
            confidence = len(matched) / len(keywords)
            results.append({
                "id":                   food["id"],
                "name":                 food["name"],
                "confidence":           round(confidence, 2),
                "calories":             food["calories"],
                "protein":              food["protein"],
                "carbs":                food["carbs"],
                "fat":                  food["fat"],
                "serving_suggestion_g": food.get("serving_suggestion_g", 100),
                "matched_keywords":     matched,
            })

    results.sort(key=lambda x: x["confidence"], reverse=True)
    return results[:3]


def _call_imagga_base64(image_base64: str) -> list[str]:
    """Kirim gambar base64 ke Imagga."""
    response = requests.post(
        IMAGGA_URL,
        auth=(API_KEY, API_SECRET),
        data={"image_base64": image_base64},
    )
    data = response.json()
    if response.status_code != 200:
        raise Exception(f"Imagga error: {data}")

    # Ambil tags dengan confidence > 30
    tags = [
        t["tag"]["en"] for t in data["result"]["tags"]
        if t["confidence"] > 30
    ]
    return tags


def _call_imagga_url(image_url: str) -> list[str]:
    """Kirim URL gambar ke Imagga (untuk testing)."""
    response = requests.get(
        IMAGGA_URL,
        auth=(API_KEY, API_SECRET),
        params={"image_url": image_url},
    )
    data = response.json()
    if response.status_code != 200:
        raise Exception(f"Imagga error: {data}")

    tags = [
        t["tag"]["en"] for t in data["result"]["tags"]
        if t["confidence"] > 30
    ]
    return tags


def detect_food(image_base64: str) -> dict:
    """Deteksi makanan dari gambar base64."""
    tags       = _call_imagga_base64(image_base64)
    candidates = _match_foods(tags)
    return {
        "vision_labels": tags,
        "candidates":    candidates,
        "detected":      len(candidates) > 0,
    }


def detect_food_from_url(image_url: str) -> dict:
    """Deteksi makanan dari URL (untuk testing)."""
    tags       = _call_imagga_url(image_url)
    candidates = _match_foods(tags)
    return {
        "vision_labels": tags,
        "candidates":    candidates,
        "detected":      len(candidates) > 0,
    }