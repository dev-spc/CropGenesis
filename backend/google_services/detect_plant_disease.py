from PIL import Image
import google.generativeai as genai
from google.genai import types, Client
import asyncio
import wave
import tempfile
import os
import io
from dotenv import load_dotenv
import cv2
from google.genai.types import GenerateContentConfig
from moviepy import AudioFileClip, ColorClip, CompositeVideoClip

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

genai.configure(api_key=GEMINI_API_KEY)
config = types.LiveConnectConfig(response_modalities=["AUDIO"])

def extract_frames(video_path, num_frames=5):
    cap = cv2.VideoCapture(video_path)
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    interval = total_frames // (num_frames + 1)
    frames = []

    for i in range(1, num_frames + 1):
        cap.set(cv2.CAP_PROP_POS_FRAMES, i * interval)
        ret, frame = cap.read()
        if ret:
            frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            frames.append(Image.fromarray(frame_rgb))
    cap.release()
    return frames


model_audio = "gemini-2.5-flash-preview-native-audio-dialog"
client = Client(api_key=GEMINI_API_KEY)

async def detect_plant_disease(image_path, lang, user_prompt="Here is the photo of a leaf. Idenitfy the disease if any."):
    image_extensions = ['.jpg', '.jpeg', '.png', '.bmp', '.tiff', '.gif']
    video_extensions = ['.mp4', '.avi', '.mov', '.mkv', '.flv', '.wmv']
    ext = os.path.splitext(image_path)[1].lower()
    if(ext in image_extensions):
        images = [Image.open(image_path)]
    elif ext in video_extensions:
        images = extract_frames(image_path)
    
    full_prompt = f"""
    Answer in {lang} language.
You are an expert in plant pathology. Analyze the plant leaf image and answer:
- What disease (if any) is affecting the plant?
- What are the symptoms and causes?
- What are the best measures to prevent or treat it?
- What are the products like fertilizers, insecticides to purchase to prevent or treat it?
User says: '{user_prompt}'
    """

    response = client.models.generate_content(
      model="gemini-2.5-flash-preview-05-20",
      contents=[full_prompt, images],
   )

    output_text = response.text
    output_text = output_text.replace("*", "")

    return output_text

async def audio_explanation_disease(text):
    audio_file_wav = "audio_plant_disease.wav"
    audio_file_mp4 = "audio_plant_disease.mp4"
    async with client.aio.live.connect(model=model_audio, config=config) as session:
        
        wf = wave.open(audio_file_wav, "wb")
        wf.setnchannels(1)
        wf.setsampwidth(2)
        wf.setframerate(24000)
        message = f"""
        You are an expert plant pathologist who is also a skilled communicator. Your task is to take a technical explanation about a plant disease (including its name, symptoms, causes, and treatment recommendations) and turn it into a clear, friendly, and easy-to-understand explanation for a farmer
1. Read the provided explanation carefully.
2. Rewrite the explanation as if you are talking to a farmer in the field, using simple words and a friendly, conversational tone.
3. Make sure your explanation is practical, easy to follow, and sounds like natural speech.
4. Do not use complicated jargon or technical terms unless you explain them simply.

Example style:
“Hello! I see that your plant is affected by [disease name]. The main symptoms are [describe symptoms]. This usually happens because [explain causes]. To help your plants recover, I recommend [suggest treatment or prevention steps in simple terms]. If you have any questions, feel free to ask!”

Now, here is the explanation you need to convert:
{text}

Please rewrite it as described above.
"""
        await session.send_client_content(
            turns={"role": "user", "parts": [{"text": message}]}, turn_complete=True
        )

        async for response in session.receive():
            if response.data is not None:
                wf.writeframes(response.data)

        wf.close()
        audio_clip = AudioFileClip(audio_file_wav)
        duration = audio_clip.duration
        video_clip = ColorClip(size=(640, 480), color=(0, 0, 0), duration=duration)
        video_clip = video_clip.with_fps(24)
        final_clip = video_clip.with_audio(audio_clip)
        final_clip.write_videofile(audio_file_mp4, codec="libx264", audio_codec="aac")
        return audio_file_mp4

if __name__ == "__main__":
    image_path = "leave-with-fungus.jpg"
    lang = "English"
    result_text = asyncio.run(detect_plant_disease(image_path, lang = lang))
    audio_path = asyncio.run(audio_explanation_disease(result_text))
    print("\n=== Plant Diagnosis ===\n")
    print(result_text)

    print(f"\n🔊 Voice file saved at: {audio_path}")