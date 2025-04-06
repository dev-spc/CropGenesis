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
import axios from 'axios';

const Dashboard = () => {
  const [showAnalysisResults, setShowAnalysisResults] = useState(false);
  const [analysisResponse, setAnalysisResponse] = useState<string | number>('');
  const [isLoading, setIsLoading] = useState(false);
  const [cropData, setCropData] = useState({
    N: 0,
    P: 0,
    K: 0,
    temperature: 0,
    humidity: 0,
    ph: 0,
    rainfall: 0
  });
  
  const [yieldData, setYieldData] = useState({
    latitude: 0,
    longitude: 0,
    NDVI: 0,
    GNDVI: 0,
    NDWI: 0,
    SAVI: 0,
    soil_moisture: 0,
    temperature: 0,
    rainfall: 0,
    crop_type: 0,
    NDVI_temp: 0,
    NDVI_rainfall: 0,
    SAVI_soil_moisture: 0
  });

  const handleTabChange = () => {
    setAnalysisResponse('');
    setShowAnalysisResults(false);
  };

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Convert the input value to a number, defaulting to 0 if empty
    const numValue = value === '' ? 0 : parseFloat(value);
    setCropData(prev => ({
      ...prev,
      [name]: numValue
    }));
  };

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const result = await axios.post('http://127.0.0.1:8000/crop-predict/', cropData);
      setAnalysisResponse(result.data.recommended_crop);
    } catch (error) {
      console.error('Error predicting crop:', error);
      setAnalysisResponse('Error predicting crop. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageSubmitted = () => {
    setShowAnalysisResults(true);
  };

  const handleYieldInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = value === '' ? 0 : parseFloat(value);
    setYieldData(prev => ({
      ...prev,
      [name]: numValue
    }));
  };

  const handleYieldFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const result = await axios.post('http://127.0.0.1:8000/yield-predict/', yieldData);
      setAnalysisResponse(result.data.predicted_yield);
    } catch (error) {
      console.error('Error predicting yield:', error);
      setAnalysisResponse('Error predicting yield. Please try again.');
    } finally {
      setIsLoading(false);
    }
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
        
        <Tabs defaultValue="imageManager" className="w-full max-w-4xl mx-auto opacity-0 animate-fadeIn animation-delay-200" onValueChange={handleTabChange}>
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
                  <ImageUploader setAnalysisResponse={setAnalysisResponse} maxSize={5} onImageSubmitted={handleImageSubmitted} />
                </div>
                
                {showAnalysisResults && (
                  <div className="mt-6">
                    <h3 className="text-lg font-medium mb-4">Analysis Results</h3>
                    <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                      <pre className="whitespace-pre-wrap font-mono text-sm bg-white p-4 rounded border border-gray-200">
                        {analysisResponse}
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
                        <Label htmlFor="N">Nitrogen (N)</Label>
                        <Input 
                          id="N" 
                          name="N"
                          type="number" 
                          step="0.1"
                          value={cropData.N}
                          onChange={handleInputChange}
                          placeholder="Enter nitrogen amount" 
                        />
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="P">Phosphorus (P)</Label>
                        <Input 
                          id="P" 
                          name="P"
                          type="number" 
                          step="0.1"
                          value={cropData.P}
                          onChange={handleInputChange}
                          placeholder="Enter phosphorus amount" 
                        />
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="K">Potassium (K)</Label>
                        <Input 
                          id="K" 
                          name="K"
                          type="number" 
                          step="0.1"
                          value={cropData.K}
                          onChange={handleInputChange}
                          placeholder="Enter potassium amount" 
                        />
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="temperature">Temperature</Label>
                        <Input 
                          id="temperature" 
                          name="temperature"
                          type="number" 
                          step="0.1"
                          value={cropData.temperature}
                          onChange={handleInputChange}
                          placeholder="Enter temperature" 
                        />
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="humidity">Humidity</Label>
                        <Input 
                          id="humidity" 
                          name="humidity"
                          type="number" 
                          step="0.1"
                          value={cropData.humidity}
                          onChange={handleInputChange}
                          placeholder="Enter humidity" 
                        />
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="ph">pH</Label>
                        <Input 
                          id="ph" 
                          name="ph"
                          type="number" 
                          step="0.1"
                          value={cropData.ph}
                          onChange={handleInputChange}
                          placeholder="Enter pH value" 
                        />
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="rainfall">Rainfall</Label>
                        <Input 
                          id="rainfall" 
                          name="rainfall"
                          type="number" 
                          step="0.1"
                          value={cropData.rainfall}
                          onChange={handleInputChange}
                          placeholder="Enter rainfall amount" 
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button 
                        type="submit" 
                        className="mt-4 bg-google-blue hover:bg-google-blue/90 text-white"
                        disabled={isLoading}
                        onClick={()=>setShowAnalysisResults(true)}
                      >
                        {isLoading ? 'Predicting...' : 'Submit'}
                      </Button>
                    </div>
                  </form>
                </div>
                {showAnalysisResults && (
                  <div className="mt-6">
                    <h3 className="text-lg font-medium mb-4">Analysis Results</h3>
                    <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                      <pre className="whitespace-pre-wrap font-mono text-sm bg-white p-4 rounded border border-gray-200">
                        Recommended crop: {analysisResponse}
                      </pre>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          

          <TabsContent value="settings">
            <Card className="shadow-sm border-0 glass-panel">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Predict the Yield</CardTitle>
                    <CardDescription>Configure parameters for yield prediction</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="py-4">
                  <form onSubmit={handleYieldFormSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <Label htmlFor="latitude">Latitude</Label>
                        <Input 
                          id="latitude" 
                          name="latitude"
                          type="number" 
                          step="0.0001"
                          value={yieldData.latitude}
                          onChange={handleYieldInputChange}
                          placeholder="Enter latitude" 
                        />
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="longitude">Longitude</Label>
                        <Input 
                          id="longitude" 
                          name="longitude"
                          type="number" 
                          step="0.0001"
                          value={yieldData.longitude}
                          onChange={handleYieldInputChange}
                          placeholder="Enter longitude" 
                        />
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="NDVI">NDVI</Label>
                        <Input 
                          id="NDVI" 
                          name="NDVI"
                          type="number" 
                          step="0.01"
                          value={yieldData.NDVI}
                          onChange={handleYieldInputChange}
                          placeholder="Enter NDVI value" 
                        />
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="GNDVI">GNDVI</Label>
                        <Input 
                          id="GNDVI" 
                          name="GNDVI"
                          type="number" 
                          step="0.01"
                          value={yieldData.GNDVI}
                          onChange={handleYieldInputChange}
                          placeholder="Enter GNDVI value" 
                        />
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="NDWI">NDWI</Label>
                        <Input 
                          id="NDWI" 
                          name="NDWI"
                          type="number" 
                          step="0.01"
                          value={yieldData.NDWI}
                          onChange={handleYieldInputChange}
                          placeholder="Enter NDWI value" 
                        />
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="SAVI">SAVI</Label>
                        <Input 
                          id="SAVI" 
                          name="SAVI"
                          type="number" 
                          step="0.01"
                          value={yieldData.SAVI}
                          onChange={handleYieldInputChange}
                          placeholder="Enter SAVI value" 
                        />
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="soil_moisture">Soil Moisture</Label>
                        <Input 
                          id="soil_moisture" 
                          name="soil_moisture"
                          type="number" 
                          step="0.1"
                          value={yieldData.soil_moisture}
                          onChange={handleYieldInputChange}
                          placeholder="Enter soil moisture" 
                        />
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="temperature">Temperature</Label>
                        <Input 
                          id="temperature" 
                          name="temperature"
                          type="number" 
                          step="0.1"
                          value={yieldData.temperature}
                          onChange={handleYieldInputChange}
                          placeholder="Enter temperature" 
                        />
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="rainfall">Rainfall</Label>
                        <Input 
                          id="rainfall" 
                          name="rainfall"
                          type="number" 
                          step="0.1"
                          value={yieldData.rainfall}
                          onChange={handleYieldInputChange}
                          placeholder="Enter rainfall" 
                        />
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="crop_type">Crop Type</Label>
                        <Select onValueChange={(value) => setYieldData(prev => ({ ...prev, crop_type: parseInt(value) }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select crop type" />
                          </SelectTrigger>
                          <SelectContent>
                            {crops.map((item, index) => (
                              <SelectItem key={index} value={index.toString()}>{item}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="NDVI_temp">NDVI Temperature</Label>
                        <Input 
                          id="NDVI_temp" 
                          name="NDVI_temp"
                          type="number" 
                          step="0.01"
                          value={yieldData.NDVI_temp}
                          onChange={handleYieldInputChange}
                          placeholder="Enter NDVI temperature" 
                        />
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="NDVI_rainfall">NDVI Rainfall</Label>
                        <Input 
                          id="NDVI_rainfall" 
                          name="NDVI_rainfall"
                          type="number" 
                          step="0.01"
                          value={yieldData.NDVI_rainfall}
                          onChange={handleYieldInputChange}
                          placeholder="Enter NDVI rainfall" 
                        />
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="SAVI_soil_moisture">SAVI Soil Moisture</Label>
                        <Input 
                          id="SAVI_soil_moisture" 
                          name="SAVI_soil_moisture"
                          type="number" 
                          step="0.01"
                          value={yieldData.SAVI_soil_moisture}
                          onChange={handleYieldInputChange}
                          placeholder="Enter SAVI soil moisture" 
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button 
                        type="submit" 
                        className="mt-4 bg-google-blue hover:bg-google-blue/90 text-white"
                        disabled={isLoading}
                        onClick={()=>setShowAnalysisResults(true)}
                      >
                        {isLoading ? 'Predicting...' : 'Submit'}
                      </Button>
                    </div>
                  </form>
                </div>
                {showAnalysisResults && (
                  <div className="mt-6">
                    <h3 className="text-lg font-medium mb-4">Analysis Results</h3>
                    <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                      <pre className="whitespace-pre-wrap font-mono text-sm bg-white p-4 rounded border border-gray-200">
                        Predicted yield: {analysisResponse}
                      </pre>
                    </div>
                  </div>
                )}
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
