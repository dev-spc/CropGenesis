import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()
GEMINI_API_KEY =os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise ValueError("Please set GEMINI_API_KEY in your .env file")

genai.configure(api_key=GEMINI_API_KEY)

class GeminiChatbot:
    def __init__(self):
        self.model = genai.GenerativeModel("gemini-2.0-flash-lite")
        self.chat_sessions = {}
        self.system_prompt = (
          " You are an intelligent and friendly agricultural assistant chatbot designed to help farmers with a wide range of farming queries. Your responses should be accurate, evidence-based, and tailored to the farmer’s location, crop, and practices. Always use simple language, explain complex terms clearly, and keep your answers within 100 words unless the user requests a detailed explanation. Use Google search when needed to provide the most current information.Always give response in a simple text paragraph and no markdown"
        )

    def start_session(self):
        chat = self.model.start_chat(history=[])
        chat.send_message(self.system_prompt)
        session_id = str(id(chat))
        self.chat_sessions[session_id] = chat
        return session_id

    def send_message(self, session_id, message):
        chat = self.chat_sessions.get(session_id)
        if not chat:
            return None
        response = chat.send_message(message)
        return response.text
