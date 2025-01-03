import React, { useState, useEffect } from 'react';
import { ImageUpload } from './components/ImageUpload';
import { AnalysisResult } from './components/AnalysisResult';
import { CarAnalysis } from './types/analysis';
import { Car } from 'lucide-react';

interface AnalysisWithTimestamp {
  analysis: CarAnalysis;
  timestamp: number;
  imageUrl: string;
}

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [analyses, setAnalyses] = useState<AnalysisWithTimestamp[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedAnalyses = localStorage.getItem('analyses');
    if (storedAnalyses) {
      console.log('Loaded analyses from local storage:', JSON.parse(storedAnalyses));
      setAnalyses(JSON.parse(storedAnalyses));
    }
  }, []);

  useEffect(() => {
    console.log('Saving analyses to local storage:', analyses);
    localStorage.setItem('analyses', JSON.stringify(analyses));
  }, [analyses]);

  const convertImageToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleImageSelect = async (file: File) => {
    setIsLoading(true);
    setError(null);
    
    const formData = new FormData();
    formData.append('image', file);

    try {
      const [response, base64Image] = await Promise.all([
        fetch('/api/analyze', {
          method: 'POST',
          body: formData,
        }),
        convertImageToBase64(file)
      ]);

      if (!response.ok) {
        throw new Error('Failed to analyze image');
      }
      
      const data = await response.json();
      
      setAnalyses(prev => {
        const newAnalysis = {
          analysis: data,
          timestamp: Date.now(),
          imageUrl: base64Image
        };
        const updatedAnalyses = [...prev, newAnalysis];
        localStorage.setItem('analyses', JSON.stringify(updatedAnalyses));
        return updatedAnalyses;
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Car className="w-10 h-10 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">Car Analyzer</h1>
          </div>
          <p className="text-lg text-gray-600">
            Upload a car image to get detailed information about the vehicle
          </p>
        </div>

        <ImageUpload onImageSelect={handleImageSelect} isLoading={isLoading} />

        {isLoading && (
          <div className="mt-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
            <p className="mt-2 text-gray-600">Analyzing image...</p>
          </div>
        )}

        {error && (
          <div className="mt-8 p-4 bg-red-50 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        <div className="mt-8 space-y-8">
          {analyses.slice().reverse().map((item) => (
            <div key={item.timestamp} className="flex gap-6 bg-white p-6 rounded-xl shadow">
              <div className="w-64 flex-shrink-0">
                <img 
                  src={item.imageUrl} 
                  alt="Analyzed car" 
                  className="w-full h-48 object-cover rounded-lg"
                />
                <p className="text-sm text-gray-500 mt-2">
                  {new Date(item.timestamp).toLocaleString()}
                </p>
              </div>
              <div className="flex-grow">
                <AnalysisResult analysis={item.analysis} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;