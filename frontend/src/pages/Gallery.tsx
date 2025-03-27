
import React from 'react';
import Navbar from '@/components/Navbar';
import AnimatedBackground from '@/components/AnimatedBackground';
import { Card } from '@/components/ui/card';

const Gallery = () => {
  // Mock gallery items
  const galleryItems = [
    { id: 1, placeholder: 'bg-google-blue/20' },
    { id: 2, placeholder: 'bg-google-red/20' },
    { id: 3, placeholder: 'bg-google-yellow/20' },
    { id: 4, placeholder: 'bg-google-green/20' },
    { id: 5, placeholder: 'bg-google-blue/30' },
    { id: 6, placeholder: 'bg-google-red/30' },
  ];

  return (
    <div className="min-h-screen w-full">
      <AnimatedBackground className="opacity-50" />
      <Navbar />
      
      <main className="pt-32 pb-16 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-12 opacity-0 animate-fadeIn">
          <span className="px-4 py-1.5 text-xs font-medium text-google-blue bg-google-blue/10 rounded-full mb-4 inline-block">
            Gallery
          </span>
          <h1 className="text-3xl font-bold mb-3">Your Images</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Browse and manage your processed images
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {galleryItems.map((item, index) => (
            <Card 
              key={item.id} 
              className="overflow-hidden shadow-sm border-0 glass-card opacity-0 animate-fadeIn"
              style={{ animationDelay: `${300 + index * 100}ms` }}
            >
              <div 
                className={`aspect-square ${item.placeholder} flex items-center justify-center`}
              >
                <span className="text-sm text-gray-500">Image {item.id}</span>
              </div>
              <div className="p-4">
                <h3 className="font-medium">Image {item.id}</h3>
                <p className="text-sm text-gray-500">Processed on {new Date().toLocaleDateString()}</p>
              </div>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Gallery;
