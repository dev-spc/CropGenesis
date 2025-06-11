import React, { useState, type ChangeEvent, type KeyboardEvent } from 'react';
import { X, Image, Send, Trees, Upload, Video, Volume2, Loader2 } from 'lucide-react';
import '../App.css'
import gemini from '../../public/gemini.png';
import Navbar from '@/components/Navbar';
import axios from 'axios';
import { parseHtmlCodeBlock } from '@/utils/help';
import { toast } from 'sonner';

interface UploadedFile {
    id: number;
    url: string;
    name: string;
    type: 'image' | 'video';
}

interface FormData {
    field1: string; 
    field2: string; 
    field3: string; 
    field4: string; 
    field5: string; 
    field6: string; 
    images: UploadedFile[];
    video: UploadedFile | null;
}

interface Conversation {
    id: number;
    prompt: string;
    images: UploadedFile[];
    result: string | null;
    timestamp: string;
}

const Plan: React.FC = () => {

    const [showForm, setShowForm] = useState<boolean>(true);
    const [formData, setFormData] = useState<FormData>({
        field1: '',
        field2: '',
        field3: '',
        field4: '',
        field5: '',
        field6: '',
        images: [],
        video: null
    });
    const [isFormSubmitting, setIsFormSubmitting] = useState<boolean>(false);
    const [initialHtmlResult, setInitialHtmlResult] = useState<string>('');

    const [isAudioLoading, setIsAudioLoading] = useState<boolean>(false);
    const [audioUrl, setAudioUrl] = useState<string>('');
    const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

    const [prompt, setPrompt] = useState<string>('');
    const [images, setImages] = useState<UploadedFile[]>([]);
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [preferredLang, setPreferredLang] = useState<string>('English');

    const handleFormFieldChange = (field: keyof FormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleFormImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);

        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = (event) => {
                setFormData(prev => ({
                    ...prev,
                    images: [...prev.images, {
                        id: Date.now() + Math.random(),
                        url: event.target?.result as string,
                        name: file.name,
                        type: 'image'
                    }]
                }));
            };
            reader.readAsDataURL(file);
        });
    };

    const handleFormVideoUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            setFormData(prev => ({
                ...prev,
                video: {
                    id: Date.now(),
                    url: event.target?.result as string,
                    name: file.name,
                    type: 'video'
                }
            }));
        };
        reader.readAsDataURL(file);
    };

    const removeFormImage = (id: number) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter(img => img.id !== id)
        }));
    };

    const removeFormVideo = () => {
        setFormData(prev => ({ ...prev, video: null }));
    };

    const handleFormSubmit = async () => {
        if (!formData.field1 || !formData.field2 || !formData.field3 || !formData.field4 || !formData.field5) {
            toast('Please fill all required fields');
            return;
        }

        setIsFormSubmitting(true);

        try {
            const apiFormData = new FormData();
            apiFormData.append('location', formData.field1);
            apiFormData.append('land_size', formData.field2);
            apiFormData.append('last_crop', formData.field3);
            apiFormData.append('irrigation', formData.field4);
            apiFormData.append('season', formData.field5);
            apiFormData.append('description', formData.field6);
            apiFormData.append('lang', preferredLang);

            formData.images.forEach((image) => {
                const base64Data = image.url.split(',')[1];
                const byteArray = atob(base64Data);
                const uint8Array = new Uint8Array(byteArray.length);
                for (let i = 0; i < byteArray.length; i++) {
                    uint8Array[i] = byteArray.charCodeAt(i);
                }
                const blob = new Blob([uint8Array], { type: 'image/jpeg' });
                apiFormData.append('images', blob);
            });

            if (formData.video) {
                const base64Data = formData.video.url.split(',')[1];
                const byteArray = atob(base64Data);
                const uint8Array = new Uint8Array(byteArray.length);
                for (let i = 0; i < byteArray.length; i++) {
                    uint8Array[i] = byteArray.charCodeAt(i);
                }
                const blob = new Blob([uint8Array], { type: 'video/mp4' });
                apiFormData.append('video', blob);
            }

            const response = await axios.post('https://crop-genesis.duckdns.org/plan-predict', apiFormData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log('Form Success:', response.data);
            setInitialHtmlResult(response.data.html || response.data.code || '');
            setShowForm(false);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Form Axios error:', error.response?.data || error.message);
            } else {
                console.error('Form Unexpected error:', error);
            }
        }

        setIsFormSubmitting(false);
    };

    const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);

        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = (event) => {
                setImages(prev => [...prev, {
                    id: Date.now() + Math.random(),
                    url: event.target?.result as string,
                    name: file.name,
                    type: 'image'
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

        setIsProcessing(true);

        const newConversation: Conversation = {
            id: Date.now(),
            prompt: prompt,
            images: [...images],
            result: null,
            timestamp: new Date().toLocaleTimeString()
        };
        setConversations(prev => [...prev, newConversation]);

        try {
            const response = await axios.post('https://crop-genesis.duckdns.org/ask-about-plan/', {text: prompt});
            console.log(conversations)
            setConversations(prev =>
                prev.map((conv, idx) =>
                    idx === prev.length - 1
                        ? { ...conv, result: response.data.response }
                        : conv
                )
            );
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Chat Axios error:', error.response?.data || error.message);
            } else {
                console.error('Chat Unexpected error:', error);
            }
        }

        setIsProcessing(false);
        setPrompt('');
        setImages([]);
    };

    const handleAudioExplanation = async () => {
        if (!initialHtmlResult) return;

        setIsAudioLoading(true);

        try {
            const firstApiResponse = await axios.post('https://crop-genesis.duckdns.org/get-audio', {
                text: initialHtmlResult,
                lang: preferredLang,
            });

            setAudioUrl(`https://crop-genesis.duckdns.org/audio/${firstApiResponse.data.name}` || "");

            const audio = new Audio(`https://crop-genesis.duckdns.org/audio/${firstApiResponse.data.name}`);
            setAudioElement(audio);
            audio.play().catch(error => {
                console.error('Error playing audio:', error);
            });
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Audio API error:', error.response?.data || error.message);
            } else {
                console.error('Audio Unexpected error:', error);
            }
        }

        setIsAudioLoading(false);
    };

    const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    // Form UI
    const renderForm = () => (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4 pt-32">
            <Navbar/>
            <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-2xl">
                <h2 className="text-2xl font-bold text-center mb-6">Agricultural Planning Input Form</h2>
                
                {/* Preferred Language Dropdown */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Preferred language for explanation</label>
                    <select
                        value={preferredLang}
                        onChange={e => setPreferredLang(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="English">English</option>
                        <option value="Hindi">Hindi</option>
                        <option value="Bengali">Bengali</option>
                        <option value="Marathi">Marathi</option>
                        <option value="Punjabi">Punjabi</option>
                        <option value="Tamil">Tamil</option>
                        <option value="Telugu">Telugu</option>
                        <option value="Gujarati">Gujarati</option>
                        <option value="Malayalam">Malayalam</option>
                    </select>
                </div>

                {/* Form Fields - 2 fields per row */}
                <div className="space-y-4 mb-6">
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Location <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.field1}
                                onChange={(e) => handleFormFieldChange('field1', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter location"
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Land Size <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.field2}
                                onChange={(e) => handleFormFieldChange('field2', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter land size"
                            />
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Last Crop <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.field3}
                                onChange={(e) => handleFormFieldChange('field3', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter last crop"
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Irrigation <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.field4}
                                onChange={(e) => handleFormFieldChange('field4', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter irrigation method"
                            />
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Season <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.field5}
                                onChange={(e) => handleFormFieldChange('field5', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter season"
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Additional Description
                            </label>
                            <textarea
                                value={formData.field6}
                                onChange={(e) => handleFormFieldChange('field6', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px]"
                                placeholder="Enter description (optional)"
                                rows={3}
                            />
                        </div>
                    </div>
                </div>

                {/* Image Upload */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Upload Images <span className="text-gray-400">(optional)</span></label>
                    <label className="flex items-center justify-center w-full h-20 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
                        <div className="flex flex-col items-center">
                            <Upload className="w-6 h-6 text-gray-400 mb-2" />
                            <span className="text-xs text-gray-500">Click to upload images</span>
                        </div>
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleFormImageUpload}
                            className="hidden"
                        />
                    </label>
                    
                    {/* Image Previews */}
                    {formData.images.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                            {formData.images.map(img => (
                                <div key={img.id} className="relative group">
                                    <img
                                        src={img.url}
                                        alt={img.name}
                                        className="w-14 h-14 object-cover rounded-lg border-2 border-gray-200"
                                    />
                                    <button
                                        onClick={() => removeFormImage(img.id)}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Video Upload */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Upload Video <span className="text-gray-400">(optional)</span></label>
                    {formData.video ? (
                        <div className="relative group mt-3">
                            <video
                                src={formData.video.url}
                                className="w-full h-36 object-cover rounded-lg border-2 border-gray-200"
                                controls
                            />
                            <button
                                onClick={removeFormVideo}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    ) : (
                        <label className="flex items-center justify-center w-full h-20 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
                            <div className="flex flex-col items-center">
                                <Video className="w-6 h-6 text-gray-400 mb-2" />
                                <span className="text-xs text-gray-500">Click to upload video</span>
                            </div>
                            <input
                                type="file"
                                accept="video/*"
                                onChange={handleFormVideoUpload}
                                className="hidden"
                            />
                        </label>
                    )}
                </div>

                {/* Submit Button */}
                <button
                    onClick={handleFormSubmit}
                    disabled={isFormSubmitting || !formData.field1 || !formData.field2 || !formData.field3 || !formData.field4 || !formData.field5}
                    className="w-full px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                >
                    {isFormSubmitting ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Processing...</span>
                        </>
                    ) : (
                        <span>Submit Form</span>
                    )}
                </button>
            </div>
        </div>
    );

    // Chat UI (updated: initial analysis result is part of chat flow)
    const renderChat = () => (
        <div className="flex flex-col justify-between h-screen border-0 rounded-xl">
            <Navbar />

            {/* Results Area: initialHtmlResult as first message, then conversations */}
            <div className="overflow-y-auto p-4 pt-28 space-y-4 flex-1">
                {/* Initial Analysis Result as first message in chat flow */}
                {initialHtmlResult && (
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
                        <div className="flex">
                            <div className="ml-3 flex-1">
                                <p className="text-sm text-yellow-700 mb-2">Initial Analysis Result:</p>
                                <div className="text-yellow-600 mb-4">
                                    {parseHtmlCodeBlock(initialHtmlResult)}
                                </div>
                                {/* Audio Explanation Button */}
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={handleAudioExplanation}
                                        disabled={isAudioLoading || !!audioUrl}
                                        className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                                    >
                                        {isAudioLoading ? (
                                            <>
                                                <Loader2 size={16} className="animate-spin" />
                                                <span>Generating Audio...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Volume2 size={16} />
                                                <span>Listen Audio Explanation</span>
                                            </>
                                        )}
                                    </button>
                                    {/* Audio Controls */}
                                    {audioUrl && audioElement && (
                                        <div className="flex items-center space-x-2">
                                            <audio
                                                ref={(audio) => {
                                                    if (audio && audioUrl) {
                                                        audio.src = audioUrl;
                                                    }
                                                }}
                                                controls
                                                className="h-8"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Conversation messages */}
                {conversations.length === 0 ? (
                    <div className="text-center text-gray-500 mt-20">
                        <Trees size={48} className="mx-auto mb-4 text-gray-300" />
                        <p>Start your conversation below</p>
                    </div>
                ) : (
                    conversations.map((conv) => (
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
                                        {conv.result}
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

    return showForm ? renderForm() : renderChat();
};

export default Plan;