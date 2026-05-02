import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import { register, login } from "../services/api";
import useUserStore from "../store/userStore";

const STEPS = ["welcome", "profile", "goal"];

export default function Onboarding() {
  const navigate   = useNavigate();
  const { setUser, setToken } = useUserStore();
  const [step, setStep]   = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState("");
  const [form, setForm]   = useState({
    name: "", email: "", password: "",
    age: "", weight_kg: "", height_cm: "",
    gender: "male", goal: "maintain",
  });

  const update = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = async () => {
    setLoading(true); setError("");
    try {
        const res = await register({
        ...form,
        age: Number(form.age),
        weight_kg: Number(form.weight_kg),
        height_cm: Number(form.height_cm),
        });

        const token = res.data.access_token;

        // Simpan token DULU ke localStorage secara langsung
        localStorage.setItem("token", token);

        // Baru update store dan navigate
        setToken(token);
        setUser({ name: form.name, target_calories: res.data.target_calories });

        navigate("/dashboard");
    } catch (e) {
        setError(e.response?.data?.detail || "Terjadi kesalahan");
    } finally {
        setLoading(false);
    }
    };

  if (step === 0) return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex flex-col items-center justify-center p-6 text-center">
      <div className="text-6xl mb-6">🥗</div>
      <h1 className="text-3xl font-bold text-gray-800 mb-3">PantauGizi</h1>
      <p className="text-gray-500 mb-2">Tracker nutrisi cerdas untuk</p>
      <p className="text-gray-500 mb-8">makanan Indonesia 🇮🇩</p>
      <div className="w-full max-w-xs space-y-3">
        <Button onClick={() => setStep(1)}>Mulai Sekarang</Button>
        <Button variant="ghost" onClick={() => navigate("/login")}>
          Sudah punya akun? Login
        </Button>
      </div>
    </div>
  );

  if (step === 1) return (
    <div className="min-h-screen bg-white p-6">
      <button onClick={() => setStep(0)} className="text-gray-400 mb-6">← Kembali</button>
      <h2 className="text-2xl font-bold text-gray-800 mb-1">Profil kamu</h2>
      <p className="text-gray-400 mb-6 text-sm">Untuk menghitung kebutuhan kalori harianmu</p>
      <div className="space-y-4">
        {[
          { label: "Nama lengkap", key: "name",      type: "text",   placeholder: "Contoh: Budi Santoso" },
          { label: "Email",        key: "email",     type: "email",  placeholder: "email@kamu.com" },
          { label: "Password",     key: "password",  type: "password",placeholder: "Min. 8 karakter" },
          { label: "Usia (tahun)", key: "age",       type: "number", placeholder: "22" },
          { label: "Berat (kg)",   key: "weight_kg", type: "number", placeholder: "65" },
          { label: "Tinggi (cm)",  key: "height_cm", type: "number", placeholder: "170" },
        ].map(({ label, key, type, placeholder }) => (
          <div key={key}>
            <label className="text-sm font-medium text-gray-600 block mb-1">{label}</label>
            <input
              type={type} placeholder={placeholder} value={form[key]}
              onChange={(e) => update(key, e.target.value)}
              className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-base focus:outline-none focus:border-green-400"
            />
          </div>
        ))}
        <div>
          <label className="text-sm font-medium text-gray-600 block mb-2">Jenis kelamin</label>
          <div className="flex gap-3">
            {[{ val: "male", label: "👨 Laki-laki" }, { val: "female", label: "👩 Perempuan" }].map(({ val, label }) => (
              <button key={val} onClick={() => update("gender", val)}
                className={`flex-1 py-3 rounded-2xl border-2 font-medium text-sm transition-colors
                  ${form.gender === val ? "border-green-500 bg-green-50 text-green-700" : "border-gray-200 text-gray-500"}`}>
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-8">
        <Button onClick={() => setStep(2)}
          disabled={!form.name || !form.email || !form.age}>
          Lanjut →
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white p-6 flex flex-col">
      <button onClick={() => setStep(1)} className="text-gray-400 mb-6">← Kembali</button>
      <h2 className="text-2xl font-bold text-gray-800 mb-1">Apa tujuanmu?</h2>
      <p className="text-gray-400 mb-8 text-sm">Ini akan menentukan target kalori harianmu</p>
      <div className="space-y-4 flex-1">
        {[
          { val: "lose",     emoji: "📉", title: "Turunkan berat badan", desc: "Defisit 500 kalori/hari" },
          { val: "maintain", emoji: "⚖️",  title: "Jaga berat badan",    desc: "Sesuai kebutuhan kalori" },
          { val: "gain",     emoji: "📈", title: "Naikkan berat badan",  desc: "Surplus 300 kalori/hari" },
        ].map(({ val, emoji, title, desc }) => (
          <button key={val} onClick={() => update("goal", val)}
            className={`w-full p-5 rounded-3xl border-2 text-left transition-all
              ${form.goal === val ? "border-green-500 bg-green-50" : "border-gray-100"}`}>
            <span className="text-2xl">{emoji}</span>
            <p className={`font-semibold mt-2 ${form.goal === val ? "text-green-700" : "text-gray-800"}`}>{title}</p>
            <p className="text-sm text-gray-400">{desc}</p>
          </button>
        ))}
      </div>
      {error && <p className="text-red-500 text-sm text-center my-3">{error}</p>}
      <div className="mt-6">
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? "Membuat akun..." : "Selesai & Mulai 🚀"}
        </Button>
      </div>
    </div>
  );
}