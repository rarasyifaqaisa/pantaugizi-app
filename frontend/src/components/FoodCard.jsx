export default function FoodCard({ food, onSelect }) {
  const confidencePct = Math.round(food.confidence * 100);
  return (
    <div
      onClick={() => onSelect(food)}
      className="bg-white border-2 border-gray-100 rounded-2xl p-4 
                 cursor-pointer active:scale-98 hover:border-green-300 
                 transition-all duration-150"
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="font-semibold text-gray-800">{food.name}</p>
          <p className="text-xs text-gray-400 mt-0.5">
            per {food.serving_suggestion_g}g sajian
          </p>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full font-medium
          ${confidencePct >= 70 ? "bg-green-100 text-green-700"
          : confidencePct >= 40  ? "bg-yellow-100 text-yellow-700"
          : "bg-gray-100 text-gray-500"}`}>
          {confidencePct}% cocok
        </span>
      </div>
      <div className="flex gap-3 mt-3 text-center">
        {[
          { label: "Kalori", val: food.calories, unit: "kcal" },
          { label: "Protein", val: food.protein, unit: "g" },
          { label: "Karbo",   val: food.carbs,   unit: "g" },
          { label: "Lemak",   val: food.fat,      unit: "g" },
        ].map(({ label, val, unit }) => (
          <div key={label} className="flex-1 bg-gray-50 rounded-xl py-2">
            <p className="text-xs text-gray-400">{label}</p>
            <p className="text-sm font-bold text-gray-700">{val}<span className="text-xs font-normal">{unit}</span></p>
          </div>
        ))}
      </div>
    </div>
  );
}