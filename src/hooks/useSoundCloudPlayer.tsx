
import { useState } from 'react';
import { getSoundCloudStreamUrl } from '@/lib/soundcloud/api';
import { toast } from 'sonner';
import { Song } from '@/components/MusicPlayer';

interface SoundCloudTrack {
  streamId: string;
  trackAuthorization: string;
  title: string;
  artist: string;
  coverUrl: string;
}

export const useSoundCloudPlayer = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<Song | null>(null);
  const [rapidApiKey, setRapidApiKey] = useState(
    localStorage.getItem('soundcloud_api_key') || '88da990a60mshf135c8a428b372ap1f3e67jsn5f9cae09aadc'
  );
  
  const saveRapidApiKey = (key: string) => {
    localStorage.setItem('soundcloud_api_key', key);
    setRapidApiKey(key);
  };
  
  const playTrack = async (track: SoundCloudTrack) => {
    if (!rapidApiKey) {
      toast.error('Please enter your RapidAPI key first');
      return null;
    }
    
    try {
      setIsLoading(true);
      
      if (!track.streamId || !track.trackAuthorization) {
        toast.error('Missing required track information');
        return null;
      }
      
      const streamUrl = await getSoundCloudStreamUrl({
        streamId: track.streamId,
        trackAuthorization: track.trackAuthorization,
        rapidApiKey
      });
      
      if (!streamUrl) {
        toast.error('Could not retrieve stream URL from SoundCloud');
        return null;
      }
      
      const songData: Song = {
        id: track.streamId,
        title: track.title || 'SoundCloud Track',
        artist: track.artist || 'Unknown Artist',
        coverUrl: track.coverUrl || 'https://placehold.co/300x300/ff7700/ffffff?text=SoundCloud',
        duration: 0, // We don't have duration info from the API
        previewUrl: streamUrl
      };
      
      setCurrentTrack(songData);
      toast.success('Track loaded successfully');
      return songData;
    } catch (error) {
      console.error('Error playing SoundCloud track:', error);
      
      if (error instanceof Error) {
        toast.error(`Failed to load track: ${error.message}`);
      } else {
        toast.error('Failed to load track from SoundCloud');
      }
      
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    isLoading,
    currentTrack,
    playTrack,
    rapidApiKey,
    setRapidApiKey: saveRapidApiKey
  };
};

export type { SoundCloudTrack };
