
import React from 'react';
import { CardGlass } from './ui/card-glass';
import { useFaceDetection } from '@/hooks/useFaceDetection';
import { Mood } from './MoodSelector';
import CameraView from './mood-detector/CameraView';
import ModelStatus from './mood-detector/ModelStatus';
import CameraControls from './mood-detector/CameraControls';

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
    openModelDownloadLink
  } = useFaceDetection({ onMoodDetected });

  return (
    <CardGlass className="p-4 mb-6">
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold mb-2">Detect Your Mood</h3>
        <p className="text-sm text-muted-foreground">
          Let us analyze your facial expression to recommend music that matches your mood.
        </p>
      </div>
      
      {/* Model status section */}
      <ModelStatus 
        modelLoadingError={modelLoadingError}
        isModelLoading={isModelLoading}
        openModelDownloadLink={openModelDownloadLink}
      />
      
      {/* Camera view section */}
      <CameraView 
        videoRef={videoRef}
        canvasRef={canvasRef}
        isCameraActive={isCameraActive}
      />
      
      {/* Detection results display */}
      {detectedExpression && !isCameraActive && (
        <div className="text-center mb-4">
          <p className="text-sm">
            Detected expression: <span className="font-semibold">{detectedExpression}</span>
          </p>
        </div>
      )}
      
      {/* Camera error display */}
      {cameraError && (
        <div className="text-destructive text-sm text-center mb-4">
          {cameraError}
        </div>
      )}
      
      {/* Camera controls section */}
      <CameraControls 
        isCameraActive={isCameraActive}
        isModelLoaded={isModelLoaded}
        isAnalyzing={isAnalyzing}
        isModelLoading={isModelLoading}
        startCamera={startCamera}
        stopCamera={stopCamera}
        analyzeMood={analyzeMood}
      />
    </CardGlass>
  );
};

export default FaceMoodDetector;
