
import { useState, useEffect } from 'react';
import { useSpotifyAuth } from './useSpotifyAuth';
import { useMoodMapper } from './useMoodMapper';
import { type Mood } from '@/components/MoodSelector';
import { toast } from 'sonner';
import { 
  getRecommendations, 
  getAvailableGenres, 
  getRecentlyPlayed,
  getUserPlaylists
} from '@/lib/spotifyApi';
import { 
  transformRecommendations,
  transformRecentlyPlayed
} from '@/lib/spotifyTransform';
import { type Song } from '@/components/MusicPlayer';

interface UseRecommendationsResult {
  loading: boolean;
  recommendations: Song[];
  recentlyPlayed: any[];
  currentSong: Song | null;
  error: Error | null;
  fetchRecommendations: (mood: Mood) => Promise<void>;
  setCurrentSong: (song: Song) => void;
  nextSong: () => void;
  previousSong: () => void;
}

export const useSpotifyRecommendations = (): UseRecommendationsResult => {
  const { token } = useSpotifyAuth();
  const { getMoodFeatures } = useMoodMapper();
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<Song[]>([]);
  const [recentlyPlayed, setRecentlyPlayed] = useState<any[]>([]);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [currentSongIndex, setCurrentSongIndex] = useState<number>(-1);
  const [error, setError] = useState<Error | null>(null);
  const [availableGenres, setAvailableGenres] = useState<string[]>([]);

  // Fetch available genres on mount
  useEffect(() => {
    const fetchGenres = async () => {
      if (!token) return;
      
      try {
        const response = await getAvailableGenres(token);
        setAvailableGenres(response.genres || []);
      } catch (err) {
        console.error('Error fetching available genres:', err);
      }
    };
    
    fetchGenres();
  }, [token]);

  // Fetch recommendations based on mood
  const fetchRecommendations = async (mood: Mood) => {
    if (!token) {
      toast.error('You need to log in with Spotify first');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Get mood-specific audio features
      const moodFeatures = getMoodFeatures(mood);
      
      // Filter genres to only include available ones from Spotify
      const filteredGenres = moodFeatures.genres.filter(
        genre => availableGenres.includes(genre)
      ).slice(0, 2); // Spotify allows max 5 seed values in total
      
      // Fetch recently played for potential seed tracks
      const recentResponse = await getRecentlyPlayed(token, 10);
      const recentTracks = transformRecentlyPlayed(recentResponse);
      setRecentlyPlayed(recentTracks);
      
      // Get first track ID for seed if available
      const seedTrack = recentTracks[0]?.id;
      
      // Request recommendations
      const recommendationsResponse = await getRecommendations(token, {
        seed_genres: filteredGenres,
        seed_tracks: seedTrack ? [seedTrack] : undefined,
        limit: 20,
        target_energy: moodFeatures.energy,
        target_valence: moodFeatures.valence,
        target_danceability: moodFeatures.danceability,
        target_tempo: moodFeatures.tempo
      });
      
      // Transform response to our Song format
      const songs = transformRecommendations(recommendationsResponse);
      
      setRecommendations(songs);
      
      // Set current song to first recommendation if we have any
      if (songs.length > 0) {
        setCurrentSong(songs[0]);
        setCurrentSongIndex(0);
      }
      
    } catch (err) {
      console.error('Error fetching recommendations:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch recommendations'));
      toast.error('Failed to fetch recommendations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle song navigation
  const nextSong = () => {
    if (recommendations.length === 0 || currentSongIndex === -1) return;
    
    const nextIndex = (currentSongIndex + 1) % recommendations.length;
    setCurrentSong(recommendations[nextIndex]);
    setCurrentSongIndex(nextIndex);
  };
  
  const previousSong = () => {
    if (recommendations.length === 0 || currentSongIndex === -1) return;
    
    const prevIndex = (currentSongIndex - 1 + recommendations.length) % recommendations.length;
    setCurrentSong(recommendations[prevIndex]);
    setCurrentSongIndex(prevIndex);
  };
  
  // Set current song and update index
  const setCurrentSongAndIndex = (song: Song) => {
    setCurrentSong(song);
    const index = recommendations.findIndex(s => s.id === song.id);
    if (index !== -1) {
      setCurrentSongIndex(index);
    }
  };

  return {
    loading,
    recommendations,
    recentlyPlayed,
    currentSong,
    error,
    fetchRecommendations,
    setCurrentSong: setCurrentSongAndIndex,
    nextSong,
    previousSong
  };
};
