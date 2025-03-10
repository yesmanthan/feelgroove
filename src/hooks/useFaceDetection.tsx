
import { useState, useEffect, useRef } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as faceapi from '@vladmandic/face-api';
import { toast } from 'sonner';
import { type Mood } from '@/components/MoodSelector';

// Expression to mood mapping
export const expressionToMood: Record<string, Mood> = {
  happy: 'happy',
  sad: 'sad',
  angry: 'energetic',
  fearful: 'energetic',
  disgusted: 'energetic',
  surprised: 'energetic',
  neutral: 'relaxed',
};

interface UseFaceDetectionProps {
  onMoodDetected: (mood: Mood) => void;
}

interface UseFaceDetectionReturn {
  videoRef: React.RefObject<HTMLVideoElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  isModelLoaded: boolean;
  isModelLoading: boolean;
  isCameraActive: boolean;
  isAnalyzing: boolean;
  cameraError: string | null;
  detectedExpression: string | null;
  modelLoadingError: string | null;
  startCamera: () => Promise<void>;
  stopCamera: () => void;
  analyzeMood: () => Promise<void>;
  openModelDownloadLink: () => void;
}

export const useFaceDetection = ({ onMoodDetected }: UseFaceDetectionProps): UseFaceDetectionReturn => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [detectedExpression, setDetectedExpression] = useState<string | null>(null);
  const [modelLoadingError, setModelLoadingError] = useState<string | null>(null);
  const [isModelLoading, setIsModelLoading] = useState(false);

  // Load face-api models
  useEffect(() => {
    const loadModels = async () => {
      try {
        setIsModelLoading(true);
        setModelLoadingError(null);
        await tf.ready();
        
        // Create absolute URL for models, ensuring they work in any environment
        const baseUrl = window.location.origin;
        const MODEL_URL = `${baseUrl}/models`;
        
        // Log model URL for debugging
        console.log('Loading models from:', MODEL_URL);
        
        // Check if models are accessible
        try {
          const testFetch = await fetch(`${MODEL_URL}/tiny_face_detector_model-weights_manifest.json`);
          if (!testFetch.ok) {
            console.error('Models not accessible (status:', testFetch.status, ')');
            console.error('Response:', await testFetch.text());
            throw new Error(`Models not accessible (status ${testFetch.status})`);
          }
          console.log('Model manifest file found successfully');
        } catch (fetchError) {
          console.error('Error checking model accessibility:', fetchError);
          throw new Error(`Models not accessible: ${fetchError}`);
        }
        
        // Load all required models with better error handling
        try {
          console.log('Loading tinyFaceDetector model...');
          await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
          console.log('TinyFaceDetector model loaded');
          
          console.log('Loading faceLandmark68Net model...');
          await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
          console.log('FaceLandmark68Net model loaded');
          
          console.log('Loading faceRecognitionNet model...');
          await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
          console.log('FaceRecognitionNet model loaded');
          
          console.log('Loading faceExpressionNet model...');
          await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
          console.log('FaceExpressionNet model loaded');
        } catch (modelError) {
          console.error('Error loading specific model:', modelError);
          throw new Error(`Failed to load specific model: ${modelError}`);
        }
        
        setIsModelLoaded(true);
        setIsModelLoading(false);
        console.log('Face detection models loaded successfully');
        toast.success('Face detection models loaded successfully');
      } catch (error) {
        console.error('Error loading models:', error);
        setIsModelLoading(false);
        setModelLoadingError(
          'Failed to load face detection models. Please ensure the model files are available in the /public/models directory.'
        );
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
  }, [isCameraActive]);

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
      
      console.log('Detecting faces and expressions...');
      
      // Detect faces and expressions
      const detections = await faceapi.detectAllFaces(
        videoRef.current, 
        new faceapi.TinyFaceDetectorOptions({ scoreThreshold: 0.5 })
      )
      .withFaceLandmarks()
      .withFaceExpressions();
      
      console.log('Detections:', detections);
      
      if (detections.length === 0) {
        toast.error('No face detected. Please position yourself clearly in front of the camera.');
        setIsAnalyzing(false);
        return;
      }
      
      // Get the primary detection (first face)
      const detection = detections[0];
      
      // Get expression with highest confidence
      const expressions = detection.expressions;
      console.log('Detected expressions:', expressions);
      
      const expressionEntries = Object.entries(expressions);
      const highestExpression = expressionEntries.reduce(
        (prev, current) => (prev[1] > current[1] ? prev : current)
      );
      
      const detectedExpr = highestExpression[0];
      console.log('Highest expression:', detectedExpr, 'with confidence:', highestExpression[1]);
      
      setDetectedExpression(detectedExpr);
      
      // Map expression to mood
      const mappedMood = expressionToMood[detectedExpr] || 'relaxed';
      console.log('Mapped to mood:', mappedMood);
      
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

  // Function to help download models
  const openModelDownloadLink = () => {
    window.open('https://github.com/vladmandic/face-api/tree/master/model', '_blank');
    toast.info('Opening model download page. Download and place files in your public/models directory.');
  };

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
    openModelDownloadLink
  };
};
