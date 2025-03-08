
import { useCallback } from 'react';
import { toast } from 'sonner';
import { search } from '@/lib/spotify/tracks';
import { transformRecommendations } from '@/lib/spotifyTransform';
import { type Song, type SpotifyRecommendationsState } from './types';
import { useSpotifyAuth } from '../useSpotifyAuth';

export const useSongControls = (
  state: SpotifyRecommendationsState,
  setState: React.Dispatch<React.SetStateAction<SpotifyRecommendationsState>>
) => {
  const { token } = useSpotifyAuth();
  
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
      const songs = transformRecommendations(response);
      
      // Ensure all songs have a duration value (default to 0 if missing)
      return songs.map(song => ({
        ...song,
        duration: song.duration || 0
      }));
    } catch (err) {
      console.error('Error searching songs:', err);
      toast.error('Failed to search songs. Please try again.');
      return [];
    }
  };

  const nextSong = useCallback(() => {
    const { recommendations, currentSongIndex } = state;
    if (recommendations.length === 0 || currentSongIndex === -1) return;
    
    const nextIndex = (currentSongIndex + 1) % recommendations.length;
    setState(prev => ({
      ...prev,
      currentSong: recommendations[nextIndex],
      currentSongIndex: nextIndex
    }));
  }, [state, setState]);
  
  const previousSong = useCallback(() => {
    const { recommendations, currentSongIndex } = state;
    if (recommendations.length === 0 || currentSongIndex === -1) return;
    
    const prevIndex = (currentSongIndex - 1 + recommendations.length) % recommendations.length;
    setState(prev => ({
      ...prev,
      currentSong: recommendations[prevIndex],
      currentSongIndex: prevIndex
    }));
  }, [state, setState]);
  
  const setCurrentSong = useCallback((song: Song) => {
    const index = state.recommendations.findIndex(s => s.id === song.id);
    setState(prev => ({
      ...prev,
      currentSong: song,
      currentSongIndex: index !== -1 ? index : prev.currentSongIndex
    }));
  }, [state.recommendations, setState]);

  return {
    searchSongs,
    nextSong,
    previousSong,
    setCurrentSong
  };
};
