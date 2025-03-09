
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useSpotifyAuth } from './useSpotifyAuth';
import { toast } from 'sonner';
import { type Song } from '@/components/MusicPlayer';

type FavoriteItem = {
  id: string;
  user_id: string;
  song_id: string;
  song_title: string;
  artist: string;
  album?: string;
  cover_url?: string;
  spotify_uri: string;
  added_at: string;
};

export const useFavorites = () => {
  const { token } = useSpotifyAuth();
  const queryClient = useQueryClient();
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());

  // Fetch user favorites with optimized settings
  const { data: favorites, isLoading } = useQuery({
    queryKey: ['favorites'],
    queryFn: async () => {
      console.log('Fetching favorites from Supabase');
      try {
        const { data, error } = await supabase
          .from('favorites')
          .select('*')
          .order('added_at', { ascending: false });

        if (error) {
          console.error('Error fetching favorites:', error);
          throw new Error('Failed to fetch favorites');
        }

        return data as FavoriteItem[];
      } catch (err) {
        console.error('Exception fetching favorites:', err);
        throw err;
      }
    },
    enabled: !!token, // Only run if user is authenticated
    staleTime: 5 * 60 * 1000, // 5 minutes, will be overridden by real-time updates
  });

  // Update favoriteIds set when favorites change
  useEffect(() => {
    if (favorites) {
      setFavoriteIds(new Set(favorites.map(fav => fav.song_id)));
    }
  }, [favorites]);

  // Add song to favorites with improved error handling
  const addToFavoritesMutation = useMutation({
    mutationFn: async (song: Song) => {
      try {
        const userData = await supabase.auth.getUser();
        if (!userData.data.user) {
          throw new Error('User not authenticated');
        }

        const { data, error } = await supabase
          .from('favorites')
          .insert({
            user_id: userData.data.user.id,
            song_id: song.id,
            song_title: song.title,
            artist: song.artist,
            album: song.album,
            cover_url: song.coverUrl,
            spotify_uri: song.uri || '',
          })
          .select()
          .single();

        if (error) {
          console.error('Error adding to favorites:', error);
          throw new Error('Failed to add to favorites');
        }

        return data;
      } catch (err) {
        console.error('Exception adding to favorites:', err);
        throw err;
      }
    },
    onSuccess: () => {
      toast.success('Added to favorites');
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
    onError: () => {
      toast.error('Failed to add to favorites');
    },
  });

  // Remove song from favorites with improved error handling
  const removeFromFavoritesMutation = useMutation({
    mutationFn: async (songId: string) => {
      try {
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('song_id', songId);

        if (error) {
          console.error('Error removing from favorites:', error);
          throw new Error('Failed to remove from favorites');
        }

        return songId;
      } catch (err) {
        console.error('Exception removing from favorites:', err);
        throw err;
      }
    },
    onSuccess: (songId) => {
      toast.info('Removed from favorites');
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
    onError: () => {
      toast.error('Failed to remove from favorites');
    },
  });

  const toggleFavorite = (song: Song) => {
    if (!token) {
      toast.error('Please log in to save favorites');
      return;
    }

    if (favoriteIds.has(song.id)) {
      removeFromFavoritesMutation.mutate(song.id);
    } else {
      addToFavoritesMutation.mutate(song);
    }
  };

  const isFavorite = (songId: string) => favoriteIds.has(songId);

  return {
    favorites,
    isLoading,
    toggleFavorite,
    isFavorite,
    addToFavorites: (song: Song) => addToFavoritesMutation.mutate(song),
    removeFromFavorites: (songId: string) => removeFromFavoritesMutation.mutate(songId),
  };
};
