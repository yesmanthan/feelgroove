
// This file re-exports all Spotify API functions from the new modular structure
// Authentication and general utils
export { 
  getSpotifyAuthUrl,
  getAccessTokenFromUrl,
  verifyState,
  isTokenExpired,
  storeToken,
  BASE_URL,
  CLIENT_ID,
  REDIRECT_URI,
  SCOPES,
  handleResponse,
  getHeaders
} from './spotify/apiUtils';

// Re-export all other Spotify API functions
export * from './spotify/userProfile';
export * from './spotify/player';
export * from './spotify/recommendations';
export * from './spotify/tracks';
export * from './spotify/playlists';
