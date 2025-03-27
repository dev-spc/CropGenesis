
import React from 'react';

const AnimatedBackground: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`fixed inset-0 overflow-hidden z-[-1] ${className}`}>
      <div className="subtle-grid absolute inset-0"></div>
      
      {/* Colored Shapes */}
      <div className="absolute top-[10%] right-[5%] w-64 h-64 rounded-full bg-google-blue/10 mix-blend-multiply filter blur-3xl animate-floating opacity-70"></div>
      <div className="absolute bottom-[15%] left-[10%] w-80 h-80 rounded-full bg-google-yellow/10 mix-blend-multiply filter blur-3xl animate-floating animation-delay-500 opacity-70"></div>
      <div className="absolute top-[40%] right-[15%] w-72 h-72 rounded-full bg-google-green/10 mix-blend-multiply filter blur-3xl animate-floating animation-delay-700 opacity-70"></div>
      <div className="absolute bottom-[30%] right-[20%] w-60 h-60 rounded-full bg-google-red/10 mix-blend-multiply filter blur-3xl animate-floating animation-delay-200 opacity-70"></div>
    </div>
  );
};

export default AnimatedBackground;
