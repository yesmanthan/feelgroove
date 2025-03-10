
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

export interface UseFaceDetectionProps {
  onMoodDetected: (mood: Mood) => void;
}

export interface UseFaceDetectionReturn {
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
