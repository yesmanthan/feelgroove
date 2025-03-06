
import { type Mood } from '@/components/MoodSelector';

// Interface for mood-specific audio features
interface MoodFeatures {
  energy: number;
  valence: number;
  danceability: number;
  tempo?: number;
  genres: string[];
}

// Hook to map moods to Spotify audio features
export const useMoodMapper = () => {
  // Map mood to Spotify audio features
  const getMoodFeatures = (mood: Mood): MoodFeatures => {
    switch (mood) {
      case 'happy':
        return {
          energy: 0.8,
          valence: 0.8,
          danceability: 0.7,
          genres: ['pop', 'happy', 'dance', 'disco', 'electronic']
        };
      case 'sad':
        return {
          energy: 0.3,
          valence: 0.2,
          danceability: 0.4,
          genres: ['sad', 'piano', 'indie', 'soul', 'blues']
        };
      case 'energetic':
        return {
          energy: 0.9,
          valence: 0.7,
          danceability: 0.9,
          tempo: 130,
          genres: ['rock', 'electronic', 'dance', 'edm', 'house']
        };
      case 'relaxed':
        return {
          energy: 0.3,
          valence: 0.6,
          danceability: 0.3,
          genres: ['ambient', 'chill', 'acoustic', 'sleep', 'indie']
        };
      case 'focused':
        return {
          energy: 0.4,
          valence: 0.5,
          danceability: 0.4,
          genres: ['classical', 'study', 'ambient', 'piano', 'electronic']
        };
      case 'romantic':
        return {
          energy: 0.5,
          valence: 0.6,
          danceability: 0.5,
          genres: ['love', 'r-n-b', 'soul', 'jazz', 'indie']
        };
      default:
        return {
          energy: 0.5,
          valence: 0.5,
          danceability: 0.5,
          genres: ['pop', 'rock', 'indie', 'electronic']
        };
    }
  };

  return { getMoodFeatures };
};
