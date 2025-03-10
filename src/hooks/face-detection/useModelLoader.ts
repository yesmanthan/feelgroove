
import { useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as faceapi from '@vladmandic/face-api';
import { toast } from 'sonner';

export const useModelLoader = () => {
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [modelLoadingError, setModelLoadingError] = useState<string | null>(null);

  const loadModels = async () => {
    try {
      setIsModelLoading(true);
      setModelLoadingError(null);
      await tf.ready();
      
      const baseUrl = window.location.origin;
      const MODEL_URL = `${baseUrl}/models`;
      
      console.log('Loading models from:', MODEL_URL);
      
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

  return {
    isModelLoaded,
    isModelLoading,
    modelLoadingError,
    loadModels
  };
};
