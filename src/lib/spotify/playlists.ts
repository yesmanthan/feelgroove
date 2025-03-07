
import { BASE_URL, getHeaders, handleResponse } from './apiUtils';

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
