
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { useSpotifyAuth } from '../useSpotifyAuth';
import { useMoodMapper } from '../useMoodMapper';
import { type Mood } from '@/components/MoodSelector';
import { 
  getRecommendations, 
  getAvailableGenres 
} from '@/lib/spotify/recommendations';
import { 
  getRecentlyPlayed
} from '@/lib/spotify/player';
import {
  getSavedTracks
} from '@/lib/spotify/userProfile';
import { 
  transformRecommendations,
  transformRecentlyPlayed
} from '@/lib/spotifyTransform';
import { type Song, type SpotifyRecommendationsState } from './types';

export const useRecommendationsFetcher = () => {
  const { token } = useSpotifyAuth();
  const { getMoodFeatures } = useMoodMapper();
  const [state, setState] = useState<SpotifyRecommendationsState>({
    loading: false,
    recommendations: [],
    recentlyPlayed: [],
    currentSong: null,
    currentSongIndex: -1,
    error: null,
    lastMood: null
  });
  const [availableGenres, setAvailableGenres] = useState<string[]>([]);

  // Fetch available genres when token is available
  useCallback(async () => {
    if (!token) return;
    
    try {
      console.log('Fetching available genres...');
      const response = await getAvailableGenres(token);
      console.log('Available genres:', response.genres);
      setAvailableGenres(response.genres || []);
    } catch (err) {
      console.error('Error fetching available genres:', err);
    }
  }, [token]);

  const fetchRecommendations = useCallback(async (mood: Mood) => {
    if (!token) {
      toast.error('You need to log in with Spotify first');
      return;
    }
    
    setState(prev => ({ ...prev, loading: true, error: null, lastMood: mood }));
    
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
        setState(prev => ({ ...prev, recentlyPlayed: recentTracks }));
        
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
      
      const newState = {
        recommendations: songs,
        currentSong: songs[0],
        currentSongIndex: 0,
        loading: false
      };
      
      setState(prev => ({ ...prev, ...newState }));
      
      toast.success(`Found ${songs.length} songs matching your ${mood} mood`);
      
    } catch (err) {
      console.error('Error fetching recommendations:', err);
      setState(prev => ({
        ...prev,
        loading: false,
        error: err instanceof Error ? err : new Error('Failed to fetch recommendations')
      }));
      toast.error('Failed to fetch recommendations. Please try again.');
    }
  }, [token, getMoodFeatures, availableGenres]);

  const retryLastFetch = useCallback(async () => {
    if (state.lastMood) {
      await fetchRecommendations(state.lastMood);
    } else {
      toast.error('No previous mood to retry. Please select a mood first.');
    }
  }, [fetchRecommendations, state.lastMood]);

  return {
    state,
    setState,
    fetchRecommendations,
    retryLastFetch
  };
};
