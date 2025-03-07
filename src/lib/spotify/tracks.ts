
import { BASE_URL, getHeaders, handleResponse } from './apiUtils';

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
