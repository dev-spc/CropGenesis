import React, { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import axios from 'axios';
import { toast } from 'sonner';

interface ChatMessage {
  content: string;
  isUser: boolean;
}

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { content: "Hello! I'm your crop assistant. How can I help you today?", isUser: false }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [loadingSession, setLoadingSession] = useState(false);
  const [waitingForBot, setWaitingForBot] = useState(false);

  // Create session when chat is opened
  const handleOpenChat = async () => {
    setIsOpen(true);
    if (!sessionId) {
      setLoadingSession(true);
      try {
        const res = await axios.post('http://0.0.0.0:8000/start-bot');
        if (res.data.session_id) {
          setSessionId(res.data.session_id);
        }
      } catch (e) {
        toast("Issue connecting to Bot")
      } finally {
        setLoadingSession(false);
      }
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !sessionId) return;
    setMessages(prev => [...prev, { content: inputValue, isUser: true }]);
    const userMessage = inputValue;
    setInputValue('');
    setWaitingForBot(true);
    try {
      const res = await axios.post('http://0.0.0.0:8000/chat-continue', {
        session_id: sessionId,
        message: userMessage
      });
      if (res.data && res.data.response) {
        setMessages(prev => [...prev, { content: res.data.response, isUser: false }]);
      }
    } catch (e) {
      setMessages(prev => [...prev, { content: 'Sorry, there was a problem getting a response.', isUser: false }]);
    } finally {
      setWaitingForBot(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat Button */}
      <Button
        className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-lg bg-google-blue hover:bg-google-blue/90 text-white"
        onClick={handleOpenChat}
      >
        <MessageCircle size={24} />
      </Button>

      {/* Chat Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[400px] h-[500px] p-0 overflow-hidden flex flex-col">
          <DialogHeader className="px-4 py-5 border-b">
            <div className="flex items-center justify-between">
              <DialogTitle>Crop Assistant</DialogTitle>
            </div>
          </DialogHeader>
          {/* Loader while session is being created */}
          {loadingSession ? (
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="w-10 h-10 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mb-4"></div>
              <div className="text-blue-500 font-medium">Connecting to assistant...</div>
            </div>
          ) : (
            <>
              {/* Messages Container */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message, index) => (
                  <div 
                    key={index} 
                    className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`max-w-[80%] p-3 rounded-lg ${
                        message.isUser 
                          ? 'bg-google-blue text-white rounded-br-none' 
                          : 'bg-gray-100 text-gray-800 rounded-bl-none'
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>
                ))}
                {/* Show bot typing indicator */}
                {waitingForBot && (
                  <div className="flex justify-start">
                    <div className="max-w-[80%] p-3 rounded-lg bg-gray-100 text-gray-800 rounded-bl-none flex gap-1">
                      <span className="animate-bounce" style={{ animationDelay: '0ms' }}>.</span>
                      <span className="animate-bounce" style={{ animationDelay: '150ms' }}>.</span>
                      <span className="animate-bounce" style={{ animationDelay: '300ms' }}>.</span>
                    </div>
                  </div>
                )}
              </div>
              {/* Input Area */}
              <div className="border-t p-3 flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1"
                  disabled={loadingSession}
                />
                <Button 
                  onClick={handleSendMessage}
                  size="icon"
                  className="bg-google-blue hover:bg-google-blue/90 text-white rounded-full"
                  disabled={loadingSession}
                >
                  <Send size={18} />
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ChatBot;
