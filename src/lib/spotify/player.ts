
import { BASE_URL, getHeaders, handleResponse } from './apiUtils';

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
