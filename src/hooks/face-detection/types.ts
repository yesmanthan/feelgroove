
import { type Mood } from '@/components/MoodSelector';
import { RefObject } from 'react';

export const expressionToMood: Record<string, Mood> = {
  happy: 'happy',
  sad: 'sad',
  angry: 'energetic',
  surprised: 'energetic',
  fearful: 'relaxed',
  disgusted: 'energetic',
  neutral: 'relaxed'
};

export interface UseFaceDetectionProps {
  onMoodDetected: (mood: Mood) => void;
}

export interface UseFaceDetectionReturn {
  videoRef: RefObject<HTMLVideoElement>;
  canvasRef: RefObject<HTMLCanvasElement>;
  isModelLoaded: boolean;
  isModelLoading: boolean;
  isCameraActive: boolean;
  isAnalyzing: boolean;
  cameraError: string | null;
  detectedExpression: string | null;
  modelLoadingError: string;
  startCamera: () => Promise<void>;
  stopCamera: () => void;
  analyzeMood: () => Promise<void>;
  // Removed openModelDownloadLink from the return type
}
