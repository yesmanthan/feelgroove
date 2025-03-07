
import { useState, useEffect } from 'react';
import { getAccessTokenFromUrl, isTokenExpired, storeToken } from '@/lib/spotify';
import { toast } from 'sonner';

export const useSpotifyAuth = () => {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkForToken = () => {
      try {
        // Check for token in URL hash (after redirect)
        const tokenFromUrl = getAccessTokenFromUrl();
        
        // Check for token in localStorage
        const storedToken = localStorage.getItem('spotify_token');
        const tokenTimestamp = localStorage.getItem('spotify_token_timestamp');
        
        if (tokenFromUrl) {
          console.log('Found token in URL');
          // Store token with timestamp
          storeToken(tokenFromUrl);
          setToken(tokenFromUrl);
          
          // Clear the hash from the URL to avoid exposing the token
          if (window.history.replaceState) {
            window.history.replaceState({}, document.title, window.location.pathname + window.location.search);
          }
          
          toast.success('Successfully connected to Spotify!');
        } else if (storedToken && tokenTimestamp) {
          console.log('Found token in storage');
          
          // Check if token is expired
          if (isTokenExpired(parseInt(tokenTimestamp, 10))) {
            console.log('Token expired, clearing');
            localStorage.removeItem('spotify_token');
            localStorage.removeItem('spotify_token_timestamp');
            setToken(null);
            toast.error('Your Spotify session has expired. Please connect again.');
          } else {
            setToken(storedToken);
          }
        } else {
          console.log('No token found');
        }
      } catch (error) {
        console.error('Error checking for token:', error);
      } finally {
        setLoading(false);
      }
    };
    
    checkForToken();
    
    // Event listener for storage changes (in case user logs in via another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'spotify_token' && e.newValue) {
        setToken(e.newValue);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const logout = () => {
    localStorage.removeItem('spotify_token');
    localStorage.removeItem('spotify_token_timestamp');
    setToken(null);
    toast.info('Logged out from Spotify');
  };

  return { token, loading, logout };
};
