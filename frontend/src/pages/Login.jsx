import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import { login } from "../services/api";
import useUserStore from "../store/userStore";

export default function Login() {
  const navigate = useNavigate();
  const { setToken, setUser } = useUserStore();
  const [form, setForm]       = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const handleLogin = async () => {
    setLoading(true); setError("");
    try {
      const res   = await login(form);
      const token = res.data.access_token;
      localStorage.setItem("token", token);
      setToken(token);
      setUser({ name: res.data.name, target_calories: res.data.target_calories });
      navigate("/dashboard");
    } catch (e) {
      setError(e.response?.data?.detail || "Email atau password salah");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white p-6 flex flex-col justify-center">
      <button onClick={() => navigate("/")} className="text-gray-400 mb-8">← Kembali</button>
      <div className="text-4xl mb-4">🥗</div>
      <h1 className="text-2xl font-bold text-gray-800 mb-1">Masuk</h1>
      <p className="text-gray-400 text-sm mb-8">Lanjutkan tracking nutrisimu</p>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-600 block mb-1">Email</label>
          <input
            type="email" value={form.email}
            onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
            placeholder="email@kamu.com"
            className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-base focus:outline-none focus:border-green-400"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-600 block mb-1">Password</label>
          <input
            type="password" value={form.password}
            onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
            placeholder="Password kamu"
            className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-base focus:outline-none focus:border-green-400"
          />
        </div>
      </div>

      {error && <p className="text-red-500 text-sm text-center mt-4">{error}</p>}

      <div className="mt-8">
        <Button onClick={handleLogin} disabled={loading || !form.email || !form.password}>
          {loading ? "Masuk..." : "Masuk →"}
        </Button>
      </div>
    </div>
  );
}