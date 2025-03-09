
import { useState, useEffect } from 'react';
import { getAccessTokenFromUrl, isTokenExpired, storeToken } from '@/lib/spotify';
import { toast } from 'sonner';

export const useSpotifyAuth = () => {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);

  // Function to fetch user profile
  const fetchUserProfile = async (accessToken: string) => {
    try {
      const response = await fetch('https://api.spotify.com/v1/me', {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch profile: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Fetched user profile:", data);
      setUserProfile(data);
      return data;
    } catch (err) {
      console.error("Error fetching user profile:", err);
      return null;
    }
  };

  useEffect(() => {
    const checkForToken = async () => {
      try {
        setError(null);
        
        // Check for token in URL hash (after redirect)
        const tokenFromUrl = getAccessTokenFromUrl();
        
        // Check for token in localStorage
        const storedToken = localStorage.getItem('spotify_token');
        const tokenTimestamp = localStorage.getItem('spotify_token_timestamp');
        
        console.log("Token check - URL token:", tokenFromUrl ? "present" : "not present");
        console.log("Token check - Stored token:", storedToken ? "present" : "not present");
        
        if (tokenFromUrl) {
          console.log('Found token in URL, storing it');
          // Store token with timestamp
          storeToken(tokenFromUrl);
          setToken(tokenFromUrl);
          
          // Fetch user profile
          await fetchUserProfile(tokenFromUrl);
          
          // Clear the hash from the URL to avoid exposing the token
          if (window.history.replaceState) {
            window.history.replaceState({}, document.title, window.location.pathname + window.location.search);
          }
          
          toast.success('Successfully connected to Spotify!');
        } else if (storedToken && tokenTimestamp) {
          console.log('Found token in storage, checking if expired');
          
          // Check if token is expired
          if (isTokenExpired(parseInt(tokenTimestamp, 10))) {
            console.log('Token expired, clearing');
            localStorage.removeItem('spotify_token');
            localStorage.removeItem('spotify_token_timestamp');
            setToken(null);
            setError('Your Spotify session has expired. Please connect again.');
            toast.error('Your Spotify session has expired. Please connect again.');
          } else {
            console.log('Token valid, using it');
            setToken(storedToken);
            
            // Fetch user profile
            await fetchUserProfile(storedToken);
          }
        } else {
          console.log('No token found');
        }
      } catch (error) {
        console.error('Error checking for token:', error);
        setError('Failed to authenticate with Spotify');
      } finally {
        setLoading(false);
      }
    };
    
    checkForToken();
    
    // Event listener for storage changes (in case user logs in via another tab)
    const handleStorageChange = async (e: StorageEvent) => {
      if (e.key === 'spotify_token' && e.newValue) {
        setToken(e.newValue);
        setError(null);
        await fetchUserProfile(e.newValue);
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
    setUserProfile(null);
    toast.info('Logged out from Spotify');
  };

  return { token, loading, error, userProfile, logout, fetchUserProfile };
};
