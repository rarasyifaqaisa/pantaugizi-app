export default function CalorieRing({ consumed, target }) {
  const pct        = Math.min((consumed / target) * 100, 100);
  const radius     = 70;
  const circumference = 2 * Math.PI * radius;
  const offset     = circumference - (pct / 100) * circumference;
  const color      = pct > 100 ? "#ef4444" : pct > 80 ? "#f59e0b" : "#22c55e";

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <svg width="180" height="180" className="-rotate-90">
          <circle cx="90" cy="90" r={radius}
            fill="none" stroke="#f3f4f6" strokeWidth="12" />
          <circle cx="90" cy="90" r={radius}
            fill="none" stroke={color} strokeWidth="12"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 0.8s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-gray-800">
            {Math.round(consumed)}
          </span>
          <span className="text-xs text-gray-400">dari {Math.round(target)}</span>
          <span className="text-xs text-gray-400">kalori</span>
        </div>
      </div>
      <p className="mt-2 text-sm font-medium"
        style={{ color }}>
        {pct >= 100 ? "Target tercapai! 🎉" : `Sisa ${Math.round(target - consumed)} kal`}
      </p>
    </div>
  );
}