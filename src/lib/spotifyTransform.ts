
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
export const transformRecentlyPlayed = (recentlyPlayed: any) => {
  if (!recentlyPlayed || !recentlyPlayed.items) return [];
  
  return recentlyPlayed.items.map((item: any) => ({
    id: item.track.id,
    title: item.track.name,
    artist: item.track.artists.map((artist: any) => artist.name).join(', '),
    coverUrl: item.track.album.images[0]?.url || 'https://placehold.co/300x300/1db954/ffffff?text=Recent',
    playedAt: item.played_at,
    uri: item.track.uri
  }));
};

// Transform recommendations response
export const transformRecommendations = (recommendations: any) => {
  if (!recommendations || !recommendations.tracks) return [];
  
  return transformTracks(recommendations.tracks);
};

// Format duration in seconds to MM:SS format
export const formatDuration = (durationInSeconds: number): string => {
  const minutes = Math.floor(durationInSeconds / 60);
  const seconds = Math.floor(durationInSeconds % 60);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};
