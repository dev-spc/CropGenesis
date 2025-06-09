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
        self.model = genai.GenerativeModel("gemini-2.5-flash-preview-05-20")
        self.chat_sessions = {}
        self.system_prompt = (
            "You are an intelligent and friendly agricultural assistant chatbot designed to help farmers "
            "with a wide range of queries related to farming. Your goal is to provide accurate, evidence-based, "
            "and clear information tailored to the specific needs of farmers based on their location, crop type, "
            "and farming practices. You should understand common agricultural terminology and be able to explain "
            "complex concepts in simple language when needed. Also do Google search whenever you think it is required."
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
