
import React from 'react';
import { Button } from '@/components/ui/button';
import { Camera, X } from 'lucide-react';

interface CameraControlsProps {
  isCameraActive: boolean;
  isModelLoaded: boolean;
  isAnalyzing: boolean;
  isModelLoading: boolean;
  startCamera: () => Promise<void>;
  stopCamera: () => void;
  analyzeMood: () => Promise<void>;
}

const CameraControls: React.FC<CameraControlsProps> = ({
  isCameraActive,
  isModelLoaded,
  isAnalyzing,
  isModelLoading,
  startCamera,
  stopCamera,
  analyzeMood
}) => {
  return (
    <div className="flex justify-center gap-4">
      {!isCameraActive ? (
        <Button 
          onClick={startCamera} 
          disabled={!isModelLoaded || isAnalyzing || isModelLoading}
          className="flex items-center gap-2"
        >
          <Camera size={16} />
          Start Camera
        </Button>
      ) : (
        <>
          <Button 
            onClick={analyzeMood} 
            disabled={isAnalyzing}
            className="flex items-center gap-2"
          >
            {isAnalyzing ? 'Analyzing...' : 'Detect Mood'}
          </Button>
          
          <Button 
            variant="outline" 
            onClick={stopCamera} 
            className="flex items-center gap-2"
          >
            <X size={16} />
            Cancel
          </Button>
        </>
      )}
    </div>
  );
};

export default CameraControls;
