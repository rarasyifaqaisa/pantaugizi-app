from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.database import Base

class FoodLog(Base):
    __tablename__ = "food_logs"

    id          = Column(Integer, primary_key=True, index=True)
    user_id     = Column(Integer, ForeignKey("users.id"), nullable=False)
    food_name   = Column(String, nullable=False)
    portion_g   = Column(Float, nullable=False)   # gram
    calories    = Column(Float, nullable=False)
    protein_g   = Column(Float, default=0)
    carbs_g     = Column(Float, default=0)
    fat_g       = Column(Float, default=0)
    meal_type   = Column(String, default="snack")  # breakfast/lunch/dinner/snack
    logged_at   = Column(DateTime(timezone=True), server_default=func.now())