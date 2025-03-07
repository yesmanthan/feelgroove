
import React, { useRef, useState, useEffect } from 'react';
import { Button } from './ui/button';
import { CardGlass } from './ui/card-glass';
import { Camera, X, AlertTriangle } from 'lucide-react';
import { Mood } from './MoodSelector';
import { toast } from 'sonner';

// TensorFlow.js and Face-API models for facial expression recognition
import * as tf from '@tensorflow/tfjs';
import * as faceapi from '@vladmandic/face-api';

interface FaceMoodDetectorProps {
  onMoodDetected: (mood: Mood) => void;
}

const MODEL_URL = '/models';

const FaceMoodDetector: React.FC<FaceMoodDetectorProps> = ({ onMoodDetected }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [detectedExpression, setDetectedExpression] = useState<string | null>(null);
  const [modelLoadingError, setModelLoadingError] = useState<string | null>(null);
  
  // Expression to mood mapping
  const expressionToMood: Record<string, Mood> = {
    happy: 'happy',
    sad: 'sad',
    angry: 'energetic',
    fearful: 'energetic',
    disgusted: 'energetic',
    surprised: 'energetic',
    neutral: 'relaxed',
  };

  // Load face-api models
  useEffect(() => {
    const loadModels = async () => {
      try {
        setModelLoadingError(null);
        await tf.ready();
        
        // Log model URL for debugging
        console.log('Loading models from:', MODEL_URL);
        
        // Load all required models
        const modelLoadPromises = [
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
          faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL)
        ];
        
        await Promise.all(modelLoadPromises);
        
        setIsModelLoaded(true);
        console.log('Face detection models loaded successfully');
        toast.success('Face detection models loaded successfully');
      } catch (error) {
        console.error('Error loading models:', error);
        setModelLoadingError('Failed to load face detection models. Please ensure the model files are available.');
        toast.error('Failed to load face detection models');
      }
    };
    
    loadModels();
    
    // Cleanup function
    return () => {
      if (isCameraActive) {
        stopCamera();
      }
    };
  }, []);

  const startCamera = async () => {
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

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsCameraActive(false);
      setIsAnalyzing(false);
    }
  };

  const analyzeMood = async () => {
    if (!isCameraActive || !isModelLoaded || !videoRef.current || !canvasRef.current) {
      toast.error('Camera or models not ready. Please try again.');
      return;
    }
    
    try {
      setIsAnalyzing(true);
      toast.info('Analyzing your facial expression...');
      
      // Get canvas context for drawing
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      if (!context) return;
      
      // Set canvas dimensions to match video
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      
      // Draw current video frame to canvas
      context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      
      // Detect faces and expressions
      const detections = await faceapi.detectAllFaces(
        videoRef.current, 
        new faceapi.TinyFaceDetectorOptions({ scoreThreshold: 0.5 })
      )
      .withFaceLandmarks()
      .withFaceExpressions();
      
      if (detections.length === 0) {
        toast.error('No face detected. Please position yourself clearly in front of the camera.');
        setIsAnalyzing(false);
        return;
      }
      
      // Get the primary detection (first face)
      const detection = detections[0];
      
      // Get expression with highest confidence
      const expressions = detection.expressions;
      const expressionEntries = Object.entries(expressions);
      const highestExpression = expressionEntries.reduce(
        (prev, current) => (prev[1] > current[1] ? prev : current)
      );
      
      const detectedExpr = highestExpression[0];
      setDetectedExpression(detectedExpr);
      
      // Map expression to mood
      const mappedMood = expressionToMood[detectedExpr] || 'relaxed';
      
      // Draw face detection results
      faceapi.draw.drawDetections(canvas, detections);
      faceapi.draw.drawFaceLandmarks(canvas, detections);
      faceapi.draw.drawFaceExpressions(canvas, detections);
      
      // Emit detected mood after a brief delay to allow user to see the results
      setTimeout(() => {
        onMoodDetected(mappedMood);
        toast.success(`Detected mood: ${mappedMood}`);
        stopCamera();
        setIsAnalyzing(false);
      }, 2000);
      
    } catch (error) {
      console.error('Error analyzing mood:', error);
      toast.error('Failed to analyze mood. Please try again.');
      setIsAnalyzing(false);
    }
  };

  return (
    <CardGlass className="p-4 mb-6">
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold mb-2">Detect Your Mood</h3>
        <p className="text-sm text-muted-foreground">
          Let us analyze your facial expression to recommend music that matches your mood.
        </p>
      </div>
      
      {modelLoadingError && (
        <div className="bg-destructive/10 text-destructive rounded-md p-3 mb-4 flex items-start">
          <AlertTriangle size={18} className="mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium">{modelLoadingError}</p>
            <p className="text-xs mt-1">
              You may need to download the face detection models to the /public/models directory. 
              See the README.md file in that directory for instructions.
            </p>
          </div>
        </div>
      )}
      
      <div className="relative w-full max-w-md mx-auto overflow-hidden rounded-lg mb-4">
        {isCameraActive && (
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
        )}
        
        {!isCameraActive && (
          <div className="bg-black/10 dark:bg-white/5 aspect-video rounded-lg flex items-center justify-center">
            <Camera size={48} className="text-muted-foreground" />
          </div>
        )}
      </div>
      
      {detectedExpression && !isCameraActive && (
        <div className="text-center mb-4">
          <p className="text-sm">
            Detected expression: <span className="font-semibold">{detectedExpression}</span>
          </p>
        </div>
      )}
      
      {cameraError && (
        <div className="text-destructive text-sm text-center mb-4">
          {cameraError}
        </div>
      )}
      
      <div className="flex justify-center gap-4">
        {!isCameraActive ? (
          <Button 
            onClick={startCamera} 
            disabled={!isModelLoaded || isAnalyzing}
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
    </CardGlass>
  );
};

export default FaceMoodDetector;
