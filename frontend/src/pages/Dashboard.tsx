
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import AnimatedBackground from '@/components/AnimatedBackground';
import ImageUploader from '@/components/ImageUploader';
import ChatBot from '@/components/ChatBot';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { HelpCircle, TreeDeciduous, Leaf, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Dashboard = () => {
  const [showAnalysisResults, setShowAnalysisResults] = useState(false);
  
  // Sample text output that would be fetched from backend
  const textOutput = `
    Image analysis complete.
    
    We've detected the following crops in your image:
    - Wheat (85% confidence)
    - Barley (12% confidence)
    - Other (3% confidence)
    
    Estimated crop health: Good
    Recommended actions: Continue current irrigation schedule
    
    The analysis is based on vegetation indices and machine learning models 
    trained on thousands of similar crop images. For more detailed analysis, 
    please upload images from multiple angles.
  `;

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Form submission logic would go here
  };

  const handleImageSubmitted = () => {
    setShowAnalysisResults(true);
  };

  return (
    <div className="min-h-screen w-full">
      <AnimatedBackground className="opacity-50" />
      <Navbar />
      
      <main className="pt-32 pb-16 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-8 opacity-0 animate-fadeIn">
          <span className="px-4 py-1.5 text-xs font-medium text-google-blue bg-google-blue/10 rounded-full mb-4 inline-block">
            Dashboard
          </span>
          <h1 className="text-3xl font-bold mb-3">Crop Management Center</h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-balance">
            Manage your crops, analyze images, and configure settings all in one place
          </p>
        </div>
        
        <Tabs defaultValue="imageManager" className="w-full max-w-4xl mx-auto opacity-0 animate-fadeIn animation-delay-200">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="imageManager" className="flex items-center gap-2">
              <Image className="h-4 w-4" />
              <span>Plant Village Model</span>
            </TabsTrigger>
            <TabsTrigger value="cropManagement" className="flex items-center gap-2">
            <TreeDeciduous className="h-4 w-4"/>
              <span>Crop Recommendation</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
            <Leaf className="h-4 w-4" />
              <span>Yield Prediction</span>
            </TabsTrigger>
          </TabsList>
          
          {/* Image Manager Tab */}
          <TabsContent value="imageManager">
            <Card className="shadow-sm border-0 glass-panel">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Image Manager</CardTitle>
                  </div>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <HelpCircle className="h-5 w-5 text-gray-400" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="py-4">
                  <ImageUploader maxSize={5} onImageSubmitted={handleImageSubmitted} />
                </div>
                
                {showAnalysisResults && (
                  <div className="mt-6">
                    <h3 className="text-lg font-medium mb-4">Analysis Results</h3>
                    <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                      <pre className="whitespace-pre-wrap font-mono text-sm bg-white p-4 rounded border border-gray-200">
                        {textOutput}
                      </pre>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Crop Management Tab */}
          <TabsContent value="cropManagement">
            <Card className="shadow-sm border-0 glass-panel">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Crop Recommendation Configurations</CardTitle>
                    <CardDescription>Configure needs for your crops</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="py-4">
                  <form onSubmit={handleFormSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <Label htmlFor="cropName">Crop Name</Label>
                        <Input id="cropName" placeholder="Enter crop name" />
                      </div>
                      
                      <div className="space-y-3">
                        <Label htmlFor="cropVariety">Crop Variety</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select variety" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="variety1">Variety 1</SelectItem>
                            <SelectItem value="variety2">Variety 2</SelectItem>
                            <SelectItem value="variety3">Variety 3</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-3">
                        <Label htmlFor="plantingDate">Planting Date</Label>
                        <Input id="plantingDate" type="date" />
                      </div>
                      
                      <div className="space-y-3">
                        <Label htmlFor="fieldSize">Field Size (acres)</Label>
                        <Input id="fieldSize" type="number" placeholder="0.0" min="0" step="0.1" />
                      </div>
                      
                      <div className="space-y-3 md:col-span-2">
                        <Label htmlFor="notes">Additional Notes</Label>
                        <Textarea id="notes" placeholder="Enter any additional information..." />
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button type="submit" className="mt-4 bg-google-blue hover:bg-google-blue/90 text-white">
                        Submit
                      </Button>
                    </div>
                  </form>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Additional Settings Tab */}
          <TabsContent value="settings">
            <Card className="shadow-sm border-0 glass-panel">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Predict the Yield</CardTitle>
                    <CardDescription>Configure crop for the yield</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="py-4">
                  <form onSubmit={handleFormSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <Label htmlFor="notificationPreference">Notification Preference</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select preference" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="email">Email</SelectItem>
                            <SelectItem value="push">Push Notification</SelectItem>
                            <SelectItem value="both">Both</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-3">
                        <Label htmlFor="analysisFrequency">Analysis Frequency</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select frequency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-3 md:col-span-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input id="email" type="email" placeholder="Enter your email address" />
                      </div>
                      
                      <div className="space-y-3 md:col-span-2">
                        <Label htmlFor="preferences">Preferences</Label>
                        <Textarea id="preferences" placeholder="Enter any additional preferences..." />
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button type="submit" className="mt-4 bg-google-blue hover:bg-google-blue/90 text-white">
                        Submit
                      </Button>
                    </div>
                  </form>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      
      {/* Add the ChatBot component */}
      <ChatBot />
    </div>
  );
};

export default Dashboard;
