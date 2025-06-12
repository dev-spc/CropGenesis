from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from services.model_loader import predict_crop
from services.model_loader2 import predict_yield
from services.scaler_model_loader import normalize_features
from services.plant_disease_model_loader import predict_disease
import google.generativeai as genai
from dotenv import load_dotenv
from google_services.personalized_planning import agriculure_planning, audio_explanation_planning, ask_about_plan
from typing import List, Annotated, Optional
from fastapi.responses import FileResponse
from fastapi import HTTPException
import os
from google_services.detect_plant_disease import plant_analysis_func
from google_services.general_chatbot import GeminiChatbot
import httpx
import urllib.parse
import json

load_dotenv()


app = FastAPI()

# Configure the API key
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
PRICE_API_KEY=os.getenv("PRICE_API_KEY")
def generate_text(prompt: str, systemId: int):
    if(systemId==1):
        system_prompt = "You are an agricultural expert—given a crop and its disease, write 80–100 words with a short intro, 3 spaced bullet points (identification, control, crop management), and a brief conclusion—no asterisks, keep it professional and concise. No styling like bolds or italics."
    elif(systemId==2):
        system_prompt = "You are an expert agronomist and data scientist. Given a crop name and JSON input containing agronomic and environmental data (N, P, K, temperature, humidity, pH, rainfall), justify why the crop is suitable. Summarize the input, explain the significance of each parameter, and provide scientific reasoning for the recommendation. Compare with less suitable crops if relevant. Include potential challenges, best practices, and tips to optimize yield. Conclude with a brief summary. Do not ask follow-up questions. Assume standard values if any data is missing. Response must be within 80–100 words."
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

@app.post("/generate/{systemId}")
async def generate_text_endpoint(input_data: PromptInput, systemId: int):
    try:
        response = generate_text(input_data.prompt, systemId)
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
    

    
@app.post("/plan-predict/")
async def predict_plan(location: Annotated[str, Form()], land_size: Annotated[str, Form()], 
                       last_crop: Annotated[str, Form()], irrigation: Annotated[str, Form()], season: Annotated[str, Form()], 
description: Annotated[Optional[str], Form()] = None,images: List[UploadFile] = File(default=[]), video: Optional[UploadFile] = File(None), 
lang: Annotated[str, Form()] = "English" ):
    try:
        prediction = await agriculure_planning(location, land_size, last_crop, irrigation, season, description, images, video, lang)
        return {"code": str(prediction)} 
    except Exception as e:
        return {"error": str(e)} 
    

@app.post("/plant-analysis/")
async def plant_analysis( description: Annotated[Optional[str], Form()] = None, images: List[UploadFile] = File(default=[]), video: Optional[UploadFile] = File(None),lang: Annotated[str, Form()] = "English"):
    if (not images and video is None) or (images and video):
        raise HTTPException(
        status_code=400,
        detail="Please provide either images or a video, not both."
        )
    try:
        prediction=await plant_analysis_func(description,images,video,lang)
        return {"code":str(prediction)}
    except Exception as e:
        return {"error":str(e)}

class TextRequest(BaseModel):
    text: str

class AudioRequest(BaseModel):
    text: str
    lang: str

@app.post("/get-audio/")
async def get_audio(body: AudioRequest):
    try: 
        prediction = await audio_explanation_planning(body.text, body.lang)
        return {"name": prediction} 
    except Exception as e:
        return {"error": str(e)} 
    

@app.get("/audio/{filename}")
def get_audio(filename: str):
    file_path = f"{filename}"
    if os.path.exists(file_path):
        return FileResponse(file_path, media_type="audio/mpeg")
    return {"error": "File not found"}


@app.post("/ask-about-plan/")
async def ask_about_plan_api(text: TextRequest):
    response = ask_about_plan(text)
    return {"response": response}


chatbot = GeminiChatbot()

class ChatRequest(BaseModel):
    session_id: str
    message: str

@app.post("/start-bot/")
def start_chat():
    session_id = chatbot.start_session()
    return {"session_id": session_id, "message": "Chat session started."}

@app.post("/chat-continue/")
def chat(req: ChatRequest):
    response = chatbot.send_message(req.session_id, req.message)
    if response is None:
        return {"error": "Invalid session_id"}
    return {"response": response}

class LocationInput(BaseModel):
    state: str = "Uttar Pradesh"
    district: str = "Siddharth Nagar"



@app.post("/get-market-price")
async def get_mandi_data(location: LocationInput):
    base_url = "https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070"
    api_key = PRICE_API_KEY

    # Encode query parameters safely
    query_params = {
        "api-key": api_key,
        "format": "json",
        "limit": "30",
        "filters[state.keyword]": location.state,
        "filters[district]": location.district
    }

    # Build the full URL with encoded params
    encoded_params = urllib.parse.urlencode(query_params)
    full_url = f"{base_url}?{encoded_params}"

    async with httpx.AsyncClient() as client:
        response = await client.get(full_url)

    if response.status_code == 200:
        data = response.json()
        if len(data.get("records", [])) < 30:
            # Return local fallback file
            with open("prices.json", "r") as f:
                local_data = json.load(f)
            return local_data
        return data
    else:
        return {
            "error": "Failed to fetch mandi data",
            "status_code": response.status_code
        }

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

