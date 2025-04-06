import React, { useState, useRef } from 'react';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Image, Upload, Loader2, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import axios from 'axios';

interface ImageUploaderProps {
  maxSize?: number; // in MB
  onImageSubmitted?: () => void;
  setAnalysisResponse?: (response: string) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ maxSize = 10, onImageSubmitted, setAnalysisResponse }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [imageError, setImageError] = useState<string | null>(null);
  const [isProcessed, setIsProcessed] = useState(false);
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

  const processImage = (file: File) => {
    if (file.size > maxSize * 1024 * 1024) {
      setImageError(`File size exceeds ${maxSize}MB limit`);
      toast({
        title: "File too large",
        description: `Maximum file size is ${maxSize}MB`,
        variant: "destructive",
      });
      return;
    }
    
    if (!file.type.startsWith('image/')) {
      setImageError('Only image files are allowed');
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive",
      });
      return;
    }
    
    setImageError(null);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setUploadedImage(e.target.result as string);
        simulateUpload();
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processImage(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processImage(e.target.files[0]);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const resetUpload = () => {
    setUploadedImage(null);
    setUploading(false);
    setUploadProgress(0);
    setIsProcessed(false);
    setAnalysisResponse('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async () => {
    if (!uploadedImage) return;

    try {
      setUploading(true);

      const response = await fetch(uploadedImage);
      const blob = await response.blob();
      
      const formData = new FormData();
      formData.append('file', blob, 'image.jpg');
      formData.append('image', uploadedImage);

      const result = await axios.post('http://127.0.0.1:8000/plant-disease/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const res = await axios.post('http://127.0.0.1:8000/generate', {
        prompt: result.data.predicted_disease,
      });
      setAnalysisResponse(res.data.response);

      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });

      if (onImageSubmitted) {
        onImageSubmitted();
      } else {
        navigate('/features');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-2xl w-full mx-auto">
      <div 
        className={`upload-zone glass-panel ${isDragging ? 'upload-zone-drag' : 'upload-zone-idle'} ${uploadedImage ? 'border-none' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {uploadedImage ? (
          <div className="w-full h-full flex flex-col items-center">
            <div className="relative w-full max-h-80 overflow-hidden rounded-lg mb-4 flex justify-center items-center">
              <img 
                src={uploadedImage} 
                alt="Uploaded preview" 
                className="w-full h-full object-contain"
              />
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
                <>
                  <Button 
                    variant="outline" 
                    className="gap-2 bg-red-50 text-google-red border-red-100"
                    onClick={resetUpload}
                    disabled={uploading}
                  >
                    <X className="h-4 w-4" />
                    <span>Remove</span>
                  </Button>
                </>
              )}
            </div>
            
            {isProcessed && !uploading && (
              <Button 
                className="mt-6 gap-2 bg-google-blue hover:bg-google-blue/90 text-white"
                onClick={handleSubmit}
              >
                Submit Image
              </Button>
            )}
          </div>
        ) : (
          <>
            <div className="rounded-full bg-google-blue/5 p-6 mb-4 beautiful-transition">
              <Image className="h-12 w-12 text-google-blue" />
            </div>
            <h3 className="text-xl font-medium mb-2">Upload Image</h3>
            <p className="text-gray-500 mb-6 text-balance max-w-md">
              Drag and drop your image file here, or click to browse your files
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
          accept="image/*"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
};

export default ImageUploader;
