
import { useRef, useState, useCallback } from 'react';
import { useCameraControls } from './face-detection/useCameraControls';
import { useModelLoader } from './face-detection/useModelLoader';
import { expressionToMood, type UseFaceDetectionProps, type UseFaceDetectionReturn } from './face-detection/types';
import { toast } from 'sonner';
import * as faceapi from '@vladmandic/face-api';

export const useFaceDetection = ({ onMoodDetected }: UseFaceDetectionProps): UseFaceDetectionReturn => {
  // Refs for video and canvas elements
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Face detection state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [detectedExpression, setDetectedExpression] = useState<string | null>(null);
  
  // Custom hooks for camera and model
  const { isModelLoaded, isModelLoading, modelLoadingError, loadModels } = useModelLoader();
  const { isCameraActive, cameraError, startCamera: startCameraStream, stopCamera: stopCameraStream, setIsCameraActive } = useCameraControls();
  
  // Start camera
  const startCamera = async () => {
    // First ensure models are loaded
    if (!isModelLoaded && !isModelLoading) {
      await loadModels();
    }
    
    // Then start camera
    if (isModelLoaded) {
      await startCameraStream(videoRef);
    } else {
      toast.error('Face detection models must be loaded first');
    }
  };
  
  // Stop camera
  const stopCamera = useCallback(() => {
    stopCameraStream(videoRef);
    
    // Clear canvas
    if (canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    }
  }, [stopCameraStream]);
  
  // Analyze mood based on facial expression
  const analyzeMood = async () => {
    if (!videoRef.current || !canvasRef.current || !isModelLoaded) {
      toast.error('Camera must be active and models loaded to analyze mood');
      return;
    }
    
    try {
      setIsAnalyzing(true);
      
      // Detect all faces with their expressions
      const detections = await faceapi.detectAllFaces(
        videoRef.current,
        new faceapi.TinyFaceDetectorOptions()
      ).withFaceLandmarks().withFaceExpressions();
      
      // Process results
      if (detections.length > 0) {
        // Get the primary face
        const detection = detections[0];
        const expressions = detection.expressions;
        
        // Find the dominant expression
        let dominantExpression = 'neutral';
        let maxConfidence = expressions.neutral;
        
        for (const [expression, confidence] of Object.entries(expressions)) {
          if (confidence > maxConfidence) {
            dominantExpression = expression;
            maxConfidence = confidence;
          }
        }
        
        // Set the detected expression
        setDetectedExpression(dominantExpression);
        
        // Draw the detection on the canvas
        const dims = faceapi.matchDimensions(canvasRef.current, videoRef.current);
        const resizedDetections = faceapi.resizeResults(detections, dims);
        
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
          faceapi.draw.drawDetections(canvasRef.current, resizedDetections);
          faceapi.draw.drawFaceLandmarks(canvasRef.current, resizedDetections);
          
          // Display expression text
          resizedDetections.forEach(detection => {
            const { x, y, width } = detection.detection.box;
            ctx.font = '16px Arial';
            ctx.fillStyle = 'red';
            ctx.fillText(
              `${dominantExpression} (${Math.round(maxConfidence * 100)}%)`,
              x, 
              y - 10
            );
          });
        }
        
        // Map the expression to a mood and notify
        const mood = expressionToMood[dominantExpression] || 'relaxed';
        onMoodDetected(mood);
        
        // Show success message
        toast.success(`Detected mood: ${mood}`);
        
        // Stop camera after successful detection
        setTimeout(() => {
          stopCamera();
        }, 1500);
      } else {
        toast.error('No face detected. Please try again in better lighting');
      }
    } catch (error) {
      console.error('Error analyzing facial expression:', error);
      toast.error('Failed to analyze face. Please try again');
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  // We removed the destructured openModelDownloadLink from useModelLoader
  // as it doesn't exist in that hook's return type
  return {
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
    // We're removing openModelDownloadLink from the return type since it doesn't exist
  };
};
