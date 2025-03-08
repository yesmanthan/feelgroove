
import { useEffect } from 'react';
import { type Mood } from '@/components/MoodSelector';
import { type Song, type UseRecommendationsResult } from './spotify/types';
import { useRecommendationsFetcher } from './spotify/useRecommendationsFetcher';
import { useSongControls } from './spotify/useSongControls';
import { useSpotifyAuth } from './useSpotifyAuth';

export const useSpotifyRecommendations = (): UseRecommendationsResult => {
  const { token } = useSpotifyAuth();
  const { 
    state, 
    setState, 
    fetchRecommendations, 
    retryLastFetch 
  } = useRecommendationsFetcher();
  
  const { 
    searchSongs, 
    nextSong, 
    previousSong, 
    setCurrentSong 
  } = useSongControls(state, setState);

  // Load available genres when token is available
  useEffect(() => {
    if (token) {
      // This could be moved to the fetcher hook if needed
      console.log('Token available, ready to fetch genres and recommendations');
    }
  }, [token]);

  return {
    loading: state.loading,
    recommendations: state.recommendations,
    recentlyPlayed: state.recentlyPlayed,
    currentSong: state.currentSong,
    error: state.error,
    fetchRecommendations,
    setCurrentSong,
    nextSong,
    previousSong,
    searchSongs,
    retryLastFetch
  };
};
