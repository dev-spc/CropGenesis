import cloudinary
import cloudinary.uploader
import os
from fastapi import FastAPI, File, UploadFile
from dotenv import load_dotenv

load_dotenv()

cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET")
)

app = FastAPI()

# Route to upload an image to Cloudinary
@app.post("/upload/")
async def upload_file(file: UploadFile = File(...)):
    try:
        # Read file contents and upload to Cloudinary
        upload_result = cloudinary.uploader.upload(file.file, folder="fastapi_uploads")
        return {"message": "File uploaded successfully", "url": upload_result["secure_url"]}
    except Exception as e:
        return {"error": str(e)}

# Run the FastAPI app
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
