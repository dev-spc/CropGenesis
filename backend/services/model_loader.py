import joblib
import numpy as np
from pathlib import Path

# Get the absolute path of the model file
MODEL_PATH = Path(__file__).resolve().parent.parent / "ai_model" / "crop_recommend_model.pkl"

# Load the model
model = joblib.load(MODEL_PATH)

# Define crop mapping
CROP_MAPPING = {
    0: "apple", 1: "banana", 2: "blackgram", 3: "chickpea", 4: "coconut", 5: "coffee",
    6: "cotton", 7: "grapes", 8: "jute", 9: "kidneybeans", 10: "lentil", 11: "maize",
    12: "mango", 13: "mothbeans", 14: "mungbean", 15: "muskmelon", 16: "orange",
    17: "papaya", 18: "pigeonpeas", 19: "pomegranate", 20: "rice", 21: "watermelon"
}

def predict_crop(features):
    """Make a prediction using the loaded model and decode it."""
    prediction = model.predict([features])  # Get one-hot encoded output
    predicted_index = int(np.argmax(prediction))  # Get the index of the '1' in one-hot encoding
    return CROP_MAPPING.get(predicted_index, "Unknown Crop")  # Map to crop name



