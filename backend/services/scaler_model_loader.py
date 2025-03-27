import joblib
import numpy as np
from pathlib import Path

# Get the absolute path of the scaler file
SCALER_PATH = Path(__file__).resolve().parent.parent / "ai_model" / "scaler.pkl"

# Load the scaler
scaler = joblib.load(SCALER_PATH)

def normalize_features(features):
    """Normalize input features using the loaded scaler."""
    features_array = np.array(features).reshape(1, -1)  
    normalized = scaler.transform(features_array)  
    return normalized[0]  
