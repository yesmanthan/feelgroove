
import { BASE_URL, getHeaders, handleResponse } from './apiUtils';

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
