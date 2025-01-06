import React, { useCallback, useRef, useState } from 'react';
import { Upload, Camera } from 'lucide-react';

interface ImageUploadProps {
  onImageSelect: (file: File) => void;
  isLoading: boolean;
}

export function ImageUpload({ onImageSelect, isLoading }: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith('image/')) {
        onImageSelect(file);
      }
    },
    [onImageSelect]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && file.type.startsWith('image/')) {
        onImageSelect(file);
      }
    },
    [onImageSelect]
  );

  const handleCameraChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        onImageSelect(file);
      }
    },
    [onImageSelect]
  );

  const handleCameraClick = async () => {
    setCameraError(null);
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    
    if (isIOS || !navigator.mediaDevices?.getUserMedia) {
      // Use native camera on iOS or when MediaDevices API is not available
      cameraInputRef.current?.click();
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setShowCamera(true);
      }
    } catch (err) {
      console.error('Camera error:', err);
      // Fallback to input[capture] if camera API fails
      cameraInputRef.current?.click();
    }
  };

  const handleCapture = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(videoRef.current, 0, 0);
      
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' });
          onImageSelect(file);
          
          // Stop camera stream
          const stream = videoRef.current?.srcObject as MediaStream;
          stream?.getTracks().forEach(track => track.stop());
          setShowCamera(false);
        }
      }, 'image/jpeg');
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      {showCamera ? (
        <div className="relative w-full">
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline
            className="w-full h-64 object-cover rounded-lg"
          />
          <div className="absolute bottom-4 left-0 right-0 flex justify-center">
            <button
              onClick={handleCapture}
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-4 shadow-lg"
              disabled={isLoading}
            >
              <Camera className="w-6 h-6" />
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className="relative"
          >
            <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <div className="flex flex-col sm:flex-row items-center gap-6 mb-4">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    disabled={isLoading}
                  >
                    <Upload className="w-5 h-5" />
                    <span>Choose File</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleCameraClick}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    disabled={isLoading}
                  >
                    <Camera className="w-5 h-5" />
                    <span>Take Photo</span>
                  </button>
                </div>
                <p className="text-sm text-gray-500">or drag and drop</p>
                <p className="text-xs text-gray-500 mt-2">PNG, JPG or JPEG (MAX. 10MB)</p>
              </div>
              {/* File selection input - no capture attribute */}
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
                disabled={isLoading}
              />
              {/* Camera input - with capture attribute */}
              <input
                ref={cameraInputRef}
                type="file"
                className="hidden"
                accept="image/*"
                capture="environment"
                onChange={handleCameraChange}
                disabled={isLoading}
              />
            </label>
          </div>
          
          {cameraError && (
            <div className="p-3 bg-red-50 rounded-lg">
              <p className="text-sm text-red-600">{cameraError}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}