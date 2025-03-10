
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useSupabaseRealtime = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    // Enable realtime first - fixed the parameter name to match function definition
    const enableRealtimeQuery = async () => {
      try {
        await supabase.rpc('enable_realtime', { table_name: 'favorites' });
        await supabase.rpc('enable_realtime', { table_name: 'playlists' });
        await supabase.rpc('enable_realtime', { table_name: 'playlist_songs' });
        console.log('Realtime enabled for tables');
      } catch (error) {
        console.error('Error enabling realtime:', error);
      }
    };
    
    enableRealtimeQuery();

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
      .subscribe((status) => {
        console.log('Favorites subscription status:', status);
      });

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
      .subscribe((status) => {
        console.log('Playlists subscription status:', status);
      });

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
      .subscribe((status) => {
        console.log('Playlist songs subscription status:', status);
      });

    // Add a special channel for user session updates
    const userSessionChannel = supabase
      .channel('user_sessions')
      .on('presence', { event: 'sync' }, () => {
        console.log('User sessions synced:', userSessionChannel.presenceState());
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        console.log('User joined:', key, newPresences);
        toast.info('Another user joined the session');
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        console.log('User left:', key, leftPresences);
        toast.info('A user left the session');
      })
      .subscribe();

    // Track current user's presence
    const trackUserPresence = async () => {
      try {
        const { data: userData } = await supabase.auth.getUser();
        if (userData?.user) {
          await userSessionChannel.track({
            user_id: userData.user.id,
            online_at: new Date().toISOString()
          });
          console.log('Tracking user presence:', userData.user.id);
        }
      } catch (error) {
        console.error('Error tracking user presence:', error);
      }
    };
    
    trackUserPresence();

    // Cleanup function to unsubscribe when component unmounts
    return () => {
      console.log('Cleaning up realtime subscriptions');
      supabase.removeChannel(favoritesChannel);
      supabase.removeChannel(playlistsChannel);
      supabase.removeChannel(playlistSongsChannel);
      supabase.removeChannel(userSessionChannel);
    };
  }, [queryClient]);
};
