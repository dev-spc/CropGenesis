from PIL import Image
import google.generativeai as genai
from google.genai import types, Client
from googletrans import Translator
import asyncio
import wave
import tempfile
import os
import io
from dotenv import load_dotenv
import cv2
from google.genai.types import GenerateContentConfig


load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
CHAT_SESSION = None

def wave_file(filename, pcm, channels=1, rate=24000, sample_width=2):
    """Save PCM audio data to a .wav file."""
    with wave.open(filename, "wb") as wf:
        wf.setnchannels(channels)
        wf.setsampwidth(sample_width)
        wf.setframerate(rate)
        wf.writeframes(pcm)


async def extract_frames(video_file, num_frames=5):
    if not video_file or not video_file.filename:
        return []
    
    try:
        video_content = await video_file.read()
        
        with tempfile.NamedTemporaryFile(delete=False, suffix='.mp4') as temp_file:
            temp_file.write(video_content)
            temp_path = temp_file.name
        
        cap = cv2.VideoCapture(temp_path)
        if not cap.isOpened():
            return []
            
        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        if total_frames == 0:
            cap.release()
            os.unlink(temp_path)
            return []
            
        interval = max(1, total_frames // (num_frames + 1))
        
        frames = []
        for i in range(1, num_frames + 1):
            frame_pos = min(i * interval, total_frames - 1)
            cap.set(cv2.CAP_PROP_POS_FRAMES, frame_pos)
            ret, frame = cap.read()
            if ret:
                frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                frames.append(Image.fromarray(frame_rgb))
        
        cap.release()
        os.unlink(temp_path)
        return frames
        
    except:
        return []





genai.configure(api_key="")
config = types.LiveConnectConfig(response_modalities=["AUDIO"])

# Translator instance
translator = Translator()

model_audio = "gemini-2.5-flash-preview-native-audio-dialog"
client = Client(api_key="")


async def agriculure_planning(
    location: str,
    land_size: str,
    last_crop: str,
    irrigation: str,
    season: str,
    description: str = None,
    images: list = None,
    video: object = None,
    lang: str = 'English'
):
    """
    Generate a personalized farming plan using Gemini API based on farmer's prompt and optional image/video.
    Returns HTML or text output as specified.
    """
    pil_images = []
    frame = ''

    for img in images:
        img_bytes = await img.read()
        pil_image = Image.open(io.BytesIO(img_bytes))
        pil_images.append(pil_image)
    
    if video:
        frame = await extract_frames(video)


    # Base prompt for farming plan
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

Here are the detailes provided by the farmers: {location, land_size, last_crop, irrigation, season, description}

Most importantly provide the complete info in the form of html code which can be placed inside a react div which can we diplayed on web page.

'''

    # Call Gemini API for content generation
    response = client.models.generate_content(
      model="gemini-2.5-flash-preview-05-20",  # Use a model you have access to (list with client.models.list())
      contents=[full_prompt, *pil_images, frame]
   )
    english_text = response.text
    english_text = english_text.replace("*", "")
    output_text = english_text
    CHAT_SESSION = client.chats.create(model="gemini-2.5-flash-preview-05-20")
    CHAT_SESSION.send_message(
        f"You are an expert agricultural assistant. Here is the farming plan:\n\n{output_text}\n\n"
        "Use this plan to answer any questions. If you cant find answers than google search it."
    )

    return output_text


async def audio_explanation_planning(text):
    """
    Convert a technical farming plan into a simple spoken explanation and generate audio using Gemini.
    """
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
    # Generate simple spoken explanation
    response = client.models.generate_content(
        model="gemini-2.5-flash-preview-05-20",
        contents=[full_prompt],
    )
    output_text_explanation = response.text
    output_text_explanation = output_text_explanation.replace("*", "")

    # Generate audio from the explanation
    response = client.models.generate_content(
        model="gemini-2.5-flash-preview-tts",
        contents=output_text_explanation,
        config=GenerateContentConfig(
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
    audio_file = "audio_personalized_planning.wav"
    wave_file(audio_file, data)
    return audio_file

def ask_about_plan(user_question):
    global CHAT_SESSION
    response = CHAT_SESSION.send_message(user_question)
    return response.text.strip()

# if __name__ == "__main__":
#     image_path = "RiceFieldClip.mp4"
#     farmer_inputs = {
#     "location": "Punjab, India",
#     "field_photo": "Attached",
#     "last_crop": "Wheat",
#     "land_size": "1–3 acres",
#     "budget": "Medium",
#     "preference": "Max Profit",
#     "irrigation": "Borewell",
#     "weather_tolerance": "Okay with some risk",
#     "machinery": "Tractor",
#     "labor": "Easy",
#     "openness": "Open to suggestions",
#     "crop_type": "Cereal",
# }
#     lang = "English"
#     result_text = asyncio.run(agriculure_planning(farmer_inputs, image_path, lang))
#     print("\n=== Product Info & Usage ===\n")
#     print(result_text)
#     audio_pref = input("Do you want explanation in audio format? (y/n) ")
#     if(audio_pref=='y'):
#         audio_path = asyncio.run(audio_explanation_planning(result_text))
#         print(f"\n🔊 Voice file saved at: {audio_path}")

#     print("\n=== Chatbot: Ask your doubts about the plan! (Type 'exit' to quit) ===\n")
#     while(True):
#         user_input = input("\nUser: ")
#         if(user_input.lower() in ['exit', 'quit']):
#             print("Chatbot: Goodbye!")
#             break
#         chatbot_response = ask_about_plan(user_input)
#         print("Chatbot:", chatbot_response)
    
