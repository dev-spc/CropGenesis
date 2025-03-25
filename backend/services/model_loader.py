import joblib
import pandas as pd  # Import pandas
from pathlib import Path

# Get the absolute path of the model file
MODEL_PATH = Path(__file__).resolve().parent.parent / "ai_model" / "crop_recommend_model.pkl"

# Load the model
model = joblib.load(MODEL_PATH)

# Define the expected feature names (ensure they match what the model was trained with)
FEATURE_NAMES = ["N", "P", "K", "temperature", "humidity", "ph", "rainfall"]

def predict_crop(features):
    """Make a prediction using the loaded model."""
    # Convert input list into a DataFrame with correct feature names
    df = pd.DataFrame([features], columns=FEATURE_NAMES)
    prediction = model.predict(df)
    return prediction[0]
