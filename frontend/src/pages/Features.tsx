
import React from 'react';
import Navbar from '@/components/Navbar';
import AnimatedBackground from '@/components/AnimatedBackground';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Features = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen w-full">
      <AnimatedBackground className="opacity-50" />
      <Navbar />
      
      <main className="pt-32 pb-16 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-8 opacity-0 animate-fadeIn">
          <span className="px-4 py-1.5 text-xs font-medium text-google-green bg-google-green/10 rounded-full mb-4 inline-block">
            Complete
          </span>
          <h1 className="text-3xl font-bold mb-3">Analysis Complete</h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-balance">
            Your image has been successfully analyzed
          </p>
        </div>
        
        <Card className="shadow-sm border-0 glass-panel w-full max-w-4xl mx-auto opacity-0 animate-fadeIn animation-delay-200">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Process Complete</CardTitle>
                <CardDescription>Your image has been processed successfully</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="py-8 text-center">
              <p className="text-lg text-gray-700 mb-6">
                Your image analysis is complete. All results and settings are available on the dashboard.
              </p>
              <Button 
                onClick={() => navigate('/dashboard')} 
                className="bg-google-blue hover:bg-google-blue/90 text-white"
              >
                Return to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Features;
