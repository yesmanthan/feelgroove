
import { BASE_URL, getHeaders, handleResponse } from './apiUtils';

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
