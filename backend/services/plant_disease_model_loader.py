# services/plant_disease_model_loader.py
import json
import pickle
import torch
from pathlib import Path
from services.Disease_Classification.plant_disease_classifier import PlantDiseaseModel, predict_image

# Get the absolute path to this script's directory
BASE_DIR = Path(__file__).resolve().parent
MODEL_DIR = BASE_DIR / "Disease_Classification" / "models"

# Load model config
with open(MODEL_DIR / "model_config.json", "r") as f:
    config = json.load(f)

# Load other model components
with open(MODEL_DIR / config["class_names_path"], "r") as f:
    class_names = json.load(f)

with open(MODEL_DIR / config["label_encoder_path"], "rb") as f:
    label_encoder = pickle.load(f)

with open(MODEL_DIR / config["transform_path"], "rb") as f:
    transform = pickle.load(f)

# Set up model
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = PlantDiseaseModel(num_classes=len(class_names))
model.load_state_dict(torch.load(MODEL_DIR / config["model_path"], map_location=device, weights_only=True))
model.to(device)
model.eval()

# Prediction function
def predict_disease(image_bytes: bytes) -> str:
    temp_path = BASE_DIR / "temp_upload.jpg"
    with open(temp_path, "wb") as f:
        f.write(image_bytes)

    return predict_image(model, str(temp_path), transform, device, label_encoder)
