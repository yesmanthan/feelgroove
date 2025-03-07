
const CLIENT_ID = "76d0297900a7441a8612e9c39395db61";
const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI || "https://feelgroove-generator.lovable.app/";

const SPOTIFY_AUTHORIZE_URL = 'https://accounts.spotify.com/authorize';
const SCOPES = [
  'user-read-private',
  'user-read-email',
  'user-read-playback-state',
  'user-modify-playback-state',
  'user-read-currently-playing',
  'streaming',
  'playlist-read-private',
  'playlist-modify-public',
  'playlist-modify-private'
].join(' ');

export const getSpotifyAuthUrl = () => {
  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    response_type: 'token',
    redirect_uri: REDIRECT_URI,
    scope: SCOPES,
    show_dialog: 'true' // Force the user to approve the app again
  });

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

  return hash.access_token || null;
};
