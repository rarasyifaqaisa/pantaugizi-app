def calculate_bmr(weight_kg: float, height_cm: float,
                  age: int, gender: str) -> float:
    """Hitung Basal Metabolic Rate dengan rumus Mifflin-St Jeor."""
    if gender == "male":
        return (10 * weight_kg) + (6.25 * height_cm) - (5 * age) + 5
    else:
        return (10 * weight_kg) + (6.25 * height_cm) - (5 * age) - 161

def calculate_target_calories(weight_kg: float, height_cm: float,
                               age: int, gender: str, goal: str) -> float:
    """
    Hitung target kalori harian.
    Asumsi activity level: lightly active (x1.375)
    """
    bmr = calculate_bmr(weight_kg, height_cm, age, gender)
    tdee = bmr * 1.375  # lightly active

    if goal == "lose":
        return round(tdee - 500)   # defisit 500 kal/hari
    elif goal == "gain":
        return round(tdee + 300)   # surplus 300 kal/hari
    else:
        return round(tdee)         # maintain

def calculate_nutrition_for_portion(food_per_100g: dict,
                                    portion_g: float) -> dict:
    """Hitung nutrisi berdasarkan porsi aktual."""
    ratio = portion_g / 100
    return {
        "calories": round(food_per_100g["calories"] * ratio, 1),
        "protein_g": round(food_per_100g["protein"] * ratio, 1),
        "carbs_g":   round(food_per_100g["carbs"] * ratio, 1),
        "fat_g":     round(food_per_100g["fat"] * ratio, 1),
    }