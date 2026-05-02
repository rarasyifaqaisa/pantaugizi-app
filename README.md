# PantauGizi 🥗
> AI-powered nutrition tracker untuk makanan Indonesia

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://pantaugizi-app.vercel.app)
[![Made with React](https://img.shields.io/badge/React-18-blue)](https://reactjs.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-Python-green)](https://fastapi.tiangolo.com)

---

## 🎯 Problem

Aplikasi nutrition tracker populer seperti MyFitnessPal hampir tidak memiliki
database makanan Indonesia. Pengguna Indonesia terpaksa menebak kalori atau
tidak tracking sama sekali — padahal 28.7% penduduk Indonesia mengalami obesitas
(Kemenkes 2023).

## 💡 Solution

PantauGizi memungkinkan pengguna untuk **foto makanan Indonesia** dan langsung
mendapat informasi kalori & nutrisi secara akurat, tanpa perlu input manual.

## ✨ Features

- 📸 **AI Food Detection** — foto makanan → deteksi otomatis via Imagga API
- 🍛 **Database Lokal** — 15+ makanan Indonesia dengan data nutrisi akurat
- 📊 **Daily Tracking** — log kalori, protein, karbo, lemak harian
- 🎯 **Personal Target** — kalori target dihitung otomatis (BMR + TDEE)
- 📈 **Weekly Summary** — grafik progress mingguan
- 📱 **PWA** — bisa di-install di iPhone layaknya native app

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite + Tailwind CSS |
| Backend | Python + FastAPI |
| Database | PostgreSQL via Supabase |
| AI | Imagga Image Recognition API |
| Deploy | Vercel (frontend + backend) |
| Auth | JWT (python-jose) |

## 🏗️ Architecture

iPhone (PWA)
↓ HTTPS
Vercel Edge
├── /api/* → FastAPI (Python Serverless)
│              ├── Auth Service (JWT)
│              ├── AI Detection (Imagga API)
│              └── Nutrition Calculator
└── /* → React SPA
↓
Supabase (PostgreSQL)

## 🚀 Getting Started

```bash
# Clone repo
git clone https://github.com/rarasyifaqaisa/pantaugizi-app.git

# Backend
cd backend
python -m venv venv && venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env  # isi dengan credentials kamu
uvicorn main:app --reload

# Frontend
cd frontend
npm install
npm run dev
```

## 📱 Demo

🌐 **Live:** https://pantaugizi-app.vercel.app

> Buka di Safari iPhone → tap Share → "Add to Home Screen"
> untuk pengalaman terbaik seperti native app

## 🧠 What I Learned

- Membangun full-stack app dari nol tanpa MacBook menggunakan PWA
  sebagai alternatif native iOS app
- Mengatasi keterbatasan AI recognition untuk makanan lokal dengan
  keyword matching system
- Mengelola deployment serverless untuk Python + PostgreSQL

## 🔮 Future Plans

- [ ] Integrasi Apple HealthKit untuk sync data kesehatan
- [ ] Barcode scanner untuk produk kemasan
- [ ] Rekomendasi menu harian berbasis AI
- [ ] Ekspansi database ke 500+ makanan Indonesia

## 👩‍💻 Author

Rara Syifa Qaisa — Apple Developer Academy Applicant 2026