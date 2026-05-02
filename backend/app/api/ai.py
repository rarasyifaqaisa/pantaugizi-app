from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.vision_ai import detect_food, detect_food_from_url

router = APIRouter(prefix="/ai", tags=["ai"])

class DetectFromBase64(BaseModel):
    image_base64: str   # gambar dalam format base64

class DetectFromURL(BaseModel):
    image_url: str      # URL gambar publik (untuk testing)

@router.post("/detect")
def detect_from_image(data: DetectFromBase64):
    """
    Deteksi makanan dari foto (base64).
    Frontend akan convert foto → base64 → kirim ke sini.
    """
    try:
        result = detect_food(data.image_base64)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/detect-url")
def detect_from_url(data: DetectFromURL):
    """
    Deteksi makanan dari URL gambar.
    Gunakan ini untuk testing via Swagger UI.
    """
    try:
        result = detect_food_from_url(data.image_url)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))