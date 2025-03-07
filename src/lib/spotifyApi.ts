
// Spotify API service for making requests to the Spotify Web API
import { toast } from "sonner";

const BASE_URL = 'https://api.spotify.com/v1';

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    // Log the error response for debugging
    try {
      const errorData = await response.json();
      console.error('Spotify API error:', errorData);
      
      if (response.status === 401) {
        // Token expired, need to refresh
        localStorage.removeItem('spotify_token');
        localStorage.removeItem('spotify_token_timestamp');
        toast.error('Your session has expired. Please log in again.');
      } else if (response.status === 429) {
        // Rate limiting
        toast.error('Too many requests to Spotify. Please try again later.');
      } else {
        toast.error(errorData.error?.message || 'An error occurred with Spotify');
      }
      
      throw new Error(errorData.error?.message || 'An error occurred');
    } catch (e) {
      console.error('Error parsing error response:', e);
      throw new Error(`HTTP error ${response.status}`);
    }
  }
  return response.json();
};

// Get headers with auth token
const getHeaders = (token: string) => {
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

// Get user profile
export const getUserProfile = async (token: string) => {
  try {
    console.log('Fetching user profile...');
    const response = await fetch(`${BASE_URL}/me`, {
      headers: getHeaders(token),
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

// Get user's playlists
export const getUserPlaylists = async (token: string) => {
  try {
    console.log('Fetching user playlists...');
    const response = await fetch(`${BASE_URL}/me/playlists?limit=50`, {
      headers: getHeaders(token),
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Error fetching playlists:', error);
    throw error;
  }
};

// Get user's recently played tracks
export const getRecentlyPlayed = async (token: string, limit = 20) => {
  try {
    console.log('Fetching recently played tracks...');
    const response = await fetch(`${BASE_URL}/me/player/recently-played?limit=${limit}`, {
      headers: getHeaders(token),
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Error fetching recently played:', error);
    throw error;
  }
};

// Get recommendations based on seed artists, tracks, or genres
export const getRecommendations = async (
  token: string, 
  options: {
    seed_artists?: string[];
    seed_tracks?: string[];
    seed_genres?: string[];
    limit?: number;
    target_energy?: number;
    target_valence?: number;
    target_danceability?: number;
    target_tempo?: number;
  }
) => {
  try {
    const params = new URLSearchParams();
    
    if (options.seed_artists?.length) {
      params.append('seed_artists', options.seed_artists.join(','));
    }
    
    if (options.seed_tracks?.length) {
      params.append('seed_tracks', options.seed_tracks.join(','));
    }
    
    if (options.seed_genres?.length) {
      params.append('seed_genres', options.seed_genres.join(','));
    }
    
    if (options.limit) {
      params.append('limit', options.limit.toString());
    }
    
    // Mood-related parameters
    if (options.target_energy !== undefined) {
      params.append('target_energy', options.target_energy.toString());
    }
    
    if (options.target_valence !== undefined) {
      params.append('target_valence', options.target_valence.toString());
    }
    
    if (options.target_danceability !== undefined) {
      params.append('target_danceability', options.target_danceability.toString());
    }
    
    if (options.target_tempo !== undefined) {
      params.append('target_tempo', options.target_tempo.toString());
    }
    
    console.log('Fetching recommendations with params:', params.toString());
    const response = await fetch(`${BASE_URL}/recommendations?${params.toString()}`, {
      headers: getHeaders(token),
    });
    
    return handleResponse(response);
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    throw error;
  }
};

// Get audio features for a track (tempo, energy, etc.)
export const getAudioFeatures = async (token: string, trackId: string) => {
  try {
    console.log('Fetching audio features for track:', trackId);
    const response = await fetch(`${BASE_URL}/audio-features/${trackId}`, {
      headers: getHeaders(token),
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Error fetching audio features:', error);
    throw error;
  }
};

// Get available genres
export const getAvailableGenres = async (token: string) => {
  try {
    console.log('Fetching available genres...');
    const response = await fetch(`${BASE_URL}/recommendations/available-genre-seeds`, {
      headers: getHeaders(token),
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Error fetching genres:', error);
    throw error;
  }
};

// Search for tracks, artists, or albums
export const search = async (token: string, query: string, type: string = 'track', limit: number = 20) => {
  try {
    const params = new URLSearchParams({
      q: query,
      type,
      limit: limit.toString(),
    });
    
    console.log('Searching for:', query, 'type:', type);
    const response = await fetch(`${BASE_URL}/search?${params.toString()}`, {
      headers: getHeaders(token),
    });
    
    return handleResponse(response);
  } catch (error) {
    console.error('Error searching:', error);
    throw error;
  }
};

// Get a track by ID
export const getTrack = async (token: string, trackId: string) => {
  try {
    console.log('Fetching track:', trackId);
    const response = await fetch(`${BASE_URL}/tracks/${trackId}`, {
      headers: getHeaders(token),
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Error fetching track:', error);
    throw error;
  }
};

// Play a track (requires Spotify Premium)
export const playTrack = async (token: string, uri: string, deviceId?: string) => {
  try {
    const endpoint = deviceId 
      ? `${BASE_URL}/me/player/play?device_id=${deviceId}`
      : `${BASE_URL}/me/player/play`;
      
    console.log('Playing track:', uri, 'on device:', deviceId || 'default');
    const response = await fetch(endpoint, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify({
        uris: [uri],
      }),
    });
    
    if (response.status === 204) {
      return { success: true };
    }
    
    return handleResponse(response);
  } catch (error) {
    console.error('Error playing track:', error);
    throw error;
  }
};

// Get the user's saved tracks
export const getSavedTracks = async (token: string, limit = 20, offset = 0) => {
  try {
    console.log('Fetching saved tracks...');
    const response = await fetch(`${BASE_URL}/me/tracks?limit=${limit}&offset=${offset}`, {
      headers: getHeaders(token),
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Error fetching saved tracks:', error);
    throw error;
  }
};

// Check if tracks are saved in user's library
export const checkSavedTracks = async (token: string, trackIds: string[]) => {
  try {
    console.log('Checking if tracks are saved:', trackIds);
    const response = await fetch(`${BASE_URL}/me/tracks/contains?ids=${trackIds.join(',')}`, {
      headers: getHeaders(token),
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Error checking saved tracks:', error);
    throw error;
  }
};

// Save tracks to user's library
export const saveTracks = async (token: string, trackIds: string[]) => {
  try {
    console.log('Saving tracks:', trackIds);
    const response = await fetch(`${BASE_URL}/me/tracks`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify({ ids: trackIds }),
    });
    
    if (response.status === 200) {
      return { success: true };
    }
    
    return handleResponse(response);
  } catch (error) {
    console.error('Error saving tracks:', error);
    throw error;
  }
};

// Remove tracks from user's library
export const removeTracks = async (token: string, trackIds: string[]) => {
  try {
    console.log('Removing tracks:', trackIds);
    const response = await fetch(`${BASE_URL}/me/tracks`, {
      method: 'DELETE',
      headers: getHeaders(token),
      body: JSON.stringify({ ids: trackIds }),
    });
    
    if (response.status === 200) {
      return { success: true };
    }
    
    return handleResponse(response);
  } catch (error) {
    console.error('Error removing tracks:', error);
    throw error;
  }
};
