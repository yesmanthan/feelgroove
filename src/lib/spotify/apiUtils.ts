
import { toast } from "sonner";

export const BASE_URL = 'https://api.spotify.com/v1';

// Helper function to handle API responses
export const handleResponse = async (response: Response) => {
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
export const getHeaders = (token: string) => {
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};
