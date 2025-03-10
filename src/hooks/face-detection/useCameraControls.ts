
import { useState } from 'react';
import { toast } from 'sonner';

export const useCameraControls = () => {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const startCamera = async (videoRef: React.RefObject<HTMLVideoElement>) => {
    try {
      setCameraError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: "user"
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
        toast.success('Camera started successfully');
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setCameraError('Failed to access camera. Please ensure you have granted camera permissions.');
      toast.error('Failed to access camera');
    }
  };

  const stopCamera = (videoRef: React.RefObject<HTMLVideoElement>) => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsCameraActive(false);
    }
  };

  return {
    isCameraActive,
    cameraError,
    startCamera,
    stopCamera,
    setIsCameraActive
  };
};
