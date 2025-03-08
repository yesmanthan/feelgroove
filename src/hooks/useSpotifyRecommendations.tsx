
import { useState, useEffect, useCallback } from 'react';
import { useSpotifyAuth } from './useSpotifyAuth';
import { useMoodMapper } from './useMoodMapper';
import { type Mood } from '@/components/MoodSelector';
import { toast } from 'sonner';
import { 
  getRecommendations, 
  getAvailableGenres 
} from '@/lib/spotify/recommendations';
import { 
  search
} from '@/lib/spotify/tracks';
import {
  getRecentlyPlayed
} from '@/lib/spotify/player';
import {
  getSavedTracks
} from '@/lib/spotify/userProfile';
import { 
  getUserPlaylists 
} from '@/lib/spotify/playlists';
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
  searchSongs: (query: string) => Promise<Song[]>;
  retryLastFetch: () => Promise<void>;
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
  const [lastMood, setLastMood] = useState<Mood | null>(null);

  // Fetch available genres when token is available
  useEffect(() => {
    const fetchGenres = async () => {
      if (!token) return;
      
      try {
        console.log('Fetching available genres...');
        const response = await getAvailableGenres(token);
        console.log('Available genres:', response.genres);
        setAvailableGenres(response.genres || []);
      } catch (err) {
        console.error('Error fetching available genres:', err);
      }
    };
    
    fetchGenres();
  }, [token]);

  const fetchRecommendations = useCallback(async (mood: Mood) => {
    if (!token) {
      toast.error('You need to log in with Spotify first');
      return;
    }
    
    setLoading(true);
    setError(null);
    setLastMood(mood);
    
    try {
      console.log('Fetching recommendations for mood:', mood);
      const moodFeatures = getMoodFeatures(mood);
      console.log('Mood features:', moodFeatures);
      
      // Filter out unavailable genres
      const filteredGenres = moodFeatures.genres.filter(
        genre => availableGenres.includes(genre)
      ).slice(0, 2);
      
      if (filteredGenres.length === 0) {
        console.log('No matching genres found, using default genres');
        // If no filtered genres, use some defaults that are likely to be available
        filteredGenres.push('pop', 'rock');
      }
      
      console.log('Using genres:', filteredGenres);
      
      // Try to get recently played for seed tracks
      let seedTrack;
      try {
        const recentResponse = await getRecentlyPlayed(token, 10);
        const recentTracks = transformRecentlyPlayed(recentResponse);
        setRecentlyPlayed(recentTracks);
        
        if (recentTracks.length > 0) {
          seedTrack = recentTracks[0]?.id;
          console.log('Using seed track from recently played:', seedTrack);
        }
      } catch (recentError) {
        console.error('Error fetching recently played (continuing anyway):', recentError);
      }
      
      // If no recently played, try to get saved tracks
      if (!seedTrack) {
        try {
          const savedResponse = await getSavedTracks(token, 5);
          if (savedResponse.items && savedResponse.items.length > 0) {
            seedTrack = savedResponse.items[0].track.id;
            console.log('Using seed track from saved tracks:', seedTrack);
          }
        } catch (savedError) {
          console.error('Error fetching saved tracks (continuing anyway):', savedError);
        }
      }
      
      // Get recommendations
      const recommendationsResponse = await getRecommendations(token, {
        seed_genres: filteredGenres,
        seed_tracks: seedTrack ? [seedTrack] : undefined,
        limit: 20,
        target_energy: moodFeatures.energy,
        target_valence: moodFeatures.valence,
        target_danceability: moodFeatures.danceability,
        target_tempo: moodFeatures.tempo
      });
      
      const songs = transformRecommendations(recommendationsResponse);
      console.log('Received recommendations:', songs.length);
      
      if (songs.length === 0) {
        throw new Error('No recommendations returned from Spotify');
      }
      
      setRecommendations(songs);
      
      if (songs.length > 0) {
        setCurrentSong(songs[0]);
        setCurrentSongIndex(0);
      }
      
      toast.success(`Found ${songs.length} songs matching your ${mood} mood`);
      
    } catch (err) {
      console.error('Error fetching recommendations:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch recommendations'));
      toast.error('Failed to fetch recommendations. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [token, getMoodFeatures, availableGenres]);

  const retryLastFetch = useCallback(async () => {
    if (lastMood) {
      await fetchRecommendations(lastMood);
    } else {
      toast.error('No previous mood to retry. Please select a mood first.');
    }
  }, [fetchRecommendations, lastMood]);

  const searchSongs = async (query: string): Promise<Song[]> => {
    if (!token) {
      toast.error('You need to log in with Spotify first');
      return [];
    }
    
    if (!query.trim()) {
      return [];
    }
    
    try {
      console.log('Searching for:', query);
      const response = await search(token, query, 'track', 20);
      return transformRecommendations(response);
    } catch (err) {
      console.error('Error searching songs:', err);
      toast.error('Failed to search songs. Please try again.');
      return [];
    }
  };

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
    previousSong,
    searchSongs,
    retryLastFetch
  };
};
