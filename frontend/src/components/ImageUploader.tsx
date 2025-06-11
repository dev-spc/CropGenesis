import React, { useState, useRef } from 'react';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Image, Upload, Loader2, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import axios from 'axios';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ImageUploaderProps {
  maxSize?: number; // in MB
  onImageSubmitted?: () => void;
  setAnalysisResponse?: (response: string) => void;
  data: any;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ maxSize = 10, onImageSubmitted, setAnalysisResponse, data }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [uploadedFileType, setUploadedFileType] = useState<'image' | 'video' | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [imageError, setImageError] = useState<string | null>(null);
  const [isProcessed, setIsProcessed] = useState(false);
  const [preferredLang, setPreferredLang] = useState<string>('English');
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const simulateUpload = () => {
    setUploading(true);
    setUploadProgress(0);
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploading(false);
          setIsProcessed(true);
          return 100;
        }
        return prev + 5;
      });
    }, 150);
    
    return () => clearInterval(interval);
  };

  const processFile = (file: File) => {
    if (file.size > maxSize * 1024 * 1024) {
      setImageError(`File size exceeds ${maxSize}MB limit`);
      toast({
        title: "File too large",
        description: `Maximum file size is ${maxSize}MB`,
        variant: "destructive",
      });
      return;
    }
    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
      setImageError('Only image or video files are allowed');
      toast({
        title: "Invalid file type",
        description: "Please upload an image or video file",
        variant: "destructive",
      });
      return;
    }
    setImageError(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setUploadedFile(e.target.result as string);
        setUploadedFileType(file.type.startsWith('image/') ? 'image' : 'video');
        simulateUpload();
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const resetUpload = () => {
    setUploadedFile(null);
    setUploadedFileType(null);
    setUploading(false);
    setUploadProgress(0);
    setIsProcessed(false);
    setAnalysisResponse('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async () => {
    if (!uploadedFile || !uploadedFileType) return;
    try {
      setUploading(true);
      const response = await fetch(uploadedFile);
      const blob = await response.blob();
      const formData = new FormData();
      if (uploadedFileType === 'image') {
        formData.append('images', blob);
      } else if (uploadedFileType === 'video') {
        formData.append('video', blob);
      }

      const result = await axios.post('https://crop-genesis.duckdns.org/plant-analysis', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setAnalysisResponse(result.data.code || '');
      toast({
        title: "Success",
        description: "File uploaded successfully",
      });
      if (onImageSubmitted) {
        onImageSubmitted();
      } else {
        navigate('/features');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload file. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-2xl w-full mx-auto">
      <div 
        className={`upload-zone glass-panel ${isDragging ? 'upload-zone-drag' : 'upload-zone-idle'} ${uploadedFile ? 'border-none' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {uploadedFile ? (
          <div className="w-full h-full flex flex-col items-center">
            <div className="relative w-full max-h-80 overflow-hidden rounded-lg mb-4 flex justify-center items-center">
              {uploadedFileType === 'image' ? (
                <img src={uploadedFile} alt="Uploaded preview" className="w-full h-full object-contain" />
              ) : (
                <video src={uploadedFile} controls className="w-full h-full object-contain" />
              )}
              {uploading && (
                <div className="absolute inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center">
                  <div className="flex flex-col items-center gap-3 text-white">
                    <Loader2 className="h-8 w-8 animate-spin" />
                    <div className="w-48">
                      <Progress value={uploadProgress} className="h-2" />
                    </div>
                    <span className="text-sm font-medium">{uploadProgress}% Uploaded</span>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex gap-3 mt-4">
              {!uploading && (
                <Button 
                  variant="outline" 
                  className="gap-2 bg-red-50 text-google-red border-red-100"
                  onClick={resetUpload}
                  disabled={uploading}
                >
                  <X className="h-4 w-4" />
                  <span>Remove</span>
                </Button>
              )}
            </div>
            
            {isProcessed && !uploading && (
              <>
                <Button 
                  className="mt-6 gap-2 bg-google-blue hover:bg-google-blue/90 text-white"
                  onClick={handleSubmit}
                >
                  Submit {uploadedFileType === 'image' ? 'Image' : 'Video'}
                </Button>
              </>
            )}
            {/* Show analysis result and audio generation after analysis result is received */}
            {typeof setAnalysisResponse === 'function' && !uploading && isProcessed && setAnalysisResponse && (
              <>
                {setAnalysisResponse && (
                  <div className="mt-6 w-full">
                    {/* Preferred Language Dropdown and Audio Button */}
                    <div className="mt-4 flex flex-col items-center">
                      <div className="mb-2 w-full">
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
                        </select>
                      </div>
                      <Button
                        className="bg-green-500 hover:bg-green-600 text-white"
                        disabled={isAudioLoading || !!audioUrl || !data}
                        onClick={async () => {
                          setIsAudioLoading(true);
                          try {
                            const resp = await axios.post('https://crop-genesis.duckdns.org/get-audio', {
                              text: data,
                              lang: preferredLang,
                            });
                            if (resp.data && resp.data.name) {
                              setAudioUrl(`https://crop-genesis.duckdns.org/audio/${resp.data.name}`);
                            } else {
                              toast({ title: 'Audio Error', description: 'Invalid audio response', variant: 'destructive' });
                            }
                          } catch (err) {
                            toast({ title: 'Audio Error', description: 'Failed to generate audio', variant: 'destructive' });
                          }
                          setIsAudioLoading(false);
                        }}
                      >
                        {isAudioLoading ? 'Generating Audio...' : 'Generate Audio Explanation'}
                      </Button>
                      {audioUrl && (
                        <audio src={audioUrl} controls className="mt-2 w-full" />
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        ) : (
          <>
            <div className="rounded-full bg-google-blue/5 p-6 mb-4 beautiful-transition">
              <Image className="h-12 w-12 text-google-blue" />
            </div>
            <h3 className="text-xl font-medium mb-2">Upload Image or Video</h3>
            <p className="text-gray-500 mb-6 text-balance max-w-md">
              Drag and drop your image or video file here, or click to browse your files
            </p>
            <Button 
              variant="outline" 
              className="gap-2 beautiful-transition"
              onClick={handleButtonClick}
            >
              <Upload className="h-4 w-4" />
              <span>Choose File</span>
            </Button>
            <div className="mt-4 text-xs text-gray-400">
              Maximum file size: {maxSize}MB
            </div>
            {imageError && (
              <div className="mt-3 text-sm text-google-red flex items-center gap-1">
                <X className="h-4 w-4" />
                {imageError}
              </div>
            )}
          </>
        )}
        
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept="image/*,video/*"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
};

export default ImageUploader;
