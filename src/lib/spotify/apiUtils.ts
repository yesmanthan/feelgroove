
import { toast } from "sonner";

export const BASE_URL = 'https://api.spotify.com/v1';
export const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID || "76d0297900a7441a8612e9c39395db61";
export const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI || "https://feelgroove-generator.lovable.app/";

const SPOTIFY_AUTHORIZE_URL = 'https://accounts.spotify.com/authorize';
export const SCOPES = [
  'user-read-private',
  'user-read-email',
  'user-read-playback-state',
  'user-modify-playback-state',
  'user-read-currently-playing',
  'streaming',
  'playlist-read-private',
  'user-read-recently-played',
  'user-library-read',
  'user-top-read'
].join(' ');

// Generate a random state value for CSRF protection
const generateRandomState = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// Store the state in localStorage for verification later
const storeState = (state: string) => {
  localStorage.setItem('spotify_auth_state', state);
};

// Verify the state returned from Spotify matches our stored state
export const verifyState = (state: string): boolean => {
  const storedState = localStorage.getItem('spotify_auth_state');
  if (state && storedState === state) {
    localStorage.removeItem('spotify_auth_state'); // Clean up
    return true;
  }
  return false;
};

export const getSpotifyAuthUrl = () => {
  const state = generateRandomState();
  storeState(state);

  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    response_type: 'token',
    redirect_uri: REDIRECT_URI,
    scope: SCOPES,
    state: state,
    show_dialog: 'true' // Force the user to approve the app again
  });

  console.log("Spotify Auth URL:", `${SPOTIFY_AUTHORIZE_URL}?${params.toString()}`);
  return `${SPOTIFY_AUTHORIZE_URL}?${params.toString()}`;
};

export const getAccessTokenFromUrl = (): string | null => {
  const hash = window.location.hash
    .substring(1)
    .split('&')
    .reduce((initial: { [key: string]: string }, item) => {
      const parts = item.split('=');
      initial[parts[0]] = decodeURIComponent(parts[1]);
      return initial;
    }, {});

  // Verify state to prevent CSRF attacks
  if (hash.state && !verifyState(hash.state)) {
    console.error('State verification failed');
    return null;
  }

  return hash.access_token || null;
};

// Check if the token is expired (Spotify tokens last for 1 hour)
export const isTokenExpired = (timestamp: number): boolean => {
  const now = Date.now();
  const hourInMs = 3600 * 1000;
  return now - timestamp > hourInMs;
};

// Store token with timestamp
export const storeToken = (token: string): void => {
  localStorage.setItem('spotify_token', token);
  localStorage.setItem('spotify_token_timestamp', Date.now().toString());
  
  // Try to notify the opener if this is a popup window
  if (window.opener && window.opener.postMessage) {
    window.opener.postMessage(
      { type: 'SPOTIFY_AUTH_SUCCESS', token },
      window.location.origin
    );
  }
};

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
