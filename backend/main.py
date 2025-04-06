from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from services.model_loader import predict_crop
from services.model_loader2 import predict_yield
from services.scaler_model_loader import normalize_features
from services.plant_disease_model_loader import predict_disease
import google.generativeai as genai
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

app = FastAPI()

# Configure the API key
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

def generate_text(prompt: str):
    system_prompt = "You are an agricultural expert—given a crop and its disease, write 80–100 words with a short intro, 3 spaced bullet points (identification, control, crop management), and a brief conclusion—no asterisks, keep it professional and concise. No styling like bolds or italics."
    model = genai.GenerativeModel('gemini-1.5-flash')
    response = model.generate_content(system_prompt + "\n" + prompt)
    return response.text

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

class PromptInput(BaseModel):
    prompt: str

@app.post("/generate")
async def generate_text_endpoint(input_data: PromptInput):
    try:
        response = generate_text(input_data.prompt)
        return {"response": response}
    except Exception as e:
        print(f"Error: {str(e)}")
        return {"error": str(e)}


class CropFeatures(BaseModel):
    N: int
    P: int
    K: int
    temperature: float
    humidity: float
    ph: float
    rainfall: float

class YieldFeatures(BaseModel):
    latitude: float
    longitude: float
    NDVI: float
    GNDVI: float
    NDWI: float
    SAVI: float
    soil_moisture: float
    temperature: float
    rainfall: float
    crop_type:int
    NDVI_temp: float
    NDVI_rainfall: float
    SAVI_soil_moisture: float

@app.post("/crop-predict/")
async def predict(features: CropFeatures):
    """API endpoint to predict the recommended crop."""
    feature_list = [
        features.N, features.P, features.K,
        features.temperature, features.humidity, features.ph, features.rainfall
    ]

    try:
        prediction = predict_crop(feature_list)
        return {"recommended_crop": str(prediction)}  # Ensure response is JSON serializable
    except Exception as e:
        return {"error": str(e)}  # Return error details for debugging

@app.post("/yield-predict/")
async def predict_yield_model(features: YieldFeatures):
    """API endpoint to predict crop yield with normalized inputs."""
    feature_list = [
        features.latitude, features.longitude, features.NDVI, features.GNDVI,
        features.NDWI, features.SAVI, features.soil_moisture, features.crop_type,
        features.temperature, features.rainfall, features.NDVI_temp, features.NDVI_rainfall,
        features.SAVI_soil_moisture
    ]
    
    try:
        # Normalize the features using the scaler function
        normalized_features = normalize_features(feature_list)

        # Make prediction
        prediction = predict_yield(normalized_features)
        return {"predicted_yield": prediction}
    
    except Exception as e:
        return {"error": str(e)}

@app.post("/plant-disease/")
async def predict_plant_disease(file: UploadFile = File(...)):
        image_bytes = await file.read()
        prediction = predict_disease(image_bytes)
        return {"predicted_disease": prediction}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
