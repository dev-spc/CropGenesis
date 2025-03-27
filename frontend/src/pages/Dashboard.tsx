
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

  const indianStates = [
    { value: "AN", label: "Andaman and Nicobar Islands" },
    { value: "AP", label: "Andhra Pradesh" },
    { value: "AR", label: "Arunachal Pradesh" },
    { value: "AS", label: "Assam" },
    { value: "BR", label: "Bihar" },
    { value: "CH", label: "Chandigarh" },
    { value: "CT", label: "Chhattisgarh" },
    { value: "DN", label: "Dadra and Nagar Haveli and Daman and Diu" },
    { value: "DL", label: "Delhi" },
    { value: "GA", label: "Goa" },
    { value: "GJ", label: "Gujarat" },
    { value: "HR", label: "Haryana" },
    { value: "HP", label: "Himachal Pradesh" },
    { value: "JK", label: "Jammu and Kashmir" },
    { value: "JH", label: "Jharkhand" },
    { value: "KA", label: "Karnataka" },
    { value: "KL", label: "Kerala" },
    { value: "LA", label: "Ladakh" },
    { value: "LD", label: "Lakshadweep" },
    { value: "MP", label: "Madhya Pradesh" },
    { value: "MH", label: "Maharashtra" },
    { value: "MN", label: "Manipur" },
    { value: "ML", label: "Meghalaya" },
    { value: "MZ", label: "Mizoram" },
    { value: "NL", label: "Nagaland" },
    { value: "OD", label: "Odisha" },
    { value: "PY", label: "Puducherry" },
    { value: "PB", label: "Punjab" },
    { value: "RJ", label: "Rajasthan" },
    { value: "SK", label: "Sikkim" },
    { value: "TN", label: "Tamil Nadu" },
    { value: "TG", label: "Telangana" },
    { value: "TR", label: "Tripura" },
    { value: "UP", label: "Uttar Pradesh" },
    { value: "UK", label: "Uttarakhand" },
    { value: "WB", label: "West Bengal" }
  ];

  const crops = [
    'Bajra',        // 0
    'Barley',       // 1
    'Black Pepper', // 2
    'Cardamom',     // 3
    'Cashew Nut',   // 4
    'Coconut',      // 5
    'Coffee',       // 6
    'Cotton',       // 7
    'Ginger',       // 8
    'Groundnut',    // 9
    'Jowar',        // 10
    'Linseed',      // 11
    'Maize',        // 12
    'Millets',      // 13
    'Mustard',      // 14
    'Oil Palm',     // 15
    'Pulses',       // 16
    'Ragi',         // 17
    'Rice',         // 18
    'Rubber',       // 19
    'Saffron',      // 20
    'Sesame',       // 21
    'Sorghum',      // 22
    'Soybean',      // 23
    'Sugarcane',    // 24
    'Sunflower',    // 25
    'Tea',          // 26
    'Tobacco',      // 27
    'Turmeric',     // 28
    'Wheat'         // 29
  ];

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
                        <Label htmlFor="cropName">Nitrogen (N)</Label>
                        <Input id="cropName" type="number"  placeholder="Enter nitrogen amount" />
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="cropName">Phosphorus (P)</Label>
                        <Input id="cropName" type="number"  placeholder="Enter phosphorus amount" />
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="cropName">Potassium (K)</Label>
                        <Input id="cropName" type="number"  placeholder="Enter potassium amount" />
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="cropName">Temperature</Label>
                        <Input id="cropName" type="number"  placeholder="Enter temperature" />
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="cropName">Humidity</Label>
                        <Input id="cropName" type="number"  placeholder="Enter humidity" />
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="cropName">pH</Label>
                        <Input id="cropName" type="number"  placeholder="Enter pH value" />
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="cropName">Rainfall</Label>
                        <Input id="cropName" type="number"  placeholder="Enter rainfall amount" />
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
                        <Label htmlFor="notificationPreference">States</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select state" />
                          </SelectTrigger>
                          <SelectContent>
                            {indianStates.map((item, index)=><SelectItem key={index} value={item.value}>{item.label}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-3">
                        <Label htmlFor="analysisFrequency">Crop Type</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select crop type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="rabi">Rabi</SelectItem>
                            <SelectItem value="kharif">Kharif</SelectItem>
                            <SelectItem value="zaid">Zaid</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="states">Crops</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select crop" />
                          </SelectTrigger>
                          <SelectContent>
                            {crops.map((item, index)=><SelectItem key={index} value={item}>{item}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="cropName">Nitrogen (N)</Label>
                        <Input id="cropName" type="number"  placeholder="Enter nitrogen amount" />
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="cropName">Phosphorus (P)</Label>
                        <Input id="cropName" type="number"  placeholder="Enter phosphorus amount" />
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="cropName">Potassium (K)</Label>
                        <Input id="cropName" type="number"  placeholder="Enter potassium amount" />
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="cropName">Temperature</Label>
                        <Input id="cropName" type="number"  placeholder="Enter temperature" />
                      </div>
                      
                      <div className="space-y-3">
                        <Label htmlFor="cropName">pH</Label>
                        <Input id="cropName" type="number"  placeholder="Enter pH value" />
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="cropName">Rainfall</Label>
                        <Input id="cropName" type="number"  placeholder="Enter rainfall amount" />
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="area">Area (in hectare)</Label>
                        <Input id="area" type="number"  placeholder="Enter area" />
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
      
      <ChatBot />
    </div>
  );
};

export default Dashboard;
