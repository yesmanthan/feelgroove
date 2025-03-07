
import { Button } from '@/components/ui/button';
import { getSpotifyAuthUrl } from '@/lib/spotify';
import { toast } from 'sonner';
import { useState } from 'react';
import { AlertTriangle } from 'lucide-react';

const SpotifyLogin = () => {
  const [isAttemptingLogin, setIsAttemptingLogin] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const handleLogin = () => {
    try {
      setIsAttemptingLogin(true);
      setLoginError(null);
      
      // Get the authorization URL
      const authUrl = getSpotifyAuthUrl();
      console.log("Attempting to open Spotify login at:", authUrl);
      
      // Open Spotify login in the same window to avoid popup blockers
      window.location.href = authUrl;
      
      toast.info('Redirecting to Spotify login...');
    } catch (error) {
      console.error('Login error:', error);
      setLoginError('Failed to open Spotify login. Please try again.');
      toast.error('Failed to open Spotify login. Please try again.');
      setIsAttemptingLogin(false);
    }
  };

  return (
    <div className="space-y-4">
      {loginError && (
        <div className="bg-destructive/10 text-destructive rounded-md p-3 text-sm flex items-start">
          <AlertTriangle size={16} className="mr-2 mt-0.5 flex-shrink-0" />
          <span>{loginError}</span>
        </div>
      )}
      
      <Button
        onClick={handleLogin}
        className="bg-[#1DB954] hover:bg-[#1ed760] text-white w-full"
        size="lg"
        disabled={isAttemptingLogin}
      >
        {isAttemptingLogin ? 'Connecting...' : 'Connect with Spotify'}
      </Button>
      
      <p className="text-xs text-center text-muted-foreground">
        This will connect to your Spotify account to personalize music recommendations.
        We don't store your Spotify credentials.
      </p>
    </div>
  );
};

export default SpotifyLogin;
