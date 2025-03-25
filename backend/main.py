from fastapi import FastAPI
from pydantic import BaseModel
from services.model_loader import predict_crop
from services.model_loader2 import predict_yield

app = FastAPI()

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
    """API endpoint to predict crop yield."""
    feature_list = [
        features.latitude, features.longitude, features.NDVI, features.GNDVI,
        features.NDWI, features.SAVI, features.soil_moisture, features.crop_type,
        features.temperature,features.rainfall, features.NDVI_temp, features.NDVI_rainfall, features.SAVI_soil_moisture
    ]

    try:
        # Convert features to numpy array and make prediction
        prediction = predict_yield(feature_list)
        return {"predicted_yield": prediction}   # Convert numpy output to JSON serializable format
    except Exception as e:
        return {"error": str(e)}  # Return error details for debugging

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
