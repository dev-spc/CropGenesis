from PIL import Image
import google.generativeai as genai
from google.genai import types, Client
import os
from dotenv import load_dotenv
import cv2
import tempfile
import io
load_dotenv()

GEMINI_API_KEY=os.getenv("GEMINI_API_KEY")

genai.configure(api_key=GEMINI_API_KEY)
client = Client(api_key=GEMINI_API_KEY)

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

async def plant_analysis_func( 
        description: str = None,
    images: list = None,
    video: object = None,
    lang: str = 'English'):
    pil_images = []
    frame = ''
    if(images):
        for img in images:
            img_bytes = await img.read()
            pil_image = Image.open(io.BytesIO(img_bytes))
            pil_images.append(pil_image)
    
    if video:
        frame = await extract_frames(video)


    # Base prompt for farming plan
    full_prompt = f"""
**Role**: Autonomous Crop Health Assistant  
**Language**: {lang}  
**Input**: Image/Video Only along with extra description (if provided) 

**Analysis Process**:
1. Auto-detect plant species & growth stage
2. Scan for diseases/pests/nutrient issues
3. Assess environmental stressors
4. Cross-reference with local agricultural data

**Output Format**:
"Plant Analysis Report  

**Identified Species**: [Common Name] ([Scientific Name]) - [Confidence]%  
**Primary Concern**: [Disease/Stress Factor]  
**Key Symptoms**:  
- [Symptom 1] matching [plant part]  
- [Symptom 2] indicating [possible cause]  

**Immediate Recommendations**:  
1. [Action 1] using [product] every [days]  
   Example: "Apply copper fungicide (2ml/L) every 5 days"  
2. [Action 2] for [specific purpose]  
   Example: "Remove affected leaves below infection site"  

**Preventive Measures**:  
- [Seasonal practice] before [growth stage]  
- [Companion plant] spacing [measurement]  
- Soil amendment: [organic mixture ratio]  

**Product Guide**:  
- [Product Name]: [Type] for [use case] ([safety rating])  
  Dosage: [quantity]/[area] via [application method]  
  Example: "GreenGrow Neem Oil: Organic pesticide (Class IV) - 15ml/10L water spray"  

**Regional Tips**:  
- Current [month] advisory: [weather-specific warning]  
- Local alternative: [regionally available product]  
- Expected recovery: [timeline] with [care routine]  

**Visual Summary**:  
[Growth stage] plant showing [visible characteristics] with [issue severity]% affected area"  
User says: '{description}'
    """

    # Call Gemini API for content generation
    response = client.models.generate_content(
      model="gemini-2.5-flash-preview-05-20",  # Use a model you have access to (list with client.models.list())
      contents=[full_prompt, *pil_images, frame]
   )
    english_text = response.text
    english_text = english_text.replace("*", "")
    output_text = english_text
    
    return output_text


# async def audio_explanation_disease(text):
#     audio_file_wav = "audio_plant_disease.wav"
#     audio_file_mp4 = "audio_plant_disease.mp4"
#     async with client.aio.live.connect(model=model_audio, config=config) as session:
        
#         wf = wave.open(audio_file_wav, "wb")
#         wf.setnchannels(1)
#         wf.setsampwidth(2)
#         wf.setframerate(24000)
#         message = f"""
#         You are an expert plant pathologist who is also a skilled communicator. Your task is to take a technical explanation about a plant disease (including its name, symptoms, causes, and treatment recommendations) and turn it into a clear, friendly, and easy-to-understand explanation for a farmer
# 1. Read the provided explanation carefully.
# 2. Rewrite the explanation as if you are talking to a farmer in the field, using simple words and a friendly, conversational tone.
# 3. Make sure your explanation is practical, easy to follow, and sounds like natural speech.
# 4. Do not use complicated jargon or technical terms unless you explain them simply.

# Example style:
# “Hello! I see that your plant is affected by [disease name]. The main symptoms are [describe symptoms]. This usually happens because [explain causes]. To help your plants recover, I recommend [suggest treatment or prevention steps in simple terms]. If you have any questions, feel free to ask!”

# Now, here is the explanation you need to convert:
# {text}

# Please rewrite it as described above.
# """
#         await session.send_client_content(
#             turns={"role": "user", "parts": [{"text": message}]}, turn_complete=True
#         )

#         async for response in session.receive():
#             if response.data is not None:
#                 wf.writeframes(response.data)

#         wf.close()
#         subprocess.run(['ffmpeg', '-y', '-i', audio_file_wav, audio_file_mp4])
#         return audio_file_mp4

# if __name__ == "__main__":
#     image_path = "leave-with-fungus.jpg"
#     lang = "English"
#     result_text = asyncio.run(detect_plant_disease(image_path, lang = lang))
#     audio_path = asyncio.run(audio_explanation_disease(result_text))
#     print("\n=== Plant Diagnosis ===\n")
#     print(result_text)

#     print(f"\n🔊 Voice file saved at: {audio_path}")


