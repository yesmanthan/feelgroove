
import React, { useEffect } from 'react';
import { useFaceDetection } from '@/hooks/useFaceDetection';
import { type Mood } from './MoodSelector';
import { CardGlass, CardGlassContent, CardGlassHeader, CardGlassTitle } from './ui/card-glass';
import { Button } from './ui/button';
import CameraView from './mood-detector/CameraView';
import CameraControls from './mood-detector/CameraControls';
import ModelStatus from './mood-detector/ModelStatus';

interface FaceMoodDetectorProps {
  onMoodDetected: (mood: Mood) => void;
}

const FaceMoodDetector: React.FC<FaceMoodDetectorProps> = ({ onMoodDetected }) => {
  const { 
    videoRef, 
    canvasRef,
    isModelLoaded,
    isModelLoading,
    isCameraActive,
    isAnalyzing,
    cameraError,
    detectedExpression,
    modelLoadingError,
    startCamera,
    stopCamera,
    analyzeMood,
    // We're not using openModelDownloadLink because it doesn't exist
  } = useFaceDetection({ onMoodDetected });
  
  // Clean up camera when component unmounts
  useEffect(() => {
    return () => {
      if (isCameraActive) {
        stopCamera();
      }
    };
  }, [isCameraActive, stopCamera]);
  
  return (
    <CardGlass className="w-full">
      <CardGlassHeader>
        <CardGlassTitle>Mood Detection</CardGlassTitle>
      </CardGlassHeader>
      
      <CardGlassContent>
        <ModelStatus 
          isModelLoaded={isModelLoaded} 
          isModelLoading={isModelLoading} 
          error={modelLoadingError} 
        />
        
        <CameraView 
          videoRef={videoRef} 
          canvasRef={canvasRef} 
          isCameraActive={isCameraActive}
          isAnalyzing={isAnalyzing}
          detectedExpression={detectedExpression}
        />
        
        {cameraError && (
          <div className="p-4 mb-4 bg-destructive/20 text-destructive rounded-md">
            <p>{cameraError}</p>
          </div>
        )}
        
        <CameraControls
          isCameraActive={isCameraActive}
          isModelLoaded={isModelLoaded}
          isAnalyzing={isAnalyzing}
          onStartCamera={startCamera}
          onStopCamera={stopCamera}
          onAnalyzeMood={analyzeMood}
        />
        
        <div className="mt-4 flex justify-end">
          <Button 
            variant="outline" 
            onClick={() => onMoodDetected('relaxed')}
          >
            Cancel
          </Button>
        </div>
      </CardGlassContent>
    </CardGlass>
  );
};

export default FaceMoodDetector;
