// Helper functions to transform Spotify API data into app-friendly formats

// Transform Spotify track object to our Song format
export const transformTrackToSong = (track: any) => {
  if (!track) return null;
  
  return {
    id: track.id,
    title: track.name,
    artist: track.artists.map((artist: any) => artist.name).join(', '),
    album: track.album.name,
    coverUrl: track.album.images[0]?.url || 'https://placehold.co/300x300/1db954/ffffff?text=Music',
    duration: Math.floor(track.duration_ms / 1000),
    uri: track.uri,
    previewUrl: track.preview_url
  };
};

// Transform list of Spotify tracks
export const transformTracks = (tracks: any[]) => {
  if (!tracks || !tracks.length) return [];
  
  return tracks.map(track => transformTrackToSong(track));
};

// Transform recently played items
export const transformRecentlyPlayed = (data: any) => {
  if (!data || !data.items) return [];
  
  return data.items.map((item: any) => {
    const track = item.track;
    return {
      id: track.id,
      title: track.name,
      artist: track.artists.map((artist: any) => artist.name).join(', '),
      album: track.album?.name,
      coverUrl: track.album?.images[0]?.url || '/placeholder.svg',
      duration: track.duration_ms || 0, // Ensure duration is always set
      uri: track.uri,
      previewUrl: track.preview_url,
      playedAt: item.played_at
    };
  });
};

// Transform recommendations response
export const transformRecommendations = (data: any): any[] => {
  if (!data || !data.tracks) return [];
  
  return data.tracks.map((track: any) => ({
    id: track.id,
    title: track.name,
    artist: track.artists.map((artist: any) => artist.name).join(', '),
    album: track.album?.name,
    coverUrl: track.album?.images[0]?.url || '/placeholder.svg',
    duration: track.duration_ms || 0, // Ensure duration is always set
    uri: track.uri,
    previewUrl: track.preview_url
  }));
};

// Format duration in seconds to MM:SS format
export const formatDuration = (ms?: number): string => {
  if (!ms) return '0:00';
  const minutes = Math.floor(ms / 60000);
  const seconds = ((ms % 60000) / 1000).toFixed(0);
  return `${minutes}:${seconds.padStart(2, '0')}`;
};
