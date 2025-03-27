
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Crop, Image, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AnimatedBackground from '@/components/AnimatedBackground';
import Navbar from '@/components/Navbar';

const Index = () => {
  const navigate = useNavigate();
  
  const features = [
    {
      icon: <Image className="h-6 w-6 text-google-blue" />,
      title: "Easy Upload",
      description: "Simple drag & drop interface for all your images"
    },
    {
      icon: <Crop className="h-6 w-6 text-google-red" />,
      title: "Smart Cropping",
      description: "Advanced tools to perfect your image dimensions"
    },
    {
      icon: <Zap className="h-6 w-6 text-google-yellow" />,
      title: "Fast Processing",
      description: "Lightning fast processing for immediate results"
    }
  ];

  return (
    <div className="min-h-screen w-full overflow-hidden">
      <AnimatedBackground />
      <Navbar />
      
      <main className="pt-32 px-6 max-w-7xl mx-auto">
        {/* Hero Section */}
        <section className="flex flex-col items-center text-center mb-24">
          <span className="px-4 py-1.5 text-xs font-medium text-google-blue bg-google-blue/10 rounded-full mb-6 opacity-0 animate-fadeIn">
            Simplify Your Image Workflow
          </span>
          
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 opacity-0 animate-fadeIn animation-delay-200">
            <span className="text-google-blue">Crop</span>
            <span className="text-google-green">Genesis</span>
          </h1>
          
          <p className="text-lg text-gray-600 max-w-2xl mb-10 text-balance opacity-0 animate-fadeIn animation-delay-500">
            The intelligent image cropping platform designed for simplicity and precision. 
            Transform your visuals with just a few clicks.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 opacity-0 animate-fadeIn animation-delay-700">
            <Button 
              size="lg" 
              className="bg-google-blue hover:bg-google-blue/90 text-white px-8 rounded-full gap-2 shadow-sm"
              onClick={() => navigate('/dashboard')}
            >
              Try Dashboard
              <ArrowRight size={16} />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-gray-200 hover:bg-gray-50 rounded-full"
            >
              Learn More
            </Button>
          </div>
          
          <div className="mt-32 mb-16 glass-panel p-8 w-full max-w-5xl opacity-0 animate-fadeIn animation-delay-700">
            <div className="w-full h-[300px] bg-gray-100 rounded-lg overflow-hidden relative">
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                <span className="text-sm">Dashboard Preview</span>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="mb-32">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="glass-card p-8 opacity-0 animate-fadeIn"
                style={{ animationDelay: `${700 + index * 200}ms` }}
              >
                <div className="rounded-full bg-gray-50 w-12 h-12 flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>
        
        <footer className="py-8 text-center text-sm text-gray-500 border-t border-gray-100 mb-12">
          <p>© 2023 CropGenesis. All rights reserved.</p>
        </footer>
      </main>
    </div>
  );
};

export default Index;
