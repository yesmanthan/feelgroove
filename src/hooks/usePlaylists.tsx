
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { type Song } from '@/components/MusicPlayer';

type Playlist = {
  id: string;
  name: string;
  description?: string;
  cover_url?: string;
  created_at: string;
  updated_at: string;
  song_count?: number;
};

type PlaylistSong = {
  id: string;
  playlist_id: string;
  song_id: string;
  song_title: string;
  artist: string;
  album?: string;
  cover_url?: string;
  spotify_uri: string;
  position: number;
  added_at: string;
};

export const usePlaylists = () => {
  const queryClient = useQueryClient();
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null);

  // Fetch user playlists
  const { data: playlists, isLoading: isLoadingPlaylists } = useQuery({
    queryKey: ['playlists'],
    queryFn: async () => {
      // First get the playlists
      const { data: playlistsData, error: playlistsError } = await supabase
        .from('playlists')
        .select('*')
        .order('created_at', { ascending: false });

      if (playlistsError) {
        console.error('Error fetching playlists:', playlistsError);
        throw new Error('Failed to fetch playlists');
      }

      // For each playlist, count the songs
      const playlistsWithCounts = await Promise.all(
        playlistsData.map(async (playlist) => {
          const { count, error: countError } = await supabase
            .from('playlist_songs')
            .select('id', { count: 'exact', head: true })
            .eq('playlist_id', playlist.id);

          if (countError) {
            console.error('Error counting songs:', countError);
            return { ...playlist, song_count: 0 };
          }

          return { ...playlist, song_count: count || 0 };
        })
      );

      return playlistsWithCounts as Playlist[];
    },
  });

  // Fetch songs in a playlist
  const { data: playlistSongs, isLoading: isLoadingPlaylistSongs } = useQuery({
    queryKey: ['playlist-songs', selectedPlaylistId],
    queryFn: async () => {
      if (!selectedPlaylistId) return [];

      const { data, error } = await supabase
        .from('playlist_songs')
        .select('*')
        .eq('playlist_id', selectedPlaylistId)
        .order('position', { ascending: true });

      if (error) {
        console.error('Error fetching playlist songs:', error);
        throw new Error('Failed to fetch playlist songs');
      }

      return data as PlaylistSong[];
    },
    enabled: !!selectedPlaylistId,
  });

  // Create a new playlist
  const createPlaylistMutation = useMutation({
    mutationFn: async ({ name, description }: { name: string; description?: string }) => {
      const { data, error } = await supabase
        .from('playlists')
        .insert({
          user_id: (await supabase.auth.getUser()).data.user?.id,
          name,
          description,
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating playlist:', error);
        throw new Error('Failed to create playlist');
      }

      return data as Playlist;
    },
    onSuccess: (data) => {
      toast.success(`Playlist "${data.name}" created`);
      queryClient.invalidateQueries({ queryKey: ['playlists'] });
      return data;
    },
    onError: () => {
      toast.error('Failed to create playlist');
    },
  });

  // Update a playlist
  const updatePlaylistMutation = useMutation({
    mutationFn: async ({
      id,
      name,
      description,
      cover_url,
    }: {
      id: string;
      name?: string;
      description?: string;
      cover_url?: string;
    }) => {
      const { data, error } = await supabase
        .from('playlists')
        .update({
          name,
          description,
          cover_url,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating playlist:', error);
        throw new Error('Failed to update playlist');
      }

      return data;
    },
    onSuccess: () => {
      toast.success('Playlist updated');
      queryClient.invalidateQueries({ queryKey: ['playlists'] });
    },
    onError: () => {
      toast.error('Failed to update playlist');
    },
  });

  // Delete a playlist
  const deletePlaylistMutation = useMutation({
    mutationFn: async (playlistId: string) => {
      const { error } = await supabase.from('playlists').delete().eq('id', playlistId);

      if (error) {
        console.error('Error deleting playlist:', error);
        throw new Error('Failed to delete playlist');
      }

      return playlistId;
    },
    onSuccess: () => {
      toast.success('Playlist deleted');
      queryClient.invalidateQueries({ queryKey: ['playlists'] });
      if (selectedPlaylistId) setSelectedPlaylistId(null);
    },
    onError: () => {
      toast.error('Failed to delete playlist');
    },
  });

  // Add song to a playlist
  const addSongToPlaylistMutation = useMutation({
    mutationFn: async ({
      playlistId,
      song,
      position,
    }: {
      playlistId: string;
      song: Song;
      position?: number;
    }) => {
      // First, get the current highest position if not provided
      let nextPosition = position;
      if (nextPosition === undefined) {
        const { data: positionData, error: positionError } = await supabase
          .from('playlist_songs')
          .select('position')
          .eq('playlist_id', playlistId)
          .order('position', { ascending: false })
          .limit(1);

        if (positionError) {
          console.error('Error getting highest position:', positionError);
          throw new Error('Failed to add song to playlist');
        }

        nextPosition = positionData.length > 0 ? positionData[0].position + 1 : 0;
      }

      // Add the song
      const { data, error } = await supabase
        .from('playlist_songs')
        .insert({
          playlist_id: playlistId,
          song_id: song.id,
          song_title: song.title,
          artist: song.artist,
          album: song.album,
          cover_url: song.coverUrl,
          spotify_uri: song.uri || '',
          position: nextPosition,
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding song to playlist:', error);
        throw new Error('Failed to add song to playlist');
      }

      return data;
    },
    onSuccess: () => {
      toast.success('Song added to playlist');
      queryClient.invalidateQueries({ queryKey: ['playlists'] });
      queryClient.invalidateQueries({ queryKey: ['playlist-songs', selectedPlaylistId] });
    },
    onError: () => {
      toast.error('Failed to add song to playlist');
    },
  });

  // Remove song from a playlist
  const removeSongFromPlaylistMutation = useMutation({
    mutationFn: async ({ playlistId, songId }: { playlistId: string; songId: string }) => {
      const { error } = await supabase
        .from('playlist_songs')
        .delete()
        .eq('playlist_id', playlistId)
        .eq('song_id', songId);

      if (error) {
        console.error('Error removing song from playlist:', error);
        throw new Error('Failed to remove song from playlist');
      }

      return { playlistId, songId };
    },
    onSuccess: () => {
      toast.info('Song removed from playlist');
      queryClient.invalidateQueries({ queryKey: ['playlists'] });
      queryClient.invalidateQueries({ queryKey: ['playlist-songs', selectedPlaylistId] });
    },
    onError: () => {
      toast.error('Failed to remove song from playlist');
    },
  });

  return {
    playlists,
    isLoadingPlaylists,
    selectedPlaylistId,
    setSelectedPlaylistId,
    playlistSongs,
    isLoadingPlaylistSongs,
    createPlaylist: createPlaylistMutation.mutate,
    updatePlaylist: updatePlaylistMutation.mutate,
    deletePlaylist: deletePlaylistMutation.mutate,
    addSongToPlaylist: addSongToPlaylistMutation.mutate,
    removeSongFromPlaylist: removeSongFromPlaylistMutation.mutate,
  };
};
