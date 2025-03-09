
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useSupabaseRealtime = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    // Enable realtime first
    const enableRealtimeQuery = async () => {
      await supabase.rpc('enable_realtime', { table: 'favorites' });
      await supabase.rpc('enable_realtime', { table: 'playlists' });
      await supabase.rpc('enable_realtime', { table: 'playlist_songs' });
    };
    
    enableRealtimeQuery().catch(console.error);

    // Subscribe to changes in favorites
    const favoritesChannel = supabase
      .channel('public:favorites')
      .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'favorites' }, 
          payload => {
            console.log('Realtime favorites update:', payload);
            // Invalidate the favorites query to fetch fresh data
            queryClient.invalidateQueries({ queryKey: ['favorites'] });
            
            if (payload.eventType === 'INSERT') {
              toast.info('A new favorite was added');
            } else if (payload.eventType === 'DELETE') {
              toast.info('A favorite was removed');
            }
          })
      .subscribe();

    // Subscribe to changes in playlists
    const playlistsChannel = supabase
      .channel('public:playlists')
      .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'playlists' }, 
          payload => {
            console.log('Realtime playlists update:', payload);
            // Invalidate the playlists query
            queryClient.invalidateQueries({ queryKey: ['playlists'] });
            
            if (payload.eventType === 'INSERT') {
              toast.info('A new playlist was created');
            } else if (payload.eventType === 'UPDATE') {
              toast.info('A playlist was updated');
            } else if (payload.eventType === 'DELETE') {
              toast.info('A playlist was deleted');
            }
          })
      .subscribe();

    // Subscribe to changes in playlist songs
    const playlistSongsChannel = supabase
      .channel('public:playlist_songs')
      .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'playlist_songs' }, 
          payload => {
            console.log('Realtime playlist songs update:', payload);
            // Invalidate all playlist-songs queries
            queryClient.invalidateQueries({ queryKey: ['playlist-songs'] });
            
            // Also refresh the playlists to update song counts
            queryClient.invalidateQueries({ queryKey: ['playlists'] });
          })
      .subscribe();

    // Cleanup function to unsubscribe when component unmounts
    return () => {
      supabase.removeChannel(favoritesChannel);
      supabase.removeChannel(playlistsChannel);
      supabase.removeChannel(playlistSongsChannel);
    };
  }, [queryClient]);
};
