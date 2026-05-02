import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import Card from "../components/ui/Card";
import { getWeekly, getTodayLogs } from "../services/api";

export default function Summary() {
  const navigate = useNavigate();
  const [weekly, setWeekly]   = useState([]);
  const [today,  setToday]    = useState(null);

  useEffect(() => {
    getWeekly().then((r)     => setWeekly(r.data));
    getTodayLogs().then((r)  => setToday(r.data.summary));
  }, []);

  const dayLabel = (dateStr) => {
    const d = new Date(dateStr);
    return ["Min","Sen","Sel","Rab","Kam","Jum","Sab"][d.getDay()];
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-white px-6 pt-12 pb-4 flex items-center gap-3">
        <button onClick={() => navigate("/dashboard")} className="text-gray-400">←</button>
        <h1 className="text-xl font-bold text-gray-800">Ringkasan Mingguan</h1>
      </div>
      <div className="px-4 mt-4 space-y-4">
        {/* Bar Chart */}
        <Card>
          <h2 className="font-semibold text-gray-700 mb-4">Kalori 7 Hari Terakhir</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weekly.map((d) => ({ ...d, day: dayLabel(d.date) }))}>
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="calories" radius={[8, 8, 0, 0]}>
                {weekly.map((_, i) => (
                  <Cell key={i} fill={i === weekly.length - 1 ? "#22c55e" : "#bbf7d0"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Today's macros */}
        {today && (
          <Card>
            <h2 className="font-semibold text-gray-700 mb-3">Nutrisi Hari Ini</h2>
            {[
              { label: "Kalori",  val: today.total_calories, target: today.target_calories, unit: "kal", color: "bg-green-400" },
              { label: "Protein", val: today.total_protein,  target: 60,                   unit: "g",   color: "bg-blue-400" },
              { label: "Karbo",   val: today.total_carbs,    target: 250,                  unit: "g",   color: "bg-yellow-400" },
              { label: "Lemak",   val: today.total_fat,      target: 65,                   unit: "g",   color: "bg-red-400" },
            ].map(({ label, val, target, unit, color }) => {
              const pct = Math.min((val / target) * 100, 100);
              return (
                <div key={label} className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 font-medium">{label}</span>
                    <span className="text-gray-400">{Math.round(val)} / {target} {unit}</span>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full ${color} rounded-full transition-all duration-700`}
                      style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </Card>
        )}
      </div>
    </div>
  );
}