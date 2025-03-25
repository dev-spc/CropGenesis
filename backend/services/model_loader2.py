import joblib
import numpy as np
from pathlib import Path

# Get the absolute path of the model file
MODEL_PATH = Path(__file__).resolve().parent.parent / "ai_model" / "yield_prediction_model.pkl"

# Load the trained yield prediction model
model = joblib.load(MODEL_PATH)

def predict_yield(features):
    """Make a yield prediction using the loaded model."""
    prediction = model.predict([features])  # Model outputs an array
    return float(prediction[0])  # Convert NumPy array to Python float for cleaner output
