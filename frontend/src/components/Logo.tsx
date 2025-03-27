
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sprout } from 'lucide-react';

const Logo: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div 
      onClick={() => navigate('/')} 
      className="flex items-center gap-2 cursor-pointer"
    >
      <div className="relative flex items-center justify-center">
        <div className="absolute inset-0 bg-google-blue rounded-tl-md rounded-br-md opacity-80 scale-75"></div>
        <div className="absolute inset-0 bg-google-green rounded-tr-md rounded-bl-md opacity-80 scale-75"></div>
        <div className="absolute inset-0 bg-google-yellow rounded-md opacity-60 scale-50"></div>
        <div className="absolute inset-0 bg-google-red rounded-full opacity-70 scale-25"></div>
        <Sprout className="h-6 w-6 text-white z-10 relative" />
      </div>
      <span className="font-semibold text-lg tracking-tight">CropGenesis</span>
    </div>
  );
};

export default Logo;
