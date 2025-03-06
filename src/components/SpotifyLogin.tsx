
import { Button } from '@/components/ui/button';
import { getSpotifyAuthUrl } from '@/lib/spotify';

const SpotifyLogin = () => {
  const handleLogin = () => {
    window.location.href = getSpotifyAuthUrl();
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
