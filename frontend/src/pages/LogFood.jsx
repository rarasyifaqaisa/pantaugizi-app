import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useCamera } from "../hooks/useCamera";
import { detectFood, searchFoods, addLog } from "../services/api";
import FoodCard from "../components/FoodCard";
import Button from "../components/ui/Button";

const MEAL_OPTIONS = [
  { val: "breakfast", label: "🌅 Sarapan" },
  { val: "lunch",     label: "☀️ Makan Siang" },
  { val: "dinner",    label: "🌙 Makan Malam" },
  { val: "snack",     label: "🍎 Camilan" },
];

export default function LogFood() {
  const navigate = useNavigate();
  const fileRef  = useRef(null);
  const { videoRef, stream, error: camError, preview,
          startCamera, capturePhoto, handleFileUpload, reset } = useCamera();

  const [step, setStep]           = useState("input");   // input | detecting | select | confirm
  const [candidates, setCandidates] = useState([]);
  const [visionLabels, setVisionLabels] = useState([]);
  const [selected, setSelected]   = useState(null);
  const [portion, setPortion]     = useState("");
  const [mealType, setMealType]   = useState("lunch");
  const [searchQ, setSearchQ]     = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading]     = useState(false);
  const [saved, setSaved]         = useState(false);

  const handleCapture = async () => {
    const b64 = capturePhoto();
    if (!b64) return;
    await runDetection(b64);
  };

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const b64 = await handleFileUpload(file);
    await runDetection(b64);
  };

  const runDetection = async (b64) => {
    setStep("detecting"); setLoading(true);
    try {
      const res = await detectFood(b64);
      setCandidates(res.data.candidates || []);
      setVisionLabels(res.data.vision_labels || []);
      setStep("select");
    } catch { setStep("input"); }
    finally { setLoading(false); }
  };

  const handleSearch = async (q) => {
    setSearchQ(q);
    if (q.length < 2) { setSearchResults([]); return; }
    const res = await searchFoods(q);
    setSearchResults(res.data);
  };

  const handleSelect = (food) => {
    setSelected(food);
    setPortion(String(food.serving_suggestion_g));
    setStep("confirm");
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await addLog({ food_id: selected.id, portion_g: Number(portion), meal_type: mealType });
      setSaved(true);
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch { setLoading(false); }
  };

  // Step: input (kamera/upload)
  if (step === "input") return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white px-6 pt-12 pb-4 flex items-center gap-3">
        <button onClick={() => navigate("/dashboard")} className="text-gray-400">←</button>
        <h1 className="text-xl font-bold text-gray-800">Log Makanan</h1>
      </div>
      <div className="px-4 mt-4 space-y-4">
        {/* Camera */}
        {preview ? (
          <div className="relative rounded-3xl overflow-hidden">
            <img
              src={preview}
              className="w-full aspect-square object-cover rounded-3xl"
          />
          <button
            onClick={() => { reset(); }}
            className="absolute top-3 right-3 bg-black/50 text-white 
                      rounded-full w-8 h-8 flex items-center justify-center text-sm"
          >
            ✕
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-8 text-center space-y-4">
          <p className="text-5xl">📷</p>
          <p className="text-gray-500 text-sm">Foto makananmu untuk deteksi otomatis</p>

          {/* Tombol kamera — pakai input file dengan capture untuk iPhone */}
          <label className="block w-full py-3 px-6 rounded-2xl font-semibold text-base
                            bg-green-500 text-white shadow-lg shadow-green-200
                            cursor-pointer active:scale-95 transition-all duration-200">
            📸 Ambil Foto
            <input
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={handleFile}
            />
          </label>

          {/* Pilih dari galeri — tanpa capture */}
          <label className="block w-full py-3 px-6 rounded-2xl font-semibold text-base
                            bg-gray-100 text-gray-700 cursor-pointer
                            active:scale-95 transition-all duration-200">
            🖼️ Pilih dari Galeri
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFile}
            />
          </label>
        </div>
      )}

        {/* Manual search */}
        <div className="bg-white rounded-3xl p-4">
          <p className="text-sm font-medium text-gray-600 mb-2">Atau cari manual:</p>
          <input
            value={searchQ} onChange={(e) => handleSearch(e.target.value)}
            placeholder="Ketik nama makanan..."
            className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-base focus:outline-none focus:border-green-400"
          />
          {searchResults.map((food) => (
            <div key={food.id} onClick={() => handleSelect(food)}
              className="flex justify-between items-center py-3 border-b border-gray-50 cursor-pointer">
              <p className="font-medium text-gray-800">{food.name}</p>
              <p className="text-sm text-gray-400">{food.calories} kal/100g</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Step: detecting
  if (step === "detecting") return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-50">
      {preview && (
        <img src={`data:image/jpeg;base64,${preview}`}
          className="w-48 h-48 object-cover rounded-3xl opacity-60" />
      )}
      <div className="text-center">
        <div className="text-4xl mb-3 animate-pulse">🤖</div>
        <p className="font-semibold text-gray-700">Menganalisis makanan...</p>
        <p className="text-gray-400 text-sm mt-1">Ini memerlukan beberapa detik</p>
      </div>
    </div>
  );

  // Step: select
  if (step === "select") return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white px-6 pt-12 pb-4 flex items-center gap-3">
        <button onClick={() => { reset(); setStep("input"); }} className="text-gray-400">←</button>
        <h1 className="text-xl font-bold text-gray-800">Hasil Deteksi</h1>
      </div>
      <div className="px-4 mt-2 space-y-3">
        {preview && (
          <img src={`data:image/jpeg;base64,${preview}`}
            className="w-full h-40 object-cover rounded-3xl" />
        )}
        <p className="text-sm text-gray-500">
          AI mendeteksi: <span className="font-medium text-gray-700">
            {visionLabels.slice(0, 4).join(", ")}
          </span>
        </p>
        {candidates.length > 0 ? (
          <>
            <p className="font-semibold text-gray-800">Pilih makanan yang paling sesuai:</p>
            {candidates.map((food) => (
              <FoodCard key={food.id} food={food} onSelect={handleSelect} />
            ))}
          </>
        ) : (
          <div className="bg-white rounded-3xl p-6 text-center">
            <p className="text-3xl mb-2">🤔</p>
            <p className="text-gray-500">Makanan tidak terdeteksi</p>
          </div>
        )}
        <button onClick={() => { reset(); setStep("input"); }}
          className="w-full text-center text-green-600 text-sm font-medium py-3">
          Coba foto ulang atau cari manual
        </button>
      </div>
    </div>
  );

  // Step: confirm
  if (step === "confirm") return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white px-6 pt-12 pb-4 flex items-center gap-3">
        <button onClick={() => setStep("select")} className="text-gray-400">←</button>
        <h1 className="text-xl font-bold text-gray-800">Konfirmasi</h1>
      </div>
      {saved ? (
        <div className="flex flex-col items-center justify-center h-64 gap-3">
          <div className="text-5xl">✅</div>
          <p className="font-semibold text-gray-700">Tersimpan!</p>
        </div>
      ) : (
        <div className="px-4 mt-4 space-y-4">
          <div className="bg-white rounded-3xl p-5">
            <h2 className="text-xl font-bold text-gray-800">{selected?.name}</h2>
            <div className="mt-4">
              <label className="text-sm font-medium text-gray-600 block mb-2">Porsi (gram)</label>
              <input type="number" value={portion}
                onChange={(e) => setPortion(e.target.value)}
                className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-xl font-bold focus:outline-none focus:border-green-400"
              />
            </div>
            {portion && (
              <div className="mt-4 grid grid-cols-2 gap-3">
                {[
                  { label: "Kalori",  val: ((selected.calories * Number(portion)) / 100).toFixed(0), unit: "kcal" },
                  { label: "Protein", val: ((selected.protein  * Number(portion)) / 100).toFixed(1), unit: "g" },
                  { label: "Karbo",   val: ((selected.carbs    * Number(portion)) / 100).toFixed(1), unit: "g" },
                  { label: "Lemak",   val: ((selected.fat      * Number(portion)) / 100).toFixed(1), unit: "g" },
                ].map(({ label, val, unit }) => (
                  <div key={label} className="bg-gray-50 rounded-2xl p-3 text-center">
                    <p className="text-lg font-bold text-gray-800">{val}<span className="text-sm">{unit}</span></p>
                    <p className="text-xs text-gray-400">{label}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="bg-white rounded-3xl p-4">
            <p className="text-sm font-medium text-gray-600 mb-3">Waktu makan:</p>
            <div className="grid grid-cols-2 gap-2">
              {MEAL_OPTIONS.map(({ val, label }) => (
                <button key={val} onClick={() => setMealType(val)}
                  className={`py-3 rounded-2xl text-sm font-medium border-2 transition-colors
                    ${mealType === val ? "border-green-500 bg-green-50 text-green-700" : "border-gray-100 text-gray-500"}`}>
                  {label}
                </button>
              ))}
            </div>
          </div>
          <Button onClick={handleSave} disabled={loading || !portion}>
            {loading ? "Menyimpan..." : "Simpan Log 💾"}
          </Button>
        </div>
      )}
    </div>
  );
}