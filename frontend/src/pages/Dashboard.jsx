import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/ui/Card";
import CalorieRing from "../components/CalorieRing";
import Button from "../components/ui/Button";
import { getTodayLogs } from "../services/api";
import useUserStore from "../store/userStore";

const MEAL_EMOJI = { breakfast: "🌅", lunch: "☀️", dinner: "🌙", snack: "🍎" };
const MEAL_LABEL = { breakfast: "Sarapan", lunch: "Makan Siang", dinner: "Makan Malam", snack: "Camilan" };

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useUserStore();
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    try {
        const res = await getTodayLogs();
        setData(res.data);
    } catch (e) {
        // Hanya logout kalau memang 401
        if (e.response?.status === 401) {
        logout();
        navigate("/");
        }
    } finally {
        setLoading(false);
    }
    };

  useEffect(() => { fetchLogs(); }, []);

  if (loading) return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white px-6 pt-12 pb-6">
        <div className="h-4 bg-gray-200 rounded-full w-24 mb-2 animate-pulse"/>
        <div className="h-6 bg-gray-200 rounded-full w-40 animate-pulse"/>
      </div>
      <div className="px-4 mt-4 space-y-4">
        <div className="bg-white rounded-3xl p-6 h-64 animate-pulse"/>
        <div className="bg-gray-200 rounded-3xl h-16 animate-pulse"/>
        <div className="bg-white rounded-3xl p-4 h-48 animate-pulse"/>
      </div>
    </div>
  );

  const summary = data?.summary || {};

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white px-6 pt-12 pb-6">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-gray-400 text-sm">Selamat datang,</p>
            <h1 className="text-xl font-bold text-gray-800">{user?.name || "Pengguna"} 👋</h1>
          </div>
          <button onClick={() => { logout(); navigate("/"); }}
            className="text-gray-400 text-sm">Keluar</button>
        </div>
      </div>

      <div className="px-4 mt-4 space-y-4">
        {/* Calorie Ring */}
        <Card className="flex flex-col items-center py-6">
          <p className="text-sm font-medium text-gray-500 mb-4">Kalori Hari Ini</p>
          <CalorieRing
            consumed={summary.total_calories || 0}
            target={summary.target_calories || 2000}
          />
          <div className="flex gap-6 mt-6 w-full justify-center">
            {[
              { label: "Protein",  val: summary.total_protein, unit: "g", color: "text-blue-500" },
              { label: "Karbo",    val: summary.total_carbs,   unit: "g", color: "text-yellow-500" },
              { label: "Lemak",    val: summary.total_fat,     unit: "g", color: "text-red-400" },
            ].map(({ label, val, unit, color }) => (
              <div key={label} className="text-center">
                <p className={`text-lg font-bold ${color}`}>{Math.round(val || 0)}{unit}</p>
                <p className="text-xs text-gray-400">{label}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Log Food Button */}
        <button onClick={() => navigate("/log")}
          className="w-full bg-green-500 text-white py-4 rounded-3xl font-bold text-lg
                     shadow-lg shadow-green-200 active:scale-95 transition-transform flex
                     items-center justify-center gap-2">
          📸 Log Makanan
        </button>

        {/* Today's Logs */}
        <Card>
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-semibold text-gray-800">Log Hari Ini</h2>
            <button onClick={() => navigate("/summary")}
              className="text-green-600 text-sm font-medium">Ringkasan →</button>
          </div>
          {data?.logs?.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-4xl mb-2">🍽️</p>
              <p className="text-gray-400 text-sm">Belum ada makanan yang di-log hari ini</p>
            </div>
          ) : (
            <div className="space-y-2">
              {data?.logs?.map((log) => (
                <div key={log.id} className="flex justify-between items-center py-2 border-b border-gray-50">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{MEAL_EMOJI[log.meal_type] || "🍽️"}</span>
                    <div>
                      <p className="font-medium text-gray-800 text-sm">{log.food_name}</p>
                      <p className="text-xs text-gray-400">{MEAL_LABEL[log.meal_type]} · {log.portion_g}g</p>
                    </div>
                  </div>
                  <p className="font-semibold text-gray-700">{Math.round(log.calories)} kal</p>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}