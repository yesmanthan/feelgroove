
import { useState, useEffect } from 'react';
import { getAccessTokenFromUrl } from '@/lib/spotify';

export const useSpotifyAuth = () => {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const tokenFromUrl = getAccessTokenFromUrl();
    const tokenFromStorage = localStorage.getItem('spotify_token');
    
    if (tokenFromUrl) {
      localStorage.setItem('spotify_token', tokenFromUrl);
      setToken(tokenFromUrl);
    } else if (tokenFromStorage) {
      setToken(tokenFromStorage);
    }
    
    setLoading(false);
  }, []);

  const logout = () => {
    localStorage.removeItem('spotify_token');
    setToken(null);
  };

  return { token, loading, logout };
};
