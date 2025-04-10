# CropGenesis

## An AI-Powered Agricultural Assistant for Small and Marginal Farmers

CropGenesis is a comprehensive AI-driven platform designed to empower small and marginal farmers with intelligent, data-driven farming decisions. Developed by Team Zero_One for the Solution Challenge, this platform integrates crop recommendation, yield prediction, and disease diagnosis into one seamless solution.

[![Demo Video](https://img.shields.io/badge/Watch-Demo_Video-red?style=for-the-badge&logo=youtube)](https://www.youtube.com/watch?v=DOYvSXFlVDE)
[![Live Demo](https://img.shields.io/badge/Live-Demo-success?style=for-the-badge&logo=vercel)](https://crop-genesis.vercel.app/)

## Features

### 🌱 Crop Recommendation
Leverages AI to provide tailored crop recommendations based on real-time soil and weather data, ensuring optimal planting decisions.

### 📊 Yield Prediction
Predicts potential yields to help farmers plan resources effectively, optimize input usage, and maximize profitability.

### 🔍 Disease Diagnosis
Utilizes image-based machine learning models to offer disease diagnosis, catching issues early to minimize crop losses.

### 💬 Gemini-Powered 
Provides AI-driven insights, explanations, and support in natural language.

## Technology Stack

### Frontend
- React with TypeScript
- Developed on Google IDX
- Deployed on Vercel

### Backend
- Python with FastAPI
- Deployed on Google Cloud Platform

### Machine Learning Models
- Crop Recommendation: K-Means Classification
- Yield Prediction: Random Forest Algorithm
- Disease Detection: PyTorch-based deep learning models

### API Integration
- Google Gemini API for AI-powered conversational support

## Process Flow

```
┌─────────────────┐     ┌─────────────────────────┐     ┌───────────────────┐
│  Farmer Opens   │     │  Enters Soil/Weather,   │     │ AI Recommends     │
│    Web App      │────▶│  Geo/Crop Data, or      │────▶│ Crops, Predicts   │
│                 │     │  Uploads Leaf Image     │     │ Yield, or Detects │
└─────────────────┘     └─────────────────────────┘     │ Disease           │
                                                         └───────────────────┘
```

## Architecture

```
┌───────────────────────┐     ┌────────────────────────┐
│       Frontend        │     │        Backend         │
│   (React+TypeScript)  │◄───▶│   (Python+FastAPI)     │
│    Deployed on Vercel │     │ Deployed on Google Cloud│
└───────────────────────┘     └────────────┬───────────┘
                                           │
                                           ▼
                    ┌───────────────────────────────────────┐
                    │         Machine Learning Models       │
                    ├───────────────┬────────────┬─────────┤
                    │K-means        │Random      │PyTorch  │
                    │Classification │Forest      │Disease  │
                    │(Crop Rec.)    │(Yield Pred)│Classifier│
                    └───────────────┴────────────┴─────────┘
                                    │
                                    ▼
                               ┌─────────────┐
                               │ Gemini APIs │
                               └─────────────┘
```

## Opportunities and Impact

- **Integrated Solution**: Combines crop recommendation, yield prediction, and disease diagnosis in one platform
- **Data-Driven**: Uses soil and weather data for accurate suggestions
- **Accessibility**: Image-based disease detection reduces need for expert help
- **Resource Optimization**: Helps farmers choose the right crop and plan resources better
- **Early Intervention**: Enables early disease identification to avoid crop loss
- **Scalability**: Built to support different regions and crops
- **Target Audience**: Specifically designed to empower small and marginal farmers

## Future Development

1. **Enhanced Language Support**: Enable multilingual interaction using AI-based translation models to make the web app accessible to farmers in their native languages.

2. **Automated Weather Data Integration**: Eliminate manual input by fetching real-time weather data through APIs to improve accuracy and user convenience.

3. **Advanced Analytics**: Implement more sophisticated data analysis to provide even more accurate recommendations and predictions.

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

- Thanks to Google for providing the technologies and platforms used in this project
- Special thanks to all who supported Team Zero_One during the Solution Challenge
