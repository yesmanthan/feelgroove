
import { Button } from '@/components/ui/button';
import { getSpotifyAuthUrl } from '@/lib/spotify';
import { toast } from 'sonner';

const SpotifyLogin = () => {
  const handleLogin = () => {
    try {
      // Open Spotify login in a new tab to avoid CORS issues
      const authWindow = window.open(getSpotifyAuthUrl(), '_blank');
      
      if (!authWindow) {
        toast.error('Pop-up blocked! Please allow pop-ups for this site.');
      } else {
        toast.info('Spotify login opened in a new tab. Please complete the login process there.');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Failed to open Spotify login. Please try again.');
    }
  };

  return (
    <Button
      onClick={handleLogin}
      className="bg-[#1DB954] hover:bg-[#1ed760] text-white"
      size="lg"
    >
      Connect with Spotify
    </Button>
  );
};

export default SpotifyLogin;
