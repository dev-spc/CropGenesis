from PIL import Image
import google.generativeai as genai
from googletrans import Translator
import asyncio
from google.genai import types, Client
import wave
import os
from dotenv import load_dotenv
import cv2

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")


def wave_file(filename, pcm, channels=1, rate=24000, sample_width=2):
   with wave.open(filename, "wb") as wf:
      wf.setnchannels(channels)
      wf.setsampwidth(sample_width)
      wf.setframerate(rate)
      wf.writeframes(pcm)


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


# Configure your Gemini API Key
genai.configure(api_key=GEMINI_API_KEY)
config = types.LiveConnectConfig(response_modalities=["AUDIO"])


# Translator instance
translator = Translator()

# Gemini Vision Model
model_audio = "gemini-2.5-flash-preview-native-audio-dialog"
client = Client(api_key=GEMINI_API_KEY)


async def agriculure_planning(farmer_prompt, image_path, lang):
    image_extensions = ['.jpg', '.jpeg', '.png', '.bmp', '.tiff', '.gif']
    video_extensions = ['.mp4', '.avi', '.mov', '.mkv', '.flv', '.wmv']
    ext = os.path.splitext(image_path)[1].lower()
    if(ext in image_extensions):
        images = [Image.open(image_path)]
    elif ext in video_extensions:
        images = extract_frames(image_path)

    # Your detailed prompt
    full_prompt = f'''
    Answer in {lang} language.
You are an intelligent agricultural assistant. Based on the following user inputs from a farmer, generate a well-structured, personalized farming plan that maximizes profit while respecting the farmer's constraints and preferences.

🧩 Step 1: Required Inputs
Location: [Provide pin code or GPS coordinates]

Photo of the Field: [Optional – wide-angle shot + close-up of soil]

🪴 Step 2: Optional (But Valuable) Inputs
Basic Information:
Last Crop Grown: [E.g., Wheat, Rice, Maize, etc.]

Land Size: [<1 acre / 1–3 acres / >3 acres]

Budget: [Low / Medium / High]

Farming Preference: [Max Profit / Low Risk / Organic / Water-saving]

Advanced (Optional):
Irrigation Access: [Rainfed / Borewell / Canal / Pond]

Weather Tolerance: [Stable crop only / Okay with some risk]

Machinery Availability: [Tractor / Harvester / None]

Labor Availability: [Easy / Somewhat difficult / None]

Openness to New Crops: [Traditional only / Open to Gemini’s suggestion]

Crop Type Preference: [Cereal / Pulse / Oilseed / Vegetable / Fodder]

🎯 Objective:
Using the inputs above, generate a comprehensive crop plan with the following details:

Recommended Crop(s):

Justify the selection based on location, climate, and preferences.

Mention viable alternatives with pros and cons.

Timeline:

Month-wise action plan from land preparation to harvest.

Soil and Land Preparation:

Techniques suited for the soil (based on image if provided).

Fertilizer recommendations (organic and chemical options).

Seed Selection and Sowing:

Best varieties for high yield and disease resistance.

Ideal sowing method and spacing.

Irrigation Plan:

Weekly schedule based on water availability and crop stage.

Crop Management:

Pest and disease control (organic + chemical options).

Intercropping or rotation suggestions if feasible.

Labor and Machinery Planning:

Anticipated labor requirement at various stages.

How to best use available machinery.

Harvesting and Post-Harvest:

Optimal harvest time and techniques.

Storage, drying, or value-addition options for profit maximization.

Market Strategy:

Potential buyers or mandis based on location.

Tips for timing the market for higher profits.

Risk Mitigation:

Insurance options or contingency crops in case of weather failure.

How to adapt plan under labor or budget constraints.

Sustainability Suggestions:

Organic farming tips if preference is organic.

Water-saving techniques if water is limited.

Next Steps Summary:

Bullet list of what to do immediately, in 1 month, 3 months, and 6 months.

📌 Output Format:
Provide the plan as a structured guide, organized under clear headings, using bullet points, tables, and bold where needed. Keep language simple and practical, suitable for an Indian farmer, while still technically sound.

Keep explanations short, avoid repeating input data, and emphasize cost-effective and locally feasible advice.

Here are the detailes provided by the farmers: {farmer_prompt}

'''

    response = client.models.generate_content(
      model="gemini-2.5-flash-preview-05-20",  # Use a model you have access to (list with client.models.list())
      contents=[full_prompt, images]
   )
    english_text = response.text
    english_text = english_text.replace("*", "")
    output_text = english_text
    # Translate response

    return output_text


async def audio_explanation_planning(text):
    full_prompt = f"""
    You are an experienced agricultural advisor known for your clear, friendly, and practical communication with farmers. Your task is to take a technical farming plan and rewrite it as a simple, spoken explanation that a farmer can easily understand and follow.  
1. Read the provided explanation carefully.
2. Rewrite the explanation as if you are talking to a farmer in the field, using simple words and a friendly, conversational tone.
3. Make sure your explanation is practical, easy to follow, and sounds like natural speech.
4. Do not use complicated jargon or technical terms unless you explain them simply.


Now, here is the explanation you need to convert:
{text}

Please rewrite it as described above.
"""
    response = client.models.generate_content(
      model="gemini-2.5-flash-preview-05-20",
      contents=[full_prompt],
   )
    output_text_explanation = response.text
    output_text_explanation = output_text_explanation.replace("*", "")
    
    response = client.models.generate_content(
        model="gemini-2.5-flash-preview-tts",
        contents=output_text_explanation,
        config=types.GenerateContentConfig(
            response_modalities=["AUDIO"],
            speech_config=types.SpeechConfig(
                voice_config=types.VoiceConfig(
                    prebuilt_voice_config=types.PrebuiltVoiceConfig(
                        voice_name='Zubenelgenubi'
                    )
                )
            ),
        )
    )
    data = response.candidates[0].content.parts[0].inline_data.data

# Play audio directly
    audio_file = "audio_personalized_planning.wav"
    wave_file(audio_file, data)
    return audio_file

if __name__ == "__main__":
    image_path = "RiceFieldClip.mp4"
    farmer_inputs = {
    "location": "Punjab, India",
    "field_photo": "Attached",
    "last_crop": "Wheat",
    "land_size": "1–3 acres",
    "budget": "Medium",
    "preference": "Max Profit",
    "irrigation": "Borewell",
    "weather_tolerance": "Okay with some risk",
    "machinery": "Tractor",
    "labor": "Easy",
    "openness": "Open to suggestions",
    "crop_type": "Cereal",
}
    lang = "English"
    result_text = asyncio.run(agriculure_planning(farmer_inputs, image_path, lang))
    print("\n=== Product Info & Usage ===\n")
    print(result_text)
    audio_pref = input("Do you want explanation in audio format? (y/n) ")
    if(audio_pref=='y'):
        audio_path = asyncio.run(audio_explanation_planning(result_text))
        print(f"\n🔊 Voice file saved at: {audio_path}")
    