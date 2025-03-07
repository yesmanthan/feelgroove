
import React from 'react';
import { Camera } from 'lucide-react';

interface CameraViewProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  isCameraActive: boolean;
}

const CameraView: React.FC<CameraViewProps> = ({ 
  videoRef, 
  canvasRef, 
  isCameraActive 
}) => {
  return (
    <div className="relative w-full max-w-md mx-auto overflow-hidden rounded-lg mb-4">
      {isCameraActive ? (
        <>
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted 
            className="w-full h-full object-cover"
            onLoadedMetadata={() => {
              if (canvasRef.current && videoRef.current) {
                canvasRef.current.width = videoRef.current.videoWidth;
                canvasRef.current.height = videoRef.current.videoHeight;
              }
            }}
          />
          <canvas 
            ref={canvasRef} 
            className="absolute top-0 left-0 w-full h-full object-cover"
          />
        </>
      ) : (
        <div className="bg-black/10 dark:bg-white/5 aspect-video rounded-lg flex items-center justify-center">
          <Camera size={48} className="text-muted-foreground" />
        </div>
      )}
    </div>
  );
};

export default CameraView;
