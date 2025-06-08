import React, { useState, type ChangeEvent, type KeyboardEvent } from 'react';
import { X, Image, Send, Trees } from 'lucide-react';
import '../App.css'
import gemini from '../../public/gemini.png';
import Navbar from '@/components/Navbar';
import axios from 'axios';
import { parseHtmlCodeBlock } from '@/utils/help';


interface UploadedImage {
    id: number;
    url: string;
    name: string;
}

interface Conversation {
    id: number;
    prompt: string;
    images: UploadedImage[];
    result: string | null;
    timestamp: string;
}

const Plan: React.FC = () => {
    const [prompt, setPrompt] = useState<string>('');
    const [images, setImages] = useState<UploadedImage[]>([]);
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [code, setCode] = useState<any>();

    const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);

        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = (event) => {
                setImages(prev => [...prev, {
                    id: Date.now() + Math.random(),
                    url: event.target?.result as string,
                    name: file.name
                }]);
            };
            reader.readAsDataURL(file);
        });
    };

    const removeImage = (id: number) => {
        setImages(prev => prev.filter(img => img.id !== id));
    };

    const handleSubmit = async () => {
        if (!prompt.trim() && images.length === 0) return;

        const body = {
            location: "Punjab, India",
            field_photo: "Attached",
            last_crop: "Wheat",
            land_size: "1–3 acres",
            budget: "Medium",
            preference: "Max Profit",
            irrigation: "Borewell",
            weather_tolerance: "Okay with some risk",
            machinery: "Tractor",
            labor: "Easy",
            openness: "Open to suggestions",
            crop_type: "Cereal"
        };

        setIsProcessing(true);

        // Add the new conversation first (with no result yet)
        const newConversation: Conversation = {
            id: Date.now(),
            prompt: prompt,
            images: [...images],
            result: null,
            timestamp: new Date().toLocaleTimeString()
        };
        setConversations(prev => [...prev, newConversation]);

        try {
            // Send the POST request as soon as Send is clicked
            const response = await axios.post('http://0.0.0.0:8000/plan-predict/', body);
            console.log('Success:', response.data);
            setCode(response.data.code);
            // Update the last conversation with the result
            setConversations(prev =>
                prev.map((conv, idx) =>
                    idx === prev.length - 1
                        ? { ...conv, result: response.data.code }
                        : conv
                )
            );
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Axios error:', error.response?.data || error.message);
            } else {
                console.error('Unexpected error:', error);
            }
        }

        setIsProcessing(false);
        setPrompt('');
        setImages([]);
    };

    const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    return (
        <div className="flex flex-col justify-between h-screen  border-0 rounded-xl">
            {/* Results Area */}
            <Navbar />
            <div className=" overflow-y-auto p-4 pt-28 space-y-4">
                {conversations.length === 0 ? (
                    <div className="text-center text-gray-500 mt-20">
                        <Trees size={48} className="mx-auto mb-4 text-gray-300" />
                        <p>You are just a step away from efficient farming</p>
                    </div>
                ) : (
                    conversations.map(conv => (
                        <div key={conv.id} className="bg-white rounded-lg shadow-sm p-6 space-y-4">
                            {/* User Prompt */}
                            <div className="space-y-3">
                                <div className="flex items-start space-x-3">
                                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-[0.8rem] font-semibold">
                                        YOU
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-500 mb-1">{conv.timestamp}</p>
                                        <p className="text-gray-800">{conv.prompt || 'No text prompt'}</p>

                                        {/* Display uploaded images */}
                                        {conv.images.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mt-3">
                                                {conv.images.map((img, idx) => (
                                                    <div key={idx} className="relative group">
                                                        <img
                                                            src={img.url}
                                                            alt={img.name}
                                                            className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Result */}
                            {conv.result && (
                                <div className="pt-4 border-t border-gray-100">
                                    <div className='flex gap-2'>
                                        <div className='border-2 size-8 rounded-full overflow-hidden'>
                                            <img src={gemini}></img>
                                        </div>
                                        <p className="text-xs text-gray-500 mb-2">powered by Gemini</p>
                                    </div>
                                    <div className="pl-11">
                                        {parseHtmlCodeBlock(code)}
                                    </div>
                                </div>
                            )}

                            {/* Processing indicator */}
                            {!conv.result && isProcessing && conversations[conversations.length - 1].id === conv.id && (
                                <div className="pt-4 border-t border-gray-100">
                                    <div className='flex gap-2'>
                                        <div className='border-2 size-8 rounded-full overflow-hidden'>
                                            <img src={gemini}></img>
                                        </div>
                                        <p className="text-xs text-gray-500 mb-2">powered by Gemini</p>
                                    </div>
                                    <div className="pl-11 flex space-x-1">
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            {/* Input Area */}
            <div className="flex flex-col justify-end border-t border-gray-200 bg-white p-4">
                {/* Image Previews */}
                {images.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                        {images.map(img => (
                            <div key={img.id} className="relative group">
                                <img
                                    src={img.url}
                                    alt={img.name}
                                    className="w-20 h-20 object-cover rounded-lg border-2 border-gray-200"
                                />
                                <button
                                    onClick={() => removeImage(img.id)}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Input Controls */}
                <div className="flex items-end justify-center gap-2">
                    <div className="flex-1 relative">
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Enter your prompt here..."
                            className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            rows={1}
                            style={{ minHeight: '48px', maxHeight: '120px' }}
                        />

                        {/* Image Upload Button */}
                        <label className="absolute right-2 bottom-3 cursor-pointer text-gray-400 hover:text-gray-600 transition-colors">
                            <Image size={20} />
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                            />
                        </label>
                    </div>

                    {/* Send Button */}
                    <button
                        onClick={handleSubmit}
                        disabled={(!prompt.trim() && images.length === 0) || isProcessing}
                        className="mb-1 px-4 py-3.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                    >
                        <Send size={18} />
                        <span>Send</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Plan;