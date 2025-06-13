# CropGenesis

## An AI-Powered Agricultural Assistant for Small and Marginal Farmers

CropGenesis is a comprehensive AI-driven platform created to empower small and marginal farmers by providing personalized crop planning, instant disease diagnosis, and real-time access to essential farming resources. Developed by Team Zero_One for the Google Solution Challenge, it uses cutting-edge Gemini AI to deliver a regional-language-friendly, intelligent, and accessible farming assistant.

[![Demo Video](https://img.shields.io/badge/Watch-Demo_Video-red?style=for-the-badge&logo=youtube)](https://www.youtube.com/watch?v=S71JwuOsJuA)
[![Live Demo](https://img.shields.io/badge/Live-Demo-success?style=for-the-badge&logo=vercel)](https://crop-genesis.vercel.app/)

---

## 🚀 Features

### 🌱 Personalized Crop Planning
- AI-generated plans tailored to individual farm needs using Gemini 2.5 Flash.
- Multi-language support: Hindi, Gujarati, Punjabi, Tamil, Marathi, English.
- Delivered via **text + audio (Gemini 2.5 Flash TTS)**.
- Interactive chatbot for modification and Q&A.

### 📷 Crop Analysis Centre
- Upload **image or video** for crop health assessment.
- AI-powered disease detection with localized treatment suggestions.
- Voice-enabled explanations in regional languages.

### 🏛️ Government Schemes Explorer
- One-stop searchable database for agricultural schemes.
- Includes benefits, eligibility, required documents, contact info, and state filters.

### 📈 Market Intelligence
- Real-time crop price updates directly on the dashboard ticker.

### 🤖 AI-Powered Chat Assistant
- General-purpose farming chatbot using **Gemini 2.0 Flash Lite**.
- Answers FAQs in regional languages.

---

## 🧠 Powered by Gemini AI

| Feature                | Gemini API Used          |
|------------------------|--------------------------|
| Crop Plan (Text)       | Gemini 2.5 Flash         |
| Crop Plan (Audio)      | Gemini 2.5 Flash TTS     |
| Crop Analysis (Text)   | Gemini 2.5 Flash         |
| Crop Analysis (Audio)  | Gemini 2.5 Flash TTS     |
| ChatBot Support        | Gemini 2.0 Flash Lite    |

---

## Technology Stack

### Frontend
- **React + TypeScript**
- Built with Firebase Studio (some components)
- Deployed on **Vercel**

### Backend
- **Python + FastAPI**
- Hosted on **Google Cloud Platform**
- Connects Gemini APIs, crop pricing APIs, and internal logic

### API Integration
- Google Gemini API for AI-powered conversational support

## Process Flow

```
Farmer Opens Web App
        │
        ▼
┌───────────────────────────────┐
│  Upload Farm Info / Image /  │
│  Video / Select Region       │
└───────────────────────────────┘
        │
        ▼
┌──────────────┐    ┌──────────────┐    ┌─────────────────┐
│ Get Crop Plan│    │ Analyze Crop │    │ Govt Schemes    │
└──────────────┘    └──────────────┘    └─────────────────┘
        │                │                    │
        ▼                ▼                    ▼
AI Generates        AI Detects         Filter by State
Personalized        Disease and        and Crop Type
Crop Plan           Recommends         to See Details
(Text + Audio)      Treatment
                     (Text + Audio)
        │                │                    │
        └──────┬─────────┴────────────┬───────┘
               ▼                      ▼
       Interactive Chatbot     General Query Support
       (Text + Audio)          via Gemini AI
```

## Architecture


```
Farmer Opens Web App
      │
      ▼
 ┌─────────────────────────────┐
 │ Upload Info / Image / Video│
 └─────────────────────────────┘
      │
      ▼
┌──────────────┐     ┌──────────────┐     ┌───────────────┐
│ AI Crop Plan │     │ Disease Scan │     │ Scheme Search │
└──────────────┘     └──────────────┘     └───────────────┘
      │                   │                      │
      ▼                   ▼                      ▼
Text/Audio via Gemini   Local Language Output  Filtered Info
```
---

## ⚡ Performance Benchmarks

| Task                             | Time (Text)   | Time (Audio)     |
|----------------------------------|---------------|------------------|
| Personalized Crop Plan           | 40–50 sec     | 3–3.5 mins       |
| Image/Video Crop Analysis        | 20–30 sec     | 80–100 sec       |
| General Query Responses (Chatbot)| ~Instantaneous| Text only        |

- ✅ 99% accuracy in crop plan relevance (mock farmer tests)
- ✅ 95% satisfaction rate for disease diagnosis
- ✅ Supports regional grammar, tone & inclusivity

---

## 📈 Comparative Advantage

| Traditional ML Approach              | Gemini AI-Powered Approach                |
|-------------------------------------|------------------------------------------|
| Requires structured inputs          | Accepts natural language, image/video    |
| No voice support                    | Text + audio in local languages          |
| Limited to prediction               | Real-time interactive assistant          |

---

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- Python (v3.8 or higher)
- pip

### Installation

1. Clone the repository
```bash
git clone https://github.com/dev-spc/CropGenesis.git
cd CropGenesis
```

2. Install frontend dependencies
```bash
cd frontend
npm install
```

3. Install backend dependencies
```bash
cd ../backend
pip install -r requirements.txt
```

4. Set up environment variables
```bash
# Create .env files in both frontend and backend directories with required credentials
```

5. Run the application
```bash
# Start backend
cd backend
uvicorn main:app --reload

# Start frontend (in another terminal)
cd frontend
npm start
```

## Team Zero_One

- **Team Leader**: Shardul P Chorghade
- **Problem Statement**: Empowering Small and Marginal Farmers with AI-Driven Agricultural Solutions


## Acknowledgments

- Thanks to **Google** for Gemini APIs, Firebase Studio, Google Cloud
- Special thanks to mentors, farmers, and supporters of Team Zero_One!
