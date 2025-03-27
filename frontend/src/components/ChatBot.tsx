
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

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    
    // Add user message
    setMessages(prev => [...prev, { content: inputValue, isUser: true }]);
    
    // Simulate bot response after a short delay
    setTimeout(() => {
      const botResponses = [
        "I can help you analyze your crop images.",
        "Would you like to know more about our crop management features?",
        "Feel free to ask any questions about agricultural practices!",
        "I can provide recommendations based on your crop data.",
        "Let me know if you need help with the image analysis feature."
      ];
      
      const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
      setMessages(prev => [...prev, { content: randomResponse, isUser: false }]);
    }, 1000);
    
    setInputValue('');
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
        onClick={() => setIsOpen(true)}
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
          </div>
          
          {/* Input Area */}
          <div className="border-t p-3 flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1"
            />
            <Button 
              onClick={handleSendMessage}
              size="icon"
              className="bg-google-blue hover:bg-google-blue/90 text-white rounded-full"
            >
              <Send size={18} />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ChatBot;
